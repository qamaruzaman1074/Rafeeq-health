import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { DecisionJourneyVisual } from "@/features/informed-choices/decision-journey-visual";
import { NonDirectiveNotice } from "@/features/informed-choices/non-directive-notice";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList } from "@/i18n/copy-list";

const CARE_SECTION_KEYS = [
  "understand",
  "learnNext",
  "professional",
  "prepare",
  "services",
] as const;

export function CareGuidanceSections() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10">
      <NonDirectiveNotice messageKey="nonDirective" ns="care" />

      <section className="flex flex-col gap-4" data-care-section="journey" aria-labelledby="care-journey-heading">
        <h2 id="care-journey-heading" className="text-xl font-semibold text-teal-900">
          {t("guidance.journey.heading", { ns: "care" })}
        </h2>
        <DecisionJourneyVisual
          ns="care"
          stepsKeyPrefix="guidance.journey.steps"
          captionKey="guidance.journey.caption"
          srTitleKey="guidance.journey.srTitle"
        />
      </section>

      {CARE_SECTION_KEYS.map((key) => (
        <CareSectionBlock key={key} sectionKey={key} />
      ))}
    </div>
  );
}

function CareSectionBlock({ sectionKey }: { sectionKey: (typeof CARE_SECTION_KEYS)[number] }) {
  const { t } = useTranslation();
  const items = useCopyList<string>(`guidance.sections.${sectionKey}.items`, "care");

  return (
    <section className="flex flex-col gap-4" data-care-section={sectionKey} aria-labelledby={`care-${sectionKey}`}>
      <h2 id={`care-${sectionKey}`} className="text-xl font-semibold text-teal-900">
        {t(`guidance.sections.${sectionKey}.heading`, { ns: "care" })}
      </h2>
      <p className="max-w-2xl text-base leading-relaxed text-ink-600">
        {t(`guidance.sections.${sectionKey}.lead`, { ns: "care" })}
      </p>
      {items.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <li key={item.slice(0, 32)}>
              <Card className="h-full">
                <CardHeader>
                  <CardDescription className="text-base leading-relaxed text-ink-900">{item}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
      {sectionKey === "learnNext" ? (
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link to="/app/learn">{t("next.learn", { ns: "care" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/informed-choices">{t("guidance.hubLink", { ns: "care" })}</Link>
          </Button>
        </div>
      ) : null}
      {sectionKey === "professional" ? (
        <WhenCounsellorCards />
      ) : null}
    </section>
  );
}

function WhenCounsellorCards() {
  const { t } = useTranslation();
  return (
    <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {(["result", "question", "share"] as const).map((item) => (
        <li key={item}>
          <Card className="h-full hover:shadow-surface">
            <CardHeader>
              <CardTitle>{t(`when.${item}.title`, { ns: "care" })}</CardTitle>
              <CardDescription>{t(`when.${item}.body`, { ns: "care" })}</CardDescription>
            </CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  );
}
