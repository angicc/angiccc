import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Brain, ScrollText, Sparkles, Layers, BarChart2, PenLine, Crown, ArrowRight, CheckCircle2, Trophy, Flame, User, FileEdit, Film, Scale, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslatedGuideContent } from '@/i18n/appGuideTranslations';

const STEP_VISUALS = [
  { icon: Crown,    color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30' },
  { icon: BookOpen, color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/30' },
  { icon: ScrollText, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  { icon: Brain,    color: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/30' },
  { icon: Trophy,   color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/30' },
  { icon: Sparkles, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', border: 'border-fuchsia-400/30' },
  { icon: Layers,   color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/30' },
  { icon: PenLine,  color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/30' },
  { icon: BarChart2,color: 'text-teal-400',    bg: 'bg-teal-400/10',    border: 'border-teal-400/30' },
  { icon: FileEdit, color: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/30' },
  { icon: Scale,    color: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/30' },
  { icon: Film,     color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/30' },
  { icon: Globe2,   color: 'text-sky-400',     bg: 'bg-sky-400/10',     border: 'border-sky-400/30' },
];

export default function AppGuidePage() {
  const { t, language } = useLanguage();
  const { steps, faq } = getTranslatedGuideContent(language);

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
              <h1 className="font-heading text-3xl font-bold">{t.guide_title}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{t.guide_subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">{t.guide_features}</Badge>
            <Badge variant="outline" className="text-xs">{t.guide_free_pro}</Badge>
          </div>
        </motion.div>

        {/* Quick start */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start gap-3">
                <Flame className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">{t.guide_quick_start}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t.guide_qs_desc}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link to="/eras"><Button size="sm" className="gap-1.5 h-7 text-xs">{t.guide_start_lesson} <ArrowRight className="w-3 h-3" /></Button></Link>
                    <Link to="/pricing"><Button size="sm" variant="outline" className="h-7 text-xs">{t.guide_see_plans}</Button></Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((s, i) => {
            const visual = STEP_VISUALS[i];
            const StepIcon = visual.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i + 0.1 }}
              >
                <Card className={`border ${visual.border}`}>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${visual.bg} flex items-center justify-center shrink-0`}>
                        <StepIcon className={`w-5 h-5 ${visual.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">{t.guide_step} {s.step}</span>
                          <h2 className="font-heading font-semibold text-base">{s.title}</h2>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3">{s.desc}</p>
                        <div className="space-y-1.5 mb-3">
                          {s.tips.map((tip, j) => (
                            <div key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
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
            );
          })}
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
          <h2 className="font-heading text-xl font-bold">{t.guide_faq_title}</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
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
              <h3 className="font-heading font-semibold">{t.guide_cta_title}</h3>
              <p className="text-muted-foreground text-sm">{t.guide_cta_desc}</p>
              <div className="flex gap-2 justify-center">
                <Link to="/dashboard"><Button size="sm" className="gap-1.5">{t.guide_dashboard} <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
                <Link to="/eras"><Button size="sm" variant="outline">{t.guide_start_learning}</Button></Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  );
}
