import { describe, it, expect } from 'vitest';
import { prepareQuestion } from '@/features/quiz/prepareQuestion';
import { QUIZZES } from '@/features/quiz/quizData';

const ALL = QUIZZES.flatMap(q => q.questions);

describe('prepareQuestion', () => {
  it('keeps correctIndex pointing at the same answer after shuffling', () => {
    for (const q of ALL) {
      const served = prepareQuestion(q, 'en');
      expect(served.options[served.correctIndex]).toBe(q.options[q.correctIndex]);
      expect([...served.options].sort()).toEqual([...q.options].sort());
    }
  });

  it('spreads the correct answer across all positions', () => {
    // The authored bank sits at B 64% / C 25%, so a learner who always picks B
    // scores ~64% without reading anything. Serving must break that up.
    const dist = [0, 0, 0, 0];
    let n = 0;
    for (let pass = 0; pass < 20; pass++) {
      for (const q of ALL) {
        dist[prepareQuestion(q, 'en').correctIndex]++;
        n++;
      }
    }
    const chiSquare = dist.reduce((sum, observed) => sum + (observed - n / 4) ** 2 / (n / 4), 0);
    // 7.81 is the p<0.05 critical value at 3 degrees of freedom.
    expect(chiSquare).toBeLessThan(7.81);
  });

  it('localises the question, and never mixes languages within one question', () => {
    const q = ALL.find(x => x.id === 'aq1')!;
    const mk = prepareQuestion(q, 'mk');
    expect(mk.question).not.toBe(q.question);
    expect(mk.options[mk.correctIndex]).not.toBe(q.options[q.correctIndex]);
    // Options must come from the same source as the question, not a mix.
    expect(mk.options).toHaveLength(q.options.length);
  });

  it('falls back to English rather than misaligning when a translation is malformed', () => {
    // Unknown id → no translation → English, still shuffled and still correct.
    const q = { id: '__missing__', question: 'Q', options: ['a', 'b', 'c', 'd'], correctIndex: 2 };
    const served = prepareQuestion(q, 'mk');
    expect(served.options[served.correctIndex]).toBe('c');
  });
});
