import { useState } from 'react';
import { Mail, GitBranch, Globe, Users, Lightbulb, ChevronDown, ChevronUp, Play, Lock, AlertCircle, Bot, Sparkles } from 'lucide-react';
import { useAuditStore, type SequenceStep } from '../../store/auditState';
import { buildSequenceGraph } from '../../utils/systemDataParser';
import { runSequenceAudit } from '../../services/aiAgentService';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';

type Props = { onAuditComplete: () => void };

const STEP_COLORS: Record<SequenceStep['type'], string> = {
  cold: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5',
  followup_opened: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
  followup_unopened: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
  breakup: 'text-red-400 border-red-500/30 bg-red-500/5',
};

const STEP_ICONS: Record<SequenceStep['type'], React.ReactNode> = {
  cold: <Mail className="w-3.5 h-3.5" />,
  followup_opened: <GitBranch className="w-3.5 h-3.5" />,
  followup_unopened: <GitBranch className="w-3.5 h-3.5" />,
  breakup: <AlertCircle className="w-3.5 h-3.5" />,
};

function SequenceNode({ step, index, locked, onChange }: {
  step: SequenceStep; index: number; locked: boolean;
  onChange: (id: string, field: 'subject' | 'body', value: string) => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const colorClass = STEP_COLORS[step.type];
  const hasContent = step.subject.trim() || step.body.trim();

  return (
    <div className="relative">
      {index > 0 && (
        <div className="absolute -top-5 left-[22px] w-px h-5 bg-gradient-to-b from-transparent via-slate-700 to-slate-700" />
      )}
      <PremiumCard glow="none" noPad>
        <button
          className="w-full flex items-center gap-3 p-4 text-left"
          onClick={() => !locked && setExpanded((e) => !e)}
        >
          <div className={`flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center ${colorClass}`}>
            {STEP_ICONS[step.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Node {index + 1}</p>
            <p className="text-sm font-semibold text-slate-200 truncate">{step.label}</p>
          </div>
          <div className="flex items-center gap-2">
            {hasContent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            {locked ? <Lock className="w-3.5 h-3.5 text-slate-600" /> : expanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
          </div>
        </button>
        {expanded && !locked && (
          <div className="px-4 pb-4 space-y-3 border-t border-white/[0.05] pt-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Subject Line</label>
              <input
                type="text"
                value={step.subject}
                onChange={(e) => onChange(step.id, 'subject', e.target.value)}
                placeholder={`e.g., "Quick question about {{companyName}}"`}
                className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Email Body</label>
              <textarea
                value={step.body}
                onChange={(e) => onChange(step.id, 'body', e.target.value)}
                rows={6}
                placeholder="Paste your full email body here. Include your hook, value prop, and CTA..."
                className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all resize-none font-mono leading-relaxed"
              />
            </div>
          </div>
        )}
        {locked && (
          <div className="px-4 pb-4 text-xs text-slate-600 font-mono flex items-center gap-2">
            <Lock className="w-3 h-3" /> Sequence locked — reset to edit
          </div>
        )}
      </PremiumCard>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-slate-800/40 rounded-xl border border-white/[0.05]" />
      ))}
    </div>
  );
}

export default function InputDashboard({ onAuditComplete }: Props) {
  const {
    icp, companyUrl, valueProposition,
    steps, phase, errorMessage,
    setContext, setSteps, setPhase, setAuditResult, setError,
  } = useAuditStore();

  const [localIcp, setLocalIcp] = useState(icp);
  const [localUrl, setLocalUrl] = useState(companyUrl);
  const [localVp, setLocalVp] = useState(valueProposition);

  // AI Co-Pilot state
  const [autoBuildPrompt, setAutoBuildPrompt] = useState('');
  const [autoBuildPhase, setAutoBuildPhase] = useState<'idle' | 'loading'>('idle');

  const locked = phase === 'loading' || phase === 'complete';

  function updateStep(id: string, field: 'subject' | 'body', value: string) {
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  async function handleAutoBuild() {
    setAutoBuildPhase('loading');
    await new Promise((res) => setTimeout(res, 2000));

    const autoIcp = 'B2B SaaS Founders & VP of Sales (US, 10–200 employees)';
    const autoUrl = 'https://outreachaudit.ai';
    const autoVp = 'We cut cold email ramp time by 60% using AI-driven sequence diagnostics and automated personalization.';

    const quarter = Math.ceil((new Date().getMonth() + 1) / 3);

    const autoSteps: SequenceStep[] = [
      {
        id: 'step_1',
        label: 'Step 1 – Cold Email',
        type: 'cold',
        subject: "Quick question about {{companyName}}'s outbound",
        body: `Hi {{firstName}},\n\nI noticed {{companyName}} recently expanded the sales team — a common sign that pipeline quality becomes the constraint before headcount does.\n\nWe help SaaS founders and VP Sales cut cold email ramp time by 60% using AI-driven sequence diagnostics.\n\nWorth a 15-min diagnostic call this week?\n\n— {{senderName}}`,
      },
      {
        id: 'step_2a',
        label: 'Step 2A – Follow-up (Opened)',
        type: 'followup_opened',
        subject: "Re: {{companyName}}'s outbound",
        body: `Hi {{firstName}},\n\nFollowing up — saw you opened my last note.\n\nI can show you a 10-minute live diagnostic of your current sequence — no prep needed on your end.\n\nOpen to it?\n\n— {{senderName}}`,
      },
      {
        id: 'step_2b',
        label: 'Step 2B – Follow-up (Unopened)',
        type: 'followup_unopened',
        subject: 'Still relevant for {{companyName}}?',
        body: `Hi {{firstName}},\n\nI don't want to clog your inbox — but before I close this out: is improving outbound conversion on the radar for Q${quarter}?\n\nIf not now, happy to reconnect later. No pressure.\n\n— {{senderName}}`,
      },
      {
        id: 'step_3',
        label: 'Step 3 – Breakup',
        type: 'breakup',
        subject: 'Closing the loop',
        body: `Hi {{firstName}},\n\nI'll take your silence as a no for now — no hard feelings.\n\nIf priorities shift around outbound quality or pipeline velocity, you know where to find me.\n\nBest,\n{{senderName}}`,
      },
    ];

    setLocalIcp(autoIcp);
    setLocalUrl(autoUrl);
    setLocalVp(autoVp);
    setContext(autoIcp, autoUrl, autoVp);
    setSteps(autoSteps);
    setAutoBuildPhase('idle');
  }

  async function handleInitialize() {
    if (!localIcp.trim() || !localVp.trim()) {
      setError('Target ICP and Value Proposition are required.');
      return;
    }
    const hasContent = steps.some((s) => s.subject.trim() || s.body.trim());
    if (!hasContent) {
      setError('Add content to at least one sequence step before running diagnostics.');
      return;
    }

    setContext(localIcp.trim(), localUrl.trim(), localVp.trim());
    setPhase('loading');

    try {
      const graph = buildSequenceGraph(localIcp.trim(), localUrl.trim(), localVp.trim(), steps);
      const result = await runSequenceAudit(graph);
      setAuditResult(result);
      onAuditComplete();
    } catch (err) {
      setError((err as Error).message ?? 'Unknown error during audit.');
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Sequence Configuration</h2>
        <p className="text-sm text-slate-500 mt-1">Define your target ICP context and paste your outreach sequence nodes below.</p>
      </div>

      {/* ── AI Co-Pilot ── */}
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 blur-xl pointer-events-none" />
        <PremiumCard glow="indigo" className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">AI Co-Pilot</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">BETA</span>
            <span className="ml-auto text-xs text-slate-600">Let AI configure the entire sequence for you</span>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={autoBuildPrompt}
                onChange={(e) => setAutoBuildPrompt(e.target.value)}
                disabled={autoBuildPhase === 'loading' || locked}
                placeholder="Describe your offer and target audience, and let AI build the complex sequence..."
                className="w-full bg-slate-800/60 border border-indigo-500/25 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 transition-all disabled:opacity-50 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]"
              />
              {autoBuildPhase === 'loading' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                </div>
              )}
            </div>
            <GlowButton
              variant="secondary"
              icon={<Bot className="w-4 h-4" />}
              loading={autoBuildPhase === 'loading'}
              onClick={handleAutoBuild}
              disabled={locked}
            >
              Auto-Build Sequence
            </GlowButton>
          </div>
          {autoBuildPhase === 'loading' && (
            <p className="text-xs text-indigo-400 mt-2 font-mono animate-pulse">
              Analyzing offer parameters → Building conditional sequence nodes → Populating context engine...
            </p>
          )}
        </PremiumCard>
      </div>

      {/* ── Context Engine ── */}
      <PremiumCard glow="indigo">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Context Engine</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">
              <Users className="w-3 h-3" /> Target ICP
            </label>
            <input
              type="text"
              value={localIcp}
              onChange={(e) => setLocalIcp(e.target.value)}
              disabled={locked}
              placeholder="e.g., SaaS Founders in the US"
              className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">
              <Globe className="w-3 h-3" /> Company URL
            </label>
            <input
              type="text"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              disabled={locked}
              placeholder="https://yourcompany.com"
              className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">
              <Lightbulb className="w-3 h-3" /> Value Proposition
            </label>
            <input
              type="text"
              value={localVp}
              onChange={(e) => setLocalVp(e.target.value)}
              disabled={locked}
              placeholder="e.g., We cut SDR ramp time by 50%"
              className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </PremiumCard>

      {/* ── Sequence Builder ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded bg-slate-800 border border-white/[0.08] flex items-center justify-center">
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Node-Based Sequence Builder</span>
          <span className="ml-auto text-xs text-slate-600">{steps.length} nodes configured</span>
        </div>

        {phase === 'loading' ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-5">
            {steps.map((step, idx) => (
              <SequenceNode key={step.id} step={step} index={idx} locked={locked} onChange={updateStep} />
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {phase === 'error' && errorMessage && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* CTA */}
      {!locked && (
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
          <p className="text-xs text-slate-600">{steps.filter((s) => s.subject || s.body).length}/{steps.length} nodes populated</p>
          <GlowButton variant="primary" icon={<Play className="w-4 h-4" />} onClick={handleInitialize}>
            Initialize System Audit
          </GlowButton>
        </div>
      )}

      {phase === 'complete' && (
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
          <p className="text-xs text-emerald-500 font-mono">✓ Audit complete — navigate to AI Terminal to review results</p>
          <GlowButton variant="secondary" onClick={onAuditComplete}>View Results →</GlowButton>
        </div>
      )}
    </div>
  );
}
