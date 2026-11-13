import { useState, useSyncExternalStore, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { getSessionIdentity, isSupabaseAuthenticated, subscribeSession } from "@/app/session";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/skeleton";
import { SyntheticBadge } from "@/components/synthetic-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReportCodeGate } from "@/features/report-access/report-code-gate";
import { usePrototypeReportAccess } from "@/features/report-access/prototype-report-access";
import {
  createOwnReportSignedUrl,
  deleteOwnReport,
  fetchOwnReports,
  findOwnReportByCode,
  isValidReportAccessCode,
  type ScreeningReport,
} from "@/features/reports/supabase-reports";
import {
  REPORT_CODE_LENGTH,
  sanitizeReportAccessCodeInput,
} from "@/features/report-access/report-code";
import { ReportUploadForm } from "@/features/reports/report-upload-form";

function formatReportDate(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

function DemoReportsView() {
  const { t } = useTranslation();
  const access = usePrototypeReportAccess();

  return (
    <AppPageLayout width="wide">
      <PageHeader
        eyebrow={<SyntheticBadge />}
        title={t("reports.title", { ns: "couple" })}
        description={t("reports.demoIntro", { ns: "couple" })}
      />
      <ReportCodeGate namespace="couple" />
      {access.unlocked ? (
        <section
          aria-labelledby="demo-report-heading"
          className="motion-card-lift flex flex-col gap-4 rounded-2xl border border-border-subtle bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-7"
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="demo-report-heading" className="text-xl font-semibold text-teal-900">
                {t("reports.demoTitle", { ns: "couple" })}
              </h2>
              <Badge variant="notice">{t("report.syntheticBanner", { ns: "couple" })}</Badge>
            </div>
            <p className="text-base text-ink-600">
              {t("reports.demoDescription", { ns: "couple" })}
            </p>
            <p className="text-sm text-ink-600">{t("reports.demoDate", { ns: "couple" })}</p>
          </div>
          <Button asChild>
            <Link to="/app/report">{t("reports.viewDetails", { ns: "couple" })}</Link>
          </Button>
        </section>
      ) : null}
    </AppPageLayout>
  );
}

function ReportDetails({
  report,
  onDelete,
  deleting,
}: {
  report: ScreeningReport;
  onDelete: () => void;
  deleting: boolean;
}) {
  const { t, i18n } = useTranslation();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(false);

  async function createDownloadLink(): Promise<void> {
    setLoadingUrl(true);
    setError(null);
    setSignedUrl(null);
    try {
      setSignedUrl(await createOwnReportSignedUrl(report.id));
    } catch {
      setError(t("reports.details.openError", { ns: "couple" }));
    } finally {
      setLoadingUrl(false);
    }
  }

  return (
    <section
      aria-labelledby="report-details-heading"
      className="motion-card-lift flex flex-col gap-5 rounded-2xl border border-border-subtle bg-card p-5 shadow-xs sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h2 id="report-details-heading" className="text-xl font-semibold text-teal-900">
            {t("reports.details.title", { ns: "couple" })}
          </h2>
          <p className="break-all text-base font-medium text-ink-900">{report.file_name}</p>
        </div>
        <Badge variant="positive">{t("reports.available", { ns: "couple" })}</Badge>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="text-sm text-ink-600">{t("reports.details.date", { ns: "couple" })}</dt>
          <dd className="font-medium text-ink-900">
            <time dateTime={report.created_at}>
              {formatReportDate(report.created_at, i18n.resolvedLanguage ?? i18n.language)}
            </time>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-ink-600">
            {t("reports.details.fileType", { ns: "couple" })}
          </dt>
          <dd className="font-medium text-ink-900">{report.mime_type}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-600">
            {t("reports.details.fileSize", { ns: "couple" })}
          </dt>
          <dd className="font-medium text-ink-900">
            {t("reports.details.sizeValue", {
              ns: "couple",
              size: (report.file_size / (1024 * 1024)).toFixed(2),
            })}
          </dd>
        </div>
      </dl>
      <p className="rounded-lg border border-border-subtle bg-sand-100 p-4 text-sm leading-relaxed text-ink-600">
        {t("reports.details.noAnalysis", { ns: "couple" })}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" disabled={loadingUrl} onClick={() => void createDownloadLink()}>
          {loadingUrl
            ? t("reports.details.preparing", { ns: "couple" })
            : t("reports.details.prepareDownload", { ns: "couple" })}
        </Button>
        {signedUrl !== null ? (
          <Button asChild variant="secondary">
            <a href={signedUrl} target="_blank" rel="noopener noreferrer">
              {t("reports.details.openFile", { ns: "couple" })}
            </a>
          </Button>
        ) : null}
        <Button type="button" variant="destructive" disabled={deleting} onClick={onDelete}>
          {deleting
            ? t("reports.details.deleting", { ns: "couple" })
            : t("reports.details.delete", { ns: "couple" })}
        </Button>
      </div>
      {error !== null ? (
        <p role="alert" className="text-sm font-medium text-danger-600">
          {error}
        </p>
      ) : null}
    </section>
  );
}

function SignedInReportsView() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const identity = useSyncExternalStore(subscribeSession, getSessionIdentity, getSessionIdentity);
  const reportsQuery = useQuery({
    queryKey: ["reports", "mine", identity],
    queryFn: fetchOwnReports,
    enabled: identity !== null,
    retry: false,
  });
  const [code, setCode] = useState("");
  const [selectedReport, setSelectedReport] = useState<ScreeningReport | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const contact = humanContact(t);

  async function findReport(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setCodeError(null);
    setSelectedReport(null);
    if (!isValidReportAccessCode(code)) {
      setCodeError(t("reports.invalidCode", { ns: "couple" }));
      return;
    }
    try {
      const report = await findOwnReportByCode(code);
      if (report === null) {
        setCodeError(t("reports.notFound", { ns: "couple" }));
      } else {
        setSelectedReport(report);
      }
    } catch {
      setCodeError(t("reports.lookupError", { ns: "couple" }));
    }
  }

  async function removeReport(report: ScreeningReport): Promise<void> {
    if (!window.confirm(t("reports.details.deleteConfirm", { ns: "couple" }))) {
      return;
    }
    setDeletingId(report.id);
    setCodeError(null);
    try {
      await deleteOwnReport(report.id);
      setSelectedReport(null);
      await queryClient.invalidateQueries({ queryKey: ["reports", "mine", identity] });
    } catch {
      setCodeError(t("reports.details.deleteError", { ns: "couple" }));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AppPageLayout width="wide">
      <PageHeader
        title={t("reports.title", { ns: "couple" })}
        description={t("reports.intro", { ns: "couple" })}
      />
      <ReportUploadForm />

      <section aria-labelledby="report-code-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 id="report-code-heading" className="text-xl font-semibold text-teal-900">
            {t("reports.codeHeading", { ns: "couple" })}
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-ink-600">
            {t("reports.codeIntro", { ns: "couple" })}
          </p>
        </div>
        <form
          className="flex flex-col items-start gap-3 sm:flex-row sm:items-end"
          onSubmit={(event) => void findReport(event)}
        >
          <div className="flex w-full max-w-sm flex-col gap-2">
            <label htmlFor="find-report-code" className="text-sm font-semibold text-teal-900">
              {t("reports.codeLabel", { ns: "couple" })}
            </label>
            <input
              id="find-report-code"
              name="reportCode"
              type="text"
              lang="en"
              dir="ltr"
              autoComplete="off"
              maxLength={REPORT_CODE_LENGTH}
              inputMode="numeric"
              value={code}
              onChange={(event) => {
                setCode(sanitizeReportAccessCodeInput(event.target.value));
                setCodeError(null);
              }}
              className="min-h-12 w-full rounded-lg border border-border-subtle bg-background px-4 font-mono text-lg tracking-[0.18em] text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              placeholder={t("reports.codePlaceholder", { ns: "couple" })}
            />
          </div>
          <Button type="submit">{t("reports.find", { ns: "couple" })}</Button>
        </form>
        {codeError !== null ? (
          <p role="alert" className="text-sm font-medium text-danger-600">
            {codeError}
          </p>
        ) : null}
        {selectedReport !== null ? (
          <ReportDetails
            report={selectedReport}
            deleting={deletingId === selectedReport.id}
            onDelete={() => void removeReport(selectedReport)}
          />
        ) : null}
      </section>

      <section aria-labelledby="available-reports-heading" className="flex flex-col gap-4">
        <h2 id="available-reports-heading" className="text-xl font-semibold text-teal-900">
          {t("reports.availableHeading", { ns: "couple" })}
        </h2>
        {reportsQuery.isPending ? (
          <Skeleton label={t("reports.loading", { ns: "couple" })} />
        ) : null}
        {reportsQuery.isError ? (
          <ErrorState
            title={t("reports.loadError", { ns: "couple" })}
            retryLabel={t("reports.retry", { ns: "couple" })}
            onRetry={() => void reportsQuery.refetch()}
            {...contact}
          />
        ) : null}
        {reportsQuery.isSuccess && reportsQuery.data.length === 0 ? (
          <EmptyState title={t("reports.empty", { ns: "couple" })} />
        ) : null}
        {reportsQuery.data !== undefined && reportsQuery.data.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {reportsQuery.data.map((report) => (
              <li key={report.id}>
                <article className="motion-card-lift flex h-full flex-col gap-4 rounded-xl border border-border-subtle bg-card p-5 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <h3 className="break-words text-lg font-semibold text-teal-900">
                        {t("reports.listFileLabel", { ns: "couple" })}
                      </h3>
                      <p className="text-sm text-ink-600">
                        <time dateTime={report.created_at}>
                          {formatReportDate(
                            report.created_at,
                            i18n.resolvedLanguage ?? i18n.language,
                          )}
                        </time>
                      </p>
                    </div>
                    <Badge variant="positive">{t("reports.available", { ns: "couple" })}</Badge>
                  </div>
                  <p className="text-sm text-ink-600">
                    {t("reports.listCodeLabel", { ns: "couple" })}:{" "}
                    <span lang="en" dir="ltr" className="font-mono font-semibold text-ink-900">
                      {report.access_code}
                    </span>
                  </p>
                  <p className="text-sm text-ink-600">
                    {t("reports.listCodeGate", { ns: "couple" })}
                  </p>
                  <Button asChild variant="secondary" className="w-fit">
                    <a href="#find-report-code">{t("reports.enterCodeAction", { ns: "couple" })}</a>
                  </Button>
                </article>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </AppPageLayout>
  );
}

export function ReportsView() {
  const authenticated = useSyncExternalStore(
    subscribeSession,
    isSupabaseAuthenticated,
    isSupabaseAuthenticated,
  );
  return authenticated ? <SignedInReportsView /> : <DemoReportsView />;
}
