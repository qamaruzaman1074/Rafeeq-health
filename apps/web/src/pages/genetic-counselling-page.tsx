import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { MediaSplit, NoticePanel } from "@/components/public/marketing-blocks";
import { Button } from "@/components/ui/button";
import { ClinicalDraftBadge } from "@/features/inherited-risk-education/clinical-draft-badge";
import { CounsellingBoundaries } from "@/features/genetic-counselling/counselling-boundaries";
import { CounsellingJourneyTimeline } from "@/features/genetic-counselling/counselling-journey-timeline";
import { ProviderPlaceholderCards } from "@/features/genetic-counselling/provider-placeholder-cards";
import { WhenGuidanceCards } from "@/features/genetic-counselling/when-guidance-cards";
import { ScreeningPathwayBreadcrumbs } from "@/features/screening-pathways/pathway-breadcrumbs";
import { useDocumentMeta } from "@/lib/use-document-meta";

export function Component() {
  const { t } = useTranslation();
  const ns = "public";

  useDocumentMeta(
    t("counsellingPage.documentTitle", { ns }),
    t("counsellingPage.metaDescription", { ns }),
  );

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14" reveal={false}>
        <ScreeningPathwayBreadcrumbs current="counselling" />
        <MediaSplit
          image="/images/outcomes/genetic-counselling/counselling-conversation.webp"
          imageAlt={t("counsellingPage.imageAlt", { ns })}
        >
          <PageHeader
            eyebrow={
              <span className="flex flex-wrap items-center gap-2">
                {t("counsellingPage.eyebrow", { ns })}
                <ClinicalDraftBadge messageKey="counsellingPage.reviewBadge" />
              </span>
            }
            title={t("counsellingPage.heroTitle", { ns })}
            description={t("counsellingPage.heroIntro", { ns })}
          />
          <NoticePanel>
            <p className="font-medium">{t("counsellingPage.assistantLimit", { ns })}</p>
          </NoticePanel>
        </MediaSplit>
      </Section>

      <Section wide className="surface-muted">
        <WhenGuidanceCards />
      </Section>

      <Section wide aria-labelledby="counselling-journey-heading">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)] lg:items-start lg:gap-10">
          <div className="flex min-w-0 flex-col gap-6">
            <JourneyIntro />
            <JourneyWithNote />
          </div>
          <div className="group relative overflow-hidden rounded-3xl border border-teal-100 bg-teal-50 p-2 shadow-[0_24px_60px_rgba(15,118,110,0.12)] lg:sticky lg:top-28">
            <img
              src="/images/couple-professional-conversation.webp"
              alt={t("counsellingPage.imageAlt", { ns: "public" })}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-[1.25rem] object-cover object-center transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 rounded-[1.25rem] bg-gradient-to-t from-slate-950/20 via-transparent to-white/10"
            />
          </div>
        </div>
      </Section>

      <Section wide className="surface-muted">
        <ProviderPlaceholderCards />
      </Section>

      <Section wide>
        <CounsellingBoundaries />
      </Section>

      <Section wide className="!pb-16 !pt-2">
        <div className="flex w-full flex-col gap-4 rounded-2xl border border-border-subtle bg-secondary p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <p className="max-w-2xl text-base text-secondary-foreground">
            {t("counsellingPage.ctaNote", { ns })}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/app/care">{t("counsellingPage.ctaCare", { ns })}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/demo">{t("counsellingPage.cta", { ns })}</Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function JourneyWithNote() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <CounsellingJourneyTimeline />
      <p className="rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-3 text-sm leading-relaxed text-ink-600">
        {t("counsellingPage.journey.note", { ns: "public" })}
      </p>
    </div>
  );
}

function JourneyIntro() {
  const { t } = useTranslation();
  return (
    <div>
      <h2 id="counselling-journey-heading" className="text-2xl font-semibold text-teal-900">
        {t("counsellingPage.journey.heading", { ns: "public" })}
      </h2>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-600">
        {t("counsellingPage.journey.intro", { ns: "public" })}
      </p>
    </div>
  );
}
