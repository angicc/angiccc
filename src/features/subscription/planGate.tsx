// ─── Plan gating primitives ───────────────────────────────────────────────────
// Declarative monetization guardrails. `PlanGate` renders its children only
// when the active subscription meets the required tier; otherwise it renders
// the standard UpgradePrompt. `withPlanGate` is the HOC form for gating whole
// pages. Gating is enforced at render time on every mount — there is no
// client-side cache a user can flip to bypass it, and the AI gateway's own
// per-plan message limits (canAI) remain the second, independent layer.
import type { ComponentType, ReactNode } from 'react';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';

export type PlanTier = 'free' | 'beginner' | 'pro' | 'master';

const TIER_RANK: Record<PlanTier, number> = { free: 0, beginner: 1, pro: 2, master: 3 };

export function usePlanTier(): PlanTier {
  const { subscription } = useSubscription();
  return (subscription?.tier ?? 'free') as PlanTier;
}

export function PlanGate({ plan, description, children }: {
  plan: PlanTier;
  /** Localized copy explaining what the plan unlocks. */
  description: string;
  children: ReactNode;
}) {
  const tier = usePlanTier();
  if (TIER_RANK[tier] < TIER_RANK[plan]) {
    return <UpgradePrompt description={description} requiredPlan={plan === 'free' ? 'beginner' : plan} />;
  }
  return <>{children}</>;
}

/** HOC form: `export default withPlanGate(Page, 'master', () => t.key)` */
export function withPlanGate<P extends object>(
  Component: ComponentType<P>,
  plan: PlanTier,
  useDescription: () => string,
) {
  return function GatedComponent(props: P) {
    const description = useDescription();
    return (
      <PlanGate plan={plan} description={description}>
        <Component {...props} />
      </PlanGate>
    );
  };
}
