import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { applyDocumentTheme, resolveTheme } from "@/app/theme";
import {
  THEME_STORAGE_KEY,
  readStoredTheme,
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

describe("theme preference", () => {
  it("ignores missing and unknown stored values", () => {
    expect(readStoredTheme(null)).toBeNull();
    expect(readStoredTheme(memoryStore())).toBeNull();
    expect(readStoredTheme(memoryStore({ [THEME_STORAGE_KEY]: "system" }))).toBeNull();
  });

  it("uses the saved theme before the operating-system preference", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });

  it("persists light and dark under rafeeq.theme", () => {
    const storage = memoryStore();
    writeStoredTheme(storage, "dark");
    expect(storage.values.get(THEME_STORAGE_KEY)).toBe("dark");
    expect(readStoredTheme(storage)).toBe("dark");
    writeStoredTheme(storage, "light");
    expect(readStoredTheme(storage)).toBe("light");
  });

  it("writes data-theme and color-scheme onto a document root", () => {
    const root = { attrs: new Map<string, string>(), style: { colorScheme: "light" } };
    applyDocumentTheme("dark", {
      setAttribute: (name, value) => {
        root.attrs.set(name, value);
      },
      style: root.style,
    });
    expect(root.attrs.get("data-theme")).toBe("dark");
    expect(root.style.colorScheme).toBe("dark");
  });

  it("bootstraps the theme before the app bundle in index.html", () => {
    const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
    expect(html).toContain('localStorage.getItem("rafeeq.theme")');
    expect(html).toContain("prefers-color-scheme: dark");
    expect(html).toContain('setAttribute("data-theme", theme)');
    expect(html).toContain('localStorage.getItem("rafeeq.lang")');
  });
});
