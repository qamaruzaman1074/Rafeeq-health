import { useTranslation } from "react-i18next";
import { PublicNav } from "@/components/public-nav";

export function Component() {
  const { t } = useTranslation();

  return (
    <div className="ms-auto me-auto flex w-full max-w-3xl flex-col gap-10">
      <PublicNav current="trust" />
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-teal-900">
          {t("trust.title", { ns: "landing" })}
        </h1>
        <p>{t("trust.synthetic", { ns: "landing" })}</p>
        <p>{t("trust.frequencies", { ns: "landing" })}</p>
      </header>
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-teal-900">
          {t("trust.privacy.heading", { ns: "landing" })}
        </h2>
        <ul className="flex list-disc flex-col gap-2 ps-6">
          <li>{t("trust.privacy.own", { ns: "landing" })}</li>
          <li>{t("trust.privacy.overlap", { ns: "landing" })}</li>
          <li>{t("trust.privacy.clinic", { ns: "landing" })}</li>
          <li>{t("trust.privacy.counsellor", { ns: "landing" })}</li>
          <li>{t("trust.privacy.analyst", { ns: "landing" })}</li>
          <li>{t("trust.privacy.audit", { ns: "landing" })}</li>
          <li>{t("trust.privacy.revoke", { ns: "landing" })}</li>
          <li>{t("trust.privacy.guest", { ns: "landing" })}</li>
          <li>{t("trust.privacy.minimise", { ns: "landing" })}</li>
        </ul>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-teal-900">
          {t("trust.ai.heading", { ns: "landing" })}
        </h2>
        <p>{t("trust.ai.role", { ns: "landing" })}</p>
        <p>{t("trust.ai.inputs", { ns: "landing" })}</p>
        <p>{t("trust.ai.limits", { ns: "landing" })}</p>
        <p>{t("trust.ai.human", { ns: "landing" })}</p>
        <p>{t("trust.ai.routes", { ns: "landing" })}</p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-teal-900">
          {t("trust.review.heading", { ns: "landing" })}
        </h2>
        <p>{t("trust.review.status", { ns: "landing" })}</p>
        <p>{t("trust.review.draft", { ns: "landing" })}</p>
        <p>{t("trust.review.arabic", { ns: "landing" })}</p>
      </section>
    </div>
  );
}
