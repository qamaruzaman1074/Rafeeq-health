import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import { LiteracyProvider } from "@/app/literacy";
import { ThemeProvider } from "@/app/theme";
import { setSessionRole } from "@/app/session";
import { CoupleAppFrame } from "@/components/app/couple-app-frame";
import { ShellFrame } from "@/components/app-shell";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";

function renderShell(): string {
  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(
        ThemeProvider,
        { storage: null },
        createElement(
          NumeralProvider,
          null,
          createElement(
            LiteracyProvider,
            null,
            createElement(ShellFrame, null, createElement("span")),
          ),
        ),
      ),
    ),
  );
}

describe("app shell", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  afterEach(() => {
    setSessionRole(null);
  });

  it("renders the skip link, toggles, and synthetic-data notice", () => {
    const html = renderShell();
    expect(i18n.t("shell.skip")).toBe("Skip to content");
    expect(i18n.t("shell.syntheticNotice")).toBe(
      "Demo environment with fictional data. Not medical advice.",
    );
    expect(html).toContain('href="#main"');
    expect(html).toContain('id="main"');
    expect(html).toContain("Skip to content");
    expect(html).toContain("Demo environment with fictional data. Not medical advice.");
    expect(html).toContain("Reading mode");
    expect(html).toContain("Standard");
    expect(html).toContain("Simple");
    expect(html).toContain("Voice");
    expect(html).not.toContain("Arabic-Indic");
  });

  it("renders the three dashboard sections and a welcome area without reading controls", () => {
    setSessionRole("guest");
    const html = renderToStaticMarkup(
      createElement(
        I18nextProvider,
        { i18n },
        createElement(
          ThemeProvider,
          { storage: null },
          createElement(
            NumeralProvider,
            null,
            createElement(
              LiteracyProvider,
              null,
              createElement(
                MemoryRouter,
                { initialEntries: ["/app"] },
                createElement(CoupleAppFrame, null, createElement("span")),
              ),
            ),
          ),
        ),
      ),
    );
    expect(html).toContain("Overview");
    expect(html).toContain('href="/app/result"');
    expect(html).toContain('href="/app/privacy"');
    expect(html).toContain("Welcome");
    expect(html).toContain("English (EN)");
    expect(html).toContain("العربية (AR)");
    expect(html).not.toContain('href="/app/learn"');
    expect(html).not.toContain('href="/app/check"');
    expect(html).not.toContain("Standard");
    expect(html).not.toContain("Simple");
    expect(html).not.toContain("Voice");
    expect(html).toContain('href="#main"');
  });
});
