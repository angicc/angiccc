import { useState, useMemo } from 'react';
import { useAuditStore } from '../../store/auditState';
import PremiumCard from '../ui/PremiumCard';
import { TrendingUp, Mail, Settings2 } from 'lucide-react';

type ScheduleConfig = {
  startVolume: number;
  dailyIncrement: number;
  maxVolume: number;
};

function generateRampData(cfg: ScheduleConfig): number[] {
  const days = 14;
  const reputation: number[] = [];
  let vol = cfg.startVolume;
  let rep = 8 + Math.random() * 5;

  for (let d = 0; d < days; d++) {
    const safeRatio = Math.min(vol / Math.max(cfg.maxVolume, 1), 1);
    const dailyGain = safeRatio < 0.7 ? 6 + safeRatio * 4 : safeRatio < 0.9 ? 4 : 2;
    rep = Math.min(95, rep + dailyGain + (Math.random() - 0.3) * 2);
    reputation.push(Math.round(rep));
    vol = Math.min(vol + cfg.dailyIncrement, cfg.maxVolume);
  }
  return reputation;
}

function generateVolumes(cfg: ScheduleConfig): number[] {
  const volumes: number[] = [];
  let vol = cfg.startVolume;
  for (let d = 0; d < 14; d++) {
    volumes.push(Math.round(vol));
    vol = Math.min(vol + cfg.dailyIncrement, cfg.maxVolume);
  }
  return volumes;
}

function LineChart({ data, width = 500, height = 160 }: { data: number[]; width?: number; height?: number }) {
  const pad = { top: 12, right: 16, bottom: 28, left: 36 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const min = 0;
  const max = 100;

  const xScale = (i: number) => pad.left + (i / (data.length - 1)) * innerW;
  const yScale = (v: number) => pad.top + innerH - ((v - min) / (max - min)) * innerH;

  const pathD = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ');
  const areaD = `${pathD} L ${xScale(data.length - 1)} ${pad.top + innerH} L ${xScale(0)} ${pad.top + innerH} Z`;

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      {/* Grid lines */}
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={pad.left} y1={yScale(tick)}
            x2={pad.left + innerW} y2={yScale(tick)}
            stroke="rgba(255,255,255,0.04)" strokeWidth={1}
          />
          <text x={pad.left - 5} y={yScale(tick) + 4} textAnchor="end" fill="#475569" fontSize={9}>
            {tick}
          </text>
        </g>
      ))}

      {/* X axis labels */}
      {data.map((_, i) => (i === 0 || i === 6 || i === 13) && (
        <text key={i} x={xScale(i)} y={pad.top + innerH + 16} textAnchor="middle" fill="#475569" fontSize={9}>
          Day {i + 1}
        </text>
      ))}

      {/* Area fill */}
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#areaGrad)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="#10b981" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {/* Data points */}
      {data.map((v, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(v)} r={3} fill="#10b981" opacity={0.8} />
      ))}
    </svg>
  );
}

export default function WarmupSimulator() {
  const { dnsTelemetry } = useAuditStore();
  const inboxes = dnsTelemetry.inboxes;

  const [selectedId, setSelectedId] = useState(inboxes[0]?.id ?? '');
  const [cfg, setCfg] = useState<ScheduleConfig>({ startVolume: 10, dailyIncrement: 5, maxVolume: 50 });

  const selectedInbox = inboxes.find((i) => i.id === selectedId) ?? inboxes[0];
  const reputationData = useMemo(() => generateRampData(cfg), [cfg]);
  const volumeData = useMemo(() => generateVolumes(cfg), [cfg]);

  const repColor = (v: number) => v >= 75 ? 'text-emerald-400' : v >= 50 ? 'text-amber-400' : 'text-red-400';

  function update<K extends keyof ScheduleConfig>(key: K, raw: string) {
    const val = parseInt(raw);
    if (isNaN(val)) return;
    setCfg((c) => ({ ...c, [key]: Math.max(1, val) }));
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Inbox Warmup Simulator</h2>
        <p className="text-sm text-slate-500 mt-1">Simulate a 14-day sender reputation ramp. Adjust your warmup schedule to project domain health before you deploy.</p>
      </div>

      {/* Inbox selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {inboxes.map((inbox) => {
          const repScore = inbox.warmupScore;
          const col = repScore >= 75 ? 'border-emerald-500/30 text-emerald-300' : repScore >= 50 ? 'border-amber-500/30 text-amber-300' : 'border-red-500/30 text-red-300';
          const isActive = selectedId === inbox.id;
          return (
            <button
              key={inbox.id}
              onClick={() => setSelectedId(inbox.id)}
              className={`p-3 rounded-xl border text-left transition-all ${isActive ? `bg-slate-800/60 ${col} ring-1 ring-white/10` : 'bg-slate-900/40 border-white/[0.06] hover:border-white/10'}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Mail className={`w-3.5 h-3.5 ${isActive ? '' : 'text-slate-600'}`} />
                <span className={`text-[9px] font-bold uppercase tracking-wide ${isActive ? '' : 'text-slate-600'}`}>{inbox.reputation}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">{inbox.email}</p>
              <p className={`text-sm font-black mt-1 ${repScore >= 75 ? 'text-emerald-400' : repScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {repScore}%
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2">
          <PremiumCard glow="none">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                Projected Sender Reputation — 14 Days
              </span>
              <span className={`ml-auto text-sm font-black tabular-nums ${repColor(reputationData[reputationData.length - 1] ?? 0)}`}>
                Day 14: {reputationData[reputationData.length - 1]}%
              </span>
            </div>
            <LineChart data={reputationData} />
            <p className="text-[10px] text-slate-700 mt-2">
              Based on: start={cfg.startVolume} emails/day → +{cfg.dailyIncrement}/day → max={cfg.maxVolume}/day
            </p>
          </PremiumCard>
        </div>

        {/* Config */}
        <div className="space-y-4">
          <PremiumCard glow="none">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Schedule Config</span>
            </div>
            <div className="space-y-3">
              {([
                { key: 'startVolume', label: 'Starting Volume', help: 'emails/day on Day 1' },
                { key: 'dailyIncrement', label: 'Daily Increment', help: 'add per day' },
                { key: 'maxVolume', label: 'Max Volume', help: 'cap per day' },
              ] as const).map(({ key, label, help }) => (
                <div key={key}>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-semibold">{label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={cfg[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-20 bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
                    />
                    <span className="text-[10px] text-slate-600">{help}</span>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          {/* Current inbox stats */}
          {selectedInbox && (
            <PremiumCard glow="none">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3 font-semibold">Current Inbox Stats</p>
              {[
                { label: 'Warmup Score', value: `${selectedInbox.warmupScore}%`, color: repColor(selectedInbox.warmupScore) },
                { label: 'Daily Sent', value: `${selectedInbox.dailySent} / ${selectedInbox.dailyLimit}` },
                { label: 'Days Active', value: `${selectedInbox.daysActive} days` },
                { label: 'Reputation', value: selectedInbox.reputation, color: selectedInbox.reputation === 'good' ? 'text-emerald-400' : selectedInbox.reputation === 'warning' ? 'text-amber-400' : 'text-red-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className={`text-xs font-semibold ${color ?? 'text-slate-300'}`}>{value}</span>
                </div>
              ))}
            </PremiumCard>
          )}
        </div>
      </div>

      {/* 14-day breakdown table */}
      <PremiumCard glow="none" noPad>
        <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-500" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">14-Day Breakdown</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {['Day', 'Emails Sent', 'Reputation Score', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-600 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reputationData.map((rep, i) => {
                const status = rep >= 75 ? { label: 'Healthy', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
                  : rep >= 50 ? { label: 'Building', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
                  : { label: 'Warming Up', color: 'text-slate-400 bg-slate-700/30 border-slate-600/20' };
                return (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400 tabular-nums">Day {i + 1}</td>
                    <td className="px-4 py-3 text-xs text-slate-300 tabular-nums font-mono">{volumeData[i]}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${rep >= 75 ? 'bg-emerald-400' : rep >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                            style={{ width: `${rep}%` }}
                          />
                        </div>
                        <span className={`text-xs tabular-nums font-bold ${repColor(rep)}`}>{rep}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PremiumCard>
    </div>
  );
}
