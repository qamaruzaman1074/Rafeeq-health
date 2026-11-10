import { useTranslation } from "react-i18next";
import { ArabicReviewNotice } from "@/features/comprehension-access/arabic-review-notice";
import { EducationalMcq } from "@/features/comprehension-access/educational-mcq";
import { LearningJourney } from "@/features/comprehension-access/learning-journey";
import { CheckView } from "@/features/check/check-view";

export function Component() {
  const { t } = useTranslation();

  return (
    <div className="ms-auto me-auto flex w-full max-w-3xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-teal-900">{t("page.title", { ns: "check" })}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-ink-600">
          {t("page.intro", { ns: "check" })}
        </p>
      </header>
      <ArabicReviewNotice />
      <LearningJourney compact />
      <EducationalMcq />
      <section className="flex flex-col gap-4 border-t border-border-subtle pt-8" aria-labelledby="teach-back-api">
        <h2 id="teach-back-api" className="text-xl font-semibold text-teal-900">
          {t("page.teachBackSection", { ns: "check" })}
        </h2>
        <img
          src="/images/outcomes/comprehension-access/learning-journey.svg"
          alt=""
          className="max-h-16 w-full max-w-md object-contain opacity-80"
          loading="lazy"
          aria-hidden="true"
        />
        <CheckView hideHeading />
      </section>
    </div>
  );
}
