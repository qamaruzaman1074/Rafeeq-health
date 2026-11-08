import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { getSessionPersona, subscribeSession } from "@/app/session";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { Badge } from "@/components/ui/badge";
import { useFailureToast } from "@/components/ui/toast";
import { fetchOwnResult } from "@/features/result/api";
import { ResultCard } from "@/features/result/result-card";

export function ResultView() {
  const { t } = useTranslation();
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  const result = useQuery({
    queryKey: ["results", "mine", personaId],
    queryFn: fetchOwnResult,
    retry: false,
  });
  const contact = humanContact(t);
  useFailureToast(result.isError, t("error", { ns: "result" }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-teal-900">{t("page.title", { ns: "result" })}</h1>
      <Badge variant="notice">{t("prototype", { ns: "result" })}</Badge>
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
    </div>
  );
}
