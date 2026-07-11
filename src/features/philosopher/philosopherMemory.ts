// ─── Philosopher Debate Memory ────────────────────────────────────────────────
// The debate twin of Clio's learner memory: each philosopher remembers every
// student individually across the daily rotation. Two feeds:
//   1. Deterministic — win/loss record and debate counts, written at the
//      moment they happen (no AI involved, can never hallucinate).
//   2. AI extraction — after enough new exchanges, a background call distills
//      the debate into structured rhetoric memory: the stances the student
//      argued, points they conceded, their strongest arguments, and their
//      rhetorical style.
// The active philosopher's system prompt then carries this dossier with rules
// to wield it like a real recurring sparring partner: "when we last debated,
// you conceded that..." — and to escalate difficulty as the student's record
// improves. Everything is capped, deduped, per-philosopher, and clearable.
import { safeJsonParse } from '@/lib/safeJsonParse';
import { streamChatResponse } from '@/services/aiGateway';

type Turn = { role: 'user' | 'assistant'; content: string };

const KEY = (uid: string) => `historify:philosopherMemory:${uid}`;
export const PHILOSOPHER_MEMORY_EVENT = 'historify:philosopher-memory-updated';

const EXTRACT_EVERY_N_MESSAGES = 6;
const EXTRACT_MIN_INTERVAL_MS = 6 * 60 * 1000;
const CAPS = { stances: 10, concessions: 10, strongArguments: 8, summaries: 6 } as const;

export interface PhilosopherRecord {
  philosopherId: string;
  philosopherName: string;
  debates: number;            // distinct days the student engaged
  wins: number;               // debates the philosopher conceded
  stances: string[];          // positions the student argued
  concessions: string[];      // points the student gave up
  strongArguments: string[];  // the student's best moves
  style?: string;             // one-phrase rhetorical profile
  summaries: { at: string; summary: string }[];
  messagesSinceExtraction: number;
  lastExtractionAt?: string;
  lastDebateAt?: string;
}

export interface PhilosopherMemory {
  userId: string;
  version: 1;
  records: Record<string, PhilosopherRecord>; // keyed by philosopher id
  updatedAt: string;
}

export function loadPhilosopherMemory(userId: string): PhilosopherMemory {
  try {
    const raw = localStorage.getItem(KEY(userId));
    if (!raw) return { userId, version: 1, records: {}, updatedAt: new Date().toISOString() };
    const p = JSON.parse(raw) as PhilosopherMemory;
    return p && p.version === 1 && p.records ? p : { userId, version: 1, records: {}, updatedAt: new Date().toISOString() };
  } catch { return { userId, version: 1, records: {}, updatedAt: new Date().toISOString() }; }
}

function save(mem: PhilosopherMemory) {
  mem.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(KEY(mem.userId), JSON.stringify(mem));
    window.dispatchEvent(new CustomEvent(PHILOSOPHER_MEMORY_EVENT, { detail: { userId: mem.userId } }));
  } catch { /* best-effort */ }
}

export function clearPhilosopherMemory(userId: string, philosopherId?: string) {
  if (!philosopherId) {
    try { localStorage.removeItem(KEY(userId)); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent(PHILOSOPHER_MEMORY_EVENT, { detail: { userId } }));
    return;
  }
  const mem = loadPhilosopherMemory(userId);
  delete mem.records[philosopherId];
  save(mem);
}

function getRecord(mem: PhilosopherMemory, philosopherId: string, philosopherName: string): PhilosopherRecord {
  return (mem.records[philosopherId] ??= {
    philosopherId, philosopherName, debates: 0, wins: 0,
    stances: [], concessions: [], strongArguments: [], summaries: [],
    messagesSinceExtraction: 0,
  });
}

/** Deterministic: called once per day the student actually engages. */
export function recordDebateEngagement(userId: string, philosopherId: string, philosopherName: string) {
  const mem = loadPhilosopherMemory(userId);
  const rec = getRecord(mem, philosopherId, philosopherName);
  const today = new Date().toDateString();
  if (rec.lastDebateAt && new Date(rec.lastDebateAt).toDateString() === today) return;
  rec.debates += 1;
  rec.lastDebateAt = new Date().toISOString();
  save(mem);
}

/** Deterministic: the philosopher conceded — the student won. */
export function recordDebateVictory(userId: string, philosopherId: string, philosopherName: string) {
  const mem = loadPhilosopherMemory(userId);
  const rec = getRecord(mem, philosopherId, philosopherName);
  rec.wins += 1;
  save(mem);
}

/** The student's total sparring history across all philosophers. */
export function overallDebateStats(userId: string): { debates: number; wins: number; philosophersFaced: number } {
  const mem = loadPhilosopherMemory(userId);
  const recs = Object.values(mem.records);
  return {
    debates: recs.reduce((a, r) => a + r.debates, 0),
    wins: recs.reduce((a, r) => a + r.wins, 0),
    philosophersFaced: recs.length,
  };
}

// ─── Memory-aware system prompt ───────────────────────────────────────────────

/**
 * The philosopher's base persona prompt with the student's debate dossier
 * injected. A first-time opponent gets the plain persona.
 */
export function buildPhilosopherSystem(
  userId: string | undefined,
  philosopherId: string,
  basePrompt: string,
): string {
  if (!userId) return basePrompt;
  const mem = loadPhilosopherMemory(userId);
  const rec = mem.records[philosopherId];
  const others = Object.values(mem.records).filter(r => r.philosopherId !== philosopherId);
  if (!rec && others.length === 0) return basePrompt;

  const lines: string[] = [];
  if (rec) {
    lines.push(`Debates against you: ${rec.debates}. Times you conceded to them: ${rec.wins}.`);
    if (rec.stances.length) lines.push(`Positions they argued before: ${rec.stances.slice(-6).join('; ')}.`);
    if (rec.concessions.length) lines.push(`Points they previously conceded: ${rec.concessions.slice(-5).join('; ')}.`);
    if (rec.strongArguments.length) lines.push(`Their strongest past arguments: ${rec.strongArguments.slice(-4).join('; ')}.`);
    if (rec.style) lines.push(`Their rhetorical style: ${rec.style}.`);
    if (rec.summaries.length) lines.push(`Past debate notes: ${rec.summaries.slice(-2).map(s => s.summary).join(' | ')}`);
  }
  if (others.length) {
    const cross = others
      .filter(r => r.stances.length > 0 || r.wins > 0)
      .slice(-3)
      .map(r => `${r.philosopherName} (${r.wins} concessions won${r.stances.length ? `; argued: ${r.stances.slice(-2).join('; ')}` : ''})`)
      .join(', ');
    if (cross) lines.push(`They have also sparred with: ${cross}.`);
  }
  if (lines.length === 0) return basePrompt;

  return `${basePrompt}

DEBATE MEMORY (you genuinely remember this student from previous encounters):
${lines.join('\n')}

MEMORY RULES:
- Reference past debates naturally and sparingly ("When we last spoke, you argued...", "You once conceded that...") — never recite this dossier.
- If they contradict a stance they previously argued, seize on it as a real dialectician would.
- Scale your rigor to their record: a student who has won concessions from you gets your sharpest arguments, not repetition of ones they already defeated.
- Never invent memories not present in this dossier.`;
}

// ─── AI extraction pipeline ───────────────────────────────────────────────────

export function noteDebateExchange(
  userId: string,
  philosopherId: string,
  philosopherName: string,
  messages: Turn[],
) {
  const mem = loadPhilosopherMemory(userId);
  const rec = getRecord(mem, philosopherId, philosopherName);
  rec.messagesSinceExtraction += 2;
  const dueByCount = rec.messagesSinceExtraction >= EXTRACT_EVERY_N_MESSAGES;
  const dueByTime = !rec.lastExtractionAt || Date.now() - Date.parse(rec.lastExtractionAt) >= EXTRACT_MIN_INTERVAL_MS;
  save(mem);
  if (dueByCount && dueByTime) {
    void extractDebateMemory(userId, philosopherId, philosopherName, messages).catch(() => { /* silent */ });
  }
}

const EXTRACTION_PROMPT = `You are a debate-analytics engine. Analyze the transcript of a philosophical debate between a STUDENT and a PHILOSOPHER persona. Extract ONLY clearly-evidenced items about the STUDENT.

Respond ONLY with JSON, no fences, exactly this shape (empty arrays where nothing is evidenced):
{
  "summary": "one sentence: what was debated and how the student fared",
  "stances": ["positions the student argued for, as short phrases"],
  "concessions": ["points the student explicitly gave up or accepted"],
  "strongArguments": ["the student's most effective arguments"],
  "style": "one short phrase describing their rhetorical style, or empty string"
}

Rules: be conservative — omit anything speculative. Keep every string under 14 words. Maximum 3 items per array. English only for these internal notes.`;

async function extractDebateMemory(userId: string, philosopherId: string, philosopherName: string, messages: Turn[]) {
  const transcript = messages
    .slice(-EXTRACT_EVERY_N_MESSAGES * 2)
    .map(m => `${m.role === 'user' ? 'STUDENT' : 'PHILOSOPHER'}: ${m.content}`)
    .join('\n')
    .slice(0, 8000);
  if (transcript.length < 200) return;

  let raw = '';
  for await (const chunk of streamChatResponse(
    [{ role: 'user', content: `TRANSCRIPT:\n${transcript}` }],
    undefined,
    EXTRACTION_PROMPT,
  )) raw += chunk;

  const parsed = parseDebateExtraction(raw);
  if (!parsed) return;

  const mem = loadPhilosopherMemory(userId);
  const rec = getRecord(mem, philosopherId, philosopherName);
  const mergeIn = (list: string[], incoming: string[], cap: number) => {
    for (const item of incoming) {
      const low = item.toLowerCase();
      if (list.some(e => e.toLowerCase().includes(low) || low.includes(e.toLowerCase()))) continue;
      list.push(item);
    }
    return list.slice(-cap);
  };
  rec.stances = mergeIn(rec.stances, parsed.stances, CAPS.stances);
  rec.concessions = mergeIn(rec.concessions, parsed.concessions, CAPS.concessions);
  rec.strongArguments = mergeIn(rec.strongArguments, parsed.strongArguments, CAPS.strongArguments);
  if (parsed.style) rec.style = parsed.style;
  if (parsed.summary) {
    rec.summaries.push({ at: new Date().toISOString(), summary: parsed.summary });
    rec.summaries = rec.summaries.slice(-CAPS.summaries);
  }
  rec.messagesSinceExtraction = 0;
  rec.lastExtractionAt = new Date().toISOString();
  save(mem);
}

interface DebateExtraction {
  summary: string; stances: string[]; concessions: string[]; strongArguments: string[]; style: string;
}

const strArr = (v: unknown, max: number): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).map(x => x.trim()).slice(0, max) : [];

export function parseDebateExtraction(raw: string): DebateExtraction | null {
  let p: Record<string, unknown>;
  try { p = safeJsonParse<Record<string, unknown>>(raw); } catch { return null; }
  if (!p || typeof p !== 'object') return null;
  return {
    summary: typeof p.summary === 'string' ? p.summary.trim() : '',
    stances: strArr(p.stances, 3),
    concessions: strArr(p.concessions, 3),
    strongArguments: strArr(p.strongArguments, 3),
    style: typeof p.style === 'string' ? p.style.trim() : '',
  };
}
