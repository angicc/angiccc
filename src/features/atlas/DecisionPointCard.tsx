import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { atlasText } from '@/features/atlas/atlasCatalog';
import { loc, type DecisionPoint } from '@/features/atlas/decisionPoints';

/**
 * One decision, inline in the lesson body.
 *
 * The reader commits before the verdict is shown. That ordering is the entire
 * mechanic: agreeing with hindsight teaches nothing, and the text immediately
 * below this block is about to give the answer away.
 *
 * Master-only, alongside the Crisis Room it borrows its shape from. A reader on
 * a lower plan sees nothing at all here rather than a locked teaser, because a
 * teaser in the middle of a paragraph interrupts the lesson for someone who
 * cannot act on it.
 */
export function DecisionPointCard({ point }: { point: DecisionPoint }) {
  const { language } = useLanguage();
  const { subscription } = useSubscription();
  const [chosen, setChosen] = useState<string | null>(null);

  if (subscription?.tier !== 'master') return null;

  const answered = chosen !== null;
  const correct = chosen === point.historical;
  const historicalOption = point.options.find(o => o.id === point.historical)!;

  return (
    <div className="my-7 overflow-hidden rounded-2xl border border-primary/30 bg-primary/[0.04]">
      <div className="flex items-center gap-2 border-b border-primary/20 px-4 py-2.5">
        <GitBranch className="h-4 w-4 text-primary" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          {atlasText('atlas_decision', language)}
        </span>
        {!answered && (
          <span className="ml-auto text-[11px] text-muted-foreground">
            {atlasText('atlas_decision_hint', language)}
          </span>
        )}
      </div>

      <div className="space-y-3 p-4">
        <p className="font-heading text-[15px] font-semibold leading-relaxed">
          {loc(point.question, language)}
        </p>

        <div className="grid gap-2">
          {point.options.map(o => {
            const picked = chosen === o.id;
            const isHistory = answered && o.id === point.historical;
            return (
              <button
                key={o.id}
                disabled={answered}
                onClick={() => setChosen(o.id)}
                className={`rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                  !answered ? 'border-border bg-card hover:border-primary/50'
                    : isHistory ? 'border-emerald-400/60 bg-emerald-400/10'
                    : picked ? 'border-amber-400/50 bg-amber-400/5'
                    : 'border-border/50 opacity-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="flex-1 text-[13px] font-medium">{loc(o.label, language)}</span>
                  {isHistory && <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />}
                </div>
                <AnimatePresence>
                  {answered && (picked || isHistory) && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground"
                    >
                      {loc(o.outcome, language)}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-3.5"
            >
              <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
                <span className="text-primary">
                  {atlasText('atlas_decision_what_happened', language)}
                </span>
                <span className={correct ? 'text-emerald-400' : 'text-amber-400'}>
                  {atlasText(correct ? 'atlas_decision_agree' : 'atlas_decision_differ', language)}
                </span>
              </div>
              <p className="mb-2 text-[12px] font-medium">{loc(historicalOption.label, language)}</p>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {loc(point.verdict, language)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
