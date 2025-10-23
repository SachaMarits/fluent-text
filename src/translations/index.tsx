import React, { createContext, useContext, useState, ReactNode } from 'react';
import { fr } from './fr';
import { en } from './en';

export type Language = 'fr' | 'en';

export type Translations = typeof fr;

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations = {
  fr,
  en,
};

interface TranslationProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children, defaultLanguage = 'fr' }) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const t = (key: keyof Translations): string => {
    return translations[language][key] || key;
  };

  return <TranslationContext.Provider value={{ language, setLanguage, t }}>{children}</TranslationContext.Provider>;
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
