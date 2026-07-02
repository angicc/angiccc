// Per-module chat persistence. Each AI surface (tutor, debate, landing bot)
// keeps its own localStorage slice so a network timeout, token limit, or
// accidental refresh never loses the student's conversation context.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/types';

const PREFIX = 'historify:chat';
const MAX_PERSISTED = 40; // cap the slice so localStorage never balloons

function storageKey(module: string, userId?: string) {
  return userId ? `${PREFIX}:${module}:${userId}` : `${PREFIX}:${module}`;
}

function load(key: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed)) return [];
    // Never resurrect a half-streamed bubble as "still streaming".
    return parsed.map(m => ({ ...m, isStreaming: false }));
  } catch {
    return [];
  }
}

/**
 * Drop-in replacement for `useState<ChatMessage[]>([])` that transparently
 * hydrates from and persists to localStorage, keyed per AI module (and
 * optionally per user).
 */
export function usePersistentChat(module: string, userId?: string) {
  const key = storageKey(module, userId);
  const [messages, setMessages] = useState<ChatMessage[]>(() => load(key));
  const keyRef = useRef(key);

  // Switching user (login/logout) re-hydrates the slice for the new key.
  useEffect(() => {
    if (keyRef.current === key) return;
    keyRef.current = key;
    setMessages(load(key));
  }, [key]);

  useEffect(() => {
    try {
      if (messages.length === 0) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(messages.slice(-MAX_PERSISTED)));
    } catch { /* quota exceeded — persistence is best-effort */ }
  }, [messages, key]);

  const clear = useCallback(() => {
    setMessages([]);
    try { localStorage.removeItem(keyRef.current); } catch { /* ignore */ }
  }, []);

  return [messages, setMessages, clear] as const;
}
