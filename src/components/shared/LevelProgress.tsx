import { Progress } from '@/components/ui/progress';
import { calculateLevel, xpToNextLevel } from '@/features/progress/xpSystem';
export function LevelProgress({ xp, compact = false, className = '' }: { xp: number; compact?: boolean; className?: string }) {
  const level = calculateLevel(xp);
  const { current, needed, percent } = xpToNextLevel(xp);
  if (compact) return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs font-medium text-primary whitespace-nowrap">Lv.{level}</span>
      <Progress value={percent} className="h-1.5 w-20" />
    </div>
  );
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex justify-between text-sm"><span className="font-semibold text-primary">Level {level}</span><span className="text-muted-foreground text-xs">{current} / {needed} XP</span></div>
      <Progress value={percent} className="h-2" />
      <p className="text-xs text-muted-foreground">{needed - current} XP to Level {level + 1}</p>
    </div>
  );
}
