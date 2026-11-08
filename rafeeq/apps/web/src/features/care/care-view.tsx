import { useState, useSyncExternalStore } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getSessionPersona, subscribeSession } from "@/app/session";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { useFailureToast, useNotify } from "@/components/ui/toast";
import { fetchPathway, pathwayQueryKey, postReferral } from "@/features/care/api";
import { BookingCalendar } from "@/features/care/booking-calendar";
import { InfoCards } from "@/features/care/info-cards";
import { PathwayTimeline } from "@/features/care/pathway-timeline";
import { clinicShareGranted } from "@/features/care/steps";
import { landmarkName } from "@/lib/landmark-name";
import { SendReferral } from "@/features/care/send-referral";
import { StatusChips } from "@/features/care/status-chips";
import { fetchMineConsents, mineConsentQueryKey } from "@/features/privacy/api";

export function CareView() {
  const { t } = useTranslation();
  const notify = useNotify();
  const contact = humanContact(t);
  const queryClient = useQueryClient();
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  const pathwayKey = pathwayQueryKey(personaId);
  const pathway = useQuery({
    queryKey: pathwayKey,
    queryFn: fetchPathway,
    retry: false,
  });
  const mine = useQuery({
    queryKey: mineConsentQueryKey(personaId),
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
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-teal-900">{t("page.title", { ns: "care" })}</h1>
        <p>{t("page.intro", { ns: "care" })}</p>
      </header>

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
          <>
            <PathwayTimeline pathway={pathway.data} />
            <StatusChips status={pathway.data.status} />
          </>
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
    </div>
  );
}
