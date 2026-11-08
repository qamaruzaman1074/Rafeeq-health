import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { statusLabel } from "@/features/care/labels";
import type { ReferralStatus } from "@/features/care/steps";

function statusVariant(status: ReferralStatus): BadgeVariant {
  switch (status) {
    case "created":
      return "notice";
    case "sent":
      return "conversation";
    case "booked":
      return "neutral";
    case "attended":
      return "positive";
    case "confirmatory_ordered":
      return "notice";
    case "closed":
      return "positive";
    default: {
      const unreachable: never = status;
      return unreachable;
    }
  }
}

function statusChipText(status: ReferralStatus, t: TFunction): string {
  return statusLabel(status, t);
}

export function StatusChips({ status }: { status: ReferralStatus | null }) {
  const { t } = useTranslation();
  if (status === null) {
    return null;
  }

  return (
    <div role="status" aria-label={t("status.label", { ns: "care" })} data-status={status}>
      <Badge variant={statusVariant(status)}>{statusChipText(status, t)}</Badge>
    </div>
  );
}
