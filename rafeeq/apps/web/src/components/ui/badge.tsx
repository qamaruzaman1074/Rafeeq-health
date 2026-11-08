import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantClass = {
  neutral: "border-teal-500 bg-sand-100 text-ink-900",
  notice: "border-teal-700 bg-amber-100 text-ink-900",
  conversation: "border-teal-700 bg-lilac-100 text-ink-900",
  positive: "border-green-600 bg-green-600 text-sand-50",
  error: "border-danger-600 bg-danger-600 text-sand-50",
} as const;

export type BadgeVariant = keyof typeof variantClass;

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border py-1 ps-3 pe-3 text-sm font-medium",
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
