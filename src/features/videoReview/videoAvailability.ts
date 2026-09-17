// ─── YouTube availability ─────────────────────────────────────────────────────
// Video Review picks one video a day and embeds it. When that video has been
// removed, made private or blocked in the viewer's country, the iframe does not
// fail - YouTube serves its own "Video unavailable" page inside it. There is no
// error event to catch, so the feature's whole daily task silently becomes a
// black rectangle.
//
// The embed cannot be inspected from outside either: it is cross-origin, so its
// contents are unreadable. The thumbnail is the only signal available to a
// browser without an API key.
//
// A video that no longer exists has no thumbnail, and YouTube answers with a
// 120x90 grey placeholder instead of a 404. So "loads, but is exactly 120x90"
// means gone. That is a real, documented quirk rather than a guess, and it is
// the only client-side check that does not need a key or a proxy.

const PLACEHOLDER_W = 120;
const PLACEHOLDER_H = 90;

/** How long a verdict is trusted. Long enough to matter, short enough that a
 *  video restored by its owner comes back the next day. */
const TTL_MS = 12 * 60 * 60 * 1000;
const CACHE_KEY = 'historify:videoAvailability';

type Verdict = { ok: boolean; at: number };

const memory = new Map<string, Verdict>();

function readCache(): Record<string, Verdict> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as Record<string, Verdict>;
  } catch {
    return {};   // storage blocked or corrupt - probe fresh
  }
}

function writeCache(id: string, verdict: Verdict): void {
  try {
    const all = readCache();
    all[id] = verdict;
    // Drop anything stale so the entry cannot grow without bound.
    for (const [k, v] of Object.entries(all)) if (Date.now() - v.at > TTL_MS) delete all[k];
    localStorage.setItem(CACHE_KEY, JSON.stringify(all));
  } catch { /* best effort */ }
}

function cached(id: string): boolean | null {
  const hit = memory.get(id) ?? readCache()[id];
  if (!hit || Date.now() - hit.at > TTL_MS) return null;
  memory.set(id, hit);
  return hit.ok;
}

/**
 * Is this video still playable?
 *
 * Resolves true when the check cannot be made - an offline viewer, or a network
 * that blocks the thumbnail host. Treating "I could not tell" as "broken" would
 * cycle every video away from someone whose connection is merely slow.
 */
export function isVideoAvailable(youtubeId: string, timeoutMs = 6000): Promise<boolean> {
  const hit = cached(youtubeId);
  if (hit !== null) return Promise.resolve(hit);
  if (typeof Image === 'undefined') return Promise.resolve(true);

  return new Promise<boolean>(resolve => {
    const img = new Image();
    let settled = false;
    const finish = (ok: boolean, trust = true) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (trust) {
        const verdict = { ok, at: Date.now() };
        memory.set(youtubeId, verdict);
        writeCache(youtubeId, verdict);
      }
      resolve(ok);
    };

    const timer = setTimeout(() => finish(true, false), timeoutMs);
    img.onload = () => finish(!(img.naturalWidth === PLACEHOLDER_W && img.naturalHeight === PLACEHOLDER_H));
    // A missing thumbnail is a deleted video; a blocked host is not knowable.
    img.onerror = () => finish(false);
    img.src = `https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/hqdefault.jpg`;
  });
}

/** Test seam: clear both caches. */
export function resetAvailabilityCache(): void {
  memory.clear();
  try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

export interface ReplaceableVideo {
  id: string;
  youtubeId: string;
  era: string;
}

/**
 * Order the alternatives to try when the chosen video is gone.
 *
 * Same era first: Video Review pairs the clip with an era-appropriate writing
 * prompt, so a medieval replacement for a medieval video keeps the task
 * coherent. Everything else follows, because any working video beats a black
 * rectangle. Deterministic, so two viewers hitting the same dead video land on
 * the same replacement and can still compare reviews.
 */
export function replacementOrder<T extends ReplaceableVideo>(all: T[], broken: T): T[] {
  const rest = all.filter(v => v.id !== broken.id);
  const sameEra = rest.filter(v => v.era === broken.era);
  const otherEra = rest.filter(v => v.era !== broken.era);
  const byId = (a: T, b: T) => a.id.localeCompare(b.id);
  return [...sameEra.sort(byId), ...otherEra.sort(byId)];
}

/**
 * The first candidate that is actually playable.
 *
 * Bounded: probing every fallback would mean dozens of requests on a page that
 * should already be playing something. If none of the first few work, the
 * caller keeps the original and shows it - by then the problem is the network,
 * not the video.
 */
export async function firstAvailable<T extends ReplaceableVideo>(
  candidates: T[],
  limit = 6,
): Promise<T | null> {
  for (const candidate of candidates.slice(0, limit)) {
    if (await isVideoAvailable(candidate.youtubeId)) return candidate;
  }
  return null;
}
