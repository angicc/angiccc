import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, BookOpen, ArrowLeft, Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PLANS } from '@/features/subscription/plans';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { useAuth } from '@/features/auth/AuthContext';
import { billingConfigured, startCheckout } from '@/services/billing';
import { PaymentModal } from '@/components/shared/PaymentModal';
import { Logo } from '@/components/shared/Logo';
import { toast } from 'sonner';
import type { SubscriptionTier } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslatedPlanFeatures, getTranslatedPlanDescription } from '@/i18n/planTranslations';

const ICONS: Record<SubscriptionTier, React.ReactNode> = { free: <BookOpen className="w-6 h-6" />, beginner: <Star className="w-6 h-6" />, pro: <Zap className="w-6 h-6" />, master: <Crown className="w-6 h-6" /> };
const TIER_ORDER: SubscriptionTier[] = ['free', 'beginner', 'pro', 'master'];

export default function PricingPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { subscription, upgrade } = useSubscription();
  const tier = subscription?.tier ?? 'free';
  const [payTarget, setPayTarget] = useState<{ id: SubscriptionTier; name: string; price: number } | null>(null);

  async function handleSelect(id: SubscriptionTier) {
    if (!currentUser) { navigate('/register'); return; }
    if (tier === id) { toast.info('You are already on this plan.'); return; }
    const plan = PLANS.find(p => p.id === id)!;
    if (id === 'free') {
      upgrade('free');
      toast.success('Downgraded to Free plan.');
      navigate('/dashboard');
      return;
    }
    // Real money path: with a backend configured, purchases go through Stripe
    // Checkout (subscription + free trial, card up front). The demo modal
    // only appears in local/preview builds that have no VITE_API_URL.
    if (billingConfigured()) {
      try {
        const url = await startCheckout(id as 'beginner' | 'pro' | 'master');
        if (url) { window.location.assign(url); return; }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not start checkout — please try again.');
        return;
      }
    }
    setPayTarget({ id, name: plan.name, price: plan.price });
  }

  function handlePaySuccess() {
    if (!payTarget) return;
    upgrade(payTarget.id);
    toast.success(`Welcome to ${payTarget.name}! Your features are now active.`);
    setPayTarget(null);
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background scroll-pattern">
      <PaymentModal
        open={!!payTarget}
        onClose={() => setPayTarget(null)}
        planName={payTarget?.name ?? ''}
        price={payTarget?.price ?? 0}
        onSuccess={handlePaySuccess}
      />
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={currentUser ? '/dashboard' : '/'} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /> {t.pricing_back}</Link>
          <Logo />
          <div className="w-16" />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{t.pricing_title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.pricing_subtitle}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-400 text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />{t.pricing_guarantee}
          </div>
          {(subscription?.nextRenewalDiscountPct ?? 0) > 0 && (
            <div className="mt-3 block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-400 text-sm font-medium">
                🎁 {t.gift_reward_badge}
              </span>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {PLANS.map(plan => {
            const isCurrent = tier === plan.id;
            const isUp = TIER_ORDER.indexOf(plan.id) > TIER_ORDER.indexOf(tier);
            return (
              <Card key={plan.id} className={`relative flex flex-col border-2 ${plan.color} ${plan.id === 'pro' ? 'shadow-lg shadow-primary/20 scale-[1.02]' : ''} ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
                {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs"><Star className="w-3 h-3 mr-1" />{plan.badge}</Badge></div>}
                {isCurrent && <div className="absolute -top-3 right-4"><Badge variant="secondary" className="text-xs">{t.pricing_current}</Badge></div>}
                <CardHeader className="pb-4">
                  <div className={`flex items-center gap-3 mb-3 ${plan.id === 'master' ? 'text-amber-400' : plan.id === 'pro' ? 'text-primary' : plan.id === 'beginner' ? 'text-emerald-400' : 'text-muted-foreground'}`}>{ICONS[plan.id as SubscriptionTier]}<span className="font-heading text-xl font-bold text-foreground">{plan.name}</span></div>
                  <div className="flex items-baseline gap-1 mb-2">
                    {plan.price === 0 ? <span className="text-4xl font-bold font-heading">{t.pricing_price_free}</span> : <><span className="text-4xl font-bold font-heading">${plan.price}</span><span className="text-muted-foreground text-sm">{t.pricing_month}</span></>}
                  </div>
                  {plan.price > 0 && <div className="text-xs font-semibold text-emerald-400 mb-1">{t.pricing_trial_note}</div>}
                  <p className="text-muted-foreground text-sm">{getTranslatedPlanDescription(plan.id, language) ?? plan.description}</p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-6">
                  <ul className="space-y-3 flex-1">{(getTranslatedPlanFeatures(plan.id, language) ?? plan.features).map(f => <li key={f} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>{f}</span></li>)}</ul>
                  <Button className="w-full" variant={plan.id === 'pro' ? 'default' : plan.id === 'master' ? 'outline' : 'secondary'} onClick={() => handleSelect(plan.id as SubscriptionTier)} disabled={isCurrent}>
                    {isCurrent ? t.pricing_cur_btn : isUp ? `${t.pricing_upgrade_to} ${plan.name}` : plan.price === 0 ? t.pricing_downgrade_free : `${t.pricing_switch_to} ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-20">
          <h2 className="font-heading text-2xl font-bold text-center mb-8">{t.pricing_faq}</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { q: t.pricing_faq_q1, a: t.pricing_faq_a1 },
              { q: t.pricing_faq_q2, a: t.pricing_faq_a2 },
              { q: t.pricing_faq_q3, a: t.pricing_faq_a3 },
              { q: t.pricing_faq_q4, a: t.pricing_faq_a4 },
            ].map(({ q, a }) => (
              <div key={q} className="p-5 rounded-lg border border-border bg-card">
                <h3 className="font-semibold mb-2 text-sm">{q}</h3>
                <p className="text-muted-foreground text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
