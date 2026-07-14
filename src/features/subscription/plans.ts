import type { SubscriptionPlan, SubscriptionTier } from '@/types';

export const PLANS: SubscriptionPlan[] = [
  { id: 'free', name: 'Free', price: 0, description: 'Start your history journey.', color: 'border-border',
    features: ['1 lesson per era (4 total)', 'Basic quiz (score only)', 'Timeline – major events only', 'Basic progress tracking', 'Leaderboard access', 'Clio AI Tutor – 5 messages/day'],
    limits: { lessonsPerEra: 1, quizExplanations: false, aiMessagesPerMonth: 0, timelineFilter: false, advancedStats: false, downloadableNotes: false } },
  { id: 'beginner', name: 'Beginner Student', price: 4.99, description: 'The essentials to build a daily habit.', color: 'border-emerald-400/60',
    features: ['Everything in Free', 'Full timeline with era filters', 'Flashcards – all decks', 'Clio AI Tutor – 10 messages/day', 'Quiz explanations for every answer'],
    limits: { lessonsPerEra: 1, quizExplanations: true, aiMessagesPerMonth: 0, timelineFilter: true, advancedStats: false, downloadableNotes: false } },
  { id: 'pro', name: 'Pro Student', price: 9.99, description: 'Unlock the full curriculum.', badge: 'Most Popular', color: 'border-primary',
    features: ['Everything in Beginner', 'All lessons across 4 eras', 'AI Tutor – 50 messages/month', 'Smart Quiz (adaptive AI)', 'Study Plan – weekly learning path', 'AI Content Studio – study kits from any text', 'Personal notes & bookmarks', 'Progress analytics & leaderboard', 'Debate a Philosopher (resets every 12 hours)', 'Territory Map – interactive historical borders & markers'],
    limits: { lessonsPerEra: 'unlimited', quizExplanations: true, aiMessagesPerMonth: 50, timelineFilter: true, advancedStats: true, downloadableNotes: false } },
  { id: 'master', name: 'Master Student', price: 17.99, description: 'The complete Historify experience.', color: 'border-amber-400',
    features: ['Everything in Pro Student', 'Chronos Crisis Room (exclusive)', 'AI Essay Challenge (exclusive)', 'Video Review Challenge (exclusive)', 'Conquest Campaign – animated battles, all four eras + Legendary Mode (2× XP)', 'Study Plan – "Enhance with Clio" coaching', 'AI Tutor – 100 messages/month', 'Downloadable lesson notes', 'Advanced analytics & skills radar', 'Historical Chess Ranks (Video XP)', 'Master badge on profile'],
    limits: { lessonsPerEra: 'unlimited', quizExplanations: true, aiMessagesPerMonth: 100, timelineFilter: true, advancedStats: true, downloadableNotes: true } },
];

export function getPlanById(id: SubscriptionTier): SubscriptionPlan { return PLANS.find(p => p.id === id)!; }
