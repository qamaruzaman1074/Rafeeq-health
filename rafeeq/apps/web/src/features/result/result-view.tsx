import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { getSessionPersona, subscribeSession } from "@/app/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-teal-900">{t("page.title", { ns: "result" })}</h1>
      <Badge variant="notice">{t("prototype", { ns: "result" })}</Badge>
      {result.isPending ? <p>{t("loading", { ns: "result" })}</p> : null}
      {result.isError ? (
        <div role="alert" className="flex flex-col items-start gap-3">
          <p>{t("error", { ns: "result" })}</p>
          <Button
            variant="secondary"
            onClick={() => {
              void result.refetch();
            }}
          >
            {t("retry", { ns: "result" })}
          </Button>
        </div>
      ) : null}
      {result.isSuccess && result.data === null ? <p>{t("empty", { ns: "result" })}</p> : null}
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
          {result.data.carriers.length === 0 ? <p>{t("empty", { ns: "result" })}</p> : null}
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
