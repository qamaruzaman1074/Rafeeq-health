import { z } from "zod";
import { apiRequest } from "@/lib/api";
import type { LocaleCode } from "@/features/learn/blocks";

const glossarySchema = z.object({
  term: z.string(),
  block_id: z.string(),
  locale: z.enum(["en", "ar"]),
  text: z.string().nullable(),
});

const ttsSchema = z.object({
  block_id: z.string(),
  locale: z.enum(["en", "ar"]),
  url: z.string().min(1),
  text: z.string().nullable(),
});

export type GlossaryEntry = z.infer<typeof glossarySchema>;

export type TtsResult = z.infer<typeof ttsSchema>;

export async function fetchGlossary(term: string, locale: LocaleCode): Promise<GlossaryEntry> {
  const result = await apiRequest<unknown>(
    `/api/v1/explain/glossary/${encodeURIComponent(term)}?locale=${locale}`,
  );
  return glossarySchema.parse(result.data);
}

export async function requestTts(blockId: string, locale: LocaleCode): Promise<TtsResult> {
  const result = await apiRequest<unknown>("/api/v1/tts", {
    method: "POST",
    body: JSON.stringify({ block_id: blockId, locale }),
  });
  return ttsSchema.parse(result.data);
}
