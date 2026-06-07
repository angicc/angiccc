import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from 'framer-motion';
import { BookOpen, Brain, ScrollText, HelpCircle, ArrowRight, Crown, Zap, Layers, Globe, Flame, Star, ChevronDown, Quote, PenLine, BarChart2, CheckCircle2, XCircle, MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/shared/Logo';
import { streamChatResponse, LANDING_SYSTEM_PROMPT } from '@/features/ai/claudeClient';

// ── Data ──────────────────────────────────────────────────────────────────────

type HeroPhoto = { src: string; label: string; top: string; left?: string; right?: string; delay: number; rot: number; floatDur: number };

const HERO_PHOTOS: HeroPhoto[] = [
  { src: 'photo-1568322445389-f64ac2515020', label: 'Ancient Egypt',    top: '6%',  left: '1%',  delay: 0,    rot: -5, floatDur: 4.5 },
  { src: 'photo-1552832230-c0197dd311b5', label: 'Roman Empire',      top: '54%', left: '0%',  delay: 0.4,  rot:  3, floatDur: 5.2 },
  { src: 'photo-1603565816030-6b389eeb23cb', label: 'Classical Greece', top: '5%',  right: '1%', delay: 0.2,  rot:  4, floatDur: 4.8 },
  { src: 'photo-1516483638261-f4dbaf036963', label: 'The Renaissance', top: '54%', right: '0%', delay: 0.6,  rot: -3, floatDur: 5.5 },
];

const ERAS_SHOWCASE = [
  {
    name: 'Ancient World', range: '3000 BCE – 500 CE',
    color: 'text-amber-400', bg: 'from-amber-900/30 to-amber-950/60', border: 'border-amber-500/30',
    photo: 'photo-1568322445389-f64ac2515020',
    lessons: ['The First Civilizations', 'Classical Greece', 'The Roman Empire', 'The Ancient East', 'Ancient Egypt & Pharaohs'],
  },
  {
    name: 'Middle Ages', range: '500 – 1500 CE',
    color: 'text-blue-400', bg: 'from-blue-900/30 to-blue-950/60', border: 'border-blue-500/30',
    photo: 'photo-1548690312-e3b507d8c110',
    lessons: ['Fall of Rome & Early Middle Ages', 'Crusades & Islamic Golden Age', 'The Black Death', 'Medieval Economy & Trade Guilds'],
  },
  {
    name: 'Early Modern', range: '1500 – 1800 CE',
    color: 'text-emerald-400', bg: 'from-emerald-900/30 to-emerald-950/60', border: 'border-emerald-500/30',
    photo: 'photo-1516483638261-f4dbaf036963',
    lessons: ['Renaissance & Age of Exploration', 'The Protestant Reformation', 'Scientific Revolution', 'Age of Absolutism & Louis XIV'],
  },
  {
    name: 'Modern Era', range: '1800 – Present',
    color: 'text-rose-400', bg: 'from-rose-900/30 to-rose-950/60', border: 'border-rose-500/30',
    photo: 'photo-1477959858617-67f85cf4f1df',
    lessons: ['The Industrial Revolution', 'The World Wars', 'Cold War & Decolonization', 'Globalization', 'Age of Imperialism'],
  },
];

const TESTIMONIALS = [
  { quote: 'Finally an app that makes history feel alive. The AI tutor explained the causes of WWI better than my university professor.', author: 'Alex M.', role: 'University Student' },
  { quote: "I completed all 4 eras in a month. The quiz system keeps me hooked — I'm always chasing that perfect score.", author: 'Sarah K.', role: 'History Enthusiast' },
  { quote: 'The timeline feature is incredible. Being able to see how events connect across centuries is eye-opening.', author: 'James R.', role: 'High School Teacher' },
];

const STATS = [
  { label: 'Lessons',        value: 18,   suffix: '+' },
  { label: 'Timeline Events', value: 50,  suffix: '+' },
  { label: 'Quiz Questions',  value: 80,  suffix: '+' },
  { label: 'XP to Earn',     value: 5000, suffix: '+' },
];

const HISTORICAL_QUOTES = [
  { text: 'Those who cannot remember the past are condemned to repeat it.',                                          author: 'George Santayana'   },
  { text: 'History is not a burden on the memory but an illumination of the soul.',                                 author: 'Lord Acton'         },
  { text: 'The most effective way to destroy people is to deny and obliterate their understanding of their history.', author: 'George Orwell'    },
  { text: 'History is the version of past events that people have decided to agree upon.',                          author: 'Napoleon Bonaparte'  },
];

const FEATURES = [
  { icon: BookOpen,   title: '18 In-Depth Lessons',   desc: 'Expert-written lessons from Ancient Egypt to the Digital Age, packed with rich historical context.',      color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20'   },
  { icon: Brain,      title: 'AI Tutor — Clio',        desc: 'Ask your personal AI tutor anything about history and get clear, scholarly answers instantly.',            color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/20'    },
  { icon: ScrollText, title: 'Interactive Timeline',   desc: 'Explore 50+ pivotal events on a visual timeline, filterable by era and category.',                         color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { icon: HelpCircle, title: 'Quizzes & XP',           desc: 'Test knowledge with 80+ quiz questions, earn XP, level up, and unlock achievements.',                      color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/20'    },
  { icon: Layers,     title: 'Flashcard System',       desc: 'Reinforce learning with spaced repetition flashcards drawn from every lesson across all eras.',            color: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/20'  },
  { icon: Globe,      title: 'Leaderboard',            desc: 'Compete with learners worldwide, climb the XP rankings, and earn legendary status.',                       color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/20'    },
  { icon: PenLine,    title: 'Personal Notes',         desc: 'Capture insights as you learn — notes are linked directly to lessons and eras for easy review.',          color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/20'  },
  { icon: BarChart2,  title: 'Progress Analytics',     desc: 'Track your learning journey with detailed charts, streak stats, and achievement milestones.',               color: 'text-teal-400',    bg: 'bg-teal-400/10',    border: 'border-teal-400/20'    },
];

const IQ_QUESTIONS = [
  {
    q: 'In what year did the Western Roman Empire officially fall?',
    options: ['410 CE', '476 CE', '527 CE', '395 CE'],
    correct: 1,
    fact: '476 CE — when Romulus Augustulus was deposed by Odoacer the Goth, ending five centuries of Roman rule in the West.',
  },
  {
    q: "Which civilization invented cuneiform, one of the world's first writing systems?",
    options: ['Egyptians', 'Phoenicians', 'Sumerians', 'Persians'],
    correct: 2,
    fact: 'The Sumerians of ancient Mesopotamia developed cuneiform around 3100 BCE using wedge-shaped marks pressed into clay tablets.',
  },
  {
    q: "The Black Death killed approximately what share of Europe's population in the 14th century?",
    options: ['One in ten', 'One in five', 'One in three', 'One in two'],
    correct: 2,
    fact: "Roughly one-third of Europe's population — 25 to 50 million people — perished between 1347 and 1351.",
  },
];

// ── 3D perspective year-marker canvas ────────────────────────────────────────

function HistoryCanvas({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const YEARS = ['3100 BCE','776 BCE','44 BCE','476 CE','622 CE','1066','1215','1347','1440','1492','1517','1687','1776','1789','1865','1914','1939','1969','1989','2001'];
    const FOCAL = 600;   // perspective focal length

    let W = (canvas.width  = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    // Each particle has an x,y in "world space" and a z depth (0–900)
    const particles = YEARS.map(text => ({
      text,
      x: (Math.random() - 0.5) * W * 2.5,
      y: (Math.random() - 0.5) * H * 2.5,
      z: Math.random() * 900,
      vz: Math.random() * 1.2 + 0.4,   // flying toward viewer
      baseSize: Math.random() * 3 + 9,
      hue: Math.random() > 0.85 ? 200 : 38,   // mostly amber, rare blue
    }));

    let raf: number;

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Sort back-to-front so closer particles render on top
      particles.sort((a, b) => b.z - a.z);

      for (const p of particles) {
        // Advance z (flying toward viewer)
        p.z -= p.vz;
        if (p.z <= 0) {
          // Reset to far distance
          p.z = 900;
          p.x = (Math.random() - 0.5) * W * 2.5;
          p.y = (Math.random() - 0.5) * H * 2.5;
        }

        // Perspective projection
        const scale = FOCAL / (FOCAL + p.z);
        const sx = W / 2 + p.x * scale;
        const sy = H / 2 + p.y * scale;

        // Skip off-screen
        if (sx < -120 || sx > W + 120 || sy < -40 || sy > H + 40) continue;

        const fontSize = p.baseSize * scale;
        // Opacity rises as particle approaches
        const progress = 1 - p.z / 900;
        const opacity = Math.pow(progress, 1.5) * 0.45;

        ctx!.save();
        ctx!.globalAlpha = opacity;
        ctx!.font = `${Math.max(fontSize, 7)}px monospace`;
        ctx!.fillStyle = p.hue === 200 ? `rgba(96,165,250,1)` : `rgba(245,158,11,1)`;

        // Subtle trail: draw a faded copy slightly behind
        if (p.z < 400) {
          const prevScale = FOCAL / (FOCAL + p.z + 8);
          const px = W / 2 + p.x * prevScale;
          const py = H / 2 + p.y * prevScale;
          ctx!.globalAlpha = opacity * 0.25;
          ctx!.fillText(p.text, px, py);
          ctx!.globalAlpha = opacity;
        }

        ctx!.fillText(p.text, sx, sy);
        ctx!.restore();
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    function resize() {
      W = canvas!.width  = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />;
}

// ── Landing AI Chatbot ────────────────────────────────────────────────────────

type ChatMsg = { role: 'user' | 'assistant'; text: string };

const CHAT_SUGGESTIONS = [
  'What is Historify?',
  'How many lessons are there?',
  'What does the AI Tutor do?',
  'Tell me about the Middle Ages lessons',
  'What are the pricing plans?',
];

function LandingChatbot() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState<ChatMsg[]>([
    { role: 'assistant', text: "Hi! I'm the Historify assistant. Ask me anything about the app or history! 🏛️" }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const apiKey                = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMsg = { role: 'user', text };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (!apiKey) {
      // Graceful fallback without API key
      setTimeout(() => {
        setMsgs(prev => [...prev, {
          role: 'assistant',
          text: "Clio AI isn't connected yet — add your VITE_ANTHROPIC_API_KEY to .env.local to enable live answers. Until then, explore the app at no cost with the Get Started button!"
        }]);
        setLoading(false);
      }, 800);
      return;
    }

    const history = [...msgs, userMsg].map(m => ({ role: m.role, content: m.text }));
    let reply = '';
    setMsgs(prev => [...prev, { role: 'assistant', text: '' }]);
    try {
      for await (const chunk of streamChatResponse(history, undefined, LANDING_SYSTEM_PROMPT)) {
        reply += chunk;
        setMsgs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', text: reply };
          return updated;
        });
      }
    } catch {
      setMsgs(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', text: "Sorry, I couldn't connect right now. Try again in a moment!" };
        return updated;
      });
    }
    setLoading(false);
  }, [msgs, loading, apiKey]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="mb-4 w-[340px] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: 520 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border-b border-border shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Historify Assistant</p>
                <p className="text-xs text-muted-foreground">Ask about the app or history</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}>
                    {m.text || <span className="inline-flex gap-1 items-center"><motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration:1, repeat:Infinity }}>●</motion.span><motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration:1, repeat:Infinity, delay:0.2 }}>●</motion.span><motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration:1, repeat:Infinity, delay:0.4 }}>●</motion.span></span>}
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {msgs.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {CHAT_SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/50 hover:bg-primary/10 hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-t border-border shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                placeholder="Ask anything…"
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/60"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center text-primary-foreground relative"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.button>
    </div>
  );
}

// ── 3D mouse-tilt card ────────────────────────────────────────────────────────

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useTransform(my, [-60, 60], [5, -5]);
  const rotY = useTransform(mx, [-60, 60], [-5, 5]);

  return (
    <motion.div
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left - r.width  / 2);
        my.set(e.clientY - r.top  - r.height / 2);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Interactive IQ quiz teaser ────────────────────────────────────────────────

function IQTeaser() {
  const [step,     setStep]     = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);
  const q = IQ_QUESTIONS[step];

  function pick(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore(s => s + 1);
  }
  function advance() {
    if (step + 1 >= IQ_QUESTIONS.length) { setDone(true); return; }
    setStep(s => s + 1);
    setSelected(null);
  }
  function restart() { setStep(0); setSelected(null); setScore(0); setDone(false); }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
            <div className="font-heading text-5xl font-bold text-primary mb-2">{score}/{IQ_QUESTIONS.length}</div>
            <p className="text-muted-foreground mb-6">
              {score === 3 ? "Perfect! You're a true historian." : score >= 2 ? 'Impressive — keep exploring!' : "There's more to discover — start learning!"}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/register"><Button size="lg" className="gap-2">Start Learning Free <ArrowRight className="w-4 h-4" /></Button></Link>
              <Button variant="outline" onClick={restart}>Try Again</Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key={step} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Q{step + 1}/{IQ_QUESTIONS.length}</span>
              <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(step / IQ_QUESTIONS.length) * 100}%` }} />
              </div>
            </div>
            <p className="font-heading text-lg font-semibold leading-snug">{q.q}</p>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct;
                const isChosen  = selected === i;
                let cls = 'p-3 rounded-xl border text-sm text-left transition-all duration-200 ';
                if (selected !== null) {
                  if (isCorrect)       cls += 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300';
                  else if (isChosen)   cls += 'border-rose-400/60 bg-rose-400/10 text-rose-300';
                  else                 cls += 'border-border text-muted-foreground opacity-40';
                } else {
                  cls += 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer';
                }
                return (
                  <button key={i} className={cls} onClick={() => pick(i)}>
                    {selected !== null && isChosen && (
                      isCorrect
                        ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5 text-emerald-400" />
                        : <XCircle      className="w-3.5 h-3.5 inline mr-1.5 text-rose-400"    />
                    )}
                    {opt}
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-card border border-border text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Did you know? </span>{q.fact}
              </motion.div>
            )}
            {selected !== null && (
              <div className="flex justify-end">
                <Button size="sm" onClick={advance} className="gap-1.5">
                  {step + 1 >= IQ_QUESTIONS.length ? 'See Results' : 'Next Question'} <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Animated stat counter ─────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const step  = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 1800 / steps);
    return () => clearInterval(t);
  }, [inView, target]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % HISTORICAL_QUOTES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link to="/pricing"><Button variant="ghost" size="sm">Pricing</Button></Link>
            <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link to="/register"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Drifting year markers */}
        <HistoryCanvas className="opacity-55" />

        {/* Animated gradient blobs */}
        <motion.div
          className="absolute top-[-8%] left-[-4%] w-[520px] h-[520px] rounded-full bg-primary/8 blur-3xl pointer-events-none"
          animate={{ x: [0, 28, 0], y: [0, 18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-6%] right-[-4%] w-[460px] h-[460px] rounded-full bg-amber-900/12 blur-3xl pointer-events-none"
          animate={{ x: [0, -22, 0], y: [0, -14, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[40%] left-[35%] w-[360px] h-[360px] rounded-full bg-blue-900/8 blur-3xl pointer-events-none"
          animate={{ x: [0, 14, 0], y: [0, 22, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating historical photo cards (desktop only) */}
        <div className="absolute inset-0 hidden lg:block pointer-events-none">
          {HERO_PHOTOS.map((photo, idx) => (
            <motion.div
              key={idx}
              className="absolute pointer-events-auto"
              style={{ top: photo.top, left: photo.left, right: photo.right }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: photo.delay, duration: 0.9 }}
            >
              <div style={{ transform: `rotate(${photo.rot}deg)` }}>
                <motion.div
                  animate={{ y: [0, -11, 0] }}
                  transition={{ duration: photo.floatDur, repeat: Infinity, ease: 'easeInOut', delay: photo.delay * 0.5 }}
                  whileHover={{ scale: 1.07, transition: { duration: 0.22 } }}
                  className="w-40 rounded-xl overflow-hidden border border-border/60 shadow-2xl bg-card cursor-default"
                >
                  <img
                    src={`https://images.unsplash.com/${photo.src}?auto=format&fit=crop&w=280&q=65`}
                    alt={photo.label}
                    className="w-full h-24 object-cover"
                    loading="lazy"
                  />
                  <div className="px-3 py-1.5 border-t border-border">
                    <p className="text-xs font-semibold text-foreground">{photo.label}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero copy */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-32 text-center w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs border-primary/40 text-primary animate-pulse">
              ✦ AI-Powered History Learning
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            5,000 Years of History.<br /><span className="text-primary">In Your Hands.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Master world history from ancient civilizations to the modern era — guided lessons, interactive timeline, and your personal AI tutor <span className="text-primary font-medium">Clio</span>.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button size="lg" className="gap-2 px-8 text-base h-12">
                Start Learning Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="gap-2 px-8 text-base h-12">
                <Crown className="w-4 h-4" /> View Plans
              </Button>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="mt-16 flex justify-center">
            <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <ChevronDown className="w-5 h-5 text-muted-foreground/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Era Showcase with photos + 3D tilt ── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl font-bold mb-3">Four Eras of Human History</h2>
          <p className="text-muted-foreground">From the first writing systems to the digital revolution — a complete journey through time.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ERAS_SHOWCASE.map((era, i) => (
            <motion.div
              key={era.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="h-full"
            >
              <TiltCard className="h-full">
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`h-full flex flex-col rounded-xl border bg-gradient-to-br overflow-hidden ${era.bg} ${era.border} group cursor-default`}
                >
                  <div className="relative h-32 overflow-hidden shrink-0">
                    <img
                      src={`https://images.unsplash.com/${era.photo}?auto=format&fit=crop&w=400&q=65`}
                      alt={era.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-3">
                      <div className={`font-heading font-bold text-sm ${era.color}`}>{era.name}</div>
                      <div className="text-xs text-white/60">{era.range}</div>
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5 flex-1">
                    {era.lessons.map(l => (
                      <div key={l} className="flex items-start gap-1.5 text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors">
                        <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${era.color} bg-current opacity-70`} />
                        {l}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Rotating quote carousel ── */}
      <section className="border-y border-border bg-card/30 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Quote className="w-8 h-8 text-primary/30 mx-auto mb-6" />
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <blockquote className="font-heading text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-4">
                &ldquo;{HISTORICAL_QUOTES[quoteIdx].text}&rdquo;
              </blockquote>
              <cite className="text-sm text-muted-foreground not-italic">— {HISTORICAL_QUOTES[quoteIdx].author}</cite>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-6">
            {HISTORICAL_QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuoteIdx(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === quoteIdx ? 'bg-primary scale-125' : 'bg-border hover:bg-muted-foreground'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── History IQ teaser ── */}
      <section className="relative overflow-hidden py-20 border-b border-border">
        <HistoryCanvas className="opacity-28" />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Test Your History IQ</Badge>
            <h2 className="font-heading text-3xl font-bold mb-3">How Well Do You Know History?</h2>
            <p className="text-muted-foreground">Answer 3 quick questions — no sign-up required.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-card/80 backdrop-blur border border-border rounded-2xl p-8"
          >
            <IQTeaser />
          </motion.div>
        </div>
      </section>

      {/* ── Features grid (8 items) ── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl font-bold mb-3">Everything You Need to Master History</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">A complete learning system designed for curious, serious students of the past.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.055 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`p-5 rounded-xl border ${border} bg-card hover:border-primary/40 transition-all group`}
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-heading text-sm font-semibold mb-1.5">{title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-y border-border bg-card/30 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl font-bold text-center mb-10"
          >
            What Learners Say
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-sm">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing preview ── */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-3xl font-bold mb-4">Plans for Every Learner</h2>
          <p className="text-muted-foreground mb-8">Start free. Upgrade when you're ready.</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { plan: 'Free',           price: '$0',     desc: '4 intro lessons · Basic quiz',                icon: BookOpen, highlight: false },
              { plan: 'Pro Learner',    price: '$10/mo', desc: 'All lessons · AI Tutor · Full timeline',      icon: Zap,      highlight: true  },
              { plan: 'Master Student', price: '$20/mo', desc: 'Unlimited AI · Downloads · Priority support', icon: Crown,    highlight: false },
            ].map(({ plan, price, desc, icon: Icon, highlight }, i) => (
              <motion.div
                key={plan}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`p-5 rounded-xl border flex flex-col items-center gap-2 transition-all ${highlight ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/10' : 'border-border bg-card'}`}
              >
                <Icon className={`w-6 h-6 ${highlight ? 'text-primary' : i === 2 ? 'text-amber-400' : 'text-muted-foreground'}`} />
                <div className="font-heading font-semibold">{plan}</div>
                <div className={`text-2xl font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{price}</div>
                <div className="text-xs text-muted-foreground text-center">{desc}</div>
                {highlight && <Badge className="text-xs mt-1">Most Popular</Badge>}
              </motion.div>
            ))}
          </div>
          <Link to="/pricing"><Button variant="outline" size="lg">See Full Pricing →</Button></Link>
        </motion.div>
      </section>

      {/* ── Final CTA with animated background ── */}
      <section className="relative overflow-hidden border-t border-border">
        <HistoryCanvas className="opacity-22" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-background to-background pointer-events-none" />
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} className="inline-block mb-4">
              <Flame className="w-10 h-10 text-primary mx-auto" />
            </motion.div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Begin Your Journey.</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">Join curious learners exploring 5,000 years of human history. Free forever. Upgrade anytime.</p>
            <Link to="/register">
              <Button size="lg" className="gap-2 px-10 h-12 text-base">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Floating AI Chatbot ── */}
      <LandingChatbot />

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <Logo />
          <div className="flex gap-6">
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/login"   className="hover:text-foreground transition-colors">Log In</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
          <span>© {new Date().getFullYear()} Historify</span>
        </div>
      </footer>
    </div>
  );
}
