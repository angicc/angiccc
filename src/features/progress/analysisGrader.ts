// ─── Clio's Strict Analysis Grader ───────────────────────────────────────────
// Grades a learner's 150–300-word lesson analysis. Primary path: the AI
// gateway with a strict-rubric JSON prompt. Fallback path: a deterministic
// local rubric (term coverage, analytical reasoning, specificity, structure)
// so the progression gate keeps working with no network/key — the gate must
// never brick the learner's path forward.
import type { Lesson } from '@/types';
import { streamChatResponse } from '@/services/aiGateway';
import { safeJsonParse } from '@/lib/safeJsonParse';
import { type AnalysisGrade, PASS_SCORE, countWords } from './analysisGate';

export interface AnalysisVerdict {
  grade: AnalysisGrade;
  score: number;          // 0–100
  passed: boolean;        // score >= PASS_SCORE (grade B or better)
  feedback: string;
  strengths: string[];
  improvements: string[];
  source: 'ai' | 'local';
}

export function scoreToGrade(score: number): AnalysisGrade {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 85) return 'B+';
  if (score >= PASS_SCORE) return 'B';
  if (score >= 73) return 'C+';
  if (score >= 65) return 'C';
  if (score >= 55) return 'D';
  return 'F';
}

const GRADER_SYSTEM = (lesson: Lesson) => `You are Clio, the strict historical-analysis examiner of the Historify app.
The student just finished the lesson "${lesson.title}" (${lesson.subtitle}) and submitted a written analysis of it.
Lesson key facts: ${lesson.keyFacts.join(' | ')}
Lesson sections: ${lesson.sections.map(s => s.heading).join(' | ')}

Grade the analysis STRICTLY on four criteria (25 points each, total 0-100):
1. UNDERSTANDING — does it accurately engage the lesson's actual content (people, dates, events, ideas)?
2. ANALYSIS — does it explain causes, consequences, and significance rather than merely summarize?
3. SPECIFICITY — concrete names, dates, places, and examples from the lesson?
4. CLARITY — coherent structure and precise language?

Be a demanding examiner: a generic summary with no analytical reasoning must score below 80. Reserve 90+ for genuinely insightful work. Factually wrong claims cost points.

Respond with RAW JSON ONLY, no prose before or after, exactly this shape:
{"score": <integer 0-100>, "feedback": "<2-3 sentence verdict in the student's language>", "strengths": ["<short point>", "<short point>"], "improvements": ["<short point>", "<short point>"]}`;

const asStrings = (v: unknown, max: number): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).slice(0, max) : [];

async function gradeWithAi(text: string, lesson: Lesson): Promise<AnalysisVerdict> {
  let full = '';
  for await (const chunk of streamChatResponse(
    [{ role: 'user', content: `Student analysis (${countWords(text)} words):\n\n${text}` }],
    undefined,
    GRADER_SYSTEM(lesson),
    2048, // {score, feedback, strengths[], improvements[]} — the same JSON shape
          // that truncated in the Crisis tribunal; runs long in Macedonian.
  )) full += chunk;
  // Shared repair-tolerant parser: handles the student's own quoted text echoed
  // verbatim into feedback, truncated streams, and markdown fences.
  const raw = safeJsonParse<{ score?: unknown; feedback?: unknown; strengths?: unknown; improvements?: unknown }>(full);
  const score = Math.max(0, Math.min(100, Math.round(Number(raw.score))));
  if (!Number.isFinite(score)) throw new Error('bad score');
  return {
    grade: scoreToGrade(score),
    score,
    passed: score >= PASS_SCORE,
    feedback: typeof raw.feedback === 'string' && raw.feedback.trim() ? raw.feedback.trim() : '',
    strengths: asStrings(raw.strengths, 3),
    improvements: asStrings(raw.improvements, 3),
    source: 'ai',
  };
}

// ── Deterministic local rubric ──────────────────────────────────────────────

// Analytical connectives across the app's six content languages — evidence
// the student is reasoning about causes/consequences, not just retelling.
const ANALYTICAL_MARKERS = [
  // en
  'because', 'therefore', 'consequence', 'led to', 'caused', 'resulted', 'however', 'although', 'significance', 'impact', 'influence', 'compared', 'contrast', 'shaped', 'legacy', 'transformed',
  // es
  'porque', 'por lo tanto', 'consecuencia', 'condujo', 'causó', 'sin embargo', 'aunque', 'importancia', 'impacto', 'influencia', 'transformó', 'legado',
  // de
  'weil', 'daher', 'folge', 'führte', 'verursachte', 'jedoch', 'obwohl', 'bedeutung', 'einfluss', 'prägte', 'vermächtnis',
  // fr
  'parce que', 'donc', 'conséquence', 'a conduit', 'causé', 'cependant', 'bien que', 'importance', 'influencé', 'héritage', 'transformé',
  // ru
  'потому что', 'поэтому', 'следствие', 'привело', 'вызвало', 'однако', 'хотя', 'значение', 'влияние', 'наследие', 'изменило',
  // mk
  'бидејќи', 'затоа', 'последица', 'доведе', 'предизвика', 'сепак', 'иако', 'значење', 'влијание', 'наследство', 'промени',
];

/** Significant terms the analysis should touch: proper nouns + numbers from the lesson the student just read. */
function lessonTerms(lesson: Lesson): string[] {
  const text = [lesson.title, lesson.subtitle, ...lesson.keyFacts, ...lesson.sections.map(s => `${s.heading} ${s.body}`)].join(' ');
  const terms = new Set<string>();
  // Multi-script capitalized words (Latin + Cyrillic), min length 4 to skip sentence-starts like "The".
  for (const m of text.matchAll(/(?<=\s|^|[("'«])([A-ZÀ-ÞЀ-Я][a-zà-þа-яё]{3,})/gu)) terms.add(m[1].toLowerCase());
  for (const m of text.matchAll(/\b\d{3,4}\b/g)) terms.add(m[0]);
  return [...terms];
}

export function gradeLocally(text: string, lesson: Lesson): AnalysisVerdict {
  const lower = text.toLowerCase();
  const words = countWords(text);

  // 1. Understanding / coverage — fraction of lesson terms the analysis engages.
  const terms = lessonTerms(lesson);
  const hits = terms.filter(t => lower.includes(t)).length;
  const coverageNeeded = Math.min(10, Math.max(4, Math.round(terms.length * 0.08)));
  const coverage = Math.min(1, hits / coverageNeeded);

  // 2. Analysis — distinct analytical connectives used (strict: wants 4+).
  const markersUsed = ANALYTICAL_MARKERS.filter(m => lower.includes(m)).length;
  const reasoning = Math.min(1, markersUsed / 4);

  // 3. Specificity — dates/numbers mentioned (wants 2+).
  const numbers = (text.match(/\b\d{3,4}\b/g) ?? []).length;
  const specificity = Math.min(1, numbers / 2);

  // 4. Clarity/structure — sentence count and average sentence length in a readable band.
  const sentences = text.split(/[.!?…]+/).map(s => s.trim()).filter(s => s.length > 8);
  const avgLen = sentences.length ? words / sentences.length : 99;
  const structure = (sentences.length >= 7 ? 0.5 : sentences.length / 14) + (avgLen >= 9 && avgLen <= 32 ? 0.5 : 0.2);

  const score = Math.round(coverage * 30 + reasoning * 30 + specificity * 20 + Math.min(1, structure) * 20);

  const strengths: string[] = [];
  const improvements: string[] = [];
  if (coverage >= 0.7) strengths.push('Engages the lesson\'s actual people, places, and events.');
  else improvements.push('Anchor your points in more of the lesson\'s specific people, places, and events.');
  if (reasoning >= 0.75) strengths.push('Reasons about causes and consequences, not just summary.');
  else improvements.push('Explain WHY events happened and what followed — use cause-and-effect reasoning.');
  if (specificity >= 1) strengths.push('Cites concrete dates and figures.');
  else improvements.push('Cite at least two concrete dates or figures from the lesson.');
  if (Math.min(1, structure) >= 0.9) strengths.push('Clear, well-paced sentence structure.');
  else improvements.push('Build the argument across several full, connected sentences.');

  const passed = score >= PASS_SCORE;
  return {
    grade: scoreToGrade(score),
    score,
    passed,
    feedback: passed
      ? 'A disciplined analysis: you engage the material directly and reason about its significance. The path forward is open.'
      : 'Not yet at the bar. Clio demands analysis, not retelling — engage the lesson\'s specifics and argue their significance, then resubmit.',
    strengths,
    improvements,
    source: 'local',
  };
}

/** Grade an analysis: strict AI examiner first, deterministic rubric as the safety net. */
export async function gradeAnalysis(text: string, lesson: Lesson): Promise<AnalysisVerdict> {
  try {
    return await gradeWithAi(text, lesson);
  } catch {
    return gradeLocally(text, lesson);
  }
}
