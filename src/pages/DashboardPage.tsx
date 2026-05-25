import { useNavigate } from 'react-router-dom';
import { BookOpen, HelpCircle, Flame, Star, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppShell } from '@/components/layout/AppShell';
import { LevelProgress } from '@/components/shared/LevelProgress';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { useAuth } from '@/features/auth/AuthContext';
import { ERAS } from '@/features/content/erasData';
import { LESSONS } from '@/features/content/lessonsData';

export default function DashboardPage() {
  const { currentUser, progress } = useAuth();
  const navigate = useNavigate();
  if (!progress) return null;

  const nextLesson = LESSONS.find(l => !progress.completedLessons.includes(l.id));
  const avgScore = Object.values(progress.quizScores).length > 0
    ? Math.round(Object.values(progress.quizScores).reduce((a,b) => a+b, 0) / Object.values(progress.quizScores).length)
    : 0;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold">Welcome back, {currentUser?.username}!</h1>
              <StreakBadge streak={progress.streak} />
            </div>
            <LevelProgress xp={progress.xp} className="sm:w-56" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:'Total XP', value: progress.xp.toLocaleString(), icon: Star, color:'text-primary' },
            { label:'Level', value: progress.level, icon: Flame, color:'text-orange-400' },
            { label:'Lessons Done', value:`${progress.completedLessons.length} / 14`, icon: BookOpen, color:'text-emerald-400' },
            { label:'Quiz Avg', value: avgScore > 0 ? `${avgScore}%` : '—', icon: HelpCircle, color:'text-blue-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="pt-5 pb-4">
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <div className="text-2xl font-bold font-heading">{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Continue learning */}
          <div className="lg:col-span-2 space-y-4">
            {nextLesson && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-3"><CardTitle className="text-base">Continue Learning</CardTitle></CardHeader>
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
                    Continue <ArrowRight className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recent activity */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
              <CardContent>
                {progress.recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity yet — start your first lesson!</p>
                ) : (
                  <ScrollArea className="h-48">
                    <div className="space-y-2 pr-3">
                      {progress.recentActivity.slice(0,10).map((e,i) => (
                        <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                          <span className="text-muted-foreground truncate pr-2">{e.title}</span>
                          {e.xpGained > 0 && <Badge variant="secondary" className="shrink-0 text-xs">+{e.xpGained} XP</Badge>}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Era progress */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Progress by Era</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {ERAS.map(era => {
                const done = era.lessonIds.filter(id => progress.completedLessons.includes(id)).length;
                const pct = Math.round((done / era.lessonIds.length) * 100);
                return (
                  <div key={era.id} className="cursor-pointer" onClick={() => navigate('/eras')}>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className={`font-medium ${era.color}`}>{era.shortName}</span>
                      <span className="text-muted-foreground text-xs">{done}/{era.lessonIds.length}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
