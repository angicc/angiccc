// ─── The Commander's Ledger ──────────────────────────────────────────────────
// A per-campaign record of every tactical decision the player made and how
// history judged it. Each resolved battle appends one entry (grade, matchup,
// ground, outcome, the historical parallel Clio cited); the ledger then
// aggregates them into a Strategic Profile — average decision quality, counter
// rate, doctrine tendencies — that the UI renders as an analytics drawer.
// Persistence is localStorage keyed by campaign id, so a rollback simply keeps
// the fuller record (the ledger is a journal, not a save file).
import type { Tactic, TacticGrade, Weather } from './combatMatrix';
import type { TerrainKind } from './geoGraph';

export interface LedgerEntry {
  turn: number;
  territoryId: string;
  playerTactic: Tactic;
  enemyTactic: Tactic;
  terrain: TerrainKind;
  weather: Weather;
  grade: TacticGrade;
  outcome: 'won' | 'lost' | 'draw';
  parallelId: string;          // historical battle cited by Clio's Debrief
  at: string;                  // ISO timestamp
}

const KEY = 'historify:imperium:ledger:';

export function loadLedger(campaignId: string): LedgerEntry[] {
  try {
    const raw = localStorage.getItem(KEY + campaignId);
    const parsed = raw ? (JSON.parse(raw) as LedgerEntry[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function appendLedger(campaignId: string, entry: LedgerEntry): LedgerEntry[] {
  const all = [...loadLedger(campaignId), entry].slice(-120);
  try { localStorage.setItem(KEY + campaignId, JSON.stringify(all)); } catch { /* best-effort */ }
  return all;
}

const GRADE_POINTS: Record<TacticGrade, number> = { S: 100, A: 82, B: 62, C: 40, D: 15 };

export interface StrategicProfile {
  battles: number;
  wins: number;
  /** 0–100 average decision quality across all graded moves. */
  iq: number;
  /** Share of battles where the player's tactic countered the enemy's. */
  counterRate: number;
  /** The tactic the player reaches for most. */
  favoriteTactic: Tactic | null;
  /** Best and worst single reads. */
  bestGrade: TacticGrade | null;
  worstGrade: TacticGrade | null;
  /** Distinct historical parallels collected (the "codex" count). */
  parallelsSeen: string[];
}

const COUNTERS: Record<Tactic, Tactic> = { charge: 'volley', volley: 'hold', hold: 'charge' };
const GRADE_ORDER: TacticGrade[] = ['S', 'A', 'B', 'C', 'D'];

export function computeProfile(entries: LedgerEntry[]): StrategicProfile {
  if (entries.length === 0) {
    return { battles: 0, wins: 0, iq: 0, counterRate: 0, favoriteTactic: null, bestGrade: null, worstGrade: null, parallelsSeen: [] };
  }
  const wins = entries.filter(e => e.outcome === 'won').length;
  const iq = Math.round(entries.reduce((a, e) => a + GRADE_POINTS[e.grade], 0) / entries.length);
  const counters = entries.filter(e => COUNTERS[e.playerTactic] === e.enemyTactic).length;
  const byTactic = new Map<Tactic, number>();
  for (const e of entries) byTactic.set(e.playerTactic, (byTactic.get(e.playerTactic) ?? 0) + 1);
  const favoriteTactic = [...byTactic.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const grades = entries.map(e => e.grade);
  const bestGrade = GRADE_ORDER.find(g => grades.includes(g)) ?? null;
  const worstGrade = [...GRADE_ORDER].reverse().find(g => grades.includes(g)) ?? null;
  const parallelsSeen = [...new Set(entries.map(e => e.parallelId))];
  return { battles: entries.length, wins, iq, counterRate: Math.round((counters / entries.length) * 100), favoriteTactic, bestGrade, worstGrade, parallelsSeen };
}

/** Rank title key for a Strategic IQ band — resolved through the imperium catalog. */
export function iqRankKey(iq: number): string {
  if (iq >= 85) return 'imp_ledger_rank_master';
  if (iq >= 68) return 'imp_ledger_rank_tactician';
  if (iq >= 50) return 'imp_ledger_rank_captain';
  if (iq >= 30) return 'imp_ledger_rank_student';
  return 'imp_ledger_rank_recruit';
}
