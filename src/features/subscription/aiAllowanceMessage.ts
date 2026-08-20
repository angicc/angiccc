import type { AiAllowance } from './subscriptionStore';
import type { TranslationKeys } from '@/i18n/translations';

/**
 * Turn an exhausted AI allowance into a sentence in the reader's language.
 *
 * `canUseAI` deliberately hands back a translation key and two numbers instead
 * of prose, so this is the one place that decides how it reads. Keep it here
 * rather than at each call site: there are three, and the last time this text
 * was duplicated it drifted into being English-only everywhere.
 *
 * Returns undefined when the allowance is fine, so a caller can render it
 * unconditionally and get nothing when there is nothing to say.
 */
export function aiAllowanceMessage(a: AiAllowance, t: TranslationKeys): string | undefined {
  if (a.allowed || !a.reasonKey) return undefined;
  return t[a.reasonKey]
    .replace('{n}', String(a.limit ?? ''))
    .replace('{m}', String(a.nextLimit ?? ''));
}
