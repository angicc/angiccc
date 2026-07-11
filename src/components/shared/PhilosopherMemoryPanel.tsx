// ─── "What this philosopher remembers about you" ─────────────────────────────
// Debate-side twin of the Clio memory panel: shows the head-to-head record
// against today's philosopher, the stances the student argued, points they
// conceded, and their strongest arguments — the dossier the persona debates
// from. Live-updates on background extraction and offers a one-click reset.
import { useEffect, useState } from 'react';
import { Brain, Swords, Trophy, Flag, Zap, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  loadPhilosopherMemory, clearPhilosopherMemory, PHILOSOPHER_MEMORY_EVENT,
  type PhilosopherRecord,
} from '@/features/philosopher/philosopherMemory';

export function PhilosopherMemoryPanel({ userId, philosopherId, philosopherName }: {
  userId: string; philosopherId: string; philosopherName: string;
}) {
  const { t } = useLanguage();
  const [record, setRecord] = useState<PhilosopherRecord | undefined>(
    () => loadPhilosopherMemory(userId).records[philosopherId],
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const refresh = () => setRecord(loadPhilosopherMemory(userId).records[philosopherId]);
    refresh();
    window.addEventListener(PHILOSOPHER_MEMORY_EVENT, refresh);
    return () => window.removeEventListener(PHILOSOPHER_MEMORY_EVENT, refresh);
  }, [userId, philosopherId]);

  const hasSignal = Boolean(record && (record.debates > 0 || record.stances.length > 0 || record.summaries.length > 0));

  return (
    <div className="rounded-xl border border-violet-400/25 bg-card/60 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-accent/40 transition-colors"
      >
        <Brain className="w-4 h-4 text-violet-400 shrink-0" />
        <span className="flex-1 text-xs font-semibold">{t.pmem_title.replace('{name}', philosopherName)}</span>
        {record && record.debates > 0 && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-violet-400/40 text-violet-400">
            {record.wins}–{Math.max(0, record.debates - record.wins)}
          </Badge>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 max-h-64 overflow-y-auto">
              {!hasSignal && (
                <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">{t.pmem_empty}</p>
              )}

              {record && record.debates > 0 && (
                <div className="flex gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Swords className="w-3 h-3" />{record.debates} {t.pmem_debates}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Trophy className="w-3 h-3" />{record.wins} {t.pmem_wins}
                  </span>
                </div>
              )}

              {record && record.stances.length > 0 && (
                <Section icon={Flag} label={t.pmem_stances}>
                  <ul className="space-y-0.5">
                    {record.stances.slice(-5).map(s => <li key={s} className="text-[11px] text-muted-foreground">• {s}</li>)}
                  </ul>
                </Section>
              )}

              {record && record.concessions.length > 0 && (
                <Section icon={Brain} label={t.pmem_concessions}>
                  <ul className="space-y-0.5">
                    {record.concessions.slice(-4).map(c => <li key={c} className="text-[11px] text-rose-300/80">• {c}</li>)}
                  </ul>
                </Section>
              )}

              {record && record.strongArguments.length > 0 && (
                <Section icon={Zap} label={t.pmem_strong}>
                  <ul className="space-y-0.5">
                    {record.strongArguments.slice(-3).map(a => <li key={a} className="text-[11px] text-emerald-300/90">• {a}</li>)}
                  </ul>
                </Section>
              )}

              {record?.style && (
                <p className="text-[11px] text-muted-foreground italic">{t.pmem_style}: {record.style}</p>
              )}

              {hasSignal && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full h-7 gap-1.5 text-[11px] text-muted-foreground hover:text-rose-400">
                      <Trash2 className="w-3 h-3" />{t.pmem_clear}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.pmem_clear_title}</AlertDialogTitle>
                      <AlertDialogDescription>{t.pmem_clear_desc}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.btn_cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => clearPhilosopherMemory(userId, philosopherId)}>{t.pmem_clear}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ icon: Icon, label, children }: {
  icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-violet-400/70" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      {children}
    </div>
  );
}
