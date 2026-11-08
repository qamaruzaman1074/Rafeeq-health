import { useTranslation } from "react-i18next";
import { PlaceholderTitle } from "@/pages/placeholder-title";

export function Component() {
  const { t } = useTranslation();
  return <PlaceholderTitle title={t("audit.title", { ns: "clinic" })} />;
}
