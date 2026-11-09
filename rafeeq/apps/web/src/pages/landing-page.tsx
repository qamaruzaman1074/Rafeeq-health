import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { RafeeqLogo } from "@/components/brand/rafeeq-logo";
import { HeroVisual } from "@/components/layout/hero-visual";
import { MarketingHero } from "@/components/layout/marketing-hero";
import { Section } from "@/components/layout/section";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { FaqAccordion, usePublicFaqCategories } from "@/components/public/faq-accordion";
import {
  CheckList,
  MediaSplit,
  NumberedSteps,
  SectionIntro,
} from "@/components/public/marketing-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvaluationGuide } from "@/features/evaluation-guide";
import { useCopyList, type TitleBody } from "@/i18n/copy-list";

const FAQ_PREVIEW_IDS = ["carrier-child", "consanguinity", "partner-see"] as const;

const journeyLinks = [
  "/understanding-genetic-risk",
  "/demo",
  "/inherited-conditions",
  "/trust",
  "/understanding-genetic-risk",
  "/genetic-counselling",
];

export function Component() {
  const { t } = useTranslation();
  const faqPreview = usePublicFaqCategories()
    .flatMap((category) => category.items)
    .filter((item) => (FAQ_PREVIEW_IDS as readonly string[]).includes(item.id));
  const needs = useCopyList<TitleBody>("why.needs", "landing");
  const helps = useCopyList<TitleBody>("helps.cards", "landing");
  const steps = useCopyList<string>("journey.steps", "landing");
  const conditions = useCopyList<{ name: string; pattern: string }>(
    "conditionsPreview.items",
    "landing",
  );
  const privacyPoints = useCopyList<string>("privacyBand.points", "landing");

  return (
    <div className="flex w-full min-w-0 flex-col">
      <MarketingHero
        brand={<RafeeqLogo size="hero" />}
        eyebrow={t("hero.eyebrow", { ns: "landing" })}
        title={t("hero.title", { ns: "landing" })}
        description={
          <>
            <p>{t("hero.body", { ns: "landing" })}</p>
            <p className="mt-3 font-medium text-teal-900">
              {t("hero.subtitle", { ns: "landing" })}
            </p>
          </>
        }
        actions={
          <>
            <Button asChild>
              <Link to="/how-it-works">{t("hero.ctaPrimary", { ns: "landing" })}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/understanding-genetic-risk">
                {t("hero.ctaSecondary", { ns: "landing" })}
              </Link>
            </Button>
          </>
        }
        aside={
          <HeroVisual
            src="/images/hero-cell-dna.webp"
            alt={t("hero.imageAlt", { ns: "landing" })}
            width={736}
            height={705}
          />
        }
      />

      <Section wide className="!py-5 sm:!py-6" reveal={false} aria-labelledby="hero-trust">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p id="hero-trust" className="text-base font-medium text-teal-900">
            {t("hero.trust", { ns: "landing" })}
          </p>
          <p className="max-w-2xl text-sm text-ink-600">
            {t("hero.disclaimer", { ns: "landing" })}
          </p>
        </div>
      </Section>

      <Section wide aria-labelledby="why-heading">
        <SectionIntro
          id="why-heading"
          eyebrow={t("why.eyebrow", { ns: "landing" })}
          heading={t("why.heading", { ns: "landing" })}
          body={<p>{t("why.body", { ns: "landing" })}</p>}
        />
        <RevealStagger className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {needs.map((need, index) => (
            <div
              key={need.title}
              className="flex h-full flex-col gap-2 border-s-2 border-teal-700 ps-5 py-1"
            >
              <p className="text-sm font-semibold text-ink-600">0{index + 1}</p>
              <h3 className="text-lg font-semibold text-teal-900">{need.title}</h3>
              <p className="text-base leading-relaxed text-ink-600">{need.body}</p>
            </div>
          ))}
        </RevealStagger>
      </Section>

      <Section wide className="surface-muted" aria-labelledby="helps-heading">
        <SectionIntro
          id="helps-heading"
          eyebrow={t("helps.eyebrow", { ns: "landing" })}
          heading={t("helps.heading", { ns: "landing" })}
        />
        <RevealStagger className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {helps.map((card) => (
            <Card key={card.title} className="h-full">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </RevealStagger>
      </Section>

      <Section wide id="how-it-works" aria-labelledby="journey-heading">
        <SectionIntro
          id="journey-heading"
          eyebrow={t("journey.eyebrow", { ns: "landing" })}
          heading={t("journey.heading", { ns: "landing" })}
        />
        <NumberedSteps
          steps={steps.map((title, index) => ({
            title,
            href: journeyLinks[index],
            action: t("journey.more", { ns: "landing" }),
          }))}
        />
        <Button asChild variant="secondary" className="w-fit">
          <Link to="/how-it-works">{t("journey.action", { ns: "landing" })}</Link>
        </Button>
      </Section>

      <Section wide className="surface-muted" aria-labelledby="conditions-heading">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-5">
            <SectionIntro
              id="conditions-heading"
              eyebrow={t("conditionsPreview.eyebrow", { ns: "landing" })}
              heading={t("conditionsPreview.heading", { ns: "landing" })}
              body={<p>{t("conditionsPreview.body", { ns: "landing" })}</p>}
            />
            <Button asChild className="w-fit">
              <Link to="/inherited-conditions">
                {t("conditionsPreview.action", { ns: "landing" })}
              </Link>
            </Button>
          </div>
          <RevealStagger className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {conditions.map((item) => (
              <div
                key={item.name}
                className="flex flex-col gap-1 rounded-xl border border-border-subtle bg-card p-5 shadow-xs"
              >
                <p className="text-lg font-semibold text-teal-900">{item.name}</p>
                <p className="text-sm text-ink-600">{item.pattern}</p>
              </div>
            ))}
          </RevealStagger>
        </div>
      </Section>

      <Section wide id="counselling" aria-labelledby="guidance-heading">
        <MediaSplit
          image="/images/counselling-couple-clinic.webp"
          imageAlt={t("guidance.imageAlt", { ns: "landing" })}
        >
          <SectionIntro
            id="guidance-heading"
            eyebrow={t("guidance.eyebrow", { ns: "landing" })}
            heading={t("guidance.heading", { ns: "landing" })}
            body={<p>{t("guidance.body", { ns: "landing" })}</p>}
          />
          <Button asChild className="w-fit">
            <Link to="/genetic-counselling">{t("guidance.action", { ns: "landing" })}</Link>
          </Button>
        </MediaSplit>
      </Section>

      <Section wide className="brand-band" aria-labelledby="privacy-heading">
        <div className="privacy-band grid w-full gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="flex flex-col gap-3">
            <p className="text-eyebrow">{t("privacyBand.eyebrow", { ns: "landing" })}</p>
            <h2 id="privacy-heading" className="text-section sm:text-[1.875rem] sm:leading-tight">
              {t("privacyBand.heading", { ns: "landing" })}
            </h2>
            <p className="text-base leading-relaxed sm:text-lg">
              {t("privacyBand.body", { ns: "landing" })}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="secondary">
                <Link to="/trust">{t("privacyBand.actionTrust", { ns: "landing" })}</Link>
              </Button>
              <Button asChild variant="link" className="privacy-band-link">
                <Link to="/privacy-policy">{t("privacyBand.actionPolicy", { ns: "landing" })}</Link>
              </Button>
            </div>
          </div>
          <CheckList items={privacyPoints} className="privacy-band-list" />
        </div>
      </Section>

      <Section wide aria-labelledby="faq-preview-heading">
        <SectionIntro
          id="faq-preview-heading"
          heading={t("home.faqPreview.heading", { ns: "public" })}
          body={<p>{t("home.faqPreview.body", { ns: "public" })}</p>}
        />
        <FaqAccordion
          categories={[
            {
              id: "preview",
              title: t("home.faqPreview.heading", { ns: "public" }),
              items: faqPreview,
            },
          ]}
        />
        <Button asChild variant="secondary" className="w-fit">
          <Link to="/faq">{t("faq.previewLink", { ns: "public" })}</Link>
        </Button>
      </Section>

      <Section wide className="!pb-16 !pt-4" aria-labelledby="cta-heading">
        <div className="flex w-full flex-col gap-5 rounded-2xl border border-border-subtle bg-secondary p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 id="cta-heading" className="text-section text-teal-900 sm:text-[1.875rem]">
              {t("finalCta.heading", { ns: "landing" })}
            </h2>
            <p className="text-base leading-relaxed text-secondary-foreground sm:text-lg">
              {t("finalCta.body", { ns: "landing" })}
            </p>
            <p className="text-sm text-secondary-foreground">
              {t("finalCta.supporting", { ns: "landing" })}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col xl:flex-row">
            <Button asChild>
              <Link to="/demo">{t("finalCta.action", { ns: "landing" })}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/genetic-counselling">{t("finalCta.secondary", { ns: "landing" })}</Link>
            </Button>
            <EvaluationGuide />
          </div>
        </div>
      </Section>
    </div>
  );
}
