import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeAll, describe, expect, it } from "vitest";
import faqFile from "../../../../../content/faq.json";
import { postAsk } from "@/features/ask/api";
import { AskView } from "@/features/ask/ask-view";
import { readSuggestedQuestions } from "@/features/ask/faq";
import { limitQuestion, QUESTION_LIMIT, questionTooLong } from "@/features/ask/limit";
import { AskExchange } from "@/features/ask/messages";
import { presentAsk } from "@/features/ask/present";
import type { AskPayload } from "@/features/ask/types";
import i18n from "@/i18n";
import { ApiRequestError, apiRequest } from "@/lib/api";
import { answerFromFaq } from "@/mocks/ask-fixture";
import { HARD_ROUTE_PROMPTS } from "@/mocks/ask-routes";

const SENTINEL = "SENTINEL_ANSWER_TEXT";

function renderNode(node: ReactNode): string {
  return renderToStaticMarkup(
    createElement(I18nextProvider, { i18n }, createElement(MemoryRouter, null, node)),
  );
}

function payload(overrides: Partial<AskPayload>): AskPayload {
  return {
    route: "content",
    reason: null,
    source_ids: [],
    text: SENTINEL,
    ...overrides,
  };
}

describe("ask", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("keeps suggested questions empty when faq.json has no entries", () => {
    expect(faqFile).toEqual({});
    expect(readSuggestedQuestions(faqFile)).toEqual([]);
    expect(readSuggestedQuestions({})).toEqual([]);
    expect(readSuggestedQuestions([])).toEqual([]);
    expect(
      readSuggestedQuestions([
        { id: "q1", question: "From the file", source_ids: ["block-1"] },
        { id: "blank" },
      ]),
    ).toEqual([{ id: "q1", question: "From the file", sourceIds: ["block-1"] }]);
  });

  it("enforces the question length", () => {
    const over = "a".repeat(QUESTION_LIMIT + 1);
    expect(questionTooLong(over)).toBe(true);
    expect(questionTooLong("a".repeat(QUESTION_LIMIT))).toBe(false);
    expect(limitQuestion(over)).toHaveLength(QUESTION_LIMIT);
    expect(limitQuestion("short")).toBe("short");
  });

  it("does not present answer text when source ids are missing", () => {
    expect(presentAsk(payload({ source_ids: [] }))).toEqual({ kind: "blocked" });
    expect(presentAsk(payload({ source_ids: [" ", ""] }))).toEqual({ kind: "blocked" });
    expect(presentAsk(payload({ route: "human", reason: "distress", text: SENTINEL }))).toEqual({
      kind: "handoff",
      reason: "distress",
    });
    expect(presentAsk(payload({ source_ids: ["block-1"], text: null }))).toEqual({
      kind: "answer",
      sourceIds: ["block-1"],
      text: null,
    });
  });

  it("does not render answer text without a source id", () => {
    const blocked = renderNode(
      createElement(AskExchange, { payload: payload({ source_ids: [] }) }),
    );
    expect(blocked).not.toContain(SENTINEL);
    expect(blocked).toContain("No approved answer is available.");
    expect(blocked).toContain('data-answer="blocked"');
    expect(blocked).not.toContain("Source: Approved content");

    const handoff = renderNode(
      createElement(AskExchange, {
        payload: payload({ route: "human", reason: "distress", source_ids: ["block-1"] }),
      }),
    );
    expect(handoff).not.toContain(SENTINEL);
    expect(handoff).not.toContain("Source: Approved content");
    expect(handoff).toContain('data-handoff="human"');
    expect(handoff).toContain("bg-lilac-100");
    expect(handoff).toContain("This question goes to a person");
    expect(handoff).toContain("Distress or self-harm");
    expect(handoff).toContain("Approved crisis-line text");
    expect(handoff).toContain("Not available yet");
    expect(handoff).toContain('href="/app/care"');
    expect(handoff).toContain("Book a counsellor");

    const sourced = renderNode(
      createElement(AskExchange, {
        payload: payload({ source_ids: ["B-017"], text: "Approved line" }),
      }),
    );
    expect(sourced).toContain("Approved line");
    expect(sourced).toContain("Source: Approved content #B-017");
    expect(sourced).toContain("Talk to a person");
    expect(sourced).toContain('href="/app/care"');

    const missingText = renderNode(
      createElement(AskExchange, {
        payload: payload({ source_ids: ["B-017"], text: null }),
      }),
    );
    expect(missingText).not.toContain(SENTINEL);
    expect(missingText).toContain("Not available yet");
    expect(missingText).toContain("Source: Approved content #B-017");
  });

  it("shows the boundary notice and no suggested questions", () => {
    const html = renderNode(createElement(AskView));
    expect(html).toContain("Ask a question");
    expect(html).toContain('data-boundary="visible"');
    expect(html).toContain(
      "This assistant only shows approved content. A hard question goes to a person.",
    );
    expect(html).toContain(`maxLength="${QUESTION_LIMIT}"`);
    expect(html).toContain('data-suggested="0"');
    expect(html).not.toContain("From the file");
  });

  it("returns a human route for hard questions and no answer text otherwise", async () => {
    for (const prompt of HARD_ROUTE_PROMPTS) {
      const result = await postAsk({ question: prompt.question, locale: "en" });
      expect(result.route, prompt.reason).toBe("human");
      expect(result.reason, prompt.reason).toBe(prompt.reason);
      expect(result.text, prompt.reason).toBeNull();
      expect(result.source_ids, prompt.reason).toEqual([]);
      expect(JSON.stringify(result), prompt.reason).not.toContain(SENTINEL);
    }

    const ordinary = await postAsk({ question: "What does this page show", locale: "en" });
    expect(ordinary).toEqual({
      route: "content",
      reason: null,
      source_ids: [],
      text: null,
    });

    const fromFile = answerFromFaq({ question: "From the file", locale: "en" }, [
      { id: "q1", question: "From the file", source_ids: ["block-1"] },
    ]);
    expect(fromFile.route).toBe("content");
    expect(fromFile.source_ids).toEqual(["block-1"]);
    expect(fromFile.text).toBeNull();

    const unsourced = answerFromFaq({ question: "From the file", locale: "en" }, [
      { id: "q1", question: "From the file" },
    ]);
    expect(unsourced.text).toBeNull();
    expect(unsourced.source_ids).toEqual([]);

    await expect(
      apiRequest("/api/v1/ask", {
        method: "POST",
        body: JSON.stringify({ question: "a".repeat(QUESTION_LIMIT + 1) }),
      }),
    ).rejects.toMatchObject({ messageKey: "questionTooLong" });
    await expect(
      apiRequest("/api/v1/ask", { method: "POST", body: JSON.stringify({}) }),
    ).rejects.toBeInstanceOf(ApiRequestError);
    await expect(apiRequest("/api/v1/ask", { method: "POST" })).rejects.toMatchObject({
      messageKey: "missingQuestion",
    });
  });
});
