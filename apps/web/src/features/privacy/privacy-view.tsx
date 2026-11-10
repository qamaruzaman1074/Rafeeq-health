import { useState } from "react";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { getSessionPersona, subscribeSession } from "@/app/session";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useFailureToast, useNotify } from "@/components/ui/toast";
import {
  auditQueryKey,
  fetchMineConsents,
  fetchMyAudit,
  fetchReceipt,
  mineConsentQueryKey,
  partnerConsentQueryKey,
  postConsent,
  receiptQueryKey,
} from "@/features/privacy/api";
import { AuditTimeline } from "@/features/privacy/audit-timeline";
import { commitConsentChange, type RevocableScope } from "@/features/privacy/matrix";
import { landmarkName } from "@/lib/landmark-name";
import { ReceiptCard } from "@/features/privacy/receipt-card";
import { ConsentMatrixPrototype } from "@/features/privacy/consent-matrix-prototype";
import { ConsentVisuals } from "@/features/privacy/consent-visuals";
import { DataMinimization } from "@/features/privacy/data-minimization";
import { PrivacyEducation } from "@/features/privacy/privacy-education";
import { ShareMatrix } from "@/features/privacy/share-matrix";
import { SyntheticAuditPanel } from "@/features/privacy/synthetic-audit-panel";
import type { MineConsent } from "@/features/privacy/types";

function grantOf(rows: readonly MineConsent[] | null | undefined, scope: RevocableScope): boolean {
  return rows?.find((row) => row.scope === scope)?.granted ?? false;
}

function SharingExplainer() {
  const { t } = useTranslation();
  const items = [
    {
      id: "own",
      title: t("explain.own.title", { ns: "privacy" }),
      body: t("explain.own.body", { ns: "privacy" }),
    },
    {
      id: "overlap",
      title: t("explain.overlap.title", { ns: "privacy" }),
      body: t("explain.overlap.body", { ns: "privacy" }),
    },
    {
      id: "clinic",
      title: t("explain.clinic.title", { ns: "privacy" }),
      body: t("explain.clinic.body", { ns: "privacy" }),
    },
    {
      id: "research",
      title: t("explain.research.title", { ns: "privacy" }),
      body: t("explain.research.body", { ns: "privacy" }),
    },
  ] as const;

  return (
    <section className="flex flex-col gap-4" data-privacy-section="explain">
      <h2 className="text-xl font-semibold text-teal-900">
        {t("explain.heading", { ns: "privacy" })}
      </h2>
      <p className="max-w-2xl text-base leading-relaxed text-ink-600">
        {t("explain.lead", { ns: "privacy" })}
      </p>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <Card className="h-full hover:shadow-surface">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PrivacyView() {
  const { t } = useTranslation();
  const notify = useNotify();
  const contact = humanContact(t);
  const queryClient = useQueryClient();
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  const mineKey = mineConsentQueryKey(personaId);
  const mine = useQuery({
    queryKey: mineKey,
    queryFn: fetchMineConsents,
    retry: false,
  });
  const audit = useQuery({
    queryKey: auditQueryKey(personaId),
    queryFn: fetchMyAudit,
    retry: false,
  });
  const receiptIds = mine.data?.map((row) => row.id) ?? [];
  const receiptQueries = useQueries({
    queries: receiptIds.map((id) => ({
      queryKey: receiptQueryKey(personaId, id),
      queryFn: () => fetchReceipt(id),
      retry: false,
    })),
  });
  const [overrides, setOverrides] = useState<Partial<Record<RevocableScope, boolean>>>({});
  const [pending, setPending] = useState<RevocableScope | null>(null);
  const [notice, setNotice] = useState<"failed" | null>(null);
  const [busy, setBusy] = useState(false);

  const rows = mine.data ?? null;

  function currentGrant(scope: RevocableScope): boolean {
    const override = overrides[scope];
    if (override !== undefined) {
      return override;
    }
    return grantOf(rows, scope);
  }

  async function changeGrant(scope: RevocableScope, next: boolean): Promise<void> {
    const previous = currentGrant(scope);
    setPending(null);
    setNotice(null);
    setBusy(true);
    try {
      await commitConsentChange({
        previous,
        next,
        apply: (granted) => {
          setOverrides((current) => ({ ...current, [scope]: granted }));
        },
        request: async () => {
          const list = await postConsent({ scope, granted: next });
          queryClient.setQueryData(mineKey, list);
          await queryClient.invalidateQueries({ queryKey: partnerConsentQueryKey(personaId) });
          await queryClient.invalidateQueries({ queryKey: ["consents", "receipt", personaId] });
          await queryClient.invalidateQueries({ queryKey: auditQueryKey(personaId) });
        },
      });
      setOverrides((current) => {
        const cleared = { ...current };
        delete cleared[scope];
        return cleared;
      });
      notify({ title: t("toast.success") });
    } catch {
      setNotice("failed");
      notify({ title: t("revoke.failed", { ns: "privacy" }), variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  function askRevoke(scope: RevocableScope): void {
    if (busy) {
      return;
    }
    setPending(scope);
  }

  function onToggle(scope: RevocableScope, next: boolean): void {
    if (busy) {
      return;
    }
    if (!next) {
      askRevoke(scope);
      return;
    }
    void changeGrant(scope, true);
  }

  const receiptPending = receiptQueries.some((query) => query.isPending);
  const receiptFailed = receiptQueries.some((query) => query.isError);
  useFailureToast(mine.isError || receiptFailed || audit.isError, t("error", { ns: "privacy" }));
  const receipts = receiptQueries.flatMap((query) =>
    query.data === undefined ? [] : [query.data],
  );

  return (
    <AppPageLayout width="wide">
      <PageHeader
        title={t("page.title", { ns: "privacy" })}
        description={t("page.intro", { ns: "privacy" })}
      />

      <PrivacyEducation />
      <ConsentVisuals />
      <DataMinimization />
      <ConsentMatrixPrototype />
      <SyntheticAuditPanel />

      <p
        className="rounded-lg border border-border-subtle bg-sand-100 ps-4 pe-4 py-4 text-base leading-relaxed text-ink-600"
        data-privacy-section="demo"
      >
        {t("page.demo", { ns: "privacy" })}
      </p>

      <SharingExplainer />

      {mine.isPending ? <Skeleton label={t("loading", { ns: "privacy" })} /> : null}
      {mine.isError ? (
        <ErrorState
          title={t("error", { ns: "privacy" })}
          retryLabel={t("retry", { ns: "privacy" })}
          onRetry={() => {
            void mine.refetch();
          }}
          {...contact}
        />
      ) : null}
      {mine.isSuccess && mine.data === null ? (
        <EmptyState title={t("empty", { ns: "privacy" })} />
      ) : null}
      {rows !== null ? (
        <section className="flex flex-col gap-3" data-privacy-section="controls">
          <h2 className="text-xl font-semibold text-teal-900">
            {t("page.sessionDemoHeading", { ns: "privacy" })}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-ink-600">
            {t("page.controlsLead", { ns: "privacy" })}
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-ink-600">
            {t("page.revokeLead", { ns: "privacy" })}
          </p>
          <ShareMatrix
            partnerGranted={currentGrant("share_overlap_with_partner")}
            clinicGranted={currentGrant("share_with_clinic")}
            disabled={busy}
            onToggle={onToggle}
          />
        </section>
      ) : null}
      {notice === "failed" ? <p role="alert">{t("revoke.failed", { ns: "privacy" })}</p> : null}

      <section
        className="flex flex-col gap-4"
        aria-label={landmarkName(
          t("receipt.heading", { ns: "privacy" }),
          t("receipt.heading", { ns: "privacy", lng: "en" }),
        )}
      >
        <h2 id="privacy-receipts" className="text-2xl font-semibold text-teal-900">
          {t("receipt.heading", { ns: "privacy" })}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-ink-600">
          {t("receipt.lead", { ns: "privacy" })}
        </p>
        {rows !== null && receiptPending ? (
          <Skeleton label={t("loading", { ns: "privacy" })} />
        ) : null}
        {receiptFailed ? (
          <ErrorState
            title={t("error", { ns: "privacy" })}
            retryLabel={t("retry", { ns: "privacy" })}
            onRetry={() => {
              for (const query of receiptQueries) {
                void query.refetch();
              }
            }}
            {...contact}
          />
        ) : null}
        {receipts.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {receipts.map((receipt) => (
              <li key={receipt.consent_id}>
                <ReceiptCard receipt={receipt} disabled={busy} onRevoke={askRevoke} />
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section
        className="flex flex-col gap-4"
        aria-label={landmarkName(
          t("audit.heading", { ns: "privacy" }),
          t("audit.heading", { ns: "privacy", lng: "en" }),
        )}
      >
        <h2 id="privacy-audit" className="text-2xl font-semibold text-teal-900">
          {t("audit.heading", { ns: "privacy" })}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-ink-600">
          {t("audit.lead", { ns: "privacy" })}
        </p>
        {audit.isPending ? <Skeleton label={t("loading", { ns: "privacy" })} /> : null}
        {audit.isError ? (
          <ErrorState
            title={t("error", { ns: "privacy" })}
            retryLabel={t("retry", { ns: "privacy" })}
            onRetry={() => {
              void audit.refetch();
            }}
            {...contact}
          />
        ) : null}
        {audit.isSuccess && (audit.data === null || audit.data.length === 0) ? (
          <EmptyState title={t("audit.empty", { ns: "privacy" })} />
        ) : null}
        {audit.data !== undefined && audit.data !== null && audit.data.length > 0 ? (
          <div className="rounded-lg border border-border-subtle bg-sand-100 p-6">
            <AuditTimeline entries={audit.data} />
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-3" data-privacy-section="related">
        <h2 className="text-xl font-semibold text-teal-900">
          {t("related.heading", { ns: "privacy" })}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link to="/app/care">{t("related.care", { ns: "privacy" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/result">{t("related.results", { ns: "privacy" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/partner">{t("related.partner", { ns: "privacy" })}</Link>
          </Button>
        </div>
      </section>

      {pending !== null ? (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setPending(null);
            }
          }}
        >
          <DialogContent>
            <DialogTitle>{t("revoke.title", { ns: "privacy" })}</DialogTitle>
            <DialogDescription>{t("revoke.body", { ns: "privacy" })}</DialogDescription>
            <Button
              variant="destructive"
              onClick={() => {
                void changeGrant(pending, false);
              }}
            >
              {t("revoke.confirm", { ns: "privacy" })}
            </Button>
          </DialogContent>
        </Dialog>
      ) : null}
    </AppPageLayout>
  );
}
