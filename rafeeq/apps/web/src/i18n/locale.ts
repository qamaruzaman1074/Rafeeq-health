export type AppLocale = "en" | "ar";
export type AppDirection = "ltr" | "rtl";

export type DocumentLocaleRoot = {
  lang: string;
  dir: string;
};

export function documentLocale(language: string): { lang: AppLocale; dir: AppDirection } {
  const base = language.split("-")[0] ?? language;
  const lang: AppLocale = base === "ar" ? "ar" : "en";
  return { lang, dir: lang === "ar" ? "rtl" : "ltr" };
}

function defaultDocumentRoot(): DocumentLocaleRoot | null {
  if (typeof document === "undefined") {
    return null;
  }
  return document.documentElement;
}

export function applyDocumentLocale(
  language: string,
  root: DocumentLocaleRoot | null = defaultDocumentRoot(),
): { lang: AppLocale; dir: AppDirection } {
  const locale = documentLocale(language);
  if (root !== null) {
    root.lang = locale.lang;
    root.dir = locale.dir;
  }
  return locale;
}
