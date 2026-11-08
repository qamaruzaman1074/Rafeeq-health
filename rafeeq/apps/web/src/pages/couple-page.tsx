import { useTranslation } from "react-i18next";
import { CoupleSectionNav } from "@/components/couple-section-nav";
import { Badge } from "@/components/ui/badge";
import { ConsentGate } from "@/features/couple/consent-gate";

export function Component() {
  const { t } = useTranslation();
  return (
    <div className="ms-auto me-auto flex w-full max-w-3xl flex-col gap-6">
      <CoupleSectionNav />
      <h1 className="text-3xl font-semibold text-teal-900">
        {t("together.title", { ns: "couple" })}
      </h1>
      <Badge variant="notice">{t("prototype", { ns: "couple" })}</Badge>
      <ConsentGate />
    </div>
  );
}
