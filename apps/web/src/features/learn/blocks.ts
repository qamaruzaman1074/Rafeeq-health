import blocksAr from "../../../../../content/blocks.ar.json";
import blocksEn from "../../../../../content/blocks.en.json";

export type LocaleCode = "en" | "ar";

export type ContentBlock = {
  text: string | null;
  audioUrl: string | null;
};

const englishBlocks: unknown = blocksEn;
const arabicBlocks: unknown = blocksAr;

function nonEmpty(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  return trimmed;
}

/** Approved copy lives in blocks.{locale}.json. Arabic blocks are draft pending review. */
export function readContentBlock(file: unknown, blockId: string): ContentBlock {
  if (typeof file !== "object" || file === null || Array.isArray(file)) {
    return { text: null, audioUrl: null };
  }
  if (!Object.hasOwn(file, blockId)) {
    return { text: null, audioUrl: null };
  }
  const entry = (file as Record<string, unknown>)[blockId];
  const direct = nonEmpty(entry);
  if (direct !== null) {
    return { text: direct, audioUrl: null };
  }
  if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
    return { text: null, audioUrl: null };
  }
  const record = entry as Record<string, unknown>;
  return {
    text: nonEmpty(record.text),
    audioUrl: nonEmpty(record.audio_url),
  };
}

export function readLocaleBlock(locale: LocaleCode, blockId: string): ContentBlock {
  if (locale === "ar") {
    return readContentBlock(arabicBlocks, blockId);
  }
  return readContentBlock(englishBlocks, blockId);
}

export function mockAudioUrl(blockId: string): string {
  return `/mock-audio/${encodeURIComponent(blockId)}`;
}

export function audioUrlForBlock(blockId: string, audioUrl: string | null): string {
  if (audioUrl !== null) {
    return audioUrl;
  }
  return mockAudioUrl(blockId);
}
