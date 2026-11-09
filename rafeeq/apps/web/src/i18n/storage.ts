import type { AppLocale } from "@/i18n/locale";
import type { NumeralSystem } from "@/i18n/format";

export const LANGUAGE_STORAGE_KEY = "rafeeq.lang";
export const NUMERAL_STORAGE_KEY = "rafeeq.numerals";
export const THEME_STORAGE_KEY = "rafeeq.theme";

export type AppTheme = "light" | "dark";

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
  if (value === "en") {
    return value;
  }
  if (value === "ar") {
    return "en";
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

export const LITERACY_STORAGE_KEY = "rafeeq.literacy";

const STORED_LITERACY_MODES = ["standard", "simple", "voice"] as const;

export type StoredLiteracyMode = (typeof STORED_LITERACY_MODES)[number];

function isStoredLiteracyMode(value: string): value is StoredLiteracyMode {
  return (STORED_LITERACY_MODES as readonly string[]).includes(value);
}

export function readStoredLiteracyMode(storage: KeyValueStore | null): StoredLiteracyMode | null {
  const value = readItem(storage, LITERACY_STORAGE_KEY);
  if (value !== null && isStoredLiteracyMode(value)) {
    return value;
  }
  return null;
}

export function writeStoredLiteracyMode(
  storage: KeyValueStore | null,
  mode: StoredLiteracyMode,
): void {
  if (storage === null) {
    return;
  }
  try {
    storage.setItem(LITERACY_STORAGE_KEY, mode);
  } catch {
    // Private-mode storage can throw. The in-memory literacy mode still changes.
  }
}

export function readStoredTheme(storage: KeyValueStore | null): AppTheme | null {
  const value = readItem(storage, THEME_STORAGE_KEY);
  if (value === "light" || value === "dark") {
    return value;
  }
  return null;
}

export function writeStoredTheme(storage: KeyValueStore | null, theme: AppTheme): void {
  if (storage === null) {
    return;
  }
  try {
    storage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private-mode storage can throw. The in-memory theme still changes.
  }
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
