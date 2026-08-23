import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { TERRITORY_TOPICS } from '@/features/content/timelineTerritoryData';
import {
  POLY_LABEL_I18N, MARKER_NAME_I18N, MARKER_NOTE_I18N, MARKER_NOTE_TEXT_I18N, MARKER_TYPE_I18N,
} from '@/i18n/territoryMarkerTranslations';
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

  /**
   * The names in public/data/map-territories/*.json — the layer that actually
   * renders.
   *
   * The map prefers this generated GeoJSON over the TypeScript polygons
   * (TimelineMapPage: `realGeomRef.current[selected.id] ?? selected.polygons`),
   * so for the 32 topics that have a file, the TS labels below are never drawn
   * at all. Checking only those left 25 rendered names — "World War I",
   * "Roman Empire (c. 200 CE)" — with no translation and nothing to say so.
   */
  function runtimeEntityNames(): string[] {
    const dir = path.resolve(__dirname, '../../public/data/map-territories');
    if (!fs.existsSync(dir)) return [];
    const names = new Set<string>();
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.json') || file === '_index.json') continue;
      const fc = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      for (const feature of fc.features ?? []) {
        const name = feature?.properties?.entity_name;
        if (typeof name === 'string' && name.trim()) names.add(name);
      }
    }
    return [...names];
  }

  it('has a translation entry for every name the generated geometry draws', () => {
    const names = runtimeEntityNames();
    expect(names.length).toBeGreaterThan(20);   // an empty read is a bug, not a pass
    const gaps = names.flatMap(name => {
      const entry = POLY_LABEL_I18N[name];
      if (!entry) return [`${name} → no entry at all`];
      const missing = CONTENT_LANGS.filter(l => !entry[l]?.trim());
      return missing.length > 0 ? [`${name} → ${missing.join(', ')}`] : [];
    });
    expect(gaps).toEqual([]);
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

  /**
   * Every pin the map plants, in every language.
   *
   * Marker names and notes are NOT read from the topic data — they go through
   * the lookup tables, which fall back to the English string when a key is
   * absent. That fallback is silent, so 78 place names and 68 pin notes
   * rendered in English on an otherwise Macedonian map, in almost every era:
   * Thessalonica and Preslav on the Cyril-and-Methodius map, Angkor Wat on the
   * Khmer one, Pergamon on the Hellenistic one. Nothing failed; it just read
   * as half-finished.
   */
  it('translates every marker name, note and type the map plants', () => {
    const complete = (table: Record<string, Partial<Record<string, string>>>, key: string) =>
      Boolean(table[key]) && CONTENT_LANGS.every(l => (table[key][l] ?? '').trim().length > 0);

    const gaps: string[] = [];
    for (const topic of TERRITORY_TOPICS) {
      for (const m of topic.markers ?? []) {
        if (!complete(MARKER_NAME_I18N, m.name)) gaps.push(`${topic.id}: marker name "${m.name}"`);
        if (!complete(MARKER_TYPE_I18N, m.type)) gaps.push(`${topic.id}: marker type "${m.type}"`);
        // A note may be keyed by the marker it belongs to, or by its own text
        // when the same sentence is shared between pins.
        if (m.note && !complete(MARKER_NOTE_I18N, m.name) && !complete(MARKER_NOTE_TEXT_I18N, m.note)) {
          gaps.push(`${topic.id}: note for "${m.name}"`);
        }
      }
      for (const r of topic.routes ?? []) {
        if (!complete(MARKER_TYPE_I18N, r.type)) gaps.push(`${topic.id}: route type "${r.type}"`);
      }
    }
    expect(gaps, `${gaps.length} map label(s) would render in English`).toEqual([]);
  });
});

/**
 * A duplicate key in these tables is a TypeScript error (TS1117), so it fails
 * `tsc -b` — but vitest does not run tsc, so a green test suite said nothing
 * about it and a broken build reached a push. The second entry also silently
 * wins at runtime, which is how a correct translation gets shadowed by a worse
 * one. Cheap to check here, where it is caught in seconds.
 */
describe('territory translation tables', () => {
  it('declares every key exactly once', () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, '../i18n/territoryMarkerTranslations.ts'), 'utf8');
    const dupes: string[] = [];
    for (const table of src.matchAll(/export const (\w+): Record<string, MT> = \{/g)) {
      const start = table.index! + table[0].length;
      const body = src.slice(start, src.indexOf('\n};', start));
      const seen = new Set<string>();
      for (const k of body.matchAll(/^\s*'((?:[^'\\]|\\.)*)':/gm)) {
        if (seen.has(k[1])) dupes.push(`${table[1]}: '${k[1]}'`);
        seen.add(k[1]);
      }
    }
    expect(dupes, 'duplicate key — the later entry silently wins').toEqual([]);
  });
});
