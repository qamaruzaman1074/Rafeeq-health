import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { RafeeqLogo } from "@/components/brand/rafeeq-logo";
import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import {
  errorMessageFrom,
  homeRouteForRole,
  isSupabaseConfigured,
  signInWithEmail,
  signUpWithEmail,
} from "@/features/auth/supabase-auth";

type AuthMode = "signIn" | "signUp";

const fieldClass =
  "min-h-11 w-full rounded-lg border border-border-subtle bg-card px-3 text-base text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring";

export function Component() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      if (mode === "signIn") {
        const role = await signInWithEmail(email.trim(), password);
        await navigate(homeRouteForRole(role));
      } else {
        const role = await signUpWithEmail(displayName.trim(), email.trim(), password);
        if (role !== null) {
          await navigate(homeRouteForRole(role));
        } else {
          setStatusMessage(t("auth.confirmEmail", { ns: "public" }));
        }
      }
    } catch (error) {
      setErrorMessage(errorMessageFrom(error, t("auth.unknownError", { ns: "public" })));
    } finally {
      setPending(false);
    }
  };

  return (
    <SiteContainer className="flex flex-1 items-center py-8 sm:py-12">
      <section
        aria-labelledby="auth-form-heading"
        className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border-subtle bg-card shadow-surface-lg lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
      >
        <div className="motion-text-reveal motion-delay-1 flex flex-col gap-7 p-6 sm:p-10 lg:p-12">
          <Link
            aria-label={t("common.brand.wordmark")}
            className="w-fit rounded-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring"
            to="/"
          >
            <RafeeqLogo />
          </Link>

          <header className="flex flex-col gap-3">
            <h1
              id="auth-form-heading"
              className="text-3xl font-semibold tracking-tight text-teal-900"
            >
              {t(mode === "signIn" ? "auth.title" : "auth.signUpHeading", { ns: "public" })}
            </h1>
            <p className="max-w-md leading-relaxed text-ink-600">
              {t("auth.intro", { ns: "public" })}
            </p>
          </header>

          {!configured ? (
            <p
              role="alert"
              className="rounded-lg border border-amber-700 bg-amber-100 p-4 text-ink-900"
            >
              {t("auth.missingConfig", { ns: "public" })}
            </p>
          ) : null}
          {errorMessage !== null ? (
            <p
              role="alert"
              className="rounded-lg border border-destructive bg-card p-4 text-ink-900"
            >
              {errorMessage}
            </p>
          ) : null}
          {statusMessage !== null ? (
            <p
              role="status"
              className="rounded-lg border border-teal-700 bg-secondary p-4 text-ink-900"
            >
              {statusMessage}
            </p>
          ) : null}

          <form className="flex flex-col gap-5" onSubmit={(event) => void submit(event)}>
            {mode === "signUp" ? (
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                {t("auth.displayName", { ns: "public" })}
                <input
                  autoComplete="name"
                  className={fieldClass}
                  maxLength={120}
                  onChange={(event) => setDisplayName(event.currentTarget.value)}
                  required
                  value={displayName}
                />
              </label>
            ) : null}
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              {t("auth.email", { ns: "public" })}
              <input
                autoComplete="email"
                className={fieldClass}
                onChange={(event) => setEmail(event.currentTarget.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              {t("auth.password", { ns: "public" })}
              <input
                autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                className={fieldClass}
                minLength={8}
                onChange={(event) => setPassword(event.currentTarget.value)}
                required
                type="password"
                value={password}
              />
            </label>
            <Button className="w-full" disabled={pending || !configured} type="submit">
              {pending
                ? t("auth.working", { ns: "public" })
                : t(mode === "signIn" ? "auth.signIn" : "auth.signUp", { ns: "public" })}
            </Button>
          </form>

          <div className="flex flex-col gap-4 border-t border-border-subtle pt-5">
            <p className="text-sm leading-relaxed text-ink-600">
              {t(mode === "signIn" ? "auth.switchToSignUp" : "auth.switchToSignIn", {
                ns: "public",
              })}{" "}
              <button
                className="rounded-sm font-semibold text-teal-700 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                onClick={() => {
                  setMode(mode === "signIn" ? "signUp" : "signIn");
                  setErrorMessage(null);
                  setStatusMessage(null);
                }}
                type="button"
              >
                {t(mode === "signIn" ? "auth.signUp" : "auth.signIn", { ns: "public" })}
              </button>
            </p>
            <p className="text-sm text-ink-600">
              {t("auth.demoPrompt", { ns: "public" })}{" "}
              <Link
                className="rounded-sm font-semibold text-teal-700 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                to="/demo"
              >
                {t("auth.demoLink", { ns: "public" })}
              </Link>
            </p>
          </div>
        </div>

        <aside className="relative flex min-h-[22rem] flex-col items-center justify-between overflow-hidden bg-background px-6 py-8 sm:min-h-[28rem] sm:px-10 lg:min-h-[36rem] lg:px-12 lg:py-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="absolute -end-20 -top-20 h-64 w-64 rounded-full border border-teal-900/10" />
            <span className="absolute -bottom-28 -start-24 h-80 w-80 rounded-full border border-teal-900/10" />
          </div>
          <div className="motion-text-reveal motion-delay-2 relative z-10 max-w-md text-center">
            <p className="text-eyebrow">{t("auth.visualEyebrow", { ns: "public" })}</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-teal-900 sm:text-3xl">
              {t("auth.visualTitle", { ns: "public" })}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              {t("auth.visualDescription", { ns: "public" })}
            </p>
          </div>
          <img
            alt={t("auth.illustrationAlt", { ns: "public" })}
            className="hero-visual-float relative z-10 my-4 w-full max-w-[34rem] object-contain"
            src="/images/hero-cell-dna.png"
          />
        </aside>
      </section>
    </SiteContainer>
  );
}
