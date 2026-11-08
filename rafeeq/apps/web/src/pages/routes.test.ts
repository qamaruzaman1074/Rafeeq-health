import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeAll, describe, expect, it } from "vitest";
import { LiteracyProvider } from "@/app/literacy";
import { productRoutes } from "@/app/route-table";
import i18n from "@/i18n";

const titles: Record<string, string> = {
  "/": "Understand your genetic result - in your language, at your pace, with a counsellor one tap away.",
  "/trust": "Trust centre",
  "/demo": "Persona picker",
  "/app": "Couple home",
  "/app/result": "Your result",
  "/app/couple": "Your result together",
  "/app/learn": "Learn",
  "/app/check": "Teach-back check",
  "/app/ask": "Ask a question",
  "/app/privacy": "Privacy",
  "/app/care": "Care pathway",
  "/app/settings": "Settings",
  "/clinic": "Counsellor console",
  "/clinic/queue": "Queue",
  "/clinic/case/:id": "Case brief",
  "/clinic/audit": "Audit",
  "/insights": "Insights",
  "/admin": "Admin",
  "/legal": "Legal",
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
        MemoryRouter,
        null,
        createElement(LiteracyProvider, null, createElement(Component)),
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
      expect(html, route.path).toContain(`>${expected}<`);
    }
  });
});
