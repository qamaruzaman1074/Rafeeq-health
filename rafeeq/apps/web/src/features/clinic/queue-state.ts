import type { ReferralStatus } from "@/features/care/steps";
import { REFERRAL_STATUSES } from "@/features/care/steps";
import { TIERS, type Tier } from "@/features/clinic/tiers";
import type { OverlapShare, QueueLanguage, QueueLiteracy, QueueRow } from "@/features/clinic/types";

export type QueueFilters = {
  tier: Tier | "all";
  language: QueueLanguage | "unknown" | "all";
  status: ReferralStatus | "all";
};

export const EMPTY_FILTERS: QueueFilters = {
  tier: "all",
  language: "all",
  status: "all",
};

export type SortKey =
  | "tier"
  | "reasons"
  | "due_by"
  | "language"
  | "literacy_mode"
  | "comprehension_gaps"
  | "share"
  | "status";

export type SortDirection = "asc" | "desc";

export type QueueSort = {
  key: SortKey | null;
  direction: SortDirection;
};

export const UNSORTED: QueueSort = { key: null, direction: "asc" };

const OVERLAP_RANK: Record<OverlapShare, number> = {
  allowed: 0,
  declined: 1,
  missing: 2,
  empty: 3,
};

const LITERACY_RANK: Record<QueueLiteracy, number> = {
  standard: 0,
  simple: 1,
  voice: 2,
};

export function filterQueue(rows: readonly QueueRow[], filters: QueueFilters): QueueRow[] {
  return rows.filter((row) => {
    if (filters.tier !== "all" && row.tier !== filters.tier) {
      return false;
    }
    if (filters.language === "unknown" && row.language !== null) {
      return false;
    }
    if (
      filters.language !== "all" &&
      filters.language !== "unknown" &&
      row.language !== filters.language
    ) {
      return false;
    }
    if (filters.status !== "all" && row.status !== filters.status) {
      return false;
    }
    return true;
  });
}

export function nextSort(current: QueueSort, key: SortKey): QueueSort {
  if (current.key !== key) {
    return { key, direction: "asc" };
  }
  return { key, direction: current.direction === "asc" ? "desc" : "asc" };
}

function compareNullableNumber(
  earlier: number | null,
  later: number | null,
  direction: SortDirection,
): number {
  if (earlier === null && later === null) {
    return 0;
  }
  if (earlier === null) {
    return 1;
  }
  if (later === null) {
    return -1;
  }
  const diff = earlier - later;
  return direction === "asc" ? diff : -diff;
}

function compareNullableText(
  earlier: string | null,
  later: string | null,
  direction: SortDirection,
): number {
  if (earlier === null && later === null) {
    return 0;
  }
  if (earlier === null) {
    return 1;
  }
  if (later === null) {
    return -1;
  }
  const diff = earlier.localeCompare(later);
  return direction === "asc" ? diff : -diff;
}

function tierRank(tier: Tier | null): number | null {
  if (tier === null) {
    return null;
  }
  const index = TIERS.indexOf(tier);
  return index < 0 ? null : index;
}

function statusRank(status: ReferralStatus): number {
  return REFERRAL_STATUSES.indexOf(status);
}

function literacyRank(mode: QueueLiteracy | null): number | null {
  if (mode === null) {
    return null;
  }
  return LITERACY_RANK[mode];
}

function gapRank(value: boolean | null): number | null {
  if (value === null) {
    return null;
  }
  return value ? 1 : 0;
}

function shareRank(row: QueueRow): number {
  const clinic = row.clinic_share ? 0 : 1;
  return clinic * 10 + OVERLAP_RANK[row.overlap_share];
}

function compareRows(
  earlier: QueueRow,
  later: QueueRow,
  key: SortKey,
  direction: SortDirection,
): number {
  switch (key) {
    case "tier":
      return compareNullableNumber(tierRank(earlier.tier), tierRank(later.tier), direction);
    case "reasons":
      return compareNullableText(
        earlier.reason_codes.join(","),
        later.reason_codes.join(","),
        direction,
      );
    case "due_by":
      return compareNullableText(earlier.due_by, later.due_by, direction);
    case "language":
      return compareNullableText(earlier.language, later.language, direction);
    case "literacy_mode":
      return compareNullableNumber(
        literacyRank(earlier.literacy_mode),
        literacyRank(later.literacy_mode),
        direction,
      );
    case "comprehension_gaps":
      return compareNullableNumber(
        gapRank(earlier.comprehension_gaps),
        gapRank(later.comprehension_gaps),
        direction,
      );
    case "share":
      return compareNullableNumber(shareRank(earlier), shareRank(later), direction);
    case "status":
      return compareNullableNumber(statusRank(earlier.status), statusRank(later.status), direction);
    default: {
      const unreachable: never = key;
      return unreachable;
    }
  }
}

export function sortQueue(rows: readonly QueueRow[], sort: QueueSort): QueueRow[] {
  if (sort.key === null) {
    return [...rows];
  }
  const key = sort.key;
  const indexed = rows.map((row, index) => ({ row, index }));
  indexed.sort((earlier, later) => {
    const diff = compareRows(earlier.row, later.row, key, sort.direction);
    if (diff !== 0) {
      return diff;
    }
    return earlier.index - later.index;
  });
  return indexed.map((item) => item.row);
}
