import { z } from "zod";
import {
  PATHWAY_STEP_IDS,
  REFERRAL_STATUSES,
  type PathwayStepId,
  type ReferralStatus,
} from "@/features/care/steps";

export type PathwayStep = {
  id: PathwayStepId;
  reached: boolean;
};

/**
 * Couple view of GET `/pathway`.
 * Only the current step, the step list, and a referral status are kept.
 * Any other field on the payload is ignored.
 */
export type CouplePathway = {
  current_step: PathwayStepId;
  steps: PathwayStep[];
  status: ReferralStatus | null;
};

export type ReferralAck = {
  id: string;
  status: ReferralStatus;
};

const stepSchema = z.object({
  id: z.enum(PATHWAY_STEP_IDS),
  reached: z.boolean(),
});

const pathwaySchema = z.object({
  current_step: z.enum(PATHWAY_STEP_IDS),
  steps: z.array(stepSchema),
  status: z.enum(REFERRAL_STATUSES).nullable(),
});

const referralSchema = z.object({
  id: z.string().min(1),
  status: z.enum(REFERRAL_STATUSES),
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

function stepRows(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }
  return value.map((item) => {
    const row = asRecord(item);
    if (row === null) {
      return item;
    }
    return { id: row.id, reached: row.reached };
  });
}

export function couplePathway(raw: unknown): CouplePathway {
  const body = asRecord(raw);
  if (body === null) {
    throw new Error("Pathway response was not an object");
  }
  const parsed = pathwaySchema.parse({
    current_step: body.current_step,
    steps: stepRows(body.steps),
    status: body.status,
  });
  const reached = new Map(parsed.steps.map((step) => [step.id, step.reached]));
  return {
    current_step: parsed.current_step,
    steps: PATHWAY_STEP_IDS.map((id) => ({
      id,
      reached: reached.get(id) ?? false,
    })),
    status: parsed.status,
  };
}

export function referralAck(raw: unknown): ReferralAck {
  const body = asRecord(raw);
  if (body === null) {
    throw new Error("Referral response was not an object");
  }
  const parsed = referralSchema.parse({
    id: body.id,
    status: body.status,
  });
  return {
    id: parsed.id,
    status: parsed.status,
  };
}
