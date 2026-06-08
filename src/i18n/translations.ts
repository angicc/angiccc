export type Language = 'en' | 'es' | 'ru' | 'mk';

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
  mk: 'Македонски',
};

type TranslationKeys = {
  // Nav
  nav_dashboard: string;
  nav_eras: string;
  nav_timeline: string;
  nav_tutor: string;
  nav_leaderboard: string;
  nav_friends: string;
  nav_flashcards: string;
  nav_notes: string;
  nav_progress: string;
  nav_smart_quiz: string;
  nav_essay: string;
  nav_video_review: string;
  nav_profile: string;
  nav_guide: string;
  nav_report: string;
  nav_upgrade: string;
  nav_logout: string;
  // Common
  search_placeholder: string;
  btn_start: string;
  btn_submit: string;
  btn_next: string;
  btn_back: string;
  btn_save: string;
  btn_cancel: string;
  btn_close: string;
  btn_retry: string;
  btn_new_session: string;
  btn_back_to_intro: string;
  btn_see_results: string;
  btn_next_question: string;
  // Quiz
  quiz_correct: string;
  quiz_incorrect: string;
  quiz_score: string;
  quiz_xp_earned: string;
  quiz_performance_by_era: string;
  quiz_clio_rec: string;
  quiz_clio_thinking: string;
  quiz_weak_areas: string;
  quiz_no_weak_areas: string;
  quiz_adaptive: string;
  quiz_earn_xp: string;
  quiz_questions: string;
  // Lesson
  lesson_complete: string;
  lesson_mark_complete: string;
  lesson_next_lesson: string;
  lesson_prev_lesson: string;
  // Misc
  streak_label: string;
  level_label: string;
  logout_title: string;
  logout_desc: string;
};

type Translations = Record<Language, TranslationKeys>;

export const T: Translations = {
  en: {
    nav_dashboard: 'Dashboard',
    nav_eras: 'Eras & Lessons',
    nav_timeline: 'Timeline',
    nav_tutor: 'AI Tutor',
    nav_leaderboard: 'Leaderboard',
    nav_friends: 'Friends',
    nav_flashcards: 'Flashcards',
    nav_notes: 'My Notes',
    nav_progress: 'Progress',
    nav_smart_quiz: 'Smart Quiz',
    nav_essay: 'Essay Challenge',
    nav_video_review: 'Video Review',
    nav_profile: 'Profile',
    nav_guide: 'App Guide',
    nav_report: 'Report a Problem',
    nav_upgrade: 'Upgrade Plan',
    nav_logout: 'Log Out',
    search_placeholder: 'Search…',
    btn_start: 'Start',
    btn_submit: 'Submit',
    btn_next: 'Next',
    btn_back: 'Back',
    btn_save: 'Save',
    btn_cancel: 'Cancel',
    btn_close: 'Close',
    btn_retry: 'Retry',
    btn_new_session: 'New Session',
    btn_back_to_intro: 'Back to Intro',
    btn_see_results: 'See Results',
    btn_next_question: 'Next Question',
    quiz_correct: 'Correct!',
    quiz_incorrect: 'Not quite.',
    quiz_score: 'Score',
    quiz_xp_earned: 'XP earned',
    quiz_performance_by_era: 'Performance by Era',
    quiz_clio_rec: "Clio's Recommendation",
    quiz_clio_thinking: 'Clio is thinking…',
    quiz_weak_areas: 'Detected Weak Areas',
    quiz_no_weak_areas: 'No weak areas detected yet.',
    quiz_adaptive: 'Adaptive',
    quiz_earn_xp: 'Earn XP',
    quiz_questions: 'Questions',
    lesson_complete: 'Lesson complete!',
    lesson_mark_complete: 'Mark as Complete',
    lesson_next_lesson: 'Next Lesson',
    lesson_prev_lesson: 'Previous Lesson',
    streak_label: 'streak',
    level_label: 'Level',
    logout_title: 'Log out of Historify?',
    logout_desc: 'Your progress is saved. You can log back in anytime.',
  },
  es: {
    nav_dashboard: 'Panel',
    nav_eras: 'Eras y Lecciones',
    nav_timeline: 'Línea de Tiempo',
    nav_tutor: 'Tutor IA',
    nav_leaderboard: 'Clasificación',
    nav_friends: 'Amigos',
    nav_flashcards: 'Tarjetas',
    nav_notes: 'Mis Notas',
    nav_progress: 'Progreso',
    nav_smart_quiz: 'Quiz Inteligente',
    nav_essay: 'Desafío de Ensayo',
    nav_video_review: 'Revisión de Vídeo',
    nav_profile: 'Perfil',
    nav_guide: 'Guía de la App',
    nav_report: 'Reportar Problema',
    nav_upgrade: 'Actualizar Plan',
    nav_logout: 'Cerrar Sesión',
    search_placeholder: 'Buscar…',
    btn_start: 'Iniciar',
    btn_submit: 'Enviar',
    btn_next: 'Siguiente',
    btn_back: 'Atrás',
    btn_save: 'Guardar',
    btn_cancel: 'Cancelar',
    btn_close: 'Cerrar',
    btn_retry: 'Reintentar',
    btn_new_session: 'Nueva Sesión',
    btn_back_to_intro: 'Volver al Inicio',
    btn_see_results: 'Ver Resultados',
    btn_next_question: 'Siguiente Pregunta',
    quiz_correct: '¡Correcto!',
    quiz_incorrect: 'No del todo.',
    quiz_score: 'Puntuación',
    quiz_xp_earned: 'XP ganado',
    quiz_performance_by_era: 'Rendimiento por Era',
    quiz_clio_rec: 'Recomendación de Clio',
    quiz_clio_thinking: 'Clio está pensando…',
    quiz_weak_areas: 'Áreas Débiles Detectadas',
    quiz_no_weak_areas: 'Aún no se detectaron áreas débiles.',
    quiz_adaptive: 'Adaptativo',
    quiz_earn_xp: 'Gana XP',
    quiz_questions: 'Preguntas',
    lesson_complete: '¡Lección completada!',
    lesson_mark_complete: 'Marcar como Completada',
    lesson_next_lesson: 'Siguiente Lección',
    lesson_prev_lesson: 'Lección Anterior',
    streak_label: 'racha',
    level_label: 'Nivel',
    logout_title: '¿Cerrar sesión en Historify?',
    logout_desc: 'Tu progreso está guardado. Puedes volver a iniciar sesión en cualquier momento.',
  },
  ru: {
    nav_dashboard: 'Панель',
    nav_eras: 'Эпохи и Уроки',
    nav_timeline: 'Хронология',
    nav_tutor: 'ИИ-Наставник',
    nav_leaderboard: 'Рейтинг',
    nav_friends: 'Друзья',
    nav_flashcards: 'Карточки',
    nav_notes: 'Мои Заметки',
    nav_progress: 'Прогресс',
    nav_smart_quiz: 'Умная Викторина',
    nav_essay: 'Эссе-Задание',
    nav_video_review: 'Обзор Видео',
    nav_profile: 'Профиль',
    nav_guide: 'Руководство',
    nav_report: 'Сообщить об ошибке',
    nav_upgrade: 'Обновить план',
    nav_logout: 'Выйти',
    search_placeholder: 'Поиск…',
    btn_start: 'Начать',
    btn_submit: 'Ответить',
    btn_next: 'Далее',
    btn_back: 'Назад',
    btn_save: 'Сохранить',
    btn_cancel: 'Отмена',
    btn_close: 'Закрыть',
    btn_retry: 'Повторить',
    btn_new_session: 'Новая Сессия',
    btn_back_to_intro: 'Вернуться',
    btn_see_results: 'Посмотреть Результаты',
    btn_next_question: 'Следующий Вопрос',
    quiz_correct: 'Правильно!',
    quiz_incorrect: 'Не совсем.',
    quiz_score: 'Счёт',
    quiz_xp_earned: 'XP получено',
    quiz_performance_by_era: 'Результаты по Эпохам',
    quiz_clio_rec: 'Рекомендация Клио',
    quiz_clio_thinking: 'Клио думает…',
    quiz_weak_areas: 'Обнаруженные Слабые Места',
    quiz_no_weak_areas: 'Слабые места пока не обнаружены.',
    quiz_adaptive: 'Адаптивный',
    quiz_earn_xp: 'Зарабатывай XP',
    quiz_questions: 'Вопросы',
    lesson_complete: 'Урок завершён!',
    lesson_mark_complete: 'Отметить как завершённый',
    lesson_next_lesson: 'Следующий Урок',
    lesson_prev_lesson: 'Предыдущий Урок',
    streak_label: 'дней подряд',
    level_label: 'Уровень',
    logout_title: 'Выйти из Historify?',
    logout_desc: 'Ваш прогресс сохранён. Вы можете войти снова в любое время.',
  },
  mk: {
    nav_dashboard: 'Контролна Табла',
    nav_eras: 'Епохи и Лекции',
    nav_timeline: 'Временска Линија',
    nav_tutor: 'ВИ Тутор',
    nav_leaderboard: 'Рангирање',
    nav_friends: 'Пријатели',
    nav_flashcards: 'Картички',
    nav_notes: 'Мои Белешки',
    nav_progress: 'Напредок',
    nav_smart_quiz: 'Паметен Квиз',
    nav_essay: 'Есеј Предизвик',
    nav_video_review: 'Видео Преглед',
    nav_profile: 'Профил',
    nav_guide: 'Водич за Апликацијата',
    nav_report: 'Пријави Проблем',
    nav_upgrade: 'Надгради го Планот',
    nav_logout: 'Одјави се',
    search_placeholder: 'Пребарај…',
    btn_start: 'Започни',
    btn_submit: 'Потврди',
    btn_next: 'Следно',
    btn_back: 'Назад',
    btn_save: 'Зачувај',
    btn_cancel: 'Откажи',
    btn_close: 'Затвори',
    btn_retry: 'Обиди се повторно',
    btn_new_session: 'Нова Сесија',
    btn_back_to_intro: 'Назад кон Вовед',
    btn_see_results: 'Погледни ги Резултатите',
    btn_next_question: 'Следно Прашање',
    quiz_correct: 'Точно!',
    quiz_incorrect: 'Не е точно.',
    quiz_score: 'Резултат',
    quiz_xp_earned: 'XP освоено',
    quiz_performance_by_era: 'Резултати по Епохи',
    quiz_clio_rec: 'Препорака на Клио',
    quiz_clio_thinking: 'Клио размислува…',
    quiz_weak_areas: 'Откриени Слаби Области',
    quiz_no_weak_areas: 'Сè уште нема откриени слаби области.',
    quiz_adaptive: 'Адаптивен',
    quiz_earn_xp: 'Освои XP',
    quiz_questions: 'Прашања',
    lesson_complete: 'Лекцијата е завршена!',
    lesson_mark_complete: 'Означи како Завршена',
    lesson_next_lesson: 'Следна Лекција',
    lesson_prev_lesson: 'Претходна Лекција',
    streak_label: 'дена по ред',
    level_label: 'Ниво',
    logout_title: 'Одјавување од Historify?',
    logout_desc: 'Твојот напредок е зачуван. Можеш да се најавиш повторно во секое време.',
  },
};
