import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { getSessionPersona, subscribeSession } from "@/app/session";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { useFailureToast } from "@/components/ui/toast";
import { explainOverlap, fetchConsents } from "@/features/couple/api";
import { FactCard } from "@/features/couple/fact-card";
import { shareGate } from "@/features/couple/share-state";
import { fetchOverlap } from "@/features/result/api";
import { ResultCard } from "@/features/result/result-card";

function PrivacyNotes() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <p>{t("gate.shared", { ns: "couple" })}</p>
      <p>{t("gate.whom", { ns: "couple" })}</p>
      <p>{t("gate.revoke", { ns: "couple" })}</p>
    </div>
  );
}

function DeclinedNotice() {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      className="flex flex-col gap-4 rounded-lg border border-teal-700 bg-lilac-100 p-4"
    >
      <p>{t("gate.declined", { ns: "couple" })}</p>
      <p>{t("content.missing", { ns: "common" })}</p>
      <PrivacyNotes />
    </div>
  );
}

export function ConsentGate() {
  const { t } = useTranslation();
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  const consents = useQuery({
    queryKey: ["consents", personaId],
    queryFn: fetchConsents,
    retry: false,
  });
  const gate = consents.isSuccess ? shareGate(consents.data) : null;
  const allowed = gate === "allowed";
  const overlap = useQuery({
    queryKey: ["results", "overlap", personaId],
    queryFn: fetchOverlap,
    enabled: allowed,
    retry: false,
  });
  const explain = useQuery({
    queryKey: ["explain", "overlap", personaId],
    queryFn: explainOverlap,
    enabled: allowed,
    retry: false,
  });
  const contact = humanContact(t);
  const loadFailed = consents.isError || overlap.isError || explain.isError;
  useFailureToast(loadFailed, t("error", { ns: "couple" }));

  if (consents.isPending) {
    return <Skeleton label={t("loading", { ns: "couple" })} />;
  }

  if (consents.isError) {
    return (
      <ErrorState
        title={t("error", { ns: "couple" })}
        retryLabel={t("retry", { ns: "couple" })}
        onRetry={() => {
          void consents.refetch();
        }}
        {...contact}
      />
    );
  }

  if (gate === "empty") {
    return <EmptyState title={t("empty", { ns: "couple" })} />;
  }

  if (gate === "declined") {
    return <DeclinedNotice />;
  }

  if (gate === "missing") {
    return (
      <div className="flex flex-col gap-4 rounded-lg border border-teal-700 bg-amber-100 p-4">
        <PrivacyNotes />
        <p>{t("content.missing", { ns: "common" })}</p>
      </div>
    );
  }

  if (overlap.isPending || explain.isPending) {
    return <Skeleton label={t("loading", { ns: "couple" })} />;
  }

  if (overlap.isError || explain.isError) {
    return (
      <ErrorState
        title={t("error", { ns: "couple" })}
        retryLabel={t("retry", { ns: "couple" })}
        onRetry={() => {
          void overlap.refetch();
          void explain.refetch();
        }}
        {...contact}
      />
    );
  }

  const shared = overlap.data;
  const explained = explain.data;
  if (
    shared === undefined ||
    shared === null ||
    shared.hidden ||
    explained === undefined ||
    explained === null ||
    explained.fact_card === null
  ) {
    return <EmptyState title={t("empty", { ns: "couple" })} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {shared.genes.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {shared.genes.map((gene) => (
            <li key={gene.id}>
              <ResultCard carrier={gene} />
            </li>
          ))}
        </ul>
      ) : null}
      <FactCard card={explained.fact_card} />
    </div>
  );
}
