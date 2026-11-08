import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const variantClass = {
  primary: "border-teal-700 bg-teal-700 text-sand-50",
  secondary: "border-teal-700 bg-teal-100 text-teal-900",
  ghost: "border-teal-700 bg-transparent text-teal-700",
  destructive: "border-danger-600 bg-danger-600 text-sand-50",
  link: "border-transparent bg-transparent text-teal-700 underline decoration-teal-700 underline-offset-4 disabled:no-underline",
} as const;

export type ButtonVariant = keyof typeof variantClass;

const baseClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border ps-4 pe-4 text-base font-medium hover:outline hover:outline-[3px] hover:outline-offset-2 hover:outline-teal-500 disabled:pointer-events-none disabled:border-ink-600 disabled:bg-sand-100 disabled:text-ink-600";

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
