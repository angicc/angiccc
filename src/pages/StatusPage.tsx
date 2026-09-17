import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, AlertTriangle, Wrench, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  loadStatus, overallHealth, sortedEntries, localized,
  type StatusDoc, type Health, type EntryKind,
} from '@/features/status/statusModel';
import {
  statusText, healthLabel, kindLabel, componentLabel, HEALTH_STYLE,
} from '@/features/status/statusCatalog';

const HEALTH_ICON: Record<Health, typeof CheckCircle2> = {
  operational: CheckCircle2,
  degraded: AlertTriangle,
  maintenance: Wrench,
  outage: XCircle,
};

const KIND_TONE: Record<EntryKind, string> = {
  release: 'border-primary/40 text-primary',
  incident: 'border-rose-500/40 text-rose-400',
  maintenance: 'border-sky-400/40 text-sky-400',
  'known-issue': 'border-amber-400/40 text-amber-400',
};

function when(iso: string, language: string): string {
  try {
    return new Date(iso).toLocaleString(language === 'en' ? undefined : language, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

/**
 * The public status page.
 *
 * Deliberately outside the app shell and outside the login wall: the moment
 * somebody most needs this page is the moment the app will not let them in.
 */
export default function StatusPage() {
  const { language } = useLanguage();
  const [doc, setDoc] = useState<StatusDoc | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadStatus(true).then(d => { setDoc(d); setLoaded(true); });
  }, []);

  const health = doc ? overallHealth(doc) : 'operational';
  const style = HEALTH_STYLE[health];
  const Icon = HEALTH_ICON[health];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Historify
        </Link>

        <div className="mb-6 flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-primary" />
          <div>
            <h1 className="font-heading text-2xl font-bold">{statusText('status_title', language)}</h1>
            <p className="text-sm text-muted-foreground">{statusText('status_subtitle', language)}</p>
          </div>
        </div>

        {loaded && !doc && (
          <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">
            {statusText('status_unavailable', language)}
          </CardContent></Card>
        )}

        {doc && (
          <>
            {/* Current status */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`rounded-2xl border ${style.border} ${style.bg} p-5`}>
                <div className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.text}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {statusText('status_current', language)}
                    </div>
                    <div className={`font-heading text-lg font-bold ${style.text}`}>
                      {healthLabel(health, language)}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                      {localized(doc.summary, language)}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                      <Clock className="h-3 w-3" />
                      {statusText('status_updated', language)}: {when(doc.updatedAt, language)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Components */}
            <h2 className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {statusText('status_components', language)}
            </h2>
            <Card>
              <CardContent className="divide-y divide-border p-0">
                {doc.components.map(c => {
                  const s = HEALTH_STYLE[c.status];
                  return (
                    <div key={c.id} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm">{componentLabel(c.id, language)}</span>
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                        <span className={`text-[12px] ${s.text}`}>{healthLabel(c.status, language)}</span>
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* History */}
            <h2 className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {statusText('status_history', language)}
            </h2>
            <div className="space-y-3">
              {sortedEntries(doc.entries).map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.3) }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] ${KIND_TONE[e.kind]}`}>
                          {kindLabel(e.kind, language)}
                        </Badge>
                        <span className="text-[11px] tabular-nums text-muted-foreground">{when(e.at, language)}</span>
                        {(e.kind === 'incident' || e.kind === 'maintenance') && (
                          <Badge variant="outline" className={`text-[10px] ${e.resolvedAt ? 'border-emerald-400/40 text-emerald-400' : 'border-amber-400/40 text-amber-400'}`}>
                            {statusText(e.resolvedAt ? 'status_resolved' : 'status_ongoing', language)}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-heading text-sm font-semibold">{localized(e.title, language)}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                        {localized(e.body, language)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
