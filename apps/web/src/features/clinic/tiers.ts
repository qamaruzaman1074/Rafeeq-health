/** MASTER Section 5 `referrals.tier`. Neutral enum names, not a risk label. */
export const TIERS = [
  "T1_info",
  "T2_counsel_routine",
  "T3_counsel_priority",
  "T4_urgent_human",
] as const;

export type Tier = (typeof TIERS)[number];

export function isTier(value: string): value is Tier {
  return (TIERS as readonly string[]).includes(value);
}
