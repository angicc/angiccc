// ─── Live study-time tracking ────────────────────────────────────────────────
// "Time Invested" on the Progress page used to sum lesson.estimatedMinutes over
// completed lessons — the catalogue's guess at how long a lesson *should* take,
// identical for every learner and unchanged by how long anyone actually read.
// A learner who skimmed a 15-minute lesson in two minutes was credited 15.
//
// This records real seconds instead, per era, while a lesson is genuinely open
// and being used.
//
// WHAT COUNTS AS STUDYING. Wall-clock time is the wrong measure: a tab left open
// overnight would report eight hours. Time accrues only while the document is
// visible AND the learner has interacted within IDLE_TIMEOUT_MS. That
// under-counts someone reading a long passage without touching anything, which
// is the safer direction to be wrong in — an inflated number is worthless.
//
// Seconds are flushed to storage as they accrue rather than on unload, because
// pagehide/beforeunload are unreliable on mobile.

const KEY = (userId: string) => `historify:timeSpent:${userId}`;

/** Idle after this long without pointer, key or scroll input. */
export const IDLE_TIMEOUT_MS = 90_000;

export interface TimeSpent {
  /** era id → seconds actually studied */
  byEra: Record<string, number>;
  /** seconds not attributable to an era (e.g. quizzes opened outside one) */
  other: number;
}

const EMPTY: TimeSpent = { byEra: {}, other: 0 };

export function getTimeSpent(userId: string): TimeSpent {
  try {
    const raw = localStorage.getItem(KEY(userId));
    if (!raw) return { ...EMPTY, byEra: {} };
    const parsed = JSON.parse(raw) as Partial<TimeSpent>;
    return { byEra: parsed.byEra ?? {}, other: parsed.other ?? 0 };
  } catch {
    return { ...EMPTY, byEra: {} };
  }
}

/** Add studied seconds to an era (or to `other` when there is no era). */
export function recordStudySeconds(userId: string, eraId: string | null, seconds: number): void {
  if (!userId || seconds <= 0) return;
  const spent = getTimeSpent(userId);
  if (eraId) spent.byEra[eraId] = (spent.byEra[eraId] ?? 0) + seconds;
  else spent.other += seconds;
  try {
    localStorage.setItem(KEY(userId), JSON.stringify(spent));
  } catch {
    /* storage full or unavailable — the tally just stops growing */
  }
}

/** Total seconds studied across every era. */
export function totalStudySeconds(userId: string): number {
  const spent = getTimeSpent(userId);
  return Object.values(spent.byEra).reduce((a, b) => a + b, 0) + spent.other;
}

/** `2h 05m` / `12m 30s` / `45s` — never an empty string. */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${String(s % 60).padStart(2, '0')}s`;
  return `${s}s`;
}
