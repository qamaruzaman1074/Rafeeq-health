import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Component() {
  const { t } = useTranslation();

  return (
    <div className="ms-auto me-auto flex w-full max-w-3xl flex-col gap-8 ps-4 pe-4 py-8 sm:ps-6 sm:pe-6 sm:py-12">
      <PageHeader
        title={t("legal.title", { ns: "landing" })}
        description={t("legal.intro", { ns: "landing" })}
      />
      <ul className="flex flex-col gap-4">
        <li>
          <Card>
            <CardHeader>
              <CardTitle>{t("legal.notAdvice", { ns: "landing" })}</CardTitle>
            </CardHeader>
          </Card>
        </li>
        <li>
          <Card>
            <CardHeader>
              <CardDescription>{t("legal.synthetic", { ns: "landing" })}</CardDescription>
            </CardHeader>
          </Card>
        </li>
        <li>
          <Card>
            <CardHeader>
              <CardDescription>{t("legal.privacy", { ns: "landing" })}</CardDescription>
              <Button asChild variant="secondary" className="w-fit">
                <Link to="/trust">{t("legal.openTrust", { ns: "landing" })}</Link>
              </Button>
            </CardHeader>
          </Card>
        </li>
      </ul>
    </div>
  );
}
