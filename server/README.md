# Historify Backend

Standalone Express + Prisma + Socket.io service. Lives outside the Vite build;
the frontend keeps working on localStorage until it is pointed here.

## Setup

1. `cd server && npm install`
2. `cp .env.example .env` and fill in `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `ANTHROPIC_API_KEY`
3. `npx prisma migrate dev --name init` (creates tables from `prisma/schema.prisma`)
4. `npm run dev` (development) or `npm run build && npm start` (production)

## Surface

| Route | Method | Gate | Purpose |
|---|---|---|---|
| `/healthz` | GET | — | Liveness probe |
| `/api/auth/register` | POST | — | Create account (bcrypt), issue JWT session |
| `/api/auth/login` | POST | — | Verify credentials, issue JWT session |
| `/api/auth/logout` | POST | — | Clear the session cookie |
| `/api/auth/me` | GET | session | Current account profile |
| `/api/sync/progress` | GET/PUT | session | Whole-blob learning-progress sync |
| `/api/sync/campaign` | GET/PUT | session | Territory Conquest Campaign sync |
| `/api/crisis/reset` | POST | Master | Transactional reset: drop decision log, re-init baseline metrics |
| `/api/crisis/:crisisId` | GET | Master | Fetch (or lazily create) the active run state |
| `/api/crisis/step` | POST | Master | Validate one engine node (zod), mutate the resource vector, persist |
| `/api/clio/history` | GET | Pro | Session list for the sidebar |
| `/api/clio/history/:id` | GET | Pro | Full thread for context re-injection |
| `/api/clio/message` | POST | Pro | Append a turn; auto-creates/titles sessions |
| `/api/clio/history/:id` | DELETE | Pro | Remove a thread |

WebSocket (`socket.io`): JWT handshake → per-user room → `crisis:sync` /
`clio:sync` / `progress:sync` / `campaign:sync` events fan out state deltas
to the user's other devices.

## Deployment

Any Node host (Railway, Render, Fly.io, a VPS behind nginx). Set the env vars,
run `npm run prisma:migrate && npm start`. Terminate TLS at the proxy;
`trust proxy` is already enabled. Point the frontend's `/api/*` calls (and the
existing `/api/chat` AI proxy) at this origin, and add the origin to
`CORS_ORIGIN`.
