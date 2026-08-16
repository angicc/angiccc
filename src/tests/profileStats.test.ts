import { describe, it, expect, beforeEach } from 'vitest';
import { studyHeatmap, personalRecords, nextMilestones } from '@/features/progress/profileStats';
import { recordStudySeconds, dayKey, getTimeSpent } from '@/features/progress/timeTracking';
import { ACHIEVEMENTS, achievementProgress, checkAchievements } from '@/features/progress/xpSystem';
import { pluralDays } from '@/i18n/plurals';
import type { UserProgress } from '@/types';

const store = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
} as Storage;

const progress = (o: Partial<UserProgress> = {}): UserProgress => ({
  userId: 'u1', xp: 0, level: 1, streak: 0, lastActivityDate: '',
  completedLessons: [], completedQuizzes: [], quizScores: {}, achievements: [],
  recentActivity: [], aiMessageCount: 0, ...o,
});

const setDay = (userId: string, daysAgo: number, seconds: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const spent = getTimeSpent(userId);
  spent.byDay[dayKey(d)] = seconds;
  localStorage.setItem(`historify:timeSpent:${userId}`, JSON.stringify(spent));
};

describe('studyHeatmap', () => {
  beforeEach(() => localStorage.clear());

  it('never renders days in the future', () => {
    const grid = studyHeatmap('u1', 12);
    const today = dayKey();
    expect(grid.every(d => d.date <= today)).toBe(true);
    expect(grid[grid.length - 1].date).toBe(today);
  });

  it('covers the requested window and stays week-aligned', () => {
    const grid = studyHeatmap('u1', 12);
    // Between 11 and 12 full weeks depending on where today falls in the week.
    expect(grid.length).toBeGreaterThan(11 * 7 - 7);
    expect(grid.length).toBeLessThanOrEqual(12 * 7);
    expect(new Set(grid.map(d => d.date)).size).toBe(grid.length); // no repeats
  });

  it('grades intensity rather than only presence', () => {
    setDay('u1', 1, 60);        // 1 min
    setDay('u1', 2, 10 * 60);   // 10 min
    setDay('u1', 3, 50 * 60);   // 50 min
    const grid = studyHeatmap('u1', 4);
    const level = (d: number) => {
      const dt = new Date(); dt.setDate(dt.getDate() - d);
      return grid.find(g => g.date === dayKey(dt))!.level;
    };
    expect(level(1)).toBe(1);
    expect(level(2)).toBe(2);
    expect(level(3)).toBe(4);
    expect(level(0)).toBe(0); // nothing recorded today
  });

  it('is empty-safe for a learner with no recorded time', () => {
    const grid = studyHeatmap('nobody', 12);
    expect(grid.every(d => d.level === 0 && d.seconds === 0)).toBe(true);
  });
});

describe('personalRecords', () => {
  beforeEach(() => localStorage.clear());

  it('returns zeroes rather than NaN for a brand-new learner', () => {
    const r = personalRecords('u1', progress());
    expect(r.totalSeconds).toBe(0);
    expect(r.bestQuizScore).toBeNull();
    expect(r.favouriteEraId).toBeNull();
    expect(r.bestDay).toBeNull();
    expect(r.longestStreak).toBe(0);
  });

  it('picks the most-studied era and the best single day', () => {
    recordStudySeconds('u1', 'ancient', 600);
    recordStudySeconds('u1', 'modern', 1800);
    setDay('u1', 3, 2400);
    const r = personalRecords('u1', progress());
    expect(r.favouriteEraId).toBe('modern');
    expect(r.favouriteEraSeconds).toBe(1800);
    expect(r.bestDay?.seconds).toBe(2400);
  });

  it('counts only the last seven days as this week', () => {
    setDay('u1', 0, 100);
    setDay('u1', 6, 200);
    setDay('u1', 9, 5000); // outside the window
    expect(personalRecords('u1', progress()).weekSeconds).toBe(300);
  });

  it('ignores Smart Quiz when reporting the best era-quiz score', () => {
    // Smart Quiz writes its own key; it is not an era score and must not be
    // reported as one.
    const p = progress({ quizScores: { 'smart-quiz': 100, 'quiz-ancient': 72 } });
    const r = personalRecords('u1', p);
    expect(r.bestQuizScore).toBe(72);
    expect(r.perfectQuizzes).toBe(0);
  });

  it('reports the best streak even when the current run is shorter', () => {
    expect(personalRecords('u1', progress({ streak: 2, longestStreak: 11 })).longestStreak).toBe(11);
  });

  it('falls back to the current run when no best was ever recorded', () => {
    // Progress saved before longestStreak existed has no stored best.
    expect(personalRecords('u1', progress({ streak: 6 })).longestStreak).toBe(6);
  });

  it('does not treat unattributed time as a favourite era', () => {
    recordStudySeconds('u1', null, 9000);
    const r = personalRecords('u1', progress());
    expect(r.favouriteEraId).toBeNull();
    expect(r.totalSeconds).toBe(9000);
  });
});

describe('nextMilestones', () => {
  it('ranks locked achievements by how nearly complete they are', () => {
    const p = progress({ xp: 4000, completedLessons: Array.from({ length: 40 }, (_, i) => `ancient-${i}`) });
    const m = nextMilestones(p, 4);
    expect(m.length).toBeGreaterThan(0);
    for (let i = 1; i < m.length; i++) expect(m[i - 1].pct).toBeGreaterThanOrEqual(m[i].pct);
  });

  it('omits achievements already unlocked, and ones not yet begun', () => {
    const p = progress({ xp: 4000, achievements: ACHIEVEMENTS.map(a => a.id) });
    expect(nextMilestones(p)).toEqual([]);

    const untouched = nextMilestones(progress());
    expect(untouched.every(m => m.current > 0)).toBe(true);
  });

  it('never reports progress past the target', () => {
    const p = progress({ xp: 999999, completedLessons: Array.from({ length: 500 }, (_, i) => `ancient-${i}`) });
    for (const m of nextMilestones(p, 10)) {
      expect(m.current).toBeLessThanOrEqual(m.target);
      expect(m.pct).toBeLessThanOrEqual(100);
    }
  });

  it('respects the requested limit', () => {
    const p = progress({ xp: 3000, completedLessons: ['ancient-01', 'ancient-02'] });
    expect(nextMilestones(p, 2).length).toBeLessThanOrEqual(2);
  });
});

describe('achievementProgress', () => {
  it('gives every countable achievement a measurable target', () => {
    const p = progress();
    for (const a of ACHIEVEMENTS) {
      const prog = achievementProgress(a.condition, p);
      if (prog === null) {
        // Only all-or-nothing conditions may opt out of a progress bar.
        expect(['quiz_perfect', 'analysis_aplus']).toContain(a.condition.type);
      } else {
        expect(prog.target).toBeGreaterThan(0);
        expect(Number.isFinite(prog.current)).toBe(true);
      }
    }
  });

  it('agrees with the unlock check — a full bar means it actually unlocks', () => {
    // The bar and the unlock rule are separate code paths reading the same
    // fields; if they disagree a learner sees 5/5 on something still locked.
    const p = progress({
      xp: 5000, level: 12, streak: 40, aiMessageCount: 50,
      completedQuizzes: ['a', 'b', 'c', 'd', 'e', 'f'],
      completedLessons: Array.from({ length: 30 }, (_, i) => `ancient-${String(i + 1).padStart(2, '0')}`),
      debateWins: 9, analysisPasses: 12, videoXp: 3000,
    });
    const unlocked = new Set(checkAchievements(p).map(a => a.id));
    for (const a of ACHIEVEMENTS) {
      const prog = achievementProgress(a.condition, p);
      if (!prog) continue;
      if (prog.current >= prog.target) {
        expect(unlocked.has(a.id), `${a.id} shows a full bar but does not unlock`).toBe(true);
      }
    }
  });
});

describe('pluralDays', () => {
  const t = {
    unit_day_one: 'one', unit_day_few: 'few', unit_day_many: 'many',
  };

  it('uses one/other for the Western languages', () => {
    for (const lang of ['en', 'es', 'de', 'fr'] as const) {
      expect(pluralDays(1, lang, t)).toBe('one');
      expect(pluralDays(0, lang, t)).toBe('many');
      expect(pluralDays(2, lang, t)).toBe('many');
      expect(pluralDays(21, lang, t)).toBe('many');
    }
  });

  it('follows Russian three-form rules, including the 11–14 exception', () => {
    expect(pluralDays(1, 'ru', t)).toBe('one');
    expect(pluralDays(21, 'ru', t)).toBe('one');
    expect(pluralDays(2, 'ru', t)).toBe('few');
    expect(pluralDays(23, 'ru', t)).toBe('few');
    expect(pluralDays(5, 'ru', t)).toBe('many');
    // 11–14 take the "many" form despite their last digit.
    expect(pluralDays(11, 'ru', t)).toBe('many');
    expect(pluralDays(12, 'ru', t)).toBe('many');
    expect(pluralDays(14, 'ru', t)).toBe('many');
    expect(pluralDays(111, 'ru', t)).toBe('many');
  });

  it('follows Macedonian two-form rules', () => {
    expect(pluralDays(1, 'mk', t)).toBe('one');
    expect(pluralDays(21, 'mk', t)).toBe('one');
    expect(pluralDays(11, 'mk', t)).toBe('many');
    expect(pluralDays(2, 'mk', t)).toBe('many');
    expect(pluralDays(5, 'mk', t)).toBe('many');
  });

  it('is safe for zero and negative counts', () => {
    expect(() => pluralDays(0, 'ru', t)).not.toThrow();
    expect(pluralDays(-1, 'ru', t)).toBe('one');
  });
});
