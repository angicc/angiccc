// ─── Territory Conquest: cinematic battle arena (Master exclusive) ────────────
// A stage is a fought battle, not a worksheet. Each round has three beats:
//
//   WAR COUNCIL  — pick a tactic card (CHARGE ▷ VOLLEY ▷ HOLD ▷ CHARGE); the
//                  enemy commander picks simultaneously by era doctrine.
//   THE ORDER    — the history question is your order to the line. Correct →
//                  your tactic executes; wrong → the enemy seizes initiative.
//   RESOLUTION   — regiments charge/volley/brace with per-class sprites and
//                  full battlefield juice: arrow flights, slash arcs, impact
//                  bursts, screen shake, floating damage, morale shockwaves.
//
// Morale is a second HP track: streaks build ROUT strikes, tactical advantage
// bleeds enemy morale, and an army whose morale collapses breaks even with HP
// remaining — exactly like the battles these stages teach.
// All rules live in battle/battleEngine.ts (pure); this file only renders.
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Crown, Shield, Play, RotateCcw, Trophy, Heart, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TerritoryQuizQuestion } from '@/i18n/territoryMapQuizData';
import type { TerritoryTopic } from '@/features/content/timelineTerritoryData';
import type { Language } from '@/i18n/translations';
import { getTranslatedTerritoryQuestion } from '@/i18n/territoryMapQuizData';
import {
  createBattle, resolveRound, enemyPickTactic, battleStars, moraleBand, aliveInRegiment,
  ARMY_COMPOSITION, ERA_FLAVOR, TACTICS, STREAK_FOR_CRIT, MAX_HP, MAX_MORALE,
  type BattleState, type Tactic, type RoundResolution, type EraId,
} from './battle/battleEngine';
import { UnitSprite, ArmyBanner, type UnitPose } from './battle/unitSprites';
import {
  ShakeStage, ImpactBurst, Volley, SlashFlash, DamageFloat, RoutShockwave,
  RoundBanner, StreakPips, VictoryCinematic, ResultStars, TacticGlyph,
} from './battle/battleEffects';

// Era palette + parallax backdrop tints.
const ARMY: Record<EraId, { player: string; playerAccent: string; enemy: string; enemyAccent: string; ground: string; sky: string; horizon: string }> = {
  prehistoric:    { player: '#fb923c', playerAccent: '#9a3412', enemy: '#a16207', enemyAccent: '#713f12', ground: '#2b2114', sky: '#140d05', horizon: '#6b4a1e' },
  ancient:        { player: '#fbbf24', playerAccent: '#b45309', enemy: '#f97316', enemyAccent: '#7c2d12', ground: '#3b2f1a', sky: '#1a1206', horizon: '#6b4400' },
  byzantine:      { player: '#a78bfa', playerAccent: '#6d28d9', enemy: '#fbbf24', enemyAccent: '#b45309', ground: '#241a33', sky: '#0f0818', horizon: '#4c3573' },
  medieval:       { player: '#60a5fa', playerAccent: '#1d4ed8', enemy: '#a78bfa', enemyAccent: '#5b21b6', ground: '#1e293b', sky: '#0b1020', horizon: '#27417a' },
  'early-modern': { player: '#34d399', playerAccent: '#047857', enemy: '#2dd4bf', enemyAccent: '#0f5f5a', ground: '#14342b', sky: '#04140f', horizon: '#0d5a3f' },
  modern:         { player: '#f87171', playerAccent: '#991b1b', enemy: '#fb923c', enemyAccent: '#7c2d12', ground: '#2a1518', sky: '#140607', horizon: '#6b1f24' },
};

// Simple era-keyed horizon silhouettes for the parallax backdrop.
const BACKDROPS: Record<EraId, string> = {
  prehistoric: 'M0 60 L8 42 L16 60 L26 34 L36 60 L44 46 L54 60 L64 30 L76 60 L84 44 L92 60 L100 50 L100 100 L0 100 Z',
  ancient: 'M0 60 L8 42 L16 60 L26 34 L36 60 L44 46 L54 60 L64 30 L76 60 L84 44 L92 60 L100 50 L100 100 L0 100 Z',
  // Domes of the City — Hagia Sophia silhouette between walls and towers.
  byzantine: 'M0 60 L8 60 L8 50 L11 44 L14 50 L14 60 L26 60 L26 46 Q34 32 42 46 L42 60 L52 60 L52 48 Q58 38 64 48 L64 60 L76 60 L76 50 L79 42 L82 50 L82 60 L100 60 L100 100 L0 100 Z',
  medieval: 'M0 60 L10 60 L10 40 L13 40 L13 34 L16 40 L19 40 L19 60 L40 60 L40 45 L44 45 L44 38 L46 32 L48 38 L48 45 L52 45 L52 60 L74 60 L74 42 L78 42 L78 36 L81 42 L84 42 L84 60 L100 60 L100 100 L0 100 Z',
  'early-modern': 'M0 60 L14 60 L18 44 L22 60 L38 60 L38 48 L42 40 L46 48 L46 60 L62 60 L66 50 L70 60 L82 60 L86 46 L90 60 L100 60 L100 100 L0 100 Z',
  modern: 'M0 60 L8 60 L8 40 L14 40 L14 52 L22 52 L22 32 L30 32 L30 60 L44 60 L44 44 L54 44 L54 60 L66 60 L66 36 L74 36 L74 56 L84 56 L84 46 L92 46 L92 60 L100 60 L100 100 L0 100 Z',
};

export interface BattleOutcome { correct: number; total: number; won: boolean }

type Phase = 'briefing' | 'council' | 'order' | 'resolve' | 'over';

interface EffectFrame {
  key: number;
  resolution: RoundResolution;
}

export function BattleArena({
  topic, questions, language, legendary, playerName, t, onFinish, onExit,
}: {
  topic: TerritoryTopic;
  questions: TerritoryQuizQuestion[];
  language: Language;
  legendary: boolean;
  playerName: string;
  t: Record<string, string>;
  onFinish: (o: BattleOutcome) => void;
  onExit: () => void;
}) {
  const pal = ARMY[topic.era];
  const flavor = ERA_FLAVOR[topic.era];

  const [battle, setBattle] = useState<BattleState>(() => createBattle(topic.era, questions.length, legendary));
  const [phase, setPhase] = useState<Phase>('briefing');
  const [playerTactic, setPlayerTactic] = useState<Tactic | null>(null);
  const [enemyTactic, setEnemyTactic] = useState<Tactic | null>(null);
  const [answered, setAnswered] = useState<number | null>(null);
  const [effect, setEffect] = useState<EffectFrame | null>(null);
  const finishedRef = useRef(false);
  const effectKey = useRef(0);

  const q = questions[battle.round];
  const tq = q ? getTranslatedTerritoryQuestion(q, language) : null;

  // ── Round flow ───────────────────────────────────────────────────────────────

  const chooseTactic = useCallback((tac: Tactic) => {
    if (phase !== 'council') return;
    setPlayerTactic(tac);
    setEnemyTactic(enemyPickTactic(battle));
    setPhase('order');
  }, [phase, battle]);

  const pick = useCallback((idx: number) => {
    if (phase !== 'order' || answered !== null || !q || !playerTactic || !enemyTactic) return;
    setAnswered(idx);
    const isCorrect = idx === q.correctIndex;
    const next = resolveRound(battle, playerTactic, enemyTactic, isCorrect);
    const resolution = next.log[next.log.length - 1];
    effectKey.current += 1;
    // Short beat so the player sees the highlighted answer before the clash.
    setTimeout(() => {
      setBattle(next);
      setEffect({ key: effectKey.current, resolution });
      setPhase('resolve');
    }, 650);
  }, [phase, answered, q, playerTactic, enemyTactic, battle]);

  // After the clash settles, advance to the next council or end the battle.
  useEffect(() => {
    if (phase !== 'resolve' || !effect) return;
    const timer = setTimeout(() => {
      setEffect(null);
      setAnswered(null);
      setPlayerTactic(null);
      setEnemyTactic(null);
      setPhase(battle.over ? 'over' : 'council');
    }, effect.resolution.crit || effect.resolution.routed ? 1600 : 1250);
    return () => clearTimeout(timer);
  }, [phase, effect, battle.over]);

  // Emit the outcome exactly once.
  useEffect(() => {
    if (phase !== 'over' || finishedRef.current) return;
    finishedRef.current = true;
    onFinish({ correct: battle.correct, total: questions.length, won: battle.playerWon });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Pose choreography ────────────────────────────────────────────────────────

  const posesFor = useCallback((side: 'player' | 'enemy'): { pose: UnitPose; leadPose: UnitPose } => {
    const army = side === 'player' ? battle.player : battle.enemy;
    if (effect && phase === 'resolve') {
      const r = effect.resolution;
      if (r.attacker === side) return { pose: 'charge', leadPose: 'attack' };
      return { pose: 'hit', leadPose: 'hit' };
    }
    const band = moraleBand(army.morale);
    if (band === 'breaking') return { pose: 'waver', leadPose: 'waver' };
    return { pose: 'idle', leadPose: 'idle' };
  }, [effect, phase, battle]);

  const bannerText = (r: RoundResolution): string => {
    if (r.routed) return t.tmap_battle_rout ?? 'THE LINE BREAKS!';
    if (r.crit) return t.tmap_battle_crit ?? 'ROUT STRIKE!';
    if (r.attacker === 'player') return r.advantage ? (t.tmap_battle_advantage ?? 'Tactical advantage!') : (t.tmap_battle_hit ?? 'Direct hit!');
    return r.advantage ? (t.tmap_battle_outmaneuvered ?? 'Outmaneuvered!') : (t.tmap_battle_counter ?? 'Counter-charge!');
  };

  const tacticLabel = (tac: Tactic): string =>
    tac === 'charge' ? (t.tmap_tactic_charge ?? 'Charge')
    : tac === 'volley' ? (t.tmap_tactic_volley ?? 'Volley')
    : (t.tmap_tactic_hold ?? 'Shield wall');

  const tacticHint = (tac: Tactic): string =>
    tac === 'charge' ? (t.tmap_tactic_charge_hint ?? 'Breaks volleys · falls to a braced line')
    : tac === 'volley' ? (t.tmap_tactic_volley_hint ?? 'Shreds a braced line · ridden down by a charge')
    : (t.tmap_tactic_hold_hint ?? 'Stops a charge cold · helpless under a volley');

  const stars = battleStars(battle.correct, questions.length, battle.playerWon);
  const shakeIntensity: 0 | 1 | 2 = effect ? (effect.resolution.crit || effect.resolution.routed ? 2 : 1) : 0;
  const impactX = effect?.resolution.attacker === 'player' ? '74%' : '26%';
  const isRangedStrike = effect?.resolution.leadClass === 'ranged';

  return (
    <div className="absolute inset-0 z-[1200] flex flex-col" style={{ background: `radial-gradient(120% 90% at 50% 0%, ${pal.sky} 0%, #05070d 70%)` }}>
      {/* ── Battlefield scene ── */}
      <div className="relative flex-1 overflow-hidden">
        <ShakeStage trigger={effect?.key ?? 0} intensity={shakeIntensity}>

          {/* Parallax horizon silhouette */}
          <svg className="absolute inset-x-0 bottom-[34%] w-full h-[30%] opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={BACKDROPS[topic.era]} fill={pal.horizon} opacity="0.35" />
            <path d={BACKDROPS[topic.era]} fill="#05070d" opacity="0.5" transform="translate(6 8) scale(1.02)" />
          </svg>

          {/* Pseudo-3D ground plane with era tint + marching grid */}
          <div
            className="absolute inset-x-0 bottom-0 h-[62%]"
            style={{
              background: `linear-gradient(${pal.ground}, #05070d)`,
              transform: 'perspective(560px) rotateX(53deg)',
              transformOrigin: 'bottom',
              boxShadow: 'inset 0 40px 90px rgba(0,0,0,0.65)',
            }}
          >
            <div className="absolute inset-0 opacity-25" style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent 0 46px, rgba(255,255,255,0.12) 46px 47px), repeating-linear-gradient(0deg, transparent 0 46px, rgba(255,255,255,0.08) 46px 47px)`,
            }} />
            {/* central no-man's-land scar */}
            <div className="absolute inset-y-0 left-1/2 w-24 -translate-x-1/2 opacity-30" style={{
              background: 'radial-gradient(50% 100% at 50% 50%, rgba(0,0,0,0.8), transparent)',
            }} />
          </div>

          {/* ── HUD: HP + morale + streaks ── */}
          <div className="absolute top-3 left-4 right-4 flex items-start justify-between gap-4 z-20">
            <ArmyHud
              label={playerName} hp={battle.player.hp} morale={battle.player.morale}
              streak={battle.player.streak} color={pal.player} align="left"
              lastTactic={battle.player.lastTactic} tacticLabel={tacticLabel} t={t}
            />
            <div className="text-center pt-1 shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t.tmap_battle_round ?? 'Round'}</div>
              <div className="font-heading font-bold text-white tabular-nums text-lg">{Math.min(battle.round + 1, questions.length)}/{questions.length}</div>
              {legendary && (
                <div className="flex items-center gap-1 justify-center mt-0.5 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                  <Crown className="w-3 h-3" />{t.tmap_camp_legendary ?? 'Legendary'}
                </div>
              )}
            </div>
            <ArmyHud
              label={topic.title} hp={battle.enemy.hp} morale={battle.enemy.morale}
              streak={battle.enemy.streak} color={pal.enemy} align="right"
              lastTactic={battle.enemy.lastTactic} tacticLabel={tacticLabel} t={t}
            />
          </div>

          {/* ── Armies ── */}
          <div className="absolute inset-x-0 bottom-[18%] flex items-end justify-between px-4 sm:px-12 z-10">
            <ArmyFormation side="player" era={topic.era} hp={battle.player.hp}
              color={pal.player} accent={pal.playerAccent} facing={1} posesFor={posesFor}
              leadClass={effect?.resolution.attacker === 'player' ? effect.resolution.leadClass : null} />
            <ArmyFormation side="enemy" era={topic.era} hp={battle.enemy.hp}
              color={pal.enemy} accent={pal.enemyAccent} facing={-1} posesFor={posesFor}
              leadClass={effect?.resolution.attacker === 'enemy' ? effect.resolution.leadClass : null} />
          </div>

          {/* ── Effects layer ── */}
          {effect && (
            <>
              {isRangedStrike ? (
                <Volley
                  direction={effect.resolution.attacker === 'player' ? 1 : -1}
                  color={effect.resolution.attacker === 'player' ? pal.player : pal.enemy}
                  volleyKey={effect.key}
                  modern={topic.era === 'modern'}
                />
              ) : (
                <SlashFlash
                  x={impactX}
                  direction={effect.resolution.attacker === 'player' ? 1 : -1}
                  color={effect.resolution.attacker === 'player' ? pal.player : pal.enemy}
                  slashKey={effect.key}
                />
              )}
              <ImpactBurst x={impactX} color={effect.resolution.attacker === 'player' ? pal.player : pal.enemy} burstKey={effect.key} />
              <DamageFloat
                x={impactX}
                amount={effect.resolution.damage}
                crit={effect.resolution.crit}
                color={effect.resolution.attacker === 'player' ? '#fbbf24' : '#fb7185'}
                floatKey={effect.key}
              />
              {effect.resolution.routed && <RoutShockwave x={impactX} waveKey={effect.key} />}
              <RoundBanner
                text={bannerText(effect.resolution)}
                side={effect.resolution.attacker}
                crit={effect.resolution.crit || effect.resolution.routed}
                bannerKey={effect.key}
              />
            </>
          )}

          {phase === 'over' && <VictoryCinematic won={battle.playerWon} />}
        </ShakeStage>
      </div>

      {/* ── Bottom console ── */}
      <div className="relative z-30 border-t border-white/10 bg-black/70 backdrop-blur-md p-4 min-h-[186px]">
        {/* Briefing */}
        {phase === 'briefing' && (
          <div className="max-w-lg mx-auto text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Swords className="w-5 h-5" style={{ color: pal.player }} />
              <h3 className="font-heading font-bold text-white text-lg">{topic.title}</h3>
              {legendary && <Crown className="w-4 h-4 text-amber-400" />}
            </div>
            <p className="text-white/60 text-xs leading-relaxed">
              {t.tmap_battle_brief2 ?? 'Each round: choose a tactic at the war council, then answer the order. Correct — your tactic strikes. Wrong — theirs does. Charge beats volley, volley beats shield wall, shield wall beats charge. Break their army — or their morale.'}
            </p>
            <div className="flex items-center justify-center gap-4 text-[10px] text-white/45 uppercase tracking-wider">
              <span>{flavor.unitNames.infantry}</span>·<span>{flavor.unitNames.ranged}</span>·<span>{flavor.unitNames.cavalry}</span>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" className="border-white/25 bg-transparent text-white hover:bg-white/10" onClick={onExit}>
                {t.btn_back ?? 'Back'}
              </Button>
              <Button size="sm" className="gap-2" onClick={() => setPhase('council')}>
                <Play className="w-4 h-4" />{t.tmap_battle_start ?? 'Sound the charge'}
              </Button>
            </div>
          </div>
        )}

        {/* War council — tactic cards */}
        {phase === 'council' && (
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2.5">
              <Flag className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
              {t.tmap_battle_council ?? 'War council — choose your tactic'}
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {TACTICS.map(tac => (
                <motion.button
                  key={tac}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => chooseTactic(tac)}
                  className="group rounded-xl border border-white/20 bg-white/5 hover:border-amber-400/70 hover:bg-amber-400/10 px-3 py-3 text-center transition-colors"
                >
                  <TacticGlyph tactic={tac} className="w-7 h-7 mx-auto mb-1.5 text-white/80 group-hover:text-amber-300 transition-colors" />
                  <div className="text-xs font-bold text-white">{tacticLabel(tac)}</div>
                  <div className="text-[9.5px] text-white/45 leading-tight mt-1">{tacticHint(tac)}</div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* The order — question */}
        {phase === 'order' && tq && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              {playerTactic && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/40 bg-amber-400/10 rounded-full px-2 py-0.5">
                  <TacticGlyph tactic={playerTactic} className="w-3 h-3" />{tacticLabel(playerTactic)}
                </span>
              )}
              <span className="text-[10px] text-white/40 uppercase tracking-wider">{t.tmap_battle_order ?? 'The order'}</span>
            </div>
            <p className="font-semibold text-white text-sm leading-snug mb-2.5 text-center break-words">{tq.question}</p>
            <div className="grid grid-cols-2 gap-2">
              {tq.options.map((opt, idx) => {
                const isCorrect = idx === q!.correctIndex;
                const isSel = answered === idx;
                let cls = 'border-white/20 hover:border-white/50 hover:bg-white/10 text-white/85';
                if (answered !== null) {
                  if (isCorrect) cls = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-semibold';
                  else if (isSel) cls = 'border-red-500 bg-red-500/15 text-red-300';
                  else cls = 'border-white/10 text-white/30';
                }
                return (
                  <button key={idx} disabled={answered !== null} onClick={() => pick(idx)}
                    className={cn('border rounded-xl text-xs font-medium px-3 py-2.5 text-left transition-all leading-snug', cls)}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Resolution — explanation rides under the cinematic */}
        {phase === 'resolve' && tqPrev(questions, battle, language) && (
          <p className="max-w-2xl mx-auto text-[11px] text-white/55 italic leading-snug text-center break-words pt-3">
            {tqPrev(questions, battle, language)}
          </p>
        )}

        {/* Result */}
        {phase === 'over' && (
          <div className="max-w-lg mx-auto text-center space-y-2.5">
            <ResultStars stars={stars} />
            <p className={cn('font-heading font-bold text-lg', battle.playerWon ? 'text-emerald-400' : 'text-rose-400')}>
              {battle.playerWon ? (t.tmap_battle_won ?? 'The region is yours!') : (t.tmap_battle_lost ?? 'Your army is routed.')}
            </p>
            <p className="text-white/60 text-xs tabular-nums">
              {battle.correct}/{questions.length} {t.tmap_battle_correct ?? 'blows landed'}
              {' · '}{Math.round(Math.max(0, battle.player.hp))} HP {t.tmap_battle_left ?? 'remaining'}
              {' · '}{t.tmap_battle_morale ?? 'Morale'} {Math.round(battle.player.morale)}
            </p>
            <div className="flex gap-2 justify-center pt-1">
              <Button variant="outline" size="sm" className="gap-2 border-white/25 bg-transparent text-white hover:bg-white/10" onClick={onExit}>
                <RotateCcw className="w-3.5 h-3.5" />{t.tmap_camp_retry ?? 'Rematch'}
              </Button>
              <Button size="sm" className="gap-2" style={{ background: pal.player, color: '#000' }} onClick={onExit}>
                <Trophy className="w-3.5 h-3.5" />{t.tmap_camp_continue ?? 'March on'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Explanation of the just-resolved question (round already advanced). */
function tqPrev(questions: TerritoryQuizQuestion[], battle: BattleState, language: Language): string | null {
  const prev = questions[battle.round - 1];
  if (!prev) return null;
  return getTranslatedTerritoryQuestion(prev, language).explanation ?? null;
}

// ── HUD block: HP bar + morale bar + streak pips + last tactic ────────────────
function ArmyHud({ label, hp, morale, streak, color, align, lastTactic, tacticLabel, t }: {
  label: string; hp: number; morale: number; streak: number; color: string;
  align: 'left' | 'right'; lastTactic: Tactic | null;
  tacticLabel: (tac: Tactic) => string; t: Record<string, string>;
}) {
  return (
    <div className={cn('w-44 sm:w-52', align === 'right' && 'ml-auto')}>
      <div className={cn('flex items-center gap-1.5 mb-1 text-[11px] font-bold', align === 'right' && 'flex-row-reverse')}>
        <Shield className="w-3 h-3 shrink-0" style={{ color }} />
        <span className="text-white/90 truncate">{label}</span>
        <span className="tabular-nums text-white/60 ml-auto flex items-center gap-0.5 shrink-0">
          <Heart className="w-2.5 h-2.5" />{Math.round(hp)}
        </span>
      </div>
      <div className={cn('h-2 rounded-full bg-black/50 overflow-hidden border border-white/10', align === 'right' && 'rotate-180')}>
        <motion.div className="h-full rounded-full" style={{ background: color }}
          animate={{ width: `${Math.max(0, (hp / MAX_HP) * 100)}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
      </div>
      {/* morale */}
      <div className={cn('h-1 mt-1 rounded-full bg-black/50 overflow-hidden border border-white/5', align === 'right' && 'rotate-180')}>
        <motion.div className="h-full rounded-full"
          style={{ background: morale > 55 ? '#a3e635' : morale > 25 ? '#facc15' : '#fb7185' }}
          animate={{ width: `${Math.max(0, (morale / MAX_MORALE) * 100)}%` }} transition={{ duration: 0.5 }} />
      </div>
      <div className={cn('flex items-center gap-2 mt-1', align === 'right' && 'flex-row-reverse')}>
        <StreakPips streak={streak} threshold={STREAK_FOR_CRIT} color={color} />
        {lastTactic && (
          <span className="text-[9px] text-white/40 uppercase tracking-wider flex items-center gap-1">
            <TacticGlyph tactic={lastTactic} className="w-2.5 h-2.5" />{tacticLabel(lastTactic)}
          </span>
        )}
      </div>
      <span className="sr-only">{t.tmap_battle_morale ?? 'Morale'}: {Math.round(morale)}</span>
    </div>
  );
}

// ── Army formation: regiments of class sprites + rear banner ──────────────────
function ArmyFormation({ side, era, hp, color, accent, facing, posesFor, leadClass }: {
  side: 'player' | 'enemy'; era: EraId; hp: number; color: string; accent: string;
  facing: 1 | -1; posesFor: (side: 'player' | 'enemy') => { pose: UnitPose; leadPose: UnitPose };
  leadClass: string | null;
}) {
  const { pose, leadPose } = posesFor(side);
  // Banner leads the formation visually on the outside edge.
  const regiments = useMemo(() => ARMY_COMPOSITION.map((spec, i) => ({ spec, i })), []);
  return (
    <div className={cn('flex items-end gap-2', facing === -1 && 'flex-row-reverse')}>
      <ArmyBanner color={color} facing={facing} />
      <div className={cn('flex items-end gap-1.5', facing === -1 && 'flex-row-reverse')}>
        {regiments.map(({ spec, i }) => {
          const alive = aliveInRegiment(spec, hp, i);
          const isLead = leadClass === spec.cls;
          return (
            <div key={spec.cls} className={cn('flex items-end', spec.cls === 'ranged' ? 'gap-1' : 'gap-0.5')}>
              {Array.from({ length: spec.count }).map((_, j) => (
                <UnitSprite
                  key={j}
                  era={era}
                  cls={spec.cls}
                  color={color}
                  accent={accent}
                  facing={facing}
                  pose={j >= alive ? 'dead' : isLead ? leadPose : pose}
                  delay={j * 0.08 + i * 0.1}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
