import { useAuditStore, getChessRank, ALL_CHESS_RANKS } from '../../store/auditState';
import PremiumCard from '../ui/PremiumCard';
import { Zap, Trophy, Target, BarChart3 } from 'lucide-react';

const RANK_COLORS = [
  { text: 'text-slate-400', glow: 'drop-shadow(0 0 6px rgba(148,163,184,0.5))' },
  { text: 'text-cyan-400', glow: 'drop-shadow(0 0 8px rgba(34,211,238,0.6))' },
  { text: 'text-violet-400', glow: 'drop-shadow(0 0 8px rgba(167,139,250,0.6))' },
  { text: 'text-blue-400', glow: 'drop-shadow(0 0 8px rgba(96,165,250,0.6))' },
  { text: 'text-amber-400', glow: 'drop-shadow(0 0 10px rgba(251,191,36,0.7))' },
  { text: 'text-emerald-300', glow: 'drop-shadow(0 0 14px rgba(110,231,183,0.8))' },
];

const XP_SOURCES = [
  { label: 'Sequence Audit Completed', xp: 25, icon: BarChart3, color: 'text-indigo-400' },
  { label: 'Daily Puzzle Solved', xp: 50, icon: Target, color: 'text-amber-400' },
  { label: 'Objection Roleplay (per round)', xp: 15, icon: Zap, color: 'text-emerald-400' },
  { label: 'Health Score > 80', xp: 15, icon: Trophy, color: 'text-cyan-400' },
];

export default function AiChessRank() {
  const xp = useAuditStore((s) => s.xp);
  const rank = getChessRank(xp);
  const rankColor = RANK_COLORS[rank.tier - 1];

  const isGrandmaster = rank.tier === 6;
  const progressXp = isGrandmaster ? xp - rank.min : xp - rank.min;
  const rangeXp = isGrandmaster ? xp - rank.min + 500 : rank.max - rank.min + 1;
  const progressPct = Math.min((progressXp / rangeXp) * 100, 100);

  const nextRank = ALL_CHESS_RANKS.find((r) => r.tier === rank.tier + 1);
  const xpToNext = nextRank ? nextRank.min - xp : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">AI Chess Rank</h2>
        <p className="text-sm text-slate-500 mt-1">Your outreach mastery level — earned through platform activity, audits, and daily challenges.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Main rank card */}
        <div className="lg:col-span-2">
          <PremiumCard glow={rank.tier >= 5 ? 'amber' : rank.tier >= 3 ? 'indigo' : 'none'} className="flex flex-col items-center py-8 text-center gap-4">
            {/* Giant chess symbol */}
            <div
              className={`text-8xl font-black ${rankColor.text} select-none`}
              style={{ filter: rankColor.glow, lineHeight: 1 }}
            >
              {rank.symbol}
            </div>

            <div>
              <p className={`text-xl font-black ${rankColor.text} tracking-tight`}>{rank.title}</p>
              <p className="text-sm text-slate-500 mt-1">Tier {rank.tier} of 6</p>
            </div>

            {/* XP counter */}
            <div className="w-full px-4">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-mono">
                <span>{rank.min} XP</span>
                <span className={`font-bold ${rankColor.text}`}>{xp} XP total</span>
                <span>{isGrandmaster ? '∞' : `${(nextRank?.min ?? rank.min)} XP`}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    rank.tier >= 5 ? 'bg-amber-400' : rank.tier >= 3 ? 'bg-indigo-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {!isGrandmaster && (
                <p className="text-[10px] text-slate-600 mt-1.5 text-center">
                  <span className="text-slate-400 font-semibold">{xpToNext} XP</span> to {nextRank?.title}
                </p>
              )}
              {isGrandmaster && (
                <p className="text-[10px] text-emerald-400 mt-1.5 text-center font-semibold">Maximum rank achieved</p>
              )}
            </div>
          </PremiumCard>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {/* Rank progression */}
          <PremiumCard glow="none">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Rank Progression Path</span>
            </div>
            <div className="space-y-2">
              {ALL_CHESS_RANKS.map((r) => {
                const color = RANK_COLORS[r.tier - 1];
                const isCurrent = r.tier === rank.tier;
                const isPast = r.tier < rank.tier;
                const isLocked = r.tier > rank.tier;
                return (
                  <div
                    key={r.tier}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-slate-800/60 border-white/[0.12] ring-1 ring-white/10'
                        : isPast
                        ? 'border-white/[0.04] opacity-60'
                        : 'border-transparent opacity-40'
                    }`}
                  >
                    <span
                      className={`text-2xl w-8 text-center ${isLocked ? 'grayscale opacity-30' : color.text}`}
                      style={{ filter: isCurrent ? color.glow : undefined }}
                    >
                      {r.symbol}
                    </span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${isCurrent ? color.text : isPast ? 'text-slate-400' : 'text-slate-600'}`}>
                        {r.title}
                      </p>
                      <p className="text-[10px] text-slate-600">
                        {r.tier < 6 ? `${r.min} – ${r.max} XP` : `${r.min}+ XP`}
                      </p>
                    </div>
                    {isCurrent && <span className="text-[9px] font-bold text-white bg-slate-700 px-2 py-0.5 rounded-full">CURRENT</span>}
                    {isPast && <span className="text-[9px] font-bold text-emerald-400">✓</span>}
                    {isLocked && <span className="text-[9px] text-slate-700">🔒</span>}
                  </div>
                );
              })}
            </div>
          </PremiumCard>

          {/* XP sources */}
          <PremiumCard glow="none">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">XP Sources</span>
            </div>
            <div className="space-y-2">
              {XP_SOURCES.map(({ label, xp: amount, icon: Icon, color }) => (
                <div key={label} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <span className="flex-1 text-xs text-slate-400">{label}</span>
                  <span className="text-sm font-black text-emerald-400 tabular-nums">+{amount}</span>
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
