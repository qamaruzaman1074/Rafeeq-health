import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { afterEach, describe, expect, it } from "vitest";
import { FactCard } from "@/features/couple/fact-card";
import type { FactCardDTO } from "@/features/couple/fact-card-dto";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";

const card: FactCardDTO = {
  proportions: { affected: 2, carrier: 3, neither: 1 },
  sentences: [
    { block_id: "block-en", locale: "en", text: "Plain block" },
    { block_id: "block-ar", locale: "ar", text: null },
  ],
  formula: "formula text",
  inputs: [{ name: "inheritance", value: "AR" }],
  limits: ["X-linked"],
  diagnosis_banner: [
    { block_id: "banner-en", locale: "en", text: "Boundary line" },
    { block_id: "banner-ar", locale: "ar", text: null },
  ],
};

function renderCard(): string {
  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(NumeralProvider, null, createElement(FactCard, { card })),
    ),
  );
}

function outcomeCount(html: string, outcome: string): number {
  return html.split(`data-outcome="${outcome}"`).length - 1;
}

describe("FactCard", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the supplied counts and text without a kernel sentence", async () => {
    await i18n.changeLanguage("en");
    const html = renderCard();
    expect(outcomeCount(html, "affected")).toBe(2);
    expect(outcomeCount(html, "carrier")).toBe(3);
    expect(outcomeCount(html, "neither")).toBe(1);
    expect(html).toContain("Plain block");
    expect(html).toContain("Boundary line");
    expect(html).toContain("X-linked");
    expect(html).toContain("How this was calculated");
    expect(html).toContain("What this does not tell us");
    expect(html).not.toContain("pregnancy");
  });

  it("shows the open question when the locale block has no text", async () => {
    await i18n.changeLanguage("en");
    const sparse: FactCardDTO = {
      ...card,
      sentences: [{ block_id: "block-en", locale: "en", text: null }],
      diagnosis_banner: [{ block_id: "banner-en", locale: "en", text: null }],
    };
    const html = renderToStaticMarkup(
      createElement(
        I18nextProvider,
        { i18n },
        createElement(NumeralProvider, null, createElement(FactCard, { card: sparse })),
      ),
    );
    expect(html).toContain("Not available yet");
    expect(html).not.toContain("Plain block");
    expect(html).not.toContain("Boundary line");
  });
});
