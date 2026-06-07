import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ParticleCanvas } from '@/components/shared/ParticleCanvas';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background relative overflow-x-hidden">
      <ParticleCanvas />
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        <TopBar />
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
