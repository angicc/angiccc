import type { Language } from './translations';

type ContentLang = Exclude<Language, 'en'>;
interface TimelineEventContent { title: string; description: string; }

const TIMELINE_TRANS: Record<string, Partial<Record<ContentLang, TimelineEventContent>>> = {
  't-cuneiform': {
    es: { title: 'Invención de la Escritura Cuneiforme', description: 'Los escribas sumerios en Uruk desarrollan el primer sistema de escritura del mundo, presionando marcas en forma de cuña en tablillas de arcilla para registrar inventarios de grano y comercio.' },
    ru: { title: 'Изобретение клинописи', description: 'Шумерские писцы в Уруке создают первую в мире систему письма, выдавливая клиновидные знаки на глиняных табличках для учёта зерна и торговли.' },
    mk: { title: 'Изум на Клинестото Писмо', description: 'Шумерските писари во Урук го развиваат првиот систем за пишување во светот, притискајќи клинести ознаки на глинени плочки за евидентирање на залихи и трговија.' },
    de: { title: 'Erfindung der Keilschrift', description: 'Sumerische Schreiber in Uruk entwickeln das erste Schriftsystem der Welt und pressen keilförmige Zeichen in Tontafeln, um Getreidevorräte und Handel festzuhalten.' },
    fr: { title: 'Invention de l’écriture cunéiforme', description: 'Les scribes sumériens d’Ourouk mettent au point le premier système d’écriture du monde, imprimant des signes en forme de coin sur des tablettes d’argile pour consigner les stocks de grain et le commerce.' }
  },
  't-pyramid': {
    es: { title: 'Gran Pirámide de Guiza', description: 'El faraón Keops completa la Gran Pirámide en Guiza — la estructura más alta del mundo durante más de 3.800 años.' },
    ru: { title: 'Великая пирамида Гизы', description: 'Фараон Хуфу завершает строительство Великой пирамиды в Гизе — высочайшего рукотворного сооружения мира на протяжении более 3800 лет.' },
    mk: { title: 'Големата Пирамида во Гиза', description: 'Фараонот Кеопс ја завршува Големата Пирамида во Гиза — највисоката градба во светот 3.800 години.' },
    de: { title: 'Große Pyramide von Gizeh', description: 'Pharao Cheops vollendet die Große Pyramide von Gizeh — über 3.800 Jahre lang das höchste von Menschen errichtete Bauwerk der Welt.' },
    fr: { title: 'Grande Pyramide de Gizeh', description: 'Le pharaon Khéops achève la Grande Pyramide de Gizeh — la plus haute construction humaine du monde pendant plus de 3 800 ans.' }
  },
  't-hammurabi': {
    es: { title: 'Código de Hammurabi', description: 'El rey Hammurabi de Babilonia promulga uno de los primeros códigos legales escritos de la historia, abarcando comercio, propiedad y justicia penal.' },
    ru: { title: 'Кодекс Хаммурапи', description: 'Вавилонский царь Хаммурапи издаёт один из первых письменных сводов законов в истории, охватывающий торговлю, собственность и уголовное правосудие.' },
    mk: { title: 'Хамурабиевиот Законик', description: 'Вавилонскиот крал Хамураби издава еден од најраните писани законски кодекси во историјата, опфаќајќи трговија, сопственост и кривична правда.' },
    de: { title: 'Der Kodex Hammurapi', description: 'Hammurapi, König von Babylon, erlässt einen der frühesten schriftlichen Gesetzeskodizes der Geschichte, der Handel, Eigentum und Strafrecht umfasst.' },
    fr: { title: 'Le Code de Hammurabi', description: 'Hammurabi, roi de Babylone, promulgue l’un des premiers codes de lois écrits de l’histoire, couvrant le commerce, la propriété et la justice pénale.' }
  },
  't-troy': {
    es: { title: 'Caída de Troya', description: 'La legendaria guerra de Troya termina con el saqueo griego, como lo conmemoró Homero en la Ilíada.' },
    ru: { title: 'Падение Трои', description: 'Легендарная Троянская война заканчивается разорением Трои греками, воспетым Гомером в «Илиаде».' },
    mk: { title: 'Падот на Троја', description: 'Легендарната Тројанска војна завршува со грчкото освојување, овековечено во Хомеровата Илијада.' },
    de: { title: 'Der Fall Trojas', description: 'Der legendäre Trojanische Krieg endet mit der griechischen Plünderung Trojas, wie sie später in Homers Ilias verewigt wurde.' },
    fr: { title: 'La chute de Troie', description: 'La légendaire guerre de Troie s’achève par le sac grec de la ville, tel que le commémorera plus tard l’Iliade d’Homère.' }
  },
  't-democracy': {
    es: { title: 'Democracia Ateniense', description: 'Clístenes introduce la democracia en Atenas — el primer sistema democrático del mundo, donde los ciudadanos votan directamente sobre las leyes.' },
    ru: { title: 'Афинская демократия', description: 'Клисфен вводит демократию в Афинах — первую в мире демократическую систему управления, где граждане напрямую голосуют за законы.' },
    mk: { title: 'Атинска Демократија', description: 'Клистен ја воведуваdemokratijata во Атина — прв демократски систем во светот, каде граѓаните директно гласаат за законите.' },
    de: { title: 'Die athenische Demokratie', description: 'Kleisthenes führt in Athen die Demokratie ein — das erste demokratische Regierungssystem der Welt, in dem die Bürger unmittelbar über die Gesetze abstimmen.' },
    fr: { title: 'La démocratie athénienne', description: 'Clisthène instaure la démocratie à Athènes — le premier système de gouvernement démocratique du monde, où les citoyens votent directement les lois.' }
  },
  't-persian-wars': {
    es: { title: 'Batalla de Maratón', description: 'Los atenienses derrotan al ejército persa invasor en Maratón, preservando la independencia griega y convirtiéndose en símbolo de resistencia democrática.' },
    ru: { title: 'Битва при Марафоне', description: 'Афиняне разгромили вторгшееся персидское войско при Марафоне, сохранив греческую независимость и ставшие символом демократического сопротивления.' },
    mk: { title: 'Битката кај Маратон', description: 'Атињаните ги поразуваат напаѓачките персиски сили кај Маратон, зачувувајќи ја грчката независност и станувајќи симбол на демократски отпор.' },
    de: { title: 'Die Schlacht bei Marathon', description: 'Die Athener besiegen das eindringende persische Heer bei Marathon, bewahren die griechische Unabhängigkeit und werden zum Sinnbild demokratischen Widerstands.' },
    fr: { title: 'La bataille de Marathon', description: 'Les Athéniens défont l’armée perse envahissante à Marathon, préservant l’indépendance grecque et devenant un symbole de la résistance démocratique.' }
  },
  't-parthenon': {
    es: { title: 'Construcción del Partenón', description: 'Bajo Pericles, Atenas construye el Partenón en la Acrópolis — obra maestra definitoria de la arquitectura clásica.' },
    ru: { title: 'Строительство Парфенона', description: 'При Перикле Афины возводят Парфенон на Акрополе — определяющий шедевр классической архитектуры.' },
    mk: { title: 'Градење на Партенонот', description: 'Под Перикле, Атина го гради Партенонот на Акрополот — дефинирачки ремек-дело на класичната архитектура.' },
    de: { title: 'Der Bau des Parthenon', description: 'Unter Perikles errichtet Athen den Parthenon auf der Akropolis — ein prägendes Meisterwerk der klassischen Architektur.' },
    fr: { title: 'La construction du Parthénon', description: 'Sous Périclès, Athènes bâtit le Parthénon sur l’Acropole — un chef-d’œuvre fondateur de l’architecture classique.' }
  },
  't-alexander': {
    es: { title: 'Campaña Oriental de Alejandro', description: 'Alejandro Magno cruza a Asia, iniciando una década de conquistas que se extenderán desde Egipto hasta India y difundirán la cultura griega por todo el mundo conocido.' },
    ru: { title: 'Восточный поход Александра', description: 'Александр Великий переходит в Азию, начиная десятилетие завоеваний от Египта до Индии и распространяя греческую культуру по всему известному миру.' },
    mk: { title: 'Источната Кампања на Александар', description: 'Александар Велики преминува во Азија, започнувајќи декада на освојувања од Египет до Индија и ширејќи грчката култура низ познатиот свет.' },
    de: { title: 'Alexanders Feldzug nach Osten', description: 'Alexander der Große setzt nach Asien über und beginnt ein Jahrzehnt der Eroberung, das sich von Ägypten bis Indien erstrecken und die griechische Kultur über die bekannte Welt verbreiten wird.' },
    fr: { title: 'La campagne orientale d’Alexandre', description: 'Alexandre le Grand passe en Asie, entamant une décennie de conquêtes qui s’étendra de l’Égypte à l’Inde et répandra la culture grecque à travers le monde connu.' }
  },
  't-roman-republic': {
    es: { title: 'Fundación de la República Romana', description: 'Roma expulsa a su último rey y establece una república gobernada por cónsules elegidos y un Senado.' },
    ru: { title: 'Основание Римской республики', description: 'Рим изгоняет последнего царя и устанавливает республику, управляемую избранными консулами и Сенатом.' },
    mk: { title: 'Основање на Римската Република', description: 'Рим го протерува последниот крал и воспоставува република управувана од избрани конзули и Сенат.' },
    de: { title: 'Gründung der Römischen Republik', description: 'Rom vertreibt seinen letzten König und errichtet eine Republik, die von gewählten Konsuln und einem Senat regiert wird.' },
    fr: { title: 'Fondation de la République romaine', description: 'Rome chasse son dernier roi et établit une république gouvernée par des consuls élus et un Sénat.' }
  },
  't-caesar': {
    es: { title: 'Asesinato de Julio César', description: 'Julio César es asesinado en el Senado en los Idus de Marzo, desencadenando una guerra civil y la transformación de Roma de república a imperio.' },
    ru: { title: 'Убийство Юлия Цезаря', description: 'Юлий Цезарь убит в Сенате в мартовские иды, что вызвало гражданскую войну и превратило Рим из республики в империю.' },
    mk: { title: 'Атентатот врз Јулиј Цезар', description: 'Јулиј Цезар е убиен во Сенатот на Мартовски Иди, предизвикувајќи граѓанска војна и трансформацијата на Рим од република во царство.' },
    de: { title: 'Die Ermordung Julius Cäsars', description: 'Julius Cäsar wird an den Iden des März im Senat ermordet, was einen Bürgerkrieg auslöst und Rom von der Republik zum Kaiserreich wandelt.' },
    fr: { title: 'L’assassinat de Jules César', description: 'Jules César est assassiné au Sénat aux ides de mars, déclenchant la guerre civile et la transformation de Rome de république en empire.' }
  },
  't-pax-romana': {
    es: { title: 'Augusto y la Pax Romana', description: 'Octavio se convierte en Augusto, primer emperador de Roma. Comienza la Pax Romana — dos siglos de relativa paz y prosperidad.' },
    ru: { title: 'Август и Pax Romana', description: 'Октавиан становится Августом, первым императором Рима. Начинается Pax Romana — два века относительного мира и процветания.' },
    mk: { title: 'Август и Pax Romana', description: 'Октавијан станува Август, прв цар на Рим. Започнува Pax Romana — два века на релативен мир и просперитет.' },
    de: { title: 'Augustus und die Pax Romana', description: 'Octavian wird als Augustus zum ersten Kaiser Roms. Die Pax Romana — zwei Jahrhunderte relativen Friedens und Wohlstands — beginnt.' },
    fr: { title: 'Auguste et la Pax Romana', description: 'Octave devient Auguste, premier empereur de Rome. La Pax Romana — deux siècles de paix et de prospérité relatives — commence.' }
  },
  't-silk-road': {
    es: { title: 'Apertura de la Ruta de la Seda', description: 'Rutas comerciales que unen China con Asia Central y el Mediterráneo comienzan a operar, permitiendo el intercambio de seda, especias e ideas entre continentes.' },
    ru: { title: 'Открытие Шёлкового пути', description: 'Торговые пути, связывающие Китай со Средней Азией и Средиземноморьем, начинают действовать, открывая обмен шёлком, пряностями и идеями между континентами.' },
    mk: { title: 'Отворање на Патот на Свилата', description: 'Трговски патишта кои ја поврзуваат Кина со Централна Азија и Медитеранот почнуваат да работат, овозможувајќи размена на свила, зачини и идеи меѓу континентите.' },
    de: { title: 'Eröffnung der Seidenstraße', description: 'Handelsrouten, die China mit Zentralasien und dem Mittelmeer verbinden, nehmen ihren Betrieb auf und ermöglichen den Austausch von Seide, Gewürzen und Ideen über Kontinente hinweg.' },
    fr: { title: 'Ouverture de la route de la soie', description: 'Des routes commerciales reliant la Chine à l’Asie centrale et à la Méditerranée entrent en activité, permettant l’échange de soie, d’épices et d’idées entre les continents.' }
  },
  't-cyrus-great': {
    es: { title: 'Ciro el Grande Funda el Imperio Persa', description: 'Ciro II de Persia derrota a los imperios medo, lidio y babilonio para crear el mayor imperio del mundo hasta entonces, introduciendo una política de tolerancia religiosa.' },
    ru: { title: 'Кир Великий основывает Персидскую империю', description: 'Кир II Персидский побеждает мидийцев, лидийцев и вавилонян, создавая крупнейшую империю своего времени и вводя политику религиозной терпимости.' },
    mk: { title: 'Кир Велики ја Основал Персиската империја', description: 'Кир II ги покорува Медијците, Лидијците и Вавилонците создавајќи ја најголемата империја на дотогашниот свет, воведувајќи политика на верска толеранција.' },
    de: { title: 'Kyros der Große gründet das Perserreich', description: 'Kyros II. von Persien besiegt das medische, lydische und babylonische Reich und schafft das größte Reich, das die Welt bis dahin gesehen hatte — und führt eine Politik religiöser Toleranz gegenüber den unterworfenen Völkern ein.' },
    fr: { title: 'Cyrus le Grand fonde l’Empire perse', description: 'Cyrus II de Perse défait les empires mède, lydien et babylonien pour créer le plus vaste empire que le monde eût connu — et instaure une politique de tolérance religieuse envers les peuples conquis.' }
  },
  't-ashoka': {
    es: { title: 'Emperador Ashoka y la Difusión del Budismo', description: 'Tras la brutal conquista de Kalinga, el emperador maurya Ashoka se convierte al budismo y gobierna por el dharma, enviando misioneros por Asia.' },
    ru: { title: 'Император Ашока и распространение буддизма', description: 'После жестокого завоевания Калинги маурийский царь Ашока принимает буддизм и правит согласно дхарме, отправляя миссионеров по всей Азии.' },
    mk: { title: 'Царот Ашока и Ширењето на Будизмот', description: 'По грубото освојување на Калинга, маурјанскиот цар Ашока се обратил кон будизмот и владее според дарма, испраќајќи мисионари низ Азија.' },
    de: { title: 'Kaiser Ashoka und die Ausbreitung des Buddhismus', description: 'Nach der blutigen Eroberung von Kalinga bekehrt sich der Maurya-Kaiser Ashoka zum Buddhismus und regiert nach dem Dharma — er entsendet Missionare durch ganz Asien und erlässt Edikte, die Gewaltlosigkeit und Fürsorge fördern.' },
    fr: { title: 'L’empereur Ashoka et la diffusion du bouddhisme', description: 'Après la sanglante conquête du Kalinga, l’empereur maurya Ashoka se convertit au bouddhisme et gouverne selon le dharma — envoyant des missionnaires à travers l’Asie et promulguant des édits prônant la non-violence et le bien-être.' }
  },
  't-han-dynasty': {
    es: { title: 'La Dinastía Han Unifica China', description: 'La dinastía Han establece una edad de oro de la civilización china, expandiendo la Ruta de la Seda, desarrollando el papel y entronizando la ética confuciana.' },
    ru: { title: 'Династия Хань объединяет Китай', description: 'Династия Хань создаёт золотой век китайской цивилизации, расширяя Шёлковый путь, изобретая бумагу и закрепляя конфуцианскую этику на государственной службе.' },
    mk: { title: 'Династијата Хан ја Обединила Кина', description: 'Династијата Хан воспоставила златна ера на кинеска цивилизација, проширувајќи го Патот на Свилата, развивајќи хартија и вкоренувајќи ги конфучиевите вредности.' },
    de: { title: 'Die Han-Dynastie einigt China', description: 'Die Han-Dynastie (206 v. Chr.–220 n. Chr.) begründet ein goldenes Zeitalter der chinesischen Zivilisation — sie erweitert die Seidenstraße, entwickelt Papier und den Seismographen und verankert die konfuzianische Ethik im Beamtentum.' },
    fr: { title: 'La dynastie Han unifie la Chine', description: 'La dynastie Han (206 av. J.-C.–220 apr. J.-C.) fonde un âge d’or de la civilisation chinoise — étendant la route de la soie, inventant le papier et le sismographe, et ancrant l’éthique confucéenne dans l’administration.' }
  },
  't-egypt-afterlife': {
    es: { title: 'Libro Egipcio de los Muertos', description: 'Los sacerdotes del Imperio Nuevo de Egipto compilan el Libro de los Muertos — una guía para navegar el más allá, reflejo de una civilización donde la religión, la muerte y la vida cotidiana eran inseparables.' },
    ru: { title: 'Египетская Книга мёртвых', description: 'Жрецы египетского Нового царства составляют Книгу мёртвых — руководство по путешествию в загробный мир, отражающее цивилизацию, где религия, смерть и повседневная жизнь были неразделимы.' },
    mk: { title: 'Египетска Книга на Мртвите', description: 'Египетските свештеници го составуваат Книгата на Мртвите — водич за навигација во подземниот свет, одразувајќи цивилизација каде религијата, смртта и секојдневниот живот биле неразделни.' },
    de: { title: 'Das ägyptische Totenbuch', description: 'Die Priester des ägyptischen Neuen Reichs stellen das Totenbuch zusammen — einen Führer durch das Jenseits —, der eine Zivilisation widerspiegelt, in der Religion, Tod und Alltag untrennbar waren.' },
    fr: { title: 'Le Livre des morts égyptien', description: 'Les prêtres du Nouvel Empire égyptien compilent le Livre des morts — un guide pour cheminer dans l’au-delà —, reflet d’une civilisation où religion, mort et vie quotidienne étaient inséparables.' }
  },
  't-ramesses': {
    es: { title: 'Ramsés II y el Imperio Nuevo', description: 'El faraón Ramsés II — uno de los mayores gobernantes de Egipto — reina durante 66 años, combate a los hititas en Kadesh, construye los templos de Abu Simbel y consolida el dominio egipcio.' },
    ru: { title: 'Рамсес II и Новое царство', description: 'Фараон Рамсес II — один из величайших правителей Египта — царствует 66 лет, сражается с хеттами при Кадеше, строит храмы Абу-Симбела и утверждает египетское господство.' },
    mk: { title: 'Рамзес II и Новото Кралство', description: 'Фараонот Рамзес II — еден од најголемите владетели на Египет — владее 66 години, се борел со Хетитите кај Кадеш, ги изградил храмовите во Абу Симбел.' },
    de: { title: 'Ramses II. und das Neue Reich', description: 'Pharao Ramses II. — einer der größten Herrscher Ägyptens — regiert 66 Jahre lang, kämpft bei Kadesch gegen die Hethiter, errichtet die Tempel von Abu Simbel und festigt die Vormacht Ägyptens in der Antike.' },
    fr: { title: 'Ramsès II et le Nouvel Empire', description: 'Le pharaon Ramsès II — l’un des plus grands souverains d’Égypte — règne 66 ans, combat les Hittites à Qadesh, bâtit les temples d’Abou Simbel et affermit la domination égyptienne dans le monde antique.' }
  },
  't-rome-fall': {
    es: { title: 'Caída de Roma Occidental', description: 'El caudillo germánico Odoacro depone al último emperador romano occidental, marcando el fin tradicional del Imperio Romano de Occidente.' },
    ru: { title: 'Падение Западного Рима', description: 'Германский вождь Одоакр свергает последнего западноримского императора, ознаменовав традиционный конец Западной Римской империи.' },
    mk: { title: 'Падот на Западниот Рим', description: 'Германскиот старешина Одоакар го детронизира последниот западен римски цар, означувајќи го традиционалниот крај на Западната Римска империја.' },
    de: { title: 'Der Untergang Westroms', description: 'Der germanische Heerführer Odoaker setzt den letzten weströmischen Kaiser ab und markiert damit das herkömmliche Ende des Weströmischen Reiches.' },
    fr: { title: 'La chute de l’Empire romain d’Occident', description: 'Le chef germanique Odoacre dépose le dernier empereur romain d’Occident, marquant la fin traditionnelle de l’Empire romain d’Occident.' }
  },
  't-charlemagne': {
    es: { title: 'Carlomagno Coronado Emperador', description: 'El papa León III corona a Carlomagno "Emperador de los Romanos" la noche de Navidad en Roma, creando el concepto de un imperio cristiano europeo.' },
    ru: { title: 'Коронация Карла Великого', description: 'Папа Лев III коронует Карла Великого «Императором римлян» в рождественскую ночь в Риме, создавая концепцию христианской европейской империи.' },
    mk: { title: 'Крунисување на Карло Велики', description: 'Папата Лав III го круниса Карло Велики за „Цар на Римјаните" на Божиќ во Рим, создавајќи концепт на христијанска европска империја.' },
    de: { title: 'Karl der Große zum Kaiser gekrönt', description: 'Papst Leo III. krönt Karl den Großen am Weihnachtstag in Rom zum „Kaiser der Römer“ und schafft damit die Vorstellung eines christlichen europäischen Reiches.' },
    fr: { title: 'Charlemagne couronné empereur', description: 'Le pape Léon III couronne Charlemagne « empereur des Romains » le jour de Noël à Rome, créant l’idée d’un empire chrétien européen.' }
  },
  't-islam': {
    es: { title: 'Muerte de Mahoma y Expansión Islámica', description: 'Tras la muerte de Mahoma, los ejércitos islámicos se expanden rápidamente por Oriente Medio, Persia y el norte de África, creando una vasta nueva civilización.' },
    ru: { title: 'Смерть Мухаммада и исламская экспансия', description: 'После смерти Мухаммада исламские армии стремительно распространяются по Ближнему Востоку, Персии и Северной Африке, создавая обширную новую цивилизацию.' },
    mk: { title: 'Смртта на Мухамед и Исламска Експанзија', description: 'По смртта на Мухамед, исламските армии брзо се шират низ Блискиот Исток, Персија и Северна Африка, создавајќи огромна нова цивилизација.' },
    de: { title: 'Tod Mohammeds & die islamische Expansion', description: 'Nach Mohammeds Tod breiten sich die islamischen Heere rasch über den Nahen Osten, Persien und Nordafrika aus und schaffen eine gewaltige neue Zivilisation.' },
    fr: { title: 'Mort de Mahomet et expansion de l’islam', description: 'Après la mort de Mahomet, les armées islamiques s’étendent rapidement à travers le Proche-Orient, la Perse et l’Afrique du Nord, créant une vaste civilisation nouvelle.' }
  },
  't-golden-age': {
    es: { title: 'Casa de la Sabiduría, Bagdad', description: 'El califa abasí Al-Mamún establece la Casa de la Sabiduría en Bagdad, el mayor centro de aprendizaje científico y filosófico del mundo.' },
    ru: { title: 'Дом мудрости, Багдад', description: 'Аббасидский халиф аль-Мамун основывает Дом мудрости в Багдаде — крупнейший в мире центр научного и философского знания.' },
    mk: { title: 'Куќата на Мудроста, Багдад', description: 'Абасидскиот калиф Ал-Мамун ја основал Куќата на Мудроста во Багдад, најголемиот светски центар на научно и филозофско учење.' },
    de: { title: 'Das Haus der Weisheit, Bagdad', description: 'Der abbasidische Kalif al-Ma’mun gründet das Haus der Weisheit in Bagdad, das größte Zentrum wissenschaftlicher und philosophischer Gelehrsamkeit der Welt.' },
    fr: { title: 'La Maison de la sagesse, Bagdad', description: 'Le calife abbasside al-Ma’mun fonde la Maison de la sagesse à Bagdad, le plus grand centre de savoir scientifique et philosophique du monde.' }
  },
  't-hastings': {
    es: { title: 'Batalla de Hastings', description: 'Guillermo el Conquistador derrota al rey Harold de Inglaterra, transformando fundamentalmente la cultura, el idioma y el gobierno ingleses.' },
    ru: { title: 'Битва при Гастингсе', description: 'Вильгельм Завоеватель побеждает короля Гарольда Английского, коренным образом преобразуя английскую культуру, язык и управление.' },
    mk: { title: 'Битката кај Хастингс', description: 'Вилхелм Освојувачот го поразува Кралот Харолд на Англија, фундаментално трансформирајќи ја англиската култура, јазик и управување.' },
    de: { title: 'Die Schlacht bei Hastings', description: 'Wilhelm der Eroberer besiegt König Harold von England und verwandelt die englische Kultur, Sprache und Regierungsweise von Grund auf.' },
    fr: { title: 'La bataille de Hastings', description: 'Guillaume le Conquérant défait le roi Harold d’Angleterre, transformant en profondeur la culture, la langue et le gouvernement anglais.' }
  },
  't-crusades': {
    es: { title: 'Primera Cruzada Convocada', description: 'El papa Urbano II llama a una guerra santa para recuperar Jerusalén, lanzando la Primera Cruzada y siglos de conflicto religioso en Tierra Santa.' },
    ru: { title: 'Призыв к Первому крестовому походу', description: 'Папа Урбан II призывает к священной войне за освобождение Иерусалима, начиная Первый крестовый поход и столетия религиозных конфликтов на Святой земле.' },
    mk: { title: 'Повик за Прв Крстоносен Поход', description: 'Папата Урбан II повикал на света војна за повраток на Ерусалим, покренувајќи го Првиот Крстоносен Поход и векови верски конфликти во Светата Земја.' },
    de: { title: 'Aufruf zum Ersten Kreuzzug', description: 'Papst Urban II. ruft zum heiligen Krieg auf, um Jerusalem zurückzuerobern, und löst damit den Ersten Kreuzzug und Jahrhunderte religiöser Konflikte im Heiligen Land aus.' },
    fr: { title: 'Appel à la première croisade', description: 'Le pape Urbain II appelle à une guerre sainte pour reprendre Jérusalem, lançant la première croisade et des siècles de conflit religieux en Terre sainte.' }
  },
  't-magna-carta': {
    es: { title: 'Magna Carta', description: 'El rey Juan de Inglaterra es obligado a firmar la Magna Carta, limitando el poder real y estableciendo que el rey está sujeto al estado de derecho.' },
    ru: { title: 'Великая хартия вольностей', description: 'Король Иоанн Английский вынужден подписать Великую хартию вольностей, ограничивающую королевскую власть и устанавливающую верховенство закона.' },
    mk: { title: 'Велика Повелба', description: 'Кралот Јован на Англија е принуден да ја потпише Magna Carta, ограничувајќи ја кралската власт и воспоставувајќи дека кралот е подложен на владеење на правото.' },
    de: { title: 'Die Magna Carta', description: 'König Johann von England wird gezwungen, die Magna Carta zu unterzeichnen, die die königliche Macht beschränkt und festlegt, dass auch der König dem Gesetz unterworfen ist.' },
    fr: { title: 'La Grande Charte', description: 'Le roi Jean d’Angleterre est contraint de signer la Grande Charte, limitant le pouvoir royal et établissant que le roi est soumis à la loi.' }
  },
  't-mongols': {
    es: { title: 'Fundación del Imperio Mongol', description: 'Gengis Kan une a las tribus mongolas e inicia conquistas que crearán el mayor imperio contiguo de la historia.' },
    ru: { title: 'Основание Монгольской империи', description: 'Чингисхан объединяет монгольские племена и начинает завоевания, создавшие крупнейшую сухопутную империю в истории.' },
    mk: { title: 'Основање на Монголската империја', description: 'Џингис Кан ги обединил монголските племиња и ги започнал освојувањата кои ќе создадат најголемата копнена империја во историјата.' },
    de: { title: 'Gründung des Mongolenreichs', description: 'Dschingis Khan einigt die mongolischen Stämme und beginnt Eroberungen, die das größte zusammenhängende Landreich der Geschichte schaffen werden.' },
    fr: { title: 'Fondation de l’Empire mongol', description: 'Gengis Khan unifie les tribus mongoles et entame des conquêtes qui créeront le plus vaste empire terrestre d’un seul tenant de l’histoire.' }
  },
  't-black-death': {
    es: { title: 'La Peste Negra llega a Europa', description: 'La peste bubónica llega a Sicilia, iniciando una pandemia que matará al 30-60% de la población europea en los siguientes seis años.' },
    ru: { title: 'Чёрная смерть достигает Европы', description: 'Бубонная чума достигает Сицилии, начиная пандемию, которая унесёт жизни 30-60% населения Европы за следующие шесть лет.' },
    mk: { title: 'Черната Чума Стигнала во Европа', description: 'Бубонската чума стигнала на Сицилија, почнувајќи пандемија која ќе убие 30-60% од европското население во следните шест години.' },
    de: { title: 'Der Schwarze Tod erreicht Europa', description: 'Die Beulenpest erreicht Sizilien und beginnt eine Pandemie, die in den nächsten sechs Jahren 30–60 % der Bevölkerung Europas töten wird.' },
    fr: { title: 'La peste noire atteint l’Europe', description: 'La peste bubonique arrive en Sicile, déclenchant une pandémie qui tuera 30 à 60 % de la population de l’Europe en six ans.' }
  },
  't-printing-press': {
    es: { title: 'La Imprenta de Gutenberg', description: 'Johannes Gutenberg inventa la imprenta de tipos móviles, haciendo los libros asequibles y permitiendo la rápida difusión del Renacimiento y la Reforma.' },
    ru: { title: 'Печатный станок Гутенберга', description: 'Иоганн Гутенберг изобретает печатный станок с наборными литерами, делая книги доступными и обеспечивая быстрое распространение Ренессанса и Реформации.' },
    mk: { title: 'Печатарската Преса на Гутенберг', description: 'Јохан Гутенберг го измислил подвижниот тип, правејќи книги достапни и овозможувајќи брзо ширење на Ренесансата и Реформацијата.' },
    de: { title: 'Gutenbergs Druckerpresse', description: 'Johannes Gutenberg erfindet den Druck mit beweglichen Lettern, macht Bücher erschwinglich und ermöglicht die rasche Verbreitung von Renaissance und Reformation.' },
    fr: { title: 'L’imprimerie de Gutenberg', description: 'Johannes Gutenberg invente l’imprimerie à caractères mobiles, rendant les livres abordables et permettant la diffusion rapide de la Renaissance et de la Réforme.' }
  },
  't-columbus': {
    es: { title: 'Colón Llega a las Américas', description: 'Cristóbal Colón, navegando para España, desembarca en el Caribe, iniciando el contacto sostenido entre Europa y las Américas.' },
    ru: { title: 'Колумб достигает Америки', description: 'Христофор Колумб, плывущий под флагом Испании, высаживается на Карибских островах, начиная устойчивый контакт между Европой и Америкой.' },
    mk: { title: 'Колумбо Стигнал до Америките', description: 'Кристофер Колумбо, пловејќи за Шпанија, слегол во Карибите, почнувајќи одржан контакт меѓу Европа и Америките.' },
    de: { title: 'Kolumbus erreicht Amerika', description: 'Christoph Kolumbus, im Dienst Spaniens segelnd, geht in der Karibik an Land — der Beginn dauerhaften Kontakts zwischen Europa und Amerika.' },
    fr: { title: 'Colomb atteint les Amériques', description: 'Christophe Colomb, naviguant pour l’Espagne, touche terre dans les Caraïbes — le début d’un contact durable entre l’Europe et les Amériques.' }
  },
  't-vasco': {
    es: { title: 'Vasco da Gama Llega a India', description: 'El explorador portugués Vasco da Gama navega alrededor de África para llegar a India, abriendo una ruta marítima directa al comercio de especias de Asia.' },
    ru: { title: 'Васко да Гама достигает Индии', description: 'Португальский мореплаватель Васко да Гама огибает Африку и достигает Индии, открывая прямой морской путь к пряностям Азии.' },
    mk: { title: 'Васко да Гама Стигнал до Индија', description: 'Португалскиот истражувач Васко да Гама пловел околу Африка за да стигне до Индија, отворајќи директен поморски пат до азиската трговија со зачини.' },
    de: { title: 'Vasco da Gama erreicht Indien', description: 'Der portugiesische Entdecker Vasco da Gama umsegelt Afrika bis nach Indien und eröffnet einen direkten Seeweg zum Gewürzhandel Asiens.' },
    fr: { title: 'Vasco de Gama atteint l’Inde', description: 'L’explorateur portugais Vasco de Gama contourne l’Afrique pour atteindre l’Inde, ouvrant une route maritime directe vers le commerce des épices d’Asie.' }
  },
  't-luther': {
    es: { title: 'Las 95 Tesis de Lutero', description: 'Martín Lutero publica sus 95 Tesis desafiando la corrupción eclesiástica y las indulgencias, lanzando la Reforma Protestante.' },
    ru: { title: '95 тезисов Лютера', description: 'Мартин Лютер публикует 95 тезисов, бросая вызов церковной коррупции и индульгенциям, и запуская Протестантскую реформацию.' },
    mk: { title: '95-те Тези на Лутер', description: 'Мартин Лутер ги публикувал своите 95 тези оспорувајќи ја корупцијата на Црквата и одговорите, покренувајќи ја Протестантската Реформација.' },
    de: { title: 'Luthers 95 Thesen', description: 'Martin Luther schlägt seine 95 Thesen an, die die Korruption der Kirche und den Ablasshandel anprangern, und löst damit die Reformation aus.' },
    fr: { title: 'Les 95 thèses de Luther', description: 'Martin Luther affiche ses 95 thèses dénonçant la corruption de l’Église et les indulgences, déclenchant la Réforme protestante.' }
  },
  't-copernicus': {
    es: { title: 'Revolución Copernicana', description: 'Nicolás Copérnico publica su modelo heliocéntrico del sistema solar, iniciando la Revolución Científica.' },
    ru: { title: 'Коперниканская революция', description: 'Николай Коперник публикует гелиоцентрическую модель Солнечной системы, положив начало Научной революции.' },
    mk: { title: 'Коперниканска револуција', description: 'Николај Коперник го публикувал хелиоцентричниот модел на сончевиот систем, почнувајќи ја Научната револуција.' },
    de: { title: 'Die kopernikanische Wende', description: 'Nikolaus Kopernikus veröffentlicht sein heliozentrisches Modell des Sonnensystems und leitet damit die wissenschaftliche Revolution ein.' },
    fr: { title: 'La révolution copernicienne', description: 'Nicolas Copernic publie son modèle héliocentrique du système solaire, amorçant la révolution scientifique.' }
  },
  't-armada': {
    es: { title: 'Derrota de la Armada Española', description: 'Inglaterra derrota a la Armada Española, señalando el declive del dominio naval español y el ascenso del poder marítimo inglés.' },
    ru: { title: 'Разгром Испанской армады', description: 'Англия разгромила Испанскую армаду, ознаменовав упадок испанского морского господства и подъём английской морской мощи.' },
    mk: { title: 'Поразот на Шпанската Армада', description: 'Англија ја победила Шпанската Армада, сигнализирајќи го опаѓањето на шпанската поморска доминација и подемот на англиската морска моќ.' },
    de: { title: 'Niederlage der Spanischen Armada', description: 'England besiegt die Spanische Armada, ein Zeichen für den Niedergang der spanischen Seeherrschaft und den Aufstieg der englischen Seemacht.' },
    fr: { title: 'Défaite de l’Armada espagnole', description: 'L’Angleterre défait l’Armada espagnole, signe du déclin de la suprématie navale espagnole et de la montée de la puissance maritime anglaise.' }
  },
  't-galileo': {
    es: { title: 'Galileo y el Telescopio', description: 'Galileo apunta el telescopio al cielo, descubriendo las lunas de Júpiter y las fases de Venus, confirmando el modelo copernicano.' },
    ru: { title: 'Галилей и телескоп', description: 'Галилей направляет телескоп на небо, обнаруживая спутники Юпитера и фазы Венеры, подтверждая модель Коперника.' },
    mk: { title: 'Галилеј и Телескопот', description: 'Галилеј го насочил телескопот кон небото, откривајќи месечини на Јупитер и фази на Венера, потврдувајќи го Коперниковиот модел.' },
    de: { title: 'Galileo und das Fernrohr', description: 'Galileo richtet das Fernrohr auf den Himmel und entdeckt Jupitermonde und die Phasen der Venus — eine Bestätigung des kopernikanischen Modells.' },
    fr: { title: 'Galilée et la lunette', description: 'Galilée braque la lunette sur les cieux et découvre les lunes de Jupiter et les phases de Vénus — confirmant le modèle copernicien.' }
  },
  't-thirty-years-war': {
    es: { title: 'Inicio de la Guerra de los Treinta Años', description: 'Una guerra religiosa y política devastadora desgarra Europa central, matando a 8 millones de personas y rediseñando el continente.' },
    ru: { title: 'Начало Тридцатилетней войны', description: 'Разрушительная религиозно-политическая война раздирает Центральную Европу, унося 8 миллионов жизней и перекраивая континент.' },
    mk: { title: 'Почеток на Триесетгодишната војна', description: 'Разурнувачка верска и политичка војна ја раскинала Централна Европа, убивајќи 8 милиони луѓе и преобликувајќи го континентот.' },
    de: { title: 'Beginn des Dreißigjährigen Krieges', description: 'Ein verheerender religiöser und politischer Krieg zerreißt Mitteleuropa, tötet 8 Millionen Menschen und formt den Kontinent neu.' },
    fr: { title: 'Début de la guerre de Trente Ans', description: 'Une guerre religieuse et politique dévastatrice déchire l’Europe centrale, tuant 8 millions de personnes et remodelant le continent.' }
  },
  't-westphalia': {
    es: { title: 'Paz de Westfalia', description: 'Los tratados que ponen fin a la Guerra de los Treinta Años establecen el principio de soberanía nacional, fundamento del orden internacional moderno.' },
    ru: { title: 'Вестфальский мир', description: 'Договоры, завершившие Тридцатилетнюю войну, устанавливают принцип национального суверенитета — основу современного международного порядка.' },
    mk: { title: 'Мирот во Вестфалија', description: 'Договорите со кои завршила Триесетгодишната војна го воспоставиле принципот на национален суверенитет — темелот на современиот меѓународен поредок.' },
    de: { title: 'Der Westfälische Friede', description: 'Die Verträge, die den Dreißigjährigen Krieg beenden, begründen das Prinzip der nationalen Souveränität — die Grundlage der modernen internationalen Ordnung.' },
    fr: { title: 'Les traités de Westphalie', description: 'Les traités mettant fin à la guerre de Trente Ans établissent le principe de souveraineté nationale — le fondement de l’ordre international moderne.' }
  },
  't-newton': {
    es: { title: 'Principia de Newton', description: 'Isaac Newton publica sus leyes del movimiento y la gravitación universal, proporcionando un marco matemático para comprender el universo físico.' },
    ru: { title: '«Начала» Ньютона', description: 'Исаак Ньютон публикует законы движения и всемирного тяготения, создавая математическую основу для понимания физической вселенной.' },
    mk: { title: 'Принципите на Њутн', description: 'Исак Њутн ги публикувал законите за движење и универзалната гравитација, обезбедувајќи математичка рамка за разбирање на физичкиот универзум.' },
    de: { title: 'Newtons Principia', description: 'Isaac Newton veröffentlicht seine Bewegungsgesetze und das Gesetz der allgemeinen Gravitation und liefert einen mathematischen Rahmen zum Verständnis des physikalischen Universums.' },
    fr: { title: 'Les Principia de Newton', description: 'Isaac Newton publie ses lois du mouvement et de la gravitation universelle, offrant un cadre mathématique pour comprendre l’univers physique.' }
  },
  't-glorious-revolution': {
    es: { title: 'Revolución Gloriosa', description: 'La Revolución Gloriosa de Inglaterra establece la monarquía constitucional y la supremacía parlamentaria, influyendo en los gobiernos democráticos del mundo.' },
    ru: { title: 'Славная революция', description: 'Английская Славная революция устанавливает конституционную монархию и парламентское верховенство, влияя на демократические правительства во всём мире.' },
    mk: { title: 'Славна револуција', description: 'Англиската Славна револуција ја воспоставила уставната монархија и парламентарната супремација, влијаејќи на демократски влади низ светот.' },
    de: { title: 'Die Glorreiche Revolution', description: 'Englands Glorreiche Revolution begründet die konstitutionelle Monarchie und die Vorherrschaft des Parlaments — mit Einfluss auf demokratische Regierungen weltweit.' },
    fr: { title: 'La Glorieuse Révolution', description: 'La Glorieuse Révolution d’Angleterre établit la monarchie constitutionnelle et la suprématie parlementaire — influençant les gouvernements démocratiques du monde entier.' }
  },
  't-american-revolution': {
    es: { title: 'Declaración de Independencia de los Estados Unidos', description: 'Las trece colonias americanas declaran la independencia de Gran Bretaña, fundando una república basada en los principios ilustrados de libertad y derechos naturales.' },
    ru: { title: 'Американская Декларация независимости', description: 'Тринадцать американских колоний объявляют независимость от Британии, основывая республику на просветительских принципах свободы и естественных прав.' },
    mk: { title: 'Американска Декларација за Независност', description: 'Тринаесетте американски колонии ја прогласуваат независноста од Британија, основајќи република базирана на просветителски принципи на слобода и природни права.' },
    de: { title: 'Die amerikanische Unabhängigkeitserklärung', description: 'Die dreizehn amerikanischen Kolonien erklären ihre Unabhängigkeit von Britannien und gründen eine Republik auf den Grundsätzen der Aufklärung von Freiheit und natürlichen Rechten.' },
    fr: { title: 'La Déclaration d’indépendance américaine', description: 'Les treize colonies américaines déclarent leur indépendance de la Grande-Bretagne, fondant une république sur les principes des Lumières de liberté et de droits naturels.' }
  },
  't-french-revolution': {
    es: { title: 'Revolución Francesa', description: 'La Revolución Francesa derroca la monarquía y la aristocracia, difundiendo los ideales de libertad, igualdad y soberanía nacional por toda Europa.' },
    ru: { title: 'Французская революция', description: 'Французская революция свергает монархию и аристократию, распространяя идеалы свободы, равенства и народного суверенитета по всей Европе.' },
    mk: { title: 'Француска револуција', description: 'Француската револуција ги урнала монархијата и аристократијата, ширејќи ги идеалите на слобода, еднаквост и национален суверенитет низ Европа.' },
    de: { title: 'Die Französische Revolution', description: 'Die Französische Revolution stürzt Monarchie und Adel und verbreitet die Ideale von Freiheit, Gleichheit und nationaler Souveränität in ganz Europa.' },
    fr: { title: 'La Révolution française', description: 'La Révolution française renverse la monarchie et l’aristocratie, répandant les idéaux de liberté, d’égalité et de souveraineté nationale à travers l’Europe.' }
  },
  't-steam-engine': {
    es: { title: 'La Máquina de Vapor de Watt', description: 'James Watt patenta una máquina de vapor mejorada, proporcionando la fuente de energía para la Revolución Industrial británica.' },
    ru: { title: 'Паровая машина Уатта', description: 'Джеймс Уатт патентует усовершенствованную паровую машину, обеспечивая источник энергии для британской промышленной революции.' },
    mk: { title: 'Парната Машина на Ват', description: 'Џејмс Ват го патентирал подобрениот паров мотор, обезбедувајќи извор на енергија за британската Индустриска револуција.' },
    de: { title: 'Watts Dampfmaschine', description: 'James Watt lässt eine verbesserte Dampfmaschine patentieren und liefert damit die Antriebskraft für Britanniens Industrielle Revolution.' },
    fr: { title: 'La machine à vapeur de Watt', description: 'James Watt fait breveter une machine à vapeur perfectionnée, fournissant la source d’énergie de la révolution industrielle britannique.' }
  },
  't-napoleon': {
    es: { title: 'Napoleón Coronado Emperador', description: 'Napoleón Bonaparte se corona Emperador de Francia, iniciando una década de conquista europea que difunde los ideales revolucionarios y remodela el continente.' },
    ru: { title: 'Наполеон коронован императором', description: 'Наполеон Бонапарт коронует себя Императором Франции, начиная десятилетие европейских завоеваний, распространяющих революционные идеалы и перекраивающих континент.' },
    mk: { title: 'Наполеон Крунисан за Цар', description: 'Наполеон Бонапарта се крунисал за Цар на Франција, почнувајќи декада на европско освојување кое ги шири револуционерните идеали.' },
    de: { title: 'Napoleon zum Kaiser gekrönt', description: 'Napoleon Bonaparte krönt sich selbst zum Kaiser von Frankreich und beginnt ein Jahrzehnt europäischer Eroberung, das revolutionäre Ideale verbreitet und den Kontinent umgestaltet.' },
    fr: { title: 'Napoléon couronné empereur', description: 'Napoléon Bonaparte se couronne empereur des Français, entamant une décennie de conquêtes européennes qui répand les idéaux révolutionnaires et remodèle le continent.' }
  },
  't-railways': {
    es: { title: 'Ferrocarril Liverpool-Mánchester', description: 'El primer ferrocarril de pasajeros del mundo abre en Inglaterra, iniciando la era ferroviaria y la dramática reducción de las distancias.' },
    ru: { title: 'Железная дорога Ливерпуль–Манчестер', description: 'В Англии открывается первая в мире пассажирская железная дорога, начиная железнодорожную эпоху и резкое сокращение расстояний.' },
    mk: { title: 'Железницата Ливерпул-Манчестер', description: 'Во Англија се отвора првата патничка железница во светот, почнувајќи ја железничката ера и драматичното намалување на растојанијата.' },
    de: { title: 'Die Eisenbahn Liverpool–Manchester', description: 'Die erste Personeneisenbahn der Welt wird in England eröffnet und leitet das Eisenbahnzeitalter und die dramatische Schrumpfung der Entfernungen ein.' },
    fr: { title: 'Le chemin de fer Liverpool–Manchester', description: 'Le premier chemin de fer de voyageurs du monde ouvre en Angleterre, inaugurant l’âge du rail et le rétrécissement spectaculaire des distances.' }
  },
  't-communist-manifesto': {
    es: { title: 'Manifiesto Comunista', description: 'Karl Marx y Friedrich Engels publican El Manifiesto Comunista, texto fundacional de los movimientos socialistas y comunistas de todo el mundo.' },
    ru: { title: 'Коммунистический манифест', description: 'Карл Маркс и Фридрих Энгельс публикуют «Манифест Коммунистической партии» — основополагающий текст для социалистических и коммунистических движений всего мира.' },
    mk: { title: 'Комунистички Манифест', description: 'Карл Маркс и Фридрих Енгелс го публикуваат Комунистичкиот Манифест, основен текст за социјалистичките и комунистичките движења низ светот.' },
    de: { title: 'Das Kommunistische Manifest', description: 'Karl Marx und Friedrich Engels veröffentlichen das Kommunistische Manifest, einen Grundlagentext für sozialistische und kommunistische Bewegungen weltweit.' },
    fr: { title: 'Le Manifeste communiste', description: 'Karl Marx et Friedrich Engels publient le Manifeste communiste, texte fondateur des mouvements socialistes et communistes du monde entier.' }
  },
  't-american-civil-war': {
    es: { title: 'Guerra Civil Americana', description: 'La Guerra Civil de los Estados Unidos (1861-1865) pone fin a la esclavitud y preserva la Unión, convirtiéndose en la guerra más sangrienta de la historia americana.' },
    ru: { title: 'Американская Гражданская война', description: 'Гражданская война в США (1861–1865) отменяет рабство и сохраняет Союз, став самой кровопролитной войной в американской истории.' },
    mk: { title: 'Американска Граѓанска војна', description: 'Американската Граѓанска војна (1861-1865) го укинала ропството и ја зачувала Унијата, станувајќи најкрвавата војна во американската историја.' },
    de: { title: 'Der Amerikanische Bürgerkrieg', description: 'Der Bürgerkrieg der Vereinigten Staaten (1861–1865) beendet die Sklaverei und bewahrt die Union — der blutigste Krieg der amerikanischen Geschichte.' },
    fr: { title: 'La guerre de Sécession', description: 'La guerre de Sécession des États-Unis (1861–1865) met fin à l’esclavage et préserve l’Union, devenant la guerre la plus sanglante de l’histoire américaine.' }
  },
  't-darwin': {
    es: { title: 'El Origen de las Especies de Darwin', description: 'Charles Darwin publica su teoría de la evolución por selección natural, una de las ideas científicas más revolucionarias de la historia.' },
    ru: { title: '«Происхождение видов» Дарвина', description: 'Чарльз Дарвин публикует теорию эволюции путём естественного отбора — одну из самых революционных научных идей в истории.' },
    mk: { title: 'Потекло на Видовите на Дарвин', description: 'Чарлс Дарвин ја публикувал теоријата за еволуцијата преку природна селекција — една од најреволуционерните научни идеи во историјата.' },
    de: { title: 'Darwins Über die Entstehung der Arten', description: 'Charles Darwin veröffentlicht seine Theorie der Evolution durch natürliche Selektion — eine der revolutionärsten wissenschaftlichen Ideen der Geschichte.' },
    fr: { title: 'L’Origine des espèces de Darwin', description: 'Charles Darwin publie sa théorie de l’évolution par la sélection naturelle — l’une des idées scientifiques les plus révolutionnaires de l’histoire.' }
  },
  't-wwi': {
    es: { title: 'Comienza la Primera Guerra Mundial', description: 'El asesinato del archiduque Francisco Fernando desencadena una reacción en cadena que hunde a Europa y gran parte del mundo en cuatro años de devastadora guerra industrial.' },
    ru: { title: 'Начало Первой мировой войны', description: 'Убийство эрцгерцога Франца Фердинанда запускает цепную реакцию, погружая Европу и большую часть мира в четыре года опустошительной промышленной войны.' },
    mk: { title: 'Почеток на Првата Светска војна', description: 'Атентатот врз Ерцхерцогот Франц Фердинанд предизвикал синџирна реакција која ја потопила Европа и голем дел од светот во четири години разурнувачка индустриска војна.' },
    de: { title: 'Beginn des Ersten Weltkriegs', description: 'Die Ermordung von Erzherzog Franz Ferdinand löst eine Kettenreaktion aus, die Europa und einen Großteil der Welt in vier Jahre verheerenden industriellen Krieges stürzt.' },
    fr: { title: 'Début de la Première Guerre mondiale', description: 'L’assassinat de l’archiduc François-Ferdinand déclenche une réaction en chaîne qui plonge l’Europe et une grande partie du monde dans quatre ans de guerre industrielle dévastatrice.' }
  },
  't-russian-revolution': {
    es: { title: 'Revolución Rusa', description: 'La Revolución Bolchevique bajo Lenin derroca al Zar y establece el primer estado comunista del mundo, la Unión Soviética.' },
    ru: { title: 'Русская революция', description: 'Большевистская революция под руководством Ленина свергает царя и создаёт первое в мире коммунистическое государство — Советский Союз.' },
    mk: { title: 'Руска револуција', description: 'Болшевичката револуција под Ленин го урнала Царот и го воспоставила првиот комунистички режим во светот, Советскиот Сојуз.' },
    de: { title: 'Die Russische Revolution', description: 'Die bolschewistische Revolution unter Lenin stürzt den Zaren und errichtet den ersten kommunistischen Staat der Welt, die Sowjetunion.' },
    fr: { title: 'La Révolution russe', description: 'La révolution bolchevique sous Lénine renverse le tsar et établit le premier État communiste du monde, l’Union soviétique.' }
  },
  't-versailles': {
    es: { title: 'Tratado de Versalles', description: 'El acuerdo de paz que pone fin a la Primera Guerra Mundial impone condiciones duras a Alemania, contribuyendo a los resentimientos que llevaron a la Segunda Guerra Mundial.' },
    ru: { title: 'Версальский договор', description: 'Мирное соглашение, завершившее Первую мировую войну, налагает суровые условия на Германию, способствуя обидам, которые привели ко Второй мировой войне.' },
    mk: { title: 'Версајскиот Договор', description: 'Мировниот договор со кој завршила Первата Светска војна наметнал тешки услови на Германија, придонесувајќи кон незадоволствата кои доведоа до Втората Светска војна.' },
    de: { title: 'Der Vertrag von Versailles', description: 'Die Friedensregelung zum Ende des Ersten Weltkriegs erlegt Deutschland harte Bedingungen auf — und trägt zu den Ressentiments bei, die zum Zweiten Weltkrieg führten.' },
    fr: { title: 'Le traité de Versailles', description: 'Le règlement de paix mettant fin à la Première Guerre mondiale impose de dures conditions à l’Allemagne — nourrissant les ressentiments qui menèrent à la Seconde Guerre mondiale.' }
  },
  't-great-depression': {
    es: { title: 'Comienza la Gran Depresión', description: 'El Crack de Wall Street desencadena una depresión económica global, causando desempleo masivo e inestabilidad política que impulsa movimientos extremistas.' },
    ru: { title: 'Начало Великой депрессии', description: 'Крах Уолл-стрит запускает мировую экономическую депрессию, вызывая массовую безработицу и политическую нестабильность, усиливающую экстремизм.' },
    mk: { title: 'Почеток на Големата Депресија', description: 'Крашот на Волстрит предизвикал глобална економска депресија, создавајќи масовна невработеност и политичка нестабилност која ги зајакнала екстремистичките движења.' },
    de: { title: 'Beginn der Großen Depression', description: 'Der Börsenkrach an der Wall Street löst eine weltweite Wirtschaftsdepression aus, die Massenarbeitslosigkeit und politische Instabilität hervorruft und extremistische Bewegungen stärkt.' },
    fr: { title: 'Début de la Grande Dépression', description: 'Le krach de Wall Street déclenche une dépression économique mondiale, provoquant chômage de masse et instabilité politique qui renforcent les mouvements extrémistes.' }
  },
  't-wwii': {
    es: { title: 'Comienza la Segunda Guerra Mundial', description: 'La invasión de Polonia por Alemania el 1 de septiembre desencadena la Segunda Guerra Mundial — el conflicto más mortífero de la historia humana, con 70-85 millones de muertos.' },
    ru: { title: 'Начало Второй мировой войны', description: 'Вторжение Германии в Польшу 1 сентября развязывает Вторую мировую войну — самый смертоносный конфликт в истории человечества, унёсший 70–85 миллионов жизней.' },
    mk: { title: 'Почеток на Втората Светска војна', description: 'Германската инвазија на Полска на 1 септември ја покренала Втората Светска војна — најсмртоносниот конфликт во историјата на човештвото, со 70-85 милиони мртви.' },
    de: { title: 'Beginn des Zweiten Weltkriegs', description: 'Deutschlands Überfall auf Polen am 1. September löst den Zweiten Weltkrieg aus — den tödlichsten Konflikt der Menschheitsgeschichte, der 70–85 Millionen Menschen tötet.' },
    fr: { title: 'Début de la Seconde Guerre mondiale', description: 'L’invasion de la Pologne par l’Allemagne le 1er septembre déclenche la Seconde Guerre mondiale — le conflit le plus meurtrier de l’histoire humaine, faisant 70 à 85 millions de morts.' }
  },
  't-holocaust': {
    es: { title: 'Holocausto — Conferencia de Wannsee', description: 'La Alemania nazi implementa la "Solución Final", asesinando sistemáticamente a 6 millones de judíos y millones más en un genocidio industrial.' },
    ru: { title: 'Холокост — Ванзейская конференция', description: 'нацистская Германия реализует «Окончательное решение», систематически уничтожая 6 миллионов евреев и миллионы других в промышленном геноциде.' },
    mk: { title: 'Холокаустот — Конференција Ванзее', description: 'Нацистичка Германија го спроведува „Конечното Решение", систематски убивајќи 6 милиони Евреи и милиони други во индустриски геноцид.' },
    de: { title: 'Der Holocaust — Wannseekonferenz', description: 'Das nationalsozialistische Deutschland setzt die „Endlösung“ um und ermordet systematisch 6 Millionen Juden und Millionen weiterer Menschen in einem industriellen Völkermord.' },
    fr: { title: 'La Shoah — conférence de Wannsee', description: 'L’Allemagne nazie met en œuvre la « solution finale », assassinant systématiquement 6 millions de Juifs et des millions d’autres dans un génocide industriel.' }
  },
  't-hiroshima': {
    es: { title: 'Bombas Atómicas sobre Japón', description: 'EEUU lanza bombas atómicas sobre Hiroshima y Nagasaki, poniendo fin a la Segunda Guerra Mundial e inaugurando la era nuclear.' },
    ru: { title: 'Атомные бомбы на Японию', description: 'США сбрасывают атомные бомбы на Хиросиму и Нагасаки, завершая Вторую мировую войну и открывая ядерную эпоху.' },
    mk: { title: 'Атомски Бомби врз Јапонија', description: 'САД фрлиле атомски бомби на Хирошима и Нагасаки, завршувајќи ја Втората Светска војна и отворајќи ја нуклеарната ера.' },
    de: { title: 'Atombomben auf Japan', description: 'Die USA werfen Atombomben auf Hiroshima und Nagasaki ab, beenden den Zweiten Weltkrieg und läuten das Atomzeitalter ein.' },
    fr: { title: 'Bombes atomiques sur le Japon', description: 'Les États-Unis larguent des bombes atomiques sur Hiroshima et Nagasaki, mettant fin à la Seconde Guerre mondiale et inaugurant l’ère nucléaire.' }
  },
  't-cold-war': {
    es: { title: 'Comienza la Guerra Fría', description: 'Estados Unidos anuncia la Doctrina Truman para contener el comunismo, iniciando cuatro décadas de competencia geopolítica entre las superpotencias.' },
    ru: { title: 'Начало холодной войны', description: 'США объявляют доктрину Трумэна для сдерживания коммунизма, начиная четыре десятилетия геополитического соперничества между сверхдержавами.' },
    mk: { title: 'Почеток на Студената војна', description: 'САД ја прогласиле Труман Доктрината за задржување на комунизмот, почнувајќи четири децении геополитичка конкуренција меѓу суперсилите.' },
    de: { title: 'Beginn des Kalten Krieges', description: 'Die USA verkünden die Truman-Doktrin zur Eindämmung des Kommunismus und beginnen damit vier Jahrzehnte geopolitischer Rivalität zwischen den Supermächten.' },
    fr: { title: 'Début de la guerre froide', description: 'Les États-Unis annoncent la doctrine Truman pour endiguer le communisme, entamant quatre décennies de rivalité géopolitique entre les superpuissances.' }
  },
  't-decolonization': {
    es: { title: 'Independencia de India', description: 'India y Pakistán obtienen la independencia de Gran Bretaña, iniciando una ola de descolonización que da independencia a decenas de nuevas naciones en las siguientes décadas.' },
    ru: { title: 'Независимость Индии', description: 'Индия и Пакистан обретают независимость от Британии, начиная волну деколонизации, давшей независимость десяткам новых государств в последующие десятилетия.' },
    mk: { title: 'Независноста на Индија', description: 'Индија и Пакистан добиле независност од Британија, почнувајќи бран на деколонизација кој им дал независност на десетици нови нации во следните децении.' },
    de: { title: 'Die Unabhängigkeit Indiens', description: 'Indien und Pakistan erlangen ihre Unabhängigkeit von Britannien und lösen eine Welle der Entkolonialisierung aus, die in den folgenden Jahrzehnten Dutzenden neuer Nationen die Unabhängigkeit bringt.' },
    fr: { title: 'L’indépendance de l’Inde', description: 'L’Inde et le Pakistan accèdent à l’indépendance de la Grande-Bretagne, amorçant une vague de décolonisation qui donnera l’indépendance à des dizaines de nouvelles nations au fil des décennies suivantes.' }
  },
  't-moon': {
    es: { title: 'Alunizaje', description: 'El Apolo 11 de la NASA lleva a Neil Armstrong y Buzz Aldrin a la Luna — el mayor logro individual de la carrera espacial.' },
    ru: { title: 'Высадка на Луне', description: 'Аполлон-11 НАСА доставляет Нила Армстронга и Базза Олдрина на Луну — величайшее единичное достижение Космической гонки.' },
    mk: { title: 'Слетување на Месечината', description: 'Аполо 11 на НАСА ги слетал Нил Армстронг и Баз Олдрин на Месечината — најголемото единствено достигнување на Трката во Вселената.' },
    de: { title: 'Die Mondlandung', description: 'Die Apollo 11 der NASA setzt Neil Armstrong und Buzz Aldrin auf dem Mond ab — die größte Einzelleistung des Wettlaufs ins All.' },
    fr: { title: 'Les premiers pas sur la Lune', description: 'Apollo 11 de la NASA pose Neil Armstrong et Buzz Aldrin sur la Lune — le plus grand exploit de la course à l’espace.' }
  },
  't-berlin-wall': {
    es: { title: 'Caída del Muro de Berlín', description: 'El Muro de Berlín cae el 9 de noviembre de 1989, simbolizando el colapso de la Europa comunista oriental y el fin de la Guerra Fría.' },
    ru: { title: 'Падение Берлинской стены', description: 'Берлинская стена падает 9 ноября 1989 года, символизируя крах коммунистической Восточной Европы и конец холодной войны.' },
    mk: { title: 'Падот на Берлинскиот Ѕид', description: 'Берлинскиот Ѕид паднал на 9 ноември 1989, симболизирајќи го распадот на комунистичка Источна Европа и крајот на Студената војна.' },
    de: { title: 'Der Fall der Berliner Mauer', description: 'Die Berliner Mauer fällt am 9. November 1989 und symbolisiert den Zusammenbruch des kommunistischen Osteuropas und das Ende des Kalten Krieges.' },
    fr: { title: 'La chute du mur de Berlin', description: 'Le mur de Berlin tombe le 9 novembre 1989, symbolisant l’effondrement de l’Europe de l’Est communiste et la fin de la guerre froide.' }
  },
  't-internet': {
    es: { title: 'La World Wide Web se hace pública', description: 'Tim Berners-Lee pone la World Wide Web a disposición del público, iniciando la era de Internet y transformando la comunicación y el comercio humanos.' },
    ru: { title: 'World Wide Web становится общедоступной', description: 'Тим Бернерс-Ли открывает World Wide Web для общего пользования, начиная интернет-эпоху и преобразуя человеческое общение и торговлю.' },
    mk: { title: 'World Wide Web стана Јавна', description: 'Тим Бернерс-Ли ја направил World Wide Web јавно достапна, почнувајќи ја интернет ерата и трансформирајќи ја човечката комуникација и трговија.' },
    de: { title: 'Das World Wide Web wird öffentlich', description: 'Tim Berners-Lee macht das World Wide Web öffentlich zugänglich, leitet das Internetzeitalter ein und verwandelt Kommunikation und Handel der Menschheit.' },
    fr: { title: 'Le World Wide Web devient public', description: 'Tim Berners-Lee rend le World Wide Web accessible au public, ouvrant l’ère d’Internet et transformant la communication et le commerce humains.' }
  },
  't-9-11': {
    es: { title: 'Ataques del 11 de Septiembre', description: 'Los ataques de Al-Qaeda matan a 3.000 personas en Nueva York y Washington, desencadenando la Guerra contra el Terror y redefiniéndose la seguridad global durante décadas.' },
    ru: { title: 'Теракты 11 сентября', description: 'Атаки «Аль-Каиды» убивают 3000 человек в Нью-Йорке и Вашингтоне, развязывая Войну с террором и переопределяя глобальную безопасность на десятилетия вперёд.' },
    mk: { title: 'Напади на 11 Септември', description: 'Нападите на Ал-Каеда убиле 3.000 луѓе во Њујорк и Вашингтон, покренувајќи ја Војната против Тероризмот и преобликувајќи ја глобалната безбедност за децении.' },
    de: { title: 'Die Anschläge des 11. September', description: 'Anschläge von al-Qaida töten 3.000 Menschen in New York und Washington, lösen den „Krieg gegen den Terror“ aus und prägen Sicherheit und Politik weltweit auf Jahrzehnte.' },
    fr: { title: 'Les attentats du 11 septembre', description: 'Les attentats d’al-Qaïda tuent 3 000 personnes à New York et Washington, déclenchant la « guerre contre le terrorisme » et remodelant la sécurité et la politique mondiales pour des décennies.' }
  },
  't-yugoslav-wars': {
    es: { title: 'Las Guerras Yugoslavas', description: 'La violenta disolución de Yugoslavia produce una serie de guerras. La Guerra de Bosnia (1992-1995) incluye el genocidio de Srebrenica, el peor de Europa desde la Segunda Guerra Mundial.' },
    ru: { title: 'Югославские войны', description: 'Насильственный распад Югославии порождает серию войн. Боснийская война (1992–1995) включает Сребреницкий геноцид — худший в Европе со времён Второй мировой войны.' },
    mk: { title: 'Југословенски Војни', description: 'Насилниот распад на Југославија создал серија войни. Босанската војна (1992-1995) го вклучила геноцидот во Сребреница — најлошиот во Европа по Втората Светска војна.' },
    de: { title: 'Die Jugoslawienkriege', description: 'Der gewaltsame Zerfall Jugoslawiens bringt eine Reihe von Kriegen in Slowenien, Kroatien, Bosnien-Herzegowina und im Kosovo hervor. Der Bosnienkrieg (1992–1995) umfasst den Völkermord von Srebrenica — den schwersten in Europa seit dem Zweiten Weltkrieg.' },
    fr: { title: 'Les guerres de Yougoslavie', description: 'La dissolution violente de la Yougoslavie engendre une série de guerres en Slovénie, en Croatie, en Bosnie-Herzégovine et au Kosovo. La guerre de Bosnie (1992–1995) comprend le génocide de Srebrenica — le pire d’Europe depuis la Seconde Guerre mondiale.' }
  },
  't-srebrenica': {
    es: { title: 'Masacre de Srebrenica', description: 'Fuerzas serbobosnias asesinan a más de 8.000 hombres y niños bosníacos en una zona segura declarada por la ONU, el peor acto de genocidio en Europa desde el Holocausto.' },
    ru: { title: 'Сребреницкий расстрел', description: 'Боснийско-сербские силы убивают более 8000 бошняков-мужчин и мальчиков в объявленной ООН безопасной зоне — худшее проявление геноцида в Европе со времён Холокоста.' },
    mk: { title: 'Масакрот во Сребреница', description: 'Босанско-српските сили убиле повеќе од 8.000 бошњачки мажи и момчиња во зона безбедна по UN — најлошиот геноцид во Европа по Холокаустот.' },
    de: { title: 'Das Massaker von Srebrenica', description: 'Bosnisch-serbische Kräfte ermorden über 8.000 bosniakische Männer und Jungen in einer von der UNO ausgerufenen Schutzzone — der schwerste Völkermord in Europa seit dem Holocaust, bestätigt vom Internationalen Gerichtshof.' },
    fr: { title: 'Le massacre de Srebrenica', description: 'Les forces serbes de Bosnie assassinent plus de 8 000 hommes et garçons bosniaques dans une zone de sécurité déclarée par l’ONU — le pire génocide en Europe depuis la Shoah, confirmé par la Cour internationale de justice.' }
  },
  't-macedonian-struggle': {
    es: { title: 'La Lucha Macedonia', description: 'Bandas armadas griega y búlgaras libran una guerra de guerrillas en Macedonia otomana por el control de su población, en medio del declive otomano.' },
    ru: { title: 'Македонская борьба', description: 'Греческие и болгарские вооружённые отряды ведут партизанскую войну в османской Македонии за контроль над её населением в условиях заката Османской империи.' },
    mk: { title: 'Македонската Борба', description: 'Грчки и бугарски вооружени чети водат герилска војна во Отоманска Македонија за контрола на нејзиното население, во услови на отоманскиот пад.' },
    de: { title: 'Der Makedonische Kampf', description: 'Griechische und bulgarische bewaffnete Banden führen einen Guerillakrieg im osmanischen Makedonien um die Kontrolle über die Bevölkerung der Region, während beide Nationen im Niedergang des Osmanischen Reiches um deren nationale Identität ringen.' },
    fr: { title: 'La lutte macédonienne', description: 'Des bandes armées grecques et bulgares mènent une guérilla à travers la Macédoine ottomane pour le contrôle de la population de la région, tandis que les deux nations se disputent son identité nationale dans le déclin ottoman.' }
  },
  't-balkan-wars': {
    es: { title: 'Las Guerras de los Balcanes', description: 'Grecia, Bulgaria, Serbia y Montenegro derrotan al Imperio Otomano, luego se enfrentan entre ellos por el botín. Macedonia queda particionada, trazando las fronteras modernas de los Balcanes occidentales.' },
    ru: { title: 'Балканские войны', description: 'Греция, Болгария, Сербия и Черногория побеждают Османскую империю, затем воюют между собой за добычу. Македония разделена, образуя современные границы западных Балкан.' },
    mk: { title: 'Балканските војни', description: 'Грција, Бугарија, Србија и Црна Гора ја поразиле Отоманската империја, потоа се бореле меѓу себе за пленот. Македонија е поделена, одредувајќи ги современите граници на Западен Балкан.' },
    de: { title: 'Die Balkankriege', description: 'Griechenland, Bulgarien, Serbien und Montenegro besiegen das Osmanische Reich und kämpfen dann untereinander um die Beute. Makedonien wird aufgeteilt und legt Grenzen fest, die den heutigen westlichen Balkan bestimmen.' },
    fr: { title: 'Les guerres balkaniques', description: 'La Grèce, la Bulgarie, la Serbie et le Monténégro défont l’Empire ottoman, puis se combattent pour le butin. La Macédoine est partagée, fixant des frontières qui définissent les Balkans occidentaux modernes.' }
  },
  't-phoenician-alphabet': {
    es: { title: 'El Alfabeto Fenicio se Difunde', description: 'Los comerciantes fenicios perfeccionan un alfabeto de 22 letras — antepasado del griego, del latín y de la mayoría de las escrituras modernas — y lo llevan a cada puerto del Mediterráneo.' },
    ru: { title: 'Распространение финикийского алфавита', description: 'Финикийские торговцы совершенствуют алфавит из 22 букв — предок греческого, латинского и большинства современных письменностей — и разносят его по всем портам Средиземноморья.' },
    mk: { title: 'Феникиската Азбука се Шири', description: 'Феникиските трговци усовршуваат азбука од 22 букви — предок на грчкото, латинското и повеќето модерни писма — и ја носат во секое средоземно пристаниште.' },
    de: { title: 'Das phönizische Alphabet verbreitet sich', description: 'Phönizische Händler vervollkommnen ein Alphabet aus 22 Buchstaben — den Vorfahren der griechischen, lateinischen und der meisten modernen Schriften — und tragen es in jeden Hafen des Mittelmeers.' },
    fr: { title: 'Diffusion de l’alphabet phénicien', description: 'Les marchands phéniciens perfectionnent un alphabet de 22 lettres — l’ancêtre du grec, du latin et de la plupart des écritures modernes — et le portent dans tous les ports de la Méditerranée.' }
  },
  't-carthage-founded': {
    es: { title: 'Fundación de Cartago', description: 'Colonos fenicios de Tiro fundan Cartago en el norte de África — el imperio comercial que un día desafiará a la propia Roma.' },
    ru: { title: 'Основание Карфагена', description: 'Финикийские колонисты из Тира основывают Карфаген в Северной Африке — торговую империю, которая однажды бросит вызов самому Риму.' },
    mk: { title: 'Основање на Картагина', description: 'Феникиски колонисти од Тир ја основаат Картагина во Северна Африка — трговската империја што еден ден ќе ѝ се спротивстави на самиот Рим.' },
    de: { title: 'Die Gründung Karthagos', description: 'Phönizische Kolonisten aus Tyros gründen Karthago in Nordafrika — das Handelsimperium, das eines Tages Rom selbst herausfordern wird.' },
    fr: { title: 'La fondation de Carthage', description: 'Des colons phéniciens venus de Tyr fondent Carthage en Afrique du Nord — l’empire commercial qui défiera un jour Rome elle-même.' }
  },
  't-chaeronea': {
    es: { title: 'Filipo II Vence en Queronea', description: 'Filipo II de Macedonia derrota a las ciudades-estado griegas aliadas en Queronea, unificando Grecia bajo el liderazgo macedonio — el trampolín para las conquistas de su hijo Alejandro.' },
    ru: { title: 'Филипп II побеждает при Херонее', description: 'Филипп II Македонский разбивает союзные греческие полисы при Херонее, объединяя Грецию под македонским началом — трамплин для завоеваний его сына Александра.' },
    mk: { title: 'Филип II Победува кај Херонеја', description: 'Филип II Македонски ги поразува сојузничките грчки градови-држави кај Херонеја, обединувајќи ја Грција под македонско водство — отскочна даска за освојувањата на неговиот син Александар.' },
    de: { title: 'Philipp II. siegt bei Chaironeia', description: 'Philipp II. von Makedonien besiegt die verbündeten griechischen Stadtstaaten bei Chaironeia und einigt Griechenland unter makedonischer Führung — das Sprungbrett für die Eroberungen seines Sohnes Alexander.' },
    fr: { title: 'Philippe II vainc à Chéronée', description: 'Philippe II de Macédoine défait les cités grecques alliées à Chéronée, unifiant la Grèce sous la direction macédonienne — le tremplin des conquêtes de son fils Alexandre.' }
  },
  't-gaugamela': {
    es: { title: 'Batalla de Gaugamela', description: 'Alejandro Magno destroza el ejército persa de Darío III en Gaugamela — la victoria decisiva que le entrega el mayor imperio que el mundo había visto.' },
    ru: { title: 'Битва при Гавгамелах', description: 'Александр Великий сокрушает персидское войско Дария III при Гавгамелах — решающая победа, вручившая ему величайшую империю, какую видел мир.' },
    mk: { title: 'Битката кај Гавгамела', description: 'Александар Велики ја разбива персиската војска на Дариј III кај Гавгамела — одлучувачката победа што му ја предава најголемата империја што светот ја видел.' },
    de: { title: 'Die Schlacht von Gaugamela', description: 'Alexander der Große zerschlägt bei Gaugamela das persische Heer Dareios’ III. — der entscheidende Sieg, der ihm das größte Reich der bisherigen Weltgeschichte in die Hand gibt.' },
    fr: { title: 'La bataille de Gaugamèles', description: 'Alexandre le Grand fracasse l’armée perse de Darius III à Gaugamèles — la victoire décisive qui lui livre le plus vaste empire que le monde eût connu.' }
  },
  't-lindisfarne': {
    es: { title: 'Ataque Vikingo a Lindisfarne', description: 'Los saqueadores nórdicos arrasan el monasterio insular de Lindisfarne frente a la costa inglesa — el impacto que tradicionalmente abre la Era Vikinga.' },
    ru: { title: 'Набег викингов на Линдисфарн', description: 'Норманнские налётчики разоряют островной монастырь Линдисфарн у английского побережья — потрясение, с которого традиционно начинается эпоха викингов.' },
    mk: { title: 'Викиншки Напад на Линдисфарн', description: 'Нордиските напаѓачи го ограбуваат островскиот манастир Линдисфарн крај англискиот брег — шокот со кој традиционално започнува Викиншката ера.' },
    de: { title: 'Der Wikingerüberfall auf Lindisfarne', description: 'Nordische Räuber plündern das Inselkloster Lindisfarne vor der englischen Küste — der Schock, der herkömmlich das Wikingerzeitalter eröffnet.' },
    fr: { title: 'Le raid viking sur Lindisfarne', description: 'Des pillards nordiques mettent à sac le monastère insulaire de Lindisfarne au large de la côte anglaise — le choc qui ouvre traditionnellement l’âge viking.' }
  },
  't-vinland': {
    es: { title: 'Leif Erikson Llega a Vinlandia', description: 'El explorador nórdico Leif Erikson desembarca en Terranova — los primeros europeos en llegar a América del Norte, cinco siglos antes que Colón.' },
    ru: { title: 'Лейф Эрикссон достигает Винланда', description: 'Норманнский мореплаватель Лейф Эрикссон высаживается на Ньюфаундленде — первые европейцы в Северной Америке, за пять веков до Колумба.' },
    mk: { title: 'Лејф Ериксон Стигнува до Винланд', description: 'Нордискиот истражувач Лејф Ериксон се истоварува на Њуфаундленд — првите Европејци што стигнале до Северна Америка, пет века пред Колумбо.' },
    de: { title: 'Leif Eriksson erreicht Vinland', description: 'Der nordische Entdecker Leif Eriksson landet in Neufundland — die ersten Europäer in Nordamerika, fünf Jahrhunderte vor Kolumbus.' },
    fr: { title: 'Leif Erikson atteint le Vinland', description: 'L’explorateur nordique Leif Erikson débarque à Terre-Neuve — les premiers Européens à atteindre l’Amérique du Nord, cinq siècles avant Colomb.' }
  },
  't-kamakura': {
    es: { title: 'Fundación del Sogunato Kamakura', description: 'Minamoto no Yoritomo se convierte en el primer sogún de Japón, abriendo siete siglos de gobierno samurái en los que los guerreros, no los emperadores, ejercen el poder real.' },
    ru: { title: 'Основание сёгуната Камакура', description: 'Минамото-но Ёритомо становится первым сёгуном Японии, открывая семь веков самурайского правления, когда реальная власть принадлежит воинам, а не императорам.' },
    mk: { title: 'Основање на Камакура Шогунатот', description: 'Минамото но Јоритомо станува првиот шогун на Јапонија, отворајќи седум века самурајско владеење во кое вистинската моќ ја држат воините, а не императорите.' },
    de: { title: 'Gründung des Kamakura-Shogunats', description: 'Minamoto no Yoritomo wird Japans erster Shogun und eröffnet sieben Jahrhunderte der Samurai-Herrschaft, in denen Krieger und nicht Kaiser die wirkliche Macht innehaben.' },
    fr: { title: 'Fondation du shogunat de Kamakura', description: 'Minamoto no Yoritomo devient le premier shogun du Japon, ouvrant sept siècles de gouvernement des samouraïs où les guerriers, et non les empereurs, détiennent le pouvoir réel.' }
  },
  't-kamikaze': {
    es: { title: 'Fracasan las Invasiones Mongolas de Japón', description: 'Los tifones — los "kamikaze" o vientos divinos — destrozan las flotas de invasión de Kublai Kan, preservando la independencia japonesa y entrando en la leyenda samurái.' },
    ru: { title: 'Провал монгольских вторжений в Японию', description: 'Тайфуны — «камикадзе», божественные ветры — уничтожают флоты вторжения Хубилая, сохраняя независимость Японии и входя в самурайские легенды.' },
    mk: { title: 'Монголските Инвазии на Јапонија Пропаѓаат', description: 'Тајфуните — „камикази" или божествени ветрови — ги уништуваат инвазиските флоти на Кублај Кан, зачувувајќи ја јапонската независност и влегувајќи во самурајската легенда.' },
    de: { title: 'Die Mongoleninvasionen Japans scheitern', description: 'Taifune — der „Kamikaze“ oder göttliche Wind — zerstören die Invasionsflotten Kublai Khans, bewahren Japans Unabhängigkeit und gehen in die Legende der Samurai ein.' },
    fr: { title: 'Les invasions mongoles du Japon échouent', description: 'Des typhons — le « kamikaze » ou vent divin — anéantissent les flottes d’invasion de Kubilai Khan, préservant l’indépendance du Japon et entrant dans la légende des samouraïs.' }
  },
  't-marco-polo': {
    es: { title: 'Marco Polo Parte hacia China', description: 'El mercader veneciano Marco Polo parte hacia la corte de Kublai Kan por la Ruta de la Seda asegurada por los mongoles — su relato encenderá la imaginación europea durante siglos.' },
    ru: { title: 'Марко Поло отправляется в Китай', description: 'Венецианский купец Марко Поло отправляется ко двору Хубилая по охраняемому монголами Шёлковому пути — его рассказ будет будоражить воображение европейцев столетиями.' },
    mk: { title: 'Марко Поло Тргнува кон Кина', description: 'Венецијанскиот трговец Марко Поло тргнува кон дворот на Кублај Кан по Патот на свилата обезбеден од Монголите — неговиот запис ќе ја разгорува европската фантазија со векови.' },
    de: { title: 'Marco Polo bricht nach China auf', description: 'Der venezianische Kaufmann Marco Polo reist entlang der von den Mongolen gesicherten Seidenstraße zum Hof Kublai Khans — sein Bericht wird die europäische Fantasie über Jahrhunderte beflügeln.' },
    fr: { title: 'Marco Polo part pour la Chine', description: 'Le marchand vénitien Marco Polo part pour la cour de Kubilai Khan le long de la route de la soie sécurisée par les Mongols — son récit enflammera l’imagination européenne pendant des siècles.' }
  },
  't-hanseatic': {
    es: { title: 'Formalización de la Liga Hanseática', description: 'Las ciudades comerciales del norte de Alemania se unen en la Liga Hanseática, dominando el comercio báltico y mostrando el nuevo poder de los gremios mercantiles y las ciudades autónomas.' },
    ru: { title: 'Оформление Ганзейского союза', description: 'Торговые города Северной Германии объединяются в Ганзейский союз, господствуя в балтийской торговле и демонстрируя новую силу купеческих гильдий и вольных городов.' },
    mk: { title: 'Формализирање на Ханзеатската Лига', description: 'Северногерманските трговски градови се обврзуваат во Ханзеатската лига, доминирајќи во балтичката трговија и покажувајќи ја новата моќ на трговските еснафи и повластените градови.' },
    de: { title: 'Gründung der Hanse', description: 'Norddeutsche Handelsstädte schließen sich zur Hanse zusammen, beherrschen den Ostseehandel und zeigen die neue Macht der Kaufmannsgilden und der Städte mit Stadtrecht.' },
    fr: { title: 'Formalisation de la Ligue hanséatique', description: 'Des villes marchandes d’Allemagne du Nord s’unissent en la Ligue hanséatique, dominant le commerce de la Baltique et révélant le pouvoir nouveau des guildes marchandes et des villes à charte.' }
  },
  't-first-slave-voyage': {
    es: { title: 'Comienza la Trata Transatlántica de Esclavos', description: 'El primer barco negrero navega directamente de África a las Américas. Durante los siguientes 350 años, 12,5 millones de africanos serán forzados a cruzar el Pasaje del Medio.' },
    ru: { title: 'Начало трансатлантической работорговли', description: 'Первый невольничий корабль идёт напрямую из Африки в Америку. За следующие 350 лет 12,5 миллиона африканцев будут насильно перевезены через Средний путь.' },
    mk: { title: 'Започнува Трансатлантската Трговија со Робови', description: 'Првиот робовски брод плови директно од Африка кон Америка. Во следните 350 години, 12,5 милиони Африканци ќе бидат присилно пренесени преку Средниот премин.' },
    de: { title: 'Beginn des transatlantischen Sklavenhandels', description: 'Das erste Sklavenschiff segelt unmittelbar von Afrika nach Amerika. In den folgenden 350 Jahren werden 12,5 Millionen Afrikaner zur Überfahrt über die „Middle Passage“ gezwungen.' },
    fr: { title: 'Début de la traite atlantique', description: 'Le premier navire négrier fait voile directement de l’Afrique vers les Amériques. Au cours des 350 années suivantes, 12,5 millions d’Africains seront contraints à traverser le passage du milieu.' }
  },
  't-asiento': {
    es: { title: 'Gran Bretaña Gana el Asiento', description: 'El Tratado de Utrecht otorga a Gran Bretaña el asiento — el contrato para transportar africanos esclavizados a la América española — industrializando el comercio triangular.' },
    ru: { title: 'Британия получает асьенто', description: 'Утрехтский договор передаёт Британии асьенто — контракт на поставку порабощённых африканцев в испанскую Америку — ставя треугольную торговлю на промышленные рельсы.' },
    mk: { title: 'Британија го Добива Асиентото', description: 'Договорот од Утрехт ѝ го доделува на Британија асиентото — договорот за превоз на поробени Африканци во шпанска Америка — индустријализирајќи ја триаголната трговија.' },
    de: { title: 'Britannien erhält das Asiento', description: 'Der Friede von Utrecht gewährt Britannien das Asiento — den Vertrag zur Verschiffung versklavter Afrikaner nach Spanisch-Amerika — und industrialisiert den Dreieckshandel.' },
    fr: { title: 'La Grande-Bretagne obtient l’asiento', description: 'Le traité d’Utrecht accorde à la Grande-Bretagne l’asiento — le contrat de transport d’Africains réduits en esclavage vers l’Amérique espagnole —, industrialisant le commerce triangulaire.' }
  },
  't-suleiman': {
    es: { title: 'Coronación de Solimán el Magnífico', description: 'Solimán I asciende al trono otomano, iniciando un reinado de 46 años de reforma legal, esplendor arquitectónico y expansión que lleva al imperio a su cenit.' },
    ru: { title: 'Воцарение Сулеймана Великолепного', description: 'Сулейман I занимает османский трон, начиная 46-летнее правление — правовые реформы, архитектурное великолепие и экспансия приводят империю к зениту.' },
    mk: { title: 'Крунисување на Сулејман Величествениот', description: 'Сулејман I го зазема отоманскиот престол, започнувајќи 46-годишно владеење на правни реформи, архитектонски сјај и експанзија што ја носи империјата до нејзиниот зенит.' },
    de: { title: 'Krönung Süleymans des Prächtigen', description: 'Süleyman I. besteigt den osmanischen Thron und beginnt eine 46-jährige Herrschaft der Rechtsreform, architektonischen Pracht und Expansion, die das Reich auf seinen Höhepunkt führt.' },
    fr: { title: 'Couronnement de Soliman le Magnifique', description: 'Soliman Ier monte sur le trône ottoman, entamant un règne de 46 ans de réforme juridique, de splendeur architecturale et d’expansion qui porte l’empire à son apogée.' }
  },
  't-vienna-siege': {
    es: { title: 'Primer Sitio Otomano de Viena', description: 'El ejército de Solimán llega a las puertas de Viena — el punto culminante de la expansión otomana en Europa central.' },
    ru: { title: 'Первая осада Вены османами', description: 'Армия Сулеймана подходит к воротам Вены — высшая точка османской экспансии в Центральную Европу.' },
    mk: { title: 'Првата Отоманска Опсада на Виена', description: 'Војската на Сулејман стигнува до портите на Виена — врвната точка на отоманската експанзија во Централна Европа.' },
    de: { title: 'Erste osmanische Belagerung Wiens', description: 'Süleymans Heer erreicht die Tore Wiens — der Höhepunkt der osmanischen Expansion nach Mitteleuropa.' },
    fr: { title: 'Premier siège ottoman de Vienne', description: 'L’armée de Soliman atteint les portes de Vienne — le point culminant de l’expansion ottomane en Europe centrale.' }
  },
  't-versailles-court': {
    es: { title: 'Luis XIV Traslada la Corte a Versalles', description: 'El Rey Sol traslada su corte al palacio de Versalles, convirtiendo el ritual y el esplendor en instrumentos del poder real absoluto.' },
    ru: { title: 'Людовик XIV переносит двор в Версаль', description: 'Король-Солнце переносит свой двор в Версальский дворец, превращая ритуал и роскошь в инструменты абсолютной королевской власти.' },
    mk: { title: 'Луј XIV го Преселува Дворот во Версај', description: 'Кралот Сонце го преселува својот двор во палатата Версај, претворајќи ги ритуалот и сјајот во инструменти на апсолутната кралска моќ.' },
    de: { title: 'Ludwig XIV. verlegt den Hof nach Versailles', description: 'Der Sonnenkönig verlegt seinen Hof in das Schloss Versailles und macht Rituale und Prunk zu Werkzeugen absoluter königlicher Macht.' },
    fr: { title: 'Louis XIV installe la cour à Versailles', description: 'Le Roi-Soleil transfère sa cour au château de Versailles, faisant du rituel et du faste des instruments du pouvoir royal absolu.' }
  },
  't-berlin-conference': {
    es: { title: 'La Conferencia de Berlín Divide África', description: 'Las potencias europeas se reparten África en colonias en la Conferencia de Berlín — sin un solo representante africano presente. El Reparto de África se acelera.' },
    ru: { title: 'Берлинская конференция делит Африку', description: 'Европейские державы делят Африку на колонии на Берлинской конференции — без единого африканского представителя. «Драка за Африку» ускоряется.' },
    mk: { title: 'Берлинската Конференција ја Дели Африка', description: 'Европските сили ја делат Африка на колонии на Берлинската конференција — без ниту еден африкански претставник. Грабежот за Африка се забрзува.' },
    de: { title: 'Die Berliner Konferenz teilt Afrika auf', description: 'Auf der Berliner Konferenz zerteilen die europäischen Mächte Afrika in Kolonien — ohne einen einzigen afrikanischen Vertreter. Der „Wettlauf um Afrika“ beschleunigt sich.' },
    fr: { title: 'La conférence de Berlin partage l’Afrique', description: 'À la conférence de Berlin, les puissances européennes découpent l’Afrique en colonies — sans un seul représentant africain présent. La ruée vers l’Afrique s’accélère.' }
  },
  't-adwa': {
    es: { title: 'Batalla de Adua', description: 'Etiopía aplasta al ejército italiano invasor en Adua — la mayor victoria africana sobre una potencia colonial, preservando la independencia etíope.' },
    ru: { title: 'Битва при Адуа', description: 'Эфиопия сокрушает вторгшуюся итальянскую армию при Адуа — величайшая победа африканцев над колониальной державой, сохранившая независимость Эфиопии.' },
    mk: { title: 'Битката кај Адва', description: 'Етиопија ја разбива италијанската освојувачка војска кај Адва — најголемата африканска победа над колонијална сила, зачувувајќи ја етиопската независност.' },
    de: { title: 'Die Schlacht von Adwa', description: 'Äthiopien zerschmettert bei Adwa das eindringende italienische Heer — der größte afrikanische Sieg über eine Kolonialmacht, der Äthiopiens Unabhängigkeit bewahrt.' },
    fr: { title: 'La bataille d’Adoua', description: 'L’Éthiopie écrase l’armée italienne envahissante à Adoua — la plus grande victoire africaine sur une puissance coloniale, préservant l’indépendance éthiopienne.' }
  },

  't-diadochi': {
    es: { title: "Muerte de Alejandro y guerras de los diádocos", description: "Alejandro Magno muere en Babilonia sin heredero. Sus generales — los diádocos — luchan durante cuarenta años, repartiendo el imperio en los reinos ptolemaico, seléucida y antigónida de la era helenística." },
    ru: { title: "Смерть Александра и войны диадохов", description: "Александр Великий умирает в Вавилоне без наследника. Его полководцы — диадохи — сорок лет воюют, деля империю на Птолемеевское, Селевкидское и Антигонидское царства эллинистической эпохи." },
    mk: { title: "Смртта на Александар и војните на дијадосите", description: "Александар Велики умира во Вавилон без наследник. Неговите генерали — дијадосите — војуваат четириесет години, делејќи ја империјата на Птолемејското, Селевкидското и Антигонидското кралство." },
    de: { title: 'Alexanders Tod und die Diadochenkriege', description: 'Alexander der Große stirbt in Babylon ohne Erben. Seine Feldherren — die Diadochen — kämpfen vierzig Jahre lang und zerteilen das Reich in die ptolemäischen, seleukidischen und antigonidischen Königreiche der hellenistischen Zeit.' },
    fr: { title: 'La mort d’Alexandre et les guerres des Diadoques', description: 'Alexandre le Grand meurt à Babylone sans héritier. Ses généraux — les Diadoques — se combattent pendant quarante ans, découpant l’empire en royaumes ptolémaïque, séleucide et antigonide de l’époque hellénistique.' }
  },
  't-library-alexandria': {
    es: { title: "La Biblioteca de Alejandría", description: "Ptolomeo I y II fundan el Museo y su gran Biblioteca, que aspira a reunir todos los libros del mundo — haciendo de Alejandría la capital científica de la antigüedad." },
    ru: { title: "Александрийская библиотека", description: "Птолемей I и II основывают Мусейон и великую Библиотеку, стремящуюся собрать все книги мира, — Александрия становится научной столицей древности." },
    mk: { title: "Библиотеката во Александрија", description: "Птолемеј I и II ги основаат Мусеионот и големата Библиотека, која се стреми да ја собере секоја книга на светот — правејќи ја Александрија научна престолнина на антиката." },
    de: { title: 'Die Bibliothek von Alexandria', description: 'Ptolemaios I. und II. gründen das Museion und seine große Bibliothek, die jedes Buch der Welt sammeln will — und machen Alexandria zur wissenschaftlichen Hauptstadt der Antike.' },
    fr: { title: 'La Bibliothèque d’Alexandrie', description: 'Ptolémée Ier et II fondent le Mouseîon et sa grande Bibliothèque, qui vise à rassembler tous les livres du monde — faisant d’Alexandrie la capitale scientifique de l’Antiquité.' }
  },
  't-persepolis': {
    es: { title: "Darío I comienza Persépolis", description: "Darío el Grande funda Persépolis, la capital ceremonial del Imperio aqueménida, y organiza el reino en satrapías unidas por el Camino Real de 2.700 km." },
    ru: { title: "Дарий I закладывает Персеполь", description: "Дарий Великий основывает Персеполь, церемониальную столицу державы Ахеменидов, и делит царство на сатрапии, связанные Царской дорогой длиной 2 700 км." },
    mk: { title: "Дариј I го започнува Персеполис", description: "Дариј Велики го основа Персеполис, церемонијалната престолнина на Ахаеменидската империја, и го организира царството во сатрапии поврзани со Кралскиот пат од 2.700 км." },
    de: { title: 'Dareios I. beginnt Persepolis', description: 'Dareios der Große gründet Persepolis, die zeremonielle Hauptstadt des Achämenidenreichs, und gliedert das Reich in Satrapien, die durch die 2.700 km lange Königsstraße verbunden sind.' },
    fr: { title: 'Darius Ier commence Persépolis', description: 'Darius le Grand fonde Persépolis, la capitale cérémonielle de l’Empire achéménide, et organise le royaume en satrapies reliées par la Route royale de 2 700 km.' }
  },
  't-tariq-iberia': {
    es: { title: "Conquista musulmana de Iberia", description: "Tariq ibn Ziyad cruza el estrecho por Gibraltar y destruye el reino visigodo en Guadalete. En una década, casi toda la península se convierte en al-Ándalus." },
    ru: { title: "Мусульманское завоевание Иберии", description: "Тарик ибн Зияд переправляется через пролив у Гибралтара и сокрушает вестготское королевство при Гвадалете. За десятилетие почти весь полуостров становится аль-Андалусом." },
    mk: { title: "Муслиманско освојување на Иберија", description: "Тарик ибн Зијад го преминува теснецот кај Гибралтар и го уништува визиготското кралство кај Гвадалете. За една деценија речиси целиот полуостров станува ал-Андалуз." },
    de: { title: 'Die muslimische Eroberung Iberiens', description: 'Tariq ibn Ziyad überquert die Meerenge bei Gibraltar und vernichtet das westgotische Königreich bei Guadalete. Binnen eines Jahrzehnts wird der Großteil der Halbinsel zu al-Andalus.' },
    fr: { title: 'La conquête musulmane de l’Ibérie', description: 'Tariq ibn Ziyad franchit le détroit à Gibraltar et détruit le royaume wisigoth à Guadalete. En une décennie, la majeure partie de la péninsule devient al-Andalus.' }
  },
  't-cordoba-caliphate': {
    es: { title: "Proclamación del Califato de Córdoba", description: "Abd al-Rahman III se proclama califa. Córdoba se convierte en una de las ciudades más grandes y cultas de Europa — bibliotecas, calles iluminadas y una cultura de convivencia." },
    ru: { title: "Провозглашение Кордовского халифата", description: "Абд ар-Рахман III провозглашает себя халифом. Кордова становится одним из крупнейших и учёнейших городов Европы — библиотеки, освещённые улицы и культура сосуществования." },
    mk: { title: "Прогласен Кордопскиот калифат", description: "Абд ал-Рахман III се прогласува за калиф. Кордоба станува еден од најголемите и најучени градови во Европа — библиотеки, осветлени улици и култура на соживот." },
    de: { title: 'Ausrufung des Kalifats von Córdoba', description: 'Abd ar-Rahman III. ruft sich zum Kalifen aus. Córdoba wird zu einer der größten und gelehrtesten Städte Europas — mit Bibliotheken, beleuchteten Straßen und einer Kultur des Zusammenlebens.' },
    fr: { title: 'Proclamation du califat de Cordoue', description: 'Abd al-Rahman III se proclame calife. Cordoue devient l’une des plus grandes et des plus savantes villes d’Europe — bibliothèques, rues éclairées et culture de coexistence.' }
  },
  't-granada-1492': {
    es: { title: "Caída de Granada", description: "El último estado musulmán de Iberia se rinde a Fernando e Isabel, poniendo fin a la Reconquista de siglos el mismo año en que Colón zarpa hacia el oeste." },
    ru: { title: "Падение Гранады", description: "Последнее мусульманское государство Иберии сдаётся Фердинанду и Изабелле, завершая многовековую Реконкисту в тот самый год, когда Колумб отплывает на запад." },
    mk: { title: "Падот на Гранада", description: "Последната муслиманска држава во Иберија им се предава на Фердинанд и Изабела, завршувајќи ја вековната Реконкиста истата година кога Колумбо плови на запад." },
    de: { title: 'Der Fall Granadas', description: 'Der letzte muslimische Staat in Iberien ergibt sich Ferdinand und Isabella und beendet die jahrhundertelange Reconquista im selben Jahr, in dem Kolumbus nach Westen segelt.' },
    fr: { title: 'La chute de Grenade', description: 'Le dernier État musulman d’Ibérie se rend à Ferdinand et Isabelle, mettant fin à la Reconquista longue de siècles l’année même où Colomb cingle vers l’ouest.' }
  },
  't-crecy': {
    es: { title: "Batalla de Crécy", description: "Los arqueros ingleses aniquilan a la caballería francesa en Crécy — el arma de un campesino derrota a la aristocracia acorazada, y la guerra de los Cien Años entra en la leyenda." },
    ru: { title: "Битва при Креси", description: "Английские лучники уничтожают французское рыцарство при Креси — оружие крестьянина побеждает закованную в латы аристократию, и Столетняя война входит в легенду." },
    mk: { title: "Битката кај Креси", description: "Англиските стрелци ја уништуваат француската коњаница кај Креси — оружјето на селанецот ја победува оклопената аристократија, а Стогодишната војна влегува во легенда." },
    de: { title: 'Die Schlacht von Crécy', description: 'Englische Langbogenschützen vernichten bei Crécy die französische Ritterschaft — die Waffe des Bauern besiegt den gepanzerten Adel, und der Hundertjährige Krieg wird zur Legende.' },
    fr: { title: 'La bataille de Crécy', description: 'Les archers anglais anéantissent la chevalerie française à Crécy — l’arme du paysan défait l’aristocratie en armure, et la guerre de Cent Ans entre dans la légende.' }
  },
  't-joan-arc': {
    es: { title: "Juana de Arco libera Orleans", description: "Una campesina visionaria de diecisiete años levanta el asedio de Orleans en nueve días y conduce a Carlos VII a su coronación en Reims, cambiando el curso de la guerra de los Cien Años." },
    ru: { title: "Жанна д'Арк освобождает Орлеан", description: "Семнадцатилетняя крестьянка-визионерка за девять дней снимает осаду Орлеана и ведёт Карла VII на коронацию в Реймс, переломив ход Столетней войны." },
    mk: { title: "Јована Орлеанска го ослободува Орлеан", description: "Седумнаесетгодишна селанка-визионерка ја крева опсадата на Орлеан за девет дена и го води Шарл VII на крунисување во Ремс, свртувајќи го текот на Стогодишната војна." },
    de: { title: 'Jeanne d’Arc entsetzt Orléans', description: 'Eine siebzehnjährige bäuerliche Visionärin bricht in neun Tagen die Belagerung von Orléans und führt Karl VII. zur Krönung nach Reims — eine Wende im Hundertjährigen Krieg.' },
    fr: { title: 'Jeanne d’Arc délivre Orléans', description: 'Une paysanne visionnaire de dix-sept ans lève le siège d’Orléans en neuf jours et mène Charles VII à son sacre à Reims, renversant le cours de la guerre de Cent Ans.' }
  },
  't-panipat': {
    es: { title: "Babur funda el Imperio mogol", description: "En la primera batalla de Panipat, la artillería de campaña de Babur derrota a los elefantes de guerra del sultanato de Delhi, fundando la dinastía mogol que gobernará la India durante tres siglos." },
    ru: { title: "Бабур основывает империю Моголов", description: "В первой битве при Панипате полевая артиллерия Бабура побеждает боевых слонов Делийского султаната, основывая династию Моголов, которая будет править Индией три века." },
    mk: { title: "Бабур ја основа Могулската империја", description: "Во првата битка кај Панипат, артилеријата на Бабур ги победува воените слонови на Делхискиот султанат, основајќи ја могулската династија што ќе владее со Индија три века." },
    de: { title: 'Babur gründet das Mogulreich', description: 'In der Ersten Schlacht bei Panipat besiegt Baburs Feldartillerie die Kriegselefanten des Sultanats von Delhi und begründet die Mogul-Dynastie, die Indien drei Jahrhunderte lang beherrschen wird.' },
    fr: { title: 'Babur fonde l’Empire moghol', description: 'À la première bataille de Panipat, l’artillerie de campagne de Babur défait les éléphants de guerre du sultanat de Delhi, fondant la dynastie moghole qui régnera sur l’Inde durant trois siècles.' }
  },
  't-taj-mahal': {
    es: { title: "Comienza la construcción del Taj Mahal", description: "Shah Jahan ordena a 20.000 artesanos levantar una tumba de mármol blanco para su esposa Mumtaz Mahal — el monumento supremo de la era de esplendor de la India mogol." },
    ru: { title: "Начало строительства Тадж-Махала", description: "Шах-Джахан велит 20 000 мастеров возвести беломраморную гробницу для жены Мумтаз-Махал — вершину века великолепия могольской Индии." },
    mk: { title: "Почнува изградбата на Таџ Махал", description: "Шах Џахан наредува 20.000 занаетчии да подигнат гробница од бел мермер за неговата сопруга Мумтаз Махал — врвниот споменик на могулската ера на сјај." },
    de: { title: 'Baubeginn des Taj Mahal', description: 'Shah Jahan lässt von 20.000 Handwerkern ein Grabmal aus weißem Marmor für seine Frau Mumtaz Mahal errichten — das höchste Denkmal aus dem Prachtzeitalter des Mogul-Indiens.' },
    fr: { title: 'Début de la construction du Taj Mahal', description: 'Shah Jahan ordonne à 20 000 artisans d’élever un tombeau de marbre blanc pour son épouse Mumtaz Mahal — le monument suprême de l’âge de splendeur de l’Inde moghole.' }
  },
  't-sekigahara': {
    es: { title: "Batalla de Sekigahara", description: "Tokugawa Ieyasu destruye a sus rivales en un solo día, poniendo fin a las guerras civiles Sengoku y abriendo 265 años de gobierno Tokugawa desde Edo." },
    ru: { title: "Битва при Сэкигахаре", description: "Токугава Иэясу за один день сокрушает соперников, завершая гражданские войны Сэнгоку и открывая 265 лет правления Токугава из Эдо." },
    mk: { title: "Битката кај Секигахара", description: "Токугава Иejасу ги уништува своите ривали за еден ден, завршувајќи ги граѓанските војни Сенгоку и отворајќи 265 години Токугава владеење од Едо." },
    de: { title: 'Die Schlacht von Sekigahara', description: 'Tokugawa Ieyasu vernichtet seine Rivalen an einem einzigen Tag, beendet die Sengoku-Bürgerkriege und eröffnet 265 Jahre Tokugawa-Herrschaft von Edo aus.' },
    fr: { title: 'La bataille de Sekigahara', description: 'Tokugawa Ieyasu anéantit ses rivaux en une seule journée, mettant fin aux guerres civiles de Sengoku et ouvrant 265 ans de gouvernement Tokugawa depuis Edo.' }
  },
  't-sakoku': {
    es: { title: "Japón cierra sus puertas (sakoku)", description: "El shogunato Tokugawa sella Japón: ningún japonés puede salir, casi ningún extranjero puede entrar, y solo un puesto holandés en Dejima mantiene una ventana filtrada a Occidente." },
    ru: { title: "Япония закрывает двери (сакоку)", description: "Сёгунат Токугава запечатывает Японию: японцам нельзя уезжать, иностранцам почти нельзя въезжать, и лишь голландская фактория на Дэдзиме остаётся фильтрованным окном на Запад." },
    mk: { title: "Јапонија ги затвора вратите (сакоку)", description: "Токугава шогунатот ја запечатува Јапонија: ниту еден Јапонец не смее да замине, речиси ниту еден странец да влезе, а само холандскиот пункт на Деџима останува филтриран прозорец кон Западот." },
    de: { title: 'Japan schließt seine Tore (Sakoku)', description: 'Das Tokugawa-Shogunat schottet Japan ab: kein Japaner darf das Land verlassen, kaum ein Ausländer darf einreisen, und nur ein niederländischer Handelsposten auf Dejima hält ein gefiltertes Fenster zum Westen offen.' },
    fr: { title: 'Le Japon ferme ses portes (sakoku)', description: 'Le shogunat Tokugawa isole le Japon : aucun Japonais ne peut partir, presque aucun étranger ne peut entrer, et seul un comptoir néerlandais à Dejima garde une fenêtre filtrée sur l’Occident.' }
  },
  't-october-revolution': {
    es: { title: "Las revoluciones rusas", description: "Los disturbios del pan derrocan al zar en febrero; en octubre los bolcheviques de Lenin asaltan el Palacio de Invierno. Nace el primer estado socialista del mundo — y sigue la guerra civil." },
    ru: { title: "Русские революции", description: "Хлебные бунты в феврале свергают царя; в октябре большевики Ленина берут Зимний дворец. Рождается первое социалистическое государство мира — за ним следует Гражданская война." },
    mk: { title: "Руските револуции", description: "Бунтовите за леб го соборуваат царот во февруари; во октомври болшевиците на Ленин го заземаат Зимскиот дворец. Се раѓа првата социјалистичка држава — и следи граѓанска војна." },
    de: { title: 'Die Russischen Revolutionen', description: 'Brotunruhen stürzen im Februar den Zaren; im Oktober stürmen Lenins Bolschewiki den Winterpalast. Der erste sozialistische Staat der Welt entsteht — und ein Bürgerkrieg folgt.' },
    fr: { title: 'Les révolutions russes', description: 'Des émeutes du pain renversent le tsar en février ; en octobre, les bolcheviks de Lénine prennent d’assaut le palais d’Hiver. Le premier État socialiste du monde naît — et la guerre civile suit.' }
  },
  't-ussr-founded': {
    es: { title: "Fundación de la URSS", description: "Victoriosos en la guerra civil, los bolcheviques proclaman la Unión de Repúblicas Socialistas Soviéticas — el estado que se industrializará a un costo terrible y moldeará el siglo XX." },
    ru: { title: "Образование СССР", description: "Победив в Гражданской войне, большевики провозглашают Союз Советских Социалистических Республик — государство, которое проведёт индустриализацию страшной ценой и сформирует двадцатый век." },
    mk: { title: "Основање на СССР", description: "Победници во граѓанската војна, болшевиците го прогласуваат Сојузот на Советските Социјалистички Републики — државата што ќе се индустријализира по страшна цена и ќе го обликува XX век." },
    de: { title: 'Die Gründung der UdSSR', description: 'Siegreich im Bürgerkrieg rufen die Bolschewiki die Union der Sozialistischen Sowjetrepubliken aus — den Staat, der sich um einen schrecklichen Preis industrialisieren und das 20. Jahrhundert prägen wird.' },
    fr: { title: 'La fondation de l’URSS', description: 'Victorieux de la guerre civile, les bolcheviks proclament l’Union des républiques socialistes soviétiques — l’État qui s’industrialisera à un coût terrible et façonnera le XXe siècle.' }
  },
  't-salt-march': {
    es: { title: "La Marcha de la Sal de Gandhi", description: "Gandhi camina 380 km hasta el mar en Dandi y recoge un puñado de sal, convirtiendo un impuesto colonial en una acusación moral contra el imperio, observada por el mundo entero." },
    ru: { title: "Соляной поход Ганди", description: "Ганди проходит 380 км к морю у Данди и поднимает горсть соли, превращая колониальный налог в моральное обвинение империи на глазах у всего мира." },
    mk: { title: "Маршот на солта на Ганди", description: "Ганди пешачи 380 км до морето кај Данди и крева грст сол, претворајќи колонијален данок во морално обвинение против империјата, гледано од целиот свет." },
    de: { title: 'Gandhis Salzmarsch', description: 'Gandhi marschiert 380 km zum Meer nach Dandi und hebt eine Handvoll Salz auf und verwandelt eine Kolonialsteuer in eine moralische Anklage des Empires, die die ganze Welt verfolgt.' },
    fr: { title: 'La marche du sel de Gandhi', description: 'Gandhi parcourt 380 km jusqu’à la mer à Dandi et ramasse une poignée de sel, transformant une taxe coloniale en une accusation morale de l’empire que le monde entier observe.' }
  },
  't-partition-1947': {
    es: { title: "Independencia y Partición de la India", description: "La India británica se libera a medianoche del 15 de agosto de 1947 — dividida en India y Pakistán. Unos 14 millones de personas cruzan la Línea Radcliffe en la mayor migración de la historia." },
    ru: { title: "Независимость и Раздел Индии", description: "Британская Индия обретает свободу в полночь 15 августа 1947 года — разделённая на Индию и Пакистан. Около 14 миллионов человек пересекают линию Рэдклиффа в крупнейшей миграции в истории." },
    mk: { title: "Независност и Поделба на Индија", description: "Британска Индија станува слободна на полноќ на 15 август 1947 — поделена на Индија и Пакистан. Околу 14 милиони луѓе ја преминуваат Радклифовата линија во најголемата миграција во историјата." },
    de: { title: 'Unabhängigkeit und Teilung Indiens', description: 'Britisch-Indien wird um Mitternacht des 15. August 1947 frei — geteilt in Indien und Pakistan. Rund 14 Millionen Menschen überqueren die Radcliffe-Linie in der größten Migration der Geschichte.' },
    fr: { title: 'Indépendance et partition de l’Inde', description: 'L’Inde britannique devient libre à minuit le 15 août 1947 — divisée entre l’Inde et le Pakistan. Quelque 14 millions de personnes franchissent la ligne Radcliffe dans la plus grande migration de l’histoire.' }
  },

  // ── Prehistoric Ages ──────────────────────────────────────────────
  't-pre-hominin': {
    es: { title: "Los Primeros Homínidos", description: "En las sabanas que se secan de África, un linaje de simios (como Sahelanthropus) empieza a separarse de los ancestros de los chimpancés y a dar los primeros pasos hacia la marcha erguida." },
    ru: { title: "Первые гоминины", description: "На высыхающих саваннах Африки линия обезьян (таких как сахелантроп) начинает отделяться от предков шимпанзе и делает первые шаги к прямохождению." },
    mk: { title: "Првите хоминини", description: "На сушните савани на Африка, една лоза мајмуни (како Sahelanthropus) почнува да се одделува од предците на шимпанзата и да ги прави првите чекори кон исправено одење." },
    de: { title: "Die ersten Homininen", description: "Auf den austrocknenden Savannen Afrikas beginnt sich eine Affenlinie (wie Sahelanthropus) von den Vorfahren der Schimpansen zu trennen und die ersten Schritte zum aufrechten Gang zu tun." },
    fr: { title: "Les premiers hominidés", description: "Dans les savanes desséchées d'Afrique, une lignée de singes (comme Sahélanthrope) commence à se séparer des ancêtres des chimpanzés et à faire les premiers pas vers la marche debout." },
  },
  't-lucy': {
    es: { title: "\"Lucy\" Camina Erguida", description: "Australopithecus afarensis — la famosa \"Lucy\" — camina plenamente erguida por África oriental. Las huellas de Laetoli preservan su paseo por la ceniza volcánica." },
    ru: { title: "«Люси» ходит прямо", description: "Australopithecus afarensis — знаменитая «Люси» — ходит полностью прямо по Восточной Африке. Следы в Лаэтоли сохраняют их прогулку по вулканическому пеплу." },
    mk: { title: "„Луси“ оди исправено", description: "Australopithecus afarensis — славната „Луси“ — оди целосно исправено низ источна Африка. Отпечатоците од Лаетоли ја зачувуваат нивната прошетка по вулкански пепел." },
    de: { title: "„Lucy“ geht aufrecht", description: "Australopithecus afarensis — die berühmte „Lucy“ — geht völlig aufrecht durch Ostafrika. Die Fußspuren von Laetoli bewahren ihren Gang über vulkanische Asche." },
    fr: { title: "« Lucy » marche debout", description: "Australopithecus afarensis — la célèbre « Lucy » — marche pleinement debout à travers l'Afrique de l'Est. Les empreintes de Laetoli conservent leur promenade sur la cendre volcanique." },
  },
  't-first-tools': {
    es: { title: "Las Primeras Herramientas de Piedra", description: "Homínidos en Etiopía golpean piedra contra piedra para hacer el instrumental olduvayense — la tecnología más antigua de la Tierra, usada para descuartizar carne y partir hueso." },
    ru: { title: "Первые каменные орудия", description: "Гоминины в Эфиопии бьют камнем о камень, создавая олдувайский набор — древнейшую технологию на Земле, чтобы разделывать мясо и раскалывать кость." },
    mk: { title: "Првите камени алатки", description: "Хоминини во Етиопија удираат камен од камен за да го направат олдувајскиот прибор — најстарата технологија на Земјата, користена за сечење месо и кршење коска." },
    de: { title: "Die ersten Steinwerkzeuge", description: "Homininen in Äthiopien schlagen Stein gegen Stein, um das Oldowan-Werkzeug herzustellen — die älteste Technik der Erde, um Fleisch zu zerlegen und Knochen zu brechen." },
    fr: { title: "Les premiers outils de pierre", description: "Des hominidés en Éthiopie frappent pierre contre pierre pour fabriquer l'outillage oldowayen — la plus ancienne technologie de la Terre, servant à dépecer la viande et briser l'os." },
  },
  't-erectus': {
    es: { title: "Homo erectus Sale de África", description: "El primer ancestro de aspecto verdaderamente humano, Homo erectus, se extiende desde África por toda Asia — la primera gran migración humana." },
    ru: { title: "Homo erectus покидает Африку", description: "Первый по-настоящему человекоподобный предок, Homo erectus, расселяется из Африки по всей Азии — первая великая миграция человека." },
    mk: { title: "Homo erectus ја напушта Африка", description: "Првиот навистина човеколик предок, Homo erectus, се шири од Африка низ цела Азија — првата голема човечка преселба." },
    de: { title: "Homo erectus verlässt Afrika", description: "Der erste wahrhaft menschenähnliche Vorfahr, Homo erectus, breitet sich aus Afrika über ganz Asien aus — die erste große Wanderung des Menschen." },
    fr: { title: "Homo erectus quitte l'Afrique", description: "Le premier ancêtre à l'aspect véritablement humain, Homo erectus, se répand depuis l'Afrique à travers toute l'Asie — la première grande migration humaine." },
  },
  't-fire': {
    es: { title: "El Dominio del Fuego", description: "Los homínidos logran el uso controlado del fuego — para el calor, la seguridad y la cocción, que pudo alimentar el crecimiento del cerebro humano." },
    ru: { title: "Покорение огня", description: "Гоминины обретают управляемое использование огня — для тепла, безопасности и приготовления пищи, что могло дать толчок росту человеческого мозга." },
    mk: { title: "Совладувањето на огнот", description: "Хоминините постигнуваат контролирана употреба на огнот — за топлина, безбедност и готвење, што можеби го поттикнало растот на човечкиот мозок." },
    de: { title: "Die Beherrschung des Feuers", description: "Homininen erlangen den kontrollierten Gebrauch des Feuers — für Wärme, Sicherheit und das Kochen, das das Wachstum des menschlichen Gehirns angetrieben haben könnte." },
    fr: { title: "La maîtrise du feu", description: "Les hominidés parviennent à l'usage maîtrisé du feu — pour la chaleur, la sécurité et la cuisson, qui a pu alimenter la croissance du cerveau humain." },
  },
  't-neanderthal': {
    es: { title: "Los Neandertales", description: "Homo neanderthalensis, soberbiamente adaptado a la Europa glacial, caza caza mayor, cuida a sus enfermos y entierra a sus muertos — un modo distinto, plenamente humano, de ser." },
    ru: { title: "Неандертальцы", description: "Homo neanderthalensis, превосходно приспособленный к ледниковой Европе, охотится на крупную дичь, заботится о больных и хоронит мёртвых — иной, вполне человеческий способ бытия." },
    mk: { title: "Неандерталците", description: "Homo neanderthalensis, извонредно прилагоден на ледничка Европа, лови крупен дивеч, се грижи за болните и ги погребува мртвите — поинаков, целосно човечки начин на постоење." },
    de: { title: "Die Neandertaler", description: "Homo neanderthalensis, hervorragend an das eiszeitliche Europa angepasst, jagt Großwild, pflegt seine Kranken und bestattet seine Toten — eine andere, ganz und gar menschliche Art zu sein." },
    fr: { title: "Les Néandertaliens", description: "Homo neanderthalensis, superbement adapté à l'Europe glaciaire, chasse le gros gibier, soigne ses malades et enterre ses morts — une autre manière, pleinement humaine, d'être." },
  },
  't-sapiens-origin': {
    es: { title: "Homo sapiens Surge en África", description: "Nuestra propia especie aparece por toda África; sus fósiles más antiguos se hallaron en Jebel Irhoud, en Marruecos." },
    ru: { title: "Homo sapiens возникает в Африке", description: "Наш собственный вид появляется по всей Африке; его древнейшие ископаемые найдены в Джебель-Ирхуде в Марокко." },
    mk: { title: "Homo sapiens се појавува во Африка", description: "Нашиот вид се појавува низ цела Африка; неговите најстари фосили се пронајдени во Џебел Ирхуд во Мароко." },
    de: { title: "Homo sapiens entsteht in Afrika", description: "Unsere eigene Art erscheint über ganz Afrika; ihre ältesten Fossilien wurden in Jebel Irhoud in Marokko gefunden." },
    fr: { title: "Homo sapiens apparaît en Afrique", description: "Notre propre espèce apparaît à travers toute l'Afrique ; ses plus anciens fossiles ont été trouvés à Jebel Irhoud, au Maroc." },
  },
  't-sapiens-migration': {
    es: { title: "El Gran Viaje Humano", description: "Bandas de Homo sapiens cruzan fuera de África y, en decenas de miles de años, pueblan casi todos los entornos habitables de la Tierra." },
    ru: { title: "Великое путешествие человека", description: "Группы Homo sapiens выходят из Африки и за десятки тысяч лет заселяют почти все обитаемые среды Земли." },
    mk: { title: "Големото човечко патување", description: "Групи Homo sapiens излегуваат од Африка и, за десетици илјади години, ги населуваат речиси сите населиви средини на Земјата." },
    de: { title: "Die große Reise des Menschen", description: "Gruppen von Homo sapiens ziehen aus Afrika hinaus und besiedeln in zehntausenden Jahren nahezu jeden bewohnbaren Lebensraum der Erde." },
    fr: { title: "Le grand voyage humain", description: "Des bandes d'Homo sapiens sortent d'Afrique et, en des dizaines de milliers d'années, peuplent presque tous les milieux habitables de la Terre." },
  },
  't-upper-paleolithic': {
    es: { title: "El Gran Salto Adelante", description: "Una explosión de herramientas de hoja, adornos e innovación marca la llegada de la mente humana plenamente moderna — inquieta, simbólica e inventiva." },
    ru: { title: "Великий скачок вперёд", description: "Взрыв пластинчатых орудий, украшений и новшеств знаменует приход вполне современного человеческого ума — беспокойного, символического и изобретательного." },
    mk: { title: "Големиот скок напред", description: "Експлозија на сечивни алатки, украси и иновации го означува доаѓањето на целосно модерниот човечки ум — немирен, симболичен и инвентивен." },
    de: { title: "Der große Sprung nach vorn", description: "Eine Explosion von Klingenwerkzeugen, Schmuck und Innovation markiert die Ankunft des vollständig modernen menschlichen Geistes — ruhelos, symbolisch und erfinderisch." },
    fr: { title: "Le grand bond en avant", description: "Une explosion d'outils sur lame, de parures et d'innovation marque l'arrivée de l'esprit humain pleinement moderne — inquiet, symbolique et inventif." },
  },
  't-cave-art': {
    es: { title: "El Nacimiento del Arte", description: "La pintura figurativa más antigua conocida — un jabalí verrugoso en Indonesia — es seguida por las grandes cuevas pintadas de Chauvet y Lascaux: el amanecer de la mente simbólica." },
    ru: { title: "Рождение искусства", description: "За древнейшей известной фигуративной росписью — бородавчатой свиньёй в Индонезии — следуют великие расписные пещеры Шове и Ласко: рассвет символического ума." },
    mk: { title: "Раѓањето на уметноста", description: "По најстарата позната фигуративна слика — брадавичесто прасе во Индонезија — следуваат големите насликани пештери Шове и Ласко: зората на симболичкиот ум." },
    de: { title: "Die Geburt der Kunst", description: "Auf die älteste bekannte figürliche Malerei — ein Warzenschwein in Indonesien — folgen die großen bemalten Höhlen von Chauvet und Lascaux: die Morgenröte des symbolischen Geistes." },
    fr: { title: "La naissance de l'art", description: "La plus ancienne peinture figurative connue — un cochon verruqueux en Indonésie — est suivie des grandes grottes peintes de Chauvet et Lascaux : l'aube de l'esprit symbolique." },
  },
  't-americas': {
    es: { title: "La Colonización de las Américas", description: "Cazadores cruzan el puente de tierra de Beringia desde Siberia hasta Alaska y barren, en unos pocos miles de años, hasta el extremo sur de Sudamérica." },
    ru: { title: "Заселение Америк", description: "Охотники переходят по перешейку Берингии из Сибири на Аляску и за несколько тысяч лет достигают южной оконечности Южной Америки." },
    mk: { title: "Населувањето на Америките", description: "Ловци го преминуваат копнениот мост Берингија од Сибир до Алјаска и за неколку илјади години стигнуваат до јужниот врв на Јужна Америка." },
    de: { title: "Die Besiedlung der Amerikas", description: "Jäger überqueren die Landbrücke Beringia von Sibirien nach Alaska und fegen in wenigen tausend Jahren bis zur Südspitze Südamerikas." },
    fr: { title: "Le peuplement des Amériques", description: "Des chasseurs traversent le pont terrestre de Béringie de la Sibérie à l'Alaska et déferlent, en quelques milliers d'années, jusqu'à la pointe sud de l'Amérique du Sud." },
  },
  't-venus': {
    es: { title: "Figuras de Venus y Arte Glacial", description: "Por toda la Europa glacial, la gente talla pequeñas figuras de \"Venus\" y toca flautas de hueso — prueba de creencia compartida, adorno y música." },
    ru: { title: "Фигурки Венеры и искусство ледникового периода", description: "По всей ледниковой Европе люди вырезают малые фигурки «Венеры» и играют на костяных флейтах — свидетельство общей веры, украшения и музыки." },
    mk: { title: "Фигурки на Венера и ледничка уметност", description: "Низ ледничка Европа, луѓето резат мали фигурки на „Венера“ и свират на коскени флејти — доказ за споделено верување, украс и музика." },
    de: { title: "Venusfiguren und eiszeitliche Kunst", description: "Über das eiszeitliche Europa schnitzen Menschen kleine „Venus“-Figuren und spielen Knochenflöten — Beleg für geteilten Glauben, Schmuck und Musik." },
    fr: { title: "Figurines de Vénus et art glaciaire", description: "À travers l'Europe glaciaire, les gens sculptent de petites figurines de « Vénus » et jouent de flûtes en os — preuve de croyance partagée, de parure et de musique." },
  },
  't-ice-age': {
    es: { title: "El Último Máximo Glacial", description: "Los mantos de hielo alcanzan su mayor extensión. Los mares en descenso dejan al descubierto puentes de tierra, y los cazadores de mamuts prosperan en la estepa helada." },
    ru: { title: "Последний ледниковый максимум", description: "Ледниковые щиты достигают наибольшего протяжения. Отступающие моря обнажают перешейки, и охотники на мамонтов процветают в мёрзлой степи." },
    mk: { title: "Последниот леднички максимум", description: "Ледените плочи ја достигнуваат својата најголема протегливост. Опаѓачките мориња откриваат копнени мостови, и ловците на мамути напредуваат на смрзнатата степа." },
    de: { title: "Das letzte glaziale Maximum", description: "Die Eisschilde erreichen ihre größte Ausdehnung. Sinkende Meere legen Landbrücken frei, und Mammutjäger gedeihen auf der gefrorenen Steppe." },
    fr: { title: "Le dernier maximum glaciaire", description: "Les calottes glaciaires atteignent leur plus grande étendue. Les mers en baisse dégagent des ponts terrestres, et les chasseurs de mammouths prospèrent sur la steppe gelée." },
  },
  't-megafauna': {
    es: { title: "Se Esfuman los Gigantes de la Glaciación", description: "A medida que el hielo retrocede y los cazadores humanos se extienden, mamuts, rinocerontes lanudos y otra megafauna se extinguen en gran parte del mundo." },
    ru: { title: "Исчезают гиганты ледникового периода", description: "По мере отступления льда и расселения охотников-людей мамонты, шерстистые носороги и другая мегафауна вымирают на большей части мира." },
    mk: { title: "Исчезнуваат џиновите на глацијацијата", description: "Како што мразот отстапува и човечките ловци се шират, мамутите, волнестите носорози и друга мегафауна изумираат во голем дел од светот." },
    de: { title: "Die Riesen der Eiszeit verschwinden", description: "Während das Eis zurückweicht und menschliche Jäger sich ausbreiten, sterben Mammuts, Wollnashörner und andere Megafauna in weiten Teilen der Welt aus." },
    fr: { title: "Les géants de la glaciation disparaissent", description: "À mesure que la glace recule et que les chasseurs humains se répandent, mammouths, rhinocéros laineux et autre mégafaune s'éteignent dans une grande partie du monde." },
  },
  't-gobekli': {
    es: { title: "Göbekli Tepe", description: "Cazadores-recolectores en Turquía levantan la arquitectura monumental más antigua de la Tierra — macizos pilares de piedra tallada — miles de años antes de la agricultura o la escritura." },
    ru: { title: "Гёбекли-Тепе", description: "Охотники-собиратели в Турции возводят древнейшую монументальную архитектуру на Земле — массивные резные каменные столбы — за тысячи лет до земледелия и письменности." },
    mk: { title: "Гебекли Тепе", description: "Ловци-собирачи во Турција ја креваат најстарата монументална архитектура на Земјата — масивни изрежани камени столбови — илјадници години пред земјоделството или писмото." },
    de: { title: "Göbekli Tepe", description: "Jäger und Sammler in der Türkei errichten die älteste monumentale Architektur der Erde — massive behauene Steinpfeiler — tausende Jahre vor Landwirtschaft oder Schrift." },
    fr: { title: "Göbekli Tepe", description: "Des chasseurs-cueilleurs en Turquie dressent la plus ancienne architecture monumentale de la Terre — de massifs piliers de pierre sculptée — des milliers d'années avant l'agriculture ou l'écriture." },
  },
  't-neolithic': {
    es: { title: "La Revolución Neolítica", description: "En el Creciente Fértil, la gente empieza a plantar trigo y cebada y a criar ovejas y cabras — la invención de la agricultura que rehará el mundo humano." },
    ru: { title: "Неолитическая революция", description: "На Плодородном полумесяце люди начинают сажать пшеницу и ячмень и разводить овец и коз — изобретение земледелия, что переделает человеческий мир." },
    mk: { title: "Неолитската револуција", description: "Во Плодородниот Полумесец, луѓето почнуваат да садат пченица и јачмен и да одгледуваат овци и кози — изумот на земјоделството што ќе го преобрази човечкиот свет." },
    de: { title: "Die Neolithische Revolution", description: "Im Fruchtbaren Halbmond beginnen Menschen, Weizen und Gerste zu pflanzen und Schafe und Ziegen zu halten — die Erfindung der Landwirtschaft, die die Menschenwelt neu gestalten sollte." },
    fr: { title: "La révolution néolithique", description: "Au Croissant fertile, les gens commencent à planter blé et orge et à élever moutons et chèvres — l'invention de l'agriculture qui allait refaire le monde humain." },
  },
  't-domestication': {
    es: { title: "Plantas y Animales Domesticados", description: "La agricultura surge de forma independiente por todo el mundo — arroz y mijo en China, maíz en México, papas en los Andes — mientras humanos y cultivos se remodelan mutuamente." },
    ru: { title: "Одомашнивание растений и животных", description: "Земледелие возникает независимо по всему миру — рис и просо в Китае, кукуруза в Мексике, картофель в Андах — по мере того как люди и их посевы переформируют друг друга." },
    mk: { title: "Припитомени растенија и животни", description: "Земјоделството се појавува независно низ целиот свет — ориз и просо во Кина, пченкар во Мексико, компири во Андите — додека луѓето и посевите се преобликуваат меѓусебно." },
    de: { title: "Pflanzen und Tiere domestiziert", description: "Die Landwirtschaft entsteht unabhängig über die ganze Welt — Reis und Hirse in China, Mais in Mexiko, Kartoffeln in den Anden — während Menschen und ihre Feldfrüchte einander umformen." },
    fr: { title: "Plantes et animaux domestiqués", description: "L'agriculture surgit indépendamment à travers le monde — riz et millet en Chine, maïs au Mexique, pommes de terre dans les Andes — tandis qu'humains et cultures se remodèlent mutuellement." },
  },
  't-catalhoyuk': {
    es: { title: "Çatalhöyük, la Ciudad sin Calles", description: "Una de las primeras protociudades del mundo alberga a miles en un panal de casas de adobe a las que se entra por el techo — un mundo asentado sin reyes." },
    ru: { title: "Чатал-Хёюк, город без улиц", description: "Один из первых протогородов мира вмещает тысячи людей в сотах глинобитных домов, в которые входят через крышу, — осёдлый мир без царей." },
    mk: { title: "Чаталхујук, градот без улици", description: "Еден од првите протоградови во светот сместува илјадници во саќе од куќи од кал во кои се влегува преку кровот — населен свет без кралеви." },
    de: { title: "Çatalhöyük, die Stadt ohne Straßen", description: "Eine der ersten Protostädte der Welt beherbergt Tausende in einer Wabe von Lehmziegelhäusern, die durchs Dach betreten werden — eine sesshafte Welt ohne Könige." },
    fr: { title: "Çatalhöyük, la ville sans rues", description: "L'une des premières proto-villes du monde abrite des milliers de gens dans un nid d'abeilles de maisons de brique crue où l'on entre par le toit — un monde sédentaire sans rois." },
  },
  't-stonehenge': {
    es: { title: "Se Alza Stonehenge", description: "Agricultores neolíticos en la llanura de Salisbury empiezan a construir y reconstruir Stonehenge, alineando piedras colosales con el sol del solsticio — el umbral de la historia registrada." },
    ru: { title: "Возведён Стоунхендж", description: "Неолитические земледельцы на Солсберийской равнине начинают строить и перестраивать Стоунхендж, выравнивая колоссальные камни на солнце солнцестояния — порог записанной истории." },
    mk: { title: "Се крева Стоунхенџ", description: "Неолитски земјоделци на Рамнината Солсбери почнуваат да го градат и преградуваат Стоунхенџ, порамнувајќи колосални камења со сонцето на солстицијот — прагот на запишаната историја." },
    de: { title: "Stonehenge wird errichtet", description: "Neolithische Bauern in der Ebene von Salisbury beginnen, Stonehenge zu errichten und umzubauen und kolossale Steine auf die Sonnenwendsonne auszurichten — die Schwelle der aufgezeichneten Geschichte." },
    fr: { title: "Stonehenge est dressé", description: "Des agriculteurs néolithiques de la plaine de Salisbury commencent à bâtir et rebâtir Stonehenge, alignant des pierres colossales sur le soleil du solstice — le seuil de l'histoire consignée." },
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
