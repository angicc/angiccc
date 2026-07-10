// ─── Custom study sets: persistence for AI Content Studio output ─────────────
// Every generated kit the student keeps becomes a StudySet they can practice
// (flashcard review + quiz runs) forever. Practice stats accumulate per set so
// the studio doubles as a personal spaced-practice library.
import type { StudioFlashcard, StudioQuestion, GeneratedKit } from './studioEngine';

export interface StudySet {
  id: string;
  name: string;
  createdAt: string;
  sourceExcerpt: string;   // first ~160 chars of the source, for provenance
  summary: string;
  facts: string[];
  cards: StudioFlashcard[];
  questions: StudioQuestion[];
  timesPracticed: number;
  bestScore: number;       // best quiz-run percentage
  lastPracticedAt?: string;
}

const KEY = (uid: string) => `historify:studySets:${uid}`;
const MAX_SETS = 30;
export const STUDY_SETS_UPDATED_EVENT = 'historify:study-sets-updated';

export function listStudySets(userId: string): StudySet[] {
  try {
    const raw = localStorage.getItem(KEY(userId));
    const parsed = raw ? (JSON.parse(raw) as StudySet[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function persist(userId: string, sets: StudySet[]) {
  try {
    localStorage.setItem(KEY(userId), JSON.stringify(sets.slice(-MAX_SETS)));
    window.dispatchEvent(new CustomEvent(STUDY_SETS_UPDATED_EVENT));
  } catch { /* quota — best-effort */ }
}

export function saveStudySet(userId: string, kit: GeneratedKit, name: string, sourceText: string): StudySet {
  const set: StudySet = {
    id: crypto.randomUUID(),
    name: name.trim() || kit.title,
    createdAt: new Date().toISOString(),
    sourceExcerpt: sourceText.slice(0, 160),
    summary: kit.summary,
    facts: kit.facts,
    cards: kit.cards,
    questions: kit.questions,
    timesPracticed: 0,
    bestScore: 0,
  };
  persist(userId, [...listStudySets(userId), set]);
  return set;
}

export function deleteStudySet(userId: string, setId: string) {
  persist(userId, listStudySets(userId).filter(s => s.id !== setId));
}

export function recordPracticeRun(userId: string, setId: string, scorePct: number) {
  const sets = listStudySets(userId);
  const set = sets.find(s => s.id === setId);
  if (!set) return;
  set.timesPracticed += 1;
  set.bestScore = Math.max(set.bestScore, Math.round(scorePct));
  set.lastPracticedAt = new Date().toISOString();
  persist(userId, sets);
}
