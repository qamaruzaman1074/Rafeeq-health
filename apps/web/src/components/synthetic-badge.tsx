import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

/** Marks screens that show fictional example data rather than a clinical record. */
export function SyntheticBadge() {
  const { t } = useTranslation();
  return <Badge variant="notice">{t("shell.demoLabel")}</Badge>;
}
