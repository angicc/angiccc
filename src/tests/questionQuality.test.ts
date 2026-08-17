import { describe, it, expect } from 'vitest';
import { QUIZZES } from '@/features/quiz/quizData';
import { getTranslatedQuestion } from '@/i18n/quizTranslations';
import type { Language } from '@/i18n/translations';

const ALL = QUIZZES.flatMap(q => q.questions);
const LANGS: Language[] = ['en', 'es', 'ru', 'mk', 'de', 'fr'];

function optionsFor(q: (typeof ALL)[number], lang: Language): string[] | null {
  if (lang === 'en') return q.options;
  const tr = getTranslatedQuestion(q.id, lang);
  return tr?.options?.length === q.options.length ? tr.options : null;
}

/**
 * Guards against the two ways a multiple-choice question leaks its answer
 * without the learner knowing anything.
 *
 * Position bias is handled at serve time by prepareQuestion (see
 * prepareQuestion.test.ts). Length bias cannot be — it is a property of the
 * authored text, so it has to be caught here.
 *
 * Checked in EVERY language, not just English. The bank is translated into
 * five more, each authored separately; a guard that only reads the English
 * options lets the other five drift with nothing watching, and the measured
 * bias is in fact slightly worse in German and French than in English.
 *
 * The bank still carries real debt — the correct option is the longest in
 * ~51-53% of questions against 25% by chance, down from ~59%. These ceilings
 * sit just above the current measurement so the suite stays green while
 * stopping it getting WORSE. Run `node scripts/quiz_length_bias.mjs` for the
 * live numbers, and tighten these further as more questions are rewritten.
 */
const LONGEST_SHARE_CEILING = 0.54;
const MEAN_ADVANTAGE_CEILING = 5.6;

describe('question quality', () => {
  it.each(LANGS)('does not let the correct option be the longest too often (%s)', lang => {
    let longest = 0;
    let comparable = 0;
    for (const q of ALL) {
      const opts = optionsFor(q, lang);
      if (!opts) continue;
      const lens = opts.map(o => o.length);
      if (new Set(lens).size === 1) continue; // all equal — no signal
      comparable++;
      if (lens[q.correctIndex] === Math.max(...lens)) longest++;
    }
    expect(comparable).toBeGreaterThan(0); // a language with no options read is a bug, not a pass
    expect(longest / comparable).toBeLessThan(LONGEST_SHARE_CEILING);
  });

  it.each(LANGS)('keeps the correct option from being much longer than its distractors (%s)', lang => {
    const gaps: number[] = [];
    for (const q of ALL) {
      const opts = optionsFor(q, lang);
      if (!opts) continue;
      const lens = opts.map(o => o.length);
      const others = lens.filter((_, i) => i !== q.correctIndex);
      gaps.push(lens[q.correctIndex] - others.reduce((a, b) => a + b, 0) / others.length);
    }
    expect(gaps.length).toBe(ALL.length); // every question must be readable in every language
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
