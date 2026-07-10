// ─── Concept-gap tracker: the Clio ↔ Smart Quiz personalization loop ─────────
// Every miss anywhere in the app (era quiz, smart quiz, territory quiz) is
// recorded as a decaying gap signal keyed by era + concept. Consumers:
//   1. Smart Quiz — multiplies its era weighting by the live gap factor, so
//      question selection homes in on the student's ACTIVE struggles rather
//      than only their historical era averages.
//   2. Clio — getGapSummary() is injected into the tutor's lesson context so
//      the AI knows what the student keeps missing and can steer Socratic
//      questions there without being asked.
// Signals decay with a half-life so a gap closed weeks ago stops steering.

export interface ConceptGap {
  eraId: string;
  concept: string;       // question topic / lesson title fragment
  misses: number;        // decayed miss weight
  lastMissAt: string;    // ISO timestamp
}

const KEY = 'historify:gaps';
const HALF_LIFE_DAYS = 14;
const MAX_GAPS = 60;

function storageKey(userId?: string) {
  return userId ? `${KEY}:${userId}` : KEY;
}

function load(userId?: string): ConceptGap[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    const parsed = raw ? (JSON.parse(raw) as ConceptGap[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function save(gaps: ConceptGap[], userId?: string) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(gaps.slice(0, MAX_GAPS)));
  } catch { /* best-effort */ }
}

/** Exponential decay of a miss weight since its last update. */
function decayed(g: ConceptGap, now: number): number {
  const ageDays = (now - new Date(g.lastMissAt).getTime()) / 86_400_000;
  return g.misses * Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
}

/** Record a missed question. `concept` = the question's topic/lesson label. */
export function recordMiss(eraId: string, concept: string, userId?: string) {
  const now = new Date().toISOString();
  const gaps = load(userId);
  const hit = gaps.find(g => g.eraId === eraId && g.concept === concept);
  if (hit) {
    hit.misses = decayed(hit, Date.now()) + 1;
    hit.lastMissAt = now;
  } else {
    gaps.push({ eraId, concept, misses: 1, lastMissAt: now });
  }
  gaps.sort((a, b) => decayed(b, Date.now()) - decayed(a, Date.now()));
  save(gaps, userId);
}

/** Live gap weight per era, 1.0 (no signal) … 2.0 (heavy active struggle). */
export function eraGapFactor(eraId: string, userId?: string): number {
  const now = Date.now();
  const total = load(userId)
    .filter(g => g.eraId === eraId)
    .reduce((sum, g) => sum + decayed(g, now), 0);
  return 1 + Math.min(1, total / 8);
}

/** Top active gaps, strongest first. */
export function topGaps(userId?: string, limit = 5): ConceptGap[] {
  const now = Date.now();
  return load(userId)
    .map(g => ({ ...g, misses: decayed(g, now) }))
    .filter(g => g.misses >= 0.4)
    .sort((a, b) => b.misses - a.misses)
    .slice(0, limit);
}

/** Compact English summary for injection into Clio's context window. */
export function getGapSummary(userId?: string): string | undefined {
  const gaps = topGaps(userId, 4);
  if (gaps.length === 0) return undefined;
  return `The student's active knowledge gaps (most-missed concepts, weight in parentheses): ${gaps
    .map(g => `${g.concept} [${g.eraId}] (${g.misses.toFixed(1)})`)
    .join('; ')}. Where natural, steer explanations and follow-up questions toward these.`;
}
