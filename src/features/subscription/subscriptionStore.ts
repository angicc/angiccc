import type { UserSubscription, SubscriptionTier } from '@/types';

const KEY = 'historify:subscription:';

export function loadSubscription(userId: string): UserSubscription {
  const raw = localStorage.getItem(KEY + userId);
  if (raw) { const s = JSON.parse(raw) as UserSubscription; if (resetIfNeeded(s)) saveSubscription(s); return s; }
  return createFree(userId);
}
export function saveSubscription(s: UserSubscription) { localStorage.setItem(KEY + s.userId, JSON.stringify(s)); }
export function createFree(userId: string): UserSubscription {
  const s: UserSubscription = { userId, tier: 'free', startedAt: new Date().toISOString(), renewsAt: null, aiMessagesUsedThisMonth: 0, currentPeriodStart: new Date().toISOString() };
  saveSubscription(s); return s;
}
export function upgradeSubscription(userId: string, tier: SubscriptionTier): UserSubscription {
  const s = loadSubscription(userId); const now = new Date(); const renew = new Date(now); renew.setMonth(renew.getMonth() + 1);
  s.tier = tier; s.startedAt = now.toISOString(); s.renewsAt = tier === 'free' ? null : renew.toISOString();
  s.aiMessagesUsedThisMonth = 0; s.currentPeriodStart = now.toISOString(); saveSubscription(s); return s;
}
export function recordAiMessageSub(userId: string): UserSubscription {
  const s = loadSubscription(userId);
  s.aiMessagesUsedThisMonth += 1;
  s.aiMessagesUsedToday = (s.aiMessagesUsedToday ?? 0) + 1;
  saveSubscription(s); return s;
}

function resetIfNeeded(s: UserSubscription): boolean {
  let changed = false;
  const days = (Date.now() - new Date(s.currentPeriodStart).getTime()) / 86400000;
  if (days >= 30) { s.aiMessagesUsedThisMonth = 0; s.currentPeriodStart = new Date().toISOString(); if (s.renewsAt) { const r = new Date(); r.setMonth(r.getMonth() + 1); s.renewsAt = r.toISOString(); } changed = true; }
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  if (!s.currentDayStart || new Date(s.currentDayStart).toDateString() !== todayStart.toDateString()) {
    s.aiMessagesUsedToday = 0; s.currentDayStart = todayStart.toISOString(); changed = true;
  }
  return changed;
}

export const canAccessLesson = (tier: SubscriptionTier, order: number) =>
  tier === 'free' || tier === 'beginner' ? order <= 1 : true;
/**
 * Whether this plan may spend another AI message, and — when it may not — the
 * translation key that says why.
 *
 * It returns a key rather than a sentence on purpose. These reasons used to be
 * English string literals that went straight into the UI, so a German, French,
 * Russian or Macedonian student who ran out of messages hit an English
 * paragraph in an otherwise translated app. Because the text never lived in the
 * `T` table, the build-time i18n guard could not see it either.
 *
 * `limit` is the allowance just exhausted; `nextLimit` the next plan's, absent
 * on Master since there is nothing above it.
 */
export interface AiAllowance {
  allowed: boolean;
  reasonKey?: 'ai_limit_free' | 'ai_limit_beginner' | 'ai_limit_pro' | 'ai_limit_master';
  limit?: number;
  nextLimit?: number;
  /** Which plan the message points at, so the UI can size the upgrade CTA. */
  nextTier?: SubscriptionTier;
}

export const AI_LIMITS = { free: 5, beginner: 10, pro: 50, master: 100 } as const;

export const canUseAI = (tier: SubscriptionTier, used: number, usedToday = 0): AiAllowance => {
  if (tier === 'free') {
    if (usedToday >= AI_LIMITS.free)
      return { allowed: false, reasonKey: 'ai_limit_free', limit: AI_LIMITS.free, nextLimit: AI_LIMITS.beginner, nextTier: 'beginner' };
    return { allowed: true };
  }
  if (tier === 'beginner') {
    if (usedToday >= AI_LIMITS.beginner)
      return { allowed: false, reasonKey: 'ai_limit_beginner', limit: AI_LIMITS.beginner, nextLimit: AI_LIMITS.pro, nextTier: 'pro' };
    return { allowed: true };
  }
  if (tier === 'pro' && used >= AI_LIMITS.pro)
    return { allowed: false, reasonKey: 'ai_limit_pro', limit: AI_LIMITS.pro, nextLimit: AI_LIMITS.master, nextTier: 'master' };
  if (tier === 'master' && used >= AI_LIMITS.master)
    return { allowed: false, reasonKey: 'ai_limit_master', limit: AI_LIMITS.master };
  return { allowed: true };
};
export const canDownload = (tier: SubscriptionTier) => tier === 'master';
export const canAdvancedStats = (tier: SubscriptionTier) => tier === 'pro' || tier === 'master';
export const canFilterTimeline = (tier: SubscriptionTier) => tier !== 'free';
export const canSeeExplanations = (tier: SubscriptionTier) => tier !== 'free';
/** Flashcards unlock at Beginner Student and above. */
export const canFlashcards = (tier: SubscriptionTier) => tier !== 'free';
