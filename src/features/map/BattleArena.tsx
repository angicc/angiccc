// ─── Territory Conquest: animated battle arena ────────────────────────────────
// A stage is fought, not quizzed. Two armies face off on a pseudo-3D
// battlefield (a perspective-tilted ground plane with ranked soldier sprites).
// Each history question is a clash: a correct answer sends YOUR line charging
// and cuts down enemy ranks; a wrong answer lets the enemy counter-charge. The
// battle ends when one army breaks (HP → 0) or the questions run out, and the
// margin of victory sets the star rating. The knowledge test is the same, but
// the experience is a game, not a worksheet.
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Crown, Shield, Play, RotateCcw, Trophy, Star as StarIcon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TerritoryQuizQuestion } from '@/i18n/territoryMapQuizData';
import type { TerritoryTopic } from '@/features/content/timelineTerritoryData';
import type { Language } from '@/i18n/translations';
import { getTranslatedTerritoryQuestion } from '@/i18n/territoryMapQuizData';

type EraId = TerritoryTopic['era'];

// Per-era army palette — the banner colours already used across the map.
const ARMY: Record<EraId, { player: string; enemy: string; ground: string; sky: string }> = {
  ancient:        { player: '#fbbf24', enemy: '#b45309', ground: '#3b2f1a', sky: '#1a1206' },
  medieval:       { player: '#60a5fa', enemy: '#7c3aed', ground: '#1e293b', sky: '#0b1020' },
  'early-modern': { player: '#34d399', enemy: '#0d9488', ground: '#14342b', sky: '#04140f' },
  modern:         { player: '#f87171', enemy: '#b91c1c', ground: '#2a1518', sky: '#140607' },
};

const MAX_HP = 100;

// A single stylised soldier sprite (SVG) — a shield-and-spear silhouette.
function Soldier({ color, dead, facing }: { color: string; dead: boolean; facing: 1 | -1 }) {
  return (
    <motion.div
      initial={false}
      animate={dead ? { opacity: 0, y: 14, rotate: facing * 55 } : { opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{ transform: `scaleX(${facing})` }}
      className="relative"
    >
      <svg width="26" height="34" viewBox="0 0 26 34" style={{ filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.55))' }}>
        {/* spear */}
        <line x1="19" y1="2" x2="19" y2="30" stroke="#cbd5e1" strokeWidth="1.6" />
        <polygon points="19,0 21,5 17,5" fill="#e2e8f0" />
        {/* body */}
        <rect x="8" y="12" width="9" height="15" rx="2.5" fill={color} />
        {/* head */}
        <circle cx="12.5" cy="8" r="4.2" fill={color} stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" />
        {/* shield */}
        <ellipse cx="8" cy="19" rx="4" ry="6.5" fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth="1" opacity="0.92" />
        {/* legs */}
        <line x1="10.5" y1="27" x2="10.5" y2="33" stroke={color} strokeWidth="2.4" />
        <line x1="14.5" y1="27" x2="14.5" y2="33" stroke={color} strokeWidth="2.4" />
      </svg>
    </motion.div>
  );
}

// A ranked block of soldiers; count reflects the army's remaining HP.
function Army({ color, hp, facing, charging, hit }: {
  color: string; hp: number; facing: 1 | -1; charging: boolean; hit: boolean;
}) {
  const total = 8;
  const alive = Math.max(0, Math.ceil((hp / MAX_HP) * total));
  return (
    <motion.div
      animate={charging ? { x: facing * 46 } : { x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14 }}
      className="flex items-end gap-1"
    >
      <motion.div
        animate={hit ? { filter: ['brightness(1)', 'brightness(2.4)', 'brightness(1)'] } : {}}
        transition={{ duration: 0.4 }}
        className="flex items-end gap-1"
      >
        {Array.from({ length: total }).map((_, i) => (
          <Soldier key={i} color={color} dead={i >= alive} facing={facing} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function HpBar({ hp, color, label, align }: { hp: number; color: string; label: string; align: 'left' | 'right' }) {
  return (
    <div className={cn('w-40', align === 'right' && 'ml-auto')}>
      <div className={cn('flex items-center gap-1.5 mb-1 text-[11px] font-bold', align === 'right' && 'flex-row-reverse')}>
        <Shield className="w-3 h-3" style={{ color }} />
        <span className="text-white/90 truncate">{label}</span>
        <span className="tabular-nums text-white/60 ml-auto flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" />{Math.round(hp)}</span>
      </div>
      <div className={cn('h-2 rounded-full bg-black/50 overflow-hidden border border-white/10', align === 'right' && 'rotate-180')}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${Math.max(0, hp)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export interface BattleOutcome { correct: number; total: number; won: boolean }

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
  const [phase, setPhase] = useState<'briefing' | 'fight' | 'over'>('briefing');
  const [qIdx, setQIdx] = useState(0);
  const [playerHP, setPlayerHP] = useState(MAX_HP);
  const [enemyHP, setEnemyHP] = useState(MAX_HP);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [charging, setCharging] = useState<'player' | 'enemy' | null>(null);
  const [floatDmg, setFloatDmg] = useState<{ side: 'player' | 'enemy'; amount: number; key: number } | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const finishedRef = useRef(false);
  const dmgKey = useRef(0);

  // Legendary raises the enemy's damage so only clean play wins.
  const playerHit = legendary ? 34 : 26;   // damage YOU deal on a correct answer
  const enemyHit = legendary ? 30 : 22;     // damage the enemy deals on a wrong answer

  const q = questions[qIdx];
  const tq = q ? getTranslatedTerritoryQuestion(q, language) : null;

  const resolve = useCallback((isCorrect: boolean) => {
    dmgKey.current += 1;
    if (isCorrect) {
      setCorrect(c => c + 1);
      setCharging('player');
      setBanner(t.tmap_battle_hit ?? 'Direct hit!');
      setFloatDmg({ side: 'enemy', amount: playerHit, key: dmgKey.current });
      setEnemyHP(h => Math.max(0, h - playerHit));
    } else {
      setCharging('enemy');
      setBanner(t.tmap_battle_counter ?? 'Counter-charge!');
      setFloatDmg({ side: 'player', amount: enemyHit, key: dmgKey.current });
      setPlayerHP(h => Math.max(0, h - enemyHit));
    }
  }, [playerHit, enemyHit, t]);

  function pick(idx: number) {
    if (answered !== null || !q) return;
    setAnswered(idx);
    resolve(idx === q.correctIndex);
  }

  // After a clash animation settles, advance or end the battle.
  useEffect(() => {
    if (charging === null) return;
    const timer = setTimeout(() => {
      setCharging(null);
      setBanner(null);
      setFloatDmg(null);
      const pDead = playerHP <= 0;
      const eDead = enemyHP <= 0;
      const last = qIdx + 1 >= questions.length;
      if (pDead || eDead || last) {
        setPhase('over');
      } else {
        setQIdx(i => i + 1);
        setAnswered(null);
      }
    }, 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charging]);

  // Emit the outcome once, when the battle ends.
  useEffect(() => {
    if (phase !== 'over' || finishedRef.current) return;
    finishedRef.current = true;
    onFinish({ correct, total: questions.length, won: enemyHP <= 0 || (playerHP > enemyHP) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const won = enemyHP <= 0 || (playerHP > 0 && playerHP >= enemyHP);

  return (
    <div className="absolute inset-0 z-[1200] flex flex-col" style={{ background: `radial-gradient(120% 90% at 50% 0%, ${pal.sky} 0%, #05070d 70%)` }}>
      {/* ── Battlefield scene ── */}
      <div className="relative flex-1 overflow-hidden">
        {/* pseudo-3D ground plane */}
        <div
          className="absolute inset-x-0 bottom-0 h-[62%]"
          style={{
            background: `linear-gradient(${pal.ground}, #05070d)`,
            transform: 'perspective(520px) rotateX(52deg)',
            transformOrigin: 'bottom',
            boxShadow: 'inset 0 40px 90px rgba(0,0,0,0.6)',
          }}
        >
          {/* ground grid lines for depth */}
          <div className="absolute inset-0 opacity-25" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent 0 46px, rgba(255,255,255,0.12) 46px 47px), repeating-linear-gradient(0deg, transparent 0 46px, rgba(255,255,255,0.08) 46px 47px)`,
          }} />
        </div>

        {/* HP bars */}
        <div className="absolute top-3 left-4 right-4 flex items-start justify-between gap-4 z-20">
          <HpBar hp={playerHP} color={pal.player} label={playerName} align="left" />
          <div className="text-center pt-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t.tmap_battle_round ?? 'Round'}</div>
            <div className="font-heading font-bold text-white tabular-nums">{Math.min(qIdx + 1, questions.length)}/{questions.length}</div>
          </div>
          <HpBar hp={enemyHP} color={pal.enemy} label={topic.title} align="right" />
        </div>

        {/* Armies */}
        <div className="absolute inset-x-0 bottom-[20%] flex items-end justify-between px-6 sm:px-16 z-10">
          <div className="relative">
            <Army color={pal.player} hp={playerHP} facing={1} charging={charging === 'player'} hit={charging === 'enemy'} />
            {floatDmg?.side === 'player' && (
              <motion.div key={floatDmg.key} initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: -40 }} transition={{ duration: 0.9 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 font-heading font-bold text-rose-400 text-lg">
                −{floatDmg.amount}
              </motion.div>
            )}
          </div>
          <div className="relative">
            <Army color={pal.enemy} hp={enemyHP} facing={-1} charging={charging === 'enemy'} hit={charging === 'player'} />
            {floatDmg?.side === 'enemy' && (
              <motion.div key={floatDmg.key} initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: -40 }} transition={{ duration: 0.9 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 font-heading font-bold text-amber-300 text-lg">
                −{floatDmg.amount}
              </motion.div>
            )}
          </div>
        </div>

        {/* Clash flash + banner */}
        <AnimatePresence>
          {banner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.3 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <div className={cn('font-heading font-extrabold text-3xl sm:text-4xl px-6 py-2 rounded-2xl border-2 backdrop-blur-sm',
                charging === 'player' ? 'text-amber-300 border-amber-400/50 bg-amber-400/10' : 'text-rose-300 border-rose-400/50 bg-rose-400/10')}>
                {banner}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exit */}
        <button onClick={onExit} className="absolute top-3 right-1/2 translate-x-1/2 mt-14 sm:hidden text-[11px] text-white/50" />
      </div>

      {/* ── Bottom console ── */}
      <div className="relative z-30 border-t border-white/10 bg-black/70 backdrop-blur-md p-4 min-h-[168px]">
        {/* Briefing */}
        {phase === 'briefing' && (
          <div className="max-w-lg mx-auto text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Swords className="w-5 h-5" style={{ color: pal.player }} />
              <h3 className="font-heading font-bold text-white text-lg">{topic.title}</h3>
              {legendary && <Crown className="w-4 h-4 text-amber-400" />}
            </div>
            <p className="text-white/60 text-xs leading-relaxed">
              {t.tmap_battle_brief ?? 'Answer correctly to charge and break the enemy line. A wrong answer lets them counter-charge. Rout their army to seize the region.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" className="border-white/25 bg-transparent text-white hover:bg-white/10" onClick={onExit}>
                {t.btn_back ?? 'Back'}
              </Button>
              <Button size="sm" className="gap-2" onClick={() => setPhase('fight')}>
                <Play className="w-4 h-4" />{t.tmap_battle_start ?? 'Sound the charge'}
              </Button>
            </div>
          </div>
        )}

        {/* Fight — question as the battle order */}
        {phase === 'fight' && tq && (
          <div className="max-w-2xl mx-auto">
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
            {answered !== null && tq.explanation && (
              <p className="text-[11px] text-white/55 mt-2 italic leading-snug text-center break-words">{tq.explanation}</p>
            )}
          </div>
        )}

        {/* Over — result with stars */}
        {phase === 'over' && (
          <BattleResult
            won={won} correct={correct} total={questions.length}
            playerHP={playerHP} pal={pal} t={t}
            onRetry={onExit} onContinue={onExit}
          />
        )}
      </div>
    </div>
  );
}

function BattleResult({ won, correct, total, playerHP, pal, t, onRetry, onContinue }: {
  won: boolean; correct: number; total: number; playerHP: number;
  pal: { player: string }; t: Record<string, string>; onRetry: () => void; onContinue: () => void;
}) {
  // Stars mirror the campaign scoring shown to the player.
  const ratio = total > 0 ? correct / total : 0;
  const stars = !won ? 0 : ratio === 1 ? 3 : ratio >= 0.8 ? 2 : 1;
  return (
    <div className="max-w-lg mx-auto text-center space-y-2">
      <div className="flex items-center justify-center gap-1.5">
        {[1, 2, 3].map(n => (
          <StarIcon key={n} className={cn('w-8 h-8 transition-all', n <= stars ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]' : 'text-white/15')} />
        ))}
      </div>
      <p className={cn('font-heading font-bold text-lg', won ? 'text-emerald-400' : 'text-rose-400')}>
        {won ? (t.tmap_battle_won ?? 'The region is yours!') : (t.tmap_battle_lost ?? 'Your army is routed.')}
      </p>
      <p className="text-white/60 text-xs tabular-nums">
        {correct}/{total} {t.tmap_battle_correct ?? 'blows landed'} · {Math.round(Math.max(0, playerHP))} HP {t.tmap_battle_left ?? 'remaining'}
      </p>
      <div className="flex gap-2 justify-center pt-1">
        <Button variant="outline" size="sm" className="gap-2 border-white/25 bg-transparent text-white hover:bg-white/10" onClick={onRetry}>
          <RotateCcw className="w-3.5 h-3.5" />{t.tmap_camp_retry ?? 'Rematch'}
        </Button>
        <Button size="sm" className="gap-2" style={{ background: pal.player, color: '#000' }} onClick={onContinue}>
          <Trophy className="w-3.5 h-3.5" />{t.tmap_camp_continue ?? 'March on'}
        </Button>
      </div>
    </div>
  );
}
