// ─── Study Plan: the AI learning-path optimizer ───────────────────────────────
// Reads the mastery model (deterministic, always current), schedules a week of
// study targeted at the weakest era, and lets Clio decorate the plan with a
// theme, coach note, per-day rationale and (Master) a deep pattern analysis.
// Steps deep-link into the real surfaces and check themselves off as the
// underlying activity completes — the page is a live dashboard, not a to-do
// list that rots.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route as RouteIcon, Sparkles, RefreshCw, TrendingUp, Target, BookOpen, HelpCircle, Layers, Wand2, Hourglass, Globe2, CheckCircle2, Circle, ChevronRight, Crown, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AppShell } from '@/components/layout/AppShell';
import { AiErrorCard } from '@/components/shared/AiErrorCard';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { usePlanTier } from '@/features/subscription/planGate';
import { useLanguage } from '@/contexts/LanguageContext';
import { streamChatResponse } from '@/services/aiGateway';
import { ERAS } from '@/features/content/erasData';
import { LESSONS } from '@/features/content/lessonsData';
import { getTranslatedEra, getTranslatedLesson } from '@/i18n/contentTranslations';
import { computeMastery, nextLessonsForEra, type MasterySnapshot } from '@/features/learningPath/masteryModel';
import { generateWeekPlan, buildPlanNotesPrompt, parsePlanNotes, stepRoute, type WeekPlan, type PlanStep, type StepKind } from '@/features/learningPath/planEngine';
import { loadWeekPlan, saveWeekPlan, stepCompletion, toggleManualStep, isManualKind } from '@/features/learningPath/planStore';

const KIND_ICON: Record<StepKind, React.ComponentType<{ className?: string }>> = {
  lesson: BookOpen, 'era-quiz': HelpCircle, 'smart-quiz': Sparkles,
  flashcards: Layers, studio: Wand2, crisis: Hourglass, 'timeline-map': Globe2,
};

const ERA_BAR: Record<string, string> = {
  prehistoric: 'bg-orange-400', ancient: 'bg-amber-400', byzantine: 'bg-violet-400', 'middle-ages': 'bg-blue-400', 'early-modern': 'bg-emerald-400', modern: 'bg-rose-400',
};

export default function StudyPlanPage() {
  const { t, language } = useLanguage();
  const { currentUser, progress } = useAuth();
  const { canLesson, canAI, trackAiMessage } = useSubscription();
  const tier = usePlanTier();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<WeekPlan | null>(() => (currentUser ? loadWeekPlan(currentUser.id) : null));
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<unknown>(null);
  // Bumped by the Refresh button and on window focus: mastery + step completion
  // read quiz scores and analysis passes straight from localStorage, which the
  // AuthContext `progress` object doesn't always track — without this tick,
  // Era Mastery could sit stale until a full reload.
  const [refreshTick, setRefreshTick] = useState(0);

  // Mastery recomputes whenever progress changes (lesson done, quiz passed...)
  // or a refresh is requested.
  const mastery: MasterySnapshot | null = useMemo(
    () => (currentUser ? computeMastery(currentUser.id) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, progress, refreshTick],
  );

  const completion = useMemo(
    () => (currentUser && plan ? stepCompletion(currentUser.id, plan) : {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, plan, progress, refreshTick],
  );

  useEffect(() => { if (currentUser) setPlan(loadWeekPlan(currentUser.id)); }, [currentUser, refreshTick]);

  const refresh = useCallback(() => setRefreshTick(v => v + 1), []);

  // Activity completed on another page/tab (quiz, lesson, flashcards) →
  // re-derive everything the moment the user comes back to this one.
  useEffect(() => {
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [refresh]);

  const generate = useCallback(() => {
    if (!currentUser || !mastery) return;
    const fresh = generateWeekPlan(mastery, eraId =>
      nextLessonsForEra(currentUser.id, eraId, canLesson).map(l => ({ id: l.id, eraId: l.eraId, estimatedMinutes: l.estimatedMinutes })),
    );
    saveWeekPlan(currentUser.id, fresh);
    setPlan(fresh);
    setError(null);
  }, [currentUser, mastery, canLesson]);

  const enhance = useCallback(async () => {
    if (!currentUser || !mastery || !plan || enhancing) return;
    const { allowed } = canAI();
    if (!allowed) return;
    setEnhancing(true); setError(null);
    try {
      const prompt = buildPlanNotesPrompt(mastery, plan, language, tier === 'master');
      let raw = '';
      for await (const chunk of streamChatResponse([{ role: 'user', content: prompt }], undefined,
        'You are Clio, an expert history mentor. Answer only with the requested JSON.')) raw += chunk;
      trackAiMessage();
      const notes = parsePlanNotes(raw);
      if (notes) {
        const next = { ...plan, aiNotes: notes };
        saveWeekPlan(currentUser.id, next);
        setPlan(next);
      }
    } catch (err) { setError(err); } finally { setEnhancing(false); }
  }, [currentUser, mastery, plan, enhancing, canAI, language, tier, trackAiMessage]);

  const doneCount = plan ? plan.steps.filter(s => completion[s.id]).length : 0;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <RouteIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">{t.path_title}</h1>
              <p className="text-muted-foreground text-sm">{t.path_subtitle}</p>
            </div>
          </div>
          {mastery && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 text-amber-400 border-amber-400/40">
                <Flame className="w-3 h-3" />{mastery.streak}
              </Badge>
              <Badge variant="outline" className="gap-1 text-primary border-primary/40">
                <TrendingUp className="w-3 h-3" />{mastery.overall}%
              </Badge>
              <Button variant="outline" size="sm" className="gap-1.5 h-7 px-2.5" onClick={refresh} title={t.path_refresh}>
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">{t.path_refresh}</span>
              </Button>
            </div>
          )}
        </motion.div>

        {/* Mastery per era */}
        {mastery && (
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold">{t.path_mastery_title}</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {mastery.eras.map(em => {
                  const era = ERAS.find(e => e.id === em.eraId)!;
                  const isWeakest = em.eraId === mastery.weakest.eraId;
                  return (
                    <div key={em.eraId}>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className={`font-medium ${isWeakest ? 'text-rose-400' : ''}`}>
                          {getTranslatedEra(era, language).name}
                          {isWeakest && <Badge variant="outline" className="ml-2 text-[9px] px-1 py-0 text-rose-400 border-rose-400/40">{t.path_focus}</Badge>}
                        </span>
                        <span className="font-semibold">{em.mastery}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-border overflow-hidden">
                        <div className={`h-full rounded-full ${ERA_BAR[em.eraId] ?? 'bg-primary'}`} style={{ width: `${em.mastery}%` }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {t.path_lessons_done}: {em.lessonsDone}/{em.lessonsTotal}
                        {em.quizPct !== null && <> · {t.path_quiz_score}: {em.quizPct}%</>}
                        {em.adaptivePct !== null && <> · {t.path_adaptive_acc}: {Math.round(em.adaptivePct)}%</>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={generate} className="gap-2">
            <RefreshCw className="w-4 h-4" />{plan ? t.path_regenerate : t.path_generate}
          </Button>
          {plan && tier === 'master' && (
            <Button variant="secondary" onClick={enhance} disabled={enhancing} className="gap-2">
              <Sparkles className={`w-4 h-4 ${enhancing ? 'animate-pulse' : ''}`} />
              {enhancing ? t.path_enhancing : t.path_enhance}
            </Button>
          )}
          {plan && tier !== 'master' && (
            <span className="text-xs text-muted-foreground">{t.path_enhance_upsell}</span>
          )}
          {plan && (
            <span className="ml-auto text-xs text-muted-foreground">
              {doneCount}/{plan.steps.length} {t.path_done_of}
            </span>
          )}
        </div>

        {error != null && <AiErrorCard error={error} onRetry={enhance} />}

        {/* Clio's notes */}
        {plan?.aiNotes && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="font-heading font-bold">{plan.aiNotes.weekTheme}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{plan.aiNotes.coachNote}</p>
              {plan.aiNotes.deepAnalysis && (
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">{t.path_deep_analysis}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{plan.aiNotes.deepAnalysis}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* The week */}
        {plan ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map(day => {
              const daySteps = plan.steps.filter(s => s.day === day);
              if (daySteps.length === 0) return null;
              const note = plan.aiNotes?.dayNotes[day];
              const allDone = daySteps.every(s => completion[s.id]);
              return (
                <Card key={day} className={`border-border ${allDone ? 'opacity-70' : ''}`}>
                  <CardContent className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.path_day} {day}</span>
                      {allDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    {daySteps.map(step => (
                      <StepRow
                        key={step.id}
                        step={step}
                        done={Boolean(completion[step.id])}
                        onGo={() => navigate(stepRoute(step))}
                        onToggle={isManualKind(step) && currentUser ? () => { toggleManualStep(currentUser.id, step.id); setPlan(loadWeekPlan(currentUser.id)); } : undefined}
                        language={language}
                      />
                    ))}
                    {note && <p className="text-[11px] text-primary/80 leading-snug border-l-2 border-primary/30 pl-2">{note}</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed border-border">
            <CardContent className="p-10 text-center space-y-3">
              <RouteIcon className="w-10 h-10 mx-auto text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground max-w-md mx-auto">{t.path_empty}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function StepRow({ step, done, onGo, onToggle, language }: {
  step: PlanStep; done: boolean; onGo: () => void; onToggle?: () => void; language: string;
}) {
  const { t } = useLanguage();
  const Icon = KIND_ICON[step.kind];
  const lesson = step.lessonId ? LESSONS.find(l => l.id === step.lessonId) : undefined;
  const era = step.eraId ? ERAS.find(e => e.id === step.eraId) : undefined;
  const kindLabel: Record<StepKind, string> = {
    lesson: t.path_step_lesson, 'era-quiz': t.path_step_quiz, 'smart-quiz': t.path_step_smart_quiz,
    flashcards: t.path_step_flashcards, studio: t.path_step_studio, crisis: t.path_step_crisis, 'timeline-map': t.path_step_map,
  };
  const label = lesson
    ? getTranslatedLesson(lesson, language as never).title
    : era && (step.kind === 'era-quiz' || step.kind === 'timeline-map')
    ? `${kindLabel[step.kind]} — ${getTranslatedEra(era, language as never).shortName}`
    : kindLabel[step.kind];

  return (
    <div className={`group flex items-start gap-2 rounded-lg border p-2 transition-colors ${done ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-border hover:border-primary/40'}`}>
      {onToggle ? (
        <button onClick={onToggle} className="shrink-0 mt-0.5" title={t.path_mark_done}>
          {done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-muted-foreground group-hover:text-primary" />}
        </button>
      ) : (
        <span className="shrink-0 mt-0.5">
          {done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4 text-primary/70" />}
        </span>
      )}
      <button onClick={onGo} className="flex-1 min-w-0 text-left">
        <p className={`text-xs font-medium leading-snug ${done ? 'line-through text-muted-foreground' : ''}`}>{label}</p>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          {step.minutes} {t.path_min}<ChevronRight className="w-2.5 h-2.5" />
        </p>
      </button>
    </div>
  );
}
