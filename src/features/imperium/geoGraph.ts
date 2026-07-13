// ─── CHRONOS IMPERIUM · Part A: Strategic GeoJSON Network Graph ──────────────
// Converts the Territory Map's live polygon layers into an interconnected node
// web for army pathfinding. Every polygon contributes its centroid plus a ring
// of boundary waypoints; edges connect nodes within the same territory, across
// shared frontiers (detected by minimum inter-ring vertex distance), and over
// sea lanes (higher traversal cost, storm-risk weighting). A modified A* runs
// over this geographic space with a haversine heuristic and terrain-weighted
// edge costs — mountains slow columns, rivers tax crossings, open sea demands
// fleets. The graph is rebuilt deterministically from the same territory data
// the map renders, so strategy and cartography can never disagree.
import { TERRITORY_TOPICS, type TerritoryTopic } from '@/features/content/timelineTerritoryData';

export type TerrainKind = 'plain' | 'mountain' | 'river' | 'coast' | 'sea' | 'desert';

export interface GeoNode {
  id: string;
  territoryId: string;      // owning territory topic id
  lat: number;
  lng: number;
  kind: 'centroid' | 'waypoint' | 'port';
  terrain: TerrainKind;
}

export interface GeoEdge {
  a: string;                 // node id
  b: string;                 // node id
  km: number;                // great-circle distance
  terrain: TerrainKind;      // dominant terrain of the traversal
  cost: number;              // km × terrain multiplier (precomputed)
  sea: boolean;              // requires embarkation
}

export interface GeoGraph {
  nodes: Map<string, GeoNode>;
  /** adjacency: node id → edges leaving it */
  adj: Map<string, GeoEdge[]>;
  /** territory id → its centroid node id */
  centroids: Map<string, string>;
  territoryIds: string[];
}

// ── Geographic primitives ─────────────────────────────────────────────────────

const EARTH_R = 6371;

export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** Arithmetic centroid of a lat/lng ring — adequate at territory scale. */
export function ringCentroid(ring: [number, number][]): [number, number] {
  let lat = 0, lng = 0;
  for (const [la, ln] of ring) { lat += la; lng += ln; }
  return [lat / ring.length, lng / ring.length];
}

/** Minimum vertex-to-vertex distance between two rings (frontier detector). */
function minRingDistance(a: [number, number][], b: [number, number][]): number {
  let min = Infinity;
  // Sample rings (every 3rd vertex) — exactness is unnecessary for adjacency.
  for (let i = 0; i < a.length; i += 3) {
    for (let j = 0; j < b.length; j += 3) {
      const d = haversineKm(a[i][0], a[i][1], b[j][0], b[j][1]);
      if (d < min) min = d;
    }
  }
  return min;
}

// ── Terrain classification ────────────────────────────────────────────────────
// Deterministic geographic boxes for the major terrain features of the mapped
// world: mountain chains, great rivers, and desert belts. An edge picks up the
// costliest terrain its midpoint falls in; anything crossing >150 km of water
// between territories is a sea lane.

interface TerrainZone { kind: TerrainKind; latMin: number; latMax: number; lngMin: number; lngMax: number; name: string }

export const TERRAIN_ZONES: TerrainZone[] = [
  { kind: 'mountain', latMin: 42, latMax: 48, lngMin: 5, lngMax: 16, name: 'Alps' },
  { kind: 'mountain', latMin: 39, latMax: 43, lngMin: -6, lngMax: 3, name: 'Pyrenees–Iberian ranges' },
  { kind: 'mountain', latMin: 34, latMax: 40, lngMin: 43, lngMax: 54, name: 'Zagros' },
  { kind: 'mountain', latMin: 36, latMax: 41, lngMin: 26, lngMax: 45, name: 'Taurus–Anatolian plateau' },
  { kind: 'mountain', latMin: 27, latMax: 37, lngMin: 60, lngMax: 75, name: 'Hindu Kush' },
  { kind: 'mountain', latMin: 41, latMax: 44, lngMin: 19, lngMax: 26, name: 'Balkan ranges' },
  { kind: 'desert',   latMin: 18, latMax: 30, lngMin: -10, lngMax: 35, name: 'Sahara' },
  { kind: 'desert',   latMin: 20, latMax: 30, lngMin: 38, lngMax: 55, name: 'Arabian desert' },
  { kind: 'desert',   latMin: 36, latMax: 42, lngMin: 78, lngMax: 95, name: 'Taklamakan' },
  { kind: 'river',    latMin: 29, latMax: 37, lngMin: 38, lngMax: 48, name: 'Tigris–Euphrates' },
  { kind: 'river',    latMin: 22, latMax: 31, lngMin: 30, lngMax: 33, name: 'Nile valley' },
  { kind: 'river',    latMin: 43, latMax: 49, lngMin: 8, lngMax: 29, name: 'Danube' },
  { kind: 'river',    latMin: 30, latMax: 35, lngMin: 110, lngMax: 122, name: 'Yangtze' },
];

// Water gaps big enough that armies must take ship. Deterministic sea lanes of
// the historical world; an edge whose midpoint lies inside is maritime.
const SEA_BOXES: TerrainZone[] = [
  { kind: 'sea', latMin: 30, latMax: 46, lngMin: -6, lngMax: 36, name: 'Mediterranean' },
  { kind: 'sea', latMin: 50, latMax: 62, lngMin: -12, lngMax: 10, name: 'North Sea' },
  { kind: 'sea', latMin: 53, latMax: 66, lngMin: 10, lngMax: 30, name: 'Baltic' },
  { kind: 'sea', latMin: 12, latMax: 30, lngMin: 32, lngMax: 44, name: 'Red Sea' },
  { kind: 'sea', latMin: 20, latMax: 30, lngMin: 48, lngMax: 70, name: 'Arabian Sea approaches' },
  { kind: 'sea', latMin: 30, latMax: 42, lngMin: 122, lngMax: 142, name: 'East China Sea' },
  { kind: 'sea', latMin: -5, latMax: 25, lngMin: -85, lngMax: -30, name: 'Atlantic (colonial lanes)' },
];

export const TERRAIN_COST: Record<TerrainKind, number> = {
  plain: 1.0,
  coast: 1.05,
  river: 1.35,   // bridging/fording tax
  desert: 1.7,
  mountain: 2.2,
  sea: 2.8,      // embark, weather risk, disembark
};

function zoneAt(lat: number, lng: number, zones: TerrainZone[]): TerrainZone | null {
  for (const z of zones) {
    if (lat >= z.latMin && lat <= z.latMax && lng >= z.lngMin && lng <= z.lngMax) return z;
  }
  return null;
}

export function classifyTerrain(lat: number, lng: number): TerrainKind {
  return zoneAt(lat, lng, TERRAIN_ZONES)?.kind ?? 'plain';
}

function edgeTerrain(aLat: number, aLng: number, bLat: number, bLng: number, crossTerritory: boolean, km: number): { terrain: TerrainKind; sea: boolean } {
  const mLat = (aLat + bLat) / 2;
  const mLng = (aLng + bLng) / 2;
  // Long cross-territory hops through a sea box are maritime lanes.
  if (crossTerritory && km > 150 && zoneAt(mLat, mLng, SEA_BOXES)) return { terrain: 'sea', sea: true };
  const land = zoneAt(mLat, mLng, TERRAIN_ZONES);
  if (land) return { terrain: land.kind, sea: false };
  return { terrain: 'plain', sea: false };
}

// ── Graph construction ────────────────────────────────────────────────────────

export interface GraphOptions {
  /** Max frontier gap (km) for two territories to count as adjacent. */
  adjacencyKm?: number;
  /** Boundary waypoints sampled per polygon ring. */
  waypointsPerRing?: number;
  /** Restrict to one era's territories (a campaign theatre). */
  era?: TerritoryTopic['era'];
}

/**
 * Build the strategic node web from the live territory data. Deterministic:
 * same input topics → identical graph, so client and any authoritative server
 * instance derive matching topology without shipping it over the wire.
 */
export function buildGeoGraph(opts: GraphOptions = {}): GeoGraph {
  const { adjacencyKm = 260, waypointsPerRing = 6, era } = opts;
  const topics = TERRITORY_TOPICS.filter(tp => (era ? tp.era === era : true) && tp.polygons?.length);

  const nodes = new Map<string, GeoNode>();
  const adj = new Map<string, GeoEdge[]>();
  const centroids = new Map<string, string>();
  const ringsByTerritory = new Map<string, [number, number][]>();

  const pushEdge = (a: GeoNode, b: GeoNode, crossTerritory: boolean) => {
    const km = haversineKm(a.lat, a.lng, b.lat, b.lng);
    const { terrain, sea } = edgeTerrain(a.lat, a.lng, b.lat, b.lng, crossTerritory, km);
    const cost = km * TERRAIN_COST[terrain];
    const e: GeoEdge = { a: a.id, b: b.id, km, terrain, cost, sea };
    (adj.get(a.id) ?? adj.set(a.id, []).get(a.id)!).push(e);
    (adj.get(b.id) ?? adj.set(b.id, []).get(b.id)!).push({ ...e, a: b.id, b: a.id });
  };

  // 1. Nodes: centroid + sampled boundary waypoints per territory.
  for (const tp of topics) {
    const ring = tp.polygons![0].coords; // primary ring defines the territory body
    ringsByTerritory.set(tp.id, ring);
    const [cLat, cLng] = ringCentroid(ring);
    const centroid: GeoNode = {
      id: `${tp.id}::c`,
      territoryId: tp.id,
      lat: cLat, lng: cLng,
      kind: 'centroid',
      terrain: classifyTerrain(cLat, cLng),
    };
    nodes.set(centroid.id, centroid);
    centroids.set(tp.id, centroid.id);

    const step = Math.max(1, Math.floor(ring.length / waypointsPerRing));
    const ringNodes: GeoNode[] = [];
    for (let i = 0; i < ring.length; i += step) {
      const [lat, lng] = ring[i];
      const isPort = zoneAt(lat, lng, SEA_BOXES) !== null || classifyTerrain(lat, lng) === 'coast';
      const wp: GeoNode = {
        id: `${tp.id}::w${i}`,
        territoryId: tp.id,
        lat, lng,
        kind: isPort ? 'port' : 'waypoint',
        terrain: classifyTerrain(lat, lng),
      };
      nodes.set(wp.id, wp);
      ringNodes.push(wp);
      pushEdge(centroid, wp, false); // spoke
    }
    // rim edges between consecutive waypoints
    for (let i = 0; i < ringNodes.length; i++) {
      pushEdge(ringNodes[i], ringNodes[(i + 1) % ringNodes.length], false);
    }
  }

  // 2. Inter-territory frontiers: connect nearest waypoint pairs of adjacent
  //    territory rings; every territory keeps at least one outward link (its
  //    nearest neighbour) so the web is never disconnected.
  const ids = topics.map(tp => tp.id);
  for (let i = 0; i < ids.length; i++) {
    let nearest: { j: number; d: number } | null = null;
    for (let j = 0; j < ids.length; j++) {
      if (i === j) continue;
      const d = minRingDistance(ringsByTerritory.get(ids[i])!, ringsByTerritory.get(ids[j])!);
      if (!nearest || d < nearest.d) nearest = { j, d };
      if (j > i && d <= adjacencyKm) connectFrontier(ids[i], ids[j]);
    }
    if (nearest && nearest.d > adjacencyKm && i < nearest.j) connectFrontier(ids[i], ids[nearest.j]);
  }

  function connectFrontier(ta: string, tb: string) {
    // nearest waypoint pair across the frontier
    const wa = [...nodes.values()].filter(n => n.territoryId === ta && n.kind !== 'centroid');
    const wb = [...nodes.values()].filter(n => n.territoryId === tb && n.kind !== 'centroid');
    let best: { a: GeoNode; b: GeoNode; d: number } | null = null;
    for (const na of wa) {
      for (const nb of wb) {
        const d = haversineKm(na.lat, na.lng, nb.lat, nb.lng);
        if (!best || d < best.d) best = { a: na, b: nb, d };
      }
    }
    if (best) pushEdge(best.a, best.b, true);
  }

  return { nodes, adj, centroids, territoryIds: ids };
}

// ── Modified A* over geographic space ─────────────────────────────────────────

export interface PathOptions {
  /** Territories hostile to the mover — entering costs extra; blocked if true. */
  hostile?: Set<string>;
  /** Hard-block hostile territory instead of taxing it. */
  blockHostile?: boolean;
  /** Extra multiplier applied to hostile-territory edges when not blocked. */
  hostilePenalty?: number;
  /** Armies without fleet support cannot take sea lanes. */
  canSail?: boolean;
}

export interface GeoPath {
  nodeIds: string[];
  km: number;
  cost: number;
  seaLegs: number;
  terrains: TerrainKind[];
}

/**
 * A* from node to node. The heuristic is pure haversine (admissible: every
 * terrain multiplier ≥ 1), so returned paths are optimal for the cost model.
 */
export function findPath(graph: GeoGraph, fromId: string, toId: string, opts: PathOptions = {}): GeoPath | null {
  const { hostile = new Set(), blockHostile = false, hostilePenalty = 1.8, canSail = true } = opts;
  const goal = graph.nodes.get(toId);
  const start = graph.nodes.get(fromId);
  if (!start || !goal) return null;

  const h = (id: string) => {
    const n = graph.nodes.get(id)!;
    return haversineKm(n.lat, n.lng, goal.lat, goal.lng);
  };

  const open = new Map<string, number>([[fromId, h(fromId)]]); // id → f
  const g = new Map<string, number>([[fromId, 0]]);
  const km = new Map<string, number>([[fromId, 0]]);
  const came = new Map<string, string>();
  const closed = new Set<string>();

  while (open.size > 0) {
    // extract-min (graph is small enough that a heap is not worth the code)
    let current = '';
    let bestF = Infinity;
    for (const [id, f] of open) if (f < bestF) { bestF = f; current = id; }
    open.delete(current);
    if (current === toId) break;
    closed.add(current);

    for (const e of graph.adj.get(current) ?? []) {
      if (closed.has(e.b)) continue;
      if (e.sea && !canSail) continue;
      const destNode = graph.nodes.get(e.b)!;
      const isHostile = hostile.has(destNode.territoryId);
      if (isHostile && blockHostile) continue;
      const stepCost = e.cost * (isHostile ? hostilePenalty : 1);
      const tentative = (g.get(current) ?? Infinity) + stepCost;
      if (tentative < (g.get(e.b) ?? Infinity)) {
        came.set(e.b, current);
        g.set(e.b, tentative);
        km.set(e.b, (km.get(current) ?? 0) + e.km);
        open.set(e.b, tentative + h(e.b));
      }
    }
  }

  if (!came.has(toId) && fromId !== toId) return null;

  const nodeIds: string[] = [toId];
  let cur = toId;
  while (cur !== fromId) {
    cur = came.get(cur)!;
    nodeIds.unshift(cur);
  }
  const terrains: TerrainKind[] = [];
  let seaLegs = 0;
  for (let i = 0; i < nodeIds.length - 1; i++) {
    const e = (graph.adj.get(nodeIds[i]) ?? []).find(x => x.b === nodeIds[i + 1]);
    if (e) {
      terrains.push(e.terrain);
      if (e.sea) seaLegs += 1;
    }
  }
  return { nodeIds, km: km.get(toId) ?? 0, cost: g.get(toId) ?? 0, seaLegs, terrains };
}

/** Path between two territories, centroid to centroid. */
export function findTerritoryPath(graph: GeoGraph, fromTerritory: string, toTerritory: string, opts?: PathOptions): GeoPath | null {
  const a = graph.centroids.get(fromTerritory);
  const b = graph.centroids.get(toTerritory);
  if (!a || !b) return null;
  return findPath(graph, a, b, opts);
}

/** Territories directly reachable (one frontier hop) from a territory. */
export function neighbourTerritories(graph: GeoGraph, territoryId: string): string[] {
  const out = new Set<string>();
  for (const [id, node] of graph.nodes) {
    if (node.territoryId !== territoryId) continue;
    for (const e of graph.adj.get(id) ?? []) {
      const dest = graph.nodes.get(e.b)!;
      if (dest.territoryId !== territoryId) out.add(dest.territoryId);
    }
  }
  return [...out];
}
