// ─── Clio Study Plan: premium post-session recommendation engine ──────────────
// Replaces the free-text recommendation with a structured, grounded plan: the
// model sees the student's ACTUAL missed questions and the real lesson catalog
// for their weak eras, and must answer in strict JSON — a diagnosis, a
// three-step plan pointing at real lessons (rendered as clickable chips), a
// score forecast, and (Master only) a misconception analysis of the error
// pattern. Every field is validated before rendering.
import { safeJsonParse } from '@/lib/safeJsonParse';
import { LESSONS } from '@/features/content/lessonsData';

export interface StudyPlanStep {
  action: string;        // what to do, one sentence
  lessonId?: string;     // real lesson id when the step points at a lesson
  lessonTitle?: string;
  minutes: number;       // realistic time budget
}

export interface StudyPlan {
  headline: string;                                  // precise, encouraging opener
  diagnosis: string;                                 // 2 sentences on the weakness pattern
  focusEras: { era: string; reason: string }[];      // 1–2
  steps: StudyPlanStep[];                            // exactly 3
  forecast: string;                                  // predicted next-session outcome
  mentorInsight: string;                             // closing historical insight
  masterAnalysis?: string;                           // Master only: misconception dissection
}

export interface MissedQuestion { question: string; eraName: string; chosen: string; correct: string }

const LANG_NAMES: Record<string, string> = { en: 'English', es: 'Spanish', ru: 'Russian', mk: 'Macedonian' };

export function buildStudyPlanPrompt(args: {
  score: number;
  breakdown: { name: string; correct: number; total: number }[];
  missed: MissedQuestion[];
  weakEraIds: string[];
  language: string;
  master: boolean;
}): string {
  const { score, breakdown, missed, weakEraIds, language, master } = args;
  const langName = LANG_NAMES[language] ?? 'English';
  const catalog = LESSONS
    .filter(l => weakEraIds.length === 0 || weakEraIds.includes(l.eraId))
    .map(l => `- id "${l.id}": ${l.title} (${l.estimatedMinutes} min)`)
    .join('\n');
  const missedLines = missed.slice(0, 8)
    .map(m => `- [${m.eraName}] "${m.question}" — answered "${m.chosen}", correct was "${m.correct}"`)
    .join('\n');
  return `You are Clio, an expert history mentor producing a personalized study plan after an adaptive quiz session.

SESSION SCORE: ${score}%.
ERA BREAKDOWN: ${breakdown.map(e => `${e.name} ${e.correct}/${e.total}`).join(', ')}.
MISSED QUESTIONS:
${missedLines || '(none — a flawless session)'}
AVAILABLE LESSONS (recommend ONLY from this catalog, using exact ids):
${catalog}

Produce:
- headline: one sentence acknowledging the exact score and the strongest specific thing they did.
- diagnosis: two sentences identifying the PATTERN behind the misses (concepts, not just era names).
- focusEras: 1–2 entries, each { "era": era name, "reason": one specific sentence }.
- steps: EXACTLY 3 study steps. Each { "action": one imperative sentence, "lessonId": an exact id from the catalog when the step is a lesson (omit otherwise), "lessonTitle": its title, "minutes": realistic integer }. At least 2 steps must reference catalog lessons.
- forecast: one sentence predicting their realistic next-session score range if they follow the plan.
- mentorInsight: one closing sentence connecting their weak area to why it matters historically.${master ? `
- masterAnalysis: a short paragraph (3–4 sentences) dissecting the misconception pattern across their wrong answers — what they consistently confuse and the mental model that fixes it.` : ''}

IMPORTANT: Write ALL text fields in ${langName}. Plain text only, no markdown.

Respond ONLY with JSON in exactly this shape (no fences, no extra text):
{
  "headline": "...",
  "diagnosis": "...",
  "focusEras": [{ "era": "...", "reason": "..." }],
  "steps": [{ "action": "...", "lessonId": "ancient-02", "lessonTitle": "...", "minutes": 15 }],
  "forecast": "...",
  "mentorInsight": "..."${master ? `,
  "masterAnalysis": "..."` : ''}
}`;
}

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const validLessonId = (id: unknown): string | undefined =>
  typeof id === 'string' && LESSONS.some(l => l.id === id) ? id : undefined;

export function parseStudyPlan(raw: string): StudyPlan | null {
  let p: Record<string, unknown>;
  try { p = safeJsonParse<Record<string, unknown>>(raw); } catch { return null; }
  const headline = str(p.headline);
  const diagnosis = str(p.diagnosis);
  if (!headline || !diagnosis) return null;
  const focusEras = Array.isArray(p.focusEras)
    ? p.focusEras
        .map(f => ({ era: str((f as Record<string, unknown>)?.era), reason: str((f as Record<string, unknown>)?.reason) }))
        .filter(f => f.era).slice(0, 2)
    : [];
  const steps: StudyPlanStep[] = Array.isArray(p.steps)
    ? p.steps
        .map(s0 => {
          const s = s0 as Record<string, unknown>;
          const lessonId = validLessonId(s?.lessonId);
          return {
            action: str(s?.action),
            lessonId,
            lessonTitle: lessonId ? (str(s?.lessonTitle) || LESSONS.find(l => l.id === lessonId)?.title) : undefined,
            minutes: typeof s?.minutes === 'number' && Number.isFinite(s.minutes) ? Math.max(5, Math.min(60, Math.round(s.minutes))) : 15,
          };
        })
        .filter(s => s.action).slice(0, 3)
    : [];
  if (steps.length === 0) return null;
  return {
    headline,
    diagnosis,
    focusEras,
    steps,
    forecast: str(p.forecast),
    mentorInsight: str(p.mentorInsight),
    masterAnalysis: str(p.masterAnalysis) || undefined,
  };
}
