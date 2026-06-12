import { BookOpen, GraduationCap, Award, Trophy, Flame, Zap, Star, MessageSquare, Map } from 'lucide-react';
import type { Achievement } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslatedAchievement } from '@/i18n/achievementTranslations';
const ICONS: Record<string, React.ComponentType<{className?: string}>> = { BookOpen, GraduationCap, Award, Trophy, Flame, Zap, Star, MessageSquare, Map };
export function AchievementCard({ achievement, unlocked, compact = false }: { achievement: Achievement; unlocked: boolean; compact?: boolean }) {
  const { language, t } = useLanguage();
  const trans = getTranslatedAchievement(achievement.id, language);
  const title = trans?.title ?? achievement.title;
  const description = trans?.description ?? achievement.description;
  const Icon = ICONS[achievement.icon] ?? Award;
  if (compact) return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${unlocked ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/30 opacity-50 grayscale'}`}>
      <Icon className={`w-5 h-5 shrink-0 ${unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
      <div className="min-w-0"><p className="text-xs font-semibold truncate">{title}</p><p className="text-xs text-muted-foreground truncate">{description}</p></div>
    </div>
  );
  return (
    <div className={`flex flex-col items-center gap-3 p-5 rounded-xl border text-center ${unlocked ? 'border-primary/40 bg-primary/5' : 'border-border bg-card opacity-60 grayscale'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${unlocked ? 'bg-primary/20' : 'bg-muted'}`}><Icon className={`w-6 h-6 ${unlocked ? 'text-primary' : 'text-muted-foreground'}`} /></div>
      <div><p className="font-semibold text-sm">{title}</p><p className="text-xs text-muted-foreground mt-0.5">{description}</p></div>
      {unlocked ? <Badge variant="secondary" className="text-xs">+{achievement.xpBonus} XP</Badge> : <Badge variant="outline" className="text-xs text-muted-foreground">{t.prog_locked}</Badge>}
    </div>
  );
}
