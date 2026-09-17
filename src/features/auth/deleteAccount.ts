// ─── Account deletion ─────────────────────────────────────────────────────────
// The app can be signed up for, so it has to be leaveable. GDPR calls this the
// right to erasure and it applies regardless of where the owner is based; most
// of the beta testers are in the EU.
//
// Deletion has to happen in two places, because the app stores data in two:
// the server database when one is configured, and this browser. Clearing only
// the server would leave every reading record, note and chat sitting in local
// storage for the next person who opens the laptop.

import { apiConfigured, apiFetch } from '@/services/apiClient';

/**
 * Keys holding something about a person.
 *
 * Listed as prefixes rather than matched with a loose pattern, so that adding
 * a new store is a deliberate decision to include or exclude it - and so the
 * sweep cannot quietly grow to eat unrelated keys. `historify:language` is
 * absent on purpose: the interface language is a device preference, and
 * resetting it to English mid-deletion would leave the confirmation screen in
 * a language the person may not read.
 */
export const PERSONAL_KEY_PREFIXES = [
  'historify:progress:',
  'historify:subscription:',
  'historify:analysis:',
  'historify:chat',
  'historify:crisis:',
  'historify:duelRecord:',
  'historify:essayStats:',
  'historify:friendActivity:',
  'historify:friendChat:',
  'historify:friendChatRead:',
  'historify:gaps',
  'historify:gifts',
  'historify:imperium:',
  'historify:learner',
  'historify:map:annotations',
  'historify:map:campaign',
  'historify:map:explored',
  'historify:onboarded:',
  'historify:philosopher',
  'historify:reports',
  'historify:study',
  'historify:serverUser',
  'historify:currentUserId',
  'historify:videoAvailability',
  'historify:catalogbanner:',
  'historify:gifbanner:',
] as const;

/**
 * The local account registry.
 *
 * Handled separately because it is a list holding every account on this
 * browser, not a per-person key. Removing the whole thing would delete other
 * people's logins; leaving it alone lets the deleted account sign straight back
 * in, which is the difference between deleting an account and hiding it.
 */
const USERS_KEY = 'historify:users';

/** Drop one account from the registry, leaving any others on this device. */
export function removeFromLocalRegistry(userId: string, storage: Storage = localStorage): boolean {
  try {
    const raw = storage.getItem(USERS_KEY);
    if (!raw) return false;
    const users = JSON.parse(raw) as { id?: string }[];
    if (!Array.isArray(users)) return false;
    const rest = users.filter(u => u?.id !== userId);
    if (rest.length === users.length) return false;
    if (rest.length === 0) storage.removeItem(USERS_KEY);
    else storage.setItem(USERS_KEY, JSON.stringify(rest));
    return true;
  } catch {
    return false;
  }
}

/** Every stored key that belongs to a person rather than to the device. */
export function personalKeys(storage: Storage = localStorage): string[] {
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && PERSONAL_KEY_PREFIXES.some(p => key.startsWith(p))) keys.push(key);
  }
  return keys;
}

/**
 * Erase every trace of this person from this browser.
 *
 * Collects first and deletes second: removing entries while iterating by index
 * shifts the ones that follow, so a delete-as-you-go loop silently skips half
 * of them.
 */
export function wipeLocalData(storage: Storage = localStorage): number {
  const keys = personalKeys(storage);
  for (const key of keys) {
    try { storage.removeItem(key); } catch { /* keep going; one failure is not all */ }
  }
  return keys.length;
}

export type DeleteOutcome =
  | { ok: true; localKeysRemoved: number; serverDeleted: boolean }
  | { ok: false; errorKey: 'delete_wrong_password' | 'delete_name_mismatch' | 'delete_failed'; message?: string };

/**
 * Delete the account, server first.
 *
 * Order matters. If the server refuses - a wrong password, or a subscription
 * that could not be cancelled - nothing local is touched, so the person is left
 * exactly where they were rather than signed out of an account that still
 * exists and is still being billed.
 *
 * With no server configured the account only ever existed in this browser, so
 * clearing it is the whole deletion.
 */
export async function deleteAccount(
  password: string,
  confirmName: string,
  userId?: string,
): Promise<DeleteOutcome> {
  if (apiConfigured()) {
    let res: Response | null;
    try {
      res = await apiFetch('/api/auth/account', {
        method: 'DELETE',
        body: JSON.stringify({ password, confirm: confirmName }),
      });
    } catch {
      return { ok: false, errorKey: 'delete_failed' };
    }
    if (!res) return { ok: false, errorKey: 'delete_failed' };
    if (res.status === 401) return { ok: false, errorKey: 'delete_wrong_password' };
    if (res.status === 400) return { ok: false, errorKey: 'delete_name_mismatch' };
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, errorKey: 'delete_failed', message: (body as { error?: string }).error };
    }
    if (userId) removeFromLocalRegistry(userId);
    return { ok: true, localKeysRemoved: wipeLocalData(), serverDeleted: true };
  }

  if (userId) removeFromLocalRegistry(userId);
  return { ok: true, localKeysRemoved: wipeLocalData(), serverDeleted: false };
}
