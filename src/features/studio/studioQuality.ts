// ─── AI Content Studio: measuring what the model actually produced ────────────
// The Studio used to make one call, throw away whatever failed a shape check,
// and hand over the remainder without comment. That hides four defects a shape
// check cannot see — and every one of them was measurable all along.
//
//   1. ANSWER POSITION. Nothing shuffled a generated question, and models
//      overwhelmingly put the correct option first or second. A set where the
//      answer is at A every time is answerable without reading it. The authored
//      quiz bank had exactly this problem (89.5% in the middle two slots) and
//      solved it at serve time in prepareQuestion; generated sets went through
//      no such step. Fixed here deterministically — reordering options and
//      moving correctIndex with them needs no second opinion from a model.
//
//   2. LENGTH BIAS. When the correct option is conspicuously the longest, the
//      question is answerable by shape. Cannot be repaired by shuffling — the
//      distractors have to be rewritten — so it is measured and drives a repair
//      request instead.
//
//   3. UNGROUNDED CONTENT. The prompt insists every item be answerable from the
//      source; nothing checked. A fabricated date sails through a shape check
//      untouched. Numbers are the sharpest test: a year in the answer that does
//      not appear anywhere in the source did not come from the source.
//
//   4. SILENT SHRINKAGE. Ask for 10 questions, get 6, hear nothing. The learner
//      cannot tell a short source from a bad generation. Now reported, with the
//      reason, and short counts trigger a targeted top-up rather than making
//      the learner press the button again and hope.
//
// Everything here is deterministic and testable. The model is asked a second
// time only for the things a machine genuinely cannot fix.

import type { GeneratedKit, StudioQuestion, StudioFlashcard, StudioRequest } from './studioEngine';

// ── Text analysis ─────────────────────────────────────────────────────────────

/** Strip diacritics and case so "Décembre" and "decembre" compare equal. */
function fold(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036F]/g, '').toLowerCase();
}

/** Content words: long enough to mean something, punctuation removed. */
function contentTokens(s: string): Set<string> {
  return new Set(
    fold(s)
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3),
  );
}

/**
 * Every number in the text, normalised.
 *
 * Formatting varies wildly between a source and a generated answer — "1,914"
 * and "1914", "14 July 1789" and "July 14, 1789" — so separators are dropped
 * and each run of digits is kept on its own. What matters is whether the
 * FIGURE appears in the source at all, not how it was written.
 */
function numberTokens(s: string): Set<string> {
  return new Set(
    // Group separators vary by locale: comma, non-breaking space, narrow
    // no-break space, thin space, figure space, and the Swiss apostrophe. All
    // are stripped so "1 815", "1,815", "1'815" and "1815" are one figure.
    (s.replace(/[,\u00A0\u202F\u2009\u2007\u2019']/g, '').match(/\d+/g) ?? [])
      // Single digits are too common to carry evidence ("4 options", "1 of").
      .filter(n => n.length >= 2)
      .map(n => String(Number(n))),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const v of a) if (b.has(v)) shared++;
  return shared / (a.size + b.size - shared);
}

// ── Grounding ─────────────────────────────────────────────────────────────────

/** The source, pre-tokenised once so each item is a cheap set lookup. */
export interface SourceIndex {
  words: Set<string>;
  numbers: Set<string>;
}

export function indexSource(sourceText: string): SourceIndex {
  return { words: contentTokens(sourceText), numbers: numberTokens(sourceText) };
}

export interface Grounding {
  /** Share of the item's content words that appear in the source (0–1). */
  wordOverlap: number;
  /** Figures in the item that appear nowhere in the source. */
  inventedNumbers: string[];
  grounded: boolean;
}

/**
 * Word overlap below this reads as "written about something else".
 *
 * Deliberately lenient. The model is asked to paraphrase, and in a language
 * other than the source's, so a demand for high overlap would reject good
 * paraphrase and reward copying. It only has to catch text with almost nothing
 * to do with the source.
 */
const MIN_WORD_OVERLAP = 0.12;

export function checkGrounding(text: string, source: SourceIndex): Grounding {
  const words = contentTokens(text);
  let hits = 0;
  for (const w of words) if (source.words.has(w)) hits++;
  const wordOverlap = words.size === 0 ? 1 : hits / words.size;

  const inventedNumbers = [...numberTokens(text)].filter(n => !source.numbers.has(n));

  return {
    wordOverlap,
    inventedNumbers,
    // An invented figure is decisive on its own: a date or a count that is not
    // in the source cannot have been derived from it, however well the prose
    // overlaps. Thin overlap alone is only a signal when the item also has no
    // supporting figures.
    grounded: inventedNumbers.length === 0 && wordOverlap >= MIN_WORD_OVERLAP,
  };
}

// ── Question-level measurements ───────────────────────────────────────────────

/** True when the correct option is the longest, or far longer than the rest. */
export function hasLengthBias(q: StudioQuestion): boolean {
  const lengths = q.options.map(o => o.length);
  const correct = lengths[q.correctIndex];
  const others = lengths.filter((_, i) => i !== q.correctIndex);
  if (others.length === 0) return false;
  const longest = Math.max(...others);
  const mean = others.reduce((s, n) => s + n, 0) / others.length;
  // Longest-by-a-clear-margin, or half again the average distractor. A correct
  // option that happens to be one character longer is not a tell.
  return (correct > longest && correct - longest >= 8) || correct / Math.max(1, mean) >= 1.6;
}

const NEAR_DUPLICATE = 0.7;

/** Indices of questions that restate an earlier one. */
export function duplicateQuestionIndices(questions: StudioQuestion[]): number[] {
  const stems = questions.map(q => contentTokens(q.question));
  const dupes: number[] = [];
  for (let i = 1; i < stems.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dupes.includes(j)) continue;
      if (jaccard(stems[i], stems[j]) >= NEAR_DUPLICATE) { dupes.push(i); break; }
    }
  }
  return dupes;
}

export function duplicateCardIndices(cards: StudioFlashcard[]): number[] {
  const fronts = cards.map(c => contentTokens(c.front));
  const dupes: number[] = [];
  for (let i = 1; i < fronts.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dupes.includes(j)) continue;
      if (jaccard(fronts[i], fronts[j]) >= NEAR_DUPLICATE) { dupes.push(i); break; }
    }
  }
  return dupes;
}

// ── Language ──────────────────────────────────────────────────────────────────

/**
 * Did the model answer in the language it was asked for?
 *
 * Only the script is checked, which separates the two cases that actually go
 * wrong — Russian or Macedonian coming back in Latin script, or a Latin-script
 * language coming back in Cyrillic. Telling German from French by inspection
 * is not something a heuristic should pretend to do, so it does not try; a
 * wrong-but-Latin answer is left to the reader.
 */
export function wrongScript(text: string, language: string): boolean {
  const sample = text.slice(0, 400);
  const wantsCyrillic = language === 'ru' || language === 'mk';
  const cyrillic = (sample.match(/\p{Script=Cyrillic}/gu) ?? []).length;
  const latin = (sample.match(/\p{Script=Latin}/gu) ?? []).length;
  if (cyrillic + latin < 20) return false;   // too little text to judge
  return wantsCyrillic ? cyrillic < latin : latin < cyrillic;
}

// ── Deterministic repair ──────────────────────────────────────────────────────

/**
 * Spread the correct answers evenly across the four positions.
 *
 * A generated set is never re-served through prepareQuestion, so whatever
 * position the model picked is the position the learner sees for good. Models
 * favour the first two slots heavily, which makes a set guessable.
 *
 * Assignment is round-robin over a rotating start rather than random, so the
 * distribution is exactly even and the same kit always lands the same way —
 * a learner who regenerates does not get a different-feeling set from noise.
 */
export function balanceAnswerPositions(questions: StudioQuestion[]): StudioQuestion[] {
  return questions.map((q, i) => {
    const target = i % q.options.length;
    if (target === q.correctIndex) return q;
    const options = [...q.options];
    // Swap rather than rotate: it moves the answer to the target slot while
    // leaving every other option in place, so the distractor order the model
    // chose is preserved as far as possible.
    [options[target], options[q.correctIndex]] = [options[q.correctIndex], options[target]];
    return { ...q, options, correctIndex: target };
  });
}

// ── The report ────────────────────────────────────────────────────────────────

export type IssueKind =
  | 'ungrounded' | 'invented_number' | 'duplicate' | 'length_bias'
  | 'wrong_script' | 'short_count' | 'position_bias';

export interface KitIssue {
  kind: IssueKind;
  /** `drop` — the item was removed. `warn` — kept, but worth saying. */
  severity: 'drop' | 'warn';
  /** Short, learner-readable. Translated at the call site by kind. */
  detail: string;
}

export interface KitReport {
  issues: KitIssue[];
  dropped: { questions: number; cards: number; facts: number };
  /** How many more of each the learner asked for than survived. */
  shortfall: { questions: number; cards: number };
  /** Share of questions where the correct option is conspicuously longest. */
  lengthBiasRate: number;
  /** 0–100. Not shown as a grade — it decides whether to spend a repair call. */
  score: number;
  needsRepair: boolean;
}

/** Below this, a second targeted call is worth its cost. */
const REPAIR_THRESHOLD = 80;

/**
 * Validate, repair what can be repaired deterministically, and report the rest.
 *
 * Returns a NEW kit — the caller renders that, not the raw model output.
 */
export function assessKit(
  kit: GeneratedKit,
  req: StudioRequest,
  language: string,
): { kit: GeneratedKit; report: KitReport } {
  const source = indexSource(req.sourceText);
  const issues: KitIssue[] = [];

  // ── Facts ──
  const factsBefore = kit.facts.length;
  const facts = kit.facts.filter(f => {
    const g = checkGrounding(f, source);
    if (!g.grounded) {
      issues.push({
        kind: g.inventedNumbers.length ? 'invented_number' : 'ungrounded',
        severity: 'drop',
        detail: g.inventedNumbers.length
          ? `Fact cites ${g.inventedNumbers.slice(0, 3).join(', ')}, which is not in your source.`
          : 'A fact was not supported by your source.',
      });
      return false;
    }
    return true;
  });

  // ── Flashcards ──
  const cardDupes = new Set(duplicateCardIndices(kit.cards));
  const cardsBefore = kit.cards.length;
  const cards = kit.cards.filter((c, i) => {
    if (cardDupes.has(i)) {
      issues.push({ kind: 'duplicate', severity: 'drop', detail: 'A flashcard repeated an earlier one.' });
      return false;
    }
    const g = checkGrounding(`${c.front} ${c.back}`, source);
    if (!g.grounded) {
      issues.push({
        kind: g.inventedNumbers.length ? 'invented_number' : 'ungrounded',
        severity: 'drop',
        detail: g.inventedNumbers.length
          ? `A flashcard cites ${g.inventedNumbers.slice(0, 3).join(', ')}, which is not in your source.`
          : 'A flashcard was not supported by your source.',
      });
      return false;
    }
    return true;
  });

  // ── Questions ──
  const qDupes = new Set(duplicateQuestionIndices(kit.questions));
  const questionsBefore = kit.questions.length;
  const surviving = kit.questions.filter((q, i) => {
    if (qDupes.has(i)) {
      issues.push({ kind: 'duplicate', severity: 'drop', detail: 'A question repeated an earlier one.' });
      return false;
    }
    const g = checkGrounding(`${q.question} ${q.options[q.correctIndex]} ${q.explanation}`, source);
    if (!g.grounded) {
      issues.push({
        kind: g.inventedNumbers.length ? 'invented_number' : 'ungrounded',
        severity: 'drop',
        detail: g.inventedNumbers.length
          ? `A question turns on ${g.inventedNumbers.slice(0, 3).join(', ')}, which is not in your source.`
          : 'A question was not answerable from your source.',
      });
      return false;
    }
    return true;
  });

  // Length bias survives validation — the distractors would have to be
  // rewritten — so it is counted and reported, never silently accepted.
  const biased = surviving.filter(hasLengthBias).length;
  const lengthBiasRate = surviving.length ? biased / surviving.length : 0;
  if (biased > 0) {
    issues.push({
      kind: 'length_bias',
      severity: 'warn',
      detail: `${biased} question${biased === 1 ? '' : 's'} give the answer away by being the longest option.`,
    });
  }

  // Positions are fixed here rather than reported: nothing downstream shuffles
  // a generated question, so leaving it to the reader leaves it broken.
  const questions = balanceAnswerPositions(surviving);

  // ── Language ──
  const sample = [kit.title, kit.summary, ...facts.slice(0, 3), ...cards.slice(0, 3).map(c => c.front)].join(' ');
  if (wrongScript(sample, language)) {
    issues.push({
      kind: 'wrong_script',
      severity: 'warn',
      detail: 'Some of this was written in the wrong alphabet for your language.',
    });
  }

  // ── Shortfall ──
  const shortfall = {
    questions: Math.max(0, req.questionCount - questions.length),
    cards: Math.max(0, req.cardCount - cards.length),
  };
  if (shortfall.questions > 0 || shortfall.cards > 0) {
    issues.push({
      kind: 'short_count',
      severity: 'warn',
      detail: `Fell short by ${shortfall.questions} question${shortfall.questions === 1 ? '' : 's'} and ${shortfall.cards} card${shortfall.cards === 1 ? '' : 's'}.`,
    });
  }

  const dropped = {
    questions: questionsBefore - questions.length,
    cards: cardsBefore - cards.length,
    facts: factsBefore - facts.length,
  };

  const score = scoreKit({ req, questions, cards, facts, lengthBiasRate, shortfall });

  return {
    kit: { ...kit, facts, cards, questions },
    report: {
      issues, dropped, shortfall, lengthBiasRate, score,
      needsRepair: score < REPAIR_THRESHOLD,
    },
  };
}

function scoreKit(input: {
  req: StudioRequest;
  questions: StudioQuestion[];
  cards: StudioFlashcard[];
  facts: string[];
  lengthBiasRate: number;
  shortfall: { questions: number; cards: number };
}): number {
  const { req, questions, cards, facts, lengthBiasRate, shortfall } = input;
  // Completeness is most of it — a kit that is short is the thing a learner
  // actually notices — with quality of what survived on top.
  const qFill = req.questionCount ? questions.length / req.questionCount : 1;
  const cFill = req.cardCount ? cards.length / req.cardCount : 1;
  const factFill = Math.min(1, facts.length / 5);

  const completeness = (qFill * 0.45 + cFill * 0.35 + factFill * 0.2) * 100;
  const biasPenalty = lengthBiasRate * 25;
  const emptyPenalty = questions.length === 0 || cards.length === 0 ? 20 : 0;

  void shortfall;   // already expressed through the fill ratios
  return Math.max(0, Math.min(100, Math.round(completeness - biasPenalty - emptyPenalty)));
}

// ── Targeted repair ───────────────────────────────────────────────────────────

/**
 * Ask for exactly what is missing, and nothing else.
 *
 * Regenerating the whole kit would throw away good material and cost a full
 * call to maybe get it back. This asks only for the shortfall, tells the model
 * what was rejected and why, and lists what is already covered so the
 * replacements are not duplicates of the survivors.
 */
export function buildRepairPrompt(
  kit: GeneratedKit,
  report: KitReport,
  req: StudioRequest,
  language: string,
  langName: string,
): string {
  const covered = [
    ...kit.questions.map(q => q.question),
    ...kit.cards.map(c => c.front),
  ].slice(0, 30);

  const rejections = [...new Set(report.issues.filter(i => i.severity === 'drop').map(i => i.kind))];
  const why: Record<string, string> = {
    ungrounded: 'some items were about things the source text does not discuss',
    invented_number: 'some items cited dates or figures that do not appear in the source text',
    duplicate: 'some items restated each other',
  };

  const biasNote = report.lengthBiasRate > 0.25
    ? '\n- IMPORTANT: make all four options a SIMILAR LENGTH. In your last attempt the correct option was consistently the longest, which gives the answer away without the learner reading the question.'
    : '';

  return `OUTPUT LANGUAGE: ${langName}. Every string must be in ${langName}.

Your previous attempt at this source text was partly rejected: ${rejections.map(r => why[r]).filter(Boolean).join('; ') || 'it was incomplete'}.

Produce ONLY replacements — ${report.shortfall.questions} more multiple-choice question(s) and ${report.shortfall.cards} more flashcard(s).

SOURCE TEXT:
"""
${req.sourceText.slice(0, 12000)}
"""

ALREADY COVERED — do not repeat any of these, or anything that tests the same fact:
${covered.map(c => `- ${c}`).join('\n')}

RULES:
- Every item must be answerable from the SOURCE TEXT above. Do not introduce a date, name or figure that is not in it.
- Each question: exactly 4 options, one correct, three plausible wrong answers from the same category.${biasNote}
- The correct option must not be quotable verbatim from the question stem.
- No "all of the above" / "none of the above".

Respond ONLY with JSON, no fences:
{
  "flashcards": [{ "front": "...", "back": "..." }],
  "questions": [{ "question": "...", "options": ["...","...","...","..."], "correctIndex": 0, "explanation": "...", "difficulty": "medium" }]
}`;
}

/**
 * Fold repair output into the kit, then re-check it.
 *
 * The top-up is validated by the same rules as the first pass — a repair call
 * has no special standing — and positions are rebalanced across the merged set
 * rather than the halves separately, or the joint would show as a run.
 */
export function mergeRepair(
  kit: GeneratedKit,
  extra: Pick<GeneratedKit, 'cards' | 'questions'>,
  req: StudioRequest,
  language: string,
): { kit: GeneratedKit; report: KitReport } {
  const merged: GeneratedKit = {
    ...kit,
    cards: [...kit.cards, ...extra.cards].slice(0, Math.max(req.cardCount, kit.cards.length)),
    questions: [...kit.questions, ...extra.questions].slice(0, Math.max(req.questionCount, kit.questions.length)),
  };
  return assessKit(merged, req, language);
}
