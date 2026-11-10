import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { registerClinicCatalog } from "@/i18n/register-clinic";

registerClinicCatalog();

export function Component() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-teal-900">{t("page.title", { ns: "clinic" })}</h1>
      <Link
        to="/clinic/queue"
        className="inline-flex min-h-11 items-center self-start text-teal-700 underline decoration-teal-700 underline-offset-4"
      >
        {t("page.toQueue", { ns: "clinic" })}
      </Link>
    </div>
  );
}
