// ─── Lesson banner asset resolver ────────────────────────────────────────────
// Maps a catalog lessonId to its animated banner URL with client-side caching.
// Resolution order:
//   1. in-memory + localStorage cache (per catalog id)
//   2. GIPHY search API (when VITE_GIPHY_API_KEY is configured) using the
//      entry's first optimized search tag, G-rated, downsized rendition
//   3. the app's curated GIF banner map (lessonGifBanners) via lessonKey
//   4. a local static asset path if one has been deployed
//   5. null → the component falls back to the entry's Tailwind gradient
// Failures never throw to the caller: a banner can never break the lesson UI.

import { LESSONS_CATALOG, type LessonMetaData } from '../data/lessonsCatalog';
import { LESSON_GIF_BANNERS } from '../features/content/lessonGifBanners';

const assetCache = new Map<number, string>();
const LS_PREFIX = 'historify:catalogbanner:';

function readEnvKey(): string | undefined {
  const env = import.meta.env as Record<string, string | undefined>;
  const key = env.VITE_GIPHY_API_KEY ?? env.NEXT_PUBLIC_GIPHY_API_KEY;
  return key && key.trim().length > 0 ? key.trim() : undefined;
}

interface GiphySearchResponse {
  data?: { images?: { downsized_medium?: { url?: string }; original?: { url?: string } } }[];
}

/** True when a deployed static banner exists for this catalog id. Static
 *  banners are optional; a HEAD probe avoids rendering a broken <img>. */
async function probeLocalBanner(lessonId: number): Promise<string | null> {
  const localPath = `/assets/banners/lesson-${lessonId}.webp`;
  try {
    const res = await fetch(localPath, { method: 'HEAD' });
    const type = res.headers.get('content-type') ?? '';
    // Vite dev + most static hosts serve index.html (text/html) for misses.
    if (res.ok && !type.includes('text/html')) return localPath;
  } catch { /* offline or blocked — treat as absent */ }
  return null;
}

export async function fetchLessonBannerUrl(lessonId: number): Promise<string | null> {
  if (assetCache.has(lessonId)) {
    return assetCache.get(lessonId)!;
  }
  try {
    const persisted = localStorage.getItem(LS_PREFIX + lessonId);
    if (persisted) {
      assetCache.set(lessonId, persisted);
      return persisted;
    }
  } catch { /* storage unavailable — resolve fresh */ }

  const lesson = LESSONS_CATALOG.find(l => l.id === lessonId);
  if (!lesson) return null;

  const remember = (url: string) => {
    assetCache.set(lessonId, url);
    try { localStorage.setItem(LS_PREFIX + lessonId, url); } catch { /* best-effort */ }
    return url;
  };

  try {
    const apiKey = readEnvKey();
    if (apiKey) {
      const query = encodeURIComponent(lesson.searchTags[0]);
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=1&rating=g`
      );
      if (response.ok) {
        const data = (await response.json()) as GiphySearchResponse;
        const first = data.data?.[0];
        const gifUrl = first?.images?.downsized_medium?.url || first?.images?.original?.url;
        if (gifUrl) return remember(gifUrl);
      }
    }

    // Curated app banner for this lesson, if one is mapped.
    const curated = LESSON_GIF_BANNERS[lesson.lessonKey];
    if (curated) return remember(curated);

    return await probeLocalBanner(lessonId);
  } catch (error) {
    console.warn(`[BannerService] Failed to load GIF banner for lesson ${lessonId}, using fallback gradient.`, error);
    return null;
  }
}

/** Resolve by the app's internal lesson id (e.g. "byzantine-14"). */
export async function fetchLessonBannerUrlByKey(lessonKey: string): Promise<string | null> {
  const entry = LESSONS_CATALOG.find(l => l.lessonKey === lessonKey);
  return entry ? fetchLessonBannerUrl(entry.id) : null;
}

export type { LessonMetaData };
