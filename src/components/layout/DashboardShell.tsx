import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import InputDashboard from '../views/InputDashboard';
import AiAgentTerminal from '../views/AiAgentTerminal';

type View = 'input' | 'terminal';

export default function DashboardShell() {
  const [activeView, setActiveView] = useState<View>('input');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      {/* Radial background gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(99,102,241,0.05) 0%, transparent 50%)',
        }}
      />

      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar activeView={activeView} />

        <main className="flex-1 overflow-y-auto">
          {activeView === 'input' ? (
            <InputDashboard onAuditComplete={() => setActiveView('terminal')} />
          ) : (
            <AiAgentTerminal />
          )}
        </main>
      </div>
    </div>
  );
}
