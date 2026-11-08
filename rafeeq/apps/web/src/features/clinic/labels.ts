import type { TFunction } from "i18next";
import type { ReferralStatus } from "@/features/care/steps";
import { statusLabel } from "@/features/care/labels";
import type { Tier } from "@/features/clinic/tiers";
import type { OverlapShare, QueueLanguage, QueueLiteracy } from "@/features/clinic/types";

export function tierLabel(tier: Tier, t: TFunction): string {
  switch (tier) {
    case "T1_info":
      return t("tiers.T1_info", { ns: "clinic" });
    case "T2_counsel_routine":
      return t("tiers.T2_counsel_routine", { ns: "clinic" });
    case "T3_counsel_priority":
      return t("tiers.T3_counsel_priority", { ns: "clinic" });
    case "T4_urgent_human":
      return t("tiers.T4_urgent_human", { ns: "clinic" });
    default: {
      const unreachable: never = tier;
      return unreachable;
    }
  }
}

export function referralStatusLabel(status: ReferralStatus, t: TFunction): string {
  return statusLabel(status, t);
}

export function languageLabel(language: QueueLanguage | null, t: TFunction): string {
  if (language === null) {
    return t("content.missing", { ns: "common" });
  }
  switch (language) {
    case "en":
      return t("common.languageName.en", { ns: "common" });
    case "ar":
      return t("common.languageName.ar", { ns: "common" });
    default: {
      const unreachable: never = language;
      return unreachable;
    }
  }
}

export function literacyLabel(mode: QueueLiteracy | null, t: TFunction): string {
  if (mode === null) {
    return t("content.missing", { ns: "common" });
  }
  switch (mode) {
    case "standard":
      return t("shell.literacy.standard", { ns: "common" });
    case "simple":
      return t("shell.literacy.simple", { ns: "common" });
    case "voice":
      return t("shell.literacy.voice", { ns: "common" });
    default: {
      const unreachable: never = mode;
      return unreachable;
    }
  }
}

export function overlapLabel(share: OverlapShare, t: TFunction): string {
  switch (share) {
    case "allowed":
      return t("queue.overlapAllowed", { ns: "clinic" });
    case "declined":
      return t("queue.overlapDeclined", { ns: "clinic" });
    case "missing":
      return t("queue.overlapMissing", { ns: "clinic" });
    case "empty":
      return t("queue.overlapEmpty", { ns: "clinic" });
    default: {
      const unreachable: never = share;
      return unreachable;
    }
  }
}

export function gapsLabel(value: boolean | null, t: TFunction): string {
  if (value === null) {
    return t("content.missing", { ns: "common" });
  }
  return value ? t("queue.gapsYes", { ns: "clinic" }) : t("queue.gapsNo", { ns: "clinic" });
}
