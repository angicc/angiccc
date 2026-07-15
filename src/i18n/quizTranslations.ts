import type { Language } from './translations';
import { QUIZ_TRANS_EXPANSION } from './quizTranslationsExpansion';
import { getTranslatedQuestionDeFr } from './quizTranslationsDeFr';
type ContentLang = Exclude<Language, 'en'>;

interface QuizQuestionTranslation {
  question: string;
  options: string[];
  explanation: string;
}

export const QUIZ_TRANS: Record<string, Partial<Record<ContentLang, QuizQuestionTranslation>>> = {

  // ── ANCIENT (aq1–aq15) ───────────────────────────────────────────────────────

  'aq1': {
    es: {
      question: '¿Qué sistema de escritura desarrollaron los sumerios alrededor del 3100 a.C.?',
      options: ['Jeroglíficos', 'Cuneiforme', 'Lineal B', 'Alfabeto fenicio'],
      explanation: 'El cuneiforme ("en forma de cuña") se grababa en tablillas de arcilla con un estilete de caña. Los jeroglíficos eran egipcios; el Lineal B era griego micénico.',
    },
    ru: {
      question: 'Какую систему письма разработали шумеры около 3100 года до н.э.?',
      options: ['Иероглифы', 'Клинопись', 'Линейное письмо Б', 'Финикийский алфавит'],
      explanation: 'Клинопись (знаки в форме клиньев) выдавливалась на глиняных табличках тростниковым стилусом. Иероглифы — египетское письмо; линейное письмо Б — микенское греческое.',
    },
    mk: {
      question: 'Каков систем на пишување го развиле Сумерите околу 3100 г.п.н.е.?',
      options: ['Хиероглифи', 'Клинопис', 'Линеарно Б', 'Феничанска азбука'],
      explanation: 'Клинописот (знаци во форма на клин) се вдлабнувал во глинени плочки со трска. Хиероглифите биле египетски; Линеарното Б беше микенско грчко писмо.',
    },
  },

  'aq2': {
    es: {
      question: '¿Qué reformador ateniense introdujo el primer sistema democrático del mundo alrededor del 508 a.C.?',
      options: ['Solón', 'Pericles', 'Clístenes', 'Temístocles'],
      explanation: 'Clístenes reestructuró el gobierno ateniense para dar poder político directo a los ciudadanos ordinarios, ganándose el título de "Padre de la Democracia Ateniense".',
    },
    ru: {
      question: 'Какой афинский реформатор ввёл первую в мире демократическую систему около 508 года до н.э.?',
      options: ['Солон', 'Перикл', 'Клисфен', 'Фемистокл'],
      explanation: 'Клисфен реструктурировал афинское управление, дав рядовым гражданам прямую политическую власть, заслужив титул «Отца афинской демократии».',
    },
    mk: {
      question: 'Кој атински реформатор го воведе првиот демократски систем во светот околу 508 г.п.н.е.?',
      options: ['Солон', 'Перикле', 'Клистен', 'Темистокле'],
      explanation: 'Клистен го реструктуирал атинското управување давајќи им директна политичка моќ на обичните граѓани, заслужувајќи го насловот „Татко на атинската демократија".',
    },
  },

  'aq3': {
    es: {
      question: '¿En qué batalla los atenienses derrotaron la invasión persa en el 490 a.C.?',
      options: ['Termópilas', 'Salamina', 'Maratón', 'Platea'],
      explanation: 'En la Batalla de Maratón, una fuerza ateniense más pequeña derrotó a los persas, preservando la independencia griega.',
    },
    ru: {
      question: 'В какой битве афиняне разгромили персидское вторжение в 490 году до н.э.?',
      options: ['Фермопилы', 'Саламин', 'Марафон', 'Платеи'],
      explanation: 'В Марафонской битве немногочисленное афинское войско разгромило персов, сохранив независимость Греции.',
    },
    mk: {
      question: 'Во која битка Атињаните ги поразиле персиските освојувачи во 490 г.п.н.е.?',
      options: ['Термопили', 'Саламина', 'Маратон', 'Платеја'],
      explanation: 'Во Битката кај Маратон, помала атинска сила ги разбила Персијците, зачувувајќи ја грчката независност.',
    },
  },

  'aq4': {
    es: {
      question: '¿En qué fecha fue asesinado Julio César en el 44 a.C.?',
      options: ['1 de enero', '15 de marzo', '4 de julio', '25 de diciembre'],
      explanation: 'Los "Idus de Marzo" (15 de marzo) es cuando un grupo de senadores, liderado por Bruto y Casio, asesinó a César en el Senado.',
    },
    ru: {
      question: 'В какую дату был убит Юлий Цезарь в 44 году до н.э.?',
      options: ['1 января', '15 марта', '4 июля', '25 декабря'],
      explanation: '«Иды марта» (15 марта) — день, когда группа сенаторов во главе с Брутом и Кассием убила Цезаря в Сенате.',
    },
    mk: {
      question: 'На кој датум бил убиен Јулиј Цезар во 44 г.п.н.е.?',
      options: ['1 јануари', '15 март', '4 јули', '25 декември'],
      explanation: '„Идите Мартовски" (15 март) е денот кога група сенатори предводена од Брут и Касиј го убиле Цезар во Сенатот.',
    },
  },

  'aq5': {
    es: {
      question: 'La Pax Romana hace referencia a un período de paz romana que duró aproximadamente ¿cuánto tiempo?',
      options: ['50 años', '100 años', '200 años', '400 años'],
      explanation: 'La Pax Romana ("Paz Romana") duró aproximadamente 200 años, desde Augusto en el 27 a.C. hasta la muerte de Marco Aurelio en el 180 d.C.',
    },
    ru: {
      question: '«Pax Romana» — это период римского мира, длившийся приблизительно сколько лет?',
      options: ['50 лет', '100 лет', '200 лет', '400 лет'],
      explanation: '«Pax Romana» («Римский мир») длился примерно 200 лет — от Августа в 27 году до н.э. до смерти Марка Аврелия в 180 году н.э.',
    },
    mk: {
      question: 'Pax Romana се однесува на период на римски мир кој траел приближно колку долго?',
      options: ['50 години', '100 години', '200 години', '400 години'],
      explanation: 'Pax Romana („Римски мир") траел приближно 200 години — од Август во 27 г.п.н.е. до смртта на Марко Аурелиј во 180 г.н.е.',
    },
  },

  'aq6': {
    es: {
      question: '¿Qué rey persa emitió el "Cilindro de Ciro", considerado una temprana declaración de derechos humanos?',
      options: ['Darío I', 'Jerjes', 'Ciro el Grande', 'Artajerjes'],
      explanation: 'Ciro el Grande liberó a los exiliados judíos de Babilonia y permitió a los pueblos conquistados practicar sus propias religiones.',
    },
    ru: {
      question: 'Какой персидский царь издал «Цилиндр Кира», считающийся ранней декларацией прав человека?',
      options: ['Дарий I', 'Ксеркс', 'Кир Великий', 'Артаксеркс'],
      explanation: 'Кир Великий освободил еврейских изгнанников из Вавилона и позволил завоёванным народам исповедовать собственные религии.',
    },
    mk: {
      question: 'Кој персиски крал го издал „Цилиндарот на Кир", сметан за рана декларација за човекови права?',
      options: ['Дариј I', 'Ксеркс', 'Кир Велики', 'Артаксеркс'],
      explanation: 'Кир Велики ги ослободил еврејските прогонети од Вавилон и им дозволил на освоените народи да ги практикуваат своите религии.',
    },
  },

  'aq7': {
    es: {
      question: '¿Entre qué dos civilizaciones facilitó principalmente el comercio la Ruta de la Seda?',
      options: ['Egipto y Grecia', 'Roma e India', 'China y Roma/Mediterráneo', 'Persia y Egipto'],
      explanation: 'La Ruta de la Seda conectaba la China Han con el mundo mediterráneo, transportando seda, especias e ideas en ambas direcciones.',
    },
    ru: {
      question: 'Торговлю между какими двумя цивилизациями прежде всего обеспечивал Шёлковый путь?',
      options: ['Египтом и Грецией', 'Римом и Индией', 'Китаем и Римом/Средиземноморьем', 'Персией и Египтом'],
      explanation: 'Шёлковый путь связывал ханьский Китай со Средиземноморским миром, перевозя шёлк, пряности и идеи в обоих направлениях.',
    },
    mk: {
      question: 'Патот на свилата пред сè ја олеснувал трговијата меѓу кои две цивилизации?',
      options: ['Египет и Грција', 'Рим и Индија', 'Кина и Рим/Медитеранот', 'Персија и Египет'],
      explanation: 'Патот на свилата ги поврзувал ханската Кина со медитеранскиот свет, пренесувајќи свила, зачини и идеи во двете насоки.',
    },
  },

  'aq8': {
    es: {
      question: '¿Qué filósofo fue condenado a muerte en Atenas en el 399 a.C. por "corromper a la juventud"?',
      options: ['Platón', 'Aristóteles', 'Sócrates', 'Diógenes'],
      explanation: 'Sócrates fue juzgado y obligado a beber cicuta. Su alumno Platón escribió sobre el juicio en la Apología.',
    },
    ru: {
      question: 'Какой философ был приговорён к смерти в Афинах в 399 году до н.э. за «развращение молодёжи»?',
      options: ['Платон', 'Аристотель', 'Сократ', 'Диоген'],
      explanation: 'Сократ был осуждён и вынужден выпить цикуту. Его ученик Платон описал суд в «Апологии Сократа».',
    },
    mk: {
      question: 'Кој филозоф бил осуден на смрт во Атина во 399 г.п.н.е. поради „расипување на младината"?',
      options: ['Платон', 'Аристотел', 'Сократ', 'Диоген'],
      explanation: 'Сократ бил осуден и принуден да испие отров. Неговиот ученик Платон го опишал судењето во „Одбраната на Сократ".',
    },
  },

  'aq9': {
    es: {
      question: '¿A qué religión se convirtió el Emperador Ashoka del Imperio Maurya tras la brutal conquista de Kalinga?',
      options: ['Hinduismo', 'Jainismo', 'Budismo', 'Zoroastrismo'],
      explanation: 'Horrorizado por el sufrimiento en Kalinga, Ashoka abrazó el budismo y gobernó según el dharma, enviando misioneros por toda Asia.',
    },
    ru: {
      question: 'В какую религию обратился император Ашока из империи Маурьев после жестокого завоевания Калинги?',
      options: ['Индуизм', 'Джайнизм', 'Буддизм', 'Зороастризм'],
      explanation: 'Потрясённый страданиями в Калинге, Ашока принял буддизм и стал управлять страной по принципам дхармы, отправив миссионеров по всей Азии.',
    },
    mk: {
      question: 'Во која религија се обратил императорот Ашока од Маурјанската Империја по жестокото освојување на Калинга?',
      options: ['Хиндуизам', 'Џаинизам', 'Будизам', 'Зороастризам'],
      explanation: 'Зграпчен од страдањата во Калинга, Ашока го прифатил будизмот и владеел според дхарма, испраќајќи мисионери низ цела Азија.',
    },
  },

  'aq10': {
    es: {
      question: '¿Cuál fue la importancia del Código de Hammurabi (~1754 a.C.)?',
      options: ['Primera constitución democrática', 'Primer código legal escrito en la historia', 'Primer acuerdo comercial internacional', 'Primer texto religioso monoteísta'],
      explanation: 'El Código de Hammurabi es uno de los códigos legales escritos más antiguos y completos, que abarca crímenes, comercio y relaciones sociales.',
    },
    ru: {
      question: 'В чём заключалось значение Кодекса Хаммурапи (~1754 г. до н.э.)?',
      options: ['Первая демократическая конституция', 'Первый письменный свод законов в истории', 'Первое международное торговое соглашение', 'Первый монотеистический религиозный текст'],
      explanation: 'Кодекс Хаммурапи — один из древнейших и наиболее полных письменных сводов законов, охватывающий преступления, торговлю и общественные отношения.',
    },
    mk: {
      question: 'Која беше важноста на Законикот на Хамурапи (~1754 г.п.н.е.)?',
      options: ['Прв демократски устав', 'Прв пишан законски кодекс во историјата', 'Прв меѓународен трговски договор', 'Прв монотеистички религиозен текст'],
      explanation: 'Законикот на Хамурапи е еден од најстарите и најкомплетните пишани законски кодекси, опфаќајќи злосторства, трговија и општествени односи.',
    },
  },

  'aq11': {
    es: {
      question: '¿En qué batalla Alejandro Magno derrotó decisivamente al rey persa Darío III, poniendo fin al Imperio Aqueménida?',
      options: ['Batalla de Isos', 'Batalla de Gaugamela', 'Batalla del Gránico', 'Batalla del Hidaspes'],
      explanation: 'Gaugamela (331 a.C.) fue la batalla decisiva en la que las innovadoras tácticas de caballería de Alejandro destrozaron al ejército persa numéricamente superior, abriendo el corazón persa.',
    },
    ru: {
      question: 'В какой битве Александр Великий решительно разгромил персидского царя Дария III, фактически уничтожив державу Ахеменидов?',
      options: ['Битва при Иссе', 'Битва при Гавгамелах', 'Битва при Гранике', 'Битва при Гидаспе'],
      explanation: 'Гавгамелы (331 г. до н.э.) — решающая битва, в которой новаторская тактика конницы Александра сокрушила численно превосходящую персидскую армию, открыв путь в сердце Персии.',
    },
    mk: {
      question: 'Во која битка Александар Македонски го поразил одлучувачки персискиот крал Дариј III, ставајќи крај на Ахеменидската Империја?',
      options: ['Битка кај Ис', 'Битка кај Гавгамела', 'Битка кај Граник', 'Битка кај Хидасп'],
      explanation: 'Гавгамела (331 г.п.н.е.) беше одлучувачката битка во која иновативната коњаничка тактика на Александар ја скршила бројно надмоќната персиска армија, отворајќи го патот кон персиското срце.',
    },
  },

  'aq12': {
    es: {
      question: 'El Edicto de Milán romano (313 d.C.), emitido por el Emperador Constantino, fue significativo porque…',
      options: ['Estableció el cristianismo como religión estatal', 'Legalizó el cristianismo en todo el Imperio Romano', 'Expulsó a todos los ciudadanos no cristianos', 'Creó el cargo de Papa'],
      explanation: 'El Edicto de Milán declaró tolerancia religiosa para todas las confesiones, legalizando específicamente el cristianismo. No fue hasta el 380 d.C., bajo Teodosio, cuando el cristianismo se convirtió en religión estatal.',
    },
    ru: {
      question: 'Миланский эдикт (313 г. н.э.), изданный императором Константином, был значим тем, что…',
      options: ['Установил христианство государственной религией', 'Легализовал христианство во всей Римской империи', 'Выслал всех нехристианских граждан', 'Учредил должность Папы'],
      explanation: 'Миланский эдикт провозгласил религиозную терпимость ко всем вероисповеданиям, специально легализовав христианство. Лишь в 380 году н.э. при Феодосии христианство стало государственной религией.',
    },
    mk: {
      question: 'Миланскиот едикт (313 г.н.е.), издаден од императорот Константин, бил значаен затоа што…',
      options: ['Го воспоставил христијанството за државна религија', 'Го легализирал христијанството во целата Римска Империја', 'Ги протерал сите нехристијански граѓани', 'Ја создал функцијата на Папата'],
      explanation: 'Миланскиот едикт прогласил верска толеранција за сите вери, специфично легализирајќи го христијанството. Дури во 380 г.н.е. под Теодосиј христијанството станало државна религија.',
    },
  },

  'aq13': {
    es: {
      question: '¿Qué maravilla antigua permaneció como la estructura artificial más alta del mundo durante casi 4 000 años?',
      options: ['El Coloso de Rodas', 'El Faro de Alejandría', 'La Gran Pirámide de Giza', 'El Templo de Artemisa'],
      explanation: 'La Gran Pirámide de Keops en Giza (~2560 a.C.) mantuvo el récord como la estructura más alta del mundo hasta que la Catedral de Lincoln la superó en 1311 d.C., casi 3 800 años después.',
    },
    ru: {
      question: 'Какое древнее чудо света, возвышавшееся более 130 метров, оставалось самым высоким рукотворным сооружением почти 4 000 лет?',
      options: ['Колосс Родосский', 'Александрийский маяк', 'Великая пирамида Гизы', 'Храм Артемиды'],
      explanation: 'Великая пирамида Хеопса в Гизе (~2560 г. до н.э.) удерживала рекорд самого высокого сооружения в мире вплоть до постройки Линкольнского собора в 1311 году н.э. — почти 3 800 лет.',
    },
    mk: {
      question: 'Кое древно чудо на светот, повисоко од 130 метри, останало највисока рачно изградена конструкција речиси 4 000 години?',
      options: ['Колосот на Родос', 'Светилникот на Александрија', 'Големата Пирамида во Гиза', 'Храмот на Артемида'],
      explanation: 'Големата Пирамида на Кеопс во Гиза (~2560 г.п.н.е.) го држела рекордот за највисока градба на светот се до Линколнската катедрала во 1311 г.н.е. — речиси 3 800 години.',
    },
  },

  'aq14': {
    es: {
      question: 'La Guerra del Peloponeso (431–404 a.C.) se libró entre Atenas y ¿qué ciudad-estado rival?',
      options: ['Corinto', 'Tebas', 'Esparta', 'Macedonia'],
      explanation: 'La Guerra del Peloponeso enfrentó el imperio marítimo de Atenas con la alianza terrestre de Esparta. La victoria final de Esparta puso fin a la edad de oro de Atenas.',
    },
    ru: {
      question: 'Пелопоннесская война (431–404 гг. до н.э.) велась между Афинами и каким городом-соперником?',
      options: ['Коринф', 'Фивы', 'Спарта', 'Македония'],
      explanation: 'Пелопоннесская война противопоставила морскую империю Афин сухопутному союзу Спарты. Победа Спарты положила конец золотому веку Афин.',
    },
    mk: {
      question: 'Пелопонеската Војна (431–404 г.п.н.е.) се водела меѓу Атина и кој ривалски град-држава?',
      options: ['Коринт', 'Тива', 'Спарта', 'Македонија'],
      explanation: 'Пелопонеската Војна ги спротивставила поморската империја на Атина со копнениот сојуз на Спарта. Конечната победа на Спарта го завршила златното доба на Атина.',
    },
  },

  'aq15': {
    es: {
      question: '¿Qué invento de la dinastía Han, elaborado con fibras vegetales alrededor del 105 d.C., eventualmente transformaría la comunicación mundial?',
      options: ['La pólvora', 'La brújula', 'El papel', 'El hierro fundido'],
      explanation: 'El papel fue desarrollado en la China Han, atribuido tradicionalmente a Cai Lun en el 105 d.C. Era más ligero y barato que el papiro o la seda, y finalmente se extendió a Europa a través de la Ruta de la Seda.',
    },
    ru: {
      question: 'Какое изобретение династии Хань, сделанное из растительных волокон около 105 года н.э., в конечном счёте преобразило мировые коммуникации?',
      options: ['Порох', 'Компас', 'Бумага', 'Чугун'],
      explanation: 'Бумага была создана в ханьском Китае, традиционно приписывается Цай Луню в 105 году н.э. Она была легче и дешевле папируса или шёлка и постепенно распространилась в Европу через Шёлковый путь.',
    },
    mk: {
      question: 'Кој пронајдок на династијата Хан, направен од растителни влакна околу 105 г.н.е., на крајот ќе ја трансформира комуникацијата во светот?',
      options: ['Барутот', 'Компасот', 'Хартијата', 'Леано железо'],
      explanation: 'Хартијата е развиена во ханска Кина, традиционално се припишува на Цај Лун во 105 г.н.е. Таа беше полесна и поевтина од папирусот или свилата и конечно се проширила до Европа преку Патот на свилата.',
    },
  },

  // ── MEDIEVAL (mq1–mq15) ──────────────────────────────────────────────────────

  'mq1': {
    es: {
      question: '¿En qué año perdió el poder el último emperador romano de Occidente, marcando la caída del Imperio Romano de Occidente?',
      options: ['410 d.C.', '455 d.C.', '476 d.C.', '500 d.C.'],
      explanation: 'En el 476 d.C., el caudillo germánico Odoacro depuso a Rómulo Augústulo — la fecha convencional del fin del Imperio Romano de Occidente.',
    },
    ru: {
      question: 'В каком году последний западноримский император потерял власть, ознаменовав падение Западной Римской империи?',
      options: ['410 г. н.э.', '455 г. н.э.', '476 г. н.э.', '500 г. н.э.'],
      explanation: 'В 476 году н.э. германский вождь Одоакр сверг Ромула Августула — традиционная дата конца Западной Римской империи.',
    },
    mk: {
      question: 'Во која година последниот западноримски император ја изгубил власта, означувајќи го падот на Западната Римска Империја?',
      options: ['410 г.н.е.', '455 г.н.е.', '476 г.н.е.', '500 г.н.е.'],
      explanation: 'Во 476 г.н.е. германскиот поглавар Одоакар го симнал Ромул Августул — вообичаениот датум за крај на Западната Римска Империја.',
    },
  },

  'mq2': {
    es: {
      question: '¿En qué fecha el Papa León III coronó a Carlomagno como "Emperador de los Romanos"?',
      options: ['Domingo de Pascua del 799', 'Día de Navidad del 800', 'Año Nuevo del 801', 'Viernes Santo del 802'],
      explanation: 'El 25 de diciembre del año 800 d.C. en la Basílica de San Pedro en Roma. Se dice que la inesperada coronación sorprendió al propio Carlomagno.',
    },
    ru: {
      question: 'В какой день Папа Лев III короновал Карла Великого «Императором римлян»?',
      options: ['Пасхальное воскресенье 799 г.', 'Рождество 800 г.', 'Новый год 801 г.', 'Страстная пятница 802 г.'],
      explanation: 'Рождество 800 года н.э. в базилике Святого Петра в Риме. Неожиданная коронация, по сообщениям, застала Карла Великого врасплох.',
    },
    mk: {
      question: 'На кој датум Папата Лав III го крунисал Карло Велики за „Цар на Римјаните"?',
      options: ['Велигденска недела 799 г.', 'Божиќ 800 г.', 'Нова година 801 г.', 'Велики петок 802 г.'],
      explanation: 'Божиќ 800 г.н.е. во базиликата Свети Петар во Рим. Неочекуваното крунисање наводно го изненадило самиот Карло Велики.',
    },
  },

  'mq3': {
    es: {
      question: '¿En torno a qué relación organizó principalmente la sociedad el sistema feudal?',
      options: ['El comercio y los negocios', 'La propiedad de la tierra y el servicio militar', 'La autoridad de la Iglesia y los monjes', 'El parentesco tribal'],
      explanation: 'El feudalismo se basaba en que los señores concedían tierras (feudos) a los vasallos a cambio de servicio militar y lealtad.',
    },
    ru: {
      question: 'Вокруг каких отношений в первую очередь организовывала общество феодальная система?',
      options: ['Торговля и коммерция', 'Землевладение и военная служба', 'Власть церкви и монахи', 'Племенное родство'],
      explanation: 'Феодализм строился на том, что сеньоры жаловали землю (феоды) вассалам в обмен на военную службу и верность.',
    },
    mk: {
      question: 'Феудалниот систем го организирал општеството пред сè врз основа на кој однос?',
      options: ['Трговија и комерција', 'Сопственост на земјиште и воена служба', 'Авторитет на Црквата и монасите', 'Племенско сродство'],
      explanation: 'Феудализмот се засновал на тоа дека лордовите им доделувале земјиште (феуди) на вазалите во замена за воена служба и лојалност.',
    },
  },

  'mq4': {
    es: {
      question: '¿En qué año el Papa Urbano II convocó la Primera Cruzada?',
      options: ['1054', '1095', '1099', '1147'],
      explanation: 'En 1095, en Clermont, el Papa Urbano II llamó a los guerreros cristianos a recuperar Jerusalén de los turcos selyúcidas.',
    },
    ru: {
      question: 'В каком году Папа Урбан II призвал к Первому крестовому походу?',
      options: ['1054', '1095', '1099', '1147'],
      explanation: 'В 1095 году в Клермоне Папа Урбан II призвал христианских воинов отвоевать Иерусалим у турок-сельджуков.',
    },
    mk: {
      question: 'Во која година Папата Урбан II го повикал Првиот крстоносен поход?',
      options: ['1054', '1095', '1099', '1147'],
      explanation: 'Во 1095 година во Клермон, Папата Урбан II ги повикал христијанските воини да ја вратат Ерусалим од Селџучките Турци.',
    },
  },

  'mq5': {
    es: {
      question: 'Saladino, quien recuperó Jerusalén en 1187, era sultán de qué región?',
      options: ['Persia', 'Turquía', 'Egipto y Siria', 'Bagdad'],
      explanation: 'Saladino fue el fundador kurdo de la dinastía ayubí y gobernante de Egipto y Siria. Su caballerosidad fue respetada incluso por los cruzados.',
    },
    ru: {
      question: 'Салах ад-Дин, отвоевавший Иерусалим в 1187 году, был султаном какого региона?',
      options: ['Персии', 'Турции', 'Египта и Сирии', 'Багдада'],
      explanation: 'Салах ад-Дин — курдский основатель династии Айюбидов и правитель Египта и Сирии. Его рыцарство уважали даже крестоносцы.',
    },
    mk: {
      question: 'Саладин, кој ја вратил Ерусалим во 1187 година, бил султан на кој регион?',
      options: ['Персија', 'Турција', 'Египет и Сирија', 'Багдад'],
      explanation: 'Саладин бил курдскиот основач на Ајубидската династија и владетел на Египет и Сирија. Неговото витештво го почитувале дури и Крстоносците.',
    },
  },

  'mq6': {
    es: {
      question: '¿Qué fracción de la población europea se estima que mató la Peste Negra entre 1347 y 1353?',
      options: ['Un décimo', 'Un cuarto', 'Un tercio a la mitad', 'Dos tercios'],
      explanation: 'Se estima entre el 30 y el 60 % de la población europea. Algunas ciudades como Florencia perdieron más de la mitad de sus habitantes.',
    },
    ru: {
      question: 'Какую долю населения Европы унесла Чёрная смерть в период с 1347 по 1353 год?',
      options: ['Одну десятую', 'Одну четверть', 'От одной трети до половины', 'Две трети'],
      explanation: 'По оценкам, погибло от 30 до 60 % населения Европы. Некоторые города, например Флоренция, потеряли более половины жителей.',
    },
    mk: {
      question: 'Колкав дел од европската популација се проценува дека ја усмртила Црната Чума меѓу 1347 и 1353 година?',
      options: ['Една десетина', 'Една четвртина', 'Една третина до половина', 'Две третини'],
      explanation: 'Проценките се движат меѓу 30–60 % од европската популација. Некои градови, како Фиренца, изгубиле повеќе од половина од своите жители.',
    },
  },

  'mq7': {
    es: {
      question: '¿Qué documento inglés (1215) estableció que el rey estaba sujeto al Estado de derecho?',
      options: ['Libro Domesday', 'Magna Carta', 'Declaración de Derechos', 'Código de Derecho Consuetudinario'],
      explanation: 'La Magna Carta ("Gran Carta") fue impuesta al rey Juan por los barones rebeldes, estableciendo que incluso el rey debe seguir la ley.',
    },
    ru: {
      question: 'Какой английский документ (1215) установил, что король подчиняется верховенству закона?',
      options: ['Книга Страшного суда', 'Великая хартия вольностей', 'Билль о правах', 'Кодекс общего права'],
      explanation: 'Великая хартия вольностей была принята у короля Иоанна под давлением восставших баронов, установив, что даже король должен соблюдать закон.',
    },
    mk: {
      question: 'Кој англиски документ (1215) воспоставил дека кралот е подреден на владеење на правото?',
      options: ['Книгата на Судниот ден', 'Магна Карта', 'Повелбата за права', 'Кодекс на обичајното право'],
      explanation: 'Магна Карта („Голема повелба") му беше наметната на крал Јован од страна на бунтовните барони, воспоставувајќи дека дури и кралот мора да го следи законот.',
    },
  },

  'mq8': {
    es: {
      question: '¿Cuál fue el principal idioma del saber y de la Iglesia Católica durante toda la Edad Media?',
      options: ['Griego', 'Francés', 'Árabe', 'Latín'],
      explanation: 'El latín era el idioma universal de los europeos cultos, lo que permitía a los académicos de distintos países comunicarse y preservar los textos antiguos.',
    },
    ru: {
      question: 'Каким был основным языком науки и Католической церкви на протяжении всего Средневековья?',
      options: ['Греческий', 'Французский', 'Арабский', 'Латинский'],
      explanation: 'Латынь была универсальным языком образованных европейцев, позволяя учёным из разных стран общаться и сохранять древние тексты.',
    },
    mk: {
      question: 'Кој беше главниот јазик на науката и Католичката Црква низ целиот Среден Век?',
      options: ['Грчки', 'Француски', 'Арапски', 'Латински'],
      explanation: 'Латинскиот бил универзален јазик на образованите Европјани, овозможувајќи им на научниците од различни земји да комуницираат и да ги зачуваат античките текстови.',
    },
  },

  'mq9': {
    es: {
      question: '¿En qué ciudad se centró principalmente la Edad de Oro Islámica bajo el Califato Abasí?',
      options: ['El Cairo', 'Córdoba', 'Bagdad', 'Estambul'],
      explanation: 'La Casa de la Sabiduría de Bagdad fue el mayor centro de aprendizaje del mundo entre los siglos VIII y XIII, reuniendo estudiosos de todo el mundo conocido.',
    },
    ru: {
      question: 'В каком городе прежде всего был сосредоточен Исламский золотой век при Аббасидском халифате?',
      options: ['Каир', 'Кордова', 'Багдад', 'Стамбул'],
      explanation: 'Дом мудрости в Багдаде был величайшим центром науки в мире с VIII по XIII век, собирая учёных со всех концов известного мира.',
    },
    mk: {
      question: 'Исламскиот Златен Век бил сосредоточен пред сè во кој град под Абасидскиот Калифат?',
      options: ['Каиро', 'Кордоба', 'Багдад', 'Истанбул'],
      explanation: 'Куќата на мудроста во Багдад беше најголемиот центар на учење во светот од 8 до 13 век, собирајќи научници од целиот познат свет.',
    },
  },

  'mq10': {
    es: {
      question: 'El Imperio Mongol, en su apogeo, fue el mayor imperio terrestre contiguo de la historia. ¿Quién lo fundó?',
      options: ['Kublai Kan', 'Tamerlán', 'Gengis Kan', 'Ögedei Kan'],
      explanation: 'Gengis Kan unificó las tribus mongolas en 1206 e inició las conquistas que finalmente se extendieron desde Corea hasta Hungría.',
    },
    ru: {
      question: 'Монгольская империя на пике могущества была крупнейшей непрерывной сухопутной империей в истории. Кто её основал?',
      options: ['Хубилай-хан', 'Тимур', 'Чингисхан', 'Угэдэй-хан'],
      explanation: 'Чингисхан объединил монгольские племена в 1206 году и начал завоевания, которые в конечном счёте простёрлись от Кореи до Венгрии.',
    },
    mk: {
      question: 'Монголската Империја во својот врв беше најголемата непрекинато копнена империја во историјата. Кој ја основал?',
      options: ['Кублај Кан', 'Тимур', 'Џингис Кан', 'Угедеј Кан'],
      explanation: 'Џингис Кан ги обединил монголските племиња во 1206 година и ги почнал освојувањата кои на крајот се протегале од Кореја до Унгарија.',
    },
  },

  'mq11': {
    es: {
      question: 'El Gran Cisma de 1054 dividió permanentemente el cristianismo en cuáles dos grandes ramas?',
      options: ['Católica y Anglicana', 'Católica y Protestante', 'Católica Romana y Ortodoxa Oriental', 'Copta y Católica Romana'],
      explanation: 'El Gran Cisma dividió la Iglesia cristiana en la Iglesia Católica Romana (liderada por el Papa en Roma) y la Iglesia Ortodoxa Oriental (liderada por el Patriarca de Constantinopla), división que persiste hoy.',
    },
    ru: {
      question: 'Великий раскол 1054 года навсегда разделил христианство на какие две крупные ветви?',
      options: ['Католическую и Англиканскую', 'Католическую и Протестантскую', 'Римско-католическую и Восточно-православную', 'Коптскую и Римско-католическую'],
      explanation: 'Великий раскол разделил христианскую церковь на Римско-католическую (под руководством Папы в Риме) и Восточно-православную (под руководством Патриарха Константинополя) — разделение, сохраняющееся по сей день.',
    },
    mk: {
      question: 'Големата Шизма од 1054 година трајно го поделила христијанството на кои две главни гранки?',
      options: ['Католичка и Англиканска', 'Католичка и Протестантска', 'Римокатоличка и Источноправославна', 'Коптска и Римокатоличка'],
      explanation: 'Големата Шизма ја поделила христијанската Црква на Римокатоличката (предводена од Папата во Рим) и Источноправославната (предводена од Патријархот на Константинопол) — поделба која постои до денес.',
    },
  },

  'mq12': {
    es: {
      question: 'La "Summa Theologica" de Tomás de Aquino fue un intento fundamental de reconciliar cuáles dos tradiciones intelectuales?',
      options: ['Teología cristiana y filosofía platónica', 'Teología cristiana y filosofía aristotélica', 'Filosofía islámica y teología cristiana', 'Derecho romano antiguo y ética cristiana'],
      explanation: 'Aquino sintetizó la lógica y filosofía aristotélica con la doctrina cristiana, argumentando que la fe y la razón eran complementarias, no contradictorias — un texto fundamental del escolasticismo.',
    },
    ru: {
      question: '«Сумма теологии» Фомы Аквинского была новаторской попыткой примирить какие две интеллектуальные традиции?',
      options: ['Христианское богословие и платоновскую философию', 'Христианское богословие и аристотелевскую философию', 'Исламскую философию и христианское богословие', 'Древнеримское право и христианскую этику'],
      explanation: 'Аквинский синтезировал аристотелевскую логику и философию с христианским учением, доказывая, что вера и разум дополняют, а не противоречат друг другу — основополагающий текст схоластики.',
    },
    mk: {
      question: '„Сума Теолошка" на Тома Аквински беше пресврт во обид да се помират кои две интелектуални традиции?',
      options: ['Христијанска теологија и платонска филозофија', 'Христијанска теологија и аристотеловска филозофија', 'Исламска филозофија и христијанска теологија', 'Античко римско право и христијанска етика'],
      explanation: 'Аквински ги синтетизирал аристотеловата логика и филозофија со христијанската доктрина, тврдејќи дека верата и разумот се дополнувачки, а не спротивставени — основополагачки текст на схоластицизмот.',
    },
  },

  'mq13': {
    es: {
      question: '¿Qué desarrollo tecnológico medieval cambió radicalmente la guerra de castillos al hacer las gruesas paredes de piedra mucho menos defendibles?',
      options: ['El arco largo', 'La ballesta', 'La artillería y los cañones de pólvora', 'El fuego griego'],
      explanation: 'Los cañones podían abrir brechas en muros de piedra que habían resistido ejércitos durante siglos. Para el siglo XV, la artillería de pólvora hizo obsoletas las fortificaciones medievales tradicionales.',
    },
    ru: {
      question: 'Какое средневековое техническое достижение коренным образом изменило осадную войну, сделав толстые каменные стены значительно менее надёжной защитой?',
      options: ['Длинный лук', 'Арбалет', 'Пороховая артиллерия и пушки', 'Греческий огонь'],
      explanation: 'Пушки могли пробивать каменные стены, которые веками противостояли армиям. К XV веку пороховая артиллерия сделала традиционные средневековые укрепления устаревшими.',
    },
    mk: {
      question: 'Кој средновековен технолошки развој фундаментално ја сменил опсадата на тврдини правејќи ги дебелите камени ѕидови многу помалку бранливи?',
      options: ['Долгиот лак', 'Самострелот', 'Барутната артилерија и топовите', 'Грчкиот оган'],
      explanation: 'Топовите можеле да пробиваат камени ѕидови кои со векови се спротивставувале на армии. До 15 век, барутната артилерија ги направила традиционалните средновековни утврдувања застарени.',
    },
  },

  'mq14': {
    es: {
      question: 'La campaña militar de Juana de Arco que cambió el curso de la Guerra de los Cien Años comenzó con el levantamiento del sitio de qué ciudad francesa asediada en 1429?',
      options: ['París', 'Ruán', 'Calais', 'Orléans'],
      explanation: 'Juana lideró a las fuerzas francesas para levantar el sitio inglés de Orléans en mayo de 1429, su logro militar más célebre. Esta victoria transformó la moral francesa y comenzó a revertir el dominio inglés.',
    },
    ru: {
      question: 'Военная кампания Жанны д\'Арк, переломившая ход Столетней войны, началась со снятия осады с какого осаждённого французского города в 1429 году?',
      options: ['Париж', 'Руан', 'Кале', 'Орлеан'],
      explanation: 'Жанна возглавила французские войска, снявшие английскую осаду Орлеана в мае 1429 года, — её самое знаменитое военное достижение. Эта победа изменила боевой дух французов и начала обращение английского господства вспять.',
    },
    mk: {
      question: 'Воената кампања на Жана д\'Арк која ја пресврти Стогодишната Војна почнала со ослободувањето на кој опколен француски град во 1429 година?',
      options: ['Париз', 'Руан', 'Кале', 'Орлеан'],
      explanation: 'Жана ги предводела француските сили за да ја кренат англиската опсада на Орлеан во мај 1429 година — нејзиното најпрославено воено достигнување. Оваа победа ја трансформирала француската морала и почнала да го враќа англиската доминација.',
    },
  },

  'mq15': {
    es: {
      question: '¿Qué familia de ciudad-estado italiana se convirtió en el poder bancario dominante de la Europa medieval, financiando papas, reyes y el Renacimiento?',
      options: ['Los Sforza de Milán', 'Los Medici de Florencia', 'Los Dogos de Venecia', 'Los Borgia de Roma'],
      explanation: 'La familia Medici de Florencia operó el mayor banco de Europa en el siglo XV, con sucursales en todo el continente. Su riqueza financió el arte y el saber del Renacimiento, convirtiendo a Florencia en la capital cultural de Europa.',
    },
    ru: {
      question: 'Какая семья итальянского города-государства стала доминирующей банковской силой средневековой Европы, финансируя пап, королей и Ренессанс?',
      options: ['Сфорца из Милана', 'Медичи из Флоренции', 'Дожи Венеции', 'Борджиа из Рима'],
      explanation: 'Семья Медичи из Флоренции управляла крупнейшим банком в Европе XV века, имея отделения по всему континенту. Их богатство финансировало искусство и науку Ренессанса, сделав Флоренцию культурной столицей Европы.',
    },
    mk: {
      question: 'Кое семејство на италијански град-држава станало доминантна банкарска сила во средновековна Европа, финансирајќи папи, кралеви и Ренесансата?',
      options: ['Семејството Сфорца од Милано', 'Семејството Медичи од Фиренца', 'Дождевите на Венеција', 'Семејството Борџија од Рим'],
      explanation: 'Семејството Медичи од Фиренца управувало со најголемата банка во Европа во 15 век, со огранки низ целиот континент. Нивното богатство ги финансирало уметноста и учењето на Ренесансата, правејќи ја Фиренца за културна главнина на Европа.',
    },
  },

  // ── EARLY MODERN (eq1–eq15) ──────────────────────────────────────────────────

  'eq1': {
    es: {
      question: 'La invención de la imprenta de tipos móviles de Johannes Gutenberg (c.1440) habilitó directamente ¿cuál evento?',
      options: ['Las Cruzadas', 'La Reforma Protestante', 'La Peste Negra', 'Las invasiones mongolas'],
      explanation: 'La imprenta permitió difundir las ideas de Lutero por toda Alemania en cuestión de semanas; sin ella, la Reforma podría haber sido sofocada como otros movimientos reformistas anteriores.',
    },
    ru: {
      question: 'Изобретение печатного станка с подвижным шрифтом Иоганном Гутенбергом (ок. 1440 г.) напрямую способствовало какому событию?',
      options: ['Крестовым походам', 'Протестантской реформации', 'Чёрной смерти', 'Монгольским нашествиям'],
      explanation: 'Печатный станок позволил идеям Лютера распространиться по всей Германии за считаные недели; без него Реформация могла быть подавлена, как другие реформистские движения до неё.',
    },
    mk: {
      question: 'Пронајдокот на подвижниот печатен станок на Јоханес Гутенберг (околу 1440 г.) директно овозможил кој настан?',
      options: ['Крстоносните походи', 'Протестантската реформација', 'Црната Чума', 'Монголските инвазии'],
      explanation: 'Печатниот станок овозможил идеите на Лутер да се прошират низ цела Германија за неколку недели; без него, Реформацијата можела да биде задушена, исто како и претходните реформски движења.',
    },
  },

  'eq2': {
    es: {
      question: '¿En qué región fue el primer desembarco de Colón en 1492?',
      options: ['Brasil', 'Florida', 'El Caribe', 'México'],
      explanation: 'Colón desembarcó en las Bahamas en el Caribe, creyendo que había llegado a Asia. Nunca se dio cuenta de que había encontrado un continente antes desconocido para los europeos.',
    },
    ru: {
      question: 'В каком регионе состоялась первая высадка Колумба в 1492 году?',
      options: ['Бразилия', 'Флорида', 'Карибские острова', 'Мексика'],
      explanation: 'Колумб высадился на Багамских островах в Карибском море, полагая, что достиг Азии. Он так и не осознал, что открыл континент, прежде неизвестный европейцам.',
    },
    mk: {
      question: 'Во кој регион беше првото слетување на Колумб во 1492 година?',
      options: ['Бразил', 'Флорида', 'Карипски Острови', 'Мексико'],
      explanation: 'Колумб слетал на Бахамите во Карибите, верувајќи дека стигнал до Азија. Тој никогаш не сфатил дека открил континент дотогаш непознат за Европјаните.',
    },
  },

  'eq3': {
    es: {
      question: '¿A qué fenómeno se refiere el "Intercambio Colombino"?',
      options: ['Colón intercambiando oro por especias', 'La transferencia de plantas, animales y enfermedades entre hemisferios después de 1492', 'Un acuerdo comercial entre España y Portugal', 'Colón intercambiando mapas con los indígenas'],
      explanation: 'El Intercambio Colombino trajo caballos, ganado y enfermedades mortales a América; y devolvió papas, tomates y maíz a Europa, transformando ambos hemisferios.',
    },
    ru: {
      question: '«Колумбов обмен» — это какое явление?',
      options: ['Колумб менял золото на пряности', 'Перенос растений, животных и болезней между полушариями после 1492 года', 'Торговое соглашение между Испанией и Португалией', 'Колумб обменивался картами с коренными народами'],
      explanation: 'Колумбов обмен принёс лошадей, крупный рогатый скот и смертоносные болезни в Америку, а в Европу вернулся картофель, томаты и кукуруза — преобразив оба полушария.',
    },
    mk: {
      question: '„Колумбовата размена" се однесува на кој феномен?',
      options: ['Колумб тргувал злато за зачини', 'Преносот на растенија, животни и болести меѓу хемисферите по 1492 г.', 'Трговски договор меѓу Шпанија и Португалија', 'Колумб разменувал мапи со домородните народи'],
      explanation: 'Колумбовата размена донела коњи, говеда и смртоносни болести во Америките; и вратила компири, домати и пченка во Европа — трансформирајќи ги двете хемисфери.',
    },
  },

  'eq4': {
    es: {
      question: '¿En qué año Martín Lutero publicó sus 95 Tesis denunciando la corrupción de la Iglesia?',
      options: ['1492', '1505', '1517', '1543'],
      explanation: 'El 31 de octubre de 1517, Lutero cuestionó la venta de indulgencias, desencadenando la Reforma Protestante.',
    },
    ru: {
      question: 'В каком году Мартин Лютер прибил свои 95 тезисов, осуждая коррупцию Церкви?',
      options: ['1492', '1505', '1517', '1543'],
      explanation: '31 октября 1517 года Лютер выступил против продажи индульгенций, положив начало Протестантской реформации.',
    },
    mk: {
      question: 'Во која година Мартин Лутер ги закачил своите 95 Тези оспорувајќи ја корупцијата на Црквата?',
      options: ['1492', '1505', '1517', '1543'],
      explanation: 'На 31 октомври 1517 г., Лутер ја оспорил продажбата на индулгенции, предизвикувајќи ја Протестантската реформација.',
    },
  },

  'eq5': {
    es: {
      question: 'La Paz de Westfalia (1648) estableció cuál principio clave del orden internacional moderno?',
      options: ['El libre comercio entre naciones', 'La supremacía del Papa', 'La soberanía nacional y la no interferencia', 'Los derechos de las minorías religiosas'],
      explanation: 'Westfalia estableció que los gobernantes podían determinar la religión de sus territorios y que potencias externas no debían interferir — la base del sistema moderno de Estados-nación.',
    },
    ru: {
      question: 'Вестфальский мир (1648) утвердил какой ключевой принцип современного международного порядка?',
      options: ['Свободная торговля между нациями', 'Верховенство Папы', 'Национальный суверенитет и невмешательство', 'Права религиозных меньшинств'],
      explanation: 'Вестфальский мир установил, что правители могут определять религию своих территорий и что внешние силы не должны вмешиваться — основа современной системы национальных государств.',
    },
    mk: {
      question: 'Вестфалскиот мир (1648) воспоставил кој клучен принцип на современиот меѓународен поредок?',
      options: ['Слободна трговија меѓу нациите', 'Надмоќ на Папата', 'Национален суверенитет и ненамешување', 'Права на верски малцинства'],
      explanation: 'Вестфалија воспоставила дека владетелите можат да ја одредуваат религијата на своите територии и дека надворешните сили не треба да се мешаат — основата на современиот систем на национални држави.',
    },
  },

  'eq6': {
    es: {
      question: '¿Galileo Galilei fue obligado por qué institución a retractarse de su apoyo al modelo heliocéntrico en 1633?',
      options: ['La Inquisición Española', 'La República de Venecia', 'La Iglesia Católica Romana', 'El Sacro Emperador Romano'],
      explanation: 'La Inquisición Romana condenó a Galileo por herejía. Supuestamente murmuró "Y sin embargo, se mueve" tras su retractación, aunque esto es probablemente apócrifo.',
    },
    ru: {
      question: 'Какой институт в 1633 году принудил Галилео Галилея отречься от поддержки гелиоцентрической модели?',
      options: ['Испанская инквизиция', 'Венецианская республика', 'Римско-католическая церковь', 'Священный римский император'],
      explanation: 'Римская инквизиция осудила Галилея за ересь. По преданию, после отречения он произнёс «А всё-таки она вертится», хотя это, по всей видимости, апокриф.',
    },
    mk: {
      question: 'Галилео Галилеј бил принуден од кој институт да ја повлече поддршката за хелиоцентричниот модел во 1633 г.?',
      options: ['Шпанската инквизиција', 'Венецијанската Република', 'Римокатоличката Crkva', 'Светиот Римски Император'],
      explanation: 'Римската инквизиција го осудила Галилеј за ерес. Наводно промрморил „А сепак се врти" по своето одрекување, иако ова е веројатно апокрифно.',
    },
  },

  'eq7': {
    es: {
      question: 'Los Principia Mathematica de Isaac Newton (1687) establecieron las leyes que rigen ¿cuáles fenómenos?',
      options: ['La electricidad y el magnetismo', 'El movimiento y la gravedad', 'La luz y la óptica', 'La química y los átomos'],
      explanation: 'Los Principia describieron las tres leyes del movimiento y la gravitación universal, mostrando que la misma fuerza que hace caer una manzana mantiene la Luna en órbita.',
    },
    ru: {
      question: '«Математические начала натуральной философии» Исаака Ньютона (1687) установили законы, управляющие какими явлениями?',
      options: ['Электричество и магнетизм', 'Движение и гравитация', 'Свет и оптика', 'Химия и атомы'],
      explanation: '«Начала» описали три закона движения и всемирное тяготение — показав, что та же сила, что заставляет яблоко падать, удерживает Луну на орбите.',
    },
    mk: {
      question: 'Principia Mathematica на Исак Њутн (1687) воспоставиле закони кои управуваат со кои феномени?',
      options: ['Електрицитет и магнетизам', 'Движење и гравитација', 'Светлина и оптика', 'Хемија и атоми'],
      explanation: 'Principia ги опишале трите закони на движење и универзалната гравитација — покажувајќи дека истата сила која предизвикува паѓање на јаболко ја одржува Месечината на орбита.',
    },
  },

  'eq8': {
    es: {
      question: 'La Guerra de los Treinta Años (1618–1648) comenzó como un conflicto por ¿qué causa?',
      options: ['Territorio colonial', 'Rutas comerciales', 'La religión en el Sacro Imperio Romano', 'La sucesión al trono francés'],
      explanation: 'Comenzó como una guerra religiosa entre católicos y protestantes en Bohemia (la actual República Checa), antes de convertirse en un conflicto general europeo de poder.',
    },
    ru: {
      question: 'Тридцатилетняя война (1618–1648) началась как конфликт из-за чего?',
      options: ['Колониальные территории', 'Торговые пути', 'Религия в Священной Римской империи', 'Престолонаследие во Франции'],
      explanation: 'Она началась как религиозная война между католиками и протестантами в Богемии (нынешней Чехии), прежде чем превратиться в общеевропейский конфликт за власть.',
    },
    mk: {
      question: 'Триесетгодишната Војна (1618–1648) почнала како конфликт за ¿什么?',
      options: ['Колонијална територија', 'Трговски рути', 'Религијата во Светото Римско Царство', 'Наследство на францускиот трон'],
      explanation: 'Почнала како верска војна меѓу Католиците и Протестантите во Бохемија (денешна Чешка Република) пред да стане општ европски конфликт за власт.',
    },
  },

  'eq9': {
    es: {
      question: '¿Qué pensador ilustrado escribió "El Contrato Social" (1762) argumentando que la legitimidad del gobierno proviene del pueblo?',
      options: ['Voltaire', 'Montesquieu', 'John Locke', 'Jean-Jacques Rousseau'],
      explanation: 'El Contrato Social de Rousseau argumentó que el gobierno legítimo deriva del consentimiento popular — una influencia directa tanto en la Revolución Americana como en la Francesa.',
    },
    ru: {
      question: 'Какой мыслитель Просвещения написал «Общественный договор» (1762), утверждая, что легитимность правительства исходит от народа?',
      options: ['Вольтер', 'Монтескьё', 'Джон Локк', 'Жан-Жак Руссо'],
      explanation: '«Общественный договор» Руссо утверждал, что законная власть строится на народном согласии — прямое влияние на Американскую и Французскую революции.',
    },
    mk: {
      question: 'Кој просветителски мислител го напишал „Општествениот Договор" (1762) тврдејќи дека легитимноста на власта произлегува од народот?',
      options: ['Волтер', 'Монтескје', 'Џон Лок', 'Жан-Жак Русо'],
      explanation: 'Општествениот Договор на Русо тврдел дека легитимната власт произлегува од народниот консензус — директно влијание и врз Американската и врз Француската Револуција.',
    },
  },

  'eq10': {
    es: {
      question: '¿Qué explorador, navegando al servicio de Portugal, fue el primero en llegar a la India por mar rodeando África en 1498?',
      options: ['Cristóbal Colón', 'Américo Vespucio', 'Vasco de Gama', 'Fernando de Magallanes'],
      explanation: 'El viaje de Vasco de Gama alrededor del Cabo de Buena Esperanza abrió la ruta marítima directa a Asia, rompiendo el monopolio árabe sobre el comercio de especias.',
    },
    ru: {
      question: 'Какой мореплаватель, плывший под флагом Португалии, первым достиг Индии морским путём вокруг Африки в 1498 году?',
      options: ['Христофор Колумб', 'Америго Веспуччи', 'Васко да Гама', 'Фернан Магеллан'],
      explanation: 'Плавание Васко да Гамы вокруг мыса Доброй Надежды открыло прямой морской путь в Азию, сломив арабскую монополию на торговлю пряностями.',
    },
    mk: {
      question: 'Кој истражувач, пловејќи за Португалија, прв пристигнал во Индија по море околу Африка во 1498 г.?',
      options: ['Христофор Колумб', 'Америго Веспучи', 'Васко да Гама', 'Фернандо Магелан'],
      explanation: 'Патувањето на Васко да Гама околу Ртот на Добрата Надеж го отворило директниот морски пат до Азија, скршувајќи го арапскиот монопол врз трговијата со зачини.',
    },
  },

  'eq11': {
    es: {
      question: 'La "Defenestración de Praga" (1618) — el incidente que desencadenó la Guerra de los Treinta Años — implicó que nobles protestantes hicieran ¿qué?',
      options: ['Quemar iglesias católicas en Praga', 'Arrojar funcionarios reales católicos por la ventana de un castillo', 'Asesinar al Sacro Emperador Romano', 'Bloquear las rutas comerciales de Praga'],
      explanation: 'Los nobles bohemios protestantes arrojaron a dos gobernadores reales católicos y a su secretario por una ventana del Castillo de Praga — un acto deliberado de desafío. Los tres sobrevivieron a la caída de 17 metros (los católicos afirmaron que ángeles los amortiguaron).',
    },
    ru: {
      question: '«Пражская дефенестрация» (1618) — инцидент, спровоцировавший Тридцатилетнюю войну, — заключалась в том, что протестантские дворяне сделали что?',
      options: ['Сожгли католические церкви в Праге', 'Выбросили католических королевских чиновников из окна замка', 'Убили Священного римского императора', 'Заблокировали торговые пути Праги'],
      explanation: 'Протестантские богемские дворяне выбросили из окна Пражского замка двух католических королевских губернаторов и их секретаря — намеренный акт неповиновения. Все трое выжили после падения с 17-метровой высоты (католики утверждали, что их смягчили ангелы).',
    },
    mk: {
      question: '„Дефенестрацијата на Прага" (1618) — инцидентот кој ја предизвикал Триесетгодишната Војна — вклучувал протестантски благородници кои сториле ¿什么?',
      options: ['Запалиле католички цркви во Прага', 'Фрлиле католички кралски службеници низ прозорец на замок', 'Убиле го Светиот Римски Цар', 'Ги блокирале трговските рути на Прага'],
      explanation: 'Протестантски бохемски благородници фрлиле двајца католички кралски гувернери и нивниот секретар низ прозорец на Прашкиот Замок — намерен акт на непослушност. Тројцата преживеале пад од 17 метри (Католиците тврделе дека ангели ги омекнале).',
    },
  },

  'eq12': {
    es: {
      question: 'La Compañía Holandesa de las Indias Orientales (VOC), fundada en 1602, fue históricamente significativa como ¿qué tipo de innovación financiera?',
      options: ['Primer banco central', 'Primera compañía de acciones por suscripción pública', 'Primera corporación de propiedad estatal', 'Primera compañía internacional de seguros'],
      explanation: 'La VOC fue la primera compañía de acciones por suscripción pública del mundo, emitiendo acciones en la Bolsa de Ámsterdam. Esta innovación financiera permitió a los inversores compartir riesgos y ganancias, financiando el comercio de larga distancia.',
    },
    ru: {
      question: 'Нидерландская Ост-Индская компания (VOC), основанная в 1602 году, вошла в историю как какой вид финансовой инновации?',
      options: ['Первый центральный банк', 'Первая публично торгуемая акционерная компания', 'Первая государственная корпорация', 'Первая международная страховая компания'],
      explanation: 'VOC была первой в мире публично торгуемой акционерной компанией, выпускавшей акции на Амстердамской фондовой бирже. Эта финансовая инновация позволила инвесторам разделять риски и прибыль, финансируя дальнюю торговлю.',
    },
    mk: {
      question: 'Холандската Источноиндиска Компанија (VOC), основана во 1602 г., историски беше значајна како каков вид финансиска иновација?',
      options: ['Прва централна банка', 'Прва јавно тргувана акционерска компанија', 'Прва државна корпорација', 'Прва меѓународна осигурителна компанија'],
      explanation: 'VOC беше прва јавно тргувана акционерска компанија во светот, издавајќи акции на Амстердамската Берза. Оваа финансиска иновација им овозможи на инвеститорите да ги делат ризиците и профитите, финансирајќи ја трговијата на долги растојанија.',
    },
  },

  'eq13': {
    es: {
      question: '¿Qué emperador azteca recibió inicialmente a Hernán Cortés y su pequeña fuerza española cuando llegaron a México en 1519?',
      options: ['Cuauhtémoc', 'Itzcoatl', 'Moctezuma II', 'Ahuitzotl'],
      explanation: 'Moctezuma II recibió a Cortés con regalos extraordinarios, posiblemente influenciado por profecías sobre un dios que regresaba. Su hospitalidad permitió a los españoles entrar en Tenochtitlan, la capital azteca — una fatídica equivocación.',
    },
    ru: {
      question: 'Какой правитель ацтеков поначалу приветствовал Эрнана Кортеса и его небольшой испанский отряд, когда они прибыли в Мексику в 1519 году?',
      options: ['Куаутемок', 'Ицкоатль', 'Монтесума II', 'Ауицотль'],
      explanation: 'Монтесума II встретил Кортеса с щедрыми дарами, возможно, под влиянием пророчеств о возвращающемся боге. Его гостеприимство позволило испанцам войти в Теночтитлан, столицу ацтеков, — роковой просчёт.',
    },
    mk: {
      question: 'Кој ацтечки цар иницијално го пречекал Ернан Кортес и неговата мала шпанска сила кога пристигнале во Мексико во 1519 г.?',
      options: ['Куаутемок', 'Ицкоатл', 'Монтесума II', 'Ауицотл'],
      explanation: 'Монтесума II го пречекал Кортес со извонредни подароци, можеби под влијание на пророштвата за враќање на бог. Неговото гостопримство им овозможило на Шпанците да влезат во Теночтитлан, ацтечката главнина — погубна грешка.',
    },
  },

  'eq14': {
    es: {
      question: 'Los "Dos Tratados sobre el Gobierno Civil" de John Locke (1689) influyeron directamente en ¿qué documento fundacional americano?',
      options: ['Los Federalist Papers', 'La Constitución de los EE.UU.', 'La Declaración de Independencia', 'La Carta de Derechos'],
      explanation: 'La Declaración de Jefferson toma casi textualmente el concepto lockeano de derechos naturales a la "vida, la libertad y la propiedad" (Jefferson sustituyó "propiedad" por "búsqueda de la felicidad") y el derecho a derrocar gobiernos tiránicos.',
    },
    ru: {
      question: '«Два трактата о правлении» Джона Локка (1689) непосредственно повлияли на какой основополагающий американский документ?',
      options: ['Статьи федералиста', 'Конституция США', 'Декларация независимости', 'Билль о правах'],
      explanation: 'Декларация Джефферсона почти дословно заимствует локковскую концепцию естественных прав на «жизнь, свободу и собственность» (Джефферсон заменил «собственность» на «стремление к счастью») и право свергать тираническое правительство.',
    },
    mk: {
      question: '„Два трактата за власта" на Џон Лок (1689) директно влијаеле на кој основачки американски документ?',
      options: ['Федералистите', 'Уставот на САД', 'Декларацијата за независност', 'Повелбата за права'],
      explanation: 'Декларацијата на Џеферсон речиси дословно го прима Локовиот концепт на природни права за „живот, слобода и сопственост" (Џеферсон ја заменил „сопственоста" со „потрагата по среќа") и правото да се собори тирански режим.',
    },
  },

  'eq15': {
    es: {
      question: 'Se dice que la "Revolución Científica" comenzó con la teoría heliocéntrica de Copérnico (1543) y culminó con ¿qué publicación?',
      options: ['El Diálogo de Galileo (1632)', 'Los Principia Mathematica de Newton (1687)', 'El Origen de las Especies de Darwin (1859)', 'La Astronomia Nova de Kepler (1609)'],
      explanation: 'Convencionalmente, los historiadores fechan la Revolución Científica desde el modelo heliocéntrico de Copérnico (1543) hasta los Principia de Newton (1687), que sintetizaron un siglo de descubrimientos en un marco matemático unificado para comprender la naturaleza.',
    },
    ru: {
      question: 'Принято считать, что «Научная революция» началась с гелиоцентрической теории Коперника (1543) и завершилась какой публикацией?',
      options: ['«Диалог» Галилея (1632)', '«Математические начала» Ньютона (1687)', '«Происхождение видов» Дарвина (1859)', '«Astronomia Nova» Кеплера (1609)'],
      explanation: 'Историки традиционно датируют Научную революцию от гелиоцентрической модели Коперника (1543) до «Начал» Ньютона (1687), синтезировавших вековые открытия в единую математическую систему познания природы.',
    },
    mk: {
      question: 'Се вели дека „Научната Револуција" почнала со хелиоцентричната теорија на Коперник (1543) и кулминирала со која публикација?',
      options: ['Дијалогот на Галилеј (1632)', 'Principia Mathematica на Њутн (1687)', 'Потеклото на видовите на Дарвин (1859)', 'Astronomia Nova на Кеплер (1609)'],
      explanation: 'Историчарите конвенционално ја датираат Научната Револуција од хелиоцентричниот модел на Коперник (1543) до Principia на Њутн (1687), кои синтетизирале еден век откритија во обединета математичка рамка за разбирање на природата.',
    },
  },

  // ── MODERN (mod1–mod15) ──────────────────────────────────────────────────────

  'mod1': {
    es: {
      question: '¿En qué país comenzó la Revolución Industrial alrededor de 1760?',
      options: ['Francia', 'Alemania', 'Estados Unidos', 'Gran Bretaña'],
      explanation: 'La combinación de carbón, hierro, gobierno estable y mercados coloniales de Gran Bretaña la convirtió en la cuna de la industrialización.',
    },
    ru: {
      question: 'В какой стране около 1760 года началась Промышленная революция?',
      options: ['Франция', 'Германия', 'Соединённые Штаты', 'Великобритания'],
      explanation: 'Сочетание угля, железа, стабильного правительства и колониальных рынков сделало Великобританию родиной индустриализации.',
    },
    mk: {
      question: 'Во која земја почнала Индустриската Револуција околу 1760 г.?',
      options: ['Франција', 'Германија', 'Соединети Американски Држави', 'Велика Британија'],
      explanation: 'Комбинацијата на јаглен, железо, стабилна власт и колонијални пазари ја направила Велика Британија родното место на индустријализацијата.',
    },
  },

  'mod2': {
    es: {
      question: '¿Cuál fue el detonante inmediato de la Primera Guerra Mundial en 1914?',
      options: ['Alemania invadiendo Bélgica', 'El hundimiento del Lusitania', 'El asesinato del Archiduque Francisco Fernando', 'Rusia movilizando su ejército'],
      explanation: 'El asesinato del Archiduque Francisco Fernando de Austria-Hungría en Sarajevo por el nacionalista serbio Gavrilo Princip desencadenó el sistema de alianzas que arrastró a Europa a la guerra.',
    },
    ru: {
      question: 'Каким был непосредственный повод для начала Первой мировой войны в 1914 году?',
      options: ['Германия вторглась в Бельгию', 'Потопление «Лузитании»', 'Убийство эрцгерцога Франца Фердинанда', 'Мобилизация русской армии'],
      explanation: 'Убийство австро-венгерского эрцгерцога Франца Фердинанда в Сараево сербским националистом Гаврилой Принципом запустило систему союзов, втянувшую Европу в войну.',
    },
    mk: {
      question: 'Кој беше непосредниот повод за Првата Светска Војна во 1914 г.?',
      options: ['Германија ја нападнала Белгија', 'Потонувањето на Лузитанија', 'Атентатот на надвојводата Франц Фердинанд', 'Русија ја мобилизирала армијата'],
      explanation: 'Атентатот врз австроунгарскиот надвојвода Франц Фердинанд во Сараево од страна на српскиот националист Гаврило Принцип го активирал сојузничкиот систем кој ја вовлекол Европа во војна.',
    },
  },

  'mod3': {
    es: {
      question: 'El Tratado de Versalles (1919) culpó de la Primera Guerra Mundial a ¿qué país e impuso enormes reparaciones?',
      options: ['Austria-Hungría', 'Imperio Otomano', 'Alemania', 'Rusia'],
      explanation: 'La "cláusula de culpabilidad de guerra" (Artículo 231) asignó la responsabilidad a Alemania, lo que llevó a reparaciones y pérdidas territoriales que alimentaron el resentimiento y en última instancia la Segunda Guerra Mundial.',
    },
    ru: {
      question: 'Версальский договор (1919) возложил вину за Первую мировую войну на какую страну и обязал её выплатить огромные репарации?',
      options: ['Австро-Венгрия', 'Османская империя', 'Германия', 'Россия'],
      explanation: '«Статья о военной вине» (статья 231) возложила ответственность на Германию, что повлекло репарации и территориальные потери, породившие обиду и в конечном счёте подтолкнувшие ко Второй мировой войне.',
    },
    mk: {
      question: 'Версајскиот Договор (1919) ја обвинил за Првата Светска Војна која земја и наметнал огромни репарации?',
      options: ['Австро-Унгарија', 'Отоманската Империја', 'Германија', 'Русија'],
      explanation: '„Клаузулата за воена вина" (Член 231) ја доделила одговорноста на Германија, водејќи до репарации и територијални загуби кои поттикнале огорченост и на крај Втората Светска Војна.',
    },
  },

  'mod4': {
    es: {
      question: 'El Holocausto fue el genocidio nazi perpetrado principalmente contra ¿qué grupo, entre otros?',
      options: ['Los pueblos eslavos', 'El pueblo romaní', 'El pueblo judío', 'Los opositores políticos'],
      explanation: 'Seis millones de judíos — dos tercios de los judíos europeos — fueron asesinados sistemáticamente. Millones de otras personas (romaníes, discapacitados, LGBTQ+, presos políticos) también fueron asesinados.',
    },
    ru: {
      question: 'Холокост — это нацистский геноцид, направленный прежде всего против какой группы, помимо других?',
      options: ['Славянские народы', 'Цыганский народ', 'Еврейский народ', 'Политические оппоненты'],
      explanation: 'Шесть миллионов евреев — две трети европейского еврейства — были систематически уничтожены. Миллионы других (цыгане, инвалиды, ЛГБТК+, политические заключённые) также были убиты.',
    },
    mk: {
      question: 'Холокаустот беше нацистички геноцид насочен пред сè против која група, меѓу другите?',
      options: ['Словенски народи', 'Ромскиот народ', 'Еврејскиот народ', 'Политички противници'],
      explanation: 'Шест милиони Евреи — две третини од европското еврејство — биле систематски убиени. Милиони других (Роми, лица со попреченост, ЛГБТК+, политички затвореници) исто така биле убиени.',
    },
  },

  'mod5': {
    es: {
      question: 'La Guerra Fría fue principalmente un conflicto ideológico entre ¿cuáles dos sistemas?',
      options: ['Democracia y fascismo', 'Capitalismo/democracia y comunismo', 'Cristianismo e islam', 'Colonialismo y nacionalismo'],
      explanation: 'La Guerra Fría enfrentó al Occidente capitalista democrático (liderado por los EE.UU.) contra el Este comunista (liderado por la URSS).',
    },
    ru: {
      question: 'Холодная война была прежде всего идеологическим конфликтом между какими двумя системами?',
      options: ['Демократия и фашизм', 'Капитализм/демократия и коммунизм', 'Христианство и ислам', 'Колониализм и национализм'],
      explanation: 'Холодная война противопоставила капиталистический демократический Запад (под руководством США) коммунистическому Востоку (под руководством СССР).',
    },
    mk: {
      question: 'Студената Војна беше пред сè идеолошки конфликт меѓу кои два системи?',
      options: ['Демократија и фашизам', 'Капитализам/демократија и комунизам', 'Христијанство и ислам', 'Колонијализам и национализам'],
      explanation: 'Студената Војна го спротивставила капиталистичкиот демократски Запад (предводен од САД) наспроти комунистичкиот Исток (предводен од СССР).',
    },
  },

  'mod6': {
    es: {
      question: 'La Crisis de los Misiles de Cuba de 1962 — ¿cuál fue la justificación soviética para colocar misiles en Cuba?',
      options: ['Proteger a Cuba de una invasión estadounidense tras la Bahía de Cochinos', 'Los EE.UU. tenían misiles apuntando a la URSS desde Turquía', 'Cuba solicitó protección nuclear soviética', 'La URSS quería una base naval en el Caribe'],
      explanation: 'Aunque los misiles Júpiter estadounidenses en Turquía también fueron un factor en las negociaciones, la justificación declarada de los soviéticos fue proteger a Cuba tras el fracasado intento de invasión respaldado por la CIA en la Bahía de Cochinos en 1961.',
    },
    ru: {
      question: 'Карибский кризис 1962 года — каким было советское обоснование размещения ракет на Кубе?',
      options: ['Защита Кубы от вторжения США после Плая-Хирон', 'У США были ракеты, нацеленные на СССР из Турции', 'Куба попросила советской ядерной защиты', 'СССР хотел военно-морскую базу в Карибском море'],
      explanation: 'Хотя американские ракеты «Юпитер» в Турции также играли роль в переговорах, официальным советским обоснованием была защита Кубы после провалившейся поддержанной ЦРУ высадки в заливе Свиней в 1961 году.',
    },
    mk: {
      question: 'Кубанската Ракетна Криза од 1962 г. — која беше советската оправданост за поставување ракети во Куба?',
      options: ['Да ја заштитат Куба од американска инвазија по Заливот на Прасиња', 'САД имале ракети насочени кон СССР од Турција', 'Куба побарала советска нуклеарна заштита', 'СССР сакал поморска база во Карибите'],
      explanation: 'Иако американските ракети „Јупитер" во Турција исто така биле фактор во преговорите, официјалното советско оправдување беше заштита на Куба по неуспешниот обид за инвазија поддржан од ЦИА во Заливот на Прасиња во 1961 г.',
    },
  },

  'mod7': {
    es: {
      question: '¿Qué líder indio usó la desobediencia civil no violenta para liderar el movimiento de independencia de India contra el dominio británico?',
      options: ['Jawaharlal Nehru', 'Subhas Chandra Bose', 'Muhammad Ali Jinnah', 'Mahatma Gandhi'],
      explanation: 'La filosofía de satyagraha (fuerza de la verdad) y la resistencia no violenta de Gandhi se convirtieron en inspiración para los movimientos de derechos civiles en todo el mundo.',
    },
    ru: {
      question: 'Какой индийский лидер использовал ненасильственное гражданское неповиновение для руководства движением за независимость Индии от британского господства?',
      options: ['Джавахарлал Неру', 'Субхас Чандра Бос', 'Мухаммад Али Джинна', 'Махатма Ганди'],
      explanation: 'Философия сатьяграхи (силы истины) Ганди и ненасильственное сопротивление стали вдохновением для движений за гражданские права по всему миру.',
    },
    mk: {
      question: 'Кој индиски лидер користел ненасилен граѓански отпор за да го предводи движењето за независност на Индија против британската власт?',
      options: ['Џавахарлал Нехру', 'Субхас Чандра Бос', 'Мухамад Али Џина', 'Махатма Ганди'],
      explanation: 'Филозофијата на сатјаграха (сила на вистината) на Ганди и ненасилниот отпор станале инспирација за движењата за граѓански права низ целиот свет.',
    },
  },

  'mod8': {
    es: {
      question: '¿En qué año cayó el Muro de Berlín, simbolizando el fin de la Guerra Fría?',
      options: ['1985', '1987', '1989', '1991'],
      explanation: 'El Muro cayó el 9 de noviembre de 1989, tras el anuncio del gobierno de Alemania Oriental de que los ciudadanos podían cruzar libremente — esa noche las multitudes lo desmantelaron.',
    },
    ru: {
      question: 'В каком году пал Берлинский стена, символизируя окончание Холодной войны?',
      options: ['1985', '1987', '1989', '1991'],
      explanation: 'Стена рухнула 9 ноября 1989 года после того, как правительство ГДР объявило, что граждане могут свободно пересекать границу — в ту же ночь толпы начали её разбирать.',
    },
    mk: {
      question: 'Во која година паднал Берлинскиот Ѕид, симболизирајќи го крајот на Студената Војна?',
      options: ['1985', '1987', '1989', '1991'],
      explanation: 'Ѕидот паднал на 9 ноември 1989 г. откако источногерманската влада објавила дека граѓаните можат слободно да поминуваат — истата вечер масите почнале да го разурнуваат.',
    },
  },

  'mod9': {
    es: {
      question: '¿Quién inventó la World Wide Web en 1989, habilitando el internet moderno?',
      options: ['Steve Jobs', 'Bill Gates', 'Tim Berners-Lee', 'Vint Cerf'],
      explanation: 'Tim Berners-Lee, un científico británico del CERN, inventó la World Wide Web (HTTP, HTML y URLs) y la puso a disposición pública de forma gratuita.',
    },
    ru: {
      question: 'Кто изобрёл Всемирную паутину в 1989 году, заложив основу современного интернета?',
      options: ['Стив Джобс', 'Билл Гейтс', 'Тим Бернерс-Ли', 'Винт Сёрф'],
      explanation: 'Тим Бернерс-Ли, британский учёный из ЦЕРН, изобрёл Всемирную паутину (HTTP, HTML и URL) и сделал её общедоступной бесплатно.',
    },
    mk: {
      question: 'Кој го пронашол Светскиот Широк Веб во 1989 г., овозможувајќи го современиот интернет?',
      options: ['Стив Џобс', 'Бил Гејтс', 'Тим Бернерс-Ли', 'Винт Серф'],
      explanation: 'Тим Бернерс-Ли, британски научник во ЦЕРН, го пронашол Светскиот Широк Веб (HTTP, HTML и URL) и го направил слободно достапен за јавноста.',
    },
  },

  'mod10': {
    es: {
      question: 'Los atentados del 11 de septiembre de 2001 fueron perpetrados por ¿qué organización?',
      options: ['Los talibanes', 'Hezbolá', 'ISIS', 'Al-Qaeda'],
      explanation: 'Al-Qaeda, liderada por Osama bin Laden, orquestó los atentados usando aviones secuestrados. El gobierno talibán de Afganistán cobijaba a Al-Qaeda, desencadenando la invasión estadounidense.',
    },
    ru: {
      question: 'Теракты 11 сентября 2001 года совершила какая организация?',
      options: ['Талибан', 'Хезболла', 'ИГИЛ', 'Аль-Каида'],
      explanation: 'Аль-Каида под руководством Усамы бен Ладена организовала теракты с применением угнанных самолётов. Правительство талибов в Афганистане укрывало Аль-Каиду, что спровоцировало американское вторжение.',
    },
    mk: {
      question: 'Нападите на 11 септември 2001 г. биле извршени од која организација?',
      options: ['Талибанците', 'Хезболах', 'ИСИС', 'Ал-Каеда'],
      explanation: 'Ал-Каеда, предводена од Осама бин Ладен, ги орестрирала нападите користејќи отнесени авиони. Талибанската влада на Авганистан го засолнувала Ал-Каеда, предизвикувајќи ја американската инвазија.',
    },
  },

  'mod11': {
    es: {
      question: 'El Pacto Molotov-Ribbentrop de agosto de 1939 fue un acuerdo de no agresión entre ¿cuáles dos potencias que conmocionó al mundo?',
      options: ['Japón y Alemania', 'La URSS y Alemania', 'Italia y Alemania', 'La URSS y Japón'],
      explanation: 'El pacto secreto nazi-soviético asombró a los observadores que esperaban que los enemigos ideológicos chocaran. Incluía protocolos secretos que dividían Europa del Este en esferas de influencia, permitiendo a Hitler invadir Polonia sin oposición soviética.',
    },
    ru: {
      question: 'Пакт Молотова–Риббентропа, заключённый в августе 1939 года, был договором о ненападении между какими двумя державами, потрясшим весь мир?',
      options: ['Япония и Германия', 'СССР и Германия', 'Италия и Германия', 'СССР и Япония'],
      explanation: 'Тайный нацистско-советский пакт поразил наблюдателей, ожидавших столкновения идеологических врагов. Он включал секретные протоколы, разделявшие Восточную Европу на сферы влияния, что позволило Гитлеру вторгнуться в Польшу без советского противодействия.',
    },
    mk: {
      question: 'Пактот Молотов-Рибентроп од август 1939 г. беше договор за ненапаѓање меѓу кои две сили кој го шокирал светот?',
      options: ['Јапонија и Германија', 'СССР и Германија', 'Италија и Германија', 'СССР и Јапонија'],
      explanation: 'Тајниот нацистичко-советски пакт ги изненадил набљудувачите кои очекувале судир меѓу идеолошките непријатели. Вклучувал тајни протоколи за поделба на Источна Европа на сфери на влијание, дозволувајќи му на Хитлер да ја нападне Полска без советски отпор.',
    },
  },

  'mod12': {
    es: {
      question: 'La Conferencia de Bretton Woods (1944) estableció ¿cuáles dos grandes instituciones financieras internacionales que siguen siendo dominantes hoy?',
      options: ['OMC y Banco Mundial', 'FMI y Banco Mundial', 'FMI y OMC', 'OTAN y el Banco Mundial'],
      explanation: 'Bretton Woods creó el Fondo Monetario Internacional (FMI) para estabilizar los tipos de cambio y el Banco Mundial para financiar la reconstrucción. Estas instituciones dieron forma al orden económico internacional de posguerra.',
    },
    ru: {
      question: 'Бреттон-Вудская конференция (1944) создала какие два крупных международных финансовых института, доминирующих по сей день?',
      options: ['ВТО и Всемирный банк', 'МВФ и Всемирный банк', 'МВФ и ВТО', 'НАТО и Всемирный банк'],
      explanation: 'Бреттон-Вудс создал Международный валютный фонд (МВФ) для стабилизации обменных курсов и Всемирный банк для финансирования восстановления. Эти институты сформировали послевоенный международный экономический порядок.',
    },
    mk: {
      question: 'Конференцијата во Бретон Вудс (1944) воспоставила кои две големи меѓународни финансиски институции кои доминираат и денес?',
      options: ['СТО и Светска Банка', 'ММФ и Светска Банка', 'ММФ и СТО', 'НАТО и Светска Банка'],
      explanation: 'Бретон Вудс го создал Меѓународниот Монетарен Фонд (ММФ) за стабилизирање на девизните курсеви и Светска Банка за финансирање на обновувањето. Овие институции го обликувале послевоениот меѓународен економски поредок.',
    },
  },

  'mod13': {
    es: {
      question: 'Los bolcheviques de Lenin llegaron al poder en Rusia en 1917 prometiendo al pueblo ruso ¿cuáles tres cosas?',
      options: ['Libertad, igualdad y pan', 'Democracia, tierra y prosperidad', 'Paz, tierra y pan', 'Igualdad, justicia y trabajo'],
      explanation: '"Paz, Tierra y Pan" fue el poderoso eslogan de los bolcheviques que abordaba lo que los rusos más deseaban: el fin de la Primera Guerra Mundial, la redistribución de la tierra de los nobles a los campesinos y alimento para la población hambrienta.',
    },
    ru: {
      question: 'Большевики Ленина пришли к власти в России в 1917 году, частично пообещав русскому народу три вещи — какие именно?',
      options: ['Свобода, равенство и хлеб', 'Демократия, земля и процветание', 'Мир, земля и хлеб', 'Равенство, справедливость и труд'],
      explanation: '«Мир, земля и хлеб» — мощный лозунг большевиков, отвечавший на то, чего русские хотели больше всего: конца Первой мировой войны, раздела земли от дворян крестьянам и пропитания для голодающего населения.',
    },
    mk: {
      question: 'Болшевиците на Ленин дошле на власт во Русија во 1917 г. делумно ветувајќи му на рускиот народ кои три нешта?',
      options: ['Слобода, еднаквост и леб', 'Демократија, земја и просперитет', 'Мир, земја и леб', 'Еднаквост, правда и работа'],
      explanation: '„Мир, Земја и Леб" беше моќното мото на Болшевиците кое ги решавало она што Русите го сакале највеќе: крај на Првата Светска Војна, прераспределба на земјиштето од благородниците на селаните и храна за гладното население.',
    },
  },

  'mod14': {
    es: {
      question: 'La "teoría del dominó" estadounidense — usada para justificar la intervención en Vietnam — argumentaba que…',
      options: ['Los países comunistas eventualmente colapsarían como fichas de dominó', 'Si un país caía bajo el comunismo, los países vecinos seguirían', 'El desarrollo económico prevenía la expansión del comunismo', 'Las alianzas militares eran como una fila de fichas de dominó cayendo'],
      explanation: 'La teoría del dominó, popularizada por el presidente Eisenhower en 1954, sostenía que si un país caía bajo el comunismo (como Vietnam), los países vecinos caerían en secuencia. Este pensamiento impulsó el involucramiento estadounidense en el Sudeste Asiático.',
    },
    ru: {
      question: 'Американская «теория домино» — использовавшаяся для обоснования вмешательства во Вьетнаме — утверждала, что…',
      options: ['Коммунистические страны в конечном счёте рухнут, как домино', 'Если одна страна падёт под власть коммунизма, соседние последуют за ней', 'Экономическое развитие предотвращает распространение коммунизма', 'Военные союзы подобны ряду падающих костяшек домино'],
      explanation: 'Теория домино, популяризированная президентом Эйзенхауэром в 1954 году, гласила: если одна страна падёт под власть коммунизма (как Вьетнам), соседние страны последуют одна за другой. Эта концепция определяла участие США в Юго-Восточной Азии.',
    },
    mk: {
      question: 'Американската „теорија на доминото" — употребена за оправдување на интервенцијата во Виетнам — тврдела дека…',
      options: ['Комунистичките земји на крајот ќе пропаднат како доминото', 'Ако една земја паднела под комунизам, соседните ќе следеле', 'Економскиот развој го спречувал ширењето на комунизмот', 'Воените сојузи биле како низа паѓачки доминатури'],
      explanation: 'Теоријата на доминото, популаризирана од претседателот Ајзенхауер во 1954 г., тврдела дека ако една земја падне под комунизам (како Виетнам), соседните земји ќе паднат во секвенца. Ова размислување го поттикнало американското вклучување во Југоисточна Азија.',
    },
  },

  'mod15': {
    es: {
      question: '¿Qué política exterior estadounidense de 1947 — comprometiéndose a apoyar a los pueblos libres que resistían la subyugación comunista — se convirtió en una piedra angular de la estrategia de la Guerra Fría?',
      options: ['La Doctrina Monroe', 'El Plan Marshall', 'La Doctrina Truman', 'La Política de Contención'],
      explanation: 'La Doctrina Truman, anunciada en marzo de 1947, solicitó 400 millones de dólares para ayudar a Grecia y Turquía a resistir la presión comunista. Se convirtió en la doctrina más amplia de contener la expansión soviética en todo el mundo — la estrategia definitoria de la Guerra Fría.',
    },
    ru: {
      question: 'Какая американская внешнеполитическая доктрина 1947 года — обязывавшая поддерживать свободные народы, сопротивляющиеся коммунистическому порабощению, — стала краеугольным камнем стратегии Холодной войны?',
      options: ['Доктрина Монро', 'План Маршалла', 'Доктрина Трумэна', 'Политика сдерживания'],
      explanation: 'Доктрина Трумэна, провозглашённая в марте 1947 года, запросила 400 миллионов долларов на помощь Греции и Турции в противодействии коммунистическому давлению. Она стала более широкой доктриной сдерживания советской экспансии по всему миру — определяющей стратегией Холодной войны.',
    },
    mk: {
      question: 'Која американска надворешна политика од 1947 г. — посветена на поддршка на слободни народи кои се спротивставуваат на комунистичката поробеност — стана темел на стратегијата на Студената Војна?',
      options: ['Монроовата Доктрина', 'Маршаловиот План', 'Труманова Доктрина', 'Политиката на задржување'],
      explanation: 'Труманова Доктрина, објавена во март 1947 г., побарала 400 милиони долари за помош на Грција и Турција во отпорот на комунистичкиот притисок. Стана поширока доктрина за задржување на советската експанзија низ целиот свет — одредувачката стратегија на Студената Војна.',
    },
  },

};

export function getTranslatedQuestion(questionId: string, lang: Language): QuizQuestionTranslation | null {
  if (lang === 'en') return null;
  if (lang === 'de' || lang === 'fr') return getTranslatedQuestionDeFr(questionId, lang);
  return QUIZ_TRANS[questionId]?.[lang as ContentLang] ?? QUIZ_TRANS_EXPANSION[questionId]?.[lang as ContentLang] ?? null;
}
