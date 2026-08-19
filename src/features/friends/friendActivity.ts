// ─── Friend activity feed ─────────────────────────────────────────────────────
// The social layer had no activity surface at all: you could add someone, message
// them and duel them, and none of it left a trace you could look back at.
//
// Two things feed this timeline:
//   • REAL events, recorded as they happen — a friend accepted, a duel resolved,
//     a gift sent, a message exchanged. These are the learner's own history and
//     are persisted.
//   • FRIEND-SIDE events, derived from each friend's stats. Friends are local
//     fixtures with no server behind them, so their activity is synthesised —
//     but deterministically, seeded by friend id and calendar day, so the feed
//     is stable across renders and reloads instead of reshuffling every paint.
//
// Both are merged newest-first by the reader. Synthesised entries are marked
// `simulated` so the UI can be honest about which is which.
import type { EraId } from '@/types';

export type FriendEventType =
  | 'friend_added'
  | 'duel_win'
  | 'duel_loss'
  | 'message'
  | 'gift'
  | 'friend_lesson'
  | 'friend_quiz'
  | 'friend_streak'
  | 'friend_levelup';

export interface FriendEvent {
  id: string;
  type: FriendEventType;
  friendId: string;
  friendName: string;
  /** ISO timestamp. */
  at: string;
  /** Type-specific detail rendered into the row's label. */
  meta?: { score?: number; xp?: number; streak?: number; eraId?: EraId; count?: number };
  /** True for friend-side entries with no server behind them. */
  simulated?: boolean;
}

const KEY = (userId: string) => `historify:friendActivity:${userId}`;
const MAX_STORED = 60;

export function loadActivity(userId: string): FriendEvent[] {
  try {
    const raw = localStorage.getItem(KEY(userId));
    const parsed = raw ? (JSON.parse(raw) as FriendEvent[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

/** Record something the learner actually did. Newest first, capped. */
export function recordFriendEvent(
  userId: string,
  event: Omit<FriendEvent, 'id' | 'at'> & { at?: string },
): void {
  if (!userId) return;
  const entry: FriendEvent = {
    ...event,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    at: event.at ?? new Date().toISOString(),
  };
  const next = [entry, ...loadActivity(userId)].slice(0, MAX_STORED);
  try { localStorage.setItem(KEY(userId), JSON.stringify(next)); } catch { /* best-effort */ }
}

export function clearActivity(userId: string): void {
  try { localStorage.removeItem(KEY(userId)); } catch { /* ignore */ }
}

// ── Friend-side activity ──────────────────────────────────────────────────────

/** Deterministic 32-bit hash, so the same seed always yields the same feed. */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const ERAS_POOL: EraId[] = ['prehistoric', 'ancient', 'byzantine', 'middle-ages', 'early-modern', 'modern'];

export interface ActivityFriend { id: string; username: string; xp: number; streak: number }

/**
 * What a friend has been up to over the last `days` days.
 *
 * Seeded by friend id + date, so a given friend's Tuesday is always the same
 * Tuesday. Busier friends (higher XP, longer streaks) generate more entries,
 * which keeps the feed proportional to the leaderboard rather than uniform.
 */
export function simulateFriendActivity(friend: ActivityFriend, days = 7, now = Date.now()): FriendEvent[] {
  const out: FriendEvent[] = [];
  // A friend on a long streak studies most days; a casual one rarely.
  const activeChance = Math.min(0.85, 0.25 + friend.streak / 60);

  // Minutes of today that have actually happened. Today's entries are drawn
  // from this window rather than from the 8–19 band, so one can never be
  // stamped later than the moment it is read — at 00:39 every hour in that
  // band is still ahead of the clock.
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const elapsedMinutes = Math.max(1, Math.floor((now - startOfToday.getTime()) / 60_000));

  for (let d = 0; d < days; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const dayStamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const seed = hash(`${friend.id}:${dayStamp}`);

    if ((seed % 100) / 100 >= activeChance) continue;

    // Shift UNSIGNED. `seed >> n` coerces to int32, so any seed at or above
    // 2^31 came back negative and `1 + (neg % 3)` produced counts of 0 and
    // quiz scores below the intended floor — "completed a lesson ×0" and
    // "scored 20%" against a 60–100 range. A negative hour would also have
    // rolled the entry into the previous day.
    const bits = (n: number) => (seed >>> n);

    const kind = seed % 4;
    if (d === 0) {
      // Somewhere in the part of today that has already happened.
      //
      // The earlier version clamped a future timestamp down to Date.now(),
      // which was worse than the bug it fixed: every one of today's entries
      // collapsed onto the same instant, and the function stopped being a
      // function — two calls a millisecond apart returned different data. It
      // is quantised to the minute here so the result is stable for anyone
      // reading it, and `now` is a parameter so callers can pin it outright.
      const offset = bits(8) % elapsedMinutes;
      date.setHours(0, offset, 0, 0);
    } else {
      // Spread entries through the day rather than stacking them at midnight.
      date.setHours(8 + (bits(8) % 12), bits(16) % 60, 0, 0);
    }
    const at = date.toISOString();
    const eraId = ERAS_POOL[bits(5) % ERAS_POOL.length];
    const base = { friendId: friend.id, friendName: friend.username, at, simulated: true as const };

    if (kind === 0) {
      out.push({ ...base, id: `sim-${friend.id}-${d}-l`, type: 'friend_lesson', meta: { eraId, count: 1 + (bits(3) % 3) } });
    } else if (kind === 1) {
      out.push({ ...base, id: `sim-${friend.id}-${d}-q`, type: 'friend_quiz', meta: { eraId, score: 60 + (bits(7) % 41) } });
    } else if (kind === 2 && d === 0 && friend.streak > 0) {
      // Only claim a streak on the most recent day; a streak is a running
      // total, so reporting one for last Tuesday as well would be nonsense.
      out.push({ ...base, id: `sim-${friend.id}-${d}-s`, type: 'friend_streak', meta: { streak: friend.streak } });
    } else if (kind === 3 && d === 0) {
      // Same reasoning: XP is a running total, so "reached 5,840 XP" repeated
      // on four separate days reads as broken data.
      out.push({ ...base, id: `sim-${friend.id}-${d}-x`, type: 'friend_levelup', meta: { xp: friend.xp } });
    } else {
      out.push({ ...base, id: `sim-${friend.id}-${d}-l`, type: 'friend_lesson', meta: { eraId, count: 1 + (bits(11) % 2) } });
    }
  }
  return out;
}

/**
 * The merged feed: real recorded events plus friend-side activity, newest
 * first. Events for people no longer on the friends list are dropped, so
 * removing a friend also removes their noise.
 */
export function buildActivityFeed(
  userId: string, friends: ActivityFriend[], limit = 40, now = Date.now(),
): FriendEvent[] {
  const known = new Set(friends.map(f => f.id));
  const real = loadActivity(userId).filter(e => known.has(e.friendId) || e.type === 'friend_added');
  // One `now` for every friend, so the whole feed is a snapshot of one instant.
  const simulated = friends.flatMap(f => simulateFriendActivity(f, 7, now));
  return [...real, ...simulated]
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
    .slice(0, limit);
}

/** `just now` / `3h` / `2d` — compact relative age for a feed row. */
export function relativeAge(iso: string, now = Date.now()): { value: number; unit: 'now' | 'm' | 'h' | 'd' } {
  const diff = Math.max(0, now - Date.parse(iso));
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return { value: 0, unit: 'now' };
  if (mins < 60) return { value: mins, unit: 'm' };
  const hours = Math.floor(mins / 60);
  if (hours < 24) return { value: hours, unit: 'h' };
  return { value: Math.floor(hours / 24), unit: 'd' };
}
