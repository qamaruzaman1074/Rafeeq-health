import { useState, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { getSessionIdentity, subscribeSession } from "@/app/session";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { SyntheticBadge } from "@/components/synthetic-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFailureToast } from "@/components/ui/toast";
import { explainOverlap, fetchConsents } from "@/features/couple/api";
import { FactCard } from "@/features/couple/fact-card";
import { shareGate } from "@/features/couple/share-state";
import { EducationHubCallout } from "@/features/inherited-risk-education/education-hub-callout";
import { InheritanceExample } from "@/features/result/inheritance-example";
import { ResultMeanings } from "@/features/result/meanings";
import { fetchOverlap, fetchOwnResult } from "@/features/result/api";
import { ResultCard } from "@/features/result/result-card";
import {
  REPORT_CODE_LENGTH,
  sanitizeReportAccessCodeInput,
} from "@/features/report-access/report-code";
import { ReportCodeGate } from "@/features/report-access/report-code-gate";
import {
  isValidPrototypeReportCode,
  usePrototypeReportAccess,
} from "@/features/report-access/prototype-report-access";
import { landmarkName } from "@/lib/landmark-name";

export function ResultView() {
  const { t } = useTranslation();
  const sessionIdentity = useSyncExternalStore(
    subscribeSession,
    getSessionIdentity,
    getSessionIdentity,
  );
  const reportAccess = usePrototypeReportAccess();
  const [partnerCode, setPartnerCode] = useState("");
  const [partnerCodeInvalid, setPartnerCodeInvalid] = useState(false);
  const [partnerCodeAccepted, setPartnerCodeAccepted] = useState(false);
  const [partnerAttempt, setPartnerAttempt] = useState(0);
  const result = useQuery({
    queryKey: ["results", "mine", sessionIdentity],
    queryFn: fetchOwnResult,
    retry: false,
    enabled: reportAccess.unlocked,
  });
  const consents = useQuery({
    queryKey: ["consents", sessionIdentity],
    queryFn: fetchConsents,
    retry: false,
    enabled: reportAccess.unlocked,
  });
  const allowed = consents.isSuccess && shareGate(consents.data) === "allowed";
  const partnerAccessReady = reportAccess.unlocked && partnerCodeAccepted && allowed;
  const overlap = useQuery({
    queryKey: ["results", "overlap", sessionIdentity, partnerAttempt],
    queryFn: fetchOverlap,
    retry: false,
    enabled: partnerAccessReady,
  });
  const explain = useQuery({
    queryKey: ["explain", "overlap", sessionIdentity, partnerAttempt],
    queryFn: explainOverlap,
    enabled: partnerAccessReady,
    retry: false,
  });
  const contact = humanContact(t);
  useFailureToast(result.isError, t("error", { ns: "result" }));

  const factCard = partnerAccessReady ? (explain.data?.fact_card ?? null) : null;

  return (
    <AppPageLayout width="wide">
      <PageHeader
        eyebrow={
          <span className="flex flex-wrap gap-2">
            <SyntheticBadge />
            <Badge variant="notice">{t("prototype", { ns: "result" })}</Badge>
          </span>
        }
        title={t("page.title", { ns: "result" })}
        description={t("page.intro", { ns: "result" })}
      />

      <ResultMeanings />

      <EducationHubCallout />

      {reportAccess.unlocked ? (
        <section
          className="flex flex-col gap-4"
          data-result-section="own"
          aria-labelledby="own-result-heading"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-2">
              <h2 id="own-result-heading" className="text-xl font-semibold text-teal-900">
                {t("own.heading", { ns: "result" })}
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-ink-600">
                {t("own.lead", { ns: "result" })}
              </p>
            </div>
            <Button asChild variant="secondary">
              <Link to="/app/report">{t("reportAccess.openFullReport", { ns: "result" })}</Link>
            </Button>
          </div>
          {result.isPending ? <Skeleton label={t("loading", { ns: "result" })} /> : null}
          {result.isError ? (
            <ErrorState
              title={t("error", { ns: "result" })}
              retryLabel={t("retry", { ns: "result" })}
              onRetry={() => {
                void result.refetch();
              }}
              {...contact}
            />
          ) : null}
          {result.isSuccess && result.data === null ? (
            <EmptyState title={t("empty", { ns: "result" })} />
          ) : null}
          {result.data !== undefined && result.data !== null ? (
            <>
              <aside className="rounded-lg border border-teal-700 bg-amber-100 p-4">
                {result.data.banner.text !== null ? (
                  <p>{result.data.banner.text}</p>
                ) : (
                  <p>
                    <span>{t("content.missing", { ns: "common" })}</span>{" "}
                    <span lang="en" dir="ltr">
                      {result.data.banner.block_id}
                    </span>
                  </p>
                )}
              </aside>
              {result.data.carriers.length === 0 ? (
                <EmptyState title={t("empty", { ns: "result" })} />
              ) : null}
              <ul className="flex flex-col gap-4">
                {result.data.carriers.map((carrier) => (
                  <li key={carrier.id}>
                    <ResultCard carrier={carrier} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : (
        <ReportCodeGate namespace="result" />
      )}

      {reportAccess.unlocked ? (
        <section
          className="motion-card-lift flex flex-col gap-4 rounded-2xl border border-border-subtle bg-card p-5 shadow-xs sm:p-7"
          data-result-section="partner-code"
          aria-labelledby="partner-code-heading"
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-center">
            <div className="flex flex-col gap-2">
              <h2 id="partner-code-heading" className="text-xl font-semibold text-teal-900">
                {t("reportAccess.partnerTitle", { ns: "result" })}
              </h2>
              <p className="max-w-3xl text-base leading-relaxed text-ink-600">
                {t("reportAccess.partnerIntro", { ns: "result" })}
              </p>
              <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-ink-900">
                {t("reportAccess.partnerPrototypeNotice", { ns: "result" })}
              </p>
            </div>
            <img
              src="/images/outcomes/privacy/secure-sharing.svg"
              alt={t("reportAccess.partnerImageAlt", { ns: "result" })}
              className="mx-auto max-h-40 w-full object-contain"
              loading="lazy"
            />
          </div>
          {consents.isPending ? <Skeleton label={t("loading", { ns: "couple" })} /> : null}
          {consents.isError ? (
            <ErrorState
              title={t("error", { ns: "couple" })}
              retryLabel={t("retry", { ns: "couple" })}
              onRetry={() => {
                void consents.refetch();
              }}
              {...contact}
            />
          ) : null}
          {consents.isSuccess && !allowed ? (
            <div className="flex flex-col items-start gap-3">
              <p role="status" className="text-sm text-ink-600">
                {t("reportAccess.partnerPermissionRequired", { ns: "result" })}
              </p>
              <Button asChild variant="secondary">
                <Link to="/app/privacy">{t("reportAccess.openPrivacy", { ns: "result" })}</Link>
              </Button>
            </div>
          ) : null}
          {consents.isSuccess && allowed ? (
            <>
              <form
                className="flex flex-col items-start gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!isValidPrototypeReportCode(partnerCode)) {
                    setPartnerCodeInvalid(true);
                    setPartnerCodeAccepted(false);
                    return;
                  }
                  setPartnerCodeInvalid(false);
                  setPartnerCodeAccepted(true);
                  setPartnerAttempt((attempt) => attempt + 1);
                }}
              >
                <label
                  htmlFor="partner-report-code"
                  className="text-sm font-semibold text-teal-900"
                >
                  {t("reportAccess.partnerCodeLabel", { ns: "result" })}
                </label>
                <input
                  id="partner-report-code"
                  name="partnerReportCode"
                  type="text"
                  lang="en"
                  dir="ltr"
                  autoComplete="off"
                  maxLength={REPORT_CODE_LENGTH}
                  inputMode="numeric"
                  value={partnerCode}
                  aria-invalid={partnerCodeInvalid}
                  aria-describedby={partnerCodeInvalid ? "partner-report-code-error" : undefined}
                  onChange={(event) => {
                    setPartnerCode(sanitizeReportAccessCodeInput(event.target.value));
                    setPartnerCodeInvalid(false);
                    setPartnerCodeAccepted(false);
                  }}
                  className="min-h-12 w-full max-w-sm rounded-lg border border-border-subtle bg-background px-4 font-mono text-lg tracking-[0.18em] text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                  placeholder={t("reportAccess.partnerCodePlaceholder", { ns: "result" })}
                />
                {partnerCodeInvalid ? (
                  <p
                    id="partner-report-code-error"
                    role="alert"
                    className="text-sm font-medium text-danger-600"
                  >
                    {t("reportAccess.invalidPartnerCode", { ns: "result" })}
                  </p>
                ) : null}
                <Button type="submit">{t("reportAccess.unlockPartner", { ns: "result" })}</Button>
              </form>
              {partnerCodeAccepted ? (
                <div className="flex flex-col gap-3" aria-live="polite">
                  <h3 className="text-lg font-semibold text-teal-900">
                    {t("reportAccess.overlapHeading", { ns: "result" })}
                  </h3>
                  {overlap.isPending ? <Skeleton label={t("loading", { ns: "result" })} /> : null}
                  {overlap.isError ? (
                    <ErrorState
                      title={t("error", { ns: "result" })}
                      retryLabel={t("retry", { ns: "result" })}
                      onRetry={() => {
                        void overlap.refetch();
                      }}
                      {...contact}
                    />
                  ) : null}
                  {overlap.isSuccess &&
                  (overlap.data === null ||
                    overlap.data.hidden ||
                    overlap.data.genes.length === 0) ? (
                    <EmptyState title={t("empty", { ns: "result" })} />
                  ) : null}
                  {overlap.data !== undefined && overlap.data !== null && !overlap.data.hidden ? (
                    <ul className="flex flex-col gap-4">
                      {overlap.data.genes.map((gene) => (
                        <li key={gene.id}>
                          <ResultCard carrier={gene} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      ) : null}

      <section className="flex flex-col gap-4" data-result-section="explainer">
        <h2 className="text-xl font-semibold text-teal-900">
          {t("explainer.heading", { ns: "result" })}
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {(
            [
              ["means", "What a carrier result means"],
              ["limits", "What this does and does not establish"],
              ["partner", "Why a partner's result may matter"],
              ["counsellor", "When a genetic counsellor should review this"],
            ] as const
          ).map(([key, english]) => (
            <article
              key={key}
              className="flex flex-col gap-2 rounded-lg border border-border-subtle bg-sand-100 p-6 shadow-xs"
            >
              <h3 className="text-lg font-semibold text-teal-900">
                {landmarkName(t(`explainer.${key}.title`, { ns: "result" }), english)}
              </h3>
              <p className="text-base leading-relaxed text-ink-600">
                {t(`explainer.${key}.body`, { ns: "result" })}
              </p>
            </article>
          ))}
        </div>
      </section>

      <InheritanceExample />

      {factCard !== null ? (
        <section className="flex flex-col gap-3" data-result-section="stored-example">
          <h2 className="text-xl font-semibold text-teal-900">
            {t("example.stored", { ns: "result" })}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-ink-600">
            {t("example.storedLead", { ns: "result" })}
          </p>
          <FactCard card={factCard} />
        </section>
      ) : null}

      <section className="flex flex-col gap-4" data-result-section="next">
        <h2 className="text-xl font-semibold text-teal-900">
          {t("next.heading", { ns: "result" })}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-ink-600">
          {t("next.lead", { ns: "result" })}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link to="/app/privacy">{t("reportAccess.openPrivacy", { ns: "result" })}</Link>
          </Button>
        </div>
      </section>
    </AppPageLayout>
  );
}
