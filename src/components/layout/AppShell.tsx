import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ParticleCanvas } from '@/components/shared/ParticleCanvas';
import { cn } from '@/lib/utils';

export function AppShell({ children, compact }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      <ParticleCanvas />
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-col flex-1 min-w-0 relative z-10 overflow-hidden">
        <TopBar />
        <main className={cn(
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
