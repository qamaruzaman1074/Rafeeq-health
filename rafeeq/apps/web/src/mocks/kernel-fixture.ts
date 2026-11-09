import blocksEn from "../../../../content/blocks.en.json";
import type { FactCardDTO } from "@/features/couple/fact-card-dto";
import { shareGate, type ConsentRow } from "@/features/couple/share-state";
import type { Persona } from "@/features/personas";
import type { Carrier, OwnResult, OverlapResult } from "@/features/result/types";

/**
 * OPEN_QUESTION: `/content/blocks.*.json` is empty and MASTER does not assign
 * block ids. Every block id in this fixture is the marker below.
 * Banner text is taken only from those files, so the own-result banner stays empty.
 * Fact-card sentences below are the verbatim lines already stated in website
 * planning Section 7 (Together) and MASTER Section 7.1. They are not new wording.
 */
const BLOCK_ID = "OPEN_QUESTION";

const PREGNANCY_SENTENCE = "This is a chance for each pregnancy, not a prediction about any child.";

const DIAGNOSIS_SENTENCE = "This is not a diagnosis.";

const FORMULA =
  "Autosomal recessive, both partners carry P/LP variants in the same gene: per pregnancy 1/4 affected, 1/2 carrier, 1/4 neither.";

/**
 * Icon counts for the planning Section 7 array of 100 figures.
 * MASTER Section 7.1 both-carriers case: 1/4 affected, 1/2 carrier, 1/4 neither.
 */
const BOTH_CARRIER_COUNTS = {
  affected: 25,
  carrier: 50,
  neither: 25,
} as const;

const LIMITS = [
  "X-linked",
  "dominant",
  "mitochondrial",
  "polygenic",
  "de-novo",
  "variants of uncertain significance (VUS)",
  "family history",
  "non-genetic causes",
] as const;

function blockText(file: unknown, blockId: string): string | null {
  if (typeof file !== "object" || file === null || Array.isArray(file)) {
    return null;
  }
  if (!Object.hasOwn(file, blockId)) {
    return null;
  }
  const entry = (file as Record<string, unknown>)[blockId];
  if (typeof entry === "string" && entry.trim().length > 0) {
    return entry;
  }
  if (typeof entry === "object" && entry !== null && "text" in entry) {
    const text = entry.text;
    if (typeof text === "string" && text.trim().length > 0) {
      return text;
    }
  }
  return null;
}

function parenthetical(story: string): string | null {
  const match = /\(([^)]+)\)/.exec(story);
  const value = match?.[1]?.trim();
  if (value === undefined || value.length === 0) {
    return null;
  }
  return value;
}

function carriersFor(persona: Persona): Carrier[] {
  if (persona.id !== "P1") {
    return [];
  }
  const condition = parenthetical(persona.story);
  return [
    {
      id: "P1-shared",
      gene_symbol: null,
      gene_block_id: BLOCK_ID,
      condition_name: condition,
      condition_locale: condition === null ? null : "en",
      condition_block_id: BLOCK_ID,
    },
  ];
}

export function ownResultFor(persona: Persona): OwnResult {
  return {
    banner: {
      block_id: BLOCK_ID,
      text: blockText(blocksEn, BLOCK_ID),
    },
    carriers: carriersFor(persona),
  };
}

/**
 * OPEN_QUESTION: persona stories do not say whether partner A has granted sharing.
 * P5 only states that partner B declines. P1 is the both-granted case this task renders.
 */
export function consentsFor(persona: Persona): ConsentRow[] {
  if (persona.id === "P1") {
    return [
      { partner: "a", scope: "share_overlap_with_partner", granted: true },
      { partner: "b", scope: "share_overlap_with_partner", granted: true },
    ];
  }
  if (persona.id === "P5") {
    return [{ partner: "b", scope: "share_overlap_with_partner", granted: false }];
  }
  return [];
}

export function overlapFor(
  persona: Persona,
  rows: readonly ConsentRow[] = consentsFor(persona),
): OverlapResult {
  const gate = shareGate(rows);
  if (gate !== "allowed") {
    return {
      hidden: true,
      reason: gate === "declined" ? "sharing_declined" : "consent_missing",
      genes: [],
    };
  }
  return {
    hidden: false,
    reason: null,
    genes: carriersFor(persona),
  };
}

function bothCarriersCard(): FactCardDTO {
  const englishSentence = blockText(blocksEn, BLOCK_ID) ?? PREGNANCY_SENTENCE;
  const arabicSentence = null;
  const englishDiagnosis = blockText(blocksEn, BLOCK_ID) ?? DIAGNOSIS_SENTENCE;
  const arabicDiagnosis = null;
  return {
    proportions: {
      affected: BOTH_CARRIER_COUNTS.affected,
      carrier: BOTH_CARRIER_COUNTS.carrier,
      neither: BOTH_CARRIER_COUNTS.neither,
    },
    sentences: [
      { block_id: BLOCK_ID, locale: "en", text: englishSentence },
      { block_id: BLOCK_ID, locale: "ar", text: arabicSentence },
    ],
    formula: FORMULA,
    inputs: [
      { name: "inheritance", value: "AR" },
      { name: "affected.fraction", value: "1/4" },
      { name: "affected.percent", value: "25%" },
      { name: "affected.natural_frequency", value: "1 in 4" },
      { name: "carrier.fraction", value: "1/2" },
      { name: "carrier.percent", value: "50%" },
      { name: "carrier.natural_frequency", value: "1 in 2" },
      { name: "neither.fraction", value: "1/4" },
      { name: "neither.percent", value: "25%" },
      { name: "neither.natural_frequency", value: "1 in 4" },
    ],
    limits: [...LIMITS],
    diagnosis_banner: [
      { block_id: BLOCK_ID, locale: "en", text: englishDiagnosis },
      { block_id: BLOCK_ID, locale: "ar", text: arabicDiagnosis },
    ],
  };
}

export function explainFor(
  persona: Persona,
  rows: readonly ConsentRow[] = consentsFor(persona),
): FactCardDTO | null {
  if (shareGate(rows) !== "allowed" || persona.id !== "P1") {
    return null;
  }
  return bothCarriersCard();
}
