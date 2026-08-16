// ─── Profile statistics ───────────────────────────────────────────────────────
// Everything the Profile Overview shows beyond the raw counters, derived on
// read from the stores that already exist. Nothing here is persisted, so these
// numbers cannot drift from the progress they describe.
import type { UserProgress, Achievement } from '@/types';
import { ACHIEVEMENTS, achievementProgress } from './xpSystem';
import { getTimeSpent, dayKey } from './timeTracking';
import { ERAS } from '@/features/content/erasData';

export interface HeatmapDay {
  /** `YYYY-MM-DD`, local. */
  date: string;
  seconds: number;
  /** 0 (nothing) to 4 (a long session) — drives the colour ramp. */
  level: 0 | 1 | 2 | 3 | 4;
}

/**
 * A calendar grid of study activity, most recent day last, aligned so each
 * column is one week starting on Monday.
 */
export function studyHeatmap(userId: string, weeks = 12): HeatmapDay[] {
  const { byDay } = getTimeSpent(userId);
  const today = new Date();
  today.setHours(12, 0, 0, 0); // midday, so DST shifts cannot skip a day

  // Walk back to the Monday that starts the earliest week shown.
  const start = new Date(today);
  const isoWeekday = (start.getDay() + 6) % 7; // Mon=0 … Sun=6
  start.setDate(start.getDate() - isoWeekday - (weeks - 1) * 7);

  const days: HeatmapDay[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d > today) break; // never render the future
    const date = dayKey(d);
    const seconds = byDay[date] ?? 0;
    days.push({ date, seconds, level: heatLevel(seconds) });
  }
  return days;
}

function heatLevel(seconds: number): 0 | 1 | 2 | 3 | 4 {
  if (seconds <= 0) return 0;
  if (seconds < 5 * 60) return 1;
  if (seconds < 15 * 60) return 2;
  if (seconds < 40 * 60) return 3;
  return 4;
}

export interface PersonalRecords {
  totalSeconds: number;
  /** Seconds studied in the last 7 calendar days, today included. */
  weekSeconds: number;
  longestStreak: number;
  currentStreak: number;
  /** Era with the most time invested, or null before any is recorded. */
  favouriteEraId: string | null;
  favouriteEraSeconds: number;
  bestQuizScore: number | null;
  perfectQuizzes: number;
  /** The single day with the most study time, and how much. */
  bestDay: { date: string; seconds: number } | null;
  daysActive: number;
}

export function personalRecords(userId: string, p: UserProgress): PersonalRecords {
  const spent = getTimeSpent(userId);
  const totalSeconds = Object.values(spent.byEra).reduce((a, b) => a + b, 0) + spent.other;

  const since = new Date();
  since.setDate(since.getDate() - 6);
  const from = dayKey(since);
  const weekSeconds = Object.entries(spent.byDay)
    .filter(([d]) => d >= from)
    .reduce((a, [, s]) => a + s, 0);

  // Only real eras count as a "favourite" — `other` is unattributed time.
  const eraEntries = Object.entries(spent.byEra).filter(([id, s]) => s > 0 && ERAS.some(e => e.id === id));
  const favourite = eraEntries.sort((a, b) => b[1] - a[1])[0];

  const dayEntries = Object.entries(spent.byDay).filter(([, s]) => s > 0);
  const best = dayEntries.sort((a, b) => b[1] - a[1])[0];

  // Era quizzes only: Smart Quiz writes its own key and is not an era score.
  const eraQuizIds = new Set(ERAS.map(e => e.quizId));
  const eraScores = Object.entries(p.quizScores).filter(([id]) => eraQuizIds.has(id)).map(([, s]) => s);

  return {
    totalSeconds,
    weekSeconds,
    // A learner whose current run is their best may predate longestStreak
    // being recorded at all, so take whichever is higher.
    longestStreak: Math.max(p.longestStreak ?? 0, p.streak),
    currentStreak: p.streak,
    favouriteEraId: favourite?.[0] ?? null,
    favouriteEraSeconds: favourite?.[1] ?? 0,
    bestQuizScore: eraScores.length > 0 ? Math.max(...eraScores) : null,
    perfectQuizzes: eraScores.filter(s => s >= 100).length,
    bestDay: best ? { date: best[0], seconds: best[1] } : null,
    daysActive: dayEntries.length,
  };
}

export interface NextMilestone {
  achievement: Achievement;
  current: number;
  target: number;
  pct: number;
}

/**
 * The locked achievements a learner is closest to earning.
 *
 * The Achievements tab lists everything flat, which tells someone what exists
 * but not what to do next. Ranking by how nearly complete each one is turns
 * the list into a goal.
 */
export function nextMilestones(p: UserProgress, limit = 4): NextMilestone[] {
  return ACHIEVEMENTS
    .filter(a => !p.achievements.includes(a.id))
    .map(a => {
      const prog = achievementProgress(a.condition, p);
      if (!prog || prog.target <= 0) return null;
      const current = Math.min(prog.current, prog.target);
      return { achievement: a, current, target: prog.target, pct: (current / prog.target) * 100 };
    })
    .filter((m): m is NextMilestone => m !== null)
    // Closest first, but ignore the ones not yet begun — "0 of 5,000 XP" is
    // not a milestone anyone is approaching.
    .filter(m => m.pct > 0 && m.pct < 100)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, limit);
}
