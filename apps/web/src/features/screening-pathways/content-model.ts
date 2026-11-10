/** Education pathway step ids (anchors + future API). */
export const SCREENING_PATHWAY_STEP_IDS = [
  "screening",
  "understand",
  "discuss",
  "assessment",
  "specialist",
] as const;

export type ScreeningPathwayStepId = (typeof SCREENING_PATHWAY_STEP_IDS)[number];

export const REFERRAL_JOURNEY_STAGE_IDS = [
  "information",
  "counselling",
  "assessment",
  "specialist",
] as const;

export type ReferralJourneyStageId = (typeof REFERRAL_JOURNEY_STAGE_IDS)[number];

export type ReferralStageStatus =
  | "example"
  | "not_connected"
  | "awaiting_backend";

/** Referral tracker status labels (education preview; not live referral state). */
export type ReferralStatus = ReferralStageStatus;

/** Future screening record payload (not loaded in this build). */
export type ScreeningRecordPreview = {
  id: string;
  testType: string;
  recordedAt: string | null;
  synthetic: true;
};

export type ReferralStageRecord = {
  id: ReferralJourneyStageId;
  status: ReferralStageStatus;
};

export type ProviderDirectoryEntry = {
  id: string;
  serviceType: string;
  integrationStatus: "pending";
};

/** Confirmatory / follow-up education block (content-only until CMS/API). */
export type AssessmentInformation = {
  topicId: string;
  titleKey: string;
  synthetic: true;
};

export type ScreeningPathwaysPayload = {
  version: string;
  pathwaySteps: ScreeningPathwayStepId[];
  referralStages: ReferralStageRecord[];
  providers: ProviderDirectoryEntry[];
};
