// ─── Battle juice: particles, volleys, shake, banners, cinematics ─────────────
// Every effect is a self-contained framer-motion component keyed by the round
// counter, so replays are automatic and cleanup is free (AnimatePresence
// unmounts them). Nothing here holds game state — the arena passes what the
// engine resolved and these components make it FEEL like it happened.
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star as StarIcon, Flame, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tactic, Side } from './battleEngine';

// ── Screen shake wrapper ──────────────────────────────────────────────────────
// Wraps the whole battlefield; `intensity` 0 disables, 1 = light rumble,
// 2 = crit/rout slam.
export function ShakeStage({ trigger, intensity, children }: {
  trigger: number; intensity: 0 | 1 | 2; children: React.ReactNode;
}) {
  const amp = intensity === 2 ? 10 : intensity === 1 ? 5 : 0;
  return (
    <motion.div
      key={trigger}
      animate={amp === 0 ? {} : {
        x: [0, -amp, amp, -amp * 0.6, amp * 0.6, 0],
        y: [0, amp * 0.4, -amp * 0.4, amp * 0.25, 0, 0],
      }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}

// ── Impact dust burst ─────────────────────────────────────────────────────────
// A radial puff of particles where a strike lands.
const DUST_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  angle: (i / 12) * Math.PI * 2,
  dist: 22 + (i % 3) * 14,
  size: 3 + (i % 4),
}));

export function ImpactBurst({ x, color, burstKey }: { x: string; color: string; burstKey: number }) {
  return (
    <div className="absolute bottom-[26%] pointer-events-none z-20" style={{ left: x, transform: 'translateX(-50%)' }}>
      {DUST_PARTICLES.map((pt, i) => (
        <motion.div
          key={`${burstKey}-${i}`}
          initial={{ x: 0, y: 0, opacity: 0.95, scale: 1 }}
          animate={{
            x: Math.cos(pt.angle) * pt.dist,
            y: Math.sin(pt.angle) * pt.dist * 0.55 - 10,
            opacity: 0,
            scale: 0.4,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{ width: pt.size, height: pt.size, background: color, boxShadow: `0 0 6px ${color}` }}
        />
      ))}
      <motion.div
        key={`ring-${burstKey}`}
        initial={{ scale: 0.2, opacity: 0.7 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="absolute -left-6 -top-6 w-12 h-12 rounded-full border-2"
        style={{ borderColor: color }}
      />
    </div>
  );
}

// ── Arrow / shot volley ───────────────────────────────────────────────────────
// A flight of projectiles arcing from one army to the other. Direction 1 =
// player → enemy (left → right).
const VOLLEY_SHOTS = Array.from({ length: 7 }, (_, i) => ({
  delay: i * 0.05,
  lift: 40 + (i % 4) * 16,
  drift: (i % 3 - 1) * 10,
}));

export function Volley({ direction, color, volleyKey, modern }: {
  direction: 1 | -1; color: string; volleyKey: number; modern?: boolean;
}) {
  const fromX = direction === 1 ? '18%' : '82%';
  const toX = direction === 1 ? '76%' : '24%';
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {VOLLEY_SHOTS.map((s, i) => (
        <motion.div
          key={`${volleyKey}-${i}`}
          initial={{ left: fromX, bottom: '30%', opacity: 0, rotate: direction === 1 ? -32 : 212 }}
          animate={{
            left: [fromX, toX],
            bottom: ['30%', `${30 + s.lift / 3}%`, '28%'],
            opacity: [0, 1, 1, 0.4],
            rotate: direction === 1 ? [-32, 0, 38] : [212, 180, 142],
          }}
          transition={{ duration: 0.72, delay: s.delay, ease: 'easeIn' }}
          className="absolute"
          style={{ marginLeft: s.drift }}
        >
          {modern ? (
            <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}, 0 0 14px ${color}` }} />
          ) : (
            <svg width="22" height="6" viewBox="0 0 22 6">
              <line x1="0" y1="3" x2="18" y2="3" stroke="#cbd5e1" strokeWidth="1.4" />
              <polygon points="22,3 16,0.5 16,5.5" fill={color} />
              <path d="M0 3 L4 0.5 M0 3 L4 5.5" stroke="#94a3b8" strokeWidth="1" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ── Slash flash for melee strikes ─────────────────────────────────────────────
export function SlashFlash({ x, direction, color, slashKey }: {
  x: string; direction: 1 | -1; color: string; slashKey: number;
}) {
  return (
    <motion.div
      key={slashKey}
      initial={{ opacity: 0, scale: 0.5, rotate: direction === 1 ? -30 : 210 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4], rotate: direction === 1 ? 20 : 160 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="absolute bottom-[30%] pointer-events-none z-20"
      style={{ left: x, transform: 'translateX(-50%)' }}
    >
      <svg width="64" height="64" viewBox="0 0 64 64">
        <path d="M6 50 Q32 4 58 22" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
        <path d="M14 54 Q36 16 56 30" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
      </svg>
    </motion.div>
  );
}

// ── Floating damage number ────────────────────────────────────────────────────
export function DamageFloat({ x, amount, crit, color, floatKey }: {
  x: string; amount: number; crit: boolean; color: string; floatKey: number;
}) {
  return (
    <motion.div
      key={floatKey}
      initial={{ opacity: 0, y: 0, scale: crit ? 0.6 : 0.9 }}
      animate={{ opacity: [0, 1, 1, 0], y: -56, scale: crit ? [0.6, 1.5, 1.25] : 1 }}
      transition={{ duration: 1.0, ease: 'easeOut' }}
      className="absolute bottom-[46%] pointer-events-none z-30 font-heading font-extrabold"
      style={{
        left: x, transform: 'translateX(-50%)',
        color, fontSize: crit ? 30 : 20,
        textShadow: `0 0 10px ${color}88, 0 2px 4px rgba(0,0,0,0.9)`,
      }}
    >
      −{amount}{crit && '!'}
    </motion.div>
  );
}

// ── Morale shockwave on rout ──────────────────────────────────────────────────
export function RoutShockwave({ x, waveKey }: { x: string; waveKey: number }) {
  return (
    <div className="absolute bottom-[24%] pointer-events-none z-10" style={{ left: x, transform: 'translateX(-50%)' }}>
      {[0, 0.12, 0.24].map((d, i) => (
        <motion.div
          key={`${waveKey}-${i}`}
          initial={{ scale: 0.2, opacity: 0.8 }}
          animate={{ scale: 4 + i, opacity: 0 }}
          transition={{ duration: 0.9, delay: d, ease: 'easeOut' }}
          className="absolute -left-8 -top-8 w-16 h-16 rounded-full border-2 border-white/70"
        />
      ))}
    </div>
  );
}

// ── Round banner ──────────────────────────────────────────────────────────────
// The big centre-screen call: DIRECT HIT / COUNTER-CHARGE / ROUT!, tinted by
// which side struck.
export function RoundBanner({ text, side, crit, bannerKey }: {
  text: string; side: Side; crit: boolean; bannerKey: number;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key={bannerKey}
        initial={{ opacity: 0, scale: 0.5, y: 12 }}
        animate={{ opacity: 1, scale: crit ? 1.15 : 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.35 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
      >
        <div className={cn(
          'font-heading font-extrabold px-7 py-2.5 rounded-2xl border-2 backdrop-blur-sm',
          crit ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl',
          side === 'player'
            ? 'text-amber-300 border-amber-400/60 bg-amber-400/10'
            : 'text-rose-300 border-rose-400/60 bg-rose-400/10',
          crit && 'shadow-[0_0_40px_rgba(251,191,36,0.35)]',
        )}>
          {crit && <Flame className="inline w-7 h-7 mr-2 -mt-1" />}
          {text}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Streak pips ───────────────────────────────────────────────────────────────
export function StreakPips({ streak, threshold, color }: { streak: number; threshold: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: threshold }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={i < streak
            ? { scale: [1, 1.4, 1], backgroundColor: color, boxShadow: `0 0 8px ${color}` }
            : { scale: 1, backgroundColor: 'rgba(255,255,255,0.12)', boxShadow: 'none' }}
          transition={{ duration: 0.3 }}
          className="w-2 h-2 rounded-full"
        />
      ))}
    </div>
  );
}

// ── Victory / defeat cinematic backdrop ───────────────────────────────────────
const LAUREL_RAYS = Array.from({ length: 14 }, (_, i) => (i / 14) * 360);

export function VictoryCinematic({ won }: { won: boolean }) {
  if (!won) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 pointer-events-none z-20"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950/50 to-transparent" />
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: [0, 0.35, 0], y: -80, x: (i - 1) * 60 }}
            transition={{ duration: 3.2, delay: i * 0.7, repeat: Infinity }}
            className="absolute bottom-1/4 left-1/2 text-white/30"
          >
            <Wind className="w-10 h-10" />
          </motion.div>
        ))}
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent" />
      {/* radial god-rays */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
        {LAUREL_RAYS.map(deg => (
          <motion.div
            key={deg}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.14, 0.05] }}
            transition={{ duration: 1.6, delay: deg / 500 }}
            className="absolute h-[2px] w-56 origin-left"
            style={{ transform: `rotate(${deg}deg)`, background: 'linear-gradient(90deg, rgba(251,191,36,0.85), transparent)' }}
          />
        ))}
      </div>
      {/* rising sparks */}
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 0.9, 0], y: -140 - (i % 5) * 30 }}
          transition={{ duration: 2 + (i % 4) * 0.5, delay: i * 0.14, repeat: Infinity }}
          className="absolute bottom-1/4 w-1.5 h-1.5 rounded-full bg-amber-300"
          style={{ left: `${8 + (i * 5.4) % 84}%`, boxShadow: '0 0 6px #fbbf24' }}
        />
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.4, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.25 }}
        className="absolute left-1/2 top-[16%] -translate-x-1/2 text-amber-400"
      >
        <Crown className="w-14 h-14 drop-shadow-[0_0_18px_rgba(251,191,36,0.8)]" />
      </motion.div>
    </motion.div>
  );
}

// ── Star burst for the result screen ─────────────────────────────────────────
export function ResultStars({ stars }: { stars: 0 | 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3].map(n => (
        <motion.div
          key={n}
          initial={{ scale: 0, rotate: -100 }}
          animate={{ scale: n <= stars ? [0, 1.5, 1] : 0.9, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 13, delay: 0.35 + n * 0.22 }}
        >
          <StarIcon className={cn(
            'w-10 h-10',
            n <= stars
              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]'
              : 'text-white/15',
          )} />
        </motion.div>
      ))}
    </div>
  );
}

// ── Tactic card art ───────────────────────────────────────────────────────────
export function TacticGlyph({ tactic, className }: { tactic: Tactic; className?: string }) {
  if (tactic === 'charge') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 12 L17 12 M12 5 L19 12 L12 19" />
        <path d="M3 6 L9 6 M3 18 L9 18" opacity="0.5" />
      </svg>
    );
  }
  if (tactic === 'volley') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 18 Q12 2 20 14" />
        <path d="M20 14 L16.5 12.5 M20 14 L19 10.5" />
        <path d="M2 14 Q9 3 15 9" opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 3 L20 6 L20 12 Q20 18 12 21 Q4 18 4 12 L4 6 Z" />
      <path d="M12 8 L12 13 M9.5 10.5 L14.5 10.5" opacity="0.6" />
    </svg>
  );
}
