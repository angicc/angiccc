import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { getSortedTimeline } from '@/features/content/timelineData';
import { ERAS } from '@/features/content/erasData';
import { getTranslatedEra, getTranslatedLesson } from '@/i18n/contentTranslations';
import { getTranslatedTimelineEvent } from '@/i18n/timelineTranslations';
import { LESSONS } from '@/features/content/lessonsData';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { EraId, TimelineCategory, Lesson } from '@/types';
import { UNLOCK_ALL_LESSONS } from '@/features/progress/analysisGate';

// Explicit deep-link overrides for timeline events that no lesson lists in its
// own `relatedTimeline` (or where a more specific lesson is a better landing
// spot than the first that happens to reference the event). Combined with the
// auto-built map below, every one of the 160 events resolves to a real lesson.
const EVENT_LESSON_OVERRIDES: Record<string, string> = {
  // Prehistoric
  't-earth-formed': 'prehistoric-21', 't-dino-age': 'prehistoric-21', 't-dino-end': 'prehistoric-21',
  't-first-australians': 'prehistoric-11', 't-green-sahara': 'prehistoric-15',
  // Ancient
  't-troy': 'ancient-13', 't-parthenon': 'ancient-02',
  't-phoenician-alphabet': 'ancient-06', 't-carthage-founded': 'ancient-06', 't-carthage': 'ancient-06',
  't-chaeronea': 'ancient-07', 't-gaugamela': 'ancient-07',
  't-indus': 'ancient-10', 't-caral': 'ancient-16', 't-olmec': 'ancient-22', 't-nok': 'ancient-21',
  't-kush-meroe': 'ancient-14', 't-aksum': 'ancient-14', 't-eratosthenes': 'ancient-19', 't-qin-unify': 'ancient-11',
  // Middle Ages
  't-magna-carta': 'medieval-04', 't-hanseatic': 'medieval-04',
  't-mongols': 'medieval-05', 't-marco-polo': 'medieval-05',
  't-kamakura': 'medieval-06', 't-kamikaze': 'medieval-06',
  't-lindisfarne': 'medieval-07', 't-vinland': 'medieval-07',
  't-tang': 'medieval-19', 't-angkor': 'medieval-22', 't-great-zimbabwe': 'medieval-21',
  't-mansa-musa': 'medieval-15', 't-timbuktu': 'medieval-15',
  // Early Modern
  't-armada': 'earlymod-01', 't-columbian-exchange': 'earlymod-10',
  't-first-slave-voyage': 'earlymod-05', 't-asiento': 'earlymod-05',
  't-suleiman': 'earlymod-06', 't-vienna-siege': 'earlymod-06', 't-versailles-court': 'earlymod-04',
  't-glorious-revolution': 'earlymod-07', 't-napoleon': 'earlymod-07',
  't-songhai': 'earlymod-21', 't-tondibi': 'earlymod-21', 't-polynesia-nz': 'earlymod-22',
  // Modern
  't-american-civil-war': 'modern-05', 't-berlin-conference': 'modern-05', 't-adwa': 'modern-05',
  't-darwin': 'modern-01', 't-russian-revolution': 'modern-08', 't-great-depression': 'modern-02',
  't-vaccination': 'modern-22', 't-germ-theory': 'modern-22', 't-smallpox-eradicated': 'modern-22',
  't-sputnik': 'modern-21', 't-gagarin': 'modern-21', 't-moon-landing': 'modern-21', 't-www': 'modern-20',
};

// The first (lowest-order) lesson in each era — the guaranteed fallback target
// so a directory entry always opens a lesson rather than a generic era page.
const FIRST_LESSON_BY_ERA: Record<string, string> = (() => {
  const first: Record<string, string> = {};
  for (const l of [...LESSONS].sort((a, b) => a.order - b.order)) {
    if (!(l.eraId in first)) first[l.eraId] = l.id;
  }
  return first;
})();

// Event → lesson map, built from every lesson's own `relatedTimeline` (kept in
// sync automatically as lessons change), then topped with the explicit
// overrides above, which win.
const EVENT_TO_LESSON: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const l of LESSONS) {
    for (const evId of (l.relatedTimeline ?? [])) {
      if (!map[evId]) map[evId] = l.id; // first lesson that references it wins
    }
  }
  return { ...map, ...EVENT_LESSON_OVERRIDES };
})();

// Resolve the lesson for an event, always returning a target: explicit/derived
// map → the era's first lesson. The returned Lesson carries the correct eraId
// for the route, so the deep link resolves even when the event's era label and
// the lesson's era differ (e.g. a Tang-China event landing in a China lesson).
function lessonForEvent(event: { id: string; eraId: string }): Lesson | null {
  const id = EVENT_TO_LESSON[event.id] ?? FIRST_LESSON_BY_ERA[event.eraId];
  return id ? (LESSONS.find(l => l.id === id) ?? null) : null;
}

const ERA_COLORS: Record<EraId, string> = {
  prehistoric: 'bg-orange-400', ancient: 'bg-amber-400', byzantine: 'bg-violet-400', 'middle-ages': 'bg-blue-400', 'early-modern': 'bg-emerald-400', modern: 'bg-rose-400',
};
const ERA_TEXT: Record<EraId, string> = {
  prehistoric: 'text-orange-400', ancient: 'text-amber-400', byzantine: 'text-violet-400', 'middle-ages': 'text-blue-400', 'early-modern': 'text-emerald-400', modern: 'text-rose-400',
};
const ERA_GLOW: Record<EraId, string> = {
  prehistoric: 'shadow-orange-400/40', ancient: 'shadow-amber-400/40', byzantine: 'shadow-violet-400/40', 'middle-ages': 'shadow-blue-400/40', 'early-modern': 'shadow-emerald-400/40', modern: 'shadow-rose-400/40',
};
const CATEGORIES: TimelineCategory[] = ['war','politics','science','culture','religion','exploration'];
const CAT_ICON: Record<TimelineCategory, string> = {
  war: '⚔️', politics: '🏛️', science: '🔭', culture: '🎭', religion: '✝️', exploration: '🗺️',
};
const CAT_LABEL: Record<TimelineCategory, 'cat_war' | 'cat_politics' | 'cat_science' | 'cat_culture' | 'cat_religion' | 'cat_exploration'> = {
  war: 'cat_war', politics: 'cat_politics', science: 'cat_science',
  culture: 'cat_culture', religion: 'cat_religion', exploration: 'cat_exploration',
};

export default function TimelinePage() {
  const { canTimeline, canLesson } = useSubscription();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [eraFilter, setEraFilter] = useState<EraId | 'all'>('all');
  const [catFilter, setCatFilter] = useState<TimelineCategory | 'all'>('all');

  const all = getSortedTimeline().filter(e => e.significance === 'major' || canTimeline());
  const events = all.filter(e =>
    (eraFilter === 'all' || e.eraId === eraFilter) &&
    (catFilter === 'all' || e.category === catFilter)
  );

  function handleExplore(event: { id: string; eraId: string }) {
    const lesson = lessonForEvent(event);
    if (lesson) navigate(`/eras/${lesson.eraId}/lessons/${lesson.id}`);
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">{t.tl_title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t.tl_subtitle} · {events.length} {t.tl_events}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {canTimeline() ? (
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <Select value={eraFilter} onValueChange={v => setEraFilter(v as EraId | 'all')}>
                  <SelectTrigger className="w-32 sm:w-36 h-8 text-xs"><SelectValue placeholder={t.tl_all_eras} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.tl_all_eras}</SelectItem>
                    {ERAS.map(e => <SelectItem key={e.id} value={e.id}>{getTranslatedEra(e, language).shortName}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={catFilter} onValueChange={v => setCatFilter(v as TimelineCategory | 'all')}>
                  <SelectTrigger className="w-32 sm:w-36 h-8 text-xs"><SelectValue placeholder={t.tl_all_categories} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.tl_all_categories}</SelectItem>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{CAT_ICON[c]} {t[CAT_LABEL[c]]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">{t.tl_free_only}</div>
            )}
          </div>
        </div>

        {!canTimeline() && (
          <UpgradePrompt compact title={t.tl_filter_title} description={t.tl_filter_desc} />
        )}

        {/* Era legend */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          {ERAS.map(e => {
            const tEra = getTranslatedEra(e, language);
            return (
              <button
                key={e.id}
                onClick={() => setEraFilter(canTimeline() ? (eraFilter === e.id ? 'all' : e.id as EraId) : eraFilter)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${eraFilter === e.id ? 'border-current bg-current/10' : 'border-border hover:border-current/50'} ${ERA_TEXT[e.id as EraId]}`}
              >
                <span className={`w-2 h-2 rounded-full ${ERA_COLORS[e.id as EraId]}`} />
                {tEra.shortName}
                <span className="text-muted-foreground">· {tEra.dateRange}</span>
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <ScrollArea className="h-[calc(100vh-260px)]">
          <div className="relative pl-10 pr-4 space-y-0">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            {events.map((event) => {
              const tEvent = getTranslatedTimelineEvent(event, language);
              const isMajor = event.significance === 'major';
              const lessonRaw = lessonForEvent(event);
              const lesson = lessonRaw ? getTranslatedLesson(lessonRaw, language) : null;
              const locked = !UNLOCK_ALL_LESSONS && !!lessonRaw && !canLesson(lessonRaw.order);
              const eraRaw = ERAS.find(e => e.id === event.eraId);
              const eraName = eraRaw ? getTranslatedEra(eraRaw, language).shortName : '';

              return (
                <Popover key={event.id}>
                  <PopoverTrigger asChild>
                    <div className="relative flex items-start gap-4 cursor-pointer group py-3.5 hover:bg-accent/30 rounded-lg px-2 -mx-2 transition-colors">
                      <div className={`absolute left-[-1.65rem] mt-1.5 flex items-center justify-center transition-transform group-hover:scale-125 ${
                        isMajor
                          ? `w-5 h-5 -left-[1.85rem] rounded-full border-2 border-background ${ERA_COLORS[event.eraId]} shadow-md ${ERA_GLOW[event.eraId]}`
                          : `w-3 h-3 rounded-full border-2 border-background ${ERA_COLORS[event.eraId]}`
                      }`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-muted-foreground tabular-nums">{event.displayYear}</span>
                          <Badge variant="outline" className={`text-xs px-1.5 py-0 border-current font-normal ${ERA_TEXT[event.eraId]}`}>
                            {eraName}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{CAT_ICON[event.category]} {t[CAT_LABEL[event.category]]}</span>
                          {isMajor && <Badge variant="secondary" className="text-xs px-1.5 py-0">{t.tl_major}</Badge>}
                          {locked && <Lock className="w-3 h-3 text-muted-foreground/60" />}
                        </div>
                        <p className={`mt-0.5 group-hover:text-primary transition-colors ${isMajor ? 'font-semibold text-sm' : 'text-sm text-muted-foreground'}`}>
                          {tEvent.title}
                        </p>
                      </div>
                    </div>
                  </PopoverTrigger>

                  <PopoverContent className="w-[min(320px,calc(100vw-2rem))]" side="left" sideOffset={8} align="start">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{event.displayYear}</span>
                        <Badge variant="outline" className={`text-xs ${ERA_TEXT[event.eraId]}`}>{eraName}</Badge>
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          {CAT_ICON[event.category]} {t[CAT_LABEL[event.category]]}
                        </Badge>
                      </div>
                      <h3 className="font-heading font-semibold leading-snug">{tEvent.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tEvent.description}</p>

                      {locked ? (
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/60 border border-border">
                          <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-foreground">{t.tl_lesson_locked}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{t.tl_lesson_locked_pro} <span className="text-foreground font-medium">{lesson?.title}</span>.</p>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleExplore(event)}
                        >
                          {lesson ? `${t.tl_go_to} ${lesson.title.length > 28 ? lesson.title.slice(0, 28) + '…' : lesson.title} →` : `${t.tl_explore_era}: ${eraName} →`}
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </AppShell>
  );
}
