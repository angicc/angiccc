// ─── On-demand access to the baked lesson translations ───────────────────────
// lessonTranslationsGenerated.ts holds all five content languages (~3.6 MB) and
// stays the data-of-record for scripts/generate_lesson_translations.mjs. Nothing
// imports it at runtime: doing so shipped every language to every visitor,
// including English readers, who never consult it at all.
//
// Instead each language is a separate chunk (src/i18n/generated/<lang>.ts,
// written by scripts/split_generated_translations.mjs) fetched only when it is
// the active language.
//
// LOADING IS ASYNCHRONOUS, LOOKUP IS NOT. getCachedLessonTranslation is called
// during render and must stay synchronous, so getBaked reads whatever has
// landed and returns undefined otherwise — the same "not there yet" state the
// runtime AI translator already produces, which the existing subscribe/notify
// re-render path handles. Callers that would *act* on a miss (the AI translation
// entry points) must await ensureBaked first, or they will pay to translate
// text that is already baked.

import type { GenLessonT, GenContentLang } from './lessonTranslationsGenerated';

type BakedModule = { default: Record<string, GenLessonT> };

// Literal specifiers, so the bundler can see all five and emit a chunk each.
const LOADERS: Record<GenContentLang, () => Promise<BakedModule>> = {
  es: () => import('./generated/es'),
  ru: () => import('./generated/ru'),
  mk: () => import('./generated/mk'),
  de: () => import('./generated/de'),
  fr: () => import('./generated/fr'),
};

const loaded = new Map<GenContentLang, Record<string, GenLessonT>>();
const inFlight = new Map<GenContentLang, Promise<void>>();

/** True once `lang`'s baked translations are resident and lookups are reliable. */
export function isBakedLoaded(lang: GenContentLang): boolean {
  return loaded.has(lang);
}

/**
 * Fetch `lang`'s baked translations if they are not already resident.
 * Concurrent calls share one request; a failed load resolves rather than
 * throwing, leaving lookups to miss and the runtime translator to cover.
 */
export function ensureBaked(lang: GenContentLang): Promise<void> {
  if (loaded.has(lang)) return Promise.resolve();
  const existing = inFlight.get(lang);
  if (existing) return existing;

  const load = LOADERS[lang];
  if (!load) return Promise.resolve();

  const p = load()
    .then(mod => {
      loaded.set(lang, mod.default);
    })
    .catch(() => {
      // Offline or chunk fetch failed — leave it unloaded so a later call retries.
    })
    .finally(() => {
      inFlight.delete(lang);
    });

  inFlight.set(lang, p);
  return p;
}

/** Synchronous lookup. Returns undefined when `lang` has not loaded yet. */
export function getBaked(id: string, lang: GenContentLang): GenLessonT | undefined {
  return loaded.get(lang)?.[id];
}
