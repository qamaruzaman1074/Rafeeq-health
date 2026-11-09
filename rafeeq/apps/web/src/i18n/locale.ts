export type AppLocale = "en";
export type AppDirection = "ltr";

export type DocumentLocaleRoot = {
  lang: string;
  dir: string;
};

export function documentLocale(language: string): { lang: AppLocale; dir: AppDirection } {
  void language;
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
