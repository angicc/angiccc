import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AppShell } from '@/components/layout/AppShell';
import { XPBadge } from '@/components/shared/XPBadge';
import { AchievementToast } from '@/components/shared/AchievementToast';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { recordQuizAttempt } from '@/features/progress/progressStore';
import { getQuizByEraId } from '@/features/quiz/quizData';
import { getEraById } from '@/features/content/erasData';
import { XP_REWARDS } from '@/features/progress/xpSystem';
import { toast } from 'sonner';
import type { QuizAttempt, Achievement } from '@/types';

type Phase = 'idle' | 'question' | 'explain' | 'done';

export default function QuizPage() {
  const { eraId } = useParams<{ eraId: string }>();
  const { currentUser, refreshProgress } = useAuth();
  const { canExplanations } = useSubscription();
  const navigate = useNavigate();

  const era = getEraById(eraId ?? '');
  const quiz = getQuizByEraId(eraId as never);

  const [phase, setPhase] = useState<Phase>('idle');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [xpAmt, setXpAmt] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);

  if (!quiz || !era) return <AppShell><div className="text-center py-20 text-muted-foreground">Quiz not found.</div></AppShell>;

  const q = quiz.questions[qIdx];
  const score = Math.round((answers.filter((a, i) => a === quiz.questions[i].correctIndex).length / quiz.questions.length) * 100);
  const correct = answers.filter((a, i) => a === quiz.questions[i].correctIndex).length;

  function start() { setPhase('question'); setQIdx(0); setSelected(null); setAnswers([]); }

  function submitAnswer() {
    if (selected === null) return;
    setAnswers(prev => [...prev, selected]);
    if (canExplanations()) setPhase('explain');
    else advance([...answers, selected]);
  }

  function advance(ans = answers) {
    if (!quiz) return;
    if (qIdx < quiz.questions.length - 1) { setQIdx(i => i + 1); setSelected(null); setPhase('question'); }
    else finish(ans);
  }

  function finish(ans: number[]) {
    if (!quiz || !era) return;
    const finalCorrect = ans.filter((a, i) => a === quiz.questions[i].correctIndex).length;
    const finalScore = Math.round((finalCorrect / quiz.questions.length) * 100);
    const xp = finalCorrect * XP_REWARDS.QUIZ_CORRECT + (finalScore === 100 ? XP_REWARDS.QUIZ_PERFECT : 0);
    const attempt: QuizAttempt = { quizId: quiz.id, answers: ans, score: finalScore, xpEarned: xp, completedAt: new Date().toISOString() };
    if (currentUser) { const { newAchievements } = recordQuizAttempt(currentUser.id, attempt, era.name); refreshProgress(); if (newAchievements.length > 0) { setUnlockedAchievements(newAchievements); confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#f59e0b','#fbbf24','#d97706','#ffffff'] }); } if (finalScore >= quiz.passingScore) { confetti({ particleCount: finalScore === 100 ? 220 : 140, spread: finalScore === 100 ? 130 : 90, origin: { y: 0.5 }, colors: ['#f59e0b','#fbbf24','#fde68a','#ffffff','#10b981'] }); } }
    setXpAmt(xp); setPhase('done');
  }

  return (
    <AppShell>
      {xpAmt > 0 && <XPBadge amount={xpAmt} onDone={() => setXpAmt(0)} />}
      {unlockedAchievements.length > 0 && <AchievementToast achievements={unlockedAchievements} onDone={() => setUnlockedAchievements([])} />}
      <div className="max-w-2xl mx-auto">
        <div className="mb-6"><h1 className="font-heading text-3xl font-bold">{quiz.title}</h1><p className="text-muted-foreground mt-1 text-sm">{quiz.questions.length} questions · {quiz.xpPerCorrect} XP per correct answer</p></div>

        {phase === 'idle' && (
          <Card className={`bg-gradient-to-br ${era.bgGradient} border-border`}>
            <CardContent className="flex flex-col items-center text-center gap-4 py-12">
              <Trophy className={`w-12 h-12 ${era.color}`} />
              <div><h2 className="font-heading text-xl font-bold">{era.name} Quiz</h2><p className="text-muted-foreground text-sm mt-1">Test your knowledge of {era.dateRange}</p></div>
              <div className="text-sm text-muted-foreground">Passing score: {quiz.passingScore}% · Max XP: {quiz.questions.length * quiz.xpPerCorrect + XP_REWARDS.QUIZ_PERFECT}</div>
              <Button size="lg" onClick={start}>Start Quiz</Button>
            </CardContent>
          </Card>
        )}

        {(phase === 'question' || phase === 'explain') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Question {qIdx + 1} of {quiz.questions.length}</span>
              <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
            </div>
            <Progress value={((qIdx) / quiz.questions.length) * 100} className="h-1.5" />
            <Card>
              <CardHeader><CardTitle className="font-heading text-lg leading-snug">{q.question}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === q.correctIndex;
                  const showResult = phase === 'explain';
                  let cls = 'border-border hover:border-primary/50 cursor-pointer';
                  if (showResult && isCorrect) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                  else if (showResult && isSelected && !isCorrect) cls = 'border-destructive bg-destructive/10 text-destructive';
                  else if (isSelected) cls = 'border-primary bg-primary/10';
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border text-sm transition-all ${cls}`} onClick={() => phase === 'question' && setSelected(i)}>
                      {showResult && (isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : isSelected ? <XCircle className="w-4 h-4 text-destructive shrink-0" /> : <span className="w-4 h-4 shrink-0" />) }
                      {phase === 'question' && <span className={`w-6 h-6 rounded-full border text-xs flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{String.fromCharCode(65+i)}</span>}
                      <span>{opt}</span>
                    </div>
                  );
                })}
                {phase === 'explain' && canExplanations() && <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground mt-2"><strong className="text-foreground">Explanation: </strong>{q.explanation}</div>}
                {phase === 'explain' && !canExplanations() && <UpgradePrompt compact description="Upgrade to Pro to see answer explanations." />}
                <Button className="w-full gap-2 mt-2" disabled={selected === null && phase === 'question'} onClick={() => phase === 'question' ? submitAnswer() : advance()}>
                  {phase === 'question' ? 'Submit Answer' : qIdx < quiz.questions.length - 1 ? <><span>Next Question</span><ArrowRight className="w-4 h-4" /></> : 'See Results'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {phase === 'done' && (
          <Card>
            <CardContent className="flex flex-col items-center text-center gap-4 py-10">
              <Trophy className={`w-12 h-12 ${score >= quiz.passingScore ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="text-5xl font-bold font-heading">{score}%</div>
              <div className="text-muted-foreground">{correct} / {quiz.questions.length} correct</div>
              <Badge variant={score >= quiz.passingScore ? 'default' : 'secondary'}>{score >= quiz.passingScore ? 'Passed!' : 'Keep Studying'}</Badge>
              {xpAmt > 0 && <div className="text-sm text-primary font-medium">+{xpAmt} XP earned!</div>}
              <div className="flex gap-3 mt-2">
                <Button variant="outline" className="gap-2" onClick={start}><RotateCcw className="w-4 h-4" />Retake</Button>
                <Button className="gap-2" onClick={() => navigate('/eras')}>Back to Eras<ArrowRight className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
