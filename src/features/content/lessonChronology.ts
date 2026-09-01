// ─── Lesson chronology ────────────────────────────────────────────────────────
// Lessons were numbered by the order they were WRITTEN, not the order the
// history happened. Inside the Modern era that put the Scramble for Africa
// after Globalization and the Age of Revolutions after Gandhi; Byzantium put
// the Fall of Constantinople before the empire's own recovery. A learner
// working top to bottom was reading the past out of sequence.
//
// This is the single place that decides sequence. Each lesson is stamped with
// the year its subject BEGINS — the start of the process, not its climax, so
// "The Crusades" sits at 1096 rather than at Hattin — and lessonsData sorts
// each era by that value. Ids never change, so completed-lesson records,
// bookmarks and analysis passes all survive a resequencing.
//
// Negative numbers are BCE. Where a subject spans a vast period, the year is
// the earliest point the lesson actually discusses.

export const LESSON_START_YEAR: Record<string, number> = {
  // ── Prehistoric ───────────────────────────────────────────────────────────
  'prehistoric-21': -230_000_000, // The Age of Dinosaurs
  'prehistoric-22': -2_600_000,   // The Ice Ages (Quaternary glaciation)
  'prehistoric-05': -3_300_000,   // The Stone Age Toolkit (Lomekwian tools)
  'prehistoric-02': -1_000_000,   // The Mastery of Fire
  'prehistoric-03': -430_000,     // Neanderthals and the Human Family
  'prehistoric-01': -300_000,     // Human Origins
  'prehistoric-18': -300_000,     // The Hidden Half
  'prehistoric-07': -115_000,     // The Ice Age World (last glacial period)
  'prehistoric-11': -65_000,      // The First Australians
  'prehistoric-04': -60_000,      // The Great Human Journey
  'prehistoric-16': -50_000,      // Before Writing, the Word
  'prehistoric-06': -40_000,      // Cave Art and the Symbolic Mind
  'prehistoric-10': -20_000,      // The Peopling of the Americas
  'prehistoric-15': -11_000,      // The Green Sahara
  'prehistoric-08': -10_000,      // The Neolithic Revolution
  'prehistoric-13': -9_500,       // Temples Before Cities (Göbekli Tepe)
  'prehistoric-19': -9_400,       // The First Villages of the East
  'prehistoric-09': -9_000,       // The First Villages and Monuments
  'prehistoric-14': -8_500,       // Beasts of Burden
  'prehistoric-12': -6_000,       // Metal from Stone
  'prehistoric-17': -3_300,       // The Iceman's Secrets (Ötzi)
  'prehistoric-20': -3_200,       // On the Edge of History

  // ── Ancient ───────────────────────────────────────────────────────────────
  'ancient-01': -3_500,  // The First Civilizations (Sumer)
  'ancient-05': -3_100,  // Ancient Egypt
  'ancient-15': -3_000,  // The First Americans Build (Caral/Norte Chico)
  'ancient-21': -3_000,  // Africa Before Rome
  'ancient-10': -2_600,  // Ancient India (Indus Valley)
  'ancient-11': -1_600,  // Ancient China (Shang)
  'ancient-22': -1_600,  // The Olmec and Early Mesoamerica
  'ancient-04': -1_500,  // The Ancient East
  'ancient-13': -1_200,  // The Song of Troy
  'ancient-06': -1_200,  // The Phoenicians
  'ancient-12': -1_200,  // The People of the Book
  'ancient-14': -1_070,  // The Kingdoms of Kush and Aksum
  'ancient-16': -900,    // Empires of the Andes (Chavín)
  'ancient-18': -800,    // The Celts (Hallstatt)
  'ancient-19': -600,    // The Measure of the World (Ionian science)
  'ancient-09': -550,    // The Achaemenid Persian Empire
  'ancient-03': -509,    // The Roman Republic and Empire
  'ancient-02': -500,    // Classical Greece
  'ancient-07': -359,    // Ancient Macedonia: Alexander the Great
  'ancient-08': -323,    // The Hellenistic World
  'ancient-20': -130,    // The Silk Roads
  'ancient-17': -70,     // The Glory of Rome in Verse (Virgil born 70 BCE)

  // ── Byzantine ─────────────────────────────────────────────────────────────
  'byzantine-01': 330,   // New Rome: The Founding of Constantinople
  'byzantine-13': 500,   // Life in the Queen of Cities
  'byzantine-02': 527,   // Justinian and Theodora
  'byzantine-10': 529,   // The Justice of Rome (Corpus Juris Civilis)
  'byzantine-17': 550,   // Windows into Heaven (icons)
  'byzantine-03': 626,   // The Empire Besieged
  'byzantine-18': 634,   // The Crescent and the Cross
  'byzantine-04': 726,   // Iconoclasm
  'byzantine-15': 797,   // The Empresses of Byzantium (Irene sole ruler)
  'byzantine-11': 850,   // Scholars of the Second Rome
  'byzantine-05': 863,   // Cyril and Methodius
  'byzantine-21': 867,   // The Macedonian Renaissance
  'byzantine-12': 900,   // The Golden Bezant
  'byzantine-08': 963,   // Mount Athos and the Orthodox Soul
  'byzantine-14': 988,   // The Baptism of the Rus
  'byzantine-06': 1054,  // The Great Schism
  'byzantine-07': 1081,  // Golden Age and Betrayal (Komnenian restoration)
  'byzantine-19': 1204,  // Empire in Exile (Nicaea)
  'byzantine-16': 1261,  // The Last Great Recovery (Palaiologan)
  'byzantine-09': 1453,  // 1453: The Fall of Constantinople
  'byzantine-20': 1454,  // The Immortal Empire (the legacy)
  'byzantine-22': 1460,  // Heirs of Constantinople

  // ── Middle Ages ───────────────────────────────────────────────────────────
  'medieval-01': 476,   // The Fall of Rome and Early Middle Ages
  'medieval-12': 500,   // The Age of Faith
  'medieval-19': 618,   // The Middle Kingdom's Golden Age (Tang)
  'medieval-08': 711,   // Al-Andalus and the Reconquista
  'medieval-10': 768,   // Charlemagne
  'medieval-07': 793,   // The Viking Age (Lindisfarne)
  'medieval-11': 800,   // The World of the Manor
  'medieval-22': 802,   // The Khmer Empire and Angkor
  'medieval-18': 862,   // Rus and the Rise of Moscow
  'medieval-02': 1096,  // The Crusades and the Islamic Golden Age
  'medieval-13': 1100,  // Cathedrals and Universities
  'medieval-04': 1100,  // Medieval Economy: Guilds and Towns
  'medieval-20': 1100,  // The Women of the Middle Ages
  'medieval-21': 1100,  // Great Zimbabwe and the Swahili Coast
  'medieval-14': 1150,  // The Poets of the Middle Ages
  'medieval-06': 1185,  // Medieval Japan: Samurai and Shoguns
  'medieval-05': 1206,  // The Mongol Empire
  'medieval-17': 1206,  // Sultans and Temples (Delhi Sultanate)
  'medieval-15': 1235,  // The Gold of Mali
  'medieval-16': 1258,  // After the Golden Age (sack of Baghdad)
  'medieval-09': 1337,  // The Hundred Years' War
  'medieval-03': 1347,  // The Black Death

  // ── Early Modern ──────────────────────────────────────────────────────────
  'earlymod-01': 1400,  // The Renaissance and Age of Exploration
  'earlymod-14': 1405,  // The Treasure Fleets (Zheng He)
  'earlymod-12': 1440,  // The Word Unbound (printing press)
  'earlymod-21': 1464,  // The Songhai Empire (Sunni Ali)
  'earlymod-10': 1492,  // Two Worlds Collide
  'earlymod-15': 1501,  // The Shah's Persia (Safavid)
  'earlymod-02': 1517,  // The Protestant Reformation
  'earlymod-06': 1520,  // The Ottoman Empire: Suleiman
  'earlymod-08': 1526,  // The Mughal Empire
  'earlymod-05': 1526,  // The Transatlantic Slave Trade
  'earlymod-03': 1543,  // Scientific Revolution and Enlightenment
  'earlymod-18': 1560,  // Fear and the Frozen Years
  'earlymod-13': 1562,  // The Wars of Religion
  'earlymod-11': 1600,  // The Golden Age of Merchants
  'earlymod-09': 1603,  // Tokugawa Japan
  'earlymod-16': 1642,  // The King and Parliament
  'earlymod-04': 1643,  // The Age of Absolutism: Louis XIV
  'earlymod-19': 1682,  // Peter the Great
  'earlymod-17': 1700,  // The Age of Splendor
  'earlymod-20': 1750,  // The Radical Enlightenment
  'earlymod-22': 1768,  // Voyagers of the Pacific (Cook)
  'earlymod-07': 1775,  // The Age of Revolution

  // ── Modern ────────────────────────────────────────────────────────────────
  'modern-01': 1760,  // The Industrial Revolution
  'modern-10': 1775,  // The Age of Revolutions
  'modern-13': 1807,  // The Chains Broken (abolition)
  'modern-12': 1830,  // The Novel and the Modern Soul
  'modern-11': 1848,  // The Birth of Nations
  'modern-22': 1854,  // The Conquest of Disease (Snow, germ theory)
  'modern-14': 1868,  // The Rising Sun (Meiji)
  'modern-05': 1881,  // The Age of Imperialism
  'modern-07': 1893,  // The Macedonian Struggle
  'modern-02': 1914,  // The World Wars
  'modern-15': 1914,  // Collapse and Catastrophe
  'modern-16': 1915,  // The Age of Genocide
  'modern-09': 1915,  // Gandhi and Indian Independence
  'modern-08': 1917,  // The Russian Revolution and the Soviet Century
  'modern-23': 1939,  // The World Wars, Part II
  'modern-24': 1942,  // Second World War, Part II (the war behind the headlines)
  'modern-03': 1947,  // The Cold War and Decolonization
  'modern-19': 1948,  // The Cauldron of the Modern Middle East
  'modern-17': 1949,  // China Reborn
  'modern-18': 1954,  // The Rights Revolutions
  'modern-21': 1957,  // The Space Age
  'modern-06': 1991,  // The Yugoslav Wars
  'modern-20': 1991,  // The Connected World
  'modern-04': 1995,  // Globalization and the Contemporary World
};

/**
 * Rank lessons within one era by when their history begins.
 *
 * Ties keep their existing relative order, so a deliberate pairing (the four
 * twelfth-century Middle Ages lessons, say) stays where the author put it.
 * A lesson with no stamped year sorts to the end rather than to year zero,
 * which would drop it into the middle of antiquity.
 */
export function chronologicalRank<T extends { id: string; order: number }>(lessons: T[]): T[] {
  return [...lessons].sort((a, b) => {
    const ya = LESSON_START_YEAR[a.id] ?? Number.POSITIVE_INFINITY;
    const yb = LESSON_START_YEAR[b.id] ?? Number.POSITIVE_INFINITY;
    if (ya !== yb) return ya - yb;
    return a.order - b.order;
  });
}
