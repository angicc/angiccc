import { create } from 'zustand';

// ─── Sequence / Audit (existing) ─────────────────────────────────────────────

export type SequenceStep = {
  id: string;
  label: string;
  type: 'cold' | 'followup_opened' | 'followup_unopened' | 'breakup';
  subject: string;
  body: string;
};

export type GlobalAlertSeverity = 'high' | 'medium';
export type GlobalAlert = { severity: GlobalAlertSeverity; message: string };
export type NodeDiagnostic = {
  nodeId: string;
  healthScore: number;
  alerts: string[];
  rewriteSuggestion: string;
};
export type AutomationPayload = {
  platform: string;
  exportedAt: string;
  sequences: Array<{ stepId: string; stepLabel: string; optimizedSubject: string; optimizedBody: string }>;
  webhookReady: boolean;
};
export type AuditResult = {
  overallSystemHealth: number;
  nodeDiagnostics: NodeDiagnostic[];
  globalAlerts: GlobalAlert[];
  automationPayload: AutomationPayload;
};
export type AuditPhase = 'idle' | 'loading' | 'complete' | 'error';

// ─── Lead Scraper ─────────────────────────────────────────────────────────────

export type Lead = {
  id: string;
  companyName: string;
  ownerName: string;
  domain: string;
  email: string;
  linkedInUrl: string;
  verified: boolean;
};

// ─── DNS Telemetry ────────────────────────────────────────────────────────────

export type DnsRecordType = 'SPF' | 'DKIM' | 'DMARC' | 'MX' | 'CUSTOM_TRACKING';
export type DnsStatus = 'pass' | 'fail' | 'warning' | 'pending';

export type DnsRecord = {
  type: DnsRecordType;
  status: DnsStatus;
  value: string;
  detail: string;
  lastChecked: string;
};

export type WarmupInbox = {
  id: string;
  email: string;
  warmupScore: number;
  dailySent: number;
  dailyLimit: number;
  reputation: 'good' | 'warning' | 'critical';
  daysActive: number;
};

// ─── A/B Testing ─────────────────────────────────────────────────────────────

export type AbVariant = {
  id: string;
  label: string;
  subject: string;
  body: string;
  trafficPercent: number;
  deliverabilityScore: number;
  openRateEstimate: number;
};

export type AbTest = {
  id: string;
  name: string;
  stepLabel: string;
  variants: AbVariant[];
  status: 'draft' | 'active' | 'paused' | 'complete';
  createdAt: string;
};

// ─── Webhooks ────────────────────────────────────────────────────────────────

export type WebhookPlatform = 'n8n' | 'instantly' | 'zapier' | 'make' | 'custom';
export type WebhookTrigger = 'on_reply' | 'on_open' | 'on_click' | 'on_meeting_booked' | 'on_sequence_end';
export type WebhookStatus = 'success' | 'failed' | 'pending' | 'untested';

export type WebhookEntry = {
  id: string;
  name: string;
  url: string;
  platform: WebhookPlatform;
  trigger: WebhookTrigger;
  status: WebhookStatus;
  lastTestedAt: string | null;
  customPayload: string;
  isActive: boolean;
};

// ─── Reply Intent Simulator ───────────────────────────────────────────────────

export type ReplyScenario = 'positive' | 'objection' | 'not_interested' | 'out_of_office';

export type SimulatedReply = {
  scenario: ReplyScenario;
  prospectMessage: string;
  followupEvaluation: string;
  outcome: 'converts' | 'dead_end' | 'needs_followup';
  conversionScore: number;
  suggestedResponse: string;
};

// ─── Agency Leaderboard ───────────────────────────────────────────────────────

export type DomainHealthTrend = 'improving' | 'stable' | 'declining';

export type SubAccount = {
  id: string;
  clientName: string;
  industry: string;
  topSequence: string;
  bookedMeetings: number;
  openRate: number;
  replyRate: number;
  domainHealth: 'excellent' | 'good' | 'warning' | 'critical';
  activeDomains: number;
  healthTrend: DomainHealthTrend;
  monthlyRevenue: number;
};

// ─── Gamification ─────────────────────────────────────────────────────────────

export type ChessRankInfo = {
  title: string;
  symbol: string;
  tier: number;
  min: number;
  max: number;
};

export function getChessRank(xp: number): ChessRankInfo {
  if (xp >= 1500) return { title: 'System Grandmaster', symbol: '♔', tier: 6, min: 1500, max: 99999 };
  if (xp >= 900) return { title: 'Campaign Queen', symbol: '♛', tier: 5, min: 900, max: 1499 };
  if (xp >= 500) return { title: 'Strategic Rook', symbol: '♖', tier: 4, min: 500, max: 899 };
  if (xp >= 250) return { title: 'Tactical Bishop', symbol: '♗', tier: 3, min: 250, max: 499 };
  if (xp >= 100) return { title: 'Outreach Knight', symbol: '♘', tier: 2, min: 100, max: 249 };
  return { title: 'Novice Pawn', symbol: '♙', tier: 1, min: 0, max: 99 };
}

export const ALL_CHESS_RANKS: ChessRankInfo[] = [
  { title: 'Novice Pawn', symbol: '♙', tier: 1, min: 0, max: 99 },
  { title: 'Outreach Knight', symbol: '♘', tier: 2, min: 100, max: 249 },
  { title: 'Tactical Bishop', symbol: '♗', tier: 3, min: 250, max: 499 },
  { title: 'Strategic Rook', symbol: '♖', tier: 4, min: 500, max: 899 },
  { title: 'Campaign Queen', symbol: '♛', tier: 5, min: 900, max: 1499 },
  { title: 'System Grandmaster', symbol: '♔', tier: 6, min: 1500, max: 99999 },
];

// ─── User & Platform Settings ─────────────────────────────────────────────────

export type PlatformLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt';

export type UserData = {
  name: string;
  email: string;
  avatarUrl: string | null;
  apiKey: string;
  plan: 'starter' | 'growth' | 'agency';
};

export type PlatformSettingsData = {
  notifications: boolean;
  weeklyReports: boolean;
  language: PlatformLanguage;
  developerMode: boolean;
};

// ─── Mock Initial Data ────────────────────────────────────────────────────────

const INITIAL_LEADS: Lead[] = [
  { id: 'l1', companyName: 'Apex SaaS Solutions', ownerName: 'Jordan Miles', domain: 'apexsaas.io', email: 'j.miles@apexsaas.io', linkedInUrl: 'linkedin.com/in/jordanmiles', verified: true },
  { id: 'l2', companyName: 'Clearview CRM', ownerName: 'Priya Sharma', domain: 'clearviewcrm.com', email: 'p.sharma@clearviewcrm.com', linkedInUrl: 'linkedin.com/in/priyasharma', verified: true },
  { id: 'l3', companyName: 'NorthStar Ventures', ownerName: 'Daniel Torres', domain: 'northstarvtr.com', email: 'd.torres@northstarvtr.com', linkedInUrl: 'linkedin.com/in/danieltorres', verified: false },
  { id: 'l4', companyName: 'Pulse Analytics', ownerName: 'Emma Laurent', domain: 'pulseanalytics.co', email: 'e.laurent@pulseanalytics.co', linkedInUrl: 'linkedin.com/in/emmalaurent', verified: true },
  { id: 'l5', companyName: 'Grid Finance', ownerName: 'Kwame Osei', domain: 'gridfinance.io', email: 'k.osei@gridfinance.io', linkedInUrl: 'linkedin.com/in/kwameosei', verified: true },
  { id: 'l6', companyName: 'Vortex DevOps', ownerName: 'Sofia Reyes', domain: 'vortexdevops.com', email: 's.reyes@vortexdevops.com', linkedInUrl: 'linkedin.com/in/sofiareyes', verified: false },
  { id: 'l7', companyName: 'BlueSky Marketing', ownerName: 'Liam Chen', domain: 'blueskymarketing.com', email: 'l.chen@blueskymarketing.com', linkedInUrl: 'linkedin.com/in/liamchen', verified: true },
  { id: 'l8', companyName: 'Stratum Security', ownerName: 'Olivia Park', domain: 'stratumsec.io', email: 'o.park@stratumsec.io', linkedInUrl: 'linkedin.com/in/oliviapark', verified: true },
];

const INITIAL_DNS_RECORDS: DnsRecord[] = [
  { type: 'SPF', status: 'pass', value: 'v=spf1 include:sendgrid.net ~all', detail: 'Valid SPF record. Authorized senders configured correctly.', lastChecked: new Date().toISOString() },
  { type: 'DKIM', status: 'warning', value: 'selector1._domainkey — not found', detail: 'DKIM selector not detected. Configure via your ESP dashboard.', lastChecked: new Date().toISOString() },
  { type: 'DMARC', status: 'fail', value: 'No DMARC record found', detail: 'Missing DMARC policy. Critical risk for email spoofing and deliverability.', lastChecked: new Date().toISOString() },
  { type: 'MX', status: 'pass', value: '10 mail.yourdomain.com', detail: 'MX records valid. Mail server responding correctly.', lastChecked: new Date().toISOString() },
  { type: 'CUSTOM_TRACKING', status: 'warning', value: 'track.yourdomain.com — SSL expiring in 14 days', detail: 'Custom tracking domain SSL certificate expires soon. Renew to prevent broken links.', lastChecked: new Date().toISOString() },
];

const INITIAL_WARMUP_INBOXES: WarmupInbox[] = [
  { id: 'wb1', email: 'outreach1@yourdomain.com', warmupScore: 87, dailySent: 42, dailyLimit: 50, reputation: 'good', daysActive: 32 },
  { id: 'wb2', email: 'outreach2@yourdomain.com', warmupScore: 71, dailySent: 28, dailyLimit: 40, reputation: 'good', daysActive: 18 },
  { id: 'wb3', email: 'sales@yourdomain.com', warmupScore: 43, dailySent: 55, dailyLimit: 50, reputation: 'warning', daysActive: 7 },
  { id: 'wb4', email: 'connect@yourdomain.com', warmupScore: 12, dailySent: 60, dailyLimit: 30, reputation: 'critical', daysActive: 3 },
];

const INITIAL_AB_TESTS: AbTest[] = [
  {
    id: 'ab1',
    name: 'Cold Email Subject Line Test',
    stepLabel: 'Step 1 – Cold Email',
    status: 'active',
    createdAt: new Date().toISOString(),
    variants: [
      { id: 'v1a', label: 'Variant A', subject: 'Quick question about {{companyName}}', body: 'Hi {{firstName}},\n\nNoticed {{companyName}} recently expanded their SDR team — a common sign that pipeline quality becomes the bottleneck before headcount does.\n\nWorth a 15-min call?\n\n— {{senderName}}', trafficPercent: 50, deliverabilityScore: 84, openRateEstimate: 29 },
      { id: 'v1b', label: 'Variant B', subject: 'Noticed something about {{companyName}}\'s outbound...', body: 'Hi {{firstName}},\n\nI was looking at how {{companyName}} approaches cold outreach and had a thought.\n\nWe help similar teams cut reply rates by 3x in 30 days — no tech changes needed.\n\nOpen to a quick call?\n\n— {{senderName}}', trafficPercent: 50, deliverabilityScore: 78, openRateEstimate: 36 },
    ],
  },
  {
    id: 'ab2',
    name: 'Follow-up Tone Variation',
    stepLabel: 'Step 2A – Follow-up (Opened)',
    status: 'draft',
    createdAt: new Date().toISOString(),
    variants: [
      { id: 'v2a', label: 'Variant A (Direct)', subject: 'Re: {{companyName}} pipeline', body: 'Following up — did my last note land okay?\n\n— {{senderName}}', trafficPercent: 60, deliverabilityScore: 91, openRateEstimate: 22 },
      { id: 'v2b', label: 'Variant B (Value-led)', subject: 'One more data point for {{companyName}}', body: 'Hi {{firstName}},\n\nJust wanted to share a quick stat: teams in your space see a 40% lift in booked meetings within the first 30 days.\n\nWorth exploring?\n\n— {{senderName}}', trafficPercent: 40, deliverabilityScore: 80, openRateEstimate: 31 },
    ],
  },
];

const INITIAL_WEBHOOKS: WebhookEntry[] = [
  { id: 'wh1', name: 'n8n — Meeting Booked Trigger', url: 'https://n8n.yourdomain.com/webhook/meeting-booked', platform: 'n8n', trigger: 'on_meeting_booked', status: 'success', lastTestedAt: new Date().toISOString(), customPayload: '{\n  "event": "meeting_booked",\n  "prospect_id": "{{id}}",\n  "company": "{{company}}",\n  "email": "{{email}}",\n  "booked_at": "{{timestamp}}"\n}', isActive: true },
  { id: 'wh2', name: 'Instantly — Sequence End Handler', url: 'https://api.instantly.ai/webhooks/sequence-end', platform: 'instantly', trigger: 'on_sequence_end', status: 'failed', lastTestedAt: new Date().toISOString(), customPayload: '{\n  "sequence_id": "{{seq_id}}",\n  "outcome": "{{outcome}}",\n  "prospect_email": "{{email}}"\n}', isActive: false },
  { id: 'wh3', name: 'Zapier — Reply Detected', url: 'https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/', platform: 'zapier', trigger: 'on_reply', status: 'untested', lastTestedAt: null, customPayload: '{\n  "reply_body": "{{reply}}",\n  "prospect": "{{email}}",\n  "sentiment": "{{sentiment}}"\n}', isActive: true },
];

const INITIAL_AGENCY_ACCOUNTS: SubAccount[] = [
  { id: 'sa1', clientName: 'TechStack Ventures', industry: 'SaaS', topSequence: 'C-Suite Cold Outreach v3', bookedMeetings: 47, openRate: 68, replyRate: 24, domainHealth: 'excellent', activeDomains: 4, healthTrend: 'improving', monthlyRevenue: 12400 },
  { id: 'sa2', clientName: 'Meridian Capital', industry: 'Fintech', topSequence: 'CFO Cold + LinkedIn', bookedMeetings: 31, openRate: 54, replyRate: 18, domainHealth: 'good', activeDomains: 2, healthTrend: 'stable', monthlyRevenue: 8700 },
  { id: 'sa3', clientName: 'Atlas Logistics', industry: 'Supply Chain', topSequence: 'Ops Director Sequence v2', bookedMeetings: 22, openRate: 47, replyRate: 14, domainHealth: 'warning', activeDomains: 3, healthTrend: 'declining', monthlyRevenue: 5200 },
  { id: 'sa4', clientName: 'Nova Health Systems', industry: 'HealthTech', topSequence: 'VP Clinical Outreach', bookedMeetings: 19, openRate: 61, replyRate: 21, domainHealth: 'good', activeDomains: 2, healthTrend: 'improving', monthlyRevenue: 6800 },
  { id: 'sa5', clientName: 'Orion PropTech', industry: 'Real Estate', topSequence: 'Property Manager Cold', bookedMeetings: 38, openRate: 72, replyRate: 29, domainHealth: 'excellent', activeDomains: 5, healthTrend: 'improving', monthlyRevenue: 15100 },
];

const DEFAULT_STEPS: SequenceStep[] = [
  { id: 'step_1', label: 'Step 1 – Cold Email', type: 'cold', subject: '', body: '' },
  { id: 'step_2a', label: 'Step 2A – Follow-up (Opened)', type: 'followup_opened', subject: '', body: '' },
  { id: 'step_2b', label: 'Step 2B – Follow-up (Unopened)', type: 'followup_unopened', subject: '', body: '' },
  { id: 'step_3', label: 'Step 3 – Breakup', type: 'breakup', subject: '', body: '' },
];

// ─── Full State Type ──────────────────────────────────────────────────────────

type AuditState = {
  // ── Sequence audit (existing)
  icp: string;
  companyUrl: string;
  valueProposition: string;
  steps: SequenceStep[];
  phase: AuditPhase;
  errorMessage: string | null;
  auditResult: AuditResult | null;
  setContext: (icp: string, companyUrl: string, valueProposition: string) => void;
  setSteps: (steps: SequenceStep[]) => void;
  setPhase: (phase: AuditPhase) => void;
  setAuditResult: (result: AuditResult) => void;
  setError: (msg: string) => void;
  reset: () => void;

  // ── Lead scraper
  leadScraper: { niche: string; location: string; leads: Lead[]; selectedIds: string[]; phase: 'idle' | 'scraping' | 'complete' };
  setLeadQuery: (niche: string, location: string) => void;
  setLeads: (leads: Lead[]) => void;
  setLeadScraperPhase: (phase: 'idle' | 'scraping' | 'complete') => void;
  toggleLeadSelection: (id: string) => void;
  selectAllLeads: () => void;
  clearLeadSelection: () => void;
  pushLeadsToContext: () => void;

  // ── DNS telemetry
  dnsTelemetry: { domain: string; records: DnsRecord[]; inboxes: WarmupInbox[]; phase: 'idle' | 'checking' | 'complete'; overallScore: number };
  setDnsDomain: (domain: string) => void;
  runDnsCheck: () => void;

  // ── A/B testing
  abTests: AbTest[];
  addAbTest: (test: AbTest) => void;
  updateAbTestStatus: (id: string, status: AbTest['status']) => void;
  updateVariantTraffic: (testId: string, variantId: string, percent: number) => void;

  // ── Webhooks
  webhooks: WebhookEntry[];
  addWebhook: (entry: WebhookEntry) => void;
  updateWebhook: (id: string, updates: Partial<WebhookEntry>) => void;
  removeWebhook: (id: string) => void;
  setWebhookStatus: (id: string, status: WebhookStatus) => void;

  // ── Reply intent simulator
  replySimulator: { activeScenario: ReplyScenario; simulation: SimulatedReply | null; phase: 'idle' | 'simulating' | 'complete' };
  setReplyScenario: (scenario: ReplyScenario) => void;
  runReplySimulation: () => void;

  // ── Agency leaderboard
  agencyAccounts: SubAccount[];

  // ── Gamification
  xp: number;
  puzzleLastSolvedEpoch: number | null;
  addXp: (amount: number) => void;
  setPuzzleSolved: () => void;

  // ── User & settings
  user: UserData;
  updateUser: (updates: Partial<UserData>) => void;
  platformSettings: PlatformSettingsData;
  updatePlatformSettings: (updates: Partial<PlatformSettingsData>) => void;
};

// ─── Reply simulation mock data ───────────────────────────────────────────────

const REPLY_MOCK: Record<ReplyScenario, SimulatedReply> = {
  positive: {
    scenario: 'positive',
    prospectMessage: "Hi, thanks for reaching out — actually this timing is perfect. We've been looking at exactly this problem internally for the last quarter. Can we jump on a call Thursday at 2pm EST?",
    followupEvaluation: "Strong positive intent detected. Prospect explicitly acknowledged the pain point and proposed a specific meeting time. Your conditional follow-up branch correctly routes to the calendar booking step. No friction detected in the CTA pathway.",
    outcome: 'converts',
    conversionScore: 94,
    suggestedResponse: "Hi {{firstName}},\n\nThursday at 2pm EST works perfectly.\n\nI'll send a calendar invite now. Looking forward to showing you exactly how we'd approach {{companyName}}'s situation.\n\n— {{senderName}}",
  },
  objection: {
    scenario: 'objection',
    prospectMessage: "Appreciate the outreach but we just signed a 2-year deal with a competitor last quarter. The timing really isn't right.",
    followupEvaluation: "Price/contract objection detected. Your current sequence has no conditional branch handling competitor-displacement scenarios. This hits a dead-end after Step 2B. Recommend adding a 'long-cycle nurture' node with a 90-day re-engagement trigger.",
    outcome: 'dead_end',
    conversionScore: 18,
    suggestedResponse: "Hi {{firstName}},\n\nCompletely understand — 2-year contracts don't disappear overnight.\n\nMind if I check back in around the renewal window? I'll set a reminder on my end so I'm not bothering you until it's actually relevant.\n\n— {{senderName}}",
  },
  not_interested: {
    scenario: 'not_interested',
    prospectMessage: "Not interested. Please remove me from your list.",
    followupEvaluation: "Hard opt-out detected. Your sequence correctly suppresses further outreach after this trigger (verified in Step 3 Breakup node). However, no automated unsubscribe confirmation is mapped — this creates a GDPR/CAN-SPAM compliance gap in your automation payload.",
    outcome: 'dead_end',
    conversionScore: 2,
    suggestedResponse: "Hi {{firstName}},\n\nAbsolutely — you're removed immediately.\n\nApologies for the interruption. Best of luck with {{companyName}}.\n\n— {{senderName}}",
  },
  out_of_office: {
    scenario: 'out_of_office',
    prospectMessage: "I'm currently out of office until July 7th with limited email access. For urgent matters please contact sarah.kim@company.com. I'll respond to all other emails when I return.",
    followupEvaluation: "Auto-reply / OOO detected. Your current sequence will continue firing follow-ups during this window — creating a negative first impression on return. Recommend adding an OOO-detection pause node that delays the next step by 10 business days post-OOO end date.",
    outcome: 'needs_followup',
    conversionScore: 51,
    suggestedResponse: "Noted — I've paused outreach and will follow up the week of July 7th instead.\n\nNo action needed on your end.\n\n— {{senderName}}",
  },
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuditStore = create<AuditState>((set, get) => ({
  // ── Sequence audit
  icp: '',
  companyUrl: '',
  valueProposition: '',
  steps: DEFAULT_STEPS,
  phase: 'idle',
  errorMessage: null,
  auditResult: null,
  setContext: (icp, companyUrl, valueProposition) => set({ icp, companyUrl, valueProposition }),
  setSteps: (steps) => set({ steps }),
  setPhase: (phase) => set({ phase }),
  setAuditResult: (result) => set({ auditResult: result, phase: 'complete' }),
  setError: (msg) => set({ errorMessage: msg, phase: 'error' }),
  reset: () => set({ icp: '', companyUrl: '', valueProposition: '', steps: DEFAULT_STEPS, phase: 'idle', errorMessage: null, auditResult: null }),

  // ── Lead scraper
  leadScraper: { niche: 'SaaS Founders', location: 'United States', leads: INITIAL_LEADS, selectedIds: [], phase: 'complete' },
  setLeadQuery: (niche, location) => set((s) => ({ leadScraper: { ...s.leadScraper, niche, location } })),
  setLeads: (leads) => set((s) => ({ leadScraper: { ...s.leadScraper, leads } })),
  setLeadScraperPhase: (phase) => set((s) => ({ leadScraper: { ...s.leadScraper, phase } })),
  toggleLeadSelection: (id) =>
    set((s) => {
      const ids = s.leadScraper.selectedIds;
      const updated = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
      return { leadScraper: { ...s.leadScraper, selectedIds: updated } };
    }),
  selectAllLeads: () =>
    set((s) => ({ leadScraper: { ...s.leadScraper, selectedIds: s.leadScraper.leads.map((l) => l.id) } })),
  clearLeadSelection: () =>
    set((s) => ({ leadScraper: { ...s.leadScraper, selectedIds: [] } })),
  pushLeadsToContext: () => {
    const { leadScraper } = get();
    const selected = leadScraper.leads.filter((l) => leadScraper.selectedIds.includes(l.id));
    if (!selected.length) return;
    const companies = selected.map((l) => l.companyName).join(', ');
    const icpStr = `${leadScraper.niche} — ${leadScraper.location} (${selected.length} targets: ${companies})`;
    set({ icp: icpStr });
  },

  // ── DNS telemetry
  dnsTelemetry: { domain: 'yourdomain.com', records: INITIAL_DNS_RECORDS, inboxes: INITIAL_WARMUP_INBOXES, phase: 'complete', overallScore: 58 },
  setDnsDomain: (domain) => set((s) => ({ dnsTelemetry: { ...s.dnsTelemetry, domain } })),
  runDnsCheck: async () => {
    set((s) => ({ dnsTelemetry: { ...s.dnsTelemetry, phase: 'checking' } }));
    await new Promise((res) => setTimeout(res, 1800));
    set((s) => ({
      dnsTelemetry: {
        ...s.dnsTelemetry,
        phase: 'complete',
        overallScore: Math.floor(Math.random() * 30 + 50),
        records: s.dnsTelemetry.records.map((r) => ({ ...r, lastChecked: new Date().toISOString() })),
      },
    }));
  },

  // ── A/B testing
  abTests: INITIAL_AB_TESTS,
  addAbTest: (test) => set((s) => ({ abTests: [...s.abTests, test] })),
  updateAbTestStatus: (id, status) =>
    set((s) => ({ abTests: s.abTests.map((t) => (t.id === id ? { ...t, status } : t)) })),
  updateVariantTraffic: (testId, variantId, percent) =>
    set((s) => ({
      abTests: s.abTests.map((t) => {
        if (t.id !== testId) return t;
        const other = t.variants.find((v) => v.id !== variantId);
        return {
          ...t,
          variants: t.variants.map((v) =>
            v.id === variantId ? { ...v, trafficPercent: percent } : { ...v, trafficPercent: other ? 100 - percent : v.trafficPercent }
          ),
        };
      }),
    })),

  // ── Webhooks
  webhooks: INITIAL_WEBHOOKS,
  addWebhook: (entry) => set((s) => ({ webhooks: [...s.webhooks, entry] })),
  updateWebhook: (id, updates) =>
    set((s) => ({ webhooks: s.webhooks.map((w) => (w.id === id ? { ...w, ...updates } : w)) })),
  removeWebhook: (id) => set((s) => ({ webhooks: s.webhooks.filter((w) => w.id !== id) })),
  setWebhookStatus: (id, status) =>
    set((s) => ({
      webhooks: s.webhooks.map((w) =>
        w.id === id ? { ...w, status, lastTestedAt: status !== 'untested' ? new Date().toISOString() : w.lastTestedAt } : w
      ),
    })),

  // ── Reply simulator
  replySimulator: { activeScenario: 'positive', simulation: null, phase: 'idle' },
  setReplyScenario: (scenario) =>
    set((s) => ({ replySimulator: { ...s.replySimulator, activeScenario: scenario, simulation: null, phase: 'idle' } })),
  runReplySimulation: async () => {
    const { replySimulator } = get();
    set((s) => ({ replySimulator: { ...s.replySimulator, phase: 'simulating', simulation: null } }));
    await new Promise((res) => setTimeout(res, 1600));
    set((s) => ({
      replySimulator: {
        ...s.replySimulator,
        phase: 'complete',
        simulation: REPLY_MOCK[replySimulator.activeScenario],
      },
    }));
  },

  // ── Agency leaderboard
  agencyAccounts: INITIAL_AGENCY_ACCOUNTS,

  // ── Gamification
  xp: 75,
  puzzleLastSolvedEpoch: null,
  addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
  setPuzzleSolved: () => {
    const epoch = Math.floor(Date.now() / (12 * 60 * 60 * 1000));
    set((s) => ({ puzzleLastSolvedEpoch: epoch, xp: s.xp + 50 }));
  },

  // ── User
  user: { name: 'Angel Dimitrov', email: 'wolfd9606@gmail.com', avatarUrl: null, apiKey: 'oa_live_sk_7f3k9m2p1x8q4n6r5v0w', plan: 'growth' },
  updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),

  // ── Platform settings
  platformSettings: { notifications: true, weeklyReports: true, language: 'en', developerMode: false },
  updatePlatformSettings: (updates) => set((s) => ({ platformSettings: { ...s.platformSettings, ...updates } })),
}));
