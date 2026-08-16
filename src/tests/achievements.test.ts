import { describe, it, expect } from 'vitest';
import { ACHIEVEMENTS, checkAchievements } from '@/features/progress/xpSystem';
import { getTranslatedAchievement } from '@/i18n/achievementTranslations';
import type { UserProgress } from '@/types';

const LANGS = ['es', 'ru', 'mk', 'de', 'fr'] as const;

const blank = (over: Partial<UserProgress> = {}): UserProgress => ({
  userId: 'u', xp: 0, level: 1, streak: 0, lastActivityDate: new Date().toISOString(),
  completedLessons: [], completedQuizzes: [], quizScores: {}, achievements: [],
  recentActivity: [], aiMessageCount: 0, ...over,
});

describe('achievements', () => {
  it('translates every achievement into every content language', () => {
    // Checked from the definitions, not from the translation table — the
    // direction that matters. A table can be 100% complete and still miss
    // achievements that were never added to it.
    const gaps: string[] = [];
    for (const a of ACHIEVEMENTS) {
      for (const lang of LANGS) {
        if (!getTranslatedAchievement(a.id, lang)) gaps.push(`${a.id}:${lang}`);
      }
    }
    expect(gaps).toEqual([]);
  });

  it('has unique ids', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    expect(ids.length - new Set(ids).size).toBe(0);
  });

  it('unlocks the long-haul goals only once their threshold is met', () => {
    const ids = (p: UserProgress) => checkAchievements(p).map(a => a.id);
    const near = ids(blank({ completedLessons: Array.from({ length: 79 }, (_, i) => `l${i}`) }));
    expect(near).not.toContain('lessons-80');
    const met = ids(blank({ completedLessons: Array.from({ length: 80 }, (_, i) => `l${i}`) }));
    expect(met).toContain('lessons-80');
  });

  it('rewards the progress fields that were previously tracked but unused', () => {
    // videoXp, completedQuizzes and level were all recorded and never rewarded.
    const ids = (p: UserProgress) => checkAchievements(p).map(a => a.id);
    expect(ids(blank({ videoXp: 500 }))).toContain('video-500');
    expect(ids(blank({ videoXp: 499 }))).not.toContain('video-500');

    expect(ids(blank({ completedQuizzes: Array.from({ length: 10 }, (_, i) => `q${i}`) }))).toContain('quizzes-10');
    expect(ids(blank({ level: 25 }))).toContain('level-25');
    expect(ids(blank({ level: 24 }))).not.toContain('level-25');
  });

  it('awards nothing to a brand-new learner', () => {
    expect(checkAchievements(blank())).toEqual([]);
  });
});
