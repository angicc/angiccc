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
    de: { question: "Indiens Maurya-Reich wurde von welchem Herrscher gegründet?", options: ["Ashoka", "Chandragupta Maurya", "Harsha", "Kanischka"], explanation: "Chandragupta riss um 322 v. Chr. Magadha an sich und errichtete das erste Reich, das den größten Teil des Subkontinents umspannte." },
    fr: { question: "L’Empire maurya de l’Inde fut fondé par quel souverain ?", options: ["Ashoka", "Chandragupta Maurya", "Harsha", "Kanishka"], explanation: "Chandragupta s’empara du Magadha vers 322 av. J.-C. et bâtit le premier empire couvrant la majeure partie du sous-continent." },
  },
  'aq42': {
    de: { question: "Der Qin-König, der 221 v. Chr. China einte und dessen erster Kaiser wurde, war …", options: ["Konfuzius", "Qin Shihuangdi", "Wu von Han", "Sunzi"], explanation: "Qin Shihuangdi vereinheitlichte Schrift, Maße und Münzen und wurde mit der Terrakotta-Armee bestattet." },
    fr: { question: "Le roi de Qin qui unifia la Chine en 221 av. J.-C. et en devint le premier empereur était…", options: ["Confucius", "Qin Shi Huang", "Wu des Han", "Sun Tzu"], explanation: "Qin Shi Huang normalisa l’écriture, les poids et la monnaie, et fut enterré avec l’armée de terre cuite." },
  },
  'aq43': {
    de: { question: "Welche von Han Feizi vertretene chinesische Philosophie hielt strenge Gesetze und harte Strafen für die Grundlage der Ordnung?", options: ["Konfuzianismus", "Daoismus", "Legalismus", "Mohismus"], explanation: "Der Legalismus lenkte die rücksichtslose Effizienz des Qin-Staates; spätere Dynastien milderten ihn mit konfuzianischer Ethik." },
    fr: { question: "Quelle philosophie chinoise, défendue par Han Feizi, tenait des lois strictes et des châtiments sévères pour le fondement de l’ordre ?", options: ["Confucianisme", "Taoisme", "Légisme", "Moïsme"], explanation: "Le légisme guida l’efficacité impitoyable de l’État de Qin ; les dynasties suivantes l’adoucirent par l’éthique confucéenne." },
  },
  'aq44': {
    de: { question: "Der Codex Hammurapi ist am bekanntesten für welchen Rechtsgrundsatz?", options: ["Geschworenengericht", "Vergeltungsjustiz („Auge um Auge“)", "Unschuldsvermutung", "Gewaltenteilung"], explanation: "Seine lex talionis bemaß die Strafe nach der Tat — und nach dem sozialen Rang der Beteiligten." },
    fr: { question: "Le Code de Hammurabi est surtout connu pour quel principe juridique ?", options: ["Le procès par jury", "La justice rétributive (« œil pour œil »)", "La présomption d’innocence", "La séparation des pouvoirs"], explanation: "Sa lex talionis proportionnait le châtiment au délit — et au rang social des personnes concernées." },
  },
  'aq45': {
    de: { question: "Welche antike Zivilisation errichtete in Harappa und Mohenjo-daro geplante Städte mit rasterförmigen Straßen und fortgeschrittener Entwässerung?", options: ["Die Indus-Kultur", "Sumer", "Das alte Ägypten", "Die Minoer"], explanation: "Die Indus-Städte (~2600–1900 v. Chr.) zeigen eine ausgefeilte Stadtplanung; ihre Schrift bleibt unentziffert." },
    fr: { question: "Quelle civilisation antique bâtit à Harappa et Mohenjo-daro des villes planifiées, aux rues en damier et au drainage perfectionné ?", options: ["La civilisation de l’Indus", "Sumer", "L’Égypte antique", "Les Minoens"], explanation: "Les villes de l’Indus (v. 2600–1900 av. J.-C.) témoignent d’un urbanisme sophistiqué ; leur écriture demeure indéchiffrée." },
  },
  'aq46': {
    de: { question: "Der Peloponnesische Krieg wurde mit beispielloser analytischer Strenge von welchem Historiker geschildert?", options: ["Herodot", "Thukydides", "Xenophon", "Polybios"], explanation: "Thukydides, ein athenischer Feldherr im Krieg, verfasste eine berühmt nüchterne Darstellung der Machtpolitik." },
    fr: { question: "La guerre du Péloponnèse fut relatée avec une rigueur analytique inédite par quel historien ?", options: ["Hérodote", "Thucydide", "Xénophon", "Polybe"], explanation: "Thucydide, général athénien pendant la guerre, écrivit un récit fameusement dénué de sentimentalité sur la politique de puissance." },
  },
  'aq47': {
    de: { question: "Alexanders des Großen Lehrer während seiner Jugend in Makedonien war …", options: ["Platon", "Sokrates", "Aristoteles", "Isokrates"], explanation: "Philipp II. verpflichtete Aristoteles, den jugendlichen Alexander in Mieza zu unterrichten." },
    fr: { question: "Le précepteur d’Alexandre le Grand durant sa jeunesse en Macédoine était…", options: ["Platon", "Socrate", "Aristote", "Isocrate"], explanation: "Philippe II engagea Aristote pour enseigner à l’adolescent Alexandre à Miéza." },
  },
  'aq48': {
    de: { question: "Der Ausdruck „Pyrrhussieg“ stammt von König Pyrrhos von Epirus’ verlustreichen Schlachten gegen welche Macht?", options: ["Karthago", "Makedonien", "Rom", "Persien"], explanation: "Pyrrhos schlug römische Heere bei Herakleia und Asculum, verlor aber Truppen, die er nicht ersetzen konnte — „noch so ein Sieg, und wir sind verloren“." },
    fr: { question: "L’expression « victoire à la Pyrrhus » vient des batailles coûteuses du roi Pyrrhus d’Épire contre quelle puissance ?", options: ["Carthage", "Macédoine", "Rome", "Perse"], explanation: "Pyrrhus battit les armées romaines à Héraclée et à Ausculum, mais perdit des troupes irremplaçables — « encore une telle victoire et nous sommes perdus »." },
  },
  'aq49': {
    de: { question: "Welches kuschitische Königreich südlich Ägyptens entwickelte eine eigene Schrift und errichtete mehr Pyramiden als Ägypten selbst?", options: ["Aksum", "Meroë", "Punt", "Nubien unter Napata"], explanation: "Das Königreich Kusch mit Zentrum in Meroë errichtete Hunderte steilwandiger Pyramiden und gedieh durch Eisen und Handel." },
    fr: { question: "Quel royaume koushite, au sud de l’Égypte, développa sa propre écriture et bâtit plus de pyramides que l’Égypte elle-même ?", options: ["Aksoum", "Méroé", "Pount", "La Nubie sous Napata"], explanation: "Le royaume de Koush, centré sur Méroé, éleva des centaines de pyramides à parois abruptes et prospéra grâce au fer et au commerce." },
  },
  'aq50': {
    de: { question: "Die Pax Romana begann mit der Herrschaft welches Kaisers?", options: ["Julius Cäsar", "Augustus", "Tiberius", "Mark Aurel"], explanation: "Augustus’ Ordnung von 27 v. Chr. eröffnete zwei Jahrhunderte relativen inneren Friedens und Wohlstands." },
    fr: { question: "La Pax Romana commença avec le règne de quel empereur ?", options: ["Jules César", "Auguste", "Tibère", "Marc Aurèle"], explanation: "Le règlement d’Auguste en 27 av. J.-C. ouvrit deux siècles de paix intérieure et de prospérité relatives." },
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
    de: { question: "Timbuktu, berühmt für seine Handschriften und seine Universität, blühte in welchem Reich?", options: ["Ghana", "Mali und später Songhai", "Äthiopien", "Groß-Simbabwe"], explanation: "Unter Mali und dann Songhai verankerte Timbuktus Sankoré-Moschee eine gefeierte Gelehrtengemeinschaft." },
    fr: { question: "Tombouctou, célèbre pour ses manuscrits et son université, prospéra dans quel empire ?", options: ["Le Ghana", "Le Mali puis le Songhaï", "L’Éthiopie", "Le Grand Zimbabwe"], explanation: "Sous le Mali puis le Songhaï, la mosquée de Sankoré de Tombouctou ancra une communauté savante renommée." },
  },
  'mq42': {
    de: { question: "Der Investiturstreit des 11.–12. Jahrhunderts war ein Ringen um …", options: ["die Finanzierung der Kreuzzüge", "ob Könige oder Päpste Bischöfe ernannten", "die Berechnung des Osterdatums", "kirchliche Steuerbefreiungen"], explanation: "Der Konflikt Kaiser Heinrichs IV. mit Papst Gregor VII. — einschließlich seiner Buße in Canossa — prägte die Rivalität von Kirche und Staat." },
    fr: { question: "La querelle des Investitures des XIᵉ–XIIᵉ siècles fut un conflit portant sur…", options: ["le financement des croisades", "le fait que rois ou papes nommaient les évêques", "la date de Pâques", "les exemptions fiscales de l’Église"], explanation: "L’affrontement de l’empereur Henri IV avec le pape Grégoire VII — dont sa pénitence à Canossa — définit la rivalité entre l’Église et l’État." },
  },
  'mq43': {
    de: { question: "Gotische Kathedralen erreichten ihre aufragende Höhe und ihre riesigen Fenster vor allem durch …", options: ["dickere Mauern", "Strebebögen und Spitzbögen", "Betonkuppeln", "Fachwerk"], explanation: "Äußere Strebepfeiler trugen den Schub des Gewölbes ab und gaben die Wände für Buntglas frei." },
    fr: { question: "Les cathédrales gothiques atteignirent leur hauteur vertigineuse et leurs vastes vitraux surtout grâce…", options: ["à des murs plus épais", "aux arcs-boutants et aux arcs brisés", "à des dômes de béton", "à des charpentes de bois"], explanation: "Les arcs-boutants extérieurs reprenaient la poussée des voûtes, libérant les murs pour les vitraux." },
  },
  'mq44': {
    de: { question: "Europas erste Universitäten, etwa Bologna und Paris, entstanden in welchen Jahrhunderten?", options: ["9.–10.", "11.–13.", "14.–15.", "6.–7."], explanation: "Bologna (Recht) und Paris (Theologie) organisierten sich im Hochmittelalter als Zünfte von Studenten und Magistern." },
    fr: { question: "Les premières universités d’Europe, comme Bologne et Paris, apparurent au cours de quels siècles ?", options: ["IXᵉ–Xᵉ", "XIᵉ–XIIIᵉ", "XIVᵉ–XVᵉ", "VIᵉ–VIIᵉ"], explanation: "Bologne (droit) et Paris (théologie) s’organisèrent en corporations d’étudiants et de maîtres au Haut Moyen Âge." },
  },
  'mq45': {
    de: { question: "Die Hanse war …", options: ["ein Kreuzfahrerorden", "ein nordeuropäischer Bund von Handelsstädten", "ein französischer Ritterkodex", "ein päpstliches Gericht"], explanation: "Lübeck, Hamburg und Dutzende Städte an Ostsee und Nordsee stimmten Handelsprivilegien ab und führten sogar Krieg." },
    fr: { question: "La Ligue hanséatique était…", options: ["un ordre de croisade", "une fédération nord-européenne de villes marchandes", "un code chevaleresque français", "une cour pontificale"], explanation: "Lübeck, Hambourg et des dizaines de villes de la Baltique et de la mer du Nord coordonnaient leurs privilèges commerciaux et menaient même la guerre." },
  },
  'mq46': {
    de: { question: "Welcher Wikinger-Entdecker erreichte um 1000 n. Chr. Nordamerika?", options: ["Erik der Rote", "Leif Eriksson", "Harald Hardrada", "Ragnar Lodbrok"], explanation: "Leifs „Vinland“-Fahrten werden durch die nordische Stätte von L’Anse aux Meadows auf Neufundland bestätigt." },
    fr: { question: "Quel explorateur viking atteignit l’Amérique du Nord vers l’an 1000 ?", options: ["Erik le Rouge", "Leif Erikson", "Harald Hardrada", "Ragnar Lodbrok"], explanation: "Les voyages de Leif au « Vinland » sont confirmés par le site nordique de L’Anse aux Meadows, à Terre-Neuve." },
  },
  'mq47': {
    de: { question: "Die Waräger — an den östlichen Flüssen tätige Nordmänner — halfen, welchen Staat zu gründen?", options: ["Polen", "Ungarn", "Die Kiewer Rus", "Bulgarien"], explanation: "Nordisch geführte Krieger-Händler-Eliten um Nowgorod und Kiew bildeten die Kiewer Rus, den Vorläufer Russlands und der Ukraine." },
    fr: { question: "Les Varègues — des Scandinaves actifs sur les fleuves de l’est — contribuèrent à fonder quel État ?", options: ["La Pologne", "La Hongrie", "La Rus’ de Kiev", "La Bulgarie"], explanation: "Des élites de guerriers-marchands scandinaves autour de Novgorod et de Kiev formèrent la Rus’ de Kiev, ancêtre de la Russie et de l’Ukraine." },
  },
  'mq48': {
    de: { question: "Wat Tyler führte 1381 welchen Aufstand in England an?", options: ["Die Jacquerie", "Den Bauernaufstand", "Die Pilgrimage of Grace", "Den Lollarden-Aufstand"], explanation: "Der Zorn über Kopfsteuern nach der Pest brachte Rebellenheere nach London, ehe der Aufstand niedergeschlagen wurde." },
    fr: { question: "Wat Tyler mena quel soulèvement en Angleterre en 1381 ?", options: ["La Jacquerie", "La révolte des paysans", "Le Pèlerinage de Grâce", "La révolte lollarde"], explanation: "La colère contre les capitations après la peste amena des armées rebelles jusqu’à Londres avant que la révolte ne soit écrasée." },
  },
  'mq49': {
    de: { question: "Die Große Hungersnot von 1315–1317 wurde vor allem verursacht durch …", options: ["Krieg", "Jahre katastrophalen Regens und Missernten", "ein Erdbeben", "die Pest"], explanation: "Unaufhörliche Regenfälle ließen die Ernten in ganz Nordeuropa verfaulen — ein düsteres Vorspiel zu den Katastrophen des Jahrhunderts." },
    fr: { question: "La Grande Famine de 1315–1317 fut principalement causée par…", options: ["la guerre", "des années de pluies catastrophiques et de récoltes perdues", "un tremblement de terre", "la peste"], explanation: "Des pluies incessantes firent pourrir les récoltes dans toute l’Europe du Nord — un sombre prélude aux désastres du siècle." },
  },
  'mq50': {
    de: { question: "Welches Kirchenkonzil (1414–1418) beendete das Abendländische Schisma rivalisierender Päpste?", options: ["Nicäa", "Trient", "Konstanz", "Chalcedon"], explanation: "Das Konzil von Konstanz setzte drei Anwärter ab oder nahm ihre Rücktritte an und wählte Martin V." },
    fr: { question: "Quel concile de l’Église (1414–1418) mit fin au grand schisme d’Occident des papes rivaux ?", options: ["Nicée", "Trente", "Constance", "Chalcédoine"], explanation: "Le concile de Constance déposa ou accepta la démission de trois prétendants et élut Martin V." },
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
    de: { question: "Der Englische Bürgerkrieg endete 1649 mit der Hinrichtung welches Königs?", options: ["Jakob I.", "Karl I.", "Karl II.", "Jakob II."], explanation: "Karls I. Enthauptung vor Whitehall erschütterte Europa; England wurde unter Cromwell zum Commonwealth." },
    fr: { question: "La guerre civile anglaise s’acheva par l’exécution de quel roi en 1649 ?", options: ["Jacques Iᵉʳ", "Charles Iᵉʳ", "Charles II", "Jacques II"], explanation: "La décapitation de Charles Iᵉʳ devant Whitehall stupéfia l’Europe ; l’Angleterre devint un Commonwealth sous Cromwell." },
  },
  'eq42': {
    de: { question: "Die Mittelpassage bezeichnet …", options: ["die Seidenstraße über Land", "die Atlantiküberquerung, die versklavte Afrikaner ertragen mussten", "die Route um Kap Hoorn", "die Pilgerfahrten nach Amerika"], explanation: "Rund 12,5 Millionen Afrikaner wurden unter brutalen Bedingungen über den Atlantik verschifft; fast 2 Millionen starben auf See." },
    fr: { question: "Le passage du milieu désigne…", options: ["la route de la soie terrestre", "la traversée de l’Atlantique endurée par les Africains asservis", "la route autour du cap Horn", "les voyages des pèlerins vers l’Amérique"], explanation: "Environ 12,5 millions d’Africains furent transportés à travers l’Atlantique dans des conditions brutales ; près de 2 millions moururent en mer." },
  },
  'eq43': {
    de: { question: "Welche Anbauwirtschaft trieb im 17.–18. Jahrhundert das Plantagen-Sklavensystem der Karibik an?", options: ["Baumwolle", "Zucker", "Tee", "Kautschuk"], explanation: "Zucker war die wertvollste koloniale Ware des frühneuzeitlichen Europas — und die tödlichste für die versklavten Arbeiter." },
    fr: { question: "Quelle économie de culture propulsa le système esclavagiste des plantations des Caraïbes aux XVIIᵉ–XVIIIᵉ siècles ?", options: ["Le coton", "Le sucre", "Le thé", "Le caoutchouc"], explanation: "Le sucre fut la marchandise coloniale la plus précieuse de l’Europe moderne — et la plus meurtrière pour les travailleurs asservis." },
  },
  'eq44': {
    de: { question: "Peter der Große gründete 1703 welche Stadt als Russlands „Fenster nach Europa“?", options: ["Moskau", "Kiew", "Sankt Petersburg", "Odessa"], explanation: "Auf baltischem Sumpfland unter enormen menschlichen Kosten errichtet, wurde Sankt Petersburg zur westwärts blickenden Hauptstadt." },
    fr: { question: "Pierre le Grand fonda en 1703 quelle ville comme « fenêtre de la Russie sur l’Europe » ?", options: ["Moscou", "Kiev", "Saint-Pétersbourg", "Odessa"], explanation: "Bâtie sur des marais baltes au prix de vies humaines immenses, Saint-Pétersbourg devint la capitale tournée vers l’ouest." },
  },
  'eq45': {
    de: { question: "Montesquieus „Vom Geist der Gesetze“ (1748) trat ein für …", options: ["die absolute Monarchie", "die Gewaltenteilung zwischen den Zweigen der Regierung", "die Abschaffung der Religion", "die Herrschaft der Philosophen"], explanation: "Sein dreiteiliges Schema — Legislative, Exekutive, Judikative — prägte die US-Verfassung." },
    fr: { question: "« De l’esprit des lois » de Montesquieu (1748) prôna…", options: ["la monarchie absolue", "la séparation des pouvoirs entre les branches du gouvernement", "l’abolition de la religion", "le gouvernement des philosophes"], explanation: "Son schéma tripartite — législatif, exécutif, judiciaire — façonna la Constitution des États-Unis." },
  },
  'eq46': {
    de: { question: "Die Encyclopédie, das große Wissenskompendium der Aufklärung, wurde herausgegeben von …", options: ["Voltaire und Rousseau", "Diderot und d’Alembert", "Kant und Hume", "Locke und Newton"], explanation: "Ihre 28 Bände (1751–1772) verbreiteten trotz Zensur rationales, kritisches Denken." },
    fr: { question: "L’Encyclopédie, le grand recueil du savoir des Lumières, fut dirigée par…", options: ["Voltaire et Rousseau", "Diderot et d’Alembert", "Kant et Hume", "Locke et Newton"], explanation: "Ses 28 volumes (1751–1772) répandirent une pensée rationnelle et critique malgré la censure." },
  },
  'eq47': {
    de: { question: "Die Boston Tea Party (1773) war ein Protest gegen …", options: ["den Stamp Act", "die britische Besteuerung und das Monopol des Tea Act", "den Quartering Act", "die Zwangsrekrutierung zur Marine"], explanation: "Kolonisten kippten den Tee der Ostindien-Kompanie in den Hafen, statt besteuerte Monopolimporte hinzunehmen." },
    fr: { question: "La Boston Tea Party (1773) fut une protestation contre…", options: ["le Stamp Act", "la taxation britannique et le monopole du Tea Act", "le Quartering Act", "l’enrôlement forcé dans la marine"], explanation: "Les colons jetèrent le thé de la Compagnie des Indes orientales dans le port plutôt que d’accepter des importations monopolistiques taxées." },
  },
  'eq48': {
    de: { question: "Die Französische Revolution begann 1789 mit welchem sinnbildlichen Ereignis in Paris?", options: ["Der Ballhausschwur", "Der Sturm auf die Bastille", "Die Hinrichtung Ludwigs XVI.", "Der Marsch auf Versailles"], explanation: "Am 14. Juli 1789 stürmten die Pariser die Festungsgefängnis-Bastille — heute Frankreichs Nationalfeiertag." },
    fr: { question: "La Révolution française commença en 1789 avec quel événement emblématique à Paris ?", options: ["Le serment du Jeu de paume", "La prise de la Bastille", "L’exécution de Louis XVI", "La marche sur Versailles"], explanation: "Le 14 juillet 1789, les Parisiens prirent la forteresse-prison de la Bastille — aujourd’hui la fête nationale française." },
  },
  'eq49': {
    de: { question: "Welches Dokument vom August 1789 verkündete Freiheit, Eigentum und Gleichheit vor dem Gesetz in Frankreich?", options: ["Der Code Napoléon", "Die Erklärung der Menschen- und Bürgerrechte", "Die Verfassung von 1791", "Das Toleranzedikt"], explanation: "Die Erklärung destillierte die Grundsätze der Aufklärung zu revolutionärem Recht und beeinflusste Verfassungen weltweit." },
    fr: { question: "Quel document d’août 1789 proclama la liberté, la propriété et l’égalité devant la loi en France ?", options: ["Le Code Napoléon", "La Déclaration des droits de l’homme et du citoyen", "La Constitution de 1791", "L’édit de tolérance"], explanation: "La Déclaration condensa les principes des Lumières en droit révolutionnaire, influençant des constitutions dans le monde entier." },
  },
  'eq50': {
    de: { question: "Die Haitianische Revolution (1791–1804) unter Führung von Toussaint Louverture führte zu …", options: ["der Rückgewinnung einer französischen Kolonie", "der ersten freien schwarzen Republik und der dortigen Abschaffung der Sklaverei", "der britischen Annexion", "einer wiederhergestellten Monarchie"], explanation: "Versklavte Menschen besiegten drei Reiche; Haitis Unabhängigkeit von 1804 versetzte sklavenhaltende Mächte überall in Schrecken." },
    fr: { question: "La Révolution haïtienne (1791–1804), menée par Toussaint Louverture, aboutit à…", options: ["la reconquête d’une colonie française", "la première république noire libre et l’abolition de l’esclavage sur place", "l’annexion britannique", "une monarchie restaurée"], explanation: "Des personnes asservies vainquirent trois empires ; l’indépendance d’Haïti en 1804 terrifia partout les puissances esclavagistes." },
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
};

export function getTranslatedQuestionDeFr(questionId: string, lang: Language): QuizQuestionTranslation | null {
  if (lang !== 'de' && lang !== 'fr') return null;
  return QUIZ_TRANS_DEFR[questionId]?.[lang] ?? null;
}
