import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import i18n from "@/i18n";
import { changeAppLanguage } from "@/i18n/language";
import { applyDocumentLocale, documentLocale } from "@/i18n/locale";
import {
  LANGUAGE_STORAGE_KEY,
  NUMERAL_STORAGE_KEY,
  THEME_STORAGE_KEY,
  readStoredLanguage,
  readStoredNumeralSystem,
  readStoredTheme,
  writeStoredLanguage,
  writeStoredNumeralSystem,
  writeStoredTheme,
  type KeyValueStore,
} from "@/i18n/storage";

function memoryStore(
  initial: Record<string, string> = {},
): KeyValueStore & { values: Map<string, string> } {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}

describe("documentLocale", () => {
  it("resolves English and Arabic direction", () => {
    expect(documentLocale("en")).toEqual({ lang: "en", dir: "ltr" });
    expect(documentLocale("ar")).toEqual({ lang: "ar", dir: "rtl" });
    expect(documentLocale("fr")).toEqual({ lang: "en", dir: "ltr" });
  });

  it("writes lang and dir onto a document root", () => {
    const root = { lang: "fr", dir: "rtl" };
    expect(applyDocumentLocale("ar", root)).toEqual({ lang: "ar", dir: "rtl" });
    expect(root).toEqual({ lang: "ar", dir: "rtl" });
  });
});

describe("rafeeq.lang", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("ignores missing and unknown stored values", () => {
    expect(readStoredLanguage(null)).toBeNull();
    expect(readStoredLanguage(memoryStore())).toBeNull();
    expect(readStoredLanguage(memoryStore({ [LANGUAGE_STORAGE_KEY]: "fr" }))).toBeNull();
  });

  it("persists Arabic and applies rtl", async () => {
    const storage = memoryStore({ [LANGUAGE_STORAGE_KEY]: "ar" });
    expect(readStoredLanguage(storage)).toBe("ar");
    const root = { lang: "en", dir: "ltr" };
    await changeAppLanguage("ar", storage, root);
    expect(storage.values.get(LANGUAGE_STORAGE_KEY)).toBe("ar");
    expect(root).toEqual({ lang: "ar", dir: "rtl" });
    expect(i18n.resolvedLanguage).toBe("ar");
    expect(i18n.t("hero.title", { ns: "landing" })).not.toBe("hero.title");
    expect(i18n.hasResourceBundle("ar", "landing")).toBe(true);
  });

  it("reads rafeeq.lang from the document bootstrap", () => {
    const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
    expect(html).toContain('localStorage.getItem("rafeeq.lang")');
    expect(html).toContain('document.documentElement.dir = "rtl"');
  });
});

describe("rafeeq.numerals", () => {
  it("stores only latn or arab and removes the key when cleared", () => {
    const storage = memoryStore();
    expect(readStoredNumeralSystem(storage)).toBeNull();
    expect(readStoredNumeralSystem(memoryStore({ [NUMERAL_STORAGE_KEY]: "roman" }))).toBeNull();
    writeStoredNumeralSystem(storage, "arab");
    expect(readStoredNumeralSystem(storage)).toBe("arab");
    writeStoredLanguage(storage, "en");
    expect(storage.values.get(LANGUAGE_STORAGE_KEY)).toBe("en");
    writeStoredNumeralSystem(storage, null);
    expect(storage.values.has(NUMERAL_STORAGE_KEY)).toBe(false);
  });
});

describe("rafeeq.theme", () => {
  it("stores only light or dark", () => {
    const storage = memoryStore();
    expect(readStoredTheme(storage)).toBeNull();
    expect(readStoredTheme(memoryStore({ [THEME_STORAGE_KEY]: "auto" }))).toBeNull();
    writeStoredTheme(storage, "dark");
    expect(readStoredTheme(storage)).toBe("dark");
  });
});
