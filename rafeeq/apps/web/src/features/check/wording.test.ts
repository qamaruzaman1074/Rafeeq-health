import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

function catalogStrings(file: string): string[] {
  const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
  const found: string[] = [];
  function walk(value: unknown): void {
    if (typeof value === "string") {
      found.push(value);
      return;
    }
    if (typeof value === "object" && value !== null) {
      for (const child of Object.values(value)) {
        walk(child);
      }
    }
  }
  walk(parsed);
  return found;
}

describe("check locale wording", () => {
  it("keeps failure words out of the en check catalog", () => {
    const english = catalogStrings(
      fileURLToPath(new URL("../../i18n/locales/en/check.json", import.meta.url)),
    );
    const englishFailure = /wrong|incorrect/i;
    const hits = english.filter((line) => englishFailure.test(line));
    expect(hits).toEqual([]);
  });
});
