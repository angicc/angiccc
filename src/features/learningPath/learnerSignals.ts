// ─── Learner signals: what the week plan should actually respond to ──────────
// The mastery model answers "how much do they know?". This answers the other
// two questions a real tutor asks before scheduling anything: "how do they
// study?" and "what kind of weakness is this?".
//
// The old generator read four numbers (weakest era, second weakest, that era's
// quiz score, overall mastery) and produced the same seven-day shape for
// everyone. A learner returning after three weeks got the same week as a daily
// learner; a learner whose problem was retention — high coverage, low recall —
// was handed more reading. These signals exist to end both of those.
import { studyRhythm } from '@/features/progress/timeTracking';
import type { MasterySnapshot, EraMastery } from './masteryModel';
import type { EraId } from '@/types';

/** What kind of work the weakest era needs. */
export type FocusMode = 'coverage' | 'retention' | 'balanced';

export interface LearnerSignals {
  /** The era this week should work on — see `pickFocusEra`. */
  focusEraId: EraId;
  /** Minutes to schedule on a study day, from their real median session. */
  dailyBudgetMinutes: number;
  /** Study days to schedule this week — never more than they can sustain. */
  studyDays: number;
  activeDaysLast14: number;
  medianSessionMinutes: number;
  daysSinceActivity: number | null;
  /** Studied before, but has been away long enough to need a warm-up. */
  returning: boolean;
  /** No recorded study time at all — schedule on optimistic defaults. */
  fresh: boolean;
  mode: FocusMode;
  /** Plain reason for `mode`, shown to the learner and given to Clio. */
  modeReason: string;
}

/** Away this many days ⇒ the week opens with review instead of new material. */
const RETURNING_AFTER_DAYS = 4;

/** Below this, an era the learner has begun still needs work before moving on. */
const CONSOLIDATED = 70;

const DEFAULT_BUDGET_MINUTES = 20;
const MIN_BUDGET_MINUTES = 10;
const MAX_BUDGET_MINUTES = 60;

function coveragePct(era: EraMastery): number {
  return era.lessonsTotal > 0 ? (era.lessonsDone / era.lessonsTotal) * 100 : 0;
}

/**
 * The era this week should work on.
 *
 * NOT simply `mastery.weakest`. An era the learner has never opened sits at 0%
 * and wins "weakest" outright, so a learner who has read eight of nine
 * Prehistory lessons and scored 48% on its quiz would be pointed at an
 * untouched era instead — and their real, diagnosed weakness would never be
 * addressed. Worse, the focus era would always have nothing read, so the
 * retention path below could essentially never trigger.
 *
 * A tutor finishes what the student started badly before opening a new front.
 * So: the weakest era they have actually begun and not yet consolidated;
 * failing that, the weakest overall — which is how a learner is moved onto new
 * ground once their current ground is solid.
 */
export function pickFocusEra(mastery: MasterySnapshot): EraMastery {
  const unconsolidated = mastery.eras
    .filter(e => e.lessonsDone > 0 && e.mastery < CONSOLIDATED)
    .sort((a, b) => a.mastery - b.mastery);
  return unconsolidated[0] ?? mastery.weakest;
}

/**
 * Decide what the focus era needs.
 *
 * Coverage and recall fail differently and want opposite medicine. Someone who
 * has read two of nine lessons needs to read; someone who has read eight of
 * nine and still answers at 55% does not need a ninth lesson, they need
 * retrieval practice. Reading `adaptivePct` and `quizPct` — both already
 * computed by the mastery model and both previously ignored by the scheduler —
 * is what separates the two.
 */
export function focusMode(era: EraMastery): { mode: FocusMode; reason: string } {
  const cov = coveragePct(era);
  const recallSignals = [era.adaptivePct, era.quizPct].filter((v): v is number => v !== null);
  const recall = recallSignals.length > 0
    ? recallSignals.reduce((a, b) => a + b, 0) / recallSignals.length
    : null;

  if (cov < 50 && (recall === null || recall >= 65)) {
    return { mode: 'coverage', reason: 'most of this era is still unread' };
  }
  if (cov >= 50 && recall !== null && recall < 65) {
    return { mode: 'retention', reason: 'the material has been read but is not sticking' };
  }
  if (cov >= 85 && recall === null) {
    return { mode: 'retention', reason: 'the era is read through but never tested' };
  }
  return { mode: 'balanced', reason: 'reading and recall are roughly in step' };
}

export function computeLearnerSignals(userId: string, mastery: MasterySnapshot): LearnerSignals {
  const rhythm = studyRhythm(userId, 14);
  const fresh = rhythm.activeDays === 0;

  const medianSessionMinutes = Math.round(rhythm.medianActiveSeconds / 60);
  const dailyBudgetMinutes = fresh
    ? DEFAULT_BUDGET_MINUTES
    : Math.min(MAX_BUDGET_MINUTES, Math.max(MIN_BUDGET_MINUTES, medianSessionMinutes));

  // Schedule the week they can actually finish. Someone who studied two days
  // out of fourteen abandons a seven-day plan on day three; give them four days
  // with room to beat it. Someone studying most days gets the full week.
  const studyDays = fresh
    ? 5
    : Math.min(7, Math.max(3, Math.round(rhythm.activeDays / 2) + 2));

  const { daysSinceActivity } = mastery;
  const returning = !fresh && daysSinceActivity !== null && daysSinceActivity >= RETURNING_AFTER_DAYS;

  const focusEra = pickFocusEra(mastery);
  const { mode, reason } = focusMode(focusEra);

  return {
    focusEraId: focusEra.eraId,
    dailyBudgetMinutes,
    studyDays,
    activeDaysLast14: rhythm.activeDays,
    medianSessionMinutes,
    daysSinceActivity,
    returning,
    fresh,
    mode,
    modeReason: reason,
  };
}
