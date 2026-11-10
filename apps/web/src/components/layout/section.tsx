import type { HTMLAttributes, ReactNode } from "react";
import { RevealSection } from "@/components/motion/reveal-section";
import { SiteBand, SiteContainer } from "@/components/layout/site-container";
import { cn } from "@/lib/utils";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Wider content on large screens when true */
  wide?: boolean;
  /** Scroll-reveal animation for section content */
  reveal?: boolean;
};

export function Section({
  children,
  className,
  wide = false,
  reveal = true,
  ...props
}: SectionProps) {
  const inner = <div className="flex w-full flex-col gap-6 sm:gap-8 lg:gap-10">{children}</div>;

  return (
    <SiteBand className={cn("w-full py-12 sm:py-16 lg:py-20", className)} {...props}>
      <SiteContainer narrow={!wide} className="w-full">
        {reveal ? <RevealSection>{inner}</RevealSection> : inner}
      </SiteContainer>
    </SiteBand>
  );
}
