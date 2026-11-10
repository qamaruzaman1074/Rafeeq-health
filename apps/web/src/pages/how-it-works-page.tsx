import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { MediaSplit, NoticePanel, StepArrow } from "@/components/public/marketing-blocks";
import { Button } from "@/components/ui/button";
import { useCopyList, type TitleBody } from "@/i18n/copy-list";

const stageLinks = [
  "/understanding-genetic-risk",
  "/demo",
  "/inherited-conditions",
  "/trust",
  "/understanding-genetic-risk",
  "/genetic-counselling",
] as const;

export function Component() {
  const { t } = useTranslation();
  const stages = useCopyList<TitleBody & { action: string }>("howItWorks.stages", "public");

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14">
        <MediaSplit
          image="/images/couple-professional-conversation.webp"
          imageAlt={t("howItWorks.imageAlt", { ns: "public" })}
        >
          <PageHeader
            title={t("howItWorks.heroTitle", { ns: "public" })}
            description={t("howItWorks.heroIntro", { ns: "public" })}
          />
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/demo">{t("cta.explore", { ns: "public" })}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/understanding-genetic-risk">{t("nav.risk", { ns: "public" })}</Link>
            </Button>
          </div>
        </MediaSplit>
      </Section>

      <Section wide className="surface-muted" aria-labelledby="stages-heading">
        <h2 id="stages-heading" className="sr-only">
          {t("howItWorks.title", { ns: "public" })}
        </h2>
        <RevealStagger className="journey-timeline relative flex w-full flex-col gap-4">
          {stages.map((stage, index) => (
            <Link
              key={stage.title}
              to={stageLinks[index] ?? "/how-it-works"}
              className="step-card relative grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-xl p-5 sm:gap-6 sm:p-6"
            >
              <span
                aria-hidden="true"
                className="step-marker relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal-700 text-base font-semibold text-primary-foreground"
              >
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-ink-600">
                  {t("howItWorks.stageLabel", { ns: "public", n: index + 1 })}
                </p>
                <h3 className="text-lg font-semibold text-teal-900 sm:text-xl">{stage.title}</h3>
                <p className="max-w-3xl text-base leading-relaxed text-ink-600">{stage.body}</p>
                <span className="mt-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
                  {stage.action}
                  <StepArrow />
                </span>
              </div>
            </Link>
          ))}
        </RevealStagger>
      </Section>

      <Section wide className="!pb-16">
        <NoticePanel heading={t("howItWorks.noteHeading", { ns: "public" })}>
          <p>{t("howItWorks.note", { ns: "public" })}</p>
        </NoticePanel>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/genetic-counselling">{t("nav.counselling", { ns: "public" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/trust">{t("nav.trustPrivacy", { ns: "public" })}</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
}
