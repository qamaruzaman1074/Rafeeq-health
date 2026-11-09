/** Stable pathway ids for navigation and future API-backed choice education. */
export const INFORMED_CHOICE_PATHWAY_IDS = [
  "screening",
  "assessment",
  "counselling",
  "take-time",
] as const;

export type InformedChoicePathwayId = (typeof INFORMED_CHOICE_PATHWAY_IDS)[number];

export const REFLECTION_QUESTION_IDS = [
  "understand",
  "unclear",
  "conversation",
  "ask",
  "sharing",
] as const;

export type ReflectionQuestionId = (typeof REFLECTION_QUESTION_IDS)[number];

export type InformedChoicePathwayContent = {
  id: InformedChoicePathwayId;
  title: string;
  lead: string;
  image: string;
  bullets: readonly string[];
};

export type InformedChoicesEducationPayload = {
  version: string;
  reviewStatus: "draft" | "pending_review" | "clinician_reviewed";
  pathways: InformedChoicePathwayContent[];
};
