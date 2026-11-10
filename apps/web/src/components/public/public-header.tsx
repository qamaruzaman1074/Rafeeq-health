import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { RafeeqLogo } from "@/components/brand/rafeeq-logo";
import { SiteContainer } from "@/components/layout/site-container";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { publicNavPrimary } from "@/config/public-nav";
import { cn } from "@/lib/utils";

export const navLinkClass =
  "nav-pill inline-flex min-h-11 w-full items-center justify-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring md:w-auto";

const currentClass =
  "nav-pill nav-pill-active inline-flex min-h-11 w-full items-center justify-center md:w-auto";

function HashNavLink({
  hash,
  label,
  className,
  onNavigate,
}: {
  hash: string;
  label: string;
  className: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={{ pathname: "/", hash }}
      className={className}
      onClick={() => {
        onNavigate?.();
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

function PrimaryNavLinks({
  pathname,
  closeMenu,
  className,
}: {
  pathname: string;
  closeMenu?: () => void;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <ul className={className}>
      {publicNavPrimary.map((item) => {
        const label = t(item.labelKey, { ns: "public" });
        const routePath = item.path.split("#")[0] || "/";
        const isHash = "hashOnHome" in item && item.hashOnHome;
        return (
          <li key={item.path}>
            {isHash ? (
              <HashNavLink
                hash="#how-it-works"
                label={label}
                className={navLinkClass}
                onNavigate={closeMenu}
              />
            ) : pathname === routePath ? (
              <span aria-current="page" className={currentClass}>
                {label}
              </span>
            ) : (
              <Link to={item.path} className={navLinkClass} onClick={closeMenu}>
                {label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function PublicHeader() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      data-scrolled={scrolled ? "true" : undefined}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border-subtle/80 bg-background/85 backdrop-blur-md transition-[box-shadow,background-color,padding] duration-300 motion-safe:ease-out supports-[backdrop-filter]:bg-background/75",
        scrolled ? "shadow-surface-md bg-background/95" : "shadow-xs",
      )}
    >
      <SiteContainer
        className={cn(
          "flex w-full flex-wrap items-center gap-x-4 gap-y-3 motion-safe:transition-[padding] motion-safe:duration-300",
          scrolled ? "py-2.5 sm:py-3" : "py-3 sm:py-4",
        )}
      >
        <Link
          to="/"
          className="shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <RafeeqLogo />
        </Link>

        <nav
          aria-label={t("nav.primary", { ns: "landing" })}
          className="hidden min-w-0 flex-1 justify-center xl:flex"
        >
          <PrimaryNavLinks
            pathname={pathname}
            className="flex min-w-0 flex-wrap items-center justify-center gap-x-0.5 gap-y-1"
          />
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <div className="hidden xl:flex">
            <LocaleSwitcher />
          </div>
          <Button asChild variant="ghost" className="hidden min-h-11 lg:inline-flex">
            <Link to="/demo">{t("nav.signIn", { ns: "public" })}</Link>
          </Button>
          <Button asChild className="hidden min-h-11 sm:inline-flex">
            <Link to="/demo">{t("cta.getStarted", { ns: "public" })}</Link>
          </Button>
          <ThemeToggle />
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="xl:hidden"
                aria-expanded={menuOpen}
                aria-controls="public-mobile-nav"
              >
                {t("nav.menu", { ns: "landing" })}
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
              <DialogTitle className="text-lg font-semibold text-teal-900">
                {t("nav.primary", { ns: "landing" })}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t("nav.menuHint", { ns: "landing" })}
              </DialogDescription>
              <nav id="public-mobile-nav" aria-label={t("nav.primary", { ns: "landing" })}>
                <PrimaryNavLinks
                  pathname={pathname}
                  closeMenu={() => {
                    setMenuOpen(false);
                  }}
                  className="flex flex-col gap-1"
                />
                <div className="mt-4 flex flex-col gap-2 border-t border-border-subtle pt-4">
                  <Link
                    to="/contact"
                    className={navLinkClass}
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                  >
                    {t("nav.contact", { ns: "public" })}
                  </Link>
                  <div className="border-t border-border-subtle pt-4">
                    <LocaleSwitcher />
                  </div>
                  <Button asChild variant="secondary">
                    <Link
                      to="/demo"
                      onClick={() => {
                        setMenuOpen(false);
                      }}
                    >
                      {t("nav.signIn", { ns: "public" })}
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link
                      to="/demo"
                      onClick={() => {
                        setMenuOpen(false);
                      }}
                    >
                      {t("cta.getStarted", { ns: "public" })}
                    </Link>
                  </Button>
                </div>
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </SiteContainer>
    </header>
  );
}
