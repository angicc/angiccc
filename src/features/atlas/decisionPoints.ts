// ─── Decision points ──────────────────────────────────────────────────────────
// A short pause inside a lesson where the reader chooses before learning what
// actually happened, and the map shows both.
//
// Deliberately NOT a branching narrative. Crisis Room already does multi-turn
// scenarios with consequences that compound; this is one question in the middle
// of a paragraph, answered in five seconds, whose whole job is to make the
// reader commit to a position before the text tells them the answer. Committing
// first is what makes the answer stick.
//
// Anchored to a lesson and a section index, so a point appears exactly where
// the text has set it up and not before.

import type { Language } from '@/i18n/translations';

type Loc = Partial<Record<Language, string>> & { en: string };

export interface DecisionOption {
  id: string;
  label: Loc;
  /** What the map should show if the reader picks this - a topic id, or null. */
  outcome: Loc;
}

export interface DecisionPoint {
  id: string;
  lessonId: string;
  /** Appears after this section index (0-based) of the lesson body. */
  afterSection: number;
  question: Loc;
  options: DecisionOption[];
  /** The option id history actually took. */
  historical: string;
  /** Why it went that way, shown once the reader has committed. */
  verdict: Loc;
}

export const DECISION_POINTS: DecisionPoint[] = [
  {
    id: 'dp-charlemagne-succession',
    lessonId: 'medieval-10',
    afterSection: 2,
    question: {
      en: 'Charlemagne rules an empire no one has held together since Rome. He has three sons. What does he do with it?',
      es: 'Carlomagno gobierna un imperio que nadie ha mantenido unido desde Roma. Tiene tres hijos. ¿Qué hace con él?',
      ru: 'Карл Великий правит империей, какой никто не удерживал со времён Рима. У него три сына. Что он с ней сделает?',
      mk: 'Карло Велики владее со империја каква никој не задржал од Рим наваму. Има тројца синови. Што ќе стори со неа?',
      de: 'Karl der Große herrscht über ein Reich, das seit Rom niemand zusammengehalten hat. Er hat drei Söhne. Was macht er damit?',
      fr: "Charlemagne règne sur un empire que nul n'a tenu depuis Rome. Il a trois fils. Qu'en fait-il ?",
    },
    options: [
      {
        id: 'divide',
        label: { en: 'Divide it between all three sons', es: 'Dividirlo entre los tres hijos', ru: 'Разделить между тремя сыновьями', mk: 'Да ја подели меѓу тројцата синови', de: 'Unter allen drei Söhnen aufteilen', fr: 'Le partager entre les trois fils' },
        outcome: { en: 'Three weaker realms, each defensible alone and none able to act as Rome did.', es: 'Tres reinos más débiles, cada uno defendible por separado y ninguno capaz de actuar como Roma.', ru: 'Три более слабых королевства, каждое защитимо в одиночку, но ни одно не способно действовать как Рим.', mk: 'Три послаби кралства, секое одбранливо само, но ниедно способно да дејствува како Рим.', de: 'Drei schwächere Reiche, jedes für sich zu verteidigen, keines fähig zu handeln wie Rom.', fr: 'Trois royaumes plus faibles, défendables isolément, aucun capable d\'agir comme Rome.' },
      },
      {
        id: 'eldest',
        label: { en: 'Give it whole to the eldest', es: 'Dárselo entero al mayor', ru: 'Отдать целиком старшему', mk: 'Да ѝ ја даде целата на најстариот', de: 'Ungeteilt dem Ältesten geben', fr: "Le donner entier à l'aîné" },
        outcome: { en: 'One empire intact, and two disinherited sons with armies.', es: 'Un imperio intacto y dos hijos desheredados con ejércitos.', ru: 'Империя цела - и два лишённых наследства сына с армиями.', mk: 'Империја недопрена, и двајца обесправени синови со војски.', de: 'Ein Reich intakt, dazu zwei enterbte Söhne mit Heeren.', fr: 'Un empire intact, et deux fils déshérités avec des armées.' },
      },
      {
        id: 'council',
        label: { en: 'Leave it to a council of nobles', es: 'Dejarlo a un consejo de nobles', ru: 'Оставить совету знати', mk: 'Да ја остави на совет од благородници', de: 'Einem Adelsrat überlassen', fr: 'Le laisser à un conseil de nobles' },
        outcome: { en: 'No single heir to fight, and no single authority either.', es: 'Ningún heredero por el que luchar, y ninguna autoridad única tampoco.', ru: 'Некому наследовать - но и единой власти тоже нет.', mk: 'Нема единствен наследник за кого да се борат, но ни единствена власт.', de: 'Kein einzelner Erbe, um den man kämpft - aber auch keine einzelne Autorität.', fr: "Aucun héritier unique pour lequel se battre, et aucune autorité unique non plus." },
      },
    ],
    historical: 'divide',
    verdict: {
      en: 'Frankish custom treated a realm as property to be split among sons, and Charlemagne planned exactly that. Chance intervened: two sons died before him and Louis the Pious inherited it whole. Louis then divided it among his own sons, and the Treaty of Verdun in 843 cut the empire into the three pieces that became France, Germany and the contested strip between them. The division you were asked about happened anyway, one generation late, and Europe has been arguing over that middle strip ever since.',
      es: 'La costumbre franca trataba un reino como propiedad divisible entre los hijos, y Carlomagno planeaba exactamente eso. El azar intervino: dos hijos murieron antes que él y Luis el Piadoso lo heredó entero. Luis lo dividió entre los suyos, y el Tratado de Verdún de 843 cortó el imperio en las tres piezas que serían Francia, Alemania y la franja disputada entre ambas. La división ocurrió igual, una generación más tarde, y Europa lleva discutiendo por esa franja desde entonces.',
      ru: 'Франкский обычай считал королевство имуществом, делимым между сыновьями, и Карл планировал именно это. Вмешался случай: двое сыновей умерли раньше него, и Людовик Благочестивый получил всё целиком. Затем Людовик разделил империю между своими сыновьями, и Верденский договор 843 года разрезал её на три части, ставшие Францией, Германией и спорной полосой между ними. Раздел всё равно произошёл - на поколение позже, и Европа спорит об этой полосе до сих пор.',
      mk: 'Франачкиот обичај го третирал кралството како имот што се дели меѓу синовите, и Карло планирал токму тоа. Се вмешала случајноста: двајца синови умреле пред него и Луј Побожниот ја наследил целата. Потоа Луј ја поделил меѓу своите синови, а Верденскиот договор од 843 година ја пресекол империјата на трите дела што станале Франција, Германија и спорната лента меѓу нив. Поделбата сепак се случила, една генерација подоцна, и Европа оттогаш се расправа за таа средна лента.',
      de: 'Fränkischer Brauch behandelte ein Reich als Besitz, den man unter Söhnen teilt, und genau das plante Karl. Der Zufall kam dazwischen: zwei Söhne starben vor ihm, und Ludwig der Fromme erbte alles. Ludwig teilte es dann unter seinen eigenen Söhnen, und der Vertrag von Verdun schnitt das Reich 843 in die drei Stücke, aus denen Frankreich, Deutschland und der umstrittene Streifen dazwischen wurden. Die Teilung kam ohnehin, eine Generation später, und über diesen Mittelstreifen streitet Europa bis heute.',
      fr: "La coutume franque traitait un royaume comme un bien à partager entre les fils, et c'est exactement ce que prévoyait Charlemagne. Le hasard s'en mêla : deux fils moururent avant lui et Louis le Pieux hérita du tout. Louis le partagea ensuite entre ses propres fils, et le traité de Verdun de 843 découpa l'empire en trois morceaux qui devinrent la France, l'Allemagne et la bande disputée entre les deux. Le partage eut lieu malgré tout, une génération plus tard, et l'Europe se dispute cette bande depuis.",
    },
  },
  {
    id: 'dp-napoleon-russia',
    lessonId: 'modern-10',
    afterSection: 3,
    question: {
      en: 'It is 1812. Britain will not make peace, and Russia has broken your trade blockade against it. What do you do?',
      es: 'Es 1812. Gran Bretaña no hará la paz y Rusia ha roto tu bloqueo comercial contra ella. ¿Qué haces?',
      ru: '1812 год. Британия не идёт на мир, а Россия нарушила вашу торговую блокаду против неё. Что вы предпримете?',
      mk: '1812 година е. Британија не сака мир, а Русија ја прекрши твојата трговска блокада против неа. Што правиш?',
      de: 'Es ist 1812. Britannien schließt keinen Frieden, und Russland hat deine Handelssperre gegen es gebrochen. Was tust du?',
      fr: "Nous sommes en 1812. La Grande-Bretagne refuse la paix, et la Russie a rompu votre blocus commercial contre elle. Que faites-vous ?",
    },
    options: [
      {
        id: 'invade',
        label: { en: 'Invade Russia and force it back into the blockade', es: 'Invadir Rusia y forzarla a volver al bloqueo', ru: 'Вторгнуться в Россию и вернуть её в блокаду', mk: 'Да ја нападнеш Русија и да ја вратиш во блокадата', de: 'Russland überfallen und in die Sperre zurückzwingen', fr: 'Envahir la Russie et la forcer à revenir au blocus' },
        outcome: { en: 'The largest army Europe has assembled marches east into a country with more space than it has supplies.', es: 'El mayor ejército reunido en Europa marcha al este hacia un país con más espacio que suministros tiene él.', ru: 'Крупнейшая армия, собранная Европой, идёт на восток в страну, где пространства больше, чем у неё припасов.', mk: 'Најголемата војска што Европа ја собрала маршира на исток во земја со повеќе простор отколку што таа има залихи.', de: 'Das größte Heer, das Europa aufgestellt hat, zieht nach Osten in ein Land mit mehr Raum als es Vorräte hat.', fr: "La plus grande armée jamais réunie en Europe marche vers l'est, dans un pays qui a plus d'espace qu'elle n'a de vivres." },
      },
      {
        id: 'accept',
        label: { en: 'Accept the leak and hold what you have', es: 'Aceptar la fuga y conservar lo que tienes', ru: 'Смириться с брешью и удержать имеющееся', mk: 'Да ја прифатиш пукнатината и да задржиш што имаш', de: 'Das Leck hinnehmen und halten, was du hast', fr: 'Accepter la brèche et garder ce que vous avez' },
        outcome: { en: 'The blockade leaks, but the Grande Armee stays west of the Niemen and intact.', es: 'El bloqueo tiene fugas, pero la Grande Armee permanece al oeste del Niemen e intacta.', ru: 'Блокада протекает, но Великая армия остаётся западнее Немана и невредимой.', mk: 'Блокадата протекува, но Големата армија останува западно од Неман и недопрена.', de: 'Die Sperre leckt, doch die Grande Armee bleibt westlich der Memel und intakt.', fr: 'Le blocus fuit, mais la Grande Armée reste à l\'ouest du Niémen, intacte.' },
      },
      {
        id: 'spain',
        label: { en: 'Finish the war in Spain first', es: 'Terminar primero la guerra en España', ru: 'Сначала закончить войну в Испании', mk: 'Прво да ја завршиш војната во Шпанија', de: 'Zuerst den Krieg in Spanien beenden', fr: "Finir d'abord la guerre en Espagne" },
        outcome: { en: 'One front closed before another opens - at the cost of leaving Russia unpunished.', es: 'Un frente cerrado antes de abrir otro, a costa de dejar a Rusia sin castigo.', ru: 'Один фронт закрыт прежде, чем открыт другой, - ценой безнаказанности России.', mk: 'Еден фронт затворен пред да се отвори друг - по цена на неказнета Русија.', de: 'Eine Front geschlossen, bevor eine zweite aufgeht - um den Preis, Russland ungestraft zu lassen.', fr: "Un front fermé avant d'en ouvrir un autre, au prix de laisser la Russie impunie." },
      },
    ],
    historical: 'invade',
    verdict: {
      en: 'He invaded, with around 600,000 men. The Russians refused the decisive battle he needed and burned what they retreated through, so the army marched 800 miles into an emptied country and reached a Moscow already on fire. Fewer than one in six came back. The campaign did not merely fail; it destroyed the instrument every one of his other victories had depended on, and within two years the coalition he had beaten four separate times was in Paris.',
      es: 'Invadió, con unos 600.000 hombres. Los rusos rehusaron la batalla decisiva que él necesitaba y quemaron aquello por lo que se retiraban, así que el ejército marchó 1.300 kilómetros por un país vaciado y llegó a un Moscú ya en llamas. Volvió menos de uno de cada seis. La campaña no solo fracasó: destruyó el instrumento del que dependían todas sus otras victorias, y en dos años la coalición a la que había batido cuatro veces estaba en París.',
      ru: 'Он вторгся - примерно с 600 000 человек. Русские уклонились от решающего сражения, которое ему было нужно, и жгли всё, через что отступали, так что армия прошла 1300 километров по опустошённой стране и вошла в уже горящую Москву. Вернулся меньше чем каждый шестой. Кампания не просто провалилась: она уничтожила тот инструмент, на котором держались все его прочие победы, и через два года коалиция, которую он бил четырежды, была в Париже.',
      mk: 'Нападна, со околу 600.000 луѓе. Русите ја одбија решавачката битка што му беше потребна и палеа сè низ што се повлекуваа, па војската маршираше 1.300 километри низ испразнета земја и стигна до веќе запалена Москва. Се вратија помалку од еден на шест. Походот не само што пропадна - го уништи инструментот од кој зависеа сите негови други победи, и за две години коалицијата што ја имаше победено четири пати беше во Париз.',
      de: 'Er fiel ein, mit rund 600.000 Mann. Die Russen verweigerten die Entscheidungsschlacht, die er brauchte, und brannten nieder, wovon sie sich zurückzogen; so marschierte das Heer 1.300 Kilometer durch ein leergeräumtes Land und erreichte ein bereits brennendes Moskau. Weniger als jeder Sechste kam zurück. Der Feldzug scheiterte nicht bloß - er zerstörte das Instrument, auf dem alle seine anderen Siege beruht hatten, und binnen zwei Jahren stand die Koalition, die er viermal geschlagen hatte, in Paris.',
      fr: "Il envahit, avec quelque 600 000 hommes. Les Russes refusèrent la bataille décisive dont il avait besoin et brûlèrent ce qu'ils abandonnaient ; l'armée marcha donc 1 300 kilomètres dans un pays vidé et atteignit un Moscou déjà en flammes. Moins d'un sur six revint. La campagne n'échoua pas seulement : elle détruisit l'instrument dont dépendaient toutes ses autres victoires, et en deux ans la coalition qu'il avait battue quatre fois était à Paris.",
    },
  },
  {
    id: 'dp-yugoslavia',
    lessonId: 'modern-06',
    afterSection: 1,
    question: {
      en: 'Yugoslavia is coming apart and its republics have populations that do not match its internal borders. On what principle should the new states be drawn?',
      es: 'Yugoslavia se desmorona y sus repúblicas tienen poblaciones que no coinciden con sus fronteras internas. ¿Con qué principio deben trazarse los nuevos estados?',
      ru: 'Югославия распадается, и население её республик не совпадает с внутренними границами. По какому принципу проводить границы новых государств?',
      mk: 'Југославија се распаѓа, а населението на нејзините републики не се совпаѓа со внатрешните граници. По кој принцип треба да се исцртаат новите држави?',
      de: 'Jugoslawien zerfällt, und die Bevölkerungen seiner Republiken decken sich nicht mit den inneren Grenzen. Nach welchem Grundsatz sollen die neuen Staaten gezogen werden?',
      fr: "La Yougoslavie se disloque et les populations de ses républiques ne correspondent pas à ses frontières internes. Sur quel principe tracer les nouveaux États ?",
    },
    options: [
      {
        id: 'republics',
        label: { en: 'Keep the existing republic borders exactly', es: 'Mantener exactamente las fronteras republicanas', ru: 'Сохранить существующие границы республик', mk: 'Да се задржат постојните републички граници', de: 'Die bestehenden Republikgrenzen genau beibehalten', fr: 'Conserver exactement les frontières des républiques' },
        outcome: { en: 'Every new state contains large minorities who did not choose it.', es: 'Cada nuevo estado contiene grandes minorías que no lo eligieron.', ru: 'В каждом новом государстве - крупные меньшинства, которые его не выбирали.', mk: 'Секоја нова држава содржи големи малцинства што не ја избрале.', de: 'Jeder neue Staat enthält große Minderheiten, die ihn nicht gewählt haben.', fr: "Chaque nouvel État contient de grandes minorités qui ne l'ont pas choisi." },
      },
      {
        id: 'ethnic',
        label: { en: 'Redraw them along ethnic lines', es: 'Redibujarlas según líneas étnicas', ru: 'Перекроить их по этническому признаку', mk: 'Да се прецртаат по етнички линии', de: 'Sie entlang ethnischer Linien neu ziehen', fr: 'Les redessiner selon des lignes ethniques' },
        outcome: { en: 'Cleaner-looking states, reachable only by moving people who will not move willingly.', es: 'Estados de aspecto más limpio, alcanzables solo moviendo a gente que no se moverá por voluntad propia.', ru: 'Более «чистые» государства, достижимые лишь перемещением людей, которые не уедут добровольно.', mk: 'Подредени држави на изглед, достапни само со преселување луѓе што нема да се преселат доброволно.', de: 'Sauberer wirkende Staaten, erreichbar nur, indem man Menschen bewegt, die nicht freiwillig gehen.', fr: "Des États plus nets en apparence, atteignables seulement en déplaçant des gens qui ne partiront pas de leur plein gré." },
      },
      {
        id: 'federation',
        label: { en: 'Hold a loose federation together', es: 'Mantener una federación laxa', ru: 'Удержать рыхлую федерацию', mk: 'Да се одржи лабава федерација', de: 'Eine lose Föderation zusammenhalten', fr: 'Maintenir une fédération lâche' },
        outcome: { en: 'No borders to fight over, if every republic can be persuaded to stay.', es: 'Ninguna frontera por la que pelear, si se convence a cada república de quedarse.', ru: 'Не за какие границы воевать - если удастся уговорить остаться каждую республику.', mk: 'Нема граници за кои да се војува, ако секоја република може да се убеди да остане.', de: 'Keine Grenzen, um die man kämpft - wenn sich jede Republik zum Bleiben bewegen lässt.', fr: "Aucune frontière pour laquelle se battre, si l'on persuade chaque république de rester." },
      },
    ],
    historical: 'republics',
    verdict: {
      en: 'The international community recognised the republic borders, which had been drawn as administrative lines inside one country and were never meant to be international ones. That decision was defensible and it was also the trigger: it left Serbs outside Serbia and Croats outside Croatia, and the wars that followed were fought to move the borders to the people or the people to the borders. The alternative principle was tried too, and it has a name - ethnic cleansing. This is a case where the least-bad option was still catastrophic, which is the honest shape of a lot of history.',
      es: 'La comunidad internacional reconoció las fronteras republicanas, trazadas como líneas administrativas dentro de un país y nunca pensadas como internacionales. Fue una decisión defendible y también el detonante: dejó serbios fuera de Serbia y croatas fuera de Croacia, y las guerras que siguieron se libraron para llevar las fronteras a la gente o la gente a las fronteras. El principio alternativo también se intentó, y tiene nombre: limpieza étnica. Es un caso donde la opción menos mala seguía siendo catastrófica, que es la forma honesta de buena parte de la historia.',
      ru: 'Международное сообщество признало границы республик - административные линии внутри одной страны, никогда не задумывавшиеся как межгосударственные. Решение было защитимым и одновременно спусковым крючком: сербы остались вне Сербии, хорваты - вне Хорватии, и последовавшие войны велись за то, чтобы придвинуть границы к людям или людей к границам. Альтернативный принцип тоже испробовали, и у него есть имя - этническая чистка. Это случай, когда наименее плохой вариант всё равно обернулся катастрофой, и в этом честная форма немалой части истории.',
      mk: 'Меѓународната заедница ги призна републичките граници - административни линии во рамките на една држава, никогаш замислени како меѓународни. Одлуката беше одбранлива и истовремено беше окидачот: остави Срби надвор од Србија и Хрвати надвор од Хрватска, а војните што следеа се водеа за да се придвижат границите кон луѓето или луѓето кон границите. Алтернативниот принцип исто така беше пробан, и има име - етничко чистење. Ова е случај каде најмалку лошата опција сепак беше катастрофална, што е чесната форма на голем дел од историјата.',
      de: 'Die internationale Gemeinschaft erkannte die Republikgrenzen an - Verwaltungslinien innerhalb eines Landes, nie als zwischenstaatliche gedacht. Die Entscheidung war vertretbar und zugleich der Auslöser: Serben blieben außerhalb Serbiens, Kroaten außerhalb Kroatiens, und die folgenden Kriege wurden geführt, um die Grenzen zu den Menschen oder die Menschen zu den Grenzen zu schieben. Das andere Prinzip wurde ebenfalls versucht, und es hat einen Namen: ethnische Säuberung. Ein Fall, in dem die am wenigsten schlechte Option dennoch katastrophal war - die ehrliche Form eines Großteils der Geschichte.',
      fr: "La communauté internationale reconnut les frontières des républiques, tracées comme des lignes administratives à l'intérieur d'un pays et jamais conçues comme internationales. La décision était défendable, et elle fut aussi le déclencheur : elle laissa des Serbes hors de Serbie et des Croates hors de Croatie, et les guerres qui suivirent furent menées pour amener les frontières aux gens ou les gens aux frontières. L'autre principe fut essayé aussi, et il porte un nom : le nettoyage ethnique. Un cas où l'option la moins mauvaise restait catastrophique, ce qui est la forme honnête d'une grande part de l'histoire.",
    },
  },
];

export function decisionPointFor(lessonId: string, sectionIndex: number): DecisionPoint | undefined {
  return DECISION_POINTS.find(d => d.lessonId === lessonId && d.afterSection === sectionIndex);
}

export function loc(entry: Loc, language: Language): string {
  return entry[language] ?? entry.en;
}
