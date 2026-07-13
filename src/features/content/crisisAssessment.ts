// ─── Chronos Strategic Assessment ─────────────────────────────────────────────
// Premium end-of-run grading for the Crisis Room. Where Video Review and the
// Essay Challenge grade a single artifact, this grades an entire command run:
// the full decision log, risk profile, and final resource vector are scored
// across five command dimensions, sealed with a letter grade, a commander
// title, and a counterfactual comparing the player's timeline with what
// actually happened. One strict-JSON AI call; everything is validated and
// clamped before rendering, and XP is banked once per concluded run.
import { safeJsonParse } from '@/lib/safeJsonParse';
import type { CrisisScenario } from './crisisScenarios';
import type { CrisisRunState } from './crisisEngine';

export interface AssessmentMetric {
  score: number;        // 0–100
  feedback: string;     // one specific observation about THIS run
}

export const ASSESSMENT_METRIC_KEYS = [
  'strategicForesight',
  'historicalJudgment',
  'resourceStewardship',
  'decisiveness',
  'adaptability',
] as const;
export type AssessmentMetricKey = (typeof ASSESSMENT_METRIC_KEYS)[number];

export type LetterGrade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface CrisisAssessment {
  metrics: Record<AssessmentMetricKey, AssessmentMetric>;
  overallScore: number;          // 0–100
  grade: LetterGrade;
  commanderTitle: string;        // e.g. "The Cautious Diplomat"
  strengths: string[];           // 2–3
  improvements: string[];        // 2–3
  counterfactual: string;        // what history actually did vs this run
  epitaph: string;               // one-line verdict for the run
  xpAwarded: number;             // XP banked when this assessment was first sealed
}

const LANG_NAMES: Record<string, string> = { en: 'English', es: 'Spanish', ru: 'Russian', mk: 'Macedonian', de: 'German', fr: 'French' };

export function buildAssessmentPrompt(scenario: CrisisScenario, run: CrisisRunState, language: string): string {
  const langName = LANG_NAMES[language] ?? 'English';
  const log = run.decisionHistory
    .map(d => `Turn ${d.step}: [${d.optionId}] ${d.text}${d.revealedConsequence ? ` → consequence: ${d.revealedConsequence}` : ''}`)
    .join('\n');
  const r = run.resources;
  return `You are the Chronos Tribunal — a panel of master historians and strategists delivering a formal post-crisis assessment of a commander's full run.

SCENARIO: ${scenario.title} (${scenario.yearLabel}) — the player commanded as ${scenario.role}.
OBJECTIVES: ${scenario.objectives.join('; ')}
DECISION LOG:
${log || '(no decisions were made)'}
FINAL RESOURCE VECTOR: diplomatic capital ${r.diplomaticCapital}%, domestic stability ${r.domesticStability}%, military readiness ${r.militaryReadiness}%, treasury ${r.treasury}%.

Grade the run strictly and fairly across five command dimensions (0–100 each):
- strategicForesight: did decisions anticipate second-order consequences?
- historicalJudgment: were choices plausible within the period's real constraints?
- resourceStewardship: how well were the four resource meters managed?
- decisiveness: clarity, timeliness and risk calibration of the choices made.
- adaptability: how well did the commander adjust after setbacks and revealed consequences?

Also produce: an overallScore (0–100, a weighted judgement, not an average), a letter grade ("S" only for near-flawless legendary runs, then "A"–"D"), a short evocative commanderTitle for this play style, 2–3 strengths, 2–3 improvements, a counterfactual paragraph (3–4 sentences) contrasting the player's timeline with what the real historical actors did and what followed, and a single-sentence epitaph for the run.

IMPORTANT: Write ALL text fields in ${langName}. Use plain text only — no markdown syntax anywhere.

Respond ONLY with this exact JSON shape (no markdown fences, no extra text):
{
  "metrics": {
    "strategicForesight":  { "score": 0, "feedback": "..." },
    "historicalJudgment":  { "score": 0, "feedback": "..." },
    "resourceStewardship": { "score": 0, "feedback": "..." },
    "decisiveness":        { "score": 0, "feedback": "..." },
    "adaptability":        { "score": 0, "feedback": "..." }
  },
  "overallScore": 0,
  "grade": "B",
  "commanderTitle": "...",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "counterfactual": "...",
  "epitaph": "..."
}`;
}

const clamp = (n: unknown): number =>
  typeof n === 'number' && Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0;
const str = (s: unknown): string => (typeof s === 'string' ? s.trim() : '');
const strList = (v: unknown, max: number): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).slice(0, max) : [];

/** Parse + coerce the tribunal's raw output; null when unusable. */
export function parseAssessment(raw: string): Omit<CrisisAssessment, 'xpAwarded'> | null {
  let parsed: Record<string, unknown>;
  try { parsed = safeJsonParse<Record<string, unknown>>(raw); } catch { return null; }
  const rawMetrics = parsed.metrics as Record<string, unknown> | undefined;
  if (!rawMetrics || typeof rawMetrics !== 'object') return null;
  const metrics = {} as Record<AssessmentMetricKey, AssessmentMetric>;
  for (const key of ASSESSMENT_METRIC_KEYS) {
    const m = rawMetrics[key] as { score?: unknown; feedback?: unknown } | undefined;
    if (!m || typeof m !== 'object') return null;
    metrics[key] = { score: clamp(m.score), feedback: str(m.feedback) };
  }
  const grade = str(parsed.grade).toUpperCase();
  return {
    metrics,
    overallScore: clamp(parsed.overallScore),
    grade: (['S', 'A', 'B', 'C', 'D'].includes(grade) ? grade : 'C') as LetterGrade,
    commanderTitle: str(parsed.commanderTitle),
    strengths: strList(parsed.strengths, 3),
    improvements: strList(parsed.improvements, 3),
    counterfactual: str(parsed.counterfactual),
    epitaph: str(parsed.epitaph),
  };
}

/** XP for a sealed assessment: up to 100, Master's Crisis Room premium. */
export function assessmentXp(overallScore: number): number {
  return Math.round(clamp(overallScore) * 0.75);
}

// ── Persistence: one sealed assessment per scenario per user ────────────────
const KEY = 'historify:crisis:assessment:';

export function loadAssessment(scenarioId: string, userId?: string): CrisisAssessment | null {
  try {
    const raw = localStorage.getItem(KEY + scenarioId + (userId ? `:${userId}` : ''));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CrisisAssessment;
    return parsed && parsed.metrics ? parsed : null;
  } catch { return null; }
}

export function saveAssessment(a: CrisisAssessment, scenarioId: string, userId?: string) {
  try { localStorage.setItem(KEY + scenarioId + (userId ? `:${userId}` : ''), JSON.stringify(a)); } catch { /* best-effort */ }
}

export function clearAssessment(scenarioId: string, userId?: string) {
  try { localStorage.removeItem(KEY + scenarioId + (userId ? `:${userId}` : '')); } catch { /* best-effort */ }
}
