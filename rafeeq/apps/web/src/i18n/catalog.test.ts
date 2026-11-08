import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NAMESPACES } from "@/i18n/namespaces";

const localesRoot = new URL("./locales/", import.meta.url);

function catalog(locale: string, namespace: string): unknown {
  return JSON.parse(readFileSync(new URL(`${locale}/${namespace}.json`, localesRoot), "utf8"));
}

function namespaceFiles(locale: string): string[] {
  return readdirSync(new URL(`${locale}/`, localesRoot))
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.slice(0, -".json".length))
    .sort();
}

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
  it("registers the same namespace files for Arabic and English", () => {
    const expected = [...NAMESPACES].sort();
    expect(namespaceFiles("en")).toEqual(expected);
    expect(namespaceFiles("ar")).toEqual(expected);
  });

  it("gives Arabic and English the same keys in every namespace", () => {
    for (const namespace of NAMESPACES) {
      const english = leaves(catalog("en", namespace));
      const arabic = leaves(catalog("ar", namespace));
      expect([...arabic.keys()].sort(), namespace).toEqual([...english.keys()].sort());
    }
  });

  it("keeps the scaffold placeholder empty and translates every other common string", () => {
    const english = leaves(catalog("en", "common"));
    const arabic = leaves(catalog("ar", "common"));
    expect(english.get("app.placeholder")).toBe("");
    expect(arabic.get("app.placeholder")).toBe("");
    for (const [key, text] of english) {
      if (key === "app.placeholder") {
        continue;
      }
      expect(text.length, key).toBeGreaterThan(0);
      expect(arabic.get(key)?.length, key).toBeGreaterThan(0);
      expect(arabic.get(key), key).not.toBe("TODO_AR");
    }
  });
});
