// ─── Clio's Historical Parallels ─────────────────────────────────────────────
// The intellectual heart of the battle layer: every engagement is matched to a
// REAL battle from history whose tactical shape it echoes — chosen
// deterministically from the matchup (your tactic vs theirs), the ground, the
// weather and the outcome. After the fighting, Clio's Debrief cites the
// parallel, tells the player what happened there, and distils the transferable
// principle — so each battle in Imperium doubles as a short
// history lesson. All text lives in the imperium catalog (6 languages);
// this module only carries keys + the matching logic, which is pure and
// testable.
import type { Tactic, Weather } from './combatMatrix';
import type { TerrainKind } from './geoGraph';

export interface HistoricalParallel {
  id: string;
  /** Real battle name + year, e.g. "Hastings, 1066". */
  titleKey: string;
  /** 2–3 sentences: what happened there, in the same tactical shape. */
  storyKey: string;
  /** One transferable principle the player should carry forward. */
  principleKey: string;
  /** The tactical shape this parallel matches. */
  match: {
    tactics?: [Tactic, Tactic][];   // [player, enemy] pairs (order matters)
    terrain?: TerrainKind[];
    weather?: Weather[];
  };
  /** Higher = more specific match; the best-scoring parallel wins. */
  weight: number;
}

/** The codex: nine tactical shapes, each anchored to a real engagement. */
export const PARALLELS: HistoricalParallel[] = [
  {
    id: 'hastings',
    titleKey: 'imp_par_hastings_t', storyKey: 'imp_par_hastings_s', principleKey: 'imp_par_hastings_p',
    match: { tactics: [['charge', 'hold']] },
    weight: 3,
  },
  {
    id: 'agincourt',
    titleKey: 'imp_par_agincourt_t', storyKey: 'imp_par_agincourt_s', principleKey: 'imp_par_agincourt_p',
    match: { tactics: [['charge', 'volley'], ['hold', 'volley']], weather: ['rain', 'storm'] },
    weight: 4,
  },
  {
    id: 'crecy',
    titleKey: 'imp_par_crecy_t', storyKey: 'imp_par_crecy_s', principleKey: 'imp_par_crecy_p',
    match: { tactics: [['volley', 'charge']] },
    weight: 3,
  },
  {
    id: 'carrhae',
    titleKey: 'imp_par_carrhae_t', storyKey: 'imp_par_carrhae_s', principleKey: 'imp_par_carrhae_p',
    match: { tactics: [['volley', 'hold'], ['volley', 'volley']], terrain: ['desert'] },
    weight: 4,
  },
  {
    id: 'thermopylae',
    titleKey: 'imp_par_thermopylae_t', storyKey: 'imp_par_thermopylae_s', principleKey: 'imp_par_thermopylae_p',
    match: { tactics: [['hold', 'charge'], ['hold', 'hold']], terrain: ['mountain', 'river'] },
    weight: 4,
  },
  {
    id: 'cannae',
    titleKey: 'imp_par_cannae_t', storyKey: 'imp_par_cannae_s', principleKey: 'imp_par_cannae_p',
    match: { tactics: [['charge', 'charge']], terrain: ['plain'] },
    weight: 3,
  },
  {
    id: 'stamford',
    titleKey: 'imp_par_stamford_t', storyKey: 'imp_par_stamford_s', principleKey: 'imp_par_stamford_p',
    match: { tactics: [['hold', 'charge'], ['charge', 'hold']], terrain: ['river'] },
    weight: 4,
  },
  {
    id: 'mohi',
    titleKey: 'imp_par_mohi_t', storyKey: 'imp_par_mohi_s', principleKey: 'imp_par_mohi_p',
    match: { tactics: [['volley', 'hold'], ['volley', 'charge']], terrain: ['river', 'plain'] },
    weight: 2,
  },
  {
    id: 'towton',
    titleKey: 'imp_par_towton_t', storyKey: 'imp_par_towton_s', principleKey: 'imp_par_towton_p',
    match: { tactics: [['volley', 'volley'], ['hold', 'volley']], weather: ['snow'] },
    weight: 5,
  },
];

export interface ParallelQuery {
  playerTactic: Tactic;
  enemyTactic: Tactic;
  terrain: TerrainKind;
  weather: Weather;
}

/**
 * Deterministically pick the historical battle this engagement most resembles.
 * Scoring: tactic-pair match is mandatory-ish (heavily weighted), terrain and
 * weather refine. Always returns something — history has a parallel for
 * every folly.
 */
export function findParallel(q: ParallelQuery): HistoricalParallel {
  let best: HistoricalParallel = PARALLELS[0];
  let bestScore = -1;
  for (const p of PARALLELS) {
    let score = 0;
    if (p.match.tactics?.some(([a, b]) => a === q.playerTactic && b === q.enemyTactic)) score += 10;
    if (p.match.terrain?.includes(q.terrain)) score += 4;
    if (p.match.weather?.includes(q.weather)) score += 4;
    score += p.weight;
    if (score > bestScore) { bestScore = score; best = p; }
  }
  return best;
}
