import type { TFunction } from "i18next";
import { isSuppressed } from "@/features/insights/suppress";
import type { EquityCell, KpiMetric } from "@/features/insights/types";

export type TextPart = {
  key: string;
  text: string;
};

export type EquityCopy = {
  line: string;
  value: string;
};

function marker(t: TFunction): string {
  return t("content.missing", { ns: "common" });
}

/**
 * Visible KPI text. Suppression wins: the count, interval, and any other
 * field are omitted. A null metric value stays the OPEN_QUESTION marker.
 * Nothing here adds, divides, or rounds a number.
 */
export function kpiParts(
  metric: KpiMetric,
  t: TFunction,
  formatNumber: (value: number) => string,
): TextPart[] {
  if (isSuppressed(metric)) {
    return [{ key: "suppressed", text: t("suppressed", { ns: "insights" }) }];
  }

  const parts: TextPart[] = [];
  if (metric.n !== null) {
    parts.push({
      key: "n",
      text: t("fields.count", { ns: "insights", n: formatNumber(metric.n) }),
    });
  }
  if (metric.ci !== null) {
    parts.push({
      key: "ci",
      text: t("chart.interval", {
        ns: "insights",
        low: metric.ci.low,
        high: metric.ci.high,
      }),
    });
  }
  if (metric.granted !== null) {
    parts.push({
      key: "granted",
      text: t("fields.granted", { ns: "insights", n: formatNumber(metric.granted) }),
    });
  }
  if (metric.revoked !== null) {
    parts.push({
      key: "revoked",
      text: t("fields.revoked", { ns: "insights", n: formatNumber(metric.revoked) }),
    });
  }
  if (metric.value !== null) {
    parts.push({ key: "value", text: metric.value });
  } else if (parts.length > 0) {
    parts.push({ key: "missing", text: marker(t) });
  }

  if (parts.length === 0) {
    parts.push({ key: "missing", text: marker(t) });
  }
  return parts;
}

export function equityCopy(
  cell: EquityCell,
  group: string,
  t: TFunction,
  formatNumber: (value: number) => string,
): EquityCopy {
  if (isSuppressed(cell)) {
    return {
      line: t("chart.suppressedLine", { ns: "insights", group }),
      value: t("suppressed", { ns: "insights" }),
    };
  }
  if (cell.n !== null && cell.ci !== null) {
    const n = formatNumber(cell.n);
    return {
      line: t("chart.shown", {
        ns: "insights",
        group,
        n,
        low: cell.ci.low,
        high: cell.ci.high,
      }),
      value: t("chart.shownValue", {
        ns: "insights",
        n,
        low: cell.ci.low,
        high: cell.ci.high,
      }),
    };
  }
  if (cell.n !== null) {
    const n = formatNumber(cell.n);
    return {
      line: t("chart.countOnly", { ns: "insights", group, n, marker: marker(t) }),
      value: t("chart.countOnlyValue", { ns: "insights", n, marker: marker(t) }),
    };
  }
  if (cell.ci !== null) {
    return {
      line: t("chart.intervalLine", {
        ns: "insights",
        group,
        low: cell.ci.low,
        high: cell.ci.high,
        marker: marker(t),
      }),
      value: t("chart.interval", { ns: "insights", low: cell.ci.low, high: cell.ci.high }),
    };
  }
  return {
    line: t("chart.missingLine", { ns: "insights", group, marker: marker(t) }),
    value: marker(t),
  };
}
