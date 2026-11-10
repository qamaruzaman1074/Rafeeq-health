import type { ReactNode } from "react";
import { Link } from "react-router";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { cn } from "@/lib/utils";

export function SectionIntro({
  id,
  eyebrow,
  heading,
  body,
  className,
}: {
  id: string;
  eyebrow?: string;
  heading: string;
  body?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-3xl flex-col gap-3", className)}>
      {eyebrow !== undefined ? <p className="text-eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="text-section text-teal-900 sm:text-[1.875rem] sm:leading-tight">
        {heading}
      </h2>
      {body !== undefined ? (
        <div className="text-base leading-relaxed text-ink-600 sm:text-lg">{body}</div>
      ) : null}
    </div>
  );
}

/** Text beside a photograph; `reverse` puts the image first on large screens. */
export function MediaSplit({
  image,
  imageAlt,
  children,
  reverse = false,
}: {
  image: string;
  imageAlt: string;
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <div className={cn("flex min-w-0 flex-col gap-5", reverse && "lg:order-2")}>{children}</div>
      <div className={cn("min-w-0", reverse && "lg:order-1")}>
        <img
          src={image}
          alt={imageAlt}
          width={1600}
          height={1066}
          loading="lazy"
          decoding="async"
          className={
            image.endsWith(".svg")
              ? "media-reveal aspect-[3/2] h-auto w-full rounded-xl border border-border-subtle bg-sand-100 object-contain p-4 shadow-surface-md"
              : "media-reveal aspect-[3/2] h-auto w-full rounded-xl object-cover shadow-surface-md"
          }
        />
      </div>
    </div>
  );
}

export function StepArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="step-arrow h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export type Step = { title: string; body?: string; href?: string; action?: string };

export function NumberedSteps({
  steps,
  label,
  className,
}: {
  steps: Step[];
  label?: (n: number) => string;
  className?: string;
}) {
  return (
    <RevealStagger
      className={cn("grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {steps.map((step, index) => {
        const content = (
          <>
            <span
              aria-hidden="true"
              className="step-marker inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-base font-semibold text-primary-foreground"
            >
              {index + 1}
            </span>
            {label !== undefined ? (
              <p className="text-sm font-medium text-ink-600">{label(index + 1)}</p>
            ) : null}
            <h3 className="text-lg font-semibold text-teal-900">{step.title}</h3>
            {step.body !== undefined ? (
              <p className="text-base leading-relaxed text-ink-600">{step.body}</p>
            ) : null}
            {step.href !== undefined && step.action !== undefined ? (
              <span className="mt-auto flex items-center gap-2 pt-2 text-sm font-semibold text-teal-700">
                {step.action}
                <StepArrow />
              </span>
            ) : null}
          </>
        );
        const cardClass = "step-card relative flex h-full flex-col gap-3 rounded-xl p-6";
        return step.href !== undefined ? (
          <Link key={step.title} to={step.href} className={cardClass}>
            {content}
          </Link>
        ) : (
          <div key={step.title} className={cardClass}>
            {content}
          </div>
        );
      })}
    </RevealStagger>
  );
}

export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-ink-900">
          <span
            aria-hidden="true"
            className="mt-1.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-background" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function NoticePanel({ heading, children }: { heading?: string; children: ReactNode }) {
  return (
    <aside className="flex flex-col gap-2 rounded-xl border border-gold-500/50 bg-card p-5 sm:p-6">
      {heading !== undefined ? (
        <p className="text-base font-semibold text-teal-900">{heading}</p>
      ) : null}
      <div className="text-base leading-relaxed text-ink-900">{children}</div>
    </aside>
  );
}
