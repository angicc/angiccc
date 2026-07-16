import { useNavigate } from 'react-router-dom';
import { BookOpen, HelpCircle, Flame, Star, ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppShell } from '@/components/layout/AppShell';
import { LevelProgress } from '@/components/shared/LevelProgress';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { DailyChallenge } from '@/components/shared/DailyChallenge';
import { XPBadge } from '@/components/shared/XPBadge';
import { useAuth } from '@/features/auth/AuthContext';
import { recordQuizAttempt } from '@/features/progress/progressStore';
import { ERAS } from '@/features/content/erasData';
import { LESSONS } from '@/features/content/lessonsData';
import { getTranslatedLesson } from '@/i18n/contentTranslations';
import { useState, useEffect } from 'react';
import { OnboardingModal, hasCompletedOnboarding } from '@/components/shared/OnboardingModal';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16, scale: 0.985 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } } };

const ERA_SHORT_KEY: Record<string, 'era_short_prehistoric' | 'era_short_ancient' | 'era_short_medieval' | 'era_short_earlymod' | 'era_short_modern'> = {
  prehistoric: 'era_short_prehistoric',
  ancient: 'era_short_ancient',
  'middle-ages': 'era_short_medieval',
  'early-modern': 'era_short_earlymod',
  modern: 'era_short_modern',
};

// Static per-era fill classes (kept literal so Tailwind's JIT emits them).
const ERA_BAR: Record<string, string> = {
  prehistoric: 'from-orange-500 to-orange-300',
  ancient: 'from-amber-500 to-amber-300',
  'middle-ages': 'from-blue-500 to-blue-300',
  'early-modern': 'from-emerald-500 to-emerald-300',
  modern: 'from-rose-500 to-rose-300',
};

export default function DashboardPage() {
  const { currentUser, progress, refreshProgress } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [xpAmt, setXpAmt] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (currentUser && !hasCompletedOnboarding(currentUser.id)) {
      setShowOnboarding(true);
    }
  }, [currentUser]);

  if (!progress || !currentUser) return null;

  const nextLessonRaw = LESSONS.find(l => !progress.completedLessons.includes(l.id));
  const nextLesson = nextLessonRaw ? getTranslatedLesson(nextLessonRaw, language) : undefined;
  const avgScore = Object.values(progress.quizScores).length > 0
    ? Math.round(Object.values(progress.quizScores).reduce((a,b) => a+b, 0) / Object.values(progress.quizScores).length)
    : 0;

  function handleDailyXP(xp: number) {
    if (!currentUser) return;
    const attempt = { quizId: 'daily', answers: [0], score: 100, xpEarned: xp, completedAt: new Date().toISOString() };
    recordQuizAttempt(currentUser.id, attempt, 'Daily Challenge');
    refreshProgress();
    setXpAmt(xp);
  }

  return (
    <AppShell>
      {showOnboarding && <OnboardingModal userId={currentUser.id} onDone={() => setShowOnboarding(false)} />}
      {xpAmt > 0 && <XPBadge amount={xpAmt} onDone={() => setXpAmt(0)} />}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="relative overflow-hidden p-6 rounded-xl border border-border bg-gradient-to-br from-primary/[0.07] via-card to-card">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" aria-hidden />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold">{t.dash_welcome} <span className="text-primary">{currentUser?.username}</span>!</h1>
              <StreakBadge streak={progress.streak} />
            </div>
            <LevelProgress xp={progress.xp} className="sm:w-56" />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t.dash_total_xp, value: progress.xp.toLocaleString(), icon: Star, color:'text-primary', chip:'bg-primary/10 border-primary/20' },
            { label: t.dash_level, value: progress.level, icon: Flame, color:'text-orange-400', chip:'bg-orange-400/10 border-orange-400/20' },
            { label: t.dash_lessons_done, value:`${progress.completedLessons.length} / ${LESSONS.length}`, icon: BookOpen, color:'text-emerald-400', chip:'bg-emerald-400/10 border-emerald-400/20' },
            { label: t.dash_quiz_avg, value: avgScore > 0 ? `${avgScore}%` : '—', icon: HelpCircle, color:'text-blue-400', chip:'bg-blue-400/10 border-blue-400/20' },
          ].map(({ label, value, icon: Icon, color, chip }) => (
            <motion.div key={label} variants={fadeUp} whileHover={{ y: -3 }}>
              <Card className="relative overflow-hidden hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
                <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl opacity-40 ${chip}`} aria-hidden />
                <CardContent className="pt-5 pb-4">
                  <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border ${chip}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="text-2xl font-bold font-heading tabular-nums">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="lg:col-span-2 space-y-4">
            {nextLesson && (
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/[0.02] hover:shadow-lg hover:shadow-primary/5 transition-shadow">
                <CardHeader className="pb-3"><CardTitle className="text-base">{t.dash_continue}</CardTitle></CardHeader>
                <CardContent className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{nextLesson.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{nextLesson.subtitle}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{nextLesson.estimatedMinutes} min</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3" />+{nextLesson.xpReward} XP</span>
                    </div>
                  </div>
                  <Button size="sm" className="shrink-0 gap-1" onClick={() => navigate(`/eras/${nextLesson.eraId}/lessons/${nextLesson.id}`)}>
                    {t.btn_continue} <ArrowRight className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Daily Challenge */}
            <DailyChallenge userId={currentUser.id} onXP={handleDailyXP} />

            {/* Recent activity */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">{t.dash_recent}</CardTitle></CardHeader>
              <CardContent>
                {progress.recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t.dash_no_activity}</p>
                ) : (
                  <ScrollArea className="h-48">
                    <div className="space-y-2 pr-3">
                      {progress.recentActivity.slice(0,10).map((e,i) => (
                        <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                          <span className="text-muted-foreground truncate pr-2">{e.title}</span>
                          {e.xpGained > 0 && <Badge variant="secondary" className="shrink-0 text-xs">+{e.xpGained} {t.dash_xp_label}</Badge>}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Era progress */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">{t.dash_era_progress}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {ERAS.map(era => {
                  const done = era.lessonIds.filter(id => progress.completedLessons.includes(id)).length;
                  const pct = Math.round((done / era.lessonIds.length) * 100);
                  return (
                    <div key={era.id} className="cursor-pointer group" onClick={() => navigate('/eras')}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className={`font-medium group-hover:opacity-80 transition-opacity ${era.color}`}>{t[ERA_SHORT_KEY[era.id]] ?? era.shortName}</span>
                        <span className="text-muted-foreground text-xs tabular-nums">{pct === 100 ? '✓ ' : ''}{done}/{era.lessonIds.length}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${ERA_BAR[era.id] ?? 'from-primary to-primary'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
