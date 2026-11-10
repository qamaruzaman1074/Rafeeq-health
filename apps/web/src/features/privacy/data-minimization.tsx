import { useTranslation } from "react-i18next";
import { MediaSplit } from "@/components/public/marketing-blocks";

export function DataMinimization() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="data-minimization-heading">
      <MediaSplit
        image="/images/outcomes/privacy/permissions-diagram.svg"
        imageAlt={t("education.minimization.imageAlt", { ns: "privacy" })}
      >
        <h2 id="data-minimization-heading" className="text-xl font-semibold text-teal-900">
          {t("education.minimization.heading", { ns: "privacy" })}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          {t("education.minimization.body", { ns: "privacy" })}
        </p>
      </MediaSplit>
    </section>
  );
}
