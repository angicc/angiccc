import type { Language } from './translations';

type ContentLang = Exclude<Language, 'en'>;

const ACHIEVEMENT_TRANS: Record<string, Partial<Record<ContentLang, { title: string; description: string }>>> = {
  'first-lesson': {
    es: { title: 'Primeros Pasos', description: 'Completa tu primera lección' },
    ru: { title: 'Первые Шаги', description: 'Пройди первый урок' },
    mk: { title: 'Први Чекори', description: 'Заврши ја твојата прва лекција' },
  },
  'scholar': {
    es: { title: 'Erudito', description: 'Completa 5 lecciones' },
    ru: { title: 'Учёный', description: 'Пройди 5 уроков' },
    mk: { title: 'Научник', description: 'Заврши 5 лекции' },
  },
  'lessons-10': {
    es: { title: 'Estudiante Dedicado', description: 'Completa 10 lecciones' },
    ru: { title: 'Преданный Студент', description: 'Пройди 10 уроков' },
    mk: { title: 'Посветен Студент', description: 'Заврши 10 лекции' },
  },
  'lessons-15': {
    es: { title: 'Aprendiz Experimentado', description: 'Completa 15 lecciones' },
    ru: { title: 'Опытный Ученик', description: 'Пройди 15 уроков' },
    mk: { title: 'Искусен Ученик', description: 'Заврши 15 лекции' },
  },
  'historian': {
    es: { title: 'Historiador', description: 'Completa 20 lecciones' },
    ru: { title: 'Историк', description: 'Пройди 20 уроков' },
    mk: { title: 'Историчар', description: 'Заврши 20 лекции' },
  },
  'lessons-25': {
    es: { title: 'Gran Historiador', description: 'Completa 25 lecciones' },
    ru: { title: 'Великий Историк', description: 'Пройди 25 уроков' },
    mk: { title: 'Голем Историчар', description: 'Заврши 25 лекции' },
  },
  'quiz-ace': {
    es: { title: 'As del Quiz', description: 'Obtén 100% en cualquier quiz' },
    ru: { title: 'Мастер Викторины', description: 'Набери 100% в любой викторине' },
    mk: { title: 'Ас на Квизот', description: 'Освои 100% на кој bilo квиз' },
  },
  'quiz-3-ace': {
    es: { title: 'Triple Corona', description: 'Obtén 100% en 3 quizzes de era diferentes' },
    ru: { title: 'Тройная Корона', description: 'Набери 100% в 3 разных викторинах по эпохам' },
    mk: { title: 'Тројна Круна', description: 'Освои 100% на 3 различни квизови за епохи' },
  },
  'quiz-all': {
    es: { title: 'Gran Maestro', description: 'Obtén 100% en todos los quizzes de era' },
    ru: { title: 'Гроссмейстер', description: 'Набери 100% во всех викторинах по эпохам' },
    mk: { title: 'Гранд Мајстор', description: 'Освои 100% на сите квизови за епохи' },
  },
  'streak-3': {
    es: { title: 'Dedicado', description: 'Mantén una racha de 3 días' },
    ru: { title: 'Целеустремлённый', description: 'Поддерживай серию 3 дня' },
    mk: { title: 'Посветен', description: 'Одржи серија од 3 дена' },
  },
  'streak-7': {
    es: { title: 'Imparable', description: 'Mantén una racha de 7 días' },
    ru: { title: 'Неудержимый', description: 'Поддерживай серию 7 дней' },
    mk: { title: 'Неспирлив', description: 'Одржи серија од 7 дена' },
  },
  'streak-14': {
    es: { title: 'Voluntad de Hierro', description: 'Mantén una racha de 14 días' },
    ru: { title: 'Железная Воля', description: 'Поддерживай серию 14 дней' },
    mk: { title: 'Железна Волја', description: 'Одржи серија од 14 дена' },
  },
  'streak-30': {
    es: { title: 'Leyenda', description: 'Mantén una racha de 30 días' },
    ru: { title: 'Легенда', description: 'Поддерживай серию 30 дней' },
    mk: { title: 'Легенда', description: 'Одржи серија од 30 дена' },
  },
  'xp-1000': {
    es: { title: 'Buscador de Conocimiento', description: 'Gana 1.000 XP' },
    ru: { title: 'Искатель Знаний', description: 'Заработай 1 000 XP' },
    mk: { title: 'Барач на Знаење', description: 'Освои 1.000 XP' },
  },
  'xp-5000': {
    es: { title: 'Adicto al Conocimiento', description: 'Gana 5.000 XP' },
    ru: { title: 'Жажда Знаний', description: 'Заработай 5 000 XP' },
    mk: { title: 'Зависник од Знаење', description: 'Освои 5.000 XP' },
  },
  'xp-10000': {
    es: { title: 'Titán del Conocimiento', description: 'Gana 10.000 XP' },
    ru: { title: 'Титан Знаний', description: 'Заработай 10 000 XP' },
    mk: { title: 'Титан на Знаење', description: 'Освои 10.000 XP' },
  },
  'ai-curious': {
    es: { title: 'Mente Curiosa', description: 'Haz 10 preguntas al Tutor IA' },
    ru: { title: 'Пытливый Ум', description: 'Задай ИИ-Наставнику 10 вопросов' },
    mk: { title: 'Љубопитен Ум', description: 'Постави 10 прашања на ВИ Туторот' },
  },
  'ai-philosopher': {
    es: { title: 'Filósofo', description: 'Haz 50 preguntas al Tutor IA' },
    ru: { title: 'Философ', description: 'Задай ИИ-Наставнику 50 вопросов' },
    mk: { title: 'Филозоф', description: 'Постави 50 прашања на ВИ Туторот' },
  },
  'explorer': {
    es: { title: 'Explorador', description: 'Comienza lecciones en las 4 eras' },
    ru: { title: 'Исследователь', description: 'Начни уроки во всех 4 эпохах' },
    mk: { title: 'Истражувач', description: 'Започни лекции во сите 4 епохи' },
  },
  'ancient-master': {
    es: { title: 'Sabio Antiguo', description: 'Completa todas las lecciones de la era Antigua' },
    ru: { title: 'Учёный Древности', description: 'Пройди все уроки эпохи Древнего мира' },
    mk: { title: 'Антички Научник', description: 'Заврши ги сите лекции од Античката епоха' },
  },
  'medieval-master': {
    es: { title: 'Caballero Medieval', description: 'Completa todas las lecciones de la Edad Media' },
    ru: { title: 'Средневековый Рыцарь', description: 'Пройди все уроки эпохи Средневековья' },
    mk: { title: 'Средновековен Витез', description: 'Заврши ги сите лекции од Средниот Век' },
  },
  'earlymod-master': {
    es: { title: 'Mente Renacentista', description: 'Completa todas las lecciones del período Moderno Temprano' },
    ru: { title: 'Разум Возрождения', description: 'Пройди все уроки эпохи Раннего Нового времени' },
    mk: { title: 'Ренесансен Ум', description: 'Заврши ги сите лекции од Раното Модерно доба' },
  },
  'modern-master': {
    es: { title: 'Pensador Moderno', description: 'Completa todas las lecciones de la Era Moderna' },
    ru: { title: 'Современный Мыслитель', description: 'Пройди все уроки Современной эпохи' },
    mk: { title: 'Модерен Мислител', description: 'Заврши ги сите лекции од Модерната Епоха' },
  },
  'debate-first': {
    es: { title: 'Vencedor de Filósofos', description: 'Gana tu primer debate con un filósofo' },
    ru: { title: 'Победитель Философов', description: 'Выиграй первый философский дебат' },
    mk: { title: 'Победник на Филозофи', description: 'Победи во твојата прва филозофска дебата' },
  },
  'debate-master': {
    es: { title: 'Maestro del Debate', description: 'Gana 5 debates con filósofos' },
    ru: { title: 'Мастер Дебатов', description: 'Выиграй 5 философских дебатов' },
    mk: { title: 'Мајстор на Дебати', description: 'Победи во 5 филозофски дебати' },
  },
  'lessons-40': {
    es: { title: 'Leyenda del Aula', description: 'Completa 40 lecciones' },
    ru: { title: 'Легенда Лектория', description: 'Пройди 40 уроков' },
    mk: { title: 'Легенда на Предавалната', description: 'Заврши 40 лекции' },
  },
  'lessons-60': {
    es: { title: 'Conquistador del Currículo', description: 'Completa 60 lecciones' },
    ru: { title: 'Покоритель Программы', description: 'Пройди 60 уроков' },
    mk: { title: 'Освојувач на Програмата', description: 'Заврши 60 лекции' },
  },
  'lessons-all': {
    es: { title: 'Historiador Omnisciente', description: 'Completa todas las lecciones de Historify' },
    ru: { title: 'Всеведущий Историк', description: 'Пройди все уроки Historify' },
    mk: { title: 'Сезнаен Историчар', description: 'Заврши ги сите лекции во Historify' },
  },
  'prehistoric-master': {
    es: { title: 'Caminante del Tiempo Profundo', description: 'Completa todas las lecciones de la Prehistoria' },
    ru: { title: 'Странник Глубокого Времени', description: 'Пройди все уроки Доисторической эпохи' },
    mk: { title: 'Патник низ Длабокото Време', description: 'Заврши ги сите лекции од Праисторијата' },
  },
  'byzantine-master': {
    es: { title: 'Porfirogéneta', description: 'Completa todas las lecciones del Mundo Bizantino' },
    ru: { title: 'Багрянородный', description: 'Пройди все уроки Византийского мира' },
    mk: { title: 'Порфирогенет', description: 'Заврши ги сите лекции од Византискиот свет' },
  },
  'analysis-first': {
    es: { title: 'El Visto Bueno del Examinador', description: 'Aprueba tu primer análisis de Clío (nota B o mejor)' },
    ru: { title: 'Кивок Экзаменатора', description: 'Сдай свой первый анализ Клио (оценка B или выше)' },
    mk: { title: 'Одобрувањето на Испитувачот', description: 'Положи ја твојата прва анализа кај Клио (оценка B или подобра)' },
  },
  'analysis-5': {
    es: { title: 'Ensayista', description: 'Aprueba 5 análisis de lección de Clío' },
    ru: { title: 'Эссеист', description: 'Сдай 5 анализов уроков Клио' },
    mk: { title: 'Есеист', description: 'Положи 5 анализи на лекции кај Клио' },
  },
  'analysis-15': {
    es: { title: 'Retórico', description: 'Aprueba 15 análisis de lección de Clío' },
    ru: { title: 'Ритор', description: 'Сдай 15 анализов уроков Клио' },
    mk: { title: 'Ретор', description: 'Положи 15 анализи на лекции кај Клио' },
  },
  'analysis-40': {
    es: { title: 'Maestro del Argumento', description: 'Aprueba 40 análisis de lección de Clío' },
    ru: { title: 'Мастер Аргумента', description: 'Сдай 40 анализов уроков Клио' },
    mk: { title: 'Мајстор на Аргументот', description: 'Положи 40 анализи на лекции кај Клио' },
  },
  'analysis-aplus': {
    es: { title: 'La Favorita de Clío', description: 'Obtén una A+ en un análisis de lección' },
    ru: { title: 'Любимец Клио', description: 'Получи A+ за анализ урока' },
    mk: { title: 'Миленик на Клио', description: 'Освои A+ на анализа на лекција' },
  },
};


// ── German + French layer ───────────────────────────────────────────────────
// Kept as a separate record (same lookup contract) so the es/ru/mk block above
// stays byte-stable for diffing; getTranslatedAchievement consults both.
const ACHIEVEMENT_TRANS_DEFR: Record<string, Partial<Record<ContentLang, { title: string; description: string }>>> = {
  'first-lesson': {
    de: { title: 'Erste Schritte', description: 'Schließe deine erste Lektion ab' },
    fr: { title: 'Premiers Pas', description: 'Termine ta première leçon' },
  },
  'scholar': {
    de: { title: 'Gelehrter', description: 'Schließe 5 Lektionen ab' },
    fr: { title: 'Érudit', description: 'Termine 5 leçons' },
  },
  'lessons-10': {
    de: { title: 'Eifriger Student', description: 'Schließe 10 Lektionen ab' },
    fr: { title: 'Étudiant Dévoué', description: 'Termine 10 leçons' },
  },
  'lessons-15': {
    de: { title: 'Erfahrener Lerner', description: 'Schließe 15 Lektionen ab' },
    fr: { title: 'Apprenant Aguerri', description: 'Termine 15 leçons' },
  },
  'historian': {
    de: { title: 'Historiker', description: 'Schließe 20 Lektionen ab' },
    fr: { title: 'Historien', description: 'Termine 20 leçons' },
  },
  'lessons-25': {
    de: { title: 'Großer Historiker', description: 'Schließe 25 Lektionen ab' },
    fr: { title: 'Grand Historien', description: 'Termine 25 leçons' },
  },
  'lessons-40': {
    de: { title: 'Legende des Hörsaals', description: 'Schließe 40 Lektionen ab' },
    fr: { title: 'Légende de l’Amphithéâtre', description: 'Termine 40 leçons' },
  },
  'lessons-60': {
    de: { title: 'Bezwinger des Lehrplans', description: 'Schließe 60 Lektionen ab' },
    fr: { title: 'Conquérant du Programme', description: 'Termine 60 leçons' },
  },
  'lessons-all': {
    de: { title: 'Allwissender Historiker', description: 'Schließe jede Lektion in Historify ab' },
    fr: { title: 'Historien Omniscient', description: 'Termine toutes les leçons de Historify' },
  },
  'quiz-ace': {
    de: { title: 'Quiz-Ass', description: 'Erreiche 100 % in einem beliebigen Quiz' },
    fr: { title: 'As du Quiz', description: 'Obtiens 100 % à n’importe quel quiz' },
  },
  'quiz-3-ace': {
    de: { title: 'Dreifache Krone', description: 'Erreiche 100 % in 3 verschiedenen Epochen-Quizzen' },
    fr: { title: 'Triple Couronne', description: 'Obtiens 100 % à 3 quiz d’époque différents' },
  },
  'quiz-all': {
    de: { title: 'Großmeister', description: 'Erreiche 100 % in jedem Epochen-Quiz' },
    fr: { title: 'Grand Maître', description: 'Obtiens 100 % à tous les quiz d’époque' },
  },
  'streak-3': {
    de: { title: 'Engagiert', description: 'Halte eine Serie von 3 Tagen' },
    fr: { title: 'Assidu', description: 'Maintiens une série de 3 jours' },
  },
  'streak-7': {
    de: { title: 'Unaufhaltsam', description: 'Halte eine Serie von 7 Tagen' },
    fr: { title: 'Inarrêtable', description: 'Maintiens une série de 7 jours' },
  },
  'streak-14': {
    de: { title: 'Eiserner Wille', description: 'Halte eine Serie von 14 Tagen' },
    fr: { title: 'Volonté de Fer', description: 'Maintiens une série de 14 jours' },
  },
  'streak-30': {
    de: { title: 'Legende', description: 'Halte eine Serie von 30 Tagen' },
    fr: { title: 'Légende', description: 'Maintiens une série de 30 jours' },
  },
  'xp-1000': {
    de: { title: 'Wissenssucher', description: 'Verdiene 1.000 XP' },
    fr: { title: 'Chercheur de Savoir', description: 'Gagne 1 000 XP' },
  },
  'xp-5000': {
    de: { title: 'Wissenssüchtiger', description: 'Verdiene 5.000 XP' },
    fr: { title: 'Accro au Savoir', description: 'Gagne 5 000 XP' },
  },
  'xp-10000': {
    de: { title: 'Titan des Wissens', description: 'Verdiene 10.000 XP' },
    fr: { title: 'Titan du Savoir', description: 'Gagne 10 000 XP' },
  },
  'ai-curious': {
    de: { title: 'Neugieriger Geist', description: 'Stelle dem KI-Tutor 10 Fragen' },
    fr: { title: 'Esprit Curieux', description: 'Pose 10 questions au tuteur IA' },
  },
  'ai-philosopher': {
    de: { title: 'Philosoph', description: 'Stelle dem KI-Tutor 50 Fragen' },
    fr: { title: 'Philosophe', description: 'Pose 50 questions au tuteur IA' },
  },
  'explorer': {
    de: { title: 'Entdecker', description: 'Beginne Lektionen in jeder Epoche' },
    fr: { title: 'Explorateur', description: 'Commence des leçons dans chaque époque' },
  },
  'prehistoric-master': {
    de: { title: 'Wanderer der Tiefenzeit', description: 'Schließe alle Lektionen der Urgeschichte ab' },
    fr: { title: 'Marcheur du Temps Profond', description: 'Termine toutes les leçons de la Préhistoire' },
  },
  'ancient-master': {
    de: { title: 'Gelehrter der Antike', description: 'Schließe alle Lektionen der Antike ab' },
    fr: { title: 'Savant de l’Antiquité', description: 'Termine toutes les leçons de l’Antiquité' },
  },
  'byzantine-master': {
    de: { title: 'Porphyrogennetos', description: 'Schließe alle Lektionen der Byzantinischen Welt ab' },
    fr: { title: 'Porphyrogénète', description: 'Termine toutes les leçons du Monde Byzantin' },
  },
  'medieval-master': {
    de: { title: 'Mittelalterlicher Ritter', description: 'Schließe alle Lektionen des Mittelalters ab' },
    fr: { title: 'Chevalier Médiéval', description: 'Termine toutes les leçons du Moyen Âge' },
  },
  'earlymod-master': {
    de: { title: 'Renaissance-Geist', description: 'Schließe alle Lektionen der Frühen Neuzeit ab' },
    fr: { title: 'Esprit de la Renaissance', description: 'Termine toutes les leçons de l’Époque Moderne' },
  },
  'modern-master': {
    de: { title: 'Moderner Denker', description: 'Schließe alle Lektionen der Moderne ab' },
    fr: { title: 'Penseur Moderne', description: 'Termine toutes les leçons de l’Ère Contemporaine' },
  },
  'debate-first': {
    de: { title: 'Philosophenbezwinger', description: 'Gewinne deine erste Philosophen-Debatte' },
    fr: { title: 'Vainqueur de Philosophes', description: 'Gagne ton premier débat philosophique' },
  },
  'debate-master': {
    de: { title: 'Meister der Debatte', description: 'Gewinne 5 Philosophen-Debatten' },
    fr: { title: 'Maître du Débat', description: 'Gagne 5 débats philosophiques' },
  },
  'analysis-first': {
    de: { title: 'Das Nicken des Prüfers', description: 'Bestehe deine erste Clio-Analyse (Note B oder besser)' },
    fr: { title: 'L’Approbation de l’Examinateur', description: 'Réussis ta première analyse de Clio (note B ou mieux)' },
  },
  'analysis-5': {
    de: { title: 'Essayist', description: 'Bestehe 5 Clio-Lektionsanalysen' },
    fr: { title: 'Essayiste', description: 'Réussis 5 analyses de leçon de Clio' },
  },
  'analysis-15': {
    de: { title: 'Rhetoriker', description: 'Bestehe 15 Clio-Lektionsanalysen' },
    fr: { title: 'Rhétoricien', description: 'Réussis 15 analyses de leçon de Clio' },
  },
  'analysis-40': {
    de: { title: 'Meister des Arguments', description: 'Bestehe 40 Clio-Lektionsanalysen' },
    fr: { title: 'Maître de l’Argument', description: 'Réussis 40 analyses de leçon de Clio' },
  },
  'analysis-aplus': {
    de: { title: 'Klios Liebling', description: 'Erhalte ein A+ für eine Lektionsanalyse' },
    fr: { title: 'Favori de Clio', description: 'Obtiens un A+ à une analyse de leçon' },
  },
};

export function getTranslatedAchievement(id: string, lang: Language): { title: string; description: string } | null {
  if (lang === 'en') return null;
  return ACHIEVEMENT_TRANS[id]?.[lang as ContentLang] ?? ACHIEVEMENT_TRANS_DEFR[id]?.[lang as ContentLang] ?? null;
}
