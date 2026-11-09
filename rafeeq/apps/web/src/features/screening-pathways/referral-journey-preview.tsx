import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { SyntheticBadge } from "@/components/synthetic-badge";
import { useCopyList } from "@/i18n/copy-list";
import { REFERRAL_JOURNEY_STAGE_IDS, type ReferralStageStatus } from "./content-model";

type StageRow = {
  id: (typeof REFERRAL_JOURNEY_STAGE_IDS)[number];
  label: string;
  description: string;
  status: ReferralStageStatus;
};

function statusVariant(status: ReferralStageStatus): "notice" | "neutral" {
  return status === "example" ? "neutral" : "notice";
}

export function ReferralJourneyPreview() {
  const { t } = useTranslation();
  const stages = useCopyList<StageRow>("screeningPathways.referralTracker.stages", "public");

  return (
    <section className="flex flex-col gap-4" aria-labelledby="referral-tracker-heading">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="referral-tracker-heading" className="text-xl font-semibold text-teal-900">
          {t("screeningPathways.referralTracker.heading", { ns: "public" })}
        </h2>
        <SyntheticBadge />
      </div>
      <p className="max-w-2xl text-base text-ink-600">
        {t("screeningPathways.referralTracker.lead", { ns: "public" })}
      </p>
      <p className="text-sm font-medium text-amber-900">
        {t("screeningPathways.referralTracker.noSuccess", { ns: "public" })}
      </p>
      <ol className="flex flex-col gap-3">
        {stages.map((stage, index) => (
          <li
            key={stage.id}
            className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-sand-100 p-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-teal-800">
                {t("screeningPathways.referralTracker.step", { ns: "public", n: index + 1 })}
              </span>
              <span className="font-medium text-teal-900">{stage.label}</span>
              <span className="text-sm text-ink-600">{stage.description}</span>
            </div>
            <Badge variant={statusVariant(stage.status)}>
              {t(`screeningPathways.referralTracker.status.${stage.status}`, { ns: "public" })}
            </Badge>
          </li>
        ))}
      </ol>
    </section>
  );
}
