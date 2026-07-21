// ─── Runtime lesson translation (AI + persistent cache) ──────────────────────
// The curriculum grew far past the hand-authored translation set: only the
// first nine lessons of each era have static translations in the *Translations
// files. Every later lesson would otherwise render in English on a non-English
// UI. This module closes that gap at runtime: it translates a lesson's visible
// text through the app's own AI gateway and caches the result in localStorage,
// so each lesson is localized once per language and then served instantly from
// cache forever after. If the AI is unreachable the UI simply keeps the English
// source — translation can never break the page.
//
// Two granularities, matched to what the user sees:
//   • META  (title, subtitle, key facts, section headings) — shown in every
//     lesson list, card, header and search result. Warmed in the background for
//     the whole active language so lists stop flashing English.
//   • BODIES (the long section paragraphs) — only visible inside an open lesson,
//     so translated on demand when that lesson is opened.

import type { Language } from './translations';
import { streamChatResponse } from '@/services/aiGateway';
import { safeJsonParse } from '@/lib/safeJsonParse';

type ContentLang = Exclude<Language, 'en'>;

const LANG_NAMES: Record<ContentLang, string> = {
  es: 'Spanish', ru: 'Russian', mk: 'Macedonian', de: 'German', fr: 'French',
};

export interface CachedLessonT {
  t?: string;        // title
  s?: string;        // subtitle
  k?: string[];      // keyFacts
  h?: string[];      // section headings
  b?: string[];      // section bodies
}

interface LessonLike {
  id: string;
  title: string;
  subtitle: string;
  keyFacts: string[];
  sections: { heading: string; body: string }[];
}

const CACHE_KEY = (lang: string, id: string) => `historify:xlate:${lang}:${id}`;

// ── Cache read / write ───────────────────────────────────────────────────────

/** Synchronous cache read — safe to call from render. Returns null if absent. */
export function getCachedLessonTranslation(id: string, lang: Language): CachedLessonT | null {
  if (lang === 'en') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY(lang, id));
    return raw ? (JSON.parse(raw) as CachedLessonT) : null;
  } catch {
    return null;
  }
}

function mergeCache(id: string, lang: ContentLang, patch: CachedLessonT) {
  try {
    const prev = getCachedLessonTranslation(id, lang) ?? {};
    localStorage.setItem(CACHE_KEY(lang, id), JSON.stringify({ ...prev, ...patch }));
  } catch { /* storage full / unavailable — translation just won't persist */ }
  notify();
}

// ── Re-render notifier ───────────────────────────────────────────────────────
// getTranslatedLesson is a pure function called during render across many
// pages, so newly cached translations only appear once those components
// re-render. The LanguageProvider subscribes here and bumps a version counter,
// which flows through useLanguage() to every consumer.

const listeners = new Set<() => void>();
export function subscribeTranslations(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
let notifyQueued = false;
function notify() {
  // Coalesce bursts of cache writes into one re-render per frame.
  if (notifyQueued) return;
  notifyQueued = true;
  const flush = () => { notifyQueued = false; listeners.forEach(cb => cb()); };
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(flush);
  else setTimeout(flush, 16);
}

// ── Core AI translate call ───────────────────────────────────────────────────

const SYSTEM = (lang: ContentLang) =>
  `You are a professional history translator. Translate every string in the JSON array "items" into ${LANG_NAMES[lang]}. ` +
  `Produce natural, idiomatic ${LANG_NAMES[lang]} — never a word-for-word calque. Preserve all proper nouns, numbers, dates, and meaning. ` +
  `Return ONLY raw JSON of the exact shape {"items":[...]} with the SAME number of items in the SAME order — never merge, split, add, or drop items. No markdown, no commentary.`;

/** Translate a batch of strings, preserving order and length. On any failure
 *  the originals are returned so callers can safely fall back to English. */
async function translateBatch(strings: string[], lang: ContentLang, maxTokens: number): Promise<string[]> {
  if (strings.length === 0) return [];
  let full = '';
  for await (const chunk of streamChatResponse(
    [{ role: 'user', content: JSON.stringify({ items: strings }) }],
    undefined,
    SYSTEM(lang),
    maxTokens,
  )) full += chunk;
  const parsed = safeJsonParse<{ items?: unknown }>(full);
  const arr = Array.isArray(parsed.items) ? parsed.items : [];
  // Positional fallback: any missing/blank item keeps its English source.
  return strings.map((orig, i) => (typeof arr[i] === 'string' && arr[i].trim() ? (arr[i] as string) : orig));
}

// ── In-flight guards (avoid duplicate concurrent work) ───────────────────────
const metaInFlight = new Set<string>();
const bodyInFlight = new Set<string>();

/** Translate + cache a lesson's META. Idempotent; skips if already cached. */
export async function translateLessonMeta(lesson: LessonLike, lang: Language): Promise<void> {
  if (lang === 'en') return;
  const cl = lang as ContentLang;
  const guard = `${cl}:${lesson.id}`;
  if (metaInFlight.has(guard)) return;
  if (getCachedLessonTranslation(lesson.id, cl)?.t) return; // already have meta
  metaInFlight.add(guard);
  try {
    const k = lesson.keyFacts.length;
    const strings = [lesson.title, lesson.subtitle, ...lesson.keyFacts, ...lesson.sections.map(s => s.heading)];
    const out = await translateBatch(strings, cl, 2048);
    mergeCache(lesson.id, cl, {
      t: out[0],
      s: out[1],
      k: out.slice(2, 2 + k),
      h: out.slice(2 + k),
    });
  } catch { /* leave English; a later attempt may succeed */ }
  finally { metaInFlight.delete(guard); }
}

/** Background-warm META for a whole set of lessons in the active language, with
 *  a small concurrency pool so lists localize quickly without hammering the API.
 *  Caller passes only lessons that lack a static translation. */
export async function warmMetaForLanguage(lessons: LessonLike[], lang: Language): Promise<void> {
  if (lang === 'en') return;
  const cl = lang as ContentLang;
  const pending = lessons.filter(l => !getCachedLessonTranslation(l.id, cl)?.t);
  if (pending.length === 0) return;
  const POOL = 3;
  let idx = 0;
  const worker = async () => {
    while (idx < pending.length) {
      const lesson = pending[idx++];
      await translateLessonMeta(lesson, cl);
    }
  };
  await Promise.all(Array.from({ length: Math.min(POOL, pending.length) }, worker));
}

/** Translate + cache a lesson's BODY paragraphs. Idempotent; on demand. */
export async function translateLessonBodies(lesson: LessonLike, lang: Language): Promise<void> {
  if (lang === 'en') return;
  const cl = lang as ContentLang;
  const guard = `${cl}:${lesson.id}`;
  if (bodyInFlight.has(guard)) return;
  if (getCachedLessonTranslation(lesson.id, cl)?.b) return; // already have bodies
  bodyInFlight.add(guard);
  try {
    const bodies = lesson.sections.map(s => s.body);
    // Bodies are long; translate in small groups so no single call truncates.
    const GROUP = 2;
    const result: string[] = [];
    for (let i = 0; i < bodies.length; i += GROUP) {
      const slice = bodies.slice(i, i + GROUP);
      const out = await translateBatch(slice, cl, 4096);
      result.push(...out);
    }
    mergeCache(lesson.id, cl, { b: result });
  } catch { /* leave English bodies */ }
  finally { bodyInFlight.delete(guard); }
}
