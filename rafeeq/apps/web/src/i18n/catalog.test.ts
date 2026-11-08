import { describe, expect, it } from "vitest";
import ar from "@/i18n/locales/ar/common.json";
import en from "@/i18n/locales/en/common.json";

function leaves(value: unknown, prefix = ""): Map<string, string> {
  const found = new Map<string, string>();
  if (typeof value === "string") {
    if (prefix.length > 0) {
      found.set(prefix, value);
    }
    return found;
  }
  if (typeof value !== "object" || value === null) {
    return found;
  }
  for (const [key, child] of Object.entries(value)) {
    const next = prefix.length > 0 ? `${prefix}.${key}` : key;
    for (const [leaf, text] of leaves(child, next)) {
      found.set(leaf, text);
    }
  }
  return found;
}

describe("locale catalogs", () => {
  it("gives Arabic and English the same keys", () => {
    const english = leaves(en);
    const arabic = leaves(ar);
    expect([...arabic.keys()].sort()).toEqual([...english.keys()].sort());
  });

  it("keeps the scaffold placeholder empty and translates every other string", () => {
    const english = leaves(en);
    const arabic = leaves(ar);
    expect(english.get("app.placeholder")).toBe("");
    expect(arabic.get("app.placeholder")).toBe("");
    for (const [key, text] of english) {
      if (key === "app.placeholder") {
        continue;
      }
      expect(text.length, key).toBeGreaterThan(0);
      expect(arabic.get(key)?.length, key).toBeGreaterThan(0);
    }
  });
});
