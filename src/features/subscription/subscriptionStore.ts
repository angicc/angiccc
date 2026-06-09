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

export const canAccessLesson = (tier: SubscriptionTier, order: number) => tier === 'free' ? order <= 1 : true;
export const canUseAI = (tier: SubscriptionTier, used: number, usedToday = 0): { allowed: boolean; reason?: string } => {
  if (tier === 'free') {
    if (usedToday >= 5) return { allowed: false, reason: 'You have used your 5 free daily messages. Come back tomorrow or upgrade to Pro for 50 messages/month.' };
    return { allowed: true };
  }
  if (tier === 'pro' && used >= 50) return { allowed: false, reason: 'You have used all 50 AI messages this month. Upgrade to Master for unlimited.' };
  return { allowed: true };
};
export const canDownload = (tier: SubscriptionTier) => tier === 'master';
export const canAdvancedStats = (tier: SubscriptionTier) => tier !== 'free';
export const canFilterTimeline = (tier: SubscriptionTier) => tier !== 'free';
export const canSeeExplanations = (tier: SubscriptionTier) => tier !== 'free';
