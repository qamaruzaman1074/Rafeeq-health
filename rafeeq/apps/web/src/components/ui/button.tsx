import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const variantClass = {
  primary:
    "border-teal-700 bg-teal-700 text-sand-50 shadow-surface hover:border-teal-900 hover:bg-teal-900 active:shadow-xs",
  secondary:
    "border-border-subtle bg-teal-100 text-teal-900 shadow-xs hover:border-border hover:bg-teal-100/80",
  ghost:
    "border-transparent bg-transparent text-teal-700 hover:border-border-subtle hover:bg-teal-100/60",
  destructive:
    "border-danger-600 bg-danger-600 text-sand-50 shadow-surface hover:border-danger-600 hover:brightness-95",
  link: "border-transparent bg-transparent text-teal-700 underline decoration-teal-700 decoration-2 underline-offset-4 hover:text-teal-900 disabled:no-underline",
} as const;

export type ButtonVariant = keyof typeof variantClass;

const baseClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border ps-4 pe-4 text-base font-medium transition-[color,background-color,border-color,box-shadow] duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500 hover:focus-visible:outline-teal-700 disabled:pointer-events-none disabled:border-border disabled:bg-sand-100 disabled:text-ink-600 disabled:shadow-none";

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
