import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ClinicalDraftBadge } from "@/features/inherited-risk-education/clinical-draft-badge";
import { ScreeningPathwayBreadcrumbs } from "@/features/screening-pathways/pathway-breadcrumbs";
import { ScreeningPathwaysSections } from "@/features/screening-pathways/screening-pathways-sections";
import { Button } from "@/components/ui/button";
import { useDocumentMeta } from "@/lib/use-document-meta";

export function Component() {
  const { t } = useTranslation();
  const ns = "public";

  useDocumentMeta(
    t("screeningPathways.documentTitle", { ns }),
    t("screeningPathways.metaDescription", { ns }),
  );

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14" reveal={false}>
        <ScreeningPathwayBreadcrumbs current="hub" />
        <PageHeader
          eyebrow={
            <span className="flex flex-wrap items-center gap-2">
              {t("screeningPathways.eyebrow", { ns })}
              <ClinicalDraftBadge messageKey="screeningPathways.reviewBadge" />
            </span>
          }
          title={t("screeningPathways.hero.title", { ns })}
          description={t("screeningPathways.hero.intro", { ns })}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/app/result">{t("screeningPathways.actions.result", { ns })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/care">{t("screeningPathways.actions.care", { ns })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/genetic-counselling">{t("screeningPathways.actions.counselling", { ns })}</Link>
          </Button>
        </div>
      </Section>

      <Section wide className="!pb-16">
        <ScreeningPathwaysSections />
      </Section>
    </div>
  );
}
