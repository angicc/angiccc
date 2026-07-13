// ─── CHRONOS IMPERIUM · Part C: Procedural Emergent Crisis Generator ─────────
// A background observer sweeps the campaign state after every turn, tracking
// ownership of high-value coordinates (capitals, trade chokepoints) and army
// well-being. When structural conditions trip — an empire polygon loses its
// capital node, a supply corridor stays cut, defeats stack up — the generator
// intercepts the standard turn flow and injects a localized crisis: narrative,
// options, and ongoing effects. Every string in the payload is a CATALOG KEY
// (see imperiumCatalog.ts); the raw English never travels to the client UI —
// that is the strict localization contract in code, not in policy.
import type { CampaignSnapshot } from './imperiumEngine';
import type { FactionId } from './logistics';

export type CrisisKind = 'capital-lost' | 'trade-blockade' | 'coup-whispers' | 'army-isolated';

export interface CrisisOption {
  id: string;
  labelKey: string;                       // catalog key ONLY
  effects: CrisisEffects;
}

export interface CrisisEffects {
  moraleDelta?: number;                   // applied to all faction armies
  treasuryDelta?: number;
  disciplineDelta?: number;               // future turns' morale resilience
  forcedMarchTo?: string;                 // territory id
  supplyCostMultiplier?: number;
}

export interface CrisisEvent {
  id: string;
  kind: CrisisKind;
  turn: number;
  titleKey: string;                       // catalog keys ONLY — the contract
  bodyKey: string;
  params: Record<string, string>;         // interpolation params (territory names resolved client-side)
  options: CrisisOption[];
  /** Recurring pressure while unresolved (e.g. capital still lost). */
  perTurnMoraleDecay?: number;
}

// ── High-value coordinate registry ────────────────────────────────────────────
// Capitals per theatre: losing one is the flagship structural trigger.

export const HIGH_VALUE_TERRITORIES: Record<string, { capitalOf: FactionId | 'contested'; weight: number }> = {
  // theatre-relative importance; the engine assigns player/rival capitals when
  // a campaign starts, so the observer reads campaign state, not this table,
  // for ownership — the table carries strategic WEIGHT (crisis magnitude).
  'roman-empire': { capitalOf: 'contested', weight: 3 },
  'byzantine-empire': { capitalOf: 'contested', weight: 3 },
  'mesopotamia': { capitalOf: 'contested', weight: 2 },
  'ottoman-empire': { capitalOf: 'contested', weight: 3 },
  'crusader-states': { capitalOf: 'contested', weight: 2 },
  'mongol-empire': { capitalOf: 'contested', weight: 2 },
};

// ── Observer sweep ────────────────────────────────────────────────────────────

interface ObserverContext {
  snapshot: CampaignSnapshot;
  previous?: CampaignSnapshot;
  /** Recent player defeats (rolling window maintained by the engine). */
  recentDefeats: number;
}

// Deterministic ids: same state transitions → same crisis ids, which keeps
// the whole turn pipeline replayable (the engine dedups active crises by
// kind, so kind+turn is unique among the living set).
const crisisId = (kind: CrisisKind, turn: number) => `crisis-${kind}-t${turn}`;

/**
 * Sweep the campaign state and emit any crises whose structural conditions
 * are met this turn. Deterministic given the same state transitions; the
 * engine deduplicates by kind so a standing condition doesn't restack.
 */
export function sweepForCrises(ctx: ObserverContext): CrisisEvent[] {
  const { snapshot, previous, recentDefeats } = ctx;
  const events: CrisisEvent[] = [];
  const active = new Set(snapshot.activeCrises.map(c => c.kind));

  // 1. Capital-loss interception: the player's capital polygon flipped to rival.
  const capital = snapshot.capitals.player;
  if (capital && snapshot.ownership.owners[capital] === 'rival' && !active.has('capital-lost')) {
    const justLost = !previous || previous.ownership.owners[capital] !== 'rival';
    if (justLost) {
      events.push({
        id: crisisId('capital-lost', snapshot.turn),
        kind: 'capital-lost',
        turn: snapshot.turn,
        titleKey: 'imp_crisis_capital_lost_title',
        bodyKey: 'imp_crisis_capital_lost_body',
        params: { territory: capital },
        perTurnMoraleDecay: 4 + (HIGH_VALUE_TERRITORIES[capital]?.weight ?? 1),
        options: [
          { id: 'rally', labelKey: 'imp_crisis_capital_opt_rally', effects: { moraleDelta: +12, treasuryDelta: -20 } },
          { id: 'march', labelKey: 'imp_crisis_capital_opt_march', effects: { forcedMarchTo: capital, moraleDelta: +4 } },
          { id: 'regroup', labelKey: 'imp_crisis_capital_opt_regroup', effects: { moraleDelta: -6, disciplineDelta: +8 } },
        ],
      });
    }
  }

  // 2. Trade blockade: a chokepoint territory adjacent to ≥2 friendly holdings
  //    flipped hostile — caravans strangled until reopened.
  if (previous && !active.has('trade-blockade')) {
    for (const [territory, owner] of Object.entries(snapshot.ownership.owners)) {
      const before = previous.ownership.owners[territory];
      if (owner === 'rival' && before !== 'rival' && (HIGH_VALUE_TERRITORIES[territory]?.weight ?? 0) >= 2) {
        events.push({
          id: crisisId('trade-blockade', snapshot.turn),
          kind: 'trade-blockade',
          turn: snapshot.turn,
          titleKey: 'imp_crisis_blockade_title',
          bodyKey: 'imp_crisis_blockade_body',
          params: { territory },
          options: [
            { id: 'reroute', labelKey: 'imp_crisis_blockade_opt_reroute', effects: { supplyCostMultiplier: 1.25 } },
            { id: 'convoy', labelKey: 'imp_crisis_blockade_opt_convoy', effects: { moraleDelta: -3 } },
          ],
        });
        break; // one blockade crisis per sweep
      }
    }
  }

  // 3. Coup whispers: defeats stacking while any army starves.
  const anyStarving = snapshot.armies.some(ar => ar.faction === 'player' && ar.isolationTicks >= 2);
  if (recentDefeats >= 2 && anyStarving && !active.has('coup-whispers')) {
    events.push({
      id: crisisId('coup-whispers', snapshot.turn),
      kind: 'coup-whispers',
      turn: snapshot.turn,
      titleKey: 'imp_crisis_coup_title',
      bodyKey: 'imp_crisis_coup_body',
      params: {},
      options: [
        { id: 'purge', labelKey: 'imp_crisis_coup_opt_purge', effects: { moraleDelta: -8, disciplineDelta: +12 } },
        { id: 'concede', labelKey: 'imp_crisis_coup_opt_concede', effects: { moraleDelta: +10, disciplineDelta: -5 } },
      ],
    });
  }

  // 4. Isolation alert (informational crisis, auto-resolving when resupplied).
  for (const army of snapshot.armies) {
    if (army.faction === 'player' && army.isolationTicks === 1 && !active.has('army-isolated')) {
      events.push({
        id: crisisId('army-isolated', snapshot.turn),
        kind: 'army-isolated',
        turn: snapshot.turn,
        titleKey: 'imp_crisis_isolated_title',
        bodyKey: 'imp_crisis_isolated_body',
        params: { territory: army.territoryId },
        options: [],
      });
      break;
    }
  }

  return events;
}

/** A standing crisis auto-resolves when its structural condition clears. */
export function crisisResolved(crisis: CrisisEvent, snapshot: CampaignSnapshot): boolean {
  switch (crisis.kind) {
    case 'capital-lost': {
      const capital = snapshot.capitals.player;
      return !capital || snapshot.ownership.owners[capital] !== 'rival';
    }
    case 'trade-blockade':
      return snapshot.ownership.owners[crisis.params.territory] !== 'rival';
    case 'army-isolated':
      return snapshot.armies.every(ar => ar.faction !== 'player' || ar.supplied);
    case 'coup-whispers':
      return false; // resolves only by player choice
  }
}
