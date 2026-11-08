import { useTranslation } from "react-i18next";
import { CoupleSectionNav } from "@/components/couple-section-nav";
import { PathwayProgress } from "@/features/check/pathway";

export function Component() {
  const { t } = useTranslation();
  return (
    <div className="ms-auto me-auto flex w-full max-w-3xl flex-col gap-6">
      <h1 className="text-3xl font-semibold text-teal-900">{t("home.title", { ns: "couple" })}</h1>
      <CoupleSectionNav />
      <PathwayProgress />
    </div>
  );
}
