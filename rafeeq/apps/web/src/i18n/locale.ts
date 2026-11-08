export type AppLocale = "en" | "ar";
export type AppDirection = "ltr" | "rtl";

export function documentLocale(language: string): { lang: AppLocale; dir: AppDirection } {
  const base = language.split("-")[0] ?? language;
  const lang: AppLocale = base === "ar" ? "ar" : "en";
  return { lang, dir: lang === "ar" ? "rtl" : "ltr" };
}
