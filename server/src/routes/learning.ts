// Cloud sync for the AI learning systems: Clio's learner-memory profile, the
// weekly study plan, and AI Studio study sets. Profile and plan follow the
// whole-blob GET/PUT pattern of sync.ts (client-authoritative, last write
// wins); study sets are discrete rows keyed by the client-generated set id so
// individual sets can be upserted and deleted without shipping the whole
// library. Zod guards every write — a malformed body can never reach Postgres.
import { Router, type Request, type Response } from 'express';
import { PrismaClient, type Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
export const learningRouter = Router();

const MAX_BLOB_BYTES = 128 * 1024;

function validBlob(body: unknown, res: Response): body is Prisma.InputJsonObject {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    res.status(400).json({ error: 'Body must be a JSON object.' });
    return false;
  }
  if (Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BLOB_BYTES) {
    res.status(413).json({ error: 'State blob exceeds the 128 KiB sync limit.' });
    return false;
  }
  return true;
}

// ── Learner profile (Clio memory) ────────────────────────────────────────────

// GET /api/learning/profile
learningRouter.get('/profile', async (req: Request, res: Response) => {
  const row = await prisma.learnerProfile.findUnique({ where: { userId: req.auth!.userId } });
  res.json({ data: row?.data ?? null, updatedAt: row?.updatedAt ?? null });
});

// PUT /api/learning/profile
learningRouter.put('/profile', async (req: Request, res: Response) => {
  if (!validBlob(req.body, res)) return;
  const row = await prisma.learnerProfile.upsert({
    where: { userId: req.auth!.userId },
    create: { userId: req.auth!.userId, data: req.body },
    update: { data: req.body },
  });
  res.json({ ok: true, updatedAt: row.updatedAt });
});

// DELETE /api/learning/profile — "forget everything" must clear the cloud too.
learningRouter.delete('/profile', async (req: Request, res: Response) => {
  await prisma.learnerProfile.deleteMany({ where: { userId: req.auth!.userId } });
  res.json({ ok: true });
});

// ── Weekly study plan ─────────────────────────────────────────────────────────

// GET /api/learning/plan
learningRouter.get('/plan', async (req: Request, res: Response) => {
  const row = await prisma.weekPlanRecord.findUnique({ where: { userId: req.auth!.userId } });
  res.json({ data: row?.data ?? null, updatedAt: row?.updatedAt ?? null });
});

// PUT /api/learning/plan
learningRouter.put('/plan', async (req: Request, res: Response) => {
  if (!validBlob(req.body, res)) return;
  const row = await prisma.weekPlanRecord.upsert({
    where: { userId: req.auth!.userId },
    create: { userId: req.auth!.userId, data: req.body },
    update: { data: req.body },
  });
  res.json({ ok: true, updatedAt: row.updatedAt });
});

// ── AI Studio study sets ──────────────────────────────────────────────────────

const MAX_SETS_PER_USER = 30;

// Structural guard for a study set as the client stores it. Content arrays are
// size-capped but internally free-form JSON — the client validates semantics;
// the server enforces bounds so one user can't stuff megabytes into a row.
const studySetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(80),
  createdAt: z.string(),
  sourceExcerpt: z.string().max(200).default(''),
  summary: z.string().max(2000).default(''),
  facts: z.array(z.string().max(500)).max(12).default([]),
  cards: z.array(z.object({ front: z.string().max(500), back: z.string().max(500) })).max(24).default([]),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string().max(1000),
    options: z.array(z.string().max(300)).length(4),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string().max(1000),
    difficulty: z.enum(['easy', 'medium', 'hard']),
  })).max(12).default([]),
  timesPracticed: z.number().int().min(0).default(0),
  bestScore: z.number().min(0).max(100).default(0),
  lastPracticedAt: z.string().optional(),
});

// GET /api/learning/sets
learningRouter.get('/sets', async (req: Request, res: Response) => {
  const rows = await prisma.studySet.findMany({
    where: { userId: req.auth!.userId },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ sets: rows.map(r => r.data), updatedAt: rows.at(-1)?.updatedAt ?? null });
});

// PUT /api/learning/sets/:id — upsert one set (create after generation, update
// after each practice run).
learningRouter.put('/sets/:id', async (req: Request, res: Response) => {
  const parsed = studySetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Malformed study set.', issues: parsed.error.issues.slice(0, 3) });
  if (parsed.data.id !== req.params.id) return res.status(400).json({ error: 'Body id must match the URL id.' });

  const userId = req.auth!.userId;
  const count = await prisma.studySet.count({ where: { userId } });
  const exists = await prisma.studySet.findUnique({ where: { id: parsed.data.id } });
  if (exists && exists.userId !== userId) return res.status(403).json({ error: 'Not your study set.' });
  if (!exists && count >= MAX_SETS_PER_USER) {
    return res.status(409).json({ error: `Study set limit reached (${MAX_SETS_PER_USER}). Delete a set first.` });
  }

  const data = parsed.data as unknown as Prisma.InputJsonObject;
  const row = await prisma.studySet.upsert({
    where: { id: parsed.data.id },
    create: { id: parsed.data.id, userId, name: parsed.data.name, data },
    update: { name: parsed.data.name, data },
  });
  res.json({ ok: true, updatedAt: row.updatedAt });
});

// DELETE /api/learning/sets/:id
learningRouter.delete('/sets/:id', async (req: Request, res: Response) => {
  await prisma.studySet.deleteMany({ where: { id: req.params.id, userId: req.auth!.userId } });
  res.json({ ok: true });
});
