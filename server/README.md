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
| `/api/social/friends` | GET/POST | session | Friends with live online status / add friend |
| `/api/social/online` | GET | session | Which of my friends are online now |
| `/api/social/messages/:friendId` | GET | session | Durable DM thread (marks incoming read) |
| `/api/social/messages` | POST | session | Persist a DM (socket relays it live) |
| `/api/social/duel/challenge` | POST | session | Record a History 1v1 challenge |
| `/api/social/duel/pending` | GET | session | Challenges awaiting my response |
| `/api/social/duel/respond` | POST | session | Accept / decline a challenge |
| `/api/presence/count` | GET | — | Global online-user count (status pages) |
| `/api/crisis/reset` | POST | Master | Transactional reset: drop decision log, re-init baseline metrics |
| `/api/crisis/:crisisId` | GET | Master | Fetch (or lazily create) the active run state |
| `/api/crisis/step` | POST | Master | Validate one engine node (zod), mutate the resource vector, persist |
| `/api/clio/history` | GET | Pro | Session list for the sidebar |
| `/api/clio/history/:id` | GET | Pro | Full thread for context re-injection |
| `/api/clio/message` | POST | Pro | Append a turn; auto-creates/titles sessions |
| `/api/clio/history/:id` | DELETE | Pro | Remove a thread |

WebSocket (`socket.io`): JWT handshake → per-user room. Sync events
(`crisis:sync` / `clio:sync` / `progress:sync` / `campaign:sync`) fan out
state deltas to the user's other devices.

**Presence & social (online servers):** on connect a user is added to an
in-memory presence registry and their friends receive a `presence`
`{ userId, online }` event; `disconnect` emits the offline transition. Live
social events: `dm:send` → `dm:new` (direct messages), `duel:challenge` →
`duel:incoming`, and `duel:respond` → `duel:response` are relayed to the peer's
room. Clients send `heartbeat` to refresh `lastSeenAt`. For horizontal scaling,
back the presence registry with Redis and add the socket.io Redis adapter so
presence and relays span nodes.

## Deployment

Any Node host (Railway, Render, Fly.io, a VPS behind nginx). Set the env vars,
run `npm run prisma:migrate && npm start`. Terminate TLS at the proxy;
`trust proxy` is already enabled. Point the frontend's `/api/*` calls (and the
existing `/api/chat` AI proxy) at this origin, and add the origin to
`CORS_ORIGIN`.
