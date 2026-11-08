import { useTranslation } from "react-i18next";

export function SkipLink() {
  const { t } = useTranslation();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-10 focus:inline-flex focus:min-h-11 focus:items-center focus:bg-sand-50 focus:ps-4 focus:pe-4 focus:text-teal-900 focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-teal-500"
    >
      {t("shell.skip")}
    </a>
  );
}
