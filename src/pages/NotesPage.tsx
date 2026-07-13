import { useState, useEffect } from 'react';
import { PenLine, Trash2, Plus, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/AuthContext';
import { LESSONS } from '@/features/content/lessonsData';
import { getTranslatedLesson } from '@/i18n/contentTranslations';
import { ERAS } from '@/features/content/erasData';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/i18n/translations';

interface Note {
  id: string;
  title: string;
  content: string;
  lessonId: string | null;
  eraId: string | null;
  createdAt: string;
}

const ERA_COLOR: Record<string, string> = {
  ancient: 'text-amber-400 border-amber-400/30 bg-amber-400/5',
  'middle-ages': 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  'early-modern': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  modern: 'text-rose-400 border-rose-400/30 bg-rose-400/5',
};

const ERA_SHORT_I18N: Record<string, Record<Exclude<Language, 'en'>, string>> = {
  ancient:       { es: 'Antiguo',    ru: 'Древний',    mk: 'Античко', de: 'Antike', fr: 'Antiquité' },
  'middle-ages': { es: 'Medieval',   ru: 'Средние Века', mk: 'Среден Век', de: 'Mittelalter', fr: 'Moyen Âge' },
  'early-modern':{ es: 'Moderno Temprano', ru: 'Раннее Новое', mk: 'Рано Модерно', de: 'Frühe Neuzeit', fr: 'Époque moderne' },
  modern:        { es: 'Moderno',    ru: 'Современный', mk: 'Модерно', de: 'Moderne', fr: 'Contemporain' },
};

function getEraShortName(eraId: string, lang: Language): string {
  const era = ERAS.find(e => e.id === eraId);
  if (!era) return eraId;
  if (lang === 'en') return era.shortName;
  return ERA_SHORT_I18N[eraId]?.[lang as Exclude<Language, 'en'>] ?? era.shortName;
}

function loadNotes(userId: string): Note[] {
  try { return JSON.parse(localStorage.getItem(`historify:notes:${userId}`) ?? '[]'); } catch { return []; }
}
function saveNotes(userId: string, notes: Note[]) {
  localStorage.setItem(`historify:notes:${userId}`, JSON.stringify(notes));
}

export default function NotesPage() {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [lessonId, setLessonId] = useState<string>('none');
  const [eraFilter, setEraFilter] = useState<string>('all');

  useEffect(() => {
    if (currentUser) setNotes(loadNotes(currentUser.id));
  }, [currentUser]);

  function save() {
    if (!currentUser || !content.trim()) return;
    const lesson = LESSONS.find(l => l.id === lessonId);
    const note: Note = {
      id: crypto.randomUUID(),
      title: title.trim() || (lesson ? lesson.title : t.notes_untitled),
      content: content.trim(),
      lessonId: lessonId === 'none' ? null : lessonId,
      eraId: lesson?.eraId ?? null,
      createdAt: new Date().toISOString(),
    };
    const updated = [note, ...notes];
    setNotes(updated);
    saveNotes(currentUser.id, updated);
    setTitle(''); setContent(''); setLessonId('none'); setComposing(false);
    toast.success(t.notes_saved);
  }

  function del(id: string) {
    if (!currentUser) return;
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotes(currentUser.id, updated);
    toast.success(t.notes_deleted);
  }

  const filtered = eraFilter === 'all' ? notes : notes.filter(n => n.eraId === eraFilter);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10">
              <PenLine className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">{t.notes_title}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{notes.length} {t.notes_count}</p>
            </div>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setComposing(true)}>
            <Plus className="w-4 h-4" /> {t.notes_new_note}
          </Button>
        </motion.div>

        {/* Compose panel */}
        <AnimatePresence>
          {composing && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="border border-primary/40 bg-primary/5 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{t.notes_new_note}</p>
                <button onClick={() => setComposing(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Input
                placeholder={t.notes_title + ' (optional)'}
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="text-sm"
              />
              <Select value={lessonId} onValueChange={setLessonId}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder={t.notes_select} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  {ERAS.map(era => (
                    <div key={era.id}>
                      <div className="px-2 py-1 text-xs text-muted-foreground font-semibold">{getEraShortName(era.id, language)}</div>
                      {LESSONS.filter(l => l.eraId === era.id).map(l => (
                        <SelectItem key={l.id} value={l.id}>{getTranslatedLesson(l, language).title}</SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder={t.notes_placeholder}
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={4}
                className="resize-none text-sm"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setComposing(false)}>{t.btn_cancel ?? 'Cancel'}</Button>
                <Button size="sm" onClick={save} disabled={!content.trim()}>{t.notes_save}</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Era Filter */}
        {notes.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {['all', ...ERAS.map(e => e.id)].map(id => {
              const isActive = eraFilter === id;
              return (
                <button
                  key={id}
                  onClick={() => setEraFilter(id)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${isActive ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
                >
                  {id === 'all' ? t.notes_all_eras : getEraShortName(id, language)}
                </button>
              );
            })}
          </div>
        )}

        {/* Notes grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <PenLine className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{notes.length === 0 ? t.notes_none : t.notes_none_filter}</p>
            <p className="text-sm mt-1">{t.notes_hint}</p>
          </div>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence>
              {filtered.map(note => {
                const lesson = LESSONS.find(l => l.id === note.lessonId);
                const era = note.eraId ? ERAS.find(e => e.id === note.eraId) : null;
                return (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`relative p-5 rounded-xl border bg-card group ${note.eraId ? ERA_COLOR[note.eraId] ?? 'border-border' : 'border-border'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <p className="font-semibold text-sm">{note.title}</p>
                          {era && (
                            <Badge variant="outline" className={`text-xs ${note.eraId ? ERA_COLOR[note.eraId]?.split(' ')[0] : ''}`}>
                              {getEraShortName(era.id, language)}
                            </Badge>
                          )}
                        </div>
                        {lesson && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <BookOpen className="w-3 h-3" />
                            {getTranslatedLesson(lesson, language).title}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-muted-foreground/60 mt-3">
                          {new Date(note.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : language === 'ru' ? 'ru-RU' : 'mk-MK', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button
                        onClick={() => del(note.id)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
