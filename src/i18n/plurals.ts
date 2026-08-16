// ─── Plural forms ─────────────────────────────────────────────────────────────
// "3 day{s}" works in English and breaks in Russian and Macedonian, which have
// three and two forms respectively and pick between them by the LAST DIGIT, not
// by whether the number is 1. Appending an -s (or nothing) produces "3 день" —
// wrong in a way a reader notices immediately.
import type { Language, TranslationKeys } from './translations';

type DayKeys = Pick<TranslationKeys, 'unit_day_one' | 'unit_day_few' | 'unit_day_many'>;

/**
 * The correct noun form for a count of days.
 *
 * Russian: 1, 21, 31 … день · 2–4, 22–24 … дня · everything else дней, with
 * 11–14 forced to the "many" form (одиннадцать дней, not одиннадцать день).
 * Macedonian: numbers ending in 1 (but not 11) take ден, the rest дена.
 * The Western languages here are all one/other.
 */
export function pluralDays(n: number, lang: Language, t: DayKeys): string {
  const abs = Math.abs(Math.trunc(n));
  const last = abs % 10;
  const lastTwo = abs % 100;

  switch (lang) {
    case 'ru':
      if (lastTwo >= 11 && lastTwo <= 14) return t.unit_day_many;
      if (last === 1) return t.unit_day_one;
      if (last >= 2 && last <= 4) return t.unit_day_few;
      return t.unit_day_many;
    case 'mk':
      return last === 1 && lastTwo !== 11 ? t.unit_day_one : t.unit_day_many;
    default:
      return abs === 1 ? t.unit_day_one : t.unit_day_many;
  }
}
