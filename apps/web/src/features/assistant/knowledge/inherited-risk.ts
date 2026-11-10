import type { KnowledgeEntry } from "./types";

export const inheritedRiskEntries: KnowledgeEntry[] = [
  {
    id: "inheritance-patterns",
    title: "How inherited conditions can be passed down",
    category: "inherited-risk",
    keywords: [
      "inheritance",
      "inherited",
      "passed down",
      "pattern",
      "autosomal",
      "recessive",
      "dominant",
      "x-linked",
    ],
    questionPatterns: [
      "how are inherited conditions passed down",
      "how genetic conditions can be inherited",
      "what are inheritance patterns",
    ],
    answer:
      "Inherited conditions follow different inheritance patterns, and risk depends on the specific condition and genetic findings. Common educational patterns include autosomal recessive (a child is generally affected only when they inherit a relevant variant in the same gene from each biological parent), autosomal dominant (one copy of a relevant variant can be enough to cause a condition), and X-linked (the relevant gene is on the X chromosome, so chance and effects can differ between male and female children). These patterns are educational examples. Real conditions vary; professional interpretation is needed for any personal result.",
    sourceTitle: "Understanding genetic risk — inheritance",
    sourceUrl: "/understanding-genetic-risk",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["autosomal-recessive-example", "both-parents-carriers", "risk-vs-diagnosis"],
  },
  {
    id: "autosomal-recessive-example",
    title: "Autosomal recessive inheritance (educational example)",
    category: "inherited-risk",
    keywords: ["autosomal recessive", "25%", "50%", "punnett", "both carry", "same gene"],
    questionPatterns: [
      "what is autosomal recessive inheritance",
      "what does autosomal recessive mean",
      "what happens when both parents carry the same gene",
    ],
    answer:
      "When both biological parents carry a relevant disease-causing variant in the same gene associated with an autosomal recessive condition, each pregnancy has an illustrative 25% chance of inheriting two relevant variants, a 50% chance of inheriting one, and a 25% chance of inheriting neither. This is an educational example only. It assumes a particular autosomal recessive pattern and specified parental findings. Actual risk depends on the condition, variants, testing methods, and clinical interpretation by a qualified professional.",
    sourceTitle: "Understanding genetic risk — example",
    sourceUrl: "/understanding-genetic-risk",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["both-parents-carriers", "risk-vs-diagnosis", "genetic-counselling-when"],
  },
  {
    id: "both-parents-carriers",
    title: "When both parents are carriers",
    category: "inherited-risk",
    keywords: ["both parents", "couple", "carriers", "overlap", "biological parents"],
    questionPatterns: [
      "what does it mean when both parents are carriers",
      "when both biological parents carry related variants",
      "what if we are both carriers",
    ],
    answer:
      "An individual screening result describes that person. To discuss possible implications for children, qualified professionals consider both biological parents' relevant findings, the specific gene and variants, the inheritance pattern, and clinical context. Rafeeq can help you learn the concepts; it does not replace professional interpretation of your own results.",
    sourceTitle: "Understanding genetic risk — couple-level risk",
    sourceUrl: "/understanding-genetic-risk",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["autosomal-recessive-example", "genetic-counselling-when", "screening-limitations"],
  },
  {
    id: "risk-vs-diagnosis",
    title: "Genetic risk versus diagnosis",
    category: "inherited-risk",
    keywords: ["risk", "diagnosis", "difference", "screening", "clinical assessment"],
    questionPatterns: [
      "what is the difference between genetic risk and diagnosis",
      "is screening a diagnosis",
      "is carrier screening a diagnosis",
      "can rafeeq diagnose genetic conditions",
    ],
    answer:
      "A calculated or estimated risk is not the same as a diagnosis. Genetic risk may indicate an increased possibility of an inherited condition; it does not necessarily establish that a person or future child has that condition. A diagnosis requires appropriate clinical assessment and interpretation of relevant evidence by qualified healthcare professionals. Rafeeq provides educational explanations and decision support. It does not diagnose genetic conditions.",
    sourceTitle: "Understanding genetic risk — risk vs diagnosis",
    sourceUrl: "/understanding-genetic-risk",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["screening-limitations", "confirmatory-assessment", "genetic-counselling-when"],
  },
  {
    id: "family-relationships",
    title: "Family relationships and inherited risk",
    category: "inherited-risk",
    keywords: ["family", "relatives", "consanguinity", "related", "ancestors"],
    questionPatterns: [
      "does consanguineous marriage mean a child will have an inherited condition",
      "do family relationships increase inherited risk",
    ],
    answer:
      "Biological relatives may have a higher chance of sharing certain inherited variants because they have common ancestors. However, a family relationship alone does not establish that a child will inherit a particular condition. A biological relationship between partners does not establish that a child will have a particular inherited condition. Appropriate screening and professional interpretation can help clarify relevant risks.",
    sourceTitle: "FAQ — genetic information",
    sourceUrl: "/faq",
    language: "en",
    reviewStatus: "approved",
    followUpIds: ["inheritance-patterns", "genetic-counselling-when", "what-is-screening"],
  },
];
