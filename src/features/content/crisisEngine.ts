// ─── Chronos Engine core: deterministic historical state machine ─────────────
// The simulation is not a pre-written script. Each turn the LLM emits ONE
// rigid JSON node (schema below); the CLIENT owns the resource vector, applies
// the node's signed impacts, clamps to 0–100, and hard-gates: any metric at
// 0 or 100 forces a Crisis Conclusion Encounter. The LLM narrates; the state
// machine governs. Validation runs through zod after safeJsonParse repair, so
// a malformed node can never corrupt the resource vector.

import { z } from 'zod';
import { safeJsonParse } from '@/lib/safeJsonParse';
import type { CrisisScenario } from '@/features/content/crisisScenarios';

// ── Resource vector ──────────────────────────────────────────────────────────

export interface CrisisResources {
  diplomaticCapital: number;
  domesticStability: number;
  militaryReadiness: number;
  treasury: number;
}

export const RESOURCE_KEYS = [
  'diplomaticCapital',
  'domesticStability',
  'militaryReadiness',
  'treasury',
] as const satisfies readonly (keyof CrisisResources)[];

export const BASELINE_RESOURCES: CrisisResources = {
  diplomaticCapital: 50,
  domesticStability: 50,
  militaryReadiness: 50,
  treasury: 50,
};

const clamp100 = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
// Single-turn swings are capped so one hallucinated "-90" cannot end a run.
const clampImpact = (n: number) => Math.max(-25, Math.min(25, Math.round(n)));

export function applyImpacts(state: CrisisResources, impacts: CrisisResources): CrisisResources {
  const next = {} as CrisisResources;
  for (const k of RESOURCE_KEYS) next[k] = clamp100(state[k] + clampImpact(impacts[k] ?? 0));
  return next;
}

export interface HardGate {
  metric: keyof CrisisResources;
  direction: 'collapse' | 'triumph';
}

/** 0% → collapse encounter; 100% → dynamic historical victory encounter. */
export function detectHardGate(state: CrisisResources): HardGate | null {
  for (const k of RESOURCE_KEYS) {
    if (state[k] <= 0) return { metric: k, direction: 'collapse' };
    if (state[k] >= 100) return { metric: k, direction: 'triumph' };
  }
  return null;
}

// ── Strict node schema (Section 5 Part C) ────────────────────────────────────

const riskSchema = z.enum(['Low', 'Medium', 'High']).catch('Medium');
const impactInt = z.number().finite().catch(0).transform(clampImpact);

export const crisisNodeSchema = z.object({
  currentCrisisId: z.string(),
  activeStepIndex: z.number().int().nonnegative().catch(0),
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
    predictedRisk: riskSchema,
  })).max(4),
  hiddenConsequences: z.record(z.string(), z.string()).catch({}),
});

export type CrisisNodePayload = z.infer<typeof crisisNodeSchema>;

/** Repair + parse + validate one engine turn. Null = unrecoverable. */
export function parseCrisisNode(raw: string, crisisId: string): CrisisNodePayload | null {
  try {
    const candidate = safeJsonParse<unknown>(raw);
    const node = crisisNodeSchema.parse(candidate);
    return { ...node, currentCrisisId: node.currentCrisisId || crisisId };
  } catch {
    return null;
  }
}

// ── Persistent run state (mirrors backend CrisisRoomState model) ─────────────

export interface CrisisDecision {
  step: number;
  optionId: string;      // 'A' | 'B' | ... | 'custom'
  text: string;
  revealedConsequence?: string;
}

export interface CrisisRunState {
  crisisId: string;
  activeStepIndex: number;
  resources: CrisisResources;
  decisionHistory: CrisisDecision[];
  concluded: boolean;
}

const RUN_KEY = 'historify:crisis:run';

function runKey(crisisId: string, userId?: string) {
  return `${RUN_KEY}:${crisisId}${userId ? `:${userId}` : ''}`;
}

export function loadRunState(crisisId: string, userId?: string): CrisisRunState {
  try {
    const raw = localStorage.getItem(runKey(crisisId, userId));
    if (raw) {
      const parsed = JSON.parse(raw) as CrisisRunState;
      if (parsed && parsed.resources && Array.isArray(parsed.decisionHistory)) return parsed;
    }
  } catch { /* fall through to baseline */ }
  return { crisisId, activeStepIndex: 0, resources: { ...BASELINE_RESOURCES }, decisionHistory: [], concluded: false };
}

export function saveRunState(state: CrisisRunState, userId?: string) {
  try { localStorage.setItem(runKey(state.crisisId, userId), JSON.stringify(state)); } catch { /* best-effort */ }
}

/** Transactionally drop the decision log and re-init baseline metrics. */
export function resetRunState(crisisId: string, userId?: string): CrisisRunState {
  const fresh: CrisisRunState = {
    crisisId, activeStepIndex: 0, resources: { ...BASELINE_RESOURCES }, decisionHistory: [], concluded: false,
  };
  saveRunState(fresh, userId);
  return fresh;
}

// ── Engine protocol messages ─────────────────────────────────────────────────

export function beginMessage(state: CrisisRunState): string {
  return `BEGIN SIMULATION\nSTATE: ${JSON.stringify(state.resources)}`;
}

export function decisionMessage(state: CrisisRunState, decisionText: string): string {
  return `DECISION (step ${state.activeStepIndex}): ${decisionText}\nSTATE: ${JSON.stringify(state.resources)}`;
}

export function conclusionMessage(gate: HardGate, state: CrisisRunState): string {
  const METRIC_NAMES: Record<keyof CrisisResources, string> = {
    diplomaticCapital: 'Diplomatic Capital', domesticStability: 'Domestic Stability',
    militaryReadiness: 'Military Readiness', treasury: 'Treasury',
  };
  return `HARD GATE TRIGGERED: ${METRIC_NAMES[gate.metric]} has ${gate.direction === 'collapse' ? 'collapsed to 0' : 'reached 100'}.\nSTATE: ${JSON.stringify(state.resources)}\nDeliver the Crisis Conclusion Encounter now: a single node with empty branchingOptions whose historicalContext narrates the ${gate.direction === 'collapse' ? 'downfall (coup, collapse, defeat — whichever this metric implies)' : 'dynamic historical victory this dominance implies'}, then the final verdict versus real history.`;
}

// ── Engine system prompt (Section 5 Parts B & D) ─────────────────────────────

export function buildCrisisEnginePrompt(s: CrisisScenario): string {
  return `You are the Chronos Engine, the deterministic game master of Historify's Chronos Crisis Room.

SCENARIO: ${s.title} (${s.yearLabel})
THE PLAYER IS: ${s.role}
SITUATION: ${s.briefing}
PLAYER OBJECTIVES: ${s.objectives.join('; ')}

OUTPUT PROTOCOL — ABSOLUTE:
Respond with ONE JSON object and NOTHING else — no prose, no markdown fences, no preamble. Exact shape:
{
  "currentCrisisId": "${s.id}",
  "activeStepIndex": <number, echo the step you are resolving>,
  "historicalContext": "<MAX 60 words: the active battlefield/political status quo AFTER the player's last decision>",
  "resourceImpacts": { "diplomaticCapital": <signed int>, "domesticStability": <signed int>, "militaryReadiness": <signed int>, "treasury": <signed int> },
  "branchingOptions": [
    { "optionId": "A", "actionText": "<clear, concise historical option>", "predictedRisk": "Low|Medium|High" },
    { "optionId": "B", "actionText": "<clear, concise historical option>", "predictedRisk": "Low|Medium|High" },
    { "optionId": "C", "actionText": "<optional third option>", "predictedRisk": "Low|Medium|High" }
  ],
  "hiddenConsequences": { "ifChosenA": "<immediate pivot state>", "ifChosenB": "<immediate pivot state>", "ifChosenC": "<...>" }
}

ENGINE RULES:
1. NON-LINEAR: never follow a fixed script. Every player decision mutates the state; identical scenarios must diverge with different choices.
2. IMPACTS: resourceImpacts reflect the player's LAST decision (all zeros on the very first node). Range -25..+25 per metric per turn. The client, not you, holds the authoritative totals — the STATE line in each player message is ground truth; reason from it.
3. HARD GATES: when you receive HARD GATE TRIGGERED, output a final node: branchingOptions must be [], historicalContext narrates the Crisis Conclusion Encounter (military coup, economic collapse, revolution, or dynamic victory — matching the metric and direction) plus a verdict versus real history. Same when step 6 completes without a gate: deliver THE VERDICT node with empty branchingOptions.
4. CONTEXTUAL ANCHOR: only technology, knowledge, institutions, and people that existed in ${s.yearLabel} may appear in options or consequences. No anachronisms under any circumstance.
5. TEMPORAL INTEGRITY: once the player diverges from real history, every later node must live inside that counterfactual reality. Never snap back to the textbook timeline; consequences compound.
6. FREE-FORM DECISIONS: if the player types their own plan instead of choosing A/B/C, treat it seriously, judge its period-realism, and resolve it with the same JSON shape.
7. COMPACTNESS: historicalContext ≤ 60 words; actionText ≤ 20 words; hiddenConsequences values ≤ 25 words. Short, tactical, mobile-readable.
8. LANGUAGE: every human-readable string value (historicalContext, actionText, hiddenConsequences) MUST be written in the language named by the OUTPUT LANGUAGE directive appended to this prompt. If no such directive is appended, use English. Protocol messages the player sends (BEGIN SIMULATION, DECISION, STATE, HARD GATE) are machine tokens — never treat their language as the player's language choice. JSON keys stay in English exactly as specified.`;
}
