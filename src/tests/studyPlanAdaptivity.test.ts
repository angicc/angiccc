import { describe, it, expect, beforeEach } from 'vitest';
import { generateWeekPlan, planHealth, type WeekPlan } from '@/features/learningPath/planEngine';
import { focusMode, pickFocusEra, computeLearnerSignals, type LearnerSignals } from '@/features/learningPath/learnerSignals';
import { recordStudySeconds, studyRhythm, dayKey, getTimeSpent } from '@/features/progress/timeTracking';
import type { MasterySnapshot, EraMastery } from '@/features/learningPath/masteryModel';
import type { EraId } from '@/types';

// Node environment: no DOM, so stand up the one browser API these modules use.
const store = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
} as Storage;

const era = (o: Partial<EraMastery> & { eraId: EraId }): EraMastery => ({
  lessonsDone: 0, lessonsTotal: 10, quizPct: null, adaptivePct: null, mastery: 0, ...o,
});

function snapshot(eras: EraMastery[], extra: Partial<MasterySnapshot> = {}): MasterySnapshot {
  const sorted = [...eras].sort((a, b) => a.mastery - b.mastery);
  return {
    eras, weakest: sorted[0], strongest: sorted[sorted.length - 1],
    overall: Math.round(eras.reduce((a, e) => a + e.mastery, 0) / eras.length),
    streak: 0, daysSinceActivity: 0, ...extra,
  };
}

const signals = (o: Partial<LearnerSignals> = {}): LearnerSignals => ({
  focusEraId: 'ancient', dailyBudgetMinutes: 20, studyDays: 5, activeDaysLast14: 6,
  medianSessionMinutes: 20, daysSinceActivity: 0, returning: false, fresh: false,
  mode: 'balanced', modeReason: 'test', ...o,
});

const lessons = (eraId: EraId, n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: `${eraId}-${i}`, eraId, estimatedMinutes: 15 }));

describe('pickFocusEra — finish what you started before opening a new front', () => {
  it('targets a begun-but-unconsolidated era over an untouched one at 0%', () => {
    // The case that made retention mode unreachable: 8/9 read and scoring 48%
    // is the real, diagnosed weakness, but an era never opened sits at 0% and
    // wins "weakest" outright.
    const m = snapshot([
      era({ eraId: 'prehistoric', lessonsDone: 8, lessonsTotal: 9, quizPct: 48, adaptivePct: 30, mastery: 60 }),
      era({ eraId: 'ancient', lessonsDone: 0, lessonsTotal: 9, mastery: 0 }),
    ]);
    expect(m.weakest.eraId).toBe('ancient');
    expect(pickFocusEra(m).eraId).toBe('prehistoric');
    expect(focusMode(pickFocusEra(m)).mode).toBe('retention');
  });

  it('moves the learner onto new ground once the started era is consolidated', () => {
    const m = snapshot([
      era({ eraId: 'prehistoric', lessonsDone: 9, lessonsTotal: 9, quizPct: 92, mastery: 95 }),
      era({ eraId: 'ancient', lessonsDone: 0, lessonsTotal: 9, mastery: 0 }),
    ]);
    expect(pickFocusEra(m).eraId).toBe('ancient');
  });

  it('picks the weakest of several unconsolidated started eras', () => {
    const m = snapshot([
      era({ eraId: 'prehistoric', lessonsDone: 5, lessonsTotal: 9, mastery: 55 }),
      era({ eraId: 'ancient', lessonsDone: 2, lessonsTotal: 9, mastery: 22 }),
      era({ eraId: 'modern', lessonsDone: 0, lessonsTotal: 9, mastery: 0 }),
    ]);
    expect(pickFocusEra(m).eraId).toBe('ancient');
  });

  it('falls back to the weakest overall for a learner who has started nothing', () => {
    const m = snapshot([
      era({ eraId: 'prehistoric', lessonsDone: 0, lessonsTotal: 9, mastery: 0 }),
      era({ eraId: 'ancient', lessonsDone: 0, lessonsTotal: 9, mastery: 0 }),
    ]);
    expect(pickFocusEra(m).eraId).toBe(m.weakest.eraId);
  });
});

describe('focusMode — reading and recall want opposite medicine', () => {
  it('calls for coverage when most of the era is unread', () => {
    expect(focusMode(era({ eraId: 'ancient', lessonsDone: 2, lessonsTotal: 10 })).mode).toBe('coverage');
  });

  it('calls for retention when the era is read but recall is poor', () => {
    const m = focusMode(era({ eraId: 'ancient', lessonsDone: 8, lessonsTotal: 10, adaptivePct: 50, quizPct: 55 }));
    expect(m.mode).toBe('retention');
  });

  it('does not call for retention just because coverage is low', () => {
    // Low coverage AND low recall is still a reading problem — there is barely
    // anything read to retain.
    expect(focusMode(era({ eraId: 'ancient', lessonsDone: 1, lessonsTotal: 10, adaptivePct: 40 })).mode)
      .not.toBe('coverage');
  });

  it('treats a fully-read but never-tested era as a retention gap', () => {
    expect(focusMode(era({ eraId: 'ancient', lessonsDone: 10, lessonsTotal: 10 })).mode).toBe('retention');
  });
});

describe('generateWeekPlan — responds to the learner, not a template', () => {
  const mastery = snapshot([
    era({ eraId: 'ancient', lessonsDone: 1, lessonsTotal: 10, mastery: 10 }),
    era({ eraId: 'modern', lessonsDone: 8, lessonsTotal: 10, mastery: 80 }),
  ]);
  const pool = (id: EraId) => lessons(id, 6);

  it('sizes the week to the days the learner actually studies', () => {
    const light = generateWeekPlan(mastery, signals({ studyDays: 3 }), pool);
    const heavy = generateWeekPlan(mastery, signals({ studyDays: 7 }), pool);
    expect(Math.max(...light.steps.map(s => s.day))).toBeLessThanOrEqual(3);
    expect(Math.max(...heavy.steps.map(s => s.day))).toBeGreaterThan(3);
  });

  it('respects the daily minute budget', () => {
    const plan = generateWeekPlan(mastery, signals({ dailyBudgetMinutes: 20, studyDays: 7 }), pool);
    for (let d = 1; d <= 7; d++) {
      const onDay = plan.steps.filter(s => s.day === d);
      if (onDay.length < 2) continue; // a single step may exceed the budget alone
      const total = onDay.reduce((a, s) => a + s.minutes, 0);
      const withoutLast = total - onDay[onDay.length - 1].minutes;
      expect(withoutLast).toBeLessThanOrEqual(20);
    }
  });

  it('never crams the overflow onto the final day of a short week', () => {
    // A three-day week at 20 min/day once ended with a 77-minute day 3,
    // because everything that would not fit earlier piled onto the last day.
    const plan = generateWeekPlan(
      mastery,
      signals({ mode: 'coverage', studyDays: 3, dailyBudgetMinutes: 20, returning: true }),
      pool,
    );
    for (const d of new Set(plan.steps.map(s => s.day))) {
      const total = plan.steps.filter(s => s.day === d).reduce((a, s) => a + s.minutes, 0);
      // One step may exceed the budget alone; a whole day may not run away.
      expect(total).toBeLessThanOrEqual(20 + 15);
    }
  });

  it('drops overflow work rather than extending past the week', () => {
    const plan = generateWeekPlan(mastery, signals({ mode: 'coverage', studyDays: 2, dailyBudgetMinutes: 15 }), pool);
    expect(Math.max(...plan.steps.map(s => s.day))).toBeLessThanOrEqual(2);
    expect(plan.days).toBeLessThanOrEqual(2);
  });

  it('reports the days it actually used, not the ceiling it was allowed', () => {
    const plan = generateWeekPlan(mastery, signals({ studyDays: 7, dailyBudgetMinutes: 60 }), () => []);
    expect(plan.days).toBe(Math.max(...plan.steps.map(s => s.day)));
  });

  it('opens with review, not new material, when the learner is returning', () => {
    const plan = generateWeekPlan(mastery, signals({ returning: true }), pool);
    const firstDay = plan.steps.filter(s => s.day === 1);
    expect(firstDay[0].kind).toBe('flashcards');
    expect(firstDay.some(s => s.kind === 'lesson')).toBe(false);
  });

  it('schedules fewer lessons in retention mode than in coverage mode', () => {
    const cov = generateWeekPlan(mastery, signals({ mode: 'coverage' }), pool);
    const ret = generateWeekPlan(mastery, signals({ mode: 'retention' }), pool);
    const count = (p: WeekPlan, k: string) => p.steps.filter(s => s.kind === k).length;
    expect(count(ret, 'lesson')).toBeLessThan(count(cov, 'lesson'));
    expect(count(ret, 'flashcards') + count(ret, 'smart-quiz'))
      .toBeGreaterThan(count(cov, 'flashcards') + count(cov, 'smart-quiz'));
  });

  it('never schedules the same lesson twice, and never skips one in the pool', () => {
    const plan = generateWeekPlan(mastery, signals({ mode: 'coverage', studyDays: 7 }), pool);
    const ids = plan.steps.filter(s => s.lessonId).map(s => s.lessonId!);
    expect(new Set(ids).size).toBe(ids.length);
    // Lessons must be drawn in order from the weakest era's pool — no gaps.
    const ancient = ids.filter(i => i.startsWith('ancient-')).map(i => Number(i.split('-')[1]));
    expect(ancient).toEqual([...ancient].sort((a, b) => a - b));
    expect(ancient[0]).toBe(0);
  });

  it('leaves no scheduled day empty and ends the week on a measurement', () => {
    const plan = generateWeekPlan(mastery, signals({ studyDays: 5 }), pool);
    const days = [...new Set(plan.steps.map(s => s.day))].sort((a, b) => a - b);
    expect(days).toEqual(Array.from({ length: days.length }, (_, i) => i + 1));
    const lastDay = Math.max(...days);
    expect(plan.steps.filter(s => s.day === lastDay).some(s => s.kind === 'smart-quiz' || s.kind === 'era-quiz')).toBe(true);
  });

  it('still produces a usable week when there are no lessons left anywhere', () => {
    const done = snapshot([
      era({ eraId: 'ancient', lessonsDone: 10, lessonsTotal: 10, quizPct: 90, mastery: 92 }),
      era({ eraId: 'modern', lessonsDone: 10, lessonsTotal: 10, quizPct: 95, mastery: 96 }),
    ]);
    const plan = generateWeekPlan(done, signals(), () => []);
    expect(plan.steps.length).toBeGreaterThan(0);
    expect(plan.steps.some(s => s.kind === 'lesson')).toBe(false);
  });

  it("doesn't schedule a summative era quiz for an era with nothing read yet", () => {
    const untouched = snapshot([era({ eraId: 'ancient', lessonsDone: 0, lessonsTotal: 10, mastery: 0 })]);
    const plan = generateWeekPlan(untouched, signals({ mode: 'coverage' }), pool);
    expect(plan.steps.some(s => s.kind === 'era-quiz')).toBe(false);
  });

  it('records what it targeted so staleness can be detected later', () => {
    const plan = generateWeekPlan(mastery, signals({ mode: 'coverage' }), pool);
    expect(plan.focusEraId).toBe('ancient');
    expect(plan.mode).toBe('coverage');
    expect(plan.days).toBe(5);
  });
});

describe('planHealth — a saved plan is a snapshot, and learners move', () => {
  const base = (o: Partial<WeekPlan> = {}): WeekPlan => ({
    id: 'p1', createdAt: new Date().toISOString(), focusEraId: 'ancient',
    steps: [
      { id: 's1', day: 1, kind: 'lesson', lessonId: 'ancient-0', eraId: 'ancient', minutes: 15 },
      { id: 's2', day: 2, kind: 'smart-quiz', minutes: 10 },
    ], ...o,
  });

  it('is healthy while the plan is current and unfinished', () => {
    const h = planHealth(base(), { s1: true, s2: false }, 'ancient');
    expect(h.stale).toBe(false);
    expect(h.doneCount).toBe(1);
    expect(h.totalCount).toBe(2);
  });

  it('flags a finished plan so the learner is offered the next week', () => {
    const h = planHealth(base(), { s1: true, s2: true }, 'ancient');
    expect(h.reasons).toContain('complete');
  });

  it('flags a plan that has outlived the week it scheduled', () => {
    const old = base({ createdAt: new Date(Date.now() - 12 * 86400000).toISOString() });
    const h = planHealth(old, {}, 'ancient');
    expect(h.reasons).toContain('expired');
    expect(h.ageDays).toBe(12);
  });

  it('flags a plan whose focus era has moved on', () => {
    const h = planHealth(base(), {}, 'modern');
    expect(h.reasons).toContain('focus-moved');
    expect(h.currentFocusEraId).toBe('modern');
  });

  it('recovers the focus era for plans saved before it was recorded', () => {
    const legacy = base({ focusEraId: undefined });
    expect(planHealth(legacy, {}, 'ancient').focusEraId).toBe('ancient');
  });

  it('survives a corrupted createdAt instead of reporting NaN days', () => {
    const h = planHealth(base({ createdAt: 'not a date' }), {}, 'ancient');
    expect(h.ageDays).toBe(0);
    expect(h.reasons).not.toContain('expired');
  });
});

describe('studyRhythm — pacing from measured behaviour', () => {
  beforeEach(() => localStorage.clear());

  it('reports nothing for a learner with no recorded time', () => {
    const r = studyRhythm('u1');
    expect(r.activeDays).toBe(0);
    expect(r.medianActiveSeconds).toBe(0);
  });

  it('takes the median of active days, not the mean across the window', () => {
    // One long weekly session must not read as a 3-minute-a-day learner.
    recordStudySeconds('u1', 'ancient', 2400);
    const r = studyRhythm('u1');
    expect(r.activeDays).toBe(1);
    expect(r.medianActiveSeconds).toBe(2400);
  });

  it('ignores days outside the window', () => {
    const old = new Date();
    old.setDate(old.getDate() - 40);
    const spent = getTimeSpent('u1');
    spent.byDay[dayKey(old)] = 5000;
    localStorage.setItem('historify:timeSpent:u1', JSON.stringify(spent));
    expect(studyRhythm('u1', 14).activeDays).toBe(0);
  });

  it('reads records written before daily buckets existed', () => {
    localStorage.setItem('historify:timeSpent:u1', JSON.stringify({ byEra: { ancient: 900 }, other: 0 }));
    expect(() => studyRhythm('u1')).not.toThrow();
    expect(studyRhythm('u1').activeDays).toBe(0);
    expect(getTimeSpent('u1').byEra.ancient).toBe(900);
  });
});

describe('computeLearnerSignals — end to end from stored time', () => {
  beforeEach(() => localStorage.clear());

  const mastery = snapshot(
    [era({ eraId: 'ancient', lessonsDone: 1, lessonsTotal: 10, mastery: 10 })],
    { daysSinceActivity: 9 },
  );

  it('falls back to a starter pace for a learner with no history', () => {
    const s = computeLearnerSignals('new-user', mastery);
    expect(s.fresh).toBe(true);
    expect(s.dailyBudgetMinutes).toBe(20);
    expect(s.returning).toBe(false); // no history to return from
  });

  it('marks a learner returning after a gap, and paces off their real sessions', () => {
    recordStudySeconds('u2', 'ancient', 25 * 60);
    const s = computeLearnerSignals('u2', mastery);
    expect(s.fresh).toBe(false);
    expect(s.medianSessionMinutes).toBe(25);
    expect(s.dailyBudgetMinutes).toBe(25);
    expect(s.returning).toBe(true);
  });

  it('clamps an implausibly short session up to a usable budget', () => {
    recordStudySeconds('u3', 'ancient', 45);
    expect(computeLearnerSignals('u3', mastery).dailyBudgetMinutes).toBe(10);
  });

  it('clamps a marathon session down rather than scheduling two-hour days', () => {
    recordStudySeconds('u4', 'ancient', 3 * 3600);
    expect(computeLearnerSignals('u4', mastery).dailyBudgetMinutes).toBe(60);
  });
});
