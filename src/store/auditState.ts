import { create } from 'zustand';

export type SequenceStep = {
  id: string;
  label: string;
  type: 'cold' | 'followup_opened' | 'followup_unopened' | 'breakup';
  subject: string;
  body: string;
};

export type GlobalAlertSeverity = 'high' | 'medium';

export type GlobalAlert = {
  severity: GlobalAlertSeverity;
  message: string;
};

export type NodeDiagnostic = {
  nodeId: string;
  healthScore: number;
  alerts: string[];
  rewriteSuggestion: string;
};

export type AutomationPayload = {
  platform: string;
  exportedAt: string;
  sequences: Array<{
    stepId: string;
    stepLabel: string;
    optimizedSubject: string;
    optimizedBody: string;
  }>;
  webhookReady: boolean;
};

export type AuditResult = {
  overallSystemHealth: number;
  nodeDiagnostics: NodeDiagnostic[];
  globalAlerts: GlobalAlert[];
  automationPayload: AutomationPayload;
};

export type AuditPhase =
  | 'idle'
  | 'loading'
  | 'complete'
  | 'error';

type AuditState = {
  // Context inputs
  icp: string;
  companyUrl: string;
  valueProposition: string;
  steps: SequenceStep[];

  // Execution state
  phase: AuditPhase;
  errorMessage: string | null;
  auditResult: AuditResult | null;

  // Actions
  setContext: (icp: string, companyUrl: string, valueProposition: string) => void;
  setSteps: (steps: SequenceStep[]) => void;
  setPhase: (phase: AuditPhase) => void;
  setAuditResult: (result: AuditResult) => void;
  setError: (msg: string) => void;
  reset: () => void;
};

const DEFAULT_STEPS: SequenceStep[] = [
  {
    id: 'step_1',
    label: 'Step 1 – Cold Email',
    type: 'cold',
    subject: '',
    body: '',
  },
  {
    id: 'step_2a',
    label: 'Step 2A – Follow-up (Opened)',
    type: 'followup_opened',
    subject: '',
    body: '',
  },
  {
    id: 'step_2b',
    label: 'Step 2B – Follow-up (Unopened)',
    type: 'followup_unopened',
    subject: '',
    body: '',
  },
  {
    id: 'step_3',
    label: 'Step 3 – Breakup',
    type: 'breakup',
    subject: '',
    body: '',
  },
];

export const useAuditStore = create<AuditState>((set) => ({
  icp: '',
  companyUrl: '',
  valueProposition: '',
  steps: DEFAULT_STEPS,
  phase: 'idle',
  errorMessage: null,
  auditResult: null,

  setContext: (icp, companyUrl, valueProposition) =>
    set({ icp, companyUrl, valueProposition }),

  setSteps: (steps) => set({ steps }),

  setPhase: (phase) => set({ phase }),

  setAuditResult: (result) => set({ auditResult: result, phase: 'complete' }),

  setError: (msg) => set({ errorMessage: msg, phase: 'error' }),

  reset: () =>
    set({
      icp: '',
      companyUrl: '',
      valueProposition: '',
      steps: DEFAULT_STEPS,
      phase: 'idle',
      errorMessage: null,
      auditResult: null,
    }),
}));
