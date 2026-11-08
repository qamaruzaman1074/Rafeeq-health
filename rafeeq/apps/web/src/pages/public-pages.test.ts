import { readFileSync, statSync } from "node:fs";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { afterAll, describe, expect, it } from "vitest";
import { LiteracyProvider } from "@/app/literacy";
import i18n from "@/i18n";
import arLanding from "@/i18n/locales/ar/landing.json";
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
  "accuracy",
  "accurate",
  "outcome",
];

function renderPage(node: ReactNode): string {
  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(MemoryRouter, null, createElement(LiteracyProvider, null, node)),
    ),
  );
}

function leaves(value: unknown, prefix = ""): Map<string, string> {
  const found = new Map<string, string>();
  if (typeof value === "string") {
    if (prefix.length > 0) {
      found.set(prefix, value);
    }
    return found;
  }
  if (typeof value !== "object" || value === null) {
    return found;
  }
  for (const [key, child] of Object.entries(value)) {
    const next = prefix.length > 0 ? `${prefix}.${key}` : key;
    for (const [leaf, text] of leaves(child, next)) {
      found.set(leaf, text);
    }
  }
  return found;
}

const chromeKeys = [
  "page.title",
  "page.continueGuest",
  "page.signIn",
  "nav.label",
  "nav.howItWorks",
  "nav.approach",
  "nav.privacy",
  "hero.title",
  "hero.body",
  "hero.trust",
  "hero.howItWorks",
  "problem.heading",
  "approach.heading",
  "science.heading",
  "privacySection.heading",
  "cta.heading",
  "cta.action",
  "footer.tagline",
  "pillars.plain.title",
  "pillars.sharing.title",
  "pillars.humans.title",
  "steps.heading",
  "steps.one.title",
  "steps.two.title",
  "steps.three.title",
  "steps.four.title",
  "trust.title",
  "trust.privacy.heading",
  "trust.ai.heading",
  "trust.review.heading",
  "demo.title",
  "demo.intro",
  "demo.willSee",
  "demo.enter",
  "demo.reset",
  "demo.draft",
  "guide.open",
  "guide.title",
  "guide.intro",
  "guide.tryHeading",
  "guide.step1",
  "guide.step2",
  "guide.step3",
  "guide.step4",
  "guide.personasHeading",
  "guide.story",
];

const unapprovedArabic = [
  "page.value",
  "pillars.plain.body",
  "pillars.sharing.body",
  "pillars.humans.body",
  "steps.one.body",
  "steps.two.body",
  "steps.three.body",
  "steps.four.body",
  "trust.synthetic",
  "trust.frequencies",
  "trust.privacy.own",
  "trust.privacy.overlap",
  "trust.privacy.clinic",
  "trust.privacy.counsellor",
  "trust.privacy.analyst",
  "trust.privacy.audit",
  "trust.privacy.revoke",
  "trust.privacy.guest",
  "trust.privacy.minimise",
  "trust.ai.role",
  "trust.ai.inputs",
  "trust.ai.limits",
  "trust.ai.human",
  "trust.ai.routes",
  "trust.review.status",
  "trust.review.draft",
  "trust.review.arabic",
  "legal.title",
];

describe("public pages", () => {
  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("keeps short chrome in both languages and marks unapproved Arabic", async () => {
    const english = leaves(enLanding);
    const arabic = leaves(arLanding);
    for (const key of chromeKeys) {
      expect(english.get(key)?.length, key).toBeGreaterThan(0);
      expect(arabic.get(key), key).not.toBe("TODO_AR");
      expect(arabic.get(key)?.includes("TODO_AR"), key).toBe(false);
    }
    for (const key of unapprovedArabic) {
      expect(arabic.get(key), key).toBe("TODO_AR");
      expect(english.get(key)?.length, key).toBeGreaterThan(0);
    }

    await i18n.changeLanguage("en");
    const { Component: Landing } = await import("@/pages/landing-page");
    const { Component: Trust } = await import("@/pages/trust-page");
    const { Component: Demo } = await import("@/pages/demo-page");
    const landing = renderPage(createElement(Landing));
    const trust = renderPage(createElement(Trust));
    const demo = renderPage(createElement(Demo));

    expect(landing).toContain("Continue as Guest");
    expect(landing).toContain("Sign in");
    expect(landing).toMatch(/href="\/demo"[^>]*>Continue as Guest</);
    expect(landing).toMatch(/href="\/demo"[^>]*>Sign in</);
    expect(landing).toContain("Evaluation guide");
    expect(landing).toContain("Plain language");
    expect(landing).toContain("You control sharing");
    expect(landing).toContain("Humans for the big questions");
    expect(landing).toContain("How it works");
    expect(landing).toContain("Understand your genes. Empower your future.");
    expect(landing).toContain("Explore");
    expect(landing).toContain("/images/genetic-research.webp");
    expect(landing).toContain("/images/genetics-lab.webp");
    expect(landing).toContain("/images/counselling.webp");
    expect(trust).toContain("Privacy");
    expect(trust).toContain("How AI is used and limited");
    expect(trust).toContain("Who reviews content");
    expect(demo).toContain("Noor");
    expect(demo).toContain("Low-literacy voice-first user");
    expect(demo).toContain("What you will see");
    expect(demo).toContain("Reset");
    expect(demo).toContain("Draft synthetic fixture");
    expect(demo.match(/Enter as /g)?.length).toBe(7);
  });

  it("stores landing images as local webp files", () => {
    const names = ["genetic-research.webp", "genetics-lab.webp", "counselling.webp"] as const;
    for (const name of names) {
      const file = new URL(`../../public/images/${name}`, import.meta.url);
      expect(statSync(file).size, name).toBeGreaterThan(20_000);
    }
  });

  it("does not use banned terms or accuracy claims in the new copy", () => {
    const files = [
      new URL("../i18n/locales/en/landing.json", import.meta.url),
      new URL("../i18n/locales/ar/landing.json", import.meta.url),
      new URL("../i18n/locales/en/errors.json", import.meta.url),
      new URL("../i18n/locales/ar/errors.json", import.meta.url),
      new URL("../../../../content/personas.json", import.meta.url),
    ];
    const corpus = files.map((file) => readFileSync(file, "utf8").toLowerCase()).join("\n");
    for (const term of banned) {
      expect(corpus.includes(term), term).toBe(false);
    }
  });
});
