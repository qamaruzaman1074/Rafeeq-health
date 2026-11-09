import { describe, expect, it } from "vitest";
import { demoPartnerFindings, demoReport } from "@/features/demo-report/demo-report";
import {
  initialPartnerState,
  partnerReducer,
  sharedFindings,
  sharedRiskState,
  type PartnerAction,
  type PartnerDemoState,
} from "@/features/partner/partner-demo";

const T = "2026-11-09T10:00:00.000Z";

function run(actions: PartnerAction[], start = initialPartnerState()): PartnerDemoState {
  return actions.reduce((state, action) => partnerReducer(state, action, T), start);
}

describe("partner invitation workflow", () => {
  it("creates, cancels, and re-creates an invitation with audit events", () => {
    const state = run([
      { type: "invite", code: "A1" },
      { type: "cancel" },
      { type: "invite", code: "B2" },
    ]);
    expect(state.invitation).toMatchObject({ status: "pending", code: "B2" });
    expect(state.events.map((event) => event.type)).toEqual([
      "inviteCreated",
      "inviteCancelled",
      "inviteCreated",
    ]);
    expect(state.events.every((event) => event.synthetic)).toBe(true);
  });

  it("rejects consent before the partner accepts", () => {
    const pending = run([{ type: "invite", code: "A1" }]);
    expect(partnerReducer(pending, { type: "grant", category: "carrierFindings" }, T)).toBe(
      pending,
    );
  });

  it("keeps each category separate and records revocation time", () => {
    const state = run([
      { type: "invite", code: "A1" },
      { type: "simulateAccept" },
      { type: "grant", category: "carrierFindings" },
    ]);
    expect(state.mine.carrierFindings.granted).toBe(true);
    expect(state.mine.reportInfo.granted).toBe(false);
    expect(state.mine.referralInfo.granted).toBe(false);

    const revoked = partnerReducer(
      state,
      { type: "revoke", category: "carrierFindings" },
      "2026-11-10T08:00:00.000Z",
    );
    expect(revoked.mine.carrierFindings).toEqual({
      granted: false,
      changedAt: "2026-11-10T08:00:00.000Z",
    });
    expect(revoked.events[0]?.type).toBe("consentRevoked");
  });
});

describe("shared findings", () => {
  it("shares nothing by default", () => {
    expect(sharedFindings(demoReport.findings, initialPartnerState().mine)).toEqual([]);
  });

  it("never shares not-tested or no-variant results, even with every consent on", () => {
    const state = run([
      { type: "invite", code: "A1" },
      { type: "simulateAccept" },
      { type: "grant", category: "carrierFindings" },
      { type: "grant", category: "reportInfo" },
    ]);
    const shared = sharedFindings(demoReport.findings, state.mine).map((finding) => finding.status);
    expect(shared).toEqual(["carrier_finding", "inconclusive"]);
  });
});

describe("shared risk overview", () => {
  it("shows no couple risk without a partner", () => {
    expect(sharedRiskState(initialPartnerState()).kind).toBe("noPartner");
  });

  it("waits while the invitation is pending", () => {
    expect(sharedRiskState(run([{ type: "invite", code: "A1" }])).kind).toBe("pending");
  });

  it("does not infer risk from one partner's findings alone", () => {
    const state = run([
      { type: "invite", code: "A1" },
      { type: "simulateAccept" },
      { type: "grant", category: "carrierFindings" },
    ]);
    expect(sharedRiskState(state).kind).toBe("noSharedFindings");
  });

  it("explains the recessive example only for the same gene with both consents", () => {
    const state = run([
      { type: "invite", code: "A1" },
      { type: "simulateAccept" },
      { type: "grant", category: "carrierFindings" },
      { type: "simulatePartnerGrant", category: "carrierFindings" },
    ]);
    expect(sharedRiskState(state)).toEqual({ kind: "example", genes: ["HBB"] });
  });

  it("does not pair carrier findings in different genes", () => {
    const state = run([
      { type: "invite", code: "A1" },
      { type: "simulateAccept" },
      { type: "grant", category: "carrierFindings" },
      { type: "simulatePartnerGrant", category: "carrierFindings" },
    ]);
    const otherGene = demoPartnerFindings.map((finding) => ({ ...finding, gene: "CFTR" }));
    expect(sharedRiskState(state, demoReport.findings, otherGene).kind).toBe("insufficient");
  });

  it("treats a shared inconclusive finding as insufficient, not as a carrier", () => {
    const state = run([
      { type: "invite", code: "A1" },
      { type: "simulateAccept" },
      { type: "grant", category: "reportInfo" },
      { type: "simulatePartnerGrant", category: "carrierFindings" },
    ]);
    expect(sharedRiskState(state).kind).toBe("insufficient");
  });
});
