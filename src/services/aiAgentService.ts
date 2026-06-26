import type { AuditResult } from '../store/auditState';
import type { SequenceGraph } from '../utils/systemDataParser';
import { compressGraphForPrompt } from '../utils/systemDataParser';

// ─── Configuration ─────────────────────────────────────────────────────────

export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string;
const MODEL = 'claude-sonnet-4-6';

// ─── System Prompts ────────────────────────────────────────────────────────

const SEQUENCE_AUDIT_PROMPT = `You are the Core Diagnostics Engine for OutreachAudit.ai. You receive a structured JSON node-graph representing a B2B cold email sequence containing conditional branches and A/B variants. You operate on a zero-latency execution pathway. Do not output conversational text.

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

const MULTI_MACHINE_PROMPT = `You are the Multi-Machine Core Diagnostics Engine for OutreachAudit.ai operating in distributed orchestration mode. You receive a comprehensive JSON payload representing the full platform state across 4 concurrent diagnostic machines. You operate on a zero-latency execution pathway. Do not output conversational text.

Run these 4 concurrent sub-machines simultaneously:
- Machine 1 (Sequence Audit): Evaluate all email sequence nodes for deliverability, ICP resonance, and systemic flow issues.
- Machine 2 (DNS + Deliverability): Evaluate the domain DNS health metrics and inbox warmup scores for sending safety risk.
- Machine 3 (Scraper Health): Assess lead quality, email verification rates, and domain diversity from the lead scraper payload.
- Machine 4 (Webhook Validation): Validate all webhook endpoint configurations for logical correctness, missing triggers, and dead-end automation paths.

Output your response STRICTLY as a JSON object with no markdown fences:
{
  "platformHealthScore": number,
  "machineResults": {
    "sequenceAudit": { "score": number, "criticalFindings": [string], "summary": string },
    "dnsDeliverability": { "score": number, "criticalFindings": [string], "summary": string },
    "scraperHealth": { "score": number, "criticalFindings": [string], "summary": string },
    "webhookValidation": { "score": number, "criticalFindings": [string], "summary": string }
  },
  "globalSystemAlerts": [{ "severity": "high"|"medium"|"low", "machine": string, "message": string }],
  "prioritizedActionPlan": [{ "priority": number, "action": string, "impact": "high"|"medium"|"low" }]
}`;

// ─── Extended platform state for multi-machine routing ──────────────────────

export type ExtendedPlatformState = {
  sequenceGraph: SequenceGraph;
  dnsPayload: {
    domain: string;
    overallScore: number;
    records: Array<{ type: string; status: string; detail: string }>;
    inboxes: Array<{ email: string; warmupScore: number; reputation: string; dailySent: number; dailyLimit: number }>;
  };
  scraperPayload: {
    niche: string;
    location: string;
    totalLeads: number;
    verifiedCount: number;
    verificationRate: number;
    domainDiversityScore: number;
  };
  webhookPayload: {
    totalWebhooks: number;
    activeWebhooks: number;
    failedWebhooks: number;
    untestedWebhooks: number;
    webhooks: Array<{ name: string; platform: string; trigger: string; status: string; isActive: boolean }>;
  };
};

export type MultiMachineResult = {
  platformHealthScore: number;
  machineResults: {
    sequenceAudit: { score: number; criticalFindings: string[]; summary: string };
    dnsDeliverability: { score: number; criticalFindings: string[]; summary: string };
    scraperHealth: { score: number; criticalFindings: string[]; summary: string };
    webhookValidation: { score: number; criticalFindings: string[]; summary: string };
  };
  globalSystemAlerts: Array<{ severity: 'high' | 'medium' | 'low'; machine: string; message: string }>;
  prioritizedActionPlan: Array<{ priority: number; action: string; impact: 'high' | 'medium' | 'low' }>;
};

// ─── Mock Builders ─────────────────────────────────────────────────────────

function buildMockAuditResult(graph: SequenceGraph): AuditResult {
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
          ? ['Follow-up references "just checking in" — high ignore-rate phrase', 'No conditional personalization detected']
          : idx === 2
          ? ['High spam-word density detected', 'Link count exceeds ESP safe threshold']
          : ['Breakup email CTA is ambiguous — unclear next step'],
      rewriteSuggestion:
        idx === 0
          ? `Subject: "Quick question about {{companyName}}'s pipeline"\n\nHi {{firstName}},\n\nI noticed {{companyName}} recently scaled their SDR team — a common sign that pipeline quality becomes the bottleneck.\n\nWe help ${graph.globalVariables.icp} cut qualification time by 40% without adding headcount.\n\nWorth a 15-min diagnostic call?\n\n— {{senderName}}`
          : idx === 1
          ? `Subject: "Re: {{companyName}} pipeline"\n\nHi {{firstName}},\n\nFollowing up — did you get a chance to look at my last note?\n\nGiven what we're seeing with similar teams right now, timing feels relevant.\n\nOpen to a brief call?\n\n— {{senderName}}`
          : idx === 2
          ? `Subject: "Still relevant?"\n\nHi {{firstName}},\n\nI don't want to clog your inbox — but before I close this out: is improving outreach conversion something on your radar for Q${Math.ceil((new Date().getMonth() + 1) / 3)}?\n\n— {{senderName}}`
          : `Subject: "Closing the loop"\n\nHi {{firstName}},\n\nI'll take your silence as a no for now. No hard feelings.\n\nIf priorities shift, you know where to find me.\n\nBest,\n{{senderName}}`,
    })),
    globalAlerts: [
      { severity: 'high', message: 'Spam word density exceeds 8% threshold in Step 2B — high risk of promotions tab placement' },
      { severity: 'high', message: 'No conditional branch for "replied but not booked" — sequence has a logical dead-end' },
      { severity: 'medium', message: 'ICP resonance score below 65 — hooks do not reference known pain points for the target vertical' },
      { severity: 'medium', message: 'Step 3 CTA friction is above baseline — direct ask before sufficient value context established' },
    ],
    automationPayload: {
      platform: 'OutreachAudit.ai → n8n / Instantly Compatible',
      exportedAt: now,
      sequences: graph.nodes.map((node, idx) => ({
        stepId: node.id,
        stepLabel: node.label,
        optimizedSubject: [`Quick question about {{companyName}}'s pipeline`, `Re: {{companyName}} pipeline`, `Still relevant?`, `Closing the loop`][idx] ?? `Optimized: ${node.data.subject}`,
        optimizedBody: `[AI-optimized body for ${node.label} — see rewriteSuggestion in nodeDiagnostics]`,
      })),
      webhookReady: true,
    },
  };
}

function buildMockMultiMachineResult(state: ExtendedPlatformState): MultiMachineResult {
  return {
    platformHealthScore: 58,
    machineResults: {
      sequenceAudit: {
        score: 62,
        criticalFindings: ['Step 2B contains 3 high-frequency spam triggers', 'No conditional branch for positive reply handling before Step 3', 'Opening hook does not reference a specific ICP pain point'],
        summary: 'Sequence structure is functional but deliverability risks in Step 2B could suppress inbox placement by up to 40%. ICP alignment is generic.',
      },
      dnsDeliverability: {
        score: state.dnsPayload.overallScore,
        criticalFindings: ['DMARC policy missing — critical spoofing vulnerability', 'DKIM selector not configured — major deliverability risk', `Inbox "${state.dnsPayload.inboxes.find((i) => i.reputation === 'critical')?.email ?? 'unknown'}" exceeding daily safe send limits`],
        summary: `Domain ${state.dnsPayload.domain} has critical DNS gaps. DMARC and DKIM failures will cause high spam folder placement across major ESPs.`,
      },
      scraperHealth: {
        score: Math.round(state.scraperPayload.verificationRate * 100),
        criticalFindings: state.scraperPayload.verificationRate < 0.8 ? [`Only ${Math.round(state.scraperPayload.verificationRate * 100)}% email verification rate — bounce risk above safe threshold`, 'Low domain diversity detected — potential for bulk send pattern flagging'] : ['Scraper health nominal'],
        summary: `${state.scraperPayload.totalLeads} leads extracted for ${state.scraperPayload.niche} in ${state.scraperPayload.location}. ${state.scraperPayload.verifiedCount} verified (${Math.round(state.scraperPayload.verificationRate * 100)}%).`,
      },
      webhookValidation: {
        score: state.webhookPayload.totalWebhooks > 0 ? Math.round((state.webhookPayload.activeWebhooks / state.webhookPayload.totalWebhooks) * 100) : 0,
        criticalFindings: [
          ...(state.webhookPayload.failedWebhooks > 0 ? [`${state.webhookPayload.failedWebhooks} webhook(s) returning failure status — automation pipeline broken`] : []),
          ...(state.webhookPayload.untestedWebhooks > 0 ? [`${state.webhookPayload.untestedWebhooks} webhook(s) untested — cannot confirm automation integrity`] : []),
        ],
        summary: `${state.webhookPayload.activeWebhooks}/${state.webhookPayload.totalWebhooks} webhooks active. ${state.webhookPayload.failedWebhooks} failed endpoints require immediate attention.`,
      },
    },
    globalSystemAlerts: [
      { severity: 'high', machine: 'DNS', message: 'DMARC record missing — domain is unprotected against spoofing' },
      { severity: 'high', machine: 'DNS', message: 'DKIM not configured — deliverability critically compromised' },
      { severity: 'high', machine: 'Sequence', message: 'Spam trigger density in Step 2B exceeds safe threshold' },
      { severity: 'medium', machine: 'Webhook', message: `${state.webhookPayload.failedWebhooks} webhook endpoint(s) returning error — automation paused` },
      { severity: 'medium', machine: 'Scraper', message: 'Email bounce risk elevated — verification rate below 80%' },
      { severity: 'low', machine: 'Sequence', message: 'ICP personalization tokens not detected in Step 1 subject line' },
    ],
    prioritizedActionPlan: [
      { priority: 1, action: 'Add DMARC DNS record to prevent spoofing and improve deliverability', impact: 'high' },
      { priority: 2, action: 'Configure DKIM selector in your ESP sending dashboard', impact: 'high' },
      { priority: 3, action: 'Remove spam trigger words from Step 2B body copy', impact: 'high' },
      { priority: 4, action: 'Fix failed webhook endpoints to restore automation pipeline', impact: 'medium' },
      { priority: 5, action: 'Add ICP-specific pain point reference in Step 1 subject line', impact: 'medium' },
      { priority: 6, action: 'Increase email verification threshold before scraper export', impact: 'medium' },
    ],
  };
}

// ─── Live API Call — Sequence Audit ─────────────────────────────────────────

async function callAnthropicAPI(graph: SequenceGraph): Promise<AuditResult> {
  if (!ANTHROPIC_API_KEY) throw new Error('VITE_ANTHROPIC_API_KEY is not set. Add it to your .env.local file.');

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
      system: SEQUENCE_AUDIT_PROMPT,
      messages: [{ role: 'user', content: `Analyze this B2B cold email sequence graph:\n\n${compressGraphForPrompt(graph)}` }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic API error ${response.status}: ${await response.text()}`);

  const data = await response.json();
  const raw: string = data.content?.[0]?.text ?? '';
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  try {
    return JSON.parse(cleaned) as AuditResult;
  } catch {
    throw new Error(`AI returned malformed JSON. Raw: ${raw.slice(0, 400)}`);
  }
}

// ─── Live API Call — Multi-Machine Audit ────────────────────────────────────

async function callAnthropicMultiMachine(state: ExtendedPlatformState): Promise<MultiMachineResult> {
  if (!ANTHROPIC_API_KEY) throw new Error('VITE_ANTHROPIC_API_KEY is not set.');

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
      max_tokens: 6000,
      system: MULTI_MACHINE_PROMPT,
      messages: [{ role: 'user', content: `Run full platform diagnostic on this state:\n\n${JSON.stringify(state)}` }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic API error ${response.status}: ${await response.text()}`);

  const data = await response.json();
  const raw: string = data.content?.[0]?.text ?? '';
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  try {
    return JSON.parse(cleaned) as MultiMachineResult;
  } catch {
    throw new Error(`AI returned malformed JSON. Raw: ${raw.slice(0, 400)}`);
  }
}

// ─── Concierge Chatbot ──────────────────────────────────────────────────────

const CONCIERGE_SYSTEM_PROMPT = `You are the AngelReach Concierge — the intelligent support assistant for AngelReach.ai, a B2B cold outreach diagnostic and automation platform.

Your knowledge covers:
- APP NAVIGATION: Workspace (sequence builder + ICP), AI Terminal (diagnostics), Lead Scraper Hub, DNS Shield, A/B Testing Sandbox, Webhook Hub, Reply Simulator, Agency Leaderboard, Warmup Simulator, Objection Roleplay, AI Chess Rank (gamification), Daily Puzzle, App Guide, Platform Settings, User Profile
- B2B OUTREACH: Cold email structure, ICP definition, follow-up cadences, deliverability, spam triggers, DMARC/DKIM/SPF, inbox warmup, reply handling, objection frameworks
- PRICING: Starter $29/mo (1 domain, 500 contacts), Growth $49/mo (5 domains, 2,500 contacts, full suite), Agency Enterprise (custom, unlimited, white-label)
- GAMIFICATION: Chess Rank system — users earn XP by running audits (25 XP), solving Daily Puzzles (50 XP), and completing Objection Roleplay. Ranks: Novice Pawn → Outreach Knight → Tactical Bishop → Strategic Rook → Campaign Queen → System Grandmaster

Be concise, direct, and actionable. Use platform terminology. Never exceed 150 words per reply unless asked for detail.`;

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export async function sendConciergeMessage(history: ChatMessage[]): Promise<string> {
  if (MOCK_MODE) {
    await new Promise((res) => setTimeout(res, 800));
    const last = history[history.length - 1]?.content.toLowerCase() ?? '';
    if (last.includes('price') || last.includes('cost') || last.includes('plan'))
      return "We offer 3 plans: **Starter** ($29/mo), **Growth** ($49/mo), and **Agency Enterprise** (custom). Growth is the most popular — it unlocks the full AI diagnostic suite, Lead Scraper, A/B Testing, and Webhook Hub. Want me to walk through the differences?";
    if (last.includes('dns') || last.includes('dmarc') || last.includes('dkim'))
      return "The **DNS Shield** tab checks your SPF, DKIM, DMARC, and MX records in real-time. DMARC is the most critical — without it, your domain is vulnerable to spoofing and ESPs will aggressively filter your sends. Go to DNS Shield → enter your domain → hit Run Check.";
    if (last.includes('sequence') || last.includes('workspace'))
      return "The **Workspace** is where you build your 4-node cold email sequence: Cold Email → Follow-up (Opened) → Follow-up (Unopened) → Breakup. After configuring your ICP, URL, and Value Prop, click *Initialize System Audit* to run the AI diagnostic.";
    if (last.includes('chess') || last.includes('rank') || last.includes('xp'))
      return "The **AI Chess Rank** is AngelReach's gamification system. You earn XP by running audits (+25 XP), solving Daily Puzzles (+50 XP), and scoring high in Objection Roleplay. Ranks go from Novice Pawn ♙ all the way to System Grandmaster ♔.";
    return "I'm the AngelReach Concierge. I can help you navigate the platform, explain B2B outreach concepts, or answer billing questions. What would you like to know?";
  }

  if (!ANTHROPIC_API_KEY) return "API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env.local file to enable the AI Concierge.";

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
      max_tokens: 512,
      system: CONCIERGE_SYSTEM_PROMPT,
      messages: history,
    }),
  });

  if (!response.ok) return `Error ${response.status}: ${await response.text()}`;
  const data = await response.json();
  return data.content?.[0]?.text ?? 'No response received.';
}

// ─── Objection Roleplay ─────────────────────────────────────────────────────

export type ObjectionScenario = 'price' | 'competitor' | 'timing' | 'no_budget' | 'send_info';

const OBJECTION_OPENINGS: Record<ObjectionScenario, string> = {
  price: "Hi, I looked at your pricing page. Honestly, $49/month is too expensive for what we need right now. We're a small team and I can't justify that cost.",
  competitor: "Thanks for reaching out. We actually just renewed with a competitor last quarter and locked in for 2 years. We're pretty happy with what we have.",
  timing: "Your product looks interesting but the timing just isn't right. We're in the middle of a big internal project and won't be evaluating new tools for at least 6 months.",
  no_budget: "I appreciate you following up but we've had a budget freeze since Q1. There's zero chance of getting approval for new software spend right now.",
  send_info: "Can you just send me some information? I'll share it with the team and get back to you when we've had a chance to review.",
};

export type ObjectionTurnResult = {
  prospectReply: string;
  score: number;
  feedback: string;
  isEnding: boolean;
};

export async function runObjectionTurn(
  scenario: ObjectionScenario,
  history: ChatMessage[],
  isGrading: boolean
): Promise<ObjectionTurnResult> {
  const systemPrompt = isGrading
    ? `You are grading a sales rep's response to a B2B objection. The scenario is: "${scenario}".
Analyze their latest response and output ONLY raw JSON (no markdown):
{
  "score": number between 0-100,
  "feedback": "2-3 sentences of specific, actionable coaching feedback",
  "prospectReply": "a short 1-2 sentence prospect follow-up that logically continues the conversation based on their response quality",
  "isEnding": boolean (true if the conversation has reached a natural close or 4+ exchanges)
}

Scoring guide: 90-100 = perfect objection handle (acknowledges, pivots, offers value), 70-89 = good (missing one element), 50-69 = average (generic response), 30-49 = weak (ignored the objection), 0-29 = poor (pushed harder or made it worse).`
    : `You are playing a skeptical B2B prospect with the "${scenario}" objection. Stay in character. Be realistic — not cartoonishly difficult, but genuinely hesitant. Respond naturally to the sales rep's latest message in 2-3 sentences maximum. Do NOT add any grading or meta-commentary. Just the prospect's reply as plain text.`;

  if (MOCK_MODE) {
    await new Promise((res) => setTimeout(res, 1200));
    if (isGrading) {
      const lastUserMsg = history.filter((m) => m.role === 'user').pop()?.content ?? '';
      const hasAcknowledge = /understand|hear|makes sense|appreciate/i.test(lastUserMsg);
      const hasPivot = /but|however|what if|consider|actually/i.test(lastUserMsg);
      const score = hasAcknowledge && hasPivot ? 82 : hasAcknowledge ? 64 : 41;
      return {
        score,
        feedback: score >= 80
          ? "Strong handle. You acknowledged the objection before pivoting — that's the correct structure. Next level: tie your pivot directly to a specific business outcome they care about."
          : score >= 60
          ? "You acknowledged the concern, which is good. Missing: a clear pivot that reframes the value. Avoid jumping to features — anchor to ROI or risk reduction."
          : "The response ignored the core objection and went straight to a pitch. Always validate first. Try: 'That makes sense — [acknowledge]. What I've seen with similar teams is [reframe].'",
        prospectReply: score >= 80
          ? "Okay, that's a fair point. I hadn't thought about it that way. What would this actually look like for a team our size?"
          : "I hear you, but I'm still not convinced this is the right move for us right now.",
        isEnding: history.filter((m) => m.role === 'user').length >= 4,
      };
    }
    return {
      score: 0,
      feedback: '',
      prospectReply: "Hmm, I'm still not fully sold. Can you be more specific about the ROI we'd see?",
      isEnding: false,
    };
  }

  if (!ANTHROPIC_API_KEY) {
    return { score: 0, feedback: 'API key not set.', prospectReply: 'API key not configured.', isEnding: true };
  }

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
      max_tokens: 512,
      system: systemPrompt,
      messages: history,
    }),
  });

  if (!response.ok) return { score: 0, feedback: `Error ${response.status}`, prospectReply: '', isEnding: true };
  const data = await response.json();
  const raw: string = data.content?.[0]?.text ?? '';

  if (isGrading) {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    try {
      return JSON.parse(cleaned) as ObjectionTurnResult;
    } catch {
      return { score: 50, feedback: 'Could not parse grading response.', prospectReply: '', isEnding: true };
    }
  }
  return { score: 0, feedback: '', prospectReply: raw.trim(), isEnding: false };
}

export const OBJECTION_OPENINGS_MAP = OBJECTION_OPENINGS;

// ─── Public Entry Points ───────────────────────────────────────────────────

export async function runSequenceAudit(graph: SequenceGraph): Promise<AuditResult> {
  if (MOCK_MODE) {
    await new Promise((res) => setTimeout(res, 2200));
    return buildMockAuditResult(graph);
  }
  return callAnthropicAPI(graph);
}

export async function runMultiMachineAudit(state: ExtendedPlatformState): Promise<MultiMachineResult> {
  if (MOCK_MODE) {
    await new Promise((res) => setTimeout(res, 2800));
    return buildMockMultiMachineResult(state);
  }
  return callAnthropicMultiMachine(state);
}
