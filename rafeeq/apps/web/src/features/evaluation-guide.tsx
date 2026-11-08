import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { personas } from "@/features/personas";

export function EvaluationGuide() {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">{t("guide.open", { ns: "landing" })}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogTitle>{t("guide.title", { ns: "landing" })}</DialogTitle>
        <DialogDescription>{t("guide.intro", { ns: "landing" })}</DialogDescription>
        <section className="flex flex-col gap-3">
          <h3 className="text-xl font-semibold text-teal-900">
            {t("guide.tryHeading", { ns: "landing" })}
          </h3>
          <ol className="flex list-decimal flex-col gap-2 ps-6">
            <li>{t("guide.step1", { ns: "landing" })}</li>
            <li>{t("guide.step2", { ns: "landing" })}</li>
            <li>{t("guide.step3", { ns: "landing" })}</li>
            <li>{t("guide.step4", { ns: "landing" })}</li>
          </ol>
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="text-xl font-semibold text-teal-900">
            {t("guide.personasHeading", { ns: "landing" })}
          </h3>
          <ul className="flex flex-col gap-4">
            {personas.map((persona) => (
              <li key={persona.id} className="flex flex-col gap-1">
                <p className="font-medium text-teal-900">
                  {persona.id}. {persona.names}
                </p>
                <p lang="en" dir="ltr">
                  <span className="font-medium">{t("guide.story", { ns: "landing" })}: </span>
                  {persona.story}
                </p>
                <p lang="en" dir="ltr">
                  <span className="font-medium">{t("demo.willSee", { ns: "landing" })}: </span>
                  {persona.tests}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </DialogContent>
    </Dialog>
  );
}
