import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import {
  getSessionIdentity,
  getSessionPersona,
  isSupabaseAuthenticated,
  subscribeSession,
} from "@/app/session";
import { getOwnAccountDisplay } from "@/features/auth/supabase-auth";
import { findPersona } from "@/features/personas";
import { cn } from "@/lib/utils";

export function CoupleSessionCard({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  const identity = useSyncExternalStore(subscribeSession, getSessionIdentity, getSessionIdentity);
  const authenticated = useSyncExternalStore(
    subscribeSession,
    isSupabaseAuthenticated,
    isSupabaseAuthenticated,
  );
  const persona = personaId === null ? undefined : findPersona(personaId);
  const accountQuery = useQuery({
    queryKey: ["profile", "account-display", identity],
    queryFn: getOwnAccountDisplay,
    enabled: authenticated && identity !== null,
    retry: false,
  });
  const account = accountQuery.data ?? null;
  const name = authenticated
    ? (account?.displayName ?? account?.email ?? t("shell.session.defaultName"))
    : (persona?.names ?? t("shell.session.defaultName"));
  const email =
    authenticated && account !== null && account.displayName !== null ? account.email : null;

  return (
    <div
      role="group"
      aria-label={t("shell.session.account")}
      className={cn(
        "flex flex-col gap-1 rounded-xl border border-border-subtle bg-background p-3",
        compact && "border-0 bg-transparent p-0",
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.08em] text-ink-600",
          compact && "sr-only",
        )}
      >
        {t("shell.session.welcome")}
      </p>
      <p
        dir="auto"
        className={cn("break-words text-base font-semibold text-teal-900", compact && "text-sm")}
      >
        {compact ? t("shell.session.welcomeName", { name }) : name}
      </p>
      {email !== null && !compact ? (
        <p lang="en" dir="ltr" className="break-all text-xs text-ink-600">
          {email}
        </p>
      ) : null}
      {authenticated && identity !== null && accountQuery.isError ? (
        <p role="status" className="text-xs text-ink-600">
          {t("shell.session.profileError")}
        </p>
      ) : null}
    </div>
  );
}
