import { MessageSquare, Zap, CheckCircle2, AlertTriangle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { useAuditStore, type ReplyScenario } from '../../store/auditState';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';
import MetricRing from '../ui/MetricRing';

const SCENARIO_CONFIG: Record<ReplyScenario, { label: string; icon: React.ReactNode; color: string; bg: string; description: string }> = {
  positive: {
    label: 'Positive Intent',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    description: 'Prospect is interested and ready to book',
  },
  objection: {
    label: 'Objection',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    description: 'Has a competing solution or contract blocker',
  },
  not_interested: {
    label: 'Not Interested',
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
    description: 'Hard opt-out or explicit rejection',
  },
  out_of_office: {
    label: 'Out of Office',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
    description: 'Auto-reply with return date',
  },
};

const OUTCOME_CONFIG = {
  converts: { label: 'Converts to Meeting', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
  dead_end: { label: 'Dead-End Detected', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: <XCircle className="w-4 h-4 text-red-400" /> },
  needs_followup: { label: 'Needs Follow-up Logic', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
};

export default function ReplyIntentSimulator() {
  const { replySimulator, setReplyScenario, runReplySimulation } = useAuditStore();
  const { activeScenario, simulation, phase } = replySimulator;

  const activeScenarioCfg = SCENARIO_CONFIG[activeScenario];
  const outcomeCfg = simulation ? OUTCOME_CONFIG[simulation.outcome] : null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">AI Sentiment Simulator</h2>
        <p className="text-sm text-slate-500 mt-1">Simulate inbound prospect replies and evaluate whether your conditional follow-up logic converts the lead or hits a dead-end.</p>
      </div>

      {/* Scenario selector */}
      <PremiumCard glow="none">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Select Reply Scenario</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(SCENARIO_CONFIG) as ReplyScenario[]).map((scenario) => {
            const cfg = SCENARIO_CONFIG[scenario];
            const isActive = activeScenario === scenario;
            return (
              <button
                key={scenario}
                onClick={() => setReplyScenario(scenario)}
                className={`p-4 rounded-xl border text-left transition-all duration-150 hover:-translate-y-[1px] ${isActive ? `${cfg.bg} ring-1 ring-white/10` : 'bg-slate-900/40 border-white/[0.06] hover:border-white/10'}`}
              >
                <div className={`${cfg.color} mb-3`}>{cfg.icon}</div>
                <p className={`text-sm font-bold ${isActive ? cfg.color : 'text-slate-300'}`}>{cfg.label}</p>
                <p className="text-[10px] text-slate-600 mt-1 leading-tight">{cfg.description}</p>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <GlowButton
            variant="primary"
            icon={<Zap className="w-4 h-4" />}
            loading={phase === 'simulating'}
            onClick={runReplySimulation}
          >
            {phase === 'simulating' ? 'Simulating...' : 'Run Simulation'}
          </GlowButton>
        </div>
      </PremiumCard>

      {/* Results */}
      {phase === 'complete' && simulation && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Left: Prospect message + outcome */}
          <div className="lg:col-span-3 space-y-4">
            {/* Simulated reply */}
            <PremiumCard glow="none" noPad>
              <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeScenarioCfg.bg} border`}>
                  <span className={`text-xs ${activeScenarioCfg.color}`}>{activeScenarioCfg.icon}</span>
                </div>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Simulated Prospect Reply</span>
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeScenarioCfg.bg} ${activeScenarioCfg.color}`}>
                  {activeScenarioCfg.label}
                </span>
              </div>
              <div className="p-5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-400">P</div>
                  <div className="flex-1 p-4 rounded-xl bg-slate-800/40 border border-white/[0.07] text-sm text-slate-300 leading-relaxed">
                    {simulation.prospectMessage}
                  </div>
                </div>
              </div>
            </PremiumCard>

            {/* Outcome indicator */}
            {outcomeCfg && (
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${outcomeCfg.bg}`}>
                {outcomeCfg.icon}
                <div>
                  <p className={`text-sm font-bold ${outcomeCfg.color}`}>Sequence Outcome: {outcomeCfg.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Based on your current conditional branch configuration</p>
                </div>
              </div>
            )}

            {/* AI evaluation */}
            <PremiumCard glow="none">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">AI Follow-up Logic Evaluation</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{simulation.followupEvaluation}</p>
            </PremiumCard>
          </div>

          {/* Right: Score + suggested response */}
          <div className="lg:col-span-2 space-y-4">
            <PremiumCard glow={simulation.conversionScore >= 75 ? 'emerald' : simulation.conversionScore >= 40 ? 'amber' : 'none'} className="flex flex-col items-center py-6">
              <MetricRing label="Conversion Score" value={simulation.conversionScore} size={120} />
              <div className="mt-4 text-center">
                <p className={`text-sm font-bold ${simulation.conversionScore >= 75 ? 'text-emerald-400' : simulation.conversionScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                  {simulation.conversionScore >= 75 ? 'High Conversion Probability' : simulation.conversionScore >= 40 ? 'Moderate — Needs Optimization' : 'Low — Sequence Dead-End'}
                </p>
              </div>
            </PremiumCard>

            {/* Suggested response */}
            <PremiumCard glow="none" noPad>
              <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400" />
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Suggested Response</span>
              </div>
              <div className="p-4">
                <pre className="text-xs font-mono text-emerald-200 whitespace-pre-wrap leading-relaxed">
                  {simulation.suggestedResponse}
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(simulation.suggestedResponse)}
                  className="mt-3 text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
                >
                  Copy to clipboard
                </button>
              </div>
            </PremiumCard>
          </div>
        </div>
      )}

      {phase === 'idle' && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/[0.07] flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-slate-700" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Select a scenario above and run the simulation</p>
          <p className="text-slate-700 text-xs max-w-sm">The AI will simulate a realistic prospect reply and evaluate whether your sequence logic handles it correctly.</p>
        </div>
      )}
    </div>
  );
}
