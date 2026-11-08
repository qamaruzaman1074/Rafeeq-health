import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PublicNav } from "@/components/public-nav";
import { Button } from "@/components/ui/button";
import { EvaluationGuide } from "@/features/evaluation-guide";

export function Component() {
  const { t } = useTranslation();

  return (
    <div className="ms-auto me-auto flex w-full max-w-3xl flex-col gap-10">
      <PublicNav current="home" />
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-teal-900">
          {t("page.value", { ns: "landing" })}
        </h1>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/demo">{t("page.continueGuest", { ns: "landing" })}</Link>
          </Button>
          {/* OPEN_QUESTION: planning Section 7 names Sign in, and MASTER Section 6 names POST /auth/login. Neither names a route or form. */}
          <Button variant="secondary">{t("page.signIn", { ns: "landing" })}</Button>
        </div>
        <EvaluationGuide />
      </section>
      <ul className="flex flex-col gap-4">
        <li className="rounded-lg border border-teal-500 bg-sand-100 p-6">
          <h2 className="text-xl font-semibold text-teal-900">
            {t("pillars.plain.title", { ns: "landing" })}
          </h2>
          <p className="mt-2">{t("pillars.plain.body", { ns: "landing" })}</p>
        </li>
        <li className="rounded-lg border border-teal-500 bg-sand-100 p-6">
          <h2 className="text-xl font-semibold text-teal-900">
            {t("pillars.sharing.title", { ns: "landing" })}
          </h2>
          <p className="mt-2">{t("pillars.sharing.body", { ns: "landing" })}</p>
        </li>
        <li className="rounded-lg border border-teal-500 bg-sand-100 p-6">
          <h2 className="text-xl font-semibold text-teal-900">
            {t("pillars.humans.title", { ns: "landing" })}
          </h2>
          <p className="mt-2">{t("pillars.humans.body", { ns: "landing" })}</p>
        </li>
      </ul>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-teal-900">
          {t("steps.heading", { ns: "landing" })}
        </h2>
        <ol className="flex list-decimal flex-col gap-4 ps-6">
          <li>
            <h3 className="text-xl font-semibold text-teal-900">
              {t("steps.one.title", { ns: "landing" })}
            </h3>
            <p>{t("steps.one.body", { ns: "landing" })}</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-teal-900">
              {t("steps.two.title", { ns: "landing" })}
            </h3>
            <p>{t("steps.two.body", { ns: "landing" })}</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-teal-900">
              {t("steps.three.title", { ns: "landing" })}
            </h3>
            <p>{t("steps.three.body", { ns: "landing" })}</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-teal-900">
              {t("steps.four.title", { ns: "landing" })}
            </h3>
            <p>{t("steps.four.body", { ns: "landing" })}</p>
          </li>
        </ol>
      </section>
    </div>
  );
}
