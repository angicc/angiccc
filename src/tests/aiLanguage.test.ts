import { describe, it, expect } from 'vitest';
import {
  LANG_NAMES, DIRECTIVE_LANGUAGES, languageDirective, promptDirectives,
  COMPACTION_RULE, FORMAT_RULE, type PromptLanguage,
} from '@/services/aiLanguage';
import { T, type Language } from '@/i18n/translations';
import { canUseAI, AI_LIMITS } from '@/features/subscription/subscriptionStore';
import { aiAllowanceMessage } from '@/features/subscription/aiAllowanceMessage';

const UI_LANGUAGES = Object.keys(T) as Language[];

// The bug these guard against: German and French were handed two thin sentences
// while Macedonian got seven numbered rules, and a second copy of LANG_NAMES in
// EssayPage.tsx omitted de/fr entirely, so those students were told — in the
// system prompt — to receive their essay feedback in English.
describe('AI language directives', () => {
  it('covers every UI language', () => {
    expect([...DIRECTIVE_LANGUAGES].sort()).toEqual([...UI_LANGUAGES].sort());
    for (const lang of UI_LANGUAGES) expect(LANG_NAMES[lang]).toBeTruthy();
  });

  it('names the target language in its own directive', () => {
    for (const lang of DIRECTIVE_LANGUAGES) {
      expect(languageDirective(lang)).toContain(`OUTPUT LANGUAGE: ${LANG_NAMES[lang]}`);
    }
  });

  it('gives every language a substantive rule block, not a stub', () => {
    // Measured against the thinnest directive that is actually specific enough
    // to change model output. The old de/fr entries were ~230 characters of
    // generic encouragement and would fail this.
    for (const lang of DIRECTIVE_LANGUAGES) {
      const rules = languageDirective(lang).replace(COMPACTION_RULE, '');
      expect(rules.length, `${lang} directive is too thin to constrain output`).toBeGreaterThan(400);
    }
  });

  it('spells out numbered, checkable rules for every non-English language', () => {
    for (const lang of DIRECTIVE_LANGUAGES.filter(l => l !== 'en')) {
      const d = languageDirective(lang);
      // At least five enumerated rules — the point is specificity the model can
      // verify against, not an adjective like "write well".
      expect(d, `${lang} should enumerate its grammar rules`).toMatch(/\(5\)/);
      // fr "calque" · de "Wort-für-Wort" · es "literal" · ru "калькируй" · mk "дословната"
      expect(d, `${lang} should forbid calquing from English`).toMatch(/calqu|Wort-für-Wort|literal|кальк|дословн/i);
    }
  });

  it('carries the compaction and precedence rules in every language', () => {
    for (const lang of DIRECTIVE_LANGUAGES) {
      expect(languageDirective(lang)).toContain(COMPACTION_RULE);
      expect(languageDirective(lang)).toContain('OVERRIDES any other instruction');
    }
  });

  it('falls back to English for an unknown code rather than emitting nothing', () => {
    const d = languageDirective('klingon');
    expect(d).toBe(languageDirective('en'));
    expect(d.length).toBeGreaterThan(0);
  });

  it('prepends the plain-text format rule to the language block', () => {
    const p = promptDirectives('de');
    expect(p).toContain(FORMAT_RULE);
    expect(p).toContain(languageDirective('de'));
    expect(p.indexOf(FORMAT_RULE)).toBeLessThan(p.indexOf('OUTPUT LANGUAGE: German'));
  });
});

// These strings used to be English literals inside subscriptionStore.ts,
// rendered straight into the UI. Because they never entered the T table, the
// build-time i18n guard could not see them, and five languages showed English.
describe('AI allowance messages', () => {
  const exhausted = [
    canUseAI('free', 0, AI_LIMITS.free),
    canUseAI('beginner', 0, AI_LIMITS.beginner),
    canUseAI('pro', AI_LIMITS.pro),
    canUseAI('master', AI_LIMITS.master),
  ];

  it('blocks each tier at its own limit and allows one below it', () => {
    for (const a of exhausted) expect(a.allowed).toBe(false);
    expect(canUseAI('free', 0, AI_LIMITS.free - 1).allowed).toBe(true);
    expect(canUseAI('beginner', 0, AI_LIMITS.beginner - 1).allowed).toBe(true);
    expect(canUseAI('pro', AI_LIMITS.pro - 1).allowed).toBe(true);
    expect(canUseAI('master', AI_LIMITS.master - 1).allowed).toBe(true);
  });

  it('returns a translation key, never a sentence', () => {
    for (const a of exhausted) {
      expect(a.reasonKey).toBeTruthy();
      // A key, not prose: no spaces, and present in the table.
      expect(a.reasonKey!).toMatch(/^ai_limit_[a-z]+$/);
    }
  });

  it('translates in every language with no placeholder left behind', () => {
    for (const lang of UI_LANGUAGES) {
      for (const a of exhausted) {
        const msg = aiAllowanceMessage(a, T[lang])!;
        expect(msg, `${lang}/${a.reasonKey}`).toBeTruthy();
        expect(msg, `${lang}/${a.reasonKey} left a placeholder`).not.toMatch(/\{[nm]\}/);
        expect(msg, `${lang}/${a.reasonKey} lost its limit`).toContain(String(a.limit));
        if (a.nextLimit) expect(msg).toContain(String(a.nextLimit));
      }
    }
  });

  it('differs from English in every other language', () => {
    for (const lang of UI_LANGUAGES.filter(l => l !== 'en')) {
      for (const a of exhausted) {
        expect(aiAllowanceMessage(a, T[lang]), `${lang}/${a.reasonKey} is untranslated`)
          .not.toBe(aiAllowanceMessage(a, T.en));
      }
    }
  });

  it('says nothing when the allowance is fine', () => {
    expect(aiAllowanceMessage(canUseAI('pro', 0), T.en)).toBeUndefined();
  });

  it('points every blocked tier below Master at the next plan up', () => {
    // AiTutorPage sizes its upgrade CTA from nextTier. It used to sniff the
    // English word "Master" out of the message, which never matched in the
    // other five languages.
    expect(canUseAI('free', 0, AI_LIMITS.free).nextTier).toBe('beginner');
    expect(canUseAI('beginner', 0, AI_LIMITS.beginner).nextTier).toBe('pro');
    expect(canUseAI('pro', AI_LIMITS.pro).nextTier).toBe('master');
    expect(canUseAI('master', AI_LIMITS.master).nextTier).toBeUndefined();
  });
});

describe('no second copy of the language table', () => {
  it('every language name is defined exactly once, in aiLanguage.ts', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const root = path.resolve(__dirname, '../..');

    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) { walk(full); continue; }
        if (!/\.tsx?$/.test(entry.name)) continue;
        const rel = path.relative(root, full);
        if (rel.endsWith('services/aiLanguage.ts') || rel.startsWith('src/tests')) continue;
        const src = fs.readFileSync(full, 'utf8');
        // A literal map from language code to English language name. The
        // dynamic-translation table is typed Record<ContentLang, string>, so
        // TypeScript already enforces its completeness; the danger is the
        // untyped Record<string, string> kind that silently drops de and fr.
        if (/Record<string,\s*string>\s*=\s*\{[^}]*\ben:\s*'English'/.test(src)) offenders.push(rel);
      }
    };
    walk(path.join(root, 'src'));

    expect(offenders, 'redeclared LANG_NAMES — import it from services/aiLanguage instead').toEqual([]);
  });
});

// Belt and braces for the strict typing: if someone widens LANG_NAMES back to
// Record<string, string> at the declaration site, this still catches a gap.
describe('LANG_NAMES completeness', () => {
  it('has a name for every prompt language', () => {
    for (const lang of DIRECTIVE_LANGUAGES as PromptLanguage[]) {
      expect(typeof LANG_NAMES[lang]).toBe('string');
      expect(LANG_NAMES[lang].length).toBeGreaterThan(0);
    }
  });
});
