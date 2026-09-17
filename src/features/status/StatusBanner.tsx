import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Wrench, XCircle, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  loadStatus, overallHealth, activeEntries, localized, type Health,
} from '@/features/status/statusModel';
import { statusText, healthLabel, HEALTH_STYLE } from '@/features/status/statusCatalog';

const ICON: Record<Exclude<Health, 'operational'>, typeof AlertTriangle> = {
  degraded: AlertTriangle,
  maintenance: Wrench,
  outage: XCircle,
};

/** Remembers which message was dismissed, not that anything was dismissed. */
const DISMISS_KEY = 'historify:statusDismissed';

/**
 * The line that connects the app to its status page.
 *
 * Only appears when something is actually wrong, and carries the current
 * headline rather than a generic "check the status page" - somebody who has to
 * click through to find out whether their problem is known has already been
 * made to work for it.
 *
 * Dismissal is keyed to the status document's own timestamp, so closing today's
 * notice does not suppress tomorrow's outage.
 */
export function StatusBanner() {
  const { language } = useLanguage();
  const [state, setState] = useState<{ health: Health; headline: string; stamp: string } | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(() => {
    try { return localStorage.getItem(DISMISS_KEY); } catch { return null; }
  });

  useEffect(() => {
    let alive = true;
    loadStatus().then(doc => {
      if (!alive || !doc) return;
      const health = overallHealth(doc);
      if (health === 'operational') return;
      const open = activeEntries(doc.entries)[0];
      setState({
        health,
        headline: open ? localized(open.title, language) : localized(doc.summary, language),
        stamp: doc.updatedAt,
      });
    });
    return () => { alive = false; };
  }, [language]);

  if (!state || dismissed === state.stamp) return null;

  const style = HEALTH_STYLE[state.health];
  const Icon = ICON[state.health as Exclude<Health, 'operational'>] ?? AlertTriangle;

  function close() {
    setDismissed(state!.stamp);
    try { localStorage.setItem(DISMISS_KEY, state!.stamp); } catch { /* ignore */ }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={`overflow-hidden border-b ${style.border} ${style.bg}`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
          <Icon className={`h-4 w-4 shrink-0 ${style.text}`} />
          <p className="min-w-0 flex-1 truncate text-[13px]">
            <span className={`font-semibold ${style.text}`}>{healthLabel(state.health, language)}</span>
            <span className="text-muted-foreground"> - {state.headline}</span>
          </p>
          <Link
            to="/status"
            className="shrink-0 inline-flex items-center gap-1 text-[12px] text-primary hover:underline"
          >
            {statusText('status_view', language)}<ArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={close}
            aria-label={statusText('status_dismiss', language)}
            className="shrink-0 rounded p-1 text-muted-foreground hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
