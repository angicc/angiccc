import { motion } from 'framer-motion';
import { BookOpen, Brain, ScrollText, Sparkles, Layers, BarChart2, PenLine, Crown, ArrowRight, CheckCircle2, Trophy, Flame, User, FileEdit, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const STEPS = [
  {
    step: 1,
    icon: Crown,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    title: 'Choose Your Plan',
    desc: 'Start for free with 4 intro lessons (one per era). Upgrade to Pro for all 18 lessons and AI Tutor access, or go Master for unlimited AI and downloads.',
    tips: ['Free plan: no credit card needed', 'Pro Learner: $10/month, most popular', 'Master Student: $20/month, unlimited everything'],
    link: '/pricing',
    linkLabel: 'View Plans',
  },
  {
    step: 2,
    icon: BookOpen,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
    title: 'Explore Eras & Lessons',
    desc: 'Navigate to Eras & Lessons from the sidebar. Choose an era — Ancient World, Middle Ages, Early Modern, or Modern — and open any unlocked lesson.',
    tips: ['Each era has 4–5 lessons', 'Lessons include rich historical detail', 'Complete a lesson to unlock the era quiz'],
    link: '/eras',
    linkLabel: 'Go to Eras',
  },
  {
    step: 3,
    icon: ScrollText,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    title: 'Explore the Timeline',
    desc: 'The interactive timeline shows 50+ pivotal events across all eras. Click any event to read a summary and jump directly to its lesson.',
    tips: ['Filter by era using the tab bar', 'Events link directly to lessons', 'Pro users see all categories and filters'],
    link: '/timeline',
    linkLabel: 'Open Timeline',
  },
  {
    step: 4,
    icon: Brain,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/30',
    title: 'Ask Clio — Your AI Tutor',
    desc: 'Clio is your personal AI history tutor. Ask anything about history, get explanations, compare events, or dig deeper into any topic from your lessons.',
    tips: ['Available on Pro and Master plans', 'Pro: 50 messages/month', 'Master: unlimited messages', 'Clio also appears as a chatbot on the landing page'],
    link: '/tutor',
    linkLabel: 'Open AI Tutor',
  },
  {
    step: 5,
    icon: Trophy,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/30',
    title: 'Take Quizzes & Earn XP',
    desc: 'Each era has a quiz with 15 questions testing what you learned. Correct answers earn XP, level you up, and track your score per era.',
    tips: ['15 questions per era quiz', '+15 XP per correct answer', 'Quiz explanations available on Pro+'],
    link: '/eras',
    linkLabel: 'Go to Eras',
  },
  {
    step: 6,
    icon: Sparkles,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-400/10',
    border: 'border-fuchsia-400/30',
    title: 'Try the Smart Quiz',
    desc: 'Smart Quiz is an adaptive 10-question session drawn from all 4 eras. The algorithm targets your weakest areas and calibrates difficulty to your performance.',
    tips: ['Available on Pro and Master plans', '10 questions per session', 'Algorithm weights weak eras higher', 'Earn up to +150 XP per session'],
    link: '/smart-quiz',
    linkLabel: 'Try Smart Quiz',
  },
  {
    step: 7,
    icon: Layers,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/30',
    title: 'Review with Flashcards',
    desc: 'Flashcards let you drill key terms, dates, and concepts from every lesson. Flip cards to reveal answers and mark them as known or unknown.',
    tips: ['Cards drawn from all lessons', 'Great for revision before quizzes', 'Track how many you know'],
    link: '/flashcards',
    linkLabel: 'Open Flashcards',
  },
  {
    step: 8,
    icon: PenLine,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/30',
    title: 'Write Personal Notes',
    desc: 'Capture your thoughts, insights, and summaries as you study. Notes are linked to lessons and saved locally — always there when you come back.',
    tips: ['Notes saved per lesson', 'Accessible from the My Notes page', 'All data stored locally on your device'],
    link: '/notes',
    linkLabel: 'Open Notes',
  },
  {
    step: 9,
    icon: BarChart2,
    color: 'text-teal-400',
    bg: 'bg-teal-400/10',
    border: 'border-teal-400/30',
    title: 'Track Your Progress',
    desc: 'The Progress page shows your XP history, era completion rates, quiz scores, streak, and achievement badges. See exactly where you stand.',
    tips: ['Streak resets if you miss a day', 'Achievements unlock at milestones', 'Charts update after every quiz'],
    link: '/progress',
    linkLabel: 'View Progress',
  },
  {
    step: 10,
    icon: FileEdit,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/30',
    title: 'Essay Challenge',
    desc: 'Put your historical knowledge to the test with a timed essay challenge. Clio grades your essay live with detailed analysis on argument, evidence, depth, and writing quality.',
    tips: ['Available on Pro and Master plans', 'Essays are graded by Clio — strict but constructive', 'Choose from multiple historical topics', 'Earn XP proportional to your grade (A = max XP)'],
    link: '/essay',
    linkLabel: 'Try Essay Challenge',
  },
  {
    step: 11,
    icon: Film,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/30',
    title: 'Video Review Challenge',
    desc: 'Watch a curated educational history video (≤10 min), then write your analysis identifying the main motive or argument. Clio grades your review sentence-by-sentence with a live 3D animation.',
    tips: ['Exclusive to Master Student plan', 'A new video unlocks every 12 hours', 'Earn special Video XP — separate from regular XP', 'Video XP advances your Historical Chess Rank', 'Chess Rank gives 2× advantage on the Leaderboard'],
    link: '/video-review',
    linkLabel: 'Open Video Review',
  },
];

const FAQ = [
  { q: 'Is my data saved?', a: 'All progress, notes, and settings are saved locally in your browser. Clearing browser data will reset everything.' },
  { q: 'Can I use Historify on mobile?', a: 'Yes — the app is fully responsive. Use the hamburger menu in the top-left to open the sidebar on mobile.' },
  { q: 'How do I upgrade my plan?', a: 'Go to the Pricing page or click "Upgrade Plan" in the sidebar. Changes apply instantly.' },
  { q: 'What happens to my progress if I upgrade?', a: 'All XP, quiz scores, notes, and streaks carry over seamlessly when you upgrade.' },
  { q: 'How does the Smart Quiz algorithm work?', a: 'It assigns higher weight to eras where your quiz score is low or where you have never attempted a quiz. Difficulty calibrates based on your average score across all quizzes.' },
];

export default function AppGuidePage() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 pb-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">App Guide</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Everything you need to know to get the most out of Historify</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">11 Features</Badge>
            <Badge variant="outline" className="text-xs">Free & Pro plans</Badge>
          </div>
        </motion.div>

        {/* Quick start */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start gap-3">
                <Flame className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">Quick Start</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    New here? Start by completing a lesson in the <strong>Eras & Lessons</strong> section, then take the era quiz to earn XP. Once you have a feel for the app, upgrade to Pro to unlock all 18 lessons and the AI Tutor.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link to="/eras"><Button size="sm" className="gap-1.5 h-7 text-xs">Start a Lesson <ArrowRight className="w-3 h-3" /></Button></Link>
                    <Link to="/pricing"><Button size="sm" variant="outline" className="h-7 text-xs">See Plans</Button></Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i + 0.1 }}
            >
              <Card className={`border ${s.border}`}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">Step {s.step}</span>
                        <h2 className="font-heading font-semibold text-base">{s.title}</h2>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">{s.desc}</p>
                      <div className="space-y-1.5 mb-3">
                        {s.tips.map(tip => (
                          <div key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
                            {tip}
                          </div>
                        ))}
                      </div>
                      <Link to={s.link}>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                          {s.linkLabel} <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
          <h2 className="font-heading text-xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <p className="font-semibold text-sm mb-1">{item.q}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-5 pb-4 text-center space-y-3">
              <User className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-heading font-semibold">Ready to begin your journey?</h3>
              <p className="text-muted-foreground text-sm">Head to the Dashboard to see your progress at a glance, or jump straight into a lesson.</p>
              <div className="flex gap-2 justify-center">
                <Link to="/dashboard"><Button size="sm" className="gap-1.5">Dashboard <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
                <Link to="/eras"><Button size="sm" variant="outline">Start Learning</Button></Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  );
}
