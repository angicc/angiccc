import { useState, useRef, useEffect, useCallback } from 'react';
import { Hourglass, Send, ArrowLeft, RotateCcw, Target, Crown, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppShell } from '@/components/layout/AppShell';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { AiErrorCard } from '@/components/shared/AiErrorCard';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { recordAiMessage } from '@/features/progress/progressStore';
import { streamChatResponse } from '@/services/aiGateway';
import { usePersistentChat } from '@/services/chatStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { stripMarkdown } from '@/lib/utils';
import {
  CRISIS_SCENARIOS, buildCrisisSystemPrompt,
  getCrisisTitle, getCrisisRole, getCrisisTagline,
  type CrisisScenario,
} from '@/features/content/crisisScenarios';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

const ERA_STYLE: Record<CrisisScenario['era'], { text: string; bg: string; border: string; glow: string }> = {
  ancient:        { text: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   glow: 'era-glow-ancient' },
  'middle-ages':  { text: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/30',  glow: 'era-glow-medieval' },
  'early-modern': { text: 'text-teal-400',    bg: 'bg-teal-400/10',    border: 'border-teal-400/30',    glow: 'era-glow-earlymod' },
  modern:         { text: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/30',    glow: 'era-glow-modern' },
};

/** The fixed opener that starts the Chronos Engine's first turn. */
const BEGIN_SIGNAL = 'I am ready. Begin the simulation.';

export default function ChronosCrisisPage() {
  const { t, language } = useLanguage();
  const { currentUser, refreshProgress } = useAuth();
  const { canAI, trackAiMessage } = useSubscription();
  const [scenario, setScenario] = useState<CrisisScenario | null>(null);
  const { allowed, reason } = canAI();

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-7rem)]">
        {/* Header */}
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

        {!allowed && <UpgradePrompt description={reason} requiredPlan={reason?.includes('Master') ? 'master' : 'pro'} />}

        {allowed && !scenario && (
          <div className="grid sm:grid-cols-2 gap-4 overflow-y-auto pb-4 cascade-in">
            {CRISIS_SCENARIOS.map(s => {
              const es = ERA_STYLE[s.era];
              return (
                <button
                  key={s.id}
                  onClick={() => setScenario(s)}
                  className={cn(
                    'text-left p-5 rounded-2xl border bg-card/70 era-glow pressable transition-all group',
                    es.border, es.glow,
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className={cn('text-[10px] font-bold', es.text, es.border, es.bg)}>
                      {s.yearLabel}
                    </Badge>
                    <Crown className={cn('w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity', es.text)} />
                  </div>
                  <h2 className="font-heading text-lg font-bold leading-snug">{getCrisisTitle(s, language)}</h2>
                  <p className={cn('text-xs font-semibold mt-1', es.text)}>{getCrisisRole(s, language)}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed mt-2 break-words">{getCrisisTagline(s, language)}</p>
                </button>
              );
            })}
          </div>
        )}

        {allowed && scenario && (
          <CrisisRoom
            key={scenario.id}
            scenario={scenario}
            userId={currentUser?.id}
            onAiMessage={() => {
              if (currentUser) { recordAiMessage(currentUser.id); trackAiMessage(); refreshProgress(); }
            }}
          />
        )}
      </div>
    </AppShell>
  );
}

function CrisisRoom({ scenario, userId, onAiMessage }: {
  scenario: CrisisScenario;
  userId?: string;
  onAiMessage: () => void;
}) {
  const { t, language } = useLanguage();
  const [messages, setMessages, clearChat] = usePersistentChat(`crisis:${scenario.id}`, userId);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const retryRef = useRef<{ history: { role: 'user' | 'assistant'; content: string }[] } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const es = ERA_STYLE[scenario.era];
  const systemPrompt = buildCrisisSystemPrompt(scenario);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const stream = useCallback(async (history: { role: 'user' | 'assistant'; content: string }[]) => {
    const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: new Date().toISOString(), isStreaming: true };
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(true);
    setError(null);
    try {
      let acc = '';
      for await (const chunk of streamChatResponse(history, undefined, systemPrompt)) {
        acc += chunk;
        setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: stripMarkdown(acc) } : m));
      }
      setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, isStreaming: false } : m));
      retryRef.current = null;
    } catch (err) {
      retryRef.current = { history };
      setError(err);
      setMessages(prev => prev
        .filter(m => !(m.id === assistantMsg.id && m.content === ''))
        .map(m => m.id === assistantMsg.id ? { ...m, isStreaming: false } : m));
    } finally { setLoading(false); }
  }, [setMessages, systemPrompt]);

  const send = useCallback((text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    onAiMessage();
    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    void stream(history);
  }, [messages, loading, onAiMessage, setMessages, stream]);

  const retry = useCallback(() => {
    const saved = retryRef.current;
    if (!saved || loading) return;
    void stream(saved.history);
  }, [loading, stream]);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      {/* Briefing panel */}
      <div className={cn('rounded-xl border p-4', es.border, 'bg-card/60')}>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className={cn('text-[10px] font-bold', es.text, es.border, es.bg)}>{scenario.yearLabel}</Badge>
          <span className="font-heading font-bold text-sm">{getCrisisTitle(scenario, language)}</span>
          <span className={cn('text-xs font-semibold', es.text)}>· {getCrisisRole(scenario, language)}</span>
          {(messages.length > 0) && (
            <Button
              variant="ghost" size="sm"
              className="ml-auto h-6 gap-1.5 text-[11px] text-muted-foreground"
              onClick={() => { clearChat(); setError(null); retryRef.current = null; }}
            >
              <RotateCcw className="w-3 h-3" />{t.crisis_abandon}
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed break-words">{scenario.briefing}</p>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {scenario.objectives.map(obj => (
            <span key={obj} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-border/70 text-muted-foreground">
              <Target className={cn('w-2.5 h-2.5', es.text)} />{obj}
            </span>
          ))}
        </div>
      </div>

      {/* Simulation feed */}
      <ScrollArea className="flex-1 border border-border rounded-xl p-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
            <Hourglass className={cn('w-10 h-10', es.text)} />
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">{getCrisisTagline(scenario, language)}</p>
            <Button className="gap-2" onClick={() => send(BEGIN_SIGNAL)}>
              <Play className="w-4 h-4" />{t.crisis_begin}
            </Button>
          </div>
        )}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : cn('bg-secondary text-secondary-foreground rounded-tl-sm border-l-2', es.border),
                    msg.isStreaming ? 'streaming-cursor' : '',
                  )}
                >
                  {msg.content || (msg.isStreaming ? ' ' : '...')}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {error != null && !loading && <AiErrorCard error={error} onRetry={retry} />}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Decision input */}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t.crisis_placeholder}
          className="min-h-[2.5rem] max-h-32 resize-none"
          rows={1}
          disabled={loading || messages.length === 0}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
        />
        <Button size="icon" onClick={() => send(input)} disabled={!input.trim() || loading || messages.length === 0}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
