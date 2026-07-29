import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Language, Translation } from './types';

// Import all translations
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';

const translations: Record<Language, Translation> = {
  en,
  fr,
  es
};

type TranslationValue = string | Record<string, TranslationValue>;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const DEFAULT_LANGUAGE: Language = 'fr';
const LANGUAGE_KEY = 'preferred-language';

/**
 * Detect browser language and map to supported languages
 * Falls back to default language if browser language is not supported
 */
const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const nav = navigator as Navigator & { userLanguage?: string };
  const browserLang = nav.language || nav.userLanguage || '';
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Map browser language codes to supported languages
  const languageMap: Record<string, Language> = {
    'fr': 'fr',
    'en': 'en',
    'es': 'es',
  };
  
  return languageMap[langCode] || DEFAULT_LANGUAGE;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      if (saved && (saved === 'fr' || saved === 'en' || saved === 'es')) {
        return saved as Language;
      }
    } catch {
      // Ignore storage access errors and fall back to browser detection.
    }
    
    return detectBrowserLanguage();
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch {
      // Ignore storage access errors and keep in-memory language state.
    }
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: TranslationValue | undefined = translations[language] as TranslationValue;
    
    for (const k of keys) {
      if (typeof value !== 'object' || value === null || !(k in value)) {
        value = undefined;
        break;
      }

      value = value[k] as TranslationValue | undefined;
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    return value;
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
