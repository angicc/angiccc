import { Link } from 'react-router-dom';
import { BookOpen, Brain, ScrollText, HelpCircle, ArrowRight, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FEATURES = [
  { icon: BookOpen, title: '14 In-Depth Lessons', desc: 'Expert-written lessons from Ancient Egypt to the Digital Age.', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { icon: Brain, title: 'AI History Tutor', desc: 'Ask Clio, your AI tutor, anything about history and get clear answers instantly.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { icon: ScrollText, title: 'Interactive Timeline', desc: 'Explore 50+ pivotal events on a visual timeline filtered by era and category.', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { icon: HelpCircle, title: 'Quizzes & XP', desc: 'Test knowledge with quizzes, earn XP, level up, and unlock achievements.', color: 'text-rose-400', bg: 'bg-rose-400/10' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
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
      <section className="scroll-pattern max-w-6xl mx-auto px-4 py-24 text-center">
        <Badge variant="outline" className="mb-6 px-4 py-1 text-xs border-primary/40 text-primary">AI-Powered History Learning</Badge>
        <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6">History Comes<br /><span className="text-primary">Alive.</span></h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">Master world history from ancient civilizations to the modern era with guided lessons, an interactive timeline, and your personal AI tutor.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register"><Button size="lg" className="gap-2 px-8">Start Learning Free <ArrowRight className="w-4 h-4" /></Button></Link>
          <Link to="/pricing"><Button size="lg" variant="outline" className="gap-2 px-8"><Crown className="w-4 h-4" /> View Plans</Button></Link>
        </div>
      </section>
      <div className="era-divider max-w-4xl mx-auto" />
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-heading text-3xl font-bold text-center mb-12">Everything You Need to Learn History</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors">
              <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center mb-4`}><Icon className={`w-6 h-6 ${color}`} /></div>
              <h3 className="font-heading text-base font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Plans for Every Learner</h2>
          <p className="text-muted-foreground mb-8">Start free, upgrade when you're ready.</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[{ plan:'Free', price:'$0', desc:'4 intro lessons', icon:BookOpen }, { plan:'Pro Learner', price:'$10/mo', desc:'All lessons + AI Tutor', icon:Zap }, { plan:'Master Student', price:'$20/mo', desc:'Unlimited AI + downloads', icon:Crown }].map(({ plan, price, desc, icon: Icon }) => (
              <div key={plan} className="p-5 rounded-xl border border-border bg-background flex flex-col items-center gap-2">
                <Icon className="w-6 h-6 text-primary" />
                <div className="font-heading font-semibold">{plan}</div>
                <div className="text-2xl font-bold text-primary">{price}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            ))}
          </div>
          <Link to="/pricing"><Button variant="outline" size="lg">See Full Pricing →</Button></Link>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heading text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
        <p className="text-muted-foreground text-lg mb-8">Join curious learners exploring human history — for free.</p>
        <Link to="/register"><Button size="lg" className="gap-2 px-10">Create Free Account <ArrowRight className="w-4 h-4" /></Button></Link>
      </section>
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-accent text-primary">Historify</span>
          <div className="flex gap-6">
            <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link to="/login" className="hover:text-foreground">Log In</Link>
            <Link to="/register" className="hover:text-foreground">Sign Up</Link>
          </div>
          <span>© {new Date().getFullYear()} Historify</span>
        </div>
      </footer>
    </div>
  );
}
