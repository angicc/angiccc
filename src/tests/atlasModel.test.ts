import { describe, it, expect } from 'vitest';
import {
  atlasFrames, atlasSpan, frameAtYear, topicForYear, topicErasFor,
  isRevealed, atlasProgress, allFrames,
} from '@/features/atlas/atlasModel';
import { LESSONS } from '@/features/content/lessonsData';
import { TERRITORY_TOPICS } from '@/features/content/timelineTerritoryData';

const ERAS = ['prehistoric', 'ancient', 'byzantine', 'middle-ages', 'early-modern', 'modern'];

describe('atlas frames', () => {
  it('places every lesson on its era timeline', () => {
    const total = ERAS.reduce((n, e) => n + atlasFrames(e).length, 0);
    expect(total).toBe(LESSONS.length);
  });

  it('orders each era by year, not by authoring order', () => {
    for (const era of ERAS) {
      const years = atlasFrames(era).map(f => f.year);
      expect(years, `${era} is out of order`).toEqual([...years].sort((a, b) => a - b));
    }
  });

  it('numbers frames from 1 within each era', () => {
    for (const era of ERAS) {
      const frames = atlasFrames(era);
      expect(frames.map(f => f.index)).toEqual(frames.map((_, i) => i + 1));
    }
  });
});

/**
 * The curriculum calls it `middle-ages`; the territory topics call it
 * `medieval`. Nothing reconciles the two automatically, and the failure is
 * silent - the era matches no topics and the map renders empty rather than
 * throwing. This is the check that would have caught it.
 */
describe('era vocabulary', () => {
  it('reconciles the two spellings of the middle ages', () => {
    expect(topicErasFor('middle-ages')).toContain('medieval');
  });

  it('leaves no era unable to find its own topics', () => {
    const topicEras = new Set(TERRITORY_TOPICS.map(t => t.era));
    const orphaned = [...topicEras].filter(
      te => !ERAS.some(era => topicErasFor(era).includes(te)),
    );
    expect(orphaned, 'a territory era no curriculum era can reach').toEqual([]);
  });
});

describe('year to territory resolution', () => {
  it('finds a topic for every lesson in every era that has any', () => {
    for (const era of ERAS) {
      const frames = atlasFrames(era);
      const hasTopics = TERRITORY_TOPICS.some(t => topicErasFor(era).includes(t.era));
      if (!hasTopics) continue;
      const blank = frames.filter(f => !f.topicId).map(f => f.lessonId);
      expect(blank, `${era} lessons resolve to no territory`).toEqual([]);
    }
  });

  it('prefers a topic whose range contains the year', () => {
    // 1453 sits inside the Byzantine span; it must not resolve to something
    // merely nearby.
    const id = topicForYear('byzantine', 1453);
    const topic = TERRITORY_TOPICS.find(t => t.id === id)!;
    expect(topic.yearRange[0]).toBeLessThanOrEqual(1453);
    expect(topic.yearRange[1]).toBeGreaterThanOrEqual(1453);
  });

  it('prefers the tightest containing range over a broader one', () => {
    // A topic spanning eleven centuries says less about a year than one
    // spanning thirty around it.
    const eras = topicErasFor('modern');
    const candidates = TERRITORY_TOPICS.filter(t => eras.includes(t.era));
    const year = 1914;
    const containing = candidates.filter(t => year >= t.yearRange[0] && year <= t.yearRange[1]);
    if (containing.length < 2) return;   // nothing to choose between
    const chosen = TERRITORY_TOPICS.find(t => t.id === topicForYear('modern', year))!;
    const widths = containing.map(t => t.yearRange[1] - t.yearRange[0]);
    expect(chosen.yearRange[1] - chosen.yearRange[0]).toBe(Math.min(...widths));
  });

  it('falls back to the nearest topic rather than returning nothing', () => {
    // A year far outside every range must still draw something; an empty map
    // reads as a broken feature, not as missing data.
    expect(topicForYear('ancient', -99999)).toBeTruthy();
    expect(topicForYear('modern', 99999)).toBeTruthy();
  });

  it('returns null only for an era with no topics at all', () => {
    expect(topicForYear('not-an-era', 1500)).toBeNull();
  });
});

describe('scrubbing', () => {
  const frames = atlasFrames('modern');

  it('holds the previous frame between two lessons instead of blanking', () => {
    const a = frames[2], b = frames[3];
    const between = Math.floor((a.year + b.year) / 2);
    if (between === a.year) return;
    expect(frameAtYear(frames, between)!.lessonId).toBe(a.lessonId);
  });

  it('clamps below the first frame to the first frame', () => {
    expect(frameAtYear(frames, atlasSpan(frames)[0] - 500)!.lessonId).toBe(frames[0].lessonId);
  });

  it('lands on the last frame at the end of the span', () => {
    expect(frameAtYear(frames, atlasSpan(frames)[1])!.lessonId)
      .toBe(frames[frames.length - 1].lessonId);
  });
});

describe('progress-driven fog', () => {
  const frames = atlasFrames('ancient');

  it('reveals a frame only once its lesson is read', () => {
    expect(isRevealed(frames[0], [])).toBe(false);
    expect(isRevealed(frames[0], [frames[0].lessonId])).toBe(true);
  });

  it('reports a frontier that tracks the furthest lesson read', () => {
    const empty = atlasProgress(frames, []);
    expect(empty.revealed).toBe(0);
    expect(empty.frontier).toBeNull();

    const two = atlasProgress(frames, [frames[0].lessonId, frames[1].lessonId]);
    expect(two.revealed).toBe(2);
    expect(two.frontier).toBe(frames[1].year);
    expect(two.total).toBe(frames.length);
  });

  it('is unmoved by a lesson id from another era', () => {
    expect(atlasProgress(frames, ['modern-01']).revealed).toBe(0);
  });
});

describe('the full spine', () => {
  it('spans every lesson in chronological order across all eras', () => {
    const all = allFrames();
    expect(all).toHaveLength(LESSONS.length);
    const years = all.map(f => f.year);
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });
});
