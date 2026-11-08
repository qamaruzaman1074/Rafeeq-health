/**
 * Pathway step ids follow website planning Section 7.
 * Referral statuses are the MASTER Section 5 enum.
 *
 * OPEN_QUESTION: planning does not name the consent scope for
 * "send my questions". MASTER Section 8 says the clinic sees only what is
 * shared with `share_with_clinic`. The send control uses that scope.
 */
export const PATHWAY_STEP_IDS = [
  "result_received",
  "counselling",
  "confirmatory_assessment",
  "specialised_services",
  "follow_up",
] as const;

export type PathwayStepId = (typeof PATHWAY_STEP_IDS)[number];

export const REFERRAL_STATUSES = [
  "created",
  "sent",
  "booked",
  "attended",
  "confirmatory_ordered",
  "closed",
] as const;

export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

export const SEND_SCOPE = "share_with_clinic" as const;

export const CARE_BLOCKS = {
  confirmatory_assessment: "care.confirmatory-assessment",
  specialised_services: "care.specialised-reproductive-genomics",
} as const;

export type InfoCardId = keyof typeof CARE_BLOCKS;

export const INFO_CARD_IDS = ["confirmatory_assessment", "specialised_services"] as const;

export function clinicShareGranted(
  rows: readonly { scope: string; granted: boolean }[] | null,
): boolean {
  if (rows === null) {
    return false;
  }
  return rows.some((row) => row.scope === SEND_SCOPE && row.granted);
}
