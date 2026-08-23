// ─── CHRONOS IMPERIUM · Rival strategic AI ───────────────────────────────────
//
// What this replaces: the rival used to pick a target with
//
//     playerHeld[Math.floor(rng() * playerHeld.length)]
//
// — a uniformly random player province, with a 35% pull toward the capital. It
// did not look at how far the target was, what garrisoned it, how strong the
// attacking army was, or whether the army could survive the trip. Three
// consequences the player actually feels:
//
//   1. Armies scattered. Four rival armies would march on four different
//      provinces and lose all four, because a 100-strength army attacking a
//      100-strength defender in favourable terrain loses more often than not.
//   2. It never took free ground. Neutral provinces sat unclaimed for the whole
//      campaign even when nothing opposed them.
//   3. It threw away hurt armies. A 30-strength unsupplied army marched on a
//      full garrison and evaporated, so the mid-game got easier the worse the
//      rival did — exactly backwards.
//
// The model here is deliberately simple and fully deterministic: score every
// (army, target) pair, then assign greedily, highest score first, with a
// concentration bonus that pulls a second army onto a target the first already
// chose. No lookahead, no learning — those would be unpredictable to the player
// and untestable for us. Every input is a number already on the snapshot, so a
// given (state, seed) always produces the same orders.

import { findTerritoryPath, neighbourTerritories, type GeoGraph } from './geoGraph';

export type FactionId = 'player' | 'rival' | 'neutral';

export interface StrategyArmy {
  id: string;
  faction: FactionId;
  territoryId: string;
  strength: number;
  morale: number;
  supplied: boolean;
  march?: { targetTerritoryId: string } | null;
}

export interface StrategyInput {
  owners: Record<string, FactionId>;
  armies: StrategyArmy[];
  playerCapital?: string;
  rivalCapital?: string;
  graph: GeoGraph;
  /** 0..1 — how hard the rival presses. Rises as the campaign goes on. */
  aggression: number;
  rng: () => number;
}

/** One considered move, kept so the reasoning can be tested and shown. */
export interface StrategyChoice {
  armyId: string;
  target: string;
  score: number;
  /** Why this move was picked — a stable key, never prose. */
  motive: 'defend-capital' | 'withdraw' | 'strike-capital' | 'take-province' | 'claim-neutral' | 'hold';
}

/** An army below this is a liability, not an instrument. */
const WITHDRAW_STRENGTH = 42;
/** Attacking with less than this multiple of the defender is throwing men away. */
const MIN_ODDS = 1.15;

/**
 * Total defending strength sitting on a province.
 *
 * Armies already marching away still count: they have not left yet, and the
 * rival cannot see the player's orders. Modelling perfect information here
 * made the AI feel like it was cheating.
 */
export function garrisonOf(input: StrategyInput, territoryId: string, of: FactionId): number {
  return input.armies
    .filter(a => a.faction === of && a.territoryId === territoryId)
    .reduce((sum, a) => sum + a.strength * (0.6 + 0.4 * (a.morale / 100)), 0);
}

/** Effective attacking power, discounted for exhaustion and lost supply. */
export function effectivePower(army: StrategyArmy): number {
  const moraleFactor = 0.55 + 0.45 * (army.morale / 100);
  const supplyFactor = army.supplied ? 1 : 0.7;
  return army.strength * moraleFactor * supplyFactor;
}

/** Territory-graph distance in hops; Infinity when unreachable. */
export function hopDistance(graph: GeoGraph, from: string, to: string): number {
  if (from === to) return 0;
  const seen = new Set([from]);
  let frontier = [from];
  for (let depth = 1; depth <= 12; depth++) {
    const next: string[] = [];
    for (const t of frontier) {
      for (const n of neighbourTerritories(graph, t)) {
        if (seen.has(n)) continue;
        if (n === to) return depth;
        seen.add(n);
        next.push(n);
      }
    }
    if (next.length === 0) break;
    frontier = next;
  }
  return Infinity;
}

/**
 * Is this province exposed — does the player already stand next to it?
 *
 * Used both ways: a rival province with an enemy beside it needs defending,
 * and a player province with no neighbouring defence is worth taking.
 */
export function adjacentEnemyPower(input: StrategyInput, territoryId: string, enemy: FactionId): number {
  return neighbourTerritories(input.graph, territoryId)
    .reduce((sum, n) => sum + garrisonOf(input, n, enemy), 0);
}

/**
 * Score one army moving on one province. Higher is better; -Infinity means
 * "never". The weights are tuned so that the ordering, not the magnitude,
 * carries the decision — every term is bounded so no single one dominates.
 */
export function scoreMove(input: StrategyInput, army: StrategyArmy, target: string): { score: number; motive: StrategyChoice['motive'] } | null {
  const owner = input.owners[target] ?? 'neutral';
  if (owner === 'rival') return null;                 // already ours
  if (target === army.territoryId) return null;

  const hops = hopDistance(input.graph, army.territoryId, target);
  if (!Number.isFinite(hops)) return null;            // cannot be marched on

  const power = effectivePower(army);
  const defence = garrisonOf(input, target, owner === 'player' ? 'player' : 'neutral');
  const odds = defence <= 0 ? 3 : power / defence;

  // Distance is a real cost: a long march arrives tired and exposes the
  // provinces left behind. Two hops is the sweet spot, beyond that it decays.
  const distancePenalty = Math.min(hops, 8) * 9;

  if (owner === 'neutral') {
    // Free ground. Worth taking whenever nothing better presents itself — the
    // old AI never did this once in a whole campaign.
    const base = 46 + (defence <= 0 ? 14 : 0);
    return { score: base - distancePenalty, motive: 'claim-neutral' };
  }

  // Player-held from here on.
  if (odds < MIN_ODDS) return null;                   // do not feed the grinder

  const isCapital = target === input.playerCapital;
  // Taking the enemy capital is the win condition, so it carries the most
  // weight — but only once the odds justify it, which is why this sits after
  // the odds gate rather than before it.
  const capitalBonus = isCapital ? 40 + 45 * input.aggression : 0;
  const oddsBonus = Math.min(odds, 3) * 22;
  // A province the player cannot quickly reinforce is worth more than one
  // ringed by their armies.
  const isolationBonus = Math.max(0, 26 - adjacentEnemyPower(input, target, 'player') / 8);

  return {
    score: 34 + capitalBonus + oddsBonus + isolationBonus - distancePenalty,
    motive: isCapital ? 'strike-capital' : 'take-province',
  };
}

/**
 * The rival's orders for this turn.
 *
 * Order of business, and none of it was in the old version:
 *   1. An army too weak or cut off withdraws to friendly supplied ground.
 *   2. A threatened capital pulls the nearest army home.
 *   3. Everything else takes the best-scoring target, with a concentration
 *      bonus so a second army reinforces the first rather than opening a
 *      second front the rival cannot hold.
 */
export function planRivalOrders(input: StrategyInput): StrategyChoice[] {
  const choices: StrategyChoice[] = [];
  const claimed = new Map<string, number>();          // target → armies sent

  const rivalArmies = input.armies
    .filter(a => a.faction === 'rival' && !a.march)
    // Strongest first: the best army gets first pick of the best target, and
    // the concentration bonus then pulls the weaker ones in behind it.
    .sort((a, b) => effectivePower(b) - effectivePower(a) || a.id.localeCompare(b.id));

  const rivalHeld = Object.keys(input.owners).filter(t => input.owners[t] === 'rival');

  for (const army of rivalArmies) {
    // 1. Withdraw a broken or starving army to the nearest friendly province.
    const spent = army.strength < WITHDRAW_STRENGTH || (!army.supplied && army.strength < 60);
    if (spent) {
      const refuge = rivalHeld
        .filter(t => t !== army.territoryId)
        .map(t => ({ t, d: hopDistance(input.graph, army.territoryId, t) }))
        .filter(x => Number.isFinite(x.d))
        .sort((a, b) => a.d - b.d || a.t.localeCompare(b.t))[0];
      if (refuge) {
        choices.push({ armyId: army.id, target: refuge.t, score: 1000, motive: 'withdraw' });
        continue;
      }
    }

    // 2. Defend the capital when enemy power actually stands next to it —
    //    the old check only fired when a player army had already *declared* a
    //    march on it, which the rival has no way to know.
    const cap = input.rivalCapital;
    if (cap && army.territoryId !== cap) {
      const threat = adjacentEnemyPower(input, cap, 'player');
      const homeGuard = garrisonOf(input, cap, 'rival');
      if (threat > homeGuard * 1.1 && Number.isFinite(hopDistance(input.graph, army.territoryId, cap))) {
        choices.push({ armyId: army.id, target: cap, score: 900, motive: 'defend-capital' });
        continue;
      }
    }

    // 3. Best available target.
    let best: StrategyChoice | null = null;
    for (const target of Object.keys(input.owners)) {
      const scored = scoreMove(input, army, target);
      if (!scored) continue;
      // Concentration: converging on a target another army already chose is
      // worth more than opening a front alone, but with diminishing returns so
      // the whole host does not pile onto one province.
      const already = claimed.get(target) ?? 0;
      const concentration = already === 0 ? 0 : already === 1 ? 18 : 4;
      // A small deterministic jitter breaks ties without making the AI
      // erratic — same seed, same campaign, same decisions.
      const jitter = input.rng() * 4;
      const score = scored.score + concentration + jitter;
      if (!best || score > best.score) best = { armyId: army.id, target, score, motive: scored.motive };
    }

    if (best) {
      choices.push(best);
      claimed.set(best.target, (claimed.get(best.target) ?? 0) + 1);
    } else {
      choices.push({ armyId: army.id, target: army.territoryId, score: 0, motive: 'hold' });
    }
  }

  return choices;
}

/** The engine wants a plain army → target map; 'hold' means no order. */
export function rivalOrderMap(input: StrategyInput): Record<string, string> {
  const out: Record<string, string> = {};
  for (const c of planRivalOrders(input)) {
    if (c.motive === 'hold') continue;
    out[c.armyId] = c.target;
  }
  return out;
}

/** Aggression rises with the turn count and with how much ground it has lost. */
export function aggressionFor(turn: number, rivalProvinces: number, totalProvinces: number): number {
  const clock = Math.min(1, turn / 24);
  const share = totalProvinces > 0 ? rivalProvinces / totalProvinces : 0.5;
  // Losing makes it press harder, not fold — a campaign that gets easier the
  // better you do is the one failure a strategy game cannot afford.
  const desperation = Math.max(0, 0.5 - share) * 1.4;
  return Math.max(0, Math.min(1, clock * 0.7 + desperation));
}

/** Exported for the path cost the engine uses when it actually moves. */
export function marchPath(graph: GeoGraph, from: string, to: string, hostile: Set<string>) {
  return findTerritoryPath(graph, from, to, { hostile, hostilePenalty: 1.8 });
}
