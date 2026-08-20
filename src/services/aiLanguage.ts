// ─── Per-language output directive for AI prompts ────────────────────────────
//
// Every AI feature — Clio, the Crisis Tribunal, essay and video grading, the
// debate room, the Studio, the study planner — tells the model which language
// to answer in. This module is the ONE place that decides how.
//
// It used to be two places. `aiGateway.ts` carried a rich LOCALE_DIRECTIVES map
// and this file carried a second, thinner `languageDirective()`, and exactly one
// feature (the Crisis Tribunal) used the thin one. So the same app asked for
// German in two different ways depending on which screen you were on, and the
// weaker ask produced visibly worse German. Both now come from here.
//
// The rules below are not decoration. A bare "write in German" produces English
// sentence structure wearing German words: verbs in the wrong position, cases
// governed by the English preposition, adjectives left undeclined. The same ask
// in French drops accents and writes Anglo-style Title Case. Spelling out the
// standard fixes it, so each language gets the specific traps it actually falls
// into rather than a generic sentence with the language name swapped in.

export type PromptLanguage = 'en' | 'es' | 'ru' | 'mk' | 'de' | 'fr';

// Declared strictly, exported loosely. The strict type is what matters: a copy
// of this map typed `Record<string, string>` sat in EssayPage.tsx listing only
// en/es/ru/mk, and nothing complained — German and French silently fell through
// to English and the grader was told to write its feedback in the wrong
// language. Typed this way, dropping a language fails the build instead.
// The loose export is only so callers can index it with a plain `string`.
const LANG_NAMES_STRICT: Record<PromptLanguage, string> = {
  en: 'English', es: 'Spanish', ru: 'Russian', mk: 'Macedonian', de: 'German', fr: 'French',
};
export const LANG_NAMES: Record<string, string> = LANG_NAMES_STRICT;

/** Never a wall of text, in any language. */
export const COMPACTION_RULE =
  'COMPACTNESS: every dynamic feedback or narrative block stays under 150–200 words, OR exactly 3 sharp, impact-driven points — never both, never more.';

/** The locale ask outranks whatever language the student happens to type in. */
const PRECEDENCE_RULE =
  'This OUTPUT LANGUAGE directive OVERRIDES any other instruction about which language to respond in, including the language the user happens to type in.';

/** The UI renders plain text; markdown control characters corrupt the display. */
export const FORMAT_RULE =
  'OUTPUT FORMAT: plain prose only. NEVER emit markdown syntax — no # headers, no ** bold, no * or - bullet markers, no backticks — unless this prompt explicitly demands raw JSON. Violating this corrupts the display.';

/** Applies to every string the model returns, not just the visible prose. */
const SCOPE = 'EVERY string you produce, including options, labels, verdicts, and JSON string values.';

// The grammar each language is actually got wrong, in the language's own terms.
// Keep these specific: a rule the model can check itself against ("is this noun
// capitalised?") changes output; an adjective ("write well") does not.
const RULES: Record<PromptLanguage, string> = {
  en: [
    `OUTPUT LANGUAGE: English — ${SCOPE}`,
    'Write clear, idiomatic English prose. Use BCE/CE for dates.',
    'In multi-word historical names follow established English usage (the French Revolution, the Second World War).',
  ].join(' '),

  de: [
    `OUTPUT LANGUAGE: German — ${SCOPE}`,
    'Schreibe natürliches, idiomatisches Deutsch — niemals eine Wort-für-Wort-Übertragung englischer Satzstruktur.',
    'Beachte streng:',
    '(1) ALLE Substantive werden großgeschrieben, auch in zusammengesetzten Begriffen;',
    '(2) Komposita werden zusammengeschrieben (Völkerwanderung, Reichstagsgebäude), nicht getrennt wie im Englischen;',
    '(3) korrekte Kasusrektion — Nominativ, Akkusativ, Dativ und Genitiv richten sich nach dem deutschen Verb oder der deutschen Präposition, nicht nach der englischen Vorlage;',
    '(4) Verbzweitstellung im Hauptsatz und Verbletztstellung im Nebensatz; trennbare Verben stehen am Satzende;',
    '(5) korrekte Adjektivdeklination (starke, schwache und gemischte Formen) nach Artikel, Genus, Numerus und Kasus;',
    '(6) ß nach langem Vokal und Diphthong (Straße, groß), ss nach kurzem Vokal (Schloss);',
    '(7) deutsche Anführungszeichen „…" statt "…";',
    '(8) v. Chr. und n. Chr. für Jahresangaben.',
    'Lies jeden Satz vor der Ausgabe noch einmal auf Kasus- und Stellungsfehler durch.',
  ].join(' '),

  fr: [
    `OUTPUT LANGUAGE: French — ${SCOPE}`,
    'Rédige un français naturel et idiomatique — jamais un calque mot à mot de l’anglais.',
    'Respecte strictement :',
    '(1) TOUS les accents et signes diacritiques (é, è, ê, à, ù, î, ô, ç) — un accent omis est une faute, pas une variante ;',
    '(2) l’élision et l’apostrophe typographique (l’Empire, d’Athènes, qu’il), avec l’apostrophe courbe ’ ;',
    '(3) l’accord en genre et en nombre des adjectifs, et l’accord du participe passé (être : avec le sujet ; avoir : avec le COD antéposé) ;',
    '(4) la majuscule à la française — les gentilés adjectivaux, les mois et les jours restent en minuscules (la Révolution française, l’Empire romain d’Orient) ;',
    '(5) les guillemets français « … » et l’espace insécable avant : ; ! ? ;',
    '(6) av. J.-C. et apr. J.-C. pour les dates ;',
    '(7) la virgule décimale et l’espace comme séparateur de milliers (1 453, 3,14).',
    'Relis chaque phrase avant de la rendre, en vérifiant les accents et les accords.',
  ].join(' '),

  es: [
    `OUTPUT LANGUAGE: Spanish — ${SCOPE}`,
    'Escribe un español natural e idiomático — nunca una traducción literal de la estructura inglesa.',
    'Sigue estrictamente la ortografía de la RAE:',
    '(1) todas las tildes y la ñ, incluidas las mayúsculas acentuadas;',
    '(2) los signos de apertura ¿ y ¡ en toda pregunta y exclamación;',
    '(3) capitalización de tipo oración — solo la primera palabra y los nombres propios; los adjetivos de los nombres históricos van en minúscula (Revolución francesa, Imperio romano);',
    '(4) concordancia de género y número entre sustantivos, adjetivos y participios;',
    '(5) uso correcto de ser y estar, y del pretérito indefinido frente al imperfecto en la narración histórica;',
    '(6) a. C. y d. C. para las fechas.',
  ].join(' '),

  ru: [
    `OUTPUT LANGUAGE: Russian — ${SCOPE}`,
    'Пиши естественным, идиоматичным русским языком — никогда не калькируй английский порядок слов.',
    'Строго соблюдай:',
    '(1) правильное падежное управление глаголов и предлогов — падеж определяется русским глаголом, а не английским оригиналом;',
    '(2) согласование прилагательных и причастий с существительным в роде, числе и падеже;',
    '(3) правильный вид глагола (совершенный/несовершенный) в историческом повествовании;',
    '(4) склонение имён собственных и числительных;',
    '(5) в многословных названиях с прописной буквы пишется только первое слово и имена собственные (Вторая мировая война, Великая французская революция);',
    '(6) кавычки-«ёлочки» и тире вместо дефиса в качестве знака препинания;',
    '(7) до н. э. и н. э. для дат.',
  ].join(' '),

  mk: [
    `OUTPUT LANGUAGE: Macedonian — ${SCOPE}`,
    'Пиши на природен, стандарден литературен македонски јазик со кирилско писмо — дословната замена на англиската структура е ЗАБРАНЕТА.',
    'Строго спроведувај:',
    '(1) точни членски наставки (-от/-ов/-он, -та/-ва/-на, -то/-во/-но, -те/-ве/-не) според род и број;',
    '(2) целосна родова и бројна согласност меѓу придавките, именките и глаголите, вклучително и кај историските поими;',
    '(3) правилни минати времиња — аорист и имперфект за раскажување, перфект со „сум" каде што е потребно — и правилен глаголски вид (свршен/несвршен);',
    '(4) правилен редослед на кратките заменски форми (ми/ти/му/ѝ, ме/те/го/ја) и нивната положба во однос на глаголот;',
    '(5) реченична голема буква — во повеќезборните имиња со голема буква се пишува само првиот збор и сопствените имиња („Втора светска војна", никогаш „Втора Светска Војна");',
    '(6) природен ред на зборовите во именските синтагми („династиите Цин и Хан", а не „Цин и Хан династии");',
    '(7) п.н.е. и н.е. за датумите.',
    'Прочитај ја секоја реченица повторно заради согласност и членување пред да ја вратиш.',
  ].join(' '),
};

function isPromptLanguage(lang: string): lang is PromptLanguage {
  return lang in RULES;
}

/**
 * The full language block for a prompt: which language, its grammar rules, the
 * compaction contract and the precedence note. Falls back to English for an
 * unknown code rather than emitting nothing, so a bad language id degrades to
 * a working prompt instead of an unconstrained one.
 */
export function languageDirective(language: string): string {
  const lang: PromptLanguage = isPromptLanguage(language) ? language : 'en';
  return `${RULES[lang]} ${COMPACTION_RULE} ${PRECEDENCE_RULE}`;
}

/** Format rule + language block, as appended to a system prompt. */
export function promptDirectives(language: string): string {
  return `\n\n${FORMAT_RULE}\n\n${languageDirective(language)}`;
}

/** The language codes that carry a directive — used by the build-time guard. */
export const DIRECTIVE_LANGUAGES = Object.keys(RULES) as PromptLanguage[];
