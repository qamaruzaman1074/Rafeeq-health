import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { applyDocumentLocale } from "@/i18n/locale";
import { NAMESPACES } from "@/i18n/namespaces";
import { browserStorage, readStoredLanguage } from "@/i18n/storage";
import commonAr from "@/i18n/locales/ar/common.json";
import errorsAr from "@/i18n/locales/ar/errors.json";
import landingAr from "@/i18n/locales/ar/landing.json";
import publicAr from "@/i18n/locales/ar/public.json";
import commonEn from "@/i18n/locales/en/common.json";
import errorsEn from "@/i18n/locales/en/errors.json";
import landingEn from "@/i18n/locales/en/landing.json";
import publicEn from "@/i18n/locales/en/public.json";

const initialLanguage = readStoredLanguage(browserStorage()) ?? "en";
const initialLocale = initialLanguage === "ar" ? "ar" : "en";

const resources = {
  en: {
    common: commonEn,
    landing: landingEn,
    public: publicEn,
    errors: errorsEn,
  },
  ...(initialLocale === "ar"
    ? {
        ar: {
          common: commonAr,
          landing: landingAr,
          public: publicAr,
          errors: errorsAr,
        },
      }
    : {}),
};

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: "en",
  supportedLngs: ["en", "ar"],
  ns: [...NAMESPACES],
  defaultNS: "common",
  partialBundledLanguages: true,
  returnEmptyString: true,
  initAsync: false,
  interpolation: { escapeValue: false },
});

applyDocumentLocale(i18n.resolvedLanguage ?? i18n.language);

export default i18n;
export { initialLocale };
