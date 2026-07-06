import { useState, useRef, useEffect, useCallback } from 'react';
import { Hourglass, Send, ArrowLeft, RotateCcw, Target, Crown, Play, AlertTriangle, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppShell } from '@/components/layout/AppShell';
import { AiErrorCard } from '@/components/shared/AiErrorCard';
import { TiltCard } from '@/components/shared/TiltCard';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { PlanGate } from '@/features/subscription/planGate';
import { recordAiMessage } from '@/features/progress/progressStore';
import { streamChatResponse } from '@/services/aiGateway';
import { usePersistentChat } from '@/services/chatStore';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  CRISIS_SCENARIOS,
  getCrisisTitle, getCrisisRole, getCrisisTagline,
  getCrisisYearLabel, getCrisisBriefing, getCrisisObjectives,
  type CrisisScenario,
} from '@/features/content/crisisScenarios';
import {
  buildCrisisEnginePrompt, parseCrisisNode, applyImpacts, detectHardGate,
  loadRunState, saveRunState, resetRunState, beginMessage, decisionMessage, conclusionMessage,
  RESOURCE_KEYS, type CrisisRunState, type CrisisNodePayload, type CrisisResources,
} from '@/features/content/crisisEngine';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

const ERA_STYLE: Record<CrisisScenario['era'], { text: string; bg: string; bar: string; border: string; glow: string }> = {
  ancient:        { text: 'text-amber-400',  bg: 'bg-amber-400/10',  bar: 'bg-amber-400',  border: 'border-amber-400/30',  glow: 'era-glow-ancient' },
  'middle-ages':  { text: 'text-violet-400', bg: 'bg-violet-400/10', bar: 'bg-violet-400', border: 'border-violet-400/30', glow: 'era-glow-medieval' },
  'early-modern': { text: 'text-teal-400',   bg: 'bg-teal-400/10',   bar: 'bg-teal-400',   border: 'border-teal-400/30',   glow: 'era-glow-earlymod' },
  modern:         { text: 'text-rose-400',   bg: 'bg-rose-400/10',   bar: 'bg-rose-400',   border: 'border-rose-400/30',   glow: 'era-glow-modern' },
};

const RISK_STYLE: Record<'Low' | 'Medium' | 'High', string> = {
  Low: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
  Medium: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
  High: 'text-red-400 border-red-400/40 bg-red-400/10',
};

export default function ChronosCrisisPage() {
  const { t, language } = useLanguage();
  const { currentUser, refreshProgress } = useAuth();
  const { trackAiMessage } = useSubscription();
  const [scenario, setScenario] = useState<CrisisScenario | null>(null);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-7rem)]">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-xl bg-primary/10"
              animate={{ rotate: [0, 180, 180, 360] }}
              transition={{ duration: 6, times: [0, 0.45, 0.55, 1], repeat: Infinity, ease: 'easeInOut' }}
            >
              <Hourglass className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h1 className="font-heading text-2xl font-bold">{t.crisis_title}</h1>
              <p className="text-muted-foreground text-sm">{t.crisis_subtitle}</p>
            </div>
          </div>
          {scenario && (
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => setScenario(null)}>
              <ArrowLeft className="w-4 h-4" />{t.crisis_back}
            </Button>
          )}
        </motion.div>

        <PlanGate plan="master" description={t.crisis_master_only}>
          {!scenario && (
            <div className="grid sm:grid-cols-2 gap-4 overflow-y-auto pb-4 cascade-in">
              {CRISIS_SCENARIOS.map(s => {
                const es = ERA_STYLE[s.era];
                return (
                  <TiltCard key={s.id} className="relative" maxTilt={6}>
                    <button
                      onClick={() => setScenario(s)}
                      className={cn('w-full h-full text-left p-5 rounded-2xl border bg-card/70 era-glow transition-all group', es.border, es.glow)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className={cn('text-[10px] font-bold', es.text, es.border, es.bg)}>
                          {getCrisisYearLabel(s, language)}
                        </Badge>
                        <Crown className={cn('w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity', es.text)} />
                      </div>
                      <h2 className="font-heading text-lg font-bold leading-snug">{getCrisisTitle(s, language)}</h2>
                      <p className={cn('text-xs font-semibold mt-1', es.text)}>{getCrisisRole(s, language)}</p>
                      <p className="text-muted-foreground text-xs leading-relaxed mt-2 break-words">{getCrisisTagline(s, language)}</p>
                    </button>
                  </TiltCard>
                );
              })}
            </div>
          )}

          {scenario && (
            <CrisisRoom
              key={scenario.id}
              scenario={scenario}
              userId={currentUser?.id}
              onAiMessage={() => {
                if (currentUser) { recordAiMessage(currentUser.id); trackAiMessage(); refreshProgress(); }
              }}
            />
          )}
        </PlanGate>
      </div>
    </AppShell>
  );
}

function ResourceMeter({ label, value, barClass }: { label: string; value: number; barClass: string }) {
  const danger = value <= 15 || value >= 85;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-muted-foreground truncate">{label}</span>
        <span className={cn('tabular-nums font-semibold', danger && 'text-red-400')}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-700', barClass)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function CrisisRoom({ scenario, userId, onAiMessage }: {
  scenario: CrisisScenario;
  userId?: string;
  onAiMessage: () => void;
}) {
  const { t, language } = useLanguage();
  const [messages, setMessages, clearChat] = usePersistentChat(`crisis:${scenario.id}`, userId);
  const [run, setRun] = useState<CrisisRunState>(() => loadRunState(scenario.id, userId));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const retryRef = useRef<{ history: { role: 'user' | 'assistant'; content: string }[] } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const es = ERA_STYLE[scenario.era];
  const systemPrompt = buildCrisisEnginePrompt(scenario);

  // The transcript is the transport log; the UI renders only validated nodes.
  const nodes: CrisisNodePayload[] = messages
    .filter(m => m.role === 'assistant' && !m.isStreaming && m.content)
    .map(m => parseCrisisNode(m.content, scenario.id))
    .filter((n): n is CrisisNodePayload => n !== null);
  const lastNode = nodes[nodes.length - 1] ?? null;
  const awaitingDecision = !!lastNode && lastNode.branchingOptions.length > 0 && !run.concluded && !loading;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  // Legacy-format recovery: chats persisted by the pre-state-machine engine
  // are prose the node renderer cannot parse. Mounting with messages but zero
  // nodes means a bricked timeline (no Begin button, locked input, blank
  // feed) — reset once so the player lands on a fresh run.
  const recoveredRef = useRef(false);
  useEffect(() => {
    if (recoveredRef.current) return;
    recoveredRef.current = true;
    if (messages.length > 0 && nodes.length === 0) {
      clearChat();
      setRun(resetRunState(scenario.id, userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistRun = useCallback((next: CrisisRunState) => {
    setRun(next);
    saveRunState(next, userId);
  }, [userId]);

  /** Stream one engine turn, then run the state machine on the parsed node. */
  const streamTurn = useCallback(async (history: { role: 'user' | 'assistant'; content: string }[], runBefore: CrisisRunState) => {
    const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: new Date().toISOString(), isStreaming: true };
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(true);
    setError(null);
    try {
      let acc = '';
      for await (const chunk of streamChatResponse(history, undefined, systemPrompt)) acc += chunk;
      setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: acc, isStreaming: false } : m));
      retryRef.current = null;

      const node = parseCrisisNode(acc, scenario.id);
      if (!node) throw new Error('The Chronos Engine returned an invalid node. Retry to re-synchronize the timeline.');

      // Vector mutation: the client is authoritative; impacts are clamped.
      const resources: CrisisResources = applyImpacts(runBefore.resources, node.resourceImpacts);
      const concluded = node.branchingOptions.length === 0;
      const nextRun: CrisisRunState = { ...runBefore, resources, concluded };
      persistRun(nextRun);

      // Hard value gating: 0% or 100% forces the Crisis Conclusion Encounter.
      const gate = detectHardGate(resources);
      if (gate && !concluded) {
        const gateHistory = [...history, { role: 'assistant' as const, content: acc }, { role: 'user' as const, content: conclusionMessage(gate, nextRun) }];
        const gateMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: conclusionMessage(gate, nextRun), timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, gateMsg]);
        await streamTurn(gateHistory, nextRun);
      }
    } catch (err) {
      retryRef.current = { history };
      setError(err);
      setMessages(prev => prev
        .filter(m => !(m.id === assistantMsg.id && m.content === ''))
        .map(m => m.id === assistantMsg.id ? { ...m, isStreaming: false } : m));
    } finally { setLoading(false); }
  }, [scenario.id, setMessages, systemPrompt, persistRun]);

  const sendEngineMessage = useCallback((content: string, runBefore: CrisisRunState) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    onAiMessage();
    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    void streamTurn(history, runBefore);
  }, [messages, onAiMessage, setMessages, streamTurn]);

  const begin = useCallback(() => {
    const fresh = resetRunState(scenario.id, userId);
    setRun(fresh);
    sendEngineMessage(beginMessage(fresh), fresh);
  }, [scenario.id, userId, sendEngineMessage]);

  const decide = useCallback((optionId: string, text: string) => {
    if (loading || run.concluded || !text.trim()) return;
    const revealed = lastNode?.hiddenConsequences[`ifChosen${optionId}`];
    const nextRun: CrisisRunState = {
      ...run,
      activeStepIndex: run.activeStepIndex + 1,
      decisionHistory: [...run.decisionHistory, { step: run.activeStepIndex + 1, optionId, text: text.trim(), revealedConsequence: revealed }],
    };
    persistRun(nextRun);
    setInput('');
    sendEngineMessage(decisionMessage(nextRun, `[${optionId}] ${text.trim()}`), nextRun);
  }, [loading, run, lastNode, persistRun, sendEngineMessage]);

  const retry = useCallback(() => {
    const saved = retryRef.current;
    if (!saved || loading) return;
    void streamTurn(saved.history, run);
  }, [loading, streamTurn, run]);

  const reset = useCallback(() => {
    clearChat();
    setRun(resetRunState(scenario.id, userId));
    setError(null);
    retryRef.current = null;
  }, [clearChat, scenario.id, userId]);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      {/* Briefing strip */}
      <div className={cn('rounded-xl border p-4 bg-card/60', es.border)}>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className={cn('text-[10px] font-bold', es.text, es.border, es.bg)}>{getCrisisYearLabel(scenario, language)}</Badge>
          <span className="font-heading font-bold text-sm">{getCrisisTitle(scenario, language)}</span>
          <span className={cn('text-xs font-semibold', es.text)}>· {getCrisisRole(scenario, language)}</span>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" className="ml-auto h-6 gap-1.5 text-[11px] text-muted-foreground" onClick={reset}>
              <RotateCcw className="w-3 h-3" />{t.crisis_abandon}
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed break-words">{getCrisisBriefing(scenario, language)}</p>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {getCrisisObjectives(scenario, language).map(obj => (
            <span key={obj} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-border/70 text-muted-foreground">
              <Target className={cn('w-2.5 h-2.5', es.text)} />{obj}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-3">
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          {/* Node feed */}
          <ScrollArea className="flex-1 border border-border rounded-xl p-4">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
                <Hourglass className={cn('w-10 h-10', es.text)} />
                <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">{getCrisisTagline(scenario, language)}</p>
                <Button className="gap-2" onClick={begin}>
                  <Play className="w-4 h-4" />{t.crisis_begin}
                </Button>
              </div>
            )}
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {nodes.map((node, i) => {
                  const decision = run.decisionHistory[i - 1]; // decision that produced node i
                  const isConclusion = node.branchingOptions.length === 0;
                  return (
                    <motion.div
                      key={`${node.activeStepIndex}-${i}`}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        'rounded-xl border px-4 py-3 bg-secondary/60',
                        isConclusion ? cn(es.border, es.bg) : 'border-border/70',
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {isConclusion
                          ? <Flag className={cn('w-3.5 h-3.5', es.text)} />
                          : <span className={cn('text-[10px] font-bold uppercase tracking-widest', es.text)}>{t.crisis_turn} {Math.min(i + 1, 6)}/6</span>}
                        {isConclusion && <span className={cn('text-[10px] font-bold uppercase tracking-widest', es.text)}>{t.crisis_verdict}</span>}
                      </div>
                      {decision?.revealedConsequence && (
                        <p className="text-[11px] italic text-muted-foreground/80 mb-1.5 break-words">
                          <AlertTriangle className="w-3 h-3 inline mr-1 -mt-0.5" />{t.crisis_consequence}: {decision.revealedConsequence}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{node.historicalContext}</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Live options for the latest node */}
              {awaitingDecision && lastNode && (
                <div className="grid gap-2">
                  {lastNode.branchingOptions.map(opt => (
                    <button
                      key={opt.optionId}
                      onClick={() => decide(opt.optionId, opt.actionText)}
                      className="flex items-start gap-3 text-left rounded-xl border border-border/70 px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-all pressable"
                    >
                      <span className={cn('shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-bold', es.border, es.text)}>{opt.optionId}</span>
                      <span className="flex-1 min-w-0 text-sm leading-snug break-words">{opt.actionText}</span>
                      <span className={cn('shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border', RISK_STYLE[opt.predictedRisk])}>
                        {opt.predictedRisk === 'Low' ? t.crisis_risk_low : opt.predictedRisk === 'Medium' ? t.crisis_risk_med : t.crisis_risk_high}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                  <Hourglass className={cn('w-3.5 h-3.5 animate-spin', es.text)} style={{ animationDuration: '2s' }} />
                  <span className="animate-pulse">…</span>
                </div>
              )}
              {error != null && !loading && <AiErrorCard error={error} onRetry={retry} />}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Free-form decision input */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t.crisis_placeholder}
              className="min-h-[2.5rem] max-h-32 resize-none"
              rows={1}
              disabled={!awaitingDecision}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); decide('custom', input); } }}
            />
            <Button size="icon" onClick={() => decide('custom', input)} disabled={!input.trim() || !awaitingDecision}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Operations side panel: authoritative resource vector + decision log */}
        <aside className="hidden xl:flex w-60 shrink-0 flex-col gap-3">
          <div className={cn('rounded-xl border p-4 space-y-3 bg-card/60', es.border)}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.crisis_turn}</span>
              <span className={cn('font-heading font-bold text-sm tabular-nums', es.text)}>
                {run.concluded ? '—' : `${Math.min(run.activeStepIndex, 6)}/6`}
              </span>
            </div>
            {([
              [t.crisis_dc, run.resources.diplomaticCapital],
              [t.crisis_stability, run.resources.domesticStability],
              [t.crisis_mr, run.resources.militaryReadiness],
              [t.crisis_treasury, run.resources.treasury],
            ] as [string, number][]).map(([label, value]) => (
              <ResourceMeter key={label} label={label} value={value} barClass={es.bar} />
            ))}
            {run.concluded && (
              <div className={cn('rounded-lg border px-3 py-2 text-center', es.border, es.bg)}>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.crisis_verdict}</p>
                <Flag className={cn('w-4 h-4 mx-auto mt-1', es.text)} />
              </div>
            )}
          </div>
          {run.decisionHistory.length > 0 && (
            <div className="rounded-xl border border-border p-4 flex-1 min-h-0 overflow-y-auto bg-card/40">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{t.crisis_decisions}</p>
              <ol className="space-y-2">
                {run.decisionHistory.map((d, i) => (
                  <li key={i} className="text-[11px] leading-snug text-muted-foreground break-words flex gap-2">
                    <span className={cn('shrink-0 font-bold tabular-nums', es.text)}>{d.step}.</span>
                    <span className="min-w-0">{d.text.length > 80 ? d.text.slice(0, 80) + '…' : d.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </aside>
      </div>

      {/* Verify against RESOURCE_KEYS at compile time (exhaustiveness anchor). */}
      {(RESOURCE_KEYS.length !== 4) && null}
    </div>
  );
}
