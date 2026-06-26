import { useState, useCallback } from 'react';
import {
  ShieldAlert, ShieldCheck, Zap, Copy, Download, CheckCircle2,
  AlertTriangle, AlertCircle, ChevronRight, BarChart3, Terminal,
} from 'lucide-react';
import { useAuditStore, type NodeDiagnostic, type GlobalAlert } from '../../store/auditState';
import { exportToWebhook } from '../../utils/systemDataParser';
import MetricRing from '../ui/MetricRing';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';

// ─── Diff Highlight Engine ──────────────────────────────────────────────────

type DiffSegment = { text: string; type: 'unchanged' | 'removed' | 'added' };

function computeLineDiff(original: string, revised: string): DiffSegment[] {
  const origLines = original.split('\n');
  const revLines = revised.split('\n');
  const segments: DiffSegment[] = [];

  const maxLen = Math.max(origLines.length, revLines.length);
  for (let i = 0; i < maxLen; i++) {
    const o = origLines[i];
    const r = revLines[i];
    if (o === undefined) {
      segments.push({ text: r, type: 'added' });
    } else if (r === undefined) {
      segments.push({ text: o, type: 'removed' });
    } else if (o !== r) {
      segments.push({ text: o, type: 'removed' });
      segments.push({ text: r, type: 'added' });
    } else {
      segments.push({ text: o, type: 'unchanged' });
    }
  }
  return segments;
}

function DiffView({ original, revised }: { original: string; revised: string }) {
  const segments = computeLineDiff(original, revised);
  return (
    <pre className="text-xs font-mono leading-6 whitespace-pre-wrap break-words text-slate-300">
      {segments.map((seg, i) => (
        <span
          key={i}
          className={
            seg.type === 'added'
              ? 'block bg-emerald-500/10 border-l-2 border-emerald-500 pl-2 text-emerald-300'
              : seg.type === 'removed'
              ? 'block bg-red-500/10 border-l-2 border-red-500 pl-2 text-red-400 line-through opacity-60'
              : 'block pl-2'
          }
        >
          {seg.type === 'added' ? '+ ' : seg.type === 'removed' ? '- ' : '  '}
          {seg.text}
        </span>
      ))}
    </pre>
  );
}

// ─── Alert severity row ─────────────────────────────────────────────────────

function AlertRow({ alert, index }: { alert: GlobalAlert; index: number }) {
  const isHigh = alert.severity === 'high';
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${
        isHigh
          ? 'bg-red-500/5 border-red-500/20 text-red-300'
          : 'bg-amber-500/5 border-amber-500/20 text-amber-300'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex-shrink-0 mt-0.5">
        {isHigh ? (
          <AlertCircle className="w-4 h-4 text-red-400" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[10px] uppercase tracking-widest font-bold mr-2 ${isHigh ? 'text-red-500' : 'text-amber-500'}`}>
          {alert.severity}
        </span>
        {alert.message}
      </div>
      <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${isHigh ? 'bg-red-400 animate-pulse' : 'bg-amber-400'}`} />
    </div>
  );
}

// ─── Node Diagnostic Card ───────────────────────────────────────────────────

function NodeDiagCard({
  diag,
  step,
  onSelect,
  selected,
}: {
  diag: NodeDiagnostic;
  step: { label: string; subject: string; body: string } | undefined;
  onSelect: () => void;
  selected: boolean;
}) {
  const color =
    diag.healthScore >= 75 ? 'text-emerald-400' :
    diag.healthScore >= 50 ? 'text-amber-400' : 'text-red-400';
  const bg =
    diag.healthScore >= 75 ? 'bg-emerald-500/5 border-emerald-500/20' :
    diag.healthScore >= 50 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-red-500/5 border-red-500/20';

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 ${
        selected ? bg + ' ring-1 ring-white/10' : 'bg-slate-900/40 border-white/[0.06] hover:border-white/10'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 truncate">{step?.label ?? diag.nodeId}</span>
        <span className={`text-sm font-bold tabular-nums ml-2 ${color}`}>{diag.healthScore}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
        {diag.alerts.slice(0, 2).map((a, i) => (
          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-white/[0.05] truncate max-w-[180px]">
            {a}
          </span>
        ))}
        {diag.alerts.length > 2 && (
          <span className="text-[10px] text-slate-600">+{diag.alerts.length - 2}</span>
        )}
      </div>
    </button>
  );
}

// ─── Empty / Not Ready state ─────────────────────────────────────────────────

function NotReadyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/[0.07] flex items-center justify-center">
        <Terminal className="w-7 h-7 text-slate-700" />
      </div>
      <p className="text-slate-500 text-sm font-medium">No audit data available</p>
      <p className="text-slate-700 text-xs max-w-xs">
        Go to the Sequence Workspace, configure your ICP and sequence nodes, then run "Initialize System Audit."
      </p>
    </div>
  );
}

// ─── Copy / Export Utilities ──────────────────────────────────────────────────

function useCopyText(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);
  return { copied, copy };
}

function exportToTxt(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Terminal View ───────────────────────────────────────────────────────

export default function AiAgentTerminal() {
  const { auditResult, phase, steps, icp, companyUrl } = useAuditStore();
  const [selectedNodeIdx, setSelectedNodeIdx] = useState(0);

  if (phase !== 'complete' || !auditResult) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <NotReadyState />
      </div>
    );
  }

  const { overallSystemHealth, nodeDiagnostics, globalAlerts, automationPayload } = auditResult;

  const selectedDiag = nodeDiagnostics[selectedNodeIdx];
  const selectedStep = steps.find((s) => s.id === selectedDiag?.nodeId);

  // Build full optimized sequence text for export
  const optimizedFullText = automationPayload.sequences
    .map((s) => `=== ${s.stepLabel} ===\nSubject: ${s.optimizedSubject}\n\n${s.optimizedBody}`)
    .join('\n\n---\n\n');

  const { copied: copiedOpt, copy: copyOpt } = useCopyText(optimizedFullText);

  // Derive metrics
  const avgOpen = Math.round(overallSystemHealth * 0.85 + 5);
  const deliverability = Math.round(overallSystemHealth * 0.9);
  const personalization = Math.round(
    nodeDiagnostics.reduce((acc, n) => acc + n.healthScore, 0) / (nodeDiagnostics.length || 1)
  );

  function handleWebhookExport() {
    const payload = exportToWebhook(auditResult!, icp, companyUrl);
    const json = JSON.stringify(payload, null, 2);
    exportToTxt(json, 'outreachaudit-webhook-payload.json');
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* ── Top: System Health + Metric HUD ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Overall health */}
        <PremiumCard glow={overallSystemHealth >= 75 ? 'emerald' : overallSystemHealth >= 50 ? 'amber' : 'none'} className="lg:col-span-1 flex flex-col items-center justify-center gap-1 py-6">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">System Health</span>
          <span
            className="text-5xl font-black tabular-nums"
            style={{
              color: overallSystemHealth >= 75 ? '#10b981' : overallSystemHealth >= 50 ? '#f59e0b' : '#ef4444',
            }}
          >
            {overallSystemHealth}
          </span>
          <span className="text-xs text-slate-500">/ 100</span>
          <div className="mt-2 flex items-center gap-1.5">
            {overallSystemHealth >= 75 ? (
              <><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /><span className="text-xs text-emerald-400 font-medium">Healthy</span></>
            ) : overallSystemHealth >= 50 ? (
              <><ShieldAlert className="w-3.5 h-3.5 text-amber-400" /><span className="text-xs text-amber-400 font-medium">Needs Review</span></>
            ) : (
              <><AlertCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-xs text-red-400 font-medium">Critical Issues</span></>
            )}
          </div>
        </PremiumCard>

        {/* Metric Rings */}
        <PremiumCard glow="none" className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Performance HUD</span>
          </div>
          <div className="flex items-center justify-around flex-wrap gap-6">
            <MetricRing label="Pred. Open Rate" value={avgOpen} />
            <MetricRing label="Deliverability" value={deliverability} />
            <MetricRing label="ICP Resonance" value={personalization} />
            <MetricRing label="Sequence Flow" value={Math.min(overallSystemHealth + 8, 100)} size={90} />
          </div>
        </PremiumCard>
      </div>

      {/* ── Global Alerts Matrix ── */}
      <PremiumCard glow="amber" noPad>
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">System Alerts Matrix</span>
          <span className="ml-auto flex items-center gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
              {globalAlerts.filter((a) => a.severity === 'high').length} HIGH
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              {globalAlerts.filter((a) => a.severity === 'medium').length} MED
            </span>
          </span>
        </div>
        <div className="p-4 space-y-2.5">
          {globalAlerts.map((alert, i) => (
            <AlertRow key={i} alert={alert} index={i} />
          ))}
        </div>
      </PremiumCard>

      {/* ── Node Selector + Split-Screen Rewrite Engine ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Node list */}
        <PremiumCard glow="none" className="xl:col-span-2" noPad>
          <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Node Diagnostics</span>
          </div>
          <div className="p-3 space-y-2">
            {nodeDiagnostics.map((diag, idx) => (
              <NodeDiagCard
                key={diag.nodeId}
                diag={diag}
                step={steps.find((s) => s.id === diag.nodeId)}
                onSelect={() => setSelectedNodeIdx(idx)}
                selected={selectedNodeIdx === idx}
              />
            ))}
          </div>
        </PremiumCard>

        {/* Split-screen rewrite engine */}
        <PremiumCard glow="none" className="xl:col-span-3" noPad>
          <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2 flex-wrap">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Rewrite Engine — {selectedStep?.label ?? selectedDiag?.nodeId}
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <span
                className={`text-[10px] px-2 py-1 rounded font-mono font-bold ${
                  (selectedDiag?.healthScore ?? 0) >= 75
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : (selectedDiag?.healthScore ?? 0) >= 50
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                HEALTH: {selectedDiag?.healthScore ?? '—'}
              </span>
            </div>
          </div>

          {/* Alerts for this node */}
          {selectedDiag?.alerts?.length > 0 && (
            <div className="px-4 pt-3 space-y-1.5">
              {selectedDiag.alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-amber-300">
                  <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-500" />
                  {alert}
                </div>
              ))}
            </div>
          )}

          {/* Split panels */}
          <div className="grid grid-cols-2 gap-0 divide-x divide-white/[0.05] mt-3">
            {/* Original */}
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Original</span>
              </div>
              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-1">
                {selectedStep ? (
                  <DiffView
                    original={`Subject: ${selectedStep.subject}\n\n${selectedStep.body}`}
                    revised={selectedDiag?.rewriteSuggestion ?? ''}
                  />
                ) : (
                  <p className="text-xs text-slate-600 font-mono italic">No content for this node.</p>
                )}
              </div>
            </div>

            {/* AI Rewrite */}
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">AI Optimized</span>
              </div>
              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-1">
                {selectedDiag?.rewriteSuggestion ? (
                  <pre className="text-xs font-mono leading-6 whitespace-pre-wrap break-words text-emerald-200">
                    {selectedDiag.rewriteSuggestion}
                  </pre>
                ) : (
                  <p className="text-xs text-slate-600 font-mono italic">No rewrite suggestion generated.</p>
                )}
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>

      {/* ── Export Node ── */}
      <PremiumCard glow="none">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded bg-slate-800 border border-white/[0.08] flex items-center justify-center">
            <Download className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Export Node</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <GlowButton
            variant="primary"
            icon={copiedOpt ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            onClick={copyOpt}
          >
            {copiedOpt ? 'Copied!' : 'Copy Optimized Sequence'}
          </GlowButton>

          <GlowButton
            variant="secondary"
            icon={<Download className="w-4 h-4" />}
            onClick={() => exportToTxt(optimizedFullText, 'outreachaudit-optimized.txt')}
          >
            Export Optimized .TXT
          </GlowButton>

          <GlowButton
            variant="secondary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleWebhookExport}
          >
            Export Webhook JSON
          </GlowButton>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-slate-900/50 border border-white/[0.05]">
          <p className="text-[10px] uppercase tracking-widest text-slate-600 font-medium mb-1">Automation Payload Status</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Webhook-ready: {automationPayload.webhookReady ? 'Yes' : 'No'}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              Platform: {automationPayload.platform}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              Nodes exported: {automationPayload.sequences.length}
            </span>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}
