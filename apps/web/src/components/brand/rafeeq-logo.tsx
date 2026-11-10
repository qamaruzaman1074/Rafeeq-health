import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function RafeeqMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("shrink-0 text-teal-900", className)}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="18" cy="24" r="11.5" stroke="currentColor" strokeWidth="2.25" opacity="0.55" />
      <circle cx="30" cy="24" r="11.5" stroke="currentColor" strokeWidth="2.25" />
      <circle cx="24" cy="24" r="3.4" fill="var(--gold-500)" />
    </svg>
  );
}

export function RafeeqLogo({
  size = "header",
  className,
}: {
  size?: "header" | "hero";
  className?: string;
}) {
  const { t } = useTranslation();
  const hero = size === "hero";

  return (
    <span className={cn("inline-flex items-center", hero ? "gap-3" : "gap-2", className)}>
      <RafeeqMark className={hero ? "h-14 w-14 sm:h-16 sm:w-16" : "h-8 w-8"} />
      <span
        className={cn(
          "font-semibold tracking-[0.16em] text-teal-900",
          hero ? "text-2xl sm:text-3xl" : "text-lg",
        )}
      >
        {t("common.brand.wordmark")}
      </span>
    </span>
  );
}
