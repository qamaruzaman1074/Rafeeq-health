import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { RafeeqLogo } from "@/components/brand/rafeeq-logo";
import { SiteContainer } from "@/components/layout/site-container";
import { ThemeToggle } from "@/components/theme-toggle";
import { publicNavFooterGroups } from "@/config/public-nav";

const footerLinkClass =
  "inline-flex min-h-11 items-center rounded-md text-base text-teal-700 underline-offset-4 transition-colors duration-200 hover:text-teal-900 hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring sm:min-h-9";

export function PublicFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border-subtle bg-muted">
      <SiteContainer className="flex flex-col gap-10 py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
          <div className="flex max-w-sm flex-col gap-4">
            <Link
              to="/"
              className="w-fit focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <RafeeqLogo />
            </Link>
            <p className="text-base leading-relaxed text-ink-600">
              {t("footer.description", { ns: "public" })}
            </p>
            <ThemeToggle />
          </div>
          {publicNavFooterGroups.map((group) => (
            <nav key={group.headingKey} aria-label={t(group.headingKey, { ns: "public" })}>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-900">
                {t(group.headingKey, { ns: "public" })}
              </p>
              <ul className="flex flex-col gap-1">
                {group.links.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className={footerLinkClass}>
                      {t(item.labelKey, { ns: "public" })}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-border-subtle pt-6">
          <p className="max-w-4xl text-sm leading-relaxed text-ink-600">
            {t("footer.statement", { ns: "public" })}
          </p>
          <p className="text-sm text-ink-600">{t("footer.copyright", { ns: "public", year })}</p>
        </div>
      </SiteContainer>
    </footer>
  );
}
