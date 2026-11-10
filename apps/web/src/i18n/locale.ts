export type AppLocale = "en" | "ar";
export type AppDirection = "ltr" | "rtl";

export type DocumentLocaleRoot = {
  lang: string;
  dir: string;
};

export function documentLocale(language: string): { lang: AppLocale; dir: AppDirection } {
  const normalized = language.split("-")[0]?.toLowerCase() ?? "en";
  if (normalized === "ar") {
    return { lang: "ar", dir: "rtl" };
  }
  return { lang: "en", dir: "ltr" };
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
