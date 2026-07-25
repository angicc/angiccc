// ─── Per-language output directive for AI prompts ────────────────────────────
// Every AI feature (Crisis Tribunal, Clio tutor, essay/video grading, debate…)
// tells the model which language to answer in. A bare "write in Macedonian"
// produced grammatically poor, calqued Cyrillic. This central directive spells
// out the standard-language rules so the model writes correct, natural prose —
// especially for Macedonian, whose article/tense system English speakers (and
// models trained mostly on English) routinely get wrong.

const LANG_NAMES: Record<string, string> = {
  en: 'English', es: 'Spanish', ru: 'Russian', mk: 'Macedonian', de: 'German', fr: 'French',
};

/** A strict, standards-based instruction block for the target language. */
export function languageDirective(language: string): string {
  const name = LANG_NAMES[language] ?? 'English';
  if (language === 'mk') {
    return [
      'Пиши го СИТЕ текст на стандарден литературен македонски јазик, со кирилско писмо.',
      'Строго почитувај ги правилата на официјалниот македонски правопис и граматика:',
      '• точни членски наставки според род и број и по потреба троделна определеност',
      '  (-от/-ов/-он, -та/-ва/-на, -то/-во/-но, -те/-ве/-не);',
      '• правилни глаголски времиња — аорист, имперфект и перфект со „сум“ — и правилен глаголски вид;',
      '• природен ред на зборови и правилен редослед на кратките заменски форми (ми/ти/му/ѝ, ме/те/го/ја);',
      '• родова и бројна согласност меѓу именки, придавки и глаголи.',
      'Пиши течно и идиоматски — никогаш дословен превод (калк) од англиски.',
      'Броевите, датумите и сопствените имиња остануваат непроменети.',
      'Користи само обичен текст — без markdown ознаки.',
    ].join('\n');
  }
  return `Write ALL prose in natural, idiomatic, grammatically correct ${name}. ` +
    `Follow the standard orthography and grammar of ${name}; never produce a word-for-word calque from English. ` +
    `Preserve numbers, dates and proper nouns. Use plain text only — no markdown.`;
}
