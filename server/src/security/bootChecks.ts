// ─── Refuse to boot with a configuration that cannot hold ────────────────────
//
// The server already had `if (!JWT_SECRET) throw` — which accepts "secret".
// A four-character signing key is not a smaller version of a good one: anyone
// can brute-force it offline from a single issued token and then mint sessions
// for any account, including tier and identity claims. That is total
// compromise, and it is invisible until it happens.
//
// Everything here runs once, at startup, and throws. A server that will not
// start is a loud, cheap failure; a server running on a guessable key is a
// silent, expensive one. This matters most exactly when the app is about to be
// handed to strangers through a public link.

/** Below this, an offline brute-force is realistic. 32 chars ≈ 192 bits base64. */
const MIN_SECRET_CHARS = 32;

/**
 * Values that appear in tutorials, .env.example files and copy-pasted configs.
 * A secret is not strong merely because it is long — "changeme-changeme-…" is
 * in every wordlist there is.
 */
const BANNED_FRAGMENTS = [
  'change', 'secret', 'password', 'example', 'default', 'placeholder',
  'your-', 'xxxx', 'test', 'dev', 'localhost', '123456', 'abcdef',
];

function shannonBits(value: string): number {
  const counts = new Map<string, number>();
  for (const ch of value) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  let bitsPerChar = 0;
  for (const n of counts.values()) {
    const p = n / value.length;
    bitsPerChar -= p * Math.log2(p);
  }
  return bitsPerChar * value.length;
}

export interface SecretProblem {
  name: string;
  reason: string;
}

/**
 * Check one secret. Returns a problem or null — pure, so it is testable
 * without setting environment variables or booting anything.
 */
export function checkSecret(name: string, value: string | undefined): SecretProblem | null {
  if (!value || value.trim().length === 0) {
    return { name, reason: 'is not set' };
  }
  const v = value.trim();
  if (v.length < MIN_SECRET_CHARS) {
    return { name, reason: `is ${v.length} characters; at least ${MIN_SECRET_CHARS} are required` };
  }
  const lower = v.toLowerCase();
  const hit = BANNED_FRAGMENTS.find(f => lower.includes(f));
  if (hit) {
    return { name, reason: `contains "${hit}", which makes it guessable — use a random value` };
  }
  // A long string of one repeated character clears the length bar and nothing
  // else. ~3 bits/char is well below random base64 (~6) but above any
  // hand-written phrase we would want to accept.
  if (shannonBits(v) < v.length * 3) {
    return { name, reason: 'has too little entropy — generate it with `openssl rand -base64 48`' };
  }
  return null;
}

export interface BootConfig {
  jwtSecret?: string;
  csrfSecret?: string;
  corsOrigin?: string;
  nodeEnv?: string;
  databaseUrl?: string;
}

/**
 * Every reason this configuration must not serve real users, at once.
 *
 * Returned as a list rather than thrown one at a time so a misconfigured
 * deploy is fixed in one pass instead of six restarts.
 */
export function bootProblems(cfg: BootConfig): string[] {
  const isProd = cfg.nodeEnv === 'production';
  const problems: string[] = [];

  const jwt = checkSecret('JWT_SECRET', cfg.jwtSecret);
  if (jwt) problems.push(`${jwt.name} ${jwt.reason}`);

  // CSRF falls back to JWT_SECRET in the middleware. That works, but reusing
  // one key for two purposes means rotating either forces both.
  if (cfg.csrfSecret) {
    const csrf = checkSecret('CSRF_SECRET', cfg.csrfSecret);
    if (csrf) problems.push(`${csrf.name} ${csrf.reason}`);
    if (cfg.csrfSecret.trim() === cfg.jwtSecret?.trim()) {
      problems.push('CSRF_SECRET is identical to JWT_SECRET — use two independent values');
    }
  } else if (isProd) {
    problems.push('CSRF_SECRET is not set — it falls back to JWT_SECRET, which couples two unrelated rotations');
  }

  const origins = (cfg.corsOrigin ?? '').split(',').map(s => s.trim()).filter(Boolean);
  if (isProd) {
    if (origins.length === 0) {
      problems.push('CORS_ORIGIN is not set — the browser app will be refused');
    }
    // `*` with credentials is rejected by browsers anyway, but stating it here
    // turns a confusing runtime CORS failure into a clear startup message.
    if (origins.includes('*')) {
      problems.push('CORS_ORIGIN is "*", which cannot be combined with credentialed requests — list the real origins');
    }
    const insecure = origins.filter(o => o.startsWith('http://') && !o.includes('localhost') && !o.includes('127.0.0.1'));
    if (insecure.length > 0) {
      problems.push(`CORS_ORIGIN allows plain HTTP for ${insecure.join(', ')} — session cookies are Secure and will not be sent`);
    }
    if (!cfg.databaseUrl) {
      problems.push('DATABASE_URL is not set');
    } else if (!/sslmode=require|ssl=true/i.test(cfg.databaseUrl) && !/localhost|127\.0\.0\.1/.test(cfg.databaseUrl)) {
      problems.push('DATABASE_URL does not request TLS — append ?sslmode=require so credentials are not sent in the clear');
    }
  }

  return problems;
}

/** Throw with everything that is wrong, or return quietly. */
export function assertBootConfig(cfg: BootConfig): void {
  const problems = bootProblems(cfg);
  if (problems.length === 0) return;
  throw new Error(
    `Refusing to start — ${problems.length} configuration problem(s):\n` +
      problems.map(p => `  • ${p}`).join('\n') +
      '\n\nGenerate a strong secret with:  openssl rand -base64 48\n',
  );
}
