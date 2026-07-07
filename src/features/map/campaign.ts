// ─── Territory Conquest Campaign ──────────────────────────────────────────────
// A persistent conquest metagame layered over the Territory Map: each era is a
// campaign of chronologically-ordered stages (one per territory topic). A stage
// is a 5-question challenge drawn from the territory quiz bank; scoring at
// least 60% claims the region, higher scores earn up to three stars. Stages
// unlock sequentially, conquered regions accumulate into a commander rank, and
// Master subscribers can raise the stakes with Legendary mode (flawless
// conquests only, double XP). Everything here is deterministic and
// storage-backed — no randomness beyond question sampling.
import { TERRITORY_TOPICS, type TerritoryTopic } from '@/features/content/timelineTerritoryData';
import { getQuestionsForTopic, type TerritoryQuizQuestion } from '@/i18n/territoryMapQuizData';

export type CampaignEra = TerritoryTopic['era'];

export const CAMPAIGN_ERAS: CampaignEra[] = ['ancient', 'medieval', 'early-modern', 'modern'];

/** Stage count of questions per conquest attempt. */
export const STAGE_QUESTIONS = 5;

/** Chronologically ordered topics for one era's campaign. */
export function getEraCampaignTopics(era: CampaignEra): TerritoryTopic[] {
  return TERRITORY_TOPICS
    .filter(tp => tp.era === era)
    .sort((a, b) => a.yearRange[0] - b.yearRange[0]);
}

// ── Persistent state ─────────────────────────────────────────────────────────

export interface StageResult {
  stars: 0 | 1 | 2 | 3;
  bestScore: number;      // best correct-answer count achieved
  total: number;          // question count of the best run
  xpEarned: number;       // cumulative XP already banked for this stage
  legendary: boolean;     // best result was earned in Legendary mode
  completedAt: string;    // ISO timestamp of the best run
}

export interface CampaignState {
  stages: Record<string, StageResult>; // keyed by topic id
}

const CAMPAIGN_KEY = 'historify:map:campaign';

export function loadCampaign(userId?: string): CampaignState {
  try {
    const raw = localStorage.getItem(userId ? `${CAMPAIGN_KEY}:${userId}` : CAMPAIGN_KEY);
    const parsed = raw ? (JSON.parse(raw) as CampaignState) : null;
    if (parsed && parsed.stages && typeof parsed.stages === 'object') return parsed;
  } catch { /* fallthrough */ }
  return { stages: {} };
}

export function saveCampaign(state: CampaignState, userId?: string) {
  try {
    localStorage.setItem(userId ? `${CAMPAIGN_KEY}:${userId}` : CAMPAIGN_KEY, JSON.stringify(state));
  } catch { /* best-effort */ }
}

// ── Scoring ──────────────────────────────────────────────────────────────────

/**
 * Stars for a finished run. Standard mode: conquer at ≥60% (1★), ≥80% (2★),
 * perfect (3★). Legendary mode: only a flawless run conquers — straight to 3★.
 */
export function starsForScore(correct: number, total: number, legendary: boolean): 0 | 1 | 2 | 3 {
  if (total <= 0) return 0;
  if (legendary) return correct === total ? 3 : 0;
  if (correct === total) return 3;
  if (correct / total >= 0.8) return 2;
  if (correct / total >= 0.6) return 1;
  return 0;
}

/** Total XP a result is worth. Legendary doubles the take. */
export function xpForStars(stars: 0 | 1 | 2 | 3, legendary: boolean): number {
  return stars * 40 * (legendary ? 2 : 1);
}

/**
 * Record a finished run. Returns the updated state plus the XP delta actually
 * owed (only improvements pay out, so stages cannot be farmed).
 */
export function recordStageRun(
  state: CampaignState,
  topicId: string,
  correct: number,
  total: number,
  legendary: boolean,
): { state: CampaignState; stars: 0 | 1 | 2 | 3; xpDelta: number } {
  const stars = starsForScore(correct, total, legendary);
  const prev = state.stages[topicId];
  const runXp = xpForStars(stars, legendary);
  const xpDelta = Math.max(0, runXp - (prev?.xpEarned ?? 0));
  const improved = !prev || stars > prev.stars || (stars === prev.stars && correct > prev.bestScore);
  const nextResult: StageResult = improved
    ? {
        stars: prev && prev.stars > stars ? prev.stars : stars,
        bestScore: Math.max(correct, prev?.bestScore ?? 0),
        total,
        xpEarned: (prev?.xpEarned ?? 0) + xpDelta,
        legendary: legendary || (prev?.legendary ?? false),
        completedAt: new Date().toISOString(),
      }
    : { ...prev, xpEarned: prev.xpEarned + xpDelta };
  return {
    state: { stages: { ...state.stages, [topicId]: nextResult } },
    stars,
    xpDelta,
  };
}

// ── Progression ──────────────────────────────────────────────────────────────

/** A stage is playable when it is the era's first, or its predecessor is conquered. */
export function isStageUnlocked(state: CampaignState, eraTopics: TerritoryTopic[], topicId: string): boolean {
  const idx = eraTopics.findIndex(tp => tp.id === topicId);
  if (idx < 0) return false;
  if (idx === 0) return true;
  return (state.stages[eraTopics[idx - 1].id]?.stars ?? 0) >= 1;
}

export interface CampaignProgress {
  conquered: number;
  total: number;
  stars: number;
  maxStars: number;
}

export function eraProgress(state: CampaignState, eraTopics: TerritoryTopic[]): CampaignProgress {
  let conquered = 0, stars = 0;
  for (const tp of eraTopics) {
    const r = state.stages[tp.id];
    if ((r?.stars ?? 0) >= 1) conquered++;
    stars += r?.stars ?? 0;
  }
  return { conquered, total: eraTopics.length, stars, maxStars: eraTopics.length * 3 };
}

export function totalStars(state: CampaignState): number {
  return Object.values(state.stages).reduce((s, r) => s + (r?.stars ?? 0), 0);
}

/** Commander rank thresholds — translation keys resolved by the page. */
const RANKS: { minStars: number; key: 'tmap_camp_rank_1' | 'tmap_camp_rank_2' | 'tmap_camp_rank_3' | 'tmap_camp_rank_4' | 'tmap_camp_rank_5' }[] = [
  { minStars: 45, key: 'tmap_camp_rank_5' },
  { minStars: 30, key: 'tmap_camp_rank_4' },
  { minStars: 18, key: 'tmap_camp_rank_3' },
  { minStars: 8,  key: 'tmap_camp_rank_2' },
  { minStars: 0,  key: 'tmap_camp_rank_1' },
];

export function commanderRankKey(stars: number): (typeof RANKS)[number]['key'] {
  return (RANKS.find(r => stars >= r.minStars) ?? RANKS[RANKS.length - 1]).key;
}

// ── Stage question sampling ──────────────────────────────────────────────────

/** Sample up to STAGE_QUESTIONS questions for a conquest run (Fisher–Yates). */
export function drawStageQuestions(topicId: string): TerritoryQuizQuestion[] {
  const pool = [...getQuestionsForTopic(topicId)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, STAGE_QUESTIONS);
}
