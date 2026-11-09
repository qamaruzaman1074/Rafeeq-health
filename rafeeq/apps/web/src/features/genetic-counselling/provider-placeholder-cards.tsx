import { useTranslation } from "react-i18next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList, type TitleBody } from "@/i18n/copy-list";

export function ProviderPlaceholderCards() {
  const { t } = useTranslation();
  const slots = useCopyList<TitleBody>("counsellingPage.providerSlots", "public");

  return (
    <section aria-labelledby="provider-slots-heading">
      <h2 id="provider-slots-heading" className="mb-2 text-2xl font-semibold text-teal-900">
        {t("counsellingPage.profilesHeading", { ns: "public" })}
      </h2>
      <p className="mb-6 max-w-3xl text-base text-ink-600">
        {t("counsellingPage.profilesIntro", { ns: "public" })}
      </p>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {slots.map((slot) => (
          <li key={slot.title}>
            <Card className="h-full border-dashed">
              <CardHeader>
                <CardTitle>{slot.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{slot.body}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
