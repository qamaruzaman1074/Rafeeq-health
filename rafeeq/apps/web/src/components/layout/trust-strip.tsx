import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TrustStripItem = {
  id: string;
  label: ReactNode;
  detail?: ReactNode;
};

const columnClass = {
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export type TrustStripProps = HTMLAttributes<HTMLDivElement> & {
  items: readonly TrustStripItem[];
  heading?: ReactNode;
  columns?: keyof typeof columnClass;
};

export function TrustStrip({ items, heading, columns = 3, className, ...props }: TrustStripProps) {
  return (
    <div
      className={cn(
        "surface-elevated flex flex-col gap-4 border-teal-100 ps-5 pe-5 py-5 sm:ps-6 sm:pe-6 sm:py-6",
        className,
      )}
      {...props}
    >
      {heading !== undefined ? (
        <p className="text-eyebrow text-teal-900">{heading}</p>
      ) : (
        <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-gold-500" />
      )}
      <ul className={cn("grid gap-4", columnClass[columns])}>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-1 border-border-subtle ps-0 sm:border-s sm:ps-4"
          >
            <span className="text-base font-medium text-teal-900">{item.label}</span>
            {item.detail !== undefined ? (
              <span className="text-sm leading-relaxed text-ink-600">{item.detail}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
