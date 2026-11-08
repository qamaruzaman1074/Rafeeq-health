import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Wider content on large screens when true */
  wide?: boolean;
};

const widthClass = {
  default: "max-w-3xl",
  wide: "max-w-6xl",
} as const;

export function Section({ children, className, wide = false, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "ms-auto me-auto flex w-full flex-col gap-6 py-section sm:gap-8",
        widthClass[wide ? "wide" : "default"],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
