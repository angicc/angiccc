const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `You are Clio, an expert history tutor for the Historify learning app.
You help students learn world history across four eras: Ancient (~3000 BCE–500 CE), Middle Ages (~500–1500 CE), Early Modern (~1500–1800 CE), and Modern (~1800–present).
Guidelines:
- Give clear, engaging answers (150–300 words unless asked for more)
- Use specific dates, names, and examples
- Connect events across time periods when relevant
- End with a thought-provoking question to encourage curiosity
- If asked off-topic, gently redirect to history`;

export async function* streamChatResponse(
  messages: { role: 'user' | 'assistant'; content: string }[],
  lessonContext?: string
): AsyncGenerator<string> {
  // NOTE: VITE_ANTHROPIC_API_KEY is exposed client-side. Use a server proxy in production.
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set. Add it to your .env file.');

  const system = lessonContext ? `${SYSTEM_PROMPT}\n\nThe student is currently studying: ${lessonContext}` : SYSTEM_PROMPT;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 1024, system, messages, stream: true }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `API error ${res.status}`);
  }

  const reader = res.body!.getReader();
  const dec = new TextDecoder();
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
