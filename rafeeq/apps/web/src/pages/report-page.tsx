import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  demoReport,
  needsProfessionalReview,
  type DemoScreeningFinding,
  type DemoScreeningStatus,
} from "@/features/demo-report/demo-report";
import { useCopyList } from "@/i18n/copy-list";

const statusVariant: Record<DemoScreeningStatus, BadgeVariant> = {
  carrier_finding: "notice",
  no_variant_identified_in_demo_panel: "neutral",
  inconclusive: "conversation",
  not_tested: "neutral",
};

function FindingCard({ finding }: { finding: DemoScreeningFinding }) {
  const { t } = useTranslation();
  const base = `report.explain.${finding.conditionKey}`;
  const questions = useCopyList<string>(`${base}.questions`, "couple");
  const name = t(`report.conditions.${finding.conditionKey}`, { ns: "couple" });

  return (
    <article
      aria-labelledby={`${finding.id}-title`}
      data-status={finding.status}
      className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-card p-5 shadow-xs transition-shadow duration-200 hover:shadow-surface sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 id={`${finding.id}-title`} className="text-xl font-semibold text-teal-900">
            {name}
          </h3>
          <p className="text-sm text-ink-600">
            {t("report.geneLabel", { ns: "couple" })}: {finding.gene} ·{" "}
            {t("report.patternLabel", { ns: "couple" })}:{" "}
            {t(`report.pattern.${finding.inheritancePattern}`, { ns: "couple" })}
          </p>
        </div>
        <Badge variant={statusVariant[finding.status]}>
          <span className="sr-only">{t("report.statusLabel", { ns: "couple" })}: </span>
          {t(`report.status.${finding.status}`, { ns: "couple" })}
        </Badge>
      </div>
      <p className="text-base leading-relaxed text-ink-900">
        {t(`${base}.summary`, { ns: "couple" })}
      </p>
      <p className="text-base text-ink-600">
        <span className="font-semibold text-teal-900">
          {t("report.nextLabel", { ns: "couple" })}:{" "}
        </span>
        {t(`${base}.next`, { ns: "couple" })}
      </p>
      <details className="group rounded-lg border border-border-subtle bg-background ps-4 pe-4">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-3 font-medium text-teal-900 [&::-webkit-details-marker]:hidden">
          {t("report.explainToggle", { ns: "couple" })}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <dl className="grid gap-4 border-t border-border-subtle py-4 sm:grid-cols-2">
          {(
            [
              ["whatSays", `${base}.says`],
              ["whatNotSays", `${base}.notSays`],
              ["uncertaintyLabel", `${base}.uncertainty`],
              ["professionalLabel", "report.professional"],
            ] as const
          ).map(([label, key]) => (
            <div key={label} className="flex flex-col gap-1">
              <dt className="text-sm font-semibold text-teal-900">
                {t(`report.${label}`, { ns: "couple" })}
              </dt>
              <dd className="text-base leading-relaxed text-ink-600">{t(key, { ns: "couple" })}</dd>
            </div>
          ))}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-sm font-semibold text-teal-900">
              {t("report.questionsLabel", { ns: "couple" })}
            </dt>
            <dd>
              <ul className="flex list-disc flex-col gap-1 ps-5 text-base text-ink-600">
                {questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </details>
      {needsProfessionalReview(finding) ? (
        <Button asChild variant="secondary" className="w-fit">
          <Link to="/app/care">{t("partner.risk.counselling", { ns: "couple" })}</Link>
        </Button>
      ) : null}
    </article>
  );
}

function DemoReportLabel() {
  const { t } = useTranslation();
  return (
    <Badge variant="notice" data-demo-label="">
      {t("report.syntheticBanner", { ns: "couple" })}
    </Badge>
  );
}

export function Component() {
  const { t } = useTranslation();
  const meta = [
    ["name", demoReport.patientName],
    ["id", demoReport.id],
    ["date", t("report.meta.dateValue", { ns: "couple" })],
    ["type", t(`report.meta.${demoReport.reportTypeKey}`, { ns: "couple" })],
  ] as const;

  return (
    <AppPageLayout width="wide">
      <PageHeader
        eyebrow={<DemoReportLabel />}
        title={t("report.title", { ns: "couple" })}
        description={t("report.intro", { ns: "couple" })}
      />
      <dl className="grid grid-cols-1 gap-4 rounded-xl border border-border-subtle bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
        {meta.map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1">
            <dt className="text-sm text-ink-600">{t(`report.meta.${key}`, { ns: "couple" })}</dt>
            <dd className="text-base font-semibold text-teal-900">{value}</dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="report-findings" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="report-findings" className="text-section text-teal-900">
            {t("report.findingsHeading", { ns: "couple" })}
          </h2>
          <DemoReportLabel />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {demoReport.findings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </div>
      </section>
      <p className="rounded-lg border border-border-subtle bg-secondary p-4 text-base text-secondary-foreground">
        {t("report.disclaimer", { ns: "couple" })}
      </p>
      <section aria-labelledby="report-upload" className="flex flex-col gap-2">
        <h2 id="report-upload" className="text-lg font-semibold text-teal-900">
          {t("report.uploadHeading", { ns: "couple" })}
        </h2>
        <p className="text-base text-ink-600">{t("report.upload", { ns: "couple" })}</p>
      </section>
    </AppPageLayout>
  );
}
