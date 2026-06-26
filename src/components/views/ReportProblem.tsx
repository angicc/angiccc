import { useState, useRef } from 'react';
import { AlertTriangle, CheckCircle2, Upload, X, Send, Bug, Zap, BarChart3, HelpCircle } from 'lucide-react';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';

type Priority = 'low' | 'medium' | 'high' | 'critical';
type Category = 'bug' | 'feature' | 'performance' | 'question' | 'billing';

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-700/30 border-slate-600/30' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

const CATEGORY_CONFIG: Record<Category, { label: string; icon: React.ElementType }> = {
  bug: { label: 'Bug Report', icon: Bug },
  feature: { label: 'Feature Request', icon: Zap },
  performance: { label: 'Performance Issue', icon: BarChart3 },
  question: { label: 'Question', icon: HelpCircle },
  billing: { label: 'Billing', icon: AlertTriangle },
};

type Ticket = {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  submittedAt: string;
  status: 'open' | 'in_review' | 'resolved';
};

const MOCK_TICKETS: Ticket[] = [
  { id: 'TKT-1042', title: 'DNS Shield check hangs on .io domains', category: 'bug', priority: 'high', submittedAt: '2026-06-20', status: 'in_review' },
  { id: 'TKT-1038', title: 'Add Hubspot native integration', category: 'feature', priority: 'medium', submittedAt: '2026-06-15', status: 'open' },
  { id: 'TKT-1031', title: 'AI Terminal loading time', category: 'performance', priority: 'low', submittedAt: '2026-06-10', status: 'resolved' },
];

const STATUS_STYLES = {
  open: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  in_review: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  resolved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

export default function ReportProblem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('bug');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setScreenshots((s) => [...s, result]);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    const id = `TKT-${1043 + Math.floor(Math.random() * 100)}`;
    setTicketId(id);
    setSubmitted(true);
  }

  function handleReset() {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('bug');
    setScreenshots([]);
    setSubmitted(false);
    setTicketId('');
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Report a Problem</h2>
        <p className="text-sm text-slate-500 mt-1">Submit a bug report, feature request, or support ticket. Our team reviews all submissions within 24 hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <PremiumCard glow="emerald">
              <div className="flex flex-col items-center py-8 text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <p className="text-lg font-black text-white">Ticket Submitted</p>
                  <p className="text-sm text-slate-400 mt-1">Your ticket ID is <span className="text-emerald-400 font-mono font-bold">{ticketId}</span></p>
                  <p className="text-xs text-slate-600 mt-2">We typically respond within 24 hours. Check your email for updates.</p>
                </div>
                <GlowButton variant="ghost" onClick={handleReset}>Submit Another</GlowButton>
              </div>
            </PremiumCard>
          ) : (
            <PremiumCard glow="none">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-semibold">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(CATEGORY_CONFIG) as Category[]).map((c) => {
                      const cfg = CATEGORY_CONFIG[c];
                      const Icon = cfg.icon;
                      const isActive = category === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCategory(c)}
                          className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                            isActive ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'bg-slate-900/40 border-white/[0.06] text-slate-500 hover:border-white/10'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[10px] font-medium leading-tight">{cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-semibold">Priority</label>
                  <div className="flex gap-2">
                    {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => {
                      const cfg = PRIORITY_CONFIG[p];
                      const isActive = priority === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            isActive ? `${cfg.bg} ${cfg.color}` : 'bg-slate-900/40 border-white/[0.06] text-slate-600 hover:border-white/10'
                          }`}
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-semibold">Issue Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief description of the issue..."
                    className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-semibold">Detailed Description</label>
                  <textarea
                    required
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Steps to reproduce, expected behavior, what actually happened..."
                    className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 resize-none"
                  />
                </div>

                {/* Screenshot upload */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-semibold">Screenshots (optional)</label>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full border border-dashed border-white/[0.1] rounded-lg p-4 text-center hover:border-white/20 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-slate-600 mx-auto mb-1.5" />
                    <p className="text-xs text-slate-600">Click to upload screenshots</p>
                    <p className="text-[10px] text-slate-700 mt-0.5">PNG, JPG, WebP — max 5MB each</p>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                  {screenshots.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {screenshots.map((src, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/[0.08]">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setScreenshots((s) => s.filter((_, j) => j !== i))}
                            className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-slate-900/80 flex items-center justify-center"
                          >
                            <X className="w-2.5 h-2.5 text-slate-300" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <GlowButton variant="primary" icon={<Send className="w-4 h-4" />}>
                  Submit Ticket
                </GlowButton>
              </form>
            </PremiumCard>
          )}
        </div>

        {/* Previous tickets */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-slate-500" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Recent Tickets</span>
          </div>
          {MOCK_TICKETS.map((t) => {
            const prCfg = PRIORITY_CONFIG[t.priority];
            const CatIcon = CATEGORY_CONFIG[t.category].icon;
            return (
              <PremiumCard key={t.id} glow="none">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CatIcon className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-mono text-slate-600">{t.id}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${prCfg.bg} ${prCfg.color}`}>{prCfg.label}</span>
                      <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full border capitalize ${STATUS_STYLES[t.status]}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium truncate">{t.title}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{t.submittedAt}</p>
                  </div>
                </div>
              </PremiumCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
