import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ClinicalDraftBadge } from "@/features/inherited-risk-education/clinical-draft-badge";
import { NonDirectiveNotice } from "@/features/informed-choices/non-directive-notice";
import { PathwayEducation } from "@/features/informed-choices/pathway-education";
import { ReadingListPrototype } from "@/features/informed-choices/reading-list-prototype";
import { ReflectionSection } from "@/features/informed-choices/reflection-section";
import { Button } from "@/components/ui/button";
import { useDocumentMeta } from "@/lib/use-document-meta";

export function Component() {
  const { t } = useTranslation();
  const ns = "public";

  useDocumentMeta(
    t("informedChoices.documentTitle", { ns }),
    t("informedChoices.metaDescription", { ns }),
  );

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14" reveal={false}>
        <PageHeader
          eyebrow={
            <span className="flex flex-wrap items-center gap-2">
              {t("informedChoices.eyebrow", { ns })}
              <ClinicalDraftBadge messageKey="informedChoices.reviewBadge" />
            </span>
          }
          title={t("informedChoices.hero.title", { ns })}
          description={t("informedChoices.hero.intro", { ns })}
        />
        <NonDirectiveNotice />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/app/learn">{t("informedChoices.actions.learn", { ns })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/care">{t("informedChoices.actions.care", { ns })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/ask">{t("informedChoices.actions.ask", { ns })}</Link>
          </Button>
        </div>
      </Section>

      <Section wide aria-labelledby="pathways-heading">
        <PathwayEducation />
      </Section>

      <Section wide className="surface-muted">
        <ReflectionSection />
      </Section>

      <Section wide className="!pb-16">
        <ReadingListPrototype />
      </Section>
    </div>
  );
}
