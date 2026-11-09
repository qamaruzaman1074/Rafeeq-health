import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ClinicalDraftBadge } from "@/features/inherited-risk-education/clinical-draft-badge";
import { InheritedRiskEducationSections } from "@/features/inherited-risk-education/inherited-risk-education-sections";
import { InheritedRiskSectionNav } from "@/features/inherited-risk-education/inherited-risk-section-nav";

export function Component() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14" reveal={false}>
        <PageHeader
          eyebrow={
            <span className="flex flex-wrap items-center gap-2">
              {t("risk.eyebrow", { ns: "public" })}
              <ClinicalDraftBadge />
            </span>
          }
          title={t("risk.heroTitle", { ns: "public" })}
          description={t("risk.heroIntro", { ns: "public" })}
        />
        <div className="mt-6 overflow-hidden rounded-xl border border-border-subtle shadow-xs">
          <img
            src="/images/outcomes/inherited-risk/hero-genetics.webp"
            alt={t("risk.heroImageAlt", { ns: "public" })}
            className="aspect-[21/9] w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
        <InheritedRiskSectionNav labelledBy="risk-nav-label" />
        <p id="risk-nav-label" className="sr-only">
          {t("risk.nav.label", { ns: "public" })}
        </p>
      </Section>

      <InheritedRiskEducationSections />
    </div>
  );
}
