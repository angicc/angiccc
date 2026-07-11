// ─── Flip3D: perspective card flip ────────────────────────────────────────────
// A true 3D card flip (rotateY with preserve-3d and backface culling), shared
// by every flashcard surface in the app. The front and back are real DOM —
// both stay mounted, so flipping is pure GPU transform with no content swap
// flicker, and screen readers keep a stable tree.
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Flip3D({ flipped, front, back, onClick, className, minHeight = 220 }: {
  flipped: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
  onClick?: () => void;
  className?: string;
  minHeight?: number;
}) {
  return (
    <div
      onClick={onClick}
      className={cn('relative w-full cursor-pointer select-none', className)}
      style={{ perspective: 1200, minHeight }}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d', minHeight }}
      >
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
