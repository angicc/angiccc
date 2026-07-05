// Historify backend — production server runtime (Express + Socket.io).
// Run: npm run build && npm start   (or npm run dev for tsx watch mode)
import express, { type Request, type Response, type NextFunction } from 'express';
import { createServer } from 'node:http';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import { crisisRouter } from './routes/crisis';
import { clioRouter } from './routes/clio';

declare global {
  // Attached by the JWT middleware below.
  namespace Express {
    interface Request { auth?: { userId: string; tier: 'FREE' | 'PRO' | 'MASTER' } }
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
app.use(helmet());
app.use(cors({
  origin: CORS_ORIGIN.split(','),   // comma-separated allowlist, never '*' with credentials
  credentials: true,                 // cookie-session + Authorization headers cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '256kb' }));
app.use(cookieParser());

// ── JWT authentication (httpOnly cookie or Authorization: Bearer) ───────────
function authenticate(req: Request, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const token = bearer ?? (req.cookies?.session as string | undefined);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; tier: 'FREE' | 'PRO' | 'MASTER' };
    req.auth = { userId: payload.sub, tier: payload.tier };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

// ── Tier gating (server-side twin of the client PlanGate HOC) ────────────────
function requireTier(tier: 'PRO' | 'MASTER') {
  const rank = { FREE: 0, PRO: 1, MASTER: 2 } as const;
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || rank[req.auth.tier] < rank[tier]) {
      return res.status(403).json({ error: `${tier === 'MASTER' ? 'Master Student' : 'Pro Learner'} plan required.` });
    }
    next();
  };
}

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/healthz', (_req, res) => res.json({ ok: true }));
app.use('/api/crisis', authenticate, requireTier('MASTER'), crisisRouter);
app.use('/api/clio', authenticate, requireTier('PRO'), clioRouter);

// Central error handler — no stack traces in production responses.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: NODE_ENV === 'production' ? 'Internal server error.' : err.message });
});

// ── WebSocket layer: live cloud sync / future multiplayer ────────────────────
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: CORS_ORIGIN.split(','), credentials: true },
});

io.use((socket, next) => {
  // Same JWT, delivered via the socket handshake.
  const token = (socket.handshake.auth?.token as string | undefined)
    ?? socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return next(new Error('unauthorized'));
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    socket.data.userId = payload.sub;
    next();
  } catch {
    next(new Error('unauthorized'));
  }
});

io.on('connection', socket => {
  // Each user gets a private room — the sync fan-out target for their devices.
  const room = `user:${socket.data.userId}`;
  void socket.join(room);

  // Client pushes local state deltas; server rebroadcasts to the user's other
  // devices. Persisting to Postgres happens through the REST layer.
  socket.on('crisis:sync', (payload: unknown) => socket.to(room).emit('crisis:sync', payload));
  socket.on('clio:sync', (payload: unknown) => socket.to(room).emit('clio:sync', payload));
});

httpServer.listen(Number(PORT), () => {
  console.log(`Historify backend listening on :${PORT} (${NODE_ENV})`);
});
