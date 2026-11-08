import { z } from "zod";

export const contentBlockSchema = z.object({
  block_id: z.string(),
  text: z.string().nullable(),
});

export type ContentBlock = z.infer<typeof contentBlockSchema>;

export const carrierSchema = z.object({
  id: z.string(),
  gene_symbol: z.string().nullable(),
  gene_block_id: z.string(),
  condition_name: z.string().nullable(),
  condition_locale: z.enum(["en", "ar"]).nullable(),
  condition_block_id: z.string(),
});

export type Carrier = z.infer<typeof carrierSchema>;

export const ownResultSchema = z.object({
  banner: contentBlockSchema,
  carriers: z.array(carrierSchema),
});

export type OwnResult = z.infer<typeof ownResultSchema>;

export const overlapResultSchema = z.object({
  hidden: z.boolean(),
  reason: z.enum(["sharing_declined", "consent_missing"]).nullable(),
  genes: z.array(carrierSchema),
});

export type OverlapResult = z.infer<typeof overlapResultSchema>;
