import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center px-6 py-3 uppercase transition-all disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses =
    variant === "primary"
      ? "bg-primary text-on-primary font-headline font-black tracking-widest rounded-btn shadow-wine-glow hover:shadow-wine-glow-hover active:scale-[0.98] duration-300"
      : "border border-outline-variant text-on-surface font-headline font-bold text-xs tracking-widest hover:bg-on-surface hover:text-surface";

  const widthClasses = fullWidth ? "w-full" : "";

  const classes = [baseClasses, variantClasses, widthClasses, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
