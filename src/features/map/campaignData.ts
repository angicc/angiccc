// ─── Campaign Mode data layer (typed CampaignData per timeline) ───────────────
// A formal, per-timeline description of a Territory Map battle, matching the
// requested schema: a named opponent, explicit player/opponent unit rosters
// (type + count + sprite), rock-paper-scissors tactics, and the rounds that
// drive the War Council. It is built from a topic's own data + its quiz set, so
// EVERY timeline (all 39 topics across the 6 eras) gets a complete, localized
// CampaignData with no hand-authoring per topic. The animated battle renderer
// (BattleArena) consumes the opponent name + rosters; the rounds mirror the
// quiz questions the arena already fights through.

import type { TerritoryTopic } from '@/features/content/timelineTerritoryData';
import type { TerritoryQuizQuestion } from '@/i18n/territoryMapQuizData';
import { getTranslatedTerritoryQuestion } from '@/i18n/territoryMapQuizData';
import type { Language, TranslationKeys } from '@/i18n/translations';

export interface CampaignUnit { type: string; count: number; sprite: string }
/** Rock-paper-scissors: each tactic `beats` exactly one other tactic's id. */
export interface CampaignTactic { id: string; name: string; beats: string }
export interface CampaignRound {
  roundNumber: number;
  prompt: string;
  question: string;
  options: { text: string; tacticId: string; isCorrect: boolean; explanation: string }[];
}
export interface CampaignData {
  title: string;
  opponentName: string;
  maxRounds: number;
  playerUnits: CampaignUnit[];
  opponentUnits: CampaignUnit[];
  tactics: CampaignTactic[];
  rounds: CampaignRound[];
}

type EraId = TerritoryTopic['era'];

// Era-flavoured sprite glyphs for the three archetypes (infantry / archers /
// cavalry). Emoji are used as sprites so they render everywhere with no assets.
const ERA_SPRITES: Record<EraId, { infantry: string; archers: string; cavalry: string }> = {
  prehistoric:   { infantry: '🪓', archers: '🥌', cavalry: '🦣' },
  ancient:       { infantry: '🗡️', archers: '🏹', cavalry: '🐎' },
  byzantine:     { infantry: '🛡️', archers: '🏹', cavalry: '🐎' },
  medieval:      { infantry: '⚔️', archers: '🏹', cavalry: '🐎' },
  'early-modern':{ infantry: '🔫', archers: '🎯', cavalry: '🐎' },
  modern:        { infantry: '🪖', archers: '🎯', cavalry: '🚙' },
};

function topicTitle(topic: TerritoryTopic, language: Language): string {
  if (language === 'en') return topic.title;
  return topic.titleI18n[language as Exclude<Language, 'en'>] ?? topic.title;
}

function interp(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

// A small deterministic wobble on unit counts so armies differ topic-to-topic
// without any per-topic authoring.
function seeded(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) % 12;
}

/** The three canonical tactics (charge ▷ volley ▷ hold ▷ charge), localized. */
export function campaignTactics(t: TranslationKeys): CampaignTactic[] {
  return [
    { id: 'charge', name: t.tmap_tactic_charge ?? 'Charge', beats: 'volley' },
    { id: 'volley', name: t.tmap_tactic_volley ?? 'Volley', beats: 'hold' },
    { id: 'hold',   name: t.tmap_tactic_hold ?? 'Shield wall', beats: 'charge' },
  ];
}

function roster(topic: TerritoryTopic, t: TranslationKeys, side: 'player' | 'opponent'): CampaignUnit[] {
  const s = ERA_SPRITES[topic.era];
  const w = seeded(topic.id + side);
  const base = side === 'player' ? 0 : 2; // opponents field a touch more infantry
  return [
    { type: t.tmap_unit_infantry ?? 'Infantry', count: 30 + base + w, sprite: s.infantry },
    { type: t.tmap_unit_archers ?? 'Archers',   count: 16 + (w % 6),   sprite: s.archers },
    { type: t.tmap_unit_cavalry ?? 'Cavalry',   count: 10 + (w % 5),   sprite: s.cavalry },
  ];
}

/**
 * Build the full CampaignData for a topic from its localized title, its era
 * roster, the canonical tactics, and its quiz questions (each becomes a round
 * whose options carry a tacticId + correctness + explanation).
 */
export function buildCampaignData(
  topic: TerritoryTopic,
  questions: TerritoryQuizQuestion[],
  language: Language,
  t: TranslationKeys,
): CampaignData {
  const title = topicTitle(topic, language);
  const tactics = campaignTactics(t);
  const rounds: CampaignRound[] = questions.map((q, i) => {
    const tq = getTranslatedTerritoryQuestion(q, language);
    return {
      roundNumber: i + 1,
      prompt: interp(t.tmap_genq_belong ?? '{name}', { name: title }),
      question: tq.question,
      options: tq.options.map((text, oi) => ({
        text,
        tacticId: tactics[oi % tactics.length].id,
        isCorrect: oi === q.correctIndex,
        explanation: tq.explanation,
      })),
    };
  });
  return {
    title,
    opponentName: interp(t.tmap_camp_foe ?? '{name}', { name: title }),
    maxRounds: questions.length,
    playerUnits: roster(topic, t, 'player'),
    opponentUnits: roster(topic, t, 'opponent'),
    tactics,
    rounds,
  };
}
