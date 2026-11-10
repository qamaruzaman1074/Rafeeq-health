import type { AppLocale } from "@/i18n/locale";

/** Unicode numbering systems. `arab` is Arabic-Indic (U+0660–U+0669). `latn` is Western. */
export type NumeralSystem = "latn" | "arab";

const numberingSystem: Record<NumeralSystem, NumeralSystem> = {
  latn: "latn",
  arab: "arab",
};

export function defaultNumeralSystem(_locale: AppLocale): NumeralSystem {
  void _locale;
  return "latn";
}

export function resolveNumeralSystem(
  locale: AppLocale,
  stored: NumeralSystem | null,
): NumeralSystem {
  return stored ?? defaultNumeralSystem(locale);
}

/** `null` clears the stored override so the next locale keeps its own default. */
export function numeralPreferenceUpdate(
  locale: AppLocale,
  next: NumeralSystem,
): NumeralSystem | null {
  return next === defaultNumeralSystem(locale) ? null : next;
}

export function formatNumber(value: number, system: NumeralSystem, locale: AppLocale): string {
  return new Intl.NumberFormat(locale, {
    numberingSystem: numberingSystem[system],
    useGrouping: false,
  }).format(value);
}

export function formatDate(value: Date, system: NumeralSystem, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    calendar: "gregory",
    numberingSystem: numberingSystem[system],
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}
