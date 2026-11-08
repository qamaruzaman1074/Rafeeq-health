import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { MarketingHero } from "@/components/layout/marketing-hero";
import { Section } from "@/components/layout/section";
import { TrustStrip } from "@/components/layout/trust-strip";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvaluationGuide } from "@/features/evaluation-guide";

export function Component() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className="ms-auto me-auto w-full max-w-6xl ps-4 pe-4 pt-6 sm:ps-6 sm:pe-6 sm:pt-10">
        <MarketingHero
          title={t("hero.title", { ns: "landing" })}
          description={t("hero.body", { ns: "landing" })}
          actions={
            <>
              <Button asChild>
                <Link to="/demo">{t("page.continueGuest", { ns: "landing" })}</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/#how-it-works">{t("hero.howItWorks", { ns: "landing" })}</Link>
              </Button>
              {/* OPEN_QUESTION: planning Section 7 names Sign in, and MASTER Section 6 names POST /auth/login. Neither names a route or form. Until a login form exists, Sign in opens the public demo entry. */}
              <Button asChild variant="ghost">
                <Link to="/demo">{t("page.signIn", { ns: "landing" })}</Link>
              </Button>
            </>
          }
          aside={
            <img
              src="/images/genetic-research.webp"
              alt={t("hero.imageAlt", { ns: "landing" })}
              width={1400}
              height={1400}
              decoding="async"
              className="h-full max-h-[28rem] w-full rounded-lg object-cover shadow-surface-md"
            />
          }
        />
        <p className="mt-6 max-w-2xl text-base text-ink-600">
          {t("hero.trust", { ns: "landing" })}
        </p>
      </div>

      <Section wide className="ps-4 pe-4 sm:ps-6 sm:pe-6" aria-labelledby="problem-heading">
        <h2 id="problem-heading" className="text-section text-teal-900">
          {t("problem.heading", { ns: "landing" })}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-ink-600">
          {t("problem.intro", { ns: "landing" })}
        </p>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <li>
            <Card>
              <CardHeader>
                <CardTitle>{t("problem.one.title", { ns: "landing" })}</CardTitle>
                <CardDescription>{t("problem.one.body", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardTitle>{t("problem.two.title", { ns: "landing" })}</CardTitle>
                <CardDescription>{t("problem.two.body", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardTitle>{t("problem.three.title", { ns: "landing" })}</CardTitle>
                <CardDescription>{t("problem.three.body", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        </ul>
      </Section>

      <Section
        wide
        id="how-it-works"
        className="ps-4 pe-4 sm:ps-6 sm:pe-6"
        aria-labelledby="steps-heading"
      >
        <h2 id="steps-heading" className="text-section text-teal-900">
          {t("steps.heading", { ns: "landing" })}
        </h2>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <li>
            <Card>
              <CardHeader>
                <p className="text-eyebrow">1</p>
                <CardTitle>{t("steps.one.title", { ns: "landing" })}</CardTitle>
                <CardDescription>{t("steps.one.body", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <p className="text-eyebrow">2</p>
                <CardTitle>{t("steps.two.title", { ns: "landing" })}</CardTitle>
                <CardDescription>{t("steps.two.body", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <p className="text-eyebrow">3</p>
                <CardTitle>{t("steps.three.title", { ns: "landing" })}</CardTitle>
                <CardDescription>{t("steps.three.body", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <p className="text-eyebrow">4</p>
                <CardTitle>{t("steps.four.title", { ns: "landing" })}</CardTitle>
                <CardDescription>{t("steps.four.body", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        </ol>
      </Section>

      <Section
        wide
        id="approach"
        className="ps-4 pe-4 sm:ps-6 sm:pe-6"
        aria-labelledby="approach-heading"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-4">
            <h2 id="approach-heading" className="text-section text-teal-900">
              {t("approach.heading", { ns: "landing" })}
            </h2>
            <p className="text-base leading-relaxed text-ink-600">
              {t("approach.body", { ns: "landing" })}
            </p>
          </div>
          <img
            src="/images/counselling.webp"
            alt={t("approach.imageAlt", { ns: "landing" })}
            width={1200}
            height={1800}
            loading="lazy"
            decoding="async"
            className="max-h-[22rem] w-full rounded-lg object-cover shadow-surface"
          />
        </div>
      </Section>

      <Section wide className="ps-4 pe-4 sm:ps-6 sm:pe-6" aria-labelledby="science-heading">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <img
            src="/images/genetics-lab.webp"
            alt={t("science.imageAlt", { ns: "landing" })}
            width={1400}
            height={933}
            loading="lazy"
            decoding="async"
            className="max-h-[22rem] w-full rounded-lg object-cover shadow-surface"
          />
          <div className="flex flex-col gap-4">
            <h2 id="science-heading" className="text-section text-teal-900">
              {t("science.heading", { ns: "landing" })}
            </h2>
            <p className="text-base leading-relaxed text-ink-600">
              {t("science.body", { ns: "landing" })}
            </p>
          </div>
        </div>
      </Section>

      <Section wide className="ps-4 pe-4 sm:ps-6 sm:pe-6" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading" className="text-section text-teal-900">
          {t("privacySection.heading", { ns: "landing" })}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-ink-600">
          {t("privacySection.intro", { ns: "landing" })}
        </p>
        <TrustStrip
          columns={4}
          items={[
            {
              id: "consent",
              label: t("privacySection.consent", { ns: "landing" }),
            },
            {
              id: "respect",
              label: t("privacySection.respect", { ns: "landing" }),
            },
            {
              id: "uncertainty",
              label: t("privacySection.uncertainty", { ns: "landing" }),
            },
            {
              id: "human",
              label: t("privacySection.human", { ns: "landing" }),
            },
          ]}
        />
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <li>
            <Card>
              <CardHeader>
                <CardTitle>{t("pillars.plain.title", { ns: "landing" })}</CardTitle>
                <CardDescription>{t("pillars.plain.body", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardTitle>{t("pillars.sharing.title", { ns: "landing" })}</CardTitle>
                <CardDescription>{t("pillars.sharing.body", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardTitle>{t("pillars.humans.title", { ns: "landing" })}</CardTitle>
                <CardDescription>{t("pillars.humans.body", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        </ul>
      </Section>

      <Section wide className="ps-4 pe-4 pb-16 sm:ps-6 sm:pe-6" aria-labelledby="cta-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("cta.heading", { ns: "landing" })}</CardTitle>
            <CardDescription>{t("cta.body", { ns: "landing" })}</CardDescription>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild>
                <Link to="/demo">{t("cta.action", { ns: "landing" })}</Link>
              </Button>
              <EvaluationGuide />
            </div>
          </CardHeader>
        </Card>
      </Section>
    </div>
  );
}
