import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { ApiRequestError, apiRequest } from "@/lib/api";
import { fetchMineConsents, postConsent } from "@/features/privacy/api";
import {
  commitConsentChange,
  MATRIX_PARTIES,
  MATRIX_ROWS,
  matrixCell,
} from "@/features/privacy/matrix";
import { server } from "@/test/mocks/server";

async function enter(personaId: string): Promise<void> {
  await apiRequest("/api/v1/auth/guest", {
    method: "POST",
    body: JSON.stringify({ persona_id: personaId }),
  });
}

describe("share matrix", () => {
  it("uses the four scopes and does not add a party for research aggregate", () => {
    expect(MATRIX_PARTIES).toEqual(["me", "partner", "clinic"]);
    expect(MATRIX_ROWS).toEqual([
      "view_own",
      "share_overlap_with_partner",
      "share_with_clinic",
      "research_aggregate",
    ]);
    expect(matrixCell("view_own", "me")).toEqual({ kind: "locked" });
    expect(matrixCell("view_own", "partner")).toEqual({ kind: "empty" });
    expect(matrixCell("view_own", "clinic")).toEqual({ kind: "empty" });
    expect(matrixCell("share_overlap_with_partner", "partner")).toEqual({
      kind: "toggle",
      scope: "share_overlap_with_partner",
    });
    expect(matrixCell("share_with_clinic", "clinic")).toEqual({
      kind: "toggle",
      scope: "share_with_clinic",
    });
    expect(matrixCell("share_overlap_with_partner", "me")).toEqual({ kind: "empty" });
    expect(matrixCell("share_with_clinic", "partner")).toEqual({ kind: "empty" });
    for (const party of MATRIX_PARTIES) {
      expect(matrixCell("research_aggregate", party)).toEqual({ kind: "open_question" });
    }
  });

  it("revokes optimistically and rolls the matrix back when the request fails", async () => {
    await enter("P1");
    let granted = true;
    const seen: boolean[] = [];
    server.use(
      http.post("*/api/v1/consents", () =>
        HttpResponse.json(
          {
            error: {
              code: "consent_failed",
              message_key: "consentFailed",
              request_id: "req-rollback",
            },
          },
          { status: 500 },
        ),
      ),
    );

    await expect(
      commitConsentChange({
        previous: true,
        next: false,
        apply: (value) => {
          granted = value;
          seen.push(value);
        },
        request: async () => {
          expect(granted).toBe(false);
          await postConsent({ scope: "share_overlap_with_partner", granted: false });
        },
      }),
    ).rejects.toBeInstanceOf(ApiRequestError);

    expect(seen).toEqual([false, true]);
    expect(granted).toBe(true);
    const mine = await fetchMineConsents();
    expect(mine?.find((row) => row.scope === "share_overlap_with_partner")?.granted).toBe(true);
  });

  it("keeps the revoked value when the consent request succeeds", async () => {
    await enter("P1");
    const seen: boolean[] = [];
    await commitConsentChange({
      previous: true,
      next: false,
      apply: (value) => {
        seen.push(value);
      },
      request: async () => {
        expect(seen).toEqual([false]);
        await postConsent({ scope: "share_overlap_with_partner", granted: false });
      },
    });
    expect(seen).toEqual([false]);
    const mine = await fetchMineConsents();
    expect(mine?.find((row) => row.scope === "share_overlap_with_partner")?.granted).toBe(false);
  });
});
