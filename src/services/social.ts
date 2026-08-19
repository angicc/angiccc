// ─── Online social client ────────────────────────────────────────────────────
// Bridges the Friends feature to the Historify backend (server/: Express +
// Prisma + Socket.io).
//
// TWO MODES, ONE UI. When `VITE_API_URL` points at a deployed server and the
// learner has a server session, friends are real accounts: requests need
// consent, DMs are durable and cross-device, presence is live over a socket.
// When it is unset — local dev, a preview build, the offline demo — every call
// here resolves to null quickly and FriendsPage keeps working from
// localStorage against its fixture friends.
//
// The distinction is surfaced, never hidden: `socialMode()` tells the UI which
// world it is in so it can label simulated data honestly instead of passing
// fixtures off as people.
//
// WHY THIS FILE WAS REWRITTEN: every write helper here used to send a field
// name the server does not read — `{ username }` where it wanted `{ toId }`,
// `{ friendId, text }` where it wanted `{ toId, text }`. Each call 400'd, the
// helper swallowed it as `false`, and the UI silently fell back to
// localStorage. With a server deployed and a user logged in, adding a friend
// and sending a message still did nothing online. That is the bug behind
// "the friends system is not actually online".

import { io, type Socket } from 'socket.io-client';
import { apiConfigured, apiFetch, apiUrl } from './apiClient';

export function socialApiConfigured(): boolean {
  return apiConfigured();
}

// ── Transport ─────────────────────────────────────────────────────────────────

export interface ApiError { status: number; error: string }

/**
 * One request. Returns the parsed body, or an ApiError the caller can show.
 *
 * Errors are returned rather than thrown because every call site here is a UI
 * action: "Not friends." and "Too many messages" are things the learner needs
 * to read, not exceptions to swallow. `null` means "no backend configured" and
 * is the signal to fall back to local behaviour — distinct from a real failure.
 */
async function api<T>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T | ApiError | null> {
  if (!socialApiConfigured()) return null;
  const res = await apiFetch(path, init);
  if (!res) return { status: 0, error: 'Could not reach the server.' };
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { status: res.status, error: (data as { error?: string }).error ?? `Request failed (${res.status}).` };
  }
  return data as T;
}

export function isApiError(v: unknown): v is ApiError {
  return typeof v === 'object' && v !== null && 'status' in v && 'error' in v;
}

/** Unwrap to the value, or undefined when the call failed or was skipped. */
function ok<T>(v: T | ApiError | null): T | undefined {
  return v === null || isApiError(v) ? undefined : v;
}

// ── Health & mode ─────────────────────────────────────────────────────────────

let healthCache: { ok: boolean; at: number } | null = null;
const HEALTH_TTL_MS = 30_000;

/** True when a configured backend answers its liveness probe. */
export async function checkServerOnline(): Promise<boolean> {
  if (!socialApiConfigured()) return false;
  if (healthCache && Date.now() - healthCache.at < HEALTH_TTL_MS) return healthCache.ok;
  let alive = false;
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 3500);
    const res = await fetch(apiUrl('/healthz'), { signal: ctl.signal, credentials: 'include' });
    clearTimeout(timer);
    alive = res.ok;
  } catch { alive = false; }
  healthCache = { ok: alive, at: Date.now() };
  return alive;
}

export type SocialMode = 'offline' | 'unauthenticated' | 'online';

/**
 * Which world the Friends page is in.
 *
 * `offline`         — no backend configured; fixtures and localStorage.
 * `unauthenticated` — backend reachable, but this browser has no session, so
 *                     every /api/social call would 401. The UI must say so
 *                     rather than showing an empty friends list as if the
 *                     learner simply has no friends.
 * `online`          — real accounts, real messages.
 */
export async function socialMode(): Promise<SocialMode> {
  if (!socialApiConfigured()) return 'offline';
  if (!(await checkServerOnline())) return 'offline';
  const me = await api<{ user: unknown }>('/api/auth/me');
  return ok(me) ? 'online' : 'unauthenticated';
}

// ── Shapes ────────────────────────────────────────────────────────────────────

export interface ServerUser {
  id: string;
  username: string;
  tier?: string;
  lastSeenAt?: string;
  online?: boolean;
  /** Present on friends (read from their progress snapshot), absent on search hits. */
  xp?: number;
  videoXp?: number;
  streak?: number;
}
export interface ServerFriend extends ServerUser { unread?: number }
export interface ServerRequest { id: string; at: string; user: ServerUser }
export interface ServerMessage {
  id: string; fromId: string; toId: string; text: string; createdAt: string; readAt?: string | null;
}
export interface ServerActivityEvent {
  id: string;
  type: 'friend_added' | 'message' | 'duel_accepted' | 'duel_declined';
  friendId: string;
  friendName: string;
  at: string;
  meta?: { outgoing?: boolean };
}

// ── Friends ───────────────────────────────────────────────────────────────────

export async function fetchServerFriends(): Promise<ServerFriend[] | undefined> {
  return ok(await api<{ friends: ServerFriend[] }>('/api/social/friends'))?.friends;
}

export async function fetchOnlineFriendIds(): Promise<string[] | undefined> {
  return ok(await api<{ online: string[] }>('/api/social/online'))?.online;
}

/** Learners this account can still send a request to (excludes friends + pending). */
export async function searchLearners(q: string): Promise<ServerUser[] | undefined> {
  if (q.trim().length < 2) return [];
  return ok(await api<{ results: ServerUser[] }>(`/api/social/search?q=${encodeURIComponent(q.trim())}`))?.results;
}

export function removeFriend(friendId: string) {
  return api<{ ok: true }>(`/api/social/friends/${encodeURIComponent(friendId)}`, { method: 'DELETE' });
}

// ── Requests ──────────────────────────────────────────────────────────────────

/**
 * Ask to be someone's friend.
 *
 * Resolves to `friends` rather than `pending` when they had already asked you —
 * the server treats the crossing requests as a mutual yes.
 */
export function sendFriendRequest(toId: string) {
  return api<{ status: 'pending' | 'friends'; mutual?: boolean }>('/api/social/requests', {
    method: 'POST', body: { toId },
  });
}

export async function fetchFriendRequests(): Promise<{ incoming: ServerRequest[]; outgoing: ServerRequest[] } | undefined> {
  return ok(await api<{ incoming: ServerRequest[]; outgoing: ServerRequest[] }>('/api/social/requests'));
}

export function respondToRequest(id: string, accept: boolean) {
  return api<{ status: 'accepted' | 'declined'; friendId?: string }>('/api/social/requests/respond', {
    method: 'POST', body: { id, accept },
  });
}

export function cancelFriendRequest(toId: string) {
  return api<{ ok: true }>('/api/social/requests/cancel', { method: 'POST', body: { toId } });
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function fetchThread(friendId: string): Promise<ServerMessage[] | undefined> {
  return ok(await api<{ messages: ServerMessage[] }>(`/api/social/messages/${encodeURIComponent(friendId)}`))?.messages;
}

export function apiSendMessage(toId: string, text: string) {
  return api<{ message: ServerMessage; deliveredLive: boolean }>('/api/social/messages', {
    method: 'POST', body: { toId, text },
  });
}

export async function fetchUnread(): Promise<{ byFriend: Record<string, number>; total: number } | undefined> {
  return ok(await api<{ byFriend: Record<string, number>; total: number }>('/api/social/unread'));
}

// ── Duels ─────────────────────────────────────────────────────────────────────

export function apiChallengeDuel(toId: string) {
  return api<{ challenge: { id: string }; opponentOnline: boolean }>('/api/social/duel/challenge', {
    method: 'POST', body: { toId },
  });
}

export async function fetchPendingDuels(): Promise<{ id: string; fromId: string; createdAt: string }[] | undefined> {
  return ok(await api<{ pending: { id: string; fromId: string; createdAt: string }[] }>('/api/social/duel/pending'))?.pending;
}

export function respondToDuel(id: string, accept: boolean) {
  return api<{ challenge: { id: string; status: string } }>('/api/social/duel/respond', {
    method: 'POST', body: { id, accept },
  });
}

// ── Activity ──────────────────────────────────────────────────────────────────

export async function fetchServerActivity(limit = 40): Promise<ServerActivityEvent[] | undefined> {
  return ok(await api<{ events: ServerActivityEvent[] }>(`/api/social/activity?limit=${limit}`))?.events;
}

// ── Live socket ───────────────────────────────────────────────────────────────

/**
 * Events the server pushes into this user's private room.
 *
 * All of them are notifications about state that is ALREADY durable — the
 * request is in the database before `friend:request` is emitted. So a dropped
 * frame costs a live update, never data: the next fetch has the same truth.
 * Handlers should refresh, not mutate a local cache as if the frame were the
 * record.
 */
export interface SocialEvents {
  'friend:request': { fromId: string };
  'friend:accepted': { byId: string };
  'friend:removed': { byId: string };
  'dm:new': { id: string; fromId: string; text: string; at: string };
  'duel:incoming': { fromId: string; challengeId: string };
  'duel:response': { fromId: string; accept: boolean; challengeId: string };
  presence: { userId: string; online: boolean };
}

let socket: Socket | null = null;

/**
 * Open (or reuse) the live connection.
 *
 * Authenticates with the httpOnly session cookie via `withCredentials`, so no
 * JWT is ever held in JavaScript where an XSS could read it. Returns null when
 * no backend is configured — callers treat that as "no live layer" and rely on
 * polling, which is also what happens if the socket cannot connect.
 */
export function connectSocial(): Socket | null {
  if (!socialApiConfigured()) return null;
  if (socket?.connected || socket?.active) return socket;
  socket = io(apiUrl(''), {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    // The session cookie is the credential; if it is missing or stale the
    // handshake is rejected and we simply stay on the REST path.
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  return socket;
}

export function disconnectSocial(): void {
  socket?.disconnect();
  socket = null;
}

/**
 * Subscribe to one live event. Returns an unsubscribe function.
 *
 * A no-op unsubscribe is returned when there is no socket, so effect cleanup
 * never has to null-check.
 */
export function onSocial<K extends keyof SocialEvents>(
  event: K,
  handler: (payload: SocialEvents[K]) => void,
): () => void {
  const s = connectSocial();
  if (!s) return () => {};
  s.on(event as string, handler as (...args: unknown[]) => void);
  return () => { s.off(event as string, handler as (...args: unknown[]) => void); };
}
