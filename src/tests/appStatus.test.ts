import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  overallHealth, isHealthy, sortedEntries, activeEntries, localized,
  COMPONENT_IDS, type StatusDoc, type Health,
} from '@/features/status/statusModel';
import { STATUS_CATALOG, statusText, componentLabel, HEALTH_STYLE } from '@/features/status/statusCatalog';
import { T, type Language } from '@/i18n/translations';

const ROOT = path.resolve(__dirname, '../..');
const LANGS = Object.keys(T) as Language[];
const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/status.json'), 'utf8')) as StatusDoc;

const comp = (id: string, status: Health) => ({ id, status });

/**
 * The overall state is computed from the components rather than declared.
 *
 * The first version of status.json declared "operational" while two of its own
 * components were "degraded". A status page that contradicts itself on its own
 * front page is worse than not having one.
 */
describe('overall health', () => {
  it('is the worst component', () => {
    expect(overallHealth({ components: [comp('a', 'operational'), comp('b', 'degraded')] })).toBe('degraded');
    expect(overallHealth({ components: [comp('a', 'degraded'), comp('b', 'outage')] })).toBe('outage');
  });

  it('is operational only when everything is', () => {
    expect(isHealthy({ components: [comp('a', 'operational'), comp('b', 'operational')] })).toBe(true);
    expect(isHealthy({ components: [comp('a', 'operational'), comp('b', 'maintenance')] })).toBe(false);
  });

  it('lets a declared status escalate, for a planned maintenance window', () => {
    expect(overallHealth({ status: 'maintenance', components: [comp('a', 'operational')] })).toBe('maintenance');
  });

  it('never lets a declared status claim things are better than they are', () => {
    // This is the guard. Declaring "operational" over a broken component would
    // let the page lie.
    expect(overallHealth({ status: 'operational', components: [comp('a', 'outage')] })).toBe('outage');
    expect(overallHealth({ status: 'maintenance', components: [comp('a', 'degraded')] })).toBe('degraded');
  });

  it('treats an empty component list as operational', () => {
    expect(overallHealth({ components: [] })).toBe('operational');
  });
});

describe('ordering', () => {
  const entries = [
    { id: 'old', kind: 'release' as const, at: '2026-01-01T00:00:00Z', title: { en: 'a' }, body: { en: 'a' } },
    { id: 'new', kind: 'release' as const, at: '2026-06-01T00:00:00Z', title: { en: 'b' }, body: { en: 'b' } },
    { id: 'open', kind: 'incident' as const, at: '2025-01-01T00:00:00Z', title: { en: 'c' }, body: { en: 'c' } },
    { id: 'fixed', kind: 'incident' as const, at: '2026-07-01T00:00:00Z', title: { en: 'd' }, body: { en: 'd' }, resolvedAt: '2026-07-02T00:00:00Z' },
  ];

  it('puts anything unresolved first, however old', () => {
    // A three-month-old open incident still matters more than yesterday's
    // release note.
    expect(sortedEntries(entries)[0].id).toBe('open');
  });

  it('orders the rest newest first', () => {
    const rest = sortedEntries(entries).slice(1).map(e => e.id);
    expect(rest).toEqual(['fixed', 'new', 'old']);
  });

  it('counts only unresolved incidents and maintenance as active', () => {
    expect(activeEntries(entries).map(e => e.id)).toEqual(['open']);
  });
});

describe('the shipped status file', () => {
  it('is valid and uses only known health levels', () => {
    const valid: Health[] = ['operational', 'degraded', 'maintenance', 'outage'];
    for (const c of doc.components) expect(valid, `component ${c.id}`).toContain(c.status);
  });

  it('describes every component the app knows how to name', () => {
    // An unnamed component renders its raw id, which reads as a bug.
    for (const c of doc.components) {
      expect(COMPONENT_IDS, `${c.id} has no label`).toContain(c.id as (typeof COMPONENT_IDS)[number]);
    }
  });

  it('gives every entry a unique id, a real date and English text', () => {
    const ids = doc.entries.map(e => e.id);
    expect([...new Set(ids)]).toHaveLength(ids.length);
    for (const e of doc.entries) {
      expect(Number.isNaN(Date.parse(e.at)), `${e.id} date`).toBe(false);
      expect(e.title.en?.trim(), `${e.id} title`).toBeTruthy();
      expect(e.body.en?.trim(), `${e.id} body`).toBeTruthy();
    }
  });

  it('translates every entry into all six languages', () => {
    const gaps: string[] = [];
    for (const e of doc.entries) {
      for (const lang of LANGS) {
        if (!localized(e.title, lang)?.trim()) gaps.push(`${e.id}.title/${lang}`);
        if (!localized(e.body, lang)?.trim()) gaps.push(`${e.id}.body/${lang}`);
      }
    }
    expect(gaps).toEqual([]);
  });

  it('translates the summary into all six languages', () => {
    for (const lang of LANGS) expect(localized(doc.summary, lang)?.trim(), lang).toBeTruthy();
  });

  it('does not declare a status better than its own components', () => {
    if (!doc.status) return;
    expect(overallHealth(doc)).toBe(overallHealth({ components: doc.components }));
  });

  it('carries a parseable timestamp', () => {
    expect(Number.isNaN(Date.parse(doc.updatedAt))).toBe(false);
  });
});

describe('status vocabulary', () => {
  it('translates every label into all six languages', () => {
    const gaps: string[] = [];
    for (const [key, entry] of Object.entries(STATUS_CATALOG)) {
      for (const lang of LANGS) {
        if (!(entry as Record<string, string>)[lang]?.trim()) gaps.push(`${key}/${lang}`);
      }
    }
    expect(gaps).toEqual([]);
  });

  it('names every component in every language', () => {
    for (const id of COMPONENT_IDS) {
      for (const lang of LANGS) {
        expect(componentLabel(id, lang), `${id}/${lang}`).not.toBe(id);
      }
    }
  });

  it('falls back to English rather than showing a raw key', () => {
    expect(statusText('status_title', 'klingon' as Language)).toBe(STATUS_CATALOG.status_title.en);
  });

  it('has a colour for every health level', () => {
    for (const h of ['operational', 'degraded', 'maintenance', 'outage'] as Health[]) {
      expect(HEALTH_STYLE[h]?.dot, h).toBeTruthy();
    }
  });
});
