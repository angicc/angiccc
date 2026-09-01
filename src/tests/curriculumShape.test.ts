import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { LESSONS } from '@/features/content/lessonsData';
import { LESSON_LOCAL_BANNERS } from '@/features/content/lessonLocalBanners';
import { LESSON_START_YEAR } from '@/features/content/lessonChronology';
import { GENERATED_LESSON_T, type GenContentLang } from '@/i18n/lessonTranslationsGenerated';
import { LANDING_I18N } from '@/i18n/landingTranslations';
import { T, type Language } from '@/i18n/translations';

const ROOT = path.resolve(__dirname, '../..');
const LANGS = Object.keys(T) as Language[];
const CONTENT_LANGS: GenContentLang[] = ['es', 'ru', 'mk', 'de', 'fr'];

/**
 * The curriculum is 22 lessons an era, except the Modern Era, which carries 24.
 * That asymmetry is deliberate, so it is written down here rather than left as
 * something a future edit could quietly restore to a tidy 22.
 */
describe('curriculum shape', () => {
  const perEra = LESSONS.reduce<Record<string, number>>((acc, l) => {
    acc[l.eraId] = (acc[l.eraId] ?? 0) + 1;
    return acc;
  }, {});

  it('holds 22 lessons in every era and 24 in the modern one', () => {
    expect(perEra).toEqual({
      prehistoric: 22, ancient: 22, byzantine: 22,
      'middle-ages': 22, 'early-modern': 22, modern: 24,
    });
  });

  it('numbers each era\'s lessons from 1 with no gaps or repeats', () => {
    for (const [era, count] of Object.entries(perEra)) {
      const orders = LESSONS.filter(l => l.eraId === era).map(l => l.order).sort((a, b) => a - b);
      expect(orders, `${era} order sequence`).toEqual(Array.from({ length: count }, (_, i) => i + 1));
    }
  });
});

/**
 * The lesson total was hardcoded as 132 in twelve strings across six languages
 * while the catalogue held 133, and three languages separately claimed twenty
 * lessons an era against a real twenty-two. Both were invisible because nothing
 * compared the copy to the data.
 */
describe('landing copy tracks the catalogue', () => {
  it('never hardcodes a lesson total in any language', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/i18n/landingTranslations.ts'), 'utf8');
    // Any bare three-digit number near the word for "lessons" is a count that
    // will rot. The placeholder is the supported way to say it.
    const offenders = [...src.matchAll(/\b1\d\d\b(?=[^\n]{0,30}(lesson|lecci|урок|лекци|Lektion|leçon))/gi)]
      .map(m => m[0]);
    expect(offenders, 'use the {n} placeholder so the number comes from LESSONS').toEqual([]);
  });

  it('offers the placeholder in every language so none is left with a stale number', () => {
    for (const lang of LANGS) {
      const L = LANDING_I18N[lang];
      const all = [...L.features.map(f => `${f.t} ${f.d}`), ...L.pricingCards.flatMap(c => [...c.ov, ...c.hl, ...c.out])];
      expect(all.some(s => s.includes('{n}')), `${lang} lost its {n} placeholder`).toBe(true);
    }
  });

  it('resolves the placeholder to the real count', () => {
    const filled = LANDING_I18N.en.features.map(f => f.t.replace(/\{n\}/g, String(LESSONS.length)));
    expect(filled.some(s => s.includes(String(LESSONS.length)))).toBe(true);
    expect(LESSONS.length).toBe(134);
  });
});

/**
 * A new lesson has to be registered in four separate places. Miss one and the
 * lesson still renders — with an English body, a fallback banner, or in the
 * wrong place on the timeline — which is exactly the kind of half-landed change
 * that reads as "it didn't work".
 */
describe('every lesson is fully registered', () => {
  it('has a chronology anchor', () => {
    const missing = LESSONS.filter(l => LESSON_START_YEAR[l.id] === undefined).map(l => l.id);
    expect(missing).toEqual([]);
  });

  it('has a curated banner path', () => {
    const missing = LESSONS.filter(l => !LESSON_LOCAL_BANNERS[l.id]).map(l => l.id);
    expect(missing).toEqual([]);
  });
});

describe('Second World War, Part II', () => {
  const lesson = LESSONS.find(l => l.id === 'modern-24');

  it('exists in the modern era with the requested title', () => {
    expect(lesson).toBeTruthy();
    expect(lesson!.title).toBe('Second World War, Part II');
    expect(lesson!.eraId).toBe('modern');
  });

  it('is placed by when it happened, not when it was written', () => {
    // lessonsData renumbers each era by LESSON_START_YEAR at load, so the
    // authored order: 24 is not what ships. What must hold is the sequence:
    // the second half of the war follows the war's outbreak and precedes the
    // Cold War.
    const order = (id: string) => LESSONS.find(l => l.id === id)!.order;
    expect(order('modern-24')).toBeGreaterThan(order('modern-23'));
    expect(order('modern-24')).toBeLessThan(order('modern-03'));
  });

  it('does not simply repeat the lesson before it', () => {
    // modern-23 already covers 1939-45 as a survey. This one earns its place by
    // going where the survey does not.
    const prior = LESSONS.find(l => l.id === 'modern-23')!;
    const headings = lesson!.sections.map(s => s.heading);
    expect(headings).not.toEqual(prior.sections.map(s => s.heading));
    expect(headings.join(' ')).toMatch(/Eastern Front/);
  });

  it('is translated into all five content languages, section for section', () => {
    const entry = GENERATED_LESSON_T['modern-24'];
    expect(entry, 'no baked translations at all').toBeTruthy();
    for (const lang of CONTENT_LANGS) {
      const t = entry![lang];
      expect(t, `${lang} missing`).toBeTruthy();
      expect(t!.t, `${lang} title`).toBeTruthy();
      expect(t!.h, `${lang} headings`).toHaveLength(lesson!.sections.length);
      expect(t!.b, `${lang} bodies`).toHaveLength(lesson!.sections.length);
      expect(t!.k, `${lang} key facts`).toHaveLength(lesson!.keyFacts.length);
      expect(t!.t, `${lang} title is still English`).not.toBe(lesson!.title);
    }
  });

  it('carries its figures across every translation', () => {
    // A translation that drops "872" or rounds "27 million" teaches the wrong
    // history, which is worse than teaching it in the wrong language.
    for (const lang of CONTENT_LANGS) {
      const joined = (GENERATED_LESSON_T['modern-24']![lang]!.b ?? []).join(' ');
      for (const n of ['872', '27', '1937', '1941', '63', '1989']) {
        expect(joined, `${lang} lost the figure ${n}`).toContain(n);
      }
    }
  });
});
