import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Component() {
  const { t } = useTranslation();

  return (
    <div className="ms-auto me-auto flex w-full max-w-5xl flex-col gap-10 ps-4 pe-4 py-8 sm:ps-6 sm:pe-6 sm:py-12">
      <PageHeader
        eyebrow={t("nav.privacy", { ns: "landing" })}
        title={t("trust.title", { ns: "landing" })}
        description={t("trust.synthetic", { ns: "landing" })}
      />
      <p className="text-base leading-relaxed text-ink-600">
        {t("trust.frequencies", { ns: "landing" })}
      </p>

      <section className="flex flex-col gap-4" aria-labelledby="trust-privacy-heading">
        <h2 id="trust-privacy-heading" className="text-section text-teal-900">
          {t("trust.privacy.heading", { ns: "landing" })}
        </h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <li>
            <Card>
              <CardHeader>
                <CardDescription>{t("trust.privacy.own", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardDescription>{t("trust.privacy.overlap", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardDescription>{t("trust.privacy.clinic", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardDescription>
                  {t("trust.privacy.counsellor", { ns: "landing" })}
                </CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardDescription>{t("trust.privacy.analyst", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardDescription>{t("trust.privacy.audit", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardDescription>{t("trust.privacy.revoke", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardDescription>{t("trust.privacy.guest", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardDescription>{t("trust.privacy.minimise", { ns: "landing" })}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="trust-ai-heading">
        <h2 id="trust-ai-heading" className="text-section text-teal-900">
          {t("trust.ai.heading", { ns: "landing" })}
        </h2>
        <Card>
          <CardHeader className="gap-4">
            <CardTitle>{t("trust.ai.heading", { ns: "landing" })}</CardTitle>
            <CardDescription>{t("trust.ai.role", { ns: "landing" })}</CardDescription>
            <CardDescription>{t("trust.ai.inputs", { ns: "landing" })}</CardDescription>
            <CardDescription>{t("trust.ai.limits", { ns: "landing" })}</CardDescription>
            <CardDescription>{t("trust.ai.human", { ns: "landing" })}</CardDescription>
            <CardDescription>{t("trust.ai.routes", { ns: "landing" })}</CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="trust-review-heading">
        <h2 id="trust-review-heading" className="text-section text-teal-900">
          {t("trust.review.heading", { ns: "landing" })}
        </h2>
        <Card>
          <CardHeader className="gap-4">
            <CardDescription>{t("trust.review.status", { ns: "landing" })}</CardDescription>
            <CardDescription>{t("trust.review.draft", { ns: "landing" })}</CardDescription>
            <CardDescription>{t("trust.review.arabic", { ns: "landing" })}</CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
