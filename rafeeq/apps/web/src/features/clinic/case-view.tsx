import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFailureToast, useNotify } from "@/components/ui/toast";
import type { ReferralStatus } from "@/features/care/steps";
import {
  briefQueryKey,
  caseAuditQueryKey,
  fetchBrief,
  fetchCaseAudit,
  patchReferral,
} from "@/features/clinic/api";
import { AuditTimeline } from "@/features/privacy/audit-timeline";
import { BriefPanel } from "@/features/clinic/brief-panel";
import { documentLocale } from "@/i18n/locale";

export function CaseView() {
  const { t, i18n } = useTranslation();
  const notify = useNotify();
  const contact = humanContact(t);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const locale = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;
  const enabled = typeof id === "string" && id.length > 0;
  const briefKey = briefQueryKey(id ?? "", locale);
  const brief = useQuery({
    queryKey: briefKey,
    queryFn: () => fetchBrief(id ?? "", locale),
    enabled,
    retry: false,
  });
  const audit = useQuery({
    queryKey: caseAuditQueryKey(id ?? "", brief.dataUpdatedAt),
    queryFn: () => fetchCaseAudit(id ?? ""),
    enabled: enabled && brief.isSuccess && brief.data !== null,
    retry: false,
  });
  const [draft, setDraft] = useState<ReferralStatus | null>(null);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const selected = draft ?? brief.data?.status ?? "created";
  useFailureToast(brief.isError, t("case.error", { ns: "clinic" }));
  useFailureToast(audit.isError, t("audit.error", { ns: "clinic" }));

  async function onSave(): Promise<void> {
    if (!enabled || brief.data === null || brief.data === undefined) {
      return;
    }
    setPending(true);
    setFailed(false);
    try {
      await patchReferral(brief.data.id, selected);
      setDraft(null);
      await queryClient.invalidateQueries({ queryKey: briefKey });
      notify({ title: t("toast.success") });
    } catch {
      setFailed(true);
      notify({ title: t("case.status.failed", { ns: "clinic" }), variant: "error" });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-teal-900">
          {t("case.title", { ns: "clinic" })}
        </h1>
        <Link
          to="/clinic/queue"
          className="inline-flex min-h-11 items-center self-start text-teal-700 underline decoration-teal-700 underline-offset-4"
        >
          {t("case.back", { ns: "clinic" })}
        </Link>
      </header>
      <Tabs defaultValue="brief">
        <TabsList aria-label={t("case.tabs.label", { ns: "clinic" })}>
          <TabsTrigger value="brief">{t("case.tabs.brief", { ns: "clinic" })}</TabsTrigger>
          <TabsTrigger value="audit">{t("case.tabs.audit", { ns: "clinic" })}</TabsTrigger>
        </TabsList>
        <TabsContent value="brief">
          {!enabled ? <EmptyState title={t("case.empty", { ns: "clinic" })} /> : null}
          {enabled && brief.isPending ? (
            <Skeleton label={t("case.loading", { ns: "clinic" })} />
          ) : null}
          {enabled && brief.isError ? (
            <ErrorState
              title={t("case.error", { ns: "clinic" })}
              retryLabel={t("case.retry", { ns: "clinic" })}
              onRetry={() => {
                void brief.refetch();
              }}
              {...contact}
            />
          ) : null}
          {enabled && brief.isSuccess && brief.data === null ? (
            <EmptyState title={t("case.empty", { ns: "clinic" })} />
          ) : null}
          {brief.data != null ? (
            <BriefPanel
              brief={brief.data}
              status={selected}
              pending={pending}
              failed={failed}
              onStatus={setDraft}
              onSave={() => {
                void onSave();
              }}
            />
          ) : null}
        </TabsContent>
        <TabsContent value="audit">
          <div className="flex flex-col gap-3">
            <p>{t("audit.caseIntro", { ns: "clinic" })}</p>
            {audit.isLoading ? <Skeleton label={t("audit.loading", { ns: "clinic" })} /> : null}
            {audit.isError ? (
              <ErrorState
                title={t("audit.error", { ns: "clinic" })}
                retryLabel={t("case.retry", { ns: "clinic" })}
                onRetry={() => {
                  void audit.refetch();
                }}
                {...contact}
              />
            ) : null}
            {audit.isSuccess && (audit.data === null || audit.data.length === 0) ? (
              <EmptyState title={t("audit.empty", { ns: "clinic" })} />
            ) : null}
            {audit.data != null && audit.data.length > 0 ? (
              <AuditTimeline entries={audit.data} />
            ) : null}
            {!audit.isLoading && !audit.isSuccess && !audit.isError ? (
              <EmptyState title={t("audit.empty", { ns: "clinic" })} />
            ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
