import { cn } from '@/lib/utils';

export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {/* Left pillar of H */}
        <rect x="2" y="4" width="5" height="20" rx="2.5" fill="hsl(var(--primary))" />
        {/* Right pillar of H */}
        <rect x="21" y="4" width="5" height="20" rx="2.5" fill="hsl(var(--primary))" fillOpacity="0.7" />
        {/* Timeline crossbar */}
        <line x1="7" y1="14" x2="21" y2="14" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
        {/* Era dots — amber (ancient), primary (middle), emerald (early-modern), rose (modern) */}
        <circle cx="9.5" cy="14" r="2.2" fill="#f59e0b" />
        <circle cx="14" cy="14" r="2.2" fill="hsl(var(--primary))" />
        <circle cx="18.5" cy="14" r="2.2" fill="#10b981" />
      </svg>
      {!iconOnly && <span className="font-accent text-xl text-primary tracking-wide">Historify</span>}
    </div>
  );
}
