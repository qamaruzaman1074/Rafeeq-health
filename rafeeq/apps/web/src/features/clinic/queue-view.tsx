import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
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

function LoadError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <p>{t("queue.error", { ns: "clinic" })}</p>
      <Button variant="secondary" onClick={onRetry}>
        {t("queue.retry", { ns: "clinic" })}
      </Button>
    </div>
  );
}

export function QueueView() {
  const { t } = useTranslation();
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

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-teal-900">
          {t("queue.title", { ns: "clinic" })}
        </h1>
        <p>{t("queue.intro", { ns: "clinic" })}</p>
      </header>
      {queue.isPending ? <p>{t("queue.loading", { ns: "clinic" })}</p> : null}
      {queue.isError ? (
        <LoadError
          onRetry={() => {
            void queue.refetch();
          }}
        />
      ) : null}
      {queue.isSuccess && queue.data === null ? (
        <p>{t("queue.unavailable", { ns: "clinic" })}</p>
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
