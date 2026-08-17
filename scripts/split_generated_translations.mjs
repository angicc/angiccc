#!/usr/bin/env node
/**
 * Split the baked lesson translations into one module per language.
 *
 * src/i18n/lessonTranslationsGenerated.ts is the data-of-record and stays the
 * file generate_lesson_translations.mjs reads and rewrites. It is ~3.6 MB
 * covering all five content languages, so importing it at runtime put every
 * language in every visitor's bundle — including English readers, who never
 * read it at all (getCachedLessonTranslation returns early for 'en').
 *
 * This writes src/i18n/generated/<lang>.ts, which src/i18n/bakedLessons.ts
 * loads on demand for the active language only.
 *
 * Run after regenerating translations:
 *   npm run i18n:lessons && npm run i18n:split
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const require = createRequire(path.join(ROOT, 'package.json'));
const esbuild = require('esbuild');

const SRC = path.join(ROOT, 'src/i18n/lessonTranslationsGenerated.ts');
const OUT_DIR = path.join(ROOT, 'src/i18n/generated');
const LANGS = ['es', 'ru', 'mk', 'de', 'fr'];

// Evaluate the source rather than parsing it, so formatting changes (prettier,
// hand edits) cannot break the split.
const tmp = path.join(ROOT, 'src/i18n/.__split_tmp.mjs');
esbuild.buildSync({
  entryPoints: [SRC],
  outfile: tmp,
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  logLevel: 'silent',
});
const { GENERATED_LESSON_T } = await import(`${tmp}?v=${Date.now()}`);
fs.unlinkSync(tmp);

fs.mkdirSync(OUT_DIR, { recursive: true });

// Fingerprint of the data-of-record, stamped into every chunk so staleness can
// be detected by CONTENT. The build guard used to compare file mtimes, which
// git does not preserve — so on any fresh clone (every CI and Netlify build)
// the chunks looked older than their source and the build failed outright.
const SRC_SHA = crypto.createHash('sha256').update(fs.readFileSync(SRC)).digest('hex');

const header = lang => `// ─── Baked lesson translations: ${lang} ──────────────────────────────────────
// GENERATED — do not edit. Produced by scripts/split_generated_translations.mjs
// from src/i18n/lessonTranslationsGenerated.ts, which remains the data-of-record.
//
// Loaded on demand by src/i18n/bakedLessons.ts so a visitor downloads only the
// language they are reading in.
//
// source-sha256: ${SRC_SHA}

import type { GenLessonT } from '../lessonTranslationsGenerated';

const BAKED: Record<string, GenLessonT> = `;

let total = 0;
for (const lang of LANGS) {
  const slice = {};
  for (const [id, byLang] of Object.entries(GENERATED_LESSON_T)) {
    if (byLang[lang]) slice[id] = byLang[lang];
  }
  const out = path.join(OUT_DIR, `${lang}.ts`);
  fs.writeFileSync(out, `${header(lang)}${JSON.stringify(slice, null, 1)};\n\nexport default BAKED;\n`);
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  total += Number(kb);
  console.log(`  ${lang}  ${String(Object.keys(slice).length).padStart(3)} lessons  ${kb} kB`);
}
console.log(`\n✓ wrote ${LANGS.length} language modules to src/i18n/generated/ (${total} kB total)`);
