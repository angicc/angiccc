import { useState, useMemo } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Brain, Target, Trophy, ChevronRight, MessageSquare, BarChart2, Star } from 'lucide-react';
import { streamChatResponse } from '@/services/aiGateway';
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
import { getSmartQuizStats, recordSmartQuizSession } from '@/features/smartQuiz/smartQuizStats';
import { useLanguage } from '@/contexts/LanguageContext';
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

const SESSION_SIZE = 15;

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
    if (avgScore < 40)  return d === 'easy' ? 2.0 : d === 'medium' ? 1.2 : 0.5;
    if (avgScore < 70)  return d === 'easy' ? 0.8 : d === 'medium' ? 2.0 : 1.5;
    return d === 'easy' ? 0.3 : d === 'medium' ? 1.2 : 3.0;  // high scorers → mostly hard
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
  const { t } = useLanguage();
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
  const [clioRec, setClioRec] = useState('');
  const [clioLoading, setClioLoading] = useState(false);

  async function getClioRecommendation(scoreVal: number, eraBreakdownData: Array<{name: string; correct: number; total: number}>) {
    setClioLoading(true);
    setClioRec('');
    const weakest = eraBreakdownData
      .map(e => ({ name: e.name, pct: Math.round((e.correct / e.total) * 100) }))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 2);

    const strongEras = eraBreakdownData
      .map(e => ({ name: e.name, pct: Math.round((e.correct / e.total) * 100) }))
      .filter(e => e.pct >= 75)
      .map(e => e.name);

    const prompt = `You are Clio, an AI history tutor with deep knowledge and an encouraging but scholarly personality. A student just completed a 15-question adaptive Smart Quiz and scored ${scoreVal}%.

Era breakdown: ${eraBreakdownData.map(e => `${e.name}: ${Math.round((e.correct/e.total)*100)}% (${e.correct}/${e.total})`).join(', ')}.
${weakest.length > 0 ? `Weakest areas: ${weakest.map(w => `${w.name} (${w.pct}%)`).join(', ')}.` : ''}
${strongEras.length > 0 ? `Strong areas: ${strongEras.join(', ')}.` : ''}

Write a 3-sentence personalized recommendation directly to the student:
1. Acknowledge their specific performance with precision (mention the exact score and one strength if any).
2. Give a concrete, actionable next step targeting their weakest era — name a specific concept, event, or lesson to revisit.
3. End with a motivating, historically-flavored insight that connects their weak area to why history matters.
Address the student as "you". Be specific, warm, and scholarly. Do NOT use bullet points.`;

    try {
      for await (const chunk of streamChatResponse([{ role: 'user', content: prompt }])) {
        setClioRec(prev => prev + chunk);
      }
    } catch {
      setClioRec(t.sq_clio_fallback);
    }
    setClioLoading(false);
  }

  function startSession() {
    const q = selectAdaptiveQuestions(allQuestions, progress?.quizScores ?? {}, SESSION_SIZE);
    setSession(q);
    setQIdx(0);
    setSelected(null);
    setAnswers([]);
    setXpEarned(0);
    setClioRec('');
    setClioLoading(false);
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
      const finalAnswers = [...answers, selected === session[qIdx].correctIndex];
      const correct = finalAnswers.filter(Boolean).length;
      const xp = correct * 15;
      const scoreVal = Math.round((correct / session.length) * 100);
      setXpEarned(xp);
      if (currentUser) {
        const attempt: QuizAttempt = {
          quizId: 'smart-quiz', score: scoreVal,
          completedAt: new Date().toISOString(), xpEarned: xp,
          answers: session.map((q, i) => finalAnswers[i] ? q.correctIndex : -1),
        };
        recordQuizAttempt(currentUser.id, attempt, 'Smart Quiz');
        refreshProgress();
        toast.success(`Smart Quiz complete! +${xp} XP earned`);
      }
      // Build era breakdown for Clio recommendation and stats
      const map: Record<string, { name: string; correct: number; total: number }> = {};
      session.forEach((q, i) => {
        if (!map[q.eraId]) map[q.eraId] = { name: q.eraName, correct: 0, total: 0 };
        map[q.eraId].total++;
        if (finalAnswers[i]) map[q.eraId].correct++;
      });
      const eraBreakdownData = Object.values(map);
      // Record stats
      if (currentUser) {
        const eraBreakdownForStats: Record<string, { correct: number; total: number }> = {};
        Object.entries(map).forEach(([eraId, d]) => {
          eraBreakdownForStats[eraId] = { correct: d.correct, total: d.total };
        });
        recordSmartQuizSession(currentUser.id, {
          date: new Date().toISOString(),
          score: correct,
          total: SESSION_SIZE,
          xpEarned: xp,
          eraBreakdown: eraBreakdownForStats,
        });
      }
      setPhase('done');
      getClioRecommendation(scoreVal, eraBreakdownData);
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
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-violet-400/10">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">{t.sq_title}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{t.sq_subtitle}</p>
            </div>
          </motion.div>
          <UpgradePrompt
            title={t.sq_title}
            description={t.sq_upgrade_desc}
            requiredPlan="pro"
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-400/10">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold">{t.sq_title}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{t.sq_subtitle}</p>
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
                      { icon: Brain,  color: 'text-violet-400 bg-violet-400/10', label: t.quiz_adaptive,      desc: t.sq_adaptive_desc },
                      { icon: Target, color: 'text-rose-400 bg-rose-400/10',     label: t.sq_questions_label, desc: t.sq_questions_desc },
                      { icon: Trophy, color: 'text-amber-400 bg-amber-400/10',   label: t.quiz_earn_xp,       desc: t.sq_xp_desc },
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
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.sq_weak_title}</p>
                      <div className="flex flex-wrap gap-2">
                        {weakAreas.map(w => (
                          <div key={w.eraId} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${ERA_COLOR[w.eraId] ?? 'border-border text-muted-foreground'}`}>
                            <span>{w.name}</span>
                            <span className="opacity-60">{w.score}%</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{t.sq_algorithm}</p>
                    </div>
                  )}

                  {weakAreas.length === 0 && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
                      {t.sq_no_weak}
                    </div>
                  )}

                  <Button className="w-full gap-2" size="lg" onClick={startSession}>
                    {t.sq_start} <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* ── Statistics Card ── */}
              {(() => {
                if (!currentUser) return null;
                const stats = getSmartQuizStats(currentUser.id);
                const sessions = stats.sessions;
                if (sessions.length === 0) {
                  return (
                    <Card>
                      <CardContent className="pt-5 pb-5">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart2 className="w-4 h-4 text-violet-400" />
                          <p className="font-semibold text-sm">{t.sq_stats_title}</p>
                        </div>
                        <p className="text-muted-foreground text-sm text-center py-4">{t.sq_no_sessions}</p>
                      </CardContent>
                    </Card>
                  );
                }
                const avgScore = Math.round(sessions.reduce((a, s) => a + (s.score / s.total) * 100, 0) / sessions.length);
                const bestScore = Math.max(...sessions.map(s => s.score));
                const totalXp = sessions.reduce((a, s) => a + s.xpEarned, 0);
                // Cumulative era breakdown
                const eraAgg: Record<string, { correct: number; total: number }> = {};
                sessions.forEach(s => {
                  Object.entries(s.eraBreakdown).forEach(([eraId, d]) => {
                    if (!eraAgg[eraId]) eraAgg[eraId] = { correct: 0, total: 0 };
                    eraAgg[eraId].correct += d.correct;
                    eraAgg[eraId].total += d.total;
                  });
                });
                const eraRows = Object.entries(eraAgg).map(([eraId, d]) => ({
                  eraId, name: ERAS.find(e => e.id === eraId)?.shortName ?? eraId,
                  pct: Math.round((d.correct / d.total) * 100), correct: d.correct, total: d.total,
                }));
                return (
                  <Card>
                    <CardContent className="pt-5 pb-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-violet-400" />
                        <p className="font-semibold text-sm">{t.sq_stats_title}</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: t.sq_sessions, value: sessions.length, icon: Brain, color: 'text-violet-400' },
                          { label: t.sq_avg_score, value: `${avgScore}%`, icon: Target, color: 'text-blue-400' },
                          { label: t.sq_best_score, value: `${bestScore}/${SESSION_SIZE}`, icon: Trophy, color: 'text-amber-400' },
                          { label: t.sq_total_xp, value: `+${totalXp}`, icon: Star, color: 'text-primary' },
                        ].map(({ label, value, icon: Icon, color }) => (
                          <div key={label} className="text-center p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                            <Icon className={`w-4 h-4 ${color} mx-auto`} />
                            <div className="font-bold text-sm font-heading">{value}</div>
                            <div className="text-[10px] text-muted-foreground">{label}</div>
                          </div>
                        ))}
                      </div>
                      {eraRows.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.sq_era_breakdown}</p>
                          {eraRows.map(er => (
                            <div key={er.eraId}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className={ERA_COLOR[er.eraId]?.split(' ')[0] ?? 'text-foreground'}>{er.name}</span>
                                <span className="text-muted-foreground">{er.correct}/{er.total} · {er.pct}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${er.pct >= 75 ? 'bg-emerald-400' : er.pct >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${er.pct}%` }}
                                  transition={{ duration: 0.7, ease: 'easeOut' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })()}
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
                            {selected === q.correctIndex ? t.quiz_correct : t.quiz_incorrect}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {phase === 'question' && (
                    <Button className="w-full" size="sm" disabled={selected === null} onClick={submitAnswer}>
                      {t.quiz_submit_answer}
                    </Button>
                  )}
                  {phase === 'explain' && (
                    <Button className="w-full gap-1.5" size="sm" onClick={advance}>
                      {qIdx + 1 >= session.length ? t.btn_see_results : t.btn_next_question} <ChevronRight className="w-3.5 h-3.5" />
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
                    <div className="text-muted-foreground text-sm">{correctCount}/{session.length} {t.sq_correct_label} · +{xpEarned} {t.lbl_xp} {t.dash_xp_label === 'XP' ? 'earned' : ''}</div>
                    <div className="text-xs text-muted-foreground">
                      {score >= 90 ? t.sq_outstanding : score >= 70 ? t.sq_great : score >= 50 ? t.sq_good : t.sq_keep_going}
                    </div>
                  </div>

                  {/* Era breakdown */}
                  {eraBreakdown.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.sq_perf_era}</p>
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

                  {/* Clio Recommendation — 3D flip reveal */}
                  <AnimatePresence>
                    {(clioLoading || clioRec) && (
                      <motion.div
                        key="clio-rec"
                        initial={{ opacity: 0, rotateX: -60, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18, duration: 0.6 }}
                        style={{ transformPerspective: 900, transformOrigin: 'top center' }}
                        className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden"
                      >
                        {/* Header bar */}
                        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-primary/15 bg-primary/8">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                          >
                            <MessageSquare className="w-4 h-4 text-primary shrink-0" />
                          </motion.div>
                          <span className="text-xs font-bold text-primary tracking-wide uppercase">{t.quiz_clio_rec}</span>
                          {clioLoading && (
                            <motion.div
                              className="ml-auto flex gap-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              {[0,1,2].map(i => (
                                <motion.div
                                  key={i}
                                  className="w-1.5 h-1.5 rounded-full bg-primary/60"
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                                />
                              ))}
                            </motion.div>
                          )}
                        </div>
                        {/* Body */}
                        <div className="px-4 py-3">
                          {clioLoading && !clioRec ? (
                            <p className="text-xs text-muted-foreground italic">{t.quiz_clio_thinking}</p>
                          ) : (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.4 }}
                              className="text-sm text-foreground/85 leading-relaxed"
                            >
                              {clioRec}
                            </motion.p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" onClick={startSession}>
                      <RotateCcw className="w-4 h-4" /> {t.sq_new}
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setPhase('intro')}>
                      {t.sq_back_intro}
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
