import { useTranslation } from "react-i18next";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SYNTHETIC_CHART_DEMO } from "./demo-data";

type PlaceholderMetric = {
  id: string;
  titleKey: string;
  descriptionKey: string;
};

const LEARNING_METRICS: PlaceholderMetric[] = [
  { id: "checks_completed", titleKey: "platform.learning.checks", descriptionKey: "platform.learning.checksDesc" },
  { id: "correct_rate", titleKey: "platform.learning.correct", descriptionKey: "platform.learning.correctDesc" },
  { id: "topics_review", titleKey: "platform.learning.topics", descriptionKey: "platform.learning.topicsDesc" },
];

const COUNSELLING_METRICS: PlaceholderMetric[] = [
  { id: "requests", titleKey: "platform.counselling.requests", descriptionKey: "platform.counselling.requestsDesc" },
  { id: "referral", titleKey: "platform.counselling.referral", descriptionKey: "platform.counselling.referralDesc" },
  { id: "time", titleKey: "platform.counselling.time", descriptionKey: "platform.counselling.timeDesc" },
];

const EQUITY_METRICS: PlaceholderMetric[] = [
  { id: "language", titleKey: "platform.equity.language", descriptionKey: "platform.equity.languageDesc" },
  { id: "accessibility", titleKey: "platform.equity.accessibility", descriptionKey: "platform.equity.accessibilityDesc" },
  { id: "engagement", titleKey: "platform.equity.engagement", descriptionKey: "platform.equity.engagementDesc" },
];

const PRIVACY_METRICS: PlaceholderMetric[] = [
  { id: "consent", titleKey: "platform.privacy.consent", descriptionKey: "platform.privacy.consentDesc" },
  { id: "revoked", titleKey: "platform.privacy.revoked", descriptionKey: "platform.privacy.revokedDesc" },
  { id: "feedback", titleKey: "platform.privacy.feedback", descriptionKey: "platform.privacy.feedbackDesc" },
];

export function PlatformImpactDashboard() {
  const { t } = useTranslation();
  const chartRows = SYNTHETIC_CHART_DEMO.map((row) => ({
    label: t(row.labelKey, { ns: "insights" }),
    value: row.value,
  }));

  return (
    <div className="flex flex-col gap-10">
      <p className="max-w-3xl text-base text-ink-600">{t("platform.intro", { ns: "insights" })}</p>
      <img
        src="/images/outcomes/comprehension-access/analytics-illustration.svg"
        alt={t("platform.heroAlt", { ns: "insights" })}
        className="max-h-36 w-full max-w-xl object-contain"
        loading="lazy"
      />

      <MetricSection headingKey="platform.learning.heading" metrics={LEARNING_METRICS} />
      <MetricSection headingKey="platform.counselling.heading" metrics={COUNSELLING_METRICS} />
      <MetricSection headingKey="platform.equity.heading" metrics={EQUITY_METRICS} />
      <MetricSection headingKey="platform.privacy.heading" metrics={PRIVACY_METRICS} />

      <section className="flex flex-col gap-3" aria-labelledby="synthetic-chart-heading">
        <h2 id="synthetic-chart-heading" className="text-xl font-semibold text-teal-900">
          {t("syntheticChart.heading", { ns: "insights" })}
        </h2>
        <p className="text-sm font-semibold text-amber-900">{t("syntheticChart.label", { ns: "insights" })}</p>
        <div className="min-w-0 overflow-x-auto" aria-hidden="true">
          <BarChart width={420} height={200} data={chartRows}>
            <XAxis dataKey="label" />
            <YAxis hide />
            <Bar dataKey="value" fill="var(--teal-700)" isAnimationActive={false} />
          </BarChart>
        </div>
        <p className="text-sm text-ink-600">{t("syntheticChart.caption", { ns: "insights" })}</p>
      </section>
    </div>
  );
}

function MetricSection({
  headingKey,
  metrics,
}: {
  headingKey: string;
  metrics: PlaceholderMetric[];
}) {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col gap-4" aria-labelledby={headingKey}>
      <h2 id={headingKey} className="text-xl font-semibold text-teal-900">
        {t(headingKey, { ns: "insights" })}
      </h2>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {metrics.map((metric) => (
          <li key={metric.id}>
            <Card className="h-full border-dashed">
              <CardHeader>
                <CardTitle className="text-base">{t(metric.titleKey, { ns: "insights" })}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-ink-600">{t(metric.descriptionKey, { ns: "insights" })}</p>
                <p className="text-sm font-semibold text-amber-900" role="status">
                  {t("platform.awaitingData", { ns: "insights" })}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
