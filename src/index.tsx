// Export du composant principal FluentText
export { default as FluentText } from './FluentText';

// Export du système de traduction
export { TranslationProvider, useTranslation } from './translations';
export type { Language } from './translations';

// Export des traductions
export { fr as frTranslations } from './translations/fr';
export { en as enTranslations } from './translations/en';
