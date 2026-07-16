import type { Language } from './translations';

interface QuizQuestionTranslation {
  question: string;
  options: string[];
  explanation: string;
}

type DeFr = 'de' | 'fr';

// German + French translations for all 200 era-quiz questions.
export const QUIZ_TRANS_DEFR: Record<string, Partial<Record<DeFr, QuizQuestionTranslation>>> = {
  'aq1': {
    de: { question: "Welches Schriftsystem entwickelten die Sumerer um 3100 v. Chr.?", options: ["Hieroglyphen", "Keilschrift", "Linear B", "Phönizisches Alphabet"], explanation: "Die Keilschrift („keilförmig“) wurde mit einem Rohrgriffel in Tontafeln gedrückt. Hieroglyphen waren ägyptisch; Linear B war mykenisches Griechisch." },
    fr: { question: "Quel système d’écriture les Sumériens développèrent-ils vers 3100 av. J.-C. ?", options: ["Hiéroglyphes", "Cunéiforme", "Linéaire B", "Alphabet phénicien"], explanation: "Le cunéiforme (« en forme de coin ») était imprimé dans des tablettes d’argile à l’aide d’un stylet de roseau. Les hiéroglyphes étaient égyptiens ; le linéaire B était du grec mycénien." },
  },
  'aq2': {
    de: { question: "Welcher athenische Reformer führte um 508 v. Chr. das erste demokratische System der Welt ein?", options: ["Solon", "Perikles", "Kleisthenes", "Themistokles"], explanation: "Kleisthenes gestaltete die athenische Verwaltung um, um gewöhnlichen Bürgern unmittelbare politische Macht zu geben, und erwarb sich den Titel „Vater der athenischen Demokratie“." },
    fr: { question: "Quel réformateur athénien introduisit le premier système démocratique du monde vers 508 av. J.-C. ?", options: ["Solon", "Périclès", "Clisthène", "Thémistocle"], explanation: "Clisthène restructura le gouvernement athénien pour donner un pouvoir politique direct aux citoyens ordinaires, méritant le titre de « père de la démocratie athénienne »." },
  },
  'aq3': {
    de: { question: "In welcher Schlacht besiegten die Athener 490 v. Chr. die persische Invasion?", options: ["Thermopylen", "Salamis", "Marathon", "Plataiai"], explanation: "In der Schlacht bei Marathon schlug eine kleinere athenische Streitmacht die Perser in die Flucht und bewahrte die griechische Unabhängigkeit." },
    fr: { question: "À quelle bataille les Athéniens repoussèrent-ils l’invasion perse en 490 av. J.-C. ?", options: ["Thermopyles", "Salamine", "Marathon", "Platées"], explanation: "À la bataille de Marathon, une force athénienne plus réduite mit en déroute les Perses, préservant l’indépendance grecque." },
  },
  'aq4': {
    de: { question: "An welchem Tag des Jahres 44 v. Chr. wurde Julius Cäsar ermordet?", options: ["1. Januar", "15. März", "4. Juli", "25. Dezember"], explanation: "An den „Iden des März“ (15. März) ermordete eine Gruppe von Senatoren unter Führung von Brutus und Cassius Cäsar im Senat." },
    fr: { question: "À quelle date de l’an 44 av. J.-C. Jules César fut-il assassiné ?", options: ["1ᵉʳ janvier", "15 mars", "4 juillet", "25 décembre"], explanation: "C’est aux « ides de mars » (15 mars) qu’un groupe de sénateurs, mené par Brutus et Cassius, assassina César au Sénat." },
  },
  'aq5': {
    de: { question: "Die Pax Romana bezeichnet eine Periode römischen Friedens, die etwa wie lange dauerte?", options: ["50 Jahre", "100 Jahre", "200 Jahre", "400 Jahre"], explanation: "Die Pax Romana („Römischer Friede“) dauerte rund 200 Jahre, von Augustus 27 v. Chr. bis zum Tod Mark Aurels 180 n. Chr." },
    fr: { question: "La Pax Romana désigne une période de paix romaine qui dura environ combien de temps ?", options: ["50 ans", "100 ans", "200 ans", "400 ans"], explanation: "La Pax Romana (« paix romaine ») dura environ 200 ans, d’Auguste en 27 av. J.-C. à la mort de Marc Aurèle en 180 apr. J.-C." },
  },
  'aq6': {
    de: { question: "Welcher persische König erließ den „Kyros-Zylinder“, der als frühe Erklärung der Menschenrechte gilt?", options: ["Dareios I.", "Xerxes", "Kyros der Große", "Artaxerxes"], explanation: "Kyros der Große befreite die jüdischen Verbannten aus Babylon und erlaubte den unterworfenen Völkern, ihre eigenen Religionen auszuüben." },
    fr: { question: "Quel roi perse promulgua le « cylindre de Cyrus », considéré comme une déclaration précoce des droits humains ?", options: ["Darius Iᵉʳ", "Xerxès", "Cyrus le Grand", "Artaxerxès"], explanation: "Cyrus le Grand libéra les exilés juifs de Babylone et permit aux peuples conquis de pratiquer leurs propres religions." },
  },
  'aq7': {
    de: { question: "Die Seidenstraße erleichterte vor allem den Handel zwischen welchen beiden Zivilisationen?", options: ["Ägypten und Griechenland", "Rom und Indien", "China und Rom/Mittelmeerraum", "Persien und Ägypten"], explanation: "Die Seidenstraße verband das Han-China mit der Mittelmeerwelt und beförderte Seide, Gewürze und Ideen in beide Richtungen." },
    fr: { question: "La route de la soie facilitait surtout le commerce entre quelles deux civilisations ?", options: ["Égypte et Grèce", "Rome et Inde", "Chine et Rome/Méditerranée", "Perse et Égypte"], explanation: "La route de la soie reliait la Chine des Han au monde méditerranéen, transportant soie, épices et idées dans les deux sens." },
  },
  'aq8': {
    de: { question: "Welcher Philosoph wurde 399 v. Chr. in Athen wegen „Verderbung der Jugend“ zum Tode verurteilt?", options: ["Platon", "Aristoteles", "Sokrates", "Diogenes"], explanation: "Sokrates wurde vor Gericht gestellt und gezwungen, den Schierlingsbecher zu trinken. Sein Schüler Platon schilderte den Prozess in der Apologie." },
    fr: { question: "Quel philosophe fut condamné à mort à Athènes en 399 av. J.-C. pour avoir « corrompu la jeunesse » ?", options: ["Platon", "Aristote", "Socrate", "Diogène"], explanation: "Socrate fut jugé et contraint de boire la ciguë. Son élève Platon relata le procès dans l’Apologie." },
  },
  'aq9': {
    de: { question: "Zu welcher Religion bekehrte sich Kaiser Ashoka des Maurya-Reiches nach der brutalen Eroberung von Kalinga?", options: ["Hinduismus", "Jainismus", "Buddhismus", "Zoroastrismus"], explanation: "Entsetzt über das Leid bei Kalinga nahm Ashoka den Buddhismus an, regierte nach dem Dharma und entsandte Missionare in ganz Asien." },
    fr: { question: "À quelle religion l’empereur Ashoka de l’Empire maurya se convertit-il après la brutale conquête du Kalinga ?", options: ["Hindouisme", "Jaïnisme", "Bouddhisme", "Zoroastrisme"], explanation: "Horrifié par les souffrances du Kalinga, Ashoka embrassa le bouddhisme, gouverna selon le dharma et envoya des missionnaires à travers l’Asie." },
  },
  'aq10': {
    de: { question: "Worin lag die Bedeutung des Codex Hammurapi (~1754 v. Chr.)?", options: ["Erste demokratische Verfassung", "Erstes schriftliches Gesetzbuch der Geschichte", "Erstes internationales Handelsabkommen", "Erster monotheistischer religiöser Text"], explanation: "Der Codex Hammurapi ist eines der frühesten und vollständigsten schriftlichen Gesetzbücher und umfasst Verbrechen, Handel und gesellschaftliche Beziehungen." },
    fr: { question: "Quelle était l’importance du Code de Hammurabi (~1754 av. J.-C.) ?", options: ["Première constitution démocratique", "Premier code de lois écrit de l’histoire", "Premier accord commercial international", "Premier texte religieux monothéiste"], explanation: "Le Code de Hammurabi est l’un des codes de lois écrits les plus anciens et les plus complets, couvrant crimes, commerce et relations sociales." },
  },
  'aq11': {
    de: { question: "In welcher Schlacht besiegte Alexander der Große den persischen König Dareios III. entscheidend und beendete damit faktisch das Achämenidenreich?", options: ["Schlacht bei Issos", "Schlacht bei Gaugamela", "Schlacht am Granikos", "Schlacht am Hydaspes"], explanation: "Gaugamela (331 v. Chr.) war die entscheidende Schlacht, in der Alexanders neuartige Reitertaktik das zahlenmäßig überlegene persische Heer zerschmetterte und das persische Kernland öffnete." },
    fr: { question: "À quelle bataille Alexandre le Grand défit-il décisivement le roi perse Darius III, mettant fin de fait à l’Empire achéménide ?", options: ["Bataille d’Issos", "Bataille de Gaugamèles", "Bataille du Granique", "Bataille de l’Hydaspe"], explanation: "Gaugamèles (331 av. J.-C.) fut la bataille décisive où les tactiques de cavalerie novatrices d’Alexandre brisèrent l’armée perse numériquement supérieure, ouvrant le cœur de la Perse." },
  },
  'aq12': {
    de: { question: "Das römische Mailänder Edikt (313 n. Chr.), von Kaiser Konstantin erlassen, war bedeutend, weil es …", options: ["das Christentum zur Staatsreligion machte", "das Christentum im gesamten Römischen Reich legalisierte", "alle nichtchristlichen Bürger vertrieb", "das Amt des Papstes schuf"], explanation: "Das Mailänder Edikt erklärte die religiöse Duldung aller Glaubensrichtungen und legalisierte insbesondere das Christentum. Erst 380 n. Chr. unter Theodosius wurde das Christentum zur Staatsreligion." },
    fr: { question: "L’édit de Milan (313 apr. J.-C.), promulgué par l’empereur Constantin, fut important parce qu’il…", options: ["fit du christianisme la religion d’État", "légalisa le christianisme dans tout l’Empire romain", "expulsa tous les citoyens non chrétiens", "créa la fonction de pape"], explanation: "L’édit de Milan proclama la tolérance religieuse pour toutes les fois, légalisant en particulier le christianisme. Ce n’est qu’en 380 apr. J.-C., sous Théodose, que le christianisme devint religion d’État." },
  },
  'aq13': {
    de: { question: "Welches antike Weltwunder, über 130 Meter hoch, blieb fast 4 000 Jahre lang das höchste von Menschen errichtete Bauwerk?", options: ["Der Koloss von Rhodos", "Der Leuchtturm von Alexandria", "Die Große Pyramide von Gizeh", "Der Artemis-Tempel"], explanation: "Die Große Pyramide des Cheops in Gizeh (~2560 v. Chr.) hielt den Rekord als höchstes Bauwerk der Welt, bis die Kathedrale von Lincoln sie 1311 n. Chr. übertraf — fast 3 800 Jahre später." },
    fr: { question: "Quelle merveille antique, culminant à plus de 130 mètres, resta près de 4 000 ans la plus haute structure édifiée par l’homme ?", options: ["Le colosse de Rhodes", "Le phare d’Alexandrie", "La grande pyramide de Gizeh", "Le temple d’Artémis"], explanation: "La grande pyramide de Khéops à Gizeh (~2560 av. J.-C.) détint le record de plus haute structure du monde jusqu’à ce que la cathédrale de Lincoln la dépasse en 1311 apr. J.-C. — près de 3 800 ans plus tard." },
  },
  'aq14': {
    de: { question: "Der Peloponnesische Krieg (431–404 v. Chr.) wurde zwischen Athen und welchem rivalisierenden Stadtstaat ausgetragen?", options: ["Korinth", "Theben", "Sparta", "Makedonien"], explanation: "Der Peloponnesische Krieg stellte Athens Seereich gegen Spartas landgestütztes Bündnis. Spartas letztlicher Sieg beendete Athens goldenes Zeitalter." },
    fr: { question: "La guerre du Péloponnèse (431–404 av. J.-C.) opposa Athènes à quelle cité rivale ?", options: ["Corinthe", "Thèbes", "Sparte", "Macédoine"], explanation: "La guerre du Péloponnèse opposa l’empire maritime d’Athènes à l’alliance terrestre de Sparte. La victoire finale de Sparte mit fin à l’âge d’or d’Athènes." },
  },
  'aq15': {
    de: { question: "Welche Erfindung der Han-Dynastie, um 105 n. Chr. aus Pflanzenfasern hergestellt, sollte schließlich die Kommunikation weltweit verwandeln?", options: ["Schießpulver", "Der Kompass", "Papier", "Gusseisen"], explanation: "Papier wurde im Han-China entwickelt, überliefert Cai Lun 105 n. Chr. zugeschrieben. Es war leichter und billiger als Papyrus oder Seide und gelangte schließlich über die Seidenstraße nach Europa." },
    fr: { question: "Quelle invention de la dynastie Han, faite de fibres végétales vers 105 apr. J.-C., allait transformer la communication dans le monde entier ?", options: ["La poudre à canon", "La boussole", "Le papier", "La fonte"], explanation: "Le papier fut mis au point sous la Chine des Han, traditionnellement attribué à Cai Lun en 105 apr. J.-C. Plus léger et moins coûteux que le papyrus ou la soie, il gagna finalement l’Europe par la route de la soie." },
  },
  'aq16': {
    de: { question: "Das Gilgamesch-Epos, eines der frühesten Werke der Literatur, entstammt welcher Zivilisation?", options: ["Ägypten", "Sumer/Babylonien", "Persien", "Das Industal"], explanation: "Gilgamesch war ein sagenhafter König von Uruk in Sumer; das Epos wurde später auf Akkadisch in Babylonien zusammengestellt." },
    fr: { question: "L’Épopée de Gilgamesh, l’une des plus anciennes œuvres littéraires, est née de quelle civilisation ?", options: ["Égypte", "Sumer/Babylonie", "Perse", "La vallée de l’Indus"], explanation: "Gilgamesh était un roi légendaire d’Uruk en Sumer ; l’épopée fut plus tard compilée en akkadien en Babylonie." },
  },
  'aq17': {
    de: { question: "Welche ägyptische Königin herrschte als Pharao und entsandte eine berühmte Handelsexpedition ins Land Punt?", options: ["Nofretete", "Kleopatra VII.", "Hatschepsut", "Nefertari"], explanation: "Hatschepsut (reg. ~1479–1458 v. Chr.) nahm die vollen Machtbefugnisse eines Pharaos an und verewigte die Punt-Expedition in Deir el-Bahari." },
    fr: { question: "Quelle reine égyptienne régna en tant que pharaon et envoya une célèbre expédition commerciale au pays de Pount ?", options: ["Néfertiti", "Cléopâtre VII", "Hatchepsout", "Néfertari"], explanation: "Hatchepsout (r. v. 1479–1458 av. J.-C.) prit les pleins pouvoirs d’un pharaon et commémora l’expédition de Pount à Deir el-Bahari." },
  },
  'aq18': {
    de: { question: "Der Stein von Rosette war für Historiker entscheidend, weil er die Entzifferung von was ermöglichte?", options: ["Keilschrift", "Linear A", "Ägyptische Hieroglyphen", "Das phönizische Alphabet"], explanation: "Sein gleicher Text in Hieroglyphen, Demotisch und Griechisch ließ Champollion 1822 die Hieroglyphen entschlüsseln." },
    fr: { question: "La pierre de Rosette fut cruciale pour les historiens parce qu’elle permit de déchiffrer quoi ?", options: ["Le cunéiforme", "Le linéaire A", "Les hiéroglyphes égyptiens", "L’alphabet phénicien"], explanation: "Son même texte en hiéroglyphes, en démotique et en grec permit à Champollion de percer les hiéroglyphes en 1822." },
  },
  'aq19': {
    de: { question: "Welches Volk verbreitete das erste weithin übernommene Alphabet über seine mittelmeerischen Handelsnetze?", options: ["Die Griechen", "Die Phönizier", "Die Hethiter", "Die Etrusker"], explanation: "Das aus 22 Konsonanten bestehende phönizische Alphabet wurde von den Griechen übernommen, die Vokale hinzufügten." },
    fr: { question: "Quel peuple répandit le premier alphabet largement adopté à travers ses réseaux commerciaux méditerranéens ?", options: ["Les Grecs", "Les Phéniciens", "Les Hittites", "Les Étrusques"], explanation: "L’alphabet consonantique phénicien de 22 lettres fut adapté par les Grecs, qui ajoutèrent les voyelles." },
  },
  'aq20': {
    de: { question: "Karthago, Roms großer Rivale, begann als Kolonie welcher Stadt?", options: ["Athen", "Tyros", "Alexandria", "Byblos"], explanation: "Phönizische Siedler aus Tyros gründeten Karthago (überliefert 814 v. Chr.) an der nordafrikanischen Küste." },
    fr: { question: "Carthage, la grande rivale de Rome, débuta comme colonie de quelle cité ?", options: ["Athènes", "Tyr", "Alexandrie", "Byblos"], explanation: "Des colons phéniciens venus de Tyr fondèrent Carthage (traditionnellement en 814 av. J.-C.) sur la côte d’Afrique du Nord." },
  },
  'aq21': {
    de: { question: "Kyros der Große begründete welche persische Dynastie?", options: ["Sassaniden", "Parther", "Achämeniden", "Safawiden"], explanation: "Die Dynastie der Achämeniden beherrschte das größte Reich, das die antike Welt bis dahin gesehen hatte, von der Ägäis bis zum Indus." },
    fr: { question: "Cyrus le Grand fonda quelle dynastie perse ?", options: ["Sassanides", "Parthes", "Achéménides", "Séfévides"], explanation: "La dynastie achéménide gouverna le plus grand empire que le monde antique eût encore connu, de la mer Égée à l’Indus." },
  },
  'aq22': {
    de: { question: "Was war eine Satrapie im Persischen Reich?", options: ["Ein religiöses Fest", "Eine Provinzstatthalterschaft", "Eine Reitereinheit", "Ein königlicher Palast"], explanation: "Dareios I. teilte das Reich in etwa zwanzig Satrapien, Provinzen unter Statthaltern, die Satrapen genannt wurden." },
    fr: { question: "Qu’était une satrapie dans l’Empire perse ?", options: ["Une fête religieuse", "Un gouvernorat provincial", "Une unité de cavalerie", "Un palais royal"], explanation: "Darius Iᵉʳ divisa l’empire en une vingtaine de satrapies, des provinces dirigées par des gouverneurs appelés satrapes." },
  },
  'aq23': {
    de: { question: "Die Königsstraße, die es Kurieren ermöglichte, das Persische Reich in etwa einer Woche zu durchqueren, verband Susa mit welcher Stadt?", options: ["Babylon", "Persepolis", "Sardes", "Memphis"], explanation: "Die 2 700 km lange Königsstraße führte von Susa nach Sardes im westlichen Anatolien, mit Relaisstationen für frische Pferde." },
    fr: { question: "La route royale, qui permettait aux courriers de traverser l’Empire perse en une semaine environ, reliait Suse à quelle ville ?", options: ["Babylone", "Persépolis", "Sardes", "Memphis"], explanation: "La route royale de 2 700 km allait de Suse à Sardes, en Anatolie occidentale, avec des relais pour changer de chevaux." },
  },
  'aq24': {
    de: { question: "Welche vom Propheten Zarathustra gegründete Religion war im antiken Persien vorherrschend?", options: ["Mithraismus", "Zoroastrismus", "Manichäismus", "Vedismus"], explanation: "Der Zoroastrismus deutete das Dasein als Ringen zwischen Wahrheit und Lüge unter dem Gott Ahura Mazda." },
    fr: { question: "Quelle religion, fondée par le prophète Zoroastre, était dominante dans la Perse antique ?", options: ["Mithraïsme", "Zoroastrisme", "Manichéisme", "Védisme"], explanation: "Le zoroastrisme concevait l’existence comme une lutte entre la vérité et le mensonge sous le dieu Ahura Mazda." },
  },
  'aq25': {
    de: { question: "Die zeremonielle Hauptstadt des Achämenidenreiches, während Alexanders Eroberung niedergebrannt, war …", options: ["Susa", "Ekbatana", "Pasargadai", "Persepolis"], explanation: "Persepolis, von Dareios I. begonnen, wurde 330 v. Chr. von Alexanders Heer geplündert und niedergebrannt." },
    fr: { question: "La capitale cérémonielle de l’Empire achéménide, incendiée lors de la conquête d’Alexandre, était…", options: ["Suse", "Ecbatane", "Pasargades", "Persépolis"], explanation: "Persépolis, commencée par Darius Iᵉʳ, fut pillée et incendiée par l’armée d’Alexandre en 330 av. J.-C." },
  },
  'aq26': {
    de: { question: "Nach Alexanders Tod 323 v. Chr. wurde sein Reich unter seinen Feldherren aufgeteilt, die zusammen als … bekannt sind.", options: ["Strategoi", "Diadochen", "Satrapen", "Epigonen"], explanation: "Die Diadochen („Nachfolger“) — Ptolemaios, Seleukos, Antigonos und andere — zerschnitten das Reich in rivalisierende Königreiche." },
    fr: { question: "Après la mort d’Alexandre en 323 av. J.-C., son empire fut partagé entre ses généraux, connus collectivement sous le nom de…", options: ["Stratèges", "Diadoques", "Satrapes", "Épigones"], explanation: "Les Diadoques (« successeurs ») — Ptolémée, Séleucos, Antigone et d’autres — découpèrent l’empire en royaumes rivaux." },
  },
  'aq27': {
    de: { question: "Welche Dynastie herrschte von Alexandria aus über Ägypten bis zur römischen Eroberung 30 v. Chr.?", options: ["Die Seleukiden", "Die Antigoniden", "Die Ptolemäer", "Die Attaliden"], explanation: "Die Ptolemäer, abstammend von Alexanders Feldherrn Ptolemaios, herrschten bis zu Kleopatra VII. über Ägypten." },
    fr: { question: "Quelle dynastie gouverna l’Égypte depuis Alexandrie jusqu’à la conquête romaine en 30 av. J.-C. ?", options: ["Les Séleucides", "Les Antigonides", "Les Ptolémées", "Les Attalides"], explanation: "Les Ptolémées, issus du général d’Alexandre Ptolémée, régnèrent sur l’Égypte jusqu’à Cléopâtre VII." },
  },
  'aq28': {
    de: { question: "Die Bibliothek von Alexandria war Teil welcher größeren Gelehrteneinrichtung?", options: ["Die Akademie", "Das Lykeion", "Das Museum (Mouseion)", "Die Stoa"], explanation: "Das Mouseion, eine den Musen geweihte Forschungseinrichtung, beherbergte die Bibliothek und besoldete Gelehrte." },
    fr: { question: "La bibliothèque d’Alexandrie faisait partie de quelle institution savante plus vaste ?", options: ["L’Académie", "Le Lycée", "Le Musée (Mouseîon)", "Le Portique"], explanation: "Le Mouseîon, institution de recherche consacrée aux Muses, abritait la bibliothèque et rémunérait des savants." },
  },
  'aq29': {
    de: { question: "Welcher hellenistische Gelehrte berechnete den Erdumfang mithilfe von Schatten in Alexandria und Syene?", options: ["Archimedes", "Eratosthenes", "Euklid", "Hipparchos"], explanation: "Eratosthenes’ geometrische Schätzung (~240 v. Chr.) kam dem wahren Wert bemerkenswert nahe." },
    fr: { question: "Quel savant hellénistique calcula la circonférence de la Terre à l’aide des ombres à Alexandrie et à Syène ?", options: ["Archimède", "Ératosthène", "Euclide", "Hipparque"], explanation: "L’estimation géométrique d’Ératosthène (v. 240 av. J.-C.) fut remarquablement proche de la valeur réelle." },
  },
  'aq30': {
    de: { question: "Die Schlacht bei den Thermopylen (480 v. Chr.) ist berühmt für den Widerstand König Leonidas’ und wie vieler Spartaner?", options: ["100", "300", "1 000", "10 000"], explanation: "Leonidas’ 300 Spartaner (mit mehreren Tausend Verbündeten) hielten den Pass drei Tage lang gegen die Invasion des Xerxes." },
    fr: { question: "La bataille des Thermopyles (480 av. J.-C.) est célèbre pour la résistance du roi Léonidas et de combien de Spartiates ?", options: ["100", "300", "1 000", "10 000"], explanation: "Les 300 Spartiates de Léonidas (avec plusieurs milliers d’alliés) tinrent le défilé trois jours durant contre l’invasion de Xerxès." },
  },
  'aq31': {
    de: { question: "Welches Bauwerk errichteten die Athener auf der Akropolis zu Ehren ihrer Schutzgöttin?", options: ["Das Pantheon", "Der Parthenon", "Das Erechtheion", "Der Zeustempel"], explanation: "Der Parthenon (447–432 v. Chr.) beherbergte Phidias’ kolossale Statue der Athena Parthenos." },
    fr: { question: "Quel édifice les Athéniens bâtirent-ils sur l’Acropole en l’honneur de leur déesse tutélaire ?", options: ["Le Panthéon", "Le Parthénon", "L’Érechthéion", "Le temple de Zeus"], explanation: "Le Parthénon (447–432 av. J.-C.) abritait la statue colossale d’Athéna Parthénos de Phidias." },
  },
  'aq32': {
    de: { question: "Roms erstes schriftliches Gesetzbuch, um 450 v. Chr. öffentlich ausgestellt, hieß …", options: ["Der Codex Justinianus", "Die Zwölftafelgesetze", "Das Mailänder Edikt", "Die Lex Julia"], explanation: "Die Zwölftafelgesetze hielten das Zivilrecht schriftlich fest, sodass patrizische Magistrate nicht länger nach ungeschriebenem Brauch richten konnten." },
    fr: { question: "Le premier code de lois écrit de Rome, affiché publiquement vers 450 av. J.-C., s’appelait…", options: ["Le Code de Justinien", "La Loi des Douze Tables", "L’édit de Milan", "La Lex Julia"], explanation: "La Loi des Douze Tables fixa le droit civil par écrit, afin que les magistrats patriciens ne puissent plus juger selon une coutume non écrite." },
  },
  'aq33': {
    de: { question: "Hannibals vernichtender Doppelumfassungssieg über Rom 216 v. Chr. fand statt bei …", options: ["Zama", "Trebia", "Trasimenischer See", "Cannae"], explanation: "Bei Cannae umzingelte und vernichtete Hannibal ein weit größeres römisches Heer — noch heute an Militärakademien studiert." },
    fr: { question: "L’écrasante victoire de Hannibal sur Rome par double enveloppement en 216 av. J.-C. eut lieu à…", options: ["Zama", "La Trébie", "Le lac Trasimène", "Cannes"], explanation: "À Cannes, Hannibal encercla et détruisit une armée romaine bien plus nombreuse — encore étudiée dans les académies militaires." },
  },
  'aq34': {
    de: { question: "Wer besiegte Hannibal 202 v. Chr. bei Zama und beendete damit den Zweiten Punischen Krieg?", options: ["Scipio Africanus", "Fabius Maximus", "Marius", "Pompeius"], explanation: "Publius Cornelius Scipio trug den Krieg nach Afrika und erwarb sich für den Sieg den Ehrennamen „Africanus“." },
    fr: { question: "Qui défit Hannibal à Zama en 202 av. J.-C., mettant fin à la deuxième guerre punique ?", options: ["Scipion l’Africain", "Fabius Maximus", "Marius", "Pompée"], explanation: "Publius Cornelius Scipion porta la guerre en Afrique et gagna le surnom d’« Africain » pour cette victoire." },
  },
  'aq35': {
    de: { question: "Das Erste Triumvirat bestand aus Cäsar, Pompeius und welchem reichen Römer?", options: ["Cicero", "Crassus", "Brutus", "Antonius"], explanation: "Marcus Licinius Crassus, der reichste Mann Roms, finanzierte das formlose Bündnis von 60 v. Chr." },
    fr: { question: "Le premier triumvirat était composé de César, de Pompée et de quel riche Romain ?", options: ["Cicéron", "Crassus", "Brutus", "Antoine"], explanation: "Marcus Licinius Crassus, l’homme le plus riche de Rome, finança l’alliance informelle de 60 av. J.-C." },
  },
  'aq36': {
    de: { question: "Octavian besiegte Antonius und Kleopatra 31 v. Chr. in der Seeschlacht bei …", options: ["Salamis", "Actium", "Mylae", "Naulochos"], explanation: "Actium machte Octavian zum Herrn der römischen Welt; vier Jahre später wurde er Augustus." },
    fr: { question: "Octave défit Antoine et Cléopâtre en 31 av. J.-C. lors de la bataille navale d’…", options: ["Salamine", "Actium", "Mylae", "Naulochos"], explanation: "Actium fit d’Octave le maître du monde romain ; il devint Auguste quatre ans plus tard." },
  },
  'aq37': {
    de: { question: "Welcher römische Kaiser errichtete eine gewaltige Schutzmauer quer durch den Norden Britanniens?", options: ["Trajan", "Hadrian", "Claudius", "Diokletian"], explanation: "Der Hadrianswall (begonnen 122 n. Chr.) markierte und kontrollierte fast drei Jahrhunderte lang die Nordgrenze des Reiches." },
    fr: { question: "Quel empereur romain fit construire un immense mur défensif à travers le nord de la Bretagne ?", options: ["Trajan", "Hadrien", "Claude", "Dioclétien"], explanation: "Le mur d’Hadrien (commencé en 122 apr. J.-C.) marqua et contrôla la frontière nord de l’empire pendant près de trois siècles." },
  },
  'aq38': {
    de: { question: "Das Römische Reich erreichte seine größte territoriale Ausdehnung unter welchem Kaiser?", options: ["Augustus", "Nero", "Trajan", "Konstantin"], explanation: "Trajans Eroberungen von Dakien und Mesopotamien (98–117 n. Chr.) brachten das Reich auf seine größte Ausdehnung." },
    fr: { question: "L’Empire romain atteignit sa plus grande extension territoriale sous quel empereur ?", options: ["Auguste", "Néron", "Trajan", "Constantin"], explanation: "Les conquêtes de la Dacie et de la Mésopotamie par Trajan (98–117 apr. J.-C.) portèrent l’empire à sa taille maximale." },
  },
  'aq39': {
    de: { question: "Kaiser Diokletian begegnete der Krise des 3. Jahrhunderts, indem er die kaiserliche Herrschaft auf vier Herrscher aufteilte — ein System namens …", options: ["Prinzipat", "Dominat", "Tetrarchie", "Konsulat"], explanation: "Die Tetrarchie (293 n. Chr.) teilte die Macht zwischen zwei ranghöheren Augusti und zwei rangniederen Caesares." },
    fr: { question: "L’empereur Dioclétien répondit à la crise du IIIᵉ siècle en partageant le pouvoir impérial entre quatre souverains, un système appelé…", options: ["Principat", "Dominat", "Tétrarchie", "Consulat"], explanation: "La Tétrarchie (293 apr. J.-C.) répartit l’autorité entre deux Augustes seniors et deux Césars juniors." },
  },
  'aq40': {
    de: { question: "Welche Stadt machte Konstantin 330 n. Chr. zur neuen Hauptstadt des Römischen Reiches?", options: ["Ravenna", "Antiochia", "Alexandria", "Byzanz (Konstantinopel)"], explanation: "Konstantin gründete die griechische Stadt Byzanz als Konstantinopel neu, das „Neue Rom“ am Bosporus." },
    fr: { question: "Quelle ville Constantin fit-il de la nouvelle capitale de l’Empire romain en 330 apr. J.-C. ?", options: ["Ravenne", "Antioche", "Alexandrie", "Byzance (Constantinople)"], explanation: "Constantin refonda la cité grecque de Byzance sous le nom de Constantinople, la « Nouvelle Rome » sur le Bosphore." },
  },
  'aq41': {
    de: { question: "Das babylonische Zahlensystem zur Basis 60 überlebt heute als Ursprung welcher zwei alltäglichen Maße?", options: ["Der 24-Stunden-Tag und die 7-Tage-Woche", "Die 60-Minuten-Stunde und der 360-Grad-Kreis", "Dezimalzahlen zur Basis 10 und Prozente", "Der 12-Monats-Kalender und der Tierkreis"], explanation: "Die mesopotamische Mathematik war sexagesimal (Basis 60) — der Ursprung unserer 60-Minuten-Stunde und des 360-Grad-Kreises, wie die Lektion anmerkt." },
    fr: { question: "Le système numérique babylonien en base 60 survit aujourd’hui comme origine de quelles deux mesures quotidiennes ?", options: ["Le jour de 24 heures et la semaine de 7 jours", "L’heure de 60 minutes et le cercle de 360 degrés", "Les décimales en base 10 et les pourcentages", "Le calendrier de 12 mois et le zodiaque"], explanation: "Les mathématiques mésopotamiennes étaient sexagésimales (base 60) — l’origine de notre heure de 60 minutes et du cercle de 360 degrés, comme le note la leçon." },
  },
  'aq42': {
    de: { question: "Warum gilt der ägyptische Edwin-Smith-Papyrus (~1600 v. Chr.) als so bemerkenswert?", options: ["Er ist die älteste vollständige Karte des menschlichen Körpers", "Er hält chirurgische Fälle durch klinische Beobachtung fest und vermerkt, dass Hirnverletzungen bestimmte Lähmungen verursachen", "Er ist ein rein magisches Zauberbuch ohne medizinischen Wert", "Er beschreibt die erste erfolgreiche Herztransplantation"], explanation: "Der Papyrus dokumentiert chirurgische Behandlungen mit klinischer Beobachtung und erkennt, dass Hirnverletzungen bestimmte Lähmungen hervorrufen — erstaunlich modern für seine Zeit." },
    fr: { question: "Pourquoi le papyrus égyptien Edwin Smith (v. 1600 av. J.-C.) est-il jugé si remarquable ?", options: ["C’est la plus ancienne carte complète du corps humain", "Il consigne des cas chirurgicaux par observation clinique, notant que les lésions cérébrales causent des paralysies précises", "C’est un grimoire purement magique sans valeur médicale", "Il décrit la première greffe de cœur réussie"], explanation: "Le papyrus documente des traitements chirurgicaux par observation clinique, reconnaissant que les lésions cérébrales produisent des paralysies précises — étonnamment moderne pour son époque." },
  },
  'aq43': {
    de: { question: "Die Säulen des Parthenon wölben sich in der Mitte leicht nach außen (eine Verfeinerung namens Entasis). Zu welchem Zweck?", options: ["Um Regenwasser in den Säulen zu speichern", "Um optische Täuschungen zu korrigieren, sodass die Säulen vollkommen gerade wirken", "Um das auf dem Dach lastende Gewicht zu verringern", "Um Rillen für Bemalung zu lassen"], explanation: "Die leichte Schwellung wirkt der Neigung des Auges entgegen, hohe gerade Säulen als konkav zu sehen, und erzeugt den Eindruck makelloser Geradheit." },
    fr: { question: "Les colonnes du Parthénon se renflent subtilement au milieu (un raffinement appelé entasis). Dans quel but ?", options: ["Pour stocker l’eau de pluie dans les colonnes", "Pour corriger les illusions d’optique afin que les colonnes paraissent parfaitement droites", "Pour réduire le poids reposant sur le toit", "Pour laisser des cannelures destinées au décor peint"], explanation: "Le léger renflement contrecarre la tendance de l’œil à voir concaves de hautes colonnes droites, créant l’impression d’une rectitude parfaite." },
  },
  'aq44': {
    de: { question: "Der Mechanismus von Antikythera, aus einem antiken Schiffswrack geborgen, zeigt, wie fortgeschritten die hellenistische Technik war. Was war er?", options: ["Eine römische Belagerungskatapult", "Ein bronzenes Zahnradgerät zur Vorhersage astronomischer Positionen und Finsternisse", "Ein phönizischer Magnetkompass", "Eine ägyptische Wasseruhr"], explanation: "Er war ein bronzener Zahnrad-„Computer“ zur Vorhersage von Finsternissen und Himmelspositionen — eine Technik, die jahrhundertelang nicht mehr erreicht wurde." },
    fr: { question: "La machine d’Anticythère, récupérée d’une épave antique, révèle combien l’ingénierie hellénistique était avancée. Qu’était-ce ?", options: ["Une catapulte de siège romaine", "Un dispositif de bronze à engrenages pour prédire positions astronomiques et éclipses", "Une boussole magnétique phénicienne", "Une clepsydre égyptienne"], explanation: "C’était un « ordinateur » de bronze à engrenages pour prédire éclipses et positions célestes — une ingénierie inégalée pendant bien des siècles." },
  },
  'aq45': {
    de: { question: "Das römische Recht wurde 529 n. Chr. in einer Sammlung systematisiert, die noch heute den Rechtssystemen Europas und Lateinamerikas zugrunde liegt. Welche ist es?", options: ["Die Zwölftafelgesetze", "Das Mailänder Edikt", "Justinians Corpus Juris Civilis", "Die Verfassung der Athener"], explanation: "Kaiser Justinians Corpus Juris Civilis (529 n. Chr.) kodifizierte das römische Recht; die Zwölftafelgesetze waren Roms weit früheres erstes Gesetzeswerk." },
    fr: { question: "Le droit romain fut systématisé en 529 apr. J.-C. dans une compilation qui sous-tend encore les systèmes juridiques d’Europe et d’Amérique latine. Laquelle ?", options: ["Les Douze Tables", "L’Édit de Milan", "Le Corpus Juris Civilis de Justinien", "La Constitution d’Athènes"], explanation: "Le Corpus Juris Civilis de l’empereur Justinien (529 apr. J.-C.) codifia le droit romain ; les Douze Tables étaient le tout premier code de lois de Rome, bien antérieur." },
  },
  'aq46': {
    de: { question: "Die Königsstraße Dareios’ I. ließ berittene Kuriere das Perserreich in etwa einer Woche durchqueren. Welche zwei Städte verband sie?", options: ["Babylon und Persepolis", "Sardes und Susa", "Memphis und Theben", "Athen und Sparta"], explanation: "Die 2.700 km lange Königsstraße lief von Sardes in Anatolien nach Susa — drei Monate Reise für gewöhnliche Reisende, eine Woche für königliche Kuriere." },
    fr: { question: "La Route royale de Darius Ier permettait aux courriers montés de traverser l’Empire perse en une semaine environ. Quelles deux villes reliait-elle ?", options: ["Babylone et Persépolis", "Sardes et Suse", "Memphis et Thèbes", "Athènes et Sparte"], explanation: "La Route royale de 2 700 km allait de Sardes en Anatolie à Suse — trois mois de voyage pour les voyageurs ordinaires, une semaine pour les courriers royaux." },
  },
  'aq47': {
    de: { question: "In der ägyptischen Halle der zwei Wahrheiten wog der Gott Anubis das Herz des Verstorbenen gegen was — und was geschah mit einem schweren Herzen?", options: ["Gegen eine Goldmünze; ein schweres Herz wurde als König wiedergeboren", "Gegen die Feder der Maat; ein schweres Herz wurde vom Ungeheuer Ammit verschlungen", "Gegen die Sonnenscheibe des Re; ein schweres Herz wurde zum Stern", "Gegen eine Lotosblüte; ein schweres Herz wurde erneut mumifiziert"], explanation: "Ein Herz schwerer als die Feder der Maat (Wahrheit) wurde von Ammit gefressen; ein federleichtes Herz gelangte ins Binsengefilde." },
    fr: { question: "Dans la salle des Deux Vérités égyptienne, le dieu Anubis pesait le cœur du défunt contre quoi — et qu’advenait-il d’un cœur lourd ?", options: ["Contre une pièce d’or ; un cœur lourd renaissait roi", "Contre la plume de Maât ; un cœur lourd était dévoré par le monstre Ammit", "Contre le disque solaire de Rê ; un cœur lourd devenait étoile", "Contre une fleur de lotus ; un cœur lourd était momifié à nouveau"], explanation: "Un cœur plus lourd que la plume de Maât (la vérité) était dévoré par Ammit ; un cœur aussi léger que la plume gagnait le Champ des roseaux." },
  },
  'aq48': {
    de: { question: "Das phönizische Schriftsystem (~1050 v. Chr.), Vorfahr jedes westlichen Alphabets, bestand aus …", options: ["30 Bildzeichen", "22 Konsonanten ohne Vokale — die Griechen fügten später die Vokale hinzu", "einer Silbenschrift von rund 200 Zeichen", "keilförmigen Keilschriftzeichen"], explanation: "Das 22-Konsonanten-Alphabet der Phönizier ließ sich in Wochen erlernen; die Griechen übernahmen es und fügten Vokale hinzu, wodurch der Vorfahr der lateinischen Schrift entstand." },
    fr: { question: "Le système d’écriture phénicien (~1050 av. J.-C.), ancêtre de tout alphabet occidental, se composait de…", options: ["30 symboles pictographiques", "22 consonnes sans voyelles — les Grecs ajoutèrent ensuite les voyelles", "un syllabaire d’environ 200 signes", "des signes cunéiformes en forme de coin"], explanation: "L’alphabet phénicien de 22 consonnes pouvait s’apprendre en quelques semaines ; les Grecs l’adoptèrent et y ajoutèrent des voyelles, créant l’ancêtre de l’écriture latine." },
  },
  'aq49': {
    de: { question: "In welcher Schlacht von 338 v. Chr. zerschlug Philipp II. von Makedonien die vereinten Heere Athens und Thebens, während sein 18-jähriger Sohn Alexander den entscheidenden Kavallerieangriff führte?", options: ["Gaugamela", "Chaironeia", "Issos", "Thermopylen"], explanation: "Chaironeia (338 v. Chr.) beendete die griechische Unabhängigkeit und zwang die Poleis in Philipps Korinthischen Bund; Alexander führte die Reiterei, die die thebanische Linie durchbrach." },
    fr: { question: "À quelle bataille de 338 av. J.-C. Philippe II de Macédoine écrasa-t-il les armées réunies d’Athènes et de Thèbes, son fils Alexandre, 18 ans, menant la charge de cavalerie décisive ?", options: ["Gaugamèles", "Chéronée", "Issos", "Thermopyles"], explanation: "Chéronée (338 av. J.-C.) mit fin à l’indépendance grecque et força les cités dans la Ligue de Corinthe de Philippe ; Alexandre mena la cavalerie qui brisa la ligne thébaine." },
  },
  'aq50': {
    de: { question: "Das persische Elitekorps, das die Griechen die „Unsterblichen“ nannten, trug diesen Namen aus welchem Grund?", options: ["Sie trugen eine Rüstung, die als unbesiegbar galt", "Ihre Stärke wurde stets bei genau 10.000 gehalten — jeder Gefallene sofort ersetzt", "Man hielt sie für auferstandene Priester", "Sie hatten geschworen, in der Schlacht nie zurückzuweichen"], explanation: "Das Korps wurde bei genau 10.000 Mann gehalten; jeder Verlust wurde sofort ersetzt, sodass seine Zahl nie zu sinken schien — daher „Unsterbliche“." },
    fr: { question: "Le corps d’élite perse que les Grecs appelaient les « Immortels » doit ce nom à quelle raison ?", options: ["Ils portaient une armure réputée invincible", "Leur effectif était toujours maintenu à exactement 10 000 — chaque homme tombé aussitôt remplacé", "On les croyait des prêtres ressuscités", "Ils avaient juré de ne jamais reculer au combat"], explanation: "Le corps était maintenu à exactement 10 000 hommes ; toute perte était aussitôt comblée, si bien que son effectif ne semblait jamais diminuer — d’où « Immortels »." },
  },
  'mq1': {
    de: { question: "In welchem Jahr verlor der letzte weströmische Kaiser die Macht, was den Untergang des Weströmischen Reiches markiert?", options: ["410 n. Chr.", "455 n. Chr.", "476 n. Chr.", "500 n. Chr."], explanation: "476 n. Chr. setzte der germanische Heerführer Odoaker Romulus Augustulus ab — das herkömmliche Enddatum des Weströmischen Reiches." },
    fr: { question: "En quelle année le dernier empereur romain d’Occident perdit-il le pouvoir, marquant la chute de l’Empire romain d’Occident ?", options: ["410 apr. J.-C.", "455 apr. J.-C.", "476 apr. J.-C.", "500 apr. J.-C."], explanation: "En 476 apr. J.-C., le chef germain Odoacre déposa Romulus Augustule — la date conventionnelle de la fin de l’Empire romain d’Occident." },
  },
  'mq2': {
    de: { question: "An welchem Tag wurde Karl der Große von Papst Leo III. zum „Kaiser der Römer“ gekrönt?", options: ["Ostersonntag 799", "Weihnachtstag 800", "Neujahrstag 801", "Karfreitag 802"], explanation: "Am Weihnachtstag 800 n. Chr. im Petersdom in Rom. Die unerwartete Krönung soll Karl den Großen überrascht haben." },
    fr: { question: "À quelle date Charlemagne fut-il couronné « empereur des Romains » par le pape Léon III ?", options: ["Dimanche de Pâques 799", "Jour de Noël 800", "Jour de l’an 801", "Vendredi saint 802"], explanation: "Le jour de Noël 800 apr. J.-C., dans la basilique Saint-Pierre de Rome. Le couronnement inattendu aurait surpris Charlemagne." },
  },
  'mq3': {
    de: { question: "Das Feudalsystem gliederte die Gesellschaft vor allem um welche Beziehung?", options: ["Handel und Gewerbe", "Landbesitz und Kriegsdienst", "Kirchliche Autorität und Mönche", "Stammesverwandtschaft"], explanation: "Der Feudalismus beruhte darauf, dass Lehnsherren Land (Lehen) an Vasallen im Austausch gegen Kriegsdienst und Treue vergaben." },
    fr: { question: "Le système féodal organisait la société principalement autour de quelle relation ?", options: ["Le commerce et l’artisanat", "La propriété foncière et le service militaire", "L’autorité de l’Église et les moines", "La parenté tribale"], explanation: "La féodalité reposait sur des seigneurs octroyant des terres (fiefs) à des vassaux en échange du service militaire et de la fidélité." },
  },
  'mq4': {
    de: { question: "Der Erste Kreuzzug wurde von Papst Urban II. in welchem Jahr ausgerufen?", options: ["1054", "1095", "1099", "1147"], explanation: "1095 in Clermont rief Papst Urban II. christliche Krieger auf, Jerusalem von den Seldschuken zurückzuerobern." },
    fr: { question: "La première croisade fut prêchée par le pape Urbain II en quelle année ?", options: ["1054", "1095", "1099", "1147"], explanation: "En 1095 à Clermont, le pape Urbain II appela les guerriers chrétiens à reprendre Jérusalem aux Turcs seldjoukides." },
  },
  'mq5': {
    de: { question: "Saladin, der 1187 Jerusalem zurückeroberte, war Sultan welcher Region?", options: ["Persien", "Türkei", "Ägypten und Syrien", "Bagdad"], explanation: "Saladin war der kurdische Begründer der Ayyubiden-Dynastie, Herrscher über Ägypten und Syrien. Seine Ritterlichkeit wurde selbst von Kreuzfahrern geachtet." },
    fr: { question: "Saladin, qui reprit Jérusalem en 1187, était sultan de quelle région ?", options: ["Perse", "Turquie", "Égypte et Syrie", "Bagdad"], explanation: "Saladin était le fondateur kurde de la dynastie ayyoubide, maître de l’Égypte et de la Syrie. Sa chevalerie était respectée même des croisés." },
  },
  'mq6': {
    de: { question: "Der Schwarze Tod tötete schätzungsweise welchen Anteil der Bevölkerung Europas zwischen 1347 und 1353?", options: ["Ein Zehntel", "Ein Viertel", "Ein Drittel bis die Hälfte", "Zwei Drittel"], explanation: "Die Schätzungen reichen von 30–60 % der Bevölkerung Europas. Manche Städte wie Florenz verloren über die Hälfte ihrer Einwohner." },
    fr: { question: "La peste noire aurait tué quelle fraction de la population de l’Europe entre 1347 et 1353 ?", options: ["Un dixième", "Un quart", "Un tiers à la moitié", "Deux tiers"], explanation: "Les estimations vont de 30 à 60 % de la population de l’Europe. Certaines villes, comme Florence, perdirent plus de la moitié de leurs habitants." },
  },
  'mq7': {
    de: { question: "Welches englische Dokument (1215) legte fest, dass der König der Herrschaft des Rechts unterworfen war?", options: ["Domesday Book", "Magna Carta", "Bill of Rights", "Common-Law-Kodex"], explanation: "Die Magna Carta („Große Urkunde“) wurde König Johann von aufständischen Baronen abgerungen und legte fest, dass selbst der König dem Recht folgen muss." },
    fr: { question: "Quel document anglais (1215) établit que le roi était soumis à l’autorité de la loi ?", options: ["Le Domesday Book", "La Grande Charte (Magna Carta)", "Le Bill of Rights", "Le Code de common law"], explanation: "La Magna Carta (« Grande Charte ») fut imposée au roi Jean par des barons révoltés, établissant que même le roi doit se soumettre à la loi." },
  },
  'mq8': {
    de: { question: "Was war die vorherrschende Sprache der Gelehrsamkeit und der katholischen Kirche im gesamten Mittelalter?", options: ["Griechisch", "Französisch", "Arabisch", "Latein"], explanation: "Latein war die universelle Sprache der gebildeten Europäer, ermöglichte Gelehrten aus verschiedenen Ländern die Verständigung und bewahrte antike Texte." },
    fr: { question: "Quelle était la principale langue du savoir et de l’Église catholique tout au long du Moyen Âge ?", options: ["Le grec", "Le français", "L’arabe", "Le latin"], explanation: "Le latin était la langue universelle des Européens instruits, permettant aux savants de différents pays de communiquer et préservant les textes antiques." },
  },
  'mq9': {
    de: { question: "Das islamische Goldene Zeitalter war unter dem Abbasiden-Kalifat vor allem auf welche Stadt zentriert?", options: ["Kairo", "Córdoba", "Bagdad", "Istanbul"], explanation: "Das Haus der Weisheit in Bagdad war vom 8. bis 13. Jahrhundert das größte Zentrum der Gelehrsamkeit der Welt und versammelte Gelehrte aus der ganzen bekannten Welt." },
    fr: { question: "L’âge d’or islamique était principalement centré sur quelle ville sous le califat abbasside ?", options: ["Le Caire", "Cordoue", "Bagdad", "Istanbul"], explanation: "La Maison de la sagesse de Bagdad fut le plus grand centre du savoir du monde du VIIIᵉ au XIIIᵉ siècle, rassemblant des savants de tout le monde connu." },
  },
  'mq10': {
    de: { question: "Das Mongolenreich war auf seinem Höhepunkt das größte zusammenhängende Landreich der Geschichte. Wer gründete es?", options: ["Kublai Khan", "Timur", "Dschingis Khan", "Ögedei Khan"], explanation: "Dschingis Khan einte 1206 die mongolischen Stämme und begann die Eroberungen, die sich schließlich von Korea bis Ungarn erstreckten." },
    fr: { question: "L’Empire mongol, à son apogée, fut le plus grand empire terrestre d’un seul tenant de l’histoire. Qui le fonda ?", options: ["Kubilai Khan", "Tamerlan", "Gengis Khan", "Ögödei Khan"], explanation: "Gengis Khan unifia les tribus mongoles en 1206 et entama les conquêtes qui s’étendirent finalement de la Corée à la Hongrie." },
  },
  'mq11': {
    de: { question: "Das Große Schisma von 1054 spaltete das Christentum dauerhaft in welche zwei Hauptzweige?", options: ["Katholisch und anglikanisch", "Katholisch und protestantisch", "Römisch-katholisch und orthodox", "Koptisch und römisch-katholisch"], explanation: "Das Große Schisma spaltete die christliche Kirche in die römisch-katholische Kirche (unter dem Papst in Rom) und die orthodoxe Kirche (unter dem Patriarchen von Konstantinopel) — eine Trennung, die bis heute besteht." },
    fr: { question: "Le grand schisme de 1054 divisa définitivement le christianisme en quelles deux grandes branches ?", options: ["Catholique et anglicane", "Catholique et protestante", "Catholique romaine et orthodoxe", "Copte et catholique romaine"], explanation: "Le grand schisme scinda l’Église chrétienne en Église catholique romaine (sous le pape à Rome) et Église orthodoxe (sous le patriarche de Constantinople) — une division qui persiste aujourd’hui." },
  },
  'mq12': {
    de: { question: "Thomas von Aquins „Summa Theologica“ (1265–1274) war ein bahnbrechender Versuch, welche zwei geistigen Traditionen zu versöhnen?", options: ["Christliche Theologie und platonische Philosophie", "Christliche Theologie und aristotelische Philosophie", "Islamische Philosophie und christliche Theologie", "Antikes römisches Recht und christliche Ethik"], explanation: "Aquin verband aristotelische Logik und Philosophie mit der christlichen Lehre und argumentierte, Glaube und Vernunft seien einander ergänzend statt widersprüchlich — ein Grundlagentext der Scholastik." },
    fr: { question: "La « Somme théologique » de Thomas d’Aquin (1265–1274) fut une tentative marquante de concilier quelles deux traditions intellectuelles ?", options: ["Théologie chrétienne et philosophie platonicienne", "Théologie chrétienne et philosophie aristotélicienne", "Philosophie islamique et théologie chrétienne", "Droit romain antique et éthique chrétienne"], explanation: "Thomas d’Aquin fondit la logique et la philosophie aristotéliciennes avec la doctrine chrétienne, soutenant que la foi et la raison étaient complémentaires plutôt que contradictoires — un texte fondateur de la scolastique." },
  },
  'mq13': {
    de: { question: "Welche mittelalterliche technische Entwicklung veränderte die Burgenkriegsführung grundlegend, indem sie dicke Steinmauern weit weniger verteidigungsfähig machte?", options: ["Der Langbogen", "Die Armbrust", "Schießpulverartillerie und Kanone", "Griechisches Feuer"], explanation: "Kanonenfeuer konnte Steinmauern durchbrechen, die Heeren jahrhundertelang standgehalten hatten. Im 15. Jahrhundert machte die Schießpulverartillerie die traditionellen mittelalterlichen Befestigungen überflüssig und verwandelte die Militärarchitektur." },
    fr: { question: "Quel progrès technique médiéval transforma fondamentalement la guerre de siège en rendant les épaisses murailles de pierre bien moins défendables ?", options: ["L’arc long", "L’arbalète", "L’artillerie à poudre et le canon", "Le feu grégeois"], explanation: "Le tir au canon pouvait percer des murailles de pierre qui avaient résisté aux armées pendant des siècles. Au XVᵉ siècle, l’artillerie à poudre rendit obsolètes les fortifications médiévales traditionnelles, transformant l’architecture militaire." },
  },
  'mq14': {
    de: { question: "Jeanne d’Arcs Feldzug, der die Wende im Hundertjährigen Krieg brachte, begann 1429 mit dem Entsatz welcher belagerten französischen Stadt?", options: ["Paris", "Rouen", "Calais", "Orléans"], explanation: "Jeanne führte die französischen Truppen im Mai 1429 dazu, die englische Belagerung von Orléans aufzuheben — ihre gefeiertste militärische Leistung. Dieser Sieg wandelte die französische Moral und begann die englische Vorherrschaft umzukehren." },
    fr: { question: "La campagne militaire de Jeanne d’Arc, qui renversa le cours de la guerre de Cent Ans, débuta en 1429 par la levée du siège de quelle ville française ?", options: ["Paris", "Rouen", "Calais", "Orléans"], explanation: "Jeanne mena les forces françaises à lever le siège anglais d’Orléans en mai 1429, son fait d’armes le plus célèbre. Cette victoire transforma le moral français et amorça le renversement de la domination anglaise." },
  },
  'mq15': {
    de: { question: "Welche italienische Stadtstaatenfamilie wurde zur beherrschenden Bankmacht des mittelalterlichen Europas und finanzierte Päpste, Könige und die Renaissance?", options: ["Die Sforza in Mailand", "Die Medici in Florenz", "Die Dogen von Venedig", "Die Borgia in Rom"], explanation: "Die Familie Medici in Florenz betrieb die größte Bank im Europa des 15. Jahrhunderts, mit Niederlassungen auf dem ganzen Kontinent. Ihr Reichtum finanzierte die Kunst und Gelehrsamkeit der Renaissance und machte Florenz zur Kulturhauptstadt Europas." },
    fr: { question: "Quelle famille de cité-État italienne devint la puissance bancaire dominante de l’Europe médiévale, finançant papes, rois et la Renaissance ?", options: ["Les Sforza de Milan", "Les Médicis de Florence", "Les doges de Venise", "Les Borgia de Rome"], explanation: "La famille Médicis de Florence exploita la plus grande banque de l’Europe du XVᵉ siècle, avec des succursales sur tout le continent. Sa richesse finança l’art et le savoir de la Renaissance, faisant de Florence la capitale culturelle de l’Europe." },
  },
  'mq16': {
    de: { question: "Welcher byzantinische Kaiser kodifizierte das römische Recht und errichtete die Hagia Sophia?", options: ["Konstantin XI.", "Justinian I.", "Basileios II.", "Herakleios"], explanation: "Justinian I. (reg. 527–565) schuf das Corpus Juris Civilis und ließ die Hagia Sophia nach dem Nika-Aufstand neu errichten." },
    fr: { question: "Quel empereur byzantin codifia le droit romain et fit construire Sainte-Sophie ?", options: ["Constantin XI", "Justinien Iᵉʳ", "Basile II", "Héraclius"], explanation: "Justinien Iᵉʳ (r. 527–565) produisit le Corpus Juris Civilis et reconstruisit Sainte-Sophie après les émeutes Nika." },
  },
  'mq17': {
    de: { question: "In welchem Jahr fiel Konstantinopel schließlich an die osmanischen Türken?", options: ["1204", "1389", "1453", "1492"], explanation: "Mehmed II. nahm die Stadt im Mai 1453 ein und beendete damit das tausendjährige Byzantinische Reich." },
    fr: { question: "En quelle année Constantinople tomba-t-elle finalement aux mains des Turcs ottomans ?", options: ["1204", "1389", "1453", "1492"], explanation: "Mehmed II prit la ville en mai 1453, mettant fin à l’Empire byzantin millénaire." },
  },
  'mq18': {
    de: { question: "Der islamische Kalender beginnt mit der Hidschra — Mohammeds Auswanderung 622 n. Chr. von Mekka nach …", options: ["Jerusalem", "Damaskus", "Medina", "Bagdad"], explanation: "Der Zug nach Medina (damals Yathrib) markiert das Jahr eins des islamischen Kalenders." },
    fr: { question: "Le calendrier islamique commence avec l’Hégire — la migration de Mahomet en 622 apr. J.-C. de La Mecque vers…", options: ["Jérusalem", "Damas", "Médine", "Bagdad"], explanation: "Le départ vers Médine (alors Yathrib) marque l’an un du calendrier islamique." },
  },
  'mq19': {
    de: { question: "Welcher muslimische Feldherr leitete 711 n. Chr. die Invasion der Iberischen Halbinsel?", options: ["Saladin", "Tariq ibn Ziyad", "Abd ar-Rahman I.", "Musa ibn Nusayr"], explanation: "Tariq setzte von Nordafrika an dem später nach ihm benannten Felsen über — Dschabal Tariq, Gibraltar." },
    fr: { question: "Quel commandant musulman mena l’invasion de la péninsule Ibérique en 711 apr. J.-C. ?", options: ["Saladin", "Tariq ibn Ziyad", "Abd al-Rahman Iᵉʳ", "Moussa ibn Noussaïr"], explanation: "Tariq traversa depuis l’Afrique du Nord au rocher plus tard nommé d’après lui — Jabal Tariq, Gibraltar." },
  },
  'mq20': {
    de: { question: "Das Umayyaden-Kalifat von Córdoba war im 10. Jahrhundert berühmt für …", options: ["die Zerstörung klassischen Wissens", "seine Bibliotheken, Gelehrsamkeit und relative religiöse Koexistenz", "die Abschottung Iberiens vom Handel", "die Eroberung Frankreichs"], explanation: "Córdoba gehörte zu den größten Städten Europas, mit riesigen Bibliotheken und einer Kultur der Convivencia zwischen den Glaubensrichtungen." },
    fr: { question: "Le califat omeyyade de Cordoue était renommé au Xᵉ siècle pour…", options: ["la destruction du savoir classique", "ses bibliothèques, son érudition et une coexistence religieuse relative", "l’isolement de l’Ibérie du commerce", "la conquête de la France"], explanation: "Cordoue comptait parmi les plus grandes villes d’Europe, avec de vastes bibliothèques et une culture de convivencia entre les fois." },
  },
  'mq21': {
    de: { question: "Die Schlacht von Tours (732 n. Chr.), die den Vormarsch der Umayyaden nach Francia stoppte, wurde gewonnen von …", options: ["Karl dem Großen", "Karl Martell", "Pippin dem Jüngeren", "Chlodwig"], explanation: "Karl Martell („der Hammer“), Großvater Karls des Großen, besiegte das Beuteheer nahe Tours und Poitiers." },
    fr: { question: "La bataille de Tours (732 apr. J.-C.), qui arrêta l’avancée omeyyade en Francie, fut remportée par…", options: ["Charlemagne", "Charles Martel", "Pépin le Bref", "Clovis"], explanation: "Charles Martel (« le Marteau »), grand-père de Charlemagne, défit l’armée de razzia près de Tours et de Poitiers." },
  },
  'mq22': {
    de: { question: "Die Reconquista endete 1492 mit der Kapitulation welches letzten muslimischen Staates auf der Iberischen Halbinsel?", options: ["Das Kalifat von Córdoba", "Das Almohaden-Reich", "Das Emirat von Granada", "Die Taifa von Sevilla"], explanation: "Granada kapitulierte im Januar 1492 nach einem zehnjährigen Krieg vor Ferdinand und Isabella." },
    fr: { question: "La Reconquista s’acheva en 1492 avec la reddition de quel dernier État musulman d’Ibérie ?", options: ["Le califat de Cordoue", "L’Empire almohade", "L’émirat de Grenade", "La taïfa de Séville"], explanation: "Grenade capitula devant Ferdinand et Isabelle en janvier 1492, après une guerre de dix ans." },
  },
  'mq23': {
    de: { question: "Die Übersetzerbewegung von Toledo war historisch bedeutsam, weil sie …", options: ["die Bibel ins Spanische übersetzte", "arabisches und griechisches Wissen für Europa ins Lateinische übertrug", "die kastilische Rechtschreibung vereinheitlichte", "das westgotische Recht bewahrte"], explanation: "Mehrsprachige Teams im zurückeroberten Toledo übersetzten Aristoteles, Avicenna und arabische Mathematik und speisten damit Europas Universitäten." },
    fr: { question: "Le mouvement de traduction de Tolède fut historiquement important parce qu’il…", options: ["traduisit la Bible en espagnol", "transposa en latin le savoir arabe et grec pour l’Europe", "normalisa l’orthographe castillane", "préserva le droit wisigoth"], explanation: "Des équipes multilingues dans la Tolède reconquise traduisirent Aristote, Avicenne et les mathématiques arabes, alimentant les universités d’Europe." },
  },
  'mq24': {
    de: { question: "Der Hundertjährige Krieg (1337–1453) wurde vor allem zwischen welchen beiden Königreichen ausgetragen?", options: ["England und Frankreich", "Frankreich und das Heilige Römische Reich", "England und Schottland", "Kastilien und Aragón"], explanation: "Der Anspruch der Plantagenets auf die französische Krone entfachte mehr als ein Jahrhundert unterbrochenen Krieges." },
    fr: { question: "La guerre de Cent Ans (1337–1453) opposa surtout quels deux royaumes ?", options: ["L’Angleterre et la France", "La France et le Saint-Empire", "L’Angleterre et l’Écosse", "La Castille et l’Aragon"], explanation: "La prétention des Plantagenêts à la couronne de France alluma plus d’un siècle de guerre intermittente." },
  },
  'mq25': {
    de: { question: "Die englischen Siege bei Crécy und Azincourt verdankten sich zu einem großen Teil welcher Waffe?", options: ["Der Armbrust", "Der Pike", "Dem Langbogen", "Frühen Musketen"], explanation: "Massierte walisische und englische Langbogenschützen konnten Pfeile weit schneller abschießen als Armbrüste und zerfetzten die französischen Reiterangriffe." },
    fr: { question: "Les victoires anglaises de Crécy et d’Azincourt devaient beaucoup à quelle arme ?", options: ["L’arbalète", "La pique", "L’arc long", "Les premiers mousquets"], explanation: "Les archers gallois et anglais massés pouvaient décocher des flèches bien plus vite que les arbalètes, déchiquetant les charges de cavalerie française." },
  },
  'mq26': {
    de: { question: "Welches Schicksal ereilte Jeanne d’Arc 1431?", options: ["Sie fiel in der Schlacht", "Sie wurde zur Regentin gekrönt", "Sie wurde nach einem von England betriebenen Prozess auf dem Scheiterhaufen verbrannt", "Sie zog sich in ein Kloster zurück"], explanation: "Gefangen genommen und an die Engländer verkauft, wurde Jeanne in Rouen wegen Ketzerei verurteilt; ein postumer Wiederaufnahmeprozess sprach sie 1456 frei." },
    fr: { question: "Quel sort connut Jeanne d’Arc en 1431 ?", options: ["Elle mourut au combat", "Elle fut couronnée régente", "Elle fut brûlée vive après un procès soutenu par les Anglais", "Elle se retira dans un couvent"], explanation: "Capturée et vendue aux Anglais, Jeanne fut condamnée pour hérésie à Rouen ; un procès en révision posthume la réhabilita en 1456." },
  },
  'mq27': {
    de: { question: "Welche Schlacht von 1066 verschaffte Wilhelm von der Normandie die englische Krone?", options: ["Stamford Bridge", "Hastings", "Fulford", "Maldon"], explanation: "Harold II. fiel bei Hastings, wenige Wochen nachdem er eine norwegische Invasion bei Stamford Bridge besiegt hatte." },
    fr: { question: "Quelle bataille de 1066 donna la couronne d’Angleterre à Guillaume de Normandie ?", options: ["Stamford Bridge", "Hastings", "Fulford", "Maldon"], explanation: "Harold II tomba à Hastings, quelques semaines après avoir vaincu une invasion norvégienne à Stamford Bridge." },
  },
  'mq28': {
    de: { question: "Das Domesday Book, 1086 verfasst, war …", options: ["eine religiöse Chronik", "eine Erfassung des englischen Grundbesitzes zur Besteuerung", "ein Kodex der Ritterlichkeit", "eine Karte normannischer Burgen"], explanation: "Wilhelms I. große Erhebung verzeichnete, wer welches Land besaß und was es wert war — für Historiker von unschätzbarem Wert." },
    fr: { question: "Le Domesday Book, compilé en 1086, était…", options: ["une chronique religieuse", "un recensement des propriétés foncières anglaises à des fins fiscales", "un code de chevalerie", "une carte des châteaux normands"], explanation: "Le grand recensement de Guillaume Iᵉʳ nota qui possédait quelle terre et sa valeur — inestimable pour les historiens." },
  },
  'mq29': {
    de: { question: "Welcher Kreuzzug wurde umgeleitet, um 1204 Konstantinopel zu plündern?", options: ["Der Erste", "Der Zweite", "Der Dritte", "Der Vierte"], explanation: "Venezianische Schulden und dynastische Ränke wandten den Vierten Kreuzzug gegen die christlich-byzantinische Hauptstadt." },
    fr: { question: "Quelle croisade fut détournée pour mettre à sac Constantinople en 1204 ?", options: ["La première", "La deuxième", "La troisième", "La quatrième"], explanation: "Des dettes vénitiennes et des intrigues dynastiques retournèrent la quatrième croisade contre la capitale byzantine chrétienne." },
  },
  'mq30': {
    de: { question: "Richard Löwenherz’ Gegner während des Dritten Kreuzzugs war …", options: ["Baibars", "Saladin", "Nur ad-Din", "Zengi"], explanation: "Ihre Feldzüge endeten in einem Waffenstillstand (1192), der Pilgern den Zugang zu Jerusalem unter muslimischer Herrschaft sicherte." },
    fr: { question: "L’adversaire de Richard Cœur de Lion pendant la troisième croisade était…", options: ["Baybars", "Saladin", "Nur ad-Din", "Zengi"], explanation: "Leurs campagnes s’achevèrent par une trêve (1192) garantissant l’accès des pèlerins à Jérusalem sous domination musulmane." },
  },
  'mq31': {
    de: { question: "Das Haus der Weisheit in Bagdad war vor allem ein Zentrum für …", options: ["militärische Ausbildung", "Übersetzung und wissenschaftliche Gelehrsamkeit", "religiöse Wallfahrt", "Seidenproduktion"], explanation: "Unter den Abbasiden versammelte es griechische, persische und indische Texte; Gelehrte wie al-Chwarizmi wirkten dort." },
    fr: { question: "La Maison de la sagesse de Bagdad était surtout un centre de…", options: ["formation militaire", "traduction et de recherche scientifique", "pèlerinage religieux", "production de soie"], explanation: "Sous les Abbassides, elle rassembla des textes grecs, perses et indiens ; des savants comme al-Khwarizmi y travaillèrent." },
  },
  'mq32': {
    de: { question: "Das Wort „Algebra“ leitet sich vom Werk welches Gelehrten ab?", options: ["Avicenna (Ibn Sina)", "Al-Chwarizmi", "Averroes (Ibn Ruschd)", "Al-Razi"], explanation: "Al-Chwarizmis Abhandlung „al-Dschabr“ gab der Algebra ihren Namen; „Algorithmus“ leitet sich von seinem eigenen ab." },
    fr: { question: "Le mot « algèbre » dérive de l’œuvre de quel savant ?", options: ["Avicenne (Ibn Sina)", "Al-Khwarizmi", "Averroès (Ibn Rushd)", "Al-Razi"], explanation: "Le traité « al-Jabr » d’al-Khwarizmi donna son nom à l’algèbre ; « algorithme » vient du sien." },
  },
  'mq33': {
    de: { question: "Dschingis Khans Reich wurde nach seinem Tod in Khanate geteilt; welches herrschte über Russland?", options: ["Das Ilchanat", "Das Tschagatai-Khanat", "Die Goldene Horde", "Das Yuan"], explanation: "Die Goldene Horde erhob über zwei Jahrhunderte lang Tribut von den russischen Fürstentümern." },
    fr: { question: "L’empire de Gengis Khan fut divisé après sa mort en khanats ; lequel domina la Russie ?", options: ["L’Ilkhanat", "Le khanat de Djaghataï", "La Horde d’or", "Les Yuan"], explanation: "La Horde d’or exigea un tribut des principautés russes pendant plus de deux siècles." },
  },
  'mq34': {
    de: { question: "Kublai Khan gründete welche Dynastie in China?", options: ["Ming", "Song", "Yuan", "Tang"], explanation: "Kublai vollendete die Eroberung des Song-China und herrschte als Yuan-Kaiser von Khanbaliq (Peking) aus." },
    fr: { question: "Kubilai Khan fonda quelle dynastie en Chine ?", options: ["Ming", "Song", "Yuan", "Tang"], explanation: "Kubilai acheva la conquête de la Chine des Song et régna comme empereur Yuan depuis Khanbaliq (Pékin)." },
  },
  'mq35': {
    de: { question: "Der Bericht welches venezianischen Kaufmanns über seine Reisen an den Hof Kublai Khans faszinierte Europa?", options: ["Ibn Battuta", "Marco Polo", "Johannes de Plano Carpini", "Wilhelm von Rubruk"], explanation: "Marco Polos „Reisen“ (um 1298 diktiert) prägten Jahrhunderte lang die europäischen Vorstellungen von Asien." },
    fr: { question: "Le récit de quel marchand vénitien sur ses voyages à la cour de Kubilai Khan fascina l’Europe ?", options: ["Ibn Battuta", "Marco Polo", "Jean de Plan Carpin", "Guillaume de Rubrouck"], explanation: "Le « Livre des merveilles » de Marco Polo (dicté v. 1298) façonna les idées européennes sur l’Asie pendant des siècles." },
  },
  'mq36': {
    de: { question: "Der Schwarze Tod erreichte Europa 1347 an Bord von Schiffen, die aus welcher Region eintrafen?", options: ["Der Schwarzmeerhafen Kaffa", "Ägypten", "Indien", "Marokko"], explanation: "Genueser Galeeren, die vor der Belagerung von Kaffa auf der Krim flohen, trugen pestverseuchte Ratten nach Sizilien." },
    fr: { question: "La peste noire atteignit l’Europe en 1347 à bord de navires arrivant de quelle région ?", options: ["Le port de Caffa, sur la mer Noire", "L’Égypte", "L’Inde", "Le Maroc"], explanation: "Des galères génoises fuyant le siège de Caffa en Crimée transportèrent en Sicile des rats infectés par la peste." },
  },
  'mq37': {
    de: { question: "Eine wichtige wirtschaftliche Folge des Schwarzen Todes in Westeuropa war …", options: ["fallende Löhne", "ein Anstieg der Leibeigenschaft", "steigende Löhne und größere Verhandlungsmacht der Bauern", "das Ende der Handelsmessen"], explanation: "Der Arbeitskräftemangel ließ die Überlebenden bessere Bedingungen fordern und lockerte im Westen den Griff der Leibeigenschaft." },
    fr: { question: "Un effet économique majeur de la peste noire en Europe occidentale fut…", options: ["la baisse des salaires", "un essor du servage", "la hausse des salaires et le pouvoir de négociation des paysans", "la fin des foires commerciales"], explanation: "La pénurie de main-d’œuvre permit aux survivants d’exiger de meilleures conditions, desserrant l’étreinte du servage en Occident." },
  },
  'mq38': {
    de: { question: "Welche japanische Kriegerregierung, 1192 gegründet, legte die wirkliche Macht in die Hände des Shoguns statt des Kaisers?", options: ["Das Kamakura-Shogunat", "Das Tokugawa-Shogunat", "Das Ashikaga-Shogunat", "Der Heian-Hof"], explanation: "Minamoto no Yoritomos Kamakura-Bakufu begann fast 700 Jahre Samurai-Herrschaft." },
    fr: { question: "Quel gouvernement guerrier japonais, fondé en 1192, plaça le pouvoir réel entre les mains du shogun plutôt que de l’empereur ?", options: ["Le shogunat de Kamakura", "Le shogunat Tokugawa", "Le shogunat Ashikaga", "La cour de Heian"], explanation: "Le bakufu de Kamakura de Minamoto no Yoritomo inaugura près de 700 ans de règne des samouraïs." },
  },
  'mq39': {
    de: { question: "Die „göttlichen Winde“ (Kamikaze), die Japan 1274 und 1281 retteten, zerstörten Invasionsflotten, die von wem entsandt wurden?", options: ["Ming-China", "Korea", "Den Mongolen unter Kublai Khan", "Der Song-Dynastie"], explanation: "Taifune zerschmetterten beide mongolischen Flotten und festigten die Legende vom göttlichen Schutz." },
    fr: { question: "Les « vents divins » (kamikaze) qui sauvèrent le Japon en 1274 et 1281 détruisirent des flottes d’invasion envoyées par…", options: ["La Chine des Ming", "La Corée", "Les Mongols sous Kubilai Khan", "La dynastie Song"], explanation: "Des typhons anéantirent les deux armadas mongoles, ancrant la légende d’une protection divine." },
  },
  'mq40': {
    de: { question: "Welchen afrikanischen Herrschers Pilgerfahrt nach Mekka 1324 war so verschwenderisch, dass sie angeblich die Goldpreise in Ägypten drückte?", options: ["Sundiata Keita", "Mansa Musa", "Askia Mohammed", "Ezana von Aksum"], explanation: "Mansa Musa von Mali verteilte unterwegs so viel Gold, dass sein Wert in Kairo angeblich jahrelang fiel." },
    fr: { question: "Le pèlerinage à La Mecque de quel empereur africain en 1324 fut si fastueux qu’il aurait fait chuter le prix de l’or en Égypte ?", options: ["Soundiata Keïta", "Mansa Moussa", "Askia Mohammed", "Ézana d’Aksoum"], explanation: "Mansa Moussa du Mali distribua tant d’or en chemin que sa valeur au Caire aurait baissé pendant des années." },
  },
  'mq41': {
    de: { question: "Der Vertrag von Verdun (843) teilte Karls des Großen Reich unter seine drei Enkel auf und skizzierte die groben Umrisse welcher zwei modernen Nationen?", options: ["Italien und Spanien", "Frankreich und Deutschland", "England und Schottland", "Polen und Russland"], explanation: "Die dreifache Teilung des Karolingerreichs schuf die groben Umrisse des heutigen Frankreich und Deutschland, wie die Lektion anmerkt." },
    fr: { question: "Le traité de Verdun (843) partagea l’empire de Charlemagne entre ses trois petits-fils, esquissant les contours approximatifs de quelles deux nations modernes ?", options: ["L’Italie et l’Espagne", "La France et l’Allemagne", "L’Angleterre et l’Écosse", "La Pologne et la Russie"], explanation: "Le triple partage de l’empire carolingien créa les contours approximatifs de la France et de l’Allemagne modernes, comme le note la leçon." },
  },
  'mq42': {
    de: { question: "Welcher Gelehrte des islamischen Goldenen Zeitalters verfasste den „Kanon der Medizin“, der jahrhundertelang als Lehrbuch an europäischen Universitäten diente?", options: ["Al-Chwarizmi", "Ibn Sina (Avicenna)", "Ibn Ruschd (Averroes)", "Al-Razi"], explanation: "Ibn Sinas Kanon der Medizin war jahrhundertelang ein medizinisches Standardwerk an europäischen Universitäten, so die Lektion." },
    fr: { question: "Quel savant de l’âge d’or islamique écrivit le « Canon de la médecine », utilisé comme manuel dans les universités européennes pendant des siècles ?", options: ["Al-Khwarizmi", "Ibn Sina (Avicenne)", "Ibn Rushd (Averroès)", "Al-Razi"], explanation: "Le Canon de la médecine d’Ibn Sina fut un ouvrage médical de référence dans les universités européennes pendant des siècles, note la leçon." },
  },
  'mq43': {
    de: { question: "Der Zweig der Mathematik namens Algebra wurde von welchem Gelehrten im abbasidischen Bagdad entwickelt?", options: ["Euklid", "Al-Chwarizmi", "Ptolemäus", "Pythagoras"], explanation: "Islamische Gelehrte leisteten originäre Beiträge zur Mathematik — die Algebra wurde von al-Chwarizmi entwickelt, wie die Lektion feststellt." },
    fr: { question: "La branche des mathématiques appelée algèbre fut développée par quel savant travaillant à Bagdad sous les Abbassides ?", options: ["Euclide", "Al-Khwarizmi", "Ptolémée", "Pythagore"], explanation: "Les savants islamiques apportèrent des contributions originales aux mathématiques — l’algèbre fut développée par al-Khwarizmi, comme l’indique la leçon." },
  },
  'mq44': {
    de: { question: "Dschingis Khan gliederte sein Heer nach welchem Prinzip neu und verlagerte die Treue vom Clan auf die Einheit und den Khan?", options: ["Feudale Rittergefolge", "Dezimaleinheiten zu zehn, hundert, tausend und zehntausend", "angeworbene Söldnerkompanien", "Stammes-Reiterscharen"], explanation: "Das mongolische Heer war nach dem Dezimalprinzip gegliedert — Einheiten zu 10, 100, 1.000 und 10.000 — und beendete die alte clanbasierte Stammeskriegsführung." },
    fr: { question: "Gengis Khan réorganisa son armée selon quel principe, déplaçant la loyauté du clan vers l’unité et le Khan ?", options: ["Des suites féodales de chevaliers", "Des unités décimales de dix, cent, mille et dix mille", "Des compagnies de mercenaires engagés", "Des bandes de cavalerie tribale"], explanation: "L’armée mongole était organisée selon des principes décimaux — unités de 10, 100, 1 000 et 10 000 — mettant fin à l’ancienne guerre tribale par clans." },
  },
  'mq45': {
    de: { question: "Die Plünderung welcher Stadt durch Hülegü Khan 1258 tötete den Kalifen und beendete fünf Jahrhunderte abbasidischer kultureller Vorherrschaft?", options: ["Damaskus", "Kairo", "Bagdad", "Samarkand"], explanation: "Hülegü Khan plünderte 1258 Bagdad, tötete den abbasidischen Kalifen und beendete fünf Jahrhunderte islamischer kultureller Führung." },
    fr: { question: "Le sac de quelle ville par Houlagou Khan en 1258 tua le calife et mit fin à cinq siècles de suprématie culturelle abbasside ?", options: ["Damas", "Le Caire", "Bagdad", "Samarcande"], explanation: "Houlagou Khan mit à sac Bagdad en 1258, tuant le calife abbasside et mettant fin à cinq siècles de primauté culturelle islamique." },
  },
  'mq46': {
    de: { question: "Nach dem Genpei-Krieg errichtete Minamoto no Yoritomo 1185 das erste Shogunat Japans in welcher Stadt?", options: ["Kyoto", "Kamakura", "Edo", "Osaka"], explanation: "Yoritomo richtete 1185 das erste Shogunat — eine parallele Militärregierung — in Kamakura ein und stellte den kaiserlichen Hof in Kyoto ins Abseits." },
    fr: { question: "Après la guerre de Genpei, Minamoto no Yoritomo établit le premier shogunat du Japon en 1185 dans quelle ville ?", options: ["Kyoto", "Kamakura", "Edo", "Osaka"], explanation: "Yoritomo instaura le premier shogunat — un gouvernement militaire parallèle — à Kamakura en 1185, éclipsant la cour impériale de Kyoto." },
  },
  'mq47': {
    de: { question: "Die beiden mongolischen Invasionen Japans (1274 und 1281) wurden teils durch gewaltige Taifune abgewehrt, die die Japaner … nannten.", options: ["Bushidō", "Kamikaze („göttlicher Wind“)", "Seppuku", "Sakoku"], explanation: "Ein Taifun — der „göttliche Wind“, Kamikaze — zerschlug die riesige mongolische Flotte von 1281, eine Errettung, die für die japanische Identität zentral wurde." },
    fr: { question: "Les deux invasions mongoles du Japon (1274 et 1281) furent repoussées en partie par de grands typhons que les Japonais appelaient…", options: ["Bushidō", "Kamikaze (« vent divin »)", "Seppuku", "Sakoku"], explanation: "Un typhon — le « vent divin », kamikaze — anéantit l’immense flotte mongole de 1281, un salut devenu central pour l’identité japonaise." },
  },
  'mq48': {
    de: { question: "911 erkaufte der Frankenkönig Karl der Einfältige den Frieden, indem er welchem Wikingerführer das Land schenkte, das zur Normandie wurde?", options: ["Rollo", "Knut dem Großen", "Harald Blauzahn", "Ivar dem Knochenlosen"], explanation: "Karl der Einfältige überließ Rollo die Seinemündung — „das Land der Nordmänner“, die Normandie; sein Nachfahre Wilhelm sollte 1066 England erobern." },
    fr: { question: "En 911, le roi franc Charles le Simple acheta la paix en cédant à quel chef viking la terre qui devint la Normandie ?", options: ["Rollon", "Knut le Grand", "Harald à la dent bleue", "Ivar le Désossé"], explanation: "Charles le Simple céda à Rollon l’embouchure de la Seine — « le pays des hommes du Nord », la Normandie ; son descendant Guillaume conquerrait l’Angleterre en 1066." },
  },
  'mq49': {
    de: { question: "Die byzantinischen Kaiser schätzten nordische (und später angelsächsische) Krieger so sehr, dass sie aus ihnen welche Elitegarde bildeten?", options: ["Die Prätorianergarde", "Die Warägergarde", "Die Unsterblichen", "Die Janitscharen"], explanation: "Schwedische Rus erreichten Konstantinopel als Händler und Söldner; aus diesen nordischen Kriegern bildeten die Kaiser die elitäre Warägergarde." },
    fr: { question: "Les empereurs byzantins prisaient tant les guerriers scandinaves (puis anglo-saxons) qu’ils formèrent avec eux quelle garde d’élite ?", options: ["La garde prétorienne", "La garde varangienne", "Les Immortels", "Les janissaires"], explanation: "Les Rus’ suédois atteignaient Constantinople comme marchands et mercenaires ; de ces guerriers nordiques les empereurs formèrent la garde varangienne d’élite." },
  },
  'mq50': {
    de: { question: "In welcher Schlacht von 1415 zerschlugen Heinrichs V. zahlenmäßig weit unterlegene englische Langbogenschützen ein französisches Heer, das vielleicht fünfmal so groß war?", options: ["Crécy", "Poitiers", "Azincourt", "Orléans"], explanation: "Bei Azincourt (1415) vernichteten englische Langbogenschützen ein weit größeres französisches Heer — ein Zeichen, dass der gepanzerte Ritter der Infanterie und den Fernwaffen wich." },
    fr: { question: "À quelle bataille de 1415 les archers gallois à arc long d’Henri V, très inférieurs en nombre, écrasèrent-ils une armée française peut-être cinq fois plus grande ?", options: ["Crécy", "Poitiers", "Azincourt", "Orléans"], explanation: "À Azincourt (1415), les archers anglais à arc long détruisirent une armée française bien plus nombreuse — signe que le chevalier en armure cédait à l’infanterie et aux armes de trait." },
  },
  'eq1': {
    de: { question: "Johannes Gutenbergs Erfindung des Buchdrucks mit beweglichen Lettern (~1440) ermöglichte am unmittelbarsten welches Ereignis?", options: ["Die Kreuzzüge", "Die protestantische Reformation", "Der Schwarze Tod", "Die Mongoleneinfälle"], explanation: "Die Druckerpresse machte es möglich, Luthers Ideen binnen Wochen in ganz Deutschland zu verbreiten — ohne sie wäre die Reformation vielleicht wie frühere Reformbewegungen unterdrückt worden." },
    fr: { question: "L’invention par Johannes Gutenberg de l’imprimerie à caractères mobiles (v. 1440) rendit le plus directement possible quel événement ?", options: ["Les croisades", "La Réforme protestante", "La peste noire", "Les invasions mongoles"], explanation: "L’imprimerie permit de répandre les idées de Luther à travers l’Allemagne en quelques semaines — sans elle, la Réforme aurait pu être étouffée comme les mouvements réformateurs antérieurs." },
  },
  'eq2': {
    de: { question: "Kolumbus’ erste Landung 1492 erfolgte in welcher Region?", options: ["Brasilien", "Florida", "Die Karibik", "Mexiko"], explanation: "Kolumbus landete auf den Bahamas in der Karibik, im Glauben, Asien erreicht zu haben. Er erkannte nie, dass er einen den Europäern zuvor unbekannten Kontinent gefunden hatte." },
    fr: { question: "Le premier débarquement de Colomb, en 1492, eut lieu dans quelle région ?", options: ["Le Brésil", "La Floride", "Les Caraïbes", "Le Mexique"], explanation: "Colomb accosta aux Bahamas, dans les Caraïbes, croyant avoir atteint l’Asie. Il ne comprit jamais qu’il avait trouvé un continent jusque-là inconnu des Européens." },
  },
  'eq3': {
    de: { question: "Der „Kolumbische Austausch“ bezeichnet welches Phänomen?", options: ["Kolumbus tauschte Gold gegen Gewürze", "Die Übertragung von Pflanzen, Tieren und Krankheiten zwischen den Hemisphären nach 1492", "Ein Handelsabkommen zwischen Spanien und Portugal", "Kolumbus tauschte Karten mit indigenen Völkern"], explanation: "Der Kolumbische Austausch brachte Pferde, Rinder und tödliche Krankheiten nach Amerika; zurück kehrten Kartoffeln, Tomaten und Mais nach Europa — was beide Hemisphären verwandelte." },
    fr: { question: "L’« échange colombien » désigne quel phénomène ?", options: ["Colomb échangeant de l’or contre des épices", "Le transfert de plantes, d’animaux et de maladies entre hémisphères après 1492", "Un accord commercial entre l’Espagne et le Portugal", "Colomb échangeant des cartes avec les peuples autochtones"], explanation: "L’échange colombien apporta chevaux, bovins et maladies mortelles aux Amériques ; il rapporta pommes de terre, tomates et maïs à l’Europe — transformant les deux hémisphères." },
  },
  'eq4': {
    de: { question: "Martin Luther schlug seine 95 Thesen gegen die Missstände der Kirche in welchem Jahr an?", options: ["1492", "1505", "1517", "1543"], explanation: "Am 31. Oktober 1517 wandte sich Luther gegen den Ablasshandel und entfachte die protestantische Reformation." },
    fr: { question: "Martin Luther afficha ses 95 thèses contestant la corruption de l’Église en quelle année ?", options: ["1492", "1505", "1517", "1543"], explanation: "Le 31 octobre 1517, Luther contesta la vente des indulgences, lançant la Réforme protestante." },
  },
  'eq5': {
    de: { question: "Der Westfälische Friede (1648) begründete welches Kernprinzip der modernen internationalen Ordnung?", options: ["Freihandel zwischen den Nationen", "Die Vorherrschaft des Papstes", "Nationale Souveränität und Nichteinmischung", "Die Rechte religiöser Minderheiten"], explanation: "Westfalen legte fest, dass Herrscher die Religion ihrer Gebiete bestimmen durften und äußere Mächte sich nicht einmischen sollten — die Grundlage des modernen Nationalstaatensystems." },
    fr: { question: "Les traités de Westphalie (1648) établirent quel principe clé de l’ordre international moderne ?", options: ["Le libre-échange entre nations", "La suprématie du pape", "La souveraineté nationale et la non-ingérence", "Les droits des minorités religieuses"], explanation: "La Westphalie établit que les souverains pouvaient déterminer la religion de leurs territoires et que les puissances extérieures ne devaient pas s’y ingérer — le fondement du système moderne des États-nations." },
  },
  'eq6': {
    de: { question: "Galileo Galilei wurde 1633 von welcher Institution gezwungen, seine Unterstützung des heliozentrischen Modells zu widerrufen?", options: ["Die spanische Inquisition", "Die Republik Venedig", "Die römisch-katholische Kirche", "Der Heilige Römische Kaiser"], explanation: "Die römische Inquisition verurteilte Galilei wegen Ketzerei. Er soll nach dem Widerruf „Und sie bewegt sich doch“ gemurmelt haben, was jedoch wahrscheinlich erfunden ist." },
    fr: { question: "Galilée fut contraint en 1633 d’abjurer son soutien au modèle héliocentrique par quelle institution ?", options: ["L’Inquisition espagnole", "La République de Venise", "L’Église catholique romaine", "L’empereur du Saint-Empire"], explanation: "L’Inquisition romaine condamna Galilée pour hérésie. Il aurait murmuré « Et pourtant elle tourne » après son abjuration, mais c’est probablement apocryphe." },
  },
  'eq7': {
    de: { question: "Isaac Newtons „Principia Mathematica“ (1687) begründete Gesetze, die welche Phänomene bestimmen?", options: ["Elektrizität und Magnetismus", "Bewegung und Gravitation", "Licht und Optik", "Chemie und Atome"], explanation: "Die Principia beschrieben die drei Bewegungsgesetze und die allgemeine Gravitation — und zeigten, dass dieselbe Kraft, die einen Apfel fallen ließ, den Mond auf seiner Bahn hielt." },
    fr: { question: "Les « Principia Mathematica » d’Isaac Newton (1687) établirent des lois régissant quels phénomènes ?", options: ["L’électricité et le magnétisme", "Le mouvement et la gravitation", "La lumière et l’optique", "La chimie et les atomes"], explanation: "Les Principia décrivirent les trois lois du mouvement et la gravitation universelle — montrant que la même force qui faisait tomber une pomme maintenait la Lune en orbite." },
  },
  'eq8': {
    de: { question: "Der Dreißigjährige Krieg (1618–1648) begann als Konflikt worüber?", options: ["Kolonialgebiete", "Handelswege", "Die Religion im Heiligen Römischen Reich", "Die Nachfolge auf dem französischen Thron"], explanation: "Er begann als Glaubenskrieg zwischen Katholiken und Protestanten in Böhmen (dem heutigen Tschechien), ehe er zu einem gesamteuropäischen Machtkonflikt wurde." },
    fr: { question: "La guerre de Trente Ans (1618–1648) débuta comme un conflit à propos de quoi ?", options: ["Un territoire colonial", "Des routes commerciales", "La religion dans le Saint-Empire", "La succession au trône de France"], explanation: "Elle commença comme une guerre de religion entre catholiques et protestants en Bohême (l’actuelle Tchéquie) avant de devenir un conflit de puissances européen général." },
  },
  'eq9': {
    de: { question: "Welcher Denker der Aufklärung verfasste „Der Gesellschaftsvertrag“ (1762) mit dem Argument, die Legitimität der Regierung komme vom Volk?", options: ["Voltaire", "Montesquieu", "John Locke", "Jean-Jacques Rousseau"], explanation: "Rousseaus Gesellschaftsvertrag argumentierte, dass legitime Regierung aus der Zustimmung des Volkes erwächst — ein unmittelbarer Einfluss auf die Amerikanische wie die Französische Revolution." },
    fr: { question: "Quel penseur des Lumières écrivit « Du contrat social » (1762), affirmant que la légitimité du gouvernement vient du peuple ?", options: ["Voltaire", "Montesquieu", "John Locke", "Jean-Jacques Rousseau"], explanation: "Le Contrat social de Rousseau soutenait qu’un gouvernement légitime dérive du consentement populaire — une influence directe sur les révolutions américaine et française." },
  },
  'eq10': {
    de: { question: "Welcher Seefahrer im Dienst Portugals erreichte 1498 als Erster Indien auf dem Seeweg um Afrika herum?", options: ["Christoph Kolumbus", "Amerigo Vespucci", "Vasco da Gama", "Ferdinand Magellan"], explanation: "Vasco da Gamas Fahrt um das Kap der Guten Hoffnung eröffnete den direkten Seeweg nach Asien und durchbrach das arabische Monopol auf den Gewürzhandel." },
    fr: { question: "Quel explorateur, naviguant pour le Portugal, fut le premier à atteindre l’Inde par mer en contournant l’Afrique en 1498 ?", options: ["Christophe Colomb", "Amerigo Vespucci", "Vasco de Gama", "Fernand de Magellan"], explanation: "Le voyage de Vasco de Gama autour du cap de Bonne-Espérance ouvrit la route maritime directe vers l’Asie, brisant le monopole arabe sur le commerce des épices." },
  },
  'eq11': {
    de: { question: "Bei der „Prager Fenstersturz“ (1618) — dem Vorfall, der den Dreißigjährigen Krieg auslöste — taten protestantische Adlige was?", options: ["Sie brannten katholische Kirchen in Prag nieder", "Sie warfen katholische königliche Beamte aus einem Burgfenster", "Sie ermordeten den Heiligen Römischen Kaiser", "Sie blockierten Prags Handelswege"], explanation: "Protestantische böhmische Adlige warfen zwei katholische königliche Statthalter und deren Sekretär aus einem Fenster der Prager Burg — ein bewusster Akt des Trotzes. Alle drei überlebten den 17-Meter-Sturz (Katholiken behaupteten, Engel hätten sie aufgefangen)." },
    fr: { question: "Lors de la « défenestration de Prague » (1618) — l’incident qui déclencha la guerre de Trente Ans — que firent des nobles protestants ?", options: ["Ils incendièrent des églises catholiques à Prague", "Ils jetèrent des officiers royaux catholiques par une fenêtre du château", "Ils assassinèrent l’empereur du Saint-Empire", "Ils bloquèrent les routes commerciales de Prague"], explanation: "Des nobles protestants de Bohême jetèrent deux gouverneurs royaux catholiques et leur secrétaire par une fenêtre du château de Prague — un acte de défi délibéré. Les trois survécurent à la chute de 17 mètres (les catholiques affirmèrent que des anges les avaient amortis)." },
  },
  'eq12': {
    de: { question: "Die 1602 gegründete Niederländische Ostindien-Kompanie (VOC) war historisch bedeutsam als welche Art von Finanzneuerung?", options: ["Erste Zentralbank", "Erste börsennotierte Aktiengesellschaft", "Erste staatseigene Körperschaft", "Erste internationale Versicherungsgesellschaft"], explanation: "Die VOC war die erste börsennotierte Aktiengesellschaft der Welt und gab Anteile an der Amsterdamer Börse aus. Diese Finanzneuerung erlaubte Investoren, Risiko und Gewinn zu teilen, und finanzierte den Fernhandel." },
    fr: { question: "La Compagnie néerlandaise des Indes orientales (VOC), fondée en 1602, fut historiquement importante comme quel type d’innovation financière ?", options: ["Première banque centrale", "Première société par actions cotée en bourse", "Première société d’État", "Première compagnie d’assurance internationale"], explanation: "La VOC fut la première société par actions cotée en bourse du monde, émettant des actions à la Bourse d’Amsterdam. Cette innovation financière permit aux investisseurs de partager risque et profit, finançant le commerce lointain." },
  },
  'eq13': {
    de: { question: "Welcher aztekische Herrscher empfing Hernán Cortés und seine kleine spanische Streitmacht zunächst freundlich, als sie 1519 in Mexiko eintrafen?", options: ["Cuauhtémoc", "Itzcoatl", "Moctezuma II.", "Ahuitzotl"], explanation: "Moctezuma II. empfing Cortés mit außergewöhnlichen Geschenken, womöglich beeinflusst von Prophezeiungen über einen wiederkehrenden Gott. Seine Gastfreundschaft ließ die Spanier Tenochtitlan, die aztekische Hauptstadt, betreten — eine verhängnisvolle Fehleinschätzung." },
    fr: { question: "Quel empereur aztèque accueillit d’abord favorablement Hernán Cortés et sa petite troupe espagnole à leur arrivée au Mexique en 1519 ?", options: ["Cuauhtémoc", "Itzcóatl", "Moctezuma II", "Ahuízotl"], explanation: "Moctezuma II reçut Cortés avec des présents extraordinaires, peut-être influencé par des prophéties sur le retour d’un dieu. Son hospitalité permit aux Espagnols d’entrer dans Tenochtitlan, la capitale aztèque — une erreur fatale." },
  },
  'eq14': {
    de: { question: "John Lockes „Zwei Abhandlungen über die Regierung“ (1689) beeinflussten unmittelbar welches amerikanische Gründungsdokument?", options: ["Die Federalist Papers", "Die US-Verfassung", "Die Unabhängigkeitserklärung", "Die Bill of Rights"], explanation: "Jeffersons Erklärung schöpft fast wörtlich aus Lockes Konzept der natürlichen Rechte auf „Leben, Freiheit und Eigentum“ (Jefferson ersetzte „Eigentum“ durch „Streben nach Glück“) und dem Recht, eine tyrannische Regierung zu stürzen." },
    fr: { question: "Les « Deux traités du gouvernement civil » de John Locke (1689) influencèrent directement quel document fondateur américain ?", options: ["Le Fédéraliste", "La Constitution des États-Unis", "La Déclaration d’indépendance", "La Déclaration des droits (Bill of Rights)"], explanation: "La Déclaration de Jefferson reprend presque mot pour mot le concept lockéen des droits naturels à « la vie, la liberté et la propriété » (Jefferson remplaça « propriété » par « recherche du bonheur ») et le droit de renverser un gouvernement tyrannique." },
  },
  'eq15': {
    de: { question: "Die „wissenschaftliche Revolution“ soll mit Kopernikus’ heliozentrischer Theorie (1543) begonnen und mit welcher Veröffentlichung gegipfelt haben?", options: ["Galileis Dialog (1632)", "Newtons Principia Mathematica (1687)", "Darwins Entstehung der Arten (1859)", "Keplers Astronomia Nova (1609)"], explanation: "Historiker datieren die wissenschaftliche Revolution herkömmlich von Kopernikus’ heliozentrischem Modell (1543) bis zu Newtons Principia (1687), die ein Jahrhundert von Entdeckungen zu einem einheitlichen mathematischen Naturverständnis zusammenfügten." },
    fr: { question: "La « révolution scientifique » aurait débuté avec la théorie héliocentrique de Copernic (1543) et culminé avec quelle publication ?", options: ["Le Dialogue de Galilée (1632)", "Les Principia Mathematica de Newton (1687)", "L’Origine des espèces de Darwin (1859)", "L’Astronomia Nova de Kepler (1609)"], explanation: "Les historiens datent conventionnellement la révolution scientifique du modèle héliocentrique de Copernic (1543) aux Principia de Newton (1687), qui fondirent un siècle de découvertes en un cadre mathématique unifié de compréhension de la nature." },
  },
  'eq16': {
    de: { question: "Welche florentinische Familie finanzierte einen Großteil der italienischen Renaissance?", options: ["Die Borgia", "Die Sforza", "Die Medici", "Die Este"], explanation: "Der Bankreichtum der Medici finanzierte Brunelleschi, Botticelli und Michelangelo und machte Florenz zur Hauptstadt der Renaissance." },
    fr: { question: "Quelle famille florentine finança une grande partie de la Renaissance italienne ?", options: ["Les Borgia", "Les Sforza", "Les Médicis", "Les Este"], explanation: "La richesse bancaire des Médicis finança Brunelleschi, Botticelli et Michel-Ange, faisant de Florence la capitale de la Renaissance." },
  },
  'eq17': {
    de: { question: "Brunelleschis ingenieurtechnisches Meisterwerk in Florenz war …", options: ["Der Petersdom", "Die Kuppel des Florentiner Doms", "Die Uffizien", "Der Ponte Vecchio"], explanation: "Seine doppelschalige Kuppel (1436 vollendet) war die größte je errichtete Mauerwerkskuppel — ohne Gerüst vom Boden aus." },
    fr: { question: "Le chef-d’œuvre d’ingénierie de Brunelleschi à Florence était…", options: ["La basilique Saint-Pierre", "Le dôme de la cathédrale de Florence", "Les Offices", "Le Ponte Vecchio"], explanation: "Son dôme à double coque (achevé en 1436) fut le plus grand dôme de maçonnerie jamais construit — sans échafaudage depuis le sol." },
  },
  'eq18': {
    de: { question: "Welcher Vertrag von 1494 teilte die neu entdeckten Länder außerhalb Europas zwischen Spanien und Portugal auf?", options: ["Vertrag von Utrecht", "Vertrag von Tordesillas", "Augsburger Religionsfriede", "Vertrag von Saragossa"], explanation: "Ein Meridian westlich der Kapverden teilte die außereuropäische Welt — weshalb man in Brasilien Portugiesisch spricht." },
    fr: { question: "Quel traité de 1494 partagea les terres nouvellement découvertes hors d’Europe entre l’Espagne et le Portugal ?", options: ["Traité d’Utrecht", "Traité de Tordesillas", "Paix d’Augsbourg", "Traité de Saragosse"], explanation: "Un méridien à l’ouest du Cap-Vert partagea le monde non européen — c’est pourquoi le Brésil parle portugais." },
  },
  'eq19': {
    de: { question: "Die erste Weltumsegelung (1519–1522) wurde nach Magellans Tod unter wessen Kommando vollendet?", options: ["Francis Drake", "Juan Sebastián Elcano", "Vasco Núñez de Balboa", "Amerigo Vespucci"], explanation: "Elcano brachte die Victoria mit 18 Überlebenden heim, nachdem Magellan auf den Philippinen getötet worden war." },
    fr: { question: "La première circumnavigation du globe (1519–1522) fut achevée sous le commandement de qui après la mort de Magellan ?", options: ["Francis Drake", "Juan Sebastián Elcano", "Vasco Núñez de Balboa", "Amerigo Vespucci"], explanation: "Elcano ramena la Victoria avec 18 survivants après que Magellan eut été tué aux Philippines." },
  },
  'eq20': {
    de: { question: "Hernán Cortés eroberte 1519–1521 welches Reich?", options: ["Die Inka", "Die Maya", "Die Azteken (Mexica)", "Die Olmeken"], explanation: "Mit Stahl, Pferden, Pocken und einheimischen Verbündeten stürzte Cortés Tenochtitlan und den Mexica-Staat." },
    fr: { question: "Hernán Cortés conquit quel empire en 1519–1521 ?", options: ["Les Incas", "Les Mayas", "Les Aztèques (Mexicas)", "Les Olmèques"], explanation: "Avec l’acier, les chevaux, la variole et des alliés autochtones, Cortés renversa Tenochtitlan et l’État mexica." },
  },
  'eq21': {
    de: { question: "Welcher Inka-Herrscher wurde 1533 von Francisco Pizarro gefangen genommen und hingerichtet?", options: ["Atahualpa", "Huayna Cápac", "Pachacútec", "Túpac Amaru"], explanation: "Atahualpa füllte einen Raum mit Gold als Lösegeld, doch Pizarro ließ ihn hinrichten und nahm Cusco ein." },
    fr: { question: "Quel empereur inca fut capturé et exécuté par Francisco Pizarro en 1533 ?", options: ["Atahualpa", "Huayna Cápac", "Pachacutec", "Túpac Amaru"], explanation: "Atahualpa remplit une pièce d’or en guise de rançon, mais Pizarro l’exécuta et s’empara de Cuzco." },
  },
  'eq22': {
    de: { question: "Der Augsburger Religionsfriede (1555) begründete welches Prinzip im Heiligen Römischen Reich?", options: ["Freie Religionsausübung für alle", "Cuius regio, eius religio — der Glaube des Herrschers bestimmt den des Gebiets", "Päpstliche Vorherrschaft", "Abschaffung der Klöster"], explanation: "Jeder Fürst wählte für seine Lande Luthertum oder Katholizismus; Andersgläubige durften auswandern." },
    fr: { question: "La paix d’Augsbourg (1555) établit quel principe dans le Saint-Empire ?", options: ["La liberté de culte pour tous", "Cuius regio, eius religio — la foi du souverain détermine celle du territoire", "La suprématie papale", "L’abolition des monastères"], explanation: "Chaque prince choisissait le luthéranisme ou le catholicisme pour ses terres ; les dissidents pouvaient émigrer." },
  },
  'eq23': {
    de: { question: "Johannes Calvin machte welche Stadt zu einem protestantischen Musterstaat?", options: ["Wittenberg", "Zürich", "Genf", "Straßburg"], explanation: "Calvins Genf setzte strenge Disziplin durch und bildete Pastoren aus, die das reformierte Christentum in ganz Europa verbreiteten." },
    fr: { question: "Jean Calvin fit de quelle ville une république protestante modèle ?", options: ["Wittenberg", "Zurich", "Genève", "Strasbourg"], explanation: "La Genève de Calvin imposa une discipline stricte et forma des pasteurs qui répandirent le christianisme réformé à travers l’Europe." },
  },
  'eq24': {
    de: { question: "Heinrich VIII. brach vor allem deshalb mit Rom, weil der Papst sich weigerte, …", options: ["ihn zum Kaiser zu krönen", "seine Ehe mit Katharina von Aragón zu annullieren", "seine Kriege zu finanzieren", "einen englischen Heiligen zu kanonisieren"], explanation: "Die Suprematsakte (1534) machte Heinrich zum Oberhaupt der Kirche von England, nachdem die Annullierung verweigert worden war." },
    fr: { question: "Henri VIII rompit avec Rome surtout parce que le pape refusa de…", options: ["le couronner empereur", "annuler son mariage avec Catherine d’Aragon", "financer ses guerres", "canoniser un saint anglais"], explanation: "L’Acte de suprématie (1534) fit d’Henri le chef de l’Église d’Angleterre après le refus de l’annulation." },
  },
  'eq25': {
    de: { question: "Die Spanische Armada wurde 1588 während der Herrschaft welches englischen Monarchen besiegt?", options: ["Maria I.", "Elisabeth I.", "Heinrich VIII.", "Jakob I."], explanation: "Stürme und englische Brander zerstörten Philipps II. Invasionsflotte und sicherten Elisabeths protestantisches England." },
    fr: { question: "L’Invincible Armada fut défaite en 1588 sous le règne de quel monarque anglais ?", options: ["Marie Iʳᵉ", "Élisabeth Iʳᵉ", "Henri VIII", "Jacques Iᵉʳ"], explanation: "Tempêtes et brûlots anglais détruisirent la flotte d’invasion de Philippe II, préservant l’Angleterre protestante d’Élisabeth." },
  },
  'eq26': {
    de: { question: "Welcher osmanische Sultan belagerte 1529 auf dem Höhepunkt der osmanischen Macht Wien?", options: ["Mehmed II.", "Selim I.", "Süleyman der Prächtige", "Bayezid II."], explanation: "Süleymans Heere erreichten Wiens Mauern; Wetter und Nachschub erzwangen den Rückzug." },
    fr: { question: "Quel sultan ottoman assiégea Vienne en 1529, à l’apogée de la puissance ottomane ?", options: ["Mehmed II", "Sélim Iᵉʳ", "Soliman le Magnifique", "Bayezid II"], explanation: "Les armées de Soliman atteignirent les murs de Vienne ; le temps et la logistique imposèrent le repli." },
  },
  'eq27': {
    de: { question: "Das Devschirme-System versorgte den osmanischen Staat mit …", options: ["Schiffbauholz", "christlichen Knaben, ausgebildet als Janitscharen und Verwalter", "Seideneinnahmen", "Getreidetribut"], explanation: "Ausgehobene Knaben traten zum Islam über und stiegen nach Verdienst auf — manche wurden Großwesire." },
    fr: { question: "Le système du devchirmé fournissait à l’État ottoman…", options: ["du bois de marine", "des garçons chrétiens formés comme janissaires et administrateurs", "des revenus de la soie", "un tribut en grain"], explanation: "Les garçons prélevés se convertissaient à l’islam et s’élevaient au mérite — certains devinrent grands vizirs." },
  },
  'eq28': {
    de: { question: "Babur, Begründer des Mogulreiches, gewann 1526 in welcher Schlacht den Thron von Delhi?", options: ["Plassey", "Panipat", "Talikota", "Haldighati"], explanation: "Bei der Ersten Schlacht von Panipat besiegten Baburs Feldgeschütze und Taktik das weit größere Heer des Sultans von Delhi." },
    fr: { question: "Babur, fondateur de l’Empire moghol, remporta le trône de Delhi à quelle bataille en 1526 ?", options: ["Plassey", "Panipat", "Talikota", "Haldighati"], explanation: "À la première bataille de Panipat, les canons de campagne et la tactique de Babur défirent l’armée bien plus nombreuse du sultan de Delhi." },
  },
  'eq29': {
    de: { question: "Welcher Mogulkaiser war berühmt für religiöse Toleranz und Glaubensdialoge an seinem Hof?", options: ["Aurangzeb", "Akbar", "Shah Jahan", "Jahangir"], explanation: "Akbar schaffte die Dschizya-Steuer ab, heiratete Radschputen-Prinzessinnen und richtete interreligiöse Debatten in Fatehpur Sikri aus." },
    fr: { question: "Quel empereur moghol était réputé pour sa tolérance religieuse et les dialogues entre fois à sa cour ?", options: ["Aurangzeb", "Akbar", "Shah Jahan", "Jahangir"], explanation: "Akbar abolit l’impôt de la jizya, épousa des princesses rajpoutes et accueillit des débats interreligieux à Fatehpur Sikri." },
  },
  'eq30': {
    de: { question: "Der Taj Mahal wurde von Shah Jahan errichtet als …", options: ["ein Siegesmonument", "eine Moschee für Delhi", "ein Grabmal für seine Frau Mumtaz Mahal", "ein Palast für seinen Sohn"], explanation: "Das Mausoleum aus weißem Marmor in Agra (um 1648 vollendet) gedenkt Mumtaz Mahals, die im Kindbett starb." },
    fr: { question: "Le Taj Mahal fut édifié par Shah Jahan comme…", options: ["un monument de victoire", "une mosquée pour Delhi", "un tombeau pour son épouse Mumtaz Mahal", "un palais pour son fils"], explanation: "Le mausolée de marbre blanc d’Agra (achevé v. 1648) commémore Mumtaz Mahal, morte en couches." },
  },
  'eq31': {
    de: { question: "Welche Schlacht von 1600 eröffnete Tokugawa Ieyasu den Weg zur Herrschaft über Japan?", options: ["Nagashino", "Okehazama", "Sekigahara", "Osaka"], explanation: "Der Sieg bei Sekigahara ließ Ieyasu 1603 das Shogunat beanspruchen und 250 Jahre Tokugawa-Herrschaft beginnen." },
    fr: { question: "Quelle bataille de 1600 ouvrit à Tokugawa Ieyasu la voie du pouvoir sur le Japon ?", options: ["Nagashino", "Okehazama", "Sekigahara", "Osaka"], explanation: "La victoire de Sekigahara permit à Ieyasu de revendiquer le shogunat en 1603 et d’inaugurer 250 ans de règne Tokugawa." },
  },
  'eq32': {
    de: { question: "Japans Sakoku-Politik unter dem Tokugawa-Shogunat bedeutete …", options: ["verpflichtende Samurai-Bildung", "die nahezu vollständige Abschließung des Landes gegen fremden Kontakt", "die Expansion nach Korea", "die Verfolgung des Buddhismus"], explanation: "Ab den 1630er Jahren war der Außenhandel überwiegend auf Niederländer und Chinesen in Nagasaki beschränkt; Japaner durften das Land nicht verlassen." },
    fr: { question: "La politique du sakoku sous le shogunat Tokugawa signifiait…", options: ["une éducation obligatoire des samouraïs", "la fermeture quasi totale du pays au contact étranger", "l’expansion vers la Corée", "la persécution du bouddhisme"], explanation: "À partir des années 1630, le commerce extérieur fut confiné surtout aux Néerlandais et aux Chinois à Nagasaki ; les Japonais ne pouvaient partir." },
  },
  'eq33': {
    de: { question: "Welche europäische Nation allein unterhielt unter Sakoku einen Handelsposten in Japan, auf Dejima?", options: ["Portugal", "Spanien", "England", "Die Niederlande"], explanation: "Die protestantischen Niederländer, als Händler statt als Missionare angesehen, behielten den winzigen Posten auf der Insel Dejima in der Bucht von Nagasaki." },
    fr: { question: "Sous le sakoku, quelle nation européenne conserva seule un comptoir au Japon, à Dejima ?", options: ["Le Portugal", "L’Espagne", "L’Angleterre", "Les Provinces-Unies"], explanation: "Les Néerlandais protestants, vus comme des marchands plutôt que des missionnaires, conservèrent le minuscule comptoir de l’îlot de Dejima, dans la baie de Nagasaki." },
  },
  'eq34': {
    de: { question: "Die Ukiyo-e-Holzschnitte des Edo-Japans stellten welche „fließende Welt“ dar?", options: ["Buddhistische Paradiese", "Städtische Vergnügungsviertel, Kabuki-Schauspieler und Landschaften", "Kaiserliche Zeremonien", "Seeschlachten"], explanation: "Künstler wie Hokusai und Hiroshige druckten in Massen Bilder des Stadtlebens und des Reisens — die später europäische Maler elektrisierten." },
    fr: { question: "Les estampes ukiyo-e du Japon d’Edo dépeignaient quel « monde flottant » ?", options: ["Des paradis bouddhistes", "Les quartiers de plaisir urbains, les acteurs de kabuki et les paysages", "Les cérémonies impériales", "Des batailles navales"], explanation: "Des artistes comme Hokusai et Hiroshige produisirent en masse des images de la vie urbaine et du voyage — électrisant plus tard les peintres européens." },
  },
  'eq35': {
    de: { question: "Nikolaus Kopernikus’ „De revolutionibus“ (1543) schlug vor, dass …", options: ["Bahnen elliptisch sind", "die Erde und die Planeten die Sonne umkreisen", "die Schwerkraft mit der Entfernung abnimmt", "das Universum unendlich ist"], explanation: "Sein heliozentrisches Modell forderte die ptolemäische Astronomie heraus und setzte die wissenschaftliche Revolution in Gang." },
    fr: { question: "« De revolutionibus » de Nicolas Copernic (1543) proposa que…", options: ["les orbites sont elliptiques", "la Terre et les planètes tournent autour du Soleil", "la gravité faiblit avec la distance", "l’univers est infini"], explanation: "Son modèle héliocentrique remit en cause l’astronomie ptolémaïque et mit en marche la révolution scientifique." },
  },
  'eq36': {
    de: { question: "Johannes Kepler entdeckte, dass sich Planeten bewegen in …", options: ["vollkommenen Kreisen", "Spiralen", "Ellipsen mit der Sonne in einem Brennpunkt", "Epizyklen"], explanation: "Keplers Gesetze, aus Tycho Brahes Daten abgeleitet, ersetzten die Kreisbahnen durch Ellipsen." },
    fr: { question: "Johannes Kepler découvrit que les planètes se meuvent selon…", options: ["des cercles parfaits", "des spirales", "des ellipses avec le Soleil à un foyer", "des épicycles"], explanation: "Les lois de Kepler, tirées des données de Tycho Brahe, remplacèrent les orbites circulaires par des ellipses." },
  },
  'eq37': {
    de: { question: "Welchem Engländer wird die Formalisierung der experimentellen „wissenschaftlichen Methode“ zugeschrieben?", options: ["Francis Bacon", "Thomas Hobbes", "Robert Boyle", "William Harvey"], explanation: "Bacons „Novum Organum“ (1620) verfocht die systematische Beobachtung und Induktion gegenüber ererbter Autorität." },
    fr: { question: "Quel Anglais est crédité d’avoir formalisé la « méthode scientifique » expérimentale ?", options: ["Francis Bacon", "Thomas Hobbes", "Robert Boyle", "William Harvey"], explanation: "Le « Novum Organum » de Bacon (1620) prôna l’observation systématique et l’induction plutôt que l’autorité héritée." },
  },
  'eq38': {
    de: { question: "Ludwigs XIV. Finanzminister, der die französische Staatsindustrie und die Marine aufbaute, war …", options: ["Kardinal Richelieu", "Jean-Baptiste Colbert", "Kardinal Mazarin", "Turgot"], explanation: "Colberts Merkantilismus — Zölle, Manufakturen und Flotten — finanzierte die Kriege des Sonnenkönigs und Versailles." },
    fr: { question: "Le ministre des Finances de Louis XIV qui bâtit l’industrie d’État française et la marine était…", options: ["Le cardinal de Richelieu", "Jean-Baptiste Colbert", "Le cardinal Mazarin", "Turgot"], explanation: "Le mercantilisme de Colbert — tarifs, manufactures et flottes — finança les guerres du Roi-Soleil et Versailles." },
  },
  'eq39': {
    de: { question: "Das Edikt von Nantes (1598), von Ludwig XIV. 1685 widerrufen, hatte was gewährt?", options: ["Freihandel mit England", "Duldung der französischen Protestanten (Hugenotten)", "Unabhängigkeit für die Niederlande", "Land für heimkehrende Kreuzfahrer"], explanation: "Sein Widerruf trieb Hunderttausende geschickte Hugenotten ins Exil — eine selbst zugefügte wirtschaftliche Wunde." },
    fr: { question: "L’édit de Nantes (1598), révoqué par Louis XIV en 1685, avait accordé…", options: ["le libre-échange avec l’Angleterre", "la tolérance aux protestants français (huguenots)", "l’indépendance aux Provinces-Unies", "des terres aux croisés de retour"], explanation: "Sa révocation jeta en exil des centaines de milliers de huguenots qualifiés — une blessure économique auto-infligée." },
  },
  'eq40': {
    de: { question: "Englands Glorreiche Revolution von 1688 führte zu …", options: ["einer Republik unter Cromwell", "Wilhelm und Maria, die eine die Krone beschränkende Bill of Rights annahmen", "einer katholischen Restauration", "der Union mit Schottland"], explanation: "Die Einladung des Parlaments an Wilhelm von Oranien begründete eine konstitutionelle, rechtsgebundene Monarchie." },
    fr: { question: "La Glorieuse Révolution d’Angleterre de 1688 aboutit à…", options: ["une république sous Cromwell", "Guillaume et Marie acceptant une Déclaration des droits limitant la couronne", "une restauration catholique", "l’union avec l’Écosse"], explanation: "L’invitation du Parlement à Guillaume d’Orange établit une monarchie constitutionnelle et soumise à la loi." },
  },
  'eq41': {
    de: { question: "Wie viele Bücher waren dank Gutenbergs Druckerpresse mit beweglichen Lettern (um 1440) bis 1500 in Europa im Umlauf?", options: ["Über 20 Millionen", "Etwa 500.000", "Weniger als 50.000", "Über 200 Millionen"], explanation: "Bis 1500 waren über 20 Millionen Bücher in Europa im Umlauf und verbreiteten neue Ideen mit beispielloser Geschwindigkeit — was die Reformation möglich machte." },
    fr: { question: "Grâce à la presse à caractères mobiles de Gutenberg (v. 1440), combien de livres circulaient en Europe vers 1500 ?", options: ["Plus de 20 millions", "Environ 500 000", "Moins de 50 000", "Plus de 200 millions"], explanation: "Vers 1500, plus de 20 millions de livres circulaient en Europe, répandant les idées à une vitesse inédite — rendant la Réforme possible." },
  },
  'eq42': {
    de: { question: "Nach dem europäischen Kontakt brachen die indigenen Bevölkerungen Amerikas binnen eines Jahrhunderts um bis zu welchen Anteil zusammen, vor allem durch Krankheiten?", options: ["Bis zu 25 %", "Bis zu 50 %", "Bis zu 90 %", "Bis zu 10 %"], explanation: "Ohne Immunität gegen Pocken und Masern fielen die indigenen Bevölkerungen binnen eines Jahrhunderts um bis zu 90 % — eine der größten demografischen Katastrophen der Geschichte." },
    fr: { question: "Après le contact européen, les populations indigènes d’Amérique s’effondrèrent jusqu’à quelle proportion en un siècle, surtout à cause des maladies ?", options: ["Jusqu’à 25 %", "Jusqu’à 50 %", "Jusqu’à 90 %", "Jusqu’à 10 %"], explanation: "Sans immunité contre la variole et la rougeole, les populations autochtones chutèrent jusqu’à 90 % en un siècle — l’une des plus grandes catastrophes démographiques de l’histoire." },
  },
  'eq43': {
    de: { question: "Auf welcher Versammlung von 1521 weigerte sich Martin Luther zu widerrufen und erklärte angeblich „Hier stehe ich, ich kann nicht anders“?", options: ["Dem Konzil von Trient", "Dem Reichstag zu Worms", "Dem Augsburger Religionsfrieden", "Dem Reichstag zu Speyer"], explanation: "Vor den Reichstag zu Worms 1521 geladen, weigerte sich Luther zu widerrufen und wurde exkommuniziert — der eigentliche Beginn der Reformation." },
    fr: { question: "À quelle assemblée de 1521 Martin Luther refusa-t-il de se rétracter, déclarant selon la tradition « Me voici ; je ne puis autrement » ?", options: ["Le concile de Trente", "La diète de Worms", "La paix d’Augsbourg", "La diète de Spire"], explanation: "Convoqué devant la diète de Worms en 1521, Luther refusa de se rétracter et fut excommunié, lançant pleinement la Réforme." },
  },
  'eq44': {
    de: { question: "Das Konzil von Trient (1545–1563) und die 1540 von Ignatius von Loyola gegründeten Jesuiten waren die zwei Triebkräfte welcher Bewegung?", options: ["Der protestantischen Reformation", "Der katholischen Gegenreformation", "Der wissenschaftlichen Revolution", "Der Aufklärung"], explanation: "Das Konzil von Trient reformierte die Lehre, und die disziplinierten, gebildeten Jesuiten wurden die „Stoßtruppen“ der Gegenreformation." },
    fr: { question: "Le concile de Trente (1545–1563) et les Jésuites, fondés en 1540 par Ignace de Loyola, furent les deux moteurs de quel mouvement ?", options: ["La Réforme protestante", "La Contre-Réforme catholique", "La révolution scientifique", "Les Lumières"], explanation: "Le concile de Trente réforma la doctrine et les Jésuites disciplinés et instruits devinrent les « troupes de choc » de la Contre-Réforme." },
  },
  'eq45': {
    de: { question: "Ludwigs XIV. Widerruf des Edikts von Nantes 1685 trieb rund 200.000 Angehörige welcher Gruppe zur Flucht aus Frankreich und bereicherte dessen Rivalen?", options: ["Katholiken (Jansenisten)", "Protestanten (Hugenotten)", "Juden (Sepharden)", "Muslime (Morisken)"], explanation: "Rund 200.000 Hugenotten — viele geschickte Handwerker und Kaufleute — flohen nach Preußen, England und in die Niederlande und stärkten Frankreichs Feinde." },
    fr: { question: "La révocation par Louis XIV de l’édit de Nantes en 1685 fit fuir environ 200 000 membres de quel groupe, enrichissant les rivaux de la France ?", options: ["Les catholiques (jansénistes)", "Les protestants (huguenots)", "Les juifs (séfarades)", "Les musulmans (morisques)"], explanation: "Environ 200 000 huguenots — nombre d’artisans et de marchands qualifiés — fuirent en Prusse, en Angleterre et aux Provinces-Unies, renforçant les ennemis de la France." },
  },
  'eq46': {
    de: { question: "Welches Buch von Nikolaus Kopernikus aus dem Jahr 1543 argumentierte, dass die Erde um die Sonne kreist?", options: ["Principia Mathematica", "Über die Umschwünge der himmlischen Kreise", "Der Sternenbote", "Vom Geist der Gesetze"], explanation: "Kopernikus’ „Über die Umschwünge der himmlischen Kreise“ (1543) leitete den Sturz des erdzentrierten Weltbilds ein." },
    fr: { question: "Quel ouvrage de 1543 de Nicolas Copernic soutint que la Terre tourne autour du Soleil ?", options: ["Principia Mathematica", "Des révolutions des sphères célestes", "Le messager des étoiles", "De l’esprit des lois"], explanation: "« Des révolutions des sphères célestes » de Copernic (1543) amorça le renversement du cosmos centré sur la Terre." },
  },
  'eq47': {
    de: { question: "Wie viele Afrikaner wurden zwischen etwa 1500 und 1900 im Sklavenhandel zwangsweise über den Atlantik verschifft?", options: ["Etwa 2 Millionen", "Etwa 12,5 Millionen", "Etwa 40 Millionen", "Etwa 500.000"], explanation: "Schätzungsweise 12,5 Millionen Afrikaner wurden auf Sklavenschiffe gezwungen; rund 10,7 Millionen überlebten die Mittelpassage." },
    fr: { question: "Entre environ 1500 et 1900, combien d’Africains furent embarqués de force à travers l’Atlantique dans la traite ?", options: ["Environ 2 millions", "Environ 12,5 millions", "Environ 40 millions", "Environ 500 000"], explanation: "On estime que 12,5 millions d’Africains furent forcés sur les navires négriers ; environ 10,7 millions survécurent au passage du milieu." },
  },
  'eq48': {
    de: { question: "Welchen Titel erwarb Süleyman der Prächtige für die Kodifizierung des osmanischen weltlichen Rechts (kanun)?", options: ["„der Eroberer“", "„der Gesetzgeber“", "„der Seefahrer“", "„der gerechte Kalif“"], explanation: "Süleyman kodifizierte das osmanische kanun und erwarb den türkischen Titel „Kanuni“ — „der Gesetzgeber“." },
    fr: { question: "Quel titre Soliman le Magnifique gagna-t-il pour avoir codifié le droit séculier ottoman (kanun) ?", options: ["« le Conquérant »", "« le Législateur »", "« le Navigateur »", "« le Calife juste »"], explanation: "Soliman codifia le kanun ottoman, gagnant le titre turc « Kanuni » — « le Législateur »." },
  },
  'eq49': {
    de: { question: "Um 1700 stellte das Mogul-Indien ungefähr welchen Anteil der weltweiten Manufakturwaren her?", options: ["Etwa ein Viertel", "Etwa 2 %", "Etwa drei Viertel", "Etwa ein Zehntel"], explanation: "Das Mogul-Indien war eine Wirtschaftsmacht, die rund ein Viertel der weltweiten Manufakturen herstellte; europäisches Silber floss ostwärts, um seine Stoffe zu bezahlen." },
    fr: { question: "Vers 1700, l’Inde moghole produisait environ quelle part des produits manufacturés du monde ?", options: ["Environ un quart", "Environ 2 %", "Environ trois quarts", "Environ un dixième"], explanation: "L’Inde moghole était une superpuissance économique produisant environ un quart des manufactures du monde ; l’argent européen affluait vers l’est pour payer ses étoffes." },
  },
  'eq50': {
    de: { question: "Was bewirkten Japans „Sakoku“-Erlasse der 1630er Jahre?", options: ["Sie öffneten Japan für den freien Handel mit Europa", "Sie schlossen Japan für nahezu jeden fremden Kontakt und ließen nur einen niederländischen Posten auf Dejima zu", "Sie schufen ein Parlament", "Sie schafften den Samuraistand ab"], explanation: "Die Sakoku-Erlasse („geschlossenes Land“) verboten Japanern die Ausreise und Fremden die Einreise und ließen nur chinesische und niederländische Händler auf Dejima in Nagasaki zu." },
    fr: { question: "Que firent les édits « sakoku » du Japon des années 1630 ?", options: ["Ils ouvrirent le Japon au libre-échange avec l’Europe", "Ils fermèrent le Japon à presque tout contact étranger, ne laissant qu’un comptoir néerlandais à Dejima", "Ils établirent un parlement", "Ils abolirent la classe des samouraïs"], explanation: "Les édits sakoku (« pays fermé ») interdirent aux Japonais de partir et aux étrangers d’entrer, ne tolérant que les marchands chinois et néerlandais à Dejima, à Nagasaki." },
  },
  'mod1': {
    de: { question: "In welchem Land begann um 1760 die Industrielle Revolution?", options: ["Frankreich", "Deutschland", "Vereinigte Staaten", "Britannien"], explanation: "Britanniens Verbindung von Kohle, Eisen, stabiler Regierung und kolonialen Märkten machte es zur Wiege der Industrialisierung." },
    fr: { question: "Dans quel pays la révolution industrielle commença-t-elle vers 1760 ?", options: ["La France", "L’Allemagne", "Les États-Unis", "La Grande-Bretagne"], explanation: "La combinaison de charbon, de fer, d’un gouvernement stable et de marchés coloniaux fit de la Grande-Bretagne le berceau de l’industrialisation." },
  },
  'mod2': {
    de: { question: "Was war 1914 der unmittelbare Auslöser des Ersten Weltkriegs?", options: ["Deutschlands Einmarsch in Belgien", "Der Untergang der Lusitania", "Die Ermordung des Erzherzogs Franz Ferdinand", "Russlands Mobilmachung"], explanation: "Die Ermordung des österreichisch-ungarischen Thronfolgers Franz Ferdinand in Sarajevo durch den serbischen Nationalisten Gavrilo Princip löste das Bündnissystem aus, das Europa in den Krieg zog." },
    fr: { question: "Quel fut le déclencheur immédiat de la Première Guerre mondiale en 1914 ?", options: ["L’invasion de la Belgique par l’Allemagne", "Le naufrage du Lusitania", "L’assassinat de l’archiduc François-Ferdinand", "La mobilisation de l’armée russe"], explanation: "L’assassinat de l’archiduc austro-hongrois François-Ferdinand à Sarajevo par le nationaliste serbe Gavrilo Princip déclencha le jeu des alliances qui entraîna l’Europe dans la guerre." },
  },
  'mod3': {
    de: { question: "Der Vertrag von Versailles (1919) gab welchem Land die Schuld am Ersten Weltkrieg und auferlegte gewaltige Reparationen?", options: ["Österreich-Ungarn", "Osmanisches Reich", "Deutschland", "Russland"], explanation: "Der „Kriegsschuldartikel“ (Artikel 231) wies Deutschland die Verantwortung zu, was zu Reparationen und Gebietsverlusten führte, die Verbitterung schürten und letztlich den Zweiten Weltkrieg." },
    fr: { question: "Le traité de Versailles (1919) imputa la Première Guerre mondiale à quel pays et lui imposa d’énormes réparations ?", options: ["L’Autriche-Hongrie", "L’Empire ottoman", "L’Allemagne", "La Russie"], explanation: "La « clause de culpabilité de guerre » (article 231) attribua la responsabilité à l’Allemagne, entraînant réparations et pertes territoriales qui nourrirent le ressentiment et, finalement, la Seconde Guerre mondiale." },
  },
  'mod4': {
    de: { question: "Der Holocaust war der nationalsozialistische Völkermord vor allem an welcher Gruppe, neben anderen?", options: ["Slawische Völker", "Roma", "Jüdische Menschen", "Politische Gegner"], explanation: "Sechs Millionen Juden — zwei Drittel des europäischen Judentums — wurden systematisch ermordet. Millionen anderer (Roma, Behinderte, LGBTQ+, politische Gefangene) wurden ebenfalls getötet." },
    fr: { question: "La Shoah fut le génocide nazi visant principalement quel groupe, parmi d’autres ?", options: ["Les peuples slaves", "Les Roms", "Les juifs", "Les opposants politiques"], explanation: "Six millions de juifs — les deux tiers de la communauté juive européenne — furent systématiquement assassinés. Des millions d’autres (Roms, personnes handicapées, LGBTQ+, prisonniers politiques) furent aussi tués." },
  },
  'mod5': {
    de: { question: "Der Kalte Krieg war vor allem ein ideologischer Konflikt zwischen welchen beiden Systemen?", options: ["Demokratie und Faschismus", "Kapitalismus/Demokratie und Kommunismus", "Christentum und Islam", "Kolonialismus und Nationalismus"], explanation: "Der Kalte Krieg stellte den kapitalistisch-demokratischen Westen (angeführt von den USA) gegen den kommunistischen Osten (angeführt von der UdSSR)." },
    fr: { question: "La guerre froide fut avant tout un conflit idéologique entre quels deux systèmes ?", options: ["La démocratie et le fascisme", "Le capitalisme/la démocratie et le communisme", "Le christianisme et l’islam", "Le colonialisme et le nationalisme"], explanation: "La guerre froide opposa l’Ouest capitaliste et démocratique (mené par les États-Unis) à l’Est communiste (mené par l’URSS)." },
  },
  'mod6': {
    de: { question: "Kubakrise 1962 — was war die sowjetische Rechtfertigung für die Stationierung von Raketen auf Kuba?", options: ["Kuba vor einer US-Invasion nach der Schweinebucht zu schützen", "Die USA hatten von der Türkei aus Raketen auf die UdSSR gerichtet", "Kuba erbat sowjetischen Atomschutz", "Die UdSSR wollte einen Marinestützpunkt in der Karibik"], explanation: "Obwohl auch die amerikanischen Jupiter-Raketen in der Türkei ein Faktor in den Verhandlungen waren, war die erklärte sowjetische Rechtfertigung der Schutz Kubas nach der gescheiterten, von der CIA gestützten Invasion in der Schweinebucht 1961." },
    fr: { question: "Crise des missiles de Cuba de 1962 — quelle fut la justification soviétique du déploiement de missiles à Cuba ?", options: ["Protéger Cuba d’une invasion américaine après la baie des Cochons", "Les États-Unis avaient des missiles pointés sur l’URSS depuis la Turquie", "Cuba demanda une protection nucléaire soviétique", "L’URSS voulait une base navale dans les Caraïbes"], explanation: "Bien que les missiles américains Jupiter en Turquie aient aussi pesé dans les négociations, la justification soviétique déclarée était la protection de Cuba après l’échec de l’invasion de la baie des Cochons, soutenue par la CIA, en 1961." },
  },
  'mod7': {
    de: { question: "Welcher indische Führer nutzte gewaltlosen zivilen Ungehorsam, um Indiens Unabhängigkeitsbewegung gegen die britische Herrschaft zu führen?", options: ["Jawaharlal Nehru", "Subhas Chandra Bose", "Muhammad Ali Jinnah", "Mahatma Gandhi"], explanation: "Gandhis Philosophie des Satyagraha (Wahrheitskraft) und des gewaltlosen Widerstands wurde zur Inspiration für Bürgerrechtsbewegungen weltweit." },
    fr: { question: "Quel dirigeant indien recourut à la désobéissance civile non violente pour mener le mouvement d’indépendance de l’Inde contre la domination britannique ?", options: ["Jawaharlal Nehru", "Subhas Chandra Bose", "Muhammad Ali Jinnah", "Mahatma Gandhi"], explanation: "La philosophie de Gandhi, le satyagraha (force de la vérité) et la résistance non violente, devint une source d’inspiration pour les mouvements des droits civiques du monde entier." },
  },
  'mod8': {
    de: { question: "Die Berliner Mauer fiel in welchem Jahr und symbolisierte damit das Ende des Kalten Krieges?", options: ["1985", "1987", "1989", "1991"], explanation: "Die Mauer fiel am 9. November 1989, nachdem die ostdeutsche Regierung verkündet hatte, die Bürger dürften frei übertreten — Menschenmengen rissen sie in jener Nacht nieder." },
    fr: { question: "Le mur de Berlin tomba en quelle année, symbolisant la fin de la guerre froide ?", options: ["1985", "1987", "1989", "1991"], explanation: "Le Mur tomba le 9 novembre 1989, après que le gouvernement est-allemand eut annoncé que les citoyens pouvaient passer librement — la foule le démantela cette nuit-là." },
  },
  'mod9': {
    de: { question: "Wer erfand 1989 das World Wide Web und ermöglichte damit das moderne Internet?", options: ["Steve Jobs", "Bill Gates", "Tim Berners-Lee", "Vint Cerf"], explanation: "Tim Berners-Lee, ein britischer Wissenschaftler am CERN, erfand das World Wide Web (HTTP, HTML und URLs) und stellte es der Öffentlichkeit frei zur Verfügung." },
    fr: { question: "Qui inventa le World Wide Web en 1989, rendant possible l’internet moderne ?", options: ["Steve Jobs", "Bill Gates", "Tim Berners-Lee", "Vint Cerf"], explanation: "Tim Berners-Lee, un scientifique britannique du CERN, inventa le World Wide Web (HTTP, HTML et URL) et le mit gratuitement à la disposition du public." },
  },
  'mod10': {
    de: { question: "Die Anschläge vom 11. September 2001 wurden von welcher Organisation verübt?", options: ["Taliban", "Hisbollah", "IS", "al-Qaida"], explanation: "Al-Qaida unter Führung von Osama bin Laden inszenierte die Anschläge mit entführten Flugzeugen. Die Taliban-Regierung Afghanistans beherbergte al-Qaida und löste damit die US-Invasion aus." },
    fr: { question: "Les attentats du 11 septembre 2001 furent perpétrés par quelle organisation ?", options: ["Les talibans", "Le Hezbollah", "Daech", "Al-Qaïda"], explanation: "Al-Qaïda, dirigée par Oussama ben Laden, orchestra les attentats à l’aide d’avions détournés. Le gouvernement taliban d’Afghanistan abritait al-Qaïda, déclenchant l’invasion américaine." },
  },
  'mod11': {
    de: { question: "Der Hitler-Stalin-Pakt vom August 1939 war ein Nichtangriffsabkommen zwischen welchen beiden Mächten, das die Welt erschütterte?", options: ["Japan und Deutschland", "Der UdSSR und Deutschland", "Italien und Deutschland", "Der UdSSR und Japan"], explanation: "Der geheime deutsch-sowjetische Pakt verblüffte Beobachter, die einen Zusammenstoß ideologischer Feinde erwarteten. Er enthielt geheime Zusatzprotokolle, die Osteuropa in Einflusszonen teilten und Hitler den Einmarsch in Polen ohne sowjetischen Widerstand ermöglichten." },
    fr: { question: "Le pacte germano-soviétique d’août 1939 était un accord de non-agression entre quelles deux puissances, qui stupéfia le monde ?", options: ["Le Japon et l’Allemagne", "L’URSS et l’Allemagne", "L’Italie et l’Allemagne", "L’URSS et le Japon"], explanation: "Le pacte secret nazi-soviétique stupéfia les observateurs qui s’attendaient à un affrontement d’ennemis idéologiques. Il comportait des protocoles secrets partageant l’Europe de l’Est en sphères d’influence, permettant à Hitler d’envahir la Pologne sans opposition soviétique." },
  },
  'mod12': {
    de: { question: "Die Konferenz von Bretton Woods (1944) begründete welche zwei großen internationalen Finanzinstitutionen, die bis heute dominieren?", options: ["WTO und Weltbank", "IWF und Weltbank", "IWF und WTO", "NATO und Weltbank"], explanation: "Bretton Woods schuf den Internationalen Währungsfonds (IWF) zur Stabilisierung der Wechselkurse und die Weltbank zur Finanzierung des Wiederaufbaus. Diese Institutionen prägten die internationale Wirtschaftsordnung der Nachkriegszeit." },
    fr: { question: "La conférence de Bretton Woods (1944) établit quelles deux grandes institutions financières internationales encore dominantes aujourd’hui ?", options: ["L’OMC et la Banque mondiale", "Le FMI et la Banque mondiale", "Le FMI et l’OMC", "L’OTAN et la Banque mondiale"], explanation: "Bretton Woods créa le Fonds monétaire international (FMI) pour stabiliser les taux de change et la Banque mondiale pour financer la reconstruction. Ces institutions façonnèrent l’ordre économique international d’après-guerre." },
  },
  'mod13': {
    de: { question: "Lenins Bolschewiki kamen 1917 in Russland teils an die Macht, indem sie dem russischen Volk welche drei Dinge versprachen?", options: ["Freiheit, Gleichheit und Brot", "Demokratie, Land und Wohlstand", "Frieden, Land und Brot", "Gleichheit, Gerechtigkeit und Arbeit"], explanation: "„Frieden, Land und Brot“ war die eindringliche Losung der Bolschewiki und sprach an, was die Russen am meisten wollten: ein Ende des Ersten Weltkriegs, die Landverteilung von Adligen an Bauern und Nahrung für die hungernde Bevölkerung." },
    fr: { question: "Les bolcheviks de Lénine accédèrent au pouvoir en Russie en 1917 en partie en promettant au peuple russe quelles trois choses ?", options: ["Liberté, égalité et pain", "Démocratie, terre et prospérité", "Paix, terre et pain", "Égalité, justice et travail"], explanation: "« Paix, terre et pain » était le puissant slogan des bolcheviks, répondant à ce que les Russes voulaient le plus : la fin de la Première Guerre mondiale, la redistribution des terres des nobles aux paysans et du pain pour la population affamée." },
  },
  'mod14': {
    de: { question: "Die amerikanische „Domino-Theorie“ — zur Rechtfertigung der Intervention in Vietnam herangezogen — behauptete, dass …", options: ["kommunistische Länder schließlich wie Dominosteine zusammenbrechen würden", "wenn ein Land dem Kommunismus verfiele, die Nachbarländer folgen würden", "wirtschaftliche Entwicklung die Ausbreitung des Kommunismus verhinderte", "Militärbündnisse wie eine Reihe fallender Dominosteine seien"], explanation: "Die von Präsident Eisenhower 1954 popularisierte Domino-Theorie besagte, dass, wenn ein Land dem Kommunismus verfiele (wie Vietnam), die Nachbarländer nacheinander fallen würden. Dieses Denken trieb das US-Engagement in Südostasien an." },
    fr: { question: "La « théorie des dominos » américaine — invoquée pour justifier l’intervention au Vietnam — soutenait que…", options: ["les pays communistes finiraient par s’effondrer comme des dominos", "si un pays tombait au communisme, les pays voisins suivraient", "le développement économique empêchait la propagation du communisme", "les alliances militaires étaient comme une rangée de dominos qui tombent"], explanation: "La théorie des dominos, popularisée par le président Eisenhower en 1954, affirmait que si un pays tombait au communisme (comme le Vietnam), les pays voisins tomberaient l’un après l’autre. Cette pensée guida l’engagement américain en Asie du Sud-Est." },
  },
  'mod15': {
    de: { question: "Welche US-Außenpolitik von 1947 — die Verpflichtung, freie Völker im Widerstand gegen die kommunistische Unterjochung zu unterstützen — wurde zum Eckpfeiler der Strategie des Kalten Krieges?", options: ["Die Monroe-Doktrin", "Der Marshallplan", "Die Truman-Doktrin", "Die Eindämmungspolitik"], explanation: "Die im März 1947 verkündete Truman-Doktrin erbat 400 Millionen Dollar, um Griechenland und der Türkei im Widerstand gegen den kommunistischen Druck zu helfen. Sie wurde zur umfassenderen Doktrin der weltweiten Eindämmung der sowjetischen Expansion — der bestimmenden Strategie des Kalten Krieges." },
    fr: { question: "Quelle politique étrangère américaine de 1947 — s’engageant à soutenir les peuples libres résistant à l’asservissement communiste — devint une pierre angulaire de la stratégie de la guerre froide ?", options: ["La doctrine Monroe", "Le plan Marshall", "La doctrine Truman", "La politique d’endiguement"], explanation: "La doctrine Truman, annoncée en mars 1947, demanda 400 millions de dollars pour aider la Grèce et la Turquie à résister à la pression communiste. Elle devint la doctrine plus large de l’endiguement de l’expansion soviétique dans le monde — la stratégie déterminante de la guerre froide." },
  },
  'mod16': {
    de: { question: "James Watts verbesserte Dampfmaschine (1769 patentiert) verwandelte die Industrie vor allem, indem sie …", options: ["Elektrizität nutzte", "Drehkraft praktikabel und effizient weit weg von Flüssen machte", "mit Benzin lief", "den Kohleverbrauch beseitigte"], explanation: "Watts separater Kondensator und die Drehbewegung befreiten die Fabriken von den Standorten der Wasserräder." },
    fr: { question: "La machine à vapeur perfectionnée de James Watt (brevetée en 1769) transforma l’industrie surtout en…", options: ["utilisant l’électricité", "rendant la force rotative pratique et efficace loin des rivières", "fonctionnant à l’essence", "supprimant l’usage du charbon"], explanation: "Le condenseur séparé et l’engrenage rotatif de Watt libérèrent les usines des sites de roues à eau." },
  },
  'mod17': {
    de: { question: "Die erste kommerzielle Eisenbahnlinie mit Dampflokomotiven (1830) verband Manchester mit …", options: ["London", "Birmingham", "Liverpool", "Leeds"], explanation: "Die Bahn Liverpool–Manchester bewies, dass Personen- und Güterverkehr per Schiene wirtschaftlich tragfähig war." },
    fr: { question: "La première ligne de chemin de fer commerciale à utiliser des locomotives à vapeur (1830) reliait Manchester à…", options: ["Londres", "Birmingham", "Liverpool", "Leeds"], explanation: "Le chemin de fer Liverpool–Manchester prouva la viabilité commerciale du rail pour les voyageurs et le fret." },
  },
  'mod18': {
    de: { question: "Das Kommunistische Manifest (1848) wurde von Karl Marx verfasst und …", options: ["Wladimir Lenin", "Friedrich Engels", "Rosa Luxemburg", "Georgi Plechanow"], explanation: "Marx und Engels veröffentlichten es inmitten der Revolutionen von 1848, die Europa erfassten." },
    fr: { question: "Le Manifeste du parti communiste (1848) fut écrit par Karl Marx et…", options: ["Vladimir Lénine", "Friedrich Engels", "Rosa Luxemburg", "Gueorgui Plekhanov"], explanation: "Marx et Engels le publièrent au milieu des révolutions de 1848 qui balayaient l’Europe." },
  },
  'mod19': {
    de: { question: "Die Berliner Konferenz von 1884–85 wird verbunden mit …", options: ["der deutschen Einigung", "den Regeln für die europäische Aufteilung Afrikas", "dem Kongresssystem", "der Flottenabrüstung"], explanation: "Die europäischen Mächte legten Ansprüche und Regeln der „effektiven Besetzung“ für Afrika fest — kein afrikanischer Vertreter war anwesend." },
    fr: { question: "La conférence de Berlin de 1884–85 est associée à…", options: ["l’unification allemande", "les règles du partage européen de l’Afrique", "le système du Congrès", "le désarmement naval"], explanation: "Les puissances européennes fixèrent des revendications et des règles d’« occupation effective » pour l’Afrique — aucun représentant africain n’y assista." },
  },
  'mod20': {
    de: { question: "Welcher Krieg von 1904–05 endete damit, dass eine asiatische Macht zum ersten Mal in der Neuzeit eine europäische Großmacht besiegte?", options: ["Der Krimkrieg", "Der Russisch-Japanische Krieg", "Der Chinesisch-Japanische Krieg", "Der Boxerkrieg"], explanation: "Japans Vernichtung der russischen Flotte bei Tsushima erschütterte Europa und beflügelte antikoloniale Bewegungen." },
    fr: { question: "Quelle guerre de 1904–05 s’acheva par la victoire, pour la première fois à l’ère moderne, d’une puissance asiatique sur une grande puissance européenne ?", options: ["La guerre de Crimée", "La guerre russo-japonaise", "La guerre sino-japonaise", "La guerre des Boxers"], explanation: "La destruction par le Japon de la flotte russe à Tsushima bouleversa l’Europe et inspira les mouvements anticoloniaux." },
  },
  'mod21': {
    de: { question: "Welche Schlacht von 1916 wurde mit über einer Million Opfern zum Sinnbild der Sinnlosigkeit des Grabenkriegs?", options: ["Tannenberg", "Verdun", "Die Somme", "Gallipoli"], explanation: "Allein am ersten Tag an der Somme erlitt Britannien etwa 57 000 Verluste; monatelange Kämpfe verschoben die Frontlinie um wenige Kilometer." },
    fr: { question: "Quelle bataille de 1916 devint le symbole de l’absurdité de la guerre de tranchées, avec plus d’un million de victimes ?", options: ["Tannenberg", "Verdun", "La Somme", "Gallipoli"], explanation: "Rien qu’au premier jour de la Somme, la Grande-Bretagne subit environ 57 000 pertes ; des mois de combats ne déplacèrent la ligne que de quelques kilomètres." },
  },
  'mod22': {
    de: { question: "Der Vertrag von Versailles (1919) verlangte von Deutschland, dass es …", options: ["seine Marine an Frankreich abtritt", "die Kriegsschuld anerkennt, Reparationen zahlt und abrüstet", "sofort dem Völkerbund beitritt", "den Kaiser wiedereinsetzt"], explanation: "Artikel 231 (Kriegsschuld), Reparationen und militärische Beschränkungen nährten anhaltende Verbitterung, die von Extremisten ausgenutzt wurde." },
    fr: { question: "Le traité de Versailles (1919) exigea de l’Allemagne qu’elle…", options: ["cède sa marine à la France", "reconnaisse la culpabilité de guerre, paie des réparations et désarme", "rejoigne immédiatement la Société des Nations", "restaure le Kaiser"], explanation: "L’article 231 (culpabilité de guerre), les réparations et les limites militaires engendrèrent un ressentiment durable exploité par les extrémistes." },
  },
  'mod23': {
    de: { question: "Russlands Februarrevolution von 1917 erzwang die Abdankung …", options: ["Lenins", "Kerenskis", "Zar Nikolaus’ II.", "Zar Alexanders III."], explanation: "Brotunruhen und Meutereien in Petrograd beendeten binnen Tagen drei Jahrhunderte Romanow-Herrschaft." },
    fr: { question: "La révolution de Février 1917 en Russie contraignit à l’abdication…", options: ["Lénine", "Kerenski", "Le tsar Nicolas II", "Le tsar Alexandre III"], explanation: "Les émeutes du pain et les mutineries à Petrograd mirent fin en quelques jours à trois siècles de règne des Romanov." },
  },
  'mod24': {
    de: { question: "Die bolschewistische Machtergreifung im Oktober 1917 wurde von Lenin geführt und weitgehend organisiert von …", options: ["Stalin", "Trotzki", "Sinowjew", "Bucharin"], explanation: "Trotzki leitete das Militärrevolutionäre Komitee des Petrograder Sowjets, das das Winterpalais einnahm." },
    fr: { question: "La prise du pouvoir bolchevique d’octobre 1917 fut dirigée par Lénine et organisée en grande partie par…", options: ["Staline", "Trotski", "Zinoviev", "Boukharine"], explanation: "Trotski présidait le Comité militaire révolutionnaire du soviet de Petrograd qui s’empara du Palais d’Hiver." },
  },
  'mod25': {
    de: { question: "Die Losung, die am stärksten mit den Bolschewiki von 1917 verbunden ist, war …", options: ["„Freiheit, Gleichheit, Brüderlichkeit“", "„Frieden, Land und Brot“", "nur „Proletarier aller Länder, vereinigt euch“", "„Alle Macht der Duma“"], explanation: "„Frieden, Land und Brot“ und „Alle Macht den Sowjets“ trafen das kriegsmüde, landhungrige Russland." },
    fr: { question: "Le slogan le plus associé aux bolcheviks de 1917 était…", options: ["« Liberté, Égalité, Fraternité »", "« Paix, terre et pain »", "seulement « Prolétaires de tous les pays, unissez-vous »", "« Tout le pouvoir à la Douma »"], explanation: "« Paix, terre et pain » et « Tout le pouvoir aux soviets » exprimaient une Russie lasse de la guerre et avide de terre." },
  },
  'mod26': {
    de: { question: "Der Russische Bürgerkrieg (1918–1922) wurde vor allem zwischen den Roten und … ausgetragen.", options: ["den Grünen", "den Weißen", "den Schwarzen", "den Blauen"], explanation: "Die Weißen Armeen — eine lose antibolschewistische Koalition — wurden von den zentral positionierten Roten Stück für Stück besiegt." },
    fr: { question: "La guerre civile russe (1918–1922) opposa surtout les Rouges aux…", options: ["Verts", "Blancs", "Noirs", "Bleus"], explanation: "Les armées blanches — une coalition antibolchevique disparate — furent défaites une à une par les Rouges, positionnés au centre." },
  },
  'mod27': {
    de: { question: "Stalins erster Fünfjahresplan (1928) zielte vor allem auf …", options: ["Konsumgüter", "rasche Schwerindustrialisierung und die Kollektivierung der Landwirtschaft", "marktwirtschaftliche Reformen", "die Ausweitung der Marine"], explanation: "Die halsbrecherische Industrialisierung wurde durch die Kollektivierung bezahlt, die eine Hungersnot auslöste — darunter den Holodomor in der Ukraine." },
    fr: { question: "Le premier plan quinquennal de Staline (1928) visait avant tout…", options: ["les biens de consommation", "une industrialisation lourde rapide et la collectivisation des campagnes", "une réforme de marché libre", "l’expansion navale"], explanation: "L’industrialisation à marche forcée fut payée par la collectivisation, qui déclencha une famine — dont l’Holodomor en Ukraine." },
  },
  'mod28': {
    de: { question: "Die Große Säuberung von 1936–38 in der UdSSR umfasste …", options: ["die Ausweisung ausländischer Diplomaten", "Schauprozesse und Massenerschießungen von Partei, Armee und Bürgern", "allein das Verbot der Religion", "die Landverteilung"], explanation: "Stalins Terror verschlang alte Bolschewiki, Offiziere der Roten Armee und Hunderttausende gewöhnliche Menschen." },
    fr: { question: "La Grande Terreur de 1936–38 en URSS comporta…", options: ["l’expulsion de diplomates étrangers", "des procès-spectacles et des exécutions de masse du parti, de l’armée et des citoyens", "seulement l’interdiction de la religion", "la redistribution des terres"], explanation: "La terreur de Staline dévora de vieux bolcheviks, des officiers de l’Armée rouge et des centaines de milliers de gens ordinaires." },
  },
  'mod29': {
    de: { question: "Die Weimarer Hyperinflation von 1923 ist in Erinnerung geblieben für …", options: ["Bankverstaatlichungen", "Geld, das so wertlos war, dass man es in Schubkarren transportierte", "eine goldgedeckte Mark", "Verbote von Fremdwährungen"], explanation: "Die Preise verdoppelten sich in Tagen; Ersparnisse lösten sich auf und radikalisierten die deutsche Mittelschicht." },
    fr: { question: "L’hyperinflation de Weimar de 1923 est restée célèbre pour…", options: ["des nationalisations bancaires", "une monnaie si dévaluée qu’on la transportait en brouettes", "un mark adossé à l’or", "l’interdiction des devises étrangères"], explanation: "Les prix doublaient en quelques jours ; les épargnes s’évaporèrent, radicalisant la classe moyenne allemande." },
  },
  'mod30': {
    de: { question: "Das Münchner Abkommen von 1938 gestattete NS-Deutschland die Annexion …", options: ["Österreichs", "des Polnischen Korridors", "des Sudetenlandes der Tschechoslowakei", "Elsass-Lothringens"], explanation: "Britannien und Frankreich nahmen Hitlers Anspruch auf die tschechischen Grenzgebiete an — „Frieden für unsere Zeit“ hielt kein Jahr." },
    fr: { question: "Les accords de Munich de 1938 permirent à l’Allemagne nazie d’annexer…", options: ["l’Autriche", "le corridor polonais", "les Sudètes de Tchécoslovaquie", "l’Alsace-Lorraine"], explanation: "La Grande-Bretagne et la France acceptèrent la revendication d’Hitler sur les régions frontalières tchèques — la « paix pour notre temps » dura moins d’un an." },
  },
  'mod31': {
    de: { question: "Das Unternehmen Barbarossa (Juni 1941) war …", options: ["die alliierte Landung in der Normandie", "Deutschlands Überfall auf die Sowjetunion", "Japans Pazifikoffensive", "der Feldzug in Nordafrika"], explanation: "Die größte Invasion der Geschichte brach den Hitler-Stalin-Pakt und eröffnete die tödlichste Front des Krieges." },
    fr: { question: "L’opération Barbarossa (juin 1941) fut…", options: ["le débarquement allié en Normandie", "l’invasion de l’Union soviétique par l’Allemagne", "l’offensive japonaise dans le Pacifique", "la campagne d’Afrique du Nord"], explanation: "La plus grande invasion de l’histoire rompit le pacte germano-soviétique et ouvrit le front le plus meurtrier de la guerre." },
  },
  'mod32': {
    de: { question: "Die als Wendepunkt der Ostfront geltende Schlacht, die im Februar 1943 endete, war …", options: ["Moskau", "Kursk", "Stalingrad", "Leningrad"], explanation: "Die Einkesselung der deutschen 6. Armee bei Stalingrad zerstörte den Mythos der Unbesiegbarkeit der Wehrmacht." },
    fr: { question: "La bataille considérée comme le tournant du front de l’Est, achevée en février 1943, fut…", options: ["Moscou", "Koursk", "Stalingrad", "Leningrad"], explanation: "L’encerclement de la 6ᵉ armée allemande à Stalingrad détruisit le mythe de l’invincibilité de la Wehrmacht." },
  },
  'mod33': {
    de: { question: "Der industrialisierte Massenmord des Holocaust wurde bei welcher Zusammenkunft 1942 förmlich beschlossen?", options: ["Die Nürnberger Reichsparteitage", "Die Wannsee-Konferenz", "Die Münchner Konferenz", "Die Konferenz von Évian"], explanation: "NS-Funktionäre koordinierten am Wannsee die „Endlösung“ — die Ermordung der Juden Europas, von denen sechs Millionen getötet wurden." },
    fr: { question: "Le meurtre de masse industrialisé de la Shoah fut formalisé lors de quelle réunion de 1942 ?", options: ["Les congrès de Nuremberg", "La conférence de Wannsee", "La conférence de Munich", "La conférence d’Évian"], explanation: "Les responsables nazis coordonnèrent à Wannsee la « solution finale » — le meurtre des juifs d’Europe, dont six millions furent tués." },
  },
  'mod34': {
    de: { question: "Die Landung des D-Day am 6. Juni 1944 fand an den Stränden von … statt.", options: ["Sizilien", "der Normandie", "der Provence", "Calais"], explanation: "Das Unternehmen Overlord eröffnete die Westfront mit der größten amphibischen Landung der Geschichte." },
    fr: { question: "Le débarquement du jour J, le 6 juin 1944, eut lieu sur les plages de…", options: ["Sicile", "Normandie", "Provence", "Calais"], explanation: "L’opération Overlord ouvrit le front de l’Ouest avec le plus grand assaut amphibie de l’histoire." },
  },
  'mod35': {
    de: { question: "Die Vereinten Nationen wurden 1945 auf einer Konferenz in welcher Stadt gegründet?", options: ["New York", "Genf", "San Francisco", "London"], explanation: "Fünfzig Nationen unterzeichneten die UN-Charta im Juni 1945 in San Francisco." },
    fr: { question: "L’Organisation des Nations unies fut fondée en 1945 lors d’une conférence dans quelle ville ?", options: ["New York", "Genève", "San Francisco", "Londres"], explanation: "Cinquante nations signèrent la Charte des Nations unies à San Francisco en juin 1945." },
  },
  'mod36': {
    de: { question: "Der Marshallplan (1948) war darauf angelegt, …", options: ["Deutschland wiederzubewaffnen", "die europäischen Volkswirtschaften wiederaufzubauen und den Reiz des Kommunismus zu dämpfen", "die UNO zu finanzieren", "die NATO zu gründen"], explanation: "Rund 13 Milliarden Dollar US-Hilfe belebten die vom Krieg verwüsteten westeuropäischen Volkswirtschaften." },
    fr: { question: "Le plan Marshall (1948) visait à…", options: ["réarmer l’Allemagne", "reconstruire les économies européennes et émousser l’attrait du communisme", "financer l’ONU", "créer l’OTAN"], explanation: "Environ 13 milliards de dollars d’aide américaine ranimèrent les économies d’Europe occidentale dévastées par la guerre." },
  },
  'mod37': {
    de: { question: "Die Berliner Luftbrücke (1948–49) war eine Antwort auf …", options: ["den Bau der Berliner Mauer", "eine sowjetische Blockade der Landwege West-Berlins", "eine Hungersnot in Deutschland", "einen Putsch in Ostdeutschland"], explanation: "Alliierte Flugzeuge versorgten elf Monate lang 2 Millionen West-Berliner, bis Stalin die Blockade aufhob." },
    fr: { question: "Le pont aérien de Berlin (1948–49) répondait à…", options: ["la construction du mur de Berlin", "un blocus soviétique des voies terrestres de Berlin-Ouest", "une famine en Allemagne", "un coup d’État en Allemagne de l’Est"], explanation: "Les avions alliés ravitaillèrent 2 millions de Berlinois de l’Ouest pendant 11 mois, jusqu’à ce que Staline lève le blocus." },
  },
  'mod38': {
    de: { question: "Mahatma Gandhis Salzmarsch von 1930 protestierte gegen …", options: ["Baumwollzölle", "das britische Salzmonopol und die Salzsteuer", "die Rassentrennung in der Eisenbahn", "Landbeschlagnahmungen"], explanation: "Der 380 km lange Marsch, um in Dandi Salz zu gewinnen, verwandelte eine alltägliche Steuer in eine moralische Anklage der Kolonialherrschaft." },
    fr: { question: "La marche du sel de Mahatma Gandhi en 1930 protestait contre…", options: ["les tarifs sur le coton", "le monopole britannique du sel et sa taxe", "la ségrégation dans les chemins de fer", "les saisies de terres"], explanation: "La marche de 380 km pour récolter du sel à Dandi transforma une taxe banale en réquisitoire moral contre la domination coloniale." },
  },
  'mod39': {
    de: { question: "Die Teilung Britisch-Indiens von 1947 schuf welche zwei unabhängigen Staaten?", options: ["Indien und Ceylon", "Indien und Pakistan", "Indien und Bangladesch", "Indien und Burma"], explanation: "Die Teilung vertrieb etwa 14 Millionen Menschen inmitten gemeinschaftlicher Gewalt, die Hunderttausende tötete." },
    fr: { question: "La partition de l’Inde britannique de 1947 créa quels deux États indépendants ?", options: ["L’Inde et Ceylan", "L’Inde et le Pakistan", "L’Inde et le Bangladesh", "L’Inde et la Birmanie"], explanation: "La partition déplaça quelque 14 millions de personnes au milieu de violences communautaires qui tuèrent des centaines de milliers de gens." },
  },
  'mod40': {
    de: { question: "Pakistans Gründervater, der die Forderung der Muslimliga nach einem eigenen Staat anführte, war …", options: ["Jawaharlal Nehru", "Muhammad Ali Jinnah", "Liaquat Ali Khan", "Abul Kalam Azad"], explanation: "Jinnah wurde im August 1947 Pakistans erster Generalgouverneur." },
    fr: { question: "Le père fondateur du Pakistan, qui mena la revendication de la Ligue musulmane pour un État séparé, était…", options: ["Jawaharlal Nehru", "Muhammad Ali Jinnah", "Liaquat Ali Khan", "Abul Kalam Azad"], explanation: "Jinnah devint le premier gouverneur général du Pakistan en août 1947." },
  },
  'mod41': {
    de: { question: "Die Linie, die Indien und Pakistan 1947 teilte, wurde von einem britischen Juristen gezogen und ist bekannt als die …", options: ["Durand-Linie", "Radcliffe-Linie", "McMahon-Linie", "Curzon-Linie"], explanation: "Cyril Radcliffe, der nie in Indien gewesen war, hatte fünf Wochen Zeit, den Punjab und Bengalen zu teilen." },
    fr: { question: "La ligne divisant l’Inde et le Pakistan en 1947 fut tracée par un juriste britannique et est connue sous le nom de…", options: ["Ligne Durand", "Ligne Radcliffe", "Ligne McMahon", "Ligne Curzon"], explanation: "Cyril Radcliffe, qui n’était jamais allé en Inde, eut cinq semaines pour partager le Pendjab et le Bengale." },
  },
  'mod42': {
    de: { question: "Gandhi wurde im Januar 1948 ermordet von …", options: ["einem britischen Offizier", "einem Hindu-Nationalisten", "einem Aktivisten der Muslimliga", "einem Kommunisten"], explanation: "Nathuram Godse erschoss Gandhi wegen dessen aus seiner Sicht zu großen Zugeständnissen an die Muslime und an Pakistan." },
    fr: { question: "Gandhi fut assassiné en janvier 1948 par…", options: ["un officier britannique", "un nationaliste hindou", "un militant de la Ligue musulmane", "un communiste"], explanation: "Nathuram Godse abattit Gandhi pour ce qu’il jugeait des concessions aux musulmans et au Pakistan." },
  },
  'mod43': {
    de: { question: "Die Kubakrise von 1962 endete, als die UdSSR die Raketen abzog im Austausch gegen …", options: ["kubanische Neutralität", "ein US-Versprechen, Kuba nicht zu überfallen (und den stillen Abzug der US-Raketen aus der Türkei)", "UN-Kontrolle über Kuba", "nichts"], explanation: "Dreizehn Tage am nuklearen Abgrund endeten mit gegenseitigen Zugeständnissen — einem öffentlichen, einem geheimen." },
    fr: { question: "La crise des missiles de Cuba de 1962 s’acheva quand l’URSS retira ses missiles en échange de…", options: ["la neutralité cubaine", "un engagement américain de ne pas envahir Cuba (et le retrait discret des missiles américains de Turquie)", "un contrôle de Cuba par l’ONU", "rien"], explanation: "Treize jours au bord du gouffre nucléaire s’achevèrent par des concessions mutuelles — l’une publique, l’autre secrète." },
  },
  'mod44': {
    de: { question: "Die Berliner Mauer fiel in welchem Jahr?", options: ["1987", "1989", "1991", "1993"], explanation: "Am 9. November 1989 öffnete Ost-Berlin die Übergänge; das berühmteste Sinnbild des Kalten Krieges wurde von Menschenmengen abgetragen." },
    fr: { question: "Le mur de Berlin tomba en quelle année ?", options: ["1987", "1989", "1991", "1993"], explanation: "Le 9 novembre 1989, Berlin-Est ouvrit les points de passage ; le symbole le plus célèbre de la guerre froide fut démantelé par la foule." },
  },
  'mod45': {
    de: { question: "Die Sowjetunion wurde förmlich aufgelöst im Jahr …", options: ["1989", "1990", "1991", "1993"], explanation: "Am 26. Dezember 1991 hörte die UdSSR auf zu bestehen und wurde durch fünfzehn unabhängige Republiken ersetzt." },
    fr: { question: "L’Union soviétique fut officiellement dissoute en…", options: ["1989", "1990", "1991", "1993"], explanation: "Le 26 décembre 1991, l’URSS cessa d’exister, remplacée par quinze républiques indépendantes." },
  },
  'mod46': {
    de: { question: "Welches Massaker von 1919, als britische Truppen in Amritsar auf eine unbewaffnete Menge feuerten, elektrisierte den indischen Nationalismus?", options: ["Der Vorfall von Chauri Chaura", "Das Massaker von Jallianwala Bagh", "Die Morde von Kalkutta", "Das Massaker von Kanpur"], explanation: "General Dyers Truppen töteten Hunderte Zivilisten in dem ummauerten Garten und diskreditierten die moralischen Ansprüche Britanniens." },
    fr: { question: "Quel massacre de 1919, lorsque des troupes britanniques ouvrirent le feu sur une foule désarmée à Amritsar, galvanisa le nationalisme indien ?", options: ["L’incident de Chauri Chaura", "Le massacre de Jallianwala Bagh", "Les tueries de Calcutta", "Le massacre de Kanpur"], explanation: "Les troupes du général Dyer tuèrent des centaines de civils dans le jardin clos, discréditant les prétentions morales britanniques." },
  },
  'mod47': {
    de: { question: "Das „Jahr Afrikas“ der Entkolonialisierung, als siebzehn Nationen die Unabhängigkeit erlangten, war …", options: ["1955", "1960", "1963", "1970"], explanation: "Allein 1960 wurden siebzehn afrikanische Staaten — die meisten ehemalige französische Kolonien — unabhängig." },
    fr: { question: "L’« année de l’Afrique » de la décolonisation, où dix-sept nations accédèrent à l’indépendance, fut…", options: ["1955", "1960", "1963", "1970"], explanation: "Rien qu’en 1960, dix-sept États africains — pour la plupart d’anciennes colonies françaises — devinrent indépendants." },
  },
  'mod48': {
    de: { question: "Nelson Mandela wurde Südafrikas erster demokratisch gewählter Präsident im Jahr …", options: ["1990", "1994", "1996", "1999"], explanation: "Die Wahl von 1994 beendete die Apartheid-Herrschaft; Mandela war vier Jahre zuvor aus der Haft entlassen worden." },
    fr: { question: "Nelson Mandela devint le premier président d’Afrique du Sud démocratiquement élu en…", options: ["1990", "1994", "1996", "1999"], explanation: "L’élection de 1994 mit fin au régime d’apartheid ; Mandela était sorti de prison quatre ans plus tôt." },
  },
  'mod49': {
    de: { question: "Die Mondlandung von Apollo 11 fand in welchem Jahr statt?", options: ["1965", "1967", "1969", "1972"], explanation: "Armstrong und Aldrin betraten am 20. Juli 1969 den Mond und erfüllten Kennedys Versprechen bis zum Ende des Jahrzehnts." },
    fr: { question: "L’alunissage d’Apollo 11 eut lieu en quelle année ?", options: ["1965", "1967", "1969", "1972"], explanation: "Armstrong et Aldrin marchèrent sur la Lune le 20 juillet 1969, tenant la promesse de Kennedy d’y parvenir avant la fin de la décennie." },
  },
  'mod50': {
    de: { question: "Der direkte militärisch-forschungstechnische Vorläufer des Internets, erstmals 1969 verbunden, hieß …", options: ["ETHERNET", "ARPANET", "INTRANET", "MILNET"], explanation: "Die erste Nachricht des ARPANET („LO“ — das System stürzte mitten in „LOGIN“ ab) ging zwischen der UCLA und Stanford über." },
    fr: { question: "L’ancêtre direct de l’internet, issu de la recherche militaire et connecté pour la première fois en 1969, s’appelait…", options: ["ETHERNET", "ARPANET", "INTRANET", "MILNET"], explanation: "Le premier message d’ARPANET (« LO » — le système planta au milieu de « LOGIN ») passa entre l’UCLA et Stanford." },
  },

  // ── PREHISTORIC (preq1–preq50) ───────────────────────────────────────────────
  'preq1': {
    de: { question: "Die ersten bekannten Homininen, wie Sahelanthropus (~7 Mio. Jahre), wurden in Afrika gefunden. Was war die erste große menschliche Anpassung?", options: ["Ein großes Gehirn", "Der aufrechte Gang auf zwei Beinen", "Der Gebrauch des Feuers", "Die gesprochene Sprache"], explanation: "Der aufrechte Gang — nicht ein großes Gehirn — kam zuerst und befreite die Hände. Alles Übrige folgte aus diesen befreiten Händen." },
    fr: { question: "Les premiers hominidés connus, comme Sahélanthrope (~7 M.a.), furent trouvés en Afrique. Quelle fut la première grande adaptation humaine ?", options: ["Un grand cerveau", "La marche debout sur deux jambes", "L’usage du feu", "Le langage parlé"], explanation: "La bipédie — et non un grand cerveau — vint d’abord, libérant les mains. Tout le reste découla de ces mains libérées." },
  },
  'preq2': {
    de: { question: "Das berühmte Fossil „Lucy“, das vor ~3,2 Mio. Jahren lebte, gehörte zu welcher Art?", options: ["Homo habilis", "Australopithecus afarensis", "Homo erectus", "Paranthropus boisei"], explanation: "Lucy war ein Australopithecus afarensis; ihr Becken und Knie beweisen, dass sie völlig aufrecht ging, obwohl ihr Gehirn klein war." },
    fr: { question: "Le célèbre fossile « Lucy », qui vécut il y a ~3,2 M.a., appartenait à quelle espèce ?", options: ["Homo habilis", "Australopithecus afarensis", "Homo erectus", "Paranthropus boisei"], explanation: "Lucy était un Australopithecus afarensis ; son bassin et son genou prouvent qu’elle marchait pleinement debout bien que son cerveau fût petit." },
  },
  'preq3': {
    de: { question: "Die Fußspuren von Laetoli in Tansania (~3,6 Mio. Jahre) sind wichtig, weil sie beweisen …", options: ["Den ersten Gebrauch von Steinwerkzeugen", "Dass Homininen lange vor großen Gehirnen oder Werkzeugen aufrecht gingen", "Die früheste Beherrschung des Feuers", "Die erste Bestattung der Toten"], explanation: "Die Spuren mit modernem Gewölbe und nach vorn weisender großer Zehe zeigen den aufrechten Gang eine Million Jahre vor den ersten Steinwerkzeugen." },
    fr: { question: "Les empreintes de Laetoli en Tanzanie (~3,6 M.a.) sont importantes car elles prouvent…", options: ["Le premier usage d’outils de pierre", "Que les hominidés marchaient debout bien avant les grands cerveaux ou les outils", "La plus ancienne maîtrise du feu", "La première inhumation des morts"], explanation: "Les empreintes, à la voûte moderne et au gros orteil pointant vers l’avant, montrent la marche debout un million d’années avant les premiers outils de pierre." },
  },
  'preq4': {
    de: { question: "Die ältesten Steinwerkzeuge der Erde — das Oldowan-Werkzeug (~2,6 Mio. Jahre) — wurden zuerst auf welchem Kontinent hergestellt?", options: ["Asien", "Europa", "Afrika", "Australien"], explanation: "Die Oldowan-Geröllgeräte und -Abschläge stammen aus Äthiopien; das Werkzeugmachen veränderte die Ernährung und mit der Zeit das Gehirn." },
    fr: { question: "Les plus anciens outils de pierre de la Terre — l’outillage oldowayen (~2,6 M.a.) — furent d’abord fabriqués sur quel continent ?", options: ["Asie", "Europe", "Afrique", "Australie"], explanation: "Les choppers et éclats oldowayens proviennent d’Éthiopie ; la fabrication d’outils transforma le régime et, avec le temps, le cerveau." },
  },
  'preq5': {
    de: { question: "Welcher Hominine war der erste, der Afrika verließ?", options: ["Australopithecus afarensis", "Homo erectus", "Homo sapiens", "Die Neandertaler"], explanation: "Homo erectus (~1,9 Mio. Jahre) breitete sich über Asien aus und hinterließ Fossilien bis nach Indonesien und China." },
    fr: { question: "Quel hominidé fut le premier à quitter l’Afrique ?", options: ["Australopithecus afarensis", "Homo erectus", "Homo sapiens", "Les Néandertaliens"], explanation: "Homo erectus (~1,9 M.a.) se répandit à travers l’Asie, laissant des fossiles jusqu’en Indonésie et en Chine." },
  },
  'preq6': {
    de: { question: "Der Primatologe Richard Wrangham argumentierte, welche Tätigkeit sei der wahre Motor der Evolution des menschlichen Gehirns gewesen?", options: ["Großwildjagd", "Das Kochen von Nahrung mit Feuer", "Das Herstellen von Steinwerkzeugen", "Weite Fußmärsche"], explanation: "Kochen „verdaut“ Nahrung vor und setzt mehr Kalorien bei weniger Kauen frei — Energie, die unsere großen, hungrigen Gehirne bezahlte." },
    fr: { question: "Le primatologue Richard Wrangham a soutenu que quelle activité fut le véritable moteur de l’évolution du cerveau humain ?", options: ["La chasse au gros gibier", "La cuisson des aliments par le feu", "La fabrication d’outils de pierre", "La marche sur de longues distances"], explanation: "La cuisson « prédigère » les aliments, libérant plus de calories avec moins de mastication — l’énergie qui paya nos grands cerveaux affamés." },
  },
  'preq7': {
    de: { question: "Der tropfenförmige acheuléische Faustkeil war vor allem bemerkenswert, weil …", options: ["Er aus Bronze bestand", "Er über eine Million Jahre nahezu unverändert auf drei Kontinenten gefertigt wurde", "Er nur für den Krieg verwendet wurde", "Er von Homo sapiens erfunden wurde"], explanation: "Derselbe symmetrische Entwurf wurde über eine Million Jahre in Afrika, Europa und Asien gefertigt — die langlebigste Technik der Menschheitsgeschichte." },
    fr: { question: "Le biface acheuléen en forme de larme fut remarquable surtout parce que…", options: ["Il était fait de bronze", "Il fut fabriqué presque inchangé pendant plus d’un million d’années sur trois continents", "Il ne servait qu’à la guerre", "Il fut inventé par Homo sapiens"], explanation: "Le même dessin symétrique fut fabriqué en Afrique, en Europe et en Asie pendant plus d’un million d’années — la technologie la plus durable de l’histoire humaine." },
  },
  'preq8': {
    de: { question: "Ungefähr wie viel Prozent Neandertaler-DNA tragen moderne Menschen nicht-afrikanischer Abstammung?", options: ["0 %", "1–2 %", "10–15 %", "Etwa die Hälfte"], explanation: "Die Vermischung vor etwa 50.000–60.000 Jahren hinterließ ~1–2 % Neandertaler-DNA bei allen Nachkommen derer, die Afrika verließen." },
    fr: { question: "Environ quel pourcentage d’ADN néandertalien portent les humains modernes d’ascendance non africaine ?", options: ["0 %", "1–2 %", "10–15 %", "Environ la moitié"], explanation: "Le métissage d’il y a quelque 50 000–60 000 ans laissa ~1–2 % d’ADN néandertalien chez tous les descendants de ceux qui quittèrent l’Afrique." },
  },
  'preq9': {
    de: { question: "Der Beweis, dass Neandertaler ihre Kranken und Verletzten pflegten, stammt vor allem aus welcher Höhle?", options: ["Lascaux", "Chauvet", "Shanidar", "Altamira"], explanation: "In der Shanidar-Höhle im Irak überlebte ein schwer verletzter Mann jahrelang — seine Gruppe muss ihn ernährt und gepflegt haben." },
    fr: { question: "La preuve que les Néandertaliens soignaient leurs malades et blessés provient surtout de quelle grotte ?", options: ["Lascaux", "Chauvet", "Shanidar", "Altamira"], explanation: "Dans la grotte de Shanidar, en Irak, un homme gravement blessé survécut des années — sa bande dut le nourrir et le soigner." },
  },
  'preq10': {
    de: { question: "Unsere eigene Art, Homo sapiens, entstand zuerst in Afrika vor ungefähr wie langer Zeit?", options: ["~50.000 Jahren", "~120.000 Jahren", "~300.000 Jahren", "~1 Mio. Jahren"], explanation: "Die ältesten Homo-sapiens-Fossilien aus Jebel Irhoud in Marokko datieren auf etwa 300.000 Jahre." },
    fr: { question: "Notre propre espèce, Homo sapiens, apparut d’abord en Afrique il y a environ combien de temps ?", options: ["~50 000 ans", "~120 000 ans", "~300 000 ans", "~1 M d’années"], explanation: "Les plus anciens fossiles d’Homo sapiens, de Jebel Irhoud au Maroc, datent d’environ 300 000 ans." },
  },
  'preq11': {
    de: { question: "Australien vor mindestens 50.000 Jahren zu erreichen ist erstaunlich, weil es … erforderte.", options: ["Eine Landbrücke zu Fuß zu überqueren", "Absichtliche Seereisen über offenen Ozean", "Eine Wüstendurchquerung zu überleben", "Die ersten Städte zu bauen"], explanation: "Selbst bei den niedrigsten eiszeitlichen Meeresspiegeln bedeutete Australien zu erreichen, offenen Ozean zu überqueren — der älteste Beleg für Seefahrt." },
    fr: { question: "Atteindre l’Australie il y a au moins 50 000 ans est stupéfiant car cela exigeait…", options: ["De traverser un pont terrestre à pied", "Des traversées maritimes délibérées en haute mer", "De survivre à une traversée du désert", "De bâtir les premières villes"], explanation: "Même aux plus bas niveaux marins de la glaciation, atteindre l’Australie signifiait traverser la haute mer — la plus ancienne preuve de navigation." },
  },
  'preq12': {
    de: { question: "Die Höhlenmalereien von Chauvet in Frankreich — Löwen, Nashörner und Pferde — sind ungefähr wie alt?", options: ["~5.000 Jahre", "~17.000 Jahre", "~36.000 Jahre", "~100.000 Jahre"], explanation: "Die Malereien von Chauvet sind etwa 36.000 Jahre alt; noch ältere figürliche Kunst (ein Warzenschwein) ist aus Indonesien bekannt." },
    fr: { question: "Les peintures de la grotte Chauvet en France — lions, rhinocéros et chevaux — ont environ quel âge ?", options: ["~5 000 ans", "~17 000 ans", "~36 000 ans", "~100 000 ans"], explanation: "Les peintures de Chauvet ont environ 36 000 ans ; un art figuratif encore plus ancien (un cochon verruqueux) est connu d’Indonésie." },
  },
  'preq13': {
    de: { question: "Die Landwirtschaft (die Neolithische Revolution) begann vor etwa 10.000 Jahren zuerst in welcher Region?", options: ["Das Niltal", "Der Fruchtbare Halbmond", "Nordchina", "Zentralmexiko"], explanation: "Der Fruchtbare Halbmond hatte eine seltene Ansammlung wilder Pflanzen und Tiere zur Domestikation — Weizen, Gerste, Schafe und Ziegen." },
    fr: { question: "L’agriculture (la révolution néolithique) débuta il y a environ 10 000 ans d’abord dans quelle région ?", options: ["La vallée du Nil", "Le Croissant fertile", "Le nord de la Chine", "Le centre du Mexique"], explanation: "Le Croissant fertile avait un rare ensemble de plantes et d’animaux sauvages propices à la domestication — blé, orge, moutons et chèvres." },
  },
  'preq14': {
    de: { question: "Göbekli Tepe (~9500 v. Chr.) stürzte alte Theorien um, weil diese monumentale Steinstätte errichtet wurde …", options: ["Von den ersten Königen Ägyptens", "Von Jägern und Sammlern, vor Landwirtschaft und Töpferei", "Mit Eisenwerkzeugen", "Nach der Erfindung der Schrift"], explanation: "Die älteste monumentale Architektur errichteten Jäger und Sammler, was andeutet, dass der Wunsch, sich zum Ritual zu versammeln, zur Sesshaftigkeit trieb." },
    fr: { question: "Göbekli Tepe (~9500 av. J.-C.) renversa les vieilles théories car ce site monumental de pierre fut bâti…", options: ["Par les premiers rois d’Égypte", "Par des chasseurs-cueilleurs, avant l’agriculture et la poterie", "Avec des outils de fer", "Après l’invention de l’écriture"], explanation: "La plus ancienne architecture monumentale fut dressée par des chasseurs-cueilleurs, suggérant que le désir de se rassembler pour le rituel poussa vers la vie sédentaire." },
  },
  'preq15': {
    de: { question: "Um welches ungefähre Datum begann das tiefe, wortlose Zeitalter der Urgeschichte den Städten und der Schrift zu weichen?", options: ["10.000 v. Chr.", "3000 v. Chr.", "500 v. Chr.", "1 n. Chr."], explanation: "Um etwa 3000 v. Chr. schwollen neolithische Dörfer der großen Flusstäler zu Städten an, und die erste Schrift beendete die Urgeschichte." },
    fr: { question: "Vers quelle date approximative l’âge profond et sans mots de la préhistoire commença-t-il à céder la place aux villes et à l’écriture ?", options: ["10 000 av. J.-C.", "3000 av. J.-C.", "500 av. J.-C.", "1 apr. J.-C."], explanation: "Vers 3000 av. J.-C., les villages néolithiques des grandes vallées fluviales enflaient en villes, et la première écriture mit fin à la préhistoire." },
  },
  'preq16': {
    de: { question: "Wer grub 1974 „Lucy“ in der Afar-Region Äthiopiens aus?", options: ["Mary Leakey", "Louis Leakey", "Donald Johanson", "Raymond Dart"], explanation: "Der Paläoanthropologe Donald Johanson fand rund 40 % von Lucys Skelett — dem berühmtesten Fossil der Welt." },
    fr: { question: "Qui exhuma « Lucy » dans la région de l’Afar en Éthiopie en 1974 ?", options: ["Mary Leakey", "Louis Leakey", "Donald Johanson", "Raymond Dart"], explanation: "Le paléoanthropologue Donald Johanson trouva environ 40 % du squelette de Lucy — le fossile le plus célèbre du monde." },
  },
  'preq17': {
    de: { question: "Das Fossil „Lucy“ erhielt seinen Spitznamen nach …", options: ["Der Tochter des Wissenschaftlers", "Einem Beatles-Lied, das im Lager lief", "Dem Tal, in dem es gefunden wurde", "Einem lokalen Afar-Wort"], explanation: "Sie wurde nach „Lucy in the Sky with Diamonds“ benannt, das im Ausgrabungslager lief." },
    fr: { question: "Le fossile « Lucy » reçut son surnom d’après…", options: ["La fille du scientifique", "Une chanson des Beatles qui passait au campement", "La vallée où il fut trouvé", "Un mot afar local"], explanation: "Elle fut nommée d’après « Lucy in the Sky with Diamonds », qui passait au campement de fouilles." },
  },
  'preq18': {
    de: { question: "Paranthropus boisei wurde wegen seiner … „Nussknackermensch“ genannt.", options: ["Angewohnheit, Nüsse mit Steinen zu knacken", "Massiven Zähne und Kiefer zum Zermahlen zäher Wurzeln und Samen", "Nussförmigen Schädels", "Ernährung nur aus Baumnüssen"], explanation: "Der schwerkiefrige „robuste“ Australopithecine hatte Zähne, die zum Zermahlen zäher Pflanzenkost gebaut waren." },
    fr: { question: "Paranthropus boisei fut surnommé « l’Homme casse-noix » à cause de ses…", options: ["Habitude de casser des noix avec des pierres", "Dents et mâchoires massives pour broyer racines et graines coriaces", "Crâne en forme de noix", "Régime uniquement de noix d’arbre"], explanation: "L’australopithèque « robuste » à mâchoire lourde avait des dents faites pour broyer des végétaux coriaces." },
  },
  'preq19': {
    de: { question: "Die moderne Wissenschaft beschreibt die menschliche Evolution nicht als Leiter, sondern als …", options: ["Einen geraden Marsch des Fortschritts", "Einen verzweigten Busch, dessen Äste fast alle Sackgassen sind", "Eine einzige ununterbrochene Linie", "Einen Kreis, der zum Ursprung zurückkehrt"], explanation: "Mehrere Homininenarten koexistierten oft; wir sind die einzigen Überlebenden einer einst dicht bevölkerten, verzweigten Familie." },
    fr: { question: "La science moderne décrit l’évolution humaine non comme une échelle, mais comme…", options: ["Une marche rectiligne du progrès", "Un buisson ramifié dont presque toutes les branches sont des impasses", "Une seule lignée ininterrompue", "Un cercle revenant à son origine"], explanation: "Plusieurs espèces d’hominidés coexistèrent souvent ; nous sommes les seuls survivants d’une famille jadis populeuse et ramifiée." },
  },
  'preq20': {
    de: { question: "Welcher jüngste wissenschaftliche Zeuge erlaubt es, die genetischen Beziehungen zwischen verschwundenen Völkern direkt zu lesen?", options: ["Radiokohlenstoffdatierung", "Alte DNA", "Pollenanalyse", "Dendrochronologie"], explanation: "Alte DNA aus alten Knochen offenbart die genetischen Verbindungen zwischen ausgestorbenen Menschenpopulationen." },
    fr: { question: "Quel témoin scientifique récent permet de lire directement les liens génétiques entre des peuples disparus ?", options: ["La datation au radiocarbone", "L’ADN ancien", "L’analyse du pollen", "La dendrochronologie"], explanation: "L’ADN ancien extrait de vieux os révèle les liens génétiques entre des populations humaines éteintes." },
  },
  'preq21': {
    de: { question: "„Java-Mensch“ und „Peking-Mensch“ sind berühmte Fossilien welcher Art?", options: ["Homo habilis", "Homo erectus", "Homo neanderthalensis", "Australopithecus afarensis"], explanation: "Homo erectus, der erste, der Afrika verließ, hinterließ Fossilien in ganz Asien, darunter Indonesien und nahe Peking." },
    fr: { question: "« Homme de Java » et « Homme de Pékin » sont de célèbres fossiles de quelle espèce ?", options: ["Homo habilis", "Homo erectus", "Homo neanderthalensis", "Australopithecus afarensis"], explanation: "Homo erectus, le premier à quitter l’Afrique, laissa des fossiles dans toute l’Asie, dont l’Indonésie et les environs de Pékin." },
  },
  'preq22': {
    de: { question: "Ungefähr wie lange bestand Homo erectus als Art?", options: ["Etwa 100.000 Jahre", "Etwa 500.000 Jahre", "Fast 2 Mio. Jahre", "Etwa 50.000 Jahre"], explanation: "Homo erectus bestand fast zwei Millionen Jahre — etwa zehnmal länger, als unsere eigene Art bislang existiert." },
    fr: { question: "Environ combien de temps Homo erectus dura-t-il en tant qu’espèce ?", options: ["Environ 100 000 ans", "Environ 500 000 ans", "Près de 2 M d’années", "Environ 50 000 ans"], explanation: "Homo erectus dura près de deux millions d’années — environ dix fois plus longtemps que notre propre espèce jusqu’ici." },
  },
  'preq23': {
    de: { question: "Verbrannte Knochen und Asche, die auf Feuergebrauch in einer Unterkunft vor mindestens einer Million Jahren hindeuten, stammen aus welcher Stätte?", options: ["Olduvai-Schlucht", "Wonderwerk-Höhle", "Zhoukoudian", "Blombos-Höhle"], explanation: "Die Wonderwerk-Höhle in Südafrika bewahrt einige der ältesten Belege für kontrolliertes Feuer." },
    fr: { question: "Des os brûlés et des cendres suggérant l’usage du feu dans un abri il y a au moins un million d’années proviennent de quel site ?", options: ["Gorges d’Olduvai", "Grotte de Wonderwerk", "Zhoukoudian", "Grotte de Blombos"], explanation: "La grotte de Wonderwerk, en Afrique du Sud, conserve certaines des plus anciennes preuves de feu maîtrisé." },
  },
  'preq24': {
    de: { question: "Das menschliche Gehirn ist metabolisch teuer und verbrennt in Ruhe etwa welchen Anteil unserer Kalorien?", options: ["Ein Zwanzigstel", "Ein Zehntel", "Ein Fünftel", "Die Hälfte"], explanation: "Das Gehirn verbrennt in Ruhe etwa ein Fünftel unserer Kalorien — Energie, die das Kochen der Nahrung liefern half." },
    fr: { question: "Le cerveau humain est métaboliquement coûteux, brûlant au repos environ quelle part de nos calories ?", options: ["Un vingtième", "Un dixième", "Un cinquième", "La moitié"], explanation: "Le cerveau brûle environ un cinquième de nos calories au repos — une énergie que la cuisson des aliments aida à fournir." },
  },
  'preq25': {
    de: { question: "Die Neandertaler wurden zuerst anhand eines Fundes von 1856 in welchem Land erkannt?", options: ["Frankreich", "Spanien", "Deutschland", "Irak"], explanation: "Das Typusexemplar wurde im Neandertal nahe Düsseldorf in Deutschland gefunden." },
    fr: { question: "Les Néandertaliens furent d’abord reconnus à partir d’une découverte de 1856 dans quel pays ?", options: ["France", "Espagne", "Allemagne", "Irak"], explanation: "Le spécimen type fut trouvé dans la vallée de Neander (Neandertal), près de Düsseldorf, en Allemagne." },
  },
  'preq26': {
    de: { question: "Der verfeinerte Neandertaler-Steinwerkzeugsatz, auf einer „Kernvorbereitungs“-Technik beruhend, heißt …", options: ["Oldowan", "Acheuléen", "Moustérien", "Aurignacien"], explanation: "Die Moustérien-Industrie löste Abschläge vorbestimmter Form von sorgfältig vorbereiteten Kernen ab." },
    fr: { question: "L’outillage de pierre néandertalien raffiné, fondé sur une technique de « nucléus préparé », s’appelle…", options: ["Oldowayen", "Acheuléen", "Moustérien", "Aurignacien"], explanation: "L’industrie moustérienne détachait des éclats de forme prédéterminée à partir de nucléus soigneusement préparés." },
  },
  'preq27': {
    de: { question: "In welcher Höhle überlebte ein Neandertaler jahrelang mit einem verkümmerten Arm und einer zerschmetterten Augenhöhle, was auf Pflege durch andere hindeutet?", options: ["Shanidar-Höhle", "Lascaux", "Denisova-Höhle", "Chauvet"], explanation: "Der Mann der Shanidar-Höhle im Irak hätte nicht jagen können; seine Gruppe muss ihn ernährt und gepflegt haben — ein Beleg für Mitgefühl." },
    fr: { question: "Dans quelle grotte un Néandertalien survécut-il des années avec un bras atrophié et une orbite écrasée, impliquant des soins d’autrui ?", options: ["Grotte de Shanidar", "Lascaux", "Grotte de Denisova", "Chauvet"], explanation: "L’homme de la grotte de Shanidar, en Irak, n’aurait pu chasser ; sa bande dut le nourrir et le soigner — une preuve de compassion." },
  },
  'preq28': {
    de: { question: "Neandertaler besaßen welches Gen, das bei modernen Menschen mit Sprache verknüpft ist?", options: ["BRCA1", "FOXP2", "HAR1", "MYH16"], explanation: "Neandertaler trugen das mit Sprechen und Sprache verbundene FOXP2-Gen, samt der Anatomie zum Sprechen." },
    fr: { question: "Les Néandertaliens possédaient quel gène, lié chez les humains modernes au langage ?", options: ["BRCA1", "FOXP2", "HAR1", "MYH16"], explanation: "Les Néandertaliens portaient le gène FOXP2 associé à la parole et au langage, ainsi que l’anatomie de la parole." },
  },
  'preq29': {
    de: { question: "Die Denisova-Menschen wurden 2010 erstmals anhand eines Fingerknochens aus einer Höhle wo identifiziert?", options: ["der Altai-Region in Sibirien", "dem Zagros-Gebirge", "der Levante", "der Insel Flores"], explanation: "Ein einzelner Fingerknochen aus der Denisova-Höhle in Sibirien lieferte die DNA einer zuvor unbekannten Menschenpopulation." },
    fr: { question: "Les Dénisoviens furent identifiés pour la première fois en 2010 à partir d’un os de doigt trouvé dans une grotte où ?", options: ["la région de l’Altaï en Sibérie", "les monts Zagros", "le Levant", "l’île de Florès"], explanation: "Un seul os de doigt de la grotte de Denisova, en Sibérie, livra l’ADN d’une population humaine jusqu’alors inconnue." },
  },
  'preq30': {
    de: { question: "Der winzige „Hobbit“-Mensch, der auf einer indonesischen Insel lebte, war …", options: ["Homo naledi", "Homo floresiensis", "Homo heidelbergensis", "Homo antecessor"], explanation: "Homo floresiensis, „Hobbit“ genannt, teilte die jüngere Welt mit Neandertalern, Denisova-Menschen und unserer eigenen Art." },
    fr: { question: "Le minuscule humain « hobbit » qui vécut sur une île d’Indonésie était…", options: ["Homo naledi", "Homo floresiensis", "Homo heidelbergensis", "Homo antecessor"], explanation: "Homo floresiensis, surnommé le « hobbit », partagea le monde récent avec les Néandertaliens, les Dénisoviens et notre propre espèce." },
  },
  'preq31': {
    de: { question: "Eine von den Denisova-Menschen ererbte Genvariante hilft heute welchem Volk, in großer Höhe zu gedeihen?", options: ["Den Inuit", "Den Tibetern", "Den andinen Quechua", "Den San"], explanation: "Eine Denisova-Variante hilft heutigen Tibetern, mit der dünnen Luft großer Höhen zurechtzukommen." },
    fr: { question: "Une variante génique héritée des Dénisoviens aide aujourd’hui quel peuple à prospérer en altitude ?", options: ["Les Inuits", "Les Tibétains", "Les Quechuas andins", "Les San"], explanation: "Une variante dénisovienne aide les Tibétains modernes à composer avec l’air raréfié des hautes altitudes." },
  },
  'preq32': {
    de: { question: "Die ältesten Fossilien, die wie Homo sapiens aussehen (~300.000 Jahre), stammen aus welcher Stätte?", options: ["Olduvai-Schlucht, Tansania", "Jebel Irhoud, Marokko", "Sterkfontein, Südafrika", "Omo, Äthiopien"], explanation: "Jebel Irhoud in Marokko verschob die Geburt unserer Art auf ~300.000 Jahre und über den ganzen Kontinent." },
    fr: { question: "Les plus anciens fossiles ressemblant à Homo sapiens (~300 000 ans) proviennent de quel site ?", options: ["Gorges d’Olduvai, Tanzanie", "Jebel Irhoud, Maroc", "Sterkfontein, Afrique du Sud", "Omo, Éthiopie"], explanation: "Jebel Irhoud, au Maroc, repoussa la naissance de notre espèce à ~300 000 ans et à travers tout le continent." },
  },
  'preq33': {
    de: { question: "Warum tragen Völker außerhalb Afrikas weniger genetische Vielfalt als Afrikaner?", options: ["Sie entwickelten sich langsamer", "Sie stammen von einer kleinen Gründerpopulation ab — einem „Flaschenhals“", "Sie vermischten sich weniger", "Afrikas Klima erhöhte die Mutation"], explanation: "Fast alle außerhalb Afrikas Lebenden stammen von einer vergleichsweise kleinen Gruppe ab, die Afrika vor ~60.000–70.000 Jahren verließ." },
    fr: { question: "Pourquoi les peuples hors d’Afrique portent-ils moins de diversité génétique que les Africains ?", options: ["Ils ont évolué plus lentement", "Ils descendent d’une petite population fondatrice — un « goulot d’étranglement »", "Ils se sont moins métissés", "Le climat de l’Afrique augmenta la mutation"], explanation: "Presque tous ceux qui vivent hors d’Afrique descendent d’un groupe relativement petit qui quitta l’Afrique il y a ~60 000–70 000 ans." },
  },
  'preq34': {
    de: { question: "Das riesige, wombatähnliche Beuteltier, das nach der Ankunft der Menschen in Australien verschwand, war der …", options: ["Megalania", "Diprotodon", "Thylacinus", "Glyptodon"], explanation: "Der zwei Tonnen schwere Diprotodon gehörte zu den Riesenbeutlern Australiens, die bald nach der Ankunft der Menschen verschwanden." },
    fr: { question: "Le marsupial géant semblable à un wombat qui disparut après l’arrivée des humains en Australie était le…", options: ["Megalania", "Diprotodon", "Thylacine", "Glyptodon"], explanation: "Le Diprotodon de deux tonnes fut parmi les marsupiaux géants d’Australie qui disparurent peu après l’arrivée des gens." },
  },
  'preq35': {
    de: { question: "Die Menschen betraten die Amerikas erstmals über welche freigelegte eiszeitliche Landbrücke?", options: ["Doggerland", "Sundaland", "Beringia", "Sahul"], explanation: "Beringia, eine breite Grassteppe dort, wo heute die Beringstraße liegt, verband Sibirien während der Eiszeit mit Alaska." },
    fr: { question: "Les humains pénétrèrent d’abord dans les Amériques en franchissant quel pont terrestre glaciaire dégagé ?", options: ["Doggerland", "Sundaland", "Béringie", "Sahul"], explanation: "La Béringie, une large prairie là où se trouve aujourd’hui le détroit de Béring, reliait la Sibérie à l’Alaska pendant la glaciation." },
  },
  'preq36': {
    de: { question: "Welche zwei Steine brechen vorhersehbar und glasartig, ideal zum Schlagen scharfer Werkzeuge?", options: ["Granit und Marmor", "Feuerstein und Obsidian", "Sandstein und Schiefer", "Basalt und Quarzit"], explanation: "Feuerstein und Obsidian brechen muschelig, sodass ein gut gezielter Schlag einen scharfen Abschlag ablöst." },
    fr: { question: "Quelles deux pierres se fracturent de façon prévisible et vitreuse, idéales pour tailler des outils tranchants ?", options: ["Granit et marbre", "Silex et obsidienne", "Grès et ardoise", "Basalte et quartzite"], explanation: "Le silex et l’obsidienne se fracturent de façon conchoïdale, de sorte qu’un coup bien dirigé détache un éclat tranchant." },
  },
  'preq37': {
    de: { question: "Die „Kernvorbereitungs“-Technik der Werkzeugherstellung verbreitete sich über die Alte Welt um wann?", options: ["Vor 2,6 Mio. Jahren", "Vor 1,7 Mio. Jahren", "Vor 300.000 Jahren", "Vor 12.000 Jahren"], explanation: "Vor etwa 300.000 Jahren formten Klopfer einen Kern so, dass ein Schlag einen Abschlag vorbestimmter Größe ablöste." },
    fr: { question: "La technique de fabrication d’outils à « nucléus préparé » se répandit dans l’Ancien Monde vers quand ?", options: ["Il y a 2,6 M d’années", "Il y a 1,7 M d’années", "Il y a 300 000 ans", "Il y a 12 000 ans"], explanation: "Il y a environ 300 000 ans, les tailleurs façonnaient un nucléus de sorte qu’un coup détache un éclat de taille prédéterminée." },
  },
  'preq38': {
    de: { question: "Die Erfindung von Nadeln mit Öhr im Jungpaläolithikum erlaubte den Menschen …", options: ["Mit Netzen zu fischen", "Passgenaue Kleidung zu nähen", "Körbe zu flechten", "Löcher in Stein zu bohren"], explanation: "Knochennadeln mit Öhr erlaubten eiszeitlichen Menschen, passgenaue Kleidung zu nähen, entscheidend zum Überleben der Kälte." },
    fr: { question: "L’invention d’aiguilles à chas au Paléolithique supérieur permit aux gens de…", options: ["Pêcher au filet", "Coudre des vêtements ajustés", "Tresser des paniers", "Percer la pierre"], explanation: "Les aiguilles en os à chas permirent aux gens de la glaciation de coudre des vêtements ajustés, cruciaux pour survivre au froid." },
  },
  'preq39': {
    de: { question: "Um welchen Zeitpunkt kamen Pfeil und Bogen in weiten Gebrauch?", options: ["Vor 2 Mio. Jahren", "Das Ende der Eiszeit", "Die Bronzezeit", "Die Römerzeit"], explanation: "Der Bogen — der einem Jäger erlaubte, lautlos aus der Ferne zu töten — war gegen Ende der Eiszeit weit verbreitet." },
    fr: { question: "Vers quel moment l’arc et la flèche entrèrent-ils en usage répandu ?", options: ["Il y a 2 M d’années", "La fin de la glaciation", "L’âge du bronze", "L’époque romaine"], explanation: "L’arc — qui permettait à un chasseur de tuer silencieusement de loin — était d’usage répandu à la fin de la glaciation." },
  },
  'preq40': {
    de: { question: "Die älteste bekannte figürliche Kunst, ein ~45.500 Jahre altes Warzenschwein, wurde wo gefunden?", options: ["Frankreich", "Spanien", "Indonesien", "Südafrika"], explanation: "Eine Warzenschwein-Malerei auf der Insel Sulawesi, Indonesien, ist das älteste bekannte figürliche Kunstwerk." },
    fr: { question: "L’art figuratif le plus ancien connu, un cochon verruqueux de ~45 500 ans, fut trouvé où ?", options: ["France", "Espagne", "Indonésie", "Afrique du Sud"], explanation: "Une peinture de cochon verruqueux sur l’île de Célèbes (Sulawesi), en Indonésie, est la plus ancienne œuvre figurative connue." },
  },
  'preq41': {
    de: { question: "Der 40.000 Jahre alte Löwenmensch von Hohlenstein-Stadel gilt vielleicht als wichtigstes Objekt der Urgeschichte, weil er …", options: ["Die älteste menschliche Skulptur ist", "Ein Wesen darstellt, das es in der Natur nicht gibt — Beleg der Vorstellungskraft", "Aus massivem Gold geschnitzt wurde", "Die ersten Schriftzeichen zeigt"], explanation: "Ein löwenköpfiger Mensch aus Mammutelfenbein stellt etwas nie Gesehenes dar — das Wesen des vorstellenden Geistes." },
    fr: { question: "L’Homme-Lion de Hohlenstein-Stadel, vieux de 40 000 ans, est peut-être l’objet le plus important de la préhistoire car il…", options: ["Est la plus ancienne sculpture humaine", "Représente un être qui n’existe pas dans la nature — preuve d’imagination", "Fut sculpté dans l’or massif", "Montre les premiers signes écrits"], explanation: "Un humain à tête de lion sculpté dans l’ivoire de mammouth représente quelque chose de jamais vu — l’essence de l’esprit qui imagine." },
  },
  'preq42': {
    de: { question: "Die berühmte Venusfigur von Willendorf wurde vor ungefähr wie langer Zeit geschnitzt?", options: ["~10.000 Jahren", "~25.000 Jahren", "~45.000 Jahren", "~5.000 Jahren"], explanation: "Die Venus von Willendorf, vor etwa 25.000 Jahren geschnitzt, ist eine von vielen ähnlichen eiszeitlichen „Venusfiguren“." },
    fr: { question: "La célèbre figurine Vénus de Willendorf fut sculptée il y a environ combien de temps ?", options: ["~10 000 ans", "~25 000 ans", "~45 000 ans", "~5 000 ans"], explanation: "La Vénus de Willendorf, sculptée il y a quelque 25 000 ans, est l’une des nombreuses « figurines de Vénus » glaciaires similaires." },
  },
  'preq43': {
    de: { question: "Im letzten glazialen Maximum (~20.000 Jahre) war so viel Wasser im Eis gebunden, dass der globale Meeresspiegel um mehr als … fiel.", options: ["10 Meter", "40 Meter", "100 Meter", "300 Meter"], explanation: "Der Meeresspiegel fiel um über hundert Meter und legte Landbrücken wie Beringia und ertrunkene Küstenebenen frei." },
    fr: { question: "Au dernier maximum glaciaire (~20 000 ans), tant d’eau était emprisonnée dans la glace que le niveau global des mers baissa de plus de…", options: ["10 mètres", "40 mètres", "100 mètres", "300 mètres"], explanation: "Le niveau des mers baissa de plus de cent mètres, dégageant des ponts terrestres comme la Béringie et des plaines côtières noyées." },
  },
  'preq44': {
    de: { question: "Die weite, kalte, trockene Grassteppe, die während der Eiszeit von Spanien über Eurasien bis zum Yukon reichte, heißt …", options: ["Taiga", "Mammutsteppe", "Tundragürtel", "Sahul-Ebene"], explanation: "Die Mammutsteppe wimmelte von Mammuts, Wollnashörnern, Pferden, Bisons und Rentieren." },
    fr: { question: "La vaste steppe herbeuse froide et sèche qui allait de l’Espagne à travers l’Eurasie jusqu’au Yukon pendant la glaciation s’appelle la…", options: ["taïga", "steppe à mammouths", "ceinture de toundra", "plaine de Sahul"], explanation: "La steppe à mammouths grouillait de mammouths, rhinocéros laineux, chevaux, bisons et rennes." },
  },
  'preq45': {
    de: { question: "Das Aussterben der eiszeitlichen Megafauna war in Afrika am mildesten. Die beste Erklärung ist, dass afrikanische Tiere …", options: ["Zu groß zum Jagen waren", "Sich Millionen Jahre mit Homininen gemeinsam entwickelt hatten", "Dort lebten, wo sich das Klima nie änderte", "Durch frühe Gesetze geschützt waren"], explanation: "Da sie sich über Zeitalter mit Homininen entwickelt hatten, war die afrikanische Megafauna vorsichtiger gegenüber Menschen; das Aussterben traf am härtesten, wo Tiere zum ersten Mal auf Menschen trafen." },
    fr: { question: "Les extinctions de mégafaune glaciaire furent les plus douces en Afrique. La meilleure explication est que les animaux africains…", options: ["Étaient trop grands pour être chassés", "Avaient coévolué avec les hominidés pendant des millions d’années", "Vivaient là où le climat ne changeait jamais", "Étaient protégés par des lois anciennes"], explanation: "Ayant évolué aux côtés des hominidés durant des âges, la mégafaune africaine se méfiait davantage des humains ; les extinctions frappèrent le plus fort là où les animaux rencontrèrent les gens pour la première fois." },
  },
  'preq46': {
    de: { question: "Die warme, stabile geologische Epoche, die vor ~11.700 Jahren begann und in der wir noch leben, ist das …", options: ["Pleistozän", "Holozän", "Pliozän", "Miozän"], explanation: "Das warme, stabile Klima des Holozäns bereitete die Bühne für die Erfindung der Landwirtschaft." },
    fr: { question: "L’époque géologique chaude et stable qui commença il y a ~11 700 ans et dans laquelle nous vivons encore est l’…", options: ["Pléistocène", "Holocène", "Pliocène", "Miocène"], explanation: "Le climat chaud et stable de l’Holocène prépara la scène pour l’invention de l’agriculture." },
  },
  'preq47': {
    de: { question: "Manche Gelehrte nennen die Landwirtschaft „den schlimmsten Fehler in der Geschichte des Menschengeschlechts“, weil die ersten Bauern oft … waren.", options: ["Von ihren Nachbarn ausgelöscht", "Kleiner, kränker und abgearbeiteter als die Sammler", "Unfähig, Nahrung zu lagern", "Gezwungen, das Feuer aufzugeben"], explanation: "Eine auf wenige Feldfrüchte verengte Ernährung brachte Mangel, faulende Zähne, neue Massenkrankheiten und Hungergefahr — doch die Landwirtschaft siegte, weil sie mehr Menschen ernährte." },
    fr: { question: "Certains savants appellent l’agriculture « la pire erreur de l’histoire de la race humaine » parce que les premiers agriculteurs étaient souvent…", options: ["Exterminés par leurs voisins", "Plus petits, plus maladifs et plus usés que les cueilleurs", "Incapables de stocker la nourriture", "Contraints d’abandonner le feu"], explanation: "Un régime réduit à quelques cultures apportait carences, dents cariées, nouvelles maladies d’entassement et risque de famine — mais l’agriculture l’emporta en nourrissant plus de gens." },
  },
  'preq48': {
    de: { question: "Im Hochland Mexikos wurde Mais aus welchem struppigen wilden Gras domestiziert?", options: ["Emmer", "Teosinte", "Sorghum", "Einkorn"], explanation: "Mais wurde über Generationen aus Teosinte gezüchtet, samt Bohnen und Kürbis — eine der unabhängigen Erfindungen der Landwirtschaft." },
    fr: { question: "Dans les hautes terres du Mexique, le maïs fut domestiqué à partir de quelle herbe sauvage chétive ?", options: ["Amidonnier", "Téosinte", "Sorgho", "Engrain"], explanation: "Le maïs fut sélectionné au fil des générations à partir du téosinte, avec haricots et courges — l’une des inventions indépendantes de l’agriculture." },
  },
  'preq49': {
    de: { question: "Die Protostadt Çatalhöyük war auffällig ungewöhnlich, weil ihre Häuser …", options: ["Aus Steinblöcken gebaut waren", "Keine Straßen oder ebenerdigen Türen hatten und durchs Dach betreten wurden", "Einen zentralen Palast umgaben", "Auf Holzpfählen standen"], explanation: "Ihre Lehmziegelhäuser waren Wand an Wand gedrängt; die Menschen gingen über die Dächer und stiegen über Leitern in ihre Häuser hinab." },
    fr: { question: "La proto-ville de Çatalhöyük était frappante d’insolite car ses maisons…", options: ["Étaient faites de blocs de pierre", "N’avaient ni rues ni portes au niveau du sol et se pénétraient par le toit", "Entouraient un palais central", "Reposaient sur des pilotis de bois"], explanation: "Ses maisons de brique crue étaient serrées mur contre mur ; les gens marchaient sur les toits et descendaient par des échelles dans leurs logis." },
  },
  'preq50': {
    de: { question: "Um 3300 v. Chr. stellten die Menschen die erste echte Bronze her, indem sie Kupfer mit … legierten.", options: ["Eisen", "Blei", "Zinn", "Silber"], explanation: "Mit Zinn legiertes Kupfer ergibt Bronze — hart genug für ernsthafte Werkzeuge und Waffen und schloss die Steinzeit ab." },
    fr: { question: "Vers 3300 av. J.-C., les gens firent le premier vrai bronze en alliant le cuivre à…", options: ["Le fer", "Le plomb", "L’étain", "L’argent"], explanation: "Le cuivre allié à l’étain donne le bronze — assez dur pour des outils et des armes sérieux, refermant l’âge de pierre." },
  },
};

export function getTranslatedQuestionDeFr(questionId: string, lang: Language): QuizQuestionTranslation | null {
  if (lang !== 'de' && lang !== 'fr') return null;
  return QUIZ_TRANS_DEFR[questionId]?.[lang] ?? null;
}
