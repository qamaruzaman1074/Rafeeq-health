import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PageHeaderProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-border-subtle pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-8",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-3">
        {eyebrow !== undefined ? <p className="text-eyebrow">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold text-teal-900 sm:text-4xl">{title}</h1>
        {description !== undefined ? (
          <p className="max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {actions !== undefined ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </header>
  );
}
