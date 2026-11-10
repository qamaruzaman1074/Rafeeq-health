import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { MediaSplit, NoticePanel } from "@/components/public/marketing-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList, type TitleBody } from "@/i18n/copy-list";
import { ExpandableSection } from "./expandable-section";
import { ReferralJourneyPreview } from "./referral-journey-preview";
import { ScreeningPathwayTimeline } from "./pathway-timeline";

export function ScreeningPathwaysSections() {
  const { t } = useTranslation();
  const screeningCards = useCopyList<TitleBody>("screeningPathways.screening.cards", "public");
  const confirmatoryTopics = useCopyList<TitleBody>("screeningPathways.confirmatory.topics", "public");
  const specialists = useCopyList<TitleBody>("screeningPathways.specialists.items", "public");

  return (
  <>
    <NoticePanel>
      <p className="font-medium">{t("screeningPathways.disclaimer", { ns: "public" })}</p>
    </NoticePanel>

    <section id="pathway-screening" className="scroll-mt-28 flex flex-col gap-6">
      <ScreeningPathwayTimeline />
      <img
        src="/images/outcomes/screening-pathways/pathway-diagram.svg"
        alt={t("screeningPathways.timeline.diagramAlt", { ns: "public" })}
        className="mx-auto max-h-20 w-full max-w-2xl object-contain"
        loading="lazy"
      />
    </section>

    <section id="pathway-understand" className="scroll-mt-28">
      <MediaSplit
        image="/images/outcomes/screening-pathways/laboratory.webp"
        imageAlt={t("screeningPathways.screening.imageAlt", { ns: "public" })}
      >
        <h2 className="text-2xl font-semibold text-teal-900">
          {t("screeningPathways.screening.heading", { ns: "public" })}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          {t("screeningPathways.screening.body", { ns: "public" })}
        </p>
      </MediaSplit>
      <RevealStagger className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {screeningCards.map((card) => (
          <Card key={card.title} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{card.title}</CardTitle>
              <CardDescription className="text-base leading-relaxed">{card.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </RevealStagger>
    </section>

    <section id="pathway-discuss" className="scroll-mt-28 rounded-2xl border border-border-subtle bg-card p-6 sm:p-10">
      <h2 className="text-2xl font-semibold text-teal-900">
        {t("screeningPathways.discuss.heading", { ns: "public" })}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-600">
        {t("screeningPathways.discuss.body", { ns: "public" })}
      </p>
      <Button asChild className="mt-4">
        <Link to="/genetic-counselling">{t("screeningPathways.discuss.action", { ns: "public" })}</Link>
      </Button>
      <div className="mt-10">
        <ReferralJourneyPreview />
      </div>
    </section>

    <section id="pathway-assessment" className="scroll-mt-28 rounded-2xl border border-border-subtle bg-sand-100 p-6 sm:p-10">
      <h2 className="text-2xl font-semibold text-teal-900">
        {t("screeningPathways.confirmatory.heading", { ns: "public" })}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-600">
        {t("screeningPathways.confirmatory.intro", { ns: "public" })}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {confirmatoryTopics.map((topic) => (
          <ExpandableSection key={topic.title} title={topic.title}>
            <p>{topic.body}</p>
          </ExpandableSection>
        ))}
      </div>
      <img
        src="/images/outcomes/screening-pathways/diagnostic-environment.webp"
        alt={t("screeningPathways.confirmatory.imageAlt", { ns: "public" })}
        className="mt-6 max-h-48 w-full rounded-xl object-cover"
        loading="lazy"
      />
    </section>

    <section id="pathway-specialist" className="scroll-mt-28">
      <MediaSplit
        image="/images/outcomes/screening-pathways/specialist-consultation.webp"
        imageAlt={t("screeningPathways.specialists.imageAlt", { ns: "public" })}
        reverse
      >
        <h2 className="text-2xl font-semibold text-teal-900">
          {t("screeningPathways.specialists.heading", { ns: "public" })}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          {t("screeningPathways.specialists.lead", { ns: "public" })}
        </p>
      </MediaSplit>
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {specialists.map((item) => (
          <li key={item.title}>
            <Card className="h-full border-dashed">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{item.body}</CardDescription>
                <p className="pt-2 text-sm font-semibold text-amber-900">
                  {t("screeningPathways.specialists.pending", { ns: "public" })}
                </p>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
      <img
        src="/images/outcomes/screening-pathways/counselling-environment.webp"
        alt={t("screeningPathways.specialists.counsellingAlt", { ns: "public" })}
        className="mt-6 max-h-40 w-full max-w-xl rounded-xl object-cover"
        loading="lazy"
      />
    </section>
  </>
  );
}
