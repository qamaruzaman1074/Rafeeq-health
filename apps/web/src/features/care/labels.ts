import type { TFunction } from "i18next";
import type { PathwayStepId, ReferralStatus } from "@/features/care/steps";

export function stepLabel(id: PathwayStepId, t: TFunction): string {
  switch (id) {
    case "result_received":
      return t("steps.result_received", { ns: "care" });
    case "counselling":
      return t("steps.counselling", { ns: "care" });
    case "confirmatory_assessment":
      return t("steps.confirmatory_assessment", { ns: "care" });
    case "specialised_services":
      return t("steps.specialised_services", { ns: "care" });
    case "follow_up":
      return t("steps.follow_up", { ns: "care" });
    default: {
      const unreachable: never = id;
      return unreachable;
    }
  }
}

export function statusLabel(status: ReferralStatus, t: TFunction): string {
  switch (status) {
    case "created":
      return t("status.created", { ns: "care" });
    case "sent":
      return t("status.sent", { ns: "care" });
    case "booked":
      return t("status.booked", { ns: "care" });
    case "attended":
      return t("status.attended", { ns: "care" });
    case "confirmatory_ordered":
      return t("status.confirmatory_ordered", { ns: "care" });
    case "closed":
      return t("status.closed", { ns: "care" });
    default: {
      const unreachable: never = status;
      return unreachable;
    }
  }
}

export function periodLabel(period: "morning" | "afternoon", t: TFunction): string {
  switch (period) {
    case "morning":
      return t("booking.morning", { ns: "care" });
    case "afternoon":
      return t("booking.afternoon", { ns: "care" });
    default: {
      const unreachable: never = period;
      return unreachable;
    }
  }
}
