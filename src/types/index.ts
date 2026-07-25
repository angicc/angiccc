export type SubscriptionTier = 'free' | 'beginner' | 'pro' | 'master';
export interface SubscriptionPlan {
  id: SubscriptionTier; name: string; price: number; description: string;
  features: string[]; limits: SubscriptionLimits; badge?: string; color: string;
}
export interface SubscriptionLimits {
  lessonsPerEra: number | 'unlimited'; quizExplanations: boolean;
  aiMessagesPerMonth: number | 'unlimited'; timelineFilter: boolean;
  advancedStats: boolean; downloadableNotes: boolean;
}
export interface UserSubscription {
  userId: string; tier: SubscriptionTier; startedAt: string;
  renewsAt: string | null; aiMessagesUsedThisMonth: number; currentPeriodStart: string;
  aiMessagesUsedToday?: number; currentDayStart?: string;
  /** Percent off the next renewal, earned by gifting a plan (consumed at renewal). */
  nextRenewalDiscountPct?: number;
  /** Username of the gifter when this tier came from a gift. */
  giftedBy?: string;
}
export interface User {
  id: string; username: string; email: string;
  /** btoa(password) – localStorage only, not for production */
  passwordHash: string; avatarInitials: string; createdAt: string;
}
export interface UserProgress {
  userId: string; xp: number; level: number; streak: number;
  lastActivityDate: string; completedLessons: string[]; completedQuizzes: string[];
  quizScores: Record<string, number>; achievements: string[];
  recentActivity: ActivityEvent[]; aiMessageCount: number;
  videoXp?: number; debateWins?: number;
  analysisPasses?: number; analysisBestScore?: number;
}
export interface ActivityEvent {
  type: 'lesson_complete' | 'quiz_complete' | 'achievement_unlock' | 'ai_chat';
  title: string; xpGained: number; timestamp: string;
}
export type EraId = 'prehistoric' | 'ancient' | 'byzantine' | 'middle-ages' | 'early-modern' | 'modern';
export type EraIcon = 'flame' | 'scroll' | 'church' | 'castle' | 'compass' | 'industry';
export interface Era {
  id: EraId; name: string; shortName: string; dateRange: string;
  description: string; icon: EraIcon; color: string; bgGradient: string;
  lessonIds: string[]; quizId: string;
}
export interface Lesson {
  id: string; eraId: EraId; order: number; title: string; subtitle: string;
  estimatedMinutes: number; xpReward: number; imageUrl?: string;
  sections: LessonSection[]; keyFacts: string[]; relatedTimeline: string[];
}
export interface LessonSection { heading: string; body: string; imageCaption?: string; }
export interface Quiz {
  id: string; eraId: EraId; title: string;
  questions: QuizQuestion[]; xpPerCorrect: number; passingScore: number;
}
export interface QuizQuestion {
  id: string; question: string; options: string[];
  correctIndex: number; explanation: string; difficulty: 'easy' | 'medium' | 'hard';
}
export interface QuizAttempt { quizId: string; answers: number[]; score: number; xpEarned: number; completedAt: string; }
export type TimelineCategory = 'war' | 'politics' | 'science' | 'culture' | 'religion' | 'exploration';
export interface TimelineEvent {
  id: string; year: number; displayYear: string; title: string;
  description: string; eraId: EraId; category: TimelineCategory; significance: 'major' | 'minor';
}
export interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; timestamp: string; isStreaming?: boolean; /** Optional user-attached image (downscaled data URL) for Clio vision. */ image?: string; }
export interface ChatSession { id: string; messages: ChatMessage[]; createdAt: string; }
export type AchievementCondition =
  | { type: 'lessons_complete'; count: number } | { type: 'quiz_perfect'; eraId?: EraId }
  | { type: 'streak'; days: number } | { type: 'xp_total'; amount: number }
  | { type: 'all_eras_started' } | { type: 'ai_messages'; count: number }
  | { type: 'all_quizzes_perfect' } | { type: 'quizzes_perfect_count'; count: number }
  | { type: 'era_lessons_complete'; eraId: EraId; count: number }
  | { type: 'debate_wins'; count: number }
  | { type: 'analysis_passes'; count: number }
  | { type: 'analysis_aplus' }
  | { type: 'all_lessons_complete' };
export interface Achievement { id: string; title: string; description: string; icon: string; xpBonus: number; condition: AchievementCondition; }
