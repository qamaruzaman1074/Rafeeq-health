import type { TFunction } from "i18next";
import type { EquityDimension } from "@/features/insights/types";
import { registerInsightsCatalog } from "@/i18n/register-insights";

registerInsightsCatalog();

const METRIC_TITLE_KEYS: Record<string, string> = {
  explanation_completion: "metrics.explanation_completion.title",
  teach_back_pass: "metrics.teach_back_pass.title",
  counselling_uptake: "metrics.counselling_uptake.title",
  median_time_result_to_referral: "metrics.median_time_result_to_referral.title",
  privacy_events: "metrics.privacy_events.title",
};

export function metricTitle(id: string, t: TFunction): string {
  const key = METRIC_TITLE_KEYS[id];
  if (key === undefined) {
    return t("content.missing", { ns: "common" });
  }
  return t(key, { ns: "insights" });
}

export function dimensionTitle(dimension: EquityDimension, t: TFunction): string {
  switch (dimension) {
    case "language":
      return t("chart.language", { ns: "insights" });
    case "literacy_mode":
      return t("chart.literacy_mode", { ns: "insights" });
    default: {
      const unreachable: never = dimension;
      return unreachable;
    }
  }
}

export function groupLabel(dimension: EquityDimension, key: string, t: TFunction): string {
  if (dimension === "language") {
    if (key === "en") {
      return t("common.languageName.en", { ns: "common" });
    }
    if (key === "ar") {
      return t("common.languageName.ar", { ns: "common" });
    }
    return t("content.missing", { ns: "common" });
  }
  if (key === "standard") {
    return t("shell.literacy.standard", { ns: "common" });
  }
  if (key === "simple") {
    return t("shell.literacy.simple", { ns: "common" });
  }
  if (key === "voice") {
    return t("shell.literacy.voice", { ns: "common" });
  }
  return t("content.missing", { ns: "common" });
}
