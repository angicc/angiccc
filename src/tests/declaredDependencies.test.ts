import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { builtinModules } from 'module';

/**
 * Every package the app imports must be declared in package.json.
 *
 * This guard exists because the alternative already happened. A sibling branch
 * imported react-router-dom, framer-motion, canvas-confetti and leaflet
 * throughout src/ without any of them appearing in package.json. Locally it
 * worked - node_modules still held them from an earlier install - and on
 * Netlify, whose cache also held them, it worked too, until the cache rolled
 * and `npm run build` began failing at `tsc -b` on every deploy. Netlify serves
 * the last good build when a build fails, so the site did not break; it simply
 * stopped changing, and fixes kept "not showing up" for weeks with nothing
 * obviously wrong.
 *
 * Nothing else catches this. The dev server resolves from node_modules, the
 * typechecker resolves from node_modules, and the tests resolve from
 * node_modules. Only a clean install exposes it, which is exactly the thing
 * nobody runs locally.
 */

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'src');

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
const declared = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
]);

const BUILTINS = new Set([...builtinModules, ...builtinModules.map(m => `node:${m}`)]);

/** Bare specifier → the package that must be declared. Handles @scope/name/sub. */
function packageOf(spec: string): string {
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(p));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(p);
  }
  return out;
}

// Only real import/export statements, anchored to the start of a line, plus
// dynamic import() which legitimately appears mid-expression. An unanchored
// pattern also matches the words "import" and "from" inside ordinary prose -
// the lesson and quiz content is full of sentences like "...borrowed from
// 'al-jabr'..." - and reports them as missing packages.
const SPEC_RE =
  /^\s*(?:import|export)\s[^'"\n]*?from\s*['"]([^'"]+)['"]|^\s*import\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/gm;

/** A plausible package specifier: `name`, `@scope/name`, either with subpaths. */
const PKG_SPEC = /^(?:@[\w.-]+\/)?[\w.-]+(?:\/[\w.-]+)*$/;

describe('declared dependencies', () => {
  const files = sourceFiles(SRC);

  it('reads a realistic number of source files', () => {
    // An empty scan would make every assertion below vacuously pass.
    expect(files.length).toBeGreaterThan(50);
  });

  it('declares every package imported from src/', () => {
    const undeclared = new Map<string, string[]>();

    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8');
      for (const m of text.matchAll(SPEC_RE)) {
        const spec = m[1] ?? m[2] ?? m[3];
        if (!spec) continue;
        // Relative paths and the '@/' alias resolve inside this repo.
        if (spec.startsWith('.') || spec.startsWith('@/') || spec.startsWith('/')) continue;
        if (BUILTINS.has(spec)) continue;
        if (!PKG_SPEC.test(spec)) continue;
        const name = packageOf(spec);
        if (declared.has(name)) continue;
        const where = path.relative(ROOT, file);
        undeclared.set(name, [...(undeclared.get(name) ?? []), where]);
      }
    }

    // Report the package and one file that imports it, so the fix is obvious:
    // `npm install --save <package>`.
    const report = [...undeclared.entries()]
      .map(([name, where]) => `${name} (imported by ${where[0]}${where.length > 1 ? ` and ${where.length - 1} more` : ''})`)
      .sort();
    expect(report).toEqual([]);
  });
});
