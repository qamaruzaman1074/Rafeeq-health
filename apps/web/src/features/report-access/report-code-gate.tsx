import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  unlockPrototypeReport,
  usePrototypeReportAccess,
} from "@/features/report-access/prototype-report-access";
import {
  REPORT_CODE_LENGTH,
  sanitizeReportAccessCodeInput,
} from "@/features/report-access/report-code";

type TranslationNamespace = "couple" | "result";

export function ReportCodeGate({ namespace }: { namespace: TranslationNamespace }) {
  const { t } = useTranslation();
  const access = usePrototypeReportAccess();
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(false);
  const text = (key: string) => t(`reportAccess.${key}`, { ns: namespace });

  if (access.unlocked) {
    return null;
  }

  return (
    <section
      aria-labelledby="report-access-heading"
      data-report-code-gate=""
      className="motion-card-lift flex flex-col gap-4 rounded-2xl border border-border-subtle bg-card p-5 shadow-xs sm:p-7"
    >
      <div className="flex flex-col gap-2">
        <h2 id="report-access-heading" className="text-xl font-semibold text-teal-900">
          {text("title")}
        </h2>
        <p className="max-w-3xl text-base leading-relaxed text-ink-600">{text("intro")}</p>
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-ink-900">
          {text("prototypeNotice")}
        </p>
      </div>

      {access.code === null ? (
        <div className="flex flex-col items-start gap-3">
          <p role="status">{text("noCode")}</p>
          <Button asChild variant="secondary">
            <Link to="/app">{text("createCodeLink")}</Link>
          </Button>
        </div>
      ) : (
        <form
          className="flex flex-col items-start gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const unlocked = unlockPrototypeReport(code);
            setInvalid(!unlocked);
          }}
        >
          <label htmlFor="own-report-code" className="text-sm font-semibold text-teal-900">
            {text("codeLabel")}
          </label>
          <input
            id="own-report-code"
            name="reportCode"
            type="text"
            lang="en"
            dir="ltr"
            autoComplete="off"
            maxLength={REPORT_CODE_LENGTH}
            inputMode="numeric"
            value={code}
            aria-invalid={invalid}
            aria-describedby={invalid ? "own-report-code-error" : undefined}
            onChange={(event) => {
              setCode(sanitizeReportAccessCodeInput(event.target.value));
              setInvalid(false);
            }}
            className="min-h-12 w-full max-w-sm rounded-lg border border-border-subtle bg-background px-4 font-mono text-lg tracking-[0.18em] text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            placeholder={text("codePlaceholder")}
          />
          {invalid ? (
            <p
              id="own-report-code-error"
              role="alert"
              className="text-sm font-medium text-danger-600"
            >
              {text("invalidCode")}
            </p>
          ) : null}
          <Button type="submit">{text("submit")}</Button>
        </form>
      )}
    </section>
  );
}
