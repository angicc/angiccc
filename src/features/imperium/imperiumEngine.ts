// ─── CHRONOS IMPERIUM · Turn Orchestrator ─────────────────────────────────────
// Glues the strategic graph (Part A), the combat matrix (Part B) and the
// crisis generator (Part C) into one deterministic turn pipeline:
//
//   ORDERS → enemy AI orders → marches advance → contacts resolve as battles
//   → territory flips → logistics sweep (supply/attrition) → crisis sweep →
//   snapshot appended to the time-travel log.
//
// Every turn is a pure function of (state, orders, seed); the snapshot ring
// is what Part D serializes to the server and what rollback restores from.
import { buildGeoGraph, type GeoGraph } from './geoGraph';
import {
  type Army, type FactionId, type OwnershipState, orderMarch, advanceMarch, runLogisticsTick,
} from './logistics';
import {
  resolveBattle, seededRng, ROSTERS, LEADERS, type Tactic, type Weather,
  type BattleResolution, type LeaderProfile,
} from './combatMatrix';
import { sweepForCrises, crisisResolved, type CrisisEvent, type CrisisEffects } from './crisisGenerator';
import { provincesFor, theatreSpec, THEATRE_SPECS, type TheatreId } from './imperiumProvinces';
import { rivalOrderMap, aggressionFor } from './rivalStrategy';

export type Era = 'ancient' | 'medieval' | 'early-modern' | 'modern';
export type { TheatreId };

export interface CampaignSnapshot {
  turn: number;
  ownership: OwnershipState;
  armies: Army[];
  capitals: Record<FactionId, string | undefined>;
  treasury: number;
  discipline: number;              // realm-wide morale resilience modifier
  supplyCostMultiplier: number;
  weather: Weather;
  activeCrises: CrisisEvent[];
  /** Localized-key log lines: { key, params } resolved at render. */
  log: { turn: number; key: string; params?: Record<string, string | number> }[];
  recentDefeats: number;
  over: boolean;
  playerWon: boolean;
}

export interface CampaignState {
  id: string;
  /** Curated theatre this campaign is fought over. */
  theatre: TheatreId;
  era: Era;
  seed: number;
  playerRosterId: string;
  rivalRosterId: string;
  playerLeader: LeaderProfile;
  rivalLeader: LeaderProfile;
  current: CampaignSnapshot;
  /** Time-travel ring: one snapshot per completed turn (client copy). */
  snapshots: CampaignSnapshot[];
}

export interface TurnOrders {
  /** armyId → target territory for a march order. */
  marches: Record<string, string>;
  /** Pending battle tactic choices keyed by battle id (resolved this turn). */
  tactic: Tactic;
  /** Player answers to open crises: crisisId → optionId. */
  crisisChoices: Record<string, string>;
}

export interface PendingBattle {
  id: string;
  attackerArmyId: string;
  defenderArmyId: string | null;   // null = garrison
  territoryId: string;
  lat: number;
  lng: number;
}

export interface TurnResult {
  state: CampaignState;
  battles: { pending: PendingBattle; resolution: BattleResolution }[];
  newCrises: CrisisEvent[];
}

const WEATHER_TABLE: Weather[] = ['clear', 'clear', 'clear', 'rain', 'heat', 'storm', 'clear', 'snow'];

// ── Campaign creation ─────────────────────────────────────────────────────────

const GRAPH_CACHE = new Map<TheatreId, GeoGraph>();
export function graphFor(theatre: TheatreId): GeoGraph {
  let g = GRAPH_CACHE.get(theatre);
  if (!g) { g = buildGeoGraph({ provinces: provincesFor(theatre) }); GRAPH_CACHE.set(theatre, g); }
  return g;
}

export function createCampaign(theatre: TheatreId, seed = Date.now() & 0xffff): CampaignState {
  const rng = seededRng(seed);
  const spec = theatreSpec(theatre);
  const era = spec.era;
  const graph = graphFor(theatre);
  if (graph.territoryIds.length < 2) throw new Error(`Theatre ${theatre} has too few territories`);

  // Curated starting ownership: the spec assigns each faction its historical
  // bloc; anything unlisted starts neutral (free to occupy unopposed).
  const owners: Record<string, FactionId> = {};
  for (const t of spec.playerProvinces) owners[t] = 'player';
  for (const t of spec.rivalProvinces) owners[t] = 'rival';

  const playerCapital = spec.playerProvinces[0];
  const rivalCapital = spec.rivalProvinces[0];
  const ownership: OwnershipState = {
    owners,
    hubs: { player: [playerCapital], rival: [rivalCapital] },
  };

  const mkArmy = (faction: FactionId, territoryId: string, i: number): Army => ({
    id: `${faction}-army-${i}`,
    faction, territoryId,
    strength: 100, morale: 100,
    supplied: true, isolationTicks: 0,
  });
  const armies: Army[] = [
    mkArmy('player', playerCapital, 1),
    mkArmy('player', spec.playerProvinces[1] ?? playerCapital, 2),
    mkArmy('rival', rivalCapital, 1),
    mkArmy('rival', spec.rivalProvinces[1] ?? rivalCapital, 2),
  ];

  const leaders = [...LEADERS];
  const playerLeader = leaders[Math.floor(rng() * leaders.length)];
  const rivalLeader = leaders.filter(l => l.id !== playerLeader.id)[Math.floor(rng() * (leaders.length - 1))];

  // Two DISTINCT era-authentic rosters face off (Roman Legions vs Persian
  // Host, Crusader Host vs Mongol Tumen…) — the matchup is part of the seed.
  const eraRosters = ROSTERS.filter(r => r.era === era);
  const playerRoster = eraRosters[Math.floor(rng() * eraRosters.length)];
  const rivalPool = eraRosters.filter(r => r.id !== playerRoster.id);
  const rivalRoster = rivalPool.length > 0 ? rivalPool[Math.floor(rng() * rivalPool.length)] : playerRoster;

  const current: CampaignSnapshot = {
    turn: 0,
    ownership,
    armies,
    capitals: { player: playerCapital, rival: rivalCapital },
    treasury: 100,
    discipline: 0,
    supplyCostMultiplier: 1,
    weather: 'clear',
    activeCrises: [],
    log: [{ turn: 0, key: 'imp_enemy_moves' }],
    recentDefeats: 0,
    over: false,
    playerWon: false,
  };

  return {
    id: `imperium-${theatre}-${seed.toString(36)}`,
    theatre, era, seed,
    playerRosterId: playerRoster.id,
    rivalRosterId: rivalRoster.id,
    playerLeader, rivalLeader,
    current,
    snapshots: [structuredClone(current)],
  };
}

// ── Enemy strategic AI ────────────────────────────────────────────────────────
// The doctrine lives in rivalStrategy.ts, which scores every (army, target)
// pair on odds, distance, isolation and capital value, withdraws broken armies
// and concentrates force. This is the adapter onto the snapshot shape.

function rivalOrders(state: CampaignState, graph: GeoGraph, rng: () => number): Record<string, string> {
  const snap = state.current;
  const owners = snap.ownership.owners as Record<string, FactionId>;
  const provinces = Object.keys(owners);
  const rivalCount = provinces.filter(t => owners[t] === 'rival').length;

  return rivalOrderMap({
    owners,
    armies: snap.armies.map(a => ({
      id: a.id, faction: a.faction, territoryId: a.territoryId,
      strength: a.strength, morale: a.morale, supplied: a.supplied,
      march: a.march ? { targetTerritoryId: a.march.targetTerritoryId } : null,
    })),
    playerCapital: snap.capitals.player,
    rivalCapital: snap.capitals.rival,
    graph,
    aggression: aggressionFor(snap.turn, rivalCount, provinces.length),
    rng,
  });
}

// ── The turn pipeline ─────────────────────────────────────────────────────────

export function resolveTurn(state: CampaignState, orders: TurnOrders): TurnResult {
  const graph = graphFor(state.theatre);
  const turn = state.current.turn + 1;
  const rng = seededRng(state.seed ^ (turn * 7919));
  let snap: CampaignSnapshot = structuredClone(state.current);
  snap.turn = turn;
  snap.weather = WEATHER_TABLE[Math.floor(rng() * WEATHER_TABLE.length)];
  snap.log = [...snap.log];

  // 0. Apply crisis choices (before anything else moves).
  for (const [crisisId, optionId] of Object.entries(orders.crisisChoices)) {
    const crisis = snap.activeCrises.find(c => c.id === crisisId);
    const option = crisis?.options.find(o => o.id === optionId);
    if (!crisis || !option) continue;
    applyEffects(snap, option.effects, graph);
    snap.activeCrises = snap.activeCrises.filter(c => c.id !== crisisId);
  }

  // 1. Issue player marches.
  for (const [armyId, target] of Object.entries(orders.marches)) {
    const idx = snap.armies.findIndex(a => a.id === armyId && a.faction === 'player');
    if (idx < 0) continue;
    const ordered = orderMarch(graph, snap.ownership, snap.armies[idx], target);
    if (ordered) snap.armies[idx] = ordered;
  }
  // 2. Enemy AI issues its own.
  for (const [armyId, target] of Object.entries(rivalOrders(state, graph, rng))) {
    const idx = snap.armies.findIndex(a => a.id === armyId);
    if (idx < 0) continue;
    const ordered = orderMarch(graph, snap.ownership, snap.armies[idx], target);
    if (ordered) snap.armies[idx] = ordered;
  }

  // 3. Advance every march; collect contacts.
  const pendingBattles: PendingBattle[] = [];
  snap.armies = snap.armies.map(army => {
    const { army: moved, step } = advanceMarch(graph, snap.ownership, army);
    if (step?.arrived && step.enteredTerritoryId) {
      const enemy: FactionId = moved.faction === 'player' ? 'rival' : 'player';
      const defender = snap.armies.find(a => a.faction === enemy && a.territoryId === step.enteredTerritoryId && a.id !== moved.id);
      if (step.contested || defender) {
        const c = graph.nodes.get(graph.centroids.get(step.enteredTerritoryId)!)!;
        pendingBattles.push({
          id: `battle-${turn}-${moved.id}`,
          attackerArmyId: moved.id,
          defenderArmyId: defender?.id ?? null,
          territoryId: step.enteredTerritoryId,
          lat: c.lat, lng: c.lng,
        });
      } else if (snap.ownership.owners[step.enteredTerritoryId] !== moved.faction) {
        // Unopposed occupation.
        snap.ownership.owners[step.enteredTerritoryId] = moved.faction;
      }
    }
    return moved;
  });

  // 4. Resolve battles through the combat matrix (player battles use the
  //    chosen tactic; the rival's tactic comes from its leader signature +
  //    doctrine noise).
  const battles: TurnResult['battles'] = [];
  for (const pb of pendingBattles) {
    const attacker = snap.armies.find(a => a.id === pb.attackerArmyId)!;
    const defender = pb.defenderArmyId ? snap.armies.find(a => a.id === pb.defenderArmyId)! : null;
    const atkIsPlayer = attacker.faction === 'player';

    const rivalTactic: Tactic = rng() < 0.5
      ? state.rivalLeader.signature
      : (['charge', 'volley', 'hold'] as Tactic[])[Math.floor(rng() * 3)];

    const resolution = resolveBattle(
      {
        rosterId: atkIsPlayer ? state.playerRosterId : state.rivalRosterId,
        strength: attacker.strength,
        morale: Math.min(100, attacker.morale + snap.discipline),
        tactic: atkIsPlayer ? orders.tactic : rivalTactic,
        leader: atkIsPlayer ? state.playerLeader : state.rivalLeader,
      },
      {
        rosterId: defender
          ? (defender.faction === 'player' ? state.playerRosterId : state.rivalRosterId)
          : (atkIsPlayer ? state.rivalRosterId : state.playerRosterId),
        strength: defender?.strength ?? 55, // garrison stand-in
        morale: defender ? Math.min(100, defender.morale + snap.discipline) : 60,
        tactic: atkIsPlayer ? rivalTactic : orders.tactic,
        leader: defender && defender.faction === 'player' ? state.playerLeader : state.rivalLeader,
      },
      {
        attackerTactic: atkIsPlayer ? orders.tactic : rivalTactic,
        defenderTactic: atkIsPlayer ? rivalTactic : orders.tactic,
        lat: pb.lat, lng: pb.lng,
        attackerCrossedRiver: false,
        defenderHighGround: rng() < 0.3,
        weather: snap.weather,
        attackerLeader: atkIsPlayer ? state.playerLeader : state.rivalLeader,
        defenderLeader: atkIsPlayer ? state.rivalLeader : state.playerLeader,
      },
      state.seed ^ (turn * 104729) ^ pb.id.length,
    );

    // Write outcomes back into army state + territory ownership.
    const applySide = (armyId: string | null, side: { strength: number; morale: number }) => {
      if (!armyId) return;
      const idx = snap.armies.findIndex(a => a.id === armyId);
      if (idx >= 0) snap.armies[idx] = { ...snap.armies[idx], strength: side.strength, morale: side.morale };
    };
    applySide(pb.attackerArmyId, resolution.attacker);
    applySide(pb.defenderArmyId, resolution.defender);

    const attackerWon = resolution.winner === 'attacker';
    if (attackerWon) snap.ownership.owners[pb.territoryId] = attacker.faction;
    if ((atkIsPlayer && !attackerWon) || (!atkIsPlayer && attackerWon)) snap.recentDefeats += 1;
    else snap.recentDefeats = Math.max(0, snap.recentDefeats - 1);

    battles.push({ pending: pb, resolution });
  }
  snap.armies = snap.armies.filter(a => a.strength > 0);

  // 5. Logistics sweep — supply corridors + compounding attrition.
  const { armies: sweptArmies, reports } = runLogisticsTick(graph, snap.ownership, snap.armies);
  snap.armies = sweptArmies;
  for (const r of reports) {
    if (r.attrition > 0) snap.log.push({ turn, key: 'imp_attrition_report', params: { army: r.armyId, n: r.attrition } });
  }

  // 6. Standing-crisis pressure + auto-resolution.
  snap.activeCrises = snap.activeCrises.filter(c => !crisisResolved(c, snap));
  for (const c of snap.activeCrises) {
    if (c.perTurnMoraleDecay) {
      snap.armies = snap.armies.map(a => a.faction === 'player'
        ? { ...a, morale: Math.max(0, a.morale - c.perTurnMoraleDecay!) }
        : a);
    }
  }

  // 7. Crisis sweep — emergent events for next turn's council.
  const newCrises = sweepForCrises({ snapshot: snap, previous: state.current, recentDefeats: snap.recentDefeats });
  snap.activeCrises = [...snap.activeCrises, ...newCrises];
  for (const c of newCrises) snap.log.push({ turn, key: c.titleKey, params: c.params });

  // 8. Victory conditions: hold every territory, or lose everything.
  const playerHolds = Object.values(snap.ownership.owners).filter(f => f === 'player').length;
  const rivalHolds = Object.values(snap.ownership.owners).filter(f => f === 'rival').length;
  const playerArmies = snap.armies.filter(a => a.faction === 'player').length;
  if (rivalHolds === 0) { snap.over = true; snap.playerWon = true; }
  else if (playerHolds === 0 || playerArmies === 0) { snap.over = true; snap.playerWon = false; }

  const nextState: CampaignState = {
    ...state,
    current: snap,
    snapshots: [...state.snapshots, structuredClone(snap)].slice(-40), // ring buffer
  };
  return { state: nextState, battles, newCrises };
}

function applyEffects(snap: CampaignSnapshot, fx: CrisisEffects, graph: GeoGraph) {
  if (fx.moraleDelta) {
    snap.armies = snap.armies.map(a => a.faction === 'player'
      ? { ...a, morale: Math.max(0, Math.min(100, a.morale + fx.moraleDelta!)) }
      : a);
  }
  if (fx.treasuryDelta) snap.treasury = Math.max(0, snap.treasury + fx.treasuryDelta);
  if (fx.disciplineDelta) snap.discipline = Math.max(-10, Math.min(15, snap.discipline + fx.disciplineDelta));
  if (fx.supplyCostMultiplier) snap.supplyCostMultiplier = fx.supplyCostMultiplier;
  if (fx.forcedMarchTo) {
    const idx = snap.armies.findIndex(a => a.faction === 'player');
    if (idx >= 0) {
      const ordered = orderMarch(graph, snap.ownership, snap.armies[idx], fx.forcedMarchTo);
      if (ordered) snap.armies[idx] = ordered;
    }
  }
}

// ── Rollback (client side of Part D) ─────────────────────────────────────────

/** Revert the campaign to a previously stored turn signature. */
export function rollbackToTurn(state: CampaignState, turn: number): CampaignState {
  const target = state.snapshots.find(s => s.turn === turn);
  if (!target) return state;
  const keep = state.snapshots.filter(s => s.turn <= turn);
  return { ...state, current: structuredClone(target), snapshots: keep };
}

/** Theatre summary for the setup screen. */
export function theatreSummary(theatre: TheatreId): { territories: number } {
  return { territories: provincesFor(theatre).length };
}

export { THEATRE_SPECS };
