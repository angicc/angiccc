import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  personalKeys, wipeLocalData, deleteAccount, PERSONAL_KEY_PREFIXES,
} from '@/features/auth/deleteAccount';

/** Minimal Storage stand-in: the real one is not present under vitest's node env. */
function makeStorage(seed: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(seed));
  return {
    get length() { return map.size; },
    key: (i: number) => [...map.keys()][i] ?? null,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => { map.set(k, v); },
    removeItem: (k: string) => { map.delete(k); },
    clear: () => map.clear(),
  } as Storage;
}

const SEEDED = {
  'historify:progress:u1': '{}',
  'historify:subscription:u1': '{}',
  'historify:chat:thread:1': '[]',
  'historify:crisis:run:abc': '{}',
  'historify:friendChat:u1:u2': '[]',
  'historify:currentUserId': 'u1',
  'historify:imperium:ledger:u1': '[]',
  'historify:language': 'fr',
  'unrelated-app:token': 'keep-me',
  'theme': 'dark',
};

describe('what counts as personal data', () => {
  it('finds every store that holds something about a person', () => {
    const found = personalKeys(makeStorage(SEEDED));
    expect(found).toContain('historify:progress:u1');
    expect(found).toContain('historify:crisis:run:abc');
    expect(found).toContain('historify:friendChat:u1:u2');
    expect(found).toContain('historify:currentUserId');
  });

  it('leaves the interface language alone', () => {
    // Resetting it mid-deletion would flip the confirmation screen into a
    // language the person may not read.
    expect(personalKeys(makeStorage(SEEDED))).not.toContain('historify:language');
  });

  it('never touches storage belonging to anything else', () => {
    const found = personalKeys(makeStorage(SEEDED));
    expect(found).not.toContain('unrelated-app:token');
    expect(found).not.toContain('theme');
  });

  it('lists prefixes rather than matching all of historify:', () => {
    // A blanket 'historify:' sweep would take device preferences with it, and
    // would grow silently as unrelated keys are added.
    expect(PERSONAL_KEY_PREFIXES).not.toContain('historify:');
  });
});

describe('wiping this browser', () => {
  it('removes every personal key and nothing else', () => {
    const storage = makeStorage(SEEDED);
    const removed = wipeLocalData(storage);
    expect(removed).toBeGreaterThan(5);
    expect(personalKeys(storage)).toEqual([]);
    expect(storage.getItem('unrelated-app:token')).toBe('keep-me');
    expect(storage.getItem('historify:language')).toBe('fr');
  });

  it('removes all of them, not every other one', () => {
    // Deleting while iterating by index shifts the entries that follow, which
    // silently skips half the keys. Collect first, delete second.
    const many: Record<string, string> = {};
    for (let i = 0; i < 40; i++) many[`historify:progress:u${i}`] = '{}';
    const storage = makeStorage(many);
    expect(wipeLocalData(storage)).toBe(40);
    expect(storage.length).toBe(0);
  });

  it('keeps going when one key refuses to be removed', () => {
    const storage = makeStorage(SEEDED);
    const real = storage.removeItem.bind(storage);
    let first = true;
    storage.removeItem = (k: string) => {
      if (first) { first = false; throw new Error('blocked'); }
      real(k);
    };
    expect(() => wipeLocalData(storage)).not.toThrow();
  });
});

describe('deleting the account', () => {
  const originalLocal = globalThis.localStorage;
  beforeEach(() => { vi.stubGlobal('localStorage', makeStorage({ ...SEEDED })); });
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); globalThis.localStorage = originalLocal; });

  it('clears the browser when no server is configured', async () => {
    // With no backend the account only ever existed here, so this is the
    // whole deletion.
    const out = await deleteAccount('pw', 'name');
    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.serverDeleted).toBe(false);
      expect(out.localKeysRemoved).toBeGreaterThan(0);
    }
  });

  it('leaves local data untouched when the server refuses', async () => {
    // The important one. If the server says no - wrong password, or a
    // subscription it could not cancel - the person must be left exactly where
    // they were, not signed out of an account that still exists and still bills.
    const api = await import('@/services/apiClient');
    vi.spyOn(api, 'apiConfigured').mockReturnValue(true);
    vi.spyOn(api, 'apiFetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'Password is incorrect.' }), { status: 401 }),
    );

    const out = await deleteAccount('wrong', 'name');
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.errorKey).toBe('delete_wrong_password');
    expect(personalKeys(localStorage).length).toBeGreaterThan(0);
  });

  it('reports a name mismatch separately from a wrong password', async () => {
    const api = await import('@/services/apiClient');
    vi.spyOn(api, 'apiConfigured').mockReturnValue(true);
    vi.spyOn(api, 'apiFetch').mockResolvedValue(new Response('{}', { status: 400 }));
    const out = await deleteAccount('pw', 'typo');
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.errorKey).toBe('delete_name_mismatch');
  });

  it('surfaces the server\'s own message when it has one', async () => {
    // The subscription-cancellation failure explains itself, and that
    // explanation is more useful than a generic failure line.
    const api = await import('@/services/apiClient');
    vi.spyOn(api, 'apiConfigured').mockReturnValue(true);
    vi.spyOn(api, 'apiFetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'Could not cancel the active subscription.' }), { status: 502 }),
    );
    const out = await deleteAccount('pw', 'name');
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.message).toMatch(/subscription/i);
    expect(personalKeys(localStorage).length).toBeGreaterThan(0);
  });

  it('wipes this browser once the server confirms', async () => {
    const api = await import('@/services/apiClient');
    vi.spyOn(api, 'apiConfigured').mockReturnValue(true);
    vi.spyOn(api, 'apiFetch').mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    const out = await deleteAccount('pw', 'name');
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.serverDeleted).toBe(true);
    expect(personalKeys(localStorage)).toEqual([]);
  });

  it('does not wipe anything when the request itself throws', async () => {
    const api = await import('@/services/apiClient');
    vi.spyOn(api, 'apiConfigured').mockReturnValue(true);
    vi.spyOn(api, 'apiFetch').mockRejectedValue(new Error('offline'));
    const out = await deleteAccount('pw', 'name');
    expect(out.ok).toBe(false);
    expect(personalKeys(localStorage).length).toBeGreaterThan(0);
  });
});

describe('the local account registry', () => {
  // Found by driving the real flow: after a local-only deletion the account was
  // still in `historify:users`, so the person could sign straight back in with
  // the same credentials. That is hiding an account, not deleting one.
  it('removes the deleted account so it cannot sign back in', async () => {
    const { removeFromLocalRegistry } = await import('@/features/auth/deleteAccount');
    const storage = makeStorage({
      'historify:users': JSON.stringify([{ id: 'u1', username: 'a' }, { id: 'u2', username: 'b' }]),
    });
    expect(removeFromLocalRegistry('u1', storage)).toBe(true);
    const left = JSON.parse(storage.getItem('historify:users')!) as { id: string }[];
    expect(left.map(u => u.id)).toEqual(['u2']);
  });

  it('leaves other accounts on the same device alone', async () => {
    const { removeFromLocalRegistry } = await import('@/features/auth/deleteAccount');
    const storage = makeStorage({
      'historify:users': JSON.stringify([{ id: 'u1' }, { id: 'u2' }, { id: 'u3' }]),
    });
    removeFromLocalRegistry('u2', storage);
    expect(JSON.parse(storage.getItem('historify:users')!)).toHaveLength(2);
  });

  it('drops the registry entirely when it empties', async () => {
    const { removeFromLocalRegistry } = await import('@/features/auth/deleteAccount');
    const storage = makeStorage({ 'historify:users': JSON.stringify([{ id: 'only' }]) });
    removeFromLocalRegistry('only', storage);
    expect(storage.getItem('historify:users')).toBeNull();
  });

  it('survives a corrupt registry rather than throwing mid-deletion', async () => {
    const { removeFromLocalRegistry } = await import('@/features/auth/deleteAccount');
    const storage = makeStorage({ 'historify:users': 'not json' });
    expect(removeFromLocalRegistry('u1', storage)).toBe(false);
  });
});
