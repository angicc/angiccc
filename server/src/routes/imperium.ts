// ─── CHRONOS IMPERIUM · Part D: State Serialization & Transactional Rollbacks ─
// The server-side spine of the campaign engine. The client resolves turns
// locally (the engine is deterministic), then ships the resulting snapshot
// here per turn block; the server stores the FULL snapshot state so any turn
// can be restored exactly — no replay required, no partial reconstruction.
//
// Rollback is the delicate part: it touches two tables (campaign head +
// snapshot log) and must never leave the head pointing at a pruned turn.
// Both the append and rollback paths run inside prisma.$transaction and
// always touch tables in the same order (campaign → snapshots), so two
// concurrent operations on the same campaign serialize instead of
// deadlocking; cross-campaign operations touch disjoint rows entirely.
import { Router, type Request, type Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
export const imperiumRouter = Router();

// ── Serialization limits & integrity ──────────────────────────────────────────

const MAX_SNAPSHOT_BYTES = 192 * 1024;   // one turn block (armies + ownership + log)
const MAX_CAMPAIGNS_PER_USER = 8;        // oldest is evicted when exceeded
const SNAPSHOT_RING = 60;                // turns retained per campaign

/**
 * FNV-1a over the canonical JSON string — cheap, dependency-free integrity
 * signature. Not a cryptographic MAC (the row is already inside our trust
 * boundary); it exists to catch truncation/corruption before a restore.
 */
export function snapshotChecksum(stateJson: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < stateJson.length; i++) {
    h ^= stateJson.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

const VALID_ERAS = new Set(['ancient', 'medieval', 'early-modern', 'modern']);

interface TurnPayload {
  campaign: {
    id: string;
    era: string;
    seed: number;
    playerRosterId: string;
    rivalRosterId: string;
    playerLeaderId: string;
    rivalLeaderId: string;
  };
  turn: number;
  over?: boolean;
  playerWon?: boolean;
  state: unknown;          // full CampaignSnapshot — opaque to the server
  checksum?: string;       // client-computed; recomputed + compared when present
}

function parseTurnPayload(body: unknown, res: Response): TurnPayload | null {
  const fail = (msg: string) => { res.status(400).json({ error: msg }); return null; };
  if (!body || typeof body !== 'object') return fail('Body must be a JSON object.');
  const p = body as Partial<TurnPayload>;
  const c = p.campaign;
  if (!c || typeof c !== 'object') return fail('Missing campaign descriptor.');
  if (typeof c.id !== 'string' || c.id.length === 0 || c.id.length > 80) return fail('Invalid campaign id.');
  if (typeof c.era !== 'string' || !VALID_ERAS.has(c.era)) return fail('Unknown theatre era.');
  if (!Number.isInteger(c.seed)) return fail('Seed must be an integer.');
  for (const k of ['playerRosterId', 'rivalRosterId', 'playerLeaderId', 'rivalLeaderId'] as const) {
    if (typeof c[k] !== 'string' || c[k].length > 60) return fail(`Invalid ${k}.`);
  }
  if (!Number.isInteger(p.turn) || (p.turn as number) < 0 || (p.turn as number) > 10_000) return fail('Invalid turn number.');
  if (p.state === undefined || p.state === null || typeof p.state !== 'object') return fail('Missing snapshot state.');
  const json = JSON.stringify(p.state);
  if (Buffer.byteLength(json, 'utf8') > MAX_SNAPSHOT_BYTES) {
    res.status(413).json({ error: 'Snapshot exceeds the per-turn size limit.' });
    return null;
  }
  if (typeof p.checksum === 'string' && p.checksum !== snapshotChecksum(json)) {
    res.status(422).json({ error: 'Snapshot checksum mismatch — state corrupted in transit.' });
    return null;
  }
  return p as TurnPayload;
}

// ── GET /api/imperium/campaigns — the player's campaign shelf ────────────────

imperiumRouter.get('/campaigns', async (req: Request, res: Response) => {
  const rows = await prisma.imperiumCampaign.findMany({
    where: { userId: req.auth!.userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true, era: true, seed: true, currentTurn: true, over: true, playerWon: true,
      playerRosterId: true, rivalRosterId: true, playerLeaderId: true, rivalLeaderId: true,
      createdAt: true, updatedAt: true,
    },
  });
  res.json({ campaigns: rows });
});

// ── GET /api/imperium/campaigns/:id — head snapshot + turn index ─────────────
// Restores a campaign on a new device: campaign meta, the CURRENT turn's full
// state, and the list of turns available for rollback (numbers only — full
// states are fetched per-turn on demand to keep the payload lean).

imperiumRouter.get('/campaigns/:id', async (req: Request, res: Response) => {
  const campaign = await prisma.imperiumCampaign.findFirst({
    where: { id: req.params.id, userId: req.auth!.userId },
  });
  if (!campaign) return res.status(404).json({ error: 'Campaign not found.' });

  const [head, turns] = await Promise.all([
    prisma.imperiumTurnSnapshot.findUnique({
      where: { campaignId_turn: { campaignId: campaign.id, turn: campaign.currentTurn } },
    }),
    prisma.imperiumTurnSnapshot.findMany({
      where: { campaignId: campaign.id },
      orderBy: { turn: 'asc' },
      select: { turn: true, checksum: true, createdAt: true },
    }),
  ]);

  if (head && snapshotChecksum(JSON.stringify(head.state)) !== head.checksum) {
    return res.status(500).json({ error: 'Stored snapshot failed integrity check.' });
  }
  res.json({ campaign, head: head?.state ?? null, turns });
});

// ── GET /api/imperium/campaigns/:id/turns/:turn — one stored turn block ──────

imperiumRouter.get('/campaigns/:id/turns/:turn', async (req: Request, res: Response) => {
  const turn = Number(req.params.turn);
  if (!Number.isInteger(turn) || turn < 0) return res.status(400).json({ error: 'Invalid turn.' });
  const campaign = await prisma.imperiumCampaign.findFirst({
    where: { id: req.params.id, userId: req.auth!.userId },
    select: { id: true },
  });
  if (!campaign) return res.status(404).json({ error: 'Campaign not found.' });
  const snap = await prisma.imperiumTurnSnapshot.findUnique({
    where: { campaignId_turn: { campaignId: campaign.id, turn } },
  });
  if (!snap) return res.status(404).json({ error: 'Turn not stored.' });
  if (snapshotChecksum(JSON.stringify(snap.state)) !== snap.checksum) {
    return res.status(500).json({ error: 'Stored snapshot failed integrity check.' });
  }
  res.json({ turn: snap.turn, state: snap.state, checksum: snap.checksum });
});

// ── PUT /api/imperium/campaigns/:id/turn — append a resolved turn block ──────
// One transaction: upsert the campaign head, write the snapshot row, prune
// the ring tail. Campaign row first, snapshots second — the global ordering
// rule that keeps concurrent writers deadlock-free.

imperiumRouter.put('/campaigns/:id/turn', async (req: Request, res: Response) => {
  const payload = parseTurnPayload(req.body, res);
  if (!payload) return;
  if (payload.campaign.id !== req.params.id) {
    return res.status(400).json({ error: 'Campaign id mismatch between path and body.' });
  }
  const userId = req.auth!.userId;
  const stateJson = JSON.stringify(payload.state);
  const checksum = snapshotChecksum(stateJson);

  // Ownership guard outside the transaction: reject foreign campaign ids early.
  const existing = await prisma.imperiumCampaign.findUnique({
    where: { id: payload.campaign.id },
    select: { userId: true, currentTurn: true },
  });
  if (existing && existing.userId !== userId) {
    return res.status(403).json({ error: 'Campaign belongs to another commander.' });
  }

  try {
    const result = await prisma.$transaction(async tx => {
      // 1. Campaign head (create on first turn, advance otherwise).
      const campaign = await tx.imperiumCampaign.upsert({
        where: { id: payload.campaign.id },
        create: {
          id: payload.campaign.id,
          userId,
          era: payload.campaign.era,
          seed: payload.campaign.seed,
          playerRosterId: payload.campaign.playerRosterId,
          rivalRosterId: payload.campaign.rivalRosterId,
          playerLeaderId: payload.campaign.playerLeaderId,
          rivalLeaderId: payload.campaign.rivalLeaderId,
          currentTurn: payload.turn,
          over: payload.over ?? false,
          playerWon: payload.playerWon ?? false,
        },
        update: {
          currentTurn: payload.turn,
          over: payload.over ?? false,
          playerWon: payload.playerWon ?? false,
        },
      });

      // 2. The turn block itself. Re-submitting the same turn (client retry
      //    after a dropped response) overwrites idempotently.
      await tx.imperiumTurnSnapshot.upsert({
        where: { campaignId_turn: { campaignId: campaign.id, turn: payload.turn } },
        create: { campaignId: campaign.id, turn: payload.turn, state: payload.state as Prisma.InputJsonValue, checksum },
        update: { state: payload.state as Prisma.InputJsonValue, checksum },
      });

      // 3. Ring pruning: keep the newest SNAPSHOT_RING turns (turn 0 — the
      //    campaign genesis — is always retained as the ultimate rollback).
      const cutoff = payload.turn - SNAPSHOT_RING;
      if (cutoff > 0) {
        await tx.imperiumTurnSnapshot.deleteMany({
          where: { campaignId: campaign.id, turn: { lt: cutoff, gt: 0 } },
        });
      }
      return campaign;
    });

    // Campaign-shelf eviction (outside the hot transaction — best effort).
    const count = await prisma.imperiumCampaign.count({ where: { userId } });
    if (count > MAX_CAMPAIGNS_PER_USER) {
      const oldest = await prisma.imperiumCampaign.findMany({
        where: { userId },
        orderBy: { updatedAt: 'asc' },
        take: count - MAX_CAMPAIGNS_PER_USER,
        select: { id: true },
      });
      await prisma.imperiumCampaign.deleteMany({ where: { id: { in: oldest.map(o => o.id) } } });
    }

    res.json({ ok: true, currentTurn: result.currentTurn, checksum });
  } catch (err) {
    console.error('imperium turn append failed', err);
    res.status(500).json({ error: 'Failed to persist turn block.' });
  }
});

// ── POST /api/imperium/campaigns/:id/rollback — transactional time travel ────
// { turn } → restore the campaign head to that stored turn. The multi-table
// rollback runs as ONE transaction: verify target exists → move the head →
// prune every snapshot above it. If any step fails the whole thing unwinds and
// the campaign stays exactly where it was.

imperiumRouter.post('/campaigns/:id/rollback', async (req: Request, res: Response) => {
  const turn = Number((req.body as { turn?: unknown })?.turn);
  if (!Number.isInteger(turn) || turn < 0) return res.status(400).json({ error: 'Invalid rollback turn.' });

  const campaign = await prisma.imperiumCampaign.findFirst({
    where: { id: req.params.id, userId: req.auth!.userId },
    select: { id: true, currentTurn: true },
  });
  if (!campaign) return res.status(404).json({ error: 'Campaign not found.' });
  if (turn > campaign.currentTurn) return res.status(400).json({ error: 'Cannot roll forward.' });

  try {
    const restored = await prisma.$transaction(async tx => {
      const target = await tx.imperiumTurnSnapshot.findUnique({
        where: { campaignId_turn: { campaignId: campaign.id, turn } },
      });
      if (!target) throw new RollbackError(404, 'That turn is no longer stored.');
      if (snapshotChecksum(JSON.stringify(target.state)) !== target.checksum) {
        throw new RollbackError(500, 'Stored snapshot failed integrity check.');
      }
      // Campaign first, snapshots second — same ordering as the append path.
      await tx.imperiumCampaign.update({
        where: { id: campaign.id },
        data: { currentTurn: turn, over: false, playerWon: false },
      });
      await tx.imperiumTurnSnapshot.deleteMany({
        where: { campaignId: campaign.id, turn: { gt: turn } },
      });
      return target;
    });
    res.json({ ok: true, turn: restored.turn, state: restored.state, checksum: restored.checksum });
  } catch (err) {
    if (err instanceof RollbackError) return res.status(err.status).json({ error: err.message });
    console.error('imperium rollback failed', err);
    res.status(500).json({ error: 'Rollback failed — campaign state unchanged.' });
  }
});

class RollbackError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

// ── DELETE /api/imperium/campaigns/:id — abandon a campaign ──────────────────
// Snapshot rows cascade with the campaign (onDelete: Cascade).

imperiumRouter.delete('/campaigns/:id', async (req: Request, res: Response) => {
  const { count } = await prisma.imperiumCampaign.deleteMany({
    where: { id: req.params.id, userId: req.auth!.userId },
  });
  if (count === 0) return res.status(404).json({ error: 'Campaign not found.' });
  res.json({ ok: true });
});
