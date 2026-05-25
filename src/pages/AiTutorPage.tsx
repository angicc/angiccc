import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, RotateCcw, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AppShell } from '@/components/layout/AppShell';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { recordAiMessage } from '@/features/progress/progressStore';
import { streamChatResponse } from '@/features/ai/claudeClient';
import type { ChatMessage } from '@/types';

const SUGGESTIONS = ['What caused the fall of the Roman Empire?','Explain the Crusades in simple terms','Why was the Renaissance important?','How did WWI lead to WWII?'];

export default function AiTutorPage() {
  const { currentUser, refreshProgress } = useAuth();
  const { canAI, trackAiMessage } = useSubscription();
  const [params] = useSearchParams();
  const context = params.get('context') ?? undefined;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = useCallback(async (text: string) => {
    const { allowed, reason } = canAI();
    if (!allowed) { return; }
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text.trim(), timestamp: new Date().toISOString() };
    const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: new Date().toISOString(), isStreaming: true };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setLoading(true);

    if (currentUser) { recordAiMessage(currentUser.id); trackAiMessage(); refreshProgress(); }

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      let acc = '';
      for await (const chunk of streamChatResponse(history, context)) {
        acc += chunk;
        setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: acc } : m));
      }
      setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, isStreaming: false } : m));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred. Check your API key.';
      setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: `Error: ${msg}`, isStreaming: false } : m));
    } finally { setLoading(false); }
  }, [messages, canAI, context, currentUser, loading, refreshProgress, trackAiMessage]);

  const { allowed, reason } = canAI();

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-7rem)]">
        <div className="flex items-center justify-between mb-4">
          <div><h1 className="font-heading text-2xl font-bold">AI History Tutor</h1><p className="text-muted-foreground text-sm">Ask Clio anything about world history</p></div>
          {messages.length > 0 && <Button variant="ghost" size="sm" className="gap-2" onClick={() => setMessages([])}><RotateCcw className="w-4 h-4" />New Chat</Button>}
        </div>

        {!allowed && <UpgradePrompt description={reason} requiredPlan={reason?.includes('Master') ? 'master' : 'pro'} />}

        <div className="flex-1 min-h-0 flex flex-col">
          <ScrollArea className="flex-1 border border-border rounded-xl bg-card p-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-6 py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"><Bot className="w-8 h-8 text-primary" /></div>
                <div><h2 className="font-heading text-xl font-semibold">Hello, I'm Clio!</h2><p className="text-muted-foreground text-sm mt-1 max-w-sm">Your AI history tutor. Ask me about any period of history and I'll help you understand.</p></div>
                {allowed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                    {SUGGESTIONS.map(s => <Button key={s} variant="outline" size="sm" className="text-xs h-auto py-2 text-left justify-start" onClick={() => send(s)}>{s}</Button>)}
                  </div>
                )}
              </div>
            )}
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 message-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                    <AvatarFallback className={`text-xs ${msg.role === 'assistant' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>{msg.role === 'assistant' ? 'C' : (currentUser?.avatarInitials ?? 'U')}</AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} ${msg.isStreaming ? 'streaming-cursor' : ''}`}>
                    {msg.content || (msg.isStreaming ? '' : '…')}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="mt-3 flex gap-2">
            <Textarea
              value={input} onChange={e => setInput(e.target.value)} placeholder={allowed ? 'Ask Clio about history…' : 'Upgrade to use the AI Tutor'}
              className="min-h-[2.5rem] max-h-32 resize-none" rows={1} disabled={!allowed || loading}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            />
            <Button size="icon" onClick={() => send(input)} disabled={!input.trim() || !allowed || loading}><Send className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
