// ─── Chronos Crisis Room: counterfactual simulation scenarios ────────────────
// Each scenario drops the player into a real historical turning point as the
// figure who actually had to decide. The Chronos Engine (AI game master) runs
// a six-turn simulation, evaluates every decision in real time against real
// historical constraints, and closes with a verdict comparing the player's
// counterfactual timeline with what actually happened.

import type { Language } from '@/i18n/translations';
import { CRISIS_DEFR, type CrisisLocaleEntry } from './crisisScenariosDeFr';

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
    id: 'crisis-salamis',
    era: 'ancient',
    yearLabel: 'September, 480 BCE',
    yearLabelI18n: { es: 'Septiembre, 480 a.C.', ru: 'Сентябрь 480 г. до н.э.', mk: 'Септември, 480 п.н.е.' },
    title: 'The Straits of Salamis',
    titleI18n: { es: 'Los estrechos de Salamina', ru: 'Саламинский пролив', mk: 'Теснецот на Саламина' },
    role: 'Themistocles, strategos of Athens',
    roleI18n: {
      es: 'Temístocles, estratego de Atenas',
      ru: 'Фемистокл, стратег Афин',
      mk: 'Темистокле, стратег на Атина',
    },
    tagline: 'Athens burns behind you. The allied fleet wants to scatter. One trap can still save Greece.',
    taglineI18n: {
      es: 'Atenas arde a tu espalda. La flota aliada quiere dispersarse. Una trampa aún puede salvar Grecia.',
      ru: 'Афины горят за спиной. Союзный флот хочет разойтись. Одна ловушка ещё может спасти Грецию.',
      mk: 'Атина гори зад тебе. Сојузничката флота сака да се растури. Една стапица сè уште може да ја спаси Грција.',
    },
    briefing:
      'Xerxes has burned Athens; its people crowd the island of Salamis as refugees. The Peloponnesian admirals — commanding most of the allied fleet — demand withdrawal to the Isthmus of Corinth, abandoning everything north of it. You know the Persian armada, vast but unwieldy, could be broken in the narrow straits where numbers cannot deploy. Eurybiades the Spartan holds nominal command, the allies distrust Athenian ambition, and Xerxes\' throne is being set up on the shore of Mount Aigaleos to watch his victory.',
    briefingI18n: {
      es: 'Jerjes ha incendiado Atenas; su gente se amontona como refugiados en la isla de Salamina. Los almirantes peloponesios — que mandan la mayor parte de la flota aliada — exigen retirarse al istmo de Corinto, abandonando todo lo que queda al norte. Sabes que la armada persa, inmensa pero torpe, podría quebrarse en los estrechos angostos donde el número no puede desplegarse. El espartano Euribíades ostenta el mando nominal, los aliados desconfían de la ambición ateniense, y el trono de Jerjes se instala en la ladera del monte Egáleo para contemplar su victoria.',
      ru: 'Ксеркс сжёг Афины; их жители теснятся беженцами на острове Саламин. Пелопоннесские навархи — командующие большей частью союзного флота — требуют отойти к Коринфскому перешейку, бросив всё к северу от него. Вы знаете: персидская армада, огромная но неповоротливая, может быть разбита в узком проливе, где численность не развернуть. Спартанец Еврибиад держит номинальное командование, союзники не доверяют афинским амбициям, а на склоне горы Эгалео уже ставят трон Ксеркса — смотреть на его победу.',
      mk: 'Ксеркс ја запали Атина; нејзиниот народ се собира како бегалци на островот Саламина. Пелопонеските адмирали — кои командуваат со поголемиот дел од сојузничката флота — бараат повлекување кон Коринтскиот истмус, напуштајќи сè северно од него. Ти знаеш дека персиската армада, огромна но тромава, може да биде скршена во тесните теснеци каде бројноста не може да се развие. Спартанецот Еврибијад ја држи номиналната команда, сојузниците не ѝ веруваат на атинската амбиција, а тронот на Ксеркс се поставува на падината на Егалео за да ја гледа неговата победа.',
    },
    objectives: ['Force the battle in the straits, not the open sea', 'Hold the fractious alliance together', 'Save the Athenian people — the city can be rebuilt'],
    objectivesI18n: {
      es: ['Fuerza la batalla en los estrechos, no en mar abierto', 'Mantén unida la alianza fracturada', 'Salva al pueblo ateniense — la ciudad puede reconstruirse'],
      ru: ['Навязать бой в проливе, а не в открытом море', 'Удержать хрупкий союз', 'Спасти афинян — город можно отстроить'],
      mk: ['Наметни ја битката во теснецот, не на отворено море', 'Одржи го скараниот сојуз заедно', 'Спаси го атинскиот народ — градот може да се обнови'],
    },
  },
  {
    id: 'crisis-hattin',
    era: 'middle-ages',
    yearLabel: 'July, 1187',
    yearLabelI18n: { es: 'Julio, 1187', ru: 'Июль 1187 г.', mk: 'Јули, 1187' },
    title: 'The Horns of Hattin',
    titleI18n: { es: 'Los Cuernos de Hattin', ru: 'Рога Хаттина', mk: 'Роговите на Хатин' },
    role: 'Guy of Lusignan, King of Jerusalem',
    roleI18n: {
      es: 'Guido de Lusignan, rey de Jerusalén',
      ru: 'Ги де Лузиньян, король Иерусалима',
      mk: 'Ги де Лузињан, крал на Ерусалим',
    },
    tagline: 'Saladin besieges Tiberias. Your barons say march; the water says stay. The kingdom rides on one order.',
    taglineI18n: {
      es: 'Saladino asedia Tiberíades. Tus barones dicen marchar; el agua dice quedarse. El reino pende de una orden.',
      ru: 'Саладин осаждает Тивериаду. Бароны говорят «выступай»; вода говорит «стой». Королевство висит на одном приказе.',
      mk: 'Саладин ја опсадува Тиберијада. Твоите барони велат марширај; водата вели остани. Кралството виси на една наредба.',
    },
    briefing:
      'Saladin has crossed the Jordan with the largest Muslim army the kingdom has ever faced and besieged Tiberias — deliberately, as bait. Raymond of Tripoli, whose own wife is trapped in the citadel, counsels you NOT to march: the summer plateau between Sephoria and Tiberias is waterless, and the army at Sephoria\'s springs is the kingdom\'s entire strength. Gerard de Ridefort, Master of the Temple, calls delay cowardice and reminds you how you gained the crown. Every fighting man of the realm is in this camp; lose the army and every castle and city — Jerusalem itself — stands empty behind it.',
    briefingI18n: {
      es: 'Saladino ha cruzado el Jordán con el mayor ejército musulmán que el reino haya enfrentado y asedia Tiberíades — deliberadamente, como cebo. Raimundo de Trípoli, cuya propia esposa está atrapada en la ciudadela, te aconseja NO marchar: la meseta estival entre Séforis y Tiberíades carece de agua, y el ejército en los manantiales de Séforis es toda la fuerza del reino. Gerardo de Ridefort, maestre del Temple, llama cobardía a la demora y te recuerda cómo obtuviste la corona. Todos los hombres de armas del reino están en este campamento; pierde el ejército y cada castillo y ciudad — la propia Jerusalén — quedará vacía tras él.',
      ru: 'Саладин перешёл Иордан с крупнейшей мусульманской армией, какую видело королевство, и осадил Тивериаду — намеренно, как приманку. Раймунд Триполийский, чья жена заперта в цитадели, советует НЕ выступать: летнее плато между Сефорией и Тивериадой безводно, а армия у сефорийских источников — вся сила королевства. Жерар де Ридфор, магистр тамплиеров, называет промедление трусостью и напоминает, как вы получили корону. Все воины королевства в этом лагере; потеряйте армию — и каждый замок, каждый город, сам Иерусалим останутся пустыми.',
      mk: 'Саладин го премина Јордан со најголемата муслиманска војска што кралството некогаш ја видело и ја опсади Тиберијада — намерно, како мамка. Рајмонд од Триполи, чија сопруга е заробена во цитаделата, те советува ДА НЕ маршираш: летната висорамнина меѓу Сефорија и Тиберијада е безводна, а војската кај изворите на Сефорија е целата сила на кралството. Жерар де Ридфор, мајстор на темпларите, одложувањето го нарекува кукавичлук и те потсетува како ја доби круната. Секој воин на кралството е во овој логор; изгуби ја војската и секој замок и град — самиот Ерусалим — остануваат празни зад неа.',
    },
    objectives: ['Do not lose the field army — it IS the kingdom', 'Answer Tiberias without giving Saladin his battle', 'Master your own fractious barons'],
    objectivesI18n: {
      es: ['No pierdas el ejército de campaña — ES el reino', 'Responde por Tiberíades sin darle a Saladino su batalla', 'Domina a tus propios barones facciosos'],
      ru: ['Не потерять полевую армию — она и ЕСТЬ королевство', 'Ответить на осаду Тивериады, не дав Саладину его битву', 'Совладать с собственными строптивыми баронами'],
      mk: ['Не ја губи полската војска — таа Е кралството', 'Одговори за Тиберијада без да му ја дадеш на Саладин неговата битка', 'Совладај ги сопствените скарани барони'],
    },
  },
  {
    id: 'crisis-armada',
    era: 'early-modern',
    yearLabel: 'July, 1588',
    yearLabelI18n: { es: 'Julio, 1588', ru: 'Июль 1588 г.', mk: 'Јули, 1588' },
    title: 'The Armada Summer',
    titleI18n: { es: 'El verano de la Armada', ru: 'Лето Армады', mk: 'Летото на Армадата' },
    role: 'Elizabeth I, Queen of England',
    roleI18n: {
      es: 'Isabel I, reina de Inglaterra',
      ru: 'Елизавета I, королева Англии',
      mk: 'Елизабета I, кралица на Англија',
    },
    tagline: 'A hundred and thirty ships sail for your throne, your church, and your head.',
    taglineI18n: {
      es: 'Ciento treinta naves navegan hacia tu trono, tu iglesia y tu cabeza.',
      ru: 'Сто тридцать кораблей идут за вашим троном, вашей церковью и вашей головой.',
      mk: 'Сто и триесет бродови пловат по твојот трон, твојата црква и твојата глава.',
    },
    briefing:
      'Philip II\'s Armada has entered the Channel in a crescent no English captain has broken, sailing to embark Parma\'s veteran army in Flanders and land it in Kent. Your fleet under Howard and Drake shadows it windward, faster and better-gunned but unable to close. Ashore, your militia is raw, your Catholic subjects are of uncertain loyalty, and your treasury cannot sustain the fleet at sea for long. Advisers urge you to safety inland; you are minded instead to ride to the army at Tilbury. Weather, fireships, and nerve are the cards you hold.',
    briefingI18n: {
      es: 'La Armada de Felipe II ha entrado en el Canal en una media luna que ningún capitán inglés ha roto, navegando para embarcar al ejército veterano de Parma en Flandes y desembarcarlo en Kent. Tu flota bajo Howard y Drake la sigue a barlovento, más rápida y mejor artillada pero incapaz de acercarse. En tierra, tu milicia es bisoña, tus súbditos católicos son de lealtad incierta y tu tesoro no puede sostener la flota en el mar mucho tiempo. Los consejeros te instan a refugiarte tierra adentro; tú prefieres cabalgar hacia el ejército en Tilbury. El clima, los brulotes y el temple son tus cartas.',
      ru: 'Армада Филиппа II вошла в Ла-Манш полумесяцем, который не смог разорвать ни один английский капитан, — она идёт принять на борт ветеранскую армию Пармы во Фландрии и высадить её в Кенте. Ваш флот под командованием Говарда и Дрейка следует за ней с наветра — быстрее и лучше вооружён, но не может сблизиться. На суше ополчение необстреляно, лояльность католиков сомнительна, а казна не выдержит долгого содержания флота в море. Советники зовут вас вглубь страны; вы же намерены ехать к армии в Тилбери. Погода, брандеры и выдержка — вот ваши карты.',
      mk: 'Армадата на Филип II влезе во Каналот во полумесечина што ниеден англиски капетан не ја пробил, пловејќи да ја качи ветеранската војска на Парма во Фландрија и да ја истовари во Кент. Твојата флота под Хауард и Дрејк ја следи од ветрената страна, побрза и подобро вооружена, но неспособна да се приближи. На копно, милицијата ти е неискусна, католичките поданици се со несигурна лојалност, а трезорот не може долго да ја издржува флотата на море. Советниците те тераат на безбедно во внатрешноста; ти намераваш наместо тоа да јаваш кај војската во Тилбери. Времето, огнените бродови и храброста се картите што ги држиш.',
    },
    objectives: ['Break the Armada before Parma embarks', 'Hold the nation\'s nerve — and your own', 'Spend no more than the treasury survives'],
    objectivesI18n: {
      es: ['Rompe la Armada antes de que Parma embarque', 'Sostén el temple de la nación — y el tuyo', 'No gastes más de lo que el tesoro resista'],
      ru: ['Разбить Армаду до посадки армии Пармы', 'Удержать самообладание нации — и своё', 'Не потратить больше, чем выдержит казна'],
      mk: ['Скрши ја Армадата пред Парма да се укрца', 'Одржи ги нервите на нацијата — и своите', 'Не троши повеќе отколку што трезорот издржува'],
    },
  },
  {
    id: 'crisis-1914',
    era: 'modern',
    yearLabel: 'July, 1914',
    yearLabelI18n: { es: 'Julio, 1914', ru: 'Июль 1914 г.', mk: 'Јули, 1914' },
    title: 'The July Crisis',
    titleI18n: { es: 'La crisis de julio', ru: 'Июльский кризис', mk: 'Јулската криза' },
    role: 'Wilhelm II, German Emperor',
    roleI18n: {
      es: 'Guillermo II, emperador alemán',
      ru: 'Вильгельм II, германский император',
      mk: 'Вилхелм II, германски император',
    },
    tagline: 'An archduke is dead in Sarajevo. Five empires reach for their mobilization timetables.',
    taglineI18n: {
      es: 'Un archiduque ha muerto en Sarajevo. Cinco imperios buscan sus calendarios de movilización.',
      ru: 'В Сараеве убит эрцгерцог. Пять империй тянутся к своим графикам мобилизации.',
      mk: 'Надвојводата е мртов во Сараево. Пет империи посегнуваат по своите распореди за мобилизација.',
    },
    briefing:
      'Franz Ferdinand is dead, and Vienna asks whether Germany stands behind whatever Austria-Hungary does to Serbia. Your generals whisper that war with Russia is inevitable and better now than in 1917, when the Tsar\'s railways will be finished. The Schlieffen Plan permits only one kind of war — through Belgium, against France first — and once mobilization begins, its timetable devours diplomacy. Your cousins sit on the thrones of Russia and Britain; telegrams between you may yet matter. A blank cheque is drafted on your desk, awaiting signature.',
    briefingI18n: {
      es: 'Francisco Fernando ha muerto, y Viena pregunta si Alemania respalda lo que sea que Austria-Hungría haga a Serbia. Tus generales susurran que la guerra con Rusia es inevitable y mejor ahora que en 1917, cuando los ferrocarriles del zar estarán terminados. El Plan Schlieffen solo permite un tipo de guerra — a través de Bélgica, contra Francia primero — y una vez que comienza la movilización, su calendario devora la diplomacia. Tus primos ocupan los tronos de Rusia y Gran Bretaña; los telegramas entre vosotros aún pueden importar. Un cheque en blanco espera tu firma sobre el escritorio.',
      ru: 'Франц Фердинанд мёртв, и Вена спрашивает, стоит ли Германия за любыми действиями Австро-Венгрии против Сербии. Генералы шепчут, что война с Россией неизбежна — и лучше сейчас, чем в 1917-м, когда царские железные дороги будут достроены. План Шлиффена допускает только одну войну — через Бельгию, сначала против Франции, — и с началом мобилизации её график пожирает дипломатию. Ваши кузены сидят на тронах России и Британии; телеграммы между вами ещё могут что-то значить. Карт-бланш лежит на столе и ждёт подписи.',
      mk: 'Франц Фердинанд е мртов, а Виена прашува дали Германија стои зад сè што Австро-Унгарија ќе ѝ направи на Србија. Твоите генерали шепотат дека војната со Русија е неизбежна и подобро сега отколку во 1917, кога железниците на царот ќе бидат завршени. Шлифеновиот план дозволува само еден вид војна — преку Белгија, прво против Франција — а штом почне мобилизацијата, нејзиниот распоред ја голта дипломатијата. Твоите братучеди седат на троновите на Русија и Британија; телеграмите меѓу вас сè уште можат да значат нешто. Бланко-чек лежи на твоето биро и чека потпис.',
    },
    objectives: ['Back Vienna without unleashing a continental war', 'Keep Britain neutral at almost any price', 'Never let the timetables outrun the diplomats'],
    objectivesI18n: {
      es: ['Respalda a Viena sin desatar una guerra continental', 'Mantén a Gran Bretaña neutral casi a cualquier precio', 'No dejes que los calendarios superen a los diplomáticos'],
      ru: ['Поддержать Вену, не развязав континентальную войну', 'Удержать Британию нейтральной почти любой ценой', 'Не дать графикам обогнать дипломатов'],
      mk: ['Поддржи ја Виена без да разгориш континентална војна', 'Задржи ја Британија неутрална по речиси секоја цена', 'Никогаш не дозволувај распоредите да ги престигнат дипломатите'],
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

// de/fr live in a companion table (the main literals carry es/ru/mk inline).
function deFr(id: string, language: Language): CrisisLocaleEntry | undefined {
  return language === 'de' || language === 'fr' ? CRISIS_DEFR[id]?.[language] : undefined;
}

export function getCrisisTitle(s: CrisisScenario, language: Language): string {
  return language === 'en' ? s.title : s.titleI18n[language as ContentLang] ?? deFr(s.id, language)?.title ?? s.title;
}
export function getCrisisRole(s: CrisisScenario, language: Language): string {
  return language === 'en' ? s.role : s.roleI18n[language as ContentLang] ?? deFr(s.id, language)?.role ?? s.role;
}
export function getCrisisTagline(s: CrisisScenario, language: Language): string {
  return language === 'en' ? s.tagline : s.taglineI18n[language as ContentLang] ?? deFr(s.id, language)?.tagline ?? s.tagline;
}
export function getCrisisYearLabel(s: CrisisScenario, language: Language): string {
  return language === 'en' ? s.yearLabel : s.yearLabelI18n[language as ContentLang] ?? deFr(s.id, language)?.yearLabel ?? s.yearLabel;
}
export function getCrisisBriefing(s: CrisisScenario, language: Language): string {
  return language === 'en' ? s.briefing : s.briefingI18n[language as ContentLang] ?? deFr(s.id, language)?.briefing ?? s.briefing;
}
export function getCrisisObjectives(s: CrisisScenario, language: Language): string[] {
  return language === 'en' ? s.objectives : s.objectivesI18n[language as ContentLang] ?? deFr(s.id, language)?.objectives ?? s.objectives;
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
