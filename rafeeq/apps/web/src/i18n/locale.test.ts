import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import i18n from "@/i18n";
import { changeAppLanguage } from "@/i18n/language";
import { applyDocumentLocale, documentLocale } from "@/i18n/locale";
import {
  LANGUAGE_STORAGE_KEY,
  NUMERAL_STORAGE_KEY,
  readStoredLanguage,
  readStoredNumeralSystem,
  writeStoredLanguage,
  writeStoredNumeralSystem,
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
  it("maps Arabic to rtl", () => {
    expect(documentLocale("ar")).toEqual({ lang: "ar", dir: "rtl" });
    expect(documentLocale("ar-AE")).toEqual({ lang: "ar", dir: "rtl" });
  });

  it("maps English and unknown languages to ltr", () => {
    expect(documentLocale("en")).toEqual({ lang: "en", dir: "ltr" });
    expect(documentLocale("en-GB")).toEqual({ lang: "en", dir: "ltr" });
    expect(documentLocale("fr")).toEqual({ lang: "en", dir: "ltr" });
  });

  it("writes lang and dir onto a document root", () => {
    const root = { lang: "en", dir: "ltr" };
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

  it("persists a language switch under rafeeq.lang and flips direction", async () => {
    const storage = memoryStore();
    const root = { lang: "en", dir: "ltr" };
    await changeAppLanguage("ar", storage, root);
    expect(storage.values.get(LANGUAGE_STORAGE_KEY)).toBe("ar");
    expect(root).toEqual({ lang: "ar", dir: "rtl" });
    expect(i18n.resolvedLanguage).toBe("ar");
    expect(readStoredLanguage(storage)).toBe("ar");

    await changeAppLanguage("en", storage, root);
    expect(storage.values.get(LANGUAGE_STORAGE_KEY)).toBe("en");
    expect(root).toEqual({ lang: "en", dir: "ltr" });
  });

  it("reads rafeeq.lang from the document bootstrap", () => {
    const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
    expect(html).toContain('localStorage.getItem("rafeeq.lang")');
    expect(html).toContain('stored === "ar" ? "rtl" : "ltr"');
  });
});

describe("rafeeq.numerals", () => {
  it("stores only latn or arab and removes the key when cleared", () => {
    const storage = memoryStore();
    expect(readStoredNumeralSystem(storage)).toBeNull();
    expect(readStoredNumeralSystem(memoryStore({ [NUMERAL_STORAGE_KEY]: "roman" }))).toBeNull();
    writeStoredNumeralSystem(storage, "arab");
    expect(readStoredNumeralSystem(storage)).toBe("arab");
    writeStoredLanguage(storage, "ar");
    expect(storage.values.get(LANGUAGE_STORAGE_KEY)).toBe("ar");
    writeStoredNumeralSystem(storage, null);
    expect(storage.values.has(NUMERAL_STORAGE_KEY)).toBe(false);
  });
});
