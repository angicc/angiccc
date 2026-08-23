import { describe, it, expect } from 'vitest';
import { graphFor } from '@/features/imperium/imperiumEngine';
import { THEATRE_SPECS } from '@/features/imperium/imperiumProvinces';

/**
 * Every province must be reachable from the player's capital.
 *
 * The Crusades theatre shipped as two disconnected islands — the player bloc
 * on one side, Byzantium, Cyprus, Georgia and the Fatimids on the other — so
 * three of its four rival provinces could never be marched on and the campaign
 * was unwinnable and unplayable. Nothing threw; the map simply refused to let
 * you attack, which reads as a broken button rather than a broken graph.
 *
 * Connectivity is not a property any single theatre's geometry guarantees, so
 * it is asserted for all of them.
 */
function territoryAdjacency(theatre: Parameters<typeof graphFor>[0]) {
  const g = graphFor(theatre);
  const adj = new Map<string, Set<string>>(g.territoryIds.map(t => [t, new Set<string>()]));
  for (const [, edges] of g.adj) {
    for (const e of edges) {
      const a = g.nodes.get(e.a)?.territoryId;
      const b = g.nodes.get(e.b)?.territoryId;
      if (a && b && a !== b) { adj.get(a)!.add(b); adj.get(b)!.add(a); }
    }
  }
  return { g, adj };
}

describe('Chronos Imperium theatre connectivity', () => {
  for (const spec of THEATRE_SPECS) {
    it(`lets the player reach every province in "${spec.id}"`, () => {
      const { g, adj } = territoryAdjacency(spec.id);
      const start = spec.playerProvinces[0];
      expect(g.territoryIds).toContain(start);

      const seen = new Set([start]);
      const queue = [start];
      while (queue.length) {
        for (const n of adj.get(queue.shift()!) ?? []) {
          if (!seen.has(n)) { seen.add(n); queue.push(n); }
        }
      }

      const unreachable = g.territoryIds.filter(t => !seen.has(t));
      expect(unreachable, `${unreachable.length} province(s) cannot be marched on`).toEqual([]);
    });

    it(`starts "${spec.id}" with both sides holding real provinces`, () => {
      const { g } = territoryAdjacency(spec.id);
      // A faction with no province has no army and no way into the campaign.
      expect(spec.playerProvinces.length).toBeGreaterThan(0);
      expect(spec.rivalProvinces.length).toBeGreaterThan(0);
      for (const p of [...spec.playerProvinces, ...spec.rivalProvinces]) {
        expect(g.territoryIds, `${spec.id}: "${p}" is not a province of this theatre`).toContain(p);
      }
      // And they must not overlap, or ownership is ambiguous from turn one.
      const overlap = spec.playerProvinces.filter(p => spec.rivalProvinces.includes(p));
      expect(overlap).toEqual([]);
    });
  }
});
