import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeAll, describe, expect, it } from "vitest";
import { LiteracyProvider } from "@/app/literacy";
import { ResultCard } from "@/features/result/result-card";
import { ResultView } from "@/features/result/result-view";
import type { Carrier } from "@/features/result/types";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";

function renderTree(node: ReactNode): string {
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

const carrier: Carrier = {
  id: "P1-shared",
  gene_symbol: null,
  gene_block_id: "glossary.carrier",
  condition_name: "hearing-loss example",
  condition_locale: "en",
  condition_block_id: "result.condition.illustrative",
};

describe("result view", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("teaches carrier, couple chance, and diagnosis as separate ideas", () => {
    const html = renderTree(createElement(ResultView));
    expect(html).toContain(">Your result<");
    expect(html).toContain("demo example");
    expect(html).toContain('data-result-section="meanings"');
    expect(html).toContain(">Carrier status<");
    expect(html).toContain(">Couple-level reproductive chance<");
    expect(html).toContain(">A confirmed diagnosis<");
    expect(html).toContain('data-result-section="inheritance-example"');
    expect(html).toContain("a 25% chance of being affected");
    expect(html).toContain("a 50% chance of being a carrier");
    expect(html).toContain("a 25% chance of inheriting neither familial variant");
    expect(html).toContain("Each pregnancy is independent of the last.");
    expect(html).toContain("does not apply automatically");
    expect(html).toContain('data-example-cell="affected"');
    expect(html).toContain('data-example-cell="carrier"');
    expect(html).toContain('data-example-cell="neither"');
    expect(html).toContain("Open Learn");
    expect(html).toContain("Open Care");
    expect(html.toLowerCase()).not.toContain("you must");
    expect(html).not.toContain('data-result-section="stored-example"');
  });

  it("shows draft educational copy on a carrier card without internal markers", () => {
    const html = renderTree(createElement(ResultCard, { carrier }));
    expect(html).toContain("hearing-loss example");
    expect(html).not.toContain("OPEN_QUESTION");
    expect(html).toContain("glossary.carrier");
    expect(html).toContain("This carrier note is not a confirmed diagnosis.");
    expect(html).toContain("Who can see this");
  });
});
