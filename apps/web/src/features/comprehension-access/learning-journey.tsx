import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { COMPREHENSION_TOPIC_IDS } from "./content-model";
import { learningProgressSnapshot, subscribeLearningProgress } from "./learning-progress";

const JOURNEY_STEPS = [
  { id: "understand", href: "/understanding-genetic-risk" },
  { id: "learn", href: "/app/learn" },
  { id: "check", href: "/app/check#comprehension-mcq" },
  { id: "review", href: "/app/learn#learn-progress-heading" },
  { id: "explore", href: "/screening-pathways" },
] as const;

export function LearningJourney({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const progress = useSyncExternalStore(
    subscribeLearningProgress,
    learningProgressSnapshot,
    learningProgressSnapshot,
  );
  const totalTopics = COMPREHENSION_TOPIC_IDS.length;
  const completed = progress.checksCompleted.length;
  const reviewCount = progress.topicsToReview.length;

  return (
    <section
      className="flex flex-col gap-4"
      aria-labelledby={compact ? "learning-journey-compact" : "learning-journey-full"}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2
          id={compact ? "learning-journey-compact" : "learning-journey-full"}
          className={compact ? "text-xl font-semibold text-teal-900" : "text-2xl font-semibold text-teal-900"}
        >
          {t("journey.heading", { ns: "learn" })}
        </h2>
        <Badge variant="notice">{t("journey.demoBadge", { ns: "learn" })}</Badge>
      </div>
      <p className="max-w-3xl text-sm text-ink-600">{t("journey.lead", { ns: "learn" })}</p>

      <ol
        className="flex flex-col gap-3 border-s-2 border-teal-200 ps-6 ms-1 md:ms-0 md:flex-row md:items-stretch md:border-0 md:ps-0"
        aria-label={t("journey.stepsLabel", { ns: "learn" })}
      >
        {JOURNEY_STEPS.map((step, index) => (
          <li key={step.id} className="relative flex flex-1 flex-col md:items-center md:text-center">
            <span
              className="absolute -start-[1.65rem] top-0 flex size-8 items-center justify-center rounded-full border-2 border-teal-700 bg-teal-50 text-xs font-bold text-teal-900 md:static md:mb-2"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <Link
              to={step.href}
              className="min-h-11 rounded-lg border border-border-subtle bg-card px-3 py-2 text-sm font-medium text-teal-900 underline-offset-4 hover:border-teal-500 hover:bg-teal-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500 md:w-full"
            >
              {t(`journey.steps.${step.id}`, { ns: "learn" })}
            </Link>
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          label={t("journey.metrics.visited", { ns: "learn" })}
          value={t("journey.metrics.count", { ns: "learn", n: progress.topicsVisited.length, total: totalTopics })}
        />
        <MetricCard
          label={t("journey.metrics.checks", { ns: "learn" })}
          value={t("journey.metrics.count", { ns: "learn", n: completed, total: totalTopics })}
        />
        <MetricCard
          label={t("journey.metrics.review", { ns: "learn" })}
          value={t("journey.metrics.count", { ns: "learn", n: reviewCount, total: totalTopics })}
        />
      </div>

      {!compact ? (
        <img
          src="/images/outcomes/comprehension-access/learning-journey.svg"
          alt={t("journey.diagramAlt", { ns: "learn" })}
          className="max-h-28 w-full max-w-2xl object-contain"
          loading="lazy"
        />
      ) : null}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border-subtle bg-sand-100 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{label}</p>
      <p className="mt-1 text-lg font-semibold text-teal-900">{value}</p>
    </div>
  );
}
