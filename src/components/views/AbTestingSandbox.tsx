import { useState } from 'react';
import { GitBranch, Plus, Play, Pause, CheckCircle2, BarChart3, Zap } from 'lucide-react';
import { useAuditStore, type AbTest, type AbVariant } from '../../store/auditState';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';

const STATUS_CONFIG: Record<AbTest['status'], { label: string; classes: string; dot: string }> = {
  active: { label: 'ACTIVE', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400 animate-pulse' },
  draft: { label: 'DRAFT', classes: 'bg-slate-700/50 text-slate-400 border-slate-600/20', dot: 'bg-slate-500' },
  paused: { label: 'PAUSED', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
  complete: { label: 'COMPLETE', classes: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', dot: 'bg-indigo-400' },
};

function DeliverabilityBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 65 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = score >= 80 ? 'text-emerald-400' : score >= 65 ? 'text-amber-400' : 'text-red-400';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-widest text-slate-600 font-medium">Deliverability</span>
        <span className={`text-xs font-bold tabular-nums ${textColor}`}>{score}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function TrafficSlider({ test, onUpdate }: { test: AbTest; onUpdate: (testId: string, variantId: string, val: number) => void }) {
  const varA = test.variants[0];
  const varB = test.variants[1];
  if (!varA || !varB) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-500 font-medium">
        <span>{varA.label}</span>
        <span>Traffic Split</span>
        <span>{varB.label}</span>
      </div>
      <div className="relative flex items-center gap-3">
        <span className="text-sm font-bold tabular-nums text-emerald-400 w-8 text-right">{varA.trafficPercent}%</span>
        <div className="flex-1 relative">
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-200" style={{ width: `${varA.trafficPercent}%` }} />
          </div>
          <input
            type="range"
            min={10}
            max={90}
            step={5}
            value={varA.trafficPercent}
            onChange={(e) => onUpdate(test.id, varA.id, Number(e.target.value))}
            disabled={test.status === 'complete'}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          />
        </div>
        <span className="text-sm font-bold tabular-nums text-indigo-400 w-8">{varB.trafficPercent}%</span>
      </div>
    </div>
  );
}

function VariantCard({ variant }: { variant: AbVariant }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="flex-1 min-w-0 p-4 rounded-xl bg-slate-900/60 border border-white/[0.07]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-300">{variant.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-indigo-400 tabular-nums font-mono">{variant.openRateEstimate}% est. open</span>
        </div>
      </div>
      <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1 font-medium">Subject</p>
      <p className="text-xs text-slate-300 font-mono mb-3 truncate">{variant.subject}</p>
      <DeliverabilityBar score={variant.deliverabilityScore} />
      <button
        onClick={() => setExpanded((e) => !e)}
        className="mt-3 text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
      >
        {expanded ? '▲ Hide body' : '▼ Preview body'}
      </button>
      {expanded && (
        <pre className="mt-2 text-xs font-mono text-slate-400 whitespace-pre-wrap leading-relaxed bg-slate-950/50 rounded-lg p-3 border border-white/[0.05] max-h-32 overflow-y-auto">
          {variant.body}
        </pre>
      )}
    </div>
  );
}

function AbTestCard({ test }: { test: AbTest }) {
  const { updateAbTestStatus, updateVariantTraffic } = useAuditStore();
  const statusCfg = STATUS_CONFIG[test.status];

  return (
    <PremiumCard glow={test.status === 'active' ? 'emerald' : 'none'} noPad>
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-3 flex-wrap">
        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
          <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-200">{test.name}</p>
          <p className="text-[10px] text-slate-600">{test.stepLabel}</p>
        </div>
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.classes}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </span>
        <div className="flex items-center gap-2">
          {test.status === 'draft' && (
            <GlowButton variant="primary" icon={<Play className="w-3.5 h-3.5" />} onClick={() => updateAbTestStatus(test.id, 'active')}>
              Deploy Test
            </GlowButton>
          )}
          {test.status === 'active' && (
            <GlowButton variant="secondary" icon={<Pause className="w-3.5 h-3.5" />} onClick={() => updateAbTestStatus(test.id, 'paused')}>
              Pause
            </GlowButton>
          )}
          {test.status === 'paused' && (
            <GlowButton variant="primary" icon={<Play className="w-3.5 h-3.5" />} onClick={() => updateAbTestStatus(test.id, 'active')}>
              Resume
            </GlowButton>
          )}
          {(test.status === 'active' || test.status === 'paused') && (
            <GlowButton variant="ghost" icon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={() => updateAbTestStatus(test.id, 'complete')}>
              Mark Complete
            </GlowButton>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Variants side by side */}
        <div className="flex gap-4">
          {test.variants.map((v) => <VariantCard key={v.id} variant={v} />)}
        </div>

        {/* Traffic split */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-white/[0.06]">
          <TrafficSlider test={test} onUpdate={updateVariantTraffic} />
        </div>

        {/* Safety comparison */}
        <div className="grid grid-cols-2 gap-4">
          {test.variants.map((v) => (
            <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-white/[0.05]">
              <span className="text-xs text-slate-500">{v.label} — Delivery Safety</span>
              <span className={`text-sm font-bold tabular-nums ${v.deliverabilityScore >= 80 ? 'text-emerald-400' : v.deliverabilityScore >= 65 ? 'text-amber-400' : 'text-red-400'}`}>
                {v.deliverabilityScore >= 80 ? '✓ Safe' : v.deliverabilityScore >= 65 ? '⚠ Marginal' : '✗ Risky'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PremiumCard>
  );
}

function NewTestModal({ onClose, onCreate }: { onClose: () => void; onCreate: (test: AbTest) => void }) {
  const [name, setName] = useState('');
  const [stepLabel, setStepLabel] = useState('');
  const [subjectA, setSubjectA] = useState('');
  const [subjectB, setSubjectB] = useState('');

  function handleCreate() {
    if (!name.trim() || !subjectA.trim() || !subjectB.trim()) return;
    const newTest: AbTest = {
      id: `ab_${Date.now()}`,
      name: name.trim(),
      stepLabel: stepLabel.trim() || 'Custom Step',
      status: 'draft',
      createdAt: new Date().toISOString(),
      variants: [
        { id: `v_a_${Date.now()}`, label: 'Variant A', subject: subjectA.trim(), body: '', trafficPercent: 50, deliverabilityScore: 80, openRateEstimate: 25 },
        { id: `v_b_${Date.now()}`, label: 'Variant B', subject: subjectB.trim(), body: '', trafficPercent: 50, deliverabilityScore: 75, openRateEstimate: 28 },
      ],
    };
    onCreate(newTest);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-white/[0.1] rounded-2xl p-6 shadow-2xl">
        <h3 className="text-base font-bold text-white mb-5">Create New A/B Test</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Test Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Cold Subject Line Variant" className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Sequence Step</label>
            <input value={stepLabel} onChange={(e) => setStepLabel(e.target.value)} placeholder="e.g., Step 1 – Cold Email" className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Subject — Variant A</label>
              <input value={subjectA} onChange={(e) => setSubjectA(e.target.value)} placeholder="Variant A subject..." className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Subject — Variant B</label>
              <input value={subjectB} onChange={(e) => setSubjectB(e.target.value)} placeholder="Variant B subject..." className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <GlowButton variant="ghost" onClick={onClose} className="flex-1 justify-center">Cancel</GlowButton>
          <GlowButton variant="primary" icon={<Zap className="w-4 h-4" />} onClick={handleCreate} className="flex-1 justify-center">Create Test</GlowButton>
        </div>
      </div>
    </div>
  );
}

export default function AbTestingSandbox() {
  const { abTests, addAbTest } = useAuditStore();
  const [showModal, setShowModal] = useState(false);

  const activeCount = abTests.filter((t) => t.status === 'active').length;
  const totalVariants = abTests.reduce((acc, t) => acc + t.variants.length, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Dynamic A/B Split Matrix</h2>
          <p className="text-sm text-slate-500 mt-1">Run multiple sequence variations simultaneously. Control traffic splits and compare delivery safety limits before deployment.</p>
        </div>
        <GlowButton variant="secondary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          New Test
        </GlowButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: GitBranch, label: 'Active Tests', value: activeCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { icon: BarChart3, label: 'Total Variants', value: totalVariants, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { icon: CheckCircle2, label: 'Tests Complete', value: abTests.filter((t) => t.status === 'complete').length, color: 'text-slate-400', bg: 'bg-slate-700/30 border-slate-600/20' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <PremiumCard key={label} glow="none">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-3xl font-black tabular-nums ${color}`}>{value}</p>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mt-1">{label}</p>
          </PremiumCard>
        ))}
      </div>

      {/* Test cards */}
      <div className="space-y-5">
        {abTests.map((test) => <AbTestCard key={test.id} test={test} />)}
        {abTests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <GitBranch className="w-10 h-10 text-slate-700" />
            <p className="text-slate-500 text-sm">No A/B tests configured yet</p>
            <GlowButton variant="secondary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>Create First Test</GlowButton>
          </div>
        )}
      </div>

      {showModal && <NewTestModal onClose={() => setShowModal(false)} onCreate={addAbTest} />}
    </div>
  );
}
