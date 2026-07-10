// ─────────────────────────────────────────────────────────────────────────────
// Polygon sanitisation for the territory map.
//
// The hand-authored historical boundary rings in `historicalBoundaries.ts` were
// digitised by tracing coordinates by hand. Several of them double back on
// themselves, producing self-intersecting rings that Leaflet renders as ugly
// straight lines slicing across the map (most visibly across the Mediterranean).
//
// A polygon ring is "broken" if any two of its non-adjacent edges cross. The
// only robust, data-independent way to guarantee a clean ring from an arbitrary
// (possibly tangled) set of points is to take its CONVEX HULL — which is, by
// definition, a simple non-self-intersecting polygon. We apply this only to
// rings that are actually broken, so well-formed shapes keep their detail.
// ─────────────────────────────────────────────────────────────────────────────

export type LatLng = [number, number];

// Orientation sign of the ordered triplet (a, b, c).
function cross(a: LatLng, b: LatLng, c: LatLng): number {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

// Do segments p1→p2 and p3→p4 properly cross? (Collinear/endpoint touches are
// intentionally ignored — those are normal for shared polygon vertices.)
function segmentsCross(p1: LatLng, p2: LatLng, p3: LatLng, p4: LatLng): boolean {
  const d1 = cross(p3, p4, p1);
  const d2 = cross(p3, p4, p2);
  const d3 = cross(p1, p2, p3);
  const d4 = cross(p1, p2, p4);
  return (
    ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
  );
}

// Build a closed edge list from a ring (auto-closing it if needed).
function ringEdges(ring: LatLng[]): [LatLng, LatLng][] {
  const r = ring.slice();
  const first = r[0];
  const last = r[r.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) r.push(first);
  const edges: [LatLng, LatLng][] = [];
  for (let i = 0; i < r.length - 1; i++) edges.push([r[i], r[i + 1]]);
  return edges;
}

/** True if the ring has no self-intersections (a "simple" polygon). */
export function isSimpleRing(ring: LatLng[]): boolean {
  if (ring.length < 4) return true;
  const e = ringEdges(ring);
  for (let i = 0; i < e.length; i++) {
    for (let j = i + 1; j < e.length; j++) {
      if (j === i + 1) continue;                 // adjacent edges share a vertex
      if (i === 0 && j === e.length - 1) continue; // closing edge meets the first
      if (segmentsCross(e[i][0], e[i][1], e[j][0], e[j][1])) return false;
    }
  }
  return true;
}

/** Convex hull (Andrew's monotone chain). Returned ring is closed and simple. */
export function convexHull(points: LatLng[]): LatLng[] {
  const pts = points
    .map((p) => [p[0], p[1]] as LatLng)
    .sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
  if (pts.length < 3) return points.slice();

  const half = (src: LatLng[]): LatLng[] => {
    const out: LatLng[] = [];
    for (const p of src) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) {
        out.pop();
      }
      out.push(p);
    }
    out.pop(); // drop the endpoint (shared with the other half)
    return out;
  };

  const lower = half(pts);
  const upper = half(pts.slice().reverse());
  const hull = lower.concat(upper);
  hull.push(hull[0]); // close the ring
  return hull;
}

/**
 * Return a guaranteed-simple version of a ring.
 * Simple rings pass through untouched; broken rings collapse to their convex hull.
 */
export function sanitizeRing(ring: LatLng[]): LatLng[] {
  return isSimpleRing(ring) ? ring : convexHull(ring);
}

// Web-Mercator latitude limit — coordinates beyond it project to infinity and
// draw as broken vectors shooting off the canvas.
const MERCATOR_LAT_LIMIT = 85.05;
const EPS = 1e-9;

/**
 * Normalize raw hand-digitised coordinates into a well-formed OPEN ring:
 *  - drop non-finite points,
 *  - clamp latitude into the Web-Mercator projectable range,
 *  - wrap longitude into [-180, 180],
 *  - collapse consecutive duplicate vertices (zero-length edges),
 *  - strip a redundant closing vertex so downstream passes see an open ring.
 */
export function normalizeRing(ring: LatLng[]): LatLng[] {
  const out: LatLng[] = [];
  for (const p of ring) {
    if (!Array.isArray(p) || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) continue;
    const lat = Math.max(-MERCATOR_LAT_LIMIT, Math.min(MERCATOR_LAT_LIMIT, p[0]));
    let lng = p[1];
    while (lng > 180) lng -= 360;
    while (lng < -180) lng += 360;
    const prev = out[out.length - 1];
    if (prev && Math.abs(prev[0] - lat) < EPS && Math.abs(prev[1] - lng) < EPS) continue;
    out.push([lat, lng]);
  }
  if (out.length > 1) {
    const first = out[0];
    const last = out[out.length - 1];
    if (Math.abs(first[0] - last[0]) < EPS && Math.abs(first[1] - last[1]) < EPS) out.pop();
  }
  return out;
}

/**
 * Chaikin corner-cutting: each pass replaces every vertex with two points at
 * 1/4 and 3/4 along its outgoing edge, rounding hand-traced jagged frontiers
 * into smooth curves while preserving the overall shape. Operates on the ring
 * as a CLOSED loop (the last edge wraps to the first vertex) and returns an
 * explicitly closed ring (first point repeated at the end).
 */
export function chaikinSmooth(ring: LatLng[], iterations = 1): LatLng[] {
  let pts = ring.slice();
  // Work on the open form; closure is re-established at the end.
  if (
    pts.length > 1 &&
    Math.abs(pts[0][0] - pts[pts.length - 1][0]) < EPS &&
    Math.abs(pts[0][1] - pts[pts.length - 1][1]) < EPS
  ) {
    pts.pop();
  }
  for (let it = 0; it < iterations && pts.length >= 3; it++) {
    const next: LatLng[] = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % pts.length]; // wraps: the closing edge is smoothed too
      next.push([0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]]);
      next.push([0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]]);
    }
    pts = next;
  }
  if (pts.length >= 3) pts.push([pts[0][0], pts[0][1]]); // explicit closure
  return pts;
}

/** Explicitly close an open ring (repeat the first vertex at the end). */
function closeRing(pts: LatLng[]): LatLng[] {
  const out = pts.slice();
  const first = out[0];
  const last = out[out.length - 1];
  if (Math.abs(first[0] - last[0]) > EPS || Math.abs(first[1] - last[1]) > EPS) {
    out.push([first[0], first[1]]);
  }
  return out;
}

/**
 * Full geometry rectification pipeline for a territory boundary:
 * normalize → guarantee simplicity → smooth → verify → explicitly close.
 *
 * Chaikin smoothing preserves simplicity for well-behaved rings, but a ring
 * with a near-self-touching passage can have its corner chords pinched into a
 * proper crossing. Every stage's output is therefore re-verified, falling back
 * deterministically: smoothed ring → unsmoothed simple ring → convex hull.
 * Returns [] for degenerate input (fewer than 3 distinct valid vertices), so
 * callers can filter out rings that could never form an area.
 */
export function refineRing(ring: LatLng[]): LatLng[] {
  const normalized = normalizeRing(ring);
  if (normalized.length < 3) return [];
  const simple = sanitizeRing(normalized);
  // Dense rings come from real GIS border data and are already organic —
  // interpolation would only multiply vertices. A SINGLE Chaikin pass takes
  // the hard edge off sparse rings without erasing their character; anything
  // stronger rounds low-vertex kingdom borders into featureless ovals (the
  // "blob" regression this threshold ladder previously caused).
  if (simple.length > 60) {
    const closedDense = closeRing(simple);
    if (isSimpleRing(closedDense)) return closedDense;
  }
  const smoothed = chaikinSmooth(simple, 1);
  if (isSimpleRing(smoothed)) return smoothed;
  const closed = closeRing(simple);
  if (isSimpleRing(closed)) return closed;
  // Last-resort hull: Chaikin on a convex ring always preserves convexity
  // (hence simplicity), so the fallback renders as a rounded organic shape
  // rather than a hard-angled wedge.
  return chaikinSmooth(convexHull(normalized), 3);
}
