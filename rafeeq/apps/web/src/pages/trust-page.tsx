import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { NoticePanel, SectionIntro } from "@/components/public/marketing-blocks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { useCopyList } from "@/i18n/copy-list";

const prototypePrivacyKeys = [
  "own",
  "overlap",
  "clinic",
  "counsellor",
  "analyst",
  "audit",
  "revoke",
  "guest",
  "minimise",
] as const;

export function Component() {
  const { t } = useTranslation();
  const principles = useCopyList<string>("trustPublic.principles", "public");
  const explain = useCopyList<{ q: string; a: string }>("trustPublic.explain", "public");

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14">
        <PageHeader
          title={t("trustPublic.heroTitle", { ns: "public" })}
          description={t("trustPublic.heroIntro", { ns: "public" })}
        />
      </Section>

      <Section wide className="brand-band" aria-labelledby="trust-principles-heading">
        <h2 id="trust-principles-heading" className="text-section sm:text-[1.875rem]">
          {t("trustPublic.principlesHeading", { ns: "public" })}
        </h2>
        <RevealStagger className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((item, index) => (
            <div
              key={item}
              className="flex h-full flex-col gap-2 rounded-xl border border-[#f8f6f0]/20 p-5"
            >
              <p className="text-sm font-semibold">0{index + 1}</p>
              <p className="text-lg font-semibold">{item}</p>
            </div>
          ))}
        </RevealStagger>
      </Section>

      <Section wide aria-labelledby="trust-explain-heading">
        <SectionIntro
          id="trust-explain-heading"
          heading={t("trustPublic.faqHeading", { ns: "public" })}
        />
        <RevealStagger className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          {explain.map((item) => (
            <div
              key={item.q}
              className="flex h-full flex-col gap-2 rounded-xl border border-border-subtle bg-card p-6 shadow-xs"
            >
              <h3 className="text-lg font-semibold text-teal-900">{item.q}</h3>
              <p className="text-base leading-relaxed text-ink-600">{item.a}</p>
            </div>
          ))}
        </RevealStagger>
        <NoticePanel heading={t("trustPublic.productionHeading", { ns: "public" })}>
          <p>{t("trustPublic.production", { ns: "public" })}</p>
        </NoticePanel>
      </Section>

      <Section wide className="surface-muted" aria-labelledby="trust-prototype-heading">
        <SectionIntro
          id="trust-prototype-heading"
          heading={t("trust.prototypeHeading", { ns: "landing" })}
          body={
            <div className="flex flex-col gap-3 text-secondary-foreground">
              <p>{t("trust.synthetic", { ns: "landing" })}</p>
              <p>{t("trust.frequencies", { ns: "landing" })}</p>
            </div>
          }
        />
        <h3 className="text-lg font-semibold text-teal-900">
          {t("trust.privacy.heading", { ns: "landing" })}
        </h3>
        <ul className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {prototypePrivacyKeys.map((key) => (
            <li key={key}>
              <Card className="h-full">
                <CardHeader className="p-5 sm:p-6">
                  <CardDescription>{t(`trust.privacy.${key}`, { ns: "landing" })}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section wide aria-labelledby="trust-ai-heading">
        <SectionIntro id="trust-ai-heading" heading={t("trust.ai.heading", { ns: "landing" })} />
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
          {(["role", "inputs", "limits", "human", "routes"] as const).map((key) => (
            <p
              key={key}
              className="rounded-xl border border-border-subtle bg-card p-5 text-base leading-relaxed text-ink-600"
            >
              {t(`trust.ai.${key}`, { ns: "landing" })}
            </p>
          ))}
        </div>
      </Section>

      <Section wide className="!pb-16" aria-labelledby="trust-review-heading">
        <SectionIntro
          id="trust-review-heading"
          heading={t("trust.review.heading", { ns: "landing" })}
        />
        <div className="flex max-w-3xl flex-col gap-3 text-base leading-relaxed text-ink-600">
          <p>{t("trust.review.status", { ns: "landing" })}</p>
          <p>{t("trust.review.draft", { ns: "landing" })}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/privacy-policy">{t("footer.privacyPolicy", { ns: "public" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/faq">{t("nav.faq", { ns: "public" })}</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
}
