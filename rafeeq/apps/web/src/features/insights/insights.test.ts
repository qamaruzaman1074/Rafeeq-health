import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { setSessionRole } from "@/app/session";
import { fetchEquity, fetchKpis } from "@/features/insights/api";
import { EquityChart } from "@/features/insights/equity-chart";
import { InsightsPanels, InsightsView } from "@/features/insights/insights-view";
import { KpiCard } from "@/features/insights/kpi-card";
import { isSuppressed, plotValue } from "@/features/insights/suppress";
import {
  equityReport,
  kpiReport,
  type EquityCell,
  type KpiMetric,
} from "@/features/insights/types";
import { startAnalystSession } from "@/features/insights/session";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";
import { equityCells, equityPayload, kpiPayload } from "@/mocks/insights-fixture";

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
        createElement(NumeralProvider, null, createElement(MemoryRouter, null, node)),
      ),
    ),
  );
}

function texts(html: string, name: string, key: string): string[] {
  const pattern = new RegExp(`data-${name}="${key}"[^>]*>([^<]*)`, "g");
  return [...html.matchAll(pattern)].map((match) => match[1] ?? "");
}

function emptyMetric(id: string, overrides: Partial<KpiMetric> = {}): KpiMetric {
  return {
    id,
    n: null,
    ci: null,
    value: null,
    granted: null,
    revoked: null,
    suppressed: null,
    ...overrides,
  };
}

function cell(partial: EquityCell): EquityCell {
  return partial;
}

describe("insights KPIs and equity", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  afterEach(() => {
    setSessionRole(null);
  });

  it("keeps both endpoints closed until an analyst session exists", async () => {
    expect(await fetchKpis()).toBeNull();
    expect(await fetchEquity()).toBeNull();
    await startAnalystSession();
    const kpis = await fetchKpis();
    const equity = await fetchEquity();
    expect(kpis?.k_anonymity).toBe(5);
    expect(kpis?.metrics.map((metric) => metric.id)).toEqual([
      "explanation_completion",
      "teach_back_pass",
      "counselling_uptake",
      "median_time_result_to_referral",
      "privacy_events",
    ]);
    expect(equity?.metric_id).toBeNull();
    expect(equity?.series.map((series) => series.dimension)).toEqual(["language", "literacy_mode"]);
  });

  it("shows the synthetic badge, the floor notice, and a text alternative with a data table", async () => {
    const shell = renderNode(createElement(InsightsView));
    expect(shell).toContain("Demo example");
    expect(shell).toContain(">Insights<");
    expect(shell).toContain("k-anonymity floor: 5. Groups smaller than 5 are not shown.");

    await startAnalystSession();
    const kpis = await fetchKpis();
    const equity = await fetchEquity();
    expect(kpis).not.toBeNull();
    expect(equity).not.toBeNull();
    if (kpis === null || equity === null) {
      return;
    }
    const panels = renderNode(createElement(InsightsPanels, { kpis, equity }));
    expect(panels).toContain('aria-label="Text alternative"');
    expect(panels).toContain("Show data table");
    expect(panels).toContain("By language");
    expect(panels).toContain("By reading mode");
    expect(panels).toContain("Not shown (small group)");
  });

  it("renders named cards from the payload and leaves undefined metrics as OPEN_QUESTION", async () => {
    await startAnalystSession();
    const kpis = await fetchKpis();
    expect(kpis).not.toBeNull();
    if (kpis === null) {
      return;
    }
    const html = renderNode(
      createElement(
        "div",
        null,
        ...kpis.metrics.map((metric) => createElement(KpiCard, { key: metric.id, metric })),
      ),
    );
    expect(html).toContain("Completion of explanation");
    expect(html).toContain("Teach-back pass rate");
    expect(html).toContain("Counselling uptake");
    expect(html).toContain("Median time from result to referral booked");
    expect(html).toContain("Privacy events (consents granted/revoked)");
    const results = kpis.metrics.flatMap((metric) => texts(html, "kpi-result", metric.id));
    expect(results).toEqual(kpis.metrics.map(() => "Not available yet"));
    for (const text of results) {
      expect(text).not.toContain(String(equityCells.languageEn.n));
      expect(text).not.toContain(equityCells.languageEn.ci.low);
    }
  });

  it('renders suppressed cells as "Not shown (small group)" and shows fixture n and CI', async () => {
    await startAnalystSession();
    const equity = await fetchEquity();
    expect(equity).not.toBeNull();
    if (equity === null) {
      return;
    }

    const language = equity.series.find((series) => series.dimension === "language");
    const literacy = equity.series.find((series) => series.dimension === "literacy_mode");
    expect(language).toBeDefined();
    expect(literacy).toBeDefined();
    if (language === undefined || literacy === undefined) {
      return;
    }

    expect(isSuppressed(equityCells.languageAr)).toBe(true);
    expect(isSuppressed(equityCells.literacySimple)).toBe(true);
    expect(isSuppressed(equityCells.literacyVoice)).toBe(true);
    expect(isSuppressed(equityCells.languageEn)).toBe(false);
    expect(plotValue(equityCells.languageAr)).toBeNull();
    expect(plotValue(equityCells.literacySimple)).toBeNull();
    expect(plotValue(equityCells.languageEn)).toBe(equityCells.languageEn.n);

    const closed = renderNode(createElement(EquityChart, { series: language }));
    const open = renderNode(createElement(EquityChart, { series: language, tableOpen: true }));
    const literacyHtml = renderNode(
      createElement(EquityChart, { series: literacy, tableOpen: true }),
    );

    expect(closed).toContain('aria-label="Text alternative"');
    expect(closed).toContain("Show data table");
    expect(closed).toContain('aria-expanded="false"');
    expect(closed).toContain("<table");
    expect(open).toContain("Hide data table");
    expect(open).toContain('aria-expanded="true"');

    const hiddenAr = texts(closed, "equity-cell", "ar");
    const shownEn = texts(open, "equity-cell", "en");
    expect(hiddenAr.length).toBeGreaterThan(0);
    for (const text of hiddenAr) {
      expect(text).toContain("Not shown (small group)");
      expect(text).not.toContain(String(equityCells.languageAr.n));
      expect(text).not.toContain(equityCells.languageAr.ci.low);
      expect(text).not.toContain(equityCells.languageAr.ci.high);
    }
    expect(shownEn.some((text) => text.includes(String(equityCells.languageEn.n)))).toBe(true);
    expect(shownEn.some((text) => text.includes(equityCells.languageEn.ci.low))).toBe(true);
    expect(shownEn.some((text) => text.includes(equityCells.languageEn.ci.high))).toBe(true);
    expect(shownEn.some((text) => text.includes("CI"))).toBe(true);

    for (const key of ["simple", "voice"] as const) {
      const source = key === "simple" ? equityCells.literacySimple : equityCells.literacyVoice;
      for (const text of texts(literacyHtml, "equity-cell", key)) {
        expect(text).toContain("Not shown (small group)");
        expect(text).not.toContain(String(source.n));
      }
    }
    const flagged = texts(literacyHtml, "equity-cell", "simple");
    expect(flagged.some((text) => text.includes(equityCells.literacySimple.ci.low))).toBe(false);
    const standard = texts(literacyHtml, "equity-cell", "standard");
    expect(standard.some((text) => text.includes(String(equityCells.literacyStandard.n)))).toBe(
      true,
    );
    expect(standard.some((text) => text.includes(equityCells.literacyStandard.ci.low))).toBe(true);
  });

  it("suppresses a card count below the floor and a flagged card without printing them", () => {
    const small = renderNode(
      createElement(KpiCard, {
        metric: emptyMetric("privacy_events", {
          n: 3,
          ci: { level: 95, low: "901", high: "902" },
          granted: 7,
          revoked: 8,
          suppressed: false,
        }),
      }),
    );
    const flagged = renderNode(
      createElement(KpiCard, {
        metric: emptyMetric("counselling_uptake", {
          n: 12,
          ci: { level: 95, low: "701", high: "702" },
          value: "fixture-value",
          suppressed: true,
        }),
      }),
    );
    for (const text of texts(small, "kpi-result", "privacy_events")) {
      expect(text).toBe("Not shown (small group)");
    }
    expect(texts(small, "kpi-result", "privacy_events").join(" ")).not.toContain("901");
    for (const text of texts(flagged, "kpi-result", "counselling_uptake")) {
      expect(text).toBe("Not shown (small group)");
    }
    expect(texts(flagged, "kpi-result", "counselling_uptake").join(" ")).not.toContain(
      "fixture-value",
    );

    const missing = renderNode(createElement(KpiCard, { metric: emptyMetric("teach_back_pass") }));
    expect(texts(missing, "kpi-result", "teach_back_pass")).toEqual(["Not available yet"]);
    expect(missing).toContain("Teach-back pass rate");
  });

  it("drops fields that are not part of the insights payload", () => {
    const equity = equityReport({
      metric_id: null,
      row_level: "Noor",
      series: [
        {
          dimension: "language",
          cells: [{ ...equityCells.languageEn, person: "Noor", user_id: "secret-user" }],
        },
      ],
    });
    const kpis = kpiReport({
      ...kpiPayload(),
      patient: "Noor",
    });
    const encoded = JSON.stringify({ equity, kpis, fixture: equityPayload() });
    expect(encoded).not.toContain("Noor");
    expect(encoded).not.toContain("secret-user");
    expect(equity.series[0]?.cells[0]?.n).toBe(equityCells.languageEn.n);
  });

  it("prints a supplied count and leaves a missing interval as OPEN_QUESTION", () => {
    const html = renderNode(
      createElement(EquityChart, {
        series: {
          dimension: "language",
          cells: [cell({ key: "en", n: 9, ci: null, suppressed: false })],
        },
        tableOpen: true,
      }),
    );
    const shown = texts(html, "equity-cell", "en");
    expect(shown.some((text) => text.includes("Count 9"))).toBe(true);
    expect(shown.some((text) => text.includes("Not available yet"))).toBe(true);
    expect(shown.some((text) => text.includes("95% CI"))).toBe(false);
  });
});
