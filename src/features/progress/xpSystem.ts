import type { Achievement, AchievementCondition, UserProgress } from '@/types';

export const XP_REWARDS = { LESSON_COMPLETE: 100, QUIZ_CORRECT: 20, QUIZ_PERFECT: 100, STREAK_BONUS: 25, ACHIEVEMENT: 50, AI_FIRST_MESSAGE: 30 } as const;

export function calculateLevel(xp: number): number { return Math.floor(xp / 500) + 1; }

export function xpToNextLevel(xp: number) {
  const level = calculateLevel(xp);
  const baseXp = (level - 1) * 500;
  return { current: xp - baseXp, needed: 500, percent: ((xp - baseXp) / 500) * 100 };
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson',  title: 'First Steps',       description: 'Complete your first lesson',                     icon: 'BookOpen',      xpBonus: 50,  condition: { type: 'lessons_complete', count: 1 } },
  { id: 'scholar',       title: 'Scholar',            description: 'Complete 5 lessons',                            icon: 'GraduationCap', xpBonus: 100, condition: { type: 'lessons_complete', count: 5 } },
  { id: 'lessons-10',   title: 'Devoted Student',     description: 'Complete 10 lessons',                           icon: 'BookMarked',    xpBonus: 200, condition: { type: 'lessons_complete', count: 10 } },
  { id: 'lessons-15',   title: 'Seasoned Learner',    description: 'Complete 15 lessons',                           icon: 'Scroll',        xpBonus: 350, condition: { type: 'lessons_complete', count: 15 } },
  { id: 'historian',    title: 'Historian',            description: 'Complete 20 lessons',                           icon: 'Award',         xpBonus: 500, condition: { type: 'lessons_complete', count: 20 } },
  { id: 'lessons-25',  title: 'Grand Historian',      description: 'Complete 25 lessons',                           icon: 'GraduationCap', xpBonus: 750, condition: { type: 'lessons_complete', count: 25 } },
  { id: 'quiz-ace',     title: 'Quiz Ace',             description: 'Score 100% on any quiz',                        icon: 'Trophy',        xpBonus: 150, condition: { type: 'quiz_perfect' } },
  { id: 'quiz-3-ace',   title: 'Triple Crown',         description: 'Score 100% on 3 different era quizzes',         icon: 'Crown',         xpBonus: 300, condition: { type: 'quizzes_perfect_count', count: 3 } },
  { id: 'quiz-all',     title: 'Grand Master',         description: 'Score 100% on all 4 era quizzes',               icon: 'Medal',         xpBonus: 600, condition: { type: 'all_quizzes_perfect' } },
  { id: 'streak-3',     title: 'Dedicated',            description: 'Maintain a 3-day streak',                       icon: 'Flame',         xpBonus: 75,  condition: { type: 'streak', days: 3 } },
  { id: 'streak-7',     title: 'Unstoppable',          description: 'Maintain a 7-day streak',                       icon: 'Zap',           xpBonus: 200, condition: { type: 'streak', days: 7 } },
  { id: 'streak-14',    title: 'Iron Will',            description: 'Maintain a 14-day streak',                      icon: 'Shield',        xpBonus: 400, condition: { type: 'streak', days: 14 } },
  { id: 'streak-30',    title: 'Legend',               description: 'Maintain a 30-day streak',                      icon: 'Gem',           xpBonus: 1000, condition: { type: 'streak', days: 30 } },
  { id: 'xp-1000',      title: 'Knowledge Seeker',     description: 'Earn 1,000 XP',                                 icon: 'Star',          xpBonus: 100, condition: { type: 'xp_total', amount: 1000 } },
  { id: 'xp-5000',      title: 'Knowledge Addict',     description: 'Earn 5,000 XP',                                 icon: 'Sparkles',      xpBonus: 250, condition: { type: 'xp_total', amount: 5000 } },
  { id: 'xp-10000',     title: 'Knowledge Titan',      description: 'Earn 10,000 XP',                                icon: 'Diamond',       xpBonus: 500, condition: { type: 'xp_total', amount: 10000 } },
  { id: 'ai-curious',   title: 'Curious Mind',         description: 'Ask the AI Tutor 10 questions',                 icon: 'MessageSquare', xpBonus: 75,  condition: { type: 'ai_messages', count: 10 } },
  { id: 'ai-philosopher', title: 'Philosopher',        description: 'Ask the AI Tutor 50 questions',                 icon: 'Brain',         xpBonus: 200, condition: { type: 'ai_messages', count: 50 } },
  { id: 'explorer',     title: 'Explorer',             description: 'Start lessons in all 4 eras',                   icon: 'Map',           xpBonus: 100, condition: { type: 'all_eras_started' } },
  { id: 'ancient-master', title: 'Ancient Scholar',   description: 'Complete all Ancient era lessons',               icon: 'Scroll',        xpBonus: 200, condition: { type: 'era_lessons_complete', eraId: 'ancient', count: 6 } },
  { id: 'medieval-master', title: 'Medieval Knight', description: 'Complete all Middle Ages lessons',                icon: 'Shield',        xpBonus: 200, condition: { type: 'era_lessons_complete', eraId: 'middle-ages', count: 6 } },
  { id: 'earlymod-master', title: 'Renaissance Mind', description: 'Complete all Early Modern lessons',              icon: 'Compass',       xpBonus: 200, condition: { type: 'era_lessons_complete', eraId: 'early-modern', count: 7 } },
  { id: 'modern-master', title: 'Modern Thinker',    description: 'Complete all Modern Era lessons',                 icon: 'Zap',           xpBonus: 200, condition: { type: 'era_lessons_complete', eraId: 'modern', count: 7 } },
  { id: 'debate-first',  title: 'Philosopher Slayer', description: 'Win your first philosopher debate',              icon: 'Swords',        xpBonus: 150, condition: { type: 'debate_wins', count: 1 } },
  { id: 'debate-master', title: 'Master Debater',    description: 'Win 5 philosopher debates',                       icon: 'Crown',         xpBonus: 400, condition: { type: 'debate_wins', count: 5 } },
];

export function checkAchievements(progress: UserProgress): Achievement[] {
  return ACHIEVEMENTS.filter(a => !progress.achievements.includes(a.id) && meetsCondition(a.condition, progress));
}

function meetsCondition(c: AchievementCondition, p: UserProgress): boolean {
  switch (c.type) {
    case 'lessons_complete': return p.completedLessons.length >= c.count;
    case 'quiz_perfect': return c.eraId ? (p.quizScores[c.eraId] ?? 0) >= 100 : Object.values(p.quizScores).some(s => s >= 100);
    case 'streak': return p.streak >= c.days;
    case 'xp_total': return p.xp >= c.amount;
    case 'all_eras_started': return ['ancient','medieval','earlymod','modern'].every(prefix => p.completedLessons.some(id => id.startsWith(prefix)));
    case 'ai_messages': return (p.aiMessageCount ?? 0) >= c.count;
    case 'all_quizzes_perfect': return Object.values(p.quizScores).filter(s => s >= 100).length >= 4;
    case 'quizzes_perfect_count': return Object.values(p.quizScores).filter(s => s >= 100).length >= c.count;
    case 'era_lessons_complete': return p.completedLessons.filter(id => id.startsWith(c.eraId.replace('middle-ages','medieval').replace('early-modern','earlymod'))).length >= c.count;
    case 'debate_wins': return (p.debateWins ?? 0) >= c.count;
  }
}
