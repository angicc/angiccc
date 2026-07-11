import { useNavigate } from 'react-router-dom';
import { Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
interface Props { title?: string; description?: string; requiredPlan?: 'beginner' | 'pro' | 'master'; compact?: boolean; }

const PLAN_LABEL: Record<'beginner' | 'pro' | 'master', string> = {
  beginner: 'Upgrade to Beginner Student',
  pro: 'Upgrade to Pro Student',
  master: 'Upgrade to Master Student',
};
export function UpgradePrompt({ title = 'Premium Feature', description = 'Upgrade your plan to access this feature.', requiredPlan = 'pro', compact = false }: Props) {
  const nav = useNavigate();
  if (compact) return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
      <Lock className="w-4 h-4 text-primary shrink-0" />
      <p className="text-sm text-muted-foreground flex-1">{description}</p>
      <Button size="sm" onClick={() => nav('/pricing')}>Upgrade</Button>
    </div>
  );
  return (
    <Card className="border-primary/40 bg-primary/5">
      <CardContent className="flex flex-col items-center text-center gap-4 py-10">
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center"><Lock className="w-7 h-7 text-primary" /></div>
        <div><h3 className="font-heading text-lg font-semibold mb-1">{title}</h3><p className="text-muted-foreground text-sm max-w-xs">{description}</p></div>
        <Button onClick={() => nav('/pricing')} className="gap-2"><Zap className="w-4 h-4" />{PLAN_LABEL[requiredPlan]}</Button>
      </CardContent>
    </Card>
  );
}
