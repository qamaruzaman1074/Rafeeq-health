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
  { id: "share", to: "/app/privacy" },
  { id: "counselling", to: "/app/care" },
  { id: "next", to: "/app/ask" },
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

const focusClass =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500";

export function PathwayProgress() {
  const { t } = useTranslation();
  const complete = useSyncExternalStore(subscribeCheckProgress, isCheckComplete, isCheckComplete);

  return (
    <ol
      aria-label={t("pathway.label", { ns: "check" })}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {PATHWAY_STEPS.map((step) => {
        const label = stepLabel(step.id, t);
        const done = step.id === "check" && complete;
        return (
          <li
            key={step.id}
            className="min-w-0"
            data-step={step.id}
            data-complete={step.id === "check" ? (complete ? "true" : "false") : undefined}
          >
            <Link
              to={step.to}
              className={cn(
                "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-border-subtle bg-sand-100 ps-4 pe-4 py-3 text-teal-900 shadow-xs transition-colors duration-150 hover:border-teal-500 hover:bg-teal-100",
                focusClass,
                done && "border-green-600 bg-teal-100",
              )}
            >
              <span className="font-medium">{label}</span>
              {done ? <Badge variant="positive">{t("pathway.done", { ns: "check" })}</Badge> : null}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
