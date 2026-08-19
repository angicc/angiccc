export type Language = 'en' | 'es' | 'ru' | 'mk' | 'de' | 'fr';

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
  mk: 'Македонски',
  de: 'Deutsch',
  fr: 'Français',
};

import { DE_OVERRIDES, FR_OVERRIDES } from './translationsDeFr';
import { DE_OVERRIDES_2, FR_OVERRIDES_2 } from './translationsDeFr2';

export type TranslationKeys = {
  // ── Sidebar / Nav ──────────────────────────────────────────────
  nav_dashboard: string; nav_eras: string; nav_timeline: string; nav_tutor: string;
  nav_leaderboard: string; nav_friends: string; nav_flashcards: string; nav_notes: string;
  nav_progress: string; nav_smart_quiz: string; nav_essay: string; nav_video_review: string;
  nav_debate: string;
  nav_crisis: string;
  nav_imperium: string;
  // ── Chronos Crisis Room ───────────────────────────────────────
  crisis_title: string; crisis_subtitle: string; crisis_back: string;
  crisis_begin: string; crisis_abandon: string; crisis_placeholder: string; crisis_master_only: string;
  crisis_turn: string; crisis_stability: string; crisis_legitimacy: string; crisis_legacy: string;
  crisis_decisions: string; crisis_verdict: string;
  crisis_dc: string; crisis_mr: string; crisis_treasury: string; crisis_consequence: string;
  crisis_risk_low: string; crisis_risk_med: string; crisis_risk_high: string;
  // ── Chronos Strategic Assessment ──────────────────────────────
  crisis_assess_title: string; crisis_assess_cta: string; crisis_assess_sub: string;
  crisis_assess_loading: string; crisis_assess_score: string; crisis_assess_xp: string;
  crisis_assess_m_foresight: string; crisis_assess_m_judgment: string; crisis_assess_m_stewardship: string;
  crisis_assess_m_decisiveness: string; crisis_assess_m_adaptability: string;
  crisis_assess_strengths: string; crisis_assess_improve: string;
  crisis_assess_counterfactual: string; crisis_assess_rerun: string;
  nav_profile: string; nav_guide: string; nav_report: string;
  nav_upgrade: string; nav_logout: string;
  nav_group_chronicles: string; nav_group_academy: string; nav_group_agora: string; nav_group_ledger: string;
  notif_title: string; notif_empty: string;
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
  daily_submit: string; daily_correct: string; daily_wrong: string; daily_tomorrow: string;
  achievement_unlocked: string;
  difficulty_easy: string; difficulty_medium: string; difficulty_hard: string;
  era_short_prehistoric: string; era_short_byzantine: string; era_short_ancient: string; era_short_medieval: string; era_short_earlymod: string; era_short_modern: string;
  // ── Eras ───────────────────────────────────────────────────────
  eras_title: string; eras_subtitle: string; eras_lessons_label: string;
  eras_take_quiz: string; eras_view_lessons: string; eras_locked: string;
  eras_completed: string; eras_quiz_label: string; eras_lessons_count: string;
  // ── Lesson ─────────────────────────────────────────────────────
  lesson_key_facts: string; lesson_min_read: string; lesson_complete_btn: string;
  lesson_already_done: string; lesson_next: string; lesson_prev: string; toast_lesson_complete: string; toast_bookmarked: string; toast_bookmark_removed: string;
  lesson_take_quiz: string; lesson_discuss: string; lesson_notes_title: string;
  lesson_bookmarked: string; lesson_save: string; lesson_eras_breadcrumb: string;
  // ── Quiz ───────────────────────────────────────────────────────
  quiz_correct: string; quiz_incorrect: string; quiz_score: string; quiz_xp_earned: string;
  quiz_performance_by_era: string; quiz_clio_rec: string; quiz_clio_thinking: string;
  quiz_weak_areas: string; quiz_no_weak_areas: string;
  quiz_adaptive: string; quiz_earn_xp: string; quiz_questions: string;
  quiz_era_title: string; quiz_complete: string; quiz_passed: string; quiz_failed: string;
  quiz_retake: string; quiz_submit_answer: string; quiz_explanation: string;
  quiz_correct_label: string;
  quiz_test_knowledge: string; quiz_passing_score: string; quiz_question_of: string;
  quiz_upgrade_explanations: string; quiz_not_found: string;
  sq_clio_fallback: string; sq_upgrade_desc: string;
  sq_plan_title: string; sq_plan_focus: string; sq_plan_steps: string;
  sq_plan_forecast: string; sq_plan_master: string; sq_plan_min: string; sq_plan_open: string;
  // ── Timeline ───────────────────────────────────────────────────
  tl_title: string; tl_subtitle: string; tl_events: string;
  tl_all_eras: string; tl_all_categories: string; tl_open_lesson: string;
  tl_major: string; tl_free_only: string; tl_filter_title: string; tl_filter_desc: string;
  tl_lesson_locked: string; tl_lesson_locked_pro: string; tl_go_to: string; tl_explore_era: string;
  // Category labels
  cat_war: string; cat_politics: string; cat_science: string; cat_culture: string; cat_religion: string; cat_exploration: string;
  // ── AI Tutor ───────────────────────────────────────────────────
  tutor_hello: string; tutor_desc: string; tutor_placeholder: string; tutor_examples: string;
  tutor_attach_image: string; tutor_image_ready: string;
  tutor_history: string; tutor_thread_first: string; tutor_thread_untitled: string;
  tutor_new_chat: string; tutor_upgrade_msg: string;
  tutor_clear_title: string; tutor_clear_confirm: string;
  // ── Leaderboard ────────────────────────────────────────────────
  lb_title: string; lb_subtitle: string; lb_your_rank: string;
  lb_full_rankings: string; lb_you: string; lb_chess_rank: string;
  lb_level: string; lb_streak: string; lb_xp_regular: string; lb_xp_video: string; lb_score: string;
  // ── Friends ────────────────────────────────────────────────────
  fr_title: string; fr_subtitle: string; fr_search: string;
  fr_tab_friends: string; fr_tab_requests: string; fr_tab_sent: string;
  fr_add: string; fr_pending: string; fr_accept: string; fr_decline: string;
  // ── Friends: messaging + History 1v1 duel ─────────────────────
  fr_message: string; fr_duel: string; fr_msg_title: string; fr_msg_placeholder: string;
  fr_msg_empty: string; fr_msg_send: string;
  fr_find_users: string;
  fr_no_results: string;
  fr_toast_request_sent: string;
  fr_toast_request_failed: string;
  fr_wants_to_be_friend: string;
  fr_cancel_request: string;
  fr_net_signin: string;
  fr_net_local: string;
  fr_toast_now_friend: string;
  fr_toast_declined: string;
  fr_toast_removed: string;
  fr_request_pending: string;
  fr_online: string;
  fr_streak_word: string;
  fr_unread: string;
  fr_gift_failed: string;
  fr_net_live: string;
  fr_net_offline: string;
  fr_tab_activity: string;
  fr_activity_empty: string;
  fr_act_added: string;
  fr_act_duel_win: string;
  fr_act_duel_loss: string;
  fr_act_message: string;
  fr_act_gift: string;
  fr_act_lesson: string;
  fr_act_quiz: string;
  fr_act_streak: string;
  fr_act_xp: string;
  fr_act_simulated: string;
  fr_act_sim_short: string;
  fr_time_now: string;
  unit_min_short: string;
  unit_hour_short: string;
  unit_day_short: string;
  fr_reply_1: string;
  fr_reply_2: string;
  fr_reply_3: string;
  fr_reply_4: string;
  fr_reply_5: string;
  fr_reply_6: string;
  fr_reply_7: string;
  fr_duel_title: string; fr_duel_begin: string; fr_duel_youhit: string; fr_duel_foehit: string;
  fr_duel_clash: string; fr_duel_miss: string; fr_duel_victory: string; fr_duel_defeat: string;
  fr_duel_won_desc: string; fr_duel_lost_desc: string; fr_duel_done: string; fr_duel_record: string;
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
  notes_new_note: string; notes_deleted: string; notes_none: string; notes_none_filter: string; notes_hint: string; notes_untitled: string; notes_count: string;
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
  sq_stats_title: string; sq_history_title: string; sq_history_open: string; sq_duration: string; sq_history_back: string; sq_sessions: string; sq_avg_score: string;
  sq_best_score: string; sq_total_xp: string; sq_era_breakdown: string;
  sq_no_sessions: string; sq_correct_label: string;
  sq_perf_era: string; sq_new: string; sq_back_intro: string;
  sq_outstanding: string; sq_great: string; sq_good: string; sq_keep_going: string;
  sq_questions_desc: string; sq_correct_xp: string;
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
  guide_free_pro: string; guide_qs_desc: string;
  // ── Report ─────────────────────────────────────────────────────
  report_title: string; report_subtitle: string; report_placeholder: string;
  report_submit: string; report_thanks: string; report_type: string;
  // ── Pricing ────────────────────────────────────────────────────
  pricing_title: string; pricing_subtitle: string; pricing_current: string;
  pricing_guarantee: string;
  gift_btn: string; gift_title: string; gift_desc: string; gift_send: string;
  gift_sent: string; gift_reward_badge: string;
  pricing_select: string; pricing_month: string; pricing_free_label: string;
  pricing_trial_note: string;
  pricing_back: string;
  // ── Philosopher Debate ─────────────────────────────────────────
  debate_title: string; debate_subtitle: string; debate_today: string;
  debate_xp_reward: string; debate_placeholder: string; debate_new_round: string;
  debate_pro_only: string; debate_won_title: string; debate_won_desc: string;
  debate_already_won: string; debate_next_in: string; debate_starters: string;
  debate_start_arg: string;
  debate_continue_btn: string;
  // ── AI Tutor extended ─────────────────────────────────────────
  tutor_subtitle: string;
  sugg_1: string; sugg_2: string; sugg_3: string; sugg_4: string; sugg_5: string; sugg_6: string;
  // ── Essay extended ────────────────────────────────────────────
  essay_tip_1: string; essay_tip_2: string; essay_tip_3: string; essay_tip_4: string;
  essay_score_breakdown: string; essay_strong_points: string; essay_missing_points: string;
  essay_accuracy: string; essay_argument_quality: string; essay_depth_detail: string;
  essay_overall: string; essay_study_more: string; essay_your_essay: string;
  // ── Progress extended ─────────────────────────────────────────
  prog_lessons_by_era: string; prog_analysis_title: string; prog_analysis_passes: string; prog_analysis_avg: string; prog_analysis_best: string; prog_analysis_empty: string; prog_time_title: string; prog_time_total: string; prog_momentum_title: string; prog_momentum_active: string; prog_quiz_by_era: string; prog_knowledge_radar: string;
  prog_xp_timeline: string; prog_radar_desc: string; prog_adv_analytics_title: string;
  prog_adv_analytics_desc: string; prog_no_quiz: string; prog_no_xp: string;
  prog_quiz_score_chart: string; prog_xp_activity_graph: string; prog_knowledge_radar_chart: string;
  prog_upgrade_cta: string;
  // Sidebar / common extras
  sidebar_streak: string;
  // Pricing extras
  pricing_faq: string; pricing_cur_btn: string; pricing_upgrade_to: string;
  pricing_downgrade_free: string; pricing_switch_to: string;
  // Pricing FAQ
  pricing_faq_q1: string; pricing_faq_a1: string;
  pricing_faq_q2: string; pricing_faq_a2: string;
  pricing_faq_q3: string; pricing_faq_a3: string;
  pricing_faq_q4: string; pricing_faq_a4: string;
  pricing_price_free: string;
  // Report page details
  report_cat_bug: string; report_cat_bug_desc: string;
  report_cat_feature: string; report_cat_feature_desc: string;
  report_cat_content: string; report_cat_content_desc: string;
  report_cat_other: string; report_cat_other_desc: string;
  report_pri_low: string; report_pri_medium: string; report_pri_high: string;
  report_category_label: string; report_category_hint: string;
  report_priority_label: string; report_priority_hint: string;
  report_subject_label: string; report_subject_hint: string;
  report_desc_label: string; report_desc_hint: string;
  report_submit_btn: string; report_submitting: string;
  report_submitted_title: string; report_submitted_msg: string;
  report_another: string; report_priority_badge: string;
  // Profile extras
  prof_bookmarks: string; prof_no_bookmarks: string; prof_no_bookmarks_hint: string;
  prof_historical_rank: string; prof_change_plan: string;
  prof_danger_zone: string;
  prof_reset_title: string; prof_reset_desc: string;
  prof_reset_confirm: string; prof_reset_confirm_desc: string; prof_reset_yes: string;
  prof_toast_image_too_big: string;
  prof_toast_image_bad_type: string;
  prof_toast_avatar_set: string;
  prof_toast_avatar_removed: string;
  prof_toast_name_short: string;
  prof_toast_name_saved: string;
  prof_toast_email_invalid: string;
  prof_toast_email_saved: string;
  prof_toast_email_failed: string;
  prof_toast_pwd_short: string;
  prof_toast_pwd_mismatch: string;
  prof_toast_pwd_saved: string;
  prof_toast_pwd_failed: string;
  prof_toast_2fa_code: string;
  prof_toast_2fa_on: string;
  prof_toast_2fa_off: string;
  prof_toast_pref_saved: string;
  prof_toast_reset: string;
  prof_toast_pdf_soon: string;
  prof_inspired_by: string;
  prof_video_xp: string;
  prof_next_rank_in: string;
  prof_max_rank: string;
  prof_renews: string;
  prof_download_notes: string;
  prof_demo_secret: string;
  prof_rhythm_title: string;
  prof_rhythm_days_studied: string;
  prof_rhythm_empty: string;
  prof_rhythm_less: string;
  prof_rhythm_more: string;
  prof_rhythm_this_week: string;
  prof_records_title: string;
  prof_rec_total_time: string;
  prof_rec_longest_streak: string;
  prof_rec_days: string;
  prof_rec_best_quiz: string;
  prof_rec_favourite_era: string;
  prof_rec_perfect_quizzes: string;
  prof_rec_best_day: string;
  prof_milestones_title: string;
  unit_day_one: string;
  unit_day_few: string;
  unit_day_many: string;
  streak_start_today: string;
  level_short: string;
  level_xp_to: string;
  // Flashcards extras
  flash_shuffle: string; flash_answer: string; flash_no_cards: string;
  // Profile reset button
  prof_reset_btn: string;
  // Profile Settings section
  prof_picture: string; prof_change_photo: string; prof_upload_photo_btn: string; prof_remove_photo_btn: string;
  prof_display_name: string; prof_save_btn: string;
  prof_change_email: string; prof_current_email: string; prof_new_email: string; prof_cur_password: string; prof_update_email: string; prof_updating: string;
  prof_change_password: string; prof_new_password: string; prof_confirm_password: string; prof_update_password: string;
  prof_min_chars: string; prof_repeat_pwd: string;
  prof_2fa_title: string; prof_2fa_enabled_msg: string; prof_2fa_disabled_msg: string;
  prof_2fa_enabled_desc: string; prof_2fa_disabled_desc: string;
  prof_2fa_disable: string; prof_2fa_enable: string;
  prof_notif_title: string; prof_notif_reminders: string; prof_notif_reminders_desc: string;
  prof_notif_achievements: string; prof_notif_achievements_desc: string;
  prof_notif_weekly: string; prof_notif_weekly_desc: string;
  prof_dark_mode: string;
  prof_setup_2fa: string; prof_2fa_scan: string; prof_2fa_enter_code: string; prof_2fa_verify: string; prof_2fa_backup: string;
  // Map feature
  map_key_locations: string;
  map_zoom_hint: string;
  // Timeline Territory Map
  nav_timeline_map: string;
  tmap_title: string;
  tmap_subtitle: string;
  tmap_select_topic: string;
  tmap_layers: string; tmap_style: string; tmap_explore: string; tmap_story: string; tmap_quiz: string;
  tmap_layer_territory: string; tmap_layer_capitals: string; tmap_layer_cities: string;
  tmap_layer_battles: string; tmap_layer_ports: string; tmap_layer_resources: string; tmap_layer_routes: string;
  tmap_style_dark: string; tmap_style_parchment: string; tmap_style_military: string;
  tmap_style_terrain: string; tmap_style_clean: string; tmap_style_satellite: string;
  tmap_quiz_q: string; tmap_quiz_correct: string; tmap_quiz_wrong: string;
  tmap_quiz_xp: string; tmap_quiz_next: string; tmap_quiz_score: string;
  tmap_story_play: string; tmap_story_pause: string; tmap_story_prev: string; tmap_story_next: string;
  tmap_markers: string; tmap_period: string;
  tmap_perspective: string; tmap_perspective_all: string; tmap_perspective_military: string;
  tmap_perspective_trade: string; tmap_perspective_scholar: string;
  tmap_year: string; tmap_what_if: string; tmap_pro_only: string;
  tmap_what_if_desc: string; tmap_year_range: string; tmap_animate: string;
  tmap_causality: string; tmap_territories_hint: string;
  // Essay extras
  essay_select_topic: string;
  essay_write_more: string;
  essay_too_long: string;
  // ── Login page ────────────────────────────────────────────────
  login_title: string; login_desc: string;
  login_email: string; login_password: string;
  login_signing_in: string; login_btn: string;
  login_no_account: string; login_create: string;
  login_err_email: string; login_err_pass: string; login_failed: string;
  // ── Register page ─────────────────────────────────────────────
  reg_title: string; reg_desc: string;
  reg_username: string; reg_email: string; reg_pass: string; reg_confirm: string;
  reg_creating: string; reg_btn: string;
  reg_have_account: string; reg_sign_in: string;
  reg_err_username_min: string; reg_err_username_max: string; reg_err_username_chars: string;
  reg_err_email: string; reg_err_pass_min: string; reg_err_pass_match: string;
  reg_failed: string;
  reg_placeholder_username: string; reg_placeholder_pass: string; reg_placeholder_confirm: string;
  // ── Auth errors ───────────────────────────────────────────────
  auth_no_account: string;
  // ── Essay extras ──────────────────────────────────────────────
  essay_grading_sub: string;
  essay_graded: string;
  essay_grade_fail: string;
  essay_custom_placeholder: string;
  // ── AI gateway errors ─────────────────────────────────────────
  ai_err_title: string; ai_err_config: string; ai_err_network: string;
  ai_err_rate: string; ai_err_server: string; ai_err_generic: string; ai_err_reconnect: string;
  // ── Tactical map (filters / fog / telemetry / annotations) ────
  tmap_cat_assets: string; tmap_cat_diplomatic: string; tmap_cat_resources: string; tmap_cat_enemy: string;
  tmap_annotate: string; tmap_ann_pin: string; tmap_ann_draw: string; tmap_ann_clear: string; tmap_ann_pin_default: string;
  tmap_fog_locked: string; tmap_fog_scouted: string;
  tmap_tel_faction: string; tmap_tel_garrison: string; tmap_tel_resources: string;
  tmap_tel_hazard: string; tmap_tel_battles: string; tmap_tel_none: string;
  tmap_timeline: string; year_bce: string; year_ce: string;
  tmap_hazard_dust: string; tmap_hazard_frost: string; tmap_hazard_storm: string; tmap_hazard_scorched: string;
  // ── Territory Conquest Campaign ────────────────────────────────
  tmap_campaign: string; tmap_camp_subtitle: string; tmap_camp_select: string;
  tmap_camp_stage: string; tmap_camp_question: string; tmap_camp_start: string;
  tmap_camp_retry: string; tmap_camp_continue: string; tmap_camp_conquered: string;
  tmap_camp_locked: string; tmap_camp_victory: string; tmap_camp_defeat: string;
  tmap_camp_progress: string; tmap_camp_stars: string; tmap_camp_rank: string;
  tmap_camp_rank_1: string; tmap_camp_rank_2: string; tmap_camp_rank_3: string;
  tmap_camp_rank_4: string; tmap_camp_rank_5: string;
  tmap_camp_legendary: string; tmap_camp_legendary_hint: string;
  tmap_camp_xp: string; tmap_camp_era_locked: string; tmap_camp_no_questions: string;
  tmap_genq_belong: string; tmap_genq_period: string; tmap_genq_exp: string;
  tmap_camp_foe: string; tmap_camp_your_army: string; tmap_camp_enemy_army: string;
  tmap_unit_infantry: string; tmap_unit_archers: string; tmap_unit_cavalry: string;
  // ── Territory Conquest battle arena ───────────────────────────
  tmap_battle_brief: string; tmap_battle_start: string; tmap_battle_round: string;
  tmap_battle_hit: string; tmap_battle_counter: string; tmap_battle_won: string;
  tmap_battle_lost: string; tmap_battle_correct: string; tmap_battle_left: string;
  tmap_chokepoint: string;
  // ── Progress achievements summary ──────────────────────────────
  prog_ach_summary: string; prog_ach_remaining: string;
  // ── Search dialog ──────────────────────────────────────────────
  search_no_results: string; search_min_chars: string;
  // ── Clio memory / AI Studio / Study Plan ──────────────────────
  mem_title: string; mem_empty: string; mem_interests: string; mem_strengths: string;
  mem_misconceptions: string; mem_facts: string; mem_sessions: string; mem_resolved: string;
  mem_clear: string; mem_clear_confirm_title: string; mem_clear_confirm_desc: string;
  nav_studio: string; nav_study_plan: string;
  studio_title: string; studio_subtitle: string; studio_gate_desc: string;
  studio_paste_label: string; studio_paste_placeholder: string; studio_source_too_short: string;
  studio_focus_label: string; studio_focus_placeholder: string;
  studio_questions_label: string; studio_cards_label: string;
  studio_generation_failed: string; studio_generating: string; studio_generate: string;
  studio_checking: string;
  studio_quality_clean: string;
  studio_quality_title: string;
  studio_quality_short: string;
  studio_quality_hint: string;
  studio_issue_ungrounded: string;
  studio_issue_invented: string;
  studio_issue_duplicate: string;
  studio_issue_length_bias: string;
  studio_issue_script: string;
  studio_my_sets: string; studio_no_sets: string; studio_delete_set: string;
  studio_flashcards: string; studio_questions: string; studio_best: string;
  studio_practice: string; studio_review_cards: string;
  studio_review_title: string; studio_review_subtitle: string; studio_kept: string;
  studio_summary: string; studio_facts: string; studio_set_name: string;
  studio_discard: string; studio_save_set: string;
  studio_practice_score: string; studio_done: string; studio_show_answer: string; studio_next_card: string;
  path_title: string; path_subtitle: string; path_mastery_title: string; path_focus: string;
  path_lessons_done: string; path_quiz_score: string; path_adaptive_acc: string;
  path_generate: string; path_regenerate: string; path_refresh: string; path_refreshed: string; path_enhance: string; path_enhancing: string;
  path_enhance_upsell: string; path_done_of: string; path_deep_analysis: string;
  path_day: string; path_empty: string;
  path_step_lesson: string; path_step_quiz: string; path_step_smart_quiz: string;
  path_step_flashcards: string; path_step_studio: string; path_step_crisis: string; path_step_map: string;
  path_min: string; path_mark_done: string;
  path_rhythm_title: string; path_rhythm_active: string; path_rhythm_session: string;
  path_rhythm_scheduled: string; path_rhythm_no_data: string;
  path_days_label: string; path_min_per_day: string; path_returning: string;
  path_mode_coverage: string; path_mode_retention: string; path_mode_balanced: string;
  path_mode_coverage_why: string; path_mode_retention_why: string; path_mode_balanced_why: string;
  path_stale_title: string; path_stale_complete: string; path_stale_expired: string;
  path_stale_days_old: string; path_stale_focus: string;
  // ── Philosopher memory / Flashcards gate / Battle tactics ─────
  pmem_title: string; pmem_empty: string; pmem_debates: string; pmem_wins: string;
  pmem_stances: string; pmem_concessions: string; pmem_strong: string; pmem_style: string;
  pmem_clear: string; pmem_clear_title: string; pmem_clear_desc: string;
  flash_gate_desc: string;
  tmap_battle_brief2: string; tmap_battle_council: string; tmap_battle_order: string;
  tmap_battle_rout: string; tmap_battle_crit: string; tmap_battle_advantage: string;
  tmap_battle_outmaneuvered: string; tmap_battle_morale: string;
  tmap_tactic_charge: string; tmap_tactic_volley: string; tmap_tactic_hold: string;
  tmap_tactic_charge_hint: string; tmap_tactic_volley_hint: string; tmap_tactic_hold_hint: string;
};

type Translations = Record<Language, TranslationKeys>;

const EN: TranslationKeys = {
    // Nav
    nav_dashboard: 'Dashboard', nav_eras: 'Eras & Lessons', nav_timeline: 'Timeline',
    nav_tutor: 'AI Tutor', nav_leaderboard: 'Leaderboard', nav_friends: 'Friends',
    nav_flashcards: 'Flashcards', nav_notes: 'My Notes', nav_progress: 'Progress',
    nav_smart_quiz: 'Smart Quiz', nav_essay: 'Essay Challenge', nav_video_review: 'Video Review',
    nav_debate: 'Debate a Philosopher',
    nav_crisis: 'Crisis Room',
    nav_imperium: 'Chronos Imperium',
    crisis_title: 'Chronos Crisis Room',
    crisis_subtitle: 'Step into a historical turning point and make the decisions yourself',
    crisis_back: 'All scenarios',
    crisis_begin: 'Begin the simulation',
    crisis_abandon: 'Abandon timeline',
    crisis_placeholder: 'Type your decision — pick an option or forge your own path…',
    crisis_master_only: 'The Chronos Crisis Room is exclusive to the Master Student plan — full counterfactual simulations with real-time AI evaluation.',
    crisis_turn: 'Turn', crisis_stability: 'Stability', crisis_legitimacy: 'Legitimacy', crisis_legacy: 'Legacy',
    crisis_decisions: 'Decision log', crisis_verdict: 'Final verdict',
    crisis_dc: 'Diplomatic Capital', crisis_mr: 'Military Readiness', crisis_treasury: 'Treasury', crisis_consequence: 'Consequence',
    crisis_risk_low: 'Low', crisis_risk_med: 'Medium', crisis_risk_high: 'High',
    crisis_assess_title: 'Strategic Assessment', crisis_assess_cta: 'Request Strategic Assessment', crisis_assess_sub: 'The Chronos Tribunal grades your entire command run across five dimensions',
    crisis_assess_loading: 'The Tribunal is deliberating…', crisis_assess_score: 'Command Score', crisis_assess_xp: 'XP earned',
    crisis_assess_m_foresight: 'Strategic Foresight', crisis_assess_m_judgment: 'Historical Judgment', crisis_assess_m_stewardship: 'Resource Stewardship',
    crisis_assess_m_decisiveness: 'Decisiveness', crisis_assess_m_adaptability: 'Adaptability',
    crisis_assess_strengths: 'Strengths', crisis_assess_improve: 'Improvements',
    crisis_assess_counterfactual: 'What History Did', crisis_assess_rerun: 'Reconvene the Tribunal',
    nav_profile: 'Profile', nav_guide: 'App Guide', nav_report: 'Report a Problem',
    nav_upgrade: 'Upgrade Plan', nav_logout: 'Log Out',
    nav_group_chronicles: 'Chronicles', nav_group_academy: 'Academy', nav_group_agora: 'Agora', nav_group_ledger: 'Ledger',
    notif_title: 'Notifications', notif_empty: 'Nothing new — keep your streak alive today!',
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
    daily_submit: 'Submit Answer', daily_correct: 'Correct! +15 XP',
    daily_wrong: 'Correct answer:', daily_tomorrow: 'Come back tomorrow for a new challenge!',
    achievement_unlocked: 'Achievement Unlocked!',
    difficulty_easy: 'Easy', difficulty_medium: 'Medium', difficulty_hard: 'Hard',
    era_short_prehistoric: 'Prehistory', era_short_byzantine: 'Byzantium', era_short_ancient: 'Ancient', era_short_medieval: 'Medieval', era_short_earlymod: 'Early Modern', era_short_modern: 'Modern',
    // Eras
    eras_title: 'Eras & Lessons', eras_subtitle: 'Choose your era and begin your journey',
    eras_lessons_label: 'lessons', eras_take_quiz: 'Take Era Quiz',
    eras_view_lessons: 'View Lessons', eras_locked: 'Locked', eras_completed: 'Completed',
    eras_quiz_label: 'Era Quiz', eras_lessons_count: 'lessons',
    // Lesson
    lesson_key_facts: 'Key Facts', lesson_min_read: 'min read',
    lesson_complete_btn: 'Mark as Complete', lesson_already_done: 'Lesson Complete', toast_lesson_complete: 'Lesson complete! +{xp} XP', toast_bookmarked: 'Lesson bookmarked!', toast_bookmark_removed: 'Bookmark removed.',
    lesson_next: 'Next Lesson', lesson_prev: 'Previous Lesson',
    lesson_take_quiz: 'Take Era Quiz', lesson_discuss: 'Discuss with Clio',
    lesson_notes_title: 'My Notes',
    lesson_bookmarked: 'Bookmarked', lesson_save: 'Save Lesson', lesson_eras_breadcrumb: 'Eras',
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
    quiz_test_knowledge: 'Test your knowledge of {era}',
    quiz_passing_score: 'Passing score: {score}% · Max XP: {xp}',
    quiz_question_of: 'Question {n} of {total}',
    quiz_upgrade_explanations: 'Upgrade to Pro to see answer explanations.',
    quiz_not_found: 'Quiz not found.',
    sq_clio_fallback: 'Great effort! Focus on reviewing the eras where you struggled and retry those lessons for maximum growth.',
    sq_plan_title: "Clio's Study Plan", sq_plan_focus: 'Focus areas', sq_plan_steps: 'Your 3-step plan',
    sq_plan_forecast: 'Next-session forecast', sq_plan_master: 'Misconception analysis', sq_plan_min: 'min', sq_plan_open: 'Open lesson',
    sq_upgrade_desc: 'Smart Quiz uses an adaptive algorithm that targets your weakest eras and calibrates difficulty to your performance level. Available on Pro Learner and above.',
    // Timeline
    tl_title: 'Historical Timeline', tl_subtitle: 'From 3100 BCE to the present day',
    tl_events: 'events', tl_all_eras: 'All Eras', tl_all_categories: 'All Categories',
    tl_open_lesson: 'Open Lesson',
    // AI Tutor
    tutor_hello: "Hello, I'm Clio — your guide through history!", tutor_examples: 'Or load an example dialogue',
    tutor_history: 'History', tutor_thread_first: 'First conversation', tutor_thread_untitled: 'New conversation', tutor_desc: "Welcome! I'm the Muse of History, here to make the past click for you. Ask me anything — a battle, an empire, a strange custom, or \"why did this happen?\" — and I'll explain it clearly, connect it to the bigger picture, and help you remember it. New here? Try a suggestion below, revisit a lesson with me, or just tell me what you're curious about.",
    tutor_placeholder: 'Ask Clio about any moment in history…', tutor_new_chat: 'New Chat',
    tutor_attach_image: 'Attach an image', tutor_image_ready: 'Image ready — send it to Clio',
    tutor_clear_title: 'Clear this conversation', tutor_clear_confirm: 'Clear this conversation? The messages will be permanently deleted from this thread.',
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
    fr_message: 'Message', fr_duel: 'History 1v1', fr_msg_title: 'Chat with {name}', fr_msg_placeholder: 'Write a message…',
    fr_msg_empty: 'Say hello — or challenge them to a History 1v1!', fr_msg_send: 'Send',
    fr_find_users: 'Find users',
    fr_no_results: 'No users found matching',
    fr_toast_request_sent: 'Friend request sent',
    fr_toast_request_failed: 'That didn\'t work — please try again.',
    fr_wants_to_be_friend: 'Wants to be your friend',
    fr_cancel_request: 'Cancel',
    fr_net_signin: 'Sign in to connect with other learners',
    fr_net_local: 'Demo friends — not connected to a server',
    fr_toast_now_friend: 'New friend added',
    fr_toast_declined: 'Request declined',
    fr_toast_removed: 'Friend removed',
    fr_request_pending: 'Request pending',
    fr_online: 'Online',
    fr_streak_word: 'Streak',
    fr_unread: 'Unread messages',
    fr_gift_failed: 'Gift failed.',
    fr_net_live: 'Live · server connected',
    fr_net_offline: 'Offline mode · saved locally',
    fr_tab_activity: 'Activity',
    fr_activity_empty: 'Nothing has happened yet — add a friend to see their activity here.',
    fr_act_added: 'became your friend',
    fr_act_duel_win: 'you won a duel',
    fr_act_duel_loss: 'you lost a duel',
    fr_act_message: 'messages exchanged',
    fr_act_gift: 'you sent a gift',
    fr_act_lesson: 'completed a lesson',
    fr_act_quiz: 'scored on a quiz',
    fr_act_streak: 'is on a streak',
    fr_act_xp: 'reached',
    fr_act_simulated: 'Simulated activity — these friends have no server behind them',
    fr_act_sim_short: 'sim',
    fr_time_now: 'just now',
    unit_min_short: 'm',
    unit_hour_short: 'h',
    unit_day_short: 'd',
    fr_reply_1: 'Good luck in your next duel! ⚔️',
    fr_reply_2: 'Did you finish the Viking Age lesson yet?',
    fr_reply_3: 'I just hit a 7-day streak 🔥',
    fr_reply_4: 'That Gaugamela crisis is brutal. How did you do?',
    fr_reply_5: 'Race you to the top of the leaderboard!',
    fr_reply_6: 'Rome or Greece — which era is your favourite?',
    fr_reply_7: 'Challenge me to a History 1v1 whenever you\'re ready.',
    fr_duel_title: 'History 1v1', fr_duel_begin: 'Begin the duel', fr_duel_youhit: 'You strike true!', fr_duel_foehit: '{name} lands a blow!',
    fr_duel_clash: 'Blades clash — both wounded!', fr_duel_miss: 'Both swings go wide!', fr_duel_victory: 'Victory!', fr_duel_defeat: 'Defeated',
    fr_duel_won_desc: 'You bested {name} on {field}.', fr_duel_lost_desc: '{name} won this time. Rematch when you\'re ready.', fr_duel_done: 'Leave arena', fr_duel_record: 'Duel record',
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
    notes_new_note: 'New Note', notes_deleted: 'Note deleted.', notes_none: 'No notes yet', notes_none_filter: 'No notes for this era', notes_hint: 'Click "+ New Note" to capture your thoughts as you learn.', notes_untitled: 'Untitled Note', notes_count: 'notes saved',
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
    sq_stats_title: 'Your Statistics', sq_history_title: 'Session History', sq_history_open: 'View every session', sq_duration: 'Duration', sq_history_back: 'Back to Smart Quiz', sq_sessions: 'Sessions', sq_avg_score: 'Avg Score',
    sq_best_score: 'Best Score', sq_total_xp: 'Total XP', sq_era_breakdown: 'Cumulative Era Performance',
    sq_no_sessions: 'No sessions yet — complete your first Smart Quiz!',
    sq_correct_label: 'correct', sq_perf_era: 'Performance by Era',
    sq_new: 'New Session', sq_back_intro: 'Back to Intro',
    sq_outstanding: "🏆 Outstanding! You're mastering history.",
    sq_great: '✅ Great work! Keep up the momentum.',
    sq_good: '📚 Good effort — review the weak areas below.',
    sq_keep_going: '💡 Keep studying — every attempt makes you stronger.',
    sq_questions_desc: 'Drawn from all 4 eras',
    sq_correct_xp: 'correct · +{xp} XP earned',
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
    guide_features: '19 Features', guide_quick_start: 'Quick Start',
    guide_faq_title: 'Frequently Asked Questions', guide_start_lesson: 'Start a Lesson',
    guide_see_plans: 'See Plans', guide_cta_title: 'Ready to begin your journey?',
    guide_cta_desc: 'Head to the Dashboard to see your progress at a glance, or jump straight into a lesson.',
    guide_dashboard: 'Dashboard', guide_start_learning: 'Start Learning', guide_step: 'Step',
    guide_free_pro: 'Free & Pro plans', guide_qs_desc: 'New here? Start by completing a lesson in the Eras & Lessons section, then take the era quiz to earn XP. Once you have a feel for the app, upgrade to Pro to unlock all 132 lessons and the AI Tutor.',
    // Report
    report_title: 'Report a Problem', report_subtitle: 'Help us improve Historify',
    report_placeholder: 'Describe the problem you encountered…',
    report_submit: 'Send Report', report_thanks: 'Thank you! Your report has been received.',
    report_type: 'Problem Type',
    // Pricing
    pricing_title: 'Choose Your Learning Plan', pricing_subtitle: 'From casual exploration to mastery-level study — a plan for every learner.',
    pricing_guarantee: '30-day money-back guarantee on every paid plan — full refund, no questions asked.',
    gift_btn: 'Gift a plan',
    gift_title: 'Gift a subscription',
    gift_desc: 'Give {name} one month of a paid plan. Your reward: 50% off your own next renewal.',
    gift_send: 'Send gift',
    gift_sent: 'Gift sent! {name} now has one month of {plan} — and you earned 50% off your next renewal.',
    gift_reward_badge: '50% off your next renewal',
    pricing_current: 'Current Plan', pricing_select: 'Get Started', pricing_month: '/month',
    pricing_trial_note: '5-day free trial — cancel anytime',
    pricing_free_label: 'Free', pricing_back: 'Back',
    // Debate
    debate_title: 'Debate a Philosopher', debate_subtitle: 'Challenge history\'s greatest thinkers',
    debate_today: 'Today\'s Philosopher', debate_xp_reward: 'XP if you win',
    debate_placeholder: 'Present your philosophical argument…',
    debate_new_round: 'New Round', debate_pro_only: 'Philosopher Debate is available on Pro Learner and above.',
    debate_won_title: 'You won the debate!', debate_won_desc: 'has conceded to your argument.',
    debate_already_won: 'You already defeated today\'s philosopher!',
    debate_next_in: 'New philosopher in', debate_starters: 'Opening Arguments',
    debate_start_arg: 'Challenge this position',
    // AI Tutor extended
    tutor_subtitle: 'AI History Tutor · Muse of History',
    sugg_1: 'What caused the fall of the Roman Empire?', sugg_2: 'Explain the Crusades in simple terms',
    sugg_3: 'Why was the Renaissance important?', sugg_4: 'How did WWI lead to WWII?',
    sugg_5: 'Who were the greatest ancient philosophers?', sugg_6: 'What was the Silk Road and why did it matter?',
    // Essay extended
    essay_tip_1: 'Include specific dates', essay_tip_2: 'Name key figures',
    essay_tip_3: 'State a clear argument', essay_tip_4: 'Use historical evidence',
    essay_score_breakdown: 'Score Breakdown', essay_strong_points: 'Strong Points',
    essay_missing_points: 'Missing Points', essay_accuracy: 'Historical Accuracy',
    essay_argument_quality: 'Argument Quality', essay_depth_detail: 'Depth & Detail',
    essay_overall: 'Overall', essay_study_more: 'Study More', essay_your_essay: 'Your Essay',
    // Progress extended
    prog_lessons_by_era: 'Lessons by Era', prog_analysis_title: "Clio's Analyses", prog_analysis_passes: 'passed', prog_analysis_avg: 'avg. score', prog_analysis_best: 'best grade', prog_analysis_empty: 'Complete a lesson and pass its written analysis to see your record here.', prog_time_title: 'Time Invested', prog_time_total: 'total study time', prog_momentum_title: 'Learning Momentum', prog_momentum_active: 'active days in the last 14', prog_quiz_by_era: 'Quiz Scores by Era',
    prog_knowledge_radar: 'Knowledge Radar', prog_xp_timeline: 'XP Activity Timeline',
    prog_radar_desc: 'Combined lesson completion + quiz score per era',
    prog_adv_analytics_title: 'Advanced Analytics — Pro Learner',
    prog_adv_analytics_desc: 'Upgrade to unlock interactive quiz score charts, XP activity graphs, a Knowledge Radar showing your strengths per era, and detailed achievement analysis.',
    prog_no_quiz: 'Complete a quiz to see your scores here.',
    prog_no_xp: 'Start learning to see your XP history here.',
    prog_quiz_score_chart: 'Quiz Score Chart', prog_xp_activity_graph: 'XP Activity Graph',
    prog_knowledge_radar_chart: 'Knowledge Radar', prog_upgrade_cta: 'Upgrade to Pro — $10/mo',
    // Timeline extras
    tl_major: 'Major', tl_free_only: 'Free plan: major events only',
    tl_filter_title: 'Timeline Filters', tl_filter_desc: 'Upgrade to Pro to filter by era and category, and see all timeline events.',
    tl_lesson_locked: 'Lesson Locked', tl_lesson_locked_pro: 'Upgrade to Pro to access',
    tl_go_to: 'Go to:', tl_explore_era: 'Explore Era',
    cat_war: 'War', cat_politics: 'Politics', cat_science: 'Science', cat_culture: 'Culture', cat_religion: 'Religion', cat_exploration: 'Exploration',
    debate_continue_btn: 'Continue Debate',
    sidebar_streak: 'd streak',
    pricing_faq: 'Frequently Asked Questions', pricing_cur_btn: 'Current Plan',
    pricing_upgrade_to: 'Upgrade to', pricing_downgrade_free: 'Downgrade to Free', pricing_switch_to: 'Switch to',
    pricing_faq_q1: 'Can I cancel at any time?', pricing_faq_a1: 'Yes. Downgrade to Free anytime from your profile settings — no lock-in.',
    pricing_faq_q2: 'What happens to my progress if I downgrade?', pricing_faq_a2: 'All your XP, achievements, and completed lessons are saved forever regardless of plan.',
    pricing_faq_q3: 'Is payment secure?', pricing_faq_a3: 'In this demo, plan selection is simulated. Production payments would use Stripe with full PCI compliance.',
    pricing_faq_q4: 'What counts as an AI message?', pricing_faq_a4: 'Each message you send to the AI Tutor counts as one. Tutor responses do not count against your limit.',
    pricing_price_free: 'Free',
    report_cat_bug: 'Bug Report', report_cat_bug_desc: 'Something is broken or not working correctly',
    report_cat_feature: 'Feature Request', report_cat_feature_desc: 'Suggest a new feature or improvement',
    report_cat_content: 'Content Issue', report_cat_content_desc: 'Incorrect or missing historical information',
    report_cat_other: 'Other', report_cat_other_desc: 'General feedback or anything else',
    report_pri_low: 'Low', report_pri_medium: 'Medium', report_pri_high: 'High',
    report_category_label: 'Category', report_category_hint: 'What type of issue are you reporting?',
    report_priority_label: 'Priority', report_priority_hint: 'How severely does this affect your experience?',
    report_subject_label: 'Subject', report_subject_hint: 'A brief title for the issue',
    report_desc_label: 'Description', report_desc_hint: "Describe the issue in detail. Include steps to reproduce if it's a bug.",
    report_submit_btn: 'Submit Report', report_submitting: 'Submitting…',
    report_submitted_title: 'Report Submitted', report_submitted_msg: 'Thank you for taking the time to report this. Your feedback helps us make Historify better for everyone.',
    report_another: 'Submit Another Report', report_priority_badge: 'Priority:',
    prof_bookmarks: 'Bookmarks', prof_no_bookmarks: 'No bookmarks yet', prof_no_bookmarks_hint: 'Tap the bookmark icon on any lesson to save it here.',
    prof_historical_rank: 'Historical Rank', prof_change_plan: 'Change Plan',
    prof_danger_zone: 'Danger Zone',
    prof_reset_title: 'Reset All Progress', prof_reset_desc: 'Clears XP, lessons, and quiz scores permanently.',
    prof_reset_confirm: 'Reset all progress?', prof_reset_confirm_desc: 'This will permanently delete all your XP, completed lessons, quiz scores, and achievements. This action cannot be undone.',
    prof_reset_yes: 'Yes, reset everything',
    prof_toast_image_too_big: 'Image must be under 2 MB.',
    prof_toast_image_bad_type: 'Only PNG, JPEG, WEBP or GIF images are accepted.',
    prof_toast_avatar_set: 'Profile picture updated!',
    prof_toast_avatar_removed: 'Profile picture removed.',
    prof_toast_name_short: 'Username must be at least 3 characters.',
    prof_toast_name_saved: 'Username updated!',
    prof_toast_email_invalid: 'Enter a valid email.',
    prof_toast_email_saved: 'Email updated!',
    prof_toast_email_failed: 'Failed to update email.',
    prof_toast_pwd_short: 'New password must be at least 6 characters.',
    prof_toast_pwd_mismatch: 'Passwords do not match.',
    prof_toast_pwd_saved: 'Password updated!',
    prof_toast_pwd_failed: 'Failed to update password.',
    prof_toast_2fa_code: 'Enter a valid 6-digit code.',
    prof_toast_2fa_on: 'Two-factor authentication enabled!',
    prof_toast_2fa_off: '2FA disabled.',
    prof_toast_pref_saved: 'Preference saved.',
    prof_toast_reset: 'Progress reset.',
    prof_toast_pdf_soon: 'PDF download coming soon!',
    prof_inspired_by: 'Inspired by:',
    prof_video_xp: 'Video XP',
    prof_next_rank_in: 'Next rank in',
    prof_max_rank: 'MAX RANK',
    prof_renews: 'Renews',
    prof_download_notes: 'Download Lesson Notes (PDF)',
    prof_demo_secret: 'demo secret',
    prof_rhythm_title: 'Study rhythm',
    prof_rhythm_days_studied: 'days studied',
    prof_rhythm_empty: 'Your study days will appear here once you start a lesson.',
    prof_rhythm_less: 'Less',
    prof_rhythm_more: 'More',
    prof_rhythm_this_week: 'This week',
    prof_records_title: 'Personal records',
    prof_rec_total_time: 'Total time invested',
    prof_rec_longest_streak: 'Longest streak',
    prof_rec_days: 'days',
    prof_rec_best_quiz: 'Best quiz score',
    prof_rec_favourite_era: 'Most studied era',
    prof_rec_perfect_quizzes: 'Perfect quizzes',
    prof_rec_best_day: 'Best single day',
    prof_milestones_title: 'Closest achievements',
    unit_day_one: 'day',
    unit_day_few: 'days',
    unit_day_many: 'days',
    streak_start_today: 'Start your streak today!',
    level_short: 'Lv.',
    level_xp_to: 'XP to Level',
    flash_shuffle: 'Shuffle', flash_answer: 'Answer', flash_no_cards: 'No cards available for this filter.',
    prof_reset_btn: 'Reset',
    // Profile Settings
    prof_picture: 'Profile Picture', prof_change_photo: 'Change Photo', prof_upload_photo_btn: 'Upload Photo', prof_remove_photo_btn: 'Remove',
    prof_display_name: 'Display Name', prof_save_btn: 'Save',
    prof_change_email: 'Change Email', prof_current_email: 'Current:', prof_new_email: 'New Email', prof_cur_password: 'Current Password', prof_update_email: 'Update Email', prof_updating: 'Updating…',
    prof_change_password: 'Change Password', prof_new_password: 'New Password', prof_confirm_password: 'Confirm New Password', prof_update_password: 'Update Password',
    prof_min_chars: 'Min. 6 chars', prof_repeat_pwd: 'Repeat password',
    prof_2fa_title: 'Two-Factor Authentication', prof_2fa_enabled_msg: '2FA is enabled', prof_2fa_disabled_msg: '2FA is disabled',
    prof_2fa_enabled_desc: 'Your account is secured with an authenticator app.', prof_2fa_disabled_desc: 'Add an extra layer of security to your account.',
    prof_2fa_disable: 'Disable', prof_2fa_enable: 'Enable',
    prof_notif_title: 'Notification Preferences', prof_notif_reminders: 'Lesson Reminders', prof_notif_reminders_desc: 'Get reminded to keep your learning streak.',
    prof_notif_achievements: 'Achievement Alerts', prof_notif_achievements_desc: 'Notify when you unlock a new achievement.',
    prof_notif_weekly: 'Weekly Progress Digest', prof_notif_weekly_desc: 'A summary of your weekly learning activity.',
    prof_dark_mode: 'Dark Mode',
    prof_setup_2fa: 'Set Up 2FA', prof_2fa_scan: 'Scan the QR code with an authenticator app (Google Authenticator, Authy, etc.).', prof_2fa_enter_code: 'Enter the 6-digit code from your app', prof_2fa_verify: 'Verify & Enable', prof_2fa_backup: 'Backup codes (save these somewhere safe):',
    map_key_locations: 'Key Locations',
    map_zoom_hint: 'Scroll to zoom · Drag to pan',
    nav_timeline_map: 'Territory Map',
    tmap_title: 'Timeline Territory Map',
    tmap_subtitle: 'Explore real geographic territories for each historical period',
    tmap_select_topic: 'Select a topic to view its territory',
    tmap_layers: 'Layers', tmap_style: 'Map Style', tmap_explore: 'Explore', tmap_story: 'Story', tmap_quiz: 'Quiz',
    tmap_layer_territory: 'Territory', tmap_layer_capitals: 'Capitals', tmap_layer_cities: 'Cities',
    tmap_layer_battles: 'Battles', tmap_layer_ports: 'Ports', tmap_layer_resources: 'Resources', tmap_layer_routes: 'Routes',
    tmap_style_dark: 'Classic Dark', tmap_style_parchment: 'Parchment', tmap_style_military: 'Military',
    tmap_style_terrain: 'Terrain', tmap_style_clean: 'Clean Light', tmap_style_satellite: 'Satellite',
    tmap_quiz_q: 'Which territory/empire is shown?', tmap_quiz_correct: 'Correct! +50 XP', tmap_quiz_wrong: 'Incorrect — it was',
    tmap_quiz_xp: '+50 XP', tmap_quiz_next: 'Next Question', tmap_quiz_score: 'Score',
    tmap_story_play: 'Play', tmap_story_pause: 'Pause', tmap_story_prev: 'Prev', tmap_story_next: 'Next',
    tmap_markers: 'markers', tmap_period: 'Period',
    tmap_perspective: 'View', tmap_perspective_all: 'All', tmap_perspective_military: 'Military',
    tmap_perspective_trade: 'Trade', tmap_perspective_scholar: 'Scholar',
    tmap_year: 'Year', tmap_what_if: 'What If?', tmap_pro_only: 'Territory Map requires a Pro plan',
    tmap_what_if_desc: 'Explore counterfactual history', tmap_year_range: 'Year range', tmap_animate: 'Animate',
    tmap_causality: 'Historical context', tmap_territories_hint: 'historical territories across 6 eras',
    essay_select_topic: 'Select a topic above',
    essay_write_more: 'Write at least {n} more words',
    essay_too_long: 'Essay is too long (max 600 words)',
    // Login
    login_title: 'Welcome Back', login_desc: 'Sign in to continue your journey',
    login_email: 'Email', login_password: 'Password',
    login_signing_in: 'Signing in…', login_btn: 'Sign In',
    login_no_account: 'No account?', login_create: 'Create one free',
    login_err_email: 'Enter a valid email', login_err_pass: 'Password required',
    login_failed: 'Login failed. Check your email and password.',
    // Register
    reg_title: 'Begin Your Journey', reg_desc: 'Create your free account — no credit card required',
    reg_username: 'Username', reg_email: 'Email', reg_pass: 'Password', reg_confirm: 'Confirm Password',
    reg_creating: 'Creating account…', reg_btn: 'Create Free Account',
    reg_have_account: 'Already have an account?', reg_sign_in: 'Sign in',
    reg_err_username_min: 'Min 3 characters', reg_err_username_max: 'Max 20 characters',
    reg_err_username_chars: 'Letters, numbers, underscores only',
    reg_err_email: 'Enter a valid email', reg_err_pass_min: 'Min 8 characters',
    reg_err_pass_match: "Passwords don't match", reg_failed: 'Account creation failed. Please try again.',
    reg_placeholder_username: 'historybuff42',
    reg_placeholder_pass: 'At least 8 characters', reg_placeholder_confirm: 'Repeat your password',
    // Auth errors
    auth_no_account: 'No account found with that email.',
    essay_grading_sub: 'Analyzing accuracy, argument quality, and depth…',
    essay_graded: 'Graded! You earned a {grade}',
    essay_grade_fail: 'Grading failed. Please try again.',
    essay_custom_placeholder: 'e.g. How did the Mongol Empire change trade across Asia?',
    // AI gateway errors
    ai_err_title: 'Clio couldn’t answer',
    ai_err_config: 'The AI service isn’t configured. Add your API key to .env.local (VITE_ANTHROPIC_API_KEY) and restart the app.',
    ai_err_network: 'No connection to the AI service. Check your internet and try again.',
    ai_err_rate: 'Too many requests right now. Wait a few seconds, then retry.',
    ai_err_server: 'The AI service is temporarily down. Your conversation is saved — retry in a moment.',
    ai_err_generic: 'Something went wrong while contacting the AI. Your conversation is saved — try again.',
    ai_err_reconnect: 'Reconnecting in {s}s…',
    // Tactical map
    tmap_cat_assets: 'Owned Assets', tmap_cat_diplomatic: 'Diplomatic Fronts', tmap_cat_resources: 'Resources', tmap_cat_enemy: 'Enemy Spheres',
    tmap_annotate: 'Annotate', tmap_ann_pin: 'Place Pin', tmap_ann_draw: 'Draw Path', tmap_ann_clear: 'Clear Notes', tmap_ann_pin_default: 'Map Pin',
    tmap_fog_locked: 'Unexplored region — click to scout', tmap_fog_scouted: 'Region scouted!',
    tmap_tel_faction: 'Faction', tmap_tel_garrison: 'Garrison', tmap_tel_resources: 'Resources',
    tmap_tel_hazard: 'Hazard', tmap_tel_battles: 'Battles', tmap_tel_none: 'None recorded',
    tmap_timeline: 'Timeline', year_bce: 'BCE', year_ce: 'CE',
    tmap_hazard_dust: 'Dust storms', tmap_hazard_frost: 'Frost & famine', tmap_hazard_storm: 'Sea storms', tmap_hazard_scorched: 'Scorched ground',
    tmap_campaign: 'Campaign', tmap_camp_subtitle: 'Conquer every region of history, era by era', tmap_camp_select: 'Pick an unlocked region to begin your conquest',
    tmap_camp_stage: 'Stage', tmap_camp_question: 'Question', tmap_camp_start: 'Begin Conquest',
    tmap_camp_retry: 'Retry Stage', tmap_camp_continue: 'Next Stage', tmap_camp_conquered: 'Conquered',
    tmap_camp_locked: 'Locked — conquer the previous region first', tmap_camp_victory: 'Region conquered!', tmap_camp_defeat: 'Conquest failed — you need at least 3 of 5 correct to claim the region.',
    tmap_camp_progress: 'Campaign Progress', tmap_camp_stars: 'Stars', tmap_camp_rank: 'Commander Rank',
    tmap_camp_rank_1: 'Recruit', tmap_camp_rank_2: 'Captain', tmap_camp_rank_3: 'General',
    tmap_camp_rank_4: 'Warlord', tmap_camp_rank_5: 'Strategos',
    tmap_camp_legendary: 'Legendary Mode', tmap_camp_legendary_hint: 'Master exclusive — only flawless conquests count, XP is doubled',
    tmap_camp_xp: 'XP earned', tmap_camp_era_locked: 'This era\'s campaign requires the Master plan', tmap_camp_no_questions: 'No challenges available for this region yet.',
    tmap_genq_belong: 'Which of these belonged to {name}?', tmap_genq_period: 'In which period did {name} flourish?', tmap_genq_exp: '{answer} is part of the story of {name}.',
    tmap_camp_foe: 'Defenders of {name}', tmap_camp_your_army: 'Your army', tmap_camp_enemy_army: 'Enemy army',
    tmap_unit_infantry: 'Infantry', tmap_unit_archers: 'Archers', tmap_unit_cavalry: 'Cavalry',
    tmap_battle_brief: 'Answer correctly to charge and break the enemy line. A wrong answer lets them counter-charge. Rout their army to seize the region.', tmap_battle_start: 'Sound the charge', tmap_battle_round: 'Round',
    tmap_battle_hit: 'Direct hit!', tmap_battle_counter: 'Counter-charge!', tmap_battle_won: 'The region is yours!',
    tmap_battle_lost: 'Your army is routed.', tmap_battle_correct: 'blows landed', tmap_battle_left: 'remaining',
    tmap_chokepoint: 'Strategic chokepoint',
    prog_ach_summary: 'You have unlocked {unlocked} of {total} achievements.',
    prog_ach_remaining: '{count} still to earn!',
    search_no_results: 'No results for', search_min_chars: 'Type at least 2 characters to search',
    // Clio memory / AI Studio / Study Plan
    mem_title: "Clio's memory of you", mem_empty: 'Clio is still getting to know you — chat with her and take quizzes, and her memory builds automatically.',
    mem_interests: 'Your interests', mem_strengths: 'Strengths', mem_misconceptions: 'Corrections in progress',
    mem_facts: 'Facts mastered', mem_sessions: 'Session notes', mem_resolved: 'Got it',
    mem_clear: 'Forget everything', mem_clear_confirm_title: "Clear Clio's memory?",
    mem_clear_confirm_desc: 'Clio will forget your interests, corrections, and session history. Your XP and progress are not affected.',
    nav_studio: 'AI Studio', nav_study_plan: 'Study Plan',
    studio_title: 'AI Content Studio', studio_subtitle: 'Turn any historical text into flashcards, quizzes, and key facts',
    studio_gate_desc: 'The AI Content Studio is available on the Pro plan. Turn any text into a personal study kit.',
    studio_paste_label: 'Source text', studio_paste_placeholder: 'Paste a textbook chapter, article, lecture notes, or any historical text here…',
    studio_source_too_short: 'Add at least 200 characters so the AI has enough to work with.',
    studio_focus_label: 'Focus (optional)', studio_focus_placeholder: 'e.g. military tactics',
    studio_questions_label: 'Quiz questions', studio_cards_label: 'Flashcards',
    studio_generation_failed: 'The AI response could not be validated. Try again — a fresh run usually fixes it.',
    studio_generating: 'Engineering your study kit…', studio_generate: 'Generate study kit',
    studio_checking: 'Checking and topping up…',
    studio_quality_clean: 'Every generated item was grounded in your source and passed the quality checks.',
    studio_quality_title: 'Quality pass: {n} item(s) removed',
    studio_quality_short: 'Still short by {q} question(s) and {c} flashcard(s) — your source may not support more.',
    studio_quality_hint: 'Removed items were not saved. Uncheck anything else you do not want before saving.',
    studio_issue_ungrounded: 'not supported by your source text',
    studio_issue_invented: 'cited a date or figure that is not in your source',
    studio_issue_duplicate: 'repeated an earlier item',
    studio_issue_length_bias: '{pct}% of questions give the answer away by being the longest option',
    studio_issue_script: 'some text came back in the wrong alphabet',
    studio_my_sets: 'My study sets', studio_no_sets: 'No study sets yet — generate your first kit above.',
    studio_delete_set: 'Delete set', studio_flashcards: 'flashcards', studio_questions: 'questions', studio_best: 'best',
    studio_practice: 'Practice', studio_review_cards: 'Cards',
    studio_review_title: 'Review the generated kit', studio_review_subtitle: 'Tap any item to keep or discard it, then save the set.',
    studio_kept: 'kept', studio_summary: 'Summary', studio_facts: 'Key facts', studio_set_name: 'Study set name',
    studio_discard: 'Discard', studio_save_set: 'Save set',
    studio_practice_score: 'Score:', studio_done: 'Finish', studio_show_answer: 'Tap to reveal', studio_next_card: 'Next card',
    path_title: 'Study Plan', path_subtitle: 'Your week, engineered around what you most need to learn',
    path_mastery_title: 'Era mastery', path_focus: 'focus',
    path_lessons_done: 'Lessons', path_quiz_score: 'Quiz', path_adaptive_acc: 'Adaptive',
    path_generate: 'Generate my week', path_regenerate: 'Regenerate week', path_refresh: 'Refresh', path_refreshed: 'Plan refreshed',
    path_enhance: 'Enhance with Clio', path_enhancing: 'Clio is studying your data…',
    path_enhance_upsell: "Clio's coaching notes on your plan are a Master Student exclusive.",
    path_done_of: 'steps done', path_deep_analysis: 'Master analysis', path_day: 'Day',
    path_empty: 'Generate a personalized week: the plan targets your weakest era with real lessons, adaptive quizzes, and a final measurement day — and checks itself off as you learn.',
    path_step_lesson: 'Lesson', path_step_quiz: 'Era quiz', path_step_smart_quiz: 'Smart Quiz',
    path_step_flashcards: 'Flashcard review', path_step_studio: 'AI Studio session', path_step_crisis: 'Crisis simulation', path_step_map: 'Territory Map',
    path_min: 'min', path_mark_done: 'Mark done',
    path_rhythm_title: 'Built from how you actually study',
    path_rhythm_active: 'active days', path_rhythm_session: 'Typical session',
    path_rhythm_scheduled: 'Scheduled', path_rhythm_no_data: 'no sessions yet',
    path_days_label: 'study days', path_min_per_day: 'min/day',
    path_returning: 'Welcome back — the week opens with review before new material.',
    path_mode_coverage: 'Reading focus', path_mode_retention: 'Recall focus', path_mode_balanced: 'Balanced',
    path_mode_coverage_why: 'Most of your focus era is still unread, so this week leans on new lessons.',
    path_mode_retention_why: "You have read the material but it isn't sticking, so this week leans on recall practice rather than more reading.",
    path_mode_balanced_why: 'Your reading and your recall are in step, so this week alternates between them.',
    path_stale_title: 'This plan no longer matches you',
    path_stale_complete: 'You finished every step — time for the next week.',
    path_stale_expired: 'The plan has outlived the week it was scheduling',
    path_stale_days_old: 'days old', path_stale_focus: 'Your focus has moved to',
    // Philosopher memory / Flashcards gate / Battle tactics
    pmem_title: "{name}'s memory of you", pmem_empty: 'No debates on record yet — argue with them and they will remember every stance you take.',
    pmem_debates: 'debates', pmem_wins: 'concessions won', pmem_stances: 'Positions you argued',
    pmem_concessions: 'Points you conceded', pmem_strong: 'Your strongest arguments', pmem_style: 'Your style',
    pmem_clear: 'Erase this rivalry', pmem_clear_title: 'Erase this debate history?',
    pmem_clear_desc: 'The philosopher will forget every stance, concession, and victory between you. Your XP is not affected.',
    flash_gate_desc: 'Flashcards unlock on the Beginner Student plan. Drill key facts from every lesson with 3D flip cards.',
    tmap_battle_brief2: 'Each round: choose a tactic at the war council, then answer the order. Correct — your tactic strikes. Wrong — theirs does. Charge beats volley, volley beats shield wall, shield wall beats charge. Break their army — or their morale.',
    tmap_battle_council: 'War council — choose your tactic', tmap_battle_order: 'The order',
    tmap_battle_rout: 'THE LINE BREAKS!', tmap_battle_crit: 'ROUT STRIKE!',
    tmap_battle_advantage: 'Tactical advantage!', tmap_battle_outmaneuvered: 'Outmaneuvered!', tmap_battle_morale: 'Morale',
    tmap_tactic_charge: 'Charge', tmap_tactic_volley: 'Volley', tmap_tactic_hold: 'Shield wall',
    tmap_tactic_charge_hint: 'Breaks volleys · falls to a braced line',
    tmap_tactic_volley_hint: 'Shreds a braced line · ridden down by a charge',
    tmap_tactic_hold_hint: 'Stops a charge cold · helpless under a volley',
};

export const T: Translations = {
  en: EN,
  es: {
    nav_dashboard: 'Panel', nav_eras: 'Eras y Lecciones', nav_timeline: 'Línea de Tiempo',
    nav_tutor: 'Tutor IA', nav_leaderboard: 'Clasificación', nav_friends: 'Amigos',
    nav_flashcards: 'Tarjetas', nav_notes: 'Mis Notas', nav_progress: 'Progreso',
    nav_smart_quiz: 'Quiz Inteligente', nav_essay: 'Desafío de Ensayo', nav_video_review: 'Revisión de Vídeo',
    nav_debate: 'Debate con un Filósofo',
    nav_crisis: 'Sala de Crisis',
    nav_imperium: 'Chronos Imperium',
    crisis_title: 'Sala de crisis Chronos',
    crisis_subtitle: 'Entra en un punto de inflexión histórico y toma las decisiones tú mismo',
    crisis_back: 'Todos los escenarios',
    crisis_begin: 'Iniciar la simulación',
    crisis_abandon: 'Abandonar línea temporal',
    crisis_placeholder: 'Escribe tu decisión: elige una opción o traza tu propio camino…',
    crisis_master_only: 'La Sala de crisis Chronos es exclusiva del plan Master Student — simulaciones contrafactuales completas con evaluación de IA en tiempo real.',
    crisis_turn: 'Turno', crisis_stability: 'Estabilidad', crisis_legitimacy: 'Legitimidad', crisis_legacy: 'Legado',
    crisis_decisions: 'Registro de decisiones', crisis_verdict: 'Veredicto final',
    crisis_dc: 'Capital diplomático', crisis_mr: 'Preparación militar', crisis_treasury: 'Tesoro', crisis_consequence: 'Consecuencia',
    crisis_risk_low: 'Bajo', crisis_risk_med: 'Medio', crisis_risk_high: 'Alto',
    crisis_assess_title: 'Evaluación Estratégica', crisis_assess_cta: 'Solicitar Evaluación Estratégica', crisis_assess_sub: 'El Tribunal de Chronos califica toda tu partida en cinco dimensiones',
    crisis_assess_loading: 'El Tribunal está deliberando…', crisis_assess_score: 'Puntuación de Mando', crisis_assess_xp: 'XP ganada',
    crisis_assess_m_foresight: 'Visión estratégica', crisis_assess_m_judgment: 'Juicio histórico', crisis_assess_m_stewardship: 'Gestión de recursos',
    crisis_assess_m_decisiveness: 'Decisión', crisis_assess_m_adaptability: 'Adaptabilidad',
    crisis_assess_strengths: 'Fortalezas', crisis_assess_improve: 'Mejoras',
    crisis_assess_counterfactual: 'Lo que hizo la Historia', crisis_assess_rerun: 'Reconvocar al Tribunal',
    nav_profile: 'Perfil', nav_guide: 'Guía de la App', nav_report: 'Reportar Problema',
    nav_upgrade: 'Actualizar Plan', nav_logout: 'Cerrar Sesión',
    nav_group_chronicles: 'Crónicas', nav_group_academy: 'Academia', nav_group_agora: 'Ágora', nav_group_ledger: 'Registro',
    notif_title: 'Notificaciones', notif_empty: 'Nada nuevo — ¡mantén viva tu racha hoy!',
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
    daily_submit: 'Enviar Respuesta', daily_correct: '¡Correcto! +15 XP',
    daily_wrong: 'Respuesta correcta:', daily_tomorrow: '¡Vuelve mañana para un nuevo desafío!',
    achievement_unlocked: '¡Logro Desbloqueado!',
    difficulty_easy: 'Fácil', difficulty_medium: 'Medio', difficulty_hard: 'Difícil',
    era_short_prehistoric: 'Prehistoria', era_short_byzantine: 'Bizancio', era_short_ancient: 'Antiguo', era_short_medieval: 'Medieval', era_short_earlymod: 'Moderno Temprano', era_short_modern: 'Moderno',
    eras_title: 'Eras y Lecciones', eras_subtitle: 'Elige tu era y comienza tu viaje',
    eras_lessons_label: 'lecciones', eras_take_quiz: 'Hacer Quiz de Era',
    eras_view_lessons: 'Ver Lecciones', eras_locked: 'Bloqueado', eras_completed: 'Completado',
    eras_quiz_label: 'Quiz de Era', eras_lessons_count: 'lecciones',
    lesson_key_facts: 'Hechos Clave', lesson_min_read: 'min de lectura',
    lesson_complete_btn: 'Marcar como Completada', lesson_already_done: 'Lección Completada', toast_lesson_complete: '¡Lección completada! +{xp} XP', toast_bookmarked: '¡Lección guardada!', toast_bookmark_removed: 'Marcador eliminado.',
    lesson_next: 'Siguiente Lección', lesson_prev: 'Lección Anterior',
    lesson_take_quiz: 'Hacer Quiz de Era', lesson_discuss: 'Comentar con Clio',
    lesson_notes_title: 'Mis Notas',
    lesson_bookmarked: 'Guardada', lesson_save: 'Guardar Lección', lesson_eras_breadcrumb: 'Eras',
    quiz_correct: '¡Correcto!', quiz_incorrect: 'No del todo.', quiz_score: 'Puntuación',
    quiz_xp_earned: 'XP ganado', quiz_performance_by_era: 'Rendimiento por Era',
    quiz_clio_rec: 'Recomendación de Clio', quiz_clio_thinking: 'Clio está pensando…',
    quiz_weak_areas: 'Áreas Débiles Detectadas', quiz_no_weak_areas: 'Aún no se detectaron áreas débiles.',
    quiz_adaptive: 'Adaptativo', quiz_earn_xp: 'Gana XP', quiz_questions: 'Preguntas',
    quiz_era_title: 'Quiz', quiz_complete: 'Quiz Completado', quiz_passed: '¡Aprobado!',
    quiz_failed: 'Sigue Practicando', quiz_retake: 'Repetir Quiz',
    quiz_submit_answer: 'Enviar Respuesta', quiz_explanation: 'Explicación', quiz_correct_label: 'correcto',
    quiz_test_knowledge: 'Pon a prueba tu conocimiento de {era}',
    quiz_passing_score: 'Puntuación mínima: {score}% · XP máximo: {xp}',
    quiz_question_of: 'Pregunta {n} de {total}',
    quiz_upgrade_explanations: 'Actualiza a Pro para ver las explicaciones de respuestas.',
    quiz_not_found: 'Quiz no encontrado.',
    sq_clio_fallback: '¡Buen esfuerzo! Concéntrate en revisar las eras donde tuviste dificultades y vuelve a intentar esas lecciones.',
    sq_plan_title: 'Plan de Estudio de Clío', sq_plan_focus: 'Áreas de enfoque', sq_plan_steps: 'Tu plan de 3 pasos',
    sq_plan_forecast: 'Pronóstico de la próxima sesión', sq_plan_master: 'Análisis de conceptos erróneos', sq_plan_min: 'min', sq_plan_open: 'Abrir lección',
    sq_upgrade_desc: 'El Quiz Inteligente usa un algoritmo adaptativo que apunta a tus eras más débiles y calibra la dificultad según tu nivel. Disponible en Pro Learner y superior.',
    tl_title: 'Línea de Tiempo Histórica', tl_subtitle: 'Desde 3100 a.C. hasta hoy',
    tl_events: 'eventos', tl_all_eras: 'Todas las Eras', tl_all_categories: 'Todas las Categorías',
    tl_open_lesson: 'Abrir Lección',
    tutor_hello: '¡Hola, soy Clio, tu guía por la historia!', tutor_examples: 'O carga un diálogo de ejemplo',
    tutor_history: 'Historial', tutor_thread_first: 'Primera conversación', tutor_thread_untitled: 'Nueva conversación', tutor_desc: '¡Bienvenido! Soy la Musa de la Historia, aquí para que el pasado cobre sentido. Pregúntame lo que sea — una batalla, un imperio, una costumbre extraña o "¿por qué pasó esto?" — y te lo explicaré con claridad, lo conectaré con el panorama general y te ayudaré a recordarlo. ¿Nuevo por aquí? Prueba una sugerencia, repasa una lección conmigo o dime qué te da curiosidad.',
    tutor_placeholder: 'Pregunta a Clio sobre cualquier momento de la historia…', tutor_new_chat: 'Nuevo Chat',
    tutor_attach_image: 'Adjuntar una imagen', tutor_image_ready: 'Imagen lista — envíala a Clio',
    tutor_clear_title: 'Borrar esta conversación', tutor_clear_confirm: '¿Borrar esta conversación? Los mensajes se eliminarán permanentemente de este hilo.',
    tutor_upgrade_msg: 'Actualiza para usar el Tutor IA',
    lb_title: 'Clasificación', lb_subtitle: 'Los mejores estudiantes clasificados por XP total.',
    lb_your_rank: 'Tu Posición', lb_full_rankings: 'Clasificación Completa', lb_you: '(Tú)',
    lb_chess_rank: 'Rango de Ajedrez', lb_level: 'Nivel', lb_streak: 'Racha',
    lb_xp_regular: 'XP Regular', lb_xp_video: 'XP de Vídeo', lb_score: 'Puntuación Total',
    fr_title: 'Amigos', fr_subtitle: 'Conecta con otros estudiantes de historia',
    fr_search: 'Buscar usuarios…', fr_tab_friends: 'Amigos', fr_tab_requests: 'Solicitudes',
    fr_tab_sent: 'Enviadas', fr_add: 'Agregar Amigo', fr_pending: 'Pendiente',
    fr_message: 'Mensaje', fr_duel: 'Duelo 1v1', fr_msg_title: 'Chat con {name}', fr_msg_placeholder: 'Escribe un mensaje…',
    fr_msg_empty: '¡Saluda — o rétalo a un Duelo de Historia 1v1!', fr_msg_send: 'Enviar',
    fr_find_users: 'Buscar usuarios',
    fr_no_results: 'No se encontraron usuarios que coincidan con',
    fr_toast_request_sent: 'Solicitud de amistad enviada',
    fr_toast_request_failed: 'No funcionó: inténtalo de nuevo.',
    fr_wants_to_be_friend: 'Quiere ser tu amigo',
    fr_cancel_request: 'Cancelar',
    fr_net_signin: 'Inicia sesión para conectar con otros estudiantes',
    fr_net_local: 'Amigos de demostración: sin conexión al servidor',
    fr_toast_now_friend: 'Nuevo amigo añadido',
    fr_toast_declined: 'Solicitud rechazada',
    fr_toast_removed: 'Amigo eliminado',
    fr_request_pending: 'Solicitud pendiente',
    fr_online: 'En línea',
    fr_streak_word: 'Racha',
    fr_unread: 'Mensajes sin leer',
    fr_gift_failed: 'No se pudo enviar el regalo.',
    fr_net_live: 'En vivo · servidor conectado',
    fr_net_offline: 'Modo sin conexión · guardado local',
    fr_tab_activity: 'Actividad',
    fr_activity_empty: 'Aún no ha pasado nada: añade un amigo para ver su actividad aquí.',
    fr_act_added: 'ahora es tu amigo',
    fr_act_duel_win: 'ganaste un duelo',
    fr_act_duel_loss: 'perdiste un duelo',
    fr_act_message: 'mensajes intercambiados',
    fr_act_gift: 'enviaste un regalo',
    fr_act_lesson: 'completó una lección',
    fr_act_quiz: 'obtuvo en un cuestionario',
    fr_act_streak: 'lleva una racha',
    fr_act_xp: 'alcanzó',
    fr_act_simulated: 'Actividad simulada: estos amigos no tienen un servidor detrás',
    fr_act_sim_short: 'sim',
    fr_time_now: 'ahora mismo',
    unit_min_short: 'm',
    unit_hour_short: 'h',
    unit_day_short: 'd',
    fr_reply_1: '¡Suerte en tu próximo duelo! ⚔️',
    fr_reply_2: '¿Ya terminaste la lección de la Era Vikinga?',
    fr_reply_3: '¡Acabo de llegar a 7 días de racha! 🔥',
    fr_reply_4: 'La crisis de Gaugamela es brutal. ¿Cómo te fue?',
    fr_reply_5: '¡Te reto a llegar antes a lo alto de la clasificación!',
    fr_reply_6: 'Roma o Grecia, ¿cuál es tu era favorita?',
    fr_reply_7: 'Rétame a un 1v1 de Historia cuando quieras.',
    fr_duel_title: 'Historia 1v1', fr_duel_begin: 'Comenzar el duelo', fr_duel_youhit: '¡Golpe certero!', fr_duel_foehit: '¡{name} te golpea!',
    fr_duel_clash: '¡Chocan las espadas — ambos heridos!', fr_duel_miss: '¡Ambos fallan!', fr_duel_victory: '¡Victoria!', fr_duel_defeat: 'Derrota',
    fr_duel_won_desc: 'Venciste a {name} en {field}.', fr_duel_lost_desc: '{name} ganó esta vez. Revancha cuando quieras.', fr_duel_done: 'Salir de la arena', fr_duel_record: 'Historial de duelos',
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
    notes_new_note: 'Nueva Nota', notes_deleted: 'Nota eliminada.', notes_none: 'Aún no hay notas', notes_none_filter: 'Sin notas para esta era', notes_hint: 'Haz clic en "+ Nueva Nota" para capturar tus pensamientos mientras aprendes.', notes_untitled: 'Nota sin Título', notes_count: 'notas guardadas',
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
    sq_stats_title: 'Tus Estadísticas', sq_history_title: 'Historial de sesiones', sq_history_open: 'Ver todas las sesiones', sq_duration: 'Duración', sq_history_back: 'Volver al Quiz Inteligente', sq_sessions: 'Sesiones', sq_avg_score: 'Puntuación Media',
    sq_best_score: 'Mejor Puntuación', sq_total_xp: 'XP Total', sq_era_breakdown: 'Rendimiento Acumulado por Era',
    sq_no_sessions: 'Aún no hay sesiones — ¡completa tu primer Quiz Inteligente!',
    sq_correct_label: 'correcto', sq_perf_era: 'Rendimiento por Era',
    sq_new: 'Nueva Sesión', sq_back_intro: 'Volver al Inicio',
    sq_outstanding: '🏆 ¡Excepcional! Estás dominando la historia.',
    sq_great: '✅ ¡Muy bien! Mantén el impulso.',
    sq_good: '📚 Buen esfuerzo — repasa las áreas débiles.',
    sq_keep_going: '💡 Sigue estudiando — cada intento te hace más fuerte.',
    sq_questions_desc: 'Extraídas de las 4 eras',
    sq_correct_xp: 'correctas · +{xp} XP ganado',
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
    guide_features: '19 Funciones', guide_quick_start: 'Inicio Rápido',
    guide_faq_title: 'Preguntas Frecuentes', guide_start_lesson: 'Iniciar una Lección',
    guide_see_plans: 'Ver Planes', guide_cta_title: '¿Listo para comenzar tu viaje?',
    guide_cta_desc: 'Ve al Panel para ver tu progreso de un vistazo, o ve directamente a una lección.',
    guide_dashboard: 'Panel', guide_start_learning: 'Comenzar a Aprender', guide_step: 'Paso',
    guide_free_pro: 'Planes Gratuito y Pro', guide_qs_desc: '¿Eres nuevo? Comienza completando una lección en la sección Eras y Lecciones, luego haz el quiz de era para ganar XP. Una vez que conozcas la app, actualiza a Pro para desbloquear todas las 132 lecciones y el Tutor IA.',
    report_title: 'Reportar un Problema', report_subtitle: 'Ayúdanos a mejorar Historify',
    report_placeholder: 'Describe el problema que encontraste…',
    report_submit: 'Enviar Reporte', report_thanks: '¡Gracias! Tu reporte ha sido recibido.',
    report_type: 'Tipo de Problema',
    pricing_title: 'Elige tu Plan de Aprendizaje', pricing_subtitle: 'Desde exploración casual hasta estudio avanzado — un plan para cada estudiante.',
    pricing_guarantee: 'Garantía de devolución de 30 días en todos los planes de pago — reembolso completo, sin preguntas.',
    gift_btn: 'Regalar un plan',
    gift_title: 'Regalar una suscripción',
    gift_desc: 'Regala a {name} un mes de un plan de pago. Tu recompensa: 50% de descuento en tu próxima renovación.',
    gift_send: 'Enviar regalo',
    gift_sent: '¡Regalo enviado! {name} ahora tiene un mes de {plan} — y tú ganaste 50% de descuento en tu próxima renovación.',
    gift_reward_badge: '50% de descuento en tu próxima renovación',
    pricing_current: 'Plan Actual', pricing_select: 'Comenzar', pricing_month: '/mes',
    pricing_trial_note: '5 días de prueba gratis — cancela cuando quieras',
    pricing_free_label: 'Gratis', pricing_back: 'Volver',
    // Debate
    debate_title: 'Debate con un Filósofo', debate_subtitle: 'Desafía a los grandes pensadores de la historia',
    debate_today: 'Filósofo de Hoy', debate_xp_reward: 'XP si ganas',
    debate_placeholder: 'Presenta tu argumento filosófico…',
    debate_new_round: 'Nueva Ronda', debate_pro_only: 'El Debate con Filósofo está disponible en Pro Learner y superior.',
    debate_won_title: '¡Ganaste el debate!', debate_won_desc: 'ha cedido ante tu argumento.',
    debate_already_won: '¡Ya derrotaste al filósofo de hoy!',
    debate_next_in: 'Nuevo filósofo en', debate_starters: 'Argumentos Iniciales',
    debate_start_arg: 'Desafiar esta posición',
    // AI Tutor extended
    tutor_subtitle: 'Tutora IA de Historia · Musa de la Historia',
    sugg_1: '¿Qué causó la caída del Imperio Romano?', sugg_2: 'Explica las Cruzadas en términos simples',
    sugg_3: '¿Por qué fue importante el Renacimiento?', sugg_4: '¿Cómo llevó la Primera Guerra Mundial a la Segunda?',
    sugg_5: '¿Quiénes fueron los grandes filósofos de la antigüedad?', sugg_6: '¿Qué fue la Ruta de la Seda y por qué importó?',
    // Essay extended
    essay_tip_1: 'Incluye fechas específicas', essay_tip_2: 'Nombra figuras clave',
    essay_tip_3: 'Plantea un argumento claro', essay_tip_4: 'Usa evidencia histórica',
    essay_score_breakdown: 'Desglose de Puntuación', essay_strong_points: 'Puntos Fuertes',
    essay_missing_points: 'Puntos Omitidos', essay_accuracy: 'Precisión Histórica',
    essay_argument_quality: 'Calidad del Argumento', essay_depth_detail: 'Profundidad y Detalle',
    essay_overall: 'Total', essay_study_more: 'Estudiar Más', essay_your_essay: 'Tu Ensayo',
    // Progress extended
    prog_lessons_by_era: 'Lecciones por Era', prog_analysis_title: 'Análisis de Clío', prog_analysis_passes: 'aprobados', prog_analysis_avg: 'nota media', prog_analysis_best: 'mejor nota', prog_analysis_empty: 'Completa una lección y aprueba su análisis escrito para ver tu registro aquí.', prog_time_title: 'Tiempo invertido', prog_time_total: 'tiempo total de estudio', prog_momentum_title: 'Impulso de aprendizaje', prog_momentum_active: 'días activos en los últimos 14', prog_quiz_by_era: 'Puntuaciones de Quiz por Era',
    prog_knowledge_radar: 'Radar de Conocimiento', prog_xp_timeline: 'Línea de Tiempo de XP',
    prog_radar_desc: 'Completación de lecciones + puntuación de quiz por era',
    prog_adv_analytics_title: 'Analíticas Avanzadas — Pro Learner',
    prog_adv_analytics_desc: 'Actualiza para desbloquear gráficos interactivos de puntuaciones, historial de XP, radar de conocimiento por era y análisis de logros.',
    prog_no_quiz: 'Completa un quiz para ver tus puntuaciones aquí.',
    prog_no_xp: 'Comienza a aprender para ver tu historial de XP aquí.',
    prog_quiz_score_chart: 'Gráfico de Puntuaciones', prog_xp_activity_graph: 'Gráfico de Actividad XP',
    prog_knowledge_radar_chart: 'Radar de Conocimiento', prog_upgrade_cta: 'Actualizar a Pro — $10/mes',
    tl_major: 'Principal', tl_free_only: 'Plan gratuito: solo eventos principales',
    tl_filter_title: 'Filtros de Línea de Tiempo', tl_filter_desc: 'Actualiza a Pro para filtrar por era y categoría, y ver todos los eventos.',
    tl_lesson_locked: 'Lección Bloqueada', tl_lesson_locked_pro: 'Actualiza a Pro para acceder',
    tl_go_to: 'Ir a:', tl_explore_era: 'Explorar Era',
    cat_war: 'Guerra', cat_politics: 'Política', cat_science: 'Ciencia', cat_culture: 'Cultura', cat_religion: 'Religión', cat_exploration: 'Exploración',
    debate_continue_btn: 'Continuar Debate',
    sidebar_streak: 'd racha',
    pricing_faq: 'Preguntas Frecuentes', pricing_cur_btn: 'Plan Actual',
    pricing_upgrade_to: 'Actualizar a', pricing_downgrade_free: 'Bajar a Gratis', pricing_switch_to: 'Cambiar a',
    pricing_faq_q1: '¿Puedo cancelar en cualquier momento?', pricing_faq_a1: 'Sí. Reduce a Gratis desde la configuración de tu perfil — sin compromiso.',
    pricing_faq_q2: '¿Qué pasa con mi progreso si bajo de plan?', pricing_faq_a2: 'Todo tu XP, logros y lecciones completadas se guardan para siempre sin importar el plan.',
    pricing_faq_q3: '¿Es seguro el pago?', pricing_faq_a3: 'En esta demo, la selección de plan es simulada. Los pagos de producción usarían Stripe con pleno cumplimiento PCI.',
    pricing_faq_q4: '¿Qué cuenta como mensaje de IA?', pricing_faq_a4: 'Cada mensaje que envías al Tutor IA cuenta como uno. Las respuestas del Tutor no cuentan contra tu límite.',
    pricing_price_free: 'Gratis',
    report_cat_bug: 'Reporte de Error', report_cat_bug_desc: 'Algo está roto o no funciona correctamente',
    report_cat_feature: 'Solicitud de Función', report_cat_feature_desc: 'Sugerir una nueva función o mejora',
    report_cat_content: 'Problema de Contenido', report_cat_content_desc: 'Información histórica incorrecta o faltante',
    report_cat_other: 'Otro', report_cat_other_desc: 'Comentarios generales o cualquier otra cosa',
    report_pri_low: 'Baja', report_pri_medium: 'Media', report_pri_high: 'Alta',
    report_category_label: 'Categoría', report_category_hint: '¿Qué tipo de problema estás reportando?',
    report_priority_label: 'Prioridad', report_priority_hint: '¿Cuánto afecta esto tu experiencia?',
    report_subject_label: 'Asunto', report_subject_hint: 'Un breve título para el problema',
    report_desc_label: 'Descripción', report_desc_hint: 'Describe el problema en detalle.',
    report_submit_btn: 'Enviar Reporte', report_submitting: 'Enviando…',
    report_submitted_title: 'Reporte Enviado', report_submitted_msg: 'Gracias por tomarte el tiempo de reportarlo. Tu feedback nos ayuda a mejorar Historify para todos.',
    report_another: 'Enviar Otro Reporte', report_priority_badge: 'Prioridad:',
    prof_bookmarks: 'Marcadores', prof_no_bookmarks: 'Aún no hay marcadores', prof_no_bookmarks_hint: 'Toca el icono de marcador en cualquier lección para guardarlo aquí.',
    prof_historical_rank: 'Rango Histórico', prof_change_plan: 'Cambiar Plan',
    prof_danger_zone: 'Zona de Peligro',
    prof_reset_title: 'Restablecer Todo el Progreso', prof_reset_desc: 'Borra XP, lecciones y puntuaciones permanentemente.',
    prof_reset_confirm: '¿Restablecer todo el progreso?', prof_reset_confirm_desc: 'Esto eliminará permanentemente todo tu XP, lecciones completadas, puntuaciones y logros. Esta acción no se puede deshacer.',
    prof_reset_yes: 'Sí, restablecer todo',
    prof_toast_image_too_big: 'La imagen debe pesar menos de 2 MB.',
    prof_toast_image_bad_type: 'Solo se aceptan imágenes PNG, JPEG, WEBP o GIF.',
    prof_toast_avatar_set: '¡Foto de perfil actualizada!',
    prof_toast_avatar_removed: 'Foto de perfil eliminada.',
    prof_toast_name_short: 'El nombre de usuario debe tener al menos 3 caracteres.',
    prof_toast_name_saved: '¡Nombre de usuario actualizado!',
    prof_toast_email_invalid: 'Introduce un correo válido.',
    prof_toast_email_saved: '¡Correo actualizado!',
    prof_toast_email_failed: 'No se pudo actualizar el correo.',
    prof_toast_pwd_short: 'La nueva contraseña debe tener al menos 6 caracteres.',
    prof_toast_pwd_mismatch: 'Las contraseñas no coinciden.',
    prof_toast_pwd_saved: '¡Contraseña actualizada!',
    prof_toast_pwd_failed: 'No se pudo actualizar la contraseña.',
    prof_toast_2fa_code: 'Introduce un código válido de 6 dígitos.',
    prof_toast_2fa_on: '¡Autenticación en dos pasos activada!',
    prof_toast_2fa_off: '2FA desactivada.',
    prof_toast_pref_saved: 'Preferencia guardada.',
    prof_toast_reset: 'Progreso restablecido.',
    prof_toast_pdf_soon: '¡La descarga en PDF llegará pronto!',
    prof_inspired_by: 'Inspirado en:',
    prof_video_xp: 'XP de vídeo',
    prof_next_rank_in: 'Siguiente rango en',
    prof_max_rank: 'RANGO MÁXIMO',
    prof_renews: 'Se renueva el',
    prof_download_notes: 'Descargar apuntes de las lecciones (PDF)',
    prof_demo_secret: 'secreto de demostración',
    prof_rhythm_title: 'Ritmo de estudio',
    prof_rhythm_days_studied: 'días estudiados',
    prof_rhythm_empty: 'Tus días de estudio aparecerán aquí en cuanto empieces una lección.',
    prof_rhythm_less: 'Menos',
    prof_rhythm_more: 'Más',
    prof_rhythm_this_week: 'Esta semana',
    prof_records_title: 'Récords personales',
    prof_rec_total_time: 'Tiempo total invertido',
    prof_rec_longest_streak: 'Racha más larga',
    prof_rec_days: 'días',
    prof_rec_best_quiz: 'Mejor nota en un cuestionario',
    prof_rec_favourite_era: 'Era más estudiada',
    prof_rec_perfect_quizzes: 'Cuestionarios perfectos',
    prof_rec_best_day: 'Mejor día',
    prof_milestones_title: 'Logros más cercanos',
    unit_day_one: 'día',
    unit_day_few: 'días',
    unit_day_many: 'días',
    streak_start_today: '¡Empieza tu racha hoy!',
    level_short: 'Nv.',
    level_xp_to: 'XP para el nivel',
    flash_shuffle: 'Barajar', flash_answer: 'Respuesta', flash_no_cards: 'No hay tarjetas disponibles para este filtro.',
    prof_reset_btn: 'Restablecer',
    // Profile Settings
    prof_picture: 'Foto de Perfil', prof_change_photo: 'Cambiar Foto', prof_upload_photo_btn: 'Subir Foto', prof_remove_photo_btn: 'Eliminar',
    prof_display_name: 'Nombre de Usuario', prof_save_btn: 'Guardar',
    prof_change_email: 'Cambiar Email', prof_current_email: 'Actual:', prof_new_email: 'Nuevo Email', prof_cur_password: 'Contraseña Actual', prof_update_email: 'Actualizar Email', prof_updating: 'Actualizando…',
    prof_change_password: 'Cambiar Contraseña', prof_new_password: 'Nueva Contraseña', prof_confirm_password: 'Confirmar Nueva Contraseña', prof_update_password: 'Actualizar Contraseña',
    prof_min_chars: 'Mín. 6 caracteres', prof_repeat_pwd: 'Repetir contraseña',
    prof_2fa_title: 'Autenticación de Dos Factores', prof_2fa_enabled_msg: '2FA está activado', prof_2fa_disabled_msg: '2FA está desactivado',
    prof_2fa_enabled_desc: 'Tu cuenta está protegida con una app autenticadora.', prof_2fa_disabled_desc: 'Añade una capa extra de seguridad a tu cuenta.',
    prof_2fa_disable: 'Desactivar', prof_2fa_enable: 'Activar',
    prof_notif_title: 'Preferencias de Notificación', prof_notif_reminders: 'Recordatorios de Lección', prof_notif_reminders_desc: 'Recibe recordatorios para mantener tu racha de aprendizaje.',
    prof_notif_achievements: 'Alertas de Logros', prof_notif_achievements_desc: 'Notificar cuando desbloquees un nuevo logro.',
    prof_notif_weekly: 'Resumen Semanal de Progreso', prof_notif_weekly_desc: 'Un resumen de tu actividad de aprendizaje semanal.',
    prof_dark_mode: 'Modo Oscuro',
    prof_setup_2fa: 'Configurar 2FA', prof_2fa_scan: 'Escanea el código QR con una app autenticadora (Google Authenticator, Authy, etc.).', prof_2fa_enter_code: 'Introduce el código de 6 dígitos de tu app', prof_2fa_verify: 'Verificar y Activar', prof_2fa_backup: 'Códigos de respaldo (guárdalos en un lugar seguro):',
    map_key_locations: 'Ubicaciones Clave',
    map_zoom_hint: 'Desplaza para zoom · Arrastra para mover',
    nav_timeline_map: 'Mapa de Territorios',
    tmap_title: 'Mapa de territorios históricos',
    tmap_subtitle: 'Explora territorios geográficos reales de cada período histórico',
    tmap_select_topic: 'Selecciona un tema para ver su territorio',
    tmap_layers: 'Capas', tmap_style: 'Estilo de mapa', tmap_explore: 'Explorar', tmap_story: 'Historia', tmap_quiz: 'Quiz',
    tmap_layer_territory: 'Territorio', tmap_layer_capitals: 'Capitales', tmap_layer_cities: 'Ciudades',
    tmap_layer_battles: 'Batallas', tmap_layer_ports: 'Puertos', tmap_layer_resources: 'Recursos', tmap_layer_routes: 'Rutas',
    tmap_style_dark: 'Oscuro clásico', tmap_style_parchment: 'Pergamino', tmap_style_military: 'Militar',
    tmap_style_terrain: 'Terreno', tmap_style_clean: 'Limpio', tmap_style_satellite: 'Satélite',
    tmap_quiz_q: '¿Qué territorio/imperio se muestra?', tmap_quiz_correct: '¡Correcto! +50 XP', tmap_quiz_wrong: 'Incorrecto — era',
    tmap_quiz_xp: '+50 XP', tmap_quiz_next: 'Siguiente pregunta', tmap_quiz_score: 'Puntuación',
    tmap_story_play: 'Reproducir', tmap_story_pause: 'Pausa', tmap_story_prev: 'Anterior', tmap_story_next: 'Siguiente',
    tmap_markers: 'marcadores', tmap_period: 'Período',
    tmap_perspective: 'Vista', tmap_perspective_all: 'Todo', tmap_perspective_military: 'Militar',
    tmap_perspective_trade: 'Comercio', tmap_perspective_scholar: 'Académico',
    tmap_year: 'Año', tmap_what_if: '¿Qué pasaría si?', tmap_pro_only: 'El mapa de territorios requiere un plan Pro',
    tmap_what_if_desc: 'Explora la historia contrafactual', tmap_year_range: 'Rango de años', tmap_animate: 'Animar',
    tmap_causality: 'Contexto histórico', tmap_territories_hint: 'territorios históricos en 6 eras',
    essay_select_topic: 'Selecciona un tema arriba',
    essay_write_more: 'Escribe al menos {n} palabras más',
    essay_too_long: 'El ensayo es demasiado largo (máx. 600 palabras)',
    // Login
    login_title: 'Bienvenido de Nuevo', login_desc: 'Inicia sesión para continuar tu viaje',
    login_email: 'Correo electrónico', login_password: 'Contraseña',
    login_signing_in: 'Iniciando sesión…', login_btn: 'Iniciar Sesión',
    login_no_account: '¿Sin cuenta?', login_create: 'Crea una gratis',
    login_err_email: 'Ingresa un email válido', login_err_pass: 'Se requiere contraseña',
    login_failed: 'Inicio de sesión fallido.',
    // Register
    reg_title: 'Comienza tu Viaje', reg_desc: 'Crea tu cuenta gratis — sin tarjeta de crédito',
    reg_username: 'Nombre de usuario', reg_email: 'Correo electrónico', reg_pass: 'Contraseña', reg_confirm: 'Confirmar Contraseña',
    reg_creating: 'Creando cuenta…', reg_btn: 'Crear Cuenta Gratis',
    reg_have_account: '¿Ya tienes cuenta?', reg_sign_in: 'Iniciar sesión',
    reg_err_username_min: 'Mín. 3 caracteres', reg_err_username_max: 'Máx. 20 caracteres',
    reg_err_username_chars: 'Solo letras, números y guiones bajos',
    reg_err_email: 'Ingresa un email válido', reg_err_pass_min: 'Mín. 8 caracteres',
    reg_err_pass_match: 'Las contraseñas no coinciden', reg_failed: 'Error al crear cuenta. Inténtalo de nuevo.',
    reg_placeholder_username: 'historybuff42',
    reg_placeholder_pass: 'Al menos 8 caracteres', reg_placeholder_confirm: 'Repite tu contraseña',
    // Auth errors
    auth_no_account: 'No se encontró cuenta con ese correo.',
    essay_grading_sub: 'Analizando precisión, calidad del argumento y profundidad…',
    essay_graded: 'Evaluado. Obtuviste una {grade}',
    essay_grade_fail: 'Error en la evaluación. Inténtalo de nuevo.',
    essay_custom_placeholder: 'p. ej. ¿Cómo cambió el Imperio Mongol el comercio en Asia?',
    // AI gateway errors
    ai_err_title: 'Clio no pudo responder',
    ai_err_config: 'El servicio de IA no está configurado. Añade tu clave API en .env.local (VITE_ANTHROPIC_API_KEY) y reinicia la aplicación.',
    ai_err_network: 'Sin conexión con el servicio de IA. Comprueba tu internet e inténtalo de nuevo.',
    ai_err_rate: 'Demasiadas solicitudes. Espera unos segundos y reintenta.',
    ai_err_server: 'El servicio de IA está caído temporalmente. Tu conversación está guardada — reintenta en un momento.',
    ai_err_generic: 'Algo salió mal al contactar con la IA. Tu conversación está guardada — inténtalo de nuevo.',
    ai_err_reconnect: 'Reconectando en {s} s…',
    // Tactical map
    tmap_cat_assets: 'Activos propios', tmap_cat_diplomatic: 'Frentes diplomáticos', tmap_cat_resources: 'Recursos', tmap_cat_enemy: 'Esferas enemigas',
    tmap_annotate: 'Anotar', tmap_ann_pin: 'Colocar pin', tmap_ann_draw: 'Dibujar ruta', tmap_ann_clear: 'Borrar notas', tmap_ann_pin_default: 'Pin de mapa',
    tmap_fog_locked: 'Región inexplorada — haz clic para explorar', tmap_fog_scouted: '¡Región explorada!',
    tmap_tel_faction: 'Facción', tmap_tel_garrison: 'Guarnición', tmap_tel_resources: 'Recursos',
    tmap_tel_hazard: 'Peligro', tmap_tel_battles: 'Batallas', tmap_tel_none: 'Sin registros',
    tmap_timeline: 'Línea de tiempo', year_bce: 'a.C.', year_ce: 'd.C.',
    tmap_hazard_dust: 'Tormentas de polvo', tmap_hazard_frost: 'Heladas y hambruna', tmap_hazard_storm: 'Tormentas marinas', tmap_hazard_scorched: 'Tierra quemada',
    tmap_campaign: 'Campaña', tmap_camp_subtitle: 'Conquista cada región de la historia, era por era', tmap_camp_select: 'Elige una región desbloqueada para comenzar tu conquista',
    tmap_camp_stage: 'Etapa', tmap_camp_question: 'Pregunta', tmap_camp_start: 'Iniciar conquista',
    tmap_camp_retry: 'Reintentar etapa', tmap_camp_continue: 'Siguiente etapa', tmap_camp_conquered: 'Conquistada',
    tmap_camp_locked: 'Bloqueada — conquista primero la región anterior', tmap_camp_victory: '¡Región conquistada!', tmap_camp_defeat: 'Conquista fallida — necesitas al menos 3 de 5 aciertos para reclamar la región.',
    tmap_camp_progress: 'Progreso de campaña', tmap_camp_stars: 'Estrellas', tmap_camp_rank: 'Rango de comandante',
    tmap_camp_rank_1: 'Recluta', tmap_camp_rank_2: 'Capitán', tmap_camp_rank_3: 'General',
    tmap_camp_rank_4: 'Señor de la guerra', tmap_camp_rank_5: 'Estratego',
    tmap_camp_legendary: 'Modo Legendario', tmap_camp_legendary_hint: 'Exclusivo Master — solo cuentan conquistas perfectas, XP duplicada',
    tmap_camp_xp: 'XP ganada', tmap_camp_era_locked: 'La campaña de esta era requiere el plan Master', tmap_camp_no_questions: 'Aún no hay desafíos disponibles para esta región.',
    tmap_genq_belong: '¿Cuál de estos pertenecía a {name}?', tmap_genq_period: '¿En qué período floreció {name}?', tmap_genq_exp: '{answer} forma parte de la historia de {name}.',
    tmap_camp_foe: 'Defensores de {name}', tmap_camp_your_army: 'Tu ejército', tmap_camp_enemy_army: 'Ejército enemigo',
    tmap_unit_infantry: 'Infantería', tmap_unit_archers: 'Arqueros', tmap_unit_cavalry: 'Caballería',
    tmap_battle_brief: 'Responde bien para cargar y romper la línea enemiga. Una respuesta incorrecta les deja contraatacar. Derrota a su ejército para tomar la región.', tmap_battle_start: 'Toca la carga', tmap_battle_round: 'Ronda',
    tmap_battle_hit: '¡Impacto directo!', tmap_battle_counter: '¡Contracarga!', tmap_battle_won: '¡La región es tuya!',
    tmap_battle_lost: 'Tu ejército es derrotado.', tmap_battle_correct: 'golpes acertados', tmap_battle_left: 'restante',
    tmap_chokepoint: 'Punto estratégico',
    prog_ach_summary: 'Has desbloqueado {unlocked} de {total} logros.',
    prog_ach_remaining: '¡Quedan {count} por conseguir!',
    search_no_results: 'Sin resultados para', search_min_chars: 'Escribe al menos 2 caracteres para buscar',
    // Clio memory / AI Studio / Study Plan
    mem_title: 'La memoria de Clío sobre ti', mem_empty: 'Clío aún te está conociendo: chatea con ella y haz cuestionarios, y su memoria se construye automáticamente.',
    mem_interests: 'Tus intereses', mem_strengths: 'Fortalezas', mem_misconceptions: 'Correcciones en curso',
    mem_facts: 'Datos dominados', mem_sessions: 'Notas de sesión', mem_resolved: 'Entendido',
    mem_clear: 'Olvidar todo', mem_clear_confirm_title: '¿Borrar la memoria de Clío?',
    mem_clear_confirm_desc: 'Clío olvidará tus intereses, correcciones e historial de sesiones. Tu XP y progreso no se ven afectados.',
    nav_studio: 'Estudio IA', nav_study_plan: 'Plan de estudio',
    studio_title: 'Estudio de Contenido IA', studio_subtitle: 'Convierte cualquier texto histórico en tarjetas, cuestionarios y datos clave',
    studio_gate_desc: 'El Estudio de Contenido IA está disponible en el plan Pro. Convierte cualquier texto en un kit de estudio personal.',
    studio_paste_label: 'Texto fuente', studio_paste_placeholder: 'Pega aquí un capítulo de libro, un artículo, apuntes de clase o cualquier texto histórico…',
    studio_source_too_short: 'Añade al menos 200 caracteres para que la IA tenga con qué trabajar.',
    studio_focus_label: 'Enfoque (opcional)', studio_focus_placeholder: 'p. ej., táctica militar',
    studio_questions_label: 'Preguntas de cuestionario', studio_cards_label: 'Tarjetas',
    studio_generation_failed: 'La respuesta de la IA no pudo validarse. Inténtalo de nuevo: una nueva ejecución suele arreglarlo.',
    studio_generating: 'Creando tu kit de estudio…', studio_generate: 'Generar kit de estudio',
    studio_checking: 'Comprobando y completando…',
    studio_quality_clean: 'Todo lo generado se basa en tu texto y superó los controles de calidad.',
    studio_quality_title: 'Control de calidad: {n} elemento(s) eliminados',
    studio_quality_short: 'Aún faltan {q} pregunta(s) y {c} tarjeta(s): puede que tu texto no dé para más.',
    studio_quality_hint: 'Lo eliminado no se guardó. Desmarca lo demás que no quieras antes de guardar.',
    studio_issue_ungrounded: 'sin respaldo en tu texto fuente',
    studio_issue_invented: 'citaba una fecha o cifra que no está en tu fuente',
    studio_issue_duplicate: 'repetía un elemento anterior',
    studio_issue_length_bias: 'el {pct}% de las preguntas delatan la respuesta por ser la opción más larga',
    studio_issue_script: 'parte del texto volvió en un alfabeto incorrecto',
    studio_my_sets: 'Mis sets de estudio', studio_no_sets: 'Aún no hay sets de estudio: genera tu primer kit arriba.',
    studio_delete_set: 'Eliminar set', studio_flashcards: 'tarjetas', studio_questions: 'preguntas', studio_best: 'récord',
    studio_practice: 'Practicar', studio_review_cards: 'Tarjetas',
    studio_review_title: 'Revisa el kit generado', studio_review_subtitle: 'Toca cualquier elemento para conservarlo o descartarlo, luego guarda el set.',
    studio_kept: 'conservados', studio_summary: 'Resumen', studio_facts: 'Datos clave', studio_set_name: 'Nombre del set',
    studio_discard: 'Descartar', studio_save_set: 'Guardar set',
    studio_practice_score: 'Puntuación:', studio_done: 'Terminar', studio_show_answer: 'Toca para revelar', studio_next_card: 'Siguiente tarjeta',
    path_title: 'Plan de estudio', path_subtitle: 'Tu semana, diseñada en torno a lo que más necesitas aprender',
    path_mastery_title: 'Dominio por era', path_focus: 'enfoque',
    path_lessons_done: 'Lecciones', path_quiz_score: 'Cuestionario', path_adaptive_acc: 'Adaptativo',
    path_generate: 'Generar mi semana', path_regenerate: 'Regenerar semana', path_refresh: 'Actualizar', path_refreshed: 'Plan actualizado',
    path_enhance: 'Mejorar con Clío', path_enhancing: 'Clío está estudiando tus datos…',
    path_enhance_upsell: 'Las notas de entrenamiento de Clío sobre tu plan son exclusivas de Master Student.',
    path_done_of: 'pasos completados', path_deep_analysis: 'Análisis Master', path_day: 'Día',
    path_empty: 'Genera una semana personalizada: el plan apunta a tu era más débil con lecciones reales, cuestionarios adaptativos y un día final de medición, y se marca solo a medida que aprendes.',
    path_step_lesson: 'Lección', path_step_quiz: 'Cuestionario de era', path_step_smart_quiz: 'Cuestionario inteligente',
    path_step_flashcards: 'Repaso de tarjetas', path_step_studio: 'Sesión de Estudio IA', path_step_crisis: 'Simulación de crisis', path_step_map: 'Mapa de territorios',
    path_min: 'min', path_mark_done: 'Marcar como hecho',
    path_rhythm_title: 'Creado a partir de cómo estudias de verdad',
    path_rhythm_active: 'días activos', path_rhythm_session: 'Sesión habitual',
    path_rhythm_scheduled: 'Programado', path_rhythm_no_data: 'aún sin sesiones',
    path_days_label: 'días de estudio', path_min_per_day: 'min/día',
    path_returning: 'Bienvenido de nuevo: la semana empieza con repaso antes del material nuevo.',
    path_mode_coverage: 'Enfoque en lectura', path_mode_retention: 'Enfoque en memoria', path_mode_balanced: 'Equilibrado',
    path_mode_coverage_why: 'Gran parte de tu era prioritaria sigue sin leer, así que esta semana se apoya en lecciones nuevas.',
    path_mode_retention_why: 'Has leído el material pero no se te queda, así que esta semana se apoya en la práctica de recuerdo en vez de más lectura.',
    path_mode_balanced_why: 'Tu lectura y tu memoria van a la par, así que esta semana alterna entre ambas.',
    path_stale_title: 'Este plan ya no encaja contigo',
    path_stale_complete: 'Has terminado todos los pasos: toca la semana siguiente.',
    path_stale_expired: 'El plan ha superado la semana que programaba',
    path_stale_days_old: 'días de antigüedad', path_stale_focus: 'Tu enfoque ha pasado a',
    // Philosopher memory / Flashcards gate / Battle tactics
    pmem_title: 'La memoria de {name} sobre ti', pmem_empty: 'Aún no hay debates registrados — discute con ellos y recordarán cada postura que tomes.',
    pmem_debates: 'debates', pmem_wins: 'concesiones ganadas', pmem_stances: 'Posturas que defendiste',
    pmem_concessions: 'Puntos que concediste', pmem_strong: 'Tus mejores argumentos', pmem_style: 'Tu estilo',
    pmem_clear: 'Borrar esta rivalidad', pmem_clear_title: '¿Borrar este historial de debates?',
    pmem_clear_desc: 'El filósofo olvidará cada postura, concesión y victoria entre vosotros. Tu XP no se ve afectado.',
    flash_gate_desc: 'Las tarjetas se desbloquean en el plan Beginner Student. Practica datos clave de cada lección con tarjetas 3D.',
    tmap_battle_brief2: 'Cada ronda: elige una táctica en el consejo de guerra y responde la orden. Correcto — golpea tu táctica. Incorrecto — golpea la suya. La carga vence a la descarga, la descarga vence al muro de escudos, el muro de escudos vence a la carga. Rompe su ejército — o su moral.',
    tmap_battle_council: 'Consejo de guerra — elige tu táctica', tmap_battle_order: 'La orden',
    tmap_battle_rout: '¡LA LÍNEA SE ROMPE!', tmap_battle_crit: '¡GOLPE DE DERROTA!',
    tmap_battle_advantage: '¡Ventaja táctica!', tmap_battle_outmaneuvered: '¡Superado en maniobra!', tmap_battle_morale: 'Moral',
    tmap_tactic_charge: 'Carga', tmap_tactic_volley: 'Descarga', tmap_tactic_hold: 'Muro de escudos',
    tmap_tactic_charge_hint: 'Rompe descargas · cae ante una línea firme',
    tmap_tactic_volley_hint: 'Destroza una línea firme · arrollada por una carga',
    tmap_tactic_hold_hint: 'Detiene una carga en seco · indefenso bajo una descarga',
  },

  ru: {
    nav_dashboard: 'Панель', nav_eras: 'Эпохи и Уроки', nav_timeline: 'Хронология',
    nav_tutor: 'ИИ-Наставник', nav_leaderboard: 'Рейтинг', nav_friends: 'Друзья',
    nav_flashcards: 'Карточки', nav_notes: 'Мои Заметки', nav_progress: 'Прогресс',
    nav_smart_quiz: 'Умная Викторина', nav_essay: 'Эссе-Задание', nav_video_review: 'Обзор Видео',
    nav_debate: 'Дискуссия с Философом',
    nav_crisis: 'Кризисный штаб',
    nav_imperium: 'Chronos Imperium',
    crisis_title: 'Кризисный штаб «Хронос»',
    crisis_subtitle: 'Окажитесь в поворотном моменте истории и примите решения сами',
    crisis_back: 'Все сценарии',
    crisis_begin: 'Начать симуляцию',
    crisis_abandon: 'Покинуть таймлайн',
    crisis_placeholder: 'Введите своё решение — выберите вариант или идите своим путём…',
    crisis_master_only: 'Кризисный штаб «Хронос» доступен только на плане Master Student — полные контрфактические симуляции с оценкой ИИ в реальном времени.',
    crisis_turn: 'Ход', crisis_stability: 'Стабильность', crisis_legitimacy: 'Легитимность', crisis_legacy: 'Наследие',
    crisis_decisions: 'Журнал решений', crisis_verdict: 'Итоговый вердикт',
    crisis_dc: 'Дипломатический капитал', crisis_mr: 'Боеготовность', crisis_treasury: 'Казна', crisis_consequence: 'Последствие',
    crisis_risk_low: 'Низкий', crisis_risk_med: 'Средний', crisis_risk_high: 'Высокий',
    crisis_assess_title: 'Стратегическая оценка', crisis_assess_cta: 'Запросить стратегическую оценку', crisis_assess_sub: 'Трибунал Хроноса оценивает всю вашу кампанию по пяти измерениям',
    crisis_assess_loading: 'Трибунал совещается…', crisis_assess_score: 'Оценка командования', crisis_assess_xp: 'Получено XP',
    crisis_assess_m_foresight: 'Стратегическое предвидение', crisis_assess_m_judgment: 'Историческое суждение', crisis_assess_m_stewardship: 'Управление ресурсами',
    crisis_assess_m_decisiveness: 'Решительность', crisis_assess_m_adaptability: 'Адаптивность',
    crisis_assess_strengths: 'Сильные стороны', crisis_assess_improve: 'Что улучшить',
    crisis_assess_counterfactual: 'Как поступила история', crisis_assess_rerun: 'Созвать Трибунал заново',
    nav_profile: 'Профиль', nav_guide: 'Руководство', nav_report: 'Сообщить об ошибке',
    nav_upgrade: 'Обновить план', nav_logout: 'Выйти',
    nav_group_chronicles: 'Хроники', nav_group_academy: 'Академия', nav_group_agora: 'Агора', nav_group_ledger: 'Реестр',
    notif_title: 'Уведомления', notif_empty: 'Ничего нового — поддержите свою серию сегодня!',
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
    daily_submit: 'Ответить', daily_correct: 'Правильно! +15 XP',
    daily_wrong: 'Правильный ответ:', daily_tomorrow: 'Возвращайтесь завтра за новым заданием!',
    achievement_unlocked: 'Достижение Разблокировано!',
    difficulty_easy: 'Лёгкий', difficulty_medium: 'Средний', difficulty_hard: 'Сложный',
    era_short_prehistoric: 'Доистория', era_short_byzantine: 'Византия', era_short_ancient: 'Древний', era_short_medieval: 'Средневековье', era_short_earlymod: 'Раннее Новое', era_short_modern: 'Современный',
    eras_title: 'Эпохи и Уроки', eras_subtitle: 'Выберите эпоху и начните путешествие',
    eras_lessons_label: 'уроков', eras_take_quiz: 'Пройти Викторину',
    eras_view_lessons: 'Смотреть Уроки', eras_locked: 'Заблокировано', eras_completed: 'Пройдено',
    eras_quiz_label: 'Викторина', eras_lessons_count: 'уроков',
    lesson_key_facts: 'Ключевые Факты', lesson_min_read: 'мин чтения',
    lesson_complete_btn: 'Отметить как завершённый', lesson_already_done: 'Урок завершён', toast_lesson_complete: 'Урок завершён! +{xp} XP', toast_bookmarked: 'Урок добавлен в закладки!', toast_bookmark_removed: 'Закладка удалена.',
    lesson_next: 'Следующий Урок', lesson_prev: 'Предыдущий Урок',
    lesson_take_quiz: 'Пройти Викторину', lesson_discuss: 'Обсудить с Клио',
    lesson_notes_title: 'Мои Заметки',
    lesson_bookmarked: 'Сохранено', lesson_save: 'Сохранить Урок', lesson_eras_breadcrumb: 'Эпохи',
    quiz_correct: 'Правильно!', quiz_incorrect: 'Не совсем.', quiz_score: 'Счёт',
    quiz_xp_earned: 'XP получено', quiz_performance_by_era: 'Результаты по Эпохам',
    quiz_clio_rec: 'Рекомендация Клио', quiz_clio_thinking: 'Клио думает…',
    quiz_weak_areas: 'Обнаруженные слабые места', quiz_no_weak_areas: 'Слабые места ещё не обнаружены.',
    quiz_adaptive: 'Адаптивный', quiz_earn_xp: 'Зарабатывай XP', quiz_questions: 'Вопросы',
    quiz_era_title: 'Викторина', quiz_complete: 'Викторина завершена', quiz_passed: 'Пройдено!',
    quiz_failed: 'Продолжай практиковаться', quiz_retake: 'Пройти снова',
    quiz_submit_answer: 'Ответить', quiz_explanation: 'Объяснение', quiz_correct_label: 'верно',
    quiz_test_knowledge: 'Проверь свои знания о {era}',
    quiz_passing_score: 'Проходной балл: {score}% · Макс. XP: {xp}',
    quiz_question_of: 'Вопрос {n} из {total}',
    quiz_upgrade_explanations: 'Обновитесь до Pro, чтобы видеть объяснения ответов.',
    quiz_not_found: 'Викторина не найдена.',
    sq_clio_fallback: 'Отличная работа! Сосредоточься на повторении эпох, где ты испытывал трудности, и повтори те уроки для максимального роста.',
    sq_plan_title: 'Учебный план Клио', sq_plan_focus: 'Зоны внимания', sq_plan_steps: 'Ваш план из 3 шагов',
    sq_plan_forecast: 'Прогноз на следующую сессию', sq_plan_master: 'Разбор заблуждений', sq_plan_min: 'мин', sq_plan_open: 'Открыть урок',
    sq_upgrade_desc: 'Умная Викторина использует адаптивный алгоритм, который нацелен на твои слабые эпохи и калибрует сложность по твоему уровню. Доступно на Pro Learner и выше.',
    tl_title: 'Историческая Хронология', tl_subtitle: 'С 3100 г. до н.э. по сегодняшний день',
    tl_events: 'событий', tl_all_eras: 'Все Эпохи', tl_all_categories: 'Все Категории',
    tl_open_lesson: 'Открыть Урок',
    tutor_hello: 'Привет, я Клио — ваш проводник по истории!', tutor_examples: 'Или загрузите пример диалога',
    tutor_history: 'История', tutor_thread_first: 'Первый разговор', tutor_thread_untitled: 'Новый разговор', tutor_desc: 'Добро пожаловать! Я — Муза Истории, и я помогу вам понять прошлое. Спрашивайте о чём угодно — о битве, империи, странном обычае или "почему это случилось?" — я объясню ясно, свяжу с общей картиной и помогу запомнить. Впервые здесь? Попробуйте подсказку ниже, повторите со мной урок или просто скажите, что вам интересно.',
    tutor_placeholder: 'Спросите Клио о любом историческом событии…', tutor_new_chat: 'Новый Чат',
    tutor_attach_image: 'Прикрепить изображение', tutor_image_ready: 'Изображение готово — отправьте его Клио',
    tutor_clear_title: 'Очистить этот разговор', tutor_clear_confirm: 'Очистить этот разговор? Сообщения будут безвозвратно удалены из этой ветки.',
    tutor_upgrade_msg: 'Обновите план, чтобы использовать ИИ-Наставника',
    lb_title: 'Рейтинг', lb_subtitle: 'Лучшие ученики, отсортированные по общему XP.',
    lb_your_rank: 'Ваш Рейтинг', lb_full_rankings: 'Полный Рейтинг', lb_you: '(Вы)',
    lb_chess_rank: 'Шахматный Ранг', lb_level: 'Уровень', lb_streak: 'Серия',
    lb_xp_regular: 'Обычный XP', lb_xp_video: 'Видео XP', lb_score: 'Рейтинговый Счёт',
    fr_title: 'Друзья', fr_subtitle: 'Общайтесь с другими любителями истории',
    fr_search: 'Поиск пользователей…', fr_tab_friends: 'Друзья', fr_tab_requests: 'Запросы',
    fr_tab_sent: 'Отправленные', fr_add: 'Добавить в Друзья', fr_pending: 'Ожидание',
    fr_message: 'Сообщение', fr_duel: 'Дуэль 1x1', fr_msg_title: 'Чат с {name}', fr_msg_placeholder: 'Напишите сообщение…',
    fr_msg_empty: 'Поздоровайтесь — или вызовите на Историческую дуэль 1x1!', fr_msg_send: 'Отправить',
    fr_find_users: 'Найти пользователей',
    fr_no_results: 'Не найдено пользователей по запросу',
    fr_toast_request_sent: 'Заявка в друзья отправлена',
    fr_toast_request_failed: 'Не получилось — попробуйте ещё раз.',
    fr_wants_to_be_friend: 'Хочет добавить вас в друзья',
    fr_cancel_request: 'Отменить',
    fr_net_signin: 'Войдите, чтобы общаться с другими учениками',
    fr_net_local: 'Демонстрационные друзья — без подключения к серверу',
    fr_toast_now_friend: 'Новый друг добавлен',
    fr_toast_declined: 'Заявка отклонена',
    fr_toast_removed: 'Друг удалён',
    fr_request_pending: 'Заявка на рассмотрении',
    fr_online: 'В сети',
    fr_streak_word: 'Серия',
    fr_unread: 'Непрочитанные сообщения',
    fr_gift_failed: 'Не удалось отправить подарок.',
    fr_net_live: 'Онлайн · сервер подключён',
    fr_net_offline: 'Офлайн-режим · данные локально',
    fr_tab_activity: 'Активность',
    fr_activity_empty: 'Пока ничего не произошло — добавьте друга, чтобы видеть его активность здесь.',
    fr_act_added: 'теперь ваш друг',
    fr_act_duel_win: 'вы выиграли дуэль',
    fr_act_duel_loss: 'вы проиграли дуэль',
    fr_act_message: 'обмен сообщениями',
    fr_act_gift: 'вы отправили подарок',
    fr_act_lesson: 'прошёл урок',
    fr_act_quiz: 'результат викторины',
    fr_act_streak: 'держит серию',
    fr_act_xp: 'достиг',
    fr_act_simulated: 'Смоделированная активность — за этими друзьями нет сервера',
    fr_act_sim_short: 'сим',
    fr_time_now: 'только что',
    unit_min_short: 'м',
    unit_hour_short: 'ч',
    unit_day_short: 'д',
    fr_reply_1: 'Удачи в следующей дуэли! ⚔️',
    fr_reply_2: 'Ты уже прошёл урок об эпохе викингов?',
    fr_reply_3: 'Я только что набрал серию в 7 дней 🔥',
    fr_reply_4: 'Кризис при Гавгамелах — жесть. Как справился?',
    fr_reply_5: 'Кто первым доберётся до вершины рейтинга?',
    fr_reply_6: 'Рим или Греция — какая эпоха твоя любимая?',
    fr_reply_7: 'Вызывай меня на «Историю 1 на 1», когда будешь готов.',
    fr_duel_title: 'История 1x1', fr_duel_begin: 'Начать дуэль', fr_duel_youhit: 'Точный удар!', fr_duel_foehit: '{name} наносит удар!',
    fr_duel_clash: 'Клинки скрестились — оба ранены!', fr_duel_miss: 'Оба промахнулись!', fr_duel_victory: 'Победа!', fr_duel_defeat: 'Поражение',
    fr_duel_won_desc: 'Вы одолели {name} на поле {field}.', fr_duel_lost_desc: '{name} победил на этот раз. Реванш, когда будете готовы.', fr_duel_done: 'Покинуть арену', fr_duel_record: 'Счёт дуэлей',
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
    notes_new_note: 'Новая Заметка', notes_deleted: 'Заметка удалена.', notes_none: 'Заметок пока нет', notes_none_filter: 'Нет заметок для этой эпохи', notes_hint: 'Нажмите «+ Новая Заметка», чтобы записывать мысли во время учёбы.', notes_untitled: 'Заметка без названия', notes_count: 'заметок сохранено',
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
    sq_stats_title: 'Ваша Статистика', sq_history_title: 'История сессий', sq_history_open: 'Посмотреть все сессии', sq_duration: 'Длительность', sq_history_back: 'Назад к Умной Викторине', sq_sessions: 'Сессий', sq_avg_score: 'Средний Балл',
    sq_best_score: 'Лучший Балл', sq_total_xp: 'Всего XP', sq_era_breakdown: 'Накопленный результат по Эпохам',
    sq_no_sessions: 'Сессий пока нет — пройдите первую Умную Викторину!',
    sq_correct_label: 'верно', sq_perf_era: 'Результаты по Эпохам',
    sq_new: 'Новая Сессия', sq_back_intro: 'Вернуться',
    sq_outstanding: '🏆 Отлично! Вы осваиваете историю.',
    sq_great: '✅ Хорошая работа! Продолжайте в том же духе.',
    sq_good: '📚 Неплохо — повторите слабые области.',
    sq_keep_going: '💡 Продолжайте учиться — каждая попытка делает вас сильнее.',
    sq_questions_desc: 'Из всех 4 эпох',
    sq_correct_xp: 'верно · +{xp} XP получено',
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
    guide_features: '19 Функций', guide_quick_start: 'Быстрый Старт',
    guide_faq_title: 'Часто Задаваемые Вопросы', guide_start_lesson: 'Начать Урок',
    guide_see_plans: 'Посмотреть Планы', guide_cta_title: 'Готовы начать своё путешествие?',
    guide_cta_desc: 'Перейдите в Панель, чтобы увидеть прогресс, или сразу начните урок.',
    guide_dashboard: 'Панель', guide_start_learning: 'Начать учёбу', guide_step: 'Шаг',
    guide_free_pro: 'Бесплатный и Pro', guide_qs_desc: 'Впервые здесь? Начните с урока в разделе «Эпохи и Уроки», затем пройдите викторину по эпохе, чтобы получить XP. Освоившись с приложением, обновитесь до Pro для доступа ко всем 132 урокам и Наставнику.',
    report_title: 'Сообщить об ошибке', report_subtitle: 'Помогите нам улучшить Historify',
    report_placeholder: 'Опишите проблему, с которой вы столкнулись…',
    report_submit: 'Отправить', report_thanks: 'Спасибо! Ваш отчёт получен.',
    report_type: 'Тип проблемы',
    pricing_title: 'Выберите свой учебный план', pricing_subtitle: 'От лёгкого изучения до мастерства — план для каждого.',
    pricing_guarantee: '30-дневная гарантия возврата денег на все платные планы — полный возврат без лишних вопросов.',
    gift_btn: 'Подарить план',
    gift_title: 'Подарить подписку',
    gift_desc: 'Подарите {name} месяц платного плана. Ваша награда: скидка 50% на ваше следующее продление.',
    gift_send: 'Отправить подарок',
    gift_sent: 'Подарок отправлен! У {name} теперь месяц плана {plan} — а вы получили скидку 50% на следующее продление.',
    gift_reward_badge: 'Скидка 50% на следующее продление',
    pricing_current: 'Текущий план', pricing_select: 'Начать', pricing_month: '/мес',
    pricing_trial_note: '5 дней бесплатно — отмена в любой момент',
    pricing_free_label: 'Бесплатно', pricing_back: 'Назад',
    // Debate
    debate_title: 'Дискуссия с Философом', debate_subtitle: 'Бросьте вызов великим мыслителям истории',
    debate_today: 'Философ Дня', debate_xp_reward: 'XP за победу',
    debate_placeholder: 'Представьте свой философский аргумент…',
    debate_new_round: 'Новый Раунд', debate_pro_only: 'Дискуссия с философом доступна в планах Pro и Master.',
    debate_won_title: 'Вы выиграли дискуссию!', debate_won_desc: 'признал вашу правоту.',
    debate_already_won: 'Вы уже победили сегодняшнего философа!',
    debate_next_in: 'Новый философ через', debate_starters: 'Вступительные Аргументы',
    debate_start_arg: 'Оспорить эту позицию',
    // AI Tutor extended
    tutor_subtitle: 'ИИ-Наставник по Истории · Муза Истории',
    sugg_1: 'Что стало причиной падения Римской империи?', sugg_2: 'Объясните Крестовые походы простыми словами',
    sugg_3: 'Почему Ренессанс был так важен?', sugg_4: 'Как Первая мировая привела ко Второй?',
    sugg_5: 'Кто были величайшие философы древности?', sugg_6: 'Что такое Шёлковый путь и почему он важен?',
    // Essay extended
    essay_tip_1: 'Укажите конкретные даты', essay_tip_2: 'Назовите ключевые фигуры',
    essay_tip_3: 'Сформулируйте чёткий аргумент', essay_tip_4: 'Используйте исторические факты',
    essay_score_breakdown: 'Разбивка Оценок', essay_strong_points: 'Сильные Стороны',
    essay_missing_points: 'Упущенные Моменты', essay_accuracy: 'Историческая Точность',
    essay_argument_quality: 'Качество Аргументации', essay_depth_detail: 'Глубина и Детали',
    essay_overall: 'Итого', essay_study_more: 'Учиться дальше', essay_your_essay: 'Ваше Эссе',
    // Progress extended
    prog_lessons_by_era: 'Уроки по Эпохам', prog_analysis_title: 'Анализы Клио', prog_analysis_passes: 'сдано', prog_analysis_avg: 'средний балл', prog_analysis_best: 'лучшая оценка', prog_analysis_empty: 'Завершите урок и сдайте письменный анализ, чтобы увидеть здесь свои результаты.', prog_time_title: 'Вложенное время', prog_time_total: 'всего времени на учёбу', prog_momentum_title: 'Темп обучения', prog_momentum_active: 'активных дней из последних 14', prog_quiz_by_era: 'Результаты Викторин по Эпохам',
    prog_knowledge_radar: 'Радар Знаний', prog_xp_timeline: 'История Активности XP',
    prog_radar_desc: 'Прохождение уроков + результат викторины по эпохам',
    prog_adv_analytics_title: 'Расширенная Аналитика — Pro',
    prog_adv_analytics_desc: 'Обновите план для доступа к интерактивным графикам, радару знаний и анализу достижений.',
    prog_no_quiz: 'Пройдите викторину, чтобы увидеть результаты.',
    prog_no_xp: 'Начните учиться, чтобы увидеть историю XP.',
    prog_quiz_score_chart: 'График Результатов', prog_xp_activity_graph: 'График Активности XP',
    prog_knowledge_radar_chart: 'Радар Знаний', prog_upgrade_cta: 'Обновить до Pro — $10/мес',
    tl_major: 'Крупное', tl_free_only: 'Бесплатный план: только крупные события',
    tl_filter_title: 'Фильтры Хронологии', tl_filter_desc: 'Обновите до Pro для фильтрации по эпохе и категории и просмотра всех событий.',
    tl_lesson_locked: 'Урок Заблокирован', tl_lesson_locked_pro: 'Обновите до Pro для доступа',
    tl_go_to: 'Перейти:', tl_explore_era: 'Изучить Эпоху',
    cat_war: 'Война', cat_politics: 'Политика', cat_science: 'Наука', cat_culture: 'Культура', cat_religion: 'Религия', cat_exploration: 'Исследования',
    debate_continue_btn: 'Продолжить Дискуссию',
    sidebar_streak: ' дн.',
    pricing_faq: 'Часто Задаваемые Вопросы', pricing_cur_btn: 'Текущий план',
    pricing_upgrade_to: 'Обновить до', pricing_downgrade_free: 'Снизить до Бесплатного', pricing_switch_to: 'Переключить на',
    pricing_faq_q1: 'Можно ли отменить в любое время?', pricing_faq_a1: 'Да. Снизьте до бесплатного плана в настройках профиля — без обязательств.',
    pricing_faq_q2: 'Что будет с прогрессом при снижении плана?', pricing_faq_a2: 'Весь ваш XP, достижения и пройденные уроки сохраняются навсегда независимо от плана.',
    pricing_faq_q3: 'Безопасна ли оплата?', pricing_faq_a3: 'В этом демо выбор плана симулируется. Реальные платежи использовали бы Stripe с полным соответствием PCI.',
    pricing_faq_q4: 'Что считается сообщением ИИ?', pricing_faq_a4: 'Каждое сообщение Наставнику ИИ считается одним. Ответы Наставника не учитываются.',
    pricing_price_free: 'Бесплатно',
    report_cat_bug: 'Сообщение об ошибке', report_cat_bug_desc: 'Что-то сломано или не работает',
    report_cat_feature: 'Запрос функции', report_cat_feature_desc: 'Предложить новую функцию или улучшение',
    report_cat_content: 'Проблема с контентом', report_cat_content_desc: 'Неверная или отсутствующая историческая информация',
    report_cat_other: 'Другое', report_cat_other_desc: 'Общий отзыв или что-то ещё',
    report_pri_low: 'Низкая', report_pri_medium: 'Средняя', report_pri_high: 'Высокая',
    report_category_label: 'Категория', report_category_hint: 'Какой тип проблемы вы сообщаете?',
    report_priority_label: 'Приоритет', report_priority_hint: 'Насколько сильно это влияет на ваш опыт?',
    report_subject_label: 'Тема', report_subject_hint: 'Краткое описание проблемы',
    report_desc_label: 'Описание', report_desc_hint: 'Опишите проблему подробно.',
    report_submit_btn: 'Отправить отчёт', report_submitting: 'Отправка…',
    report_submitted_title: 'Отчёт отправлен', report_submitted_msg: 'Спасибо, что нашли время сообщить об этом. Ваш отзыв помогает нам улучшить Historify.',
    report_another: 'Отправить ещё один отчёт', report_priority_badge: 'Приоритет:',
    prof_bookmarks: 'Закладки', prof_no_bookmarks: 'Закладок пока нет', prof_no_bookmarks_hint: 'Нажмите значок закладки на любом уроке, чтобы сохранить его здесь.',
    prof_historical_rank: 'Исторический Ранг', prof_change_plan: 'Изменить план',
    prof_danger_zone: 'Опасная зона',
    prof_reset_title: 'Сбросить весь прогресс', prof_reset_desc: 'Удаляет XP, уроки и результаты навсегда.',
    prof_reset_confirm: 'Сбросить весь прогресс?', prof_reset_confirm_desc: 'Это безвозвратно удалит весь ваш XP, пройденные уроки, результаты и достижения.',
    prof_reset_yes: 'Да, сбросить всё',
    prof_toast_image_too_big: 'Изображение должно быть меньше 2 МБ.',
    prof_toast_image_bad_type: 'Принимаются только изображения PNG, JPEG, WEBP или GIF.',
    prof_toast_avatar_set: 'Фото профиля обновлено!',
    prof_toast_avatar_removed: 'Фото профиля удалено.',
    prof_toast_name_short: 'Имя пользователя должно содержать не менее 3 символов.',
    prof_toast_name_saved: 'Имя пользователя обновлено!',
    prof_toast_email_invalid: 'Введите корректный адрес почты.',
    prof_toast_email_saved: 'Почта обновлена!',
    prof_toast_email_failed: 'Не удалось обновить почту.',
    prof_toast_pwd_short: 'Новый пароль должен содержать не менее 6 символов.',
    prof_toast_pwd_mismatch: 'Пароли не совпадают.',
    prof_toast_pwd_saved: 'Пароль обновлён!',
    prof_toast_pwd_failed: 'Не удалось обновить пароль.',
    prof_toast_2fa_code: 'Введите корректный 6-значный код.',
    prof_toast_2fa_on: 'Двухфакторная аутентификация включена!',
    prof_toast_2fa_off: '2FA отключена.',
    prof_toast_pref_saved: 'Настройка сохранена.',
    prof_toast_reset: 'Прогресс сброшен.',
    prof_toast_pdf_soon: 'Скачивание PDF скоро появится!',
    prof_inspired_by: 'Вдохновлено:',
    prof_video_xp: 'Видео-XP',
    prof_next_rank_in: 'До следующего ранга',
    prof_max_rank: 'МАКС. РАНГ',
    prof_renews: 'Продление',
    prof_download_notes: 'Скачать конспекты уроков (PDF)',
    prof_demo_secret: 'демо-ключ',
    prof_rhythm_title: 'Ритм занятий',
    prof_rhythm_days_studied: 'дней занятий',
    prof_rhythm_empty: 'Дни занятий появятся здесь, как только вы начнёте урок.',
    prof_rhythm_less: 'Меньше',
    prof_rhythm_more: 'Больше',
    prof_rhythm_this_week: 'На этой неделе',
    prof_records_title: 'Личные рекорды',
    prof_rec_total_time: 'Всего времени вложено',
    prof_rec_longest_streak: 'Самая длинная серия',
    prof_rec_days: 'дн.',
    prof_rec_best_quiz: 'Лучший результат викторины',
    prof_rec_favourite_era: 'Больше всего изучено',
    prof_rec_perfect_quizzes: 'Идеальных викторин',
    prof_rec_best_day: 'Лучший день',
    prof_milestones_title: 'Ближайшие достижения',
    unit_day_one: 'день',
    unit_day_few: 'дня',
    unit_day_many: 'дней',
    streak_start_today: 'Начните свою серию сегодня!',
    level_short: 'Ур.',
    level_xp_to: 'XP до уровня',
    flash_shuffle: 'Перемешать', flash_answer: 'Ответ', flash_no_cards: 'Карточки для этого фильтра не найдены.',
    prof_reset_btn: 'Сбросить',
    // Profile Settings
    prof_picture: 'Фото профиля', prof_change_photo: 'Изменить фото', prof_upload_photo_btn: 'Загрузить фото', prof_remove_photo_btn: 'Удалить',
    prof_display_name: 'Имя пользователя', prof_save_btn: 'Сохранить',
    prof_change_email: 'Изменить email', prof_current_email: 'Текущий:', prof_new_email: 'Новый email', prof_cur_password: 'Текущий пароль', prof_update_email: 'Обновить email', prof_updating: 'Обновление…',
    prof_change_password: 'Изменить пароль', prof_new_password: 'Новый пароль', prof_confirm_password: 'Подтвердить новый пароль', prof_update_password: 'Обновить пароль',
    prof_min_chars: 'Мин. 6 символов', prof_repeat_pwd: 'Повторите пароль',
    prof_2fa_title: 'Двухфакторная аутентификация', prof_2fa_enabled_msg: '2FA включена', prof_2fa_disabled_msg: '2FA отключена',
    prof_2fa_enabled_desc: 'Ваш аккаунт защищён приложением-аутентификатором.', prof_2fa_disabled_desc: 'Добавьте дополнительный уровень защиты для вашего аккаунта.',
    prof_2fa_disable: 'Отключить', prof_2fa_enable: 'Включить',
    prof_notif_title: 'Настройки уведомлений', prof_notif_reminders: 'Напоминания об уроках', prof_notif_reminders_desc: 'Получайте напоминания для поддержания серии обучения.',
    prof_notif_achievements: 'Оповещения о достижениях', prof_notif_achievements_desc: 'Уведомлять при разблокировке нового достижения.',
    prof_notif_weekly: 'Еженедельный отчёт о прогрессе', prof_notif_weekly_desc: 'Сводка вашей учебной активности за неделю.',
    prof_dark_mode: 'Тёмный режим',
    prof_setup_2fa: 'Настроить 2FA', prof_2fa_scan: 'Отсканируйте QR-код с помощью приложения-аутентификатора (Google Authenticator, Authy и др.).', prof_2fa_enter_code: 'Введите 6-значный код из приложения', prof_2fa_verify: 'Подтвердить и включить', prof_2fa_backup: 'Резервные коды (сохраните их в надёжном месте):',
    map_key_locations: 'Ключевые места',
    map_zoom_hint: 'Прокрутите для масштаба · Перетащите для перемещения',
    nav_timeline_map: 'Карта Территорий',
    tmap_title: 'Карта исторических территорий',
    tmap_subtitle: 'Исследуйте реальные географические территории каждого исторического периода',
    tmap_select_topic: 'Выберите тему, чтобы увидеть её территорию',
    tmap_layers: 'Слои', tmap_style: 'Стиль карты', tmap_explore: 'Исследовать', tmap_story: 'История', tmap_quiz: 'Викторина',
    tmap_layer_territory: 'Территория', tmap_layer_capitals: 'Столицы', tmap_layer_cities: 'Города',
    tmap_layer_battles: 'Сражения', tmap_layer_ports: 'Порты', tmap_layer_resources: 'Ресурсы', tmap_layer_routes: 'Маршруты',
    tmap_style_dark: 'Тёмная классика', tmap_style_parchment: 'Пергамент', tmap_style_military: 'Военный',
    tmap_style_terrain: 'Рельеф', tmap_style_clean: 'Светлый', tmap_style_satellite: 'Спутник',
    tmap_quiz_q: 'Какая территория/империя показана?', tmap_quiz_correct: 'Правильно! +50 XP', tmap_quiz_wrong: 'Неверно — это был(а)',
    tmap_quiz_xp: '+50 XP', tmap_quiz_next: 'Следующий вопрос', tmap_quiz_score: 'Счёт',
    tmap_story_play: 'Играть', tmap_story_pause: 'Пауза', tmap_story_prev: 'Назад', tmap_story_next: 'Далее',
    tmap_markers: 'маркеров', tmap_period: 'Период',
    tmap_perspective: 'Вид', tmap_perspective_all: 'Все', tmap_perspective_military: 'Военный',
    tmap_perspective_trade: 'Торговля', tmap_perspective_scholar: 'Учёный',
    tmap_year: 'Год', tmap_what_if: 'А что, если?', tmap_pro_only: 'Карта территорий требует план Pro',
    tmap_what_if_desc: 'Исследуйте контрфактическую историю', tmap_year_range: 'Диапазон лет', tmap_animate: 'Анимация',
    tmap_causality: 'Исторический контекст', tmap_territories_hint: 'исторических территорий в 6 эпохах',
    essay_select_topic: 'Выберите тему выше',
    essay_write_more: 'Напишите ещё не менее {n} слов',
    essay_too_long: 'Эссе слишком длинное (макс. 600 слов)',
    // Login
    login_title: 'Добро Пожаловать', login_desc: 'Войдите, чтобы продолжить путешествие',
    login_email: 'Эл. почта', login_password: 'Пароль',
    login_signing_in: 'Вход…', login_btn: 'Войти',
    login_no_account: 'Нет аккаунта?', login_create: 'Создайте бесплатно',
    login_err_email: 'Введите действительный email', login_err_pass: 'Требуется пароль',
    login_failed: 'Ошибка входа. Проверьте email и пароль.',
    // Register
    reg_title: 'Начните Путешествие', reg_desc: 'Создайте бесплатный аккаунт — карта не нужна',
    reg_username: 'Имя пользователя', reg_email: 'Эл. почта', reg_pass: 'Пароль', reg_confirm: 'Подтвердите Пароль',
    reg_creating: 'Создание аккаунта…', reg_btn: 'Создать Бесплатный Аккаунт',
    reg_have_account: 'Уже есть аккаунт?', reg_sign_in: 'Войти',
    reg_err_username_min: 'Минимум 3 символа', reg_err_username_max: 'Максимум 20 символов',
    reg_err_username_chars: 'Только буквы, цифры и подчёркивания',
    reg_err_email: 'Введите действительный email', reg_err_pass_min: 'Минимум 8 символов',
    reg_err_pass_match: 'Пароли не совпадают', reg_failed: 'Ошибка создания аккаунта. Попробуйте снова.',
    reg_placeholder_username: 'historybuff42',
    reg_placeholder_pass: 'Не менее 8 символов', reg_placeholder_confirm: 'Повторите пароль',
    // Auth errors
    auth_no_account: 'Аккаунт с таким email не найден.',
    essay_grading_sub: 'Анализ точности, качества аргументов и глубины…',
    essay_graded: 'Оценено! Вы получили {grade}',
    essay_grade_fail: 'Ошибка оценки. Попробуйте снова.',
    essay_custom_placeholder: 'напр. Как Монгольская империя изменила торговлю в Азии?',
    // AI gateway errors
    ai_err_title: 'Клио не смогла ответить',
    ai_err_config: 'Сервис ИИ не настроен. Добавьте ключ API в .env.local (VITE_ANTHROPIC_API_KEY) и перезапустите приложение.',
    ai_err_network: 'Нет соединения с сервисом ИИ. Проверьте интернет и попробуйте снова.',
    ai_err_rate: 'Слишком много запросов. Подождите несколько секунд и повторите.',
    ai_err_server: 'Сервис ИИ временно недоступен. Ваш диалог сохранён — повторите чуть позже.',
    ai_err_generic: 'Не удалось связаться с ИИ. Ваш диалог сохранён — попробуйте ещё раз.',
    ai_err_reconnect: 'Повторное подключение через {s} с…',
    // Tactical map
    tmap_cat_assets: 'Свои активы', tmap_cat_diplomatic: 'Дипломатические фронты', tmap_cat_resources: 'Ресурсы', tmap_cat_enemy: 'Вражеские сферы',
    tmap_annotate: 'Аннотации', tmap_ann_pin: 'Поставить метку', tmap_ann_draw: 'Нарисовать путь', tmap_ann_clear: 'Очистить заметки', tmap_ann_pin_default: 'Метка',
    tmap_fog_locked: 'Неизведанный регион — нажмите для разведки', tmap_fog_scouted: 'Регион разведан!',
    tmap_tel_faction: 'Фракция', tmap_tel_garrison: 'Гарнизон', tmap_tel_resources: 'Ресурсы',
    tmap_tel_hazard: 'Опасность', tmap_tel_battles: 'Битвы', tmap_tel_none: 'Нет данных',
    tmap_timeline: 'Шкала времени', year_bce: 'до н.э.', year_ce: 'н.э.',
    tmap_hazard_dust: 'Пыльные бури', tmap_hazard_frost: 'Мороз и голод', tmap_hazard_storm: 'Морские штормы', tmap_hazard_scorched: 'Выжженная земля',
    tmap_campaign: 'Кампания', tmap_camp_subtitle: 'Покорите каждый регион истории, эпоху за эпохой', tmap_camp_select: 'Выберите открытый регион, чтобы начать завоевание',
    tmap_camp_stage: 'Этап', tmap_camp_question: 'Вопрос', tmap_camp_start: 'Начать завоевание',
    tmap_camp_retry: 'Повторить этап', tmap_camp_continue: 'Следующий этап', tmap_camp_conquered: 'Покорён',
    tmap_camp_locked: 'Заблокировано — сначала покорите предыдущий регион', tmap_camp_victory: 'Регион покорён!', tmap_camp_defeat: 'Завоевание провалилось — нужно минимум 3 из 5 верных ответов.',
    tmap_camp_progress: 'Прогресс кампании', tmap_camp_stars: 'Звёзды', tmap_camp_rank: 'Звание командира',
    tmap_camp_rank_1: 'Новобранец', tmap_camp_rank_2: 'Капитан', tmap_camp_rank_3: 'Генерал',
    tmap_camp_rank_4: 'Полководец', tmap_camp_rank_5: 'Стратег',
    tmap_camp_legendary: 'Легендарный режим', tmap_camp_legendary_hint: 'Эксклюзив Master — засчитываются только безупречные победы, XP удваивается',
    tmap_camp_xp: 'Получено XP', tmap_camp_era_locked: 'Кампания этой эпохи доступна на плане Master', tmap_camp_no_questions: 'Для этого региона пока нет испытаний.',
    tmap_genq_belong: 'Что из перечисленного относилось к {name}?', tmap_genq_period: 'В какой период процветало «{name}»?', tmap_genq_exp: '{answer} — часть истории «{name}».',
    tmap_camp_foe: 'Защитники: {name}', tmap_camp_your_army: 'Ваша армия', tmap_camp_enemy_army: 'Вражеская армия',
    tmap_unit_infantry: 'Пехота', tmap_unit_archers: 'Лучники', tmap_unit_cavalry: 'Кавалерия',
    tmap_battle_brief: 'Отвечайте верно, чтобы атаковать и прорвать строй врага. Ошибка даёт врагу контратаку. Разбейте их армию, чтобы захватить регион.', tmap_battle_start: 'В атаку!', tmap_battle_round: 'Раунд',
    tmap_battle_hit: 'Прямое попадание!', tmap_battle_counter: 'Контратака!', tmap_battle_won: 'Регион ваш!',
    tmap_battle_lost: 'Ваша армия разбита.', tmap_battle_correct: 'ударов нанесено', tmap_battle_left: 'осталось',
    tmap_chokepoint: 'Стратегическая точка',
    prog_ach_summary: 'Вы разблокировали {unlocked} из {total} достижений.',
    prog_ach_remaining: 'Осталось получить ещё {count}!',
    search_no_results: 'Ничего не найдено по запросу', search_min_chars: 'Введите минимум 2 символа для поиска',
    // Clio memory / AI Studio / Study Plan
    mem_title: 'Память Клио о вас', mem_empty: 'Клио ещё знакомится с вами — общайтесь с ней и проходите викторины, и память накопится автоматически.',
    mem_interests: 'Ваши интересы', mem_strengths: 'Сильные стороны', mem_misconceptions: 'Исправляемые заблуждения',
    mem_facts: 'Освоенные факты', mem_sessions: 'Заметки о занятиях', mem_resolved: 'Понятно',
    mem_clear: 'Забыть всё', mem_clear_confirm_title: 'Очистить память Клио?',
    mem_clear_confirm_desc: 'Клио забудет ваши интересы, исправления и историю занятий. XP и прогресс не пострадают.',
    nav_studio: 'ИИ-Студия', nav_study_plan: 'План занятий',
    studio_title: 'ИИ-студия контента', studio_subtitle: 'Превратите любой исторический текст в карточки, викторины и ключевые факты',
    studio_gate_desc: 'ИИ-студия контента доступна на плане Pro. Превратите любой текст в личный учебный набор.',
    studio_paste_label: 'Исходный текст', studio_paste_placeholder: 'Вставьте сюда главу учебника, статью, конспект лекции или любой исторический текст…',
    studio_source_too_short: 'Добавьте не менее 200 символов, чтобы ИИ было с чем работать.',
    studio_focus_label: 'Фокус (необязательно)', studio_focus_placeholder: 'например, военная тактика',
    studio_questions_label: 'Вопросы викторины', studio_cards_label: 'Карточки',
    studio_generation_failed: 'Ответ ИИ не прошёл проверку. Попробуйте ещё раз — повторный запуск обычно помогает.',
    studio_generating: 'Собираем ваш учебный набор…', studio_generate: 'Создать учебный набор',
    studio_checking: 'Проверка и дополнение…',
    studio_quality_clean: 'Всё созданное опирается на ваш текст и прошло проверку качества.',
    studio_quality_title: 'Проверка качества: удалено элементов — {n}',
    studio_quality_short: 'Не хватает ещё {q} вопрос(ов) и {c} карточек — возможно, источник не даёт больше.',
    studio_quality_hint: 'Удалённое не сохранено. Снимите отметки с остального перед сохранением.',
    studio_issue_ungrounded: 'не подтверждено вашим исходным текстом',
    studio_issue_invented: 'указана дата или число, которых нет в источнике',
    studio_issue_duplicate: 'повторяет предыдущий элемент',
    studio_issue_length_bias: '{pct}% вопросов выдают ответ тем, что он самый длинный вариант',
    studio_issue_script: 'часть текста вернулась не тем алфавитом',
    studio_my_sets: 'Мои учебные наборы', studio_no_sets: 'Наборов пока нет — создайте первый выше.',
    studio_delete_set: 'Удалить набор', studio_flashcards: 'карточек', studio_questions: 'вопросов', studio_best: 'рекорд',
    studio_practice: 'Практика', studio_review_cards: 'Карточки',
    studio_review_title: 'Проверьте созданный набор', studio_review_subtitle: 'Нажмите на элемент, чтобы оставить или убрать его, затем сохраните набор.',
    studio_kept: 'оставлено', studio_summary: 'Краткое содержание', studio_facts: 'Ключевые факты', studio_set_name: 'Название набора',
    studio_discard: 'Не сохранять', studio_save_set: 'Сохранить набор',
    studio_practice_score: 'Результат:', studio_done: 'Завершить', studio_show_answer: 'Нажмите, чтобы открыть', studio_next_card: 'Следующая карточка',
    path_title: 'План занятий', path_subtitle: 'Ваша неделя, построенная вокруг того, что вам нужнее всего',
    path_mastery_title: 'Освоение эпох', path_focus: 'фокус',
    path_lessons_done: 'Уроки', path_quiz_score: 'Викторина', path_adaptive_acc: 'Адаптивная',
    path_generate: 'Составить мою неделю', path_regenerate: 'Пересоставить неделю', path_refresh: 'Обновить', path_refreshed: 'План обновлён',
    path_enhance: 'Усилить с Клио', path_enhancing: 'Клио изучает ваши данные…',
    path_enhance_upsell: 'Тренерские заметки Клио к вашему плану — эксклюзив Master Student.',
    path_done_of: 'шагов выполнено', path_deep_analysis: 'Анализ Master', path_day: 'День',
    path_empty: 'Составьте персональную неделю: план нацелен на вашу самую слабую эпоху — реальные уроки, адаптивные викторины и контрольный день в конце. Шаги отмечаются сами по мере обучения.',
    path_step_lesson: 'Урок', path_step_quiz: 'Викторина эпохи', path_step_smart_quiz: 'Умная викторина',
    path_step_flashcards: 'Повторение карточек', path_step_studio: 'Сессия в ИИ-студии', path_step_crisis: 'Кризисная симуляция', path_step_map: 'Карта территорий',
    path_min: 'мин', path_mark_done: 'Отметить выполненным',
    path_rhythm_title: 'Составлено по тому, как вы занимаетесь на самом деле',
    path_rhythm_active: 'активных дней', path_rhythm_session: 'Обычное занятие',
    path_rhythm_scheduled: 'Запланировано', path_rhythm_no_data: 'занятий пока нет',
    path_days_label: 'учебных дней', path_min_per_day: 'мин/день',
    path_returning: 'С возвращением — неделя начинается с повторения, а не с нового материала.',
    path_mode_coverage: 'Упор на чтение', path_mode_retention: 'Упор на запоминание', path_mode_balanced: 'Сбалансированно',
    path_mode_coverage_why: 'Большая часть вашей приоритетной эпохи ещё не прочитана, поэтому неделя опирается на новые уроки.',
    path_mode_retention_why: 'Материал прочитан, но не удерживается, поэтому неделя опирается на активное припоминание, а не на новое чтение.',
    path_mode_balanced_why: 'Чтение и припоминание идут вровень, поэтому неделя чередует их.',
    path_stale_title: 'Этот план больше вам не соответствует',
    path_stale_complete: 'Все шаги выполнены — пора составить следующую неделю.',
    path_stale_expired: 'План пережил ту неделю, которую планировал',
    path_stale_days_old: 'дн. назад', path_stale_focus: 'Фокус сместился на',
    // Philosopher memory / Flashcards gate / Battle tactics
    pmem_title: 'Память {name} о вас', pmem_empty: 'Дебатов пока не было — поспорьте, и они запомнят каждую вашу позицию.',
    pmem_debates: 'дебатов', pmem_wins: 'выигранных уступок', pmem_stances: 'Позиции, которые вы отстаивали',
    pmem_concessions: 'Пункты, которые вы уступили', pmem_strong: 'Ваши сильнейшие аргументы', pmem_style: 'Ваш стиль',
    pmem_clear: 'Стереть это соперничество', pmem_clear_title: 'Стереть историю дебатов?',
    pmem_clear_desc: 'Философ забудет каждую позицию, уступку и победу между вами. XP не пострадает.',
    flash_gate_desc: 'Карточки открываются на плане Beginner Student. Отрабатывайте ключевые факты каждого урока с 3D-карточками.',
    tmap_battle_brief2: 'Каждый раунд: выберите тактику на военном совете, затем ответьте на приказ. Верно — бьёт ваша тактика. Неверно — их. Атака бьёт залп, залп бьёт стену щитов, стена щитов бьёт атаку. Сломите их армию — или их боевой дух.',
    tmap_battle_council: 'Военный совет — выберите тактику', tmap_battle_order: 'Приказ',
    tmap_battle_rout: 'СТРОЙ СЛОМЛЕН!', tmap_battle_crit: 'СОКРУШИТЕЛЬНЫЙ УДАР!',
    tmap_battle_advantage: 'Тактическое преимущество!', tmap_battle_outmaneuvered: 'Вас переиграли!', tmap_battle_morale: 'Боевой дух',
    tmap_tactic_charge: 'Атака', tmap_tactic_volley: 'Залп', tmap_tactic_hold: 'Стена щитов',
    tmap_tactic_charge_hint: 'Ломает залпы · разбивается о стойкий строй',
    tmap_tactic_volley_hint: 'Рвёт стойкий строй · сминается атакой',
    tmap_tactic_hold_hint: 'Останавливает атаку · беззащитна под залпом',
  },

  mk: {
    nav_dashboard: 'Контролна Табла', nav_eras: 'Епохи и Лекции', nav_timeline: 'Временска Линија',
    nav_tutor: 'ВИ Тутор', nav_leaderboard: 'Рангирање', nav_friends: 'Пријатели',
    nav_flashcards: 'Картички', nav_notes: 'Мои Белешки', nav_progress: 'Напредок',
    nav_smart_quiz: 'Паметен Квиз', nav_essay: 'Есеј Предизвик', nav_video_review: 'Видео Преглед',
    nav_debate: 'Дебата со Филозоф',
    nav_crisis: 'Кризна соба',
    nav_imperium: 'Chronos Imperium',
    crisis_title: 'Кризна соба „Хронос“',
    crisis_subtitle: 'Влези во историска пресвртница и донеси ги одлуките самиот',
    crisis_back: 'Сите сценарија',
    crisis_begin: 'Започни ја симулацијата',
    crisis_abandon: 'Напушти ја временската линија',
    crisis_placeholder: 'Напиши ја твојата одлука — избери опција или тргни по свој пат…',
    crisis_master_only: 'Кризната соба „Хронос“ е ексклузивна за планот Master Student — целосни контрафактуални симулации со ИИ оценување во реално време.',
    crisis_turn: 'Потег', crisis_stability: 'Стабилност', crisis_legitimacy: 'Легитимност', crisis_legacy: 'Наследство',
    crisis_decisions: 'Дневник на одлуки', crisis_verdict: 'Финален вердикт',
    crisis_dc: 'Дипломатски капитал', crisis_mr: 'Воена готовност', crisis_treasury: 'Трезор', crisis_consequence: 'Последица',
    crisis_risk_low: 'Низок', crisis_risk_med: 'Среден', crisis_risk_high: 'Висок',
    crisis_assess_title: 'Стратешка проценка', crisis_assess_cta: 'Побарај стратешка проценка', crisis_assess_sub: 'Трибуналот на Хронос ја оценува целата ваша кампања по пет димензии',
    crisis_assess_loading: 'Трибуналот заседава…', crisis_assess_score: 'Команден резултат', crisis_assess_xp: 'Заработено XP',
    crisis_assess_m_foresight: 'Стратешка визија', crisis_assess_m_judgment: 'Историска проценка', crisis_assess_m_stewardship: 'Управување со ресурси',
    crisis_assess_m_decisiveness: 'Одлучност', crisis_assess_m_adaptability: 'Приспособливост',
    crisis_assess_strengths: 'Силни страни', crisis_assess_improve: 'За подобрување',
    crisis_assess_counterfactual: 'Што направи историјата', crisis_assess_rerun: 'Повторно свикај го Трибуналот',
    nav_profile: 'Профил', nav_guide: 'Водич за Апликацијата', nav_report: 'Пријави Проблем',
    nav_upgrade: 'Надгради го Планот', nav_logout: 'Одјави се',
    nav_group_chronicles: 'Хроники', nav_group_academy: 'Академија', nav_group_agora: 'Агора', nav_group_ledger: 'Регистар',
    notif_title: 'Известувања', notif_empty: 'Ништо ново — одржи ја серијата денес!',
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
    daily_submit: 'Потврди Одговор', daily_correct: 'Точно! +15 XP',
    daily_wrong: 'Точен одговор:', daily_tomorrow: 'Врати се утре за нов предизвик!',
    achievement_unlocked: 'Достигнување Отклучено!',
    difficulty_easy: 'Лесно', difficulty_medium: 'Средно', difficulty_hard: 'Тешко',
    era_short_prehistoric: 'Праисторија', era_short_byzantine: 'Византија', era_short_ancient: 'Антика', era_short_medieval: 'Средновековие', era_short_earlymod: 'Рано Модерно', era_short_modern: 'Модерно',
    eras_title: 'Епохи и Лекции', eras_subtitle: 'Избери своја епоха и започни го патувањето',
    eras_lessons_label: 'лекции', eras_take_quiz: 'Направи Квиз за Епохата',
    eras_view_lessons: 'Прегледај Лекции', eras_locked: 'Заклучено', eras_completed: 'Завршено',
    eras_quiz_label: 'Квиз за епоха', eras_lessons_count: 'лекции',
    lesson_key_facts: 'Клучни факти', lesson_min_read: 'мин читање',
    lesson_complete_btn: 'Означи како Завршена', lesson_already_done: 'Лекцијата е Завршена', toast_lesson_complete: 'Лекцијата е завршена! +{xp} XP', toast_bookmarked: 'Лекцијата е зачувана!', toast_bookmark_removed: 'Обележувачот е отстранет.',
    lesson_next: 'Следна Лекција', lesson_prev: 'Претходна Лекција',
    lesson_take_quiz: 'Направи Квиз за Епохата', lesson_discuss: 'Разговарај со Клио',
    lesson_notes_title: 'Мои Белешки',
    lesson_bookmarked: 'Зачувана', lesson_save: 'Зачувај Лекција', lesson_eras_breadcrumb: 'Епохи',
    quiz_correct: 'Точно!', quiz_incorrect: 'Не е точно.', quiz_score: 'Резултат',
    quiz_xp_earned: 'XP освоено', quiz_performance_by_era: 'Резултати по Епохи',
    quiz_clio_rec: 'Препорака на Клио', quiz_clio_thinking: 'Клио размислува…',
    quiz_weak_areas: 'Откриени Слаби Области', quiz_no_weak_areas: 'Сè уште нема откриени слаби области.',
    quiz_adaptive: 'Адаптивен', quiz_earn_xp: 'Освои XP', quiz_questions: 'Прашања',
    quiz_era_title: 'Квиз', quiz_complete: 'Квизот е завршен', quiz_passed: 'Положено!',
    quiz_failed: 'Продолжи со вежбање', quiz_retake: 'Направи го повторно',
    quiz_submit_answer: 'Потврди Одговор', quiz_explanation: 'Објаснување', quiz_correct_label: 'точно',
    quiz_test_knowledge: 'Тестирај го своето знаење за {era}',
    quiz_passing_score: 'Минимален резултат: {score}% · Макс. XP: {xp}',
    quiz_question_of: 'Прашање {n} од {total}',
    quiz_upgrade_explanations: 'Надгради на Pro за да ги гледаш објаснувањата на одговорите.',
    quiz_not_found: 'Квизот не е пронајден.',
    sq_clio_fallback: 'Добар напор! Фокусирај се на прегледување на епохите каде имаш тешкотии и повтори ги тие лекции за максимален напредок.',
    sq_plan_title: 'Учебен план на Клио', sq_plan_focus: 'Области на фокус', sq_plan_steps: 'Твојот план во 3 чекори',
    sq_plan_forecast: 'Прогноза за следната сесија', sq_plan_master: 'Анализа на заблуди', sq_plan_min: 'мин', sq_plan_open: 'Отвори лекција',
    sq_upgrade_desc: 'Паметниот Квиз користи адаптивен алгоритам кој ги насочува кон твоите слаби епохи и ја калибрира тежината според твоето ниво. Достапно на Pro Learner и повисоко.',
    tl_title: 'Историска Временска Линија', tl_subtitle: 'Од 3100 г.п.н.е. до денес',
    tl_events: 'настани', tl_all_eras: 'Сите Епохи', tl_all_categories: 'Сите Категории',
    tl_open_lesson: 'Отвори Лекција',
    tutor_hello: 'Здраво, јас сум Клио — твој водич низ историјата!', tutor_examples: 'Или вчитај пример на дијалог',
    tutor_history: 'Историја', tutor_thread_first: 'Прв разговор', tutor_thread_untitled: 'Нов разговор', tutor_desc: 'Добредојде! Јас сум Музата на Историјата и тука сум за да ти го доловам минатото. Прашај ме било што — битка, империја, чуден обичај или „зошто се случило ова?" — и ќе ти објаснам јасно, ќе го поврзам со целината и ќе ти помогнам да го запомниш. Нов си тука? Пробај предлог подолу, повтори лекција со мене или само кажи ми што те интересира.',
    tutor_placeholder: 'Прашај ја Клио за секој историски момент…', tutor_new_chat: 'Нов Разговор',
    tutor_attach_image: 'Прикачи слика', tutor_image_ready: 'Сликата е подготвена — испрати ѝ ја на Клио',
    tutor_clear_title: 'Исчисти го овој разговор', tutor_clear_confirm: 'Да се исчисти овој разговор? Пораките трајно ќе се избришат од оваа нишка.',
    tutor_upgrade_msg: 'Надгради го планот за да го користиш ВИ Туторот',
    lb_title: 'Рангирање', lb_subtitle: 'Најдобри ученици рангирани по вкупно XP.',
    lb_your_rank: 'Твоето Рангирање', lb_full_rankings: 'Целосна Листа', lb_you: '(Ти)',
    lb_chess_rank: 'Шаховски Ранг', lb_level: 'Ниво', lb_streak: 'Серија',
    lb_xp_regular: 'Редовен XP', lb_xp_video: 'Видео XP', lb_score: 'Рангирачки Резултат',
    fr_title: 'Пријатели', fr_subtitle: 'Поврзи се со други ученици по историја',
    fr_search: 'Пребарај корисници…', fr_tab_friends: 'Пријатели', fr_tab_requests: 'Барања',
    fr_tab_sent: 'Испратени', fr_add: 'Додај Пријател', fr_pending: 'На чекање',
    fr_message: 'Порака', fr_duel: 'Историја 1v1', fr_msg_title: 'Разговор со {name}', fr_msg_placeholder: 'Напиши порака…',
    fr_msg_empty: 'Поздрави се — или предизвикај го на Историски дуел 1v1!', fr_msg_send: 'Испрати',
    fr_find_users: 'Најди корисници',
    fr_no_results: 'Не се најдени корисници за',
    fr_toast_request_sent: 'Поканата за пријателство е испратена',
    fr_toast_request_failed: 'Не успеа — обидете се повторно.',
    fr_wants_to_be_friend: 'Сака да ви биде пријател',
    fr_cancel_request: 'Откажи',
    fr_net_signin: 'Најавете се за да се поврзете со други ученици',
    fr_net_local: 'Демо пријатели — без врска со сервер',
    fr_toast_now_friend: 'Додаден нов пријател',
    fr_toast_declined: 'Поканата е одбиена',
    fr_toast_removed: 'Пријателот е отстранет',
    fr_request_pending: 'Поканата чека одговор',
    fr_online: 'На линија',
    fr_streak_word: 'Серија',
    fr_unread: 'Непрочитани пораки',
    fr_gift_failed: 'Подарокот не беше испратен.',
    fr_net_live: 'Во живо · сервер поврзан',
    fr_net_offline: 'Офлајн режим · зачувано локално',
    fr_tab_activity: 'Активност',
    fr_activity_empty: 'Сè уште нема ништо — додај пријател за да ја гледаш неговата активност тука.',
    fr_act_added: 'сега ти е пријател',
    fr_act_duel_win: 'доби дуел',
    fr_act_duel_loss: 'загуби дуел',
    fr_act_message: 'разменети пораки',
    fr_act_gift: 'испрати подарок',
    fr_act_lesson: 'заврши лекција',
    fr_act_quiz: 'резултат на квиз',
    fr_act_streak: 'држи серија',
    fr_act_xp: 'достигна',
    fr_act_simulated: 'Симулирана активност — зад овие пријатели нема сервер',
    fr_act_sim_short: 'сим',
    fr_time_now: 'штотуку',
    unit_min_short: 'м',
    unit_hour_short: 'ч',
    unit_day_short: 'д',
    fr_reply_1: 'Со среќа во следниот дуел! ⚔️',
    fr_reply_2: 'Ја заврши ли лекцијата за викиншката ера?',
    fr_reply_3: 'Штотуку стигнав до серија од 7 дена 🔥',
    fr_reply_4: 'Кризата кај Гавгамела е брутална. Како ти отиде?',
    fr_reply_5: 'Да видиме кој прв ќе стигне на врвот од ранг-листата!',
    fr_reply_6: 'Рим или Грција — која епоха ти е омилена?',
    fr_reply_7: 'Предизвикај ме на „Историја 1 на 1“ кога си спремен.',
    fr_duel_title: 'Историја 1v1', fr_duel_begin: 'Започни дуел', fr_duel_youhit: 'Точен удар!', fr_duel_foehit: '{name} нанесува удар!',
    fr_duel_clash: 'Сечилата се судираат — двајцата ранети!', fr_duel_miss: 'Двата замавa промашија!', fr_duel_victory: 'Победа!', fr_duel_defeat: 'Пораз',
    fr_duel_won_desc: 'Го надви {name} на {field}.', fr_duel_lost_desc: '{name} победи овој пат. Реванш кога си спремен.', fr_duel_done: 'Напушти ја арената', fr_duel_record: 'Дуел биланс',
    fr_accept: 'Прифати', fr_decline: 'Одбиј', fr_remove: 'Отстрани',
    fr_no_friends: 'Сè уште нема пријатели. Пребарај корисници за да се поврзеш!',
    fr_no_requests: 'Нема дојдовни барања.', fr_no_sent: 'Нема испратени барања.',
    fr_request_sent: 'Барањето е испратено!', fr_added: 'Пријателот е додаден!',
    flash_title: 'Картички', flash_subtitle: 'Вежбај клучни термини од секоја лекција',
    flash_all_eras: 'Сите Епохи', flash_tap_flip: 'Допри за да превртиш',
    flash_knew: 'Го знаев', flash_review_again: 'Повтори',
    flash_prev: 'Претходна', flash_next: 'Следна', flash_restart: 'Почни го Шпилот Повторно',
    flash_progress: 'Напредок', flash_remaining: 'преостануваат',
    flash_known_label: 'Познато', flash_review_label: 'За повторување',
    flash_done: 'Шпилот е завршен!', flash_key_fact: 'Клучен Факт',
    notes_title: 'Мои Белешки', notes_subtitle: 'Белешките се зачувани по лекции — секогаш достапни',
    notes_placeholder: 'Напиши ги своите мисли, согледувања или резимеа овде…',
    notes_save: 'Зачувај Белешка', notes_saved: 'Белешката е зачувана!',
    notes_select: 'Избери лекција од листата за да ја видиш или уредиш белешката.',
    notes_empty: 'Не се пронајдени лекции.', notes_search: 'Пребарај лекции…',
    notes_all_eras: 'Сите Епохи', notes_words: 'зборови',
    notes_new_note: 'Нова Белешка', notes_deleted: 'Белешката е избришана.', notes_none: 'Сè уште нема белешки', notes_none_filter: 'Нема белешки за оваа епоха', notes_hint: 'Кликни на "+ Нова Белешка" за да ги зачуваш своите мисли додека учиш.', notes_untitled: 'Белешка без наслов', notes_count: 'белешки зачувани',
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
    sq_weak_title: 'Откриени Слаби Области', sq_algorithm: 'Алгоритмот ќе им даде приоритет на овие области во оваа сесија.',
    sq_no_weak: 'Сè уште нема открени слаби области. Заврши некои квизови за епохи!',
    sq_stats_title: 'Твоја Статистика', sq_history_title: 'Историја на сесии', sq_history_open: 'Види ги сите сесии', sq_duration: 'Времетраење', sq_history_back: 'Назад кон Паметниот Квиз', sq_sessions: 'Сесии', sq_avg_score: 'Просечен Резултат',
    sq_best_score: 'Најдобар Резултат', sq_total_xp: 'Вкупно XP', sq_era_breakdown: 'Вкупен Резултат по Епохи',
    sq_no_sessions: 'Сè уште нема сесии — заврши го твојот прв Паметен Квиз!',
    sq_correct_label: 'точно', sq_perf_era: 'Резултати по Епохи',
    sq_new: 'Нова Сесија', sq_back_intro: 'Назад кон Вовед',
    sq_outstanding: '🏆 Извонредно! Ја совладуваш историјата.',
    sq_great: '✅ Одлична работа! Одржи го замавот.',
    sq_good: '📚 Добар напор — прегледај ги слабите области.',
    sq_keep_going: '💡 Продолжи со учење — секој обид те прави посилен.',
    sq_questions_desc: 'Од сите 4 епохи',
    sq_correct_xp: 'точно · +{xp} XP освоено',
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
    vr_master_only: 'Исклучиво за планот Master Student', vr_available: 'Ново видео достапно!',
    vr_write_analysis: 'Напиши анализа со препознавање на главниот мотив или аргумент…',
    prof_title: 'Профил', prof_overview: 'Преглед', prof_achievements: 'Достигнувања',
    prof_settings: 'Поставки', prof_chess_rank: 'Шаховски Ранг',
    prof_upload_photo: 'Прикачи Фотографија', prof_remove_photo: 'Отстрани Фотографија',
    prof_save: 'Зачувај Промени', prof_username: 'Корисничко Име', prof_email: 'Е-пошта',
    prof_plan: 'Тековен план', prof_upgrade: 'Надгради', prof_member_since: 'Член од',
    guide_title: 'Водич за Апликацијата', guide_subtitle: 'Сè што треба да знаеш за да го извлечеш максимумот од Historify',
    guide_features: '19 Функции', guide_quick_start: 'Брз Старт',
    guide_faq_title: 'Често Поставувани Прашања', guide_start_lesson: 'Започни Лекција',
    guide_see_plans: 'Погледни Планови', guide_cta_title: 'Подготвен/а да го започнеш патувањето?',
    guide_cta_desc: 'Оди на Контролната Табла за да го видиш напредокот, или веднаш започни лекција.',
    guide_dashboard: 'Контролна Табла', guide_start_learning: 'Започни со Учење', guide_step: 'Чекор',
    guide_free_pro: 'Бесплатен и Pro план', guide_qs_desc: 'Нов/а си? Почни со завршување на лекција во делот Епохи и Лекции, потоа направи квиз за да освоиш XP. Откако ќе се запознаеш со апликацијата, надгради на Pro за да ги отклучиш сите 132 лекции и ВИ Туторот.',
    report_title: 'Пријави Проблем', report_subtitle: 'Помогни ни да го подобриме Historify',
    report_placeholder: 'Опиши го проблемот со кој се сретна…',
    report_submit: 'Испрати Пријава', report_thanks: 'Благодариме! Твојата пријава е примена.',
    report_type: 'Вид на проблем',
    pricing_title: 'Избери го твојот план за учење', pricing_subtitle: 'Од лесно истражување до напредно учење — план за секој ученик.',
    pricing_guarantee: '30-дневна гаранција за враќање пари на секој платен план — целосен поврат, без прашања.',
    gift_btn: 'Подари план',
    gift_title: 'Подари претплата',
    gift_desc: 'Подари му на {name} еден месец платен план. Твојата награда: 50% попуст на твоето следно обновување.',
    gift_send: 'Испрати подарок',
    gift_sent: 'Подарокот е испратен! {name} сега има еден месец {plan} — а ти доби 50% попуст на следното обновување.',
    gift_reward_badge: '50% попуст на следното обновување',
    pricing_current: 'Тековен план', pricing_select: 'Почни', pricing_month: '/месец',
    pricing_trial_note: '5 дена бесплатен пробен период — откажи кога сакаш',
    pricing_free_label: 'Бесплатно', pricing_back: 'Назад',
    // Debate
    debate_title: 'Дебата со Филозоф', debate_subtitle: 'Предизвикај ги најголемите мислители во историјата',
    debate_today: 'Денешен Филозоф', debate_xp_reward: 'XP ако победиш',
    debate_placeholder: 'Претстави го твојот филозофски аргумент…',
    debate_new_round: 'Нова Рунда', debate_pro_only: 'Дебатата со Филозоф е достапна на Pro Learner и повисоко.',
    debate_won_title: 'Го победи дебатата!', debate_won_desc: 'го признал твојот аргумент.',
    debate_already_won: 'Веќе го победи денешниот филозоф!',
    debate_next_in: 'Нов филозоф за', debate_starters: 'Воведни Аргументи',
    debate_start_arg: 'Оспори ја оваа позиција',
    // AI Tutor extended
    tutor_subtitle: 'ВИ Тутор по Историја · Муза на Историјата',
    sugg_1: 'Што предизвика падот на Римската империја?', sugg_2: 'Објасни ги Крстоносните Походи едноставно',
    sugg_3: 'Зошто Ренесансата беше важна?', sugg_4: 'Како Првата светска војна доведе до Втората?',
    sugg_5: 'Кои беа најголемите антички филозофи?', sugg_6: 'Што беше Патот на Свилата и зошто беше важен?',
    // Essay extended
    essay_tip_1: 'Вклучи конкретни датуми', essay_tip_2: 'Именувај клучни личности',
    essay_tip_3: 'Наведи јасен аргумент', essay_tip_4: 'Користи историски докази',
    essay_score_breakdown: 'Распределба на Резултати', essay_strong_points: 'Силни Точки',
    essay_missing_points: 'Недостасувачки Точки', essay_accuracy: 'Историска Точност',
    essay_argument_quality: 'Квалитет на Аргументот', essay_depth_detail: 'Длабочина и Детали',
    essay_overall: 'Вкупно', essay_study_more: 'Учи Повеќе', essay_your_essay: 'Твојот Есеј',
    // Progress extended
    prog_lessons_by_era: 'Лекции по Епохи', prog_analysis_title: 'Анализите на Клио', prog_analysis_passes: 'положени', prog_analysis_avg: 'просечен резултат', prog_analysis_best: 'најдобра оценка', prog_analysis_empty: 'Заврши лекција и положи ја писмената анализа за да го видиш твојот запис тука.', prog_time_title: 'Вложено време', prog_time_total: 'вкупно време на учење', prog_momentum_title: 'Момент на учење', prog_momentum_active: 'активни денови во последните 14', prog_quiz_by_era: 'Резултати по Квизови по Епохи',
    prog_knowledge_radar: 'Радар на Знаење', prog_xp_timeline: 'Временска Линија на XP Активност',
    prog_radar_desc: 'Комбинирано завршување лекции + резултат на квиз по епоха',
    prog_adv_analytics_title: 'Напредна Аналитика — Pro Learner',
    prog_adv_analytics_desc: 'Надгради за да отклучиш интерактивни графикони, XP историја, Радар на Знаење и анализа на достигнувања.',
    prog_no_quiz: 'Заврши квиз за да ги видиш своите резултати овде.',
    prog_no_xp: 'Започни со учење за да ја видиш историјата на XP овде.',
    prog_quiz_score_chart: 'Графикон на Резултати', prog_xp_activity_graph: 'Графикон на XP Активност',
    prog_knowledge_radar_chart: 'Радар на Знаење', prog_upgrade_cta: 'Надгради на Pro — $10/месец',
    tl_major: 'Главно', tl_free_only: 'Бесплатен план: само главни настани',
    tl_filter_title: 'Филтри на Временска Линија', tl_filter_desc: 'Надгради на Pro за филтрирање по епоха и категорија, и преглед на сите настани.',
    tl_lesson_locked: 'Лекцијата е Заклучена', tl_lesson_locked_pro: 'Надгради на Pro за пристап',
    tl_go_to: 'Оди на:', tl_explore_era: 'Истражи Епоха',
    cat_war: 'Војна', cat_politics: 'Политика', cat_science: 'Наука', cat_culture: 'Култура', cat_religion: 'Религија', cat_exploration: 'Истражување',
    debate_continue_btn: 'Продолжи со Дебата',
    sidebar_streak: 'д серија',
    pricing_faq: 'Најчесто Поставувани Прашања', pricing_cur_btn: 'Тековен план',
    pricing_upgrade_to: 'Надгради на', pricing_downgrade_free: 'Намали на Бесплатно', pricing_switch_to: 'Префрли на',
    pricing_faq_q1: 'Можам ли да откажам во секое време?', pricing_faq_a1: 'Да. Намали на Бесплатен во поставките на профилот — без обврски.',
    pricing_faq_q2: 'Што ќе се случи со мојот напредок ако го намалам планот?', pricing_faq_a2: 'Целиот твој XP, достигнувања и завршени лекции се зачувани засекогаш без оглед на планот.',
    pricing_faq_q3: 'Дали плаќањето е безбедно?', pricing_faq_a3: 'Во оваа демо-верзија, изборот на план е симулиран. Реалните плаќања би користеле Stripe.',
    pricing_faq_q4: 'Што се смета за порака на ВИ?', pricing_faq_a4: 'Секоја порака до ВИ Туторот се брои. Одговорите на Туторот не се бројат.',
    pricing_price_free: 'Бесплатно',
    report_cat_bug: 'Пријава на Грешка', report_cat_bug_desc: 'Нешто е скршено или не работи правилно',
    report_cat_feature: 'Барање за Функција', report_cat_feature_desc: 'Предложи нова функција или подобрување',
    report_cat_content: 'Проблем со Содржина', report_cat_content_desc: 'Неточни или недостасувачки историски информации',
    report_cat_other: 'Друго', report_cat_other_desc: 'Општи повратни информации или нешто друго',
    report_pri_low: 'Ниска', report_pri_medium: 'Средна', report_pri_high: 'Висока',
    report_category_label: 'Категорија', report_category_hint: 'Каков вид на проблем пријавуваш?',
    report_priority_label: 'Приоритет', report_priority_hint: 'Колку силно ова влијае на твоето искуство?',
    report_subject_label: 'Предмет', report_subject_hint: 'Краток наслов за проблемот',
    report_desc_label: 'Опис', report_desc_hint: 'Опиши го проблемот детално.',
    report_submit_btn: 'Испрати Пријава', report_submitting: 'Испраќање…',
    report_submitted_title: 'Пријавата е Испратена', report_submitted_msg: 'Благодариме за пријавувањето. Твоите повратни информации ни помагаат да го подобриме Historify.',
    report_another: 'Испрати Уште Една Пријава', report_priority_badge: 'Приоритет:',
    prof_bookmarks: 'Обележувачи', prof_no_bookmarks: 'Сè уште нема обележувачи', prof_no_bookmarks_hint: 'Допри ја иконата за обележување на секоја лекција за да ја зачуваш тука.',
    prof_historical_rank: 'Историски Ранг', prof_change_plan: 'Промени план',
    prof_danger_zone: 'Опасна Зона',
    prof_reset_title: 'Врати го Целиот Напредок', prof_reset_desc: 'Ги брише XP, лекциите и резултатите засекогаш.',
    prof_reset_confirm: 'Враќање на целиот напредок?', prof_reset_confirm_desc: 'Ова ќе го избрише засекогаш целиот твој XP, завршени лекции, резултати и достигнувања. Оваа акција не може да се поврати.',
    prof_reset_yes: 'Да, врати сè',
    prof_toast_image_too_big: 'Сликата мора да биде помала од 2 МБ.',
    prof_toast_image_bad_type: 'Се прифаќаат само PNG, JPEG, WEBP или GIF слики.',
    prof_toast_avatar_set: 'Профилната слика е ажурирана!',
    prof_toast_avatar_removed: 'Профилната слика е отстранета.',
    prof_toast_name_short: 'Корисничкото име мора да има барем 3 знаци.',
    prof_toast_name_saved: 'Корисничкото име е ажурирано!',
    prof_toast_email_invalid: 'Внеси валидна е-пошта.',
    prof_toast_email_saved: 'Е-поштата е ажурирана!',
    prof_toast_email_failed: 'Неуспешно ажурирање на е-поштата.',
    prof_toast_pwd_short: 'Новата лозинка мора да има барем 6 знаци.',
    prof_toast_pwd_mismatch: 'Лозинките не се совпаѓаат.',
    prof_toast_pwd_saved: 'Лозинката е ажурирана!',
    prof_toast_pwd_failed: 'Неуспешно ажурирање на лозинката.',
    prof_toast_2fa_code: 'Внеси валиден 6-цифрен код.',
    prof_toast_2fa_on: 'Двофакторската автентикација е вклучена!',
    prof_toast_2fa_off: '2FA е исклучена.',
    prof_toast_pref_saved: 'Поставката е зачувана.',
    prof_toast_reset: 'Напредокот е ресетиран.',
    prof_toast_pdf_soon: 'Преземањето во PDF доаѓа наскоро!',
    prof_inspired_by: 'Инспирирано од:',
    prof_video_xp: 'Видео XP',
    prof_next_rank_in: 'До следниот ранг',
    prof_max_rank: 'МАКС. РАНГ',
    prof_renews: 'Се обновува на',
    prof_download_notes: 'Преземи белешки од лекциите (PDF)',
    prof_demo_secret: 'демо клуч',
    prof_rhythm_title: 'Ритам на учење',
    prof_rhythm_days_studied: 'дена учење',
    prof_rhythm_empty: 'Твоите денови на учење ќе се појават тука штом ќе почнеш лекција.',
    prof_rhythm_less: 'Помалку',
    prof_rhythm_more: 'Повеќе',
    prof_rhythm_this_week: 'Оваа недела',
    prof_records_title: 'Лични рекорди',
    prof_rec_total_time: 'Вкупно вложено време',
    prof_rec_longest_streak: 'Најдолга серија',
    prof_rec_days: 'дена',
    prof_rec_best_quiz: 'Најдобар резултат на квиз',
    prof_rec_favourite_era: 'Најмногу изучувана епоха',
    prof_rec_perfect_quizzes: 'Совршени квизови',
    prof_rec_best_day: 'Најдобар ден',
    prof_milestones_title: 'Најблиски достигнувања',
    unit_day_one: 'ден',
    unit_day_few: 'дена',
    unit_day_many: 'дена',
    streak_start_today: 'Започни ја својата серија денес!',
    level_short: 'Ниво',
    level_xp_to: 'XP до ниво',
    flash_shuffle: 'Измешај', flash_answer: 'Одговор', flash_no_cards: 'Нема картички за овој филтер.',
    prof_reset_btn: 'Врати',
    // Profile Settings
    prof_picture: 'Профилна Слика', prof_change_photo: 'Промени Фотографија', prof_upload_photo_btn: 'Прикачи Фотографија', prof_remove_photo_btn: 'Отстрани',
    prof_display_name: 'Прикажано Име', prof_save_btn: 'Зачувај',
    prof_change_email: 'Промени Е-пошта', prof_current_email: 'Тековна:', prof_new_email: 'Нова Е-пошта', prof_cur_password: 'Тековна Лозинка', prof_update_email: 'Обнови Е-пошта', prof_updating: 'Обновување…',
    prof_change_password: 'Промени Лозинка', prof_new_password: 'Нова Лозинка', prof_confirm_password: 'Потврди Нова Лозинка', prof_update_password: 'Обнови Лозинка',
    prof_min_chars: 'Мин. 6 знаци', prof_repeat_pwd: 'Повтори лозинка',
    prof_2fa_title: 'Двофакторна Автентикација', prof_2fa_enabled_msg: '2FA е овозможена', prof_2fa_disabled_msg: '2FA е оневозможена',
    prof_2fa_enabled_desc: 'Твојата сметка е заштитена со апликација за автентикација.', prof_2fa_disabled_desc: 'Додај дополнителен слој на безбедност на твојата сметка.',
    prof_2fa_disable: 'Оневозможи', prof_2fa_enable: 'Овозможи',
    prof_notif_title: 'Претпочитања за Известувања', prof_notif_reminders: 'Потсетници за Лекции', prof_notif_reminders_desc: 'Добивај потсетници за одржување на твојата серија на учење.',
    prof_notif_achievements: 'Предупредувања за Достигнувања', prof_notif_achievements_desc: 'Известувај кога ќе отклучиш ново достигнување.',
    prof_notif_weekly: 'Неделен Преглед на Напредок', prof_notif_weekly_desc: 'Резиме на твојата неделна активност на учење.',
    prof_dark_mode: 'Темен Режим',
    prof_setup_2fa: 'Постави 2FA', prof_2fa_scan: 'Скенирај го QR кодот со апликација за автентикација (Google Authenticator, Authy, итн.).', prof_2fa_enter_code: 'Внеси го 6-цифрениот код од твојата апликација', prof_2fa_verify: 'Верификувај и Овозможи', prof_2fa_backup: 'Резервни кодови (зачувај ги на безбедно место):',
    map_key_locations: 'Клучни Локации',
    map_zoom_hint: 'Скролувај за зум · Влечи за движење',
    nav_timeline_map: 'Карта на Територии',
    tmap_title: 'Карта на историски територии',
    tmap_subtitle: 'Истражи реални географски територии за секој историски период',
    tmap_select_topic: 'Избери тема за да ја видиш нејзината територија',
    tmap_layers: 'Слоеви', tmap_style: 'Стил на карта', tmap_explore: 'Истражи', tmap_story: 'Приказна', tmap_quiz: 'Квиз',
    tmap_layer_territory: 'Територија', tmap_layer_capitals: 'Главни градови', tmap_layer_cities: 'Градови',
    tmap_layer_battles: 'Битки', tmap_layer_ports: 'Пристаништа', tmap_layer_resources: 'Ресурси', tmap_layer_routes: 'Рути',
    tmap_style_dark: 'Класична темна', tmap_style_parchment: 'Пергамент', tmap_style_military: 'Воена',
    tmap_style_terrain: 'Рељеф', tmap_style_clean: 'Чиста светла', tmap_style_satellite: 'Сателит',
    tmap_quiz_q: 'Која територија/империја е прикажана?', tmap_quiz_correct: 'Точно! +50 XP', tmap_quiz_wrong: 'Неточно — тоа беше',
    tmap_quiz_xp: '+50 XP', tmap_quiz_next: 'Следно прашање', tmap_quiz_score: 'Резултат',
    tmap_story_play: 'Пушти', tmap_story_pause: 'Пауза', tmap_story_prev: 'Претходно', tmap_story_next: 'Следно',
    tmap_markers: 'маркери', tmap_period: 'Период',
    tmap_perspective: 'Поглед', tmap_perspective_all: 'Сите', tmap_perspective_military: 'Воен',
    tmap_perspective_trade: 'Трговија', tmap_perspective_scholar: 'Научен',
    tmap_year: 'Година', tmap_what_if: 'Што ако?', tmap_pro_only: 'Картата на територии бара Pro план',
    tmap_what_if_desc: 'Истражи контрафактуална историја', tmap_year_range: 'Временски опсег', tmap_animate: 'Анимирај',
    tmap_causality: 'Историски контекст', tmap_territories_hint: 'историски територии низ 6 епохи',
    essay_select_topic: 'Избери тема погоре',
    essay_write_more: 'Напиши уште најмалку {n} зборови',
    essay_too_long: 'Есејот е предолг (макс. 600 зборови)',
    // Login
    login_title: 'Добредојдовте', login_desc: 'Влезете за да продолжите со патувањето',
    login_email: 'Е-пошта', login_password: 'Лозинка',
    login_signing_in: 'Најавување…', login_btn: 'Најави се',
    login_no_account: 'Немаш профил?', login_create: 'Создај бесплатно',
    login_err_email: 'Внесете валидна е-пошта', login_err_pass: 'Потребна е лозинка',
    login_failed: 'Неуспешна најава. Проверете ги вашите податоци.',
    // Register
    reg_title: 'Започнете го Патувањето', reg_desc: 'Создадете бесплатен профил — без кредитна картичка',
    reg_username: 'Корисничко Име', reg_email: 'Е-пошта', reg_pass: 'Лозинка', reg_confirm: 'Потврди Лозинка',
    reg_creating: 'Создавање профил…', reg_btn: 'Создај Бесплатен Профил',
    reg_have_account: 'Веќе имаш профил?', reg_sign_in: 'Најави се',
    reg_err_username_min: 'Мин. 3 знаци', reg_err_username_max: 'Макс. 20 знаци',
    reg_err_username_chars: 'Само букви, бројки и долни цртички',
    reg_err_email: 'Внесете валидна е-пошта', reg_err_pass_min: 'Мин. 8 знаци',
    reg_err_pass_match: 'Лозинките не се совпаѓаат', reg_failed: 'Неуспешно создавање профил. Обидете се повторно.',
    reg_placeholder_username: 'historybuff42',
    reg_placeholder_pass: 'Барем 8 знаци', reg_placeholder_confirm: 'Повторете ја лозинката',
    // Auth errors
    auth_no_account: 'Не е пронајден профил со тој email.',
    essay_grading_sub: 'Анализирање на точност, квалитет на аргументот и длабочина…',
    essay_graded: 'Оценето! Добивте {grade}',
    essay_grade_fail: 'Оценувањето не успеа. Обидете се повторно.',
    essay_custom_placeholder: 'пр. Како Монголската империја го промени трговскиот пат во Азија?',
    // AI gateway errors
    ai_err_title: 'Клио не можеше да одговори',
    ai_err_config: 'ИИ сервисот не е конфигуриран. Додајте го вашиот API клуч во .env.local (VITE_ANTHROPIC_API_KEY) и рестартирајте ја апликацијата.',
    ai_err_network: 'Нема врска со ИИ сервисот. Проверете го интернетот и обидете се повторно.',
    ai_err_rate: 'Премногу барања во моментов. Почекајте неколку секунди, па обидете се повторно.',
    ai_err_server: 'ИИ сервисот е привремено недостапен. Разговорот е зачуван — обидете се повторно за момент.',
    ai_err_generic: 'Нешто тргна наопаку при контакт со ИИ. Разговорот е зачуван — обидете се повторно.',
    ai_err_reconnect: 'Повторно поврзување за {s} с…',
    // Tactical map
    tmap_cat_assets: 'Сопствени средства', tmap_cat_diplomatic: 'Дипломатски фронтови', tmap_cat_resources: 'Ресурси', tmap_cat_enemy: 'Непријателски сфери',
    tmap_annotate: 'Прибелешки', tmap_ann_pin: 'Постави значка', tmap_ann_draw: 'Нацртај патека', tmap_ann_clear: 'Избриши белешки', tmap_ann_pin_default: 'Значка',
    tmap_fog_locked: 'Неистражен регион — кликнете за извидување', tmap_fog_scouted: 'Регионот е извидан!',
    tmap_tel_faction: 'Фракција', tmap_tel_garrison: 'Гарнизон', tmap_tel_resources: 'Ресурси',
    tmap_tel_hazard: 'Опасност', tmap_tel_battles: 'Битки', tmap_tel_none: 'Нема податоци',
    tmap_timeline: 'Временска линија', year_bce: 'п.н.е.', year_ce: 'н.е.',
    tmap_hazard_dust: 'Песочни бури', tmap_hazard_frost: 'Мраз и глад', tmap_hazard_storm: 'Морски бури', tmap_hazard_scorched: 'Изгорена земја',
    tmap_campaign: 'Кампања', tmap_camp_subtitle: 'Освојте го секој регион од историјата, епоха по епоха', tmap_camp_select: 'Изберете отклучен регион за да го започнете освојувањето',
    tmap_camp_stage: 'Етапа', tmap_camp_question: 'Прашање', tmap_camp_start: 'Започни освојување',
    tmap_camp_retry: 'Повтори етапа', tmap_camp_continue: 'Следна етапа', tmap_camp_conquered: 'Освоено',
    tmap_camp_locked: 'Заклучено — прво освојте го претходниот регион', tmap_camp_victory: 'Регионот е освоен!', tmap_camp_defeat: 'Освојувањето не успеа — потребни се барем 3 од 5 точни за да го земете регионот.',
    tmap_camp_progress: 'Напредок на кампањата', tmap_camp_stars: 'Ѕвезди', tmap_camp_rank: 'Команден чин',
    tmap_camp_rank_1: 'Регрут', tmap_camp_rank_2: 'Капетан', tmap_camp_rank_3: 'Генерал',
    tmap_camp_rank_4: 'Војсководец', tmap_camp_rank_5: 'Стратег',
    tmap_camp_legendary: 'Легендарен режим', tmap_camp_legendary_hint: 'Ексклузивно за Master — се бројат само беспрекорни освојувања, XP се дуплира',
    tmap_camp_xp: 'Заработено XP', tmap_camp_era_locked: 'Кампањата на оваа епоха бара Master план', tmap_camp_no_questions: 'Сè уште нема предизвици за овој регион.',
    tmap_genq_belong: 'Што од ова припаѓало на {name}?', tmap_genq_period: 'Во кој период процветал(а) „{name}“?', tmap_genq_exp: '{answer} е дел од приказната за „{name}“.',
    tmap_camp_foe: 'Бранители на {name}', tmap_camp_your_army: 'Твојата војска', tmap_camp_enemy_army: 'Непријателска војска',
    tmap_unit_infantry: 'Пешадија', tmap_unit_archers: 'Стрелци', tmap_unit_cavalry: 'Коњаница',
    tmap_battle_brief: 'Одговори точно за да јуришаш и да ја пробиеш непријателската линија. Погрешен одговор им дозволува контранапад. Разбиј ја нивната војска за да го освоиш регионот.', tmap_battle_start: 'Труби на јуриш', tmap_battle_round: 'Рунда',
    tmap_battle_hit: 'Директен погодок!', tmap_battle_counter: 'Контранапад!', tmap_battle_won: 'Регионот е твој!',
    tmap_battle_lost: 'Твојата војска е разбиена.', tmap_battle_correct: 'удари погодени', tmap_battle_left: 'преостанато',
    tmap_chokepoint: 'Стратешка точка',
    prog_ach_summary: 'Отклучивте {unlocked} од {total} достигнувања.',
    prog_ach_remaining: 'Уште {count} за освојување!',
    search_no_results: 'Нема резултати за', search_min_chars: 'Внесете најмалку 2 знаци за пребарување',
    // Clio memory / AI Studio / Study Plan
    mem_title: 'Меморијата на Клио за тебе', mem_empty: 'Клио сè уште те запознава — разговарај со неа и решавај квизови, а меморијата се гради автоматски.',
    mem_interests: 'Твоите интереси', mem_strengths: 'Силни страни', mem_misconceptions: 'Заблуди во исправање',
    mem_facts: 'Совладани факти', mem_sessions: 'Белешки од сесиите', mem_resolved: 'Сфатив',
    mem_clear: 'Заборави сè', mem_clear_confirm_title: 'Да се избрише меморијата на Клио?',
    mem_clear_confirm_desc: 'Клио ќе ги заборави твоите интереси, исправки и историјата на сесиите. Твоето XP и напредокот не се засегнати.',
    nav_studio: 'ВИ Студио', nav_study_plan: 'План за учење',
    studio_title: 'ВИ Студио за содржина', studio_subtitle: 'Претвори секој историски текст во картички, квизови и клучни факти',
    studio_gate_desc: 'ВИ Студиото за содржина е достапно на планот Pro. Претвори секој текст во личен комплет за учење.',
    studio_paste_label: 'Изворен текст', studio_paste_placeholder: 'Залепи тука поглавје од учебник, статија, белешки од предавање или кој било историски текст…',
    studio_source_too_short: 'Додај најмалку 200 знаци за ВИ да има доволно материјал.',
    studio_focus_label: 'Фокус (изборно)', studio_focus_placeholder: 'на пр. воена тактика',
    studio_questions_label: 'Прашања за квиз', studio_cards_label: 'Картички',
    studio_generation_failed: 'Одговорот на ВИ не помина проверка. Обиди се повторно — нов обид обично помага.',
    studio_generating: 'Го составуваме твојот комплет за учење…', studio_generate: 'Создај комплет за учење',
    studio_checking: 'Проверка и дополнување…',
    studio_quality_clean: 'Сè создадено се потпира на вашиот текст и ги помина проверките за квалитет.',
    studio_quality_title: 'Проверка на квалитет: отстранети {n} ставки',
    studio_quality_short: 'Сè уште недостигаат {q} прашања и {c} картички — можеби изворот не дава повеќе.',
    studio_quality_hint: 'Отстранетото не е зачувано. Отштиклирајте го останатото што не го сакате пред да зачувате.',
    studio_issue_ungrounded: 'без поткрепа во вашиот изворен текст',
    studio_issue_invented: 'наведува датум или бројка што ја нема во изворот',
    studio_issue_duplicate: 'повторува претходна ставка',
    studio_issue_length_bias: '{pct}% од прашањата го откриваат одговорот затоа што е најдолгата опција',
    studio_issue_script: 'дел од текстот се врати со погрешно писмо',
    studio_my_sets: 'Мои комплети за учење', studio_no_sets: 'Сè уште нема комплети — создај го првиот погоре.',
    studio_delete_set: 'Избриши комплет', studio_flashcards: 'картички', studio_questions: 'прашања', studio_best: 'рекорд',
    studio_practice: 'Вежбај', studio_review_cards: 'Картички',
    studio_review_title: 'Прегледај го создадениот комплет', studio_review_subtitle: 'Допри на кој било елемент за да го задржиш или отфрлиш, па зачувај го комплетот.',
    studio_kept: 'задржани', studio_summary: 'Резиме', studio_facts: 'Клучни факти', studio_set_name: 'Име на комплетот',
    studio_discard: 'Отфрли', studio_save_set: 'Зачувај комплет',
    studio_practice_score: 'Резултат:', studio_done: 'Заврши', studio_show_answer: 'Допри за одговор', studio_next_card: 'Следна картичка',
    path_title: 'План за учење', path_subtitle: 'Твојата недела, изградена околу она што најмногу ти треба',
    path_mastery_title: 'Совладаност по епоха', path_focus: 'фокус',
    path_lessons_done: 'Лекции', path_quiz_score: 'Квиз', path_adaptive_acc: 'Адаптивно',
    path_generate: 'Состави ми недела', path_regenerate: 'Состави нова недела', path_refresh: 'Освежи', path_refreshed: 'Планот е освежен',
    path_enhance: 'Засили со Клио', path_enhancing: 'Клио ги проучува твоите податоци…',
    path_enhance_upsell: 'Тренерските белешки од Клио кон твојот план се ексклузивни за Master Student.',
    path_done_of: 'чекори завршени', path_deep_analysis: 'Master анализа', path_day: 'Ден',
    path_empty: 'Состави персонализирана недела: планот ја таргетира твојата најслаба епоха со вистински лекции, адаптивни квизови и контролен ден на крајот — и сам се одбележува додека учиш.',
    path_step_lesson: 'Лекција', path_step_quiz: 'Квиз за епохата', path_step_smart_quiz: 'Паметен квиз',
    path_step_flashcards: 'Повторување картички', path_step_studio: 'Сесија во ВИ Студио', path_step_crisis: 'Кризна симулација', path_step_map: 'Мапа на територии',
    path_min: 'мин', path_mark_done: 'Означи завршено',
    path_rhythm_title: 'Составено според тоа како навистина учиш',
    path_rhythm_active: 'активни дена', path_rhythm_session: 'Вообичаена сесија',
    path_rhythm_scheduled: 'Закажано', path_rhythm_no_data: 'сè уште нема сесии',
    path_days_label: 'учебни дена', path_min_per_day: 'мин/ден',
    path_returning: 'Добредојде назад — неделата почнува со повторување пред нов материјал.',
    path_mode_coverage: 'Фокус на читање', path_mode_retention: 'Фокус на помнење', path_mode_balanced: 'Балансирано',
    path_mode_coverage_why: 'Најголемиот дел од твојата приоритетна епоха сè уште не е прочитан, па неделата се потпира на нови лекции.',
    path_mode_retention_why: 'Материјалот е прочитан, но не се задржува, па неделата се потпира на активно присетување наместо на уште читање.',
    path_mode_balanced_why: 'Читањето и присетувањето ти одат рамо до рамо, па неделата ги менува наизменично.',
    path_stale_title: 'Овој план веќе не ти одговара',
    path_stale_complete: 'Ги заврши сите чекори — време е за следната недела.',
    path_stale_expired: 'Планот ја надживеа неделата што ја закажуваше',
    path_stale_days_old: 'дена стар', path_stale_focus: 'Фокусот се премести на',
    // Philosopher memory / Flashcards gate / Battle tactics
    pmem_title: 'Меморијата на {name} за тебе', pmem_empty: 'Сè уште нема дебати — расправај со нив и ќе го паметат секој твој став.',
    pmem_debates: 'дебати', pmem_wins: 'освоени отстапки', pmem_stances: 'Ставови што ги бранеше',
    pmem_concessions: 'Точки што ги отстапи', pmem_strong: 'Твоите најсилни аргументи', pmem_style: 'Твојот стил',
    pmem_clear: 'Избриши го ова ривалство', pmem_clear_title: 'Да се избрише историјата на дебати?',
    pmem_clear_desc: 'Филозофот ќе го заборави секој став, отстапка и победа меѓу вас. Твоето XP не е засегнато.',
    flash_gate_desc: 'Картичките се отклучуваат на планот Beginner Student. Вежбај клучни факти од секоја лекција со 3D картички.',
    tmap_battle_brief2: 'Секоја рунда: избери тактика на воениот совет, па одговори на наредбата. Точно — удира твојата тактика. Погрешно — нивната. Јуришот победува залп, залпот победува штитен ѕид, штитниот ѕид победува јуриш. Скрши ја нивната војска — или нивниот морал.',
    tmap_battle_council: 'Воен совет — избери ја твојата тактика', tmap_battle_order: 'Наредбата',
    tmap_battle_rout: 'ЛИНИЈАТА СЕ КРШИ!', tmap_battle_crit: 'РАЗБИВАЧКИ УДАР!',
    tmap_battle_advantage: 'Тактичка предност!', tmap_battle_outmaneuvered: 'Надмудрен!', tmap_battle_morale: 'Морал',
    tmap_tactic_charge: 'Јуриш', tmap_tactic_volley: 'Залп', tmap_tactic_hold: 'Штитен ѕид',
    tmap_tactic_charge_hint: 'Крши залпови · паѓа пред цврста линија',
    tmap_tactic_volley_hint: 'Кине цврста линија · прегазен од јуриш',
    tmap_tactic_hold_hint: 'Запира јуриш · беспомошен под залп',
  },

  // German & French launch with the full key surface (spread from English) and
  // a hand-translated core covering the high-traffic UI. Remaining keys serve
  // English until their translations land — the same graceful-fallback contract
  // the content layer has always used.
  de: { ...EN, ...DE_OVERRIDES, ...DE_OVERRIDES_2 },
  fr: { ...EN, ...FR_OVERRIDES, ...FR_OVERRIDES_2 },
};
