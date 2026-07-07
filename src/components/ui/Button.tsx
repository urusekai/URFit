import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition",
        variant === "primary" && "bg-accent text-white hover:opacity-90",
        variant === "secondary" &&
          "border border-border bg-white text-foreground hover:bg-off-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
