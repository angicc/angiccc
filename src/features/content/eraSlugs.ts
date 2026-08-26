// Public, readable URLs for the era preview pages (/ancient-world …).
//
// Kept out of EraPreviewPage.tsx because the landing page imports it: a module
// that exports both a component and a constant breaks React Fast Refresh, so
// editing the map would force a full reload instead of a hot update.
export const ERA_SLUGS: Record<string, string> = {
  prehistoric: 'prehistoric-world',
  ancient: 'ancient-world',
  byzantine: 'byzantine-empire',
  'middle-ages': 'middle-ages',
  'early-modern': 'early-modern-world',
  modern: 'modern-era',
};
