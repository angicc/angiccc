// ─── Clio sample dialogues ────────────────────────────────────────────────────
// Scripted, pedagogically-rich exchanges between a student and Clio, used as
// loadable examples in the tutor's empty state. Each dialogue models the
// Socratic pattern Clio is prompted to follow: precise facts, cross-era
// connections, and a closing question that hands the thread back to the
// student. Content is curated seed data, not AI-generated at runtime; the
// English text lives here and its translations in ./clioSampleDialogues.i18n.

import { SAMPLE_TURNS_I18N, type SampleLang } from './clioSampleDialogues.i18n';

export interface SampleTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface SampleDialogue {
  id: string;
  /** Short label shown on the empty-state chip. */
  topic: string;
  /**
   * The chip label in every other language. Without this the AI Tutor's empty
   * state showed German copy above three English chips — the whole surface was
   * translated except the one part a learner actually clicks.
   */
  topicI18n: { es: string; ru: string; mk: string; de: string; fr: string };
  era: 'ancient' | 'middle-ages' | 'early-modern' | 'modern';
  turns: SampleTurn[];
}

/**
 * The dialogue as the learner should read it.
 *
 * `topicI18n` translated the chip but not what loading it put on screen, so
 * every language above English opened an English transcript. Falls back to the
 * English turns rather than rendering nothing if a translation is missing.
 */
export function sampleTurns(dialogue: SampleDialogue, language: string): SampleTurn[] {
  const translated = SAMPLE_TURNS_I18N[dialogue.id]?.[language as SampleLang];
  if (!translated) return dialogue.turns;
  return dialogue.turns.map((turn, i) => ({ ...turn, content: translated[i] ?? turn.content }));
}

/** The chip label, in the reader's language. */
export function sampleTopic(dialogue: SampleDialogue, language: string): string {
  return dialogue.topicI18n?.[language as SampleLang] ?? dialogue.topic;
}

export const CLIO_SAMPLE_DIALOGUES: SampleDialogue[] = [
  {
    id: 'sample-bronze-collapse',
    topic: 'The Bronze Age Collapse',
    topicI18n: { es: 'El colapso de la Edad del Bronce', ru: 'Крах бронзового века', mk: 'Колапсот на бронзеното доба', de: 'Der Zusammenbruch der Bronzezeit', fr: 'L’effondrement de l’âge du bronze' },
    era: 'ancient',
    turns: [
      {
        role: 'user',
        content: 'Why did so many civilizations collapse around 1200 BCE all at once?',
      },
      {
        role: 'assistant',
        content:
          'Around 1200 to 1150 BCE nearly every major power of the eastern Mediterranean fell within a single lifetime: the Hittite Empire vanished, Mycenaean palaces from Pylos to Mycenae burned, Ugarit was destroyed so suddenly that unsent letters were left baking in its kilns, and Egypt under Ramesses III barely repelled the Sea Peoples in 1177 BCE. What makes this collapse so fascinating is that no single cause explains it. The best current thinking treats it as a systems failure: drought (confirmed by pollen cores from the Sea of Galilee), earthquakes, migrations, and raids each stressed a network of palace economies that depended on each other for bronze itself — copper from Cyprus, tin from as far as Afghanistan. When trade snapped, every kingdom that relied on it snapped too. Here is a question worth chewing on: if these kingdoms had been less interconnected, do you think they would have survived — or was the interdependence also the source of their wealth?',
      },
      {
        role: 'user',
        content: 'Probably the interdependence made them rich AND fragile at the same time?',
      },
      {
        role: 'assistant',
        content:
          'Exactly right, and you have just articulated what historians call the paradox of complexity. Interdependence let a Mycenaean king put Baltic amber and Egyptian gold in the same tomb, but it also meant a drought in Anatolia could starve a smith in Greece of tin. Notice the pattern echoes later: the Roman grain network in the 5th century CE, or even the 2008 global financial system — efficiency and fragility grew together. One civilization, though, weathered 1177 BCE better than its neighbors: Egypt survived, diminished but intact, partly because the Nile gave it an internal food supply no sea raider could sever. So consider this: what would a civilization need to keep "in-house" to be collapse-resistant — food, energy, knowledge? And is that even possible without giving up the wealth that trade brings?',
      },
    ],
  },
  {
    id: 'sample-printing-press',
    topic: 'Printing, Luther, and Revolutions of Information',
    topicI18n: { es: 'La imprenta, Lutero y las revoluciones de la información', ru: 'Книгопечатание, Лютер и информационные революции', mk: 'Печатењето, Лутер и информациските револуции', de: 'Buchdruck, Luther und die Informationsrevolutionen', fr: 'L’imprimerie, Luther et les révolutions de l’information' },
    era: 'early-modern',
    turns: [
      {
        role: 'user',
        content: 'Was the printing press really that revolutionary, or is that exaggerated?',
      },
      {
        role: 'assistant',
        content:
          'The numbers argue it was genuinely revolutionary. Before Gutenberg printed his 42-line Bible around 1455, a single hand-copied Bible took a scribe roughly three years; by 1500 — barely two generations later — European presses had produced an estimated 8 to 10 million books, more than all the scribes of the previous millennium combined. But the deeper revolution was reliability and speed, not just volume. When Martin Luther posted his Ninety-five Theses in Wittenberg in 1517, printed copies reached most of the German lands within a month; Luther himself called printing "God\'s highest act of grace." The Church had faced heretics before — Jan Hus made similar arguments in 1415 and was burned at Constance. Luther made them WITH a press behind him and could not be contained. So here is the Socratic knife: was the difference between Hus dying and Luther succeeding the ideas themselves, or the information technology that carried them?',
      },
      {
        role: 'user',
        content: 'Sounds like the technology. Is the internet doing the same thing today?',
      },
      {
        role: 'assistant',
        content:
          'That comparison is taken seriously by historians, and the parallels are striking: both technologies collapsed the cost of copying, both broke a gatekeeper\'s monopoly (the Church\'s Latin scriptorium then, broadcast media now), and both triggered decades of upheaval before societies adapted. The printing press did not only give Europe the Reformation — it fueled a century of religious wars ending in Westphalia in 1648, but also made the Scientific Revolution possible, because Copernicus, Vesalius, and later Newton could build on exact, identical copies of each other\'s data. Print rewarded whoever mastered the new medium first: Luther wrote punchy German pamphlets while his opponents wrote Latin treatises. Who do you think is the "Luther" of the internet era — and who is writing Latin treatises without realizing it?',
      },
    ],
  },
  {
    id: 'sample-cold-war',
    topic: 'The Cuban Missile Crisis and Nuclear Brinkmanship',
    topicI18n: { es: 'La crisis de los misiles de Cuba y el riesgo nuclear calculado', ru: 'Карибский кризис и ядерная игра на грани', mk: 'Кубанската ракетна криза и нуклеарниот ризик', de: 'Die Kubakrise und die nukleare Brinkmanship', fr: 'La crise des missiles de Cuba et la stratégie du bord du gouffre' },
    era: 'modern',
    turns: [
      {
        role: 'user',
        content: 'How close did the Cuban Missile Crisis actually come to nuclear war?',
      },
      {
        role: 'assistant',
        content:
          'Closer than either government knew at the time, and closer than the public learned for decades. The thirteen days in October 1962 had at least three near-triggers. First, on October 27 a U-2 piloted by Rudolf Anderson was shot down over Cuba — the single combat death of the crisis — and standing orders implied retaliation, which Kennedy personally overrode. Second, the same day, the Soviet submarine B-59, out of radio contact and being depth-charged by US practice rounds, nearly launched a nuclear torpedo; launch required three officers, and one of them — Vasily Arkhipov — refused. Third, unknown to Washington, Soviet forces in Cuba already had about 100 tactical nuclear warheads, so the invasion the Joint Chiefs were urging would likely have gone nuclear on day one. The resolution was a public Soviet withdrawal traded for a public US no-invasion pledge and a SECRET removal of American Jupiter missiles from Turkey. Question for you: Kennedy was praised for standing firm, but the deal worked because he let Khrushchev save face in public while conceding in private. Is letting your adversary save face a weakness or a weapon?',
      },
      {
        role: 'user',
        content: 'A weapon, I guess — Khrushchev could back down without being humiliated.',
      },
      {
        role: 'assistant',
        content:
          'Precisely, and history offers a grim control group for that hypothesis. Compare Versailles in 1919: the victors maximized Germany\'s public humiliation — the "war guilt" clause, reparations set at 132 billion gold marks — and within twenty years the humiliation itself had become a weapon for Hitler. Thucydides saw the same dynamic 2,400 years earlier when Athens told the Melians that "the strong do what they can and the weak suffer what they must" — a short-term win that helped make Athens\' enemies implacable. After 1962, both superpowers quietly built face-saving machinery into the system: the Moscow–Washington hotline in 1963, then arms-control treaties that let each side call restraint "verification" rather than retreat. Now push the idea one step further: can you think of a present-day standoff where the missing ingredient is not strength but a face-saving exit? And who would have to build it?',
      },
    ],
  },
];
