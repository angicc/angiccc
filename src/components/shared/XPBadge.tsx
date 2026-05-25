import { useEffect, useState } from 'react';
export function XPBadge({ amount, onDone }: { amount: number; onDone?: () => void }) {
  const [vis, setVis] = useState(true);
  useEffect(() => { const t = setTimeout(() => { setVis(false); onDone?.(); }, 1200); return () => clearTimeout(t); }, [onDone]);
  if (!vis) return null;
  return (
    <div className="pointer-events-none fixed bottom-24 right-8 z-50 animate-xp-float">
      <div className="bg-primary text-primary-foreground font-bold text-sm px-4 py-2 rounded-full shadow-lg shadow-primary/30">+{amount} XP</div>
    </div>
  );
}
