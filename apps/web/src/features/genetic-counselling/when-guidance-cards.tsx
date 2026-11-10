import { useTranslation } from "react-i18next";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList, type TitleBody } from "@/i18n/copy-list";

export function WhenGuidanceCards() {
  const { t } = useTranslation();
  const cards = useCopyList<TitleBody>("counsellingPage.whenCards", "public");

  return (
    <section aria-labelledby="when-guidance-heading">
      <h2 id="when-guidance-heading" className="mb-6 text-2xl font-semibold text-teal-900">
        {t("counsellingPage.whenCardsHeading", { ns: "public" })}
      </h2>
      <RevealStagger className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{card.title}</CardTitle>
              <CardDescription className="text-base leading-relaxed">{card.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </RevealStagger>
    </section>
  );
}
