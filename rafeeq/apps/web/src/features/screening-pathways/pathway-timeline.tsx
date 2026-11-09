import { useTranslation } from "react-i18next";
import { SCREENING_PATHWAY_STEP_IDS } from "./content-model";

export function ScreeningPathwayTimeline() {
  const { t } = useTranslation();
  const titleId = "screening-pathway-timeline-title";

  return (
    <nav aria-labelledby={titleId}>
      <h3 id={titleId} className="sr-only">
        {t("screeningPathways.timeline.srTitle", { ns: "public" })}
      </h3>
      <ol className="flex flex-col gap-0 border-s-2 border-teal-200 ps-6 ms-5 md:ms-0 md:flex-row md:items-start md:justify-between md:gap-2 md:border-0 md:ps-0">
        {SCREENING_PATHWAY_STEP_IDS.map((id, index) => (
          <li
            key={id}
            className="relative flex flex-1 flex-col gap-2 pb-8 text-start last:pb-0 md:min-w-0 md:items-center md:px-1 md:pb-0 md:text-center"
          >
            <span
              className="absolute -start-[1.9rem] top-0 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-teal-700 bg-teal-50 text-sm font-bold text-teal-900 md:static"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <a
              href={`#pathway-${id}`}
              className="text-sm font-semibold text-teal-900 underline-offset-4 hover:underline md:max-w-[11rem]"
            >
              {t(`screeningPathways.timeline.steps.${id}`, { ns: "public" })}
            </a>
            {index < SCREENING_PATHWAY_STEP_IDS.length - 1 ? (
              <>
                <span
                  className="absolute -start-[0.4rem] top-10 bottom-0 w-0.5 bg-teal-200 md:hidden"
                  aria-hidden="true"
                />
                <span
                  className="absolute end-0 top-5 hidden h-0.5 w-1/2 bg-teal-200 md:block [transform:translateX(50%)]"
                  aria-hidden="true"
                />
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
