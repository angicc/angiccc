import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bug, Lightbulb, FileText, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/AuthContext';
import { toast } from 'sonner';

type Category = 'bug' | 'feature' | 'content' | 'other';
type Priority = 'low' | 'medium' | 'high';

const CATEGORIES: { id: Category; icon: React.ElementType; label: string; desc: string; color: string; bg: string; border: string }[] = [
  { id: 'bug',     icon: Bug,          label: 'Bug Report',       desc: 'Something is broken or not working correctly',      color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/40'    },
  { id: 'feature', icon: Lightbulb,    label: 'Feature Request',  desc: 'Suggest a new feature or improvement',              color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/40'   },
  { id: 'content', icon: FileText,     label: 'Content Issue',    desc: 'Incorrect or missing historical information',       color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/40'    },
  { id: 'other',   icon: MessageSquare,label: 'Other',            desc: 'General feedback or anything else',                 color: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/40'  },
];

const PRIORITIES: { id: Priority; label: string; color: string; bg: string }[] = [
  { id: 'low',    label: 'Low',    color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'medium', label: 'Medium', color: 'text-amber-400',   bg: 'bg-amber-400/10'   },
  { id: 'high',   label: 'High',   color: 'text-rose-400',    bg: 'bg-rose-400/10'    },
];

type Report = { id: string; category: Category; priority: Priority; subject: string; description: string; userId: string; submittedAt: string };

function loadReports(): Report[] {
  try { return JSON.parse(localStorage.getItem('historify:reports') ?? '[]'); } catch { return []; }
}
function saveReport(r: Report) {
  const all = loadReports();
  all.unshift(r);
  localStorage.setItem('historify:reports', JSON.stringify(all.slice(0, 50)));
}

export default function ReportPage() {
  const { currentUser } = useAuth();
  const [category, setCategory]     = useState<Category | null>(null);
  const [priority, setPriority]     = useState<Priority>('medium');
  const [subject, setSubject]       = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = category && subject.trim().length >= 3 && description.trim().length >= 10;

  function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const report: Report = {
      id: Math.random().toString(36).slice(2),
      category: category!,
      priority,
      subject: subject.trim(),
      description: description.trim(),
      userId: currentUser?.id ?? 'anonymous',
      submittedAt: new Date().toISOString(),
    };
    setTimeout(() => {
      saveReport(report);
      setSubmitted(true);
      setSubmitting(false);
      toast.success('Report submitted — thank you for the feedback!');
    }, 800);
  }

  function reset() {
    setCategory(null);
    setPriority('medium');
    setSubject('');
    setDescription('');
    setSubmitted(false);
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-400/10">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold">Report a Problem</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Help us improve Historify — every report matters</p>
          </div>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-emerald-400/30">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold mb-2">Report Submitted</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Thank you for taking the time to report this. Your feedback helps us make Historify better for everyone.
                  </p>
                </div>
                <Button onClick={reset} variant="outline" size="sm">Submit Another Report</Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="space-y-5">
            {/* Category */}
            <Card>
              <CardContent className="pt-5 pb-4 space-y-3">
                <div>
                  <p className="font-semibold text-sm mb-0.5">Category <span className="text-rose-400">*</span></p>
                  <p className="text-muted-foreground text-xs">What type of issue are you reporting?</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                        category === cat.id
                          ? `${cat.border} ${cat.bg}`
                          : 'border-border hover:border-primary/40 hover:bg-accent/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <cat.icon className={`w-4 h-4 ${category === cat.id ? cat.color : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-semibold ${category === cat.id ? cat.color : 'text-foreground'}`}>{cat.label}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-snug">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Priority */}
            <Card>
              <CardContent className="pt-5 pb-4 space-y-3">
                <div>
                  <p className="font-semibold text-sm mb-0.5">Priority</p>
                  <p className="text-muted-foreground text-xs">How severely does this affect your experience?</p>
                </div>
                <div className="flex gap-2">
                  {PRIORITIES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPriority(p.id)}
                      className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all duration-200 ${
                        priority === p.id
                          ? `border-border ${p.bg} ${p.color}`
                          : 'border-border text-muted-foreground hover:bg-accent/30'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subject */}
            <Card>
              <CardContent className="pt-5 pb-4 space-y-3">
                <div>
                  <p className="font-semibold text-sm mb-0.5">Subject <span className="text-rose-400">*</span></p>
                  <p className="text-muted-foreground text-xs">A brief title for the issue</p>
                </div>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Quiz score not saving correctly"
                  maxLength={120}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/50"
                />
                <p className="text-xs text-muted-foreground text-right">{subject.length}/120</p>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="pt-5 pb-4 space-y-3">
                <div>
                  <p className="font-semibold text-sm mb-0.5">Description <span className="text-rose-400">*</span></p>
                  <p className="text-muted-foreground text-xs">Describe the issue in detail. Include steps to reproduce if it's a bug.</p>
                </div>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Please describe the issue in as much detail as possible. For bugs, tell us: what you did, what happened, and what you expected to happen."
                  rows={5}
                  maxLength={1000}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/50 resize-none leading-relaxed"
                />
                <p className="text-xs text-muted-foreground text-right">{description.length}/1000</p>
              </CardContent>
            </Card>

            {/* Metadata */}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground px-1">
              {category && (
                <Badge variant="outline" className="text-xs">
                  {CATEGORIES.find(c => c.id === category)?.label}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                Priority: {PRIORITIES.find(p => p.id === priority)?.label}
              </Badge>
              {currentUser && (
                <Badge variant="outline" className="text-xs">
                  Submitted as: {currentUser.email}
                </Badge>
              )}
            </div>

            {/* Submit */}
            <Button
              className="w-full gap-2"
              size="lg"
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>Submitting…</>
              ) : (
                <><Send className="w-4 h-4" /> Submit Report</>
              )}
            </Button>

            {!canSubmit && (
              <p className="text-center text-xs text-muted-foreground">
                Please select a category, add a subject (3+ chars), and a description (10+ chars) to submit.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
