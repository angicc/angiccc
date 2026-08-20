// ─── Unified AI API Gateway ──────────────────────────────────────────────────
// Single initialization point for every AI feature (Clio tutor, Debate a
// Philosopher, Essay Challenge, Video Review, landing chatbot).
//
// Resolution order:
//   1. `VITE_ANTHROPIC_API_KEY` (client env, .env.local / build-time) →
//      talk to Anthropic directly from the browser. This is the primary
//      path: no server subscription or edge-function credits required.
//   2. No client key → fall back to the `/api/chat` serverless proxy
//      (Netlify edge function injects ANTHROPIC_API_KEY server-side).
//
// Every failure is normalized into an `AiGatewayError` with a machine-readable
// `kind` and a `retryable` flag so UI layers can render themed fallback cards
// with a retry mechanic instead of dumping raw strings into the viewport.

import { promptDirectives, FORMAT_RULE } from './aiLanguage';

const MODEL         = 'claude-haiku-4-5-20251001';
const MAX_HISTORY   = 10;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const PROXY_URL     = '/api/chat';

export type AiErrorKind = 'config' | 'auth' | 'network' | 'rate_limit' | 'server' | 'unknown';

export class AiGatewayError extends Error {
  readonly kind: AiErrorKind;
  readonly retryable: boolean;

  constructor(kind: AiErrorKind, message: string, retryable: boolean) {
    super(message);
    this.name = 'AiGatewayError';
    this.kind = kind;
    this.retryable = retryable;
  }
}

export type GatewayMode = 'direct' | 'proxy';

export interface GatewayStatus {
  mode: GatewayMode;
  configured: boolean;
}

type EnvMap = Record<string, string | undefined>;

/**
 * Resolve an env var across every runtime this module can execute in:
 *   1. `import.meta.env` — Vite statically inlines `VITE_*` keys at build time.
 *   2. `globalThis.process.env` — serverless functions / SSR / test runners,
 *      where Vite's static binding does not apply. Accessed via `globalThis`
 *      so browser bundles (no `process` global) never throw a ReferenceError.
 */
function readEnv(name: string): string | undefined {
  const viaImportMeta = (import.meta.env as EnvMap)[name];
  if (viaImportMeta && viaImportMeta.trim().length > 0) return viaImportMeta.trim();
  const proc = (globalThis as { process?: { env?: EnvMap } }).process;
  const viaProcess = proc?.env?.[name];
  if (viaProcess && viaProcess.trim().length > 0) return viaProcess.trim();
  return undefined;
}

function clientKey(): string | undefined {
  return readEnv('VITE_ANTHROPIC_API_KEY') ?? readEnv('ANTHROPIC_API_KEY');
}

/** Which transport will the next request use, and is it plausibly configured? */
export function getGatewayStatus(): GatewayStatus {
  const key = clientKey();
  return { mode: key ? 'direct' : 'proxy', configured: Boolean(key) || import.meta.env.PROD };
}

function classifyHttpError(status: number, apiMsg: string, mode: GatewayMode): AiGatewayError {
  if (/x-api-key|api key|api_key/i.test(apiMsg) || status === 401 || status === 403) {
    return new AiGatewayError(
      mode === 'direct' ? 'auth' : 'config',
      mode === 'direct'
        ? 'Anthropic rejected the API key. Check VITE_ANTHROPIC_API_KEY in your .env.local.'
        : 'AI is not configured: set VITE_ANTHROPIC_API_KEY in .env.local (local dev) or ANTHROPIC_API_KEY in your hosting environment.',
      false
    );
  }
  if (status === 429)  return new AiGatewayError('rate_limit', 'Rate limit reached — wait a moment and retry.', true);
  if (status === 404 && mode === 'proxy') {
    return new AiGatewayError('config', 'The /api/chat proxy is unavailable. For a client-side setup, set VITE_ANTHROPIC_API_KEY in .env.local and rebuild.', false);
  }
  if (status >= 500)   return new AiGatewayError('server', `The AI service is temporarily unavailable (${status}).`, true);
  return new AiGatewayError('unknown', apiMsg || `API error ${status}`, true);
}

export const LANDING_SYSTEM_PROMPT = `You are the Historify assistant — a friendly, knowledgeable guide for the Historify history learning app.
Answer questions about Historify's features, pricing, content, and how the app works.
You can also answer general history questions to showcase the app's focus.
Keep answers concise (2–4 sentences) and always be encouraging about learning history.
If asked about lessons, mention specific eras: Ancient World, Middle Ages, Early Modern, Modern Era.
Plans: Free ($0 / 4 lessons), Beginner Student ($4.99/mo / full timeline + flashcards + 10 AI messages/day), Pro Student ($9.99/mo / all lessons, Smart Quiz, Study Plan, AI Studio, Territory Map), Master Student ($17.99/mo / Crisis Room, Essay & Video challenges, animated Conquest Campaign, 300 AI messages/mo + downloads).`;

const TUTOR_SYSTEM_PROMPT = `You are Clio, an expert history tutor for the Historify learning app.
You help students learn world history across four eras: Ancient (~3000 BCE–500 CE), Middle Ages (~500–1500 CE), Early Modern (~1500–1800 CE), and Modern (~1800–present).
Guidelines:
- Give clear, engaging answers (150–300 words unless asked for more)
- Use specific dates, names, and examples
- Connect events across time periods when relevant
- End with a thought-provoking question to encourage curiosity
- If asked off-topic, gently redirect to history
- Write in plain prose only — no markdown, no ## headers, no ** bold, no bullet asterisks`;

// ── Multi-language output directive ─────────────────────────────────────────
// The rules themselves live in services/aiLanguage.ts, which is the single
// source of truth for every AI feature. They used to be duplicated here, and
// the copy that lived here was the only one German and French were ever given
// in full — the other copy handed them two thin sentences while Macedonian got
// seven numbered rules, which is precisely why de/fr output read worst.

/** Format + locale sub-prompt for the user's active UI language. */
function localeDirective(): string {
  try {
    // An unset language is genuinely unknown, not English: leave the model to
    // answer in whatever the student wrote rather than forcing a language on
    // them. A *known* language always gets its full block.
    const lang = localStorage.getItem('historify:language');
    return lang ? promptDirectives(lang) : `\n\n${FORMAT_RULE}`;
  } catch {
    return `\n\n${FORMAT_RULE}`;
  }
}

/** A single content block — plain text, or an image (Anthropic vision format). */
export type AiContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } };

/** Build an Anthropic image content block from a `data:` URL (e.g. a file the
 *  user uploaded to Clio). Returns null for a non-image / malformed URL. */
export function imageBlockFromDataUrl(dataUrl: string): Extract<AiContentBlock, { type: 'image' }> | null {
  const m = /^data:(image\/(?:png|jpeg|jpg|gif|webp));base64,(.+)$/i.exec(dataUrl);
  if (!m) return null;
  const media = m[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : m[1].toLowerCase();
  return { type: 'image', source: { type: 'base64', media_type: media, data: m[2] } };
}

export async function* streamChatResponse(
  messages: { role: 'user' | 'assistant'; content: string | AiContentBlock[] }[],
  lessonContext?: string,
  systemOverride?: string,
  maxTokens = 1024
): AsyncGenerator<string> {
  const key  = clientKey();
  const mode: GatewayMode = key ? 'direct' : 'proxy';
  const url  = key ? ANTHROPIC_URL : PROXY_URL;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (key) {
    headers['x-api-key']         = key;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }

  const baseSystem      = systemOverride ?? TUTOR_SYSTEM_PROMPT;
  const withContext     = lessonContext ? `${baseSystem}\n\nThe student is currently studying: ${lessonContext}` : baseSystem;
  const system          = withContext + localeDirective();
  const trimmedMessages = messages.slice(-MAX_HISTORY);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: trimmedMessages, stream: true }),
    });
  } catch {
    // fetch itself threw → offline / DNS / CORS. Always retryable.
    throw new AiGatewayError('network', 'Could not reach the AI service. Check your connection and retry.', true);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const apiMsg = (err as { error?: { message?: string } }).error?.message ?? '';
    throw classifyHttpError(res.status, apiMsg, mode);
  }

  const reader = res.body!.getReader();
  const dec    = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const line of dec.decode(value).split('\n')) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) yield parsed.delta.text;
        } catch { /* skip malformed SSE frame */ }
      }
    }
  } catch {
    // Stream aborted mid-flight (network drop, timeout). Whatever text was
    // already yielded stays in the caller's state; the retry card handles the rest.
    throw new AiGatewayError('network', 'The connection dropped while streaming. Retry to continue.', true);
  }
}
