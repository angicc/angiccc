import { describe, test, expect } from 'vitest';
import { LESSONS_CATALOG, CATALOG_BY_LESSON_KEY } from '../data/lessonsCatalog';
import { LESSONS } from '../features/content/lessonsData';

describe('Lessons Catalog Audit', () => {
  test('contains exactly 69 lessons', () => {
    expect(LESSONS_CATALOG.length).toBe(69);
  });

  test('all lesson IDs are sequential from 1 to 69', () => {
    LESSONS_CATALOG.forEach((lesson, index) => {
      expect(lesson.id).toBe(index + 1);
    });
  });

  test('no title contains glitched strings or missing Macedonian Cyrillic text', () => {
    LESSONS_CATALOG.forEach((lesson) => {
      expect(lesson.correctedTitle).not.toContain('undefined');
      expect(lesson.correctedTitle).not.toContain('[Glitched]');
      expect(lesson.correctedTitle.length).toBeGreaterThan(2);
    });
  });

  test('corrected titles are pure Macedonian Cyrillic (no stray Latin words)', () => {
    // Digits and punctuation are fine; Latin letters are not (the glitches the
    // catalog exists to fix: "Antica Кина", "Велико Zimbabwe", "Mesoamerica").
    LESSONS_CATALOG.forEach((lesson) => {
      expect(lesson.correctedTitle).not.toMatch(/[A-Za-z]/);
    });
  });

  test('every entry has a banner concept, tags, and a Tailwind gradient', () => {
    LESSONS_CATALOG.forEach((lesson) => {
      expect(lesson.bannerConcept.length).toBeGreaterThan(10);
      expect(lesson.searchTags.length).toBeGreaterThanOrEqual(1);
      expect(lesson.fallbackGradient).toMatch(/^from-[a-z]+-\d+ to-[a-z]+-\d+$/);
    });
  });

  test('every lessonKey resolves to a real lesson in the live curriculum', () => {
    const liveIds = new Set(LESSONS.map(l => l.id));
    LESSONS_CATALOG.forEach((lesson) => {
      expect(liveIds.has(lesson.lessonKey), `missing lesson ${lesson.lessonKey}`).toBe(true);
    });
  });

  test('lessonKey join map is complete and collision-free', () => {
    expect(Object.keys(CATALOG_BY_LESSON_KEY).length).toBe(69);
  });
});
