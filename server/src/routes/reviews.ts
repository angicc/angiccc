// ─── Public app reviews ───────────────────────────────────────────────────────
// The landing page's testimonials are real: any signed-in user can leave one
// review (rating 1–5 + short text), revisable at any time. The listing is
// public and cached briefly — landing pages tolerate a minute of staleness.
import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CACHE_TTL_MS = 60 * 1000;
const LIST_N = 24;
let cache: { rows: PublicReview[]; at: number } | null = null;

interface PublicReview {
  author: string;
  role: string;
  rating: number;
  text: string;
  createdAt: Date;
}

/** Public router: GET the latest reviews (no auth). */
export const reviewsPublicRouter = Router();

reviewsPublicRouter.get('/', async (_req: Request, res: Response) => {
  if (!cache || Date.now() - cache.at >= CACHE_TTL_MS) {
    const rows = await prisma.appReview.findMany({
      orderBy: { updatedAt: 'desc' },
      take: LIST_N,
      select: { username: true, role: true, rating: true, text: true, createdAt: true },
    });
    cache = {
      rows: rows.map(r => ({ author: r.username, role: r.role, rating: r.rating, text: r.text, createdAt: r.createdAt })),
      at: Date.now(),
    };
  }
  res.json({ reviews: cache.rows });
});

/** Authenticated handler: upsert the caller's single review. */
export async function submitReviewHandler(req: Request, res: Response) {
  const { rating, text, role } = (req.body ?? {}) as { rating?: unknown; text?: unknown; role?: unknown };
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) return res.status(400).json({ error: 'Rating must be 1–5.' });
  if (typeof text !== 'string' || text.trim().length < 10 || text.length > 600) {
    return res.status(400).json({ error: 'Review text must be 10–600 characters.' });
  }
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId }, select: { username: true } });
  if (!user) return res.status(404).json({ error: 'Account not found.' });

  const row = await prisma.appReview.upsert({
    where: { userId: req.auth!.userId },
    create: {
      userId: req.auth!.userId,
      username: user.username,
      role: typeof role === 'string' ? role.slice(0, 60) : '',
      rating: r,
      text: text.trim(),
    },
    update: {
      username: user.username,
      role: typeof role === 'string' ? role.slice(0, 60) : '',
      rating: r,
      text: text.trim(),
    },
  });
  cache = null; // next public read reflects the new review
  res.json({ ok: true, updatedAt: row.updatedAt });
}
