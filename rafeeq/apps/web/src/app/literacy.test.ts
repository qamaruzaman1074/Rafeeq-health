import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LiteracyProvider, useLiteracy } from "@/app/literacy";
import {
  LITERACY_STORAGE_KEY,
  readStoredLiteracyMode,
  writeStoredLiteracyMode,
  type KeyValueStore,
} from "@/i18n/storage";

function memoryStore(): KeyValueStore & { snapshot: () => string | null } {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
    snapshot: () => values.get(LITERACY_STORAGE_KEY) ?? null,
  };
}

function Probe() {
  const { mode } = useLiteracy();
  return createElement("p", null, mode);
}

describe("literacy storage", () => {
  it("stores standard, simple, and voice under rafeeq.literacy", () => {
    const store = memoryStore();
    expect(readStoredLiteracyMode(store)).toBeNull();
    expect(LITERACY_STORAGE_KEY).toBe("rafeeq.literacy");

    writeStoredLiteracyMode(store, "simple");
    expect(store.snapshot()).toBe("simple");
    expect(readStoredLiteracyMode(store)).toBe("simple");

    writeStoredLiteracyMode(store, "voice");
    expect(readStoredLiteracyMode(store)).toBe("voice");

    writeStoredLiteracyMode(store, "standard");
    expect(readStoredLiteracyMode(store)).toBe("standard");

    store.setItem(LITERACY_STORAGE_KEY, "loud");
    expect(readStoredLiteracyMode(store)).toBeNull();
    expect(readStoredLiteracyMode(null)).toBeNull();
  });

  it("restores the stored mode when the provider mounts", () => {
    const store = memoryStore();
    writeStoredLiteracyMode(store, "voice");
    const html = renderToStaticMarkup(
      createElement(LiteracyProvider, { storage: store, children: createElement(Probe) }),
    );
    expect(html).toContain(">voice<");
  });
});
