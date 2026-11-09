import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useLiteracy } from "@/app/literacy";
import { setSessionRole } from "@/app/session";
import { SiteContainer } from "@/components/layout/site-container";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EvaluationGuide } from "@/features/evaluation-guide";
import { startCounsellorSession } from "@/features/clinic/session";
import { startAnalystSession } from "@/features/insights/session";
import { registerClinicCatalog } from "@/i18n/register-clinic";
import { registerInsightsCatalog } from "@/i18n/register-insights";

registerClinicCatalog();
registerInsightsCatalog();
import { startGuestSession } from "@/features/guest-session";
import { personas } from "@/features/personas";
import { ApiRequestError } from "@/lib/api";
import { cn } from "@/lib/utils";

function initials(names: string): string {
  return names
    .split(/\s+/)
    .filter((word) => /^\p{L}/u.test(word))
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2);
}

export function Component() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setMode } = useLiteracy();
  const attempt = useRef(0);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<
    "unknownPersona" | "guestFailed" | "counsellorFailed" | "analystFailed" | null
  >(null);

  const choose = (personaId: string) => {
    const token = attempt.current + 1;
    attempt.current = token;
    setPendingId(personaId);
    setErrorKey(null);
    void startGuestSession(personaId)
      .then(async () => {
        if (token !== attempt.current) {
          setSessionRole(null);
          return;
        }
        await navigate("/app");
      })
      .catch((error: unknown) => {
        if (token !== attempt.current) {
          return;
        }
        setPendingId(null);
        if (error instanceof ApiRequestError && error.messageKey === "unknownPersona") {
          setErrorKey("unknownPersona");
          return;
        }
        setErrorKey("guestFailed");
      });
  };

  const openClinic = () => {
    const token = attempt.current + 1;
    attempt.current = token;
    setPendingId("counsellor");
    setErrorKey(null);
    void startCounsellorSession()
      .then(async () => {
        if (token !== attempt.current) {
          setSessionRole(null);
          return;
        }
        await navigate("/clinic/queue");
      })
      .catch(() => {
        if (token !== attempt.current) {
          return;
        }
        setPendingId(null);
        setErrorKey("counsellorFailed");
      });
  };

  const openInsights = () => {
    const token = attempt.current + 1;
    attempt.current = token;
    setPendingId("analyst");
    setErrorKey(null);
    void startAnalystSession()
      .then(async () => {
        if (token !== attempt.current) {
          setSessionRole(null);
          return;
        }
        await navigate("/insights");
      })
      .catch(() => {
        if (token !== attempt.current) {
          return;
        }
        setPendingId(null);
        setErrorKey("analystFailed");
      });
  };

  const reset = () => {
    attempt.current += 1;
    setSessionRole(null);
    setMode("standard");
    setPendingId(null);
    setErrorKey(null);
  };

  return (
    <SiteContainer className="flex flex-col gap-8 py-8 sm:py-12">
      <PageHeader
        title={t("demo.title", { ns: "landing" })}
        description={t("demo.intro", { ns: "landing" })}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={reset} disabled={pendingId !== null}>
              {t("demo.reset", { ns: "landing" })}
            </Button>
            <Button
              variant="secondary"
              aria-busy={pendingId === "counsellor"}
              disabled={pendingId !== null}
              onClick={openClinic}
            >
              {t("session.open", { ns: "clinic" })}
            </Button>
            <Button
              variant="secondary"
              aria-busy={pendingId === "analyst"}
              disabled={pendingId !== null}
              onClick={openInsights}
            >
              {t("session.open", { ns: "insights" })}
            </Button>
            <EvaluationGuide />
          </div>
        }
      />
      {errorKey === "unknownPersona" ? (
        <p role="alert" className="rounded-lg border border-teal-700 bg-amber-100 p-4">
          {t("unknownPersona", { ns: "errors" })}
        </p>
      ) : null}
      {errorKey === "guestFailed" ? (
        <p role="alert" className="rounded-lg border border-teal-700 bg-amber-100 p-4">
          {t("guestFailed", { ns: "errors" })}
        </p>
      ) : null}
      {errorKey === "counsellorFailed" ? (
        <p role="alert" className="rounded-lg border border-teal-700 bg-amber-100 p-4">
          {t("counsellorFailed", { ns: "errors" })}
        </p>
      ) : null}
      {errorKey === "analystFailed" ? (
        <p role="alert" className="rounded-lg border border-teal-700 bg-amber-100 p-4">
          {t("analystFailed", { ns: "errors" })}
        </p>
      ) : null}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {personas.map((persona) => {
          const busy = pendingId === persona.id;
          return (
            <li key={persona.id} className="flex">
              <button
                type="button"
                data-persona={persona.id}
                aria-busy={busy}
                disabled={pendingId !== null}
                onClick={() => {
                  choose(persona.id);
                }}
                className={cn(
                  "persona-card flex w-full flex-col gap-4 rounded-xl p-5 text-start disabled:cursor-wait sm:p-6",
                  pendingId !== null && !busy && "opacity-60",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="persona-mark inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-teal-900"
                  >
                    {initials(persona.names)}
                  </span>
                  <span className="text-xl font-semibold text-teal-900">{persona.names}</span>
                </span>
                <span className="flex flex-col gap-3">
                  <span className="text-base leading-relaxed text-ink-900">
                    {t(`demo.personas.${persona.id}.summary`, { ns: "landing" })}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-teal-900">
                      {t("demo.willSee", { ns: "landing" })}
                    </span>
                    <span className="text-sm leading-relaxed text-ink-600">
                      {t(`demo.personas.${persona.id}.explore`, { ns: "landing" })}
                    </span>
                  </span>
                </span>
                <span className="mt-auto flex items-center justify-between gap-3 border-t border-border-subtle pt-4 text-base font-semibold text-teal-700">
                  <span>
                    {busy
                      ? t("demo.opening", { ns: "landing" })
                      : t("demo.enter", { ns: "landing", name: persona.names })}
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="persona-arrow h-5 w-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </SiteContainer>
  );
}
