import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordFriendEvent, loadActivity, clearActivity, simulateFriendActivity,
  buildActivityFeed, relativeAge, type ActivityFriend,
} from '@/features/friends/friendActivity';
import {
  saveThread, markThreadRead, unreadCount, lastMessage, autoReplyFor, type ChatMsg,
} from '@/features/friends/friendInteractions';

const store = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
} as Storage;

const friend = (o: Partial<ActivityFriend> = {}): ActivityFriend => ({
  id: 'm1', username: 'HistoriaClio', xp: 5840, streak: 62, ...o,
});

describe('friend activity log', () => {
  beforeEach(() => localStorage.clear());

  it('records events newest-first', () => {
    recordFriendEvent('u1', { type: 'friend_added', friendId: 'm1', friendName: 'A' });
    recordFriendEvent('u1', { type: 'duel_win', friendId: 'm1', friendName: 'A' });
    const log = loadActivity('u1');
    expect(log).toHaveLength(2);
    expect(log[0].type).toBe('duel_win');
  });

  it('gives every event a distinct id', () => {
    for (let i = 0; i < 20; i++) {
      recordFriendEvent('u1', { type: 'message', friendId: 'm1', friendName: 'A' });
    }
    const ids = loadActivity('u1').map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('caps the log so it cannot grow without bound', () => {
    for (let i = 0; i < 120; i++) {
      recordFriendEvent('u1', { type: 'message', friendId: 'm1', friendName: 'A' });
    }
    expect(loadActivity('u1').length).toBeLessThanOrEqual(60);
  });

  it('keeps learners separate and survives corrupted storage', () => {
    recordFriendEvent('u1', { type: 'gift', friendId: 'm1', friendName: 'A' });
    expect(loadActivity('u2')).toEqual([]);
    localStorage.setItem('historify:friendActivity:u3', 'not json');
    expect(() => loadActivity('u3')).not.toThrow();
    expect(loadActivity('u3')).toEqual([]);
  });

  it('clears cleanly', () => {
    recordFriendEvent('u1', { type: 'gift', friendId: 'm1', friendName: 'A' });
    clearActivity('u1');
    expect(loadActivity('u1')).toEqual([]);
  });
});

describe('simulated friend activity', () => {
  it('is deterministic — the same friend yields the same feed twice', () => {
    // `now` is pinned: the feed places today's entries inside the part of the
    // day that has elapsed, so it is a function of the clock as well as the
    // seed. Passing the same instant is what makes "same input, same output"
    // a claim about the code rather than about how fast the test ran.
    const at = Date.parse('2026-08-19T14:37:00Z');
    const a = simulateFriendActivity(friend(), 7, at);
    const b = simulateFriendActivity(friend(), 7, at);
    expect(a.map(e => e.id)).toEqual(b.map(e => e.id));
    expect(a.map(e => e.at)).toEqual(b.map(e => e.at));
  });

  it('is stable across a millisecond, without pinning the clock', () => {
    const a = simulateFriendActivity(friend());
    const b = simulateFriendActivity(friend());
    expect(a.map(e => e.at)).toEqual(b.map(e => e.at));
  });

  it('differs between friends', () => {
    const a = simulateFriendActivity(friend({ id: 'm1' }));
    const b = simulateFriendActivity(friend({ id: 'm4', username: 'Other', xp: 100, streak: 3 }));
    expect(a.map(e => e.id)).not.toEqual(b.map(e => e.id));
  });

  it('marks every synthesised entry as simulated', () => {
    expect(simulateFriendActivity(friend()).every(e => e.simulated === true)).toBe(true);
  });

  it('never dates an entry in the future', () => {
    const now = Date.now();
    expect(simulateFriendActivity(friend(), 7, now).every(e => Date.parse(e.at) <= now)).toBe(true);
  });

  it('never dates an entry in the future in the small hours', () => {
    // The case the old clamp existed for: just after midnight, every hour in
    // the 8–19 band the generator used to draw from is still ahead.
    const justAfterMidnight = Date.parse('2026-08-19T00:39:00Z');
    const feed = simulateFriendActivity(friend(), 7, justAfterMidnight);
    expect(feed.length).toBeGreaterThan(0);
    expect(feed.every(e => Date.parse(e.at) <= justAfterMidnight)).toBe(true);
  });

  it('does not collapse today\u2019s entries onto one instant', () => {
    const noon = Date.parse('2026-08-19T12:00:00Z');
    const today = [
      ...simulateFriendActivity(friend({ id: 'a', streak: 60 }), 1, noon),
      ...simulateFriendActivity(friend({ id: 'b', streak: 60 }), 1, noon),
      ...simulateFriendActivity(friend({ id: 'c', streak: 60 }), 1, noon),
    ];
    expect(today.length).toBeGreaterThan(1);
    expect(new Set(today.map(e => e.at)).size).toBeGreaterThan(1);
  });

  it('gives a busier friend more activity than a dormant one', () => {
    const busy = simulateFriendActivity(friend({ id: 'seed-a', streak: 60 }), 30);
    const idle = simulateFriendActivity(friend({ id: 'seed-a', streak: 0 }), 30);
    expect(busy.length).toBeGreaterThan(idle.length);
  });

  it('only claims a streak for today — a streak is a running total', () => {
    const streaks = simulateFriendActivity(friend(), 14).filter(e => e.type === 'friend_streak');
    expect(streaks.length).toBeLessThanOrEqual(1);
  });

  it('reports XP only for today, for the same reason', () => {
    const xp = simulateFriendActivity(friend(), 14).filter(e => e.type === 'friend_levelup');
    expect(xp.length).toBeLessThanOrEqual(1);
  });

  it('keeps every generated number inside its intended range', () => {
    // `seed >> n` coerces to int32, so seeds at or above 2^31 went negative and
    // produced "completed a lesson ×0" and quiz scores under the 60% floor.
    // Sweep many friend ids so the high-bit seeds are actually exercised.
    for (let i = 0; i < 300; i++) {
      for (const ev of simulateFriendActivity(friend({ id: `probe-${i}`, streak: 60 }), 21)) {
        if (ev.type === 'friend_lesson') {
          expect(ev.meta!.count!).toBeGreaterThanOrEqual(1);
          expect(ev.meta!.count!).toBeLessThanOrEqual(3);
        }
        if (ev.type === 'friend_quiz') {
          expect(ev.meta!.score!).toBeGreaterThanOrEqual(60);
          expect(ev.meta!.score!).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  it('never times an entry outside the day it belongs to', () => {
    // A negative hour would roll the entry into the previous day.
    for (let i = 0; i < 200; i++) {
      for (const ev of simulateFriendActivity(friend({ id: `hour-${i}`, streak: 60 }), 10)) {
        const h = new Date(ev.at).getHours();
        expect(h).toBeGreaterThanOrEqual(0);
        expect(h).toBeLessThanOrEqual(23);
      }
    }
  });
});

describe('buildActivityFeed', () => {
  beforeEach(() => localStorage.clear());

  it('merges real and simulated entries, newest first', () => {
    recordFriendEvent('u1', { type: 'duel_win', friendId: 'm1', friendName: 'HistoriaClio' });
    const feed = buildActivityFeed('u1', [friend()]);
    expect(feed.length).toBeGreaterThan(1);
    for (let i = 1; i < feed.length; i++) {
      expect(Date.parse(feed[i - 1].at)).toBeGreaterThanOrEqual(Date.parse(feed[i].at));
    }
  });

  it('drops events for people no longer on the friends list', () => {
    recordFriendEvent('u1', { type: 'duel_win', friendId: 'gone', friendName: 'Gone' });
    const feed = buildActivityFeed('u1', [friend()]);
    expect(feed.some(e => e.friendId === 'gone')).toBe(false);
  });

  it('is empty for a learner with no friends and no history', () => {
    expect(buildActivityFeed('u1', [])).toEqual([]);
  });

  it('respects the limit', () => {
    expect(buildActivityFeed('u1', [friend(), friend({ id: 'm2', username: 'B' })], 5).length)
      .toBeLessThanOrEqual(5);
  });
});

describe('relativeAge', () => {
  const now = Date.parse('2026-08-17T12:00:00Z');
  const ago = (ms: number) => new Date(now - ms).toISOString();

  it('reads the right unit at each scale', () => {
    expect(relativeAge(ago(10_000), now)).toEqual({ value: 0, unit: 'now' });
    expect(relativeAge(ago(5 * 60_000), now)).toEqual({ value: 5, unit: 'm' });
    expect(relativeAge(ago(3 * 3_600_000), now)).toEqual({ value: 3, unit: 'h' });
    expect(relativeAge(ago(2 * 86_400_000), now)).toEqual({ value: 2, unit: 'd' });
  });

  it('never reports a negative age for a clock skewed into the future', () => {
    expect(relativeAge(new Date(now + 60_000).toISOString(), now).unit).toBe('now');
  });
});

describe('unread messages', () => {
  beforeEach(() => localStorage.clear());

  const msg = (from: string, text: string, ts: string): ChatMsg => ({ id: text, from, text, ts });

  it('counts only the friend’s messages since the thread was last read', () => {
    const base = Date.parse('2026-08-17T10:00:00Z');
    saveThread('u1', 'm1', [
      msg('me', 'hi', new Date(base).toISOString()),
      msg('m1', 'hey', new Date(base + 1000).toISOString()),
    ]);
    // Never opened: the friend's message is unread.
    expect(unreadCount('u1', 'm1')).toBe(1);

    markThreadRead('u1', 'm1', new Date(base + 2000).toISOString());
    expect(unreadCount('u1', 'm1')).toBe(0);

    saveThread('u1', 'm1', [
      ...[msg('me', 'hi', new Date(base).toISOString()), msg('m1', 'hey', new Date(base + 1000).toISOString())],
      msg('m1', 'later', new Date(base + 5000).toISOString()),
    ]);
    expect(unreadCount('u1', 'm1')).toBe(1);
  });

  it('never counts the learner’s own messages as unread', () => {
    saveThread('u1', 'm1', [msg('me', 'a', new Date().toISOString()), msg('me', 'b', new Date().toISOString())]);
    expect(unreadCount('u1', 'm1')).toBe(0);
  });

  it('reports the last message for the preview line', () => {
    saveThread('u1', 'm1', [msg('me', 'first', '2026-08-17T10:00:00Z'), msg('m1', 'last', '2026-08-17T11:00:00Z')]);
    expect(lastMessage('u1', 'm1')?.text).toBe('last');
    expect(lastMessage('u1', 'nobody')).toBeNull();
  });
});

describe('autoReplyFor', () => {
  it('picks from the pool it is given, so replies follow the UI language', () => {
    const pool = ['uno', 'dos', 'tres'];
    for (let seed = 0; seed < 20; seed++) {
      expect(pool).toContain(autoReplyFor('m1', seed, pool));
    }
  });

  it('returns an empty string rather than crashing on an empty pool', () => {
    expect(autoReplyFor('m1', 3, [])).toBe('');
  });
});
