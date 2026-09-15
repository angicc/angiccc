// ─── The Atlas: model ─────────────────────────────────────────────────────────
// Eras & Lessons II turns the curriculum into a map you uncover by reading it.
//
// The existing Territory Map is a browsing surface: thirty-odd curated topics,
// each opened on its own, in any order, with no relationship to what the
// learner has actually studied. Finishing every lesson in the app and finishing
// none of them produce an identical map. The Atlas is the other half of that
// idea - the same geometry, ordered by time, revealed by progress.
//
// Nothing here replaces Territory Map. Pro subscribers bought that feature and
// it stays exactly as it is; the Atlas is an additional Master surface built on
// the same data.

import { LESSONS } from '@/features/content/lessonsData';
import { LESSON_START_YEAR } from '@/features/content/lessonChronology';
import { TERRITORY_TOPICS } from '@/features/content/timelineTerritoryData';
import type { Lesson } from '@/types';

/**
 * The era vocabularies disagree and always have: the curriculum calls it
 * `middle-ages`, the territory topics call it `medieval`. Every lookup that
 * crosses between them goes through here, because the mismatch fails silently -
 * an era simply finds no topics and the map comes up empty.
 */
const ERA_ALIASES: Record<string, string[]> = {
  prehistoric: ['prehistoric'],
  ancient: ['ancient'],
  byzantine: ['byzantine'],
  'middle-ages': ['middle-ages', 'medieval'],
  'early-modern': ['early-modern'],
  modern: ['modern'],
};

export function topicErasFor(eraId: string): string[] {
  return ERA_ALIASES[eraId] ?? [eraId];
}

/** One lesson, placed on the era's timeline. */
export interface AtlasFrame {
  lessonId: string;
  title: string;
  eraId: string;
  /** The year the lesson's subject begins - the same anchor the era list sorts by. */
  year: number;
  /** Territory topic whose geometry covers this year, if any. */
  topicId: string | null;
  /** Position in the era, 1-based, in chronological order. */
  index: number;
}

const byYear = (a: { year: number }, b: { year: number }) => a.year - b.year;

/**
 * The territory topic to draw for a given year.
 *
 * Prefers a topic whose range actually contains the year. Falling back to the
 * nearest one matters more than it sounds: without it, a lesson that happens to
 * sit in a gap between two curated topics renders an empty map, which reads as
 * a broken feature rather than as missing data.
 */
export function topicForYear(eraId: string, year: number): string | null {
  const eras = topicErasFor(eraId);
  const candidates = TERRITORY_TOPICS.filter(t => eras.includes(t.era));
  if (candidates.length === 0) return null;

  const containing = candidates.filter(t => year >= t.yearRange[0] && year <= t.yearRange[1]);
  if (containing.length > 0) {
    // The tightest range wins: a topic spanning eleven centuries tells you less
    // about 1453 than one spanning thirty years around it.
    return containing.reduce((best, t) =>
      (t.yearRange[1] - t.yearRange[0]) < (best.yearRange[1] - best.yearRange[0]) ? t : best,
    ).id;
  }

  const distance = (t: (typeof candidates)[number]) =>
    year < t.yearRange[0] ? t.yearRange[0] - year : year - t.yearRange[1];
  return candidates.reduce((best, t) => (distance(t) < distance(best) ? t : best)).id;
}

/** Every lesson in an era, in the order the history happened. */
export function atlasFrames(eraId: string, lessons: Lesson[] = LESSONS): AtlasFrame[] {
  return lessons
    .filter(l => l.eraId === eraId)
    .map(l => ({
      lessonId: l.id,
      title: l.title,
      eraId,
      year: LESSON_START_YEAR[l.id] ?? 0,
      topicId: topicForYear(eraId, LESSON_START_YEAR[l.id] ?? 0),
      index: 0,
    }))
    .sort(byYear)
    .map((f, i) => ({ ...f, index: i + 1 }));
}

/** The span an era's scrubber covers. */
export function atlasSpan(frames: AtlasFrame[]): [number, number] {
  if (frames.length === 0) return [0, 0];
  return [frames[0].year, frames[frames.length - 1].year];
}

/**
 * The frame a scrubber position lands on: the latest frame at or before the
 * year, so dragging between two lessons keeps showing the earlier one rather
 * than blanking out.
 */
export function frameAtYear(frames: AtlasFrame[], year: number): AtlasFrame | null {
  let found: AtlasFrame | null = null;
  for (const f of frames) {
    if (f.year <= year) found = f;
    else break;
  }
  return found ?? frames[0] ?? null;
}

/**
 * Fog of war, earned rather than clicked.
 *
 * Territory Map reveals a region when you click it, which makes the fog a
 * formality. Here it tracks the curriculum: a frame is lit once its lesson is
 * read. That is the whole point of the feature - the map is a record of what
 * you have actually studied.
 */
export function isRevealed(frame: AtlasFrame, completedLessons: string[]): boolean {
  return completedLessons.includes(frame.lessonId);
}

export interface AtlasProgress {
  revealed: number;
  total: number;
  /** The most recent year the learner has uncovered, or null before they start. */
  frontier: number | null;
}

export function atlasProgress(frames: AtlasFrame[], completedLessons: string[]): AtlasProgress {
  const done = frames.filter(f => isRevealed(f, completedLessons));
  return {
    revealed: done.length,
    total: frames.length,
    frontier: done.length > 0 ? done[done.length - 1].year : null,
  };
}

/** Frames across every era, chronologically - the spine of "Follow a Territory". */
export function allFrames(lessons: Lesson[] = LESSONS): AtlasFrame[] {
  return Object.keys(ERA_ALIASES)
    .flatMap(era => atlasFrames(era, lessons))
    .sort(byYear);
}

/**
 * The signed-in user id, read straight from storage.
 *
 * The Atlas needs it during `useState`'s initialiser to choose which era to
 * open on, which runs before any context value is available to that component.
 */
export function readCurrentUserId(): string | null {
  try {
    // AuthContext stores the bare id under this key, not a JSON blob.
    return localStorage.getItem('historify:currentUserId');
  } catch {
    return null;   // storage blocked (private window, embedded preview)
  }
}
