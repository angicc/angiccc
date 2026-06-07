import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { BookOpen, Brain, ScrollText, HelpCircle, ArrowRight, Crown, Zap, Layers, Globe, Flame, Star, ChevronDown, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ERAS_SHOWCASE = [
  { name: 'Ancient World', range: '3000 BCE – 500 CE', color: 'text-amber-400', bg: 'from-amber-900/30 to-amber-950/60', border: 'border-amber-500/30', facts: ['First Writing Systems', 'Greek Democracy', 'Roman Empire'] },
  { name: 'Middle Ages', range: '500 – 1500 CE', color: 'text-blue-400', bg: 'from-blue-900/30 to-blue-950/60', border: 'border-blue-500/30', facts: ['The Crusades', 'Black Death', 'Islamic Golden Age'] },
  { name: 'Early Modern', range: '1500 – 1800 CE', color: 'text-emerald-400', bg: 'from-emerald-900/30 to-emerald-950/60', border: 'border-emerald-500/30', facts: ['Renaissance', 'Reformation', 'Enlightenment'] },
  { name: 'Modern Era', range: '1800 – Present', color: 'text-rose-400', bg: 'from-rose-900/30 to-rose-950/60', border: 'border-rose-500/30', facts: ['World Wars', 'Cold War', 'Digital Age'] },
];

const TESTIMONIALS = [
  { quote: 'Finally an app that makes history feel alive. The AI tutor explained the causes of WWI better than my university professor.', author: 'Alex M.', role: 'University Student' },
  { quote: 'I completed all 4 eras in a month. The quiz system keeps me hooked — I\'m always chasing that perfect score.', author: 'Sarah K.', role: 'History Enthusiast' },
  { quote: 'The timeline feature is incredible. Being able to see how events connect across centuries is eye-opening.', author: 'James R.', role: 'High School Teacher' },
];

const STATS = [
  { label: 'Lessons', value: 20, suffix: '+' },
  { label: 'Timeline Events', value: 50, suffix: '+' },
  { label: 'Quiz Questions', value: 80, suffix: '+' },
  { label: 'XP to Earn', value: 5000, suffix: '+' },
];

const HISTORICAL_QUOTES = [
  { text: 'Those who cannot remember the past are condemned to repeat it.', author: 'George Santayana' },
  { text: 'History is not a burden on the memory but an illumination of the soul.', author: 'Lord Acton' },
  { text: 'The most effective way to destroy people is to deny and obliterate their understanding of their history.', author: 'George Orwell' },
  { text: 'History is the version of past events that people have decided to agree upon.', author: 'Napoleon Bonaparte' },
];

const FEATURES = [
  { icon: BookOpen, title: '20+ In-Depth Lessons', desc: 'Expert-written lessons from Ancient Egypt to the Digital Age, each packed with rich historical context.', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { icon: Brain, title: 'AI History Tutor — Clio', desc: 'Ask your personal AI tutor anything about history and get clear, scholarly answers instantly.', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { icon: ScrollText, title: 'Interactive Timeline', desc: 'Explore 50+ pivotal events on a visual timeline, filterable by era and category.', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { icon: HelpCircle, title: 'Quizzes & XP', desc: 'Test knowledge with 80+ quiz questions, earn XP, level up, and unlock achievements.', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
  { icon: Layers, title: 'Flashcard System', desc: 'Reinforce learning with spaced repetition flashcards drawn from every lesson.', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
  { icon: Globe, title: 'Leaderboard', desc: 'Compete with learners worldwide, climb the XP rankings, and earn legendary status.', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

export default function LandingPage() {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % HISTORICAL_QUOTES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-accent text-xl text-primary">Historify</span>
          <div className="flex items-center gap-2">
            <Link to="/pricing"><Button variant="ghost" size="sm">Pricing</Button></Link>
            <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link to="/register"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/25 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 py-28 text-center w-full">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex justify-center"
          >
            <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <ChevronDown className="w-5 h-5 text-muted-foreground/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
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

      {/* Era Showcase */}
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
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`p-5 rounded-xl border bg-gradient-to-br ${era.bg} ${era.border} cursor-default group`}
            >
              <div className={`font-heading font-bold text-base mb-1 ${era.color}`}>{era.name}</div>
              <div className="text-xs text-muted-foreground mb-4">{era.range}</div>
              <div className="space-y-2">
                {era.facts.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${era.color} bg-current opacity-70`} />
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Historical Quote Carousel */}
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

      {/* Features Grid */}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`p-6 rounded-xl border ${border} bg-card hover:border-primary/40 transition-all group`}
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="font-heading text-base font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
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

      {/* Pricing Preview */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-3xl font-bold mb-4">Plans for Every Learner</h2>
          <p className="text-muted-foreground mb-8">Start free. Upgrade when you're ready.</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { plan: 'Free', price: '$0', desc: '4 intro lessons · Basic quiz', icon: BookOpen, highlight: false },
              { plan: 'Pro Learner', price: '$10/mo', desc: 'All lessons · AI Tutor · Full timeline', icon: Zap, highlight: true },
              { plan: 'Master Student', price: '$20/mo', desc: 'Unlimited AI · Downloads · Priority', icon: Crown, highlight: false },
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

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-background to-background" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="inline-block mb-4">
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

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-accent text-primary">Historify</span>
          <div className="flex gap-6">
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">Log In</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
          <span>© {new Date().getFullYear()} Historify</span>
        </div>
      </footer>
    </div>
  );
}
