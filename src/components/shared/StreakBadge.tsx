import { Flame } from 'lucide-react';
export function StreakBadge({ streak, compact = false }: { streak: number; compact?: boolean }) {
  if (streak === 0) return compact ? null : <p className="text-xs text-muted-foreground">Start your streak today!</p>;
  return (
    <div className="flex items-center gap-1.5">
      <Flame className={`text-orange-400 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
      <span className={`font-medium text-orange-400 ${compact ? 'text-xs' : 'text-sm'}`}>{streak} day{streak !== 1 ? 's' : ''}</span>
    </div>
  );
}
