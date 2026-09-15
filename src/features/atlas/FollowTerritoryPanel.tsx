import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Compass, MapPin, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ERAS } from '@/features/content/erasData';
import { getTranslatedEra } from '@/i18n/contentTranslations';
import { allFrames, isRevealed, type AtlasFrame } from '@/features/atlas/atlasModel';
import { atlasText, formatYear } from '@/features/atlas/atlasCatalog';
import { TERRITORY_ANCHORS, ANCHOR_TOPICS } from '@/features/atlas/territoryAnchors.generated';

/**
 * Every lesson whose territory encloses this anchor, oldest first.
 *
 * This is the whole feature in one function: the curriculum is ordered by era,
 * but a place's story runs across all of them. Macedonia appears in the ancient
 * era, the Byzantine one, the Ottoman centuries and the twentieth century, and
 * nothing in the app previously let you read it that way.
 *
 * Granularity is bounded by the geometry: 34 curated topics cover 134 lessons,
 * so lessons sharing a topic all match together. That makes this "lessons whose
 * territory covers this ground" rather than the sharper "lessons where it
 * changed hands", and the copy says so. It sharpens on its own as per-lesson
 * geometry lands.
 */
export function framesTouching(anchorId: string): AtlasFrame[] {
  const topics = new Set(ANCHOR_TOPICS[anchorId] ?? []);
  if (topics.size === 0) return [];
  return allFrames().filter(f => f.topicId && topics.has(f.topicId));
}

export function FollowTerritoryPanel({ completed, onClose, onPick }: {
  completed: string[];
  onClose: () => void;
  onPick: (frame: AtlasFrame) => void;
}) {
  const { language } = useLanguage();
  const [anchorId, setAnchorId] = useState<string | null>(null);
  const path = useMemo(() => (anchorId ? framesTouching(anchorId) : []), [anchorId]);
  const eraName = (id: string) => {
    const era = ERAS.find(e => e.id === id);
    return era ? getTranslatedEra(era, language).name : id;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-layer-1"
      >
        <div className="flex items-start justify-between border-b border-border p-4">
          <div>
            <h3 className="flex items-center gap-2 font-heading text-lg font-bold">
              <Compass className="h-4 w-4 text-primary" />
              {atlasText('atlas_follow', language)}
            </h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {atlasText('atlas_follow_hint', language)}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-border p-3">
          {TERRITORY_ANCHORS.map(a => (
            <Button
              key={a.id}
              size="sm"
              variant={a.id === anchorId ? 'default' : 'secondary'}
              onClick={() => setAnchorId(a.id)}
              className="h-7 text-[12px]"
            >
              {a.name}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {!anchorId && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {atlasText('atlas_follow_hint', language)}
            </p>
          )}
          {anchorId && path.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {atlasText('atlas_follow_none', language)}
            </p>
          )}
          <ul className="space-y-1">
            {path.map(f => {
              const lit = isRevealed(f, completed);
              return (
                <li key={f.lessonId}>
                  <button
                    onClick={() => onPick(f)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-white/5"
                  >
                    {lit
                      ? <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                      : <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />}
                    <span className="w-24 shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {formatYear(f.year, language)}
                    </span>
                    <span className={`flex-1 truncate text-[13px] ${lit ? '' : 'text-muted-foreground/60'}`}>
                      {f.title}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground/70">{eraName(f.eraId)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
