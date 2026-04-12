interface VintageTagProps {
  label: string;
  variant?: "wine" | "vintage";
  size?: "sm" | "md";
  className?: string;
}

export function VintageTag({
  label,
  variant = "wine",
  size = "sm",
  className,
}: VintageTagProps) {
  const variantClasses =
    variant === "wine"
      ? "bg-primary-container text-primary border border-primary/20"
      : "bg-tertiary-fixed-dim text-on-tertiary";

  const sizeClasses =
    size === "md"
      ? "px-3 py-1.5 tracking-widest"
      : "px-2 py-0.5 tracking-[0.2em]";

  const classes = [
    "inline-flex items-center text-[10px] font-headline font-black uppercase editorial-text",
    variantClasses,
    sizeClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{label}</span>;
}
