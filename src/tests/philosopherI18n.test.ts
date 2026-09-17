import { describe, it, expect } from 'vitest';
import {
  PHILOSOPHERS, PHILOSOPHER_ERA_I18N, PHILOSOPHER_TAGLINE_I18N,
  getTranslatedPhilosopherEra, getTranslatedPhilosopherTagline, getPhilosopherName,
  getPhilosopherLifespan,
  type PhilosopherLang,
} from '@/features/philosopher/philosophersData';
import { T, type Language } from '@/i18n/translations';

const CONTENT_LANGS: PhilosopherLang[] = ['es', 'ru', 'mk', 'de', 'fr'];

/** Latin left in Latin on purpose. Listed, so adding one is a decision. */
const LATIN_QUOTATIONS = new Set(['Cogito', 'ergo']);

/**
 * Debate a Philosopher shipped French and German chrome around English content.
 *
 * Every translation table here stopped at Macedonian, and the debate screen cast
 * the active language to the same three codes inline, so `de` and `fr` fell
 * through to English. The page looked translated - the buttons, the headings,
 * the prompt - while the philosopher's era, quote and three opening arguments
 * stayed in English, which is the most visible text on the screen.
 */
describe('philosopher content languages', () => {
  it('covers the same languages the app ships', () => {
    const ui = (Object.keys(T) as Language[]).filter(l => l !== 'en');
    expect([...CONTENT_LANGS].sort()).toEqual([...ui].sort());
  });

  it('translates every era label into every content language', () => {
    const gaps: string[] = [];
    for (const p of PHILOSOPHERS) {
      for (const lang of CONTENT_LANGS) {
        if (!PHILOSOPHER_ERA_I18N[p.id]?.[lang]?.trim()) gaps.push(`${p.id}/${lang}`);
      }
    }
    expect(gaps).toEqual([]);
  });

  it('translates every tagline into every content language', () => {
    const gaps: string[] = [];
    for (const p of PHILOSOPHERS) {
      for (const lang of CONTENT_LANGS) {
        if (!PHILOSOPHER_TAGLINE_I18N[p.id]?.[lang]?.trim()) gaps.push(`${p.id}/${lang}`);
      }
    }
    expect(gaps).toEqual([]);
  });

  it('translates every opening argument, keeping the count', () => {
    // A short array silently leaves the last argument in English, which is
    // exactly how a partial translation hides.
    const gaps: string[] = [];
    for (const p of PHILOSOPHERS) {
      for (const lang of CONTENT_LANGS) {
        const args = p.starterArgumentsI18n?.[lang];
        if (!args) { gaps.push(`${p.id}/${lang}: missing`); continue; }
        if (args.length !== p.starterArguments.length) {
          gaps.push(`${p.id}/${lang}: ${args.length} of ${p.starterArguments.length}`);
        }
        args.forEach((a, i) => { if (!a?.trim()) gaps.push(`${p.id}/${lang}[${i}]: empty`); });
      }
    }
    expect(gaps).toEqual([]);
  });

  it('names every philosopher in every content language', () => {
    const gaps = PHILOSOPHERS.flatMap(p =>
      CONTENT_LANGS.filter(l => !p.nameI18n?.[l]?.trim()).map(l => `${p.id}/${l}`));
    expect(gaps).toEqual([]);
  });

  it('returns translated text, not the English source, from each accessor', () => {
    for (const p of PHILOSOPHERS) {
      for (const lang of CONTENT_LANGS) {
        expect(getTranslatedPhilosopherEra(p, lang), `${p.id}/${lang} era`).not.toBe(p.era);
        expect(getTranslatedPhilosopherTagline(p, lang), `${p.id}/${lang} tagline`).not.toBe(p.tagline);
      }
    }
  });

  it('localises the era suffix on every lifespan', () => {
    // "341-270 BCE" sat untranslated next to a fully translated era label.
    for (const p of PHILOSOPHERS) {
      for (const lang of CONTENT_LANGS) {
        expect(getPhilosopherLifespan(p, lang), `${p.id}/${lang} kept BCE`).not.toMatch(/\bBCE\b/);
        expect(getPhilosopherLifespan(p, lang), `${p.id}/${lang} kept CE`).not.toMatch(/\bCE\b/);
      }
    }
  });

  it('rewrites BCE before CE so "BCE" is not mangled into a stray suffix', () => {
    const bce = PHILOSOPHERS.find(p => /BCE/.test(p.lifespan))!;
    expect(getPhilosopherLifespan(bce, 'fr')).toContain('av. J.-C.');
    expect(getPhilosopherLifespan(bce, 'fr')).not.toContain('Bapr.');
  });

  it('still falls back to English for an unknown language', () => {
    const p = PHILOSOPHERS[0];
    expect(getTranslatedPhilosopherEra(p, 'klingon')).toBe(p.era);
    expect(getTranslatedPhilosopherTagline(p, 'klingon')).toBe(p.tagline);
    expect(getPhilosopherName(p, 'klingon')).toBe(p.name);
  });

  it('leaves no English words inside a non-Latin translation', () => {
    // The Russian Machiavelli quote read "Лучше быть feared, чем любимым".
    // A Latin run of four or more letters inside Cyrillic prose is either an
    // untranslated word or a proper noun that should have been transliterated.
    const offenders: string[] = [];
    for (const p of PHILOSOPHERS) {
      for (const lang of ['ru', 'mk'] as PhilosopherLang[]) {
        const texts = [
          PHILOSOPHER_ERA_I18N[p.id]?.[lang],
          PHILOSOPHER_TAGLINE_I18N[p.id]?.[lang],
          ...(p.starterArgumentsI18n?.[lang] ?? []),
        ].filter(Boolean) as string[];
        for (const text of texts) {
          if (!/[Ѐ-ӿ]/.test(text)) continue;   // not Cyrillic prose
          for (const m of text.matchAll(/\b[A-Za-z]{4,}\b/g)) {
            // Descartes' maxim is quoted in Latin in Russian and Macedonian
            // editions alike. It is a quotation, not an untranslated word.
            if (LATIN_QUOTATIONS.has(m[0])) continue;
            offenders.push(`${p.id}/${lang}: ${m[0]}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
