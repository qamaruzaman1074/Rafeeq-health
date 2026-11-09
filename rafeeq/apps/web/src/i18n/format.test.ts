import { describe, expect, it } from "vitest";
import {
  defaultNumeralSystem,
  formatDate,
  formatNumber,
  numeralPreferenceUpdate,
  resolveNumeralSystem,
} from "@/i18n/format";

const sampleDate = new Date(Date.UTC(2026, 0, 15));

describe("formatNumber", () => {
  it("shapes 25 as Arabic-Indic digits when that system is on", () => {
    expect(formatNumber(25, "arab", "ar")).toBe("٢٥");
    expect(formatNumber(25, "arab", "en")).toBe("٢٥");
  });

  it("keeps Western digits when that system is on", () => {
    expect(formatNumber(25, "latn", "en")).toBe("25");
    expect(formatNumber(25, "latn", "ar")).toBe("25");
  });

  it("maps each digit and does not insert grouping", () => {
    expect(formatNumber(1234567890, "arab", "en")).toBe("١٢٣٤٥٦٧٨٩٠");
    expect(formatNumber(1000, "latn", "en")).toBe("1000");
  });
});

describe("formatDate", () => {
  it("uses Arabic-Indic digits when that system is on", () => {
    const formatted = formatDate(sampleDate, "arab", "en");
    expect(formatted).toMatch(/[٠-٩]/u);
    expect(formatted).not.toMatch(/[0-9]/u);
  });

  it("uses Western digits when that system is on", () => {
    const formatted = formatDate(sampleDate, "latn", "en");
    expect(formatted).toMatch(/[0-9]/u);
    expect(formatted).not.toMatch(/[٠-٩]/u);
    expect(formatted).toContain("2026");
    expect(formatted).toContain("15");
  });
});

describe("numeral defaults", () => {
  it("follows the locale until the user stores an override", () => {
    expect(defaultNumeralSystem("en")).toBe("latn");
    expect(resolveNumeralSystem("en", null)).toBe("latn");
    expect(resolveNumeralSystem("en", "arab")).toBe("arab");
  });

  it("clears the stored override when the choice matches the locale default", () => {
    expect(numeralPreferenceUpdate("en", "latn")).toBeNull();
    expect(numeralPreferenceUpdate("en", "arab")).toBe("arab");
  });
});
