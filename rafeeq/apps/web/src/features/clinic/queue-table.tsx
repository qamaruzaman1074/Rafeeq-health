import type { ReactNode } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { EmptyState } from "@/components/empty-state";
import { REFERRAL_STATUSES } from "@/features/care/steps";
import {
  gapsLabel,
  languageLabel,
  literacyLabel,
  overlapLabel,
  referralStatusLabel,
  tierLabel,
} from "@/features/clinic/labels";
import {
  nextSort,
  type QueueFilters,
  type QueueSort,
  type SortKey,
} from "@/features/clinic/queue-state";
import { TierChip } from "@/features/clinic/tier-chip";
import { TIERS } from "@/features/clinic/tiers";
import type { QueueRow } from "@/features/clinic/types";
import { useNumerals } from "@/i18n/numerals";
import { cn } from "@/lib/utils";

const SORTABLE: readonly SortKey[] = [
  "tier",
  "reasons",
  "due_by",
  "language",
  "literacy_mode",
  "comprehension_gaps",
  "share",
  "status",
];

function columnLabel(key: SortKey, t: TFunction): string {
  switch (key) {
    case "tier":
      return t("queue.columns.tier", { ns: "clinic" });
    case "reasons":
      return t("queue.columns.reasons", { ns: "clinic" });
    case "due_by":
      return t("queue.columns.due", { ns: "clinic" });
    case "language":
      return t("queue.columns.language", { ns: "clinic" });
    case "literacy_mode":
      return t("queue.columns.literacy", { ns: "clinic" });
    case "comprehension_gaps":
      return t("queue.columns.gaps", { ns: "clinic" });
    case "share":
      return t("queue.columns.share", { ns: "clinic" });
    case "status":
      return t("queue.columns.status", { ns: "clinic" });
    default: {
      const unreachable: never = key;
      return unreachable;
    }
  }
}

function ariaSort(sort: QueueSort, key: SortKey): "none" | "ascending" | "descending" {
  if (sort.key !== key) {
    return "none";
  }
  return sort.direction === "asc" ? "ascending" : "descending";
}

function Missing() {
  const { t } = useTranslation();
  return <span>{t("content.missing", { ns: "common" })}</span>;
}

function Cell({ children }: { children: ReactNode }) {
  return (
    <td className="break-all border-b border-teal-100 ps-2 pe-2 py-2 align-top">{children}</td>
  );
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex min-w-40 flex-col gap-1 text-sm text-ink-600">
      <span>{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className="min-h-11 rounded-md border border-teal-700 bg-sand-100 ps-3 pe-3 text-base text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
      >
        {children}
      </select>
    </label>
  );
}

export function QueueTable({
  rows,
  filters,
  sort,
  onFilters,
  onSort,
}: {
  rows: readonly QueueRow[];
  filters: QueueFilters;
  sort: QueueSort;
  onFilters: (filters: QueueFilters) => void;
  onSort: (sort: QueueSort) => void;
}) {
  const { t } = useTranslation();
  const { formatDate } = useNumerals();

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div
        role="group"
        aria-label={t("queue.filters.label", { ns: "clinic" })}
        className="flex flex-wrap gap-4"
      >
        <FilterSelect
          id="queue-filter-tier"
          label={t("queue.filters.tier", { ns: "clinic" })}
          value={filters.tier}
          onChange={(value) => {
            const tier = TIERS.find((item) => item === value);
            onFilters({ ...filters, tier: tier ?? "all" });
          }}
        >
          <option value="all">{t("queue.filters.all", { ns: "clinic" })}</option>
          {TIERS.map((tier) => (
            <option key={tier} value={tier}>
              {tierLabel(tier, t)}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          id="queue-filter-language"
          label={t("queue.filters.language", { ns: "clinic" })}
          value={filters.language}
          onChange={(value) => {
            const language: QueueFilters["language"] =
              value === "en" || value === "ar" || value === "unknown" ? value : "all";
            onFilters({ ...filters, language });
          }}
        >
          <option value="all">{t("queue.filters.all", { ns: "clinic" })}</option>
          <option value="en">{languageLabel("en", t)}</option>
          <option value="ar">{languageLabel("ar", t)}</option>
          <option value="unknown">{t("queue.filters.unknownLanguage", { ns: "clinic" })}</option>
        </FilterSelect>
        <FilterSelect
          id="queue-filter-status"
          label={t("queue.filters.status", { ns: "clinic" })}
          value={filters.status}
          onChange={(value) => {
            const status = REFERRAL_STATUSES.find((item) => item === value);
            onFilters({ ...filters, status: status ?? "all" });
          }}
        >
          <option value="all">{t("queue.filters.all", { ns: "clinic" })}</option>
          {REFERRAL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {referralStatusLabel(status, t)}
            </option>
          ))}
        </FilterSelect>
      </div>
      {rows.length === 0 ? (
        <EmptyState title={t("queue.empty", { ns: "clinic" })} />
      ) : (
        <div className="w-full min-w-0 max-w-full overflow-x-auto">
          <table
            className="w-full min-w-[56rem] table-fixed border-collapse text-sm"
            data-queue="table"
          >
            <caption className="sr-only">{t("queue.caption", { ns: "clinic" })}</caption>
            <thead className="bg-sand-100 text-teal-900">
              <tr>
                <th scope="col" className="ps-2 pe-2 py-2 text-start">
                  {t("queue.columns.open", { ns: "clinic" })}
                </th>
                {SORTABLE.map((key) => (
                  <th
                    key={key}
                    scope="col"
                    aria-sort={ariaSort(sort, key)}
                    className="ps-2 pe-2 py-2 text-start"
                  >
                    <button
                      type="button"
                      className={cn(
                        "inline-flex min-h-11 w-full items-center whitespace-normal break-all rounded-md text-start text-sm font-semibold text-teal-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                        sort.key === key && "underline decoration-teal-700 underline-offset-4",
                      )}
                      onClick={() => {
                        onSort(nextSort(sort, key));
                      }}
                    >
                      {columnLabel(key, t)}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} data-referral={row.id}>
                  <Cell>
                    <Link
                      to={`/clinic/case/${row.id}`}
                      className="inline-flex min-h-11 items-center break-all text-teal-700 underline decoration-teal-700 underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                    >
                      {t("queue.open", { ns: "clinic", id: row.id })}
                    </Link>
                  </Cell>
                  <Cell>
                    <TierChip tier={row.tier} />
                  </Cell>
                  <Cell>
                    {row.reason_codes.length === 0 ? (
                      t("queue.noReasons", { ns: "clinic" })
                    ) : (
                      <ul>
                        {row.reason_codes.map((code) => (
                          <li key={code} lang="en" dir="ltr">
                            {code}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Cell>
                  <Cell>
                    {row.due_by === null ? (
                      <Missing />
                    ) : (
                      <time dateTime={row.due_by}>{formatDate(new Date(row.due_by))}</time>
                    )}
                  </Cell>
                  <Cell>{languageLabel(row.language, t)}</Cell>
                  <Cell>{literacyLabel(row.literacy_mode, t)}</Cell>
                  <Cell>{gapsLabel(row.comprehension_gaps, t)}</Cell>
                  <Cell>
                    <span className="flex flex-col gap-1">
                      <span>
                        {row.clinic_share
                          ? t("queue.shareClinicOn", { ns: "clinic" })
                          : t("queue.shareClinicOff", { ns: "clinic" })}
                      </span>
                      <span>{overlapLabel(row.overlap_share, t)}</span>
                    </span>
                  </Cell>
                  <Cell>{referralStatusLabel(row.status, t)}</Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
