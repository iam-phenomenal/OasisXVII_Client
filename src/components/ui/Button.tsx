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
    "inline-flex items-center justify-center px-6 py-3 uppercase disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  const variantClasses =
    variant === "primary"
      ? "bg-primary text-on-primary font-headline font-black tracking-widest rounded-btn shadow-wine-glow hover:shadow-wine-glow-hover active:scale-[0.98] transition-[box-shadow,transform,opacity] duration-300"
      : "border border-outline-variant text-on-surface font-headline font-bold text-xs tracking-widest hover:bg-on-surface hover:text-surface transition-[color,background-color,opacity] duration-300";

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
