// ─── Shared API transport ────────────────────────────────────────────────────
// One place that knows how to talk to the Historify server: the base URL, the
// session cookie, and the CSRF token every state-changing request needs.
//
// WHY THE CSRF PART EXISTS. The server protects `/api/` with a signed
// double-submit token: a readable `csrf` cookie whose value must be echoed in
// an `X-CSRF-Token` header. The usual client half of that is to read the cookie
// out of `document.cookie` — which cannot work here, because the SPA is served
// from one origin and the API lives on another, so the API's cookie is simply
// not in this document's cookie jar. Every cookie-authenticated POST from the
// deployed app was therefore being rejected 403 by our own guard.
//
// The token is fetched once from `GET /api/csrf` (readable body, but only to
// origins on the server's CORS allowlist) and cached. A 403 clears the cache
// and the request is retried once, so a rotated or expired token heals itself
// instead of surfacing as a dead button.

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '');

export function apiConfigured(): boolean {
  return API_BASE.length > 0;
}

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

const SAFE = new Set(['GET', 'HEAD', 'OPTIONS']);

let csrfToken: string | null = null;
let inFlight: Promise<string | null> | null = null;

async function getCsrfToken(): Promise<string | null> {
  if (csrfToken) return csrfToken;
  // Concurrent first requests must not each fetch their own token.
  if (!inFlight) {
    inFlight = (async () => {
      try {
        const res = await fetch(apiUrl('/api/csrf'), { credentials: 'include' });
        if (!res.ok) return null;
        const data = (await res.json()) as { token?: string | null };
        csrfToken = data.token ?? null;
        return csrfToken;
      } catch {
        return null;
      } finally {
        inFlight = null;
      }
    })();
  }
  return inFlight;
}

/** Drop the cached token so the next request fetches a fresh one. */
export function invalidateCsrfToken(): void {
  csrfToken = null;
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Abort after this long. Defaults to 8s — long enough for a cold start. */
  timeoutMs?: number;
}

/**
 * Fetch against the API with the session cookie and, when needed, a CSRF token.
 *
 * Returns the raw Response so callers can distinguish 401 from 403 from 429 —
 * those mean different things to a person ("sign in", "not allowed", "slow
 * down") and collapsing them into a boolean is what hid the last round of
 * failures. Returns null only when no backend is configured or the network is
 * unreachable, which is the signal to fall back to local behaviour.
 */
export async function apiFetch(path: string, opts: RequestOptions = {}): Promise<Response | null> {
  if (!apiConfigured()) return null;
  const method = opts.method ?? 'GET';

  const send = async (token: string | null): Promise<Response | null> => {
    const headers: Record<string, string> = {};
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers['X-CSRF-Token'] = token;
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), opts.timeoutMs ?? 8000);
      const res = await fetch(apiUrl(path), {
        method,
        credentials: 'include',
        headers: Object.keys(headers).length ? headers : undefined,
        body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
        signal: ctl.signal,
      });
      clearTimeout(timer);
      return res;
    } catch {
      return null;
    }
  };

  if (SAFE.has(method)) return send(null);

  const res = await send(await getCsrfToken());
  // A 403 here is almost always a token that rotated out from under us (they
  // expire after 12h). Refetch and retry exactly once — twice would loop
  // against a genuine permission failure, which also answers 403.
  if (res?.status === 403) {
    invalidateCsrfToken();
    const fresh = await getCsrfToken();
    if (fresh) return send(fresh);
  }
  return res;
}
