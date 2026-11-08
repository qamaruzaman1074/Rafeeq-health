import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

/** Always-visible mark that the screen is synthetic data, not a clinical record. */
export function SyntheticBadge() {
  const { t } = useTranslation();
  return <Badge variant="notice">{t("shell.syntheticNotice")}</Badge>;
}
