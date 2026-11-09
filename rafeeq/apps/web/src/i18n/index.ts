import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { applyDocumentLocale } from "@/i18n/locale";
import { NAMESPACES } from "@/i18n/namespaces";
import { browserStorage, readStoredLanguage } from "@/i18n/storage";

// Clinic and insights catalogs are registered by those routes (and the demo
// buttons that open them) so they stay out of the first route bundle.
const enModules = import.meta.glob<Record<string, unknown>>(
  ["./locales/en/*.json", "!./locales/en/clinic.json", "!./locales/en/insights.json"],
  {
    eager: true,
    import: "default",
  },
);

const arModules = import.meta.glob<Record<string, unknown>>(
  ["./locales/ar/*.json", "!./locales/ar/clinic.json", "!./locales/ar/insights.json"],
  {
    eager: true,
    import: "default",
  },
);

type LocaleResources = {
  en: Record<string, Record<string, unknown>>;
  ar: Record<string, Record<string, unknown>>;
};

function mergeLocale(
  target: Record<string, Record<string, unknown>>,
  modules: Record<string, Record<string, unknown>>,
  locale: string,
): void {
  for (const [path, catalog] of Object.entries(modules)) {
    const match = new RegExp(`^\\.\\/locales\\/${locale}\\/([^/]+)\\.json$`).exec(path);
    const namespace = match?.[1];
    if (namespace === undefined) {
      continue;
    }
    target[namespace] = catalog;
  }
}

function loadResources(): LocaleResources {
  const resources: LocaleResources = { en: {}, ar: {} };
  mergeLocale(resources.en, enModules, "en");
  mergeLocale(resources.ar, arModules, "ar");
  return resources;
}

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
