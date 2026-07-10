import type { SubscriptionPlan, SubscriptionTier } from '@/types';

export const PLANS: SubscriptionPlan[] = [
  { id: 'free', name: 'Free', price: 0, description: 'Start your history journey.', color: 'border-border',
    features: ['1 lesson per era (4 total)', 'Basic quiz (score only)', 'Timeline – major events only', 'Basic progress tracking', 'Leaderboard access', 'Clio AI Tutor – 5 messages/day'],
    limits: { lessonsPerEra: 1, quizExplanations: false, aiMessagesPerMonth: 0, timelineFilter: false, advancedStats: false, downloadableNotes: false } },
  { id: 'pro', name: 'Pro Learner', price: 10, description: 'Unlock the full curriculum.', badge: 'Most Popular', color: 'border-primary',
    features: ['All lessons across 4 eras', 'Full quizzes with explanations', 'AI Tutor – 50 messages/month', 'Full timeline with filters', 'Smart Quiz (adaptive AI)', 'Flashcards & spaced repetition', 'Personal notes & bookmarks', 'XP, achievements & streaks', 'Progress analytics & leaderboard', 'Debate a Philosopher (resets every 12 hours)', 'Territory Map – interactive historical borders & markers', 'Conquest Campaign – Ancient & Medieval map campaigns'],
    limits: { lessonsPerEra: 'unlimited', quizExplanations: true, aiMessagesPerMonth: 50, timelineFilter: true, advancedStats: true, downloadableNotes: false } },
  { id: 'master', name: 'Master Student', price: 20, description: 'The complete Historify experience.', color: 'border-amber-400',
    features: ['Everything in Pro Learner', 'AI Essay Challenge (exclusive)', 'Video Review Challenge (exclusive)', 'AI Tutor – 300 messages/month', 'Downloadable lesson notes', 'Advanced analytics & skills radar', 'Historical Chess Ranks (Video XP)', 'Conquest Campaign – all four eras + Legendary Mode (2× XP)', 'Priority support', 'Master badge on profile'],
    limits: { lessonsPerEra: 'unlimited', quizExplanations: true, aiMessagesPerMonth: 300, timelineFilter: true, advancedStats: true, downloadableNotes: true } },
];

export function getPlanById(id: SubscriptionTier): SubscriptionPlan { return PLANS.find(p => p.id === id)!; }
