/**
 * Module titles are the planning Section 7 names, stored as i18n keys.
 * Body text is not written here. It is read from /content/blocks.{locale}.json.
 * OPEN_QUESTION: those files are empty and MASTER does not assign block ids.
 * The ids below are stable lookup keys, not approved sentences.
 */
export const LEARN_MODULES = [
  {
    id: "carrier",
    titleKey: "modules.carrier.title",
    termKey: "modules.carrier.term",
    glossaryTerm: "carrier",
    fullBlockId: "learn.carrier.full",
    shortBlockId: "learn.carrier.short",
  },
  {
    id: "couple-result",
    titleKey: "modules.coupleResult.title",
    termKey: "modules.coupleResult.term",
    glossaryTerm: "couple-result",
    fullBlockId: "learn.couple-result.full",
    shortBlockId: "learn.couple-result.short",
  },
  {
    id: "risk-vs-diagnosis",
    titleKey: "modules.riskVsDiagnosis.title",
    termKey: "modules.riskVsDiagnosis.term",
    glossaryTerm: "diagnosis",
    fullBlockId: "learn.risk-vs-diagnosis.full",
    shortBlockId: "learn.risk-vs-diagnosis.short",
  },
  {
    id: "uncertainty",
    titleKey: "modules.uncertainty.title",
    termKey: "modules.uncertainty.term",
    glossaryTerm: "uncertainty",
    fullBlockId: "learn.uncertainty.full",
    shortBlockId: "learn.uncertainty.short",
  },
  {
    id: "relatedness",
    titleKey: "modules.relatedness.title",
    termKey: "modules.relatedness.term",
    glossaryTerm: "relatedness",
    fullBlockId: "learn.relatedness.full",
    shortBlockId: "learn.relatedness.short",
  },
  {
    id: "options",
    titleKey: "modules.options.title",
    termKey: "modules.options.term",
    glossaryTerm: "options",
    fullBlockId: "learn.options.full",
    shortBlockId: "learn.options.short",
  },
  {
    id: "next",
    titleKey: "modules.next.title",
    termKey: "modules.next.term",
    glossaryTerm: "next",
    fullBlockId: "learn.next.full",
    shortBlockId: "learn.next.short",
  },
] as const;

export type LearnModule = (typeof LEARN_MODULES)[number];

export type LearnModuleId = LearnModule["id"];

export function glossaryBlockId(term: string): string {
  return `glossary.${term}`;
}
