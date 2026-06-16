// Deterministic visual theme per lesson derived from metadata

export type LessonTheme = {
  accentColor: string;
  accentLight: string;
  categoryLabel: string;
  categoryIcon: string;
  patternClass: string;
  difficulty: 'Starter' | 'Intermediate' | 'Advanced';
  difficultyColor: string;
  /** Unique CSS gradient per topic category — never reused across categories, never random */
  bannerGradient: string;
};

// ── Banner token map ────────────────────────────────────────────────────────
// INPUT:  categoryLabel (string)
// OUTPUT: CSS gradient string (deterministic, one-to-one)
// RULE:   Each category → exactly one gradient. No fallback reuse across categories.
//
// Example outputs:
//   'Conflict & War'      → deep crimson gradient (dark red tones)
//   'Philosophy'          → deep violet gradient
//   'Science & Discovery' → deep teal/navy gradient
//   'Ancient Civilizations' → deep amber/bronze gradient
//   'Industrial Age'      → near-black charcoal gradient
const BANNER_TOKENS: Record<string, string> = {
  'Conflict & War':        'linear-gradient(135deg, #1a0505 0%, #3d0a0a 60%, #1f0707 100%)',
  'Philosophy':            'linear-gradient(135deg, #0d0420 0%, #1e0d3c 60%, #130825 100%)',
  'Science & Discovery':   'linear-gradient(135deg, #00111a 0%, #002a40 60%, #001520 100%)',
  'Religion & Faith':      'linear-gradient(135deg, #1a1000 0%, #3d2200 60%, #211400 100%)',
  'Trade & Economy':       'linear-gradient(135deg, #001510 0%, #003118 60%, #001d12 100%)',
  'Empires':               'linear-gradient(135deg, #1a0800 0%, #3d1500 60%, #250d00 100%)',
  'Ancient Civilizations': 'linear-gradient(135deg, #191200 0%, #3d2b00 60%, #241c00 100%)',
  'Industrial Age':        'linear-gradient(135deg, #080808 0%, #1c1c1c 60%, #101010 100%)',
  'Revolution & Rights':   'linear-gradient(135deg, #00061a 0%, #000f3d 60%, #000929 100%)',
  'Medieval World':        'linear-gradient(135deg, #000c1a 0%, #001633 60%, #000e20 100%)',
  'Arts & Culture':        'linear-gradient(135deg, #1a000a 0%, #3d0016 60%, #25000e 100%)',
  'Modern Politics':       'linear-gradient(135deg, #00071a 0%, #000f3d 60%, #000b2c 100%)',
  'Conflict & Identity':   'linear-gradient(135deg, #190010 0%, #38001e 60%, #250015 100%)',
  // Era fallback tokens (used when no topic match)
  'Ancient World':         'linear-gradient(135deg, #191200 0%, #3d2b00 60%, #241c00 100%)',
  'Middle Ages':           'linear-gradient(135deg, #000c1a 0%, #001633 60%, #000e20 100%)',
  'Early Modern':          'linear-gradient(135deg, #001510 0%, #003118 60%, #001d12 100%)',
  'Modern Era':            'linear-gradient(135deg, #080808 0%, #1c1c1c 60%, #101010 100%)',
};

// Topic classification by keyword matching
const TOPIC_RULES: Array<{
  keywords: string[];
  accent: string;
  accentLight: string;
  category: string;
  icon: string;
  pattern: string;
}> = [
  {
    keywords: ['war', 'battle', 'military', 'trench', 'crusade', 'world war', 'napoleon', 'revolution', 'conquest', 'punic', 'hundred years'],
    accent: '#dc2626', accentLight: '#fca5a5', category: 'Conflict & War', icon: '⚔', pattern: 'pattern-war',
  },
  {
    keywords: ['philosophy', 'philosopher', 'socrates', 'plato', 'aristotle', 'enlightenment', 'reason', 'ethics', 'logic'],
    accent: '#7c3aed', accentLight: '#c4b5fd', category: 'Philosophy', icon: '🏛', pattern: 'pattern-philosophy',
  },
  {
    keywords: ['science', 'scientific', 'newton', 'galileo', 'darwin', 'revolution', 'discovery', 'astronomy', 'mathematics'],
    accent: '#0891b2', accentLight: '#a5f3fc', category: 'Science & Discovery', icon: '🔭', pattern: 'pattern-science',
  },
  {
    keywords: ['religion', 'church', 'christian', 'islamic', 'muslim', 'protestant', 'catholic', 'faith', 'god', 'crusade', 'reformation'],
    accent: '#b45309', accentLight: '#fde68a', category: 'Religion & Faith', icon: '✦', pattern: 'pattern-religion',
  },
  {
    keywords: ['trade', 'economy', 'guild', 'merchant', 'silk road', 'commerce', 'market', 'gold', 'slave'],
    accent: '#047857', accentLight: '#a7f3d0', category: 'Trade & Economy', icon: '⚓', pattern: 'pattern-trade',
  },
  {
    keywords: ['empire', 'roman', 'greek', 'ottoman', 'mongol', 'persian', 'byzantine', 'imperial', 'dynasty', 'caesar'],
    accent: '#c2410c', accentLight: '#fed7aa', category: 'Empires', icon: '👑', pattern: 'pattern-empire',
  },
  {
    keywords: ['egypt', 'pyramid', 'pharaoh', 'mesopotamia', 'sumer', 'babylonian', 'ancient', 'nile', 'ziggurat'],
    accent: '#d97706', accentLight: '#fde68a', category: 'Ancient Civilizations', icon: '𓂀', pattern: 'pattern-ancient',
  },
  {
    keywords: ['industrial', 'steam', 'factory', 'coal', 'railway', 'machine', 'invention', 'steel'],
    accent: '#374151', accentLight: '#9ca3af', category: 'Industrial Age', icon: '⚙', pattern: 'pattern-industry',
  },
  {
    keywords: ['democratic', 'democracy', 'independence', 'republic', 'liberty', 'rights', 'constitution', 'revolution'],
    accent: '#1d4ed8', accentLight: '#93c5fd', category: 'Revolution & Rights', icon: '🗽', pattern: 'pattern-democracy',
  },
  {
    keywords: ['medieval', 'feudal', 'knight', 'castle', 'lord', 'serf', 'plague', 'black death', 'viking'],
    accent: '#1e3a5f', accentLight: '#93c5fd', category: 'Medieval World', icon: '⚜', pattern: 'pattern-medieval',
  },
  {
    keywords: ['art', 'renaissance', 'painting', 'michelangelo', 'leonardo', 'cultural', 'architecture', 'sculpture'],
    accent: '#9f1239', accentLight: '#fda4af', category: 'Arts & Culture', icon: '🖼', pattern: 'pattern-arts',
  },
  {
    keywords: ['cold war', 'nuclear', 'soviet', 'nato', 'decolonization', 'global', 'superpower', 'iron curtain'],
    accent: '#1e40af', accentLight: '#93c5fd', category: 'Modern Politics', icon: '🌐', pattern: 'pattern-politics',
  },
  {
    keywords: ['yugoslav', 'balkans', 'genocide', 'war', 'nationalism', 'ethnic', 'macedonian', 'struggle'],
    accent: '#831843', accentLight: '#f9a8d4', category: 'Conflict & Identity', icon: '⚑', pattern: 'pattern-conflict',
  },
];

// Era-based fallback themes
const ERA_THEMES: Record<string, { accent: string; accentLight: string; category: string; icon: string; pattern: string }> = {
  'ancient':      { accent: '#d97706', accentLight: '#fde68a', category: 'Ancient World',   icon: '🏺', pattern: 'pattern-ancient' },
  'middle-ages':  { accent: '#1e3a5f', accentLight: '#93c5fd', category: 'Middle Ages',     icon: '⚜',  pattern: 'pattern-medieval' },
  'early-modern': { accent: '#047857', accentLight: '#a7f3d0', category: 'Early Modern',    icon: '🌍', pattern: 'pattern-trade' },
  'modern':       { accent: '#374151', accentLight: '#9ca3af', category: 'Modern Era',      icon: '⚙',  pattern: 'pattern-industry' },
};

function matchTopic(text: string): typeof TOPIC_RULES[0] | null {
  const lower = text.toLowerCase();
  let best: typeof TOPIC_RULES[0] | null = null;
  let bestScore = 0;
  for (const rule of TOPIC_RULES) {
    const score = rule.keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = rule; }
  }
  return best;
}

// XP-based difficulty
function difficultyFromXp(xp: number): 'Starter' | 'Intermediate' | 'Advanced' {
  if (xp >= 150) return 'Advanced';
  if (xp >= 110) return 'Intermediate';
  return 'Starter';
}

export function getLessonTheme(lesson: {
  id: string;
  eraId: string;
  title: string;
  subtitle: string;
  xpReward: number;
  keyFacts?: string[];
}): LessonTheme {
  const searchText = [lesson.title, lesson.subtitle, ...(lesson.keyFacts ?? [])].join(' ');
  const match = matchTopic(searchText);

  const base = match
    ? { accent: match.accent, accentLight: match.accentLight, category: match.category, icon: match.icon, pattern: match.pattern }
    : (ERA_THEMES[lesson.eraId] ?? ERA_THEMES['ancient']);

  const bannerGradient = BANNER_TOKENS[base.category]
    ?? BANNER_TOKENS['Ancient World']!;

  const difficulty = difficultyFromXp(lesson.xpReward);
  const difficultyColor = difficulty === 'Advanced' ? 'text-rose-400' : difficulty === 'Intermediate' ? 'text-amber-400' : 'text-emerald-400';

  return {
    accentColor: base.accent,
    accentLight: base.accentLight,
    categoryLabel: base.category,
    categoryIcon: base.icon,
    patternClass: base.pattern,
    difficulty,
    difficultyColor,
    bannerGradient,
  };
}
