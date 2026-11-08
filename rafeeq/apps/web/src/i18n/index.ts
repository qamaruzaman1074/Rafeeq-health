import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { applyDocumentLocale } from "@/i18n/locale";
import { NAMESPACES } from "@/i18n/namespaces";
import { browserStorage, readStoredLanguage } from "@/i18n/storage";

const localeModules = import.meta.glob<Record<string, unknown>>("./locales/*/*.json", {
  eager: true,
  import: "default",
});

type LocaleResources = {
  en: Record<string, Record<string, unknown>>;
  ar: Record<string, Record<string, unknown>>;
};

function loadResources(): LocaleResources {
  const resources: LocaleResources = { en: {}, ar: {} };
  for (const [path, catalog] of Object.entries(localeModules)) {
    const match = /^\.\/locales\/(en|ar)\/([^/]+)\.json$/.exec(path);
    const lang = match?.[1];
    const namespace = match?.[2];
    if ((lang !== "en" && lang !== "ar") || namespace === undefined) {
      continue;
    }
    resources[lang][namespace] = catalog;
  }
  return resources;
}

// OPEN_QUESTION: MASTER.md does not set the product default locale.
// `en` is only a bootstrap fallback when `rafeeq.lang` is absent.
const initialLanguage = readStoredLanguage(browserStorage()) ?? "en";

void i18n.use(initReactI18next).init({
  resources: loadResources(),
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: ["en", "ar"],
  ns: [...NAMESPACES],
  defaultNS: "common",
  returnEmptyString: true,
  initAsync: false,
  interpolation: { escapeValue: false },
});

applyDocumentLocale(i18n.resolvedLanguage ?? i18n.language);

export default i18n;
