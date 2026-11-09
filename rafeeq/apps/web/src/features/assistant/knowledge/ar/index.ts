import { carePathwaysEntriesAr } from "./care-pathways";
import { carrierStatusEntriesAr } from "./carrier-status";
import { geneticCounsellingEntriesAr } from "./genetic-counselling";
import { inheritedRiskEntriesAr } from "./inherited-risk";
import { privacyEntriesAr } from "./privacy";
import { screeningEntriesAr } from "./screening";
import type { KnowledgeEntry } from "../types";
import { websiteHelpEntriesAr } from "./website-help";

export const arabicKnowledgeEntries: KnowledgeEntry[] = [
  ...carrierStatusEntriesAr,
  ...inheritedRiskEntriesAr,
  ...screeningEntriesAr,
  ...geneticCounsellingEntriesAr,
  ...privacyEntriesAr,
  ...carePathwaysEntriesAr,
  ...websiteHelpEntriesAr,
];
