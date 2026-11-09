import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeAll, describe, expect, it } from "vitest";
import { LiteracyProvider } from "@/app/literacy";
import { audioUrlForBlock, readContentBlock, readLocaleBlock } from "@/features/learn/blocks";
import { fetchGlossary, requestTts } from "@/features/learn/api";
import { LearnView } from "@/features/learn/learn-view";
import { LEARN_MODULES } from "@/features/learn/modules";
import i18n from "@/i18n";
import { ApiRequestError, apiRequest } from "@/lib/api";
import { LITERACY_STORAGE_KEY, type KeyValueStore } from "@/i18n/storage";

function memoryStore(initial: Record<string, string> = {}): KeyValueStore {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}

function renderLearn(mode: "standard" | "simple" | "voice"): string {
  const store = memoryStore({ [LITERACY_STORAGE_KEY]: mode });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const tree: ReactNode = createElement(
    I18nextProvider,
    { i18n },
    createElement(
      QueryClientProvider,
      { client },
      createElement(
        MemoryRouter,
        null,
        createElement(LiteracyProvider, {
          storage: store,
          children: createElement(LearnView),
        }),
      ),
    ),
  );
  return renderToStaticMarkup(tree);
}

describe("learn content blocks", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("keeps empty content files as missing blocks", () => {
    expect(LEARN_MODULES).toHaveLength(7);
    for (const module of LEARN_MODULES) {
      expect(readLocaleBlock("en", module.fullBlockId)).toEqual({ text: null, audioUrl: null });
      expect(readLocaleBlock("ar", module.shortBlockId)).toEqual({ text: null, audioUrl: null });
    }
  });

  it("reads text and an audio url when a block entry has them", () => {
    const file = {
      "learn.carrier.full": { text: "Approved line", audio_url: "/audio/carrier.wav" },
      "learn.carrier.short": "Short line",
      blank: "   ",
    };
    expect(readContentBlock(file, "learn.carrier.full")).toEqual({
      text: "Approved line",
      audioUrl: "/audio/carrier.wav",
    });
    expect(readContentBlock(file, "learn.carrier.short")).toEqual({
      text: "Short line",
      audioUrl: null,
    });
    expect(readContentBlock(file, "blank")).toEqual({ text: null, audioUrl: null });
    expect(readContentBlock(file, "missing")).toEqual({ text: null, audioUrl: null });
    expect(audioUrlForBlock("learn.carrier.full", null)).toBe("/mock-audio/learn.carrier.full");
    expect(audioUrlForBlock("learn.carrier.full", "/audio/carrier.wav")).toBe("/audio/carrier.wav");
  });

  it("returns glossary text for the requested locale and a stable tts url", async () => {
    const english = await fetchGlossary("carrier", "en");
    expect(english).toEqual({
      term: "carrier",
      block_id: "glossary.carrier",
      locale: "en",
      text: null,
    });
    const arabic = await fetchGlossary("relatedness", "ar");
    expect(arabic.locale).toBe("ar");
    expect(arabic.block_id).toBe("glossary.relatedness");
    expect(arabic.text).toBeNull();

    const first = await requestTts("learn.carrier.full", "en");
    const second = await requestTts("learn.carrier.full", "ar");
    expect(first).toEqual({
      block_id: "learn.carrier.full",
      locale: "en",
      url: "/mock-audio/learn.carrier.full",
      text: null,
    });
    expect(second.url).toBe(first.url);
    expect(second.text).toBeNull();
    expect(second.locale).toBe("ar");

    await expect(
      apiRequest("/api/v1/tts", { method: "POST", body: JSON.stringify({}) }),
    ).rejects.toMatchObject({
      name: "ApiRequestError",
      status: 400,
      messageKey: "missingBlock",
    });
    await expect(apiRequest("/api/v1/tts", { method: "POST" })).rejects.toBeInstanceOf(
      ApiRequestError,
    );
  });

  it("shows full text in standard mode, short text and icons in simple mode, and controls in voice mode", () => {
    const standard = renderLearn("standard");
    expect(standard).toContain(">Learn<");
    expect(standard).toContain(">What is a carrier<");
    expect(standard).toContain("Play audio: What is a carrier");
    expect(standard).toContain("Transcript: What is a carrier");
    expect(standard).toContain("Glossary: carrier");
    expect(standard).toContain("Not available yet");
    expect(standard).toContain("learn.carrier.full");
    expect(standard).not.toContain("data-module-icon");
    expect(standard).not.toContain("min-h-20");

    const simple = renderLearn("simple");
    expect(simple).toContain('data-module-icon="carrier"');
    expect(simple).toContain("learn.carrier.short");
    expect(simple).toContain("Not available yet");
    expect(simple).toContain('data-literacy="simple"');
    expect(simple).not.toContain("learn.carrier.full");

    const voice = renderLearn("voice");
    expect(voice).toContain("min-h-20");
    expect(voice).toContain("Show transcript: What is a carrier");
    expect(voice).toContain("Play audio: What is a carrier");
    expect(voice).not.toContain("Not available yet");
    expect(voice).not.toContain("data-module-icon");
    expect(voice).not.toContain('role="region"');
  });
});
