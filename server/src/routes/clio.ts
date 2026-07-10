// Clio chat-history endpoints.
import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
export const clioRouter = Router();

// GET /api/clio/history — session tree for the sidebar (newest first).
clioRouter.get('/history', async (req: Request, res: Response) => {
  const sessions = await prisma.clioChatSession.findMany({
    where: { userId: req.auth!.userId },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, language: true, createdAt: true, updatedAt: true },
    take: 50,
  });
  res.json(sessions);
});

// GET /api/clio/history/:sessionId — full thread for continuation. The client
// injects the trailing window of these messages back into the LLM context.
clioRouter.get('/history/:sessionId', async (req: Request, res: Response) => {
  const session = await prisma.clioChatSession.findFirst({
    where: { id: req.params.sessionId, userId: req.auth!.userId },
    include: { messages: { orderBy: { timestamp: 'asc' } } },
  });
  if (!session) return res.status(404).json({ error: 'Thread not found.' });
  res.json(session);
});

const messageBody = z.object({
  sessionId: z.string().optional(),           // absent → create a new session
  language: z.string().default('en'),
  sender: z.enum(['user', 'clio']),
  text: z.string().min(1).max(8000),
});

// POST /api/clio/message — append a turn; auto-creates and auto-titles sessions.
clioRouter.post('/message', async (req: Request, res: Response) => {
  const parsed = messageBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const userId = req.auth!.userId;
  const { sessionId, language, sender, text } = parsed.data;

  const session = sessionId
    ? await prisma.clioChatSession.findFirst({ where: { id: sessionId, userId } })
    : await prisma.clioChatSession.create({
        data: { userId, language, title: sender === 'user' ? text.slice(0, 48) : '' },
      });
  if (!session) return res.status(404).json({ error: 'Thread not found.' });

  const message = await prisma.clioChatMessage.create({
    data: { sessionId: session.id, sender, text },
  });
  await prisma.clioChatSession.update({
    where: { id: session.id },
    data: {
      updatedAt: new Date(),
      ...(session.title === '' && sender === 'user' ? { title: text.slice(0, 48) } : {}),
    },
  });
  res.json({ sessionId: session.id, message });
});

// DELETE /api/clio/history/:sessionId
clioRouter.delete('/history/:sessionId', async (req: Request, res: Response) => {
  await prisma.clioChatSession.deleteMany({
    where: { id: req.params.sessionId, userId: req.auth!.userId },
  });
  res.json({ ok: true });
});
