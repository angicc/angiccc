import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, BookOpen, ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PLANS } from '@/features/subscription/plans';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { useAuth } from '@/features/auth/AuthContext';
import { PaymentModal } from '@/components/shared/PaymentModal';
import { Logo } from '@/components/shared/Logo';
import { toast } from 'sonner';
import type { SubscriptionTier } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const ICONS: Record<SubscriptionTier, React.ReactNode> = { free: <BookOpen className="w-6 h-6" />, pro: <Zap className="w-6 h-6" />, master: <Crown className="w-6 h-6" /> };

export default function PricingPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { subscription, upgrade } = useSubscription();
  const tier = subscription?.tier ?? 'free';
  const [payTarget, setPayTarget] = useState<{ id: SubscriptionTier; name: string; price: number } | null>(null);

  function handleSelect(id: SubscriptionTier) {
    if (!currentUser) { navigate('/register'); return; }
    if (tier === id) { toast.info('You are already on this plan.'); return; }
    const plan = PLANS.find(p => p.id === id)!;
    if (id === 'free') {
      upgrade('free');
      toast.success('Downgraded to Free plan.');
      navigate('/dashboard');
      return;
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
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map(plan => {
            const isCurrent = tier === plan.id;
            const isUp = ['free','pro','master'].indexOf(plan.id) > ['free','pro','master'].indexOf(tier);
            return (
              <Card key={plan.id} className={`relative flex flex-col border-2 ${plan.color} ${plan.id === 'pro' ? 'shadow-lg shadow-primary/20 scale-[1.02]' : ''} ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
                {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs"><Star className="w-3 h-3 mr-1" />{plan.badge}</Badge></div>}
                {isCurrent && <div className="absolute -top-3 right-4"><Badge variant="secondary" className="text-xs">{t.pricing_current}</Badge></div>}
                <CardHeader className="pb-4">
                  <div className={`flex items-center gap-3 mb-3 ${plan.id === 'master' ? 'text-amber-400' : plan.id === 'pro' ? 'text-primary' : 'text-muted-foreground'}`}>{ICONS[plan.id as SubscriptionTier]}<span className="font-heading text-xl font-bold text-foreground">{plan.name}</span></div>
                  <div className="flex items-baseline gap-1 mb-2">
                    {plan.price === 0 ? <span className="text-4xl font-bold font-heading">Free</span> : <><span className="text-4xl font-bold font-heading">${plan.price}</span><span className="text-muted-foreground text-sm">/month</span></>}
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-6">
                  <ul className="space-y-3 flex-1">{plan.features.map(f => <li key={f} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>{f}</span></li>)}</ul>
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
              { q:'Can I cancel at any time?', a:'Yes. Downgrade to Free anytime from your profile settings — no lock-in.' },
              { q:'What happens to my progress if I downgrade?', a:'All your XP, achievements, and completed lessons are saved forever regardless of plan.' },
              { q:'Is payment secure?', a:'In this demo, plan selection is simulated. Production payments would use Stripe with full PCI compliance.' },
              { q:'What counts as an AI message?', a:'Each message you send to the AI Tutor counts as one. Tutor responses do not count against your limit.' },
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
