import { useState, useEffect } from 'react';
import { useAuditStore } from '../../store/auditState';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';
import { Target, CheckCircle2, XCircle, Lock, Zap, Clock } from 'lucide-react';

type Puzzle = {
  id: number;
  question: string;
  content?: string;
  options: string[];
  correct: number;
  explanation: string;
};

const PUZZLES: Puzzle[] = [
  {
    id: 0,
    question: 'Which phrase in this subject line is most likely to trigger a spam filter?',
    content: '"Act NOW — Your FREE Outreach Audit is GUARANTEED to 2X your pipeline immediately!"',
    options: ['Act NOW', 'FREE Outreach Audit', 'GUARANTEED to 2X', 'immediately'],
    correct: 2,
    explanation: '"GUARANTEED" combined with a performance claim creates a high-risk spam score. ESPs flag absolute guarantees paired with revenue promises as classic spam patterns.',
  },
  {
    id: 1,
    question: 'This follow-up email has a critical conversion error. What is it?',
    content: '"Hi {{firstName}}, following up — let me know if Tuesday works? Or Wednesday? Or Thursday afternoon? Or next Monday? Completely up to you!"',
    options: ['No personalization tokens', 'Too many scheduling options (choice paralysis)', 'Missing a CTA', 'Subject line too short'],
    correct: 1,
    explanation: 'Offering more than 2 scheduling options creates choice paralysis. Studies show 3+ options reduce booking rate by ~35%. Limit to: "Tuesday or Wednesday — which works better?"',
  },
  {
    id: 2,
    question: 'A prospect replied: "We just renewed with a competitor for 2 years." What\'s the BEST immediate response?',
    options: [
      'Push harder — ask them to switch now',
      'Ask for a referral immediately',
      'Acknowledge it, ask about the renewal date, set a 90-day reminder',
      'Close the lead as permanently lost',
    ],
    correct: 2,
    explanation: 'Competitor-displaced prospects convert at 3x the rate of cold leads — but only when re-engaged near the renewal window. The 90-day check-in is the highest-ROI play.',
  },
  {
    id: 3,
    question: 'Your sequence\'s open rate drops sharply from 43% → 16% between Step 2 and Step 3. Most likely cause?',
    options: [
      'Subject line fatigue (gradual degradation)',
      'Send time mismatch for that day of week',
      'Domain entered Spam/Promotions tab at Step 3',
      'List quality degradation',
    ],
    correct: 2,
    explanation: 'A sudden drop (not gradual) at a specific step almost always indicates an ESP deliverability filter triggered by that email — not subject fatigue, which degrades gradually across all steps.',
  },
  {
    id: 4,
    question: 'Which DMARC policy fully prevents email spoofing?',
    options: [
      'p=none (monitoring only)',
      'p=quarantine (routes to spam folder)',
      'p=reject (blocks delivery entirely)',
      'DMARC is optional — SPF alone is sufficient',
    ],
    correct: 2,
    explanation: 'p=reject is the only policy that fully blocks spoofed emails. p=none monitors without protecting. p=quarantine routes spoofed mail to spam instead of rejecting it — still exploitable.',
  },
  {
    id: 5,
    question: 'You\'ve sent to 1,000 leads and 230 bounced. What should you do immediately?',
    options: [
      'Nothing — 23% bounce is within normal B2B range',
      'Stop sending immediately — domain blacklisting risk is active',
      'Switch to a different subject line',
      'Send a re-engagement sequence to the bounced addresses',
    ],
    correct: 1,
    explanation: 'Any bounce rate above 5% triggers ESP reputation damage. At 23%, your domain is at immediate blacklisting risk. Pause sending, clean the list, and re-verify before resuming.',
  },
];

function formatCountdown(ms: number): string {
  const totalSecs = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
}

export default function DailyPuzzle() {
  const { puzzleLastSolvedEpoch, setPuzzleSolved, xp } = useAuditStore();

  const currentEpoch = Math.floor(Date.now() / (12 * 60 * 60 * 1000));
  const puzzleIndex = currentEpoch % PUZZLES.length;
  const puzzle = PUZZLES[puzzleIndex];
  const alreadySolved = puzzleLastSolvedEpoch === currentEpoch;

  const nextRefreshMs = (currentEpoch + 1) * 12 * 60 * 60 * 1000;
  const [countdown, setCountdown] = useState(nextRefreshMs - Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCountdown(nextRefreshMs - Date.now()), 1000);
    return () => clearInterval(interval);
  }, [nextRefreshMs]);

  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleAnswer(idx: number) {
    if (revealed || alreadySolved) return;
    setSelected(idx);
  }

  function handleSubmit() {
    if (selected === null || revealed) return;
    setRevealed(true);
    if (selected === puzzle.correct) {
      setPuzzleSolved();
    }
  }

  const isCorrect = selected === puzzle.correct;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Daily Puzzle</h2>
          <p className="text-sm text-slate-500 mt-1">Test your B2B outreach knowledge. Refreshes every 12 hours. Solve it for +50 XP.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-900 border border-white/[0.07] px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono">{formatCountdown(countdown)}</span>
        </div>
      </div>

      {/* XP display */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <Zap className="w-4 h-4 text-indigo-400" />
        <span className="text-sm text-indigo-300">Your XP: <span className="font-black text-white">{xp}</span></span>
        {alreadySolved && (
          <span className="ml-auto text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> +50 XP earned today
          </span>
        )}
      </div>

      {/* Puzzle card */}
      <PremiumCard glow={alreadySolved ? 'emerald' : 'none'}>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-amber-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Puzzle #{(puzzleIndex + 1).toString().padStart(2, '0')}</span>
          {alreadySolved && (
            <span className="ml-auto text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">SOLVED ✓</span>
          )}
        </div>

        <p className="text-sm font-semibold text-slate-200 mb-3 leading-relaxed">{puzzle.question}</p>

        {puzzle.content && (
          <div className="mb-4 p-3 rounded-xl bg-slate-800/60 border border-white/[0.08]">
            <p className="text-sm text-slate-300 font-mono leading-relaxed">{puzzle.content}</p>
          </div>
        )}

        <div className="space-y-2 mb-5">
          {puzzle.options.map((opt, i) => {
            let style = 'bg-slate-900/40 border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-slate-300';
            if (alreadySolved && i === puzzle.correct) {
              style = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
            } else if (revealed) {
              if (i === puzzle.correct) style = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
              else if (i === selected) style = 'bg-red-500/10 border-red-500/30 text-red-300';
              else style = 'bg-slate-900/20 border-white/[0.04] text-slate-600';
            } else if (selected === i) {
              style = 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300';
            }

            const locked = alreadySolved || revealed;

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={locked}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${style} ${locked ? 'cursor-default' : ''}`}
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
                {(revealed || alreadySolved) && i === puzzle.correct && (
                  <CheckCircle2 className="ml-auto w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
                {revealed && i === selected && i !== puzzle.correct && (
                  <XCircle className="ml-auto w-4 h-4 text-red-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {alreadySolved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs font-semibold text-emerald-400 mb-1">Explanation</p>
            <p className="text-sm text-slate-300 leading-relaxed">{puzzle.explanation}</p>
          </div>
        )}

        {revealed && !alreadySolved && (
          <div className={`p-4 rounded-xl ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
            <p className={`text-xs font-semibold mb-1 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {isCorrect ? '✓ Correct! +50 XP awarded' : '✗ Incorrect'}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{puzzle.explanation}</p>
          </div>
        )}

        {!revealed && !alreadySolved && (
          <GlowButton
            variant="primary"
            icon={<Target className="w-4 h-4" />}
            onClick={handleSubmit}
          >
            Submit Answer
          </GlowButton>
        )}

        {alreadySolved && (
          <div className="flex items-center gap-2 mt-2 text-slate-500">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-xs">Next puzzle unlocks in {formatCountdown(countdown)}</span>
          </div>
        )}
      </PremiumCard>
    </div>
  );
}
