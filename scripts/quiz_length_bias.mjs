#!/usr/bin/env node
// ─── Quiz answer-length bias: measure, and apply balancing rewrites ───────────
//
// A multiple-choice question leaks its answer when the correct option is
// visibly longer than its distractors — the learner scores without knowing
// anything. Position bias is fixed at serve time by prepareQuestion; length
// bias is a property of the authored text, so it has to be measured against
// the source and fixed by rewriting.
//
//   node scripts/quiz_length_bias.mjs                 → report, all 6 languages
//   node scripts/quiz_length_bias.mjs --list 20       → worst 20 offenders
//   node scripts/quiz_length_bias.mjs --dump id id …  → full option sets
//   node scripts/quiz_length_bias.mjs --apply p.json  → rewrite options in place
//
// The patch file is { "<questionId>": { "en": [4 options], "es": [...], … } },
// with options in the SAME ORDER as the source so correctIndex stays valid.
// Only the NEW text is supplied: the old text is read from the loaded modules,
// never hand-transcribed, because a mistyped "from" silently patches nothing
// or — worse — the wrong question. Replacement is by exact string match and
// refuses to run when a match is missing or ambiguous.
import { build, transform } from 'esbuild';
import path from 'path';
import fs from 'fs';

const LANGS = ['es', 'ru', 'mk', 'de', 'fr'];
const SOURCES = [
  'src/features/quiz/quizData.ts',
  'src/features/quiz/quizDataExpansion.ts',
  'src/i18n/quizTranslations.ts',
  'src/i18n/quizTranslationsExpansion.ts',
  'src/i18n/quizTranslationsDeFr.ts',
];

async function load(entry) {
  const out = await build({
    entryPoints: [entry], bundle: true, write: false, format: 'esm', platform: 'neutral',
    plugins: [{
      name: 'alias',
      setup(b) {
        b.onResolve({ filter: /^@\// }, a => ({
          path: path.resolve('src', a.path.slice(2)) + (a.path.endsWith('.ts') ? '' : '.ts'),
        }));
      },
    }],
  });
  return import('data:text/javascript;base64,' + Buffer.from(out.outputFiles[0].text).toString('base64'));
}

function optionsFor(q, lang, getTranslated) {
  if (lang === 'en') return q.options;
  const tr = getTranslated(q.id, lang);
  return tr?.options?.length === q.options.length ? tr.options : null;
}

/** Longest-share and mean character advantage of the correct option. */
function measure(questions, lang, getTranslated) {
  let longest = 0, comparable = 0;
  const gaps = [];
  for (const q of questions) {
    const opts = optionsFor(q, lang, getTranslated);
    if (!opts) continue;
    const lens = opts.map(o => o.length);
    const ci = q.correctIndex;
    const others = lens.filter((_, i) => i !== ci);
    gaps.push(lens[ci] - others.reduce((a, b) => a + b, 0) / others.length);
    if (new Set(lens).size === 1) continue;
    comparable++;
    if (lens[ci] === Math.max(...lens)) longest++;
  }
  return {
    n: gaps.length,
    longestPct: comparable ? (100 * longest / comparable) : 0,
    mean: gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1),
  };
}

function offenders(questions, minGap = 6) {
  const rows = [];
  for (const q of questions) {
    const lens = q.options.map(o => o.length);
    const ci = q.correctIndex;
    const others = lens.filter((_, i) => i !== ci);
    const target = Math.round(others.reduce((a, b) => a + b, 0) / others.length);
    const gap = lens[ci] - target;
    if (lens[ci] !== Math.max(...lens) || gap < minGap) continue;
    rows.push({ id: q.id, gap, target, correct: q.options[ci] });
  }
  return rows.sort((a, b) => b.gap - a.gap);
}

/**
 * Every way a literal can appear in the sources: the files mix single- and
 * double-quoted strings, so an apostrophe may be raw or backslash-escaped.
 */
function needles(text) {
  return [...new Set([
    text,
    text.replace(/\\/g, '\\\\').replace(/'/g, "\\'"),
    text.replace(/\\/g, '\\\\').replace(/"/g, '\\"'),
  ])];
}

async function applyPatch(patchPath, questions, get) {
  const patch = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
  const files = Object.fromEntries(SOURCES.map(f => [f, fs.readFileSync(f, 'utf8')]));
  const before = { ...files };
  const problems = [];
  let replaced = 0;

  for (const [id, byLang] of Object.entries(patch)) {
    const q = questions.find(x => x.id === id);
    if (!q) { problems.push(`${id}: no such question`); continue; }

    for (const [lang, to] of Object.entries(byLang)) {
      const from = optionsFor(q, lang, get);
      if (!from) { problems.push(`${id}/${lang}: no options to replace`); continue; }
      // Two shapes: a full array of replacements, or a sparse { index: text }
      // map for the common case of touching only the one offending option.
      let next;
      if (Array.isArray(to)) {
        if (to.length !== from.length) { problems.push(`${id}/${lang}: expected ${from.length} options, got ${to.length}`); continue; }
        next = to;
      } else if (to && typeof to === 'object') {
        next = [...from];
        let bad = false;
        for (const [k, v] of Object.entries(to)) {
          const idx = Number(k);
          if (!Number.isInteger(idx) || idx < 0 || idx >= from.length) { problems.push(`${id}/${lang}: index ${k} out of range`); bad = true; break; }
          if (typeof v !== 'string') { problems.push(`${id}/${lang}[${k}]: replacement must be a string`); bad = true; break; }
          next[idx] = v;
        }
        if (bad) continue;
      } else {
        problems.push(`${id}/${lang}: expected an array or an index map`);
        continue;
      }
      for (let i = 0; i < from.length; i++) {
        const to = next;
        if (from[i] === to[i]) continue;
        const found = [];
        for (const needle of needles(from[i])) {
          for (const f of SOURCES) {
            const count = files[f].split(needle).length - 1;
            if (count > 0) found.push({ f, needle, count });
          }
        }
        const total = found.reduce((n, h) => n + h.count, 0);
        if (total === 0) { problems.push(`${id}/${lang}[${i}]: not found — ${from[i].slice(0, 44)}`); continue; }
        if (total > 1) { problems.push(`${id}/${lang}[${i}]: ${total} matches, ambiguous — ${from[i].slice(0, 44)}`); continue; }
        const { f, needle } = found[0];
        // Escape the replacement for the quote character that actually
        // delimits this literal — NOT for however the old text happened to be
        // escaped. An apostrophe in the new text inside a single-quoted
        // literal broke the file when the old text had none to go by.
        const at = files[f].indexOf(needle);
        const quote = files[f][at - 1];
        if (quote !== "'" && quote !== '"' && quote !== '`') {
          problems.push(`${id}/${lang}[${i}]: match is not a whole string literal`);
          continue;
        }
        const replacement = to[i]
          .replace(/\\/g, '\\\\')
          .split(quote).join('\\' + quote);
        files[f] = files[f].slice(0, at) + replacement + files[f].slice(at + needle.length);
        replaced++;
      }
    }
  }

  if (problems.length > 0) {
    console.error(`✖ ${problems.length} problem(s); nothing written:`);
    for (const p of problems.slice(0, 20)) console.error('   ' + p);
    process.exit(1);
  }
  // Parse every file we are about to write. An unescaped apostrophe in new
  // text silently produced a syntax error that only surfaced on the next run;
  // catching it here means a bad patch never reaches the working tree.
  const changed = SOURCES.filter(f => files[f] !== before[f]);
  for (const f of changed) {
    try {
      await transform(files[f], { loader: 'ts' });
    } catch (err) {
      console.error(`✖ patch would break ${f}; nothing written:`);
      console.error('   ' + String(err.errors?.[0]?.text ?? err.message));
      process.exit(1);
    }
  }
  for (const f of changed) fs.writeFileSync(f, files[f]);
  console.log(`✔ replaced ${replaced} option string(s) in ${changed.length} file(s)`);
}

// ── main ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const qd = await load('src/features/quiz/quizData.ts');
const qt = await load('src/i18n/quizTranslations.ts');
const ALL = qd.QUIZZES.flatMap(q => q.questions);
const get = qt.getTranslatedQuestion;

if (argv[0] === '--apply') { await applyPatch(argv[1], ALL, get); process.exit(0); }

if (argv[0] === '--dump') {
  const out = argv.slice(1).map(id => {
    const q = ALL.find(x => x.id === id);
    if (!q) return { id, error: 'not found' };
    const e = { id, correctIndex: q.correctIndex, en: q.options };
    for (const l of LANGS) e[l] = optionsFor(q, l, get);
    return e;
  });
  console.log(JSON.stringify(out, null, 1));
  process.exit(0);
}

if (argv[0] === '--list') {
  const rows = offenders(ALL);
  const n = Number(argv[1] ?? 20);
  console.log(`${rows.length} offender(s); worst ${Math.min(n, rows.length)}:`);
  for (const r of rows.slice(0, n)) console.log(`  ${r.id.padEnd(8)} +${String(r.gap).padStart(3)}  target ${String(r.target).padStart(3)}  ${r.correct.slice(0, 60)}`);
  process.exit(0);
}

console.log(`${ALL.length} questions · correct option longest, and its mean character advantage`);
console.log('(25% is chance for a 4-option question)');
for (const lang of ['en', ...LANGS]) {
  const m = measure(ALL, lang, get);
  console.log(`  ${lang.padEnd(3)} n=${String(m.n).padStart(3)}  longest ${m.longestPct.toFixed(1).padStart(5)}%   mean +${m.mean.toFixed(2)}`);
}
console.log(`offenders (longest AND >= +6 chars): ${offenders(ALL).length}`);
