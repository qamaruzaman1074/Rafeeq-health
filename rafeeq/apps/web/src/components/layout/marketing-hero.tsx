import type { HTMLAttributes, ReactNode } from "react";
import { SiteContainer } from "@/components/layout/site-container";
import { cn } from "@/lib/utils";

export type MarketingHeroProps = HTMLAttributes<HTMLElement> & {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  brand?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
};

export function MarketingHero({
  title,
  description,
  eyebrow,
  brand,
  actions,
  aside,
  className,
  ...props
}: MarketingHeroProps) {
  return (
    <section
      className={cn(
        "relative flex w-full min-h-[min(92vh,54rem)] items-center overflow-hidden border-b border-border-subtle/80 bg-gradient-to-b from-secondary/45 via-background to-background py-12 sm:py-16 lg:py-20",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <HeroGradient />
      </div>
      <SiteContainer className="relative z-10 w-full">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14 xl:gap-20">
          <div className="flex min-w-0 flex-col gap-5 sm:gap-6">
            {brand !== undefined ? <div>{brand}</div> : null}
            {eyebrow !== undefined ? (
              <p className="text-eyebrow motion-text-reveal motion-delay-1">{eyebrow}</p>
            ) : null}
            <h1 className="motion-display-settle motion-delay-2 max-w-2xl text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-teal-900 sm:text-4xl lg:text-[2.875rem] xl:text-5xl xl:leading-[1.08]">
              {title}
            </h1>
            {description !== undefined ? (
              <div className="max-w-xl text-lg leading-relaxed text-secondary-foreground">
                {description}
              </div>
            ) : null}
            {actions !== undefined ? (
              <div className="motion-text-reveal motion-delay-3 flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                {actions}
              </div>
            ) : null}
          </div>
          {aside !== undefined ? (
            <div className="min-w-0 w-full lg:ps-2 xl:ps-6">{aside}</div>
          ) : null}
        </div>
      </SiteContainer>
    </section>
  );
}

function HeroGradient() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 end-[-10%] h-64 w-64 rounded-full bg-teal-100/90 blur-3xl sm:h-96 sm:w-96"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-20%] start-[-5%] h-56 w-56 rounded-full bg-gold-500/25 blur-3xl sm:h-72 sm:w-72"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--pale-teal)_0%,transparent_55%)] opacity-70"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}
