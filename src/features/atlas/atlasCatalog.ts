// ─── The Atlas · localization catalog ─────────────────────────────────────────
// Self-contained, the same contract Chronos Imperium uses: every player-facing
// string lives here in all six languages, resolved at the render boundary.
// Keeping it out of the main `T` table means the Atlas can grow without every
// new label becoming six edits in a 968-key file.
import type { Language } from '@/i18n/translations';

type Entry = Partial<Record<Language, string>> & { en: string };

const CATALOG: Record<string, Entry> = {
  atlas_title: { en: 'The Atlas', es: 'El Atlas', ru: 'Атлас', mk: 'Атласот', de: 'Der Atlas', fr: "L'Atlas" },
  atlas_subtitle: {
    en: 'The map you uncover by reading. Every lesson you finish lights up its own year.',
    es: 'El mapa que descubres leyendo. Cada lección que terminas ilumina su propio año.',
    ru: 'Карта, которую вы открываете чтением. Каждый пройденный урок освещает свой год.',
    mk: 'Картата што ја откриваш со читање. Секоја завршена лекција го осветлува својот година.',
    de: 'Die Karte, die du dir erliest. Jede beendete Lektion erhellt ihr eigenes Jahr.',
    fr: "La carte que tu découvres en lisant. Chaque leçon terminée éclaire son année.",
  },
  atlas_gate: {
    en: 'The Atlas is part of the Master Student plan.',
    es: 'El Atlas forma parte del plan Master Student.',
    ru: 'Атлас входит в план Master Student.',
    mk: 'Атласот е дел од планот Master Student.',
    de: 'Der Atlas gehört zum Master-Student-Plan.',
    fr: "L'Atlas fait partie de l'offre Master Student.",
  },
  atlas_uncovered: { en: '{n} of {m} uncovered', es: '{n} de {m} descubiertos', ru: '{n} из {m} открыто', mk: '{n} од {m} откриени', de: '{n} von {m} aufgedeckt', fr: '{n} sur {m} découverts' },
  atlas_replay: { en: 'Replay the era', es: 'Repetir la era', ru: 'Проиграть эпоху', mk: 'Пушти ја епохата', de: 'Epoche abspielen', fr: "Rejouer l'ère" },
  atlas_stop: { en: 'Stop', es: 'Detener', ru: 'Стоп', mk: 'Запри', de: 'Stopp', fr: 'Arrêter' },
  atlas_locked_frame: {
    en: 'Not yet uncovered - read this lesson to light up this year.',
    es: 'Aún no descubierto: lee esta lección para iluminar este año.',
    ru: 'Ещё не открыто - прочитайте этот урок, чтобы осветить этот год.',
    mk: 'Сè уште не е откриено - прочитај ја лекцијата за да ја осветлиш годината.',
    de: 'Noch nicht aufgedeckt - lies diese Lektion, um dieses Jahr zu erhellen.',
    fr: "Pas encore découvert - lis cette leçon pour éclairer cette année.",
  },
  atlas_open_lesson: { en: 'Open the lesson', es: 'Abrir la lección', ru: 'Открыть урок', mk: 'Отвори ја лекцијата', de: 'Lektion öffnen', fr: 'Ouvrir la leçon' },
  atlas_follow: { en: 'Follow a territory', es: 'Seguir un territorio', ru: 'Следить за территорией', mk: 'Следи територија', de: 'Einem Gebiet folgen', fr: 'Suivre un territoire' },
  atlas_follow_hint: {
    en: 'Every lesson whose territory covers this ground, oldest first, across all six eras.',
    es: 'Todas las lecciones cuyo territorio cubre este suelo, de la más antigua en adelante, en las seis eras.',
    ru: 'Все уроки, чья территория покрывает эту землю, от самых ранних, через все шесть эпох.',
    mk: 'Сите лекции чија територија ја покрива оваа земја, од најстарата наваму, низ сите шест епохи.',
    de: 'Jede Lektion, deren Gebiet diesen Boden umfasst, von der ältesten an, durch alle sechs Epochen.',
    fr: "Chaque leçon dont le territoire couvre ce sol, de la plus ancienne, à travers les six ères.",
  },

  atlas_follow_none: { en: 'No lessons touch this ground yet.', es: 'Ninguna lección toca este terreno todavía.', ru: 'Пока ни один урок не касается этой земли.', mk: 'Сè уште ниту една лекција не ја допира оваа земја.', de: 'Noch keine Lektion berührt diesen Boden.', fr: "Aucune leçon ne touche encore ce sol." },
  atlas_all_eras: { en: 'All eras', es: 'Todas las eras', ru: 'Все эпохи', mk: 'Сите епохи', de: 'Alle Epochen', fr: 'Toutes les ères' },
  atlas_year: { en: 'Year', es: 'Año', ru: 'Год', mk: 'Година', de: 'Jahr', fr: 'Année' },
  atlas_bce: { en: 'BCE', es: 'a.C.', ru: 'до н.э.', mk: 'пр.н.е.', de: 'v. Chr.', fr: 'av. J.-C.' },
  atlas_ce: { en: 'CE', es: 'd.C.', ru: 'н.э.', mk: 'н.е.', de: 'n. Chr.', fr: 'apr. J.-C.' },
  atlas_empty: { en: 'No territory drawn for this year.', es: 'No hay territorio dibujado para este año.', ru: 'Для этого года территория не нарисована.', mk: 'Нема нацртана територија за оваа година.', de: 'Für dieses Jahr ist kein Gebiet gezeichnet.', fr: "Aucun territoire tracé pour cette année." },

  // ── Decision points ──
  atlas_decision: { en: 'A decision point', es: 'Un punto de decisión', ru: 'Точка решения', mk: 'Точка на одлука', de: 'Ein Entscheidungspunkt', fr: 'Un point de décision' },
  atlas_decision_hint: {
    en: 'History went one way. Choose before you find out which.',
    es: 'La historia fue por un camino. Elige antes de saber cuál.',
    ru: 'История пошла одним путём. Выберите, прежде чем узнать каким.',
    mk: 'Историјата тргна по еден пат. Избери пред да дознаеш по кој.',
    de: 'Die Geschichte nahm einen Weg. Entscheide dich, bevor du erfährst welchen.',
    fr: "L'histoire a pris un chemin. Choisis avant de savoir lequel.",
  },
  atlas_decision_what_happened: { en: 'What actually happened', es: 'Lo que realmente pasó', ru: 'Что произошло на самом деле', mk: 'Што всушност се случило', de: 'Was tatsächlich geschah', fr: "Ce qui s'est réellement passé" },
  atlas_decision_you_chose: { en: 'You chose', es: 'Elegiste', ru: 'Вы выбрали', mk: 'Ти избра', de: 'Du hast gewählt', fr: 'Tu as choisi' },
  atlas_decision_agree: { en: 'You chose what history chose.', es: 'Elegiste lo que eligió la historia.', ru: 'Вы выбрали то же, что и история.', mk: 'Го избра истото што го избра историјата.', de: 'Du hast gewählt, was die Geschichte wählte.', fr: "Tu as choisi ce que l'histoire a choisi." },
  atlas_decision_differ: { en: 'History went the other way.', es: 'La historia fue por otro camino.', ru: 'История пошла другим путём.', mk: 'Историјата тргна по друг пат.', de: 'Die Geschichte nahm den anderen Weg.', fr: "L'histoire a pris l'autre chemin." },
};

export function atlasText(key: string, language: Language, params?: Record<string, string | number>): string {
  const entry = CATALOG[key];
  let text = entry ? (entry[language] ?? entry.en) : key;
  if (params) for (const [k, v] of Object.entries(params)) text = text.split(`{${k}}`).join(String(v));
  return text;
}

export function hasAtlasText(key: string): boolean {
  return key in CATALOG;
}

/** Exposed for the test that keeps every entry complete in all six languages. */
export const ATLAS_CATALOG = CATALOG;

/** "1453 CE" / "3100 BCE", in the reader's language. */
export function formatYear(year: number, language: Language): string {
  const suffix = year < 0 ? atlasText('atlas_bce', language) : atlasText('atlas_ce', language);
  return `${Math.abs(year).toLocaleString()} ${suffix}`;
}
