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
