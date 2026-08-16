// ─── Per-topic historical cartography ────────────────────────────────────────
// Curated historical map art for the Timeline Map's territory topics, keyed by
// topic id so the image is identical in every UI language.
//
// These are reference maps drawn onto the map itself as an L.imageOverlay,
// bounded by the topic's own geometry. They are plain raster plates with no
// georeferencing of their own, so the topic's polygons are what anchors them.
//
// SOME TOPICS SPAN MORE THAN ONE MAP. "Al-Andalus & the Reconquista" covers
// eight centuries in which the peninsula changed hands completely, and the
// folder supplies a plate for each phase. Rather than discard one, a topic may
// list several plates and the map offers a control to step between them.
//
// Selecting by the timeline scrubber was tried and does not work: that slider
// spans all of history and switches which TOPIC is selected, so scrubbing
// forward inside Al-Andalus jumps to Renaissance Italy or the Mongol Empire
// long before the later plate would apply.
//
// SAFETY: a missing file just hides the overlay (see the onError path at the
// render site), so an absent asset can only remove art, never break the map.
// Drop files into public/assets/cartography/ — see scripts/place_drive_assets.mjs.

export interface CartographyPlate {
  src: string;
  /** Short phase label shown on the switcher when a topic has several plates. */
  label?: string;
}

/** topic id → one plate, or several in chronological order. */
export const TERRITORY_CARTOGRAPHY: Record<string, CartographyPlate[]> = {
  'human-origins': [{ src: '/assets/cartography/human-origins.png' }],
  mesopotamia: [{ src: '/assets/cartography/mesopotamia.png' }],
  'classical-greece': [{ src: '/assets/cartography/classical-greece.webp' }],
  'hellenistic-world': [{ src: '/assets/cartography/hellenistic-world.webp' }],
  'olmec-mesoamerica': [{ src: '/assets/cartography/olmec-mesoamerica.jpg' }],
  'islamic-caliphates': [{ src: '/assets/cartography/islamic-caliphates.jpg' }],
  'mongol-empire': [{ src: '/assets/cartography/mongol-empire.webp' }],
  'crusader-states': [{ src: '/assets/cartography/crusader-states.webp' }],
  // Al-Andalus at its height, then the Christian reconquest that displaced it.
  'al-andalus': [
    { src: '/assets/cartography/al-andalus.webp', label: 'Al-Andalus' },
    { src: '/assets/cartography/al-andalus-reconquista.jpg', label: 'Reconquista' },
  ],
  'khmer-empire': [{ src: '/assets/cartography/khmer-empire.webp' }],
  'hundred-years-war': [{ src: '/assets/cartography/hundred-years-war.png' }],
  'ottoman-empire': [{ src: '/assets/cartography/ottoman-empire.jpg' }],
  'renaissance-italy': [{ src: '/assets/cartography/renaissance-italy.jpg' }],
  'protestant-reformation': [{ src: '/assets/cartography/protestant-reformation.webp' }],
  'mughal-empire': [{ src: '/assets/cartography/mughal-empire.jpg' }],
  'songhai-empire': [{ src: '/assets/cartography/songhai-empire.jpg' }],
  'polynesian-expansion': [{ src: '/assets/cartography/polynesian-expansion.png' }],
  'french-revolution-napoleon': [{ src: '/assets/cartography/french-revolution-napoleon.jpg' }],
  'industrial-revolution': [{ src: '/assets/cartography/industrial-revolution.jpg' }],
  ww2: [{ src: '/assets/cartography/ww2.jpg' }],
  'macedonian-struggle': [{ src: '/assets/cartography/macedonian-struggle.jpg' }],
};

/** Every plate a topic carries; empty when it has none. */
export function getTerritoryPlates(topicId: string): CartographyPlate[] {
  return TERRITORY_CARTOGRAPHY[topicId] ?? [];
}

/**
 * Curated cartography for a topic, or null when none exists. `index` selects
 * among a topic's plates and wraps, so a caller can step through them without
 * bounds-checking.
 */
export function getTerritoryCartography(topicId: string, index = 0): string | null {
  const plates = getTerritoryPlates(topicId);
  if (!plates.length) return null;
  return plates[((index % plates.length) + plates.length) % plates.length].src;
}
