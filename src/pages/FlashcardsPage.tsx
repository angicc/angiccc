import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AppShell } from '@/components/layout/AppShell';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LESSONS } from '@/features/content/lessonsData';
import { ERAS } from '@/features/content/erasData';
import { getTranslatedEra, getTranslatedLesson } from '@/i18n/contentTranslations';
import type { EraId } from '@/types';
import type { Language } from '@/i18n/translations';
import { useLanguage } from '@/contexts/LanguageContext';

interface Flashcard {
  id: string;
  eraId: string;
  lessonTitle: string;
  back: string;
}

// Cards are derived from the *translated* lesson so that both the front
// (lesson title) and back (key fact) follow the selected language. When a
// lesson has no translation for the active language, getTranslatedLesson
// gracefully returns the English source — no mixed/blank state.
function buildFlashcards(language: Language): Flashcard[] {
  return LESSONS.flatMap(lesson => {
    const tl = getTranslatedLesson(lesson, language);
    return tl.keyFacts.map((fact, i) => ({
      id: `${lesson.id}-${i}`,
      eraId: lesson.eraId,
      lessonTitle: tl.title,
      back: fact,
    }));
  });
}

const shuffleDeck = (cards: Flashcard[]) => [...cards].sort(() => Math.random() - 0.5);

const ERA_COLOR: Record<string, string> = {
  ancient: 'text-amber-400 border-amber-400/40',
  'middle-ages': 'text-blue-400 border-blue-400/40',
  'early-modern': 'text-emerald-400 border-emerald-400/40',
  modern: 'text-rose-400 border-rose-400/40',
};

export default function FlashcardsPage() {
  const { t, language } = useLanguage();
  const allCards = useMemo(() => buildFlashcards(language), [language]);
  const [eraFilter, setEraFilter] = useState<EraId | 'all'>('all');
  const [deck, setDeck] = useState(() => shuffleDeck(allCards));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [review, setReview] = useState<Set<string>>(new Set());

  // Rebuild the deck whenever the language changes so card content re-localises.
  useEffect(() => {
    setDeck(shuffleDeck(allCards));
    setIdx(0); setFlipped(false); setKnown(new Set()); setReview(new Set());
  }, [allCards]);

  const filtered = eraFilter === 'all' ? deck : deck.filter(c => c.eraId === eraFilter);
  const card = filtered[idx];
  const pct = filtered.length > 0 ? Math.round(((known.size + review.size) / filtered.length) * 100) : 0;
  const remaining = filtered.length - known.size - review.size;

  function goNext() {
    setFlipped(false);
    setTimeout(() => setIdx(i => Math.min(i + 1, filtered.length - 1)), 150);
  }
  function goPrev() {
    setFlipped(false);
    setTimeout(() => setIdx(i => Math.max(i - 1, 0)), 150);
  }
  function shuffle() {
    setDeck(shuffleDeck(allCards));
    setIdx(0); setFlipped(false); setKnown(new Set()); setReview(new Set());
  }
  function markKnown() { setKnown(p => new Set([...p, card.id])); goNext(); }
  function markReview() { setReview(p => new Set([...p, card.id])); goNext(); }

  const eraRaw = ERAS.find(e => e.id === card?.eraId);
  const eraLabel = eraRaw ? getTranslatedEra(eraRaw, language).shortName : '';
  const colorClass = ERA_COLOR[card?.eraId ?? ''] ?? 'text-muted-foreground border-border';

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-400/10">
              <Layers className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">{t.flash_title}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{t.flash_subtitle}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={shuffle} className="gap-2">
            <RotateCcw className="w-4 h-4" />{t.flash_shuffle}
          </Button>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Select value={eraFilter} onValueChange={v => { setEraFilter(v as EraId | 'all'); setIdx(0); setFlipped(false); }}>
            <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder={t.flash_all_eras} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.flash_all_eras}</SelectItem>
              {ERAS.map(e => <SelectItem key={e.id} value={e.id}>{getTranslatedEra(e, language).shortName}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex-1">
            <Progress value={pct} className="h-2" />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
            {Math.min(idx + 1, filtered.length)} / {filtered.length}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />{known.size} {t.flash_known_label}
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <XCircle className="w-3.5 h-3.5" />{review.size} {t.flash_review_label}
          </span>
          <span className="text-muted-foreground">{remaining} {t.flash_remaining}</span>
        </div>

        {/* Card */}
        {card ? (
          <>
            <div
              className="cursor-pointer select-none"
              style={{ perspective: '1200px' }}
              onClick={() => setFlipped(f => !f)}
            >
              <motion.div
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="relative"
              >
                {/* Front */}
                <div
                  className="min-h-72 rounded-2xl border border-border bg-card p-8 flex flex-col items-center justify-center text-center gap-5 shadow-lg"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Badge variant="outline" className={`text-xs ${colorClass}`}>
                    {eraLabel}
                  </Badge>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">{card.lessonTitle}</p>
                    <p className="font-heading text-2xl font-semibold leading-snug">{t.flash_key_fact}</p>
                  </div>
                  <p className="text-xs text-muted-foreground border border-border/50 rounded-full px-4 py-1.5">
                    {t.flash_tap_flip}
                  </p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 min-h-72 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/8 to-primary/3 p-8 flex flex-col items-center justify-center text-center gap-5 shadow-lg"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <Badge variant="outline" className="text-xs text-primary border-primary/40">{t.flash_answer}</Badge>
                  <p className="text-base leading-relaxed font-medium max-w-sm">{card.back}</p>
                </div>
              </motion.div>
            </div>

            {/* Action buttons — appear after flip */}
            <AnimatePresence>
              {flipped && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/60"
                    onClick={e => { e.stopPropagation(); markReview(); }}
                  >
                    <XCircle className="w-4 h-4" />{t.flash_review_again}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60"
                    onClick={e => { e.stopPropagation(); markKnown(); }}
                  >
                    <CheckCircle className="w-4 h-4" />{t.flash_knew}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="min-h-72 rounded-2xl border border-border bg-card flex items-center justify-center text-muted-foreground">
            {t.flash_no_cards}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={goPrev} disabled={idx === 0} className="gap-2">
            <ChevronLeft className="w-4 h-4" />{t.flash_prev}
          </Button>
          {/* Dot navigation */}
          <div className="flex gap-1 overflow-hidden max-w-32">
            {filtered.slice(Math.max(0, idx - 3), idx + 4).map((c, i) => {
              const realIdx = Math.max(0, idx - 3) + i;
              return (
                <button
                  key={c.id}
                  onClick={() => { setFlipped(false); setIdx(realIdx); }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    realIdx === idx ? 'bg-primary scale-125' : known.has(c.id) ? 'bg-emerald-500/60' : review.has(c.id) ? 'bg-rose-500/60' : 'bg-border'
                  }`}
                />
              );
            })}
          </div>
          <Button variant="outline" size="sm" onClick={goNext} disabled={idx >= filtered.length - 1} className="gap-2">
            {t.flash_next}<ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Completion state */}
        {filtered.length > 0 && known.size + review.size === filtered.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl border border-primary/40 bg-primary/5 text-center space-y-3"
          >
            <div className="text-2xl">🎉</div>
            <p className="font-heading font-semibold">{t.flash_done}</p>
            <p className="text-sm text-muted-foreground">
              {known.size} {t.flash_known_label} · {review.size} {t.flash_review_label}
            </p>
            <Button size="sm" onClick={shuffle} className="gap-2">
              <RotateCcw className="w-4 h-4" />{t.flash_restart}
            </Button>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
