// ─── Chronos Crisis Room: live telemetry + branching-tree architecture ───────
// The Chronos Engine reports state inside its prose ("Turn N of 6", "SCORES:
// Stability X/10, Legitimacy X/10, Legacy X/10", "THE VERDICT", "NN out of
// 100"). parseCrisisTelemetry() extracts the latest values from the message
// stream so the dashboard side-panel can render resource meters without a
// second AI call or any state the model and UI could disagree on — the
// transcript itself is the single source of truth.

import type { ChatMessage } from '@/types';

export const CRISIS_TOTAL_TURNS = 6;

export interface CrisisTelemetry {
  turn: number | null;          // latest announced turn (1-based)
  stability: number | null;     // 0–10
  legitimacy: number | null;    // 0–10
  legacy: number | null;        // 0–10
  decisions: string[];          // the player's committed decisions, in order
  verdictReached: boolean;
  finalScore: number | null;    // 0–100, present once the verdict lands
}

// ── Branching decision-tree architecture ────────────────────────────────────
// Persisted alongside the chat slice, these types model the player's path as
// a tree rather than a line: every decision is a node; abandoning a timeline
// and replaying a scenario grows a sibling branch instead of erasing history.
// (The current UI plays a single active branch; the structure is forward-
// compatible with a "compare timelines" view.)

export interface DecisionNode {
  id: string;
  turn: number;
  /** Verbatim player decision that created this node. */
  decision: string;
  /** CONSEQUENCE line reported by the Engine for this decision. */
  consequence: string | null;
  scores: { stability: number | null; legitimacy: number | null; legacy: number | null };
  children: DecisionNode[];
}

export interface CrisisTimelineTree {
  scenarioId: string;
  root: DecisionNode[];         // first-turn decisions across all playthroughs
  activePath: string[];         // node ids from root to the current position
}

const TURN_RE = /Turn\s+(\d+)\s+of\s+\d+/gi;
const SCORE_RE = /Stability\s*:?\s*(\d+)\s*\/\s*10[^]{0,40}?Legitimacy\s*:?\s*(\d+)\s*\/\s*10[^]{0,40}?Legacy\s*:?\s*(\d+)\s*\/\s*10/gi;
const VERDICT_RE = /THE\s+VERDICT/i;
const FINAL_RE = /(\d{1,3})\s*(?:out of|\/)\s*100/g;

function lastMatch(re: RegExp, text: string): RegExpExecArray | null {
  re.lastIndex = 0;
  let m: RegExpExecArray | null = null;
  for (let hit = re.exec(text); hit; hit = re.exec(text)) m = hit;
  return m;
}

export function parseCrisisTelemetry(messages: ChatMessage[], beginSignal: string): CrisisTelemetry {
  const assistantText = messages.filter(m => m.role === 'assistant').map(m => m.content).join('\n');
  const decisions = messages
    .filter(m => m.role === 'user' && m.content.trim() !== beginSignal)
    .map(m => m.content.trim());

  const turnHit = lastMatch(TURN_RE, assistantText);
  const scoreHit = lastMatch(SCORE_RE, assistantText);
  const finalHit = VERDICT_RE.test(assistantText) ? lastMatch(FINAL_RE, assistantText) : null;

  return {
    turn: turnHit ? Math.min(CRISIS_TOTAL_TURNS, parseInt(turnHit[1], 10)) : null,
    stability: scoreHit ? parseInt(scoreHit[1], 10) : null,
    legitimacy: scoreHit ? parseInt(scoreHit[2], 10) : null,
    legacy: scoreHit ? parseInt(scoreHit[3], 10) : null,
    decisions,
    verdictReached: VERDICT_RE.test(assistantText),
    finalScore: finalHit ? Math.min(100, parseInt(finalHit[1], 10)) : null,
  };
}
