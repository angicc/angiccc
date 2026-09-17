// ─── App status ───────────────────────────────────────────────────────────────
// One file, public/status.json, is the source of truth for what is working,
// what is broken, what changed and when maintenance is happening. The app reads
// it; the published status page mirrors it.
//
// It lives in the repo rather than in a service because it has to be editable
// in the same commit as the change it describes. A status page that is updated
// separately is a status page that is out of date.

import type { Language } from '@/i18n/translations';

export type Health = 'operational' | 'degraded' | 'maintenance' | 'outage';
export type EntryKind = 'release' | 'incident' | 'maintenance' | 'known-issue';

/** Component ids the app knows how to name. Anything else renders its raw id. */
export const COMPONENT_IDS = ['app', 'lessons', 'ai', 'maps', 'accounts', 'billing'] as const;

type Localized = Partial<Record<Language, string>> & { en: string };

export interface StatusComponent { id: string; status: Health }

export interface StatusEntry {
  id: string;
  kind: EntryKind;
  at: string;
  title: Localized;
  body: Localized;
  /** Present once an incident or maintenance window is over. */
  resolvedAt?: string;
}

export interface StatusDoc {
  schema: number;
  /** Optional override. Normally the overall state is derived, not declared. */
  status?: Health;
  updatedAt: string;
  summary: Localized;
  components: StatusComponent[];
  entries: StatusEntry[];
}

/** Worst first, so "the overall state is the worst component" is a max(). */
const SEVERITY: Record<Health, number> = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  outage: 3,
};

/**
 * The overall state, computed from the components.
 *
 * Deriving rather than reading a top-level field is the whole point: the first
 * version of status.json said "operational" while two of its own components
 * were degraded. A status page that contradicts itself is worse than none.
 *
 * A declared `status` still wins, but only when it is worse - that is what a
 * planned maintenance window is. It can never be used to claim things are fine
 * while a component says otherwise.
 */
export function overallHealth(doc: Pick<StatusDoc, 'status' | 'components'>): Health {
  const worst = doc.components.reduce<Health>(
    (acc, c) => (SEVERITY[c.status] > SEVERITY[acc] ? c.status : acc),
    'operational',
  );
  if (doc.status && SEVERITY[doc.status] > SEVERITY[worst]) return doc.status;
  return worst;
}

export function isHealthy(doc: Pick<StatusDoc, 'status' | 'components'>): boolean {
  return overallHealth(doc) === 'operational';
}

export function localized(text: Localized | undefined, language: Language): string {
  if (!text) return '';
  return text[language] ?? text.en;
}

/** An incident or maintenance window that has not been closed off. */
function isOpen(e: StatusEntry): boolean {
  return !e.resolvedAt && (e.kind === 'incident' || e.kind === 'maintenance');
}

/**
 * Newest first, with anything still open pinned to the top.
 *
 * "Open" has to mean an unresolved incident, not merely an entry without a
 * `resolvedAt` - release notes never carry one, so the simpler test floated
 * every changelog line above a live outage.
 */
export function sortedEntries(entries: StatusEntry[]): StatusEntry[] {
  return [...entries].sort((a, b) => {
    const open = Number(isOpen(b)) - Number(isOpen(a));
    if (open !== 0) return open;
    return Date.parse(b.at) - Date.parse(a.at);
  });
}

/** Incidents and maintenance that are still open. */
export function activeEntries(entries: StatusEntry[]): StatusEntry[] {
  return sortedEntries(entries).filter(isOpen);
}

let cached: StatusDoc | null = null;

/**
 * Read the status document.
 *
 * Never throws and never blocks the app: a status page that takes the app down
 * with it would be a poor status page. A failed read resolves to null and the
 * banner simply does not appear.
 */
export async function loadStatus(force = false): Promise<StatusDoc | null> {
  if (cached && !force) return cached;
  try {
    // Cache-busted: a stale status file is the one failure mode that makes this
    // feature actively misleading rather than merely absent.
    const res = await fetch(`/status.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const doc = (await res.json()) as StatusDoc;
    if (!doc || !Array.isArray(doc.components) || !Array.isArray(doc.entries)) return null;
    cached = doc;
    return doc;
  } catch {
    return null;
  }
}

/** Test seam. */
export function resetStatusCache(): void {
  cached = null;
}
