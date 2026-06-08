import { createContext, useContext, useState, type ReactNode } from 'react';
import { T, LANGUAGE_LABELS, type Language } from '@/i18n/translations';

type LanguageContextValue = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: typeof T['en'];
  languageLabels: typeof LANGUAGE_LABELS;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem('historify:language') as Language | null;
    return stored && stored in T ? stored : 'en';
  });

  function setLanguage(l: Language) {
    setLang(l);
    localStorage.setItem('historify:language', l);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: T[language], languageLabels: LANGUAGE_LABELS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
