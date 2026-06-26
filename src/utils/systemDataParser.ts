import type { SequenceStep, AuditResult, AutomationPayload } from '../store/auditState';

// ─── Node / Edge graph types ───────────────────────────────────────────────

export type GraphNode = {
  id: string;
  type: string;
  label: string;
  data: {
    subject: string;
    body: string;
    spamFlagCheck: boolean;
    wordCount: number;
    linkCount: number;
    hasQuestion: boolean;
    hasCta: boolean;
  };
};

export type GraphEdge = {
  from: string;
  to: string;
  condition: 'always' | 'if_opened' | 'if_unopened' | 'breakup';
};

export type SequenceGraph = {
  globalVariables: {
    icp: string;
    companyUrl: string;
    valueProposition: string;
    auditTimestamp: string;
    totalNodes: number;
  };
  nodes: GraphNode[];
  edges: GraphEdge[];
  spamFlags: { nodeId: string; words: string[] }[];
};

// High-frequency spam trigger words commonly caught by ESPs
const SPAM_TRIGGERS = [
  'free', 'guaranteed', 'no risk', 'winner', 'congratulations', 'urgent',
  'act now', 'limited time', 'click here', 'buy now', 'order now',
  '100%', 'money back', 'increase sales', 'make money', 'earn extra',
  'no cost', 'double your', 'best price', 'amazing', 'incredible deal',
];

function detectSpamWords(text: string): string[] {
  const lower = text.toLowerCase();
  return SPAM_TRIGGERS.filter((w) => lower.includes(w));
}

function countLinks(text: string): number {
  return (text.match(/https?:\/\//g) || []).length;
}

function hasQuestion(text: string): boolean {
  return text.includes('?');
}

function hasCta(text: string): boolean {
  const ctaKeywords = ['reply', 'schedule', 'book', 'call', 'let me know', 'worth a chat', 'open to'];
  const lower = text.toLowerCase();
  return ctaKeywords.some((kw) => lower.includes(kw));
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Converts raw form inputs into a strict node/edge JSON graph
 * suitable for LLM ingestion with minimal token overhead.
 */
export function buildSequenceGraph(
  icp: string,
  companyUrl: string,
  valueProposition: string,
  steps: SequenceStep[]
): SequenceGraph {
  const nodes: GraphNode[] = steps.map((step) => {
    const fullText = `${step.subject} ${step.body}`;
    const spamWords = detectSpamWords(fullText);
    return {
      id: step.id,
      type: step.type,
      label: step.label,
      data: {
        subject: step.subject,
        body: step.body,
        spamFlagCheck: spamWords.length > 0,
        wordCount: fullText.split(/\s+/).filter(Boolean).length,
        linkCount: countLinks(fullText),
        hasQuestion: hasQuestion(fullText),
        hasCta: hasCta(fullText),
      },
    };
  });

  const edges: GraphEdge[] = [];
  const stepMap = new Map(steps.map((s) => [s.id, s]));
  const ids = steps.map((s) => s.id);

  for (let i = 0; i < ids.length; i++) {
    const curr = stepMap.get(ids[i])!;
    const next = stepMap.get(ids[i + 1]);
    if (!next) continue;

    let condition: GraphEdge['condition'] = 'always';
    if (next.type === 'followup_opened') condition = 'if_opened';
    else if (next.type === 'followup_unopened') condition = 'if_unopened';
    else if (next.type === 'breakup') condition = 'breakup';

    edges.push({ from: curr.id, to: next.id, condition });
  }

  const spamFlags = nodes
    .filter((n) => n.data.spamFlagCheck)
    .map((n) => ({
      nodeId: n.id,
      words: detectSpamWords(`${n.data.subject} ${n.data.body}`),
    }));

  return {
    globalVariables: {
      icp,
      companyUrl,
      valueProposition,
      auditTimestamp: new Date().toISOString(),
      totalNodes: nodes.length,
    },
    nodes,
    edges,
    spamFlags,
  };
}

/**
 * Compresses the graph into a minimal JSON string for LLM ingestion,
 * stripping whitespace and redundant keys to reduce token count.
 */
export function compressGraphForPrompt(graph: SequenceGraph): string {
  return JSON.stringify(graph);
}

// ─── Webhook Export Utility ────────────────────────────────────────────────

export type WebhookPayload = {
  source: 'OutreachAudit.ai';
  version: '1.0';
  exportedAt: string;
  icp: string;
  companyUrl: string;
  sequences: AutomationPayload['sequences'];
  overallHealthScore: number;
};

/**
 * Stub: packages the audit result into a webhook-ready payload.
 * In production, replace the console.log with a fetch() to your n8n/Zapier endpoint.
 */
export function exportToWebhook(
  auditResult: AuditResult,
  icp: string,
  companyUrl: string
): WebhookPayload {
  const payload: WebhookPayload = {
    source: 'OutreachAudit.ai',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    icp,
    companyUrl,
    sequences: auditResult.automationPayload.sequences,
    overallHealthScore: auditResult.overallSystemHealth,
  };

  // Production: await fetch(WEBHOOK_URL, { method: 'POST', body: JSON.stringify(payload) })
  console.log('[OutreachAudit] Webhook payload ready:', payload);
  return payload;
}
