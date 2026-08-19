// ─── AI Content Studio ────────────────────────────────────────────────────────
// Paste any historical text → Clio engineers it into a validated study kit
// (summary, key facts, flashcards, quiz questions). The student reviews each
// generated item, discards what they don't want, names the set, and it joins
// their personal library — practicable forever via the built-in flashcard
// reviewer and quiz runner, with per-set best scores and XP rewards.
import { useCallback, useMemo, useState } from 'react';
import { Wand2, FileText, Layers, HelpCircle, Sparkles, Trash2, Play, RotateCcw, CheckCircle2, XCircle, ChevronRight, BookOpen, Trophy, ArrowLeft, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { AppShell } from '@/components/layout/AppShell';
import { AiErrorCard } from '@/components/shared/AiErrorCard';
import { Flip3D } from '@/components/shared/Flip3D';
import { PlanGate } from '@/features/subscription/planGate';
import { useAuth } from '@/features/auth/AuthContext';
import { useSubscription } from '@/features/subscription/SubscriptionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { streamChatResponse } from '@/services/aiGateway';
import { addBonusXp } from '@/features/progress/progressStore';
import {
  buildStudioPrompt, parseGeneratedKit, parseRepairBatch, LANG_NAMES,
  SOURCE_MIN_CHARS, SOURCE_MAX_CHARS,
  type GeneratedKit, type StudioQuestion, type StudioRequest,
} from '@/features/studio/studioEngine';
import {
  assessKit, buildRepairPrompt, mergeRepair, type KitReport,
} from '@/features/studio/studioQuality';
import {
  listStudySets, saveStudySet, deleteStudySet, recordPracticeRun, type StudySet,
} from '@/features/studio/studySetStore';

type Phase =
  | { kind: 'create' }
  | { kind: 'review'; kit: GeneratedKit; source: string; report: KitReport }
  | { kind: 'practice'; set: StudySet }
  | { kind: 'cards'; set: StudySet };

export default function StudioPage() {
  const { t, language } = useLanguage();
  const { currentUser, refreshProgress } = useAuth();
  const { trackAiMessage, canAI } = useSubscription();
  const [phase, setPhase] = useState<Phase>({ kind: 'create' });
  const [sets, setSets] = useState<StudySet[]>(() => (currentUser ? listStudySets(currentUser.id) : []));

  const refreshSets = useCallback(() => {
    if (currentUser) setSets(listStudySets(currentUser.id));
  }, [currentUser]);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Wand2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold">{t.studio_title}</h1>
            <p className="text-muted-foreground text-sm">{t.studio_subtitle}</p>
          </div>
        </motion.div>

        <PlanGate plan="pro" description={t.studio_gate_desc}>
          {phase.kind === 'create' && (
            <CreateView
              onGenerated={(kit, source, report) => setPhase({ kind: 'review', kit, source, report })}
              sets={sets}
              onPractice={set => setPhase({ kind: 'practice', set })}
              onCards={set => setPhase({ kind: 'cards', set })}
              onDelete={id => { if (currentUser) { deleteStudySet(currentUser.id, id); refreshSets(); } }}
              canAI={canAI}
              trackAiMessage={trackAiMessage}
              language={language}
            />
          )}
          {phase.kind === 'review' && (
            <ReviewView
              kit={phase.kit}
              source={phase.source}
              report={phase.report}
              onSave={(kit, name) => {
                if (currentUser) { saveStudySet(currentUser.id, kit, name, phase.source); refreshSets(); }
                setPhase({ kind: 'create' });
              }}
              onDiscard={() => setPhase({ kind: 'create' })}
            />
          )}
          {phase.kind === 'practice' && currentUser && (
            <PracticeRunner
              set={phase.set}
              onExit={pct => {
                if (pct !== null) {
                  recordPracticeRun(currentUser.id, phase.set.id, pct);
                  if (pct >= 60) { addBonusXp(currentUser.id, 15, `${t.studio_title}: ${phase.set.name}`); refreshProgress(); }
                  refreshSets();
                }
                setPhase({ kind: 'create' });
              }}
            />
          )}
          {phase.kind === 'cards' && (
            <CardReviewer set={phase.set} onExit={() => setPhase({ kind: 'create' })} />
          )}
        </PlanGate>
      </div>
    </AppShell>
  );
}

// ─── Create: paste source, tune counts, generate ──────────────────────────────

function CreateView({ onGenerated, sets, onPractice, onCards, onDelete, canAI, trackAiMessage, language }: {
  onGenerated: (kit: GeneratedKit, source: string, report: KitReport) => void;
  sets: StudySet[];
  onPractice: (s: StudySet) => void;
  onCards: (s: StudySet) => void;
  onDelete: (id: string) => void;
  canAI: () => { allowed: boolean; reason?: string };
  trackAiMessage: () => void;
  language: string;
}) {
  const { t } = useLanguage();
  const [source, setSource] = useState('');
  const [focus, setFocus] = useState('');
  const [questionCount, setQuestionCount] = useState(6);
  const [cardCount, setCardCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [failed, setFailed] = useState(false);
  // Which pass is running, so the button can say "checking" rather than
  // appearing to hang for a second time with the same label.
  const [stage, setStage] = useState<'drafting' | 'checking'>('drafting');

  const tooShort = source.trim().length > 0 && source.trim().length < SOURCE_MIN_CHARS;

  const SYSTEM = 'You are a meticulous educational content engineer. Follow the user instructions exactly and answer only with the requested JSON.';

  /** One streamed completion, collected. */
  const ask = useCallback(async (prompt: string, maxTokens: number): Promise<string> => {
    let raw = '';
    // A full kit (summary + up to 20 flashcards + up to 10 questions with
    // explanations) is large, especially in Cyrillic; the gateway's default
    // 1024 truncates the JSON mid-array and the whole kit fails to parse.
    for await (const chunk of streamChatResponse(
      [{ role: 'user', content: prompt }], undefined, SYSTEM, maxTokens,
    )) {
      raw += chunk;
    }
    return raw;
  }, []);

  /**
   * Generate, measure, and top up what is missing.
   *
   * The old flow was one call and a shape check: whatever failed validation was
   * dropped without a word, so asking for 10 questions and receiving 6 looked
   * identical to a source that only supported 6. Now the kit is assessed —
   * grounding against the source, duplicates, answer positions, length bias —
   * and a SECOND call is spent only on the shortfall, told what was rejected
   * and what is already covered. The learner sees the verdict either way.
   */
  const generate = useCallback(async () => {
    if (loading || source.trim().length < SOURCE_MIN_CHARS) return;
    const { allowed } = canAI();
    if (!allowed) return;
    setLoading(true); setError(null); setFailed(false); setStage('drafting');
    try {
      const req: StudioRequest = {
        sourceText: source.trim(), questionCount, cardCount,
        focus: focus.trim() || undefined,
      };
      const raw = await ask(buildStudioPrompt(req, language), 4096);
      trackAiMessage();

      const parsed = parseGeneratedKit(raw);
      if (!parsed) { setFailed(true); return; }

      let { kit, report } = assessKit(parsed, req, language);

      // Exactly one repair pass. A second would cost another call for
      // diminishing returns, and an unbounded loop could burn a learner's
      // whole daily AI allowance on one study set.
      if (report.needsRepair && (report.shortfall.questions > 0 || report.shortfall.cards > 0)) {
        setStage('checking');
        const { allowed: stillAllowed } = canAI();
        if (stillAllowed) {
          const repairRaw = await ask(
            buildRepairPrompt(kit, report, req, language, LANG_NAMES[language] ?? 'English'),
            3072,
          );
          trackAiMessage();
          const extra = parseRepairBatch(repairRaw);
          if (extra) ({ kit, report } = mergeRepair(kit, extra, req, language));
        }
      }

      onGenerated(kit, source.trim(), report);
    } catch (err) {
      setError(err);
    } finally { setLoading(false); setStage('drafting'); }
  }, [loading, source, questionCount, cardCount, focus, language, canAI, trackAiMessage, onGenerated, ask]);

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="w-4 h-4 text-primary" />{t.studio_paste_label}
          </div>
          <Textarea
            value={source}
            onChange={e => setSource(e.target.value.slice(0, SOURCE_MAX_CHARS))}
            placeholder={t.studio_paste_placeholder}
            className="min-h-44 text-sm"
            disabled={loading}
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span className={tooShort ? 'text-rose-400' : ''}>{tooShort ? t.studio_source_too_short : ''}</span>
            <span>{source.trim().length.toLocaleString()} / {SOURCE_MAX_CHARS.toLocaleString()}</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">{t.studio_focus_label}</label>
              <Input value={focus} onChange={e => setFocus(e.target.value.slice(0, 60))} placeholder={t.studio_focus_placeholder} disabled={loading} className="text-sm" />
            </div>
            <CountPicker label={t.studio_questions_label} icon={HelpCircle} value={questionCount} options={[4, 6, 8, 10]} onChange={setQuestionCount} disabled={loading} />
            <CountPicker label={t.studio_cards_label} icon={Layers} value={cardCount} options={[6, 10, 14, 20]} onChange={setCardCount} disabled={loading} />
          </div>

          {failed && <p className="text-xs text-rose-400">{t.studio_generation_failed}</p>}
          {error != null && <AiErrorCard error={error} onRetry={generate} />}

          <Button className="w-full gap-2" onClick={generate} disabled={loading || source.trim().length < SOURCE_MIN_CHARS}>
            {loading
              ? <><Sparkles className="w-4 h-4 animate-pulse" />{stage === 'checking' ? t.studio_checking : t.studio_generating}</>
              : <><Wand2 className="w-4 h-4" />{t.studio_generate}</>}
          </Button>
        </CardContent>
      </Card>

      {/* Personal library */}
      <div>
        <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />{t.studio_my_sets}
        </h2>
        {sets.length === 0 && <p className="text-sm text-muted-foreground">{t.studio_no_sets}</p>}
        <div className="grid sm:grid-cols-2 gap-3">
          {[...sets].reverse().map(set => (
            <Card key={set.id} className="border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm leading-snug flex-1">{set.name}</p>
                  <button onClick={() => onDelete(set.id)} className="text-muted-foreground/50 hover:text-rose-400 transition-colors shrink-0" title={t.studio_delete_set}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <Badge variant="outline" className="px-1.5 py-0">{set.cards.length} {t.studio_flashcards}</Badge>
                  <Badge variant="outline" className="px-1.5 py-0">{set.questions.length} {t.studio_questions}</Badge>
                  {set.bestScore > 0 && (
                    <Badge variant="outline" className="px-1.5 py-0 text-amber-400 border-amber-400/40">
                      <Trophy className="w-2.5 h-2.5 mr-0.5" />{t.studio_best} {set.bestScore}%
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {set.questions.length > 0 && (
                    <Button size="sm" variant="secondary" className="flex-1 h-7 gap-1 text-xs" onClick={() => onPractice(set)}>
                      <Play className="w-3 h-3" />{t.studio_practice}
                    </Button>
                  )}
                  {set.cards.length > 0 && (
                    <Button size="sm" variant="outline" className="flex-1 h-7 gap-1 text-xs" onClick={() => onCards(set)}>
                      <Layers className="w-3 h-3" />{t.studio_review_cards}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function CountPicker({ label, icon: Icon, value, options, onChange, disabled }: {
  label: string; icon: React.ComponentType<{ className?: string }>;
  value: number; options: number[]; onChange: (n: number) => void; disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
        <Icon className="w-3 h-3" />{label}
      </label>
      <div className="flex gap-1">
        {options.map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            disabled={disabled}
            className={`flex-1 h-9 rounded-lg border text-sm font-semibold transition-colors ${value === n ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Review: curate the generated kit, then save ──────────────────────────────

function ReviewView({ kit, source, report, onSave, onDiscard }: {
  kit: GeneratedKit; source: string; report: KitReport;
  onSave: (kit: GeneratedKit, name: string) => void;
  onDiscard: () => void;
}) {
  const { t } = useLanguage();
  const [name, setName] = useState(kit.title);
  const [keptCards, setKeptCards] = useState<boolean[]>(() => kit.cards.map(() => true));
  const [keptQuestions, setKeptQuestions] = useState<boolean[]>(() => kit.questions.map(() => true));

  const finalKit = useMemo((): GeneratedKit => ({
    ...kit,
    cards: kit.cards.filter((_, i) => keptCards[i]),
    questions: kit.questions.filter((_, i) => keptQuestions[i]),
  }), [kit, keptCards, keptQuestions]);

  const keptCount = finalKit.cards.length + finalKit.questions.length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold">{t.studio_review_title}</h2>
          <p className="text-xs text-muted-foreground">{t.studio_review_subtitle}</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary/40">{keptCount} {t.studio_kept}</Badge>
      </div>

      <QualityReport report={report} />

      {kit.summary && (
        <Card className="border-border bg-primary/5">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">{t.studio_summary}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{kit.summary}</p>
          </CardContent>
        </Card>
      )}

      {kit.facts.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t.studio_facts}</p>
          <ul className="space-y-1.5">
            {kit.facts.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />{f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {kit.cards.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t.studio_flashcards} ({finalKit.cards.length}/{kit.cards.length})</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {kit.cards.map((c, i) => (
              <button
                key={c.front}
                onClick={() => setKeptCards(prev => prev.map((k, j) => j === i ? !k : k))}
                className={`text-left p-3 rounded-lg border text-xs transition-all ${keptCards[i] ? 'border-primary/40 bg-primary/5' : 'border-border opacity-40 line-through'}`}
              >
                <p className="font-semibold">{c.front}</p>
                <p className="text-muted-foreground mt-1">{c.back}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {kit.questions.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t.studio_questions} ({finalKit.questions.length}/{kit.questions.length})</p>
          <div className="space-y-2">
            {kit.questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setKeptQuestions(prev => prev.map((k, j) => j === i ? !k : k))}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${keptQuestions[i] ? 'border-primary/40 bg-primary/5' : 'border-border opacity-40'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold flex-1">{q.question}</p>
                  <Badge variant="outline" className="text-[9px] px-1 py-0 shrink-0">{q.difficulty}</Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-1 mt-2">
                  {q.options.map((o, oi) => (
                    <span key={o} className={`px-2 py-1 rounded border text-[11px] ${oi === q.correctIndex ? 'border-emerald-400/50 text-emerald-400' : 'border-border/50 text-muted-foreground'}`}>{o}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <Card className="border-border">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1.5 block">{t.studio_set_name}</label>
            <Input value={name} onChange={e => setName(e.target.value.slice(0, 60))} className="text-sm" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onDiscard} className="gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />{t.studio_discard}
            </Button>
            <Button onClick={() => onSave(finalKit, name)} disabled={keptCount === 0} className="gap-1.5">
              <CheckCircle2 className="w-4 h-4" />{t.studio_save_set}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* provenance hint */}
      <p className="text-[10px] text-muted-foreground/60 truncate">« {source.slice(0, 140)}… »</p>
    </div>
  );
}

// ─── Practice: quiz run over a saved set ──────────────────────────────────────

function PracticeRunner({ set, onExit }: { set: StudySet; onExit: (scorePct: number | null) => void }) {
  const { t } = useLanguage();
  const questions = useMemo(() => [...set.questions].sort(() => Math.random() - 0.5), [set]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q: StudioQuestion | undefined = questions[idx];
  const scorePct = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

  if (finished || !q) {
    return (
      <Card className="border-border">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className={`w-12 h-12 mx-auto ${scorePct >= 60 ? 'text-amber-400' : 'text-muted-foreground'}`} />
          <h2 className="font-heading text-2xl font-bold">{t.studio_practice_score} {Math.round(scorePct)}%</h2>
          <p className="text-sm text-muted-foreground">{correctCount} / {questions.length}</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => onExit(scorePct)} className="gap-1.5">
              <ArrowLeft className="w-4 h-4" />{t.studio_done}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onExit(null)}>
          <ArrowLeft className="w-4 h-4" />{set.name}
        </Button>
        <span className="text-xs text-muted-foreground">{idx + 1} / {questions.length}</span>
      </div>
      <Progress value={(idx / questions.length) * 100} className="h-1.5" />
      <Card className="border-border">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold leading-snug">{q.question}</h2>
            <Badge variant="outline" className="text-[10px] shrink-0">{q.difficulty}</Badge>
          </div>
          <div className="space-y-2">
            {q.options.map((o, oi) => {
              const isSel = selected === oi;
              const revealed = selected !== null;
              const isCorrect = oi === q.correctIndex;
              return (
                <button
                  key={o}
                  disabled={revealed}
                  onClick={() => {
                    setSelected(oi);
                    if (oi === q.correctIndex) setCorrectCount(c => c + 1);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                    revealed
                      ? isCorrect
                        ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300'
                        : isSel
                        ? 'border-rose-400/60 bg-rose-400/10 text-rose-300'
                        : 'border-border/50 opacity-50'
                      : 'border-border hover:border-primary/50 hover:bg-accent/40'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {revealed && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    {revealed && isSel && !isCorrect && <XCircle className="w-4 h-4 shrink-0" />}
                    {o}
                  </span>
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {selected !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-3">{q.explanation}</p>
                <Button
                  className="w-full gap-1.5"
                  onClick={() => {
                    if (idx + 1 >= questions.length) setFinished(true);
                    else { setIdx(i => i + 1); setSelected(null); }
                  }}
                >
                  {idx + 1 >= questions.length ? t.studio_done : t.btn_next}<ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Flashcard reviewer over a saved set ──────────────────────────────────────

function CardReviewer({ set, onExit }: { set: StudySet; onExit: () => void }) {
  const { t } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = set.cards[idx];
  if (!card) { onExit(); return null; }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={onExit}>
          <ArrowLeft className="w-4 h-4" />{set.name}
        </Button>
        <span className="text-xs text-muted-foreground">{idx + 1} / {set.cards.length}</span>
      </div>
      <Flip3D
        flipped={flipped}
        onClick={() => setFlipped(f => !f)}
        minHeight={224}
        front={
          <div className="w-full h-full min-h-56 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors p-8 flex flex-col items-center justify-center text-center gap-3 shadow-lg">
            <Badge variant="outline" className="text-[10px]">{t.studio_show_answer}</Badge>
            <p className="font-heading text-xl font-bold leading-snug">{card.front}</p>
          </div>
        }
        back={
          <div className="w-full h-full min-h-56 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex flex-col items-center justify-center text-center gap-3 shadow-lg">
            <Badge variant="outline" className="text-[10px] text-primary border-primary/40">{t.flash_answer}</Badge>
            <p className="font-heading text-lg text-primary leading-snug">{card.back}</p>
          </div>
        }
      />
      <div className="flex gap-2">
        <Button
          variant="outline" className="flex-1 gap-1.5"
          onClick={() => { setFlipped(false); setIdx(i => (i - 1 + set.cards.length) % set.cards.length); }}
        >
          <RotateCcw className="w-3.5 h-3.5" />{t.btn_back}
        </Button>
        <Button
          className="flex-1 gap-1.5"
          onClick={() => {
            if (idx + 1 >= set.cards.length) onExit();
            else { setFlipped(false); setIdx(i => i + 1); }
          }}
        >
          {idx + 1 >= set.cards.length ? t.studio_done : t.studio_next_card}<ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}


// ─── What the generator actually produced ────────────────────────────────────
// The Studio used to hand over whatever survived validation with no account of
// what it threw away, so a short kit looked like a thin source and a kit full
// of length-biased questions looked fine. This says what happened, in the
// learner's language, and stays quiet when there is nothing to say.
function QualityReport({ report }: { report: KitReport }) {
  const { t } = useLanguage();
  const droppedTotal = report.dropped.questions + report.dropped.cards + report.dropped.facts;
  const biasedShare = Math.round(report.lengthBiasRate * 100);

  // Group by kind: five identical "not supported by your source" lines is
  // noise, "5 items were not supported by your source" is information.
  const counts = new Map<string, number>();
  for (const issue of report.issues) {
    if (issue.kind === 'short_count') continue;   // the shortfall line covers it
    counts.set(issue.kind, (counts.get(issue.kind) ?? 0) + 1);
  }

  const label: Record<string, string> = {
    ungrounded: t.studio_issue_ungrounded,
    invented_number: t.studio_issue_invented,
    duplicate: t.studio_issue_duplicate,
    length_bias: t.studio_issue_length_bias.replace('{pct}', String(biasedShare)),
    wrong_script: t.studio_issue_script,
  };

  if (droppedTotal === 0 && counts.size === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/5 px-3 py-2">
        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <p className="text-xs text-emerald-300/90">{t.studio_quality_clean}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber-400/25 bg-amber-400/5 px-3 py-2.5 space-y-1.5">
      <p className="text-xs font-semibold text-amber-300/90">
        {t.studio_quality_title.replace('{n}', String(droppedTotal))}
      </p>
      <ul className="space-y-1">
        {[...counts].map(([kind, n]) => (
          <li key={kind} className="flex items-start gap-2 text-[11px] text-muted-foreground">
            <span className="text-amber-400/70 mt-0.5">•</span>
            <span>{kind === 'length_bias' ? label[kind] : `${n}× ${label[kind] ?? kind}`}</span>
          </li>
        ))}
        {(report.shortfall.questions > 0 || report.shortfall.cards > 0) && (
          <li className="flex items-start gap-2 text-[11px] text-muted-foreground">
            <span className="text-amber-400/70 mt-0.5">•</span>
            <span>
              {t.studio_quality_short
                .replace('{q}', String(report.shortfall.questions))
                .replace('{c}', String(report.shortfall.cards))}
            </span>
          </li>
        )}
      </ul>
      <p className="text-[11px] text-muted-foreground/70">{t.studio_quality_hint}</p>
    </div>
  );
}
