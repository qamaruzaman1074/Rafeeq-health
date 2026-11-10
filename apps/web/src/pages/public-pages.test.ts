import { readFileSync, statSync } from "node:fs";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { afterAll, describe, expect, it } from "vitest";
import { LiteracyProvider } from "@/app/literacy";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";
import enLanding from "@/i18n/locales/en/landing.json";

const banned = [
  "defective",
  "abnormal",
  "mutant",
  "bad genes",
  "risky couple",
  "incompatible",
  "genetic disease couple",
  "high-risk",
  "dangerous",
  "you must",
  "you should not marry",
];

function renderPage(node: ReactNode): string {
  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(
        MemoryRouter,
        null,
        createElement(NumeralProvider, null, createElement(LiteracyProvider, null, node)),
      ),
    ),
  );
}

describe("public pages", () => {
  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders landing, trust, and demo in English", async () => {
    await i18n.changeLanguage("en");
    const { Component: Landing } = await import("@/pages/landing-page");
    const { Component: Trust } = await import("@/pages/trust-page");
    const { Component: Demo } = await import("@/pages/demo-page");
    const landing = renderPage(createElement(Landing));
    const trust = renderPage(createElement(Trust));
    const demo = renderPage(createElement(Demo));

    expect(landing).toContain("RAFEEQ");
    expect(landing).toContain("Explore How It Works");
    expect(landing).toContain(
      "Understand your genetic health. Make informed decisions with confidence.",
    );
    expect(landing).toContain("/images/hero-cell-dna.webp");
    expect(trust).toContain("Your information. Your permission. Your choice.");
    expect(demo).toContain("Noor");
    expect(demo.match(/data-persona="/g)?.length).toBe(6);
    expect(demo).toContain("Enter as Noor &amp; Khalid</span>");
    expect(demo).not.toContain("Low-literacy voice-first user");
    expect(demo).not.toContain("Draft synthetic fixture");
  });

  it("stores landing images as local webp files", () => {
    const names = [
      "hero-cell-dna.webp",
      "counselling-couple-clinic.webp",
      "couple-professional-conversation.webp",
      "family-parents-baby.webp",
      "genetic-research.webp",
      "genetics-lab.webp",
      "counselling.webp",
    ] as const;
    for (const name of names) {
      const file = new URL(`../../public/images/${name}`, import.meta.url);
      expect(statSync(file).size, name).toBeGreaterThan(20_000);
    }
  });

  it("does not use banned terms on public pages", () => {
    const landing = readFileSync(
      new URL("../i18n/locales/en/landing.json", import.meta.url),
      "utf8",
    );
    const pub = readFileSync(new URL("../i18n/locales/en/public.json", import.meta.url), "utf8");
    const haystack = `${landing}\n${pub}`.toLowerCase();
    for (const term of banned) {
      expect(haystack.includes(term.toLowerCase()), term).toBe(false);
    }
    expect(enLanding.hero.title.length).toBeGreaterThan(0);
  });
});
