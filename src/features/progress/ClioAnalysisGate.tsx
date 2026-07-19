// ─── Clio's Analysis Gate — post-lesson written-analysis modal ───────────────
// A 3D-staged overlay that appears after a lesson is completed. The learner
// writes a 150–300-word analysis; Clio grades it strictly (AI examiner with a
// deterministic local rubric as fallback). Grade B or better unlocks the next
// lesson. The window is dismissible — but the next lesson stays locked until
// a passing analysis is on record.
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Feather, ScrollText, Sparkles, CheckCircle2, RotateCcw, Hourglass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Lesson } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ANALYSIS_MIN_WORDS, ANALYSIS_MAX_WORDS, countWords,
  recordAnalysisAttempt, recordAnalysisPass,
} from './analysisGate';
import { gradeAnalysis, type AnalysisVerdict } from './analysisGrader';

const GATE_I18N = {
  en: {
    title: "Clio's Analysis Gate", sub: 'Prove your understanding to unlock the next lesson',
    prompt: (t: string) => `Write an analysis of "${t}" — not a summary. Argue causes, consequences, and significance in your own words.`,
    words: 'words', range: '150–300 words required', tooShort: (n: number) => `${n} more words needed`, tooLong: (n: number) => `${n} words over the limit`,
    submit: 'Submit to Clio', grading: 'Clio is deliberating…', gradingSub: 'Your analysis is being weighed against the historical record.',
    passTitle: 'The gate opens', failTitle: 'Not yet, historian', minBar: 'Minimum passing grade: B',
    strengths: 'Strengths', improvements: 'To improve', retry: 'Revise & resubmit', continueBtn: 'Continue',
    cooldownNote: 'A 30-minute reflection period is now active before your next lesson.',
    xpNote: 'Analysis bonus earned',
  },
  es: {
    title: 'La Puerta de Análisis de Clío', sub: 'Demuestra tu comprensión para desbloquear la siguiente lección',
    prompt: (t: string) => `Escribe un análisis de «${t}» — no un resumen. Argumenta causas, consecuencias y significado con tus propias palabras.`,
    words: 'palabras', range: 'Se requieren 150–300 palabras', tooShort: (n: number) => `Faltan ${n} palabras`, tooLong: (n: number) => `${n} palabras sobre el límite`,
    submit: 'Enviar a Clío', grading: 'Clío está deliberando…', gradingSub: 'Tu análisis se está contrastando con el registro histórico.',
    passTitle: 'La puerta se abre', failTitle: 'Aún no, historiador', minBar: 'Nota mínima para aprobar: B',
    strengths: 'Fortalezas', improvements: 'Para mejorar', retry: 'Revisar y reenviar', continueBtn: 'Continuar',
    cooldownNote: 'Ahora hay un período de reflexión de 30 minutos antes de tu próxima lección.',
    xpNote: 'Bono de análisis ganado',
  },
  ru: {
    title: 'Врата анализа Клио', sub: 'Докажите понимание, чтобы открыть следующий урок',
    prompt: (t: string) => `Напишите анализ урока «${t}» — не пересказ. Раскройте причины, следствия и значение своими словами.`,
    words: 'слов', range: 'Требуется 150–300 слов', tooShort: (n: number) => `Не хватает ${n} слов`, tooLong: (n: number) => `${n} слов сверх лимита`,
    submit: 'Отправить Клио', grading: 'Клио размышляет…', gradingSub: 'Ваш анализ сверяется с историческими источниками.',
    passTitle: 'Врата открываются', failTitle: 'Ещё нет, историк', minBar: 'Минимальная проходная оценка: B',
    strengths: 'Сильные стороны', improvements: 'Что улучшить', retry: 'Доработать и отправить', continueBtn: 'Продолжить',
    cooldownNote: 'Перед следующим уроком действует 30-минутный период осмысления.',
    xpNote: 'Бонус за анализ получен',
  },
  mk: {
    title: 'Портата на анализа на Клио', sub: 'Докажи го разбирањето за да ја отклучиш следната лекција',
    prompt: (t: string) => `Напиши анализа на „${t}“ — не резиме. Образложи ги причините, последиците и значењето со свои зборови.`,
    words: 'зборови', range: 'Потребни се 150–300 зборови', tooShort: (n: number) => `Недостигаат уште ${n} зборови`, tooLong: (n: number) => `${n} зборови над лимитот`,
    submit: 'Испрати ѝ на Клио', grading: 'Клио размислува…', gradingSub: 'Твојата анализа се мери според историските извори.',
    passTitle: 'Портата се отвора', failTitle: 'Сè уште не, историчару', minBar: 'Минимална преодна оценка: B',
    strengths: 'Силни страни', improvements: 'За подобрување', retry: 'Доработи и испрати повторно', continueBtn: 'Продолжи',
    cooldownNote: 'Пред следната лекција важи период на размислување од 30 минути.',
    xpNote: 'Бонус за анализа освоен',
  },
  de: {
    title: 'Klios Analyse-Tor', sub: 'Beweise dein Verständnis, um die nächste Lektion freizuschalten',
    prompt: (t: string) => `Schreibe eine Analyse zu „${t}“ — keine Zusammenfassung. Begründe Ursachen, Folgen und Bedeutung in eigenen Worten.`,
    words: 'Wörter', range: '150–300 Wörter erforderlich', tooShort: (n: number) => `Noch ${n} Wörter nötig`, tooLong: (n: number) => `${n} Wörter über dem Limit`,
    submit: 'An Klio senden', grading: 'Klio berät…', gradingSub: 'Deine Analyse wird an den historischen Quellen gemessen.',
    passTitle: 'Das Tor öffnet sich', failTitle: 'Noch nicht, Historiker', minBar: 'Mindestnote zum Bestehen: B',
    strengths: 'Stärken', improvements: 'Zu verbessern', retry: 'Überarbeiten & erneut senden', continueBtn: 'Weiter',
    cooldownNote: 'Vor der nächsten Lektion gilt nun eine 30-minütige Reflexionsphase.',
    xpNote: 'Analyse-Bonus erhalten',
  },
  fr: {
    title: "La Porte d'Analyse de Clio", sub: 'Prouve ta compréhension pour débloquer la leçon suivante',
    prompt: (t: string) => `Rédige une analyse de « ${t} » — pas un résumé. Argumente les causes, les conséquences et la portée avec tes propres mots.`,
    words: 'mots', range: '150–300 mots requis', tooShort: (n: number) => `Encore ${n} mots nécessaires`, tooLong: (n: number) => `${n} mots au-dessus de la limite`,
    submit: 'Soumettre à Clio', grading: 'Clio délibère…', gradingSub: 'Ton analyse est confrontée aux sources historiques.',
    passTitle: "La porte s'ouvre", failTitle: 'Pas encore, historien', minBar: 'Note minimale pour réussir : B',
    strengths: 'Points forts', improvements: 'À améliorer', retry: 'Réviser et resoumettre', continueBtn: 'Continuer',
    cooldownNote: 'Une période de réflexion de 30 minutes est désormais active avant ta prochaine leçon.',
    xpNote: "Bonus d'analyse obtenu",
  },
} as const;

type Phase = 'write' | 'grading' | 'result';

const GRADE_COLORS: Record<string, string> = {
  'A+': '#34d399', A: '#34d399', 'A-': '#6ee7b7',
  'B+': '#a3e635', B: '#facc15',
  'C+': '#fb923c', C: '#fb923c', D: '#f87171', F: '#ef4444',
};

/** Floating 3D Clio emblem: layered counter-rotating rings around a glowing core. */
function ClioEmblem({ deliberating }: { deliberating?: boolean }) {
  return (
    <div className="relative w-24 h-24 mx-auto" style={{ perspective: 600 }}>
      <div className={`absolute inset-0 rounded-full border-2 border-amber-400/40 ${deliberating ? 'animate-spin' : ''}`}
        style={{ transform: 'rotateX(62deg)', animationDuration: '5s' }} />
      <div className={`absolute inset-2 rounded-full border border-violet-400/40 ${deliberating ? 'animate-spin' : ''}`}
        style={{ transform: 'rotateY(58deg)', animationDuration: '3.6s', animationDirection: 'reverse' }} />
      <div className="absolute inset-4 rounded-full border border-white/15"
        style={{ transform: 'rotateX(30deg) rotateY(-24deg)' }} />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-300/30 via-amber-500/20 to-violet-600/25 border border-amber-300/50 shadow-[0_0_36px_rgba(251,191,36,0.35)] flex items-center justify-center backdrop-blur-sm">
          <ScrollText className="w-6 h-6 text-amber-200" />
        </div>
      </motion.div>
    </div>
  );
}

export function ClioAnalysisGate({
  open, lesson, userId, onClose, onPassed,
}: {
  open: boolean;
  lesson: Lesson;
  userId: string;
  onClose: () => void;
  onPassed: (verdict: AnalysisVerdict) => void;
}) {
  const { language } = useLanguage();
  const g = GATE_I18N[language as keyof typeof GATE_I18N] ?? GATE_I18N.en;
  const [phase, setPhase] = useState<Phase>('write');
  const [text, setText] = useState('');
  const [verdict, setVerdict] = useState<AnalysisVerdict | null>(null);

  const words = useMemo(() => countWords(text), [text]);
  const inRange = words >= ANALYSIS_MIN_WORDS && words <= ANALYSIS_MAX_WORDS;

  // Escape closes the window (progression stays locked — that's the deal).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && phase !== 'grading') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, phase, onClose]);

  // Fresh lesson → fresh slate.
  useEffect(() => { setPhase('write'); setText(''); setVerdict(null); }, [lesson.id]);

  async function submit() {
    if (!inRange || phase === 'grading') return;
    setPhase('grading');
    recordAnalysisAttempt(userId);
    const v = await gradeAnalysis(text, lesson);
    setVerdict(v);
    setPhase('result');
    if (v.passed) {
      recordAnalysisPass(userId, lesson.id, v.grade, v.score, words);
      onPassed(v);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#fbbf24', '#a78bfa', '#34d399', '#ffffff'] });
    }
  }

  const counterColor = words === 0 ? 'text-muted-foreground'
    : words < ANALYSIS_MIN_WORDS ? 'text-amber-400'
    : words <= ANALYSIS_MAX_WORDS ? 'text-emerald-400' : 'text-red-400';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ perspective: 1400 }}
        >
          {/* Backdrop — click dismisses (the lock persists until a pass). */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => phase !== 'grading' && onClose()} />

          <motion.div
            initial={{ opacity: 0, rotateX: 22, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, rotateX: -14, y: 40, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 210, damping: 24 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-amber-300/25 bg-gradient-to-b from-[#141225] via-[#100e1e] to-[#0b0a16] shadow-[0_24px_90px_rgba(0,0,0,0.75),0_0_50px_rgba(167,139,250,0.12)]"
          >
            {/* Golden hairline crown */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

            {phase !== 'grading' && (
              <button onClick={onClose} aria-label="Close" className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-white/70" />
              </button>
            )}

            <div className="p-6 sm:p-8">
              {phase === 'write' && (
                <div className="space-y-5">
                  <ClioEmblem />
                  <div className="text-center space-y-1">
                    <h2 className="font-heading text-2xl font-bold text-white">{g.title}</h2>
                    <p className="text-sm text-white/60">{g.sub}</p>
                  </div>
                  <div className="rounded-xl border border-violet-400/20 bg-violet-500/[0.07] p-4 text-sm text-violet-100/90 leading-relaxed flex gap-3">
                    <Feather className="w-4 h-4 mt-0.5 shrink-0 text-violet-300" />
                    <span>{g.prompt(lesson.title)}</span>
                  </div>
                  <Textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={9}
                    className="bg-black/30 border-white/10 focus-visible:ring-amber-400/40 text-[0.95rem] leading-relaxed resize-none"
                    placeholder="…"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs space-x-2">
                      <span className={`font-semibold tabular-nums ${counterColor}`}>{words} {g.words}</span>
                      <span className="text-white/40">·</span>
                      <span className="text-white/50">
                        {words < ANALYSIS_MIN_WORDS ? (words === 0 ? g.range : g.tooShort(ANALYSIS_MIN_WORDS - words))
                          : words > ANALYSIS_MAX_WORDS ? g.tooLong(words - ANALYSIS_MAX_WORDS) : g.range}
                      </span>
                    </div>
                    <Button onClick={submit} disabled={!inRange} className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold">
                      <Sparkles className="w-4 h-4" />{g.submit}
                    </Button>
                  </div>
                  <p className="text-center text-[11px] text-white/35">{g.minBar}</p>
                </div>
              )}

              {phase === 'grading' && (
                <div className="py-10 space-y-6 text-center">
                  <ClioEmblem deliberating />
                  <div className="space-y-1.5">
                    <p className="font-heading text-xl font-semibold text-white animate-pulse">{g.grading}</p>
                    <p className="text-sm text-white/50">{g.gradingSub}</p>
                  </div>
                </div>
              )}

              {phase === 'result' && verdict && (
                <div className="space-y-5">
                  {/* 3D grade-seal flip reveal */}
                  <div className="flex justify-center" style={{ perspective: 800 }}>
                    <motion.div
                      initial={{ rotateY: 180, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 130, damping: 16, delay: 0.1 }}
                      className="w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center gap-0.5"
                      style={{
                        borderColor: GRADE_COLORS[verdict.grade],
                        background: `radial-gradient(circle at 35% 30%, ${GRADE_COLORS[verdict.grade]}26, transparent 70%)`,
                        boxShadow: `0 0 44px ${GRADE_COLORS[verdict.grade]}55`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <span className="font-heading text-4xl font-black" style={{ color: GRADE_COLORS[verdict.grade] }}>{verdict.grade}</span>
                      <span className="text-[11px] text-white/60 tabular-nums">{verdict.score}/100</span>
                    </motion.div>
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="font-heading text-2xl font-bold text-white">{verdict.passed ? g.passTitle : g.failTitle}</h2>
                    {!verdict.passed && <p className="text-xs text-white/45">{g.minBar}</p>}
                  </div>

                  {verdict.feedback && (
                    <p className="text-sm text-white/75 leading-relaxed text-center max-w-lg mx-auto">{verdict.feedback}</p>
                  )}

                  <div className="grid sm:grid-cols-2 gap-3">
                    {verdict.strengths.length > 0 && (
                      <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">{g.strengths}</p>
                        <ul className="space-y-1.5">
                          {verdict.strengths.map((s, i) => (
                            <li key={i} className="text-[13px] text-white/70 flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {verdict.improvements.length > 0 && (
                      <div className="rounded-xl border border-amber-400/20 bg-amber-500/[0.06] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">{g.improvements}</p>
                        <ul className="space-y-1.5">
                          {verdict.improvements.map((s, i) => (
                            <li key={i} className="text-[13px] text-white/70 flex gap-2"><Feather className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {verdict.passed ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-xs text-white/50">
                        <Hourglass className="w-3.5 h-3.5 text-amber-300" />{g.cooldownNote}
                      </div>
                      <Button onClick={onClose} className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-semibold">
                        <CheckCircle2 className="w-4 h-4" />{g.continueBtn}
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setPhase('write')} variant="outline" className="w-full gap-2 border-amber-400/30 hover:bg-amber-400/10">
                      <RotateCcw className="w-4 h-4" />{g.retry}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
