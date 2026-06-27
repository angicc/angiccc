import type { Language } from '@/i18n/translations';
import { IMPROVED_POLYGONS } from '@/data/historicalBoundaries';

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
  era: 'ancient' | 'medieval' | 'early-modern' | 'modern';
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
}

export const TERRITORY_TOPICS: TerritoryTopic[] = [

  // ══════════════════════════════════════════════════════
  // ANCIENT WORLD
  // ══════════════════════════════════════════════════════
  {
    id: 'mesopotamia',
    era: 'ancient',
    period: '3100–500 BCE',
    yearRange: [-3100, -500],
    center: [30, 41],
    zoom: 5,
    title: 'Mesopotamia & Ancient Egypt',
    titleI18n: { es: 'Mesopotamia y Antiguo Egipto', ru: 'Месопотамия и Древний Египет', mk: 'Месопотамија и Античко Египет' },
    description: 'The Fertile Crescent — from Mesopotamia\'s Tigris-Euphrates to Egypt\'s Nile — hosted humanity\'s first cities, writing systems, and law codes.',
    polygons: [
      {
        label: 'Mesopotamia (Tigris-Euphrates)',
        color: '#f59e0b',
        fillOpacity: 0.25,
        coords: [[38,38],[38,44],[36,48],[33,48],[30,47],[29,46],[30,44],[31,42],[33,39],[35,38],[38,38]],
      },
      {
        label: 'Ancient Egypt (Nile Valley)',
        color: '#10b981',
        fillOpacity: 0.25,
        coords: [[31,33],[32,32],[31,30],[30,29],[28,29],[26,30],[24,32],[22,33],[22,31],[23,29],[25,28],[29,28],[31,31],[31,33]],
      },
    ],
    routes: [
      {
        name: 'Euphrates Trade Corridor',
        nameI18n: { es: 'Corredor Comercial del Éufrates', ru: 'Торговый коридор Евфрата', mk: 'Трговски коридор Еуфрат' },
        type: 'trade',
        color: '#f59e0b',
        points: [[38,38],[36,40],[34,42],[32,44],[30.5,47.8]],
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
    description: 'Greek city-states forged democracy, philosophy, and science — foundations of Western civilisation. The Persian Wars and Alexander\'s conquests spread Hellenism across Asia.',
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
      {
        name: 'Alexander\'s Campaign Route',
        nameI18n: { es: 'Ruta de Alejandro Magno', ru: 'Маршрут Александра Великого', mk: 'Рутата на Александар Велики' },
        type: 'military',
        color: '#ef4444',
        points: [[40,23],[40,28],[37,36],[31,35],[30,31],[30,50],[33,44],[35,48],[38,54],[36,62],[32,65],[29,68],[30,74],[28,77]],
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
      { name: 'Pella', type: 'capital', lat: 40.76, lng: 22.52, note: 'Macedonian capital — birthplace of Alexander the Great', year: -350 },
      { name: 'Corinth', type: 'city', lat: 37.94, lng: 22.93, note: 'Wealthy trading city — Corinthian order of architecture', year: -700 },
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
    titleI18n: { es: 'El Imperio Persa', ru: 'Персидская Империя', mk: 'Персиската Империја' },
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
    titleI18n: { es: 'El Imperio Romano', ru: 'Римская Империя', mk: 'Римската Империја' },
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
    titleI18n: { es: 'China Antigua — Dinastías Qin y Han', ru: 'Древний Китай — Династии Цинь и Хань', mk: 'Античка Кина — Цин и Хан Династии' },
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
    era: 'medieval',
    period: '476–1453 CE',
    yearRange: [476, 1453],
    center: [40, 33],
    zoom: 5,
    title: 'Byzantine Empire',
    titleI18n: { es: 'Imperio Bizantino', ru: 'Византийская Империя', mk: 'Византиската Империја' },
    description: 'The Eastern Roman Empire survived the fall of the West by nearly a millennium, preserving Greek-Roman culture and Orthodox Christianity until the Ottoman conquest of 1453.',
    polygons: [
      {
        label: 'Byzantine Empire (550 CE peak)',
        color: '#8b5cf6',
        fillOpacity: 0.25,
        coords: [[43,18],[42,22],[42,28],[41,30],[39,36],[37,38],[35,38],[33,36],[31,35],[30,33],[30,30],[31,28],[33,26],[35,26],[36,24],[38,24],[39,20],[41,18],[43,18]],
      },
    ],
    routes: [
      {
        name: 'Constantinople–Alexandria Trade',
        nameI18n: { es: 'Comercio Constantinopla–Alejandría', ru: 'Торговля Константинополь–Александрия', mk: 'Трговија Константинопол–Александрија' },
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
    titleI18n: { es: 'Califatos Islámicos', ru: 'Исламские Халифаты', mk: 'Исламски Калифати' },
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
    titleI18n: { es: 'El Imperio Mongol', ru: 'Монгольская Империя', mk: 'Монголската Империја' },
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
    center: [33, 36],
    zoom: 6,
    title: 'Crusades & the Holy Land',
    titleI18n: { es: 'Cruzadas y Tierra Santa', ru: 'Крестовые Походы и Святая Земля', mk: 'Крстоносните Походи и Светата Земја' },
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
    titleI18n: { es: 'Japón Medieval — Era Feudal', ru: 'Средневековая Япония — Феодальная эпоха', mk: 'Средновековна Јапонија — Феудална Ера' },
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
    id: 'ottoman-empire',
    era: 'early-modern',
    period: '1453–1683 CE',
    yearRange: [1453, 1683],
    center: [39, 32],
    zoom: 4,
    title: 'Ottoman Empire at its Peak',
    titleI18n: { es: 'Imperio Otomano en su Apogeo', ru: 'Османская Империя на Пике Могущества', mk: 'Отоманската Империја на Врвот' },
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
    titleI18n: { es: 'La Época de la Exploración', ru: 'Эпоха Великих Открытий', mk: 'Доба на Географски Откритија' },
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
    titleI18n: { es: 'La Reforma Protestante', ru: 'Протестантская Реформация', mk: 'Протестантска Реформација' },
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
    titleI18n: { es: 'Revolución Americana', ru: 'Американская Революция', mk: 'Американска Револуција' },
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
    titleI18n: { es: 'Revolución Francesa y Napoleón', ru: 'Французская Революция и Наполеон', mk: 'Француска Револуција и Наполеон' },
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
    titleI18n: { es: 'Revolución Industrial', ru: 'Промышленная Революция', mk: 'Индустриска Револуција' },
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
    titleI18n: { es: 'Primera Guerra Mundial', ru: 'Первая Мировая Война', mk: 'Прва Светска Војна' },
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
    titleI18n: { es: 'Segunda Guerra Mundial', ru: 'Вторая Мировая Война', mk: 'Втора Светска Војна' },
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
    titleI18n: { es: 'Guerra Fría', ru: 'Холодная Война', mk: 'Студена Војна' },
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
    titleI18n: { es: 'Guerras Yugoslavas', ru: 'Югославские Войны', mk: 'Југословенски Војни' },
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
    titleI18n: { es: 'La Lucha Macedonia', ru: 'Македонская Борьба', mk: 'Македонска Борба' },
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
].map(topic => ({
  ...topic,
  polygons: IMPROVED_POLYGONS[topic.id] ?? topic.polygons,
} as TerritoryTopic)) satisfies TerritoryTopic[];
