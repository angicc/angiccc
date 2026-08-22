import { describe, it, expect } from 'vitest';
import { CRISIS_SCENARIOS, getCrisisBriefing, getCrisisTitle } from '@/features/content/crisisScenarios';
import { buildCrisisEnginePrompt } from '@/features/content/crisisEngine';
import { buildAssessmentPrompt } from '@/features/content/crisisAssessment';
import { languageDirective } from '@/services/aiLanguage';
import type { Language } from '@/i18n/translations';

const LANGS: Language[] = ['en', 'es', 'ru', 'mk', 'de', 'fr'];
const scenario = CRISIS_SCENARIOS[0];

const run = {
  scenarioId: scenario.id,
  step: 6,
  concluded: true,
  resources: { diplomaticCapital: 60, domesticStability: 55, militaryReadiness: 70, treasury: 45 },
  decisionHistory: [
    { step: 1, optionId: 'A', text: 'Cross the river', revealedConsequence: 'War begins' },
  ],
// The run shape is structural here; the prompt builder only reads these fields.
} as unknown as Parameters<typeof buildAssessmentPrompt>[1];

/**
 * The Crisis Room shipped its verdict and its turn-by-turn narration in English
 * to readers of every language. Not because the language directive was absent —
 * it was there — but because everything around it was English: the scenario was
 * seeded from the English fields, and in the tribunal prompt a large English
 * JSON schema came *after* the directive, so the last thing the model read was
 * a page of English. These tests pin the two fixes.
 */
describe('Chronos Crisis Room prompt language', () => {
  it('seeds the engine prompt with the scenario the player is actually reading', () => {
    for (const lang of LANGS.filter(l => l !== 'en')) {
      const prompt = buildCrisisEnginePrompt(scenario, lang);
      const localisedBriefing = getCrisisBriefing(scenario, lang);
      // Only meaningful where a translation exists for this scenario.
      if (localisedBriefing === scenario.briefing) continue;
      expect(prompt, `${lang} engine prompt should carry the localised briefing`)
        .toContain(localisedBriefing);
      expect(prompt, `${lang} engine prompt still carries the English briefing`)
        .not.toContain(scenario.briefing);
    }
  });

  it('seeds the tribunal prompt with the localised scenario too', () => {
    for (const lang of LANGS.filter(l => l !== 'en')) {
      const prompt = buildAssessmentPrompt(scenario, run, lang);
      const localisedTitle = getCrisisTitle(scenario, lang);
      if (localisedTitle === scenario.title) continue;
      expect(prompt, `${lang} tribunal prompt should name the scenario in ${lang}`)
        .toContain(localisedTitle);
    }
  });

  it('puts the language directive last in the tribunal prompt', () => {
    // Recency matters to a model reading a long prompt. The directive used to
    // sit in the middle with the whole JSON schema after it.
    for (const lang of LANGS) {
      const prompt = buildAssessmentPrompt(scenario, run, lang);
      const directive = languageDirective(lang);
      expect(prompt, `${lang} tribunal prompt lost its language directive`).toContain(directive);
      const after = prompt.slice(prompt.indexOf(directive) + directive.length);
      // Nothing of substance may follow it — a closing backtick at most.
      expect(after.trim().length, `${lang}: ${after.trim().length} chars follow the directive`)
        .toBeLessThan(8);
    }
  });

  it('tells the engine that JSON keys stay English but values do not', () => {
    const prompt = buildCrisisEnginePrompt(scenario, 'mk');
    expect(prompt).toMatch(/JSON keys stay in English/i);
    expect(prompt).toMatch(/OUTPUT LANGUAGE directive/i);
  });

  it('names every human-readable field the tribunal must translate', () => {
    const prompt = buildAssessmentPrompt(scenario, run, 'mk');
    for (const field of ['commanderTitle', 'strengths', 'improvements', 'counterfactual', 'epitaph']) {
      expect(prompt, `${field} is not named in the language instruction`)
        .toContain(field);
    }
  });
});
