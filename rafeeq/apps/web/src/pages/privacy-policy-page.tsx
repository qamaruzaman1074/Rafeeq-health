import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { PublicProse } from "@/components/public/public-prose";

const sectionKeys = [
  "collect",
  "use",
  "consent",
  "access",
  "minimise",
  "storage",
  "retention",
  "thirdParty",
  "rights",
  "contact",
] as const;

export function Component() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-4 !pt-10 sm:!pt-14">
        <PageHeader
          title={t("privacyPolicy.heroTitle", { ns: "public" })}
          description={t("privacyPolicy.intro", { ns: "public" })}
        />
      </Section>
      <Section className="!pb-16" reveal={false}>
        <PublicProse>
          <ul className="flex flex-col gap-6 ps-0 [&_li]:list-none">
            {sectionKeys.map((key) => (
              <li key={key}>
                <h2>{t(`privacyPolicy.sections.${key}.heading`, { ns: "public" })}</h2>
                <p>{t(`privacyPolicy.sections.${key}.body`, { ns: "public" })}</p>
              </li>
            ))}
          </ul>
        </PublicProse>
      </Section>
    </div>
  );
}
