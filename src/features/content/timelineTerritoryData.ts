import type { Language } from '@/i18n/translations';
import { IMPROVED_POLYGONS } from '@/data/historicalBoundaries';
import { refineRing, chaikinSmooth, isSimpleRing } from '@/lib/polygonSanitize';

type ContentLang = Exclude<Language, 'en'>;

export type MarkerType = 'capital' | 'city' | 'battle' | 'port' | 'resource' | 'landmark';
export type RouteType = 'trade' | 'military' | 'religious';

export interface TerritoryMarker {
  name: string;
  nameI18n?: Partial<Record<ContentLang, string>>;
  type: MarkerType;
  lat: number;
  lng: number;
  note?: string;
  year?: number;
}

export interface TerritoryRoute {
  name: string;
  nameI18n?: Partial<Record<ContentLang, string>>;
  type: RouteType;
  points: [number, number][]; // [lat, lng]
  color?: string;
}

export interface TerritoryPolygon {
  coords: [number, number][]; // [lat, lng] closed ring
  color: string;
  fillOpacity?: number;
  label?: string;
}

export interface TerritoryTopic {
  id: string;
  era: 'prehistoric' | 'ancient' | 'byzantine' | 'medieval' | 'early-modern' | 'modern';
  period: string;
  yearRange: [number, number];
  center: [number, number];
  zoom: number;
  title: string;
  titleI18n: Partial<Record<ContentLang, string>>;
  description: string;
  descriptionI18n?: Partial<Record<ContentLang, string>>;
  storyIntroI18n?: Partial<Record<ContentLang, string>>;
  markers: TerritoryMarker[];
  polygons?: TerritoryPolygon[];
  routes?: TerritoryRoute[];
  /**
   * Oceanic / maritime-route topics (voyages, sea trade). These are NOT solid
   * land empires: any polygon is rendered as a dashed nautical boundary corridor
   * (stroke only, no fill/glow/texture) rather than a filled blob, and the topic
   * auto-reveals — a sea voyage has no "territory" to scout out of the fog.
   */
  oceanic?: boolean;
}

export const TERRITORY_TOPICS: TerritoryTopic[] = [

  // ══════════════════════════════════════════════════════
  // PREHISTORIC AGES
  // ══════════════════════════════════════════════════════
  {
    id: 'human-origins',
    era: 'prehistoric',
    period: '300,000 – 10,000 BCE',
    yearRange: [-300000, -10000],
    center: [25, 40],
    zoom: 2,
    title: 'Out of Africa — The Human Journey',
    titleI18n: { es: 'Fuera de África — El viaje humano', ru: 'Из Африки — путь человечества', mk: 'Од Африка — патувањето на човештвото', de: 'Aus Afrika — die Reise der Menschheit', fr: 'Hors d’Afrique — le voyage humain' },
    description: 'Homo sapiens arose in Africa ~300,000 years ago and, from ~60,000 years ago, spread to nearly every corner of the Earth — reaching Australia by sea and the Americas across the Beringia land bridge.',
    polygons: [
      {
        // The African homeland — where humanity spent most of its existence.
        label: 'African Homeland of Homo sapiens',
        color: '#fb923c',
        fillOpacity: 0.22,
        coords: [
          [37,10],[33,11],[31,20],[24,35],[12,43],[11,51],[-1,42],[-11,40],
          [-26,33],[-34,26],[-34,19],[-29,16],[-17,12],[-5,9],[4,9],[6,3],
          [10,-16],[21,-17],[31,-10],[36,-6],[37,10],
        ],
      },
    ],
    routes: [
      { name: 'Out of Africa (~60,000 years ago)', nameI18n: { es: 'Fuera de África (~60 000 años)', ru: 'Из Африки (~60 000 лет назад)', mk: 'Од Африка (~60.000 г.)', de: 'Aus Afrika (~vor 60.000 Jahren)', fr: 'Hors d’Afrique (~il y a 60 000 ans)' }, type: 'trade', color: '#fb923c', points: [[8,40],[13,43],[20,45],[27,52],[28,63],[27,72],[24,85],[20,98]] },
      { name: 'Journey to Australia (~50,000 years ago)', nameI18n: { es: 'Viaje a Australia (~50 000 años)', ru: 'Путь в Австралию (~50 000 лет назад)', mk: 'Пат кон Австралија (~50.000 г.)', de: 'Reise nach Australien (~vor 50.000 Jahren)', fr: 'Voyage vers l’Australie (~il y a 50 000 ans)' }, type: 'trade', color: '#22d3ee', points: [[20,98],[8,105],[-2,120],[-9,130],[-20,138],[-33,143]] },
      { name: 'Into Europe (~45,000 years ago)', nameI18n: { es: 'Hacia Europa (~45 000 años)', ru: 'В Европу (~45 000 лет назад)', mk: 'Во Европа (~45.000 г.)', de: 'Nach Europa (~vor 45.000 Jahren)', fr: 'Vers l’Europe (~il y a 45 000 ans)' }, type: 'trade', color: '#a78bfa', points: [[28,45],[36,36],[41,22],[45,8],[47,2]] },
      { name: 'Peopling of the Americas (~15,000 years ago)', nameI18n: { es: 'Poblamiento de América (~15 000 años)', ru: 'Заселение Америки (~15 000 лет назад)', mk: 'Населување на Америка (~15.000 г.)', de: 'Besiedlung Amerikas (~vor 15.000 Jahren)', fr: 'Peuplement des Amériques (~il y a 15 000 ans)' }, type: 'trade', color: '#34d399', points: [[45,90],[55,110],[64,150],[66,-168],[60,-145],[48,-115],[30,-102],[10,-80],[-12,-70],[-34,-64]] },
    ],
    markers: [
      { name: 'Jebel Irhoud', type: 'landmark', lat: 31.85, lng: -8.87, note: 'Oldest known Homo sapiens fossils (~300,000 years ago)', year: -300000 },
      { name: 'Olduvai Gorge', type: 'landmark', lat: -2.99, lng: 35.35, note: 'The "Cradle of Humankind" — early hominin fossils and Oldowan tools', year: -1800000 },
      { name: 'Blombos Cave', type: 'landmark', lat: -34.4, lng: 21.2, note: 'Engraved ochre and shell beads — early symbolic thought (~75,000 years ago)', year: -75000 },
      { name: 'Denisova Cave', type: 'landmark', lat: 51.4, lng: 84.68, note: 'Home of the Denisovans — a human population known mainly from DNA', year: -50000 },
      { name: 'Chauvet Cave', type: 'landmark', lat: 44.4, lng: 4.42, note: 'Painted lions and rhinos ~36,000 years old', year: -36000 },
      { name: 'Lascaux', type: 'landmark', lat: 45.05, lng: 1.17, note: 'The Great Hall of the Bulls — Ice Age cave art (~17,000 years ago)', year: -17000 },
      { name: 'Lake Mungo', type: 'landmark', lat: -33.75, lng: 143.05, note: 'Early human burials in Australia (~42,000 years ago)', year: -42000 },
      { name: 'Zhoukoudian', type: 'landmark', lat: 39.68, lng: 115.92, note: '"Peking Man" — Homo erectus site near Beijing', year: -700000 },
      { name: 'Göbekli Tepe', type: 'religious', lat: 37.22, lng: 38.92, note: 'Oldest monumental temple on Earth (~9500 BCE)', year: -9500 },
      { name: 'Çatalhöyük', type: 'city', lat: 37.67, lng: 32.83, note: 'One of the first proto-cities — entered through the roof (~7500 BCE)', year: -7500 },
      { name: 'Clovis', type: 'landmark', lat: 34.4, lng: -103.2, note: 'Distinctive fluted spear points of early Americans (~13,000 years ago)', year: -13000 },
      { name: 'Monte Verde', type: 'landmark', lat: -41.5, lng: -73.2, note: 'Early human settlement in southern Chile (~14,500 years ago)', year: -14500 },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ANCIENT WORLD
  // ══════════════════════════════════════════════════════
  {
    id: 'mesopotamia',
    era: 'ancient',
    period: '3100–500 BCE',
    yearRange: [-3100, -500],
    center: [30, 38.5],
    zoom: 5,
    title: 'Mesopotamia & Ancient Egypt',
    titleI18n: { es: 'Mesopotamia y Antiguo Egipto', ru: 'Месопотамия и Древний Египет', mk: 'Месопотамија и антички Египет' },
    description: 'The Fertile Crescent — from Mesopotamia\'s Tigris-Euphrates to Egypt\'s Nile — hosted humanity\'s first cities, writing systems, and law codes.',
    polygons: [
      {
        // Faithful Tigris–Euphrates basin: a crescent hugging both rivers from
        // the Taurus foothills (Carchemish/Cizre) down the Tigris (Mosul,
        // Baghdad) and back up the Euphrates (Ur, Babylon, Deir ez-Zor). Traced
        // from real river/city coordinates, not a rectangle over the desert.
        label: 'Mesopotamia (Tigris-Euphrates)',
        color: '#f59e0b',
        fillOpacity: 0.25,
        coords: [
          [37.15,38.30],[37.35,40.00],[37.30,41.60],[37.20,42.60],
          [36.30,43.10],[35.00,44.40],[33.35,44.60],[32.00,46.10],
          [31.00,47.35],[30.45,47.90],[30.00,48.45],[29.95,48.55],
          [30.55,47.10],[31.55,45.55],[32.55,44.30],[34.05,42.00],
          [35.35,40.10],[36.55,38.85],[37.15,38.30],
        ],
      },
      {
        // Faithful Nile: a thin valley ribbon from Aswan north, flaring into the
        // Delta triangle (Alexandria–Damietta–Port Said). Egypt's real inhabited
        // land follows the river, not a blob across the Western Desert.
        label: 'Ancient Egypt (Nile Valley)',
        color: '#10b981',
        fillOpacity: 0.25,
        coords: [
          [24.02,32.90],[25.70,32.35],[26.55,31.85],[27.20,30.95],
          [28.30,30.70],[29.30,30.90],[30.05,30.95],[30.65,30.15],
          [31.20,29.90],[31.55,30.45],[31.50,31.30],[31.40,31.85],
          [31.25,32.30],[30.75,32.00],[30.10,31.55],[29.30,31.35],
          [28.30,31.20],[27.20,31.55],[26.20,32.40],[25.70,33.00],
          [24.02,33.25],[24.02,32.90],
        ],
      },
    ],
    routes: [
      {
        name: 'Euphrates Trade Corridor',
        nameI18n: { es: 'Corredor Comercial del Éufrates', ru: 'Торговый коридор Евфрата', mk: 'Трговски коридор Еуфрат' },
        type: 'trade',
        color: '#f59e0b',
        points: [[37.0,38.2],[35.35,40.1],[34.0,42.0],[32.55,44.3],[31.0,46.2],[30.45,47.9]],
      },
      {
        name: 'Egypt–Levant Trade Route',
        nameI18n: { es: 'Ruta Comercial Egipto-Levante', ru: 'Торговый путь Египет–Левант', mk: 'Трговски пат Египет–Левант' },
        type: 'trade',
        color: '#10b981',
        points: [[30,32],[31,34],[33,35],[34,36],[33,36]],
      },
    ],
    markers: [
      { name: 'Uruk', type: 'city', lat: 31.32, lng: 45.6, note: 'World\'s first city — cuneiform writing (~3100 BCE)', year: -3100 },
      { name: 'Babylon', type: 'capital', lat: 32.54, lng: 44.42, note: 'Hammurabi\'s Code, Hanging Gardens, heart of Babylonian Empire', year: -1800 },
      { name: 'Ur', type: 'city', lat: 30.96, lng: 46.1, note: 'Major Sumerian city-state and religious centre', year: -2600 },
      { name: 'Nineveh', type: 'capital', lat: 36.36, lng: 43.15, note: 'Assyrian Empire capital — greatest library of ancient world', year: -700 },
      { name: 'Memphis', type: 'capital', lat: 29.84, lng: 31.25, note: 'First capital of unified Egypt, seat of Pharaohs', year: -3100 },
      { name: 'Giza', type: 'landmark', lat: 29.97, lng: 31.13, note: 'Great Pyramids of Khufu, Khafre, Menkaure (~2560 BCE)', year: -2560 },
      { name: 'Thebes', type: 'capital', lat: 25.72, lng: 32.66, note: 'Egyptian New Kingdom capital — Valley of the Kings', year: -1550 },
      { name: 'Persepolis', type: 'capital', lat: 29.93, lng: 52.89, note: 'Ceremonial Achaemenid capital', year: -520 },
      { name: 'Battle of Megiddo', type: 'battle', lat: 32.58, lng: 35.18, note: 'Thutmose III vs Canaanites (1457 BCE) — first recorded battle', year: -1457 },
      { name: 'Hattusa', type: 'capital', lat: 40.02, lng: 34.61, note: 'Hittite Empire capital — great temple complexes and royal archives', year: -1600 },
      { name: 'Assur', type: 'city', lat: 35.46, lng: 43.26, note: 'First Assyrian capital — sacred city of the god Ashur', year: -1900 },
      { name: 'Susa', type: 'city', lat: 32.19, lng: 48.25, note: 'Elamite royal city — later an Achaemenid capital', year: -2000 },
    ],
  },

  {
    id: 'classical-greece',
    era: 'ancient',
    period: '800–323 BCE',
    yearRange: [-800, -323],
    center: [38.5, 24],
    zoom: 6,
    title: 'Classical Greece',
    titleI18n: { es: 'Grecia Clásica', ru: 'Классическая Греция', mk: 'Класична Грција' },
    description: 'Greek city-states forged democracy, philosophy, and science — foundations of Western civilisation. From Athens to Ionia, Greek colonies carried this culture across the Mediterranean.',
    polygons: [
      {
        label: 'Greek World (core)',
        color: '#3b82f6',
        fillOpacity: 0.25,
        coords: [[42,19],[42,26],[40,28],[38,27],[36,26],[35,24],[36,22],[38,22],[39,20],[41,20],[42,19]],
      },
      {
        label: 'Ionian Coast',
        color: '#3b82f6',
        fillOpacity: 0.2,
        coords: [[41,26],[40,28],[39,28],[38,27],[37,28],[38,30],[39,29],[41,27],[41,26]],
      },
    ],
    routes: [
      {
        name: 'Silk & Grain Trade (Aegean)',
        nameI18n: { es: 'Comercio del Egeo', ru: 'Торговля Эгейского моря', mk: 'Трговија на Егејот' },
        type: 'trade',
        color: '#3b82f6',
        points: [[38,24],[39,26],[40,28],[41,29],[40,26],[38,24]],
      },
    ],
    markers: [
      { name: 'Athens', type: 'capital', lat: 37.97, lng: 23.72, note: 'Birthplace of democracy — Parthenon, Socrates, Plato, Aristotle', year: -508 },
      { name: 'Sparta', type: 'capital', lat: 37.07, lng: 22.43, note: 'Militaristic rival of Athens — agoge warrior training', year: -800 },
      { name: 'Olympia', type: 'landmark', lat: 37.6, lng: 21.63, note: 'Ancient Olympic Games held here every 4 years (from 776 BCE)', year: -776 },
      { name: 'Delphi', type: 'landmark', lat: 38.48, lng: 22.5, note: 'Oracle of Apollo — consulted by Greek cities on major decisions', year: -800 },
      { name: 'Battle of Thermopylae', type: 'battle', lat: 38.8, lng: 22.53, note: '300 Spartans vs Persian invasion (480 BCE)', year: -480 },
      { name: 'Battle of Salamis', type: 'battle', lat: 37.94, lng: 23.47, note: 'Greek naval victory that saved Greece from Persia (480 BCE)', year: -480 },
      { name: 'Battle of Marathon', type: 'battle', lat: 38.15, lng: 23.97, note: 'Athens defeated Persian invasion (490 BCE)', year: -490 },
      { name: 'Corinth', type: 'city', lat: 37.94, lng: 22.93, note: 'Wealthy trading city — Corinthian order of architecture', year: -700 },
    ],
  },

  {
    id: 'ancient-macedonia',
    era: 'ancient',
    period: '359–323 BCE',
    yearRange: [-359, -323],
    center: [39, 30],
    zoom: 4,
    title: 'Ancient Macedonia — Alexander the Great',
    titleI18n: { es: 'Antigua Macedonia — Alejandro Magno', ru: 'Древняя Македония — Александр Великий', mk: 'Античка Македонија — Александар Велики' },
    description: 'From the kingdom Philip II forged, Alexander the Great led the Macedonian army across three continents — toppling Persia and carrying Hellenistic civilisation from the Nile to the Indus in just eleven years.',
    polygons: [
      {
        label: 'Kingdom of Macedon & Balkan lands (336 BCE)',
        color: '#f59e0b',
        fillOpacity: 0.28,
        coords: [[41.8,20.6],[42.0,21.4],[41.9,22.3],[41.6,23.6],[41.1,24.4],[40.85,24.72],[40.5,23.6],[40.0,22.6],[40.1,22.0],[40.3,21.4],[41.0,20.75],[41.8,20.6]],
      },
    ],
    routes: [
      {
        name: "Alexander's Conquest Route (334–323 BCE)",
        nameI18n: { es: 'Ruta de conquista de Alejandro (334–323 a.C.)', ru: 'Путь завоеваний Александра (334–323 до н.э.)', mk: 'Патот на освојувањата на Александар (334–323 п.н.е.)' },
        type: 'military',
        color: '#ef4444',
        points: [[40.76,22.52],[40.35,26.4],[40.02,27.28],[38.48,28.04],[36.9,30.7],[36.77,36.15],[33.27,35.2],[31.2,29.92],[29.98,31.13],[31.2,29.92],[36.36,43.15],[32.54,44.42],[32.19,48.26],[29.93,52.89],[36.3,59.6],[36.75,66.9],[39.65,66.97],[34.53,69.17],[32.94,73.73],[30.2,71.47],[25.4,68.3],[29.93,52.89],[32.54,44.42]],
      },
      {
        name: 'Hellenistic Trade Corridor',
        nameI18n: { es: 'Corredor comercial helenístico', ru: 'Эллинистический торговый коридор', mk: 'Хеленистички трговски коридор' },
        type: 'trade',
        color: '#f59e0b',
        points: [[40.64,22.94],[40.15,26.41],[38.42,27.14],[36.2,36.16],[31.2,29.92]],
      },
    ],
    markers: [
      { name: 'Pella', type: 'capital', lat: 40.76, lng: 22.52, note: 'Capital of Macedon — birthplace of Alexander the Great (356 BCE)', year: -356 },
      { name: 'Aigai (Vergina)', type: 'landmark', lat: 40.48, lng: 22.32, note: 'Old royal capital — tombs of the Macedonian kings, Philip II buried here', year: -336 },
      { name: 'Dion', type: 'landmark', lat: 40.17, lng: 22.49, note: 'Sacred city of Zeus — Alexander sacrificed here before invading Asia', year: -334 },
      { name: 'Battle of Chaeronea', type: 'battle', lat: 38.5, lng: 22.84, note: 'Philip II defeats Athens and Thebes — Macedon masters Greece (338 BCE)', year: -338 },
      { name: 'Battle of the Granicus', type: 'battle', lat: 40.02, lng: 27.28, note: "Alexander's first victory over Persia in Asia Minor (334 BCE)", year: -334 },
      { name: 'Battle of Issus', type: 'battle', lat: 36.77, lng: 36.15, note: 'Alexander defeats Darius III — turning point (333 BCE)', year: -333 },
      { name: 'Siege of Tyre', type: 'battle', lat: 33.27, lng: 35.2, note: 'Seven-month siege — Alexander builds a causeway to the island city (332 BCE)', year: -332 },
      { name: 'Alexandria (founded)', type: 'city', lat: 31.2, lng: 29.92, note: 'Founded by Alexander (331 BCE) — became the greatest Hellenistic city', year: -331 },
      { name: 'Battle of Gaugamela', type: 'battle', lat: 36.56, lng: 43.44, note: 'Decisive defeat of Darius III — the Persian Empire falls (331 BCE)', year: -331 },
      { name: 'Persepolis', type: 'city', lat: 29.93, lng: 52.89, note: 'Ceremonial capital — destroyed by Alexander (330 BCE)', year: -330 },
      { name: 'Battle of the Hydaspes', type: 'battle', lat: 32.94, lng: 73.73, note: 'Alexander defeats King Porus in India — his army refuses to go further (326 BCE)', year: -326 },
      { name: 'Babylon', type: 'city', lat: 32.54, lng: 44.42, note: 'Alexander dies here aged 32 (11 June 323 BCE) — his empire fragments', year: -323 },
    ],
  },

  {
    id: 'persian-empire',
    era: 'ancient',
    period: '550–330 BCE',
    yearRange: [-550, -330],
    center: [33, 50],
    zoom: 4,
    title: 'The Persian Empire',
    titleI18n: { es: 'El Imperio Persa', ru: 'Персидская империя', mk: 'Персиската империја' },
    description: 'The Achaemenid Persian Empire — stretching from Egypt to the Indus River — was the largest empire the world had yet seen, unified by the Royal Road and Zoroastrian faith.',
    polygons: [
      {
        label: 'Achaemenid Persian Empire',
        color: '#8b5cf6',
        fillOpacity: 0.25,
        coords: [[40,26],[42,36],[40,44],[38,54],[35,62],[30,64],[26,64],[24,62],[22,58],[20,54],[22,46],[20,42],[21,38],[24,33],[30,33],[31,31],[33,35],[36,36],[38,36],[40,30],[40,26]],
      },
    ],
    routes: [
      {
        name: 'Royal Road (Susa to Sardis)',
        nameI18n: { es: 'Camino Real (Susa–Sardis)', ru: 'Царская дорога (Сузы–Сарды)', mk: 'Кралски Пат (Суза–Сардис)' },
        type: 'military',
        color: '#8b5cf6',
        points: [[32.2,48.3],[34.8,48.5],[36.7,37.9],[38.2,32],[39,27],[38.5,27.2]],
      },
    ],
    markers: [
      { name: 'Persepolis', type: 'capital', lat: 29.93, lng: 52.89, note: 'Ceremonial capital — destroyed by Alexander (330 BCE)', year: -520 },
      { name: 'Susa', type: 'capital', lat: 32.19, lng: 48.26, note: 'Administrative capital and treasury of the empire', year: -550 },
      { name: 'Pasargadae', type: 'landmark', lat: 30.19, lng: 53.17, note: 'Tomb of Cyrus the Great — founder of Persian Empire', year: -530 },
      { name: 'Ecbatana', type: 'city', lat: 34.8, lng: 48.5, note: 'Median capital, summer palace of Persian kings', year: -550 },
      { name: 'Sardis', type: 'city', lat: 38.48, lng: 28.04, note: 'Western capital — gold-rich Lydian city incorporated by Cyrus', year: -547 },
      { name: 'Babylon', type: 'city', lat: 32.54, lng: 44.42, note: 'Incorporated into Persian Empire by Cyrus (539 BCE)', year: -539 },
      { name: 'Battle of Thermopylae', type: 'battle', lat: 38.8, lng: 22.53, note: 'Persian army defeated Greek defenders (480 BCE)', year: -480 },
      { name: 'Battle of Issus', type: 'battle', lat: 36.77, lng: 36.15, note: 'Alexander defeats Darius III — turning point (333 BCE)', year: -333 },
      { name: 'Memphis', type: 'city', lat: 29.84, lng: 31.25, note: 'Egypt under Persian rule — satrapy of Mudraya', year: -525 },
      { name: 'Indus frontier', type: 'landmark', lat: 29, lng: 69, note: 'Eastern border of Persian Empire at the Indus River', year: -518 },
    ],
  },

  {
    id: 'roman-empire',
    era: 'ancient',
    period: '27 BCE–476 CE',
    yearRange: [-27, 476],
    center: [41, 14],
    zoom: 4,
    title: 'The Roman Empire',
    titleI18n: { es: 'El Imperio Romano', ru: 'Римская империя', mk: 'Римската империја' },
    description: 'At its height under Trajan (117 CE), Rome unified the Mediterranean world — from Britain to Mesopotamia — with roads, Latin law, and legions.',
    polygons: [
      {
        label: 'Roman Empire at Peak (117 CE)',
        color: '#ef4444',
        fillOpacity: 0.2,
        // Clean single ring encircling the Mediterranean (no self-intersection):
        // Britannia → Gaul/Rhine → Dacia/Black Sea → Anatolia → Levant → Egypt
        // → North Africa → Mauretania → Hispania → back to Britannia.
        coords: [[54,-2],[51,3],[49,9],[47,18],[45,25],[43,28],[40,35],[36,36],[33,36],[31,34],[30,32],[31,28],[31,20],[33,13],[35,8],[36,2],[35,-3],[36,-6],[40,-9],[44,-9],[48,-4],[51,0],[54,-2]],
      },
    ],
    routes: [
      {
        name: 'Via Appia (Rome → Brindisi)',
        nameI18n: { es: 'Vía Apia', ru: 'Аппиева дорога', mk: 'Апиев Пат' },
        type: 'military',
        color: '#ef4444',
        points: [[41.9,12.5],[40.6,15.8],[40.6,17.9],[40.6,18.0]],
      },
      {
        name: 'Mediterranean Sea Trade',
        nameI18n: { es: 'Comercio Mediterráneo', ru: 'Средиземноморская торговля', mk: 'Средоземноморска трговија' },
        type: 'trade',
        color: '#f59e0b',
        points: [[41.9,12.5],[37.9,-5],[36.8,-4],[36,6],[37.9,15],[31.2,30],[33.5,35],[36.2,36],[37,36],[41,29],[38,24],[37.9,23.7],[41.9,12.5]],
      },
    ],
    markers: [
      { name: 'Rome', type: 'capital', lat: 41.9, lng: 12.5, note: 'Eternal City — heart of an empire of 70 million people', year: -27 },
      { name: 'Carthage', type: 'city', lat: 36.86, lng: 10.32, note: 'Destroyed by Rome after Third Punic War (146 BCE)', year: -146 },
      { name: 'Alexandria', type: 'city', lat: 31.2, lng: 29.92, note: 'Greatest library of the ancient world — centre of Greek learning', year: -30 },
      { name: 'Constantinople', type: 'city', lat: 41.01, lng: 28.98, note: 'Eastern capital founded by Constantine (330 CE)', year: 330 },
      { name: 'Londinium', type: 'city', lat: 51.51, lng: -0.12, note: 'Roman London — frontier city of Britannia (founded 43 CE)', year: 43 },
      { name: 'Jerusalem', type: 'city', lat: 31.77, lng: 35.22, note: 'Jewish revolts — Temple destroyed 70 CE by Titus', year: 70 },
      { name: 'Antioch', type: 'city', lat: 36.2, lng: 36.16, note: 'Third largest city of the empire, early Christian centre', year: 100 },
      { name: 'Colosseum (Rome)', type: 'landmark', lat: 41.89, lng: 12.49, note: 'Amphitheatre seating 80,000 — gladiatorial games', year: 80 },
      { name: 'Battle of Actium', type: 'battle', lat: 38.93, lng: 20.74, note: 'Octavian defeats Mark Antony — end of Republic (31 BCE)', year: -31 },
      { name: 'Hadrian\'s Wall', type: 'landmark', lat: 55.01, lng: -2.5, note: 'Northern frontier wall across Britain (122 CE)', year: 122 },
      { name: 'Lugdunum', type: 'city', lat: 45.75, lng: 4.85, note: 'Roman Lyon — capital of Gaul', year: -43 },
      { name: 'Dacia (gold mines)', type: 'resource', lat: 45.8, lng: 24.5, note: 'Gold and silver mines — conquered by Trajan (106 CE)', year: 106 },
    ],
  },

  {
    id: 'ancient-china',
    era: 'ancient',
    period: '221 BCE–220 CE',
    yearRange: [-221, 220],
    center: [35, 110],
    zoom: 4,
    title: 'Ancient China — Qin & Han Dynasties',
    titleI18n: { es: 'China Antigua — dinastías Qin y Han', ru: 'Древний Китай — династии Цинь и Хань', mk: 'Античка Кина — династиите Цин и Хан' },
    description: 'The Qin Dynasty unified China under Legalist rule; the Han Dynasty consolidated it under Confucian bureaucracy and opened the Silk Road to the West.',
    polygons: [
      {
        label: 'Han Dynasty China',
        color: '#f59e0b',
        fillOpacity: 0.25,
        coords: [[44,86],[42,96],[42,116],[41,122],[40,120],[38,114],[35,118],[32,120],[30,118],[28,116],[25,112],[23,110],[22,106],[24,102],[24,100],[26,100],[30,98],[35,100],[38,98],[40,98],[44,100],[46,90],[44,86]],
      },
    ],
    routes: [
      {
        name: 'Silk Road (Western Han)',
        nameI18n: { es: 'Ruta de la Seda', ru: 'Великий Шёлковый Путь', mk: 'Патот на Свилата' },
        type: 'trade',
        color: '#f59e0b',
        points: [[34.3,109],[39,98],[40.1,94.7],[40,86],[39.6,76],[39.5,65.9],[38,54],[33,44],[36.2,36.2]],
      },
    ],
    markers: [
      { name: "Chang'an (Xi'an)", type: 'capital', lat: 34.27, lng: 108.95, note: 'Qin and Han capital — Terracotta Army of Qin Shi Huang', year: -221 },
      { name: 'Luoyang', type: 'capital', lat: 34.62, lng: 112.45, note: 'Eastern Han capital and centre of Buddhism in China', year: 25 },
      { name: 'Great Wall (Jiayuguan)', type: 'landmark', lat: 39.8, lng: 98.3, note: 'Western end of Han-era Great Wall fortification', year: -210 },
      { name: 'Great Wall (Shanhaiguan)', type: 'landmark', lat: 40.0, lng: 119.7, note: 'Eastern end of Great Wall — "First Pass Under Heaven"', year: -210 },
      { name: 'Dunhuang', type: 'city', lat: 40.14, lng: 94.66, note: 'Silk Road gateway and Buddhist cave paintings', year: 100 },
      { name: 'Terracotta Army', type: 'landmark', lat: 34.38, lng: 109.27, note: '8,000 clay soldiers guarding Emperor Qin Shi Huang\'s tomb', year: -210 },
      { name: 'Silk Route port (Guangzhou)', type: 'port', lat: 23.13, lng: 113.26, note: 'Southern sea trade port connecting to South Asia', year: 100 },
    ],
  },

  // ══════════════════════════════════════════════════════
  // MIDDLE AGES
  // ══════════════════════════════════════════════════════
  {
    id: 'byzantine-empire',
    era: 'byzantine',
    period: '330–1453 CE',
    yearRange: [330, 1453],
    center: [39, 26],
    zoom: 4,
    title: 'The Byzantine Empire at Its Height',
    titleI18n: { es: 'El Imperio bizantino en su apogeo', ru: 'Византийская империя на вершине могущества', mk: 'Византиската империја на својот врв', de: 'Das Byzantinische Reich auf seinem Höhepunkt', fr: "L'Empire byzantin à son apogée" },
    description: 'The Eastern Roman Empire survived the fall of the West by nearly a millennium. Under Justinian (555 CE) it re-took Italy and North Africa; behind the Theodosian Walls it preserved Roman law, Greek learning, and Orthodox Christianity until 1453.',
    descriptionI18n: { es: 'El Imperio romano de Oriente sobrevivió casi un milenio a la caída de Occidente. Bajo Justiniano (555 d.C.) recuperó Italia y el norte de África; tras las murallas teodosianas preservó el derecho romano, el saber griego y el cristianismo ortodoxo hasta 1453.', ru: 'Восточная Римская империя пережила падение Запада почти на тысячу лет. При Юстиниане (555 г.) она вернула Италию и Северную Африку; за Феодосиевыми стенами хранила римское право, греческую учёность и православие до 1453 года.', mk: 'Источното Римско Царство го надживеа падот на Западот речиси илјада години. Под Јустинијан (555 г.) ги поврати Италија и Северна Африка; зад Теодосиевите ѕидишта го чуваше римското право, грчкото знаење и православието до 1453.', de: 'Das Oströmische Reich überlebte den Fall des Westens um fast ein Jahrtausend. Unter Justinian (555) gewann es Italien und Nordafrika zurück; hinter den Theodosianischen Mauern bewahrte es römisches Recht, griechische Gelehrsamkeit und die Orthodoxie bis 1453.', fr: "L'Empire romain d'Orient survécut près d'un millénaire à la chute de l'Occident. Sous Justinien (555), il reprit l'Italie et l'Afrique du Nord ; derrière les murailles théodosiennes, il préserva le droit romain, le savoir grec et l'orthodoxie jusqu'en 1453." },
    polygons: [
      {
        label: 'Core: Balkans, Anatolia & the East (555 CE)',
        color: '#8b5cf6',
        fillOpacity: 0.24,
        coords: [
          [44.5,19],[44.8,22.5],[44,25.5],[43.7,28.6],[41.5,29],[41,31.5],[41.8,35],[41.5,38.5],
          [41.2,41.5],[39.5,43.5],[37.8,42],[37,40],[36.5,36.5],[35.8,36],[34.5,35.9],[33.2,35.2],
          [31.6,34.5],[31,33],[30.6,32.3],[29.8,31],[30.8,28.5],[31.2,25.5],[30.6,22],[31.8,20],
          [33.5,21.5],[35,23.5],[36.3,22.3],[36.8,21],[38.3,20.2],[39.5,19.3],[41,19.3],[42.5,18.5],[44.5,19],
        ],
      },
      {
        label: 'Reconquered Italy & Dalmatia (555 CE)',
        color: '#8b5cf6',
        fillOpacity: 0.2,
        coords: [
          [46.4,13.5],[45.6,13.8],[44.5,15],[43.2,16.5],[42.5,18.3],[41.9,19.4],[40.1,18.5],
          [39.8,16.5],[38.2,16.2],[36.9,15.1],[37.1,13.4],[38.1,12.5],[38.9,16.1],[40,15],
          [41.2,13],[42.4,11.5],[43.8,10.2],[44.4,8.8],[43.7,7.5],[45.5,9],[46.4,13.5],
        ],
      },
      {
        label: 'North Africa & Southern Spain (555 CE)',
        color: '#8b5cf6',
        fillOpacity: 0.18,
        coords: [
          [37.3,10],[36.9,11.1],[35.2,11.1],[33.9,10.1],[33.2,11.5],[32.9,13.2],[32.4,15.2],
          [31.2,16.9],[30.8,15],[31.6,12.5],[32.7,10.5],[33.5,8],[34.8,6],[35.7,3],[35.2,-1],
          [35.1,-3.5],[36,-5.5],[36.5,-6.2],[37.4,-5],[36.7,-3.5],[36.8,-0.5],[37,3],[37.1,6.5],[37.3,10],
        ],
      },
    ],
    routes: [
      {
        name: "Belisarius' Reconquest (533–540)",
        nameI18n: { es: 'La reconquista de Belisario (533–540)', ru: 'Реконкиста Велисария (533–540)', mk: 'Реконквистата на Велизариј (533–540)', de: 'Belisars Rückeroberung (533–540)', fr: 'La reconquête de Bélisaire (533–540)' },
        type: 'trade',
        color: '#f59e0b',
        points: [[41.01,28.98],[37.9,23.7],[36.1,14.3],[36.85,10.3],[37.1,13.4],[38.1,15.6],[40.85,14.25],[41.9,12.5],[44.42,12.2]],
      },
      {
        name: 'Constantinople–Alexandria Trade',
        nameI18n: { es: 'Comercio Constantinopla–Alejandría', ru: 'Торговля Константинополь–Александрия', mk: 'Трговија Константинопол–Александрија', de: 'Handel Konstantinopel–Alexandria', fr: 'Commerce Constantinople–Alexandrie' },
        type: 'trade',
        color: '#8b5cf6',
        points: [[41.01,28.98],[37,36],[33.5,35],[31.2,30]],
      },
    ],
    markers: [
      { name: 'Constantinople', type: 'capital', lat: 41.01, lng: 28.98, note: 'Capital for 1,000 years — fell to Ottomans 1453 CE', year: 330 },
      { name: 'Hagia Sophia', type: 'landmark', lat: 41.0, lng: 28.97, note: 'Greatest church of medieval world (537 CE) — later mosque', year: 537 },
      { name: 'Nicaea', type: 'city', lat: 40.42, lng: 29.72, note: 'Council of Nicaea (325 CE) — defined Christian orthodoxy', year: 325 },
      { name: 'Antioch', type: 'city', lat: 36.2, lng: 36.16, note: 'Patriarchate and major eastern city', year: 500 },
      { name: 'Thessaloniki', type: 'city', lat: 40.64, lng: 22.94, note: 'Second city of the empire', year: 500 },
      { name: 'Ravenna', type: 'city', lat: 44.42, lng: 12.2, note: 'Byzantine Exarchate capital in Italy', year: 540 },
      { name: 'Battle of Yarmouk', type: 'battle', lat: 32.8, lng: 36.1, note: 'Arabs defeat Byzantines — empire loses Levant (636 CE)', year: 636 },
      { name: 'Manzikert', type: 'battle', lat: 39.06, lng: 42.52, note: 'Seljuk Turks destroy Byzantine army — Anatolia lost (1071)', year: 1071 },
      { name: 'Alexandria', type: 'city', lat: 31.2, lng: 29.92, note: 'Patriarchate and grain port of the empire until 641', year: 400 },
      { name: 'Carthage', type: 'city', lat: 36.85, lng: 10.33, note: 'Retaken from the Vandals by Belisarius (533–534)', year: 533 },
      { name: 'Ohrid', type: 'religious', lat: 41.12, lng: 20.8, note: "Clement's Literary School (~893) — cradle of Cyrillic literacy", year: 893 },
      { name: 'Mount Athos', type: 'religious', lat: 40.16, lng: 24.33, note: 'The Holy Mountain — monastic republic since 963', year: 963 },
    ],
  },

  {
    id: 'slavic-mission',
    era: 'byzantine',
    period: '863–988 CE',
    yearRange: [863, 988],
    center: [44, 24],
    zoom: 4,
    title: 'Cyril & Methodius and the Slavic World',
    titleI18n: { es: 'Cirilo y Metodio y el mundo eslavo', ru: 'Кирилл и Мефодий и славянский мир', mk: 'Кирил и Методиј и словенскиот свет', de: 'Kyrill & Method und die slawische Welt', fr: 'Cyrille et Méthode et le monde slave' },
    description: 'From Thessalonica to Moravia and back to Ohrid and Preslav: the mission that gave the Slavs an alphabet, a written language, and Orthodox Christianity — reaching Kiev with the baptism of the Rus in 988.',
    descriptionI18n: { es: 'De Tesalónica a Moravia y de vuelta a Ohrid y Preslav: la misión que dio a los eslavos un alfabeto, una lengua escrita y el cristianismo ortodoxo, llegando a Kiev con el bautismo de la Rus en 988.', ru: 'Из Фессалоник в Моравию и обратно в Охрид и Преслав: миссия, давшая славянам алфавит, письменность и православие — до крещения Руси в 988 году.', mk: 'Од Солун до Моравија и назад кон Охрид и Преслав: мисијата што им даде на Словените азбука, писмен јазик и православие — сè до покрстувањето на Русите во 988.', de: 'Von Thessalonike nach Mähren und zurück nach Ohrid und Preslaw: die Mission, die den Slawen Alphabet, Schriftsprache und Orthodoxie gab — bis zur Taufe der Rus 988.', fr: 'De Thessalonique à la Moravie puis vers Ohrid et Preslav : la mission qui donna aux Slaves un alphabet, une langue écrite et l’orthodoxie — jusqu’au baptême de la Rus’ en 988.' },
    routes: [
      {
        name: 'The Moravian Mission (863)',
        nameI18n: { es: 'La misión morava (863)', ru: 'Моравская миссия (863)', mk: 'Моравската мисија (863)', de: 'Die Mährenmission (863)', fr: 'La mission morave (863)' },
        type: 'trade', color: '#8b5cf6',
        points: [[40.64,22.94],[41.01,28.98],[43.2,27.9],[45.8,21.2],[48.15,17.1],[49.2,16.6]],
      },
      {
        name: 'The Disciples’ Exile to Ohrid & Preslav (886)',
        nameI18n: { es: 'El exilio de los discípulos a Ohrid y Preslav (886)', ru: 'Изгнание учеников в Охрид и Преслав (886)', mk: 'Изгонот на учениците кон Охрид и Преслав (886)', de: 'Das Exil der Schüler nach Ohrid & Preslaw (886)', fr: 'L’exil des disciples vers Ohrid et Preslav (886)' },
        type: 'trade', color: '#22d3ee',
        points: [[49.2,16.6],[47.5,19.05],[44.8,20.5],[42.7,21.2],[41.12,20.8]],
      },
      {
        name: 'Orthodoxy to the Rus (988)',
        nameI18n: { es: 'La ortodoxia hacia la Rus (988)', ru: 'Православие на Русь (988)', mk: 'Православието кај Русите (988)', de: 'Die Orthodoxie zur Rus (988)', fr: 'L’orthodoxie vers la Rus’ (988)' },
        type: 'trade', color: '#34d399',
        points: [[41.01,28.98],[44.6,33.5],[46.6,32.6],[50.45,30.52]],
      },
    ],
    markers: [
      { name: 'Thessalonica', type: 'city', lat: 40.64, lng: 22.94, note: 'Home city of Cyril and Methodius — so Slavic-speaking that "everyone there spoke it"', year: 863 },
      { name: 'Constantinople', type: 'capital', lat: 41.01, lng: 28.98, note: 'The mission was commissioned by the emperor and patriarch here', year: 862 },
      { name: 'Velehrad (Great Moravia)', type: 'city', lat: 49.11, lng: 17.4, note: 'Rastislav’s realm — where the Slavic liturgy was first sung', year: 863 },
      { name: 'Rome', type: 'religious', lat: 41.9, lng: 12.5, note: 'Pope Hadrian II blessed the Slavic books; Cyril died here in 869', year: 869 },
      { name: 'Ohrid', type: 'religious', lat: 41.12, lng: 20.8, note: "Clement's school taught ~3,500 students; the Cyrillic alphabet took shape in this circle", year: 893 },
      { name: 'Preslav', type: 'city', lat: 43.16, lng: 26.82, note: 'The parallel Bulgarian literary school of the disciples', year: 893 },
      { name: 'Kiev', type: 'capital', lat: 50.45, lng: 30.52, note: 'Vladimir baptized the Rus in 988 — Orthodoxy and Cyrillic spread across the north', year: 988 },
    ],
  },

  {
    id: 'islamic-caliphates',
    era: 'medieval',
    period: '632–1258 CE',
    yearRange: [632, 1258],
    center: [28, 30],
    zoom: 3,
    title: 'Islamic Caliphates',
    titleI18n: { es: 'Califatos Islámicos', ru: 'Исламские халифаты', mk: 'Исламски калифати' },
    description: 'From Arabia, Islam spread across the Middle East, North Africa, Spain, and Central Asia within a century — creating a civilisation that preserved Greek science and pioneered algebra, astronomy, and medicine.',
    polygons: [
      {
        label: 'Umayyad Caliphate at peak (750 CE)',
        color: '#10b981',
        fillOpacity: 0.22,
        coords: [[44,-8],[42,4],[38,6],[34,8],[32,14],[30,17],[24,30],[21,37],[15,42],[12,45],[14,51],[20,56],[24,56],[26,62],[28,62],[30,56],[32,58],[34,56],[38,54],[38,48],[36,44],[37,38],[36,36],[36,30],[37,22],[40,22],[42,18],[42,14],[41,10],[38,6],[37,-2],[38,-8],[42,-8],[44,-8]],
      },
    ],
    routes: [
      {
        name: 'Hajj Route (Mecca)',
        nameI18n: { es: 'Ruta del Hajj', ru: 'Паломнический путь (Мекка)', mk: 'Хаџ патека (Мека)' },
        type: 'religious',
        color: '#10b981',
        points: [[40,23],[37,36],[34,40],[30,38],[28,35],[24,40],[21.4,39.8]],
      },
      {
        name: 'Indian Ocean Spice Trade',
        nameI18n: { es: 'Comercio de Especias del Océano Índico', ru: 'Торговля пряностями Индийского океана', mk: 'Трговија со зачини на Индискиот Океан' },
        type: 'trade',
        color: '#f59e0b',
        points: [[21.4,39.8],[15,50],[12,45],[8,77],[11,77],[8,77],[2,73]],
      },
    ],
    markers: [
      { name: 'Mecca', type: 'landmark', lat: 21.42, lng: 39.83, note: 'Birthplace of Islam — holiest city of the Muslim world', year: 610 },
      { name: 'Medina', type: 'capital', lat: 24.47, lng: 39.61, note: "Prophet Muhammad's capital — second holiest city", year: 622 },
      { name: 'Baghdad', type: 'capital', lat: 33.34, lng: 44.4, note: 'Abbasid capital — House of Wisdom, peak of Islamic Golden Age', year: 762 },
      { name: 'Damascus', type: 'capital', lat: 33.51, lng: 36.29, note: 'Umayyad Caliphate capital', year: 661 },
      { name: 'Córdoba', type: 'city', lat: 37.89, lng: -4.78, note: 'Al-Andalus capital — greatest city in 10th-century Europe', year: 756 },
      { name: 'Cairo (Al-Fustat)', type: 'city', lat: 30.04, lng: 31.24, note: 'Egyptian capital — Fatimid Caliphate seat', year: 969 },
      { name: 'Samarkand', type: 'city', lat: 39.65, lng: 66.97, note: 'Silk Road hub — Paper and scholarship centre', year: 750 },
      { name: 'Battle of Tours', type: 'battle', lat: 47.39, lng: 0.69, note: 'Charles Martel halts Islamic expansion into Europe (732)', year: 732 },
      { name: 'Battle of Yarmouk', type: 'battle', lat: 32.8, lng: 36.1, note: 'Muslims defeat Byzantines — conquest of Levant (636)', year: 636 },
      { name: 'Toledo', type: 'city', lat: 39.86, lng: -4.02, note: 'Centre of Arabic-to-Latin translation movement', year: 850 },
    ],
  },

  {
    id: 'mongol-empire',
    era: 'medieval',
    period: '1206–1368 CE',
    yearRange: [1206, 1368],
    center: [48, 90],
    zoom: 3,
    title: 'The Mongol Empire',
    titleI18n: { es: 'El Imperio Mongol', ru: 'Монгольская империя', mk: 'Монголската империја' },
    description: "Genghis Khan's descendants forged the largest contiguous land empire in history — from Korea to Hungary — connecting East and West through the Pax Mongolica.",
    polygons: [
      {
        label: 'Mongol Empire at peak (1279 CE)',
        color: '#a16207',
        fillOpacity: 0.2,
        coords: [[60,32],[55,50],[52,60],[52,80],[52,100],[52,120],[48,130],[43,130],[38,125],[35,120],[30,116],[25,110],[22,105],[24,102],[28,62],[32,58],[35,44],[37,38],[40,36],[42,28],[52,28],[58,38],[56,52],[55,65],[56,80],[56,100],[52,110],[48,120],[42,132],[35,132],[35,120],[40,114],[43,108],[48,105],[54,108],[58,100],[60,90],[62,80],[60,60],[60,45],[60,32]],
      },
    ],
    routes: [
      {
        name: 'Pax Mongolica (Silk Road revival)',
        nameI18n: { es: 'Pax Mongólica (resurgimiento de la Ruta de la Seda)', ru: 'Монгольский мир (возрождение Шёлкового пути)', mk: 'Монголски мир (обновување на Патот на Свилата)' },
        type: 'trade',
        color: '#a16207',
        points: [[34.3,109],[40,98],[40,86],[39.5,66],[38,54],[33,44],[41.01,28.98]],
      },
    ],
    markers: [
      { name: 'Karakorum', type: 'capital', lat: 47.2, lng: 102.84, note: "Genghis Khan's Mongolian capital — hub of conquered world", year: 1220 },
      { name: 'Beijing (Khanbaliq)', type: 'capital', lat: 39.9, lng: 116.4, note: "Kublai Khan's Yuan Dynasty capital", year: 1271 },
      { name: 'Samarkand', type: 'city', lat: 39.65, lng: 66.97, note: 'Major Silk Road city — Genghis Khan conquered 1220', year: 1220 },
      { name: 'Baghdad', type: 'city', lat: 33.34, lng: 44.4, note: 'Sacked 1258 — 800,000 killed, end of Abbasid Caliphate', year: 1258 },
      { name: 'Krakow', type: 'city', lat: 50.06, lng: 19.94, note: 'Westernmost Mongol raid (1241) — devastated', year: 1241 },
      { name: 'Battle of Mohi', type: 'battle', lat: 47.93, lng: 21.13, note: 'Mongols annihilate Hungarian army (1241)', year: 1241 },
      { name: 'Battle of Ain Jalut', type: 'battle', lat: 32.6, lng: 35.34, note: 'Mamluks stop Mongol advance — first major Mongol defeat (1260)', year: 1260 },
      { name: 'Tabriz', type: 'city', lat: 38.08, lng: 46.3, note: 'Ilkhanate capital — Mongol rule over Persia', year: 1260 },
    ],
  },

  {
    id: 'crusader-states',
    era: 'medieval',
    period: '1096–1291 CE',
    yearRange: [1096, 1291],
    center: [34, 37],
    zoom: 6,
    title: 'Crusades & the Holy Land',
    titleI18n: { es: 'Cruzadas y Tierra Santa', ru: 'Крестовые походы и Святая земля', mk: 'Крстоносните походи и Светата Земја' },
    description: 'Nine major Crusades shaped medieval Europe — the First captured Jerusalem (1099), Saladin recaptured it (1187), and the last Crusader stronghold fell at Acre in 1291.',
    polygons: [
      {
        label: 'Crusader States (1100 CE)',
        color: '#f59e0b',
        fillOpacity: 0.3,
        coords: [[34,35],[36,36],[37,36],[37,38],[35,38],[34,37],[33,37],[32,36],[32,35],[32,34],[33,34],[34,35]],
      },
      {
        label: 'Kingdom of Jerusalem',
        color: '#ef4444',
        fillOpacity: 0.25,
        coords: [[32,34],[33,34],[34,35],[33,37],[32,36],[31.5,35],[31,34.5],[30.5,34],[31,33],[32,33],[32,34]],
      },
    ],
    routes: [
      {
        name: 'First Crusade Route',
        nameI18n: { es: 'Ruta de la Primera Cruzada', ru: 'Маршрут Первого Крестового похода', mk: 'Рута на Првата Крстоносна Поход' },
        type: 'military',
        color: '#f59e0b',
        points: [[48.8,2.3],[43.0,12.5],[41.9,12.5],[41.0,28.9],[39.9,32.8],[37.1,36.8],[35.2,36.5],[32.5,35.5],[31.77,35.22]],
      },
    ],
    markers: [
      { name: 'Jerusalem', type: 'landmark', lat: 31.77, lng: 35.22, note: 'Holy city — captured 1099, recaptured by Saladin 1187, fell 1244', year: 1099 },
      { name: 'Acre', type: 'port', lat: 32.92, lng: 35.07, note: 'Last major Crusader city — fell 1291, ending Crusader states', year: 1191 },
      { name: 'Antioch', type: 'city', lat: 36.2, lng: 36.16, note: 'First Crusader principality established 1098', year: 1098 },
      { name: 'Krak des Chevaliers', type: 'landmark', lat: 34.77, lng: 36.28, note: 'Greatest Crusader castle — Knights Hospitaller stronghold', year: 1142 },
      { name: 'Battle of Hattin', type: 'battle', lat: 32.78, lng: 35.55, note: 'Saladin destroys Crusader army — Jerusalem falls (1187)', year: 1187 },
      { name: 'Constantinople', type: 'city', lat: 41.01, lng: 28.98, note: 'Sacked by Fourth Crusade (1204) — great betrayal', year: 1204 },
      { name: 'Edessa', type: 'capital', lat: 37.16, lng: 38.79, note: 'Capital of the first Crusader state — its fall (1144) sparked the Second Crusade', year: 1098 },
      { name: 'Tripoli', type: 'port', lat: 34.43, lng: 35.84, note: 'Capital of the County of Tripoli — held until 1289', year: 1109 },
      { name: 'Aleppo', type: 'city', lat: 36.20, lng: 37.16, note: 'Muslim stronghold of Zengi and Nur ad-Din — never taken by Crusaders', year: 1128 },
    ],
  },

  {
    id: 'viking-age',
    era: 'medieval',
    period: '793–1066 CE',
    yearRange: [793, 1066],
    center: [58, 5],
    zoom: 4,
    title: 'The Viking Age',
    titleI18n: { es: 'La Era Vikinga', ru: 'Эпоха викингов', mk: 'Викиншката ера' },
    description: 'From the raid on Lindisfarne (793) to Stamford Bridge (1066), Norse seafarers raided, traded, and settled from Newfoundland to Baghdad — founding Iceland, the Danelaw, Normandy, and Kievan Rus.',
    routes: [
      {
        name: 'Western Raiding & Settlement Route',
        nameI18n: { es: 'Ruta de saqueo y asentamiento occidental', ru: 'Западный путь набегов и поселений', mk: 'Западен пат на пустошење и населување' },
        type: 'military',
        color: '#ef4444',
        points: [[60.4, 5.3], [59.9, -1.3], [57.5, -3.5], [55.9, -3.2], [53.3, -6.2], [51.5, -0.1], [49.2, -0.4], [48.4, -4.5], [43.4, -8.4]],
      },
      {
        name: 'Eastern River Trade Route (to Byzantium)',
        nameI18n: { es: 'Ruta fluvial oriental (a Bizancio)', ru: 'Восточный речной торговый путь (в Византию)', mk: 'Источен речен трговски пат (до Византија)' },
        type: 'trade',
        color: '#f59e0b',
        points: [[59.3, 18.1], [59.9, 30.3], [58.5, 31.3], [56.8, 35.9], [54.6, 39.7], [50.4, 30.5], [46.5, 30.7], [41.0, 28.9]],
      },
      {
        name: 'North Atlantic Exploration',
        nameI18n: { es: 'Exploración del Atlántico Norte', ru: 'Исследование Северной Атлантики', mk: 'Истражување на Северниот Атлантик' },
        type: 'trade',
        color: '#60a5fa',
        points: [[60.4, 5.3], [62.0, -6.8], [64.1, -21.9], [61.2, -45.4], [51.6, -55.5]],
      },
    ],
    markers: [
      { name: 'Lindisfarne', type: 'battle', lat: 55.68, lng: -1.8, note: 'First recorded Viking raid (793 CE) — shocked Christendom', year: 793 },
      { name: 'Hedeby', type: 'city', lat: 54.49, lng: 9.56, note: 'Great Danish trading town — hub between the North Sea and Baltic', year: 800 },
      { name: 'Kaupang', type: 'port', lat: 59.0, lng: 10.2, note: 'Norway\'s earliest town — Skiringssal trading centre', year: 800 },
      { name: 'Birka', type: 'port', lat: 59.34, lng: 17.54, note: 'Swedish Viking trade hub on Lake Mälaren', year: 800 },
      { name: 'Jorvik (York)', type: 'capital', lat: 53.96, lng: -1.08, note: 'Capital of the Danish kingdom in England — heart of the Danelaw', year: 866 },
      { name: 'Dublin', type: 'city', lat: 53.35, lng: -6.26, note: 'Norse-founded longphort — major slave and silver market', year: 841 },
      { name: 'Reykjavík (Iceland)', type: 'landmark', lat: 64.13, lng: -21.9, note: 'Iceland settled by Norse from c.874 — the Althing founded 930', year: 874 },
      { name: 'Brattahlíð (Greenland)', type: 'landmark', lat: 61.15, lng: -45.5, note: 'Erik the Red\'s estate — Norse Greenland settled c.985', year: 985 },
      { name: 'L\'Anse aux Meadows', type: 'landmark', lat: 51.6, lng: -55.53, note: 'Norse site in Newfoundland — Europeans in America c.1000', year: 1000 },
      { name: 'Novgorod', type: 'city', lat: 58.52, lng: 31.27, note: 'Rurik\'s Varangian seat — birth of the Rus state', year: 862 },
      { name: 'Kiev', type: 'capital', lat: 50.45, lng: 30.52, note: 'Capital of Kievan Rus — Varangian route to the Greeks', year: 882 },
      { name: 'Stamford Bridge', type: 'battle', lat: 53.99, lng: -0.92, note: 'Harald Hardrada killed (1066) — the Viking Age ends', year: 1066 },
      { name: 'Normandy (Rouen)', type: 'landmark', lat: 49.44, lng: 1.1, note: 'Granted to Rollo\'s Norsemen (911) — birth of the Normans', year: 911 },
    ],
  },

  {
    id: 'medieval-japan',
    era: 'medieval',
    period: '1185–1600 CE',
    yearRange: [1185, 1600],
    center: [36, 137],
    zoom: 5,
    title: 'Medieval Japan — Feudal Age',
    titleI18n: { es: 'Japón medieval — era feudal', ru: 'Средневековая Япония — Феодальная эпоха', mk: 'Средновековна Јапонија — феудална ера' },
    description: "Japan's feudal age saw samurai clans battle for supremacy through the Genpei War, the Kamakura and Ashikaga shogunates, and the Sengoku warring period.",
    polygons: [
      {
        label: 'Japanese Archipelago',
        color: '#ef4444',
        fillOpacity: 0.2,
        coords: [[33,130],[35,130],[34,131],[33,131],[32,130],[31,130],[31,131],[33,131],[34,132],[35,133],[35,134],[36,135],[35.5,136],[36,137],[36.5,138],[37,140],[38,141],[39,141],[40,140],[41,141],[42,141],[43,142],[44,144],[45,141],[44,140],[43,141],[42,140],[41,141],[40,141],[38,141],[37,138],[36,137],[35,135],[34,132],[33,131],[33,130]],
      },
    ],
    markers: [
      { name: 'Kyoto', type: 'capital', lat: 35.01, lng: 135.77, note: 'Imperial capital (794–1868 CE) — cultural heart of Japan', year: 794 },
      { name: 'Kamakura', type: 'capital', lat: 35.32, lng: 139.55, note: 'First shogunate capital — Great Buddha statue', year: 1185 },
      { name: 'Osaka', type: 'city', lat: 34.69, lng: 135.5, note: "Toyotomi Hideyoshi's fortress-city — almost unified Japan", year: 1583 },
      { name: 'Edo (Tokyo)', type: 'capital', lat: 35.69, lng: 139.69, note: 'Tokugawa shogunate capital — became modern Tokyo', year: 1603 },
      { name: 'Battle of Dan-no-ura', type: 'battle', lat: 33.97, lng: 130.93, note: 'Minamoto defeat Taira — first shogunate established (1185)', year: 1185 },
      { name: 'Battle of Sekigahara', type: 'battle', lat: 35.37, lng: 136.47, note: 'Tokugawa unifies Japan — 280 years of peace (1600)', year: 1600 },
      { name: 'Nara', type: 'city', lat: 34.68, lng: 135.8, note: 'First permanent capital — great Buddhist temples', year: 710 },
    ],
  },

  // ══════════════════════════════════════════════════════
  // EARLY MODERN
  // ══════════════════════════════════════════════════════
  {
    id: 'transatlantic-slave-trade',
    era: 'early-modern',
    period: '1500–1866 CE',
    yearRange: [1500, 1866],
    center: [10, -35],
    zoom: 3,
    oceanic: true,
    title: 'The Transatlantic Slave Trade',
    titleI18n: { es: 'El comercio transatlántico de esclavos', ru: 'Трансатлантическая работорговля', mk: 'Трансатлантската трговија со робови' },
    description: 'Over 12.5 million enslaved Africans were shipped across the Atlantic on the triangular trade — manufactured goods to Africa, human beings to the Americas, sugar and cotton back to Europe.',
    routes: [
      {
        name: 'Middle Passage (Africa → Americas)',
        nameI18n: { es: 'El Paso del Medio (África → América)', ru: 'Средний путь (Африка → Америка)', mk: 'Средниот премин (Африка → Америка)' },
        type: 'military',
        color: '#ef4444',
        points: [[5.5, 0.5], [4.0, -12.0], [8.0, -28.0], [13.0, -45.0], [13.2, -59.6]],
      },
      {
        name: 'Sugar & Cotton Route (Americas → Europe)',
        nameI18n: { es: 'Ruta del azúcar y algodón (América → Europa)', ru: 'Путь сахара и хлопка (Америка → Европа)', mk: 'Пат на шеќер и памук (Америка → Европа)' },
        type: 'trade',
        color: '#f59e0b',
        points: [[13.2, -59.6], [25.0, -60.0], [35.0, -40.0], [42.0, -20.0], [50.9, -1.4]],
      },
      {
        name: 'Manufactured Goods Route (Europe → Africa)',
        nameI18n: { es: 'Ruta de manufacturas (Europa → África)', ru: 'Путь промышленных товаров (Европа → Африка)', mk: 'Пат на индустриски стоки (Европа → Африка)' },
        type: 'trade',
        color: '#a78bfa',
        points: [[51.5, -0.1], [42.0, -9.5], [28.0, -15.0], [14.0, -17.0], [5.5, 0.5]],
      },
    ],
    markers: [
      { name: 'Elmina Castle', type: 'port', lat: 5.08, lng: -1.35, note: 'Oldest European slaving fort in sub-Saharan Africa (1482)', year: 1482 },
      { name: 'Ouidah', type: 'port', lat: 6.36, lng: 2.08, note: 'Major slaving port of the Kingdom of Dahomey', year: 1700 },
      { name: 'Luanda', type: 'port', lat: -8.84, lng: 13.23, note: 'Portuguese Angola — largest single source of the enslaved', year: 1600 },
      { name: 'Gorée Island', type: 'landmark', lat: 14.67, lng: -17.4, note: 'Senegalese slaving depot — the House of Slaves', year: 1600 },
      { name: 'Salvador da Bahia', type: 'city', lat: -12.97, lng: -38.5, note: 'Brazil received ~40% of all enslaved Africans — sugar capital', year: 1550 },
      { name: 'Kingston', type: 'port', lat: 17.97, lng: -76.79, note: 'Jamaica — hub of the British Caribbean sugar economy', year: 1692 },
      { name: 'Bridgetown', type: 'port', lat: 13.1, lng: -59.62, note: 'Barbados — first English plantation-slavery colony', year: 1627 },
      { name: 'Charleston', type: 'port', lat: 32.78, lng: -79.93, note: 'Main North American slave-importing port', year: 1670 },
      { name: 'Liverpool', type: 'port', lat: 53.41, lng: -2.99, note: 'Europe\'s dominant slave-trading port by the 1740s', year: 1740 },
      { name: 'Cape Coast', type: 'battle', lat: 5.11, lng: -1.24, note: 'British slaving headquarters on the Gold Coast', year: 1664 },
    ],
  },

  {
    id: 'ottoman-empire',
    era: 'early-modern',
    period: '1453–1683 CE',
    yearRange: [1453, 1683],
    center: [39, 32],
    zoom: 4,
    title: 'Ottoman Empire at its Peak',
    titleI18n: { es: 'Imperio Otomano en su apogeo', ru: 'Османская империя на пике могущества', mk: 'Отоманската империја на врвот' },
    description: "Under Suleiman the Magnificent (1520–66), the Ottomans controlled three continents — from the gates of Vienna to the Persian Gulf — the dominant power of the 16th century.",
    polygons: [
      {
        label: 'Ottoman Empire (1600 CE)',
        color: '#ef4444',
        fillOpacity: 0.22,
        coords: [[48,14],[44,24],[42,28],[42,36],[40,44],[38,46],[35,44],[33,38],[30,34],[24,30],[20,37],[21,39],[22,42],[26,50],[28,50],[30,50],[32,56],[36,56],[38,52],[40,46],[42,44],[42,36],[42,28],[43,24],[44,24],[48,18],[50,20],[48,14]],
      },
    ],
    routes: [
      {
        name: 'Ottoman Military Road (Vienna)',
        nameI18n: { es: 'Camino Militar Otomano (Viena)', ru: 'Османский военный путь (Вена)', mk: 'Отомански воен пат (Виена)' },
        type: 'military',
        color: '#ef4444',
        points: [[41.01,28.98],[42,26],[44,18],[46,16],[48.2,16.4]],
      },
    ],
    markers: [
      { name: 'Constantinople (Istanbul)', type: 'capital', lat: 41.01, lng: 28.98, note: 'Taken by Mehmed II (1453) — renamed capital of Ottoman Empire', year: 1453 },
      { name: 'Mecca', type: 'landmark', lat: 21.42, lng: 39.83, note: 'Under Ottoman protection as Custodians of Two Holy Mosques', year: 1517 },
      { name: 'Cairo', type: 'city', lat: 30.04, lng: 31.24, note: 'Mamluk capital conquered by Selim I (1517)', year: 1517 },
      { name: 'Baghdad', type: 'city', lat: 33.34, lng: 44.4, note: 'Taken from Safavid Persia by Suleiman (1534)', year: 1534 },
      { name: 'Vienna', type: 'city', lat: 48.2, lng: 16.37, note: 'Failed Ottoman sieges (1529 and 1683) — turning point', year: 1529 },
      { name: 'Battle of Mohács', type: 'battle', lat: 45.99, lng: 18.7, note: 'Suleiman destroys Hungarian army — Ottomans enter Europe (1526)', year: 1526 },
      { name: 'Battle of Lepanto', type: 'battle', lat: 38.38, lng: 21.33, note: 'Holy League defeats Ottoman fleet — first major Ottoman defeat (1571)', year: 1571 },
      { name: 'Algiers', type: 'port', lat: 36.73, lng: 3.09, note: 'Major Ottoman naval base in North Africa', year: 1525 },
      { name: 'Alexandria', type: 'port', lat: 31.2, lng: 29.92, note: 'Key Mediterranean port under Ottoman administration', year: 1517 },
    ],
  },

  {
    id: 'renaissance-italy',
    era: 'early-modern',
    period: '1400–1600 CE',
    yearRange: [1400, 1600],
    center: [43, 12],
    zoom: 6,
    title: 'Renaissance Italy',
    titleI18n: { es: 'Italia del Renacimiento', ru: 'Ренессансная Италия', mk: 'Ренесансна Италија' },
    description: 'The Italian city-states became the epicentre of the Renaissance — a rebirth of classical art, learning, and humanism funded by Medici banking wealth and Papal patronage.',
    polygons: [
      {
        label: 'Italian Peninsula',
        color: '#10b981',
        fillOpacity: 0.25,
        coords: [[44,8],[46,10],[46,14],[45,14],[44,14],[44,16],[43,14],[41,14],[40,16],[38,16],[37,16],[37,14],[38,12],[39,10],[41,8],[42,8],[44,8]],
      },
    ],
    markers: [
      { name: 'Florence', type: 'capital', lat: 43.77, lng: 11.25, note: 'Medici city — Botticelli, da Vinci, Ghiberti, Brunelleschi', year: 1400 },
      { name: 'Rome (Vatican)', type: 'landmark', lat: 41.9, lng: 12.5, note: 'Sistine Chapel, St. Peter\'s — Michelangelo and Raphael', year: 1450 },
      { name: 'Venice', type: 'city', lat: 45.44, lng: 12.33, note: 'Richest trading republic — Doge\'s Palace, printing press', year: 1400 },
      { name: 'Milan', type: 'city', lat: 45.46, lng: 9.19, note: "Leonardo da Vinci's workshop, Last Supper painted here", year: 1482 },
      { name: 'Genoa', type: 'port', lat: 44.41, lng: 8.93, note: 'Rival maritime republic — birthplace of Columbus', year: 1400 },
      { name: 'Naples', type: 'city', lat: 40.85, lng: 14.27, note: 'Kingdom of Naples — Aragonese and later Spanish rule', year: 1400 },
      { name: 'Pisa', type: 'city', lat: 43.72, lng: 10.4, note: 'Leaning Tower and rival maritime republic', year: 1400 },
    ],
  },

  {
    id: 'age-of-exploration',
    era: 'early-modern',
    period: '1415–1600 CE',
    yearRange: [1415, 1600],
    center: [10, -30],
    zoom: 2,
    title: 'Age of Exploration',
    titleI18n: { es: 'La época de las exploraciones', ru: 'Эпоха Великих открытий', mk: 'Доба на географските откритија' },
    description: 'Portuguese and Spanish explorers mapped Africa\'s coasts, reached India by sea, landed in the Americas, and circumnavigated the globe — reshaping the world forever.',
    polygons: [
      {
        label: 'Iberian Peninsula (base)',
        color: '#f59e0b',
        fillOpacity: 0.3,
        coords: [[44,-8],[44,-2],[39,-2],[36,-2],[36,-8],[38,-9],[44,-8]],
      },
    ],
    routes: [
      {
        name: 'Columbus 1st Voyage (1492)',
        nameI18n: { es: 'Primer Viaje de Colón (1492)', ru: 'Первое плавание Колумба (1492)', mk: 'Прво патување на Колумбо (1492)' },
        type: 'military',
        color: '#3b82f6',
        points: [[38,-9],[30,-17],[22,-30],[18,-66]],
      },
      {
        name: "Da Gama's Route to India (1498)",
        nameI18n: { es: 'Ruta de Da Gama a India (1498)', ru: 'Маршрут Да Гамы в Индию (1498)', mk: 'Рутата на Да Гама кон Индија (1498)' },
        type: 'military',
        color: '#ef4444',
        points: [[38.7,-9.1],[-34.4,18.5],[-26,15],[11.3,43.1],[11.2,51],[11.3,43.5],[10,77]],
      },
      {
        name: "Magellan's Circumnavigation (1519–22)",
        nameI18n: { es: 'Circunnavegación de Magallanes (1519–22)', ru: 'Кругосветное плавание Магеллана (1519–22)', mk: 'Кружно патување на Магелан (1519–22)' },
        type: 'trade',
        color: '#8b5cf6',
        points: [[38,-9],[0,-35],[-40,-65],[-35,-60],[-10,-80],[10,-85],[10,-103],[0,-140],[-20,160],[-30,115],[0,42],[10,44],[38,-9]],
      },
    ],
    markers: [
      { name: 'Lisbon', type: 'capital', lat: 38.72, lng: -9.14, note: "Portugal's hub of maritime exploration", year: 1415 },
      { name: 'Tenochtitlan (Mexico City)', type: 'city', lat: 19.43, lng: -99.13, note: 'Aztec capital — conquered by Cortés (1521)', year: 1521 },
      { name: 'Cusco', type: 'capital', lat: -13.53, lng: -71.97, note: 'Inca capital — conquered by Pizarro (1533)', year: 1533 },
      { name: 'Calicut', type: 'port', lat: 11.25, lng: 75.78, note: "Vasco da Gama's India landing — spice trade opened (1498)", year: 1498 },
      { name: 'Cape of Good Hope', type: 'landmark', lat: -34.36, lng: 18.47, note: 'Rounded by Bartholomeu Dias (1488)', year: 1488 },
      { name: 'Ceuta', type: 'port', lat: 35.89, lng: -5.31, note: 'Portuguese conquest — beginning of the Age of Exploration (1415)', year: 1415 },
      { name: 'Havana', type: 'port', lat: 23.14, lng: -82.38, note: 'Spanish base for Caribbean and Americas', year: 1519 },
      { name: 'Goa', type: 'port', lat: 15.49, lng: 73.83, note: 'Portuguese India capital — spice trade hub', year: 1510 },
      { name: 'Malacca', type: 'port', lat: 2.19, lng: 102.25, note: 'Key Southeast Asian trading port — seized by Portugal 1511', year: 1511 },
    ],
  },

  {
    id: 'protestant-reformation',
    era: 'early-modern',
    period: '1517–1648 CE',
    yearRange: [1517, 1648],
    center: [51, 12],
    zoom: 5,
    title: 'Protestant Reformation',
    titleI18n: { es: 'La Reforma Protestante', ru: 'Протестантская Реформация', mk: 'Протестантската реформација' },
    description: "Luther's 95 Theses (1517) fractured Western Christianity, unleashing a century of religious wars culminating in the Peace of Westphalia (1648) that established modern nation-states.",
    polygons: [
      {
        label: 'Holy Roman Empire (core)',
        color: '#3b82f6',
        fillOpacity: 0.2,
        coords: [[54,8],[54,14],[52,22],[50,18],[48,14],[46,8],[46,6],[47,6],[48,8],[49,8],[50,6],[52,6],[52,8],[54,8]],
      },
      {
        label: 'Protestant Northern Europe',
        color: '#8b5cf6',
        fillOpacity: 0.2,
        coords: [[56,8],[58,14],[60,24],[58,26],[56,24],[54,16],[54,8],[56,8]],
      },
    ],
    markers: [
      { name: 'Wittenberg', type: 'landmark', lat: 51.87, lng: 12.65, note: 'Luther posted 95 Theses here (1517) — start of Reformation', year: 1517 },
      { name: 'Geneva', type: 'city', lat: 46.2, lng: 6.15, note: "Calvin's theocratic republic — Calvinist Reformation centre", year: 1536 },
      { name: 'Zurich', type: 'city', lat: 47.38, lng: 8.54, note: "Zwingli's reformed city — rival to Lutheran Reformation", year: 1519 },
      { name: 'Augsburg', type: 'city', lat: 48.37, lng: 10.9, note: 'Peace of Augsburg (1555) — "cuius regio, eius religio"', year: 1555 },
      { name: 'Worms', type: 'city', lat: 49.63, lng: 8.36, note: 'Diet of Worms — Luther refuses to recant (1521)', year: 1521 },
      { name: 'Rome (Vatican)', type: 'landmark', lat: 41.9, lng: 12.5, note: 'Counter-Reformation — Council of Trent (1545–63)', year: 1545 },
      { name: 'Münster', type: 'city', lat: 51.96, lng: 7.63, note: 'Peace of Westphalia signed here (1648) — modern state system', year: 1648 },
      { name: 'Prague', type: 'city', lat: 50.08, lng: 14.44, note: 'Defenestration of Prague — Thirty Years War begins (1618)', year: 1618 },
      { name: 'Battle of White Mountain', type: 'battle', lat: 50.07, lng: 14.3, note: 'Catholics defeat Protestants — Czech lands subdued (1620)', year: 1620 },
    ],
  },

  // ══════════════════════════════════════════════════════
  // MODERN ERA
  // ══════════════════════════════════════════════════════
  {
    id: 'american-revolution',
    era: 'modern',
    period: '1763–1789 CE',
    yearRange: [1763, 1789],
    center: [38, -78],
    zoom: 4,
    title: 'American Revolution',
    titleI18n: { es: 'Revolución americana', ru: 'Американская революция', mk: 'Американска револуција' },
    description: 'The 13 British colonies declared independence in 1776, creating the United States — the first modern democratic republic, inspiring revolutions worldwide.',
    polygons: [
      {
        label: '13 Colonies (1776)',
        color: '#3b82f6',
        fillOpacity: 0.25,
        coords: [[47,-68],[44,-70],[42,-70],[40,-74],[36,-76],[34,-78],[32,-80],[30,-82],[30,-84],[32,-84],[35,-80],[37,-76],[39,-76],[40,-74],[42,-74],[44,-70],[45,-67],[47,-68]],
      },
    ],
    routes: [
      {
        name: 'Washington\'s Campaigns',
        nameI18n: { es: 'Campañas de Washington', ru: 'Кампании Вашингтона', mk: 'Кампањите на Вашингтон' },
        type: 'military',
        color: '#3b82f6',
        points: [[42.3,-71.1],[40.2,-74.2],[39.9,-75.1],[40.1,-74.5],[40.0,-74.9],[40.2,-75.2],[40.3,-75.1],[37.5,-77.5]],
      },
    ],
    markers: [
      { name: 'Philadelphia', type: 'capital', lat: 39.95, lng: -75.16, note: 'Continental Congress — Declaration of Independence signed 1776', year: 1776 },
      { name: 'Boston', type: 'city', lat: 42.36, lng: -71.06, note: 'Boston Massacre (1770) and Tea Party (1773) — revolution begins', year: 1770 },
      { name: 'Lexington', type: 'battle', lat: 42.44, lng: -71.23, note: 'First shots fired — "shot heard round the world" (1775)', year: 1775 },
      { name: 'Valley Forge', type: 'landmark', lat: 40.1, lng: -75.38, note: "Washington's army wintered here — tested revolutionary resolve", year: 1777 },
      { name: 'Yorktown', type: 'battle', lat: 37.24, lng: -76.51, note: 'British surrender — final major battle of the Revolution (1781)', year: 1781 },
      { name: 'New York', type: 'city', lat: 40.71, lng: -74.0, note: 'British headquarters — Washington inaugurated first President here', year: 1776 },
      { name: 'Bunker Hill', type: 'battle', lat: 42.37, lng: -71.06, note: 'Early battle — British win but suffer heavy losses (1775)', year: 1775 },
    ],
  },

  {
    id: 'french-revolution-napoleon',
    era: 'modern',
    period: '1789–1815 CE',
    yearRange: [1789, 1815],
    center: [47, 8],
    zoom: 4,
    title: 'French Revolution & Napoleon',
    titleI18n: { es: 'Revolución francesa y Napoleón', ru: 'Французская революция и Наполеон', mk: 'Француска револуција и Наполеон' },
    description: 'The French Revolution overthrew the monarchy (1789), and Napoleon\'s conquests spread revolutionary ideals across Europe before his defeat at Waterloo (1815).',
    polygons: [
      {
        label: 'First French Republic / Napoleonic France',
        color: '#3b82f6',
        fillOpacity: 0.25,
        coords: [[51,2],[50,8],[47,8],[46,6],[43,6],[43,8],[44,8],[46,14],[48,14],[50,8],[51,4],[51,2]],
      },
      {
        label: 'Napoleon\'s Empire (1812 peak)',
        color: '#ef4444',
        fillOpacity: 0.15,
        coords: [[56,8],[54,14],[52,22],[50,26],[47,28],[44,28],[44,20],[44,14],[46,8],[47,6],[50,4],[51,2],[54,8],[56,8]],
      },
    ],
    routes: [
      {
        name: "Napoleon's Russian Campaign (1812)",
        nameI18n: { es: 'Campaña Rusa de Napoleón (1812)', ru: 'Русский поход Наполеона (1812)', mk: 'Руската кампања на Наполеон (1812)' },
        type: 'military',
        color: '#ef4444',
        points: [[52,20],[53,24],[54,28],[54,32],[54,36],[55,37.6],[55.75,37.6],[54,36],[52,32],[51,28],[52,24],[52,20]],
      },
    ],
    markers: [
      { name: 'Paris', type: 'capital', lat: 48.85, lng: 2.35, note: 'Revolution epicentre — Bastille stormed 14 July 1789', year: 1789 },
      { name: 'Versailles', type: 'landmark', lat: 48.8, lng: 2.12, note: 'Palace stormed — King Louis XVI arrested, then guillotined', year: 1789 },
      { name: 'Battle of Valmy', type: 'battle', lat: 49.07, lng: 4.78, note: 'French citizen army stops Prussians — saves the Revolution (1792)', year: 1792 },
      { name: 'Battle of Waterloo', type: 'battle', lat: 50.68, lng: 4.41, note: 'Napoleon\'s final defeat — exiled to St. Helena (1815)', year: 1815 },
      { name: 'Battle of Austerlitz', type: 'battle', lat: 49.13, lng: 16.76, note: 'Napoleon\'s greatest victory — three emperors at war (1805)', year: 1805 },
      { name: 'Battle of Trafalgar', type: 'battle', lat: 36.16, lng: -6.02, note: 'Nelson defeats Napoleon\'s navy — Britain rules the seas (1805)', year: 1805 },
      { name: 'Moscow', type: 'city', lat: 55.76, lng: 37.6, note: 'Napoleon enters burning Moscow — catastrophic retreat begins', year: 1812 },
      { name: 'Vienna (Congress)', type: 'city', lat: 48.2, lng: 16.37, note: 'Congress of Vienna (1814–15) — redraws Europe after Napoleon', year: 1814 },
    ],
  },

  {
    id: 'industrial-revolution',
    era: 'modern',
    period: '1760–1900 CE',
    yearRange: [1760, 1900],
    center: [52, -2],
    zoom: 5,
    title: 'Industrial Revolution',
    titleI18n: { es: 'Revolución industrial', ru: 'Промышленная революция', mk: 'Индустриска револуција' },
    description: 'Britain led the world\'s first Industrial Revolution — steam power, railways, textile mills, and urbanisation transformed society from agrarian to industrial by 1850, then spread to Europe and America.',
    polygons: [
      {
        label: 'Britain (industrial core)',
        color: '#f59e0b',
        fillOpacity: 0.3,
        coords: [[58,-5],[58,2],[56,2],[53,2],[51,2],[50,0],[50,-2],[51,-5],[53,-4],[55,-2],[56,-3],[58,-5]],
      },
      {
        label: 'Industrial Europe (1870)',
        color: '#10b981',
        fillOpacity: 0.15,
        coords: [[52,4],[52,14],[50,16],[48,14],[46,8],[47,2],[50,2],[52,4]],
      },
    ],
    routes: [
      {
        name: 'British Railway Network',
        nameI18n: { es: 'Red Ferroviaria Británica', ru: 'Британская железнодорожная сеть', mk: 'Британска железничка мрежа' },
        type: 'trade',
        color: '#f59e0b',
        points: [[51.5,-0.12],[52.0,-2.18],[53.4,-2.2],[53.8,-1.54],[53.4,-3.0],[54.6,-1.1],[55.8,-3.2],[56.1,-3.9]],
      },
    ],
    markers: [
      { name: 'Manchester', type: 'city', lat: 53.48, lng: -2.24, note: 'Textile mills — "Cottonopolis" — industrial centre of Britain', year: 1800 },
      { name: 'Birmingham', type: 'city', lat: 52.48, lng: -1.9, note: 'Ironworks and engineering — Watt\'s steam engine improved here', year: 1780 },
      { name: 'Sheffield', type: 'city', lat: 53.38, lng: -1.47, note: 'Steel production capital — "Steel City"', year: 1850 },
      { name: 'Liverpool', type: 'port', lat: 53.41, lng: -2.99, note: 'Atlantic trade port — cotton in, manufactured goods out', year: 1800 },
      { name: 'London', type: 'capital', lat: 51.51, lng: -0.12, note: 'Financial centre — Bank of England funded industrial expansion', year: 1760 },
      { name: 'Glasgow', type: 'city', lat: 55.86, lng: -4.25, note: 'Clyde shipbuilding — engineering powerhouse of Scotland', year: 1800 },
      { name: 'Ironbridge', type: 'landmark', lat: 52.63, lng: -2.49, note: 'First iron bridge (1779) — symbol of Industrial Revolution', year: 1779 },
      { name: 'Ruhr Valley', type: 'resource', lat: 51.5, lng: 7.2, note: 'German coal and steel heartland — industrial rival to Britain', year: 1850 },
      { name: 'Essen (Krupp)', type: 'resource', lat: 51.45, lng: 7.01, note: 'Krupp steelworks — backbone of German industrial power', year: 1870 },
    ],
  },

  {
    id: 'ww1',
    era: 'modern',
    period: '1914–1918 CE',
    yearRange: [1914, 1918],
    center: [49, 14],
    zoom: 4,
    title: 'World War I',
    titleI18n: { es: 'Primera Guerra Mundial', ru: 'Первая мировая война', mk: 'Прва светска војна' },
    description: 'The Great War killed 20 million people — trench warfare on the Western Front, collapse of four empires, and the redrawing of Europe\'s map at Versailles (1919).',
    polygons: [
      {
        label: 'Allied Powers (approximate core)',
        color: '#3b82f6',
        fillOpacity: 0.15,
        coords: [[51,2],[50,8],[47,8],[44,8],[43,8],[43,6],[46,0],[50,0],[51,2]],
      },
      {
        label: 'Central Powers (approximate core)',
        color: '#ef4444',
        fillOpacity: 0.15,
        coords: [[54,8],[54,16],[50,22],[48,16],[47,8],[50,8],[54,8]],
      },
    ],
    routes: [
      {
        name: 'Western Front (1914–18)',
        nameI18n: { es: 'Frente Occidental (1914–18)', ru: 'Западный фронт (1914–18)', mk: 'Западен фронт (1914–18)' },
        type: 'military',
        color: '#ef4444',
        points: [[51,3],[50.5,4],[50.5,6],[50.3,7],[49.8,7],[49.3,7],[48.8,7],[47.7,7.3]],
      },
      {
        name: 'Eastern Front (1914–18)',
        nameI18n: { es: 'Frente Oriental (1914–18)', ru: 'Восточный фронт (1914–18)', mk: 'Источен фронт (1914–18)' },
        type: 'military',
        color: '#8b5cf6',
        points: [[57,24],[55,26],[52,24],[50,24],[48,24],[47,22],[45,28],[43,28]],
      },
    ],
    markers: [
      { name: 'Sarajevo', type: 'battle', lat: 43.85, lng: 18.37, note: 'Assassination of Archduke Franz Ferdinand — war trigger (1914)', year: 1914 },
      { name: 'Battle of the Marne', type: 'battle', lat: 49.03, lng: 3.51, note: 'Germany halted — trench warfare begins (1914)', year: 1914 },
      { name: 'Battle of Verdun', type: 'battle', lat: 49.16, lng: 5.38, note: '700,000 casualties — longest battle of WWI (1916)', year: 1916 },
      { name: 'Battle of the Somme', type: 'battle', lat: 50.0, lng: 2.6, note: '60,000 British dead on first day — tanks first used (1916)', year: 1916 },
      { name: 'Gallipoli', type: 'battle', lat: 40.38, lng: 26.68, note: 'Allied disaster vs Ottomans — Churchill\'s plan fails (1915)', year: 1915 },
      { name: 'Paris', type: 'capital', lat: 48.85, lng: 2.35, note: 'Allied capital — nearly fell in 1914 and 1918', year: 1914 },
      { name: 'Berlin', type: 'capital', lat: 52.52, lng: 13.4, note: 'German capital — surrendered November 11, 1918', year: 1914 },
      { name: 'Versailles', type: 'landmark', lat: 48.8, lng: 2.12, note: 'Treaty of Versailles (1919) — redraws European map', year: 1919 },
    ],
  },

  {
    id: 'ww2',
    era: 'modern',
    period: '1939–1945 CE',
    yearRange: [1939, 1945],
    center: [50, 15],
    zoom: 4,
    title: 'World War II',
    titleI18n: { es: 'Segunda Guerra Mundial', ru: 'Вторая мировая война', mk: 'Втора светска војна' },
    description: 'The deadliest conflict in history — 70–85 million killed, the Holocaust, atomic bombs on Japan, and the post-war world order with the UN, NATO, and Cold War.',
    polygons: [
      {
        label: 'Axis-controlled Europe (1942 peak)',
        color: '#ef4444',
        fillOpacity: 0.18,
        coords: [[62,22],[60,28],[58,28],[56,24],[52,28],[50,34],[47,36],[44,28],[44,20],[44,14],[46,8],[47,6],[50,4],[52,4],[52,10],[54,14],[56,18],[60,20],[62,22]],
      },
    ],
    routes: [
      {
        name: 'D-Day Allied Advance',
        nameI18n: { es: 'Avance Aliado en el Día D', ru: 'Союзное наступление в День Д', mk: 'Сојузничкото напредување на D-Day' },
        type: 'military',
        color: '#3b82f6',
        points: [[51,0],[49.4,-0.5],[49,1],[49,3],[50,4],[51,3],[52,6],[52,10],[53,13],[52,14],[50,18]],
      },
      {
        name: 'Operation Barbarossa',
        nameI18n: { es: 'Operación Barbarroja', ru: 'Операция «Барбаросса»', mk: 'Операција Барбароса' },
        type: 'military',
        color: '#ef4444',
        points: [[54,22],[54,28],[54,32],[55,37],[56,34],[52,34],[50,34],[48,36],[47,38]],
      },
    ],
    markers: [
      { name: 'Berlin', type: 'capital', lat: 52.52, lng: 13.4, note: 'Nazi Germany capital — fell May 2, 1945 to Soviet forces', year: 1939 },
      { name: 'D-Day (Normandy)', type: 'battle', lat: 49.4, lng: -0.5, note: 'Largest seaborne invasion in history — June 6, 1944', year: 1944 },
      { name: 'Stalingrad', type: 'battle', lat: 48.7, lng: 44.5, note: 'Turning point on Eastern Front — 2 million casualties (1942–43)', year: 1942 },
      { name: 'Battle of Britain', type: 'battle', lat: 51.5, lng: -0.12, note: 'RAF defeats Luftwaffe — Hitler abandons invasion of Britain (1940)', year: 1940 },
      { name: 'Pearl Harbor', type: 'battle', lat: 21.35, lng: -157.98, note: 'Japanese attack brings USA into the war (Dec 7, 1941)', year: 1941 },
      { name: 'Hiroshima', type: 'city', lat: 34.39, lng: 132.45, note: 'First atomic bomb dropped — 70,000 killed instantly (Aug 6, 1945)', year: 1945 },
      { name: 'Auschwitz', type: 'landmark', lat: 50.03, lng: 19.18, note: 'Largest Nazi death camp — 1.1 million killed', year: 1940 },
      { name: 'Moscow', type: 'city', lat: 55.76, lng: 37.6, note: 'German advance stopped at Moscow — Operation Typhoon fails (1941)', year: 1941 },
      { name: 'El Alamein', type: 'battle', lat: 30.84, lng: 28.95, note: 'Montgomery defeats Rommel — Germany exits North Africa (1942)', year: 1942 },
    ],
  },

  {
    id: 'cold-war',
    era: 'modern',
    period: '1947–1991 CE',
    yearRange: [1947, 1991],
    center: [55, 30],
    zoom: 3,
    title: 'Cold War',
    titleI18n: { es: 'Guerra Fría', ru: 'Холодная война', mk: 'Студена војна' },
    description: 'The USA and USSR divided the world into competing blocs — NATO vs Warsaw Pact — in a nuclear standoff that shaped politics, culture, and technology until the USSR\'s collapse in 1991.',
    polygons: [
      {
        label: 'Western Bloc (NATO)',
        color: '#3b82f6',
        fillOpacity: 0.15,
        coords: [[58,-5],[62,10],[62,22],[55,22],[52,24],[50,18],[48,14],[46,8],[44,8],[43,6],[46,0],[50,0],[51,2],[52,4],[54,8],[58,-5]],
      },
      {
        label: 'Eastern Bloc (Warsaw Pact)',
        color: '#ef4444',
        fillOpacity: 0.15,
        coords: [[62,22],[62,40],[58,44],[55,37],[52,36],[50,34],[47,28],[44,28],[44,20],[48,14],[50,18],[52,22],[55,22],[62,22]],
      },
      {
        label: 'Soviet Union',
        color: '#dc2626',
        fillOpacity: 0.12,
        coords: [[68,24],[68,40],[60,44],[55,55],[55,80],[55,110],[50,135],[45,140],[42,140],[40,130],[38,68],[36,60],[34,52],[36,44],[40,44],[42,36],[44,28],[47,28],[50,34],[52,36],[55,37],[58,44],[62,40],[68,40],[68,24]],
      },
    ],
    routes: [
      {
        name: 'Berlin Airlift Route (1948–49)',
        nameI18n: { es: 'Ruta del Puente Aéreo de Berlín (1948–49)', ru: 'Маршрут Берлинского воздушного моста (1948–49)', mk: 'Берлинскиот воздушен мост (1948–49)' },
        type: 'military',
        color: '#3b82f6',
        points: [[53.5,9.9],[52.37,13.1]],
      },
    ],
    markers: [
      { name: 'Berlin Wall', type: 'landmark', lat: 52.52, lng: 13.4, note: 'Divided city 1961–1989 — most potent symbol of Iron Curtain', year: 1961 },
      { name: 'Washington D.C.', type: 'capital', lat: 38.9, lng: -77.04, note: 'US capital — NATO alliance leader', year: 1947 },
      { name: 'Moscow', type: 'capital', lat: 55.76, lng: 37.6, note: 'Soviet capital — Kremlin and Warsaw Pact leader', year: 1947 },
      { name: 'Cuba (Missile Crisis)', type: 'battle', lat: 21.5, lng: -79.5, note: 'Soviet missiles discovered — 13 days to nuclear war (1962)', year: 1962 },
      { name: 'Korean 38th Parallel', type: 'battle', lat: 38.0, lng: 127.0, note: 'Korean War (1950–53) — first hot war of Cold War era', year: 1950 },
      { name: 'Saigon (Ho Chi Minh City)', type: 'battle', lat: 10.8, lng: 106.66, note: 'Vietnam War — US defeat and withdrawal (1975)', year: 1965 },
      { name: 'Checkpoint Charlie', type: 'landmark', lat: 52.51, lng: 13.39, note: 'Famous Berlin crossing point between East and West', year: 1961 },
      { name: 'Kabul', type: 'battle', lat: 34.53, lng: 69.17, note: 'Soviet-Afghan War (1979–89) — USSR\'s Vietnam', year: 1979 },
    ],
  },

  {
    id: 'yugoslav-wars',
    era: 'modern',
    period: '1991–2001 CE',
    yearRange: [1991, 2001],
    center: [44, 19],
    zoom: 6,
    title: 'Yugoslav Wars',
    titleI18n: { es: 'Guerras yugoslavas', ru: 'Югославские войны', mk: 'Југословенски војни' },
    description: 'The dissolution of Yugoslavia produced the bloodiest conflict in Europe since WWII — ethnic cleansing, siege of Sarajevo, NATO intervention, and the emergence of seven new nations.',
    polygons: [
      {
        label: 'Former Yugoslavia',
        color: '#ef4444',
        fillOpacity: 0.2,
        coords: [[46,13],[47,16],[46,18],[44,18],[44,20],[46,22],[46,24],[44,22],[43,22],[42,22],[42,20],[40,18],[40,22],[42,22],[43,20],[44,20],[46,24],[46,22],[44,22],[44,18],[46,18],[47,16],[46,13]],
      },
    ],
    markers: [
      { name: 'Sarajevo', type: 'battle', lat: 43.85, lng: 18.37, note: 'Longest siege of a capital in modern warfare (1992–96) — 11,000 killed', year: 1992 },
      { name: 'Srebrenica', type: 'battle', lat: 44.1, lng: 19.3, note: 'Genocide of 8,000 Bosniak men — worst massacre in Europe since WWII (1995)', year: 1995 },
      { name: 'Belgrade', type: 'capital', lat: 44.82, lng: 20.46, note: 'Serbian capital — NATO bombed to stop Kosovo War (1999)', year: 1991 },
      { name: 'Vukovar', type: 'battle', lat: 45.35, lng: 18.99, note: 'Croatian city destroyed by Yugoslav army — 1991', year: 1991 },
      { name: 'Prishtina (Kosovo)', type: 'city', lat: 42.67, lng: 21.17, note: 'Kosovo War — NATO forces Kosovo independence (1999)', year: 1999 },
      { name: 'Zagreb', type: 'capital', lat: 45.81, lng: 15.98, note: 'Croatian capital — declared independence June 25, 1991', year: 1991 },
      { name: 'Ljubljana', type: 'capital', lat: 46.05, lng: 14.51, note: 'Slovenian capital — first to break away, Ten-Day War (1991)', year: 1991 },
      { name: 'Dayton (Ohio)', type: 'landmark', lat: 39.76, lng: -84.19, note: 'Dayton Agreement (1995) — ended Bosnian War', year: 1995 },
    ],
  },

  {
    id: 'macedonian-struggle',
    era: 'modern',
    period: '1878–1913 CE',
    yearRange: [1878, 1913],
    center: [41.5, 22],
    zoom: 6,
    title: 'Macedonian Struggle',
    titleI18n: { es: 'La lucha macedonia', ru: 'Македонская борьба', mk: 'Македонската борба' },
    description: 'Following Ottoman decline, the Macedonian Question — Bulgarian, Greek, and Serbian claims — erupted in guerrilla war, the Ilinden Uprising (1903), and the Balkan Wars (1912–13).',
    polygons: [
      {
        label: 'Macedonia (Ottoman Vilayet)',
        color: '#8b5cf6',
        fillOpacity: 0.3,
        coords: [[42.5,20],[43,22],[43,26],[41,26],[40,26],[40,22],[40,20],[41,19],[42,19],[42.5,20]],
      },
    ],
    markers: [
      { name: 'Bitola (Monastir)', type: 'capital', lat: 41.03, lng: 21.33, note: 'Ottoman Vilayet capital — major urban centre of Macedonia', year: 1900 },
      { name: 'Skopje (Üsküp)', type: 'capital', lat: 42.0, lng: 21.43, note: 'Regional capital — later capital of Republic of Macedonia', year: 1900 },
      { name: 'Smilevo', type: 'landmark', lat: 41.2, lng: 21.4, note: 'Site of IMRO Congress — Ilinden Uprising planned here (1903)', year: 1903 },
      { name: 'Kruševo', type: 'battle', lat: 41.37, lng: 21.25, note: 'Ilinden Uprising — short-lived Kruševo Republic (August 1903)', year: 1903 },
      { name: 'Thessaloniki (Selanik)', type: 'city', lat: 40.64, lng: 22.94, note: 'Major Ottoman port — birthplace of Atatürk', year: 1900 },
      { name: 'Ohrid', type: 'city', lat: 41.12, lng: 20.8, note: 'Ancient city — Ohrid Archbishopric centre of Slavic literacy', year: 900 },
      { name: 'Battle of Kumanovo', type: 'battle', lat: 42.13, lng: 21.71, note: 'Serbian victory over Ottomans — First Balkan War (1912)', year: 1912 },
      { name: 'Battle of Bitola', type: 'battle', lat: 41.03, lng: 21.33, note: 'End of Ottoman rule in Macedonia (1912)', year: 1912 },
    ],
  },
  {
    id: 'hellenistic-world',
    era: 'ancient',
    period: '323\u201330 BCE',
    yearRange: [-323, -30],
    center: [33, 38],
    zoom: 4,
    title: 'The Hellenistic World',
    titleI18n: { es: 'El mundo helen\u00edstico', ru: '\u042d\u043b\u043b\u0438\u043d\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043c\u0438\u0440', mk: '\u0425\u0435\u043b\u0435\u043d\u0438\u0441\u0442\u0438\u0447\u043a\u0438\u043e\u0442 \u0441\u0432\u0435\u0442' },
    description: 'After Alexander\'s death his marshals carved the empire into three great kingdoms \u2014 Ptolemaic Egypt, the Seleucid East, and Antigonid Macedon \u2014 spreading Greek cities and science from the Nile to the Hindu Kush.',
    markers: [
      { name: 'Alexandria', nameI18n: { es: 'Alejandr\u00eda', ru: '\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440\u0438\u044f', mk: '\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440\u0438\u0458\u0430' }, type: 'capital', lat: 31.2, lng: 29.92, note: 'Ptolemaic capital \u2014 the Library and Pharos lighthouse', year: -305 },
      { name: 'Antioch', type: 'capital', lat: 36.2, lng: 36.16, note: 'Seleucid royal capital on the Orontes', year: -300 },
      { name: 'Pella', type: 'capital', lat: 40.76, lng: 22.52, note: 'Antigonid capital of Macedon', year: -276 },
      { name: 'Pergamon', type: 'city', lat: 39.13, lng: 27.18, note: 'Attalid kingdom \u2014 library second only to Alexandria', year: -241 },
    ],
  },
  {
    id: 'achaemenid-persia',
    era: 'ancient',
    period: '550\u2013330 BCE',
    yearRange: [-550, -330],
    center: [33, 50],
    zoom: 4,
    title: 'The Achaemenid Persian Empire',
    titleI18n: { es: 'El Imperio aquem\u00e9nida', ru: '\u0414\u0435\u0440\u0436\u0430\u0432\u0430 \u0410\u0445\u0435\u043c\u0435\u043d\u0438\u0434\u043e\u0432', mk: '\u0410\u0445\u0430\u0435\u043c\u0435\u043d\u0438\u0434\u0441\u043a\u0430\u0442\u0430 \u0438\u043c\u043f\u0435\u0440\u0438\u0458\u0430' },
    description: 'The first superpower: from Cyrus the Great\'s tolerance to Darius\'s satrapies and Royal Road, Persia ruled from the Aegean to the Indus \u2014 the template every later empire copied.',
    markers: [
      { name: 'Persepolis', type: 'capital', lat: 29.93, lng: 52.89, note: 'Ceremonial capital begun by Darius I', year: -518 },
      { name: 'Susa', type: 'capital', lat: 32.19, lng: 48.25, note: 'Administrative capital \u2014 eastern end of the Royal Road', year: -521 },
      { name: 'Sardis', type: 'city', lat: 38.48, lng: 28.04, note: 'Western terminus of the 2,700 km Royal Road', year: -546 },
      { name: 'Pasargadae', type: 'landmark', lat: 30.2, lng: 53.17, note: 'Tomb of Cyrus the Great', year: -530 },
    ],
  },
  {
    id: 'al-andalus',
    era: 'medieval',
    period: '711\u20131492 CE',
    yearRange: [711, 1492],
    center: [40, -4],
    zoom: 5,
    title: 'Al-Andalus & the Reconquista',
    titleI18n: { es: 'Al-\u00c1ndalus y la Reconquista', ru: '\u0410\u043b\u044c-\u0410\u043d\u0434\u0430\u043b\u0443\u0441 \u0438 \u0420\u0435\u043a\u043e\u043d\u043a\u0438\u0441\u0442\u0430', mk: '\u0410\u043b-\u0410\u043d\u0434\u0430\u043b\u0443\u0437 \u0438 \u0420\u0435\u043a\u043e\u043d\u043a\u0438\u0441\u0442\u0430\u0442\u0430' },
    description: 'Islamic Iberia at the height of the Caliphate of C\u00f3rdoba, facing the Christian kingdoms of the north \u2014 a 780-year contest that ended at Granada in 1492.',
    markers: [
      { name: 'C\u00f3rdoba', type: 'capital', lat: 37.88, lng: -4.78, note: 'Caliphal capital \u2014 \u201cornament of the world\u201d', year: 929 },
      { name: 'Toledo', type: 'city', lat: 39.86, lng: -4.02, note: 'Translation capital \u2014 Arabic science enters Latin Europe', year: 1085 },
      { name: 'Granada', type: 'capital', lat: 37.18, lng: -3.6, note: 'Last Muslim emirate \u2014 the Alhambra; fell 1492', year: 1492 },
      { name: 'Covadonga', type: 'battle', lat: 43.31, lng: -5.05, note: 'Legendary first victory of the Reconquista (c. 722)', year: 722 },
      { name: 'Las Navas de Tolosa', type: 'battle', lat: 38.28, lng: -3.58, note: 'Decisive Christian victory over the Almohads (1212)', year: 1212 },
    ],
  },
  {
    id: 'hundred-years-war',
    era: 'medieval',
    period: '1337\u20131453 CE',
    yearRange: [1337, 1453],
    center: [47.5, 1],
    zoom: 5,
    title: 'The Hundred Years\' War',
    titleI18n: { es: 'La guerra de los Cien A\u00f1os', ru: '\u0421\u0442\u043e\u043b\u0435\u0442\u043d\u044f\u044f \u0432\u043e\u0439\u043d\u0430', mk: '\u0421\u0442\u043e\u0433\u043e\u0434\u0438\u0448\u043d\u0430\u0442\u0430 \u0432\u043e\u0458\u043d\u0430' },
    description: 'England and France, c. 1400: English crown lands face the Valois kingdom in the war of Cr\u00e9cy, Agincourt, and Joan of Arc \u2014 the forge of both nations.',
    markers: [
      { name: 'Cr\u00e9cy', type: 'battle', lat: 50.25, lng: 1.88, note: 'Longbow victory over French chivalry (1346)', year: 1346 },
      { name: 'Agincourt', type: 'battle', lat: 50.46, lng: 2.14, note: 'Henry V\'s mud-soaked triumph (1415)', year: 1415 },
      { name: 'Orl\u00e9ans', type: 'battle', lat: 47.9, lng: 1.9, note: 'Joan of Arc lifts the siege (1429)', year: 1429 },
      { name: 'Reims', type: 'city', lat: 49.26, lng: 4.03, note: 'Coronation of Charles VII (1429)', year: 1429 },
      { name: 'Castillon', type: 'battle', lat: 44.85, lng: -0.04, note: 'Cannon end the war \u2014 last battle (1453)', year: 1453 },
    ],
  },
  {
    id: 'mughal-empire',
    era: 'early-modern',
    period: '1526\u20131707 CE',
    yearRange: [1526, 1707],
    center: [23, 78],
    zoom: 4,
    title: 'The Mughal Empire',
    titleI18n: { es: 'El Imperio mogol', ru: '\u0418\u043c\u043f\u0435\u0440\u0438\u044f \u0412\u0435\u043b\u0438\u043a\u0438\u0445 \u041c\u043e\u0433\u043e\u043b\u043e\u0432', mk: '\u041c\u043e\u0433\u0443\u043b\u0441\u043a\u0430\u0442\u0430 \u0438\u043c\u043f\u0435\u0440\u0438\u0458\u0430' },
    description: 'The Mughal Empire near its greatest extent under Aurangzeb (c. 1700), with Safavid Persia to the west \u2014 the richest manufacturing economy on Earth.',
    markers: [
      { name: 'Delhi', type: 'capital', lat: 28.66, lng: 77.23, note: 'Shahjahanabad \u2014 Red Fort and Jama Masjid', year: 1648 },
      { name: 'Agra', type: 'landmark', lat: 27.17, lng: 78.04, note: 'The Taj Mahal (1632\u20131653)', year: 1632 },
      { name: 'Panipat', type: 'battle', lat: 29.39, lng: 76.97, note: 'Babur founds the empire (1526)', year: 1526 },
      { name: 'Fatehpur Sikri', type: 'landmark', lat: 27.09, lng: 77.66, note: 'Akbar\'s capital and House of Worship', year: 1571 },
    ],
  },
  {
    id: 'tokugawa-japan',
    era: 'early-modern',
    period: '1600\u20131868 CE',
    yearRange: [1600, 1868],
    center: [37, 137.5],
    zoom: 5,
    title: 'Tokugawa Japan',
    titleI18n: { es: 'El Jap\u00f3n Tokugawa', ru: '\u042f\u043f\u043e\u043d\u0438\u044f \u0422\u043e\u043a\u0443\u0433\u0430\u0432\u0430', mk: '\u0422\u043e\u043a\u0443\u0433\u0430\u0432\u0430 \u0408\u0430\u043f\u043e\u043d\u0438\u0458\u0430' },
    description: 'The closed country: 265 years of Tokugawa peace, with Edo among the world\'s largest cities and a single Dutch window at Dejima.',
    markers: [
      { name: 'Edo', type: 'capital', lat: 35.69, lng: 139.69, note: 'Shogunal capital \u2014 over a million people by 1720', year: 1603 },
      { name: 'Kyoto', type: 'city', lat: 35.01, lng: 135.77, note: 'Imperial court \u2014 prestige without power', year: 1600 },
      { name: 'Sekigahara', type: 'battle', lat: 35.37, lng: 136.47, note: 'The battle that decided Japan (1600)', year: 1600 },
      { name: 'Dejima (Nagasaki)', type: 'port', lat: 32.74, lng: 129.87, note: 'The Dutch trading islet \u2014 Japan\'s one window west', year: 1641 },
    ],
  },
  {
    id: 'soviet-rise',
    era: 'modern',
    period: '1917\u20131922 CE',
    yearRange: [1917, 1922],
    center: [55, 45],
    zoom: 4,
    title: 'The Russian Revolution & Civil War',
    titleI18n: { es: 'La Revoluci\u00f3n rusa y la guerra civil', ru: '\u0420\u0435\u0432\u043e\u043b\u044e\u0446\u0438\u044f \u0438 \u0413\u0440\u0430\u0436\u0434\u0430\u043d\u0441\u043a\u0430\u044f \u0432\u043e\u0439\u043d\u0430', mk: '\u0420\u0443\u0441\u043a\u0430\u0442\u0430 \u0440\u0435\u0432\u043e\u043b\u0443\u0446\u0438\u0458\u0430 \u0438 \u0433\u0440\u0430\u0453\u0430\u043d\u0441\u043a\u0430\u0442\u0430 \u0432\u043e\u0458\u043d\u0430' },
    description: 'Revolutionary Russia c. 1920: the Red heartland against White south Russia, a reborn Poland, and a contested Ukraine \u2014 the crucible of the USSR.',
    markers: [
      { name: 'Petrograd', type: 'capital', lat: 59.94, lng: 30.31, note: 'February and October 1917 \u2014 the Winter Palace', year: 1917 },
      { name: 'Moscow', type: 'capital', lat: 55.75, lng: 37.62, note: 'Soviet capital from 1918', year: 1918 },
      { name: 'Tsaritsyn', type: 'battle', lat: 48.7, lng: 44.5, note: 'Civil-war battleground \u2014 later Stalingrad', year: 1919 },
      { name: 'Warsaw', type: 'battle', lat: 52.23, lng: 21.01, note: '\u201cMiracle on the Vistula\u201d halts the Red advance (1920)', year: 1920 },
    ],
  },
  {
    id: 'british-raj-partition',
    era: 'modern',
    period: '1858\u20131947 CE',
    yearRange: [1858, 1947],
    center: [22, 80],
    zoom: 4,
    title: 'The British Raj & Partition',
    titleI18n: { es: 'El Raj brit\u00e1nico y la Partici\u00f3n', ru: '\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u0418\u043d\u0434\u0438\u044f \u0438 \u0420\u0430\u0437\u0434\u0435\u043b', mk: '\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0430 \u0418\u043d\u0434\u0438\u0458\u0430 \u0438 \u041f\u043e\u0434\u0435\u043b\u0431\u0430\u0442\u0430' },
    description: 'British India c. 1900 \u2014 the empire Gandhi\'s satyagraha would unmake, partitioned at midnight in 1947 into India and Pakistan.',
    markers: [
      { name: 'Delhi', type: 'capital', lat: 28.66, lng: 77.23, note: 'Imperial capital from 1911; freedom at midnight, 1947', year: 1947 },
      { name: 'Amritsar', type: 'battle', lat: 31.62, lng: 74.88, note: 'Jallianwala Bagh massacre (1919)', year: 1919 },
      { name: 'Dandi', type: 'landmark', lat: 20.89, lng: 72.81, note: 'End of the Salt March (1930)', year: 1930 },
      { name: 'Lahore', type: 'city', lat: 31.55, lng: 74.34, note: 'Radcliffe Line \u2014 Pakistan\'s cultural capital', year: 1947 },
      { name: 'Calcutta', type: 'city', lat: 22.57, lng: 88.36, note: 'Gandhi\'s fast against partition violence', year: 1947 },
    ],
  },

  // ══════════════════════════════════════════════════════
  // CURRICULUM EXPANSION II — world-history territories
  // Coordinates for cities are real modern positions; empire extents are traced
  // from sourced historical descriptions of each realm's greatest reach.
  // ══════════════════════════════════════════════════════
  {
    id: 'olmec-mesoamerica',
    era: 'ancient',
    period: '1200–400 BCE',
    yearRange: [-1200, -400],
    center: [17.9, -94.6],
    zoom: 7,
    title: 'The Olmec — Mother Culture of the Americas',
    titleI18n: { es: 'Los olmecas — la cultura madre de América', ru: 'Ольмеки — материнская культура Америки', mk: 'Олмеките — мајката-култура на Америка' },
    description: 'The Olmec heartland on the Gulf coast of Mexico (Veracruz and Tabasco), where the first Mesoamerican civilization raised colossal stone heads and seeded the traditions the Maya and Aztec would inherit — and the wider sphere its jade, obsidian, and art reached across early Mesoamerica.',
    polygons: [
      {
        // Core heartland — the humid Gulf lowlands of the San Lorenzo and La
        // Venta centers, traced along the coast and the Coatzacoalcos basin.
        label: 'Olmec Heartland (Gulf Coast)',
        color: '#84cc16',
        fillOpacity: 0.28,
        coords: [
          [18.62,-96.15],[18.78,-95.05],[18.55,-93.95],[18.20,-93.05],
          [17.75,-92.75],[17.30,-93.35],[17.20,-94.35],[17.35,-95.25],
          [17.70,-95.95],[18.10,-96.35],[18.62,-96.15],
        ],
      },
      {
        // Broader Olmec cultural sphere — where Olmec-style art, jade, and
        // iconography spread across the Mesoamerican highlands and Pacific side.
        label: 'Olmec Cultural Sphere',
        color: '#a3e635',
        fillOpacity: 0.10,
        coords: [
          [19.40,-96.60],[19.20,-93.20],[17.90,-91.30],[16.20,-92.20],
          [15.40,-93.90],[16.10,-96.20],[17.10,-98.90],[18.30,-99.30],
          [19.10,-98.20],[19.40,-96.60],
        ],
      },
    ],
    routes: [
      { name: 'Jade & obsidian exchange', nameI18n: { es: 'Intercambio de jade y obsidiana', ru: 'Обмен нефрита и обсидиана', mk: 'Размена на жад и опсидијан' }, type: 'trade', color: '#84cc16', points: [[18.10,-94.03],[17.75,-94.73],[17.55,-96.72],[16.75,-98.60]] },
    ],
    markers: [
      { name: 'San Lorenzo', type: 'capital', lat: 17.75, lng: -94.73, note: 'Earliest great Olmec center — colossal heads carved by ~1200 BCE', year: -1200 },
      { name: 'La Venta', type: 'capital', lat: 18.10, lng: -94.03, note: 'Great clay pyramid and jade offerings (~900 BCE)', year: -900 },
      { name: 'Tres Zapotes', type: 'city', lat: 18.47, lng: -95.44, note: 'Late Olmec center — early Long Count calendar nearby', year: -400 },
      { name: 'Laguna de los Cerros', type: 'city', lat: 18.03, lng: -95.03, note: 'Olmec center near the basalt sources of the Tuxtla Mountains', year: -800 },
      { name: 'Tuxtla Mountains', type: 'resource', lat: 18.55, lng: -95.20, note: 'Basalt source — colossal heads and thrones hauled dozens of km from here', year: -1000 },
      { name: 'Chalcatzingo', type: 'landmark', lat: 18.68, lng: -98.77, note: 'Highland site with Olmec-style rock reliefs — the sphere reaches inland', year: -700 },
      { name: 'Teopantecuanitlan', type: 'landmark', lat: 17.93, lng: -99.13, note: 'Olmec-influenced ceremonial site in Guerrero, far to the west', year: -900 },
      { name: 'Río Pesquero', type: 'landmark', lat: 17.90, lng: -93.40, note: 'Cache of superb Olmec jade offerings recovered from the wetlands', year: -800 },
    ],
  },
  {
    id: 'khmer-empire',
    era: 'medieval',
    period: '802–1431 CE',
    yearRange: [802, 1431],
    center: [14, 104],
    zoom: 5,
    title: 'The Khmer Empire & Angkor',
    titleI18n: { es: 'El Imperio jemer y Angkor', ru: 'Кхмерская империя и Ангкор', mk: 'Кмерската империја и Ангкор' },
    description: 'The Khmer Empire near its greatest extent under Jayavarman VII (c. 1200), reaching into modern Laos, Thailand, and the Malay Peninsula — ruled from Angkor, the largest city of the pre-industrial world, and knit together by a network of royal roads.',
    polygons: [
      {
        // Greatest extent c. 1200 — from the Khorat plateau and southern Laos
        // across Cambodia to the central-Thai plains and the Champa frontier.
        label: 'Khmer Empire (c. 1200)',
        color: '#14b8a6',
        fillOpacity: 0.22,
        coords: [
          [18.35,102.30],[17.60,104.20],[17.30,105.60],[16.20,107.30],
          [14.40,108.30],[13.40,109.05],[11.60,107.30],[10.35,106.20],
          [9.65,104.60],[10.60,103.30],[11.60,102.20],[12.90,100.60],
          [13.90,99.65],[15.10,99.10],[16.20,99.40],[17.35,100.40],
          [18.00,101.50],[18.35,102.30],
        ],
      },
      {
        // Core royal domain — the Cambodian heartland around Angkor and the
        // Tonlé Sap, the empire's rice bowl and ceremonial center.
        label: 'Royal Heartland (Angkor & the Tonlé Sap)',
        color: '#2dd4bf',
        fillOpacity: 0.30,
        coords: [
          [14.30,103.30],[14.10,104.60],[13.10,105.10],[12.20,104.90],
          [11.90,103.80],[12.60,102.90],[13.60,102.90],[14.30,103.30],
        ],
      },
    ],
    routes: [
      { name: 'Royal road: Angkor to Phimai', nameI18n: { es: 'Calzada real: Angkor a Phimai', ru: 'Царская дорога: Ангкор — Пхимай', mk: 'Кралски пат: Ангкор до Пимаи' }, type: 'military', color: '#2dd4bf', points: [[13.44,103.86],[14.35,102.98],[15.22,102.49]] },
      { name: 'Royal road: Angkor to Vijaya (Champa)', nameI18n: { es: 'Calzada real: Angkor a Vijaya', ru: 'Царская дорога: Ангкор — Виджая', mk: 'Кралски пат: Ангкор до Виџаја' }, type: 'military', color: '#5eead4', points: [[13.44,103.86],[13.90,105.60],[13.95,107.40],[13.90,109.10]] },
    ],
    markers: [
      { name: 'Angkor', type: 'capital', lat: 13.44, lng: 103.86, note: 'Angkor Thom and the Bayon — capital of Jayavarman VII', year: 1181 },
      { name: 'Angkor Wat', type: 'landmark', lat: 13.41, lng: 103.87, note: 'Largest religious monument on Earth (early 12th c.)', year: 1150 },
      { name: 'Hariharalaya', type: 'city', lat: 13.35, lng: 103.97, note: 'Early Khmer capital at Roluos', year: 802 },
      { name: 'Koh Ker', type: 'city', lat: 13.78, lng: 104.54, note: 'Briefly the capital under Jayavarman IV (928–944)', year: 928 },
      { name: 'Preah Vihear', type: 'landmark', lat: 14.39, lng: 104.68, note: 'Cliff-top Shaiva temple on the Dângrêk escarpment', year: 1080 },
      { name: 'Phimai', type: 'landmark', lat: 15.22, lng: 102.49, note: 'Great Khmer temple in the Khorat plateau (now Thailand)', year: 1100 },
      { name: 'Wat Phu', type: 'landmark', lat: 14.85, lng: 105.82, note: 'Mountain temple in southern Laos', year: 1080 },
      { name: 'Sambor Prei Kuk', type: 'landmark', lat: 12.87, lng: 105.06, note: 'Isanapura — pre-Angkorian Chenla capital', year: 620 },
      { name: 'Lopburi', type: 'city', lat: 14.80, lng: 100.62, note: 'Khmer provincial center in central Thailand', year: 1100 },
      { name: 'Vijaya', type: 'battle', lat: 13.90, lng: 109.10, note: 'Champa capital sacked by the Khmer (1177–1203)', year: 1190 },
      { name: 'Oc Eo', type: 'port', lat: 10.23, lng: 105.15, note: 'Ancient Mekong-delta port linking the Khmer world to maritime trade', year: 1100 },
    ],
  },
  {
    id: 'songhai-empire',
    era: 'early-modern',
    period: '1464–1591 CE',
    yearRange: [1464, 1591],
    center: [16.5, -2],
    zoom: 4,
    title: 'The Songhai Empire',
    titleI18n: { es: 'El Imperio songhai', ru: 'Империя Сонгай', mk: 'Царството Сонгај' },
    description: 'The largest empire in West African history at its height (c. 1500), spanning the Sahel from the Atlantic to central Niger and controlling the trans-Saharan gold and salt trade from Gao, Timbuktu, and Djenné — its lifeline the great bend of the Niger River.',
    polygons: [
      {
        // Greatest extent c. 1500 — the Sahel band from the Atlantic (Senegal)
        // east to the Aïr, bounded by the Sahara north and the savanna south.
        label: 'Songhai Empire (c. 1500)',
        color: '#eab308',
        fillOpacity: 0.20,
        coords: [
          [17.60,-16.20],[18.20,-11.00],[18.70,-6.00],[19.05,-1.00],
          [19.00,3.50],[18.20,7.20],[17.40,9.20],[15.60,9.60],[14.00,7.60],
          [12.80,4.00],[12.10,-1.00],[12.40,-5.00],[12.80,-8.00],
          [13.60,-12.00],[14.30,-16.60],[17.60,-16.20],
        ],
      },
      {
        // Core Songhai domain — the Niger bend from Djenné through Timbuktu to
        // the capital at Gao, the empire's populous, directly-ruled heartland.
        label: 'Niger Bend Heartland',
        color: '#facc15',
        fillOpacity: 0.30,
        coords: [
          [17.30,-4.20],[17.40,-1.50],[16.60,0.60],[15.30,0.40],
          [13.60,-3.20],[13.60,-4.90],[14.90,-4.60],[16.20,-3.60],[17.30,-4.20],
        ],
      },
    ],
    routes: [
      { name: 'Trans-Saharan gold & salt road', nameI18n: { es: 'Ruta transahariana del oro y la sal', ru: 'Транссахарский путь золота и соли', mk: 'Транссахарски пат на злато и сол' }, type: 'trade', color: '#eab308', points: [[13.91,-4.55],[16.77,-3.01],[20.0,-4.0],[23.6,-5.0]] },
      { name: 'The Niger River artery', nameI18n: { es: 'La arteria del río Níger', ru: 'Артерия реки Нигер', mk: 'Артеријата на реката Нигер' }, type: 'trade', color: '#38bdf8', points: [[13.91,-4.55],[15.35,-4.28],[16.77,-3.01],[16.27,-0.04],[15.40,0.80]] },
    ],
    markers: [
      { name: 'Gao', type: 'capital', lat: 16.27, lng: -0.04, note: 'Capital on the Niger — seat of Sonni Ali and Askia the Great', year: 1464 },
      { name: 'Timbuktu', type: 'city', lat: 16.77, lng: -3.01, note: 'City of books — University of Sankore and vast libraries', year: 1468 },
      { name: 'Djenné', type: 'city', lat: 13.91, lng: -4.55, note: 'Great mud-brick mosque and river trade hub (taken 1475)', year: 1475 },
      { name: 'Kukiya', type: 'city', lat: 15.40, lng: 0.80, note: 'Early Songhai capital downstream on the Niger', year: 1010 },
      { name: 'Walata', type: 'city', lat: 17.30, lng: -7.03, note: 'Saharan caravan town on the desert trade routes', year: 1480 },
      { name: 'Taghaza', type: 'resource', lat: 23.60, lng: -5.00, note: 'Saharan salt mines — salt traded nearly ounce-for-ounce with gold', year: 1500 },
      { name: 'Agadez', type: 'city', lat: 16.97, lng: 7.99, note: 'Eastern sultanate and trade gateway to the Aïr', year: 1500 },
      { name: 'Kano', type: 'city', lat: 12.00, lng: 8.52, note: 'Wealthy Hausa trade city — a tributary on the southeastern frontier', year: 1513 },
      { name: 'Tadmekka (Es-Souk)', type: 'landmark', lat: 18.60, lng: 1.00, note: 'Saharan caravan town where West African gold coins were struck', year: 1400 },
      { name: 'Tondibi', type: 'battle', lat: 16.45, lng: -0.20, note: 'Moroccan gunpowder shatters Songhai (1591) — the empire falls', year: 1591 },
    ],
  },
  {
    id: 'polynesian-expansion',
    era: 'early-modern',
    period: '1000–1500 CE',
    yearRange: [1000, 1500],
    center: [-12, -155],
    zoom: 3,
    oceanic: true,
    title: 'Voyagers of the Pacific',
    titleI18n: { es: 'Navegantes del Pacífico', ru: 'Мореплаватели Тихого океана', mk: 'Морепловците на Пацификот' },
    description: 'The Polynesian settlement of the vast Pacific — the last great human colonization of the Earth. Using only the stars, swells, and birds, voyagers reached every corner of the Polynesian Triangle: Hawaii, Rapa Nui, and Aotearoa.',
    polygons: [
      {
        // The Polynesian Triangle — the immense oceanic realm settled by
        // Polynesian voyagers, its three apexes Hawaii, Rapa Nui, and Aotearoa.
        // (Aotearoa's longitude is written as -185 = 175°E so the ring stays
        // continuous across the antimeridian instead of wrapping the long way.)
        label: 'The Polynesian Triangle',
        color: '#22d3ee',
        fillOpacity: 0.10,
        coords: [
          [19.60,-155.50],[-5.00,-140.00],[-27.11,-109.35],
          [-32.00,-147.00],[-37.80,-185.00],[-9.00,-170.00],[19.60,-155.50],
        ],
      },
    ],
    routes: [
      { name: 'Voyage north to Hawaii', nameI18n: { es: 'Viaje al norte a Hawái', ru: 'Путь на север к Гавайям', mk: 'Пат на север кон Хаваи' }, type: 'trade', color: '#22d3ee', points: [[-13.76,-172.10],[-9.78,-139.06],[5.0,-152.0],[19.60,-155.50]] },
      { name: 'Voyage east to Rapa Nui', nameI18n: { es: 'Viaje al este a Rapa Nui', ru: 'Путь на восток к Рапа-Нуи', mk: 'Пат на исток кон Рапа Нуи' }, type: 'trade', color: '#a78bfa', points: [[-17.65,-149.43],[-23.0,-129.0],[-27.11,-109.35]] },
      { name: 'Voyage south to Aotearoa', nameI18n: { es: 'Viaje al sur a Aotearoa', ru: 'Путь на юг к Аотеароа', mk: 'Пат на југ кон Аотеароа' }, type: 'trade', color: '#34d399', points: [[-17.65,-149.43],[-21.23,-159.78],[-29.0,-175.0],[-37.80,-185.00]] },
    ],
    markers: [
      { name: 'Samoa', type: 'landmark', lat: -13.76, lng: -172.10, note: 'Ancient homeland of the Polynesians', year: 1000 },
      { name: 'Tonga', type: 'landmark', lat: -21.18, lng: -175.20, note: 'Seat of a far-reaching Pacific maritime chiefdom', year: 1200 },
      { name: 'Marquesas', type: 'landmark', lat: -9.78, lng: -139.06, note: 'Springboard for the longest voyages, to Hawaii and beyond', year: 1000 },
      { name: 'Tahiti (Society Is.)', type: 'port', lat: -17.65, lng: -149.43, note: 'Great voyaging hub of central Polynesia', year: 1100 },
      { name: 'Hawaii', type: 'landmark', lat: 19.60, lng: -155.50, note: 'Northern apex of the Polynesian Triangle', year: 1000 },
      { name: 'Rapa Nui (Easter Island)', type: 'landmark', lat: -27.11, lng: -109.35, note: 'Eastern apex — home of the moai statues', year: 1200 },
      { name: 'Aotearoa (New Zealand)', type: 'landmark', lat: -37.80, lng: 175.00, note: 'Southern apex — last major land settled (~1300), ancestors of the Māori', year: 1300 },
      { name: 'Rarotonga (Cook Is.)', type: 'port', lat: -21.23, lng: -159.78, note: 'Staging point on the long southern voyage to Aotearoa', year: 1250 },
      { name: 'Fiji', type: 'landmark', lat: -17.71, lng: 178.07, note: 'Western gateway — the Lapita ancestors of the Polynesians passed through', year: 900 },
      { name: 'Mangareva', type: 'landmark', lat: -23.12, lng: -134.97, note: 'Remote outpost linking central Polynesia toward Rapa Nui', year: 1150 },
      { name: 'Chatham Islands', type: 'landmark', lat: -43.95, lng: -176.55, note: 'Bleak southeastern limit — settled by the Moriori', year: 1400 },
    ],
  },
].map(topic => {
  // Prefer the high-detail boundary data, then run every ring through the
  // full rectification pipeline: coordinate clamping/wrapping, duplicate-vertex
  // collapse, self-intersection repair, corner smoothing, and explicit closure.
  // A hand-traced polygon can never render as broken lines slashing across the
  // map; degenerate rings (< 3 distinct valid vertices) are dropped entirely.
  const rawPolys = IMPROVED_POLYGONS[topic.id] ?? topic.polygons;
  const polygons = rawPolys
    ?.map(p => {
      let coords = refineRing(p.coords);
      // Atlas finish: hand-traced rings (sparse vertices) get extra Chaikin
      // passes so straight survey-line segments become the flowing organic
      // frontiers of historical cartography. Dense GIS coastlines are already
      // organic and are left untouched. Simplicity is re-verified after every
      // pass — a pinched ring keeps its previous valid state.
      if (coords.length > 0 && coords.length < 200) {
        for (let pass = 0; pass < 2; pass++) {
          const smoother = chaikinSmooth(coords, 1);
          if (!isSimpleRing(smoother)) break;
          coords = smoother;
        }
      }
      return { ...p, coords };
    })
    .filter(p => p.coords.length >= 4); // closed ring = 3 vertices + closing point
  return { ...topic, polygons } as TerritoryTopic;
}) satisfies TerritoryTopic[];
