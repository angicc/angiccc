// ─── CHRONOS IMPERIUM · The War Council (the intellectual spine) ─────────────
// The brief: a ruler wins two-thirds by wisdom, one-third by the sword. This
// module turns Chronos Imperium from a pure wargame into a majority-intellectual
// campaign by scoring the player's *judgment* — the crises they resolve and the
// tactical reasoning they show — and blending it 65/35 with battlefield control
// into a single Campaign Standing.
//
// It reads only signals the engine already produces (and that are already fully
// localized), so it adds no untranslated content: crisis-council decisions, the
// deterministic tactic grade, and province control. State is persisted per
// campaign so Doctrine accrues across a whole reign and survives reloads.

const KEY = (userId: string, campaignId: string) => `historify:imperium:doctrine:${userId}:${campaignId}`;

export interface DoctrineState {
  /** Cumulative wisdom points earned from resolved crises + strong tactics. */
  intellectPoints: number;
  /** The maximum wisdom that was on offer across those same decisions. */
  intellectMax: number;
  /** Count of council decisions taken — feeds the "engaged ruler" read. */
  decisions: number;
}

const GRADE_WEIGHT: Record<string, number> = { S: 1, A: 0.85, B: 0.65, C: 0.4, D: 0.15, F: 0 };

export function loadDoctrine(userId: string, campaignId: string): DoctrineState {
  try {
    const raw = localStorage.getItem(KEY(userId, campaignId));
    if (raw) {
      const p = JSON.parse(raw) as Partial<DoctrineState>;
      return { intellectPoints: p.intellectPoints ?? 0, intellectMax: p.intellectMax ?? 0, decisions: p.decisions ?? 0 };
    }
  } catch { /* fall through */ }
  return { intellectPoints: 0, intellectMax: 0, decisions: 0 };
}

function saveDoctrine(userId: string, campaignId: string, s: DoctrineState) {
  try { localStorage.setItem(KEY(userId, campaignId), JSON.stringify(s)); } catch { /* best-effort */ }
}

/** Record a resolved turn's intellectual signals: how many crises the ruler
 *  faced and answered, and how sound the chosen battlefield tactic was. */
export function recordTurnJudgment(
  userId: string,
  campaignId: string,
  input: { crisesFaced: number; crisesAnswered: number; tacticGrade: string },
): DoctrineState {
  const s = loadDoctrine(userId, campaignId);
  // Each crisis is worth up to 1 wisdom point; answering it earns the point,
  // ignoring it forfeits it. The tactic grade contributes one weighted point.
  s.intellectMax += input.crisesFaced + 1;
  s.intellectPoints += input.crisesAnswered + (GRADE_WEIGHT[input.tacticGrade] ?? 0.4);
  s.decisions += input.crisesAnswered;
  saveDoctrine(userId, campaignId, s);
  return s;
}

export function clearDoctrine(userId: string, campaignId: string) {
  try { localStorage.removeItem(KEY(userId, campaignId)); } catch { /* ignore */ }
}

/** Doctrine as a 0–100 percentage. Starts at a neutral 60 so an early campaign
 *  reads as "measured", then moves with the ruler's actual judgment. */
export function doctrinePct(s: DoctrineState): number {
  if (s.intellectMax <= 0) return 60;
  return Math.round((s.intellectPoints / s.intellectMax) * 100);
}

export interface CampaignStanding {
  intellect: number; // 0–100, the War Council's verdict on your judgment
  might: number;     // 0–100, share of the theatre you control
  standing: number;  // blended: 65% intellect + 35% might
}

/** The headline metric of a reign: wisdom weighted 65%, conquest 35%. */
export function campaignStanding(doctrine: DoctrineState, provincesHeld: number, provincesTotal: number): CampaignStanding {
  const intellect = doctrinePct(doctrine);
  const might = provincesTotal > 0 ? Math.round((provincesHeld / provincesTotal) * 100) : 0;
  return { intellect, might, standing: Math.round(intellect * 0.65 + might * 0.35) };
}
