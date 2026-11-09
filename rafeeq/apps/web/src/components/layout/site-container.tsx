import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SiteContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  as?: ElementType;
  /** Tighter readable measure for long-form copy */
  narrow?: boolean;
};

/** Centered page gutter up to 1440px — backgrounds should sit outside this wrapper. */
export function SiteContainer({
  children,
  className,
  as: Component = "div",
  narrow = false,
  ...props
}: SiteContainerProps) {
  return (
    <Component
      className={cn(
        "ms-auto me-auto w-full max-w-[100rem] ps-4 pe-4 sm:ps-6 sm:pe-6 lg:ps-10 lg:pe-10 xl:ps-14 xl:pe-14",
        narrow && "max-w-3xl",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export type SiteBandProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

/** Full-viewport-width section shell (backgrounds span edge to edge). */
export function SiteBand({ children, className, ...props }: SiteBandProps) {
  return (
    <section className={cn("w-full min-w-0", className)} {...props}>
      {children}
    </section>
  );
}
