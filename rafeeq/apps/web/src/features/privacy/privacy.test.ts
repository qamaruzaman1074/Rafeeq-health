import { readFileSync } from "node:fs";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AuditTimeline } from "@/features/privacy/audit-timeline";
import { receiptFile } from "@/features/privacy/download";
import { ReceiptCard } from "@/features/privacy/receipt-card";
import { ShareMatrix } from "@/features/privacy/share-matrix";
import type { AuditEntry, ConsentReceipt } from "@/features/privacy/types";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";

const receipt: ConsentReceipt = {
  id: "receipt-consent-P1-view_own",
  consent_id: "consent-P1-view_own",
  scope: "view_own",
  granted: true,
  version: 1,
  at: "2026-11-08T11:00:00.000Z",
  prev_hash: null,
  hash: null,
};

const entry: AuditEntry = {
  id: "sample-results",
  at: "2026-11-08T12:00:00.000Z",
  actor_role: "guest",
  action: "read",
  object_type: "results",
  object_id: null,
  outcome: "allowed",
};

function renderNode(node: ReactNode): string {
  return renderToStaticMarkup(
    createElement(I18nextProvider, { i18n }, createElement(NumeralProvider, null, node)),
  );
}

function switchTag(html: string, label: string): string {
  const match = new RegExp(`<button[^>]*aria-label="${label}"[^>]*>`).exec(html);
  expect(match, label).not.toBeNull();
  return match?.[0] ?? "";
}

function isDisabled(tag: string): boolean {
  return /(?:\s)disabled(?:=""|\s|>)/.test(tag);
}

describe("privacy screen", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("downloads the receipt payload as JSON", () => {
    const file = receiptFile(receipt);
    expect(file.mediaType).toBe("application/json");
    expect(file.filename).toBe("consent-receipt-consent-P1-view_own.json");
    expect(JSON.parse(file.json)).toEqual(receipt);
    const source = readFileSync(new URL("./receipt-card.tsx", import.meta.url), "utf8");
    expect(source).toContain("downloadReceiptFile(receiptFile(receipt))");
    const view = readFileSync(new URL("./privacy-view.tsx", import.meta.url), "utf8");
    expect(view).toContain("commitConsentChange");
  });

  it("renders the matrix with own access locked and research unanswered", () => {
    const html = renderNode(
      createElement(ShareMatrix, {
        partnerGranted: true,
        clinicGranted: false,
        disabled: false,
        onToggle: () => undefined,
      }),
    );
    expect(html.match(/scope="col"/g)).toHaveLength(4);
    expect(html.match(/role="switch"/g)).toHaveLength(3);
    expect(html.match(/Not available yet/g)).toHaveLength(3);
    expect(isDisabled(switchTag(html, "Your own result stays on"))).toBe(true);
    expect(switchTag(html, "Your own result stays on")).toContain('aria-checked="true"');
    expect(switchTag(html, "Share the overlap with your partner")).toContain('aria-checked="true"');
    expect(isDisabled(switchTag(html, "Share the overlap with your partner"))).toBe(false);
    expect(switchTag(html, "Share with the clinic")).toContain('aria-checked="false"');
    expect(html).toContain("Research aggregate");
    expect(html).not.toContain(">Research<");

    const card = renderNode(
      createElement(ReceiptCard, {
        receipt,
        disabled: false,
        onRevoke: () => undefined,
      }),
    );
    expect(card).toContain("Download receipt JSON");
    expect(card).toContain('data-download="receipt"');
    expect(card).not.toContain('href="/');
  });

  it("renders who, what, and when in English", async () => {
    await i18n.changeLanguage("en");
    const english = renderNode(createElement(AuditTimeline, { entries: [entry] }));
    expect(english).toContain('dir="ltr"');
    expect(english).toContain('lang="en"');
    expect(english).toContain('data-field="actor"');
    expect(english).toContain('data-field="action"');
    expect(english).toContain('data-field="time"');
    expect(english).toContain("Guest");
    expect(english).toContain("Read");
    expect(english).toContain("Results");
    expect(english).toMatch(/datetime="2026-11-08T12:00:00.000Z"/i);
    expect(english).toContain("2026");
    expect(english).not.toMatch(/[٠-٩]/);
  });
});
