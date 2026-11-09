import { carrierStatusEntries } from "./carrier-status";
import { carePathwaysEntries } from "./care-pathways";
import { geneticCounsellingEntries } from "./genetic-counselling";
import { inheritedRiskEntries } from "./inherited-risk";
import { privacyEntries } from "./privacy";
import { screeningEntries } from "./screening";
import type { KnowledgeEntry } from "./types";
import { websiteHelpEntries } from "./website-help";

export type { KnowledgeEntry, GeneratedAnswer, KnowledgeSourceRef } from "./types";

const ALL_ENTRIES: KnowledgeEntry[] = [
  ...carrierStatusEntries,
  ...inheritedRiskEntries,
  ...screeningEntries,
  ...geneticCounsellingEntries,
  ...privacyEntries,
  ...carePathwaysEntries,
  ...websiteHelpEntries,
];

export function allKnowledgeEntries(): KnowledgeEntry[] {
  return ALL_ENTRIES;
}

export function approvedKnowledgeEntries(language: KnowledgeEntry["language"] = "en"): KnowledgeEntry[] {
  return ALL_ENTRIES.filter(
    (entry) => entry.reviewStatus === "approved" && entry.language === language,
  );
}

export function getKnowledgeEntryById(id: string): KnowledgeEntry | undefined {
  return ALL_ENTRIES.find((entry) => entry.id === id);
}
