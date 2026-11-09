import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeAll, describe, expect, it } from "vitest";
import { LiteracyProvider } from "@/app/literacy";
import { productRoutes } from "@/app/route-table";
import { ThemeProvider } from "@/app/theme";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";

const titles: Record<string, string> = {
  "/": "Understand your genetic health. Make informed decisions with confidence.",
  "/about": "Making genetic information easier to understand, while keeping people in control.",
  "/how-it-works": "From screening information to informed, supported decisions.",
  "/understanding-genetic-risk": "Understanding genetic risk, clearly and without judgement.",
  "/inherited-conditions": "Inherited conditions, explained in plain language.",
  "/genetic-counselling": "You do not have to interpret complex genetic information alone.",
  "/contact": "Questions about RAFEEQ?",
  "/faq": "Frequently asked questions",
  "/privacy-policy": "Your information deserves respect.",
  "/terms": "Terms of Use",
  "/trust": "Your information. Your permission. Your choice.",
  "/demo": "Choose a demo profile",
  "/app": "Overview",
  "/app/result": "Your result",
  "/app/couple": "Your result together",
  "/app/learn": "Learn",
  "/app/check": "Teach-back check",
  "/app/ask": "Ask a question",
  "/app/privacy": "Privacy",
  "/app/care": "Care pathway",
  "/app/report": "My screening report",
  "/app/partner": "Partner connection",
  "/app/notifications": "Notifications",
  "/app/settings": "Profile and settings",
  "/clinic": "Counsellor console",
  "/clinic/queue": "Queue",
  "/clinic/case/:id": "Case brief",
  "/clinic/audit": "Audit",
  "/insights": "Insights",
  "/admin": "Admin",
  "/legal": "Terms of Use",
};

function renderRoute(Component: () => ReactNode): ReactNode {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return createElement(
    I18nextProvider,
    { i18n },
    createElement(
      QueryClientProvider,
      { client },
      createElement(
        NumeralProvider,
        null,
        createElement(
          MemoryRouter,
          null,
          createElement(
            ThemeProvider,
            { storage: null },
            createElement(LiteracyProvider, null, createElement(Component)),
          ),
        ),
      ),
    ),
  );
}

describe("route placeholders", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders each route title from its i18n key", async () => {
    for (const route of productRoutes) {
      const expected = titles[route.path];
      if (expected === undefined) {
        throw new Error(`missing title for ${route.path}`);
      }
      expect(i18n.t(route.titleKey, { ns: route.ns }), route.path).toBe(expected);
      const page = await route.load();
      const html = renderToStaticMarkup(renderRoute(page.Component));
      const escaped = expected.replaceAll("&", "&amp;");
      expect(html, route.path).toContain(`>${escaped}<`);
    }
  });
});
