import { Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { pluralDays } from '@/i18n/plurals';

export function StreakBadge({ streak, compact = false }: { streak: number; compact?: boolean }) {
  const { t, language } = useLanguage();
  if (streak === 0) return compact ? null : <p className="text-xs text-muted-foreground">{t.streak_start_today}</p>;
  return (
    <div className="flex items-center gap-1.5">
      <Flame className={`text-orange-400 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
      <span className={`font-medium text-orange-400 ${compact ? 'text-xs' : 'text-sm'}`}>
        {streak} {pluralDays(streak, language, t)}
      </span>
    </div>
  );
}
