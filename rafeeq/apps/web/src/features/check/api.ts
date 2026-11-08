import type { LiteracyMode } from "@/app/literacy";
import type { LocaleCode } from "@/features/learn/blocks";
import {
  answerResultSchema,
  checkSetSchema,
  type AnswerRequest,
  type AnswerResult,
  type CheckSet,
} from "@/features/check/types";
import { apiRequest } from "@/lib/api";

export function buildAnswerRequest(input: {
  itemId: string;
  optionId: string;
  startedAtMs: number;
  nowMs: number;
  attempt: number;
  locale: LocaleCode;
  literacyMode: LiteracyMode;
}): AnswerRequest {
  const elapsed = input.nowMs - input.startedAtMs;
  const latency = Number.isFinite(elapsed) ? Math.max(0, Math.round(elapsed)) : 0;
  return {
    item_id: input.itemId,
    option_id: input.optionId,
    latency_ms: latency,
    attempt: input.attempt,
    locale: input.locale,
    literacy_mode: input.literacyMode,
  };
}

export async function fetchCheckItems(locale: LocaleCode): Promise<CheckSet | null> {
  const result = await apiRequest<unknown>(`/api/v1/comprehension/items?locale=${locale}`);
  if (result.data === null) {
    return null;
  }
  return checkSetSchema.parse(result.data);
}

export async function submitAnswer(body: AnswerRequest): Promise<AnswerResult> {
  const result = await apiRequest<unknown>("/api/v1/comprehension/answer", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return answerResultSchema.parse(result.data);
}
