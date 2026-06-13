import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserSubscription, SubscriptionTier } from '@/types';
import { loadSubscription, upgradeSubscription, recordAiMessageSub, canAccessLesson, canUseAI, canDownload, canAdvancedStats, canFilterTimeline, canSeeExplanations } from './subscriptionStore';
import { useAuth } from '@/features/auth/AuthContext';

interface SubCtx {
  subscription: UserSubscription | null; upgrade(t: SubscriptionTier): void; trackAiMessage(): void;
  canLesson(order: number): boolean; canAI(): { allowed: boolean; reason?: string };
  canDownload(): boolean; canAdvancedStats(): boolean; canTimeline(): boolean; canExplanations(): boolean;
  canTerritoryMap(): boolean;
  refreshSubscription(): void;
}
const SubContext = createContext<SubCtx | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => { setSubscription(currentUser ? loadSubscription(currentUser.id) : null); }, [currentUser]);

  const refreshSubscription = useCallback(() => { if (currentUser) setSubscription(loadSubscription(currentUser.id)); }, [currentUser]);
  const upgrade = useCallback((t: SubscriptionTier) => { if (currentUser) setSubscription(upgradeSubscription(currentUser.id, t)); }, [currentUser]);
  const trackAiMessage = useCallback(() => { if (currentUser) setSubscription(recordAiMessageSub(currentUser.id)); }, [currentUser]);

  const tier = subscription?.tier ?? 'free';
  const used = subscription?.aiMessagesUsedThisMonth ?? 0;
  const usedToday = subscription?.aiMessagesUsedToday ?? 0;

  return (
    <SubContext.Provider value={{ subscription, upgrade, trackAiMessage, canLesson: o => canAccessLesson(tier, o), canAI: () => canUseAI(tier, used, usedToday), canDownload: () => canDownload(tier), canAdvancedStats: () => canAdvancedStats(tier), canTimeline: () => canFilterTimeline(tier), canExplanations: () => canSeeExplanations(tier), canTerritoryMap: () => tier !== 'free', refreshSubscription }}>
      {children}
    </SubContext.Provider>
  );
}

export function useSubscription() { const c = useContext(SubContext); if (!c) throw new Error('useSubscription outside provider'); return c; }
