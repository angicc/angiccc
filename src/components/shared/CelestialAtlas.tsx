import { useEffect, useRef } from 'react';

/**
 * Celestial Atlas
 * ---------------
 * The app's ambient background theme: a deep-space star chart as the ancients
 * drew them. Three layers on one canvas:
 *   1. A slow-drifting parallax starfield (two depths, pre-rendered sprites).
 *   2. Faint "constellation" clusters — a handful of brighter stars joined by
 *      hairline chords that fade in and out over ~20s cycles, like an antique
 *      celestial map surfacing from the dark.
 *   3. A very slow aurora sweep — a soft violet-to-gold gradient blob gliding
 *      across the far field once every ~90s.
 *
 * Performance contract (same discipline as the previous Golden Dust theme):
 *  - Star sprites are pre-rendered once to offscreen canvases and blitted.
 *  - Counts scale with viewport area and are hard-capped.
 *  - Honors prefers-reduced-motion (renders one static frame, no RAF loop).
 *  - Pauses while the tab is hidden; DPR clamped to 2.
 */

interface Star {
  x: number; y: number;
  depth: number;        // 0.35 (far) or 1 (near) — parallax factor
  size: number;
  twinklePhase: number;
  twinkleSpeed: number;
  baseOpacity: number;
  warm: boolean;        // a few stars glint gold; most burn cool violet-white
}

interface Constellation {
  stars: { x: number; y: number }[]; // normalized 0..1 within its bounding box
  cx: number; cy: number; scale: number;
  phase: number;        // fade cycle offset
}

interface Props {
  className?: string;
  position?: 'fixed' | 'absolute';
  density?: number;
  zIndex?: number;
}

// A few real northern-sky shapes, roughly traced (normalized coordinates).
const SHAPES: { x: number; y: number }[][] = [
  // Cassiopeia — the W
  [{ x: 0, y: 0.55 }, { x: 0.25, y: 0.2 }, { x: 0.5, y: 0.5 }, { x: 0.75, y: 0.05 }, { x: 1, y: 0.35 }],
  // Ursa Minor — the little dipper's ladle and handle
  [{ x: 0, y: 0.1 }, { x: 0.22, y: 0.28 }, { x: 0.42, y: 0.5 }, { x: 0.6, y: 0.72 }, { x: 0.85, y: 0.66 }, { x: 1, y: 0.9 }, { x: 0.72, y: 0.95 }],
  // Cygnus — the northern cross
  [{ x: 0.5, y: 0 }, { x: 0.5, y: 0.45 }, { x: 0.5, y: 1 }, { x: 0.5, y: 0.45 }, { x: 0, y: 0.6 }, { x: 0.5, y: 0.45 }, { x: 1, y: 0.3 }],
];

export function CelestialAtlas({ className = '', position = 'fixed', density = 1, zIndex = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let stars: Star[] = [];
    let constellations: Constellation[] = [];
    let raf = 0;
    let last = performance.now();
    let running = true;

    // Pre-rendered sprites: cool star, warm star (16px glow discs).
    const makeSprite = (r: number, g: number, b: number) => {
      const s = document.createElement('canvas');
      s.width = s.height = 32;
      const c = s.getContext('2d')!;
      const grad = c.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
      grad.addColorStop(0.35, `rgba(${r},${g},${b},0.35)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      c.fillStyle = grad;
      c.fillRect(0, 0, 32, 32);
      return s;
    };
    const coolSprite = makeSprite(196, 181, 253);  // violet-white
    const warmSprite = makeSprite(251, 191, 36);   // gold glint

    const seed = () => {
      const area = (w * h) / (1280 * 800);
      const count = Math.min(170, Math.round(120 * area * density));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        depth: Math.random() < 0.6 ? 0.35 : 1,
        size: 1 + Math.random() * 2.2,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.3 + Math.random() * 0.8,
        baseOpacity: 0.05 + Math.random() * 0.12,
        warm: Math.random() < 0.14,
      }));
      const n = w < 640 ? 2 : 3;
      constellations = Array.from({ length: n }, (_, i) => ({
        stars: SHAPES[i % SHAPES.length],
        cx: (0.15 + 0.7 * Math.random()) * w,
        cy: (0.12 + 0.6 * Math.random()) * h,
        scale: Math.min(w, h) * (0.14 + Math.random() * 0.08),
        phase: (i / n) * Math.PI * 2,
      }));
    };

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);

      // Aurora sweep — one soft blob gliding across, ~90s period.
      const sweep = (t / 90000) % 1;
      const ax = (-0.25 + sweep * 1.5) * w;
      const ay = h * (0.22 + 0.12 * Math.sin(t / 31000));
      const ar = Math.max(w, h) * 0.5;
      const aurora = ctx.createRadialGradient(ax, ay, 0, ax, ay, ar);
      aurora.addColorStop(0, 'rgba(124, 58, 237, 0.05)');
      aurora.addColorStop(0.5, 'rgba(217, 165, 74, 0.025)');
      aurora.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = aurora;
      ctx.fillRect(0, 0, w, h);

      // Starfield, drifting very slowly westward with parallax.
      for (const s of stars) {
        s.x -= (dt / 1000) * 1.6 * s.depth;
        if (s.x < -8) { s.x = w + 8; s.y = Math.random() * h; }
        s.twinklePhase += (dt / 1000) * s.twinkleSpeed;
        const tw = 0.75 + 0.25 * Math.sin(s.twinklePhase);
        ctx.globalAlpha = s.baseOpacity * tw;
        const sprite = s.warm ? warmSprite : coolSprite;
        const d = s.size * 6;
        ctx.drawImage(sprite, s.x - d / 2, s.y - d / 2, d, d);
      }

      // Constellations — chords + node stars, breathing on ~20s cycles.
      for (const c of constellations) {
        const vis = 0.5 + 0.5 * Math.sin(t / 20000 + c.phase);
        const alpha = 0.03 + vis * 0.06;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = 'rgba(196, 181, 253, 1)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        c.stars.forEach((p, i) => {
          const px = c.cx + p.x * c.scale;
          const py = c.cy + p.y * c.scale;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.globalAlpha = alpha * 2.2;
        for (const p of c.stars) {
          const px = c.cx + p.x * c.scale;
          const py = c.cy + p.y * c.scale;
          ctx.drawImage(coolSprite, px - 5, py - 5, 10, 10);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(50, now - last);
      last = now;
      draw(now, dt);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!reduced) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    };

    resize();
    if (reduced) {
      draw(20000, 16); // single static frame
    } else {
      raf = requestAnimationFrame(loop);
      document.addEventListener('visibilitychange', onVisibility);
    }
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`${position === 'fixed' ? 'fixed' : 'absolute'} inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex }}
    />
  );
}
