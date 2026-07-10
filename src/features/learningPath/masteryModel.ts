// ─── Mastery model: deterministic per-era competence scoring ─────────────────
// Computes a 0–100 mastery score for each era from three independent signals,
// re-weighted when a signal is missing so a new student is never punished for
// data they can't have yet:
//   • lesson coverage (40%) — share of the era's lessons completed
//   • era quiz score  (35%) — best score on the era's summative quiz
//   • adaptive accuracy (25%) — per-era accuracy across recent Smart Quiz runs
// Pure functions over existing stores; nothing here is cached or persisted, so
// the numbers can never drift from the underlying progress data.
import { loadProgress } from '@/features/progress/progressStore';
import { getSmartQuizStats } from '@/features/smartQuiz/smartQuizStats';
import { ERAS } from '@/features/content/erasData';
import { LESSONS } from '@/features/content/lessonsData';
import type { EraId, Lesson } from '@/types';

export interface EraMastery {
  eraId: EraId;
  lessonsDone: number;
  lessonsTotal: number;
  quizPct: number | null;        // best era-quiz score, if attempted
  adaptivePct: number | null;    // Smart Quiz accuracy in this era, if enough data
  mastery: number;               // 0–100 blended score
}

export interface MasterySnapshot {
  eras: EraMastery[];            // ordered as ERAS
  weakest: EraMastery;
  strongest: EraMastery;
  overall: number;               // mean of era masteries
  streak: number;
  daysSinceActivity: number | null;
}

const WEIGHTS = { coverage: 0.40, quiz: 0.35, adaptive: 0.25 } as const;

export function computeMastery(userId: string): MasterySnapshot {
  const prog = loadProgress(userId);
  const stats = getSmartQuizStats(userId);

  // Aggregate recent Smart Quiz accuracy per era (last 10 sessions).
  const eraAcc: Record<string, { correct: number; total: number }> = {};
  for (const s of stats.sessions.slice(-10)) {
    for (const [era, b] of Object.entries(s.eraBreakdown)) {
      const acc = (eraAcc[era] ??= { correct: 0, total: 0 });
      acc.correct += b.correct; acc.total += b.total;
    }
  }

  const eras: EraMastery[] = ERAS.map(era => {
    const eraLessons = LESSONS.filter(l => l.eraId === era.id);
    const lessonsDone = eraLessons.filter(l => prog.completedLessons.includes(l.id)).length;
    const coveragePct = eraLessons.length > 0 ? (lessonsDone / eraLessons.length) * 100 : 0;
    const quizPct = typeof prog.quizScores[era.quizId] === 'number' ? prog.quizScores[era.quizId] : null;
    const acc = eraAcc[era.id];
    const adaptivePct = acc && acc.total >= 4 ? (acc.correct / acc.total) * 100 : null;

    // Re-normalize weights across the signals that actually exist.
    const parts: { w: number; v: number }[] = [{ w: WEIGHTS.coverage, v: coveragePct }];
    if (quizPct !== null) parts.push({ w: WEIGHTS.quiz, v: quizPct });
    if (adaptivePct !== null) parts.push({ w: WEIGHTS.adaptive, v: adaptivePct });
    const wSum = parts.reduce((a, p) => a + p.w, 0);
    const mastery = Math.round(parts.reduce((a, p) => a + p.v * (p.w / wSum), 0));

    return { eraId: era.id, lessonsDone, lessonsTotal: eraLessons.length, quizPct, adaptivePct, mastery };
  });

  const sorted = [...eras].sort((a, b) => a.mastery - b.mastery);
  const daysSinceActivity = prog.lastActivityDate
    ? Math.floor((Date.now() - Date.parse(prog.lastActivityDate)) / 86400000)
    : null;

  return {
    eras,
    weakest: sorted[0],
    strongest: sorted[sorted.length - 1],
    overall: Math.round(eras.reduce((a, e) => a + e.mastery, 0) / eras.length),
    streak: prog.streak,
    daysSinceActivity,
  };
}

/** The era's uncompleted lessons a student can actually access, in order. */
export function nextLessonsForEra(userId: string, eraId: EraId, canLesson: (order: number) => boolean): Lesson[] {
  const prog = loadProgress(userId);
  return LESSONS
    .filter(l => l.eraId === eraId && !prog.completedLessons.includes(l.id) && canLesson(l.order))
    .sort((a, b) => a.order - b.order);
}
