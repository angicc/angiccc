// Procedural, era-specific SVG backdrop for lesson banners. Rendered only
// when every real image candidate fails — each era gets its own geometric
// motif and palette so the fallback still reads as designed, not broken.

interface EraStyle {
  base: string;      // deep background tone
  accent: string;    // motif stroke color
  glow: string;      // radial highlight
}

const ERA_STYLES: Record<string, EraStyle> = {
  ancient:        { base: '#1c1204', accent: '#d4a24c', glow: '#f59e0b' },
  'middle-ages':  { base: '#0a1226', accent: '#7ea4dd', glow: '#3b82f6' },
  'early-modern': { base: '#04201a', accent: '#5eead4', glow: '#10b981' },
  modern:         { base: '#20060c', accent: '#fb8fa5', glow: '#f43f5e' },
};

// One motif tile per era: ziggurat steps + sun rays (ancient), gothic arches
// (medieval), compass rose (early modern), circuit grid (modern).
function motif(eraId: string, accent: string) {
  switch (eraId) {
    case 'middle-ages':
      return (
        <g stroke={accent} strokeWidth="0.8" fill="none">
          <path d="M10 80 V40 A20 26 0 0 1 50 40 V80" />
          <path d="M50 80 V40 A20 26 0 0 1 90 40 V80" />
          <path d="M30 34 L30 22 L34 26 M30 22 L26 26" strokeWidth="0.6" />
          <circle cx="70" cy="26" r="5" strokeWidth="0.6" />
          <path d="M67 26 h6 M70 23 v6" strokeWidth="0.5" />
        </g>
      );
    case 'early-modern':
      return (
        <g stroke={accent} strokeWidth="0.8" fill="none">
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="22" strokeWidth="0.5" />
          <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" />
          <path d="M50 28 V20 M50 80 V72 M28 50 H20 M80 50 H72" strokeWidth="0.5" />
        </g>
      );
    case 'modern':
      return (
        <g stroke={accent} strokeWidth="0.8" fill="none">
          <path d="M10 90 V50 H30 V70 H50 V30 H70 V60 H90 V90" />
          <circle cx="30" cy="50" r="1.6" fill={accent} stroke="none" />
          <circle cx="70" cy="30" r="1.6" fill={accent} stroke="none" />
          <path d="M10 20 H40 M60 15 H90" strokeWidth="0.5" strokeDasharray="3 4" />
        </g>
      );
    default: // ancient
      return (
        <g stroke={accent} strokeWidth="0.8" fill="none">
          <path d="M20 80 H80 M28 70 H72 M36 60 H64 M44 50 H56" />
          <path d="M20 80 L28 70 M80 80 L72 70 M28 70 L36 60 M72 70 L64 60 M36 60 L44 50 M64 60 L56 50" strokeWidth="0.6" />
          <circle cx="50" cy="26" r="8" strokeWidth="0.7" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 11} y1={26 + Math.sin(a) * 11}
                x2={50 + Math.cos(a) * 15} y2={26 + Math.sin(a) * 15}
                strokeWidth="0.6"
              />
            );
          })}
        </g>
      );
  }
}

export function EraBannerBackdrop({ eraId }: { eraId: string }) {
  const style = ERA_STYLES[eraId] ?? ERA_STYLES.ancient;
  const patternId = `era-motif-${eraId}`;
  const glowId = `era-glow-${eraId}`;
  return (
    <svg className="absolute inset-0 w-full h-full z-[2]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id={glowId} cx="25%" cy="30%" r="80%">
          <stop offset="0%" stopColor={style.glow} stopOpacity="0.22" />
          <stop offset="55%" stopColor={style.glow} stopOpacity="0.06" />
          <stop offset="100%" stopColor={style.base} stopOpacity="0" />
        </radialGradient>
        <pattern id={patternId} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          {motif(eraId, style.accent)}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={style.base} />
      <rect width="100%" height="100%" fill={`url(#${patternId})`} opacity="0.16" />
      <rect width="100%" height="100%" fill={`url(#${glowId})`} />
    </svg>
  );
}
