// Historify backend — production server runtime (Express + Socket.io).
// Run: npm run build && npm start   (or npm run dev for tsx watch mode)
import express, { type Request, type Response, type NextFunction } from 'express';
import { createServer } from 'node:http';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { crisisRouter } from './routes/crisis';
import { clioRouter } from './routes/clio';
import { authRouter } from './routes/auth';
import { syncRouter } from './routes/sync';
import { socialRouter } from './routes/social';
import { learningRouter } from './routes/learning';
import { bookmarksRouter } from './routes/bookmarks';
import { leaderboardRouter } from './routes/leaderboard';
import { imperiumRouter } from './routes/imperium';
import { reviewsPublicRouter, submitReviewHandler } from './routes/reviews';
import { giftsRouter } from './routes/gifts';
import { billingRouter, stripeWebhookHandler } from './routes/billing';
import { rateLimit } from './middleware/rateLimit';
import { issueCsrfCookie, requireCsrf } from './middleware/csrf';
import { logSecurityEvent } from './security/events';
import { presence } from './presence';

const prisma = new PrismaClient();

declare global {
  // Attached by the JWT middleware below.
  namespace Express {
    interface Request { auth?: { userId: string; tier: 'FREE' | 'BEGINNER' | 'PRO' | 'MASTER'; ver?: number } }
  }
}

const {
  PORT = '4000',
  JWT_SECRET = '',
  CORS_ORIGIN = 'http://localhost:5173',
  NODE_ENV = 'development',
} = process.env;

if (!JWT_SECRET) throw new Error('JWT_SECRET is required — set it in the environment.');

const app = express();
app.set('trust proxy', 1); // behind a reverse proxy / load balancer

// ── Security & parsing middleware ────────────────────────────────────────────
// HSTS is stated explicitly rather than left to the default: a year, covering
// subdomains, and preload-ready. Also disable x-powered-by and force nosniff.
app.use(helmet({
  hsts: { maxAge: 31_536_000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginResourcePolicy: { policy: 'same-site' },
}));
app.disable('x-powered-by');
// No static directory is served from this process, so there is no directory
// listing to expose. Stating it here so adding express.static later is a
// deliberate act that has to reckon with `index: false`.
app.use(cors({
  origin: CORS_ORIGIN.split(','),   // comma-separated allowlist, never '*' with credentials
  credentials: true,                 // cookie-session + Authorization headers cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Stripe webhook needs the raw request bytes for signature verification, so it
// is mounted BEFORE the JSON body parser (and takes no session auth — the HMAC
// signature is its authentication).
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

app.use(express.json({ limit: '256kb' }));
app.use(cookieParser());

// ── JWT authentication (httpOnly cookie or Authorization: Bearer) ───────────
function authenticate(req: Request, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const token = bearer ?? (req.cookies?.session as string | undefined);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string; tier: 'FREE' | 'BEGINNER' | 'PRO' | 'MASTER'; ver?: number;
    };
    req.auth = { userId: payload.sub, tier: payload.tier, ver: payload.ver ?? 0 };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

/**
 * Reject sessions minted before the account's current tokenVersion.
 *
 * A password change bumps that counter, so every token issued earlier — an
 * attacker's included — stops working. Runs after `authenticate` on the
 * routes that touch stored data; the DB read is the price of being able to
 * revoke a session at all, which a stateless JWT otherwise cannot do.
 */
async function requireCurrentSession(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth.userId },
      select: { tokenVersion: true },
    });
    if (!user) return res.status(401).json({ error: 'Account no longer exists.' });
    if ((req.auth.ver ?? 0) !== user.tokenVersion) {
      return res.status(401).json({ error: 'Session ended — please sign in again.' });
    }
    next();
  } catch {
    res.status(503).json({ error: 'Session check unavailable.' });
  }
}

// ── Tier gating (server-side twin of the client PlanGate HOC) ────────────────
// The JWT carries the tier it had at login, so a user who upgrades mid-session
// still holds a FREE-tier token. When the claim is insufficient, re-check the
// database before denying — a Stripe upgrade takes effect immediately without
// forcing a re-login, while the cheap JWT pass still handles the common case.
function requireTier(tier: 'PRO' | 'MASTER') {
  const rank = { FREE: 0, BEGINNER: 1, PRO: 2, MASTER: 3 } as const;
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ error: 'Authentication required.' });
    if (rank[req.auth.tier] >= rank[tier]) return next();
    try {
      const fresh = await prisma.user.findUnique({ where: { id: req.auth.userId }, select: { tier: true } });
      if (fresh && rank[fresh.tier] >= rank[tier]) {
        req.auth.tier = fresh.tier;
        return next();
      }
    } catch { /* fall through to denial */ }
    res.status(403).json({ error: `${tier === 'MASTER' ? 'Master Student' : 'Pro Learner'} plan required.` });
  };
}

// ── Rate limits ──────────────────────────────────────────────────────────────
// Two rings: a broad per-user/IP API cap, and a tight ring around the
// credential endpoints (the only surface worth brute-forcing).
app.use('/api/', rateLimit({ windowMs: 60_000, max: 240, scope: 'API' }));
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60_000, max: 20, scope: 'login' }));
app.use('/api/auth/register', rateLimit({ windowMs: 60 * 60_000, max: 10, scope: 'registration' }));
// Password reset is its own brute-force and mail-flood surface: unlimited
// requests let an attacker bombard a victim's inbox, and unlimited confirms
// let them grind tokens.
app.use('/api/auth/password-reset/request', rateLimit({ windowMs: 60 * 60_000, max: 5, scope: 'password reset' }));
app.use('/api/auth/password-reset/confirm', rateLimit({ windowMs: 15 * 60_000, max: 10, scope: 'password reset' }));
app.use('/api/auth/password', rateLimit({ windowMs: 15 * 60_000, max: 10, scope: 'password change' }));

// ── CSRF ─────────────────────────────────────────────────────────────────────
// Hand out the token to anyone, require it on every state-changing cookie-auth
// request. Mounted after the body parser so req.cookies is populated.
app.use(issueCsrfCookie);
app.use('/api/', requireCsrf(req => logSecurityEvent(req, 'csrf_rejected')));

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/healthz', (_req, res) => res.json({ ok: true }));
// register / login / logout / password-reset are public by necessity — they
// run before a session exists. Everything else on the auth router acts on the
// signed-in account, so it needs both a valid session and a CURRENT one:
// changing your password must not be reachable with a token the change was
// meant to revoke.
app.use('/api/auth/me', authenticate);
app.use('/api/auth/password', authenticate, requireCurrentSession);
app.use('/api/auth/sessions', authenticate, requireCurrentSession);
app.use('/api/auth/logout', (req, res, next) => {
  // Best-effort identification for the audit log; logging out with an expired
  // token should still clear the cookie rather than 401.
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const token = bearer ?? (req.cookies?.session as string | undefined);
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { sub: string; tier: Request['auth'] extends undefined ? never : 'FREE' | 'BEGINNER' | 'PRO' | 'MASTER' };
      req.auth = { userId: payload.sub, tier: payload.tier };
    } catch { /* expired or invalid — still clear the cookie below */ }
  }
  next();
});
app.use('/api/auth', authRouter);
app.use('/api/sync', authenticate, requireCurrentSession, syncRouter);
app.use('/api/social', authenticate, requireCurrentSession, socialRouter);
// Learner memory / study plan / study sets. Tier-free by design: these sync
// existing client state — the AI calls that CREATE the content are the gated
// resource (clio proxy is PRO+), so a downgraded user keeps read/write access
// to material they already generated.
app.use('/api/learning', authenticate, requireCurrentSession, learningRouter);
app.use('/api/bookmarks', authenticate, requireCurrentSession, bookmarksRouter);
app.use('/api/leaderboard', authenticate, requireCurrentSession, leaderboardRouter);
app.use('/api/billing', authenticate, requireCurrentSession, billingRouter);
app.use('/api/gifts', authenticate, requireCurrentSession, giftsRouter);
app.use('/api/crisis', authenticate, requireCurrentSession, requireTier('MASTER'), crisisRouter);
app.use('/api/imperium', authenticate, requireCurrentSession, requireTier('MASTER'), imperiumRouter);
app.use('/api/clio', authenticate, requireCurrentSession, requireTier('PRO'), clioRouter);

// Public app reviews: anyone can read; posting requires a session.
app.put('/api/reviews', authenticate, submitReviewHandler);
app.use('/api/reviews', reviewsPublicRouter);

// Lightweight global presence stat (no auth) — for status pages / health.
app.get('/api/presence/count', (_req, res) => res.json({ online: presence.onlineCount() }));

// Central error handler — no stack traces in production responses.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: NODE_ENV === 'production' ? 'Internal server error.' : err.message });
});

// ── WebSocket layer: live cloud sync / future multiplayer ────────────────────
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: CORS_ORIGIN.split(','), credentials: true },
  // A socket frame bypasses the Express body-size limit entirely, so it needs
  // its own ceiling or the WebSocket becomes the unbounded ingest path.
  maxHttpBufferSize: 256 * 1024,
});

io.use((socket, next) => {
  // Same JWT, delivered via the socket handshake.
  const token = (socket.handshake.auth?.token as string | undefined)
    ?? socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return next(new Error('unauthorized'));
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; ver?: number };
    // Same revocation rule as the REST layer: a socket opened with a token
    // that predates a password change must not survive it.
    prisma.user
      .findUnique({ where: { id: payload.sub }, select: { tokenVersion: true } })
      .then(user => {
        if (!user || (payload.ver ?? 0) !== user.tokenVersion) return next(new Error('unauthorized'));
        socket.data.userId = payload.sub;
        next();
      })
      .catch(() => next(new Error('unauthorized')));
  } catch {
    next(new Error('unauthorized'));
  }
});

/** Cap anything relayed between clients — the server never trusts frame size. */
const MAX_RELAY_CHARS = 16 * 1024;
function tooLarge(payload: unknown): boolean {
  try { return JSON.stringify(payload ?? null).length > MAX_RELAY_CHARS; } catch { return true; }
}

// Notify a user's accepted friends of a presence change (online/offline).
async function broadcastPresence(userId: string, online: boolean) {
  try {
    const rows = await prisma.friendship.findMany({
      where: { OR: [{ aId: userId }, { bId: userId }] },
      select: { aId: true, bId: true },
    });
    const friendIds = rows.map(r => (r.aId === userId ? r.bId : r.aId));
    for (const fid of friendIds) io.to(`user:${fid}`).emit('presence', { userId, online });
  } catch (err) { console.error('presence broadcast failed', err); }
}

io.on('connection', socket => {
  const userId = socket.data.userId as string;
  // Each user gets a private room — the sync fan-out + direct-delivery target.
  const room = `user:${userId}`;
  void socket.join(room);

  // ── Presence: mark online, heartbeat lastSeen, tell friends ──
  const cameOnline = presence.add(userId, socket.id);
  prisma.user.update({ where: { id: userId }, data: { lastSeenAt: new Date() } }).catch(() => {});
  if (cameOnline) void broadcastPresence(userId, true);

  socket.on('heartbeat', () => {
    prisma.user.update({ where: { id: userId }, data: { lastSeenAt: new Date() } }).catch(() => {});
  });

  // Client pushes local state deltas; server rebroadcasts to the user's other
  // devices. Persisting to Postgres happens through the REST layer.
  socket.on('crisis:sync', (payload: unknown) => { if (!tooLarge(payload)) socket.to(room).emit('crisis:sync', payload); });
  socket.on('clio:sync', (payload: unknown) => { if (!tooLarge(payload)) socket.to(room).emit('clio:sync', payload); });
  socket.on('progress:sync', (payload: unknown) => { if (!tooLarge(payload)) socket.to(room).emit('progress:sync', payload); });
  socket.on('campaign:sync', (payload: unknown) => { if (!tooLarge(payload)) socket.to(room).emit('campaign:sync', payload); });

  // ── CHRONOS IMPERIUM (Part D): state-delta fan-out to the client pool ──
  // The resolving device persists through REST, then pushes the delta here;
  // every OTHER device of the same user receives it live and applies it to
  // its local campaign copy (turn advanced / rolled back / abandoned).
  socket.on('imperium:delta', (payload: { campaignId?: string; kind?: string }) => {
    if (!payload || typeof payload.campaignId !== 'string') return;
    socket.to(room).emit('imperium:delta', payload);
  });

  // ── Live direct messages: deliver to the recipient's room immediately ──
  socket.on('dm:send', (payload: { toId?: string; text?: string; id?: string }) => {
    if (!payload?.toId || typeof payload.text !== 'string') return;
    if (typeof payload.toId !== 'string' || payload.toId.length > 64) return;
    if (tooLarge(payload)) return;
    io.to(`user:${payload.toId}`).emit('dm:new', {
      id: payload.id, fromId: userId, text: payload.text.slice(0, 2000), createdAt: new Date().toISOString(),
    });
  });

  // ── Live duel signalling: challenge / accept / decline relayed to the peer ──
  socket.on('duel:challenge', (payload: { toId?: string; challengeId?: string }) => {
    if (!payload?.toId) return;
    io.to(`user:${payload.toId}`).emit('duel:incoming', { fromId: userId, challengeId: payload.challengeId });
  });
  socket.on('duel:respond', (payload: { toId?: string; accept?: boolean; challengeId?: string }) => {
    if (!payload?.toId) return;
    io.to(`user:${payload.toId}`).emit('duel:response', { fromId: userId, accept: !!payload.accept, challengeId: payload.challengeId });
  });

  socket.on('disconnect', () => {
    const wentOffline = presence.remove(userId, socket.id);
    if (wentOffline) {
      prisma.user.update({ where: { id: userId }, data: { lastSeenAt: new Date() } }).catch(() => {});
      void broadcastPresence(userId, false);
    }
  });
});

httpServer.listen(Number(PORT), () => {
  console.log(`Historify backend listening on :${PORT} (${NODE_ENV})`);
});

// ── Graceful shutdown: drain sockets, stop accepting, exit clean ─────────────
// Prevents dropped in-flight requests and socket leaks on rolling deploys.
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    console.log(`${signal} received — draining connections`);
    io.close(() => {
      httpServer.close(() => process.exit(0));
    });
    // Hard deadline so a stuck connection can't block the deploy.
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
