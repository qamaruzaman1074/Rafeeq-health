import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import type { AuditEntry } from "@/features/privacy/types";
import { documentLocale } from "@/i18n/locale";
import { useNumerals } from "@/i18n/numerals";

function actorLabel(role: AuditEntry["actor_role"], t: TFunction): string {
  switch (role) {
    case "guest":
      return t("audit.actor.guest", { ns: "privacy" });
    case "couple":
      return t("audit.actor.couple", { ns: "privacy" });
    case "counsellor":
      return t("audit.actor.counsellor", { ns: "privacy" });
    case "analyst":
      return t("audit.actor.analyst", { ns: "privacy" });
    case "admin":
      return t("audit.actor.admin", { ns: "privacy" });
    default: {
      const unreachable: never = role;
      return unreachable;
    }
  }
}

function actionLabel(action: AuditEntry["action"], t: TFunction): string {
  switch (action) {
    case "read":
      return t("audit.action.read", { ns: "privacy" });
    case "grant":
      return t("audit.action.grant", { ns: "privacy" });
    case "revoke":
      return t("audit.action.revoke", { ns: "privacy" });
    default: {
      const unreachable: never = action;
      return unreachable;
    }
  }
}

function objectLabel(objectType: AuditEntry["object_type"], t: TFunction): string {
  switch (objectType) {
    case "results":
      return t("audit.object.results", { ns: "privacy" });
    case "shares":
      return t("audit.object.shares", { ns: "privacy" });
    case "consents":
      return t("audit.object.consents", { ns: "privacy" });
    default: {
      const unreachable: never = objectType;
      return unreachable;
    }
  }
}

function ReadableValue({ label, code }: { label: string; code: string }) {
  return (
    <>
      <span>{label}</span>
      {label === "TODO_AR" ? <span lang="en">{code}</span> : null}
    </>
  );
}

export function AuditTimeline({ entries }: { entries: readonly AuditEntry[] }) {
  const { i18n, t } = useTranslation();
  const { formatDate } = useNumerals();
  const locale = documentLocale(i18n.resolvedLanguage ?? i18n.language);

  return (
    <div data-audit="timeline" lang={locale.lang} dir={locale.dir}>
      <ol className="flex flex-col gap-4 ps-6">
        {entries.map((entry) => (
          <li key={entry.id} data-entry={entry.id} className="flex flex-col gap-1">
            <span
              data-field="actor"
              data-code={entry.actor_role}
              className="inline-flex flex-wrap gap-2"
            >
              <span className="text-ink-600">{t("audit.who", { ns: "privacy" })}</span>
              <ReadableValue label={actorLabel(entry.actor_role, t)} code={entry.actor_role} />
            </span>
            <span
              data-field="action"
              data-code={`${entry.action}:${entry.object_type}`}
              className="inline-flex flex-wrap gap-2"
            >
              <span className="text-ink-600">{t("audit.what", { ns: "privacy" })}</span>
              <ReadableValue label={actionLabel(entry.action, t)} code={entry.action} />
              <ReadableValue label={objectLabel(entry.object_type, t)} code={entry.object_type} />
            </span>
            <span data-field="time" className="inline-flex flex-wrap gap-2">
              <span className="text-ink-600">{t("audit.when", { ns: "privacy" })}</span>
              <time dateTime={entry.at}>{formatDate(new Date(entry.at))}</time>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
