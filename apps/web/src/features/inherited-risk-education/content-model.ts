/** Stable section ids for navigation, anchors, and future API-backed education payloads. */
export const INHERITED_RISK_SECTION_IDS = [
  "carrier-status",
  "inheritance",
  "couple-risk",
  "risk-vs-diagnosis",
  "uncertainty",
  "next-steps",
] as const;

export type InheritedRiskSectionId = (typeof INHERITED_RISK_SECTION_IDS)[number];

export type InheritedRiskEducationCard = {
  id: string;
  title: string;
  body: string;
};

/** Shape for a future education API; today filled from i18n copy lists. */
export type InheritedRiskEducationPayload = {
  version: string;
  reviewStatus: "draft" | "pending_review" | "clinician_reviewed";
  sections: Record<
    InheritedRiskSectionId,
    {
      heading: string;
      lead?: string;
      cards?: InheritedRiskEducationCard[];
    }
  >;
};
