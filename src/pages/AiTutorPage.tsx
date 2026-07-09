import { useState, useRef, useEffect, useCallback } from 'react';
import { stripMarkdown } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';
import { Send, RotateCcw, Sword, Globe, BookOpen, Scroll, Sparkles, Landmark, History, Trash2, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppShell } from '@/components/layout/AppShell';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { recordAiMessage } from '@/features/progress/progressStore';
import { getGapSummary } from '@/features/progress/conceptGaps';
import { streamChatResponse } from '@/services/aiGateway';
import { usePersistentChat, listThreads, createThread, titleThread, deleteThread, threadModule, type ChatThread } from '@/services/chatStore';
import { AiErrorCard } from '@/components/shared/AiErrorCard';
import { CLIO_SAMPLE_DIALOGUES } from '@/features/ai/clioSampleDialogues';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ChatMessage } from '@/types';

const SUGGESTION_ICONS = [Landmark, Globe, BookOpen, Scroll, Sparkles, Sword];

function ClioAvatar({ size = 60 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <radialGradient id="clioBg" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="100%" stopColor="#1c0a02" />
        </radialGradient>
        <linearGradient id="clioRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Outer glow ring */}
      <circle cx="40" cy="40" r="39" fill="none" stroke="url(#clioRing)" strokeWidth="2.5" />
      {/* Background */}
      <circle cx="40" cy="40" r="37" fill="url(#clioBg)" />
      {/* Hair back */}
      <ellipse cx="40" cy="20" rx="14" ry="9" fill="#3d1f08" />
      <path d="M26 23 Q22 35 28 43" fill="#3d1f08" />
      <path d="M54 23 Q58 35 52 43" fill="#3d1f08" />
      {/* Head */}
      <ellipse cx="40" cy="29" rx="11" ry="12" fill="#c8956c" />
      {/* Hair front overlay */}
      <ellipse cx="40" cy="19" rx="12" ry="7" fill="#4a2c0a" />
      {/* Crown / tiara */}
      <path d="M29 20 L32 14 L40 17 L48 14 L51 20" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="40" cy="16.5" r="2.5" fill="#f59e0b" />
      <circle cx="32" cy="14" r="1.5" fill="#fbbf24" />
      <circle cx="48" cy="14" r="1.5" fill="#fbbf24" />
      {/* Eyes */}
      <ellipse cx="36" cy="28" rx="2.3" ry="1.9" fill="#1a0a00" />
      <ellipse cx="44" cy="28" rx="2.3" ry="1.9" fill="#1a0a00" />
      <circle cx="36.8" cy="27.4" r="0.9" fill="white" opacity="0.85" />
      <circle cx="44.8" cy="27.4" r="0.9" fill="white" opacity="0.85" />
      {/* Mouth / smile */}
      <path d="M37 34 Q40 36.5 43 34" stroke="#a0604a" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Robe / body */}
      <path d="M27 41 Q40 38 53 41 L57 74 Q40 77 23 74 Z" fill="#5b21b6" opacity="0.85" />
      {/* Robe detail lines */}
      <path d="M33 41 Q31 57 30 74" stroke="#7c3aed" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M47 41 Q49 57 50 74" stroke="#7c3aed" strokeWidth="0.8" fill="none" opacity="0.5" />
      {/* Scroll */}
      <g transform="translate(42,50) rotate(-18)">
        <rect x="0" y="0" width="20" height="13" rx="2" fill="#fef3c7" />
        <ellipse cx="0" cy="6.5" rx="3.5" ry="6.5" fill="#d97706" />
        <ellipse cx="20" cy="6.5" rx="3.5" ry="6.5" fill="#d97706" />
        <line x1="3" y1="4.5" x2="17" y2="4.5" stroke="#78350f" strokeWidth="0.8" />
        <line x1="3" y1="7.5" x2="17" y2="7.5" stroke="#78350f" strokeWidth="0.8" />
        <line x1="3" y1="10.5" x2="17" y2="10.5" stroke="#78350f" strokeWidth="0.8" />
      </g>
      {/* Sparkles */}
      <circle cx="16" cy="23" r="2" fill="#f59e0b" opacity="0.9" />
      <circle cx="64" cy="20" r="1.5" fill="#fbbf24" opacity="0.8" />
      <circle cx="67" cy="52" r="2" fill="#f59e0b" opacity="0.65" />
      <circle cx="13" cy="57" r="1.5" fill="#fbbf24" opacity="0.55" />
      {/* Star at top-left */}
      <path d="M16 23 L17.2 19.8 L20.4 19.8 L17.8 21.8 L18.6 25 L16 23.2 L13.4 25 L14.2 21.8 L11.6 19.8 L14.8 19.8 Z" fill="#f59e0b" opacity="0.8" />
    </svg>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex gap-3 items-start"
    >
      <div className="shrink-0 mt-0.5"><ClioAvatar size={28} /></div>
      <div className="bg-secondary rounded-xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/70"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

const CLIO_GIF = 'https://media.giphy.com/media/cLr9ItoqnmxEMfTaWA/giphy.gif';

export default function AiTutorPage() {
  const { currentUser, refreshProgress } = useAuth();
  const { canAI, trackAiMessage } = useSubscription();
  const { t } = useLanguage();
  const SUGGESTIONS = [
    { icon: SUGGESTION_ICONS[0], text: t.sugg_1 },
    { icon: SUGGESTION_ICONS[1], text: t.sugg_2 },
    { icon: SUGGESTION_ICONS[2], text: t.sugg_3 },
    { icon: SUGGESTION_ICONS[3], text: t.sugg_4 },
    { icon: SUGGESTION_ICONS[4], text: t.sugg_5 },
    { icon: SUGGESTION_ICONS[5], text: t.sugg_6 },
  ];
  const [params] = useSearchParams();
  // Lesson context from deep links, enriched with the student's active
  // concept gaps so Clio proactively targets what they keep missing.
  const gapSummary = getGapSummary(currentUser?.id);
  const baseContext = params.get('context') ?? undefined;
  const context = [baseContext, gapSummary].filter(Boolean).join('\n') || undefined;
  const activeThreadKey = `historify:chat:active:tutor${currentUser ? `:${currentUser.id}` : ''}`;
  const [threadId, setThreadId] = useState<string>(() => localStorage.getItem(activeThreadKey) ?? 'main');
  const [threads, setThreads] = useState<ChatThread[]>(() => listThreads('tutor', currentUser?.id));
  const [showHistory, setShowHistory] = useState(false);
  useEffect(() => { try { localStorage.setItem(activeThreadKey, threadId); } catch { /* ignore */ } }, [activeThreadKey, threadId]);
  const [messages, setMessages, clearChat] = usePersistentChat(threadModule('tutor', threadId), currentUser?.id);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const retryRef = useRef<{ history: { role: 'user' | 'assistant'; content: string }[] } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const avatarKey = currentUser ? `historify:avatar:${currentUser.id}` : '';
  const [avatarUrl] = useState(() => (avatarKey ? localStorage.getItem(avatarKey) ?? '' : ''));

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Runs one streaming exchange against an already-built history. On failure
  // the empty bubble is dropped, the history is stashed for the retry card,
  // and any partial text is kept so nothing the model said is lost.
  const stream = useCallback(async (history: { role: 'user' | 'assistant'; content: string }[]) => {
    const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: new Date().toISOString(), isStreaming: true };
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(true);
    setError(null);
    try {
      let acc = '';
      for await (const chunk of streamChatResponse(history, context)) {
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
  }, [context, setMessages]);

  const send = useCallback(async (text: string) => {
    const { allowed } = canAI();
    if (!allowed || !text.trim() || loading) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (currentUser) { recordAiMessage(currentUser.id); trackAiMessage(); refreshProgress(); }
    if (threadId !== 'main' && messages.length === 0) {
      titleThread('tutor', threadId, text.trim(), currentUser?.id);
      setThreads(listThreads('tutor', currentUser?.id));
    }

    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    void stream(history);
  }, [messages, canAI, currentUser, loading, refreshProgress, trackAiMessage, setMessages, stream, threadId]);

  const retry = useCallback(() => {
    const saved = retryRef.current;
    if (!saved || loading) return;
    void stream(saved.history);
  }, [loading, stream]);

  // Load a curated example exchange into the (empty) chat so new students can
  // see what a rich Socratic session with Clio looks like before typing.
  const loadExample = useCallback((dialogueId: string) => {
    const dialogue = CLIO_SAMPLE_DIALOGUES.find(d => d.id === dialogueId);
    if (!dialogue || loading) return;
    setMessages(dialogue.turns.map(turn => ({
      id: crypto.randomUUID(),
      role: turn.role,
      content: turn.content,
      timestamp: new Date().toISOString(),
    })));
  }, [loading, setMessages]);

  const { allowed, reason } = canAI();

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-7rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ filter: ['drop-shadow(0 0 6px #f59e0b88)', 'drop-shadow(0 0 12px #f59e0bcc)', 'drop-shadow(0 0 6px #f59e0b88)'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ClioAvatar size={52} />
            </motion.div>
            <div>
              <h1 className="font-heading text-2xl font-bold">Clio</h1>
              <p className="text-muted-foreground text-sm">{t.tutor_subtitle}</p>
            </div>
          </div>
          <div className="relative flex items-center gap-1">
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => setShowHistory(s => !s)}>
              <History className="w-4 h-4" />{t.tutor_history}
            </Button>
            <Button
              variant="ghost" size="sm" className="gap-2"
              onClick={() => {
                const th = createThread('tutor', currentUser?.id);
                setThreads(listThreads('tutor', currentUser?.id));
                setThreadId(th.id);
                setError(null); retryRef.current = null; setShowHistory(false);
              }}
            >
              <Plus className="w-4 h-4" />{t.tutor_new_chat}
            </Button>
            {messages.length > 0 && (
              <Button
                variant="ghost" size="sm" className="gap-2 text-muted-foreground"
                title={t.tutor_clear_title}
                onClick={() => {
                  if (!window.confirm(t.tutor_clear_confirm)) return;
                  clearChat(); setError(null); retryRef.current = null;
                }}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
            {showHistory && (
              <div className="absolute right-0 top-10 z-30 w-72 max-h-80 overflow-y-auto rounded-xl border border-border glass-panel shadow-2xl p-2 space-y-0.5">
                {[{ id: 'main', title: t.tutor_thread_first, createdAt: '', updatedAt: '' } as ChatThread, ...[...threads].reverse()].map(th => (
                  <div
                    key={th.id}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs cursor-pointer transition-colors ${th.id === threadId ? 'bg-primary/15 text-primary font-semibold' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}
                    onClick={() => { setThreadId(th.id); setError(null); retryRef.current = null; setShowHistory(false); }}
                  >
                    <History className="w-3 h-3 shrink-0" />
                    <span className="flex-1 min-w-0 truncate">{th.title || t.tutor_thread_untitled}</span>
                    {th.updatedAt && <span className="text-[9px] text-muted-foreground/60 shrink-0">{new Date(th.updatedAt).toLocaleDateString()}</span>}
                    {th.id !== 'main' && (
                      <button
                        className="shrink-0 text-muted-foreground/50 hover:text-red-400 transition-colors"
                        onClick={e => {
                          e.stopPropagation();
                          deleteThread('tutor', th.id, currentUser?.id);
                          setThreads(listThreads('tutor', currentUser?.id));
                          if (th.id === threadId) setThreadId('main');
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {!allowed && <UpgradePrompt description={reason} requiredPlan={reason?.includes('Master') ? 'master' : 'pro'} />}

        <div className="flex-1 min-h-0 flex flex-col">
          <ScrollArea className="flex-1 border border-border rounded-xl overflow-hidden relative p-4">
            {/* Cinematic GIF background */}
            <img
              src={CLIO_GIF}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
            />
            <div className="absolute inset-0 bg-card/40 pointer-events-none" />
            <div className="relative z-10">
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col items-center gap-6 py-8 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ClioAvatar size={96} />
                  </motion.div>
                  <div>
                    <h2 className="font-heading text-2xl font-semibold">{t.tutor_hello}</h2>
                    <p className="text-muted-foreground text-sm mt-2 max-w-sm leading-relaxed mx-auto">
                      {t.tutor_desc}
                    </p>
                  </div>
                  {allowed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                      {SUGGESTIONS.map((s, i) => (
                        <motion.div
                          key={s.text}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.07 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs h-auto py-3 text-left justify-start gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all whitespace-normal"
                            onClick={() => send(s.text)}
                          >
                            <s.icon className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="text-left leading-snug break-words min-w-0">{s.text}</span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {allowed && (
                    <div className="w-full max-w-lg space-y-1.5">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">{t.tutor_examples}</p>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {CLIO_SAMPLE_DIALOGUES.map(d => (
                          <button
                            key={d.id}
                            onClick={() => loadExample(d.id)}
                            className="text-[11px] px-3 py-1.5 rounded-full border border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
                          >
                            {d.topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'items-start'}`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="shrink-0 mt-0.5"><ClioAvatar size={28} /></div>
                    ) : (
                      <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                        {avatarUrl && <AvatarImage src={avatarUrl} alt={currentUser?.username ?? ''} />}
                        <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                          {currentUser?.avatarInitials ?? 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-secondary text-secondary-foreground rounded-tl-sm'
                      } ${msg.isStreaming ? 'streaming-cursor' : ''}`}
                    >
                      {msg.role === 'assistant' ? stripMarkdown(msg.content || (msg.isStreaming ? ' ' : '...')) : (msg.content || '...')}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <AnimatePresence>{loading && <TypingIndicator />}</AnimatePresence>
              {error != null && !loading && (
                <div className="flex gap-3 items-start">
                  <div className="shrink-0 mt-0.5"><ClioAvatar size={28} /></div>
                  <AiErrorCard error={error} onRetry={retry} />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            </div>
          </ScrollArea>

          <div className="mt-3 flex gap-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={allowed ? t.tutor_placeholder : t.tutor_upgrade_msg}
              className="min-h-[2.5rem] max-h-32 resize-none"
              rows={1}
              disabled={!allowed || loading}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            />
            <Button size="icon" onClick={() => send(input)} disabled={!input.trim() || !allowed || loading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
