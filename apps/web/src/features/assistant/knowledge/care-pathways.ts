import type { KnowledgeEntry } from "./types";

export const carePathwaysEntries: KnowledgeEntry[] = [
  {
    id: "care-pathways-overview",
    title: "Educational care and screening pathways",
    category: "care-pathways",
    keywords: ["pathway", "next steps", "care", "referral", "specialist"],
    questionPatterns: [
      "what are screening pathways",
      "what are my next steps after screening",
      "how do care pathways work on rafeeq",
    ],
    answer:
      "Rafeeq's screening pathways page outlines educational next steps such as learning about a finding, reviewing information with a qualified professional, asking about further assessment, and exploring specialist or counselling routes. Statuses shown in demos are educational previews only. Live appointment booking and provider directories depend on future organisational integrations.",
    sourceTitle: "Screening pathways",
    sourceUrl: "/screening-pathways",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["confirmatory-assessment", "genetic-counselling-when", "informed-choices"],
  },
  {
    id: "informed-choices",
    title: "Informed choices education",
    category: "care-pathways",
    keywords: ["informed choices", "decision", "options", "education"],
    questionPatterns: [
      "what is the informed choices page",
      "how does rafeeq support informed choices",
    ],
    answer:
      "Rafeeq includes an informed-choices education hub to help people explore questions and options in plain language. It is educational support, not a clinical recommendation engine. Complex decisions should be discussed with a qualified healthcare professional.",
    sourceTitle: "Informed choices",
    sourceUrl: "/informed-choices",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["what-is-counselling", "privacy-overview", "what-is-rafeeq"],
  },
];
