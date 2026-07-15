// ─── Conquest Battle Engine ───────────────────────────────────────────────────
// Pure, deterministic-by-injection game logic for the Territory Conquest
// battles (Master exclusive). The UI renders what the engine says — nothing
// here touches the DOM, so every rule is unit-testable and the arena can be
// re-skinned freely.
//
// Battle loop per round:
//   1. WAR COUNCIL — the player picks a tactic card; the enemy commander
//      (a per-era AI persona) picks its own with weighted preferences.
//   2. ORDER — the history question is the battle order. A correct answer
//      executes YOUR tactic; a wrong one hands the initiative to the enemy.
//   3. RESOLUTION — damage flows through the tactic triangle
//      (CHARGE ▷ VOLLEY ▷ HOLD ▷ CHARGE), morale shifts, streaks build into
//      critical ROUT strikes, and the field state advances.
// An army breaks at 0 HP — or earlier at 0 morale, exactly like real
// pre-modern battles, where most casualties happened after the line broke.
import type { TerritoryTopic } from '@/features/content/timelineTerritoryData';

export type EraId = TerritoryTopic['era'];
export type Tactic = 'charge' | 'volley' | 'hold';
export type Side = 'player' | 'enemy';

export const MAX_HP = 100;
export const MAX_MORALE = 100;
export const STREAK_FOR_CRIT = 3;

export const TACTICS: Tactic[] = ['charge', 'volley', 'hold'];

/** CHARGE beats VOLLEY, VOLLEY beats HOLD, HOLD beats CHARGE. */
export function tacticBeats(a: Tactic, b: Tactic): boolean {
  return (a === 'charge' && b === 'volley')
    || (a === 'volley' && b === 'hold')
    || (a === 'hold' && b === 'charge');
}

// ── Unit composition ──────────────────────────────────────────────────────────
// Armies are mixed regiments; the sprite layer renders each class distinctly
// and the tactic that fires determines WHICH class visually leads the attack.

export type UnitClass = 'infantry' | 'ranged' | 'cavalry';

export interface RegimentSpec { cls: UnitClass; count: number }

/** Front-and-back rank composition per side (12 sprites per army). */
export const ARMY_COMPOSITION: RegimentSpec[] = [
  { cls: 'infantry', count: 6 },
  { cls: 'ranged', count: 3 },
  { cls: 'cavalry', count: 3 },
];

export const TACTIC_LEAD_CLASS: Record<Tactic, UnitClass> = {
  charge: 'cavalry',
  volley: 'ranged',
  hold: 'infantry',
};

// ── Era flavor: names, commanders, AI temperament ────────────────────────────

export interface EraFlavor {
  unitNames: Record<UnitClass, string>;
  commanderTitle: string;
  /** AI tactic weights [charge, volley, hold] — era doctrine. */
  doctrine: [number, number, number];
  warCry: string;
}

export const ERA_FLAVOR: Record<EraId, EraFlavor> = {
  prehistoric: {
    unitNames: { infantry: 'Spear hunters', ranged: 'Bow hunters', cavalry: 'Skirmishers' },
    commanderTitle: 'Chieftain',
    doctrine: [0.48, 0.22, 0.30],
    warCry: 'To the hunt!',
  },
  ancient: {
    unitNames: { infantry: 'Spear phalanx', ranged: 'Slingers', cavalry: 'Chariots' },
    commanderTitle: 'Warlord',
    doctrine: [0.42, 0.23, 0.35],
    warCry: 'Shields high!',
  },
  medieval: {
    unitNames: { infantry: 'Men-at-arms', ranged: 'Longbowmen', cavalry: 'Knights' },
    commanderTitle: 'Marshal',
    doctrine: [0.4, 0.35, 0.25],
    warCry: 'For the realm!',
  },
  'early-modern': {
    unitNames: { infantry: 'Pikemen', ranged: 'Musketeers', cavalry: 'Hussars' },
    commanderTitle: 'Field Marshal',
    doctrine: [0.25, 0.45, 0.3],
    warCry: 'Hold the line!',
  },
  modern: {
    unitNames: { infantry: 'Riflemen', ranged: 'Artillery', cavalry: 'Shock troops' },
    commanderTitle: 'General',
    doctrine: [0.3, 0.45, 0.25],
    warCry: 'Advance!',
  },
};

// ── Battle state ──────────────────────────────────────────────────────────────

export interface ArmyState {
  hp: number;
  morale: number;
  streak: number;        // consecutive successful strikes
  lastTactic: Tactic | null;
}

export interface RoundResolution {
  attacker: Side;
  attackTactic: Tactic;
  defendTactic: Tactic;
  advantage: boolean;    // attack tactic beat the defend tactic
  crit: boolean;         // streak-triggered ROUT strike
  damage: number;
  moraleDamage: number;
  routed: boolean;       // defender broke from morale collapse
  leadClass: UnitClass;  // which regiment visually leads the strike
}

export interface BattleState {
  era: EraId;
  legendary: boolean;
  round: number;
  totalRounds: number;
  player: ArmyState;
  enemy: ArmyState;
  correct: number;
  log: RoundResolution[];
  over: boolean;
  playerWon: boolean;
}

export function createBattle(era: EraId, totalRounds: number, legendary: boolean): BattleState {
  const fresh = (): ArmyState => ({ hp: MAX_HP, morale: MAX_MORALE, streak: 0, lastTactic: null });
  return {
    era, legendary, round: 0, totalRounds,
    player: fresh(), enemy: fresh(),
    correct: 0, log: [], over: false, playerWon: false,
  };
}

// ── Enemy commander AI ────────────────────────────────────────────────────────
// Doctrine-weighted with two humanizing rules: it avoids repeating the same
// tactic three times, and (Legendary only) it reads the player — biasing
// toward the counter of the player's most-used tactic so far.

export function enemyPickTactic(state: BattleState, rng: () => number = Math.random): Tactic {
  const flavor = ERA_FLAVOR[state.era];
  const weights: Record<Tactic, number> = {
    charge: flavor.doctrine[0],
    volley: flavor.doctrine[1],
    hold: flavor.doctrine[2],
  };

  // No triple repeats — a predictable commander is a boring one.
  const recent = state.log.slice(-2).map(r => r.attacker === 'enemy' ? r.attackTactic : r.defendTactic);
  if (recent.length === 2 && recent[0] === recent[1]) weights[recent[0]] *= 0.25;

  if (state.legendary && state.log.length >= 2) {
    // Count the player's habits and lean into the counter.
    const counts: Record<Tactic, number> = { charge: 0, volley: 0, hold: 0 };
    for (const r of state.log) counts[r.attacker === 'player' ? r.attackTactic : r.defendTactic] += 1;
    const favored = (Object.entries(counts) as [Tactic, number][]).sort((a, b) => b[1] - a[1])[0][0];
    const counter: Record<Tactic, Tactic> = { charge: 'hold', volley: 'charge', hold: 'volley' };
    weights[counter[favored]] *= 1.9;
  }

  const total = weights.charge + weights.volley + weights.hold;
  let roll = rng() * total;
  for (const tac of TACTICS) {
    roll -= weights[tac];
    if (roll <= 0) return tac;
  }
  return 'hold';
}

// ── Damage model ──────────────────────────────────────────────────────────────

export interface DamageTuning {
  base: number;          // baseline damage of a landed strike
  advantageMult: number; // tactic-triangle advantage multiplier
  critMult: number;      // ROUT strike multiplier
  variance: number;      // ± fraction of randomness
  moraleBase: number;    // morale damage of a landed strike
}

export function tuningFor(side: Side, legendary: boolean): DamageTuning {
  if (side === 'player') {
    return { base: legendary ? 30 : 24, advantageMult: 1.35, critMult: 1.5, variance: 0.15, moraleBase: 14 };
  }
  return { base: legendary ? 28 : 20, advantageMult: 1.35, critMult: 1.5, variance: 0.15, moraleBase: legendary ? 16 : 12 };
}

/**
 * Resolve one round. `playerCorrect` decides who attacks: the question is the
 * battle order — get it right and your tactic executes; get it wrong and the
 * enemy seizes the initiative with theirs.
 */
export function resolveRound(
  state: BattleState,
  playerTactic: Tactic,
  enemyTactic: Tactic,
  playerCorrect: boolean,
  rng: () => number = Math.random,
): BattleState {
  const attacker: Side = playerCorrect ? 'player' : 'enemy';
  const attackTactic = playerCorrect ? playerTactic : enemyTactic;
  const defendTactic = playerCorrect ? enemyTactic : playerTactic;

  const atk = { ...(playerCorrect ? state.player : state.enemy) };
  const def = { ...(playerCorrect ? state.enemy : state.player) };
  const tuning = tuningFor(attacker, state.legendary);

  const advantage = tacticBeats(attackTactic, defendTactic);
  const nextStreak = atk.streak + 1;
  const crit = nextStreak >= STREAK_FOR_CRIT;

  let dmg = tuning.base;
  if (advantage) dmg *= tuning.advantageMult;
  if (crit) dmg *= tuning.critMult;
  // Low morale bleeds into weak strikes; high morale sharpens them.
  dmg *= 0.85 + 0.3 * (atk.morale / MAX_MORALE);
  dmg *= 1 + (rng() * 2 - 1) * tuning.variance;
  dmg = Math.round(dmg);

  let moraleDmg = tuning.moraleBase + (advantage ? 6 : 0) + (crit ? 10 : 0);
  moraleDmg = Math.round(moraleDmg);

  def.hp = Math.max(0, def.hp - dmg);
  def.morale = Math.max(0, def.morale - moraleDmg);
  def.streak = 0;
  atk.streak = crit ? 0 : nextStreak; // a ROUT strike spends the streak
  atk.morale = Math.min(MAX_MORALE, atk.morale + 4);
  atk.lastTactic = attackTactic;
  def.lastTactic = defendTactic;

  const routed = def.hp > 0 && def.morale <= 0;
  if (routed) def.hp = 0; // the line breaks — battle over

  const resolution: RoundResolution = {
    attacker, attackTactic, defendTactic, advantage, crit,
    damage: dmg, moraleDamage: moraleDmg, routed,
    leadClass: TACTIC_LEAD_CLASS[attackTactic],
  };

  const player = playerCorrect ? atk : def;
  const enemy = playerCorrect ? def : atk;
  const round = state.round + 1;
  const outOfRounds = round >= state.totalRounds;
  const someoneDown = player.hp <= 0 || enemy.hp <= 0;
  const over = someoneDown || outOfRounds;
  // Standard tie-break on rounds exhausted: the healthier army holds the field.
  const playerWon = enemy.hp <= 0 || (player.hp > 0 && player.hp >= enemy.hp && over);

  return {
    ...state,
    round,
    player, enemy,
    correct: state.correct + (playerCorrect ? 1 : 0),
    log: [...state.log, resolution],
    over,
    playerWon: over ? playerWon : false,
  };
}

// ── Presentation helpers (pure) ───────────────────────────────────────────────

/** How many sprites of a regiment are still standing at a given HP. */
export function aliveInRegiment(spec: RegimentSpec, hp: number, regimentIndex: number): number {
  // Regiments thin out in reverse order of prestige: ranged first, then
  // infantry, cavalry last — the veterans hold the longest.
  const order: Record<UnitClass, number> = { ranged: 0, infantry: 1, cavalry: 2 };
  const totalSprites = ARMY_COMPOSITION.reduce((a, r) => a + r.count, 0);
  const totalAlive = Math.ceil((hp / MAX_HP) * totalSprites);
  // Deal casualties from the front of the loss order.
  let remaining = totalAlive;
  const sorted = [...ARMY_COMPOSITION].sort((a, b) => order[b.cls] - order[a.cls]);
  const aliveByCls: Record<UnitClass, number> = { infantry: 0, ranged: 0, cavalry: 0 };
  for (const reg of sorted) {
    const take = Math.min(reg.count, remaining);
    aliveByCls[reg.cls] = take;
    remaining -= take;
  }
  void regimentIndex;
  return aliveByCls[spec.cls];
}

/** Morale band for visual state: steady / wavering / breaking. */
export function moraleBand(morale: number): 'steady' | 'wavering' | 'breaking' {
  if (morale > 55) return 'steady';
  if (morale > 25) return 'wavering';
  return 'breaking';
}

/** Stars mirror the campaign contract: correctness ratio, victory required. */
export function battleStars(correct: number, total: number, won: boolean): 0 | 1 | 2 | 3 {
  if (!won || total === 0) return 0;
  const ratio = correct / total;
  if (ratio === 1) return 3;
  if (ratio >= 0.8) return 2;
  if (ratio >= 0.6) return 1;
  return won ? 1 : 0;
}
