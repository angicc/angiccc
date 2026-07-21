import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { T, LANGUAGE_LABELS, type Language } from '@/i18n/translations';
import { LESSONS } from '@/features/content/lessonsData';
import { hasStaticLessonTranslation } from '@/i18n/contentTranslations';
import { subscribeTranslations, warmMetaForLanguage } from '@/i18n/dynamicLessonTranslation';

type LanguageContextValue = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: typeof T['en'];
  languageLabels: typeof LANGUAGE_LABELS;
  /** Bumped whenever a new AI lesson translation is cached, so content that
   *  reads from the runtime translation cache re-renders with the fresh text. */
  contentVersion: number;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem('historify:language') as Language | null;
    return stored && stored in T ? stored : 'en';
  });
  const [contentVersion, setContentVersion] = useState(0);

  function setLanguage(l: Language) {
    setLang(l);
    localStorage.setItem('historify:language', l);
  }

  // Re-render consumers whenever the runtime translation cache changes.
  useEffect(() => subscribeTranslations(() => setContentVersion(v => v + 1)), []);

  // On a non-English language, warm the META (titles, key facts, headings) of
  // every lesson that has no hand-authored translation, so lists and headers
  // stop showing English. Bodies are translated on demand when a lesson opens.
  useEffect(() => {
    if (language === 'en') return;
    let cancelled = false;
    const pending = LESSONS.filter(l => !hasStaticLessonTranslation(l.id));
    // Defer past first paint so it never blocks initial render.
    const timer = setTimeout(() => {
      if (!cancelled) void warmMetaForLanguage(pending, language);
    }, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: T[language], languageLabels: LANGUAGE_LABELS, contentVersion }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
