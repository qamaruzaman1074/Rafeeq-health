import { useTranslation } from "react-i18next";
import { Link, useMatch } from "react-router";
import { CoupleNavIcon, type CoupleNavIconId } from "@/components/app/nav-icons";
import { cn } from "@/lib/utils";

export type CoupleNavItem = {
  to: string;
  icon: CoupleNavIconId;
  labelKey: string;
};

export const COUPLE_PRIMARY_NAV: readonly CoupleNavItem[] = [
  { to: "/app", icon: "overview", labelKey: "shell.nav.overview" },
  { to: "/app/reports", icon: "report", labelKey: "shell.nav.myReports" },
  { to: "/app/journey", icon: "care", labelKey: "shell.nav.healthJourney" },
  { to: "/app/partner", icon: "partner", labelKey: "shell.nav.partnerSharing" },
  { to: "/app/resources", icon: "resources", labelKey: "shell.nav.resources" },
  { to: "/app/settings", icon: "settings", labelKey: "shell.nav.settings" },
];

const focusClass =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500";

export function NavGroupHeading({ children, id }: { children: string; id?: string }) {
  return (
    <p
      id={id}
      className="ps-3 pe-3 pb-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-600"
    >
      {children}
    </p>
  );
}

export function CoupleNavLink({ item, compact }: { item: CoupleNavItem; compact?: boolean }) {
  const { t } = useTranslation();
  const match = useMatch({ path: item.to, end: true });
  const label = t(item.labelKey);
  const current = Boolean(match);

  return (
    <Link
      to={item.to}
      aria-current={current ? "page" : undefined}
      className={cn(
        "relative inline-flex min-h-11 min-w-0 items-center gap-3 rounded-lg font-medium motion-safe:transition-[transform,color,background-color] motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0",
        focusClass,
        compact
          ? "w-full flex-col justify-center gap-1 ps-1 pe-1 py-2 text-center lg:min-h-10 lg:flex-row lg:justify-start lg:gap-3 lg:ps-3 lg:pe-3 lg:py-0 lg:text-start"
          : "w-full ps-3 pe-3 lg:min-h-10",
        "lg:text-[0.9375rem]",
        current
          ? "bg-secondary text-teal-900 lg:before:absolute lg:before:start-0 lg:before:top-2 lg:before:bottom-2 lg:before:w-[3px] lg:before:rounded-full lg:before:bg-teal-700"
          : "text-ink-600 hover:bg-secondary hover:text-teal-900",
      )}
    >
      <span className={cn("inline-flex", current ? "text-teal-700" : "text-current")}>
        <CoupleNavIcon id={item.icon} />
      </span>
      <span
        className={cn(
          "leading-tight",
          compact && "max-w-full text-balance text-[0.6875rem] lg:text-[0.9375rem]",
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function CouplePrimaryNav({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t("shell.nav.label")} className={className}>
      <div className="hidden lg:block">
        <NavGroupHeading>{t("shell.nav.groups.main")}</NavGroupHeading>
      </div>
      <ul className="grid grid-cols-3 gap-1 lg:flex lg:flex-col lg:gap-0.5">
        {COUPLE_PRIMARY_NAV.map((item) => (
          <li key={item.to} className="min-w-0">
            <CoupleNavLink item={item} compact />
          </li>
        ))}
      </ul>
    </nav>
  );
}
