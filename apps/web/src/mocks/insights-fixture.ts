/**
 * OPEN_QUESTION: Section 6 does not define KPI formulas or the response body.
 * Named metrics stay null so the screen shows OPEN_QUESTION instead of a rate.
 *
 * Equity cells below are synthetic display fixtures. The counts and interval
 * bounds are not measurements, not rates, and not derived from personas.
 * The component must print them as supplied. `metric_id` stays null because
 * which KPI these cells belong to is unspecified.
 */

const undefinedMetric = {
  n: null,
  ci: null,
  value: null,
  granted: null,
  revoked: null,
  suppressed: null,
} as const;

export const KPI_IDS = [
  "explanation_completion",
  "teach_back_pass",
  "counselling_uptake",
  "median_time_result_to_referral",
  "privacy_events",
] as const;

export const equityCells = {
  languageEn: {
    key: "en",
    n: 24,
    ci: { level: 95, low: "100", high: "200" },
    suppressed: false,
  },
  languageAr: {
    key: "ar",
    n: 3,
    ci: { level: 95, low: "901", high: "902" },
    suppressed: false,
  },
  literacyStandard: {
    key: "standard",
    n: 16,
    ci: { level: 95, low: "300", high: "400" },
    suppressed: false,
  },
  literacySimple: {
    key: "simple",
    n: 12,
    ci: { level: 95, low: "701", high: "702" },
    suppressed: true,
  },
  literacyVoice: {
    key: "voice",
    n: 4,
    ci: null,
    suppressed: null,
  },
} as const;

export function kpiPayload() {
  return {
    k_anonymity: 5,
    metrics: KPI_IDS.map((id) => ({ id, ...undefinedMetric })),
  };
}

export function equityPayload() {
  return {
    metric_id: null,
    series: [
      {
        dimension: "language",
        cells: [equityCells.languageEn, equityCells.languageAr],
      },
      {
        dimension: "literacy_mode",
        cells: [
          equityCells.literacyStandard,
          equityCells.literacySimple,
          equityCells.literacyVoice,
        ],
      },
    ],
  };
}
