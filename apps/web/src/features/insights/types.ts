import { z } from "zod";

/**
 * OPEN_QUESTION: Section 6 names GET `/insights/kpis` and GET `/insights/equity`
 * and the envelope, not the bodies. Parsers keep only the fields this screen
 * renders. Any other key is dropped. Confidence intervals are accepted only
 * when the payload says level 95 and gives the bounds as strings. Other levels
 * are unspecified, so they are not relabelled here.
 */

export const EQUITY_DIMENSIONS = ["language", "literacy_mode"] as const;

export type EquityDimension = (typeof EQUITY_DIMENSIONS)[number];

export type ConfidenceInterval = {
  level: 95;
  low: string;
  high: string;
};

export type KpiMetric = {
  id: string;
  n: number | null;
  ci: ConfidenceInterval | null;
  value: string | null;
  granted: number | null;
  revoked: number | null;
  suppressed: boolean | null;
};

export type KpiReport = {
  k_anonymity: number | null;
  metrics: KpiMetric[];
};

export type EquityCell = {
  key: string;
  n: number | null;
  ci: ConfidenceInterval | null;
  suppressed: boolean | null;
};

export type EquitySeries = {
  dimension: EquityDimension;
  cells: EquityCell[];
};

export type EquityReport = {
  metric_id: string | null;
  series: EquitySeries[];
};

const ciSchema = z.object({
  level: z.literal(95),
  low: z.string().min(1),
  high: z.string().min(1),
});

const countSchema = z.number().int().nonnegative().nullable();

const metricSchema = z.object({
  id: z.string().min(1),
  n: countSchema,
  ci: ciSchema.nullable(),
  value: z.string().nullable(),
  granted: countSchema,
  revoked: countSchema,
  suppressed: z.boolean().nullable(),
});

const kpiSchema = z.object({
  k_anonymity: z.number().int().nonnegative().nullable(),
  metrics: z.array(metricSchema),
});

const cellSchema = z.object({
  key: z.string().min(1),
  n: countSchema,
  ci: ciSchema.nullable(),
  suppressed: z.boolean().nullable(),
});

const seriesSchema = z.object({
  dimension: z.enum(EQUITY_DIMENSIONS),
  cells: z.array(cellSchema),
});

const equitySchema = z.object({
  metric_id: z.string().nullable(),
  series: z.array(seriesSchema),
});

function asRecord(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }
  const record: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    record[key] = value;
  }
  return record;
}

function blankToNull(value: unknown): unknown {
  if (typeof value === "string" && value.trim().length === 0) {
    return null;
  }
  return value;
}

function readCi(value: unknown): unknown {
  if (value === null || value === undefined) {
    return null;
  }
  const row = asRecord(value);
  if (row === null) {
    throw new Error("Confidence interval was not an object");
  }
  return {
    level: row.level,
    low: row.low,
    high: row.high,
  };
}

function readMetric(value: unknown): unknown {
  const row = asRecord(value);
  if (row === null) {
    throw new Error("KPI metric was not an object");
  }
  return {
    id: row.id,
    n: row.n ?? null,
    ci: readCi(row.ci),
    value: blankToNull(row.value) ?? null,
    granted: row.granted ?? null,
    revoked: row.revoked ?? null,
    suppressed: row.suppressed ?? null,
  };
}

function readCell(value: unknown): unknown {
  const row = asRecord(value);
  if (row === null) {
    throw new Error("Equity cell was not an object");
  }
  return {
    key: row.key,
    n: row.n ?? null,
    ci: readCi(row.ci),
    suppressed: row.suppressed ?? null,
  };
}

function readSeries(value: unknown): unknown {
  const row = asRecord(value);
  if (row === null) {
    throw new Error("Equity series was not an object");
  }
  return {
    dimension: row.dimension,
    cells: Array.isArray(row.cells) ? row.cells.map((cell) => readCell(cell)) : row.cells,
  };
}

export function kpiReport(raw: unknown): KpiReport {
  const body = asRecord(raw);
  if (body === null) {
    throw new Error("KPI response was not an object");
  }
  return kpiSchema.parse({
    k_anonymity: body.k_anonymity ?? null,
    metrics: Array.isArray(body.metrics)
      ? body.metrics.map((metric) => readMetric(metric))
      : body.metrics,
  });
}

export function equityReport(raw: unknown): EquityReport {
  const body = asRecord(raw);
  if (body === null) {
    throw new Error("Equity response was not an object");
  }
  const metricId = blankToNull(body.metric_id) ?? null;
  return equitySchema.parse({
    metric_id: metricId,
    series: Array.isArray(body.series)
      ? body.series.map((series) => readSeries(series))
      : body.series,
  });
}
