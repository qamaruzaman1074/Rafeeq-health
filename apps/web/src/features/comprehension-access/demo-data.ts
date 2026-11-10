import type { ComprehensionQuestion } from "./content-model";

/**
 * Question structure only. Copy lives in i18n (`check.comprehension.topics.*`).
 * Not user measurements; not loaded from analytics APIs.
 */
export const EDUCATIONAL_QUESTIONS: readonly ComprehensionQuestion[] = [
  {
    topicId: "carrier",
    questionKey: "comprehension.topics.carrier.question",
    optionKeys: [
      { id: "a", labelKey: "comprehension.topics.carrier.options.a" },
      { id: "b", labelKey: "comprehension.topics.carrier.options.b" },
      { id: "c", labelKey: "comprehension.topics.carrier.options.c" },
    ],
    correctOptionId: "b",
    explanationKey: "comprehension.topics.carrier.explanation",
  },
  {
    topicId: "inheritance",
    questionKey: "comprehension.topics.inheritance.question",
    optionKeys: [
      { id: "a", labelKey: "comprehension.topics.inheritance.options.a" },
      { id: "b", labelKey: "comprehension.topics.inheritance.options.b" },
      { id: "c", labelKey: "comprehension.topics.inheritance.options.c" },
    ],
    correctOptionId: "a",
    explanationKey: "comprehension.topics.inheritance.explanation",
  },
  {
    topicId: "risk_diagnosis",
    questionKey: "comprehension.topics.risk_diagnosis.question",
    optionKeys: [
      { id: "a", labelKey: "comprehension.topics.risk_diagnosis.options.a" },
      { id: "b", labelKey: "comprehension.topics.risk_diagnosis.options.b" },
      { id: "c", labelKey: "comprehension.topics.risk_diagnosis.options.c" },
    ],
    correctOptionId: "c",
    explanationKey: "comprehension.topics.risk_diagnosis.explanation",
  },
  {
    topicId: "screening_limits",
    questionKey: "comprehension.topics.screening_limits.question",
    optionKeys: [
      { id: "a", labelKey: "comprehension.topics.screening_limits.options.a" },
      { id: "b", labelKey: "comprehension.topics.screening_limits.options.b" },
      { id: "c", labelKey: "comprehension.topics.screening_limits.options.c" },
    ],
    correctOptionId: "b",
    explanationKey: "comprehension.topics.screening_limits.explanation",
  },
  {
    topicId: "counselling",
    questionKey: "comprehension.topics.counselling.question",
    optionKeys: [
      { id: "a", labelKey: "comprehension.topics.counselling.options.a" },
      { id: "b", labelKey: "comprehension.topics.counselling.options.b" },
      { id: "c", labelKey: "comprehension.topics.counselling.options.c" },
    ],
    correctOptionId: "a",
    explanationKey: "comprehension.topics.counselling.explanation",
  },
  {
    topicId: "privacy",
    questionKey: "comprehension.topics.privacy.question",
    optionKeys: [
      { id: "a", labelKey: "comprehension.topics.privacy.options.a" },
      { id: "b", labelKey: "comprehension.topics.privacy.options.b" },
      { id: "c", labelKey: "comprehension.topics.privacy.options.c" },
    ],
    correctOptionId: "c",
    explanationKey: "comprehension.topics.privacy.explanation",
  },
] as const;

/** Illustrative engagement bars for dashboard preview only. */
export const SYNTHETIC_CHART_DEMO = [
  { labelKey: "insights.syntheticChart.bars.visit", value: 12 },
  { labelKey: "insights.syntheticChart.bars.check", value: 8 },
  { labelKey: "insights.syntheticChart.bars.review", value: 5 },
] as const;
