import { useTranslation } from "react-i18next";
import { Link, useMatch } from "react-router";

function SectionLink({ to, label }: { to: string; label: string }) {
  const match = useMatch({ path: to, end: true });
  return (
    <Link
      to={to}
      aria-current={match ? "page" : undefined}
      className="inline-flex min-h-11 items-center text-teal-700 underline decoration-teal-700 underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
    >
      {label}
    </Link>
  );
}

export function CoupleSectionNav() {
  const { t } = useTranslation();
  const links = [
    { to: "/app", label: t("home.title", { ns: "couple" }) },
    { to: "/app/result", label: t("page.title", { ns: "result" }) },
    { to: "/app/couple", label: t("together.title", { ns: "couple" }) },
  ];

  return (
    <nav aria-label={t("nav.label", { ns: "couple" })}>
      <ul className="flex flex-wrap gap-4">
        {links.map((link) => (
          <li key={link.to}>
            <SectionLink to={link.to} label={link.label} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
