import { describe, it, expect } from 'vitest';
import {
  indexSource, checkGrounding, hasLengthBias, duplicateQuestionIndices,
  duplicateCardIndices, balanceAnswerPositions, wrongScript, assessKit,
  buildRepairPrompt,
} from '@/features/studio/studioQuality';
import type { GeneratedKit, StudioQuestion, StudioRequest } from '@/features/studio/studioEngine';

const SOURCE = `
The Congress of Vienna opened in September 1814 and closed in June 1815. Klemens
von Metternich, the Austrian foreign minister, chaired the negotiations.
The powers redrew the map of Europe after the defeat of Napoleon Bonaparte,
restoring the Bourbon monarchy in France under Louis XVIII. The settlement
created the German Confederation of 39 states and gave Prussia territory in the
Rhineland. Britain kept overseas possessions including Malta and the Cape Colony.
The principle of legitimacy guided the restoration of deposed rulers, and the
balance of power was intended to prevent any single state from dominating the
continent again. The Congress System of periodic conferences followed.
`;

function q(over: Partial<StudioQuestion> = {}): StudioQuestion {
  return {
    id: Math.random().toString(36).slice(2),
    question: 'Who chaired the negotiations at the Congress of Vienna?',
    options: ['Metternich', 'Napoleon', 'Louis XVIII', 'Talleyrand'],
    correctIndex: 0,
    explanation: 'Metternich, the Austrian foreign minister, chaired the Congress.',
    difficulty: 'medium',
    ...over,
  };
}

describe('grounding', () => {
  const src = indexSource(SOURCE);

  it('accepts a statement built from the source', () => {
    const g = checkGrounding('Metternich chaired the Congress of Vienna negotiations.', src);
    expect(g.grounded).toBe(true);
    expect(g.inventedNumbers).toEqual([]);
  });

  it('accepts figures that appear in the source', () => {
    expect(checkGrounding('The Congress closed in 1815.', src).inventedNumbers).toEqual([]);
    expect(checkGrounding('The German Confederation had 39 states.', src).inventedNumbers).toEqual([]);
  });

  it('catches a fabricated date', () => {
    const g = checkGrounding('The Congress of Vienna concluded its work in 1823.', src);
    expect(g.inventedNumbers).toContain('1823');
    expect(g.grounded).toBe(false);
  });

  it('catches a statement about something else entirely', () => {
    const g = checkGrounding('Photosynthesis converts sunlight into chemical energy inside chloroplasts.', src);
    expect(g.grounded).toBe(false);
  });

  it('tolerates thousands separators and leading zeros', () => {
    const src2 = indexSource('A force of 1,814 soldiers marched. Reserve unit 07 followed.');
    expect(checkGrounding('There were 1814 soldiers.', src2).inventedNumbers).toEqual([]);
    expect(checkGrounding('Unit 7 followed.', src2).inventedNumbers).toEqual([]);
  });

  it('ignores single digits, which carry no evidence', () => {
    expect(checkGrounding('There were 4 options and 1 answer, chaired by Metternich at Vienna.', src)
      .inventedNumbers).toEqual([]);
  });

  it('is not fooled by accents differing from the source', () => {
    const src2 = indexSource('The treaty was signed at Chateau de Fontainebleau in 1814.');
    expect(checkGrounding('Signed at Château de Fontainebleau.', src2).wordOverlap).toBeGreaterThan(0.4);
  });
});

describe('length bias', () => {
  it('flags a correct option that dwarfs the distractors', () => {
    expect(hasLengthBias(q({
      options: [
        'Because the powers wished to restore legitimate rulers and preserve a balance of power',
        'Trade', 'Religion', 'Famine',
      ],
      correctIndex: 0,
    }))).toBe(true);
  });

  it('does not flag options of similar length', () => {
    expect(hasLengthBias(q({
      options: ['Metternich', 'Napoleon', 'Talleyrand', 'Castlereagh'],
      correctIndex: 0,
    }))).toBe(false);
  });

  it('does not flag a correct option that is longest by a hair', () => {
    expect(hasLengthBias(q({
      options: ['Castlereagh!', 'Castlereagh', 'Talleyrand', 'Metternich'],
      correctIndex: 0,
    }))).toBe(false);
  });
});

describe('duplicate detection', () => {
  it('finds a restated question', () => {
    const dupes = duplicateQuestionIndices([
      q({ question: 'Who chaired the Congress of Vienna negotiations?' }),
      q({ question: 'Which state gained Rhineland territory?' }),
      q({ question: 'Who chaired the negotiations of the Congress of Vienna?' }),
    ]);
    expect(dupes).toEqual([2]);
  });

  it('keeps distinct questions', () => {
    expect(duplicateQuestionIndices([
      q({ question: 'When did the Congress of Vienna open?' }),
      q({ question: 'Which monarchy was restored in France?' }),
    ])).toEqual([]);
  });

  it('finds a restated flashcard front', () => {
    expect(duplicateCardIndices([
      { front: 'Who chaired the Congress of Vienna?', back: 'Metternich' },
      { front: 'Who chaired the Vienna Congress meetings?', back: 'Metternich' },
    ])).toEqual([1]);
  });
});

describe('answer positions', () => {
  it('spreads correct answers evenly instead of leaving them all at A', () => {
    const all = Array.from({ length: 8 }, () => q({ correctIndex: 0 }));
    const balanced = balanceAnswerPositions(all);
    const counts = [0, 0, 0, 0];
    for (const item of balanced) counts[item.correctIndex]++;
    expect(counts).toEqual([2, 2, 2, 2]);
  });

  it('keeps correctIndex pointing at the same text after moving it', () => {
    const original = q({ options: ['Metternich', 'Napoleon', 'Louis XVIII', 'Talleyrand'], correctIndex: 0 });
    // Second in the list, so the round-robin target is slot 1, not slot 0.
    const balanced = balanceAnswerPositions([q(), original]);
    expect(balanced[1].correctIndex).toBe(1);
    expect(balanced[1].options[balanced[1].correctIndex]).toBe('Metternich');
    expect(new Set(balanced[1].options)).toEqual(new Set(original.options));
  });

  it('is deterministic — the same kit balances the same way twice', () => {
    const all = Array.from({ length: 6 }, (_, i) => q({ id: `q${i}`, correctIndex: 1 }));
    expect(balanceAnswerPositions(all).map(x => x.correctIndex))
      .toEqual(balanceAnswerPositions(all).map(x => x.correctIndex));
  });
});

describe('script check', () => {
  it('flags Latin text where Cyrillic was asked for', () => {
    expect(wrongScript('The Congress of Vienna redrew the map of Europe entirely.', 'ru')).toBe(true);
    expect(wrongScript('Венский конгресс перекроил карту Европы полностью и надолго.', 'ru')).toBe(false);
  });

  it('flags Cyrillic text where Latin was asked for', () => {
    expect(wrongScript('Венский конгресс перекроил карту Европы полностью и надолго.', 'de')).toBe(true);
    expect(wrongScript('Der Wiener Kongress hat die Landkarte Europas neu gezeichnet.', 'de')).toBe(false);
  });

  it('does not judge a sample too short to judge', () => {
    expect(wrongScript('Wien', 'ru')).toBe(false);
  });
});

describe('assessKit', () => {
  const req: StudioRequest = { sourceText: SOURCE, questionCount: 4, cardCount: 4 };

  const kit = (over: Partial<GeneratedKit> = {}): GeneratedKit => ({
    title: 'The Congress of Vienna',
    summary: 'The powers redrew the map of Europe after Napoleon, restoring legitimate rulers.',
    facts: ['The Congress of Vienna opened in September 1814.'],
    cards: [{ front: 'Who chaired the Congress of Vienna?', back: 'Klemens von Metternich' }],
    questions: [q()],
    ...over,
  });

  it('drops a question built on a fabricated date and says so', () => {
    const { kit: out, report } = assessKit(kit({
      questions: [q(), q({
        question: 'In which year did the Congress of Vienna adjourn?',
        options: ['1823', '1824', '1825', '1826'],
        correctIndex: 0,
        explanation: 'It adjourned in 1823.',
      })],
    }), req, 'en');
    expect(out.questions).toHaveLength(1);
    expect(report.dropped.questions).toBe(1);
    expect(report.issues.some(i => i.kind === 'invented_number')).toBe(true);
  });

  it('drops an off-topic flashcard', () => {
    const { kit: out, report } = assessKit(kit({
      cards: [
        { front: 'Who chaired the Congress of Vienna?', back: 'Klemens von Metternich' },
        { front: 'What organelle performs photosynthesis?', back: 'The chloroplast' },
      ],
    }), req, 'en');
    expect(out.cards).toHaveLength(1);
    expect(report.issues.some(i => i.kind === 'ungrounded')).toBe(true);
  });

  it('reports a shortfall rather than shrinking silently', () => {
    const { report } = assessKit(kit(), req, 'en');
    expect(report.shortfall).toEqual({ questions: 3, cards: 3 });
    expect(report.issues.some(i => i.kind === 'short_count')).toBe(true);
    expect(report.needsRepair).toBe(true);
  });

  it('does not ask for repair when the kit is complete and clean', () => {
    const questions = Array.from({ length: 4 }, (_, i) => q({
      id: `q${i}`,
      question: [
        'Who chaired the Congress of Vienna negotiations?',
        'Which French monarchy was restored by the settlement?',
        'How many states formed the German Confederation?',
        'Which power gained territory in the Rhineland?',
      ][i],
      options: ['Metternich', 'Bourbon', 'Prussia', 'Britain'],
      correctIndex: 0,
      explanation: 'Stated in the Congress of Vienna settlement described in the source.',
    }));
    const cards = [
      { front: 'Who chaired the Congress?', back: 'Metternich' },
      { front: 'Which monarchy was restored in France?', back: 'The Bourbon monarchy' },
      { front: 'How many German states?', back: 'Thirty-nine, in the German Confederation' },
      { front: 'Which power gained the Rhineland?', back: 'Prussia' },
    ];
    const { report } = assessKit(kit({ questions, cards, facts: [
      'The Congress of Vienna opened in September 1814.',
      'Metternich chaired the negotiations at Vienna.',
      'The Bourbon monarchy was restored under Louis XVIII.',
      'The German Confederation comprised 39 states.',
      'Prussia gained territory in the Rhineland.',
    ] }), req, 'en');
    expect(report.needsRepair).toBe(false);
    expect(report.score).toBeGreaterThanOrEqual(80);
  });

  it('rebalances answer positions on the way through', () => {
    const questions = Array.from({ length: 4 }, (_, i) => q({
      id: `q${i}`,
      question: [
        'Who chaired the Congress of Vienna negotiations?',
        'Which French monarchy was restored by the settlement?',
        'How many states formed the German Confederation?',
        'Which power gained territory in the Rhineland?',
      ][i],
      correctIndex: 0,
    }));
    const { kit: out } = assessKit(kit({ questions }), req, 'en');
    expect(new Set(out.questions.map(x => x.correctIndex)).size).toBe(4);
  });

  it('warns about length bias but keeps the question', () => {
    const { kit: out, report } = assessKit(kit({
      questions: [q({
        options: [
          'Because the powers wished to restore legitimate rulers and preserve the balance of power in Europe',
          'Trade', 'Famine', 'Religion',
        ],
        correctIndex: 0,
      })],
    }), req, 'en');
    expect(out.questions).toHaveLength(1);
    expect(report.issues.some(i => i.kind === 'length_bias' && i.severity === 'warn')).toBe(true);
    expect(report.lengthBiasRate).toBe(1);
  });
});

describe('repair prompt', () => {
  it('asks only for the shortfall and lists what is already covered', () => {
    const req: StudioRequest = { sourceText: SOURCE, questionCount: 6, cardCount: 6 };
    const { kit: out, report } = assessKit({
      title: 'Vienna', summary: 'The Congress of Vienna redrew Europe.',
      facts: ['The Congress opened in September 1814.'],
      cards: [{ front: 'Who chaired the Congress of Vienna?', back: 'Metternich' }],
      questions: [q()],
    }, req, 'en');

    const prompt = buildRepairPrompt(out, report, req, 'en', 'English');
    expect(prompt).toContain('5 more multiple-choice question(s)');
    expect(prompt).toContain('5 more flashcard(s)');
    expect(prompt).toContain('Who chaired the Congress of Vienna?');
    expect(prompt).toContain('ALREADY COVERED');
  });
});
