import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PLANS } from '@/features/subscription/plans';
import { LANDING_SYSTEM_PROMPT } from '@/services/aiGateway';

const ROOT = path.resolve(__dirname, '../..');

/**
 * A price appears in four places that do not import each other: the plan data,
 * the landing page's pricing cards, the in-app guide, and the system prompt
 * that lets Clio answer "what does Master cost?".
 *
 * Changing Master from $17.99 to $16.99 meant editing all four. Three would
 * have looked entirely correct while quoting the wrong number to customers.
 *
 * The fifth place is Stripe, which no test can reach. That one is written down
 * in LAUNCH.md instead: the app displays plans.ts, Stripe charges its own Price
 * object, and nothing reconciles them automatically.
 */
describe('plan prices agree across the app', () => {
  const priceOf = (id: string) => PLANS.find(p => p.id === id)!.price;

  it('quotes the same number on the landing page as in the plan data', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/pages/LandingPage.tsx'), 'utf8');
    for (const plan of PLANS) {
      if (plan.price === 0) continue;
      const card = new RegExp(`plan: '${plan.name}',\\s*price: '\\$([\\d.]+)'`);
      const found = src.match(card);
      expect(found, `${plan.name} has no pricing card`).toBeTruthy();
      expect(Number(found![1]), `${plan.name} card price`).toBe(plan.price);
    }
  });

  it('quotes the same number in the prompt Clio answers billing questions from', () => {
    for (const plan of PLANS) {
      if (plan.price === 0) continue;
      expect(LANDING_SYSTEM_PROMPT, `${plan.name} price missing or stale in the AI prompt`)
        .toContain(`$${plan.price.toFixed(2)}`);
    }
  });

  it('quotes the same number in the in-app guide, in every language', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/i18n/appGuideTranslations.ts'), 'utf8');
    const master = priceOf('master');
    // German and French write "16,99 $", not "$16.99". A dot-only pattern
    // matched four of the six languages and reported success while those two
    // still quoted the old price to their readers.
    const quoted = [...src.matchAll(/Master Student\s*:?\s*(?:\$\s*([\d.]+)|([\d,]+)\s*\$)/g)]
      .map(m => Number((m[1] ?? m[2]).replace(',', '.')));
    expect(quoted.length, 'the guide should name the Master price in every language').toBe(6);
    expect([...new Set(quoted)], 'guide disagrees with the plan data').toEqual([master]);
  });

  it('never leaves a stale price string anywhere in the source', () => {
    // Catches the copy that was missed rather than the ones that were found.
    // Both spellings: '$17.99' and the European '17,99 $'.
    const stale = ['17.99', '17,99'];
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name === 'node_modules') continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) { walk(full); continue; }
        if (!/\.tsx?$/.test(e.name)) continue;
        if (full === __filename) continue;   // this file names the old price on purpose
        // Territory and campaign geometry carry coordinate pairs that can
        // legitimately contain these digits.
        if (/historicalBoundaries|imperiumProvinces|territoryGeojson|timelineTerritoryData/.test(full)) continue;
        const src = fs.readFileSync(full, 'utf8');
        for (const s of stale) {
          if (src.includes(`$${s}`) || src.includes(`${s} $`)) offenders.push(`${path.relative(ROOT, full)}: ${s}`);
        }
      }
    };
    walk(path.join(ROOT, 'src'));
    expect(offenders, 'a plan price was changed in some places but not here').toEqual([]);
  });
});
