import { useState, useSyncExternalStore } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getSessionPersona, subscribeSession } from "@/app/session";
import { Button } from "@/components/ui/button";
import { fetchPathway, pathwayQueryKey, postReferral } from "@/features/care/api";
import { BookingCalendar } from "@/features/care/booking-calendar";
import { InfoCards } from "@/features/care/info-cards";
import { PathwayTimeline } from "@/features/care/pathway-timeline";
import { clinicShareGranted } from "@/features/care/steps";
import { SendReferral } from "@/features/care/send-referral";
import { StatusChips } from "@/features/care/status-chips";
import { fetchMineConsents, mineConsentQueryKey } from "@/features/privacy/api";

function LoadError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <p>{t("error", { ns: "care" })}</p>
      <Button variant="secondary" onClick={onRetry}>
        {t("retry", { ns: "care" })}
      </Button>
    </div>
  );
}

export function CareView() {
  const { t } = useTranslation();
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
  const granted = clinicShareGranted(consentRows);
  const recorded = pathway.data?.status != null;

  async function onSend(): Promise<void> {
    setSending(true);
    setSendFailed(false);
    try {
      await postReferral();
      await queryClient.invalidateQueries({ queryKey: pathwayKey });
    } catch {
      setSendFailed(true);
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

      <section className="flex flex-col gap-4" aria-labelledby="care-steps">
        <h2 id="care-steps" className="text-2xl font-semibold text-teal-900">
          {t("timeline.heading", { ns: "care" })}
        </h2>
        {pathway.isPending ? <p>{t("loading", { ns: "care" })}</p> : null}
        {pathway.isError ? (
          <LoadError
            onRetry={() => {
              void pathway.refetch();
            }}
          />
        ) : null}
        {pathway.isSuccess && pathway.data === null ? <p>{t("empty", { ns: "care" })}</p> : null}
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
