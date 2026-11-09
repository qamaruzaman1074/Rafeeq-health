import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList } from "@/i18n/copy-list";
import { REFLECTION_QUESTION_IDS } from "./content-model";

type ReflectionItem = {
  id: string;
  prompt: string;
  placeholder: string;
};

export function ReflectionSection() {
  const { t } = useTranslation();
  const questions = useCopyList<ReflectionItem>("informedChoices.reflection.questions", "public");
  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <section className="flex flex-col gap-4" aria-labelledby="reflection-heading">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="reflection-heading" className="text-2xl font-semibold text-teal-900">
          {t("informedChoices.reflection.heading", { ns: "public" })}
        </h2>
        <Badge variant="notice">{t("informedChoices.reflection.badge", { ns: "public" })}</Badge>
      </div>
      <p className="max-w-3xl text-base leading-relaxed text-ink-600">
        {t("informedChoices.reflection.lead", { ns: "public" })}
      </p>
      <NoticeDisclaimer />
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {questions.map((item) => (
          <li key={item.id}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{item.prompt}</CardTitle>
                <CardDescription>{t("informedChoices.reflection.notClinical", { ns: "public" })}</CardDescription>
              </CardHeader>
              <CardContent>
                <label className="sr-only" htmlFor={`reflection-${item.id}`}>
                  {item.prompt}
                </label>
                <textarea
                  id={`reflection-${item.id}`}
                  name={item.id}
                  rows={3}
                  value={notes[item.id] ?? ""}
                  placeholder={item.placeholder}
                  className="w-full rounded-md border border-border-subtle bg-background p-3 text-base text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                  onChange={(event) => {
                    setNotes((current) => ({ ...current, [item.id]: event.target.value }));
                  }}
                />
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      <p className="text-sm text-ink-600">
        {t("informedChoices.reflection.persistence", { ns: "public" })}
      </p>
      <p className="sr-only" aria-live="polite">
        {t("informedChoices.reflection.promptCountSr", {
          ns: "public",
          count: REFLECTION_QUESTION_IDS.length,
        })}
      </p>
    </section>
  );
}

function NoticeDisclaimer() {
  const { t } = useTranslation();
  return (
    <p className="max-w-3xl rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-sm text-ink-900">
      {t("informedChoices.reflection.disclaimer", { ns: "public" })}
    </p>
  );
}
