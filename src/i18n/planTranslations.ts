import type { Language } from './translations';

type ContentLang = Exclude<Language, 'en'>;

const PLAN_FEATURES: Record<string, Partial<Record<ContentLang, string[]>>> = {
  free: {
    es: ['1 lección por era (6 en total)', 'Quiz básico (solo puntuación)', 'Línea de tiempo – solo eventos principales', 'Seguimiento básico del progreso', 'Acceso al ranking', 'Tutor IA Clio – 5 mensajes/día'],
    ru: ['1 урок на эпоху (6 всего)', 'Базовая викторина (только счёт)', 'Хронология – только крупные события', 'Базовое отслеживание прогресса', 'Доступ к рейтингу', 'ИИ-Наставник Клио – 5 сообщений/день'],
    mk: ['1 лекција по епоха (6 вкупно)', 'Основен квиз (само резултат)', 'Временска линија – само главни настани', 'Основно следење на напредок', 'Пристап до рангирање', 'Клио ВИ Тутор – 5 пораки/ден'],
    de: ['1 Lektion pro Epoche (6 insgesamt)', 'Basis-Quiz (nur Punktzahl)', 'Zeitleiste – nur wichtige Ereignisse', 'Basis-Fortschrittsverfolgung', 'Zugang zur Bestenliste', 'Clio KI-Tutor – 5 Nachrichten/Tag'],
    fr: ['1 leçon par ère (6 au total)', 'Quiz de base (score uniquement)', 'Frise chronologique – événements majeurs seulement', 'Suivi de progression de base', 'Accès au classement', 'Tuteur IA Clio – 5 messages/jour'],
  },
  beginner: {
    es: ['Todo lo de Free', 'Línea de tiempo completa con filtros por era', 'Tarjetas – todos los mazos', 'Tutor IA Clio – 10 mensajes/día', 'Explicaciones de quiz en cada respuesta'],
    ru: ['Всё из Free', 'Полная хронология с фильтрами по эпохам', 'Карточки – все колоды', 'ИИ-Наставник Клио – 10 сообщений/день', 'Объяснения к каждому ответу викторины'],
    mk: ['Сè од Free', 'Целосна временска линија со филтри по епоха', 'Картички – сите шпилови', 'Клио ВИ Тутор – 10 пораки/ден', 'Објаснувања за секој одговор во квизот'],
    de: ['Alles aus Free', 'Vollständige Zeitleiste mit Epochenfiltern', 'Lernkarten – alle Stapel', 'Clio KI-Tutor – 10 Nachrichten/Tag', 'Quiz-Erklärungen für jede Antwort'],
    fr: ['Tout ce qui est dans Free', 'Frise chronologique complète avec filtres par ère', 'Cartes mémoire – tous les paquets', 'Tuteur IA Clio – 10 messages/jour', 'Explications de quiz pour chaque réponse'],
  },
  pro: {
    es: ['Todo lo de Beginner', 'Todas las lecciones de las 6 eras', 'Tutor IA – 50 mensajes/mes', 'Quiz Inteligente (IA adaptativa)', 'Plan de estudio – ruta semanal de aprendizaje', 'Estudio de Contenido IA – kits de estudio desde cualquier texto', 'Notas personales y marcadores', 'Analíticas de progreso y ranking', 'Debate con Filósofo (reinicio cada 12 h)', 'Mapa de Territorios – fronteras históricas interactivas'],
    ru: ['Всё из Beginner', 'Все уроки по 6 эпохам', 'ИИ-Наставник – 50 сообщений/мес', 'Умная Викторина (адаптивный ИИ)', 'План занятий – недельный учебный маршрут', 'ИИ-студия контента – учебные наборы из любого текста', 'Личные заметки и закладки', 'Аналитика прогресса и рейтинг', 'Дискуссия с философом (каждые 12 ч)', 'Карта Территорий – интерактивные исторические границы'],
    mk: ['Сè од Beginner', 'Сите лекции од 6 епохи', 'ВИ Тутор – 50 пораки/месец', 'Паметен Квиз (адаптивна ВИ)', 'План за учење – неделна патека за учење', 'ВИ Студио за содржина – комплети за учење од секој текст', 'Лични белешки и обележувачи', 'Аналитика на напредок и рангирање', 'Дебата со Филозоф (ресетирање на секои 12 ч)', 'Карта на Територии – интерактивни историски граници'],
    de: ['Alles aus Beginner', 'Alle Lektionen aus 6 Epochen', 'KI-Tutor – 50 Nachrichten/Monat', 'Intelligentes Quiz (adaptive KI)', 'Lernplan – wöchentlicher Lernpfad', 'KI-Inhaltsstudio – Lernpakete aus jedem Text', 'Persönliche Notizen & Lesezeichen', 'Fortschrittsanalyse & Bestenliste', 'Debatte mit einem Philosophen (Reset alle 12 Stunden)', 'Territoriumskarte – interaktive historische Grenzen & Marker'],
    fr: ['Tout ce qui est dans Beginner', 'Toutes les leçons des 6 ères', 'Tuteur IA – 50 messages/mois', 'Quiz Intelligent (IA adaptative)', 'Plan d’étude – parcours d’apprentissage hebdomadaire', 'Studio de Contenu IA – kits d’étude à partir de tout texte', 'Notes personnelles et favoris', 'Analyses de progression et classement', 'Débattre avec un Philosophe (réinitialisation toutes les 12 heures)', 'Carte des Territoires – frontières historiques interactives et repères'],
  },
  master: {
    es: ['Todo lo de Pro Student', 'Sala de Crisis Chronos (exclusivo)', 'Desafío de Ensayo IA (exclusivo)', 'Desafío de Revisión de Vídeo (exclusivo)', 'Campaña de Conquista – batallas animadas, las 4 eras + Modo Legendario (2× XP)', 'Plan de estudio – coaching «Mejorar con Clío»', 'Tutor IA – 100 mensajes/mes', 'Notas de lección descargables', 'Analíticas avanzadas y radar de habilidades', 'Rangos Históricos de Ajedrez (XP de Vídeo)', 'Insignia Master en el perfil'],
    ru: ['Всё из Pro Student', 'Кризисная комната Хроноса (эксклюзив)', 'Эссе-Задание с ИИ (эксклюзив)', 'Видео-Задание (эксклюзив)', 'Кампания Завоеваний – анимированные битвы, все 4 эпохи + Легендарный режим (2× XP)', 'План занятий – коучинг «Усилить с Клио»', 'ИИ-Наставник – 100 сообщений/мес', 'Скачиваемые конспекты уроков', 'Расширенная аналитика и радар навыков', 'Исторические Шахматные Ранги (Видео XP)', 'Значок Master в профиле'],
    mk: ['Сè од Pro Student', 'Кризна соба Хронос (ексклузивно)', 'ВИ Есеј Предизвик (ексклузивно)', 'Видео Предизвик за Преглед (ексклузивно)', 'Освојувачка Кампања – анимирани битки, сите 4 епохи + Легендарен режим (2× XP)', 'План за учење – „Засили со Клио“ коучинг', 'ВИ Тутор – 100 пораки/месец', 'Белешки за лекции за преземање', 'Напредна аналитика и радар на вештини', 'Историски Шаховски Рангови (Видео XP)', 'Master значка на профилот'],
    de: ['Alles aus Pro Student', 'Chronos-Krisenraum (exklusiv)', 'KI-Essay-Herausforderung (exklusiv)', 'Video-Review-Herausforderung (exklusiv)', 'Eroberungskampagne – animierte Schlachten, alle vier Epochen + Legendenmodus (2× XP)', 'Lernplan – „Mit Clio verbessern“-Coaching', 'KI-Tutor – 100 Nachrichten/Monat', 'Herunterladbare Lektionsnotizen', 'Erweiterte Analysen & Fähigkeiten-Radar', 'Historische Schach-Ränge (Video-XP)', 'Master-Abzeichen im Profil'],
    fr: ['Tout ce qui est dans Pro Student', 'Salle de Crise Chronos (exclusif)', 'Défi de Dissertation IA (exclusif)', 'Défi de Critique Vidéo (exclusif)', 'Campagne de Conquête – batailles animées, les quatre ères + Mode Légendaire (2× XP)', 'Plan d’étude – coaching « Améliorer avec Clio »', 'Tuteur IA – 100 messages/mois', 'Notes de leçon téléchargeables', 'Analyses avancées et radar de compétences', 'Rangs d’Échecs Historiques (XP Vidéo)', 'Badge Master sur le profil'],
  },
};

// Plan tagline shown under the price. English lives in plans.ts; every other
// language is localized here so no plan card ever mixes languages.
const PLAN_DESCRIPTIONS: Record<string, Partial<Record<ContentLang, string>>> = {
  free: {
    es: 'Comienza tu viaje por la historia.',
    ru: 'Начните своё путешествие по истории.',
    mk: 'Започни го твоето патување низ историјата.',
    de: 'Beginne deine Reise durch die Geschichte.',
    fr: 'Commencez votre voyage dans l’histoire.',
  },
  beginner: {
    es: 'Lo esencial para crear un hábito diario.',
    ru: 'Всё необходимое для ежедневной привычки.',
    mk: 'Основното за градење дневна навика.',
    de: 'Das Wesentliche für eine tägliche Lerngewohnheit.',
    fr: 'L’essentiel pour prendre une habitude quotidienne.',
  },
  pro: {
    es: 'Desbloquea el plan de estudios completo.',
    ru: 'Откройте полный учебный план.',
    mk: 'Отклучи ја целосната наставна програма.',
    de: 'Schalte den vollständigen Lehrplan frei.',
    fr: 'Débloquez le programme complet.',
  },
  master: {
    es: 'La experiencia Historify completa.',
    ru: 'Полный опыт Historify.',
    mk: 'Целосното Historify искуство.',
    de: 'Das komplette Historify-Erlebnis.',
    fr: 'L’expérience Historify complète.',
  },
};

export function getTranslatedPlanFeatures(planId: string, lang: Language): string[] | null {
  if (lang === 'en') return null;
  return PLAN_FEATURES[planId]?.[lang as ContentLang] ?? null;
}

export function getTranslatedPlanDescription(planId: string, lang: Language): string | null {
  if (lang === 'en') return null;
  return PLAN_DESCRIPTIONS[planId]?.[lang as ContentLang] ?? null;
}
