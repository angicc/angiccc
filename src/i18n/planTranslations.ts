import type { Language } from './translations';

type ContentLang = Exclude<Language, 'en'>;

const PLAN_FEATURES: Record<string, Partial<Record<ContentLang, string[]>>> = {
  free: {
    es: ['1 lección por era (4 en total)', 'Quiz básico (solo puntuación)', 'Línea de tiempo – solo eventos principales', 'Seguimiento básico del progreso', 'Acceso al ranking', 'Tutor IA Clio – 5 mensajes/día'],
    ru: ['1 урок на эпоху (4 всего)', 'Базовая викторина (только счёт)', 'Хронология – только крупные события', 'Базовое отслеживание прогресса', 'Доступ к рейтингу', 'ИИ-Наставник Клио – 5 сообщений/день'],
    mk: ['1 лекција по епоха (4 вкупно)', 'Основен квиз (само резултат)', 'Временска линија – само главни настани', 'Основно следење на напредок', 'Пристап до рангирање', 'Клио ВИ Тутор – 5 пораки/ден'],
  },
  pro: {
    es: ['Todas las lecciones de las 4 eras', 'Quizzes completos con explicaciones', 'Tutor IA – 50 mensajes/mes', 'Línea de tiempo completa con filtros', 'Quiz Inteligente (IA adaptativa)', 'Tarjetas y repetición espaciada', 'Notas personales y marcadores', 'XP, logros y rachas', 'Analíticas de progreso y ranking', 'Debate con Filósofo (reinicio cada 12 h)'],
    ru: ['Все уроки по 4 эпохам', 'Полные викторины с объяснениями', 'ИИ-Наставник – 50 сообщений/мес', 'Полная хронология с фильтрами', 'Умная Викторина (адаптивный ИИ)', 'Карточки и интервальное повторение', 'Личные заметки и закладки', 'XP, достижения и серии', 'Аналитика прогресса и рейтинг', 'Дискуссия с философом (каждые 12 ч)'],
    mk: ['Сите лекции од 4 епохи', 'Целосни квизови со објаснувања', 'ВИ Тутор – 50 пораки/месец', 'Целосна временска линија со филтри', 'Паметен Квиз (адаптивна ВИ)', 'Картички и повторување со интервали', 'Лични белешки и обележувачи', 'XP, достигнувања и серии', 'Аналитика на напредок и рангирање', 'Дебата со Филозоф (ресетирање на секои 12 ч)'],
  },
  master: {
    es: ['Todo en Pro Learner', 'Desafío de Ensayo IA (exclusivo)', 'Desafío de Revisión de Vídeo (exclusivo)', 'Mensajes ilimitados de Tutor IA', 'Notas de lección descargables', 'Analíticas avanzadas y radar de habilidades', 'Rangos Históricos de Ajedrez (XP de Vídeo)', 'Soporte prioritario', 'Insignia Master en el perfil'],
    ru: ['Всё из Pro Learner', 'Эссе-Задание с ИИ (эксклюзив)', 'Видео-Задание (эксклюзив)', 'Безлимитные сообщения Наставника ИИ', 'Скачиваемые конспекты уроков', 'Расширенная аналитика и радар навыков', 'Исторические Шахматные Ранги (Видео XP)', 'Приоритетная поддержка', 'Значок Master в профиле'],
    mk: ['Сè од Pro Learner', 'ВИ Есеј Предизвик (ексклузивно)', 'Видео Предизвик за Преглед (ексклузивно)', 'Неограничени пораки на ВИ Тутор', 'Белешки за лекции за преземање', 'Напредна аналитика и радар на вештини', 'Историски Шаховски Рангови (Видео XP)', 'Приоритетна поддршка', 'Master значка на профилот'],
  },
};

export function getTranslatedPlanFeatures(planId: string, lang: Language): string[] | null {
  if (lang === 'en') return null;
  return PLAN_FEATURES[planId]?.[lang as ContentLang] ?? null;
}
