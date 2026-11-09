import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { NoticePanel } from "@/components/public/marketing-blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EMPTY_REFERRAL_PREVIEW,
  type ReferralPreviewDraft,
} from "@/features/genetic-counselling/referral-preview-model";

type Step = "edit" | "review" | "preview";

export function ReferralRequestPreview({
  clinicShareOn,
}: {
  clinicShareOn: boolean | null;
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("edit");
  const [draft, setDraft] = useState<ReferralPreviewDraft>(EMPTY_REFERRAL_PREVIEW);

  const shareHint = clinicShareOn === false;

  return (
    <section
      className="flex flex-col gap-4"
      data-care-section="referral-preview"
      aria-labelledby="referral-preview-heading"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="referral-preview-heading" className="text-xl font-semibold text-teal-900">
          {t("referralPreview.heading", { ns: "care" })}
        </h2>
        <Badge variant="notice">{t("referralPreview.badge", { ns: "care" })}</Badge>
      </div>
      <p className="max-w-2xl text-base leading-relaxed text-ink-600">
        {t("referralPreview.lead", { ns: "care" })}
      </p>
      <NoticePanel>
        <p className="font-medium">{t("referralPreview.notSubmitted", { ns: "care" })}</p>
      </NoticePanel>

      {step === "edit" ? (
        <ReferralForm
          draft={draft}
          shareHint={shareHint}
          onChange={setDraft}
          onReview={() => {
            setStep("review");
          }}
        />
      ) : null}
      {step === "review" ? (
        <ReferralReview
          draft={draft}
          clinicShareOn={clinicShareOn}
          onBack={() => {
            setStep("edit");
          }}
          onShowPreview={() => {
            setStep("preview");
          }}
        />
      ) : null}
      {step === "preview" ? (
        <ReferralPreviewOnly
          draft={draft}
          onReset={() => {
            setDraft(EMPTY_REFERRAL_PREVIEW);
            setStep("edit");
          }}
        />
      ) : null}
    </section>
  );
}

function ReferralForm({
  draft,
  shareHint,
  onChange,
  onReview,
}: {
  draft: ReferralPreviewDraft;
  shareHint: boolean;
  onChange: (next: ReferralPreviewDraft) => void;
  onReview: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("referralPreview.form.title", { ns: "care" })}</CardTitle>
        <CardDescription>{t("referralPreview.form.note", { ns: "care" })}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field
          id="referral-reason"
          label={t("referralPreview.fields.reason", { ns: "care" })}
          value={draft.reason}
          onChange={(reason) => {
            onChange({ ...draft, reason });
          }}
          placeholder={t("referralPreview.placeholders.reason", { ns: "care" })}
        />
        <Field
          id="referral-topic"
          label={t("referralPreview.fields.topic", { ns: "care" })}
          value={draft.topic}
          onChange={(topic) => {
            onChange({ ...draft, topic });
          }}
          placeholder={t("referralPreview.placeholders.topic", { ns: "care" })}
        />
        <label className="flex flex-col gap-1 text-sm font-medium text-teal-900">
          {t("referralPreview.fields.communication", { ns: "care" })}
          <select
            className="min-h-11 rounded-md border border-border-subtle bg-background px-3 text-base"
            value={draft.communication}
            onChange={(event) => {
              const value = event.target.value as ReferralPreviewDraft["communication"];
              onChange({ ...draft, communication: value });
            }}
          >
            <option value="unsure">{t("referralPreview.communication.unsure", { ns: "care" })}</option>
            <option value="video">{t("referralPreview.communication.video", { ns: "care" })}</option>
            <option value="phone">{t("referralPreview.communication.phone", { ns: "care" })}</option>
            <option value="in_person">{t("referralPreview.communication.inPerson", { ns: "care" })}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-teal-900">
          {t("referralPreview.fields.language", { ns: "care" })}
          <select
            className="min-h-11 rounded-md border border-border-subtle bg-background px-3 text-base"
            value={draft.language}
            onChange={(event) => {
              const value = event.target.value as ReferralPreviewDraft["language"];
              onChange({ ...draft, language: value });
            }}
          >
            <option value="en">{t("referralPreview.language.en", { ns: "care" })}</option>
            <option value="ar">{t("referralPreview.language.ar", { ns: "care" })}</option>
            <option value="other">{t("referralPreview.language.other", { ns: "care" })}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-teal-900">
          {t("referralPreview.fields.questions", { ns: "care" })}
          <textarea
            rows={4}
            className="rounded-md border border-border-subtle bg-background p-3 text-base"
            value={draft.questions}
            placeholder={t("referralPreview.placeholders.questions", { ns: "care" })}
            onChange={(event) => {
              onChange({ ...draft, questions: event.target.value });
            }}
          />
        </label>
        <label className="flex items-start gap-2 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={draft.consentPreviewAcknowledged}
            onChange={(event) => {
              onChange({ ...draft, consentPreviewAcknowledged: event.target.checked });
            }}
          />
          <span>{t("referralPreview.consent.ack", { ns: "care" })}</span>
        </label>
        {shareHint ? (
          <p className="text-sm text-ink-600">
            {t("referralPreview.consent.off", { ns: "care" })}{" "}
            <Link to="/app/privacy" className="font-medium text-teal-800 underline-offset-4 hover:underline">
              {t("send.privacy", { ns: "care" })}
            </Link>
          </p>
        ) : null}
        <Button
          type="button"
          disabled={draft.reason.trim().length === 0 || !draft.consentPreviewAcknowledged}
          onClick={onReview}
        >
          {t("referralPreview.form.review", { ns: "care" })}
        </Button>
      </CardContent>
    </Card>
  );
}

function ReferralReview({
  draft,
  clinicShareOn,
  onBack,
  onShowPreview,
}: {
  draft: ReferralPreviewDraft;
  clinicShareOn: boolean | null;
  onBack: () => void;
  onShowPreview: () => void;
}) {
  const { t } = useTranslation();
  const shareLabel =
    clinicShareOn === null
      ? t("referralPreview.consent.unknown", { ns: "care" })
      : clinicShareOn
        ? t("referralPreview.consent.on", { ns: "care" })
        : t("referralPreview.consent.offShort", { ns: "care" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("referralPreview.review.title", { ns: "care" })}</CardTitle>
        <CardDescription>{t("referralPreview.review.lead", { ns: "care" })}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ReviewRow label={t("referralPreview.fields.reason", { ns: "care" })} value={draft.reason} />
        <ReviewRow label={t("referralPreview.fields.topic", { ns: "care" })} value={draft.topic} />
        <ReviewRow
          label={t("referralPreview.fields.communication", { ns: "care" })}
          value={t(`referralPreview.communication.${draft.communication === "in_person" ? "inPerson" : draft.communication}`, {
            ns: "care",
          })}
        />
        <ReviewRow
          label={t("referralPreview.fields.language", { ns: "care" })}
          value={t(`referralPreview.language.${draft.language}`, { ns: "care" })}
        />
        <ReviewRow label={t("referralPreview.fields.questions", { ns: "care" })} value={draft.questions} />
        <ReviewRow label={t("referralPreview.consent.previewLabel", { ns: "care" })} value={shareLabel} />
        <NoticePanel>
          <p>{t("referralPreview.notSubmitted", { ns: "care" })}</p>
        </NoticePanel>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={onBack}>
            {t("referralPreview.review.back", { ns: "care" })}
          </Button>
          <Button type="button" onClick={onShowPreview}>
            {t("referralPreview.review.showPreview", { ns: "care" })}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ReferralPreviewOnly({ draft, onReset }: { draft: ReferralPreviewDraft; onReset: () => void }) {
  const { t } = useTranslation();
  return (
    <Card className="border-amber-300 bg-amber-50/50">
      <CardHeader>
        <CardTitle>{t("referralPreview.done.title", { ns: "care" })}</CardTitle>
        <CardDescription>{t("referralPreview.done.lead", { ns: "care" })}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="rounded-lg border border-amber-400 bg-amber-100 p-4 text-base font-semibold text-ink-900">
          {t("referralPreview.notSubmitted", { ns: "care" })}
        </p>
        <pre className="max-h-64 overflow-auto rounded-md border border-border-subtle bg-background p-4 text-sm whitespace-pre-wrap">
          {JSON.stringify(
            {
              reason: draft.reason,
              topic: draft.topic,
              communication: draft.communication,
              language: draft.language,
              questions: draft.questions,
            },
            null,
            2,
          )}
        </pre>
        <p className="text-sm text-ink-600">{t("referralPreview.done.noBackend", { ns: "care" })}</p>
        <Button type="button" variant="secondary" onClick={onReset}>
          {t("referralPreview.done.reset", { ns: "care" })}
        </Button>
      </CardContent>
    </Card>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-sm font-medium text-teal-900">
      {label}
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        className="min-h-11 rounded-md border border-border-subtle bg-background px-3 text-base"
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </label>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-border-subtle pb-2 sm:grid-cols-3">
      <dt className="text-sm font-semibold text-teal-900">{label}</dt>
      <dd className="sm:col-span-2 text-base text-ink-600">{value.length > 0 ? value : "—"}</dd>
    </div>
  );
}
