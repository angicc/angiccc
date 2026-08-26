// ─── A horizontally paged rail with arrow buttons ────────────────────────────
//
// The landing page listed 21 feature cards in a three-column grid: seven rows
// of tiles below the fold that a visitor scrolls past rather than reads.
// Reviewer feedback was to cut the count or let people page sideways. Paging
// keeps all 21 discoverable while the section occupies one row instead of
// seven.
//
// Native scrolling does the work — `overflow-x: auto` with scroll snapping — so
// it responds to a trackpad swipe, a shift+wheel, a touch drag and the
// keyboard without any of that being reimplemented. The buttons only nudge
// scrollLeft; they are an affordance over the scroller, not a replacement for
// it, which is why the rail still works if JavaScript for them ever fails.

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  /** Accessible names for the two buttons, in the reader's language. */
  prevLabel: string;
  nextLabel: string;
  className?: string;
}

export function HorizontalRail({ children, prevLabel, nextLabel, className = '' }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  // No overflow means no rail: on a wide screen with few children the arrows
  // would be decorative buttons that do nothing.
  const [overflows, setOverflows] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 8);
    // A tolerance, because scrollLeft is fractional on zoomed or HiDPI
    // displays and an exact comparison leaves the end arrow enabled forever.
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft >= max - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', measure); ro.disconnect(); };
  }, [measure]);

  const page = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    // Scroll by a whole viewport of the rail, minus a sliver so the card at
    // the edge stays partly visible and the movement reads as continuous.
    el.scrollBy({ left: dir * (el.clientWidth - 64), behavior: 'smooth' });
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        // `scroll-pl-4` keeps a snapped card clear of the left fade.
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        // Native keyboard scrolling needs a focusable, labelled region.
        tabIndex={0}
        role="region"
        aria-label={nextLabel}
      >
        {children}
      </div>

      {/* Fades that signal there is more in that direction. pointer-events-none
          so they never swallow a click meant for a card underneath. */}
      {overflows && !atStart && (
        <div className="pointer-events-none absolute left-0 top-0 bottom-3 w-12 bg-gradient-to-r from-background to-transparent" />
      )}
      {overflows && !atEnd && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-12 bg-gradient-to-l from-background to-transparent" />
      )}

      {overflows && (
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={atStart}
            aria-label={prevLabel}
            className="w-9 h-9 rounded-full border border-border bg-card/70 flex items-center justify-center text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={atEnd}
            aria-label={nextLabel}
            className="w-9 h-9 rounded-full border border-border bg-card/70 flex items-center justify-center text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
