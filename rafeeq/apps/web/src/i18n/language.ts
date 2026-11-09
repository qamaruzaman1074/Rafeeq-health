import i18n from "@/i18n";
import { loadLocaleNamespaces } from "@/i18n/load-namespace";
import { applyDocumentLocale, documentLocale, type DocumentLocaleRoot } from "@/i18n/locale";
import { browserStorage, writeStoredLanguage, type KeyValueStore } from "@/i18n/storage";

export async function changeAppLanguage(
  language: string,
  storage: KeyValueStore | null = browserStorage(),
  root?: DocumentLocaleRoot | null,
): Promise<void> {
  const locale = documentLocale(language).lang as "en" | "ar";
  await loadLocaleNamespaces(locale);
  if (locale === "ar") {
    await loadLocaleNamespaces("en");
  }
  writeStoredLanguage(storage, locale);
  if (root === undefined) {
    applyDocumentLocale(locale);
  } else {
    applyDocumentLocale(locale, root);
  }
  await i18n.changeLanguage(locale);
}
