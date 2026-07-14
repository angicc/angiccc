import type { Language } from './translations';

type ContentLang = Exclude<Language, 'en'>;
interface TimelineEventContent { title: string; description: string; }

const TIMELINE_TRANS: Record<string, Partial<Record<ContentLang, TimelineEventContent>>> = {
  't-cuneiform': {
    es: { title: 'Invención de la Escritura Cuneiforme', description: 'Los escribas sumerios en Uruk desarrollan el primer sistema de escritura del mundo, presionando marcas en forma de cuña en tablillas de arcilla para registrar inventarios de grano y comercio.' },
    ru: { title: 'Изобретение клинописи', description: 'Шумерские писцы в Уруке создают первую в мире систему письма, выдавливая клиновидные знаки на глиняных табличках для учёта зерна и торговли.' },
    mk: { title: 'Изум на Клинестото Писмо', description: 'Шумерските писари во Урук го развиваат првиот систем за пишување во светот, притискајќи клинести ознаки на глинени плочки за евидентирање на залихи и трговија.' },
  },
  't-pyramid': {
    es: { title: 'Gran Pirámide de Guiza', description: 'El faraón Keops completa la Gran Pirámide en Guiza — la estructura más alta del mundo durante más de 3.800 años.' },
    ru: { title: 'Великая пирамида Гизы', description: 'Фараон Хуфу завершает строительство Великой пирамиды в Гизе — высочайшего рукотворного сооружения мира на протяжении более 3800 лет.' },
    mk: { title: 'Големата Пирамида во Гиза', description: 'Фараонот Кеопс ја завршува Големата Пирамида во Гиза — највисоката градба во светот 3.800 години.' },
  },
  't-hammurabi': {
    es: { title: 'Código de Hammurabi', description: 'El rey Hammurabi de Babilonia promulga uno de los primeros códigos legales escritos de la historia, abarcando comercio, propiedad y justicia penal.' },
    ru: { title: 'Кодекс Хаммурапи', description: 'Вавилонский царь Хаммурапи издаёт один из первых письменных сводов законов в истории, охватывающий торговлю, собственность и уголовное правосудие.' },
    mk: { title: 'Хамурабиевиот Законик', description: 'Вавилонскиот крал Хамураби издава еден од најраните писани законски кодекси во историјата, опфаќајќи трговија, сопственост и кривична правда.' },
  },
  't-troy': {
    es: { title: 'Caída de Troya', description: 'La legendaria guerra de Troya termina con el saqueo griego, como lo conmemoró Homero en la Ilíada.' },
    ru: { title: 'Падение Трои', description: 'Легендарная Троянская война заканчивается разорением Трои греками, воспетым Гомером в «Илиаде».' },
    mk: { title: 'Падот на Троја', description: 'Легендарната Тројанска Војна завршува со грчкото освојување, овековечено во Хомеровата Илијада.' },
  },
  't-democracy': {
    es: { title: 'Democracia Ateniense', description: 'Clístenes introduce la democracia en Atenas — el primer sistema democrático del mundo, donde los ciudadanos votan directamente sobre las leyes.' },
    ru: { title: 'Афинская демократия', description: 'Клисфен вводит демократию в Афинах — первую в мире демократическую систему управления, где граждане напрямую голосуют за законы.' },
    mk: { title: 'Атинска Демократија', description: 'Клистен ја воведуваdemokratijata во Атина — прв демократски систем во светот, каде граѓаните директно гласаат за законите.' },
  },
  't-persian-wars': {
    es: { title: 'Batalla de Maratón', description: 'Los atenienses derrotan al ejército persa invasor en Maratón, preservando la independencia griega y convirtiéndose en símbolo de resistencia democrática.' },
    ru: { title: 'Битва при Марафоне', description: 'Афиняне разгромили вторгшееся персидское войско при Марафоне, сохранив греческую независимость и ставшие символом демократического сопротивления.' },
    mk: { title: 'Битката кај Маратон', description: 'Атињаните ги поразуваат напаѓачките персиски сили кај Маратон, зачувувајќи ја грчката независност и станувајќи симбол на демократски отпор.' },
  },
  't-parthenon': {
    es: { title: 'Construcción del Partenón', description: 'Bajo Pericles, Atenas construye el Partenón en la Acrópolis — obra maestra definitoria de la arquitectura clásica.' },
    ru: { title: 'Строительство Парфенона', description: 'При Перикле Афины возводят Парфенон на Акрополе — определяющий шедевр классической архитектуры.' },
    mk: { title: 'Градење на Партенонот', description: 'Под Перикле, Атина го гради Партенонот на Акрополот — дефинирачки ремек-дело на класичната архитектура.' },
  },
  't-alexander': {
    es: { title: 'Campaña Oriental de Alejandro', description: 'Alejandro Magno cruza a Asia, iniciando una década de conquistas que se extenderán desde Egipto hasta India y difundirán la cultura griega por todo el mundo conocido.' },
    ru: { title: 'Восточный поход Александра', description: 'Александр Великий переходит в Азию, начиная десятилетие завоеваний от Египта до Индии и распространяя греческую культуру по всему известному миру.' },
    mk: { title: 'Источната Кампања на Александар', description: 'Александар Велики преминува во Азија, започнувајќи декада на освојувања од Египет до Индија и ширејќи грчката култура низ познатиот свет.' },
  },
  't-roman-republic': {
    es: { title: 'Fundación de la República Romana', description: 'Roma expulsa a su último rey y establece una república gobernada por cónsules elegidos y un Senado.' },
    ru: { title: 'Основание Римской республики', description: 'Рим изгоняет последнего царя и устанавливает республику, управляемую избранными консулами и Сенатом.' },
    mk: { title: 'Основање на Римската Република', description: 'Рим го протерува последниот крал и воспоставува република управувана од избрани конзули и Сенат.' },
  },
  't-caesar': {
    es: { title: 'Asesinato de Julio César', description: 'Julio César es asesinado en el Senado en los Idus de Marzo, desencadenando una guerra civil y la transformación de Roma de república a imperio.' },
    ru: { title: 'Убийство Юлия Цезаря', description: 'Юлий Цезарь убит в Сенате в мартовские иды, что вызвало гражданскую войну и превратило Рим из республики в империю.' },
    mk: { title: 'Атентатот врз Јулиј Цезар', description: 'Јулиј Цезар е убиен во Сенатот на Мартовски Иди, предизвикувајќи граѓанска војна и трансформацијата на Рим од република во царство.' },
  },
  't-pax-romana': {
    es: { title: 'Augusto y la Pax Romana', description: 'Octavio se convierte en Augusto, primer emperador de Roma. Comienza la Pax Romana — dos siglos de relativa paz y prosperidad.' },
    ru: { title: 'Август и Pax Romana', description: 'Октавиан становится Августом, первым императором Рима. Начинается Pax Romana — два века относительного мира и процветания.' },
    mk: { title: 'Август и Pax Romana', description: 'Октавијан станува Август, прв цар на Рим. Започнува Pax Romana — два века на релативен мир и просперитет.' },
  },
  't-silk-road': {
    es: { title: 'Apertura de la Ruta de la Seda', description: 'Rutas comerciales que unen China con Asia Central y el Mediterráneo comienzan a operar, permitiendo el intercambio de seda, especias e ideas entre continentes.' },
    ru: { title: 'Открытие Шёлкового пути', description: 'Торговые пути, связывающие Китай со Средней Азией и Средиземноморьем, начинают действовать, открывая обмен шёлком, пряностями и идеями между континентами.' },
    mk: { title: 'Отворање на Патот на Свилата', description: 'Трговски патишта кои ја поврзуваат Кина со Централна Азија и Медитеранот почнуваат да работат, овозможувајќи размена на свила, зачини и идеи меѓу континентите.' },
  },
  't-cyrus-great': {
    es: { title: 'Ciro el Grande Funda el Imperio Persa', description: 'Ciro II de Persia derrota a los imperios medo, lidio y babilonio para crear el mayor imperio del mundo hasta entonces, introduciendo una política de tolerancia religiosa.' },
    ru: { title: 'Кир Великий основывает Персидскую империю', description: 'Кир II Персидский побеждает мидийцев, лидийцев и вавилонян, создавая крупнейшую империю своего времени и вводя политику религиозной терпимости.' },
    mk: { title: 'Кир Велики ја Основал Персиската Империја', description: 'Кир II ги покорува Медијците, Лидијците и Вавилонците создавајќи ја најголемата империја на дотогашниот свет, воведувајќи политика на верска толеранција.' },
  },
  't-ashoka': {
    es: { title: 'Emperador Ashoka y la Difusión del Budismo', description: 'Tras la brutal conquista de Kalinga, el emperador maurya Ashoka se convierte al budismo y gobierna por el dharma, enviando misioneros por Asia.' },
    ru: { title: 'Император Ашока и распространение буддизма', description: 'После жестокого завоевания Калинги маурийский царь Ашока принимает буддизм и правит согласно дхарме, отправляя миссионеров по всей Азии.' },
    mk: { title: 'Царот Ашока и Ширењето на Будизмот', description: 'По грубото освојување на Калинга, маурјанскиот цар Ашока се обратил кон будизмот и владее според дарма, испраќајќи мисионари низ Азија.' },
  },
  't-han-dynasty': {
    es: { title: 'La Dinastía Han Unifica China', description: 'La dinastía Han establece una edad de oro de la civilización china, expandiendo la Ruta de la Seda, desarrollando el papel y entronizando la ética confuciana.' },
    ru: { title: 'Династия Хань объединяет Китай', description: 'Династия Хань создаёт золотой век китайской цивилизации, расширяя Шёлковый путь, изобретая бумагу и закрепляя конфуцианскую этику на государственной службе.' },
    mk: { title: 'Династијата Хан ја Обединила Кина', description: 'Династијата Хан воспоставила златна ера на кинеска цивилизација, проширувајќи го Патот на Свилата, развивајќи хартија и вкоренувајќи ги конфучиевите вредности.' },
  },
  't-egypt-afterlife': {
    es: { title: 'Libro Egipcio de los Muertos', description: 'Los sacerdotes del Imperio Nuevo de Egipto compilan el Libro de los Muertos — una guía para navegar el más allá, reflejo de una civilización donde la religión, la muerte y la vida cotidiana eran inseparables.' },
    ru: { title: 'Египетская Книга мёртвых', description: 'Жрецы египетского Нового царства составляют Книгу мёртвых — руководство по путешествию в загробный мир, отражающее цивилизацию, где религия, смерть и повседневная жизнь были неразделимы.' },
    mk: { title: 'Египетска Книга на Мртвите', description: 'Египетските свештеници го составуваат Книгата на Мртвите — водич за навигација во подземниот свет, одразувајќи цивилизација каде религијата, смртта и секојдневниот живот биле неразделни.' },
  },
  't-ramesses': {
    es: { title: 'Ramsés II y el Imperio Nuevo', description: 'El faraón Ramsés II — uno de los mayores gobernantes de Egipto — reina durante 66 años, combate a los hititas en Kadesh, construye los templos de Abu Simbel y consolida el dominio egipcio.' },
    ru: { title: 'Рамсес II и Новое царство', description: 'Фараон Рамсес II — один из величайших правителей Египта — царствует 66 лет, сражается с хеттами при Кадеше, строит храмы Абу-Симбела и утверждает египетское господство.' },
    mk: { title: 'Рамзес II и Новото Кралство', description: 'Фараонот Рамзес II — еден од најголемите владетели на Египет — владее 66 години, се борел со Хетитите кај Кадеш, ги изградил храмовите во Абу Симбел.' },
  },
  't-rome-fall': {
    es: { title: 'Caída de Roma Occidental', description: 'El caudillo germánico Odoacro depone al último emperador romano occidental, marcando el fin tradicional del Imperio Romano de Occidente.' },
    ru: { title: 'Падение Западного Рима', description: 'Германский вождь Одоакр свергает последнего западноримского императора, ознаменовав традиционный конец Западной Римской империи.' },
    mk: { title: 'Падот на Западниот Рим', description: 'Германскиот старешина Одоакар го детронизира последниот западен римски цар, означувајќи го традиционалниот крај на Западната Римска Империја.' },
  },
  't-charlemagne': {
    es: { title: 'Carlomagno Coronado Emperador', description: 'El papa León III corona a Carlomagno "Emperador de los Romanos" la noche de Navidad en Roma, creando el concepto de un imperio cristiano europeo.' },
    ru: { title: 'Коронация Карла Великого', description: 'Папа Лев III коронует Карла Великого «Императором римлян» в рождественскую ночь в Риме, создавая концепцию христианской европейской империи.' },
    mk: { title: 'Крунисување на Карло Велики', description: 'Папата Лав III го круниса Карло Велики за „Цар на Римјаните" на Божиќ во Рим, создавајќи концепт на христијанска европска империја.' },
  },
  't-islam': {
    es: { title: 'Muerte de Mahoma y Expansión Islámica', description: 'Tras la muerte de Mahoma, los ejércitos islámicos se expanden rápidamente por Oriente Medio, Persia y el norte de África, creando una vasta nueva civilización.' },
    ru: { title: 'Смерть Мухаммада и исламская экспансия', description: 'После смерти Мухаммада исламские армии стремительно распространяются по Ближнему Востоку, Персии и Северной Африке, создавая обширную новую цивилизацию.' },
    mk: { title: 'Смртта на Мухамед и Исламска Експанзија', description: 'По смртта на Мухамед, исламските армии брзо се шират низ Блискиот Исток, Персија и Северна Африка, создавајќи огромна нова цивилизација.' },
  },
  't-golden-age': {
    es: { title: 'Casa de la Sabiduría, Bagdad', description: 'El califa abasí Al-Mamún establece la Casa de la Sabiduría en Bagdad, el mayor centro de aprendizaje científico y filosófico del mundo.' },
    ru: { title: 'Дом мудрости, Багдад', description: 'Аббасидский халиф аль-Мамун основывает Дом мудрости в Багдаде — крупнейший в мире центр научного и философского знания.' },
    mk: { title: 'Куќата на Мудроста, Багдад', description: 'Абасидскиот калиф Ал-Мамун ја основал Куќата на Мудроста во Багдад, најголемиот светски центар на научно и филозофско учење.' },
  },
  't-hastings': {
    es: { title: 'Batalla de Hastings', description: 'Guillermo el Conquistador derrota al rey Harold de Inglaterra, transformando fundamentalmente la cultura, el idioma y el gobierno ingleses.' },
    ru: { title: 'Битва при Гастингсе', description: 'Вильгельм Завоеватель побеждает короля Гарольда Английского, коренным образом преобразуя английскую культуру, язык и управление.' },
    mk: { title: 'Битката кај Хастингс', description: 'Вилхелм Освојувачот го поразува Кралот Харолд на Англија, фундаментално трансформирајќи ја англиската култура, јазик и управување.' },
  },
  't-crusades': {
    es: { title: 'Primera Cruzada Convocada', description: 'El papa Urbano II llama a una guerra santa para recuperar Jerusalén, lanzando la Primera Cruzada y siglos de conflicto religioso en Tierra Santa.' },
    ru: { title: 'Призыв к Первому крестовому походу', description: 'Папа Урбан II призывает к священной войне за освобождение Иерусалима, начиная Первый крестовый поход и столетия религиозных конфликтов на Святой земле.' },
    mk: { title: 'Повик за Прв Крстоносен Поход', description: 'Папата Урбан II повикал на света војна за повраток на Ерусалим, покренувајќи го Првиот Крстоносен Поход и векови верски конфликти во Светата Земја.' },
  },
  't-magna-carta': {
    es: { title: 'Magna Carta', description: 'El rey Juan de Inglaterra es obligado a firmar la Magna Carta, limitando el poder real y estableciendo que el rey está sujeto al estado de derecho.' },
    ru: { title: 'Великая хартия вольностей', description: 'Король Иоанн Английский вынужден подписать Великую хартию вольностей, ограничивающую королевскую власть и устанавливающую верховенство закона.' },
    mk: { title: 'Велика Повелба', description: 'Кралот Јован на Англија е принуден да ја потпише Magna Carta, ограничувајќи ја кралската власт и воспоставувајќи дека кралот е подложен на владеење на правото.' },
  },
  't-mongols': {
    es: { title: 'Fundación del Imperio Mongol', description: 'Gengis Kan une a las tribus mongolas e inicia conquistas que crearán el mayor imperio contiguo de la historia.' },
    ru: { title: 'Основание Монгольской империи', description: 'Чингисхан объединяет монгольские племена и начинает завоевания, создавшие крупнейшую сухопутную империю в истории.' },
    mk: { title: 'Основање на Монголската Империја', description: 'Џингис Кан ги обединил монголските племиња и ги започнал освојувањата кои ќе создадат најголемата копнена империја во историјата.' },
  },
  't-black-death': {
    es: { title: 'La Peste Negra llega a Europa', description: 'La peste bubónica llega a Sicilia, iniciando una pandemia que matará al 30-60% de la población europea en los siguientes seis años.' },
    ru: { title: 'Чёрная смерть достигает Европы', description: 'Бубонная чума достигает Сицилии, начиная пандемию, которая унесёт жизни 30-60% населения Европы за следующие шесть лет.' },
    mk: { title: 'Черната Чума Стигнала во Европа', description: 'Бубонската чума стигнала на Сицилија, почнувајќи пандемија која ќе убие 30-60% од европското население во следните шест години.' },
  },
  't-printing-press': {
    es: { title: 'La Imprenta de Gutenberg', description: 'Johannes Gutenberg inventa la imprenta de tipos móviles, haciendo los libros asequibles y permitiendo la rápida difusión del Renacimiento y la Reforma.' },
    ru: { title: 'Печатный станок Гутенберга', description: 'Иоганн Гутенберг изобретает печатный станок с наборными литерами, делая книги доступными и обеспечивая быстрое распространение Ренессанса и Реформации.' },
    mk: { title: 'Печатарската Преса на Гутенберг', description: 'Јохан Гутенберг го измислил подвижниот тип, правејќи книги достапни и овозможувајќи брзо ширење на Ренесансата и Реформацијата.' },
  },
  't-columbus': {
    es: { title: 'Colón Llega a las Américas', description: 'Cristóbal Colón, navegando para España, desembarca en el Caribe, iniciando el contacto sostenido entre Europa y las Américas.' },
    ru: { title: 'Колумб достигает Америки', description: 'Христофор Колумб, плывущий под флагом Испании, высаживается на Карибских островах, начиная устойчивый контакт между Европой и Америкой.' },
    mk: { title: 'Колумбо Стигнал до Америките', description: 'Кристофер Колумбо, пловејќи за Шпанија, слегол во Карибите, почнувајќи одржан контакт меѓу Европа и Америките.' },
  },
  't-vasco': {
    es: { title: 'Vasco da Gama Llega a India', description: 'El explorador portugués Vasco da Gama navega alrededor de África para llegar a India, abriendo una ruta marítima directa al comercio de especias de Asia.' },
    ru: { title: 'Васко да Гама достигает Индии', description: 'Португальский мореплаватель Васко да Гама огибает Африку и достигает Индии, открывая прямой морской путь к пряностям Азии.' },
    mk: { title: 'Васко да Гама Стигнал до Индија', description: 'Португалскиот истражувач Васко да Гама пловел околу Африка за да стигне до Индија, отворајќи директен поморски пат до азиската трговија со зачини.' },
  },
  't-luther': {
    es: { title: 'Las 95 Tesis de Lutero', description: 'Martín Lutero publica sus 95 Tesis desafiando la corrupción eclesiástica y las indulgencias, lanzando la Reforma Protestante.' },
    ru: { title: '95 тезисов Лютера', description: 'Мартин Лютер публикует 95 тезисов, бросая вызов церковной коррупции и индульгенциям, и запуская Протестантскую реформацию.' },
    mk: { title: '95-те Тези на Лутер', description: 'Мартин Лутер ги публикувал своите 95 тези оспорувајќи ја корупцијата на Црквата и одговорите, покренувајќи ја Протестантската Реформација.' },
  },
  't-copernicus': {
    es: { title: 'Revolución Copernicana', description: 'Nicolás Copérnico publica su modelo heliocéntrico del sistema solar, iniciando la Revolución Científica.' },
    ru: { title: 'Коперниканская революция', description: 'Николай Коперник публикует гелиоцентрическую модель Солнечной системы, положив начало Научной революции.' },
    mk: { title: 'Коперниканска Револуција', description: 'Николај Коперник го публикувал хелиоцентричниот модел на сончевиот систем, почнувајќи ја Научната Револуција.' },
  },
  't-armada': {
    es: { title: 'Derrota de la Armada Española', description: 'Inglaterra derrota a la Armada Española, señalando el declive del dominio naval español y el ascenso del poder marítimo inglés.' },
    ru: { title: 'Разгром Испанской армады', description: 'Англия разгромила Испанскую армаду, ознаменовав упадок испанского морского господства и подъём английской морской мощи.' },
    mk: { title: 'Поразот на Шпанската Армада', description: 'Англија ја победила Шпанската Армада, сигнализирајќи го опаѓањето на шпанската поморска доминација и подемот на англиската морска моќ.' },
  },
  't-galileo': {
    es: { title: 'Galileo y el Telescopio', description: 'Galileo apunta el telescopio al cielo, descubriendo las lunas de Júpiter y las fases de Venus, confirmando el modelo copernicano.' },
    ru: { title: 'Галилей и телескоп', description: 'Галилей направляет телескоп на небо, обнаруживая спутники Юпитера и фазы Венеры, подтверждая модель Коперника.' },
    mk: { title: 'Галилеј и Телескопот', description: 'Галилеј го насочил телескопот кон небото, откривајќи месечини на Јупитер и фази на Венера, потврдувајќи го Коперниковиот модел.' },
  },
  't-thirty-years-war': {
    es: { title: 'Inicio de la Guerra de los Treinta Años', description: 'Una guerra religiosa y política devastadora desgarra Europa central, matando a 8 millones de personas y rediseñando el continente.' },
    ru: { title: 'Начало Тридцатилетней войны', description: 'Разрушительная религиозно-политическая война раздирает Центральную Европу, унося 8 миллионов жизней и перекраивая континент.' },
    mk: { title: 'Почеток на Триесетгодишната Војна', description: 'Разурнувачка верска и политичка војна ја раскинала Централна Европа, убивајќи 8 милиони луѓе и преобликувајќи го континентот.' },
  },
  't-westphalia': {
    es: { title: 'Paz de Westfalia', description: 'Los tratados que ponen fin a la Guerra de los Treinta Años establecen el principio de soberanía nacional, fundamento del orden internacional moderno.' },
    ru: { title: 'Вестфальский мир', description: 'Договоры, завершившие Тридцатилетнюю войну, устанавливают принцип национального суверенитета — основу современного международного порядка.' },
    mk: { title: 'Мирот во Вестфалија', description: 'Договорите со кои завршила Триесетгодишната Војна го воспоставиле принципот на национален суверенитет — темелот на современиот меѓународен поредок.' },
  },
  't-newton': {
    es: { title: 'Principia de Newton', description: 'Isaac Newton publica sus leyes del movimiento y la gravitación universal, proporcionando un marco matemático para comprender el universo físico.' },
    ru: { title: '«Начала» Ньютона', description: 'Исаак Ньютон публикует законы движения и всемирного тяготения, создавая математическую основу для понимания физической вселенной.' },
    mk: { title: 'Принципите на Њутн', description: 'Исак Њутн ги публикувал законите за движење и универзалната гравитација, обезбедувајќи математичка рамка за разбирање на физичкиот универзум.' },
  },
  't-glorious-revolution': {
    es: { title: 'Revolución Gloriosa', description: 'La Revolución Gloriosa de Inglaterra establece la monarquía constitucional y la supremacía parlamentaria, influyendo en los gobiernos democráticos del mundo.' },
    ru: { title: 'Славная революция', description: 'Английская Славная революция устанавливает конституционную монархию и парламентское верховенство, влияя на демократические правительства во всём мире.' },
    mk: { title: 'Славна Револуција', description: 'Англиската Славна Револуција ја воспоставила уставната монархија и парламентарната супремација, влијаејќи на демократски влади низ светот.' },
  },
  't-american-revolution': {
    es: { title: 'Declaración de Independencia de los Estados Unidos', description: 'Las trece colonias americanas declaran la independencia de Gran Bretaña, fundando una república basada en los principios ilustrados de libertad y derechos naturales.' },
    ru: { title: 'Американская Декларация независимости', description: 'Тринадцать американских колоний объявляют независимость от Британии, основывая республику на просветительских принципах свободы и естественных прав.' },
    mk: { title: 'Американска Декларација за Независност', description: 'Тринаесетте американски колонии ја прогласуваат независноста од Британија, основајќи република базирана на просветителски принципи на слобода и природни права.' },
  },
  't-french-revolution': {
    es: { title: 'Revolución Francesa', description: 'La Revolución Francesa derroca la monarquía y la aristocracia, difundiendo los ideales de libertad, igualdad y soberanía nacional por toda Europa.' },
    ru: { title: 'Французская революция', description: 'Французская революция свергает монархию и аристократию, распространяя идеалы свободы, равенства и народного суверенитета по всей Европе.' },
    mk: { title: 'Француска Револуција', description: 'Француската Револуција ги урнала монархијата и аристократијата, ширејќи ги идеалите на слобода, еднаквост и национален суверенитет низ Европа.' },
  },
  't-steam-engine': {
    es: { title: 'La Máquina de Vapor de Watt', description: 'James Watt patenta una máquina de vapor mejorada, proporcionando la fuente de energía para la Revolución Industrial británica.' },
    ru: { title: 'Паровая машина Уатта', description: 'Джеймс Уатт патентует усовершенствованную паровую машину, обеспечивая источник энергии для британской промышленной революции.' },
    mk: { title: 'Парната Машина на Ват', description: 'Џејмс Ват го патентирал подобрениот паров мотор, обезбедувајќи извор на енергија за британската Индустриска Револуција.' },
  },
  't-napoleon': {
    es: { title: 'Napoleón Coronado Emperador', description: 'Napoleón Bonaparte se corona Emperador de Francia, iniciando una década de conquista europea que difunde los ideales revolucionarios y remodela el continente.' },
    ru: { title: 'Наполеон коронован императором', description: 'Наполеон Бонапарт коронует себя Императором Франции, начиная десятилетие европейских завоеваний, распространяющих революционные идеалы и перекраивающих континент.' },
    mk: { title: 'Наполеон Крунисан за Цар', description: 'Наполеон Бонапарта се крунисал за Цар на Франција, почнувајќи декада на европско освојување кое ги шири револуционерните идеали.' },
  },
  't-railways': {
    es: { title: 'Ferrocarril Liverpool-Mánchester', description: 'El primer ferrocarril de pasajeros del mundo abre en Inglaterra, iniciando la era ferroviaria y la dramática reducción de las distancias.' },
    ru: { title: 'Железная дорога Ливерпуль–Манчестер', description: 'В Англии открывается первая в мире пассажирская железная дорога, начиная железнодорожную эпоху и резкое сокращение расстояний.' },
    mk: { title: 'Железницата Ливерпул-Манчестер', description: 'Во Англија се отвора првата патничка железница во светот, почнувајќи ја железничката ера и драматичното намалување на растојанијата.' },
  },
  't-communist-manifesto': {
    es: { title: 'Manifiesto Comunista', description: 'Karl Marx y Friedrich Engels publican El Manifiesto Comunista, texto fundacional de los movimientos socialistas y comunistas de todo el mundo.' },
    ru: { title: 'Коммунистический манифест', description: 'Карл Маркс и Фридрих Энгельс публикуют «Манифест Коммунистической партии» — основополагающий текст для социалистических и коммунистических движений всего мира.' },
    mk: { title: 'Комунистички Манифест', description: 'Карл Маркс и Фридрих Енгелс го публикуваат Комунистичкиот Манифест, основен текст за социјалистичките и комунистичките движења низ светот.' },
  },
  't-american-civil-war': {
    es: { title: 'Guerra Civil Americana', description: 'La Guerra Civil de los Estados Unidos (1861-1865) pone fin a la esclavitud y preserva la Unión, convirtiéndose en la guerra más sangrienta de la historia americana.' },
    ru: { title: 'Американская Гражданская война', description: 'Гражданская война в США (1861–1865) отменяет рабство и сохраняет Союз, став самой кровопролитной войной в американской истории.' },
    mk: { title: 'Американска Граѓанска Војна', description: 'Американската Граѓанска Војна (1861-1865) го укинала ропството и ја зачувала Унијата, станувајќи најкрвавата војна во американската историја.' },
  },
  't-darwin': {
    es: { title: 'El Origen de las Especies de Darwin', description: 'Charles Darwin publica su teoría de la evolución por selección natural, una de las ideas científicas más revolucionarias de la historia.' },
    ru: { title: '«Происхождение видов» Дарвина', description: 'Чарльз Дарвин публикует теорию эволюции путём естественного отбора — одну из самых революционных научных идей в истории.' },
    mk: { title: 'Потекло на Видовите на Дарвин', description: 'Чарлс Дарвин ја публикувал теоријата за еволуцијата преку природна селекција — една од најреволуционерните научни идеи во историјата.' },
  },
  't-wwi': {
    es: { title: 'Comienza la Primera Guerra Mundial', description: 'El asesinato del archiduque Francisco Fernando desencadena una reacción en cadena que hunde a Europa y gran parte del mundo en cuatro años de devastadora guerra industrial.' },
    ru: { title: 'Начало Первой мировой войны', description: 'Убийство эрцгерцога Франца Фердинанда запускает цепную реакцию, погружая Европу и большую часть мира в четыре года опустошительной промышленной войны.' },
    mk: { title: 'Почеток на Првата Светска Војна', description: 'Атентатот врз Ерцхерцогот Франц Фердинанд предизвикал синџирна реакција која ја потопила Европа и голем дел од светот во четири години разурнувачка индустриска војна.' },
  },
  't-russian-revolution': {
    es: { title: 'Revolución Rusa', description: 'La Revolución Bolchevique bajo Lenin derroca al Zar y establece el primer estado comunista del mundo, la Unión Soviética.' },
    ru: { title: 'Русская революция', description: 'Большевистская революция под руководством Ленина свергает царя и создаёт первое в мире коммунистическое государство — Советский Союз.' },
    mk: { title: 'Руска Револуција', description: 'Болшевичката Револуција под Ленин го урнала Царот и го воспоставила првиот комунистички режим во светот, Советскиот Сојуз.' },
  },
  't-versailles': {
    es: { title: 'Tratado de Versalles', description: 'El acuerdo de paz que pone fin a la Primera Guerra Mundial impone condiciones duras a Alemania, contribuyendo a los resentimientos que llevaron a la Segunda Guerra Mundial.' },
    ru: { title: 'Версальский договор', description: 'Мирное соглашение, завершившее Первую мировую войну, налагает суровые условия на Германию, способствуя обидам, которые привели ко Второй мировой войне.' },
    mk: { title: 'Версајскиот Договор', description: 'Мировниот договор со кој завршила Первата Светска Војна наметнал тешки услови на Германија, придонесувајќи кон незадоволствата кои доведоа до Втората Светска Војна.' },
  },
  't-great-depression': {
    es: { title: 'Comienza la Gran Depresión', description: 'El Crack de Wall Street desencadena una depresión económica global, causando desempleo masivo e inestabilidad política que impulsa movimientos extremistas.' },
    ru: { title: 'Начало Великой депрессии', description: 'Крах Уолл-стрит запускает мировую экономическую депрессию, вызывая массовую безработицу и политическую нестабильность, усиливающую экстремизм.' },
    mk: { title: 'Почеток на Големата Депресија', description: 'Крашот на Волстрит предизвикал глобална економска депресија, создавајќи масовна невработеност и политичка нестабилност која ги зајакнала екстремистичките движења.' },
  },
  't-wwii': {
    es: { title: 'Comienza la Segunda Guerra Mundial', description: 'La invasión de Polonia por Alemania el 1 de septiembre desencadena la Segunda Guerra Mundial — el conflicto más mortífero de la historia humana, con 70-85 millones de muertos.' },
    ru: { title: 'Начало Второй мировой войны', description: 'Вторжение Германии в Польшу 1 сентября развязывает Вторую мировую войну — самый смертоносный конфликт в истории человечества, унёсший 70–85 миллионов жизней.' },
    mk: { title: 'Почеток на Втората Светска Војна', description: 'Германската инвазија на Полска на 1 септември ја покренала Втората Светска Војна — најсмртоносниот конфликт во историјата на човештвото, со 70-85 милиони мртви.' },
  },
  't-holocaust': {
    es: { title: 'Holocausto — Conferencia de Wannsee', description: 'La Alemania nazi implementa la "Solución Final", asesinando sistemáticamente a 6 millones de judíos y millones más en un genocidio industrial.' },
    ru: { title: 'Холокост — Ванзейская конференция', description: 'нацистская Германия реализует «Окончательное решение», систематически уничтожая 6 миллионов евреев и миллионы других в промышленном геноциде.' },
    mk: { title: 'Холокаустот — Конференција Ванзее', description: 'Нацистичка Германија го спроведува „Конечното Решение", систематски убивајќи 6 милиони Евреи и милиони други во индустриски геноцид.' },
  },
  't-hiroshima': {
    es: { title: 'Bombas Atómicas sobre Japón', description: 'EEUU lanza bombas atómicas sobre Hiroshima y Nagasaki, poniendo fin a la Segunda Guerra Mundial e inaugurando la era nuclear.' },
    ru: { title: 'Атомные бомбы на Японию', description: 'США сбрасывают атомные бомбы на Хиросиму и Нагасаки, завершая Вторую мировую войну и открывая ядерную эпоху.' },
    mk: { title: 'Атомски Бомби врз Јапонија', description: 'САД фрлиле атомски бомби на Хирошима и Нагасаки, завршувајќи ја Втората Светска Војна и отворајќи ја нуклеарната ера.' },
  },
  't-cold-war': {
    es: { title: 'Comienza la Guerra Fría', description: 'Estados Unidos anuncia la Doctrina Truman para contener el comunismo, iniciando cuatro décadas de competencia geopolítica entre las superpotencias.' },
    ru: { title: 'Начало холодной войны', description: 'США объявляют доктрину Трумэна для сдерживания коммунизма, начиная четыре десятилетия геополитического соперничества между сверхдержавами.' },
    mk: { title: 'Почеток на Студената Војна', description: 'САД ја прогласиле Труман Доктрината за задржување на комунизмот, почнувајќи четири децении геополитичка конкуренција меѓу суперсилите.' },
  },
  't-decolonization': {
    es: { title: 'Independencia de India', description: 'India y Pakistán obtienen la independencia de Gran Bretaña, iniciando una ola de descolonización que da independencia a decenas de nuevas naciones en las siguientes décadas.' },
    ru: { title: 'Независимость Индии', description: 'Индия и Пакистан обретают независимость от Британии, начиная волну деколонизации, давшей независимость десяткам новых государств в последующие десятилетия.' },
    mk: { title: 'Независноста на Индија', description: 'Индија и Пакистан добиле независност од Британија, почнувајќи бран на деколонизација кој им дал независност на десетици нови нации во следните децении.' },
  },
  't-moon': {
    es: { title: 'Alunizaje', description: 'El Apolo 11 de la NASA lleva a Neil Armstrong y Buzz Aldrin a la Luna — el mayor logro individual de la carrera espacial.' },
    ru: { title: 'Высадка на Луне', description: 'Аполлон-11 НАСА доставляет Нила Армстронга и Базза Олдрина на Луну — величайшее единичное достижение Космической гонки.' },
    mk: { title: 'Слетување на Месечината', description: 'Аполо 11 на НАСА ги слетал Нил Армстронг и Баз Олдрин на Месечината — најголемото единствено достигнување на Трката во Вселената.' },
  },
  't-berlin-wall': {
    es: { title: 'Caída del Muro de Berlín', description: 'El Muro de Berlín cae el 9 de noviembre de 1989, simbolizando el colapso de la Europa comunista oriental y el fin de la Guerra Fría.' },
    ru: { title: 'Падение Берлинской стены', description: 'Берлинская стена падает 9 ноября 1989 года, символизируя крах коммунистической Восточной Европы и конец холодной войны.' },
    mk: { title: 'Падот на Берлинскиот Ѕид', description: 'Берлинскиот Ѕид паднал на 9 ноември 1989, симболизирајќи го распадот на комунистичка Источна Европа и крајот на Студената Војна.' },
  },
  't-internet': {
    es: { title: 'La World Wide Web se hace pública', description: 'Tim Berners-Lee pone la World Wide Web a disposición del público, iniciando la era de Internet y transformando la comunicación y el comercio humanos.' },
    ru: { title: 'World Wide Web становится общедоступной', description: 'Тим Бернерс-Ли открывает World Wide Web для общего пользования, начиная интернет-эпоху и преобразуя человеческое общение и торговлю.' },
    mk: { title: 'World Wide Web стана Јавна', description: 'Тим Бернерс-Ли ја направил World Wide Web јавно достапна, почнувајќи ја интернет ерата и трансформирајќи ја човечката комуникација и трговија.' },
  },
  't-9-11': {
    es: { title: 'Ataques del 11 de Septiembre', description: 'Los ataques de Al-Qaeda matan a 3.000 personas en Nueva York y Washington, desencadenando la Guerra contra el Terror y redefiniéndose la seguridad global durante décadas.' },
    ru: { title: 'Теракты 11 сентября', description: 'Атаки «Аль-Каиды» убивают 3000 человек в Нью-Йорке и Вашингтоне, развязывая Войну с террором и переопределяя глобальную безопасность на десятилетия вперёд.' },
    mk: { title: 'Напади на 11 Септември', description: 'Нападите на Ал-Каеда убиле 3.000 луѓе во Њујорк и Вашингтон, покренувајќи ја Војната против Тероризмот и преобликувајќи ја глобалната безбедност за децении.' },
  },
  't-yugoslav-wars': {
    es: { title: 'Las Guerras Yugoslavas', description: 'La violenta disolución de Yugoslavia produce una serie de guerras. La Guerra de Bosnia (1992-1995) incluye el genocidio de Srebrenica, el peor de Europa desde la Segunda Guerra Mundial.' },
    ru: { title: 'Югославские войны', description: 'Насильственный распад Югославии порождает серию войн. Боснийская война (1992–1995) включает Сребреницкий геноцид — худший в Европе со времён Второй мировой войны.' },
    mk: { title: 'Југословенски Војни', description: 'Насилниот распад на Југославија создал серија войни. Босанската Војна (1992-1995) го вклучила геноцидот во Сребреница — најлошиот во Европа по Втората Светска Војна.' },
  },
  't-srebrenica': {
    es: { title: 'Masacre de Srebrenica', description: 'Fuerzas serbobosnias asesinan a más de 8.000 hombres y niños bosníacos en una zona segura declarada por la ONU, el peor acto de genocidio en Europa desde el Holocausto.' },
    ru: { title: 'Сребреницкий расстрел', description: 'Боснийско-сербские силы убивают более 8000 бошняков-мужчин и мальчиков в объявленной ООН безопасной зоне — худшее проявление геноцида в Европе со времён Холокоста.' },
    mk: { title: 'Масакрот во Сребреница', description: 'Босанско-српските сили убиле повеќе од 8.000 бошњачки мажи и момчиња во зона безбедна по UN — најлошиот геноцид во Европа по Холокаустот.' },
  },
  't-macedonian-struggle': {
    es: { title: 'La Lucha Macedonia', description: 'Bandas armadas griega y búlgaras libran una guerra de guerrillas en Macedonia otomana por el control de su población, en medio del declive otomano.' },
    ru: { title: 'Македонская борьба', description: 'Греческие и болгарские вооружённые отряды ведут партизанскую войну в османской Македонии за контроль над её населением в условиях заката Османской империи.' },
    mk: { title: 'Македонската Борба', description: 'Грчки и бугарски вооружени чети водат герилска војна во Отоманска Македонија за контрола на нејзиното население, во услови на отоманскиот пад.' },
  },
  't-balkan-wars': {
    es: { title: 'Las Guerras de los Balcanes', description: 'Grecia, Bulgaria, Serbia y Montenegro derrotan al Imperio Otomano, luego se enfrentan entre ellos por el botín. Macedonia queda particionada, trazando las fronteras modernas de los Balcanes occidentales.' },
    ru: { title: 'Балканские войны', description: 'Греция, Болгария, Сербия и Черногория побеждают Османскую империю, затем воюют между собой за добычу. Македония разделена, образуя современные границы западных Балкан.' },
    mk: { title: 'Балканските Војни', description: 'Грција, Бугарија, Србија и Црна Гора ја поразиле Отоманската Империја, потоа се бореле меѓу себе за пленот. Македонија е поделена, одредувајќи ги современите граници на Западен Балкан.' },
  },
  't-phoenician-alphabet': {
    es: { title: 'El Alfabeto Fenicio se Difunde', description: 'Los comerciantes fenicios perfeccionan un alfabeto de 22 letras — antepasado del griego, del latín y de la mayoría de las escrituras modernas — y lo llevan a cada puerto del Mediterráneo.' },
    ru: { title: 'Распространение финикийского алфавита', description: 'Финикийские торговцы совершенствуют алфавит из 22 букв — предок греческого, латинского и большинства современных письменностей — и разносят его по всем портам Средиземноморья.' },
    mk: { title: 'Феникиската Азбука се Шири', description: 'Феникиските трговци усовршуваат азбука од 22 букви — предок на грчкото, латинското и повеќето модерни писма — и ја носат во секое средоземно пристаниште.' },
  },
  't-carthage-founded': {
    es: { title: 'Fundación de Cartago', description: 'Colonos fenicios de Tiro fundan Cartago en el norte de África — el imperio comercial que un día desafiará a la propia Roma.' },
    ru: { title: 'Основание Карфагена', description: 'Финикийские колонисты из Тира основывают Карфаген в Северной Африке — торговую империю, которая однажды бросит вызов самому Риму.' },
    mk: { title: 'Основање на Картагина', description: 'Феникиски колонисти од Тир ја основаат Картагина во Северна Африка — трговската империја што еден ден ќе ѝ се спротивстави на самиот Рим.' },
  },
  't-chaeronea': {
    es: { title: 'Filipo II Vence en Queronea', description: 'Filipo II de Macedonia derrota a las ciudades-estado griegas aliadas en Queronea, unificando Grecia bajo el liderazgo macedonio — el trampolín para las conquistas de su hijo Alejandro.' },
    ru: { title: 'Филипп II побеждает при Херонее', description: 'Филипп II Македонский разбивает союзные греческие полисы при Херонее, объединяя Грецию под македонским началом — трамплин для завоеваний его сына Александра.' },
    mk: { title: 'Филип II Победува кај Херонеја', description: 'Филип II Македонски ги поразува сојузничките грчки градови-држави кај Херонеја, обединувајќи ја Грција под македонско водство — отскочна даска за освојувањата на неговиот син Александар.' },
  },
  't-gaugamela': {
    es: { title: 'Batalla de Gaugamela', description: 'Alejandro Magno destroza el ejército persa de Darío III en Gaugamela — la victoria decisiva que le entrega el mayor imperio que el mundo había visto.' },
    ru: { title: 'Битва при Гавгамелах', description: 'Александр Великий сокрушает персидское войско Дария III при Гавгамелах — решающая победа, вручившая ему величайшую империю, какую видел мир.' },
    mk: { title: 'Битката кај Гавгамела', description: 'Александар Велики ја разбива персиската војска на Дариј III кај Гавгамела — одлучувачката победа што му ја предава најголемата империја што светот ја видел.' },
  },
  't-lindisfarne': {
    es: { title: 'Ataque Vikingo a Lindisfarne', description: 'Los saqueadores nórdicos arrasan el monasterio insular de Lindisfarne frente a la costa inglesa — el impacto que tradicionalmente abre la Era Vikinga.' },
    ru: { title: 'Набег викингов на Линдисфарн', description: 'Норманнские налётчики разоряют островной монастырь Линдисфарн у английского побережья — потрясение, с которого традиционно начинается эпоха викингов.' },
    mk: { title: 'Викиншки Напад на Линдисфарн', description: 'Нордиските напаѓачи го ограбуваат островскиот манастир Линдисфарн крај англискиот брег — шокот со кој традиционално започнува Викиншката ера.' },
  },
  't-vinland': {
    es: { title: 'Leif Erikson Llega a Vinlandia', description: 'El explorador nórdico Leif Erikson desembarca en Terranova — los primeros europeos en llegar a América del Norte, cinco siglos antes que Colón.' },
    ru: { title: 'Лейф Эрикссон достигает Винланда', description: 'Норманнский мореплаватель Лейф Эрикссон высаживается на Ньюфаундленде — первые европейцы в Северной Америке, за пять веков до Колумба.' },
    mk: { title: 'Лејф Ериксон Стигнува до Винланд', description: 'Нордискиот истражувач Лејф Ериксон се истоварува на Њуфаундленд — првите Европејци што стигнале до Северна Америка, пет века пред Колумбо.' },
  },
  't-kamakura': {
    es: { title: 'Fundación del Sogunato Kamakura', description: 'Minamoto no Yoritomo se convierte en el primer sogún de Japón, abriendo siete siglos de gobierno samurái en los que los guerreros, no los emperadores, ejercen el poder real.' },
    ru: { title: 'Основание сёгуната Камакура', description: 'Минамото-но Ёритомо становится первым сёгуном Японии, открывая семь веков самурайского правления, когда реальная власть принадлежит воинам, а не императорам.' },
    mk: { title: 'Основање на Камакура Шогунатот', description: 'Минамото но Јоритомо станува првиот шогун на Јапонија, отворајќи седум века самурајско владеење во кое вистинската моќ ја држат воините, а не императорите.' },
  },
  't-kamikaze': {
    es: { title: 'Fracasan las Invasiones Mongolas de Japón', description: 'Los tifones — los "kamikaze" o vientos divinos — destrozan las flotas de invasión de Kublai Kan, preservando la independencia japonesa y entrando en la leyenda samurái.' },
    ru: { title: 'Провал монгольских вторжений в Японию', description: 'Тайфуны — «камикадзе», божественные ветры — уничтожают флоты вторжения Хубилая, сохраняя независимость Японии и входя в самурайские легенды.' },
    mk: { title: 'Монголските Инвазии на Јапонија Пропаѓаат', description: 'Тајфуните — „камикази" или божествени ветрови — ги уништуваат инвазиските флоти на Кублај Кан, зачувувајќи ја јапонската независност и влегувајќи во самурајската легенда.' },
  },
  't-marco-polo': {
    es: { title: 'Marco Polo Parte hacia China', description: 'El mercader veneciano Marco Polo parte hacia la corte de Kublai Kan por la Ruta de la Seda asegurada por los mongoles — su relato encenderá la imaginación europea durante siglos.' },
    ru: { title: 'Марко Поло отправляется в Китай', description: 'Венецианский купец Марко Поло отправляется ко двору Хубилая по охраняемому монголами Шёлковому пути — его рассказ будет будоражить воображение европейцев столетиями.' },
    mk: { title: 'Марко Поло Тргнува кон Кина', description: 'Венецијанскиот трговец Марко Поло тргнува кон дворот на Кублај Кан по Патот на свилата обезбеден од Монголите — неговиот запис ќе ја разгорува европската фантазија со векови.' },
  },
  't-hanseatic': {
    es: { title: 'Formalización de la Liga Hanseática', description: 'Las ciudades comerciales del norte de Alemania se unen en la Liga Hanseática, dominando el comercio báltico y mostrando el nuevo poder de los gremios mercantiles y las ciudades autónomas.' },
    ru: { title: 'Оформление Ганзейского союза', description: 'Торговые города Северной Германии объединяются в Ганзейский союз, господствуя в балтийской торговле и демонстрируя новую силу купеческих гильдий и вольных городов.' },
    mk: { title: 'Формализирање на Ханзеатската Лига', description: 'Северногерманските трговски градови се обврзуваат во Ханзеатската лига, доминирајќи во балтичката трговија и покажувајќи ја новата моќ на трговските еснафи и повластените градови.' },
  },
  't-first-slave-voyage': {
    es: { title: 'Comienza la Trata Transatlántica de Esclavos', description: 'El primer barco negrero navega directamente de África a las Américas. Durante los siguientes 350 años, 12,5 millones de africanos serán forzados a cruzar el Pasaje del Medio.' },
    ru: { title: 'Начало трансатлантической работорговли', description: 'Первый невольничий корабль идёт напрямую из Африки в Америку. За следующие 350 лет 12,5 миллиона африканцев будут насильно перевезены через Средний путь.' },
    mk: { title: 'Започнува Трансатлантската Трговија со Робови', description: 'Првиот робовски брод плови директно од Африка кон Америка. Во следните 350 години, 12,5 милиони Африканци ќе бидат присилно пренесени преку Средниот премин.' },
  },
  't-asiento': {
    es: { title: 'Gran Bretaña Gana el Asiento', description: 'El Tratado de Utrecht otorga a Gran Bretaña el asiento — el contrato para transportar africanos esclavizados a la América española — industrializando el comercio triangular.' },
    ru: { title: 'Британия получает асьенто', description: 'Утрехтский договор передаёт Британии асьенто — контракт на поставку порабощённых африканцев в испанскую Америку — ставя треугольную торговлю на промышленные рельсы.' },
    mk: { title: 'Британија го Добива Асиентото', description: 'Договорот од Утрехт ѝ го доделува на Британија асиентото — договорот за превоз на поробени Африканци во шпанска Америка — индустријализирајќи ја триаголната трговија.' },
  },
  't-suleiman': {
    es: { title: 'Coronación de Solimán el Magnífico', description: 'Solimán I asciende al trono otomano, iniciando un reinado de 46 años de reforma legal, esplendor arquitectónico y expansión que lleva al imperio a su cenit.' },
    ru: { title: 'Воцарение Сулеймана Великолепного', description: 'Сулейман I занимает османский трон, начиная 46-летнее правление — правовые реформы, архитектурное великолепие и экспансия приводят империю к зениту.' },
    mk: { title: 'Крунисување на Сулејман Величествениот', description: 'Сулејман I го зазема отоманскиот престол, започнувајќи 46-годишно владеење на правни реформи, архитектонски сјај и експанзија што ја носи империјата до нејзиниот зенит.' },
  },
  't-vienna-siege': {
    es: { title: 'Primer Sitio Otomano de Viena', description: 'El ejército de Solimán llega a las puertas de Viena — el punto culminante de la expansión otomana en Europa central.' },
    ru: { title: 'Первая осада Вены османами', description: 'Армия Сулеймана подходит к воротам Вены — высшая точка османской экспансии в Центральную Европу.' },
    mk: { title: 'Првата Отоманска Опсада на Виена', description: 'Војската на Сулејман стигнува до портите на Виена — врвната точка на отоманската експанзија во Централна Европа.' },
  },
  't-versailles-court': {
    es: { title: 'Luis XIV Traslada la Corte a Versalles', description: 'El Rey Sol traslada su corte al palacio de Versalles, convirtiendo el ritual y el esplendor en instrumentos del poder real absoluto.' },
    ru: { title: 'Людовик XIV переносит двор в Версаль', description: 'Король-Солнце переносит свой двор в Версальский дворец, превращая ритуал и роскошь в инструменты абсолютной королевской власти.' },
    mk: { title: 'Луј XIV го Преселува Дворот во Версај', description: 'Кралот Сонце го преселува својот двор во палатата Версај, претворајќи ги ритуалот и сјајот во инструменти на апсолутната кралска моќ.' },
  },
  't-berlin-conference': {
    es: { title: 'La Conferencia de Berlín Divide África', description: 'Las potencias europeas se reparten África en colonias en la Conferencia de Berlín — sin un solo representante africano presente. El Reparto de África se acelera.' },
    ru: { title: 'Берлинская конференция делит Африку', description: 'Европейские державы делят Африку на колонии на Берлинской конференции — без единого африканского представителя. «Драка за Африку» ускоряется.' },
    mk: { title: 'Берлинската Конференција ја Дели Африка', description: 'Европските сили ја делат Африка на колонии на Берлинската конференција — без ниту еден африкански претставник. Грабежот за Африка се забрзува.' },
  },
  't-adwa': {
    es: { title: 'Batalla de Adua', description: 'Etiopía aplasta al ejército italiano invasor en Adua — la mayor victoria africana sobre una potencia colonial, preservando la independencia etíope.' },
    ru: { title: 'Битва при Адуа', description: 'Эфиопия сокрушает вторгшуюся итальянскую армию при Адуа — величайшая победа африканцев над колониальной державой, сохранившая независимость Эфиопии.' },
    mk: { title: 'Битката кај Адва', description: 'Етиопија ја разбива италијанската освојувачка војска кај Адва — најголемата африканска победа над колонијална сила, зачувувајќи ја етиопската независност.' },
  },

  't-diadochi': {
    es: { title: "Muerte de Alejandro y guerras de los diádocos", description: "Alejandro Magno muere en Babilonia sin heredero. Sus generales — los diádocos — luchan durante cuarenta años, repartiendo el imperio en los reinos ptolemaico, seléucida y antigónida de la era helenística." },
    ru: { title: "Смерть Александра и войны диадохов", description: "Александр Великий умирает в Вавилоне без наследника. Его полководцы — диадохи — сорок лет воюют, деля империю на Птолемеевское, Селевкидское и Антигонидское царства эллинистической эпохи." },
    mk: { title: "Смртта на Александар и војните на дијадосите", description: "Александар Велики умира во Вавилон без наследник. Неговите генерали — дијадосите — војуваат четириесет години, делејќи ја империјата на Птолемејското, Селевкидското и Антигонидското кралство." },
  },
  't-library-alexandria': {
    es: { title: "La Biblioteca de Alejandría", description: "Ptolomeo I y II fundan el Museo y su gran Biblioteca, que aspira a reunir todos los libros del mundo — haciendo de Alejandría la capital científica de la antigüedad." },
    ru: { title: "Александрийская библиотека", description: "Птолемей I и II основывают Мусейон и великую Библиотеку, стремящуюся собрать все книги мира, — Александрия становится научной столицей древности." },
    mk: { title: "Библиотеката во Александрија", description: "Птолемеј I и II ги основаат Мусеионот и големата Библиотека, која се стреми да ја собере секоја книга на светот — правејќи ја Александрија научна престолнина на антиката." },
  },
  't-persepolis': {
    es: { title: "Darío I comienza Persépolis", description: "Darío el Grande funda Persépolis, la capital ceremonial del Imperio aqueménida, y organiza el reino en satrapías unidas por el Camino Real de 2.700 km." },
    ru: { title: "Дарий I закладывает Персеполь", description: "Дарий Великий основывает Персеполь, церемониальную столицу державы Ахеменидов, и делит царство на сатрапии, связанные Царской дорогой длиной 2 700 км." },
    mk: { title: "Дариј I го започнува Персеполис", description: "Дариј Велики го основа Персеполис, церемонијалната престолнина на Ахаеменидската империја, и го организира царството во сатрапии поврзани со Кралскиот пат од 2.700 км." },
  },
  't-tariq-iberia': {
    es: { title: "Conquista musulmana de Iberia", description: "Tariq ibn Ziyad cruza el estrecho por Gibraltar y destruye el reino visigodo en Guadalete. En una década, casi toda la península se convierte en al-Ándalus." },
    ru: { title: "Мусульманское завоевание Иберии", description: "Тарик ибн Зияд переправляется через пролив у Гибралтара и сокрушает вестготское королевство при Гвадалете. За десятилетие почти весь полуостров становится аль-Андалусом." },
    mk: { title: "Муслиманско освојување на Иберија", description: "Тарик ибн Зијад го преминува теснецот кај Гибралтар и го уништува визиготското кралство кај Гвадалете. За една деценија речиси целиот полуостров станува ал-Андалуз." },
  },
  't-cordoba-caliphate': {
    es: { title: "Proclamación del Califato de Córdoba", description: "Abd al-Rahman III se proclama califa. Córdoba se convierte en una de las ciudades más grandes y cultas de Europa — bibliotecas, calles iluminadas y una cultura de convivencia." },
    ru: { title: "Провозглашение Кордовского халифата", description: "Абд ар-Рахман III провозглашает себя халифом. Кордова становится одним из крупнейших и учёнейших городов Европы — библиотеки, освещённые улицы и культура сосуществования." },
    mk: { title: "Прогласен Кордопскиот калифат", description: "Абд ал-Рахман III се прогласува за калиф. Кордоба станува еден од најголемите и најучени градови во Европа — библиотеки, осветлени улици и култура на соживот." },
  },
  't-granada-1492': {
    es: { title: "Caída de Granada", description: "El último estado musulmán de Iberia se rinde a Fernando e Isabel, poniendo fin a la Reconquista de siglos el mismo año en que Colón zarpa hacia el oeste." },
    ru: { title: "Падение Гранады", description: "Последнее мусульманское государство Иберии сдаётся Фердинанду и Изабелле, завершая многовековую Реконкисту в тот самый год, когда Колумб отплывает на запад." },
    mk: { title: "Падот на Гранада", description: "Последната муслиманска држава во Иберија им се предава на Фердинанд и Изабела, завршувајќи ја вековната Реконкиста истата година кога Колумбо плови на запад." },
  },
  't-crecy': {
    es: { title: "Batalla de Crécy", description: "Los arqueros ingleses aniquilan a la caballería francesa en Crécy — el arma de un campesino derrota a la aristocracia acorazada, y la guerra de los Cien Años entra en la leyenda." },
    ru: { title: "Битва при Креси", description: "Английские лучники уничтожают французское рыцарство при Креси — оружие крестьянина побеждает закованную в латы аристократию, и Столетняя война входит в легенду." },
    mk: { title: "Битката кај Креси", description: "Англиските стрелци ја уништуваат француската коњаница кај Креси — оружјето на селанецот ја победува оклопената аристократија, а Стогодишната војна влегува во легенда." },
  },
  't-joan-arc': {
    es: { title: "Juana de Arco libera Orleans", description: "Una campesina visionaria de diecisiete años levanta el asedio de Orleans en nueve días y conduce a Carlos VII a su coronación en Reims, cambiando el curso de la guerra de los Cien Años." },
    ru: { title: "Жанна д'Арк освобождает Орлеан", description: "Семнадцатилетняя крестьянка-визионерка за девять дней снимает осаду Орлеана и ведёт Карла VII на коронацию в Реймс, переломив ход Столетней войны." },
    mk: { title: "Јована Орлеанска го ослободува Орлеан", description: "Седумнаесетгодишна селанка-визионерка ја крева опсадата на Орлеан за девет дена и го води Шарл VII на крунисување во Ремс, свртувајќи го текот на Стогодишната војна." },
  },
  't-panipat': {
    es: { title: "Babur funda el Imperio mogol", description: "En la primera batalla de Panipat, la artillería de campaña de Babur derrota a los elefantes de guerra del sultanato de Delhi, fundando la dinastía mogol que gobernará la India durante tres siglos." },
    ru: { title: "Бабур основывает империю Моголов", description: "В первой битве при Панипате полевая артиллерия Бабура побеждает боевых слонов Делийского султаната, основывая династию Моголов, которая будет править Индией три века." },
    mk: { title: "Бабур ја основа Могулската империја", description: "Во првата битка кај Панипат, артилеријата на Бабур ги победува воените слонови на Делхискиот султанат, основајќи ја могулската династија што ќе владее со Индија три века." },
  },
  't-taj-mahal': {
    es: { title: "Comienza la construcción del Taj Mahal", description: "Shah Jahan ordena a 20.000 artesanos levantar una tumba de mármol blanco para su esposa Mumtaz Mahal — el monumento supremo de la era de esplendor de la India mogol." },
    ru: { title: "Начало строительства Тадж-Махала", description: "Шах-Джахан велит 20 000 мастеров возвести беломраморную гробницу для жены Мумтаз-Махал — вершину века великолепия могольской Индии." },
    mk: { title: "Почнува изградбата на Таџ Махал", description: "Шах Џахан наредува 20.000 занаетчии да подигнат гробница од бел мермер за неговата сопруга Мумтаз Махал — врвниот споменик на могулската ера на сјај." },
  },
  't-sekigahara': {
    es: { title: "Batalla de Sekigahara", description: "Tokugawa Ieyasu destruye a sus rivales en un solo día, poniendo fin a las guerras civiles Sengoku y abriendo 265 años de gobierno Tokugawa desde Edo." },
    ru: { title: "Битва при Сэкигахаре", description: "Токугава Иэясу за один день сокрушает соперников, завершая гражданские войны Сэнгоку и открывая 265 лет правления Токугава из Эдо." },
    mk: { title: "Битката кај Секигахара", description: "Токугава Иejасу ги уништува своите ривали за еден ден, завршувајќи ги граѓанските војни Сенгоку и отворајќи 265 години Токугава владеење од Едо." },
  },
  't-sakoku': {
    es: { title: "Japón cierra sus puertas (sakoku)", description: "El shogunato Tokugawa sella Japón: ningún japonés puede salir, casi ningún extranjero puede entrar, y solo un puesto holandés en Dejima mantiene una ventana filtrada a Occidente." },
    ru: { title: "Япония закрывает двери (сакоку)", description: "Сёгунат Токугава запечатывает Японию: японцам нельзя уезжать, иностранцам почти нельзя въезжать, и лишь голландская фактория на Дэдзиме остаётся фильтрованным окном на Запад." },
    mk: { title: "Јапонија ги затвора вратите (сакоку)", description: "Токугава шогунатот ја запечатува Јапонија: ниту еден Јапонец не смее да замине, речиси ниту еден странец да влезе, а само холандскиот пункт на Деџима останува филтриран прозорец кон Западот." },
  },
  't-october-revolution': {
    es: { title: "Las revoluciones rusas", description: "Los disturbios del pan derrocan al zar en febrero; en octubre los bolcheviques de Lenin asaltan el Palacio de Invierno. Nace el primer estado socialista del mundo — y sigue la guerra civil." },
    ru: { title: "Русские революции", description: "Хлебные бунты в феврале свергают царя; в октябре большевики Ленина берут Зимний дворец. Рождается первое социалистическое государство мира — за ним следует Гражданская война." },
    mk: { title: "Руските револуции", description: "Бунтовите за леб го соборуваат царот во февруари; во октомври болшевиците на Ленин го заземаат Зимскиот дворец. Се раѓа првата социјалистичка држава — и следи граѓанска војна." },
  },
  't-ussr-founded': {
    es: { title: "Fundación de la URSS", description: "Victoriosos en la guerra civil, los bolcheviques proclaman la Unión de Repúblicas Socialistas Soviéticas — el estado que se industrializará a un costo terrible y moldeará el siglo XX." },
    ru: { title: "Образование СССР", description: "Победив в Гражданской войне, большевики провозглашают Союз Советских Социалистических Республик — государство, которое проведёт индустриализацию страшной ценой и сформирует двадцатый век." },
    mk: { title: "Основање на СССР", description: "Победници во граѓанската војна, болшевиците го прогласуваат Сојузот на Советските Социјалистички Републики — државата што ќе се индустријализира по страшна цена и ќе го обликува XX век." },
  },
  't-salt-march': {
    es: { title: "La Marcha de la Sal de Gandhi", description: "Gandhi camina 380 km hasta el mar en Dandi y recoge un puñado de sal, convirtiendo un impuesto colonial en una acusación moral contra el imperio, observada por el mundo entero." },
    ru: { title: "Соляной поход Ганди", description: "Ганди проходит 380 км к морю у Данди и поднимает горсть соли, превращая колониальный налог в моральное обвинение империи на глазах у всего мира." },
    mk: { title: "Маршот на солта на Ганди", description: "Ганди пешачи 380 км до морето кај Данди и крева грст сол, претворајќи колонијален данок во морално обвинение против империјата, гледано од целиот свет." },
  },
  't-partition-1947': {
    es: { title: "Independencia y Partición de la India", description: "La India británica se libera a medianoche del 15 de agosto de 1947 — dividida en India y Pakistán. Unos 14 millones de personas cruzan la Línea Radcliffe en la mayor migración de la historia." },
    ru: { title: "Независимость и Раздел Индии", description: "Британская Индия обретает свободу в полночь 15 августа 1947 года — разделённая на Индию и Пакистан. Около 14 миллионов человек пересекают линию Рэдклиффа в крупнейшей миграции в истории." },
    mk: { title: "Независност и Поделба на Индија", description: "Британска Индија станува слободна на полноќ на 15 август 1947 — поделена на Индија и Пакистан. Околу 14 милиони луѓе ја преминуваат Радклифовата линија во најголемата миграција во историјата." },
  },
};

export function getTranslatedTimelineEvent<T extends { id: string; title: string; description: string }>(
  event: T,
  lang: Language
): T {
  if (lang === 'en') return event;
  const trans = TIMELINE_TRANS[event.id]?.[lang as ContentLang];
  if (!trans) return event;
  return { ...event, title: trans.title, description: trans.description };
}
