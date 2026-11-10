/**
 * Synthetic demonstration screening report. Every record is fictional and must be
 * labelled as such wherever it is shown.
 */
export type DemoScreeningStatus =
  "carrier_finding" | "no_variant_identified_in_demo_panel" | "inconclusive" | "not_tested";

export type InheritancePattern = "autosomal_recessive" | "unknown";

export type DemoScreeningFinding = {
  id: string;
  conditionKey: "betaThalassemia" | "sickleCell" | "sma" | "cysticFibrosis";
  gene: string;
  status: DemoScreeningStatus;
  inheritancePattern: InheritancePattern;
  isSynthetic: true;
};

export type DemoScreeningReport = {
  id: string;
  patientName: string;
  reportDate: string;
  reportTypeKey: "carrierPanel";
  findings: readonly DemoScreeningFinding[];
  isSynthetic: true;
};

export const demoReport: DemoScreeningReport = {
  id: "RAF-DEMO-001",
  patientName: "Ahmed Hassan",
  reportDate: "2026-11-09",
  reportTypeKey: "carrierPanel",
  isSynthetic: true,
  findings: [
    {
      id: "f-hbb-thal",
      conditionKey: "betaThalassemia",
      gene: "HBB",
      status: "carrier_finding",
      inheritancePattern: "autosomal_recessive",
      isSynthetic: true,
    },
    {
      id: "f-hbb-sickle",
      conditionKey: "sickleCell",
      gene: "HBB",
      status: "no_variant_identified_in_demo_panel",
      inheritancePattern: "autosomal_recessive",
      isSynthetic: true,
    },
    {
      id: "f-smn1",
      conditionKey: "sma",
      gene: "SMN1",
      status: "inconclusive",
      inheritancePattern: "autosomal_recessive",
      isSynthetic: true,
    },
    {
      id: "f-cftr",
      conditionKey: "cysticFibrosis",
      gene: "CFTR",
      status: "not_tested",
      inheritancePattern: "unknown",
      isSynthetic: true,
    },
  ],
};

/** Fictional partner findings used only for the consent-based couple demonstration. */
export const demoPartnerFindings: readonly DemoScreeningFinding[] = [
  {
    id: "p-hbb-thal",
    conditionKey: "betaThalassemia",
    gene: "HBB",
    status: "carrier_finding",
    inheritancePattern: "autosomal_recessive",
    isSynthetic: true,
  },
  {
    id: "p-cftr",
    conditionKey: "cysticFibrosis",
    gene: "CFTR",
    status: "no_variant_identified_in_demo_panel",
    inheritancePattern: "autosomal_recessive",
    isSynthetic: true,
  },
];

/** Findings that may warrant review by a qualified genetics professional. */
export function needsProfessionalReview(finding: DemoScreeningFinding): boolean {
  return finding.status === "carrier_finding" || finding.status === "inconclusive";
}
