// ─── Gift subscriptions (client) ──────────────────────────────────────────────
// Gift one month of any paid plan to another user; the gifter earns 50% off
// their next renewal. With a backend configured this runs through
// POST /api/gifts (transactional, Stripe-discount aware); without one, the
// same rules apply against this device's localStorage accounts so the flow
// is fully demo-able.
import type { SubscriptionTier } from '@/types';
import { loadSubscription, saveSubscription } from './subscriptionStore';

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '');
const GIFT_LOG_KEY = 'historify:gifts';

export interface GiftRecord {
  id: string;
  gifter: string;      // username
  recipient: string;   // username
  tier: SubscriptionTier;
  createdAt: string;
  expiresAt: string;
}

export const GIFTABLE_TIERS: SubscriptionTier[] = ['beginner', 'pro', 'master'];

export function giftLog(): GiftRecord[] {
  try {
    const raw = localStorage.getItem(GIFT_LOG_KEY);
    const parsed = raw ? (JSON.parse(raw) as GiftRecord[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

const TIER_RANK: Record<SubscriptionTier, number> = { free: 0, beginner: 1, pro: 2, master: 3 };

export interface GiftResult {
  ok: boolean;
  error?: string;
}

/**
 * Send a gift. `recipient` is {id, username} of a known user (a friend).
 * Applies the recipient upgrade + the gifter's 50%-off reward.
 */
export async function sendGift(
  gifter: { id: string; username: string },
  recipient: { id: string; username: string },
  tier: SubscriptionTier,
): Promise<GiftResult> {
  if (!GIFTABLE_TIERS.includes(tier)) return { ok: false, error: 'Only paid plans can be gifted.' };
  if (recipient.id === gifter.id) return { ok: false, error: 'You cannot gift a plan to yourself.' };

  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/gifts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientUsername: recipient.username, tier }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) return { ok: false, error: json.error ?? `Gift failed (${res.status})` };
    } catch {
      return { ok: false, error: 'Could not reach the server — try again.' };
    }
  }

  // Local mirror (and the whole story in demo mode): upgrade the recipient's
  // subscription for one month if the gift outranks their tier, and book the
  // gifter's 50% renewal discount.
  const expires = new Date();
  expires.setMonth(expires.getMonth() + 1);

  const theirs = loadSubscription(recipient.id);
  if (TIER_RANK[tier] > TIER_RANK[theirs.tier]) {
    theirs.tier = tier;
    theirs.renewsAt = expires.toISOString();
    theirs.giftedBy = gifter.username;
    saveSubscription(theirs);
  }

  const mine = loadSubscription(gifter.id);
  mine.nextRenewalDiscountPct = 50;
  saveSubscription(mine);

  const entry: GiftRecord = {
    id: `gift-${Date.now().toString(36)}`,
    gifter: gifter.username,
    recipient: recipient.username,
    tier,
    createdAt: new Date().toISOString(),
    expiresAt: expires.toISOString(),
  };
  try { localStorage.setItem(GIFT_LOG_KEY, JSON.stringify([entry, ...giftLog()].slice(0, 50))); } catch { /* full */ }
  return { ok: true };
}
