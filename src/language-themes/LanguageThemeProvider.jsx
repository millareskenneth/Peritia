'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { MantineProvider } from '@mantine/core';
import { theme as mantineTheme } from '../theme';
import {
  DEFAULT_LANG,
  LANGUAGE_THEMES,
  STORAGE_KEY,
  resolveLanguage,
} from './catalog';

const LanguageThemeContext = createContext({
  langId: DEFAULT_LANG,
  language: LANGUAGE_THEMES[DEFAULT_LANG],
  setLangId: () => {},
  isPending: false,
  ready: false,
});

export function LanguageThemeProvider({ children }) {
  const [langId, setLangIdState] = useState(DEFAULT_LANG);
  const [ready, setReady] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const next = resolveLanguage(stored).id;
      setLangIdState(next);
      document.documentElement.dataset.lang = next;
    } catch {
      document.documentElement.dataset.lang = DEFAULT_LANG;
    }
    setReady(true);
  }, []);

  const setLangId = useCallback((id) => {
    const next = resolveLanguage(id).id;
    startTransition(() => {
      setLangIdState(next);
      document.documentElement.dataset.lang = next;
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
    });
  }, []);

  const language = resolveLanguage(langId);

  const value = useMemo(
    () => ({ langId: language.id, language, setLangId, isPending, ready }),
    [language, setLangId, isPending, ready],
  );

  return (
    <LanguageThemeContext.Provider value={value}>
      <MantineProvider
        key={language.scheme}
        theme={mantineTheme}
        defaultColorScheme={language.scheme}
        forceColorScheme={language.scheme}
      >
        {children}
      </MantineProvider>
    </LanguageThemeContext.Provider>
  );
}

export function useLanguageTheme() {
  return useContext(LanguageThemeContext);
}
