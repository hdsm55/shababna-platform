import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Load translations on-demand via HTTP to reduce initial bundle size

i18n
  .use(HttpBackend)
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar',
    lng: 'ar',
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;