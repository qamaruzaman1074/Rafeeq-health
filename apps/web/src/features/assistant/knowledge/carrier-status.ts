import type { KnowledgeEntry } from "./types";

/** Educational copy aligned with public FAQ and Understanding Genetic Risk pages. */
export const carrierStatusEntries: KnowledgeEntry[] = [
  {
    id: "carrier-status-meaning",
    title: "What carrier status means",
    category: "carrier-status",
    keywords: ["carrier", "status", "variant", "recessive", "healthy", "symptoms"],
    questionPatterns: [
      "what does carrier status mean",
      "what does it mean to be a carrier",
      "what is a carrier",
      "can a carrier be healthy",
    ],
    answer:
      "A carrier has a genetic variant associated with a particular inherited condition. For many recessive conditions, carriers do not have the condition themselves. Being a carrier does not automatically mean that you have the condition, that you are unwell, or that your future children will have an inherited condition.",
    sourceTitle: "Understanding genetic risk — carrier status",
    sourceUrl: "/understanding-genetic-risk",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["inheritance-patterns", "both-parents-carriers", "risk-vs-diagnosis"],
  },
  {
    id: "carrier-child-outcome",
    title: "Carrier status and children",
    category: "carrier-status",
    keywords: ["carrier", "child", "children", "pregnancy", "future", "both parents"],
    questionPatterns: [
      "does being a carrier mean my child will have the condition",
      "can carriers have children with the condition",
      "does one carrier result mean a child will have an inherited condition",
    ],
    answer:
      "No. A carrier finding alone does not establish that a future child will have an inherited condition. Risk depends on the relevant findings from both biological parents, the gene, variants, and inheritance pattern. One parent's carrier result alone does not establish risk for a child.",
    sourceTitle: "FAQ — genetic information",
    sourceUrl: "/faq",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["both-parents-carriers", "genetic-counselling-when", "screening-limitations"],
  },
  {
    id: "carriers-symptoms",
    title: "Can carriers have symptoms?",
    category: "carrier-status",
    keywords: ["carrier", "symptoms", "healthy", "ill", "well"],
    questionPatterns: [
      "can carriers have symptoms",
      "are carriers healthy",
      "do carriers get sick",
    ],
    answer:
      "Many carriers are healthy. Carrier screening identifies variants that can be passed on; it does not establish that you are unwell. Being a carrier does not automatically mean that a person is ill.",
    sourceTitle: "Understanding genetic risk — carrier status",
    sourceUrl: "/understanding-genetic-risk",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["carrier-status-meaning", "risk-vs-diagnosis", "genetic-counselling-when"],
  },
];
