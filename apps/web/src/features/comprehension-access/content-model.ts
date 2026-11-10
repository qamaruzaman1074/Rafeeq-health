/** Educational comprehension topic ids (not clinical assessment). */
export const COMPREHENSION_TOPIC_IDS = [
  "carrier",
  "inheritance",
  "risk_diagnosis",
  "screening_limits",
  "counselling",
  "privacy",
] as const;

export type ComprehensionTopicId = (typeof COMPREHENSION_TOPIC_IDS)[number];

export type McqOption = {
  id: string;
  labelKey: string;
};

export type ComprehensionQuestion = {
  topicId: ComprehensionTopicId;
  questionKey: string;
  optionKeys: readonly McqOption[];
  correctOptionId: string;
  explanationKey: string;
};

export type ComprehensionAssessmentResult = {
  topicId: ComprehensionTopicId;
  selectedOptionId: string;
  correct: boolean;
  synthetic: true;
};

export type LearningJourneyStepId =
  | "understand"
  | "learn"
  | "check"
  | "review"
  | "explore";

export type LearningProgressSnapshot = {
  topicsVisited: ComprehensionTopicId[];
  checksCompleted: ComprehensionTopicId[];
  topicsToReview: ComprehensionTopicId[];
  demoState: true;
};

export type ReferralAnalyticsMetric = {
  id: string;
  integrationStatus: "awaiting_backend";
};

export type LanguageMetric = {
  locale: "en" | "ar";
  integrationStatus: "awaiting_backend";
};

export type AccessibilityFeedbackMetric = {
  id: string;
  integrationStatus: "awaiting_backend";
};

export type PrivacyMetric = {
  id: string;
  integrationStatus: "awaiting_backend";
};

export type PlatformImpactPayload = {
  version: string;
  learning: ReferralAnalyticsMetric[];
  comprehension: ReferralAnalyticsMetric[];
  counselling: ReferralAnalyticsMetric[];
  equity: LanguageMetric[];
  privacy: PrivacyMetric[];
};
