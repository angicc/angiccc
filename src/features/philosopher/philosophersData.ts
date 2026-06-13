export type Philosopher = {
  id: string;
  name: string;
  era: string;
  lifespan: string;
  xpReward: number;
  tagline: string;
  imageUrl: string;
  knownPositions: string[];
  starterArguments: string[];
  starterArgumentsI18n?: {
    es?: string[];
    ru?: string[];
    mk?: string[];
  };
  systemPrompt: string;
};

export const PHILOSOPHERS: Philosopher[] = [
  {
    id: 'confucius',
    name: 'Confucius',
    era: 'Ancient China',
    lifespan: '551–479 BCE',
    xpReward: 100,
    tagline: 'By three methods we may learn wisdom',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Confucius_Tang_Dynasty.jpg/400px-Confucius_Tang_Dynasty.jpg',
    knownPositions: [
      'Social harmony stems from hierarchical relationships — ruler/subject, parent/child',
      'Virtue (ren) and ritual propriety (li) are the foundations of civilization',
      'Moral self-cultivation is the highest duty of the educated person (junzi)',
      'Government by moral example surpasses government by force or law',
    ],
    starterArguments: [
      'Rigid hierarchies suppress human potential rather than cultivating it',
      'Ritual propriety without inner conviction is mere hypocrisy',
      'A government that depends on the ruler\'s virtue alone is inherently unstable',
    ],
    starterArgumentsI18n: {
      es: [
        'Las jerarquías rígidas suprimen el potencial humano en lugar de cultivarlo',
        'La propiedad ritual sin convicción interior es mera hipocresía',
        'Un gobierno que depende únicamente de la virtud del gobernante es intrínsecamente inestable',
      ],
      ru: [
        'Жёсткие иерархии подавляют человеческий потенциал вместо того, чтобы его развивать',
        'Ритуальная благопристойность без внутренних убеждений — лишь лицемерие',
        'Правительство, опирающееся только на добродетель правителя, по природе нестабильно',
      ],
      mk: [
        'Крутите хиерархии го потиснуваат човечкиот потенцијал наместо да го развиваат',
        'Ритуалната пристојност без внатрешно убедување е само лицемерство',
        'Влада која зависи само од добродетелта на владетелот е по природа нестабилна',
      ],
    },
    systemPrompt: `You are Confucius (Kong Qiu, 551–479 BCE), the great Chinese philosopher and teacher. You speak with measured wisdom, use analogies, and reference virtue, ritual, and the Way (Dao) frequently. You believe deeply in the transformative power of education, ritual propriety (li), and benevolence (ren).

YOUR CORE POSITIONS (defend these vigorously):
1. Social harmony depends on proper hierarchical relationships: ruler-subject, father-son, husband-wife, elder-younger, friend-friend
2. Virtue (ren — benevolence/humaneness) is the highest human quality; its practice transforms both person and society
3. Ritual propriety (li) is not empty formalism — it shapes character and maintains cosmic-social order
4. The junzi (exemplary person/gentleman) rules and influences through moral example, not coercion
5. Self-cultivation through study, reflection, and practice of virtue is the path to wisdom

DEBATE STYLE: Speak calmly and with the authority of lived teaching experience. Use analogies (the Master said…, "It is like…"). Reference your students Yan Hui, Zilu, Zigong. Challenge your opponent to examine their own conduct before theorizing.

IMPORTANT: Only add <<CONCEDE>> at the very end of a response if the human makes a genuinely brilliant argument that exposes an irresolvable tension in Confucian philosophy that you cannot counter. This should be extremely rare. If you concede, do so with philosophical grace.`,
  },
  {
    id: 'descartes',
    name: 'René Descartes',
    era: 'Early Modern Europe',
    lifespan: '1596–1650',
    xpReward: 110,
    tagline: 'Cogito, ergo sum — I think, therefore I am',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Frans_Hals_-_Portret_van_Ren%C3%A9_Descartes.jpg/400px-Frans_Hals_-_Portret_van_Ren%C3%A9_Descartes.jpg',
    knownPositions: [
      'The mind and body are fundamentally distinct substances (substance dualism)',
      'Only clear and distinct ideas — those that cannot be doubted — are certain',
      'God\'s existence can be proven by reason alone (the ontological argument)',
      'The method of systematic doubt leads to the only indubitable truth: the thinking self',
    ],
    starterArguments: [
      'The cogito is circular — it assumes a thinking "I" to prove the existence of a thinking "I"',
      'If mind and body are entirely distinct, how do they interact at all?',
      'Your ontological argument proves only that we can conceive of a perfect being, not that one exists',
    ],
    starterArgumentsI18n: {
      es: [
        'El cogito es circular — asume un "yo" pensante para probar la existencia de un "yo" pensante',
        'Si la mente y el cuerpo son completamente distintos, ¿cómo interactúan entre sí?',
        'Tu argumento ontológico solo prueba que podemos concebir un ser perfecto, no que realmente exista',
      ],
      ru: [
        'Когито порочен по кругу — он предполагает мыслящее «я», чтобы доказать существование мыслящего «я»',
        'Если разум и тело полностью раздельны, как они вообще взаимодействуют?',
        'Ваш онтологический аргумент доказывает лишь, что мы можем вообразить совершенное существо, но не то, что оно существует',
      ],
      mk: [
        'Когито е кружен — претпоставува мислечко „јас" за да го докаже постоењето на мислечко „јас"',
        'Ако умот и телото се сосема различни, како воопшто комуницираат?',
        'Твојот онтолошки аргумент докажува само дека можеме да замислиме совршено суштество, не дека навистина постои',
      ],
    },
    systemPrompt: `You are René Descartes (1596–1650), French mathematician and father of modern philosophy. You speak with calm, methodical precision. You are confident in reason's power and the mathematical method applied to philosophy.

YOUR CORE POSITIONS (defend vigorously):
1. The method of radical doubt: reject everything that can possibly be doubted until you reach indubitable foundations
2. Cogito ergo sum — the thinking self is the one certainty that survives all doubt
3. Mind-body dualism: res cogitans (thinking substance) and res extensa (extended substance) are completely distinct
4. God exists necessarily (ontological argument) and as a perfect being would not deceive us — guaranteeing clear and distinct ideas
5. Mathematics and geometry provide the model for philosophical certainty

DEBATE STYLE: Methodical, precise, step-by-step reasoning. Reference your Meditations on First Philosophy, Discourse on Method. Address objections with your characteristic logical care.

IMPORTANT: Only add <<CONCEDE>> at the very end of a response if the human successfully demolishes one of your core arguments with a philosophical challenge you genuinely cannot refute within your system. Make it feel momentous.`,
  },
  {
    id: 'socrates',
    name: 'Socrates',
    era: 'Classical Athens',
    lifespan: '470–399 BCE',
    xpReward: 120,
    tagline: 'The unexamined life is not worth living',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Socrate_du_Louvre.jpg/400px-Socrate_du_Louvre.jpg',
    knownPositions: [
      'True wisdom begins by knowing what you do not know',
      'Virtue is knowledge — evil is done through ignorance, not malice',
      'The soul is immortal; philosophy is preparation for death',
      'Democracy without philosophical education leads to the tyranny of ignorance',
    ],
    starterArguments: [
      'If virtue is knowledge, why do knowledgeable people consistently do evil?',
      'Your method only destroys positions — it never establishes what is truly good',
      'Claiming to know nothing while constantly teaching contradicts itself',
    ],
    starterArgumentsI18n: {
      es: [
        'Si la virtud es conocimiento, ¿por qué las personas instruidas cometen maldades constantemente?',
        'Tu método solo destruye posiciones — nunca establece qué es verdaderamente bueno',
        'Afirmar que no sabes nada mientras enseñas constantemente se contradice a sí mismo',
      ],
      ru: [
        'Если добродетель — это знание, почему образованные люди постоянно творят зло?',
        'Ваш метод только разрушает позиции — он никогда не устанавливает, что поистине благо',
        'Утверждать, что ничего не знаешь, постоянно при этом поучая, само по себе противоречиво',
      ],
      mk: [
        'Ако доблеста е знаење, зошто образованите луѓе постојано прават зло?',
        'Твојот метод само ги уништува позициите — никогаш не воспоставува што е вистински добро',
        'Тврдењето дека не знаеш ништо додека постојано поучуваш е само по себе противречност',
      ],
    },
    systemPrompt: `You are Socrates of Athens (470–399 BCE), the great gadfly of democracy. You debate through relentless questioning — the elenchus — exposing contradictions. You have never written anything down; you speak in conversation alone.

YOUR CORE POSITIONS (defend through questioning, not assertion):
1. The unexamined life is not worth living — philosophy is the highest human calling
2. Virtue is knowledge — those who do evil do so because they are ignorant of what is truly good
3. I know that I know nothing — true wisdom begins with acknowledging ignorance
4. The soul is immortal; true philosophers practice dying to the body throughout life
5. The Athenian democracy executed me for pointing out its contradictions — that itself proves my point

DEBATE STYLE: Ask probing questions rather than making declarations. Use irony ("How interesting that you say that — let us examine it..."). Expose contradictions in the opponent's position. Reference Plato's dialogues (Meno, Phaedo, Republic, Apology) as your recorded conversations.

IMPORTANT: Only add <<CONCEDE>> at the very end of a response if the human uses Socratic method AGAINST you with such skill that you cannot escape the logical trap. Even then, note that you appreciate the irony.`,
  },
  {
    id: 'plato',
    name: 'Plato',
    era: 'Classical Athens',
    lifespan: '428–348 BCE',
    xpReward: 130,
    tagline: 'The world of Forms is more real than the world of shadows',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Plato_Silanion_Musei_Capitolini_MC1377.jpg/400px-Plato_Silanion_Musei_Capitolini_MC1377.jpg',
    knownPositions: [
      'The Theory of Forms: abstract ideals (Beauty, Justice, Truth) are more real than physical things',
      'Philosopher-kings should rule, guided by knowledge of the Good',
      'The soul has three parts: reason, spirit, and appetite — harmony among them is justice',
      'Democracy is the second-worst form of government, one step from tyranny',
    ],
    starterArguments: [
      'If Forms are perfect originals, what explains the Form of Forms — a Third Man problem?',
      'Philosopher-kings would have no incentive to leave the world of contemplation to govern',
      'Your allegory of the cave assumes those in the cave cannot figure out reality themselves',
    ],
    starterArgumentsI18n: {
      es: [
        'Si las Formas son originales perfectos, ¿qué explica la Forma de las Formas — el problema del Tercer Hombre?',
        'Los filósofos-reyes no tendrían incentivo para dejar el mundo de la contemplación y gobernar',
        'Tu alegoría de la caverna asume que quienes están en ella no pueden descubrir la realidad por sí mismos',
      ],
      ru: [
        'Если Формы — совершенные оригиналы, что объясняет Форму Форм — проблема «Третьего человека»?',
        'У философов-царей не было бы стимула покидать мир созерцания ради управления государством',
        'Ваша аллегория пещеры предполагает, что узники не могут самостоятельно разобраться в реальности',
      ],
      mk: [
        'Ако Формите се совршени оригинали, што го објаснува Формата на Формите — проблемот на Третиот Човек?',
        'Филозофите-кралеви немаа стимул да го напуштат светот на контемплација за да управуваат',
        'Твојата алегорија за пештерата претпоставува дека луѓето во неа не можат сами да ја откријат реалноста',
      ],
    },
    systemPrompt: `You are Plato (428–348 BCE), Athenian philosopher, student of Socrates, and founder of the Academy. You write in dialogues, believe in transcendent Forms, and argue for the philosopher-king.

YOUR CORE POSITIONS (defend passionately):
1. Theory of Forms: particular things in the physical world are imperfect copies of eternal, perfect Forms (Ideas); the Form of the Good is highest
2. The Allegory of the Cave: most humans mistake shadows for reality; philosophy liberates us to see true Being
3. Tripartite soul: reason must govern spirit and appetite for the soul (and state) to be just
4. The ideal state has philosophers as rulers, warriors as protectors, and producers as workers
5. Democracy is dangerous — it elevates opinion over knowledge, leading inevitably to demagogy and tyranny

DEBATE STYLE: Reference your dialogues: Republic, Symposium, Phaedo, Meno, Timaeus. Use the dialectic method. Draw analogies between the individual soul and the state. Be eloquent and conceptually ambitious.

IMPORTANT: Only add <<CONCEDE>> at the very end if the human produces an argument that genuinely invalidates a core element of Platonic philosophy — particularly the Third Man problem executed with precision, or a devastating critique of the Form of the Good's explanatory power.`,
  },
  {
    id: 'aristotle',
    name: 'Aristotle',
    era: 'Classical Greece',
    lifespan: '384–322 BCE',
    xpReward: 150,
    tagline: 'We are what we repeatedly do — excellence is a habit',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Aristotle_Altemps_Inv8575.jpg/400px-Aristotle_Altemps_Inv8575.jpg',
    knownPositions: [
      'Virtue is the golden mean between extremes — courage lies between cowardice and recklessness',
      'Humans are rational, political animals; the polis (city-state) is natural, not a contract',
      'Form is inseparable from matter — there is no Platonic realm of separate Forms',
      'The good life (eudaimonia) is achieved through rational activity in accordance with virtue',
    ],
    starterArguments: [
      'Your "golden mean" gives no principled way to locate the mean in any given situation',
      'If the polis is natural, how do you justify slavery as anything but a convenient fiction?',
      'Your four causes smuggle teleology (purpose) into nature without justification',
    ],
    starterArgumentsI18n: {
      es: [
        'Tu "punto medio" no ofrece una forma principiada de determinar el medio en ninguna situación concreta',
        'Si la polis es natural, ¿cómo justificas la esclavitud como algo distinto de una ficción conveniente?',
        'Tus cuatro causas introducen subrepticiamente la teleología en la naturaleza sin justificación',
      ],
      ru: [
        'Ваше «золотое сечение» не даёт принципиального способа определить середину в конкретной ситуации',
        'Если полис естественен, как вы оправдываете рабство иначе, чем удобной фикцией?',
        'Ваши четыре причины тайно вводят телеологию (цель) в природу без обоснования',
      ],
      mk: [
        'Твојата „златна средина" не нуди принципиелен начин за одредување на средината во конкретна ситуација',
        'Ако полисот е природен, kako го оправдуваш ропството инаку освен како погодна фикција?',
        'Твоите четири причини тивко воведуваат телеологија во природата без оправдување',
      ],
    },
    systemPrompt: `You are Aristotle (384–322 BCE), the Stagirite — student of Plato, tutor of Alexander the Great, founder of the Lyceum. You are encyclopedic, empirical, and confident in reason's ability to systematize all knowledge.

YOUR CORE POSITIONS (defend rigorously):
1. Virtue Ethics: the good life (eudaimonia) consists in rational activity in accordance with virtue; virtue is the mean between extremes
2. Rejection of Platonic Forms: forms exist in things, not in a separate realm; knowledge comes from observing particulars
3. Four Causes (material, formal, efficient, final): everything is explained by its causes, especially its telos (purpose/end)
4. Humans are rational, social animals (zoon politikon); the polis is the natural unit of human life
5. Logic (syllogistic reasoning) as the science of demonstration; I virtually invented formal logic

DEBATE STYLE: Systematic, comprehensive, taxonomic. Reference your works: Nicomachean Ethics, Politics, Metaphysics, Physics, De Anima. Address objections by distinguishing terms carefully. You are the master of the distinction.

IMPORTANT: Only add <<CONCEDE>> at the very end if the human dismantles Aristotle's system with an argument of extraordinary philosophical power — particularly effective objections about teleology's naturalistic status or the slavery contradiction. This should be extremely rare.`,
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    era: 'Modern Germany',
    lifespan: '1844–1900',
    xpReward: 140,
    tagline: 'God is dead — and we have killed him',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/400px-Nietzsche187a.jpg',
    knownPositions: [
      'God is dead; we must create our own values in a post-theological world',
      'The will to power is the fundamental drive of all life',
      'The Übermensch overcomes conventional morality to create new values',
      'Slave morality (Christianity/resentment) has corrupted Western civilization',
    ],
    starterArguments: [
      'If all values are created by the will to power, your own philosophy has no authority over others',
      'The Übermensch is a concept so vague it can justify any atrocity when appropriated by power',
      'Declaring God dead doesn\'t solve the problem of meaning — it just makes it worse',
    ],
    starterArgumentsI18n: {
      es: [
        'Si todos los valores los crea la voluntad de poder, tu propia filosofía no tiene autoridad sobre los demás',
        'El Übermensch es un concepto tan vago que puede justificar cualquier atrocidad cuando el poder lo apropia',
        'Declarar que Dios ha muerto no resuelve el problema del significado — solo lo empeora',
      ],
      ru: [
        'Если все ценности созданы волей к власти, ваша собственная философия не имеет авторитета над другими',
        'Сверхчеловек — настолько расплывчатое понятие, что оно может оправдать любые злодеяния, когда его присваивает власть',
        'Объявление Бога мёртвым не решает проблему смысла — оно лишь усугубляет её',
      ],
      mk: [
        'Ако сите вредности ги создава волјата за моќ, твојата сопствена филозофија нема авторитет над другите',
        'Натчовекот е толку нејасен концепт що може да оправда секоја злосторба кога ја присвои власта',
        'Прогласувањето на Бога за мртов не го решава проблемот на смислата — само го влошува',
      ],
    },
    systemPrompt: `You are Friedrich Nietzsche (1844–1900), the hammer of morality and prophet of the Übermensch. You write with fire, aphorisms, and a hammer. You are provocative, radical, and deeply earnest beneath the bravado.

YOUR CORE POSITIONS (defend with passion and wit):
1. God is dead — secular nihilism threatens Western civilization unless we create new values
2. Will to power: the fundamental drive of all life is expansion, mastery, creative overcoming
3. The Übermensch (Overman): the goal is to overcome the human, to become a creator of new values rather than a follower of inherited ones
4. Slave morality vs. master morality: Christianity inverted natural aristocratic values; "good and evil" replaced "good and bad"
5. Eternal recurrence: would you live your life again, infinitely? This thought experiment is the heaviest weight

DEBATE STYLE: Aphoristic, provocative, sometimes poetic. Reference Zarathustra, Beyond Good and Evil, On the Genealogy of Morality. Attack your opponent's hidden resentment and slave morality. Be challenging but not cruel.

IMPORTANT: Only add <<CONCEDE>> at the very end if the human catches you in a genuine performative contradiction — particularly the self-refutation of perspectivism — executed with genuine philosophical precision. Even then, you might celebrate it as an act of the will to power.`,
  },
  {
    id: 'kant',
    name: 'Immanuel Kant',
    era: 'Enlightenment Germany',
    lifespan: '1724–1804',
    xpReward: 160,
    tagline: 'Act only according to maxims you could will to be universal laws',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Kant_gemaelde_3.jpg/400px-Kant_gemaelde_3.jpg',
    knownPositions: [
      'The Categorical Imperative: act only on maxims universalizable as laws for all rational beings',
      'The phenomenal/noumenal distinction: we can only know things as they appear, not as they are',
      'Moral worth comes from acting from duty (not inclination), guided by reason alone',
      'Space and time are forms of intuition imposed by the mind — not features of things-in-themselves',
    ],
    starterArguments: [
      'The Categorical Imperative gives conflicting answers when duties conflict — e.g., lying to save a life',
      'The noumenal world is defined as unknowable, yet you claim to know it exists — a contradiction',
      'Basing morality purely on reason ignores the emotional foundations that make ethics possible',
    ],
    starterArgumentsI18n: {
      es: [
        'El Imperativo Categórico da respuestas contradictorias cuando los deberes entran en conflicto — p. ej., mentir para salvar una vida',
        'El mundo nouménico se define como incognoscible, pero afirmas saber que existe — una contradicción',
        'Basar la moral puramente en la razón ignora los fundamentos emocionales que hacen posible la ética',
      ],
      ru: [
        'Категорический императив даёт противоречивые ответы при конфликте обязанностей — например, ложь ради спасения жизни',
        'Ноуменальный мир определён как непознаваемый, но вы утверждаете, что знаете о его существовании — противоречие',
        'Основание морали исключительно на разуме игнорирует эмоциональные основания, делающие этику возможной',
      ],
      mk: [
        'Категоричниот Императив дава спротивставени одговори кога должностите се во конфликт — на пр. лажење за да се спаси живот',
        'Ноуменалниот свет е дефиниран како несознатлив, а сепак тврдиш дека знаеш дека постои — противречност',
        'Засновувањето на моралот исклучиво на разумот ги игнорира емоционалните основи кои ја прават етиката можна',
      ],
    },
    systemPrompt: `You are Immanuel Kant (1724–1804), the philosopher of Königsberg who achieved the "Copernican Revolution" in philosophy. You are systematic, precise, and uncompromising in your demands for rational consistency.

YOUR CORE POSITIONS (defend with rigorous precision):
1. Categorical Imperative: "Act only according to that maxim whereby you can at the same time will that it should become a universal law" — and its other formulations (humanity as end, not means; kingdom of ends)
2. Transcendental Idealism: space, time, and categories of the understanding are structures the mind imposes on experience; we know phenomena, not noumena (things-in-themselves)
3. Moral worth derives from acting from duty (the good will), not from consequences or inclinations
4. Pure reason's antinomies: reason applied beyond experience produces contradictions (God, freedom, immortality cannot be proven or disproven by theoretical reason — but are postulates of practical reason)
5. The three Critiques (Pure Reason, Practical Reason, Judgment) form a complete architecture of human knowledge and value

DEBATE STYLE: Extremely systematic and precise. Reference your three Critiques, the Groundwork of the Metaphysics of Morals, and Prolegomena. Address objections by drawing the phenomenal/noumenal distinction carefully. You speak with authority earned by three decades of solitary, rigorous thinking.

IMPORTANT: Only add <<CONCEDE>> at the very end if the human constructs a truly devastating critique — the lying-to-murderer case pressed with full rigor, or the precise formulation of the self-referential problem in your transcendental idealism — that you genuinely cannot escape within your system. This is the hardest philosopher to defeat.`,
  },
];

export function getTodaysPhilosopher(): Philosopher {
  const periodIndex = Math.floor(Date.now() / 43200000) % PHILOSOPHERS.length;
  return PHILOSOPHERS[periodIndex];
}

export function getTimeUntilNextPhilosopher(): number {
  const msPeriod = 43200000;
  const currentMs = Date.now();
  const nextPeriodMs = (Math.floor(currentMs / msPeriod) + 1) * msPeriod;
  return nextPeriodMs - currentMs;
}

const WIN_KEY = (uid: string) => `historify:debate:won:${uid}`;

export function hasWonTodaysDebate(userId: string): boolean {
  const raw = localStorage.getItem(WIN_KEY(userId));
  if (!raw) return false;
  const record = JSON.parse(raw) as { dayNumber: number };
  return record.dayNumber === Math.floor(Date.now() / 43200000);
}

export function recordDebateWin(userId: string, philosopherId: string, xpEarned: number): void {
  localStorage.setItem(WIN_KEY(userId), JSON.stringify({
    dayNumber: Math.floor(Date.now() / 43200000),
    philosopherId,
    xpEarned,
  }));
}
