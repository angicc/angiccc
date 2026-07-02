import { useState, useEffect, useRef, useCallback } from 'react';
import { stripMarkdown } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from 'framer-motion';
import { BookOpen, Brain, ScrollText, HelpCircle, ArrowRight, Crown, Zap, Layers, Globe, Globe2, Flame, Star, ChevronDown, Quote, PenLine, BarChart2, CheckCircle2, XCircle, X, Send, Loader2, Sparkles, Film, Shield, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/shared/Logo';
import { streamChatResponse, LANDING_SYSTEM_PROMPT } from '@/services/aiGateway';
import { AiErrorCard } from '@/components/shared/AiErrorCard';

// ── Data ──────────────────────────────────────────────────────────────────────

const ERAS_SHOWCASE = [
  {
    name: 'Ancient World', range: '3000 BCE – 500 CE',
    color: 'text-amber-400', bg: 'from-amber-900/30 to-amber-950/60', border: 'border-amber-500/30',
    photo: 'photo-1568322445389-f64ac2515020',
    lessons: ['The First Civilizations', 'Classical Greece', 'The Roman Empire', 'The Ancient East', 'Ancient Egypt & Pharaohs', 'The Phoenicians: Masters of the Sea'],
  },
  {
    name: 'Middle Ages', range: '500 – 1500 CE',
    color: 'text-blue-400', bg: 'from-blue-900/30 to-blue-950/60', border: 'border-blue-500/30',
    photo: 'photo-1548690312-e3b507d8c110',
    lessons: ['Fall of Rome & Early Middle Ages', 'Crusades & Islamic Golden Age', 'The Black Death', 'Medieval Economy & Trade Guilds', 'The Mongol Empire', 'Medieval Japan: Samurai & Shoguns'],
  },
  {
    name: 'Early Modern', range: '1500 – 1800 CE',
    color: 'text-emerald-400', bg: 'from-emerald-900/30 to-emerald-950/60', border: 'border-emerald-500/30',
    photo: 'photo-1516483638261-f4dbaf036963',
    lessons: ['Renaissance & Age of Exploration', 'The Protestant Reformation', 'Scientific Revolution', 'Age of Absolutism & Louis XIV', 'The Transatlantic Slave Trade', 'The Ottoman Empire: Suleiman the Magnificent', 'The Age of Revolution: America & France'],
  },
  {
    name: 'Modern Era', range: '1800 – Present',
    color: 'text-rose-400', bg: 'from-rose-900/30 to-rose-950/60', border: 'border-rose-500/30',
    photo: 'photo-1477959858617-67f85cf4f1df',
    lessons: ['The Industrial Revolution', 'The World Wars', 'Cold War & Decolonization', 'Globalization', 'Age of Imperialism', 'The Yugoslav Wars', 'The Macedonian Struggle'],
  },
];

const TESTIMONIALS = [
  { quote: 'Finally an app that makes history feel alive. The AI tutor explained the causes of WWI better than my university professor.', author: 'Alex M.', role: 'University Student' },
  { quote: "I completed all 4 eras in a month. The quiz system keeps me hooked — I'm always chasing that perfect score.", author: 'Sarah K.', role: 'History Enthusiast' },
  { quote: 'The timeline feature is incredible. Being able to see how events connect across centuries is eye-opening.', author: 'James R.', role: 'High School Teacher' },
];

const STATS = [
  { label: 'Lessons',        value: 24,   suffix: '+' },
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
  { icon: BookOpen,   title: '24 In-Depth Lessons',   desc: 'Expert-written lessons from Ancient Egypt to the Digital Age, packed with rich historical context.',      color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20'   },
  { icon: Brain,      title: 'AI Tutor — Clio',        desc: 'Ask your personal AI tutor anything about history and get clear, scholarly answers instantly.',            color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/20'    },
  { icon: ScrollText, title: 'Interactive Timeline',   desc: 'Explore 50+ pivotal events on a visual timeline, filterable by era and category.',                         color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { icon: HelpCircle, title: 'Quizzes & XP',           desc: 'Test knowledge with 80+ quiz questions, earn XP, level up, and unlock achievements.',                      color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/20'    },
  { icon: Layers,     title: 'Flashcard System',       desc: 'Reinforce learning with spaced repetition flashcards drawn from every lesson across all eras.',            color: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/20'  },
  { icon: Globe,      title: 'Leaderboard',            desc: 'Compete with learners worldwide, climb the XP rankings, and earn legendary status.',                       color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/20'    },
  { icon: PenLine,    title: 'Personal Notes',         desc: 'Capture insights as you learn — notes are linked directly to lessons and eras for easy review.',          color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/20'  },
  { icon: BarChart2,  title: 'Progress Analytics',     desc: 'Track your learning journey with detailed charts, streak stats, and achievement milestones.',               color: 'text-teal-400',    bg: 'bg-teal-400/10',    border: 'border-teal-400/20'    },
  { icon: Sparkles,   title: 'Smart Quiz',             desc: 'Adaptive AI-powered quiz that targets your weakest eras and auto-calibrates difficulty to your skill level.', color: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/20'  },
  { icon: Film,       title: 'Video Review Challenge', desc: 'Watch a curated history video every 12 hours. Write your analysis. Clio grades every sentence live and awards Video XP.', color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/20'    },
  { icon: Shield,     title: 'Historical Chess Ranks', desc: 'Earn Video XP to climb 10 ranks — from Pawn to Alexander the Great. Your rank dominates the Leaderboard.', color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20'   },
  { icon: Scale,   title: 'Debate a Philosopher',    desc: 'Challenge Socrates, Nietzsche, Kant and more in daily philosophical debates. Make them concede and earn XP. One philosopher per day.', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
  { icon: PenLine, title: 'AI Essay Challenge',       desc: 'Write historical essays graded live by Clio — accuracy, argument quality, and depth all scored. Exclusive to Master Student.', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  { icon: Globe2,  title: 'Timeline Territory Map',   desc: 'Explore real geographic territories for 22 historical periods on a live OpenStreetMap. Click topics to fly the map to exact territories with annotated markers.', color: 'text-sky-400',    bg: 'bg-sky-400/10',    border: 'border-sky-400/20'    },
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

    // Each particle: x,y world-space, z depth (0–900), color hue
    const particles = YEARS.map(text => ({
      text,
      x: (Math.random() - 0.5) * W * 2.5,
      y: (Math.random() - 0.5) * H * 2.5,
      z: Math.random() * 900,
      vz: Math.random() * 1.2 + 0.4,
      baseSize: Math.random() * 3 + 9,
      // 80% amber, 12% blue, 8% emerald
      hue: Math.random() > 0.88 ? 200 : Math.random() > 0.92 ? 160 : 38,
    }));

    let raf: number;

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      particles.sort((a, b) => b.z - a.z);

      // Update positions and compute screen coords
      type Pt = { p: typeof particles[0]; sx: number; sy: number; opacity: number };
      const pts: Pt[] = particles.map(p => {
        p.z -= p.vz;
        if (p.z <= 0) { p.z = 900; p.x = (Math.random() - 0.5) * W * 2.5; p.y = (Math.random() - 0.5) * H * 2.5; }
        const scale = FOCAL / (FOCAL + p.z);
        const sx = W / 2 + p.x * scale;
        const sy = H / 2 + p.y * scale;
        const progress = 1 - p.z / 900;
        const opacity = Math.pow(progress, 1.5) * 0.45;
        return { p, sx, sy, opacity };
      });

      // Draw constellation lines between close particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dist = Math.hypot(pts[i].sx - pts[j].sx, pts[i].sy - pts[j].sy);
          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * Math.min(pts[i].opacity, pts[j].opacity) * 0.5;
            ctx!.save();
            ctx!.globalAlpha = lineAlpha;
            ctx!.strokeStyle = '#f59e0b';
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(pts[i].sx, pts[i].sy);
            ctx!.lineTo(pts[j].sx, pts[j].sy);
            ctx!.stroke();
            ctx!.restore();
          }
        }
      }

      // Draw year labels
      for (const { p, sx, sy, opacity } of pts) {
        if (sx < -120 || sx > W + 120 || sy < -40 || sy > H + 40) continue;
        const scale = FOCAL / (FOCAL + p.z);
        const fontSize = p.baseSize * scale;
        const color = p.hue === 200 ? 'rgba(96,165,250,1)' : p.hue === 160 ? 'rgba(52,211,153,1)' : 'rgba(245,158,11,1)';

        ctx!.save();
        ctx!.globalAlpha = opacity;
        ctx!.font = `${Math.max(fontSize, 7)}px monospace`;
        ctx!.fillStyle = color;

        if (p.z < 400) {
          const prevScale = FOCAL / (FOCAL + p.z + 8);
          ctx!.globalAlpha = opacity * 0.25;
          ctx!.fillText(p.text, W / 2 + p.x * prevScale, H / 2 + p.y * prevScale);
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

// ── Clio Avatar (matches in-app AI Tutor) ────────────────────────────────────

function ClioAvatar({ size = 60 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <radialGradient id="landingClioBg" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="100%" stopColor="#1c0a02" />
        </radialGradient>
        <linearGradient id="landingClioRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="39" fill="none" stroke="url(#landingClioRing)" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="37" fill="url(#landingClioBg)" />
      <ellipse cx="40" cy="20" rx="14" ry="9" fill="#3d1f08" />
      <path d="M26 23 Q22 35 28 43" fill="#3d1f08" />
      <path d="M54 23 Q58 35 52 43" fill="#3d1f08" />
      <ellipse cx="40" cy="29" rx="11" ry="12" fill="#c8956c" />
      <ellipse cx="40" cy="19" rx="12" ry="7" fill="#4a2c0a" />
      <path d="M29 20 L32 14 L40 17 L48 14 L51 20" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="40" cy="16.5" r="2.5" fill="#f59e0b" />
      <circle cx="32" cy="14" r="1.5" fill="#fbbf24" />
      <circle cx="48" cy="14" r="1.5" fill="#fbbf24" />
      <ellipse cx="36" cy="28" rx="2.3" ry="1.9" fill="#1a0a00" />
      <ellipse cx="44" cy="28" rx="2.3" ry="1.9" fill="#1a0a00" />
      <circle cx="36.8" cy="27.4" r="0.9" fill="white" opacity="0.85" />
      <circle cx="44.8" cy="27.4" r="0.9" fill="white" opacity="0.85" />
      <path d="M37 34 Q40 36.5 43 34" stroke="#a0604a" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M27 41 Q40 38 53 41 L57 74 Q40 77 23 74 Z" fill="#5b21b6" opacity="0.85" />
      <path d="M33 41 Q31 57 30 74" stroke="#7c3aed" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M47 41 Q49 57 50 74" stroke="#7c3aed" strokeWidth="0.8" fill="none" opacity="0.5" />
      <g transform="translate(42,50) rotate(-18)">
        <rect x="0" y="0" width="20" height="13" rx="2" fill="#fef3c7" />
        <ellipse cx="0" cy="6.5" rx="3.5" ry="6.5" fill="#d97706" />
        <ellipse cx="20" cy="6.5" rx="3.5" ry="6.5" fill="#d97706" />
        <line x1="3" y1="4.5" x2="17" y2="4.5" stroke="#78350f" strokeWidth="0.8" />
        <line x1="3" y1="7.5" x2="17" y2="7.5" stroke="#78350f" strokeWidth="0.8" />
        <line x1="3" y1="10.5" x2="17" y2="10.5" stroke="#78350f" strokeWidth="0.8" />
      </g>
      <circle cx="16" cy="23" r="2" fill="#f59e0b" opacity="0.9" />
      <circle cx="64" cy="20" r="1.5" fill="#fbbf24" opacity="0.8" />
      <circle cx="67" cy="52" r="2" fill="#f59e0b" opacity="0.65" />
      <circle cx="13" cy="57" r="1.5" fill="#fbbf24" opacity="0.55" />
      <path d="M16 23 L17.2 19.8 L20.4 19.8 L17.8 21.8 L18.6 25 L16 23.2 L13.4 25 L14.2 21.8 L11.6 19.8 L14.8 19.8 Z" fill="#f59e0b" opacity="0.8" />
    </svg>
  );
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

const LANDING_CHAT_KEY = 'historify:chat:landing';
const LANDING_GREETING: ChatMsg = { role: 'assistant', text: "Hi! I'm Clio, your AI history guide. Ask me anything about Historify or world history!" };

function loadLandingChat(): ChatMsg[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(LANDING_CHAT_KEY) ?? '') as ChatMsg[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [LANDING_GREETING];
  } catch { return [LANDING_GREETING]; }
}

function LandingChatbot() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState<ChatMsg[]>(loadLandingChat);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<unknown>(null);
  const retryRef              = useRef<{ history: { role: 'user' | 'assistant'; content: string }[] } | null>(null);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);
  const apiKey                = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  // Persist the conversation so a refresh or timeout never loses context.
  useEffect(() => {
    try { localStorage.setItem(LANDING_CHAT_KEY, JSON.stringify(msgs.slice(-40))); } catch { /* best-effort */ }
  }, [msgs]);

  const stream = useCallback(async (history: { role: 'user' | 'assistant'; content: string }[]) => {
    setLoading(true);
    setError(null);
    let reply = '';
    setMsgs(prev => [...prev, { role: 'assistant', text: '' }]);
    try {
      for await (const chunk of streamChatResponse(history, undefined, LANDING_SYSTEM_PROMPT)) {
        reply += chunk;
        setMsgs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', text: stripMarkdown(reply) };
          return updated;
        });
      }
      retryRef.current = null;
    } catch (err) {
      retryRef.current = { history };
      setError(err);
      // Drop the empty placeholder bubble; keep any partial reply.
      setMsgs(prev => prev.filter((m, i) => !(i === prev.length - 1 && m.role === 'assistant' && m.text === '')));
    }
    setLoading(false);
  }, []);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMsg = { role: 'user', text };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    void stream([...msgs, userMsg].map(m => ({ role: m.role, content: m.text })));
  }, [msgs, loading, stream]);

  const retry = useCallback(() => {
    if (!retryRef.current || loading) return;
    void stream(retryRef.current.history);
  }, [loading, stream]);

  function handleOpen() {
    setOpen(o => !o);
    setTimeout(() => inputRef.current?.focus(), 320);
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 28 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="mb-4 w-[min(400px,calc(100vw-2rem))] rounded-2xl border border-border bg-card shadow-2xl shadow-black/30 overflow-hidden flex flex-col"
            style={{ maxHeight: 560 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-950/60 to-violet-950/40 border-b border-border shrink-0">
              <ClioAvatar size={40} />
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-sm leading-tight">Clio</p>
                <p className="text-xs text-muted-foreground">AI History Tutor · Historify</p>
              </div>
              <div className="flex items-center gap-1.5 mr-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-medium">{apiKey ? 'Live' : 'Demo'}</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-accent">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="shrink-0 mt-0.5"><ClioAvatar size={26} /></div>
                  )}
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted/80 text-foreground rounded-bl-sm border border-border/40'
                  }`}>
                    {m.role === 'assistant' ? stripMarkdown(m.text) || (
                      <span className="inline-flex gap-1 items-center h-4">
                        <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration:1.1, repeat:Infinity }}>●</motion.span>
                        <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration:1.1, repeat:Infinity, delay:0.2 }}>●</motion.span>
                        <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration:1.1, repeat:Infinity, delay:0.4 }}>●</motion.span>
                      </span>
                    ) : m.text || (
                      <span className="inline-flex gap-1 items-center h-4">
                        <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration:1.1, repeat:Infinity }}>●</motion.span>
                        <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration:1.1, repeat:Infinity, delay:0.2 }}>●</motion.span>
                        <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration:1.1, repeat:Infinity, delay:0.4 }}>●</motion.span>
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
              {error != null && !loading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="shrink-0 mt-0.5"><ClioAvatar size={26} /></div>
                  <AiErrorCard error={error} onRetry={retry} />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {msgs.length <= 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0">
                {CHAT_SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 text-muted-foreground hover:text-foreground">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-muted/20 shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                placeholder="Ask Clio anything…"
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/50 py-1"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-35 transition-all hover:bg-primary/90 shrink-0"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button — shows Clio avatar when closed */}
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        className="w-16 h-16 rounded-full shadow-xl shadow-black/30 flex items-center justify-center relative overflow-hidden border-2 border-amber-400/50 bg-gradient-to-br from-amber-950 to-violet-950"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="absolute">
              <X className="w-6 h-6 text-white" />
            </motion.span>
          ) : (
            <motion.span key="avatar" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} className="absolute">
              <ClioAvatar size={52} />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-amber-400/60"
            animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
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
        {/* Tank GIF background */}
        <img src="https://media.giphy.com/media/QR7SyBe7tQfPq/giphy.gif" alt="" className="absolute inset-0 w-full h-full object-cover" style={{zIndex:0}} />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 z-[1]" />

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
            className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6 text-white"
          >
            5,000 Years of History.<br /><span className="text-amber-400">In Your Hands.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Master world history from ancient civilizations to the modern era — guided lessons, interactive timeline, and your personal AI tutor <span className="text-amber-400 font-medium">Clio</span>.
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
              <ChevronDown className="w-5 h-5 text-white/40" />
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              { plan: 'Free',           price: '$0',     desc: '4 intro lessons · Clio AI 5/day · Leaderboard',                           icon: BookOpen, highlight: false },
              { plan: 'Pro Learner',    price: '$10/mo', desc: 'All lessons · AI Tutor 50/mo · Timeline · Debate a Philosopher',           icon: Zap,      highlight: true  },
              { plan: 'Master Student', price: '$20/mo', desc: 'Unlimited AI · Essay Challenge · Video Review · Downloads',                icon: Crown,    highlight: false },
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
          <span>© {new Date().getFullYear()} Historify. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
