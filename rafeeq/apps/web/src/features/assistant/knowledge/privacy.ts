import type { KnowledgeEntry } from "./types";

export const privacyEntries: KnowledgeEntry[] = [
  {
    id: "informed-consent",
    title: "What informed consent means",
    category: "privacy",
    keywords: ["consent", "informed", "permission", "sharing", "understand"],
    questionPatterns: [
      "what does informed consent mean",
      "what is informed consent",
      "what should i know before sharing",
    ],
    answer:
      "Genetic information may reveal details relevant to biological relatives as well as the person tested. Sharing should therefore be carefully considered. Users should understand what information is being shared, with whom, and for what purpose before using a sharing feature. Informed consent means making that choice with clear information—not giving blanket access by default.",
    sourceTitle: "Privacy policy — consent and sharing",
    sourceUrl: "/privacy-policy",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["control-sharing", "partner-privacy", "revoke-sharing"],
  },
  {
    id: "control-sharing",
    title: "Controlling information sharing",
    category: "privacy",
    keywords: ["control", "share", "sharing", "permission", "privacy", "family"],
    questionPatterns: [
      "how can i control information sharing",
      "who can see my results",
      "can my family access my information",
    ],
    answer:
      "Personal results are private by default. Sharing requires your explicit permission. Family members do not receive access automatically. Access depends on user roles, permissions, and the features in use. Being a partner, family member, or healthcare professional does not by itself give someone access to another person's results.",
    sourceTitle: "FAQ — partner and family privacy",
    sourceUrl: "/faq",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["partner-privacy", "revoke-sharing", "informed-consent"],
  },
  {
    id: "partner-privacy",
    title: "Partner access to results",
    category: "privacy",
    keywords: ["partner", "couple", "see", "results", "automatic"],
    questionPatterns: [
      "can my partner automatically see my screening results",
      "does my partner see my results",
      "who can see my overlap result",
    ],
    answer:
      "No. Personal results are private by default. Sharing requires your explicit permission. In couple privacy screens, separate sharing scopes are modelled (for example overlap with a partner, or sharing with a clinic).",
    sourceTitle: "FAQ — partner and family privacy",
    sourceUrl: "/faq",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["revoke-sharing", "informed-consent", "control-sharing"],
  },
  {
    id: "revoke-sharing",
    title: "Revoking sharing permission",
    category: "privacy",
    keywords: ["revoke", "withdraw", "stop sharing", "permission"],
    questionPatterns: [
      "can i revoke sharing permission",
      "can i stop sharing my results",
      "how do i withdraw consent",
    ],
    answer:
      "Yes. You can revoke future access to information you previously chose to share. Revoking cannot undo information that has already been viewed or independently kept by the other person.",
    sourceTitle: "FAQ — partner and family privacy",
    sourceUrl: "/faq",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["control-sharing", "informed-consent", "partner-privacy"],
  },
];
