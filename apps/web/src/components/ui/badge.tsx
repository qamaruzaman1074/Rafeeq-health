import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantClass = {
  neutral: "border-border-subtle bg-sand-100 text-ink-900 shadow-xs",
  notice: "border-gold-500/40 bg-amber-100 text-ink-900 shadow-xs",
  conversation: "border-border bg-lilac-100 text-ink-900 shadow-xs",
  positive: "border-green-600 bg-green-600 text-primary-foreground shadow-xs",
  error: "border-danger-600 bg-danger-600 text-destructive-foreground shadow-xs",
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
