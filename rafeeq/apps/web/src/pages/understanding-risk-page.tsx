import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PageHeader } from "@/components/layout/page-header";
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

export function Component() {
  const { t } = useTranslation();
  const patterns = useCopyList<TitleBody>("risk.patterns", "public");
  const outcomes = useCopyList<{ value: string; label: string }>("risk.example.outcomes", "public");
  const family = useCopyList<string>("risk.family.body", "public");
  const nextItems = useCopyList<string>("risk.next.items", "public");

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14">
        <PageHeader
          eyebrow={t("risk.eyebrow", { ns: "public" })}
          title={t("risk.heroTitle", { ns: "public" })}
          description={t("risk.heroIntro", { ns: "public" })}
        />
      </Section>

      <Section wide aria-labelledby="risk-carrier-heading">
        <MediaSplit
          image="/images/genetics-lab.webp"
          imageAlt={t("risk.imageAlt", { ns: "public" })}
        >
          <SectionIntro
            id="risk-carrier-heading"
            heading={t("risk.carrier.heading", { ns: "public" })}
            body={<p>{t("risk.carrier.body", { ns: "public" })}</p>}
          />
          <NoticePanel>
            <p>{t("risk.carrier.note", { ns: "public" })}</p>
          </NoticePanel>
        </MediaSplit>
      </Section>

      <Section wide className="surface-muted" aria-labelledby="risk-couple-heading">
        <SectionIntro
          id="risk-couple-heading"
          heading={t("risk.couple.heading", { ns: "public" })}
          body={
            <p className="text-secondary-foreground">{t("risk.couple.body", { ns: "public" })}</p>
          }
        />
      </Section>

      <Section wide aria-labelledby="risk-patterns-heading">
        <SectionIntro
          id="risk-patterns-heading"
          heading={t("risk.patternsHeading", { ns: "public" })}
          body={<p>{t("risk.patternsIntro", { ns: "public" })}</p>}
        />
        <RevealStagger className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {patterns.map((pattern) => (
            <Card key={pattern.title} className="h-full">
              <CardHeader>
                <CardTitle>{pattern.title}</CardTitle>
                <CardDescription>{pattern.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </RevealStagger>
      </Section>

      <Section wide className="surface-muted" aria-labelledby="risk-example-heading">
        <SectionIntro
          id="risk-example-heading"
          heading={t("risk.example.heading", { ns: "public" })}
          body={
            <p className="text-secondary-foreground">{t("risk.example.intro", { ns: "public" })}</p>
          }
        />
        <RevealStagger className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
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
        <NoticePanel>
          <p>{t("risk.example.caveat", { ns: "public" })}</p>
        </NoticePanel>
      </Section>

      <Section wide aria-labelledby="risk-family-heading">
        <SectionIntro
          id="risk-family-heading"
          heading={t("risk.family.heading", { ns: "public" })}
          body={
            <div className="flex flex-col gap-4">
              {family.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          }
        />
      </Section>

      <Section wide className="brand-band" aria-labelledby="risk-diagnosis-heading">
        <div className="flex max-w-3xl flex-col gap-3">
          <h2 id="risk-diagnosis-heading" className="text-section sm:text-[1.875rem]">
            {t("risk.diagnosis.heading", { ns: "public" })}
          </h2>
          <p className="text-base leading-relaxed sm:text-lg">
            {t("risk.diagnosis.body", { ns: "public" })}
          </p>
        </div>
      </Section>

      <Section wide className="!pb-16" aria-labelledby="risk-next-heading">
        <SectionIntro id="risk-next-heading" heading={t("risk.next.heading", { ns: "public" })} />
        <CheckList items={nextItems} className="max-w-3xl" />
        <p className="max-w-3xl text-sm text-ink-600">{t("risk.next.note", { ns: "public" })}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/genetic-counselling">{t("nav.counselling", { ns: "public" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/inherited-conditions">{t("nav.conditions", { ns: "public" })}</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
}
