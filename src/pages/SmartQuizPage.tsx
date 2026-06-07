import { useState, useMemo } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Brain, Target, Trophy, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AppShell } from '@/components/layout/AppShell';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { QUIZZES } from '@/features/quiz/quizData';
import { ERAS } from '@/features/content/erasData';
import { recordQuizAttempt } from '@/features/progress/progressStore';
import type { QuizAttempt } from '@/types';
import { toast } from 'sonner';

const ERA_COLOR: Record<string, string> = {
  ancient: 'text-amber-400 border-amber-400/30 bg-amber-400/8',
  'middle-ages': 'text-blue-400 border-blue-400/30 bg-blue-400/8',
  'early-modern': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/8',
  modern: 'text-rose-400 border-rose-400/30 bg-rose-400/8',
};
const DIFF_COLOR: Record<string, string> = {
  easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  hard: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
};

const SESSION_SIZE = 10;

type QuestionWithMeta = {
  id: string; question: string; options: string[]; correctIndex: number;
  explanation: string; difficulty: string; eraId: string; eraName: string;
};

// Adaptive selection: weight questions by era weakness + difficulty targeting
function selectAdaptiveQuestions(
  allQuestions: QuestionWithMeta[],
  quizScores: Record<string, number>,
  count: number
): QuestionWithMeta[] {
  const eraWeight = (eraId: string) => {
    const eraQuiz = QUIZZES.find(q => q.eraId === eraId);
    if (!eraQuiz) return 1;
    const score = quizScores[eraQuiz.id] ?? -1;
    if (score < 0)   return 3.5;   // never attempted → very high weight
    if (score < 50)  return 3.0;   // weak era
    if (score < 70)  return 2.0;   // passing but shaky
    if (score < 90)  return 1.0;   // good
    return 0.5;                    // mastered
  };

  // Compute average era score to calibrate difficulty weighting
  const avgScore = Object.values(quizScores).length > 0
    ? Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.values(quizScores).length
    : 0;

  const diffWeight = (d: string) => {
    if (avgScore < 40)  return d === 'easy' ? 2.5 : d === 'medium' ? 1.0 : 0.3;
    if (avgScore < 70)  return d === 'easy' ? 1.0 : d === 'medium' ? 2.0 : 1.0;
    return d === 'easy' ? 0.5 : d === 'medium' ? 1.5 : 2.5;  // high scorers → harder
  };

  // Assign weights and shuffle using weighted random
  const weighted = allQuestions.map(q => ({
    q,
    weight: eraWeight(q.eraId) * diffWeight(q.difficulty) * (0.7 + Math.random() * 0.6),
  }));
  weighted.sort((a, b) => b.weight - a.weight);

  // Take top `count`, then shuffle the selected set
  const top = weighted.slice(0, Math.min(count, weighted.length)).map(w => w.q);
  for (let i = top.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [top[i], top[j]] = [top[j], top[i]];
  }
  return top;
}

type Phase = 'intro' | 'question' | 'explain' | 'done';

export default function SmartQuizPage() {
  const { progress, currentUser, refreshProgress } = useAuth();
  const { subscription } = useSubscription();
  const tier = subscription?.tier ?? 'free';

  // Build flat question pool with era metadata
  const allQuestions = useMemo<QuestionWithMeta[]>(() =>
    QUIZZES.flatMap(quiz =>
      quiz.questions.map(q => ({
        ...q,
        eraId: quiz.eraId,
        eraName: ERAS.find(e => e.id === quiz.eraId)?.shortName ?? quiz.eraId,
      }))
    ), []);

  const [phase, setPhase]     = useState<Phase>('intro');
  const [session, setSession] = useState<QuestionWithMeta[]>([]);
  const [qIdx, setQIdx]       = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  function startSession() {
    const q = selectAdaptiveQuestions(allQuestions, progress?.quizScores ?? {}, SESSION_SIZE);
    setSession(q);
    setQIdx(0);
    setSelected(null);
    setAnswers([]);
    setXpEarned(0);
    setPhase('question');
  }

  function submitAnswer() {
    if (selected === null) return;
    const correct = selected === session[qIdx].correctIndex;
    setAnswers(prev => [...prev, correct]);
    setPhase('explain');
  }

  function advance() {
    if (qIdx + 1 >= session.length) {
      const correct = [...answers, selected === session[qIdx].correctIndex].filter(Boolean).length;
      const xp = correct * 15;
      setXpEarned(xp);
      if (currentUser) {
        const attempt: QuizAttempt = {
          quizId: 'smart-quiz', score: Math.round((correct / session.length) * 100),
          completedAt: new Date().toISOString(), xpEarned: xp,
          answers: session.map((q, i) => ({ questionId: q.id, selectedIndex: answers[i] ? q.correctIndex : -1, correct: !!answers[i] })),
        };
        recordQuizAttempt(currentUser.id, attempt, 'Smart Quiz');
        refreshProgress();
        toast.success(`Smart Quiz complete! +${xp} XP earned`);
      }
      setPhase('done');
    } else {
      setQIdx(i => i + 1);
      setSelected(null);
      setPhase('question');
    }
  }

  const q = session[qIdx];
  const correctCount = answers.filter(Boolean).length;
  const score = session.length > 0 ? Math.round((correctCount / session.length) * 100) : 0;

  // Per-era breakdown for results
  const eraBreakdown = useMemo(() => {
    if (phase !== 'done' || session.length === 0) return [];
    const map: Record<string, { name: string; correct: number; total: number }> = {};
    session.forEach((q, i) => {
      if (!map[q.eraId]) map[q.eraId] = { name: q.eraName, correct: 0, total: 0 };
      map[q.eraId].total++;
      if (answers[i]) map[q.eraId].correct++;
    });
    return Object.entries(map).map(([eraId, d]) => ({ eraId, ...d }));
  }, [phase, session, answers]);

  // Weak areas detected from current progress
  const weakAreas = useMemo(() => {
    if (!progress) return [];
    return QUIZZES
      .filter(q => {
        const score = progress.quizScores[q.id];
        return score !== undefined && score < 70;
      })
      .map(q => ({ eraId: q.eraId, name: ERAS.find(e => e.id === q.eraId)?.shortName ?? '', score: progress.quizScores[q.id] }));
  }, [progress]);

  if (tier === 'free') {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-violet-400/10">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">Smart Quiz</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Adaptive questions targeting your weakest areas</p>
            </div>
          </motion.div>
          <UpgradePrompt
            feature="Smart Quiz"
            reason="Smart Quiz uses an adaptive algorithm that targets your weakest eras and calibrates difficulty to your performance level. Available on Pro Learner and above."
            requiredTier="pro"
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-400/10">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold">Smart Quiz</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Adaptive questions targeting your weakest areas</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <Card>
                <CardContent className="pt-6 pb-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Brain,  color: 'text-violet-400 bg-violet-400/10', label: 'Adaptive',   desc: 'Questions target your weak spots' },
                      { icon: Target, color: 'text-rose-400 bg-rose-400/10',     label: '10 Questions', desc: 'Drawn from all 4 eras' },
                      { icon: Trophy, color: 'text-amber-400 bg-amber-400/10',   label: 'Earn XP',    desc: '+15 XP per correct answer' },
                    ].map(({ icon: Icon, color, label, desc }) => (
                      <div key={label} className="text-center space-y-1.5 p-3 rounded-xl border border-border">
                        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mx-auto`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <p className="font-semibold text-xs">{label}</p>
                        <p className="text-muted-foreground text-[10px] leading-tight">{desc}</p>
                      </div>
                    ))}
                  </div>

                  {weakAreas.length > 0 && (
                    <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Detected Weak Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {weakAreas.map(w => (
                          <div key={w.eraId} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${ERA_COLOR[w.eraId] ?? 'border-border text-muted-foreground'}`}>
                            <span>{w.name}</span>
                            <span className="opacity-60">{w.score}%</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">The algorithm will prioritize these areas this session.</p>
                    </div>
                  )}

                  {weakAreas.length === 0 && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
                      <span className="text-foreground font-medium">No weak areas detected yet.</span> Complete some era quizzes and the algorithm will target your weakest topics.
                    </div>
                  )}

                  <Button className="w-full gap-2" size="lg" onClick={startSession}>
                    Start Smart Quiz <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── QUESTION ── */}
          {(phase === 'question' || phase === 'explain') && q && (
            <motion.div key={`q-${qIdx}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-4">
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono">{qIdx + 1}/{session.length}</span>
                <div className="flex-1"><Progress value={((qIdx) / session.length) * 100} className="h-1.5" /></div>
                <Badge variant="outline" className={`text-xs ${DIFF_COLOR[q.difficulty] ?? 'border-border'}`}>{q.difficulty}</Badge>
              </div>

              {/* Era badge */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${ERA_COLOR[q.eraId] ?? 'border-border text-muted-foreground'}`}>{q.eraName}</Badge>
              </div>

              <Card>
                <CardContent className="pt-5 pb-4 space-y-4">
                  <p className="font-heading text-base font-semibold leading-snug">{q.question}</p>

                  <div className="space-y-2">
                    {q.options.map((opt, i) => {
                      const isChosen  = selected === i;
                      const isCorrect = i === q.correctIndex;
                      let cls = 'w-full p-3 rounded-xl border text-sm text-left transition-all duration-200 flex items-center gap-3 ';
                      if (phase === 'explain') {
                        if (isCorrect)     cls += 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300';
                        else if (isChosen) cls += 'border-rose-400/60 bg-rose-400/10 text-rose-300';
                        else               cls += 'border-border text-muted-foreground opacity-40';
                      } else {
                        cls += isChosen ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer';
                      }
                      return (
                        <button key={i} className={cls} onClick={() => phase === 'question' && setSelected(i)}>
                          {phase === 'explain' && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {phase === 'explain' && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                          {phase === 'question' && <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${isChosen ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{String.fromCharCode(65 + i)}</div>}
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <AnimatePresence>
                    {phase === 'explain' && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                        <div className="flex items-center gap-2">
                          {answers[answers.length - 1] === false && selected !== q.correctIndex ? (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          <span className="text-xs font-semibold">
                            {selected === q.correctIndex ? 'Correct!' : 'Not quite.'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {phase === 'question' && (
                    <Button className="w-full" size="sm" disabled={selected === null} onClick={submitAnswer}>
                      Submit Answer
                    </Button>
                  )}
                  {phase === 'explain' && (
                    <Button className="w-full gap-1.5" size="sm" onClick={advance}>
                      {qIdx + 1 >= session.length ? 'See Results' : 'Next Question'} <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Mini score tracker */}
              <div className="flex items-center gap-2 justify-center">
                {answers.map((correct, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${correct ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                ))}
                {Array.from({ length: session.length - answers.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-2 h-2 rounded-full bg-border" />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <Card>
                <CardContent className="pt-6 pb-5 space-y-5">
                  <div className="text-center space-y-2">
                    <div className="font-heading text-5xl font-bold text-primary">{score}%</div>
                    <div className="text-muted-foreground text-sm">{correctCount}/{session.length} correct · +{xpEarned} XP earned</div>
                    <div className="text-xs text-muted-foreground">
                      {score >= 90 ? '🏆 Outstanding! You\'re mastering history.' :
                       score >= 70 ? '✅ Great work! Keep up the momentum.' :
                       score >= 50 ? '📚 Good effort — review the weak areas below.' :
                       '💡 Keep studying — every attempt makes you stronger.'}
                    </div>
                  </div>

                  {/* Era breakdown */}
                  {eraBreakdown.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Performance by Era</p>
                      {eraBreakdown.map(e => {
                        const pct = Math.round((e.correct / e.total) * 100);
                        return (
                          <div key={e.eraId}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className={ERA_COLOR[e.eraId]?.split(' ')[0] ?? 'text-foreground'}>{e.name}</span>
                              <span className="text-muted-foreground">{e.correct}/{e.total} · {pct}%</span>
                            </div>
                            <div className="h-1.5 bg-border rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" onClick={startSession}>
                      <RotateCcw className="w-4 h-4" /> New Session
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setPhase('intro')}>
                      Back to Intro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </AppShell>
  );
}
