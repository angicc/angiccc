import { useEffect, useRef } from 'react';

/**
 * Golden Dust of Time
 * -------------------
 * A subtle, full-screen ambient background: tiny soft-edged gold/amber motes
 * drifting slowly upward and fading out, like dust caught in a shaft of light.
 *
 * Performance notes:
 *  - A single soft radial-gradient "mote" sprite is pre-rendered once to an
 *    offscreen canvas, then blitted per particle with drawImage(). This avoids
 *    allocating a gradient every frame (the usual perf killer for glow dust).
 *  - Particle count scales with viewport area and is hard-capped.
 *  - Honors prefers-reduced-motion (renders a single static frame).
 *  - Pauses the RAF loop while the tab is hidden.
 *  - Device-pixel-ratio aware, clamped to 2 to bound fill cost on retina.
 */

const GOLD = [255, 193, 7]; // #FFC107
const AMBER = [255, 152, 0]; // #FF9800

interface Mote {
  x: number;
  y: number;
  vy: number; // upward drift (negative = up), px/sec
  vx: number; // gentle horizontal sway amplitude driver
  drift: number; // phase for sway
  driftSpeed: number;
  size: number; // sprite draw size in CSS px
  life: number; // 0..1 progress through its fade cycle
  lifeSpeed: number; // per-second life progression
  maxOpacity: number; // 0.05..0.10
  warm: boolean; // gold vs amber tint
}

interface Props {
  className?: string;
  /** Fixed (default, whole-app) or absolute (scoped to a positioned parent). */
  position?: 'fixed' | 'absolute';
  /** Multiply the auto particle count (0..1.5). Keep low; default 1. */
  density?: number;
  /** z-index for the canvas layer. */
  zIndex?: number;
}

function makeSprite(rgb: number[]): HTMLCanvasElement {
  const S = 64;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  // Full-alpha core; the actual opacity is applied via globalAlpha per particle,
  // so the sprite itself just carries the soft falloff shape + colour.
  grad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`);
  grad.addColorStop(0.35, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.55)`);
  grad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  return c;
}

export function GoldenDustOfTime({
  className = '',
  position = 'fixed',
  density = 1,
  zIndex = 0,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const goldSprite = makeSprite(GOLD);
    const amberSprite = makeSprite(AMBER);

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let motes: Mote[] = [];

    function spawn(initial: boolean): Mote {
      const maxOpacity = 0.05 + Math.random() * 0.05; // 5%..10%
      return {
        x: Math.random() * w,
        // On first fill, scatter across the height; afterwards spawn near the bottom.
        y: initial ? Math.random() * h : h + Math.random() * 40,
        vy: -(6 + Math.random() * 14), // slow rise: 6..20 px/sec
        vx: 4 + Math.random() * 8,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.2 + Math.random() * 0.5,
        size: 6 + Math.random() * 16, // tiny soft motes
        life: initial ? Math.random() : 0,
        lifeSpeed: 0.04 + Math.random() * 0.06, // full cycle ~ 10-25s
        maxOpacity,
        warm: Math.random() < 0.5,
      };
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // ~1 mote per 22k px², capped, scaled by density.
      const target = Math.min(90, Math.floor(((w * h) / 22000) * density));
      if (motes.length > target) {
        motes.length = target;
      } else {
        while (motes.length < target) motes.push(spawn(true));
      }
    }

    resize();

    // Soft additive-ish glow; 'lighter' makes overlaps read as a light beam
    // without ever getting bright because per-particle alpha stays ≤ 0.10.
    function drawMote(m: Mote) {
      // Fade in over the first 20% of life, hold, fade out over the last 30%.
      let fade: number;
      if (m.life < 0.2) fade = m.life / 0.2;
      else if (m.life > 0.7) fade = Math.max(0, (1 - m.life) / 0.3);
      else fade = 1;
      const alpha = m.maxOpacity * fade;
      if (alpha <= 0.002) return;
      ctx!.globalAlpha = alpha;
      const sway = Math.sin(m.drift) * m.vx * 0.06;
      const s = m.size;
      ctx!.drawImage(m.warm ? goldSprite : amberSprite, m.x + sway - s / 2, m.y - s / 2, s, s);
    }

    function renderStatic() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = 'lighter';
      for (const m of motes) drawMote(m);
      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = 'source-over';
    }

    if (reduce) {
      renderStatic();
      const onResize = () => {
        resize();
        renderStatic();
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    let animId = 0;
    let last = performance.now();
    let running = true;

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000); // clamp big gaps (tab switch)
      last = now;

      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = 'lighter';

      for (const m of motes) {
        m.y += m.vy * dt;
        m.drift += m.driftSpeed * dt;
        m.life += m.lifeSpeed * dt;
        // Recycle when a mote drifts off the top or completes its fade cycle.
        if (m.y < -m.size || m.life >= 1) {
          Object.assign(m, spawn(false));
        }
        drawMote(m);
      }

      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = 'source-over';
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);

    const onResize = () => resize();
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animId);
      } else if (!running) {
        running = true;
        last = performance.now();
        animId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`${position} inset-0 h-full w-full pointer-events-none ${className}`}
      style={{ zIndex }}
      aria-hidden
    />
  );
}

export default GoldenDustOfTime;
