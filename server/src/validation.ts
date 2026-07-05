// LLM response validation middleware: repair → parse → zod-verify.
// Nothing reaches the database unless it satisfies the structural schema.
import { z } from 'zod';

// ── Stage 1: JSON repair (same failure classes as the client pipeline) ──────
// Fixes: markdown fences/prose wrapping, unescaped inner quotes, raw control
// characters inside strings, trailing commas, smart-quote delimiters, and
// mid-stream truncation (closes the open string, trims dangling separators,
// closes brackets in stack order).

export function extractJsonBlock(raw: string): string | null {
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fence ? fence[1] : raw;
  const start = source.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  let inStr = false;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (inStr) {
      if (ch === '\\') i++;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return source.slice(start).trim();
}

export function repairJson(src: string): string {
  const out: string[] = [];
  const stack: ('}' | ']')[] = [];
  let inStr = false;
  const next = (from: number) => {
    let j = from;
    while (j < src.length && /[ \t\r\n]/.test(src[j])) j++;
    return src[j];
  };
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === '\\') { out.push(ch, src[i + 1] ?? '"'); i++; }
      else if (ch === '"' || ch === '”' || ch === '“') {
        const n = next(i + 1);
        if (n === undefined || n === ',' || n === ':' || n === '}' || n === ']') { inStr = false; out.push('"'); }
        else out.push(ch === '"' ? '\\"' : ch);
      }
      else if (ch === '\n') out.push('\\n');
      else if (ch === '\r') out.push('\\r');
      else if (ch === '\t') out.push('\\t');
      else if (ch.charCodeAt(0) < 0x20) out.push('\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'));
      else out.push(ch);
      continue;
    }
    if (ch === '"' || ch === '“' || ch === '”') { inStr = true; out.push('"'); }
    else if (ch === '{') { stack.push('}'); out.push(ch); }
    else if (ch === '[') { stack.push(']'); out.push(ch); }
    else if (ch === '}' || ch === ']') { if (stack[stack.length - 1] === ch) stack.pop(); out.push(ch); }
    else if (ch === ',') { const n = next(i + 1); if (n !== '}' && n !== ']' && n !== undefined) out.push(ch); }
    else out.push(ch);
  }
  if (inStr) out.push('"');
  let repaired = out.join('').replace(/\s+$/, '')
    .replace(/,\s*"[^"]*"?\s*:?\s*$/, '')
    .replace(/[:,]\s*$/, '');
  while (stack.length) repaired += stack.pop();
  return repaired;
}

export function safeJsonParse<T>(raw: string): T {
  const block = extractJsonBlock(raw);
  if (!block) throw new Error('No JSON object found in the AI response.');
  try { return JSON.parse(block) as T; }
  catch { return JSON.parse(repairJson(block)) as T; }
}

// ── Stage 2: structural schemas ──────────────────────────────────────────────

const metricScore = z.object({
  score: z.number().min(0).max(100),
  feedback: z.array(z.string()).max(3),
});

/** Multi-metric grading payload (Video Review / Essay / Chronos verdicts). */
export const multiMetricGradeSchema = z.object({
  historicalAuthenticity: metricScore,
  strategicRealism: metricScore,
  syntacticElegance: metricScore,
  argumentativeRigor: metricScore,
});
export type MultiMetricGrade = z.infer<typeof multiMetricGradeSchema>;

const clampImpact = (n: number) => Math.max(-25, Math.min(25, Math.round(n)));
const impactInt = z.number().finite().transform(clampImpact);

/** Chronos Engine node payload (Section 5 Part C contract). */
export const crisisNodeSchema = z.object({
  currentCrisisId: z.string(),
  activeStepIndex: z.number().int().nonnegative(),
  historicalContext: z.string().min(1),
  resourceImpacts: z.object({
    diplomaticCapital: impactInt,
    domesticStability: impactInt,
    militaryReadiness: impactInt,
    treasury: impactInt,
  }),
  branchingOptions: z.array(z.object({
    optionId: z.string().min(1).max(2),
    actionText: z.string().min(1),
    predictedRisk: z.enum(['Low', 'Medium', 'High']),
  })).max(4),
  hiddenConsequences: z.record(z.string(), z.string()),
});
export type CrisisNodePayload = z.infer<typeof crisisNodeSchema>;

// ── Stage 3: middleware ──────────────────────────────────────────────────────

/** Repair + validate a raw LLM string against a schema; throws 422-worthy errors. */
export function validateLlmPayload<S extends z.ZodTypeAny>(schema: S, raw: string): z.infer<S> {
  return schema.parse(safeJsonParse<unknown>(raw));
}
