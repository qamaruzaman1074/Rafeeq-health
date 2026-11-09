import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { LiteracyProvider } from "@/app/literacy";
import { CheckScreen } from "@/features/check/check-screen";
import { Component as HomePage } from "@/pages/app-home-page";
import { buildAnswerRequest, fetchCheckItems, submitAnswer } from "@/features/check/api";
import { applyAnswer, initialFlow, skipForNow } from "@/features/check/flow";
import { PathwayProgress } from "@/features/check/pathway";
import {
  isCheckComplete,
  markCheckComplete,
  recordCheckOutcome,
  resetCheckProgress,
} from "@/features/check/progress";
import type { CheckItemView, FeedbackBlock } from "@/features/check/types";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";
import { ApiRequestError, apiRequest } from "@/lib/api";
import {
  recordedComprehensionEvents,
  resetComprehensionEvents,
} from "@/mocks/comprehension-fixture";
import { resetActivePersona } from "@/mocks/persona-state";

function renderNode(node: ReactNode): string {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(
        QueryClientProvider,
        { client },
        createElement(
          NumeralProvider,
          null,
          createElement(MemoryRouter, null, createElement(LiteracyProvider, null, node)),
        ),
      ),
    ),
  );
}

function filesUnder(directory: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory)) {
    const full = path.join(directory, entry);
    if (statSync(full).isDirectory()) {
      found.push(...filesUnder(full));
      continue;
    }
    found.push(full);
  }
  return found;
}

function featureSource(): string {
  const root = fileURLToPath(new URL(".", import.meta.url));
  return filesUnder(root)
    .filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"))
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
}

async function enter(personaId: string): Promise<void> {
  resetActivePersona();
  await apiRequest("/api/v1/auth/guest", {
    method: "POST",
    body: JSON.stringify({ persona_id: personaId }),
  });
}

describe("teach-back check", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  beforeEach(() => {
    resetCheckProgress();
    resetComprehensionEvents();
    resetActivePersona();
  });

  it("returns draft items for the current persona and no set before a session", async () => {
    expect(await fetchCheckItems("en")).toBeNull();

    await enter("P1");
    const english = await fetchCheckItems("en");
    expect(english).not.toBeNull();
    if (english === null) {
      return;
    }
    expect(english.status).toBe("draft");
    expect(english.items.length).toBeGreaterThan(1);
    expect(english.items[0]?.prompt).toMatchObject({
      status: "draft",
      block_id: "OPEN_QUESTION",
      locale: "en",
    });
    expect(english.items[0]?.prompt.text).toContain("In your own words");
    expect(english.items[0]?.correct_option_id.length).toBeGreaterThan(0);
    for (const item of english.items) {
      expect(featureSource()).not.toContain(item.correct_option_id);
    }

    const arabic = await fetchCheckItems("ar");
    expect(arabic).not.toBeNull();
    expect(arabic?.items.every((item) => item.prompt.text === null)).toBe(true);

    await enter("P2");
    const other = await fetchCheckItems("en");
    expect(other?.items.every((item) => item.prompt.text === null)).toBe(true);
  });

  it("posts latency_ms and attempt and returns the matching option from the payload", async () => {
    await enter("P1");
    const set = await fetchCheckItems("en");
    const item = set?.items[0];
    expect(item).toBeDefined();
    if (item === undefined || set === null) {
      return;
    }
    const other = item.options.find((option) => option.id !== item.correct_option_id);
    expect(other).toBeDefined();
    if (other === undefined) {
      return;
    }

    const missed = buildAnswerRequest({
      itemId: item.id,
      optionId: other.id,
      startedAtMs: 0,
      nowMs: 840,
      attempt: 1,
      locale: "en",
      literacyMode: "standard",
    });
    expect(missed.latency_ms).toBe(840);
    expect(missed.attempt).toBe(1);
    const first = await submitAnswer(missed);
    expect(first.matched).toBe(false);
    expect(first.latency_ms).toBe(840);
    expect(first.attempt).toBe(1);
    expect(first.correct_option_id).toBe(item.correct_option_id);
    expect(first.feedback).toEqual({
      block_id: "OPEN_QUESTION",
      text: null,
      status: "draft",
    });
    expect(first.next_item_id).toBeNull();
    expect(recordedComprehensionEvents()[0]).toMatchObject({
      item_id: item.id,
      attempt: 1,
      latency_ms: 840,
      correct: false,
    });

    const matched = await submitAnswer(
      buildAnswerRequest({
        itemId: item.id,
        optionId: item.correct_option_id,
        startedAtMs: 0,
        nowMs: 900,
        attempt: 2,
        locale: "en",
        literacyMode: "voice",
      }),
    );
    expect(matched.matched).toBe(true);
    expect(matched.attempt).toBe(2);
    expect(matched.latency_ms).toBe(900);
    expect(matched.next_item_id).toBe(set.items[1]?.id ?? null);

    await expect(
      apiRequest("/api/v1/comprehension/answer", {
        method: "POST",
        body: JSON.stringify({ item_id: item.id, option_id: other.id }),
      }),
    ).rejects.toMatchObject({ name: "ApiRequestError", messageKey: "missingAnswer" });
    await expect(
      apiRequest("/api/v1/comprehension/answer", {
        method: "POST",
        body: JSON.stringify({
          item_id: "missing-item",
          option_id: other.id,
          latency_ms: 1,
          attempt: 1,
        }),
      }),
    ).rejects.toBeInstanceOf(ApiRequestError);
  });

  it("shows one item, pictorial options, progress dots, and skip", async () => {
    await enter("P1");
    const set = await fetchCheckItems("en");
    const first = set?.items[0];
    const second = set?.items[1];
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    if (first === undefined || second === undefined || set === null) {
      return;
    }
    const view: CheckItemView = {
      id: first.id,
      status: first.status,
      prompt: first.prompt,
      options: first.options,
    };
    const html = renderNode(
      createElement(CheckScreen, {
        item: view,
        itemCount: set.items.length,
        index: 0,
        finished: false,
        showFeedback: false,
        feedback: null,
        pending: false,
        saveError: false,
        onChoose: () => undefined,
        onSkip: () => undefined,
      }),
    );
    expect(html.match(/data-item-id="/g)).toHaveLength(1);
    expect(html).toContain(`data-item-id="${first.id}"`);
    expect(html).not.toContain(second.id);
    expect(html).toContain("In your own words");
    expect(html).toContain(">Skip for now<");
    expect(html.match(/data-progress-dot="/g)).toHaveLength(set.items.length);
    expect(html).toContain('data-progress-dot="current"');
    expect(html).toContain('data-picture="ring"');
    expect(html).toContain('data-picture="bars"');
    expect(html).toContain('data-picture="cluster"');
    expect(html.toLowerCase()).not.toContain("wrong");
    expect(html.toLowerCase()).not.toContain("incorrect");

    const feedback: FeedbackBlock = { block_id: "OPEN_QUESTION", text: null, status: "draft" };
    const explained = renderNode(
      createElement(CheckScreen, {
        item: view,
        itemCount: set.items.length,
        index: 0,
        finished: false,
        showFeedback: true,
        feedback,
        pending: false,
        saveError: false,
        onChoose: () => undefined,
        onSkip: () => undefined,
      }),
    );
    expect(explained).toContain("Here is another way to look at this.");
    expect(explained).toContain("OPEN_QUESTION");
    expect(explained.toLowerCase()).not.toContain("wrong");

    const laterView: CheckItemView = {
      id: second.id,
      status: second.status,
      prompt: second.prompt,
      options: second.options,
    };
    const later = renderNode(
      createElement(CheckScreen, {
        item: laterView,
        itemCount: set.items.length,
        index: 1,
        finished: false,
        showFeedback: false,
        feedback: null,
        pending: false,
        saveError: false,
        onChoose: () => undefined,
        onSkip: () => undefined,
      }),
    );
    expect(later.match(/data-item-id="/g)).toHaveLength(1);
    expect(later).toContain(`data-item-id="${second.id}"`);
    expect(later).not.toContain("In your own words");
  });

  it("records completion for the couple home when the set is finished or skipped", () => {
    let flow = initialFlow();
    flow = applyAnswer(flow, 3, { matched: false, nextIndex: null });
    expect(flow).toEqual({ index: 0, attempt: 2, finished: false, showFeedback: true });
    flow = skipForNow(flow, 3);
    expect(flow.index).toBe(1);
    expect(flow.finished).toBe(false);
    flow = skipForNow(flow, 3);
    flow = skipForNow(flow, 3);
    expect(flow.finished).toBe(true);
    recordCheckOutcome(flow);
    expect(isCheckComplete()).toBe(true);

    const open = renderNode(createElement(PathwayProgress));
    resetCheckProgress();
    const before = renderNode(createElement(PathwayProgress));
    const resultAt = before.indexOf(">Result<");
    const understandAt = before.indexOf(">Understand<");
    const checkAt = before.indexOf(">Check<");
    const shareAt = before.indexOf(">Decide who sees what<");
    const counsellingAt = before.indexOf(">Counselling<");
    const nextAt = before.indexOf(">Next<");
    expect(resultAt).toBeGreaterThan(-1);
    expect(resultAt).toBeLessThan(understandAt);
    expect(understandAt).toBeLessThan(checkAt);
    expect(checkAt).toBeLessThan(shareAt);
    expect(shareAt).toBeLessThan(counsellingAt);
    expect(counsellingAt).toBeLessThan(nextAt);
    expect(before).toContain('data-step="check"');
    expect(before).toContain('data-complete="false"');
    expect(before).not.toContain(">Complete<");

    markCheckComplete();
    const after = renderNode(createElement(PathwayProgress));
    const home = renderNode(createElement(HomePage));
    expect(after).toContain('data-complete="true"');
    expect(after).toContain(">Complete<");
    expect(open).toContain('data-complete="true"');
    expect(home).toContain(">Overview<");
    expect(home).toContain('data-step="check"');
    expect(home).toContain('data-complete="true"');
    expect(home).toContain(">Complete<");
  });
});
