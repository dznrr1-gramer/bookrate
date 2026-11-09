import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-forest text-white shadow-sm hover:bg-forest-dark disabled:bg-forest/50",
  secondary:
    "border border-border bg-surface text-ink hover:border-sage hover:text-forest",
  ghost: "text-muted hover:bg-surface-muted hover:text-forest",
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`ui-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${buttonVariants[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
