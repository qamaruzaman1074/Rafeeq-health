import type { KnowledgeEntry } from "./types";

export const geneticCounsellingEntries: KnowledgeEntry[] = [
  {
    id: "what-is-counselling",
    title: "What genetic counselling is",
    category: "genetic-counselling",
    keywords: ["counselling", "counseling", "counsellor", "counselor", "genetic counsellor"],
    questionPatterns: [
      "what is genetic counselling",
      "what is genetic counseling",
      "what does a genetic counsellor do",
    ],
    answer:
      "Genetic information can raise personal and complex questions. A qualified genetic counsellor can help explain results, discuss inheritance patterns, explore family history, and consider available options. Rafeeq encourages appropriate professional guidance rather than replacing it. Rafeeq does not establish a clinician–patient relationship.",
    sourceTitle: "Genetic counselling",
    sourceUrl: "/genetic-counselling",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["genetic-counselling-when", "prepare-counselling", "rafeeq-not-treatment"],
  },
  {
    id: "genetic-counselling-when",
    title: "When to seek professional guidance",
    category: "genetic-counselling",
    keywords: ["professional guidance", "speak to", "counsellor", "complex findings"],
    questionPatterns: [
      "when should someone seek professional guidance",
      "when should i speak to a genetics professional",
      "when can genetic counselling help",
    ],
    answer:
      "Professional guidance may be important when findings are complex, inconclusive, potentially high-impact, or require clinical interpretation. A genetic counsellor or clinician can place findings in context for you and your family.",
    sourceTitle: "FAQ — counselling and next steps",
    sourceUrl: "/faq",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["prepare-counselling", "confirmatory-assessment", "what-is-counselling"],
  },
  {
    id: "prepare-counselling",
    title: "Preparing for a counselling appointment",
    category: "genetic-counselling",
    keywords: ["prepare", "appointment", "questions", "bring", "family history"],
    questionPatterns: [
      "how can i prepare for a counselling appointment",
      "how to prepare for genetic counselling",
      "what should i bring to counselling",
    ],
    answer:
      "People often prepare by writing questions in advance, gathering available screening reports, noting family history that feels relevant, and bringing a support person if that helps. On Rafeeq you can explore educational pages about carrier status, inheritance, screening pathways, and privacy before an appointment. Personal medical decisions should still be discussed with the counsellor or clinician.",
    sourceTitle: "Genetic counselling",
    sourceUrl: "/genetic-counselling",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["what-is-counselling", "informed-consent", "care-pathways-overview"],
  },
  {
    id: "rafeeq-not-treatment",
    title: "What Rafeeq does not provide",
    category: "genetic-counselling",
    keywords: ["marriage", "treatment", "recommend", "reproductive", "advice"],
    questionPatterns: [
      "does rafeeq recommend whether people should marry",
      "does rafeeq provide reproductive treatment",
      "does rafeeq replace counselling",
    ],
    answer:
      "Rafeeq does not recommend or discourage marriage. It supports understanding, personal autonomy, and informed decision-making. It can provide educational information about pathways and options, but it does not provide treatment or replace professional care.",
    sourceTitle: "FAQ — counselling and next steps",
    sourceUrl: "/faq",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["what-is-counselling", "genetic-counselling-when", "what-is-rafeeq"],
  },
];
