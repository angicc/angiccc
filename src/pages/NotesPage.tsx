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
import { ERAS } from '@/features/content/erasData';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

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

function loadNotes(userId: string): Note[] {
  try { return JSON.parse(localStorage.getItem(`historify:notes:${userId}`) ?? '[]'); } catch { return []; }
}
function saveNotes(userId: string, notes: Note[]) {
  localStorage.setItem(`historify:notes:${userId}`, JSON.stringify(notes));
}

export default function NotesPage() {
  const { t } = useLanguage();
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
      title: title.trim() || (lesson ? lesson.title : 'Untitled Note'),
      content: content.trim(),
      lessonId: lessonId === 'none' ? null : lessonId,
      eraId: lesson?.eraId ?? null,
      createdAt: new Date().toISOString(),
    };
    const updated = [note, ...notes];
    setNotes(updated);
    saveNotes(currentUser.id, updated);
    setTitle(''); setContent(''); setLessonId('none'); setComposing(false);
    toast.success('Note saved!');
  }

  function del(id: string) {
    if (!currentUser) return;
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotes(currentUser.id, updated);
    toast.success('Note deleted.');
  }

  const filtered = eraFilter === 'all' ? notes : notes.filter(n => n.eraId === eraFilter);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10">
              <PenLine className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">{t.notes_title}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{notes.length} note{notes.length !== 1 ? 's' : ''} saved</p>
            </div>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setComposing(true)}>
            <Plus className="w-4 h-4" /> New Note
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
                <p className="font-semibold text-sm">New Note</p>
                <button onClick={() => setComposing(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Input
                placeholder="Note title (optional)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="text-sm"
              />
              <Select value={lessonId} onValueChange={setLessonId}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="Link to a lesson (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No lesson</SelectItem>
                  {ERAS.map(era => (
                    <div key={era.id}>
                      <div className="px-2 py-1 text-xs text-muted-foreground font-semibold">{era.shortName}</div>
                      {LESSONS.filter(l => l.eraId === era.id).map(l => (
                        <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Write your note here…"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={4}
                className="resize-none text-sm"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setComposing(false)}>Cancel</Button>
                <Button size="sm" onClick={save} disabled={!content.trim()}>Save Note</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter */}
        {notes.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {['all', ...ERAS.map(e => e.id)].map(id => {
              const era = ERAS.find(e => e.id === id);
              const isActive = eraFilter === id;
              return (
                <button
                  key={id}
                  onClick={() => setEraFilter(id)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${isActive ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
                >
                  {era ? era.shortName : 'All Eras'}
                </button>
              );
            })}
          </div>
        )}

        {/* Notes grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <PenLine className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{notes.length === 0 ? 'No notes yet' : 'No notes for this filter'}</p>
            <p className="text-sm mt-1">Click "New Note" to capture your thoughts as you learn.</p>
          </div>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence>
              {filtered.map(note => {
                const lesson = LESSONS.find(l => l.id === note.lessonId);
                const era = ERAS.find(e => e.id === note.eraId);
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
                              {era.shortName}
                            </Badge>
                          )}
                        </div>
                        {lesson && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <BookOpen className="w-3 h-3" />
                            {lesson.title}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-muted-foreground/60 mt-3">
                          {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
