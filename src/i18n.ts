import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    // تمت إضافة عدد كبير من اللغات الافتراضية للشمولية
    supportedLngs: ['en', 'ar', 'es', 'fr', 'tr', 'zh', 'ja', 'de', 'ru', 'pt'], 
    debug: import.meta.env.DEV,
    
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    interpolation: {
      escapeValue: false,
    },
    
    ns: ['common'],
    defaultNS: 'common'
  });

export default i18n;