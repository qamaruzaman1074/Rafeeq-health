import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function LearnRelatedLinks() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col gap-3" data-learn-section="related">
      <h2 className="text-xl font-semibold text-teal-900">
        {t("related.heading", { ns: "learn" })}
      </h2>
      <p className="max-w-2xl text-base leading-relaxed text-ink-600">
        {t("related.lead", { ns: "learn" })}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="secondary">
          <Link to="/app/result">{t("related.results", { ns: "learn" })}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/app/check">{t("related.check", { ns: "learn" })}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/understanding-genetic-risk">{t("related.riskHub", { ns: "learn" })}</Link>
        </Button>
        <Button asChild>
          <Link to="/app/care">{t("related.care", { ns: "learn" })}</Link>
        </Button>
      </div>
    </section>
  );
}
