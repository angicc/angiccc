import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { useAuth } from '@/features/auth/AuthContext';
import { getSortedTimeline } from '@/features/content/timelineData';
import { ERAS } from '@/features/content/erasData';
import { LESSONS } from '@/features/content/lessonsData';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { EraId, TimelineCategory } from '@/types';

// Maps each timeline event to the lesson that covers it
const EVENT_TO_LESSON: Record<string, string> = {
  // Ancient
  't-cuneiform':     'ancient-01', 't-hammurabi':   'ancient-01', 't-troy':      'ancient-02',
  't-pyramid':       'ancient-05', 't-egypt-afterlife': 'ancient-05', 't-ramesses': 'ancient-05',
  't-cyrus-great':   'ancient-04', 't-ashoka':     'ancient-04', 't-han-dynasty': 'ancient-04',
  't-democracy':     'ancient-02', 't-persian-wars':'ancient-02', 't-parthenon': 'ancient-02', 't-alexander': 'ancient-02',
  't-roman-republic':'ancient-03', 't-caesar':      'ancient-03', 't-pax-romana':'ancient-03', 't-rome-fall': 'ancient-03',
  't-silk-road':     'ancient-04',
  // Middle Ages
  't-charlemagne':   'medieval-01', 't-hastings':   'medieval-01',
  't-islam':         'medieval-02', 't-golden-age': 'medieval-02', 't-crusades':  'medieval-02',
  't-black-death':   'medieval-03',
  't-mongols':       'medieval-04', 't-magna-carta':'medieval-04',
  // Early Modern
  't-printing-press':'earlymod-01', 't-columbus':   'earlymod-01', 't-vasco':     'earlymod-01', 't-armada': 'earlymod-01',
  't-luther':        'earlymod-02',
  't-copernicus':    'earlymod-03', 't-galileo':    'earlymod-03', 't-newton':    'earlymod-03', 't-steam-engine': 'earlymod-03',
  't-thirty-years-war':'earlymod-04', 't-westphalia':'earlymod-04', 't-glorious-revolution':'earlymod-04',
  't-american-revolution':'earlymod-04', 't-french-revolution':'earlymod-04',
  // Modern
  't-napoleon':      'modern-05', 't-american-civil-war':'modern-05',
  't-railways':      'modern-01', 't-communist-manifesto':'modern-01', 't-darwin': 'modern-01',
  't-wwi':           'modern-02', 't-russian-revolution':'modern-02', 't-versailles':'modern-02',
  't-great-depression':'modern-02', 't-wwii': 'modern-02', 't-holocaust':'modern-02', 't-hiroshima':'modern-02',
  't-cold-war':      'modern-03', 't-decolonization':'modern-03', 't-moon':'modern-03', 't-berlin-wall':'modern-03',
  't-internet':      'modern-04', 't-9-11': 'modern-04',
};

const ERA_COLORS: Record<EraId, string> = {
  ancient: 'bg-amber-400', 'middle-ages': 'bg-blue-400', 'early-modern': 'bg-emerald-400', modern: 'bg-rose-400',
};
const ERA_TEXT: Record<EraId, string> = {
  ancient: 'text-amber-400', 'middle-ages': 'text-blue-400', 'early-modern': 'text-emerald-400', modern: 'text-rose-400',
};
const ERA_GLOW: Record<EraId, string> = {
  ancient: 'shadow-amber-400/40', 'middle-ages': 'shadow-blue-400/40', 'early-modern': 'shadow-emerald-400/40', modern: 'shadow-rose-400/40',
};
const CATEGORIES: TimelineCategory[] = ['war','politics','science','culture','religion','exploration'];
const CAT_ICON: Record<TimelineCategory, string> = {
  war: '⚔️', politics: '🏛️', science: '🔭', culture: '🎭', religion: '✝️', exploration: '🗺️',
};

export default function TimelinePage() {
  const { canTimeline, canLesson } = useSubscription();
  const { progress } = useAuth();
  const navigate = useNavigate();
  const [eraFilter, setEraFilter] = useState<EraId | 'all'>('all');
  const [catFilter, setCatFilter] = useState<TimelineCategory | 'all'>('all');

  const all = getSortedTimeline().filter(e => e.significance === 'major' || canTimeline());
  const events = all.filter(e =>
    (eraFilter === 'all' || e.eraId === eraFilter) &&
    (catFilter === 'all' || e.category === catFilter)
  );

  function handleExplore(eraId: string, eventId: string) {
    const specificLessonId = EVENT_TO_LESSON[eventId];
    if (specificLessonId) {
      navigate(`/eras/${eraId}/lessons/${specificLessonId}`);
      return;
    }
    // fallback: navigate to next uncompleted or first lesson in era
    const eraLessons = LESSONS.filter(l => l.eraId === eraId).sort((a, b) => a.order - b.order);
    if (eraLessons.length === 0) return;
    const completed = eraLessons.filter(l => progress?.completedLessons.includes(l.id));
    if (completed.length > 0) {
      const lastIdx = eraLessons.findIndex(l => l.id === completed[completed.length - 1].id);
      const next = lastIdx + 1 < eraLessons.length ? eraLessons[lastIdx + 1] : eraLessons[lastIdx];
      navigate(`/eras/${eraId}/lessons/${next.id}`);
    } else {
      navigate(`/eras/${eraId}/lessons/${eraLessons[0].id}`);
    }
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Historical Timeline</h1>
            <p className="text-muted-foreground text-sm mt-1">From 3100 BCE to the present day · {events.length} events</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {canTimeline() ? (
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <Select value={eraFilter} onValueChange={v => setEraFilter(v as EraId | 'all')}>
                  <SelectTrigger className="w-32 sm:w-36 h-8 text-xs"><SelectValue placeholder="All Eras" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Eras</SelectItem>
                    {ERAS.map(e => <SelectItem key={e.id} value={e.id}>{e.shortName}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={catFilter} onValueChange={v => setCatFilter(v as TimelineCategory | 'all')}>
                  <SelectTrigger className="w-32 sm:w-36 h-8 text-xs"><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{CAT_ICON[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">Free: major events only</div>
            )}
          </div>
        </div>

        {!canTimeline() && (
          <UpgradePrompt compact title="Timeline Filters" description="Upgrade to Pro to filter by era and category, and see all timeline events." />
        )}

        {/* Era legend */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          {ERAS.map(e => (
            <button
              key={e.id}
              onClick={() => setEraFilter(canTimeline() ? (eraFilter === e.id ? 'all' : e.id as EraId) : eraFilter)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${eraFilter === e.id ? 'border-current bg-current/10' : 'border-border hover:border-current/50'} ${ERA_TEXT[e.id as EraId]}`}
            >
              <span className={`w-2 h-2 rounded-full ${ERA_COLORS[e.id as EraId]}`} />
              {e.shortName}
              <span className="text-muted-foreground">· {e.dateRange}</span>
            </button>
          ))}
        </div>

        {/* Timeline */}
        <ScrollArea className="h-[calc(100vh-260px)]">
          <div className="relative pl-10 pr-4 space-y-0">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            {events.map((event) => {
              const isMajor = event.significance === 'major';
              const lessonId = EVENT_TO_LESSON[event.id];
              const lesson = lessonId ? LESSONS.find(l => l.id === lessonId) : null;
              const locked = lesson ? !canLesson(lesson.order) : false;
              const eraName = ERAS.find(e => e.id === event.eraId)?.shortName ?? '';

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
                          <span className="text-xs text-muted-foreground">{CAT_ICON[event.category]} {event.category}</span>
                          {isMajor && <Badge variant="secondary" className="text-xs px-1.5 py-0">Major</Badge>}
                          {locked && <Lock className="w-3 h-3 text-muted-foreground/60" />}
                        </div>
                        <p className={`mt-0.5 group-hover:text-primary transition-colors ${isMajor ? 'font-semibold text-sm' : 'text-sm text-muted-foreground'}`}>
                          {event.title}
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
                          {CAT_ICON[event.category]} {event.category}
                        </Badge>
                      </div>
                      <h3 className="font-heading font-semibold leading-snug">{event.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>

                      {locked ? (
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/60 border border-border">
                          <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-foreground">Lesson Locked</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Upgrade to Pro to access <span className="text-foreground font-medium">{lesson?.title}</span>.</p>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleExplore(event.eraId, event.id)}
                        >
                          {lesson ? `Go to: ${lesson.title.length > 28 ? lesson.title.slice(0, 28) + '…' : lesson.title} →` : `Explore ${eraName} Era →`}
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
