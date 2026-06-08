export type SmartQuizSession = {
  date: string;      // ISO date
  score: number;     // 0–15
  total: number;     // always 15
  xpEarned: number;
  eraBreakdown: Record<string, { correct: number; total: number }>;
};

export type SmartQuizStats = {
  sessions: SmartQuizSession[];
};

const KEY = (uid: string) => `historify:smartQuizStats:${uid}`;

export function getSmartQuizStats(userId: string): SmartQuizStats {
  try {
    const raw = localStorage.getItem(KEY(userId));
    return raw ? JSON.parse(raw) : { sessions: [] };
  } catch { return { sessions: [] }; }
}

export function recordSmartQuizSession(userId: string, session: SmartQuizSession): void {
  const stats = getSmartQuizStats(userId);
  stats.sessions.push(session);
  localStorage.setItem(KEY(userId), JSON.stringify(stats));
}
