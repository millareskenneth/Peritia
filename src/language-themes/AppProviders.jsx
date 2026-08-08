'use client';

import { LanguageThemeProvider } from './LanguageThemeProvider';
import { LanguageModes } from './LanguageModes';

export function AppProviders({ children }) {
  return (
    <LanguageThemeProvider>
      {children}
      <LanguageModes />
    </LanguageThemeProvider>
  );
}
