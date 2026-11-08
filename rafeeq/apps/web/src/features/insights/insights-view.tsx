import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SyntheticBadge } from "@/components/synthetic-badge";
import { Button } from "@/components/ui/button";
import { equityQueryKey, fetchEquity, fetchKpis, kpiQueryKey } from "@/features/insights/api";
import { EquityChart } from "@/features/insights/equity-chart";
import { KpiCard } from "@/features/insights/kpi-card";
import { metricTitle } from "@/features/insights/labels";
import { K_ANONYMITY_FLOOR } from "@/features/insights/suppress";
import type { EquityReport, KpiReport } from "@/features/insights/types";

function LoadError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <p>{t("error", { ns: "insights" })}</p>
      <Button variant="secondary" onClick={onRetry}>
        {t("retry", { ns: "insights" })}
      </Button>
    </div>
  );
}

export function InsightsPanels({ kpis, equity }: { kpis: KpiReport; equity: EquityReport }) {
  const { t } = useTranslation();
  const metric =
    equity.metric_id === null
      ? t("content.missing", { ns: "common" })
      : metricTitle(equity.metric_id, t);

  return (
    <div className="flex min-w-0 flex-col gap-8">
      {kpis.k_anonymity !== K_ANONYMITY_FLOOR ? (
        <p>{t("content.missing", { ns: "common" })}</p>
      ) : null}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-teal-900">
          {t("kpis.heading", { ns: "insights" })}
        </h2>
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {kpis.metrics.map((metricRow) => (
            <li key={metricRow.id}>
              <KpiCard metric={metricRow} />
            </li>
          ))}
        </ul>
      </section>
      <section className="flex min-w-0 flex-col gap-6">
        <h2 className="text-2xl font-semibold text-teal-900">
          {t("equity.heading", { ns: "insights" })}
        </h2>
        <p>{metric}</p>
        {equity.series.map((series) => (
          <EquityChart key={series.dimension} series={series} />
        ))}
      </section>
    </div>
  );
}

export function InsightsView() {
  const { t } = useTranslation();
  const kpis = useQuery({
    queryKey: kpiQueryKey(),
    queryFn: fetchKpis,
    retry: false,
  });
  const equity = useQuery({
    queryKey: equityQueryKey(),
    queryFn: fetchEquity,
    retry: false,
  });
  const pending = kpis.isPending || equity.isPending;
  const failed = kpis.isError || equity.isError;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <SyntheticBadge />
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-teal-900">
          {t("page.title", { ns: "insights" })}
        </h1>
        <p>{t("page.intro", { ns: "insights" })}</p>
        <p>{t("notice.k", { ns: "insights" })}</p>
      </header>
      {pending ? <p>{t("loading", { ns: "insights" })}</p> : null}
      {failed ? (
        <LoadError
          onRetry={() => {
            void kpis.refetch();
            void equity.refetch();
          }}
        />
      ) : null}
      {kpis.isSuccess && equity.isSuccess && (kpis.data === null || equity.data === null) ? (
        <p>{t("unavailable", { ns: "insights" })}</p>
      ) : null}
      {kpis.isSuccess && equity.isSuccess && kpis.data !== null && equity.data !== null ? (
        <InsightsPanels kpis={kpis.data} equity={equity.data} />
      ) : null}
    </div>
  );
}
