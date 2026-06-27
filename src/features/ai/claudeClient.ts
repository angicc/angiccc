// Production: calls go to /api/chat (Netlify Edge Function adds key server-side)
// Development: calls go directly to Anthropic using VITE_ANTHROPIC_API_KEY from .env.local

const MODEL       = 'claude-haiku-4-5-20251001';
const MAX_HISTORY = 10;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const PROXY_URL     = '/api/chat';

const SYSTEM_PROMPT = `You are Clio, an expert history tutor for the Historify learning app.
You help students learn world history across four eras: Ancient (~3000 BCE–500 CE), Middle Ages (~500–1500 CE), Early Modern (~1500–1800 CE), and Modern (~1800–present).
Guidelines:
- Give clear, engaging answers (150–300 words unless asked for more)
- Use specific dates, names, and examples
- Connect events across time periods when relevant
- End with a thought-provoking question to encourage curiosity
- If asked off-topic, gently redirect to history
- Write in plain prose only — no markdown, no ## headers, no ** bold, no bullet asterisks`;

export const LANDING_SYSTEM_PROMPT = `You are the Historify assistant — a friendly, knowledgeable guide for the Historify history learning app.
Answer questions about Historify's features, pricing, content, and how the app works.
You can also answer general history questions to showcase the app's focus.
Keep answers concise (2–4 sentences) and always be encouraging about learning history.
If asked about lessons, mention specific eras: Ancient World, Middle Ages, Early Modern, Modern Era.
Plans: Free ($0 / 4 lessons), Pro Learner ($10/mo / all lessons + AI Tutor), Master Student ($20/mo / unlimited AI + downloads).`;

export async function* streamChatResponse(
  messages: { role: 'user' | 'assistant'; content: string }[],
  lessonContext?: string,
  systemOverride?: string
): AsyncGenerator<string> {
  // A client-side key (VITE_ANTHROPIC_API_KEY) means we can talk to Anthropic
  // directly and MUST attach it as the `x-api-key` header — otherwise the API
  // rejects the call with "x-api-key header is required". When no client key is
  // present we fall through to the serverless proxy (/api/chat), which injects
  // the key server-side. This works in dev, `vite preview`, and production
  // builds alike — the previous `isDev` guard stripped the header from any
  // non-dev build that still relied on a client key.
  const clientKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  const url     = clientKey ? ANTHROPIC_URL : PROXY_URL;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (clientKey) {
    headers['x-api-key']    = clientKey;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }

  const baseSystem     = systemOverride ?? SYSTEM_PROMPT;
  const system         = lessonContext ? `${baseSystem}\n\nThe student is currently studying: ${lessonContext}` : baseSystem;
  const trimmedMessages = messages.slice(-MAX_HISTORY);

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model: MODEL, max_tokens: 1024, system, messages: trimmedMessages, stream: true }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `API error ${res.status}`);
  }

  const reader = res.body!.getReader();
  const dec    = new TextDecoder();
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
      } catch { /* skip malformed */ }
    }
  }
}
