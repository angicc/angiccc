// ─── Per-lesson local GIF banner overrides ───────────────────────────────────
// AUTO-GENERATED from the owner's Master Banner GIF mapping. Each app lesson id
// (lessonKey) maps to a curated animated banner under
// `public/assets/banners/{era}/{slug}.gif`.
//
// WHY KEY BY LESSON ID, NOT TITLE: the source payload was authored with
// Macedonian lesson titles, but banners must be identical in every UI language.
// Matching was resolved ONCE here (title → lessonKey), so lookup at runtime is
// language-independent and deterministic — never a fragile runtime title match.
//
// PRECEDENCE + SAFETY: when a file exists at the mapped path it becomes the
// lesson's banner (highest priority). If the asset is absent or fails to load,
// the <img onError> chain falls through to the app's existing animated-banner
// system, and finally the gradient — so a missing GIF can only ADD art, never
// break a banner. Drop the .gif files into public/assets/banners/ to light them
// up; no code change required.

/** Generic fallback banner (used by onError before the animated-banner chain). */
export const DEFAULT_BANNER_GIF = '/assets/banners/default-history.gif';

/** lessonKey → curated local GIF banner path. */
export const LESSON_LOCAL_BANNERS: Record<string, string> = {
  // ── prehistoric ──
  'prehistoric-01': '/assets/banners/prehistoric/origin-of-man.gif',
  'prehistoric-02': '/assets/banners/prehistoric/mastery-of-fire.gif',
  'prehistoric-03': '/assets/banners/prehistoric/neanderthals.gif',
  'prehistoric-04': '/assets/banners/prehistoric/great-human-migration.gif',
  'prehistoric-05': '/assets/banners/prehistoric/stone-age-tools.gif',
  'prehistoric-06': '/assets/banners/prehistoric/cave-art.gif',
  'prehistoric-07': '/assets/banners/prehistoric/ice-age-world.gif',
  'prehistoric-08': '/assets/banners/prehistoric/neolithic-revolution.gif',
  'prehistoric-09': '/assets/banners/prehistoric/first-villages-monuments.gif',
  'prehistoric-10': '/assets/banners/prehistoric/settling-of-americas.gif',
  'prehistoric-11': '/assets/banners/prehistoric/first-australians.gif',
  'prehistoric-12': '/assets/banners/prehistoric/metal-from-stone.gif',
  'prehistoric-13': '/assets/banners/prehistoric/temples-before-cities.gif',
  'prehistoric-14': '/assets/banners/prehistoric/beasts-of-burden.gif',
  'prehistoric-15': '/assets/banners/prehistoric/green-sahara.gif',
  'prehistoric-16': '/assets/banners/prehistoric/before-writing.gif',
  'prehistoric-17': '/assets/banners/prehistoric/otzi-ice-man.gif',
  'prehistoric-18': '/assets/banners/prehistoric/hidden-half.gif',
  'prehistoric-19': '/assets/banners/prehistoric/first-eastern-settlements.gif',
  'prehistoric-20': '/assets/banners/prehistoric/edge-of-history.gif',
  'prehistoric-21': '/assets/banners/prehistoric/dinosaur-era.gif',
  'prehistoric-22': '/assets/banners/prehistoric/ice-age-survival.gif',
  // ── ancient ──
  'ancient-01': '/assets/banners/ancient/first-civilizations.gif',
  'ancient-02': '/assets/banners/ancient/classical-greece.gif',
  'ancient-03': '/assets/banners/ancient/roman-republic-empire.gif',
  'ancient-04': '/assets/banners/ancient/ancient-near-east.gif',
  'ancient-05': '/assets/banners/ancient/ancient-egypt.gif',
  'ancient-06': '/assets/banners/ancient/phoenicians-sea-masters.gif',
  'ancient-07': '/assets/banners/ancient/ancient-macedonia-alexander.gif',
  'ancient-08': '/assets/banners/ancient/hellenistic-world.gif',
  'ancient-09': '/assets/banners/ancient/achaemenid-persia.gif',
  'ancient-10': '/assets/banners/ancient/ancient-india.gif',
  'ancient-11': '/assets/banners/ancient/ancient-china.gif',
  'ancient-12': '/assets/banners/ancient/people-of-the-book.gif',
  'ancient-13': '/assets/banners/ancient/song-of-troy.gif',
  'ancient-14': '/assets/banners/ancient/kush-and-aksum.gif',
  'ancient-15': '/assets/banners/ancient/first-builders-americas.gif',
  'ancient-16': '/assets/banners/ancient/andean-empires.gif',
  'ancient-17': '/assets/banners/ancient/glory-of-rome.gif',
  'ancient-18': '/assets/banners/ancient/the-celts.gif',
  'ancient-19': '/assets/banners/ancient/measure-of-the-world.gif',
  'ancient-20': '/assets/banners/ancient/silk-roads.gif',
  'ancient-21': '/assets/banners/ancient/africa-before-rome.gif',
  'ancient-22': '/assets/banners/ancient/olmecs-mesoamerica.gif',
  // ── byzantine ──
  'byzantine-01': '/assets/banners/byzantine/new-rome-constantinople.gif',
  'byzantine-02': '/assets/banners/byzantine/justinian-theodora.gif',
  'byzantine-03': '/assets/banners/byzantine/empire-under-siege.gif',
  'byzantine-04': '/assets/banners/byzantine/iconoclasm.gif',
  'byzantine-05': '/assets/banners/byzantine/cyril-methodius.gif',
  'byzantine-06': '/assets/banners/byzantine/great-schism-1054.gif',
  'byzantine-07': '/assets/banners/byzantine/byzantine-golden-age.gif',
  'byzantine-08': '/assets/banners/byzantine/mount-athos.gif',
  'byzantine-09': '/assets/banners/byzantine/fall-of-constantinople.gif',
  'byzantine-10': '/assets/banners/byzantine/roman-law-justice.gif',
  'byzantine-11': '/assets/banners/byzantine/scholars-second-rome.gif',
  'byzantine-12': '/assets/banners/byzantine/golden-bezant.gif',
  'byzantine-13': '/assets/banners/byzantine/life-in-constantinople.gif',
  'byzantine-14': '/assets/banners/byzantine/baptism-of-rus.gif',
  'byzantine-15': '/assets/banners/byzantine/empresses-of-byzantium.gif',
  'byzantine-16': '/assets/banners/byzantine/last-byzantine-recovery.gif',
  'byzantine-17': '/assets/banners/byzantine/windows-to-heaven.gif',
  'byzantine-18': '/assets/banners/byzantine/crescent-and-cross.gif',
  'byzantine-19': '/assets/banners/byzantine/empire-in-exile.gif',
  'byzantine-20': '/assets/banners/byzantine/empire-that-never-dies.gif',
  'byzantine-21': '/assets/banners/byzantine/macedonian-renaissance.gif',
  'byzantine-22': '/assets/banners/byzantine/heirs-of-constantinople.gif',
  // ── medieval ──
  'medieval-01': '/assets/banners/middle_ages/fall-of-rome.gif',
  'medieval-02': '/assets/banners/middle_ages/crusades-islamic-golden-age.gif',
  'medieval-03': '/assets/banners/middle_ages/black-plague.gif',
  'medieval-04': '/assets/banners/middle_ages/medieval-economy-guilds.gif',
  'medieval-05': '/assets/banners/middle_ages/mongol-empire.gif',
  'medieval-06': '/assets/banners/middle_ages/feudal-japan-samurai.gif',
  'medieval-07': '/assets/banners/middle_ages/viking-era.gif',
  'medieval-08': '/assets/banners/middle_ages/al-andalus-reconquista.gif',
  'medieval-09': '/assets/banners/middle_ages/hundred-years-war.gif',
  'medieval-10': '/assets/banners/middle_ages/charlemagne.gif',
  'medieval-11': '/assets/banners/middle_ages/feudal-manor.gif',
  'medieval-12': '/assets/banners/middle_ages/age-of-faith.gif',
  'medieval-13': '/assets/banners/middle_ages/cathedrals-universities.gif',
  'medieval-14': '/assets/banners/middle_ages/medieval-poets.gif',
  'medieval-15': '/assets/banners/middle_ages/gold-of-mali.gif',
  'medieval-16': '/assets/banners/middle_ages/after-golden-age.gif',
  'medieval-17': '/assets/banners/middle_ages/sultans-and-temples.gif',
  'medieval-18': '/assets/banners/middle_ages/rise-of-moscow.gif',
  'medieval-19': '/assets/banners/middle_ages/song-dynasty.gif',
  'medieval-20': '/assets/banners/middle_ages/women-of-middle-ages.gif',
  'medieval-21': '/assets/banners/middle_ages/great-zimbabwe.gif',
  'medieval-22': '/assets/banners/middle_ages/khmer-empire-angkor.gif',
  // ── earlymod ──
  'earlymod-01': '/assets/banners/early_modern/renaissance-discovery.gif',
  'earlymod-02': '/assets/banners/early_modern/protestant-reformation.gif',
  'earlymod-03': '/assets/banners/early_modern/scientific-revolution.gif',
  'earlymod-04': '/assets/banners/early_modern/louis-xiv-versailles.gif',
  'earlymod-05': '/assets/banners/early_modern/transatlantic-slave-trade.gif',
  'earlymod-06': '/assets/banners/early_modern/suleiman-the-magnificent.gif',
  'earlymod-07': '/assets/banners/early_modern/age-of-revolutions.gif',
  'earlymod-08': '/assets/banners/early_modern/mughal-empire.gif',
  'earlymod-09': '/assets/banners/early_modern/tokugawa-japan.gif',
  'earlymod-10': '/assets/banners/early_modern/two-worlds-met.gif',
  'earlymod-11': '/assets/banners/early_modern/age-of-merchants.gif',
  'earlymod-12': '/assets/banners/early_modern/printing-press-unbound.gif',
  'earlymod-13': '/assets/banners/early_modern/wars-of-religion.gif',
  'earlymod-14': '/assets/banners/early_modern/treasure-fleets.gif',
  'earlymod-15': '/assets/banners/early_modern/safavid-persia.gif',
  'earlymod-16': '/assets/banners/early_modern/king-and-parliament.gif',
  'earlymod-17': '/assets/banners/early_modern/age-of-splendor.gif',
  'earlymod-18': '/assets/banners/early_modern/little-ice-age.gif',
  'earlymod-19': '/assets/banners/early_modern/peter-the-great.gif',
  'earlymod-20': '/assets/banners/early_modern/radical-enlightenment.gif',
  'earlymod-21': '/assets/banners/early_modern/songhai-empire.gif',
  'earlymod-22': '/assets/banners/early_modern/voyagers-pacific.gif',
  // ── modern ──
  'modern-01': '/assets/banners/modern/industrial-revolution.gif',
  'modern-02': '/assets/banners/modern/world-wars.gif',
  'modern-03': '/assets/banners/modern/cold-war-decolonization.gif',
  'modern-04': '/assets/banners/modern/globalization.gif',
  'modern-05': '/assets/banners/modern/scramble-for-africa.gif',
  'modern-06': '/assets/banners/modern/yugoslav-wars.gif',
  'modern-07': '/assets/banners/modern/macedonian-struggle.gif',
  'modern-08': '/assets/banners/modern/russian-revolution.gif',
  'modern-09': '/assets/banners/modern/gandhi-independence.gif',
  'modern-10': '/assets/banners/modern/modern-revolutions.gif',
  'modern-11': '/assets/banners/modern/birth-of-nations.gif',
  'modern-12': '/assets/banners/modern/modern-literature.gif',
  'modern-13': '/assets/banners/modern/broken-chains.gif',
  'modern-14': '/assets/banners/modern/rising-sun-japan.gif',
  'modern-15': '/assets/banners/modern/collapse-and-disaster.gif',
  'modern-16': '/assets/banners/modern/age-of-genocide.gif',
  'modern-17': '/assets/banners/modern/china-reborn.gif',
  'modern-18': '/assets/banners/modern/rights-revolutions.gif',
  'modern-19': '/assets/banners/modern/modern-middle-east.gif',
  'modern-20': '/assets/banners/modern/connected-world.gif',
  'modern-21': '/assets/banners/modern/space-age.gif',
  'modern-22': '/assets/banners/modern/conquering-diseases.gif',
};

/** The curated local banner path for a lesson, if one is mapped. */
export function localLessonBanner(lessonId: string): string | undefined {
  return LESSON_LOCAL_BANNERS[lessonId];
}
