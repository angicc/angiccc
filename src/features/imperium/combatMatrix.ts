// ─── CHRONOS IMPERIUM · Part B: Universal Tactical Combat Resolution Matrix ──
// The strategic layer's battles resolve here: era-authentic unit profiles
// (Roman legions to Renaissance tercios to riflemen), a conditional modifier
// evaluator combining player tactics (Charge / Volley / Shield Wall) with
// geographic modifiers pulled from the macro map (river crossings, high
// ground, desert heat), weather, and leader trait profiles — then a
// deterministic tick-based resolver that converts the whole matrix into
// precise animation triggers the frontend timeline can replay frame by frame.
//
// Everything is pure and seedable: same inputs → same battle, which is what
// makes server-side verification and replay possible.
import { classifyTerrain, type TerrainKind } from './geoGraph';

export type Tactic = 'charge' | 'volley' | 'hold';
export type Weather = 'clear' | 'rain' | 'storm' | 'heat' | 'snow';
export type UnitClass = 'infantry' | 'ranged' | 'cavalry';

// ── Deterministic RNG (mulberry32) — battles replay identically per seed ─────
export function seededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Unit profiles: the historical rosters ─────────────────────────────────────

export interface UnitProfile {
  cls: UnitClass;
  nameKey: string;          // localization catalog key — NEVER raw English in payloads
  attack: number;           // 1–10
  defense: number;          // 1–10
  shock: number;            // charge impetus 1–10
  missile: number;          // ranged output 1–10
  discipline: number;       // morale resilience 1–10
}

export interface ArmyRoster {
  id: string;
  nameKey: string;
  era: 'ancient' | 'medieval' | 'early-modern' | 'modern';
  units: UnitProfile[];
}

/** Twelve era-authentic rosters. Balanced around distinct doctrines. */
export const ROSTERS: ArmyRoster[] = [
  {
    id: 'roman-legion', nameKey: 'imp_roster_roman', era: 'ancient',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_legionary', attack: 8, defense: 8, shock: 6, missile: 3, discipline: 9 },
      { cls: 'ranged', nameKey: 'imp_unit_velites', attack: 4, defense: 3, shock: 2, missile: 6, discipline: 6 },
      { cls: 'cavalry', nameKey: 'imp_unit_equites', attack: 6, defense: 5, shock: 6, missile: 2, discipline: 6 },
    ],
  },
  {
    id: 'macedonian-phalanx', nameKey: 'imp_roster_macedonian', era: 'ancient',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_phalangite', attack: 7, defense: 9, shock: 5, missile: 1, discipline: 8 },
      { cls: 'ranged', nameKey: 'imp_unit_peltast', attack: 5, defense: 4, shock: 3, missile: 6, discipline: 6 },
      { cls: 'cavalry', nameKey: 'imp_unit_companion', attack: 9, defense: 6, shock: 10, missile: 1, discipline: 8 },
    ],
  },
  {
    id: 'persian-host', nameKey: 'imp_roster_persian', era: 'ancient',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_immortal', attack: 7, defense: 6, shock: 5, missile: 5, discipline: 7 },
      { cls: 'ranged', nameKey: 'imp_unit_persian_archer', attack: 5, defense: 3, shock: 2, missile: 8, discipline: 5 },
      { cls: 'cavalry', nameKey: 'imp_unit_scythed_chariot', attack: 8, defense: 4, shock: 9, missile: 2, discipline: 4 },
    ],
  },
  {
    id: 'byzantine-thematic', nameKey: 'imp_roster_byzantine', era: 'medieval',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_skutatos', attack: 6, defense: 8, shock: 4, missile: 3, discipline: 8 },
      { cls: 'ranged', nameKey: 'imp_unit_toxotai', attack: 5, defense: 4, shock: 2, missile: 7, discipline: 7 },
      { cls: 'cavalry', nameKey: 'imp_unit_cataphract', attack: 9, defense: 9, shock: 9, missile: 4, discipline: 8 },
    ],
  },
  {
    id: 'frankish-host', nameKey: 'imp_roster_frankish', era: 'medieval',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_menatarms', attack: 7, defense: 7, shock: 6, missile: 1, discipline: 6 },
      { cls: 'ranged', nameKey: 'imp_unit_crossbowman', attack: 5, defense: 4, shock: 2, missile: 8, discipline: 6 },
      { cls: 'cavalry', nameKey: 'imp_unit_knight', attack: 10, defense: 8, shock: 10, missile: 1, discipline: 5 },
    ],
  },
  {
    id: 'mongol-tumen', nameKey: 'imp_roster_mongol', era: 'medieval',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_auxiliary_spear', attack: 5, defense: 5, shock: 4, missile: 2, discipline: 6 },
      { cls: 'ranged', nameKey: 'imp_unit_horse_archer', attack: 7, defense: 4, shock: 4, missile: 10, discipline: 8 },
      { cls: 'cavalry', nameKey: 'imp_unit_keshik', attack: 8, defense: 6, shock: 8, missile: 6, discipline: 9 },
    ],
  },
  {
    id: 'spanish-tercio', nameKey: 'imp_roster_tercio', era: 'early-modern',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_pikeman', attack: 7, defense: 9, shock: 5, missile: 1, discipline: 8 },
      { cls: 'ranged', nameKey: 'imp_unit_arquebusier', attack: 6, defense: 4, shock: 2, missile: 8, discipline: 7 },
      { cls: 'cavalry', nameKey: 'imp_unit_herreruelo', attack: 6, defense: 6, shock: 6, missile: 4, discipline: 6 },
    ],
  },
  {
    id: 'ottoman-kapikulu', nameKey: 'imp_roster_ottoman', era: 'early-modern',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_janissary', attack: 8, defense: 7, shock: 5, missile: 7, discipline: 9 },
      { cls: 'ranged', nameKey: 'imp_unit_topcu', attack: 6, defense: 3, shock: 1, missile: 9, discipline: 7 },
      { cls: 'cavalry', nameKey: 'imp_unit_sipahi', attack: 8, defense: 7, shock: 8, missile: 3, discipline: 7 },
    ],
  },
  {
    id: 'swedish-brigade', nameKey: 'imp_roster_swedish', era: 'early-modern',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_musketeer_gv', attack: 7, defense: 6, shock: 4, missile: 9, discipline: 8 },
      { cls: 'ranged', nameKey: 'imp_unit_leather_gun', attack: 6, defense: 3, shock: 1, missile: 9, discipline: 7 },
      { cls: 'cavalry', nameKey: 'imp_unit_hakkapeliitta', attack: 8, defense: 5, shock: 9, missile: 3, discipline: 7 },
    ],
  },
  {
    id: 'napoleonic-corps', nameKey: 'imp_roster_napoleonic', era: 'modern',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_line_infantry', attack: 7, defense: 7, shock: 6, missile: 7, discipline: 8 },
      { cls: 'ranged', nameKey: 'imp_unit_grand_battery', attack: 8, defense: 3, shock: 2, missile: 10, discipline: 7 },
      { cls: 'cavalry', nameKey: 'imp_unit_cuirassier', attack: 9, defense: 8, shock: 9, missile: 1, discipline: 7 },
    ],
  },
  {
    id: 'great-war-division', nameKey: 'imp_roster_greatwar', era: 'modern',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_rifleman', attack: 8, defense: 8, shock: 5, missile: 8, discipline: 8 },
      { cls: 'ranged', nameKey: 'imp_unit_field_artillery', attack: 9, defense: 2, shock: 1, missile: 10, discipline: 7 },
      { cls: 'cavalry', nameKey: 'imp_unit_stormtrooper', attack: 9, defense: 6, shock: 9, missile: 6, discipline: 8 },
    ],
  },
  {
    id: 'crusader-host', nameKey: 'imp_roster_crusader', era: 'medieval',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_sergeant', attack: 6, defense: 7, shock: 5, missile: 2, discipline: 6 },
      { cls: 'ranged', nameKey: 'imp_unit_turcopole', attack: 5, defense: 4, shock: 3, missile: 7, discipline: 6 },
      { cls: 'cavalry', nameKey: 'imp_unit_templar', attack: 10, defense: 9, shock: 10, missile: 1, discipline: 9 },
    ],
  },
  {
    id: 'han-army', nameKey: 'imp_roster_han', era: 'ancient',
    units: [
      { cls: 'infantry', nameKey: 'imp_unit_halberdier', attack: 7, defense: 7, shock: 5, missile: 2, discipline: 8 },
      { cls: 'ranged', nameKey: 'imp_unit_chukonu', attack: 6, defense: 4, shock: 1, missile: 9, discipline: 7 },
      { cls: 'cavalry', nameKey: 'imp_unit_han_lancer', attack: 7, defense: 6, shock: 7, missile: 4, discipline: 7 },
    ],
  },
];

export function rosterFor(era: ArmyRoster['era'], preferredId?: string): ArmyRoster {
  return ROSTERS.find(r => r.id === preferredId) ?? ROSTERS.find(r => r.era === era) ?? ROSTERS[0];
}

// ── Leader trait profiles ─────────────────────────────────────────────────────

export interface LeaderProfile {
  id: string;
  nameKey: string;
  /** Tactic the leader excels at — executing it gains the bonus. */
  signature: Tactic;
  attackBonus: number;      // flat modifier on attack rolls
  moraleAura: number;       // flat morale resilience for the army
  logisticsBonus: number;   // reduces attrition (engine applies)
}

export const LEADERS: LeaderProfile[] = [
  { id: 'iron-consul', nameKey: 'imp_leader_consul', signature: 'hold', attackBonus: 1, moraleAura: 8, logisticsBonus: 1 },
  { id: 'steppe-khan', nameKey: 'imp_leader_khan', signature: 'volley', attackBonus: 2, moraleAura: 4, logisticsBonus: 2 },
  { id: 'lion-marshal', nameKey: 'imp_leader_marshal', signature: 'charge', attackBonus: 3, moraleAura: 5, logisticsBonus: 0 },
  { id: 'silent-strategos', nameKey: 'imp_leader_strategos', signature: 'hold', attackBonus: 1, moraleAura: 6, logisticsBonus: 3 },
  { id: 'storm-sultan', nameKey: 'imp_leader_sultan', signature: 'volley', attackBonus: 2, moraleAura: 6, logisticsBonus: 1 },
  { id: 'young-eagle', nameKey: 'imp_leader_eagle', signature: 'charge', attackBonus: 3, moraleAura: 7, logisticsBonus: 1 },
];

// ── Tactical modifier evaluator ───────────────────────────────────────────────
// The full conditional matrix: tactic triangle × terrain × river crossing ×
// high ground × weather × leader signature × unit-class affinity. Each rule
// contributes a labelled modifier so the UI can EXPLAIN the math to the player
// — a combat log that teaches, in keeping with the rest of the app.

export interface CombatContext {
  attackerTactic: Tactic;
  defenderTactic: Tactic;
  /** Battle site pulled from macro-map coordinates. */
  lat: number;
  lng: number;
  attackerCrossedRiver: boolean;
  defenderHighGround: boolean;
  weather: Weather;
  attackerLeader?: LeaderProfile;
  defenderLeader?: LeaderProfile;
}

export interface Modifier {
  labelKey: string;         // catalog key — localization contract
  side: 'attacker' | 'defender';
  value: number;            // additive percentage points on damage
}

const TRIANGLE: Record<Tactic, Tactic> = { charge: 'volley', volley: 'hold', hold: 'charge' };

export function tacticBeats(a: Tactic, b: Tactic): boolean {
  return TRIANGLE[a] === b;
}

export function evaluateModifiers(ctx: CombatContext): { modifiers: Modifier[]; terrain: TerrainKind } {
  const modifiers: Modifier[] = [];
  const terrain = classifyTerrain(ctx.lat, ctx.lng);

  // Tactic triangle
  if (tacticBeats(ctx.attackerTactic, ctx.defenderTactic)) {
    modifiers.push({ labelKey: 'imp_mod_tactic_adv', side: 'attacker', value: 30 });
  } else if (tacticBeats(ctx.defenderTactic, ctx.attackerTactic)) {
    modifiers.push({ labelKey: 'imp_mod_tactic_counter', side: 'defender', value: 25 });
  }

  // Geographic modifiers from the macro map
  if (terrain === 'mountain') {
    modifiers.push({ labelKey: 'imp_mod_mountain_def', side: 'defender', value: 20 });
    if (ctx.attackerTactic === 'charge') modifiers.push({ labelKey: 'imp_mod_charge_uphill', side: 'defender', value: 15 });
  }
  if (terrain === 'river' || ctx.attackerCrossedRiver) {
    modifiers.push({ labelKey: 'imp_mod_river_crossing', side: 'defender', value: 25 });
  }
  if (terrain === 'desert') {
    modifiers.push({ labelKey: 'imp_mod_desert_fatigue', side: 'defender', value: 10 });
  }
  if (ctx.defenderHighGround) {
    modifiers.push({ labelKey: 'imp_mod_high_ground', side: 'defender', value: 15 });
  }

  // Weather
  switch (ctx.weather) {
    case 'rain':
      if (ctx.attackerTactic === 'volley') modifiers.push({ labelKey: 'imp_mod_rain_bowstrings', side: 'defender', value: 20 });
      break;
    case 'storm':
      modifiers.push({ labelKey: 'imp_mod_storm_chaos', side: 'defender', value: 10 });
      if (ctx.attackerTactic === 'volley') modifiers.push({ labelKey: 'imp_mod_rain_bowstrings', side: 'defender', value: 20 });
      break;
    case 'heat':
      if (ctx.attackerTactic === 'charge') modifiers.push({ labelKey: 'imp_mod_heat_exhaustion', side: 'defender', value: 12 });
      break;
    case 'snow':
      modifiers.push({ labelKey: 'imp_mod_snow_slog', side: 'defender', value: 15 });
      break;
  }

  // Leader signatures
  if (ctx.attackerLeader && ctx.attackerLeader.signature === ctx.attackerTactic) {
    modifiers.push({ labelKey: 'imp_mod_leader_signature', side: 'attacker', value: 10 + ctx.attackerLeader.attackBonus * 3 });
  }
  if (ctx.defenderLeader && ctx.defenderLeader.signature === ctx.defenderTactic) {
    modifiers.push({ labelKey: 'imp_mod_leader_signature_def', side: 'defender', value: 8 + ctx.defenderLeader.attackBonus * 2 });
  }

  return { modifiers, terrain };
}

// ── Tick-based damage resolver ────────────────────────────────────────────────

export interface BattleSide {
  rosterId: string;
  strength: number;         // 0–100
  morale: number;           // 0–100
  tactic: Tactic;
  leader?: LeaderProfile;
}

export interface AnimationTrigger {
  tick: number;
  kind: 'volley' | 'melee' | 'charge' | 'shatter' | 'waver' | 'rally' | 'rout';
  side: 'attacker' | 'defender';
  leadClass: UnitClass;
  magnitude: number;        // 0–1 for the animation layer to scale intensity
}

export interface TickResult {
  tick: number;
  attackerDamage: number;   // damage DEALT BY attacker this tick
  defenderDamage: number;
  attackerMoraleDelta: number;
  defenderMoraleDelta: number;
  shatteredUnits: { side: 'attacker' | 'defender'; cls: UnitClass }[];
  triggers: AnimationTrigger[];
}

export interface BattleResolution {
  ticks: TickResult[];
  winner: 'attacker' | 'defender' | 'stalemate';
  attacker: BattleSide;     // final state
  defender: BattleSide;
  modifiers: Modifier[];
  terrain: TerrainKind;
  routed: boolean;
}

const TACTIC_LEAD: Record<Tactic, UnitClass> = { charge: 'cavalry', volley: 'ranged', hold: 'infantry' };

function rosterPower(rosterId: string, tactic: Tactic): number {
  const roster = ROSTERS.find(r => r.id === rosterId) ?? ROSTERS[0];
  const lead = roster.units.find(u => u.cls === TACTIC_LEAD[tactic])!;
  // A tactic's punch blends the leading unit's speciality with roster discipline.
  const speciality = tactic === 'charge' ? lead.shock : tactic === 'volley' ? lead.missile : lead.defense;
  return speciality * 0.7 + lead.attack * 0.2 + lead.discipline * 0.1;
}

/**
 * Resolve a full battle in deterministic ticks (max 12). Each tick both sides
 * strike, modified by the evaluated matrix; morale collapse ends the battle
 * early with a rout. All randomness flows through the injected seed.
 */
export function resolveBattle(
  attacker: BattleSide,
  defender: BattleSide,
  ctx: CombatContext,
  seed: number,
): BattleResolution {
  const rng = seededRng(seed);
  const { modifiers, terrain } = evaluateModifiers(ctx);
  const bonus = (side: 'attacker' | 'defender') =>
    modifiers.filter(m => m.side === side).reduce((a, m) => a + m.value, 0) / 100;

  const atkBonus = bonus('attacker');
  const defBonus = bonus('defender');
  const a: BattleSide = { ...attacker };
  const d: BattleSide = { ...defender };
  const ticks: TickResult[] = [];
  let routed = false;

  for (let tick = 1; tick <= 12 && a.strength > 0 && d.strength > 0; tick++) {
    const aPower = rosterPower(a.rosterId, a.tactic) * (0.85 + 0.3 * (a.morale / 100));
    const dPower = rosterPower(d.rosterId, d.tactic) * (0.85 + 0.3 * (d.morale / 100));

    const aLeaderAtk = a.leader?.attackBonus ?? 0;
    const dLeaderAtk = d.leader?.attackBonus ?? 0;

    const variance = () => 0.85 + rng() * 0.3;
    const atkDamage = Math.round((aPower + aLeaderAtk) * (1 + atkBonus) * variance());
    const defDamage = Math.round((dPower + dLeaderAtk) * (1 + defBonus) * variance() * 0.9); // defender strikes second, slightly lighter

    d.strength = Math.max(0, d.strength - atkDamage);
    a.strength = Math.max(0, a.strength - defDamage);

    const aMoraleDelta = -Math.round(defDamage * 0.6) + (a.leader?.moraleAura ? 1 : 0);
    const dMoraleDelta = -Math.round(atkDamage * 0.6) + (d.leader?.moraleAura ? 1 : 0);
    a.morale = Math.max(0, Math.min(100, a.morale + aMoraleDelta));
    d.morale = Math.max(0, Math.min(100, d.morale + dMoraleDelta));

    const shattered: TickResult['shatteredUnits'] = [];
    const triggers: AnimationTrigger[] = [
      {
        tick,
        kind: a.tactic === 'volley' ? 'volley' : a.tactic === 'charge' ? 'charge' : 'melee',
        side: 'attacker',
        leadClass: TACTIC_LEAD[a.tactic],
        magnitude: Math.min(1, atkDamage / 20),
      },
      {
        tick,
        kind: d.tactic === 'volley' ? 'volley' : d.tactic === 'charge' ? 'charge' : 'melee',
        side: 'defender',
        leadClass: TACTIC_LEAD[d.tactic],
        magnitude: Math.min(1, defDamage / 20),
      },
    ];

    // Unit shattering index: crossing strength quartiles shatters a unit block.
    for (const [side, s, before] of [
      ['defender', d.strength, d.strength + atkDamage],
      ['attacker', a.strength, a.strength + defDamage],
    ] as const) {
      for (const q of [75, 50, 25]) {
        if (before > q && s <= q) {
          const cls: UnitClass = q === 75 ? 'ranged' : q === 50 ? 'infantry' : 'cavalry';
          shattered.push({ side, cls });
          triggers.push({ tick, kind: 'shatter', side, leadClass: cls, magnitude: 0.8 });
        }
      }
    }

    if (a.morale <= 25 && a.morale > 0) triggers.push({ tick, kind: 'waver', side: 'attacker', leadClass: 'infantry', magnitude: 0.5 });
    if (d.morale <= 25 && d.morale > 0) triggers.push({ tick, kind: 'waver', side: 'defender', leadClass: 'infantry', magnitude: 0.5 });

    // Morale collapse: the line breaks with strength remaining — a rout.
    if (a.morale <= 0 || d.morale <= 0) {
      const broken = a.morale <= 0 ? 'attacker' : 'defender';
      triggers.push({ tick, kind: 'rout', side: broken, leadClass: 'infantry', magnitude: 1 });
      if (broken === 'attacker') a.strength = 0; else d.strength = 0;
      routed = true;
    }

    ticks.push({
      tick,
      attackerDamage: atkDamage,
      defenderDamage: defDamage,
      attackerMoraleDelta: aMoraleDelta,
      defenderMoraleDelta: dMoraleDelta,
      shatteredUnits: shattered,
      triggers,
    });
    if (routed) break;
  }

  const winner: BattleResolution['winner'] =
    a.strength <= 0 && d.strength <= 0 ? 'stalemate'
    : d.strength <= 0 ? 'attacker'
    : a.strength <= 0 ? 'defender'
    : a.strength === d.strength ? 'stalemate'
    : a.strength > d.strength ? 'attacker' : 'defender';

  return { ticks, winner, attacker: a, defender: d, modifiers, terrain, routed };
}
