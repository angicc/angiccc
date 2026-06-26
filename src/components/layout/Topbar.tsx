import { Cpu, RefreshCw } from 'lucide-react';
import { useAuditStore } from '../../store/auditState';
import GlowButton from '../ui/GlowButton';

type View = 'input' | 'terminal';

type Props = {
  activeView: View;
};

const viewTitles: Record<View, { title: string; sub: string }> = {
  input: {
    title: 'Sequence Workspace',
    sub: 'Configure ICP context and cold email nodes',
  },
  terminal: {
    title: 'AI Diagnostics Terminal',
    sub: 'Core Engine — Sub-Routine A/B/C analysis in progress',
  },
};

export default function Topbar({ activeView }: Props) {
  const { phase, reset } = useAuditStore();
  const { title, sub } = viewTitles[activeView];

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <Cpu className="w-4 h-4 text-indigo-400" />
        <div>
          <p className="text-sm font-semibold text-slate-200 leading-none">{title}</p>
          <p className="text-[11px] text-slate-500 leading-none mt-1">{sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {phase === 'complete' && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-mono px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AUDIT COMPLETE
          </span>
        )}
        {phase === 'loading' && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 font-mono px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            RUNNING DIAGNOSTICS
          </span>
        )}
        {(phase === 'complete' || phase === 'error') && (
          <GlowButton
            variant="ghost"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={reset}
          >
            <span className="hidden sm:inline">Reset</span>
          </GlowButton>
        )}
      </div>
    </header>
  );
}
