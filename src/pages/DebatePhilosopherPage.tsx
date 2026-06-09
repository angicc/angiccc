import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, RotateCcw, Trophy, Clock, Swords, Crown, Brain, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AppShell } from '@/components/layout/AppShell';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { recordDebateWinInProgress } from '@/features/progress/progressStore';
import { streamChatResponse } from '@/features/ai/claudeClient';
import { getTodaysPhilosopher, getTimeUntilNextPhilosopher, hasWonTodaysDebate, recordDebateWin } from '@/features/philosopher/philosophersData';
import type { Philosopher } from '@/features/philosopher/philosophersData';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import type { ChatMessage } from '@/types';

const PHIL_GIF = 'https://media.giphy.com/media/eLudircQfgGEU/giphy.gif';

function formatCountdown(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center shrink-0 mt-0.5">
        <Brain className="w-3.5 h-3.5 text-violet-400" />
      </div>
      <div className="bg-secondary rounded-xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-2 h-2 rounded-full bg-violet-400/70"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function PhilosopherAvatar({ philosopher, size = 28 }: { philosopher: Philosopher; size?: number }) {
  const [imgError, setImgError] = useState(false);
  if (philosopher.imageUrl && !imgError) {
    return (
      <div
        className="rounded-full overflow-hidden shrink-0 border-2 border-violet-500/40"
        style={{ width: size, height: size }}
      >
        <img
          src={philosopher.imageUrl}
          alt={philosopher.name}
          className="w-full h-full object-cover object-top"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }
  const initial = philosopher.name[0];
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-violet-800 to-purple-950 border border-violet-500/40 font-heading font-bold text-violet-200"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initial}
    </div>
  );
}

export default function DebatePhilosopherPage() {
  const { t } = useLanguage();
  const { currentUser, refreshProgress } = useAuth();
  const { subscription } = useSubscription();
  const tier = subscription?.tier ?? 'free';
  const isAllowed = tier !== 'free';

  const philosopher = getTodaysPhilosopher();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [won, setWon] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [countdown, setCountdown] = useState(formatCountdown(getTimeUntilNextPhilosopher()));
  const bottomRef = useRef<HTMLDivElement>(null);

  const alreadyWon = currentUser ? hasWonTodaysDebate(currentUser.id) : false;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(formatCountdown(getTimeUntilNextPhilosopher())), 60000);
    return () => clearInterval(timer);
  }, []);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading || won || alreadyWon) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text.trim(), timestamp: new Date().toISOString() };
    const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: new Date().toISOString(), isStreaming: true };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      let acc = '';
      for await (const chunk of streamChatResponse(history, undefined, philosopher.systemPrompt)) {
        acc += chunk;
        const display = acc.replace(/<<CONCEDE>>/g, '');
        setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: display } : m));
      }

      const concedeDetected = acc.includes('<<CONCEDE>>');
      setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: acc.replace(/<<CONCEDE>>/g, '').trim(), isStreaming: false } : m));

      if (concedeDetected && currentUser && !alreadyWon) {
        const xp = philosopher.xpReward;
        recordDebateWinInProgress(currentUser.id, xp, philosopher.name);
        recordDebateWin(currentUser.id, philosopher.id, xp);
        refreshProgress();
        setWon(true);
        setXpAwarded(xp);
        toast.success(`🏆 You defeated ${philosopher.name}! +${xp} XP`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error connecting to AI.';
      setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: `Error: ${msg}`, isStreaming: false } : m));
    } finally { setLoading(false); }
  }, [messages, loading, won, alreadyWon, philosopher, currentUser, refreshProgress]);

  if (!isAllowed) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-violet-400/10"><Swords className="w-5 h-5 text-violet-400" /></div>
            <div>
              <h1 className="font-heading text-3xl font-bold">{t.debate_title}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{t.debate_subtitle}</p>
            </div>
          </motion.div>
          <UpgradePrompt title={t.debate_title} description={t.debate_pro_only} requiredPlan="pro" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-7rem)]">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ filter: ['drop-shadow(0 0 6px #7c3aed88)', 'drop-shadow(0 0 14px #7c3aedcc)', 'drop-shadow(0 0 6px #7c3aed88)'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <PhilosopherAvatar philosopher={philosopher} size={52} />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-bold">{t.debate_title}</h1>
                <Badge variant="outline" className="text-xs text-violet-400 border-violet-400/30">Pro</Badge>
              </div>
              <p className="text-muted-foreground text-sm">{t.debate_subtitle}</p>
            </div>
          </div>
          {messages.length > 0 && !won && (
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => setMessages([])}>
              <RotateCcw className="w-4 h-4" />{t.debate_new_round}
            </Button>
          )}
        </motion.div>

        <div className="flex-1 min-h-0 flex flex-col">
          <ScrollArea className="flex-1 border border-border rounded-xl overflow-hidden relative p-4">
            {/* GIF background */}
            <img src={PHIL_GIF} alt="" aria-hidden
              className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
            <div className="absolute inset-0 bg-card/25 pointer-events-none" />
            <div className="relative z-10">

              <AnimatePresence>
                {messages.length === 0 && (
                  <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
                    className="flex flex-col items-center gap-6 py-8 text-center">
                    <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                      <PhilosopherAvatar philosopher={philosopher} size={96} />
                    </motion.div>

                    {/* Philosopher card */}
                    <div className="w-full max-w-lg space-y-4">
                      <Card className="border-violet-500/30 bg-violet-500/5">
                        <CardContent className="pt-4 pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-xs text-violet-400 font-medium">{t.debate_today}</p>
                              <h2 className="font-heading text-xl font-bold">{philosopher.name}</h2>
                              <p className="text-xs text-muted-foreground">{philosopher.era} · {philosopher.lifespan}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-amber-400 font-bold">
                                <Star className="w-4 h-4" />
                                <span className="text-lg font-heading">+{philosopher.xpReward} XP</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{t.debate_xp_reward}</p>
                            </div>
                          </div>
                          <p className="text-xs italic text-muted-foreground border-t border-border/40 pt-2 mt-2">
                            "{philosopher.tagline}"
                          </p>
                        </CardContent>
                      </Card>

                      {alreadyWon ? (
                        <Card className="border-amber-400/30 bg-amber-400/5">
                          <CardContent className="pt-4 pb-3 text-center space-y-2">
                            <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                            <p className="font-heading font-bold text-amber-400">{t.debate_already_won}</p>
                            <div className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              {t.debate_next_in}: {countdown}
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <>
                          <div className="text-left">
                            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t.debate_starters}</p>
                            <div className="space-y-2">
                              {philosopher.starterArguments.map((arg, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                                  <Button variant="outline" size="sm"
                                    className="w-full text-xs h-auto py-2.5 text-left justify-start gap-2 hover:border-violet-400/50 hover:bg-violet-400/5 transition-all whitespace-normal"
                                    onClick={() => send(arg)}>
                                    <Swords className="w-3 h-3 text-violet-400 shrink-0 mt-0.5" />
                                    <span className="text-left leading-snug break-words min-w-0">{arg}</span>
                                  </Button>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {t.debate_next_in}: {countdown}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Win overlay */}
              <AnimatePresence>
                {won && (
                  <motion.div
                    key="win"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ y: 30 }}
                      animate={{ y: 0 }}
                      className="bg-card border border-amber-400/40 rounded-2xl p-8 max-w-sm w-full mx-4 text-center space-y-4 shadow-2xl"
                    >
                      <motion.div animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }}>
                        <Trophy className="w-16 h-16 text-amber-400 mx-auto" />
                      </motion.div>
                      <h2 className="font-heading text-2xl font-bold text-amber-400">{t.debate_won_title}</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">{philosopher.name} {t.debate_won_desc}</p>
                      <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
                        <Star className="w-6 h-6" />+{xpAwarded} XP
                      </div>
                      <div className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {t.debate_next_in}: {countdown}
                      </div>
                      <Button className="w-full" onClick={() => setWon(false)}>
                        <RotateCcw className="w-4 h-4 mr-2" />{t.debate_continue_btn}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map(msg => (
                    <motion.div key={msg.id}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'items-start'}`}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="shrink-0 mt-0.5"><PhilosopherAvatar philosopher={philosopher} size={28} /></div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-primary">
                          {currentUser?.avatarInitials ?? 'U'}
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-secondary text-secondary-foreground rounded-tl-sm'
                      } ${msg.isStreaming ? 'streaming-cursor' : ''}`}>
                        {msg.content || (msg.isStreaming ? ' ' : '…')}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <AnimatePresence>{loading && <TypingIndicator />}</AnimatePresence>
                <div ref={bottomRef} />
              </div>
            </div>
          </ScrollArea>

          <div className="mt-3 flex gap-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={alreadyWon || won ? t.debate_already_won : t.debate_placeholder}
              className="min-h-[2.5rem] max-h-32 resize-none"
              rows={1}
              disabled={loading || won || alreadyWon}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            />
            <Button size="icon" onClick={() => send(input)} disabled={!input.trim() || loading || won || alreadyWon}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
