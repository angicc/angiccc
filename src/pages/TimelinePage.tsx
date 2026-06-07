import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';
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

interface LockedModal {
  eraName: string;
  lastPath: string | null;
}

const ERA_COLORS: Record<EraId, string> = {
  ancient: 'bg-amber-400',
  'middle-ages': 'bg-blue-400',
  'early-modern': 'bg-emerald-400',
  modern: 'bg-rose-400',
};
const ERA_TEXT: Record<EraId, string> = {
  ancient: 'text-amber-400',
  'middle-ages': 'text-blue-400',
  'early-modern': 'text-emerald-400',
  modern: 'text-rose-400',
};
const ERA_GLOW: Record<EraId, string> = {
  ancient: 'shadow-amber-400/40',
  'middle-ages': 'shadow-blue-400/40',
  'early-modern': 'shadow-emerald-400/40',
  modern: 'shadow-rose-400/40',
};
const CATEGORIES: TimelineCategory[] = ['war','politics','science','culture','religion','exploration'];
const CAT_ICON: Record<TimelineCategory, string> = {
  war: '⚔️', politics: '🏛️', science: '🔭', culture: '🎭', religion: '✝️', exploration: '🗺️',
};

export default function TimelinePage() {
  const { canTimeline } = useSubscription();
  const { progress } = useAuth();
  const navigate = useNavigate();
  const [eraFilter, setEraFilter] = useState<EraId | 'all'>('all');
  const [catFilter, setCatFilter] = useState<TimelineCategory | 'all'>('all');
  const [locked, setLocked] = useState<LockedModal | null>(null);

  const all = getSortedTimeline().filter(e => e.significance === 'major' || canTimeline());
  const events = all.filter(e =>
    (eraFilter === 'all' || e.eraId === eraFilter) &&
    (catFilter === 'all' || e.category === catFilter)
  );

  function handleExploreEra(eraId: string) {
    const eraLessons = LESSONS.filter(l => l.eraId === eraId).sort((a, b) => a.order - b.order);
    const eraName = ERAS.find(e => e.id === eraId)?.shortName ?? eraId;

    const completedInEra = eraLessons.filter(l => progress?.completedLessons.includes(l.id));

    if (completedInEra.length > 0) {
      const lastCompleted = completedInEra[completedInEra.length - 1];
      const nextIdx = eraLessons.findIndex(l => l.id === lastCompleted.id) + 1;
      const target = nextIdx < eraLessons.length ? eraLessons[nextIdx] : lastCompleted;
      navigate(`/eras/${eraId}/lessons/${target.id}`);
      return;
    }

    // No completed lessons in this era — find last globally completed lesson
    const allCompleted = progress?.completedLessons ?? [];
    let lastGlobalPath: string | null = null;
    if (allCompleted.length > 0) {
      const lastId = allCompleted[allCompleted.length - 1];
      const lastLesson = LESSONS.find(l => l.id === lastId);
      if (lastLesson) lastGlobalPath = `/eras/${lastLesson.eraId}/lessons/${lastLesson.id}`;
    }

    setLocked({ eraName, lastPath: lastGlobalPath });
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
              <>
                <Select value={eraFilter} onValueChange={v => setEraFilter(v as EraId | 'all')}>
                  <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="All Eras" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Eras</SelectItem>
                    {ERAS.map(e => <SelectItem key={e.id} value={e.id}>{e.shortName}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={catFilter} onValueChange={v => setCatFilter(v as TimelineCategory | 'all')}>
                  <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{CAT_ICON[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </>
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
              return (
                <Popover key={event.id}>
                  <PopoverTrigger asChild>
                    <div className={`relative flex items-start gap-4 cursor-pointer group py-3.5 hover:bg-accent/30 rounded-lg px-2 -mx-2 transition-colors`}>
                      <div className={`absolute left-[-1.65rem] mt-1.5 flex items-center justify-center transition-transform group-hover:scale-125 ${
                        isMajor
                          ? `w-5 h-5 -left-[1.85rem] rounded-full border-2 border-background ${ERA_COLORS[event.eraId]} shadow-md ${ERA_GLOW[event.eraId]}`
                          : `w-3 h-3 rounded-full border-2 border-background ${ERA_COLORS[event.eraId]}`
                      }`} />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-muted-foreground tabular-nums">{event.displayYear}</span>
                          <Badge variant="outline" className={`text-xs px-1.5 py-0 border-current font-normal ${ERA_TEXT[event.eraId]}`}>
                            {ERAS.find(e => e.id === event.eraId)?.shortName}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{CAT_ICON[event.category]} {event.category}</span>
                          {isMajor && <Badge variant="secondary" className="text-xs px-1.5 py-0">Major</Badge>}
                        </div>
                        <p className={`mt-0.5 group-hover:text-primary transition-colors ${isMajor ? 'font-semibold text-sm' : 'text-sm text-muted-foreground'}`}>
                          {event.title}
                        </p>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" side="right">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{event.displayYear}</span>
                        <Badge variant="outline" className={`text-xs ${ERA_TEXT[event.eraId]}`}>
                          {ERAS.find(e => e.id === event.eraId)?.shortName}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          {CAT_ICON[event.category]} {event.category}
                        </Badge>
                      </div>
                      <h3 className="font-heading font-semibold leading-snug">{event.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleExploreEra(event.eraId)}
                      >
                        Explore {ERAS.find(e => e.id === event.eraId)?.shortName} Era →
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Locked Era Modal */}
      <AnimatePresence>
        {locked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setLocked(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="relative bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setLocked(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <motion.div
                animate={{ rotate: [0, -8, 8, -5, 5, 0], scale: [1, 1.1, 1.1, 1.05, 1] }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-400/10 border border-amber-400/30"
              >
                <Lock className="w-8 h-8 text-amber-400" />
              </motion.div>

              <h2 className="font-heading text-xl font-bold mb-2">Era Locked</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Sorry, but you haven't unlocked the{' '}
                <span className="text-foreground font-semibold">{locked.eraName}</span>{' '}
                era yet. Complete earlier lessons to unlock it.
              </p>

              <div className="flex flex-col gap-2">
                {locked.lastPath ? (
                  <Button
                    className="w-full"
                    onClick={() => { setLocked(null); navigate(locked.lastPath!); }}
                  >
                    Continue Where You Left Off
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => { setLocked(null); navigate('/eras'); }}
                  >
                    Go to Eras & Lessons
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setLocked(null)}>
                  Dismiss
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
