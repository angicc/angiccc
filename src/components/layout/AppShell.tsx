// ─── Master Layout Template — the global 3-zone shell ────────────────────────
// Zone A: 240px sidebar on Layer 0 (Deep Obsidian) — the deepest surface.
// Zone B: 70px utility header on Layer 1 (Stone Slate).
// Zone C: fluid main content on Layer 1 with comfortable p-8 padding.
// Hierarchy is expressed through color elevation (nearer = lighter), never
// hard borders; the sole permitted separator is a 1px rgba(255,255,255,0.05)
// hairline. Feature pages mount into Zone C via `children`.
import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ParticleCanvas } from '@/components/shared/ParticleCanvas';
import { GoldenDustOfTime } from '@/components/shared/GoldenDustOfTime';
import { cn } from '@/lib/utils';

export function AppShell({ children, compact }: { children: React.ReactNode; compact?: boolean }) {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Reset scroll position on every route change. The scrollable element is the
  // <main> container (not the window), so we reset it directly; window.scrollTo
  // is a harmless fallback for any browser that scrolls the document instead.
  // useLayoutEffect runs synchronously before the browser paints, so the new
  // page never flashes at the previous page's scroll offset.
  useLayoutEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 });
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-layer-0 relative overflow-hidden">
      {/* Ambient layer 0 — Golden Dust of Time drifts behind the whole shell. */}
      <GoldenDustOfTime position="fixed" zIndex={0} />
      <ParticleCanvas />
      {/* Zone A — sidebar (Layer 0, blends into the base canvas) */}
      <Sidebar className="hidden lg:flex relative z-10" />
      {/* Zones B + C — the raised content panel (Layer 1) */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10 overflow-hidden bg-layer-0 lg:rounded-tl-2xl">
        <TopBar />
        <main ref={mainRef} className={cn(
          'flex-1 animate-fade-in scroll-smooth',
          compact ? 'overflow-hidden' : 'p-4 sm:p-6 lg:p-8 overflow-y-auto',
        )}>{children}</main>
        <div className="shrink-0 px-4 py-1.5 text-center text-[10px] text-muted-foreground/40 select-none">
          © {new Date().getFullYear()} Historify. All rights reserved.
        </div>
      </div>
    </div>
  );
}
