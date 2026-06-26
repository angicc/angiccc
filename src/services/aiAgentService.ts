import type { AuditResult } from '../store/auditState';
import type { SequenceGraph } from '../utils/systemDataParser';
import { compressGraphForPrompt } from '../utils/systemDataParser';

// ─── Configuration ─────────────────────────────────────────────────────────

export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true' ? true : false;
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
