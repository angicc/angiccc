// ─── Era-themed battle unit sprites ──────────────────────────────────────────
// Hand-crafted SVG soldiers for the Conquest battles: four eras × three unit
// classes, each silhouette readable at 30px — hoplites and chariots for the
// ancient world, knights and longbowmen for the medieval, pike-and-shot for
// the early modern, riflemen and artillery for the modern era. Animation is
// externalized: sprites accept a `pose` and animate between them with
// framer-motion so the arena can choreograph idle sway, charges, volleys,
// hits, and deaths per regiment.
import { motion } from 'framer-motion';
import type { EraId, UnitClass } from './battleEngine';

export type UnitPose = 'idle' | 'charge' | 'attack' | 'hit' | 'dead' | 'waver';

export interface SpriteProps {
  color: string;
  accent: string;
  facing: 1 | -1;
  pose: UnitPose;
  delay?: number;   // stagger offset for rank ripple
  scale?: number;
}

// Shared pose animation variants — every sprite plugs into the same choreography.
const POSE_VARIANTS = {
  idle: (delay: number) => ({
    y: [0, -1.5, 0],
    rotate: 0,
    opacity: 1,
    transition: { y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const, delay }, opacity: { duration: 0.3 } },
  }),
  waver: (delay: number) => ({
    y: [0, -1, 0],
    rotate: [-3, 3, -3],
    opacity: 0.92,
    transition: { rotate: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const, delay }, y: { duration: 1.4, repeat: Infinity, delay } },
  }),
  charge: (delay: number) => ({
    y: [0, -3, 0],
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.35, repeat: 2, delay: delay * 0.4 },
  }),
  attack: (delay: number) => ({
    y: -2,
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.2, delay: delay * 0.3 },
  }),
  hit: (delay: number) => ({
    y: 0,
    x: [0, -3, 2, 0],
    opacity: [1, 0.6, 1],
    transition: { duration: 0.4, delay: delay * 0.25 },
  }),
  dead: () => ({
    opacity: 0,
    y: 16,
    rotate: 60,
    transition: { duration: 0.5, ease: 'easeIn' as const },
  }),
};

function SpriteShell({ facing, pose, delay = 0, scale = 1, children }: SpriteProps & { children: React.ReactNode }) {
  const variant = POSE_VARIANTS[pose](delay);
  return (
    <motion.div
      initial={false}
      animate={variant}
      style={{ transform: `scaleX(${facing}) scale(${scale})`, transformOrigin: 'bottom center' }}
      className="relative shrink-0"
    >
      {children}
    </motion.div>
  );
}

const SHADOW = { filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.6))' };

// ═══════════════════════════ ANCIENT ═══════════════════════════

function AncientInfantry(p: SpriteProps) {
  // Hoplite: crested helmet, round hoplon shield, long spear.
  return (
    <SpriteShell {...p}>
      <svg width="30" height="40" viewBox="0 0 30 40" style={SHADOW}>
        <line x1="23" y1="1" x2="23" y2="34" stroke="#cbd5e1" strokeWidth="1.7" />
        <polygon points="23,0 25.5,6 20.5,6" fill="#e2e8f0" />
        <path d="M10 5 Q14 0 18 5 L17 8 L11 8 Z" fill={p.accent} />
        <circle cx="14" cy="10" r="4" fill={p.color} stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" />
        <rect x="10" y="14" width="8" height="13" rx="2" fill={p.color} />
        <path d="M10 27 L9 33 M18 27 L19 33" stroke={p.color} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="8" cy="20" r="6.5" fill={p.accent} stroke="rgba(0,0,0,0.45)" strokeWidth="1.1" />
        <circle cx="8" cy="20" r="2.4" fill={p.color} />
      </svg>
    </SpriteShell>
  );
}

function AncientRanged(p: SpriteProps) {
  // Slinger: light tunic, whirling sling above the head.
  return (
    <SpriteShell {...p}>
      <svg width="30" height="38" viewBox="0 0 30 38" style={SHADOW}>
        <path d="M6 6 Q15 -2 24 6" stroke={p.accent} strokeWidth="1.4" fill="none" strokeDasharray="2,2" />
        <circle cx="24" cy="6" r="1.8" fill="#e2e8f0" />
        <circle cx="14" cy="10" r="3.8" fill={p.color} />
        <path d="M10 14 L18 14 L17 26 L11 26 Z" fill={p.color} opacity="0.95" />
        <path d="M11 26 L9.5 33 M17 26 L18.5 33" stroke={p.color} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="10" y1="16" x2="5" y2="9" stroke={p.color} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </SpriteShell>
  );
}

function AncientCavalry(p: SpriteProps) {
  // War chariot: two-wheeled cab, rearing horse silhouette.
  return (
    <SpriteShell {...p} scale={(p.scale ?? 1) * 1.15}>
      <svg width="44" height="40" viewBox="0 0 44 40" style={SHADOW}>
        <path d="M4 26 Q2 18 8 16 Q10 10 15 12 L17 8 Q19 5 21 8 L20 13 Q26 15 26 22 L26 27 Z" fill={p.accent} />
        <path d="M8 16 L5 10 M15 12 L14 6" stroke={p.accent} strokeWidth="1.6" strokeLinecap="round" />
        <rect x="26" y="16" width="12" height="10" rx="2" fill={p.color} />
        <circle cx="31" cy="10" r="3.6" fill={p.color} />
        <line x1="35" y1="2" x2="35" y2="16" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="35,0 37,5 33,5" fill="#e2e8f0" />
        <circle cx="32" cy="30" r="6" fill="none" stroke={p.color} strokeWidth="2" />
        <circle cx="32" cy="30" r="1.6" fill={p.color} />
        <path d="M26 30 L10 30 Q6 30 4 26" stroke={p.color} strokeWidth="1.8" fill="none" />
        <path d="M8 30 L6 36 M14 30 L13 36" stroke={p.accent} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </SpriteShell>
  );
}

// ═══════════════════════════ MEDIEVAL ═══════════════════════════

function MedievalInfantry(p: SpriteProps) {
  // Man-at-arms: kettle helm, kite shield, sword.
  return (
    <SpriteShell {...p}>
      <svg width="30" height="40" viewBox="0 0 30 40" style={SHADOW}>
        <path d="M9 8 Q14 3 19 8 L19 10 L9 10 Z" fill={p.accent} />
        <circle cx="14" cy="11" r="3.6" fill={p.color} />
        <rect x="10" y="15" width="8" height="12" rx="2" fill={p.color} />
        <path d="M10 27 L9 34 M18 27 L19 34" stroke={p.color} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M4 15 L12 15 L12 24 Q8 28 4 24 Z" fill={p.accent} stroke="rgba(0,0,0,0.4)" strokeWidth="0.9" />
        <line x1="8" y1="15" x2="8" y2="26" stroke={p.color} strokeWidth="0.9" opacity="0.6" />
        <line x1="21" y1="6" x2="21" y2="22" stroke="#e2e8f0" strokeWidth="1.8" />
        <line x1="18.5" y1="9" x2="23.5" y2="9" stroke="#cbd5e1" strokeWidth="1.6" />
      </svg>
    </SpriteShell>
  );
}

function MedievalRanged(p: SpriteProps) {
  // Longbowman: tall bow, drawn arrow, hood.
  return (
    <SpriteShell {...p}>
      <svg width="30" height="40" viewBox="0 0 30 40" style={SHADOW}>
        <path d="M22 4 Q28 20 22 36" stroke="#a16207" strokeWidth="1.8" fill="none" />
        <line x1="22" y1="4" x2="22" y2="36" stroke="#e2e8f0" strokeWidth="0.7" />
        <line x1="8" y1="20" x2="24" y2="20" stroke="#cbd5e1" strokeWidth="1.3" />
        <polygon points="6,20 10,18.5 10,21.5" fill="#e2e8f0" />
        <path d="M10 6 Q14 2 18 6 L16 12 L12 12 Z" fill={p.accent} />
        <circle cx="14" cy="10" r="3.2" fill={p.color} />
        <rect x="10" y="13" width="8" height="13" rx="2" fill={p.color} />
        <path d="M11 26 L9.5 34 M17 26 L18.5 34" stroke={p.color} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </SpriteShell>
  );
}

function MedievalCavalry(p: SpriteProps) {
  // Knight: barded horse, couched lance, plumed great helm.
  return (
    <SpriteShell {...p} scale={(p.scale ?? 1) * 1.15}>
      <svg width="46" height="40" viewBox="0 0 46 40" style={SHADOW}>
        <path d="M6 28 Q4 18 12 16 Q14 9 20 12 L23 8 Q26 5 27 9 L26 14 Q34 16 34 24 L34 29 Z" fill={p.accent} />
        <path d="M12 29 L10 36 M20 29 L19 36 M28 29 L27 36" stroke={p.accent} strokeWidth="2.4" strokeLinecap="round" />
        <rect x="24" y="10" width="8" height="11" rx="2" fill={p.color} />
        <rect x="25.5" y="3" width="5" height="6" rx="1.2" fill={p.color} />
        <path d="M28 3 Q31 0 33 2" stroke={p.accent} strokeWidth="1.6" fill="none" />
        <line x1="20" y1="14" x2="44" y2="8" stroke="#cbd5e1" strokeWidth="1.8" />
        <polygon points="44,8 40,6.5 40.5,9.5" fill="#e2e8f0" />
        <path d="M18 16 L26 16 L26 24 Q22 27 18 24 Z" fill={p.color} opacity="0.9" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" />
      </svg>
    </SpriteShell>
  );
}

// ═══════════════════════════ EARLY MODERN ═══════════════════════════

function EarlyModernInfantry(p: SpriteProps) {
  // Pikeman: morion helmet, very long pike held at 60°.
  return (
    <SpriteShell {...p}>
      <svg width="30" height="40" viewBox="0 0 30 40" style={SHADOW}>
        <line x1="6" y1="36" x2="26" y2="2" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="26,2 27.5,6.5 23.5,4.5" fill="#e2e8f0" />
        <path d="M9 8 Q14 4 19 8 L17 10 L11 10 Z" fill={p.accent} />
        <path d="M9 8 L7 7 M19 8 L21 7" stroke={p.accent} strokeWidth="1.4" />
        <circle cx="14" cy="11" r="3.4" fill={p.color} />
        <rect x="10" y="15" width="8" height="11" rx="2" fill={p.color} />
        <path d="M10 26 L9 34 M18 26 L19 34" stroke={p.color} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 17 L18 17" stroke={p.accent} strokeWidth="1.1" opacity="0.8" />
      </svg>
    </SpriteShell>
  );
}

function EarlyModernRanged(p: SpriteProps) {
  // Musketeer: wide-brim hat with plume, levelled musket.
  return (
    <SpriteShell {...p}>
      <svg width="34" height="40" viewBox="0 0 34 40" style={SHADOW}>
        <ellipse cx="14" cy="7" rx="6.5" ry="1.8" fill={p.accent} />
        <path d="M10 7 Q14 2 18 7 Z" fill={p.accent} />
        <path d="M18 5 Q22 2 24 4" stroke={p.color} strokeWidth="1.3" fill="none" />
        <circle cx="14" cy="10.5" r="3.2" fill={p.color} />
        <rect x="10" y="14" width="8" height="12" rx="2" fill={p.color} />
        <path d="M10 26 L9 34 M18 26 L19 34" stroke={p.color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="17.5" x2="32" y2="15.5" stroke="#94a3b8" strokeWidth="2" />
        <rect x="8" y="16" width="5" height="3.4" rx="1" fill="#78350f" />
      </svg>
    </SpriteShell>
  );
}

function EarlyModernCavalry(p: SpriteProps) {
  // Hussar: winged rider, sabre aloft.
  return (
    <SpriteShell {...p} scale={(p.scale ?? 1) * 1.15}>
      <svg width="44" height="40" viewBox="0 0 44 40" style={SHADOW}>
        <path d="M5 28 Q3 18 11 16 Q13 9 19 12 L22 8 Q25 5 26 9 L25 14 Q33 16 33 24 L33 29 Z" fill={p.accent} />
        <path d="M11 29 L9 36 M19 29 L18 36 M27 29 L26 36" stroke={p.accent} strokeWidth="2.3" strokeLinecap="round" />
        <rect x="23" y="10" width="7" height="11" rx="2" fill={p.color} />
        <circle cx="26.5" cy="6.5" r="3" fill={p.color} />
        <path d="M30 10 Q37 4 36 14 Q34 18 30 16 Z" fill={p.color} opacity="0.75" />
        <path d="M31 12 L34 8 M31 14 L35 11" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" />
        <path d="M22 8 Q28 0 34 3" stroke="#e2e8f0" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      </svg>
    </SpriteShell>
  );
}

// ═══════════════════════════ MODERN ═══════════════════════════

function ModernInfantry(p: SpriteProps) {
  // Rifleman: helmet, slung rifle, webbing.
  return (
    <SpriteShell {...p}>
      <svg width="30" height="40" viewBox="0 0 30 40" style={SHADOW}>
        <path d="M9.5 9 Q14 4.5 18.5 9 L18 11 L10 11 Z" fill={p.accent} />
        <circle cx="14" cy="11.5" r="3.2" fill={p.color} />
        <rect x="10" y="15" width="8" height="12" rx="2" fill={p.color} />
        <path d="M10 18 L18 21" stroke={p.accent} strokeWidth="1.4" opacity="0.9" />
        <path d="M10 27 L9 35 M18 27 L19 35" stroke={p.color} strokeWidth="2.6" strokeLinecap="round" />
        <line x1="7" y1="14" x2="24" y2="20" stroke="#94a3b8" strokeWidth="1.9" />
        <rect x="12" y="16.2" width="4" height="2.6" rx="0.8" fill="#3f3f46" transform="rotate(19 14 17.5)" />
      </svg>
    </SpriteShell>
  );
}

function ModernRanged(p: SpriteProps) {
  // Field gun with crew silhouette.
  return (
    <SpriteShell {...p} scale={(p.scale ?? 1) * 1.1}>
      <svg width="40" height="38" viewBox="0 0 40 38" style={SHADOW}>
        <line x1="12" y1="22" x2="36" y2="8" stroke="#64748b" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="14" cy="26" r="7" fill="none" stroke={p.color} strokeWidth="2.2" />
        <circle cx="14" cy="26" r="1.8" fill={p.color} />
        <path d="M14 26 L14 19 M14 26 L20 22 M14 26 L8 22" stroke={p.color} strokeWidth="1.1" opacity="0.7" />
        <path d="M12 22 L4 32 M16 23 L24 33" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <circle cx="30" cy="16" r="2.6" fill={p.accent} />
        <rect x="27.5" y="19" width="5" height="8" rx="1.4" fill={p.accent} />
      </svg>
    </SpriteShell>
  );
}

function ModernCavalry(p: SpriteProps) {
  // Shock trooper: crouched runner with fixed bayonet.
  return (
    <SpriteShell {...p}>
      <svg width="34" height="40" viewBox="0 0 34 40" style={SHADOW}>
        <path d="M10 8.5 Q14 4.5 18 8.5 L17.5 10.5 L10.5 10.5 Z" fill={p.accent} />
        <circle cx="14" cy="11" r="3.1" fill={p.color} />
        <path d="M10 14.5 L18 15.5 L16 26 L9 24 Z" fill={p.color} />
        <path d="M9 24 L4 32 M16 26 L18 35" stroke={p.color} strokeWidth="2.6" strokeLinecap="round" />
        <line x1="8" y1="16" x2="30" y2="12" stroke="#94a3b8" strokeWidth="1.9" />
        <line x1="30" y1="12" x2="34" y2="11.2" stroke="#e2e8f0" strokeWidth="1.4" />
        <path d="M14 16 L20 20" stroke={p.accent} strokeWidth="1.3" opacity="0.85" />
      </svg>
    </SpriteShell>
  );
}

// ═══════════════════════════ Registry + banner ═══════════════════════════

const SPRITES: Record<EraId, Record<UnitClass, (p: SpriteProps) => JSX.Element>> = {
  prehistoric: { infantry: AncientInfantry, ranged: AncientRanged, cavalry: AncientCavalry },
  ancient: { infantry: AncientInfantry, ranged: AncientRanged, cavalry: AncientCavalry },
  byzantine: { infantry: MedievalInfantry, ranged: MedievalRanged, cavalry: MedievalCavalry },
  medieval: { infantry: MedievalInfantry, ranged: MedievalRanged, cavalry: MedievalCavalry },
  'early-modern': { infantry: EarlyModernInfantry, ranged: EarlyModernRanged, cavalry: EarlyModernCavalry },
  modern: { infantry: ModernInfantry, ranged: ModernRanged, cavalry: ModernCavalry },
};

export function UnitSprite({ era, cls, ...p }: SpriteProps & { era: EraId; cls: UnitClass }) {
  const Sprite = SPRITES[era][cls];
  return <Sprite {...p} />;
}

/** Army standard: a waving banner in the army's colour, planted at the rear. */
export function ArmyBanner({ color, facing }: { color: string; facing: 1 | -1 }) {
  return (
    <div className="relative shrink-0" style={{ transform: `scaleX(${facing})` }}>
      <svg width="26" height="52" viewBox="0 0 26 52" style={SHADOW}>
        <line x1="4" y1="2" x2="4" y2="50" stroke="#8b8b8b" strokeWidth="1.8" />
        <motion.path
          initial={false}
          animate={{ d: [
            'M4 4 Q14 2 24 6 L24 18 Q14 14 4 17 Z',
            'M4 4 Q14 8 24 4 L24 16 Q14 20 4 17 Z',
            'M4 4 Q14 2 24 6 L24 18 Q14 14 4 17 Z',
          ] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          fill={color}
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="0.8"
        />
        <circle cx="4" cy="2" r="2" fill={color} />
      </svg>
    </div>
  );
}
