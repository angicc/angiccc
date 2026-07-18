import { ScrollText, Castle, Compass, Factory, Flame, Church } from 'lucide-react';
import type { EraIcon as T } from '@/types';
export function EraIcon({ icon, className = 'w-5 h-5' }: { icon: T; className?: string }) {
  switch (icon) {
    case 'flame': return <Flame className={className} />;
    case 'scroll': return <ScrollText className={className} />;
    case 'church': return <Church className={className} />;
    case 'castle': return <Castle className={className} />;
    case 'compass': return <Compass className={className} />;
    case 'industry': return <Factory className={className} />;
  }
}
