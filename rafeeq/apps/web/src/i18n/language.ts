import i18n from "@/i18n";
import { applyDocumentLocale, documentLocale, type DocumentLocaleRoot } from "@/i18n/locale";
import { browserStorage, writeStoredLanguage, type KeyValueStore } from "@/i18n/storage";

export function changeAppLanguage(
  language: string,
  storage: KeyValueStore | null = browserStorage(),
  root?: DocumentLocaleRoot | null,
): Promise<void> {
  const locale = documentLocale(language).lang;
  writeStoredLanguage(storage, locale);
  if (root === undefined) {
    applyDocumentLocale(locale);
  } else {
    applyDocumentLocale(locale, root);
  }
  return i18n.changeLanguage(locale).then(() => undefined);
}
