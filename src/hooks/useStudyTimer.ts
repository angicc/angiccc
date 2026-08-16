import { useEffect, useRef } from 'react';
import { recordStudySeconds, IDLE_TIMEOUT_MS } from '@/features/progress/timeTracking';

/**
 * Accrue study seconds for as long as this component is mounted, the tab is
 * visible, and the learner has interacted recently.
 *
 * Ticking once a second and writing every TICK_SECONDS keeps the accounting
 * simple and loses at most a few seconds if the tab is closed abruptly — which
 * is why this does not rely on beforeunload/pagehide, unreliable on mobile.
 */
const TICK_SECONDS = 5;

export function useStudyTimer(userId: string | undefined, eraId: string | null): void {
  const lastInteraction = useRef<number>(Date.now());
  const pending = useRef(0);

  useEffect(() => {
    if (!userId) return;

    const touch = () => { lastInteraction.current = Date.now(); };
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'scroll', 'pointermove', 'wheel'];
    events.forEach(e => window.addEventListener(e, touch, { passive: true }));

    const flush = () => {
      if (pending.current > 0) {
        recordStudySeconds(userId, eraId, pending.current);
        pending.current = 0;
      }
    };

    const id = window.setInterval(() => {
      const active =
        document.visibilityState === 'visible' &&
        Date.now() - lastInteraction.current < IDLE_TIMEOUT_MS;
      if (!active) {
        // Bank whatever was earned before going idle, so it is not lost.
        flush();
        return;
      }
      pending.current += TICK_SECONDS;
      flush();
    }, TICK_SECONDS * 1000);

    return () => {
      window.clearInterval(id);
      events.forEach(e => window.removeEventListener(e, touch));
      flush();
    };
  }, [userId, eraId]);
}
