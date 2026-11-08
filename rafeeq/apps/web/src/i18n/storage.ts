import type { AppLocale } from "@/i18n/locale";
import type { NumeralSystem } from "@/i18n/format";

export const LANGUAGE_STORAGE_KEY = "rafeeq.lang";
export const NUMERAL_STORAGE_KEY = "rafeeq.numerals";

export type KeyValueStore = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export function browserStorage(): KeyValueStore | null {
  try {
    if (typeof localStorage === "undefined") {
      return null;
    }
    return localStorage;
  } catch {
    return null;
  }
}

function readItem(storage: KeyValueStore | null, key: string): string | null {
  if (storage === null) {
    return null;
  }
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function readStoredLanguage(storage: KeyValueStore | null): AppLocale | null {
  const value = readItem(storage, LANGUAGE_STORAGE_KEY);
  if (value === "en" || value === "ar") {
    return value;
  }
  return null;
}

export function writeStoredLanguage(storage: KeyValueStore | null, locale: AppLocale): void {
  if (storage === null) {
    return;
  }
  try {
    storage.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // Private-mode storage can throw. The in-memory language still changes.
  }
}

export function readStoredNumeralSystem(storage: KeyValueStore | null): NumeralSystem | null {
  const value = readItem(storage, NUMERAL_STORAGE_KEY);
  if (value === "latn" || value === "arab") {
    return value;
  }
  return null;
}

export function writeStoredNumeralSystem(
  storage: KeyValueStore | null,
  system: NumeralSystem | null,
): void {
  if (storage === null) {
    return;
  }
  try {
    if (system === null) {
      storage.removeItem(NUMERAL_STORAGE_KEY);
      return;
    }
    storage.setItem(NUMERAL_STORAGE_KEY, system);
  } catch {
    // Private-mode storage can throw. The in-memory numeral system still changes.
  }
}
