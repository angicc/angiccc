// ─── Fallback territory-quiz generator ───────────────────────────────────────
// A handful of Territory Map topics have no hand-authored questions in the quiz
// bank. Rather than leave their Quiz and Campaign modes empty, this module
// derives solid, fully-localized multiple-choice questions from the topic's own
// data (its markers and its period), with distractors drawn from OTHER topics.
// Everything is localized through the same helpers the real bank uses, so a
// generated question is indistinguishable from a hand-written one and honours
// the current language. Generation is deterministic (seeded by topic id), so a
// topic always produces the same set — stable across renders and sessions.

import type { TerritoryTopic } from '@/features/content/timelineTerritoryData';
import type { TerritoryQuizQuestion } from '@/i18n/territoryMapQuizData';
import type { Language, TranslationKeys } from '@/i18n/translations';
import { getTranslatedMarkerName } from '@/i18n/territoryMarkerTranslations';

function topicTitle(topic: TerritoryTopic, language: Language): string {
  if (language === 'en') return topic.title;
  return topic.titleI18n[language as Exclude<Language, 'en'>] ?? topic.title;
}

// Period strings carry English era tokens ("476–1453 CE"); swap them for the
// locale's BCE/CE notation without touching the numerals.
function localizePeriod(period: string, t: TranslationKeys): string {
  return period.replace(/\bBCE\b/g, t.year_bce).replace(/\bCE\b/g, t.year_ce);
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function interp(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

/**
 * Build up to `max` localized questions for a topic from its own markers +
 * period, with distractors sampled from other topics. Returns [] only if the
 * topic somehow has no usable data at all.
 */
export function generateTopicQuestions(
  topic: TerritoryTopic,
  allTopics: TerritoryTopic[],
  language: Language,
  t: TranslationKeys,
  max = 6,
): TerritoryQuizQuestion[] {
  const rnd = mulberry32(hashStr(topic.id));
  const tName = topicTitle(topic, language);
  const mkName = (raw: string) => getTranslatedMarkerName(raw, language);

  // Distractor pools drawn from OTHER topics only.
  const others = allTopics.filter(o => o.id !== topic.id);
  const ownMarkerSet = new Set(topic.markers.map(m => m.name));
  const foreignMarkers = [...new Set(others.flatMap(o => o.markers.map(m => m.name)))]
    .filter(n => !ownMarkerSet.has(n));
  const foreignPeriods = [...new Set(others.map(o => o.period))].filter(p => p !== topic.period);

  const out: TerritoryQuizQuestion[] = [];

  // ── Marker-belonging questions (one per marker, capped) ──────────────────────
  const markerSample = shuffle(topic.markers, rnd).slice(0, Math.max(0, max - 1));
  for (let i = 0; i < markerSample.length; i++) {
    const correct = markerSample[i];
    const distractRaw = shuffle(foreignMarkers, rnd).slice(0, 3);
    if (distractRaw.length < 3) break; // not enough distractors — stop generating
    const correctLabel = mkName(correct.name);
    const optionLabels = shuffle([correctLabel, ...distractRaw.map(mkName)], rnd);
    // De-dupe any accidental label collision after translation.
    if (new Set(optionLabels).size < 4) continue;
    const correctIndex = optionLabels.indexOf(correctLabel);
    out.push({
      id: `gen-${topic.id}-m${i}`,
      topicId: topic.id,
      question: interp(t.tmap_genq_belong, { name: tName }),
      options: optionLabels,
      correctIndex,
      explanation: interp(t.tmap_genq_exp, { answer: correctLabel, name: tName }),
      i18n: {}, // base fields are already in the active language
    });
  }

  // ── Period question ──────────────────────────────────────────────────────────
  if (foreignPeriods.length >= 3) {
    const correctLabel = localizePeriod(topic.period, t);
    const distract = shuffle(foreignPeriods, rnd).slice(0, 3).map(p => localizePeriod(p, t));
    const optionLabels = shuffle([correctLabel, ...distract], rnd);
    if (new Set(optionLabels).size === 4) {
      out.push({
        id: `gen-${topic.id}-period`,
        topicId: topic.id,
        question: interp(t.tmap_genq_period, { name: tName }),
        options: optionLabels,
        correctIndex: optionLabels.indexOf(correctLabel),
        explanation: interp(t.tmap_genq_exp, { answer: correctLabel, name: tName }),
        i18n: {},
      });
    }
  }

  return out.slice(0, max);
}

/**
 * Bank questions for a topic if it has any; otherwise a generated set. Keeps
 * every topic's Quiz and Campaign playable regardless of hand-authoring gaps.
 */
export function questionsForTopicSafe(
  bank: TerritoryQuizQuestion[],
  topic: TerritoryTopic,
  allTopics: TerritoryTopic[],
  language: Language,
  t: TranslationKeys,
): TerritoryQuizQuestion[] {
  if (bank.length > 0) return bank;
  return generateTopicQuestions(topic, allTopics, language, t);
}
