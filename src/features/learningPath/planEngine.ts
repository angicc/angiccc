// ─── Learning-path plan engine ────────────────────────────────────────────────
// Two-layer design: a DETERMINISTIC generator builds the week — real lesson
// ids, real routes, sensible pacing driven by the mastery model — and the AI
// layer only decorates it (coach note, weekly theme, per-day rationale,
// Master-tier deep analysis). The plan a student follows can therefore never
// point at a hallucinated lesson or a broken route, even if the AI response is
// garbage: parsing failures simply leave the plan undecorated.
import { safeJsonParse } from '@/lib/safeJsonParse';
import { LESSONS } from '@/features/content/lessonsData';
import { ERAS } from '@/features/content/erasData';
import type { EraId } from '@/types';
import type { MasterySnapshot } from './masteryModel';

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

/**
 * Deterministic weekly plan from the mastery snapshot. Strategy: hammer the
 * weakest era with lessons early in the week, consolidate with adaptive
 * quizzing mid-week, close the loop with the era quiz once enough new
 * material has landed, and keep one variety day so the week never feels like
 * a grind.
 */
export function generateWeekPlan(
  mastery: MasterySnapshot,
  uncompletedByEra: (eraId: EraId) => { id: string; eraId: EraId; estimatedMinutes: number }[],
): WeekPlan {
  const byWeakness = [...mastery.eras].sort((a, b) => a.mastery - b.mastery);
  const weakest = byWeakness[0];
  const second = byWeakness[1];

  const weakestLessons = uncompletedByEra(weakest.eraId);
  const secondLessons = second ? uncompletedByEra(second.eraId) : [];
  const steps: PlanStep[] = [];
  let li = 0;

  const pushLesson = (day: number, pool: { id: string; eraId: EraId; estimatedMinutes: number }[], poolIdx: number) => {
    const lesson = pool[poolIdx];
    if (!lesson) return false;
    steps.push({ id: uid(), day, kind: 'lesson', lessonId: lesson.id, eraId: lesson.eraId, minutes: lesson.estimatedMinutes });
    return true;
  };

  // Day 1 — first gap in the weakest era.
  if (!pushLesson(1, weakestLessons, li)) {
    // era fully covered → reinforce with the era quiz instead
    steps.push({ id: uid(), day: 1, kind: 'era-quiz', eraId: weakest.eraId, minutes: 10 });
  } else { li += 1; }

  // Day 2 — adaptive consolidation.
  steps.push({ id: uid(), day: 2, kind: 'smart-quiz', minutes: 10 });

  // Day 3 — second lesson (weakest era if available, else second-weakest).
  if (pushLesson(3, weakestLessons, li)) li += 1;
  else pushLesson(3, secondLessons, 0);
  steps.push({ id: uid(), day: 3, kind: 'flashcards', minutes: 8 });

  // Day 4 — push the weakest era once more, or broaden.
  if (pushLesson(4, weakestLessons, li)) li += 1;
  else if (!pushLesson(4, secondLessons, 1)) {
    steps.push({ id: uid(), day: 4, kind: 'timeline-map', eraId: weakest.eraId, minutes: 12 });
  }

  // Day 5 — close the loop: era quiz for the weakest era (retake counts if <70).
  if (weakest.quizPct === null || weakest.quizPct < 70) {
    steps.push({ id: uid(), day: 5, kind: 'era-quiz', eraId: weakest.eraId, minutes: 12 });
  } else {
    steps.push({ id: uid(), day: 5, kind: 'smart-quiz', minutes: 10 });
  }

  // Day 6 — variety day: immersive surfaces.
  steps.push({ id: uid(), day: 6, kind: mastery.overall >= 40 ? 'crisis' : 'timeline-map', eraId: weakest.eraId, minutes: 15 });

  // Day 7 — measure the week's effect.
  steps.push({ id: uid(), day: 7, kind: 'smart-quiz', minutes: 10 });

  return { id: uid(), createdAt: new Date().toISOString(), steps };
}

// ─── AI decoration ────────────────────────────────────────────────────────────

const LANG_NAMES: Record<string, string> = { en: 'English', es: 'Spanish', ru: 'Russian', mk: 'Macedonian', de: 'German', fr: 'French' };
const KIND_LABEL: Record<StepKind, string> = {
  lesson: 'lesson', 'era-quiz': 'era quiz', 'smart-quiz': 'adaptive quiz',
  flashcards: 'flashcard review', studio: 'content studio', crisis: 'crisis simulation', 'timeline-map': 'territory map exploration',
};

export function buildPlanNotesPrompt(mastery: MasterySnapshot, plan: WeekPlan, language: string, master: boolean): string {
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

SCHEDULED WEEK:
${stepLines}

Produce:
- weekTheme: a 3–6 word motto for this week's focus.
- coachNote: 2–3 sentences: why this week targets what it targets, tied to their actual numbers.
- dayNotes: for each scheduled day, ONE short sentence of rationale or a concrete tip for that day's activity.${master ? `
- deepAnalysis: a paragraph (4–5 sentences) reading the pattern in their mastery data — which signal lags (coverage vs quizzes vs adaptive accuracy), what that says about how they study, and the single highest-leverage habit change.` : ''}

FINAL LANGUAGE CHECK: every JSON string value must be in ${langName} — rewrite any that is not before answering. Plain text only, no markdown. Respond ONLY with JSON, no fences:
{ "weekTheme": "...", "coachNote": "...", "dayNotes": { "1": "...", "2": "..." }${master ? ', "deepAnalysis": "..."' : ''} }`;
}

export function parsePlanNotes(raw: string): AiPlanNotes | null {
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
