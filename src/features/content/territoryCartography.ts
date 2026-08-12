// ─── Per-topic historical cartography ────────────────────────────────────────
// Curated historical map art for the Timeline Map's territory topics, keyed by
// topic id so the image is identical in every UI language.
//
// These are reference maps shown alongside a topic's description — they are
// plain raster images with no georeferencing, so they are deliberately NOT
// overlaid on the live map (there are no bounds to align them to). They render
// as a small strip in the selected-topic card instead.
//
// SAFETY: a missing file just hides the strip (see the onError handler at the
// render site), so an absent asset can only remove art, never break the card.
// Drop files into public/assets/cartography/ — see scripts/place_drive_assets.mjs.

/** topic id → curated cartography path under public/. */
export const TERRITORY_CARTOGRAPHY: Record<string, string> = {
  'human-origins': '/assets/cartography/human-origins.png',
  mesopotamia: '/assets/cartography/mesopotamia.png',
  'classical-greece': '/assets/cartography/classical-greece.webp',
  'hellenistic-world': '/assets/cartography/hellenistic-world.webp',
  'olmec-mesoamerica': '/assets/cartography/olmec-mesoamerica.jpg',
  'islamic-caliphates': '/assets/cartography/islamic-caliphates.jpg',
  'mongol-empire': '/assets/cartography/mongol-empire.webp',
  'crusader-states': '/assets/cartography/crusader-states.webp',
  'al-andalus': '/assets/cartography/al-andalus.webp',
  'khmer-empire': '/assets/cartography/khmer-empire.webp',
  'hundred-years-war': '/assets/cartography/hundred-years-war.png',
  'ottoman-empire': '/assets/cartography/ottoman-empire.jpg',
  'renaissance-italy': '/assets/cartography/renaissance-italy.jpg',
  'protestant-reformation': '/assets/cartography/protestant-reformation.webp',
  'mughal-empire': '/assets/cartography/mughal-empire.jpg',
  'songhai-empire': '/assets/cartography/songhai-empire.jpg',
  'polynesian-expansion': '/assets/cartography/polynesian-expansion.png',
  'french-revolution-napoleon': '/assets/cartography/french-revolution-napoleon.jpg',
  'industrial-revolution': '/assets/cartography/industrial-revolution.jpg',
  ww2: '/assets/cartography/ww2.jpg',
  'macedonian-struggle': '/assets/cartography/macedonian-struggle.jpg',
};

/**
 * A second Al-Andalus plate ("Reconquista") ships in the same asset drop. The
 * topic covers both halves of the story, so it is kept available here rather
 * than discarded — swap it in above if you prefer the Reconquista framing.
 */
export const TERRITORY_CARTOGRAPHY_ALTERNATES: Record<string, string[]> = {
  'al-andalus': ['/assets/cartography/al-andalus-reconquista.jpg'],
};

/** Curated cartography for a topic, or null when none has been supplied. */
export function getTerritoryCartography(topicId: string): string | null {
  return TERRITORY_CARTOGRAPHY[topicId] ?? null;
}
