import { describe, it, expect } from 'vitest';
import {
  planRivalOrders, rivalOrderMap, scoreMove, effectivePower, garrisonOf,
  hopDistance, aggressionFor, type StrategyInput, type StrategyArmy,
} from '@/features/imperium/rivalStrategy';
import { graphFor } from '@/features/imperium/imperiumEngine';
import { neighbourTerritories } from '@/features/imperium/geoGraph';

const graph = graphFor('crusades');

function army(id: string, territoryId: string, over: Partial<StrategyArmy> = {}): StrategyArmy {
  return { id, faction: 'rival', territoryId, strength: 100, morale: 100, supplied: true, ...over };
}

function input(over: Partial<StrategyInput> = {}): StrategyInput {
  return {
    owners: {
      france: 'player', hre: 'player', angevin: 'player', hungary: 'player', poland: 'player',
      fatimid: 'rival', byzantium: 'rival', almohad: 'rival', georgia: 'rival',
      cyprus: 'neutral',
    },
    armies: [],
    playerCapital: 'france',
    rivalCapital: 'fatimid',
    graph,
    aggression: 0.5,
    // Deterministic: the AI must make the same decisions on the same state.
    rng: () => 0.5,
    ...over,
  };
}

describe('rival strategy', () => {
  it('is deterministic for the same state', () => {
    const a = input({ armies: [army('r1', 'byzantium'), army('r2', 'almohad')] });
    expect(rivalOrderMap(a)).toEqual(rivalOrderMap(input({ armies: [army('r1', 'byzantium'), army('r2', 'almohad')] })));
  });

  it('never attacks into odds it should lose', () => {
    // A weak army facing a defended province must not march on it.
    const weak = army('r1', 'byzantium', { strength: 30, morale: 40 });
    const a = input({
      armies: [weak, army('p1', 'hungary', { faction: 'player', strength: 100 })],
    });
    const scored = scoreMove(a, weak, 'hungary');
    expect(scored, 'attacked a defender it cannot beat').toBeNull();
  });

  it('withdraws a broken army instead of feeding it to a battle', () => {
    const broken = army('r1', 'byzantium', { strength: 20, morale: 30 });
    const plan = planRivalOrders(input({ armies: [broken] }));
    expect(plan[0].motive).toBe('withdraw');
    expect(a_isRival(plan[0].target)).toBe(true);
  });

  it('withdraws an unsupplied army that is bleeding out', () => {
    const cut = army('r1', 'georgia', { strength: 55, supplied: false });
    const plan = planRivalOrders(input({ armies: [cut] }));
    expect(plan[0].motive).toBe('withdraw');
  });

  it('claims neutral ground when no attack is worth making', () => {
    // Every player province heavily defended; Cyprus is free.
    const defenders = ['france', 'hre', 'angevin', 'hungary', 'poland'].map((t, i) =>
      army(`p${i}`, t, { faction: 'player', strength: 100 }));
    const plan = planRivalOrders(input({
      armies: [army('r1', 'byzantium', { strength: 60 }), ...defenders],
    }));
    const mine = plan.find(c => c.armyId === 'r1')!;
    expect(mine.motive).toBe('claim-neutral');
    expect(mine.target).toBe('cyprus');
  });

  it('defends its capital when enemy power actually stands beside it', () => {
    // A player army adjacent to the rival capital, which is lightly held.
    const beside = neighbourTerritories(graph, 'fatimid')[0];
    const a = input({
      owners: { ...input().owners, [beside]: 'player' },
      armies: [
        army('r1', 'byzantium', { strength: 100 }),
        army('p1', beside, { faction: 'player', strength: 100 }),
      ],
    });
    const plan = planRivalOrders(a);
    const mine = plan.find(c => c.armyId === 'r1')!;
    expect(mine.motive).toBe('defend-capital');
    expect(mine.target).toBe('fatimid');
  });

  it('concentrates a second army on a target the first already chose', () => {
    // Two healthy armies, one weakly-held player province in reach.
    const a = input({
      owners: { ...input().owners, hungary: 'player' },
      armies: [
        army('r1', 'byzantium', { strength: 100 }),
        army('r2', 'byzantium', { strength: 95 }),
        army('p1', 'hungary', { faction: 'player', strength: 20, morale: 40 }),
      ],
    });
    const plan = planRivalOrders(a).filter(c => c.armyId.startsWith('r'));
    expect(plan).toHaveLength(2);
    expect(plan[0].target, 'the two armies split instead of concentrating').toBe(plan[1].target);
  });

  it('prefers the enemy capital as aggression rises', () => {
    const armies = [army('r1', 'byzantium', { strength: 140 })];
    const weakEverywhere = ['france', 'hungary'].map((t, i) =>
      army(`p${i}`, t, { faction: 'player', strength: 30, morale: 50 }));
    const calm = planRivalOrders(input({ armies: [...armies, ...weakEverywhere], aggression: 0 }));
    const fierce = planRivalOrders(input({ armies: [...armies, ...weakEverywhere], aggression: 1 }));
    // At full aggression the capital must win; at zero it need not.
    expect(fierce.find(c => c.armyId === 'r1')!.target).toBe('france');
    expect(calm.find(c => c.armyId === 'r1')).toBeTruthy();
  });

  it('never orders a march to an unreachable province', () => {
    const a = input({ armies: [army('r1', 'byzantium')] });
    for (const c of planRivalOrders(a)) {
      if (c.motive === 'hold') continue;
      expect(Number.isFinite(hopDistance(graph, 'byzantium', c.target))).toBe(true);
    }
  });

  it('never orders an army onto the province it already holds', () => {
    const a = input({ armies: [army('r1', 'byzantium'), army('r2', 'fatimid')] });
    for (const c of rivalOrderMapEntries(a)) expect(c.target).not.toBe(c.from);
  });

  it('discounts exhausted and unsupplied armies', () => {
    expect(effectivePower(army('x', 'byzantium'))).toBeGreaterThan(
      effectivePower(army('x', 'byzantium', { morale: 20 })));
    expect(effectivePower(army('x', 'byzantium'))).toBeGreaterThan(
      effectivePower(army('x', 'byzantium', { supplied: false })));
  });

  it('counts a garrison from the armies standing on it', () => {
    const a = input({ armies: [army('p1', 'france', { faction: 'player' }), army('p2', 'france', { faction: 'player' })] });
    expect(garrisonOf(a, 'france', 'player')).toBeGreaterThan(garrisonOf(a, 'hre', 'player'));
    expect(garrisonOf(a, 'hre', 'player')).toBe(0);
  });

  it('presses harder when it is losing, not softer', () => {
    // A campaign that gets easier the better you do is the one thing a
    // strategy game cannot afford.
    expect(aggressionFor(10, 2, 10)).toBeGreaterThan(aggressionFor(10, 8, 10));
    expect(aggressionFor(24, 5, 10)).toBeGreaterThan(aggressionFor(1, 5, 10));
    for (const [t, r, n] of [[0, 0, 0], [50, 10, 10], [1, 1, 2]] as const) {
      const v = aggressionFor(t, r, n);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  function a_isRival(t: string): boolean {
    return input().owners[t] === 'rival';
  }
  function rivalOrderMapEntries(a: StrategyInput) {
    return Object.entries(rivalOrderMap(a)).map(([armyId, target]) => ({
      target, from: a.armies.find(x => x.id === armyId)!.territoryId,
    }));
  }
});
