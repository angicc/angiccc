// ─── Minimal Stripe client ────────────────────────────────────────────────────
// Talks to the Stripe REST API directly (form-encoded over HTTPS) and verifies
// webhook signatures with node:crypto — no SDK dependency, nothing to install,
// and the full request surface stays visible in this one file. The endpoints
// used (Checkout Sessions, Billing Portal, Subscriptions) are stable v1 APIs.
import { createHmac, timingSafeEqual } from 'node:crypto';

const STRIPE_API = 'https://api.stripe.com';

export class StripeError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'StripeError';
  }
}

function secretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY ?? '';
  if (!key) throw new StripeError('Stripe is not configured (STRIPE_SECRET_KEY missing).', 503);
  return key;
}

/** True once the operator has provided live/test Stripe credentials. */
export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// Stripe expects application/x-www-form-urlencoded with bracket notation for
// nested fields: { a: { b: 1 }, c: [{ d: 2 }] } → a[b]=1 & c[0][d]=2
function encodeForm(params: Record<string, unknown>, prefix = '', out: string[] = []): string[] {
  for (const [rawKey, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const key = prefix ? `${prefix}[${rawKey}]` : rawKey;
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === 'object' && item !== null) encodeForm(item as Record<string, unknown>, `${key}[${i}]`, out);
        else out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`);
      });
    } else if (typeof value === 'object') {
      encodeForm(value as Record<string, unknown>, key, out);
    } else {
      out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return out;
}

/** POST (or GET with empty params) a Stripe v1 endpoint, returning parsed JSON. */
export async function stripeRequest<T = Record<string, unknown>>(
  path: string,
  params?: Record<string, unknown>,
  method: 'POST' | 'GET' | 'DELETE' = params ? 'POST' : 'GET',
): Promise<T> {
  const body = params ? encodeForm(params).join('&') : undefined;
  const res = await fetch(`${STRIPE_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': '2024-06-20',
    },
    body: method === 'GET' ? undefined : body,
  });
  const json = (await res.json()) as T & { error?: { message?: string; code?: string } };
  if (!res.ok) {
    throw new StripeError(json.error?.message ?? `Stripe request failed (${res.status})`, res.status, json.error?.code);
  }
  return json;
}

/**
 * Verify a Stripe webhook signature (Stripe-Signature: t=...,v1=...).
 * signed_payload = `${t}.${rawBody}`; v1 = HMAC-SHA256(webhookSecret, signed_payload).
 * Returns the parsed event on success, throws on any mismatch or stale timestamp.
 */
export function verifyWebhook(rawBody: Buffer | string, signatureHeader: string | undefined, toleranceSec = 300): StripeEvent {
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
  if (!secret) throw new StripeError('Stripe webhook secret not configured.', 503);
  if (!signatureHeader) throw new StripeError('Missing Stripe-Signature header.', 400);

  const parts = new Map<string, string[]>();
  for (const pair of signatureHeader.split(',')) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const k = pair.slice(0, idx).trim();
    const v = pair.slice(idx + 1).trim();
    parts.set(k, [...(parts.get(k) ?? []), v]);
  }
  const timestamp = Number(parts.get('t')?.[0]);
  const candidates = parts.get('v1') ?? [];
  if (!Number.isFinite(timestamp) || candidates.length === 0) {
    throw new StripeError('Malformed Stripe-Signature header.', 400);
  }
  if (Math.abs(Date.now() / 1000 - timestamp) > toleranceSec) {
    throw new StripeError('Stripe webhook timestamp outside tolerance.', 400);
  }

  const payload = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
  const expected = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
  const expectedBuf = Buffer.from(expected, 'utf8');
  const match = candidates.some(c => {
    const buf = Buffer.from(c, 'utf8');
    return buf.length === expectedBuf.length && timingSafeEqual(buf, expectedBuf);
  });
  if (!match) throw new StripeError('Stripe webhook signature mismatch.', 400);

  return JSON.parse(payload) as StripeEvent;
}

// ── Narrow event/object typings for exactly what the billing routes read ─────
export interface StripeEvent {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
}

export interface CheckoutSession {
  id: string;
  url: string | null;
  customer: string | null;
  subscription: string | null;
  metadata?: Record<string, string>;
}

export interface StripeSubscription {
  id: string;
  status: string; // trialing | active | past_due | canceled | unpaid | incomplete...
  customer: string;
  trial_end: number | null;
  current_period_end: number;
  metadata?: Record<string, string>;
  items: { data: Array<{ price: { id: string } }> };
}
