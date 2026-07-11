// ─── Global leaderboard ───────────────────────────────────────────────────────
// Ranks users by the XP inside their synced ProgressSnapshot blob. The XP
// lives in JSON (client-authoritative sync), so ranking extracts it with
// Postgres JSON operators via a parameter-free raw query — no user input
// reaches the SQL. Results are cached for a minute: leaderboards tolerate
// staleness far better than they tolerate a full-table JSON scan per request.
import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const leaderboardRouter = Router();

interface Row { userId: string; username: string; tier: string; xp: number; level: number; streak: number }

const CACHE_TTL_MS = 60 * 1000;
const TOP_N = 100;
let cache: { rows: Row[]; at: number } | null = null;

async function topRows(): Promise<Row[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.rows;
  const rows = await prisma.$queryRaw<Row[]>`
    SELECT u.id as "userId",
           u.username,
           u.tier::text as tier,
           COALESCE((p.data->>'xp')::int, 0)     as xp,
           COALESCE((p.data->>'level')::int, 1)  as level,
           COALESCE((p.data->>'streak')::int, 0) as streak
    FROM "ProgressSnapshot" p
    JOIN "User" u ON u.id = p."userId"
    ORDER BY COALESCE((p.data->>'xp')::int, 0) DESC
    LIMIT ${TOP_N}
  `;
  cache = { rows, at: Date.now() };
  return rows;
}

// GET /api/leaderboard — top 100 by XP.
leaderboardRouter.get('/', async (_req: Request, res: Response) => {
  const rows = await topRows();
  res.json({ leaderboard: rows.map((r, i) => ({ rank: i + 1, ...r })) });
});

// GET /api/leaderboard/me — the caller's global rank (exact, uncached count).
leaderboardRouter.get('/me', async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const mine = await prisma.progressSnapshot.findUnique({ where: { userId } });
  const myXp = mine ? Number((mine.data as { xp?: number })?.xp ?? 0) : 0;
  const [{ ahead }] = await prisma.$queryRaw<[{ ahead: bigint }]>`
    SELECT COUNT(*)::bigint as ahead
    FROM "ProgressSnapshot"
    WHERE COALESCE((data->>'xp')::int, 0) > ${myXp}
  `;
  res.json({ rank: Number(ahead) + 1, xp: myXp });
});
