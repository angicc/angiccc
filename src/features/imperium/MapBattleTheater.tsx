// ─── CHRONOS IMPERIUM · On-Map 3D Battle Theatre ─────────────────────────────
// When two armies collide, the battle plays out RIGHT ON THE LEAFLET MAP at
// the contested province's coordinates — now as a true CSS-3D diorama. A
// perspective ground plane is projected onto the map; each side fields ranks
// of upright soldier sprites (counter-rotated billboards standing on the
// receding plane) that march, loose volleys, lock shields, clash and — as
// strength drains — fall and stay down. Above the arena Clio grades the
// player's tactical read live, and when the dust settles her DEBRIEF opens:
// the real historical battle this engagement echoed (Hastings, Agincourt,
// Cannae…), what happened there, and the transferable principle — so every
// battle is simultaneously a game moment and a history lesson. The debrief
// feeds the Commander's Ledger for long-run decision analytics.
// All motion respects prefers-reduced-motion; geometry clamps to the map.
import { useEffect, useMemo, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronRight, SkipForward, Film, Landmark, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Language } from '@/i18n/translations';
import { impText } from './imperiumCatalog';
import {
  ROSTERS, rateTactic,
  type BattleResolution, type Tactic, type UnitClass, type Weather, type TacticGrade,
} from './combatMatrix';
import { findParallel, type HistoricalParallel } from './battleParallels';

// ── Structural battle shape (compatible with engine TurnResult['battles'][n]) ──
export interface TheaterBattle {
  pending: { id: string; territoryId: string; lat: number; lng: number };
  resolution: BattleResolution;
}

/** What the theatre reports back for the Commander's Ledger. */
export interface TheaterReport {
  playerTactic: Tactic;
  enemyTactic: Tactic;
  grade: TacticGrade;
  outcome: 'won' | 'lost' | 'draw';
  parallelId: string;
  territoryId: string;
}

interface Props {
  battle: TheaterBattle;
  map: LeafletMap | null;
  /** Leader id of the human player — identifies which BattleSide is theirs. */
  playerLeaderId: string;
  weather: Weather;
  language: Language;
  provinceName: (id: string) => string;
  /** Advance the queue (battle resolved + debrief acknowledged). */
  onResolved: (report: TheaterReport) => void;
  /** Open the detailed CSS-3D frame-by-frame replay for this battle. */
  onInspect: () => void;
}

const PLAYER_COLOR = '#d9a54a';
const ENEMY_COLOR = '#c0455a';

const LEAD: Record<Tactic, UnitClass> = { charge: 'cavalry', volley: 'ranged', hold: 'infantry' };
const CLASS_GLYPH: Record<UnitClass, string> = { infantry: '🛡️', ranged: '🏹', cavalry: '🐎' };
const SUPPORT: Record<Tactic, UnitClass[]> = {
  charge: ['cavalry', 'infantry', 'ranged'],
  volley: ['ranged', 'ranged', 'infantry'],
  hold: ['infantry', 'infantry', 'ranged'],
};

type Side = 'attacker' | 'defender';
const ACTION_KINDS = new Set(['charge', 'volley', 'brace', 'melee']);

const GRADE_STYLE: Record<string, string> = {
  S: 'text-emerald-300 border-emerald-400/60 bg-emerald-500/15',
  A: 'text-emerald-400 border-emerald-400/45 bg-emerald-500/10',
  B: 'text-amber-300 border-amber-400/45 bg-amber-500/10',
  C: 'text-orange-300 border-orange-400/45 bg-orange-500/10',
  D: 'text-red-300 border-red-400/55 bg-red-500/15',
};

const TAC_KEY: Record<Tactic, string> = {
  charge: 'imp_tactic_charge', volley: 'imp_tactic_volley', hold: 'imp_tactic_hold',
};

function ClioBadge({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="#1c0a02" stroke="#a78bfa" strokeWidth="1.4" />
      <path d="M7 8 L9 5 L12 6.5 L15 5 L17 8" fill="none" stroke="#f59e0b" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="9.5" cy="12" r="1.05" fill="#f5f0e6" />
      <circle cx="14.5" cy="12" r="1.05" fill="#f5f0e6" />
      <path d="M10 15 Q12 16.4 14 15" stroke="#c8956c" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ── One soldier: an upright billboard standing on the 3D ground plane ─────────
// The ground is rotated ~56° away from the camera; each soldier counter-rotates
// -56° around its feet so it stands vertically on the receding plane — the
// classic CSS diorama. Fallen soldiers stay down as dimmed bodies.
const GROUND_TILT = 56;

function Soldier3D({ x, y, glyph, color, side, action, dead, routed, delay, reduce }: {
  x: number;               // % across the ground plane (attacker left)
  y: number;               // % down the ground plane (depth: smaller = further)
  glyph: string;
  color: string;
  side: Side;
  action: string | null;
  dead: boolean;
  routed: boolean;
  delay: number;
  reduce: boolean;
}) {
  const dir = side === 'attacker' ? 1 : -1;
  // Per-action body language, applied to the upright billboard.
  const motionProps = reduce || dead ? {} :
    routed ? { x: -dir * 160, opacity: 0 } :
    action === 'charge' ? { x: [0, dir * 26, dir * 10], rotate: [0, dir * 8, 0] } :
    action === 'melee' ? { x: [0, dir * 14, dir * 4], rotate: [0, dir * 10, -dir * 4, 0] } :
    action === 'volley' ? { y: [0, -3, 0], rotate: [0, -dir * 6, 0] } :
    action === 'brace' ? { scale: [1, 0.94, 1] } :
    { y: [0, -1.5, 0] };

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`, top: `${y}%`,
        transform: `rotateX(${-GROUND_TILT}deg)`,
        transformOrigin: 'bottom center',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* contact shadow lies flat on the ground */}
      <div
        className="absolute left-1/2 top-full h-2 w-6 -translate-x-1/2 rounded-[50%] bg-black/50 blur-[2px]"
        style={{ transform: `translateX(-50%) rotateX(${GROUND_TILT}deg) translateZ(-1px)`, opacity: dead ? 0.25 : 0.6 }}
      />
      <motion.div
        animate={dead
          ? { rotate: dir * 84, opacity: 0.42, y: 4, filter: 'grayscale(0.9)' }
          : motionProps}
        transition={dead
          ? { duration: 0.7, ease: 'easeIn' }
          : routed
            ? { duration: 1, ease: 'easeIn' }
            : { duration: 0.55, ease: 'easeOut', delay, repeat: action ? 0 : Infinity, repeatDelay: 1.6 }}
        className="relative flex flex-col items-center"
        style={{ transformOrigin: 'bottom center' }}
      >
        <span className="text-[15px] leading-none" style={{ transform: side === 'defender' ? 'scaleX(-1)' : undefined, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.7))' }}>
          {glyph}
        </span>
        {/* faction base disc */}
        <span className="mt-[1px] block h-[3px] w-4 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      </motion.div>
    </div>
  );
}

// ── Per-tick effects above the diorama (arrows, sparks, clash flash) ──────────
function EffectsLayer({ tick, triggers, dmgToPlayer, dmgToEnemy, playerSide, reduce }: {
  tick: number;
  triggers: BattleResolution['ticks'][number]['triggers'];
  dmgToPlayer: number;
  dmgToEnemy: number;
  playerSide: Side;
  reduce: boolean;
}) {
  if (reduce) return null;
  const has = (kind: string, side?: Side) => triggers.some(g => g.kind === kind && (!side || g.side === side));
  const enemySide: Side = playerSide === 'attacker' ? 'defender' : 'attacker';
  const home = (s: Side) => (s === 'attacker' ? 18 : 82);

  return (
    <div key={tick} className="pointer-events-none absolute inset-0 overflow-visible">
      {(['attacker', 'defender'] as Side[]).flatMap(side =>
        has('volley', side)
          ? Array.from({ length: 6 }).map((_, i) => {
              const from = home(side), to = home(side === 'attacker' ? 'defender' : 'attacker');
              return (
                <motion.div
                  key={`arw-${side}-${i}`}
                  className="absolute top-[46%] h-[2px] w-2.5 rounded-full"
                  style={{ background: side === playerSide ? PLAYER_COLOR : ENEMY_COLOR }}
                  initial={{ left: `${from}%`, y: 0, opacity: 0 }}
                  animate={{ left: `${to}%`, y: [0, -30 - i * 3, 8], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.62, delay: i * 0.05, ease: 'easeIn' }}
                />
              );
            })
          : [],
      )}
      {(['attacker', 'defender'] as Side[]).map(side =>
        has('charge', side) ? (
          <motion.div
            key={`dust-${side}`}
            className="absolute top-[52%] h-7 -translate-y-1/2 rounded-full blur-[3px]"
            style={{
              [side === 'attacker' ? 'left' : 'right']: `${home(side)}%`,
              width: '30%',
              background: `linear-gradient(${side === 'attacker' ? 90 : 270}deg, transparent, ${side === playerSide ? PLAYER_COLOR : ENEMY_COLOR}55)`,
            }}
            initial={{ opacity: 0, scaleX: 0.3 }}
            animate={{ opacity: [0, 0.85, 0], scaleX: [0.3, 1, 1] }}
            transition={{ duration: 0.6 }}
          />
        ) : null,
      )}
      {(has('melee') || has('charge')) && (
        <motion.div
          className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: 38, height: 38, background: 'radial-gradient(circle, #fff8e0, #f59e0b00 70%)' }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0, 0.95, 0], scale: [0.2, 1.6, 2] }}
          transition={{ duration: 0.5, delay: 0.15 }}
        />
      )}
      {has('brace') && Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={`spk-${i}`}
          className="absolute left-1/2 top-[48%] text-[10px]"
          style={{ color: '#ffe9a8' }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], x: (Math.random() - 0.5) * 44, y: (Math.random() - 0.5) * 36 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.03 }}
        >✦</motion.span>
      ))}
      {(['attacker', 'defender'] as Side[]).map(side =>
        has('shatter', side) ? (
          <motion.span
            key={`sht-${side}`}
            className="absolute top-[46%] -translate-y-1/2 text-[17px]"
            style={{ [side === 'attacker' ? 'left' : 'right']: `${home(side) - 4}%`, color: '#ff6b6b' }}
            initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.35, 1.7], rotate: 0 }}
            transition={{ duration: 0.6 }}
          >✸</motion.span>
        ) : null,
      )}
      {dmgToEnemy > 0 && (
        <motion.span
          className="absolute top-[24%] text-[11px] font-black tabular-nums"
          style={{ [enemySide === 'attacker' ? 'left' : 'right']: `${home(enemySide) - 3}%`, color: '#ffd3d3', textShadow: '0 1px 3px #000' }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: [0, 1, 1, 0], y: -20 }}
          transition={{ duration: 1 }}
        >-{dmgToEnemy}</motion.span>
      )}
      {dmgToPlayer > 0 && (
        <motion.span
          className="absolute top-[24%] text-[11px] font-black tabular-nums"
          style={{ [playerSide === 'attacker' ? 'left' : 'right']: `${home(playerSide) - 3}%`, color: '#ffd3d3', textShadow: '0 1px 3px #000' }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: [0, 1, 1, 0], y: -20 }}
          transition={{ duration: 1 }}
        >-{dmgToPlayer}</motion.span>
      )}
    </div>
  );
}

// ── The theatre ───────────────────────────────────────────────────────────────
export function MapBattleTheater({
  battle, map, playerLeaderId, weather, language, provinceName, onResolved, onInspect,
}: Props) {
  const reduce = useReducedMotion() ?? false;
  const { resolution, pending } = battle;

  const playerSide: Side = resolution.attacker.leader?.id === playerLeaderId ? 'attacker' : 'defender';
  const enemySide: Side = playerSide === 'attacker' ? 'defender' : 'attacker';
  const playerTactic = resolution[playerSide].tactic;
  const enemyTactic = resolution[enemySide].tactic;

  const read = useMemo(() => rateTactic({
    tactic: playerTactic, enemyTactic, weather, terrain: resolution.terrain,
    leaderSignature: resolution[playerSide].leader?.signature,
  }), [playerTactic, enemyTactic, weather, resolution, playerSide]);

  const parallel: HistoricalParallel = useMemo(
    () => findParallel({ playerTactic, enemyTactic, terrain: resolution.terrain, weather }),
    [playerTactic, enemyTactic, resolution.terrain, weather],
  );

  const playerRoster = ROSTERS.find(r => r.id === resolution[playerSide].rosterId);
  const enemyRoster = ROSTERS.find(r => r.id === resolution[enemySide].rosterId);

  // ── Anchor to the battle's ground: project lat/lng → container pixels ──
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);
  const [mapSize, setMapSize] = useState<{ x: number; y: number }>({ x: 320, y: 200 });
  useEffect(() => {
    if (!map) return;
    const update = () => {
      const p = map.latLngToContainerPoint([pending.lat, pending.lng]);
      setPt({ x: p.x, y: p.y });
      const s = map.getSize();
      setMapSize({ x: s.x, y: s.y });
    };
    update();
    map.on('move zoom zoomanim viewreset resize', update);
    return () => { map.off('move zoom zoomanim viewreset resize', update); };
  }, [map, pending.lat, pending.lng]);

  // ── Bring the camera to the fight; freeze panning while it plays ──
  useEffect(() => {
    if (!map) return;
    try { map.panTo([pending.lat, pending.lng], { animate: !reduce, duration: 0.6 }); } catch { /* noop */ }
    const dragWasOn = map.dragging.enabled();
    const wheelWasOn = map.scrollWheelZoom.enabled();
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    return () => {
      if (dragWasOn) map.dragging.enable();
      if (wheelWasOn) map.scrollWheelZoom.enable();
    };
  }, [map, pending.id, pending.lat, pending.lng, reduce]);

  // ── Deterministic tick stepper ──
  const [tickIdx, setTickIdx] = useState(-1);
  const done = tickIdx >= resolution.ticks.length - 1;
  const [showDebrief, setShowDebrief] = useState(false);
  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setShowDebrief(true), reduce ? 0 : 900);
      return () => clearTimeout(t);
    }
    if (reduce) { setTickIdx(resolution.ticks.length - 1); return; }
    const t = setTimeout(() => setTickIdx(i => i + 1), tickIdx < 0 ? 720 : 780);
    return () => clearTimeout(t);
  }, [tickIdx, done, reduce, resolution.ticks.length]);

  // ── Strength / morale rewound from the final state (same math as the modal) ──
  const view = useMemo(() => {
    let aS = resolution.attacker.strength, dS = resolution.defender.strength;
    let aM = resolution.attacker.morale, dM = resolution.defender.morale;
    for (let i = resolution.ticks.length - 1; i > tickIdx; i--) {
      const t = resolution.ticks[i];
      aS += t.defenderDamage; dS += t.attackerDamage;
      aM -= t.attackerMoraleDelta; dM -= t.defenderMoraleDelta;
    }
    const clamp = (n: number) => Math.max(0, Math.min(100, n));
    return { aS: clamp(aS), dS: clamp(dS), aM: clamp(aM), dM: clamp(dM) };
  }, [tickIdx, resolution]);

  const playerS = playerSide === 'attacker' ? view.aS : view.dS;
  const enemyS = playerSide === 'attacker' ? view.dS : view.aS;
  const playerM = playerSide === 'attacker' ? view.aM : view.dM;
  const enemyM = playerSide === 'attacker' ? view.dM : view.aM;

  const curTick = tickIdx >= 0 && tickIdx < resolution.ticks.length ? resolution.ticks[tickIdx] : null;
  const triggers = curTick?.triggers ?? [];
  const dmgToPlayer = curTick ? (playerSide === 'attacker' ? curTick.defenderDamage : curTick.attackerDamage) : 0;
  const dmgToEnemy = curTick ? (playerSide === 'attacker' ? curTick.attackerDamage : curTick.defenderDamage) : 0;

  const actionFor = (side: Side): string | null =>
    triggers.find(g => g.side === side && ACTION_KINDS.has(g.kind))?.kind ?? null;

  const routedSide: Side | null = done && resolution.routed
    ? (resolution.winner === 'attacker' ? 'defender' : 'attacker') : null;

  // ── Soldier ranks: 6 per side on the ground plane, advancing with the ticks ──
  const progress = resolution.ticks.length > 1 ? Math.max(0, tickIdx) / (resolution.ticks.length - 1) : 1;
  const soldiers = useMemo(() => {
    const make = (side: Side, tactic: Tactic, strength: number, action: string | null, isRouted: boolean) => {
      const alive = Math.max(1, Math.round((strength / 100) * 6));
      const support = SUPPORT[tactic];
      // Front line closes from 26% → 40% of the plane as the battle grinds on.
      const frontBase = 26 + 14 * Math.min(1, progress * 1.35);
      return Array.from({ length: 6 }).map((_, i) => {
        const rank = i < 3 ? 0 : 1;                 // 0 = front rank
        const file = i % 3;                         // 3 files per rank
        const xFromEdge = frontBase - rank * 10;    // rear rank sits behind
        const x = side === 'attacker' ? xFromEdge : 100 - xFromEdge;
        const y = 22 + file * 24 + rank * 6;        // spread across the depth
        const cls: UnitClass = i === 0 ? LEAD[tactic] : support[i % support.length];
        return {
          key: `${side}-${i}`, x, y,
          glyph: CLASS_GLYPH[cls],
          side, action,
          dead: i >= alive && !isRouted,
          routed: isRouted,
          delay: (file * 0.06) + rank * 0.09,
        };
      });
    };
    return [
      ...make('attacker', resolution.attacker.tactic, view.aS, actionFor('attacker'), routedSide === 'attacker'),
      ...make('defender', resolution.defender.tactic, view.dS, actionFor('defender'), routedSide === 'defender'),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickIdx, view.aS, view.dS, routedSide, progress]);

  const outcome: TheaterReport['outcome'] =
    resolution.winner === 'stalemate' ? 'draw' : resolution.winner === playerSide ? 'won' : 'lost';
  const outcomeKey = outcome === 'draw' ? 'imp_theater_draw' : outcome === 'won' ? 'imp_theater_you_win' : 'imp_theater_you_lose';
  const outcomeColor = outcome === 'draw' ? 'text-muted-foreground' : outcome === 'won' ? 'text-amber-300' : 'text-red-400';

  // ── Clio's live read of the unfolding tick ──
  const clioLine = useMemo(() => {
    if (tickIdx < 0 || !curTick) return impText('imp_clio_open', language);
    const has = (kind: string, side: Side) => curTick.triggers.some(g => g.kind === kind && g.side === side);
    if (has('rout', enemySide)) return impText('imp_clio_rout_enemy', language);
    if (has('rout', playerSide)) return impText('imp_clio_rout_you', language);
    if (has('shatter', enemySide)) return impText('imp_clio_shatter_enemy', language);
    if (has('shatter', playerSide)) return impText('imp_clio_shatter_you', language);
    if (has('waver', enemySide)) return impText('imp_clio_waver_enemy', language);
    return impText('imp_clio_grind', language);
  }, [tickIdx, curTick, enemySide, playerSide, language]);

  const finish = () => onResolved({
    playerTactic, enemyTactic, grade: read.grade, outcome,
    parallelId: parallel.id, territoryId: pending.territoryId,
  });

  // ── Arena geometry (clamped to stay on the map) ──
  const arenaW = Math.min(340, Math.max(230, mapSize.x - 24));
  const arenaH = 170;
  const cx = pt ? Math.max(arenaW / 2 + 8, Math.min(mapSize.x - arenaW / 2 - 8, pt.x)) : mapSize.x / 2;
  const cy = pt
    ? Math.max(arenaH / 2 + 64, Math.min(mapSize.y - arenaH / 2 - 56, pt.y))
    : mapSize.y / 2;

  if (!map) return null;

  return (
    <div className="absolute inset-0 z-[1100] overflow-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ background: 'radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,.12), rgba(0,0,0,.55))' }}
      />

      {pt && (
        <motion.div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pt.x, top: pt.y }}
          initial={{ scale: 0.4, opacity: 0.9 }} animate={{ scale: [0.6, 1.5, 0.6], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-5 w-5 rounded-full border-2" style={{ borderColor: '#fff5', boxShadow: '0 0 12px #f59e0b' }} />
        </motion.div>
      )}

      {/* ── The 3D arena ── */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: cx, top: cy, width: arenaW, height: arenaH }}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* perspective viewport */}
        <div
          className="absolute inset-x-1 bottom-2 top-7 overflow-hidden rounded-xl border border-white/10"
          style={{ background: 'linear-gradient(180deg, rgba(24,20,12,.42), rgba(8,6,4,.66))', backdropFilter: 'blur(2px)' }}
        >
          <div className="absolute inset-0" style={{ perspective: 520, perspectiveOrigin: '50% 26%' }}>
            {/* the receding ground plane */}
            <div
              className="absolute left-1/2 top-[54%]"
              style={{
                width: '124%', height: '150%',
                transform: `translate(-50%, -32%) rotateX(${GROUND_TILT}deg)`,
                transformStyle: 'preserve-3d',
                background: `
                  radial-gradient(60% 55% at 50% 46%, rgba(217,165,74,.10), transparent 70%),
                  repeating-linear-gradient(0deg, transparent 0 23px, rgba(255,255,255,.045) 23px 24px),
                  repeating-linear-gradient(90deg, transparent 0 23px, rgba(255,255,255,.045) 23px 24px),
                  linear-gradient(180deg, rgba(52,42,24,.85), rgba(30,24,14,.9))`,
                borderRadius: 18,
                boxShadow: 'inset 0 0 40px rgba(0,0,0,.55)',
              }}
            >
              {/* centre line of contact */}
              <div className="absolute inset-y-[8%] left-1/2 w-[2px] -translate-x-1/2 bg-white/10" />
              {/* the soldiers stand upright on this plane */}
              {soldiers.map(s => (
                <Soldier3D key={s.key} x={s.x} y={s.y} glyph={s.glyph}
                  color={(s.side === playerSide) ? PLAYER_COLOR : ENEMY_COLOR}
                  side={s.side} action={s.action} dead={s.dead} routed={s.routed}
                  delay={s.delay} reduce={reduce} />
              ))}
            </div>
          </div>

          {/* weather sheen above the diorama */}
          {weather === 'rain' || weather === 'storm' ? (
            <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: 'repeating-linear-gradient(105deg, transparent, transparent 6px, rgba(150,180,220,.25) 7px, transparent 9px)' }} />
          ) : weather === 'snow' ? (
            <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 20%, #fff6, transparent 3px), radial-gradient(circle at 70% 60%, #fff5, transparent 2px)' }} />
          ) : weather === 'heat' ? (
            <div className="pointer-events-none absolute inset-0 opacity-25" style={{ background: 'linear-gradient(0deg, rgba(255,160,60,.35), transparent)' }} />
          ) : null}

          {/* per-tick effects overlay */}
          <AnimatePresence mode="wait">
            {curTick && (
              <EffectsLayer
                tick={tickIdx} triggers={triggers}
                dmgToPlayer={dmgToPlayer} dmgToEnemy={dmgToEnemy}
                playerSide={playerSide} reduce={reduce}
              />
            )}
          </AnimatePresence>
        </div>

        {/* title strip */}
        <div className="absolute inset-x-1 top-0 flex items-center justify-between px-1 text-[10px]">
          <span className="rounded bg-black/70 px-1.5 py-0.5 font-heading font-bold text-amber-100/90 backdrop-blur">
            {impText('imp_theater_clash', language, { territory: provinceName(pending.territoryId) })}
          </span>
          <span className="rounded bg-black/70 px-1.5 py-0.5 tabular-nums text-muted-foreground backdrop-blur">
            {impText('imp_theater_round', language)} {tickIdx < 0 ? '—' : `${Math.min(tickIdx + 1, resolution.ticks.length)}/${resolution.ticks.length}`}
          </span>
        </div>

        {/* strength bars */}
        <div className="absolute inset-x-2 bottom-0 flex items-end gap-2 text-[9px]">
          <SideBar label={impText('imp_theater_you', language)} align="left" color={PLAYER_COLOR} strength={playerS} morale={playerM} />
          <SideBar label={impText('imp_theater_enemy', language)} align="right" color={ENEMY_COLOR} strength={enemyS} morale={enemyM} />
        </div>

        {/* outcome banner (brief — the debrief takes over) */}
        <AnimatePresence>
          {done && !showDebrief && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.6, rotateX: 40 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0 }}
              style={{ transformPerspective: 600 }}
            >
              <span className={cn('rounded-lg border border-white/15 bg-black/80 px-3 py-1 font-heading text-sm font-black backdrop-blur', outcomeColor)}>
                {impText(outcomeKey, language)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Clio's live grade panel ── */}
      <motion.div
        className="pointer-events-auto absolute right-2 top-2 sm:right-3 sm:top-3 w-48 sm:w-60 rounded-xl border border-violet-400/25 bg-black/80 p-2.5 sm:p-3 backdrop-blur"
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      >
        <div className="flex items-center gap-2">
          <ClioBadge />
          <span className="text-[10px] font-heading font-semibold text-violet-200">{impText('imp_theater_grading', language)}</span>
          <span className={cn('ml-auto rounded-md border px-2 py-0.5 text-[13px] font-black tabular-nums', GRADE_STYLE[read.grade])}>
            {read.grade}
          </span>
        </div>
        <p className="mt-1.5 text-[10.5px] leading-snug text-foreground/90">{impText(read.headlineKey, language)}</p>
        <div className="mt-1.5 flex items-center gap-1 text-[9.5px] text-muted-foreground">
          <span className="font-medium text-amber-300">{impText(TAC_KEY[playerTactic], language)}</span>
          <span>{impText('imp_read_vs', language)}</span>
          <span className="font-medium text-red-300">{impText(TAC_KEY[enemyTactic], language)}</span>
        </div>
        <div className="mt-1.5 flex items-start gap-1 border-t border-white/5 pt-1.5 text-[10px] italic text-violet-200/90">
          <span className="not-italic">🗣️</span>
          <motion.span key={clioLine} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}>{clioLine}</motion.span>
        </div>
      </motion.div>

      {/* ── Controls while the battle plays ── */}
      {!showDebrief && (
        <div className="pointer-events-auto absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <button
            onClick={onInspect}
            className="flex items-center gap-1 rounded-lg border border-white/15 bg-black/75 px-2.5 py-1.5 text-[11px] text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Film className="h-3.5 w-3.5" />{impText('imp_theater_replay3d', language)}
          </button>
          {!done && (
            <button
              onClick={() => setTickIdx(resolution.ticks.length - 1)}
              className="flex items-center gap-1 rounded-lg border border-white/15 bg-black/75 px-2.5 py-1.5 text-[11px] text-foreground/80 backdrop-blur transition-colors hover:border-white/30"
            >
              <SkipForward className="h-3.5 w-3.5" />{impText('imp_theater_skip', language)}
            </button>
          )}
        </div>
      )}

      {/* ── Clio's Debrief: the historical parallel, taught on the spot ── */}
      <AnimatePresence>
        {showDebrief && (
          <motion.div
            initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '105%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="pointer-events-auto absolute inset-x-2 bottom-2 sm:inset-x-auto sm:left-1/2 sm:w-[440px] sm:-translate-x-1/2 rounded-2xl border border-violet-400/30 bg-black/90 p-3.5 sm:p-4 backdrop-blur-md shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <ClioBadge size={18} />
              <span className="font-heading text-sm font-bold text-violet-100">{impText('imp_debrief_title', language)}</span>
              <span className={cn('ml-auto rounded-md border px-2 py-0.5 text-[12px] font-black tabular-nums', GRADE_STYLE[read.grade])}>
                {impText('imp_debrief_grade', language)} · {read.grade}
              </span>
            </div>
            <p className={cn('mt-1 font-heading text-[13px] font-bold', outcomeColor)}>{impText(outcomeKey, language)}</p>

            <div className="mt-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                <Landmark className="h-3.5 w-3.5" />
                {impText('imp_debrief_parallel', language)} · {impText(parallel.titleKey, language)}
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-foreground/90">{impText(parallel.storyKey, language)}</p>
            </div>

            <div className="mt-2 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
              <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-300" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">{impText('imp_debrief_principle', language)}</p>
                <p className="mt-0.5 text-[11.5px] font-medium italic leading-snug text-violet-100/90">{impText(parallel.principleKey, language)}</p>
              </div>
            </div>

            <button
              onClick={finish}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-primary/50 bg-primary/20 px-3 py-2 text-[12px] font-semibold text-primary transition-colors hover:bg-primary/30"
            >
              {impText('imp_debrief_continue', language)}<ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* roster nameplates, faint, under the grade panel */}
      <div className="pointer-events-none absolute right-2 sm:right-3 top-[136px] w-48 sm:w-60 text-right text-[9px] text-muted-foreground/70">
        <span className="text-amber-300/80">{playerRoster ? impText(playerRoster.nameKey, language) : ''}</span>
        {' · '}
        <span className="text-red-300/80">{enemyRoster ? impText(enemyRoster.nameKey, language) : ''}</span>
      </div>
    </div>
  );
}

function SideBar({ label, align, color, strength, morale }: {
  label: string; align: 'left' | 'right'; color: string; strength: number; morale: number;
}) {
  return (
    <div className={cn('flex-1', align === 'right' && 'text-right')}>
      <div className={cn('mb-0.5 flex items-center gap-1', align === 'right' && 'flex-row-reverse')}>
        <span className="rounded bg-black/70 px-1 font-semibold uppercase tracking-wide text-white/80 backdrop-blur">{label}</span>
        <span className="tabular-nums text-white/60">{Math.round(strength)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-black/60">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${strength}%`, background: color, marginLeft: align === 'right' ? 'auto' : undefined }} />
      </div>
      <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-black/50">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${morale}%`, background: '#7aa2f7', marginLeft: align === 'right' ? 'auto' : undefined }} />
      </div>
    </div>
  );
}
