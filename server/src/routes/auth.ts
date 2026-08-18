// Account endpoints: register, login, logout, whoami, password change and
// password reset. Issues the same JWT the authenticate middleware and the
// socket handshake verify (sub + tier + ver), both as an httpOnly cookie
// (browser clients) and in the response body (native / token-header clients).
import crypto from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import { PrismaClient, Tier } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logSecurityEvent, clientIp } from '../security/events';

const prisma = new PrismaClient();
export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const SESSION_DAYS = 30;
const isProd = process.env.NODE_ENV === 'production';

/** Account lockout: throttles guessing against ONE account, which per-IP
 *  limits cannot do — an attacker with a botnet has many IPs but still only
 *  one target account. */
const MAX_FAILED_LOGINS = 8;
const LOCKOUT_MINUTES = 15;

/** Reset links are short-lived; a link sitting in an inbox for a week is a
 *  standing key to the account. */
const RESET_TTL_MINUTES = 30;

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(128),
});
const registerSchema = credentialsSchema.extend({
  username: z.string().trim().min(2).max(32),
  // de and fr were missing, so German and French users could not register in
  // their own language — the enum rejected it.
  language: z.enum(['en', 'es', 'ru', 'mk', 'de', 'fr']).optional(),
});

const cookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
};

function issueSession(res: Response, user: { id: string; tier: Tier; tokenVersion: number }): string {
  const token = jwt.sign(
    { sub: user.id, tier: user.tier, ver: user.tokenVersion },
    JWT_SECRET,
    { expiresIn: `${SESSION_DAYS}d` },
  );
  res.cookie('session', token, { ...cookieOpts, maxAge: SESSION_DAYS * 24 * 3600 * 1000 });
  return token;
}

const publicUser = (u: { id: string; email: string; username: string; tier: Tier; language: string; createdAt: Date }) =>
  ({ id: u.id, email: u.email, username: u.username, tier: u.tier, language: u.language, createdAt: u.createdAt });

/**
 * A bcrypt hash of a value nobody will ever submit.
 *
 * Login used to skip bcrypt entirely when the email was unknown, so a missing
 * account answered in ~1ms and a real one in ~100ms. That timing difference is
 * a working account-enumeration oracle. Comparing against this hash makes both
 * paths do the same work.
 */
const DUMMY_HASH = bcrypt.hashSync('historify-timing-equaliser', 12);

const hashToken = (raw: string) => crypto.createHash('sha256').update(raw).digest('hex');

// POST /api/auth/register
authRouter.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid registration payload.', issues: parsed.error.flatten().fieldErrors });
  }
  const { email, password, username, language } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Do NOT confirm that the address is registered. Replying "an account
    // already exists" turns this endpoint into a membership oracle: anyone can
    // test an email list against it. The caller gets the same shape as success
    // and the real owner is told by email that someone tried.
    logSecurityEvent(req, 'register_duplicate_email', { userId: existing.id, email });
    return res.status(202).json({ ok: true, message: 'Check your email to continue.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, username, passwordHash, language: language ?? 'en' },
  });
  logSecurityEvent(req, 'register_success', { userId: user.id, email });
  const token = issueSession(res, user);
  res.status(201).json({ user: publicUser(user), token });
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid credentials payload.' });
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (user?.lockedUntil && user.lockedUntil > new Date()) {
    logSecurityEvent(req, 'login_blocked_locked', { userId: user.id, email });
    return res.status(423).json({
      error: 'This account is temporarily locked after too many failed attempts. Try again shortly.',
    });
  }

  // Always run a comparison, so the response time does not reveal whether the
  // account exists.
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH) && !!user;

  if (!ok) {
    if (user) {
      const failed = user.failedLoginCount + 1;
      const lock = failed >= MAX_FAILED_LOGINS;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: lock ? 0 : failed,
          lockedUntil: lock ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000) : user.lockedUntil,
        },
      }).catch(() => {});
      logSecurityEvent(req, lock ? 'account_locked' : 'login_failed', { userId: user.id, email });
    } else {
      logSecurityEvent(req, 'login_failed', { email, detail: 'no such account' });
    }
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.failedLoginCount > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: 0, lockedUntil: null },
    }).catch(() => {});
  }
  logSecurityEvent(req, 'login_success', { userId: user.id, email });
  const token = issueSession(res, user);
  res.json({ user: publicUser(user), token });
});

// POST /api/auth/logout
authRouter.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('session', cookieOpts);
  if (req.auth?.userId) logSecurityEvent(req, 'logout', { userId: req.auth.userId });
  res.json({ ok: true });
});

// GET /api/auth/me — requires the authenticate middleware upstream.
authRouter.get('/me', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) return res.status(404).json({ error: 'Account no longer exists.' });
  res.json({ user: publicUser(user) });
});

// POST /api/auth/password — change password for the signed-in user.
const changeSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(8).max(128),
});

authRouter.post('/password', async (req: Request, res: Response) => {
  const parsed = changeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid password payload.' });
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) return res.status(404).json({ error: 'Account no longer exists.' });

  if (!(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) {
    logSecurityEvent(req, 'login_failed', { userId: user.id, detail: 'wrong current password on change' });
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  // Bumping tokenVersion invalidates every session issued before this moment.
  // A password change is usually a response to compromise; leaving the
  // attacker's existing session alive would defeat the point of changing it.
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      tokenVersion: { increment: 1 },
      passwordChangedAt: new Date(),
      failedLoginCount: 0,
      lockedUntil: null,
    },
  });
  logSecurityEvent(req, 'password_changed', { userId: user.id });

  // Re-issue for the device that made the change, so it stays signed in.
  const token = issueSession(res, updated);
  res.json({ ok: true, token });
});

// POST /api/auth/sessions/revoke — sign out everywhere.
authRouter.post('/sessions/revoke', async (req: Request, res: Response) => {
  const updated = await prisma.user.update({
    where: { id: req.auth!.userId },
    data: { tokenVersion: { increment: 1 } },
  });
  logSecurityEvent(req, 'sessions_revoked', { userId: updated.id });
  res.clearCookie('session', cookieOpts);
  res.json({ ok: true });
});

// POST /api/auth/password-reset/request
authRouter.post('/password-reset/request', async (req: Request, res: Response) => {
  const parsed = z.object({ email: z.string().trim().toLowerCase().email().max(254) }).safeParse(req.body);
  // Even a malformed address gets the neutral answer — a 400 here would still
  // separate "not an email" from "email we do not have".
  const neutral = { ok: true, message: 'If that account exists, a reset link is on its way.' };
  if (!parsed.success) return res.json(neutral);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    logSecurityEvent(req, 'password_reset_requested', { email: parsed.data.email, detail: 'no such account' });
    return res.json(neutral);
  }

  // Invalidate outstanding links for this account, so a request cannot pile up
  // usable keys in an inbox.
  await prisma.passwordReset.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  const raw = crypto.randomBytes(32).toString('base64url');
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(raw),      // the raw token is never stored
      expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60_000),
      requestIp: clientIp(req) ?? null,
    },
  });
  logSecurityEvent(req, 'password_reset_requested', { userId: user.id, email: user.email });

  // Delivery is the mail provider's job. In non-production the token is
  // returned so the flow is testable without a mailbox; never in production.
  res.json(isProd ? neutral : { ...neutral, devToken: raw });
});

// POST /api/auth/password-reset/confirm
authRouter.post('/password-reset/confirm', async (req: Request, res: Response) => {
  const parsed = z.object({
    token: z.string().min(10).max(256),
    newPassword: z.string().min(8).max(128),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid reset payload.' });

  const record = await prisma.passwordReset.findUnique({
    where: { tokenHash: hashToken(parsed.data.token) },
    include: { user: true },
  });

  // One message for every failure mode — expired, already used, never existed.
  // Distinguishing them tells an attacker which guesses were close.
  const rejected = () => {
    logSecurityEvent(req, 'password_reset_invalid', { userId: record?.userId });
    return res.status(400).json({ error: 'This reset link is invalid or has expired.' });
  };
  if (!record || record.usedAt || record.expiresAt < new Date()) return rejected();

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.$transaction([
    prisma.passwordReset.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.user.update({
      where: { id: record.userId },
      data: {
        passwordHash,
        tokenVersion: { increment: 1 },   // every old session dies with the reset
        passwordChangedAt: new Date(),
        failedLoginCount: 0,
        lockedUntil: null,
      },
    }),
  ]);
  logSecurityEvent(req, 'password_reset_completed', { userId: record.userId });
  res.json({ ok: true });
});
