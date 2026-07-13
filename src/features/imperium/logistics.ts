// ─── CHRONOS IMPERIUM · Part A (cont.): Logistics & Attrition Matrix ─────────
// Continuous mathematical checks over every army's vector line. Each tick:
//   1. Armies advance along their A* path by movement allowance (terrain-taxed).
//   2. Supply corridors re-trace from each faction's supply hubs through
//      friendly territory; any army whose corridor is bisected — an enemy
//      polygon captured a connecting node — flips to ISOLATED.
//   3. Isolation compounds: attrition per tick grows the longer the pocket
//      holds (starvation curves, not flat percentages), scaled by terrain.
// Also home of the Vector State Interceptor: timeline-slider manipulations
// translate into ownership-array shifts according to scenario year fences.
import {
  type GeoGraph, type GeoPath, findTerritoryPath, neighbourTerritories, TERRAIN_COST, type TerrainKind,
} from './geoGraph';

export type FactionId = 'player' | 'rival';

export interface Army {
  id: string;
  faction: FactionId;
  /** Current territory (node-web anchor). */
  territoryId: string;
  strength: number;        // 0–100 fighting power
  morale: number;          // 0–100
  supplied: boolean;
  isolationTicks: number;  // consecutive ticks without a supply corridor
  /** Active movement order, if marching. */
  march?: {
    path: GeoPath;
    targetTerritoryId: string;
    /** Index into path.nodeIds of the last node reached. */
    progress: number;
  };
}

export interface OwnershipState {
  /** territoryId → faction that holds it (absent = neutral). */
  owners: Record<string, FactionId>;
  /** Faction supply hubs (territory ids). Losing every hub is catastrophic. */
  hubs: Record<FactionId, string[]>;
}

export interface LogisticsReport {
  armyId: string;
  supplied: boolean;
  isolationTicks: number;
  attrition: number;         // strength lost this tick
  moraleDecay: number;
  corridor: string[] | null; // territory chain to the nearest hub, if any
}

// ── Supply corridor tracing ───────────────────────────────────────────────────

/**
 * BFS through friendly-or-neutral territories from the army's position to any
 * faction hub. An enemy-held territory is an impassable bisection — exactly
 * the "enemy polygon captured a connecting node" isolation trigger.
 */
export function traceSupplyCorridor(
  graph: GeoGraph,
  ownership: OwnershipState,
  faction: FactionId,
  fromTerritory: string,
): string[] | null {
  const hubs = new Set(ownership.hubs[faction] ?? []);
  if (hubs.size === 0) return null;
  if (hubs.has(fromTerritory)) return [fromTerritory];

  const enemy: FactionId = faction === 'player' ? 'rival' : 'player';
  const visited = new Set<string>([fromTerritory]);
  const queue: string[][] = [[fromTerritory]];

  while (queue.length > 0) {
    const chain = queue.shift()!;
    const tail = chain[chain.length - 1];
    for (const next of neighbourTerritories(graph, tail)) {
      if (visited.has(next)) continue;
      if (ownership.owners[next] === enemy) continue; // bisected here
      visited.add(next);
      const extended = [...chain, next];
      if (hubs.has(next)) return extended;
      queue.push(extended);
    }
  }
  return null;
}

// ── Attrition model ───────────────────────────────────────────────────────────

export interface AttritionTuning {
  /** Baseline strength loss per isolated tick. */
  base: number;
  /** Compounding growth per consecutive isolated tick. */
  compound: number;
  /** Terrain multiplier applied to attrition (deserts starve armies faster). */
  terrainFactor: Partial<Record<TerrainKind, number>>;
  moralePerTick: number;
}

export const DEFAULT_ATTRITION: AttritionTuning = {
  base: 3,
  compound: 1.35,
  terrainFactor: { desert: 1.8, mountain: 1.5, sea: 1.4, plain: 1.0, river: 1.1, coast: 1.0 },
  moralePerTick: 6,
};

/** Compounding attrition vector for an isolated army: base × compound^(ticks-1) × terrain. */
export function attritionFor(isolationTicks: number, terrain: TerrainKind, tuning: AttritionTuning = DEFAULT_ATTRITION): number {
  if (isolationTicks <= 0) return 0;
  const raw = tuning.base * Math.pow(tuning.compound, isolationTicks - 1);
  const factor = tuning.terrainFactor[terrain] ?? 1;
  return Math.min(25, Math.round(raw * factor)); // hard cap: no army evaporates in one tick
}

// ── Movement ──────────────────────────────────────────────────────────────────

/** Movement allowance in cost-km per tick; cavalry-heavy rosters may override. */
export const MARCH_ALLOWANCE = 420;

export interface MarchStep {
  armyId: string;
  reachedNodeId: string;
  arrived: boolean;          // reached the target territory this tick
  enteredTerritoryId?: string;
  contested: boolean;        // arrived in enemy-held territory → battle trigger
}

/**
 * Advance an army along its path by the tick allowance. Returns the march step
 * (for the animation layer) and mutates a COPY of the army — the engine owns
 * state transitions, this function stays pure.
 */
export function advanceMarch(graph: GeoGraph, ownership: OwnershipState, army: Army): { army: Army; step: MarchStep | null } {
  if (!army.march) return { army, step: null };
  const { path } = army.march;
  let budget = MARCH_ALLOWANCE * (army.morale >= 60 ? 1 : 0.75); // shaken armies march slower
  let progress = army.march.progress;
  let stepped = false;

  while (progress < path.nodeIds.length - 1 && budget > 0) {
    const from = path.nodeIds[progress];
    const to = path.nodeIds[progress + 1];
    const edge = (graph.adj.get(from) ?? []).find(e => e.b === to);
    if (!edge) break;
    if (edge.cost > budget) {
      // A single leg longer than the whole tick allowance (a long sea lane,
      // a trans-desert crossing) is abstracted as a forced multi-week march:
      // one leg per tick, never a permanent stall on the node web.
      if (!stepped) { progress += 1; stepped = true; }
      budget = 0;
      break;
    }
    budget -= edge.cost;
    progress += 1;
    stepped = true;
  }

  const reachedNodeId = path.nodeIds[progress];
  const reachedTerritory = graph.nodes.get(reachedNodeId)!.territoryId;
  const arrived = progress >= path.nodeIds.length - 1;
  const enemy: FactionId = army.faction === 'player' ? 'rival' : 'player';
  const contested = ownership.owners[reachedTerritory] === enemy;

  const next: Army = {
    ...army,
    territoryId: reachedTerritory,
    march: arrived ? undefined : { ...army.march, progress },
  };
  return {
    army: next,
    step: { armyId: army.id, reachedNodeId, arrived, enteredTerritoryId: reachedTerritory, contested },
  };
}

/** Issue a march order: computes the A* path under current hostility. */
export function orderMarch(graph: GeoGraph, ownership: OwnershipState, army: Army, targetTerritoryId: string): Army | null {
  const enemy: FactionId = army.faction === 'player' ? 'rival' : 'player';
  const hostile = new Set(Object.entries(ownership.owners).filter(([, f]) => f === enemy).map(([t]) => t));
  // The target itself may be hostile (that IS the invasion) — never block it.
  hostile.delete(targetTerritoryId);
  const path = findTerritoryPath(graph, army.territoryId, targetTerritoryId, { hostile, hostilePenalty: 2.2, canSail: true });
  if (!path) return null;
  return { ...army, march: { path, targetTerritoryId, progress: 0 } };
}

// ── The per-tick logistics sweep ──────────────────────────────────────────────

export function runLogisticsTick(
  graph: GeoGraph,
  ownership: OwnershipState,
  armies: Army[],
  tuning: AttritionTuning = DEFAULT_ATTRITION,
): { armies: Army[]; reports: LogisticsReport[] } {
  const reports: LogisticsReport[] = [];
  const next = armies.map(army => {
    const corridor = traceSupplyCorridor(graph, ownership, army.faction, army.territoryId);
    const supplied = corridor !== null;
    const isolationTicks = supplied ? 0 : army.isolationTicks + 1;
    const centroidId = graph.centroids.get(army.territoryId);
    const terrain = centroidId ? graph.nodes.get(centroidId)!.terrain : 'plain';
    const attrition = supplied ? 0 : attritionFor(isolationTicks, terrain, tuning);
    const moraleDecay = supplied ? 0 : tuning.moralePerTick;

    reports.push({ armyId: army.id, supplied, isolationTicks, attrition, moraleDecay, corridor });
    return {
      ...army,
      supplied,
      isolationTicks,
      strength: Math.max(0, army.strength - attrition),
      morale: Math.max(0, army.morale - moraleDecay),
    };
  });
  return { armies: next, reports };
}

// ── Vector State Interceptor: timeline slider → ownership shifts ─────────────
// Scenario year fences: as the campaign timeline is scrubbed, ownership arrays
// re-derive from which historical power held each territory at that year. The
// interceptor emits a delta (gains/losses per faction) so the UI can animate
// exactly what changed rather than re-painting the world.

export interface YearFence {
  territoryId: string;
  /** Sorted year breakpoints with the faction holding from that year onward. */
  fences: { fromYear: number; owner: FactionId | 'neutral' }[];
}

export interface OwnershipDelta {
  year: number;
  gained: Record<FactionId, string[]>;
  lost: Record<FactionId, string[]>;
}

export function interceptTimelineShift(
  fencesByTerritory: YearFence[],
  current: OwnershipState,
  year: number,
): { ownership: OwnershipState; delta: OwnershipDelta } {
  const owners: Record<string, FactionId> = {};
  for (const yf of fencesByTerritory) {
    let owner: FactionId | 'neutral' = 'neutral';
    for (const f of yf.fences) {
      if (year >= f.fromYear) owner = f.owner;
    }
    if (owner !== 'neutral') owners[yf.territoryId] = owner;
  }
  const delta: OwnershipDelta = { year, gained: { player: [], rival: [] }, lost: { player: [], rival: [] } };
  const all = new Set([...Object.keys(owners), ...Object.keys(current.owners)]);
  for (const t of all) {
    const before = current.owners[t];
    const after = owners[t];
    if (before === after) continue;
    if (before) delta.lost[before].push(t);
    if (after) delta.gained[after].push(t);
  }
  return { ownership: { ...current, owners }, delta };
}
