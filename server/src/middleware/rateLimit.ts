// ─── Sliding-window rate limiter ──────────────────────────────────────────────
// In-memory per-key limiter (key = authenticated user id, else client IP).
// Deliberately dependency-free: a Map of timestamp arrays with periodic sweep.
// For a single-node deployment this is exact; behind a horizontal scale-out it
// degrades gracefully to per-node limits (still a real cap, N× looser), and
// the interface stays identical if the store is later swapped for Redis.
import type { Request, Response, NextFunction } from 'express';

interface Options {
  windowMs: number;
  max: number;
  /** Human label used in the 429 body. */
  scope: string;
}

export function rateLimit({ windowMs, max, scope }: Options) {
  const hits = new Map<string, number[]>();

  // Sweep expired windows so the map cannot grow unbounded under IP churn.
  const sweep = setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [key, arr] of hits) {
      const alive = arr.filter(ts => ts > cutoff);
      if (alive.length === 0) hits.delete(key);
      else hits.set(key, alive);
    }
  }, windowMs);
  sweep.unref(); // never keep the process alive for a limiter

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.auth?.userId ?? req.ip ?? 'anon';
    const now = Date.now();
    const cutoff = now - windowMs;
    const arr = (hits.get(key) ?? []).filter(ts => ts > cutoff);
    if (arr.length >= max) {
      const retryAfterSec = Math.ceil((arr[0] + windowMs - now) / 1000);
      res.setHeader('Retry-After', String(Math.max(1, retryAfterSec)));
      return res.status(429).json({ error: `Too many ${scope} requests — try again shortly.` });
    }
    arr.push(now);
    hits.set(key, arr);
    next();
  };
}
