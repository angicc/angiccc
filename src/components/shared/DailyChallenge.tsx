import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QUIZZES } from '@/features/quiz/quizData';

const ALL_QUESTIONS = QUIZZES.flatMap(q => q.questions.map(qq => ({ ...qq, quizTitle: q.title, eraId: q.eraId })));

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function getDailyQuestion() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return ALL_QUESTIONS[dayOfYear % ALL_QUESTIONS.length];
}

const ERA_COLOR: Record<string, string> = {
  ancient: 'text-amber-400',
  'middle-ages': 'text-blue-400',
  'early-modern': 'text-emerald-400',
  modern: 'text-rose-400',
};

interface Props { userId: string; onXP?: (xp: number) => void; }

export function DailyChallenge({ userId, onXP }: Props) {
  const storageKey = `historify:daily:${userId}:${getTodayKey()}`;
  const alreadyDone = localStorage.getItem(storageKey);

  const q = useMemo(getDailyQuestion, []);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(!!alreadyDone);
  const [wasCorrect, setWasCorrect] = useState(alreadyDone === 'correct');

  function submit() {
    if (selected === null) return;
    const correct = selected === q.correctIndex;
    setSubmitted(true);
    setWasCorrect(correct);
    localStorage.setItem(storageKey, correct ? 'correct' : 'wrong');
    if (correct && onXP) onXP(15);
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />Daily Challenge</span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-xs text-muted-foreground font-normal">+15 XP</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${ERA_COLOR[q.eraId] ?? ''}`}>{q.quizTitle}</Badge>
          <Badge variant="secondary" className="text-xs">{q.difficulty}</Badge>
        </div>
        <p className="text-sm font-medium leading-snug">{q.question}</p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="choices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left text-xs p-2.5 rounded-lg border transition-all ${selected === i ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}
                >
                  <span className="font-mono mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                </button>
              ))}
              <Button size="sm" className="w-full mt-1" disabled={selected === null} onClick={submit}>
                Submit Answer
              </Button>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <div className={`flex items-center gap-2 p-2.5 rounded-lg text-sm ${wasCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-destructive/10 text-destructive'}`}>
                {wasCorrect ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                <span className="font-medium">{wasCorrect ? 'Correct! +15 XP' : `Correct answer: ${q.options[q.correctIndex]}`}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
              <p className="text-xs text-muted-foreground text-center">Come back tomorrow for a new challenge!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
