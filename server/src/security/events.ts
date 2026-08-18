// ─── Security event log ───────────────────────────────────────────────────────
// An append-only trail of who did what to an account. Without it, a compromise
// leaves nothing to reconstruct: no way to tell a legitimate password change
// from an attacker's, or to spot the fifty failed logins that preceded it.
//
// Records the OUTCOME and the actor, never the credential. Nothing here should
// ever contain a password, a token, or a reset link.
import type { Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type SecurityEventType =
  | 'login_success'
  | 'login_failed'
  | 'login_blocked_locked'
  | 'account_locked'
  | 'register_success'
  | 'register_duplicate_email'
  | 'logout'
  | 'password_changed'
  | 'password_reset_requested'
  | 'password_reset_completed'
  | 'password_reset_invalid'
  | 'sessions_revoked'
  | 'csrf_rejected';

/** Client IP, honouring the proxy hop Express is configured to trust. */
export function clientIp(req: Request): string | undefined {
  return req.ip ?? (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim();
}

/**
 * Write an audit row. Never throws and never blocks the caller: a logging
 * failure must not turn a successful login into a 500, nor keep a failed one
 * from returning promptly.
 */
export function logSecurityEvent(
  req: Request,
  type: SecurityEventType,
  opts: { userId?: string; email?: string; detail?: string } = {},
): void {
  const ua = req.headers['user-agent'];
  prisma.securityEvent
    .create({
      data: {
        type,
        userId: opts.userId ?? null,
        email: opts.email ?? null,
        ip: clientIp(req) ?? null,
        userAgent: typeof ua === 'string' ? ua.slice(0, 512) : null,
        detail: opts.detail ?? null,
      },
    })
    .catch(err => {
      // Still surface it somewhere durable — stdout is collected by the host.
      console.error('[security] failed to persist event', type, err);
    });
}
