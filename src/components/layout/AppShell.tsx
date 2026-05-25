import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
