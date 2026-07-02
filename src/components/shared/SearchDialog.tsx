import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Clock } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LESSONS } from '@/features/content/lessonsData';
import { getSortedTimeline } from '@/features/content/timelineData';
import { ERAS } from '@/features/content/erasData';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslatedLesson, getTranslatedEra } from '@/i18n/contentTranslations';
import { getTranslatedTimelineEvent } from '@/i18n/timelineTranslations';

interface Props { open: boolean; onClose: () => void; }

const TIMELINE = getSortedTimeline();

export function SearchDialog({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');

  useEffect(() => { if (!open) setQuery(''); }, [open]);

  const q = query.toLowerCase().trim();

  // Search against the *localized* content so users can type in their own
  // language — and results never show English titles inside a translated UI.
  const localizedLessons = useMemo(() => LESSONS.map(l => getTranslatedLesson(l, language)), [language]);
  const localizedEvents  = useMemo(() => TIMELINE.map(e => getTranslatedTimelineEvent(e, language)), [language]);

  const lessons = q.length < 2 ? [] : localizedLessons.filter(l =>
    l.title.toLowerCase().includes(q) || l.subtitle.toLowerCase().includes(q)
  ).slice(0, 5);

  const events = q.length < 2 ? [] : localizedEvents.filter(e =>
    e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
  ).slice(0, 5);

  const go = useCallback((path: string) => { navigate(path); onClose(); }, [navigate, onClose]);

  const eraColor: Record<string, string> = {
    ancient: 'text-amber-400', 'middle-ages': 'text-blue-400',
    'early-modern': 'text-emerald-400', modern: 'text-rose-400',
  };

  const categoryLabel = (cat: string): string =>
    (t as Record<string, string>)[`cat_${cat}`] ?? cat;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.search_placeholder}
            className="border-0 shadow-none focus-visible:ring-0 px-0 text-base"
          />
          <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">ESC</kbd>
        </div>

        {(lessons.length > 0 || events.length > 0) && (
          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {lessons.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-muted-foreground px-2 py-1 font-medium uppercase tracking-wide">{t.eras_lessons_label}</p>
                {lessons.map(l => {
                  const eraRaw = ERAS.find(e => e.id === l.eraId);
                  const era = eraRaw ? getTranslatedEra(eraRaw, language) : undefined;
                  return (
                    <button key={l.id} onClick={() => go(`/eras/${l.eraId}/lessons/${l.id}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left">
                      <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{l.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{l.subtitle}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs shrink-0 ${eraColor[l.eraId]}`}>{era?.shortName}</Badge>
                    </button>
                  );
                })}
              </div>
            )}
            {events.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-muted-foreground px-2 py-1 font-medium uppercase tracking-wide">{t.tl_events}</p>
                {events.map(e => (
                  <button key={e.id} onClick={() => go('/timeline')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.displayYear}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs shrink-0 ${eraColor[e.eraId]}`}>{categoryLabel(e.category)}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {q.length >= 2 && lessons.length === 0 && events.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">{t.search_no_results} "{query}"</div>
        )}

        {q.length < 2 && (
          <div className="py-10 text-center text-muted-foreground text-sm">
            {t.search_min_chars}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
