// ─── Tactical map layers: chokepoints, telemetry, fog of war, textures ───────
// Pure geometry/data helpers for the Interactive Territory Map. Everything here
// is deterministic — derived from the territory dataset, never randomized — so
// the map renders identically on every visit.
import type { TerritoryTopic, TerritoryPolygon, TerritoryRoute } from '@/features/content/timelineTerritoryData';

// ── Route chokepoint detection ───────────────────────────────────────────────
// A chokepoint is where two supply/trade/military lines cross — the classic
// strategic bottleneck. Computed with a standard segment-intersection test.

type Pt = [number, number]; // [lat, lng]

function segIntersection(p1: Pt, p2: Pt, p3: Pt, p4: Pt): Pt | null {
  const d1x = p2[1] - p1[1], d1y = p2[0] - p1[0];
  const d2x = p4[1] - p3[1], d2y = p4[0] - p3[0];
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-12) return null; // parallel
  const t = ((p3[1] - p1[1]) * d2y - (p3[0] - p1[0]) * d2x) / denom;
  const u = ((p3[1] - p1[1]) * d1y - (p3[0] - p1[0]) * d1x) / denom;
  if (t <= 0.001 || t >= 0.999 || u <= 0.001 || u >= 0.999) return null; // proper crossing only
  return [p1[0] + t * d1y, p1[1] + t * d1x];
}

export interface Chokepoint {
  lat: number;
  lng: number;
  routeA: string;
  routeB: string;
}

/** Intersections between distinct routes — strategic bottlenecks worth pulsing. */
export function computeChokepoints(routes: TerritoryRoute[] | undefined): Chokepoint[] {
  if (!routes || routes.length < 2) return [];
  const found: Chokepoint[] = [];
  for (let a = 0; a < routes.length; a++) {
    for (let b = a + 1; b < routes.length; b++) {
      const A = routes[a].points, B = routes[b].points;
      for (let i = 0; i < A.length - 1; i++) {
        for (let j = 0; j < B.length - 1; j++) {
          const hit = segIntersection(A[i], A[i + 1], B[j], B[j + 1]);
          if (hit) {
            // Skip near-duplicates (routes sharing a hub city cross repeatedly).
            const dup = found.some(c => Math.abs(c.lat - hit[0]) < 1.5 && Math.abs(c.lng - hit[1]) < 1.5);
            if (!dup) found.push({ lat: hit[0], lng: hit[1], routeA: routes[a].name, routeB: routes[b].name });
          }
        }
      }
    }
  }
  return found;
}

// ── Hover-card telemetry ─────────────────────────────────────────────────────
// Region stats derived deterministically from the dataset: marker composition
// stands in for garrison strength / resources; hazards are era-flavored.

export interface RegionTelemetry {
  faction: string;
  garrison: number;      // 0..100 relative strength index
  resources: string[];   // named resource/port outputs inside the claim
  hazard: string;        // era-flavored environmental hazard key (tmap_hazard_*)
  battles: number;
}

const ERA_HAZARD: Record<TerritoryTopic['era'], string> = {
  ancient: 'tmap_hazard_dust',
  medieval: 'tmap_hazard_frost',
  'early-modern': 'tmap_hazard_storm',
  modern: 'tmap_hazard_scorched',
};

function pointInRing(lat: number, lng: number, ring: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [yi, xi] = ring[i], [yj, xj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function deriveTelemetry(topic: TerritoryTopic, poly: TerritoryPolygon): RegionTelemetry {
  const inside = topic.markers.filter(m => pointInRing(m.lat, m.lng, poly.coords));
  const capitals = inside.filter(m => m.type === 'capital').length;
  const cities   = inside.filter(m => m.type === 'city').length;
  const battles  = inside.filter(m => m.type === 'battle').length;
  const resources = inside
    .filter(m => m.type === 'resource' || m.type === 'port')
    .map(m => m.name)
    .slice(0, 3);
  // Garrison index: capitals anchor armies, cities levy troops, battles attrit.
  const garrison = Math.max(5, Math.min(100, 30 + capitals * 30 + cities * 12 - battles * 5));
  return {
    faction: poly.label ?? topic.title,
    garrison,
    resources,
    hazard: ERA_HAZARD[topic.era],
    battles,
  };
}

// ── Fog of war persistence ───────────────────────────────────────────────────

const FOG_KEY = 'historify:map:explored';

export function loadExplored(userId?: string): Set<string> {
  try {
    const raw = localStorage.getItem(userId ? `${FOG_KEY}:${userId}` : FOG_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch { return new Set(); }
}

export function saveExplored(explored: Set<string>, userId?: string) {
  try {
    localStorage.setItem(userId ? `${FOG_KEY}:${userId}` : FOG_KEY, JSON.stringify([...explored]));
  } catch { /* best-effort */ }
}

// ── Annotation persistence ───────────────────────────────────────────────────

export interface MapPin { lat: number; lng: number; label: string }
export interface MapAnnotations { pins: MapPin[]; paths: Pt[][] }

const ANN_KEY = 'historify:map:annotations';

export function loadAnnotations(userId?: string): MapAnnotations {
  try {
    const raw = localStorage.getItem(userId ? `${ANN_KEY}:${userId}` : ANN_KEY);
    const parsed = raw ? (JSON.parse(raw) as MapAnnotations) : null;
    if (parsed && Array.isArray(parsed.pins) && Array.isArray(parsed.paths)) return parsed;
  } catch { /* fallthrough */ }
  return { pins: [], paths: [] };
}

export function saveAnnotations(ann: MapAnnotations, userId?: string) {
  try {
    localStorage.setItem(userId ? `${ANN_KEY}:${userId}` : ANN_KEY, JSON.stringify(ann));
  } catch { /* best-effort */ }
}

// ── Era texture (biome-sensitive shading) ────────────────────────────────────
// Each era gets a subtle fractal-noise texture pattern tinted to its biome
// mood: sun-baked dust for Ancient, cold frost for Medieval, sea-storm teal
// for Early Modern, scorched ash for Modern. Rendered as an SVG <pattern>
// containing an feTurbulence-filtered tile; polygons draw a second overlay
// ring filled with the pattern so the base radial gradient still shows through.

export interface EraTexture {
  id: string;
  baseFrequency: number;
  tint: string;
  opacity: number;
}

export const ERA_TEXTURES: Record<TerritoryTopic['era'], EraTexture> = {
  ancient:        { id: 'hft-ancient',  baseFrequency: 0.9,  tint: '#d4a24c', opacity: 0.10 },
  medieval:       { id: 'hft-medieval', baseFrequency: 0.7,  tint: '#9db8e8', opacity: 0.09 },
  'early-modern': { id: 'hft-early',    baseFrequency: 0.55, tint: '#5eead4', opacity: 0.08 },
  modern:         { id: 'hft-modern',   baseFrequency: 1.1,  tint: '#f87171', opacity: 0.07 },
};

/** Idempotently inject the era's noise <pattern> into the overlay SVG defs. */
export function ensureEraTexturePattern(svg: SVGElement, tex: EraTexture): string {
  const patternId = `${tex.id}-pattern`;
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.prepend(defs);
  }
  if (!defs.querySelector(`#${patternId}`)) {
    const NS = 'http://www.w3.org/2000/svg';
    const filter = document.createElementNS(NS, 'filter');
    filter.setAttribute('id', `${tex.id}-noise`);
    filter.setAttribute('x', '0'); filter.setAttribute('y', '0');
    filter.setAttribute('width', '100%'); filter.setAttribute('height', '100%');
    const turb = document.createElementNS(NS, 'feTurbulence');
    turb.setAttribute('type', 'fractalNoise');
    turb.setAttribute('baseFrequency', String(tex.baseFrequency));
    turb.setAttribute('numOctaves', '2');
    turb.setAttribute('seed', '7');
    turb.setAttribute('stitchTiles', 'stitch');
    const matrix = document.createElementNS(NS, 'feColorMatrix');
    matrix.setAttribute('type', 'matrix');
    // Collapse RGB to luminance-driven alpha so only the tint color shows.
    matrix.setAttribute('values', '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.6 0.6 0.6 0 0');
    const flood = document.createElementNS(NS, 'feFlood');
    flood.setAttribute('flood-color', tex.tint);
    const composite = document.createElementNS(NS, 'feComposite');
    composite.setAttribute('operator', 'in');
    composite.setAttribute('in2', 'matrixOut');
    matrix.setAttribute('result', 'matrixOut');
    filter.append(turb, matrix, flood, composite);

    const pattern = document.createElementNS(NS, 'pattern');
    pattern.setAttribute('id', patternId);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', '160');
    pattern.setAttribute('height', '160');
    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('width', '160');
    rect.setAttribute('height', '160');
    rect.setAttribute('filter', `url(#${tex.id}-noise)`);
    pattern.appendChild(rect);

    defs.append(filter, pattern);
  }
  return patternId;
}
