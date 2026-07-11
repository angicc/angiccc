// ─── Billing client ───────────────────────────────────────────────────────────
// Bridges the pricing UI to the backend's Stripe integration. When
// VITE_API_URL points at a deployed Historify server, plan purchases go
// through real Stripe Checkout (subscription + free trial, card up front).
// Without it — local dev, preview builds — callers fall back to the demo
// payment modal so the flow stays testable end-to-end.

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '');

/** True when a real backend (and therefore real Stripe checkout) is wired up. */
export function billingConfigured(): boolean {
  return API_BASE.length > 0;
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    credentials: 'include', // session cookie auth
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`);
  return json;
}

/**
 * Start a Stripe Checkout session for a paid plan and return the URL to
 * redirect the browser to. Returns null when no backend is configured.
 */
export async function startCheckout(plan: 'beginner' | 'pro' | 'master'): Promise<string | null> {
  if (!billingConfigured()) return null;
  const { url } = await post<{ url: string | null }>('/api/billing/checkout', { plan });
  return url;
}

/** Open the Stripe customer portal (cancel / change plan / update card). */
export async function openBillingPortal(): Promise<string | null> {
  if (!billingConfigured()) return null;
  const { url } = await post<{ url: string }>('/api/billing/portal');
  return url;
}

export interface BillingStatus {
  configured: boolean;
  tier: 'FREE' | 'PRO' | 'MASTER';
  subscriptionStatus: string | null;
  trialEndsAt: string | null;
  renewsAt: string | null;
  hasBillingAccount: boolean;
  trialDays: number;
}

/** Fresh tier + trial state from the server (null without a backend). */
export async function fetchBillingStatus(): Promise<BillingStatus | null> {
  if (!billingConfigured()) return null;
  const res = await fetch(`${API_BASE}/api/billing/status`, { credentials: 'include' });
  if (!res.ok) return null;
  return (await res.json()) as BillingStatus;
}
