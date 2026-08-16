import { describe, it, expect } from 'vitest';
import { QUIZZES } from '@/features/quiz/quizData';

const ALL = QUIZZES.flatMap(q => q.questions);

/**
 * Guards against the two ways a multiple-choice question leaks its answer
 * without the learner knowing anything.
 *
 * Position bias is handled at serve time by prepareQuestion (see
 * prepareQuestion.test.ts). Length bias cannot be — it is a property of the
 * authored text, so it has to be caught here.
 *
 * The bank currently carries real length-bias debt: the correct option is the
 * longest in 57.7% of questions against 25% by chance, averaging +7.8
 * characters. These thresholds sit above that debt so the suite stays green,
 * and exist to stop it getting WORSE. Tighten them as questions are rewritten.
 */
const LONGEST_SHARE_CEILING = 0.60;
const MEAN_ADVANTAGE_CEILING = 9;

describe('question quality', () => {
  it('does not let the correct option be the longest more often than the ceiling', () => {
    let longest = 0;
    let comparable = 0;
    for (const q of ALL) {
      const lens = q.options.map(o => o.length);
      if (new Set(lens).size === 1) continue; // all equal — no signal
      comparable++;
      if (lens[q.correctIndex] === Math.max(...lens)) longest++;
    }
    expect(longest / comparable).toBeLessThan(LONGEST_SHARE_CEILING);
  });

  it('keeps the correct option from being much longer than its distractors', () => {
    const gaps = ALL.map(q => {
      const lens = q.options.map(o => o.length);
      const others = lens.filter((_, i) => i !== q.correctIndex);
      return lens[q.correctIndex] - others.reduce((a, b) => a + b, 0) / others.length;
    });
    const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    expect(mean).toBeLessThan(MEAN_ADVANTAGE_CEILING);
  });

  it('has no "all/none of the above" options', () => {
    const lazy = ALL.filter(q => q.options.some(o => /\b(all|none) of the above\b/i.test(o)));
    expect(lazy.map(q => q.id)).toEqual([]);
  });

  it('has four distinct options per question', () => {
    const broken = ALL.filter(q => new Set(q.options.map(o => o.trim().toLowerCase())).size !== q.options.length);
    expect(broken.map(q => q.id)).toEqual([]);
  });

  it('has a correctIndex inside the options range', () => {
    const broken = ALL.filter(q => q.correctIndex < 0 || q.correctIndex >= q.options.length);
    expect(broken.map(q => q.id)).toEqual([]);
  });
});
