import { describe, it, expect } from 'vitest';
import { CLIO_SAMPLE_DIALOGUES, sampleTurns, sampleTopic } from '@/features/ai/clioSampleDialogues';
import { SAMPLE_TURNS_I18N, SAMPLE_LANGS } from '@/features/ai/clioSampleDialogues.i18n';
import { T, type Language } from '@/i18n/translations';

const UI_LANGUAGES = Object.keys(T) as Language[];

/**
 * The AI Tutor's empty state offers three curated exchanges. The chip labels
 * were translated but the transcript behind them was not, so tapping
 * "Колапсот на бронзеното доба" opened four paragraphs of English.
 *
 * The failure was invisible to the build-time i18n guard, which reads the `T`
 * table: this prose never entered it.
 */
describe('Clio sample dialogues', () => {
  it('offers a translation for every dialogue in every non-English language', () => {
    expect([...SAMPLE_LANGS].sort()).toEqual(UI_LANGUAGES.filter(l => l !== 'en').sort());
    for (const d of CLIO_SAMPLE_DIALOGUES) {
      for (const lang of SAMPLE_LANGS) {
        expect(SAMPLE_TURNS_I18N[d.id]?.[lang], `${d.id} has no ${lang} transcript`).toBeTruthy();
      }
    }
  });

  it('translates every turn, not just the first', () => {
    // An array one short leaves the last exchange in English, which is exactly
    // how a partial translation hides.
    for (const d of CLIO_SAMPLE_DIALOGUES) {
      for (const lang of SAMPLE_LANGS) {
        expect(SAMPLE_TURNS_I18N[d.id][lang], `${d.id}/${lang} turn count`).toHaveLength(d.turns.length);
        for (const [i, text] of SAMPLE_TURNS_I18N[d.id][lang].entries()) {
          expect(text.trim(), `${d.id}/${lang} turn ${i} is empty`).not.toBe('');
        }
      }
    }
  });

  it('returns text that differs from the English for every loaded turn', () => {
    for (const d of CLIO_SAMPLE_DIALOGUES) {
      for (const lang of SAMPLE_LANGS) {
        sampleTurns(d, lang).forEach((turn, i) => {
          expect(turn.content, `${d.id}/${lang} turn ${i} is still English`).not.toBe(d.turns[i].content);
        });
      }
    }
  });

  it('keeps the speaker order the translation was written against', () => {
    // The turns alternate student/Clio. If a translation array were reordered
    // the transcript would put Clio's answer in the student's bubble.
    for (const d of CLIO_SAMPLE_DIALOGUES) {
      for (const lang of [...SAMPLE_LANGS, 'en']) {
        expect(sampleTurns(d, lang).map(t => t.role)).toEqual(d.turns.map(t => t.role));
      }
    }
  });

  it('carries the dates and figures across every translation', () => {
    // A translation that quietly drops "1177" or rounds "132" teaches the wrong
    // history, which is worse than teaching it in the wrong language.
    const FIGURES: Record<string, string[]> = {
      'sample-bronze-collapse': ['1200', '1150', '1177'],
      'sample-printing-press': ['42', '1455', '1500', '1517', '1415', '1648'],
      'sample-cold-war': ['1962', '100', '1919', '132', '1963'],
    };
    for (const d of CLIO_SAMPLE_DIALOGUES) {
      for (const lang of SAMPLE_LANGS) {
        const joined = sampleTurns(d, lang).map(t => t.content).join(' ');
        for (const n of FIGURES[d.id]) {
          expect(joined, `${d.id}/${lang} lost the figure ${n}`).toContain(n);
        }
      }
    }
  });

  it('falls back to English rather than rendering nothing', () => {
    const d = CLIO_SAMPLE_DIALOGUES[0];
    expect(sampleTurns(d, 'en')).toEqual(d.turns);
    expect(sampleTurns(d, 'klingon')).toEqual(d.turns);
    expect(sampleTopic(d, 'klingon')).toBe(d.topic);
    expect(sampleTopic(d, 'en')).toBe(d.topic);
  });

  it('localises the chip label in every language', () => {
    for (const d of CLIO_SAMPLE_DIALOGUES) {
      for (const lang of SAMPLE_LANGS) {
        expect(sampleTopic(d, lang), `${d.id}/${lang} chip is English`).not.toBe(d.topic);
      }
    }
  });

  it('writes no CJK into a Latin or Cyrillic transcript', () => {
    // Sonnet has welded stray kanji into translated prose here before. The
    // build guard sweeps `src`, but these strings are worth naming explicitly.
    //
    // The range is written in escapes on purpose: spelling it with literal
    // characters puts CJK into this file, and the build guard — correctly —
    // refuses to compile a tree that contains any.
    const CJK = /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/;
    for (const d of CLIO_SAMPLE_DIALOGUES) {
      for (const lang of SAMPLE_LANGS) {
        for (const [i, text] of SAMPLE_TURNS_I18N[d.id][lang].entries()) {
          expect(text, `${d.id}/${lang} turn ${i} contains CJK`).not.toMatch(CJK);
        }
      }
    }
  });
});
