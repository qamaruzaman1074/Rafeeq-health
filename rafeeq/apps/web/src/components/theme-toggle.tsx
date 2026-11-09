import { useTranslation } from "react-i18next";
import { useTheme } from "@/app/theme";
import { Button } from "@/components/ui/button";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.5M12 19.5V21M4.93 4.93l1.06 1.06M18.01 18.01l1.06 1.06M3 12h1.5M19.5 12H21M4.93 19.07l1.06-1.06M18.01 5.99l1.06-1.06" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === "dark" ? t("common.theme.toLight") : t("common.theme.toDark");

  return (
    <Button
      variant="secondary"
      className="min-h-11 min-w-11 ps-3 pe-3"
      aria-label={nextLabel}
      aria-pressed={theme === "dark"}
      title={nextLabel}
      onClick={toggleTheme}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
