import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const textLinkClass =
  "inline-flex min-h-11 items-center text-base text-teal-700 underline decoration-teal-700 underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500";

const currentClass = "inline-flex min-h-11 items-center text-base font-medium text-teal-900";

export function PublicNav({ current }: { current: "home" | "trust" | "demo" }) {
  const { t } = useTranslation();

  return (
    <nav aria-label={t("nav.label", { ns: "landing" })}>
      <ul className="flex flex-wrap gap-4">
        <li>
          {current === "home" ? (
            <span aria-current="page" className={currentClass}>
              {t("page.title", { ns: "landing" })}
            </span>
          ) : (
            <Link to="/" className={textLinkClass}>
              {t("page.title", { ns: "landing" })}
            </Link>
          )}
        </li>
        <li>
          {current === "trust" ? (
            <span aria-current="page" className={currentClass}>
              {t("trust.title", { ns: "landing" })}
            </span>
          ) : (
            <Link to="/trust" className={textLinkClass}>
              {t("trust.title", { ns: "landing" })}
            </Link>
          )}
        </li>
        <li>
          {current === "demo" ? (
            <span aria-current="page" className={currentClass}>
              {t("demo.title", { ns: "landing" })}
            </span>
          ) : (
            <Link to="/demo" className={textLinkClass}>
              {t("demo.title", { ns: "landing" })}
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
