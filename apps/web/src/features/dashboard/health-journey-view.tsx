import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { NonDirectiveNotice } from "@/features/informed-choices/non-directive-notice";
import { LearningJourney } from "@/features/comprehension-access/learning-journey";
import { useCopyList } from "@/i18n/copy-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type JourneyPathway = {
  id: "screening" | "assessment" | "counselling" | "take-time";
  title: string;
  lead: string;
  image: string;
  bullets: string[];
};

const PATHWAY_LINKS: Record<JourneyPathway["id"], string> = {
  screening: "/screening-pathways",
  assessment: "/screening-pathways#pathway-assessment",
  counselling: "/genetic-counselling",
  "take-time": "/informed-choices",
};

const PATHWAY_IMAGES: Record<JourneyPathway["id"], string> = {
  screening: "/images/outcomes/informed-choices/reviewing-education.webp",
  assessment: "/images/outcomes/informed-choices/calm-environment.webp",
  counselling: "/images/outcomes/informed-choices/counselling-consultation.jpg",
  "take-time": "/images/outcomes/informed-choices/supportive-conversation.webp",
};

export function HealthJourneyView() {
  const { t } = useTranslation();
  const pathways = useCopyList<JourneyPathway>("informedChoices.pathways.items", "public");

  return (
    <AppPageLayout width="wide">
      <PageHeader
        title={t("journeyHub.title", { ns: "couple" })}
        description={t("journeyHub.intro", { ns: "couple" })}
      />
      <LearningJourney compact />
      <NonDirectiveNotice />
      <section aria-labelledby="journey-pathways-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 id="journey-pathways-heading" className="text-2xl font-semibold text-teal-900">
            {t("informedChoices.pathways.heading", { ns: "public" })}
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-ink-600">
            {t("informedChoices.hero.intro", { ns: "public" })}
          </p>
        </div>
        <RevealStagger className="grid gap-4 md:grid-cols-2">
          {pathways.map((pathway) => {
            const image = pathway.image || PATHWAY_IMAGES[pathway.id];
            return (
              <Card
                key={pathway.id}
                className="motion-card-lift h-full overflow-hidden"
                data-journey-pathway={pathway.id}
              >
                <img
                  src={image}
                  alt={t(`informedChoices.pathways.alt.${pathway.id}`, { ns: "public" })}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <CardHeader>
                  <CardTitle>{pathway.title}</CardTitle>
                  <CardDescription>{pathway.lead}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-start gap-4">
                  <ul className="list-disc space-y-2 ps-5 text-sm leading-relaxed text-ink-600">
                    {pathway.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <Button asChild variant="secondary">
                    <Link to={PATHWAY_LINKS[pathway.id]}>
                      {t("journeyHub.openPathway", { ns: "couple" })}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </RevealStagger>
      </section>
    </AppPageLayout>
  );
}
