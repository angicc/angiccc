import { describe, it, expect } from 'vitest';
import { LESSONS } from '@/features/content/lessonsData';
import { LESSON_START_YEAR } from '@/features/content/lessonChronology';

const ERAS = [...new Set(LESSONS.map(l => l.eraId))];

/**
 * Lessons were numbered in the order they were written, which put the Scramble
 * for Africa after Globalization and the Fall of Constantinople before the
 * empire's own recovery. Order is now derived from when each lesson's history
 * BEGINS, and these tests keep it that way as lessons are added.
 */
describe('lesson chronology', () => {
  it('stamps every lesson with a start year', () => {
    const missing = LESSONS.filter(l => LESSON_START_YEAR[l.id] === undefined);
    expect(missing.map(l => `${l.id} (${l.title})`)).toEqual([]);
  });

  it.each(ERAS)('orders %s chronologically', eraId => {
    const inEra = LESSONS.filter(l => l.eraId === eraId).sort((a, b) => a.order - b.order);
    const years = inEra.map(l => LESSON_START_YEAR[l.id]);
    const sorted = [...years].sort((a, b) => a - b);
    expect(years).toEqual(sorted);
  });

  it.each(ERAS)('numbers %s from 1 with no gaps or duplicates', eraId => {
    const orders = LESSONS.filter(l => l.eraId === eraId).map(l => l.order).sort((a, b) => a - b);
    expect(orders).toEqual(Array.from({ length: orders.length }, (_, i) => i + 1));
  });

  it('keeps every start year inside its era window', () => {
    // A lesson stamped with a year from the wrong era would sort correctly
    // within its own list while being plainly misfiled.
    const WINDOWS: Record<string, [number, number]> = {
      prehistoric: [-300_000_000, -3_000],
      ancient: [-4_000, 500],
      byzantine: [300, 1500],
      'middle-ages': [400, 1500],
      'early-modern': [1300, 1800],
      modern: [1700, 2030],
    };
    const wrong = LESSONS.flatMap(l => {
      const w = WINDOWS[l.eraId];
      const y = LESSON_START_YEAR[l.id];
      if (!w || y === undefined) return [];
      return y < w[0] || y > w[1] ? [`${l.id} → ${y} outside ${l.eraId}`] : [];
    });
    expect(wrong).toEqual([]);
  });

  it('has no duplicate lesson ids', () => {
    const ids = LESSONS.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes the Second World War lesson in the Modern era', () => {
    const ww2 = LESSONS.find(l => l.id === 'modern-23');
    expect(ww2).toBeDefined();
    expect(ww2!.eraId).toBe('modern');
    expect(ww2!.sections.length).toBeGreaterThanOrEqual(5);
    expect(ww2!.keyFacts.length).toBeGreaterThanOrEqual(3);
    // It must sit after the first-war lesson and before the Cold War.
    const order = (id: string) => LESSONS.find(l => l.id === id)!.order;
    expect(order('modern-23')).toBeGreaterThan(order('modern-02'));
    expect(order('modern-23')).toBeLessThan(order('modern-03'));
  });
});
