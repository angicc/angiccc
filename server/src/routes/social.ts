// ─── Social endpoints ─────────────────────────────────────────────────────────
// Friends, friend requests, direct messages, duels and the activity feed.
// Real-time delivery happens over sockets (see index.ts); these REST routes are
// the durable store and the initial hydration the client renders from.
//
// Three rules hold across every route here:
//
//   1. FRIENDSHIP IS CONSENSUAL. Adding someone opens a request they can
//      decline. The old POST /friends created the pair outright, so anyone
//      holding your id could make you their friend without being asked.
//   2. YOU MAY ONLY REACH YOUR FRIENDS. Messages and duel challenges are
//      refused unless an accepted friendship exists. Previously any authenticated
//      user could DM any user id in the database.
//   3. THE FEED IS REAL. Activity is read back out of the rows that recorded it
//      — friendships, messages, duels — never synthesised. The client keeps a
//      simulated feed for offline use and marks it as such; nothing invented
//      reaches this endpoint.
import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { presence } from '../presence';
import { rateLimit } from '../middleware/rateLimit';
import { notifyUser } from '../realtime';

const prisma = new PrismaClient();
export const socialRouter = Router();

/** Undirected friendship key: always stored and queried with the smaller id first. */
const pair = (x: string, y: string): [string, string] => (x < y ? [x, y] : [y, x]);

async function friendIdsOf(userId: string): Promise<string[]> {
  const rows = await prisma.friendship.findMany({
    where: { OR: [{ aId: userId }, { bId: userId }] },
    select: { aId: true, bId: true },
  });
  return rows.map(r => (r.aId === userId ? r.bId : r.aId));
}

async function areFriends(x: string, y: string): Promise<boolean> {
  const [aId, bId] = pair(x, y);
  return (await prisma.friendship.count({ where: { aId, bId } })) > 0;
}

/** Public shape of another learner. Never leaks email or billing state. */
const PUBLIC_USER = { id: true, username: true, tier: true, lastSeenAt: true } as const;

// ── Friends ───────────────────────────────────────────────────────────────────

// GET /api/social/friends — friends with live presence + basic profile.
socialRouter.get('/friends', async (req: Request, res: Response) => {
  const me = req.auth!.userId;
  const ids = await friendIdsOf(me);
  if (ids.length === 0) return res.json({ friends: [], onlineCount: presence.onlineCount() });

  const [users, unread, snapshots] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: ids } }, select: PUBLIC_USER }),
    prisma.directMessage.groupBy({
      by: ['fromId'],
      where: { toId: me, fromId: { in: ids }, readAt: null },
      _count: { _all: true },
    }),
    // The friends list shows XP and streak beside each name. Those live in the
    // progress snapshot, not on User, so without this the online list would
    // render every friend at 0 XP — strictly less informative than the offline
    // fixtures it replaces.
    prisma.progressSnapshot.findMany({ where: { userId: { in: ids } }, select: { userId: true, data: true } }),
  ]);
  const unreadBy = new Map(unread.map(u => [u.fromId, u._count._all]));
  const statsBy = new Map(snapshots.map(s => [s.userId, s.data as Record<string, unknown>]));
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

  const friends = users.map(u => {
    const stats = statsBy.get(u.id) ?? {};
    return {
      ...u,
      online: presence.isOnline(u.id),
      unread: unreadBy.get(u.id) ?? 0,
      xp: num(stats.xp),
      videoXp: num(stats.videoXp),
      streak: num(stats.streak),
    };
  });
  res.json({ friends, onlineCount: presence.onlineCount() });
});

// GET /api/social/online — which of my friends are online right now.
socialRouter.get('/online', async (req: Request, res: Response) => {
  const ids = await friendIdsOf(req.auth!.userId);
  res.json({ online: presence.onlineAmong(ids), onlineCount: presence.onlineCount() });
});

const searchSchema = z.object({ q: z.string().trim().min(2).max(40) });

// GET /api/social/search?q= — find learners to add.
//
// Excludes me, my existing friends and anyone with a live request either way,
// so the result is only people the Add button can actually act on. Capped at 20
// and requiring two characters, so it cannot be walked to enumerate the user
// table one letter at a time.
socialRouter.get('/search', async (req: Request, res: Response) => {
  const parsed = searchSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: 'Search for at least 2 characters.' });
  const me = req.auth!.userId;

  const [friends, requests] = await Promise.all([
    friendIdsOf(me),
    prisma.friendRequest.findMany({
      where: { status: 'pending', OR: [{ fromId: me }, { toId: me }] },
      select: { fromId: true, toId: true },
    }),
  ]);
  const hidden = new Set([me, ...friends]);
  for (const r of requests) hidden.add(r.fromId === me ? r.toId : r.fromId);

  const users = await prisma.user.findMany({
    where: { username: { contains: parsed.data.q, mode: 'insensitive' }, id: { notIn: [...hidden] } },
    select: PUBLIC_USER,
    orderBy: { username: 'asc' },
    take: 20,
  });
  res.json({ results: users.map(u => ({ ...u, online: presence.isOnline(u.id) })) });
});

// DELETE /api/social/friends/:friendId — unfriend, both directions at once.
socialRouter.delete('/friends/:friendId', async (req: Request, res: Response) => {
  const me = req.auth!.userId;
  const [aId, bId] = pair(me, req.params.friendId);
  const { count } = await prisma.friendship.deleteMany({ where: { aId, bId } });
  if (count === 0) return res.status(404).json({ error: 'Not friends.' });
  // Clear the answered request too, so the pair can start over cleanly rather
  // than being blocked by a stale "accepted" row.
  await prisma.friendRequest.deleteMany({
    where: { OR: [{ fromId: me, toId: req.params.friendId }, { fromId: req.params.friendId, toId: me }] },
  });
  notifyUser(req.params.friendId, 'friend:removed', { byId: me });
  res.json({ ok: true });
});

// ── Friend requests ───────────────────────────────────────────────────────────

const requestSchema = z.object({ toId: z.string().min(1) });

// POST /api/social/requests — ask to be someone's friend.
socialRouter.post(
  '/requests',
  rateLimit({ windowMs: 60 * 60 * 1000, max: 40, scope: 'friend request' }),
  async (req: Request, res: Response) => {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'toId required.' });
    const me = req.auth!.userId;
    const other = parsed.data.toId;
    if (other === me) return res.status(400).json({ error: 'Cannot friend yourself.' });

    const exists = await prisma.user.findUnique({ where: { id: other }, select: { id: true } });
    if (!exists) return res.status(404).json({ error: 'User not found.' });
    if (await areFriends(me, other)) return res.json({ status: 'friends' });

    // They already asked you: answering with a request of your own is a yes.
    const theirs = await prisma.friendRequest.findUnique({
      where: { fromId_toId: { fromId: other, toId: me } },
    });
    if (theirs && theirs.status === 'pending') {
      await acceptRequest(theirs.id, other, me);
      notifyUser(other, 'friend:accepted', { byId: me });
      return res.json({ status: 'friends', mutual: true });
    }

    // A declined request may be sent again — people change their minds — so the
    // upsert resets the row rather than leaving it stuck on `declined`.
    await prisma.friendRequest.upsert({
      where: { fromId_toId: { fromId: me, toId: other } },
      create: { fromId: me, toId: other },
      update: { status: 'pending', createdAt: new Date(), respondedAt: null },
    });
    notifyUser(other, 'friend:request', { fromId: me });
    res.status(201).json({ status: 'pending', notifiedLive: presence.isOnline(other) });
  },
);

// GET /api/social/requests — what is waiting on me, and what I am waiting on.
socialRouter.get('/requests', async (req: Request, res: Response) => {
  const me = req.auth!.userId;
  const rows = await prisma.friendRequest.findMany({
    where: { status: 'pending', OR: [{ toId: me }, { fromId: me }] },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { from: { select: PUBLIC_USER }, to: { select: PUBLIC_USER } },
  });
  res.json({
    incoming: rows.filter(r => r.toId === me).map(r => ({ id: r.id, at: r.createdAt, user: r.from })),
    outgoing: rows.filter(r => r.fromId === me).map(r => ({ id: r.id, at: r.createdAt, user: r.to })),
  });
});

/** Mark a request accepted and create the friendship in one transaction. */
async function acceptRequest(requestId: string, fromId: string, toId: string): Promise<void> {
  const [aId, bId] = pair(fromId, toId);
  await prisma.$transaction([
    prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'accepted', respondedAt: new Date() },
    }),
    prisma.friendship.upsert({ where: { aId_bId: { aId, bId } }, create: { aId, bId }, update: {} }),
  ]);
}

const respondRequestSchema = z.object({ id: z.string().min(1), accept: z.boolean() });

// POST /api/social/requests/respond — accept or decline one waiting on me.
socialRouter.post('/requests/respond', async (req: Request, res: Response) => {
  const parsed = respondRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid response.' });
  const me = req.auth!.userId;

  // Scoped to `toId: me`, so you can only answer a request actually addressed
  // to you — not accept one on someone else's behalf by guessing an id.
  const request = await prisma.friendRequest.findFirst({
    where: { id: parsed.data.id, toId: me, status: 'pending' },
  });
  if (!request) return res.status(404).json({ error: 'Request not found.' });

  if (parsed.data.accept) {
    await acceptRequest(request.id, request.fromId, me);
    notifyUser(request.fromId, 'friend:accepted', { byId: me });
    return res.json({ status: 'accepted', friendId: request.fromId });
  }
  await prisma.friendRequest.update({
    where: { id: request.id },
    data: { status: 'declined', respondedAt: new Date() },
  });
  res.json({ status: 'declined' });
});

// POST /api/social/requests/cancel — withdraw a request I sent.
socialRouter.post('/requests/cancel', async (req: Request, res: Response) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'toId required.' });
  const { count } = await prisma.friendRequest.deleteMany({
    where: { fromId: req.auth!.userId, toId: parsed.data.toId, status: 'pending' },
  });
  if (count === 0) return res.status(404).json({ error: 'No pending request.' });
  res.json({ ok: true });
});

// ── Direct messages ───────────────────────────────────────────────────────────

// GET /api/social/messages/:friendId — durable thread (oldest first).
socialRouter.get('/messages/:friendId', async (req: Request, res: Response) => {
  const me = req.auth!.userId;
  const other = req.params.friendId;
  if (!(await areFriends(me, other))) return res.status(403).json({ error: 'Not friends.' });

  const messages = await prisma.directMessage.findMany({
    where: { OR: [{ fromId: me, toId: other }, { fromId: other, toId: me }] },
    orderBy: { createdAt: 'asc' },
    take: 200,
  });
  await prisma.directMessage.updateMany({
    where: { fromId: other, toId: me, readAt: null },
    data: { readAt: new Date() },
  });
  res.json({ messages });
});

const sendSchema = z.object({ toId: z.string().min(1), text: z.string().trim().min(1).max(2000) });

// POST /api/social/messages — persist a message (socket layer relays it live).
socialRouter.post(
  '/messages',
  rateLimit({ windowMs: 60_000, max: 60, scope: 'message' }),
  async (req: Request, res: Response) => {
    const parsed = sendSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid message.' });
    const me = req.auth!.userId;
    const { toId, text } = parsed.data;
    if (!(await areFriends(me, toId))) return res.status(403).json({ error: 'Not friends.' });

    const msg = await prisma.directMessage.create({ data: { fromId: me, toId, text } });
    notifyUser(toId, 'dm:new', { id: msg.id, fromId: me, text: msg.text, at: msg.createdAt.toISOString() });
    res.status(201).json({ message: msg, deliveredLive: presence.isOnline(toId) });
  },
);

// GET /api/social/unread — unread count per friend, for the sidebar badges.
socialRouter.get('/unread', async (req: Request, res: Response) => {
  const rows = await prisma.directMessage.groupBy({
    by: ['fromId'],
    where: { toId: req.auth!.userId, readAt: null },
    _count: { _all: true },
  });
  res.json({
    byFriend: Object.fromEntries(rows.map(r => [r.fromId, r._count._all])),
    total: rows.reduce((s, r) => s + r._count._all, 0),
  });
});

// ── Duels ─────────────────────────────────────────────────────────────────────

const duelSchema = z.object({ toId: z.string().min(1) });

// POST /api/social/duel/challenge — record a pending duel challenge.
socialRouter.post(
  '/duel/challenge',
  rateLimit({ windowMs: 60_000, max: 20, scope: 'duel' }),
  async (req: Request, res: Response) => {
    const parsed = duelSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'toId required.' });
    const me = req.auth!.userId;
    if (!(await areFriends(me, parsed.data.toId))) return res.status(403).json({ error: 'Not friends.' });

    // One live challenge per pair: spamming Challenge should not queue twenty
    // of them for the opponent to dismiss one at a time.
    const open = await prisma.duelChallenge.findFirst({
      where: { fromId: me, toId: parsed.data.toId, status: 'pending' },
    });
    if (open) return res.json({ challenge: open, opponentOnline: presence.isOnline(parsed.data.toId) });

    const challenge = await prisma.duelChallenge.create({ data: { fromId: me, toId: parsed.data.toId } });
    notifyUser(parsed.data.toId, 'duel:incoming', { fromId: me, challengeId: challenge.id });
    res.status(201).json({ challenge, opponentOnline: presence.isOnline(parsed.data.toId) });
  },
);

// GET /api/social/duel/pending — challenges awaiting my response.
socialRouter.get('/duel/pending', async (req: Request, res: Response) => {
  const pending = await prisma.duelChallenge.findMany({
    where: { toId: req.auth!.userId, status: 'pending' },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json({ pending });
});

const respondSchema = z.object({ id: z.string().min(1), accept: z.boolean() });

// POST /api/social/duel/respond — accept or decline a challenge.
socialRouter.post('/duel/respond', async (req: Request, res: Response) => {
  const parsed = respondSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid response.' });
  const challenge = await prisma.duelChallenge.findFirst({
    where: { id: parsed.data.id, toId: req.auth!.userId, status: 'pending' },
  });
  if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });
  const updated = await prisma.duelChallenge.update({
    where: { id: challenge.id },
    data: { status: parsed.data.accept ? 'accepted' : 'declined' },
  });
  notifyUser(challenge.fromId, 'duel:response', {
    fromId: req.auth!.userId, accept: parsed.data.accept, challengeId: challenge.id,
  });
  res.json({ challenge: updated });
});

// ── Activity ──────────────────────────────────────────────────────────────────

/**
 * GET /api/social/activity — what actually happened, newest first.
 *
 * Read back out of the durable rows rather than stored as a separate log: a
 * friendship row IS "you became friends", a duel row IS "you were challenged".
 * A dedicated events table would be a second copy of the same truth, free to
 * drift from it — and would need backfilling for everything that already
 * happened.
 */
socialRouter.get('/activity', async (req: Request, res: Response) => {
  const me = req.auth!.userId;
  const limit = Math.min(60, Math.max(1, Number(req.query.limit) || 40));
  const ids = await friendIdsOf(me);
  if (ids.length === 0) return res.json({ events: [] });

  const [friendships, messages, duels] = await Promise.all([
    prisma.friendship.findMany({
      where: { OR: [{ aId: me }, { bId: me }] },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.directMessage.findMany({
      where: { OR: [{ fromId: me, toId: { in: ids } }, { fromId: { in: ids }, toId: me }] },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, fromId: true, toId: true, createdAt: true },
    }),
    prisma.duelChallenge.findMany({
      where: {
        status: { in: ['accepted', 'declined'] },
        OR: [{ fromId: me, toId: { in: ids } }, { fromId: { in: ids }, toId: me }],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
  ]);

  const names = new Map(
    (await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, username: true } }))
      .map(u => [u.id, u.username]),
  );
  const other = (a: string, b: string) => (a === me ? b : a);
  const named = (id: string) => ({ friendId: id, friendName: names.get(id) ?? 'Learner' });

  const events = [
    ...friendships.map(f => ({
      id: `fr-${f.id}`, type: 'friend_added' as const,
      ...named(other(f.aId, f.bId)), at: f.createdAt.toISOString(),
    })),
    ...messages.map(m => ({
      id: `dm-${m.id}`, type: 'message' as const,
      ...named(other(m.fromId, m.toId)), at: m.createdAt.toISOString(),
      meta: { outgoing: m.fromId === me },
    })),
    // A challenge being accepted is not a win — nothing here knows who scored
    // higher, because the duel itself is played client-side. Reporting these as
    // duel_win/duel_loss would put fictional results in a feed whose whole
    // point is that it only carries real ones.
    ...duels.map(d => ({
      id: `du-${d.id}`,
      type: (d.status === 'accepted' ? 'duel_accepted' : 'duel_declined') as
        'duel_accepted' | 'duel_declined',
      ...named(other(d.fromId, d.toId)), at: d.createdAt.toISOString(),
      meta: { outgoing: d.fromId === me },
    })),
  ]
    .sort((x, y) => Date.parse(y.at) - Date.parse(x.at))
    .slice(0, limit);

  res.json({ events });
});
