import {
  LayoutDashboard, Terminal, Users, Shield, FlaskConical, Webhook, MessageSquare, Trophy,
  User, Settings, Zap, Activity, ChevronDown, ChevronRight, BarChart2, Swords,
  BookOpen, AlertTriangle, Target, Crown
} from 'lucide-react';
import { useState } from 'react';
import { useAuditStore, getChessRank } from '../../store/auditState';

export type View =
  | 'input' | 'terminal'
  | 'leads' | 'dns' | 'abtesting'
  | 'webhooks' | 'replies'
  | 'leaderboard'
  | 'warmup' | 'objection'
  | 'chessrank' | 'dailypuzzle'
  | 'guide' | 'reportproblem'
  | 'profile' | 'settings';

type Props = {
  activeView: View;
  onViewChange: (v: View) => void;
};

type NavItem = { id: View; icon: React.ElementType; label: string; badge?: string };
type NavSection = { label: string; items: NavItem[] };

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Core',
    items: [
      { id: 'input', icon: LayoutDashboard, label: 'Workspace' },
      { id: 'terminal', icon: Terminal, label: 'AI Terminal' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'leads', icon: Users, label: 'Lead Scraper Hub' },
      { id: 'dns', icon: Shield, label: 'DNS Shield' },
      { id: 'abtesting', icon: FlaskConical, label: 'A/B Testing' },
    ],
  },
  {
    label: 'Automation',
    items: [
      { id: 'webhooks', icon: Webhook, label: 'Webhook Hub' },
      { id: 'replies', icon: MessageSquare, label: 'Reply Simulator' },
    ],
  },
  {
    label: 'Agency',
    items: [
      { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    ],
  },
  {
    label: 'Premium Tools',
    items: [
      { id: 'warmup', icon: BarChart2, label: 'Warmup Simulator' },
      { id: 'objection', icon: Swords, label: 'Objection Roleplay' },
    ],
  },
  {
    label: 'Gamification',
    items: [
      { id: 'chessrank', icon: Crown, label: 'AI Chess Rank' },
      { id: 'dailypuzzle', icon: Target, label: 'Daily Puzzle' },
    ],
  },
  {
    label: 'Support',
    items: [
      { id: 'guide', icon: BookOpen, label: 'App Guide' },
      { id: 'reportproblem', icon: AlertTriangle, label: 'Report Problem' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'profile', icon: User, label: 'User Profile' },
      { id: 'settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function Sidebar({ activeView, onViewChange }: Props) {
  const phase = useAuditStore((s) => s.phase);
  const xp = useAuditStore((s) => s.xp);
  const rank = getChessRank(xp);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggleSection(label: string) {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <aside className="w-16 lg:w-60 flex-shrink-0 bg-slate-950 border-r border-white/[0.06] flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="hidden lg:block text-sm font-black text-white tracking-tight truncate">
            AngelReach<span className="text-emerald-400">.ai</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV_SECTIONS.map((section) => {
          const isCollapsed = collapsed[section.label];
          return (
            <div key={section.label} className="mb-1">
              <button
                onClick={() => toggleSection(section.label)}
                className="hidden lg:flex w-full items-center justify-between px-2 py-1.5 mb-0.5 group"
              >
                <span className="text-[9px] uppercase tracking-widest font-bold text-slate-600 group-hover:text-slate-500 transition-colors">
                  {section.label}
                </span>
                {isCollapsed
                  ? <ChevronRight className="w-2.5 h-2.5 text-slate-700" />
                  : <ChevronDown className="w-2.5 h-2.5 text-slate-700" />
                }
              </button>

              <div className="lg:hidden h-px bg-white/[0.03] mx-2 my-1.5" />

              {!isCollapsed && section.items.map(({ id, icon: Icon, label }) => {
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
                        ? 'bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20'
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
                    {id === 'dailypuzzle' && (
                      <span className="hidden lg:flex ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom: rank + status */}
      <div className="px-3 pb-4 hidden lg:block flex-shrink-0 space-y-2">
        {/* Chess rank */}
        <button
          onClick={() => onViewChange('chessrank')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/[0.05] hover:border-white/10 transition-colors"
        >
          <span className="text-base leading-none">{rank.symbol}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-400 font-semibold truncate">{rank.title}</p>
            <p className="text-[9px] text-slate-600 font-mono">{xp} XP</p>
          </div>
        </button>

        {/* System status */}
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
      </div>
    </aside>
  );
}
