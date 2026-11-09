import { useTranslation } from "react-i18next";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { MediaSplit } from "@/components/public/marketing-blocks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList } from "@/i18n/copy-list";
import { INFORMED_CHOICE_PATHWAY_IDS, type InformedChoicePathwayId } from "./content-model";

type PathwayItem = {
  id: InformedChoicePathwayId;
  title: string;
  lead: string;
  image: string;
  bullets: string[];
};

const PATHWAY_IMAGES: Record<InformedChoicePathwayId, string> = {
  screening: "/images/outcomes/informed-choices/reviewing-education.webp",
  assessment: "/images/outcomes/informed-choices/calm-environment.webp",
  counselling: "/images/outcomes/informed-choices/counselling-consultation.jpg",
  "take-time": "/images/outcomes/informed-choices/supportive-conversation.webp",
};

export function PathwayEducation() {
  const { t } = useTranslation();
  const pathways = useCopyList<PathwayItem>("informedChoices.pathways.items", "public");

  return (
    <section className="flex flex-col gap-8" aria-labelledby="pathways-heading">
      <h2 id="pathways-heading" className="text-2xl font-semibold text-teal-900">
        {t("informedChoices.pathways.heading", { ns: "public" })}
      </h2>
      <div className="flex flex-col gap-12">
        {pathways.map((pathway, index) => {
          const image =
            pathway.image.length > 0 ? pathway.image : PATHWAY_IMAGES[pathway.id] ?? PATHWAY_IMAGES.screening;
          const imageFirst = index % 2 === 0;
          const alt = t(`informedChoices.pathways.alt.${pathway.id}`, { ns: "public" });
          const body = (
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-teal-900">{pathway.title}</h3>
              <p className="text-base leading-relaxed text-ink-600">{pathway.lead}</p>
              <ul className="list-disc space-y-2 ps-5 text-base text-ink-600">
                {pathway.bullets.map((bullet) => (
                  <li key={bullet.slice(0, 24)}>{bullet}</li>
                ))}
              </ul>
            </div>
          );
          return (
            <article key={pathway.id} id={`pathway-${pathway.id}`} className="scroll-mt-28">
              {imageFirst ? (
                <MediaSplit image={image} imageAlt={alt}>
                  {body}
                </MediaSplit>
              ) : (
                <MediaSplit image={image} imageAlt={alt} reverse>
                  {body}
                </MediaSplit>
              )}
            </article>
          );
        })}
      </div>
      <RevealStagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {INFORMED_CHOICE_PATHWAY_IDS.map((id) => (
          <Card key={id} className="h-full border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                <a href={`#pathway-${id}`} className="text-teal-900 underline-offset-4 hover:underline">
                  {t(`informedChoices.pathways.jump.${id}`, { ns: "public" })}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-ink-600">
              {t(`informedChoices.pathways.summary.${id}`, { ns: "public" })}
            </CardContent>
          </Card>
        ))}
      </RevealStagger>
    </section>
  );
}
