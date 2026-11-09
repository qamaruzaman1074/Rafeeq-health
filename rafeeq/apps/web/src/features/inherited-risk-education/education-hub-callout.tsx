import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { NoticePanel } from "@/components/public/marketing-blocks";
import { Button } from "@/components/ui/button";
import { ClinicalDraftBadge } from "./clinical-draft-badge";

export function EducationHubCallout() {
  const { t } = useTranslation();

  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-sand-100 p-6 shadow-xs">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-teal-900">{t("risk.hubCallout.title", { ns: "public" })}</h2>
        <ClinicalDraftBadge />
      </div>
      <p className="max-w-2xl text-base leading-relaxed text-ink-600">{t("risk.hubCallout.body", { ns: "public" })}</p>
      <NoticePanel>
        <p className="text-sm">{t("risk.medicalDisclaimer", { ns: "public" })}</p>
      </NoticePanel>
      <Button asChild className="w-fit">
        <Link to="/understanding-genetic-risk">{t("risk.hubCallout.action", { ns: "public" })}</Link>
      </Button>
    </aside>
  );
}
