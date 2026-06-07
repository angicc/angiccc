import { useMemo } from 'react';
import { BarChart2, Star, Flame, Trophy, BookOpen, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/AuthContext';
import { ERAS } from '@/features/content/erasData';
import { LESSONS } from '@/features/content/lessonsData';
import { ACHIEVEMENTS } from '@/features/progress/xpSystem';

const ERA_COLORS: Record<string, string> = {
  ancient: '#f59e0b',
  'middle-ages': '#60a5fa',
  'early-modern': '#34d399',
  modern: '#fb7185',
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function ProgressPage() {
  const { progress } = useAuth();
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

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-400/10">
            <BarChart2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold">Progress & Analytics</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Your learning journey at a glance</p>
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total XP', value: progress.xp.toLocaleString(), icon: Star, color: 'text-primary' },
            { label: 'Level', value: progress.level, icon: Flame, color: 'text-orange-400' },
            { label: 'Streak', value: `${progress.streak}d`, icon: Target, color: 'text-rose-400' },
            { label: 'Achievements', value: `${unlockedCount}/${totalAchievements}`, icon: Trophy, color: 'text-amber-400' },
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Era completion bars */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />Lessons by Era
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

          {/* Quiz scores */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />Quiz Scores by Era
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(progress.quizScores).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Complete a quiz to see your scores here.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={eraData.filter(e => e.quiz > 0)} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                        formatter={(v: number) => [`${v}%`, 'Score']}
                      />
                      <Bar dataKey="quiz" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent XP activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />Recent XP Gains
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Start learning to see your XP history here.</p>
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
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number) => [`+${v} XP`, '']}
                      labelFormatter={(_, p) => p[0]?.payload?.label ?? ''}
                    />
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
                <Trophy className="w-4 h-4 text-amber-400" />Achievements — {unlockedCount}/{totalAchievements} Unlocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ACHIEVEMENTS.map(a => (
                  <Badge
                    key={a.id}
                    variant={progress.achievements.includes(a.id) ? 'default' : 'outline'}
                    className={`text-xs gap-1 ${!progress.achievements.includes(a.id) ? 'opacity-40 grayscale' : ''}`}
                  >
                    {a.title}
                    {progress.achievements.includes(a.id) && <span className="text-primary-foreground/70">+{a.xpBonus}xp</span>}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  );
}
