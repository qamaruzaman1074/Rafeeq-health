import { useTranslation } from "react-i18next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { landmarkName } from "@/lib/landmark-name";

const ITEMS = ["carrier", "couple", "diagnosis"] as const;

export function ResultMeanings() {
  const { t } = useTranslation();

  return (
    <section
      className="flex flex-col gap-4"
      aria-labelledby="result-meanings-heading"
      data-result-section="meanings"
    >
      <h2 id="result-meanings-heading" className="text-xl font-semibold text-teal-900">
        {t("meanings.heading", { ns: "result" })}
      </h2>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <li key={item}>
            <Card className="h-full hover:shadow-surface">
              <CardHeader>
                <CardTitle>
                  {landmarkName(
                    t(`meanings.${item}.title`, { ns: "result" }),
                    item === "carrier"
                      ? "Carrier status"
                      : item === "couple"
                        ? "Couple-level reproductive chance"
                        : "A confirmed diagnosis",
                  )}
                </CardTitle>
                <CardDescription>{t(`meanings.${item}.body`, { ns: "result" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
