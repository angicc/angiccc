import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Star, ChevronRight, MessageSquare, Bookmark, BookmarkCheck, Map } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AppShell } from '@/components/layout/AppShell';
import { XPBadge } from '@/components/shared/XPBadge';
import { AchievementToast } from '@/components/shared/AchievementToast';
import { useAuth } from '@/features/auth/AuthContext';
import type { Achievement } from '@/types';
import { markLessonComplete } from '@/features/progress/progressStore';
import { getLessonById, getEraLessons } from '@/features/content/lessonsData';
import { getEraById } from '@/features/content/erasData';
import { getTranslatedLesson } from '@/i18n/contentTranslations';
import { toggleBookmark, isBookmarked } from '@/features/bookmarks/bookmarkStore';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { HistoricalMapModal } from '@/components/shared/HistoricalMapModal';

function proxyImageUrl(url: string): string {
  return url;
}

export default function LessonPage() {
  const { t, language } = useLanguage();
  const { eraId, lessonId } = useParams<{ eraId: string; lessonId: string }>();
  const { currentUser, refreshProgress } = useAuth();
  const navigate = useNavigate();
  const [xpAmt, setXpAmt] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [bookmarked, setBookmarked] = useState(() =>
    currentUser && lessonId ? isBookmarked(currentUser.id, lessonId) : false
  );
  const [mapOpen, setMapOpen] = useState(false);

  const rawLesson = getLessonById(lessonId ?? '');
  const lesson = rawLesson ? getTranslatedLesson(rawLesson, language) : undefined;
  const era = getEraById(eraId ?? '');
  if (!lesson || !era) return <AppShell><div className="text-center py-20 text-muted-foreground">Lesson not found.</div></AppShell>;

  const eraLessonsRaw = getEraLessons(eraId ?? '');
  const eraLessons = eraLessonsRaw.map(l => getTranslatedLesson(l, language));
  const idx = eraLessons.findIndex(l => l.id === lessonId);
  const prev = idx > 0 ? eraLessons[idx - 1] : null;
  const next = idx < eraLessons.length - 1 ? eraLessons[idx + 1] : null;

  function handleComplete() {
    if (!currentUser || completed || !lesson) return;
    const { newAchievements } = markLessonComplete(currentUser.id, lesson.id, lesson.title);
    refreshProgress();
    setXpAmt(lesson.xpReward);
    setCompleted(true);
    toast.success(`Lesson complete! +${lesson.xpReward} XP`);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#f59e0b','#fbbf24','#d97706','#ffffff'] });
    if (newAchievements.length > 0) {
      setUnlockedAchievements(newAchievements);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#f59e0b','#fbbf24','#d97706','#ffffff','#fde68a'] });
    }
  }

  function handleBookmark() {
    if (!currentUser || !lesson) return;
    const next = toggleBookmark(currentUser.id, lesson.id);
    setBookmarked(next);
    toast.success(next ? 'Lesson bookmarked!' : 'Bookmark removed.');
  }

  return (
    <AppShell>
      <HistoricalMapModal lessonId={lessonId ?? ''} lessonTitle={lesson.title} open={mapOpen} onOpenChange={setMapOpen} />
      {xpAmt > 0 && <XPBadge amount={xpAmt} onDone={() => setXpAmt(0)} />}
      {unlockedAchievements.length > 0 && <AchievementToast achievements={unlockedAchievements} onDone={() => setUnlockedAchievements([])} />}
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
          <Link to="/eras" className="hover:text-foreground transition-colors">{t.lesson_eras_breadcrumb}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className={era.color}>{era.shortName}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground truncate">{lesson.title}</span>
        </div>

        {/* Hero banner */}
        <div className={`relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br ${era.bgGradient} border border-border`}>
          {lesson.imageUrl && (
            <img
              src={proxyImageUrl(lesson.imageUrl)}
              alt=""
              aria-hidden
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-cover opacity-75"
              onError={e => e.currentTarget.style.display = 'none'}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-4 right-4">
            <button
              onClick={handleBookmark}
              className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
              title={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
            >
              {bookmarked
                ? <BookmarkCheck className="w-4 h-4 text-amber-400" />
                : <Bookmark className="w-4 h-4 text-white/80" />
              }
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className={`${era.color} border-current bg-black/40 backdrop-blur-sm text-xs`}>{era.shortName}</Badge>
              <span className="text-white/70 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.estimatedMinutes} min</span>
              <span className="text-white/70 text-xs flex items-center gap-1"><Star className="w-3 h-3" />+{lesson.xpReward} XP</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{lesson.title}</h1>
            <p className="text-white/80 text-sm mt-1">{lesson.subtitle}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {lesson.sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3 }}
                className="space-y-3"
              >
                <h2 className="font-heading text-xl font-semibold">{s.heading}</h2>
                <div className="text-muted-foreground leading-relaxed">
                  {s.body.split('\n\n').map((p, j) => <p key={j} className="mb-4 text-[0.95rem]">{p}</p>)}
                </div>
              </motion.div>
            ))}
            <Separator />
            <div className="flex items-center justify-between">
              {prev
                ? <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/eras/${eraId}/lessons/${prev.id}`)}><ArrowLeft className="w-4 h-4" />{t.btn_back}</Button>
                : <div />}
              <Button className="gap-2" onClick={handleComplete} disabled={completed} variant={completed ? 'secondary' : 'default'}>
                <CheckCircle className="w-4 h-4" />{completed ? t.lesson_already_done : t.lesson_complete_btn}
              </Button>
              {next
                ? <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/eras/${eraId}/lessons/${next.id}`)}>{ t.btn_next}<ArrowRight className="w-4 h-4" /></Button>
                : <Button variant="outline" size="sm" onClick={() => navigate(`/eras/${eraId}/quiz`)}>{t.lesson_take_quiz}</Button>}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">{t.lesson_key_facts}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {lesson.keyFacts.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5 font-bold">•</span>
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => navigate(`/tutor?context=${encodeURIComponent(lesson.title)}`)}>
              <MessageSquare className="w-4 h-4" />{t.lesson_discuss}
            </Button>
            <Button
              variant={bookmarked ? 'secondary' : 'outline'}
              size="sm"
              className="w-full gap-2"
              onClick={handleBookmark}
            >
              {bookmarked ? <><BookmarkCheck className="w-4 h-4 text-amber-400" />{t.lesson_bookmarked}</> : <><Bookmark className="w-4 h-4" />{t.lesson_save}</>}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => setMapOpen(true)}
            >
              <Map className="w-4 h-4" />{t.lesson_map}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
