import { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, RefreshCw, Globe, CheckCircle2, XCircle, AlertTriangle, Clock, Inbox } from 'lucide-react';
import { useAuditStore, type DnsRecord, type WarmupInbox } from '../../store/auditState';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';
import MetricRing from '../ui/MetricRing';

const DNS_ICONS: Record<string, React.ReactNode> = {
  SPF: <Shield className="w-3.5 h-3.5" />,
  DKIM: <ShieldCheck className="w-3.5 h-3.5" />,
  DMARC: <ShieldAlert className="w-3.5 h-3.5" />,
  MX: <Globe className="w-3.5 h-3.5" />,
  CUSTOM_TRACKING: <Globe className="w-3.5 h-3.5" />,
};

const STATUS_CONFIG = {
  pass: { text: 'PASS', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle2 className="w-3 h-3" />, dot: 'bg-emerald-400' },
  fail: { text: 'FAIL', classes: 'bg-red-500/10 text-red-400 border-red-500/20', icon: <XCircle className="w-3 h-3" />, dot: 'bg-red-400 animate-pulse' },
  warning: { text: 'WARN', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: <AlertTriangle className="w-3 h-3" />, dot: 'bg-amber-400' },
  pending: { text: 'PENDING', classes: 'bg-slate-700/50 text-slate-400 border-slate-600/30', icon: <Clock className="w-3 h-3" />, dot: 'bg-slate-500' },
};

const REPUTATION_CONFIG = {
  good: { label: 'Good', color: 'text-emerald-400', bar: 'bg-emerald-500' },
  warning: { label: 'Warning', color: 'text-amber-400', bar: 'bg-amber-500' },
  critical: { label: 'Critical', color: 'text-red-400', bar: 'bg-red-500' },
};

function DnsRecordCard({ record }: { record: DnsRecord }) {
  const status = STATUS_CONFIG[record.status];
  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 hover:-translate-y-[1px] ${record.status === 'fail' ? 'bg-red-500/5 border-red-500/20' : record.status === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-900/50 border-white/[0.07]'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${record.status === 'fail' ? 'bg-red-500/10 border-red-500/20 text-red-400' : record.status === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
            {DNS_ICONS[record.type]}
          </div>
          <span className="text-sm font-bold text-slate-200">{record.type === 'CUSTOM_TRACKING' ? 'Custom Tracking' : record.type}</span>
        </div>
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.classes}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.text}
        </span>
      </div>
      <p className="text-xs font-mono text-slate-400 mb-2 truncate">{record.value}</p>
      <p className="text-xs text-slate-500">{record.detail}</p>
      <p className="text-[10px] text-slate-700 mt-2 font-mono">Last checked: {new Date(record.lastChecked).toLocaleTimeString()}</p>
    </div>
  );
}

function WarmupRow({ inbox }: { inbox: WarmupInbox }) {
  const rep = REPUTATION_CONFIG[inbox.reputation];
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-white/[0.08] flex items-center justify-center">
        <Inbox className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-slate-300 truncate">{inbox.email}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${rep.bar}`}
              style={{ width: `${inbox.warmupScore}%` }}
            />
          </div>
          <span className={`text-[10px] font-bold tabular-nums ${rep.color}`}>{inbox.warmupScore}%</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-slate-400 tabular-nums">{inbox.dailySent}/{inbox.dailyLimit}</p>
        <p className="text-[10px] text-slate-600">daily sends</p>
      </div>
      <div className="flex-shrink-0">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${inbox.reputation === 'good' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : inbox.reputation === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {rep.label}
        </span>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-xs text-slate-500 tabular-nums">Day {inbox.daysActive}</p>
      </div>
    </div>
  );
}

export default function DnsSpamShield() {
  const { dnsTelemetry, setDnsDomain, runDnsCheck } = useAuditStore();
  const [localDomain, setLocalDomain] = useState(dnsTelemetry.domain);

  const { records, inboxes, phase, overallScore } = dnsTelemetry;

  const passCount = records.filter((r) => r.status === 'pass').length;
  const failCount = records.filter((r) => r.status === 'fail').length;
  const warnCount = records.filter((r) => r.status === 'warning').length;

  async function handleCheck() {
    setDnsDomain(localDomain.trim());
    await runDnsCheck();
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Domain & DNS Telemetry Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor your sending domain health, DNS security records, and inbox warmup telemetry.</p>
      </div>

      {/* Domain input */}
      <PremiumCard glow="none">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Domain Diagnostic Target</span>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={localDomain}
            onChange={(e) => setLocalDomain(e.target.value)}
            placeholder="yourdomain.com"
            className="flex-1 bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all font-mono"
          />
          <GlowButton
            variant="primary"
            icon={<RefreshCw className="w-4 h-4" />}
            loading={phase === 'checking'}
            onClick={handleCheck}
          >
            {phase === 'checking' ? 'Scanning...' : 'Run DNS Scan'}
          </GlowButton>
        </div>
      </PremiumCard>

      {/* Overall score + quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <PremiumCard glow={overallScore >= 75 ? 'emerald' : overallScore >= 50 ? 'amber' : 'none'} className="flex flex-col items-center justify-center gap-1 py-6">
          <MetricRing label="Domain Health" value={overallScore} size={110} />
        </PremiumCard>
        <div className="lg:col-span-3 grid grid-cols-3 gap-4">
          {[
            { label: 'Records Passing', value: passCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', Icon: CheckCircle2 },
            { label: 'Critical Failures', value: failCount, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', Icon: XCircle },
            { label: 'Warnings', value: warnCount, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', Icon: AlertTriangle },
          ].map(({ label, value, color, bg, Icon }) => (
            <PremiumCard key={label} glow="none" className="flex flex-col items-start">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className={`text-3xl font-black tabular-nums ${color}`}>{value}</p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mt-1">{label}</p>
            </PremiumCard>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DNS Record Cards */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">DNS Security Records</span>
          </div>
          <div className="space-y-3">
            {records.map((record) => (
              <DnsRecordCard key={record.type} record={record} />
            ))}
          </div>
        </div>

        {/* Warmup Inbox Monitor */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Inbox className="w-4 h-4 text-slate-400" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Inbox Warmup Simulator</span>
          </div>
          <PremiumCard glow="none" noPad>
            <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
              <span className="text-xs text-slate-500">{inboxes.length} inboxes monitored</span>
              <div className="flex items-center gap-3 text-[10px] text-slate-600">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Good</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Warning</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Critical</span>
              </div>
            </div>
            <div className="px-4 py-2">
              {inboxes.map((inbox) => <WarmupRow key={inbox.id} inbox={inbox} />)}
            </div>
            <div className="px-4 pb-4">
              <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                <p className="text-xs text-amber-400 font-semibold mb-1">Warmup Recommendation</p>
                <p className="text-xs text-amber-300/70">
                  {inboxes.filter((i) => i.reputation === 'critical').length > 0
                    ? `${inboxes.filter((i) => i.reputation === 'critical').length} inbox(es) are exceeding safe daily limits. Immediately reduce send volume and pause warmup on critical inboxes.`
                    : 'All inboxes operating within safe parameters. Continue current warmup schedule.'}
                </p>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
