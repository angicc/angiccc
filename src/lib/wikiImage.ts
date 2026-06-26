// Keyless, CORS-enabled image resolver backed by the Wikipedia REST API.
// Used as a robust async fallback for philosopher avatars and lesson banners
// so a single dead asset URL never leaves the UI with an empty placeholder.

type CacheEntry = string | null;

const memCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CacheEntry>>();

const SUMMARY_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

/**
 * Resolve a high-quality public-domain depiction for a free-text query
 * (a person's name, an empire, a lesson title…) via the Wikipedia REST API.
 *
 * Returns a usable image URL, or null if nothing could be resolved.
 * Results (including misses) are cached for the session to avoid re-hitting
 * the network on re-render. `preferOriginal` returns the full-resolution
 * image (good for wide banners); otherwise the thumbnail is used.
 */
export async function fetchWikiImage(
  query: string,
  preferOriginal = false,
): Promise<CacheEntry> {
  const key = `${preferOriginal ? 'orig:' : 'thumb:'}${query.toLowerCase().trim()}`;
  if (memCache.has(key)) return memCache.get(key)!;
  if (inflight.has(key)) return inflight.get(key)!;

  const task = (async (): Promise<CacheEntry> => {
    try {
      const res = await fetch(
        SUMMARY_ENDPOINT + encodeURIComponent(query.replace(/\s+/g, '_')),
        { headers: { Accept: 'application/json' } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const src: CacheEntry = preferOriginal
        ? (data?.originalimage?.source ?? data?.thumbnail?.source ?? null)
        : (data?.thumbnail?.source ?? data?.originalimage?.source ?? null);
      memCache.set(key, src);
      return src;
    } catch {
      memCache.set(key, null);
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, task);
  return task;
}
