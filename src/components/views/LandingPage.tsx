import { useState } from 'react';
import { Zap, CheckCircle2, ArrowRight, BarChart3, Shield, GitBranch, Webhook, Bot, Trophy, ChevronRight, Star } from 'lucide-react';

type Props = { onEnterApp: () => void };

const FEATURES = [
  { icon: Bot, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', title: 'AI Sequence Diagnostic', desc: 'The Core Engine runs 3 internal sub-routines across every email node — deliverability, ICP resonance, and systemic flow — returning JSON-structured rewrites in seconds.' },
  { icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', title: 'Lead Extraction Hub', desc: 'Niche-targeted lead scraping with verified B2B emails, owner names, domains, and LinkedIn profiles — pushed directly into your sequence context engine.' },
  { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', title: 'DNS & Deliverability Shield', desc: 'Real-time SPF, DKIM, DMARC, and MX record diagnostics. Inbox warmup telemetry across multiple sending domains with reputation scoring.' },
  { icon: GitBranch, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', title: 'A/B Split Matrix', desc: 'Run multiple structural variations of any sequence step simultaneously. Control traffic splits and compare deliverability scores before deployment.' },
  { icon: Webhook, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', title: 'Webhook Command Center', desc: 'Bi-directional automation hub with native connectors for n8n, Instantly, Zapier, and Make. JSON payload builder with live endpoint testing.' },
  { icon: Trophy, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', title: 'Agency Leaderboard', desc: 'Aggregate campaign performance across all sub-accounts. Rankings by booked meetings, open rates, and domain health trends across your distributed SDR team.' },
];

const PRICING = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month per user',
    description: 'For individual SDRs and founders testing cold outreach automation.',
    color: 'border-white/[0.08]',
    badge: null,
    features: ['1 sending domain', 'Up to 500 contacts/month', 'AI Sequence Diagnostic', 'Basic DNS Health Check', 'Webhook Export (read-only)', 'Email support'],
    cta: 'Start Free Trial',
    ctaStyle: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10',
  },
  {
    name: 'Growth',
    price: '$49',
    period: '/month per user',
    description: 'For full-cycle sales teams that need the complete diagnostic stack.',
    color: 'border-emerald-500/40',
    badge: 'Most Popular',
    features: ['5 sending domains', 'Up to 2,500 contacts/month', 'Full AI Diagnostic Suite', 'Lead Extraction Hub', 'A/B Split Matrix', 'Webhook Command Center', 'Reply Intent Simulator', 'CRM Integration (HubSpot, Salesforce)', 'Priority email support'],
    cta: 'Start Free Trial',
    ctaStyle: 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]',
  },
  {
    name: 'Agency Enterprise',
    price: 'Custom',
    period: 'programmatic volume',
    description: 'For agencies managing multiple client accounts at scale.',
    color: 'border-indigo-500/30',
    badge: null,
    features: ['Unlimited domains', 'Unlimited contacts', 'Multi-seat access', 'Agency Leaderboard', 'White-label option', 'Client sub-account management', 'API access + custom integrations', 'Dedicated success manager', 'SLA guarantees'],
    cta: 'Book Agency Demo',
    ctaStyle: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  },
];

const SOCIAL_PROOF = [
  { name: 'Marcus R.', role: 'Head of SDR @ TechStack', quote: 'We went from 11% to 34% reply rate in 3 weeks. The DNS shield alone saved our entire sending reputation.' },
  { name: 'Priya S.', role: 'Founder @ ClearView CRM', quote: 'The AI rewrites are terrifyingly good. It caught 6 spam triggers I never would have noticed manually.' },
  { name: 'Daniel T.', role: 'Agency Owner @ NorthStar', quote: 'Managing 11 client sequences simultaneously with the leaderboard. This is the only tool I\'ve renewed without hesitation.' },
];

export default function LandingPage({ onEnterApp }: Props) {
  const [demoEmail, setDemoEmail] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 85%, rgba(99,102,241,0.06) 0%, transparent 50%)' }} />

      {/* Grid texture */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/[0.06] backdrop-blur-sm bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-bold text-white tracking-tight">AngelReach<span className="text-emerald-400">.ai</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-slate-200 transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-slate-200 transition-colors">Reviews</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onEnterApp} className="hidden sm:block text-sm text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5">Sign In</button>
          <button
            onClick={onEnterApp}
            className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-[1px] shadow-[0_0_20px_rgba(16,185,129,0.35)]"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Now with Multi-Machine AI Agent Routing
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
          Audit, Optimize, and{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Auto-Extract
          </span>
          {' '}B2B Pipeline on Pure Autopilot
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The enterprise-grade cold outreach diagnostic terminal used by elite B2B agencies and SDR teams to find hidden deliverability failures, rewrite sequences with AI, and push optimized campaigns directly to automation platforms.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-400 transition-all duration-200 hover:-translate-y-[2px] shadow-[0_0_30px_rgba(16,185,129,0.4)] text-base"
          >
            <Zap className="w-4 h-4" />
            Launch App Workspace
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-white/10 transition-all duration-200 hover:-translate-y-[2px] text-base">
            Book Agency Demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stat bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
          {['2,400+ agencies onboarded', '14M+ emails diagnosed', '94% avg deliverability improvement', 'SOC 2 Type II compliant'].map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{s}
            </span>
          ))}
        </div>

        {/* Terminal preview mockup */}
        <div className="mt-14 rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_80px_rgba(0,0,0,0.5)] bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-slate-950/60">
            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-amber-500/60" /><div className="w-3 h-3 rounded-full bg-emerald-500/60" /></div>
            <span className="text-xs text-slate-600 font-mono ml-2">OutreachAudit.ai — AI Diagnostics Terminal</span>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ label: 'System Health', value: '74', color: '#f59e0b' }, { label: 'Deliverability', value: '88', color: '#10b981' }, { label: 'ICP Resonance', value: '61', color: '#f59e0b' }, { label: 'Sequence Flow', value: '79', color: '#10b981' }].map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/40 border border-white/[0.06]">
                <span className="text-3xl font-black tabular-nums" style={{ color: m.color }}>{m.value}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 text-center">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 space-y-2">
            {['HIGH: Spam word density exceeds threshold in Step 2B', 'HIGH: DKIM selector not configured — critical deliverability risk', 'MED: ICP resonance below 65 — hooks need sharpening'].map((alert, i) => (
              <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${i < 2 ? 'bg-red-500/5 border border-red-500/15 text-red-400' : 'bg-amber-500/5 border border-amber-500/15 text-amber-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0 ${i < 2 ? 'bg-red-400 animate-pulse' : 'bg-amber-400'}`} />
                {alert}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">Platform Capabilities</p>
          <h2 className="text-3xl font-black text-white">Every System You Need to Dominate Cold Outreach</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">Six enterprise modules built on a single zero-latency AI execution pathway.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="group p-5 rounded-xl bg-slate-900/50 border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1">
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-4 ${f.bg}`}>
                <f.icon className={`w-4 h-4 ${f.color}`} />
              </div>
              <h3 className="font-bold text-slate-200 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section id="testimonials" className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-3">Customer Results</p>
          <h2 className="text-3xl font-black text-white">Used by Elite Outreach Teams</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SOCIAL_PROOF.map((t) => (
            <div key={t.name} className="p-5 rounded-xl bg-slate-900/50 border border-white/[0.07]">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-slate-200">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">Pricing</p>
          <h2 className="text-3xl font-black text-white">Transparent Tier Architecture</h2>
          <p className="text-slate-400 mt-3">All plans include a 14-day free trial. No credit card required.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border transition-all duration-300 hover:-translate-y-1 ${plan.color} ${plan.badge ? 'shadow-[0_0_40px_rgba(16,185,129,0.12)]' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">{plan.name}</p>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-sm text-slate-500 pb-1">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-400">{plan.description}</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={plan.name !== 'Agency Enterprise' ? onEnterApp : undefined}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-[1px] ${plan.ctaStyle}`}
              >
                {plan.cta}
                <ChevronRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="p-10 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Systematize Your Pipeline?</h2>
          <p className="text-slate-400 mb-8">Join 2,400+ agencies and SDR teams running diagnostics at machine speed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onEnterApp}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-400 transition-all duration-200 hover:-translate-y-[2px] shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              <Zap className="w-4 h-4" /> Launch App Workspace
            </button>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="email"
              value={demoEmail}
              onChange={(e) => setDemoEmail(e.target.value)}
              placeholder="your@agency.com"
              className="px-4 py-2.5 rounded-lg bg-slate-800/60 border border-white/[0.08] text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 w-full sm:w-64"
            />
            <button className="px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-semibold text-slate-200 border border-white/[0.08] transition-colors whitespace-nowrap">
              Book Agency Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.05] px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Zap className="w-2.5 h-2.5 text-emerald-400" />
          </div>
          <span className="text-sm font-bold text-white">OutreachAudit<span className="text-emerald-400">.ai</span></span>
        </div>
        <p className="text-xs text-slate-600">© 2026 OutreachAudit.ai. Enterprise B2B Outreach Intelligence Platform.</p>
      </footer>
    </div>
  );
}
