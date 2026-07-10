import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, GraduationCap, Award, Trophy, Flame, Zap, Star, MessageSquare, Map } from 'lucide-react';
import type { Achievement } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslatedAchievement } from '@/i18n/achievementTranslations';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, GraduationCap, Award, Trophy, Flame, Zap, Star, MessageSquare, Map,
};

export function AchievementToast({ achievements, onDone }: { achievements: Achievement[]; onDone: () => void }) {
  const { t, language } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      if (idx < achievements.length - 1) {
        setIdx(i => i + 1);
      } else {
        setVisible(false);
        setTimeout(onDone, 400);
      }
    }, 3800);
    return () => clearTimeout(t);
  }, [idx, achievements.length, onDone]);

  const a = achievements[idx];
  const trans = getTranslatedAchievement(a.id, language);
  const Icon = ICONS[a.icon] ?? Award;

  function dismiss() {
    setVisible(false);
    setTimeout(onDone, 400);
  }

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 96, scale: 0.88 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 96, scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="fixed bottom-6 right-4 sm:right-6 z-[200] w-[calc(100vw-2rem)] sm:w-80 bg-card rounded-2xl shadow-2xl overflow-hidden"
          style={{ borderWidth: 1, borderColor: 'rgba(251,191,36,0.5)' }}
        >
          {/* Gold shimmer top bar */}
          <motion.div
            className="h-0.5 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3.8, ease: 'linear' }}
            style={{ transformOrigin: 'right' }}
          />
          <div className="p-4 flex items-start gap-3">
            {/* Pulsing icon ring */}
            <motion.div
              className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-amber-400/15"
              animate={{
                boxShadow: [
                  '0 0 0 0px rgba(251,191,36,0.4)',
                  '0 0 0 8px rgba(251,191,36,0)',
                  '0 0 0 0px rgba(251,191,36,0)',
                ],
              }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{ border: '1.5px solid rgba(251,191,36,0.5)' }}
            >
              <Icon className="w-6 h-6 text-amber-400" />
            </motion.div>

            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">{t.achievement_unlocked}</p>
              <p className="font-heading font-bold text-sm mt-0.5 leading-tight">{trans?.title ?? a.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{trans?.description ?? a.description}</p>
              <p className="text-xs text-amber-400 font-semibold mt-1.5">+{a.xpBonus} XP bonus</p>
            </div>

            <button onClick={dismiss} className="shrink-0 mt-0.5 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
