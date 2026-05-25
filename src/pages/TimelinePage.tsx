import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { getSortedTimeline } from '@/features/content/timelineData';
import { ERAS } from '@/features/content/erasData';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { EraId, TimelineCategory } from '@/types';

const ERA_COLORS: Record<EraId, string> = { ancient:'bg-amber-400', 'middle-ages':'bg-blue-400', 'early-modern':'bg-emerald-400', modern:'bg-rose-400' };
const ERA_TEXT: Record<EraId, string> = { ancient:'text-amber-400', 'middle-ages':'text-blue-400', 'early-modern':'text-emerald-400', modern:'text-rose-400' };
const CATEGORIES: TimelineCategory[] = ['war','politics','science','culture','religion','exploration'];

export default function TimelinePage() {
  const { canTimeline } = useSubscription();
  const [eraFilter, setEraFilter] = useState<EraId | 'all'>('all');
  const [catFilter, setCatFilter] = useState<TimelineCategory | 'all'>('all');

  const all = getSortedTimeline().filter(e => e.significance === 'major' || canTimeline());
  const events = all.filter(e => (eraFilter === 'all' || e.eraId === eraFilter) && (catFilter === 'all' || e.category === catFilter));

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="font-heading text-3xl font-bold">Historical Timeline</h1><p className="text-muted-foreground text-sm mt-1">From 3100 BCE to the present day</p></div>
          <div className="flex items-center gap-2 flex-wrap">
            {canTimeline() ? (
              <>
                <Select value={eraFilter} onValueChange={v => setEraFilter(v as EraId | 'all')}>
                  <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="All Eras" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Eras</SelectItem>{ERAS.map(e => <SelectItem key={e.id} value={e.id}>{e.shortName}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={catFilter} onValueChange={v => setCatFilter(v as TimelineCategory | 'all')}>
                  <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Categories</SelectItem>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
              </>
            ) : (
              <div className="text-xs text-muted-foreground">Free plan: major events only. <button className="text-primary hover:underline" onClick={() => {}}>Upgrade for filters</button></div>
            )}
          </div>
        </div>

        {!canTimeline() && <UpgradePrompt compact title="Timeline Filters" description="Upgrade to Pro to filter by era and category, and see all timeline events." />}

        {/* Vertical timeline */}
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="relative pl-8 pr-4 space-y-0">
            <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-border" />
            {events.map((event, i) => (
              <Popover key={event.id}>
                <PopoverTrigger asChild>
                  <div className={`relative flex items-start gap-4 cursor-pointer group py-3 ${i < events.length - 1 ? '' : ''}`}>
                    <div className={`absolute -left-5 w-3 h-3 rounded-full border-2 border-background shrink-0 mt-1.5 transition-transform group-hover:scale-125 ${ERA_COLORS[event.eraId]} ${event.significance === 'major' ? 'w-4 h-4 -left-5.5' : ''}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">{event.displayYear}</span>
                        <Badge variant="outline" className={`text-xs px-1.5 py-0 border-current ${ERA_TEXT[event.eraId]}`}>{ERAS.find(e => e.id === event.eraId)?.shortName}</Badge>
                        <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">{event.category}</Badge>
                      </div>
                      <p className="font-semibold text-sm mt-0.5 group-hover:text-primary transition-colors">{event.title}</p>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{event.displayYear}</span>
                      <Badge variant="outline" className={`text-xs ${ERA_TEXT[event.eraId]}`}>{ERAS.find(e => e.id === event.eraId)?.shortName}</Badge>
                    </div>
                    <h3 className="font-heading font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                    <Button size="sm" variant="outline" className="w-full" asChild><a href={`/eras/${event.eraId}`}>Explore Era →</a></Button>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </ScrollArea>
      </div>
    </AppShell>
  );
}
