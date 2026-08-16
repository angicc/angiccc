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
  /** local calendar day `YYYY-MM-DD` → seconds studied that day */
  byDay: Record<string, number>;
}

/** Local (not UTC) calendar day, so a 23:30 session counts as today. */
export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getTimeSpent(userId: string): TimeSpent {
  try {
    const raw = localStorage.getItem(KEY(userId));
    if (!raw) return { byEra: {}, other: 0, byDay: {} };
    const parsed = JSON.parse(raw) as Partial<TimeSpent>;
    // byDay arrived after byEra/other shipped, so records written by an older
    // build have no daily buckets. Default it rather than assuming its shape.
    return { byEra: parsed.byEra ?? {}, other: parsed.other ?? 0, byDay: parsed.byDay ?? {} };
  } catch {
    return { byEra: {}, other: 0, byDay: {} };
  }
}

/** Add studied seconds to an era (or to `other` when there is no era). */
export function recordStudySeconds(userId: string, eraId: string | null, seconds: number): void {
  if (!userId || seconds <= 0) return;
  const spent = getTimeSpent(userId);
  if (eraId) spent.byEra[eraId] = (spent.byEra[eraId] ?? 0) + seconds;
  else spent.other += seconds;
  const key = dayKey();
  spent.byDay[key] = (spent.byDay[key] ?? 0) + seconds;
  // Two weeks is all the pacing model looks at; keeping more would grow the
  // record without bound for a daily learner.
  prune(spent.byDay, 30);
  try {
    localStorage.setItem(KEY(userId), JSON.stringify(spent));
  } catch {
    /* storage full or unavailable — the tally just stops growing */
  }
}

function prune(byDay: Record<string, number>, keepDays: number): void {
  const keys = Object.keys(byDay).sort();
  for (const k of keys.slice(0, Math.max(0, keys.length - keepDays))) delete byDay[k];
}

export interface StudyRhythm {
  /** Days in the window on which any time at all was studied. */
  activeDays: number;
  /** Length of the window examined, in days. */
  windowDays: number;
  /** Median seconds on the days they DID study — 0 when they never have. */
  medianActiveSeconds: number;
  /** Seconds studied in the window. */
  totalSeconds: number;
}

/**
 * How the learner actually studies, over the last `windowDays` calendar days.
 *
 * The median of *active* days is deliberate: averaging across all 14 days would
 * report a learner who does one focused 40-minute session a week as a
 * 3-minute-a-day learner, and schedule them a week they'd never follow.
 */
export function studyRhythm(userId: string, windowDays = 14): StudyRhythm {
  const { byDay } = getTimeSpent(userId);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (windowDays - 1));
  const from = dayKey(cutoff);

  const values = Object.entries(byDay)
    .filter(([day, secs]) => day >= from && secs > 0)
    .map(([, secs]) => secs)
    .sort((a, b) => a - b);

  const mid = Math.floor(values.length / 2);
  const medianActiveSeconds = values.length === 0
    ? 0
    : values.length % 2 === 1
      ? values[mid]
      : Math.round((values[mid - 1] + values[mid]) / 2);

  return {
    activeDays: values.length,
    windowDays,
    medianActiveSeconds,
    totalSeconds: values.reduce((a, b) => a + b, 0),
  };
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
