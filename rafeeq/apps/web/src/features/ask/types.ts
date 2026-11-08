import { z } from "zod";

/**
 * OPEN_QUESTION: MASTER Section 6 names POST `/ask` and the envelope only.
 * This body is the mock contract for the ask screen.
 * `text` is approved copy from the API. The screen does not write it.
 */

export const askPayloadSchema = z.object({
  route: z.enum(["human", "content"]),
  reason: z.string().nullable(),
  source_ids: z.array(z.string()),
  text: z.string().nullable(),
});

export type AskPayload = z.infer<typeof askPayloadSchema>;

export type AskRequest = {
  question: string;
  locale: "en" | "ar";
};
