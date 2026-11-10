import faqFile from "../../../../content/faq.json";
import { readSuggestedQuestions } from "@/features/ask/faq";
import { QUESTION_LIMIT } from "@/features/ask/limit";
import type { AskPayload } from "@/features/ask/types";
import { readLocaleBlock, type LocaleCode } from "@/features/learn/blocks";
import { matchHardRoute } from "@/mocks/ask-routes";

/**
 * OPEN_QUESTION: Section 6 does not define the POST `/ask` body.
 * Hard routes return `route: "human"` and no answer text.
 * A content answer is returned only when faq.json names source ids for that question.
 * The file is empty, so other questions have no source ids and no text.
 */

const faq: unknown = faqFile;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseAskBody(
  raw: unknown,
): { question: string; locale: LocaleCode } | "missing" | "too_long" {
  if (!isRecord(raw) || typeof raw.question !== "string") {
    return "missing";
  }
  if (raw.question.length > QUESTION_LIMIT) {
    return "too_long";
  }
  const question = raw.question.trim();
  if (question.length === 0) {
    return "missing";
  }
  const locale: LocaleCode = raw.locale === "ar" ? "ar" : "en";
  return { question, locale };
}

export function answerFromFaq(
  input: { question: string; locale: LocaleCode },
  file: unknown,
): AskPayload {
  const reason = matchHardRoute(input.question);
  if (reason !== null) {
    return { route: "human", reason, source_ids: [], text: null };
  }
  const normalized = input.question.trim().toLowerCase();
  const match = readSuggestedQuestions(file).find(
    (item) => item.question.trim().toLowerCase() === normalized && item.sourceIds.length > 0,
  );
  if (match !== undefined) {
    const firstId = match.sourceIds[0];
    const text = firstId === undefined ? null : readLocaleBlock(input.locale, firstId).text;
    return {
      route: "content",
      reason: null,
      source_ids: [...match.sourceIds],
      text,
    };
  }
  return { route: "content", reason: null, source_ids: [], text: null };
}

export function answerAsk(input: { question: string; locale: LocaleCode }): AskPayload {
  return answerFromFaq(input, faq);
}
