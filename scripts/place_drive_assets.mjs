#!/usr/bin/env node
/**
 * Place the curated Drive art into the repo at the paths the app expects.
 *
 * The two Drive folders ("Eras and Lessons Banner GIFs" and "Timeline Territory
 * Map Cartographies") name their files by human title — "The Baptism of the
 * Rus.jpg" — while the app looks them up by lesson id / topic id under
 * public/assets/. drive-assets.manifest.json holds that resolved mapping, so
 * this script just copies each file to its destination.
 *
 * Usage:
 *   1. In Drive, download both folders (right-click → Download) and unzip them.
 *   2. node scripts/place_drive_assets.mjs --src ~/Downloads/drive-art
 *      (--src may contain both folders; it is searched recursively)
 *
 *   --dry-run   report what would be copied without writing anything
 *   --force     overwrite destinations that already exist
 *
 * Files are matched by their Drive filename, so keep the names as downloaded.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const MANIFEST = path.join(HERE, 'drive-assets.manifest.json');

function parseArgs(argv) {
  const args = { src: null, dryRun: false, force: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--src') args.src = argv[++i];
    else if (argv[i] === '--dry-run') args.dryRun = true;
    else if (argv[i] === '--force') args.force = true;
  }
  return args;
}

/** Index every file under `dir` by basename (last one wins on duplicates). */
function indexFiles(dir) {
  const byName = new Map();
  const walk = current => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else byName.set(entry.name, full);
    }
  };
  walk(dir);
  return byName;
}

const args = parseArgs(process.argv.slice(2));
if (!args.src) {
  console.error('error: --src <dir> is required (the unzipped Drive download)');
  process.exit(2);
}
if (!fs.existsSync(args.src)) {
  console.error(`error: source directory not found: ${args.src}`);
  process.exit(2);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const available = indexFiles(args.src);

const placed = [];
const missing = [];
const skipped = [];

for (const asset of manifest.assets) {
  const source = available.get(asset.driveName);
  if (!source) {
    missing.push(asset);
    continue;
  }
  const dest = path.join(REPO, asset.dest);
  if (fs.existsSync(dest) && !args.force) {
    skipped.push(asset);
    continue;
  }
  if (!args.dryRun) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(source, dest);
  }
  placed.push(asset);
}

const used = new Set(manifest.assets.map(a => a.driveName));
const unused = [...available.keys()].filter(name => !used.has(name));

const mb = bytes => (bytes / 1048576).toFixed(1);
console.log(`${args.dryRun ? '[dry run] would place' : 'placed'}: ${placed.length}`);
console.log(`  banners     ${placed.filter(a => a.kind === 'banner').length}`);
console.log(`  cartography ${placed.filter(a => a.kind === 'cartography').length}`);
console.log(`  ${mb(placed.reduce((sum, a) => sum + a.bytes, 0))} MB`);

if (skipped.length) {
  console.log(`\nalready present (use --force to overwrite): ${skipped.length}`);
}
if (missing.length) {
  console.log(`\nnot found in --src: ${missing.length}`);
  for (const a of missing) console.log(`  ${a.driveName}  ->  ${a.dest}`);
}
if (unused.length) {
  console.log(`\nin --src but not in the manifest: ${unused.length}`);
  for (const name of unused) console.log(`  ${name}`);
}
for (const e of manifest.excluded ?? []) {
  console.log(`\nexcluded: ${e.driveName}\n  ${e.reason}`);
}

process.exit(missing.length ? 1 : 0);
