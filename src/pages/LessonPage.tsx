import { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Star, ChevronRight, MessageSquare, Bookmark, BookmarkCheck, Map } from 'lucide-react';
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
import { getTranslatedLesson } from '@/i18n/contentTranslations';
import { toggleBookmark, isBookmarked } from '@/features/bookmarks/bookmarkStore';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { HistoricalMapModal } from '@/components/shared/HistoricalMapModal';

function proxyImageUrl(url: string): string {
  return url;
}

// Guaranteed-good era fallback imagery, keyed by eraId. Used as the final
// real-image stage before we drop to the generated pattern, so every era —
// not just the few whose hard-coded asset happens to resolve — shows a banner.
const ERA_FALLBACKS: Record<string, string> = {
  ancient:        'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=60',
  'middle-ages':  'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=1200&q=60',
  'early-modern': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=60',
  modern:         'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=60',
};

function getFallback(eraId: string): string {
  return ERA_FALLBACKS[eraId] ?? ERA_FALLBACKS.ancient;
}

// Banner image resolution is a strict, deterministic chain bound to the lesson
// itself — NO Wikipedia search, NO randomised fallback array. Stages:
//   primary → the lesson's own imageUrl (its explicit DB binding)
//   era     → a fixed image keyed by the lesson's eraId
//   pattern → the generated SVG texture (only if both images fail to load)
// Because every stage is a fixed function of (lesson, era), the same lesson
// always shows the same banner, in every language.
type BannerStage = 'primary' | 'era' | 'pattern';

function LessonBanner({
  imageUrl, eraId, estimatedMinutes, xpReward, title, subtitle,
  bookmarked, onBookmark, theme,
}: {
  imageUrl?: string;
  eraId: string;
  estimatedMinutes: number; xpReward: number; title: string; subtitle: string;
  bookmarked: boolean; onBookmark: () => void;
  theme: LessonTheme;
}) {
  const [loaded, setLoaded] = useState(false);
  // Start at whichever stage actually has a source. (This component is keyed by
  // lesson id in the parent, so each lesson gets a fresh, correctly-seeded
  // chain rather than inheriting the previously-viewed lesson's state.)
  const [stage, setStage] = useState<BannerStage>(imageUrl ? 'primary' : 'era');
  const [src, setSrc] = useState(imageUrl ? proxyImageUrl(imageUrl) : '');

  // Resolve the era stage's source — a fixed, guaranteed-good static URL.
  useEffect(() => {
    if (stage === 'era' && !src) {
      setSrc(getFallback(eraId));
      setLoaded(false);
    }
  }, [stage, src, eraId]);

  // An image at the current stage failed to load → advance to the next stage,
  // clearing src so the effect above resolves the new source.
  function handleError() {
    setLoaded(false);
    setSrc('');
    setStage(s => (s === 'primary' ? 'era' : 'pattern'));
  }

  const imgFailed = stage === 'pattern';

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

      {/* Historical pattern texture — shown when image fails or is absent */}
      {imgFailed || !src ? (
        <svg
          className="absolute inset-0 w-full h-full z-[2] opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <pattern id="hist-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              {/* Cross-hatch grid */}
              <line x1="0" y1="0" x2="60" y2="60" stroke="white" strokeWidth="0.5" />
              <line x1="60" y1="0" x2="0" y2="60" stroke="white" strokeWidth="0.5" />
              <line x1="30" y1="0" x2="30" y2="60" stroke="white" strokeWidth="0.3" />
              <line x1="0" y1="30" x2="60" y2="30" stroke="white" strokeWidth="0.3" />
              {/* Corner diamonds */}
              <polygon points="30,2 38,10 30,18 22,10" fill="none" stroke="white" strokeWidth="0.5" />
              {/* Center dot */}
              <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.6" />
              <circle cx="0" cy="0" r="1" fill="white" opacity="0.4" />
              <circle cx="60" cy="0" r="1" fill="white" opacity="0.4" />
              <circle cx="0" cy="60" r="1" fill="white" opacity="0.4" />
              <circle cx="60" cy="60" r="1" fill="white" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hist-pattern)" />
        </svg>
      ) : null}

      {src && !imgFailed && (
        <img
          src={src}
          alt=""
          aria-hidden
          loading="lazy"
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 z-[2] ${loaded ? 'opacity-50' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
      )}
      {/* Dark-to-transparent overlay — opaque at bottom to guarantee title
          legibility over any banner image, regardless of its brightness. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15 z-[3]" />

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

      <div className="absolute bottom-0 left-0 right-0 p-6">
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
  const [mapOpen, setMapOpen] = useState(false);

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
        <LessonBanner
          key={lesson.id}
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
