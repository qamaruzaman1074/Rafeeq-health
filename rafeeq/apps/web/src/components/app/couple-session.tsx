import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { getSessionPersona, getSessionRole, subscribeSession } from "@/app/session";
import { findPersona } from "@/features/personas";

const focusClass =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500";

export function CoupleSessionCard() {
  const { t } = useTranslation();
  const role = useSyncExternalStore(subscribeSession, getSessionRole, getSessionRole);
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  const persona = personaId === null ? undefined : findPersona(personaId);
  const sessionLabel =
    role === "guest"
      ? t("shell.session.guest")
      : role === null
        ? t("shell.session.none")
        : t("shell.session.current");

  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-background ps-3 pe-3 pt-2.5 pb-1">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
        {sessionLabel}
      </p>
      {persona !== undefined ? (
        <p className="text-base font-semibold text-teal-900" lang="en" dir="ltr">
          {persona.names}
        </p>
      ) : (
        <p className="text-sm text-ink-600">{t("shell.session.noPersona")}</p>
      )}
      <Link
        to="/demo"
        className={`inline-flex min-h-11 items-center text-sm font-medium text-teal-700 underline decoration-teal-700 underline-offset-4 ${focusClass}`}
      >
        {t("shell.session.choose")}
      </Link>
    </div>
  );
}
