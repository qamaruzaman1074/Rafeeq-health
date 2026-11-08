import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MarketingHeroProps = HTMLAttributes<HTMLElement> & {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
};

export function MarketingHero({
  title,
  description,
  eyebrow,
  actions,
  aside,
  className,
  ...props
}: MarketingHeroProps) {
  return (
    <section
      className={cn(
        "surface-muted relative overflow-hidden ps-6 pe-6 py-10 sm:ps-10 sm:pe-10 sm:py-14 lg:ps-12 lg:pe-12 lg:py-16",
        className,
      )}
      {...props}
    >
      <HeroGradient />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
        <div className="flex flex-col gap-5 sm:gap-6">
          {eyebrow !== undefined ? <p className="text-eyebrow">{eyebrow}</p> : null}
          <h1 className="text-display text-teal-900 sm:max-w-xl">{title}</h1>
          {description !== undefined ? (
            <p className="max-w-xl text-lg leading-relaxed text-ink-600">{description}</p>
          ) : null}
          {actions !== undefined ? (
            <div className="flex flex-wrap items-center gap-3 pt-1">{actions}</div>
          ) : null}
        </div>
        {aside !== undefined ? <div className="min-w-0">{aside}</div> : null}
      </div>
    </section>
  );
}

function HeroGradient() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 end-0 h-32 w-32 rounded-full bg-teal-100 opacity-80 blur-3xl sm:h-48 sm:w-48"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 start-0 h-24 w-24 rounded-full bg-gold-500/15 blur-2xl sm:h-36 sm:w-36"
      />
    </>
  );
}
