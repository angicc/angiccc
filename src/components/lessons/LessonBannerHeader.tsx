// ─── Lesson banner header ────────────────────────────────────────────────────
// High-performance banner for catalog lessons: gradient placeholder paints
// instantly, the animated asset cross-fades in only after it has fully loaded,
// and a high-contrast overlay keeps the Macedonian Cyrillic title readable on
// any footage. Falls back to the pure gradient when no asset resolves.

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { LessonMetaData } from '../../data/lessonsCatalog';
import { fetchLessonBannerUrl } from '../../services/bannerAssetService';

interface LessonBannerHeaderProps {
  lesson: LessonMetaData;
  onBack?: () => void;
  /** Optional extra header actions (e.g. bookmark toggle) rendered top-right. */
  actions?: React.ReactNode;
}

const EPOCH_LABELS: Record<LessonMetaData['epochId'], string> = {
  prehistory: 'ПРАИСТОРИЈА',
  ancient: 'АНТИЧКИ СВЕТ',
  byzantine: 'ВИЗАНТИЈА',
  medieval: 'СРЕДЕН ВЕК',
};

export function LessonBannerHeader({ lesson, onBack, actions }: LessonBannerHeaderProps) {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);
    setBannerUrl(null);

    fetchLessonBannerUrl(lesson.id).then((url) => {
      if (isMounted && url) {
        setBannerUrl(url);
      }
    });

    return () => { isMounted = false; };
  }, [lesson.id]);

  return (
    <div className={`relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-gradient-to-br ${lesson.fallbackGradient} shadow-2xl border border-slate-800/80 transition-all duration-500`}>
      {bannerUrl && (
        <img
          src={bannerUrl}
          alt={lesson.correctedTitle}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => { setBannerUrl(null); setIsLoaded(false); }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            isLoaded ? 'opacity-40 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />

      <div className="relative z-20 flex flex-col justify-between h-full p-6 text-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-md text-amber-400">
            Час #{lesson.id} • {EPOCH_LABELS[lesson.epochId]}
          </span>
          <div className="flex items-center gap-2">
            {actions}
            {onBack && (
              <button
                onClick={onBack}
                aria-label="Назад"
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-md text-slate-200 hover:text-white hover:border-slate-500/60 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Назад
              </button>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 drop-shadow-md">
            {lesson.correctedTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-1 line-clamp-1 italic font-light">
            {lesson.bannerConcept}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LessonBannerHeader;
