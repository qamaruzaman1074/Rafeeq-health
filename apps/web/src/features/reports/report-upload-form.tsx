import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { getSessionIdentity, isSupabaseAuthenticated, subscribeSession } from "@/app/session";
import { Button } from "@/components/ui/button";
import { errorMessageFrom } from "@/features/auth/supabase-auth";
import {
  createPrototypeReportCode,
  generatePrototypeReportCode,
  isValidPrototypeReportCode,
  usePrototypeReportAccess,
} from "@/features/report-access/prototype-report-access";
import {
  REPORT_CODE_LENGTH,
  sanitizeReportAccessCodeInput,
} from "@/features/report-access/report-code";
import {
  isValidReportAccessCode,
  uploadOwnReport,
  type ScreeningReport,
} from "@/features/reports/supabase-reports";
import { createSyntheticReportFile } from "@/features/reports/synthetic-report-file";
import { useSyncExternalStore } from "react";

type Feedback =
  | { kind: "success"; key: "uploaded" | "demoCodeCreated"; code: string }
  | { kind: "error"; message: string };

export function ReportUploadForm() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const identity = useSyncExternalStore(subscribeSession, getSessionIdentity, getSessionIdentity);
  const authenticated = useSyncExternalStore(
    subscribeSession,
    isSupabaseAuthenticated,
    isSupabaseAuthenticated,
  );
  const reportAccess = usePrototypeReportAccess();
  const [customCode, setCustomCode] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (saving) {
      return;
    }

    const enteredCode = customCode.trim();
    const isValidCode = authenticated ? isValidReportAccessCode : isValidPrototypeReportCode;
    if (enteredCode.length > 0 && !isValidCode(enteredCode)) {
      setFeedback({
        kind: "error",
        message: t("home.upload.feedback.invalidCode", { ns: "couple" }),
      });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      let accessCode: string;
      if (authenticated) {
        const demoFile = createSyntheticReportFile();
        const report: ScreeningReport = await uploadOwnReport(demoFile, enteredCode || undefined);
        accessCode = report.access_code;
        await queryClient.invalidateQueries({ queryKey: ["reports", "mine", identity] });
        setFeedback({ kind: "success", key: "uploaded", code: accessCode });
      } else {
        accessCode = enteredCode || generatePrototypeReportCode();
        createPrototypeReportCode(accessCode);
        setFeedback({ kind: "success", key: "demoCodeCreated", code: accessCode });
      }
      setCustomCode("");
    } catch (error) {
      setFeedback({
        kind: "error",
        message: errorMessageFrom(error, t("home.upload.feedback.uploadError", { ns: "couple" })),
      });
    } finally {
      setSaving(false);
    }
  }

  const isValidCode = authenticated ? isValidReportAccessCode : isValidPrototypeReportCode;
  const displayedCode =
    feedback?.kind === "success" ? feedback.code : authenticated ? null : reportAccess.code;

  return (
    <section
      data-dashboard-section="upload"
      aria-labelledby="report-upload-heading"
      className="motion-card-lift flex flex-col gap-5 rounded-2xl border border-border-subtle bg-sand-100 p-5 shadow-xs sm:p-7"
    >
      <div className="flex flex-col gap-2">
        <h2
          id="report-upload-heading"
          className="motion-text-reveal text-xl font-semibold text-teal-900"
        >
          {t("home.upload.title", { ns: "couple" })}
        </h2>
        <p className="max-w-3xl text-base leading-relaxed text-ink-600">
          {t("home.upload.lead", { ns: "couple" })}
        </p>
        <p className="rounded-lg border border-border-subtle bg-card p-4 text-sm leading-relaxed text-ink-900">
          {t(authenticated ? "home.upload.privateNotice" : "home.upload.demoNotice", {
            ns: "couple",
          })}
        </p>
      </div>

      <form
        className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => void submit(event)}
      >
        <div className="flex min-h-24 flex-col justify-center gap-2 rounded-lg border border-border-subtle bg-card p-4">
          <p className="text-sm font-semibold text-teal-900">
            {t(authenticated ? "home.upload.fileLabel" : "home.upload.demoFileLabel", {
              ns: "couple",
            })}
          </p>
          <p className="text-sm text-ink-600">
            {t("home.upload.fileHelp", { ns: "couple" })}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="custom-report-code" className="text-sm font-semibold text-teal-900">
            {t("home.upload.customCodeLabel", { ns: "couple" })}
          </label>
          <input
            id="custom-report-code"
            name="customCode"
            type="text"
            lang="en"
            dir="ltr"
            autoComplete="off"
            maxLength={REPORT_CODE_LENGTH}
            inputMode="numeric"
            value={customCode}
            aria-invalid={customCode.length > 0 && !isValidCode(customCode)}
            onChange={(event) => {
              setCustomCode(sanitizeReportAccessCodeInput(event.target.value));
              setFeedback(null);
            }}
            className="min-h-12 w-full rounded-lg border border-border-subtle bg-background px-3 font-mono text-base tracking-[0.12em] text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            placeholder={t("home.upload.customCodePlaceholder", { ns: "couple" })}
          />
          <span className="text-sm text-ink-600">
            {t("home.upload.codeFormat", { ns: "couple" })}
          </span>
        </div>
        <Button type="submit" disabled={saving} className="md:mb-6">
          {saving
            ? t("home.upload.saving", { ns: "couple" })
            : t(authenticated ? "home.upload.uploadButton" : "home.upload.createCode", {
                ns: "couple",
              })}
        </Button>
      </form>

      {feedback?.kind === "error" ? (
        <p role="alert" aria-live="polite" className="text-sm font-medium text-danger-600">
          {feedback.message}
        </p>
      ) : null}
      {feedback?.kind === "success" ? (
        <p role="status" aria-live="polite" className="text-sm font-medium text-teal-900">
          {t(`home.upload.feedback.${feedback.key}`, { ns: "couple" })}
        </p>
      ) : null}

      {displayedCode !== null ? (
        <div
          data-dashboard-section="access-code"
          className="flex flex-col gap-4 rounded-xl border border-teal-700/30 bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-teal-900">
              {t("home.upload.codeHeading", { ns: "couple" })}
            </p>
            <p
              lang="en"
              dir="ltr"
              className="font-mono text-2xl font-bold tracking-[0.18em] text-teal-900"
            >
              {displayedCode}
            </p>
            <p className="text-sm text-ink-600">
              {t(authenticated ? "home.upload.privateCodeHelp" : "home.upload.codeReady", {
                ns: "couple",
              })}
            </p>
          </div>
          <Button asChild>
            <Link to="/app/reports">{t("home.upload.openReports", { ns: "couple" })}</Link>
          </Button>
        </div>
      ) : null}
    </section>
  );
}
