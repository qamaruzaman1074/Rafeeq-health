import {
  equityReport,
  kpiReport,
  type EquityReport,
  type KpiReport,
} from "@/features/insights/types";
import { apiRequest } from "@/lib/api";

export function kpiQueryKey() {
  return ["insights-kpis"] as const;
}

export function equityQueryKey() {
  return ["insights-equity"] as const;
}

export async function fetchKpis(): Promise<KpiReport | null> {
  const result = await apiRequest<unknown>("/api/v1/insights/kpis");
  if (result.data === null) {
    return null;
  }
  return kpiReport(result.data);
}

export async function fetchEquity(): Promise<EquityReport | null> {
  const result = await apiRequest<unknown>("/api/v1/insights/equity");
  if (result.data === null) {
    return null;
  }
  return equityReport(result.data);
}
