import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['de', 'en'], 
    fallbackLng: 'de',          
    debug: process.env.NODE_ENV === 'development', 

    detection: {
      order: ['localStorage', 'cookie'],
      caches: ['localStorage', 'cookie'], 
    },
    backend: {
      loadPath: process.env.PUBLIC_URL + '/locales/{{lng}}/{{ns}}.json',

    },
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;