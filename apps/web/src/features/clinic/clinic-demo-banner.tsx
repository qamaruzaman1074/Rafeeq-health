import { useTranslation } from "react-i18next";
import { SyntheticBadge } from "@/components/synthetic-badge";
import { NoticePanel } from "@/components/public/marketing-blocks";

export function ClinicDemoBanner() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-teal-700 bg-sand-100 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <SyntheticBadge />
        <span className="text-sm font-semibold text-teal-900">{t("demo.banner.title", { ns: "clinic" })}</span>
      </div>
      <NoticePanel>
        <p>{t("demo.banner.body", { ns: "clinic" })}</p>
      </NoticePanel>
    </div>
  );
}
