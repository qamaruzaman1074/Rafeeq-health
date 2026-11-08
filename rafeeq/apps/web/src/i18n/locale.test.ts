import { describe, expect, it } from "vitest";
import { documentLocale } from "@/i18n/locale";

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
});
