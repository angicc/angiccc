import { describe, it, expect } from 'vitest';
import { checkSecret, bootProblems } from '../../server/src/security/bootChecks';

const STRONG = 'k9Qw3tZr7Yb1Xn5Lm8Vp2Hj4Dg6Fs0Ac';           // 32 random chars
const STRONG2 = 'Pq7Wz2Nx9Kd4Rb8Tv1Gm5Jc3Hy6Le0Us';

/**
 * The old gate was `if (!JWT_SECRET) throw`, which accepts "secret". A
 * guessable signing key is not a weaker version of a good one — it is total
 * compromise: anyone can brute-force it offline from one issued token and then
 * mint sessions for any account at any tier, and nothing in the logs shows it.
 */
describe('server boot checks', () => {
  it('rejects an unset or short secret', () => {
    expect(checkSecret('JWT_SECRET', undefined)?.reason).toMatch(/not set/);
    expect(checkSecret('JWT_SECRET', '')?.reason).toMatch(/not set/);
    expect(checkSecret('JWT_SECRET', 'secret')?.reason).toMatch(/characters/);
    expect(checkSecret('JWT_SECRET', 'a'.repeat(31))?.reason).toMatch(/characters/);
  });

  it('rejects long-but-guessable secrets', () => {
    // Long enough to pass a naive length check, and in every wordlist.
    expect(checkSecret('JWT_SECRET', 'changeme-changeme-changeme-changeme')).not.toBeNull();
    expect(checkSecret('JWT_SECRET', 'this-is-my-super-secret-password-1')).not.toBeNull();
    expect(checkSecret('JWT_SECRET', 'your-secret-key-goes-right-here-ok')).not.toBeNull();
  });

  it('rejects a long string with no entropy', () => {
    expect(checkSecret('JWT_SECRET', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')?.reason).toMatch(/entropy/);
    expect(checkSecret('JWT_SECRET', 'ababababababababababababababababab')?.reason).toMatch(/entropy/);
  });

  it('accepts a properly random secret', () => {
    expect(checkSecret('JWT_SECRET', STRONG)).toBeNull();
  });

  it('passes a correct production configuration', () => {
    expect(bootProblems({
      jwtSecret: STRONG, csrfSecret: STRONG2,
      corsOrigin: 'https://historify.app,https://www.historify.app',
      nodeEnv: 'production',
      databaseUrl: 'postgresql://u:p@db.example.com:5432/historify?sslmode=require',
    })).toEqual([]);
  });

  it('refuses production without CORS, or with a wildcard', () => {
    const base = { jwtSecret: STRONG, csrfSecret: STRONG2, nodeEnv: 'production', databaseUrl: 'postgresql://x?sslmode=require' };
    expect(bootProblems({ ...base, corsOrigin: '' }).join(' ')).toMatch(/CORS_ORIGIN is not set/);
    // '*' cannot be combined with credentialed requests; browsers reject it and
    // the resulting CORS error is far harder to read than this message.
    expect(bootProblems({ ...base, corsOrigin: '*' }).join(' ')).toMatch(/cannot be combined/);
  });

  it('refuses a plain-HTTP production origin', () => {
    // Session cookies are Secure, so they are simply never sent over http://.
    const out = bootProblems({
      jwtSecret: STRONG, csrfSecret: STRONG2, corsOrigin: 'http://historify.app',
      nodeEnv: 'production', databaseUrl: 'postgresql://x?sslmode=require',
    });
    expect(out.join(' ')).toMatch(/plain HTTP/);
  });

  it('allows http on localhost during development', () => {
    expect(bootProblems({
      jwtSecret: STRONG, csrfSecret: STRONG2,
      corsOrigin: 'http://localhost:5173', nodeEnv: 'development',
    })).toEqual([]);
  });

  it('requires a TLS database connection in production', () => {
    const out = bootProblems({
      jwtSecret: STRONG, csrfSecret: STRONG2, corsOrigin: 'https://historify.app',
      nodeEnv: 'production', databaseUrl: 'postgresql://u:p@db.example.com:5432/historify',
    });
    expect(out.join(' ')).toMatch(/does not request TLS/);
  });

  it('refuses to reuse one secret for two purposes', () => {
    const out = bootProblems({
      jwtSecret: STRONG, csrfSecret: STRONG, corsOrigin: 'https://historify.app',
      nodeEnv: 'production', databaseUrl: 'postgresql://x?sslmode=require',
    });
    expect(out.join(' ')).toMatch(/identical to JWT_SECRET/);
  });

  it('reports every problem at once, not one per restart', () => {
    const out = bootProblems({ jwtSecret: 'short', corsOrigin: '', nodeEnv: 'production' });
    expect(out.length).toBeGreaterThan(2);
  });
});
