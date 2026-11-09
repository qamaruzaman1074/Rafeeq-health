import type { KnowledgeEntry } from "./types";

export const websiteHelpEntries: KnowledgeEntry[] = [
  {
    id: "what-is-rafeeq",
    title: "What Rafeeq is",
    category: "website-help",
    keywords: ["rafeeq", "platform", "educational", "decision support"],
    questionPatterns: [
      "what is rafeeq",
      "what does rafeeq do",
      "who can use rafeeq",
    ],
    answer:
      "Rafeeq is an educational and decision-support platform that helps people understand inherited disease risk, explore screening information, and find pathways to genetic counselling. Individuals and couples who want to understand inherited conditions, screening concepts, and possible next steps can use Rafeeq. Rafeeq is not a genetic testing laboratory.",
    sourceTitle: "FAQ — general",
    sourceUrl: "/faq",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["how-to-use-rafeeq", "rafeeq-not-treatment", "what-is-counselling"],
  },
  {
    id: "how-to-use-rafeeq",
    title: "How to use Rafeeq",
    category: "website-help",
    keywords: ["how to use", "navigate", "demo", "modules", "get started"],
    questionPatterns: [
      "how do i use rafeeq",
      "how to use rafeeq",
      "where should i start",
    ],
    answer:
      "Start with How it works for an overview, then explore Understanding genetic risk, Screening pathways, Genetic counselling, Informed choices, Privacy policy, and FAQ. Signed-in demo areas such as Learn, Check, Ask, Care, and Privacy show educational workflows with example data. This assistant answers from approved website education only—it does not interpret your personal genetic results.",
    sourceTitle: "How it works",
    sourceUrl: "/how-it-works",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["what-is-rafeeq", "privacy-overview", "care-pathways-overview"],
  },
  {
    id: "privacy-overview",
    title: "Privacy on Rafeeq",
    category: "website-help",
    keywords: ["privacy", "policy", "data", "security"],
    questionPatterns: [
      "how does rafeeq handle privacy",
      "where is the privacy policy",
      "is my genetic information private",
    ],
    answer:
      "Rafeeq recognises that genetic and family health information is personal. The privacy policy explains intended use, consent and sharing, access, and related topics. In demos, session data stays in your browser with example profiles. Do not enter another person's sensitive information without appropriate permission.",
    sourceTitle: "Privacy policy",
    sourceUrl: "/privacy-policy",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["informed-consent", "control-sharing", "partner-privacy"],
  },
  {
    id: "assistant-scope-draft",
    title: "Personal result interpretation (excluded draft)",
    category: "website-help",
    keywords: ["my result", "interpret my genotype", "personal report"],
    questionPatterns: ["interpret my personal genetic result"],
    answer:
      "Draft placeholder — personal report interpretation is out of scope for the public assistant.",
    sourceTitle: "Ask (signed-in)",
    sourceUrl: "/app/ask",
    language: "en",
    reviewStatus: "draft",
  },
];
