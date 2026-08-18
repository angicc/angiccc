// ─── Clio AI proxy ───────────────────────────────────────────────────────────
// The API key lives here, never in the browser. That makes this endpoint the
// key: whatever it forwards is billed to us, so it has to be a narrow gate and
// not a pipe.
//
// Before, it read the raw body and forwarded it verbatim to Anthropic. Any
// request on the internet could therefore choose the model, set max_tokens to
// its ceiling, supply its own system prompt, and run unlimited traffic on our
// account. It was, in effect, a free public Anthropic proxy.
//
// Everything below is enforced server-side, because a limit the client can
// edit is not a limit.

const ALLOWED_MODELS = new Set([
  'claude-sonnet-5',
  'claude-opus-5',
  'claude-haiku-4-5-20251001',
]);
const DEFAULT_MODEL = 'claude-sonnet-5';

/** Hard ceilings. The client may ask for less, never more. */
const MAX_BODY_BYTES = 128 * 1024;
const MAX_OUTPUT_TOKENS = 4096;
const MAX_MESSAGES = 40;
const MAX_CHARS_PER_MESSAGE = 8000;
const MAX_SYSTEM_CHARS = 6000;

/** Per-IP token bucket. Edge instances are short-lived, so this is a cheap
 *  brake on obvious abuse rather than a billing guarantee — the hard caps on
 *  model, output tokens and body size are what bound the cost per request. */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => t > now - WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // bound memory on IP churn
  return false;
}

/**
 * Strip the instructions a user might smuggle in to hijack Clio's role.
 *
 * This is defence in depth, not a guarantee: the system prompt is server-owned
 * and the model is told to treat message content as a learner's words, which
 * is the real protection. This just removes the crude attempts.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions?/gi,
  /disregard\s+(?:all\s+)?(?:previous|prior|above)/gi,
  /you\s+are\s+now\s+(?:a|an)\s+/gi,
  /\bsystem\s*(?:prompt|message)\s*[:=]/gi,
  /<\/?(?:system|assistant)>/gi,
  /\breveal\s+(?:your\s+)?(?:system\s+)?(?:prompt|instructions)/gi,
  /\bapi[_-]?key\b/gi,
];

function sanitize(text: string): string {
  let out = text.slice(0, MAX_CHARS_PER_MESSAGE);
  for (const re of INJECTION_PATTERNS) out = out.replace(re, '[removed]');
  return out;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export default async (request: Request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) return json(500, { error: { message: 'API not configured on server.' } });

  // Same-origin only. The browser sends Origin on cross-origin POSTs, so a
  // mismatch means the request did not come from our app.
  const origin = request.headers.get('origin');
  if (origin) {
    const site = Deno.env.get('URL') ?? Deno.env.get('DEPLOY_PRIME_URL') ?? '';
    const allowed = [site, Deno.env.get('DEPLOY_URL') ?? ''].filter(Boolean);
    if (allowed.length > 0 && !allowed.some(a => origin === a)) {
      return json(403, { error: { message: 'Cross-origin requests are not accepted.' } });
    }
  }

  const ip = request.headers.get('x-nf-client-connection-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? 'anon';
  if (rateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: { message: 'Too many requests — try again in a moment.' } }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } },
    );
  }

  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return json(413, { error: { message: 'Request too large.' } });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: { message: 'Request too large.' } });

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json(400, { error: { message: 'Malformed request body.' } });
  }

  const rawMessages = Array.isArray(parsed.messages) ? parsed.messages : null;
  if (!rawMessages || rawMessages.length === 0) {
    return json(400, { error: { message: 'A messages array is required.' } });
  }

  // Rebuild the payload from scratch — never forward client-supplied fields.
  const messages = rawMessages
    .slice(-MAX_MESSAGES)
    .filter((m): m is { role: string; content: unknown } => !!m && typeof m === 'object')
    .map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: sanitize(typeof m.content === 'string' ? m.content : String(m.content ?? '')),
    }))
    .filter(m => m.content.length > 0);

  if (messages.length === 0) return json(400, { error: { message: 'No usable message content.' } });

  const requestedModel = typeof parsed.model === 'string' ? parsed.model : '';
  const model = ALLOWED_MODELS.has(requestedModel) ? requestedModel : DEFAULT_MODEL;

  const requestedTokens = Number(parsed.max_tokens);
  const maxTokens = Number.isFinite(requestedTokens) && requestedTokens > 0
    ? Math.min(Math.floor(requestedTokens), MAX_OUTPUT_TOKENS)
    : 1024;

  const payload: Record<string, unknown> = { model, max_tokens: maxTokens, messages };

  if (typeof parsed.system === 'string' && parsed.system.trim()) {
    // The system prompt is app-authored, but it arrives over the wire, so it
    // is length-capped like everything else.
    payload.system = parsed.system.slice(0, MAX_SYSTEM_CHARS);
  }
  if (parsed.stream === true) payload.stream = true;

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(payload),
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};

export const config = { path: '/api/chat' };
