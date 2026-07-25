// ─── Baked lesson translations (generated, gateway-independent) ──────────────
// This file is normally EMPTY. Run `npm run i18n:lessons` (with an
// ANTHROPIC_API_KEY set) to fill it with full, reviewed translations of every
// lesson's title / subtitle / key facts / section headings / section bodies for
// all five content languages. Once populated and committed, lessons are fully
// localized with NO runtime AI dependency — they read from here instantly, even
// offline or when the AI gateway/API key isn't configured in the deployment.
//
// The runtime AI translator (dynamicLessonTranslation.ts) still fills any lesson
// this file doesn't cover, so partial generation is fine.

export interface GenLessonT {
  t?: string;        // title
  s?: string;        // subtitle
  k?: string[];      // keyFacts
  h?: string[];      // section headings
  b?: string[];      // section bodies
}

export type GenContentLang = 'es' | 'ru' | 'mk' | 'de' | 'fr';

/** lessonId → language → baked translation. Empty until the generator runs. */
export const GENERATED_LESSON_T: Record<string, Partial<Record<GenContentLang, GenLessonT>>> = {};
