import type { AuditResult } from '../store/auditState';
import type { SequenceGraph } from '../utils/systemDataParser';
import { compressGraphForPrompt } from '../utils/systemDataParser';

// ─── Configuration ─────────────────────────────────────────────────────────

/**
 * Set MOCK_MODE = true to return a deterministic dummy response
 * and develop the full UI without burning API credits.
 */
export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true' ? true : false;

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string;
const MODEL = 'claude-sonnet-4-6';

// ─── Systems-Level Agent Prompt ────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the Core Diagnostics Engine for OutreachAudit.ai. You receive a structured JSON node-graph representing a B2B cold email sequence containing conditional branches and A/B variants. You operate on a zero-latency execution pathway. Do not output conversational text.

Run these 3 internal sub-routines:
- Sub-Routine A (Deliverability): Scan all nodes for spam triggers, heavy HTML/link density, and syntax errors.
- Sub-Routine B (ICP Resonance): Evaluate if the hooks align with the designated target market's specific pain points.
- Sub-Routine C (Systemic Flow): Identify logical dead-ends, sequence fatigue, or aggressive friction in Call-to-Actions across conditional branches.

Output your response STRICTLY as a JSON object with no markdown fences, no prose, no explanation — only raw JSON:
{
  "overallSystemHealth": number,
  "nodeDiagnostics": [{ "nodeId": string, "healthScore": number, "alerts": [string], "rewriteSuggestion": string }],
  "globalAlerts": [{ "severity": "high"|"medium", "message": string }],
  "automationPayload": {
    "platform": string,
    "exportedAt": string,
    "sequences": [{ "stepId": string, "stepLabel": string, "optimizedSubject": string, "optimizedBody": string }],
    "webhookReady": boolean
  }
}`;

// ─── Mock Response ─────────────────────────────────────────────────────────

function buildMockResult(graph: SequenceGraph): AuditResult {
  const now = new Date().toISOString();
  return {
    overallSystemHealth: 62,
    nodeDiagnostics: graph.nodes.map((node, idx) => ({
      nodeId: node.id,
      healthScore: [78, 55, 48, 70][idx] ?? 60,
      alerts:
        idx === 0
          ? ['Subject line lacks specificity for target ICP', 'Opening hook is generic — no pain-point anchor']
          : idx === 1
          ? ['Follow-up references "just checking in" — high ignore-rate phrase', 'No conditional personalization branch detected']
          : idx === 2
          ? ['High spam-word density: "free", "guaranteed" detected', 'Link count exceeds ESP safe threshold (3+)']
          : ['Breakup email CTA is ambiguous — unclear next step'],
      rewriteSuggestion:
        idx === 0
          ? `Subject: "Quick question about [Company]'s pipeline velocity"\n\nHi {{firstName}},\n\nI noticed [Company] recently scaled their SDR team — a common sign that pipeline quality becomes the bottleneck before headcount.\n\nWe help ${graph.globalVariables.icp} cut qualification time by 40% without adding headcount.\n\nWorth a 15-min diagnostic call this week?\n\n— {{senderName}}`
          : idx === 1
          ? `Subject: "Re: [Company] pipeline"\n\nHi {{firstName}},\n\nFollowing up — did you get a chance to look at my last note?\n\nGiven what we're seeing with similar ${graph.globalVariables.icp} teams right now, timing feels relevant.\n\nOpen to a brief call?\n\n— {{senderName}}`
          : idx === 2
          ? `Subject: "Still relevant?"\n\nHi {{firstName}},\n\nI don't want to clog your inbox — but before I close this out, wanted to check: is improving outreach conversion something on your radar for Q${Math.ceil((new Date().getMonth() + 1) / 3)}?\n\nIf not now, happy to reconnect later.\n\n— {{senderName}}`
          : `Subject: "Closing the loop"\n\nHi {{firstName}},\n\nI'll take your silence as a no for now. No hard feelings.\n\nIf priorities shift around outreach efficiency, you know where to find me.\n\nBest,\n{{senderName}}`,
    })),
    globalAlerts: [
      { severity: 'high', message: 'Spam word density exceeds 8% threshold in Step 2B — high risk of promotions tab placement' },
      { severity: 'high', message: 'No conditional branch detected for "replied but not booked" — sequence has a logical dead-end' },
      { severity: 'medium', message: 'ICP resonance score below 65 — hooks do not reference known pain points for the target vertical' },
      { severity: 'medium', message: 'Step 3 CTA friction is above baseline — direct ask before establishing sufficient value context' },
    ],
    automationPayload: {
      platform: 'OutreachAudit.ai → n8n / Instantly Compatible',
      exportedAt: now,
      sequences: graph.nodes.map((node, idx) => ({
        stepId: node.id,
        stepLabel: node.label,
        optimizedSubject: [
          `Quick question about {{companyName}}'s pipeline velocity`,
          `Re: {{companyName}} pipeline`,
          `Still relevant?`,
          `Closing the loop`,
        ][idx] ?? `Optimized: ${node.data.subject}`,
        optimizedBody: `[AI-optimized body for ${node.label} — see rewriteSuggestion in nodeDiagnostics for full text]`,
      })),
      webhookReady: true,
    },
  };
}

// ─── Live API Call ─────────────────────────────────────────────────────────

async function callAnthropicAPI(graph: SequenceGraph): Promise<AuditResult> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not set. Add it to your .env.local file.');
  }

  const userMessage = `Analyze this B2B cold email sequence graph and return the diagnostic JSON:\n\n${compressGraphForPrompt(graph)}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawText: string = data.content?.[0]?.text ?? '';

  // Strip any accidental markdown fences
  const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  let parsed: AuditResult;
  try {
    parsed = JSON.parse(cleaned) as AuditResult;
  } catch {
    throw new Error(`AI returned malformed JSON. Raw output: ${rawText.slice(0, 400)}`);
  }

  return parsed;
}

// ─── Public Entry Point ────────────────────────────────────────────────────

export async function runSequenceAudit(graph: SequenceGraph): Promise<AuditResult> {
  if (MOCK_MODE) {
    // Simulate network latency for realistic UX testing
    await new Promise((res) => setTimeout(res, 2200));
    return buildMockResult(graph);
  }
  return callAnthropicAPI(graph);
}
