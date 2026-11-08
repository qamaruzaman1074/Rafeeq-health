import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { beforeAll, describe, expect, it } from "vitest";
import { LiteracyProvider } from "@/app/literacy";
import { ShellFrame } from "@/components/app-shell";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";

function renderShell(): string {
  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
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
  );
}

describe("app shell", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the skip link, toggles, and synthetic-data notice", () => {
    const html = renderShell();
    expect(i18n.t("shell.skip")).toBe("Skip to content");
    expect(i18n.t("shell.syntheticNotice")).toBe("Synthetic data, not medical advice.");
    expect(html).toContain('href="#main"');
    expect(html).toContain('id="main"');
    expect(html).toContain("Skip to content");
    expect(html).toContain("Synthetic data, not medical advice.");
    expect(html).toContain("Reading mode");
    expect(html).toContain("Standard");
    expect(html).toContain("Simple");
    expect(html).toContain("Voice");
    expect(html).toContain("English");
    expect(html).toContain("Arabic");
    expect(html).toContain("Western");
    expect(html).toContain("Arabic-Indic");
  });
});
