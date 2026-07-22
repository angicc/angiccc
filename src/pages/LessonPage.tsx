import { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Star, ChevronRight, MessageSquare, Bookmark, BookmarkCheck, Telescope, Lock, Hourglass, ScrollText } from 'lucide-react';
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
import { markLessonComplete, recordAnalysisResult } from '@/features/progress/progressStore';
import { ClioAnalysisGate } from '@/features/progress/ClioAnalysisGate';
import {
  isAnalysisPassed, startCooldown, getLessonLock, useCooldownRemaining, formatCooldown,
} from '@/features/progress/analysisGate';
import { getLessonById, getEraLessons } from '@/features/content/lessonsData';
import { getEraById } from '@/features/content/erasData';
import { getTranslatedLesson, getTranslatedEra, hasStaticLessonTranslation } from '@/i18n/contentTranslations';
import { translateLessonBodies } from '@/i18n/dynamicLessonTranslation';
import { LESSON_DEEP_DIVES } from '@/i18n/lessonDeepDives';
import { toggleBookmark, isBookmarked } from '@/features/bookmarks/bookmarkStore';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { resolveBannerCandidates } from '@/features/content/lessonBannerAssets';
import { isGifBanner, resolveGifPageBanner } from '@/features/content/lessonGifBanners';
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
  const [candidates, setCandidates] = useState(() => resolveBannerCandidates(lessonId, eraId, imageUrl));
  const [candidateIdx, setCandidateIdx] = useState(0);

  // Lessons whose animated banner lives behind a gallery page (makeagif.com)
  // resolve the direct media URL asynchronously; once known it takes the head
  // of the chain. The static candidates keep the banner filled meanwhile, and
  // a failed resolution simply leaves the static chain untouched.
  useEffect(() => {
    let alive = true;
    resolveGifPageBanner(lessonId).then(url => {
      if (!alive || !url) return;
      setCandidates(prev => (prev[0] === url ? prev : [url, ...prev.filter(u => u !== url)]));
      setCandidateIdx(0);
      setLoaded(false);
    });
    return () => { alive = false; };
  }, [lessonId]);

  const src = candidates[candidateIdx] ?? '';
  const imgFailed = candidateIdx >= candidates.length;

  // A candidate failed to load → advance to the next entry in the chain.
  function handleError() {
    setLoaded(false);
    setCandidateIdx(i => i + 1);
  }

  return (
    <div
      className="relative w-full aspect-[21/9] min-h-64 max-h-96 rounded-2xl overflow-hidden mb-8 border border-border/50"
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
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 z-[2] ${loaded ? (isGifBanner(src) ? 'opacity-80' : 'opacity-60') : 'opacity-0'} ${isGifBanner(src) ? 'scale-[1.07]' : ''}`}
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

// Progression-gate microcopy in all six UI languages (local to this page,
// same pattern as DEEP_DIVE_LABEL below).
const GATE_LABELS: Record<string, { analysisNeeded: string; submitAnalysis: string; cooldownShort: string; lockedTitle: string; lockedAnalysis: string; lockedCooldown: string; lockedSequence: string; backToEra: string }> = {
  en: { analysisNeeded: 'Analysis required', submitAnalysis: 'Submit analysis', cooldownShort: 'Cooldown', lockedTitle: 'This lesson is still sealed', lockedAnalysis: 'Pass the written analysis of the previous lesson (grade B or better) to open it.', lockedCooldown: 'Your 30-minute reflection period is still running.', lockedSequence: 'Complete the previous lesson first — the path through each era is walked in order.', backToEra: 'Back to eras' },
  es: { analysisNeeded: 'Análisis requerido', submitAnalysis: 'Enviar análisis', cooldownShort: 'Espera', lockedTitle: 'Esta lección sigue sellada', lockedAnalysis: 'Aprueba el análisis escrito de la lección anterior (nota B o mejor) para abrirla.', lockedCooldown: 'Tu período de reflexión de 30 minutos sigue en curso.', lockedSequence: 'Completa primero la lección anterior: el camino de cada era se recorre en orden.', backToEra: 'Volver a las eras' },
  ru: { analysisNeeded: 'Требуется анализ', submitAnalysis: 'Отправить анализ', cooldownShort: 'Пауза', lockedTitle: 'Этот урок ещё запечатан', lockedAnalysis: 'Сдайте письменный анализ предыдущего урока (оценка B или выше), чтобы открыть его.', lockedCooldown: 'Ваш 30-минутный период осмысления ещё идёт.', lockedSequence: 'Сначала завершите предыдущий урок — путь по каждой эпохе проходится по порядку.', backToEra: 'К эпохам' },
  mk: { analysisNeeded: 'Потребна е анализа', submitAnalysis: 'Испрати анализа', cooldownShort: 'Пауза', lockedTitle: 'Оваа лекција е сè уште запечатена', lockedAnalysis: 'Положи ја писмената анализа на претходната лекција (оценка B или подобра) за да ја отвориш.', lockedCooldown: 'Твојот 30-минутен период на размислување сè уште трае.', lockedSequence: 'Прво заврши ја претходната лекција — патот низ секоја ера се минува по ред.', backToEra: 'Назад кон ерите' },
  de: { analysisNeeded: 'Analyse erforderlich', submitAnalysis: 'Analyse einreichen', cooldownShort: 'Wartezeit', lockedTitle: 'Diese Lektion ist noch versiegelt', lockedAnalysis: 'Bestehe die schriftliche Analyse der vorherigen Lektion (Note B oder besser), um sie zu öffnen.', lockedCooldown: 'Deine 30-minütige Reflexionsphase läuft noch.', lockedSequence: 'Schließe zuerst die vorherige Lektion ab — der Weg durch jede Epoche wird der Reihe nach gegangen.', backToEra: 'Zurück zu den Epochen' },
  fr: { analysisNeeded: 'Analyse requise', submitAnalysis: "Soumettre l'analyse", cooldownShort: 'Attente', lockedTitle: 'Cette leçon est encore scellée', lockedAnalysis: "Réussis l'analyse écrite de la leçon précédente (note B ou mieux) pour l'ouvrir.", lockedCooldown: 'Ta période de réflexion de 30 minutes est encore en cours.', lockedSequence: "Termine d'abord la leçon précédente — le chemin de chaque ère se parcourt dans l'ordre.", backToEra: 'Retour aux ères' },
};

export default function LessonPage() {
  const { t, language } = useLanguage();
  const { eraId, lessonId } = useParams<{ eraId: string; lessonId: string }>();
  const { currentUser, progress, refreshProgress } = useAuth();
  const navigate = useNavigate();
  const [xpAmt, setXpAmt] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(() =>
    currentUser && lessonId ? isAnalysisPassed(currentUser.id, lessonId) : false
  );
  const cooldownMs = useCooldownRemaining(currentUser?.id);
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

  // Re-sync per-lesson state when navigating between lessons: this component
  // stays mounted across "Next Lesson" navigation, so `completed`, the gate,
  // and the analysis flag must be re-derived for the new lesson id.
  useEffect(() => {
    if (!currentUser || !lessonId) return;
    setCompleted(progress?.completedLessons.includes(lessonId) ?? false);
    setAnalysisDone(isAnalysisPassed(currentUser.id, lessonId));
    setGateOpen(false);
    setBookmarked(isBookmarked(currentUser.id, lessonId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, currentUser?.id]);

  const rawLesson = getLessonById(lessonId ?? '');

  // Translate this lesson's long body paragraphs on demand for non-English
  // languages when it has no hand-authored translation. Cached after the first
  // open; the LanguageProvider re-renders the page as each section lands.
  useEffect(() => {
    if (!rawLesson || language === 'en') return;
    if (hasStaticLessonTranslation(rawLesson.id)) return;
    void translateLessonBodies(rawLesson, language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawLesson?.id, language]);

  const lesson = rawLesson ? getTranslatedLesson(rawLesson, language) : undefined;
  const eraRaw = getEraById(eraId ?? '');
  const era = eraRaw ? getTranslatedEra(eraRaw, language) : eraRaw;
  if (!lesson || !era) return <AppShell><div className="text-center py-20 text-muted-foreground">Lesson not found.</div></AppShell>;


  // Progression gate: is THIS lesson sealed (deep link into a locked lesson)?
  // Re-evaluated every render — the cooldown hook ticks once per second, so
  // countdowns and lock releases surface live without a reload.
  const gl = GATE_LABELS[language] ?? GATE_LABELS.en;
  const completedIds = progress?.completedLessons ?? [];
  const selfLock = currentUser && rawLesson ? getLessonLock(currentUser.id, rawLesson, completedIds) : null;

  if (selfLock?.locked) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto text-center py-24 space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full border border-amber-400/30 bg-amber-500/10 flex items-center justify-center">
            {selfLock.reason === 'cooldown'
              ? <Hourglass className="w-7 h-7 text-amber-400" />
              : <Lock className="w-7 h-7 text-amber-400" />}
          </div>
          <h1 className="font-heading text-2xl font-bold">{gl.lockedTitle}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {selfLock.reason === 'cooldown' ? gl.lockedCooldown : selfLock.reason === 'sequence' ? gl.lockedSequence : gl.lockedAnalysis}
          </p>
          {selfLock.reason === 'cooldown' && (
            <p className="font-heading text-3xl font-bold text-amber-400 tabular-nums">{formatCooldown(cooldownMs)}</p>
          )}
          <Button variant="outline" onClick={() => navigate('/eras')}>{gl.backToEra}</Button>
        </div>
      </AppShell>
    );
  }

  function handleComplete() {
    if (!currentUser || completed || !lesson) return;
    const { newAchievements } = markLessonComplete(currentUser.id, lesson.id, lesson.title);
    // Completion opens the 30-minute reflection window and summons Clio's
    // analysis gate — the next lesson stays sealed until a B-or-better pass.
    startCooldown(currentUser.id);
    refreshProgress();
    setXpAmt(lesson.xpReward);
    setCompleted(true);
    toast.success(t.toast_lesson_complete.replace('{xp}', String(lesson.xpReward)));
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#f59e0b','#fbbf24','#d97706','#ffffff'] });
    if (newAchievements.length > 0) {
      setUnlockedAchievements(newAchievements);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#f59e0b','#fbbf24','#d97706','#ffffff','#fde68a'] });
    }
    if (!isAnalysisPassed(currentUser.id, lesson.id)) setGateOpen(true);
  }

  function handleAnalysisPassed(v: import('@/features/progress/analysisGrader').AnalysisVerdict) {
    if (!currentUser || !lesson) return;
    setAnalysisDone(true);
    const { newAchievements } = recordAnalysisResult(currentUser.id, lesson.title, v.grade, v.score);
    refreshProgress();
    setXpAmt(60);
    if (newAchievements.length > 0) setUnlockedAchievements(newAchievements);
  }

  function handleBookmark() {
    if (!currentUser || !lesson) return;
    const next = toggleBookmark(currentUser.id, lesson.id);
    setBookmarked(next);
    toast.success(next ? t.toast_bookmarked : t.toast_bookmark_removed);
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

        {/* Hero banner — the animated GIF/asset chain plus the translated
            title & subtitle (Macedonian titles come from the corrected catalog
            via getTranslatedLesson, so no separate header is needed). */}
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
            {lesson.sections.map((s, i) => {
              // The final section on a lesson with a deep dive gets a subtle
              // premium accent so the extra depth reads as intentional.
              const isDeepDive = !!LESSON_DEEP_DIVES[lesson.id] && i === lesson.sections.length - 1;
              const DEEP_DIVE_LABEL: Record<string, string> = {
                en: 'Deep Dive', es: 'Análisis a fondo', ru: 'Глубокое погружение',
                mk: 'Длабоко нурнување', de: 'Vertiefung', fr: 'Approfondissement',
              };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                  className={isDeepDive
                    ? 'space-y-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-transparent p-5 pl-6 relative overflow-hidden'
                    : 'space-y-3'}
                >
                  {isDeepDive && (
                    <>
                      <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/70 to-primary/10" aria-hidden />
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                        <Telescope className="h-3.5 w-3.5" />
                        {DEEP_DIVE_LABEL[language] ?? DEEP_DIVE_LABEL.en}
                      </div>
                    </>
                  )}
                  <h2 className="font-heading text-xl font-semibold">{s.heading}</h2>
                  <div className="text-muted-foreground leading-relaxed">
                    {s.body.split('\n\n').map((p, j) => <p key={j} className="mb-4 text-[0.95rem]">{p}</p>)}
                  </div>
                </motion.div>
              );
            })}
            <Separator />
            {/* Deliberately no "Next" button: the era list is the only way
                forward, so the sequential analysis gate can never be skipped.
                Completing the lesson opens Clio's analysis right here. */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/eras')}>
                <ArrowLeft className="w-4 h-4" />{t.btn_back}
              </Button>
              <Button className="gap-2" onClick={handleComplete} disabled={completed} variant={completed ? 'secondary' : 'default'}>
                <CheckCircle className="w-4 h-4" />{completed ? t.lesson_already_done : t.lesson_complete_btn}
              </Button>
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
              {completed && !analysisDone && (
                <Button size="sm" className="w-full gap-2 h-9 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold" onClick={() => setGateOpen(true)}>
                  <ScrollText className="w-4 h-4" />{gl.submitAnalysis}
                </Button>
              )}
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
      {currentUser && (
        <ClioAnalysisGate
          open={gateOpen}
          lesson={lesson}
          userId={currentUser.id}
          onClose={() => setGateOpen(false)}
          onPassed={handleAnalysisPassed}
        />
      )}
    </AppShell>
  );
}
