// Cloud sync for lesson bookmarks. Bookmarks are just a per-user set of lesson
// ids (mirroring the client-side bookmarkStore), so each is one row keyed by the
// (userId, lessonId) composite primary key — add/remove are idempotent and the
// set can never contain a duplicate. A bulk replace endpoint lets the client
// push its whole local set on first sign-in. Zod guards every write.
import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
export const bookmarksRouter = Router();

// Lesson ids look like "byzantine-05" / "modern-22" — short, no whitespace.
const lessonId = z.string().trim().min(1).max(64).regex(/^[a-z0-9-]+$/i, 'Invalid lesson id.');
const MAX_BOOKMARKS = 500; // a generous ceiling; the catalog is 132 lessons

// GET /api/bookmarks → { lessonIds: string[] }
bookmarksRouter.get('/', async (req: Request, res: Response) => {
  const rows = await prisma.bookmark.findMany({
    where: { userId: req.auth!.userId },
    orderBy: { createdAt: 'asc' },
    select: { lessonId: true },
  });
  res.json({ lessonIds: rows.map(r => r.lessonId) });
});

// PUT /api/bookmarks/:lessonId → add (idempotent)
bookmarksRouter.put('/:lessonId', async (req: Request, res: Response) => {
  const parsed = lessonId.safeParse(req.params.lessonId);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid lesson id.' });
  const userId = req.auth!.userId;

  const count = await prisma.bookmark.count({ where: { userId } });
  const exists = await prisma.bookmark.findUnique({ where: { userId_lessonId: { userId, lessonId: parsed.data } } });
  if (!exists && count >= MAX_BOOKMARKS) {
    return res.status(409).json({ error: `Bookmark limit of ${MAX_BOOKMARKS} reached.` });
  }

  await prisma.bookmark.upsert({
    where: { userId_lessonId: { userId, lessonId: parsed.data } },
    create: { userId, lessonId: parsed.data },
    update: {},
  });
  res.json({ ok: true, bookmarked: true });
});

// DELETE /api/bookmarks/:lessonId → remove (idempotent)
bookmarksRouter.delete('/:lessonId', async (req: Request, res: Response) => {
  const parsed = lessonId.safeParse(req.params.lessonId);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid lesson id.' });
  await prisma.bookmark.deleteMany({ where: { userId: req.auth!.userId, lessonId: parsed.data } });
  res.json({ ok: true, bookmarked: false });
});

// POST /api/bookmarks/bulk → replace the whole set (initial local→cloud sync)
const bulkSchema = z.object({ lessonIds: z.array(lessonId).max(MAX_BOOKMARKS) });
bookmarksRouter.post('/bulk', async (req: Request, res: Response) => {
  const parsed = bulkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Malformed bookmark set.', issues: parsed.error.issues.slice(0, 3) });
  const userId = req.auth!.userId;
  const unique = [...new Set(parsed.data.lessonIds)];

  // Replace atomically: clear then insert the deduped set.
  await prisma.$transaction([
    prisma.bookmark.deleteMany({ where: { userId } }),
    prisma.bookmark.createMany({ data: unique.map(l => ({ userId, lessonId: l })), skipDuplicates: true }),
  ]);
  res.json({ ok: true, count: unique.length });
});
