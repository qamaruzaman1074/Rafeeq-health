import { useState, useSyncExternalStore } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { getSessionIdentity, getSessionPersona, subscribeSession } from "@/app/session";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { SyntheticBadge } from "@/components/synthetic-badge";
import { Button } from "@/components/ui/button";
import { useFailureToast, useNotify } from "@/components/ui/toast";
import { fetchPathway, pathwayQueryKey, postReferral } from "@/features/care/api";
import { BookingCalendar } from "@/features/care/booking-calendar";
import { InfoCards } from "@/features/care/info-cards";
import { PathwayTimeline } from "@/features/care/pathway-timeline";
import { clinicShareGranted } from "@/features/care/steps";
import { landmarkName } from "@/lib/landmark-name";
import { CareGuidanceSections } from "@/features/care/care-guidance-sections";
import { ReferralRequestPreview } from "@/features/genetic-counselling/referral-request-preview";
import { PathwayNextSteps } from "@/features/screening-pathways/pathway-breadcrumbs";
import { SendReferral } from "@/features/care/send-referral";
import { StatusChips } from "@/features/care/status-chips";
import { fetchMineConsents, mineConsentQueryKey } from "@/features/privacy/api";

export function CareView() {
  const { t } = useTranslation();
  const notify = useNotify();
  const contact = humanContact(t);
  const queryClient = useQueryClient();
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  const sessionIdentity = useSyncExternalStore(
    subscribeSession,
    getSessionIdentity,
    getSessionIdentity,
  );
  const pathwayKey = pathwayQueryKey(personaId);
  const pathway = useQuery({
    queryKey: pathwayKey,
    queryFn: fetchPathway,
    retry: false,
  });
  const mine = useQuery({
    queryKey: mineConsentQueryKey(sessionIdentity),
    queryFn: fetchMineConsents,
    retry: false,
  });
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);

  const consentRows = mine.isSuccess ? (mine.data ?? null) : null;
  useFailureToast(pathway.isError, t("error", { ns: "care" }));
  const granted = clinicShareGranted(consentRows);
  const recorded = pathway.data?.status != null;

  async function onSend(): Promise<void> {
    setSending(true);
    setSendFailed(false);
    try {
      await postReferral();
      await queryClient.invalidateQueries({ queryKey: pathwayKey });
      notify({ title: t("toast.success") });
    } catch {
      setSendFailed(true);
      notify({ title: t("send.failed", { ns: "care" }), variant: "error" });
    } finally {
      setSending(false);
    }
  }

  return (
    <AppPageLayout width="wide">
      <PageHeader
        eyebrow={<SyntheticBadge />}
        title={t("page.title", { ns: "care" })}
        description={t("page.intro", { ns: "care" })}
      />

      <p className="max-w-2xl text-base leading-relaxed text-ink-600">
        {t("page.notReplacement", { ns: "care" })}
      </p>

      <PathwayNextSteps from="care" />

      <CareGuidanceSections />

      <ReferralRequestPreview clinicShareOn={mine.isSuccess ? granted : null} />

      <section
        className="flex flex-col gap-3 rounded-xl border border-dashed border-teal-700 bg-sand-100 p-6"
        data-care-section="prototype-demo"
        aria-labelledby="care-prototype-heading"
      >
        <h2 id="care-prototype-heading" className="text-xl font-semibold text-teal-900">
          {t("prototypeDemo.heading", { ns: "care" })}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-ink-600">
          {t("prototypeDemo.lead", { ns: "care" })}
        </p>
      </section>

      <section
        className="flex flex-col gap-4"
        aria-label={landmarkName(
          t("timeline.heading", { ns: "care" }),
          t("timeline.heading", { ns: "care", lng: "en" }),
        )}
      >
        <h2 id="care-steps" className="text-2xl font-semibold text-teal-900">
          {t("timeline.heading", { ns: "care" })}
        </h2>
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
        {pathway.isSuccess && pathway.data === null ? (
          <EmptyState title={t("empty", { ns: "care" })} />
        ) : null}
        {pathway.data != null ? (
          <div className="rounded-lg border border-border-subtle bg-sand-100 p-6">
            <PathwayTimeline pathway={pathway.data} />
            <div className="mt-4">
              <StatusChips status={pathway.data.status} />
            </div>
          </div>
        ) : null}
      </section>

      <InfoCards />
      <BookingCalendar />
      <SendReferral
        enabled={granted && !recorded}
        pending={sending || mine.isPending}
        showShareHint={mine.isSuccess && !granted && !recorded}
        failed={sendFailed}
        onSend={() => {
          void onSend();
        }}
      />

      <section className="flex flex-col gap-3" data-care-section="next">
        <h2 className="text-xl font-semibold text-teal-900">{t("next.heading", { ns: "care" })}</h2>
        <p className="max-w-2xl text-base leading-relaxed text-ink-600">
          {t("next.lead", { ns: "care" })}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link to="/app/ask">{t("next.ask", { ns: "care" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/privacy">{t("next.privacy", { ns: "care" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/learn">{t("next.learn", { ns: "care" })}</Link>
          </Button>
        </div>
      </section>
    </AppPageLayout>
  );
}
