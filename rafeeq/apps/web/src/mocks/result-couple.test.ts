import { describe, expect, it } from "vitest";
import { ApiRequestError, apiRequest } from "@/lib/api";
import { resetActivePersona } from "@/mocks/persona-state";

async function enter(personaId: string): Promise<void> {
  resetActivePersona();
  await apiRequest("/api/v1/auth/guest", {
    method: "POST",
    body: JSON.stringify({ persona_id: personaId }),
  });
}

describe("result and couple mocks", () => {
  it("returns no persona payload before a guest session", async () => {
    resetActivePersona();
    const result = await apiRequest<null>("/api/v1/results/mine");
    expect(result.data).toBeNull();
    const overlap = await apiRequest<null>("/api/v1/results/overlap");
    expect(overlap.data).toBeNull();
    const consents = await apiRequest<null>("/api/v1/consents");
    expect(consents.data).toBeNull();
    const explain = await apiRequest<null>("/api/v1/explain/overlap", { method: "POST" });
    expect(explain.data).toBeNull();
  });

  it("returns P1 own result, shared overlap, and the kernel fact card", async () => {
    await enter("P1");
    const own = await apiRequest<{
      banner: { block_id: string; text: string | null };
      carriers: { gene_symbol: string | null; condition_name: string | null }[];
    }>("/api/v1/results/mine");
    expect(own.data.banner).toEqual({ block_id: "OPEN_QUESTION", text: null });
    expect(own.data.carriers).toEqual([
      {
        id: "P1-shared",
        gene_symbol: null,
        gene_block_id: "OPEN_QUESTION",
        condition_name: "hearing-loss example",
        condition_locale: "en",
        condition_block_id: "OPEN_QUESTION",
      },
    ]);

    const consents = await apiRequest<{ partner: string; granted: boolean }[]>("/api/v1/consents");
    expect(consents.data).toEqual([
      { partner: "a", scope: "share_overlap_with_partner", granted: true },
      { partner: "b", scope: "share_overlap_with_partner", granted: true },
    ]);

    const overlap = await apiRequest<{ hidden: boolean; genes: unknown[] }>(
      "/api/v1/results/overlap",
    );
    expect(overlap.data.hidden).toBe(false);
    expect(overlap.data.genes).toHaveLength(1);

    const explained = await apiRequest<{
      fact_card: {
        proportions: { affected: number; carrier: number; neither: number };
        formula: string;
        sentences: { locale: string; text: string | null }[];
        diagnosis_banner: { locale: string; text: string | null }[];
      };
    }>("/api/v1/explain/overlap", { method: "POST" });
    const card = explained.data.fact_card;
    expect(card.proportions).toEqual({ affected: 25, carrier: 50, neither: 25 });
    expect(card.proportions.affected + card.proportions.carrier + card.proportions.neither).toBe(
      100,
    );
    expect(card.formula).toContain("1/4");
    expect(card.formula).toContain("1/2");
    expect(card.sentences).toContainEqual({
      block_id: "OPEN_QUESTION",
      locale: "en",
      text: "This is a chance for each pregnancy, not a prediction about any child.",
    });
    expect(card.sentences).toContainEqual({
      block_id: "OPEN_QUESTION",
      locale: "ar",
      text: null,
    });
    expect(card.diagnosis_banner).toContainEqual({
      block_id: "OPEN_QUESTION",
      locale: "en",
      text: "This is not a diagnosis.",
    });
  });

  it("hides P5 overlap and does not return the partner's genes", async () => {
    await enter("P5");
    const own = await apiRequest<{ carriers: unknown[] }>("/api/v1/results/mine");
    expect(own.data.carriers).toEqual([]);
    const consents = await apiRequest<{ partner: string; granted: boolean }[]>("/api/v1/consents");
    expect(consents.data).toEqual([
      { partner: "b", scope: "share_overlap_with_partner", granted: false },
    ]);
    const overlap = await apiRequest<{ hidden: boolean; reason: string; genes: unknown[] }>(
      "/api/v1/results/overlap",
    );
    expect(overlap.data).toEqual({
      hidden: true,
      reason: "sharing_declined",
      genes: [],
    });
    expect(JSON.stringify(overlap.data)).not.toContain("hearing-loss");
    await expect(apiRequest("/api/v1/explain/overlap", { method: "POST" })).rejects.toMatchObject({
      name: "ApiRequestError",
      status: 403,
      messageKey: "sharingDeclined",
    });
    await expect(apiRequest("/api/v1/explain/overlap", { method: "POST" })).rejects.toBeInstanceOf(
      ApiRequestError,
    );
  });

  it("keeps other personas empty", async () => {
    for (const personaId of ["P2", "P3", "P4", "P6", "P7"]) {
      await enter(personaId);
      const own = await apiRequest<{ carriers: unknown[] }>("/api/v1/results/mine");
      expect(own.data.carriers, personaId).toEqual([]);
      const overlap = await apiRequest<{ hidden: boolean; genes: unknown[] }>(
        "/api/v1/results/overlap",
      );
      expect(overlap.data.hidden, personaId).toBe(true);
      expect(overlap.data.genes, personaId).toEqual([]);
      await expect(apiRequest("/api/v1/explain/overlap", { method: "POST" })).rejects.toMatchObject(
        {
          messageKey: "consentMissing",
        },
      );
    }
  });
});
