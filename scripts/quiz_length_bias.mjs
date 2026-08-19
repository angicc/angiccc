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
//   node scripts/quiz_length_bias.mjs --list 20 [lang] → worst 20 offenders
//                                                       (all 6 languages by default)
//   node scripts/quiz_length_bias.mjs --dump id id …  → full option sets
//   node scripts/quiz_length_bias.mjs --check p.json [n] → dry-run a patch, all 6
//                                                        (n = tolerated lead, default 2)
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

/**
 * Questions where the correct option both leads on length and leads clearly.
 *
 * `lang` matters and used to be missing: this read q.options directly, which
 * is the ENGLISH text, so the offender list only ever described English. A
 * batch that fixed every listed offender left the other five languages
 * untouched — and the summary above kept reporting them at the old rate with
 * nothing to say which questions were responsible.
 *
 * The gap is measured against the LONGEST distractor, not the mean: a learner
 * comparing options picks out the longest one, and an answer that beats the
 * average while sitting second is not a tell.
 */
function offenders(questions, lang = 'en', get = null, minGap = 6) {
  const rows = [];
  for (const q of questions) {
    const opts = lang === 'en' ? q.options : optionsFor(q, lang, get);
    if (!opts) continue;
    const lens = opts.map(o => o.length);
    const ci = q.correctIndex;
    const others = lens.filter((_, i) => i !== ci);
    const gap = lens[ci] - Math.max(...others);
    if (lens[ci] !== Math.max(...lens) || gap < minGap) continue;
    rows.push({ id: q.id, lang, gap, target: Math.max(...others), correct: opts[ci] });
  }
  return rows.sort((a, b) => b.gap - a.gap);
}

/** Every offender in every language, worst first. */
function allOffenders(questions, get, minGap = 6) {
  return ['en', ...LANGS]
    .flatMap(l => offenders(questions, l, get, minGap))
    .sort((a, b) => b.gap - a.gap);
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

/**
 * The regions of a file that belong to one question.
 *
 * Replacement used to search whole files, which works only while every option
 * is a distinctive phrase. It is not: distractors are routinely single words —
 * "Egypt", "India", "Morocco" — and those appear dozens of times across the
 * bank, so the patcher refused them all as ambiguous. Correct, but it meant
 * exactly the questions most in need of rewriting could not be rewritten.
 *
 * Scoping to the block that follows the question's own id makes a bare word
 * unambiguous again, and keeps the safety: a match outside any block, or in
 * two blocks at once, is still refused rather than guessed at.
 */
const DATA_SOURCES = SOURCES.filter(f => f.startsWith('src/features/quiz/'));
const TRANSLATION_SOURCES = SOURCES.filter(f => f.startsWith('src/i18n/'));

/**
 * Narrow a question's windows to one language's sub-block.
 *
 * Needed because a word is often its own translation: English "India" and
 * Spanish "India" are the same six characters, and both live inside mq36's
 * record, so a question-scoped search still returned two matches and refused
 * the patch. English lives in the quiz data files and every other language in
 * a `<lang>: { … }` entry of a translation table, so the two never collide
 * once the search is told which one it is looking at.
 */
function languageWindows(text, windows, lang) {
  if (lang === 'en') return windows;
  const out = [];
  for (const [start, end] of windows) {
    const block = text.slice(start, end);
    const re = new RegExp(`\\b${lang}:\\s*\\{`, 'g');
    for (let m; (m = re.exec(block)); ) {
      const from = start + m.index;
      // A language entry ends at the next one, or at the end of the record.
      const rest = text.slice(from + m[0].length, end);
      const next = rest.search(/\n\s*[a-z]{2}:\s*\{/);
      out.push([from, from + m[0].length + (next === -1 ? rest.length : next)]);
    }
  }
  return out;
}

/**
 * Narrow further to the `options: [ … ]` array itself.
 *
 * An option's text often appears again in the same record's explanation —
 * "Дванаесетте таблици" is both option 0 of aq45 and a word in its
 * explanation — so a record-scoped search finds it twice and refuses. Only
 * the array is a legitimate replacement target anyway: rewriting an option
 * must never silently edit the prose that explains it.
 */
function optionsWindows(text, windows) {
  const out = [];
  for (const [start, end] of windows) {
    const block = text.slice(start, end);
    const re = /options\s*:\s*\[/g;
    for (let m; (m = re.exec(block)); ) {
      const from = start + m.index + m[0].length;
      const close = text.indexOf(']', from);
      if (close !== -1 && close < end) out.push([from, close]);
    }
  }
  return out;
}

function questionWindows(text, id) {
  const windows = [];
  for (const quoted of [`'${id}'`, `"${id}"`, `\`${id}\``]) {
    let from = 0;
    for (;;) {
      const at = text.indexOf(quoted, from);
      if (at === -1) break;
      // A question's record ends where the next question begins. The two files
      // shapes differ and BOTH have to be recognised: the quiz data uses
      // `id: 'mq36'` inside an object, the translation tables use `'mq36': {`
      // as the key. Matching only the first ran the window on past the end of
      // the entry and swallowed its neighbours, which is how a bare "India"
      // came back as two matches instead of one.
      const rest = text.slice(at + quoted.length, at + quoted.length + 4000);
      const nextId = rest.search(/\bid:\s*['"\`]|\n\s*['"\`][A-Za-z]+\d+['"\`]\s*:\s*\{/);
      windows.push([at, at + quoted.length + (nextId === -1 ? rest.length : nextId)]);
      from = at + quoted.length;
    }
  }
  return windows;
}

/**
 * Occurrences of `needle` inside any of `windows`, as absolute offsets.
 *
 * A hit only counts when the needle is a WHOLE string literal — quote
 * immediately before, the same quote immediately after. Substring matching
 * alone was wrong in a way that only showed up mid-patch: replacing eq2's
 * "Флорида" with "Флорида и её побережье Мексиканского залива" put the
 * letters of "Мексика" into the same options array, so the next replacement
 * in the same batch found its own target twice and refused. The boundary
 * check is also the right rule on its own terms: rewriting an option must
 * replace an option, never part of a longer word.
 */
function matchesInWindows(text, windows, needle) {
  const QUOTES = new Set(["'", '"', '`']);
  const hits = new Set();
  for (const [start, end] of windows) {
    let from = start;
    for (;;) {
      const at = text.indexOf(needle, from);
      if (at === -1 || at >= end) break;
      const before = text[at - 1];
      const after = text[at + needle.length];
      if (QUOTES.has(before) && after === before) hits.add(at);
      from = at + needle.length;
    }
  }
  return [...hits];
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
        for (const f of (lang === 'en' ? DATA_SOURCES : TRANSLATION_SOURCES)) {
          const windows = optionsWindows(
            files[f],
            languageWindows(files[f], questionWindows(files[f], id), lang),
          );
          if (windows.length === 0) continue;
          for (const needle of needles(from[i])) {
            for (const at of matchesInWindows(files[f], windows, needle)) {
              found.push({ f, needle, at });
            }
          }
        }
        if (found.length === 0) { problems.push(`${id}/${lang}[${i}]: not found in ${id}'s block — ${from[i].slice(0, 44)}`); continue; }
        if (found.length > 1) { problems.push(`${id}/${lang}[${i}]: ${found.length} matches, ambiguous — ${from[i].slice(0, 44)}`); continue; }
        const { f, needle } = found[0];
        // Escape the replacement for the quote character that actually
        // delimits this literal — NOT for however the old text happened to be
        // escaped. An apostrophe in the new text inside a single-quoted
        // literal broke the file when the old text had none to go by.
        const { at } = found[0];
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

/**
 * Dry-run a patch: for every question and language it touches, report whether
 * the correct option would still be the longest, and by how much.
 *
 * Rewriting six languages by counting characters in your head does not work.
 * --list only ranks English (it reads q.options directly), so a patch that
 * fixes English can leave the other five untouched at ~51% — which is what the
 * per-language summary has been reporting all along. This closes that loop
 * before anything is written.
 */
function checkPatch(patchPath, questions, get, tolerance = 2) {
  const patch = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
  let worst = 0, flagged = 0, checked = 0, tolerated = 0;
  for (const [id, byLang] of Object.entries(patch)) {
    const q = questions.find(x => x.id === id);
    if (!q) { console.log(`  ${id}: NO SUCH QUESTION`); flagged++; continue; }
    for (const [lang, to] of Object.entries(byLang)) {
      const from = optionsFor(q, lang, get);
      if (!from) { console.log(`  ${id}/${lang}: no options`); flagged++; continue; }
      const next = Array.isArray(to) ? to : from.map((o, i) => to[i] ?? o);
      if (next.length !== from.length) { console.log(`  ${id}/${lang}: wrong option count`); flagged++; continue; }
      checked++;
      const lens = next.map(o => o.length);
      const ci = q.correctIndex;
      const others = lens.filter((_, i) => i !== ci);
      const gap = lens[ci] - Math.max(...others);
      if (lens[ci] === Math.max(...lens) && new Set(lens).size > 1) {
        // A one- or two-character lead is not a tell — nobody picks an answer
        // because it is two characters longer, and where the options are
        // proper nouns ("Kamikaze" beside "Seppuku") it cannot be removed
        // without padding them into something worse. Reported, not refused.
        if (gap <= tolerance) { tolerated++; continue; }
        flagged++;
        worst = Math.max(worst, gap);
        console.log(`  ${id}/${lang}  still longest by +${gap}  "${next[ci].slice(0, 50)}"`);
      }
    }
  }
  const tail = tolerated ? ` (${tolerated} lead by ≤${tolerance} chars, within tolerance)` : '';
  console.log(flagged === 0
    ? `✔ ${checked} option set(s) checked; no correct answer leads on length${tail}`
    : `✖ ${flagged} of ${checked} still lead on length (worst +${worst})${tail}`);
  process.exit(flagged === 0 ? 0 : 1);
}

if (argv[0] === '--check') { checkPatch(argv[1], ALL, get, Number(argv[2] ?? 2)); }

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
  // Default to ALL languages: listing only English is what let five of the
  // six drift while the offender count read zero.
  const lang = argv[2];
  const rows = lang ? offenders(ALL, lang, get) : allOffenders(ALL, get);
  const n = Number(argv[1] ?? 20);
  console.log(`${rows.length} offender(s)${lang ? ` in ${lang}` : ' across 6 languages'}; worst ${Math.min(n, rows.length)}:`);
  for (const r of rows.slice(0, n)) {
    console.log(`  ${r.id.padEnd(8)} ${r.lang}  +${String(r.gap).padStart(3)}  beat ${String(r.target).padStart(3)}  ${r.correct.slice(0, 56)}`);
  }
  process.exit(0);
}

console.log(`${ALL.length} questions · correct option longest, and its mean character advantage`);
console.log('(25% is chance for a 4-option question)');
for (const lang of ['en', ...LANGS]) {
  const m = measure(ALL, lang, get);
  // Signed, because the mean can now legitimately be negative — "+-0.04" was
  // the old format's way of saying the correct option is on average SHORTER.
  const mean = `${m.mean >= 0 ? '+' : ''}${m.mean.toFixed(2)}`;
  console.log(`  ${lang.padEnd(3)} n=${String(m.n).padStart(3)}  longest ${m.longestPct.toFixed(1).padStart(5)}%   mean ${mean}`);
}
const all = allOffenders(ALL, get);
console.log(`offenders (longest, and >= +6 chars clear of the next): ${all.length} across 6 languages`);
if (all.length) {
  const byLang = {};
  for (const r of all) byLang[r.lang] = (byLang[r.lang] ?? 0) + 1;
  console.log('  ' + Object.entries(byLang).map(([l, n]) => `${l}=${n}`).join('  '));
}
