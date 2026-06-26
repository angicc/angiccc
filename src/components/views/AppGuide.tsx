import { useState } from 'react';
import { BookOpen, ChevronRight, ChevronDown, CheckCircle2, Circle, Zap, Terminal, Users, Shield, FlaskConical, Webhook, MessageSquare, Trophy, BarChart2, Swords } from 'lucide-react';
import PremiumCard from '../ui/PremiumCard';

type Step = { title: string; body: string };
type Section = { id: string; icon: React.ElementType; color: string; title: string; steps: Step[] };

const SECTIONS: Section[] = [
  {
    id: 'start', icon: Zap, color: 'text-emerald-400',
    title: 'Getting Started',
    steps: [
      { title: 'Welcome to AngelReach.ai', body: 'AngelReach is a multi-machine B2B Growth Platform. It combines AI-powered sequence diagnostics, lead extraction, DNS deliverability monitoring, A/B testing, and automation webhooks — all in one workspace.' },
      { title: 'Set up your .env.local', body: 'Add VITE_ANTHROPIC_API_KEY=your_key_here to your .env.local file to enable live AI diagnostics. Set VITE_MOCK_MODE=true for offline testing without API costs.' },
      { title: 'Choose your workflow', body: 'Start in the Workspace to build your sequence, run a diagnostic, and export optimized copy. Or use the Lead Scraper to fill your pipeline first, then push those leads into your sequence context.' },
    ],
  },
  {
    id: 'workspace', icon: Terminal, color: 'text-indigo-400',
    title: 'Workspace & AI Terminal',
    steps: [
      { title: 'AI Co-Pilot (Auto-Build)', body: 'Type a description of your offer and target audience at the top of the Workspace, then click "Auto-Build Sequence". The AI will populate your ICP, URL, Value Prop, and all 4 sequence nodes in under 2 seconds.' },
      { title: 'Configure Context Engine', body: 'Fill in your Ideal Customer Profile, Company URL, and Value Proposition. These power the ICP Resonance sub-routine in the AI diagnostic.' },
      { title: 'Build your 4-Node Sequence', body: 'Each node maps to a conditional branch: Cold Email → Follow-up (Opened) → Follow-up (Unopened) → Breakup. Click a node to expand it and write your subject + body copy.' },
      { title: 'Run System Audit', body: 'Click "Initialize System Audit" to send your sequence graph to the Core Engine. Sub-Routine A checks deliverability, B checks ICP resonance, C checks logical flow. Results appear in the AI Terminal.' },
      { title: 'Review & Export', body: 'In the AI Terminal, review node diagnostics, read the split-screen diff rewrites, and export your optimized sequence as .TXT or as a webhook JSON payload.' },
    ],
  },
  {
    id: 'leads', icon: Users, color: 'text-cyan-400',
    title: 'Lead Scraper Hub',
    steps: [
      { title: 'Set niche and location', body: 'Enter your target niche (e.g., "SaaS Founders", "CFOs at logistics companies") and location. Click Scrape Leads to simulate a real lead extraction.' },
      { title: 'Review and verify', body: 'Leads with a green badge are verified — their email passed MX validation. Unverified leads have higher bounce risk. Filter by verification status before exporting.' },
      { title: 'Push to Context Engine', body: 'Select leads using checkboxes, then click "Push to Context Engine". This automatically populates your ICP field with the selected companies and contacts.' },
      { title: 'Export to CSV', body: 'Click Export CSV to download your selected leads as a spreadsheet for import into your ESP (Instantly, Smartlead, Lemlist, etc.).' },
    ],
  },
  {
    id: 'dns', icon: Shield, color: 'text-amber-400',
    title: 'DNS Spam Shield',
    steps: [
      { title: 'Enter your sending domain', body: 'Type the domain you use to send cold emails. This should be a secondary domain (never your main business domain). Click "Run DNS Check".' },
      { title: 'Interpret record statuses', body: 'PASS = configured correctly. FAIL = critical issue (will hurt deliverability). WARNING = configuration exists but has problems. Fix DMARC and DKIM first — they\'re the highest-impact records.' },
      { title: 'Monitor warmup inboxes', body: 'The Warmup Inboxes section shows your daily send volume, warmup score, and reputation. Never exceed your daily limit — it triggers ESP rate-limiting and reputation flags.' },
    ],
  },
  {
    id: 'abtesting', icon: FlaskConical, color: 'text-violet-400',
    title: 'A/B Testing Sandbox',
    steps: [
      { title: 'Create a new test', body: 'Click "New A/B Test", name it, select the sequence step it targets, and define 2 variants with different subjects and body copy.' },
      { title: 'Set traffic split', body: 'Use the slider to allocate traffic between variants. The remaining percentage auto-adjusts to always sum to 100%.' },
      { title: 'Activate and monitor', body: 'Set the test status to "Active". Monitor the Deliverability Score and Open Rate Estimate columns. Pause or complete the test when you have statistically meaningful data.' },
    ],
  },
  {
    id: 'webhooks', icon: Webhook, color: 'text-rose-400',
    title: 'Webhook Hub',
    steps: [
      { title: 'Add a webhook endpoint', body: 'Click an existing webhook or add a new one. Configure the target URL, platform (n8n, Zapier, Instantly, Make), and the trigger event.' },
      { title: 'Customize JSON payload', body: 'Edit the JSON payload template to include the exact fields your automation platform expects. Use {{placeholders}} for dynamic values.' },
      { title: 'Test the endpoint', body: 'Click "Test Endpoint" to send a mock payload. A 200 response = success. If the URL starts with https and is valid, the test will simulate success.' },
    ],
  },
  {
    id: 'replies', icon: MessageSquare, color: 'text-blue-400',
    title: 'Reply Intent Simulator',
    steps: [
      { title: 'Select a reply scenario', body: 'Choose from 4 scenarios: Positive Intent, Objection (competitor/contract), Not Interested (opt-out), or Out of Office. Each generates a realistic prospect reply.' },
      { title: 'Run the simulation', body: 'Click "Run Simulation". The AI generates a realistic prospect reply and evaluates whether your current sequence logic handles it correctly or hits a dead-end.' },
      { title: 'Review the conversion score', body: 'The Conversion Score ring (0–100) reflects how likely your sequence converts this reply type. Copy the AI-suggested response to use directly in your follow-up.' },
    ],
  },
  {
    id: 'gamification', icon: Trophy, color: 'text-amber-400',
    title: 'Gamification System',
    steps: [
      { title: 'Earn XP through platform activity', body: 'You earn XP automatically: +25 XP for completing a sequence audit, +50 XP for solving the Daily Puzzle, and XP bonuses for high scores in Objection Roleplay.' },
      { title: 'Rank up through Chess titles', body: 'Starting as a Novice Pawn ♙, rank up through Outreach Knight ♘ → Tactical Bishop ♗ → Strategic Rook ♖ → Campaign Queen ♛ → System Grandmaster ♔.' },
      { title: 'Complete the Daily Puzzle', body: 'Each puzzle refreshes every 12 hours and tests your B2B outreach knowledge — spam detection, objection handling, deliverability logic. Solve it for 50 XP.' },
    ],
  },
  {
    id: 'warmup', icon: BarChart2, color: 'text-emerald-400',
    title: 'Warmup Simulator',
    steps: [
      { title: 'Select an inbox to simulate', body: 'Choose from your configured warmup inboxes. Each inbox has a current warmup score and daily send limit.' },
      { title: 'Read the 14-day chart', body: 'The reputation curve shows simulated sender reputation growth over 14 days. A healthy ramp starts slow (10-20 emails/day) and increases gradually.' },
      { title: 'Configure your ramp schedule', body: 'Adjust starting volume, daily increment, and max volume to see how different ramp strategies affect your projected reputation score.' },
    ],
  },
  {
    id: 'objection', icon: Swords, color: 'text-red-400',
    title: 'Objection Roleplay',
    steps: [
      { title: 'Choose an objection scenario', body: 'Select from 5 real-world objections: Price Too High, Already Using Competitor, Bad Timing, Budget Freeze, or "Send Me Info" (stall tactic).' },
      { title: 'Type your response', body: 'The AI plays a skeptical prospect and opens with the objection. Type your reply as you would in a real email sequence. Be specific — generic responses score low.' },
      { title: 'Receive AI scoring', body: 'After each reply, the AI grades your response 0–100 and provides specific coaching feedback. A perfect handle: acknowledge the objection, pivot with value, propose a clear next step.' },
    ],
  },
];

export default function AppGuide() {
  const [activeSection, setActiveSection] = useState<string>('start');
  const [readSteps, setReadSteps] = useState<Set<string>>(new Set());
  const [expandedStep, setExpandedStep] = useState<string | null>('start-0');

  function markRead(key: string) {
    setReadSteps((s) => new Set([...s, key]));
  }

  const totalSteps = SECTIONS.reduce((a, s) => a + s.steps.length, 0);
  const readCount = readSteps.size;
  const progressPct = Math.round((readCount / totalSteps) * 100);

  const active = SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-5" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col gap-2">
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">App Guide</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mt-2">
            <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-[10px] text-slate-600 mt-1">{readCount}/{totalSteps} steps read</p>
        </div>
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const sectionRead = s.steps.filter((_, i) => readSteps.has(`${s.id}-${i}`)).length;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive ? 'bg-indigo-500/10 ring-1 ring-indigo-500/20 text-indigo-300' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? s.color : ''}`} />
              <span className="text-xs font-medium truncate flex-1">{s.title}</span>
              {sectionRead === s.steps.length ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              ) : sectionRead > 0 ? (
                <span className="text-[9px] text-slate-600">{sectionRead}/{s.steps.length}</span>
              ) : null}
            </button>
          );
        })}
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <div className="flex items-center gap-2 mb-4">
          <active.icon className={`w-5 h-5 ${active.color}`} />
          <h2 className="text-lg font-bold text-white">{active.title}</h2>
        </div>

        {active.steps.map((step, i) => {
          const key = `${active.id}-${i}`;
          const isRead = readSteps.has(key);
          const isExpanded = expandedStep === key;

          return (
            <PremiumCard key={key} glow="none">
              <button
                className="w-full flex items-center gap-3 text-left"
                onClick={() => {
                  setExpandedStep(isExpanded ? null : key);
                  markRead(key);
                }}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                  isRead ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800 border-white/[0.08]'
                }`}>
                  {isRead
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <span className="text-xs font-bold text-slate-500">{i + 1}</span>
                  }
                </div>
                <span className={`flex-1 text-sm font-semibold ${isRead ? 'text-emerald-300' : 'text-slate-200'}`}>
                  {step.title}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {isExpanded && (
                <div className="mt-3 pl-10">
                  <p className="text-sm text-slate-400 leading-relaxed">{step.body}</p>
                  {!isRead && (
                    <button
                      onClick={() => markRead(key)}
                      className="flex items-center gap-1.5 mt-3 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Circle className="w-3 h-3" /> Mark as read
                    </button>
                  )}
                </div>
              )}
            </PremiumCard>
          );
        })}
      </div>
    </div>
  );
}
