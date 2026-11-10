import { describe, expect, it } from "vitest";
import { CONSENT_PROTOTYPE_ROW_IDS } from "@/features/privacy/consent-integration-model";

describe("consent integration model", () => {
  it("lists four prototype matrix categories", () => {
    expect(CONSENT_PROTOTYPE_ROW_IDS).toHaveLength(4);
  });
});
