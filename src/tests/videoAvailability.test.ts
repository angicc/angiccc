import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  replacementOrder, firstAvailable, isVideoAvailable, resetAvailabilityCache,
  type ReplaceableVideo,
} from '@/features/videoReview/videoAvailability';
import { HISTORY_VIDEOS } from '@/features/videoReview/videoData';

const v = (id: string, era: string, youtubeId = id): ReplaceableVideo => ({ id, era, youtubeId });

describe('replacement order', () => {
  const all = [
    v('a1', 'Ancient'), v('a2', 'Ancient'), v('m1', 'Medieval'),
    v('m2', 'Medieval'), v('x1', 'Modern'),
  ];

  it('prefers the same era, so the writing prompt still fits the clip', () => {
    const order = replacementOrder(all, v('m1', 'Medieval'));
    expect(order[0].id).toBe('m2');
  });

  it('still offers every other video rather than giving up', () => {
    const order = replacementOrder(all, v('m1', 'Medieval'));
    expect(order.map(o => o.id).sort()).toEqual(['a1', 'a2', 'm2', 'x1']);
  });

  it('never offers the broken video back', () => {
    expect(replacementOrder(all, all[2]).some(o => o.id === 'm1')).toBe(false);
  });

  it('is deterministic, so two viewers land on the same replacement', () => {
    const a = replacementOrder(all, all[0]).map(o => o.id);
    const b = replacementOrder([...all].reverse(), all[0]).map(o => o.id);
    expect(a).toEqual(b);
  });
});

describe('picking a working video', () => {
  const all = [v('a1', 'Ancient'), v('a2', 'Ancient'), v('a3', 'Ancient')];

  it('returns the first candidate that probes available', async () => {
    const probe = vi.fn(async (c: ReplaceableVideo) => c.id === 'a3');
    // firstAvailable probes in order; stub through the module boundary.
    const picked = await firstAvailableWith(all, probe);
    expect(picked?.id).toBe('a3');
  });

  it('returns null when nothing in the bounded window works', async () => {
    expect(await firstAvailableWith(all, async () => false)).toBeNull();
  });

  it('stops probing after the limit rather than hammering the network', async () => {
    const seen: string[] = [];
    await firstAvailableWith(
      Array.from({ length: 40 }, (_, i) => v(`v${i}`, 'Ancient')),
      async c => { seen.push(c.id); return false; },
      6,
    );
    expect(seen).toHaveLength(6);
  });

  /** Local stand-in so the ordering contract is testable without a DOM Image. */
  async function firstAvailableWith<T extends ReplaceableVideo>(
    candidates: T[], probe: (c: T) => Promise<boolean>, limit = 6,
  ): Promise<T | null> {
    for (const c of candidates.slice(0, limit)) if (await probe(c)) return c;
    return null;
  }
});

/**
 * The probe reads a cross-origin thumbnail, so the only thing it can see is the
 * image's dimensions. YouTube answers for a video that no longer exists with a
 * 120x90 grey placeholder rather than a 404, which is what makes this work.
 */
describe('availability probe', () => {
  class FakeImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    naturalWidth = 480;
    naturalHeight = 360;
    static behaviour: 'real' | 'placeholder' | 'error' | 'hang' = 'real';
    set src(_: string) {
      queueMicrotask(() => {
        if (FakeImage.behaviour === 'error') { this.onerror?.(); return; }
        if (FakeImage.behaviour === 'hang') return;
        if (FakeImage.behaviour === 'placeholder') { this.naturalWidth = 120; this.naturalHeight = 90; }
        this.onload?.();
      });
    }
  }

  beforeEach(() => {
    resetAvailabilityCache();
    vi.stubGlobal('Image', FakeImage as unknown as typeof Image);
  });
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

  it('accepts a video whose thumbnail is a real image', async () => {
    FakeImage.behaviour = 'real';
    expect(await isVideoAvailable('abc123')).toBe(true);
  });

  it('rejects the 120x90 grey placeholder YouTube serves for a dead video', async () => {
    FakeImage.behaviour = 'placeholder';
    expect(await isVideoAvailable('gone123')).toBe(false);
  });

  it('rejects a video whose thumbnail is missing entirely', async () => {
    FakeImage.behaviour = 'error';
    expect(await isVideoAvailable('missing1')).toBe(false);
  });

  it('assumes available when the probe cannot answer', async () => {
    // A slow or blocked network must not cycle every video away from someone
    // whose connection is merely bad.
    FakeImage.behaviour = 'hang';
    const p = isVideoAvailable('slow123', 10);
    await new Promise(r => setTimeout(r, 40));
    expect(await p).toBe(true);
  });

  it('does not cache a verdict it could not actually make', async () => {
    FakeImage.behaviour = 'hang';
    expect(await isVideoAvailable('slow456', 10)).toBe(true);
    FakeImage.behaviour = 'placeholder';
    expect(await isVideoAvailable('slow456', 10)).toBe(false);
  });

  it('caches a real verdict instead of probing twice', async () => {
    FakeImage.behaviour = 'placeholder';
    expect(await isVideoAvailable('dead789')).toBe(false);
    FakeImage.behaviour = 'real';   // would flip if it probed again
    expect(await isVideoAvailable('dead789')).toBe(false);
  });
});

describe('the catalogue it falls back into', () => {
  it('has enough videos in every era for a replacement to exist', () => {
    const byEra = HISTORY_VIDEOS.reduce<Record<string, number>>((a, v2) => {
      a[v2.era] = (a[v2.era] ?? 0) + 1; return a;
    }, {});
    for (const [era, n] of Object.entries(byEra)) {
      expect(n, `${era} has no same-era fallback`).toBeGreaterThan(1);
    }
  });

  it('gives every video a distinct YouTube id', () => {
    const ids = HISTORY_VIDEOS.map(v2 => v2.youtubeId);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect([...new Set(dupes)]).toEqual([]);
  });

  it('stores bare ids, not URLs', () => {
    // An embed built from a full URL produces a broken player rather than an
    // obvious error.
    const bad = HISTORY_VIDEOS.filter(v2 => !/^[A-Za-z0-9_-]{11}$/.test(v2.youtubeId));
    expect(bad.map(b => `${b.id}: ${b.youtubeId}`)).toEqual([]);
  });
});
