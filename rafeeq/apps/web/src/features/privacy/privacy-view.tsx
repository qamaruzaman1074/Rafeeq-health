import { useState } from "react";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { getSessionPersona, subscribeSession } from "@/app/session";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
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
import { ReceiptCard } from "@/features/privacy/receipt-card";
import { ShareMatrix } from "@/features/privacy/share-matrix";
import type { MineConsent } from "@/features/privacy/types";

function grantOf(rows: readonly MineConsent[] | null | undefined, scope: RevocableScope): boolean {
  return rows?.find((row) => row.scope === scope)?.granted ?? false;
}

function LoadError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <p>{t("error", { ns: "privacy" })}</p>
      <Button variant="secondary" onClick={onRetry}>
        {t("retry", { ns: "privacy" })}
      </Button>
    </div>
  );
}

export function PrivacyView() {
  const { t } = useTranslation();
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
    } catch {
      setNotice("failed");
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
  const receipts = receiptQueries.flatMap((query) =>
    query.data === undefined ? [] : [query.data],
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-teal-900">
          {t("page.title", { ns: "privacy" })}
        </h1>
        <p>{t("page.intro", { ns: "privacy" })}</p>
      </header>

      {mine.isPending ? <p>{t("loading", { ns: "privacy" })}</p> : null}
      {mine.isError ? (
        <LoadError
          onRetry={() => {
            void mine.refetch();
          }}
        />
      ) : null}
      {mine.isSuccess && mine.data === null ? <p>{t("empty", { ns: "privacy" })}</p> : null}
      {rows !== null ? (
        <ShareMatrix
          partnerGranted={currentGrant("share_overlap_with_partner")}
          clinicGranted={currentGrant("share_with_clinic")}
          disabled={busy}
          onToggle={onToggle}
        />
      ) : null}
      {notice === "failed" ? <p role="alert">{t("revoke.failed", { ns: "privacy" })}</p> : null}

      <section className="flex flex-col gap-4" aria-labelledby="privacy-receipts">
        <h2 id="privacy-receipts" className="text-2xl font-semibold text-teal-900">
          {t("receipt.heading", { ns: "privacy" })}
        </h2>
        {rows !== null && receiptPending ? <p>{t("loading", { ns: "privacy" })}</p> : null}
        {receiptFailed ? (
          <LoadError
            onRetry={() => {
              for (const query of receiptQueries) {
                void query.refetch();
              }
            }}
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

      <section className="flex flex-col gap-4" aria-labelledby="privacy-audit">
        <h2 id="privacy-audit" className="text-2xl font-semibold text-teal-900">
          {t("audit.heading", { ns: "privacy" })}
        </h2>
        {audit.isPending ? <p>{t("loading", { ns: "privacy" })}</p> : null}
        {audit.isError ? (
          <LoadError
            onRetry={() => {
              void audit.refetch();
            }}
          />
        ) : null}
        {audit.isSuccess && (audit.data === null || audit.data.length === 0) ? (
          <p>{t("audit.empty", { ns: "privacy" })}</p>
        ) : null}
        {audit.data !== undefined && audit.data !== null && audit.data.length > 0 ? (
          <AuditTimeline entries={audit.data} />
        ) : null}
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
    </div>
  );
}
