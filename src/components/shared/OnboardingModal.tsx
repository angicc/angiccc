import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Layers, MessageSquare, ScrollText, BookOpen, Flame, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ERAS } from '@/features/content/erasData';
import { LESSONS } from '@/features/content/lessonsData';

const ONBOARDING_KEY = 'historify:onboarded:';

export function hasCompletedOnboarding(userId: string) {
  return localStorage.getItem(ONBOARDING_KEY + userId) === 'true';
}

function markOnboardingDone(userId: string) {
  localStorage.setItem(ONBOARDING_KEY + userId, 'true');
}

function ClioMini() {
  return (
    <svg viewBox="0 0 80 80" width={72} height={72} xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <defs>
        <radialGradient id="ob-bg" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="100%" stopColor="#1c0a02" />
        </radialGradient>
        <linearGradient id="ob-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="39" fill="none" stroke="url(#ob-ring)" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="37" fill="url(#ob-bg)" />
      <ellipse cx="40" cy="20" rx="14" ry="9" fill="#3d1f08" />
      <path d="M26 23 Q22 35 28 43" fill="#3d1f08" />
      <path d="M54 23 Q58 35 52 43" fill="#3d1f08" />
      <ellipse cx="40" cy="29" rx="11" ry="12" fill="#c8956c" />
      <ellipse cx="40" cy="19" rx="12" ry="7" fill="#4a2c0a" />
      <path d="M29 20 L32 14 L40 17 L48 14 L51 20" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="40" cy="16.5" r="2.5" fill="#f59e0b" />
      <ellipse cx="36" cy="28" rx="2.3" ry="1.9" fill="#1a0a00" />
      <ellipse cx="44" cy="28" rx="2.3" ry="1.9" fill="#1a0a00" />
      <circle cx="36.8" cy="27.4" r="0.9" fill="white" opacity="0.85" />
      <circle cx="44.8" cy="27.4" r="0.9" fill="white" opacity="0.85" />
      <path d="M37 34 Q40 36.5 43 34" stroke="#a0604a" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M27 41 Q40 38 53 41 L57 74 Q40 77 23 74 Z" fill="#5b21b6" opacity="0.85" />
    </svg>
  );
}

const ERA_GRADIENTS: Record<string, string> = {
  ancient: 'from-amber-950/60 to-amber-900/20 border-amber-400/40 hover:border-amber-400/70',
  'middle-ages': 'from-blue-950/60 to-blue-900/20 border-blue-400/40 hover:border-blue-400/70',
  'early-modern': 'from-emerald-950/60 to-emerald-900/20 border-emerald-400/40 hover:border-emerald-400/70',
  modern: 'from-rose-950/60 to-rose-900/20 border-rose-400/40 hover:border-rose-400/70',
};
const ERA_TEXT: Record<string, string> = {
  ancient: 'text-amber-400',
  'middle-ages': 'text-blue-400',
  'early-modern': 'text-emerald-400',
  modern: 'text-rose-400',
};

const FEATURES = [
  { icon: BookOpen, label: 'Rich Lessons', desc: '18 in-depth lessons across 4 historical eras', color: 'text-amber-400' },
  { icon: Layers, label: 'Flashcards', desc: 'Flip-card review to lock in key facts', color: 'text-violet-400' },
  { icon: MessageSquare, label: 'AI Tutor — Clio', desc: 'Ask anything about history, get instant answers', color: 'text-primary' },
  { icon: ScrollText, label: 'Timeline', desc: '50+ historical events from 3100 BCE to today', color: 'text-emerald-400' },
  { icon: Trophy, label: 'Leaderboard', desc: 'Compete with other learners for the top spot', color: 'text-blue-400' },
  { icon: Flame, label: 'Streaks & XP', desc: 'Stay consistent and climb the level ladder', color: 'text-rose-400' },
];

const TOTAL_STEPS = 3;

export function OnboardingModal({ userId, onDone }: { userId: string; onDone: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [chosenEra, setChosenEra] = useState<string | null>(null);

  function finish() {
    markOnboardingDone(userId);
    onDone();
    if (chosenEra) {
      const firstLesson = LESSONS.filter(l => l.eraId === chosenEra).sort((a, b) => a.order - b.order)[0];
      if (firstLesson) navigate(`/eras/${chosenEra}/lessons/${firstLesson.id}`);
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1 bg-border">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ filter: ['drop-shadow(0 0 4px #f59e0b88)', 'drop-shadow(0 0 10px #f59e0bcc)', 'drop-shadow(0 0 4px #f59e0b88)'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <ClioMini />
                  </motion.div>
                  <div>
                    <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">Welcome to Historify</p>
                    <h2 className="font-heading text-2xl font-bold">I'm Clio, Muse of History</h2>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  I'll be your guide through 5,000 years of human civilization — from the first cities of Mesopotamia to the digital age. Together we'll explore empires, revolutions, ideas, and the people who shaped the world.
                </p>
                <div className="grid grid-cols-3 gap-3 py-2">
                  {[['18', 'Lessons'], ['50+', 'Timeline Events'], ['4', 'Eras']].map(([n, l]) => (
                    <div key={l} className="text-center p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="font-heading text-xl font-bold text-primary">{n}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
                <Button className="w-full gap-2" onClick={() => setStep(1)}>
                  Let's begin <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* Step 1: Choose era */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-heading text-xl font-bold">Where does history excite you most?</h2>
                  <p className="text-muted-foreground text-sm mt-1">We'll start your first lesson there — you can always explore all eras.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {ERAS.map(era => (
                    <button
                      key={era.id}
                      onClick={() => setChosenEra(era.id)}
                      className={`relative text-left p-4 rounded-xl border bg-gradient-to-br transition-all duration-200 ${ERA_GRADIENTS[era.id]} ${chosenEra === era.id ? 'ring-2 ring-primary scale-[1.02]' : ''}`}
                    >
                      <p className={`font-semibold text-sm ${ERA_TEXT[era.id]}`}>{era.shortName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{era.dateRange}</p>
                      {chosenEra === era.id && (
                        <motion.div
                          layoutId="era-check"
                          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => setStep(0)} className="shrink-0">Back</Button>
                  <Button className="flex-1 gap-2" onClick={() => setStep(2)} disabled={!chosenEra}>
                    Continue <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Features */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-heading text-xl font-bold">Everything at your fingertips</h2>
                  <p className="text-muted-foreground text-sm mt-1">Historify has a lot to offer — here's a quick tour.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {FEATURES.map((f, i) => (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-muted/30"
                    >
                      <f.icon className={`w-4 h-4 shrink-0 mt-0.5 ${f.color}`} />
                      <div>
                        <p className="text-xs font-semibold">{f.label}</p>
                        <p className="text-xs text-muted-foreground leading-snug mt-0.5">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => setStep(1)} className="shrink-0">Back</Button>
                  <Button className="flex-1 gap-2" onClick={finish}>
                    Start Learning <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 pb-4">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === step ? 'bg-primary w-4' : 'bg-border'}`} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
