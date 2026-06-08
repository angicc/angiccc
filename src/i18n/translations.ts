export type Language = 'en' | 'es' | 'ru' | 'mk';

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
  mk: 'Македонски',
};

type TranslationKeys = {
  // ── Sidebar / Nav ──────────────────────────────────────────────
  nav_dashboard: string; nav_eras: string; nav_timeline: string; nav_tutor: string;
  nav_leaderboard: string; nav_friends: string; nav_flashcards: string; nav_notes: string;
  nav_progress: string; nav_smart_quiz: string; nav_essay: string; nav_video_review: string;
  nav_profile: string; nav_guide: string; nav_report: string;
  nav_upgrade: string; nav_logout: string;
  logout_title: string; logout_desc: string;
  // ── Common buttons / labels ─────────────────────────────────────
  search_placeholder: string;
  btn_start: string; btn_submit: string; btn_next: string; btn_back: string;
  btn_save: string; btn_cancel: string; btn_close: string; btn_retry: string;
  btn_new_session: string; btn_back_to_intro: string; btn_see_results: string; btn_next_question: string;
  btn_log_in: string; btn_sign_up: string; btn_get_started: string; btn_upgrade: string;
  btn_view: string; btn_continue: string; btn_open: string;
  lbl_you: string; lbl_level: string; lbl_streak: string; lbl_xp: string; lbl_pts: string;
  streak_label: string; level_label: string;
  // ── Dashboard ──────────────────────────────────────────────────
  dash_welcome: string; dash_total_xp: string; dash_level: string;
  dash_lessons_done: string; dash_quiz_avg: string;
  dash_daily: string; dash_continue: string; dash_next_lesson: string;
  dash_era_progress: string; dash_recent: string; dash_no_activity: string;
  dash_completed: string; dash_xp_label: string;
  // ── Eras ───────────────────────────────────────────────────────
  eras_title: string; eras_subtitle: string; eras_lessons_label: string;
  eras_take_quiz: string; eras_view_lessons: string; eras_locked: string;
  eras_completed: string; eras_quiz_label: string; eras_lessons_count: string;
  // ── Lesson ─────────────────────────────────────────────────────
  lesson_key_facts: string; lesson_min_read: string; lesson_complete_btn: string;
  lesson_already_done: string; lesson_next: string; lesson_prev: string;
  lesson_take_quiz: string; lesson_discuss: string; lesson_notes_title: string;
  // ── Quiz ───────────────────────────────────────────────────────
  quiz_correct: string; quiz_incorrect: string; quiz_score: string; quiz_xp_earned: string;
  quiz_performance_by_era: string; quiz_clio_rec: string; quiz_clio_thinking: string;
  quiz_weak_areas: string; quiz_no_weak_areas: string;
  quiz_adaptive: string; quiz_earn_xp: string; quiz_questions: string;
  quiz_era_title: string; quiz_complete: string; quiz_passed: string; quiz_failed: string;
  quiz_retake: string; quiz_submit_answer: string; quiz_explanation: string;
  quiz_correct_label: string;
  // ── Timeline ───────────────────────────────────────────────────
  tl_title: string; tl_subtitle: string; tl_events: string;
  tl_all_eras: string; tl_all_categories: string; tl_open_lesson: string;
  // ── AI Tutor ───────────────────────────────────────────────────
  tutor_hello: string; tutor_desc: string; tutor_placeholder: string;
  tutor_new_chat: string; tutor_upgrade_msg: string;
  // ── Leaderboard ────────────────────────────────────────────────
  lb_title: string; lb_subtitle: string; lb_your_rank: string;
  lb_full_rankings: string; lb_you: string; lb_chess_rank: string;
  lb_level: string; lb_streak: string; lb_xp_regular: string; lb_xp_video: string; lb_score: string;
  // ── Friends ────────────────────────────────────────────────────
  fr_title: string; fr_subtitle: string; fr_search: string;
  fr_tab_friends: string; fr_tab_requests: string; fr_tab_sent: string;
  fr_add: string; fr_pending: string; fr_accept: string; fr_decline: string;
  fr_remove: string; fr_no_friends: string; fr_no_requests: string; fr_no_sent: string;
  fr_request_sent: string; fr_added: string;
  // ── Flashcards ─────────────────────────────────────────────────
  flash_title: string; flash_subtitle: string; flash_all_eras: string;
  flash_tap_flip: string; flash_knew: string; flash_review_again: string;
  flash_prev: string; flash_next: string; flash_restart: string;
  flash_progress: string; flash_remaining: string; flash_known_label: string;
  flash_review_label: string; flash_done: string; flash_key_fact: string;
  // ── Notes ──────────────────────────────────────────────────────
  notes_title: string; notes_subtitle: string; notes_placeholder: string;
  notes_save: string; notes_saved: string; notes_select: string;
  notes_empty: string; notes_search: string; notes_all_eras: string; notes_words: string;
  // ── Progress ───────────────────────────────────────────────────
  prog_title: string; prog_subtitle: string; prog_xp_total: string;
  prog_current_level: string; prog_streak: string; prog_lessons: string;
  prog_xp_history: string; prog_era_completion: string; prog_quiz_scores: string;
  prog_achievements: string; prog_skills_radar: string; prog_no_data: string;
  prog_unlocked: string; prog_locked: string; prog_recent_activity: string;
  prog_tab_overview: string; prog_tab_achievements: string; prog_tab_activity: string;
  // ── Smart Quiz ─────────────────────────────────────────────────
  sq_title: string; sq_subtitle: string; sq_adaptive_desc: string;
  sq_questions_label: string; sq_xp_desc: string; sq_start: string;
  sq_weak_title: string; sq_algorithm: string; sq_no_weak: string;
  sq_stats_title: string; sq_sessions: string; sq_avg_score: string;
  sq_best_score: string; sq_total_xp: string; sq_era_breakdown: string;
  sq_no_sessions: string; sq_correct_label: string;
  sq_perf_era: string; sq_new: string; sq_back_intro: string;
  sq_outstanding: string; sq_great: string; sq_good: string; sq_keep_going: string;
  // ── Essay ──────────────────────────────────────────────────────
  essay_title: string; essay_subtitle: string; essay_topic_label: string;
  essay_custom: string; essay_write_label: string; essay_words: string;
  essay_grade_btn: string; essay_new: string; essay_score: string;
  essay_grade: string; essay_xp: string; essay_feedback: string; essay_grading: string;
  essay_master_only: string;
  // ── Video Review ───────────────────────────────────────────────
  vr_title: string; vr_subtitle: string; vr_watch: string;
  vr_review_label: string; vr_submit: string; vr_grading: string;
  vr_video_xp: string; vr_next_in: string; vr_master_only: string;
  vr_available: string; vr_write_analysis: string;
  // ── Profile ────────────────────────────────────────────────────
  prof_title: string; prof_overview: string; prof_achievements: string;
  prof_settings: string; prof_chess_rank: string; prof_upload_photo: string;
  prof_remove_photo: string; prof_save: string; prof_username: string;
  prof_email: string; prof_plan: string; prof_upgrade: string; prof_member_since: string;
  // ── App Guide ──────────────────────────────────────────────────
  guide_title: string; guide_subtitle: string; guide_features: string;
  guide_quick_start: string; guide_faq_title: string;
  guide_start_lesson: string; guide_see_plans: string;
  guide_cta_title: string; guide_cta_desc: string; guide_dashboard: string;
  guide_start_learning: string; guide_step: string;
  // ── Report ─────────────────────────────────────────────────────
  report_title: string; report_subtitle: string; report_placeholder: string;
  report_submit: string; report_thanks: string; report_type: string;
  // ── Pricing ────────────────────────────────────────────────────
  pricing_title: string; pricing_subtitle: string; pricing_current: string;
  pricing_select: string; pricing_month: string; pricing_free_label: string;
  pricing_back: string;
};

type Translations = Record<Language, TranslationKeys>;

export const T: Translations = {
  en: {
    // Nav
    nav_dashboard: 'Dashboard', nav_eras: 'Eras & Lessons', nav_timeline: 'Timeline',
    nav_tutor: 'AI Tutor', nav_leaderboard: 'Leaderboard', nav_friends: 'Friends',
    nav_flashcards: 'Flashcards', nav_notes: 'My Notes', nav_progress: 'Progress',
    nav_smart_quiz: 'Smart Quiz', nav_essay: 'Essay Challenge', nav_video_review: 'Video Review',
    nav_profile: 'Profile', nav_guide: 'App Guide', nav_report: 'Report a Problem',
    nav_upgrade: 'Upgrade Plan', nav_logout: 'Log Out',
    logout_title: 'Log out of Historify?', logout_desc: 'Your progress is saved. You can log back in anytime.',
    // Common
    search_placeholder: 'Search…', btn_start: 'Start', btn_submit: 'Submit',
    btn_next: 'Next', btn_back: 'Back', btn_save: 'Save', btn_cancel: 'Cancel',
    btn_close: 'Close', btn_retry: 'Retry', btn_new_session: 'New Session',
    btn_back_to_intro: 'Back to Intro', btn_see_results: 'See Results',
    btn_next_question: 'Next Question', btn_log_in: 'Log In', btn_sign_up: 'Sign Up',
    btn_get_started: 'Get Started', btn_upgrade: 'Upgrade', btn_view: 'View',
    btn_continue: 'Continue', btn_open: 'Open',
    lbl_you: 'You', lbl_level: 'Level', lbl_streak: 'Streak', lbl_xp: 'XP', lbl_pts: 'pts',
    streak_label: 'streak', level_label: 'Level',
    // Dashboard
    dash_welcome: 'Welcome back,', dash_total_xp: 'Total XP', dash_level: 'Level',
    dash_lessons_done: 'Lessons Done', dash_quiz_avg: 'Quiz Avg',
    dash_daily: 'Daily Challenge', dash_continue: 'Continue Learning',
    dash_next_lesson: 'Next Lesson', dash_era_progress: 'Era Progress',
    dash_recent: 'Recent Activity', dash_no_activity: 'No recent activity yet.',
    dash_completed: 'completed', dash_xp_label: 'XP',
    // Eras
    eras_title: 'Eras & Lessons', eras_subtitle: 'Choose your era and begin your journey',
    eras_lessons_label: 'lessons', eras_take_quiz: 'Take Era Quiz',
    eras_view_lessons: 'View Lessons', eras_locked: 'Locked', eras_completed: 'Completed',
    eras_quiz_label: 'Era Quiz', eras_lessons_count: 'lessons',
    // Lesson
    lesson_key_facts: 'Key Facts', lesson_min_read: 'min read',
    lesson_complete_btn: 'Mark as Complete', lesson_already_done: 'Lesson Complete',
    lesson_next: 'Next Lesson', lesson_prev: 'Previous Lesson',
    lesson_take_quiz: 'Take Era Quiz', lesson_discuss: 'Discuss with Clio',
    lesson_notes_title: 'My Notes',
    // Quiz
    quiz_correct: 'Correct!', quiz_incorrect: 'Not quite.', quiz_score: 'Score',
    quiz_xp_earned: 'XP earned', quiz_performance_by_era: 'Performance by Era',
    quiz_clio_rec: "Clio's Recommendation", quiz_clio_thinking: 'Clio is thinking…',
    quiz_weak_areas: 'Detected Weak Areas', quiz_no_weak_areas: 'No weak areas detected yet.',
    quiz_adaptive: 'Adaptive', quiz_earn_xp: 'Earn XP', quiz_questions: 'Questions',
    quiz_era_title: 'Quiz', quiz_complete: 'Quiz Complete', quiz_passed: 'Passed!',
    quiz_failed: 'Keep Practising', quiz_retake: 'Retake Quiz',
    quiz_submit_answer: 'Submit Answer', quiz_explanation: 'Explanation',
    quiz_correct_label: 'correct',
    // Timeline
    tl_title: 'Historical Timeline', tl_subtitle: 'From 3100 BCE to the present day',
    tl_events: 'events', tl_all_eras: 'All Eras', tl_all_categories: 'All Categories',
    tl_open_lesson: 'Open Lesson',
    // AI Tutor
    tutor_hello: "Hello, I'm Clio!", tutor_desc: "I am the Muse of History — your guide through the ages. Ask me about any civilization, war, discovery, or era and I'll bring the past to life.",
    tutor_placeholder: 'Ask Clio about any moment in history…', tutor_new_chat: 'New Chat',
    tutor_upgrade_msg: 'Upgrade to use the AI Tutor',
    // Leaderboard
    lb_title: 'Leaderboard', lb_subtitle: 'Top learners ranked by total XP earned.',
    lb_your_rank: 'Your Rank', lb_full_rankings: 'Full Rankings', lb_you: '(You)',
    lb_chess_rank: 'Chess Rank', lb_level: 'Level', lb_streak: 'Streak',
    lb_xp_regular: 'Regular XP', lb_xp_video: 'Video XP', lb_score: 'Leaderboard Score',
    // Friends
    fr_title: 'Friends', fr_subtitle: 'Connect with other history learners',
    fr_search: 'Search users…', fr_tab_friends: 'Friends', fr_tab_requests: 'Requests',
    fr_tab_sent: 'Sent', fr_add: 'Add Friend', fr_pending: 'Pending',
    fr_accept: 'Accept', fr_decline: 'Decline', fr_remove: 'Remove',
    fr_no_friends: 'No friends yet. Search for users to connect!',
    fr_no_requests: 'No incoming requests.', fr_no_sent: 'No sent requests.',
    fr_request_sent: 'Request sent!', fr_added: 'Friend added!',
    // Flashcards
    flash_title: 'Flashcards', flash_subtitle: 'Drill key terms and facts from every lesson',
    flash_all_eras: 'All Eras', flash_tap_flip: 'Tap to flip',
    flash_knew: 'Knew It', flash_review_again: 'Review Again',
    flash_prev: 'Previous', flash_next: 'Next', flash_restart: 'Restart Deck',
    flash_progress: 'Progress', flash_remaining: 'remaining',
    flash_known_label: 'Known', flash_review_label: 'Review',
    flash_done: 'Deck Complete!', flash_key_fact: 'Key Fact',
    // Notes
    notes_title: 'My Notes', notes_subtitle: 'Notes saved per lesson — always available',
    notes_placeholder: 'Write your thoughts, insights, or summaries here…',
    notes_save: 'Save Note', notes_saved: 'Note saved!',
    notes_select: 'Select a lesson from the list to view or edit your note.',
    notes_empty: 'No lessons found.', notes_search: 'Search lessons…',
    notes_all_eras: 'All Eras', notes_words: 'words',
    // Progress
    prog_title: 'Progress', prog_subtitle: 'Your learning journey at a glance',
    prog_xp_total: 'Total XP', prog_current_level: 'Current Level',
    prog_streak: 'Day Streak', prog_lessons: 'Lessons Complete',
    prog_xp_history: 'XP History', prog_era_completion: 'Era Completion',
    prog_quiz_scores: 'Quiz Scores', prog_achievements: 'Achievements',
    prog_skills_radar: 'Skills Radar', prog_no_data: 'Complete lessons and quizzes to see your progress.',
    prog_unlocked: 'Unlocked', prog_locked: 'Locked', prog_recent_activity: 'Recent Activity',
    prog_tab_overview: 'Overview', prog_tab_achievements: 'Achievements', prog_tab_activity: 'Activity',
    // Smart Quiz
    sq_title: 'Smart Quiz', sq_subtitle: 'Adaptive questions targeting your weakest areas',
    sq_adaptive_desc: 'Questions target your weak spots', sq_questions_label: '15 Questions',
    sq_xp_desc: '+15 XP per correct · up to +225 XP', sq_start: 'Start Smart Quiz',
    sq_weak_title: 'Detected Weak Areas', sq_algorithm: 'The algorithm will prioritise these areas this session.',
    sq_no_weak: 'No weak areas detected yet. Complete some era quizzes and the algorithm will target your weakest topics.',
    sq_stats_title: 'Your Statistics', sq_sessions: 'Sessions', sq_avg_score: 'Avg Score',
    sq_best_score: 'Best Score', sq_total_xp: 'Total XP', sq_era_breakdown: 'Cumulative Era Performance',
    sq_no_sessions: 'No sessions yet — complete your first Smart Quiz!',
    sq_correct_label: 'correct', sq_perf_era: 'Performance by Era',
    sq_new: 'New Session', sq_back_intro: 'Back to Intro',
    sq_outstanding: "🏆 Outstanding! You're mastering history.",
    sq_great: '✅ Great work! Keep up the momentum.',
    sq_good: '📚 Good effort — review the weak areas below.',
    sq_keep_going: '💡 Keep studying — every attempt makes you stronger.',
    // Essay
    essay_title: 'AI Essay Challenge', essay_subtitle: 'Write a historical essay — Clio grades it in real-time',
    essay_topic_label: 'Choose a Topic', essay_custom: 'Custom topic…',
    essay_write_label: 'Write your essay (80–600 words)…', essay_words: 'words',
    essay_grade_btn: 'Submit for Grading', essay_new: 'New Essay',
    essay_score: 'Overall Score', essay_grade: 'Grade', essay_xp: 'XP Earned',
    essay_feedback: 'Detailed Feedback', essay_grading: 'Clio is grading your essay…',
    essay_master_only: 'Essay Challenge is exclusively available on the Master Student plan.',
    // Video Review
    vr_title: 'Video Review Challenge', vr_subtitle: 'Watch. Analyse. Learn.',
    vr_watch: 'Watch the Video', vr_review_label: 'Write Your Review',
    vr_submit: 'Submit Review', vr_grading: 'Clio is grading your review…',
    vr_video_xp: 'Video XP Earned', vr_next_in: 'Next video in',
    vr_master_only: 'Exclusive to Master Student plan', vr_available: 'New video available!',
    vr_write_analysis: 'Write your analysis identifying the main motive or argument…',
    // Profile
    prof_title: 'Profile', prof_overview: 'Overview', prof_achievements: 'Achievements',
    prof_settings: 'Settings', prof_chess_rank: 'Chess Rank',
    prof_upload_photo: 'Upload Photo', prof_remove_photo: 'Remove Photo',
    prof_save: 'Save Changes', prof_username: 'Username', prof_email: 'Email',
    prof_plan: 'Current Plan', prof_upgrade: 'Upgrade', prof_member_since: 'Member since',
    // App Guide
    guide_title: 'App Guide', guide_subtitle: 'Everything you need to know to get the most out of Historify',
    guide_features: '11 Features', guide_quick_start: 'Quick Start',
    guide_faq_title: 'Frequently Asked Questions', guide_start_lesson: 'Start a Lesson',
    guide_see_plans: 'See Plans', guide_cta_title: 'Ready to begin your journey?',
    guide_cta_desc: 'Head to the Dashboard to see your progress at a glance, or jump straight into a lesson.',
    guide_dashboard: 'Dashboard', guide_start_learning: 'Start Learning', guide_step: 'Step',
    // Report
    report_title: 'Report a Problem', report_subtitle: 'Help us improve Historify',
    report_placeholder: 'Describe the problem you encountered…',
    report_submit: 'Send Report', report_thanks: 'Thank you! Your report has been received.',
    report_type: 'Problem Type',
    // Pricing
    pricing_title: 'Choose Your Learning Plan', pricing_subtitle: 'From casual exploration to mastery-level study — a plan for every learner.',
    pricing_current: 'Current Plan', pricing_select: 'Get Started', pricing_month: '/month',
    pricing_free_label: 'Free', pricing_back: 'Back',
  },

  es: {
    nav_dashboard: 'Panel', nav_eras: 'Eras y Lecciones', nav_timeline: 'Línea de Tiempo',
    nav_tutor: 'Tutor IA', nav_leaderboard: 'Clasificación', nav_friends: 'Amigos',
    nav_flashcards: 'Tarjetas', nav_notes: 'Mis Notas', nav_progress: 'Progreso',
    nav_smart_quiz: 'Quiz Inteligente', nav_essay: 'Desafío de Ensayo', nav_video_review: 'Revisión de Vídeo',
    nav_profile: 'Perfil', nav_guide: 'Guía de la App', nav_report: 'Reportar Problema',
    nav_upgrade: 'Actualizar Plan', nav_logout: 'Cerrar Sesión',
    logout_title: '¿Cerrar sesión en Historify?', logout_desc: 'Tu progreso está guardado. Puedes iniciar sesión de nuevo en cualquier momento.',
    search_placeholder: 'Buscar…', btn_start: 'Iniciar', btn_submit: 'Enviar',
    btn_next: 'Siguiente', btn_back: 'Atrás', btn_save: 'Guardar', btn_cancel: 'Cancelar',
    btn_close: 'Cerrar', btn_retry: 'Reintentar', btn_new_session: 'Nueva Sesión',
    btn_back_to_intro: 'Volver al Inicio', btn_see_results: 'Ver Resultados',
    btn_next_question: 'Siguiente Pregunta', btn_log_in: 'Iniciar Sesión', btn_sign_up: 'Registrarse',
    btn_get_started: 'Comenzar', btn_upgrade: 'Actualizar', btn_view: 'Ver',
    btn_continue: 'Continuar', btn_open: 'Abrir',
    lbl_you: 'Tú', lbl_level: 'Nivel', lbl_streak: 'Racha', lbl_xp: 'XP', lbl_pts: 'pts',
    streak_label: 'racha', level_label: 'Nivel',
    dash_welcome: '¡Bienvenido de nuevo,', dash_total_xp: 'XP Total', dash_level: 'Nivel',
    dash_lessons_done: 'Lecciones Completadas', dash_quiz_avg: 'Promedio de Quiz',
    dash_daily: 'Desafío Diario', dash_continue: 'Continuar Aprendiendo',
    dash_next_lesson: 'Siguiente Lección', dash_era_progress: 'Progreso por Era',
    dash_recent: 'Actividad Reciente', dash_no_activity: 'Aún no hay actividad reciente.',
    dash_completed: 'completado', dash_xp_label: 'XP',
    eras_title: 'Eras y Lecciones', eras_subtitle: 'Elige tu era y comienza tu viaje',
    eras_lessons_label: 'lecciones', eras_take_quiz: 'Hacer Quiz de Era',
    eras_view_lessons: 'Ver Lecciones', eras_locked: 'Bloqueado', eras_completed: 'Completado',
    eras_quiz_label: 'Quiz de Era', eras_lessons_count: 'lecciones',
    lesson_key_facts: 'Hechos Clave', lesson_min_read: 'min de lectura',
    lesson_complete_btn: 'Marcar como Completada', lesson_already_done: 'Lección Completada',
    lesson_next: 'Siguiente Lección', lesson_prev: 'Lección Anterior',
    lesson_take_quiz: 'Hacer Quiz de Era', lesson_discuss: 'Comentar con Clio',
    lesson_notes_title: 'Mis Notas',
    quiz_correct: '¡Correcto!', quiz_incorrect: 'No del todo.', quiz_score: 'Puntuación',
    quiz_xp_earned: 'XP ganado', quiz_performance_by_era: 'Rendimiento por Era',
    quiz_clio_rec: 'Recomendación de Clio', quiz_clio_thinking: 'Clio está pensando…',
    quiz_weak_areas: 'Áreas Débiles Detectadas', quiz_no_weak_areas: 'Aún no se detectaron áreas débiles.',
    quiz_adaptive: 'Adaptativo', quiz_earn_xp: 'Gana XP', quiz_questions: 'Preguntas',
    quiz_era_title: 'Quiz', quiz_complete: 'Quiz Completado', quiz_passed: '¡Aprobado!',
    quiz_failed: 'Sigue Practicando', quiz_retake: 'Repetir Quiz',
    quiz_submit_answer: 'Enviar Respuesta', quiz_explanation: 'Explicación', quiz_correct_label: 'correcto',
    tl_title: 'Línea de Tiempo Histórica', tl_subtitle: 'Desde 3100 a.C. hasta hoy',
    tl_events: 'eventos', tl_all_eras: 'Todas las Eras', tl_all_categories: 'Todas las Categorías',
    tl_open_lesson: 'Abrir Lección',
    tutor_hello: '¡Hola, soy Clio!', tutor_desc: 'Soy la Musa de la Historia — tu guía a través de los siglos. Pregúntame sobre cualquier civilización, guerra, descubrimiento o era.',
    tutor_placeholder: 'Pregunta a Clio sobre cualquier momento de la historia…', tutor_new_chat: 'Nuevo Chat',
    tutor_upgrade_msg: 'Actualiza para usar el Tutor IA',
    lb_title: 'Clasificación', lb_subtitle: 'Los mejores estudiantes clasificados por XP total.',
    lb_your_rank: 'Tu Posición', lb_full_rankings: 'Clasificación Completa', lb_you: '(Tú)',
    lb_chess_rank: 'Rango de Ajedrez', lb_level: 'Nivel', lb_streak: 'Racha',
    lb_xp_regular: 'XP Regular', lb_xp_video: 'XP de Vídeo', lb_score: 'Puntuación Total',
    fr_title: 'Amigos', fr_subtitle: 'Conecta con otros estudiantes de historia',
    fr_search: 'Buscar usuarios…', fr_tab_friends: 'Amigos', fr_tab_requests: 'Solicitudes',
    fr_tab_sent: 'Enviadas', fr_add: 'Agregar Amigo', fr_pending: 'Pendiente',
    fr_accept: 'Aceptar', fr_decline: 'Rechazar', fr_remove: 'Eliminar',
    fr_no_friends: 'Aún no tienes amigos. ¡Busca usuarios para conectar!',
    fr_no_requests: 'No hay solicitudes entrantes.', fr_no_sent: 'No hay solicitudes enviadas.',
    fr_request_sent: '¡Solicitud enviada!', fr_added: '¡Amigo añadido!',
    flash_title: 'Tarjetas', flash_subtitle: 'Repasa conceptos clave de cada lección',
    flash_all_eras: 'Todas las Eras', flash_tap_flip: 'Toca para voltear',
    flash_knew: 'Lo sabía', flash_review_again: 'Repasar otra vez',
    flash_prev: 'Anterior', flash_next: 'Siguiente', flash_restart: 'Reiniciar Mazo',
    flash_progress: 'Progreso', flash_remaining: 'restantes',
    flash_known_label: 'Sabido', flash_review_label: 'A Repasar',
    flash_done: '¡Mazo Completado!', flash_key_fact: 'Hecho Clave',
    notes_title: 'Mis Notas', notes_subtitle: 'Notas guardadas por lección — siempre disponibles',
    notes_placeholder: 'Escribe tus pensamientos, ideas o resúmenes aquí…',
    notes_save: 'Guardar Nota', notes_saved: '¡Nota guardada!',
    notes_select: 'Selecciona una lección de la lista para ver o editar tu nota.',
    notes_empty: 'No se encontraron lecciones.', notes_search: 'Buscar lecciones…',
    notes_all_eras: 'Todas las Eras', notes_words: 'palabras',
    prog_title: 'Progreso', prog_subtitle: 'Tu viaje de aprendizaje de un vistazo',
    prog_xp_total: 'XP Total', prog_current_level: 'Nivel Actual',
    prog_streak: 'Racha de Días', prog_lessons: 'Lecciones Completadas',
    prog_xp_history: 'Historial de XP', prog_era_completion: 'Completado por Era',
    prog_quiz_scores: 'Puntuaciones de Quiz', prog_achievements: 'Logros',
    prog_skills_radar: 'Radar de Habilidades', prog_no_data: 'Completa lecciones y quizzes para ver tu progreso.',
    prog_unlocked: 'Desbloqueado', prog_locked: 'Bloqueado', prog_recent_activity: 'Actividad Reciente',
    prog_tab_overview: 'Resumen', prog_tab_achievements: 'Logros', prog_tab_activity: 'Actividad',
    sq_title: 'Quiz Inteligente', sq_subtitle: 'Preguntas adaptativas orientadas a tus áreas más débiles',
    sq_adaptive_desc: 'Las preguntas apuntan a tus puntos débiles', sq_questions_label: '15 Preguntas',
    sq_xp_desc: '+15 XP por respuesta correcta · hasta +225 XP', sq_start: 'Iniciar Quiz Inteligente',
    sq_weak_title: 'Áreas Débiles Detectadas', sq_algorithm: 'El algoritmo priorizará estas áreas en esta sesión.',
    sq_no_weak: 'Aún no se detectaron áreas débiles. ¡Completa algunos quizzes de era!',
    sq_stats_title: 'Tus Estadísticas', sq_sessions: 'Sesiones', sq_avg_score: 'Puntuación Media',
    sq_best_score: 'Mejor Puntuación', sq_total_xp: 'XP Total', sq_era_breakdown: 'Rendimiento Acumulado por Era',
    sq_no_sessions: 'Aún no hay sesiones — ¡completa tu primer Quiz Inteligente!',
    sq_correct_label: 'correcto', sq_perf_era: 'Rendimiento por Era',
    sq_new: 'Nueva Sesión', sq_back_intro: 'Volver al Inicio',
    sq_outstanding: '🏆 ¡Excepcional! Estás dominando la historia.',
    sq_great: '✅ ¡Muy bien! Mantén el impulso.',
    sq_good: '📚 Buen esfuerzo — repasa las áreas débiles.',
    sq_keep_going: '💡 Sigue estudiando — cada intento te hace más fuerte.',
    essay_title: 'Desafío de Ensayo IA', essay_subtitle: 'Escribe un ensayo histórico — Clio lo evalúa en tiempo real',
    essay_topic_label: 'Elige un Tema', essay_custom: 'Tema personalizado…',
    essay_write_label: 'Escribe tu ensayo (80–600 palabras)…', essay_words: 'palabras',
    essay_grade_btn: 'Enviar para Evaluación', essay_new: 'Nuevo Ensayo',
    essay_score: 'Puntuación Global', essay_grade: 'Nota', essay_xp: 'XP Ganado',
    essay_feedback: 'Retroalimentación Detallada', essay_grading: 'Clio está evaluando tu ensayo…',
    essay_master_only: 'El Desafío de Ensayo está disponible exclusivamente en el plan Master Student.',
    vr_title: 'Desafío de Revisión de Vídeo', vr_subtitle: 'Mira. Analiza. Aprende.',
    vr_watch: 'Ver el Vídeo', vr_review_label: 'Escribe tu Revisión',
    vr_submit: 'Enviar Revisión', vr_grading: 'Clio está evaluando tu revisión…',
    vr_video_xp: 'XP de Vídeo Ganado', vr_next_in: 'Próximo vídeo en',
    vr_master_only: 'Exclusivo del plan Master Student', vr_available: '¡Nuevo vídeo disponible!',
    vr_write_analysis: 'Escribe tu análisis identificando el motivo o argumento principal…',
    prof_title: 'Perfil', prof_overview: 'Resumen', prof_achievements: 'Logros',
    prof_settings: 'Configuración', prof_chess_rank: 'Rango de Ajedrez',
    prof_upload_photo: 'Subir Foto', prof_remove_photo: 'Eliminar Foto',
    prof_save: 'Guardar Cambios', prof_username: 'Nombre de Usuario', prof_email: 'Correo',
    prof_plan: 'Plan Actual', prof_upgrade: 'Actualizar', prof_member_since: 'Miembro desde',
    guide_title: 'Guía de la App', guide_subtitle: 'Todo lo que necesitas saber para aprovechar Historify al máximo',
    guide_features: '11 Funciones', guide_quick_start: 'Inicio Rápido',
    guide_faq_title: 'Preguntas Frecuentes', guide_start_lesson: 'Iniciar una Lección',
    guide_see_plans: 'Ver Planes', guide_cta_title: '¿Listo para comenzar tu viaje?',
    guide_cta_desc: 'Ve al Panel para ver tu progreso de un vistazo, o ve directamente a una lección.',
    guide_dashboard: 'Panel', guide_start_learning: 'Comenzar a Aprender', guide_step: 'Paso',
    report_title: 'Reportar un Problema', report_subtitle: 'Ayúdanos a mejorar Historify',
    report_placeholder: 'Describe el problema que encontraste…',
    report_submit: 'Enviar Reporte', report_thanks: '¡Gracias! Tu reporte ha sido recibido.',
    report_type: 'Tipo de Problema',
    pricing_title: 'Elige tu Plan de Aprendizaje', pricing_subtitle: 'Desde exploración casual hasta estudio avanzado — un plan para cada estudiante.',
    pricing_current: 'Plan Actual', pricing_select: 'Comenzar', pricing_month: '/mes',
    pricing_free_label: 'Gratis', pricing_back: 'Volver',
  },

  ru: {
    nav_dashboard: 'Панель', nav_eras: 'Эпохи и Уроки', nav_timeline: 'Хронология',
    nav_tutor: 'ИИ-Наставник', nav_leaderboard: 'Рейтинг', nav_friends: 'Друзья',
    nav_flashcards: 'Карточки', nav_notes: 'Мои Заметки', nav_progress: 'Прогресс',
    nav_smart_quiz: 'Умная Викторина', nav_essay: 'Эссе-Задание', nav_video_review: 'Обзор Видео',
    nav_profile: 'Профиль', nav_guide: 'Руководство', nav_report: 'Сообщить об ошибке',
    nav_upgrade: 'Обновить план', nav_logout: 'Выйти',
    logout_title: 'Выйти из Historify?', logout_desc: 'Ваш прогресс сохранён. Вы можете войти снова в любое время.',
    search_placeholder: 'Поиск…', btn_start: 'Начать', btn_submit: 'Ответить',
    btn_next: 'Далее', btn_back: 'Назад', btn_save: 'Сохранить', btn_cancel: 'Отмена',
    btn_close: 'Закрыть', btn_retry: 'Повторить', btn_new_session: 'Новая Сессия',
    btn_back_to_intro: 'Вернуться', btn_see_results: 'Посмотреть Результаты',
    btn_next_question: 'Следующий Вопрос', btn_log_in: 'Войти', btn_sign_up: 'Зарегистрироваться',
    btn_get_started: 'Начать', btn_upgrade: 'Обновить', btn_view: 'Посмотреть',
    btn_continue: 'Продолжить', btn_open: 'Открыть',
    lbl_you: 'Вы', lbl_level: 'Уровень', lbl_streak: 'Серия', lbl_xp: 'XP', lbl_pts: 'очки',
    streak_label: 'дней подряд', level_label: 'Уровень',
    dash_welcome: 'С возвращением,', dash_total_xp: 'Всего XP', dash_level: 'Уровень',
    dash_lessons_done: 'Уроков пройдено', dash_quiz_avg: 'Средний балл',
    dash_daily: 'Ежедневное Задание', dash_continue: 'Продолжить обучение',
    dash_next_lesson: 'Следующий Урок', dash_era_progress: 'Прогресс по Эпохам',
    dash_recent: 'Недавняя активность', dash_no_activity: 'Пока нет активности.',
    dash_completed: 'пройдено', dash_xp_label: 'XP',
    eras_title: 'Эпохи и Уроки', eras_subtitle: 'Выберите эпоху и начните путешествие',
    eras_lessons_label: 'уроков', eras_take_quiz: 'Пройти Викторину',
    eras_view_lessons: 'Смотреть Уроки', eras_locked: 'Заблокировано', eras_completed: 'Пройдено',
    eras_quiz_label: 'Викторина', eras_lessons_count: 'уроков',
    lesson_key_facts: 'Ключевые Факты', lesson_min_read: 'мин чтения',
    lesson_complete_btn: 'Отметить как завершённый', lesson_already_done: 'Урок завершён',
    lesson_next: 'Следующий Урок', lesson_prev: 'Предыдущий Урок',
    lesson_take_quiz: 'Пройти Викторину', lesson_discuss: 'Обсудить с Клио',
    lesson_notes_title: 'Мои Заметки',
    quiz_correct: 'Правильно!', quiz_incorrect: 'Не совсем.', quiz_score: 'Счёт',
    quiz_xp_earned: 'XP получено', quiz_performance_by_era: 'Результаты по Эпохам',
    quiz_clio_rec: 'Рекомендация Клио', quiz_clio_thinking: 'Клио думает…',
    quiz_weak_areas: 'Обнаруженные слабые места', quiz_no_weak_areas: 'Слабые места ещё не обнаружены.',
    quiz_adaptive: 'Адаптивный', quiz_earn_xp: 'Зарабатывай XP', quiz_questions: 'Вопросы',
    quiz_era_title: 'Викторина', quiz_complete: 'Викторина завершена', quiz_passed: 'Пройдено!',
    quiz_failed: 'Продолжай практиковаться', quiz_retake: 'Пройти снова',
    quiz_submit_answer: 'Ответить', quiz_explanation: 'Объяснение', quiz_correct_label: 'верно',
    tl_title: 'Историческая Хронология', tl_subtitle: 'С 3100 г. до н.э. по сегодняшний день',
    tl_events: 'событий', tl_all_eras: 'Все Эпохи', tl_all_categories: 'Все Категории',
    tl_open_lesson: 'Открыть Урок',
    tutor_hello: 'Привет, я Клио!', tutor_desc: 'Я — Муза Истории, ваш проводник сквозь века. Спросите меня о любой цивилизации, войне, открытии или эпохе.',
    tutor_placeholder: 'Спросите Клио о любом историческом событии…', tutor_new_chat: 'Новый Чат',
    tutor_upgrade_msg: 'Обновите план, чтобы использовать ИИ-Наставника',
    lb_title: 'Рейтинг', lb_subtitle: 'Лучшие ученики, отсортированные по общему XP.',
    lb_your_rank: 'Ваш Рейтинг', lb_full_rankings: 'Полный Рейтинг', lb_you: '(Вы)',
    lb_chess_rank: 'Шахматный Ранг', lb_level: 'Уровень', lb_streak: 'Серия',
    lb_xp_regular: 'Обычный XP', lb_xp_video: 'Видео XP', lb_score: 'Рейтинговый Счёт',
    fr_title: 'Друзья', fr_subtitle: 'Общайтесь с другими любителями истории',
    fr_search: 'Поиск пользователей…', fr_tab_friends: 'Друзья', fr_tab_requests: 'Запросы',
    fr_tab_sent: 'Отправленные', fr_add: 'Добавить в Друзья', fr_pending: 'Ожидание',
    fr_accept: 'Принять', fr_decline: 'Отклонить', fr_remove: 'Удалить',
    fr_no_friends: 'Друзей пока нет. Найдите пользователей для общения!',
    fr_no_requests: 'Нет входящих запросов.', fr_no_sent: 'Нет отправленных запросов.',
    fr_request_sent: 'Запрос отправлен!', fr_added: 'Друг добавлен!',
    flash_title: 'Карточки', flash_subtitle: 'Повторяйте ключевые термины из каждого урока',
    flash_all_eras: 'Все Эпохи', flash_tap_flip: 'Нажмите, чтобы перевернуть',
    flash_knew: 'Знал(а)', flash_review_again: 'Повторить',
    flash_prev: 'Предыдущая', flash_next: 'Следующая', flash_restart: 'Начать сначала',
    flash_progress: 'Прогресс', flash_remaining: 'осталось',
    flash_known_label: 'Известно', flash_review_label: 'На повтор',
    flash_done: 'Колода завершена!', flash_key_fact: 'Ключевой Факт',
    notes_title: 'Мои Заметки', notes_subtitle: 'Заметки сохраняются по урокам — всегда доступны',
    notes_placeholder: 'Напишите свои мысли, идеи или краткое содержание…',
    notes_save: 'Сохранить заметку', notes_saved: 'Заметка сохранена!',
    notes_select: 'Выберите урок из списка, чтобы просмотреть или редактировать заметку.',
    notes_empty: 'Уроки не найдены.', notes_search: 'Поиск уроков…',
    notes_all_eras: 'Все Эпохи', notes_words: 'слов',
    prog_title: 'Прогресс', prog_subtitle: 'Ваш учебный путь с первого взгляда',
    prog_xp_total: 'Всего XP', prog_current_level: 'Текущий Уровень',
    prog_streak: 'Дней подряд', prog_lessons: 'Уроков пройдено',
    prog_xp_history: 'История XP', prog_era_completion: 'Прохождение по Эпохам',
    prog_quiz_scores: 'Результаты Викторин', prog_achievements: 'Достижения',
    prog_skills_radar: 'Радар Навыков', prog_no_data: 'Пройдите уроки и викторины, чтобы увидеть прогресс.',
    prog_unlocked: 'Разблокировано', prog_locked: 'Заблокировано', prog_recent_activity: 'Недавняя Активность',
    prog_tab_overview: 'Обзор', prog_tab_achievements: 'Достижения', prog_tab_activity: 'Активность',
    sq_title: 'Умная Викторина', sq_subtitle: 'Адаптивные вопросы для ваших слабых мест',
    sq_adaptive_desc: 'Вопросы нацелены на слабые стороны', sq_questions_label: '15 Вопросов',
    sq_xp_desc: '+15 XP за правильный ответ · до +225 XP', sq_start: 'Начать Умную Викторину',
    sq_weak_title: 'Обнаруженные Слабые Места', sq_algorithm: 'Алгоритм приоритизирует эти области в этой сессии.',
    sq_no_weak: 'Слабые места ещё не обнаружены. Пройдите викторины по эпохам!',
    sq_stats_title: 'Ваша Статистика', sq_sessions: 'Сессий', sq_avg_score: 'Средний Балл',
    sq_best_score: 'Лучший Балл', sq_total_xp: 'Всего XP', sq_era_breakdown: 'Накопленный результат по Эпохам',
    sq_no_sessions: 'Сессий пока нет — пройдите первую Умную Викторину!',
    sq_correct_label: 'верно', sq_perf_era: 'Результаты по Эпохам',
    sq_new: 'Новая Сессия', sq_back_intro: 'Вернуться',
    sq_outstanding: '🏆 Отлично! Вы осваиваете историю.',
    sq_great: '✅ Хорошая работа! Продолжайте в том же духе.',
    sq_good: '📚 Неплохо — повторите слабые области.',
    sq_keep_going: '💡 Продолжайте учиться — каждая попытка делает вас сильнее.',
    essay_title: 'Эссе-Задание с ИИ', essay_subtitle: 'Напишите историческое эссе — Клио оценит его в реальном времени',
    essay_topic_label: 'Выберите Тему', essay_custom: 'Своя тема…',
    essay_write_label: 'Напишите эссе (80–600 слов)…', essay_words: 'слов',
    essay_grade_btn: 'Отправить на оценку', essay_new: 'Новое Эссе',
    essay_score: 'Общий Балл', essay_grade: 'Оценка', essay_xp: 'XP Получено',
    essay_feedback: 'Подробная Обратная Связь', essay_grading: 'Клио оценивает ваше эссе…',
    essay_master_only: 'Эссе-Задание доступно исключительно в плане Master Student.',
    vr_title: 'Видео-Задание', vr_subtitle: 'Смотри. Анализируй. Учись.',
    vr_watch: 'Смотреть Видео', vr_review_label: 'Напишите Обзор',
    vr_submit: 'Отправить Обзор', vr_grading: 'Клио оценивает ваш обзор…',
    vr_video_xp: 'Видео XP Получено', vr_next_in: 'Следующее видео через',
    vr_master_only: 'Только для плана Master Student', vr_available: 'Новое видео доступно!',
    vr_write_analysis: 'Напишите анализ, определив основной мотив или аргумент…',
    prof_title: 'Профиль', prof_overview: 'Обзор', prof_achievements: 'Достижения',
    prof_settings: 'Настройки', prof_chess_rank: 'Шахматный Ранг',
    prof_upload_photo: 'Загрузить Фото', prof_remove_photo: 'Удалить Фото',
    prof_save: 'Сохранить Изменения', prof_username: 'Имя пользователя', prof_email: 'Почта',
    prof_plan: 'Текущий план', prof_upgrade: 'Обновить', prof_member_since: 'Участник с',
    guide_title: 'Руководство', guide_subtitle: 'Всё, что нужно знать для работы с Historify',
    guide_features: '11 Функций', guide_quick_start: 'Быстрый Старт',
    guide_faq_title: 'Часто Задаваемые Вопросы', guide_start_lesson: 'Начать Урок',
    guide_see_plans: 'Посмотреть Планы', guide_cta_title: 'Готовы начать своё путешествие?',
    guide_cta_desc: 'Перейдите в Панель, чтобы увидеть прогресс, или сразу начните урок.',
    guide_dashboard: 'Панель', guide_start_learning: 'Начать учёбу', guide_step: 'Шаг',
    report_title: 'Сообщить об ошибке', report_subtitle: 'Помогите нам улучшить Historify',
    report_placeholder: 'Опишите проблему, с которой вы столкнулись…',
    report_submit: 'Отправить', report_thanks: 'Спасибо! Ваш отчёт получен.',
    report_type: 'Тип проблемы',
    pricing_title: 'Выберите свой учебный план', pricing_subtitle: 'От лёгкого изучения до мастерства — план для каждого.',
    pricing_current: 'Текущий план', pricing_select: 'Начать', pricing_month: '/мес',
    pricing_free_label: 'Бесплатно', pricing_back: 'Назад',
  },

  mk: {
    nav_dashboard: 'Контролна Табла', nav_eras: 'Епохи и Лекции', nav_timeline: 'Временска Линија',
    nav_tutor: 'ВИ Тутор', nav_leaderboard: 'Рангирање', nav_friends: 'Пријатели',
    nav_flashcards: 'Картички', nav_notes: 'Мои Белешки', nav_progress: 'Напредок',
    nav_smart_quiz: 'Паметен Квиз', nav_essay: 'Есеј Предизвик', nav_video_review: 'Видео Преглед',
    nav_profile: 'Профил', nav_guide: 'Водич за Апликацијата', nav_report: 'Пријави Проблем',
    nav_upgrade: 'Надгради го Планот', nav_logout: 'Одјави се',
    logout_title: 'Одјавување од Historify?', logout_desc: 'Твојот напредок е зачуван. Можеш да се најавиш повторно во секое време.',
    search_placeholder: 'Пребарај…', btn_start: 'Започни', btn_submit: 'Потврди',
    btn_next: 'Следно', btn_back: 'Назад', btn_save: 'Зачувај', btn_cancel: 'Откажи',
    btn_close: 'Затвори', btn_retry: 'Обиди се повторно', btn_new_session: 'Нова Сесија',
    btn_back_to_intro: 'Назад кон Вовед', btn_see_results: 'Погледни ги Резултатите',
    btn_next_question: 'Следно Прашање', btn_log_in: 'Најави се', btn_sign_up: 'Регистрирај се',
    btn_get_started: 'Почни', btn_upgrade: 'Надгради', btn_view: 'Погледни',
    btn_continue: 'Продолжи', btn_open: 'Отвори',
    lbl_you: 'Ти', lbl_level: 'Ниво', lbl_streak: 'Серија', lbl_xp: 'XP', lbl_pts: 'поени',
    streak_label: 'дена по ред', level_label: 'Ниво',
    dash_welcome: 'Добредојде,', dash_total_xp: 'Вкупно XP', dash_level: 'Ниво',
    dash_lessons_done: 'Завршени Лекции', dash_quiz_avg: 'Просечен Резултат',
    dash_daily: 'Дневен Предизвик', dash_continue: 'Продолжи со Учење',
    dash_next_lesson: 'Следна Лекција', dash_era_progress: 'Напредок по Епохи',
    dash_recent: 'Скорешна Активност', dash_no_activity: 'Сè уште нема скорешна активност.',
    dash_completed: 'завршено', dash_xp_label: 'XP',
    eras_title: 'Епохи и Лекции', eras_subtitle: 'Избери своја епоха и започни го патувањето',
    eras_lessons_label: 'лекции', eras_take_quiz: 'Направи Квиз за Епохата',
    eras_view_lessons: 'Прегледај Лекции', eras_locked: 'Заклучено', eras_completed: 'Завршено',
    eras_quiz_label: 'Квиз за Епоха', eras_lessons_count: 'лекции',
    lesson_key_facts: 'Клучни Факти', lesson_min_read: 'мин читање',
    lesson_complete_btn: 'Означи како Завршена', lesson_already_done: 'Лекцијата е Завршена',
    lesson_next: 'Следна Лекција', lesson_prev: 'Претходна Лекција',
    lesson_take_quiz: 'Направи Квиз за Епохата', lesson_discuss: 'Разговарај со Клио',
    lesson_notes_title: 'Мои Белешки',
    quiz_correct: 'Точно!', quiz_incorrect: 'Не е точно.', quiz_score: 'Резултат',
    quiz_xp_earned: 'XP освоено', quiz_performance_by_era: 'Резултати по Епохи',
    quiz_clio_rec: 'Препорака на Клио', quiz_clio_thinking: 'Клио размислува…',
    quiz_weak_areas: 'Откриени Слаби Области', quiz_no_weak_areas: 'Сè уште нема откриени слаби области.',
    quiz_adaptive: 'Адаптивен', quiz_earn_xp: 'Освои XP', quiz_questions: 'Прашања',
    quiz_era_title: 'Квиз', quiz_complete: 'Квизот е завршен', quiz_passed: 'Положено!',
    quiz_failed: 'Продолжи со вежбање', quiz_retake: 'Направи го повторно',
    quiz_submit_answer: 'Потврди Одговор', quiz_explanation: 'Објаснување', quiz_correct_label: 'точно',
    tl_title: 'Историска Временска Линија', tl_subtitle: 'Од 3100 г.п.н.е. до денес',
    tl_events: 'настани', tl_all_eras: 'Сите Епохи', tl_all_categories: 'Сите Категории',
    tl_open_lesson: 'Отвори Лекција',
    tutor_hello: 'Здраво, јас сум Клио!', tutor_desc: 'Јас сум Музата на Историјата — твој водич низ вековите. Прашај ме за секоја цивилизација, војна, откритие или епоха.',
    tutor_placeholder: 'Прашај ја Клио за секој историски момент…', tutor_new_chat: 'Нов Разговор',
    tutor_upgrade_msg: 'Надгради го планот за да го користиш ВИ Туторот',
    lb_title: 'Рангирање', lb_subtitle: 'Најдобри ученици рангирани по вкупно XP.',
    lb_your_rank: 'Твоето Рангирање', lb_full_rankings: 'Целосна Листа', lb_you: '(Ти)',
    lb_chess_rank: 'Шаховски Ранг', lb_level: 'Ниво', lb_streak: 'Серија',
    lb_xp_regular: 'Редовен XP', lb_xp_video: 'Видео XP', lb_score: 'Рангирачки Резултат',
    fr_title: 'Пријатели', fr_subtitle: 'Поврзи се со други ученици по историја',
    fr_search: 'Пребарај корисници…', fr_tab_friends: 'Пријатели', fr_tab_requests: 'Барања',
    fr_tab_sent: 'Испратени', fr_add: 'Додај Пријател', fr_pending: 'На чекање',
    fr_accept: 'Прифати', fr_decline: 'Одбиј', fr_remove: 'Отстрани',
    fr_no_friends: 'Сè уште нема пријатели. Пребарај корисници за да се поврзеш!',
    fr_no_requests: 'Нема дојдовни барања.', fr_no_sent: 'Нема испратени барања.',
    fr_request_sent: 'Барањето е испратено!', fr_added: 'Пријателот е додаден!',
    flash_title: 'Картички', flash_subtitle: 'Вежбај клучни термини од секоја лекција',
    flash_all_eras: 'Сите Епохи', flash_tap_flip: 'Допри за да превртиш',
    flash_knew: 'Го знаев', flash_review_again: 'Повтори повторно',
    flash_prev: 'Претходна', flash_next: 'Следна', flash_restart: 'Рестартирај го Шпилот',
    flash_progress: 'Напредок', flash_remaining: 'преостануваат',
    flash_known_label: 'Познато', flash_review_label: 'За повторување',
    flash_done: 'Шпилот е завршен!', flash_key_fact: 'Клучен Факт',
    notes_title: 'Мои Белешки', notes_subtitle: 'Белешките се зачувани по лекции — секогаш достапни',
    notes_placeholder: 'Напиши ги своите мисли, согледувања или резимеа овде…',
    notes_save: 'Зачувај Белешка', notes_saved: 'Белешката е зачувана!',
    notes_select: 'Избери лекција од листата за да ја видиш или уредиш белешката.',
    notes_empty: 'Не се пронајдени лекции.', notes_search: 'Пребарај лекции…',
    notes_all_eras: 'Сите Епохи', notes_words: 'зборови',
    prog_title: 'Напредок', prog_subtitle: 'Твоето патување на учење на прв поглед',
    prog_xp_total: 'Вкупно XP', prog_current_level: 'Тековно Ниво',
    prog_streak: 'Серија Денови', prog_lessons: 'Завршени Лекции',
    prog_xp_history: 'Историја на XP', prog_era_completion: 'Завршување по Епохи',
    prog_quiz_scores: 'Резултати од Квизови', prog_achievements: 'Достигнувања',
    prog_skills_radar: 'Радар на Вештини', prog_no_data: 'Заврши лекции и квизови за да го видиш напредокот.',
    prog_unlocked: 'Отклучено', prog_locked: 'Заклучено', prog_recent_activity: 'Скорешна Активност',
    prog_tab_overview: 'Преглед', prog_tab_achievements: 'Достигнувања', prog_tab_activity: 'Активност',
    sq_title: 'Паметен Квиз', sq_subtitle: 'Адаптивни прашања наменети за твоите слаби области',
    sq_adaptive_desc: 'Прашањата се насочени кон слабите точки', sq_questions_label: '15 Прашања',
    sq_xp_desc: '+15 XP за точен одговор · до +225 XP', sq_start: 'Започни Паметен Квиз',
    sq_weak_title: 'Откриени Слаби Области', sq_algorithm: 'Алгоритмот ќе ги приоритизира овие области во оваа сесија.',
    sq_no_weak: 'Сè уште нема открени слаби области. Заврши некои квизови за епохи!',
    sq_stats_title: 'Твоја Статистика', sq_sessions: 'Сесии', sq_avg_score: 'Просечен Резултат',
    sq_best_score: 'Најдобар Резултат', sq_total_xp: 'Вкупно XP', sq_era_breakdown: 'Кумулативен Резултат по Епохи',
    sq_no_sessions: 'Сè уште нема сесии — заврши го твојот прв Паметен Квиз!',
    sq_correct_label: 'точно', sq_perf_era: 'Резултати по Епохи',
    sq_new: 'Нова Сесија', sq_back_intro: 'Назад кон Вовед',
    sq_outstanding: '🏆 Извонредно! Ја совладуваш историјата.',
    sq_great: '✅ Одлична работа! Одржи го замавот.',
    sq_good: '📚 Добар напор — прегледај ги слабите области.',
    sq_keep_going: '💡 Продолжи со учење — секој обид те прави посилен.',
    essay_title: 'ВИ Есеј Предизвик', essay_subtitle: 'Напиши историски есеј — Клио го оценува во реално време',
    essay_topic_label: 'Избери Тема', essay_custom: 'Сопствена тема…',
    essay_write_label: 'Напиши го твојот есеј (80–600 зборови)…', essay_words: 'зборови',
    essay_grade_btn: 'Испрати за Оценување', essay_new: 'Нов Есеј',
    essay_score: 'Вкупен Резултат', essay_grade: 'Оценка', essay_xp: 'XP Освоено',
    essay_feedback: 'Детални Повратни Информации', essay_grading: 'Клио го оценува твојот есеј…',
    essay_master_only: 'Есеј Предизвикот е достапен исклучиво на планот Master Student.',
    vr_title: 'Видео Предизвик за Преглед', vr_subtitle: 'Гледај. Анализирај. Учи.',
    vr_watch: 'Гледај го Видеото', vr_review_label: 'Напиши го Прегледот',
    vr_submit: 'Испрати Преглед', vr_grading: 'Клио го оценува твојот преглед…',
    vr_video_xp: 'Освоено Видео XP', vr_next_in: 'Следното видео за',
    vr_master_only: 'Ексклузивно за планот Master Student', vr_available: 'Ново видео достапно!',
    vr_write_analysis: 'Напиши анализа со идентификување на главниот мотив или аргумент…',
    prof_title: 'Профил', prof_overview: 'Преглед', prof_achievements: 'Достигнувања',
    prof_settings: 'Поставки', prof_chess_rank: 'Шаховски Ранг',
    prof_upload_photo: 'Прикачи Фотографија', prof_remove_photo: 'Отстрани Фотографија',
    prof_save: 'Зачувај Промени', prof_username: 'Корисничко Име', prof_email: 'Е-пошта',
    prof_plan: 'Тековен план', prof_upgrade: 'Надгради', prof_member_since: 'Член од',
    guide_title: 'Водич за Апликацијата', guide_subtitle: 'Сè што треба да знаеш за да го извлечеш максимумот од Historify',
    guide_features: '11 Функции', guide_quick_start: 'Брз Старт',
    guide_faq_title: 'Често Поставувани Прашања', guide_start_lesson: 'Започни Лекција',
    guide_see_plans: 'Погледни Планови', guide_cta_title: 'Подготвен/а да го започнеш патувањето?',
    guide_cta_desc: 'Оди на Контролната Табла за да го видиш напредокот, или веднаш започни лекција.',
    guide_dashboard: 'Контролна Табла', guide_start_learning: 'Започни со Учење', guide_step: 'Чекор',
    report_title: 'Пријави Проблем', report_subtitle: 'Помогни ни да го подобриме Historify',
    report_placeholder: 'Опиши го проблемот со кој се сретна…',
    report_submit: 'Испрати Пријава', report_thanks: 'Благодариме! Твојата пријава е примена.',
    report_type: 'Вид на проблем',
    pricing_title: 'Избери го твојот план за учење', pricing_subtitle: 'Од лесно истражување до напредно учење — план за секој ученик.',
    pricing_current: 'Тековен план', pricing_select: 'Почни', pricing_month: '/месец',
    pricing_free_label: 'Бесплатно', pricing_back: 'Назад',
  },
};
