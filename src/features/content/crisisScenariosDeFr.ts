// ─── Crisis Room scenarios — German & French ────────────────────────────────
// The main CRISIS_SCENARIOS literals carry es/ru/mk inline; de and fr live here
// so the getter helpers can localize every player-facing field (year, title,
// role, tagline, briefing, objectives) without English leaking into a de/fr run.
// Curly apostrophes (’) are used throughout so the single-quoted strings never
// break on an elision.

export interface CrisisLocaleEntry {
  yearLabel: string;
  title: string;
  role: string;
  tagline: string;
  briefing: string;
  objectives: string[];
}

export const CRISIS_DEFR: Record<string, { de: CrisisLocaleEntry; fr: CrisisLocaleEntry }> = {
  'crisis-rubicon': {
    de: {
      yearLabel: 'Januar 49 v. Chr.',
      title: 'Der Rubikon',
      role: 'Gaius Julius Caesar, Prokonsul von Gallien',
      tagline: 'Ein Fluss. Eine Legion. Die Republik hält den Atem an.',
      briefing: 'Der Senat, gelenkt von deinen Feinden und gestützt auf Pompeius, hat dir befohlen, dein Heer aufzulösen und als Privatmann nach Rom zurückzukehren — wo Anklage und Verbannung warten. Du stehst am Nordufer des Rubikon mit der Dreizehnten Legion. Ein Übertritt unter Waffen ist Hochverrat und bedeutet Bürgerkrieg; Gehorsam kann politische Vernichtung bedeuten. Deine Veteranen sind treu, deine Mittel tief, doch Pompeius verfügt über die Legitimität der Republik und die Meere.',
      objectives: ['Politisch überleben', 'Die Republik, die du zu verteidigen vorgibst, nicht zerstören', 'Die Zukunft deiner Veteranen sichern'],
    },
    fr: {
      yearLabel: 'janvier 49 av. J.-C.',
      title: 'Le Rubicon',
      role: 'Caius Julius César, proconsul de Gaule',
      tagline: 'Une rivière. Une légion. La République retient son souffle.',
      briefing: 'Le Sénat, mené par tes ennemis et soutenu par Pompée, t’a ordonné de dissoudre ton armée et de rentrer à Rome en simple citoyen — où t’attendent le procès et l’exil. Tu te tiens sur la rive nord du Rubicon avec la Treizième Légion. Le franchir en armes est une trahison et signifie la guerre civile ; obéir peut signifier l’anéantissement politique. Tes vétérans sont loyaux, tes fonds profonds, mais Pompée détient la légitimité de la République et les mers.',
      objectives: ['Survivre politiquement', 'Ne pas détruire la République que tu prétends défendre', 'Assurer l’avenir de tes vétérans'],
    },
  },
  'crisis-gaugamela': {
    de: {
      yearLabel: 'Oktober 331 v. Chr.',
      title: 'Gaugamela',
      role: 'Alexander III. von Makedonien, König und Hegemon des Hellenischen Bundes',
      tagline: 'Siebenundvierzigtausend Mann gegen eine Viertelmillion. Eine Morgendämmerung entscheidet das Schicksal zweier Reiche.',
      briefing: 'Dareios III. hat diese Ebene bei Gaugamela gewählt und für seine Sichelwagen einebnen lassen. Sein Heer — Perser, Baktrer, indische Elefanten, griechische Söldner — stellt das deine in den Schatten. Parmenion drängt zu einem Nachtangriff; du hast dich geweigert, einen Sieg zu stehlen. Deine Veteranen vertrauen dir völlig, doch ein einziger Riss in der Phalanx, und es gibt keine Reserve, keinen Rückzug, kein Makedonien, in das du zurückkehren könntest. Irgendwo jenseits jener Ebene steht Dareios, zum zweiten Mal ein Flüchtling vor deiner Lanze.',
      objectives: ['Das persische Heer vernichten, nicht nur das Feld gewinnen', 'Parmenions linken Flügel am Leben halten', 'Dareios ergreifen — ein flüchtiger Großkönig bedeutet endlosen Krieg'],
    },
    fr: {
      yearLabel: 'octobre 331 av. J.-C.',
      title: 'Gaugamèles',
      role: 'Alexandre III de Macédoine, roi et hégémon de la Ligue hellénique',
      tagline: 'Quarante-sept mille hommes contre un quart de million. Une aube pour décider du sort de deux empires.',
      briefing: 'Darius III a choisi cette plaine près de Gaugamèles et l’a fait aplanir pour ses chars à faux. Son armée — Perses, Bactriens, éléphants indiens, mercenaires grecs — éclipse la tienne. Parménion presse une attaque de nuit ; tu as refusé de voler une victoire. Tes vétérans te font entièrement confiance, mais une seule brèche dans la phalange, et il n’y a ni réserve, ni retraite, ni Macédoine où revenir. Quelque part au-delà de cette plaine se tient Darius, deux fois fugitif devant ta lance.',
      objectives: ['Anéantir l’armée perse, pas seulement gagner le champ', 'Maintenir en vie l’aile gauche de Parménion', 'Capturer Darius — un Grand Roi en fuite signifie une guerre sans fin'],
    },
  },
  'crisis-1453': {
    de: {
      yearLabel: 'April 1453',
      title: 'Die Mauern von Konstantinopel',
      role: 'Konstantin XI. Palaiologos, Kaiser der Römer',
      tagline: 'Siebentausend Verteidiger. Achtzigtausend Belagerer. Tausend Jahre Reich stehen auf dem Spiel.',
      briefing: 'Sultan Mehmed II., einundzwanzig Jahre alt und brennend darauf, deine Stadt zu nehmen, ist vor den Theodosianischen Mauern mit einem gewaltigen Heer und einer neuen Waffe erschienen: Orbans großer Bombarde, fähig, Mauerwerk zu zerschmettern, das jeder Belagerung tausend Jahre lang standgehalten hat. Du hältst die Mauern mit kaum siebentausend Mann, genuesischen Verbündeten unter Giovanni Giustiniani und einer Kette über das Goldene Horn. Der Westen verspricht Hilfe, die nie ganz ausläuft. Die Union mit Rom könnte lateinische Schiffe erkaufen — um den Preis des Zorns deiner Geistlichkeit.',
      objectives: ['Die Stadt halten oder ihr Volk retten', 'Den lateinisch-orthodoxen Riss bewältigen', 'Das Erbe der Palaiologen bewahren'],
    },
    fr: {
      yearLabel: 'avril 1453',
      title: 'Les murailles de Constantinople',
      role: 'Constantin XI Paléologue, empereur des Romains',
      tagline: 'Sept mille défenseurs. Quatre-vingt mille assiégeants. Mille ans d’empire en jeu.',
      briefing: 'Le sultan Mehmed II, âgé de vingt et un ans et brûlant de prendre ta ville, est arrivé devant les murailles théodosiennes avec une armée immense et une arme nouvelle : la grande bombarde d’Orban, capable de fracasser une maçonnerie qui a résisté à tous les sièges pendant mille ans. Tu tiens les murailles avec à peine sept mille hommes, des alliés génois sous Giovanni Giustiniani, et une chaîne en travers de la Corne d’Or. L’Occident promet une aide qui n’appareille jamais tout à fait. L’union avec Rome pourrait acheter des navires latins — au prix de la fureur de ton clergé.',
      objectives: ['Tenir la ville ou sauver son peuple', 'Gérer la rupture latino-orthodoxe', 'Préserver l’héritage des Paléologues'],
    },
  },
  'crisis-1789': {
    de: {
      yearLabel: 'Juli 1789',
      title: 'Der Sommer der Bastille',
      role: 'Ludwig XVI., König von Frankreich',
      tagline: 'Paris hungert, die Staatskasse ist leer, und der Dritte Stand nennt sich eine Nation.',
      briefing: 'Die Generalstände, die du einberufen hast, sind dir entglitten: Der Dritte Stand hat sich zur Nationalversammlung erklärt und geschworen, sich nicht aufzulösen. Die Brotpreise sind die höchsten seit einer Generation, deine Schweizer und deutschen Regimenter umringen Paris, und dein Hof drängt dich, den reformwilligen Minister Necker zu entlassen. Jede Option ist geladen: Gewalt kann das Pulverfass entzünden, Zugeständnisse können den Absolutismus für immer auflösen. Die Garnison der Bastille wartet auf Befehle, die sie nicht will.',
      objectives: ['Die Monarchie am Leben halten', 'Paris ernähren, bevor Paris dich verschlingt', 'Entscheiden, was zuzugestehen ist — und wann'],
    },
    fr: {
      yearLabel: 'juillet 1789',
      title: 'L’été de la Bastille',
      role: 'Louis XVI, roi de France',
      tagline: 'Paris a faim, le trésor est vide, et le tiers état se proclame une Nation.',
      briefing: 'Les États généraux que tu as convoqués t’ont échappé : le tiers état s’est déclaré Assemblée nationale et a juré de ne pas se disperser. Le prix du pain est le plus élevé depuis une génération, tes régiments suisses et allemands encerclent Paris, et ta cour te presse de renvoyer le ministre réformateur Necker. Chaque option est chargée : la force peut embraser la poudrière, la concession peut défaire l’absolutisme à jamais. La garnison de la Bastille attend des ordres qu’elle ne veut pas.',
      objectives: ['Maintenir la monarchie en vie', 'Nourrir Paris avant que Paris ne te dévore', 'Décider ce qu’il faut concéder — et quand'],
    },
  },
  'crisis-salamis': {
    de: {
      yearLabel: 'September 480 v. Chr.',
      title: 'Die Meerenge von Salamis',
      role: 'Themistokles, Stratege von Athen',
      tagline: 'Athen brennt hinter dir. Die verbündete Flotte will sich zerstreuen. Eine Falle kann Griechenland noch retten.',
      briefing: 'Xerxes hat Athen niedergebrannt; sein Volk drängt sich als Flüchtlinge auf der Insel Salamis. Die peloponnesischen Admirale — die den Großteil der verbündeten Flotte befehligen — fordern den Rückzug zum Isthmus von Korinth und die Preisgabe alles Nördlichen. Du weißt, dass die persische Armada, gewaltig, aber schwerfällig, in den engen Meerengen gebrochen werden könnte, wo die Übermacht sich nicht entfalten kann. Der Spartaner Eurybiades führt nominell den Oberbefehl, die Verbündeten misstrauen dem athenischen Ehrgeiz, und Xerxes’ Thron wird am Hang des Berges Aigaleos aufgestellt, um seinen Sieg zu schauen.',
      objectives: ['Die Schlacht in der Meerenge erzwingen, nicht auf offener See', 'Das zerstrittene Bündnis zusammenhalten', 'Das athenische Volk retten — die Stadt kann wieder aufgebaut werden'],
    },
    fr: {
      yearLabel: 'septembre 480 av. J.-C.',
      title: 'Les détroits de Salamine',
      role: 'Thémistocle, stratège d’Athènes',
      tagline: 'Athènes brûle derrière toi. La flotte alliée veut se disperser. Un piège peut encore sauver la Grèce.',
      briefing: 'Xerxès a incendié Athènes ; son peuple s’entasse en réfugiés sur l’île de Salamine. Les amiraux péloponnésiens — qui commandent la plus grande partie de la flotte alliée — exigent le repli vers l’isthme de Corinthe, abandonnant tout ce qui est au nord. Tu sais que l’armada perse, immense mais lourde, pourrait être brisée dans les détroits étroits où le nombre ne peut se déployer. Le Spartiate Eurybiade détient le commandement nominal, les alliés se méfient de l’ambition athénienne, et le trône de Xerxès s’installe sur le versant du mont Aigaléos pour contempler sa victoire.',
      objectives: ['Forcer la bataille dans les détroits, pas en pleine mer', 'Maintenir l’alliance querelleuse unie', 'Sauver le peuple athénien — la cité peut être rebâtie'],
    },
  },
  'crisis-hattin': {
    de: {
      yearLabel: 'Juli 1187',
      title: 'Die Hörner von Hattin',
      role: 'Guido von Lusignan, König von Jerusalem',
      tagline: 'Saladin belagert Tiberias. Deine Barone sagen: marschiere; das Wasser sagt: bleibe. Das Königreich hängt an einem Befehl.',
      briefing: 'Saladin hat den Jordan mit dem größten muslimischen Heer überschritten, dem das Königreich je gegenüberstand, und Tiberias belagert — absichtlich, als Köder. Raimund von Tripolis, dessen eigene Frau in der Zitadelle eingeschlossen ist, rät dir, NICHT zu marschieren: Das sommerliche Plateau zwischen Sephoria und Tiberias ist wasserlos, und das Heer an den Quellen von Sephoria ist die gesamte Stärke des Königreichs. Gerard de Ridefort, Meister des Tempels, nennt Zögern Feigheit und erinnert dich, wie du die Krone gewannst. Jeder waffenfähige Mann des Reiches ist in diesem Lager; verliere das Heer, und jede Burg und Stadt — Jerusalem selbst — steht leer dahinter.',
      objectives: ['Das Feldheer nicht verlieren — es IST das Königreich', 'Auf Tiberias antworten, ohne Saladin seine Schlacht zu geben', 'Deine eigenen zerstrittenen Barone meistern'],
    },
    fr: {
      yearLabel: 'juillet 1187',
      title: 'Les cornes de Hattin',
      role: 'Guy de Lusignan, roi de Jérusalem',
      tagline: 'Saladin assiège Tibériade. Tes barons disent : marche ; l’eau dit : reste. Le royaume tient à un seul ordre.',
      briefing: 'Saladin a franchi le Jourdain avec la plus grande armée musulmane que le royaume ait jamais affrontée et a assiégé Tibériade — délibérément, comme appât. Raymond de Tripoli, dont la propre épouse est prise au piège dans la citadelle, te conseille de NE PAS marcher : le plateau estival entre Séphorie et Tibériade est sans eau, et l’armée aux sources de Séphorie est toute la force du royaume. Gérard de Ridefort, maître du Temple, qualifie l’attente de lâcheté et te rappelle comment tu as gagné la couronne. Tout homme en armes du royaume est dans ce camp ; perds l’armée, et chaque château et chaque cité — Jérusalem elle-même — reste vide derrière elle.',
      objectives: ['Ne pas perdre l’armée de campagne — elle EST le royaume', 'Répondre à Tibériade sans donner à Saladin sa bataille', 'Maîtriser tes propres barons querelleurs'],
    },
  },
  'crisis-armada': {
    de: {
      yearLabel: 'Juli 1588',
      title: 'Der Sommer der Armada',
      role: 'Elisabeth I., Königin von England',
      tagline: 'Hundertdreißig Schiffe segeln nach deinem Thron, deiner Kirche und deinem Kopf.',
      briefing: 'Philipps II. Armada ist in einer Sichel, die kein englischer Kapitän gebrochen hat, in den Kanal eingelaufen, um Parmas Veteranenheer in Flandern einzuschiffen und in Kent zu landen. Deine Flotte unter Howard und Drake beschattet sie luvwärts, schneller und besser bestückt, doch außerstande aufzuschließen. An Land ist deine Miliz roh, deine katholischen Untertanen von ungewisser Treue, und deine Staatskasse kann die Flotte nicht lange auf See halten. Berater drängen dich zur Sicherheit im Landesinneren; du aber gedenkst, zum Heer bei Tilbury zu reiten. Wetter, Brander und Nerven sind die Karten, die du hältst.',
      objectives: ['Die Armada brechen, bevor Parma sich einschifft', 'Die Nerven der Nation — und deine eigenen — bewahren', 'Nicht mehr ausgeben, als die Staatskasse überlebt'],
    },
    fr: {
      yearLabel: 'juillet 1588',
      title: 'L’été de l’Armada',
      role: 'Élisabeth Ire, reine d’Angleterre',
      tagline: 'Cent trente navires cinglent vers ton trône, ton Église et ta tête.',
      briefing: 'L’Armada de Philippe II est entrée dans la Manche en un croissant qu’aucun capitaine anglais n’a rompu, cinglant pour embarquer l’armée vétérane de Parme en Flandre et la débarquer dans le Kent. Ta flotte sous Howard et Drake la suit au vent, plus rapide et mieux armée mais incapable de l’aborder. À terre, ta milice est novice, tes sujets catholiques d’une loyauté incertaine, et ton trésor ne peut soutenir longtemps la flotte en mer. Tes conseillers te pressent de te mettre à l’abri à l’intérieur des terres ; tu es plutôt disposée à chevaucher vers l’armée à Tilbury. Le temps, les brûlots et le sang-froid sont les cartes que tu tiens.',
      objectives: ['Briser l’Armada avant que Parme n’embarque', 'Tenir les nerfs de la nation — et les tiens', 'Ne pas dépenser plus que le trésor ne peut supporter'],
    },
  },
  'crisis-1914': {
    de: {
      yearLabel: 'Juli 1914',
      title: 'Die Julikrise',
      role: 'Wilhelm II., Deutscher Kaiser',
      tagline: 'Ein Erzherzog ist in Sarajevo tot. Fünf Reiche greifen nach ihren Mobilmachungsplänen.',
      briefing: 'Franz Ferdinand ist tot, und Wien fragt, ob Deutschland hinter allem steht, was Österreich-Ungarn gegen Serbien unternimmt. Deine Generäle raunen, ein Krieg mit Russland sei unvermeidlich und jetzt besser als 1917, wenn die Eisenbahnen des Zaren vollendet sind. Der Schlieffen-Plan lässt nur eine Art von Krieg zu — durch Belgien, zuerst gegen Frankreich —, und sobald die Mobilmachung beginnt, verschlingt ihr Fahrplan die Diplomatie. Deine Vettern sitzen auf den Thronen Russlands und Britanniens; Telegramme zwischen euch mögen noch zählen. Ein Blankoscheck liegt entworfen auf deinem Schreibtisch und wartet auf die Unterschrift.',
      objectives: ['Wien stützen, ohne einen Kontinentalkrieg zu entfesseln', 'Britannien fast um jeden Preis neutral halten', 'Die Fahrpläne niemals die Diplomaten überholen lassen'],
    },
    fr: {
      yearLabel: 'juillet 1914',
      title: 'La crise de juillet',
      role: 'Guillaume II, empereur d’Allemagne',
      tagline: 'Un archiduc est mort à Sarajevo. Cinq empires saisissent leurs calendriers de mobilisation.',
      briefing: 'François-Ferdinand est mort, et Vienne demande si l’Allemagne soutiendra tout ce que l’Autriche-Hongrie fera à la Serbie. Tes généraux murmurent qu’une guerre avec la Russie est inévitable et vaut mieux maintenant qu’en 1917, quand les chemins de fer du tsar seront achevés. Le plan Schlieffen ne permet qu’un seul type de guerre — par la Belgique, contre la France d’abord —, et dès que la mobilisation commence, son calendrier dévore la diplomatie. Tes cousins siègent sur les trônes de Russie et de Grande-Bretagne ; les télégrammes entre vous peuvent encore compter. Un chèque en blanc est rédigé sur ton bureau, attendant ta signature.',
      objectives: ['Soutenir Vienne sans déchaîner une guerre continentale', 'Garder la Grande-Bretagne neutre à presque n’importe quel prix', 'Ne jamais laisser les calendriers distancer les diplomates'],
    },
  },
  'crisis-1962': {
    de: {
      yearLabel: 'Oktober 1962',
      title: 'Dreizehn Tage',
      role: 'John F. Kennedy, Präsident der Vereinigten Staaten',
      tagline: 'U-2-Aufnahmen zeigen sowjetische Raketen auf Kuba. Jede Option führt zum Abgrund.',
      briefing: 'Aufklärungsfotos bestätigen sowjetische Mittelstreckenraketen in der Montage auf Kuba, Minuten Flugzeit von Washington entfernt. Die Vereinigten Stabschefs drängen zu sofortigen Luftschlägen mit anschließender Invasion; sie wissen nicht, dass die Insel bereits sowjetische taktische Atomsprengköpfe birgt. Chruschtschow hält dich nach der Schweinebucht und Wien für schwach. Dein Bruder rät zu einer Quarantäne, LeMay nennt alles Geringere als Bombardierung „Beschwichtigung“, und mit jeder Stunde nähern sich die Raketen der Einsatzbereitschaft.',
      objectives: ['Die Raketen hinausschaffen', 'Einen Atomkrieg vermeiden', 'Niemanden — auch dich selbst nicht — in die Enge treiben lassen'],
    },
    fr: {
      yearLabel: 'octobre 1962',
      title: 'Treize jours',
      role: 'John F. Kennedy, président des États-Unis',
      tagline: 'Des photos d’U-2 montrent des missiles soviétiques à Cuba. Chaque option mène vers l’abîme.',
      briefing: 'Des photographies de reconnaissance confirment des missiles balistiques soviétiques à moyenne portée en cours d’assemblage à Cuba, à quelques minutes de vol de Washington. Les chefs d’état-major pressent des frappes aériennes immédiates suivies d’une invasion ; ils ignorent que l’île abrite déjà des ogives nucléaires tactiques soviétiques. Khrouchtchev te croit faible après la baie des Cochons et Vienne. Ton frère conseille une quarantaine, LeMay qualifie tout ce qui est moindre qu’un bombardement d’« apaisement », et à chaque heure les missiles approchent de l’état de préparation.',
      objectives: ['Faire retirer les missiles', 'Éviter la guerre nucléaire', 'Ne laisser personne — pas même toi — être acculé'],
    },
  },
};
