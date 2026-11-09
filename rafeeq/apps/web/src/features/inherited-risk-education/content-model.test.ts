import { describe, expect, it } from "vitest";
import { INHERITED_RISK_SECTION_IDS } from "./content-model";

describe("inherited risk education content model", () => {
  it("defines six navigable sections", () => {
    expect(INHERITED_RISK_SECTION_IDS).toHaveLength(6);
    expect(INHERITED_RISK_SECTION_IDS).toContain("carrier-status");
    expect(INHERITED_RISK_SECTION_IDS).toContain("next-steps");
  });
});
