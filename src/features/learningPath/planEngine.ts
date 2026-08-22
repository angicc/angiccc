// ─── Learning-path plan engine ────────────────────────────────────────────────
// Two-layer design: a DETERMINISTIC generator builds the week — real lesson
// ids, real routes, sensible pacing driven by the mastery model — and the AI
// layer only decorates it (coach note, weekly theme, per-day rationale,
// Master-tier deep analysis). The plan a student follows can therefore never
// point at a hallucinated lesson or a broken route, even if the AI response is
// garbage: parsing failures simply leave the plan undecorated.
import { safeJsonParse } from '@/lib/safeJsonParse';
import { stripWeldedScripts } from '@/services/sanitizeAiText';
import { LESSONS } from '@/features/content/lessonsData';
import { ERAS } from '@/features/content/erasData';
import type { EraId } from '@/types';
import type { MasterySnapshot } from './masteryModel';
import type { LearnerSignals, FocusMode } from './learnerSignals';

export type StepKind = 'lesson' | 'era-quiz' | 'smart-quiz' | 'flashcards' | 'studio' | 'crisis' | 'timeline-map';

export interface PlanStep {
  id: string;
  day: number;            // 1–7
  kind: StepKind;
  lessonId?: string;      // for kind 'lesson'
  eraId?: EraId;          // for 'lesson' | 'era-quiz' | 'timeline-map'
  minutes: number;
  manualDone?: boolean;   // user checkbox for kinds without an automatic signal
}

export interface AiPlanNotes {
  weekTheme: string;
  coachNote: string;
  dayNotes: Record<number, string>;
  deepAnalysis?: string;  // Master only
}

export interface WeekPlan {
  id: string;
  createdAt: string;
  steps: PlanStep[];
  aiNotes?: AiPlanNotes;
  /** Era the week was built around — lets us notice when it stops being the weakest. */
  focusEraId?: EraId;
  /** Study days scheduled (3–7), sized to the learner's real rhythm. */
  days?: number;
  /** Minutes budgeted per study day when the plan was built. */
  budgetMinutes?: number;
  /** Why the plan is shaped the way it is; surfaced to the learner. */
  mode?: FocusMode;
  modeReason?: string;
}

/** Route for a step — every kind maps to a real app destination. */
export function stepRoute(step: PlanStep): string {
  switch (step.kind) {
    case 'lesson': return `/eras/${step.eraId}/lessons/${step.lessonId}`;
    case 'era-quiz': return `/eras/${step.eraId}/quiz`;
    case 'smart-quiz': return '/smart-quiz';
    case 'flashcards': return '/flashcards';
    case 'studio': return '/studio';
    case 'crisis': return '/crisis';
    case 'timeline-map': return '/timeline-map';
  }
}

const uid = () => crypto.randomUUID();

type LessonRef = { id: string; eraId: EraId; estimatedMinutes: number };
/** A step before it has been assigned an id and a day. */
type Candidate = Omit<PlanStep, 'id' | 'day'>;

/**
 * Build the ordered work for the week, before it is dealt into days.
 *
 * The order encodes the teaching decision; the packing below is mechanical.
 * Three things drive it that the previous fixed seven-day script ignored
 * entirely: whether the learner is coming back from a gap, whether the weakness
 * is coverage or recall, and how much they realistically study.
 */
function buildCandidates(mastery: MasterySnapshot, signals: LearnerSignals, lessons: LessonRef[]): { body: Candidate[]; closing: Candidate } {
  const focus = mastery.eras.find(e => e.eraId === signals.focusEraId) ?? mastery.weakest;
  const out: Candidate[] = [];
  let li = 0;

  // Lessons are drawn strictly in order from a single merged pool, so no
  // lesson is ever scheduled twice and none is skipped over. (The old
  // generator could reach for secondLessons[1] while secondLessons[0] had
  // never been scheduled at all.)
  const lesson = (): Candidate | null => {
    const l = lessons[li];
    if (!l) return null;
    li += 1;
    return { kind: 'lesson', lessonId: l.id, eraId: l.eraId, minutes: l.estimatedMinutes };
  };
  const smartQuiz = (): Candidate => ({ kind: 'smart-quiz', minutes: 10 });
  const flashcards = (): Candidate => ({ kind: 'flashcards', minutes: 8 });
  const eraQuiz = (): Candidate => ({ kind: 'era-quiz', eraId: focus.eraId, minutes: 12 });
  const immersive = (): Candidate => (mastery.overall >= 40
    ? { kind: 'crisis', eraId: focus.eraId, minutes: 15 }
    : { kind: 'timeline-map', eraId: focus.eraId, minutes: 12 });

  const push = (c: Candidate | null) => { if (c) out.push(c); };

  // Coming back after a gap: re-entry before new material. Dropping someone
  // straight into an unread lesson after two weeks away is how a streak stays
  // broken.
  if (signals.returning) {
    push(flashcards());
    push(smartQuiz());
  }

  // A summative era quiz is only worth scheduling once there is something in
  // the era to be summative about.
  const eraQuizWorthwhile = focus.lessonsDone >= 1 && (focus.quizPct === null || focus.quizPct < 70);

  switch (signals.mode) {
    case 'coverage':
      // Mostly unread: read, check, read, read, consolidate.
      push(lesson()); push(lesson()); push(smartQuiz());
      push(lesson()); push(flashcards()); push(lesson());
      if (eraQuizWorthwhile) push(eraQuiz());
      break;
    case 'retention':
      // Read but not retained: retrieval practice first, and only a little new
      // material — another lesson is not what is missing here.
      push(flashcards()); push(smartQuiz());
      if (eraQuizWorthwhile) push(eraQuiz());
      push(lesson()); push(flashcards()); push(smartQuiz());
      push(lesson());
      break;
    default:
      push(lesson()); push(smartQuiz()); push(lesson());
      push(flashcards());
      if (eraQuizWorthwhile) push(eraQuiz());
      push(lesson()); push(immersive());
      break;
  }

  // One immersive day so the week is not all reading and testing — but only
  // when there is room for it.
  if (signals.mode !== 'balanced' && signals.studyDays >= 5) push(immersive());

  // Whatever else happened, the week ends on a measurement, so the learner
  // finishes with a number that moved.
  return { body: out, closing: smartQuiz() };
}

/**
 * Deterministic weekly plan from the mastery snapshot and the learner's real
 * study behaviour.
 *
 * The week is sized, not templated: `signals.studyDays` decides how many days
 * to fill and `signals.dailyBudgetMinutes` decides how much goes on each, both
 * derived from time the learner actually spent in the app. A learner who
 * studied two days in the last fortnight gets a plan they can finish rather
 * than seven days they will abandon.
 */
export function generateWeekPlan(
  mastery: MasterySnapshot,
  signals: LearnerSignals,
  uncompletedByEra: (eraId: EraId) => LessonRef[],
): WeekPlan {
  const byWeakness = [...mastery.eras].sort((a, b) => a.mastery - b.mastery);
  // Focus era first, then broaden by weakness — one flat pool, so the week
  // keeps finding real lessons instead of quietly running dry.
  const order = [
    ...mastery.eras.filter(e => e.eraId === signals.focusEraId),
    ...byWeakness.filter(e => e.eraId !== signals.focusEraId),
  ];
  const pool: LessonRef[] = [];
  const seen = new Set<string>();
  for (const era of order) {
    for (const l of uncompletedByEra(era.eraId)) {
      if (!seen.has(l.id)) { seen.add(l.id); pool.push(l); }
    }
    if (pool.length >= 6) break;
  }

  const { body, closing } = buildCandidates(mastery, signals, pool);
  const maxDays = Math.max(1, Math.min(7, signals.studyDays));
  const budget = signals.dailyBudgetMinutes;

  // Pack the work into days against the real minute budget, then keep only
  // what fits inside the week. Trimming by actual packing rather than by a
  // minute estimate is what stops a short week ending with a 77-minute day
  // when the budget said 20.
  const steps: PlanStep[] = [];
  let day = 1;
  let dayMinutes = 0;
  let onThisDay = 0;

  for (const c of body) {
    if (onThisDay > 0 && dayMinutes + c.minutes > budget) {
      day += 1; dayMinutes = 0; onThisDay = 0;
    }
    if (day > maxDays) break; // the week is full; the rest waits for next week
    steps.push({ ...c, id: uid(), day });
    dayMinutes += c.minutes;
    onThisDay += 1;
  }

  // The closing measurement is never trimmed — it goes on its own day when
  // there is room, otherwise onto the last day of the week.
  const lastDay = steps.length > 0 ? steps[steps.length - 1].day : 1;
  const closingDay = lastDay < maxDays && steps.length > 0 ? lastDay + 1 : lastDay;
  steps.push({ ...closing, id: uid(), day: closingDay });

  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    steps,
    focusEraId: signals.focusEraId,
    // Report the days actually used, not the ceiling we were allowed.
    days: Math.max(...steps.map(s => s.day)),
    budgetMinutes: budget,
    mode: signals.mode,
    modeReason: signals.modeReason,
  };
}

// ─── Plan health: noticing when a saved plan has stopped being the right one ──

export type PlanStaleReason = 'complete' | 'expired' | 'focus-moved';

export interface PlanHealth {
  ageDays: number;
  doneCount: number;
  totalCount: number;
  /** Era the plan targets — recovered from the steps for plans saved earlier. */
  focusEraId: EraId | null;
  /** Where the focus has moved to, when it has. */
  currentFocusEraId: EraId;
  stale: boolean;
  reasons: PlanStaleReason[];
}

/** Plans older than this have outlived the week they were scheduling. */
const PLAN_EXPIRY_DAYS = 9;

/**
 * A saved plan is a snapshot of a moment, and the learner keeps moving. This
 * reports when the snapshot has gone out of date so the page can say so instead
 * of presenting three-week-old homework as this week's plan.
 */
export function planHealth(
  plan: WeekPlan,
  completion: Record<string, boolean>,
  currentFocusEraId: EraId,
): PlanHealth {
  const totalCount = plan.steps.length;
  const doneCount = plan.steps.filter(s => completion[s.id]).length;
  const created = Date.parse(plan.createdAt);
  const ageDays = Number.isFinite(created) ? Math.floor((Date.now() - created) / 86400000) : 0;
  const focusEraId = plan.focusEraId ?? plan.steps.find(s => s.eraId)?.eraId ?? null;

  const reasons: PlanStaleReason[] = [];
  if (totalCount > 0 && doneCount === totalCount) reasons.push('complete');
  if (ageDays >= PLAN_EXPIRY_DAYS) reasons.push('expired');
  if (focusEraId !== null && focusEraId !== currentFocusEraId) reasons.push('focus-moved');

  return { ageDays, doneCount, totalCount, focusEraId, currentFocusEraId, stale: reasons.length > 0, reasons };
}

// ─── AI decoration ────────────────────────────────────────────────────────────

import { LANG_NAMES } from '@/services/aiLanguage';
const KIND_LABEL: Record<StepKind, string> = {
  lesson: 'lesson', 'era-quiz': 'era quiz', 'smart-quiz': 'adaptive quiz',
  flashcards: 'flashcard review', studio: 'content studio', crisis: 'crisis simulation', 'timeline-map': 'territory map exploration',
};

const MODE_BRIEF: Record<FocusMode, string> = {
  coverage: 'The week is weighted towards new lessons because most of the focus era is still unread.',
  retention: 'The week is weighted towards retrieval practice — flashcards and quizzes — because the material has been read but is not being recalled. Do NOT tell them to read more.',
  balanced: 'Reading and recall are roughly in step, so the week alternates between the two.',
};

export function buildPlanNotesPrompt(
  mastery: MasterySnapshot,
  plan: WeekPlan,
  language: string,
  master: boolean,
  signals?: LearnerSignals,
): string {
  const langName = LANG_NAMES[language] ?? 'English';
  const eraName = (id: EraId) => ERAS.find(e => e.id === id)?.name ?? id;
  const masteryLines = mastery.eras
    .map(e => `- ${eraName(e.eraId)}: mastery ${e.mastery}% (lessons ${e.lessonsDone}/${e.lessonsTotal}${e.quizPct !== null ? `, quiz ${e.quizPct}%` : ''}${e.adaptivePct !== null ? `, adaptive ${Math.round(e.adaptivePct)}%` : ''})`)
    .join('\n');
  const stepLines = plan.steps
    .map(s => {
      const lesson = s.lessonId ? LESSONS.find(l => l.id === s.lessonId) : undefined;
      return `- day ${s.day}: ${KIND_LABEL[s.kind]}${lesson ? ` — "${lesson.title}"` : s.eraId ? ` (${eraName(s.eraId)})` : ''} (${s.minutes} min)`;
    })
    .join('\n');
  return `OUTPUT LANGUAGE: ${langName}. Every string you produce — weekTheme, coachNote, every dayNote${master ? ', deepAnalysis' : ''} — MUST be written in natural, idiomatic ${langName}. This applies even though this prompt and the data below are in English.

You are Clio, an expert history mentor. A student's week of study has already been scheduled by the app. Your job is ONLY to motivate and explain it — do not propose different activities.

STUDENT MASTERY:
${masteryLines}
Overall: ${mastery.overall}%. Streak: ${mastery.streak} days.
${signals ? `
HOW THIS STUDENT ACTUALLY STUDIES (measured, not estimated — use these numbers, do not invent others):
- Studied on ${signals.activeDaysLast14} of the last 14 days.
- Typical session: ${signals.fresh ? 'no sessions recorded yet' : `about ${signals.medianSessionMinutes} minutes`}.
- ${signals.daysSinceActivity === null ? 'No activity recorded yet.' : `Last active ${signals.daysSinceActivity} day(s) ago.`}
- This week is scheduled as ${plan.days ?? 7} study days of roughly ${plan.budgetMinutes ?? 20} minutes.${signals.returning ? `
- They are returning after a break, so the week opens with review rather than new material. Acknowledge the return warmly and briefly; do not scold the gap.` : ''}
WHY THE WEEK IS SHAPED THIS WAY: ${MODE_BRIEF[signals.mode]}
` : ''}
SCHEDULED WEEK:
${stepLines}

Produce:
- weekTheme: a 3–6 word motto for this week's focus.
- coachNote: 2–3 sentences: why this week targets what it targets, tied to their actual numbers.
- dayNotes: for each scheduled day, ONE short sentence of rationale or a concrete tip for that day's activity.${master ? `
- deepAnalysis: a paragraph (4–5 sentences) reading the pattern in their mastery data — which signal lags (coverage vs quizzes vs adaptive accuracy), what that says about how they study${signals ? ', how their measured study cadence above reinforces or fights that pattern' : ''}, and the single highest-leverage habit change.` : ''}

FINAL LANGUAGE CHECK: every JSON string value must be in ${langName} — rewrite any that is not before answering. Plain text only, no markdown. Respond ONLY with JSON, no fences:
{ "weekTheme": "...", "coachNote": "...", "dayNotes": { "1": "...", "2": "..." }${master ? ', "deepAnalysis": "..."' : ''} }`;
}

export function parsePlanNotes(raw: string): AiPlanNotes | null {
  // Repair stray CJK characters welded into Cyrillic or Latin words before
  // anything downstream reads them. The deep model is the real fix; this is the
  // net under it, applied at the funnel so no call site can forget.
  raw = stripWeldedScripts(raw);
  let p: Record<string, unknown>;
  try { p = safeJsonParse<Record<string, unknown>>(raw); } catch { return null; }
  const weekTheme = typeof p.weekTheme === 'string' ? p.weekTheme.trim() : '';
  const coachNote = typeof p.coachNote === 'string' ? p.coachNote.trim() : '';
  if (!weekTheme || !coachNote) return null;
  const dayNotes: Record<number, string> = {};
  if (p.dayNotes && typeof p.dayNotes === 'object') {
    for (const [k, v] of Object.entries(p.dayNotes as Record<string, unknown>)) {
      const day = Number(k);
      if (Number.isInteger(day) && day >= 1 && day <= 7 && typeof v === 'string' && v.trim()) dayNotes[day] = v.trim();
    }
  }
  return {
    weekTheme, coachNote, dayNotes,
    deepAnalysis: typeof p.deepAnalysis === 'string' && p.deepAnalysis.trim() ? p.deepAnalysis.trim() : undefined,
  };
}
