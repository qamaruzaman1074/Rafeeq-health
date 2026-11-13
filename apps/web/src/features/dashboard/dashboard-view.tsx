import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  getSessionIdentity,
  getSessionPersona,
  isSupabaseAuthenticated,
  subscribeSession,
} from "@/app/session";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState, humanContact } from "@/components/error-state";
import { SyntheticBadge } from "@/components/synthetic-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOwnAccountDisplay } from "@/features/auth/supabase-auth";
import { findPersona } from "@/features/personas";
import { COMPREHENSION_TOPIC_IDS } from "@/features/comprehension-access/content-model";
import {
  learningProgressSnapshot,
  subscribeLearningProgress,
} from "@/features/comprehension-access/learning-progress";
import {
  CircularProgress,
  HorizontalProgress,
  progressPercent,
} from "@/features/dashboard/progress-indicators";
import { usePrototypeReportAccess } from "@/features/report-access/prototype-report-access";
import { ReportUploadForm } from "@/features/reports/report-upload-form";
import { fetchOwnReports } from "@/features/reports/supabase-reports";
import { useNumerals } from "@/i18n/numerals";

function OverviewCard({
  title,
  description,
  image,
  children,
}: {
  title: string;
  description: string;
  image: string;
  children: ReactNode;
}) {
  return (
    <Card className="motion-card-lift h-full overflow-hidden">
      <img src={image} alt="" className="h-40 w-full object-cover" loading="lazy" />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function SummaryCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="motion-card-lift flex min-h-32 flex-col justify-between rounded-xl border border-border-subtle bg-card p-5 shadow-xs">
      <p className="text-sm font-semibold text-ink-600">{label}</p>
      <p className="motion-text-reveal text-2xl font-semibold text-teal-900">{value}</p>
      <p className="text-sm text-ink-600">{detail}</p>
    </div>
  );
}

function formatReportDate(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

export function DashboardView() {
  const { t, i18n } = useTranslation();
  const { formatNumber } = useNumerals();
  const identity = useSyncExternalStore(subscribeSession, getSessionIdentity, getSessionIdentity);
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  const authenticated = useSyncExternalStore(
    subscribeSession,
    isSupabaseAuthenticated,
    () => false,
  );
  const demoAccess = usePrototypeReportAccess();
  const learningProgress = useSyncExternalStore(
    subscribeLearningProgress,
    learningProgressSnapshot,
    learningProgressSnapshot,
  );
  const accountQuery = useQuery({
    queryKey: ["profile", "account-display", identity],
    queryFn: getOwnAccountDisplay,
    enabled: authenticated && identity !== null,
    retry: false,
  });
  const reportsQuery = useQuery({
    queryKey: ["reports", "mine", identity],
    queryFn: fetchOwnReports,
    enabled: authenticated && identity !== null,
    retry: false,
  });
  const completedChecks = learningProgress.checksCompleted.length;
  const visitedTopics = learningProgress.topicsVisited.length;
  const totalTopics = COMPREHENSION_TOPIC_IDS.length;
  const learningPercent = progressPercent(completedChecks, totalTopics);
  const resourcesPercent = progressPercent(visitedTopics, totalTopics);
  const completedJourneyActivities = visitedTopics + completedChecks;
  const totalJourneyActivities = totalTopics * 2;
  const journeyPercent = progressPercent(completedJourneyActivities, totalJourneyActivities);
  const profileFieldsCompleted = [
    accountQuery.data?.displayName?.trim(),
    accountQuery.data?.email?.trim(),
  ].filter((field) => field !== undefined && field !== null && field.length > 0).length;
  const profileFieldTotal = 2;
  const profilePercent = authenticated
    ? progressPercent(profileFieldsCompleted, profileFieldTotal)
    : 0;
  const accountName = authenticated
    ? accountQuery.data?.displayName?.trim() ||
      accountQuery.data?.email ||
      t("home.memberName", { ns: "couple" })
    : ((personaId === null ? undefined : findPersona(personaId)?.names) ??
      t("home.memberName", { ns: "couple" }));
  const reportCount = authenticated
    ? reportsQuery.isPending
      ? t("home.summary.loading", { ns: "couple" })
      : reportsQuery.isError
        ? "—"
        : String(reportsQuery.data.length)
    : demoAccess.code === null
      ? "0"
      : "1";
  const newestReport = authenticated ? reportsQuery.data?.[0] : undefined;
  const contact = humanContact(t);

  return (
    <AppPageLayout width="wide">
      <PageHeader
        eyebrow={authenticated ? undefined : <SyntheticBadge />}
        title={t("home.title", { ns: "couple" })}
        description={t("home.intro", { ns: "couple" })}
        actions={
          <Button asChild variant="secondary">
            <Link to="/app/ask">{t("home.askAction", { ns: "couple" })}</Link>
          </Button>
        }
      />

      <section
        data-dashboard-section="overview"
        className="motion-card-lift grid gap-6 overflow-hidden rounded-2xl border border-border-subtle bg-card p-5 shadow-xs sm:p-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] lg:items-center"
      >
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold text-teal-800">
            {t("home.welcome", { ns: "couple", name: accountName })}
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">
            {t("home.heroEyebrow", { ns: "couple" })}
          </p>
          <h2 className="motion-text-reveal text-balance text-2xl font-semibold leading-tight text-teal-900 sm:text-3xl">
            {t("home.heroTitle", { ns: "couple" })}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-ink-600">
            {t("home.heroBody", { ns: "couple" })}
          </p>
          {accountQuery.isError ? (
            <p role="status" className="text-sm text-ink-600">
              {t("home.accountLoadError", { ns: "couple" })}
            </p>
          ) : null}
        </div>
        <img
          src="/images/outcomes/screening-pathways/laboratory.webp"
          alt={t("home.heroAlt", { ns: "couple" })}
          className="aspect-[4/3] max-h-72 w-full rounded-xl object-cover"
          loading="eager"
        />
      </section>

      <section
        aria-label={t("home.summary.heading", { ns: "couple" })}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <SummaryCard
          label={t("home.summary.reports", { ns: "couple" })}
          value={reportCount}
          detail={t("home.summary.reportsDetail", { ns: "couple" })}
        />
        <SummaryCard
          label={t("home.summary.learning", { ns: "couple" })}
          value={t("home.summary.progress", {
            ns: "couple",
            completed: completedChecks,
            total: totalTopics,
          })}
          detail={t("home.summary.learningDetail", { ns: "couple" })}
        />
        <SummaryCard
          label={t("home.summary.progressLabel", { ns: "couple" })}
          value={`${formatNumber(learningPercent)}%`}
          detail={t("home.summary.progressDetail", { ns: "couple" })}
        />
      </section>

      <ReportUploadForm />

      <section aria-labelledby="journey-progress-heading" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="journey-progress-heading" className="text-xl font-semibold text-teal-900">
              {t("home.journeyHeading", { ns: "couple" })}
            </h2>
            <p className="max-w-2xl text-base text-ink-600">
              {t("home.journeyBody", { ns: "couple" })}
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link to="/app/journey">{t("home.journeyAction", { ns: "couple" })}</Link>
          </Button>
        </div>
        <div
          role="group"
          aria-label={t("home.progress.indicatorsLabel", { ns: "couple" })}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <CircularProgress
            label={t("home.progress.journey", { ns: "couple" })}
            detail={t("home.progress.journeyActivitiesDetail", {
              ns: "couple",
              completed: formatNumber(completedJourneyActivities),
              total: formatNumber(totalJourneyActivities),
            })}
            value={journeyPercent}
            tone="teal"
          />
          <CircularProgress
            label={t("home.progress.learning", { ns: "couple" })}
            detail={t("home.progress.checksDetail", {
              ns: "couple",
              completed: formatNumber(completedChecks),
              total: formatNumber(totalTopics),
            })}
            value={learningPercent}
            tone="gold"
          />
          <CircularProgress
            label={t("home.progress.profile", { ns: "couple" })}
            detail={t("home.progress.profileDetail", {
              ns: "couple",
              completed: formatNumber(authenticated ? profileFieldsCompleted : 0),
              total: formatNumber(profileFieldTotal),
            })}
            value={profilePercent}
            tone="green"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <HorizontalProgress
            label={t("home.progress.healthJourney", { ns: "couple" })}
            detail={t("home.progress.journeyActivitiesDetail", {
              ns: "couple",
              completed: formatNumber(completedJourneyActivities),
              total: formatNumber(totalJourneyActivities),
            })}
            value={journeyPercent}
            colorClass="bg-teal-700"
            accentClass="bg-teal-700"
            trackClass="bg-teal-100"
          />
          <HorizontalProgress
            label={t("home.progress.resources", { ns: "couple" })}
            detail={t("home.progress.topicsDetail", {
              ns: "couple",
              completed: formatNumber(visitedTopics),
              total: formatNumber(totalTopics),
            })}
            value={resourcesPercent}
            colorClass="bg-gold-500"
            accentClass="bg-gold-500"
            trackClass="bg-amber-100"
          />
          <HorizontalProgress
            label={t("home.progress.activities", { ns: "couple" })}
            detail={t("home.progress.checksDetail", {
              ns: "couple",
              completed: formatNumber(completedChecks),
              total: formatNumber(totalTopics),
            })}
            value={learningPercent}
            colorClass="bg-green-600"
            accentClass="bg-green-600"
            trackClass="bg-lilac-100"
          />
          <HorizontalProgress
            label={t("home.progress.profile", { ns: "couple" })}
            detail={t("home.progress.profileDetail", {
              ns: "couple",
              completed: formatNumber(authenticated ? profileFieldsCompleted : 0),
              total: formatNumber(profileFieldTotal),
            })}
            value={profilePercent}
            colorClass="bg-teal-500"
            accentClass="bg-teal-500"
            trackClass="bg-sand-100"
          />
        </div>
      </section>

      <section aria-labelledby="recent-activity-heading" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="recent-activity-heading" className="text-xl font-semibold text-teal-900">
            {t("home.activity.heading", { ns: "couple" })}
          </h2>
          <Button asChild variant="ghost">
            <Link to="/app/reports">{t("home.activity.openReports", { ns: "couple" })}</Link>
          </Button>
        </div>
        {authenticated && reportsQuery.isError ? (
          <ErrorState
            title={t("home.activity.loadError", { ns: "couple" })}
            retryLabel={t("home.activity.retry", { ns: "couple" })}
            onRetry={() => void reportsQuery.refetch()}
            {...contact}
          />
        ) : null}
        {authenticated && reportsQuery.isPending ? (
          <p
            role="status"
            className="rounded-xl border border-border-subtle bg-card p-5 text-ink-600"
          >
            {t("home.activity.loading", { ns: "couple" })}
          </p>
        ) : null}
        {newestReport !== undefined ? (
          <article className="motion-card-lift flex flex-col gap-2 rounded-xl border border-border-subtle bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="break-words font-semibold text-teal-900">{newestReport.file_name}</h3>
              <p className="text-sm text-ink-600">
                <time dateTime={newestReport.created_at}>
                  {formatReportDate(
                    newestReport.created_at,
                    i18n.resolvedLanguage ?? i18n.language,
                  )}
                </time>
              </p>
              <p className="text-sm text-ink-600">
                {t("home.activity.codeLabel", { ns: "couple" })}:{" "}
                <span lang="en" dir="ltr" className="font-mono font-semibold text-ink-900">
                  {newestReport.access_code}
                </span>
              </p>
            </div>
            <Button asChild variant="secondary">
              <Link to="/app/reports">{t("home.activity.openReport", { ns: "couple" })}</Link>
            </Button>
          </article>
        ) : null}
        {!authenticated && demoAccess.code !== null ? (
          <p className="rounded-xl border border-border-subtle bg-card p-5 text-ink-600">
            {t("home.activity.demoCode", { ns: "couple" })}
          </p>
        ) : null}
        {completedChecks > 0 ? (
          <article className="motion-card-lift flex flex-col gap-2 rounded-xl border border-border-subtle bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <p className="text-ink-600">
              {t("home.activity.learning", { ns: "couple", count: completedChecks })}
            </p>
            <Button asChild variant="secondary">
              <Link to="/app/journey">{t("home.journeyAction", { ns: "couple" })}</Link>
            </Button>
          </article>
        ) : null}
        {(!authenticated && demoAccess.code === null && completedChecks === 0) ||
        (authenticated &&
          reportsQuery.isSuccess &&
          reportsQuery.data.length === 0 &&
          completedChecks === 0) ? (
          <p className="rounded-xl border border-border-subtle bg-card p-5 text-ink-600">
            {t("home.activity.empty", { ns: "couple" })}
          </p>
        ) : null}
      </section>

      <section
        aria-label={t("home.quickLinksLabel", { ns: "couple" })}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <OverviewCard
          title={t("home.resultsCard.title", { ns: "couple" })}
          description={t("home.resultsCard.description", { ns: "couple" })}
          image="/images/outcomes/inherited-risk/hero-genetics.webp"
        >
          <Button asChild variant="secondary">
            <Link to="/app/reports">{t("home.resultsCard.action", { ns: "couple" })}</Link>
          </Button>
        </OverviewCard>
        <OverviewCard
          title={t("home.journeyCard.title", { ns: "couple" })}
          description={t("home.journeyCard.description", { ns: "couple" })}
          image="/images/outcomes/informed-choices/reviewing-education.webp"
        >
          <Button asChild variant="secondary">
            <Link to="/app/journey">{t("home.journeyCard.action", { ns: "couple" })}</Link>
          </Button>
        </OverviewCard>
        <OverviewCard
          title={t("home.partnerCard.title", { ns: "couple" })}
          description={t("home.partnerCard.description", { ns: "couple" })}
          image="/images/outcomes/privacy/secure-sharing.svg"
        >
          <Button asChild variant="secondary">
            <Link to="/app/partner">{t("home.partnerCard.action", { ns: "couple" })}</Link>
          </Button>
        </OverviewCard>
        <OverviewCard
          title={t("home.resourcesCard.title", { ns: "couple" })}
          description={t("home.resourcesCard.description", { ns: "couple" })}
          image="/images/outcomes/comprehension-access/learning-journey.svg"
        >
          <Button asChild variant="secondary">
            <Link to="/app/resources">{t("home.resourcesCard.action", { ns: "couple" })}</Link>
          </Button>
        </OverviewCard>
        <OverviewCard
          title={t("home.privacyCard.title", { ns: "couple" })}
          description={t("home.privacyCard.description", { ns: "couple" })}
          image="/images/problem-solution/health-data-privacy.jpg"
        >
          <Button asChild variant="secondary">
            <Link to="/app/privacy">{t("home.privacyCard.action", { ns: "couple" })}</Link>
          </Button>
        </OverviewCard>
      </section>
    </AppPageLayout>
  );
}
