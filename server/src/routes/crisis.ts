// Chronos Crisis Room state endpoints.
import { Router, type Request, type Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { crisisNodeSchema, validateLlmPayload } from '../validation';

const prisma = new PrismaClient();
export const crisisRouter = Router();

const BASELINE = { diplomaticCapital: 50, domesticStability: 50, militaryReadiness: 50, treasury: 50 };

const resetBody = z.object({ crisisId: z.string().min(1) });

// POST /api/crisis/reset — transactionally drop the decision log and
// re-initialize baseline metrics for a fresh, error-free timeline pool.
crisisRouter.post('/reset', async (req: Request, res: Response) => {
  const parsed = resetBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const userId = req.auth!.userId; // set by the JWT middleware

  const state = await prisma.$transaction(async tx => {
    await tx.crisisRoomState.deleteMany({ where: { userId, crisisId: parsed.data.crisisId } });
    return tx.crisisRoomState.create({
      data: {
        userId,
        crisisId: parsed.data.crisisId,
        activeStep: 0,
        concluded: false,
        decisionHistory: [] as Prisma.JsonArray,
        resourceMetrics: BASELINE as unknown as Prisma.JsonObject,
      },
    });
  });
  res.json(state);
});

// GET /api/crisis/:crisisId — current run state (creates baseline if absent).
crisisRouter.get('/:crisisId', async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const state = await prisma.crisisRoomState.upsert({
    where: { userId_crisisId: { userId, crisisId: req.params.crisisId } },
    update: {},
    create: {
      userId,
      crisisId: req.params.crisisId,
      decisionHistory: [] as Prisma.JsonArray,
      resourceMetrics: BASELINE as unknown as Prisma.JsonObject,
    },
  });
  res.json(state);
});

const stepBody = z.object({
  crisisId: z.string().min(1),
  decision: z.object({ step: z.number().int(), optionId: z.string(), text: z.string() }),
  /** Raw LLM output for the turn — validated server-side before persisting. */
  rawEngineOutput: z.string().min(1),
});

// POST /api/crisis/step — validate one engine node, mutate the vector, persist.
crisisRouter.post('/step', async (req: Request, res: Response) => {
  const parsed = stepBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const userId = req.auth!.userId;

  let node;
  try {
    node = validateLlmPayload(crisisNodeSchema, parsed.data.rawEngineOutput);
  } catch (e) {
    return res.status(422).json({ error: 'Engine node failed structural validation.', detail: String(e) });
  }

  const state = await prisma.crisisRoomState.findUnique({
    where: { userId_crisisId: { userId, crisisId: parsed.data.crisisId } },
  });
  if (!state) return res.status(404).json({ error: 'No active run. POST /api/crisis/reset first.' });

  const metrics = state.resourceMetrics as Record<string, number>;
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  const nextMetrics = Object.fromEntries(
    Object.entries(metrics).map(([k, v]) => [k, clamp(v + (node.resourceImpacts[k as keyof typeof node.resourceImpacts] ?? 0))]),
  );
  const gated = Object.values(nextMetrics).some(v => v <= 0 || v >= 100);
  const concluded = node.branchingOptions.length === 0 || gated;

  const updated = await prisma.crisisRoomState.update({
    where: { userId_crisisId: { userId, crisisId: parsed.data.crisisId } },
    data: {
      activeStep: { increment: 1 },
      concluded,
      decisionHistory: [...(state.decisionHistory as Prisma.JsonArray), parsed.data.decision as unknown as Prisma.JsonObject],
      resourceMetrics: nextMetrics as unknown as Prisma.JsonObject,
    },
  });
  res.json({ state: updated, node, hardGateTriggered: gated });
});
