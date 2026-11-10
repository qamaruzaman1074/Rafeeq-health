import { useTranslation } from "react-i18next";

const STEP_KEYS = ["invite", "review", "select", "consent", "reviewShare"] as const;

export function PartnerInvitationFlow() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-4" aria-labelledby="partner-flow-heading">
      <h2 id="partner-flow-heading" className="text-2xl font-semibold text-teal-900">
        {t("partner.sharingChoice.heading", { ns: "couple" })}
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-ink-600">
        {t("partner.sharingChoice.intro", { ns: "couple" })}
      </p>
      <p className="text-sm font-medium text-teal-800">{t("partner.sharingChoice.independent", { ns: "couple" })}</p>
      <ol className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
        {STEP_KEYS.map((key, index) => (
          <li
            key={key}
            className="flex min-w-[9rem] flex-1 flex-col gap-2 rounded-xl border border-border-subtle bg-card p-4 text-center shadow-xs"
          >
            <span className="text-xs font-bold text-teal-700">
              {t("partner.sharingChoice.step", { ns: "couple", n: index + 1 })}
            </span>
            <span className="text-sm font-semibold text-teal-900">
              {t(`partner.sharingChoice.steps.${key}`, { ns: "couple" })}
            </span>
          </li>
        ))}
      </ol>
      <img
        src="/images/outcomes/privacy/secure-sharing.svg"
        alt={t("partner.sharingChoice.diagramAlt", { ns: "couple" })}
        className="mx-auto max-h-40 w-full max-w-md object-contain"
        loading="lazy"
      />
    </section>
  );
}
