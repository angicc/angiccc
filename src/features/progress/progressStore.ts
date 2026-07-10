import type { UserProgress, ActivityEvent, QuizAttempt, Achievement } from '@/types';
import { calculateLevel, checkAchievements, XP_REWARDS, ACHIEVEMENTS } from './xpSystem';

const KEY = 'historify:progress:';

export function loadProgress(userId: string): UserProgress {
  const raw = localStorage.getItem(KEY + userId);
  return raw ? JSON.parse(raw) : createInitialProgress(userId);
}

export function saveProgress(p: UserProgress) { localStorage.setItem(KEY + p.userId, JSON.stringify(p)); }

export function createInitialProgress(userId: string): UserProgress {
  const p: UserProgress = { userId, xp: 0, level: 1, streak: 0, lastActivityDate: '', completedLessons: [], completedQuizzes: [], quizScores: {}, achievements: [], recentActivity: [], aiMessageCount: 0 };
  saveProgress(p); return p;
}

export function markLessonComplete(userId: string, lessonId: string, lessonTitle: string): { progress: UserProgress; newAchievements: Achievement[] } {
  const p = loadProgress(userId);
  if (!p.completedLessons.includes(lessonId)) {
    p.completedLessons.push(lessonId);
    p.xp += XP_REWARDS.LESSON_COMPLETE;
    p.level = calculateLevel(p.xp);
    addActivity(p, { type: 'lesson_complete', title: `Completed: ${lessonTitle}`, xpGained: XP_REWARDS.LESSON_COMPLETE, timestamp: new Date().toISOString() });
  }
  updateStreak(p);
  const newAchievements = unlockAchievements(p);
  saveProgress(p);
  return { progress: p, newAchievements };
}

export function recordQuizAttempt(userId: string, attempt: QuizAttempt, eraName: string): { progress: UserProgress; newAchievements: Achievement[] } {
  const p = loadProgress(userId);
  if (attempt.score > (p.quizScores[attempt.quizId] ?? 0)) p.quizScores[attempt.quizId] = attempt.score;
  if (!p.completedQuizzes.includes(attempt.quizId)) p.completedQuizzes.push(attempt.quizId);
  p.xp += attempt.xpEarned; p.level = calculateLevel(p.xp);
  addActivity(p, { type: 'quiz_complete', title: `${eraName} Quiz — ${attempt.score}%`, xpGained: attempt.xpEarned, timestamp: new Date().toISOString() });
  updateStreak(p);
  const newAchievements = unlockAchievements(p);
  saveProgress(p);
  return { progress: p, newAchievements };
}

export function recordAiMessage(userId: string): { progress: UserProgress; newAchievements: Achievement[] } {
  const p = loadProgress(userId);
  p.aiMessageCount = (p.aiMessageCount ?? 0) + 1;
  if (p.aiMessageCount === 1) { p.xp += XP_REWARDS.AI_FIRST_MESSAGE; p.level = calculateLevel(p.xp); addActivity(p, { type: 'ai_chat', title: 'First AI Tutor conversation', xpGained: XP_REWARDS.AI_FIRST_MESSAGE, timestamp: new Date().toISOString() }); }
  const newAchievements = unlockAchievements(p);
  saveProgress(p); return { progress: p, newAchievements };
}

function updateStreak(p: UserProgress) {
  const today = new Date().toDateString();
  const last = p.lastActivityDate ? new Date(p.lastActivityDate).toDateString() : '';
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (last === today) return;
  if (last === yesterday) { p.streak += 1; if (p.streak >= 3) { p.xp += XP_REWARDS.STREAK_BONUS; p.level = calculateLevel(p.xp); } }
  else p.streak = 1;
  p.lastActivityDate = new Date().toISOString();
}

function unlockAchievements(p: UserProgress): Achievement[] {
  const newOnes = checkAchievements(p);
  for (const a of newOnes) { p.achievements.push(a.id); p.xp += XP_REWARDS.ACHIEVEMENT + a.xpBonus; p.level = calculateLevel(p.xp); addActivity(p, { type: 'achievement_unlock', title: `Achievement: ${a.title}`, xpGained: XP_REWARDS.ACHIEVEMENT + a.xpBonus, timestamp: new Date().toISOString() }); }
  return newOnes;
}

function addActivity(p: UserProgress, e: ActivityEvent) { p.recentActivity.unshift(e); if (p.recentActivity.length > 20) p.recentActivity = p.recentActivity.slice(0, 20); }

export function recordDebateWinInProgress(userId: string, amount: number, philosopherName: string): { progress: UserProgress; newAchievements: Achievement[] } {
  const p = loadProgress(userId);
  p.debateWins = (p.debateWins ?? 0) + 1;
  p.xp += amount; p.level = calculateLevel(p.xp);
  addActivity(p, { type: 'quiz_complete', title: `Defeated ${philosopherName} in debate`, xpGained: amount, timestamp: new Date().toISOString() });
  updateStreak(p);
  const newAchievements = unlockAchievements(p);
  saveProgress(p);
  return { progress: p, newAchievements };
}

export function addBonusXp(userId: string, amount: number, title: string): { progress: UserProgress; newAchievements: Achievement[] } {
  const p = loadProgress(userId);
  p.xp += amount; p.level = calculateLevel(p.xp);
  addActivity(p, { type: 'quiz_complete', title, xpGained: amount, timestamp: new Date().toISOString() });
  updateStreak(p);
  const newAchievements = unlockAchievements(p);
  saveProgress(p);
  return { progress: p, newAchievements };
}

export function getAchievementById(id: string) { return ACHIEVEMENTS.find(a => a.id === id); }
