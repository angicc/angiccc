// ─── Multi-metric AI grading matrix ──────────────────────────────────────────
// Shared structural contract for every AI assessment surface (Video Review,
// Essay Challenge, Chronos verdicts). Four orthogonal dimensions, each with a
// numeric score and granular sentence-level feedback, so grading reads like a
// professional rubric instead of one opaque number.

export interface MetricScore {
  /** 0–100 */
  score: number;
  /** Granular, sentence-level feedback strings for this dimension. */
  feedback: string[];
}

export interface MultiMetricGrade {
  historicalAuthenticity: MetricScore;
  strategicRealism: MetricScore;
  syntacticElegance: MetricScore;
  argumentativeRigor: MetricScore;
}

export const METRIC_KEYS = [
  'historicalAuthenticity',
  'strategicRealism',
  'syntacticElegance',
  'argumentativeRigor',
] as const satisfies readonly (keyof MultiMetricGrade)[];

/** Prompt fragment: appended to grading system prompts to demand the matrix. */
export const MULTI_METRIC_JSON_SPEC = `Additionally include a "metrics" object with EXACTLY this shape:
"metrics": {
  "historicalAuthenticity": { "score": 0-100, "feedback": ["one granular observation", "..."] },
  "strategicRealism":       { "score": 0-100, "feedback": ["..."] },
  "syntacticElegance":      { "score": 0-100, "feedback": ["..."] },
  "argumentativeRigor":     { "score": 0-100, "feedback": ["..."] }
}
Metric definitions: historicalAuthenticity = factual accuracy of dates, names, causation; strategicRealism = whether claims/decisions respect real-world constraints of the period; syntacticElegance = clarity, flow, and precision of the writing itself; argumentativeRigor = thesis strength, evidence use, logical structure. Each feedback array: 1-3 specific strings referencing the student's actual sentences.`;

const clamp = (n: unknown): number =>
  typeof n === 'number' && Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0;

/** Coerce untrusted LLM output into a valid matrix; null if absent/hopeless. */
export function validateMultiMetric(raw: unknown): MultiMetricGrade | null {
  if (!raw || typeof raw !== 'object') return null;
  const out = {} as MultiMetricGrade;
  for (const key of METRIC_KEYS) {
    const m = (raw as Record<string, unknown>)[key];
    if (!m || typeof m !== 'object') return null;
    const { score, feedback } = m as { score?: unknown; feedback?: unknown };
    out[key] = {
      score: clamp(score),
      feedback: Array.isArray(feedback) ? feedback.filter((f): f is string => typeof f === 'string').slice(0, 3) : [],
    };
  }
  return out;
}
