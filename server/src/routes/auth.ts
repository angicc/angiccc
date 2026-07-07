// Account endpoints: register, login, logout, whoami. Issues the same JWT the
// authenticate middleware and the socket handshake verify (sub + tier), both
// as an httpOnly cookie (browser clients) and in the response body (native /
// token-header clients).
import { Router, type Request, type Response } from 'express';
import { PrismaClient, Tier } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const SESSION_DAYS = 30;
const isProd = process.env.NODE_ENV === 'production';

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(128),
});
const registerSchema = credentialsSchema.extend({
  username: z.string().trim().min(2).max(32),
  language: z.enum(['en', 'es', 'ru', 'mk']).optional(),
});

function issueSession(res: Response, user: { id: string; tier: Tier }): string {
  const token = jwt.sign({ sub: user.id, tier: user.tier }, JWT_SECRET, { expiresIn: `${SESSION_DAYS}d` });
  res.cookie('session', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: SESSION_DAYS * 24 * 3600 * 1000,
  });
  return token;
}

const publicUser = (u: { id: string; email: string; username: string; tier: Tier; language: string; createdAt: Date }) =>
  ({ id: u.id, email: u.email, username: u.username, tier: u.tier, language: u.language, createdAt: u.createdAt });

// POST /api/auth/register
authRouter.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid registration payload.', issues: parsed.error.flatten().fieldErrors });
  const { email, password, username, language } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, username, passwordHash, language: language ?? 'en' } });
  const token = issueSession(res, user);
  res.status(201).json({ user: publicUser(user), token });
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid credentials payload.' });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  // Constant-shape failure: never reveal whether the email exists.
  const ok = user && await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });
  const token = issueSession(res, user);
  res.json({ user: publicUser(user), token });
});

// POST /api/auth/logout
authRouter.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('session', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
  res.json({ ok: true });
});

// GET /api/auth/me — requires the authenticate middleware upstream.
authRouter.get('/me', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) return res.status(404).json({ error: 'Account no longer exists.' });
  res.json({ user: publicUser(user) });
});
