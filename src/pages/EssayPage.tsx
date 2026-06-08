import { useState, useCallback, useRef } from 'react';
import { PenLine, Send, RotateCcw, CheckCircle2, XCircle, AlertCircle, BookOpen, Brain, Target, Sparkles, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AppShell } from '@/components/layout/AppShell';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { streamChatResponse } from '@/features/ai/claudeClient';
import { toast } from 'sonner';

const TOPICS = [
  'What caused the fall of the Western Roman Empire?',
  'How did the Black Death reshape medieval European society?',
  'Why was the Renaissance a turning point in human history?',
  'What were the main causes of World War I?',
  'How did the Industrial Revolution change everyday life?',
  'Was Napoleon Bonaparte a hero or a tyrant?',
  'What impact did Alexander the Great have on the ancient world?',
  'How did the Islamic Golden Age preserve and advance knowledge?',
];

const ESSAY_SYSTEM = `You are Clio, an expert history professor grading student essays.
Analyze the submitted essay strictly and fairly according to this rubric:

1. **Historical Accuracy** (0–10): Are facts, dates, names, and events correct?
2. **Argument Quality** (0–10): Is there a clear thesis? Is reasoning logical and supported?
3. **Depth & Detail** (0–10): Does the essay go beyond surface-level? Specific examples?
4. **Key Facts Mentioned** (list 3–5): Specific correct historical details the student included.
5. **Missing Important Points** (list 2–4): Key aspects the student failed to mention.
6. **Overall Grade**: A / B / C / D / F with a one-sentence summary.

Respond ONLY in this exact JSON format (no markdown wrapping, no extra text):
{
  "accuracy": 8,
  "argument": 7,
  "depth": 6,
  "grade": "B",
  "gradeSummary": "A solid essay with good factual grounding but lacking depth on economic causes.",
  "keyFacts": ["Correctly identified Odoacer deposing Romulus Augustulus in 476 CE", "Mentioned the Visigoths sacking Rome in 410 CE"],
  "missingPoints": ["No mention of the military's role in Rome's decline", "Economic debasement of currency not discussed"],
  "feedback": "Your essay demonstrates a reasonable understanding of Rome's decline but focuses too narrowly on military invasions. To strengthen this essay, discuss the internal economic pressures — including currency debasement and the cost of maintaining the legions — and the political instability caused by the third-century crisis."
}`;

type GradeResult = {
  accuracy: number;
  argument: number;
  depth: number;
  grade: string;
  gradeSummary: string;
  keyFacts: string[];
  missingPoints: string[];
  feedback: string;
};

const GRADE_COLOR: Record<string, string> = {
  A: 'text-emerald-400', B: 'text-blue-400', C: 'text-amber-400', D: 'text-orange-400', F: 'text-rose-400',
};
const GRADE_BG: Record<string, string> = {
  A: 'bg-emerald-400/10 border-emerald-400/30', B: 'bg-blue-400/10 border-blue-400/30',
  C: 'bg-amber-400/10 border-amber-400/30', D: 'bg-orange-400/10 border-orange-400/30',
  F: 'bg-rose-400/10 border-rose-400/30',
};

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold" style={{ color }}>{value}/10</span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function EssayPage() {
  const { currentUser } = useAuth();
  const { subscription, canAI } = useSubscription();
  const tier = subscription?.tier ?? 'free';
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [essay, setEssay] = useState('');
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [rawBuffer, setRawBuffer] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const activeTopic = topic === 'custom' ? customTopic : topic;
  const canSubmit = activeTopic.trim().length > 5 && wordCount >= 80 && wordCount <= 600 && !grading;

  const { allowed } = canAI();

  if (tier === 'free') {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-orange-400/10">
              <PenLine className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">AI Essay Challenge</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Write a historical essay — Clio grades it in real-time</p>
            </div>
          </motion.div>
          <UpgradePrompt
            feature="AI Essay Challenge"
            reason="Write a historical essay on any topic and get an instant AI-powered grade with detailed feedback on accuracy, argument quality, depth, and specific historical facts — available on Pro Learner and above."
            requiredTier="pro"
          />
        </div>
      </AppShell>
    );
  }

  async function handleGrade() {
    if (!canSubmit) return;
    setGrading(true);
    setResult(null);
    setRawBuffer('');

    const prompt = `Topic: "${activeTopic}"\n\nStudent Essay:\n${essay}`;
    let buf = '';

    try {
      for await (const chunk of streamChatResponse(
        [{ role: 'user', content: prompt }],
        undefined,
        ESSAY_SYSTEM
      )) {
        buf += chunk;
        setRawBuffer(buf);
      }
      const parsed = JSON.parse(buf) as GradeResult;
      setResult(parsed);
      toast.success(`Graded! You earned a ${parsed.grade} — ${parsed.gradeSummary}`);
    } catch {
      toast.error('Grading failed. Make sure your API key is set and try again.');
    } finally {
      setGrading(false);
    }
  }

  function reset() {
    setTopic('');
    setCustomTopic('');
    setEssay('');
    setResult(null);
    setRawBuffer('');
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-400/10">
            <PenLine className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-3xl font-bold">AI Essay Challenge</h1>
              <Badge variant="outline" className="text-xs text-primary border-primary/30">Pro</Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">Write a historical essay — Clio grades it instantly</p>
          </div>
        </motion.div>

        {!result ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="space-y-5">
            {/* Topic selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />Choose a Topic
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-2">
                  {TOPICS.map(t => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`p-3 rounded-xl border text-sm text-left transition-all duration-200 leading-snug ${
                        topic === t
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/30 hover:bg-accent/30 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  <button
                    onClick={() => setTopic('custom')}
                    className={`p-3 rounded-xl border text-sm text-left transition-all duration-200 col-span-full ${
                      topic === 'custom'
                        ? 'border-violet-400/50 bg-violet-400/10 text-violet-400'
                        : 'border-dashed border-border hover:border-violet-400/30 hover:bg-accent/30 text-muted-foreground'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />Write on your own topic…
                  </button>
                </div>
                {topic === 'custom' && (
                  <input
                    value={customTopic}
                    onChange={e => setCustomTopic(e.target.value)}
                    placeholder="e.g. How did the Mongol Empire change trade across Asia?"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/50"
                    autoFocus
                  />
                )}
              </CardContent>
            </Card>

            {/* Essay textarea */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PenLine className="w-4 h-4 text-orange-400" />Your Essay
                  <span className={`ml-auto text-xs font-normal ${wordCount < 80 ? 'text-muted-foreground' : wordCount > 600 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {wordCount} / 80–600 words
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeTopic && topic !== 'custom' && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm font-medium text-primary">
                    {activeTopic}
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  value={essay}
                  onChange={e => setEssay(e.target.value)}
                  placeholder="Write your essay here. Aim for 150–400 words. Include specific historical facts, dates, and examples to earn a higher score…"
                  rows={12}
                  className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/40 resize-none leading-relaxed"
                />
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" />Include specific dates</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" />Name key figures</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" />State a clear argument</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" />Use historical evidence</span>
                </div>
              </CardContent>
            </Card>

            {grading && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                      <Sparkles className="w-5 h-5 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium">Clio is grading your essay…</p>
                      <p className="text-xs text-muted-foreground">Analyzing accuracy, argument quality, and depth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              className="w-full gap-2"
              size="lg"
              disabled={!canSubmit || grading}
              onClick={handleGrade}
            >
              {grading ? 'Grading…' : <><Send className="w-4 h-4" />Submit for AI Grading</>}
            </Button>
            {!canSubmit && !grading && (
              <p className="text-center text-xs text-muted-foreground">
                {!activeTopic ? 'Select a topic above' :
                 wordCount < 80 ? `Write at least ${80 - wordCount} more words` :
                 wordCount > 600 ? 'Essay is too long (max 600 words)' : ''}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
            {/* Grade header */}
            <Card className={`border ${GRADE_BG[result.grade] ?? 'border-border'}`}>
              <CardContent className="pt-6 pb-5 text-center space-y-2">
                <div className={`font-heading text-6xl font-bold ${GRADE_COLOR[result.grade] ?? 'text-foreground'}`}>
                  {result.grade}
                </div>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">{result.gradeSummary}</p>
                <div className="text-xs text-muted-foreground italic">{activeTopic}</div>
              </CardContent>
            </Card>

            {/* Score breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScoreBar label="Historical Accuracy" value={result.accuracy} color="#f59e0b" />
                <ScoreBar label="Argument Quality" value={result.argument} color="#60a5fa" />
                <ScoreBar label="Depth & Detail" value={result.depth} color="#34d399" />
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">Overall</span>
                    <span className="font-semibold">{Math.round((result.accuracy + result.argument + result.depth) / 3 * 10)}%</span>
                  </div>
                  <Progress value={Math.round((result.accuracy + result.argument + result.depth) / 3 * 10)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Key facts + missing points */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="border-emerald-400/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />Strong Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {result.keyFacts.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>{f}
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-amber-400/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs flex items-center gap-2 text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" />Missing Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {result.missingPoints.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-amber-400 mt-0.5 shrink-0">!</span>{p}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Clio feedback */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-violet-400" />Clio's Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.feedback}</p>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button className="flex-1 gap-2" onClick={reset}>
                <RotateCcw className="w-4 h-4" />Write Another Essay
              </Button>
              <Link to="/eras" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <BookOpen className="w-4 h-4" />Study More
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
