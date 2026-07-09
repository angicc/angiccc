// ─── History 1v1 Duel Arena ───────────────────────────────────────────────────
// A friendly knowledge duel on a Clio-built battlefield. Each round both
// champions face the same history question: answer correctly and your champion
// strikes; miss and you take the blow. The opponent (a friend) is answered by
// an XP-scaled AI so the duel plays out live even when the friend is offline.
// Clio heralds the arena and calls the blows. First to break the other's HP —
// or the higher HP after the final round — wins.
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Shield, Heart, Play, Trophy, RotateCcw, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { streamChatResponse } from '@/services/aiGateway';
import {
  drawDuelQuestions, opponentSkill, opponentAnswers, pickBattlefield,
  buildDuelIntroPrompt, recordDuel, type DuelQuestion, type Battlefield,
} from './friendInteractions';

const ERA_PAL: Record<Battlefield['era'], { you: string; foe: string; sky: string; ground: string }> = {
  ancient:        { you: '#fbbf24', foe: '#c2410c', sky: '#1a1206', ground: '#3b2f1a' },
  medieval:       { you: '#60a5fa', foe: '#7c3aed', sky: '#0b1020', ground: '#1e293b' },
  'early-modern': { you: '#34d399', foe: '#0d9488', sky: '#04140f', ground: '#14342b' },
  modern:         { you: '#f87171', foe: '#b91c1c', sky: '#140607', ground: '#2a1518' },
};

const MAX_HP = 100;
const ROUNDS = 7;

// A stylised champion — banner-coloured figure holding sword & shield.
function Champion({ color, facing, striking, hurt, dead }: {
  color: string; facing: 1 | -1; striking: boolean; hurt: boolean; dead: boolean;
}) {
  return (
    <motion.div
      animate={striking ? { x: facing * 60, rotate: facing * 8 } : dead ? { rotate: facing * 80, y: 20, opacity: 0.35 } : { x: 0, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 13 }}
      style={{ transform: `scaleX(${facing})` }}
    >
      <motion.div animate={hurt ? { filter: ['brightness(1)', 'brightness(2.6)', 'brightness(1)'], x: [-4, 4, -3, 0] } : {}} transition={{ duration: 0.4 }}>
        <svg width="72" height="96" viewBox="0 0 72 96" style={{ filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.6))' }}>
          {/* sword raised */}
          <line x1="52" y1="46" x2="66" y2="14" stroke="#e2e8f0" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="66,10 70,18 62,18" fill="#f1f5f9" />
          {/* torso */}
          <rect x="26" y="34" width="22" height="34" rx="6" fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth="1.2" />
          {/* head + helm */}
          <circle cx="37" cy="24" r="10" fill={color} stroke="rgba(0,0,0,0.35)" strokeWidth="1.2" />
          <rect x="29" y="14" width="16" height="7" rx="2" fill={color} opacity="0.85" />
          {/* shield */}
          <ellipse cx="24" cy="50" rx="11" ry="17" fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth="1.6" opacity="0.95" />
          <ellipse cx="24" cy="50" rx="5" ry="9" fill="rgba(255,255,255,0.18)" />
          {/* legs */}
          <line x1="31" y1="66" x2="29" y2="90" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <line x1="43" y1="66" x2="46" y2="90" stroke={color} strokeWidth="6" strokeLinecap="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function DuelHpBar({ hp, color, name, align }: { hp: number; color: string; name: string; align: 'left' | 'right' }) {
  return (
    <div className={cn('w-44 sm:w-56', align === 'right' && 'ml-auto')}>
      <div className={cn('flex items-center gap-1.5 mb-1 text-xs font-bold', align === 'right' && 'flex-row-reverse')}>
        <Shield className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-white truncate">{name}</span>
        <span className="tabular-nums text-white/60 ml-auto flex items-center gap-0.5"><Heart className="w-3 h-3" />{Math.round(Math.max(0, hp))}</span>
      </div>
      <div className={cn('h-2.5 rounded-full bg-black/50 overflow-hidden border border-white/10', align === 'right' && 'rotate-180')}>
        <motion.div className="h-full rounded-full" style={{ background: color }} animate={{ width: `${Math.max(0, hp)}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
      </div>
    </div>
  );
}

export interface DuelProps {
  userId: string;
  playerName: string;
  opponent: { id: string; username: string; xp: number };
  language: string;
  t: Record<string, string>;
  onClose: () => void;
}

export function DuelArena({ userId, playerName, opponent, language, t, onClose }: DuelProps) {
  const bf = useRef(pickBattlefield(`${userId}:${opponent.id}:${Date.now() >> 16}`)).current;
  const pal = ERA_PAL[bf.era];
  const skill = useRef(opponentSkill(opponent.xp)).current;

  const [phase, setPhase] = useState<'herald' | 'fight' | 'over'>('herald');
  const [intro, setIntro] = useState('');
  const [questions] = useState<DuelQuestion[]>(() => drawDuelQuestions(ROUNDS));
  const [round, setRound] = useState(0);
  const [youHP, setYouHP] = useState(MAX_HP);
  const [foeHP, setFoeHP] = useState(MAX_HP);
  const [answered, setAnswered] = useState<number | null>(null);
  const [strike, setStrike] = useState<'you' | 'foe' | null>(null);
  const [call, setCall] = useState<string | null>(null);
  const [foePicked, setFoePicked] = useState<number | null>(null);
  const finishedRef = useRef(false);

  const YOU_HIT = 22;
  const FOE_HIT = 20;
  const q = questions[round];

  // Clio heralds the arena (AI, with a graceful fallback to the blurb).
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        let acc = '';
        for await (const chunk of streamChatResponse(
          [{ role: 'user', content: `Language: ${language}. ${buildDuelIntroPrompt(bf, playerName, opponent.username)}` }],
        )) acc += chunk;
        if (alive && acc.trim()) setIntro(acc.trim());
      } catch { /* fallback below */ }
    })();
    return () => { alive = false; };
  }, [bf, language, playerName, opponent.username]);

  const resolveRound = useCallback((youCorrect: boolean) => {
    // The opponent answers independently; both blows land in the same round.
    const foeCorrect = opponentAnswers(skill);
    // Reveal the option the opponent "chose".
    setFoePicked(foeCorrect ? q.correctIndex : (q.correctIndex + 1) % q.options.length);

    let nextYou = youHP, nextFoe = foeHP;
    if (youCorrect) nextFoe = Math.max(0, foeHP - YOU_HIT);
    if (foeCorrect) nextYou = Math.max(0, youHP - FOE_HIT);
    setFoeHP(nextFoe);
    setYouHP(nextYou);

    if (youCorrect && !foeCorrect) { setStrike('you'); setCall(t.fr_duel_youhit ?? 'You strike true!'); }
    else if (!youCorrect && foeCorrect) { setStrike('foe'); setCall(t.fr_duel_foehit ?? `${opponent.username} lands a blow!`); }
    else if (youCorrect && foeCorrect) { setStrike('you'); setCall(t.fr_duel_clash ?? 'Blades clash — both wounded!'); }
    else { setStrike(null); setCall(t.fr_duel_miss ?? 'Both swings go wide!'); }
  }, [q, youHP, foeHP, skill, opponent.username, t]);

  function pick(idx: number) {
    if (answered !== null || !q) return;
    setAnswered(idx);
    resolveRound(idx === q.correctIndex);
  }

  // Settle the round animation, then advance or end.
  useEffect(() => {
    if (call === null) return;
    const timer = setTimeout(() => {
      setCall(null); setStrike(null); setFoePicked(null);
      const dead = youHP <= 0 || foeHP <= 0;
      const last = round + 1 >= questions.length;
      if (dead || last) setPhase('over');
      else { setRound(r => r + 1); setAnswered(null); }
    }, 1300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call]);

  const youWon = foeHP <= 0 || (youHP > 0 && youHP >= foeHP);

  // Persist the win/loss record once.
  useEffect(() => {
    if (phase !== 'over' || finishedRef.current) return;
    finishedRef.current = true;
    recordDuel(userId, opponent.id, youWon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const tq = q; // questions already localized at the bank level; duel uses English bank

  return (
    <div className="fixed inset-0 z-[3000] flex flex-col" style={{ background: `radial-gradient(120% 90% at 50% 0%, ${pal.sky} 0%, #04060b 72%)` }}>
      {/* close */}
      <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 border border-white/15 text-white/70 hover:text-white">
        <X className="w-4 h-4" />
      </button>

      {/* ── Arena scene ── */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-[60%]" style={{
          background: `linear-gradient(${pal.ground}, #04060b)`, transform: 'perspective(560px) rotateX(54deg)', transformOrigin: 'bottom',
          boxShadow: 'inset 0 40px 90px rgba(0,0,0,0.6)',
        }}>
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent 0 54px, rgba(255,255,255,0.1) 54px 55px), repeating-linear-gradient(0deg, transparent 0 54px, rgba(255,255,255,0.07) 54px 55px)` }} />
        </div>

        {/* HP header */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-4 z-20">
          <DuelHpBar hp={youHP} color={pal.you} name={playerName} align="left" />
          <div className="text-center pt-1 shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1 justify-center"><Swords className="w-3 h-3" />{t.fr_duel_title ?? 'History 1v1'}</div>
            <div className="font-heading font-bold text-white tabular-nums text-sm">{Math.min(round + 1, questions.length)}/{questions.length}</div>
          </div>
          <DuelHpBar hp={foeHP} color={pal.foe} name={opponent.username} align="right" />
        </div>

        {/* Champions */}
        <div className="absolute inset-x-0 bottom-[22%] flex items-end justify-between px-8 sm:px-24 z-10">
          <Champion color={pal.you} facing={1} striking={strike === 'you'} hurt={strike === 'foe'} dead={youHP <= 0} />
          <Champion color={pal.foe} facing={-1} striking={strike === 'foe'} hurt={strike === 'you'} dead={foeHP <= 0} />
        </div>

        {/* Call-out banner */}
        <AnimatePresence>
          {call && (
            <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.3 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className={cn('font-heading font-extrabold text-2xl sm:text-4xl px-6 py-2 rounded-2xl border-2 backdrop-blur-sm text-center',
                strike === 'you' ? 'text-amber-300 border-amber-400/50 bg-amber-400/10' : strike === 'foe' ? 'text-rose-300 border-rose-400/50 bg-rose-400/10' : 'text-white/80 border-white/30 bg-white/10')}>
                {call}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Console ── */}
      <div className="relative z-30 border-t border-white/10 bg-black/75 backdrop-blur-md p-4 min-h-[190px]">
        {phase === 'herald' && (
          <div className="max-w-xl mx-auto text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: pal.you }} />
              <h3 className="font-heading font-bold text-white text-lg">{bf.name}</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed min-h-[2.5rem] italic">
              {intro || bf.blurb}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" className="border-white/25 bg-transparent text-white hover:bg-white/10" onClick={onClose}>
                {t.btn_cancel ?? 'Cancel'}
              </Button>
              <Button size="sm" className="gap-2" onClick={() => setPhase('fight')}>
                <Play className="w-4 h-4" />{t.fr_duel_begin ?? 'Begin the duel'}
              </Button>
            </div>
          </div>
        )}

        {phase === 'fight' && tq && (
          <div className="max-w-2xl mx-auto">
            <p className="font-semibold text-white text-sm leading-snug mb-2.5 text-center break-words">{tq.question}</p>
            <div className="grid grid-cols-2 gap-2">
              {tq.options.map((opt, idx) => {
                const isCorrect = idx === tq.correctIndex;
                const isYou = answered === idx;
                const isFoe = foePicked === idx;
                let cls = 'border-white/20 hover:border-white/50 hover:bg-white/10 text-white/85';
                if (answered !== null) {
                  if (isCorrect) cls = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-semibold';
                  else if (isYou) cls = 'border-red-500 bg-red-500/15 text-red-300';
                  else cls = 'border-white/10 text-white/30';
                }
                return (
                  <button key={idx} disabled={answered !== null} onClick={() => pick(idx)}
                    className={cn('relative border rounded-xl text-xs font-medium px-3 py-2.5 text-left transition-all leading-snug', cls)}>
                    {opt}
                    {answered !== null && isFoe && (
                      <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: pal.foe, color: '#fff' }}>
                        {opponent.username.slice(0, 6)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {answered !== null && tq.explanation && (
              <p className="text-[11px] text-white/55 mt-2 italic leading-snug text-center break-words">{tq.explanation}</p>
            )}
          </div>
        )}

        {phase === 'over' && (
          <div className="max-w-lg mx-auto text-center space-y-2">
            <Trophy className={cn('w-10 h-10 mx-auto', youWon ? 'text-amber-400' : 'text-white/30')} />
            <p className={cn('font-heading font-bold text-xl', youWon ? 'text-amber-400' : 'text-rose-400')}>
              {youWon ? (t.fr_duel_victory ?? 'Victory!') : (t.fr_duel_defeat ?? 'Defeated')}
            </p>
            <p className="text-white/60 text-sm">
              {youWon
                ? (t.fr_duel_won_desc ?? `You bested ${opponent.username} on ${bf.name}.`).replace('{name}', opponent.username).replace('{field}', bf.name)
                : (t.fr_duel_lost_desc ?? `${opponent.username} won this time. Rematch?`).replace('{name}', opponent.username)}
            </p>
            <p className="text-white/40 text-xs tabular-nums">{Math.round(Math.max(0, youHP))} HP · {Math.round(Math.max(0, foeHP))} HP</p>
            <div className="flex gap-2 justify-center pt-1">
              <Button variant="outline" size="sm" className="gap-2 border-white/25 bg-transparent text-white hover:bg-white/10" onClick={onClose}>
                <RotateCcw className="w-3.5 h-3.5" />{t.fr_duel_done ?? 'Leave arena'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
