import { useId, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { NoticePanel } from "@/components/public/marketing-blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, CONTACT_PHONES, mailtoHref } from "@/config/contact";
import {
  validateContact,
  type ContactDraft,
  type ContactErrors,
} from "@/features/contact/validate";

const topics = ["general", "privacy", "accessibility", "feedback"] as const;

const fieldClass =
  "min-h-11 w-full rounded-lg border border-border bg-card ps-3 pe-3 py-2 text-base text-foreground shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-teal-700/50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring aria-[invalid=true]:border-destructive";

const emptyDraft: ContactDraft = { name: "", email: "", topic: "general", message: "" };

export function Component() {
  const { t } = useTranslation();
  const id = useId();
  const [draft, setDraft] = useState<ContactDraft>(emptyDraft);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [prepared, setPrepared] = useState<ContactDraft | null>(null);

  const update = (key: keyof ContactDraft) => (value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setPrepared(null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validateContact(draft);
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setPrepared(draft);
      setDraft(emptyDraft);
    }
  };

  const errorId = (key: keyof ContactErrors) => `${id}-${key}-error`;

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14">
        <PageHeader
          eyebrow={t("contact.eyebrow", { ns: "public" })}
          title={t("contact.heroTitle", { ns: "public" })}
          description={t("contact.heroIntro", { ns: "public" })}
        />
      </Section>

      <Section wide className="!pb-16" reveal={false}>
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <form
            noValidate
            onSubmit={onSubmit}
            className="flex flex-col gap-5 rounded-2xl border border-border-subtle bg-card p-6 shadow-xs sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-teal-900">
                  {t("contact.name", { ns: "public" })}
                </span>
                <input
                  className={fieldClass}
                  autoComplete="name"
                  value={draft.name}
                  aria-invalid={errors.name === true}
                  aria-describedby={errors.name ? errorId("name") : undefined}
                  onChange={(event) => {
                    update("name")(event.target.value);
                  }}
                />
                {errors.name ? (
                  <span id={errorId("name")} className="text-sm text-destructive">
                    {t("contact.errors.name", { ns: "public" })}
                  </span>
                ) : null}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-teal-900">
                  {t("contact.email", { ns: "public" })}
                </span>
                <input
                  type="email"
                  className={fieldClass}
                  autoComplete="email"
                  value={draft.email}
                  aria-invalid={errors.email === true}
                  aria-describedby={errors.email ? errorId("email") : undefined}
                  onChange={(event) => {
                    update("email")(event.target.value);
                  }}
                />
                {errors.email ? (
                  <span id={errorId("email")} className="text-sm text-destructive">
                    {t("contact.errors.email", { ns: "public" })}
                  </span>
                ) : null}
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-teal-900">
                {t("contact.topic", { ns: "public" })}
              </span>
              <select
                className={fieldClass}
                value={draft.topic}
                onChange={(event) => {
                  update("topic")(event.target.value);
                }}
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {t(`contact.topics.${topic}`, { ns: "public" })}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-teal-900">
                {t("contact.message", { ns: "public" })}
              </span>
              <textarea
                rows={6}
                className={fieldClass}
                value={draft.message}
                aria-invalid={errors.message === true}
                aria-describedby={errors.message ? errorId("message") : undefined}
                onChange={(event) => {
                  update("message")(event.target.value);
                }}
              />
              {errors.message ? (
                <span id={errorId("message")} className="text-sm text-destructive">
                  {t("contact.errors.message", { ns: "public" })}
                </span>
              ) : null}
            </label>
            <p className="text-sm text-ink-600">{t("contact.notice", { ns: "public" })}</p>
            <Button type="submit" className="w-fit">
              {t("contact.submit", { ns: "public" })}
            </Button>
            <div role="status" className="flex flex-col gap-3">
              {prepared !== null ? (
                <>
                  <p className="text-base font-medium text-teal-900">
                    {t("contact.success", { ns: "public", email: CONTACT_EMAIL })}
                  </p>
                  <Button asChild variant="secondary" className="w-fit">
                    <a
                      href={mailtoHref(
                        t(`contact.topics.${prepared.topic}`, { ns: "public" }),
                        `${prepared.message}\n\n${prepared.name}`,
                      )}
                    >
                      {t("contact.openEmail", { ns: "public" })}
                    </a>
                  </Button>
                </>
              ) : null}
            </div>
          </form>
          <div className="flex flex-col gap-6">
            <section
              aria-labelledby="contact-details"
              className="flex flex-col gap-5 rounded-2xl border border-border-subtle bg-card p-6 shadow-xs sm:p-8"
            >
              <h2 id="contact-details" className="text-lg font-semibold text-teal-900">
                {t("contact.detailsHeading", { ns: "public" })}
              </h2>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-ink-600">
                  {t("contact.emailLabel", { ns: "public" })}
                </p>
                <a
                  href={mailtoHref()}
                  className="contact-link w-fit text-lg font-semibold text-teal-700"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-ink-600">
                    {t("contact.phoneLabel", { ns: "public" })}
                  </p>
                  <Badge variant="notice">{t("contact.phoneBadge", { ns: "public" })}</Badge>
                </div>
                <ul className="flex flex-col gap-1">
                  {CONTACT_PHONES.map((phone) => (
                    <li key={phone.tel}>
                      <a
                        href={`tel:${phone.tel}`}
                        data-placeholder={phone.placeholder}
                        className="contact-link w-fit text-lg font-semibold text-teal-700"
                      >
                        <span dir="ltr">{phone.display}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-ink-600">{t("contact.phoneNote", { ns: "public" })}</p>
              </div>
            </section>
            <NoticePanel heading={t("contact.urgentHeading", { ns: "public" })}>
              <p>{t("contact.urgent", { ns: "public" })}</p>
            </NoticePanel>
          </div>
        </div>
      </Section>
    </div>
  );
}
