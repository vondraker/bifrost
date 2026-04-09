import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { translations, type Language } from './i18n-data';
import { I18nContext } from './i18n-context';

const getInitialLanguage = (): Language => {
  const stored = localStorage.getItem('language');
  return stored === 'en' ? 'en' : 'es';
};

function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('language', nextLanguage);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] ?? translations.es[key] ?? key;
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export { I18nProvider };
