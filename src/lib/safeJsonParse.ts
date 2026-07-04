// ─── Resilient JSON parsing for LLM output ───────────────────────────────────
// LLM-generated JSON fails JSON.parse for a handful of recurring reasons:
//   1. unescaped double quotes inside string values (the model echoes a
//      student's quoted sentence verbatim: "He said "no" to the king")
//   2. raw newlines / control characters inside string values
//   3. trailing commas before } or ]
//   4. truncated output (stream cut mid-array → "Expected ',' or ']'")
//   5. markdown fences / prose wrapped around the JSON block
// safeJsonParse() tries strict JSON.parse first, then applies a single-pass
// repair tokenizer that fixes all five classes deterministically.

/**
 * Locate the JSON object inside raw LLM output: prefers a fenced ```json
 * block, otherwise scans from the first `{` and cuts at the matching brace
 * (string-aware, so braces inside values don't fool it). If the object is
 * truncated the remainder is returned as-is for the repair pass to close.
 */
export function extractJsonBlock(raw: string): string | null {
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fence ? fence[1] : raw;
  const start = source.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inStr = false;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (inStr) {
      if (ch === '\\') i++;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1); // balanced — cut trailing prose
    }
  }
  return source.slice(start).trim(); // truncated — repair pass will close it
}

/**
 * Single-pass repair tokenizer. Walks the candidate block once, tracking
 * string state and bracket depth, and emits a corrected stream:
 *  - a `"` inside a string that is NOT followed by , : } ] or end-of-input is
 *    an unescaped inner quote → re-emitted as \"
 *  - raw newlines / tabs / control chars inside strings → escaped
 *  - trailing commas (a `,` whose next token closes a scope) → dropped
 *  - smart quotes used as string delimiters → straightened
 *  - truncation → open string closed, dangling `:`/`,` trimmed, then every
 *    open bracket closed in stack order
 */
export function repairJson(src: string): string {
  const out: string[] = [];
  const stack: ('}' | ']')[] = [];
  let inStr = false;

  const nextMeaningful = (from: number): string | undefined => {
    let j = from;
    while (j < src.length && /[ \t\r\n]/.test(src[j])) j++;
    return src[j];
  };

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];

    if (inStr) {
      if (ch === '\\') {
        out.push(ch, src[i + 1] ?? '"');
        i++;
      } else if (ch === '"') {
        const next = nextMeaningful(i + 1);
        if (next === undefined || next === ',' || next === ':' || next === '}' || next === ']') {
          inStr = false;
          out.push('"');
        } else {
          out.push('\\"'); // unescaped inner quote
        }
      } else if (ch === '”' || ch === '“') {
        // Smart quote acting as the closing delimiter of a smart-quoted string.
        const next = nextMeaningful(i + 1);
        if (next === undefined || next === ',' || next === ':' || next === '}' || next === ']') {
          inStr = false;
          out.push('"');
        } else {
          out.push(ch);
        }
      } else if (ch === '\n') out.push('\\n');
      else if (ch === '\r') out.push('\\r');
      else if (ch === '\t') out.push('\\t');
      else if (ch.charCodeAt(0) < 0x20) out.push('\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'));
      else out.push(ch);
      continue;
    }

    if (ch === '"' || ch === '“' || ch === '”') {
      inStr = true;
      out.push('"');
    } else if (ch === '{') {
      stack.push('}');
      out.push(ch);
    } else if (ch === '[') {
      stack.push(']');
      out.push(ch);
    } else if (ch === '}' || ch === ']') {
      if (stack[stack.length - 1] === ch) stack.pop();
      out.push(ch);
    } else if (ch === ',') {
      const next = nextMeaningful(i + 1);
      if (next !== '}' && next !== ']' && next !== undefined) out.push(ch); // drop trailing comma
    } else {
      out.push(ch);
    }
  }

  if (inStr) out.push('"'); // close a string the stream cut mid-value

  let repaired = out.join('').replace(/\s+$/, '');
  // A truncation can leave `"key":` or a dangling separator — trim it so the
  // bracket-closing below produces valid JSON.
  repaired = repaired.replace(/,\s*"[^"]*"?\s*:?\s*$/, '').replace(/[:,]\s*$/, '');
  while (stack.length) repaired += stack.pop();
  return repaired;
}

/**
 * Parse LLM output into a typed value. Strict parse first; on failure the
 * repaired block is parsed. Throws only when no JSON object exists at all or
 * the content is unrecoverable — callers keep their existing error fallbacks.
 */
export function safeJsonParse<T>(raw: string): T {
  const block = extractJsonBlock(raw);
  if (!block) throw new Error('No JSON object found in the AI response.');
  try {
    return JSON.parse(block) as T;
  } catch {
    return JSON.parse(repairJson(block)) as T;
  }
}
