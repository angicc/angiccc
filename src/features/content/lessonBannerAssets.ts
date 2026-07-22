// ─── Contextual banner asset router ──────────────────────────────────────────
// Resolves the banner image candidates for a lesson as an explicit, ordered
// chain keyed on the lesson ID — never a random pick, never a shared epoch
// folder. Resolution order:
//   1. curated override for this exact lesson id (fixes weak/broken DB assets)
//   2. the lesson's own imageUrl (its explicit content binding)
//   3. the era's guaranteed-good hero image
// If every candidate fails to load, the banner renders the era's procedural
// SVG backdrop (see EraBannerBackdrop) — styled per era, never blank.

import { LESSON_GIF_BANNERS, eraGifBanner } from '@/features/content/lessonGifBanners';

/** Curated per-lesson replacements where the dataset asset is generic or frail. */
const LESSON_BANNER_OVERRIDES: Record<string, string> = {
  // Globalization: the dataset points at a generic city photo also used as the
  // modern-era fallback — give the lesson its own distinct asset.
  'modern-04': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=60',
};

/** Era hero images — fixed, reliable, one per era. Final real-image stage. */
export const ERA_HERO_IMAGES: Record<string, string> = {
  // Stonehenge — a famous Wikimedia file referenced via Special:FilePath, which
  // redirects by filename (no fragile MD5 hash path) — anchors the prehistoric
  // fallback chain so a prehistoric lesson banner can never render blank.
  prehistoric:    'https://commons.wikimedia.org/wiki/Special:FilePath/Stonehenge2007_07_30.jpg',
  ancient:        'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=60',
  'middle-ages':  'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=1200&q=60',
  'early-modern': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=60',
  modern:         'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=60',
};

/**
 * The full deterministic candidate chain for a lesson banner. Duplicates are
 * collapsed so a failing URL is never retried at a later stage.
 * Order: explicit lesson GIF → guaranteed era-pool GIF (so EVERY lesson is
 * animated) → curated override → lesson image → era hero. If every animated
 * source fails to load, the static images below keep the banner filled.
 */
export function resolveBannerCandidates(lessonId: string, eraId: string, imageUrl?: string): string[] {
  const chain = [
    LESSON_GIF_BANNERS[lessonId],
    eraGifBanner(lessonId, eraId),
    LESSON_BANNER_OVERRIDES[lessonId],
    imageUrl,
    ERA_HERO_IMAGES[eraId] ?? ERA_HERO_IMAGES.ancient,
  ].filter((u): u is string => Boolean(u));
  return [...new Set(chain)];
}
