import { useTranslation } from "react-i18next";
import type { AppNamespace } from "@/i18n/namespaces";

const STEP_SUFFIXES = ["understand", "explore", "discuss", "decide"] as const;

type DecisionJourneyVisualProps = {
  ns?: AppNamespace;
  stepsKeyPrefix?: string;
  captionKey?: string;
  srTitleKey?: string;
};

export function DecisionJourneyVisual({
  ns = "public",
  stepsKeyPrefix = "informedChoices.journey.steps",
  captionKey = "informedChoices.journey.caption",
  srTitleKey = "informedChoices.journey.srTitle",
}: DecisionJourneyVisualProps) {
  const { t } = useTranslation();
  const titleId = "decision-journey-title";

  return (
    <figure className="w-full">
      <h3 id={titleId} className="sr-only">
        {t(srTitleKey, { ns })}
      </h3>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-4" aria-labelledby={titleId}>
        {STEP_SUFFIXES.map((step, index) => (
          <li key={step} className="relative flex flex-col items-center gap-2 text-center">
            <span
              className="flex size-10 items-center justify-center rounded-full border-2 border-teal-700 bg-teal-50 text-sm font-semibold text-teal-900"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span className="text-base font-semibold text-teal-900">
              {t(`${stepsKeyPrefix}.${step}`, { ns })}
            </span>
            {index < STEP_SUFFIXES.length - 1 ? (
              <span
                className="absolute end-0 top-5 hidden h-0.5 w-1/2 translate-x-1/2 bg-teal-300 sm:block"
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-sm text-ink-600">{t(captionKey, { ns })}</figcaption>
    </figure>
  );
}
