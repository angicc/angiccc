import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../..');

/**
 * No em dashes anywhere in the shipped source.
 *
 * The app had 17,000 of them, in lesson bodies, UI strings and landing copy
 * across all six languages. They read as machine-written, and the owner asked
 * for a plain hyphen instead. A single stray one reintroduced in a new lesson
 * would be invisible in review, so it is checked rather than remembered.
 *
 * The character is written as an escape on purpose: spelling it literally would
 * put an em dash in this file and the check would fail on itself.
 */
const EM_DASH = String.fromCharCode(0x2014);

function sourceFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules') continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.(tsx?|jsx?|mjs|html)$/.test(e.name)) out.push(full);
    }
  };
  walk(path.join(ROOT, 'src'));
  walk(path.join(ROOT, 'server/src'));
  walk(path.join(ROOT, 'netlify'));
  // The generators emit headers into src/, so a stray dash there comes back
  // on the next regeneration unless the template itself is clean.
  walk(path.join(ROOT, 'scripts'));
  const index = path.join(ROOT, 'index.html');
  if (fs.existsSync(index)) out.push(index);
  return out;
}

describe('typography', () => {
  it('ships no em dashes', () => {
    const offenders: string[] = [];
    for (const file of sourceFiles()) {
      const src = fs.readFileSync(file, 'utf8');
      const count = src.split(EM_DASH).length - 1;
      if (count > 0) offenders.push(`${path.relative(ROOT, file)} (${count})`);
    }
    expect(offenders, 'use a plain hyphen instead of an em dash').toEqual([]);
  });

  it('is looking at the files it thinks it is', () => {
    // A path typo would make the check pass by scanning nothing.
    const files = sourceFiles();
    expect(files.length).toBeGreaterThan(150);
    expect(files.some(f => f.includes('lessonsData'))).toBe(true);
    expect(files.some(f => f.includes('landingTranslations'))).toBe(true);
  });
});
