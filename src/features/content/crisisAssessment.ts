// ─── Chronos Strategic Assessment ─────────────────────────────────────────────
// Premium end-of-run grading for the Crisis Room. Where Video Review and the
// Essay Challenge grade a single artifact, this grades an entire command run:
// the full decision log, risk profile, and final resource vector are scored
// across five command dimensions, sealed with a letter grade, a commander
// title, and a counterfactual comparing the player's timeline with what
// actually happened. One strict-JSON AI call; everything is validated and
// clamped before rendering, and XP is banked once per concluded run.
import { safeJsonParse } from '@/lib/safeJsonParse';
import { stripWeldedScripts } from '@/services/sanitizeAiText';
import { languageDirective } from '@/services/aiLanguage';
import type { Language } from '@/i18n/translations';
import {
  getCrisisTitle, getCrisisRole, getCrisisObjectives, getCrisisYearLabel,
} from '@/features/content/crisisScenarios';
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

export function buildAssessmentPrompt(scenario: CrisisScenario, run: CrisisRunState, language: string): string {
  const log = run.decisionHistory
    .map(d => `Turn ${d.step}: [${d.optionId}] ${d.text}${d.revealedConsequence ? ` → consequence: ${d.revealedConsequence}` : ''}`)
    .join('\n');
  const r = run.resources;
  const lang = language as Language;
  // The scenario as the player read it, not the English original. The decision
  // log is already in their language; mixing an English scenario into it was
  // half the reason the verdict came back in English.
  return `You are the Chronos Tribunal — a panel of master historians and strategists delivering a formal post-crisis assessment of a commander's full run.

SCENARIO: ${getCrisisTitle(scenario, lang)} (${getCrisisYearLabel(scenario, lang)}) — the player commanded as ${getCrisisRole(scenario, lang)}.
OBJECTIVES: ${getCrisisObjectives(scenario, lang).join('; ')}
DECISION LOG:
${log || '(no decisions were made)'}
FINAL RESOURCE VECTOR: diplomatic capital ${r.diplomaticCapital}%, domestic stability ${r.domesticStability}%, military readiness ${r.militaryReadiness}%, treasury ${r.treasury}%.

Grade the run strictly and fairly across five command dimensions (0–100 each):
- strategicForesight: did decisions anticipate second-order consequences?
- historicalJudgment: were choices plausible within the period's real constraints?
- resourceStewardship: how well were the four resource meters managed?
- decisiveness: clarity, timeliness and risk calibration of the choices made.
- adaptability: how well did the commander adjust after setbacks and revealed consequences?

Also produce: an overallScore (0–100, a weighted judgement, not an average), a letter grade ("S" only for near-flawless legendary runs, then "A"–"D"), a short evocative commanderTitle for this play style, a counterfactual paragraph (3–4 sentences) contrasting the player's timeline with what the real historical actors did and what followed, and a single-sentence epitaph for the run.

You MUST return at least 2 "strengths" AND at least 2 "improvements" — neither list may ever be empty. If the run was flawless, frame the improvements as ways to push from great to legendary; if it was a disaster, still credit at least two genuine strengths. Both lists are required, always.

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
}

IMPORTANT — LANGUAGE OF EVERY STRING VALUE ABOVE:
The JSON keys stay exactly as written in English. Every human-readable VALUE —
each feedback line, commanderTitle, every entry of strengths and improvements,
counterfactual and epitaph — must be written in the language below. The English
in this prompt is instruction, not a sample of the language to answer in.
${languageDirective(language)}`;
}

const clamp = (n: unknown): number =>
  typeof n === 'number' && Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0;
const str = (s: unknown): string => (typeof s === 'string' ? s.trim() : '');
const strList = (v: unknown, max: number): string[] => {
  // Tolerate a single string where a list is expected (the model occasionally
  // returns one strength/improvement as a bare string instead of an array).
  const arr = Array.isArray(v) ? v : typeof v === 'string' ? [v] : [];
  return arr
    .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    .map(s => s.trim())
    .slice(0, max);
};

/** Parse + coerce the tribunal's raw output; null only when genuinely unusable.
 *  Resilience: smaller models (and long Cyrillic/Macedonian runs) sometimes drop
 *  a single metric, nest it loosely, or omit feedback. Nuking the whole verdict
 *  on any such gap is what surfaced to the player as an "unreadable verdict" that
 *  blanked out Strengths & Improvements. Instead a missing metric is defaulted
 *  from the overall score so a partial-but-real assessment still renders; we bail
 *  out only when the output carries no usable signal whatsoever. */
export function parseAssessment(raw: string): Omit<CrisisAssessment, 'xpAwarded'> | null {
  // Repair stray CJK characters welded into Cyrillic or Latin words before
  // anything downstream reads them. The deep model is the real fix; this is the
  // net under it, applied at the funnel so no call site can forget.
  raw = stripWeldedScripts(raw);
  let parsed: Record<string, unknown>;
  try { parsed = safeJsonParse<Record<string, unknown>>(raw); } catch { return null; }
  if (!parsed || typeof parsed !== 'object') return null;

  const rawMetrics = (parsed.metrics && typeof parsed.metrics === 'object')
    ? (parsed.metrics as Record<string, unknown>)
    : {};
  const overall = clamp(parsed.overallScore);

  const metrics = {} as Record<AssessmentMetricKey, AssessmentMetric>;
  let metricsPresent = 0;
  for (const key of ASSESSMENT_METRIC_KEYS) {
    const m = rawMetrics[key] as { score?: unknown; feedback?: unknown } | undefined;
    if (m && typeof m === 'object') {
      metrics[key] = { score: clamp(m.score), feedback: str(m.feedback) };
      metricsPresent++;
    } else {
      // Missing metric → fall back to the overall score with empty feedback so
      // the radar/bars still render rather than the entire tribunal failing.
      metrics[key] = { score: overall, feedback: '' };
    }
  }

  const strengths = strList(parsed.strengths, 3);
  const improvements = strList(parsed.improvements, 3);
  const commanderTitle = str(parsed.commanderTitle);
  const counterfactual = str(parsed.counterfactual);
  const epitaph = str(parsed.epitaph);

  // Genuine-garbage guard: no metrics, no score, and no textual verdict at all.
  const hasSignal =
    metricsPresent > 0 || overall > 0 || strengths.length > 0 ||
    improvements.length > 0 || !!commanderTitle || !!counterfactual || !!epitaph;
  if (!hasSignal) return null;

  const grade = str(parsed.grade).toUpperCase();
  return {
    metrics,
    overallScore: overall,
    grade: (['S', 'A', 'B', 'C', 'D'].includes(grade) ? grade : 'C') as LetterGrade,
    commanderTitle,
    strengths,
    improvements,
    counterfactual,
    epitaph,
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
