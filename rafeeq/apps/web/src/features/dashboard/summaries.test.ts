import { describe, expect, it } from "vitest";
import { LEARN_MODULES } from "@/features/learn/modules";
import {
  availableLearnTopicCount,
  counsellingStatus,
  listedConditionName,
  mineGrant,
  partnerShareStatus,
  resultStatus,
} from "@/features/dashboard/summaries";
import type { CouplePathway } from "@/features/care/types";
import type { MineConsent } from "@/features/privacy/types";
import type { OwnResult } from "@/features/result/types";

const ownListed: OwnResult = {
  banner: { block_id: "OPEN_QUESTION", text: null },
  carriers: [
    {
      id: "P1-shared",
      gene_symbol: null,
      gene_block_id: "OPEN_QUESTION",
      condition_name: "hearing-loss example",
      condition_locale: "en",
      condition_block_id: "OPEN_QUESTION",
    },
  ],
};

describe("dashboard summaries", () => {
  it("maps own-result payloads without inventing entries", () => {
    expect(resultStatus(undefined)).toBe("empty");
    expect(resultStatus(null)).toBe("empty");
    expect(resultStatus({ banner: { block_id: "OPEN_QUESTION", text: null }, carriers: [] })).toBe(
      "none",
    );
    expect(resultStatus(ownListed)).toBe("listed");
    expect(listedConditionName(ownListed)).toBe("hearing-loss example");
    expect(listedConditionName({ banner: ownListed.banner, carriers: [] })).toBeNull();
  });

  it("counts learn modules already defined in the app", () => {
    expect(availableLearnTopicCount()).toBe(LEARN_MODULES.length);
    expect(availableLearnTopicCount()).toBe(7);
  });

  it("reads partner overlap and mine grants from consent rows", () => {
    expect(partnerShareStatus(undefined)).toBe("empty");
    expect(partnerShareStatus(null)).toBe("empty");
    expect(partnerShareStatus([])).toBe("missing");
    expect(
      partnerShareStatus([{ partner: "b", scope: "share_overlap_with_partner", granted: false }]),
    ).toBe("declined");
    expect(
      partnerShareStatus([
        { partner: "a", scope: "share_overlap_with_partner", granted: true },
        { partner: "b", scope: "share_overlap_with_partner", granted: true },
      ]),
    ).toBe("allowed");

    const mine: MineConsent[] = [
      {
        id: "consent-view",
        scope: "view_own",
        granted: true,
        version: 1,
        created_at: "2026-11-08T11:00:00.000Z",
      },
      {
        id: "consent-clinic",
        scope: "share_with_clinic",
        granted: false,
        version: 1,
        created_at: "2026-11-08T11:00:00.000Z",
      },
    ];
    expect(mineGrant(null, "share_with_clinic")).toBeNull();
    expect(mineGrant(mine, "share_with_clinic")).toBe(false);
    expect(mineGrant(mine, "view_own")).toBe(true);
    expect(mineGrant(mine, "research_aggregate")).toBeNull();
  });

  it("keeps counselling status on the pathway fields the couple client already stores", () => {
    expect(counsellingStatus(undefined)).toEqual({ current: null, referral: null });
    expect(counsellingStatus(null)).toEqual({ current: null, referral: null });
    const pathway: CouplePathway = {
      current_step: "result_received",
      steps: [
        { id: "result_received", reached: true },
        { id: "counselling", reached: false },
        { id: "confirmatory_assessment", reached: false },
        { id: "specialised_services", reached: false },
        { id: "follow_up", reached: false },
      ],
      status: null,
    };
    expect(counsellingStatus(pathway)).toEqual({
      current: "result_received",
      referral: null,
    });
  });
});
