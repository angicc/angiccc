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
 * configuration → Environment variables). Any of the names in CREDENTIAL_VARS
 * below works, because the exact spelling is the single easiest thing to get
 * wrong and the cost of getting it wrong used to be complete silence.
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
 * its built-in animated banner.
 *
 * But "never fails" must not mean "never tells you". A silent skip and a
 * rejected key looked identical from the outside, and a deploy that fetched
 * nothing looked exactly like one that fetched everything, because the fallback
 * art is indistinguishable at a glance. So this writes
 * `public/banner-status.json` on every run — it ships with the site, so
 * `https://<your-site>/banner-status.json` answers "did it work, and if not,
 * why" without anyone reading a build log. It records names, counts and HTTP
 * statuses only; no credential value is ever written to it.
 *
 * Skip it entirely with SKIP_BANNER_FETCH=1.
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const FETCHER = path.join(HERE, 'fetch_drive_assets.mjs');
const MANIFEST = path.join(HERE, 'drive-assets.manifest.json');
const STATUS_FILE = path.join(REPO, 'public', 'banner-status.json');
const TAG = '[banners]';

/**
 * Accepted spellings for the API key, most-preferred first.
 *
 * GOOGLE_API_KEY is the documented name. The others are here because they are
 * what a person actually types when setting this up, and a near-miss produced
 * no error at all — the build just quietly skipped the fetch and shipped the
 * fallback art. Matching the intent is worth more than insisting on the spelling.
 */
const CREDENTIAL_VARS = {
  key: ['GOOGLE_API_KEY', 'DRIVE_API_KEY', 'DRIVEAPI_KEY', 'GOOGLE_DRIVE_API_KEY'],
  token: ['GOOGLE_OAUTH_TOKEN', 'GOOGLE_ACCESS_TOKEN', 'DRIVE_OAUTH_TOKEN'],
};

const found = (names) => names.find(n => (process.env[n] ?? '').trim().length > 0);

/**
 * Strip anything key-shaped before it can be written to a file the whole
 * internet can GET.
 *
 * Google's error bodies do not echo the key today, and nothing here puts it on
 * a command line — but this file is published, and "today's error format does
 * not include the secret" is not a property worth betting a credential on.
 * Belt and braces: the live key value itself, then the general shape.
 */
function redact(text) {
  let out = String(text);
  for (const name of [...CREDENTIAL_VARS.key, ...CREDENTIAL_VARS.token]) {
    const value = (process.env[name] ?? '').trim();
    if (value.length >= 8) out = out.split(value).join('[redacted]');
  }
  return out
    .replace(/AIza[0-9A-Za-z_-]{10,}/g, '[redacted]')
    .replace(/ya29\.[0-9A-Za-z._-]{10,}/g, '[redacted]')
    .replace(/\b(?:key|access_token|token)=[^&\s"']+/gi, '$&'.replace(/=.*/, '=[redacted]'));
}

function writeStatus(status) {
  try {
    fs.mkdirSync(path.dirname(STATUS_FILE), { recursive: true });
    const body = JSON.stringify({ generatedAt: new Date().toISOString(), ...status }, null, 2);
    fs.writeFileSync(STATUS_FILE, redact(body));
  } catch (err) {
    // Diagnostics must never be the thing that breaks the build.
    console.log(`${TAG} could not write banner-status.json: ${err.message}`);
  }
}

/** Which mapped banners are on disk right now, straight from the manifest. */
function audit() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const live = manifest.assets.filter(a => !manifest.sources[a.source]?.retired);
  const present = live.filter(a => fs.existsSync(path.join(REPO, a.dest)));
  const bySource = {};
  for (const a of live) {
    const s = (bySource[a.source] ??= { total: 0, present: 0 });
    s.total++;
    if (fs.existsSync(path.join(REPO, a.dest))) s.present++;
  }
  return { total: live.length, present: present.length, bySource };
}

if (process.env.SKIP_BANNER_FETCH === '1') {
  console.log(`${TAG} SKIP_BANNER_FETCH=1 — not fetching.`);
  writeStatus({ ran: false, reason: 'SKIP_BANNER_FETCH=1', ...audit() });
  process.exit(0);
}

const keyVar = found(CREDENTIAL_VARS.key);
const tokenVar = found(CREDENTIAL_VARS.token);

if (!keyVar && !tokenVar) {
  // Not an error. Whatever art is committed still ships; the rest falls back.
  console.log(`${TAG} NO CREDENTIAL FOUND — using only the art already in the repo.`);
  console.log(`${TAG} Set one of these in Netlify → Environment variables: ${CREDENTIAL_VARS.key.join(', ')}`);
  console.log(`${TAG} Scope it to ALL deploy contexts — a Production-only value is invisible to a branch deploy.`);
  const before = audit();
  run(['--missing']);
  writeStatus({
    ran: false,
    reason: 'no credential in the environment',
    checkedVariableNames: [...CREDENTIAL_VARS.key, ...CREDENTIAL_VARS.token],
    ...before,
  });
  process.exit(0);
}

// Normalise onto the names the fetcher reads, so an alias works without the
// fetcher needing to know about aliases too.
if (keyVar && !process.env.GOOGLE_API_KEY) process.env.GOOGLE_API_KEY = process.env[keyVar];
if (tokenVar && !process.env.GOOGLE_OAUTH_TOKEN) process.env.GOOGLE_OAUTH_TOKEN = process.env[tokenVar];

const usedVar = tokenVar ?? keyVar;
console.log(`${TAG} credential found in ${usedVar} — fetching missing banner art…`);

const before = audit();
// The fetcher skips anything already on disk, so this pulls only what is absent.
const result = run([]);
const after = audit();

const fetched = after.present - before.present;
console.log(`${TAG} ${fetched} file(s) fetched this build; ${after.present}/${after.total} mapped banners now on disk.`);

if (result.status !== 0) {
  console.log(`${TAG} some art could not be fetched (fetcher exit ${result.status}).`);
  console.log(`${TAG} A 403 means the key has no access — enable the Google Drive API on it and`);
  console.log(`${TAG} confirm the Drive folder is shared "Anyone with the link → Viewer".`);
  console.log(`${TAG} The build continues; affected lessons fall back to their built-in banners.`);
}

writeStatus({
  ran: true,
  credentialVariable: usedVar,   // the NAME only — never the value
  fetcherExitCode: result.status,
  fetchedThisBuild: fetched,
  failures: parseFailures(result.stdout),
  ...after,
});

process.exit(0);

/**
 * The fetcher prints `  ✔ path` per success and a `failed: N` block listing each
 * name and reason. Pull the reasons out so the status file can carry them —
 * an HTTP status is the difference between "wrong key" and "wrong sharing",
 * and that distinction is the whole point of this file existing.
 */
function parseFailures(stdout) {
  if (!stdout) return [];
  const lines = String(stdout).split('\n');
  const start = lines.findIndex(l => /^failed: \d+/.test(l.trim()));
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length && out.length < 10; i += 2) {
    const name = lines[i]?.trim();
    const reason = lines[i + 1]?.trim();
    if (!name || !reason) break;
    out.push({ file: name, reason: reason.slice(0, 200) });
  }
  return out;
}

function run(extraArgs) {
  // stdout is captured so the failure reasons can be recorded, then echoed so
  // the build log still reads exactly as it did before.
  const r = spawnSync(process.execPath, [FETCHER, ...extraArgs], {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'inherit'],
    // The environment is passed through rather than put on a command line, so
    // the credential cannot leak into a process listing or a build log.
    env: process.env,
  });
  if (r.stdout) process.stdout.write(r.stdout);
  return r;
}
