// ─── Server-backed accounts ──────────────────────────────────────────────────
// The client kept its entire user table in localStorage: accounts, and an
// unsalted SHA-256 of the password, in the browser. Nothing ever called the
// server's /api/auth/* routes — which have bcrypt, account lockout, session
// revocation and reset tokens sitting unused behind them.
//
// That is why the social layer could not be online. Every /api/social/* route
// requires a session; a browser that never logs in has none, so friends, DMs
// and presence had no choice but to be local fixtures.
//
// This module is the seam. When `VITE_API_URL` is configured, accounts live on
// the server and the session is an httpOnly cookie the page cannot read (so an
// XSS cannot steal it). When it is not configured — local dev, preview builds,
// the offline demo — `serverAuthConfigured()` is false and AuthContext keeps
// its local accounts, unchanged.
//
// Passwords are never stored, hashed or transformed here: they go to the
// server over HTTPS and bcrypt happens there. The local path still hashes
// client-side because there is nowhere else for it to happen.

import { apiConfigured, apiFetch, invalidateCsrfToken } from './apiClient';

export function serverAuthConfigured(): boolean {
  return apiConfigured();
}

export interface ServerAccount {
  id: string;
  email: string;
  username: string;
  tier: 'FREE' | 'BEGINNER' | 'PRO' | 'MASTER';
  language: string;
  createdAt: string;
}

export type AuthOutcome =
  | { ok: true; user: ServerAccount }
  /** The server answered, and said no. `error` is safe to show the learner. */
  | { ok: false; error: string; status: number }
  /** No backend configured, or it could not be reached — fall back to local. */
  | { ok: false; unavailable: true };

const UNAVAILABLE: AuthOutcome = { ok: false, unavailable: true };

function call(path: string, body?: unknown): Promise<Response | null> {
  return apiFetch(path, { method: body === undefined ? 'GET' : 'POST', body });
}

async function outcome(res: Response | null): Promise<AuthOutcome> {
  if (!res) return UNAVAILABLE;
  const data = await res.json().catch(() => ({} as Record<string, unknown>));
  if (res.ok) {
    const user = (data as { user?: ServerAccount }).user;
    return user ? { ok: true, user } : UNAVAILABLE;
  }
  // 5xx is the server failing, not the learner being wrong — treat it as
  // unavailable so the caller can fall back rather than showing "try again"
  // for something the learner cannot fix.
  if (res.status >= 500) return UNAVAILABLE;
  return {
    ok: false,
    status: res.status,
    error: (data as { error?: string }).error ?? 'Something went wrong. Please try again.',
  };
}

/** The session this browser already holds, if any. */
export async function fetchSession(): Promise<ServerAccount | null> {
  const res = await call('/api/auth/me');
  if (!res?.ok) return null;
  const data = await res.json().catch(() => ({}));
  return (data as { user?: ServerAccount }).user ?? null;
}

export async function serverLogin(email: string, password: string): Promise<AuthOutcome> {
  return outcome(await call('/api/auth/login', { email, password }));
}

/**
 * Register.
 *
 * The server answers 202 with no user for an email that already exists — it
 * refuses to confirm membership, so this endpoint cannot be used to test an
 * email list. That is deliberate on the server side, and it means "registered
 * successfully" and "that address is taken" are indistinguishable here. Say
 * the neutral thing rather than guessing which happened.
 */
export async function serverRegister(
  username: string, email: string, password: string, language: string,
): Promise<AuthOutcome | { ok: false; pending: true; message: string }> {
  const res = await call('/api/auth/register', { username, email, password, language });
  if (!res) return UNAVAILABLE;
  if (res.status === 202) {
    const data = await res.json().catch(() => ({}));
    return {
      ok: false,
      pending: true,
      message: (data as { message?: string }).message ?? 'Check your email to continue.',
    };
  }
  return outcome(res);
}

export async function serverLogout(): Promise<void> {
  await call('/api/auth/logout', {});
  // The next session gets a new CSRF cookie; keeping the old token cached
  // would 403 the first write after signing back in.
  invalidateCsrfToken();
}

export async function serverChangePassword(
  currentPassword: string, newPassword: string,
): Promise<AuthOutcome | { ok: true }> {
  const res = await call('/api/auth/password', { currentPassword, newPassword });
  if (!res) return UNAVAILABLE;
  if (res.ok) return { ok: true };
  return outcome(res);
}
