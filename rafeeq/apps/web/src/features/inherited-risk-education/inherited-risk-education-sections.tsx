import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Section } from "@/components/layout/section";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import {
  CheckList,
  MediaSplit,
  NoticePanel,
  SectionIntro,
} from "@/components/public/marketing-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList, type TitleBody } from "@/i18n/copy-list";
import { CouplePunnettDiagram } from "./couple-punnett-diagram";
import { EducationReadMore } from "./education-read-more";
import { PatternDiagram } from "./pattern-diagram";

const PATTERN_DIAGRAMS = ["recessive", "dominant", "xLinked"] as const;

type Pathway = {
  step: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
};

export function InheritedRiskEducationSections() {
  const { t } = useTranslation();
  const patterns = useCopyList<TitleBody>("risk.patterns", "public");
  const carrierCards = useCopyList<TitleBody>("risk.carrier.cards", "public");
  const outcomes = useCopyList<{ value: string; label: string }>("risk.example.outcomes", "public");
  const uncertaintyTopics = useCopyList<TitleBody>("risk.uncertainty.topics", "public");
  const pathways = useCopyList<Pathway>("risk.pathways.items", "public");
  const nextItems = useCopyList<string>("risk.next.items", "public");

  return (
    <>
      <Section wide aria-labelledby="risk-disclaimer-heading">
        <NoticePanel>
          <p id="risk-disclaimer-heading" className="font-medium">
            {t("risk.medicalDisclaimer", { ns: "public" })}
          </p>
        </NoticePanel>
      </Section>

      <Section wide id="carrier-status" className="scroll-mt-28" aria-labelledby="risk-carrier-heading">
        <MediaSplit
          image="/images/outcomes/inherited-risk/carrier-status.svg"
          imageAlt={t("risk.diagrams.carrier.alt", { ns: "public" })}
        >
          <SectionIntro
            id="risk-carrier-heading"
            heading={t("risk.carrier.heading", { ns: "public" })}
            body={<p>{t("risk.carrier.body", { ns: "public" })}</p>}
          />
        </MediaSplit>
        <RevealStagger className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {carrierCards.map((card) => (
            <Card key={card.title} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{card.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </RevealStagger>
      </Section>

      <Section wide id="inheritance" className="scroll-mt-28 surface-muted" aria-labelledby="risk-patterns-heading">
        <SectionIntro
          id="risk-patterns-heading"
          heading={t("risk.inheritance.heading", { ns: "public" })}
          body={<p className="text-secondary-foreground">{t("risk.patternsIntro", { ns: "public" })}</p>}
        />
        <img
          src="/images/outcomes/inherited-risk/inheritance-patterns.svg"
          alt={t("risk.diagrams.patterns.alt", { ns: "public" })}
          className="mx-auto mb-6 max-h-48 w-full max-w-2xl object-contain"
          loading="lazy"
          decoding="async"
        />
        <RevealStagger className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {patterns.map((pattern, index) => (
            <Card key={pattern.title} className="h-full">
              <CardHeader>
                <CardTitle>{pattern.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{pattern.body}</CardDescription>
                <PatternDiagram pattern={PATTERN_DIAGRAMS[index] ?? "recessive"} />
              </CardHeader>
            </Card>
          ))}
        </RevealStagger>
        <p className="mt-4 max-w-3xl text-sm text-ink-600">{t("risk.inheritance.note", { ns: "public" })}</p>
      </Section>

      <Section wide id="couple-risk" className="scroll-mt-28" aria-labelledby="risk-couple-heading">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <SectionIntro
            id="risk-couple-heading"
            heading={t("risk.couple.heading", { ns: "public" })}
            body={
              <>
                <p className="mb-4">{t("risk.couple.body", { ns: "public" })}</p>
                <p>{t("risk.example.intro", { ns: "public" })}</p>
              </>
            }
          />
          <CouplePunnettDiagram />
        </div>
        <RevealStagger className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {outcomes.map((outcome) => (
            <div
              key={outcome.label}
              className="flex flex-col gap-1 rounded-xl border border-border-subtle bg-card p-6 shadow-xs"
            >
              <p className="text-4xl font-semibold tracking-tight text-teal-900">{outcome.value}</p>
              <p className="text-base text-ink-600">{outcome.label}</p>
            </div>
          ))}
        </RevealStagger>
        <div className="mt-6">
        <NoticePanel>
          <p>{t("risk.example.caveat", { ns: "public" })}</p>
        </NoticePanel>
        </div>
      </Section>

      <Section wide id="risk-vs-diagnosis" className="scroll-mt-28 brand-band" aria-labelledby="risk-diagnosis-heading">
        <SectionIntro
          id="risk-diagnosis-heading"
          heading={t("risk.diagnosis.heading", { ns: "public" })}
        />
        <img
          src="/images/outcomes/inherited-risk/risk-vs-diagnosis.svg"
          alt={t("risk.diagrams.compare.alt", { ns: "public" })}
          className="mb-6 max-h-40 w-full max-w-lg object-contain"
          loading="lazy"
          decoding="async"
        />
        <RevealStagger className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("risk.diagnosis.geneticRisk.title", { ns: "public" })}</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {t("risk.diagnosis.geneticRisk.body", { ns: "public" })}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-amber-200 bg-amber-50/40">
            <CardHeader>
              <CardTitle>{t("risk.diagnosis.clinical.title", { ns: "public" })}</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {t("risk.diagnosis.clinical.body", { ns: "public" })}
              </CardDescription>
            </CardHeader>
          </Card>
        </RevealStagger>
      </Section>

      <Section wide id="uncertainty" className="scroll-mt-28" aria-labelledby="risk-uncertainty-heading">
        <SectionIntro
          id="risk-uncertainty-heading"
          heading={t("risk.uncertainty.heading", { ns: "public" })}
          body={<p>{t("risk.uncertainty.lead", { ns: "public" })}</p>}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {uncertaintyTopics.map((topic) => (
            <EducationReadMore key={topic.title} title={topic.title}>
              <p>{topic.body}</p>
            </EducationReadMore>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm text-ink-600">{t("risk.uncertainty.note", { ns: "public" })}</p>
      </Section>

      <Section wide id="next-steps" className="scroll-mt-28 surface-muted !pb-16" aria-labelledby="risk-next-heading">
        <SectionIntro
          id="risk-next-heading"
          heading={t("risk.pathways.heading", { ns: "public" })}
        />
        <ol className="flex max-w-3xl flex-col gap-4">
          {pathways.map((path) => (
            <li
              key={path.step}
              className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-card p-6 shadow-xs"
            >
              <span className="text-sm font-semibold text-teal-800">{path.step}</span>
              <h3 className="text-lg font-semibold text-teal-900">{path.title}</h3>
              <p className="text-base leading-relaxed text-ink-600">{path.body}</p>
              <Button asChild variant="secondary" className="w-fit">
                <Link to={path.href}>{path.linkLabel}</Link>
              </Button>
            </li>
          ))}
        </ol>
        <CheckList items={nextItems} className="mt-8 max-w-3xl" />
        <p className="max-w-3xl text-sm text-ink-600">{t("risk.next.note", { ns: "public" })}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/genetic-counselling">{t("nav.counselling", { ns: "public" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/inherited-conditions">{t("nav.conditions", { ns: "public" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/learn">{t("risk.pathways.learnApp", { ns: "public" })}</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
