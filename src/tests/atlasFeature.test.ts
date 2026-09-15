import { describe, it, expect } from 'vitest';
import { ATLAS_CATALOG, atlasText, formatYear } from '@/features/atlas/atlasCatalog';
import { DECISION_POINTS, decisionPointFor, loc } from '@/features/atlas/decisionPoints';
import { framesTouching } from '@/features/atlas/FollowTerritoryPanel';
import { TERRITORY_ANCHORS, ANCHOR_TOPICS } from '@/features/atlas/territoryAnchors.generated';
import { LESSONS } from '@/features/content/lessonsData';
import { T, type Language } from '@/i18n/translations';

const LANGS = Object.keys(T) as Language[];

/**
 * The Atlas keeps its own catalog rather than adding forty keys to the 968-key
 * `T` table, which means the build-time i18n guard does not cover it. This is
 * the equivalent check.
 */
describe('atlas catalog', () => {
  it('translates every string into all six languages', () => {
    const gaps: string[] = [];
    for (const [key, entry] of Object.entries(ATLAS_CATALOG)) {
      for (const lang of LANGS) {
        if (!(entry as Record<string, string>)[lang]?.trim()) gaps.push(`${key} -> ${lang}`);
      }
    }
    expect(gaps).toEqual([]);
  });

  it('falls back to English for an unknown language rather than emitting a raw key', () => {
    expect(atlasText('atlas_title', 'klingon' as Language)).toBe(ATLAS_CATALOG.atlas_title.en);
  });

  it('substitutes every placeholder it is given', () => {
    for (const lang of LANGS) {
      const text = atlasText('atlas_uncovered', lang, { n: 3, m: 22 });
      expect(text, `${lang} left a placeholder`).not.toMatch(/\{[nm]\}/);
      expect(text).toContain('3');
      expect(text).toContain('22');
    }
  });

  it('labels years on the correct side of zero, in every language', () => {
    for (const lang of LANGS) {
      expect(formatYear(-3100, lang)).toContain(atlasText('atlas_bce', lang));
      expect(formatYear(1453, lang)).toContain(atlasText('atlas_ce', lang));
      // The minus sign belongs in the era label, not in front of the number.
      expect(formatYear(-3100, lang)).not.toContain('-3');
    }
  });
});

describe('decision points', () => {
  it('attaches every point to a real lesson and a section that exists', () => {
    for (const dp of DECISION_POINTS) {
      const lesson = LESSONS.find(l => l.id === dp.lessonId);
      expect(lesson, `${dp.id} points at a lesson that does not exist`).toBeTruthy();
      expect(dp.afterSection, `${dp.id} sits past the end of its lesson`)
        .toBeLessThan(lesson!.sections.length);
    }
  });

  it('names a historical option that is actually one of the options', () => {
    for (const dp of DECISION_POINTS) {
      expect(dp.options.map(o => o.id), `${dp.id}`).toContain(dp.historical);
    }
  });

  it('offers a real choice, not a single answer', () => {
    for (const dp of DECISION_POINTS) {
      expect(dp.options.length, `${dp.id} needs at least three options`).toBeGreaterThanOrEqual(3);
      expect(new Set(dp.options.map(o => o.id)).size).toBe(dp.options.length);
    }
  });

  it('translates every question, option, outcome and verdict into all six languages', () => {
    const gaps: string[] = [];
    for (const dp of DECISION_POINTS) {
      for (const lang of LANGS) {
        if (!loc(dp.question, lang)?.trim()) gaps.push(`${dp.id}.question/${lang}`);
        if (!loc(dp.verdict, lang)?.trim()) gaps.push(`${dp.id}.verdict/${lang}`);
        for (const o of dp.options) {
          if (!loc(o.label, lang)?.trim()) gaps.push(`${dp.id}.${o.id}.label/${lang}`);
          if (!loc(o.outcome, lang)?.trim()) gaps.push(`${dp.id}.${o.id}.outcome/${lang}`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });

  it('writes a verdict substantial enough to be worth reading', () => {
    // The whole mechanic is that the reader commits and then gets a real
    // answer. A one-line verdict makes the commitment pointless.
    for (const dp of DECISION_POINTS) {
      for (const lang of LANGS) {
        expect(loc(dp.verdict, lang).length, `${dp.id}/${lang} verdict is a stub`).toBeGreaterThan(300);
      }
    }
  });

  it('places at most one point per lesson section', () => {
    const seen = new Set<string>();
    for (const dp of DECISION_POINTS) {
      const slot = `${dp.lessonId}:${dp.afterSection}`;
      expect(seen.has(slot), `two points share ${slot}`).toBe(false);
      seen.add(slot);
    }
  });

  it('is found by the lookup the lesson body uses', () => {
    for (const dp of DECISION_POINTS) {
      expect(decisionPointFor(dp.lessonId, dp.afterSection)?.id).toBe(dp.id);
    }
    expect(decisionPointFor('modern-01', 99)).toBeUndefined();
  });
});

describe('follow a territory', () => {
  it('gives every anchor at least one lesson to walk', () => {
    // An anchor whose point lands in water, or outside every polygon, would be
    // a permanently empty option in the picker. Constantinople was exactly that
    // until the anchor moved inland off the Bosphorus.
    const empty = TERRITORY_ANCHORS.filter(a => (ANCHOR_TOPICS[a.id] ?? []).length === 0);
    expect(empty.map(a => a.name)).toEqual([]);
  });

  it('returns frames in chronological order across eras', () => {
    for (const anchor of TERRITORY_ANCHORS) {
      const years = framesTouching(anchor.id).map(f => f.year);
      expect(years, `${anchor.name} is out of order`).toEqual([...years].sort((a, b) => a - b));
    }
  });

  it('crosses eras rather than staying inside one', () => {
    // The point of the feature: a place's story is not confined to the era the
    // curriculum files it under.
    const spanning = TERRITORY_ANCHORS.filter(
      a => new Set(framesTouching(a.id).map(f => f.eraId)).size > 1,
    );
    expect(spanning.length, 'no anchor reaches more than one era').toBeGreaterThan(5);
  });

  it('returns nothing for an anchor that does not exist', () => {
    expect(framesTouching('atlantis')).toEqual([]);
  });
});
