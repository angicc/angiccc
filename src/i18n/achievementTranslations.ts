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
    es: { title: 'Gran Maestro', description: 'Obtén 100% en los 4 quizzes de era' },
    ru: { title: 'Гроссмейстер', description: 'Набери 100% во всех 4 викторинах по эпохам' },
    mk: { title: 'Гранд Мајстор', description: 'Освои 100% на сите 4 квизови за епохи' },
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
};

export function getTranslatedAchievement(id: string, lang: Language): { title: string; description: string } | null {
  if (lang === 'en') return null;
  return ACHIEVEMENT_TRANS[id]?.[lang as ContentLang] ?? null;
}
