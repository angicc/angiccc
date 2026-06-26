import { Trophy, TrendingUp, TrendingDown, Minus, Shield, ShieldAlert, ShieldCheck, Globe, BarChart3 } from 'lucide-react';
import { useAuditStore, type SubAccount } from '../../store/auditState';
import PremiumCard from '../ui/PremiumCard';

const HEALTH_CONFIG: Record<SubAccount['domainHealth'], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  excellent: { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  good: { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: <Shield className="w-3.5 h-3.5" /> },
  warning: { label: 'Warning', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
};

const TREND_CONFIG = {
  improving: { icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />, color: 'text-emerald-400' },
  stable: { icon: <Minus className="w-3.5 h-3.5 text-slate-400" />, color: 'text-slate-400' },
  declining: { icon: <TrendingDown className="w-3.5 h-3.5 text-red-400" />, color: 'text-red-400' },
};

const RANK_COLORS = ['text-amber-400', 'text-slate-400', 'text-orange-600', 'text-slate-500', 'text-slate-600'];

function MetricBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
      </div>
      <span className="text-xs tabular-nums text-slate-400 w-8 text-right">{value}%</span>
    </div>
  );
}

export default function AgencyLeaderboard() {
  const { agencyAccounts } = useAuditStore();

  const sorted = [...agencyAccounts].sort((a, b) => b.bookedMeetings - a.bookedMeetings);
  const topPerformer = sorted[0];
  const totalMeetings = agencyAccounts.reduce((acc, a) => acc + a.bookedMeetings, 0);
  const avgOpenRate = Math.round(agencyAccounts.reduce((acc, a) => acc + a.openRate, 0) / agencyAccounts.length);
  const totalRevenue = agencyAccounts.reduce((acc, a) => acc + a.monthlyRevenue, 0);
  const healthyDomains = agencyAccounts.filter((a) => a.domainHealth === 'excellent' || a.domainHealth === 'good').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Client Agency Leaderboard</h2>
        <p className="text-sm text-slate-500 mt-1">Aggregate campaign performance across all sub-accounts. Ranked by booked meetings and domain health trends.</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Trophy, label: 'Top Performer', value: topPerformer?.clientName ?? '—', sub: `${topPerformer?.bookedMeetings ?? 0} meetings`, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { icon: BarChart3, label: 'Total Meetings', value: totalMeetings, sub: 'across all clients', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { icon: Globe, label: 'Avg Open Rate', value: `${avgOpenRate}%`, sub: 'platform average', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { icon: ShieldCheck, label: 'Healthy Domains', value: `${healthyDomains}/${agencyAccounts.length}`, sub: 'good or excellent', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <PremiumCard key={label} glow="none">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-xl font-black ${color} leading-tight`}>{value}</p>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mt-1">{label}</p>
            <p className="text-[10px] text-slate-700 mt-0.5">{sub}</p>
          </PremiumCard>
        ))}
      </div>

      {/* Leaderboard table */}
      <PremiumCard glow="none" noPad>
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Client Performance Rankings</span>
          <span className="ml-auto text-xs text-slate-600">{agencyAccounts.length} active accounts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {['Rank', 'Client', 'Industry', 'Top Sequence', 'Meetings', 'Open Rate', 'Reply Rate', 'Domain Health', 'Trend', 'MRR'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-600 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((account, idx) => {
                const healthCfg = HEALTH_CONFIG[account.domainHealth];
                const trendCfg = TREND_CONFIG[account.healthTrend];
                const rankColor = RANK_COLORS[idx] ?? 'text-slate-600';
                return (
                  <tr key={account.id} className="border-b border-white/[0.03] hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-4">
                      <span className={`text-base font-black tabular-nums ${rankColor}`}>#{idx + 1}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-200">{account.clientName}</p>
                      <p className="text-[10px] text-slate-600">{account.activeDomains} domains</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-slate-400">{account.industry}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-slate-300 max-w-[150px] block truncate">{account.topSequence}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-lg font-black text-emerald-400 tabular-nums">{account.bookedMeetings}</span>
                    </td>
                    <td className="px-4 py-4 w-32">
                      <MetricBar value={account.openRate} max={100} color="bg-indigo-500" />
                    </td>
                    <td className="px-4 py-4 w-32">
                      <MetricBar value={account.replyRate} max={100} color="bg-emerald-500" />
                    </td>
                    <td className="px-4 py-4">
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit ${healthCfg.bg} ${healthCfg.color}`}>
                        {healthCfg.icon}{healthCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`flex items-center gap-1 text-xs ${trendCfg.color}`}>
                        {trendCfg.icon}
                        <span className="capitalize text-[10px]">{account.healthTrend}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-slate-300 tabular-nums">${account.monthlyRevenue.toLocaleString()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
          <span className="text-xs text-slate-600">Total MRR across all accounts</span>
          <span className="text-sm font-black text-emerald-400">${totalRevenue.toLocaleString()}/mo</span>
        </div>
      </PremiumCard>

      {/* Domain health distribution */}
      <PremiumCard glow="none">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-slate-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Domain Health Distribution</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['excellent', 'good', 'warning', 'critical'] as SubAccount['domainHealth'][]).map((health) => {
            const count = agencyAccounts.filter((a) => a.domainHealth === health).length;
            const pct = Math.round((count / agencyAccounts.length) * 100);
            const cfg = HEALTH_CONFIG[health];
            return (
              <div key={health} className={`p-4 rounded-xl border ${cfg.bg}`}>
                <div className={`flex items-center gap-1.5 mb-2 ${cfg.color}`}>
                  {cfg.icon}
                  <span className="text-xs font-bold capitalize">{cfg.label}</span>
                </div>
                <p className={`text-3xl font-black ${cfg.color} tabular-nums`}>{count}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{pct}% of accounts</p>
              </div>
            );
          })}
        </div>
      </PremiumCard>
    </div>
  );
}
