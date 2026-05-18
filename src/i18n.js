import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./Translation_Content/english.json";
import hi from "./Translation_Content/hindi.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },

  lng: "en",          // default language
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;