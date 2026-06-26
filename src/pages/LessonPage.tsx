import { useState, useEffect } from 'react';
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
import { fetchWikiImage } from '@/lib/wikiImage';
import { HistoricalMapModal } from '@/components/shared/HistoricalMapModal';

function proxyImageUrl(url: string): string {
  return url;
}

const ERA_FALLBACKS: Record<string, string> = {
  amber:   'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=60',
  blue:    'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=1200&q=60',
  emerald: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=60',
  rose:    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=60',
};

function getFallback(bgGradient: string): string {
  for (const [key, url] of Object.entries(ERA_FALLBACKS)) {
    if (bgGradient.includes(key)) return url;
  }
  return ERA_FALLBACKS.amber;
}

function LessonBanner({
  imageUrl, estimatedMinutes, xpReward, title, subtitle,
  bookmarked, onBookmark, theme,
}: {
  imageUrl?: string;
  estimatedMinutes: number; xpReward: number; title: string; subtitle: string;
  bookmarked: boolean; onBookmark: () => void;
  theme: LessonTheme;
}) {
  const [loaded, setLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [src, setSrc] = useState(imageUrl ? proxyImageUrl(imageUrl) : '');
  const [triedWiki, setTriedWiki] = useState(false);

  // Async banner resolver: when no hardcoded image is supplied — or the
  // hardcoded one 404s — query the Wikipedia REST API by lesson title for a
  // high-resolution historical depiction. Keyless and CORS-enabled.
  useEffect(() => {
    if (src || triedWiki) return;
    let cancelled = false;
    setTriedWiki(true);
    fetchWikiImage(title, true).then(url => {
      if (cancelled || !url) return;
      setImgFailed(false);
      setSrc(url);
    });
    return () => { cancelled = true; };
  }, [src, triedWiki, title]);

  function handleError() {
    // First failure on the hardcoded asset → fall back to Wikipedia by title.
    if (!triedWiki) {
      setTriedWiki(true);
      setLoaded(false);
      fetchWikiImage(title, true).then(url => {
        if (url) { setSrc(url); setImgFailed(false); }
        else { setImgFailed(true); setLoaded(true); }
      });
      return;
    }
    setImgFailed(true);
    setLoaded(true);
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
      {/* Dark-to-transparent overlay — stronger at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-[3]" />

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
          style={{ textShadow: '0 2px 16px rgba(212,175,55,0.55), 0 1px 4px rgba(0,0,0,0.9)' }}
        >{title}</h1>
        <p className="text-white/80 text-sm mt-1">{subtitle}</p>
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
          imageUrl={lesson.imageUrl}
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
