import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { T, LANGUAGE_LABELS, type Language } from './src/i18n/translations';

type ContentLang = Exclude<Language, 'en'>;

/**
 * Keys whose value is legitimately identical to English in a given language:
 * product and feature names, symbols and abbreviations, and true cognates.
 *
 * German and French are assembled as `{ ...EN, ...overrides }`, so every key is
 * present in them by construction and a presence check can never fail. Comparing
 * values is what actually catches an untranslated string — but only if the
 * deliberate matches below are excluded first.
 */
const IDENTICAL_TO_EN_OK: Record<string, ReadonlyArray<ContentLang> | 'all'> = {
  // Product, feature and plan names, symbols, and placeholder sample text.
  nav_imperium: 'all',            // "Chronos Imperium"
  lbl_xp: 'all',                  // "XP"
  dash_xp_label: 'all',           // "XP"
  tmap_quiz_xp: 'all',            // "+50 XP"
  reg_placeholder_username: 'all', // "historybuff42"
  pricing_free_label: ['de', 'fr'], // "Free" — the plan's name
  sq_title: ['fr'],               // "Smart Quiz"
  nav_group_agora: ['de', 'fr'],  // "Agora"

  // Abbreviations that are written the same way.
  lbl_pts: ['es', 'fr'],          // "pts"
  sq_plan_min: ['es', 'fr'],      // "min"
  path_min: ['es', 'fr'],         // "min"

  // "Quiz" is the ordinary loanword in these languages.
  tmap_quiz: ['es', 'de', 'fr'],
  path_quiz_score: ['de', 'fr'],
  quiz_era_title: ['es'],

  // Established German loanwords.
  lbl_level: ['de'],
  level_label: ['de'],
  dash_level: ['de'],
  lb_level: ['de'],
  prof_upgrade: ['de'],
  guide_dashboard: ['de'],

  // Cognates spelled identically in the target language.
  cat_religion: ['de', 'fr'],
  tmap_story_pause: ['de', 'fr'],
  tmap_camp_rank_3: ['es', 'de'],   // "General"
  era_short_medieval: ['es'],
  lesson_eras_breadcrumb: ['es'],   // "Eras"
  pmem_debates: ['es'],             // "debates"
  notif_title: ['fr'],              // "Notifications"
  quiz_score: ['fr'],               // "Score"
  tmap_quiz_score: ['fr'],          // "Score"
  fr_message: ['fr'],               // "Message"
  sq_sessions: ['fr'],              // "Sessions"
  sq_correct_label: ['fr'],         // "correct"
  cat_science: ['fr'],
  cat_culture: ['fr'],
  cat_exploration: ['fr'],
  report_desc_label: ['fr'],        // "Description"
  tmap_layer_ports: ['fr'],         // "Ports"
  tmap_layer_routes: ['fr'],        // "Routes"
  tmap_style_satellite: ['fr'],     // "Satellite"
  tmap_tel_faction: ['fr'],         // "Faction"
  tmap_camp_question: ['fr'],       // "Question"
  tmap_unit_archers: ['fr'],        // "Archers"
  studio_questions: ['fr'],         // "questions"
  tmap_tactic_charge: ['fr'],       // "Charge"
};

function isDeliberatelyIdentical(key: string, lang: ContentLang): boolean {
  const allowed = IDENTICAL_TO_EN_OK[key];
  return allowed === 'all' || (Array.isArray(allowed) && allowed.includes(lang));
}

function translationCoveragePlugin(): Plugin {
  return {
    name: 'translation-coverage-check',
    buildStart() {
      const langs = Object.keys(T) as Array<keyof typeof T>;
      const enKeys = Object.keys(T.en);
      const problems: string[] = [];

      for (const lang of langs) {
        if (lang === 'en') continue;
        const langKeys = new Set(Object.keys(T[lang]));
        const missing = enKeys.filter(k => !langKeys.has(k));
        if (missing.length > 0) {
          problems.push(
            `[i18n] ${LANGUAGE_LABELS[lang]} is missing ${missing.length} key(s): ${missing.slice(0, 10).join(', ')}${missing.length > 10 ? '...' : ''}`
          );
        }

        const untranslated = enKeys.filter(
          k =>
            langKeys.has(k) &&
            T[lang][k as keyof typeof T.en] === T.en[k as keyof typeof T.en] &&
            !isDeliberatelyIdentical(k, lang)
        );
        if (untranslated.length > 0) {
          problems.push(
            `[i18n] ${LANGUAGE_LABELS[lang]} still shows the English text for ${untranslated.length} key(s): ${untranslated.slice(0, 10).join(', ')}${untranslated.length > 10 ? '...' : ''}\n` +
              `        Translate them, or add them to IDENTICAL_TO_EN_OK in vite.config.ts if the wording is deliberate.`
          );
        }
      }

      if (problems.length > 0) {
        this.error(problems.join('\n'));
      }
      console.info(
        `\x1b[32m✔\x1b[0m i18n: all ${langs.length} languages have 100% coverage (${enKeys.length} keys)`
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [translationCoveragePlugin(), react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api/chat': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: () => '/v1/messages',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const key = env.VITE_ANTHROPIC_API_KEY;
              if (key) {
                proxyReq.setHeader('x-api-key', key);
                proxyReq.setHeader('anthropic-version', '2023-06-01');
              }
            });
          },
        },
      },
    },
  };
});
