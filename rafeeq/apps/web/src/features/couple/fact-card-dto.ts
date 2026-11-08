import { z } from "zod";

/**
 * Shape returned by POST /explain/overlap. The web app does not calculate it.
 * OPEN_QUESTION: packages/contracts has no generated FactCard schema yet.
 */
export const outcomeProportionsSchema = z.object({
  affected: z.number(),
  carrier: z.number(),
  neither: z.number(),
});

export type OutcomeProportions = z.infer<typeof outcomeProportionsSchema>;

export const localizedBlockSchema = z.object({
  block_id: z.string(),
  locale: z.enum(["en", "ar"]),
  text: z.string().nullable(),
});

export type LocalizedBlock = z.infer<typeof localizedBlockSchema>;

export const factCardInputSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export type FactCardInput = z.infer<typeof factCardInputSchema>;

export const factCardSchema = z.object({
  proportions: outcomeProportionsSchema,
  sentences: z.array(localizedBlockSchema),
  formula: z.string(),
  inputs: z.array(factCardInputSchema),
  limits: z.array(z.string()),
  diagnosis_banner: z.array(localizedBlockSchema),
});

export type FactCardDTO = z.infer<typeof factCardSchema>;

export const explainOverlapSchema = z.object({
  fact_card: factCardSchema.nullable(),
});

export type ExplainOverlap = z.infer<typeof explainOverlapSchema>;
