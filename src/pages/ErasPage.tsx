import { useNavigate } from 'react-router-dom';
import { Lock, ChevronRight, HelpCircle, Clock, Star, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AppShell } from '@/components/layout/AppShell';
import { EraIcon } from '@/components/shared/EraIcon';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { ERAS } from '@/features/content/erasData';
import { LESSONS } from '@/features/content/lessonsData';
import { getTranslatedEra, getTranslatedLesson } from '@/i18n/contentTranslations';

const ERA_PHOTOS: Record<string, string> = {
  ancient:       'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=700&q=60',
  'middle-ages': 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=700&q=60',
  'early-modern':'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=700&q=60',
  modern:        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=700&q=60',
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const card = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ErasPage() {
  const { progress } = useAuth();
  const { canLesson } = useSubscription();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="font-heading text-3xl font-bold">{t.eras_title}</h1>
          <p className="text-muted-foreground mt-1">{t.eras_subtitle}</p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-6">
          {ERAS.map(rawEra => {
            const era = getTranslatedEra(rawEra, language);
            const eraLessons = LESSONS.filter(l => l.eraId === era.id).sort((a, b) => a.order - b.order);
            const done = eraLessons.filter(l => progress?.completedLessons.includes(l.id)).length;
            const pct = eraLessons.length > 0 ? Math.round((done / eraLessons.length) * 100) : 0;
            const quizDone = progress?.completedQuizzes.includes(era.quizId);
            return (
              <motion.div key={era.id} variants={card} className="h-full">
                <Card className="h-full flex flex-col border-border hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden bg-card">
                  {/* Era Banner */}
                  <div className={`h-28 bg-gradient-to-br ${era.bgGradient} relative flex items-end p-4`}>
                    <img
                      src={ERA_PHOTOS[era.id]}
                      alt={era.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="text-xs bg-black/50 backdrop-blur-sm text-white border-white/20 hover:bg-black/50">
                        {done}/{eraLessons.length} {t.eras_completed}
                      </Badge>
                    </div>
                    <div className="relative z-10 flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-black/40 backdrop-blur-sm ${era.color}`}>
                        <EraIcon icon={era.icon} className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="font-heading text-xl font-bold text-white drop-shadow-md">{era.name}</h2>
                        <p className="text-white/70 text-xs">{era.dateRange}</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 flex-1 flex flex-col space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{era.description}</p>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t.prog_title}</span>
                        <span className="font-semibold text-foreground">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>

                    {/* Lesson list */}
                    <div className="flex-1 space-y-2">
                      {eraLessons.map(lesson => {
                        const locked = !canLesson(lesson.order);
                        const complete = progress?.completedLessons.includes(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border text-sm transition-all ${
                              locked
                                ? 'border-border/40 opacity-50 cursor-not-allowed'
                                : complete
                                ? 'border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10 hover:border-primary/50'
                                : 'border-border cursor-pointer hover:border-primary/40 hover:bg-accent/30'
                            }`}
                            onClick={() => !locked && navigate(`/eras/${era.id}/lessons/${lesson.id}`)}
                          >
                            <div className="shrink-0">
                              {locked ? (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              ) : complete ? (
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <span className={`flex-1 min-w-0 truncate font-medium ${complete ? 'text-primary' : 'text-foreground'}`}>
                              {getTranslatedLesson(lesson, language).title}
                            </span>
                            <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />{lesson.estimatedMinutes}m
                              </span>
                              <span className="flex items-center gap-1 text-amber-400 font-medium">
                                <Star className="w-3 h-3" />+{lesson.xpReward}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Button
                      variant={quizDone ? 'secondary' : 'default'}
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => navigate(`/eras/${era.id}/quiz`)}
                    >
                      <HelpCircle className="w-4 h-4" />
                      {quizDone ? `${t.eras_quiz_label} — ${progress?.quizScores[era.quizId] ?? 0}%` : t.eras_take_quiz}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </AppShell>
  );
}
