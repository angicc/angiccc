import type { Achievement, AchievementCondition, UserProgress } from '@/types';

export const XP_REWARDS = { LESSON_COMPLETE: 100, QUIZ_CORRECT: 20, QUIZ_PERFECT: 100, STREAK_BONUS: 25, ACHIEVEMENT: 50, AI_FIRST_MESSAGE: 30 } as const;

export function calculateLevel(xp: number): number { return Math.floor(xp / 500) + 1; }

export function xpToNextLevel(xp: number) {
  const level = calculateLevel(xp);
  const baseXp = (level - 1) * 500;
  return { current: xp - baseXp, needed: 500, percent: ((xp - baseXp) / 500) * 100 };
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson', icon: 'BookOpen', xpBonus: 50, condition: { type: 'lessons_complete', count: 1 } },
  { id: 'scholar', title: 'Scholar', description: 'Complete 5 lessons', icon: 'GraduationCap', xpBonus: 100, condition: { type: 'lessons_complete', count: 5 } },
  { id: 'historian', title: 'Historian', description: 'Complete all 14 lessons', icon: 'Award', xpBonus: 500, condition: { type: 'lessons_complete', count: 14 } },
  { id: 'quiz-ace', title: 'Quiz Ace', description: 'Score 100% on any quiz', icon: 'Trophy', xpBonus: 150, condition: { type: 'quiz_perfect' } },
  { id: 'streak-3', title: 'Dedicated', description: 'Maintain a 3-day streak', icon: 'Flame', xpBonus: 75, condition: { type: 'streak', days: 3 } },
  { id: 'streak-7', title: 'Unstoppable', description: 'Maintain a 7-day streak', icon: 'Zap', xpBonus: 200, condition: { type: 'streak', days: 7 } },
  { id: 'xp-1000', title: 'Knowledge Seeker', description: 'Earn 1,000 XP', icon: 'Star', xpBonus: 100, condition: { type: 'xp_total', amount: 1000 } },
  { id: 'ai-curious', title: 'Curious Mind', description: 'Ask the AI Tutor 10 questions', icon: 'MessageSquare', xpBonus: 75, condition: { type: 'ai_messages', count: 10 } },
  { id: 'explorer', title: 'Explorer', description: 'Start lessons in all 4 eras', icon: 'Map', xpBonus: 100, condition: { type: 'all_eras_started' } },
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
  }
}
