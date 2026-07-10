// ─── Clio Learner Memory: persistent per-student profile ─────────────────────
// Makes Clio remember the student across sessions. Two feeds build the
// profile:
//   1. AI extraction — after enough new tutor exchanges, a background call
//      distills the conversation into structured memory (interests, strengths,
//      weaknesses, misconceptions with corrections, mastered facts, a rolling
//      summary, and the student's preferred learning style).
//   2. Deterministic signals — quiz misses recorded by the quiz surfaces and a
//      live performance snapshot computed from progress + Smart Quiz history
//      at prompt-build time (never stored stale).
//
// The profile is injected into Clio's system prompt as a compact MEMORY block
// with strict personalization rules, so the model references prior learning
// naturally instead of reciting a dossier. Everything is capped, deduped, and
// clearable by the student — memory they can see and control.
import { safeJsonParse } from '@/lib/safeJsonParse';
import { streamChatResponse } from '@/services/aiGateway';
import { loadProgress } from '@/features/progress/progressStore';
import { getSmartQuizStats } from '@/features/smartQuiz/smartQuizStats';
import { ERAS } from '@/features/content/erasData';

type Turn = { role: 'user' | 'assistant'; content: string };

const KEY = (uid: string) => `historify:learnerProfile:${uid}`;
export const PROFILE_UPDATED_EVENT = 'historify:learner-profile-updated';

// Extraction cadence: enough signal to be worth an AI call, rare enough to be
// invisible in cost. Both conditions must hold.
const EXTRACT_EVERY_N_MESSAGES = 6;
const EXTRACT_MIN_INTERVAL_MS = 8 * 60 * 1000;

// Caps keep the prompt block compact and the profile bounded forever.
const CAPS = { interests: 12, strengths: 8, weaknesses: 8, misconceptions: 20, facts: 40, goals: 5, summaries: 10, quizMisses: 30 } as const;

export interface Misconception { belief: string; correction: string; topic: string; at: string }
export interface LearnedFact { fact: string; topic: string; at: string }
export interface QuizMiss { question: string; correct: string; era: string; at: string }

export interface LearnerProfile {
  userId: string;
  version: 1;
  interests: string[];
  strengths: string[];
  weaknesses: string[];
  misconceptions: Misconception[];
  factsLearned: LearnedFact[];
  goals: string[];
  preferredStyle?: string;
  conversationSummaries: { at: string; summary: string }[];
  quizMisses: QuizMiss[];
  messagesSinceExtraction: number;
  lastExtractionAt?: string;
  updatedAt: string;
}

export function createEmptyProfile(userId: string): LearnerProfile {
  return {
    userId, version: 1, interests: [], strengths: [], weaknesses: [], misconceptions: [],
    factsLearned: [], goals: [], conversationSummaries: [], quizMisses: [],
    messagesSinceExtraction: 0, updatedAt: new Date().toISOString(),
  };
}

export function loadLearnerProfile(userId: string): LearnerProfile {
  try {
    const raw = localStorage.getItem(KEY(userId));
    if (!raw) return createEmptyProfile(userId);
    const p = JSON.parse(raw) as LearnerProfile;
    return p && p.version === 1 ? p : createEmptyProfile(userId);
  } catch { return createEmptyProfile(userId); }
}

export function saveLearnerProfile(p: LearnerProfile) {
  p.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(KEY(p.userId), JSON.stringify(p));
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: { userId: p.userId } }));
  } catch { /* quota — memory is best-effort */ }
}

export function clearLearnerProfile(userId: string) {
  try { localStorage.removeItem(KEY(userId)); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: { userId } }));
}

/** True when the profile has anything worth telling Clio about. */
export function profileHasSignal(p: LearnerProfile): boolean {
  return p.interests.length > 0 || p.misconceptions.length > 0 || p.factsLearned.length > 0
    || p.conversationSummaries.length > 0 || p.quizMisses.length > 0 || p.goals.length > 0;
}

// ─── Deterministic feeds ──────────────────────────────────────────────────────

/** Record missed quiz questions into memory (called by quiz surfaces). */
export function recordQuizMissesToProfile(
  userId: string,
  missed: { question: string; correct: string; eraName: string }[],
) {
  if (missed.length === 0) return;
  const p = loadLearnerProfile(userId);
  const now = new Date().toISOString();
  const known = new Set(p.quizMisses.map(m => m.question.toLowerCase()));
  for (const m of missed) {
    if (known.has(m.question.toLowerCase())) continue;
    p.quizMisses.push({ question: m.question, correct: m.correct, era: m.eraName, at: now });
  }
  p.quizMisses = p.quizMisses.slice(-CAPS.quizMisses);
  saveLearnerProfile(p);
}

/** Mark a misconception as resolved (student demonstrated the correction). */
export function resolveMisconception(userId: string, belief: string) {
  const p = loadLearnerProfile(userId);
  p.misconceptions = p.misconceptions.filter(m => m.belief !== belief);
  saveLearnerProfile(p);
}

export interface PerformanceSnapshot {
  level: number; streak: number; lessonsDone: number;
  strongestEra?: { name: string; pct: number };
  weakestEra?: { name: string; pct: number };
  recentSmartQuizAvg?: number;
}

/** Live performance summary from progress + Smart Quiz history. Never cached. */
export function buildPerformanceSnapshot(userId: string): PerformanceSnapshot {
  const prog = loadProgress(userId);
  const snap: PerformanceSnapshot = {
    level: prog.level, streak: prog.streak, lessonsDone: prog.completedLessons.length,
  };
  // Era accuracy blends the era quiz score with Smart Quiz per-era breakdowns.
  const stats = getSmartQuizStats(userId);
  const eraAcc: Record<string, { correct: number; total: number }> = {};
  for (const s of stats.sessions.slice(-10)) {
    for (const [era, b] of Object.entries(s.eraBreakdown)) {
      const acc = (eraAcc[era] ??= { correct: 0, total: 0 });
      acc.correct += b.correct; acc.total += b.total;
    }
  }
  const scored: { name: string; pct: number }[] = [];
  for (const era of ERAS) {
    const quizPct = prog.quizScores[era.quizId];
    const sq = eraAcc[era.id];
    const sqPct = sq && sq.total >= 3 ? (sq.correct / sq.total) * 100 : undefined;
    const parts = [quizPct, sqPct].filter((v): v is number => typeof v === 'number');
    if (parts.length > 0) scored.push({ name: era.name, pct: Math.round(parts.reduce((a, b) => a + b, 0) / parts.length) });
  }
  if (scored.length > 0) {
    scored.sort((a, b) => b.pct - a.pct);
    snap.strongestEra = scored[0];
    snap.weakestEra = scored[scored.length - 1];
  }
  const recent = stats.sessions.slice(-5);
  if (recent.length > 0) {
    snap.recentSmartQuizAvg = Math.round(recent.reduce((a, s) => a + (s.score / s.total) * 100, 0) / recent.length);
  }
  return snap;
}

// ─── Memory-aware system prompt ───────────────────────────────────────────────

const TUTOR_BASE_PROMPT = `You are Clio, an expert history tutor for the Historify learning app.
You help students learn world history across four eras: Ancient (~3000 BCE–500 CE), Middle Ages (~500–1500 CE), Early Modern (~1500–1800 CE), and Modern (~1800–present).
Guidelines:
- Give clear, engaging answers (150–300 words unless asked for more)
- Use specific dates, names, and examples
- Connect events across time periods when relevant
- End with a thought-provoking question to encourage curiosity
- If asked off-topic, gently redirect to history
- Write in plain prose only — no markdown, no ## headers, no ** bold, no bullet asterisks`;

/**
 * Clio's full system prompt with the student's persistent memory injected.
 * Returns the plain tutor prompt for a fresh profile, so the model never sees
 * an empty dossier.
 */
export function buildMemoryAwareSystem(userId: string, username?: string): string {
  const p = loadLearnerProfile(userId);
  const snap = buildPerformanceSnapshot(userId);
  if (!profileHasSignal(p) && !snap.strongestEra) return TUTOR_BASE_PROMPT;

  const lines: string[] = [];
  if (username) lines.push(`Student: ${username}, level ${snap.level}, ${snap.streak}-day streak, ${snap.lessonsDone} lessons completed.`);
  if (snap.strongestEra && snap.weakestEra && snap.strongestEra.name !== snap.weakestEra.name) {
    lines.push(`Performance: strongest era ${snap.strongestEra.name} (${snap.strongestEra.pct}%), weakest ${snap.weakestEra.name} (${snap.weakestEra.pct}%).`);
  }
  if (typeof snap.recentSmartQuizAvg === 'number') lines.push(`Recent adaptive-quiz average: ${snap.recentSmartQuizAvg}%.`);
  if (p.interests.length) lines.push(`Interests: ${p.interests.join('; ')}.`);
  if (p.goals.length) lines.push(`Stated goals: ${p.goals.join('; ')}.`);
  if (p.strengths.length) lines.push(`Strengths: ${p.strengths.join('; ')}.`);
  if (p.weaknesses.length) lines.push(`Struggles with: ${p.weaknesses.join('; ')}.`);
  if (p.preferredStyle) lines.push(`Learning style: ${p.preferredStyle}.`);
  if (p.misconceptions.length) {
    lines.push('Known misconceptions (correct gently WHEN the topic comes up, never as a list):');
    for (const m of p.misconceptions.slice(-8)) lines.push(`  • believes "${m.belief}" — actually: ${m.correction}`);
  }
  if (p.quizMisses.length) {
    lines.push('Recently missed quiz questions (weave quick checks on these into relevant answers):');
    for (const m of p.quizMisses.slice(-6)) lines.push(`  • [${m.era}] ${m.question} → ${m.correct}`);
  }
  if (p.factsLearned.length) {
    const recent = p.factsLearned.slice(-10).map(f => f.fact);
    lines.push(`Already mastered (build on these, don't re-explain from scratch): ${recent.join('; ')}.`);
  }
  if (p.conversationSummaries.length) {
    lines.push(`Previous sessions: ${p.conversationSummaries.slice(-3).map(s => s.summary).join(' | ')}`);
  }

  return `${TUTOR_BASE_PROMPT}

STUDENT MEMORY (persistent across sessions — you genuinely remember this student):
${lines.join('\n')}

PERSONALIZATION RULES:
- Reference prior learning naturally when relevant ("as you discovered when we discussed...") — never dump this memory as a list.
- Pitch difficulty to their level: lean on strengths, scaffold the weak eras.
- When a topic touches a known misconception or a missed quiz question, address it — one gentle check per answer at most.
- Never claim to remember anything not present in this memory block.`;
}

// ─── AI extraction pipeline ───────────────────────────────────────────────────

/** Called after each completed exchange; extracts when the cadence allows. */
export function noteExchangeAndMaybeExtract(userId: string, messages: Turn[]) {
  const p = loadLearnerProfile(userId);
  p.messagesSinceExtraction += 2; // one user + one assistant turn
  const dueByCount = p.messagesSinceExtraction >= EXTRACT_EVERY_N_MESSAGES;
  const dueByTime = !p.lastExtractionAt || Date.now() - Date.parse(p.lastExtractionAt) >= EXTRACT_MIN_INTERVAL_MS;
  saveLearnerProfile(p);
  if (dueByCount && dueByTime) {
    // Fire-and-forget: extraction must never block or break the chat UI.
    void extractProfileFromConversation(userId, messages).catch(() => { /* silent */ });
  }
}

const EXTRACTION_PROMPT = `You are a learning-analytics engine for a history tutoring app. Analyze the tutoring conversation transcript and extract ONLY clearly-evidenced items about the STUDENT (not the tutor).

Respond ONLY with JSON, no fences, exactly this shape (empty arrays where nothing is evidenced):
{
  "summary": "one sentence: what was studied and how it went",
  "interests": ["history topics the student showed genuine curiosity about"],
  "strengths": ["things the student clearly understands well"],
  "weaknesses": ["things the student struggled with"],
  "misconceptions": [{ "belief": "what the student wrongly believes", "correction": "the accurate version", "topic": "short topic tag" }],
  "facts": [{ "fact": "a specific fact the student demonstrably learned in this conversation", "topic": "short topic tag" }],
  "goals": ["explicit goals the student stated, e.g. preparing for an exam"],
  "style": "one short phrase for their preferred learning style, or empty string"
}

Rules: be conservative — omit anything speculative. Keep every string under 15 words. Maximum 3 items per array. English only for these internal notes.`;

async function extractProfileFromConversation(userId: string, messages: Turn[]) {
  const transcript = messages
    .slice(-EXTRACT_EVERY_N_MESSAGES * 2)
    .map(m => `${m.role === 'user' ? 'STUDENT' : 'CLIO'}: ${m.content}`)
    .join('\n')
    .slice(0, 8000);
  if (transcript.length < 200) return; // nothing meaningful to extract

  let raw = '';
  for await (const chunk of streamChatResponse(
    [{ role: 'user', content: `TRANSCRIPT:\n${transcript}` }],
    undefined,
    EXTRACTION_PROMPT,
  )) raw += chunk;

  const parsed = parseExtraction(raw);
  if (!parsed) return;
  mergeExtraction(userId, parsed);
}

interface Extraction {
  summary: string; interests: string[]; strengths: string[]; weaknesses: string[];
  misconceptions: { belief: string; correction: string; topic: string }[];
  facts: { fact: string; topic: string }[];
  goals: string[]; style: string;
}

const strArr = (v: unknown, max: number): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).map(x => x.trim()).slice(0, max) : [];

export function parseExtraction(raw: string): Extraction | null {
  let p: Record<string, unknown>;
  try { p = safeJsonParse<Record<string, unknown>>(raw); } catch { return null; }
  if (!p || typeof p !== 'object') return null;
  const mis = Array.isArray(p.misconceptions)
    ? p.misconceptions
        .map(m0 => {
          const m = m0 as Record<string, unknown>;
          return {
            belief: typeof m?.belief === 'string' ? m.belief.trim() : '',
            correction: typeof m?.correction === 'string' ? m.correction.trim() : '',
            topic: typeof m?.topic === 'string' ? m.topic.trim() : '',
          };
        })
        .filter(m => m.belief && m.correction).slice(0, 3)
    : [];
  const facts = Array.isArray(p.facts)
    ? p.facts
        .map(f0 => {
          const f = f0 as Record<string, unknown>;
          return {
            fact: typeof f?.fact === 'string' ? f.fact.trim() : '',
            topic: typeof f?.topic === 'string' ? f.topic.trim() : '',
          };
        })
        .filter(f => f.fact).slice(0, 3)
    : [];
  return {
    summary: typeof p.summary === 'string' ? p.summary.trim() : '',
    interests: strArr(p.interests, 3),
    strengths: strArr(p.strengths, 3),
    weaknesses: strArr(p.weaknesses, 3),
    misconceptions: mis,
    facts,
    goals: strArr(p.goals, 3),
    style: typeof p.style === 'string' ? p.style.trim() : '',
  };
}

/** Case-insensitive containment dedupe: keeps the list from accreting synonyms. */
function mergeList(existing: string[], incoming: string[], cap: number): string[] {
  const out = [...existing];
  for (const item of incoming) {
    const low = item.toLowerCase();
    if (out.some(e => e.toLowerCase().includes(low) || low.includes(e.toLowerCase()))) continue;
    out.push(item);
  }
  return out.slice(-cap);
}

function mergeExtraction(userId: string, ex: Extraction) {
  const p = loadLearnerProfile(userId);
  const now = new Date().toISOString();
  p.interests = mergeList(p.interests, ex.interests, CAPS.interests);
  p.strengths = mergeList(p.strengths, ex.strengths, CAPS.strengths);
  p.weaknesses = mergeList(p.weaknesses, ex.weaknesses, CAPS.weaknesses);
  p.goals = mergeList(p.goals, ex.goals, CAPS.goals);
  if (ex.style) p.preferredStyle = ex.style;
  const knownBeliefs = new Set(p.misconceptions.map(m => m.belief.toLowerCase()));
  for (const m of ex.misconceptions) {
    if (knownBeliefs.has(m.belief.toLowerCase())) continue;
    p.misconceptions.push({ ...m, at: now });
  }
  p.misconceptions = p.misconceptions.slice(-CAPS.misconceptions);
  const knownFacts = new Set(p.factsLearned.map(f => f.fact.toLowerCase()));
  for (const f of ex.facts) {
    if (knownFacts.has(f.fact.toLowerCase())) continue;
    p.factsLearned.push({ ...f, at: now });
  }
  p.factsLearned = p.factsLearned.slice(-CAPS.facts);
  if (ex.summary) {
    p.conversationSummaries.push({ at: now, summary: ex.summary });
    p.conversationSummaries = p.conversationSummaries.slice(-CAPS.summaries);
  }
  p.messagesSinceExtraction = 0;
  p.lastExtractionAt = now;
  saveLearnerProfile(p);
}
