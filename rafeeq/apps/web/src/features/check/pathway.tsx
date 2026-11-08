import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useSyncExternalStore } from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { isCheckComplete, subscribeCheckProgress } from "@/features/check/progress";
import { cn } from "@/lib/utils";

const PATHWAY_STEPS = [
  { id: "result", to: "/app/result" },
  { id: "understand", to: "/app/learn" },
  { id: "check", to: "/app/check" },
  { id: "share", to: null },
  { id: "counselling", to: null },
  { id: "next", to: null },
] as const;

type StepId = (typeof PATHWAY_STEPS)[number]["id"];

function stepLabel(id: StepId, t: TFunction): string {
  switch (id) {
    case "result":
      return t("pathway.result", { ns: "check" });
    case "understand":
      return t("pathway.understand", { ns: "check" });
    case "check":
      return t("pathway.check", { ns: "check" });
    case "share":
      return t("pathway.share", { ns: "check" });
    case "counselling":
      return t("pathway.counselling", { ns: "check" });
    case "next":
      return t("pathway.next", { ns: "check" });
    default: {
      const unreachable: never = id;
      return unreachable;
    }
  }
}

const linkClass =
  "inline-flex min-h-11 items-center text-teal-700 underline decoration-teal-700 underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500";

export function PathwayProgress() {
  const { t } = useTranslation();
  const complete = useSyncExternalStore(subscribeCheckProgress, isCheckComplete, isCheckComplete);

  return (
    <ol
      aria-label={t("pathway.label", { ns: "check" })}
      className="flex flex-wrap items-center gap-x-3 gap-y-2"
    >
      {PATHWAY_STEPS.map((step, index) => {
        const label = stepLabel(step.id, t);
        const done = step.id === "check" && complete;
        return (
          <li
            key={step.id}
            className="flex items-center gap-3"
            data-step={step.id}
            data-complete={step.id === "check" ? (complete ? "true" : "false") : undefined}
          >
            {index > 0 ? (
              <span aria-hidden="true" className="text-ink-600">
                ·
              </span>
            ) : null}
            {step.to !== null ? (
              <Link
                to={step.to}
                className={cn(linkClass, done && "text-green-600 decoration-green-600")}
              >
                {label}
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center text-ink-900">{label}</span>
            )}
            {done ? <Badge variant="positive">{t("pathway.done", { ns: "check" })}</Badge> : null}
          </li>
        );
      })}
    </ol>
  );
}
