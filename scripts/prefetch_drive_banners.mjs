#!/usr/bin/env node
/**
 * Pull the Drive banner art at build time, on the build machine's network.
 *
 * Runs automatically as npm's `prebuild` step, so `npm run build` — locally or
 * on Netlify — lands the art before Vite copies `public/` into `dist/`.
 *
 * Why this exists: banner art is committed once it has been landed, but the
 * environments where the app is *authored* often cannot reach Drive at all, so
 * ~66 MB of it has never made it into a commit. The build machine's network is
 * not restricted. Give the build a credential and the remaining banners appear
 * in `dist/`; give it nothing and the build is exactly as it was before.
 *
 * Art fetched here is not committed back — each deploy re-fetches what git does
 * not already carry. Commit a file and this step skips it from then on.
 *
 * Credentials, read from the environment (set them in Netlify → Site
 * configuration → Environment variables):
 *
 *   GOOGLE_API_KEY       a Drive-API-enabled key. Works only on files shared
 *                        "Anyone with the link → Viewer". Does not expire, so
 *                        this is the one that suits a build.
 *   GOOGLE_OAUTH_TOKEN   an access token with drive.readonly. Reaches private
 *                        files, but expires in ~1 hour, so it is useful for a
 *                        one-off local run and useless as a build variable.
 *
 * This step must never fail a deploy. A missing credential, a revoked key, a
 * Drive outage — none of them are reasons to refuse to ship the app, because a
 * banner that fails to load is already a handled case: the lesson falls back to
 * its built-in animated banner. So every path here exits 0, and the only thing
 * a failure costs you is a line in the build log.
 *
 * Skip it entirely with SKIP_BANNER_FETCH=1.
 */

import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FETCHER = path.join(HERE, 'fetch_drive_assets.mjs');
const TAG = '[banners]';

if (process.env.SKIP_BANNER_FETCH === '1') {
  console.log(`${TAG} SKIP_BANNER_FETCH=1 — not fetching.`);
  process.exit(0);
}

const hasKey = Boolean(process.env.GOOGLE_API_KEY);
const hasToken = Boolean(process.env.GOOGLE_OAUTH_TOKEN);

if (!hasKey && !hasToken) {
  // Not an error. Whatever art is committed still ships; the rest falls back.
  console.log(`${TAG} no GOOGLE_API_KEY / GOOGLE_OAUTH_TOKEN set — using the art already in the repo.`);
  console.log(`${TAG} see public/assets/banners/README.md to wire the credential up.`);
  run(['--missing']);
  process.exit(0);
}

console.log(`${TAG} fetching missing banner art with ${hasToken ? 'GOOGLE_OAUTH_TOKEN' : 'GOOGLE_API_KEY'}…`);

// The fetcher reads both variables itself and skips anything already on disk,
// so this pulls only what is absent and costs nothing on a warm cache.
const result = run([]);

if (result.status !== 0) {
  console.log(`${TAG} some art could not be fetched (exit ${result.status}). The build continues;`);
  console.log(`${TAG} affected lessons fall back to their built-in banners.`);
}

process.exit(0);

function run(extraArgs) {
  return spawnSync(process.execPath, [FETCHER, ...extraArgs], {
    stdio: 'inherit',
    // Pass the environment straight through — the credential never appears on
    // a command line, so it cannot leak into a process listing or a build log.
    env: process.env,
  });
}
