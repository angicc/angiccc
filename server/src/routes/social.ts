// Social endpoints: friends list with live online status, direct-message
// history, and duel challenges. Real-time delivery happens over sockets (see
// index.ts); these REST routes provide the durable store and initial hydration.
import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { presence } from '../presence';

const prisma = new PrismaClient();
export const socialRouter = Router();

// Undirected friendship helper: always store/query with the smaller id first.
const pair = (x: string, y: string): [string, string] => (x < y ? [x, y] : [y, x]);

async function friendIdsOf(userId: string): Promise<string[]> {
  const rows = await prisma.friendship.findMany({
    where: { OR: [{ aId: userId }, { bId: userId }] },
    select: { aId: true, bId: true },
  });
  return rows.map(r => (r.aId === userId ? r.bId : r.aId));
}

// GET /api/social/friends — friends with live presence + basic profile.
socialRouter.get('/friends', async (req: Request, res: Response) => {
  const ids = await friendIdsOf(req.auth!.userId);
  if (ids.length === 0) return res.json({ friends: [], onlineCount: presence.onlineCount() });
  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, username: true, tier: true, lastSeenAt: true },
  });
  const friends = users.map(u => ({ ...u, online: presence.isOnline(u.id) }));
  res.json({ friends, onlineCount: presence.onlineCount() });
});

// GET /api/social/online — which of my friends are online right now.
socialRouter.get('/online', async (req: Request, res: Response) => {
  const ids = await friendIdsOf(req.auth!.userId);
  res.json({ online: presence.onlineAmong(ids), onlineCount: presence.onlineCount() });
});

const addFriendSchema = z.object({ friendId: z.string().min(1) });

// POST /api/social/friends — accept/create a friendship (idempotent).
socialRouter.post('/friends', async (req: Request, res: Response) => {
  const parsed = addFriendSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'friendId required.' });
  const me = req.auth!.userId;
  const other = parsed.data.friendId;
  if (other === me) return res.status(400).json({ error: 'Cannot friend yourself.' });
  const exists = await prisma.user.findUnique({ where: { id: other }, select: { id: true } });
  if (!exists) return res.status(404).json({ error: 'User not found.' });
  const [aId, bId] = pair(me, other);
  await prisma.friendship.upsert({
    where: { aId_bId: { aId, bId } },
    create: { aId, bId },
    update: {},
  });
  res.status(201).json({ ok: true });
});

// GET /api/social/messages/:friendId — durable thread (oldest first).
socialRouter.get('/messages/:friendId', async (req: Request, res: Response) => {
  const me = req.auth!.userId;
  const other = req.params.friendId;
  const messages = await prisma.directMessage.findMany({
    where: {
      OR: [
        { fromId: me, toId: other },
        { fromId: other, toId: me },
      ],
    },
    orderBy: { createdAt: 'asc' },
    take: 200,
  });
  // Mark the incoming ones read.
  await prisma.directMessage.updateMany({
    where: { fromId: other, toId: me, readAt: null },
    data: { readAt: new Date() },
  });
  res.json({ messages });
});

const sendSchema = z.object({ toId: z.string().min(1), text: z.string().trim().min(1).max(2000) });

// POST /api/social/messages — persist a message (socket layer relays it live).
socialRouter.post('/messages', async (req: Request, res: Response) => {
  const parsed = sendSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid message.' });
  const me = req.auth!.userId;
  const { toId, text } = parsed.data;
  const msg = await prisma.directMessage.create({ data: { fromId: me, toId, text } });
  res.status(201).json({ message: msg, deliveredLive: presence.isOnline(toId) });
});

const duelSchema = z.object({ toId: z.string().min(1) });

// POST /api/social/duel/challenge — record a pending duel challenge.
socialRouter.post('/duel/challenge', async (req: Request, res: Response) => {
  const parsed = duelSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'toId required.' });
  const challenge = await prisma.duelChallenge.create({
    data: { fromId: req.auth!.userId, toId: parsed.data.toId },
  });
  res.status(201).json({ challenge, opponentOnline: presence.isOnline(parsed.data.toId) });
});

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
  res.json({ challenge: updated });
});
