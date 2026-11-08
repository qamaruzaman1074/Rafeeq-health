import { describe, expect, it } from "vitest";
import { shareGate, type ConsentRow } from "@/features/couple/share-state";

const granted = (partner: "a" | "b"): ConsentRow => ({
  partner,
  scope: "share_overlap_with_partner",
  granted: true,
});

describe("share gate", () => {
  it("stays empty when no consent payload was returned", () => {
    expect(shareGate(null)).toBe("empty");
  });

  it("stays closed when the overlap grant is missing", () => {
    expect(shareGate([])).toBe("missing");
    expect(shareGate([granted("a")])).toBe("missing");
  });

  it("hides the overlap when either partner declined", () => {
    expect(
      shareGate([
        granted("a"),
        { partner: "b", scope: "share_overlap_with_partner", granted: false },
      ]),
    ).toBe("declined");
    expect(shareGate([{ partner: "b", scope: "share_overlap_with_partner", granted: false }])).toBe(
      "declined",
    );
  });

  it("opens only when both partners granted overlap sharing", () => {
    expect(shareGate([granted("a"), granted("b")])).toBe("allowed");
  });
});
