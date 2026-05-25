import { useNavigate } from 'react-router-dom';
import { Lock, ChevronRight, HelpCircle, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AppShell } from '@/components/layout/AppShell';
import { EraIcon } from '@/components/shared/EraIcon';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { ERAS } from '@/features/content/erasData';
import { LESSONS } from '@/features/content/lessonsData';

export default function ErasPage() {
  const { progress } = useAuth();
  const { canLesson } = useSubscription();
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div><h1 className="font-heading text-3xl font-bold">Eras & Lessons</h1><p className="text-muted-foreground mt-1">Choose an era to explore its lessons and take the quiz.</p></div>
        <div className="grid md:grid-cols-2 gap-6">
          {ERAS.map(era => {
            const eraLessons = LESSONS.filter(l => l.eraId === era.id).sort((a,b) => a.order - b.order);
            const done = eraLessons.filter(l => progress?.completedLessons.includes(l.id)).length;
            const pct = eraLessons.length > 0 ? Math.round((done / eraLessons.length) * 100) : 0;
            const quizDone = progress?.completedQuizzes.includes(era.quizId);
            return (
              <Card key={era.id} className={`border-border hover:border-primary/40 transition-colors bg-gradient-to-br ${era.bgGradient}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-background/50 ${era.color}`}><EraIcon icon={era.icon} className="w-5 h-5" /></div>
                      <div>
                        <h2 className="font-heading text-lg font-bold">{era.name}</h2>
                        <p className="text-xs text-muted-foreground">{era.dateRange}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">{done}/{eraLessons.length}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{era.description}</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground"><span>Progress</span><span>{pct}%</span></div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {eraLessons.map(lesson => {
                    const locked = !canLesson(lesson.order);
                    const complete = progress?.completedLessons.includes(lesson.id);
                    return (
                      <div key={lesson.id} className={`flex items-center justify-between p-2.5 rounded-lg border text-sm transition-colors ${locked ? 'border-border/50 opacity-60' : 'border-border hover:border-primary/40 cursor-pointer'} ${complete ? 'bg-primary/5 border-primary/20' : 'bg-background/40'}`}
                        onClick={() => !locked && navigate(`/eras/${era.id}/lessons/${lesson.id}`)}>
                        <div className="flex items-center gap-2 min-w-0">
                          {locked ? <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : complete ? <span className="w-3.5 h-3.5 rounded-full bg-primary shrink-0 flex items-center justify-center text-primary-foreground" style={{fontSize:8}}>✓</span> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground ml-2">
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{lesson.estimatedMinutes}m</span>
                          <span className="flex items-center gap-0.5"><Star className="w-3 h-3" />+{lesson.xpReward}</span>
                        </div>
                      </div>
                    );
                  })}
                  <Button variant={quizDone ? 'secondary' : 'outline'} size="sm" className="w-full mt-2 gap-2" onClick={() => navigate(`/eras/${era.id}/quiz`)}>
                    <HelpCircle className="w-4 h-4" />{quizDone ? `Quiz Done — ${progress?.quizScores[era.quizId] ?? 0}%` : 'Take Quiz'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
