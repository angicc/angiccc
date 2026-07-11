import type { Language } from './translations';

type ContentLang = Exclude<Language, 'en'>;

const PLAN_FEATURES: Record<string, Partial<Record<ContentLang, string[]>>> = {
  free: {
    es: ['1 lección por era (4 en total)', 'Quiz básico (solo puntuación)', 'Línea de tiempo – solo eventos principales', 'Seguimiento básico del progreso', 'Acceso al ranking', 'Tutor IA Clio – 5 mensajes/día'],
    ru: ['1 урок на эпоху (4 всего)', 'Базовая викторина (только счёт)', 'Хронология – только крупные события', 'Базовое отслеживание прогресса', 'Доступ к рейтингу', 'ИИ-Наставник Клио – 5 сообщений/день'],
    mk: ['1 лекција по епоха (4 вкупно)', 'Основен квиз (само резултат)', 'Временска линија – само главни настани', 'Основно следење на напредок', 'Пристап до рангирање', 'Клио ВИ Тутор – 5 пораки/ден'],
  },
  beginner: {
    es: ['Todo lo de Free', 'Línea de tiempo completa con filtros por era', 'Tarjetas – todos los mazos', 'Tutor IA Clio – 10 mensajes/día', 'Explicaciones de quiz en cada respuesta'],
    ru: ['Всё из Free', 'Полная хронология с фильтрами по эпохам', 'Карточки – все колоды', 'ИИ-Наставник Клио – 10 сообщений/день', 'Объяснения к каждому ответу викторины'],
    mk: ['Сè од Free', 'Целосна временска линија со филтри по епоха', 'Картички – сите шпилови', 'Клио ВИ Тутор – 10 пораки/ден', 'Објаснувања за секој одговор во квизот'],
  },
  pro: {
    es: ['Todo lo de Beginner', 'Todas las lecciones de las 4 eras', 'Tutor IA – 50 mensajes/mes', 'Quiz Inteligente (IA adaptativa)', 'Plan de estudio – ruta semanal de aprendizaje', 'Estudio de Contenido IA – kits de estudio desde cualquier texto', 'Notas personales y marcadores', 'Analíticas de progreso y ranking', 'Debate con Filósofo (reinicio cada 12 h)', 'Mapa de Territorios – fronteras históricas interactivas'],
    ru: ['Всё из Beginner', 'Все уроки по 4 эпохам', 'ИИ-Наставник – 50 сообщений/мес', 'Умная Викторина (адаптивный ИИ)', 'План занятий – недельный учебный маршрут', 'ИИ-студия контента – учебные наборы из любого текста', 'Личные заметки и закладки', 'Аналитика прогресса и рейтинг', 'Дискуссия с философом (каждые 12 ч)', 'Карта Территорий – интерактивные исторические границы'],
    mk: ['Сè од Beginner', 'Сите лекции од 4 епохи', 'ВИ Тутор – 50 пораки/месец', 'Паметен Квиз (адаптивна ВИ)', 'План за учење – неделна патека за учење', 'ВИ Студио за содржина – комплети за учење од секој текст', 'Лични белешки и обележувачи', 'Аналитика на напредок и рангирање', 'Дебата со Филозоф (ресетирање на секои 12 ч)', 'Карта на Територии – интерактивни историски граници'],
  },
  master: {
    es: ['Todo lo de Pro Student', 'Sala de Crisis Chronos (exclusivo)', 'Desafío de Ensayo IA (exclusivo)', 'Desafío de Revisión de Vídeo (exclusivo)', 'Campaña de Conquista – batallas animadas, las 4 eras + Modo Legendario (2× XP)', 'Plan de estudio – coaching «Mejorar con Clío»', 'Tutor IA – 300 mensajes/mes', 'Notas de lección descargables', 'Analíticas avanzadas y radar de habilidades', 'Rangos Históricos de Ajedrez (XP de Vídeo)', 'Insignia Master en el perfil'],
    ru: ['Всё из Pro Student', 'Кризисная комната Хроноса (эксклюзив)', 'Эссе-Задание с ИИ (эксклюзив)', 'Видео-Задание (эксклюзив)', 'Кампания Завоеваний – анимированные битвы, все 4 эпохи + Легендарный режим (2× XP)', 'План занятий – коучинг «Усилить с Клио»', 'ИИ-Наставник – 300 сообщений/мес', 'Скачиваемые конспекты уроков', 'Расширенная аналитика и радар навыков', 'Исторические Шахматные Ранги (Видео XP)', 'Значок Master в профиле'],
    mk: ['Сè од Pro Student', 'Кризна соба Хронос (ексклузивно)', 'ВИ Есеј Предизвик (ексклузивно)', 'Видео Предизвик за Преглед (ексклузивно)', 'Освојувачка Кампања – анимирани битки, сите 4 епохи + Легендарен режим (2× XP)', 'План за учење – „Засили со Клио" коучинг', 'ВИ Тутор – 300 пораки/месец', 'Белешки за лекции за преземање', 'Напредна аналитика и радар на вештини', 'Историски Шаховски Рангови (Видео XP)', 'Master значка на профилот'],
  },
};

export function getTranslatedPlanFeatures(planId: string, lang: Language): string[] | null {
  if (lang === 'en') return null;
  return PLAN_FEATURES[planId]?.[lang as ContentLang] ?? null;
}
