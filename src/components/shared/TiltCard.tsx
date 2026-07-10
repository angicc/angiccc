// ─── TiltCard: premium 3D tilt/parallax wrapper ──────────────────────────────
// Pointer-tracked perspective tilt with spring physics and a moving specular
// glare, built on CSS 3D transforms + Framer Motion springs — hardware
// accelerated, zero WebGL overhead, zero new dependencies, and inert under
// prefers-reduced-motion. Wrap any card; children keep their own layout.
import { type ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * The house spring: weightless-but-grounded. Low mass keeps response
 * immediate, high-ish damping kills oscillation so nothing feels rubbery.
 */
export const PREMIUM_SPRING = { stiffness: 260, damping: 22, mass: 0.9 } as const;

/** Softer variant for large surfaces (hero panels, dashboards). */
export const PANEL_SPRING = { stiffness: 170, damping: 26, mass: 1.1 } as const;

export function TiltCard({
  children,
  className,
  maxTilt = 7,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  /** Peak rotation in degrees on each axis. Keep ≤ 10 for a professional feel. */
  maxTilt?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Normalized pointer position across the card, -0.5..0.5 on each axis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, PREMIUM_SPRING);
  const sy = useSpring(py, PREMIUM_SPRING);

  const rotateX = useTransform(sy, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const glareX = useTransform(sx, [-0.5, 0.5], ['20%', '80%']);
  const glareY = useTransform(sy, [-0.5, 0.5], ['15%', '85%']);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(320px circle at ${gx} ${gy}, rgba(255,255,255,0.10), transparent 65%)`,
  );

  function onPointerMove(e: React.PointerEvent) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onPointerLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      transition={{ type: 'spring', ...PREMIUM_SPRING }}
    >
      {children}
      {glare && !reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}
