import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useLiteracy } from "@/app/literacy";
import { setSessionRole } from "@/app/session";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <div className="ms-auto me-auto flex w-full max-w-5xl flex-col gap-8 ps-4 pe-4 py-8 sm:ps-6 sm:pe-6 sm:py-12">
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
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {personas.map((persona) => (
          <li key={persona.id}>
            <Card className="h-full">
              <article className="flex h-full flex-col">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-teal-900">{persona.names}</h2>
                    <Badge variant="notice">{t("demo.draft", { ns: "landing" })}</Badge>
                  </div>
                  <p lang="en" dir="ltr">
                    {persona.story}
                  </p>
                  <h3 className="text-lg font-semibold text-teal-900">
                    {t("demo.willSee", { ns: "landing" })}
                  </h3>
                  <p lang="en" dir="ltr">
                    {persona.tests}
                  </p>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button
                    className="w-full"
                    aria-busy={pendingId === persona.id}
                    disabled={pendingId !== null}
                    onClick={() => {
                      choose(persona.id);
                    }}
                  >
                    {t("demo.enter", { ns: "landing", name: persona.names })}
                  </Button>
                </CardContent>
              </article>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
