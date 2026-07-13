// ─── AI Content Studio: source text → validated study material ───────────────
// One grounded AI call turns any pasted historical text (textbook chapter,
// article, lecture notes, primary source) into a complete study kit: summary,
// key facts, flashcards, and quiz questions — each unit independently
// validated before it can reach the UI, so a malformed model response can only
// ever shrink the output, never corrupt it.
//
// Validation is strict and mechanical:
//   • questions: exactly 4 distinct options, correctIndex in range, non-empty
//     explanation, the correct answer must not appear verbatim in the stem,
//     difficulty coerced into the app's enum
//   • flashcards: non-empty both sides, deduped case-insensitively
//   • facts: non-empty strings, deduped
// Anything failing a rule is silently dropped; the caller renders what
// survived and shows per-type counts.
import { safeJsonParse } from '@/lib/safeJsonParse';
import type { QuizQuestion } from '@/types';

export interface StudioFlashcard { front: string; back: string }

export interface StudioQuestion extends Omit<QuizQuestion, 'id'> { id: string }

export interface GeneratedKit {
  title: string;
  summary: string;
  facts: string[];
  cards: StudioFlashcard[];
  questions: StudioQuestion[];
}

export interface StudioRequest {
  sourceText: string;
  questionCount: number;  // 4–10
  cardCount: number;      // 6–20
  focus?: string;         // optional user steer, e.g. "military tactics"
}

export const SOURCE_MIN_CHARS = 200;
export const SOURCE_MAX_CHARS = 12000;

const LANG_NAMES: Record<string, string> = { en: 'English', es: 'Spanish', ru: 'Russian', mk: 'Macedonian', de: 'German', fr: 'French' };

export function buildStudioPrompt(req: StudioRequest, language: string): string {
  const langName = LANG_NAMES[language] ?? 'English';
  const source = req.sourceText.slice(0, SOURCE_MAX_CHARS);
  return `OUTPUT LANGUAGE: ${langName}. Every student-facing string you produce — title, summary, facts, flashcard fronts AND backs, question stems, all four options, explanations — MUST be written in ${langName}, even though the source text may be in a different language. Translate the material's content into ${langName}; do NOT copy source-language sentences verbatim. Proper names stay in their conventional ${langName} form.

You are a history-education content engineer. Transform the SOURCE TEXT below into study material. Every item must be answerable FROM THE SOURCE TEXT — never invent facts that are not in it. If the source contradicts common knowledge, follow the source.
${req.focus ? `\nFOCUS: emphasize "${req.focus}" where the source allows.\n` : ''}
SOURCE TEXT:
"""
${source}
"""

Produce:
- title: a short study-set title (max 8 words) naming the topic.
- summary: a 3–4 sentence synthesis of the source's core narrative.
- facts: 5–8 key facts, each one self-contained sentence with specifics (dates, names, numbers).
- flashcards: EXACTLY ${req.cardCount} pairs. front = a precise question or term; back = the concise answer (max 25 words). Cover different parts of the source; no two cards about the same sentence.
- questions: EXACTLY ${req.questionCount} multiple-choice questions. Each: question stem, EXACTLY 4 plausible options (one correct, three wrong-but-tempting drawn from the same domain), correctIndex (0-3, vary the position), explanation (1–2 sentences citing the source's logic), difficulty ("easy" | "medium" | "hard" — mix them).

QUALITY RULES:
- The correct option must never be quotable verbatim from the question stem.
- Wrong options must be historically plausible, same category as the answer (a date vs dates, a person vs persons).
- No "all of the above" / "none of the above".

FINAL LANGUAGE CHECK before you answer: every string value in your JSON must be in ${langName} — if any flashcard, question, option, or explanation is not in ${langName}, rewrite it in ${langName} first. Respond ONLY with JSON, no fences:
{
  "title": "...",
  "summary": "...",
  "facts": ["..."],
  "flashcards": [{ "front": "...", "back": "..." }],
  "questions": [{ "question": "...", "options": ["...","...","...","..."], "correctIndex": 0, "explanation": "...", "difficulty": "medium" }]
}`;
}

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const DIFFICULTIES = new Set(['easy', 'medium', 'hard']);

function validQuestion(q0: unknown): StudioQuestion | null {
  const q = q0 as Record<string, unknown>;
  const question = str(q?.question);
  const explanation = str(q?.explanation);
  if (!question || !explanation) return null;
  if (!Array.isArray(q.options)) return null;
  const options = q.options.map(str).filter(Boolean);
  if (options.length !== 4) return null;
  if (new Set(options.map(o => o.toLowerCase())).size !== 4) return null;
  const idx = typeof q.correctIndex === 'number' && Number.isInteger(q.correctIndex) ? q.correctIndex : -1;
  if (idx < 0 || idx > 3) return null;
  // The stem must not leak the answer verbatim.
  if (question.toLowerCase().includes(options[idx].toLowerCase()) && options[idx].length > 6) return null;
  const difficulty = DIFFICULTIES.has(str(q.difficulty)) ? (str(q.difficulty) as 'easy' | 'medium' | 'hard') : 'medium';
  return { id: crypto.randomUUID(), question, options, correctIndex: idx, explanation, difficulty };
}

export function parseGeneratedKit(raw: string): GeneratedKit | null {
  let p: Record<string, unknown>;
  try { p = safeJsonParse<Record<string, unknown>>(raw); } catch { return null; }
  if (!p || typeof p !== 'object') return null;

  const facts = Array.isArray(p.facts)
    ? [...new Set(p.facts.map(str).filter(Boolean))].slice(0, 10)
    : [];

  const seenFronts = new Set<string>();
  const cards: StudioFlashcard[] = Array.isArray(p.flashcards)
    ? p.flashcards
        .map(c0 => {
          const c = c0 as Record<string, unknown>;
          return { front: str(c?.front), back: str(c?.back) };
        })
        .filter(c => {
          if (!c.front || !c.back) return false;
          const key = c.front.toLowerCase();
          if (seenFronts.has(key)) return false;
          seenFronts.add(key);
          return true;
        })
        .slice(0, 24)
    : [];

  const questions: StudioQuestion[] = Array.isArray(p.questions)
    ? p.questions.map(validQuestion).filter((q): q is StudioQuestion => q !== null).slice(0, 12)
    : [];

  const title = str(p.title) || 'Untitled study set';
  const summary = str(p.summary);
  if (cards.length === 0 && questions.length === 0 && facts.length === 0) return null;
  return { title, summary, facts, cards, questions };
}
