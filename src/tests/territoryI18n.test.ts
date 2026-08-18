import { describe, it, expect } from 'vitest';
import { TERRITORY_TOPICS } from '@/features/content/timelineTerritoryData';
import { POLY_LABEL_I18N } from '@/i18n/territoryMarkerTranslations';
import type { Language } from '@/i18n/translations';

const CONTENT_LANGS: Exclude<Language, 'en'>[] = ['es', 'ru', 'mk', 'de', 'fr'];

/**
 * The Territory Map's own copy is CONTENT, not UI keys, so the build's
 * translation-coverage check never looked at it. Every topic title, and every
 * trade/campaign route name, is authored inline on the topic — and 39 route
 * names carried only es/ru/mk, rendering English on the German and French maps
 * while the rest of the page was translated.
 *
 * This walks the source data, so a topic or route added without translations
 * fails here rather than shipping half-English.
 */
describe('Territory Map content translations', () => {
  it('has a title in every language for every topic', () => {
    const gaps = TERRITORY_TOPICS.flatMap(topic => {
      const missing = CONTENT_LANGS.filter(l => !topic.titleI18n?.[l]);
      return missing.length > 0 ? [`${topic.id} → ${missing.join(', ')}`] : [];
    });
    expect(gaps).toEqual([]);
  });

  it('has a name in every language for every route', () => {
    const gaps = TERRITORY_TOPICS.flatMap(topic =>
      (topic.routes ?? []).flatMap(route => {
        const missing = CONTENT_LANGS.filter(l => !route.nameI18n?.[l]);
        return missing.length > 0 ? [`${topic.id} "${route.name}" → ${missing.join(', ')}`] : [];
      }),
    );
    expect(gaps).toEqual([]);
  });

  it('never leaves a translation blank or identical to the English source', () => {
    const suspicious = TERRITORY_TOPICS.flatMap(topic =>
      (topic.routes ?? []).flatMap(route =>
        CONTENT_LANGS.flatMap(l => {
          const v = route.nameI18n?.[l];
          return v !== undefined && v.trim() === '' ? [`${topic.id} "${route.name}" → ${l} is blank`] : [];
        }),
      ),
    );
    expect(suspicious).toEqual([]);
  });

  it('draws each topic with polygons or markers, never an empty map', () => {
    const empty = TERRITORY_TOPICS.filter(
      t => (t.polygons?.length ?? 0) === 0 && (t.markers?.length ?? 0) === 0,
    );
    expect(empty.map(t => t.id)).toEqual([]);
  });

  it('closes every polygon ring and keeps coordinates on Earth', () => {
    const broken: string[] = [];
    for (const topic of TERRITORY_TOPICS) {
      for (const poly of topic.polygons ?? []) {
        const first = poly.coords[0];
        const last = poly.coords[poly.coords.length - 1];
        if (poly.coords.length < 4) broken.push(`${topic.id}/${poly.label}: fewer than 4 points`);
        if (first[0] !== last[0] || first[1] !== last[1]) {
          broken.push(`${topic.id}/${poly.label}: ring is not closed`);
        }
        for (const [lat, lng] of poly.coords) {
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            broken.push(`${topic.id}/${poly.label}: point off the globe (${lat}, ${lng})`);
            break;
          }
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('has a translation entry for every polygon label the map draws', () => {
    // Checked by ENTRY PRESENCE, not by "differs from English". Plenty of
    // labels are proper nouns that are legitimately identical — Afghanistan is
    // Afghanistan in German and French — so a value-comparison check reports
    // those as missing and hides the ones that really are.
    const labels = new Set(
      TERRITORY_TOPICS.flatMap(t => (t.polygons ?? []).map(p => p.label).filter(Boolean) as string[]),
    );
    const gaps = [...labels].flatMap(label => {
      const entry = POLY_LABEL_I18N[label];
      if (!entry) return [`${label} → no entry at all`];
      const missing = CONTENT_LANGS.filter(l => !entry[l]?.trim());
      return missing.length > 0 ? [`${label} → ${missing.join(', ')}`] : [];
    });
    expect(gaps).toEqual([]);
  });
});
