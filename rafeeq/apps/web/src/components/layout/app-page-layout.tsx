import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AppPageLayoutProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  nav?: ReactNode;
  header?: ReactNode;
  /** Default `narrow` matches existing app pages; `wide` for dashboards */
  width?: "narrow" | "wide";
};

const widthClass = {
  narrow: "max-w-3xl",
  wide: "max-w-5xl",
} as const;

export function AppPageLayout({
  children,
  nav,
  header,
  width = "narrow",
  className,
  ...props
}: AppPageLayoutProps) {
  return (
    <div
      className={cn(
        "ms-auto me-auto flex w-full flex-col gap-6 sm:gap-8",
        widthClass[width],
        className,
      )}
      {...props}
    >
      {nav !== undefined ? <div className="border-b border-border-subtle pb-4">{nav}</div> : null}
      {header}
      <div className="flex flex-col gap-6 sm:gap-8">{children}</div>
    </div>
  );
}
