import type { Persona } from "@/features/personas";
import { readLocaleBlock, type LocaleCode } from "@/features/learn/blocks";

/**
 * OPEN_QUESTION: `/content` has no teach-back items, and MASTER Section 6
 * does not define the item or answer body. This fixture is draft.
 * The English prompt on the first item is the example sentence from website
 * planning Section 7. It is not a probability, and it is not shown for Arabic.
 * Other prompts are omitted: no approved item text exists, so `text` is null
 * and `block_id` is OPEN_QUESTION.
 * The example is attached only to P1 and P4, the Section 9 personas in which
 * both partners carry the same change. Whether other personas should see a
 * different item bank is not specified.
 * Feedback text is read from the content files. Those files have no block, so
 * the feedback id stays OPEN_QUESTION and `text` stays null.
 */

const FEEDBACK_CORRECT_ID = "check.feedback.correct";
const FEEDBACK_RETRY_ID = "check.feedback.retry";

const BOTH_CARRIER_PERSONAS = new Set(["P1", "P4"]);

type PictureName = "ring" | "bars" | "cluster";

type DraftOption = {
  id: string;
  picture: PictureName;
};

type DraftItem = {
  id: string;
  promptBlockId: string;
  options: readonly DraftOption[];
  correctOptionId: string;
};

function pictures(itemId: string): readonly DraftOption[] {
  return [
    { id: `${itemId}-ring`, picture: "ring" },
    { id: `${itemId}-bars`, picture: "bars" },
    { id: `${itemId}-cluster`, picture: "cluster" },
  ];
}

const DRAFT_ITEMS: readonly DraftItem[] = [
  {
    id: "tb-draft-shared-chance",
    promptBlockId: "check.teachback.shared-chance.prompt",
    options: pictures("tb-draft-shared-chance"),
    correctOptionId: "tb-draft-shared-chance-bars",
  },
  {
    id: "tb-draft-open-b",
    promptBlockId: "check.teachback.limits.prompt",
    options: pictures("tb-draft-open-b"),
    correctOptionId: "tb-draft-open-b-cluster",
  },
  {
    id: "tb-draft-open-c",
    promptBlockId: "check.teachback.consent.prompt",
    options: pictures("tb-draft-open-c"),
    correctOptionId: "tb-draft-open-c-ring",
  },
];

export type ParsedAnswer = {
  item_id: string;
  option_id: string;
  latency_ms: number;
  attempt: number;
  locale: LocaleCode;
  literacy_mode: "standard" | "simple" | "voice" | null;
};

export type ComprehensionEvent = {
  item_id: string;
  correct: boolean;
  attempt: number;
  latency_ms: number;
  locale: LocaleCode;
  literacy_mode: ParsedAnswer["literacy_mode"];
};

const events: ComprehensionEvent[] = [];

export function recordedComprehensionEvents(): readonly ComprehensionEvent[] {
  return events;
}

export function resetComprehensionEvents(): void {
  events.length = 0;
}

const LITERACY_MODES = new Set(["standard", "simple", "voice"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseAnswerBody(value: unknown): ParsedAnswer | null {
  if (!isRecord(value)) {
    return null;
  }
  const itemId = value.item_id;
  const optionId = value.option_id;
  const latency = value.latency_ms;
  const attempt = value.attempt;
  if (typeof itemId !== "string" || itemId.trim().length === 0) {
    return null;
  }
  if (typeof optionId !== "string" || optionId.trim().length === 0) {
    return null;
  }
  if (typeof latency !== "number" || !Number.isInteger(latency) || latency < 0) {
    return null;
  }
  if (typeof attempt !== "number" || !Number.isInteger(attempt) || attempt < 1) {
    return null;
  }
  const locale: LocaleCode = value.locale === "ar" ? "ar" : "en";
  const literacyValue = value.literacy_mode;
  const literacy =
    typeof literacyValue === "string" && LITERACY_MODES.has(literacyValue)
      ? (literacyValue as ParsedAnswer["literacy_mode"])
      : null;
  return {
    item_id: itemId,
    option_id: optionId,
    latency_ms: latency,
    attempt,
    locale,
    literacy_mode: literacy,
  };
}

function promptText(item: DraftItem, persona: Persona, locale: LocaleCode): string | null {
  if (locale !== "en" || !BOTH_CARRIER_PERSONAS.has(persona.id)) {
    return null;
  }
  return readLocaleBlock(locale, item.promptBlockId).text;
}

export function itemsForPersona(persona: Persona, locale: LocaleCode) {
  return {
    status: "draft" as const,
    items: DRAFT_ITEMS.map((item) => ({
      id: item.id,
      status: "draft" as const,
      prompt: {
        block_id: item.promptBlockId,
        locale,
        text: promptText(item, persona, locale),
        status: "draft" as const,
      },
      options: item.options.map((option) => ({ id: option.id, picture: option.picture })),
      correct_option_id: item.correctOptionId,
    })),
  };
}

export type AnswerFailure = "item" | "option";

export function answerFor(input: ParsedAnswer):
  | AnswerFailure
  | {
      item_id: string;
      selected_option_id: string;
      correct_option_id: string;
      matched: boolean;
      attempt: number;
      latency_ms: number;
      feedback: { block_id: string; text: string | null; status: "draft" };
      next_item_id: string | null;
    } {
  const index = DRAFT_ITEMS.findIndex((item) => item.id === input.item_id);
  const item = DRAFT_ITEMS[index];
  if (item === undefined) {
    return "item";
  }
  const option = item.options.find((entry) => entry.id === input.option_id);
  if (option === undefined) {
    return "option";
  }
  const matched = input.option_id === item.correctOptionId;
  const next = DRAFT_ITEMS[index + 1];
  const feedbackId = matched ? FEEDBACK_CORRECT_ID : FEEDBACK_RETRY_ID;
  const block = readLocaleBlock(input.locale, feedbackId);
  events.push({
    item_id: input.item_id,
    correct: matched,
    attempt: input.attempt,
    latency_ms: input.latency_ms,
    locale: input.locale,
    literacy_mode: input.literacy_mode,
  });
  return {
    item_id: input.item_id,
    selected_option_id: input.option_id,
    correct_option_id: item.correctOptionId,
    matched,
    attempt: input.attempt,
    latency_ms: input.latency_ms,
    feedback: {
      block_id: feedbackId,
      text: block.text,
      status: "draft",
    },
    next_item_id: matched ? (next === undefined ? null : next.id) : null,
  };
}
