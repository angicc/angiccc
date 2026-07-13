// ─── CHRONOS IMPERIUM · Strict Localization Contract ─────────────────────────
// Every player-facing string the engine can emit — crisis narratives, option
// labels, alerts, roster/unit/leader names, combat modifier labels — lives in
// this catalog, keyed by id and resolved through the active UI language.
// Engine payloads carry ONLY keys (+ interpolation params); components resolve
// at the render boundary. That is the contract that makes English leakage on
// client devices structurally impossible: there is no English in the payloads
// to leak. Missing entries resolve to English by fallback, never to a raw key.
import type { Language } from '@/i18n/translations';

type Entry = Partial<Record<Language, string>> & { en: string };

const CATALOG: Record<string, Entry> = {
  // ── Rosters ──
  imp_roster_roman: { en: 'Roman Legion', es: 'Legión romana', ru: 'Римский легион', mk: 'Римска легија', de: 'Römische Legion', fr: 'Légion romaine' },
  imp_roster_macedonian: { en: 'Macedonian Phalanx', es: 'Falange macedonia', ru: 'Македонская фаланга', mk: 'Македонска фаланга', de: 'Makedonische Phalanx', fr: 'Phalange macédonienne' },
  imp_roster_persian: { en: 'Persian Host', es: 'Hueste persa', ru: 'Персидское войско', mk: 'Персиска војска', de: 'Persisches Heer', fr: 'Ost perse' },
  imp_roster_byzantine: { en: 'Byzantine Thematic Army', es: 'Ejército temático bizantino', ru: 'Византийская фемная армия', mk: 'Византиска темска војска', de: 'Byzantinisches Themenheer', fr: 'Armée thématique byzantine' },
  imp_roster_frankish: { en: 'Frankish Host', es: 'Hueste franca', ru: 'Франкское войско', mk: 'Франачка војска', de: 'Fränkisches Heer', fr: 'Ost franc' },
  imp_roster_mongol: { en: 'Mongol Tumen', es: 'Tumen mongol', ru: 'Монгольский тумен', mk: 'Монголски тумен', de: 'Mongolisches Tumen', fr: 'Tumen mongol' },
  imp_roster_tercio: { en: 'Spanish Tercio', es: 'Tercio español', ru: 'Испанская терция', mk: 'Шпанско терцио', de: 'Spanischer Tercio', fr: 'Tercio espagnol' },
  imp_roster_ottoman: { en: 'Ottoman Kapıkulu', es: 'Kapıkulu otomano', ru: 'Османский капыкулу', mk: 'Отомански капикулу', de: 'Osmanische Kapıkulu', fr: 'Kapıkulu ottoman' },
  imp_roster_swedish: { en: 'Swedish Brigade', es: 'Brigada sueca', ru: 'Шведская бригада', mk: 'Шведска бригада', de: 'Schwedische Brigade', fr: 'Brigade suédoise' },
  imp_roster_napoleonic: { en: 'Napoleonic Corps', es: 'Cuerpo napoleónico', ru: 'Наполеоновский корпус', mk: 'Наполеонов корпус', de: 'Napoleonisches Korps', fr: 'Corps napoléonien' },
  imp_roster_greatwar: { en: 'Great War Division', es: 'División de la Gran Guerra', ru: 'Дивизия Великой войны', mk: 'Дивизија од Големата војна', de: 'Weltkriegsdivision', fr: 'Division de la Grande Guerre' },
  imp_roster_crusader: { en: 'Crusader Host', es: 'Hueste cruzada', ru: 'Крестоносное войско', mk: 'Крстоносна војска', de: 'Kreuzfahrerheer', fr: 'Ost croisé' },
  imp_roster_han: { en: 'Han Army', es: 'Ejército Han', ru: 'Ханьская армия', mk: 'Хан војска', de: 'Han-Armee', fr: 'Armée Han' },
  // ── Units ──
  imp_unit_legionary: { en: 'Legionaries', es: 'Legionarios', ru: 'Легионеры', mk: 'Легионери', de: 'Legionäre', fr: 'Légionnaires' },
  imp_unit_velites: { en: 'Velites', es: 'Vélites', ru: 'Велиты', mk: 'Велити', de: 'Veliten', fr: 'Vélites' },
  imp_unit_equites: { en: 'Equites', es: 'Équites', ru: 'Эквиты', mk: 'Еквити', de: 'Equites', fr: 'Équites' },
  imp_unit_phalangite: { en: 'Phalangites', es: 'Falangitas', ru: 'Фалангиты', mk: 'Фалангити', de: 'Phalangiten', fr: 'Phalangites' },
  imp_unit_peltast: { en: 'Peltasts', es: 'Peltastas', ru: 'Пельтасты', mk: 'Пелтасти', de: 'Peltasten', fr: 'Peltastes' },
  imp_unit_companion: { en: 'Companion Cavalry', es: 'Caballería de compañeros', ru: 'Гетайры', mk: 'Хетајри', de: 'Hetairoi', fr: 'Cavalerie des compagnons' },
  imp_unit_immortal: { en: 'Immortals', es: 'Inmortales', ru: 'Бессмертные', mk: 'Бесмртници', de: 'Unsterbliche', fr: 'Immortels' },
  imp_unit_persian_archer: { en: 'Persian Archers', es: 'Arqueros persas', ru: 'Персидские лучники', mk: 'Персиски стрелци', de: 'Persische Bogenschützen', fr: 'Archers perses' },
  imp_unit_scythed_chariot: { en: 'Scythed Chariots', es: 'Carros falcados', ru: 'Серпоносные колесницы', mk: 'Коли со српови', de: 'Sichelwagen', fr: 'Chars à faux' },
  imp_unit_skutatos: { en: 'Skutatoi', es: 'Skutatoi', ru: 'Скутаты', mk: 'Скутати', de: 'Skutatoi', fr: 'Skutatoi' },
  imp_unit_toxotai: { en: 'Toxotai', es: 'Toxotai', ru: 'Токсоты', mk: 'Токсоти', de: 'Toxotai', fr: 'Toxotai' },
  imp_unit_cataphract: { en: 'Cataphracts', es: 'Catafractos', ru: 'Катафракты', mk: 'Катафракти', de: 'Kataphrakten', fr: 'Cataphractes' },
  imp_unit_menatarms: { en: 'Men-at-Arms', es: 'Hombres de armas', ru: 'Латники', mk: 'Оклопници', de: 'Waffenknechte', fr: 'Hommes d\'armes' },
  imp_unit_crossbowman: { en: 'Crossbowmen', es: 'Ballesteros', ru: 'Арбалетчики', mk: 'Самострелци', de: 'Armbrustschützen', fr: 'Arbalétriers' },
  imp_unit_knight: { en: 'Knights', es: 'Caballeros', ru: 'Рыцари', mk: 'Витези', de: 'Ritter', fr: 'Chevaliers' },
  imp_unit_auxiliary_spear: { en: 'Auxiliary Spearmen', es: 'Lanceros auxiliares', ru: 'Вспомогательные копейщики', mk: 'Помошни копјаници', de: 'Hilfsspeerträger', fr: 'Lanciers auxiliaires' },
  imp_unit_horse_archer: { en: 'Horse Archers', es: 'Arqueros a caballo', ru: 'Конные лучники', mk: 'Коњски стрелци', de: 'Berittene Bogenschützen', fr: 'Archers montés' },
  imp_unit_keshik: { en: 'Keshik Guard', es: 'Guardia keshik', ru: 'Кешиктены', mk: 'Кешик гарда', de: 'Keschik-Garde', fr: 'Garde kechik' },
  imp_unit_pikeman: { en: 'Pikemen', es: 'Piqueros', ru: 'Пикинёры', mk: 'Пикинери', de: 'Pikeniere', fr: 'Piquiers' },
  imp_unit_arquebusier: { en: 'Arquebusiers', es: 'Arcabuceros', ru: 'Аркебузиры', mk: 'Аркебузири', de: 'Arkebusiere', fr: 'Arquebusiers' },
  imp_unit_herreruelo: { en: 'Herreruelos', es: 'Herreruelos', ru: 'Эрреруэло', mk: 'Хереруело', de: 'Herreruelos', fr: 'Herreruelos' },
  imp_unit_janissary: { en: 'Janissaries', es: 'Jenízaros', ru: 'Янычары', mk: 'Јаничари', de: 'Janitscharen', fr: 'Janissaires' },
  imp_unit_topcu: { en: 'Topçu Artillery', es: 'Artillería topçu', ru: 'Топчу (артиллерия)', mk: 'Топчу артилерија', de: 'Topçu-Artillerie', fr: 'Artillerie topçu' },
  imp_unit_sipahi: { en: 'Sipahis', es: 'Sipahis', ru: 'Сипахи', mk: 'Спахии', de: 'Sipahis', fr: 'Sipahis' },
  imp_unit_musketeer_gv: { en: 'Musketeers', es: 'Mosqueteros', ru: 'Мушкетёры', mk: 'Мускетари', de: 'Musketiere', fr: 'Mousquetaires' },
  imp_unit_leather_gun: { en: 'Leather Guns', es: 'Cañones de cuero', ru: 'Кожаные пушки', mk: 'Кожни топови', de: 'Ledergeschütze', fr: 'Canons de cuir' },
  imp_unit_hakkapeliitta: { en: 'Hakkapeliitta', es: 'Hakkapeliitta', ru: 'Хаккапелиты', mk: 'Хакапелити', de: 'Hakkapeliten', fr: 'Hakkapélites' },
  imp_unit_line_infantry: { en: 'Line Infantry', es: 'Infantería de línea', ru: 'Линейная пехота', mk: 'Линиска пешадија', de: 'Linieninfanterie', fr: 'Infanterie de ligne' },
  imp_unit_grand_battery: { en: 'Grand Battery', es: 'Gran batería', ru: 'Большая батарея', mk: 'Голема батерија', de: 'Große Batterie', fr: 'Grande batterie' },
  imp_unit_cuirassier: { en: 'Cuirassiers', es: 'Coraceros', ru: 'Кирасиры', mk: 'Кирасири', de: 'Kürassiere', fr: 'Cuirassiers' },
  imp_unit_rifleman: { en: 'Riflemen', es: 'Fusileros', ru: 'Стрелки', mk: 'Пушкари', de: 'Schützen', fr: 'Fusiliers' },
  imp_unit_field_artillery: { en: 'Field Artillery', es: 'Artillería de campaña', ru: 'Полевая артиллерия', mk: 'Полска артилерија', de: 'Feldartillerie', fr: 'Artillerie de campagne' },
  imp_unit_stormtrooper: { en: 'Stormtroopers', es: 'Tropas de asalto', ru: 'Штурмовики', mk: 'Јуришници', de: 'Stoßtruppen', fr: 'Troupes d\'assaut' },
  imp_unit_sergeant: { en: 'Sergeants', es: 'Sargentos', ru: 'Сержанты', mk: 'Сержанти', de: 'Sergeanten', fr: 'Sergents' },
  imp_unit_turcopole: { en: 'Turcopoles', es: 'Turcópolos', ru: 'Туркополы', mk: 'Туркополи', de: 'Turkopolen', fr: 'Turcoples' },
  imp_unit_templar: { en: 'Templar Knights', es: 'Caballeros templarios', ru: 'Тамплиеры', mk: 'Темплари', de: 'Templerritter', fr: 'Chevaliers templiers' },
  imp_unit_halberdier: { en: 'Halberdiers', es: 'Alabarderos', ru: 'Алебардщики', mk: 'Халбардисти', de: 'Hellebardiere', fr: 'Hallebardiers' },
  imp_unit_chukonu: { en: 'Repeating Crossbows', es: 'Ballestas de repetición', ru: 'Многозарядные арбалеты', mk: 'Повторувачки самострели', de: 'Repetierarmbrüste', fr: 'Arbalètes à répétition' },
  imp_unit_han_lancer: { en: 'Han Lancers', es: 'Lanceros Han', ru: 'Ханьские копейщики', mk: 'Хан копјаници', de: 'Han-Lanzenreiter', fr: 'Lanciers Han' },
  // ── Leaders ──
  imp_leader_consul: { en: 'The Iron Consul', es: 'El Cónsul de Hierro', ru: 'Железный консул', mk: 'Железниот конзул', de: 'Der Eiserne Konsul', fr: 'Le Consul de fer' },
  imp_leader_khan: { en: 'The Steppe Khan', es: 'El Kan de la estepa', ru: 'Степной хан', mk: 'Степскиот хан', de: 'Der Steppenkhan', fr: 'Le Khan des steppes' },
  imp_leader_marshal: { en: 'The Lion Marshal', es: 'El Mariscal León', ru: 'Маршал-лев', mk: 'Маршалот Лав', de: 'Der Löwenmarschall', fr: 'Le Maréchal-lion' },
  imp_leader_strategos: { en: 'The Silent Strategos', es: 'El Estratego silencioso', ru: 'Молчаливый стратег', mk: 'Тивкиот стратег', de: 'Der Stille Stratege', fr: 'Le Stratège silencieux' },
  imp_leader_sultan: { en: 'The Storm Sultan', es: 'El Sultán de la tormenta', ru: 'Султан бури', mk: 'Султанот на бурата', de: 'Der Sturmsultan', fr: 'Le Sultan des tempêtes' },
  imp_leader_eagle: { en: 'The Young Eagle', es: 'El Águila joven', ru: 'Молодой орёл', mk: 'Младиот орел', de: 'Der Junge Adler', fr: 'Le Jeune Aigle' },
  // ── Combat modifier labels ──
  imp_mod_tactic_adv: { en: 'Tactical advantage', es: 'Ventaja táctica', ru: 'Тактическое преимущество', mk: 'Тактичка предност', de: 'Taktischer Vorteil', fr: 'Avantage tactique' },
  imp_mod_tactic_counter: { en: 'Countered tactic', es: 'Táctica contrarrestada', ru: 'Парированная тактика', mk: 'Контрирана тактика', de: 'Gekonterte Taktik', fr: 'Tactique contrée' },
  imp_mod_mountain_def: { en: 'Mountain defense', es: 'Defensa de montaña', ru: 'Горная оборона', mk: 'Планинска одбрана', de: 'Gebirgsverteidigung', fr: 'Défense de montagne' },
  imp_mod_charge_uphill: { en: 'Charging uphill', es: 'Carga cuesta arriba', ru: 'Атака в гору', mk: 'Јуриш угоре', de: 'Angriff bergauf', fr: 'Charge en montée' },
  imp_mod_river_crossing: { en: 'Contested river crossing', es: 'Cruce de río disputado', ru: 'Переправа под огнём', mk: 'Оспоруван премин на река', de: 'Umkämpfte Flussüberquerung', fr: 'Franchissement de rivière contesté' },
  imp_mod_desert_fatigue: { en: 'Desert fatigue', es: 'Fatiga del desierto', ru: 'Пустынное истощение', mk: 'Пустински замор', de: 'Wüstenerschöpfung', fr: 'Fatigue du désert' },
  imp_mod_high_ground: { en: 'High ground', es: 'Terreno elevado', ru: 'Господствующая высота', mk: 'Височинска положба', de: 'Erhöhte Stellung', fr: 'Position dominante' },
  imp_mod_rain_bowstrings: { en: 'Rain-soaked bowstrings', es: 'Cuerdas empapadas', ru: 'Промокшие тетивы', mk: 'Наводенети тетиви', de: 'Durchnässte Bogensehnen', fr: 'Cordes détrempées' },
  imp_mod_storm_chaos: { en: 'Storm chaos', es: 'Caos de tormenta', ru: 'Хаос бури', mk: 'Хаос од бура', de: 'Sturmchaos', fr: 'Chaos de tempête' },
  imp_mod_heat_exhaustion: { en: 'Heat exhaustion', es: 'Agotamiento por calor', ru: 'Тепловое изнеможение', mk: 'Топлотна исцрпеност', de: 'Hitzeerschöpfung', fr: 'Épuisement par la chaleur' },
  imp_mod_snow_slog: { en: 'Snowbound advance', es: 'Avance entre la nieve', ru: 'Наступление по снегу', mk: 'Напредување низ снег', de: 'Vormarsch im Schnee', fr: 'Avancée dans la neige' },
  imp_mod_leader_signature: { en: 'Leader\'s signature tactic', es: 'Táctica insignia del líder', ru: 'Коронный приём полководца', mk: 'Потписна тактика на водачот', de: 'Signaturtaktik des Anführers', fr: 'Tactique signature du chef' },
  imp_mod_leader_signature_def: { en: 'Defending commander\'s doctrine', es: 'Doctrina del comandante defensor', ru: 'Доктрина обороняющегося', mk: 'Доктрина на бранителот', de: 'Doktrin des Verteidigers', fr: 'Doctrine du défenseur' },
  // ── Crisis events ──
  imp_crisis_capital_lost_title: { en: 'The capital has fallen!', es: '¡La capital ha caído!', ru: 'Столица пала!', mk: 'Престолнината падна!', de: 'Die Hauptstadt ist gefallen!', fr: 'La capitale est tombée !' },
  imp_crisis_capital_lost_body: { en: 'With {territory} in enemy hands, provinces waver and the treasury flees the mint. Every turn it remains lost, morale across your realm decays.', es: 'Con {territory} en manos enemigas, las provincias vacilan y el tesoro huye de la ceca. Cada turno que siga perdida, la moral de tu reino decae.', ru: 'Пока {territory} в руках врага, провинции колеблются, а казна утекает. Каждый ход без столицы подтачивает боевой дух державы.', mk: 'Со {territory} во непријателски раце, провинциите се колебаат и трезорот бега. Секој потег додека е изгубена, моралот на царството опаѓа.', de: 'Mit {territory} in Feindeshand wanken die Provinzen und die Staatskasse flieht. Jede Runde des Verlusts zehrt an der Moral des Reiches.', fr: 'Avec {territory} aux mains de l\'ennemi, les provinces vacillent et le trésor s\'enfuit. Chaque tour de perte ronge le moral du royaume.' },
  imp_crisis_capital_opt_rally: { en: 'Rally the loyal provinces (+morale, -treasury)', es: 'Moviliza a las provincias leales (+moral, -tesoro)', ru: 'Сплотить верные провинции (+дух, -казна)', mk: 'Собери ги лојалните провинции (+морал, -трезор)', de: 'Die treuen Provinzen sammeln (+Moral, -Schatz)', fr: 'Rallier les provinces loyales (+moral, -trésor)' },
  imp_crisis_capital_opt_march: { en: 'March at once to retake it (forced march order)', es: 'Marcha de inmediato para recuperarla (marcha forzada)', ru: 'Немедленно выступить на её освобождение (форсированный марш)', mk: 'Веднаш маршираj да ја вратиш (принуден марш)', de: 'Sofort zum Rückeroberungsmarsch aufbrechen (Gewaltmarsch)', fr: 'Marcher aussitôt pour la reprendre (marche forcée)' },
  imp_crisis_capital_opt_regroup: { en: 'Accept the loss for now; fortify a new seat', es: 'Acepta la pérdida por ahora; fortifica una nueva sede', ru: 'Пока смириться с потерей; укрепить новую резиденцию', mk: 'Прифати ја загубата засега; утврди ново седиште', de: 'Den Verlust vorerst hinnehmen; einen neuen Sitz befestigen', fr: 'Accepter la perte pour l\'instant ; fortifier un nouveau siège' },
  imp_crisis_blockade_title: { en: 'Trade routes severed', es: 'Rutas comerciales cortadas', ru: 'Торговые пути перерезаны', mk: 'Трговските патишта се пресечени', de: 'Handelswege unterbrochen', fr: 'Routes commerciales coupées' },
  imp_crisis_blockade_body: { en: 'Enemy control of {territory} chokes the caravans. Supply costs rise until the corridor is reopened.', es: 'El control enemigo de {territory} estrangula las caravanas. Los costes de suministro suben hasta reabrir el corredor.', ru: 'Вражеский контроль над {territory} душит караваны. Снабжение дорожает, пока коридор не открыт вновь.', mk: 'Непријателската контрола над {territory} ги дави карваните. Трошоците за снабдување растат додека коридорот не се отвори.', de: 'Feindliche Kontrolle über {territory} erstickt die Karawanen. Die Versorgungskosten steigen, bis der Korridor wieder offen ist.', fr: 'Le contrôle ennemi de {territory} étrangle les caravanes. Les coûts de ravitaillement grimpent jusqu\'à la réouverture du corridor.' },
  imp_crisis_blockade_opt_reroute: { en: 'Reroute through the mountains (slower, safe)', es: 'Desvía por las montañas (más lento, seguro)', ru: 'Пустить обозы через горы (медленно, но надёжно)', mk: 'Пренасочи преку планините (побавно, безбедно)', de: 'Über die Berge umleiten (langsamer, sicher)', fr: 'Détourner par les montagnes (plus lent, sûr)' },
  imp_crisis_blockade_opt_convoy: { en: 'Run armed convoys (risk skirmishes)', es: 'Envía convoyes armados (riesgo de escaramuzas)', ru: 'Отправить вооружённые конвои (риск стычек)', mk: 'Прати вооружени конвои (ризик од судири)', de: 'Bewaffnete Konvois einsetzen (Gefechtsrisiko)', fr: 'Lancer des convois armés (risque d\'escarmouches)' },
  imp_crisis_coup_title: { en: 'Conspiracy in the war camp', es: 'Conspiración en el campamento', ru: 'Заговор в военном лагере', mk: 'Заговор во воениот логор', de: 'Verschwörung im Feldlager', fr: 'Conspiration dans le camp' },
  imp_crisis_coup_body: { en: 'Two lost battles and a starving army: your officers whisper of a new commander. Act before the whisper becomes a shout.', es: 'Dos batallas perdidas y un ejército hambriento: tus oficiales murmuran sobre un nuevo comandante. Actúa antes de que el murmullo sea un grito.', ru: 'Два поражения и голодающая армия: офицеры шепчутся о новом командующем. Действуйте, пока шёпот не стал криком.', mk: 'Две изгубени битки и гладна војска: твоите офицери шепотат за нов командант. Дејствувај пред шепотот да стане крик.', de: 'Zwei verlorene Schlachten und ein hungerndes Heer: Ihre Offiziere flüstern von einem neuen Befehlshaber. Handeln Sie, ehe aus Flüstern Rufe werden.', fr: 'Deux batailles perdues et une armée affamée : vos officiers murmurent le nom d\'un nouveau commandant. Agissez avant que le murmure ne devienne un cri.' },
  imp_crisis_coup_opt_purge: { en: 'Purge the ringleaders (-morale now, +discipline later)', es: 'Purga a los cabecillas (-moral ahora, +disciplina después)', ru: 'Устранить зачинщиков (-дух сейчас, +дисциплина потом)', mk: 'Исчисти ги водачите (-морал сега, +дисциплина потоа)', de: 'Die Rädelsführer beseitigen (-Moral jetzt, +Disziplin später)', fr: 'Purger les meneurs (-moral maintenant, +discipline ensuite)' },
  imp_crisis_coup_opt_concede: { en: 'Share command with the faction (-authority, +morale)', es: 'Comparte el mando con la facción (-autoridad, +moral)', ru: 'Разделить командование (-власть, +дух)', mk: 'Сподели ја командата (-авторитет, +морал)', de: 'Das Kommando teilen (-Autorität, +Moral)', fr: 'Partager le commandement (-autorité, +moral)' },
  imp_crisis_isolated_title: { en: 'Army cut off!', es: '¡Ejército aislado!', ru: 'Армия отрезана!', mk: 'Војската е отсечена!', de: 'Armee abgeschnitten!', fr: 'Armée isolée !' },
  imp_crisis_isolated_body: { en: 'The corridor to {territory} is severed. Attrition compounds every turn the pocket holds.', es: 'El corredor hacia {territory} está cortado. El desgaste se agrava cada turno que dure la bolsa.', ru: 'Коридор к {territory} перерезан. Потери нарастают с каждым ходом в котле.', mk: 'Коридорот кон {territory} е пресечен. Загубите се засилуваат секој потег во џебот.', de: 'Der Korridor nach {territory} ist durchtrennt. Die Verluste wachsen mit jeder Runde im Kessel.', fr: 'Le corridor vers {territory} est coupé. L\'attrition s\'aggrave à chaque tour dans la poche.' },
  // ── UI strings ──
  imp_title: { en: 'Chronos Imperium', es: 'Chronos Imperium', ru: 'Chronos Imperium', mk: 'Chronos Imperium', de: 'Chronos Imperium', fr: 'Chronos Imperium' },
  imp_subtitle: { en: 'Strategic conquest over the living map — logistics, tactics, and history in one campaign', es: 'Conquista estratégica sobre el mapa vivo: logística, táctica e historia en una campaña', ru: 'Стратегическое завоевание на живой карте — логистика, тактика и история в одной кампании', mk: 'Стратегиско освојување на живата карта — логистика, тактика и историја во една кампања', de: 'Strategische Eroberung auf der lebenden Karte — Logistik, Taktik und Geschichte in einem Feldzug', fr: 'Conquête stratégique sur la carte vivante — logistique, tactique et histoire en une campagne' },
  imp_gate: { en: 'Chronos Imperium is a Master Student exclusive: a full strategic-tactical campaign over the real historical map.', es: 'Chronos Imperium es exclusivo de Master Student: una campaña estratégico-táctica completa sobre el mapa histórico real.', ru: 'Chronos Imperium — эксклюзив Master Student: полная стратегико-тактическая кампания на реальной исторической карте.', mk: 'Chronos Imperium е ексклузивен за Master Student: целосна стратегиско-тактичка кампања на вистинската историска карта.', de: 'Chronos Imperium ist exklusiv für Master Student: ein vollständiger strategisch-taktischer Feldzug auf der realen historischen Karte.', fr: 'Chronos Imperium est une exclusivité Master Student : une campagne stratégico-tactique complète sur la vraie carte historique.' },
  imp_new_campaign: { en: 'New campaign', es: 'Nueva campaña', ru: 'Новая кампания', mk: 'Нова кампања', de: 'Neuer Feldzug', fr: 'Nouvelle campagne' },
  imp_theatre: { en: 'Theatre', es: 'Teatro', ru: 'Театр', mk: 'Театар', de: 'Kriegsschauplatz', fr: 'Théâtre' },
  imp_turn: { en: 'Turn', es: 'Turno', ru: 'Ход', mk: 'Потег', de: 'Runde', fr: 'Tour' },
  imp_end_turn: { en: 'End turn', es: 'Terminar turno', ru: 'Завершить ход', mk: 'Заврши потег', de: 'Runde beenden', fr: 'Fin du tour' },
  imp_your_armies: { en: 'Your armies', es: 'Tus ejércitos', ru: 'Ваши армии', mk: 'Твоите војски', de: 'Deine Armeen', fr: 'Tes armées' },
  imp_march_to: { en: 'March to…', es: 'Marchar a…', ru: 'Марш на…', mk: 'Марширај кон…', de: 'Marschieren nach…', fr: 'Marcher vers…' },
  imp_supplied: { en: 'Supplied', es: 'Abastecido', ru: 'Снабжается', mk: 'Снабдена', de: 'Versorgt', fr: 'Ravitaillée' },
  imp_isolated: { en: 'ISOLATED', es: 'AISLADO', ru: 'ОТРЕЗАНА', mk: 'ОТСЕЧЕНА', de: 'ABGESCHNITTEN', fr: 'ISOLÉE' },
  imp_strength: { en: 'Strength', es: 'Fuerza', ru: 'Сила', mk: 'Сила', de: 'Stärke', fr: 'Force' },
  imp_morale: { en: 'Morale', es: 'Moral', ru: 'Боевой дух', mk: 'Морал', de: 'Moral', fr: 'Moral' },
  imp_battle: { en: 'Battle', es: 'Batalla', ru: 'Сражение', mk: 'Битка', de: 'Schlacht', fr: 'Bataille' },
  imp_victory: { en: 'Victory!', es: '¡Victoria!', ru: 'Победа!', mk: 'Победа!', de: 'Sieg!', fr: 'Victoire !' },
  imp_defeat: { en: 'Defeat', es: 'Derrota', ru: 'Поражение', mk: 'Пораз', de: 'Niederlage', fr: 'Défaite' },
  imp_campaign_won: { en: 'The theatre is yours — every rival territory has fallen.', es: 'El teatro es tuyo: todos los territorios rivales han caído.', ru: 'Театр ваш — все территории соперника пали.', mk: 'Театарот е твој — сите ривалски територии паднаа.', de: 'Der Kriegsschauplatz gehört dir — jedes gegnerische Gebiet ist gefallen.', fr: 'Le théâtre est à toi — tous les territoires rivaux sont tombés.' },
  imp_campaign_lost: { en: 'Your realm has fallen. History will remember the attempt.', es: 'Tu reino ha caído. La historia recordará el intento.', ru: 'Ваша держава пала. История запомнит попытку.', mk: 'Твоето царство падна. Историјата ќе го памети обидот.', de: 'Dein Reich ist gefallen. Die Geschichte wird den Versuch erinnern.', fr: 'Ton royaume est tombé. L\'histoire retiendra la tentative.' },
  imp_rollback: { en: 'Rewind to turn', es: 'Rebobinar al turno', ru: 'Откатить к ходу', mk: 'Врати на потег', de: 'Zurück zu Runde', fr: 'Revenir au tour' },
  imp_weather: { en: 'Weather', es: 'Clima', ru: 'Погода', mk: 'Време', de: 'Wetter', fr: 'Météo' },
  imp_weather_clear: { en: 'Clear', es: 'Despejado', ru: 'Ясно', mk: 'Ведро', de: 'Klar', fr: 'Dégagé' },
  imp_weather_rain: { en: 'Rain', es: 'Lluvia', ru: 'Дождь', mk: 'Дожд', de: 'Regen', fr: 'Pluie' },
  imp_weather_storm: { en: 'Storm', es: 'Tormenta', ru: 'Буря', mk: 'Бура', de: 'Sturm', fr: 'Tempête' },
  imp_weather_heat: { en: 'Heat wave', es: 'Ola de calor', ru: 'Зной', mk: 'Горештина', de: 'Hitzewelle', fr: 'Canicule' },
  imp_weather_snow: { en: 'Snow', es: 'Nieve', ru: 'Снег', mk: 'Снег', de: 'Schnee', fr: 'Neige' },
  imp_log: { en: 'Campaign log', es: 'Diario de campaña', ru: 'Журнал кампании', mk: 'Дневник на кампањата', de: 'Feldzugstagebuch', fr: 'Journal de campagne' },
  imp_choose_tactic: { en: 'Choose your tactic', es: 'Elige tu táctica', ru: 'Выберите тактику', mk: 'Избери тактика', de: 'Wähle deine Taktik', fr: 'Choisis ta tactique' },
  imp_attrition_report: { en: '{army} lost {n} strength to attrition', es: '{army} perdió {n} de fuerza por desgaste', ru: '{army} потеряла {n} силы от истощения', mk: '{army} изгуби {n} сила од трошење', de: '{army} verlor {n} Stärke durch Abnutzung', fr: '{army} a perdu {n} de force par attrition' },
  imp_enemy_moves: { en: 'Enemy columns are moving', es: 'Las columnas enemigas se mueven', ru: 'Колонны противника выступили', mk: 'Непријателските колони се движат', de: 'Feindliche Kolonnen sind unterwegs', fr: 'Les colonnes ennemies se déplacent' },
  // ── Tactics ──
  imp_tactic_charge: { en: 'Charge', es: 'Carga', ru: 'Атака', mk: 'Јуриш', de: 'Sturmangriff', fr: 'Charge' },
  imp_tactic_volley: { en: 'Volley', es: 'Descarga', ru: 'Залп', mk: 'Салва', de: 'Salve', fr: 'Salve' },
  imp_tactic_hold: { en: 'Shield Wall', es: 'Muro de escudos', ru: 'Стена щитов', mk: 'Штитен ѕид', de: 'Schildwall', fr: 'Mur de boucliers' },
  imp_triangle_hint: { en: 'Charges break volleys · volleys break shield walls · shield walls break charges', es: 'Las cargas rompen descargas · las descargas rompen muros de escudos · los muros rompen cargas', ru: 'Атака бьёт залп · залп бьёт стену щитов · стена щитов бьёт атаку', mk: 'Јуришот ги крши салвите · салвите го кршат штитниот ѕид · штитниот ѕид го крши јуришот', de: 'Sturmangriffe schlagen Salven · Salven schlagen Schildwälle · Schildwälle schlagen Sturmangriffe', fr: 'La charge bat la salve · la salve bat le mur de boucliers · le mur de boucliers bat la charge' },
  // ── Page chrome ──
  imp_setup_pick: { en: 'Choose your theatre of war', es: 'Elige tu teatro de guerra', ru: 'Выберите театр военных действий', mk: 'Избери го твојот воен театар', de: 'Wähle deinen Kriegsschauplatz', fr: 'Choisis ton théâtre de guerre' },
  imp_territories: { en: 'territories', es: 'territorios', ru: 'территорий', mk: 'територии', de: 'Gebiete', fr: 'territoires' },
  imp_resume: { en: 'Resume campaign', es: 'Reanudar campaña', ru: 'Продолжить кампанию', mk: 'Продолжи ја кампањата', de: 'Feldzug fortsetzen', fr: 'Reprendre la campagne' },
  imp_abandon: { en: 'Abandon', es: 'Abandonar', ru: 'Оставить', mk: 'Напушти', de: 'Aufgeben', fr: 'Abandonner' },
  imp_treasury: { en: 'Treasury', es: 'Tesoro', ru: 'Казна', mk: 'Трезор', de: 'Staatskasse', fr: 'Trésor' },
  imp_discipline: { en: 'Discipline', es: 'Disciplina', ru: 'Дисциплина', mk: 'Дисциплина', de: 'Disziplin', fr: 'Discipline' },
  imp_council: { en: 'War council', es: 'Consejo de guerra', ru: 'Военный совет', mk: 'Воен совет', de: 'Kriegsrat', fr: 'Conseil de guerre' },
  imp_crisis_council: { en: 'Crisis council', es: 'Consejo de crisis', ru: 'Кризисный совет', mk: 'Кризен совет', de: 'Krisenrat', fr: 'Conseil de crise' },
  imp_battle_report: { en: 'Battle report', es: 'Parte de batalla', ru: 'Донесение о сражении', mk: 'Извештај од битката', de: 'Gefechtsbericht', fr: 'Rapport de bataille' },
  imp_attacker: { en: 'Attacker', es: 'Atacante', ru: 'Атакующий', mk: 'Напаѓач', de: 'Angreifer', fr: 'Attaquant' },
  imp_defender: { en: 'Defender', es: 'Defensor', ru: 'Обороняющийся', mk: 'Бранител', de: 'Verteidiger', fr: 'Défenseur' },
  imp_modifiers: { en: 'Battle modifiers', es: 'Modificadores de batalla', ru: 'Модификаторы боя', mk: 'Модификатори на битката', de: 'Gefechtsmodifikatoren', fr: 'Modificateurs de bataille' },
  imp_continue: { en: 'Continue', es: 'Continuar', ru: 'Продолжить', mk: 'Продолжи', de: 'Weiter', fr: 'Continuer' },
  imp_select_hint: { en: 'Select an army, then tap a territory to order the march.', es: 'Selecciona un ejército y toca un territorio para ordenar la marcha.', ru: 'Выберите армию, затем коснитесь территории, чтобы отдать приказ о марше.', mk: 'Избери војска, па допри територија за да наредиш марш.', de: 'Wähle eine Armee und tippe dann auf ein Gebiet, um den Marsch zu befehlen.', fr: 'Sélectionne une armée, puis touche un territoire pour ordonner la marche.' },
  imp_supply_web: { en: 'Supply web', es: 'Red de suministro', ru: 'Сеть снабжения', mk: 'Мрежа за снабдување', de: 'Versorgungsnetz', fr: 'Réseau de ravitaillement' },
  imp_stalemate: { en: 'Stalemate', es: 'Empate', ru: 'Ничья', mk: 'Нерешено', de: 'Patt', fr: 'Impasse' },
  imp_routed: { en: 'Routed!', es: '¡En desbandada!', ru: 'Бегство!', mk: 'Разбиени!', de: 'Auf der Flucht!', fr: 'En déroute !' },
  imp_leader: { en: 'Commander', es: 'Comandante', ru: 'Полководец', mk: 'Командант', de: 'Feldherr', fr: 'Commandant' },
  imp_march_ordered: { en: 'March ordered', es: 'Marcha ordenada', ru: 'Марш назначен', mk: 'Маршот е нареден', de: 'Marschbefehl erteilt', fr: 'Marche ordonnée' },
  imp_marching: { en: 'Marching', es: 'En marcha', ru: 'На марше', mk: 'Во марш', de: 'Auf dem Marsch', fr: 'En marche' },
  imp_era_ancient: { en: 'Ancient World', es: 'Mundo antiguo', ru: 'Древний мир', mk: 'Античко време', de: 'Antike', fr: 'Monde antique' },
  imp_era_medieval: { en: 'Middle Ages', es: 'Edad Media', ru: 'Средневековье', mk: 'Среден век', de: 'Mittelalter', fr: 'Moyen Âge' },
  'imp_era_early-modern': { en: 'Early Modern', es: 'Edad Moderna', ru: 'Раннее Новое время', mk: 'Ран нов век', de: 'Frühe Neuzeit', fr: 'Époque moderne' },
  imp_era_modern: { en: 'Modern Era', es: 'Era contemporánea', ru: 'Новейшее время', mk: 'Модерна ера', de: 'Moderne', fr: 'Ère contemporaine' },
  imp_new_here: { en: 'A new campaign will open on this theatre\'s living map.', es: 'Una nueva campaña se abrirá sobre el mapa vivo de este teatro.', ru: 'Новая кампания развернётся на живой карте этого театра.', mk: 'Нова кампања ќе се отвори на живата карта на овој театар.', de: 'Ein neuer Feldzug beginnt auf der lebenden Karte dieses Schauplatzes.', fr: 'Une nouvelle campagne s\'ouvrira sur la carte vivante de ce théâtre.' },
};

/**
 * Resolve a catalog key for a language, with {param} interpolation.
 * Contract: components call this at the render boundary — payloads carry keys.
 */
export function impText(key: string, language: Language, params?: Record<string, string | number>): string {
  const entry = CATALOG[key];
  let text = entry ? (entry[language] ?? entry.en) : key;
  if (params) {
    for (const [k, v] of Object.entries(params)) text = text.split(`{${k}}`).join(String(v));
  }
  return text;
}

export function hasImpText(key: string): boolean {
  return key in CATALOG;
}
