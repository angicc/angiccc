// ─── CSRF protection (signed double-submit cookie) ────────────────────────────
// Sessions are carried in a cookie, and in production that cookie is
// SameSite=None so the SPA can call the API cross-origin. SameSite=None means
// the browser attaches it to cross-site requests too — which is exactly the
// condition CSRF needs. Without a token, any page on the internet could POST
// to our API and the browser would helpfully authenticate it.
//
// The scheme: a readable `csrf` cookie holds `<random>.<hmac>`, and the client
// echoes the value in an `X-CSRF-Token` header. An attacker's page can cause
// the cookie to be SENT but cannot READ it (that would need our origin), so it
// cannot produce the matching header. The HMAC means a forged cookie planted
// by a subdomain is rejected too — plain double-submit is vulnerable to that.
import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

const SECRET = process.env.CSRF_SECRET || process.env.JWT_SECRET || '';
const COOKIE = 'csrf';
const HEADER = 'x-csrf-token';
const TOKEN_BYTES = 32;
const MAX_AGE_MS = 12 * 3600 * 1000;

/** Methods that cannot change state, so cannot be worth forging. */
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Endpoints that legitimately have no cookie session to abuse:
 *  - login/register/reset run BEFORE a session exists, and are protected by
 *    rate limits and account lockout instead;
 *  - the Stripe webhook is authenticated by its HMAC signature and is called
 *    by Stripe, which has no cookies of ours.
 */
const EXEMPT = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/password-reset/request',
  '/api/auth/password-reset/confirm',
  '/api/billing/webhook',
];

function sign(value: string): string {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

function mint(): string {
  const value = crypto.randomBytes(TOKEN_BYTES).toString('hex');
  return `${value}.${sign(value)}`;
}

function valid(token: string | undefined): boolean {
  if (!token) return false;
  const [value, mac] = token.split('.');
  if (!value || !mac) return false;
  const expected = sign(value);
  // Both are hex of the same length, so timingSafeEqual is safe to call.
  if (mac.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(mac, 'utf8'), Buffer.from(expected, 'utf8'));
}

/**
 * Issue the CSRF cookie when the caller does not have a valid one. Readable by
 * JavaScript BY DESIGN — the client has to echo it into a header, which is the
 * half an attacker's origin cannot do.
 */
export function issueCsrfCookie(req: Request, res: Response, next: NextFunction) {
  const existing = req.cookies?.[COOKIE] as string | undefined;
  if (!valid(existing)) {
    res.cookie(COOKIE, mint(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: MAX_AGE_MS,
      path: '/',
    });
  }
  next();
}

/** Reject state-changing requests whose header does not match a signed cookie. */
export function requireCsrf(onReject?: (req: Request) => void) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (SAFE_METHODS.has(req.method)) return next();
    if (EXEMPT.some(p => req.path === p || req.originalUrl.startsWith(p))) return next();

    // Bearer-token callers (native apps, scripts) are not cookie-driven, so
    // there is no ambient credential for a third-party page to ride on.
    if (req.headers.authorization?.startsWith('Bearer ')) return next();

    const cookie = req.cookies?.[COOKIE] as string | undefined;
    const header = req.headers[HEADER] as string | undefined;
    if (!valid(cookie) || !header || header !== cookie) {
      onReject?.(req);
      return res.status(403).json({ error: 'Invalid or missing CSRF token.' });
    }
    next();
  };
}

export const CSRF_COOKIE_NAME = COOKIE;
export const CSRF_HEADER_NAME = HEADER;
