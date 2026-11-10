import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { metricTitle } from "@/features/insights/labels";
import { kpiParts } from "@/features/insights/present";
import type { KpiMetric } from "@/features/insights/types";
import { useNumerals } from "@/i18n/numerals";

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const { t } = useTranslation();
  const { formatNumber } = useNumerals();
  const parts = kpiParts(metric, t, formatNumber);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{metricTitle(metric.id, t)}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {parts.map((part) => (
          <p key={part.key} data-kpi-result={metric.id}>
            {part.text}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
