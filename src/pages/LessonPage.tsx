import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Star, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AppShell } from '@/components/layout/AppShell';
import { XPBadge } from '@/components/shared/XPBadge';
import { useAuth } from '@/features/auth/AuthContext';
import { markLessonComplete } from '@/features/progress/progressStore';
import { getLessonById, getEraLessons } from '@/features/content/lessonsData';
import { getEraById } from '@/features/content/erasData';
import { toast } from 'sonner';

export default function LessonPage() {
  const { eraId, lessonId } = useParams<{ eraId: string; lessonId: string }>();
  const { currentUser, refreshProgress } = useAuth();
  const navigate = useNavigate();
  const [xpAmt, setXpAmt] = useState(0);

  const lesson = getLessonById(lessonId ?? '');
  const era = getEraById(eraId ?? '');
  if (!lesson || !era) return <AppShell><div className="text-center py-20 text-muted-foreground">Lesson not found.</div></AppShell>;

  const eraLessons = getEraLessons(eraId ?? '');
  const idx = eraLessons.findIndex(l => l.id === lessonId);
  const prev = idx > 0 ? eraLessons[idx - 1] : null;
  const next = idx < eraLessons.length - 1 ? eraLessons[idx + 1] : null;

  function handleComplete() {
    if (!currentUser) return;
    const { newAchievements } = markLessonComplete(currentUser.id, lesson.id, lesson.title);
    refreshProgress();
    setXpAmt(lesson.xpReward);
    toast.success(`Lesson complete! +${lesson.xpReward} XP`);
    if (newAchievements.length > 0) newAchievements.forEach(a => toast.success(`Achievement unlocked: ${a.title}!`));
  }

  return (
    <AppShell>
      {xpAmt > 0 && <XPBadge amount={xpAmt} onDone={() => setXpAmt(0)} />}
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/eras" className="hover:text-foreground">Eras</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className={era.color}>{era.shortName}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground truncate">{lesson.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className={`${era.color} border-current`}>{era.shortName}</Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{lesson.estimatedMinutes} min</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="w-3 h-3" />+{lesson.xpReward} XP</span>
              </div>
              <h1 className="font-heading text-3xl font-bold">{lesson.title}</h1>
              <p className="text-muted-foreground mt-1">{lesson.subtitle}</p>
            </div>
            <Separator />
            {lesson.sections.map((s, i) => (
              <div key={i} className="space-y-3">
                <h2 className="font-heading text-xl font-semibold">{s.heading}</h2>
                <div className="lesson-prose text-muted-foreground leading-relaxed">
                  {s.body.split('\n\n').map((p, j) => <p key={j} className="mb-4">{p}</p>)}
                </div>
              </div>
            ))}
            <Separator />
            {/* Nav */}
            <div className="flex items-center justify-between">
              {prev ? <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/eras/${eraId}/lessons/${prev.id}`)}><ArrowLeft className="w-4 h-4" />Previous</Button> : <div />}
              <Button className="gap-2" onClick={handleComplete}><CheckCircle className="w-4 h-4" />Mark Complete</Button>
              {next ? <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/eras/${eraId}/lessons/${next.id}`)}>Next<ArrowRight className="w-4 h-4" /></Button> : <Button variant="outline" size="sm" onClick={() => navigate(`/eras/${eraId}/quiz`)}>Take Quiz</Button>}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Key Facts</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">{lesson.keyFacts.map((f, i) => <li key={i} className="flex items-start gap-2 text-sm"><span className="text-primary mt-0.5">•</span><span className="text-muted-foreground">{f}</span></li>)}</ul>
              </CardContent>
            </Card>
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => navigate(`/tutor?context=${encodeURIComponent(lesson.title)}`)}>
              <MessageSquare className="w-4 h-4" />Ask AI Tutor about this
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
