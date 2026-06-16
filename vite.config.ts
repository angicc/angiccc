import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { T, LANGUAGE_LABELS } from './src/i18n/translations';

function translationCoveragePlugin(): Plugin {
  return {
    name: 'translation-coverage-check',
    buildStart() {
      const langs = Object.keys(T) as Array<keyof typeof T>;
      const enKeys = Object.keys(T.en);
      let allOk = true;
      for (const lang of langs) {
        if (lang === 'en') continue;
        const langKeys = new Set(Object.keys(T[lang]));
        const missing = enKeys.filter(k => !langKeys.has(k));
        if (missing.length > 0) {
          allOk = false;
          this.error(
            `[i18n] ${LANGUAGE_LABELS[lang]} is missing ${missing.length} key(s): ${missing.slice(0, 10).join(', ')}${missing.length > 10 ? '...' : ''}`
          );
        }
      }
      if (allOk) {
        console.info(`\x1b[32m✔\x1b[0m i18n: all ${langs.length} languages have 100% coverage (${enKeys.length} keys)`);
      }
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
