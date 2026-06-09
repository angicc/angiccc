import { useMemo } from 'react';
import { BarChart2, Star, Flame, Trophy, BookOpen, Target, Crown, Lock, TrendingUp, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { ERAS } from '@/features/content/erasData';
import { LESSONS } from '@/features/content/lessonsData';
import { ACHIEVEMENTS } from '@/features/progress/xpSystem';
import { QUIZZES } from '@/features/quiz/quizData';
import { useLanguage } from '@/contexts/LanguageContext';

const ERA_COLORS: Record<string, string> = {
  ancient: '#f59e0b',
  'middle-ages': '#60a5fa',
  'early-modern': '#34d399',
  modern: '#fb7185',
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function ProgressPage() {
  const { t } = useLanguage();
  const { progress } = useAuth();
  const { subscription } = useSubscription();
  const tier = subscription?.tier ?? 'free';
  const isAdvanced = tier !== 'free';

  if (!progress) return null;

  const eraData = useMemo(() =>
    ERAS.map(era => {
      const eraLessons = LESSONS.filter(l => l.eraId === era.id);
      const done = eraLessons.filter(l => progress.completedLessons.includes(l.id)).length;
      const quizScore = progress.quizScores[era.quizId] ?? 0;
      return {
        name: era.shortName,
        lessons: done,
        total: eraLessons.length,
        pct: eraLessons.length > 0 ? Math.round((done / eraLessons.length) * 100) : 0,
        quiz: quizScore,
        fill: ERA_COLORS[era.id],
      };
    }),
  [progress]);

  const activityData = useMemo(() =>
    [...progress.recentActivity]
      .filter(a => a.xpGained > 0)
      .slice(0, 12)
      .reverse()
      .map((a, i) => ({
        name: `#${i + 1}`,
        xp: a.xpGained,
        label: a.title.length > 20 ? a.title.slice(0, 20) + '…' : a.title,
      })),
  [progress]);

  const unlockedCount = progress.achievements.length;
  const totalAchievements = ACHIEVEMENTS.length;

  // Advanced: radar data (knowledge profile)
  const radarData = useMemo(() =>
    ERAS.map(era => {
      const eraLessons = LESSONS.filter(l => l.eraId === era.id);
      const done = eraLessons.filter(l => progress.completedLessons.includes(l.id)).length;
      const quiz = QUIZZES.find(q => q.eraId === era.id);
      const quizScore = quiz ? (progress.quizScores[quiz.id] ?? 0) : 0;
      const lessonPct = eraLessons.length > 0 ? Math.round((done / eraLessons.length) * 100) : 0;
      return { era: era.shortName, score: Math.round((lessonPct * 0.5 + quizScore * 0.5)) };
    }),
  [progress]);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-400/10">
            <BarChart2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold">{t.prog_title}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{t.prog_subtitle}</p>
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t.prog_xp_total, value: progress.xp.toLocaleString(), icon: Star, color: 'text-primary' },
            { label: t.prog_current_level, value: progress.level, icon: Flame, color: 'text-orange-400' },
            { label: t.prog_streak, value: `${progress.streak}d`, icon: Target, color: 'text-rose-400' },
            { label: t.prog_achievements, value: `${unlockedCount}/${totalAchievements}`, icon: Trophy, color: 'text-amber-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <motion.div key={label} variants={fadeUp}>
              <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="pt-5 pb-4">
                  <Icon className={`w-5 h-5 ${color} mb-2`} />
                  <div className="text-2xl font-bold font-heading">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Era lesson completion — visible to all */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />{t.prog_lessons_by_era}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {eraData.map((era, i) => (
                <div key={era.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium" style={{ color: era.fill }}>{era.name}</span>
                    <span className="text-muted-foreground">{era.lessons}/{era.total} lessons · {era.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: era.fill }}
                      initial={{ width: 0 }}
                      animate={{ width: `${era.pct}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── ADVANCED ANALYTICS — Pro/Master only ── */}
        {!isAdvanced ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6 pb-6">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2">{t.prog_adv_analytics_title}</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                      {t.prog_adv_analytics_desc}
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
                    {[
                      { icon: BarChart2,   label: t.prog_quiz_score_chart,    desc: t.prog_quiz_by_era },
                      { icon: TrendingUp,  label: t.prog_xp_activity_graph,   desc: t.prog_xp_timeline },
                      { icon: Brain,       label: t.prog_knowledge_radar_chart, desc: t.prog_radar_desc },
                    ].map(({ icon: Icon, label, desc }) => (
                      <div key={label} className="p-3 rounded-xl border border-border bg-card space-y-1.5 opacity-60">
                        <Icon className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold">{label}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">{desc}</p>
                      </div>
                    ))}
                  </div>
                  <Link to="/pricing">
                    <Button size="sm" className="gap-2 mt-2">
                      <Crown className="w-4 h-4" /> {t.prog_upgrade_cta}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quiz scores */}
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />{t.prog_quiz_by_era}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(progress.quizScores).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">{t.prog_no_quiz}</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={eraData.filter(e => e.quiz > 0)} barSize={28}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v}%`, 'Score']} />
                          <Bar dataKey="quiz" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Knowledge Radar */}
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4 text-violet-400" />{t.prog_knowledge_radar}
                      <Badge variant="outline" className="text-[10px] text-violet-400 border-violet-400/30 ml-auto">Pro</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.07)" />
                        <PolarAngleAxis dataKey="era" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <Radar name="Mastery" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
                      </RadarChart>
                    </ResponsiveContainer>
                    <p className="text-[10px] text-muted-foreground text-center mt-1">{t.prog_radar_desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent XP activity */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />{t.prog_xp_timeline}
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30 ml-auto">Pro</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activityData.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">{t.prog_no_xp}</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`+${v} XP`, '']} labelFormatter={(_, p) => p[0]?.payload?.label ?? ''} />
                        <Area type="monotone" dataKey="xp" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#xpGradient)" dot={{ r: 3, fill: 'hsl(var(--primary))' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements unlocked */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />{t.prog_achievements} — {unlockedCount}/{totalAchievements} {t.prog_unlocked}
                    <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-400/30 ml-auto">Pro</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {ACHIEVEMENTS.map(a => (
                      <Badge
                        key={a.id}
                        variant={progress.achievements.includes(a.id) ? 'default' : 'outline'}
                        className={`text-xs gap-1 ${!progress.achievements.includes(a.id) ? 'opacity-35 grayscale' : ''}`}
                      >
                        {a.title}
                        {progress.achievements.includes(a.id) && <span className="text-primary-foreground/70">+{a.xpBonus}xp</span>}
                      </Badge>
                    ))}
                  </div>
                  {unlockedCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      You've unlocked <span className="text-foreground font-medium">{unlockedCount}</span> of {totalAchievements} achievements.{' '}
                      {totalAchievements - unlockedCount > 0 && `${totalAchievements - unlockedCount} still to earn!`}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </AppShell>
  );
}
