import { useState, useLayoutEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Star, ChevronRight, MessageSquare, Bookmark, BookmarkCheck } from 'lucide-react';
import { getLessonTheme, type LessonTheme } from '@/lib/lessonTheme';
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
import { getTranslatedLesson, getTranslatedEra } from '@/i18n/contentTranslations';
import { toggleBookmark, isBookmarked } from '@/features/bookmarks/bookmarkStore';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { resolveBannerCandidates } from '@/features/content/lessonBannerAssets';
import { isGifBanner } from '@/features/content/lessonGifBanners';
import { EraBannerBackdrop } from '@/components/shared/EraBannerBackdrop';

// Banner image resolution is a strict, deterministic chain routed per lesson
// ID (see lessonBannerAssets.ts) — NO Wikipedia search, NO randomised
// fallback array. Candidates: curated per-lesson override → the lesson's own
// imageUrl → the era hero image. If every candidate fails to load, the banner
// renders the era's procedural SVG backdrop, so it is styled — never blank.
// Because every stage is a fixed function of (lesson, era), the same lesson
// always shows the same banner, in every language.
function LessonBanner({
  lessonId, imageUrl, eraId, estimatedMinutes, xpReward, title, subtitle,
  bookmarked, onBookmark, theme,
}: {
  lessonId: string;
  imageUrl?: string;
  eraId: string;
  estimatedMinutes: number; xpReward: number; title: string; subtitle: string;
  bookmarked: boolean; onBookmark: () => void;
  theme: LessonTheme;
}) {
  const [loaded, setLoaded] = useState(false);
  // The full candidate chain is fixed at mount (this component is keyed by
  // lesson id in the parent, so each lesson gets a fresh, correctly-seeded
  // chain rather than inheriting the previously-viewed lesson's state).
  const [candidates] = useState(() => resolveBannerCandidates(lessonId, eraId, imageUrl));
  const [candidateIdx, setCandidateIdx] = useState(0);

  const src = candidates[candidateIdx] ?? '';
  const imgFailed = candidateIdx >= candidates.length;

  // A candidate failed to load → advance to the next entry in the chain.
  function handleError() {
    setLoaded(false);
    setCandidateIdx(i => i + 1);
  }

  return (
    <div
      className="relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-8 border border-border/50"
      style={{ background: theme.bannerGradient }}
    >
      {/* Category-specific accent stripe — always 3px, consistent across all banners */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-20" style={{ background: theme.accentColor }} />

      {/* Subtle radial highlight — top-left glow using accent color */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: `radial-gradient(ellipse 70% 60% at 20% 30%, ${theme.accentColor}30 0%, transparent 70%)` }}
      />

      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-white/[0.03] z-[2]" />
      )}

      {/* Era-specific procedural backdrop — shown when every candidate fails */}
      {(imgFailed || !src) && <EraBannerBackdrop eraId={eraId} />}

      {src && !imgFailed && (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 z-[2] ${loaded ? 'opacity-60' : 'opacity-0'} ${isGifBanner(src) ? 'scale-[1.07]' : ''}`}
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
      )}
      {/* Progressive mask: fully transparent across the top fifth, near-opaque
          ink at the base — guarantees AA/AAA title contrast over any image,
          whether its lower region is pure white marble or pitch-dark oil paint. */}
      <div
        className="absolute inset-0 z-[3]"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(10,15,30,0.95) 100%)' }}
      />

      {/* Category watermark */}
      <div className="absolute top-6 right-6 text-7xl opacity-[0.12] select-none pointer-events-none z-10 leading-none">
        {theme.categoryIcon}
      </div>

      {/* Bookmark */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onBookmark}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
        >
          {bookmarked
            ? <BookmarkCheck className="w-4 h-4 text-amber-400" />
            : <Bookmark className="w-4 h-4 text-white/80" />
          }
        </button>
      </div>

      {/* z-10 keeps the typography ABOVE the z-[3] contrast mask — without it,
          positive z-index paints over positioned z-auto siblings and the
          near-opaque mask base would dim the title it exists to protect. */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge
            variant="outline"
            className="text-xs bg-black/40 backdrop-blur-sm border-current font-semibold"
            style={{ color: theme.accentLight, borderColor: `${theme.accentColor}99` }}
          >
            {theme.categoryIcon} {theme.categoryLabel}
          </Badge>
          <Badge variant="outline" className={`text-xs bg-black/30 backdrop-blur-sm border-transparent ${theme.difficultyColor}`}>
            {theme.difficulty}
          </Badge>
          <span className="text-white/70 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{estimatedMinutes} min</span>
          <span className="text-white/70 text-xs flex items-center gap-1"><Star className="w-3 h-3" />+{xpReward} XP</span>
        </div>
        <h1
          className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
          style={{ textShadow: '0 2px 18px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1), 0 0 28px rgba(212,175,55,0.45)' }}
        >{title}</h1>
        <p className="text-white/85 text-sm mt-1" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.95)' }}>{subtitle}</p>
      </div>
    </div>
  );
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

  // Force the scroll container back to the top the instant a new lesson mounts
  // (e.g. clicking "Next Lesson"). Keyed on lessonId so it fires for every
  // lesson change, not just full route swaps. Runs before paint to avoid a
  // flash of the previous lesson's scroll position.
  useLayoutEffect(() => {
    document.querySelector('main')?.scrollTo({ top: 0, left: 0 });
    window.scrollTo(0, 0);
  }, [lessonId]);

  const rawLesson = getLessonById(lessonId ?? '');
  const lesson = rawLesson ? getTranslatedLesson(rawLesson, language) : undefined;
  const eraRaw = getEraById(eraId ?? '');
  const era = eraRaw ? getTranslatedEra(eraRaw, language) : eraRaw;
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
        <LessonBanner
          key={lesson.id}
          lessonId={lesson.id}
          imageUrl={lesson.imageUrl}
          eraId={lesson.eraId}
          estimatedMinutes={lesson.estimatedMinutes}
          xpReward={lesson.xpReward}
          title={lesson.title}
          subtitle={lesson.subtitle}
          bookmarked={bookmarked}
          onBookmark={handleBookmark}
          theme={getLessonTheme(lesson)}
        />

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
            {/* Two remaining actions absorb the full sidebar width evenly,
                keeping the vertical rhythm balanced after the Historical Map
                node was removed. */}
            <div className="flex flex-col gap-2.5">
              <Button variant="outline" size="sm" className="w-full gap-2 h-9" onClick={() => navigate(`/tutor?context=${encodeURIComponent(lesson.title)}`)}>
                <MessageSquare className="w-4 h-4" />{t.lesson_discuss}
              </Button>
              <Button
                variant={bookmarked ? 'secondary' : 'outline'}
                size="sm"
                className="w-full gap-2 h-9"
                onClick={handleBookmark}
              >
                {bookmarked ? <><BookmarkCheck className="w-4 h-4 text-amber-400" />{t.lesson_bookmarked}</> : <><Bookmark className="w-4 h-4" />{t.lesson_save}</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
