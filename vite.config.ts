import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { T, LANGUAGE_LABELS, type Language } from './src/i18n/translations';
import { LESSON_LOCAL_BANNERS } from './src/features/content/lessonLocalBanners';
import { TERRITORY_CARTOGRAPHY } from './src/features/content/territoryCartography';
import { TIMELINE_EVENTS } from './src/features/content/timelineData';
import { TIMELINE_TRANS } from './src/i18n/timelineTranslations';

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
  level_short: ['de'],            // "Lv." — German already uses the loanword (dash_level)
  unit_min_short: ['es', 'de', 'fr'],   // "m"
  unit_hour_short: ['es', 'fr'],        // "h"
  unit_day_short: ['es'],               // "d"
  fr_act_sim_short: 'all',              // "sim" — same clipping everywhere
  fr_online: ['de'],                    // "Online" — the ordinary German word
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

      // The baked lesson translations ship as per-language chunks generated from
      // lessonTranslationsGenerated.ts. Nothing imports that file at runtime, so
      // a regeneration without a re-split would silently serve stale text.
      const bakedSource = path.resolve(__dirname, 'src/i18n/lessonTranslationsGenerated.ts');
      const bakedDir = path.resolve(__dirname, 'src/i18n/generated');
      if (fs.existsSync(bakedSource) && fs.existsSync(bakedDir)) {
        const sourceAt = fs.statSync(bakedSource).mtimeMs;
        const stale = fs
          .readdirSync(bakedDir)
          .filter(f => f.endsWith('.ts'))
          .filter(f => fs.statSync(path.join(bakedDir, f)).mtimeMs < sourceAt);
        if (stale.length > 0) {
          problems.push(
            `[i18n] ${stale.length} baked language chunk(s) are older than lessonTranslationsGenerated.ts: ${stale.join(', ')}\n` +
              `        Run \`npm run i18n:split\` to regenerate them.`
          );
        }
      }

      // ── Content coverage, checked from the SOURCE DATA ────────────────────
      // Checking "does every row in the translation table have all 5 languages"
      // says nothing about rows that were never added. 46 timeline events had
      // no entry at all and rendered English in every language while that check
      // reported 100%. Always walk the data, never the table.
      const contentLangs = langs.filter(l => l !== 'en') as ContentLang[];
      const untranslatedEvents = TIMELINE_EVENTS.filter(e => {
        const entry = TIMELINE_TRANS[e.id];
        return !entry || contentLangs.some(l => !entry[l]);
      });
      if (untranslatedEvents.length > 0) {
        problems.push(
          `[i18n] ${untranslatedEvents.length}/${TIMELINE_EVENTS.length} timeline event(s) lack a full translation: ` +
            `${untranslatedEvents.slice(0, 8).map(e => e.id).join(', ')}${untranslatedEvents.length > 8 ? '…' : ''}\n` +
            `        These render English in every language. Add them to TIMELINE_TRANS.`
        );
      }

      // ── Script purity ─────────────────────────────────────────────────────
      // Latin transliteration fused into a Cyrillic word ("континуitet",
      // "Токугава Иejасу") reads as gibberish and is invisible to any
      // key-presence check.
      const ALLOWED_LATIN = new Set(['Pax', 'Romana', 'Corpus', 'Juris', 'Civilis', 'Homo', 'sapiens', 'Historify', 'Clio', 'XP']);
      const fused: string[] = [];
      for (const file of fs.readdirSync(path.resolve(__dirname, 'src/i18n')).filter(f => f.endsWith('.ts'))) {
        const text = fs
          .readFileSync(path.resolve(__dirname, 'src/i18n', file), 'utf8')
          .replace(/\\[nrt\\'"]/g, ' '); // escape sequences are not fused words
        for (const m of text.matchAll(/[Ѐ-ӿ]*[A-Za-z]+[Ѐ-ӿ]+[A-Za-z]*|[Ѐ-ӿ]+[A-Za-z]+/g)) {
          const latin = (m[0].match(/[A-Za-z]+/) ?? [''])[0];
          if (latin.length < 2 || ALLOWED_LATIN.has(latin)) continue;
          fused.push(`${file}: ${m[0]}`);
        }
        // A SINGLE Latin letter between two Cyrillic ones is the same defect and
        // the harder one to see: Latin "j" for Cyrillic "ј" is pixel-identical,
        // so "аjт" reads correctly and sorts, searches and renders wrong. The
        // length>=2 rule above skips these, so they need their own pass.
        for (const m of text.matchAll(/[Ѐ-ӿ][A-Za-z][Ѐ-ӿ]/g)) {
          fused.push(`${file}: ${m[0]} (Latin '${m[0][1]}' inside a Cyrillic word)`);
        }
        // The two passes above only look for LATIN intruders, so a stray
        // character from any other script sails through — a CJK 长 sitting in
        // the middle of a Russian word passed this guard and shipped. None of
        // the six languages uses CJK, Hangul, Arabic, Hebrew, Devanagari or
        // Greek, so their presence anywhere is a corruption, fused or not.
        for (const m of text.matchAll(/[　-鿿가-힯֐-ۿऀ-ॿͰ-Ͽ]/g)) {
          fused.push(`${file}: '${m[0]}' (U+${m[0].codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')} — script not used by any supported language)`);
        }
      }
      const uniqueFused = [...new Set(fused)];
      if (uniqueFused.length > 0) {
        problems.push(
          `[i18n] ${uniqueFused.length} word(s) with foreign characters fused in:\n` +
            uniqueFused.slice(0, 10).map(s => `          ${s}`).join('\n')
        );
      }

      if (problems.length > 0) {
        this.error(problems.join('\n'));
      }
      console.info(
        `\x1b[32m✔\x1b[0m i18n: ${enKeys.length} UI keys × ${langs.length} languages, ` +
          `${TIMELINE_EVENTS.length} timeline events fully translated, no fused-script words`
      );
    },
  };
}

/**
 * Curated art (lesson banners, territory cartography) is referenced by path and
 * rendered with an onError fallback, so a wrong path degrades silently — that is
 * how `middle_ages/` and `early_modern/` went 44 banners unnoticed.
 *
 * A missing FILE is expected: assets are dropped in separately, and the fallback
 * covers it, so that is only reported. A missing DIRECTORY is not — it means the
 * path itself is wrong, since every era/asset folder is committed. That fails.
 */
function assetPathPlugin(): Plugin {
  return {
    name: 'asset-path-check',
    buildStart() {
      const mapped = [
        ...Object.entries(LESSON_LOCAL_BANNERS).map(([k, p]) => ({ k, p, kind: 'banner' })),
        // A topic may carry several time-phased plates; every one must resolve.
        ...Object.entries(TERRITORY_CARTOGRAPHY).flatMap(([k, plates]) =>
          plates.map((plate, i) => ({
            k: plates.length > 1 ? `${k}[${i}]` : k,
            p: plate.src,
            kind: 'cartography',
          }))
        ),
      ];

      const badDirs: string[] = [];
      let absent = 0;
      for (const { k, p, kind } of mapped) {
        const onDisk = path.resolve(__dirname, 'public', p.replace(/^\//, ''));
        if (!fs.existsSync(path.dirname(onDisk))) {
          badDirs.push(`  ${kind} ${k} -> ${p} (no such directory)`);
        } else if (!fs.existsSync(onDisk)) {
          absent++;
        }
      }

      if (badDirs.length > 0) {
        this.error(
          `[assets] ${badDirs.length} mapped path(s) point at a directory that does not exist:\n` +
            `${badDirs.join('\n')}\n` +
            `        Fix the path, or create the folder if it is genuinely new.`
        );
      }
      const present = mapped.length - absent;
      console.info(
        `\x1b[32m✔\x1b[0m assets: ${mapped.length} mapped paths resolve to real folders ` +
          `(${present} present, ${absent} awaiting drop-in)`
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [translationCoveragePlugin(), assetPathPlugin(), react()],
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
