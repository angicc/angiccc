// ─── Serving a quiz question: localise, then shuffle ─────────────────────────
// Two problems this fixes, both invisible until the data is measured.
//
// 1. ANSWER POSITION. Across the 210 authored questions the correct answer sat
//    at B 64.3% of the time and C 25.2% — 89.5% in the middle two slots, with A
//    at 7.6% and D at 2.9% (chi-square 196 against the 7.8 that chance would
//    explain). A learner who never reads the question and always picks B scores
//    ~64%. Shuffling per session removes the tell without touching the authored
//    data, and covers every question added later.
//
// 2. LANGUAGE. Smart Quiz rendered the raw English question and options in
//    every language — it never called the translation layer that QuizPage uses.
//
// Both belong at the same point: the moment a question is handed to a session.
// Shuffling here rather than at render also means the order is stable for the
// life of the question on screen, so the options do not reorder underneath a
// learner between selecting and seeing the explanation.
//
// Safe to shuffle: no explanation in the bank refers to an option by letter
// (checked — zero occurrences of "option A/B/C/D" across both quiz files), so
// reordering cannot orphan a reference.

import type { Language } from '@/i18n/translations';
import { getTranslatedQuestion } from '@/i18n/quizTranslations';

export interface ServableQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

/** Fisher–Yates over an index list. */
function shuffledIndices(n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/**
 * Localise a question into `lang` and shuffle its options, keeping
 * `correctIndex` pointing at the same answer.
 *
 * A translation is used only when it supplies exactly as many options as the
 * source: a short or padded list would silently misalign the answer, which is
 * worse than showing English.
 */
export function prepareQuestion<T extends ServableQuestion>(question: T, lang: Language): T {
  const translation = lang === 'en' ? null : getTranslatedQuestion(question.id, lang);
  const usable = translation && translation.options?.length === question.options.length;

  const text = usable ? translation.question : question.question;
  const options = usable ? translation.options : question.options;
  const explanation = usable ? translation.explanation : question.explanation;

  const order = shuffledIndices(options.length);
  return {
    ...question,
    question: text,
    options: order.map(i => options[i]),
    correctIndex: order.indexOf(question.correctIndex),
    explanation,
  };
}
