// ─── Gilded Aurora backdrop ──────────────────────────────────────────────────
// A slow, low-opacity wash of drifting gilded/violet nebulae that sits beneath
// the app's content (above the base canvas, below the star chart and particles).
// Pure CSS animation — no canvas, no JS loop — and fully disabled under
// prefers-reduced-motion via the keyframe guards in index.css.

export function AuroraBackdrop({ zIndex = 0 }: { zIndex?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex }}
    >
      <div
        className="aurora-blob aurora-a"
        style={{ top: '-14%', left: '-10%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(212,175,55,0.16), transparent 68%)' }}
      />
      <div
        className="aurora-blob aurora-b"
        style={{ top: '18%', right: '-14%', width: '48vw', height: '48vw', background: 'radial-gradient(circle, rgba(139,92,246,0.14), transparent 70%)' }}
      />
      <div
        className="aurora-blob aurora-c"
        style={{ bottom: '-18%', left: '22%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(56,189,248,0.10), transparent 72%)' }}
      />
    </div>
  );
}
