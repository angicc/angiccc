// ─── Gift subscriptions ───────────────────────────────────────────────────────
// A subscriber gifts one month of any paid plan to another user. The
// recipient's tier upgrades immediately for a month (if the gift outranks
// their current tier); the gifter earns 50% off their own next renewal,
// recorded on User.nextRenewalDiscountPct and consumed by the billing cycle
// (Stripe checkout/renewal reads and clears it; the demo flow mirrors this
// client-side). Everything runs in one transaction so a failed upgrade never
// half-books a reward.
import { Router, type Request, type Response } from 'express';
import { PrismaClient, Tier } from '@prisma/client';

const prisma = new PrismaClient();
export const giftsRouter = Router();

const GIFTABLE: Record<string, Tier> = { beginner: 'BEGINNER', pro: 'PRO', master: 'MASTER' };
const RANK: Record<Tier, number> = { FREE: 0, BEGINNER: 1, PRO: 2, MASTER: 3 };

// POST /api/gifts  { recipientUsername, tier }
giftsRouter.post('/', async (req: Request, res: Response) => {
  const { recipientUsername, tier } = (req.body ?? {}) as { recipientUsername?: unknown; tier?: unknown };
  const giftTier = typeof tier === 'string' ? GIFTABLE[tier.toLowerCase()] : undefined;
  if (!giftTier) return res.status(400).json({ error: 'Tier must be beginner, pro, or master.' });
  if (typeof recipientUsername !== 'string' || !recipientUsername.trim()) {
    return res.status(400).json({ error: 'Recipient username is required.' });
  }

  const gifterId = req.auth!.userId;
  const recipient = await prisma.user.findFirst({
    where: { username: recipientUsername.trim() },
    select: { id: true, tier: true, username: true },
  });
  if (!recipient) return res.status(404).json({ error: 'No user with that username.' });
  if (recipient.id === gifterId) return res.status(400).json({ error: 'You cannot gift a plan to yourself.' });

  // One outstanding gift per gifter→recipient pair keeps the reward honest.
  const existing = await prisma.giftSubscription.findFirst({
    where: { gifterId, recipientId: recipient.id, status: 'active' },
    select: { id: true },
  });
  if (existing) return res.status(409).json({ error: 'You already have an active gift for this user.' });

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  try {
    const gift = await prisma.$transaction(async tx => {
      const created = await tx.giftSubscription.create({
        data: { gifterId, recipientId: recipient.id, tier: giftTier, expiresAt },
      });
      // Upgrade only if the gift outranks the recipient's current tier —
      // never downgrade someone's paid subscription with a lesser gift.
      if (RANK[giftTier] > RANK[recipient.tier]) {
        await tx.user.update({
          where: { id: recipient.id },
          data: { tier: giftTier, subscriptionStatus: 'gifted', renewsAt: expiresAt },
        });
      }
      // The gifter's reward: 50% off the next renewal.
      await tx.user.update({ where: { id: gifterId }, data: { nextRenewalDiscountPct: 50 } });
      return created;
    });
    res.json({ ok: true, giftId: gift.id, recipient: recipient.username, tier: giftTier, expiresAt, rewardPct: 50 });
  } catch (err) {
    console.error('gift failed', err);
    res.status(500).json({ error: 'Gift could not be completed — nothing was charged or changed.' });
  }
});

// GET /api/gifts — the caller's sent + received gifts, and their pending reward.
giftsRouter.get('/', async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const [sent, received, me] = await Promise.all([
    prisma.giftSubscription.findMany({
      where: { gifterId: userId }, orderBy: { createdAt: 'desc' }, take: 20,
      select: { id: true, tier: true, status: true, createdAt: true, expiresAt: true, recipient: { select: { username: true } } },
    }),
    prisma.giftSubscription.findMany({
      where: { recipientId: userId }, orderBy: { createdAt: 'desc' }, take: 20,
      select: { id: true, tier: true, status: true, createdAt: true, expiresAt: true, gifter: { select: { username: true } } },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { nextRenewalDiscountPct: true } }),
  ]);
  res.json({ sent, received, nextRenewalDiscountPct: me?.nextRenewalDiscountPct ?? 0 });
});
