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
// Appended to every system prompt so AI output is contextually native, not a
// literal string translation. Macedonian gets explicit morphology enforcement
// because smaller models degrade hardest there.
// Shared compaction contract for dynamic feedback blocks: never walls of text.
const COMPACTION_RULE =
  'COMPACTNESS: every dynamic feedback or narrative block stays under 150–200 words, OR exactly 3 sharp, impact-driven points — never both, never more. This OUTPUT LANGUAGE directive OVERRIDES any other instruction about which language to respond in, including the language the user happens to type in.';

const LOCALE_DIRECTIVES: Record<string, string> = {
  es: `OUTPUT LANGUAGE: Spanish — EVERY string you produce, including options, labels, verdicts, and JSON string values. Write natural, idiomatic Spanish — never word-for-word translations of English phrasing. Follow RAE orthography: sentence-style capitalization (only the first word and proper nouns), lowercase adjectives in historical event names (Revolución francesa), and correct use of a.C./d.C. for dates. ${COMPACTION_RULE}`,
  ru: `OUTPUT LANGUAGE: Russian — EVERY string you produce, including options, labels, verdicts, and JSON string values. Write natural, idiomatic Russian — never calques of English word order. Only the first word and proper nouns are capitalized in multi-word names (Вторая мировая война). Use correct case government throughout and до н.э./н.э. for dates. ${COMPACTION_RULE}`,
  mk: `OUTPUT LANGUAGE: Macedonian — EVERY string you produce, including options, labels, verdicts, and JSON string values. Write natural, native Macedonian — literal word-for-word substitution of English structure is FORBIDDEN. Enforce strictly: (1) correct postfixed definite articles (-от, -та, -то, -те) matched to gender and number; (2) full gender/number agreement between adjectives and nouns, including historical terms; (3) sentence-style capitalization — in multi-word names only the first word and proper nouns are capitalized ("Втора светска војна", never "Втора Светска Војна"); (4) native word order for noun phrases ("династиите Цин и Хан", not "Цин и Хан династии"); (5) п.н.е./н.е. for dates. ${COMPACTION_RULE}`,
};

// Universal, language-independent format rule: the UI renders plain text, so
// markdown control characters must never appear in any AI output.
const FORMAT_RULE =
  'OUTPUT FORMAT: plain prose only. NEVER emit markdown syntax — no # headers, no ** bold, no * or - bullet markers, no backticks — unless this prompt explicitly demands raw JSON. Violating this corrupts the display.';

/** Format + locale sub-prompt for the user's active UI language. */
function localeDirective(): string {
  try {
    const lang = localStorage.getItem('historify:language');
    const langBlock = lang && LOCALE_DIRECTIVES[lang] ? `\n\n${LOCALE_DIRECTIVES[lang]}` : '';
    return `\n\n${FORMAT_RULE}${langBlock}`;
  } catch {
    return `\n\n${FORMAT_RULE}`;
  }
}

export async function* streamChatResponse(
  messages: { role: 'user' | 'assistant'; content: string }[],
  lessonContext?: string,
  systemOverride?: string
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
      body: JSON.stringify({ model: MODEL, max_tokens: 1024, system, messages: trimmedMessages, stream: true }),
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
