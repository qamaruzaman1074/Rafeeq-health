import { z } from "zod";
import { REFERRAL_STATUSES, type ReferralStatus } from "@/features/care/steps";
import { TIERS, type Tier } from "@/features/clinic/tiers";
import { carrierSchema, type Carrier } from "@/features/result/types";

export const QUEUE_LANGUAGES = ["ar", "en"] as const;

export type QueueLanguage = (typeof QUEUE_LANGUAGES)[number];

export const QUEUE_LITERACY = ["standard", "simple", "voice"] as const;

export type QueueLiteracy = (typeof QUEUE_LITERACY)[number];

export const OVERLAP_SHARES = ["allowed", "declined", "missing", "empty"] as const;

export type OverlapShare = (typeof OVERLAP_SHARES)[number];

export type QueueRow = {
  id: string;
  tier: Tier | null;
  reason_codes: string[];
  due_by: string | null;
  language: QueueLanguage | null;
  literacy_mode: QueueLiteracy | null;
  comprehension_gaps: boolean | null;
  clinic_share: boolean;
  overlap_share: OverlapShare;
  status: ReferralStatus;
};

export type FormulaLine = {
  text: string;
  inputs: { name: string; value: string }[];
};

export type BriefNote = {
  block_id: string;
  text: string | null;
};

export type UserQuestion = {
  id: string;
  text: string | null;
};

export type TeachBackGap = {
  item_id: string;
  block_id: string;
};

export type CaseBrief = {
  id: string;
  status: ReferralStatus;
  tier: Tier | null;
  shared_genes: Carrier[];
  formulas: FormulaLine[];
  user_questions: UserQuestion[];
  teach_back_gaps: TeachBackGap[];
  preferences: {
    language: QueueLanguage | null;
    literacy_mode: QueueLiteracy | null;
  };
  cultural_notes: BriefNote;
  talking_points: BriefNote[];
};

const queueRowSchema = z.object({
  id: z.string().min(1),
  tier: z.enum(TIERS).nullable(),
  reason_codes: z.array(z.string()),
  due_by: z.string().nullable(),
  language: z.enum(QUEUE_LANGUAGES).nullable(),
  literacy_mode: z.enum(QUEUE_LITERACY).nullable(),
  comprehension_gaps: z.boolean().nullable(),
  clinic_share: z.boolean(),
  overlap_share: z.enum(OVERLAP_SHARES),
  status: z.enum(REFERRAL_STATUSES),
});

const formulaSchema = z.object({
  text: z.string(),
  inputs: z.array(z.object({ name: z.string(), value: z.string() })),
});

const noteSchema = z.object({
  block_id: z.string().min(1),
  text: z.string().nullable(),
});

const briefSchema = z.object({
  id: z.string().min(1),
  status: z.enum(REFERRAL_STATUSES),
  tier: z.enum(TIERS).nullable(),
  shared_genes: z.array(carrierSchema),
  formulas: z.array(formulaSchema),
  user_questions: z.array(z.object({ id: z.string(), text: z.string().nullable() })),
  teach_back_gaps: z.array(z.object({ item_id: z.string(), block_id: z.string() })),
  preferences: z.object({
    language: z.enum(QUEUE_LANGUAGES).nullable(),
    literacy_mode: z.enum(QUEUE_LITERACY).nullable(),
  }),
  cultural_notes: noteSchema,
  talking_points: z.array(noteSchema),
});

function asRecord(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }
  const record: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    record[key] = value;
  }
  return record;
}

function stringList(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }
  return value.filter((item) => typeof item === "string");
}

function geneRows(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }
  return value.map((item) => {
    const row = asRecord(item);
    if (row === null) {
      return item;
    }
    return {
      id: row.id,
      gene_symbol: row.gene_symbol,
      gene_block_id: row.gene_block_id,
      condition_name: row.condition_name,
      condition_locale: row.condition_locale,
      condition_block_id: row.condition_block_id,
    };
  });
}

function formulaRows(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }
  return value.map((item) => {
    const row = asRecord(item);
    if (row === null) {
      return item;
    }
    const inputs = Array.isArray(row.inputs)
      ? row.inputs.map((input) => {
          const pair = asRecord(input);
          if (pair === null) {
            return input;
          }
          return { name: pair.name, value: pair.value };
        })
      : row.inputs;
    return { text: row.text, inputs };
  });
}

function noteRow(value: unknown): unknown {
  const row = asRecord(value);
  if (row === null) {
    return value;
  }
  return { block_id: row.block_id, text: row.text };
}

function questionRows(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }
  return value.map((item) => {
    const row = asRecord(item);
    if (row === null) {
      return item;
    }
    return { id: row.id, text: row.text };
  });
}

function gapRows(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }
  return value.map((item) => {
    const row = asRecord(item);
    if (row === null) {
      return item;
    }
    return { item_id: row.item_id, block_id: row.block_id };
  });
}

function preferenceRow(value: unknown): unknown {
  const row = asRecord(value);
  if (row === null) {
    return value;
  }
  return { language: row.language, literacy_mode: row.literacy_mode };
}

/**
 * Keeps the queue columns from the planning doc and the referral enum.
 * Any other field, including a raw result, is dropped.
 */
export function queueList(raw: unknown): QueueRow[] {
  if (!Array.isArray(raw)) {
    throw new Error("Queue response was not a list");
  }
  return raw.map((item) => {
    const row = asRecord(item);
    if (row === null) {
      throw new Error("Queue row was not an object");
    }
    return queueRowSchema.parse({
      id: row.id,
      tier: row.tier,
      reason_codes: stringList(row.reason_codes),
      due_by: row.due_by,
      language: row.language,
      literacy_mode: row.literacy_mode,
      comprehension_gaps: row.comprehension_gaps,
      clinic_share: row.clinic_share,
      overlap_share: row.overlap_share,
      status: row.status,
    });
  });
}

/**
 * Keeps the brief fields named for the counsellor: shared genes, formulas
 * supplied by the payload, questions, teach-back gaps, preferences, notes,
 * and talking-point block ids. Raw results and any other key are dropped.
 */
export function caseBrief(raw: unknown): CaseBrief {
  const body = asRecord(raw);
  if (body === null) {
    throw new Error("Brief response was not an object");
  }
  const parsed = briefSchema.parse({
    id: body.id,
    status: body.status,
    tier: body.tier,
    shared_genes: geneRows(body.shared_genes),
    formulas: formulaRows(body.formulas),
    user_questions: questionRows(body.user_questions),
    teach_back_gaps: gapRows(body.teach_back_gaps),
    preferences: preferenceRow(body.preferences),
    cultural_notes: noteRow(body.cultural_notes),
    talking_points: Array.isArray(body.talking_points)
      ? body.talking_points.map((item) => noteRow(item))
      : body.talking_points,
  });
  return parsed;
}
