import { useTranslation } from "react-i18next";
import { stepLabel } from "@/features/care/labels";
import type { CouplePathway } from "@/features/care/types";
import { cn } from "@/lib/utils";

export function PathwayTimeline({ pathway }: { pathway: CouplePathway }) {
  const { t } = useTranslation();

  return (
    <ol aria-label={t("timeline.label", { ns: "care" })} className="flex flex-col gap-4">
      {pathway.steps.map((step) => {
        const current = step.id === pathway.current_step;
        return (
          <li
            key={step.id}
            data-step={step.id}
            data-current={current ? "true" : "false"}
            data-reached={step.reached ? "true" : "false"}
            aria-current={current ? "step" : undefined}
            className={cn("border-s-2 ps-4", current ? "border-teal-700" : "border-teal-100")}
          >
            <span
              className={cn(
                "inline-flex min-h-11 items-center",
                current ? "font-semibold text-teal-900" : "text-ink-900",
                !step.reached && !current && "text-ink-600",
              )}
            >
              {stepLabel(step.id, t)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
