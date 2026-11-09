import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Section } from "@/components/layout/section";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import {
  IconAssistant,
  IconAwareness,
  IconClarity,
  IconComplexResults,
  IconCounsellingAccess,
  IconDna,
  IconFamily,
  IconGuidance,
  IconMessages,
  IconPrivacyTrust,
  IconRespect,
  IconScreening,
  IconShield,
} from "@/components/public/problem-solution-icons";
import { MediaSplit, NoticePanel, SectionIntro } from "@/components/public/marketing-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList, type TitleBody } from "@/i18n/copy-list";
import { useDocumentMeta } from "@/lib/use-document-meta";
import { cn } from "@/lib/utils";

const PROBLEM_ICONS = [
  IconAwareness,
  IconComplexResults,
  IconCounsellingAccess,
  IconPrivacyTrust,
] as const;

const PILLAR_ICONS = [
  IconFamily,
  IconScreening,
  IconDna,
  IconAssistant,
  IconShield,
  IconMessages,
] as const;

const PILLAR_IMAGES = [
  "/images/problem-solution/family-health-history.webp",
  "/images/problem-solution/genetic-screening.jpg",
  "/images/problem-solution/inherited-risk-education.webp",
  "/images/problem-solution/ai-healthcare-assistant.jpg",
  "/images/problem-solution/health-data-privacy.jpg",
  "/images/problem-solution/genetic-counselling.jpg",
] as const;

const PRINCIPLE_ICONS = [IconRespect, IconClarity, IconShield, IconGuidance] as const;

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-4">
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
    </div>
  );
}

export function Component() {
  const { t } = useTranslation();
  const ns = "public";

  useDocumentMeta(
    t("problemSolution.documentTitle", { ns }),
    t("problemSolution.metaDescription", { ns }),
  );

  const problemCards = useCopyList<TitleBody>("problemSolution.problems.cards", ns);
  const pillars = useCopyList<TitleBody>("problemSolution.pillars.items", ns);
  const journeySteps = useCopyList<TitleBody>("problemSolution.journey.steps", ns);
  const principles = useCopyList<TitleBody>("problemSolution.principles.items", ns);

  return (
    <div className="flex w-full min-w-0 flex-col">
      <section
        aria-labelledby="ps-hero-heading"
        className="relative flex w-full min-h-[min(88vh,52rem)] items-center overflow-hidden border-b border-border-subtle bg-gradient-to-b from-secondary/50 via-background to-background py-12 sm:py-16 lg:py-20"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <span className="absolute -top-12 end-[-8%] h-72 w-72 rounded-full bg-teal-100/80 blur-3xl" />
          <span className="absolute bottom-0 start-[-6%] h-64 w-64 rounded-full bg-gold-500/20 blur-3xl" />
          <svg
            className="absolute end-8 top-1/4 hidden h-28 w-28 text-teal-700/10 lg:block"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M50 8c-8 12-14 28-14 42 0 8 3 14 14 20 11-6 14-12 14-20 0-14-6-30-14-42z"
            />
          </svg>
        </div>
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 lg:grid-cols-2 lg:gap-14">
          <div className="relative z-10 flex flex-col gap-5">
            <p className="text-eyebrow motion-text-reveal motion-delay-1">
              {t("problemSolution.hero.eyebrow", { ns })}
            </p>
            <h1
              id="ps-hero-heading"
              className="motion-display-settle motion-delay-2 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-teal-900 sm:text-4xl lg:text-[2.75rem]"
            >
              {t("problemSolution.hero.title", { ns })}
            </h1>
            <MotionWrap className="max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
              <Paragraphs text={t("problemSolution.hero.intro", { ns })} />
            </MotionWrap>
            <blockquote className="motion-text-reveal motion-delay-3 border-s-4 border-gold-500 bg-card/80 py-3 ps-4 pe-3 text-base font-medium leading-relaxed text-teal-900 sm:text-lg">
              &ldquo;{t("problemSolution.hero.highlight", { ns })}&rdquo;
            </blockquote>
          </div>
          <MotionWrap className="relative z-10 min-w-0">
            <img
              src="/images/problem-solution/genetic-health-hero.webp"
              alt={t("problemSolution.hero.imageAlt", { ns })}
              width={1600}
              height={1066}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="media-reveal aspect-[4/3] h-auto w-full rounded-xl object-cover shadow-surface-md lg:aspect-[3/2]"
            />
          </MotionWrap>
        </div>
      </section>

      <Section wide className="surface-muted" aria-labelledby="ps-problems-heading">
        <SectionIntro
          id="ps-problems-heading"
          eyebrow={t("problemSolution.problems.eyebrow", { ns })}
          heading={t("problemSolution.problems.title", { ns })}
          body={
            <p className="max-w-3xl text-base leading-relaxed text-ink-600 sm:text-lg">
              {t("problemSolution.problems.description", { ns })}
            </p>
          }
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
          <RevealStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {problemCards.map((card, index) => {
              const Icon = PROBLEM_ICONS[index] ?? IconAwareness;
              return (
                <Card
                  key={card.title}
                  className="motion-card-lift h-full border-border-subtle transition-shadow hover:shadow-surface-md"
                >
                  <CardHeader className="gap-3">
                    <Icon />
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription>{card.body}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </RevealStagger>
          <img
            src="/images/problem-solution/healthcare-consultation.jpg"
            alt={t("problemSolution.problems.imageAlt", { ns })}
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            className="media-reveal aspect-[3/2] w-full rounded-xl object-cover shadow-surface-md"
          />
        </div>
      </Section>

      <Section wide aria-labelledby="ps-solution-heading">
        <MediaSplit
          image="/images/problem-solution/rafeeq-solution.webp"
          imageAlt={t("problemSolution.solution.imageAlt", { ns })}
          reverse
        >
          <SectionIntro
            id="ps-solution-heading"
            eyebrow={t("problemSolution.solution.eyebrow", { ns })}
            heading={t("problemSolution.solution.title", { ns })}
            body={<Paragraphs text={t("problemSolution.solution.description", { ns })} />}
          />
          <SolutionFlow />
        </MediaSplit>
      </Section>

      <Section wide className="surface-muted" aria-labelledby="ps-pillars-heading">
        <SectionIntro
          id="ps-pillars-heading"
          eyebrow={t("problemSolution.pillars.eyebrow", { ns })}
          heading={t("problemSolution.pillars.title", { ns })}
          body={
            <p className="max-w-3xl text-base leading-relaxed text-ink-600">
              {t("problemSolution.pillars.description", { ns })}
            </p>
          }
        />
        <RevealStagger className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = PILLAR_ICONS[index] ?? IconFamily;
            const image = PILLAR_IMAGES[index];
            return (
              <Card
                key={pillar.title}
                className="motion-card-lift flex h-full flex-col overflow-hidden border-border-subtle"
              >
                {image !== undefined ? (
                  <img
                    src={image}
                    alt=""
                    role="presentation"
                    width={640}
                    height={360}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/9] h-40 w-full object-cover"
                  />
                ) : null}
                <CardHeader className="gap-2">
                  <p className="text-sm font-semibold text-teal-700">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="flex items-center gap-3">
                    <Icon />
                    <CardTitle className="text-lg">{pillar.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-base leading-relaxed text-ink-600">{pillar.body}</p>
                </CardContent>
              </Card>
            );
          })}
        </RevealStagger>
      </Section>

      <Section wide aria-labelledby="ps-journey-heading">
        <SectionIntro
          id="ps-journey-heading"
          eyebrow={t("problemSolution.journey.eyebrow", { ns })}
          heading={t("problemSolution.journey.title", { ns })}
          body={
            <p className="max-w-3xl text-base leading-relaxed text-ink-600">
              {t("problemSolution.journey.description", { ns })}
            </p>
          }
        />
        <RevealStagger className="journey-timeline mt-10 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
          {journeySteps.map((step, index) => (
            <div
              key={step.title}
              className={cn(
                "step-card relative flex flex-col gap-3 rounded-xl p-6",
                "lg:before:absolute lg:before:top-9 lg:before:h-0.5 lg:before:bg-border-subtle",
                index < journeySteps.length - 1
                  ? "lg:before:start-[calc(50%+1.5rem)] lg:before:w-[calc(100%-3rem)]"
                  : null,
              )}
            >
              <span
                aria-hidden="true"
                className="step-marker inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal-700 text-base font-semibold text-primary-foreground"
              >
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-teal-900">{step.title}</h3>
              <p className="text-base leading-relaxed text-ink-600">{step.body}</p>
            </div>
          ))}
        </RevealStagger>
      </Section>

      <Section wide className="surface-muted" aria-labelledby="ps-principles-heading">
        <SectionIntro
          id="ps-principles-heading"
          eyebrow={t("problemSolution.principles.eyebrow", { ns })}
          heading={t("problemSolution.principles.title", { ns })}
          body={
            <p className="max-w-3xl text-base leading-relaxed text-ink-600">
              {t("problemSolution.principles.description", { ns })}
            </p>
          }
        />
        <RevealStagger className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {principles.map((item, index) => {
            const Icon = PRINCIPLE_ICONS[index] ?? IconRespect;
            return (
              <Card key={item.title} className="border-border-subtle bg-card/90">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Icon />
                    <div className="flex flex-col gap-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="text-ink-700">{item.body}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </RevealStagger>
      </Section>

      <Section wide reveal={false} className="brand-band !py-14 sm:!py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 text-center">
          <h2 className="text-balance text-2xl font-semibold sm:text-3xl">
            {t("problemSolution.cta.title", { ns })}
          </h2>
          <p className="text-base leading-relaxed sm:text-lg">
            {t("problemSolution.cta.description", { ns })}
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <Button asChild>
              <Link to="/demo">{t("problemSolution.cta.primary", { ns })}</Link>
            </Button>
            <Button asChild variant="secondary" className="border-gold-500/40 bg-transparent text-inherit">
              <Link to="/how-it-works">{t("problemSolution.cta.secondary", { ns })}</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section wide className="!pt-8 !pb-16" reveal={false}>
        <NoticePanel>
          <p className="text-sm leading-relaxed sm:text-base">{t("problemSolution.disclaimer", { ns })}</p>
        </NoticePanel>
      </Section>
    </div>
  );
}

function MotionWrap({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("motion-text-reveal motion-delay-2", className)}>{children}</div>;
}

function SolutionFlow() {
  const { t } = useTranslation();
  const ns = "public";
  const items = [
    t("problemSolution.solution.flowEducation", { ns }),
    t("problemSolution.solution.flowTechnology", { ns }),
    t("problemSolution.solution.flowPrivacy", { ns }),
    t("problemSolution.solution.flowGuidance", { ns }),
  ];
  return (
    <ol className="mt-2 flex flex-wrap items-center gap-2" aria-label="Rafeeq solution pillars">
      {items.map((label, index) => (
        <li key={label} className="flex items-center gap-2">
          <span className="rounded-full border border-teal-700/30 bg-secondary px-3 py-1.5 text-sm font-medium text-teal-900">
            {label}
          </span>
          {index < items.length - 1 ? (
            <span aria-hidden="true" className="text-teal-700">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
