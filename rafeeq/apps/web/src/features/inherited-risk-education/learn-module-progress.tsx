import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { COMPREHENSION_TOPIC_IDS } from "@/features/comprehension-access/content-model";
import { learningProgressSnapshot, subscribeLearningProgress } from "@/features/comprehension-access/learning-progress";
import { LEARN_MODULES } from "@/features/learn/modules";

export function LearnModuleProgress() {
  const { t } = useTranslation();
  const progress = useSyncExternalStore(
    subscribeLearningProgress,
    learningProgressSnapshot,
    learningProgressSnapshot,
  );
  const completedChecks = progress.checksCompleted.length;
  const checkTotal = COMPREHENSION_TOPIC_IDS.length;
  const checkPercent = Math.round((completedChecks / checkTotal) * 100);

  return (
    <section className="flex flex-col gap-4" aria-labelledby="learn-progress-heading">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="learn-progress-heading" className="text-xl font-semibold text-teal-900">
          {t("progress.heading", { ns: "learn" })}
        </h2>
        <Badge variant="notice">{t("progress.demoBadge", { ns: "learn" })}</Badge>
      </div>
      <p className="max-w-2xl text-sm text-ink-600">{t("progress.lead", { ns: "learn" })}</p>
      <div
        className="h-2 w-full max-w-xl overflow-hidden rounded-full bg-sand-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={checkPercent}
        aria-label={t("progress.bar", { ns: "learn" })}
      >
        <div className="h-full bg-teal-600 transition-[width] motion-reduce:transition-none" style={{ width: `${checkPercent}%` }} />
      </div>
      <p className="text-sm text-ink-600">
        {t("journey.metrics.checks", { ns: "learn" })}:{" "}
        {t("journey.metrics.count", { ns: "learn", n: completedChecks, total: checkTotal })}
      </p>
      <ul className="flex flex-wrap gap-2">
        {LEARN_MODULES.map((module, index) => (
          <li key={module.id}>
            <a
              href={`#learn-${module.id}`}
              className="nav-pill inline-flex min-h-10 items-center border border-border-subtle bg-card px-3 text-sm"
            >
              {index + 1}. {t(module.titleKey, { ns: "learn" })}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-sm">
        <Link
          to="/understanding-genetic-risk"
          className="font-medium text-teal-800 underline-offset-4 hover:underline"
        >
          {t("progress.hubLink", { ns: "learn" })}
        </Link>
      </p>
    </section>
  );
}
