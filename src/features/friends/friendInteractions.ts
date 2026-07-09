// ─── Friend interactions: direct messages + History 1v1 duels ─────────────────
// Client-side persistence and logic for the social layer. Messages are stored
// per conversation; duels draw questions from the live quiz banks and pit the
// player against a friend whose answering skill scales with their XP. Clio
// (the AI gateway) narrates the battlefield, but the duel resolves entirely
// from validated local data so a network hiccup never breaks a match.
import { QUIZZES } from '@/features/quiz/quizData';

// ── Direct messaging ─────────────────────────────────────────────────────────

export interface ChatMsg {
  id: string;
  from: string;          // sender user id ('me' for the local user)
  text: string;
  ts: string;            // ISO timestamp
}

const MSG_KEY = 'historify:friendChat:';

const convoKey = (userId: string, friendId: string) => `${MSG_KEY}${userId}:${friendId}`;

export function loadThread(userId: string, friendId: string): ChatMsg[] {
  try {
    const raw = localStorage.getItem(convoKey(userId, friendId));
    const parsed = raw ? (JSON.parse(raw) as ChatMsg[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function saveThread(userId: string, friendId: string, thread: ChatMsg[]) {
  try { localStorage.setItem(convoKey(userId, friendId), JSON.stringify(thread.slice(-200))); } catch { /* best-effort */ }
}

/** A friendly canned reply, so the demo conversation feels alive offline. */
const AUTO_REPLIES = [
  'Good luck in your next duel! ⚔️',
  'Did you finish the Viking Age lesson yet?',
  'I just hit a 7-day streak 🔥',
  'That Gaugamela crisis is brutal. How did you do?',
  'Race you to the top of the leaderboard!',
  'Rome or Greece — which era is your favourite?',
  'Challenge me to a History 1v1 whenever you\'re ready.',
];

export function autoReplyFor(friendId: string, seed: number): string {
  const idx = Math.abs((friendId.charCodeAt(0) + seed)) % AUTO_REPLIES.length;
  return AUTO_REPLIES[idx];
}

// ── History 1v1 duel ─────────────────────────────────────────────────────────

export interface DuelQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  eraId: string;
}

/** Draw a shuffled set of duel questions spanning all eras. */
export function drawDuelQuestions(count: number): DuelQuestion[] {
  const pool: DuelQuestion[] = QUIZZES.flatMap(qz =>
    qz.questions.map(q => ({
      id: `${qz.id}:${q.id}`,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      eraId: qz.eraId,
    })),
  );
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/**
 * Opponent skill 0..1 — how often the friend AI answers correctly. Scales with
 * their XP so stronger friends are harder duels, clamped to a fair band.
 */
export function opponentSkill(xp: number): number {
  return Math.max(0.45, Math.min(0.85, 0.5 + xp / 20000));
}

/** Does the opponent answer this round correctly? Deterministic-ish per round. */
export function opponentAnswers(skill: number): boolean {
  return Math.random() < skill;
}

// ── Battlefield theming (Clio's stage) ───────────────────────────────────────

export interface Battlefield {
  name: string;
  era: 'ancient' | 'medieval' | 'early-modern' | 'modern';
  blurb: string;
}

const BATTLEFIELDS: Battlefield[] = [
  { name: 'The Plain of Gaugamela', era: 'ancient', blurb: 'Dust rises where Alexander shattered Persia. Prove your knowledge holds the line.' },
  { name: 'The Walls of Constantinople', era: 'medieval', blurb: 'Empires have broken on these ramparts. Only the sharper mind prevails today.' },
  { name: 'The Field of Hastings', era: 'medieval', blurb: '1066 decided a kingdom here. Your recall of history decides this duel.' },
  { name: 'The Bay of Salamis', era: 'ancient', blurb: 'Where triremes clashed and Greece was saved. Ram your rival with facts.' },
  { name: 'The Ramparts of Vienna', era: 'early-modern', blurb: 'The gates of Europe. Hold them with what you know.' },
  { name: 'The Somme Trenches', era: 'modern', blurb: 'A century of total war echoes here. No ground given to the ill-prepared.' },
];

/** Deterministic battlefield pick so both sides "see" the same arena. */
export function pickBattlefield(seed: string): Battlefield {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return BATTLEFIELDS[h % BATTLEFIELDS.length];
}

export function buildDuelIntroPrompt(bf: Battlefield, playerName: string, opponentName: string): string {
  return `You are Clio, Muse of History, acting as the herald of a friendly "History 1v1" duel on ${bf.name}. In ONE short, vivid sentence (max 25 words, no markdown), announce the duel between ${playerName} and ${opponentName} and set the historical scene. Address both as worthy challengers. Plain text only.`;
}

// ── Duel result persistence (win/loss record per friend) ─────────────────────

export interface DuelRecord { wins: number; losses: number; lastResult?: 'win' | 'loss'; lastAt?: string }

const DUEL_KEY = 'historify:duelRecord:';

export function loadDuelRecord(userId: string, friendId: string): DuelRecord {
  try {
    const raw = localStorage.getItem(`${DUEL_KEY}${userId}:${friendId}`);
    const parsed = raw ? (JSON.parse(raw) as DuelRecord) : null;
    if (parsed && typeof parsed.wins === 'number') return parsed;
  } catch { /* fallthrough */ }
  return { wins: 0, losses: 0 };
}

export function recordDuel(userId: string, friendId: string, won: boolean): DuelRecord {
  const rec = loadDuelRecord(userId, friendId);
  const next: DuelRecord = {
    wins: rec.wins + (won ? 1 : 0),
    losses: rec.losses + (won ? 0 : 1),
    lastResult: won ? 'win' : 'loss',
    lastAt: new Date().toISOString(),
  };
  try { localStorage.setItem(`${DUEL_KEY}${userId}:${friendId}`, JSON.stringify(next)); } catch { /* best-effort */ }
  return next;
}
