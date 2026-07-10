export interface ChessRank {
  id: string;
  name: string;
  minVideoXp: number;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  desc: string;
  historicalFigure: string;
}

export const CHESS_RANKS: ChessRank[] = [
  {
    id: 'pawn',
    name: 'Pawn',
    minVideoXp: 0,
    icon: '♟',
    color: 'text-zinc-400',
    bgColor: 'bg-zinc-400/10',
    borderColor: 'border-zinc-400/30',
    desc: 'Every great historian begins as a curious learner.',
    historicalFigure: 'Novice Scholar',
  },
  {
    id: 'squire',
    name: 'Squire',
    minVideoXp: 50,
    icon: '⚔️',
    color: 'text-amber-600',
    bgColor: 'bg-amber-600/10',
    borderColor: 'border-amber-600/30',
    desc: 'Training under the banner of knowledge.',
    historicalFigure: 'Medieval Squire',
  },
  {
    id: 'knight',
    name: 'Knight',
    minVideoXp: 150,
    icon: '♞',
    color: 'text-slate-300',
    bgColor: 'bg-slate-300/10',
    borderColor: 'border-slate-300/30',
    desc: 'Riding through the annals of history with purpose.',
    historicalFigure: 'Richard the Lionheart',
  },
  {
    id: 'crusader',
    name: 'Crusader',
    minVideoXp: 350,
    icon: '✝️',
    color: 'text-stone-400',
    bgColor: 'bg-stone-400/10',
    borderColor: 'border-stone-400/30',
    desc: 'On a relentless quest for historical truth.',
    historicalFigure: 'Godfrey of Bouillon',
  },
  {
    id: 'centurion',
    name: 'Centurion',
    minVideoXp: 700,
    icon: '🛡️',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/30',
    desc: 'Commander of a hundred victories in historical mastery.',
    historicalFigure: 'Roman Centurion',
  },
  {
    id: 'vizier',
    name: 'Vizier',
    minVideoXp: 1200,
    icon: '🌙',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/10',
    borderColor: 'border-indigo-400/30',
    desc: 'Trusted advisor to empires, keeper of chronicles.',
    historicalFigure: 'Nizam al-Mulk',
  },
  {
    id: 'caesar',
    name: 'Caesar',
    minVideoXp: 2000,
    icon: '👑',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/30',
    desc: 'You have crossed the Rubicon of historical knowledge.',
    historicalFigure: 'Julius Caesar',
  },
  {
    id: 'pharaoh',
    name: 'Pharaoh',
    minVideoXp: 3500,
    icon: '𓂀',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/30',
    desc: 'God-king of historical mastery — your name will endure.',
    historicalFigure: 'Ramesses the Great',
  },
  {
    id: 'emperor',
    name: 'Emperor',
    minVideoXp: 5500,
    icon: '⚜️',
    color: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
    borderColor: 'border-violet-400/30',
    desc: 'Sovereign of all eras — your empire of knowledge is vast.',
    historicalFigure: 'Napoleon Bonaparte',
  },
  {
    id: 'alexander',
    name: 'Alexander',
    minVideoXp: 8000,
    icon: '⚡',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    desc: 'The Great — conqueror of all history, from ancient to modern.',
    historicalFigure: 'Alexander the Great',
  },
];

export function getChessRank(videoXp: number): ChessRank {
  for (let i = CHESS_RANKS.length - 1; i >= 0; i--) {
    if (videoXp >= CHESS_RANKS[i].minVideoXp) return CHESS_RANKS[i];
  }
  return CHESS_RANKS[0];
}

export function getNextRank(currentRank: ChessRank): ChessRank | null {
  const idx = CHESS_RANKS.findIndex(r => r.id === currentRank.id);
  return idx < CHESS_RANKS.length - 1 ? CHESS_RANKS[idx + 1] : null;
}

export function getXpToNextRank(videoXp: number): { needed: number; current: number; pct: number } | null {
  const current = getChessRank(videoXp);
  const next = getNextRank(current);
  if (!next) return null;
  const needed = next.minVideoXp - current.minVideoXp;
  const earned = videoXp - current.minVideoXp;
  return { needed, current: earned, pct: Math.min(100, Math.round((earned / needed) * 100)) };
}
