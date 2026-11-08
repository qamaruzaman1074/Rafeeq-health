import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { navLinkClass } from "@/components/public/public-header";

export function PublicFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border-subtle bg-sand-100">
      <div className="ms-auto me-auto flex w-full max-w-6xl flex-col gap-6 ps-4 pe-4 py-8 sm:ps-6 sm:pe-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold text-teal-900">
              {t("nav.home", { ns: "landing" })}
            </p>
            <p className="max-w-md text-base text-ink-600">
              {t("footer.tagline", { ns: "landing" })}
            </p>
          </div>
          <nav aria-label={t("footer.nav", { ns: "landing" })}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <Link to="/#how-it-works" className={navLinkClass}>
                  {t("nav.howItWorks", { ns: "landing" })}
                </Link>
              </li>
              <li>
                <Link to="/trust" className={navLinkClass}>
                  {t("nav.privacy", { ns: "landing" })}
                </Link>
              </li>
              <li>
                <Link to="/legal" className={navLinkClass}>
                  {t("nav.legal", { ns: "landing" })}
                </Link>
              </li>
              <li>
                <Link to="/demo" className={navLinkClass}>
                  {t("demo.title", { ns: "landing" })}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="text-sm text-ink-600">{t("shell.syntheticNotice")}</p>
      </div>
    </footer>
  );
}
