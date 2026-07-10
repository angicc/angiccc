// Billing: Stripe subscription checkout with a free trial on every paid plan,
// customer portal for self-serve cancel/upgrade, and the webhook that is the
// single source of truth for flipping `User.tier` in Postgres. The client
// never sets its own tier — money state only ever flows Stripe → webhook → DB.
import { Router, type Request, type Response } from 'express';
import { PrismaClient, type Tier } from '@prisma/client';
import { z } from 'zod';
import {
  stripeRequest, stripeConfigured, verifyWebhook, StripeError,
  type CheckoutSession, type StripeSubscription,
} from '../services/stripe';

const prisma = new PrismaClient();
export const billingRouter = Router();

const FRONTEND_URL = (process.env.FRONTEND_URL ?? 'http://localhost:5173').replace(/\/$/, '');

// 3–5 day trial per the launch plan; clamped so a typo can't grant months.
function trialDays(): number {
  const n = Number(process.env.TRIAL_DAYS ?? 5);
  return Number.isFinite(n) ? Math.min(14, Math.max(0, Math.round(n))) : 5;
}

function priceIdFor(plan: 'pro' | 'master'): string {
  const id = plan === 'pro' ? process.env.STRIPE_PRICE_PRO : process.env.STRIPE_PRICE_MASTER;
  if (!id) throw new StripeError(`Stripe price for the ${plan} plan is not configured.`, 503);
  return id;
}

function tierForPrice(priceId: string): Tier | null {
  if (priceId === process.env.STRIPE_PRICE_PRO) return 'PRO';
  if (priceId === process.env.STRIPE_PRICE_MASTER) return 'MASTER';
  return null;
}

// ── GET /api/billing/status — fresh tier + subscription state from the DB ────
billingRouter.get('/status', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.auth!.userId },
    select: { tier: true, subscriptionStatus: true, trialEndsAt: true, renewsAt: true, stripeCustomerId: true },
  });
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({
    configured: stripeConfigured(),
    tier: user.tier,
    subscriptionStatus: user.subscriptionStatus,
    trialEndsAt: user.trialEndsAt,
    renewsAt: user.renewsAt,
    hasBillingAccount: Boolean(user.stripeCustomerId),
    trialDays: trialDays(),
  });
});

const checkoutSchema = z.object({ plan: z.enum(['pro', 'master']) });

// ── POST /api/billing/checkout — create a Checkout Session, return its URL ───
billingRouter.post('/checkout', async (req: Request, res: Response) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "plan must be 'pro' or 'master'." });
  const { plan } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Reuse the Stripe customer across sessions so upgrades/portal all attach
    // to one billing identity per account.
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripeRequest<{ id: string }>('/v1/customers', {
        email: user.email,
        name: user.username,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const days = trialDays();
    const session = await stripeRequest<CheckoutSession>('/v1/checkout/sessions', {
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceIdFor(plan), quantity: 1 }],
      // Card collected up front; the first charge lands when the trial ends.
      ...(days > 0 ? { subscription_data: { trial_period_days: days, metadata: { userId: user.id, plan } } }
                   : { subscription_data: { metadata: { userId: user.id, plan } } }),
      metadata: { userId: user.id, plan },
      allow_promotion_codes: true,
      success_url: `${FRONTEND_URL}/dashboard?checkout=success`,
      cancel_url: `${FRONTEND_URL}/pricing?checkout=cancelled`,
    });
    res.json({ url: session.url });
  } catch (err) {
    if (err instanceof StripeError) return res.status(err.status >= 500 ? 502 : err.status).json({ error: err.message });
    throw err;
  }
});

// ── POST /api/billing/portal — customer portal (cancel / change plan / card) ─
billingRouter.post('/portal', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.auth!.userId }, select: { stripeCustomerId: true } });
    if (!user?.stripeCustomerId) return res.status(400).json({ error: 'No billing account yet — subscribe first.' });
    const portal = await stripeRequest<{ url: string }>('/v1/billing_portal/sessions', {
      customer: user.stripeCustomerId,
      return_url: `${FRONTEND_URL}/profile`,
    });
    res.json({ url: portal.url });
  } catch (err) {
    if (err instanceof StripeError) return res.status(err.status >= 500 ? 502 : err.status).json({ error: err.message });
    throw err;
  }
});

// ── Webhook: the only writer of paid tiers ────────────────────────────────────
// Mounted in index.ts with express.raw() BEFORE the JSON body parser so the
// exact bytes are available for signature verification.

async function applySubscription(sub: StripeSubscription) {
  const userId = sub.metadata?.userId
    ?? (await prisma.user.findUnique({ where: { stripeCustomerId: sub.customer }, select: { id: true } }))?.id;
  if (!userId) { console.warn('stripe webhook: no user for customer', sub.customer); return; }

  const priceId = sub.items?.data?.[0]?.price?.id ?? '';
  const paidTier = tierForPrice(priceId);
  const active = sub.status === 'trialing' || sub.status === 'active' || sub.status === 'past_due';
  // past_due keeps access while Stripe smart-retries the card; a definitive
  // cancellation (deleted/unpaid/incomplete_expired) drops the user to FREE.
  const tier: Tier = active && paidTier ? paidTier : 'FREE';

  await prisma.user.update({
    where: { id: userId },
    data: {
      tier,
      subscriptionId: sub.id,
      subscriptionStatus: sub.status,
      trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
      renewsAt: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
    },
  });
  console.log(`billing: user ${userId} → ${tier} (${sub.status})`);
}

export async function stripeWebhookHandler(req: Request, res: Response) {
  let eventType = 'unknown';
  try {
    const event = verifyWebhook(req.body as Buffer, req.headers['stripe-signature'] as string | undefined);
    eventType = event.type;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as unknown as CheckoutSession;
        // Fetch the subscription so tier, trial window, and renewal all come
        // from Stripe's canonical object rather than trusting session metadata.
        if (session.subscription) {
          const sub = await stripeRequest<StripeSubscription>(`/v1/subscriptions/${session.subscription}`);
          await applySubscription(sub);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await applySubscription(event.data.object as unknown as StripeSubscription);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as { customer?: string };
        if (invoice.customer) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: invoice.customer },
            data: { subscriptionStatus: 'past_due' },
          });
        }
        break;
      }
      default:
        break; // unhandled event types are acknowledged and ignored
    }
    res.json({ received: true });
  } catch (err) {
    if (err instanceof StripeError) {
      console.warn(`stripe webhook rejected (${eventType}):`, err.message);
      return res.status(err.status).json({ error: err.message });
    }
    console.error(`stripe webhook handler failed (${eventType}):`, err);
    // 500 → Stripe retries with backoff, so a transient DB blip self-heals.
    res.status(500).json({ error: 'Webhook processing failed.' });
  }
}
