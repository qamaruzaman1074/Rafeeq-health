/** Frontend-only referral preparation payload (not submitted to API). */
export type ReferralPreviewDraft = {
  reason: string;
  topic: string;
  communication: "video" | "phone" | "in_person" | "unsure";
  language: "en" | "ar" | "other";
  questions: string;
  consentPreviewAcknowledged: boolean;
};

export const EMPTY_REFERRAL_PREVIEW: ReferralPreviewDraft = {
  reason: "",
  topic: "",
  communication: "unsure",
  language: "en",
  questions: "",
  consentPreviewAcknowledged: false,
};
