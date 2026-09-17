#!/usr/bin/env node
/**
 * Update public/status.json.
 *
 * This is how the status page stays true. A status page maintained by hand,
 * separately from the change it describes, is a status page that is out of
 * date - so this exists to be run in the same commit as the change, and it
 * refuses to write anything it cannot validate.
 *
 *   node scripts/update_status.mjs --component accounts=operational
 *   node scripts/update_status.mjs --status maintenance --summary-en "Back at 18:00 UTC"
 *   node scripts/update_status.mjs --entry release --id 2026-09-20-quiz \
 *        --title-en "Smart Quiz rebuilt" --body-en "Questions now adapt per era."
 *   node scripts/update_status.mjs --resolve 2026-09-18-outage
 *   node scripts/update_status.mjs --check
 *
 * Only English is required on the command line. Any language left unset falls
 * back to English at render time rather than showing an empty card, and the
 * --check mode reports which translations are still missing so they can be
 * filled in properly rather than forgotten.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const FILE = path.join(ROOT, 'public/status.json');

const HEALTH = ['operational', 'degraded', 'maintenance', 'outage'];
const KINDS = ['release', 'incident', 'maintenance', 'known-issue'];
const LANGS = ['en', 'es', 'ru', 'mk', 'de', 'fr'];
const SEVERITY = { operational: 0, maintenance: 1, degraded: 2, outage: 3 };

function die(msg) { console.error(`error: ${msg}`); process.exit(1); }

const argv = process.argv.slice(2);
const flag = name => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};
const has = name => argv.includes(`--${name}`);

const doc = JSON.parse(fs.readFileSync(FILE, 'utf8'));

/** Collect --title-en / --title-fr style groups into one localized object. */
function localizedArg(prefix) {
  const out = {};
  for (const lang of LANGS) {
    const v = flag(`${prefix}-${lang}`);
    if (v) out[lang] = v;
  }
  return Object.keys(out).length ? out : null;
}

// ── --check: validate and report, change nothing ─────────────────────────────
if (has('check')) {
  const problems = [];
  const warnings = [];

  if (!HEALTH.includes(doc.status ?? 'operational')) problems.push(`status "${doc.status}" is not one of ${HEALTH.join(', ')}`);
  for (const c of doc.components) {
    if (!HEALTH.includes(c.status)) problems.push(`component ${c.id}: "${c.status}" is not a health level`);
  }
  for (const e of doc.entries) {
    if (!KINDS.includes(e.kind)) problems.push(`entry ${e.id}: kind "${e.kind}" is not one of ${KINDS.join(', ')}`);
    if (Number.isNaN(Date.parse(e.at))) problems.push(`entry ${e.id}: "${e.at}" is not a date`);
    if (!e.title?.en) problems.push(`entry ${e.id}: no English title`);
    if (!e.body?.en) problems.push(`entry ${e.id}: no English body`);
    for (const field of ['title', 'body']) {
      const missing = LANGS.filter(l => !e[field]?.[l]);
      if (missing.length) warnings.push(`entry ${e.id}: ${field} missing ${missing.join(', ')}`);
    }
  }
  const ids = doc.entries.map(e => e.id);
  const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (dupes.length) problems.push(`duplicate entry ids: ${dupes.join(', ')}`);

  // The overall state is derived from the components, so a declared status that
  // is better than the worst component would be a page contradicting itself.
  const worst = doc.components.reduce((a, c) => (SEVERITY[c.status] > SEVERITY[a] ? c.status : a), 'operational');
  if (doc.status && SEVERITY[doc.status] < SEVERITY[worst]) {
    warnings.push(`declared status "${doc.status}" is better than the worst component "${worst}" - the page will show "${worst}"`);
  }

  for (const w of warnings) console.warn(`warn:  ${w}`);
  for (const p of problems) console.error(`error: ${p}`);
  console.log(`\n${doc.entries.length} entries, ${doc.components.length} components, overall "${worst}"`);
  process.exit(problems.length ? 1 : 0);
}

let touched = false;

// ── --component <id>=<health> ────────────────────────────────────────────────
for (let i = 0; i < argv.length; i++) {
  if (argv[i] !== '--component') continue;
  const [id, health] = (argv[i + 1] ?? '').split('=');
  if (!id || !HEALTH.includes(health)) die(`--component expects id=health, health one of ${HEALTH.join('|')}`);
  const existing = doc.components.find(c => c.id === id);
  if (existing) existing.status = health;
  else doc.components.push({ id, status: health });
  touched = true;
}

// ── --status <health> ────────────────────────────────────────────────────────
const status = flag('status');
if (status) {
  if (!HEALTH.includes(status)) die(`--status must be one of ${HEALTH.join('|')}`);
  doc.status = status;
  touched = true;
}

const summary = localizedArg('summary');
if (summary) { doc.summary = { ...doc.summary, ...summary }; touched = true; }

// ── --entry <kind> --id <id> --title-en ... --body-en ... ────────────────────
const kind = flag('entry');
if (kind) {
  if (!KINDS.includes(kind)) die(`--entry must be one of ${KINDS.join('|')}`);
  const id = flag('id');
  if (!id) die('--entry needs --id');
  if (doc.entries.some(e => e.id === id)) die(`entry "${id}" already exists`);
  const title = localizedArg('title');
  const body = localizedArg('body');
  if (!title?.en) die('--entry needs at least --title-en');
  if (!body?.en) die('--entry needs at least --body-en');
  doc.entries.unshift({ id, kind, at: new Date().toISOString(), title, body });
  touched = true;
}

// ── --resolve <id> ───────────────────────────────────────────────────────────
const resolve = flag('resolve');
if (resolve) {
  const entry = doc.entries.find(e => e.id === resolve);
  if (!entry) die(`no entry with id "${resolve}"`);
  entry.resolvedAt = new Date().toISOString();
  touched = true;
}

if (!touched) die('nothing to do - pass --component, --status, --entry, --resolve or --check');

doc.updatedAt = new Date().toISOString();
fs.writeFileSync(FILE, `${JSON.stringify(doc, null, 2)}\n`);

const worst = doc.components.reduce((a, c) => (SEVERITY[c.status] > SEVERITY[a] ? c.status : a), 'operational');
console.log(`updated ${path.relative(ROOT, FILE)}`);
console.log(`  overall: ${SEVERITY[doc.status ?? 'operational'] > SEVERITY[worst] ? doc.status : worst}`);
console.log(`  entries: ${doc.entries.length}`);
console.log('\nRun with --check to see which translations are still missing.');
