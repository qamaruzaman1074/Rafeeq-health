import type { BadgeVariant } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { tierLabel } from "@/features/clinic/labels";
import type { Tier } from "@/features/clinic/tiers";
import { useTranslation } from "react-i18next";

function tierVariant(tier: Tier): BadgeVariant {
  switch (tier) {
    case "T1_info":
      return "neutral";
    case "T2_counsel_routine":
      return "neutral";
    case "T3_counsel_priority":
      return "notice";
    case "T4_urgent_human":
      return "conversation";
    default: {
      const unreachable: never = tier;
      return unreachable;
    }
  }
}

export function TierChip({ tier }: { tier: Tier | null }) {
  const { t } = useTranslation();
  if (tier === null) {
    return <span data-tier="none">{t("content.missing", { ns: "common" })}</span>;
  }
  return (
    <Badge variant={tierVariant(tier)} data-tier={tier} lang="en" dir="ltr">
      {tierLabel(tier, t)}
    </Badge>
  );
}
