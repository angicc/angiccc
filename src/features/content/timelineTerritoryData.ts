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
   * auto-reveals - a sea voyage has no "territory" to scout out of the fog.
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
    title: 'Out of Africa - The Human Journey',
    titleI18n: { es: 'Fuera de África - El viaje humano', ru: 'Из Африки - путь человечества', mk: 'Од Африка - патувањето на човештвото', de: 'Aus Afrika - die Reise der Menschheit', fr: 'Hors d’Afrique - le voyage humain' },
    description: 'Homo sapiens arose in Africa ~300,000 years ago and, from ~60,000 years ago, spread to nearly every corner of the Earth - reaching Australia by sea and the Americas across the Beringia land bridge.',
    polygons: [
      {
        // The African homeland - where humanity spent most of its existence.
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
      { name: 'Olduvai Gorge', type: 'landmark', lat: -2.99, lng: 35.35, note: 'The "Cradle of Humankind" - early hominin fossils and Oldowan tools', year: -1800000 },
      { name: 'Blombos Cave', type: 'landmark', lat: -34.4, lng: 21.2, note: 'Engraved ochre and shell beads - early symbolic thought (~75,000 years ago)', year: -75000 },
      { name: 'Denisova Cave', type: 'landmark', lat: 51.4, lng: 84.68, note: 'Home of the Denisovans - a human population known mainly from DNA', year: -50000 },
      { name: 'Chauvet Cave', type: 'landmark', lat: 44.4, lng: 4.42, note: 'Painted lions and rhinos ~36,000 years old', year: -36000 },
      { name: 'Lascaux', type: 'landmark', lat: 45.05, lng: 1.17, note: 'The Great Hall of the Bulls - Ice Age cave art (~17,000 years ago)', year: -17000 },
      { name: 'Lake Mungo', type: 'landmark', lat: -33.75, lng: 143.05, note: 'Early human burials in Australia (~42,000 years ago)', year: -42000 },
      { name: 'Zhoukoudian', type: 'landmark', lat: 39.68, lng: 115.92, note: '"Peking Man" - Homo erectus site near Beijing', year: -700000 },
      { name: 'Göbekli Tepe', type: 'religious', lat: 37.22, lng: 38.92, note: 'Oldest monumental temple on Earth (~9500 BCE)', year: -9500 },
      { name: 'Çatalhöyük', type: 'city', lat: 37.67, lng: 32.83, note: 'One of the first proto-cities - entered through the roof (~7500 BCE)', year: -7500 },
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
    titleI18n: { de: 'Mesopotamien & das Alte Ägypten', fr: 'Mésopotamie et Égypte antique', es: 'Mesopotamia y Antiguo Egipto', ru: 'Месопотамия и Древний Египет', mk: 'Месопотамија и антички Египет' },
    description: 'The Fertile Crescent - from Mesopotamia\'s Tigris-Euphrates to Egypt\'s Nile - hosted humanity\'s first cities, writing systems, and law codes.',
    polygons: [
      // The reference plate ("Ancient Egypt and Mesopotamia, c. 1450 BC") shows
      // FIVE separate polities, not one undifferentiated "Mesopotamia". Drawing
      // a single Tigris–Euphrates crescent erased the entire political map of
      // the period - Hatti, Mitanni, Assyria and Babylonia were rivals, not one
      // region. Each border below follows real coordinates for the cities and
      // rivers that defined it, using the plate for WHICH states existed and
      // where their frontiers ran.
      {
        // Hatti: the Anatolian plateau ringed by the Taurus, capital Hattusa
        // (40.02N, 34.62E) - the plate's northern yellow bloc.
        label: 'Hittite Empire',
        color: '#eab308',
        fillOpacity: 0.25,
        coords: [
          [41.20,32.00],[41.45,34.50],[41.05,36.60],[40.20,37.90],
          [39.05,38.55],[38.20,37.60],[37.65,36.25],[37.80,34.05],
          [38.40,32.20],[39.25,31.00],[40.30,31.15],[41.20,32.00],
        ],
      },
      {
        // Mitanni: the Khabur triangle and upper Euphrates between Hatti and
        // Assyria - the plate's orange wedge.
        label: 'Mitanni State',
        color: '#f97316',
        fillOpacity: 0.25,
        coords: [
          [37.80,37.60],[38.00,39.50],[37.60,41.20],[36.80,42.00],
          [36.00,41.60],[35.60,40.20],[35.80,38.60],[36.60,37.40],
          [37.80,37.60],
        ],
      },
      {
        // Assyria: the upper Tigris around Nineveh (36.36N, 43.15E) and Assur
        // (35.46N, 43.26E) - the plate's green strip.
        label: 'Assyria',
        color: '#22c55e',
        fillOpacity: 0.25,
        coords: [
          [37.20,42.20],[37.00,43.60],[36.40,44.40],[35.40,44.05],
          [34.80,43.40],[35.00,42.60],[35.80,42.00],[36.60,41.90],
          [37.20,42.20],
        ],
      },
      {
        // Babylonia and Sumer: the alluvial south - Babylon (32.54N, 44.42E),
        // Ur (30.96N, 46.10E), Susa (32.19N, 48.26E) - the plate's magenta bloc.
        label: 'Babylonia & Sumer',
        color: '#d946ef',
        fillOpacity: 0.25,
        coords: [
          [34.00,43.40],[33.60,44.60],[33.00,45.60],[32.40,47.20],
          [32.20,48.60],[31.40,48.40],[30.60,47.60],[30.30,46.60],
          [30.60,45.40],[31.40,44.40],[32.40,43.60],[33.20,43.20],
          [34.00,43.40],
        ],
      },
      {
        // Egypt: the Nile ribbon from Nubia to the Delta. A thin inhabited
        // valley, never a blob across the Western Desert.
        label: 'Ancient Egypt (Nile Valley)',
        color: '#10b981',
        fillOpacity: 0.25,
        coords: [
          [31.55,29.80],[30.60,30.45],[29.50,30.75],[28.00,30.40],
          [26.50,31.35],[25.00,32.15],[23.00,32.20],[21.00,30.40],
          [19.30,30.20],[19.30,31.20],[21.20,32.00],[23.20,33.20],
          [25.20,33.40],[26.80,32.60],[28.20,31.60],[29.60,31.75],
          [30.60,31.60],[31.40,32.20],[31.55,29.80],
        ],
      },
      {
        // Egypt's Asiatic province: the Levant corridor Thutmose III held after
        // Megiddo (1457 BCE), running the coast to the Orontes. The plate shows
        // it as Egyptian, and omitting it left Megiddo sitting outside Egypt.
        label: 'Egyptian Levant (after Megiddo)',
        color: '#14b8a6',
        fillOpacity: 0.22,
        coords: [
          [31.20,32.40],[31.50,34.30],[32.60,34.90],[33.30,35.20],
          [34.50,35.90],[35.60,36.20],[35.40,36.95],[34.20,36.60],
          [33.00,36.00],[31.80,35.00],[30.80,34.40],[30.20,33.40],
          [31.20,32.40],
        ],
      },
    ],
    routes: [
      {
        name: 'Euphrates Trade Corridor',
        nameI18n: { es: 'Corredor Comercial del Éufrates', ru: 'Торговый коридор Евфрата', mk: 'Трговски коридор Еуфрат', de: 'Euphrat-Handelskorridor', fr: 'Corridor commercial de l’Euphrate' },
        type: 'trade',
        color: '#f59e0b',
        points: [[37.0,38.2],[35.35,40.1],[34.0,42.0],[32.55,44.3],[31.0,46.2],[30.45,47.9]],
      },
      {
        name: 'Egypt–Levant Trade Route',
        nameI18n: { es: 'Ruta Comercial Egipto-Levante', ru: 'Торговый путь Египет–Левант', mk: 'Трговски пат Египет–Левант', de: 'Handelsweg Ägypten–Levante', fr: 'Route commerciale Égypte–Levant' },
        type: 'trade',
        color: '#10b981',
        points: [[30,32],[31,34],[33,35],[34,36],[33,36]],
      },
    ],
    markers: [
      { name: 'Uruk', type: 'city', lat: 31.32, lng: 45.6, note: 'World\'s first city - cuneiform writing (~3100 BCE)', year: -3100 },
      { name: 'Babylon', type: 'capital', lat: 32.54, lng: 44.42, note: 'Hammurabi\'s Code, Hanging Gardens, heart of Babylonian Empire', year: -1800 },
      { name: 'Ur', type: 'city', lat: 30.96, lng: 46.1, note: 'Major Sumerian city-state and religious centre', year: -2600 },
      { name: 'Nineveh', type: 'capital', lat: 36.36, lng: 43.15, note: 'Assyrian Empire capital - greatest library of ancient world', year: -700 },
      { name: 'Memphis', type: 'capital', lat: 29.84, lng: 31.25, note: 'First capital of unified Egypt, seat of Pharaohs', year: -3100 },
      { name: 'Giza', type: 'landmark', lat: 29.97, lng: 31.13, note: 'Great Pyramids of Khufu, Khafre, Menkaure (~2560 BCE)', year: -2560 },
      { name: 'Thebes', type: 'capital', lat: 25.72, lng: 32.66, note: 'Egyptian New Kingdom capital - Valley of the Kings', year: -1550 },
      { name: 'Persepolis', type: 'capital', lat: 29.93, lng: 52.89, note: 'Ceremonial Achaemenid capital', year: -520 },
      { name: 'Battle of Megiddo', type: 'battle', lat: 32.58, lng: 35.18, note: 'Thutmose III vs Canaanites (1457 BCE) - first recorded battle', year: -1457 },
      { name: 'Hattusa', type: 'capital', lat: 40.02, lng: 34.61, note: 'Hittite Empire capital - great temple complexes and royal archives', year: -1600 },
      { name: 'Assur', type: 'city', lat: 35.46, lng: 43.26, note: 'First Assyrian capital - sacred city of the god Ashur', year: -1900 },
      { name: 'Susa', type: 'city', lat: 32.19, lng: 48.25, note: 'Elamite royal city - later an Achaemenid capital', year: -2000 },
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
    titleI18n: { de: 'Klassisches Griechenland', fr: 'La Grèce classique', es: 'Grecia Clásica', ru: 'Классическая Греция', mk: 'Класична Грција' },
    description: 'Greek city-states forged democracy, philosophy, and science - foundations of Western civilisation. From Athens to Ionia, Greek colonies carried this culture across the Mediterranean.',
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
        nameI18n: { es: 'Comercio del Egeo', ru: 'Торговля Эгейского моря', mk: 'Трговија на Егејот', de: 'Seiden- und Getreidehandel (Ägäis)', fr: 'Commerce de la soie et du grain (Égée)' },
        type: 'trade',
        color: '#3b82f6',
        points: [[38,24],[39,26],[40,28],[41,29],[40,26],[38,24]],
      },
    ],
    markers: [
      { name: 'Athens', type: 'capital', lat: 37.97, lng: 23.72, note: 'Birthplace of democracy - Parthenon, Socrates, Plato, Aristotle', year: -508 },
      { name: 'Sparta', type: 'capital', lat: 37.07, lng: 22.43, note: 'Militaristic rival of Athens - agoge warrior training', year: -800 },
      { name: 'Olympia', type: 'landmark', lat: 37.6, lng: 21.63, note: 'Ancient Olympic Games held here every 4 years (from 776 BCE)', year: -776 },
      { name: 'Delphi', type: 'landmark', lat: 38.48, lng: 22.5, note: 'Oracle of Apollo - consulted by Greek cities on major decisions', year: -800 },
      { name: 'Battle of Thermopylae', type: 'battle', lat: 38.8, lng: 22.53, note: '300 Spartans vs Persian invasion (480 BCE)', year: -480 },
      { name: 'Battle of Salamis', type: 'battle', lat: 37.94, lng: 23.47, note: 'Greek naval victory that saved Greece from Persia (480 BCE)', year: -480 },
      { name: 'Battle of Marathon', type: 'battle', lat: 38.15, lng: 23.97, note: 'Athens defeated Persian invasion (490 BCE)', year: -490 },
      { name: 'Corinth', type: 'city', lat: 37.94, lng: 22.93, note: 'Wealthy trading city - Corinthian order of architecture', year: -700 },
    ],
  },

  {
    id: 'ancient-macedonia',
    era: 'ancient',
    period: '359–323 BCE',
    yearRange: [-359, -323],
    center: [39, 30],
    zoom: 4,
    title: 'Ancient Macedonia - Alexander the Great',
    titleI18n: { de: 'Antikes Makedonien - Alexander der Große', fr: 'La Macédoine antique - Alexandre le Grand', es: 'Antigua Macedonia - Alejandro Magno', ru: 'Древняя Македония - Александр Великий', mk: 'Античка Македонија - Александар Велики' },
    description: 'From the kingdom Philip II forged, Alexander the Great led the Macedonian army across three continents - toppling Persia and carrying Hellenistic civilisation from the Nile to the Indus in just eleven years.',
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
        nameI18n: { es: 'Ruta de conquista de Alejandro (334–323 a.C.)', ru: 'Путь завоеваний Александра (334–323 до н.э.)', mk: 'Патот на освојувањата на Александар (334–323 п.н.е.)' , de: 'Alexanders Eroberungszug (334–323 v. Chr.)', fr: 'Route de conquête d’Alexandre (334–323 av. J.-C.)'},
        type: 'military',
        color: '#ef4444',
        points: [[40.76,22.52],[40.35,26.4],[40.02,27.28],[38.48,28.04],[36.9,30.7],[36.77,36.15],[33.27,35.2],[31.2,29.92],[29.98,31.13],[31.2,29.92],[36.36,43.15],[32.54,44.42],[32.19,48.26],[29.93,52.89],[36.3,59.6],[36.75,66.9],[39.65,66.97],[34.53,69.17],[32.94,73.73],[30.2,71.47],[25.4,68.3],[29.93,52.89],[32.54,44.42]],
      },
      {
        name: 'Hellenistic Trade Corridor',
        nameI18n: { es: 'Corredor comercial helenístico', ru: 'Эллинистический торговый коридор', mk: 'Хеленистички трговски коридор', de: 'Hellenistischer Handelskorridor', fr: 'Corridor commercial hellénistique' },
        type: 'trade',
        color: '#f59e0b',
        points: [[40.64,22.94],[40.15,26.41],[38.42,27.14],[36.2,36.16],[31.2,29.92]],
      },
    ],
    markers: [
      { name: 'Pella', type: 'capital', lat: 40.76, lng: 22.52, note: 'Capital of Macedon - birthplace of Alexander the Great (356 BCE)', year: -356 },
      { name: 'Aigai (Vergina)', type: 'landmark', lat: 40.48, lng: 22.32, note: 'Old royal capital - tombs of the Macedonian kings, Philip II buried here', year: -336 },
      { name: 'Dion', type: 'landmark', lat: 40.17, lng: 22.49, note: 'Sacred city of Zeus - Alexander sacrificed here before invading Asia', year: -334 },
      { name: 'Battle of Chaeronea', type: 'battle', lat: 38.5, lng: 22.84, note: 'Philip II defeats Athens and Thebes - Macedon masters Greece (338 BCE)', year: -338 },
      { name: 'Battle of the Granicus', type: 'battle', lat: 40.02, lng: 27.28, note: "Alexander's first victory over Persia in Asia Minor (334 BCE)", year: -334 },
      { name: 'Battle of Issus', type: 'battle', lat: 36.77, lng: 36.15, note: 'Alexander defeats Darius III - turning point (333 BCE)', year: -333 },
      { name: 'Siege of Tyre', type: 'battle', lat: 33.27, lng: 35.2, note: 'Seven-month siege - Alexander builds a causeway to the island city (332 BCE)', year: -332 },
      { name: 'Alexandria (founded)', type: 'city', lat: 31.2, lng: 29.92, note: 'Founded by Alexander (331 BCE) - became the greatest Hellenistic city', year: -331 },
      { name: 'Battle of Gaugamela', type: 'battle', lat: 36.56, lng: 43.44, note: 'Decisive defeat of Darius III - the Persian Empire falls (331 BCE)', year: -331 },
      { name: 'Persepolis', type: 'city', lat: 29.93, lng: 52.89, note: 'Ceremonial capital - destroyed by Alexander (330 BCE)', year: -330 },
      { name: 'Battle of the Hydaspes', type: 'battle', lat: 32.94, lng: 73.73, note: 'Alexander defeats King Porus in India - his army refuses to go further (326 BCE)', year: -326 },
      { name: 'Babylon', type: 'city', lat: 32.54, lng: 44.42, note: 'Alexander dies here aged 32 (11 June 323 BCE) - his empire fragments', year: -323 },
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
    titleI18n: { de: 'Das Perserreich', fr: 'L’Empire perse', es: 'El Imperio Persa', ru: 'Персидская империя', mk: 'Персиската империја' },
    description: 'The Achaemenid Persian Empire - stretching from Egypt to the Indus River - was the largest empire the world had yet seen, unified by the Royal Road and Zoroastrian faith.',
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
        nameI18n: { es: 'Camino Real (Susa–Sardis)', ru: 'Царская дорога (Сузы–Сарды)', mk: 'Кралски Пат (Суза–Сардис)', de: 'Königsstraße (Susa nach Sardes)', fr: 'Route royale (de Suse à Sardes)' },
        type: 'military',
        color: '#8b5cf6',
        points: [[32.2,48.3],[34.8,48.5],[36.7,37.9],[38.2,32],[39,27],[38.5,27.2]],
      },
    ],
    markers: [
      { name: 'Persepolis', type: 'capital', lat: 29.93, lng: 52.89, note: 'Ceremonial capital - destroyed by Alexander (330 BCE)', year: -520 },
      { name: 'Susa', type: 'capital', lat: 32.19, lng: 48.26, note: 'Administrative capital and treasury of the empire', year: -550 },
      { name: 'Pasargadae', type: 'landmark', lat: 30.19, lng: 53.17, note: 'Tomb of Cyrus the Great - founder of Persian Empire', year: -530 },
      { name: 'Ecbatana', type: 'city', lat: 34.8, lng: 48.5, note: 'Median capital, summer palace of Persian kings', year: -550 },
      { name: 'Sardis', type: 'city', lat: 38.48, lng: 28.04, note: 'Western capital - gold-rich Lydian city incorporated by Cyrus', year: -547 },
      { name: 'Babylon', type: 'city', lat: 32.54, lng: 44.42, note: 'Incorporated into Persian Empire by Cyrus (539 BCE)', year: -539 },
      { name: 'Battle of Thermopylae', type: 'battle', lat: 38.8, lng: 22.53, note: 'Persian army defeated Greek defenders (480 BCE)', year: -480 },
      { name: 'Battle of Issus', type: 'battle', lat: 36.77, lng: 36.15, note: 'Alexander defeats Darius III - turning point (333 BCE)', year: -333 },
      { name: 'Memphis', type: 'city', lat: 29.84, lng: 31.25, note: 'Egypt under Persian rule - satrapy of Mudraya', year: -525 },
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
    titleI18n: { de: 'Das Römische Reich', fr: 'L’Empire romain', es: 'El Imperio Romano', ru: 'Римская империя', mk: 'Римската империја' },
    description: 'At its height under Trajan (117 CE), Rome unified the Mediterranean world - from Britain to Mesopotamia - with roads, Latin law, and legions.',
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
        nameI18n: { es: 'Vía Apia', ru: 'Аппиева дорога', mk: 'Апиев Пат', de: 'Via Appia (Rom → Brindisi)', fr: 'Voie Appienne (Rome → Brindisi)' },
        type: 'military',
        color: '#ef4444',
        points: [[41.9,12.5],[40.6,15.8],[40.6,17.9],[40.6,18.0]],
      },
      {
        name: 'Mediterranean Sea Trade',
        nameI18n: { es: 'Comercio Mediterráneo', ru: 'Средиземноморская торговля', mk: 'Средоземноморска трговија', de: 'Mittelmeerhandel', fr: 'Commerce en Méditerranée' },
        type: 'trade',
        color: '#f59e0b',
        points: [[41.9,12.5],[37.9,-5],[36.8,-4],[36,6],[37.9,15],[31.2,30],[33.5,35],[36.2,36],[37,36],[41,29],[38,24],[37.9,23.7],[41.9,12.5]],
      },
    ],
    markers: [
      { name: 'Rome', type: 'capital', lat: 41.9, lng: 12.5, note: 'Eternal City - heart of an empire of 70 million people', year: -27 },
      { name: 'Carthage', type: 'city', lat: 36.86, lng: 10.32, note: 'Destroyed by Rome after Third Punic War (146 BCE)', year: -146 },
      { name: 'Alexandria', type: 'city', lat: 31.2, lng: 29.92, note: 'Greatest library of the ancient world - centre of Greek learning', year: -30 },
      { name: 'Constantinople', type: 'city', lat: 41.01, lng: 28.98, note: 'Eastern capital founded by Constantine (330 CE)', year: 330 },
      { name: 'Londinium', type: 'city', lat: 51.51, lng: -0.12, note: 'Roman London - frontier city of Britannia (founded 43 CE)', year: 43 },
      { name: 'Jerusalem', type: 'city', lat: 31.77, lng: 35.22, note: 'Jewish revolts - Temple destroyed 70 CE by Titus', year: 70 },
      { name: 'Antioch', type: 'city', lat: 36.2, lng: 36.16, note: 'Third largest city of the empire, early Christian centre', year: 100 },
      { name: 'Colosseum (Rome)', type: 'landmark', lat: 41.89, lng: 12.49, note: 'Amphitheatre seating 80,000 - gladiatorial games', year: 80 },
      { name: 'Battle of Actium', type: 'battle', lat: 38.93, lng: 20.74, note: 'Octavian defeats Mark Antony - end of Republic (31 BCE)', year: -31 },
      { name: 'Hadrian\'s Wall', type: 'landmark', lat: 55.01, lng: -2.5, note: 'Northern frontier wall across Britain (122 CE)', year: 122 },
      { name: 'Lugdunum', type: 'city', lat: 45.75, lng: 4.85, note: 'Roman Lyon - capital of Gaul', year: -43 },
      { name: 'Dacia (gold mines)', type: 'resource', lat: 45.8, lng: 24.5, note: 'Gold and silver mines - conquered by Trajan (106 CE)', year: 106 },
    ],
  },

  {
    id: 'ancient-china',
    era: 'ancient',
    period: '221 BCE–220 CE',
    yearRange: [-221, 220],
    center: [35, 110],
    zoom: 4,
    title: 'Ancient China - Qin & Han Dynasties',
    titleI18n: { de: 'Das Alte China - Qin- & Han-Dynastie', fr: 'La Chine antique - dynasties Qin et Han', es: 'China Antigua - dinastías Qin y Han', ru: 'Древний Китай - династии Цинь и Хань', mk: 'Античка Кина - династиите Цин и Хан' },
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
        nameI18n: { es: 'Ruta de la Seda', ru: 'Великий Шёлковый Путь', mk: 'Патот на Свилата', de: 'Seidenstraße (Westliche Han)', fr: 'Route de la soie (Han occidentaux)' },
        type: 'trade',
        color: '#f59e0b',
        points: [[34.3,109],[39,98],[40.1,94.7],[40,86],[39.6,76],[39.5,65.9],[38,54],[33,44],[36.2,36.2]],
      },
    ],
    markers: [
      { name: "Chang'an (Xi'an)", type: 'capital', lat: 34.27, lng: 108.95, note: 'Qin and Han capital - Terracotta Army of Qin Shi Huang', year: -221 },
      { name: 'Luoyang', type: 'capital', lat: 34.62, lng: 112.45, note: 'Eastern Han capital and centre of Buddhism in China', year: 25 },
      { name: 'Great Wall (Jiayuguan)', type: 'landmark', lat: 39.8, lng: 98.3, note: 'Western end of Han-era Great Wall fortification', year: -210 },
      { name: 'Great Wall (Shanhaiguan)', type: 'landmark', lat: 40.0, lng: 119.7, note: 'Eastern end of Great Wall - "First Pass Under Heaven"', year: -210 },
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
      { name: 'Constantinople', type: 'capital', lat: 41.01, lng: 28.98, note: 'Capital for 1,000 years - fell to Ottomans 1453 CE', year: 330 },
      { name: 'Hagia Sophia', type: 'landmark', lat: 41.0, lng: 28.97, note: 'Greatest church of medieval world (537 CE) - later mosque', year: 537 },
      { name: 'Nicaea', type: 'city', lat: 40.42, lng: 29.72, note: 'Council of Nicaea (325 CE) - defined Christian orthodoxy', year: 325 },
      { name: 'Antioch', type: 'city', lat: 36.2, lng: 36.16, note: 'Patriarchate and major eastern city', year: 500 },
      { name: 'Thessaloniki', type: 'city', lat: 40.64, lng: 22.94, note: 'Second city of the empire', year: 500 },
      { name: 'Ravenna', type: 'city', lat: 44.42, lng: 12.2, note: 'Byzantine Exarchate capital in Italy', year: 540 },
      { name: 'Battle of Yarmouk', type: 'battle', lat: 32.8, lng: 36.1, note: 'Arabs defeat Byzantines - empire loses Levant (636 CE)', year: 636 },
      { name: 'Manzikert', type: 'battle', lat: 39.06, lng: 42.52, note: 'Seljuk Turks destroy Byzantine army - Anatolia lost (1071)', year: 1071 },
      { name: 'Alexandria', type: 'city', lat: 31.2, lng: 29.92, note: 'Patriarchate and grain port of the empire until 641', year: 400 },
      { name: 'Carthage', type: 'city', lat: 36.85, lng: 10.33, note: 'Retaken from the Vandals by Belisarius (533–534)', year: 533 },
      { name: 'Ohrid', type: 'religious', lat: 41.12, lng: 20.8, note: "Clement's Literary School (~893) - cradle of Cyrillic literacy", year: 893 },
      { name: 'Mount Athos', type: 'religious', lat: 40.16, lng: 24.33, note: 'The Holy Mountain - monastic republic since 963', year: 963 },
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
    description: 'From Thessalonica to Moravia and back to Ohrid and Preslav: the mission that gave the Slavs an alphabet, a written language, and Orthodox Christianity - reaching Kiev with the baptism of the Rus in 988.',
    descriptionI18n: { es: 'De Tesalónica a Moravia y de vuelta a Ohrid y Preslav: la misión que dio a los eslavos un alfabeto, una lengua escrita y el cristianismo ortodoxo, llegando a Kiev con el bautismo de la Rus en 988.', ru: 'Из Фессалоник в Моравию и обратно в Охрид и Преслав: миссия, давшая славянам алфавит, письменность и православие - до крещения Руси в 988 году.', mk: 'Од Солун до Моравија и назад кон Охрид и Преслав: мисијата што им даде на Словените азбука, писмен јазик и православие - сè до покрстувањето на Русите во 988.', de: 'Von Thessalonike nach Mähren und zurück nach Ohrid und Preslaw: die Mission, die den Slawen Alphabet, Schriftsprache und Orthodoxie gab - bis zur Taufe der Rus 988.', fr: 'De Thessalonique à la Moravie puis vers Ohrid et Preslav : la mission qui donna aux Slaves un alphabet, une langue écrite et l’orthodoxie - jusqu’au baptême de la Rus’ en 988.' },
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
      { name: 'Thessalonica', type: 'city', lat: 40.64, lng: 22.94, note: 'Home city of Cyril and Methodius - so Slavic-speaking that "everyone there spoke it"', year: 863 },
      { name: 'Constantinople', type: 'capital', lat: 41.01, lng: 28.98, note: 'The mission was commissioned by the emperor and patriarch here', year: 862 },
      { name: 'Velehrad (Great Moravia)', type: 'city', lat: 49.11, lng: 17.4, note: 'Rastislav’s realm - where the Slavic liturgy was first sung', year: 863 },
      { name: 'Rome', type: 'religious', lat: 41.9, lng: 12.5, note: 'Pope Hadrian II blessed the Slavic books; Cyril died here in 869', year: 869 },
      { name: 'Ohrid', type: 'religious', lat: 41.12, lng: 20.8, note: "Clement's school taught ~3,500 students; the Cyrillic alphabet took shape in this circle", year: 893 },
      { name: 'Preslav', type: 'city', lat: 43.16, lng: 26.82, note: 'The parallel Bulgarian literary school of the disciples', year: 893 },
      { name: 'Kiev', type: 'capital', lat: 50.45, lng: 30.52, note: 'Vladimir baptized the Rus in 988 - Orthodoxy and Cyrillic spread across the north', year: 988 },
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
    titleI18n: { de: 'Islamische Kalifate', fr: 'Les califats islamiques', es: 'Califatos Islámicos', ru: 'Исламские халифаты', mk: 'Исламски калифати' },
    description: 'From Arabia, Islam spread across the Middle East, North Africa, Spain, and Central Asia within a century - creating a civilisation that preserved Greek science and pioneered algebra, astronomy, and medicine.',
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
        nameI18n: { es: 'Ruta del Hajj', ru: 'Паломнический путь (Мекка)', mk: 'Хаџ патека (Мека)', de: 'Hadsch-Route (Mekka)', fr: 'Route du hajj (La Mecque)' },
        type: 'religious',
        color: '#10b981',
        points: [[40,23],[37,36],[34,40],[30,38],[28,35],[24,40],[21.4,39.8]],
      },
      {
        name: 'Indian Ocean Spice Trade',
        nameI18n: { es: 'Comercio de Especias del Océano Índico', ru: 'Торговля пряностями Индийского океана', mk: 'Трговија со зачини на Индискиот Океан', de: 'Gewürzhandel im Indischen Ozean', fr: 'Commerce des épices dans l’océan Indien' },
        type: 'trade',
        color: '#f59e0b',
        points: [[21.4,39.8],[15,50],[12,45],[8,77],[11,77],[8,77],[2,73]],
      },
    ],
    markers: [
      { name: 'Mecca', type: 'landmark', lat: 21.42, lng: 39.83, note: 'Birthplace of Islam - holiest city of the Muslim world', year: 610 },
      { name: 'Medina', type: 'capital', lat: 24.47, lng: 39.61, note: "Prophet Muhammad's capital - second holiest city", year: 622 },
      { name: 'Baghdad', type: 'capital', lat: 33.34, lng: 44.4, note: 'Abbasid capital - House of Wisdom, peak of Islamic Golden Age', year: 762 },
      { name: 'Damascus', type: 'capital', lat: 33.51, lng: 36.29, note: 'Umayyad Caliphate capital', year: 661 },
      { name: 'Córdoba', type: 'city', lat: 37.89, lng: -4.78, note: 'Al-Andalus capital - greatest city in 10th-century Europe', year: 756 },
      { name: 'Cairo (Al-Fustat)', type: 'city', lat: 30.04, lng: 31.24, note: 'Egyptian capital - Fatimid Caliphate seat', year: 969 },
      { name: 'Samarkand', type: 'city', lat: 39.65, lng: 66.97, note: 'Silk Road hub - Paper and scholarship centre', year: 750 },
      { name: 'Battle of Tours', type: 'battle', lat: 47.39, lng: 0.69, note: 'Charles Martel halts Islamic expansion into Europe (732)', year: 732 },
      { name: 'Battle of Yarmouk', type: 'battle', lat: 32.8, lng: 36.1, note: 'Muslims defeat Byzantines - conquest of Levant (636)', year: 636 },
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
    titleI18n: { de: 'Das Mongolische Reich', fr: 'L’Empire mongol', es: 'El Imperio Mongol', ru: 'Монгольская империя', mk: 'Монголската империја' },
    description: "Genghis Khan's descendants forged the largest contiguous land empire in history - from Korea to Hungary - connecting East and West through the Pax Mongolica.",
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
        nameI18n: { es: 'Pax Mongólica (resurgimiento de la Ruta de la Seda)', ru: 'Монгольский мир (возрождение Шёлкового пути)', mk: 'Монголски мир (обновување на Патот на Свилата)', de: 'Pax Mongolica (Wiederbelebung der Seidenstraße)', fr: 'Pax Mongolica (renaissance de la route de la soie)' },
        type: 'trade',
        color: '#a16207',
        points: [[34.3,109],[40,98],[40,86],[39.5,66],[38,54],[33,44],[41.01,28.98]],
      },
    ],
    markers: [
      { name: 'Karakorum', type: 'capital', lat: 47.2, lng: 102.84, note: "Genghis Khan's Mongolian capital - hub of conquered world", year: 1220 },
      { name: 'Beijing (Khanbaliq)', type: 'capital', lat: 39.9, lng: 116.4, note: "Kublai Khan's Yuan Dynasty capital", year: 1271 },
      { name: 'Samarkand', type: 'city', lat: 39.65, lng: 66.97, note: 'Major Silk Road city - Genghis Khan conquered 1220', year: 1220 },
      { name: 'Baghdad', type: 'city', lat: 33.34, lng: 44.4, note: 'Sacked 1258 - 800,000 killed, end of Abbasid Caliphate', year: 1258 },
      { name: 'Krakow', type: 'city', lat: 50.06, lng: 19.94, note: 'Westernmost Mongol raid (1241) - devastated', year: 1241 },
      { name: 'Battle of Mohi', type: 'battle', lat: 47.93, lng: 21.13, note: 'Mongols annihilate Hungarian army (1241)', year: 1241 },
      { name: 'Battle of Ain Jalut', type: 'battle', lat: 32.6, lng: 35.34, note: 'Mamluks stop Mongol advance - first major Mongol defeat (1260)', year: 1260 },
      { name: 'Tabriz', type: 'city', lat: 38.08, lng: 46.3, note: 'Ilkhanate capital - Mongol rule over Persia', year: 1260 },
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
    titleI18n: { de: 'Kreuzzüge & das Heilige Land', fr: 'Les croisades et la Terre sainte', es: 'Cruzadas y Tierra Santa', ru: 'Крестовые походы и Святая земля', mk: 'Крстоносните походи и Светата Земја' },
    description: 'Nine major Crusades shaped medieval Europe - the First captured Jerusalem (1099), Saladin recaptured it (1187), and the last Crusader stronghold fell at Acre in 1291.',
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
        nameI18n: { es: 'Ruta de la Primera Cruzada', ru: 'Маршрут Первого Крестового похода', mk: 'Рута на Првата Крстоносна Поход', de: 'Route des Ersten Kreuzzugs', fr: 'Route de la première croisade' },
        type: 'military',
        color: '#f59e0b',
        points: [[48.8,2.3],[43.0,12.5],[41.9,12.5],[41.0,28.9],[39.9,32.8],[37.1,36.8],[35.2,36.5],[32.5,35.5],[31.77,35.22]],
      },
    ],
    markers: [
      { name: 'Jerusalem', type: 'landmark', lat: 31.77, lng: 35.22, note: 'Holy city - captured 1099, recaptured by Saladin 1187, fell 1244', year: 1099 },
      { name: 'Acre', type: 'port', lat: 32.92, lng: 35.07, note: 'Last major Crusader city - fell 1291, ending Crusader states', year: 1191 },
      { name: 'Antioch', type: 'city', lat: 36.2, lng: 36.16, note: 'First Crusader principality established 1098', year: 1098 },
      { name: 'Krak des Chevaliers', type: 'landmark', lat: 34.77, lng: 36.28, note: 'Greatest Crusader castle - Knights Hospitaller stronghold', year: 1142 },
      { name: 'Battle of Hattin', type: 'battle', lat: 32.78, lng: 35.55, note: 'Saladin destroys Crusader army - Jerusalem falls (1187)', year: 1187 },
      { name: 'Constantinople', type: 'city', lat: 41.01, lng: 28.98, note: 'Sacked by Fourth Crusade (1204) - great betrayal', year: 1204 },
      { name: 'Edessa', type: 'capital', lat: 37.16, lng: 38.79, note: 'Capital of the first Crusader state - its fall (1144) sparked the Second Crusade', year: 1098 },
      { name: 'Tripoli', type: 'port', lat: 34.43, lng: 35.84, note: 'Capital of the County of Tripoli - held until 1289', year: 1109 },
      { name: 'Aleppo', type: 'city', lat: 36.20, lng: 37.16, note: 'Muslim stronghold of Zengi and Nur ad-Din - never taken by Crusaders', year: 1128 },
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
    titleI18n: { de: 'Das Wikingerzeitalter', fr: 'L’ère viking', es: 'La Era Vikinga', ru: 'Эпоха викингов', mk: 'Викиншката ера' },
    description: 'From the raid on Lindisfarne (793) to Stamford Bridge (1066), Norse seafarers raided, traded, and settled from Newfoundland to Baghdad - founding Iceland, the Danelaw, Normandy, and Kievan Rus.',
    routes: [
      {
        name: 'Western Raiding & Settlement Route',
        nameI18n: { es: 'Ruta de saqueo y asentamiento occidental', ru: 'Западный путь набегов и поселений', mk: 'Западен пат на пустошење и населување', de: 'Westliche Raub- und Siedlungsroute', fr: 'Route de raids et de peuplement vers l’ouest' },
        type: 'military',
        color: '#ef4444',
        points: [[60.4, 5.3], [59.9, -1.3], [57.5, -3.5], [55.9, -3.2], [53.3, -6.2], [51.5, -0.1], [49.2, -0.4], [48.4, -4.5], [43.4, -8.4]],
      },
      {
        name: 'Eastern River Trade Route (to Byzantium)',
        nameI18n: { es: 'Ruta fluvial oriental (a Bizancio)', ru: 'Восточный речной торговый путь (в Византию)', mk: 'Источен речен трговски пат (до Византија)', de: 'Östlicher Flusshandelsweg (nach Byzanz)', fr: 'Route fluviale orientale (vers Byzance)' },
        type: 'trade',
        color: '#f59e0b',
        points: [[59.3, 18.1], [59.9, 30.3], [58.5, 31.3], [56.8, 35.9], [54.6, 39.7], [50.4, 30.5], [46.5, 30.7], [41.0, 28.9]],
      },
      {
        name: 'North Atlantic Exploration',
        nameI18n: { es: 'Exploración del Atlántico Norte', ru: 'Исследование Северной Атлантики', mk: 'Истражување на Северниот Атлантик', de: 'Nordatlantische Erkundung', fr: 'Exploration de l’Atlantique Nord' },
        type: 'trade',
        color: '#60a5fa',
        points: [[60.4, 5.3], [62.0, -6.8], [64.1, -21.9], [61.2, -45.4], [51.6, -55.5]],
      },
    ],
    markers: [
      { name: 'Lindisfarne', type: 'battle', lat: 55.68, lng: -1.8, note: 'First recorded Viking raid (793 CE) - shocked Christendom', year: 793 },
      { name: 'Hedeby', type: 'city', lat: 54.49, lng: 9.56, note: 'Great Danish trading town - hub between the North Sea and Baltic', year: 800 },
      { name: 'Kaupang', type: 'port', lat: 59.0, lng: 10.2, note: 'Norway\'s earliest town - Skiringssal trading centre', year: 800 },
      { name: 'Birka', type: 'port', lat: 59.34, lng: 17.54, note: 'Swedish Viking trade hub on Lake Mälaren', year: 800 },
      { name: 'Jorvik (York)', type: 'capital', lat: 53.96, lng: -1.08, note: 'Capital of the Danish kingdom in England - heart of the Danelaw', year: 866 },
      { name: 'Dublin', type: 'city', lat: 53.35, lng: -6.26, note: 'Norse-founded longphort - major slave and silver market', year: 841 },
      { name: 'Reykjavík (Iceland)', type: 'landmark', lat: 64.13, lng: -21.9, note: 'Iceland settled by Norse from c.874 - the Althing founded 930', year: 874 },
      { name: 'Brattahlíð (Greenland)', type: 'landmark', lat: 61.15, lng: -45.5, note: 'Erik the Red\'s estate - Norse Greenland settled c.985', year: 985 },
      { name: 'L\'Anse aux Meadows', type: 'landmark', lat: 51.6, lng: -55.53, note: 'Norse site in Newfoundland - Europeans in America c.1000', year: 1000 },
      { name: 'Novgorod', type: 'city', lat: 58.52, lng: 31.27, note: 'Rurik\'s Varangian seat - birth of the Rus state', year: 862 },
      { name: 'Kiev', type: 'capital', lat: 50.45, lng: 30.52, note: 'Capital of Kievan Rus - Varangian route to the Greeks', year: 882 },
      { name: 'Stamford Bridge', type: 'battle', lat: 53.99, lng: -0.92, note: 'Harald Hardrada killed (1066) - the Viking Age ends', year: 1066 },
      { name: 'Normandy (Rouen)', type: 'landmark', lat: 49.44, lng: 1.1, note: 'Granted to Rollo\'s Norsemen (911) - birth of the Normans', year: 911 },
    ],
  },

  {
    id: 'medieval-japan',
    era: 'medieval',
    period: '1185–1600 CE',
    yearRange: [1185, 1600],
    center: [36, 137],
    zoom: 5,
    title: 'Medieval Japan - Feudal Age',
    titleI18n: { de: 'Mittelalterliches Japan - Feudalzeit', fr: 'Le Japon médiéval - l’âge féodal', es: 'Japón medieval - era feudal', ru: 'Средневековая Япония - Феодальная эпоха', mk: 'Средновековна Јапонија - феудална ера' },
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
      { name: 'Kyoto', type: 'capital', lat: 35.01, lng: 135.77, note: 'Imperial capital (794–1868 CE) - cultural heart of Japan', year: 794 },
      { name: 'Kamakura', type: 'capital', lat: 35.32, lng: 139.55, note: 'First shogunate capital - Great Buddha statue', year: 1185 },
      { name: 'Osaka', type: 'city', lat: 34.69, lng: 135.5, note: "Toyotomi Hideyoshi's fortress-city - almost unified Japan", year: 1583 },
      { name: 'Edo (Tokyo)', type: 'capital', lat: 35.69, lng: 139.69, note: 'Tokugawa shogunate capital - became modern Tokyo', year: 1603 },
      { name: 'Battle of Dan-no-ura', type: 'battle', lat: 33.97, lng: 130.93, note: 'Minamoto defeat Taira - first shogunate established (1185)', year: 1185 },
      { name: 'Battle of Sekigahara', type: 'battle', lat: 35.37, lng: 136.47, note: 'Tokugawa unifies Japan - 280 years of peace (1600)', year: 1600 },
      { name: 'Nara', type: 'city', lat: 34.68, lng: 135.8, note: 'First permanent capital - great Buddhist temples', year: 710 },
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
    titleI18n: { de: 'Der transatlantische Sklavenhandel', fr: 'La traite transatlantique des esclaves', es: 'El comercio transatlántico de esclavos', ru: 'Трансатлантическая работорговля', mk: 'Трансатлантската трговија со робови' },
    description: 'Over 12.5 million enslaved Africans were shipped across the Atlantic on the triangular trade - manufactured goods to Africa, human beings to the Americas, sugar and cotton back to Europe.',
    routes: [
      {
        name: 'Middle Passage (Africa → Americas)',
        nameI18n: { es: 'El Paso del Medio (África → América)', ru: 'Средний путь (Африка → Америка)', mk: 'Средниот премин (Африка → Америка)', de: 'Mittelpassage (Afrika → Amerika)', fr: 'Passage du milieu (Afrique → Amériques)' },
        type: 'military',
        color: '#ef4444',
        points: [[5.5, 0.5], [4.0, -12.0], [8.0, -28.0], [13.0, -45.0], [13.2, -59.6]],
      },
      {
        name: 'Sugar & Cotton Route (Americas → Europe)',
        nameI18n: { es: 'Ruta del azúcar y algodón (América → Europa)', ru: 'Путь сахара и хлопка (Америка → Европа)', mk: 'Пат на шеќер и памук (Америка → Европа)', de: 'Zucker- und Baumwollroute (Amerika → Europa)', fr: 'Route du sucre et du coton (Amériques → Europe)' },
        type: 'trade',
        color: '#f59e0b',
        points: [[13.2, -59.6], [25.0, -60.0], [35.0, -40.0], [42.0, -20.0], [50.9, -1.4]],
      },
      {
        name: 'Manufactured Goods Route (Europe → Africa)',
        nameI18n: { es: 'Ruta de manufacturas (Europa → África)', ru: 'Путь промышленных товаров (Европа → Африка)', mk: 'Пат на индустриски стоки (Европа → Африка)', de: 'Fertigwarenroute (Europa → Afrika)', fr: 'Route des produits manufacturés (Europe → Afrique)' },
        type: 'trade',
        color: '#a78bfa',
        points: [[51.5, -0.1], [42.0, -9.5], [28.0, -15.0], [14.0, -17.0], [5.5, 0.5]],
      },
    ],
    markers: [
      { name: 'Elmina Castle', type: 'port', lat: 5.08, lng: -1.35, note: 'Oldest European slaving fort in sub-Saharan Africa (1482)', year: 1482 },
      { name: 'Ouidah', type: 'port', lat: 6.36, lng: 2.08, note: 'Major slaving port of the Kingdom of Dahomey', year: 1700 },
      { name: 'Luanda', type: 'port', lat: -8.84, lng: 13.23, note: 'Portuguese Angola - largest single source of the enslaved', year: 1600 },
      { name: 'Gorée Island', type: 'landmark', lat: 14.67, lng: -17.4, note: 'Senegalese slaving depot - the House of Slaves', year: 1600 },
      { name: 'Salvador da Bahia', type: 'city', lat: -12.97, lng: -38.5, note: 'Brazil received ~40% of all enslaved Africans - sugar capital', year: 1550 },
      { name: 'Kingston', type: 'port', lat: 17.97, lng: -76.79, note: 'Jamaica - hub of the British Caribbean sugar economy', year: 1692 },
      { name: 'Bridgetown', type: 'port', lat: 13.1, lng: -59.62, note: 'Barbados - first English plantation-slavery colony', year: 1627 },
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
    titleI18n: { de: 'Das Osmanische Reich auf seinem Höhepunkt', fr: 'L’Empire ottoman à son apogée', es: 'Imperio Otomano en su apogeo', ru: 'Османская империя на пике могущества', mk: 'Отоманската империја на врвот' },
    description: "Under Suleiman the Magnificent (1520–66), the Ottomans controlled three continents - from the gates of Vienna to the Persian Gulf - the dominant power of the 16th century.",
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
        nameI18n: { es: 'Camino Militar Otomano (Viena)', ru: 'Османский военный путь (Вена)', mk: 'Отомански воен пат (Виена)', de: 'Osmanische Heerstraße (Wien)', fr: 'Route militaire ottomane (Vienne)' },
        type: 'military',
        color: '#ef4444',
        points: [[41.01,28.98],[42,26],[44,18],[46,16],[48.2,16.4]],
      },
    ],
    markers: [
      { name: 'Constantinople (Istanbul)', type: 'capital', lat: 41.01, lng: 28.98, note: 'Taken by Mehmed II (1453) - renamed capital of Ottoman Empire', year: 1453 },
      { name: 'Mecca', type: 'landmark', lat: 21.42, lng: 39.83, note: 'Under Ottoman protection as Custodians of Two Holy Mosques', year: 1517 },
      { name: 'Cairo', type: 'city', lat: 30.04, lng: 31.24, note: 'Mamluk capital conquered by Selim I (1517)', year: 1517 },
      { name: 'Baghdad', type: 'city', lat: 33.34, lng: 44.4, note: 'Taken from Safavid Persia by Suleiman (1534)', year: 1534 },
      { name: 'Vienna', type: 'city', lat: 48.2, lng: 16.37, note: 'Failed Ottoman sieges (1529 and 1683) - turning point', year: 1529 },
      { name: 'Battle of Mohács', type: 'battle', lat: 45.99, lng: 18.7, note: 'Suleiman destroys Hungarian army - Ottomans enter Europe (1526)', year: 1526 },
      { name: 'Battle of Lepanto', type: 'battle', lat: 38.38, lng: 21.33, note: 'Holy League defeats Ottoman fleet - first major Ottoman defeat (1571)', year: 1571 },
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
    titleI18n: { de: 'Das Renaissance-Italien', fr: 'L’Italie de la Renaissance', es: 'Italia del Renacimiento', ru: 'Ренессансная Италия', mk: 'Ренесансна Италија' },
    description: 'The Italian city-states became the epicentre of the Renaissance - a rebirth of classical art, learning, and humanism funded by Medici banking wealth and Papal patronage.',
    polygons: [
      {
        label: 'Italian Peninsula',
        color: '#10b981',
        fillOpacity: 0.25,
        coords: [[44,8],[46,10],[46,14],[45,14],[44,14],[44,16],[43,14],[41,14],[40,16],[38,16],[37,16],[37,14],[38,12],[39,10],[41,8],[42,8],[44,8]],
      },
    ],
    markers: [
      { name: 'Florence', type: 'capital', lat: 43.77, lng: 11.25, note: 'Medici city - Botticelli, da Vinci, Ghiberti, Brunelleschi', year: 1400 },
      { name: 'Rome (Vatican)', type: 'landmark', lat: 41.9, lng: 12.5, note: 'Sistine Chapel, St. Peter\'s - Michelangelo and Raphael', year: 1450 },
      { name: 'Venice', type: 'city', lat: 45.44, lng: 12.33, note: 'Richest trading republic - Doge\'s Palace, printing press', year: 1400 },
      { name: 'Milan', type: 'city', lat: 45.46, lng: 9.19, note: "Leonardo da Vinci's workshop, Last Supper painted here", year: 1482 },
      { name: 'Genoa', type: 'port', lat: 44.41, lng: 8.93, note: 'Rival maritime republic - birthplace of Columbus', year: 1400 },
      { name: 'Naples', type: 'city', lat: 40.85, lng: 14.27, note: 'Kingdom of Naples - Aragonese and later Spanish rule', year: 1400 },
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
    titleI18n: { de: 'Das Zeitalter der Entdeckungen', fr: 'L’ère des grandes découvertes', es: 'La época de las exploraciones', ru: 'Эпоха Великих открытий', mk: 'Доба на географските откритија' },
    description: 'Portuguese and Spanish explorers mapped Africa\'s coasts, reached India by sea, landed in the Americas, and circumnavigated the globe - reshaping the world forever.',
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
        nameI18n: { es: 'Primer Viaje de Colón (1492)', ru: 'Первое плавание Колумба (1492)', mk: 'Прво патување на Колумбо (1492)', de: 'Kolumbus’ erste Fahrt (1492)', fr: 'Premier voyage de Colomb (1492)' },
        type: 'military',
        color: '#3b82f6',
        points: [[38,-9],[30,-17],[22,-30],[18,-66]],
      },
      {
        name: "Da Gama's Route to India (1498)",
        nameI18n: { es: 'Ruta de Da Gama a India (1498)', ru: 'Маршрут Да Гамы в Индию (1498)', mk: 'Рутата на Да Гама кон Индија (1498)' , de: 'Da Gamas Weg nach Indien (1498)', fr: 'Route de Vasco de Gama vers l’Inde (1498)'},
        type: 'military',
        color: '#ef4444',
        points: [[38.7,-9.1],[-34.4,18.5],[-26,15],[11.3,43.1],[11.2,51],[11.3,43.5],[10,77]],
      },
      {
        name: "Magellan's Circumnavigation (1519–22)",
        nameI18n: { es: 'Circunnavegación de Magallanes (1519–22)', ru: 'Кругосветное плавание Магеллана (1519–22)', mk: 'Кружно патување на Магелан (1519–22)' , de: 'Magellans Weltumsegelung (1519–22)', fr: 'Circumnavigation de Magellan (1519–22)'},
        type: 'trade',
        color: '#8b5cf6',
        points: [[38,-9],[0,-35],[-40,-65],[-35,-60],[-10,-80],[10,-85],[10,-103],[0,-140],[-20,160],[-30,115],[0,42],[10,44],[38,-9]],
      },
    ],
    markers: [
      { name: 'Lisbon', type: 'capital', lat: 38.72, lng: -9.14, note: "Portugal's hub of maritime exploration", year: 1415 },
      { name: 'Tenochtitlan (Mexico City)', type: 'city', lat: 19.43, lng: -99.13, note: 'Aztec capital - conquered by Cortés (1521)', year: 1521 },
      { name: 'Cusco', type: 'capital', lat: -13.53, lng: -71.97, note: 'Inca capital - conquered by Pizarro (1533)', year: 1533 },
      { name: 'Calicut', type: 'port', lat: 11.25, lng: 75.78, note: "Vasco da Gama's India landing - spice trade opened (1498)", year: 1498 },
      { name: 'Cape of Good Hope', type: 'landmark', lat: -34.36, lng: 18.47, note: 'Rounded by Bartholomeu Dias (1488)', year: 1488 },
      { name: 'Ceuta', type: 'port', lat: 35.89, lng: -5.31, note: 'Portuguese conquest - beginning of the Age of Exploration (1415)', year: 1415 },
      { name: 'Havana', type: 'port', lat: 23.14, lng: -82.38, note: 'Spanish base for Caribbean and Americas', year: 1519 },
      { name: 'Goa', type: 'port', lat: 15.49, lng: 73.83, note: 'Portuguese India capital - spice trade hub', year: 1510 },
      { name: 'Malacca', type: 'port', lat: 2.19, lng: 102.25, note: 'Key Southeast Asian trading port - seized by Portugal 1511', year: 1511 },
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
    titleI18n: { de: 'Die protestantische Reformation', fr: 'La Réforme protestante', es: 'La Reforma Protestante', ru: 'Протестантская Реформация', mk: 'Протестантската реформација' },
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
      { name: 'Wittenberg', type: 'landmark', lat: 51.87, lng: 12.65, note: 'Luther posted 95 Theses here (1517) - start of Reformation', year: 1517 },
      { name: 'Geneva', type: 'city', lat: 46.2, lng: 6.15, note: "Calvin's theocratic republic - Calvinist Reformation centre", year: 1536 },
      { name: 'Zurich', type: 'city', lat: 47.38, lng: 8.54, note: "Zwingli's reformed city - rival to Lutheran Reformation", year: 1519 },
      { name: 'Augsburg', type: 'city', lat: 48.37, lng: 10.9, note: 'Peace of Augsburg (1555) - "cuius regio, eius religio"', year: 1555 },
      { name: 'Worms', type: 'city', lat: 49.63, lng: 8.36, note: 'Diet of Worms - Luther refuses to recant (1521)', year: 1521 },
      { name: 'Rome (Vatican)', type: 'landmark', lat: 41.9, lng: 12.5, note: 'Counter-Reformation - Council of Trent (1545–63)', year: 1545 },
      { name: 'Münster', type: 'city', lat: 51.96, lng: 7.63, note: 'Peace of Westphalia signed here (1648) - modern state system', year: 1648 },
      { name: 'Prague', type: 'city', lat: 50.08, lng: 14.44, note: 'Defenestration of Prague - Thirty Years War begins (1618)', year: 1618 },
      { name: 'Battle of White Mountain', type: 'battle', lat: 50.07, lng: 14.3, note: 'Catholics defeat Protestants - Czech lands subdued (1620)', year: 1620 },
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
    titleI18n: { de: 'Die Amerikanische Revolution', fr: 'La révolution américaine', es: 'Revolución americana', ru: 'Американская революция', mk: 'Американска револуција' },
    description: 'The 13 British colonies declared independence in 1776, creating the United States - the first modern democratic republic, inspiring revolutions worldwide.',
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
        nameI18n: { es: 'Campañas de Washington', ru: 'Кампании Вашингтона', mk: 'Кампањите на Вашингтон', de: 'Washingtons Feldzüge', fr: 'Campagnes de Washington' },
        type: 'military',
        color: '#3b82f6',
        points: [[42.3,-71.1],[40.2,-74.2],[39.9,-75.1],[40.1,-74.5],[40.0,-74.9],[40.2,-75.2],[40.3,-75.1],[37.5,-77.5]],
      },
    ],
    markers: [
      { name: 'Philadelphia', type: 'capital', lat: 39.95, lng: -75.16, note: 'Continental Congress - Declaration of Independence signed 1776', year: 1776 },
      { name: 'Boston', type: 'city', lat: 42.36, lng: -71.06, note: 'Boston Massacre (1770) and Tea Party (1773) - revolution begins', year: 1770 },
      { name: 'Lexington', type: 'battle', lat: 42.44, lng: -71.23, note: 'First shots fired - "shot heard round the world" (1775)', year: 1775 },
      { name: 'Valley Forge', type: 'landmark', lat: 40.1, lng: -75.38, note: "Washington's army wintered here - tested revolutionary resolve", year: 1777 },
      { name: 'Yorktown', type: 'battle', lat: 37.24, lng: -76.51, note: 'British surrender - final major battle of the Revolution (1781)', year: 1781 },
      { name: 'New York', type: 'city', lat: 40.71, lng: -74.0, note: 'British headquarters - Washington inaugurated first President here', year: 1776 },
      { name: 'Bunker Hill', type: 'battle', lat: 42.37, lng: -71.06, note: 'Early battle - British win but suffer heavy losses (1775)', year: 1775 },
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
    titleI18n: { de: 'Französische Revolution & Napoleon', fr: 'Révolution française et Napoléon', es: 'Revolución francesa y Napoleón', ru: 'Французская революция и Наполеон', mk: 'Француска револуција и Наполеон' },
    description: 'The French Revolution overthrew the monarchy (1789), and Napoleon\'s conquests spread revolutionary ideals across Europe before his defeat at Waterloo (1815).',
    polygons: [
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[51.091,2.522],[51.313,2.995],[51.354,3.214],[51.314,3.472],[51.321,3.681],[51.388,3.775],[51.325,4.173],[51.34,4.407],[51.411,4.395],[51.405,4.671],[51.487,4.791],[51.378,4.932],[51.433,5.01],[51.405,5.113],[51.237,5.244],[51.286,5.484],[51.117,5.824],[50.926,5.774],[50.883,5.697],[50.731,5.697],[50.742,6],[50.662,6.155],[50.498,6.281],[50.287,6.298],[50.117,6.109],[50.15,6.007],[50.047,5.834],[49.902,5.738],[49.755,5.745],[49.664,5.884],[49.507,5.824],[49.559,5.788],[49.48,5.475],[49.583,5.418],[49.761,5.098],[49.782,4.86],[49.885,4.877],[49.966,4.812],[50.134,4.865],[50.101,4.755],[49.96,4.668],[49.911,4.285],[49.966,4.156],[50.055,4.188],[50.134,4.148],[50.242,4.22],[50.318,4.051],[50.334,3.675],[50.47,3.603],[50.465,3.37],[50.524,3.283],[50.731,3.192],[50.807,3.123],[50.682,2.875],[50.739,2.755],[50.89,2.616],[51.091,2.522]],
      },
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[53.931,10.771],[53.882,10.884],[53.685,10.662],[53.776,10.558],[53.853,10.584],[54.021,10.545],[54.125,10.584],[54.06,10.649],[53.918,10.701],[53.931,10.771]],
      },
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[44.437,9.572],[44.473,9.479],[44.44,9.396],[44.556,9.363],[44.54,9.297],[44.772,9.23],[44.789,9.131],[45.121,9.131],[45.22,9.662],[45.021,10.293],[45.026,10.393],[44.905,10.276],[44.689,10.36],[44.49,10.243],[44.49,10.193],[44.357,10.127],[44.407,9.978],[44.556,9.895],[44.606,9.745],[44.573,9.596],[44.437,9.572]],
      },
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[44.732,12.378],[44.673,12.274],[44.301,12.345],[43.935,12.697],[43.535,13.601],[43.374,13.732],[43.123,13.792],[42.634,14.076],[42.613,13.996],[42.53,13.929],[42.564,13.83],[42.481,13.83],[42.464,13.763],[42.398,13.714],[42.53,13.631],[42.431,13.548],[42.364,13.415],[42.232,13.465],[42.198,13.415],[42.099,13.581],[42.049,13.581],[42.016,13.631],[41.933,13.631],[41.866,13.564],[41.8,13.597],[41.75,13.647],[41.8,13.647],[41.75,13.863],[41.783,13.863],[41.75,13.929],[41.634,13.88],[41.634,13.929],[41.468,13.963],[41.401,14.029],[41.335,13.979],[41.318,13.813],[41.207,13.761],[41.302,13.498],[41.371,12.977],[41.531,12.642],[41.73,12.395],[42.007,11.96],[42.099,12.02],[42.248,12.003],[42.298,12.07],[42.53,12.053],[42.63,12.169],[42.696,12.153],[42.912,12.186],[43.062,12.153],[43.228,12.219],[43.278,12.302],[43.344,12.302],[43.344,12.219],[43.477,12.12],[43.743,12.12],[43.892,12.219],[43.842,12.086],[43.925,12.037],[44.174,12.086],[44.174,12.02],[44.091,11.937],[44.257,11.887],[44.324,11.904],[44.357,11.854],[44.357,11.738],[44.257,11.688],[44.224,11.704],[44.191,11.555],[44.224,11.572],[44.274,11.455],[44.224,11.289],[44.158,11.323],[44.143,11.202],[44.34,11.14],[44.373,11.289],[44.456,11.289],[44.606,11.173],[44.789,11.256],[44.855,11.339],[45.067,11.17],[45.071,11.24],[44.905,11.605],[45.071,11.771],[45.087,11.887],[45.021,12.053],[45.137,12.037],[45.104,12.136],[44.732,12.378]],
      },
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[44.29,9.878],[44.29,9.828],[44.357,9.778],[44.437,9.572],[44.573,9.596],[44.606,9.745],[44.556,9.895],[44.407,9.978],[44.333,9.954],[44.343,9.892],[44.29,9.878]],
      },
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[43.596,10.338],[43.745,10.261],[43.892,10.326],[43.859,10.36],[44.091,10.509],[44.141,10.592],[44.091,10.692],[43.981,10.73],[43.867,10.689],[43.63,10.751],[43.578,10.596],[43.609,10.503],[43.596,10.338]],
      },
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[44.143,11.202],[44.124,11.057],[44.158,11.057],[44.158,10.957],[44.207,10.824],[44.174,10.708],[44.091,10.692],[44.141,10.592],[44.091,10.509],[43.937,10.41],[43.981,10.286],[43.881,10.155],[44.11,9.909],[44.153,9.825],[44.343,9.892],[44.333,9.954],[44.407,9.978],[44.38,10.056],[44.292,10.037],[44.219,10.141],[44.312,10.172],[44.357,10.127],[44.49,10.193],[44.49,10.243],[44.689,10.36],[44.905,10.276],[45.026,10.393],[45.067,11.17],[44.855,11.339],[44.789,11.256],[44.606,11.173],[44.456,11.289],[44.373,11.289],[44.34,11.14],[44.143,11.202]],
      },
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[52.392,8.32],[52.371,8.237],[52.444,7.999],[52.547,8.02],[52.63,7.937],[52.63,7.896],[52.671,7.885],[52.63,7.689],[52.723,7.658],[52.733,7.72],[52.775,7.71],[52.775,7.678],[52.816,7.699],[52.837,7.813],[52.951,7.782],[53.002,7.689],[53.158,7.699],[53.147,7.772],[53.271,7.865],[53.282,7.947],[53.344,7.947],[53.396,7.854],[53.447,7.906],[53.634,7.875],[53.638,7.969],[53.444,8.099],[53.373,8.029],[53.322,8.175],[53.352,8.242],[53.439,8.261],[53.531,8.189],[53.525,8.306],[53.449,8.502],[53.478,8.537],[53.385,8.506],[53.416,8.454],[53.396,8.434],[53.375,8.475],[53.333,8.465],[53.333,8.434],[53.261,8.423],[53.158,8.558],[53.077,8.576],[53.027,8.66],[53.053,8.327],[52.981,8.369],[53.038,8.241],[53.024,8.141],[52.938,8.255],[52.824,8.269],[52.853,8.212],[52.667,8.269],[52.671,8.341],[52.392,8.32]],
      },
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[46.303,6.248],[46.366,6.305],[46.339,6.396],[46.403,6.512],[46.391,6.809],[46.362,6.776],[46.292,6.864],[46.137,6.804],[46.125,6.903],[46.054,6.876],[45.924,7.049],[45.861,7.196],[45.991,7.577],[45.921,7.873],[46.146,8.154],[46.268,8.089],[46.466,8.437],[46.251,8.443],[46.117,8.637],[46.001,8.55],[45.768,8.467],[45.519,8.45],[45.287,8.583],[45.17,8.815],[45.121,9.131],[44.789,9.131],[44.772,9.23],[44.54,9.297],[44.556,9.363],[44.44,9.396],[44.473,9.479],[44.357,9.778],[44.29,9.828],[44.29,9.878],[44.153,9.825],[44.22,9.692],[44.437,8.897],[44.417,8.672],[44.126,8.186],[43.965,7.98],[43.867,7.553],[43.764,7.397],[43.902,7.355],[43.815,6.923],[43.902,6.886],[43.914,6.96],[43.976,6.923],[44.05,6.997],[44.136,6.935],[44.149,6.886],[44.112,6.836],[44.198,6.787],[44.297,6.787],[44.349,6.87],[44.548,6.783],[44.715,6.925],[44.72,7.003],[44.869,6.943],[44.955,6.665],[45.116,6.507],[45.199,6.28],[45.297,6.243],[45.322,6.268],[45.347,6.219],[45.322,6.145],[45.372,6.083],[45.334,6.033],[45.223,6.058],[45.26,5.947],[45.322,5.935],[45.396,5.823],[45.52,5.848],[45.507,5.91],[45.656,5.922],[45.742,5.897],[45.816,5.947],[46.026,5.86],[46.026,5.935],[46.176,5.941],[46.161,5.989],[46.133,5.963],[46.126,6.108],[46.248,6.316],[46.291,6.261],[46.274,6.223],[46.303,6.248]],
      },
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[52.558,6.727],[52.476,6.714],[52.416,6.912],[52.443,6.997],[52.366,7.069],[52.219,7.068],[52.126,6.882],[51.956,6.825],[51.888,6.68],[51.82,6.381],[51.88,6.211],[51.804,5.979],[51.722,5.948],[51.64,6.117],[51.389,6.222],[51.198,6.089],[51.144,6.176],[50.981,5.928],[50.964,6.01],[50.867,6.074],[50.742,6],[50.731,5.697],[50.883,5.697],[50.926,5.774],[51.117,5.824],[51.286,5.484],[51.237,5.244],[51.405,5.113],[51.433,5.01],[51.378,4.932],[51.487,4.791],[51.405,4.671],[51.411,4.395],[51.34,4.407],[51.325,4.173],[51.388,3.775],[51.444,3.573],[51.521,3.453],[52.071,4.264],[52.23,4.387],[52.756,4.641],[52.965,4.774],[52.896,4.888],[52.943,5.035],[52.752,5.136],[52.718,5.317],[52.626,5.133],[52.632,5.02],[52.52,5.07],[52.334,5.036],[52.587,5.556],[52.679,5.547],[52.75,5.653],[52.79,5.326],[52.938,5.358],[53.011,5.332],[53.139,5.39],[53.3,5.599],[53.382,5.891],[53.459,6.777],[53.35,6.902],[53.23,7.19],[53.164,7.16],[52.967,7.228],[52.804,7.073],[52.624,7.035],[52.64,6.778],[52.558,6.727]],
      },
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[46.576,6.108],[46.546,6.163],[46.417,6.069],[46.368,6.175],[46.161,5.989],[46.176,5.941],[46.026,5.935],[46.026,5.86],[45.816,5.947],[45.742,5.897],[45.656,5.922],[45.507,5.91],[45.52,5.848],[45.396,5.823],[45.322,5.935],[45.26,5.947],[45.223,6.058],[45.334,6.033],[45.372,6.083],[45.322,6.145],[45.347,6.219],[45.322,6.268],[45.297,6.243],[45.199,6.28],[45.116,6.507],[44.955,6.665],[44.869,6.943],[44.72,7.003],[44.715,6.925],[44.548,6.783],[44.349,6.87],[44.297,6.787],[44.198,6.787],[44.112,6.836],[44.149,6.886],[44.136,6.935],[44.05,6.997],[43.976,6.923],[43.914,6.96],[43.902,6.886],[43.815,6.923],[43.902,7.355],[43.764,7.397],[43.667,7.298],[43.448,6.923],[43.151,6.523],[43.021,5.829],[43.033,5.647],[43.104,5.434],[43.328,5.052],[43.366,4.91],[43.321,4.647],[43.346,4.417],[43.487,4.078],[43.467,3.807],[43.312,3.479],[43.196,3.318],[42.945,3.068],[42.771,3.002],[42.369,3.087],[42.41,2.937],[42.348,2.599],[42.287,2.582],[42.293,2.363],[42.382,2.171],[42.307,1.994],[42.314,1.876],[42.382,1.86],[42.423,1.709],[42.375,1.448],[42.41,1.364],[42.635,1.307],[42.772,0.744],[42.772,0.584],[42.628,0.592],[42.608,0.196],[42.663,0.18],[42.649,-0.166],[42.717,-0.216],[42.786,-0.41],[42.751,-0.469],[42.765,-0.587],[42.731,-0.612],[42.909,-0.84],[42.881,-0.907],[43.032,-1.397],[42.984,-1.448],[42.998,-1.515],[43.045,-1.558],[43.155,-1.466],[43.21,-1.491],[43.196,-1.702],[43.305,-1.915],[43.36,-1.746],[43.524,-1.561],[44.559,-1.314],[44.6,-1.136],[44.73,-1.23],[44.614,-1.332],[45.129,-1.276],[45.501,-1.175],[45.432,-1.123],[45.294,-0.9],[45.019,-0.728],[45.321,-0.855],[45.688,-1.247],[45.8,-1.237],[46.015,-1.075],[46.307,-1.256],[46.404,-1.403],[46.449,-1.711],[46.706,-1.942],[46.851,-2.13],[47.043,-2.005],[47.124,-2.109],[47.247,-2.494],[47.325,-2.576],[47.494,-2.466],[47.572,-2.614],[47.492,-2.842],[47.604,-3.063],[47.717,-3.434],[47.798,-3.712],[47.792,-3.858],[47.904,-3.955],[47.829,-4.364],[47.942,-4.391],[47.998,-4.51],[48.017,-4.675],[48.064,-4.7],[48.101,-4.313],[48.205,-4.351],[48.251,-4.588],[48.298,-4.389],[48.391,-4.35],[48.392,-4.592],[48.355,-4.78],[48.552,-4.762],[48.547,-4.626],[48.612,-4.488],[48.731,-3.999],[48.646,-3.902],[48.721,-3.821],[48.693,-3.608],[48.81,-3.558],[48.872,-3.091],[48.59,-2.791],[48.552,-2.636],[48.674,-2.343],[48.599,-2.2],[48.712,-1.871],[48.608,-1.858],[48.638,-1.591],[48.684,-1.457],[48.768,-1.576],[49.229,-1.58],[49.22,-1.639],[49.526,-1.892],[49.709,-1.941],[49.653,-1.524],[49.7,-1.251],[49.521,-1.289],[49.333,-1.177],[49.398,-1.023],[49.351,-0.465],[49.285,-0.239],[49.334,0.033],[49.455,0.331],[49.511,0.09],[49.602,0.115],[49.681,0.189],[49.826,0.529],[50.004,1.275],[50.229,1.552],[50.578,1.528],[50.822,1.589],[51.007,2.03],[51.048,2.443],[51.091,2.522],[50.89,2.616],[50.739,2.755],[50.682,2.875],[50.807,3.123],[50.731,3.192],[50.524,3.283],[50.465,3.37],[50.47,3.603],[50.334,3.675],[50.318,4.051],[50.242,4.22],[50.134,4.148],[50.055,4.188],[49.966,4.156],[49.911,4.285],[49.96,4.668],[50.101,4.755],[50.134,4.865],[49.966,4.812],[49.885,4.877],[49.782,4.86],[49.761,5.098],[49.583,5.418],[49.48,5.475],[49.559,5.788],[49.507,5.824],[49.473,6.368],[49.177,6.777],[49.202,6.954],[49.137,6.975],[49.183,7.423],[49.099,7.465],[49.059,7.67],[49.065,7.886],[48.978,8.158],[48.616,7.729],[48.359,7.681],[48.191,7.536],[48.058,7.502],[48.024,7.543],[47.709,7.446],[47.604,7.507],[47.579,7.583],[47.464,7.429],[47.432,7.606],[47.248,7.4],[46.963,6.986],[46.797,6.672],[46.805,6.452],[46.775,6.456],[46.576,6.108]],
      },
      {
        label: 'French Empire (1812)',
        color: '#1f7a33',
        fillOpacity: 0.62,
        coords: [[42.581,9.405],[42.556,9.459],[42.406,9.487],[42.048,9.453],[41.901,9.357],[41.575,9.305],[41.35,9.173],[41.369,9.039],[41.458,9.013],[41.492,8.829],[41.561,8.727],[41.654,8.855],[41.688,8.823],[41.732,8.627],[41.882,8.742],[41.913,8.693],[41.882,8.562],[41.948,8.538],[42.029,8.668],[42.097,8.626],[42.134,8.511],[42.208,8.517],[42.262,8.628],[42.36,8.5],[42.487,8.609],[42.625,8.879],[42.635,9],[42.691,9.018],[42.711,9.149],[42.664,9.238],[42.728,9.28],[42.883,9.271],[42.983,9.303],[42.988,9.367],[42.91,9.414],[42.794,9.432],[42.581,9.405]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[17.987,-67.152],[18.082,-67.185],[18.33,-67.162],[18.438,-67.211],[18.514,-67.161],[18.546,-67.055],[18.472,-65.952],[18.396,-65.775],[18.333,-65.724],[18.129,-65.84],[18.027,-65.967],[18.008,-66.118],[18.045,-66.451],[18.013,-66.746],[17.936,-66.906],[17.987,-67.152]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[42.015,-8.86],[42.195,-8.799],[42.42,-8.644],[42.824,-8.942],[42.856,-9.173],[42.901,-9.247],[43.049,-9.271],[43.158,-9.197],[43.281,-9.014],[43.326,-8.849],[43.353,-8.31],[43.43,-8.251],[43.617,-8.22],[43.74,-7.98],[43.721,-7.636],[43.555,-7.151],[43.523,-6.808],[43.563,-6.468],[43.705,-5.98],[43.706,-5.82],[43.577,-5.537],[43.507,-5.225],[43.439,-3.848],[43.376,-3.417],[43.447,-3.196],[43.55,-3.007],[43.538,-2.768],[43.326,-2.367],[43.333,-2.066],[43.305,-1.915],[43.196,-1.702],[43.21,-1.491],[43.155,-1.466],[43.045,-1.558],[42.998,-1.515],[42.984,-1.448],[43.032,-1.397],[42.881,-0.907],[42.909,-0.84],[42.731,-0.612],[42.765,-0.587],[42.751,-0.469],[42.786,-0.41],[42.717,-0.216],[42.649,-0.166],[42.663,0.18],[42.608,0.196],[42.628,0.592],[42.772,0.584],[42.772,0.744],[42.635,1.307],[42.41,1.364],[42.375,1.448],[42.423,1.709],[42.382,1.86],[42.314,1.876],[42.307,1.994],[42.382,2.171],[42.293,2.363],[42.287,2.582],[42.348,2.599],[42.41,2.937],[42.369,3.087],[42.121,3.086],[42.076,3.157],[41.857,3.129],[41.446,2.201],[41.298,2.081],[41.157,1.311],[41.022,0.879],[40.875,0.734],[40.785,0.71],[40.727,0.827],[40.657,0.788],[40.593,0.505],[40.24,0.238],[39.886,-0.161],[39.434,-0.395],[38.954,-0.166],[38.821,0.126],[38.738,0.173],[38.43,-0.435],[38.215,-0.564],[38.177,-0.665],[37.76,-0.872],[37.615,-0.803],[37.57,-0.918],[37.548,-1.365],[37.439,-1.626],[37.292,-1.817],[36.952,-1.94],[36.728,-2.239],[36.824,-2.355],[36.811,-2.624],[36.69,-2.761],[36.69,-2.915],[36.741,-2.97],[36.722,-4.447],[36.486,-4.757],[36.41,-5.217],[36.237,-5.374],[36.11,-5.387],[36.072,-5.424],[36.167,-5.457],[36.174,-5.488],[36.065,-5.485],[36.008,-5.661],[36.072,-5.85],[36.282,-6.204],[36.454,-6.305],[36.572,-6.289],[36.623,-6.444],[36.719,-6.5],[36.792,-6.422],[37.022,-6.632],[37.226,-7.228],[37.208,-7.492],[37.644,-7.351],[37.811,-7.243],[38.1,-6.845],[38.24,-7.028],[38.295,-7.394],[38.5,-7.317],[38.961,-6.933],[39.521,-7.431],[39.579,-7.301],[39.599,-7.084],[39.702,-6.878],[39.792,-6.859],[40.214,-6.884],[40.657,-6.825],[40.862,-6.857],[41.061,-6.834],[41.32,-6.241],[41.417,-6.112],[41.526,-6.139],[41.749,-6.518],[41.858,-6.586],[41.96,-6.709],[41.985,-6.86],[41.868,-7.098],[41.889,-7.919],[42.087,-8.157],[41.889,-8.806],[42.015,-8.86]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[22.385,-82.041],[22.507,-81.663],[22.621,-81.739],[22.672,-81.88],[22.708,-82.562],[22.638,-82.853],[22.223,-83.39],[22.21,-83.851],[22.159,-83.945],[21.955,-84.03],[21.828,-84.209],[21.77,-84.706],[21.916,-84.59],[22.056,-84.377],[22.323,-84.435],[22.495,-84.308],[22.814,-83.69],[23.025,-82.959],[23.065,-82.436],[23.135,-82.057],[23.137,-81.431],[23.061,-81.103],[23.024,-80.721],[22.885,-80.199],[22.879,-79.985],[22.759,-79.76],[22.518,-79.502],[22.404,-79.33],[22.328,-79.069],[22.278,-78.723],[22.12,-78.171],[21.899,-77.712],[21.759,-77.508],[21.512,-77.34],[21.448,-77.191],[21.43,-76.976],[21.196,-76.209],[21.121,-75.751],[21.013,-75.604],[20.752,-75.759],[20.683,-75.654],[20.664,-75.402],[20.697,-75.062],[20.621,-74.839],[20.19,-74.173],[20.152,-74.278],[20.112,-74.72],[19.933,-75.237],[19.907,-75.519],[20.002,-75.993],[20.02,-76.398],[19.885,-77.243],[19.871,-77.461],[19.903,-77.663],[20.355,-77.177],[20.533,-77.099],[20.704,-77.291],[20.767,-77.571],[20.767,-77.886],[20.817,-78.157],[20.969,-78.45],[21.306,-78.514],[21.547,-78.63],[21.617,-78.728],[21.609,-79.358],[21.672,-79.735],[21.773,-80.014],[21.995,-80.444],[22.102,-80.776],[22.164,-81.572],[22.208,-81.792],[22.366,-82.177],[22.385,-82.041]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[18.614,-71.895],[18.69,-71.891],[18.895,-71.72],[19.771,-71.777],[19.897,-71.551],[19.834,-71.374],[19.834,-71.22],[19.911,-71.047],[19.93,-70.882],[19.79,-70.739],[19.652,-70.289],[19.684,-69.993],[19.506,-69.898],[19.354,-69.747],[19.208,-69.509],[19.076,-69.069],[18.873,-68.657],[18.715,-68.477],[18.575,-68.373],[18.499,-68.459],[18.365,-68.523],[18.199,-68.665],[18.244,-68.772],[18.51,-68.986],[18.529,-69.156],[18.503,-69.511],[18.547,-69.64],[18.547,-69.808],[18.502,-69.956],[18.259,-70.299],[18.285,-70.477],[18.507,-70.621],[18.519,-70.696],[18.347,-71.062],[17.997,-71.217],[17.704,-71.401],[17.755,-71.531],[18.003,-71.677],[18.614,-71.895]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[42.634,14.076],[42.23,14.519],[42.142,14.72],[42.047,14.739],[41.972,14.922],[41.857,15.449],[41.904,16.013],[41.841,16.187],[41.746,16.198],[41.635,15.989],[41.502,15.873],[41.406,15.991],[41.094,16.946],[40.597,18.034],[40.514,18.06],[40.308,18.384],[40.094,18.523],[39.747,18.365],[39.948,18.017],[40.167,17.968],[40.243,17.85],[40.292,17.402],[40.398,17.204],[40.496,17.243],[40.525,17.084],[40.481,16.949],[40.184,16.728],[40.09,16.604],[39.968,16.624],[39.832,16.535],[39.698,16.532],[39.422,17.149],[39.28,17.107],[39.086,17.121],[39.022,17.181],[38.915,17.095],[38.926,16.798],[38.827,16.613],[38.725,16.522],[38.457,16.572],[38.321,16.331],[37.931,16.053],[37.91,15.785],[37.941,15.71],[38.004,15.627],[38.233,15.627],[38.296,15.791],[38.54,15.933],[38.623,15.827],[38.735,15.99],[38.701,16.152],[38.778,16.212],[38.931,16.177],[39.012,16.083],[39.428,15.99],[39.661,15.825],[39.934,15.757],[40.092,15.666],[40.066,15.516],[39.989,15.432],[40.212,15.027],[40.241,14.899],[40.372,14.992],[40.551,14.951],[40.705,14.743],[40.594,14.334],[40.643,14.35],[40.73,14.495],[40.851,14.37],[40.853,14.24],[40.768,14.051],[40.998,13.942],[41.207,13.761],[41.318,13.813],[41.335,13.979],[41.401,14.029],[41.468,13.963],[41.634,13.929],[41.634,13.88],[41.75,13.929],[41.783,13.863],[41.75,13.863],[41.8,13.647],[41.75,13.647],[41.866,13.564],[41.933,13.631],[42.016,13.631],[42.049,13.581],[42.099,13.581],[42.198,13.415],[42.232,13.465],[42.364,13.415],[42.431,13.548],[42.53,13.631],[42.398,13.714],[42.464,13.763],[42.481,13.83],[42.564,13.83],[42.53,13.929],[42.613,13.996],[42.634,14.076]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[36.739,14.942],[36.776,14.622],[37.049,14.216],[37.157,13.868],[37.525,13.012],[37.582,12.637],[37.639,12.532],[37.766,12.454],[37.919,12.517],[38.072,12.664],[38.117,12.783],[38.067,13.066],[38.221,13.322],[38.03,13.628],[37.966,13.81],[37.973,14.134],[38.058,14.766],[38.206,15.387],[38.167,15.454],[38.11,15.473],[37.682,15.181],[37.459,15.112],[37.287,15.116],[37.058,15.301],[37,15.221],[36.745,15.027],[36.739,14.942]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[47.889,8.594],[48.141,8.512],[48.281,8.291],[48.352,8.291],[48.292,8.522],[48.231,8.612],[47.97,8.682],[47.889,8.594]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[52.16,8.833],[52.057,8.833],[51.996,8.936],[51.708,8.946],[51.729,8.987],[51.688,9.048],[51.79,9.12],[51.801,9.192],[51.739,9.213],[51.729,9.161],[51.625,9.173],[51.667,9.002],[51.657,8.869],[51.749,8.848],[51.719,8.818],[51.749,8.735],[51.708,8.684],[51.76,8.643],[51.76,8.592],[51.862,8.582],[51.914,8.541],[51.893,8.489],[52.037,8.499],[52.098,8.561],[52.057,8.643],[52.098,8.725],[52.17,8.715],[52.191,8.766],[52.16,8.833]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[51.554,9.823],[51.623,9.725],[51.644,9.472],[51.544,9.161],[51.688,9.182],[51.729,9.161],[51.739,9.213],[51.801,9.192],[51.806,9.243],[51.883,9.243],[51.905,9.287],[51.74,9.298],[51.729,9.397],[51.773,9.43],[51.751,9.474],[51.696,9.463],[51.674,9.584],[51.718,9.727],[51.784,9.771],[51.806,9.826],[51.674,9.925],[51.718,10.123],[51.663,10.211],[51.626,10.08],[51.657,9.987],[51.616,9.956],[51.565,9.987],[51.637,9.915],[51.616,9.864],[51.554,9.854],[51.554,9.823]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[51.489,10.47],[51.554,10.491],[51.564,10.598],[51.618,10.691],[51.611,10.832],[51.651,10.872],[51.631,10.953],[51.584,10.973],[51.517,10.872],[51.47,10.879],[51.444,10.765],[51.504,10.537],[51.477,10.51],[51.489,10.47]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[51.598,9.351],[51.644,9.472],[51.623,9.725],[51.56,9.784],[51.554,9.854],[51.616,9.864],[51.637,9.915],[51.565,9.987],[51.616,9.956],[51.657,10.018],[51.626,10.08],[51.637,10.151],[51.606,10.131],[51.564,10.202],[51.527,10.196],[51.512,10.152],[51.472,10.162],[51.452,10.1],[51.483,10.09],[51.442,9.977],[51.401,9.977],[51.339,9.792],[51.31,9.574],[51.239,9.594],[51.259,9.472],[51.351,9.503],[51.382,9.451],[51.555,9.411],[51.515,9.38],[51.598,9.351]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[51.557,11.059],[51.58,11.126],[51.747,11.067],[51.803,11.167],[51.777,11.182],[51.796,11.256],[51.762,11.282],[51.77,11.39],[51.833,11.416],[51.829,11.498],[51.918,11.588],[51.918,11.677],[52.075,11.833],[52.086,11.993],[52.026,11.982],[51.971,12.016],[51.985,12.09],[51.896,12.123],[51.892,12.164],[51.744,12.094],[51.74,11.986],[51.628,11.986],[51.621,11.963],[51.595,11.997],[51.636,11.867],[51.617,11.885],[51.565,11.803],[51.587,11.692],[51.565,11.662],[51.61,11.625],[51.658,11.245],[51.602,11.171],[51.546,11.178],[51.517,11.134],[51.557,11.059]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[53.884,10.894],[53.898,10.96],[53.817,11.014],[53.733,11.014],[53.691,11.081],[53.641,11.039],[53.674,10.997],[53.658,10.98],[53.499,11.005],[53.423,10.972],[53.432,10.913],[53.373,10.905],[53.289,10.754],[53.155,10.905],[53.222,10.888],[53.239,10.938],[52.971,11.081],[52.887,11.181],[52.812,11.148],[52.82,11.114],[52.753,11.114],[52.762,11.064],[52.711,10.98],[52.778,10.922],[52.762,10.896],[52.82,10.704],[52.77,10.687],[52.804,10.553],[52.737,10.528],[52.46,10.536],[52.443,10.57],[52.443,10.528],[52.351,10.503],[52.243,10.578],[52.176,10.578],[52.167,10.553],[52.092,10.578],[52.008,10.528],[51.824,10.486],[51.857,10.453],[51.824,10.369],[51.799,10.377],[51.774,10.335],[51.807,10.344],[51.857,10.26],[51.765,10.193],[51.663,10.211],[51.718,10.123],[51.674,9.925],[51.806,9.826],[51.784,9.771],[51.718,9.727],[51.674,9.584],[51.696,9.463],[51.751,9.474],[51.773,9.43],[51.729,9.397],[51.74,9.298],[51.905,9.287],[51.883,9.243],[51.806,9.243],[51.79,9.12],[51.688,9.048],[51.729,8.987],[51.708,8.946],[51.996,8.936],[52.057,8.833],[52.221,8.864],[52.273,8.833],[52.355,8.905],[52.386,8.859],[52.355,8.684],[52.447,8.694],[52.488,8.643],[52.447,8.417],[52.375,8.407],[52.314,8.469],[52.119,8.417],[52.15,8.376],[52.098,8.315],[52.129,8.243],[52.057,8.181],[52.026,8.079],[52.037,7.904],[52.088,7.874],[52.088,7.802],[52.139,7.802],[52.139,7.874],[52.211,7.915],[52.232,7.843],[52.345,7.863],[52.447,7.792],[52.416,7.73],[52.447,7.648],[52.488,7.638],[52.488,7.525],[52.386,7.514],[52.221,7.217],[52.273,7.068],[52.366,7.069],[52.443,6.997],[52.416,6.912],[52.476,6.714],[52.64,6.778],[52.624,7.035],[52.804,7.073],[52.967,7.228],[53.164,7.16],[53.23,7.19],[53.317,6.981],[53.51,7.037],[53.592,7.166],[53.634,7.875],[53.447,7.906],[53.396,7.854],[53.344,7.947],[53.282,7.947],[53.271,7.865],[53.147,7.772],[53.158,7.699],[53.002,7.689],[52.951,7.782],[52.837,7.813],[52.816,7.699],[52.775,7.678],[52.775,7.71],[52.733,7.72],[52.723,7.658],[52.63,7.689],[52.671,7.885],[52.63,7.896],[52.63,7.937],[52.547,8.02],[52.444,7.999],[52.371,8.237],[52.392,8.32],[52.671,8.341],[52.667,8.269],[52.853,8.212],[52.824,8.269],[52.938,8.255],[53.024,8.141],[53.038,8.241],[52.981,8.369],[53.053,8.327],[53.013,8.641],[53.085,8.744],[53.168,8.62],[53.158,8.558],[53.261,8.423],[53.333,8.434],[53.333,8.465],[53.375,8.475],[53.396,8.434],[53.416,8.454],[53.385,8.506],[53.478,8.537],[53.449,8.502],[53.612,8.429],[53.761,8.516],[53.745,8.562],[53.793,8.586],[53.75,8.848],[53.79,9.125],[53.571,9.376],[53.455,10.023],[53.484,10.052],[53.476,10.117],[53.513,10.074],[53.513,10.008],[53.6,9.943],[53.658,10.074],[53.593,10.125],[53.614,10.357],[53.76,10.357],[53.885,10.577],[53.776,10.558],[53.611,10.723],[53.724,10.817],[53.724,10.869],[53.884,10.894]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[50.009,12.214],[49.889,12.484],[49.706,12.448],[49.668,12.52],[49.563,12.536],[49.366,12.861],[49.398,12.945],[49.166,13.203],[49.09,13.397],[48.999,13.48],[49.037,13.578],[48.956,13.652],[48.94,13.745],[48.655,13.947],[48.538,13.64],[48.606,13.444],[48.594,13.384],[48.442,13.367],[48.365,13.294],[48.232,12.858],[48.129,12.694],[47.873,12.936],[47.74,12.848],[47.734,12.998],[47.662,13.023],[47.508,12.979],[47.483,12.942],[47.564,12.744],[47.638,12.765],[47.69,12.7],[47.662,12.446],[47.724,12.358],[47.709,12.163],[47.628,12.122],[47.613,11.56],[47.536,11.503],[47.53,11.36],[47.471,11.34],[47.424,11.17],[47.415,10.903],[47.545,10.835],[48.787,10.92],[48.776,10.817],[48.661,10.6],[48.833,10.531],[48.798,10.646],[48.833,10.897],[48.981,10.874],[48.97,11.103],[48.89,11.297],[48.878,11.446],[49.039,11.652],[49.29,11.64],[49.336,11.572],[49.37,11.652],[49.759,11.686],[49.793,11.96],[49.85,11.972],[49.885,11.938],[49.885,11.88],[49.965,11.892],[49.903,12.103],[50.009,12.214]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[53.938,11.151],[53.857,11.202],[53.859,11.408],[54.035,11.565],[54.097,12.041],[54.255,12.463],[54.089,12.706],[54.025,12.9],[53.944,12.852],[53.928,12.9],[53.701,12.771],[53.685,12.884],[53.782,13.143],[53.669,13.175],[53.621,13.11],[53.572,13.11],[53.621,13.207],[53.572,13.256],[53.701,13.401],[53.701,13.482],[53.637,13.531],[53.669,13.612],[53.604,13.806],[53.475,13.773],[53.427,13.692],[53.427,13.757],[53.281,13.725],[53.281,13.612],[53.087,13.531],[53.119,13.498],[53.006,13.418],[53.022,13.272],[52.958,13.191],[52.99,13.062],[52.926,13.062],[52.877,13.143],[52.78,13.143],[52.796,13.191],[52.651,13.304],[52.618,13.256],[52.667,13.094],[52.748,13.03],[52.78,13.094],[52.829,13.078],[52.861,12.933],[52.909,12.933],[52.942,12.836],[52.893,12.787],[53.071,12.351],[53.055,12.302],[53.2,12.092],[53.2,11.963],[53.249,11.914],[53.216,11.882],[53.249,11.866],[53.216,11.817],[53.346,11.753],[53.136,11.72],[53.152,11.639],[53.087,11.462],[53.152,11.397],[53.152,11.349],[53.103,11.316],[52.971,11.081],[53.239,10.938],[53.222,10.888],[53.155,10.905],[53.289,10.754],[53.373,10.905],[53.432,10.913],[53.423,10.972],[53.499,11.005],[53.658,10.98],[53.674,10.997],[53.641,11.039],[53.691,11.081],[53.733,11.014],[53.817,11.014],[53.898,10.96],[53.938,11.151]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[51.517,11.134],[51.546,11.178],[51.602,11.171],[51.658,11.245],[51.651,11.39],[51.613,11.442],[51.457,11.521],[51.307,11.538],[51.307,11.421],[51.374,11.421],[51.357,11.287],[51.257,11.254],[51.274,11.204],[51.407,11.137],[51.407,11.087],[51.441,11.07],[51.517,11.134]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[51.43,10.255],[51.479,10.234],[51.519,10.288],[51.477,10.51],[51.264,10.519],[51.236,10.427],[51.43,10.255]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[51.677,10.518],[51.65,10.475],[51.677,10.454],[51.655,10.416],[51.612,10.427],[51.591,10.389],[51.612,10.352],[51.575,10.325],[51.58,10.234],[51.612,10.218],[51.606,10.131],[51.663,10.211],[51.765,10.193],[51.857,10.26],[51.807,10.344],[51.774,10.335],[51.799,10.377],[51.824,10.369],[51.857,10.453],[51.824,10.486],[52.008,10.528],[52.092,10.578],[51.884,10.843],[51.728,10.665],[51.76,10.654],[51.749,10.589],[51.717,10.589],[51.722,10.535],[51.677,10.518]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[50.262,12.084],[50.327,11.842],[50.373,11.827],[50.398,11.765],[50.448,11.865],[50.423,11.865],[50.423,11.927],[50.486,11.94],[50.435,12.04],[50.486,12.115],[50.548,12.027],[50.556,11.771],[50.355,11.621],[50.456,11.454],[50.756,11.705],[50.856,11.938],[50.823,12.122],[50.773,12.202],[50.773,12.315],[50.811,12.377],[50.886,12.352],[50.898,12.24],[50.948,12.24],[51.023,12.065],[50.993,11.761],[51.026,11.694],[50.982,11.604],[51.049,11.56],[51.071,11.593],[51.116,11.571],[51.172,11.616],[51.194,11.593],[51.149,11.56],[51.172,11.515],[51.071,11.381],[51.138,11.359],[51.127,11.325],[51.216,11.303],[51.228,11.202],[51.194,11.18],[51.149,10.945],[51.16,10.8],[51.116,10.789],[51.127,10.755],[51.06,10.599],[51.082,10.543],[50.993,10.498],[51.049,10.442],[51.207,10.452],[51.219,10.545],[51.17,10.559],[51.157,10.639],[51.236,10.643],[51.257,10.736],[51.307,10.72],[51.357,10.636],[51.467,10.676],[51.444,10.765],[51.47,10.879],[51.517,10.872],[51.584,10.973],[51.517,11.134],[51.441,11.07],[51.407,11.087],[51.407,11.137],[51.274,11.204],[51.257,11.254],[51.357,11.287],[51.374,11.421],[51.307,11.421],[51.307,11.538],[51.457,11.521],[51.613,11.442],[51.61,11.625],[51.565,11.662],[51.587,11.692],[51.565,11.803],[51.617,11.885],[51.636,11.867],[51.595,11.997],[51.621,11.963],[51.628,11.986],[51.74,11.986],[51.744,12.094],[51.892,12.164],[51.896,12.123],[51.985,12.09],[51.971,12.016],[52.026,11.982],[52.086,11.993],[52.06,11.852],[52.154,11.815],[52.138,11.94],[52.203,12.107],[52.187,12.139],[52.138,12.107],[52.073,12.185],[52.063,12.363],[52.095,12.579],[52.046,13.141],[52.241,13.106],[52.252,13.398],[52.052,13.387],[52.111,13.603],[52.063,13.8],[52.148,13.86],[52.148,14.011],[52.325,14.054],[52.274,14.138],[52.333,14.324],[52.274,14.324],[52.274,14.551],[51.962,14.509],[51.886,14.526],[51.985,15.2],[51.789,15.174],[51.761,14.867],[51.594,14.867],[51.622,15.258],[51.287,15.342],[51.023,15.267],[51.056,15.009],[51.018,14.981],[50.985,15.008],[50.917,14.997],[50.917,14.829],[50.865,14.765],[50.898,14.61],[51.023,14.596],[51.077,14.458],[51.045,14.262],[50.947,14.389],[50.865,14.146],[50.844,13.911],[50.767,13.855],[50.757,13.524],[50.659,13.473],[50.691,13.394],[50.664,13.233],[50.561,13.189],[50.556,13.018],[50.474,12.982],[50.474,12.784],[50.384,12.594],[50.398,12.462],[50.24,12.202],[50.192,12.177],[50.242,12.152],[50.262,12.084]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[51.477,10.51],[51.504,10.537],[51.467,10.676],[51.357,10.636],[51.307,10.72],[51.257,10.736],[51.236,10.643],[51.157,10.639],[51.17,10.559],[51.219,10.545],[51.207,10.452],[51.236,10.427],[51.264,10.519],[51.477,10.51]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[46.797,6.672],[46.963,6.986],[47.248,7.4],[47.432,7.606],[47.464,7.429],[47.59,7.598],[47.602,7.7],[47.563,7.64],[47.534,7.691],[47.621,8.217],[47.596,8.584],[47.672,8.609],[47.674,8.407],[47.808,8.572],[47.644,8.895],[47.665,9.145],[47.571,9.382],[47.482,9.482],[47.5,9.562],[47.383,9.672],[47.266,9.53],[47.057,9.473],[47.02,9.88],[46.938,9.876],[46.844,10.104],[47.001,10.39],[46.938,10.49],[46.688,10.379],[46.621,10.491],[46.546,10.468],[46.554,10.293],[46.638,10.236],[46.546,10.044],[46.447,10.04],[46.41,10.166],[46.229,10.129],[46.234,10.039],[46.381,9.953],[46.305,9.548],[46.379,9.46],[46.511,9.46],[46.499,9.283],[46.239,9.249],[46.041,9.009],[45.975,8.989],[45.905,9.088],[45.824,9.029],[45.835,8.911],[45.956,8.897],[45.993,8.785],[46.079,8.851],[46.125,8.613],[46.251,8.443],[46.466,8.437],[46.268,8.089],[46.146,8.154],[45.921,7.873],[45.991,7.577],[45.861,7.196],[45.924,7.049],[46.054,6.876],[46.125,6.903],[46.137,6.804],[46.292,6.864],[46.362,6.776],[46.394,6.809],[46.41,6.935],[46.469,6.836],[46.516,6.511],[46.423,6.291],[46.265,6.163],[46.286,6.102],[46.368,6.175],[46.417,6.069],[46.546,6.163],[46.576,6.108],[46.775,6.456],[46.805,6.452],[46.797,6.672]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[46.282,10.011],[46.234,10.039],[46.229,10.129],[46.41,10.166],[46.447,10.04],[46.546,10.044],[46.638,10.236],[46.554,10.293],[46.546,10.468],[46.621,10.491],[46.688,10.379],[46.826,10.454],[46.718,10.558],[46.313,10.558],[46.212,10.457],[45.739,10.525],[45.807,10.66],[45.469,10.642],[45.353,10.675],[45.353,10.824],[45.051,10.856],[45.021,10.293],[45.22,9.662],[45.121,9.131],[45.17,8.815],[45.287,8.583],[45.519,8.45],[45.768,8.467],[46.001,8.55],[46.117,8.637],[46.124,8.617],[46.079,8.851],[45.993,8.785],[45.956,8.897],[45.835,8.911],[45.824,9.029],[45.905,9.088],[45.975,8.989],[46.041,9.009],[46.239,9.249],[46.499,9.283],[46.511,9.46],[46.379,9.46],[46.305,9.548],[46.381,9.953],[46.282,10.011]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[47.736,8.483],[47.674,8.407],[47.672,8.609],[47.596,8.584],[47.621,8.217],[47.534,7.691],[47.563,7.64],[47.602,7.7],[47.579,7.583],[47.604,7.507],[47.709,7.446],[48.024,7.543],[48.058,7.502],[48.191,7.536],[48.359,7.681],[48.616,7.729],[49.294,8.483],[49.553,8.31],[49.524,8.512],[49.38,8.599],[49.553,8.656],[49.553,8.721],[49.398,8.742],[49.356,8.804],[49.335,8.971],[49.273,8.908],[49.273,9.075],[49.377,9.075],[49.398,9.159],[49.523,9.221],[49.523,9.325],[49.627,9.305],[49.669,9.409],[49.648,9.596],[49.607,9.596],[49.586,9.638],[49.273,9.638],[49.21,9.471],[49.095,9.428],[49.063,9.261],[48.775,8.887],[48.717,8.858],[48.833,8.743],[48.487,8.368],[48.458,8.022],[47.911,8.397],[48.112,8.512],[47.779,8.635],[47.808,8.572],[47.736,8.483]],
      },
      {
        label: 'French Satellite States (1812)',
        color: '#9fd39f',
        fillOpacity: 0.45,
        coords: [[50.993,10.498],[51.082,10.543],[51.06,10.599],[51.127,10.755],[51.116,10.789],[51.16,10.8],[51.149,10.945],[51.194,11.18],[51.228,11.202],[51.216,11.303],[51.127,11.325],[51.138,11.359],[51.071,11.403],[51.172,11.515],[51.149,11.56],[51.194,11.593],[51.172,11.616],[51.116,11.571],[51.071,11.593],[51.049,11.56],[50.982,11.604],[51.026,11.694],[50.993,11.761],[51.023,12.065],[50.948,12.24],[50.898,12.24],[50.886,12.352],[50.811,12.377],[50.773,12.315],[50.773,12.202],[50.823,12.122],[50.856,11.938],[50.756,11.705],[50.456,11.454],[50.355,11.621],[50.556,11.771],[50.548,12.027],[50.486,12.115],[50.435,12.04],[50.486,11.94],[50.423,11.927],[50.423,11.865],[50.448,11.865],[50.398,11.765],[50.373,11.827],[50.327,11.842],[50.262,12.084],[50.152,12.085],[50.152,12.128],[50.009,12.214],[49.903,12.103],[49.965,11.892],[49.885,11.88],[49.885,11.938],[49.85,11.972],[49.793,11.96],[49.759,11.686],[49.37,11.652],[49.336,11.572],[49.29,11.64],[49.039,11.652],[48.878,11.446],[48.89,11.297],[48.97,11.103],[48.981,10.874],[48.833,10.897],[48.798,10.646],[48.833,10.531],[48.661,10.6],[48.776,10.817],[48.787,10.92],[47.545,10.835],[47.585,10.613],[47.56,10.495],[47.579,10.388],[47.455,10.403],[47.301,10.2],[47.301,10.103],[47.389,10.138],[47.406,10.021],[47.48,10.026],[47.502,9.938],[47.564,9.892],[47.567,9.78],[47.616,9.737],[47.556,9.653],[47.649,9.464],[47.709,9.638],[48.293,9.576],[48.355,9.722],[48.627,9.722],[48.772,9.659],[48.877,9.659],[48.96,9.763],[49.169,9.805],[49.315,9.805],[49.294,9.638],[49.586,9.638],[49.607,9.596],[49.648,9.596],[49.669,9.409],[49.627,9.305],[49.523,9.325],[49.523,9.221],[49.398,9.159],[49.377,9.075],[49.273,9.075],[49.273,8.908],[49.335,8.971],[49.356,8.804],[49.398,8.742],[49.553,8.721],[49.553,8.656],[49.38,8.599],[49.524,8.512],[49.553,8.31],[49.294,8.483],[48.978,8.158],[49.065,7.886],[49.059,7.67],[49.099,7.465],[49.183,7.423],[49.137,6.975],[49.426,6.884],[49.426,7.022],[49.542,7.068],[49.657,6.999],[49.98,7.553],[49.98,7.645],[50.141,7.737],[50.344,7.663],[50.354,7.745],[50.446,7.715],[50.467,7.663],[50.518,7.674],[50.508,7.704],[50.549,7.725],[50.58,7.704],[50.662,7.735],[50.703,7.786],[50.641,7.899],[50.6,7.92],[50.641,7.971],[50.59,8.002],[50.6,8.043],[50.703,8.022],[50.836,8.125],[50.797,8.169],[50.959,8.34],[51.011,8.34],[51.041,8.423],[51.011,8.464],[51.079,8.535],[51.021,8.633],[51.103,8.705],[51.082,8.735],[51.031,8.705],[50.816,8.756],[50.929,8.807],[50.908,8.848],[51,8.91],[51.093,8.838],[51.124,8.869],[51.257,8.864],[51.318,8.987],[51.38,8.977],[51.493,9.202],[51.534,9.213],[51.544,9.161],[51.598,9.351],[51.515,9.38],[51.555,9.411],[51.382,9.451],[51.351,9.503],[51.259,9.472],[51.239,9.594],[51.31,9.574],[51.339,9.792],[51.401,9.977],[51.442,9.977],[51.483,10.09],[51.452,10.1],[51.472,10.162],[51.43,10.255],[51.207,10.452],[51.049,10.442],[50.993,10.498]],
      },
    ],
    routes: [
      {
        name: "Napoleon's Russian Campaign (1812)",
        nameI18n: { es: 'Campaña Rusa de Napoleón (1812)', ru: 'Русский поход Наполеона (1812)', mk: 'Руската кампања на Наполеон (1812)' , de: 'Napoleons Russlandfeldzug (1812)', fr: 'Campagne de Russie de Napoléon (1812)'},
        type: 'military',
        color: '#ef4444',
        points: [[52,20],[53,24],[54,28],[54,32],[54,36],[55,37.6],[55.75,37.6],[54,36],[52,32],[51,28],[52,24],[52,20]],
      },
    ],
    markers: [
      { name: 'Paris', type: 'capital', lat: 48.85, lng: 2.35, note: 'Revolution epicentre - Bastille stormed 14 July 1789', year: 1789 },
      { name: 'Versailles', type: 'landmark', lat: 48.8, lng: 2.12, note: 'Palace stormed - King Louis XVI arrested, then guillotined', year: 1789 },
      { name: 'Battle of Valmy', type: 'battle', lat: 49.07, lng: 4.78, note: 'French citizen army stops Prussians - saves the Revolution (1792)', year: 1792 },
      { name: 'Battle of Waterloo', type: 'battle', lat: 50.68, lng: 4.41, note: 'Napoleon\'s final defeat - exiled to St. Helena (1815)', year: 1815 },
      { name: 'Battle of Austerlitz', type: 'battle', lat: 49.13, lng: 16.76, note: 'Napoleon\'s greatest victory - three emperors at war (1805)', year: 1805 },
      { name: 'Battle of Trafalgar', type: 'battle', lat: 36.16, lng: -6.02, note: 'Nelson defeats Napoleon\'s navy - Britain rules the seas (1805)', year: 1805 },
      { name: 'Moscow', type: 'city', lat: 55.76, lng: 37.6, note: 'Napoleon enters burning Moscow - catastrophic retreat begins', year: 1812 },
      { name: 'Vienna (Congress)', type: 'city', lat: 48.2, lng: 16.37, note: 'Congress of Vienna (1814–15) - redraws Europe after Napoleon', year: 1814 },
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
    titleI18n: { de: 'Die Industrielle Revolution', fr: 'La révolution industrielle', es: 'Revolución industrial', ru: 'Промышленная революция', mk: 'Индустриска револуција' },
    description: 'Britain led the world\'s first Industrial Revolution - steam power, railways, textile mills, and urbanisation transformed society from agrarian to industrial by 1850, then spread to Europe and America.',
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
        nameI18n: { es: 'Red Ferroviaria Británica', ru: 'Британская железнодорожная сеть', mk: 'Британска железничка мрежа', de: 'Britisches Eisenbahnnetz', fr: 'Réseau ferroviaire britannique' },
        type: 'trade',
        color: '#f59e0b',
        points: [[51.5,-0.12],[52.0,-2.18],[53.4,-2.2],[53.8,-1.54],[53.4,-3.0],[54.6,-1.1],[55.8,-3.2],[56.1,-3.9]],
      },
    ],
    markers: [
      { name: 'Manchester', type: 'city', lat: 53.48, lng: -2.24, note: 'Textile mills - "Cottonopolis" - industrial centre of Britain', year: 1800 },
      { name: 'Birmingham', type: 'city', lat: 52.48, lng: -1.9, note: 'Ironworks and engineering - Watt\'s steam engine improved here', year: 1780 },
      { name: 'Sheffield', type: 'city', lat: 53.38, lng: -1.47, note: 'Steel production capital - "Steel City"', year: 1850 },
      { name: 'Liverpool', type: 'port', lat: 53.41, lng: -2.99, note: 'Atlantic trade port - cotton in, manufactured goods out', year: 1800 },
      { name: 'London', type: 'capital', lat: 51.51, lng: -0.12, note: 'Financial centre - Bank of England funded industrial expansion', year: 1760 },
      { name: 'Glasgow', type: 'city', lat: 55.86, lng: -4.25, note: 'Clyde shipbuilding - engineering powerhouse of Scotland', year: 1800 },
      { name: 'Ironbridge', type: 'landmark', lat: 52.63, lng: -2.49, note: 'First iron bridge (1779) - symbol of Industrial Revolution', year: 1779 },
      { name: 'Ruhr Valley', type: 'resource', lat: 51.5, lng: 7.2, note: 'German coal and steel heartland - industrial rival to Britain', year: 1850 },
      { name: 'Essen (Krupp)', type: 'resource', lat: 51.45, lng: 7.01, note: 'Krupp steelworks - backbone of German industrial power', year: 1870 },
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
    titleI18n: { de: 'Der Erste Weltkrieg', fr: 'La Première Guerre mondiale', es: 'Primera Guerra Mundial', ru: 'Первая мировая война', mk: 'Прва светска војна' },
    description: 'The Great War killed 20 million people - trench warfare on the Western Front, collapse of four empires, and the redrawing of Europe\'s map at Versailles (1919).',
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
        nameI18n: { es: 'Frente Occidental (1914–18)', ru: 'Западный фронт (1914–18)', mk: 'Западен фронт (1914–18)', de: 'Westfront (1914–18)', fr: 'Front de l’Ouest (1914–18)' },
        type: 'military',
        color: '#ef4444',
        points: [[51,3],[50.5,4],[50.5,6],[50.3,7],[49.8,7],[49.3,7],[48.8,7],[47.7,7.3]],
      },
      {
        name: 'Eastern Front (1914–18)',
        nameI18n: { es: 'Frente Oriental (1914–18)', ru: 'Восточный фронт (1914–18)', mk: 'Источен фронт (1914–18)', de: 'Ostfront (1914–18)', fr: 'Front de l’Est (1914–18)' },
        type: 'military',
        color: '#8b5cf6',
        points: [[57,24],[55,26],[52,24],[50,24],[48,24],[47,22],[45,28],[43,28]],
      },
    ],
    markers: [
      { name: 'Sarajevo', type: 'battle', lat: 43.85, lng: 18.37, note: 'Assassination of Archduke Franz Ferdinand - war trigger (1914)', year: 1914 },
      { name: 'Battle of the Marne', type: 'battle', lat: 49.03, lng: 3.51, note: 'Germany halted - trench warfare begins (1914)', year: 1914 },
      { name: 'Battle of Verdun', type: 'battle', lat: 49.16, lng: 5.38, note: '700,000 casualties - longest battle of WWI (1916)', year: 1916 },
      { name: 'Battle of the Somme', type: 'battle', lat: 50.0, lng: 2.6, note: '60,000 British dead on first day - tanks first used (1916)', year: 1916 },
      { name: 'Gallipoli', type: 'battle', lat: 40.38, lng: 26.68, note: 'Allied disaster vs Ottomans - Churchill\'s plan fails (1915)', year: 1915 },
      { name: 'Paris', type: 'capital', lat: 48.85, lng: 2.35, note: 'Allied capital - nearly fell in 1914 and 1918', year: 1914 },
      { name: 'Berlin', type: 'capital', lat: 52.52, lng: 13.4, note: 'German capital - surrendered November 11, 1918', year: 1914 },
      { name: 'Versailles', type: 'landmark', lat: 48.8, lng: 2.12, note: 'Treaty of Versailles (1919) - redraws European map', year: 1919 },
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
    titleI18n: { de: 'Der Zweite Weltkrieg', fr: 'La Seconde Guerre mondiale', es: 'Segunda Guerra Mundial', ru: 'Вторая мировая война', mk: 'Втора светска војна' },
    description: 'The deadliest conflict in history - 70–85 million killed, the Holocaust, atomic bombs on Japan, and the post-war world order with the UN, NATO, and Cold War.',
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
        nameI18n: { es: 'Avance Aliado en el Día D', ru: 'Союзное наступление в День Д', mk: 'Сојузничкото напредување на D-Day', de: 'Alliierter Vormarsch nach dem D-Day', fr: 'Avancée alliée après le Jour J' },
        type: 'military',
        color: '#3b82f6',
        points: [[51,0],[49.4,-0.5],[49,1],[49,3],[50,4],[51,3],[52,6],[52,10],[53,13],[52,14],[50,18]],
      },
      {
        name: 'Operation Barbarossa',
        nameI18n: { es: 'Operación Barbarroja', ru: 'Операция «Барбаросса»', mk: 'Операција Барбароса', de: 'Unternehmen Barbarossa', fr: 'Opération Barbarossa' },
        type: 'military',
        color: '#ef4444',
        points: [[54,22],[54,28],[54,32],[55,37],[56,34],[52,34],[50,34],[48,36],[47,38]],
      },
    ],
    markers: [
      { name: 'Berlin', type: 'capital', lat: 52.52, lng: 13.4, note: 'Nazi Germany capital - fell May 2, 1945 to Soviet forces', year: 1939 },
      { name: 'D-Day (Normandy)', type: 'battle', lat: 49.4, lng: -0.5, note: 'Largest seaborne invasion in history - June 6, 1944', year: 1944 },
      { name: 'Stalingrad', type: 'battle', lat: 48.7, lng: 44.5, note: 'Turning point on Eastern Front - 2 million casualties (1942–43)', year: 1942 },
      { name: 'Battle of Britain', type: 'battle', lat: 51.5, lng: -0.12, note: 'RAF defeats Luftwaffe - Hitler abandons invasion of Britain (1940)', year: 1940 },
      { name: 'Pearl Harbor', type: 'battle', lat: 21.35, lng: -157.98, note: 'Japanese attack brings USA into the war (Dec 7, 1941)', year: 1941 },
      { name: 'Hiroshima', type: 'city', lat: 34.39, lng: 132.45, note: 'First atomic bomb dropped - 70,000 killed instantly (Aug 6, 1945)', year: 1945 },
      { name: 'Auschwitz', type: 'landmark', lat: 50.03, lng: 19.18, note: 'Largest Nazi death camp - 1.1 million killed', year: 1940 },
      { name: 'Moscow', type: 'city', lat: 55.76, lng: 37.6, note: 'German advance stopped at Moscow - Operation Typhoon fails (1941)', year: 1941 },
      { name: 'El Alamein', type: 'battle', lat: 30.84, lng: 28.95, note: 'Montgomery defeats Rommel - Germany exits North Africa (1942)', year: 1942 },
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
    titleI18n: { de: 'Der Kalte Krieg', fr: 'La guerre froide', es: 'Guerra Fría', ru: 'Холодная война', mk: 'Студена војна' },
    description: 'The USA and USSR divided the world into competing blocs - NATO vs Warsaw Pact - in a nuclear standoff that shaped politics, culture, and technology until the USSR\'s collapse in 1991.',
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
        nameI18n: { es: 'Ruta del Puente Aéreo de Berlín (1948–49)', ru: 'Маршрут Берлинского воздушного моста (1948–49)', mk: 'Берлинскиот воздушен мост (1948–49)', de: 'Route der Berliner Luftbrücke (1948–49)', fr: 'Route du pont aérien de Berlin (1948–49)' },
        type: 'military',
        color: '#3b82f6',
        points: [[53.5,9.9],[52.37,13.1]],
      },
    ],
    markers: [
      { name: 'Berlin Wall', type: 'landmark', lat: 52.52, lng: 13.4, note: 'Divided city 1961–1989 - most potent symbol of Iron Curtain', year: 1961 },
      { name: 'Washington D.C.', type: 'capital', lat: 38.9, lng: -77.04, note: 'US capital - NATO alliance leader', year: 1947 },
      { name: 'Moscow', type: 'capital', lat: 55.76, lng: 37.6, note: 'Soviet capital - Kremlin and Warsaw Pact leader', year: 1947 },
      { name: 'Cuba (Missile Crisis)', type: 'battle', lat: 21.5, lng: -79.5, note: 'Soviet missiles discovered - 13 days to nuclear war (1962)', year: 1962 },
      { name: 'Korean 38th Parallel', type: 'battle', lat: 38.0, lng: 127.0, note: 'Korean War (1950–53) - first hot war of Cold War era', year: 1950 },
      { name: 'Saigon (Ho Chi Minh City)', type: 'battle', lat: 10.8, lng: 106.66, note: 'Vietnam War - US defeat and withdrawal (1975)', year: 1965 },
      { name: 'Checkpoint Charlie', type: 'landmark', lat: 52.51, lng: 13.39, note: 'Famous Berlin crossing point between East and West', year: 1961 },
      { name: 'Kabul', type: 'battle', lat: 34.53, lng: 69.17, note: 'Soviet-Afghan War (1979–89) - USSR\'s Vietnam', year: 1979 },
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
    titleI18n: { de: 'Die Jugoslawienkriege', fr: 'Les guerres de Yougoslavie', es: 'Guerras yugoslavas', ru: 'Югославские войны', mk: 'Југословенски војни' },
    description: 'The dissolution of Yugoslavia produced the bloodiest conflict in Europe since WWII - ethnic cleansing, siege of Sarajevo, NATO intervention, and the emergence of seven new nations.',
    polygons: [
      {
        label: 'Former Yugoslavia',
        color: '#ef4444',
        fillOpacity: 0.2,
        coords: [[46,13],[47,16],[46,18],[44,18],[44,20],[46,22],[46,24],[44,22],[43,22],[42,22],[42,20],[40,18],[40,22],[42,22],[43,20],[44,20],[46,24],[46,22],[44,22],[44,18],[46,18],[47,16],[46,13]],
      },
    ],
    markers: [
      { name: 'Sarajevo', type: 'battle', lat: 43.85, lng: 18.37, note: 'Longest siege of a capital in modern warfare (1992–96) - 11,000 killed', year: 1992 },
      { name: 'Srebrenica', type: 'battle', lat: 44.1, lng: 19.3, note: 'Genocide of 8,000 Bosniak men - worst massacre in Europe since WWII (1995)', year: 1995 },
      { name: 'Belgrade', type: 'capital', lat: 44.82, lng: 20.46, note: 'Serbian capital - NATO bombed to stop Kosovo War (1999)', year: 1991 },
      { name: 'Vukovar', type: 'battle', lat: 45.35, lng: 18.99, note: 'Croatian city destroyed by Yugoslav army - 1991', year: 1991 },
      { name: 'Prishtina (Kosovo)', type: 'city', lat: 42.67, lng: 21.17, note: 'Kosovo War - NATO forces Kosovo independence (1999)', year: 1999 },
      { name: 'Zagreb', type: 'capital', lat: 45.81, lng: 15.98, note: 'Croatian capital - declared independence June 25, 1991', year: 1991 },
      { name: 'Ljubljana', type: 'capital', lat: 46.05, lng: 14.51, note: 'Slovenian capital - first to break away, Ten-Day War (1991)', year: 1991 },
      { name: 'Dayton (Ohio)', type: 'landmark', lat: 39.76, lng: -84.19, note: 'Dayton Agreement (1995) - ended Bosnian War', year: 1995 },
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
    titleI18n: { de: 'Der Makedonische Kampf', fr: 'La lutte macédonienne', es: 'La lucha macedonia', ru: 'Македонская борьба', mk: 'Македонската борба' },
    description: 'Following Ottoman decline, the Macedonian Question - Bulgarian, Greek, and Serbian claims - erupted in guerrilla war, the Ilinden Uprising (1903), and the Balkan Wars (1912–13).',
    polygons: [
      {
        label: 'Macedonia (Ottoman Vilayet)',
        color: '#8b5cf6',
        fillOpacity: 0.3,
        coords: [[42.5,20],[43,22],[43,26],[41,26],[40,26],[40,22],[40,20],[41,19],[42,19],[42.5,20]],
      },
    ],
    markers: [
      { name: 'Bitola (Monastir)', type: 'capital', lat: 41.03, lng: 21.33, note: 'Ottoman Vilayet capital - major urban centre of Macedonia', year: 1900 },
      { name: 'Skopje (Üsküp)', type: 'capital', lat: 42.0, lng: 21.43, note: 'Regional capital - later capital of Republic of Macedonia', year: 1900 },
      { name: 'Smilevo', type: 'landmark', lat: 41.2, lng: 21.4, note: 'Site of IMRO Congress - Ilinden Uprising planned here (1903)', year: 1903 },
      { name: 'Kruševo', type: 'battle', lat: 41.37, lng: 21.25, note: 'Ilinden Uprising - short-lived Kruševo Republic (August 1903)', year: 1903 },
      { name: 'Thessaloniki (Selanik)', type: 'city', lat: 40.64, lng: 22.94, note: 'Major Ottoman port - birthplace of Atatürk', year: 1900 },
      { name: 'Ohrid', type: 'city', lat: 41.12, lng: 20.8, note: 'Ancient city - Ohrid Archbishopric centre of Slavic literacy', year: 900 },
      { name: 'Battle of Kumanovo', type: 'battle', lat: 42.13, lng: 21.71, note: 'Serbian victory over Ottomans - First Balkan War (1912)', year: 1912 },
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
    titleI18n: { de: 'Die hellenistische Welt', fr: 'Le monde hellénistique', es: 'El mundo helen\u00edstico', ru: '\u042d\u043b\u043b\u0438\u043d\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043c\u0438\u0440', mk: '\u0425\u0435\u043b\u0435\u043d\u0438\u0441\u0442\u0438\u0447\u043a\u0438\u043e\u0442 \u0441\u0432\u0435\u0442' },
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
    titleI18n: { de: 'Das Achämenidische Perserreich', fr: 'L’Empire perse achéménide', es: 'El Imperio aquem\u00e9nida', ru: '\u0414\u0435\u0440\u0436\u0430\u0432\u0430 \u0410\u0445\u0435\u043c\u0435\u043d\u0438\u0434\u043e\u0432', mk: '\u0410\u0445\u0430\u0435\u043c\u0435\u043d\u0438\u0434\u0441\u043a\u0430\u0442\u0430 \u0438\u043c\u043f\u0435\u0440\u0438\u0458\u0430' },
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
    titleI18n: { de: 'Al-Andalus & die Reconquista', fr: 'Al-Andalus et la Reconquista', es: 'Al-\u00c1ndalus y la Reconquista', ru: '\u0410\u043b\u044c-\u0410\u043d\u0434\u0430\u043b\u0443\u0441 \u0438 \u0420\u0435\u043a\u043e\u043d\u043a\u0438\u0441\u0442\u0430', mk: '\u0410\u043b-\u0410\u043d\u0434\u0430\u043b\u0443\u0437 \u0438 \u0420\u0435\u043a\u043e\u043d\u043a\u0438\u0441\u0442\u0430\u0442\u0430' },
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
    titleI18n: { de: 'Der Hundertjährige Krieg', fr: 'La guerre de Cent Ans', es: 'La guerra de los Cien A\u00f1os', ru: '\u0421\u0442\u043e\u043b\u0435\u0442\u043d\u044f\u044f \u0432\u043e\u0439\u043d\u0430', mk: '\u0421\u0442\u043e\u0433\u043e\u0434\u0438\u0448\u043d\u0430\u0442\u0430 \u0432\u043e\u0458\u043d\u0430' },
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
    titleI18n: { de: 'Das Mogulreich', fr: 'L’Empire moghol', es: 'El Imperio mogol', ru: '\u0418\u043c\u043f\u0435\u0440\u0438\u044f \u0412\u0435\u043b\u0438\u043a\u0438\u0445 \u041c\u043e\u0433\u043e\u043b\u043e\u0432', mk: '\u041c\u043e\u0433\u0443\u043b\u0441\u043a\u0430\u0442\u0430 \u0438\u043c\u043f\u0435\u0440\u0438\u0458\u0430' },
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
    titleI18n: { de: 'Das Tokugawa-Japan', fr: 'Le Japon des Tokugawa', es: 'El Jap\u00f3n Tokugawa', ru: '\u042f\u043f\u043e\u043d\u0438\u044f \u0422\u043e\u043a\u0443\u0433\u0430\u0432\u0430', mk: '\u0422\u043e\u043a\u0443\u0433\u0430\u0432\u0430 \u0408\u0430\u043f\u043e\u043d\u0438\u0458\u0430' },
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
    titleI18n: { de: 'Die Russische Revolution & der Bürgerkrieg', fr: 'La révolution russe et la guerre civile', es: 'La Revoluci\u00f3n rusa y la guerra civil', ru: '\u0420\u0435\u0432\u043e\u043b\u044e\u0446\u0438\u044f \u0438 \u0413\u0440\u0430\u0436\u0434\u0430\u043d\u0441\u043a\u0430\u044f \u0432\u043e\u0439\u043d\u0430', mk: '\u0420\u0443\u0441\u043a\u0430\u0442\u0430 \u0440\u0435\u0432\u043e\u043b\u0443\u0446\u0438\u0458\u0430 \u0438 \u0433\u0440\u0430\u0453\u0430\u043d\u0441\u043a\u0430\u0442\u0430 \u0432\u043e\u0458\u043d\u0430' },
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
    titleI18n: { de: 'Britisch-Indien & die Teilung', fr: 'Le Raj britannique et la partition', es: 'El Raj brit\u00e1nico y la Partici\u00f3n', ru: '\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u0418\u043d\u0434\u0438\u044f \u0438 \u0420\u0430\u0437\u0434\u0435\u043b', mk: '\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0430 \u0418\u043d\u0434\u0438\u0458\u0430 \u0438 \u041f\u043e\u0434\u0435\u043b\u0431\u0430\u0442\u0430' },
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
  // CURRICULUM EXPANSION II - world-history territories
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
    title: 'The Olmec - Mother Culture of the Americas',
    titleI18n: { de: 'Die Olmeken - Mutterkultur Amerikas', fr: 'Les Olmèques - culture mère des Amériques', es: 'Los olmecas - la cultura madre de América', ru: 'Ольмеки - материнская культура Америки', mk: 'Олмеките - мајката-култура на Америка' },
    description: 'The Olmec heartland on the Gulf coast of Mexico (Veracruz and Tabasco), where the first Mesoamerican civilization raised colossal stone heads and seeded the traditions the Maya and Aztec would inherit - and the wider sphere its jade, obsidian, and art reached across early Mesoamerica.',
    polygons: [
      {
        // Core heartland - the humid Gulf lowlands of the San Lorenzo and La
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
        // Broader Olmec cultural sphere - where Olmec-style art, jade, and
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
      { name: 'Jade & obsidian exchange', nameI18n: { es: 'Intercambio de jade y obsidiana', ru: 'Обмен нефрита и обсидиана', mk: 'Размена на жад и опсидијан', de: 'Jade- und Obsidianhandel', fr: 'Échange de jade et d’obsidienne' }, type: 'trade', color: '#84cc16', points: [[18.10,-94.03],[17.75,-94.73],[17.55,-96.72],[16.75,-98.60]] },
    ],
    markers: [
      { name: 'San Lorenzo', type: 'capital', lat: 17.75, lng: -94.73, note: 'Earliest great Olmec center - colossal heads carved by ~1200 BCE', year: -1200 },
      { name: 'La Venta', type: 'capital', lat: 18.10, lng: -94.03, note: 'Great clay pyramid and jade offerings (~900 BCE)', year: -900 },
      { name: 'Tres Zapotes', type: 'city', lat: 18.47, lng: -95.44, note: 'Late Olmec center - early Long Count calendar nearby', year: -400 },
      { name: 'Laguna de los Cerros', type: 'city', lat: 18.03, lng: -95.03, note: 'Olmec center near the basalt sources of the Tuxtla Mountains', year: -800 },
      { name: 'Tuxtla Mountains', type: 'resource', lat: 18.55, lng: -95.20, note: 'Basalt source - colossal heads and thrones hauled dozens of km from here', year: -1000 },
      { name: 'Chalcatzingo', type: 'landmark', lat: 18.68, lng: -98.77, note: 'Highland site with Olmec-style rock reliefs - the sphere reaches inland', year: -700 },
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
    titleI18n: { de: 'Das Khmer-Reich & Angkor', fr: 'L’Empire khmer et Angkor', es: 'El Imperio jemer y Angkor', ru: 'Кхмерская империя и Ангкор', mk: 'Кмерската империја и Ангкор' },
    description: 'The Khmer Empire near its greatest extent under Jayavarman VII (c. 1200), reaching into modern Laos, Thailand, and the Malay Peninsula - ruled from Angkor, the largest city of the pre-industrial world, and knit together by a network of royal roads.',
    polygons: [
      {
        // Greatest extent c. 1200 - from the Khorat plateau and southern Laos
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
        // Core royal domain - the Cambodian heartland around Angkor and the
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
      { name: 'Royal road: Angkor to Phimai', nameI18n: { es: 'Calzada real: Angkor a Phimai', ru: 'Царская дорога: Ангкор - Пхимай', mk: 'Кралски пат: Ангкор до Пимаи', de: 'Königsstraße: Angkor nach Phimai', fr: 'Route royale : Angkor à Phimai' }, type: 'military', color: '#2dd4bf', points: [[13.44,103.86],[14.35,102.98],[15.22,102.49]] },
      { name: 'Royal road: Angkor to Vijaya (Champa)', nameI18n: { es: 'Calzada real: Angkor a Vijaya', ru: 'Царская дорога: Ангкор - Виджая', mk: 'Кралски пат: Ангкор до Виџаја', de: 'Königsstraße: Angkor nach Vijaya (Champa)', fr: 'Route royale : Angkor à Vijaya (Champā)' }, type: 'military', color: '#5eead4', points: [[13.44,103.86],[13.90,105.60],[13.95,107.40],[13.90,109.10]] },
    ],
    markers: [
      { name: 'Angkor', type: 'capital', lat: 13.44, lng: 103.86, note: 'Angkor Thom and the Bayon - capital of Jayavarman VII', year: 1181 },
      { name: 'Angkor Wat', type: 'landmark', lat: 13.41, lng: 103.87, note: 'Largest religious monument on Earth (early 12th c.)', year: 1150 },
      { name: 'Hariharalaya', type: 'city', lat: 13.35, lng: 103.97, note: 'Early Khmer capital at Roluos', year: 802 },
      { name: 'Koh Ker', type: 'city', lat: 13.78, lng: 104.54, note: 'Briefly the capital under Jayavarman IV (928–944)', year: 928 },
      { name: 'Preah Vihear', type: 'landmark', lat: 14.39, lng: 104.68, note: 'Cliff-top Shaiva temple on the Dângrêk escarpment', year: 1080 },
      { name: 'Phimai', type: 'landmark', lat: 15.22, lng: 102.49, note: 'Great Khmer temple in the Khorat plateau (now Thailand)', year: 1100 },
      { name: 'Wat Phu', type: 'landmark', lat: 14.85, lng: 105.82, note: 'Mountain temple in southern Laos', year: 1080 },
      { name: 'Sambor Prei Kuk', type: 'landmark', lat: 12.87, lng: 105.06, note: 'Isanapura - pre-Angkorian Chenla capital', year: 620 },
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
    titleI18n: { de: 'Das Songhai-Reich', fr: 'L’Empire songhaï', es: 'El Imperio songhai', ru: 'Империя Сонгай', mk: 'Царството Сонгај' },
    description: 'The largest empire in West African history at its height (c. 1500), spanning the Sahel from the Atlantic to central Niger and controlling the trans-Saharan gold and salt trade from Gao, Timbuktu, and Djenné - its lifeline the great bend of the Niger River.',
    polygons: [
      {
        // Greatest extent c. 1500 - the Sahel band from the Atlantic (Senegal)
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
        // Core Songhai domain - the Niger bend from Djenné through Timbuktu to
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
      { name: 'Trans-Saharan gold & salt road', nameI18n: { es: 'Ruta transahariana del oro y la sal', ru: 'Транссахарский путь золота и соли', mk: 'Транссахарски пат на злато и сол', de: 'Transsaharische Gold- und Salzstraße', fr: 'Route transsaharienne de l’or et du sel' }, type: 'trade', color: '#eab308', points: [[13.91,-4.55],[16.77,-3.01],[20.0,-4.0],[23.6,-5.0]] },
      { name: 'The Niger River artery', nameI18n: { es: 'La arteria del río Níger', ru: 'Артерия реки Нигер', mk: 'Артеријата на реката Нигер', de: 'Die Lebensader des Niger', fr: 'L’artère du fleuve Niger' }, type: 'trade', color: '#38bdf8', points: [[13.91,-4.55],[15.35,-4.28],[16.77,-3.01],[16.27,-0.04],[15.40,0.80]] },
    ],
    markers: [
      { name: 'Gao', type: 'capital', lat: 16.27, lng: -0.04, note: 'Capital on the Niger - seat of Sonni Ali and Askia the Great', year: 1464 },
      { name: 'Timbuktu', type: 'city', lat: 16.77, lng: -3.01, note: 'City of books - University of Sankore and vast libraries', year: 1468 },
      { name: 'Djenné', type: 'city', lat: 13.91, lng: -4.55, note: 'Great mud-brick mosque and river trade hub (taken 1475)', year: 1475 },
      { name: 'Kukiya', type: 'city', lat: 15.40, lng: 0.80, note: 'Early Songhai capital downstream on the Niger', year: 1010 },
      { name: 'Walata', type: 'city', lat: 17.30, lng: -7.03, note: 'Saharan caravan town on the desert trade routes', year: 1480 },
      { name: 'Taghaza', type: 'resource', lat: 23.60, lng: -5.00, note: 'Saharan salt mines - salt traded nearly ounce-for-ounce with gold', year: 1500 },
      { name: 'Agadez', type: 'city', lat: 16.97, lng: 7.99, note: 'Eastern sultanate and trade gateway to the Aïr', year: 1500 },
      { name: 'Kano', type: 'city', lat: 12.00, lng: 8.52, note: 'Wealthy Hausa trade city - a tributary on the southeastern frontier', year: 1513 },
      { name: 'Tadmekka (Es-Souk)', type: 'landmark', lat: 18.60, lng: 1.00, note: 'Saharan caravan town where West African gold coins were struck', year: 1400 },
      { name: 'Tondibi', type: 'battle', lat: 16.45, lng: -0.20, note: 'Moroccan gunpowder shatters Songhai (1591) - the empire falls', year: 1591 },
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
    titleI18n: { de: 'Seefahrer des Pazifiks', fr: 'Les navigateurs du Pacifique', es: 'Navegantes del Pacífico', ru: 'Мореплаватели Тихого океана', mk: 'Морепловците на Пацификот' },
    description: 'The Polynesian settlement of the vast Pacific - the last great human colonization of the Earth. Using only the stars, swells, and birds, voyagers reached every corner of the Polynesian Triangle: Hawaii, Rapa Nui, and Aotearoa.',
    polygons: [
      {
        // The Polynesian Triangle - the immense oceanic realm settled by
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
      { name: 'Voyage north to Hawaii', nameI18n: { es: 'Viaje al norte a Hawái', ru: 'Путь на север к Гавайям', mk: 'Пат на север кон Хаваи', de: 'Fahrt nach Norden nach Hawaii', fr: 'Voyage vers le nord jusqu’à Hawaï' }, type: 'trade', color: '#22d3ee', points: [[-13.76,-172.10],[-9.78,-139.06],[5.0,-152.0],[19.60,-155.50]] },
      { name: 'Voyage east to Rapa Nui', nameI18n: { es: 'Viaje al este a Rapa Nui', ru: 'Путь на восток к Рапа-Нуи', mk: 'Пат на исток кон Рапа Нуи', de: 'Fahrt nach Osten nach Rapa Nui', fr: 'Voyage vers l’est jusqu’à Rapa Nui' }, type: 'trade', color: '#a78bfa', points: [[-17.65,-149.43],[-23.0,-129.0],[-27.11,-109.35]] },
      { name: 'Voyage south to Aotearoa', nameI18n: { es: 'Viaje al sur a Aotearoa', ru: 'Путь на юг к Аотеароа', mk: 'Пат на југ кон Аотеароа', de: 'Fahrt nach Süden nach Aotearoa', fr: 'Voyage vers le sud jusqu’à Aotearoa' }, type: 'trade', color: '#34d399', points: [[-17.65,-149.43],[-21.23,-159.78],[-29.0,-175.0],[-37.80,-185.00]] },
    ],
    markers: [
      { name: 'Samoa', type: 'landmark', lat: -13.76, lng: -172.10, note: 'Ancient homeland of the Polynesians', year: 1000 },
      { name: 'Tonga', type: 'landmark', lat: -21.18, lng: -175.20, note: 'Seat of a far-reaching Pacific maritime chiefdom', year: 1200 },
      { name: 'Marquesas', type: 'landmark', lat: -9.78, lng: -139.06, note: 'Springboard for the longest voyages, to Hawaii and beyond', year: 1000 },
      { name: 'Tahiti (Society Is.)', type: 'port', lat: -17.65, lng: -149.43, note: 'Great voyaging hub of central Polynesia', year: 1100 },
      { name: 'Hawaii', type: 'landmark', lat: 19.60, lng: -155.50, note: 'Northern apex of the Polynesian Triangle', year: 1000 },
      { name: 'Rapa Nui (Easter Island)', type: 'landmark', lat: -27.11, lng: -109.35, note: 'Eastern apex - home of the moai statues', year: 1200 },
      { name: 'Aotearoa (New Zealand)', type: 'landmark', lat: -37.80, lng: 175.00, note: 'Southern apex - last major land settled (~1300), ancestors of the Māori', year: 1300 },
      { name: 'Rarotonga (Cook Is.)', type: 'port', lat: -21.23, lng: -159.78, note: 'Staging point on the long southern voyage to Aotearoa', year: 1250 },
      { name: 'Fiji', type: 'landmark', lat: -17.71, lng: 178.07, note: 'Western gateway - the Lapita ancestors of the Polynesians passed through', year: 900 },
      { name: 'Mangareva', type: 'landmark', lat: -23.12, lng: -134.97, note: 'Remote outpost linking central Polynesia toward Rapa Nui', year: 1150 },
      { name: 'Chatham Islands', type: 'landmark', lat: -43.95, lng: -176.55, note: 'Bleak southeastern limit - settled by the Moriori', year: 1400 },
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
      // pass - a pinched ring keeps its previous valid state.
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
