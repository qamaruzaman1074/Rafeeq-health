import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { setAuthenticatedSession, setSessionRole } from "@/app/session";
import {
  createPrototypeReportCode,
  unlockPrototypeReport,
} from "@/features/report-access/prototype-report-access";
import i18n from "@/i18n";
import { Component } from "@/pages/report-page";

function renderReportPage(): string {
  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(MemoryRouter, { initialEntries: ["/app/report"] }, createElement(Component)),
    ),
  );
}

describe("screening report access", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  afterEach(() => {
    setSessionRole(null);
  });

  it("keeps the sample report hidden until the matching code is entered", () => {
    setAuthenticatedSession("couple", "report-page-access-test");
    const initial = renderReportPage();
    expect(initial).toContain('data-report-code-gate=""');
    expect(initial).not.toContain("Ahmed Hassan");
    expect(initial).not.toContain("RAF-DEMO-001");
    expect(initial).not.toContain("HBB");

    createPrototypeReportCode("012345");
    const locked = renderReportPage();
    expect(locked).toContain('data-report-code-gate=""');
    expect(locked).not.toContain("Ahmed Hassan");

    expect(unlockPrototypeReport("012345")).toBe(true);
    const unlocked = renderReportPage();
    expect(unlocked).toContain("Ahmed Hassan");
    expect(unlocked).toContain("RAF-DEMO-001");
  });
});
