// ─── Client ↔ server contract for the social API ──────────────────────────────
// The friends system was "online" for months without ever having worked: the
// client posted `{ username }` where the server read `{ friendId }`, and
// `{ friendId, text }` where it read `{ toId, text }`. Every call 400'd, the
// helper swallowed it as a boolean false, and the UI silently fell back to
// localStorage. Nothing failed loudly enough to notice.
//
// Nothing in the type system connects the two halves — they are separate
// tsconfigs, separate deployments, and the wire between them is untyped JSON.
// So this reads both sources and checks they agree: for each route the client
// calls, the keys it sends must be exactly the keys the server's zod schema
// requires.
//
// It is deliberately a source-text check rather than a runtime one. Standing up
// Express and Postgres to catch a misspelled field would be slower, flakier and
// no more truthful about this particular class of mistake.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const REPO = path.resolve(__dirname, '../..');
const serverSrc = fs.readFileSync(path.join(REPO, 'server/src/routes/social.ts'), 'utf8');
const clientSrc = fs.readFileSync(path.join(REPO, 'src/services/social.ts'), 'utf8');

/** Every `const NAME = z.object({ a: ..., b: ... })` in the server route file. */
function serverSchemas(): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  const re = /const\s+(\w+)\s*=\s*z\.object\(\{([\s\S]*?)\}\);/g;
  for (const m of serverSrc.matchAll(re)) {
    const fields = new Set([...m[2].matchAll(/(\w+)\s*:\s*z\./g)].map(f => f[1]));
    out.set(m[1], fields);
  }
  return out;
}

/** Every `api<...>('/path', { method: 'X', body: { a, b } })` in the client. */
function clientCalls(): { path: string; method: string; body: Set<string> | null }[] {
  const out: { path: string; method: string; body: Set<string> | null }[] = [];
  const re = /api<[^>]*>\(\s*(`[^`]*`|'[^']*')\s*(?:,\s*\{([\s\S]*?)\}\s*\))?/g;
  for (const m of clientSrc.matchAll(re)) {
    const rawPath = m[1].slice(1, -1);
    const init = m[2] ?? '';
    const method = /method:\s*'(\w+)'/.exec(init)?.[1] ?? 'GET';
    const bodyMatch = /body:\s*\{([^}]*)\}/.exec(init);
    const body = bodyMatch
      // `{ toId }` shorthand and `{ id, accept }` both reduce to their names.
      ? new Set(bodyMatch[1].split(',').map(s => s.split(':')[0].trim()).filter(Boolean))
      : null;
    out.push({ path: rawPath.replace(/\$\{[^}]*\}/g, ':param'), method, body });
  }
  return out;
}

/** Which server schema guards which route, read off the route declarations. */
function routeSchemaFor(routePath: string, method: string): string | null {
  // socialRouter.post('/requests', ...rateLimit..., async (req…) => { …parse(schemaName)… }
  const re = new RegExp(
    `socialRouter\\.${method.toLowerCase()}\\(\\s*'${routePath.replace(/[/\-]/g, m => '\\' + m)}'([\\s\\S]*?)\\n\\)?;?\\n(?:\\/\\/|const|socialRouter|$)`,
  );
  const block = re.exec(serverSrc)?.[1];
  if (!block) return null;
  return /(\w+)\.safeParse\(req\.body\)/.exec(block)?.[1] ?? null;
}

describe('social API client/server contract', () => {
  const schemas = serverSchemas();
  const calls = clientCalls();

  it('finds both halves to compare', () => {
    expect(schemas.size).toBeGreaterThan(4);
    expect(calls.length).toBeGreaterThan(8);
  });

  it('every client call targets a route the server actually declares', () => {
    const declared = [...serverSrc.matchAll(/socialRouter\.(get|post|delete)\(\s*'([^']+)'/g)]
      .map(m => ({ method: m[1].toUpperCase(), path: `/api/social${m[2]}` }));

    const missing: string[] = [];
    for (const call of calls) {
      // /api/auth/me is the session probe, not a social route.
      if (!call.path.startsWith('/api/social')) continue;
      const wanted = call.path.split('?')[0];
      const hit = declared.some(d =>
        d.method === call.method &&
        // `:param` in the client stands in for a template slot; the server
        // declares it as `:friendId` etc.
        new RegExp('^' + d.path.replace(/:\w+/g, '[^/]+') + '$').test(wanted.replace(/:param/g, 'x')));
      if (!hit) missing.push(`${call.method} ${wanted}`);
    }
    expect(missing).toEqual([]);
  });

  // The bug that started this: the body keys have to be the schema's keys.
  const bodyCalls = calls.filter(c => c.body && c.path.startsWith('/api/social'));

  it.each(bodyCalls.map(c => [`${c.method} ${c.path}`, c] as const))(
    '%s sends exactly the fields its server schema requires',
    (_label, call) => {
      const routePath = call.path.replace('/api/social', '').split('?')[0];
      const schemaName = routeSchemaFor(routePath, call.method);
      expect(schemaName, `no safeParse(req.body) found for ${call.method} ${routePath}`).toBeTruthy();

      const expected = schemas.get(schemaName!);
      expect(expected, `schema ${schemaName} not found`).toBeTruthy();

      const sent = [...call.body!].sort();
      const wanted = [...expected!].sort();
      expect(sent).toEqual(wanted);
    },
  );
});
