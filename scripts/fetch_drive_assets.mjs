#!/usr/bin/env node
/**
 * Download the curated Drive art straight into the repo via the Drive REST API.
 *
 * This is the automated alternative to place_drive_assets.mjs (which expects a
 * manual Drive download you unzip yourself). It streams each file directly to
 * its destination, so it works in environments where the browser-facing Drive
 * hosts are unreachable but www.googleapis.com is not — which is the case
 * inside the Claude Code sandbox.
 *
 * Credentials — one of:
 *   --api-key KEY   (or GOOGLE_API_KEY)   requires the files be shared
 *                                          "Anyone with the link → Viewer"
 *   --token TOKEN   (or GOOGLE_OAUTH_TOKEN) an OAuth access token with
 *                                          drive.readonly scope; works on
 *                                          private files, expires in ~1 hour
 *
 * Usage:
 *   node scripts/fetch_drive_assets.mjs --api-key "$GOOGLE_API_KEY"
 *   node scripts/fetch_drive_assets.mjs --token "$GOOGLE_OAUTH_TOKEN" --source banners-part-2
 *
 *   --only banner|cartography     restrict to one asset kind
 *   --source NAME                 restrict to one Drive folder (see manifest.sources)
 *   --force                       re-download files that already exist
 *   --dry-run                     list what would be fetched, contact nothing
 *   --missing                     audit only: which mapped banners are absent
 *                                 from disk, no credentials and no network
 *
 * A source marked `retired` in the manifest is skipped unless you name it with
 * --source; its art is kept in the manifest as a record of what is in Drive,
 * but nothing in the app reads it any more.
 *
 * Prefer a short-lived OAuth token over a long-lived API key, and revoke either
 * when the drop is done. Neither is read from or written to the repo.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const MANIFEST = path.join(HERE, 'drive-assets.manifest.json');
const API = 'https://www.googleapis.com/drive/v3/files';

function parseArgs(argv) {
  const a = {
    apiKey: process.env.GOOGLE_API_KEY || null,
    token: process.env.GOOGLE_OAUTH_TOKEN || null,
    only: null, source: null, force: false, dryRun: false, missing: false,
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--api-key') a.apiKey = argv[++i];
    else if (argv[i] === '--token') a.token = argv[++i];
    else if (argv[i] === '--only') a.only = argv[++i];
    else if (argv[i] === '--source') a.source = argv[++i];
    else if (argv[i] === '--force') a.force = true;
    else if (argv[i] === '--dry-run') a.dryRun = true;
    else if (argv[i] === '--missing') a.missing = true;
  }
  return a;
}

const args = parseArgs(process.argv.slice(2));
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

if (args.missing) {
  reportMissing();
  process.exit(0);
}

if (args.source && !manifest.sources[args.source]) {
  console.error(`error: unknown --source ${args.source}. known: ${Object.keys(manifest.sources).join(', ')}`);
  process.exit(2);
}

let assets = manifest.assets;
if (args.only) assets = assets.filter(a => a.kind === args.only);
// Retired folders stay in the manifest as a record of what Drive holds, but
// nothing in the app reads them — fetching them again would just refill a
// directory no code points at. Naming the source explicitly still works.
if (args.source) assets = assets.filter(a => a.source === args.source);
else assets = assets.filter(a => !manifest.sources[a.source]?.retired);
if (!assets.length) {
  console.error(`error: no assets matched ${args.only ? `--only ${args.only}` : ''} ${args.source ? `--source ${args.source}` : ''}`.trim());
  process.exit(2);
}

if (args.dryRun) {
  console.log(`[dry run] ${assets.length} asset(s), ${(assets.reduce((s, a) => s + a.bytes, 0) / 1048576).toFixed(1)} MB`);
  for (const a of assets) console.log(`  ${a.driveName}  ->  ${a.dest}`);
  process.exit(0);
}

if (!args.apiKey && !args.token) {
  console.error('error: supply --api-key or --token (see the header of this file)');
  process.exit(2);
}

const headers = args.token ? { Authorization: `Bearer ${args.token}` } : {};
const mb = b => (b / 1048576).toFixed(1);

let fetched = 0;
let skipped = 0;
const failed = [];

for (const asset of assets) {
  const dest = path.join(REPO, asset.dest);
  if (fs.existsSync(dest) && !args.force) {
    skipped++;
    continue;
  }

  const url = new URL(`${API}/${asset.fileId}`);
  url.searchParams.set('alt', 'media');
  if (args.apiKey) url.searchParams.set('key', args.apiKey);

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      failed.push({ asset, reason: `HTTP ${res.status} ${body.slice(0, 160).replace(/\s+/g, ' ')}` });
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    // Drive hands back an HTML interstitial instead of bytes when a file is not
    // actually readable; catch that rather than writing a fake image to disk.
    if (buf.length < 1024 && /^\s*<(?:!doctype|html)/i.test(buf.toString('utf8', 0, 64))) {
      failed.push({ asset, reason: 'received an HTML page instead of image bytes (file not shared / not readable)' });
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    fetched++;
    const drift = asset.bytes && Math.abs(buf.length - asset.bytes) > 1024 ? `  (expected ${asset.bytes}B, got ${buf.length}B)` : '';
    console.log(`  ✔ ${asset.dest}${drift}`);
  } catch (err) {
    failed.push({ asset, reason: String(err.message || err) });
  }
}

console.log(`\nfetched ${fetched}${skipped ? `, skipped ${skipped} already present` : ''}`);
if (fetched) console.log(`${mb(assets.filter(a => fs.existsSync(path.join(REPO, a.dest))).reduce((s, a) => s + a.bytes, 0))} MB on disk`);
if (failed.length) {
  console.log(`\nfailed: ${failed.length}`);
  for (const f of failed) console.log(`  ${f.asset.driveName}\n    ${f.reason}`);
}
for (const e of manifest.excluded ?? []) console.log(`\nexcluded: ${e.driveName}\n  ${e.reason}`);

process.exit(failed.length ? 1 : 0);

/**
 * Which lesson banners the app expects but the repo does not have.
 *
 * A missing banner is invisible at runtime — the lesson quietly falls back to
 * its generic era art — so without this audit a bad path or an undelivered
 * drop looks exactly like a deliberate choice. Reads the banner table straight
 * out of the source rather than a copy, so the two cannot drift.
 */
function reportMissing() {
  const table = path.join(REPO, 'src/features/content/lessonLocalBanners.ts');
  const src = fs.readFileSync(table, 'utf8');
  const body = src.slice(src.indexOf('LESSON_LOCAL_BANNERS'));
  const mapped = [...body.matchAll(/'([a-z]+-\d+)':\s*'(\/assets\/banners\/[^']+)'/g)].map(m => ({ lesson: m[1], dest: 'public' + m[2] }));

  const inManifest = new Map(manifest.assets.filter(a => a.lesson).map(a => [a.lesson, a]));
  const missing = mapped.filter(e => !fs.existsSync(path.join(REPO, e.dest)));

  console.log(`${mapped.length} lessons map to a local banner; ${mapped.length - missing.length} present, ${missing.length} missing`);
  if (!missing.length) return;

  const bySource = new Map();
  for (const e of missing) {
    const asset = inManifest.get(e.lesson);
    const key = asset ? asset.source : 'not in any Drive manifest';
    if (!bySource.has(key)) bySource.set(key, []);
    bySource.get(key).push({ ...e, bytes: asset?.bytes ?? 0 });
  }
  for (const [source, rows] of [...bySource].sort()) {
    const mbs = rows.reduce((s, r) => s + r.bytes, 0) / 1048576;
    console.log(`\n${source} — ${rows.length} file(s)${mbs ? `, ${mbs.toFixed(1)} MB` : ''}`);
    if (manifest.sources[source]) console.log(`  fetch with: --source ${source}`);
    for (const r of rows) console.log(`  ${r.lesson}  ${r.dest.replace('public/assets/banners/', '')}`);
  }
}
