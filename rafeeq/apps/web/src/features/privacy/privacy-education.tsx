import { useTranslation } from "react-i18next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList, type TitleBody } from "@/i18n/copy-list";
import { PrototypeInteractionNotice } from "./prototype-notice";

export function PrivacyEducation() {
  const { t } = useTranslation();
  const principles = useCopyList<TitleBody>("education.principles", "privacy");

  return (
    <section className="flex flex-col gap-6" aria-labelledby="privacy-education-heading">
      <PrivacyEducationIntro />
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {principles.map((item) => (
          <li key={item.title}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{item.body}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
      <PrototypeInteractionNotice />
      <p className="text-sm text-ink-600">{t("education.notProductionSecurity", { ns: "privacy" })}</p>
    </section>
  );
}

function PrivacyEducationIntro() {
  const { t } = useTranslation();
  return (
    <>
      <h2 id="privacy-education-heading" className="text-2xl font-semibold text-teal-900">
        {t("education.heading", { ns: "privacy" })}
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-ink-600">{t("education.intro", { ns: "privacy" })}</p>
    </>
  );
}
