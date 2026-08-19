// ─── The social graph, online or off ─────────────────────────────────────────
// FriendsPage used to hold two things at once: the UI, and a simulation of a
// social network. Friends were fixtures in MOCK_USERS, a sent request was
// "accepted" by a timer, and the one server call it made sent a field name the
// API does not read. Nothing left the browser.
//
// This hook is the seam. It answers the same questions either way — who are my
// friends, who is online, what is waiting on me — and the page renders the
// answer without caring which world produced it.
//
//   ONLINE          real accounts over /api/social, live over a socket.
//   UNAUTHENTICATED a server is configured but this browser has no session.
//                   Reported, never faked: an empty friends list here means
//                   "sign in", not "you have no friends".
//   OFFLINE         no backend. The local fixtures, unchanged, and labelled.
//
// Everything the server pushes is a notification about state that is already
// durable, so handlers refresh rather than patching a local cache — a dropped
// frame costs an update, never data.

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  socialApiConfigured, socialMode, isApiError,
  fetchServerFriends, fetchFriendRequests, fetchOnlineFriendIds, searchLearners,
  sendFriendRequest, respondToRequest, cancelFriendRequest, removeFriend as apiRemoveFriend,
  apiSendMessage, apiChallengeDuel, fetchServerActivity, onSocial, connectSocial,
  type SocialMode, type ServerFriend,
} from '@/services/social';
import {
  recordFriendEvent, buildActivityFeed, type FriendEvent,
} from '@/features/friends/friendActivity';
import { unreadCount, lastMessage } from '@/features/friends/friendInteractions';

// ── Shapes the page renders ───────────────────────────────────────────────────

export interface SocialFriend {
  id: string;
  username: string;
  xp: number;
  videoXp: number;
  country: string;
  streak: number;
  online: boolean;
  unread: number;
  preview: string;
}

export interface SocialCandidate {
  id: string;
  username: string;
  xp: number;
  /** Drives the chess rank badge. Server accounts report their real figure. */
  videoXp: number;
  country: string;
  online: boolean;
}

export interface PendingRequest {
  /** Server request id. Empty offline, where requests are keyed by user. */
  id: string;
  userId: string;
  username: string;
  at: string;
}

export interface ActionResult { ok: boolean; message?: string }

// ── Local (offline) fixtures ──────────────────────────────────────────────────

const MOCK_USERS = [
  { id: 'm1', username: 'HistoriaClio',   xp: 5840, videoXp: 2200, country: '🇩🇪', streak: 62 },
  { id: 'm2', username: 'ChronoMaster',   xp: 5210, videoXp: 1800, country: '🇫🇷', streak: 44 },
  { id: 'm3', username: 'TimeTraveler99', xp: 4780, videoXp: 1400, country: '🇬🇧', streak: 38 },
  { id: 'm4', username: 'AncientScholar', xp: 4120, videoXp: 900,  country: '🇮🇹', streak: 27 },
  { id: 'm5', username: 'MedievalMind',   xp: 3650, videoXp: 600,  country: '🇪🇸', streak: 19 },
];

type LocalFriend = Omit<SocialFriend, 'online' | 'unread' | 'preview'>;
type SentEntry = { id: string; at: string };
type ReceivedEntry = { fromId: string; fromUsername: string; xp: number };

/**
 * How long a locally sent request stays pending before it is accepted.
 *
 * Offline there is nobody on the other side, so acceptance has to be
 * simulated or adding a friend is a dead end that blocks messaging, duels and
 * gifts behind a request nothing will ever answer. Staggered per person so
 * they do not all land at once.
 */
const ACCEPT_BASE_MS = 6_000;
const ACCEPT_JITTER_MS = 9_000;

function acceptDelayFor(id: string): number {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ACCEPT_BASE_MS + (h % ACCEPT_JITTER_MS);
}

function storageKey(type: 'friends' | 'sent' | 'received', userId: string): string {
  if (type === 'friends') return `historify:friends:${userId}`;
  if (type === 'sent') return `historify:friendRequests:sent:${userId}`;
  return `historify:friendRequests:received:${userId}`;
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function saveJSON<T>(key: string, data: T): void {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* quota — best effort */ }
}

/** Sent requests were once a bare id list; keep those readable. */
function normaliseSent(raw: unknown): SentEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(v => (typeof v === 'string'
      ? { id: v, at: new Date(0).toISOString() }
      : v && typeof (v as SentEntry).id === 'string'
        ? { id: (v as SentEntry).id, at: (v as SentEntry).at ?? new Date().toISOString() }
        : null))
    .filter((v): v is SentEntry => v !== null);
}

// ── The hook ──────────────────────────────────────────────────────────────────

export interface SocialGraph {
  mode: SocialMode;
  /** False until the mode has been determined. */
  ready: boolean;
  friends: SocialFriend[];
  incoming: PendingRequest[];
  outgoing: PendingRequest[];
  activity: FriendEvent[];
  /** True when `activity` is derived rather than recorded. */
  activitySimulated: boolean;

  search(query: string): Promise<SocialCandidate[]>;
  add(candidate: SocialCandidate): Promise<ActionResult>;
  accept(request: PendingRequest): Promise<ActionResult>;
  decline(request: PendingRequest): Promise<ActionResult>;
  cancel(request: PendingRequest): Promise<ActionResult>;
  remove(friend: SocialFriend): Promise<ActionResult>;
  message(friendId: string, text: string): Promise<ActionResult>;
  challenge(friendId: string): Promise<ActionResult>;
  refresh(): void;
}

const PRESENCE_POLL_MS = 30_000;

export function useSocialGraph(userId: string, currentUsername: string): SocialGraph {
  const [mode, setMode] = useState<SocialMode>(socialApiConfigured() ? 'offline' : 'offline');
  const [ready, setReady] = useState(!socialApiConfigured());
  const [friends, setFriends] = useState<SocialFriend[]>([]);
  const [incoming, setIncoming] = useState<PendingRequest[]>([]);
  const [outgoing, setOutgoing] = useState<PendingRequest[]>([]);
  const [activity, setActivity] = useState<FriendEvent[]>([]);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick(v => v + 1), []);

  // Keep the latest mode readable inside intervals without re-subscribing.
  const modeRef = useRef(mode);
  modeRef.current = mode;

  // ── Which world are we in ──
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const m = await socialMode();
      if (cancelled) return;
      setMode(m);
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [userId]);

  // ── Load the graph ──
  useEffect(() => {
    if (!userId || !ready) return;
    let cancelled = false;

    if (mode === 'online') {
      void (async () => {
        const [serverFriends, requests, events] = await Promise.all([
          fetchServerFriends(), fetchFriendRequests(), fetchServerActivity(),
        ]);
        if (cancelled) return;
        if (serverFriends) setFriends(serverFriends.map(toSocialFriend));
        if (requests) {
          setIncoming(requests.incoming.map(r => ({ id: r.id, userId: r.user.id, username: r.user.username, at: r.at })));
          setOutgoing(requests.outgoing.map(r => ({ id: r.id, userId: r.user.id, username: r.user.username, at: r.at })));
        }
        if (events) {
          setActivity(events.map(e => ({
            id: e.id,
            type: e.type === 'message' ? 'message'
              : e.type === 'friend_added' ? 'friend_added'
              : e.type === 'duel_accepted' ? 'duel_win' : 'duel_loss',
            friendId: e.friendId,
            friendName: e.friendName,
            at: e.at,
          })));
        }
      })();
      return () => { cancelled = true; };
    }

    // Offline / unauthenticated: local fixtures. An unauthenticated session
    // still shows the local set rather than an empty page, but the caller
    // labels it — see `mode`.
    const local = loadJSON<LocalFriend[]>(storageKey('friends', userId), []);
    const received = loadJSON<ReceivedEntry[]>(storageKey('received', userId), []);
    const sent = normaliseSent(loadJSON<unknown>(storageKey('sent', userId), []));
    setFriends(local.map(f => ({
      ...f,
      online: false,
      unread: unreadCount(userId, f.id),
      preview: lastMessage(userId, f.id)?.text ?? '',
    })));
    setIncoming(received.map(r => ({ id: '', userId: r.fromId, username: r.fromUsername, at: new Date().toISOString() })));
    setOutgoing(sent.map(s => ({
      id: '', userId: s.id,
      username: MOCK_USERS.find(u => u.id === s.id)?.username ?? s.id,
      at: s.at,
    })));
    setActivity(buildActivityFeed(userId, local.map(f => ({ id: f.id, username: f.username, xp: f.xp, streak: f.streak }))));
    return () => { cancelled = true; };
  }, [userId, mode, ready, tick]);

  // ── Live layer (online only) ──
  useEffect(() => {
    if (mode !== 'online' || !userId) return;
    connectSocial();
    const offs = [
      onSocial('friend:request', refresh),
      onSocial('friend:accepted', refresh),
      onSocial('friend:removed', refresh),
      onSocial('dm:new', refresh),
      onSocial('duel:incoming', refresh),
      // Presence is a single flag, so patch it in place instead of refetching
      // the whole graph every time a friend opens or closes a tab.
      onSocial('presence', ({ userId: who, online }) => {
        setFriends(prev => prev.map(f => (f.id === who ? { ...f, online } : f)));
      }),
    ];
    const syncPresence = async () => {
      const ids = await fetchOnlineFriendIds();
      if (!ids) return;
      const live = new Set(ids);
      setFriends(prev => prev.map(f => ({ ...f, online: live.has(f.id) })));
    };
    // The socket is the fast path, not the only one: a poll keeps presence
    // honest if the connection silently drops.
    const timer = setInterval(() => { void syncPresence(); }, PRESENCE_POLL_MS);
    void syncPresence();
    return () => { offs.forEach(off => off()); clearInterval(timer); };
  }, [mode, userId, refresh]);

  // ── Offline only: resolve simulated requests ──
  useEffect(() => {
    if (mode === 'online' || !userId || outgoing.length === 0) return;
    const resolve = () => {
      const now = Date.now();
      const sent = normaliseSent(loadJSON<unknown>(storageKey('sent', userId), []));
      const ready2 = sent.filter(s => now - Date.parse(s.at) >= acceptDelayFor(s.id));
      if (ready2.length === 0) return;

      const readyIds = new Set(ready2.map(s => s.id));
      const current = loadJSON<LocalFriend[]>(storageKey('friends', userId), []);
      const added = ready2
        .map(s => MOCK_USERS.find(u => u.id === s.id))
        .filter((u): u is typeof MOCK_USERS[number] => Boolean(u))
        .filter(u => !current.some(f => f.id === u.id));

      saveJSON(storageKey('sent', userId), sent.filter(s => !readyIds.has(s.id)));
      if (added.length > 0) {
        saveJSON(storageKey('friends', userId), [...current, ...added.map(u => ({ ...u }))]);
        for (const u of added) {
          recordFriendEvent(userId, { type: 'friend_added', friendId: u.id, friendName: u.username });
        }
      }
      refresh();
    };
    resolve();
    const timer = setInterval(resolve, 2_000);
    return () => clearInterval(timer);
  }, [mode, userId, outgoing.length, refresh]);

  // ── Actions ──

  const search = useCallback(async (query: string): Promise<SocialCandidate[]> => {
    const q = query.trim();
    if (q.length === 0) return [];
    if (modeRef.current === 'online') {
      const results = await searchLearners(q);
      return (results ?? []).map(u => ({
        id: u.id, username: u.username,
        xp: u.xp ?? 0, videoXp: u.videoXp ?? 0, country: '',
        online: !!u.online,
      }));
    }
    const known = new Set(friends.map(f => f.id));
    return MOCK_USERS
      .filter(u => u.id !== userId && !known.has(u.id))
      .filter(u => u.username.toLowerCase().includes(q.toLowerCase()))
      .map(u => ({ id: u.id, username: u.username, xp: u.xp, videoXp: u.videoXp, country: u.country, online: false }));
  }, [friends, userId]);

  const add = useCallback(async (candidate: SocialCandidate): Promise<ActionResult> => {
    if (modeRef.current === 'online') {
      const res = await sendFriendRequest(candidate.id);
      if (!res || isApiError(res)) return { ok: false, message: isApiError(res) ? res.error : undefined };
      refresh();
      return { ok: true, message: res.status === 'friends' ? 'mutual' : 'pending' };
    }
    const sent = normaliseSent(loadJSON<unknown>(storageKey('sent', userId), []));
    if (sent.some(s => s.id === candidate.id)) return { ok: true, message: 'pending' };
    saveJSON(storageKey('sent', userId), [...sent, { id: candidate.id, at: new Date().toISOString() }]);
    // Mirror into the other fixture's inbox, so the demo is symmetric.
    const theirs = loadJSON<ReceivedEntry[]>(storageKey('received', candidate.id), []);
    saveJSON(storageKey('received', candidate.id), [
      ...theirs, { fromId: userId, fromUsername: currentUsername || 'You', xp: 0 },
    ]);
    refresh();
    return { ok: true, message: 'pending' };
  }, [userId, currentUsername, refresh]);

  const accept = useCallback(async (request: PendingRequest): Promise<ActionResult> => {
    if (modeRef.current === 'online') {
      const res = await respondToRequest(request.id, true);
      if (!res || isApiError(res)) return { ok: false, message: isApiError(res) ? res.error : undefined };
      refresh();
      return { ok: true };
    }
    const current = loadJSON<LocalFriend[]>(storageKey('friends', userId), []);
    const mock = MOCK_USERS.find(u => u.id === request.userId);
    const entry: LocalFriend = mock
      ? { ...mock }
      : { id: request.userId, username: request.username, xp: 0, videoXp: 0, country: '', streak: 0 };
    if (!current.some(f => f.id === entry.id)) {
      saveJSON(storageKey('friends', userId), [...current, entry]);
      recordFriendEvent(userId, { type: 'friend_added', friendId: entry.id, friendName: entry.username });
    }
    saveJSON(
      storageKey('received', userId),
      loadJSON<ReceivedEntry[]>(storageKey('received', userId), []).filter(r => r.fromId !== request.userId),
    );
    refresh();
    return { ok: true };
  }, [userId, refresh]);

  const decline = useCallback(async (request: PendingRequest): Promise<ActionResult> => {
    if (modeRef.current === 'online') {
      const res = await respondToRequest(request.id, false);
      if (!res || isApiError(res)) return { ok: false, message: isApiError(res) ? res.error : undefined };
      refresh();
      return { ok: true };
    }
    saveJSON(
      storageKey('received', userId),
      loadJSON<ReceivedEntry[]>(storageKey('received', userId), []).filter(r => r.fromId !== request.userId),
    );
    refresh();
    return { ok: true };
  }, [userId, refresh]);

  const cancel = useCallback(async (request: PendingRequest): Promise<ActionResult> => {
    if (modeRef.current === 'online') {
      const res = await cancelFriendRequest(request.userId);
      if (!res || isApiError(res)) return { ok: false, message: isApiError(res) ? res.error : undefined };
      refresh();
      return { ok: true };
    }
    saveJSON(
      storageKey('sent', userId),
      normaliseSent(loadJSON<unknown>(storageKey('sent', userId), [])).filter(s => s.id !== request.userId),
    );
    refresh();
    return { ok: true };
  }, [userId, refresh]);

  const remove = useCallback(async (friend: SocialFriend): Promise<ActionResult> => {
    if (modeRef.current === 'online') {
      const res = await apiRemoveFriend(friend.id);
      if (!res || isApiError(res)) return { ok: false, message: isApiError(res) ? res.error : undefined };
      refresh();
      return { ok: true };
    }
    saveJSON(
      storageKey('friends', userId),
      loadJSON<LocalFriend[]>(storageKey('friends', userId), []).filter(f => f.id !== friend.id),
    );
    refresh();
    return { ok: true };
  }, [userId, refresh]);

  const message = useCallback(async (friendId: string, text: string): Promise<ActionResult> => {
    if (modeRef.current !== 'online') return { ok: true };  // local thread store handles it
    const res = await apiSendMessage(friendId, text);
    if (!res || isApiError(res)) return { ok: false, message: isApiError(res) ? res.error : undefined };
    return { ok: true };
  }, []);

  const challenge = useCallback(async (friendId: string): Promise<ActionResult> => {
    if (modeRef.current !== 'online') return { ok: true };
    const res = await apiChallengeDuel(friendId);
    if (!res || isApiError(res)) return { ok: false, message: isApiError(res) ? res.error : undefined };
    return { ok: true };
  }, []);

  return {
    mode, ready, friends, incoming, outgoing, activity,
    activitySimulated: mode !== 'online',
    search, add, accept, decline, cancel, remove, message, challenge, refresh,
  };
}

function toSocialFriend(f: ServerFriend): SocialFriend {
  return {
    id: f.id,
    username: f.username,
    xp: f.xp ?? 0,
    videoXp: f.videoXp ?? 0,
    country: '',
    streak: f.streak ?? 0,
    online: !!f.online,
    unread: f.unread ?? 0,
    preview: '',
  };
}
