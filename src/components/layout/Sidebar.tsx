import { LayoutDashboard, Terminal, Activity, Settings, Zap } from 'lucide-react';
import { useAuditStore } from '../../store/auditState';

type View = 'input' | 'terminal';

type Props = {
  activeView: View;
  onViewChange: (v: View) => void;
};

const navItems = [
  { id: 'input' as View, icon: LayoutDashboard, label: 'Workspace' },
  { id: 'terminal' as View, icon: Terminal, label: 'AI Terminal' },
];

export default function Sidebar({ activeView, onViewChange }: Props) {
  const phase = useAuditStore((s) => s.phase);

  return (
    <aside className="w-16 lg:w-56 flex-shrink-0 bg-slate-950 border-r border-white/[0.06] flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="hidden lg:block text-sm font-bold text-white tracking-tight truncate">
            OutreachAudit<span className="text-emerald-400">.ai</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activeView === id;
          const isTerminal = id === 'terminal';
          const isLocked = isTerminal && phase === 'idle';
          return (
            <button
              key={id}
              onClick={() => !isLocked && onViewChange(id)}
              title={label}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150
                ${isActive
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                  : isLocked
                  ? 'text-slate-700 cursor-not-allowed'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/60'
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden lg:block truncate">{label}</span>
              {isTerminal && phase === 'complete' && (
                <span className="hidden lg:flex ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
              {isTerminal && phase === 'loading' && (
                <span className="hidden lg:flex ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div className="px-3 pb-4 hidden lg:block">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/[0.05]">
          <Activity className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
          <span className="text-xs text-slate-600 font-mono truncate">
            {phase === 'idle' ? 'STANDBY' : phase === 'loading' ? 'PROCESSING' : phase === 'complete' ? 'AUDIT READY' : 'ERROR'}
          </span>
          <span className={`ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            phase === 'idle' ? 'bg-slate-700' :
            phase === 'loading' ? 'bg-amber-400 animate-pulse' :
            phase === 'complete' ? 'bg-emerald-400' : 'bg-red-400'
          }`} />
        </div>
        <div className="mt-3 px-3">
          <Settings className="w-4 h-4 text-slate-700 hover:text-slate-400 cursor-pointer transition-colors" />
        </div>
      </div>
    </aside>
  );
}
