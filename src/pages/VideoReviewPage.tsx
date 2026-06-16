import { useState, useEffect, useRef, useCallback } from 'react';
import { Film, Clock, Lock, Send, Loader2, Star, ChevronRight, RotateCcw, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AppShell } from '@/components/layout/AppShell';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { streamChatResponse } from '@/features/ai/claudeClient';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getCurrentVideo, getTimeUntilNextVideo, hasReviewedCurrentVideo,
  markCurrentVideoReviewed, getVideoXp, addVideoXp, formatCountdown,
  getVideoReviewCount,
} from '@/features/videoReview/videoReviewStore';
import { getChessRank, getNextRank, getXpToNextRank } from '@/features/ranks/chessRanks';
import type { HistoryVideo } from '@/features/videoReview/videoData';

// ── Grading system prompt ─────────────────────────────────────────────────────
const GRADE_SYSTEM = `You are Clio, Historify's strict but fair history educator. A student watched a short educational history video and wrote a review identifying its main motive/argument.

Evaluate their review SENTENCE BY SENTENCE. Be STRICT but CONSTRUCTIVE. Reward genuine insight, penalise vague generalities.

Return ONLY this JSON (no markdown, no preamble — raw JSON only):
{
  "sentenceReviews": [
    { "sentence": "exact sentence from review", "comment": "your one-sentence verdict", "quality": "excellent" }
  ],
  "overallScore": 75,
  "videoXp": 120,
  "letterGrade": "B",
  "summary": "Your 2–3 sentence overall feedback."
}

Quality values: "excellent" | "good" | "fair" | "poor"
overallScore: 0–100
videoXp: proportional to score — max 200 (90–100), 150 (75–89), 100 (60–74), 60 (45–59), 20 (<45)
letterGrade: A(90+), B(75–89), C(60–74), D(45–59), F(<45)

Grading rules:
- excellent: precise historical detail, specific facts, clear analytical insight, correctly identifies the video's thesis
- good: accurate and shows understanding, uses some specifics
- fair: correct but vague — "the video talked about history" earns fair at best
- poor: inaccurate, off-topic, or purely generic
A student who correctly identifies the VIDEO's specific main motive earns a higher grade than one who writes general history facts.`;

interface SentenceReview { sentence: string; comment: string; quality: 'excellent' | 'good' | 'fair' | 'poor'; }
interface GradeResult {
  sentenceReviews: SentenceReview[];
  overallScore: number;
  videoXp: number;
  letterGrade: string;
  summary: string;
}

const QUALITY_STYLE: Record<string, { border: string; bg: string; badge: string; label: string }> = {
  excellent: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/5',  badge: 'text-emerald-400 border-emerald-400/30', label: 'Excellent' },
  good:      { border: 'border-blue-500/40',    bg: 'bg-blue-500/5',     badge: 'text-blue-400 border-blue-400/30',       label: 'Good'      },
  fair:      { border: 'border-amber-500/40',   bg: 'bg-amber-500/5',    badge: 'text-amber-400 border-amber-400/30',     label: 'Fair'      },
  poor:      { border: 'border-red-500/40',     bg: 'bg-red-500/5',      badge: 'text-red-400 border-red-400/30',         label: 'Weak'      },
};

const GRADE_COLOR: Record<string, string> = {
  A: 'text-emerald-400', B: 'text-blue-400', C: 'text-amber-400', D: 'text-orange-400', F: 'text-red-400',
};

function formatDuration(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

// ── Countdown hook ────────────────────────────────────────────────────────────
function useCountdown() {
  const [ms, setMs] = useState(() => getTimeUntilNextVideo());
  useEffect(() => {
    const id = setInterval(() => setMs(getTimeUntilNextVideo()), 30000);
    return () => clearInterval(id);
  }, []);
  return ms;
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function VideoReviewPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { subscription } = useSubscription();
  const tier = subscription?.tier ?? 'free';

  if (tier !== 'master') {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-rose-400/10"><Film className="w-5 h-5 text-rose-400" /></div>
            <div>
              <h1 className="font-heading text-3xl font-bold">{t.vr_title}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{t.vr_subtitle}</p>
            </div>
          </motion.div>
          <UpgradePrompt title={t.vr_title} description={t.vr_master_only} requiredPlan="master" />
        </div>
      </AppShell>
    );
  }

  return <VideoReviewInner userId={currentUser?.id ?? ''} />;
}

// ── Inner component (Pro/Master only) ────────────────────────────────────────
function VideoReviewInner({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const countdown = useCountdown();
  const [video] = useState<HistoryVideo>(() => getCurrentVideo());
  const [alreadyReviewed] = useState(() => hasReviewedCurrentVideo(userId));
  const [videoXp, setVideoXp]     = useState(() => getVideoXp(userId));
  const [reviewCount, setReviewCount] = useState(() => getVideoReviewCount(userId));
  const rank                       = getChessRank(videoXp);
  const nextRank                   = getNextRank(rank);
  const xpProgress                 = getXpToNextRank(videoXp);

  const [phase, setPhase] = useState<'watch' | 'write' | 'grading' | 'done'>(
    alreadyReviewed ? 'done' : 'watch'
  );
  const [review, setReview]         = useState('');
  const [grading, setGrading]       = useState(false);
  const [result, setResult]         = useState<GradeResult | null>(null);
  const [streamBuf, setStreamBuf]   = useState('');
  const [xpEarned, setXpEarned]     = useState(0);
  const [error, setError]           = useState('');
  const textareaRef                 = useRef<HTMLTextAreaElement>(null);

  const wordCount = review.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = wordCount >= 80 && !grading;

  const handleGrade = useCallback(async () => {
    if (!canSubmit) return;
    setGrading(true);
    setPhase('grading');
    setStreamBuf('');
    setError('');

    const prompt = `Video Title: "${video.title}" (${video.channel})
Video Topic: ${video.topic}
Video Description: ${video.description}

Student Review:
${review}`;

    let buf = '';
    try {
      for await (const chunk of streamChatResponse(
        [{ role: 'user', content: prompt }],
        undefined,
        GRADE_SYSTEM,
      )) {
        buf += chunk;
        setStreamBuf(buf);
      }

      // Parse JSON result
      const jsonMatch = buf.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse Clio\'s response.');
      const parsed: GradeResult = JSON.parse(jsonMatch[0]);
      setResult(parsed);

      // Award XP
      const awarded = Math.max(20, Math.min(200, parsed.videoXp));
      const newTotal = addVideoXp(userId, awarded);
      setVideoXp(newTotal);
      setXpEarned(awarded);
      markCurrentVideoReviewed(userId);
      setReviewCount(getVideoReviewCount(userId));
      setPhase('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Grading failed. Please try again.');
      setPhase('write');
    } finally {
      setGrading(false);
    }
  }, [canSubmit, review, video, userId]);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-400/10"><Film className="w-5 h-5 text-rose-400" /></div>
            <div>
              <h1 className="font-heading text-3xl font-bold">{t.vr_title}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{t.vr_subtitle}</p>
            </div>
          </div>
          {/* Chess rank badge */}
          <Link to="/profile">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${rank.borderColor} ${rank.bgColor} cursor-pointer hover:opacity-80 transition-opacity`}>
              <span className="text-xl">{rank.icon}</span>
              <div className="text-right">
                <p className={`text-xs font-bold ${rank.color}`}>{rank.name}</p>
                <p className="text-[10px] text-muted-foreground">{videoXp} Video XP</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* XP progress to next rank */}
        {xpProgress && nextRank && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className={rank.color}>{rank.name}</span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-primary`}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress.pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className={nextRank.color}>{nextRank.name}</span>
              <span>({xpProgress.current}/{xpProgress.needed} XP)</span>
            </div>
          </motion.div>
        )}

        {/* Statistics panel */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-heading font-bold text-primary">{reviewCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Reviews Done</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-heading font-bold text-amber-400">{videoXp}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Video XP</p>
              </CardContent>
            </Card>
            <Card className={`${rank.bgColor} ${rank.borderColor}`}>
              <CardContent className="pt-4 pb-4 text-center">
                <p className={`text-xl font-heading font-bold ${rank.color}`}>{rank.icon}</p>
                <p className={`text-xs font-semibold mt-0.5 ${rank.color}`}>{rank.name}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Already reviewed — locked state */}
        {alreadyReviewed && phase === 'done' && !result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg">You've reviewed today's video!</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {t.vr_next_in} <span className="text-foreground font-medium">{formatCountdown(countdown)}</span>.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  Current video: <span className="text-foreground font-medium">{video.title}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Video + review form */}
        {!alreadyReviewed && (phase === 'watch' || phase === 'write') && (
          <>
            {/* Video embed */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="overflow-hidden">
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-heading font-bold text-base leading-snug">{video.title}</h2>
                      <p className="text-xs text-muted-foreground mt-1">{video.channel} · {video.era} Era · {formatDuration(video.durationSec)}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{video.description}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs shrink-0 ${
                      video.era === 'Ancient' ? 'text-amber-400 border-amber-400/30' :
                      video.era === 'Medieval' ? 'text-blue-400 border-blue-400/30' :
                      video.era === 'Early Modern' ? 'text-emerald-400 border-emerald-400/30' :
                      'text-rose-400 border-rose-400/30'
                    }`}>{video.era}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Prompt & review box */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    {t.vr_review_label}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Identify the video's <strong>main motive or argument</strong>. Use specific historical details from the video. Minimum 80 words. Clio will grade every sentence.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    ref={textareaRef}
                    value={review}
                    onChange={e => setReview(e.target.value)}
                    placeholder={t.vr_write_analysis}
                    className="min-h-[160px] resize-none text-sm"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className={wordCount < 80 ? 'text-muted-foreground' : 'text-emerald-400'}>
                      {wordCount} / 80 words minimum
                    </span>
                    {error && <span className="text-red-400">{error}</span>}
                  </div>
                  <Button
                    className="w-full gap-2"
                    disabled={!canSubmit || grading}
                    onClick={handleGrade}
                  >
                    {grading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.vr_grading}</> : <><Send className="w-4 h-4" /> {t.vr_submit}</>}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* Grading animation */}
        {phase === 'grading' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6 pb-6 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-sm font-medium">{t.vr_grading}</p>
                <p className="text-xs text-muted-foreground">Reading sentence by sentence — results appear shortly</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {phase === 'done' && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            {/* Grade card */}
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
              <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center shrink-0">
                      <div className={`text-6xl font-heading font-black ${GRADE_COLOR[result.letterGrade] ?? 'text-foreground'}`}>
                        {result.letterGrade}
                      </div>
                      <div className="text-sm text-muted-foreground">{result.overallScore}%</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-amber-400">+{xpEarned} Video XP earned!</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sentence-by-sentence 3D animation */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-primary" />
                Clio's Sentence-by-Sentence Verdict
              </h3>
              <div className="space-y-3" style={{ perspective: '1200px' }}>
                <AnimatePresence>
                  {result.sentenceReviews.map((sr, i) => {
                    const s = QUALITY_STYLE[sr.quality] ?? QUALITY_STYLE.fair;
                    return (
                      <motion.div
                        key={i}
                        initial={{ rotateX: -80, opacity: 0, y: 20 }}
                        animate={{ rotateX: 0, opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.28,
                          duration: 0.55,
                          ease: [0.22, 1, 0.36, 1],
                          rotateX: { duration: 0.6 },
                        }}
                        style={{ transformOrigin: 'top center' }}
                        className={`p-3.5 rounded-xl border ${s.border} ${s.bg}`}
                      >
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className={`text-[10px] shrink-0 mt-0.5 ${s.badge}`}>
                            {s.label}
                          </Badge>
                          <div className="min-w-0 space-y-1">
                            <p className="text-sm leading-relaxed">
                              <span className="text-muted-foreground italic">"{sr.sentence}"</span>
                            </p>
                            <p className="text-xs text-foreground/80">{sr.comment}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Rank update notice */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: result.sentenceReviews.length * 0.28 + 0.3 }}
            >
              <Card className={`border ${rank.borderColor} ${rank.bgColor}`}>
                <CardContent className="pt-4 pb-4 flex items-center gap-4">
                  <span className="text-3xl">{rank.icon}</span>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${rank.color}`}>{rank.name}</p>
                    <p className="text-xs text-muted-foreground">{rank.desc}</p>
                    {xpProgress && nextRank ? (
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full bg-primary rounded-full`} style={{ width: `${xpProgress.pct}%` }} />
                        </div>
                        <span>{xpProgress.current}/{xpProgress.needed} XP to {nextRank.name}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-primary mt-0.5">Maximum rank achieved!</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Total Video XP</p>
                    <p className="font-bold text-primary">{videoXp}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Next video countdown */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: result.sentenceReviews.length * 0.28 + 0.6 }}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <Clock className="w-3.5 h-3.5" />
                Next video unlocks in <span className="text-foreground font-medium">{formatCountdown(countdown)}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
