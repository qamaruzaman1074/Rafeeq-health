import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

/** Marks educational copy that is not yet clinician-reviewed. */
type ClinicalDraftBadgeProps = {
  messageKey?: string;
};

export function ClinicalDraftBadge({ messageKey = "risk.reviewBadge" }: ClinicalDraftBadgeProps) {
  const { t } = useTranslation();
  return <Badge variant="notice">{t(messageKey, { ns: "public" })}</Badge>;
}
