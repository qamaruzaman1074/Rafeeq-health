import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useLiteracy } from "@/app/literacy";
import { setSessionRole } from "@/app/session";
import { PublicNav } from "@/components/public-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvaluationGuide } from "@/features/evaluation-guide";
import { startGuestSession } from "@/features/guest-session";
import { personas } from "@/features/personas";
import { ApiRequestError } from "@/lib/api";

export function Component() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setMode } = useLiteracy();
  const attempt = useRef(0);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<"unknownPersona" | "guestFailed" | null>(null);

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

  const reset = () => {
    attempt.current += 1;
    setSessionRole(null);
    setMode("standard");
    setPendingId(null);
    setErrorKey(null);
  };

  return (
    <div className="ms-auto me-auto flex w-full max-w-5xl flex-col gap-8">
      <PublicNav current="demo" />
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-teal-900">
          {t("demo.title", { ns: "landing" })}
        </h1>
        <p>{t("demo.intro", { ns: "landing" })}</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={reset}>
            {t("demo.reset", { ns: "landing" })}
          </Button>
          <EvaluationGuide />
        </div>
      </header>
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
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {personas.map((persona) => (
          <li key={persona.id}>
            <article className="flex h-full flex-col gap-3 rounded-lg border border-teal-500 bg-sand-100 p-6">
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
              <Button
                className="mt-auto"
                aria-busy={pendingId === persona.id}
                disabled={pendingId !== null}
                onClick={() => {
                  choose(persona.id);
                }}
              >
                {t("demo.enter", { ns: "landing", name: persona.names })}
              </Button>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
