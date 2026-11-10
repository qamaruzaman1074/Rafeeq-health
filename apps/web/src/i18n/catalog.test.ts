import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NAMESPACES } from "@/i18n/namespaces";

const localesRoot = new URL("./locales/", import.meta.url);

function catalog(namespace: string): unknown {
  return JSON.parse(readFileSync(new URL(`en/${namespace}.json`, localesRoot), "utf8"));
}

function namespaceFiles(): string[] {
  return readdirSync(new URL("en/", localesRoot))
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
  it("registers every app namespace in English", () => {
    const expected = [...NAMESPACES].sort();
    expect(namespaceFiles()).toEqual(expected);
  });

  it("gives English a non-empty string for every key", () => {
    for (const namespace of NAMESPACES) {
      const english = leaves(catalog(namespace));
      for (const [key, text] of english) {
        if (key === "app.placeholder") {
          continue;
        }
        expect(text.length, `${namespace}.${key}`).toBeGreaterThan(0);
        expect(text, `${namespace}.${key}`).not.toBe("TODO_AR");
      }
    }
  });

  it("keeps the scaffold placeholder empty", () => {
    const english = leaves(catalog("common"));
    expect(english.get("app.placeholder")).toBe("");
  });
});
