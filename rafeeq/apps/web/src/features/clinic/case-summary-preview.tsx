import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { StatusChips } from "@/features/care/status-chips";
import { languageLabel, literacyLabel, referralStatusLabel } from "@/features/clinic/labels";
import { TierChip } from "@/features/clinic/tier-chip";
import type { CaseBrief } from "@/features/clinic/types";

export function CaseSummaryPreview({ brief }: { brief: CaseBrief }) {
  const { t } = useTranslation();

  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-card p-6 shadow-xs">
      <h2 className="text-lg font-semibold text-teal-900">{t("case.summary.heading", { ns: "clinic" })}</h2>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SummaryRow label={t("case.summary.id", { ns: "clinic" })} value={brief.id} />
        <SummaryRow
          label={t("case.summary.status", { ns: "clinic" })}
          value={referralStatusLabel(brief.status, t)}
        />
        <SummaryRow label={t("case.summary.tier", { ns: "clinic" })} value={<TierChip tier={brief.tier} />} />
        <SummaryRow
          label={t("case.summary.reason", { ns: "clinic" })}
          value={t("case.summary.reasonPlaceholder", { ns: "clinic" })}
        />
        <SummaryRow
          label={t("case.summary.consent", { ns: "clinic" })}
          value={t("case.summary.consentDemo", { ns: "clinic" })}
        />
        <SummaryRow
          label={t("case.summary.questions", { ns: "clinic" })}
          value={String(brief.user_questions.length)}
        />
        <SummaryRow
          label={t("case.language", { ns: "clinic" })}
          value={languageLabel(brief.preferences.language, t)}
        />
        <SummaryRow
          label={t("case.literacy", { ns: "clinic" })}
          value={literacyLabel(brief.preferences.literacy_mode, t)}
        />
      </dl>
      <div className="flex flex-wrap gap-2">
        <StatusChips status={brief.status} />
        <Badge variant="notice">{t("case.summary.synthetic", { ns: "clinic" })}</Badge>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm font-semibold text-teal-900">{label}</dt>
      <dd className="text-base text-ink-600">{value}</dd>
    </div>
  );
}
