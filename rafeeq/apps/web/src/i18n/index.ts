import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "@/i18n/locales/ar/common.json";
import en from "@/i18n/locales/en/common.json";

// OPEN_QUESTION: MASTER.md does not set the product default locale.
// `en` is only a bootstrap fallback so i18next can initialize.
void i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    ar: { common: ar },
  },
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en", "ar"],
  ns: ["common"],
  defaultNS: "common",
  returnEmptyString: true,
  initAsync: false,
  interpolation: { escapeValue: false },
});

export default i18n;
