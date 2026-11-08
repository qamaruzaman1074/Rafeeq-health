import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { LiteracyModeToggle } from "@/components/literacy-mode-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NumeralToggle } from "@/components/numeral-toggle";
import { Button } from "@/components/ui/button";

const navLinkClass =
  "inline-flex min-h-11 items-center text-base text-teal-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500";

const currentClass = "inline-flex min-h-11 items-center text-base font-medium text-teal-900";

function HashNavLink({
  hash,
  label,
  className,
}: {
  hash: string;
  label: string;
  className: string;
}) {
  return (
    <Link
      to={{ pathname: "/", hash }}
      className={className}
      onClick={() => {
        if (window.location.pathname !== "/") {
          return;
        }
        const id = hash.replace(/^#/, "");
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      }}
    >
      {label}
    </Link>
  );
}

export function PublicHeader() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <header className="border-b border-border-subtle bg-sand-50">
      <div className="ms-auto me-auto flex w-full max-w-6xl flex-col gap-3 ps-4 pe-4 py-3 sm:ps-6 sm:pe-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-teal-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            {t("nav.home", { ns: "landing" })}
          </Link>
          <nav aria-label={t("nav.primary", { ns: "landing" })} className="min-w-0 flex-1">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <li>
                <HashNavLink
                  hash="#how-it-works"
                  label={t("nav.howItWorks", { ns: "landing" })}
                  className={navLinkClass}
                />
              </li>
              <li>
                <HashNavLink
                  hash="#approach"
                  label={t("nav.approach", { ns: "landing" })}
                  className={navLinkClass}
                />
              </li>
              <li>
                {pathname === "/trust" ? (
                  <span aria-current="page" className={currentClass}>
                    {t("nav.privacy", { ns: "landing" })}
                  </span>
                ) : (
                  <Link to="/trust" className={navLinkClass}>
                    {t("nav.privacy", { ns: "landing" })}
                  </Link>
                )}
              </li>
            </ul>
          </nav>
          <div className="ms-auto flex flex-wrap items-center gap-3">
            <LocaleSwitcher />
            {/* OPEN_QUESTION: planning Section 7 names Sign in, and MASTER Section 6 names POST /auth/login. Neither names a route or form. Until a login form exists, Sign in opens the public demo entry. */}
            <Button asChild variant="secondary">
              <Link to="/demo">{t("page.signIn", { ns: "landing" })}</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LiteracyModeToggle />
          <NumeralToggle />
        </div>
      </div>
    </header>
  );
}

export { navLinkClass, currentClass };
