import type { Achievement, AchievementCondition, UserProgress } from '@/types';
import { LESSONS } from '@/features/content/lessonsData';
import { ERAS } from '@/features/content/erasData';

export const XP_REWARDS = { LESSON_COMPLETE: 100, QUIZ_CORRECT: 20, QUIZ_PERFECT: 100, STREAK_BONUS: 25, ACHIEVEMENT: 50, AI_FIRST_MESSAGE: 30, ANALYSIS_PASS: 60 } as const;

// ── Progressive level curve ─────────────────────────────────────────────────
// Sized for the 120-lesson world: early levels come fast (500 XP), the middle
// band demands 750, and the long tail 1000 — so max-curriculum learners keep
// levelling instead of outrunning a flat curve. Level is always derived from
// total XP, so existing users migrate automatically.
function levelStep(level: number): number {
  if (level <= 10) return 500;
  if (level <= 25) return 750;
  return 1000;
}

export function calculateLevel(xp: number): number {
  let level = 1;
  let rest = Math.max(0, xp);
  while (rest >= levelStep(level)) { rest -= levelStep(level); level++; }
  return level;
}

export function xpToNextLevel(xp: number) {
  let level = 1;
  let rest = Math.max(0, xp);
  while (rest >= levelStep(level)) { rest -= levelStep(level); level++; }
  const needed = levelStep(level);
  return { current: rest, needed, percent: (rest / needed) * 100 };
}

// Lesson ids are prefixed per era ('ancient-01', 'medieval-03', …) while two
// era ids differ from their prefix — resolve through this map everywhere.
const ERA_ID_PREFIX: Record<string, string> = { 'middle-ages': 'medieval', 'early-modern': 'earlymod' };
const eraPrefix = (eraId: string) => ERA_ID_PREFIX[eraId] ?? eraId;
/** Live lesson count per era — era-mastery achievements scale with the curriculum. */
const eraLessonCount = (eraId: string) => LESSONS.filter(l => l.eraId === eraId).length;

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson',  title: 'First Steps',       description: 'Complete your first lesson',                     icon: 'BookOpen',      xpBonus: 50,  condition: { type: 'lessons_complete', count: 1 } },
  { id: 'scholar',       title: 'Scholar',            description: 'Complete 5 lessons',                            icon: 'GraduationCap', xpBonus: 100, condition: { type: 'lessons_complete', count: 5 } },
  { id: 'lessons-10',   title: 'Devoted Student',     description: 'Complete 10 lessons',                           icon: 'BookMarked',    xpBonus: 200, condition: { type: 'lessons_complete', count: 10 } },
  { id: 'lessons-15',   title: 'Seasoned Learner',    description: 'Complete 15 lessons',                           icon: 'Scroll',        xpBonus: 350, condition: { type: 'lessons_complete', count: 15 } },
  { id: 'historian',    title: 'Historian',            description: 'Complete 20 lessons',                           icon: 'Award',         xpBonus: 500, condition: { type: 'lessons_complete', count: 20 } },
  { id: 'lessons-25',  title: 'Grand Historian',      description: 'Complete 25 lessons',                           icon: 'GraduationCap', xpBonus: 750, condition: { type: 'lessons_complete', count: 25 } },
  { id: 'lessons-40',  title: 'Lecture Hall Legend',  description: 'Complete 40 lessons',                           icon: 'Library',       xpBonus: 900, condition: { type: 'lessons_complete', count: 40 } },
  { id: 'lessons-60',  title: 'Curriculum Conqueror', description: 'Complete 60 lessons',                           icon: 'Landmark',      xpBonus: 1200, condition: { type: 'lessons_complete', count: 60 } },
  { id: 'lessons-all', title: 'Omniscient Historian', description: 'Complete every lesson in Historify',            icon: 'Globe',         xpBonus: 2000, condition: { type: 'all_lessons_complete' } },
  { id: 'quiz-ace',     title: 'Quiz Ace',             description: 'Score 100% on any quiz',                        icon: 'Trophy',        xpBonus: 150, condition: { type: 'quiz_perfect' } },
  { id: 'quiz-3-ace',   title: 'Triple Crown',         description: 'Score 100% on 3 different era quizzes',         icon: 'Crown',         xpBonus: 300, condition: { type: 'quizzes_perfect_count', count: 3 } },
  { id: 'quiz-all',     title: 'Grand Master',         description: 'Score 100% on every era quiz',                  icon: 'Medal',         xpBonus: 600, condition: { type: 'all_quizzes_perfect' } },
  { id: 'streak-3',     title: 'Dedicated',            description: 'Maintain a 3-day streak',                       icon: 'Flame',         xpBonus: 75,  condition: { type: 'streak', days: 3 } },
  { id: 'streak-7',     title: 'Unstoppable',          description: 'Maintain a 7-day streak',                       icon: 'Zap',           xpBonus: 200, condition: { type: 'streak', days: 7 } },
  { id: 'streak-14',    title: 'Iron Will',            description: 'Maintain a 14-day streak',                      icon: 'Shield',        xpBonus: 400, condition: { type: 'streak', days: 14 } },
  { id: 'streak-30',    title: 'Legend',               description: 'Maintain a 30-day streak',                      icon: 'Gem',           xpBonus: 1000, condition: { type: 'streak', days: 30 } },
  { id: 'xp-1000',      title: 'Knowledge Seeker',     description: 'Earn 1,000 XP',                                 icon: 'Star',          xpBonus: 100, condition: { type: 'xp_total', amount: 1000 } },
  { id: 'xp-5000',      title: 'Knowledge Addict',     description: 'Earn 5,000 XP',                                 icon: 'Sparkles',      xpBonus: 250, condition: { type: 'xp_total', amount: 5000 } },
  { id: 'xp-10000',     title: 'Knowledge Titan',      description: 'Earn 10,000 XP',                                icon: 'Diamond',       xpBonus: 500, condition: { type: 'xp_total', amount: 10000 } },
  { id: 'ai-curious',   title: 'Curious Mind',         description: 'Ask the AI Tutor 10 questions',                 icon: 'MessageSquare', xpBonus: 75,  condition: { type: 'ai_messages', count: 10 } },
  { id: 'ai-philosopher', title: 'Philosopher',        description: 'Ask the AI Tutor 50 questions',                 icon: 'Brain',         xpBonus: 200, condition: { type: 'ai_messages', count: 50 } },
  { id: 'explorer',     title: 'Explorer',             description: 'Start lessons in every era',                    icon: 'Map',           xpBonus: 100, condition: { type: 'all_eras_started' } },
  { id: 'prehistoric-master', title: 'Deep Time Walker', description: 'Complete all Prehistoric lessons',            icon: 'Footprints',    xpBonus: 200, condition: { type: 'era_lessons_complete', eraId: 'prehistoric', count: eraLessonCount('prehistoric') } },
  { id: 'ancient-master', title: 'Ancient Scholar',   description: 'Complete all Ancient era lessons',               icon: 'Scroll',        xpBonus: 200, condition: { type: 'era_lessons_complete', eraId: 'ancient', count: eraLessonCount('ancient') } },
  { id: 'byzantine-master', title: 'Porphyrogennetos', description: 'Complete all Byzantine World lessons',          icon: 'Church',        xpBonus: 200, condition: { type: 'era_lessons_complete', eraId: 'byzantine', count: eraLessonCount('byzantine') } },
  { id: 'medieval-master', title: 'Medieval Knight', description: 'Complete all Middle Ages lessons',                icon: 'Shield',        xpBonus: 200, condition: { type: 'era_lessons_complete', eraId: 'middle-ages', count: eraLessonCount('middle-ages') } },
  { id: 'earlymod-master', title: 'Renaissance Mind', description: 'Complete all Early Modern lessons',              icon: 'Compass',       xpBonus: 200, condition: { type: 'era_lessons_complete', eraId: 'early-modern', count: eraLessonCount('early-modern') } },
  { id: 'modern-master', title: 'Modern Thinker',    description: 'Complete all Modern Era lessons',                 icon: 'Zap',           xpBonus: 200, condition: { type: 'era_lessons_complete', eraId: 'modern', count: eraLessonCount('modern') } },
  { id: 'debate-first',  title: 'Philosopher Slayer', description: 'Win your first philosopher debate',              icon: 'Swords',        xpBonus: 150, condition: { type: 'debate_wins', count: 1 } },
  { id: 'debate-master', title: 'Master Debater',    description: 'Win 5 philosopher debates',                       icon: 'Crown',         xpBonus: 400, condition: { type: 'debate_wins', count: 5 } },
  { id: 'analysis-first', title: "The Examiner's Nod", description: "Pass your first Clio analysis (grade B or better)", icon: 'Feather',   xpBonus: 75,  condition: { type: 'analysis_passes', count: 1 } },
  { id: 'analysis-5',   title: 'Essayist',             description: 'Pass 5 Clio lesson analyses',                   icon: 'PenTool',       xpBonus: 150, condition: { type: 'analysis_passes', count: 5 } },
  { id: 'analysis-15',  title: 'Rhetorician',          description: 'Pass 15 Clio lesson analyses',                  icon: 'Quote',         xpBonus: 300, condition: { type: 'analysis_passes', count: 15 } },
  { id: 'analysis-40',  title: 'Master of Argument',   description: 'Pass 40 Clio lesson analyses',                  icon: 'Scale',         xpBonus: 600, condition: { type: 'analysis_passes', count: 40 } },
  { id: 'analysis-aplus', title: "Clio's Favorite",    description: 'Earn an A+ on a lesson analysis',               icon: 'BadgeCheck',    xpBonus: 250, condition: { type: 'analysis_aplus' } },

  // ── Long-haul goals ────────────────────────────────────────────────────────
  // The ladders above stopped early: lessons ended at 60 of 132, streaks at 30
  // days, XP at 10,000. A committed learner ran out of things to earn well
  // before running out of curriculum.
  { id: 'lessons-80',   title: 'Chronicler',           description: 'Complete 80 lessons',                           icon: 'Library',       xpBonus: 800,  condition: { type: 'lessons_complete', count: 80 } },
  { id: 'lessons-100',  title: 'Keeper of Ages',       description: 'Complete 100 lessons',                          icon: 'Landmark',      xpBonus: 1200, condition: { type: 'lessons_complete', count: 100 } },
  { id: 'streak-60',    title: 'Two Moons',            description: 'Keep a 60-day streak',                          icon: 'Moon',          xpBonus: 600,  condition: { type: 'streak', days: 60 } },
  { id: 'streak-100',   title: 'Century of Days',      description: 'Keep a 100-day streak',                         icon: 'Sunrise',       xpBonus: 1000, condition: { type: 'streak', days: 100 } },
  { id: 'streak-365',   title: 'A Year in History',    description: 'Keep a 365-day streak',                         icon: 'CalendarCheck', xpBonus: 2500, condition: { type: 'streak', days: 365 } },
  { id: 'xp-25000',     title: 'Archivist',            description: 'Earn 25,000 XP',                                icon: 'Gem',           xpBonus: 1000, condition: { type: 'xp_total', amount: 25000 } },
  { id: 'xp-50000',     title: 'Living Library',       description: 'Earn 50,000 XP',                                icon: 'Sparkles',      xpBonus: 2000, condition: { type: 'xp_total', amount: 50000 } },
  { id: 'level-25',     title: 'Ascendant',            description: 'Reach level 25',                                icon: 'TrendingUp',    xpBonus: 750,  condition: { type: 'level_reached', level: 25 } },

  // ── Breadth rather than depth ──────────────────────────────────────────────
  { id: 'quiz-perfect-1', title: 'Flawless',           description: 'Score 100% on any era quiz',                    icon: 'Target',        xpBonus: 150,  condition: { type: 'quizzes_perfect_count', count: 1 } },
  { id: 'quiz-perfect-6', title: 'Unerring',           description: 'Score 100% on 6 era quizzes',                   icon: 'Medal',         xpBonus: 900,  condition: { type: 'quizzes_perfect_count', count: 6 } },
  { id: 'quizzes-10',   title: 'Well Examined',        description: 'Complete 10 quizzes',                           icon: 'ClipboardCheck', xpBonus: 300, condition: { type: 'quizzes_taken', count: 10 } },
  { id: 'ai-200',       title: 'Clio\'s Confidant',    description: 'Exchange 200 messages with Clio',               icon: 'MessagesSquare', xpBonus: 500, condition: { type: 'ai_messages', count: 200 } },
  { id: 'debate-15',    title: 'Voice of the Forum',   description: 'Win 15 philosopher debates',                    icon: 'Podcast',       xpBonus: 900,  condition: { type: 'debate_wins', count: 15 } },

  // ── Video Review ───────────────────────────────────────────────────────────
  // videoXp was already being recorded and never rewarded.
  { id: 'video-500',    title: 'Screening Room',       description: 'Earn 500 XP from Video Review',                 icon: 'Clapperboard',  xpBonus: 250,  condition: { type: 'video_xp', amount: 500 } },
  { id: 'video-2000',   title: 'Documentarian',        description: 'Earn 2,000 XP from Video Review',               icon: 'Projector',     xpBonus: 700,  condition: { type: 'video_xp', amount: 2000 } },
];

export function checkAchievements(progress: UserProgress): Achievement[] {
  return ACHIEVEMENTS.filter(a => !progress.achievements.includes(a.id) && meetsCondition(a.condition, progress));
}

/**
 * How far along a locked achievement is, for the ones that count towards a
 * target. Returns null for all-or-nothing conditions (a perfect quiz is not
 * "60% done"), so the caller can show those without a misleading bar.
 */
export function achievementProgress(c: AchievementCondition, p: UserProgress): { current: number; target: number } | null {
  const perfectQuizzes = () => Object.values(p.quizScores).filter(s => s >= 100).length;
  switch (c.type) {
    case 'lessons_complete': return { current: p.completedLessons.length, target: c.count };
    case 'all_lessons_complete': return { current: p.completedLessons.length, target: LESSONS.length };
    case 'streak': return { current: p.streak, target: c.days };
    case 'xp_total': return { current: p.xp, target: c.amount };
    case 'ai_messages': return { current: p.aiMessageCount ?? 0, target: c.count };
    case 'all_quizzes_perfect': return { current: perfectQuizzes(), target: ERAS.length };
    case 'quizzes_perfect_count': return { current: perfectQuizzes(), target: c.count };
    case 'era_lessons_complete':
      return { current: p.completedLessons.filter(id => id.startsWith(eraPrefix(c.eraId))).length, target: c.count };
    case 'debate_wins': return { current: p.debateWins ?? 0, target: c.count };
    case 'analysis_passes': return { current: p.analysisPasses ?? 0, target: c.count };
    case 'video_xp': return { current: p.videoXp ?? 0, target: c.amount };
    case 'quizzes_taken': return { current: p.completedQuizzes.length, target: c.count };
    case 'level_reached': return { current: p.level, target: c.level };
    case 'all_eras_started':
      return { current: ERAS.filter(era => p.completedLessons.some(id => id.startsWith(eraPrefix(era.id)))).length, target: ERAS.length };
    case 'quiz_perfect':
    case 'analysis_aplus':
      return null; // all-or-nothing
  }
}

function meetsCondition(c: AchievementCondition, p: UserProgress): boolean {
  switch (c.type) {
    case 'lessons_complete': return p.completedLessons.length >= c.count;
    case 'quiz_perfect': return c.eraId ? (p.quizScores[c.eraId] ?? 0) >= 100 : Object.values(p.quizScores).some(s => s >= 100);
    case 'streak': return p.streak >= c.days;
    case 'xp_total': return p.xp >= c.amount;
    case 'all_eras_started': return ERAS.every(era => p.completedLessons.some(id => id.startsWith(eraPrefix(era.id))));
    case 'ai_messages': return (p.aiMessageCount ?? 0) >= c.count;
    case 'all_quizzes_perfect': return Object.values(p.quizScores).filter(s => s >= 100).length >= ERAS.length;
    case 'quizzes_perfect_count': return Object.values(p.quizScores).filter(s => s >= 100).length >= c.count;
    case 'era_lessons_complete': return p.completedLessons.filter(id => id.startsWith(eraPrefix(c.eraId))).length >= c.count;
    case 'debate_wins': return (p.debateWins ?? 0) >= c.count;
    case 'analysis_passes': return (p.analysisPasses ?? 0) >= c.count;
    case 'analysis_aplus': return (p.analysisBestScore ?? 0) >= 97;
    case 'all_lessons_complete': return p.completedLessons.length >= LESSONS.length;
    case 'video_xp': return (p.videoXp ?? 0) >= c.amount;
    case 'quizzes_taken': return p.completedQuizzes.length >= c.count;
    case 'level_reached': return p.level >= c.level;
  }
}
