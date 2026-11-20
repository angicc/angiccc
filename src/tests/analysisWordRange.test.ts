import { describe, it, expect } from 'vitest';
import { LESSONS } from '@/features/content/lessonsData';
import {
  analysisWordRange, SHORT_LESSON_MAX_SECTIONS,
  ANALYSIS_MIN_WORDS_SHORT, ANALYSIS_MIN_WORDS_LONG, ANALYSIS_MAX_WORDS,
} from '@/features/progress/analysisGate';

/**
 * The gate asks for fewer words when there is less lesson to analyse.
 *
 * "Paragraphs" here means SECTIONS, the headed blocks a reader scrolls past.
 * The obvious reading - prose paragraphs split on a blank line - separates
 * nothing: the shortest lesson in the curriculum still has seven of those.
 * Sections run 4 to 7 and split the set cleanly, which is the distinction a
 * reader actually perceives.
 */
describe('analysis word range', () => {
  it('asks short lessons for 100 words and longer ones for 150', () => {
    expect(analysisWordRange({ sections: Array(4).fill({ heading: '', body: '' }) })).toEqual(
      { min: ANALYSIS_MIN_WORDS_SHORT, max: ANALYSIS_MAX_WORDS });
    expect(analysisWordRange({ sections: Array(5).fill({ heading: '', body: '' }) })).toEqual(
      { min: ANALYSIS_MIN_WORDS_SHORT, max: ANALYSIS_MAX_WORDS });
    expect(analysisWordRange({ sections: Array(6).fill({ heading: '', body: '' }) })).toEqual(
      { min: ANALYSIS_MIN_WORDS_LONG, max: ANALYSIS_MAX_WORDS });
    expect(analysisWordRange({ sections: Array(7).fill({ heading: '', body: '' }) })).toEqual(
      { min: ANALYSIS_MIN_WORDS_LONG, max: ANALYSIS_MAX_WORDS });
  });

  it('caps every lesson at 300 words', () => {
    for (const l of LESSONS) expect(analysisWordRange(l).max, l.id).toBe(ANALYSIS_MAX_WORDS);
  });

  it('never makes a missing or empty lesson easier than a real one', () => {
    // A lesson that failed to load must fall back to the stricter bar, not the
    // looser one - otherwise a load failure becomes a way past the gate.
    expect(analysisWordRange(undefined).min).toBe(ANALYSIS_MIN_WORDS_LONG);
    expect(analysisWordRange(null).min).toBe(ANALYSIS_MIN_WORDS_LONG);
    expect(analysisWordRange({ sections: [] }).min).toBe(ANALYSIS_MIN_WORDS_LONG);
  });

  it('gives every shipped lesson one of exactly two ranges', () => {
    for (const l of LESSONS) {
      const { min } = analysisWordRange(l);
      expect([ANALYSIS_MIN_WORDS_SHORT, ANALYSIS_MIN_WORDS_LONG], l.id).toContain(min);
      expect(min, `${l.id} (${l.sections.length} sections)`).toBe(
        l.sections.length <= SHORT_LESSON_MAX_SECTIONS ? ANALYSIS_MIN_WORDS_SHORT : ANALYSIS_MIN_WORDS_LONG);
    }
  });

  it('splits the curriculum rather than moving all of it', () => {
    // Guards against a future content change quietly dropping every lesson into
    // one bucket, which would make the whole distinction pointless.
    const short = LESSONS.filter(l => analysisWordRange(l).min === ANALYSIS_MIN_WORDS_SHORT).length;
    expect(short).toBeGreaterThan(10);
    expect(LESSONS.length - short).toBeGreaterThan(10);
  });
});
