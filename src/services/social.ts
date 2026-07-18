// ─── Online social client ────────────────────────────────────────────────────
// Bridges the Friends feature to the Historify backend (server/: Express +
// Prisma + Socket.io). Follows the same contract as billing.ts: when
// `VITE_API_URL` points at a deployed server, everything here goes live —
// health checks, friend lists with presence, durable DMs. When it is unset or
// the server is unreachable, every call resolves to null/false quickly and the
// UI keeps working from localStorage. The server routes used here are already
// implemented in server/src/routes/social.ts (`/api/social/*`) and
// server/src/presence.ts (socket presence behind `/api/social/online`).

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '');

export function socialApiConfigured(): boolean {
  return API_BASE.length > 0;
}

// Health is cached briefly so page renders don't hammer /healthz.
let healthCache: { ok: boolean; at: number } | null = null;
const HEALTH_TTL_MS = 30_000;

/** True when a configured backend answers its liveness probe. */
export async function checkServerOnline(): Promise<boolean> {
  if (!socialApiConfigured()) return false;
  if (healthCache && Date.now() - healthCache.at < HEALTH_TTL_MS) return healthCache.ok;
  let ok = false;
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 3500);
    const res = await fetch(`${API_BASE}/healthz`, { signal: ctl.signal });
    clearTimeout(timer);
    ok = res.ok;
  } catch { ok = false; }
  healthCache = { ok, at: Date.now() };
  return ok;
}

async function apiGet<T>(path: string): Promise<T | null> {
  if (!socialApiConfigured()) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch { return null; }
}

async function apiPost(path: string, body: unknown): Promise<boolean> {
  if (!socialApiConfigured()) return false;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch { return false; }
}

export interface ServerFriend { id: string; username: string; xp?: number; online?: boolean; }

/** Friends as the server knows them (includes live online flags), or null offline. */
export function fetchServerFriends(): Promise<{ friends: ServerFriend[] } | null> {
  return apiGet<{ friends: ServerFriend[] }>('/api/social/friends');
}

/** Ids of my friends who are online right now, or null offline. */
export async function fetchOnlineFriendIds(): Promise<string[] | null> {
  const data = await apiGet<{ online: string[] }>('/api/social/online');
  return data?.online ?? null;
}

/** Best-effort: register a friend request server-side. */
export function apiAddFriend(username: string): Promise<boolean> {
  return apiPost('/api/social/friends', { username });
}

/** Best-effort: persist a DM so it survives devices; socket relays it live. */
export function apiSendMessage(friendId: string, text: string): Promise<boolean> {
  return apiPost('/api/social/messages', { friendId, text });
}

/** Best-effort: record a History 1v1 challenge server-side. */
export function apiChallengeDuel(friendId: string): Promise<boolean> {
  return apiPost('/api/social/duel/challenge', { friendId });
}
