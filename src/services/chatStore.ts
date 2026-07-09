// Per-module chat persistence. Each AI surface (tutor, debate, landing bot)
// keeps its own localStorage slice so a network timeout, token limit, or
// accidental refresh never loses the student's conversation context.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/types';

const PREFIX = 'historify:chat';
const MAX_PERSISTED = 200; // generous cap — a long tutoring session must survive intact

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
  // Messages are tagged with the key they were hydrated for. The persist
  // effect refuses to write messages tagged for key A under key B, so a
  // thread/user switch can never clobber the destination slice with the
  // previous conversation (the "history reset" bug: stale state briefly
  // persisted under the new key before re-hydration committed).
  const [state, setState] = useState<{ key: string; messages: ChatMessage[] }>(
    () => ({ key, messages: load(key) }),
  );

  // Switching thread or user (login/logout) re-hydrates for the new key.
  useEffect(() => {
    setState(prev => (prev.key === key ? prev : { key, messages: load(key) }));
  }, [key]);

  useEffect(() => {
    if (state.key !== key) return; // stale state from the previous key — never persist it
    try {
      if (state.messages.length === 0) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(state.messages.slice(-MAX_PERSISTED)));
    } catch { /* quota exceeded — persistence is best-effort */ }
  }, [state, key]);

  const keyRef = useRef(key);
  keyRef.current = key;

  const setMessages = useCallback((update: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    setState(prev => {
      const base = prev.key === keyRef.current ? prev.messages : load(keyRef.current);
      const next = typeof update === 'function' ? update(base) : update;
      return { key: keyRef.current, messages: next };
    });
  }, []);

  const clear = useCallback(() => {
    setState({ key: keyRef.current, messages: [] });
    try { localStorage.removeItem(keyRef.current); } catch { /* ignore */ }
  }, []);

  return [state.messages, setMessages, clear] as const;
}

// ─── Thread registry (multi-conversation history per AI module) ──────────────
// A module (e.g. 'tutor') can hold many named conversation threads. Each
// thread's messages live in their own persistent slice keyed
// `<module>:t:<threadId>`; the registry stores only metadata. Continuity
// pipeline: when the user reopens a thread, its full persisted slice hydrates
// into state and the trailing MAX_HISTORY turns are injected back into the
// LLM context window on the next exchange — the model resumes with the same
// working memory it ended with. (Client-only app: dynamic window re-injection
// stands in for server-side vectorization; the interface is the same.)

export interface ChatThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

function threadsKey(module: string, userId?: string) {
  return `${PREFIX}:threads:${module}${userId ? `:${userId}` : ''}`;
}

/** The persistent-chat module name for a given thread. */
export function threadModule(module: string, threadId: string): string {
  // 'main' aliases the legacy single-thread slice so existing chats survive.
  return threadId === 'main' ? module : `${module}:t:${threadId}`;
}

export function listThreads(module: string, userId?: string): ChatThread[] {
  try {
    const raw = localStorage.getItem(threadsKey(module, userId));
    const parsed = raw ? (JSON.parse(raw) as ChatThread[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function saveThreads(module: string, threads: ChatThread[], userId?: string) {
  try { localStorage.setItem(threadsKey(module, userId), JSON.stringify(threads.slice(-30))); } catch { /* best-effort */ }
}

export function createThread(module: string, userId?: string): ChatThread {
  const now = new Date().toISOString();
  const thread: ChatThread = { id: crypto.randomUUID(), title: '', createdAt: now, updatedAt: now };
  saveThreads(module, [...listThreads(module, userId), thread], userId);
  return thread;
}

/** Set the thread title from its first user message (no-op once titled). */
export function titleThread(module: string, threadId: string, firstMessage: string, userId?: string) {
  const threads = listThreads(module, userId);
  const target = threads.find(th => th.id === threadId);
  if (!target || target.title) return;
  target.title = firstMessage.slice(0, 48) + (firstMessage.length > 48 ? '…' : '');
  target.updatedAt = new Date().toISOString();
  saveThreads(module, threads, userId);
}

export function deleteThread(module: string, threadId: string, userId?: string) {
  saveThreads(module, listThreads(module, userId).filter(th => th.id !== threadId), userId);
  try { localStorage.removeItem(storageKey(threadModule(module, threadId), userId)); } catch { /* ignore */ }
}
