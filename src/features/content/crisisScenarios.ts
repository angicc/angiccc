// ─── Chronos Crisis Room: counterfactual simulation scenarios ────────────────
// Each scenario drops the player into a real historical turning point as the
// figure who actually had to decide. The Chronos Engine (AI game master) runs
// a six-turn simulation, evaluates every decision in real time against real
// historical constraints, and closes with a verdict comparing the player's
// counterfactual timeline with what actually happened.

import type { Language } from '@/i18n/translations';

type ContentLang = Exclude<Language, 'en'>;

export interface CrisisScenario {
  id: string;
  era: 'ancient' | 'middle-ages' | 'early-modern' | 'modern';
  yearLabel: string;
  title: string;
  titleI18n: Partial<Record<ContentLang, string>>;
  role: string;
  roleI18n: Partial<Record<ContentLang, string>>;
  tagline: string;
  taglineI18n: Partial<Record<ContentLang, string>>;
  /** The historical setup handed to both the player and the Chronos Engine. */
  briefing: string;
  objectives: string[];
}

export const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    id: 'crisis-rubicon',
    era: 'ancient',
    yearLabel: 'January, 49 BCE',
    title: 'The Rubicon',
    titleI18n: { es: 'El Rubicón', ru: 'Рубикон', mk: 'Рубикон' },
    role: 'Gaius Julius Caesar, Proconsul of Gaul',
    roleI18n: {
      es: 'Cayo Julio César, procónsul de la Galia',
      ru: 'Гай Юлий Цезарь, проконсул Галлии',
      mk: 'Гај Јулиј Цезар, проконзул на Галија',
    },
    tagline: 'One river. One legion. The Republic holds its breath.',
    taglineI18n: {
      es: 'Un río. Una legión. La República contiene el aliento.',
      ru: 'Одна река. Один легион. Республика затаила дыхание.',
      mk: 'Една река. Една легија. Републиката го задржува здивот.',
    },
    briefing:
      'The Senate, steered by your enemies and backed by Pompey, has ordered you to disband your army and return to Rome as a private citizen — where prosecution and exile await. You stand on the north bank of the Rubicon with the Thirteenth Legion. Crossing under arms is treason and means civil war; obeying may mean political annihilation. Your veterans are loyal, your funds deep, but Pompey commands the Republic\'s legitimacy and the seas.',
    objectives: ['Survive politically', 'Avoid destroying the Republic you claim to defend', 'Secure your veterans\' future'],
  },
  {
    id: 'crisis-1453',
    era: 'middle-ages',
    yearLabel: 'April, 1453',
    title: 'The Walls of Constantinople',
    titleI18n: {
      es: 'Las murallas de Constantinopla',
      ru: 'Стены Константинополя',
      mk: 'Ѕидините на Константинопол',
    },
    role: 'Constantine XI Palaiologos, Emperor of the Romans',
    roleI18n: {
      es: 'Constantino XI Paleólogo, emperador de los romanos',
      ru: 'Константин XI Палеолог, император ромеев',
      mk: 'Константин XI Палеолог, император на Ромеите',
    },
    tagline: 'Seven thousand defenders. Eighty thousand besiegers. A thousand years of empire on the line.',
    taglineI18n: {
      es: 'Siete mil defensores. Ochenta mil sitiadores. Mil años de imperio en juego.',
      ru: 'Семь тысяч защитников. Восемьдесят тысяч осаждающих. На кону — тысяча лет империи.',
      mk: 'Седум илјади бранители. Осумдесет илјади опсадници. Илјада години империја на коцка.',
    },
    briefing:
      'Sultan Mehmed II, twenty-one years old and burning to take your city, has arrived before the Theodosian Walls with a vast army and a new weapon: Orban\'s great bombard, capable of shattering masonry that has withstood every siege for a thousand years. You hold the walls with barely seven thousand men, Genoese allies under Giovanni Giustiniani, and a chain across the Golden Horn. The West promises help that never quite sails. Union with Rome could buy Latin ships — at the price of your clergy\'s fury.',
    objectives: ['Hold the city or save its people', 'Manage the Latin-Orthodox rift', 'Preserve the Palaiologan legacy'],
  },
  {
    id: 'crisis-1789',
    era: 'early-modern',
    yearLabel: 'July, 1789',
    title: 'The Bastille Summer',
    titleI18n: {
      es: 'El verano de la Bastilla',
      ru: 'Лето Бастилии',
      mk: 'Летото на Бастилја',
    },
    role: 'Louis XVI, King of France',
    roleI18n: {
      es: 'Luis XVI, rey de Francia',
      ru: 'Людовик XVI, король Франции',
      mk: 'Луј XVI, крал на Франција',
    },
    tagline: 'Paris is starving, the treasury is empty, and the Third Estate calls itself a Nation.',
    taglineI18n: {
      es: 'París se muere de hambre, el tesoro está vacío y el Tercer Estado se llama a sí mismo Nación.',
      ru: 'Париж голодает, казна пуста, а третье сословие называет себя Нацией.',
      mk: 'Париз гладува, трезорот е празен, а третиот сталеж се нарекува себеси Нација.',
    },
    briefing:
      'The Estates-General you summoned has slipped from your control: the Third Estate has declared itself a National Assembly and sworn not to disperse. Bread prices are the highest in a generation, your Swiss and German regiments ring Paris, and your court presses you to dismiss the reformist minister Necker. Every option is loaded: force may ignite the powder keg, concession may unravel absolutism forever. The Bastille\'s garrison awaits orders it does not want.',
    objectives: ['Keep the monarchy alive', 'Feed Paris before Paris feeds on you', 'Decide what to concede — and when'],
  },
  {
    id: 'crisis-1962',
    era: 'modern',
    yearLabel: 'October, 1962',
    title: 'Thirteen Days',
    titleI18n: {
      es: 'Trece días',
      ru: 'Тринадцать дней',
      mk: 'Тринаесет дена',
    },
    role: 'John F. Kennedy, President of the United States',
    roleI18n: {
      es: 'John F. Kennedy, presidente de los Estados Unidos',
      ru: 'Джон Ф. Кеннеди, президент США',
      mk: 'Џон Ф. Кенеди, претседател на САД',
    },
    tagline: 'U-2 photographs show Soviet missiles in Cuba. Every option leads toward the abyss.',
    taglineI18n: {
      es: 'Las fotos del U-2 muestran misiles soviéticos en Cuba. Cada opción conduce al abismo.',
      ru: 'Снимки U-2 показывают советские ракеты на Кубе. Каждый шаг ведёт к пропасти.',
      mk: 'Фотографиите од U-2 покажуваат советски ракети на Куба. Секоја опција води кон бездната.',
    },
    briefing:
      'Reconnaissance photographs confirm Soviet medium-range ballistic missiles under assembly in Cuba, minutes of flight time from Washington. The Joint Chiefs urge immediate air strikes followed by invasion; they do not know the island already holds Soviet tactical nuclear warheads. Khrushchev believes you are weak after the Bay of Pigs and Vienna. Your brother counsels a quarantine, LeMay calls anything less than bombing "appeasement," and every hour the missiles approach readiness.',
    objectives: ['Get the missiles out', 'Avoid nuclear war', 'Let no one — including yourself — be forced into a corner'],
  },
];

export function getCrisisTitle(s: CrisisScenario, language: Language): string {
  return language === 'en' ? s.title : s.titleI18n[language as ContentLang] ?? s.title;
}
export function getCrisisRole(s: CrisisScenario, language: Language): string {
  return language === 'en' ? s.role : s.roleI18n[language as ContentLang] ?? s.role;
}
export function getCrisisTagline(s: CrisisScenario, language: Language): string {
  return language === 'en' ? s.tagline : s.taglineI18n[language as ContentLang] ?? s.tagline;
}

/** Game-master system prompt for the Chronos Engine, seeded with a scenario. */
export function buildCrisisSystemPrompt(s: CrisisScenario): string {
  return `You are the Chronos Engine, the game master of Historify's "Chronos Crisis Room" — an interactive counterfactual history simulation.

SCENARIO: ${s.title} (${s.yearLabel})
THE PLAYER IS: ${s.role}
HISTORICAL SITUATION: ${s.briefing}
PLAYER OBJECTIVES: ${s.objectives.join('; ')}

RULES OF THE SIMULATION:
1. Stay rigorously grounded in real history — real people, real constraints, real geography, and only the technology and knowledge available in ${s.yearLabel}. No fantasy elements.
2. Each turn: narrate the developing situation in vivid but compact prose (under 150 words), then present exactly three numbered options (1, 2, 3) reflecting genuinely different strategies. The player may also type any free-form decision; treat it seriously.
3. When the player decides, evaluate it in real time with three labeled lines:
   CONSEQUENCE: the causally plausible result of their choice.
   HISTORY: one sentence on what really happened or what the real figure chose, when applicable.
   SCORES: Stability X/10, Legitimacy X/10, Legacy X/10 — update the numbers every turn to reflect the player's cumulative position.
4. The simulation lasts exactly 6 turns. Open every turn with "Turn N of 6 — <in-world date>". After the sixth decision, deliver THE VERDICT: compare the player's counterfactual timeline with real history, give a final score out of 100, and state the single most important lesson this episode teaches about how history works.
5. Consequences may be harsh. Do not protect the player from the logic of their choices; history was not kind either.
6. Write plain prose only — no markdown headers, no asterisks, no bullet symbols. Respond in the language the player writes in.

Begin the first turn immediately when the player signals readiness.`;
}
