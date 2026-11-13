import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { LiteracyProvider } from "@/app/literacy";
import { setSessionPersona } from "@/app/session";
import { DashboardView } from "@/features/dashboard/dashboard-view";
import { progressPercent } from "@/features/dashboard/progress-indicators";
import { personas } from "@/features/personas";
import i18n, { ensureNamespace } from "@/i18n";
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
  afterEach(() => {
    setSessionPersona(null);
  });

  beforeAll(async () => {
    await ensureNamespace("en", "couple");
    await i18n.changeLanguage("en");
  });

  it("renders the overview, report-code flow, dashboard sections, and assistant action", () => {
    const persona = personas[0];
    if (persona === undefined) {
      throw new Error("Expected at least one demo persona.");
    }
    setSessionPersona(persona.id);
    const html = renderDashboard();
    expect(html).toContain(">Overview<");
    expect(html).toContain(`Welcome, ${persona.names.replaceAll("&", "&amp;")}`);
    expect(html).toContain('data-dashboard-section="overview"');
    expect(html).toContain('data-dashboard-section="upload"');
    expect(html).toContain("Create report code");
    expect(html).toContain("Guest demonstration only");
    expect(html).toContain("Open My Reports");
    expect(html).toContain("Manage privacy");
    expect(html).toContain('href="/app/ask"');
    expect(html).toContain('href="/app/reports"');
    expect(html).toContain('href="/app/journey"');
    expect(html).toContain('href="/app/partner"');
    expect(html).toContain('href="/app/resources"');
    expect(html).toContain('href="/app/privacy"');
    expect(html).not.toContain("Welcome. This is a guest demo session.");
    expect(html).not.toContain("Screening notes");
    expect(html).not.toContain('href="/app/notifications"');
  });

  it("renders accessible circular and horizontal progress indicators", () => {
    const persona = personas[0];
    if (persona === undefined) {
      throw new Error("Expected at least one demo persona.");
    }
    setSessionPersona(persona.id);
    const html = renderDashboard();
    expect(html).toContain('aria-label="Journey Progress"');
    expect(html).toContain('aria-label="Learning Progress"');
    expect(html).toContain('aria-label="Profile Completion"');
    expect(html).toContain('aria-label="Health Journey"');
    expect(html).toContain('aria-label="Learning Resources"');
    expect(html).toContain('aria-label="Completed Activities"');
    expect(html.match(/role="progressbar"/g)).toHaveLength(7);
    expect(html).toContain("stroke-dasharray");
  });
});

describe("progressPercent", () => {
  it("returns a rounded percentage within bounds and handles invalid totals", () => {
    expect(progressPercent(1, 3)).toBe(33);
    expect(progressPercent(4, 3)).toBe(100);
    expect(progressPercent(-1, 3)).toBe(0);
    expect(progressPercent(1, 0)).toBe(0);
  });
});
