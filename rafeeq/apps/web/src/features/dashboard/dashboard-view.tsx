import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useLiteracy } from "@/app/literacy";
import { getSessionPersona, subscribeSession } from "@/app/session";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { SyntheticBadge } from "@/components/synthetic-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFailureToast } from "@/components/ui/toast";
import { fetchPathway, pathwayQueryKey } from "@/features/care/api";
import { stepLabel, statusLabel } from "@/features/care/labels";
import { PathwayProgress } from "@/features/check/pathway";
import { isCheckComplete, subscribeCheckProgress } from "@/features/check/progress";
import { fetchConsents } from "@/features/couple/api";
import {
  availableLearnTopicCount,
  counsellingStatus,
  listedConditionName,
  mineGrant,
  partnerShareStatus,
  resultStatus,
} from "@/features/dashboard/summaries";
import { findPersona } from "@/features/personas";
import {
  fetchMineConsents,
  mineConsentQueryKey,
  partnerConsentQueryKey,
} from "@/features/privacy/api";
import { scopeLabel } from "@/features/privacy/labels";
import { fetchOwnResult } from "@/features/result/api";
import { useNumerals } from "@/i18n/numerals";
import { landmarkName } from "@/lib/landmark-name";

function DashboardCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="h-full hover:shadow-surface">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description !== undefined ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {children}
        {action}
      </CardContent>
    </Card>
  );
}

function OpenLink({ to, label }: { to: string; label: string }) {
  return (
    <Button asChild variant="secondary">
      <Link to={to}>{label}</Link>
    </Button>
  );
}

export function DashboardView() {
  const { t } = useTranslation();
  const numerals = useNumerals();
  const { mode } = useLiteracy();
  const contact = humanContact(t);
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  const checkDone = useSyncExternalStore(subscribeCheckProgress, isCheckComplete, isCheckComplete);
  const persona = personaId === null ? undefined : findPersona(personaId);

  const own = useQuery({
    queryKey: ["results", "mine", personaId],
    queryFn: fetchOwnResult,
    retry: false,
  });
  const pathway = useQuery({
    queryKey: pathwayQueryKey(personaId),
    queryFn: fetchPathway,
    retry: false,
  });
  const mine = useQuery({
    queryKey: mineConsentQueryKey(personaId),
    queryFn: fetchMineConsents,
    retry: false,
  });
  const partners = useQuery({
    queryKey: partnerConsentQueryKey(personaId),
    queryFn: fetchConsents,
    retry: false,
  });

  const loadFailed = own.isError || pathway.isError || mine.isError || partners.isError;
  useFailureToast(loadFailed, t("home.loadError", { ns: "couple" }));

  const welcome =
    persona !== undefined
      ? t("home.welcome", { ns: "couple", names: persona.names })
      : t("home.welcomeGuest", { ns: "couple" });
  const topicCount = numerals.formatNumber(availableLearnTopicCount());
  const literacyLabel = t(`shell.literacy.${mode}`);
  const screening = resultStatus(own.data);
  const condition = listedConditionName(own.data);
  const care = counsellingStatus(pathway.data);
  const partner = partnerShareStatus(partners.data);
  const overlapMine = mineGrant(mine.data, "share_overlap_with_partner");
  const clinicMine = mineGrant(mine.data, "share_with_clinic");
  const suggested = checkDone
    ? t("pathway.share", { ns: "check" })
    : t("pathway.check", { ns: "check" });

  return (
    <AppPageLayout width="wide">
      <PageHeader
        eyebrow={<SyntheticBadge />}
        title={t("home.title", { ns: "couple" })}
        description={t("home.intro", { ns: "couple" })}
      />

      <section
        data-dashboard-section="welcome"
        className="rounded-lg border border-border-subtle bg-sand-100 ps-4 pe-4 py-5 sm:ps-6 sm:pe-6"
        aria-label={landmarkName(t("home.welcomeRegion", { ns: "couple" }), "Welcome")}
      >
        <p className="text-xl font-semibold text-teal-900">{welcome}</p>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-600">
          {t("home.welcomeBody", { ns: "couple" })}
        </p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-900">
          {t("dashboardExtras.welcome", { ns: "couple" })}{" "}
          {t("dashboardExtras.welcomeBody", { ns: "couple" })}
        </p>
        <nav
          aria-label={t("dashboardExtras.heading", { ns: "couple" })}
          className="mt-4 flex flex-wrap gap-3"
        >
          <OpenLink to="/app/report" label={t("dashboardExtras.report", { ns: "couple" })} />
          <OpenLink to="/app/partner" label={t("dashboardExtras.partner", { ns: "couple" })} />
          <OpenLink
            to="/app/notifications"
            label={t("dashboardExtras.notifications", { ns: "couple" })}
          />
        </nav>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section data-dashboard-section="results">
          <DashboardCard
            title={t("home.results.title", { ns: "couple" })}
            description={t("home.results.lead", { ns: "couple" })}
            action={
              <OpenLink to="/app/result" label={t("home.results.action", { ns: "couple" })} />
            }
          >
            {own.isPending ? <Skeleton label={t("loading", { ns: "result" })} /> : null}
            {own.isError ? (
              <ErrorState
                title={t("error", { ns: "result" })}
                retryLabel={t("retry", { ns: "result" })}
                onRetry={() => {
                  void own.refetch();
                }}
                {...contact}
              />
            ) : null}
            {own.isSuccess && screening === "empty" ? (
              <EmptyState title={t("home.results.empty", { ns: "couple" })} />
            ) : null}
            {own.isSuccess && screening === "none" ? (
              <p>{t("home.results.none", { ns: "couple" })}</p>
            ) : null}
            {own.isSuccess && screening === "listed" ? (
              <p>
                {t("home.results.listed", { ns: "couple" })}
                {condition !== null ? (
                  <>
                    {" "}
                    <span lang="en" dir="ltr">
                      ({condition})
                    </span>
                  </>
                ) : null}
              </p>
            ) : null}
          </DashboardCard>
        </section>

        <section data-dashboard-section="understanding">
          <DashboardCard
            title={t("home.understanding.title", { ns: "couple" })}
            description={t("home.understanding.lead", { ns: "couple" })}
            action={
              <div className="flex flex-wrap gap-3">
                <OpenLink
                  to="/app/learn"
                  label={t("home.understanding.learnAction", { ns: "couple" })}
                />
                <OpenLink
                  to="/app/check"
                  label={t("home.understanding.checkAction", { ns: "couple" })}
                />
              </div>
            }
          >
            <p>{t("home.understanding.reading", { ns: "couple", mode: literacyLabel })}</p>
            <p>{t("home.understanding.topics", { ns: "couple", count: topicCount })}</p>
            <p>
              {checkDone
                ? t("home.understanding.checkDone", { ns: "couple" })
                : t("home.understanding.checkOpen", { ns: "couple" })}
            </p>
            <p className="text-sm text-ink-600">{t("home.understanding.note", { ns: "couple" })}</p>
          </DashboardCard>
        </section>

        <section data-dashboard-section="counselling">
          <DashboardCard
            title={t("home.counselling.title", { ns: "couple" })}
            description={t("home.counselling.lead", { ns: "couple" })}
            action={
              <OpenLink to="/app/care" label={t("home.counselling.action", { ns: "couple" })} />
            }
          >
            {pathway.isPending ? <Skeleton label={t("loading", { ns: "care" })} /> : null}
            {pathway.isError ? (
              <ErrorState
                title={t("error", { ns: "care" })}
                retryLabel={t("retry", { ns: "care" })}
                onRetry={() => {
                  void pathway.refetch();
                }}
                {...contact}
              />
            ) : null}
            {pathway.isSuccess && care.current === null ? (
              <EmptyState title={t("home.counselling.empty", { ns: "couple" })} />
            ) : null}
            {pathway.isSuccess && care.current !== null ? (
              <>
                <p>
                  {t("home.counselling.current", {
                    ns: "couple",
                    step: stepLabel(care.current, t),
                  })}
                </p>
                <p>
                  {care.referral !== null
                    ? t("home.counselling.status", {
                        ns: "couple",
                        status: statusLabel(care.referral, t),
                      })
                    : t("home.counselling.none", { ns: "couple" })}
                </p>
              </>
            ) : null}
          </DashboardCard>
        </section>

        <section data-dashboard-section="privacy">
          <DashboardCard
            title={t("home.privacy.title", { ns: "couple" })}
            description={t("home.privacy.lead", { ns: "couple" })}
            action={
              <OpenLink to="/app/privacy" label={t("home.privacy.action", { ns: "couple" })} />
            }
          >
            {mine.isPending || partners.isPending ? (
              <Skeleton label={t("loading", { ns: "privacy" })} />
            ) : null}
            {mine.isError || partners.isError ? (
              <ErrorState
                title={t("error", { ns: "privacy" })}
                retryLabel={t("retry", { ns: "privacy" })}
                onRetry={() => {
                  void mine.refetch();
                  void partners.refetch();
                }}
                {...contact}
              />
            ) : null}
            {mine.isSuccess && partners.isSuccess && partner === "empty" && overlapMine === null ? (
              <EmptyState title={t("home.privacy.empty", { ns: "couple" })} />
            ) : null}
            {mine.isSuccess &&
            partners.isSuccess &&
            (partner !== "empty" || overlapMine !== null) ? (
              <ul className="flex flex-col gap-2">
                <li>{t("home.privacy.own", { ns: "couple" })}</li>
                {overlapMine !== null ? (
                  <li>
                    {scopeLabel("share_overlap_with_partner", t)}
                    {": "}
                    {overlapMine
                      ? t("home.privacy.choiceOn", { ns: "couple" })
                      : t("home.privacy.choiceOff", { ns: "couple" })}
                  </li>
                ) : null}
                {clinicMine !== null ? (
                  <li>
                    {scopeLabel("share_with_clinic", t)}
                    {": "}
                    {clinicMine
                      ? t("home.privacy.choiceOn", { ns: "couple" })
                      : t("home.privacy.choiceOff", { ns: "couple" })}
                  </li>
                ) : null}
                {partner === "allowed" ? (
                  <li>{t("home.privacy.partnerOn", { ns: "couple" })}</li>
                ) : null}
                {partner === "declined" ? (
                  <li>{t("home.privacy.partnerDeclined", { ns: "couple" })}</li>
                ) : null}
                {partner === "missing" ? (
                  <li>{t("home.privacy.partnerMissing", { ns: "couple" })}</li>
                ) : null}
              </ul>
            ) : null}
          </DashboardCard>
        </section>
      </div>

      <section data-dashboard-section="next" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-teal-900">
            {t("home.next.title", { ns: "couple" })}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-ink-600">
            {t("home.next.intro", { ns: "couple" })}
          </p>
          <p>{t("home.next.suggested", { ns: "couple", label: suggested })}</p>
        </div>
        <PathwayProgress />
      </section>
    </AppPageLayout>
  );
}
