import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const variantClass = {
  primary:
    "border-primary bg-primary text-primary-foreground shadow-surface-md hover:border-primary-hover hover:bg-primary-hover hover:shadow-surface-lg active:shadow-surface",
  secondary:
    "border-border-subtle bg-card text-teal-900 shadow-xs hover:border-teal-700/30 hover:bg-teal-100/80 hover:shadow-surface active:bg-card",
  ghost:
    "border-transparent bg-transparent text-teal-700 hover:border-border-subtle hover:bg-secondary/80 hover:text-teal-900",
  destructive:
    "border-destructive bg-destructive text-destructive-foreground shadow-surface hover:border-destructive hover:brightness-95",
  link: "border-transparent bg-transparent text-teal-700 underline decoration-teal-700 decoration-2 underline-offset-4 hover:text-teal-900 disabled:no-underline",
} as const;

export type ButtonVariant = keyof typeof variantClass;

const baseClass =
  "inline-flex min-h-11 min-w-11 w-full items-center justify-center gap-2 rounded-lg border ps-5 pe-5 text-base font-semibold motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto disabled:pointer-events-none disabled:translate-y-0 disabled:scale-100 disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  asChild?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", asChild = false, type, ...props },
  ref,
) {
  const classes = cn(baseClass, variantClass[variant], className);
  if (asChild) {
    return <Slot ref={ref} className={classes} {...props} />;
  }
  return <button ref={ref} type={type ?? "button"} className={classes} {...props} />;
});
