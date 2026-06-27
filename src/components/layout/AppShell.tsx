import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ParticleCanvas } from '@/components/shared/ParticleCanvas';
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
    <div className="flex h-screen bg-background relative overflow-hidden">
      <ParticleCanvas />
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-col flex-1 min-w-0 relative z-10 overflow-hidden">
        <TopBar />
        <main ref={mainRef} className={cn(
          'flex-1 animate-fade-in',
          compact ? 'overflow-hidden' : 'p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto'
        )}>{children}</main>
        <div className="shrink-0 px-4 py-1.5 text-center text-[10px] text-muted-foreground/40 select-none border-t border-border/20">
          © {new Date().getFullYear()} Historify. All rights reserved.
        </div>
      </div>
    </div>
  );
}
