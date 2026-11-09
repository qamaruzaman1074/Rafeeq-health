import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { FaqAccordion, usePublicFaqCategories } from "@/components/public/faq-accordion";

export function Component() {
  const { t } = useTranslation();
  const categories = usePublicFaqCategories();

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14">
        <PageHeader
          title={t("faq.title", { ns: "public" })}
          description={t("faq.intro", { ns: "public" })}
        />
      </Section>
      <Section wide className="!pb-16">
        <FaqAccordion categories={categories} />
      </Section>
    </div>
  );
}
