// ─── CHRONOS IMPERIUM · On-Map Battle Theatre ────────────────────────────────
// When two armies collide, the battle does not vanish into a modal — it plays
// out RIGHT ON THE LEAFLET MAP, at the exact coordinates of the contested
// province. Little formations of infantry, archers and cavalry march, loose
// volleys, lock shield walls and charge home, tick by deterministic tick from
// the combat matrix. Above them, Clio grades the tactical move the player chose
// this turn — a live S–D verdict with a one-line read that updates as the lines
// shatter, waver and rout. This is the "highly-intellectual, highly-animated"
// spine of Imperium: you are not rolling dice, you are watching your reasoning
// be tested, and being told how well you reasoned.
//
// The component anchors itself inside the map's `relative` wrapper, projecting
// map lat/lng → container pixels every frame the map moves, so the arena stays
// pinned to the ground it is fought over. All motion respects reduced-motion.
import { useEffect, useMemo, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronRight, SkipForward, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Language } from '@/i18n/translations';
import { impText } from './imperiumCatalog';
import {
  ROSTERS, rateTactic,
  type BattleResolution, type Tactic, type UnitClass, type Weather,
} from './combatMatrix';

// ── Structural battle shape (compatible with engine TurnResult['battles'][n]) ──
export interface TheaterBattle {
  pending: { id: string; territoryId: string; lat: number; lng: number };
  resolution: BattleResolution;
}

interface Props {
  battle: TheaterBattle;
  map: LeafletMap | null;
  /** Leader id of the human player — identifies which BattleSide is theirs. */
  playerLeaderId: string;
  weather: Weather;
  language: Language;
  provinceName: (id: string) => string;
  /** Advance the queue (this battle resolved / dismissed). */
  onResolved: () => void;
  /** Open the detailed CSS-3D frame-by-frame replay for this battle. */
  onInspect: () => void;
}

const PLAYER_COLOR = '#d9a54a';
const ENEMY_COLOR = '#c0455a';

const LEAD: Record<Tactic, UnitClass> = { charge: 'cavalry', volley: 'ranged', hold: 'infantry' };
const CLASS_GLYPH: Record<UnitClass, string> = { infantry: '🛡️', ranged: '🏹', cavalry: '🐎' };
// A small supporting order behind the lead, per tactic, so each side reads as a host.
const SUPPORT: Record<Tactic, UnitClass[]> = {
  charge: ['infantry', 'ranged'],
  volley: ['infantry', 'cavalry'],
  hold: ['ranged', 'cavalry'],
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

function ClioBadge() {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} aria-hidden style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="#1c0a02" stroke="#a78bfa" strokeWidth="1.4" />
      <path d="M7 8 L9 5 L12 6.5 L15 5 L17 8" fill="none" stroke="#f59e0b" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="9.5" cy="12" r="1.05" fill="#f5f0e6" />
      <circle cx="14.5" cy="12" r="1.05" fill="#f5f0e6" />
      <path d="M10 15 Q12 16.4 14 15" stroke="#c8956c" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ── A single side's formation: a lead block + a supporting order ──────────────
function Formation({
  side, tactic, color, strength, action, routed, reduce,
}: {
  side: Side;
  tactic: Tactic;
  color: string;
  strength: number;      // 0–100, drives how many tokens survive
  action: string | null; // kind of this tick's action for this side
  routed: boolean;
  reduce: boolean;
}) {
  const dir = side === 'attacker' ? 1 : -1;
  const lead = LEAD[tactic];
  const support = SUPPORT[tactic];
  const alive = Math.max(1, Math.round((strength / 100) * 5)); // 1..5 tokens

  // Formation-wide shove toward the centre on aggressive actions.
  const shove = reduce ? {}
    : action === 'charge' ? { x: [0, dir * 26, dir * 12] }
    : action === 'melee' ? { x: [0, dir * 14, dir * 5] }
    : action === 'volley' ? { x: [0, -dir * 5, 0] }
    : action === 'brace' ? { x: [0, -dir * 3, 0] }
    : {};

  const flee = routed ? { x: -dir * 120, opacity: 0, filter: 'grayscale(1)' } : {};

  return (
    <motion.div
      className="relative flex flex-col items-center gap-1"
      animate={{ ...shove, ...flee }}
      transition={routed ? { duration: 0.9, ease: 'easeIn' } : { duration: 0.5, ease: 'easeOut' }}
    >
      {/* ground shadow */}
      <div className="absolute -bottom-1 h-2 w-14 rounded-[50%] bg-black/45 blur-[2px]" />
      {/* lead block */}
      <motion.div
        key={`lead-${action}`}
        animate={reduce ? {} :
          action === 'charge' ? { x: [0, dir * 40, dir * 16], scale: [1, 1.18, 1.02], rotate: [0, dir * 4, 0] } :
          action === 'melee' ? { x: [0, dir * 22, dir * 7], rotate: [0, dir * 6, 0] } :
          action === 'volley' ? { x: [0, -dir * 8, 0], y: [0, -2, 0] } :
          action === 'brace' ? { scale: [1, 1.1, 1.03] } : {}}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 flex items-center justify-center rounded-md border text-[15px] leading-none"
        style={{
          width: 30, height: 26,
          background: `${color}26`, borderColor: `${color}`,
          boxShadow: `0 2px 8px rgba(0,0,0,.5), inset 0 0 8px ${color}33`,
        }}
      >
        <span>{CLASS_GLYPH[lead]}</span>
        {/* shield-wall bar — the distinct 'hold' signature: a solid locked wall */}
        {action === 'brace' && (
          <motion.div
            key="wall"
            initial={reduce ? { opacity: 1 } : { scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.28, ease: 'backOut' }}
            className="absolute top-1/2 -translate-y-1/2 rounded-sm"
            style={{
              [dir === 1 ? 'right' : 'left']: -7,
              width: 5, height: 30,
              background: `linear-gradient(180deg, ${color}, ${color}88)`,
              boxShadow: `0 0 8px ${color}, 0 0 2px #fff`,
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-sm"
              initial={{ opacity: 0.9 }}
              animate={reduce ? {} : { opacity: [0.9, 0.2, 0.9], y: [-14, 14, -14] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              style={{ background: 'linear-gradient(180deg, transparent, #ffffffaa, transparent)' }}
            />
          </motion.div>
        )}
      </motion.div>
      {/* supporting order — a little rank of smaller tokens */}
      <div className="flex gap-0.5 -mt-0.5">
        {Array.from({ length: Math.min(alive, 4) }).map((_, i) => {
          const cls = support[i % support.length];
          return (
            <motion.span
              key={i}
              className="flex items-center justify-center rounded-[3px] border text-[9px] leading-none"
              animate={reduce ? {} : action === 'charge'
                ? { y: [0, -2, 0], transition: { delay: i * 0.04, duration: 0.4 } } : {}}
              style={{
                width: 15, height: 14,
                background: `${color}1f`, borderColor: `${color}99`,
              }}
            >
              <span style={{ transform: side === 'defender' ? 'scaleX(-1)' : undefined }}>{CLASS_GLYPH[cls]}</span>
            </motion.span>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Per-tick effects between the two hosts (arrows, sparks, clash flash) ──────
function EffectsLayer({
  tick, triggers, dmgToPlayer, dmgToEnemy, playerSide, reduce,
}: {
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
  // side → horizontal home position (% of arena width)
  const home = (s: Side) => (s === 'attacker' ? 16 : 84);

  return (
    <div key={tick} className="pointer-events-none absolute inset-0 overflow-visible">
      {/* Volleys: arrows arc from each firing side to the other */}
      {(['attacker', 'defender'] as Side[]).flatMap(side =>
        has('volley', side)
          ? Array.from({ length: 5 }).map((_, i) => {
              const from = home(side), to = home(side === 'attacker' ? 'defender' : 'attacker');
              return (
                <motion.div
                  key={`arw-${side}-${i}`}
                  className="absolute top-1/2 h-[2px] w-2 rounded-full"
                  style={{ background: side === playerSide ? PLAYER_COLOR : ENEMY_COLOR }}
                  initial={{ left: `${from}%`, y: 0, opacity: 0 }}
                  animate={{ left: `${to}%`, y: [0, -26 - i * 3, 6], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeIn' }}
                />
              );
            })
          : [],
      )}

      {/* Charge dust streak from the charging side */}
      {(['attacker', 'defender'] as Side[]).map(side =>
        has('charge', side) ? (
          <motion.div
            key={`dust-${side}`}
            className="absolute top-1/2 h-6 -translate-y-1/2 rounded-full blur-[3px]"
            style={{
              [side === 'attacker' ? 'left' : 'right']: `${home(side)}%`,
              width: '30%',
              background: `linear-gradient(${side === 'attacker' ? 90 : 270}deg, transparent, ${side === playerSide ? PLAYER_COLOR : ENEMY_COLOR}55)`,
            }}
            initial={{ opacity: 0, scaleX: 0.3 }}
            animate={{ opacity: [0, 0.8, 0], scaleX: [0.3, 1, 1] }}
            transition={{ duration: 0.6 }}
          />
        ) : null,
      )}

      {/* Clash flash at the centre on melee/charge contact */}
      {(has('melee') || has('charge')) && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: 34, height: 34, background: 'radial-gradient(circle, #fff8e0, #f59e0b00 70%)' }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.2, 1.5, 1.9] }}
          transition={{ duration: 0.5, delay: 0.15 }}
        />
      )}

      {/* Deflect sparks when a shield wall holds */}
      {has('brace') && Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={`spk-${i}`}
          className="absolute left-1/2 top-1/2 text-[10px]"
          style={{ color: '#ffe9a8' }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], x: (Math.random() - 0.5) * 40, y: (Math.random() - 0.5) * 34 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.03 }}
        >✦</motion.span>
      ))}

      {/* Shatter bursts on whichever side lost a unit block */}
      {(['attacker', 'defender'] as Side[]).map(side =>
        has('shatter', side) ? (
          <motion.span
            key={`sht-${side}`}
            className="absolute top-1/2 -translate-y-1/2 text-[16px]"
            style={{ [side === 'attacker' ? 'left' : 'right']: `${home(side) - 4}%`, color: '#ff6b6b' }}
            initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.3, 1.6], rotate: 0 }}
            transition={{ duration: 0.6 }}
          >✸</motion.span>
        ) : null,
      )}

      {/* Floating damage numbers over each host */}
      {dmgToEnemy > 0 && (
        <motion.span
          className="absolute top-[26%] text-[11px] font-black tabular-nums"
          style={{ [enemySide === 'attacker' ? 'left' : 'right']: `${home(enemySide) - 3}%`, color: '#ffd3d3', textShadow: '0 1px 3px #000' }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: [0, 1, 1, 0], y: -20 }}
          transition={{ duration: 1 }}
        >-{dmgToEnemy}</motion.span>
      )}
      {dmgToPlayer > 0 && (
        <motion.span
          className="absolute top-[26%] text-[11px] font-black tabular-nums"
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
  useEffect(() => {
    if (done) return;
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

  const outcomeKey = resolution.winner === 'stalemate' ? 'imp_theater_draw'
    : resolution.winner === playerSide ? 'imp_theater_you_win' : 'imp_theater_you_lose';
  const outcomeColor = resolution.winner === 'stalemate' ? 'text-muted-foreground'
    : resolution.winner === playerSide ? 'text-amber-300' : 'text-red-400';

  // ── Arena geometry (clamped to stay on the map) ──
  const arenaW = Math.min(320, Math.max(220, mapSize.x - 24));
  const arenaH = 150;
  const cx = pt ? Math.max(arenaW / 2 + 8, Math.min(mapSize.x - arenaW / 2 - 8, pt.x)) : mapSize.x / 2;
  const cy = pt
    ? Math.max(arenaH / 2 + 64, Math.min(mapSize.y - arenaH / 2 - 56, pt.y))
    : mapSize.y / 2;

  if (!map) return null;

  return (
    <div className="absolute inset-0 z-[1100] overflow-hidden">
      {/* battlefield dim + subtle vignette */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ background: 'radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,.12), rgba(0,0,0,.55))' }}
      />

      {/* exact-ground pulse marker (only if the arena had to be nudged away) */}
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

      {/* ── The arena ── */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: cx, top: cy, width: arenaW, height: arenaH }}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* battlefield floor */}
        <div
          className="absolute inset-x-2 bottom-3 top-8 rounded-xl border border-white/10 overflow-hidden"
          style={{ background: 'linear-gradient(180deg, rgba(20,16,10,.55), rgba(8,6,4,.72))', backdropFilter: 'blur(2px)' }}
        >
          {/* weather sheen */}
          {weather === 'rain' || weather === 'storm' ? (
            <div className="absolute inset-0 opacity-40" style={{ background: 'repeating-linear-gradient(105deg, transparent, transparent 6px, rgba(150,180,220,.25) 7px, transparent 9px)' }} />
          ) : weather === 'snow' ? (
            <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 20%, #fff6, transparent 3px), radial-gradient(circle at 70% 60%, #fff5, transparent 2px)' }} />
          ) : weather === 'heat' ? (
            <div className="absolute inset-0 opacity-25" style={{ background: 'linear-gradient(0deg, rgba(255,160,60,.35), transparent)' }} />
          ) : null}
        </div>

        {/* title strip */}
        <div className="absolute inset-x-2 top-0 flex items-center justify-between px-1 text-[10px]">
          <span className="rounded bg-black/70 px-1.5 py-0.5 font-heading font-bold text-amber-100/90 backdrop-blur">
            {impText('imp_theater_clash', language, { territory: provinceName(pending.territoryId) })}
          </span>
          <span className="rounded bg-black/70 px-1.5 py-0.5 tabular-nums text-muted-foreground backdrop-blur">
            {impText('imp_theater_round', language)} {tickIdx < 0 ? '—' : `${Math.min(tickIdx + 1, resolution.ticks.length)}/${resolution.ticks.length}`}
          </span>
        </div>

        {/* the two hosts */}
        <div className="absolute inset-x-4 bottom-8 top-11">
          <div className="absolute left-[4%] top-1/2 -translate-y-1/2">
            <Formation
              side="attacker" tactic={resolution.attacker.tactic}
              color={playerSide === 'attacker' ? PLAYER_COLOR : ENEMY_COLOR}
              strength={view.aS} action={actionFor('attacker')}
              routed={routedSide === 'attacker'} reduce={reduce}
            />
          </div>
          <div className="absolute right-[4%] top-1/2 -translate-y-1/2">
            <Formation
              side="defender" tactic={resolution.defender.tactic}
              color={playerSide === 'defender' ? PLAYER_COLOR : ENEMY_COLOR}
              strength={view.dS} action={actionFor('defender')}
              routed={routedSide === 'defender'} reduce={reduce}
            />
          </div>
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

        {/* strength bars for You / Enemy */}
        <div className="absolute inset-x-3 bottom-0 flex items-end gap-2 text-[9px]">
          <SideBar label={impText('imp_theater_you', language)} align="left" color={PLAYER_COLOR} strength={playerS} morale={playerM} />
          <SideBar label={impText('imp_theater_enemy', language)} align="right" color={ENEMY_COLOR} strength={enemyS} morale={enemyM} />
        </div>

        {/* outcome banner */}
        <AnimatePresence>
          {done && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.6, rotateX: 40 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              style={{ transformPerspective: 600 }}
            >
              <span className={cn('rounded-lg border border-white/15 bg-black/80 px-3 py-1 font-heading text-sm font-black backdrop-blur', outcomeColor)}>
                {impText(outcomeKey, language)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Clio's live grade panel (top-right of the map) ── */}
      <motion.div
        className="pointer-events-auto absolute right-3 top-3 w-60 rounded-xl border border-violet-400/25 bg-black/80 p-3 backdrop-blur"
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

      {/* ── Controls ── */}
      <div className="pointer-events-auto absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
        <button
          onClick={onInspect}
          className="flex items-center gap-1 rounded-lg border border-white/15 bg-black/75 px-2.5 py-1.5 text-[11px] text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Film className="h-3.5 w-3.5" />{impText('imp_theater_replay3d', language)}
        </button>
        {!done ? (
          <button
            onClick={() => setTickIdx(resolution.ticks.length - 1)}
            className="flex items-center gap-1 rounded-lg border border-white/15 bg-black/75 px-2.5 py-1.5 text-[11px] text-foreground/80 backdrop-blur transition-colors hover:border-white/30"
          >
            <SkipForward className="h-3.5 w-3.5" />{impText('imp_theater_skip', language)}
          </button>
        ) : (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={onResolved}
            className="flex items-center gap-1 rounded-lg border border-primary/50 bg-primary/20 px-3 py-1.5 text-[11px] font-semibold text-primary backdrop-blur transition-colors hover:bg-primary/30"
          >
            {impText('imp_theater_next', language)}<ChevronRight className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </div>

      {/* roster nameplates, faint, under the panel */}
      <div className="pointer-events-none absolute right-3 top-[132px] w-60 text-right text-[9px] text-muted-foreground/70">
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
      <div className={cn('h-1.5 overflow-hidden rounded-full bg-black/60')}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${strength}%`, background: color, marginLeft: align === 'right' ? 'auto' : undefined }} />
      </div>
      <div className={cn('mt-0.5 h-1 overflow-hidden rounded-full bg-black/50')}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${morale}%`, background: '#7aa2f7', marginLeft: align === 'right' ? 'auto' : undefined }} />
      </div>
    </div>
  );
}
