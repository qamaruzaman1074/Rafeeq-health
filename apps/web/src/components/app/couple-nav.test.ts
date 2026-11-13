import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeAll, describe, expect, it } from "vitest";
import { LiteracyProvider } from "@/app/literacy";
import { COUPLE_PRIMARY_NAV, CouplePrimaryNav } from "@/components/app/couple-nav";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";

describe("couple primary navigation", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("exposes the six dashboard sections", () => {
    expect(COUPLE_PRIMARY_NAV.map((item) => item.to)).toEqual([
      "/app",
      "/app/reports",
      "/app/journey",
      "/app/partner",
      "/app/resources",
      "/app/settings",
    ]);

    const html = renderToStaticMarkup(
      createElement(
        I18nextProvider,
        { i18n },
        createElement(
          NumeralProvider,
          null,
          createElement(
            LiteracyProvider,
            null,
            createElement(
              MemoryRouter,
              { initialEntries: ["/app"] },
              createElement(CouplePrimaryNav),
            ),
          ),
        ),
      ),
    );

    expect(html).toContain('aria-label="Pages"');
    expect(html).toContain("Overview");
    expect(html).toContain("My Reports");
    expect(html).toContain("Health Journey");
    expect(html).toContain("Partner Sharing");
    expect(html).toContain("Resources");
    expect(html).toContain("Settings");
    expect(html).not.toContain('href="/app/learn"');
    expect(html).not.toContain('href="/app/check"');
    expect(html).not.toContain('href="/app/care"');
    expect(html).not.toContain('href="/app/privacy"');
    expect(html).toContain('aria-current="page"');
  });
});
