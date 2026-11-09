import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { MediaSplit, SectionIntro } from "@/components/public/marketing-blocks";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList, type TitleBody } from "@/i18n/copy-list";

export function Component() {
  const { t } = useTranslation();
  const story = useCopyList<string>("about.story", "public");
  const principles = useCopyList<TitleBody>("about.principlesList", "public");

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-8 !pt-10 sm:!pt-14">
        <PageHeader
          eyebrow={t("about.tagline", { ns: "public" })}
          title={t("about.heroTitle", { ns: "public" })}
          description={t("about.heroIntro", { ns: "public" })}
        />
      </Section>

      <Section wide aria-labelledby="about-story-heading">
        <MediaSplit
          image="/images/family-parents-baby.webp"
          imageAlt={t("about.imageAlt", { ns: "public" })}
        >
          <SectionIntro
            id="about-story-heading"
            heading={t("about.storyHeading", { ns: "public" })}
            body={
              <div className="flex flex-col gap-4">
                {story.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            }
          />
        </MediaSplit>
      </Section>

      <Section wide className="surface-muted" aria-labelledby="about-principles-heading">
        <SectionIntro
          id="about-principles-heading"
          heading={t("about.principlesHeading", { ns: "public" })}
        />
        <RevealStagger className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((item, index) => (
            <Card key={item.title} className="h-full">
              <CardHeader>
                <p className="text-sm font-semibold text-ink-600">0{index + 1}</p>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </RevealStagger>
      </Section>

      <Section wide className="!pb-16" aria-labelledby="about-vision-heading">
        <div className="flex w-full flex-col gap-4 rounded-2xl border border-border-subtle bg-card p-8 shadow-xs sm:p-12">
          <p className="text-eyebrow">{t("about.visionHeading", { ns: "public" })}</p>
          <h2
            id="about-vision-heading"
            className="max-w-4xl text-2xl font-semibold leading-snug text-teal-900 sm:text-3xl"
          >
            {t("about.visionBody", { ns: "public" })}
          </h2>
          <p className="max-w-3xl text-sm text-ink-600">
            {t("footer.statement", { ns: "public" })}
          </p>
        </div>
      </Section>
    </div>
  );
}
