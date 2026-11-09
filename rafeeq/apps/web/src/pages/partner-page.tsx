import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SyntheticBadge } from "@/components/synthetic-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CONSENT_CATEGORIES,
  initialPartnerState,
  partnerReducer,
  sharedRiskState,
  type ConsentCategory,
  type PartnerAction,
  type PartnerDemoState,
} from "@/features/partner/partner-demo";
import { useCopyList } from "@/i18n/copy-list";
import { useSessionState } from "@/lib/use-session-state";

function demoCode(): string {
  return `RAF-INV-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

const panelClass =
  "flex flex-col gap-4 rounded-xl border border-border-subtle bg-card p-5 shadow-xs sm:p-6";

export function Component() {
  const { t } = useTranslation();
  const [state, setState] = useSessionState<PartnerDemoState>(
    "rafeeq.demo.partner",
    initialPartnerState,
  );
  const [confirm, setConfirm] = useState<ConsentCategory | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const outcomes = useCopyList<{ value: string; label: string }>("partner.risk.outcomes", "couple");

  const dispatch = (action: PartnerAction) => {
    setState((current) => partnerReducer(current, action, new Date().toISOString()));
  };

  const status = state.invitation.status;
  const connected = status === "accepted";
  const risk = sharedRiskState(state);
  const categoryLabel = (category: ConsentCategory) =>
    t(`partner.consent.categories.${category}.title`, { ns: "couple" });

  return (
    <AppPageLayout width="wide">
      <PageHeader
        eyebrow={<SyntheticBadge />}
        title={t("partner.title", { ns: "couple" })}
        description={t("partner.intro", { ns: "couple" })}
      />
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section aria-labelledby="partner-invite" className={panelClass}>
          <h2 id="partner-invite" className="text-lg font-semibold text-teal-900">
            {t("partner.invite.heading", { ns: "couple" })}
          </h2>
          <p className="text-sm text-ink-600">{t("partner.syntheticNote", { ns: "couple" })}</p>
          <p className="text-base text-ink-900" data-invitation={status}>
            {t(`partner.invite.${status}`, { ns: "couple", code: state.invitation.code ?? "" })}
          </p>
          <div className="flex flex-wrap gap-3">
            {status === "pending" ? (
              <>
                <Button onClick={() => dispatch({ type: "simulateAccept" })}>
                  {t("partner.invite.simulateAccept", { ns: "couple" })}
                </Button>
                <Button variant="secondary" onClick={() => dispatch({ type: "simulateDecline" })}>
                  {t("partner.invite.simulateDecline", { ns: "couple" })}
                </Button>
                <Button variant="ghost" onClick={() => dispatch({ type: "cancel" })}>
                  {t("partner.invite.cancel", { ns: "couple" })}
                </Button>
              </>
            ) : null}
            {status === "none" || status === "declined" || status === "cancelled" ? (
              <Button onClick={() => dispatch({ type: "invite", code: demoCode() })}>
                {t("partner.invite.create", { ns: "couple" })}
              </Button>
            ) : null}
          </div>
        </section>

        <section aria-labelledby="partner-side" className={panelClass}>
          <h2 id="partner-side" className="text-lg font-semibold text-teal-900">
            {t("partner.partnerSide.heading", { ns: "couple" })}
          </h2>
          <p className="text-base text-ink-600">
            {t("partner.partnerSide.body", { ns: "couple" })}
          </p>
          <p className="text-base text-ink-900">
            {state.partner.carrierFindings.granted
              ? t("partner.partnerSide.shared", { ns: "couple" })
              : t("partner.partnerSide.notShared", { ns: "couple" })}
          </p>
          <Button
            variant="secondary"
            className="w-fit"
            disabled={!connected || state.partner.carrierFindings.granted}
            onClick={() => dispatch({ type: "simulatePartnerGrant", category: "carrierFindings" })}
          >
            {t("partner.partnerSide.simulate", { ns: "couple" })}
          </Button>
        </section>
      </div>

      <section aria-labelledby="partner-consent" className={panelClass}>
        <div className="flex flex-col gap-1">
          <h2 id="partner-consent" className="text-lg font-semibold text-teal-900">
            {t("partner.consent.heading", { ns: "couple" })}
          </h2>
          <p className="text-base text-ink-600">
            {connected
              ? t("partner.consent.intro", { ns: "couple" })
              : t("partner.consent.needsPartner", { ns: "couple" })}
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {CONSENT_CATEGORIES.map((category) => {
            const record = state.mine[category];
            return (
              <li
                key={category}
                data-consent={category}
                data-granted={record.granted}
                className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-background p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-teal-900">
                    {categoryLabel(category)}
                  </h3>
                  <Badge variant={record.granted ? "positive" : "neutral"}>
                    {record.granted
                      ? t("partner.consent.on", { ns: "couple" })
                      : t("partner.consent.off", { ns: "couple" })}
                  </Badge>
                </div>
                <p className="text-sm text-ink-600">
                  {t(`partner.consent.categories.${category}.body`, { ns: "couple" })}
                </p>
                <p className="text-sm text-ink-600">
                  {t("partner.consent.who", { ns: "couple" })}{" "}
                  {t("partner.consent.duration", { ns: "couple" })}
                </p>
                {record.changedAt !== null ? (
                  <p className="text-sm font-medium text-teal-900">
                    {record.granted
                      ? t("partner.consent.granted", {
                          ns: "couple",
                          time: formatTime(record.changedAt),
                        })
                      : t("partner.consent.revokedAt", {
                          ns: "couple",
                          time: formatTime(record.changedAt),
                        })}
                  </p>
                ) : null}
                {record.granted ? (
                  <Button
                    variant="secondary"
                    className="w-fit"
                    onClick={() => setConfirm(category)}
                  >
                    {t("partner.consent.revoke", { ns: "couple" })}
                  </Button>
                ) : (
                  <Button
                    className="w-fit"
                    disabled={!connected}
                    aria-label={`${t("partner.consent.grant", { ns: "couple" })}: ${categoryLabel(category)}`}
                    onClick={() => dispatch({ type: "grant", category })}
                  >
                    {t("partner.consent.grant", { ns: "couple" })}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
        <p className="text-sm text-ink-600">{t("partner.consent.notShared", { ns: "couple" })}</p>
      </section>

      <section aria-labelledby="partner-risk" className={panelClass} data-risk={risk.kind}>
        <h2 id="partner-risk" className="text-lg font-semibold text-teal-900">
          {t("partner.risk.heading", { ns: "couple" })}
        </h2>
        {risk.kind === "example" ? (
          <>
            <p className="text-base text-ink-900">
              {t("partner.risk.exampleIntro", { ns: "couple", genes: risk.genes.join(", ") })}
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {outcomes.map((outcome) => (
                <li
                  key={outcome.label}
                  className="rounded-lg border border-border-subtle bg-background p-4"
                >
                  <p className="text-3xl font-semibold text-teal-900">{outcome.value}</p>
                  <p className="text-sm text-ink-600">{outcome.label}</p>
                </li>
              ))}
            </ul>
            <p className="text-base text-ink-900">
              {t("partner.risk.exampleCaveat", { ns: "couple" })}
            </p>
            <div className="flex flex-col gap-1 text-sm text-ink-600">
              <p className="font-semibold text-teal-900">
                {t("partner.risk.sourceLabel", { ns: "couple" })}
              </p>
              <p>{t("partner.risk.sourceMine", { ns: "couple" })}</p>
              <p>{t("partner.risk.sourcePartner", { ns: "couple" })}</p>
            </div>
          </>
        ) : (
          <p className="text-base text-ink-900">
            {t(`partner.risk.${risk.kind}`, { ns: "couple" })}
          </p>
        )}
        <p className="text-sm text-ink-600">{t("partner.risk.noScore", { ns: "couple" })}</p>
        <Button asChild variant="secondary" className="w-fit">
          <Link to="/app/care">{t("partner.risk.counselling", { ns: "couple" })}</Link>
        </Button>
      </section>

      <section aria-labelledby="partner-audit" className={panelClass}>
        <h2 id="partner-audit" className="text-lg font-semibold text-teal-900">
          {t("partner.audit.heading", { ns: "couple" })}
        </h2>
        {state.events.length === 0 ? (
          <p className="text-base text-ink-600">{t("partner.audit.empty", { ns: "couple" })}</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {state.events.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-1 rounded-lg border border-border-subtle bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-base text-ink-900">
                  {t(`partner.audit.types.${event.type}`, {
                    ns: "couple",
                    category: event.category === undefined ? "" : categoryLabel(event.category),
                  })}
                </span>
                <span className="flex items-center gap-2 text-sm text-ink-600">
                  <time dateTime={event.at}>{formatTime(event.at)}</time>
                  <Badge variant="neutral">{t("partner.audit.synthetic", { ns: "couple" })}</Badge>
                </span>
              </li>
            ))}
          </ol>
        )}
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => {
            dispatch({ type: "reset" });
            setAnnouncement(t("partner.resetDone", { ns: "couple" }));
          }}
        >
          {t("partner.reset", { ns: "couple" })}
        </Button>
      </section>

      <Dialog
        open={confirm !== null}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
      >
        <DialogContent>
          <DialogTitle className="text-lg font-semibold text-teal-900">
            {t("partner.consent.revokeTitle", { ns: "couple" })}
          </DialogTitle>
          <DialogDescription className="text-base text-ink-600">
            {t("partner.consent.revokeBody", { ns: "couple" })}
          </DialogDescription>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm !== null) dispatch({ type: "revoke", category: confirm });
                setConfirm(null);
              }}
            >
              {t("partner.consent.confirmRevoke", { ns: "couple" })}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">{t("partner.consent.keep", { ns: "couple" })}</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </AppPageLayout>
  );
}
