import { describe, it, expect, beforeEach } from 'vitest';

const store = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
} as Storage;

const { recordQuizAttempt, loadProgress } = await import('@/features/progress/progressStore');

const attempt = (quizId: string, score: number) => ({
  quizId, answers: [], score, xpEarned: 0, completedAt: new Date().toISOString(),
});

describe('quiz score recording', () => {
  beforeEach(() => localStorage.clear());

  it('records a first attempt of 0%, rather than treating it as never taken', () => {
    recordQuizAttempt('u1', attempt('quiz-ancient', 0), 'Ancient');
    const p = loadProgress('u1');
    expect('quiz-ancient' in p.quizScores).toBe(true);
    expect(p.quizScores['quiz-ancient']).toBe(0);
  });

  it('keeps the best score across attempts', () => {
    recordQuizAttempt('u1', attempt('quiz-ancient', 40), 'Ancient');
    recordQuizAttempt('u1', attempt('quiz-ancient', 80), 'Ancient');
    recordQuizAttempt('u1', attempt('quiz-ancient', 60), 'Ancient');
    expect(loadProgress('u1').quizScores['quiz-ancient']).toBe(80);
  });

  it('does not let a later worse attempt erase the best', () => {
    recordQuizAttempt('u1', attempt('quiz-modern', 100), 'Modern');
    recordQuizAttempt('u1', attempt('quiz-modern', 0), 'Modern');
    expect(loadProgress('u1').quizScores['quiz-modern']).toBe(100);
  });

  it('keeps Smart Quiz out of the era-quiz set', () => {
    recordQuizAttempt('u1', attempt('smart-quiz', 73), 'Smart Quiz');
    const p = loadProgress('u1');
    // It is recorded, but it is not an era quiz — the Progress chart decides
    // emptiness from era quizzes, so this alone must not imply "has data".
    expect('smart-quiz' in p.quizScores).toBe(true);
    const eraQuizIds = ['quiz-prehistoric','quiz-ancient','quiz-byzantine'];
    expect(eraQuizIds.some(id => id in p.quizScores)).toBe(false);
  });
});
