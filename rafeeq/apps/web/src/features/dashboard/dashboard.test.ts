import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeAll, describe, expect, it } from "vitest";
import { LiteracyProvider } from "@/app/literacy";
import { DashboardView } from "@/features/dashboard/dashboard-view";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";

function renderDashboard(): string {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const tree: ReactNode = createElement(
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
          createElement(LiteracyProvider, null, createElement(DashboardView)),
        ),
      ),
    ),
  );
  return renderToStaticMarkup(tree);
}

describe("dashboard view", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the overview chrome, status regions, and existing pathway", () => {
    const html = renderDashboard();
    expect(html).toContain(">Overview<");
    expect(html).toContain("Welcome. This is a guest demo session.");
    expect(html).toContain('data-dashboard-section="welcome"');
    expect(html).toContain('data-dashboard-section="results"');
    expect(html).toContain('data-dashboard-section="understanding"');
    expect(html).toContain('data-dashboard-section="counselling"');
    expect(html).toContain('data-dashboard-section="privacy"');
    expect(html).toContain('data-dashboard-section="next"');
    expect(html).toContain(">Screening notes<");
    expect(html).toContain(">Understanding<");
    expect(html).toContain(">Counselling<");
    expect(html).toContain(">Privacy and sharing<");
    expect(html).toContain(">Next steps<");
    expect(html).toContain('data-step="check"');
    expect(html).toContain("Demo example");
    expect(html).toContain("Topic-by-topic completion is not stored");
    expect(html.toLowerCase()).not.toContain("you must");
    expect(html.toLowerCase()).not.toContain("high-risk");
    expect(html).not.toContain("hearing-loss example");
  });
});
