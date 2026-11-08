import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { useFailureToast } from "@/components/ui/toast";
import { fetchQueue, queueQueryKey } from "@/features/clinic/api";
import { QueueTable } from "@/features/clinic/queue-table";
import {
  EMPTY_FILTERS,
  filterQueue,
  sortQueue,
  UNSORTED,
  type QueueFilters,
  type QueueSort,
} from "@/features/clinic/queue-state";

export function QueueView() {
  const { t } = useTranslation();
  const contact = humanContact(t);
  const queue = useQuery({
    queryKey: queueQueryKey(),
    queryFn: fetchQueue,
    retry: false,
  });
  const [filters, setFilters] = useState<QueueFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<QueueSort>(UNSORTED);
  const visible =
    queue.data === null || queue.data === undefined
      ? []
      : sortQueue(filterQueue(queue.data, filters), sort);
  useFailureToast(queue.isError, t("queue.error", { ns: "clinic" }));

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-teal-900">
          {t("queue.title", { ns: "clinic" })}
        </h1>
        <p>{t("queue.intro", { ns: "clinic" })}</p>
      </header>
      {queue.isPending ? <Skeleton label={t("queue.loading", { ns: "clinic" })} /> : null}
      {queue.isError ? (
        <ErrorState
          title={t("queue.error", { ns: "clinic" })}
          retryLabel={t("queue.retry", { ns: "clinic" })}
          onRetry={() => {
            void queue.refetch();
          }}
          {...contact}
        />
      ) : null}
      {queue.isSuccess && queue.data === null ? (
        <EmptyState title={t("queue.unavailable", { ns: "clinic" })} />
      ) : null}
      {queue.isSuccess && queue.data !== null ? (
        <QueueTable
          rows={visible}
          filters={filters}
          sort={sort}
          onFilters={setFilters}
          onSort={setSort}
        />
      ) : null}
      <p>
        <Link
          to="/clinic"
          className="inline-flex min-h-11 items-center text-teal-700 underline decoration-teal-700 underline-offset-4"
        >
          {t("page.title", { ns: "clinic" })}
        </Link>
      </p>
    </div>
  );
}
