// ─── "What Clio remembers about you" — visible, controllable AI memory ───────
// Renders the learner profile that personalizes Clio's tutoring: interests,
// strengths, active misconception corrections, mastered facts, and session
// notes. Live-updates whenever background extraction lands (profile event),
// and gives the student a one-click "forget everything" — memory the user can
// inspect and control, not a hidden dossier.
import { useEffect, useState } from 'react';
import { Brain, Sparkles, TrendingUp, AlertCircle, CheckCircle2, BookOpen, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  loadLearnerProfile, clearLearnerProfile, resolveMisconception, profileHasSignal,
  PROFILE_UPDATED_EVENT, type LearnerProfile,
} from '@/features/ai/learnerProfile';

export function ClioMemoryPanel({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<LearnerProfile>(() => loadLearnerProfile(userId));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setProfile(loadLearnerProfile(userId));
    const onUpdate = () => setProfile(loadLearnerProfile(userId));
    window.addEventListener(PROFILE_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, onUpdate);
  }, [userId]);

  const hasSignal = profileHasSignal(profile);

  return (
    <div className="rounded-xl border border-border bg-card/60 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-accent/40 transition-colors"
      >
        <Brain className="w-4 h-4 text-primary shrink-0" />
        <span className="flex-1 text-xs font-semibold">{t.mem_title}</span>
        {hasSignal && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/40 text-primary">
            {profile.factsLearned.length + profile.interests.length + profile.misconceptions.length}
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
            <div className="px-3 pb-3 space-y-3 max-h-72 overflow-y-auto">
              {!hasSignal && (
                <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">{t.mem_empty}</p>
              )}

              {profile.interests.length > 0 && (
                <MemorySection icon={Sparkles} label={t.mem_interests}>
                  <div className="flex flex-wrap gap-1">
                    {profile.interests.map(i => (
                      <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">{i}</Badge>
                    ))}
                  </div>
                </MemorySection>
              )}

              {profile.strengths.length > 0 && (
                <MemorySection icon={TrendingUp} label={t.mem_strengths}>
                  <ul className="space-y-0.5">
                    {profile.strengths.map(s => <li key={s} className="text-[11px] text-muted-foreground">{s}</li>)}
                  </ul>
                </MemorySection>
              )}

              {profile.misconceptions.length > 0 && (
                <MemorySection icon={AlertCircle} label={t.mem_misconceptions}>
                  <ul className="space-y-1.5">
                    {profile.misconceptions.slice(-5).map(m => (
                      <li key={m.belief} className="text-[11px] leading-snug">
                        <span className="text-rose-400/90 line-through decoration-rose-400/50">{m.belief}</span>
                        <span className="text-muted-foreground"> → {m.correction}</span>
                        <button
                          onClick={() => { resolveMisconception(userId, m.belief); }}
                          className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] text-emerald-400 hover:text-emerald-300"
                          title={t.mem_resolved}
                        >
                          <CheckCircle2 className="w-3 h-3" />{t.mem_resolved}
                        </button>
                      </li>
                    ))}
                  </ul>
                </MemorySection>
              )}

              {profile.factsLearned.length > 0 && (
                <MemorySection icon={BookOpen} label={`${t.mem_facts} (${profile.factsLearned.length})`}>
                  <ul className="space-y-0.5">
                    {profile.factsLearned.slice(-4).map(f => (
                      <li key={f.fact} className="text-[11px] text-muted-foreground leading-snug">• {f.fact}</li>
                    ))}
                  </ul>
                </MemorySection>
              )}

              {profile.conversationSummaries.length > 0 && (
                <MemorySection icon={Brain} label={t.mem_sessions}>
                  <ul className="space-y-0.5">
                    {profile.conversationSummaries.slice(-3).map(s => (
                      <li key={s.at} className="text-[11px] text-muted-foreground leading-snug">• {s.summary}</li>
                    ))}
                  </ul>
                </MemorySection>
              )}

              {hasSignal && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full h-7 gap-1.5 text-[11px] text-muted-foreground hover:text-rose-400">
                      <Trash2 className="w-3 h-3" />{t.mem_clear}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.mem_clear_confirm_title}</AlertDialogTitle>
                      <AlertDialogDescription>{t.mem_clear_confirm_desc}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.btn_cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => clearLearnerProfile(userId)}>{t.mem_clear}</AlertDialogAction>
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

function MemorySection({ icon: Icon, label, children }: {
  icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-primary/70" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      {children}
    </div>
  );
}
