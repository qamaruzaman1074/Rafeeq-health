import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { SyntheticBadge } from "@/components/synthetic-badge";
import { useCopyList } from "@/i18n/copy-list";

type AuditSample = {
  activity: string;
  recipient: string;
  category: string;
  date: string;
  status: string;
};

export function SyntheticAuditPanel() {
  const { t } = useTranslation();
  const rows = useCopyList<AuditSample>("education.syntheticAudit.rows", "privacy");

  return (
    <section className="flex flex-col gap-4" aria-labelledby="synthetic-audit-heading">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="synthetic-audit-heading" className="text-xl font-semibold text-teal-900">
          {t("education.syntheticAudit.heading", { ns: "privacy" })}
        </h2>
        <SyntheticBadge />
        <Badge variant="notice">{t("education.syntheticAudit.label", { ns: "privacy" })}</Badge>
      </div>
      <p className="max-w-2xl text-base text-ink-600">{t("education.syntheticAudit.lead", { ns: "privacy" })}</p>
      <div className="overflow-x-auto rounded-lg border border-dashed border-teal-700 bg-sand-100">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              {(["activity", "recipient", "category", "date", "status"] as const).map((col) => (
                <th key={col} scope="col" className="px-4 py-3 text-start font-semibold text-teal-900">
                  {t(`education.syntheticAudit.columns.${col}`, { ns: "privacy" })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.activity} className="border-b border-border-subtle last:border-0">
                <td className="px-4 py-3">{row.activity}</td>
                <td className="px-4 py-3">{row.recipient}</td>
                <td className="px-4 py-3">{row.category}</td>
                <td className="px-4 py-3">{row.date}</td>
                <td className="px-4 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
