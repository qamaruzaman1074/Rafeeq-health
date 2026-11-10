import { z } from "zod";

/**
 * OPEN_QUESTION: MASTER Section 6 names GET `/comprehension/items` and
 * POST `/comprehension/answer` and does not define their bodies.
 * These shapes are the mock contract for the teach-back screen.
 * `correct_option_id` is part of the payload. The screen does not
 * substitute a frontend choice for it.
 */

export const contentStatusSchema = z.enum(["draft", "clinician_reviewed"]);

export const promptSchema = z.object({
  block_id: z.string(),
  locale: z.enum(["en", "ar"]),
  text: z.string().nullable(),
  status: contentStatusSchema,
});

export const checkOptionSchema = z.object({
  id: z.string().min(1),
  picture: z.string().min(1),
});

export const checkItemSchema = z.object({
  id: z.string().min(1),
  status: contentStatusSchema,
  prompt: promptSchema,
  options: z.array(checkOptionSchema).min(1),
  correct_option_id: z.string().min(1),
});

export const checkSetSchema = z.object({
  status: contentStatusSchema,
  items: z.array(checkItemSchema),
});

export const feedbackBlockSchema = z.object({
  block_id: z.string(),
  text: z.string().nullable(),
  status: contentStatusSchema,
});

export const answerResultSchema = z.object({
  item_id: z.string(),
  selected_option_id: z.string(),
  correct_option_id: z.string(),
  matched: z.boolean(),
  attempt: z.number().int(),
  latency_ms: z.number().int(),
  feedback: feedbackBlockSchema,
  next_item_id: z.string().nullable(),
});

export type CheckOption = z.infer<typeof checkOptionSchema>;
export type CheckItem = z.infer<typeof checkItemSchema>;
export type CheckSet = z.infer<typeof checkSetSchema>;
export type FeedbackBlock = z.infer<typeof feedbackBlockSchema>;
export type AnswerResult = z.infer<typeof answerResultSchema>;

/** Fields the screen is allowed to render. The matching option stays on the payload. */
export type CheckItemView = Omit<CheckItem, "correct_option_id">;

export type AnswerRequest = {
  item_id: string;
  option_id: string;
  latency_ms: number;
  attempt: number;
  locale: "en" | "ar";
  literacy_mode: "standard" | "simple" | "voice";
};
