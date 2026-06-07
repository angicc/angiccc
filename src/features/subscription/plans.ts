import type { SubscriptionPlan, SubscriptionTier } from '@/types';

export const PLANS: SubscriptionPlan[] = [
  { id: 'free', name: 'Free', price: 0, description: 'Start your history journey.', color: 'border-border',
    features: ['1 lesson per era (4 total)', 'Basic quiz (score only)', 'Timeline – major events only', 'Basic progress tracking'],
    limits: { lessonsPerEra: 1, quizExplanations: false, aiMessagesPerMonth: 0, timelineFilter: false, advancedStats: false, downloadableNotes: false } },
  { id: 'pro', name: 'Pro Learner', price: 10, description: 'Unlock the full curriculum.', badge: 'Most Popular', color: 'border-primary',
    features: ['All 18 lessons across 4 eras', 'Full quizzes with explanations', 'AI Tutor – 50 messages/month', 'Full timeline with filters', 'Smart Quiz (adaptive AI)', 'XP, achievements & streaks', 'Progress analytics'],
    limits: { lessonsPerEra: 'unlimited', quizExplanations: true, aiMessagesPerMonth: 50, timelineFilter: true, advancedStats: true, downloadableNotes: false } },
  { id: 'master', name: 'Master Student', price: 20, description: 'The complete Historify experience.', color: 'border-amber-400',
    features: ['Everything in Pro Learner', 'Unlimited AI Tutor messages', 'Downloadable lesson notes', 'Advanced analytics', 'Priority support', 'Master badge on profile'],
    limits: { lessonsPerEra: 'unlimited', quizExplanations: true, aiMessagesPerMonth: 'unlimited', timelineFilter: true, advancedStats: true, downloadableNotes: true } },
];

export function getPlanById(id: SubscriptionTier): SubscriptionPlan { return PLANS.find(p => p.id === id)!; }
