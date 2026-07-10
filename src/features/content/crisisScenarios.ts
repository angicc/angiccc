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
  yearLabelI18n: Partial<Record<ContentLang, string>>;
  title: string;
  titleI18n: Partial<Record<ContentLang, string>>;
  role: string;
  roleI18n: Partial<Record<ContentLang, string>>;
  tagline: string;
  taglineI18n: Partial<Record<ContentLang, string>>;
  /** The historical setup handed to both the player and the Chronos Engine. */
  briefing: string;
  briefingI18n: Partial<Record<ContentLang, string>>;
  objectives: string[];
  objectivesI18n: Partial<Record<ContentLang, string[]>>;
}

export const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    id: 'crisis-rubicon',
    era: 'ancient',
    yearLabel: 'January, 49 BCE',
    yearLabelI18n: { es: 'Enero, 49 a.C.', ru: 'Январь 49 г. до н.э.', mk: 'Јануари, 49 п.н.е.' },
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
    briefingI18n: {
      es: 'El Senado, dirigido por tus enemigos y respaldado por Pompeyo, te ha ordenado disolver tu ejército y volver a Roma como ciudadano privado — donde te esperan el juicio y el exilio. Estás en la orilla norte del Rubicón con la Decimotercera Legión. Cruzar en armas es traición y significa guerra civil; obedecer puede significar la aniquilación política. Tus veteranos son leales y tus fondos profundos, pero Pompeyo controla la legitimidad de la República y los mares.',
      ru: 'Сенат, направляемый вашими врагами и опирающийся на Помпея, приказал вам распустить армию и вернуться в Рим частным лицом — где вас ждут суд и изгнание. Вы стоите на северном берегу Рубикона с Тринадцатым легионом. Перейти реку с оружием — измена и гражданская война; подчиниться — возможно, политическая гибель. Ваши ветераны верны, казна полна, но за Помпеем — легитимность Республики и море.',
      mk: 'Сенатот, воден од твоите непријатели и поддржан од Помпеј, ти нареди да ја распуштиш војската и да се вратиш во Рим како обичен граѓанин — каде те чекаат судење и прогонство. Стоиш на северниот брег на Рубикон со Тринаесеттата легија. Преминот под оружје е предавство и значи граѓанска војна; послушноста може да значи политичко уништување. Твоите ветерани се лојални, средствата длабоки, но Помпеј ја држи легитимноста на Републиката и морињата.',
    },
    objectives: ['Survive politically', 'Avoid destroying the Republic you claim to defend', 'Secure your veterans\' future'],
    objectivesI18n: {
      es: ['Sobrevive políticamente', 'Evita destruir la República que dices defender', 'Asegura el futuro de tus veteranos'],
      ru: ['Выжить политически', 'Не разрушить Республику, которую вы защищаете', 'Обеспечить будущее ветеранов'],
      mk: ['Преживеј политички', 'Не ја уништи Републиката што тврдиш дека ја браниш', 'Обезбеди ја иднината на ветераните'],
    },
  },
  {
    id: 'crisis-gaugamela',
    era: 'ancient',
    yearLabel: 'October, 331 BCE',
    yearLabelI18n: { es: 'Octubre, 331 a.C.', ru: 'Октябрь 331 г. до н.э.', mk: 'Октомври 331 п.н.е.' },
    title: 'Gaugamela',
    titleI18n: { es: 'Gaugamela', ru: 'Гавгамелы', mk: 'Гавгамела' },
    role: 'Alexander III of Macedon, King and Hegemon of the Hellenic League',
    roleI18n: {
      es: 'Alejandro III de Macedonia, rey y hegemón de la Liga Helénica',
      ru: 'Александр III Македонский, царь и гегемон Эллинского союза',
      mk: 'Александар III Македонски, крал и хегемон на Хеленската лига',
    },
    tagline: 'Forty-seven thousand men against a quarter of a million. One dawn to decide the fate of two empires.',
    taglineI18n: {
      es: 'Cuarenta y siete mil hombres contra un cuarto de millón. Un amanecer para decidir el destino de dos imperios.',
      ru: 'Сорок семь тысяч против четверти миллиона. Один рассвет решит судьбу двух империй.',
      mk: 'Четириесет и седум илјади луѓе против четврт милион. Една зора ќе ја одлучи судбината на две империи.',
    },
    briefing:
      'Darius III has chosen this plain near Gaugamela and flattened it for his scythed chariots. His host — Persians, Bactrians, Indian elephants, Greek mercenaries — dwarfs yours. Parmenion urges a night attack; you have refused to steal a victory. Your veterans trust you completely, but one break in the phalanx and there is no reserve, no retreat, no Macedonia to return to. Somewhere across that plain stands Darius, twice a fugitive from your spear.',
    briefingI18n: {
      es: 'Darío III ha elegido esta llanura cerca de Gaugamela y la ha aplanado para sus carros falcados. Su ejército — persas, bactrianos, elefantes indios, mercenarios griegos — empequeñece al tuyo. Parmenión insiste en un ataque nocturno; te has negado a robar la victoria. Tus veteranos confían plenamente en ti, pero una brecha en la falange y no hay reserva, ni retirada, ni Macedonia a la que volver. En algún lugar de esa llanura está Darío, dos veces fugitivo de tu lanza.',
      ru: 'Дарий III выбрал эту равнину близ Гавгамел и выровнял её для своих серпоносных колесниц. Его войско — персы, бактрийцы, индийские слоны, греческие наёмники — многократно превосходит ваше. Парменион настаивает на ночной атаке; вы отказались красть победу. Ветераны верят вам безгранично, но один разрыв в фаланге — и нет ни резерва, ни отступления, ни Македонии, куда можно вернуться. Где-то за равниной стоит Дарий, дважды бежавший от вашего копья.',
      mk: 'Дариј III ја избра оваа рамнина кај Гавгамела и ја израмни за своите коли со српови. Неговата војска — Персијци, Бактријци, индиски слонови, грчки платеници — многукратно ја надминува твојата. Парменион инсистира на ноќен напад; ти одби да ја украдеш победата. Твоите ветерани целосно ти веруваат, но еден пробив во фалангата — и нема резерва, нема повлекување, нема Македонија за враќање. Некаде преку таа рамнина стои Дариј, двапати бегалец од твоето копје.',
    },
    objectives: ['Destroy the Persian army, not just win the field', 'Keep Parmenion\'s left wing alive', 'Take Darius — a fugitive Great King means endless war'],
    objectivesI18n: {
      es: ['Destruye al ejército persa, no solo ganes el campo', 'Mantén viva el ala izquierda de Parmenión', 'Captura a Darío — un Gran Rey fugitivo significa guerra sin fin'],
      ru: ['Уничтожить персидскую армию, а не просто выиграть поле', 'Сохранить левое крыло Пармениона', 'Взять Дария — беглый Великий царь означает бесконечную войну'],
      mk: ['Уништи ја персиската војска, не само освои го полето', 'Одржи го живо левото крило на Парменион', 'Фати го Дариј — Голем крал во бегство значи бескрајна војна'],
    },
  },
  {
    id: 'crisis-1453',
    era: 'middle-ages',
    yearLabel: 'April, 1453',
    yearLabelI18n: { es: 'Abril, 1453', ru: 'Апрель 1453 г.', mk: 'Април 1453' },
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
    briefingI18n: {
      es: 'El sultán Mehmed II, de veintiún años y ardiendo por tomar tu ciudad, ha llegado ante las murallas teodosianas con un ejército inmenso y un arma nueva: la gran bombarda de Orban, capaz de destrozar la mampostería que resistió todo asedio durante mil años. Defiendes las murallas con apenas siete mil hombres, aliados genoveses bajo Giovanni Giustiniani y una cadena que cierra el Cuerno de Oro. Occidente promete una ayuda que nunca termina de zarpar. La unión con Roma podría comprar naves latinas — al precio de la furia de tu clero.',
      ru: 'Султан Мехмед II, двадцати одного года и одержимый взятием вашего города, встал у Феодосиевых стен с огромной армией и новым оружием: гигантской бомбардой Орбана, способной крушить кладку, тысячу лет выдерживавшую любую осаду. Вы держите стены с семью тысячами человек, генуэзскими союзниками под началом Джованни Джустиниани и цепью поперёк Золотого Рога. Запад обещает помощь, которая всё не отплывает. Уния с Римом может купить латинские корабли — ценой ярости вашего духовенства.',
      mk: 'Султанот Мехмед II, на дваесет и една година и решен да го земе твојот град, пристигна пред Теодосиевите ѕидини со огромна војска и ново оружје: големата бомбарда на Орбан, способна да крши ѕидови што издржале секоја опсада илјада години. Ги држиш ѕидините со едвај седум илјади луѓе, џеновски сојузници под Џовани Џустинијани и синџир преку Златниот Рог. Западот ветува помош што никако да отплови. Унијата со Рим може да купи латински бродови — по цена на гневот на твоето свештенство.',
    },
    objectives: ['Hold the city or save its people', 'Manage the Latin-Orthodox rift', 'Preserve the Palaiologan legacy'],
    objectivesI18n: {
      es: ['Defiende la ciudad o salva a su gente', 'Gestiona la ruptura latino-ortodoxa', 'Preserva el legado paleólogo'],
      ru: ['Удержать город или спасти его жителей', 'Сгладить латино-православный раскол', 'Сохранить наследие Палеологов'],
      mk: ['Одржи го градот или спаси го народот', 'Управувај со латинско-православниот раскол', 'Зачувај го палеолошкото наследство'],
    },
  },
  {
    id: 'crisis-1789',
    era: 'early-modern',
    yearLabel: 'July, 1789',
    yearLabelI18n: { es: 'Julio, 1789', ru: 'Июль 1789 г.', mk: 'Јули 1789' },
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
    briefingI18n: {
      es: 'Los Estados Generales que convocaste se te han escapado de las manos: el Tercer Estado se ha declarado Asamblea Nacional y ha jurado no dispersarse. El precio del pan es el más alto en una generación, tus regimientos suizos y alemanes rodean París y tu corte te presiona para destituir al ministro reformista Necker. Toda opción está cargada: la fuerza puede encender el polvorín, la concesión puede deshacer el absolutismo para siempre. La guarnición de la Bastilla espera órdenes que no desea.',
      ru: 'Созванные вами Генеральные штаты вышли из-под контроля: третье сословие объявило себя Национальным собранием и поклялось не расходиться. Цены на хлеб — самые высокие за поколение, ваши швейцарские и немецкие полки окружают Париж, а двор требует отставки министра-реформатора Неккера. Каждый шаг взрывоопасен: сила может поджечь пороховую бочку, уступка — навсегда разрушить абсолютизм. Гарнизон Бастилии ждёт приказов, которых не хочет.',
      mk: 'Генералните сталежи што ги свика ти се измолкнаа од контрола: третиот сталеж се прогласи за Национално собрание и се заколна дека нема да се разиде. Цената на лебот е највисока за една генерација, твоите швајцарски и германски полкови го опкружуваат Париз, а дворот те притиска да го смениш реформскиот министер Некер. Секоја опција е набиена: силата може да го запали барутот, отстапката може засекогаш да го растури апсолутизмот. Гарнизонот на Бастилја чека наредби што не ги сака.',
    },
    objectives: ['Keep the monarchy alive', 'Feed Paris before Paris feeds on you', 'Decide what to concede — and when'],
    objectivesI18n: {
      es: ['Mantén viva la monarquía', 'Alimenta a París antes de que París te devore', 'Decide qué ceder — y cuándo'],
      ru: ['Сохранить монархию', 'Накормить Париж, пока Париж не съел вас', 'Решить, что уступить — и когда'],
      mk: ['Одржи ја монархијата жива', 'Нахрани го Париз пред Париз да те проголта', 'Одлучи што да отстапиш — и кога'],
    },
  },
  {
    id: 'crisis-1962',
    era: 'modern',
    yearLabel: 'October, 1962',
    yearLabelI18n: { es: 'Octubre, 1962', ru: 'Октябрь 1962 г.', mk: 'Октомври 1962' },
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
    briefingI18n: {
      es: 'Las fotografías de reconocimiento confirman misiles balísticos soviéticos de alcance medio en montaje en Cuba, a minutos de vuelo de Washington. El Estado Mayor exige ataques aéreos inmediatos seguidos de invasión; no saben que la isla ya alberga ojivas nucleares tácticas soviéticas. Jrushchov te cree débil tras Bahía de Cochinos y Viena. Tu hermano aconseja una cuarentena, LeMay llama «apaciguamiento» a todo lo que no sea bombardear, y cada hora los misiles se acercan a estar operativos.',
      ru: 'Снимки разведки подтверждают: на Кубе монтируются советские баллистические ракеты средней дальности — минуты подлёта до Вашингтона. Комитет начальников штабов требует немедленных авиаударов и вторжения; они не знают, что на острове уже есть советские тактические ядерные боеголовки. Хрущёв считает вас слабым после залива Свиней и Вены. Брат советует карантин, Лемей называет всё, кроме бомбардировки, «умиротворением», и с каждым часом ракеты ближе к боевой готовности.',
      mk: 'Извидничките фотографии потврдуваат советски балистички ракети со среден дострел во монтажа на Куба, на неколку минути лет од Вашингтон. Генералштабот бара итни воздушни удари проследени со инвазија; тие не знаат дека островот веќе има советски тактички нуклеарни боеви глави. Хрушчов те смета за слаб по Заливот на свињите и Виена. Брат ти советува карантин, Лемеј сè освен бомбардирање го нарекува „попуштање“, а со секој час ракетите се поблиску до готовност.',
    },
    objectives: ['Get the missiles out', 'Avoid nuclear war', 'Let no one — including yourself — be forced into a corner'],
    objectivesI18n: {
      es: ['Saca los misiles', 'Evita la guerra nuclear', 'Que nadie — ni tú mismo — quede acorralado'],
      ru: ['Убрать ракеты', 'Избежать ядерной войны', 'Никого — включая себя — не загонять в угол'],
      mk: ['Извади ги ракетите', 'Избегни нуклеарна војна', 'Никој — ни ти самиот — да не биде притеран в ќош'],
    },
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
export function getCrisisYearLabel(s: CrisisScenario, language: Language): string {
  return language === 'en' ? s.yearLabel : s.yearLabelI18n[language as ContentLang] ?? s.yearLabel;
}
export function getCrisisBriefing(s: CrisisScenario, language: Language): string {
  return language === 'en' ? s.briefing : s.briefingI18n[language as ContentLang] ?? s.briefing;
}
export function getCrisisObjectives(s: CrisisScenario, language: Language): string[] {
  return language === 'en' ? s.objectives : s.objectivesI18n[language as ContentLang] ?? s.objectives;
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
