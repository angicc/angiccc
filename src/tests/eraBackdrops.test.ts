import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ERA_BACKDROPS, ERA_BACKDROP_PATHS } from '@/features/content/eraBackdrops';
import { ERA_SLUGS } from '@/features/content/eraSlugs';

const ROOT = path.resolve(__dirname, '../..');

/**
 * The landing-page era timeline draws artwork behind each era. Two things can
 * go wrong quietly: an era gets no entry at all, or an entry points somewhere
 * the page cannot actually load from.
 */
describe('era backdrops', () => {
  it('covers every era on the timeline', () => {
    expect(Object.keys(ERA_BACKDROPS).sort()).toEqual(Object.keys(ERA_SLUGS).sort());
  });

  it('points every local path into the folder the build audit watches', () => {
    for (const [era, p] of Object.entries(ERA_BACKDROP_PATHS)) {
      expect(p, `${era} must be served from public/assets/eras`).toMatch(/^\/assets\/eras\/[a-z-]+\.(gif|jpg|jpeg|png|webp)$/);
    }
  });

  it('keeps the folder present so the build audit has somewhere to look', () => {
    // assetPathPlugin errors on a mapped path whose *directory* is missing —
    // that is how a typo'd path gets caught rather than silently 404ing.
    expect(fs.existsSync(path.join(ROOT, 'public/assets/eras'))).toBe(true);
  });

  it('names each file after its era, so an upload cannot land in the wrong slot', () => {
    for (const [era, p] of Object.entries(ERA_BACKDROP_PATHS)) {
      expect(path.basename(p).replace(/\.[a-z]+$/, '')).toBe(era);
    }
  });

  it('only falls back to a host that permits hotlinking', () => {
    // Pinterest, Tenor and the two academic sites are deliberately absent: two
    // block hotlinking outright and two would be serving this app's traffic
    // without having agreed to. Giphy hosts media for embedding, and the app
    // already depends on it elsewhere.
    const ALLOWED_REMOTE = ['media.giphy.com'];
    for (const [era, b] of Object.entries(ERA_BACKDROPS)) {
      if (!b.remote) continue;
      expect(b.remote, `${era} fallback must be https`).toMatch(/^https:\/\//);
      expect(
        ALLOWED_REMOTE.some(h => b.remote!.startsWith(`https://${h}/`)),
        `${era} falls back to a host that is not known to allow hotlinking: ${b.remote}`,
      ).toBe(true);
    }
  });

  it('gives a direct media URL, never a share page', () => {
    // The sources arrived as giphy.com/gifs/... page links. Rendering one in an
    // <img> yields a broken image, because it is an HTML document.
    for (const [era, b] of Object.entries(ERA_BACKDROPS)) {
      if (!b.remote) continue;
      expect(b.remote, `${era} points at a page, not an image`).toMatch(/\.(gif|jpg|jpeg|png|webp)$/);
    }
  });
});
