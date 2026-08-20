import { useNavigate } from 'react-router-dom';
import { Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props { title?: string; description?: string; requiredPlan?: 'beginner' | 'pro' | 'master'; compact?: boolean; }

/**
 * The paywall card, on 21 screens.
 *
 * Everything visible here used to be an English string literal — the title, the
 * fallback description, the "Upgrade" button and the plan label. Callers that
 * passed a translated title and description therefore still rendered an English
 * button beneath them, and the ones that passed neither were English top to
 * bottom. Plan names ("Pro Student") stay in English on purpose: they are
 * product names and read that way on the pricing page in every language.
 */
export function UpgradePrompt({ title, description, requiredPlan = 'pro', compact = false }: Props) {
  const nav = useNavigate();
  const { t } = useLanguage();

  const planLabel: Record<'beginner' | 'pro' | 'master', string> = {
    beginner: t.upgrade_to_beginner,
    pro: t.upgrade_to_pro,
    master: t.upgrade_to_master,
  };
  const heading = title ?? t.upgrade_premium_title;
  const body = description ?? t.upgrade_premium_desc;

  if (compact) return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
      <Lock className="w-4 h-4 text-primary shrink-0" />
      <p className="text-sm text-muted-foreground flex-1">{body}</p>
      <Button size="sm" onClick={() => nav('/pricing')}>{t.upgrade_btn}</Button>
    </div>
  );
  return (
    <Card className="border-primary/40 bg-primary/5">
      <CardContent className="flex flex-col items-center text-center gap-4 py-10">
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center"><Lock className="w-7 h-7 text-primary" /></div>
        <div><h3 className="font-heading text-lg font-semibold mb-1">{heading}</h3><p className="text-muted-foreground text-sm max-w-xs">{body}</p></div>
        <Button onClick={() => nav('/pricing')} className="gap-2"><Zap className="w-4 h-4" />{planLabel[requiredPlan]}</Button>
      </CardContent>
    </Card>
  );
}
