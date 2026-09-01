import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Every basemap tile the app requests must render without an API key.
 *
 * CARTO began requiring registration for `basemaps.cartocdn.com`, and because
 * one `CART_STYLES` list feeds all thirty-odd territory timelines, three of the
 * five styles started serving tiles stamped "API KEY REQUIRED" everywhere at
 * once — plus the Imperium campaign map, which had its own hardcoded copy of
 * the same URL.
 *
 * A tile URL is easy to paste in from a tutorial and impossible to notice in
 * review, and nothing else in the suite loads a map. This is the check.
 */

const ROOT = path.resolve(__dirname, '../..');

/**
 * Hosts that will not serve tiles to an anonymous browser. Each needs either a
 * key in the path, a key in the query string, or a registered domain.
 */
const KEY_GATED = [
  'basemaps.cartocdn.com',
  'cartodb-basemaps',
  'tiles.stadiamaps.com',
  'api.mapbox.com',
  'api.maptiler.com',
  'tile.thunderforest.com',
  'maps.geoapify.com',
  'tiles.locationiq.com',
  'api.os.uk',
];

function sourceFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { walk(full); continue; }
      if (/\.tsx?$/.test(e.name) && !full.includes(`${path.sep}tests${path.sep}`)) out.push(full);
    }
  };
  walk(path.join(ROOT, 'src'));
  return out;
}

/** Comments blanked out, so the note explaining this bug is not itself a hit. */
function code(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length));
}

/** A string literal that looks like a raster tile template. */
function tileUrls(src: string): string[] {
  return [...src.matchAll(/'(https:\/\/[^']*\{z\}[^']*)'/g)].map(m => m[1]);
}

describe('basemap tile providers', () => {
  const files = sourceFiles().map(f => ({ rel: path.relative(ROOT, f), src: code(fs.readFileSync(f, 'utf8')) }));
  const urls = files.flatMap(f => tileUrls(f.src).map(url => ({ url, file: f.rel })));

  it('finds the tile URLs it is meant to be checking', () => {
    // Guards the regex itself: if a refactor moves these into a JSON file or
    // template literals, this test would otherwise pass by inspecting nothing.
    expect(urls.length, 'no tile URLs found — has the check gone blind?').toBeGreaterThanOrEqual(5);
  });

  it('requests no tiles from a provider that requires an API key', () => {
    const offenders = urls
      .filter(u => KEY_GATED.some(host => u.url.includes(host)))
      .map(u => `${u.file}: ${u.url}`);
    expect(offenders, 'this provider stamps "API KEY REQUIRED" over every tile').toEqual([]);
  });

  it('never embeds a key or token in a tile URL', () => {
    // The other way this breaks: a working key pasted into the client bundle,
    // where it is public, rate-limited against, and eventually revoked.
    const offenders = urls
      .filter(u => /[?&](access_token|api_?key|apikey|key)=/i.test(u.url))
      .map(u => `${u.file}: ${u.url}`);
    expect(offenders, 'a tile key in client source is a public key').toEqual([]);
  });

  it('serves every tile over https', () => {
    // A plain-http tile on an https page is blocked as mixed content, which
    // looks exactly like a dead provider.
    const anyUrl = files.flatMap(f =>
      [...f.src.matchAll(/'(https?:\/\/[^']*\{z\}[^']*)'/g)].map(m => ({ url: m[1], file: f.rel })));
    expect(anyUrl.filter(u => u.url.startsWith('http://')).map(u => `${u.file}: ${u.url}`)).toEqual([]);
  });
});
