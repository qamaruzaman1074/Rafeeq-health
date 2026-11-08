import { readFileSync } from "node:fs";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeAll, describe, expect, it } from "vitest";
import { BookingCalendar } from "@/features/care/booking-calendar";
import { InfoCards } from "@/features/care/info-cards";
import { PathwayTimeline } from "@/features/care/pathway-timeline";
import { SendReferral } from "@/features/care/send-referral";
import {
  CARE_BLOCKS,
  clinicShareGranted,
  PATHWAY_STEP_IDS,
  REFERRAL_STATUSES,
  type PathwayStepId,
  type ReferralStatus,
} from "@/features/care/steps";
import { StatusChips } from "@/features/care/status-chips";
import { couplePathway, type CouplePathway } from "@/features/care/types";
import { fetchPathway, postReferral } from "@/features/care/api";
import { readLocaleBlock } from "@/features/learn/blocks";
import i18n from "@/i18n";
import { NumeralProvider } from "@/i18n/numerals";
import { apiRequest } from "@/lib/api";

const STEP_LABELS = [
  "Result received",
  "Counselling",
  "Confirmatory assessment (if advised by a counsellor)",
  "Specialised reproductive-genomics services",
  "Follow-up",
];

function renderNode(node: ReactNode): string {
  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(NumeralProvider, null, createElement(MemoryRouter, null, node)),
    ),
  );
}

function isDisabled(tag: string): boolean {
  return /(?:\s)disabled(?:=""|\s|>)/.test(tag);
}

function sendButton(html: string): string {
  const match = /<button[^>]*data-send="referral"[^>]*>/.exec(html);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

function pathway(current: PathwayStepId, status: ReferralStatus | null): CouplePathway {
  return {
    current_step: current,
    status,
    steps: PATHWAY_STEP_IDS.map((id) => ({
      id,
      reached: id === "result_received" || (current === "counselling" && id === "counselling"),
    })),
  };
}

async function enter(personaId: string): Promise<void> {
  await apiRequest("/api/v1/auth/guest", {
    method: "POST",
    body: JSON.stringify({ persona_id: personaId }),
  });
}

describe("care pathway", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("keeps the send action off until clinic share is granted", () => {
    expect(clinicShareGranted(null)).toBe(false);
    expect(clinicShareGranted([{ scope: "share_with_clinic", granted: false }])).toBe(false);
    expect(clinicShareGranted([{ scope: "share_overlap_with_partner", granted: true }])).toBe(
      false,
    );
    expect(clinicShareGranted([{ scope: "share_with_clinic", granted: true }])).toBe(true);

    const blocked = renderNode(
      createElement(SendReferral, {
        enabled: false,
        pending: false,
        showShareHint: true,
        failed: false,
        onSend: () => undefined,
      }),
    );
    expect(isDisabled(sendButton(blocked))).toBe(true);
    expect(blocked).toContain("Send my questions and what I understood to the counsellor");
    expect(blocked).toContain("This stays off until clinic share is on.");
    expect(blocked).toContain('href="/app/privacy"');

    const ready = renderNode(
      createElement(SendReferral, {
        enabled: true,
        pending: false,
        showShareHint: false,
        failed: false,
        onSend: () => undefined,
      }),
    );
    expect(isDisabled(sendButton(ready))).toBe(false);
    expect(ready).not.toContain("This stays off until clinic share is on.");
  });

  it("shows information-only cards and an empty body when no block exists", () => {
    expect(readLocaleBlock("en", CARE_BLOCKS.confirmatory_assessment).text).toBeNull();
    expect(readLocaleBlock("ar", CARE_BLOCKS.specialised_services).text).toBeNull();
    const html = renderNode(createElement(InfoCards));
    expect(html).toContain("Confirmatory assessment (if advised by a counsellor)");
    expect(html).toContain("Specialised reproductive-genomics services");
    expect(html.match(/Information only/g)).toHaveLength(2);
    expect(html.match(/OPEN_QUESTION/g)).toHaveLength(2);
    expect(html).toContain("care.confirmatory-assessment");
    expect(html).toContain("care.specialised-reproductive-genomics");
  });

  it("renders status chips only when the pathway includes a status", () => {
    expect(renderNode(createElement(StatusChips, { status: null }))).toBe("");
    for (const status of REFERRAL_STATUSES) {
      const html = renderNode(createElement(StatusChips, { status }));
      expect(html).toContain(`data-status="${status}"`);
      expect(html).not.toMatch(/risk level/i);
      expect(html).not.toMatch(/\bT[1-4]\b/);
      expect(html).not.toContain("danger");
    }
  });

  it("keeps booking slots on the page and off the network", () => {
    const source = readFileSync(new URL("./booking-calendar.tsx", import.meta.url), "utf8");
    expect(source).not.toContain("postReferral");
    expect(source).not.toContain("/referrals");
    expect(source).not.toContain("/pathway");
    const html = renderNode(createElement(BookingCalendar));
    expect(html).toContain("Choosing a time stays on this device.");
    expect(html.match(/data-slot="/g)).toHaveLength(4);
    expect(html).toContain('aria-pressed="false"');
    expect(html).not.toContain("Selected on this device.");
  });

  it("drops counsellor-only fields before they can render", () => {
    const view = couplePathway({
      current_step: "counselling",
      steps: [
        { id: "result_received", reached: true, tier: "T1_info" },
        { id: "counselling", reached: true },
      ],
      status: "created",
      tier: "T4_urgent_human",
      due_by: "2026-12-01T00:00:00.000Z",
    });
    expect(Object.keys(view).sort()).toEqual(["current_step", "status", "steps"]);
    expect(view.steps.map((step) => step.id)).toEqual([...PATHWAY_STEP_IDS]);
    const html = renderNode(
      createElement(
        "div",
        null,
        createElement(PathwayTimeline, { pathway: view }),
        createElement(StatusChips, { status: view.status }),
        createElement(InfoCards),
      ),
    );
    for (const label of STEP_LABELS) {
      expect(html).toContain(label);
    }
    expect(html).toContain("Created");
    expect(html).toContain('data-step="counselling" data-current="true"');
    expect(html).not.toContain("T1_info");
    expect(html).not.toContain("T4_urgent_human");
    expect(html).not.toContain("2026-12-01");
    expect(html).not.toMatch(/risk level/i);
    expect(html).not.toMatch(/\bT[1-4]\b/);
    expect(html).not.toContain("due_by");
    expect(html).not.toContain("due-by");
  });

  it("shows counselling as the current step after a referral is created", async () => {
    const absent = await apiRequest<null>("/api/v1/pathway");
    expect(absent.data).toBeNull();
    const absentPost = await apiRequest<null>("/api/v1/referrals", {
      method: "POST",
      body: "{}",
    });
    expect(absentPost.data).toBeNull();

    await enter("P1");
    const beforeRaw = await apiRequest<Record<string, unknown>>("/api/v1/pathway");
    expect(beforeRaw.data.current_step).toBe("result_received");
    expect(beforeRaw.data.status).toBeNull();
    expect(beforeRaw.data.tier).toBeTypeOf("string");
    expect(beforeRaw.data.due_by).toBeTypeOf("string");

    const before = await fetchPathway();
    expect(before).toEqual(pathway("result_received", null));
    expect(before !== null && "tier" in before).toBe(false);

    await expect(postReferral()).rejects.toMatchObject({ messageKey: "clinicShareRequired" });
    const unchanged = await fetchPathway();
    expect(unchanged?.current_step).toBe("result_received");
    expect(unchanged?.status).toBeNull();

    await apiRequest("/api/v1/consents", {
      method: "POST",
      body: JSON.stringify({ scope: "share_with_clinic", granted: true }),
    });

    const created = await postReferral();
    expect(created).toEqual({ id: "referral-P1", status: "created" });
    const again = await postReferral();
    expect(again).toEqual(created);

    const after = await fetchPathway();
    expect(after).toEqual(pathway("counselling", "created"));
    expect(after !== null && "tier" in after).toBe(false);

    const html = renderNode(
      createElement(
        "div",
        null,
        createElement(PathwayTimeline, { pathway: after ?? pathway("counselling", "created") }),
        createElement(StatusChips, { status: after?.status ?? null }),
      ),
    );
    expect(html).toContain('data-step="counselling" data-current="true" data-reached="true"');
    expect(html).toContain("Created");
    expect(html).not.toMatch(/risk level/i);
    expect(html).not.toMatch(/\bT[1-4]\b/);

    const view = readFileSync(new URL("./care-view.tsx", import.meta.url), "utf8");
    expect(view).toContain("postReferral()");
    expect(view).toContain("invalidateQueries");
  });
});
