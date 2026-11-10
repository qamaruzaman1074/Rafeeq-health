import type { KnowledgeEntry } from "./types";

export const screeningEntries: KnowledgeEntry[] = [
  {
    id: "what-is-screening",
    title: "What genetic screening is",
    category: "screening",
    keywords: ["screening", "genetic screening", "panel", "test", "carrier screening"],
    questionPatterns: [
      "what is genetic screening",
      "what is carrier screening",
      "what does screening mean",
    ],
    answer:
      "Genetic screening looks for selected genetic findings that may be relevant to inherited conditions. Rafeeq helps people understand screening concepts and educational pathways. Rafeeq is not a genetic testing laboratory and does not perform laboratory genetic testing. Screening can identify findings that may need further assessment, but it cannot always establish whether a person or future child has a condition.",
    sourceTitle: "Screening pathways",
    sourceUrl: "/screening-pathways",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["screening-can-tell", "screening-limitations", "risk-vs-diagnosis"],
  },
  {
    id: "screening-can-tell",
    title: "What a screening result can tell you",
    category: "screening",
    keywords: ["screening result", "findings", "report", "panel result"],
    questionPatterns: [
      "what can a screening result tell me",
      "what does a screening result mean",
      "what usually happens after a screening result",
    ],
    answer:
      "A screening result describes findings from the test that was done. It may identify carrier status or other selected variants, or it may be reported as negative for the variants the panel looked for. Results reflect the test that was done, not every possible genetic change. After a result, people often learn about the finding, review information with a qualified professional, and ask about further assessment when appropriate.",
    sourceTitle: "Screening pathways",
    sourceUrl: "/screening-pathways",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["screening-limitations", "confirmatory-assessment", "genetic-counselling-when"],
  },
  {
    id: "screening-limitations",
    title: "Limitations of screening",
    category: "screening",
    keywords: ["limitations", "residual risk", "negative", "vus", "uncertain", "panel"],
    questionPatterns: [
      "what are the limitations of screening",
      "what if my result is uncertain",
      "does negative screening mean no risk",
    ],
    answer:
      "Screening panels do not cover every gene or variant. Methods differ in what they detect. A negative screening result may not detect every possible variant, so some risk can remain depending on the test, the condition, and family history. Sometimes a variant of uncertain significance (VUS) is reported whose clinical meaning is not yet clear; a VUS is not the same as a known disease-causing finding. The size of residual risk is condition-specific and should be explained by a qualified professional—not generalized here.",
    sourceTitle: "Understanding genetic risk — uncertainty",
    sourceUrl: "/understanding-genetic-risk",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["confirmatory-assessment", "genetic-counselling-when", "risk-vs-diagnosis"],
  },
  {
    id: "confirmatory-assessment",
    title: "Confirmatory assessment information",
    category: "screening",
    keywords: ["confirmatory", "further testing", "specialist", "assessment", "follow-up"],
    questionPatterns: [
      "what is confirmatory assessment",
      "why might confirmatory testing be needed",
      "what happens after screening",
    ],
    answer:
      "Some findings benefit from confirmatory testing, specialist review, or genetic counselling before anyone draws conclusions about health or reproductive planning. Rafeeq can point you to educational pathways and counselling information. It does not order tests or replace clinical assessment.",
    sourceTitle: "Screening pathways",
    sourceUrl: "/screening-pathways",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["genetic-counselling-when", "prepare-counselling", "care-pathways-overview"],
  },
];
