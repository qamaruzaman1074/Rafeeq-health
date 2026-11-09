import { describe, expect, it } from "vitest";
import { REFERRAL_JOURNEY_STAGE_IDS, SCREENING_PATHWAY_STEP_IDS } from "./content-model";

describe("screening pathways content model", () => {
  it("defines five pathway steps and four referral preview stages", () => {
    expect(SCREENING_PATHWAY_STEP_IDS).toHaveLength(5);
    expect(REFERRAL_JOURNEY_STAGE_IDS).toHaveLength(4);
  });
});
