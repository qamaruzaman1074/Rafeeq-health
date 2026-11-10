import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeAll, describe, expect, it } from "vitest";
import { BriefPanel } from "@/features/clinic/brief-panel";
import { fetchBrief, fetchCaseAudit, fetchQueue, patchReferral } from "@/features/clinic/api";
import { QueueTable } from "@/features/clinic/queue-table";
import { EMPTY_FILTERS, filterQueue, sortQueue, UNSORTED } from "@/features/clinic/queue-state";
import { startCounsellorSession } from "@/features/clinic/session";
import { caseBrief, type CaseBrief } from "@/features/clinic/types";
import { findPersona } from "@/features/personas";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";
import { ApiRequestError, apiRequest } from "@/lib/api";
import { tierFromTests, unsharedMarkers } from "@/mocks/clinic-fixture";
import { explainFor } from "@/mocks/kernel-fixture";

function renderNode(node: ReactNode): string {
  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(NumeralProvider, null, createElement(MemoryRouter, null, node)),
    ),
  );
}

function renderBrief(brief: CaseBrief): string {
  return renderNode(
    createElement(BriefPanel, {
      brief,
      status: brief.status,
      pending: false,
      failed: false,
      onStatus: () => undefined,
      onSave: () => undefined,
    }),
  );
}

async function asGuest(personaId: string): Promise<void> {
  await apiRequest("/api/v1/auth/guest", {
    method: "POST",
    body: JSON.stringify({ persona_id: personaId }),
  });
}

async function grantClinicShare(): Promise<void> {
  await apiRequest("/api/v1/consents", {
    method: "POST",
    body: JSON.stringify({ scope: "share_with_clinic", granted: true }),
  });
}

describe("counsellor queue and brief", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("keeps the queue closed until a counsellor session exists", async () => {
    const closed = await apiRequest<unknown>("/api/v1/counsellor/queue");
    expect(closed.data).toBeNull();
    await startCounsellorSession();
    const open = await fetchQueue();
    expect(open?.map((row) => row.id)).toEqual([
      "referral-P1",
      "referral-P4",
      "referral-P5",
      "referral-P6",
    ]);
  });

  it("filters by tier, language, and status and sorts tier without calling it a risk level", async () => {
    const ambiguous = findPersona("P3");
    const routine = findPersona("P1");
    expect(routine).toBeDefined();
    expect(ambiguous).toBeDefined();
    if (routine !== undefined) {
      expect(tierFromTests(routine.tests)).toBe("T2_counsel_routine");
    }
    if (ambiguous !== undefined) {
      expect(tierFromTests(ambiguous.tests)).toBeNull();
    }

    await startCounsellorSession();
    const rows = await fetchQueue();
    expect(rows).not.toBeNull();
    if (rows === null) {
      return;
    }
    expect(
      filterQueue(rows, { ...EMPTY_FILTERS, tier: "T4_urgent_human" }).map((row) => row.id),
    ).toEqual(["referral-P6"]);
    expect(filterQueue(rows, { ...EMPTY_FILTERS, language: "en" })).toEqual([]);
    expect(filterQueue(rows, { ...EMPTY_FILTERS, language: "unknown" })).toHaveLength(rows.length);
    expect(filterQueue(rows, { ...EMPTY_FILTERS, status: "booked" })).toEqual([]);
    expect(sortQueue(rows, { key: "tier", direction: "desc" }).map((row) => row.id)).toEqual([
      "referral-P6",
      "referral-P4",
      "referral-P1",
      "referral-P5",
    ]);

    const html = renderNode(
      createElement(QueueTable, {
        rows,
        filters: EMPTY_FILTERS,
        sort: UNSORTED,
        onFilters: () => undefined,
        onSort: () => undefined,
      }),
    );
    expect(html.match(/aria-sort="none"/g)?.length).toBe(8);
    expect(html).toContain('for="queue-filter-tier"');
    expect(html).toContain('for="queue-filter-language"');
    expect(html).toContain('for="queue-filter-status"');
    expect(html).toContain('href="/clinic/case/referral-P5"');
    expect(html).toContain(">Tier<");
    expect(html).not.toContain("risk level");
    for (const marker of unsharedMarkers("P5")) {
      expect(html).not.toContain(marker);
    }
  });

  it("omits the declined partner genes and overlap from the P5 brief render", async () => {
    const markers = unsharedMarkers("P5");
    expect(markers.length).toBeGreaterThan(0);

    await asGuest("P5");
    await grantClinicShare();
    await startCounsellorSession();
    const result = await apiRequest<unknown>(
      "/api/v1/counsellor/referrals/referral-P5/brief?locale=en",
    );
    const brief = caseBrief(result.data);
    const html = renderBrief(brief);
    const encoded = JSON.stringify(result.data);

    expect(brief.shared_genes).toEqual([]);
    expect(brief.formulas).toEqual([]);
    expect(brief.talking_points[0]?.text).toBeNull();
    expect(html).toContain("No shared genes.");
    expect(html).toContain("Prompts, not advice");
    expect(html).toContain("These are prompts, not advice.");
    expect(html).toContain("clinic.talking-points");
    expect(html).not.toContain("risk level");
    for (const marker of markers) {
      expect(encoded).not.toContain(marker);
      expect(html).not.toContain(marker);
    }

    const persona = findPersona("P1");
    expect(persona).toBeDefined();
    if (persona !== undefined) {
      const card = explainFor(persona);
      expect(card).not.toBeNull();
      if (card !== null) {
        expect(html).not.toContain(card.formula);
      }
    }

    const poisoned = caseBrief({
      id: "referral-P5",
      status: "created",
      tier: null,
      shared_genes: [],
      formulas: [],
      user_questions: [],
      teach_back_gaps: [],
      preferences: { language: null, literacy_mode: null },
      cultural_notes: { block_id: "clinic.cultural-notes", text: null },
      talking_points: [{ block_id: "clinic.talking-points", text: null }],
      partner_genes: markers,
      overlap: markers,
    });
    const poisonedHtml = renderBrief(poisoned);
    for (const marker of markers) {
      expect(JSON.stringify(poisoned)).not.toContain(marker);
      expect(poisonedHtml).not.toContain(marker);
    }
  });

  it("shows formulas from the brief only after clinic share allows the overlap", async () => {
    await asGuest("P1");
    await startCounsellorSession();
    const hidden = await fetchBrief("referral-P1", "en");
    expect(hidden?.shared_genes).toEqual([]);
    expect(hidden?.formulas).toEqual([]);

    await grantClinicShare();
    const shown = await fetchBrief("referral-P1", "en");
    const persona = findPersona("P1");
    expect(persona).toBeDefined();
    if (persona === undefined || shown === null) {
      return;
    }
    const card = explainFor(persona);
    expect(card).not.toBeNull();
    if (card === null) {
      return;
    }
    expect(shown.formulas.map((formula) => formula.text)).toEqual([card.formula]);
    expect(shown.shared_genes.length).toBeGreaterThan(0);
    const html = renderBrief(shown);
    expect(html).toContain(card.formula);
    expect(html).toContain("Formula");
  });

  it("patches status and records a counsellor read on the audit tab", async () => {
    await startCounsellorSession();
    const updated = await patchReferral("referral-P4", "booked");
    expect(updated).toEqual({ id: "referral-P4", status: "booked" });
    const rows = await fetchQueue();
    expect(rows?.find((row) => row.id === "referral-P4")?.status).toBe("booked");

    await fetchBrief("referral-P4", "en");
    const entries = await fetchCaseAudit("referral-P4");
    expect(
      entries?.some(
        (entry) => entry.actor_role === "counsellor" && entry.object_id === "referral-P4",
      ),
    ).toBe(true);
    expect(JSON.stringify(entries)).not.toContain(unsharedMarkers("P5")[0]);

    await expect(fetchBrief("referral-missing", "en")).rejects.toBeInstanceOf(ApiRequestError);
  });
});
