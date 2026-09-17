#!/usr/bin/env node
/**
 * Check every Video Review YouTube id against YouTube itself.
 *
 * The app now detects a dead video at runtime and swaps in a working one, but
 * that is a safety net, not a fix: the viewer still loses the video that was
 * actually chosen for the day. This finds the dead ones so they can be replaced
 * properly in videoData.ts.
 *
 * It is a script rather than a test because it needs the network, and a test
 * that fails when YouTube is slow is a test people learn to ignore.
 *
 *   node scripts/check_video_ids.mjs
 *   node scripts/check_video_ids.mjs --json
 *
 * Uses the oEmbed endpoint, which answers 404 for a video that is removed,
 * private or nonexistent, and 401 for one that forbids embedding - which is
 * just as broken for this feature, since the app can only embed.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DATA = path.join(ROOT, 'src/features/videoReview/videoData.ts');

const src = fs.readFileSync(DATA, 'utf8');
// Titles are single-quoted except where the title itself contains an
// apostrophe, which switches the entry to double quotes.
const videos = [...src.matchAll(
  /id: '([^']+)',\s*\n\s*youtubeId: '([^']+)',\s*\n\s*title: (?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g,
)].map(m => ({ id: m[1], youtubeId: m[2], title: (m[3] ?? m[4]).replace(/\\(['"])/g, '$1') }));

// Silently parsing a subset would quietly stop checking whatever it missed.
const declared = (src.match(/^\s*youtubeId: '/gm) ?? []).length;
if (videos.length !== declared) {
  console.error(
    `Parsed ${videos.length} videos but videoData.ts declares ${declared}. ` +
    `The entry shape changed; fix the pattern rather than checking a subset.`,
  );
  process.exit(2);
}
if (videos.length === 0) {
  console.error('Parsed no videos from videoData.ts - the shape probably changed.');
  process.exit(2);
}

async function check(v) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${v.youtubeId}`)}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (res.ok) return { ...v, state: 'ok' };
    if (res.status === 404) return { ...v, state: 'gone' };
    if (res.status === 401 || res.status === 403) {
      // A corporate proxy or egress filter also answers 403, and it answers it
      // for every request. Only YouTube sends a body here; a proxy denial does
      // not look like an oEmbed refusal.
      const body = (await res.text().catch(() => '')).slice(0, 400);
      const fromYouTube = /youtube|oembed|unauthorized/i.test(body);
      return { ...v, state: fromYouTube ? 'embedding-blocked' : 'blocked-by-network', detail: body.slice(0, 120) };
    }
    return { ...v, state: `http-${res.status}` };
  } catch (err) {
    // Unreachable is not the same as dead, and must not be reported as dead.
    return { ...v, state: 'unreachable', detail: String(err?.message ?? err) };
  }
}

const results = [];
for (const v of videos) {
  results.push(await check(v));
  process.stderr.write(`\rchecked ${results.length}/${videos.length}`);
}
process.stderr.write('\n');

const broken = results.filter(r => r.state === 'gone' || r.state === 'embedding-blocked');
const unknown = results.filter(r =>
  r.state === 'unreachable' || r.state === 'blocked-by-network' || r.state.startsWith('http-'));

/**
 * If almost nothing came back playable, the problem is this machine, not the
 * catalogue. Saying so is the whole point: a run behind a filtering proxy
 * reports every video as dead, and acting on that would empty videoData.ts.
 */
const playable = results.filter(r => r.state === 'ok').length;
if (playable === 0 && results.length > 3) {
  console.error(
    `\nEvery one of the ${results.length} checks failed the same way ` +
    `(${results[0].state}). That is this network refusing YouTube, not ${results.length} dead videos. ` +
    `Re-run somewhere with direct access before changing anything.`,
  );
  process.exit(2);
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ checked: results.length, broken, unknown }, null, 2));
} else {
  console.log(`\n${results.length} videos checked`);
  console.log(`  playable   ${results.filter(r => r.state === 'ok').length}`);
  console.log(`  broken     ${broken.length}`);
  console.log(`  unknown    ${unknown.length}`);
  for (const b of broken) console.log(`\n  ${b.state.toUpperCase()}  ${b.id}  (${b.youtubeId})\n    ${b.title}`);
  for (const u of unknown) console.log(`\n  ${u.state}  ${u.id}  (${u.youtubeId})`);
}

// Unknown is not a failure: it usually means the network, not the catalogue.
process.exit(broken.length > 0 ? 1 : 0);
