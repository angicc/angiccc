// ─── CHRONOS IMPERIUM · Part D (client): persistence, sync & rollback bridge ──
// LocalStorage is the always-available cache (per user, per campaign); when a
// backend is configured (VITE_API_URL) every resolved turn block is shipped to
// the server's snapshot store and rollbacks run through the transactional
// rollback controller, so a campaign survives devices, reinstalls and tabs.
// All sync is fire-and-forget from the UI's perspective — the local copy is
// authoritative for play, the server copy for durability.
import type { CampaignState, CampaignSnapshot } from './imperiumEngine';

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '');
const serverConfigured = () => API_BASE.length > 0;

const INDEX_KEY = (userId: string) => `historify:imperium:index:${userId}`;
const CAMPAIGN_KEY = (userId: string, campaignId: string) => `historify:imperium:${userId}:${campaignId}`;

// ── Integrity signature (mirrors server/src/routes/imperium.ts) ───────────────

export function snapshotChecksum(stateJson: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < stateJson.length; i++) {
    h ^= stateJson.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

// ── Local persistence ─────────────────────────────────────────────────────────

export interface CampaignIndexEntry {
  id: string;
  era: string;
  turn: number;
  over: boolean;
  playerWon: boolean;
  updatedAt: number;
}

export function listLocalCampaigns(userId: string): CampaignIndexEntry[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CampaignIndexEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function loadCampaign(userId: string, campaignId: string): CampaignState | null {
  try {
    const raw = localStorage.getItem(CAMPAIGN_KEY(userId, campaignId));
    if (!raw) return null;
    return JSON.parse(raw) as CampaignState;
  } catch { return null; }
}

export function saveCampaign(userId: string, state: CampaignState): void {
  try {
    localStorage.setItem(CAMPAIGN_KEY(userId, state.id), JSON.stringify(state));
    const index = listLocalCampaigns(userId).filter(e => e.id !== state.id);
    index.unshift({
      id: state.id,
      era: state.era,
      turn: state.current.turn,
      over: state.current.over,
      playerWon: state.current.playerWon,
      updatedAt: Date.now(),
    });
    localStorage.setItem(INDEX_KEY(userId), JSON.stringify(index.slice(0, 8)));
  } catch { /* storage full — play continues in memory */ }
}

export function deleteCampaign(userId: string, campaignId: string): void {
  try {
    localStorage.removeItem(CAMPAIGN_KEY(userId, campaignId));
    const index = listLocalCampaigns(userId).filter(e => e.id !== campaignId);
    localStorage.setItem(INDEX_KEY(userId), JSON.stringify(index));
  } catch { /* ignore */ }
  if (serverConfigured()) {
    void fetch(`${API_BASE}/api/imperium/campaigns/${encodeURIComponent(campaignId)}`, {
      method: 'DELETE', credentials: 'include',
    }).catch(() => {});
  }
}

// ── Server sync: turn blocks ──────────────────────────────────────────────────

/**
 * Ship a resolved turn's full snapshot to the server store. Fire-and-forget:
 * failures are swallowed (the local copy is intact) but reported back so the
 * UI can show a subtle "cloud sync pending" hint if it cares.
 */
export async function pushTurnBlock(state: CampaignState): Promise<boolean> {
  if (!serverConfigured()) return false;
  const snapshot: CampaignSnapshot = state.current;
  const stateJson = JSON.stringify(snapshot);
  try {
    const res = await fetch(`${API_BASE}/api/imperium/campaigns/${encodeURIComponent(state.id)}/turn`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaign: {
          id: state.id,
          era: state.era,
          seed: state.seed,
          playerRosterId: state.playerRosterId,
          rivalRosterId: state.rivalRosterId,
          playerLeaderId: state.playerLeader.id,
          rivalLeaderId: state.rivalLeader.id,
        },
        turn: snapshot.turn,
        over: snapshot.over,
        playerWon: snapshot.playerWon,
        state: snapshot,
        checksum: snapshotChecksum(stateJson),
      }),
    });
    return res.ok;
  } catch { return false; }
}

/**
 * Run a rollback through the server's transactional controller, then mirror
 * it locally. When no backend is configured the caller falls back to the
 * engine's local `rollbackToTurn` alone.
 */
export async function pushRollback(campaignId: string, turn: number): Promise<CampaignSnapshot | null> {
  if (!serverConfigured()) return null;
  try {
    const res = await fetch(`${API_BASE}/api/imperium/campaigns/${encodeURIComponent(campaignId)}/rollback`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turn }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { state?: CampaignSnapshot };
    return json.state ?? null;
  } catch { return null; }
}

/**
 * Hydrate a campaign from the server (new device / cleared storage). Returns
 * the head snapshot plus campaign descriptor, or null when unavailable.
 */
export async function fetchServerCampaign(campaignId: string): Promise<{
  era: string; seed: number;
  playerRosterId: string; rivalRosterId: string;
  playerLeaderId: string; rivalLeaderId: string;
  head: CampaignSnapshot | null;
  turns: number[];
} | null> {
  if (!serverConfigured()) return null;
  try {
    const res = await fetch(`${API_BASE}/api/imperium/campaigns/${encodeURIComponent(campaignId)}`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      campaign: { era: string; seed: number; playerRosterId: string; rivalRosterId: string; playerLeaderId: string; rivalLeaderId: string };
      head: CampaignSnapshot | null;
      turns: { turn: number }[];
    };
    return {
      era: json.campaign.era,
      seed: json.campaign.seed,
      playerRosterId: json.campaign.playerRosterId,
      rivalRosterId: json.campaign.rivalRosterId,
      playerLeaderId: json.campaign.playerLeaderId,
      rivalLeaderId: json.campaign.rivalLeaderId,
      head: json.head,
      turns: json.turns.map(t => t.turn),
    };
  } catch { return null; }
}
