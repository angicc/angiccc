import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Catch user-facing English that never reaches the translation table.
 *
 * The build-time i18n guard in vite.config.ts is thorough about the `T` object:
 * every key, every language, values compared rather than merely counted. Its
 * blind spot is text that never becomes a key in the first place — a sentence
 * written inline in a component, or returned as a string from a plain module
 * and rendered as-is.
 *
 * That blind spot cost five real defects: the AI allowance messages, the
 * offline-fallback notices, the local auth failures, the UpgradePrompt button
 * and a set of toasts. Each looked fine in English and was English in all six
 * languages. These checks watch the shapes those defects took.
 */

const ROOT = path.resolve(__dirname, '../..');
const UI_DIRS = ['src/pages', 'src/features', 'src/components/shared', 'src/components/layout'];

function filesUnder(dirs: string[]): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(e.name)) out.push(full);
    }
  };
  for (const d of dirs) walk(path.join(ROOT, d));
  return out;
}

const rel = (f: string) => path.relative(ROOT, f);

/**
 * Source with comments blanked out.
 *
 * Comments describing a bug quote the very pattern the check looks for — the
 * note explaining why AiTutorPage no longer branches on `reason.includes('Master')`
 * would otherwise fail the check that keeps it from coming back. Newlines are
 * preserved so nothing else shifts.
 */
function code(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length));
}

describe('translation leaks', () => {
  it('never toasts a string literal', () => {
    // toast.success('Welcome back!') and four others shipped like this. A toast
    // is as user-facing as text gets; it must come from `t`.
    const offenders: string[] = [];
    for (const file of filesUnder(UI_DIRS)) {
      const src = code(fs.readFileSync(file, 'utf8'));
      for (const m of src.matchAll(/toast\.(?:success|error|info|warning|message)\(\s*(['"])(.{4,}?)\1/g)) {
        offenders.push(`${rel(file)}: toast(${m[1]}${m[2]}${m[1]})`);
      }
    }
    expect(offenders, 'toast text must come from the translation table').toEqual([]);
  });

  it('never returns a prose error, reason or notice from a state module', () => {
    // These modules have no access to `t`, so a sentence returned from one is a
    // sentence the UI cannot translate. They return keys instead.
    const modules = [
      'src/features/auth/AuthContext.tsx',
      'src/features/subscription/subscriptionStore.ts',
    ];
    const offenders: string[] = [];
    for (const m of modules) {
      const file = path.join(ROOT, m);
      if (!fs.existsSync(file)) continue;
      const src = code(fs.readFileSync(file, 'utf8'));
      // `error: 'Not logged in.'` — a property named like a message, given a
      // literal containing a space (so identifiers and codes are left alone).
      for (const hit of src.matchAll(/\b(?:error|reason|notice|message)\s*:\s*(['"])([^'"]*\s[^'"]*)\1/g)) {
        offenders.push(`${m}: ${hit[0].slice(0, 60)}`);
      }
    }
    expect(offenders, 'return a translation key, not a sentence').toEqual([]);
  });

  it('never hardcodes an aria-label or placeholder sentence', () => {
    // A screen reader reads aria-label aloud; an empty field shows its
    // placeholder. Both were English-only in a few places. Sample data that
    // looks like an example value (an address, a handle) is not prose.
    const offenders: string[] = [];
    const looksLikeSampleValue = (s: string) => /[@]|^\d|^[a-z0-9_.-]+$/i.test(s.trim());
    // Listed rather than pattern-matched, so adding one is a decision someone
    // makes on purpose. A specimen value is not prose: it stands in for what
    // the user types, and translating it would not help them type it.
    const SAMPLE_VALUES = new Set(['Angel Smith']);
    for (const file of filesUnder(UI_DIRS)) {
      const src = code(fs.readFileSync(file, 'utf8'));
      for (const m of src.matchAll(/\b(aria-label|placeholder)="([^"]{4,})"/g)) {
        // Two or more words starting with a letter reads as prose.
        if (looksLikeSampleValue(m[2]) || SAMPLE_VALUES.has(m[2])) continue;
        if (!/^[A-Za-z].*\s/.test(m[2])) continue;
        offenders.push(`${rel(file)}: ${m[1]}="${m[2]}"`);
      }
    }
    expect(offenders, 'aria-label and placeholder prose must come from `t`').toEqual([]);
  });

  it('never branches on the English wording of a message', () => {
    // AiTutorPage chose its upgrade CTA with reason.includes('Master') and
    // LoginPage matched r.error against a whole English sentence. Both worked
    // only while the string stayed English, which is precisely what a
    // translation is supposed to stop being.
    const offenders: string[] = [];
    for (const file of filesUnder(UI_DIRS)) {
      const src = code(fs.readFileSync(file, 'utf8'));
      for (const m of src.matchAll(/\b(?:error|reason|notice|message)\??\.(?:includes|startsWith|endsWith)\(\s*['"]([^'"]{3,})['"]/g)) {
        offenders.push(`${rel(file)}: .includes('${m[1]}')`);
      }
      for (const m of src.matchAll(/\b(?:error|reason|notice|message)\s*===\s*(['"])([^'"]*\s[^'"]*)\1/g)) {
        offenders.push(`${rel(file)}: === ${m[1]}${m[2]}${m[1]}`);
      }
    }
    expect(offenders, 'branch on a key or a code, never on translated prose').toEqual([]);
  });
});
