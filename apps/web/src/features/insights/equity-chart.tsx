import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { dimensionTitle, groupLabel } from "@/features/insights/labels";
import { equityCopy } from "@/features/insights/present";
import { plotValue } from "@/features/insights/suppress";
import type { EquitySeries } from "@/features/insights/types";
import { useNumerals } from "@/i18n/numerals";

export function EquityChart({
  series,
  tableOpen = false,
}: {
  series: EquitySeries;
  tableOpen?: boolean;
}) {
  const { t } = useTranslation();
  const { formatNumber } = useNumerals();
  const [open, setOpen] = useState(tableOpen);
  const tableId = useId();
  const listId = useId();
  const title = dimensionTitle(series.dimension, t);
  const rows = series.cells.map((cell) => {
    const group = groupLabel(series.dimension, cell.key, t);
    return {
      key: cell.key,
      group,
      copy: equityCopy(cell, group, t, formatNumber),
      plot: plotValue(cell),
    };
  });
  const alternative = rows.map((row) => row.copy.line).join(" ");

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <h3 className="text-xl font-semibold text-teal-900">{title}</h3>
      <ul
        id={listId}
        aria-label={t("chart.textAlternative", { ns: "insights" })}
        className="flex flex-col gap-2"
      >
        {rows.map((row) => (
          <li key={row.key} data-equity-cell={row.key}>
            {row.copy.line}
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="min-w-0 overflow-x-auto">
        <BarChart
          width={480}
          height={240}
          data={rows.map((row) => ({ label: row.group, value: row.plot }))}
          accessibilityLayer={false}
          desc={alternative}
        >
          <XAxis dataKey="label" />
          <YAxis hide />
          <Bar dataKey="value" fill="var(--teal-700)" isAnimationActive={false} />
        </BarChart>
      </div>
      <Button
        variant="secondary"
        aria-expanded={open}
        aria-controls={tableId}
        className="self-start focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        {open ? t("chart.hideTable", { ns: "insights" }) : t("chart.showTable", { ns: "insights" })}
      </Button>
      <table
        id={tableId}
        hidden={open ? undefined : true}
        className="w-full border-collapse text-start"
      >
        <caption className="pb-2 text-start text-sm text-ink-600">
          {t("chart.caption", { ns: "insights", chart: title })}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="border-b border-teal-100 ps-2 pe-2 py-2 text-start">
              {t("chart.group", { ns: "insights" })}
            </th>
            <th scope="col" className="border-b border-teal-100 ps-2 pe-2 py-2 text-start">
              {t("chart.result", { ns: "insights" })}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th
                scope="row"
                className="border-b border-teal-100 ps-2 pe-2 py-2 text-start font-medium"
              >
                {row.group}
              </th>
              <td data-equity-cell={row.key} className="border-b border-teal-100 ps-2 pe-2 py-2">
                {row.copy.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
