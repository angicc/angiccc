import { describe, it, expect } from 'vitest';
import { QUIZZES } from '@/features/quiz/quizData';
import { getTranslatedQuestion } from '@/i18n/quizTranslations';
import type { Language } from '@/i18n/translations';

const ALL = QUIZZES.flatMap(q => q.questions);
const LANGS: Language[] = ['en', 'es', 'ru', 'mk', 'de', 'fr'];

function stemFor(q: (typeof ALL)[number], lang: Language): string {
  if (lang === 'en') return q.question;
  return getTranslatedQuestion(q.id, lang)?.question ?? q.question;
}

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
 * The debt is now paid. Across 300 questions the correct option is the longest
 * in 22-27% of them depending on language, against 25% by chance, and its mean
 * character advantage is within a character of zero — down from ~59% and +4.5
 * when this guard was first written. Not one question is left where the
 * correct option both leads and leads by six characters or more.
 *
 * These ceilings sit a little above the current measurement so ordinary
 * authoring has room, and low enough that a return to answering by shape fails
 * the suite. Run `node scripts/quiz_length_bias.mjs` for the live numbers.
 */
const LONGEST_SHARE_CEILING = 0.32;
const MEAN_ADVANTAGE_CEILING = 1.5;

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

  /**
   * No question anywhere leads on length by a margin a learner could use.
   *
   * The share and mean tests above are aggregate: a handful of egregious
   * questions can hide inside a healthy average. This is the per-question
   * floor, and it is the measure the rewriting worked to — zero questions,
   * in any language, where the correct option is both the longest AND at
   * least six characters clear of the next.
   */
  it.each(LANGS)('has no question whose answer leads on length by 6+ characters (%s)', lang => {
    const offenders: string[] = [];
    for (const q of ALL) {
      const opts = optionsFor(q, lang);
      if (!opts) continue;
      const lens = opts.map(o => o.length);
      const correct = lens[q.correctIndex];
      const others = lens.filter((_, i) => i !== q.correctIndex);
      if (correct === Math.max(...lens) && correct - Math.max(...others) >= 6) offenders.push(q.id);
    }
    expect(offenders).toEqual([]);
  });

  // Structural integrity across every language, not just English. The option
  // arrays are edited in bulk by scripts/quiz_length_bias.mjs --apply; a patch
  // that dropped, emptied or duplicated an option in one of the five
  // translations would otherwise be invisible until a learner met it.
  it.each(LANGS)('has four distinct, non-empty translated options (%s)', lang => {
    const broken: string[] = [];
    for (const q of ALL) {
      const opts = optionsFor(q, lang);
      if (!opts) continue;
      if (opts.length !== q.options.length) broken.push(`${q.id}: ${opts.length} options`);
      else if (opts.some(o => !o.trim())) broken.push(`${q.id}: empty option`);
      else if (new Set(opts.map(o => o.trim().toLowerCase())).size !== opts.length) broken.push(`${q.id}: duplicate options`);
    }
    expect(broken).toEqual([]);
  });

  it.each(LANGS)('never quotes the answer verbatim in the question stem (%s)', lang => {
    const leaks: string[] = [];
    for (const q of ALL) {
      const opts = optionsFor(q, lang);
      if (!opts) continue;
      const answer = opts[q.correctIndex];
      // Short answers legitimately recur ("Rome" in a question about Rome);
      // a long one appearing whole in the stem is the answer being handed over.
      if (answer.length > 12 && stemFor(q, lang).toLowerCase().includes(answer.toLowerCase())) {
        leaks.push(q.id);
      }
    }
    expect(leaks).toEqual([]);
  });
});
