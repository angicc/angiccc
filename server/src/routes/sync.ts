// Cloud sync for client-authoritative stores: whole-blob GET/PUT per user for
// learning progress and the Territory Conquest Campaign. The client keeps
// localStorage as its cache and flushes here after mutations; other devices
// hydrate on login and receive live deltas over the socket layer.
import { Router, type Request, type Response } from 'express';
import { PrismaClient, type Prisma } from '@prisma/client';

const prisma = new PrismaClient();
export const syncRouter = Router();

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

// GET /api/sync/progress
syncRouter.get('/progress', async (req: Request, res: Response) => {
  const row = await prisma.progressSnapshot.findUnique({ where: { userId: req.auth!.userId } });
  res.json({ data: row?.data ?? null, updatedAt: row?.updatedAt ?? null });
});

// PUT /api/sync/progress
syncRouter.put('/progress', async (req: Request, res: Response) => {
  if (!validBlob(req.body, res)) return;
  const row = await prisma.progressSnapshot.upsert({
    where: { userId: req.auth!.userId },
    create: { userId: req.auth!.userId, data: req.body },
    update: { data: req.body },
  });
  res.json({ ok: true, updatedAt: row.updatedAt });
});

// GET /api/sync/campaign
syncRouter.get('/campaign', async (req: Request, res: Response) => {
  const row = await prisma.campaignProgress.findUnique({ where: { userId: req.auth!.userId } });
  res.json({ data: row?.data ?? null, updatedAt: row?.updatedAt ?? null });
});

// PUT /api/sync/campaign
syncRouter.put('/campaign', async (req: Request, res: Response) => {
  if (!validBlob(req.body, res)) return;
  const row = await prisma.campaignProgress.upsert({
    where: { userId: req.auth!.userId },
    create: { userId: req.auth!.userId, data: req.body },
    update: { data: req.body },
  });
  res.json({ ok: true, updatedAt: row.updatedAt });
});
