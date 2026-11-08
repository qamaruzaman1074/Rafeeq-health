import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { getSessionPersona, subscribeSession } from "@/app/session";
import { Button } from "@/components/ui/button";
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

  if (consents.isPending) {
    return <p>{t("loading", { ns: "couple" })}</p>;
  }

  if (consents.isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p>{t("error", { ns: "couple" })}</p>
        <Button
          variant="secondary"
          onClick={() => {
            void consents.refetch();
          }}
        >
          {t("retry", { ns: "couple" })}
        </Button>
      </div>
    );
  }

  if (gate === "empty") {
    return <p>{t("empty", { ns: "couple" })}</p>;
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
    return <p>{t("loading", { ns: "couple" })}</p>;
  }

  if (overlap.isError || explain.isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p>{t("error", { ns: "couple" })}</p>
        <Button
          variant="secondary"
          onClick={() => {
            void overlap.refetch();
            void explain.refetch();
          }}
        >
          {t("retry", { ns: "couple" })}
        </Button>
      </div>
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
    return <p>{t("empty", { ns: "couple" })}</p>;
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
