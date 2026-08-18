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
| `/api/billing/status` | GET | session | Fresh tier + subscription/trial state |
| `/api/billing/checkout` | POST | session | Create Stripe Checkout session (`{plan:'pro'\|'master'}` → `{url}`) |
| `/api/billing/portal` | POST | session | Stripe customer portal (cancel / change plan / card) |
| `/api/billing/webhook` | POST | Stripe HMAC | Subscription lifecycle → flips `User.tier` in Postgres |
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

## Billing (Stripe)

Paid launch: every paid plan starts with a free trial (`TRIAL_DAYS`, default 5,
card collected up front, first charge when the trial ends). Setup:

1. In the Stripe dashboard create two recurring prices — Pro Learner $10/mo and
   Master Student $20/mo — and put their IDs in `STRIPE_PRICE_PRO` /
   `STRIPE_PRICE_MASTER`.
2. Set `STRIPE_SECRET_KEY`, `FRONTEND_URL`, and add a webhook endpoint pointing
   at `POST /api/billing/webhook` subscribed to `checkout.session.completed`,
   `customer.subscription.created/updated/deleted`, and
   `invoice.payment_failed`; put its signing secret in `STRIPE_WEBHOOK_SECRET`.
3. The webhook is the only writer of paid tiers: Stripe → HMAC-verified event →
   `User.tier` in Postgres. `past_due` keeps access while Stripe retries the
   card; a definitive cancellation drops the account to FREE. Tier gates
   re-check the DB when a JWT's tier claim is stale, so upgrades apply without
   re-login. No Stripe SDK is required — the server calls Stripe's REST API
   directly and verifies webhook signatures with `node:crypto`.

The frontend calls `/api/billing/checkout` when `VITE_API_URL` is set and
redirects to the returned Checkout URL; without a backend URL it falls back to
the local demo payment modal (no real charge).

## Deployment

Any Node host (Railway, Render, Fly.io, a VPS behind nginx). Set the env vars,
run `npm run prisma:migrate && npm start`. Terminate TLS at the proxy;
`trust proxy` is already enabled. Point the frontend's `/api/*` calls (and the
existing `/api/chat` AI proxy) at this origin, and add the origin to
`CORS_ORIGIN`.

## Security posture

Implemented in `server/src` and `netlify/`:

| Control | Where |
|---|---|
| HSTS (1 year, subdomains, preload-ready) | `netlify.toml` headers · `helmet({ hsts })` in `server/src/index.ts` |
| CSRF tokens (signed double-submit) | `server/src/middleware/csrf.ts` |
| Sessions reset on password change | `tokenVersion` on `User`; enforced by `requireCurrentSession` (REST) and the socket handshake |
| Reset links expire | `PasswordReset.expiresAt` (30 min), single-use via `usedAt`, token stored only as SHA-256 |
| No user enumeration | Register returns the same 202 for taken addresses; login always runs bcrypt; reset always returns the neutral message |
| Upload type allowlist | `server/src/security/uploads.ts` (magic-byte sniffing) · client mirror in `src/features/uploads/imageUpload.ts` |
| Payment webhooks verified | HMAC-SHA256 over the raw body, `server/src/services/stripe.ts` |
| Prices set server-side | `priceIdFor()` resolves env price IDs; the client only names a plan |
| Prompt-injection filtering | `netlify/edge-functions/chat.ts` |
| AI usage capped | Model allowlist, `max_tokens` ceiling, message count/length caps, per-IP rate limit (same file) |
| Request size limits | `express.json({ limit: '256kb' })`, edge-function body cap, `maxHttpBufferSize` on Socket.io |
| Password-reset rate limiting | `server/src/index.ts` rate-limit ring |
| Input sanitised before storage | Zod schemas on every route body; relayed socket payloads size-capped; DM text truncated server-side |
| CORS locked down | Explicit origin allowlist, `credentials: true`, never `*` |
| No directory listing | No `express.static` is mounted |
| No default admin route | No `/admin` surface exists |
| Account lockout | 8 failed logins → 15-minute lock (`failedLoginCount`, `lockedUntil`) |
| Security event logging | `SecurityEvent` model + `server/src/security/events.ts` |
| Secure cookie flags | `httpOnly`, `secure` in production, `sameSite`, scoped `path` |
| Restricted DB permissions | Deployment step — see below |

### Deploying these changes

The schema gained `tokenVersion`, `failedLoginCount`, `lockedUntil`,
`passwordChangedAt`, and the `PasswordReset` / `SecurityEvent` tables. Apply
them before starting the new server build:

```bash
cd server
npx prisma generate
npx prisma db push        # or: npx prisma migrate dev --name security-hardening
```

Set `CSRF_SECRET` in the server environment. It falls back to `JWT_SECRET` if
unset, which works but ties the two secrets together — prefer a separate value.

**Database permissions** are granted outside the app, and the application role
should not own its schema:

```sql
-- The role the app connects as needs data access, never DDL.
REVOKE ALL ON SCHEMA public FROM historify_app;
GRANT USAGE ON SCHEMA public TO historify_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO historify_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO historify_app;
-- Migrations run as a separate owner role, not as historify_app.
```
