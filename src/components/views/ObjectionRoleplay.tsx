import { useState, useRef, useEffect } from 'react';
import { useAuditStore } from '../../store/auditState';
import { runObjectionTurn, OBJECTION_OPENINGS_MAP, type ObjectionScenario, type ChatMessage } from '../../services/aiAgentService';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';
import MetricRing from '../ui/MetricRing';
import { Swords, Send, RotateCcw, DollarSign, Users, Clock, Wallet, Mail } from 'lucide-react';

const SCENARIOS: { id: ObjectionScenario; label: string; icon: React.ElementType; description: string; color: string }[] = [
  { id: 'price', label: 'Price Too High', icon: DollarSign, description: 'Prospect says your product is too expensive', color: 'text-amber-400' },
  { id: 'competitor', label: 'Using Competitor', icon: Users, description: 'Locked into a contract with another solution', color: 'text-red-400' },
  { id: 'timing', label: 'Bad Timing', icon: Clock, description: 'Mid-project, not evaluating tools now', color: 'text-indigo-400' },
  { id: 'no_budget', label: 'Budget Freeze', icon: Wallet, description: 'No budget approval available right now', color: 'text-orange-400' },
  { id: 'send_info', label: '"Just Send Info"', icon: Mail, description: 'Classic stall — avoiding a real conversation', color: 'text-cyan-400' },
];

type RoundResult = { score: number; feedback: string };

export default function ObjectionRoleplay() {
  const { addXp } = useAuditStore();
  const [scenario, setScenario] = useState<ObjectionScenario>('price');
  const [phase, setPhase] = useState<'select' | 'active' | 'complete'>('select');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function startScenario() {
    const opening = OBJECTION_OPENINGS_MAP[scenario];
    setMessages([{ role: 'assistant', content: opening }]);
    setPhase('active');
    setRoundResults([]);
    setCurrentScore(null);
    setFinalScore(null);
  }

  async function handleReply() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: text };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const rounds = updatedHistory.filter((m) => m.role === 'user').length;
      const shouldEnd = rounds >= 4;

      // Grade the user response + get prospect reply
      const gradeResult = await runObjectionTurn(scenario, updatedHistory, true);
      const newRound: RoundResult = { score: gradeResult.score, feedback: gradeResult.feedback };
      const newRounds = [...roundResults, newRound];
      setRoundResults(newRounds);
      setCurrentScore(gradeResult.score);

      // Award XP for this round
      const xpEarned = Math.round(gradeResult.score / 10);
      if (xpEarned > 0) addXp(xpEarned);

      if (shouldEnd || gradeResult.isEnding) {
        const avg = Math.round(newRounds.reduce((a, r) => a + r.score, 0) / newRounds.length);
        setFinalScore(avg);
        setPhase('complete');
      } else if (gradeResult.prospectReply) {
        setMessages([...updatedHistory, { role: 'assistant', content: gradeResult.prospectReply }]);
      }
    } catch {
      setMessages([...updatedHistory, { role: 'assistant', content: 'Error: could not generate response.' }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setPhase('select');
    setMessages([]);
    setInput('');
    setCurrentScore(null);
    setRoundResults([]);
    setFinalScore(null);
  }

  const activeScenarioCfg = SCENARIOS.find((s) => s.id === scenario)!;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Objection Handling Roleplay</h2>
        <p className="text-sm text-slate-500 mt-1">The AI plays a skeptical B2B prospect. Practice handling objections and receive real-time scoring on each response.</p>
      </div>

      {phase === 'select' && (
        <>
          <PremiumCard glow="none">
            <div className="flex items-center gap-2 mb-4">
              <Swords className="w-4 h-4 text-red-400" />
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Choose Your Objection Scenario</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SCENARIOS.map((s) => {
                const Icon = s.icon;
                const isActive = scenario === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setScenario(s.id)}
                    className={`p-4 rounded-xl border text-left transition-all hover:-translate-y-[1px] ${isActive ? 'bg-slate-800/60 border-white/[0.1] ring-1 ring-white/10' : 'bg-slate-900/40 border-white/[0.06] hover:border-white/10'}`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isActive ? s.color : 'text-slate-600'}`} />
                    <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{s.label}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">{s.description}</p>
                  </button>
                );
              })}
            </div>
          </PremiumCard>
          <div className="flex items-center gap-4">
            <GlowButton variant="primary" icon={<Swords className="w-4 h-4" />} onClick={startScenario}>
              Start Roleplay
            </GlowButton>
            <p className="text-xs text-slate-600">You'll have 4 rounds to handle the objection. Score 0–100 per response.</p>
          </div>
        </>
      )}

      {(phase === 'active' || phase === 'complete') && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Chat */}
          <div className="lg:col-span-3 flex flex-col" style={{ height: '520px' }}>
            <PremiumCard glow="none" className="flex flex-col h-full !p-0 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] flex-shrink-0">
                <div className={`w-8 h-8 rounded-full bg-slate-700 border border-white/[0.1] flex items-center justify-center`}>
                  <span className="text-sm font-bold text-slate-300">P</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Skeptical Prospect</p>
                  <p className="text-[10px] text-slate-500">Scenario: {activeScenarioCfg.label}</p>
                </div>
                {phase === 'complete' && (
                  <button onClick={handleReset} className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> New Scenario
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-500/15 border border-indigo-500/20 text-slate-200'
                        : 'bg-slate-800/60 border border-white/[0.06] text-slate-300'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/60 border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                {phase === 'complete' && (
                  <div className="text-center py-3">
                    <span className="text-xs text-slate-600 bg-slate-900 px-3 py-1 rounded-full border border-white/[0.05]">Roleplay complete</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              {phase === 'active' && (
                <div className="px-3 pb-3 flex-shrink-0">
                  <div className="flex items-center gap-2 bg-slate-800/60 border border-white/[0.08] rounded-xl px-3 py-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleReply())}
                      placeholder="Type your response to the prospect..."
                      disabled={isLoading}
                      className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                    <button
                      onClick={handleReply}
                      disabled={!input.trim() || isLoading}
                      className="w-7 h-7 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 flex items-center justify-center transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-700 mt-1 ml-1">
                    Round {roundResults.length + 1} of 4 · {Math.max(0, 4 - roundResults.length)} remaining
                  </p>
                </div>
              )}
            </PremiumCard>
          </div>

          {/* Score panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Current score */}
            <PremiumCard glow={currentScore !== null && currentScore >= 75 ? 'emerald' : 'none'} className="flex flex-col items-center py-4 gap-3">
              <MetricRing
                label={phase === 'complete' ? 'Final Score' : 'Last Score'}
                value={phase === 'complete' ? (finalScore ?? 0) : (currentScore ?? 0)}
                size={100}
              />
              {currentScore !== null && (
                <p className="text-[10px] text-slate-500 text-center">
                  +{Math.round((currentScore ?? 0) / 10)} XP earned this round
                </p>
              )}
            </PremiumCard>

            {/* Round breakdown */}
            {roundResults.length > 0 && (
              <PremiumCard glow="none">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3 font-semibold">Round Scores</p>
                <div className="space-y-2">
                  {roundResults.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-600 w-12">Round {i + 1}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${r.score >= 75 ? 'bg-emerald-400' : r.score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${r.score}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold tabular-nums w-8 text-right ${r.score >= 75 ? 'text-emerald-400' : r.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {r.score}
                      </span>
                    </div>
                  ))}
                </div>
              </PremiumCard>
            )}

            {/* Last feedback */}
            {roundResults.length > 0 && (
              <PremiumCard glow="none">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-semibold">AI Coaching</p>
                <p className="text-xs text-slate-400 leading-relaxed">{roundResults[roundResults.length - 1].feedback}</p>
              </PremiumCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
