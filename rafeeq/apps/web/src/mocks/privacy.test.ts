import { describe, expect, it } from "vitest";
import { ApiRequestError, apiRequest } from "@/lib/api";
import { receiptFile } from "@/features/privacy/download";
import { fetchReceipt } from "@/features/privacy/api";
import type { AuditEntry, ConsentReceipt, MineConsent } from "@/features/privacy/types";

async function enter(personaId: string): Promise<void> {
  await apiRequest("/api/v1/auth/guest", {
    method: "POST",
    body: JSON.stringify({ persona_id: personaId }),
  });
}

describe("privacy mock API", () => {
  it("returns no privacy payload before a guest session", async () => {
    const consents = await apiRequest<null>("/api/v1/consents");
    expect(consents.data).toBeNull();
    const mine = await apiRequest<null>("/api/v1/consents?mine=true");
    expect(mine.data).toBeNull();
    const receipt = await apiRequest<null>("/api/v1/consents/receipt/example");
    expect(receipt.data).toBeNull();
    const audit = await apiRequest<null>("/api/v1/audit");
    expect(audit.data).toBeNull();
    const mineAudit = await apiRequest<null>("/api/v1/audit?mine=true");
    expect(mineAudit.data).toBeNull();
    const posted = await apiRequest<null>("/api/v1/consents", { method: "POST" });
    expect(posted.data).toBeNull();
  });

  it("keeps the couple consent list and adds the signed-in scopes", async () => {
    await enter("P1");
    const consents =
      await apiRequest<{ partner: string; scope: string; granted: boolean }[]>("/api/v1/consents");
    expect(consents.data).toEqual([
      { partner: "a", scope: "share_overlap_with_partner", granted: true },
      { partner: "b", scope: "share_overlap_with_partner", granted: true },
    ]);

    const mine = await apiRequest<MineConsent[]>("/api/v1/consents?mine=true");
    expect(mine.data.map((row) => [row.scope, row.granted])).toEqual([
      ["view_own", true],
      ["share_overlap_with_partner", true],
      ["share_with_clinic", false],
      ["research_aggregate", false],
    ]);

    const hidden = await apiRequest<null>("/api/v1/audit");
    expect(hidden.data).toBeNull();
    const audit = await apiRequest<AuditEntry[]>("/api/v1/audit?mine=true");
    expect(audit.data.map((row) => [row.actor_role, row.action, row.object_type, row.at])).toEqual([
      ["guest", "read", "results", "2026-11-08T12:00:00.000Z"],
      ["counsellor", "read", "shares", "2026-11-08T12:05:00.000Z"],
      ["guest", "read", "consents", "2026-11-08T12:10:00.000Z"],
    ]);

    const overlap = mine.data.find((row) => row.scope === "share_overlap_with_partner");
    expect(overlap).toBeDefined();
    if (overlap === undefined) {
      return;
    }
    const payload = await fetchReceipt(overlap.id);
    const file = receiptFile(payload);
    expect(file.filename.endsWith(".json")).toBe(true);
    expect(JSON.parse(file.json)).toEqual(payload);
    expect(payload).toMatchObject({
      consent_id: overlap.id,
      scope: "share_overlap_with_partner",
      granted: true,
      hash: null,
      prev_hash: null,
    });
  });

  it("revokes overlap for the session user and leaves view_own on", async () => {
    await enter("P1");
    await expect(
      apiRequest("/api/v1/consents", {
        method: "POST",
        body: JSON.stringify({ scope: "view_own", granted: false }),
      }),
    ).rejects.toMatchObject({ messageKey: "viewOwnPermanent" });

    const saved = await apiRequest<MineConsent[]>("/api/v1/consents", {
      method: "POST",
      body: JSON.stringify({ scope: "share_overlap_with_partner", granted: false }),
    });
    expect(saved.data.find((row) => row.scope === "view_own")?.granted).toBe(true);
    expect(saved.data.find((row) => row.scope === "share_overlap_with_partner")).toMatchObject({
      granted: false,
      version: 2,
    });

    const consents = await apiRequest<{ partner: string; granted: boolean }[]>("/api/v1/consents");
    expect(consents.data).toEqual([
      { partner: "a", scope: "share_overlap_with_partner", granted: false },
      { partner: "b", scope: "share_overlap_with_partner", granted: true },
    ]);
    const overlap = await apiRequest<{ hidden: boolean; reason: string }>(
      "/api/v1/results/overlap",
    );
    expect(overlap.data).toEqual({
      hidden: true,
      reason: "sharing_declined",
      genes: [],
    });
    await expect(apiRequest("/api/v1/explain/overlap", { method: "POST" })).rejects.toMatchObject({
      status: 403,
      messageKey: "sharingDeclined",
    });

    const receipt = await apiRequest<ConsentReceipt>(
      "/api/v1/consents/receipt/consent-P1-share_overlap_with_partner",
    );
    expect(receipt.data.granted).toBe(false);
    expect(receipt.data.version).toBe(2);

    const audit = await apiRequest<AuditEntry[]>("/api/v1/audit?mine=true");
    expect(audit.data.at(-1)).toMatchObject({
      actor_role: "guest",
      action: "revoke",
      object_type: "consents",
      object_id: "consent-P1-share_overlap_with_partner",
    });

    await expect(
      apiRequest("/api/v1/consents", { method: "POST", body: JSON.stringify({ granted: false }) }),
    ).rejects.toMatchObject({ messageKey: "missingConsent" });
    await expect(apiRequest("/api/v1/consents/receipt/missing")).rejects.toBeInstanceOf(
      ApiRequestError,
    );
  });

  it("starts clinic sharing off and does not treat a missing partner row as granted", async () => {
    await enter("P5");
    const mine = await apiRequest<MineConsent[]>("/api/v1/consents?mine=true");
    expect(mine.data.find((row) => row.scope === "share_overlap_with_partner")?.granted).toBe(
      false,
    );
    expect(mine.data.find((row) => row.scope === "share_with_clinic")?.granted).toBe(false);
    const consents = await apiRequest<{ partner: string; granted: boolean }[]>("/api/v1/consents");
    expect(consents.data).toEqual([
      { partner: "b", scope: "share_overlap_with_partner", granted: false },
    ]);
  });
});
