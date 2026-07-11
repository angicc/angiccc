import type { Language } from './translations';
type ContentLang = Exclude<Language, 'en'>;

const TERRITORY_DESCS: Record<string, Partial<Record<ContentLang, string>>> = {
  mesopotamia: {
    es: 'El Creciente Fértil — desde el Tigris y Éufrates de Mesopotamia hasta el Nilo de Egipto — albergó las primeras ciudades, sistemas de escritura y códigos de leyes de la humanidad.',
    ru: 'Плодородный полумесяц — от Тигра и Евфрата в Месопотамии до Нила Египта — дал миру первые города, системы письма и своды законов.',
    mk: 'Плодородниот Полумесец — од Тигар и Еуфрат во Месопотамија до Нилот во Египет — ги дал на светот првите градови, системи на пишување и законски кодекси.',
  },
  'classical-greece': {
    es: 'Las ciudades-estado griegas forjaron la democracia, la filosofía y la ciencia — fundamentos de la civilización occidental. De Atenas a Jonia, las colonias griegas llevaron esta cultura por todo el Mediterráneo.',
    ru: 'Греческие города-государства создали демократию, философию и науку — основы западной цивилизации. От Афин до Ионии греческие колонии разнесли эту культуру по всему Средиземноморью.',
    mk: 'Грчките градови-држави ја исковале демократијата, филозофијата и науката — темелите на западната цивилизација. Од Атина до Јонија, грчките колонии ја пронеле оваа култура низ целиот Медитеран.',
  },
  'ancient-macedonia': {
    es: 'Desde el reino forjado por Filipo II, Alejandro Magno condujo al ejército macedonio por tres continentes — derribando a Persia y llevando la civilización helenística del Nilo al Indo en solo once años.',
    ru: 'Из царства, созданного Филиппом II, Александр Великий провёл македонскую армию через три континента — сокрушив Персию и донеся эллинистическую цивилизацию от Нила до Инда всего за одиннадцать лет.',
    mk: 'Од кралството што го изгради Филип II, Александар Велики ја поведе македонската војска преку три континенти — соборувајќи ја Персија и носејќи ја хеленистичката цивилизација од Нил до Инд за само единаесет години.',
  },
  'persian-empire': {
    es: 'El Imperio Persa Aqueménida — que se extendía de Egipto al río Indo — fue el mayor imperio que el mundo había visto hasta entonces, unificado por la Ruta Real y la fe zoroástrica.',
    ru: 'Империя Ахеменидов — простиравшаяся от Египта до реки Инд — была крупнейшей империей в мире на тот момент, объединённой Царской дорогой и зороастрийской верой.',
    mk: 'Ахеменидската Персиска Империја — која се протегала од Египет до реката Инд — беше најголемата империја на светот дотогаш, обединета со Кралскиот Пат и зороастријанска вера.',
  },
  'roman-empire': {
    es: 'En su apogeo bajo Trajano (117 d.C.), Roma unificó el mundo mediterráneo — desde Britania hasta Mesopotamia — con carreteras, derecho latino y legiones.',
    ru: 'На пике своего могущества при Траяне (117 н.э.) Рим объединил средиземноморский мир — от Британии до Месопотамии — с помощью дорог, латинского права и легионов.',
    mk: 'На врвот под Трајан (117 г.н.е.), Рим го обединил медитеранскиот свет — од Британија до Месопотамија — со патишта, латинско право и легии.',
  },
  'ancient-china': {
    es: 'La Dinastía Qin unificó China bajo el legalismo; la Dinastía Han la consolidó bajo la burocracia confuciana y abrió la Ruta de la Seda hacia Occidente.',
    ru: 'Династия Цинь объединила Китай под властью легизма; династия Хань укрепила его с помощью конфуцианской бюрократии и открыла Шёлковый путь на Запад.',
    mk: 'Династијата Ќин ја обединила Кина под легализам; Ханската Династија ја консолидирала под конфуцијанска бирократија и ја отворила Патот на свилата кон Западот.',
  },
  'byzantine-empire': {
    es: 'El Imperio Romano de Oriente sobrevivió casi un milenio a la caída de Occidente, preservando la cultura griega-romana y el Cristianismo Ortodoxo hasta la conquista otomana de 1453.',
    ru: 'Восточная Римская империя пережила падение Западной почти на тысячелетие, сохранив греко-римскую культуру и православное христианство вплоть до османского завоевания 1453 года.',
    mk: 'Источната Римска Империја го преживеала падот на Западот за речиси еден милениум, зачувувајќи ги грчко-римската култура и Православното Христијанство до Отоманското освојување во 1453 г.',
  },
  'islamic-caliphates': {
    es: 'Desde Arabia, el Islam se expandió por el Oriente Medio, el Norte de África, España y Asia Central en un siglo — creando una civilización que preservó la ciencia griega y pionera del álgebra, la astronomía y la medicina.',
    ru: 'Из Аравии ислам распространился по Ближнему Востоку, Северной Африке, Испании и Центральной Азии за одно столетие — создав цивилизацию, сохранившую греческую науку и ставшую пионером алгебры, астрономии и медицины.',
    mk: 'Од Арабија, Исламот се проширил низ Блискиот Исток, Северна Африка, Шпанија и Средна Азија за еден век — создавајќи цивилизација која ја зачувала грчката наука и пионирирала алгебра, астрономија и медицина.',
  },
  'mongol-empire': {
    es: 'Los descendientes de Gengis Kan forjaron el mayor imperio terrestre contiguo de la historia — de Corea a Hungría — conectando Oriente y Occidente a través de la Pax Mongolica.',
    ru: 'Потомки Чингисхана создали крупнейшую в истории единую сухопутную империю — от Кореи до Венгрии — соединив Восток и Запад через Pax Mongolica.',
    mk: 'Потомците на Џингис Кан ја исковале најголемата копнена империја во историјата — од Кореја до Унгарија — поврзувајќи го Истокот и Западот преку Pax Mongolica.',
  },
  'viking-age': {
    es: 'Desde el ataque a Lindisfarne (793) hasta Stamford Bridge (1066), los navegantes nórdicos saquearon, comerciaron y colonizaron desde Terranova hasta Bagdad — fundando Islandia, el Danelaw, Normandía y la Rus de Kiev.',
    ru: 'От набега на Линдисфарн (793) до Стамфорд-Бриджа (1066) норманнские мореходы грабили, торговали и селились от Ньюфаундленда до Багдада — основав Исландию, Данелаг, Нормандию и Киевскую Русь.',
    mk: 'Од нападот на Линдисфарн (793) до Стамфорд Бриџ (1066), нордиските морепловци пустошеле, тргувале и се населувале од Њуфаундленд до Багдад — основувајќи ги Исланд, Данелагот, Нормандија и Киевска Рус.',
  },
  'transatlantic-slave-trade': {
    es: 'Más de 12,5 millones de africanos esclavizados fueron transportados a través del Atlántico en el comercio triangular — manufacturas a África, seres humanos a América, azúcar y algodón de vuelta a Europa.',
    ru: 'Более 12,5 миллиона порабощённых африканцев были перевезены через Атлантику в рамках треугольной торговли — промышленные товары в Африку, люди в Америку, сахар и хлопок обратно в Европу.',
    mk: 'Над 12,5 милиони поробени Африканци беа пренесени преку Атлантикот во триаголната трговија — индустриски стоки кон Африка, луѓе кон Америка, шеќер и памук назад кон Европа.',
  },
  'crusader-states': {
    es: 'Nueve Cruzadas dieron forma a la Europa medieval — la Primera capturó Jerusalén (1099), Saladino la reconquistó (1187), y el último bastión cruzado cayó en Acre en 1291.',
    ru: 'Девять крупных Крестовых походов сформировали средневековую Европу — Первый захватил Иерусалим (1099), Салах ад-Дин отвоевал его (1187), а последний оплот крестоносцев пал в Акре в 1291 году.',
    mk: 'Девет главни Крстоносни Походи го обликувале средновековна Европа — Првиот го зазел Ерусалим (1099), Саладин го вратил (1187), а последниот крстоносен упориште паднал во Акра во 1291 г.',
  },
  'medieval-japan': {
    es: 'La era feudal de Japón vio a los clanes samuráis luchar por la supremacía a través de la Guerra Genpei, los shogunatos de Kamakura y Ashikaga, y el período de guerras Sengoku.',
    ru: 'Феодальная эпоха Японии ознаменовалась борьбой кланов самураев за первенство в ходе войны Гэмпэй, сёгуната Камакура и Асикага, а также периода сражающихся провинций Сэнгоку.',
    mk: 'Феудалната доба на Јапонија видела самурајски кланови кои се бореле за надмоќ преку Војната Генпеи, шогунатите Камакура и Ашикага, и периодот на воините Сенгоку.',
  },
  'ottoman-empire': {
    es: 'Bajo Solimán el Magnífico (1520–66), los otomanos controlaron tres continentes — desde las puertas de Viena hasta el Golfo Pérsico — la potencia dominante del siglo XVI.',
    ru: 'При Сулеймане Великолепном (1520–66) Османы контролировали три континента — от ворот Вены до Персидского залива — как доминирующая держава XVI века.',
    mk: 'Под Сулејман Величествениот (1520–66), Отоманците контролирале три континенти — од портите на Виена до Персискиот Залив — доминантната сила на 16 век.',
  },
  'renaissance-italy': {
    es: 'Las ciudades-estado italianas se convirtieron en el epicentro del Renacimiento — un renacimiento del arte clásico, el aprendizaje y el humanismo financiado por la riqueza bancaria de los Medici y el patrocinio papal.',
    ru: 'Итальянские города-государства стали эпицентром Ренессанса — возрождения классического искусства, учёности и гуманизма, финансируемого банковским богатством Медичи и папским меценатством.',
    mk: 'Италијанските градови-држави станале епицентар на Ренесансата — преродба на класичната уметност, учењето и хуманизмот финансиран со банкарското богатство на Медичи и папско покровителство.',
  },
  'age-of-exploration': {
    es: 'Los exploradores portugueses y españoles cartografiaron las costas de África, llegaron a India por mar, desembarcaron en las Américas y circunnavegaron el globo — transformando el mundo para siempre.',
    ru: 'Португальские и испанские мореплаватели составили карты берегов Африки, достигли Индии морем, высадились в Америке и обогнули земной шар — навсегда изменив мир.',
    mk: 'Португалски и шпански истражувачи ги картографирале бреговите на Африка, стигнале до Индија по море, слетале во Америките и обиколиле глобусот — засекогаш трансформирајќи го светот.',
  },
  'protestant-reformation': {
    es: 'Las 95 Tesis de Lutero (1517) fracturaron el Cristianismo occidental, desatando un siglo de guerras religiosas que culminaron en la Paz de Westfalia (1648), que estableció los estados-nación modernos.',
    ru: '95 тезисов Лютера (1517) раскололи западное христианство, породив столетие религиозных войн, завершившихся Вестфальским миром (1648), заложившим основы современных национальных государств.',
    mk: 'Деведесет и петте Тези на Лутер (1517) го расцепиле западното Христијанство, ослободувајќи еден век верски војни кои кулминирале со Вестфалскиот мир (1648) кој ги воспоставил современите национални држави.',
  },
  'american-revolution': {
    es: 'Las 13 colonias británicas declararon la independencia en 1776, creando los Estados Unidos — la primera república democrática moderna, que inspiró revoluciones en todo el mundo.',
    ru: '13 британских колоний провозгласили независимость в 1776 году, создав Соединённые Штаты — первую современную демократическую республику, вдохновившую революции по всему миру.',
    mk: 'Тринаесетте британски колонии ја прогласиле независноста во 1776 г., создавајќи ги Соединетите Американски Држави — прва модерна демократска република, инспирирајќи револуции ширум светот.',
  },
  'french-revolution-napoleon': {
    es: 'La Revolución Francesa derrocó la monarquía (1789), y las conquistas de Napoleón difundieron los ideales revolucionarios por toda Europa antes de su derrota en Waterloo (1815).',
    ru: 'Французская революция свергла монархию (1789), а завоевания Наполеона распространили революционные идеалы по всей Европе до его поражения при Ватерлоо (1815).',
    mk: 'Француската Револуција ја соборила монархијата (1789), а освојувањата на Наполеон ги проширила револуционерните идеали низ Европа пред неговиот пораз кај Ватерло (1815).',
  },
  'industrial-revolution': {
    es: 'Gran Bretaña lideró la primera Revolución Industrial del mundo — la energía de vapor, los ferrocarriles, los telares y la urbanización transformaron la sociedad de agraria a industrial antes de 1850, extendiéndose luego a Europa y América.',
    ru: 'Великобритания возглавила первую в мире промышленную революцию — паровая энергия, железные дороги, текстильные фабрики и урбанизация превратили общество из аграрного в промышленное к 1850 году, а затем распространились по Европе и Америке.',
    mk: 'Велика Британија ја предводела Светската Индустриска Револуција — парна енергија, железници, текстилни фабрики и урбанизација трансформирале општество од аграрно во индустриско до 1850 г., а потоа се прошириле во Европа и Америка.',
  },
  ww1: {
    es: 'La Gran Guerra mató a 20 millones de personas — guerra de trincheras en el Frente Occidental, colapso de cuatro imperios y redibujado del mapa de Europa en Versalles (1919).',
    ru: 'Великая война унесла 20 миллионов жизней — окопная война на Западном фронте, крушение четырёх империй и перекройка карты Европы в Версале (1919).',
    mk: 'Големата Војна убила 20 милиони луѓе — ровна војна на Западниот Фронт, пад на четири империи и прецртување на картата на Европа во Версај (1919).',
  },
  ww2: {
    es: 'El conflicto más mortífero de la historia — 70–85 millones de muertos, el Holocausto, bombas atómicas sobre Japón y el orden mundial de posguerra con la ONU, la OTAN y la Guerra Fría.',
    ru: 'Самый смертоносный конфликт в истории — 70–85 миллионов погибших, Холокост, атомные бомбардировки Японии и послевоенный мировой порядок с ООН, НАТО и холодной войной.',
    mk: 'Најсмртоносниот конфликт во историјата — 70–85 милиони убиени, Холокаустот, атомски бомби врз Јапонија и послевоениот светски поредок со ООН, НАТО и Студената Војна.',
  },
  'cold-war': {
    es: 'Estados Unidos y la URSS dividieron el mundo en bloques rivales — la OTAN contra el Pacto de Varsovia — en un punto muerto nuclear que dio forma a la política, la cultura y la tecnología hasta el colapso de la URSS en 1991.',
    ru: 'США и СССР разделили мир на противоборствующие блоки — НАТО против Варшавского договора — в ядерном противостоянии, определявшем политику, культуру и технологии вплоть до распада СССР в 1991 году.',
    mk: 'САД и СССР го поделиле светот на конкурентски блокови — НАТО наспроти Варшавскиот Пакт — во нуклеарна блокада која ги обликувала политиката, културата и технологијата до распадот на СССР во 1991 г.',
  },
  'yugoslav-wars': {
    es: 'La disolución de Yugoslavia produjo el conflicto más sangriento en Europa desde la Segunda Guerra Mundial — limpieza étnica, asedio de Sarajevo, intervención de la OTAN y surgimiento de siete nuevas naciones.',
    ru: 'Распад Югославии породил самый кровопролитный конфликт в Европе со времён Второй мировой войны — этнические чистки, осада Сараево, вмешательство НАТО и появление семи новых государств.',
    mk: 'Распадот на Југославија произвел најкрвавиот конфликт во Европа по Втората Светска Војна — етничко чистење, опсадата на Сараево, интервенцијата на НАТО и pojавата на седум нови нации.',
  },
  'macedonian-struggle': {
    es: 'Tras la decadencia otomana, la Cuestión Macedonia — las reivindicaciones búlgaras, griegas y serbias — estalló en guerra de guerrillas, el Levantamiento de Ilinden (1903) y las Guerras de los Balcanes (1912–13).',
    ru: 'На фоне упадка Османской империи Македонский вопрос — болгарские, греческие и сербские претензии — вылился в партизанскую войну, Илинденское восстание (1903) и Балканские войны (1912–13).',
    mk: 'По отоманскиот пад, Македонското Прашање — бугарски, грчки и српски претензии — избувнало во партизанска војна, Илинденско Востание (1903) и Балканските Војни (1912–13).',
  },
};

export function getTranslatedTerritoryDesc(topicId: string, lang: Language): string | null {
  if (lang === 'en') return null;
  return TERRITORY_DESCS[topicId]?.[lang as ContentLang] ?? null;
}
