// ─── Week-plan persistence + automatic completion sync ────────────────────────
// The stored plan is inert data; completion state is derived fresh on every
// read by cross-checking real progress: lessons check themselves off when the
// lesson is completed, era quizzes when a score lands, Smart Quiz steps when
// sessions are recorded after the plan was created. Kinds with no automatic
// signal (flashcards, studio, crisis, map) use a manual checkbox persisted on
// the step itself.
import { loadProgress } from '@/features/progress/progressStore';
import { getSmartQuizStats } from '@/features/smartQuiz/smartQuizStats';
import { ERAS } from '@/features/content/erasData';
import type { PlanStep, WeekPlan } from './planEngine';

const KEY = (uid: string) => `historify:learningPlan:${uid}`;

export function loadWeekPlan(userId: string): WeekPlan | null {
  try {
    const raw = localStorage.getItem(KEY(userId));
    const plan = raw ? (JSON.parse(raw) as WeekPlan) : null;
    return plan && Array.isArray(plan.steps) ? plan : null;
  } catch { return null; }
}

export function saveWeekPlan(userId: string, plan: WeekPlan) {
  try { localStorage.setItem(KEY(userId), JSON.stringify(plan)); } catch { /* best-effort */ }
}

export function clearWeekPlan(userId: string) {
  try { localStorage.removeItem(KEY(userId)); } catch { /* ignore */ }
}

export function toggleManualStep(userId: string, stepId: string) {
  const plan = loadWeekPlan(userId);
  if (!plan) return;
  const step = plan.steps.find(s => s.id === stepId);
  if (!step) return;
  step.manualDone = !step.manualDone;
  saveWeekPlan(userId, plan);
}

/** Derived, always-fresh completion state for every step of the plan. */
export function stepCompletion(userId: string, plan: WeekPlan): Record<string, boolean> {
  const prog = loadProgress(userId);
  const done: Record<string, boolean> = {};
  // Smart Quiz steps complete in order as sessions land after plan creation.
  const sessionsSincePlan = getSmartQuizStats(userId).sessions
    .filter(s => Date.parse(s.date) >= Date.parse(plan.createdAt)).length;
  let smartQuizSeen = 0;

  for (const step of plan.steps) {
    switch (step.kind) {
      case 'lesson':
        done[step.id] = Boolean(step.lessonId && prog.completedLessons.includes(step.lessonId));
        break;
      case 'era-quiz': {
        const era = ERAS.find(e => e.id === step.eraId);
        // A retake step counts once any score ≥70 exists, or the quiz was
        // (re)taken after the plan started — approximated by any recorded score.
        done[step.id] = Boolean(era && typeof prog.quizScores[era.quizId] === 'number' && prog.quizScores[era.quizId] >= 70)
          || Boolean(step.manualDone);
        break;
      }
      case 'smart-quiz':
        smartQuizSeen += 1;
        done[step.id] = smartQuizSeen <= sessionsSincePlan || Boolean(step.manualDone);
        break;
      default:
        done[step.id] = Boolean(step.manualDone);
    }
  }
  return done;
}

/** True when a step's completion has no automatic signal (checkbox shown). */
export function isManualKind(step: PlanStep): boolean {
  return step.kind === 'flashcards' || step.kind === 'studio' || step.kind === 'crisis' || step.kind === 'timeline-map';
}
