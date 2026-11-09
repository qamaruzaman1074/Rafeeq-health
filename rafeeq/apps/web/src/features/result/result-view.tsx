import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { getSessionPersona, subscribeSession } from "@/app/session";
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
import { InheritanceExample } from "@/features/result/inheritance-example";
import { ResultMeanings } from "@/features/result/meanings";
import { fetchOwnResult } from "@/features/result/api";
import { ResultCard } from "@/features/result/result-card";
import { landmarkName } from "@/lib/landmark-name";

export function ResultView() {
  const { t } = useTranslation();
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  const result = useQuery({
    queryKey: ["results", "mine", personaId],
    queryFn: fetchOwnResult,
    retry: false,
  });
  const consents = useQuery({
    queryKey: ["consents", personaId],
    queryFn: fetchConsents,
    retry: false,
  });
  const allowed = consents.isSuccess && shareGate(consents.data) === "allowed";
  const explain = useQuery({
    queryKey: ["explain", "overlap", personaId],
    queryFn: explainOverlap,
    enabled: allowed,
    retry: false,
  });
  const contact = humanContact(t);
  useFailureToast(result.isError, t("error", { ns: "result" }));

  const factCard = allowed ? (explain.data?.fact_card ?? null) : null;

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

      <section
        className="flex flex-col gap-4"
        data-result-section="own"
        aria-labelledby="own-result-heading"
      >
        <h2 id="own-result-heading" className="text-xl font-semibold text-teal-900">
          {t("own.heading", { ns: "result" })}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-ink-600">
          {t("own.lead", { ns: "result" })}
        </p>
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
            <Link to="/app/learn">{t("next.learn", { ns: "result" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/check">{t("next.check", { ns: "result" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/couple">{t("next.together", { ns: "result" })}</Link>
          </Button>
          <Button asChild>
            <Link to="/app/care">{t("next.care", { ns: "result" })}</Link>
          </Button>
        </div>
      </section>
    </AppPageLayout>
  );
}
