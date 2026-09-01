// ─── Public era page (/ancient-world, /middle-ages …) ────────────────────────
//
// The landing page used to print every lesson title of all six eras inline:
// 132 lines of text under a heading, which nobody reads. Reviewer feedback was
// to make that section a timeline and move the detail onto its own page, which
// is what this is.
//
// It is deliberately OUTSIDE the ProtectedRoute wall. /eras already exists but
// requires an account, so a visitor deciding whether to sign up could not see
// what they would be signing up for. This page is the curriculum, readable by
// anyone, with the sign-up ask at the end rather than in front of it.

import { useMemo } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Clock3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ERAS } from '@/features/content/erasData';
import { LESSONS } from '@/features/content/lessonsData';
import { getTranslatedEra, getTranslatedLesson } from '@/i18n/contentTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANDING_I18N } from '@/i18n/landingTranslations';
import { ERA_SLUGS } from '@/features/content/eraSlugs';
import { useEraBackdrop } from '@/components/shared/useEraBackdrop';

const ERA_ACCENT: Record<string, { text: string; ring: string; glow: string }> = {
  prehistoric:    { text: 'text-orange-400',  ring: 'border-orange-500/30',  glow: 'from-orange-900/40' },
  ancient:        { text: 'text-amber-400',   ring: 'border-amber-500/30',   glow: 'from-amber-900/40' },
  byzantine:      { text: 'text-violet-400',  ring: 'border-violet-500/30',  glow: 'from-violet-900/40' },
  'middle-ages':  { text: 'text-blue-400',    ring: 'border-blue-500/30',    glow: 'from-blue-900/40' },
  'early-modern': { text: 'text-emerald-400', ring: 'border-emerald-500/30', glow: 'from-emerald-900/40' },
  modern:         { text: 'text-rose-400',    ring: 'border-rose-500/30',    glow: 'from-rose-900/40' },
};

function eraIdFromSlug(slug: string | undefined): string | null {
  if (!slug) return null;
  const bySlug = Object.entries(ERA_SLUGS).find(([, s]) => s === slug);
  if (bySlug) return bySlug[0];
  // Accept the raw era id too, so an internal link never 404s.
  return ERAS.some(e => e.id === slug) ? slug : null;
}

export default function EraPreviewPage() {
  // Routes are declared as six explicit paths rather than one ":slug" pattern,
  // so a typo'd URL falls through to the app's own 404 instead of being
  // swallowed by a catch-all that renders an era page for everything.
  const slug = useLocation().pathname.replace(/^\/+|\/+$/g, '');
  const { language } = useLanguage();
  const L = LANDING_I18N[language] ?? LANDING_I18N.en;

  const eraId = eraIdFromSlug(slug);
  const era = ERAS.find(e => e.id === eraId);

  const lessons = useMemo(
    () => LESSONS.filter(l => l.eraId === eraId).sort((a, b) => a.order - b.order),
    [eraId],
  );

  const neighbours = useMemo(() => {
    const i = ERAS.findIndex(e => e.id === eraId);
    return { prev: i > 0 ? ERAS[i - 1] : null, next: i >= 0 && i < ERAS.length - 1 ? ERAS[i + 1] : null };
  }, [eraId]);

  // An unknown slug goes home rather than rendering an empty shell.
  if (!era) return <Navigate to="/" replace />;

  const accent = ERA_ACCENT[era.id] ?? ERA_ACCENT.ancient;
  const backdrop = useEraBackdrop(era.id);
  const tEra = getTranslatedEra(era, language);
  const totalMinutes = lessons.reduce((sum, l) => sum + (l.estimatedMinutes ?? 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className={`relative overflow-hidden border-b ${accent.ring}`}>
        {/* The era's own artwork, behind everything. Dim and desaturated: this
            is a page of text on top of it, and a legible heading matters more
            than a vivid GIF. The gradients below carry the accent colour and
            fade the image out at the bottom edge so it does not stop dead
            against the lesson list. */}
        {backdrop.src && (
          <img
            key={backdrop.src}
            src={backdrop.src}
            alt=""
            aria-hidden
            decoding="async"
            onError={backdrop.onError}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.45] saturate-[0.8]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className={`absolute inset-0 bg-gradient-to-b ${accent.glow} to-transparent opacity-45`} />
        <div className="relative max-w-5xl mx-auto px-4 py-14">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            {L.navHome}
          </Link>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className={`text-xs font-semibold tracking-[0.28em] uppercase ${accent.text} mb-3`}>
              {tEra.dateRange}
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">{tEra.name}</h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">{tEra.description}</p>

            <div className="flex flex-wrap items-center gap-5 mt-7 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <BookOpen className={`w-4 h-4 ${accent.text}`} />
                {lessons.length} {L.eraLessonsWord}
              </span>
              {totalMinutes > 0 && (
                <span className="inline-flex items-center gap-2">
                  <Clock3 className={`w-4 h-4 ${accent.text}`} />
                  ~{Math.round(totalMinutes / 60)}h
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <ol className="space-y-3">
          {lessons.map((lesson, i) => {
            const tl = getTranslatedLesson(lesson, language);
            return (
              <motion.li
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: Math.min(i, 12) * 0.02 }}
                className="flex gap-4 rounded-xl border border-border bg-card/40 p-4 hover:border-primary/30 transition-colors"
              >
                <div className={`shrink-0 w-9 h-9 rounded-lg border ${accent.ring} flex items-center justify-center font-heading text-sm font-bold ${accent.text}`}>
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading font-semibold text-[15px] leading-snug">{tl.title}</h2>
                  {tl.subtitle && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{tl.subtitle}</p>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ol>

        {/* The ask comes after the curriculum, not before it. */}
        <div className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <Sparkles className="w-6 h-6 text-primary mx-auto mb-3" />
          <h2 className="font-heading text-xl font-bold mb-2">{L.ctaTitle}</h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">{L.ctaSubtitle}</p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/register">{L.ctaStart}<ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="flex justify-between gap-4 mt-10">
          {neighbours.prev ? (
            <Button asChild variant="ghost" className="gap-2">
              <Link to={`/${ERA_SLUGS[neighbours.prev.id]}`}>
                <ArrowLeft className="w-4 h-4" />
                {getTranslatedEra(neighbours.prev, language).name}
              </Link>
            </Button>
          ) : <span />}
          {neighbours.next && (
            <Button asChild variant="ghost" className="gap-2">
              <Link to={`/${ERA_SLUGS[neighbours.next.id]}`}>
                {getTranslatedEra(neighbours.next, language).name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
